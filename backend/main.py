"""WorkHere ATS - FastAPI Backend"""
import asyncpg, json, os, uuid
from datetime import date, datetime, time
from typing import Optional, List
from fastapi import FastAPI, HTTPException, Query
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from pydantic import BaseModel

DB_URL = os.getenv("DATABASE_URL", "postgresql://workhere:workhere_secret@localhost/workhere_db")

app = FastAPI(title="WorkHere ATS API", version="1.0.0")
pool: asyncpg.Pool = None

# ===== DB Connection =====
@app.on_event("startup")
async def startup():
    global pool
    pool = await asyncpg.create_pool(DB_URL, min_size=2, max_size=10)

@app.on_event("shutdown")
async def shutdown():
    if pool: await pool.close()

def row_to_dict(row):
    if row is None: return None
    d = dict(row)
    for k, v in d.items():
        if isinstance(v, uuid.UUID): d[k] = str(v)
        elif isinstance(v, (datetime, date)): d[k] = v.isoformat()
        elif isinstance(v, time): d[k] = v.strftime('%H:%M')
    return d

def rows_to_list(rows):
    return [row_to_dict(r) for r in rows]

# ===== Health =====
@app.get("/api/health")
async def health():
    async with pool.acquire() as conn:
        v = await conn.fetchval("SELECT version()")
    return {"status": "ok", "db": v}

# ===== Departments =====
@app.get("/api/departments")
async def list_departments():
    async with pool.acquire() as conn:
        rows = await conn.fetch("SELECT * FROM departments ORDER BY name")
    return rows_to_list(rows)

# ===== Users =====
@app.get("/api/users")
async def list_users():
    async with pool.acquire() as conn:
        rows = await conn.fetch("SELECT id, first_name, last_name, email, role, phone, telegram FROM users ORDER BY first_name")
    return rows_to_list(rows)

@app.get("/api/users/me")
async def get_current_user():
    async with pool.acquire() as conn:
        row = await conn.fetchrow("SELECT id, first_name, last_name, email, role, phone, telegram FROM users WHERE role='recruiter' LIMIT 1")
    return row_to_dict(row)

# ===== Pipeline Stages =====
@app.get("/api/pipeline-stages")
async def list_pipeline_stages(vacancy_id: Optional[str] = None):
    async with pool.acquire() as conn:
        if vacancy_id:
            rows = await conn.fetch("SELECT * FROM pipeline_stages WHERE vacancy_id=$1 ORDER BY order_index", uuid.UUID(vacancy_id))
            if not rows:
                rows = await conn.fetch("SELECT * FROM pipeline_stages WHERE vacancy_id IS NULL ORDER BY order_index")
        else:
            rows = await conn.fetch("SELECT * FROM pipeline_stages WHERE vacancy_id IS NULL ORDER BY order_index")
    return rows_to_list(rows)

# ===== Vacancies =====
class VacancyCreate(BaseModel):
    title: str
    department_id: Optional[str] = None
    manager_id: Optional[str] = None
    status: str = "active"
    priority: str = "medium"
    urgent: bool = False
    salary_min: Optional[int] = None
    salary_max: Optional[int] = None
    location: Optional[str] = None
    work_format: str = "hybrid"
    description: Optional[str] = None
    requirements: List[str] = []
    nice_to_have: List[str] = []
    deadline: Optional[str] = None

@app.get("/api/vacancies")
async def list_vacancies(status: Optional[str] = None):
    async with pool.acquire() as conn:
        q = """SELECT v.*, d.name as department_name, d.color as department_color,
               u.first_name as manager_first_name, u.last_name as manager_last_name, u.role as manager_role,
               (SELECT count(*) FROM applications a WHERE a.vacancy_id=v.id AND a.status='active') as candidates_count
               FROM vacancies v 
               LEFT JOIN departments d ON v.department_id=d.id 
               LEFT JOIN users u ON v.manager_id=u.id"""
        if status: q += f" WHERE v.status='{status}'"
        q += " ORDER BY v.created_at DESC"
        rows = await conn.fetch(q)
    result = []
    for r in rows:
        d = row_to_dict(r)
        # Get stage counts
        async with pool.acquire() as conn:
            stage_rows = await conn.fetch("SELECT stage, count(*) as cnt FROM applications WHERE vacancy_id=$1 AND status='active' GROUP BY stage", uuid.UUID(d['id']))
        stages = {}
        for sr in stage_rows: stages[sr['stage']] = sr['cnt']
        d['stages'] = stages
        result.append(d)
    return result

@app.get("/api/vacancies/{vacancy_id}")
async def get_vacancy(vacancy_id: str):
    async with pool.acquire() as conn:
        row = await conn.fetchrow("""SELECT v.*, d.name as department_name, d.color as department_color,
            u.first_name as manager_first_name, u.last_name as manager_last_name, u.role as manager_role
            FROM vacancies v LEFT JOIN departments d ON v.department_id=d.id LEFT JOIN users u ON v.manager_id=u.id
            WHERE v.id=$1""", uuid.UUID(vacancy_id))
    if not row: raise HTTPException(404, "Vacancy not found")
    return row_to_dict(row)

@app.post("/api/vacancies")
async def create_vacancy(data: VacancyCreate):
    org_id = uuid.UUID("00000000-0000-0000-0000-000000000001")
    async with pool.acquire() as conn:
        row = await conn.fetchrow("""INSERT INTO vacancies (organization_id, title, department_id, manager_id, status, priority, urgent, salary_min, salary_max, location, work_format, description, requirements, nice_to_have, deadline)
            VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15) RETURNING *""",
            org_id, data.title,
            uuid.UUID(data.department_id) if data.department_id else None,
            uuid.UUID(data.manager_id) if data.manager_id else None,
            data.status, data.priority, data.urgent, data.salary_min, data.salary_max,
            data.location, data.work_format, data.description,
            json.dumps(data.requirements), json.dumps(data.nice_to_have),
            date.fromisoformat(data.deadline) if data.deadline else None)
    return row_to_dict(row)

# ===== Candidates (with applications joined) =====
class CandidateCreate(BaseModel):
    first_name: str
    last_name: str
    email: Optional[str] = None
    phone: Optional[str] = None
    vacancy_id: Optional[str] = None
    source: str = "direct"
    salary_expectation: Optional[str] = None
    notes: Optional[str] = None

@app.get("/api/candidates")
async def list_candidates(vacancy_id: Optional[str]=None, stage: Optional[str]=None, source: Optional[str]=None, search: Optional[str]=None):
    async with pool.acquire() as conn:
        q = """SELECT c.*, a.id as application_id, a.vacancy_id, a.stage, a.status as app_status, a.urgent, a.rating, a.next_step, a.next_step_due, a.days_in_stage,
               v.title as vacancy_title
               FROM candidates c
               LEFT JOIN applications a ON c.id=a.candidate_id
               LEFT JOIN vacancies v ON a.vacancy_id=v.id
               WHERE 1=1"""
        params = []
        n = 0
        if vacancy_id:
            n += 1; q += f" AND a.vacancy_id=${n}"; params.append(uuid.UUID(vacancy_id))
        if stage:
            n += 1; q += f" AND a.stage=${n}"; params.append(stage)
        if source:
            n += 1; q += f" AND c.source=${n}"; params.append(source)
        if search:
            n += 1; q += f" AND (c.first_name ILIKE ${n} OR c.last_name ILIKE ${n} OR c.email ILIKE ${n})"; params.append(f"%{search}%")
        q += " ORDER BY a.days_in_stage DESC NULLS LAST, c.created_at DESC"
        rows = await conn.fetch(q, *params)
    return rows_to_list(rows)

@app.get("/api/candidates/{candidate_id}")
async def get_candidate(candidate_id: str):
    async with pool.acquire() as conn:
        row = await conn.fetchrow("""SELECT c.*, a.id as application_id, a.vacancy_id, a.stage, a.status as app_status, a.urgent, a.rating, a.next_step, a.next_step_due, a.days_in_stage,
            v.title as vacancy_title FROM candidates c
            LEFT JOIN applications a ON c.id=a.candidate_id
            LEFT JOIN vacancies v ON a.vacancy_id=v.id WHERE c.id=$1""", uuid.UUID(candidate_id))
    if not row: raise HTTPException(404, "Candidate not found")
    d = row_to_dict(row)
    # Get feedbacks
    async with pool.acquire() as conn:
        fb_rows = await conn.fetch("""SELECT f.*, u.first_name, u.last_name, u.role FROM feedbacks f
            LEFT JOIN users u ON f.user_id=u.id WHERE f.application_id=$1 ORDER BY f.submitted_at DESC""",
            uuid.UUID(d['application_id']) if d.get('application_id') else uuid.UUID('00000000-0000-0000-0000-000000000000'))
        note_rows = await conn.fetch("SELECT n.*, u.first_name as author_first, u.last_name as author_last FROM notes n LEFT JOIN users u ON n.user_id=u.id WHERE n.candidate_id=$1 ORDER BY n.created_at DESC", uuid.UUID(candidate_id))
    d['feedbacks'] = rows_to_list(fb_rows)
    d['notes'] = rows_to_list(note_rows)
    return d

@app.post("/api/candidates")
async def create_candidate(data: CandidateCreate):
    org_id = uuid.UUID("00000000-0000-0000-0000-000000000001")
    user_id = uuid.UUID("a0000001-0000-0000-0000-000000000001")
    async with pool.acquire() as conn:
        row = await conn.fetchrow("""INSERT INTO candidates (organization_id, first_name, last_name, email, phone, source, salary_expectation, created_by)
            VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *""",
            org_id, data.first_name, data.last_name, data.email, data.phone, data.source, data.salary_expectation, user_id)
        cid = row['id']
        if data.vacancy_id:
            await conn.execute("""INSERT INTO applications (candidate_id, vacancy_id, stage, status) VALUES ($1,$2,'new','active')""",
                cid, uuid.UUID(data.vacancy_id))
        if data.notes:
            await conn.execute("INSERT INTO notes (candidate_id, user_id, content) VALUES ($1,$2,$3)", cid, user_id, data.notes)
    return row_to_dict(row)

# ===== Move Stage =====
class MoveStageRequest(BaseModel):
    stage: str
    comment: Optional[str] = None

@app.post("/api/candidates/{candidate_id}/move-stage")
async def move_stage(candidate_id: str, data: MoveStageRequest):
    user_id = uuid.UUID("a0000001-0000-0000-0000-000000000001")
    async with pool.acquire() as conn:
        app_row = await conn.fetchrow("SELECT * FROM applications WHERE candidate_id=$1 AND status='active'", uuid.UUID(candidate_id))
        if not app_row: raise HTTPException(404, "No active application")
        old_stage = app_row['stage']
        await conn.execute("UPDATE applications SET stage=$1, days_in_stage=0, stage_entered_at=NOW(), updated_at=NOW() WHERE id=$2", data.stage, app_row['id'])
        await conn.execute("INSERT INTO activity_log (organization_id, user_id, entity_type, entity_id, action, details) VALUES ($1,$2,'candidate',$3,'stage_change',$4)",
            uuid.UUID("00000000-0000-0000-0000-000000000001"), user_id, uuid.UUID(candidate_id),
            json.dumps({"old": old_stage, "new": data.stage, "comment": data.comment}))
    return {"ok": True, "old_stage": old_stage, "new_stage": data.stage}

# ===== Bulk Move =====
class BulkMoveRequest(BaseModel):
    candidate_ids: List[str]
    stage: str

@app.post("/api/candidates/bulk-move")
async def bulk_move(data: BulkMoveRequest):
    count = 0
    async with pool.acquire() as conn:
        for cid in data.candidate_ids:
            result = await conn.execute("UPDATE applications SET stage=$1, days_in_stage=0, updated_at=NOW() WHERE candidate_id=$2 AND status='active'", data.stage, uuid.UUID(cid))
            if result: count += 1
    return {"ok": True, "moved": count}

# ===== Bulk Reject =====
class BulkRejectRequest(BaseModel):
    candidate_ids: List[str]
    reason: Optional[str] = None

@app.post("/api/candidates/bulk-reject")
async def bulk_reject(data: BulkRejectRequest):
    async with pool.acquire() as conn:
        for cid in data.candidate_ids:
            await conn.execute("UPDATE applications SET stage='rejected', status='rejected', rejection_reason=$1, rejected_at=NOW(), updated_at=NOW() WHERE candidate_id=$2 AND status='active'",
                data.reason, uuid.UUID(cid))
    return {"ok": True, "rejected": len(data.candidate_ids)}

# ===== Reject Candidate =====
class RejectRequest(BaseModel):
    reason: str
    details: Optional[str] = None
    add_to_pool: bool = False

@app.post("/api/candidates/{candidate_id}/reject")
async def reject_candidate(candidate_id: str, data: RejectRequest):
    cid = uuid.UUID(candidate_id)
    async with pool.acquire() as conn:
        await conn.execute("UPDATE applications SET stage='rejected', status='rejected', rejection_reason=$1, rejection_details=$2, rejected_at=NOW() WHERE candidate_id=$3 AND status='active'",
            data.reason, data.details, cid)
        if data.add_to_pool:
            await conn.execute("UPDATE candidates SET in_talent_pool=true, talent_pool_reason=$1 WHERE id=$2", data.details or data.reason, cid)
    return {"ok": True}

# ===== Interviews =====
class InterviewCreate(BaseModel):
    candidate_id: str
    interview_type: str
    date: str
    time: str
    duration: int = 60
    format: str = "online"
    interviewers: List[str] = []
    notes: Optional[str] = None

@app.get("/api/interviews")
async def list_interviews():
    async with pool.acquire() as conn:
        rows = await conn.fetch("""SELECT i.*, c.first_name, c.last_name, v.title as vacancy_title
            FROM interviews i 
            LEFT JOIN candidates c ON i.candidate_id=c.id 
            LEFT JOIN vacancies v ON i.vacancy_id=v.id
            ORDER BY i.scheduled_date, i.scheduled_time""")
    result = []
    for r in rows:
        d = row_to_dict(r)
        async with pool.acquire() as conn:
            parts = await conn.fetch("SELECT u.id, u.first_name, u.last_name, u.role FROM interview_participants ip JOIN users u ON ip.user_id=u.id WHERE ip.interview_id=$1", uuid.UUID(d['id']))
        d['interviewers'] = rows_to_list(parts)
        result.append(d)
    return result

@app.post("/api/interviews")
async def create_interview(data: InterviewCreate):
    user_id = uuid.UUID("a0000001-0000-0000-0000-000000000001")
    cid = uuid.UUID(data.candidate_id)
    async with pool.acquire() as conn:
        app_row = await conn.fetchrow("SELECT id, vacancy_id FROM applications WHERE candidate_id=$1 AND status='active'", cid)
        if not app_row: raise HTTPException(404, "No active application")
        row = await conn.fetchrow("""INSERT INTO interviews (application_id, candidate_id, vacancy_id, interview_type, scheduled_date, scheduled_time, duration_minutes, format, notes, created_by)
            VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING *""",
            app_row['id'], cid, app_row['vacancy_id'], data.interview_type,
            date.fromisoformat(data.date), time.fromisoformat(data.time),
            data.duration, data.format, data.notes, user_id)
        iid = row['id']
        for uid in data.interviewers:
            await conn.execute("INSERT INTO interview_participants (interview_id, user_id) VALUES ($1,$2)", iid, uuid.UUID(uid))
    return row_to_dict(row)

# ===== Feedbacks =====
class FeedbackCreate(BaseModel):
    candidate_id: str
    rating: int
    recommendation: str
    strengths: Optional[str] = None
    weaknesses: Optional[str] = None
    comment: Optional[str] = None

@app.post("/api/feedbacks")
async def create_feedback(data: FeedbackCreate):
    user_id = uuid.UUID("a0000001-0000-0000-0000-000000000001")
    async with pool.acquire() as conn:
        app_row = await conn.fetchrow("SELECT id FROM applications WHERE candidate_id=$1 AND status='active'", uuid.UUID(data.candidate_id))
        if not app_row: raise HTTPException(404, "No active application")
        row = await conn.fetchrow("""INSERT INTO feedbacks (application_id, user_id, rating, recommendation, strengths, weaknesses, comment)
            VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *""",
            app_row['id'], user_id, data.rating, data.recommendation, data.strengths, data.weaknesses, data.comment)
    return row_to_dict(row)

# ===== Notes =====
class NoteCreate(BaseModel):
    content: str

@app.post("/api/candidates/{candidate_id}/notes")
async def create_note(candidate_id: str, data: NoteCreate):
    user_id = uuid.UUID("a0000001-0000-0000-0000-000000000001")
    async with pool.acquire() as conn:
        row = await conn.fetchrow("INSERT INTO notes (candidate_id, user_id, content) VALUES ($1,$2,$3) RETURNING *",
            uuid.UUID(candidate_id), user_id, data.content)
    return row_to_dict(row)

# ===== Offers =====
class OfferCreate(BaseModel):
    candidate_id: str
    salary: str
    bonus: Optional[str] = None
    start_date: Optional[str] = None
    work_format: str = "hybrid"
    benefits: Optional[str] = None
    expiry_date: Optional[str] = None

@app.get("/api/offers")
async def list_offers():
    async with pool.acquire() as conn:
        rows = await conn.fetch("""SELECT o.*, c.first_name, c.last_name, v.title as vacancy_title
            FROM offers o LEFT JOIN candidates c ON o.candidate_id=c.id LEFT JOIN vacancies v ON o.vacancy_id=v.id
            ORDER BY o.created_at DESC""")
    return rows_to_list(rows)

@app.post("/api/offers")
async def create_offer(data: OfferCreate):
    user_id = uuid.UUID("a0000001-0000-0000-0000-000000000001")
    cid = uuid.UUID(data.candidate_id)
    async with pool.acquire() as conn:
        app_row = await conn.fetchrow("SELECT id, vacancy_id FROM applications WHERE candidate_id=$1 AND status='active'", cid)
        if not app_row: raise HTTPException(404, "No active application")
        row = await conn.fetchrow("""INSERT INTO offers (application_id, candidate_id, vacancy_id, salary, bonus, start_date, work_format, benefits, expiry_date, created_by)
            VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING *""",
            app_row['id'], cid, app_row['vacancy_id'], data.salary, data.bonus,
            date.fromisoformat(data.start_date) if data.start_date else None,
            data.work_format, data.benefits,
            date.fromisoformat(data.expiry_date) if data.expiry_date else None, user_id)
    return row_to_dict(row)

@app.post("/api/offers/{offer_id}/status")
async def update_offer_status(offer_id: str, status: str = Query(...)):
    async with pool.acquire() as conn:
        await conn.execute("UPDATE offers SET status=$1 WHERE id=$2", status, uuid.UUID(offer_id))
    return {"ok": True, "status": status}

# ===== Activity Log =====
@app.get("/api/activity")
async def list_activity(limit: int = 20):
    async with pool.acquire() as conn:
        rows = await conn.fetch("""SELECT al.*, u.first_name, u.last_name FROM activity_log al
            LEFT JOIN users u ON al.user_id=u.id ORDER BY al.created_at DESC LIMIT $1""", limit)
    return rows_to_list(rows)

# ===== Analytics =====
@app.get("/api/analytics/funnel")
async def analytics_funnel():
    async with pool.acquire() as conn:
        rows = await conn.fetch("SELECT stage, count(*) as cnt FROM applications GROUP BY stage ORDER BY count(*) DESC")
    return rows_to_list(rows)

@app.get("/api/analytics/sources")
async def analytics_sources():
    async with pool.acquire() as conn:
        rows = await conn.fetch("""SELECT c.source, count(*) as total,
            count(*) FILTER (WHERE a.stage='hired') as hired
            FROM candidates c LEFT JOIN applications a ON c.id=a.candidate_id
            GROUP BY c.source ORDER BY total DESC""")
    return rows_to_list(rows)

# ===== Serve Frontend =====
FRONTEND_DIR = "/opt/workhere/frontend"
if os.path.exists(FRONTEND_DIR):
    app.mount("/static", StaticFiles(directory=FRONTEND_DIR), name="static")
    
    @app.get("/")
    async def serve_index():
        return FileResponse(os.path.join(FRONTEND_DIR, "index.html"))
    
    @app.get("/{path:path}")
    async def serve_frontend(path: str):
        # Try static file first, then index.html
        fp = os.path.join(FRONTEND_DIR, path)
        if os.path.isfile(fp):
            return FileResponse(fp)
        return FileResponse(os.path.join(FRONTEND_DIR, "index.html"))
