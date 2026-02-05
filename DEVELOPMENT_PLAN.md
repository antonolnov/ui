# План разработки ATS WorkHere

## Обзор проекта

**Цель:** Создать полнофункциональную SaaS ATS-систему для рекрутинговых команд с интеграциями с работными сайтами.

**Целевая аудитория:**
- Рекрутинговые агентства
- HR-отделы компаний (SMB и Enterprise)
- Фрилансеры-рекрутеры

---

## 1. Архитектура системы

### 1.1 Высокоуровневая архитектура

```
┌─────────────────────────────────────────────────────────────────┐
│                        КЛИЕНТЫ                                   │
├─────────────────┬─────────────────┬─────────────────────────────┤
│   Web App       │   Mobile App    │   Browser Extension         │
│   (React)       │   (React Native)│   (Chrome/Firefox)          │
└────────┬────────┴────────┬────────┴──────────────┬──────────────┘
         │                 │                        │
         ▼                 ▼                        ▼
┌─────────────────────────────────────────────────────────────────┐
│                      API GATEWAY                                 │
│              (Rate limiting, Auth, Routing)                      │
└────────────────────────────┬────────────────────────────────────┘
                             │
         ┌───────────────────┼───────────────────┐
         ▼                   ▼                   ▼
┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐
│   Auth Service  │ │   Core API      │ │ Integration     │
│   (JWT/OAuth)   │ │   (REST/GraphQL)│ │ Service         │
└────────┬────────┘ └────────┬────────┘ └────────┬────────┘
         │                   │                   │
         ▼                   ▼                   ▼
┌─────────────────────────────────────────────────────────────────┐
│                      MESSAGE QUEUE (Redis/RabbitMQ)              │
└────────────────────────────┬────────────────────────────────────┘
                             │
    ┌────────────────────────┼────────────────────────┐
    ▼                        ▼                        ▼
┌─────────────┐      ┌─────────────┐      ┌─────────────┐
│ Email       │      │ Parsing     │      │ Analytics   │
│ Worker      │      │ Worker      │      │ Worker      │
└─────────────┘      └─────────────┘      └─────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                      DATABASES                                   │
├─────────────────┬─────────────────┬─────────────────────────────┤
│   PostgreSQL    │   Redis         │   S3/Minio                  │
│   (Main DB)     │   (Cache/Queue) │   (Files/Resumes)           │
└─────────────────┴─────────────────┴─────────────────────────────┘
```

### 1.2 Технологический стек

| Компонент | Технология | Обоснование |
|-----------|------------|-------------|
| **Frontend** | React + TypeScript | Экосистема, типизация, производительность |
| **State Management** | Zustand / TanStack Query | Простота, производительность |
| **UI Library** | Tailwind CSS + Radix UI | Гибкость, доступность |
| **Backend** | Node.js (Fastify) или Python (FastAPI) | Скорость разработки, экосистема |
| **Database** | PostgreSQL | Надежность, JSON поддержка, полнотекстовый поиск |
| **Cache** | Redis | Сессии, очереди, кэширование |
| **Search** | PostgreSQL FTS / Elasticsearch | Поиск по кандидатам |
| **File Storage** | S3 / Minio | Резюме, документы |
| **Email** | SendGrid / AWS SES | Рассылки, уведомления |
| **Auth** | JWT + OAuth 2.0 | Безопасность, интеграции |
| **Realtime** | WebSockets (Socket.io) | Уведомления, обновления |
| **Queue** | BullMQ (Redis) | Фоновые задачи |
| **Hosting** | Vercel + Railway / AWS | Масштабируемость |

---

## 2. Модули системы

### 2.1 Ядро (Core)

#### 2.1.1 Аутентификация и авторизация
- [ ] Регистрация компании/пользователя
- [ ] Вход (email/password)
- [ ] OAuth (Google, Microsoft, LinkedIn)
- [ ] 2FA (TOTP, SMS)
- [ ] SSO (SAML) для Enterprise
- [ ] Управление сессиями
- [ ] Сброс пароля
- [ ] Приглашение пользователей

#### 2.1.2 Мультитенантность
- [ ] Изоляция данных по организациям
- [ ] Роли и права доступа (RBAC)
  - Admin (полный доступ)
  - Recruiter (работа с кандидатами)
  - Hiring Manager (просмотр, фидбек)
  - Viewer (только чтение)
- [ ] Настраиваемые права на уровне вакансии
- [ ] Audit log всех действий

#### 2.1.3 Организации и команды
- [ ] Создание организации
- [ ] Управление пользователями
- [ ] Отделы/команды
- [ ] Биллинг и подписки

### 2.2 Вакансии (Jobs)

#### 2.2.1 Управление вакансиями
- [ ] Создание/редактирование вакансии
- [ ] Шаблоны вакансий
- [ ] Статусы (черновик, активная, пауза, закрыта)
- [ ] Привязка к отделу/локации
- [ ] Нанимающий менеджер
- [ ] Команда рекрутеров

#### 2.2.2 Настройка процесса найма
- [ ] Настраиваемые этапы воронки
- [ ] Шаблоны процессов
- [ ] Автоматические действия на этапах
- [ ] SLA по этапам
- [ ] Скоркарды для оценки

#### 2.2.3 Публикация
- [ ] Карьерная страница (виджет)
- [ ] Публикация на работные сайты
- [ ] Реферальные ссылки
- [ ] QR-коды для вакансий

### 2.3 Кандидаты (Candidates)

#### 2.3.1 Профиль кандидата
- [ ] Основная информация (ФИО, контакты)
- [ ] Множественные контакты (email, телефон, соцсети)
- [ ] Резюме и документы
- [ ] Навыки и опыт (структурированно)
- [ ] Ожидания (зарплата, формат, локация)
- [ ] Теги и кастомные поля

#### 2.3.2 Управление кандидатами
- [ ] Добавление вручную
- [ ] Импорт из файла (CSV, Excel)
- [ ] Парсинг резюме (AI)
- [ ] Дедупликация
- [ ] Объединение профилей
- [ ] Массовые действия
- [ ] Архивация/удаление

#### 2.3.3 Связь с вакансиями
- [ ] Один кандидат — много вакансий
- [ ] Независимые статусы по вакансиям
- [ ] История по каждой вакансии

### 2.4 Воронка (Pipeline)

#### 2.4.1 Движение по этапам
- [ ] Drag-and-drop перемещение
- [ ] Обязательные поля при переходе
- [ ] Автоматические действия
- [ ] История изменений

#### 2.4.2 Отказы
- [ ] Структурированные причины
- [ ] Автоматические письма
- [ ] Добавление в талант-пул

### 2.5 Коммуникации

#### 2.5.1 Email
- [ ] Отправка из системы
- [ ] Шаблоны писем
- [ ] Переменные (имя, вакансия, etc.)
- [ ] Отслеживание открытий/кликов
- [ ] Массовые рассылки
- [ ] Синхронизация с почтой (Gmail, Outlook)

#### 2.5.2 Календарь
- [ ] Интеграция с Google Calendar
- [ ] Интеграция с Outlook Calendar
- [ ] Букинг слотов (Calendly-like)
- [ ] Напоминания

#### 2.5.3 Внутренние коммуникации
- [ ] Заметки по кандидату
- [ ] Комментарии с упоминаниями
- [ ] Внутренний чат

### 2.6 Интервью

#### 2.6.1 Планирование
- [ ] Назначение интервью
- [ ] Выбор интервьюеров
- [ ] Проверка доступности
- [ ] Отправка приглашений
- [ ] Переносы и отмены

#### 2.6.2 Проведение
- [ ] Видео-интервью (интеграция с Zoom/Meet)
- [ ] Заметки во время интервью
- [ ] Запись (опционально)

#### 2.6.3 Оценка
- [ ] Скоркарды
- [ ] Структурированный фидбек
- [ ] Рейтинги по критериям
- [ ] Рекомендации (нанять/отказать)
- [ ] Консолидация фидбеков

### 2.7 Офферы

#### 2.7.1 Создание оффера
- [ ] Шаблоны офферов
- [ ] Условия (зарплата, бонусы, equity)
- [ ] Дата выхода
- [ ] Дополнительные условия

#### 2.7.2 Согласование
- [ ] Цепочка согласований
- [ ] Уведомления согласующим
- [ ] История версий
- [ ] Электронная подпись (опционально)

#### 2.7.3 Отслеживание
- [ ] Статусы оффера
- [ ] Контроль сроков
- [ ] Контр-офферы

### 2.8 Талант-пул

- [ ] Сохранение кандидатов
- [ ] Сегментация (теги, списки)
- [ ] Nurturing-кампании
- [ ] Напоминания о контакте
- [ ] Поиск по пулу

### 2.9 Карьерная страница

- [ ] Конструктор страниц
- [ ] Брендирование
- [ ] Форма отклика
- [ ] Виджет для сайта
- [ ] Мультиязычность

### 2.10 Аналитика

#### 2.10.1 Операционные метрики
- [ ] Time-to-hire
- [ ] Time-in-stage
- [ ] Конверсия по этапам
- [ ] Источники кандидатов
- [ ] Эффективность рекрутеров
- [ ] SLA compliance

#### 2.10.2 Отчеты
- [ ] Предустановленные отчеты
- [ ] Кастомные отчеты
- [ ] Экспорт (PDF, Excel)
- [ ] Scheduled отчеты

#### 2.10.3 Дашборды
- [ ] Настраиваемые виджеты
- [ ] Фильтры и периоды

---

## 3. Интеграции с работными сайтами

### 3.1 HeadHunter (hh.ru)

**API:** https://api.hh.ru/

| Функция | Метод | Приоритет |
|---------|-------|-----------|
| Публикация вакансий | POST /vacancies | P0 |
| Получение откликов | GET /negotiations | P0 |
| Парсинг резюме | GET /resumes/{id} | P0 |
| Поиск резюме | GET /resumes | P1 |
| Статусы откликов | PUT /negotiations/{id} | P1 |
| Сообщения кандидатам | POST /negotiations/{id}/messages | P2 |

**Требования:**
- OAuth 2.0 авторизация
- Вебхуки для откликов
- Rate limiting handling

### 3.2 SuperJob

**API:** https://api.superjob.ru/

| Функция | Приоритет |
|---------|-----------|
| Публикация вакансий | P1 |
| Получение откликов | P1 |
| Парсинг резюме | P1 |

### 3.3 LinkedIn

**API:** LinkedIn Recruiter API / LinkedIn Jobs

| Функция | Приоритет |
|---------|-----------|
| Публикация вакансий | P1 |
| LinkedIn Profile Enrichment | P2 |
| InMail интеграция | P2 |

### 3.4 Работа.ру / Авито Работа

| Функция | Приоритет |
|---------|-----------|
| Публикация вакансий | P2 |
| Получение откликов | P2 |

### 3.5 Indeed / Glassdoor

| Функция | Приоритет |
|---------|-----------|
| XML-фид вакансий | P2 |
| Sponsored jobs | P3 |

### 3.6 Агрегаторы

- [ ] Talantix интеграция
- [ ] Potok интеграция
- [ ] XML-фид для агрегаторов

---

## 4. Дополнительные интеграции

### 4.1 Коммуникации
| Сервис | Функция | Приоритет |
|--------|---------|-----------|
| Gmail | Синхронизация почты | P0 |
| Outlook | Синхронизация почты | P0 |
| Google Calendar | Календарь | P0 |
| Outlook Calendar | Календарь | P0 |
| Zoom | Видео-интервью | P1 |
| Google Meet | Видео-интервью | P1 |
| Telegram | Уведомления | P1 |
| Slack | Уведомления | P2 |
| WhatsApp Business | Сообщения | P2 |

### 4.2 HR-системы
| Сервис | Функция | Приоритет |
|--------|---------|-----------|
| 1С:ЗУП | Синхронизация сотрудников | P2 |
| SAP SuccessFactors | Onboarding | P3 |
| Workday | Onboarding | P3 |

### 4.3 Background Check
| Сервис | Функция | Приоритет |
|--------|---------|-----------|
| CheckPerson | Проверка кандидатов | P2 |

### 4.4 AI/ML сервисы
| Сервис | Функция | Приоритет |
|--------|---------|-----------|
| OpenAI | Парсинг резюме, генерация | P1 |
| Resume Parsing API | Структурирование резюме | P1 |

---

## 5. База данных (схема)

### 5.1 Основные сущности

```sql
-- Организации
CREATE TABLE organizations (
    id UUID PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(100) UNIQUE,
    plan VARCHAR(50) DEFAULT 'free',
    settings JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Пользователи
CREATE TABLE users (
    id UUID PRIMARY KEY,
    organization_id UUID REFERENCES organizations(id),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255),
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    role VARCHAR(50) DEFAULT 'recruiter',
    avatar_url TEXT,
    settings JSONB DEFAULT '{}',
    last_login_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Вакансии
CREATE TABLE jobs (
    id UUID PRIMARY KEY,
    organization_id UUID REFERENCES organizations(id),
    title VARCHAR(255) NOT NULL,
    department VARCHAR(100),
    location VARCHAR(255),
    employment_type VARCHAR(50),
    salary_min INTEGER,
    salary_max INTEGER,
    salary_currency VARCHAR(3) DEFAULT 'RUB',
    description TEXT,
    requirements JSONB,
    status VARCHAR(50) DEFAULT 'draft',
    hiring_manager_id UUID REFERENCES users(id),
    created_by UUID REFERENCES users(id),
    published_at TIMESTAMPTZ,
    closed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Этапы воронки (шаблон)
CREATE TABLE pipeline_stages (
    id UUID PRIMARY KEY,
    organization_id UUID REFERENCES organizations(id),
    job_id UUID REFERENCES jobs(id), -- NULL = шаблон организации
    name VARCHAR(100) NOT NULL,
    order_index INTEGER NOT NULL,
    color VARCHAR(7),
    is_terminal BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Кандидаты
CREATE TABLE candidates (
    id UUID PRIMARY KEY,
    organization_id UUID REFERENCES organizations(id),
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    email VARCHAR(255),
    phone VARCHAR(50),
    location VARCHAR(255),
    current_company VARCHAR(255),
    current_title VARCHAR(255),
    experience_years DECIMAL(3,1),
    salary_expectation INTEGER,
    salary_currency VARCHAR(3) DEFAULT 'RUB',
    skills JSONB DEFAULT '[]',
    tags JSONB DEFAULT '[]',
    source VARCHAR(100),
    source_details JSONB,
    resume_url TEXT,
    resume_text TEXT,
    linkedin_url TEXT,
    custom_fields JSONB DEFAULT '{}',
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Связь кандидат-вакансия (Application)
CREATE TABLE applications (
    id UUID PRIMARY KEY,
    candidate_id UUID REFERENCES candidates(id),
    job_id UUID REFERENCES jobs(id),
    stage_id UUID REFERENCES pipeline_stages(id),
    status VARCHAR(50) DEFAULT 'active', -- active, hired, rejected, withdrawn
    rejection_reason VARCHAR(100),
    rejection_details TEXT,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    source VARCHAR(100),
    applied_at TIMESTAMPTZ DEFAULT NOW(),
    stage_entered_at TIMESTAMPTZ DEFAULT NOW(),
    hired_at TIMESTAMPTZ,
    rejected_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(candidate_id, job_id)
);

-- Интервью
CREATE TABLE interviews (
    id UUID PRIMARY KEY,
    application_id UUID REFERENCES applications(id),
    interview_type VARCHAR(50),
    scheduled_at TIMESTAMPTZ,
    duration_minutes INTEGER DEFAULT 60,
    location VARCHAR(255),
    meeting_url TEXT,
    status VARCHAR(50) DEFAULT 'scheduled',
    notes TEXT,
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Интервьюеры
CREATE TABLE interview_participants (
    id UUID PRIMARY KEY,
    interview_id UUID REFERENCES interviews(id),
    user_id UUID REFERENCES users(id),
    role VARCHAR(50) DEFAULT 'interviewer',
    UNIQUE(interview_id, user_id)
);

-- Фидбек
CREATE TABLE feedbacks (
    id UUID PRIMARY KEY,
    application_id UUID REFERENCES applications(id),
    interview_id UUID REFERENCES interviews(id),
    user_id UUID REFERENCES users(id),
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    recommendation VARCHAR(50), -- strong_hire, hire, no_hire, strong_no_hire
    scorecard JSONB,
    strengths TEXT,
    weaknesses TEXT,
    notes TEXT,
    submitted_at TIMESTAMPTZ DEFAULT NOW()
);

-- Заметки
CREATE TABLE notes (
    id UUID PRIMARY KEY,
    candidate_id UUID REFERENCES candidates(id),
    application_id UUID REFERENCES applications(id),
    user_id UUID REFERENCES users(id),
    content TEXT NOT NULL,
    is_private BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Офферы
CREATE TABLE offers (
    id UUID PRIMARY KEY,
    application_id UUID REFERENCES applications(id),
    salary INTEGER,
    salary_currency VARCHAR(3) DEFAULT 'RUB',
    bonus TEXT,
    equity TEXT,
    start_date DATE,
    expiry_date DATE,
    benefits TEXT,
    status VARCHAR(50) DEFAULT 'draft',
    sent_at TIMESTAMPTZ,
    accepted_at TIMESTAMPTZ,
    rejected_at TIMESTAMPTZ,
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- История изменений (Audit Log)
CREATE TABLE activity_log (
    id UUID PRIMARY KEY,
    organization_id UUID REFERENCES organizations(id),
    user_id UUID REFERENCES users(id),
    entity_type VARCHAR(50),
    entity_id UUID,
    action VARCHAR(50),
    changes JSONB,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Интеграции
CREATE TABLE integrations (
    id UUID PRIMARY KEY,
    organization_id UUID REFERENCES organizations(id),
    provider VARCHAR(50) NOT NULL, -- hh, superjob, linkedin, gmail, etc.
    credentials JSONB, -- encrypted
    settings JSONB DEFAULT '{}',
    status VARCHAR(50) DEFAULT 'active',
    last_sync_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Emails
CREATE TABLE emails (
    id UUID PRIMARY KEY,
    organization_id UUID REFERENCES organizations(id),
    candidate_id UUID REFERENCES candidates(id),
    application_id UUID REFERENCES applications(id),
    direction VARCHAR(10), -- inbound, outbound
    from_email VARCHAR(255),
    to_email VARCHAR(255),
    subject TEXT,
    body_html TEXT,
    body_text TEXT,
    status VARCHAR(50),
    opened_at TIMESTAMPTZ,
    clicked_at TIMESTAMPTZ,
    external_id VARCHAR(255),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Индексы
CREATE INDEX idx_candidates_org ON candidates(organization_id);
CREATE INDEX idx_candidates_email ON candidates(email);
CREATE INDEX idx_applications_job ON applications(job_id);
CREATE INDEX idx_applications_candidate ON applications(candidate_id);
CREATE INDEX idx_applications_stage ON applications(stage_id);
CREATE INDEX idx_activity_log_entity ON activity_log(entity_type, entity_id);

-- Full-text search
CREATE INDEX idx_candidates_fts ON candidates 
    USING GIN(to_tsvector('russian', 
        coalesce(first_name, '') || ' ' || 
        coalesce(last_name, '') || ' ' || 
        coalesce(resume_text, '')
    ));
```

---

## 6. API Design

### 6.1 REST API Endpoints

```
# Auth
POST   /api/auth/register
POST   /api/auth/login
POST   /api/auth/logout
POST   /api/auth/refresh
POST   /api/auth/forgot-password
POST   /api/auth/reset-password
GET    /api/auth/me

# Organizations
GET    /api/organizations/:id
PUT    /api/organizations/:id
GET    /api/organizations/:id/members
POST   /api/organizations/:id/members/invite

# Users
GET    /api/users
GET    /api/users/:id
PUT    /api/users/:id
DELETE /api/users/:id

# Jobs
GET    /api/jobs
POST   /api/jobs
GET    /api/jobs/:id
PUT    /api/jobs/:id
DELETE /api/jobs/:id
POST   /api/jobs/:id/publish
POST   /api/jobs/:id/close
GET    /api/jobs/:id/candidates
GET    /api/jobs/:id/pipeline

# Candidates
GET    /api/candidates
POST   /api/candidates
GET    /api/candidates/:id
PUT    /api/candidates/:id
DELETE /api/candidates/:id
POST   /api/candidates/import
POST   /api/candidates/:id/parse-resume
GET    /api/candidates/:id/applications
GET    /api/candidates/:id/timeline

# Applications
GET    /api/applications
POST   /api/applications
GET    /api/applications/:id
PUT    /api/applications/:id
DELETE /api/applications/:id
POST   /api/applications/:id/move-stage
POST   /api/applications/:id/reject
POST   /api/applications/:id/hire

# Interviews
GET    /api/interviews
POST   /api/interviews
GET    /api/interviews/:id
PUT    /api/interviews/:id
DELETE /api/interviews/:id
POST   /api/interviews/:id/reschedule
POST   /api/interviews/:id/cancel

# Feedbacks
GET    /api/feedbacks
POST   /api/feedbacks
GET    /api/feedbacks/:id

# Offers
GET    /api/offers
POST   /api/offers
GET    /api/offers/:id
PUT    /api/offers/:id
POST   /api/offers/:id/send
POST   /api/offers/:id/accept
POST   /api/offers/:id/reject

# Integrations
GET    /api/integrations
POST   /api/integrations
PUT    /api/integrations/:id
DELETE /api/integrations/:id
POST   /api/integrations/:id/sync
GET    /api/integrations/hh/callback

# Analytics
GET    /api/analytics/funnel
GET    /api/analytics/time-to-hire
GET    /api/analytics/sources
GET    /api/analytics/recruiters

# Webhooks
POST   /api/webhooks/hh
POST   /api/webhooks/email
```

### 6.2 WebSocket Events

```javascript
// Подключение
socket.connect({ token: 'jwt_token' });

// События
'candidate:created'
'candidate:updated'
'application:stage_changed'
'interview:scheduled'
'interview:feedback_submitted'
'offer:created'
'offer:accepted'
'notification:new'
'message:new'
```

---

## 7. Безопасность

### 7.1 Аутентификация
- [ ] JWT с коротким сроком жизни (15 мин)
- [ ] Refresh tokens (7 дней)
- [ ] Rate limiting на auth endpoints
- [ ] Блокировка после N неудачных попыток
- [ ] Passwordless опция (magic link)

### 7.2 Авторизация
- [ ] RBAC (Role-Based Access Control)
- [ ] Row-level security в PostgreSQL
- [ ] Проверка ownership
- [ ] API scopes для интеграций

### 7.3 Данные
- [ ] Шифрование at rest (AES-256)
- [ ] Шифрование in transit (TLS 1.3)
- [ ] Хэширование паролей (Argon2)
- [ ] PII данные в отдельных полях
- [ ] GDPR compliance (удаление данных)

### 7.4 Инфраструктура
- [ ] WAF (Web Application Firewall)
- [ ] DDoS protection
- [ ] Security headers
- [ ] CORS настройка
- [ ] CSP (Content Security Policy)
- [ ] Регулярные security аудиты

---

## 8. Инфраструктура и DevOps

### 8.1 Окружения
- Development (local)
- Staging
- Production

### 8.2 CI/CD Pipeline

```yaml
stages:
  - lint
  - test
  - build
  - deploy

lint:
  - ESLint + Prettier
  - TypeScript check

test:
  - Unit tests (Jest/Vitest)
  - Integration tests
  - E2E tests (Playwright)
  - Coverage > 80%

build:
  - Docker images
  - Static assets

deploy:
  - Staging: auto on PR merge
  - Production: manual approval
```

### 8.3 Мониторинг
- [ ] Application metrics (Prometheus)
- [ ] Logs (Grafana Loki)
- [ ] Error tracking (Sentry)
- [ ] Uptime monitoring
- [ ] Alerting (PagerDuty/Slack)

### 8.4 Backup
- [ ] Database: ежедневно, хранение 30 дней
- [ ] Files: репликация в другой регион
- [ ] Point-in-time recovery

---

## 9. Масштабирование

### 9.1 Горизонтальное масштабирование
- Stateless API servers
- Load balancer (nginx/AWS ALB)
- Database read replicas
- Redis cluster

### 9.2 Оптимизации
- CDN для статики
- Кэширование (Redis)
- Database connection pooling
- Lazy loading
- Pagination везде

### 9.3 Лимиты (по плану)

| План | Пользователи | Вакансии | Кандидаты | Интеграции |
|------|--------------|----------|-----------|------------|
| Free | 2 | 3 | 100 | 1 |
| Starter | 5 | 10 | 1000 | 3 |
| Professional | 20 | Unlimited | 10000 | 10 |
| Enterprise | Unlimited | Unlimited | Unlimited | Unlimited |

---

## 10. Роадмап

### Phase 1: MVP (8-10 недель)

**Цель:** Минимально рабочий продукт для внутреннего использования

#### Week 1-2: Фундамент
- [ ] Проект setup (monorepo, lint, CI)
- [ ] База данных и миграции
- [ ] Аутентификация (email/password)
- [ ] Базовый UI kit

#### Week 3-4: Core
- [ ] Вакансии CRUD
- [ ] Кандидаты CRUD
- [ ] Простая воронка (fixed stages)
- [ ] Базовый поиск

#### Week 5-6: Workflow
- [ ] Перемещение по этапам
- [ ] Заметки и комментарии
- [ ] Email отправка
- [ ] Уведомления (in-app)

#### Week 7-8: Интервью
- [ ] Планирование интервью
- [ ] Фидбек формы
- [ ] Календарь (Google)

#### Week 9-10: Polish
- [ ] Базовая аналитика
- [ ] Исправление багов
- [ ] Документация
- [ ] Деплой staging

### Phase 2: Интеграции (6-8 недель)

- [ ] HeadHunter интеграция (полная)
- [ ] Gmail/Outlook синхронизация
- [ ] Парсинг резюме (AI)
- [ ] Дедупликация
- [ ] Офферы
- [ ] Улучшенная аналитика

### Phase 3: Рост (6-8 недель)

- [ ] Карьерная страница
- [ ] SuperJob интеграция
- [ ] LinkedIn интеграция
- [ ] Мобильное приложение
- [ ] Биллинг (Stripe)
- [ ] SSO (Enterprise)

### Phase 4: AI/ML (4-6 недель)

- [ ] AI скоринг кандидатов
- [ ] Рекомендации кандидатов
- [ ] Автоматический парсинг
- [ ] Генерация описаний вакансий
- [ ] Chatbot для карьерной страницы

---

## 11. Команда

### Минимальная команда (MVP)

| Роль | Кол-во | Ответственность |
|------|--------|-----------------|
| Full-stack разработчик | 2 | Frontend + Backend |
| Product Manager | 1 | Требования, приоритизация |
| Designer | 0.5 | UI/UX (part-time) |

### Расширенная команда

| Роль | Кол-во |
|------|--------|
| Frontend | 2 |
| Backend | 2 |
| DevOps | 1 |
| QA | 1 |
| Product | 1 |
| Designer | 1 |

---

## 12. Риски и митигация

| Риск | Вероятность | Влияние | Митигация |
|------|-------------|---------|-----------|
| Сложность интеграций с работными сайтами | Высокая | Высокое | Начать с HH, документировать API |
| Парсинг резюме неточный | Средняя | Среднее | Использовать ML + ручная проверка |
| Проблемы с масштабированием | Низкая | Высокое | Правильная архитектура с начала |
| Конкуренция (Huntflow, Potok) | Высокая | Среднее | Фокус на UX и интеграции |
| GDPR/152-ФЗ compliance | Средняя | Высокое | Консультация юриста, audit |

---

## 13. Конкуренты (анализ)

| Продукт | Сильные стороны | Слабые стороны |
|---------|-----------------|----------------|
| **Huntflow** | Полнота функций, интеграции | Цена, сложность |
| **Potok** | Простота, цена | Ограниченные возможности |
| **Talantix** | Интеграция с HH | Только для HH клиентов |
| **Greenhouse** | UX, интеграции | Цена, не локализован |
| **Lever** | UX, аналитика | Не локализован |
| **BambooHR** | HR + ATS | ATS слабоват |

### Наше позиционирование
- Фокус на UX и скорость работы
- Глубокая интеграция с российскими площадками
- Прозрачное ценообразование
- AI-функции из коробки
- Open API для кастомизаций

---

## Следующие шаги

1. **Валидация:** Провести интервью с 5-10 рекрутерами
2. **Дизайн:** Создать детальные макеты в Figma
3. **Прототип:** Кликабельный прототип для тестирования
4. **Техническое решение:** Финализировать стек
5. **Setup проекта:** Monorepo, CI/CD, окружения
6. **Начало разработки:** Phase 1, Week 1

---

*Документ создан: Январь 2025*
*Версия: 1.0*
