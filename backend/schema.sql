-- WorkHere ATS Database Schema

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Organizations
CREATE TABLE IF NOT EXISTS organizations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(100) UNIQUE,
    plan VARCHAR(50) DEFAULT 'free',
    settings JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Users
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID REFERENCES organizations(id),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255),
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    role VARCHAR(50) DEFAULT 'recruiter',
    phone VARCHAR(50),
    telegram VARCHAR(100),
    settings JSONB DEFAULT '{}',
    last_login_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Departments
CREATE TABLE IF NOT EXISTS departments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID REFERENCES organizations(id),
    name VARCHAR(100) NOT NULL,
    color VARCHAR(7) DEFAULT '#6366f1',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Pipeline stage templates
CREATE TABLE IF NOT EXISTS pipeline_stages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID REFERENCES organizations(id),
    vacancy_id UUID, -- NULL = org-level default
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(50) NOT NULL,
    color VARCHAR(7) DEFAULT '#64748b',
    order_index INTEGER NOT NULL DEFAULT 0,
    is_terminal BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Vacancies
CREATE TABLE IF NOT EXISTS vacancies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID REFERENCES organizations(id),
    title VARCHAR(255) NOT NULL,
    department_id UUID REFERENCES departments(id),
    manager_id UUID REFERENCES users(id),
    status VARCHAR(50) DEFAULT 'active',
    priority VARCHAR(20) DEFAULT 'medium',
    urgent BOOLEAN DEFAULT FALSE,
    salary_min INTEGER,
    salary_max INTEGER,
    salary_currency VARCHAR(3) DEFAULT 'RUB',
    location VARCHAR(255),
    work_format VARCHAR(50) DEFAULT 'hybrid',
    description TEXT,
    requirements JSONB DEFAULT '[]',
    nice_to_have JSONB DEFAULT '[]',
    deadline DATE,
    published_at TIMESTAMPTZ,
    closed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add FK for pipeline_stages.vacancy_id
ALTER TABLE pipeline_stages ADD CONSTRAINT fk_pipeline_vacancy 
    FOREIGN KEY (vacancy_id) REFERENCES vacancies(id) ON DELETE CASCADE;

-- Candidates
CREATE TABLE IF NOT EXISTS candidates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID REFERENCES organizations(id),
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(50),
    telegram VARCHAR(100),
    linkedin VARCHAR(255),
    location VARCHAR(255),
    current_company VARCHAR(255),
    experience VARCHAR(100),
    skills JSONB DEFAULT '[]',
    salary_expectation VARCHAR(100),
    source VARCHAR(50),
    referrer VARCHAR(255),
    resume_url TEXT,
    in_talent_pool BOOLEAN DEFAULT FALSE,
    talent_pool_reason TEXT,
    talent_pool_tags JSONB DEFAULT '[]',
    talent_pool_next_contact DATE,
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Applications (candidate + vacancy link)
CREATE TABLE IF NOT EXISTS applications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    candidate_id UUID REFERENCES candidates(id) ON DELETE CASCADE,
    vacancy_id UUID REFERENCES vacancies(id) ON DELETE CASCADE,
    stage VARCHAR(50) DEFAULT 'new',
    status VARCHAR(50) DEFAULT 'active',
    urgent BOOLEAN DEFAULT FALSE,
    rating INTEGER DEFAULT 0,
    next_step TEXT,
    next_step_due DATE,
    days_in_stage INTEGER DEFAULT 0,
    rejection_reason VARCHAR(100),
    rejection_details TEXT,
    applied_at TIMESTAMPTZ DEFAULT NOW(),
    stage_entered_at TIMESTAMPTZ DEFAULT NOW(),
    hired_at TIMESTAMPTZ,
    rejected_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(candidate_id, vacancy_id)
);

-- Interviews
CREATE TABLE IF NOT EXISTS interviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    application_id UUID REFERENCES applications(id) ON DELETE CASCADE,
    candidate_id UUID REFERENCES candidates(id),
    vacancy_id UUID REFERENCES vacancies(id),
    interview_type VARCHAR(50) NOT NULL,
    scheduled_date DATE NOT NULL,
    scheduled_time TIME NOT NULL,
    duration_minutes INTEGER DEFAULT 60,
    format VARCHAR(50) DEFAULT 'online',
    location VARCHAR(255),
    meeting_url TEXT,
    status VARCHAR(50) DEFAULT 'scheduled',
    notes TEXT,
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Interview participants
CREATE TABLE IF NOT EXISTS interview_participants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    interview_id UUID REFERENCES interviews(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id),
    role VARCHAR(50) DEFAULT 'interviewer',
    UNIQUE(interview_id, user_id)
);

-- Feedbacks
CREATE TABLE IF NOT EXISTS feedbacks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    application_id UUID REFERENCES applications(id) ON DELETE CASCADE,
    interview_id UUID REFERENCES interviews(id),
    user_id UUID REFERENCES users(id),
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    recommendation VARCHAR(50),
    strengths TEXT,
    weaknesses TEXT,
    comment TEXT,
    submitted_at TIMESTAMPTZ DEFAULT NOW()
);

-- Notes
CREATE TABLE IF NOT EXISTS notes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    candidate_id UUID REFERENCES candidates(id) ON DELETE CASCADE,
    application_id UUID REFERENCES applications(id),
    user_id UUID REFERENCES users(id),
    content TEXT NOT NULL,
    is_private BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Offers
CREATE TABLE IF NOT EXISTS offers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    application_id UUID REFERENCES applications(id) ON DELETE CASCADE,
    candidate_id UUID REFERENCES candidates(id),
    vacancy_id UUID REFERENCES vacancies(id),
    salary VARCHAR(100),
    bonus TEXT,
    start_date DATE,
    probation_months INTEGER DEFAULT 3,
    work_format VARCHAR(50),
    benefits TEXT,
    expiry_date DATE,
    status VARCHAR(50) DEFAULT 'pending',
    approvers JSONB DEFAULT '[]',
    approval_status JSONB DEFAULT '{}',
    sent_at TIMESTAMPTZ,
    accepted_at TIMESTAMPTZ,
    rejected_at TIMESTAMPTZ,
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Activity log
CREATE TABLE IF NOT EXISTS activity_log (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID REFERENCES organizations(id),
    user_id UUID REFERENCES users(id),
    entity_type VARCHAR(50),
    entity_id UUID,
    action VARCHAR(100),
    details JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Notifications
CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID REFERENCES organizations(id),
    user_id UUID REFERENCES users(id),
    type VARCHAR(50),
    icon VARCHAR(50),
    title VARCHAR(255),
    message TEXT,
    link JSONB,
    read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_candidates_org ON candidates(organization_id);
CREATE INDEX IF NOT EXISTS idx_candidates_email ON candidates(email);
CREATE INDEX IF NOT EXISTS idx_applications_vacancy ON applications(vacancy_id);
CREATE INDEX IF NOT EXISTS idx_applications_candidate ON applications(candidate_id);
CREATE INDEX IF NOT EXISTS idx_applications_stage ON applications(stage);
CREATE INDEX IF NOT EXISTS idx_interviews_date ON interviews(scheduled_date);
CREATE INDEX IF NOT EXISTS idx_activity_log_entity ON activity_log(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id, read);
