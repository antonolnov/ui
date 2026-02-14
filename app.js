// ===== WorkHere ATS - Complete Rewrite =====

// ===== Icon Helper =====
function ic(name, cls) {
    return `<svg class="icon${cls ? ' ' + cls : ''}"><use href="#i-${name}"/></svg>`;
}

// ===== Avatar Helper (initials-based, no external images) =====
const AVA_COLORS = ['#6366f1','#8b5cf6','#ec4899','#f43f5e','#f97316','#eab308','#22c55e','#14b8a6','#06b6d4','#3b82f6'];
function ava(name, size) {
    size = size || 36;
    const initials = (name || '?').split(' ').map(w => w[0] || '').join('').substring(0, 2).toUpperCase();
    const idx = ((name || '').charCodeAt(0) + ((name || '').charCodeAt(1) || 0)) % AVA_COLORS.length;
    return `<div class="avatar" style="width:${size}px;height:${size}px;background:${AVA_COLORS[idx]};font-size:${Math.round(size * 0.38)}px">${initials}</div>`;
}

// ===== State =====
let currentPage = 'dashboard';
let selectedVacancyId = null;
let selectedCandidateId = null;
let draggedCandidateId = null;

// ===== Init =====
document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    initNavigation();
    initModals();
    initPanels();
    initForms();
    renderSidebarUser();
    renderDashboard();
});

function renderSidebarUser() {
    document.getElementById('sidebarUser').innerHTML = `${ava('Мария Иванова', 36)}<div><div class="user-name">Мария Иванова</div><div class="user-role">Рекрутер</div></div>`;
}

// ===== Theme =====
function initTheme() {
    const saved = localStorage.getItem('wh-theme');
    const prefer = window.matchMedia('(prefers-color-scheme: dark)').matches;
    applyTheme(saved || (prefer ? 'dark' : 'light'));
}
function applyTheme(t) {
    document.documentElement.setAttribute('data-theme', t);
    localStorage.setItem('wh-theme', t);
    const el = document.getElementById('themeIcon');
    if (el) el.innerHTML = `<use href="#i-${t === 'dark' ? 'sun' : 'moon'}"/>`;
}
document.getElementById('themeToggle').addEventListener('click', () => {
    applyTheme(document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark');
});

// ===== Navigation =====
function initNavigation() {
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', () => navigateTo(item.dataset.page));
    });
    const mt = document.getElementById('menuToggle');
    if (mt) mt.addEventListener('click', () => document.getElementById('sidebar').classList.toggle('active'));
}

function navigateTo(page) {
    currentPage = page;
    document.querySelectorAll('.nav-item').forEach(i => i.classList.toggle('active', i.dataset.page === page));
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.getElementById(`${page}-page`).classList.add('active');
    const renderers = { dashboard: renderDashboard, vacancies: renderVacancies, candidates: renderCandidates, pipeline: renderPipeline, interviews: renderInterviews, 'talent-pool': renderTalentPool, offers: renderOffers, analytics: renderAnalytics, settings: renderSettings };
    if (renderers[page]) renderers[page]();
    document.getElementById('sidebar').classList.remove('active');
}

// ===== Dashboard =====
function renderDashboard() {
    const page = document.getElementById('dashboard-page');
    const dateStr = new Date().toLocaleDateString('ru-RU', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    const av = vacancies.filter(v => v.status === 'active').length;
    const tc = candidates.length;
    const ti = interviews.filter(i => i.date === '2025-01-27').length;
    const po = offers.filter(o => o.status === 'pending' || o.status === 'sent').length;

    page.innerHTML = `
        <div class="dashboard-header"><h1>Доброе утро, Мария!</h1><p>${dateStr}</p></div>
        <div class="stats-grid">
            <div class="stat-card" onclick="navigateTo('vacancies')"><div class="stat-icon primary">${ic('clipboard')}</div><div class="stat-value">${av}</div><div class="stat-label">Активных вакансий</div><div class="stat-change positive">${ic('arrow-up','icon-sm')} +2 за неделю</div></div>
            <div class="stat-card" onclick="navigateTo('candidates')"><div class="stat-icon success">${ic('users')}</div><div class="stat-value">${tc}</div><div class="stat-label">Кандидатов в работе</div><div class="stat-change positive">${ic('arrow-up','icon-sm')} +18 за неделю</div></div>
            <div class="stat-card" onclick="navigateTo('interviews')"><div class="stat-icon warning">${ic('calendar')}</div><div class="stat-value">${ti}</div><div class="stat-label">Интервью сегодня</div></div>
            <div class="stat-card" onclick="navigateTo('offers')"><div class="stat-icon danger">${ic('file-text')}</div><div class="stat-value">${po}</div><div class="stat-label">Ожидают оффер</div></div>
        </div>
        <div class="dashboard-grid">
            <div class="card"><div class="card-header"><h3>${ic('flame')} Приоритеты на сегодня</h3><span class="text-muted">${priorityTasks.length} задач</span></div><div class="card-body"><div class="priority-list">${priorityTasks.map(t => `
                <div class="priority-item ${t.type}" onclick="${t.candidateId ? `openCandidateModal(${t.candidateId})` : ''}">
                    <div class="priority-icon ${t.iconClass}">${ic(t.icon === 'fa-fire' ? 'flame' : t.icon === 'fa-clock' ? 'clock' : t.icon === 'fa-comment-dots' ? 'message-circle' : t.icon === 'fa-calendar' ? 'calendar' : t.icon === 'fa-user-clock' ? 'clock' : 'inbox')}</div>
                    <div class="priority-content"><div class="priority-title">${t.title}</div><div class="priority-meta"><span>${t.description}</span>${t.meta.deadline ? `<span class="text-danger">${t.meta.deadline}</span>` : ''}</div></div>
                    <div class="priority-action"><button class="btn btn-sm btn-outline">${ic('arrow-right')}</button></div>
                </div>`).join('')}</div></div></div>
            <div class="card"><div class="card-header"><h3>${ic('activity')} Последняя активность</h3></div><div class="card-body"><div class="activity-list">${activityFeed.map(a => `
                <div class="activity-item">${ava(a.action.includes('перевела') ? 'Мария Иванова' : a.action.includes('оставил') ? 'Алексей Петров' : a.action.includes('назначила') ? 'Ольга Смирнова' : a.action.includes('добавила') ? 'Мария Иванова' : 'Дмитрий Козлов', 30)}
                    <div class="activity-content"><div class="activity-text"><strong>${a.action}</strong>: ${a.target}</div><div class="activity-time">${formatTime(a.timestamp)}</div></div>
                </div>`).join('')}</div></div></div>
        </div>
        <div class="dashboard-grid mt-4">
            <div class="card"><div class="card-header"><h3>${ic('calendar')} Интервью сегодня</h3><button class="btn btn-sm btn-outline" onclick="navigateTo('interviews')">Все интервью</button></div><div class="card-body">
                ${interviews.filter(i => i.date === '2025-01-27').length === 0 ? '<p class="text-muted">Нет интервью на сегодня</p>' :
                `<div style="display:flex;flex-direction:column;gap:10px">${interviews.filter(i => i.date === '2025-01-27').sort((a,b) => a.time.localeCompare(b.time)).map(iv => {
                    const c = candidates.find(x => x.id === iv.candidateId);
                    const v = vacancies.find(x => x.id === iv.vacancyId);
                    const ivrs = iv.interviewers.map(id => hiringManagers.find(m => m.id === id));
                    return `<div class="priority-item info" style="cursor:pointer" onclick="openCandidateModal(${c.id})">
                        <div style="min-width:50px;text-align:center;font-weight:700;font-size:1rem;color:var(--primary)">${iv.time}</div>
                        <div class="priority-content">
                            <div class="priority-title">${c.firstName} ${c.lastName}</div>
                            <div class="priority-meta"><span>${getInterviewTypeLabel(iv.type)}</span><span>${v.title}</span><span>${getFormatLabel(iv.format)}</span></div>
                        </div>
                        <div style="display:flex;gap:-4px">${ivrs.map(i => ava(i.name, 24)).join('')}</div>
                    </div>`;
                }).join('')}</div>`}
            </div></div>
            <div class="card"><div class="card-header"><h3>${ic('alert-triangle')} Требуют внимания</h3></div><div class="card-body"><div class="stats-grid" style="grid-template-columns:1fr 1fr">
                <div class="stat-card"><div class="stat-value text-danger">${candidates.filter(c => c.urgent).length}</div><div class="stat-label">Срочные кандидаты</div></div>
                <div class="stat-card"><div class="stat-value text-warning">${candidates.filter(c => !c.nextStep && c.stage !== 'rejected' && c.stage !== 'hired').length}</div><div class="stat-label">Без следующего шага</div></div>
                <div class="stat-card"><div class="stat-value text-warning">3</div><div class="stat-label">Ждут фидбек 3+ дня</div></div>
                <div class="stat-card" style="cursor:pointer" onclick="navigateTo('candidates');setTimeout(()=>{document.getElementById('stageFilter').value='new';filterCandidates()},100)"><div class="stat-value text-primary">${candidates.filter(c => c.stage === 'new').length}</div><div class="stat-label">Новых откликов → Разобрать</div></div>
            </div></div></div>
        </div>`;
}

// ===== Vacancies =====
function renderVacancies() {
    const page = document.getElementById('vacancies-page');
    page.innerHTML = `
        <div class="page-header"><h1>Вакансии</h1><div class="page-actions"><button class="btn btn-primary" onclick="openCreateVacancyModal()">${ic('plus')} Новая вакансия</button></div></div>
        <div class="vacancies-filters">
            <button class="filter-btn active" data-filter="all">Все (${vacancies.length})</button>
            <button class="filter-btn" data-filter="active">Активные (${vacancies.filter(v => v.status === 'active').length})</button>
            <button class="filter-btn" data-filter="urgent">Срочные (${vacancies.filter(v => v.urgent).length})</button>
            <button class="filter-btn" data-filter="paused">На паузе (${vacancies.filter(v => v.status === 'paused').length})</button>
            <button class="filter-btn" data-filter="closed">Закрытые (${vacancies.filter(v => v.status === 'closed').length})</button>
        </div>
        <div class="vacancies-grid" id="vacanciesGrid">${renderVacancyCards(vacancies)}</div>`;
    page.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            page.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const f = btn.dataset.filter;
            let list = vacancies;
            if (f === 'active') list = vacancies.filter(v => v.status === 'active');
            else if (f === 'urgent') list = vacancies.filter(v => v.urgent);
            else if (f === 'paused') list = vacancies.filter(v => v.status === 'paused');
            else if (f === 'closed') list = vacancies.filter(v => v.status === 'closed');
            document.getElementById('vacanciesGrid').innerHTML = renderVacancyCards(list);
        });
    });
}

function renderVacancyCards(list) {
    return list.map(v => {
        const mgr = hiringManagers.find(m => m.id === v.managerId);
        const dept = departments.find(d => d.id === v.department);
        const total = Object.values(v.stages).reduce((a, b) => a + b, 0);
        return `<div class="vacancy-card ${v.urgent ? 'urgent' : ''} ${v.priority === 'high' ? 'priority' : ''}" onclick="openVacancyModal(${v.id})">
            <div class="vacancy-header"><div><div class="vacancy-title">${v.title}</div><div class="vacancy-department">${dept.name} · ${v.location}</div></div><span class="vacancy-status ${v.status}">${getStatusLabel(v.status)}</span></div>
            <div class="vacancy-stats"><div><span class="vacancy-stat-value">${v.candidatesCount}</span><div class="vacancy-stat-label">Кандидатов</div></div><div><span class="vacancy-stat-value">${v.stages.interview + v.stages.technical + v.stages.final}</span><div class="vacancy-stat-label">На интервью</div></div><div><span class="vacancy-stat-value">${v.stages.offer}</span><div class="vacancy-stat-label">Офферы</div></div></div>
            <div class="vacancy-funnel">${pipelineStages.slice(0, -1).map(s => { const c = v.stages[s.id] || 0; const p = total > 0 ? (c / total * 100) : 0; return `<div class="funnel-stage"><div class="fill" style="width:${p}%;background:${s.color}"></div></div>`; }).join('')}</div>
            <div class="vacancy-footer"><div class="vacancy-manager">${ava(mgr.name, 20)}<span>${mgr.name}</span></div><span>${formatDate(v.deadline)}</span></div>
        </div>`;
    }).join('');
}

function getStatusLabel(s) { return { active: 'Активна', paused: 'На паузе', closed: 'Закрыта' }[s] || s; }

function openVacancyModal(id) {
    const v = vacancies.find(x => x.id === id); if (!v) return;
    selectedVacancyId = id;
    const mgr = hiringManagers.find(m => m.id === v.managerId);
    const dept = departments.find(d => d.id === v.department);
    document.getElementById('vacancyModalTitle').textContent = v.title;
    document.getElementById('vacancyModalBody').innerHTML = `
        <div><div class="form-row mb-4"><div><span class="vacancy-status ${v.status}">${getStatusLabel(v.status)}</span>${v.urgent ? `<span class="stage-badge" style="background:var(--danger-light);color:var(--danger);margin-left:8px">Срочная</span>` : ''}</div><div class="text-muted">Создана: ${formatDate(v.createdAt)} · Дедлайн: ${formatDate(v.deadline)}</div></div>
        <div class="stats-grid mb-4"><div class="stat-card"><div class="stat-value">${v.candidatesCount}</div><div class="stat-label">Кандидатов</div></div><div class="stat-card"><div class="stat-value">${v.stages.offer}</div><div class="stat-label">На оффере</div></div><div class="stat-card"><div class="stat-value">${formatSalary(v.salary)}</div><div class="stat-label">Зарплата</div></div></div>
        <h4>Описание</h4><p class="mb-4">${v.description}</p>
        <h4>Требования</h4><ul class="mb-4">${v.requirements.map(r => `<li>${r}</li>`).join('')}</ul>
        <h4>Желательно</h4><ul class="mb-4">${v.niceToHave.map(r => `<li>${r}</li>`).join('')}</ul>
        <h4>Менеджер</h4><div class="vacancy-manager mb-4" style="gap:12px">${ava(mgr.name, 40)}<div><div style="font-weight:500">${mgr.name}</div><div class="text-muted">${mgr.role}, ${dept.name}</div></div></div>
        <h4>Воронка</h4><div class="funnel-chart">${pipelineStages.map(s => { const c = v.stages[s.id] || 0; const max = Math.max(...Object.values(v.stages)); const p = max > 0 ? (c / max * 100) : 0; return `<div class="funnel-stage-row"><div class="funnel-stage-label">${s.name}</div><div class="funnel-stage-bar-wrapper"><div class="funnel-stage-bar" style="width:${p}%;background:${s.color}">${c}</div></div></div>`; }).join('')}</div>
        <div class="form-actions"><button class="btn btn-secondary" onclick="closeModal('vacancyModal')">Закрыть</button><button class="btn btn-primary" onclick="closeModal('vacancyModal');navigateTo('pipeline');filterPipelineByVacancy(${v.id})">${ic('columns')} Воронка</button></div></div>`;
    openModal('vacancyModal');
}

// ===== Candidates (Flow-Oriented) =====
let selectedIds = new Set();
let previewCandidateId = null;
let sortCol = 'daysInStage';
let sortDir = 'desc';
let savedFilter = '';

const SAVED_FILTERS = [
    { id: 'new', label: 'Новые отклики', icon: 'inbox', fn: c => c.stage === 'new' },
    { id: 'urgent', label: 'Срочные', icon: 'flame', fn: c => c.urgent },
    { id: 'no-step', label: 'Без следующего шага', icon: 'alert-circle', fn: c => !c.nextStep && c.stage !== 'rejected' && c.stage !== 'hired' },
    { id: 'stale', label: 'Застряли (5+ дней)', icon: 'clock', fn: c => c.daysInStage > 5 && c.stage !== 'rejected' && c.stage !== 'hired' },
    { id: 'offer', label: 'На оффере', icon: 'file-text', fn: c => c.stage === 'offer' },
];

function renderCandidates() {
    selectedIds.clear(); previewCandidateId = null;
    const page = document.getElementById('candidates-page');
    const newCount = candidates.filter(c => c.stage === 'new').length;
    page.innerHTML = `
        <div class="page-header"><h1>Кандидаты <span class="text-muted" style="font-size:.9rem;font-weight:400">${candidates.filter(c=>c.stage!=='rejected').length}</span></h1><div class="page-actions">
            <button class="btn btn-outline" onclick="showToast('info','Экспорт','Экспорт')">${ic('download')} Экспорт</button>
            <button class="btn btn-primary" onclick="openModal('addCandidateModal')">${ic('user-plus')} Добавить</button>
        </div></div>
        <div class="saved-filters" id="savedFilters">
            <span class="saved-filter-chip ${savedFilter===''?'active':''}" onclick="applySavedFilter('')">${ic('list','icon-sm')} Все</span>
            ${SAVED_FILTERS.map(f => `<span class="saved-filter-chip ${savedFilter===f.id?'active':''}" onclick="applySavedFilter('${f.id}')">${ic(f.icon,'icon-sm')} ${f.label} <strong>${candidates.filter(f.fn).length}</strong></span>`).join('')}
        </div>
        <div class="candidates-toolbar"><div class="candidates-filters">
            <select class="filter-select" id="vacancyFilter" onchange="filterCandidates()"><option value="">Все вакансии</option>${vacancies.filter(v => v.status !== 'closed').map(v => `<option value="${v.id}">${v.title}</option>`).join('')}</select>
            <select class="filter-select" id="stageFilter" onchange="filterCandidates()"><option value="">Все этапы</option>${pipelineStages.map(s => `<option value="${s.id}">${s.name}</option>`).join('')}<option value="rejected">Отказ</option></select>
            <select class="filter-select" id="sourceFilter" onchange="filterCandidates()"><option value="">Все источники</option>${sources.map(s => `<option value="${s.value}">${s.label}</option>`).join('')}</select>
        </div><div class="search-box" style="width:240px;border:1px solid var(--border)">${ic('search')}<input type="text" placeholder="Поиск..." id="candidateSearch" oninput="filterCandidates()"></div></div>
        <div class="split-view ${previewCandidateId ? 'has-preview' : ''}" id="splitView">
            <div class="split-table"><table class="candidates-table"><thead><tr>
                <th><input type="checkbox" id="selectAll" onchange="toggleSelectAll(this.checked)"></th>
                <th class="${sortCol==='name'?'sorted':''}" onclick="sortCandidates('name')">Кандидат <span class="sort-icon">${ic(sortDir==='asc'&&sortCol==='name'?'arrow-up':'arrow-up','icon-sm')}</span></th>
                <th onclick="sortCandidates('vacancy')">Вакансия</th>
                <th onclick="sortCandidates('stage')">Этап</th>
                <th onclick="sortCandidates('source')">Источник</th>
                <th class="${sortCol==='daysInStage'?'sorted':''}" onclick="sortCandidates('daysInStage')">Дней <span class="sort-icon">${ic('arrow-up','icon-sm')}</span></th>
                <th>Действия</th>
            </tr></thead><tbody id="candidatesTableBody">${renderCandidateRows(getFilteredCandidates())}</tbody></table></div>
            <div class="preview-panel" id="previewPanel"><div class="preview-panel-empty">Выберите кандидата<br>для быстрого просмотра</div></div>
        </div>
        <div id="bulkBarContainer"></div>`;
    const sel = document.getElementById('addCandidateVacancy');
    if (sel) sel.innerHTML = vacancies.filter(v => v.status === 'active').map(v => `<option value="${v.id}">${v.title}</option>`).join('');
}

function getFilteredCandidates() {
    let list = candidates.filter(c => c.stage !== 'rejected');
    if (savedFilter) {
        const sf = SAVED_FILTERS.find(f => f.id === savedFilter);
        if (sf) list = candidates.filter(sf.fn);
    }
    const vf = document.getElementById('vacancyFilter')?.value;
    const stf = document.getElementById('stageFilter')?.value;
    const src = document.getElementById('sourceFilter')?.value;
    const q = document.getElementById('candidateSearch')?.value?.toLowerCase();
    if (vf) list = list.filter(c => c.vacancyId === parseInt(vf));
    if (stf) list = list.filter(c => c.stage === stf);
    if (src) list = list.filter(c => c.source === src);
    if (q) list = list.filter(c => `${c.firstName} ${c.lastName}`.toLowerCase().includes(q) || c.email.toLowerCase().includes(q));
    // Sort
    list.sort((a, b) => {
        let va, vb;
        if (sortCol === 'name') { va = `${a.firstName} ${a.lastName}`; vb = `${b.firstName} ${b.lastName}`; }
        else if (sortCol === 'daysInStage') { va = a.daysInStage; vb = b.daysInStage; }
        else if (sortCol === 'stage') { va = pipelineStages.findIndex(s=>s.id===a.stage); vb = pipelineStages.findIndex(s=>s.id===b.stage); }
        else { va = a[sortCol]; vb = b[sortCol]; }
        if (va < vb) return sortDir === 'asc' ? -1 : 1;
        if (va > vb) return sortDir === 'asc' ? 1 : -1;
        return 0;
    });
    return list;
}

function applySavedFilter(id) {
    savedFilter = id;
    renderCandidates();
}

function sortCandidates(col) {
    if (sortCol === col) sortDir = sortDir === 'asc' ? 'desc' : 'asc';
    else { sortCol = col; sortDir = col === 'daysInStage' ? 'desc' : 'asc'; }
    filterCandidates();
}

function renderCandidateRows(list) {
    return list.map(c => {
        const v = vacancies.find(x => x.id === c.vacancyId);
        const sl = sources.find(s => s.value === c.source)?.label || c.source;
        const sel = selectedIds.has(c.id);
        const prev = previewCandidateId === c.id;
        return `<tr class="${sel?'selected':''} ${prev?'selected':''}" onclick="showPreview(${c.id})" style="cursor:pointer">
            <td onclick="event.stopPropagation()"><input type="checkbox" ${sel?'checked':''} onchange="toggleSelect(${c.id},this.checked)"></td>
            <td><div class="candidate-info">${ava(c.firstName+' '+c.lastName,32)}<div><div class="candidate-name">${c.firstName} ${c.lastName}</div><div class="candidate-position">${c.currentCompany||''} · ${c.experience}</div></div></div></td>
            <td style="font-size:.8rem">${v?v.title:'-'}</td>
            <td><span class="stage-badge ${c.stage}">${getStageLabel(c.stage)}</span></td>
            <td style="font-size:.8rem">${sl}</td>
            <td><span class="${c.daysInStage>5?'text-danger':''}" style="font-weight:600">${c.daysInStage}д</span></td>
            <td><div class="candidate-actions" onclick="event.stopPropagation()">
                <button class="action-btn" onclick="openMoveStage(${c.id})">${ic('arrow-right','icon-sm')}</button>
                <button class="action-btn danger" onclick="openRejectModal(${c.id})">${ic('x','icon-sm')}</button>
            </div></td></tr>`;
    }).join('');
}

function showPreview(id) {
    previewCandidateId = id;
    const sv = document.getElementById('splitView');
    sv.classList.add('has-preview');
    const c = candidates.find(x => x.id === id);
    if (!c) return;
    const v = vacancies.find(x => x.id === c.vacancyId);
    const sl = sources.find(s => s.value === c.source)?.label || c.source;
    document.getElementById('previewPanel').innerHTML = `
        <div class="preview-header">
            <div style="display:flex;align-items:center;gap:10px">${ava(c.firstName+' '+c.lastName,40)}<div><div style="font-weight:600">${c.firstName} ${c.lastName}</div><div class="text-muted" style="font-size:.75rem">${c.currentCompany||''} · ${c.experience}</div></div></div>
            <button class="btn btn-sm btn-outline" onclick="openCandidateModal(${c.id})">${ic('external-link','icon-sm')}</button>
        </div>
        <div class="preview-body">
            <div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:12px"><span class="stage-badge ${c.stage}">${getStageLabel(c.stage)}</span>${c.urgent?`<span style="color:var(--danger);font-size:.7rem;font-weight:600">${ic('flame','icon-sm')} Срочный</span>`:''}</div>
            <div style="display:flex;flex-wrap:wrap;gap:4px;margin-bottom:12px">${(c.skills||[]).map(s=>`<span class="kanban-card-tag">${s}</span>`).join('')}</div>
            <div style="font-size:.8rem;display:flex;flex-direction:column;gap:6px;margin-bottom:14px;color:var(--text-2)">
                <div>${ic('briefcase','icon-sm')} ${v?v.title:'-'}</div>
                <div>${ic('dollar-sign','icon-sm')} ${c.salaryExpectation||'-'}</div>
                <div>${ic('map-pin','icon-sm')} ${c.location||'-'}</div>
                <div>${ic('tag','icon-sm')} ${sl}</div>
            </div>
            <div style="font-size:.8rem;font-weight:600;margin-bottom:8px">Хронология</div>
            ${renderRichTimeline(c)}
        </div>
        <div class="preview-actions">
            <button class="btn btn-primary btn-sm" onclick="openScheduleInterview(${c.id})">${ic('calendar-plus','icon-sm')} Интервью</button>
            <button class="btn btn-outline btn-sm" onclick="openMoveStage(${c.id})">${ic('arrow-right','icon-sm')} Перевести</button>
            <button class="btn btn-danger btn-sm" onclick="openRejectModal(${c.id})">${ic('x','icon-sm')} Отказать</button>
        </div>`;
    // highlight row
    document.querySelectorAll('.candidates-table tr').forEach(tr => tr.classList.remove('selected'));
    // re-highlight
    filterCandidates();
}

// ===== Rich Timeline (merged from all sources) =====
function renderRichTimeline(c) {
    let events = [];
    (c.timeline || []).forEach(t => events.push({ date: t.date, type: t.type === 'stage' ? 'stage' : t.type === 'interview' ? 'interview' : 'create', title: t.event, body: t.description }));
    (c.feedbacks || []).forEach(fb => { const iv = hiringManagers.find(m => m.id === fb.interviewerId); events.push({ date: fb.date, type: 'feedback', title: `Фидбек от ${iv?.name||'?'}`, body: `${fb.rating}/5 — ${getRecommendationLabel(fb.recommendation)}${fb.comment ? '. '+fb.comment : ''}` }); });
    (c.notes || []).forEach(n => events.push({ date: n.date, type: 'note', title: `Заметка (${n.author})`, body: n.text }));
    events.sort((a,b) => new Date(b.date) - new Date(a.date));
    if (events.length === 0) return '<p class="text-muted" style="font-size:.8rem">Пока нет событий</p>';
    return `<div class="rich-timeline">${events.slice(0,10).map(e => `<div class="tl-item"><div class="tl-dot ${e.type}"></div><div class="tl-time">${formatDate(e.date)}</div><div class="tl-title">${e.title}</div><div class="tl-body">${e.body}</div></div>`).join('')}</div>`;
}

// ===== Bulk Operations =====
function toggleSelect(id, checked) {
    if (checked) selectedIds.add(id); else selectedIds.delete(id);
    renderBulkBar();
}

function toggleSelectAll(checked) {
    const list = getFilteredCandidates();
    if (checked) list.forEach(c => selectedIds.add(c.id)); else selectedIds.clear();
    document.querySelectorAll('.candidates-table tbody input[type=checkbox]').forEach(cb => cb.checked = checked);
    renderBulkBar();
}

function renderBulkBar() {
    const cnt = selectedIds.size;
    const container = document.getElementById('bulkBarContainer');
    if (cnt === 0) { container.innerHTML = ''; return; }
    container.innerHTML = `<div class="bulk-bar">
        <span><span class="bulk-count">${cnt}</span> выбрано</span>
        <button class="btn btn-sm btn-success" onclick="bulkMoveStage('screening')">${ic('arrow-right','icon-sm')} В скрининг</button>
        <button class="btn btn-sm btn-ghost" onclick="bulkMoveStagePrompt()">${ic('columns','icon-sm')} На этап...</button>
        <button class="btn btn-sm btn-danger" onclick="bulkReject()">${ic('x','icon-sm')} Отказать</button>
        <button class="btn btn-sm btn-ghost" onclick="selectedIds.clear();filterCandidates();renderBulkBar()">${ic('x','icon-sm')} Снять</button>
    </div>`;
}

function bulkMoveStage(stage) {
    const ids = [...selectedIds];
    ids.forEach(id => {
        const c = candidates.find(x=>x.id===id); if(!c) return;
        const os = c.stage; c.stage = stage; c.daysInStage = 0; c.updatedAt = new Date().toISOString().split('T')[0];
        if (!c.timeline) c.timeline = [];
        c.timeline.push({ date: c.updatedAt, event: getStageLabel(stage), type: 'stage', description: `${getStageLabel(os)} → ${getStageLabel(stage)} (bulk)` });
    });
    showToast('success', 'Массовое действие', `${ids.length} кандидатов → ${getStageLabel(stage)}`);
    selectedIds.clear(); renderCandidates();
}

function bulkMoveStagePrompt() {
    const stage = prompt('Этап: new, screening, interview, technical, final, offer, hired');
    if (stage && getStageLabel(stage) !== stage) bulkMoveStage(stage);
}

function bulkReject() {
    const ids = [...selectedIds];
    ids.forEach(id => {
        const c = candidates.find(x=>x.id===id); if(!c) return;
        c.stage = 'rejected'; c.updatedAt = new Date().toISOString().split('T')[0];
    });
    showToast('success', 'Массовый отказ', `${ids.length} кандидатов отклонены`);
    selectedIds.clear(); renderCandidates();
}

function filterCandidates() {
    const list = getFilteredCandidates();
    const tbody = document.getElementById('candidatesTableBody');
    if (tbody) tbody.innerHTML = renderCandidateRows(list);
    renderBulkBar();
}

function renderCandidateRows(list) {
    return list.map(c => {
        const v = vacancies.find(x => x.id === c.vacancyId);
        const sl = sources.find(s => s.value === c.source)?.label || c.source;
        return `<tr onclick="openCandidateModal(${c.id})" style="cursor:pointer">
            <td><div class="candidate-info">${ava(c.firstName + ' ' + c.lastName, 36)}<div><div class="candidate-name">${c.firstName} ${c.lastName}</div><div class="candidate-position">${c.currentCompany || ''} · ${c.experience}</div></div></div></td>
            <td>${v ? v.title : '-'}</td>
            <td><span class="stage-badge ${c.stage}">${getStageLabel(c.stage)}</span></td>
            <td>${sl}</td><td>${c.salaryExpectation || '-'}</td>
            <td><span class="${c.daysInStage > 5 ? 'text-danger' : ''}">${c.daysInStage} дн.</span></td>
            <td><div class="candidate-actions" onclick="event.stopPropagation()">
                <button class="action-btn" title="Интервью" onclick="openScheduleInterview(${c.id})">${ic('calendar-plus','icon-sm')}</button>
                <button class="action-btn" title="Перевести" onclick="openMoveStage(${c.id})">${ic('arrow-right','icon-sm')}</button>
                <button class="action-btn danger" title="Отказать" onclick="openRejectModal(${c.id})">${ic('x','icon-sm')}</button>
            </div></td></tr>`;
    }).join('');
}

function getStageLabel(s) { return { new:'Новый', screening:'Скрининг', interview:'Интервью', technical:'Техническое', final:'Финал', offer:'Оффер', hired:'Нанят', rejected:'Отказ' }[s] || s; }

function filterCandidates() {
    const vf = document.getElementById('vacancyFilter').value;
    const sf = document.getElementById('stageFilter').value;
    const src = document.getElementById('sourceFilter').value;
    const q = document.getElementById('candidateSearch').value.toLowerCase();
    let list = candidates.filter(c => c.stage !== 'rejected');
    if (vf) list = list.filter(c => c.vacancyId === parseInt(vf));
    if (sf) list = list.filter(c => c.stage === sf);
    if (src) list = list.filter(c => c.source === src);
    if (q) list = list.filter(c => `${c.firstName} ${c.lastName}`.toLowerCase().includes(q) || c.email.toLowerCase().includes(q));
    document.getElementById('candidatesTableBody').innerHTML = renderCandidateRows(list);
}

// ===== Pipeline / Kanban =====
function renderPipeline() {
    const page = document.getElementById('pipeline-page');
    page.innerHTML = `
        <div class="pipeline-header"><h1>Воронка кандидатов</h1><select class="pipeline-vacancy-select" id="pipelineVacancySelect" onchange="filterPipelineByVacancy(this.value)"><option value="">Все вакансии</option>${vacancies.filter(v => v.status !== 'closed').map(v => `<option value="${v.id}">${v.title}</option>`).join('')}</select></div>
        <div class="kanban-board" id="kanbanBoard">${renderKanbanColumns(candidates.filter(c => c.stage !== 'rejected' && c.stage !== 'hired'), '')}</div>`;
    initDnD();
}

function renderKanbanColumns(list, vacancyId) {
    const stages = vacancyId ? getStagesForVacancy(parseInt(vacancyId)) : pipelineStages;
    return stages.filter(s => s.id !== 'hired').map(s => {
        const sc = list.filter(c => c.stage === s.id);
        return `<div class="kanban-column" data-stage="${s.id}"><div class="kanban-column-header"><div class="kanban-column-title"><span class="stage-dot" style="background:${s.color}"></span>${s.name}<span class="kanban-column-count">${sc.length}</span></div></div><div class="kanban-column-body" data-stage="${s.id}">${sc.map(c => renderKanbanCard(c)).join('')}${sc.length === 0 ? '<div class="empty-state" style="padding:16px"><p>Пусто</p></div>' : ''}</div></div>`;
    }).join('');
}

function renderKanbanCard(c) {
    const v = vacancies.find(x => x.id === c.vacancyId);
    return `<div class="kanban-card ${c.urgent ? 'urgent' : ''}" data-candidate-id="${c.id}" draggable="true">
        <div class="kanban-card-header" onclick="openCandidateModal(${c.id})">${ava(c.firstName + ' ' + c.lastName, 32)}<div><div class="kanban-card-name">${c.firstName} ${c.lastName}</div><div class="kanban-card-vacancy">${v ? v.title : ''}</div></div></div>
        <div class="kanban-card-meta">${c.skills.slice(0, 3).map(s => `<span class="kanban-card-tag">${s}</span>`).join('')}</div>
        <div class="kanban-card-footer"><div class="kanban-card-days ${c.daysInStage > 5 ? 'overdue' : ''}">${ic('clock','icon-sm')} ${c.daysInStage} дн.</div>${c.urgent ? `<span class="text-danger">${ic('flame','icon-sm')}</span>` : ''}</div>
    </div>`;
}

function initDnD() {
    const board = document.getElementById('kanbanBoard'); if (!board) return;
    board.addEventListener('dragstart', e => { const card = e.target.closest('.kanban-card'); if (!card) return; draggedCandidateId = parseInt(card.dataset.candidateId); card.classList.add('dragging'); e.dataTransfer.effectAllowed = 'move'; });
    board.addEventListener('dragend', e => { const card = e.target.closest('.kanban-card'); if (card) card.classList.remove('dragging'); document.querySelectorAll('.kanban-column').forEach(c => c.classList.remove('drag-over')); draggedCandidateId = null; });
    board.addEventListener('dragover', e => { e.preventDefault(); e.dataTransfer.dropEffect = 'move'; const col = e.target.closest('.kanban-column'); if (col) { document.querySelectorAll('.kanban-column').forEach(c => c.classList.remove('drag-over')); col.classList.add('drag-over'); } });
    board.addEventListener('dragleave', e => { const col = e.target.closest('.kanban-column'); if (col && !col.contains(e.relatedTarget)) col.classList.remove('drag-over'); });
    board.addEventListener('drop', e => {
        e.preventDefault(); document.querySelectorAll('.kanban-column').forEach(c => c.classList.remove('drag-over'));
        const col = e.target.closest('.kanban-column'); if (!col || !draggedCandidateId) return;
        const ns = col.dataset.stage; const cand = candidates.find(c => c.id === draggedCandidateId);
        if (!cand || cand.stage === ns) return;
        const os = cand.stage; cand.stage = ns; cand.daysInStage = 0; cand.updatedAt = new Date().toISOString().split('T')[0];
        if (!cand.timeline) cand.timeline = [];
        cand.timeline.push({ date: cand.updatedAt, event: getStageLabel(ns), type: 'stage', description: `${getStageLabel(os)} → ${getStageLabel(ns)}` });
        showToast('success', 'Этап изменен', `${cand.firstName} ${cand.lastName} → ${getStageLabel(ns)}`);
        const sel = document.getElementById('pipelineVacancySelect'); const fv = sel ? sel.value : '';
        let filtered = candidates.filter(c => c.stage !== 'rejected' && c.stage !== 'hired');
        if (fv) filtered = filtered.filter(c => c.vacancyId === parseInt(fv));
        document.getElementById('kanbanBoard').innerHTML = renderKanbanColumns(filtered, fv); initDnD();
    });
}

function filterPipelineByVacancy(vid) {
    const sel = document.getElementById('pipelineVacancySelect'); if (sel && vid) sel.value = vid;
    let list = candidates.filter(c => c.stage !== 'rejected' && c.stage !== 'hired');
    if (vid) list = list.filter(c => c.vacancyId === parseInt(vid));
    document.getElementById('kanbanBoard').innerHTML = renderKanbanColumns(list, vid); initDnD();
}

// ===== Interviews =====
function renderInterviews() {
    const page = document.getElementById('interviews-page');
    page.innerHTML = `<div class="page-header"><h1>Интервью</h1><div class="page-actions"><div class="interviews-view-toggle"><button class="view-toggle-btn active" data-view="list">${ic('list','icon-sm')}</button><button class="view-toggle-btn" data-view="calendar">${ic('calendar','icon-sm')}</button></div></div></div><div id="interviewsContent">${renderInterviewsList()}</div>`;
    page.querySelectorAll('.view-toggle-btn').forEach(btn => {
        btn.addEventListener('click', () => { page.querySelectorAll('.view-toggle-btn').forEach(b => b.classList.remove('active')); btn.classList.add('active'); document.getElementById('interviewsContent').innerHTML = btn.dataset.view === 'list' ? renderInterviewsList() : renderInterviewsCalendar(); });
    });
}

function renderInterviewsList() {
    const sorted = [...interviews].sort((a, b) => new Date(`${a.date}T${a.time}`) - new Date(`${b.date}T${b.time}`));
    return `<div class="interviews-list">${sorted.map(iv => {
        const c = candidates.find(x => x.id === iv.candidateId); const v = vacancies.find(x => x.id === iv.vacancyId);
        const ivrs = iv.interviewers.map(id => hiringManagers.find(m => m.id === id));
        return `<div class="interview-card" onclick="openCandidateModal(${c.id})">
            <div class="interview-time"><div class="interview-time-value">${iv.time}</div><div class="interview-time-date">${formatDate(iv.date)}</div></div>
            <div class="interview-details"><div class="interview-candidate">${c.firstName} ${c.lastName}</div><div class="interview-type">${getInterviewTypeLabel(iv.type)} · ${v.title}</div><div class="interview-interviewers">${ivrs.map(i => ava(i.name, 26)).join('')}</div></div>
            <div class="interview-status"><span class="interview-format">${getFormatLabel(iv.format)}</span><div class="candidate-actions" onclick="event.stopPropagation()"><button class="action-btn" onclick="showToast('info','Перенос','Перенос интервью')">${ic('clock','icon-sm')}</button><button class="action-btn success" onclick="openFeedbackModal(${c.id},${iv.id})">${ic('message-circle','icon-sm')}</button></div></div>
        </div>`;
    }).join('')}</div>`;
}

function renderInterviewsCalendar() {
    const days = ['Пн','Вт','Ср','Чт','Пт','Сб','Вс'];
    const hours = ['09:00','10:00','11:00','12:00','13:00','14:00','15:00','16:00','17:00','18:00'];
    // Generate week dates starting from Mon 2025-01-27
    const weekStart = new Date('2025-01-27');
    const weekDates = Array.from({length: 7}, (_, i) => {
        const d = new Date(weekStart); d.setDate(d.getDate() + i);
        return d.toISOString().split('T')[0];
    });
    const dayLabels = weekDates.map((d, i) => {
        const dt = new Date(d);
        return `${days[i]} ${dt.getDate()}`;
    });

    return `<div class="interviews-calendar"><div class="calendar-header"><div class="calendar-nav"><button>${ic('chevron-left','icon-sm')}</button><span class="calendar-title">27 янв — 2 фев 2025</span><button>${ic('chevron-right','icon-sm')}</button></div><button class="btn btn-sm btn-outline">Сегодня</button></div>
    <div class="calendar-week"><div class="calendar-day-header"></div>${dayLabels.map((d, i) => `<div class="calendar-day-header ${i === 0 ? 'today' : ''}">${d}</div>`).join('')}</div>
    <div class="calendar-week"><div class="calendar-times">${hours.map(h => `<div class="calendar-time">${h}</div>`).join('')}</div>
    ${weekDates.map(wd => {
        const dayInterviews = interviews.filter(iv => iv.date === wd);
        return `<div class="calendar-day">${dayInterviews.map(iv => {
            const c = candidates.find(x => x.id === iv.candidateId);
            const [hh, mm] = iv.time.split(':').map(Number);
            const topPx = (hh - 9) * 60 + mm;
            const heightPx = Math.max(iv.duration * (60/60), 40);
            const typeClass = iv.type === 'technical' ? 'technical' : iv.type === 'hr' ? 'hr' : iv.type === 'final' ? 'final' : '';
            return `<div class="calendar-event ${typeClass}" style="top:${topPx}px;height:${heightPx}px" onclick="openCandidateModal(${c.id})" title="${c.firstName} ${c.lastName} — ${getInterviewTypeLabel(iv.type)}">
                ${iv.time} ${c.firstName[0]}.${c.lastName[0]}. ${getInterviewTypeLabel(iv.type).split(' ')[0]}
            </div>`;
        }).join('')}</div>`;
    }).join('')}
    </div></div>`;
}

function getInterviewTypeLabel(t) { return { screening:'Скрининг', hr:'HR интервью', technical:'Техническое', final:'Финальное', manager:'С менеджером' }[t] || t; }
function getFormatLabel(f) { return { online:'Онлайн', offline:'Офис', phone:'Телефон' }[f] || f; }

// ===== Talent Pool =====
function renderTalentPool() {
    const page = document.getElementById('talent-pool-page');
    page.innerHTML = `<div class="page-header"><h1>Талант-пул</h1><div class="page-actions"><button class="btn btn-primary" onclick="showToast('info','Добавление','Добавление в пул')">${ic('plus')} Добавить</button></div></div>
        <div class="talent-pool-stats"><div class="pool-stat"><div class="pool-stat-value">${talentPool.length}</div><div class="pool-stat-label">В пуле</div></div><div class="pool-stat"><div class="pool-stat-value">2</div><div class="pool-stat-label">Связаться</div></div><div class="pool-stat"><div class="pool-stat-value">5</div><div class="pool-stat-label">Frontend</div></div><div class="pool-stat"><div class="pool-stat-value">3</div><div class="pool-stat-label">Backend</div></div></div>
        <div class="talent-pool-grid">${talentPool.map(t => {
            const c = t.candidateId ? candidates.find(x => x.id === t.candidateId) : t;
            const name = `${c.firstName} ${c.lastName}`;
            return `<div class="talent-card" onclick="${t.candidateId ? `openCandidateModal(${t.candidateId})` : `showToast('info','Талант','${name}')`}">
                <div class="talent-card-header">${ava(name, 44)}<div class="talent-info"><h4>${name}</h4><p>${c.skills ? c.skills.slice(0, 2).join(', ') : ''} · ${c.experience}</p></div></div>
                <div class="talent-tags">${(t.tags || []).map(x => `<span class="talent-tag">${x}</span>`).join('')}</div>
                <p class="text-muted" style="font-size:.85rem;margin-bottom:10px">${t.reason}</p>
                <div class="talent-footer"><span>Добавлен: ${formatDate(t.addedAt)}</span><span>Контакт: ${formatDate(t.nextContactAt)}</span></div></div>`;
        }).join('')}</div>`;
}

// ===== Offers =====
function renderOffers() {
    const page = document.getElementById('offers-page');
    page.innerHTML = `<div class="page-header"><h1>Офферы</h1></div><div class="offers-grid">${offers.map(o => {
        const c = candidates.find(x => x.id === o.candidateId); const v = vacancies.find(x => x.id === o.vacancyId);
        return `<div class="offer-card ${o.status}"><div class="offer-header"><div class="offer-candidate-info">${ava(c.firstName + ' ' + c.lastName, 44)}<div><div class="offer-candidate-name">${c.firstName} ${c.lastName}</div><div class="offer-position">${v.title}</div></div></div><span class="offer-status-badge ${o.status}">${getOfferStatusLabel(o.status)}</span></div>
        <div class="offer-body"><div class="offer-details"><div><div class="offer-detail-label">Оклад</div><div class="offer-detail-value">${o.salary}</div></div><div><div class="offer-detail-label">Дата выхода</div><div class="offer-detail-value">${formatDate(o.startDate)}</div></div><div><div class="offer-detail-label">Формат</div><div class="offer-detail-value">${getWorkFormatLabel(o.workFormat)}</div></div><div><div class="offer-detail-label">До</div><div class="offer-detail-value">${formatDate(o.expiryDate)}</div></div></div>
            ${o.approvalStatus ? `<div style="margin-top:14px;padding-top:12px;border-top:1px solid var(--border)"><div style="font-size:.7rem;font-weight:600;color:var(--text-3);text-transform:uppercase;margin-bottom:8px">Согласование</div><div style="display:flex;gap:8px;flex-wrap:wrap">${Object.entries(o.approvalStatus).map(([role, status]) => {
                const label = {hr_director:'HR-директор',hiring_manager:'Менеджер',cfo:'CFO'}[role] || role;
                const color = status === 'approved' ? 'var(--success)' : 'var(--warning)';
                const bg = status === 'approved' ? 'var(--success-light)' : 'var(--warning-light)';
                const icon = status === 'approved' ? 'check' : 'clock';
                return `<span style="display:inline-flex;align-items:center;gap:4px;padding:3px 10px;border-radius:var(--radius-full);font-size:.7rem;font-weight:500;background:${bg};color:${color}">${ic(icon,'icon-sm')} ${label}</span>`;
            }).join('')}</div></div>` : ''}</div>
        <div class="offer-footer">${o.status === 'pending' ? `<button class="btn btn-sm btn-success" onclick="updateOfferStatus(${o.id},'sent')">${ic('send','icon-sm')} Отправить</button>` : ''}${o.status === 'sent' ? `<button class="btn btn-sm btn-success" onclick="updateOfferStatus(${o.id},'accepted')">${ic('check','icon-sm')} Принят</button><button class="btn btn-sm btn-danger" onclick="updateOfferStatus(${o.id},'rejected')">${ic('x','icon-sm')} Отклонен</button>` : ''}<button class="btn btn-sm btn-outline" onclick="openCandidateModal(${c.id})">${ic('user','icon-sm')} Кандидат</button></div></div>`;
    }).join('')}</div>`;
}
function getOfferStatusLabel(s) { return { pending:'Согласование', sent:'Отправлен', accepted:'Принят', rejected:'Отклонен', expired:'Истек' }[s] || s; }
function getWorkFormatLabel(f) { return { office:'Офис', remote:'Удаленно', hybrid:'Гибрид' }[f] || f; }
function updateOfferStatus(id, ns) { const o = offers.find(x => x.id === id); if (o) { o.status = ns; renderOffers(); showToast('success', 'Статус обновлен', getOfferStatusLabel(ns)); } }

// ===== Analytics =====
function renderAnalytics() {
    const page = document.getElementById('analytics-page');
    const maxF = Math.max(...analyticsData.funnelData.map(d => d.count));
    const colors = ['#6366f1','#60a5fa','#818cf8','#a78bfa','#c084fc','#34d399','#10b981'];
    page.innerHTML = `<div class="page-header"><h1>Аналитика</h1><div class="page-actions"><select class="filter-select"><option>30 дней</option><option>90 дней</option><option>Год</option></select><button class="btn btn-outline" onclick="showToast('info','Экспорт','Экспорт отчета')">${ic('download')} Экспорт</button></div></div>
        <div class="stats-grid mb-4">
            <div class="stat-card"><div class="stat-icon primary">${ic('clock')}</div><div class="stat-value">${analyticsData.timeToHire.average}</div><div class="stat-label">Среднее время найма (дни)</div></div>
            <div class="stat-card"><div class="stat-icon success">${ic('percent')}</div><div class="stat-value">3.2%</div><div class="stat-label">Конверсия в найм</div></div>
            <div class="stat-card"><div class="stat-icon warning">${ic('users')}</div><div class="stat-value">156</div><div class="stat-label">Всего откликов</div></div>
            <div class="stat-card"><div class="stat-icon danger">${ic('user-check')}</div><div class="stat-value">5</div><div class="stat-label">Нанято</div></div>
        </div>
        <div class="analytics-grid">
            <div class="chart-card"><div class="chart-header"><h3 class="chart-title">Воронка найма</h3></div><div class="funnel-chart">${analyticsData.funnelData.map((d, i) => { const p = (d.count / maxF * 100); const prev = i > 0 ? analyticsData.funnelData[i-1].count : null; const conv = prev ? ((d.count / prev) * 100).toFixed(0) : null; return `<div class="funnel-stage-row"><div class="funnel-stage-label">${d.stage}</div><div class="funnel-stage-bar-wrapper"><div class="funnel-stage-bar" style="width:${p}%;background:${colors[i]}">${d.count}</div></div><span class="text-muted" style="font-size:.7rem;min-width:40px;text-align:right">${conv ? conv + '%' : ''}</span></div>`; }).join('')}</div></div>
            <div class="chart-card"><div class="chart-header"><h3 class="chart-title">Источники</h3></div><table class="candidates-table" style="margin:0"><thead><tr><th>Источник</th><th>Откликов</th><th>Наймов</th><th>%</th></tr></thead><tbody>${analyticsData.sourceEfficiency.map(s => `<tr><td>${s.source}</td><td>${s.applications}</td><td>${s.hires}</td><td>${s.conversion}%</td></tr>`).join('')}</tbody></table></div>
            <div class="chart-card full-width"><div class="chart-header"><h3 class="chart-title">Активность по неделям</h3></div><div class="metrics-row">${analyticsData.weeklyActivity.map(w => `<div class="metric-item"><div class="metric-label">${w.week}</div><div class="metric-value">${w.applications}</div><div class="metric-label">откликов</div></div>`).join('')}</div></div>
            <div class="chart-card"><div class="chart-header"><h3 class="chart-title">Время найма</h3></div><div class="metrics-row"><div class="metric-item"><div class="metric-value">${analyticsData.timeToHire.min}</div><div class="metric-label">Мин</div></div><div class="metric-item"><div class="metric-value">${analyticsData.timeToHire.median}</div><div class="metric-label">Медиана</div></div><div class="metric-item"><div class="metric-value">${analyticsData.timeToHire.average}</div><div class="metric-label">Среднее</div></div><div class="metric-item"><div class="metric-value">${analyticsData.timeToHire.max}</div><div class="metric-label">Макс</div></div></div></div>
            <div class="chart-card"><div class="chart-header"><h3 class="chart-title">Причины отказов</h3></div><div class="funnel-chart"><div class="funnel-stage-row"><div class="funnel-stage-label">Навыки</div><div class="funnel-stage-bar-wrapper"><div class="funnel-stage-bar" style="width:45%;background:#f43f5e">28</div></div></div><div class="funnel-stage-row"><div class="funnel-stage-label">Зарплата</div><div class="funnel-stage-bar-wrapper"><div class="funnel-stage-bar" style="width:30%;background:#f59e0b">18</div></div></div><div class="funnel-stage-row"><div class="funnel-stage-label">Не отвечает</div><div class="funnel-stage-bar-wrapper"><div class="funnel-stage-bar" style="width:15%;background:#64748b">9</div></div></div><div class="funnel-stage-row"><div class="funnel-stage-label">Другой оффер</div><div class="funnel-stage-bar-wrapper"><div class="funnel-stage-bar" style="width:10%;background:#3b82f6">6</div></div></div></div></div>
        </div>`;
}

// ===== Settings =====
let currentSettingsSection = 'profile';
function renderSettings() {
    const page = document.getElementById('settings-page');
    page.innerHTML = `<div class="page-header"><h1>Настройки</h1></div><div class="settings-grid"><div class="settings-nav">
        <div class="settings-nav-item active" data-section="profile">${ic('user')} Профиль</div>
        <div class="settings-nav-item" data-section="notifications">${ic('bell')} Уведомления</div>
        <div class="settings-nav-item" data-section="pipeline">${ic('columns')} Этапы воронки</div>
        <div class="settings-nav-item" data-section="templates">${ic('file-text')} Шаблоны</div>
        <div class="settings-nav-item" data-section="integrations">${ic('link')} Интеграции</div>
        <div class="settings-nav-item" data-section="team">${ic('users')} Команда</div>
    </div><div class="settings-content" id="settingsContent">${renderSettingsSection('profile')}</div></div>`;
    page.querySelectorAll('.settings-nav-item').forEach(item => { item.addEventListener('click', () => { page.querySelectorAll('.settings-nav-item').forEach(i => i.classList.remove('active')); item.classList.add('active'); document.getElementById('settingsContent').innerHTML = renderSettingsSection(item.dataset.section); }); });
}

function renderSettingsSection(s) {
    if (s === 'profile') return `<div class="settings-section"><h3>Профиль</h3><div style="display:flex;align-items:center;gap:16px;margin-bottom:20px">${ava('Мария Иванова', 64)}<div><button class="btn btn-outline btn-sm">Загрузить фото</button><p class="text-muted" style="font-size:.7rem;margin-top:4px">JPG, PNG до 2 МБ</p></div></div><div class="form-row"><div class="form-group"><label>Имя</label><input type="text" value="Мария"></div><div class="form-group"><label>Фамилия</label><input type="text" value="Иванова"></div></div><div class="form-group"><label>Email</label><input type="email" value="maria@workhere.com"></div><div class="form-row"><div class="form-group"><label>Телефон</label><input type="tel" value="+7 999 000-00-00"></div><div class="form-group"><label>Telegram</label><input type="text" value="@maria_hr"></div></div></div><div class="form-actions" style="border-top:none;padding-top:0"><button class="btn btn-primary" onclick="showToast('success','Сохранено','Профиль обновлен')">Сохранить</button></div>`;
    if (s === 'notifications') return `<div class="settings-section"><h3>Email</h3><div class="checkbox-group"><label class="checkbox-item"><input type="checkbox" checked><span>Новые отклики</span></label><label class="checkbox-item"><input type="checkbox" checked><span>Напоминания об интервью</span></label><label class="checkbox-item"><input type="checkbox" checked><span>Просроченные фидбеки</span></label><label class="checkbox-item"><input type="checkbox"><span>Ежедневный дайджест</span></label></div></div><div class="settings-section"><h3>Push</h3><div class="checkbox-group"><label class="checkbox-item"><input type="checkbox" checked><span>Срочные события</span></label><label class="checkbox-item"><input type="checkbox" checked><span>Сообщения от кандидатов</span></label></div></div><div class="form-actions" style="border-top:none;padding-top:0"><button class="btn btn-primary" onclick="showToast('success','Сохранено','Уведомления обновлены')">Сохранить</button></div>`;
    if (s === 'pipeline') {
        const allVacOptions = [{id:'',label:'Шаблон по умолчанию'}].concat(vacancies.filter(v=>v.status==='active').map(v=>({id:v.id,label:v.title})));
        return `<div class="settings-section"><h3>Этапы воронки</h3>
            <p class="text-muted mb-4" style="font-size:.85rem">Этапы можно настроить глобально или для конкретной вакансии. Разные вакансии могут иметь разный процесс.</p>
            <div class="form-group"><label>Вакансия</label><select class="filter-select" id="stageVacancySelect" onchange="renderStagesForVacancy()" style="width:100%">${allVacOptions.map(o=>`<option value="${o.id}">${o.label}</option>`).join('')}</select></div>
            <div id="stagesEditor">${renderStagesEditor('')}</div>
        </div>`;
    }
    if (s === 'templates') return `<div class="settings-section"><h3>Шаблоны писем</h3><div style="display:flex;flex-direction:column;gap:10px">${[{n:'Приглашение на скрининг',u:45},{n:'Приглашение на интервью',u:38},{n:'Отказ (общий)',u:67},{n:'Отказ (после интервью)',u:31},{n:'Отправка оффера',u:12}].map(t => `<div style="display:flex;align-items:center;justify-content:space-between;padding:12px 14px;background:var(--bg-input);border-radius:var(--radius);border:1px solid var(--border)"><div><div style="font-weight:500;font-size:.85rem">${t.n}</div><div class="text-muted" style="font-size:.7rem">${t.u} раз</div></div><div style="display:flex;gap:6px"><button class="btn btn-outline btn-sm">${ic('edit','icon-sm')}</button><button class="btn btn-outline btn-sm">${ic('eye','icon-sm')}</button></div></div>`).join('')}</div></div>`;
    if (s === 'integrations') return `<div class="settings-section"><h3>Интеграции</h3><div style="display:flex;flex-direction:column;gap:10px">${[{n:'HeadHunter',i:'globe',ok:true,d:'Вакансии, отклики'},{n:'Google Calendar',i:'calendar',ok:true,d:'Интервью'},{n:'Gmail',i:'mail',ok:false,d:'Письма'},{n:'Telegram Bot',i:'send',ok:false,d:'Уведомления'},{n:'Slack',i:'hash',ok:false,d:'Команда'},{n:'Zoom',i:'video',ok:false,d:'Интервью'}].map(x => `<div style="display:flex;align-items:center;gap:14px;padding:14px;background:var(--bg-input);border-radius:var(--radius);border:1px solid var(--border)"><div style="width:40px;height:40px;border-radius:var(--radius);background:var(--bg-card);display:flex;align-items:center;justify-content:center">${ic(x.i)}</div><div style="flex:1"><div style="font-weight:500;font-size:.85rem">${x.n}</div><div class="text-muted" style="font-size:.7rem">${x.d}</div></div>${x.ok ? '<span class="stage-badge offer">Подключено</span>' : `<button class="btn btn-primary btn-sm">Подключить</button>`}</div>`).join('')}</div></div>`;
    if (s === 'team') return `<div class="settings-section"><h3>Команда</h3><div style="display:flex;flex-direction:column;gap:10px">${[{n:'Мария Иванова',r:'Рекрутер',on:true},{n:'Ольга Смирнова',r:'HR Director',on:true},{n:'Алексей Петров',r:'Tech Lead',on:false},{n:'Дмитрий Козлов',r:'CTO',on:false},{n:'Анна Федорова',r:'PM',on:true}].map(m => `<div style="display:flex;align-items:center;gap:10px;padding:12px 14px;background:var(--bg-input);border-radius:var(--radius);border:1px solid var(--border)">${ava(m.n, 36)}<div style="flex:1"><div style="font-weight:500;font-size:.85rem">${m.n}</div><div class="text-muted" style="font-size:.7rem">${m.r}</div></div><span style="font-size:.7rem;color:${m.on ? 'var(--success)' : 'var(--text-3)'}">● ${m.on ? 'Онлайн' : 'Офлайн'}</span></div>`).join('')}</div><button class="btn btn-primary btn-sm mt-4">${ic('user-plus','icon-sm')} Пригласить</button></div>`;
    return '<p class="text-muted">Раздел в разработке</p>';
}

// ===== Configurable Stages =====
function renderStagesEditor(vacancyId) {
    const stages = vacancyId ? getStagesForVacancy(parseInt(vacancyId)) : pipelineStages;
    const isCustom = vacancyId && vacancyCustomStages[parseInt(vacancyId)];
    return `${isCustom ? `<div style="display:flex;align-items:center;gap:8px;margin-bottom:12px"><span class="stage-badge offer" style="font-size:.7rem">Кастомные этапы</span><span class="text-muted" style="font-size:.75rem">Эта вакансия использует свои этапы</span></div>` : ''}
        <div style="display:flex;flex-direction:column;gap:8px">${stages.map((st, i) => `<div style="display:flex;align-items:center;gap:10px;padding:10px 14px;background:var(--bg-input);border-radius:var(--radius);border:1px solid var(--border)">${ic('grip','icon-sm')}<span class="stage-dot" style="background:${st.color}"></span><input type="text" value="${st.name}" style="flex:1;border:none;background:transparent;font-size:.85rem;color:var(--text-1);outline:none"><span class="text-muted" style="font-size:.7rem">${i + 1}</span>${st.id !== 'new' && st.id !== 'hired' ? `<button class="action-btn danger" style="width:24px;height:24px" onclick="showToast('info','Удаление','Удаление этапа ${st.name}')">${ic('x','icon-sm')}</button>` : ''}</div>`).join('')}</div>
        <div style="display:flex;gap:8px;margin-top:12px"><button class="btn btn-outline btn-sm" onclick="showToast('info','Этап','Добавление нового этапа')">${ic('plus','icon-sm')} Добавить этап</button>
        ${!isCustom && vacancyId ? `<button class="btn btn-primary btn-sm" onclick="showToast('info','Кастомизация','Создание кастомных этапов для этой вакансии')">${ic('edit','icon-sm')} Настроить для этой вакансии</button>` : ''}
        </div>
        <div class="form-actions" style="border-top:none;padding-top:8px"><button class="btn btn-primary" onclick="showToast('success','Сохранено','Этапы обновлены')">Сохранить этапы</button></div>`;
}

function renderStagesForVacancy() {
    const sel = document.getElementById('stageVacancySelect');
    document.getElementById('stagesEditor').innerHTML = renderStagesEditor(sel?.value || '');
}

// ===== Candidate Detail Modal =====
function openCandidateModal(id) {
    const c = candidates.find(x => x.id === id); if (!c) return;
    selectedCandidateId = id;
    const v = vacancies.find(x => x.id === c.vacancyId);
    const sl = sources.find(s => s.value === c.source)?.label || c.source;
    document.getElementById('candidateModalTitle').textContent = `${c.firstName} ${c.lastName}`;
    document.getElementById('candidateModalBody').innerHTML = `<div class="candidate-detail">
        <div class="candidate-sidebar">
            <div class="candidate-profile">${ava(c.firstName + ' ' + c.lastName, 80)}<div class="candidate-profile-name">${c.firstName} ${c.lastName}</div><div class="candidate-profile-position">${c.currentCompany || ''}</div><span class="stage-badge ${c.stage}">${getStageLabel(c.stage)}</span></div>
            <div class="candidate-contact-list">
                <div class="candidate-contact-item">${ic('mail','icon-sm')} <a href="mailto:${c.email}">${c.email}</a></div>
                <div class="candidate-contact-item">${ic('phone','icon-sm')} ${c.phone}</div>
                ${c.telegram ? `<div class="candidate-contact-item">${ic('send','icon-sm')} ${c.telegram}</div>` : ''}
                ${c.linkedin ? `<div class="candidate-contact-item">${ic('external-link','icon-sm')} <a href="${c.linkedin}" target="_blank">LinkedIn</a></div>` : ''}
            </div>
            <div class="mt-4">
                <div class="candidate-contact-item">${ic('briefcase','icon-sm')} ${v ? v.title : '-'}</div>
                <div class="candidate-contact-item">${ic('dollar-sign','icon-sm')} ${c.salaryExpectation || '-'}</div>
                <div class="candidate-contact-item">${ic('map-pin','icon-sm')} ${c.location || '-'}</div>
                <div class="candidate-contact-item">${ic('tag','icon-sm')} ${sl}${c.referrer ? ` (${c.referrer})` : ''}</div>
            </div>
            <div class="candidate-quick-actions">
                <button class="btn btn-primary" onclick="openScheduleInterview(${c.id});closeModal('candidateModal')">${ic('calendar-plus')} Интервью</button>
                <button class="btn btn-outline" onclick="openMoveStage(${c.id});closeModal('candidateModal')">${ic('arrow-right')} Перевести</button>
                ${c.stage === 'final' || c.stage === 'offer' ? `<button class="btn btn-success" onclick="openOfferModal(${c.id});closeModal('candidateModal')">${ic('file-text')} Оффер</button>` : ''}
                <button class="btn btn-danger" onclick="openRejectModal(${c.id});closeModal('candidateModal')">${ic('x')} Отказать</button>
            </div>
        </div>
        <div class="candidate-main">
            <div class="candidate-tabs"><div class="candidate-tab active" data-tab="timeline">Хронология</div><div class="candidate-tab" data-tab="overview">Обзор</div><div class="candidate-tab" data-tab="feedback">Фидбек (${(c.feedbacks||[]).length})</div><div class="candidate-tab" data-tab="notes">Заметки (${(c.notes||[]).length})</div></div>
            <div class="candidate-tab-content" id="tab-overview">
                <h4>Навыки</h4><div class="kanban-card-meta mb-4">${c.skills.map(s => `<span class="kanban-card-tag">${s}</span>`).join('')}</div>
                <h4>Опыт</h4><p class="mb-4">${c.experience}${c.currentCompany ? `, ${c.currentCompany}` : ''}</p>
                <h4>Следующий шаг</h4><div class="priority-item info mb-4"><div class="priority-icon info">${ic('arrow-right')}</div><div class="priority-content"><div class="priority-title">${c.nextStep || 'Не определен'}</div>${c.nextStepDue ? `<div class="priority-meta"><span>До: ${formatDate(c.nextStepDue)}</span></div>` : ''}</div></div>
                <div class="stats-grid"><div class="stat-card"><div class="stat-value">${c.daysInStage}</div><div class="stat-label">Дней на этапе</div></div><div class="stat-card"><div class="stat-value">${c.feedbacks?.length || 0}</div><div class="stat-label">Фидбеков</div></div><div class="stat-card"><div class="stat-value">${c.rating || '-'}</div><div class="stat-label">Рейтинг</div></div></div>
            </div>
            <div class="candidate-tab-content active" id="tab-timeline">${renderRichTimeline(c)}</div>
            <div class="candidate-tab-content" id="tab-feedback">
                ${(c.feedbacks && c.feedbacks.length > 0) ? `
                <div class="card mb-4" style="border:2px solid var(--primary-light)"><div style="padding:14px 16px">
                    <div style="font-weight:600;font-size:.85rem;margin-bottom:10px">Сводка по ${c.feedbacks.length} фидбекам</div>
                    <div style="display:flex;gap:14px;margin-bottom:10px">
                        <div style="text-align:center"><div style="font-size:1.5rem;font-weight:700;color:var(--primary)">${(c.feedbacks.reduce((sum, fb) => sum + fb.rating, 0) / c.feedbacks.length).toFixed(1)}</div><div class="text-muted" style="font-size:.7rem">Средний рейтинг</div></div>
                        <div style="flex:1;display:flex;flex-wrap:wrap;gap:6px;align-items:center">${c.feedbacks.map(fb => {
                            const iv = hiringManagers.find(m => m.id === fb.interviewerId);
                            const color = fb.rating >= 4 ? 'var(--success)' : fb.rating >= 3 ? 'var(--warning)' : 'var(--danger)';
                            return `<span style="display:inline-flex;align-items:center;gap:4px;padding:3px 8px;border-radius:var(--radius-full);font-size:.7rem;border:1px solid var(--border)">${ava(iv?.name || '?', 18)} <span style="color:${color};font-weight:600">${fb.rating}/5</span></span>`;
                        }).join('')}</div>
                    </div>
                    <div style="font-size:.8rem;color:var(--text-2)">Рекомендация: <strong>${(() => {
                        const recs = c.feedbacks.map(fb => fb.recommendation);
                        const hires = recs.filter(r => r === 'hire').length;
                        const total = recs.length;
                        if (hires === total) return '<span style="color:var(--success)">Единогласно: Нанять</span>';
                        if (hires > total / 2) return '<span style="color:var(--success)">Большинство: Нанять</span>';
                        const nexts = recs.filter(r => r === 'next_stage').length;
                        if (nexts > 0) return '<span style="color:var(--info)">Продолжить отбор</span>';
                        return '<span style="color:var(--warning)">Нет консенсуса</span>';
                    })()}</strong></div>
                </div></div>` : ''}
                ${(c.feedbacks || []).map(fb => { const iv = hiringManagers.find(m => m.id === fb.interviewerId); return `<div class="feedback-card"><div class="feedback-header"><div class="feedback-author">${ava(iv?.name || '?', 30)}<div><div class="feedback-author-name">${iv?.name || '?'}</div><div class="feedback-author-role">${iv?.role || ''} · ${formatDate(fb.date)}</div></div></div><span class="feedback-rating ${fb.rating >= 4 ? 'positive' : fb.rating >= 3 ? 'neutral' : 'negative'}">${fb.rating}/5 — ${getRecommendationLabel(fb.recommendation)}</span></div><div class="feedback-body">${fb.strengths ? `<p><strong>Сильные:</strong> ${fb.strengths}</p>` : ''}${fb.weaknesses ? `<p><strong>Зоны развития:</strong> ${fb.weaknesses}</p>` : ''}${fb.comment ? `<p>${fb.comment}</p>` : ''}</div></div>`; }).join('') || '<p class="text-muted">Нет фидбеков</p>'}
                <button class="btn btn-outline mt-4" onclick="openFeedbackModal(${c.id});closeModal('candidateModal')">${ic('plus')} Добавить фидбек</button></div>
            <div class="candidate-tab-content" id="tab-notes">${(c.notes || []).map(n => `<div class="feedback-card"><div class="feedback-header"><div class="feedback-author"><div><div class="feedback-author-name">${n.author}</div><div class="feedback-author-role">${formatDate(n.date)}</div></div></div></div><div class="feedback-body">${n.text}</div></div>`).join('') || '<p class="text-muted">Нет заметок</p>'}
                <div class="note-input"><input type="text" placeholder="Добавить заметку..." id="newNoteInput"><button class="btn btn-primary" onclick="addNote(${c.id})">${ic('plus')}</button></div></div>
        </div></div>`;
    document.querySelectorAll('.candidate-tab').forEach(tab => { tab.addEventListener('click', () => { document.querySelectorAll('.candidate-tab').forEach(t => t.classList.remove('active')); document.querySelectorAll('.candidate-tab-content').forEach(c => c.classList.remove('active')); tab.classList.add('active'); document.getElementById(`tab-${tab.dataset.tab}`).classList.add('active'); }); });
    openModal('candidateModal');
}

function getRecommendationLabel(r) { return { hire:'Нанять', next_stage:'След. этап', hold:'Отложить', reject:'Отказать' }[r] || r; }
function addNote(id) { const inp = document.getElementById('newNoteInput'); const t = inp.value.trim(); if (!t) return; const c = candidates.find(x => x.id === id); if (c) { if (!c.notes) c.notes = []; c.notes.unshift({ id: Date.now(), text: t, author: 'Мария Иванова', date: new Date().toISOString().split('T')[0] }); inp.value = ''; openCandidateModal(id); showToast('success', 'Заметка', 'Добавлена'); } }

// ===== Modals =====
function initModals() {
    document.querySelectorAll('.modal-overlay').forEach(o => o.addEventListener('click', () => o.closest('.modal').classList.remove('active')));
    document.querySelectorAll('[data-close-modal]').forEach(b => b.addEventListener('click', () => b.closest('.modal').classList.remove('active')));
    document.getElementById('addCandidateBtn').addEventListener('click', () => openModal('addCandidateModal'));
}
function openModal(id) { document.getElementById(id).classList.add('active'); }
function closeModal(id) { document.getElementById(id).classList.remove('active'); }

function openScheduleInterview(id) { const c = candidates.find(x => x.id === id); if (!c) return; document.getElementById('interviewCandidateId').value = id; document.getElementById('interviewCandidateName').value = `${c.firstName} ${c.lastName}`; const d = new Date(); d.setDate(d.getDate() + 1); document.querySelector('#scheduleInterviewForm input[name="date"]').value = d.toISOString().split('T')[0]; openModal('scheduleInterviewModal'); }
function openFeedbackModal(id, iid) { const c = candidates.find(x => x.id === id); if (!c) return; document.getElementById('feedbackCandidateId').value = id; document.getElementById('feedbackInterviewId').value = iid || ''; document.getElementById('feedbackCandidateName').value = `${c.firstName} ${c.lastName}`; openModal('feedbackModal'); }
function openRejectModal(id) { const c = candidates.find(x => x.id === id); if (!c) return; document.getElementById('rejectCandidateId').value = id; document.getElementById('rejectCandidateName').value = `${c.firstName} ${c.lastName}`; openModal('rejectModal'); }
function openOfferModal(id) { const c = candidates.find(x => x.id === id); if (!c) return; const v = vacancies.find(x => x.id === c.vacancyId); document.getElementById('offerCandidateId').value = id; document.getElementById('offerCandidateName').value = `${c.firstName} ${c.lastName}`; document.getElementById('offerPosition').value = v ? v.title : ''; const sd = new Date(); sd.setDate(sd.getDate() + 14); document.querySelector('#offerForm input[name="startDate"]').value = sd.toISOString().split('T')[0]; const ed = new Date(); ed.setDate(ed.getDate() + 5); document.querySelector('#offerForm input[name="expiryDate"]').value = ed.toISOString().split('T')[0]; openModal('offerModal'); }
function openMoveStage(id) { const c = candidates.find(x => x.id === id); if (!c) return; document.getElementById('moveStageCandidateId').value = id; document.getElementById('moveStageSelect').value = c.stage; openModal('moveStageModal'); }

function openCreateVacancyModal() {
    const ds = document.getElementById('vacancyDepartment'); if (ds) ds.innerHTML = departments.map(d => `<option value="${d.id}">${d.name}</option>`).join('');
    const ms = document.getElementById('vacancyManager'); if (ms) ms.innerHTML = hiringManagers.map(m => `<option value="${m.id}">${m.name} (${m.role})</option>`).join('');
    const dl = document.querySelector('#createVacancyForm input[name="deadline"]'); if (dl) { const d = new Date(); d.setDate(d.getDate() + 30); dl.value = d.toISOString().split('T')[0]; }
    openModal('createVacancyModal');
}

// ===== Panels =====
function initPanels() {
    document.getElementById('notificationsBtn').addEventListener('click', () => { document.getElementById('notificationsPanel').classList.toggle('active'); document.getElementById('quickActionsPanel').classList.remove('active'); renderNotifications(); });
    document.getElementById('quickActionsBtn').addEventListener('click', () => { document.getElementById('quickActionsPanel').classList.toggle('active'); document.getElementById('notificationsPanel').classList.remove('active'); });
    document.querySelectorAll('.quick-action-item').forEach(item => { item.addEventListener('click', () => { document.getElementById('quickActionsPanel').classList.remove('active'); const a = item.dataset.action; if (a === 'addCandidate') openModal('addCandidateModal'); else if (a === 'newVacancy') openCreateVacancyModal(); else showToast('info', 'Действие', item.querySelector('span').textContent); }); });
    document.getElementById('markAllRead').addEventListener('click', () => { notifications.forEach(n => n.read = true); renderNotifications(); document.querySelector('.notification-count').textContent = '0'; showToast('success', 'Готово', 'Все прочитано'); });
    document.addEventListener('click', e => { if (!e.target.closest('#notificationsPanel') && !e.target.closest('#notificationsBtn')) document.getElementById('notificationsPanel').classList.remove('active'); if (!e.target.closest('#quickActionsPanel') && !e.target.closest('#quickActionsBtn')) document.getElementById('quickActionsPanel').classList.remove('active'); });
}

function renderNotifications() {
    document.getElementById('notificationsList').innerHTML = notifications.map(n => `
        <div class="notification-item ${n.read ? '' : 'unread'}" onclick="handleNotificationClick(${n.id})">
            <div class="notification-icon ${n.icon}">${ic(n.icon === 'danger' ? 'alert-circle' : n.icon === 'warning' ? 'clock' : n.icon === 'success' ? 'check' : 'info', 'icon-sm')}</div>
            <div class="notification-content"><strong>${n.title}</strong><p>${n.message}</p><div class="notification-time">${formatTime(n.timestamp)}</div></div>
        </div>`).join('');
}

function handleNotificationClick(id) {
    const n = notifications.find(x => x.id === id); if (!n) return; n.read = true;
    if (n.link) { document.getElementById('notificationsPanel').classList.remove('active'); if (n.link.type === 'candidate') openCandidateModal(n.link.id); else if (n.link.type === 'vacancy') navigateTo('vacancies'); else if (n.link.type === 'interview') navigateTo('interviews'); }
    document.querySelector('.notification-count').textContent = notifications.filter(x => !x.read).length;
}

// ===== Forms =====
function initForms() {
    document.getElementById('addCandidateForm').addEventListener('submit', e => { e.preventDefault(); const fd = new FormData(e.target); const nc = { id: candidates.length + 100, firstName: fd.get('firstName'), lastName: fd.get('lastName'), email: fd.get('email'), phone: fd.get('phone'), vacancyId: parseInt(fd.get('vacancyId')), stage: 'new', source: fd.get('source'), salaryExpectation: fd.get('salaryExpectation'), skills: [], experience: '', createdAt: new Date().toISOString().split('T')[0], updatedAt: new Date().toISOString().split('T')[0], daysInStage: 0, rating: 0, inTalentPool: false, notes: fd.get('notes') ? [{ id: 1, text: fd.get('notes'), author: 'Мария Иванова', date: new Date().toISOString().split('T')[0] }] : [], timeline: [{ date: new Date().toISOString().split('T')[0], event: 'Добавлен', type: 'created', description: 'Добавлен в систему' }], feedbacks: [] }; candidates.push(nc); closeModal('addCandidateModal'); e.target.reset(); showToast('success', 'Добавлен', `${nc.firstName} ${nc.lastName}`); if (currentPage === 'candidates') renderCandidates(); else if (currentPage === 'pipeline') renderPipeline(); });
    document.getElementById('scheduleInterviewForm').addEventListener('submit', e => { e.preventDefault(); const fd = new FormData(e.target); const cid = parseInt(fd.get('candidateId')); const c = candidates.find(x => x.id === cid); interviews.push({ id: interviews.length + 100, candidateId: cid, vacancyId: c.vacancyId, type: fd.get('interviewType'), date: fd.get('date'), time: fd.get('time'), duration: parseInt(fd.get('duration')), format: fd.get('format'), interviewers: fd.getAll('interviewers').map(i => parseInt(i)), status: 'scheduled', notes: fd.get('notes') }); closeModal('scheduleInterviewModal'); e.target.reset(); showToast('success', 'Интервью', `Назначено на ${formatDate(fd.get('date'))}`); if (currentPage === 'interviews') renderInterviews(); });
    document.getElementById('feedbackForm').addEventListener('submit', e => { e.preventDefault(); const fd = new FormData(e.target); const c = candidates.find(x => x.id === parseInt(fd.get('candidateId'))); if (!c.feedbacks) c.feedbacks = []; c.feedbacks.push({ id: Date.now(), interviewerId: 1, rating: parseInt(fd.get('rating')), recommendation: fd.get('recommendation'), strengths: fd.get('strengths'), weaknesses: fd.get('weaknesses'), comment: fd.get('comment'), date: new Date().toISOString().split('T')[0] }); closeModal('feedbackModal'); e.target.reset(); showToast('success', 'Фидбек', 'Сохранен'); });
    document.getElementById('rejectForm').addEventListener('submit', e => { e.preventDefault(); const fd = new FormData(e.target); const c = candidates.find(x => x.id === parseInt(fd.get('candidateId'))); c.stage = 'rejected'; c.rejectionReason = fd.get('reason'); if (fd.get('addToPool')) { c.inTalentPool = true; talentPool.push({ id: talentPool.length + 100, candidateId: c.id, reason: fd.get('details') || 'Для будущих вакансий', addedAt: new Date().toISOString().split('T')[0], tags: c.skills.slice(0, 3), lastContactAt: new Date().toISOString().split('T')[0], nextContactAt: new Date(Date.now() + 90 * 86400000).toISOString().split('T')[0] }); } closeModal('rejectModal'); e.target.reset(); showToast('success', 'Отказ', `${c.firstName} ${c.lastName}`); if (currentPage === 'candidates') renderCandidates(); else if (currentPage === 'pipeline') renderPipeline(); });
    document.getElementById('offerForm').addEventListener('submit', e => { e.preventDefault(); const fd = new FormData(e.target); const c = candidates.find(x => x.id === parseInt(fd.get('candidateId'))); offers.push({ id: offers.length + 100, candidateId: c.id, vacancyId: c.vacancyId, status: 'pending', salary: fd.get('salary'), bonus: fd.get('bonus'), startDate: fd.get('startDate'), probation: parseInt(fd.get('probation')), workFormat: fd.get('workFormat'), benefits: fd.get('benefits'), expiryDate: fd.get('expiryDate'), createdAt: new Date().toISOString().split('T')[0] }); c.stage = 'offer'; closeModal('offerModal'); e.target.reset(); showToast('success', 'Оффер', 'Создан'); if (currentPage === 'offers') renderOffers(); });
    document.getElementById('moveStageForm').addEventListener('submit', e => { e.preventDefault(); const fd = new FormData(e.target); const c = candidates.find(x => x.id === parseInt(fd.get('candidateId'))); const os = c.stage; const ns = fd.get('stage'); c.stage = ns; c.daysInStage = 0; c.updatedAt = new Date().toISOString().split('T')[0]; if (!c.timeline) c.timeline = []; c.timeline.push({ date: c.updatedAt, event: getStageLabel(ns), type: 'stage', description: `${getStageLabel(os)} → ${getStageLabel(ns)}` }); closeModal('moveStageModal'); e.target.reset(); showToast('success', 'Этап', `${c.firstName} ${c.lastName} → ${getStageLabel(ns)}`); if (currentPage === 'candidates') renderCandidates(); else if (currentPage === 'pipeline') renderPipeline(); });
    document.getElementById('createVacancyForm').addEventListener('submit', e => { e.preventDefault(); const fd = new FormData(e.target); vacancies.push({ id: vacancies.length + 200, title: fd.get('title'), department: parseInt(fd.get('department')), managerId: parseInt(fd.get('managerId')), status: 'active', priority: fd.get('priority'), urgent: !!fd.get('urgent'), salary: { min: parseInt(fd.get('salaryMin')) || 0, max: parseInt(fd.get('salaryMax')) || 0, currency: 'RUB' }, location: fd.get('location') || '', workFormat: fd.get('workFormat'), createdAt: new Date().toISOString().split('T')[0], deadline: fd.get('deadline') || '', description: fd.get('description') || '', requirements: fd.get('requirements') ? fd.get('requirements').split(',').map(r => r.trim()).filter(Boolean) : [], niceToHave: [], candidatesCount: 0, stages: { new: 0, screening: 0, interview: 0, technical: 0, final: 0, offer: 0, hired: 0 } }); closeModal('createVacancyModal'); e.target.reset(); showToast('success', 'Вакансия', 'Создана'); if (currentPage === 'vacancies') renderVacancies(); });
}

// ===== Toast =====
function showToast(type, title, message) {
    const c = document.getElementById('toastContainer');
    const t = document.createElement('div'); t.className = `toast ${type}`;
    const iconName = type === 'success' ? 'check' : type === 'error' ? 'x' : type === 'warning' ? 'alert-triangle' : 'info';
    t.innerHTML = `<div class="toast-icon">${ic(iconName, 'icon-sm')}</div><div class="toast-content"><div class="toast-title">${title}</div><div class="toast-message">${message}</div></div><button class="toast-close" onclick="this.parentElement.remove()">${ic('x', 'icon-sm')}</button>`;
    c.appendChild(t); setTimeout(() => t.remove(), 4000);
}

// ===== Utilities =====
function formatDate(d) { if (!d) return '-'; return new Date(d).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' }); }
function formatTime(ts) { const d = new Date(ts); const ms = Date.now() - d; const m = Math.floor(ms / 60000); const h = Math.floor(ms / 3600000); const dd = Math.floor(ms / 86400000); if (m < 60) return `${m} мин назад`; if (h < 24) return `${h} ч назад`; if (dd < 7) return `${dd} дн назад`; return formatDate(ts); }
function formatSalary(s) { if (!s) return '-'; return `${(s.min / 1000).toFixed(0)}-${(s.max / 1000).toFixed(0)}k`; }

// ===== Global Search =====
const globalSearchInput = document.getElementById('globalSearch');
const searchDropdown = document.getElementById('searchDropdown');
let searchHI = -1;

function highlightText(text, q) { if (!q) return text; return text.replace(new RegExp(`(${q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi'), '<mark>$1</mark>'); }

function renderSearchDD(q) {
    if (!q || q.length < 1) { searchDropdown.classList.remove('active'); searchHI = -1; return; }
    const ql = q.toLowerCase();
    const mc = candidates.filter(c => `${c.firstName} ${c.lastName}`.toLowerCase().includes(ql) || c.email.toLowerCase().includes(ql)).slice(0, 5);
    const mv = vacancies.filter(v => v.title.toLowerCase().includes(ql)).slice(0, 3);
    if (!mc.length && !mv.length) { searchDropdown.innerHTML = `<div class="search-dropdown-empty">Ничего не найдено</div>`; searchDropdown.classList.add('active'); return; }
    let html = '';
    if (mc.length) html += `<div class="search-dropdown-section"><div class="search-dropdown-label">Кандидаты</div>${mc.map(c => { const v = vacancies.find(x => x.id === c.vacancyId); return `<div class="search-dropdown-item" data-type="candidate" data-id="${c.id}">${ava(c.firstName + ' ' + c.lastName, 32)}<div class="search-item-info"><div class="search-item-title">${highlightText(`${c.firstName} ${c.lastName}`, q)}</div><div class="search-item-subtitle">${v ? v.title : ''} · ${c.experience}</div></div><span class="stage-badge ${c.stage}">${getStageLabel(c.stage)}</span></div>`; }).join('')}</div>`;
    if (mv.length) html += `<div class="search-dropdown-section"><div class="search-dropdown-label">Вакансии</div>${mv.map(v => { const d = departments.find(x => x.id === v.department); return `<div class="search-dropdown-item" data-type="vacancy" data-id="${v.id}"><div style="width:32px;height:32px;border-radius:var(--radius);background:var(--bg-hover);display:flex;align-items:center;justify-content:center">${ic('briefcase','icon-sm')}</div><div class="search-item-info"><div class="search-item-title">${highlightText(v.title, q)}</div><div class="search-item-subtitle">${d ? d.name : ''} · ${v.candidatesCount} канд.</div></div><span class="vacancy-status ${v.status}">${getStatusLabel(v.status)}</span></div>`; }).join('')}</div>`;
    html += `<div class="search-dropdown-hint"><kbd>↑↓</kbd> навигация <kbd>Enter</kbd> перейти <kbd>Esc</kbd> закрыть</div>`;
    searchDropdown.innerHTML = html; searchDropdown.classList.add('active'); searchHI = -1;
    searchDropdown.querySelectorAll('.search-dropdown-item').forEach(item => { item.addEventListener('click', () => { searchDropdown.classList.remove('active'); globalSearchInput.value = ''; globalSearchInput.blur(); if (item.dataset.type === 'candidate') openCandidateModal(parseInt(item.dataset.id)); else openVacancyModal(parseInt(item.dataset.id)); }); });
}

globalSearchInput.addEventListener('input', e => renderSearchDD(e.target.value));
globalSearchInput.addEventListener('focus', () => { if (globalSearchInput.value.length >= 1) renderSearchDD(globalSearchInput.value); });
globalSearchInput.addEventListener('keydown', e => {
    const items = searchDropdown.querySelectorAll('.search-dropdown-item');
    if (e.key === 'Escape') { searchDropdown.classList.remove('active'); globalSearchInput.blur(); return; }
    if (!searchDropdown.classList.contains('active') || !items.length) return;
    if (e.key === 'ArrowDown') { e.preventDefault(); searchHI = Math.min(searchHI + 1, items.length - 1); items.forEach((it, i) => it.classList.toggle('highlighted', i === searchHI)); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); searchHI = Math.max(searchHI - 1, 0); items.forEach((it, i) => it.classList.toggle('highlighted', i === searchHI)); }
    else if (e.key === 'Enter') { e.preventDefault(); if (searchHI >= 0 && items[searchHI]) items[searchHI].click(); }
});
document.addEventListener('click', e => { if (!e.target.closest('#searchBox')) searchDropdown.classList.remove('active'); });

// ===== Command Palette =====
const cmdOverlay = document.getElementById('cmdOverlay');
const cmdInput = document.getElementById('cmdInput');
const cmdResults = document.getElementById('cmdResults');
let cmdHI = -1;

function getCommands(q) {
    const ql = (q || '').toLowerCase();
    let cmds = [];
    // Navigation
    cmds.push({ cat: 'Навигация', icon: 'home', label: 'Дашборд', action: () => navigateTo('dashboard') });
    cmds.push({ cat: 'Навигация', icon: 'clipboard', label: 'Вакансии', action: () => navigateTo('vacancies') });
    cmds.push({ cat: 'Навигация', icon: 'users', label: 'Кандидаты', action: () => navigateTo('candidates') });
    cmds.push({ cat: 'Навигация', icon: 'columns', label: 'Воронка', action: () => navigateTo('pipeline') });
    cmds.push({ cat: 'Навигация', icon: 'calendar', label: 'Интервью', action: () => navigateTo('interviews') });
    cmds.push({ cat: 'Навигация', icon: 'bar-chart', label: 'Аналитика', action: () => navigateTo('analytics') });
    cmds.push({ cat: 'Навигация', icon: 'settings', label: 'Настройки', action: () => navigateTo('settings') });
    // Actions
    cmds.push({ cat: 'Действия', icon: 'user-plus', label: 'Добавить кандидата', action: () => openModal('addCandidateModal') });
    cmds.push({ cat: 'Действия', icon: 'plus', label: 'Создать вакансию', action: () => openCreateVacancyModal() });
    cmds.push({ cat: 'Действия', icon: 'inbox', label: 'Разобрать новые отклики', hint: `${candidates.filter(c=>c.stage==='new').length} новых`, action: () => { navigateTo('candidates'); setTimeout(()=>applySavedFilter('new'),50); } });
    cmds.push({ cat: 'Действия', icon: 'check', label: 'Все новые → в скрининг', hint: 'bulk', action: () => { candidates.filter(c=>c.stage==='new').forEach(c=>{c.stage='screening';c.daysInStage=0}); showToast('success','Bulk','Все новые переведены в скрининг'); if(currentPage==='candidates')renderCandidates(); } });
    // Candidate actions
    candidates.slice(0, 20).forEach(c => {
        cmds.push({ cat: 'Кандидаты', icon: 'user', label: `${c.firstName} ${c.lastName}`, hint: `${getStageLabel(c.stage)} · ${vacancies.find(v=>v.id===c.vacancyId)?.title||''}`, action: () => openCandidateModal(c.id) });
    });
    // Filter by query
    if (ql) cmds = cmds.filter(c => c.label.toLowerCase().includes(ql) || (c.hint||'').toLowerCase().includes(ql));
    return cmds.slice(0, 15);
}

function renderCmdResults(q) {
    const cmds = getCommands(q);
    if (cmds.length === 0) { cmdResults.innerHTML = '<div style="padding:20px;text-align:center;color:var(--text-3);font-size:.85rem">Ничего не найдено</div>'; return; }
    let html = '';
    let lastCat = '';
    cmds.forEach((c, i) => {
        if (c.cat !== lastCat) { html += `<div class="cmd-group-label">${c.cat}</div>`; lastCat = c.cat; }
        html += `<div class="cmd-item ${i===cmdHI?'highlighted':''}" data-cmd-idx="${i}">${ic(c.icon)} <span class="cmd-label">${c.label}</span>${c.hint?`<span class="cmd-hint">${c.hint}</span>`:''}</div>`;
    });
    cmdResults.innerHTML = html;
    cmdResults.querySelectorAll('.cmd-item').forEach(item => {
        item.addEventListener('click', () => {
            const idx = parseInt(item.dataset.cmdIdx);
            closeCmdPalette();
            cmds[idx]?.action();
        });
    });
}

function openCmdPalette() {
    cmdOverlay.classList.add('active');
    cmdInput.value = '';
    cmdHI = -1;
    renderCmdResults('');
    setTimeout(() => cmdInput.focus(), 50);
}

function closeCmdPalette() {
    cmdOverlay.classList.remove('active');
    cmdInput.value = '';
}

cmdInput.addEventListener('input', () => { cmdHI = -1; renderCmdResults(cmdInput.value); });
cmdInput.addEventListener('keydown', e => {
    const items = cmdResults.querySelectorAll('.cmd-item');
    if (e.key === 'ArrowDown') { e.preventDefault(); cmdHI = Math.min(cmdHI+1, items.length-1); items.forEach((it,i)=>it.classList.toggle('highlighted',i===cmdHI)); items[cmdHI]?.scrollIntoView({block:'nearest'}); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); cmdHI = Math.max(cmdHI-1, 0); items.forEach((it,i)=>it.classList.toggle('highlighted',i===cmdHI)); items[cmdHI]?.scrollIntoView({block:'nearest'}); }
    else if (e.key === 'Enter') { e.preventDefault(); if (cmdHI >= 0 && items[cmdHI]) items[cmdHI].click(); }
    else if (e.key === 'Escape') { closeCmdPalette(); }
});
cmdOverlay.addEventListener('click', e => { if (e.target === cmdOverlay) closeCmdPalette(); });

// ===== Keyboard Shortcuts =====
document.addEventListener('keydown', e => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (cmdOverlay.classList.contains('active')) closeCmdPalette();
        else openCmdPalette();
    }
    if (e.key === 'Escape') {
        if (cmdOverlay.classList.contains('active')) { closeCmdPalette(); return; }
        const m = document.querySelector('.modal.active');
        if (m) { m.classList.remove('active'); return; }
        document.getElementById('notificationsPanel').classList.remove('active');
        document.getElementById('quickActionsPanel').classList.remove('active');
    }
});
