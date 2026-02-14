// ===== Test Data for ATS WorkHere =====

// Departments
const departments = [
    { id: 1, name: 'Разработка', color: '#4f46e5' },
    { id: 2, name: 'Продукт', color: '#7c3aed' },
    { id: 3, name: 'Дизайн', color: '#db2777' },
    { id: 4, name: 'Маркетинг', color: '#ea580c' },
    { id: 5, name: 'Продажи', color: '#16a34a' },
    { id: 6, name: 'HR', color: '#0891b2' },
    { id: 7, name: 'Финансы', color: '#ca8a04' }
];

// Hiring Managers
const hiringManagers = [
    { id: 1, name: 'Алексей Петров', role: 'Tech Lead', department: 1, avatar: 'https://i.pravatar.cc/40?img=11' },
    { id: 2, name: 'Ольга Смирнова', role: 'HR Director', department: 6, avatar: 'https://i.pravatar.cc/40?img=5' },
    { id: 3, name: 'Дмитрий Козлов', role: 'CTO', department: 1, avatar: 'https://i.pravatar.cc/40?img=12' },
    { id: 4, name: 'Анна Федорова', role: 'Product Manager', department: 2, avatar: 'https://i.pravatar.cc/40?img=9' },
    { id: 5, name: 'Михаил Волков', role: 'Design Lead', department: 3, avatar: 'https://i.pravatar.cc/40?img=15' },
    { id: 6, name: 'Елена Новикова', role: 'Marketing Director', department: 4, avatar: 'https://i.pravatar.cc/40?img=16' }
];

// Vacancies
const vacancies = [
    {
        id: 1,
        title: 'Senior Frontend Developer',
        department: 1,
        managerId: 1,
        status: 'active',
        priority: 'high',
        urgent: true,
        salary: { min: 250000, max: 350000, currency: 'RUB' },
        location: 'Москва / Удаленно',
        workFormat: 'hybrid',
        createdAt: '2025-01-10',
        deadline: '2025-02-15',
        description: 'Ищем опытного Frontend разработчика для работы над продуктом в команде из 8 человек.',
        requirements: ['React 3+ лет', 'TypeScript', 'State management (Redux/MobX)', 'Unit testing'],
        niceToHave: ['Next.js', 'GraphQL', 'Design Systems'],
        candidatesCount: 24,
        stages: {
            new: 8,
            screening: 6,
            interview: 5,
            technical: 3,
            final: 1,
            offer: 1,
            hired: 0
        }
    },
    {
        id: 2,
        title: 'Product Manager',
        department: 2,
        managerId: 4,
        status: 'active',
        priority: 'high',
        urgent: false,
        salary: { min: 200000, max: 300000, currency: 'RUB' },
        location: 'Москва',
        workFormat: 'office',
        createdAt: '2025-01-05',
        deadline: '2025-02-28',
        description: 'Ищем Product Manager для развития B2B продукта.',
        requirements: ['Опыт PM 3+ лет', 'B2B опыт', 'Agile/Scrum', 'Аналитическое мышление'],
        niceToHave: ['Технический бэкграунд', 'SQL', 'A/B тестирование'],
        candidatesCount: 18,
        stages: {
            new: 5,
            screening: 4,
            interview: 4,
            technical: 2,
            final: 2,
            offer: 1,
            hired: 0
        }
    },
    {
        id: 3,
        title: 'UI/UX Designer',
        department: 3,
        managerId: 5,
        status: 'active',
        priority: 'medium',
        urgent: false,
        salary: { min: 150000, max: 220000, currency: 'RUB' },
        location: 'Удаленно',
        workFormat: 'remote',
        createdAt: '2025-01-12',
        deadline: '2025-03-01',
        description: 'Ищем дизайнера для работы над пользовательским опытом мобильного приложения.',
        requirements: ['Figma', 'Мобильный дизайн', 'Прототипирование', 'Портфолио'],
        niceToHave: ['Motion design', 'User research', 'Design systems'],
        candidatesCount: 31,
        stages: {
            new: 12,
            screening: 8,
            interview: 6,
            technical: 3,
            final: 1,
            offer: 1,
            hired: 0
        }
    },
    {
        id: 4,
        title: 'Backend Developer (Python)',
        department: 1,
        managerId: 3,
        status: 'active',
        priority: 'high',
        urgent: true,
        salary: { min: 280000, max: 400000, currency: 'RUB' },
        location: 'Москва / Удаленно',
        workFormat: 'hybrid',
        createdAt: '2025-01-08',
        deadline: '2025-02-10',
        description: 'Разработчик для команды платформы. Микросервисы, высокие нагрузки.',
        requirements: ['Python 4+ лет', 'FastAPI/Django', 'PostgreSQL', 'Docker/K8s'],
        niceToHave: ['Go', 'Kafka', 'Redis', 'AWS'],
        candidatesCount: 15,
        stages: {
            new: 3,
            screening: 4,
            interview: 3,
            technical: 3,
            final: 1,
            offer: 1,
            hired: 0
        }
    },
    {
        id: 5,
        title: 'DevOps Engineer',
        department: 1,
        managerId: 3,
        status: 'active',
        priority: 'medium',
        urgent: false,
        salary: { min: 300000, max: 450000, currency: 'RUB' },
        location: 'Удаленно',
        workFormat: 'remote',
        createdAt: '2025-01-15',
        deadline: '2025-03-15',
        description: 'DevOps инженер для настройки и поддержки инфраструктуры.',
        requirements: ['Kubernetes', 'Terraform', 'CI/CD', 'Linux'],
        niceToHave: ['AWS/GCP', 'Monitoring', 'Security'],
        candidatesCount: 9,
        stages: {
            new: 2,
            screening: 3,
            interview: 2,
            technical: 1,
            final: 1,
            offer: 0,
            hired: 0
        }
    },
    {
        id: 6,
        title: 'Marketing Manager',
        department: 4,
        managerId: 6,
        status: 'active',
        priority: 'low',
        urgent: false,
        salary: { min: 120000, max: 180000, currency: 'RUB' },
        location: 'Москва',
        workFormat: 'office',
        createdAt: '2025-01-18',
        deadline: '2025-03-30',
        description: 'Маркетолог для продвижения продукта на российском рынке.',
        requirements: ['Digital маркетинг', 'Аналитика', 'Контент-маркетинг'],
        niceToHave: ['B2B опыт', 'SEO', 'SMM'],
        candidatesCount: 22,
        stages: {
            new: 10,
            screening: 5,
            interview: 4,
            technical: 2,
            final: 1,
            offer: 0,
            hired: 0
        }
    },
    {
        id: 7,
        title: 'QA Engineer',
        department: 1,
        managerId: 1,
        status: 'paused',
        priority: 'low',
        urgent: false,
        salary: { min: 150000, max: 220000, currency: 'RUB' },
        location: 'Москва / Удаленно',
        workFormat: 'hybrid',
        createdAt: '2024-12-20',
        deadline: '2025-02-28',
        description: 'Инженер по тестированию для команды разработки.',
        requirements: ['Автоматизация тестов', 'API testing', 'SQL'],
        niceToHave: ['Python/JS', 'CI/CD', 'Performance testing'],
        candidatesCount: 8,
        stages: {
            new: 2,
            screening: 2,
            interview: 2,
            technical: 1,
            final: 1,
            offer: 0,
            hired: 0
        }
    },
    {
        id: 8,
        title: 'Data Analyst',
        department: 2,
        managerId: 4,
        status: 'active',
        priority: 'medium',
        urgent: false,
        salary: { min: 180000, max: 250000, currency: 'RUB' },
        location: 'Москва',
        workFormat: 'hybrid',
        createdAt: '2025-01-20',
        deadline: '2025-03-20',
        description: 'Аналитик данных для продуктовой команды.',
        requirements: ['SQL', 'Python', 'Визуализация данных', 'A/B тесты'],
        niceToHave: ['Tableau/Looker', 'Machine Learning', 'dbt'],
        candidatesCount: 14,
        stages: {
            new: 6,
            screening: 4,
            interview: 2,
            technical: 1,
            final: 1,
            offer: 0,
            hired: 0
        }
    },
    {
        id: 9,
        title: 'Sales Manager B2B',
        department: 5,
        managerId: 2,
        status: 'active',
        priority: 'high',
        urgent: false,
        salary: { min: 100000, max: 150000, currency: 'RUB', bonus: '2% от продаж' },
        location: 'Москва',
        workFormat: 'office',
        createdAt: '2025-01-22',
        deadline: '2025-02-28',
        description: 'Менеджер по продажам для работы с корпоративными клиентами.',
        requirements: ['B2B продажи 2+ лет', 'CRM опыт', 'Переговоры'],
        niceToHave: ['IT продажи', 'Английский'],
        candidatesCount: 11,
        stages: {
            new: 4,
            screening: 3,
            interview: 2,
            technical: 1,
            final: 1,
            offer: 0,
            hired: 0
        }
    },
    {
        id: 10,
        title: 'HR Generalist',
        department: 6,
        managerId: 2,
        status: 'closed',
        priority: 'low',
        urgent: false,
        salary: { min: 120000, max: 160000, currency: 'RUB' },
        location: 'Москва',
        workFormat: 'hybrid',
        createdAt: '2024-12-01',
        deadline: '2025-01-31',
        closedAt: '2025-01-20',
        description: 'HR специалист для поддержки команды.',
        requirements: ['HR опыт 2+ лет', 'Кадровое делопроизводство', '1С'],
        niceToHave: ['Onboarding', 'Корп. культура'],
        candidatesCount: 6,
        stages: {
            new: 0,
            screening: 0,
            interview: 0,
            technical: 0,
            final: 0,
            offer: 0,
            hired: 1
        }
    },
    {
        id: 11,
        title: 'iOS Developer',
        department: 1,
        managerId: 1,
        status: 'active',
        priority: 'medium',
        urgent: false,
        salary: { min: 280000, max: 380000, currency: 'RUB' },
        location: 'Удаленно',
        workFormat: 'remote',
        createdAt: '2025-01-23',
        deadline: '2025-03-15',
        description: 'iOS разработчик для мобильной команды.',
        requirements: ['Swift 3+ лет', 'UIKit/SwiftUI', 'MVVM/Clean Architecture'],
        niceToHave: ['Combine', 'CI/CD', 'Unit testing'],
        candidatesCount: 7,
        stages: {
            new: 3,
            screening: 2,
            interview: 1,
            technical: 1,
            final: 0,
            offer: 0,
            hired: 0
        }
    },
    {
        id: 12,
        title: 'Team Lead Frontend',
        department: 1,
        managerId: 3,
        status: 'active',
        priority: 'high',
        urgent: true,
        salary: { min: 350000, max: 500000, currency: 'RUB' },
        location: 'Москва',
        workFormat: 'hybrid',
        createdAt: '2025-01-24',
        deadline: '2025-02-20',
        description: 'Тимлид для управления командой из 6 frontend разработчиков.',
        requirements: ['React/Vue 5+ лет', 'Управление командой', 'Архитектура'],
        niceToHave: ['Node.js', 'Микрофронтенды', 'Менторство'],
        candidatesCount: 5,
        stages: {
            new: 1,
            screening: 1,
            interview: 1,
            technical: 1,
            final: 1,
            offer: 0,
            hired: 0
        }
    }
];

// Candidates
const candidates = [
    // For vacancy 1: Senior Frontend Developer
    {
        id: 1,
        firstName: 'Иван',
        lastName: 'Сидоров',
        email: 'ivan.sidorov@email.com',
        phone: '+7 (999) 123-45-67',
        vacancyId: 1,
        stage: 'offer',
        source: 'hh',
        salaryExpectation: '300 000 ₽',
        resumeUrl: 'https://hh.ru/resume/12345',
        linkedin: 'https://linkedin.com/in/ivansidorov',
        telegram: '@ivansidorov',
        avatar: 'https://i.pravatar.cc/100?img=3',
        skills: ['React', 'TypeScript', 'Redux', 'Jest'],
        experience: '5 лет',
        currentCompany: 'Яндекс',
        location: 'Москва',
        createdAt: '2025-01-12',
        updatedAt: '2025-01-24',
        daysInStage: 2,
        nextStep: 'Отправить оффер',
        nextStepDue: '2025-01-26',
        rating: 5,
        inTalentPool: false,
        notes: [
            { id: 1, text: 'Отличный кандидат, strong hire от всех интервьюеров', author: 'Мария Иванова', date: '2025-01-24' },
            { id: 2, text: 'Готов выйти через 2 недели', author: 'Мария Иванова', date: '2025-01-23' }
        ],
        timeline: [
            { date: '2025-01-12', event: 'Добавлен', type: 'created', description: 'Отклик с HeadHunter' },
            { date: '2025-01-13', event: 'Скрининг', type: 'stage', description: 'Переведен на этап скрининга' },
            { date: '2025-01-14', event: 'Звонок', type: 'call', description: 'Провели скрининг-звонок, 30 мин' },
            { date: '2025-01-15', event: 'Интервью', type: 'stage', description: 'Назначено HR интервью' },
            { date: '2025-01-17', event: 'Интервью прошло', type: 'interview', description: 'HR интервью с Ольгой' },
            { date: '2025-01-18', event: 'Техническое', type: 'stage', description: 'Назначено техническое интервью' },
            { date: '2025-01-20', event: 'Техническое прошло', type: 'interview', description: 'Техническое с Алексеем' },
            { date: '2025-01-22', event: 'Финал', type: 'stage', description: 'Финальное интервью с CTO' },
            { date: '2025-01-23', event: 'Финал прошел', type: 'interview', description: 'Встреча с Дмитрием' },
            { date: '2025-01-24', event: 'Оффер', type: 'stage', description: 'Решение об оффере' }
        ],
        feedbacks: [
            { id: 1, interviewerId: 2, rating: 5, recommendation: 'hire', strengths: 'Отличные коммуникативные навыки, понятно объясняет', weaknesses: '-', comment: 'Очень понравился. Мотивирован, знает чего хочет.', date: '2025-01-17' },
            { id: 2, interviewerId: 1, rating: 5, recommendation: 'hire', strengths: 'Глубокие знания React, хороший опыт с большими проектами', weaknesses: 'Мало опыта с GraphQL, но быстро учится', comment: 'Strong hire. Отлично решил все задачи.', date: '2025-01-20' },
            { id: 3, interviewerId: 3, rating: 4, recommendation: 'hire', strengths: 'Зрелый подход, понимает бизнес', weaknesses: 'Высокие зарплатные ожидания', comment: 'Хороший кандидат, можно брать.', date: '2025-01-23' }
        ]
    },
    {
        id: 2,
        firstName: 'Елена',
        lastName: 'Кузнецова',
        email: 'elena.kuznetsova@email.com',
        phone: '+7 (999) 234-56-78',
        vacancyId: 1,
        stage: 'technical',
        source: 'linkedin',
        salaryExpectation: '320 000 ₽',
        resumeUrl: null,
        linkedin: 'https://linkedin.com/in/elenakuznetsova',
        telegram: '@elenakuz',
        avatar: 'https://i.pravatar.cc/100?img=23',
        skills: ['React', 'Vue', 'TypeScript', 'Node.js'],
        experience: '6 лет',
        currentCompany: 'Сбер',
        location: 'Санкт-Петербург',
        createdAt: '2025-01-14',
        updatedAt: '2025-01-23',
        daysInStage: 3,
        nextStep: 'Ждем фидбек от Алексея',
        nextStepDue: '2025-01-25',
        rating: 4,
        inTalentPool: false,
        notes: [],
        timeline: [
            { date: '2025-01-14', event: 'Добавлен', type: 'created', description: 'Сорсинг LinkedIn' },
            { date: '2025-01-16', event: 'Скрининг', type: 'stage', description: 'Переведен на этап скрининга' },
            { date: '2025-01-18', event: 'Интервью', type: 'stage', description: 'HR интервью' },
            { date: '2025-01-20', event: 'Техническое', type: 'stage', description: 'Техническое интервью' }
        ],
        feedbacks: [
            { id: 1, interviewerId: 2, rating: 4, recommendation: 'next_stage', strengths: 'Хороший опыт, мотивирована', weaknesses: 'Релокация из СПб может быть сложной', comment: 'Рекомендую на техническое.', date: '2025-01-19' }
        ]
    },
    {
        id: 3,
        firstName: 'Максим',
        lastName: 'Новиков',
        email: 'maxim.novikov@email.com',
        phone: '+7 (999) 345-67-89',
        vacancyId: 1,
        stage: 'technical',
        source: 'referral',
        referrer: 'Алексей Петров',
        salaryExpectation: '280 000 ₽',
        avatar: 'https://i.pravatar.cc/100?img=7',
        skills: ['React', 'TypeScript', 'MobX', 'Webpack'],
        experience: '4 года',
        currentCompany: 'Тинькофф',
        location: 'Москва',
        createdAt: '2025-01-15',
        updatedAt: '2025-01-22',
        daysInStage: 4,
        nextStep: 'Назначить техническое интервью',
        nextStepDue: '2025-01-24',
        rating: 4,
        urgent: true,
        inTalentPool: false,
        notes: [
            { id: 1, text: 'Реферал от Алексея, приоритет!', author: 'Мария Иванова', date: '2025-01-15' }
        ],
        timeline: [],
        feedbacks: []
    },
    {
        id: 4,
        firstName: 'Анна',
        lastName: 'Морозова',
        email: 'anna.morozova@email.com',
        phone: '+7 (999) 456-78-90',
        vacancyId: 1,
        stage: 'interview',
        source: 'hh',
        salaryExpectation: '250 000 ₽',
        avatar: 'https://i.pravatar.cc/100?img=24',
        skills: ['React', 'JavaScript', 'CSS', 'HTML'],
        experience: '3 года',
        currentCompany: 'Mail.ru',
        location: 'Москва',
        createdAt: '2025-01-16',
        updatedAt: '2025-01-21',
        daysInStage: 5,
        nextStep: 'HR интервью',
        nextStepDue: '2025-01-26',
        rating: 3,
        inTalentPool: false,
        notes: [],
        timeline: [],
        feedbacks: []
    },
    {
        id: 5,
        firstName: 'Дмитрий',
        lastName: 'Волков',
        email: 'dmitry.volkov@email.com',
        phone: '+7 (999) 567-89-01',
        vacancyId: 1,
        stage: 'interview',
        source: 'telegram',
        salaryExpectation: '270 000 ₽',
        avatar: 'https://i.pravatar.cc/100?img=8',
        skills: ['React', 'Redux', 'TypeScript'],
        experience: '4 года',
        currentCompany: 'Ozon',
        location: 'Москва',
        createdAt: '2025-01-17',
        updatedAt: '2025-01-20',
        daysInStage: 6,
        nextStep: 'Назначить HR интервью',
        nextStepDue: '2025-01-25',
        rating: 3,
        inTalentPool: false,
        notes: [],
        timeline: [],
        feedbacks: []
    },
    // More candidates for other stages
    {
        id: 6,
        firstName: 'Сергей',
        lastName: 'Козлов',
        email: 'sergey.kozlov@email.com',
        phone: '+7 (999) 678-90-12',
        vacancyId: 1,
        stage: 'screening',
        source: 'hh',
        salaryExpectation: '290 000 ₽',
        avatar: 'https://i.pravatar.cc/100?img=10',
        skills: ['React', 'Angular', 'TypeScript'],
        experience: '5 лет',
        currentCompany: 'VK',
        location: 'Москва',
        createdAt: '2025-01-20',
        updatedAt: '2025-01-22',
        daysInStage: 4,
        nextStep: 'Провести скрининг',
        nextStepDue: '2025-01-25',
        rating: 0,
        inTalentPool: false,
        notes: [],
        timeline: [],
        feedbacks: []
    },
    {
        id: 7,
        firstName: 'Ольга',
        lastName: 'Павлова',
        email: 'olga.pavlova@email.com',
        phone: '+7 (999) 789-01-23',
        vacancyId: 1,
        stage: 'new',
        source: 'hh',
        salaryExpectation: '260 000 ₽',
        avatar: 'https://i.pravatar.cc/100?img=25',
        skills: ['React', 'JavaScript'],
        experience: '3 года',
        currentCompany: 'Авито',
        location: 'Москва',
        createdAt: '2025-01-24',
        updatedAt: '2025-01-24',
        daysInStage: 1,
        nextStep: 'Первичный скрининг резюме',
        nextStepDue: '2025-01-26',
        rating: 0,
        inTalentPool: false,
        notes: [],
        timeline: [],
        feedbacks: []
    },
    // For vacancy 2: Product Manager
    {
        id: 8,
        firstName: 'Алексей',
        lastName: 'Соколов',
        email: 'alexey.sokolov@email.com',
        phone: '+7 (999) 890-12-34',
        vacancyId: 2,
        stage: 'final',
        source: 'linkedin',
        salaryExpectation: '280 000 ₽',
        avatar: 'https://i.pravatar.cc/100?img=11',
        skills: ['Product Management', 'Agile', 'SQL', 'Analytics'],
        experience: '5 лет',
        currentCompany: 'Kaspersky',
        location: 'Москва',
        createdAt: '2025-01-10',
        updatedAt: '2025-01-23',
        daysInStage: 2,
        nextStep: 'Финальное интервью с CEO',
        nextStepDue: '2025-01-27',
        rating: 4,
        inTalentPool: false,
        notes: [],
        timeline: [],
        feedbacks: []
    },
    {
        id: 9,
        firstName: 'Мария',
        lastName: 'Белова',
        email: 'maria.belova@email.com',
        phone: '+7 (999) 901-23-45',
        vacancyId: 2,
        stage: 'offer',
        source: 'referral',
        referrer: 'Анна Федорова',
        salaryExpectation: '250 000 ₽',
        avatar: 'https://i.pravatar.cc/100?img=26',
        skills: ['Product Management', 'Scrum', 'Jira', 'Figma'],
        experience: '4 года',
        currentCompany: 'Wildberries',
        location: 'Москва',
        createdAt: '2025-01-08',
        updatedAt: '2025-01-24',
        daysInStage: 1,
        nextStep: 'Согласование оффера',
        nextStepDue: '2025-01-25',
        rating: 5,
        inTalentPool: false,
        notes: [
            { id: 1, text: 'Идеальный кандидат! Быстро двигаемся с оффером', author: 'Мария Иванова', date: '2025-01-24' }
        ],
        timeline: [],
        feedbacks: []
    },
    // For vacancy 4: Backend Developer (Python) - URGENT
    {
        id: 10,
        firstName: 'Павел',
        lastName: 'Егоров',
        email: 'pavel.egorov@email.com',
        phone: '+7 (999) 012-34-56',
        vacancyId: 4,
        stage: 'final',
        source: 'hh',
        salaryExpectation: '380 000 ₽',
        avatar: 'https://i.pravatar.cc/100?img=13',
        skills: ['Python', 'FastAPI', 'PostgreSQL', 'Docker', 'Kubernetes'],
        experience: '6 лет',
        currentCompany: 'Яндекс',
        location: 'Москва',
        createdAt: '2025-01-12',
        updatedAt: '2025-01-24',
        daysInStage: 1,
        nextStep: 'Ждем решение от CTO',
        nextStepDue: '2025-01-25',
        rating: 5,
        urgent: true,
        inTalentPool: false,
        notes: [
            { id: 1, text: 'Срочная вакансия! Кандидат рассматривает другие офферы', author: 'Мария Иванова', date: '2025-01-24' }
        ],
        timeline: [],
        feedbacks: []
    },
    {
        id: 11,
        firstName: 'Артем',
        lastName: 'Лебедев',
        email: 'artem.lebedev@email.com',
        phone: '+7 (999) 111-22-33',
        vacancyId: 4,
        stage: 'offer',
        source: 'linkedin',
        salaryExpectation: '350 000 ₽',
        avatar: 'https://i.pravatar.cc/100?img=14',
        skills: ['Python', 'Django', 'PostgreSQL', 'Redis', 'AWS'],
        experience: '5 лет',
        currentCompany: 'Сбер',
        location: 'Санкт-Петербург',
        createdAt: '2025-01-10',
        updatedAt: '2025-01-23',
        daysInStage: 2,
        nextStep: 'Отправить оффер',
        nextStepDue: '2025-01-24',
        rating: 4,
        urgent: true,
        inTalentPool: false,
        notes: [],
        timeline: [],
        feedbacks: []
    },
    // For vacancy 3: UI/UX Designer
    {
        id: 12,
        firstName: 'Кристина',
        lastName: 'Орлова',
        email: 'kristina.orlova@email.com',
        phone: '+7 (999) 222-33-44',
        vacancyId: 3,
        stage: 'offer',
        source: 'telegram',
        salaryExpectation: '200 000 ₽',
        avatar: 'https://i.pravatar.cc/100?img=27',
        skills: ['Figma', 'Sketch', 'UI Design', 'Prototyping'],
        experience: '4 года',
        currentCompany: 'Freelance',
        location: 'Удаленно',
        createdAt: '2025-01-14',
        updatedAt: '2025-01-24',
        daysInStage: 1,
        nextStep: 'Оффер готов, ждем ответ',
        nextStepDue: '2025-01-27',
        rating: 5,
        inTalentPool: false,
        notes: [],
        timeline: [],
        feedbacks: []
    },
    // Rejected candidates
    {
        id: 13,
        firstName: 'Николай',
        lastName: 'Попов',
        email: 'nikolay.popov@email.com',
        phone: '+7 (999) 333-44-55',
        vacancyId: 1,
        stage: 'rejected',
        source: 'hh',
        salaryExpectation: '400 000 ₽',
        avatar: 'https://i.pravatar.cc/100?img=17',
        skills: ['React', 'Angular'],
        experience: '7 лет',
        currentCompany: 'Google',
        location: 'Лондон',
        createdAt: '2025-01-11',
        updatedAt: '2025-01-16',
        daysInStage: 9,
        rejectionReason: 'salary',
        rejectionDetails: 'Зарплатные ожидания значительно выше бюджета',
        rating: 4,
        inTalentPool: true,
        notes: [],
        timeline: [],
        feedbacks: []
    },
    // Screening candidates
    {
        id: 14,
        firstName: 'Виктория',
        lastName: 'Громова',
        email: 'victoria.gromova@email.com',
        phone: '+7 (999) 444-55-66',
        vacancyId: 1,
        stage: 'screening',
        source: 'hh',
        salaryExpectation: '270 000 ₽',
        avatar: 'https://i.pravatar.cc/100?img=28',
        skills: ['React', 'TypeScript', 'Next.js'],
        experience: '4 года',
        currentCompany: 'Lamoda',
        location: 'Москва',
        createdAt: '2025-01-21',
        updatedAt: '2025-01-22',
        daysInStage: 3,
        nextStep: 'Скрининг-звонок',
        nextStepDue: '2025-01-26',
        rating: 0,
        inTalentPool: false,
        notes: [],
        timeline: [],
        feedbacks: []
    },
    // New candidates
    {
        id: 15,
        firstName: 'Александр',
        lastName: 'Титов',
        email: 'alex.titov@email.com',
        phone: '+7 (999) 555-66-77',
        vacancyId: 1,
        stage: 'new',
        source: 'direct',
        salaryExpectation: '290 000 ₽',
        avatar: 'https://i.pravatar.cc/100?img=18',
        skills: ['React', 'Vue', 'TypeScript'],
        experience: '5 лет',
        currentCompany: 'Positive Technologies',
        location: 'Москва',
        createdAt: '2025-01-24',
        updatedAt: '2025-01-24',
        daysInStage: 1,
        nextStep: 'Просмотреть резюме',
        nextStepDue: '2025-01-26',
        rating: 0,
        inTalentPool: false,
        notes: [],
        timeline: [],
        feedbacks: []
    },
    // For Team Lead position
    {
        id: 16,
        firstName: 'Андрей',
        lastName: 'Романов',
        email: 'andrey.romanov@email.com',
        phone: '+7 (999) 666-77-88',
        vacancyId: 12,
        stage: 'final',
        source: 'linkedin',
        salaryExpectation: '450 000 ₽',
        avatar: 'https://i.pravatar.cc/100?img=19',
        skills: ['React', 'Team Lead', 'Architecture', 'Mentoring'],
        experience: '8 лет',
        currentCompany: 'Яндекс',
        location: 'Москва',
        createdAt: '2025-01-20',
        updatedAt: '2025-01-24',
        daysInStage: 1,
        nextStep: 'Финальное с CTO',
        nextStepDue: '2025-01-27',
        rating: 5,
        urgent: true,
        inTalentPool: false,
        notes: [
            { id: 1, text: 'Очень сильный кандидат! У него есть другой оффер, нужно быстро двигаться', author: 'Мария Иванова', date: '2025-01-24' }
        ],
        timeline: [],
        feedbacks: []
    }
];

// Interviews
const interviews = [
    {
        id: 1,
        candidateId: 4,
        vacancyId: 1,
        type: 'hr',
        date: '2025-01-27',
        time: '10:00',
        duration: 60,
        format: 'online',
        interviewers: [2],
        status: 'scheduled',
        notes: 'Обратить внимание на мотивацию'
    },
    {
        id: 2,
        candidateId: 5,
        vacancyId: 1,
        type: 'hr',
        date: '2025-01-27',
        time: '14:00',
        duration: 45,
        format: 'online',
        interviewers: [2],
        status: 'scheduled',
        notes: ''
    },
    {
        id: 3,
        candidateId: 8,
        vacancyId: 2,
        type: 'final',
        date: '2025-01-27',
        time: '11:00',
        duration: 60,
        format: 'offline',
        interviewers: [3, 4],
        status: 'scheduled',
        notes: 'Финальное с CEO и PM'
    },
    {
        id: 4,
        candidateId: 2,
        vacancyId: 1,
        type: 'technical',
        date: '2025-01-28',
        time: '15:00',
        duration: 90,
        format: 'online',
        interviewers: [1],
        status: 'scheduled',
        notes: 'Live coding + архитектура'
    },
    {
        id: 5,
        candidateId: 3,
        vacancyId: 1,
        type: 'technical',
        date: '2025-01-28',
        time: '11:00',
        duration: 90,
        format: 'online',
        interviewers: [1],
        status: 'scheduled',
        notes: 'Реферал от Алексея'
    },
    {
        id: 6,
        candidateId: 16,
        vacancyId: 12,
        type: 'final',
        date: '2025-01-27',
        time: '16:00',
        duration: 60,
        format: 'offline',
        interviewers: [3],
        status: 'scheduled',
        notes: 'СРОЧНО! У кандидата другой оффер'
    },
    {
        id: 7,
        candidateId: 10,
        vacancyId: 4,
        type: 'final',
        date: '2025-01-26',
        time: '10:00',
        duration: 60,
        format: 'online',
        interviewers: [3],
        status: 'scheduled',
        notes: 'Срочная вакансия'
    }
];

// Offers
const offers = [
    {
        id: 1,
        candidateId: 1,
        vacancyId: 1,
        status: 'pending', // pending, sent, accepted, rejected, expired
        salary: '320 000 ₽',
        bonus: 'Квартальный бонус до 20%',
        startDate: '2025-02-10',
        probation: 3,
        workFormat: 'hybrid',
        benefits: 'ДМС, обучение, MacBook Pro',
        expiryDate: '2025-01-30',
        createdAt: '2025-01-24',
        approvers: ['hr_director', 'hiring_manager'],
        approvalStatus: {
            hr_director: 'approved',
            hiring_manager: 'pending'
        }
    },
    {
        id: 2,
        candidateId: 11,
        vacancyId: 4,
        status: 'sent',
        salary: '360 000 ₽',
        bonus: '-',
        startDate: '2025-02-03',
        probation: 3,
        workFormat: 'remote',
        benefits: 'ДМС, оборудование',
        expiryDate: '2025-01-28',
        createdAt: '2025-01-23',
        approvers: ['hr_director', 'cfo'],
        approvalStatus: {
            hr_director: 'approved',
            cfo: 'approved'
        }
    },
    {
        id: 3,
        candidateId: 12,
        vacancyId: 3,
        status: 'sent',
        salary: '210 000 ₽',
        bonus: '-',
        startDate: '2025-02-17',
        probation: 3,
        workFormat: 'remote',
        benefits: 'ДМС, курсы, конференции',
        expiryDate: '2025-01-31',
        createdAt: '2025-01-24',
        approvers: ['hr_director'],
        approvalStatus: {
            hr_director: 'approved'
        }
    },
    {
        id: 4,
        candidateId: 9,
        vacancyId: 2,
        status: 'pending',
        salary: '260 000 ₽',
        bonus: 'Годовой бонус',
        startDate: '2025-02-10',
        probation: 3,
        workFormat: 'office',
        benefits: 'ДМС, фитнес, обеды',
        expiryDate: '2025-01-29',
        createdAt: '2025-01-24',
        approvers: ['hr_director', 'hiring_manager'],
        approvalStatus: {
            hr_director: 'pending',
            hiring_manager: 'pending'
        }
    }
];

// Talent Pool
const talentPool = [
    {
        id: 1,
        candidateId: 13,
        reason: 'Отличный кандидат, но зарплатные ожидания выше бюджета',
        addedAt: '2025-01-16',
        returnCondition: 'При увеличении бюджета на Senior позицию',
        tags: ['frontend', 'senior', 'high-salary'],
        lastContactAt: '2025-01-16',
        nextContactAt: '2025-04-01'
    },
    {
        id: 2,
        firstName: 'Денис',
        lastName: 'Савельев',
        email: 'denis.saveliev@email.com',
        avatar: 'https://i.pravatar.cc/100?img=20',
        skills: ['Python', 'ML', 'Data Science'],
        experience: '4 года',
        reason: 'Подходит на Data Scientist, пока нет вакансии',
        addedAt: '2025-01-10',
        returnCondition: 'Открытие вакансии Data Scientist',
        tags: ['python', 'ml', 'data'],
        lastContactAt: '2025-01-10',
        nextContactAt: '2025-03-01'
    },
    {
        id: 3,
        firstName: 'Юлия',
        lastName: 'Антонова',
        email: 'julia.antonova@email.com',
        avatar: 'https://i.pravatar.cc/100?img=29',
        skills: ['Product Management', 'Fintech'],
        experience: '6 лет',
        reason: 'Сильный PM, ушла в другую компанию, но может вернуться',
        addedAt: '2024-12-15',
        returnCondition: 'Через 6 месяцев связаться',
        tags: ['product', 'fintech', 'senior'],
        lastContactAt: '2024-12-15',
        nextContactAt: '2025-06-15'
    }
];

// Notifications
const notifications = [
    {
        id: 1,
        type: 'urgent',
        icon: 'danger',
        title: 'Срочно: кандидат ждет оффер',
        message: 'Иван Сидоров (Senior Frontend) ждет оффер. Дедлайн: сегодня',
        timestamp: '2025-01-25T09:00:00',
        read: false,
        link: { type: 'candidate', id: 1 }
    },
    {
        id: 2,
        type: 'warning',
        icon: 'warning',
        title: 'Нет фидбека 3+ дня',
        message: 'Алексей Петров не оставил фидбек по Елене Кузнецовой',
        timestamp: '2025-01-25T08:30:00',
        read: false,
        link: { type: 'candidate', id: 2 }
    },
    {
        id: 3,
        type: 'info',
        icon: 'info',
        title: 'Интервью через 1 час',
        message: 'HR интервью с Анной Морозовой в 10:00',
        timestamp: '2025-01-25T09:00:00',
        read: false,
        link: { type: 'interview', id: 1 }
    },
    {
        id: 4,
        type: 'success',
        icon: 'success',
        title: 'Оффер принят!',
        message: 'Кристина Орлова приняла оффер на UI/UX Designer',
        timestamp: '2025-01-24T18:00:00',
        read: true,
        link: { type: 'candidate', id: 12 }
    },
    {
        id: 5,
        type: 'warning',
        icon: 'warning',
        title: 'Кандидат не отвечает',
        message: 'Дмитрий Волков не отвечает 3 дня',
        timestamp: '2025-01-24T15:00:00',
        read: true,
        link: { type: 'candidate', id: 5 }
    },
    {
        id: 6,
        type: 'info',
        icon: 'info',
        title: 'Новый отклик',
        message: '5 новых откликов на Senior Frontend Developer',
        timestamp: '2025-01-24T12:00:00',
        read: true,
        link: { type: 'vacancy', id: 1 }
    },
    {
        id: 7,
        type: 'urgent',
        icon: 'danger',
        title: 'Конкурирующий оффер',
        message: 'Андрей Романов (Team Lead) получил другой оффер',
        timestamp: '2025-01-24T10:00:00',
        read: false,
        link: { type: 'candidate', id: 16 }
    }
];

// Priority Tasks for Dashboard
const priorityTasks = [
    {
        id: 1,
        type: 'urgent',
        icon: 'fa-fire',
        iconClass: 'danger',
        title: 'Отправить оффер Ивану Сидорову',
        description: 'Senior Frontend Developer',
        meta: { vacancy: 'Senior Frontend', deadline: 'Сегодня' },
        candidateId: 1
    },
    {
        id: 2,
        type: 'urgent',
        icon: 'fa-clock',
        iconClass: 'danger',
        title: 'Андрей Романов имеет другой оффер',
        description: 'Team Lead Frontend - нужно быстро двигаться!',
        meta: { vacancy: 'Team Lead Frontend', deadline: 'СРОЧНО' },
        candidateId: 16
    },
    {
        id: 3,
        type: 'warning',
        icon: 'fa-comment-dots',
        iconClass: 'warning',
        title: 'Получить фидбек от Алексея Петрова',
        description: 'По техническому интервью с Еленой Кузнецовой',
        meta: { vacancy: 'Senior Frontend', deadline: 'Просрочено 2 дня' },
        candidateId: 2
    },
    {
        id: 4,
        type: 'info',
        icon: 'fa-calendar',
        iconClass: 'info',
        title: '3 интервью сегодня',
        description: 'HR интервью: 10:00, 14:00. Финальное: 16:00',
        meta: { count: '3 интервью' }
    },
    {
        id: 5,
        type: 'warning',
        icon: 'fa-user-clock',
        iconClass: 'warning',
        title: '8 кандидатов без следующего шага',
        description: 'Требуется определить next step',
        meta: { count: '8 кандидатов' }
    },
    {
        id: 6,
        type: 'info',
        icon: 'fa-inbox',
        iconClass: 'info',
        title: '12 новых откликов',
        description: 'Требуется первичный скрининг',
        meta: { count: '12 откликов' }
    }
];

// Activity Feed
const activityFeed = [
    {
        id: 1,
        userId: 1,
        userAvatar: 'https://i.pravatar.cc/40?img=1',
        action: 'перевела кандидата на этап Оффер',
        target: 'Иван Сидоров',
        targetLink: { type: 'candidate', id: 1 },
        timestamp: '2025-01-24T17:30:00'
    },
    {
        id: 2,
        userId: 1,
        userAvatar: 'https://i.pravatar.cc/40?img=11',
        action: 'оставил фидбек',
        target: 'Техническое интервью с Максимом Новиковым',
        targetLink: { type: 'candidate', id: 3 },
        timestamp: '2025-01-24T16:00:00'
    },
    {
        id: 3,
        userId: 2,
        userAvatar: 'https://i.pravatar.cc/40?img=5',
        action: 'назначила интервью',
        target: 'HR интервью с Анной Морозовой',
        targetLink: { type: 'candidate', id: 4 },
        timestamp: '2025-01-24T14:30:00'
    },
    {
        id: 4,
        userId: 1,
        userAvatar: 'https://i.pravatar.cc/40?img=1',
        action: 'добавила кандидата',
        target: 'Александр Титов на Senior Frontend',
        targetLink: { type: 'candidate', id: 15 },
        timestamp: '2025-01-24T12:00:00'
    },
    {
        id: 5,
        userId: 3,
        userAvatar: 'https://i.pravatar.cc/40?img=12',
        action: 'одобрил оффер',
        target: 'Артем Лебедев - Backend Developer',
        targetLink: { type: 'candidate', id: 11 },
        timestamp: '2025-01-23T18:00:00'
    }
];

// Rejection Reasons
const rejectionReasons = [
    { value: 'skills', label: 'Не соответствует требованиям по навыкам' },
    { value: 'experience', label: 'Недостаточно опыта' },
    { value: 'overqualified', label: 'Переквалифицирован' },
    { value: 'salary', label: 'Зарплатные ожидания выше бюджета' },
    { value: 'culture', label: 'Не подходит по культуре' },
    { value: 'location', label: 'Не подходит локация/формат' },
    { value: 'timing', label: 'Не подходит по срокам выхода' },
    { value: 'communication', label: 'Проблемы с коммуникацией' },
    { value: 'other_offer', label: 'Принял другой оффер' },
    { value: 'withdrew', label: 'Кандидат отказался' },
    { value: 'no_response', label: 'Не отвечает' },
    { value: 'other', label: 'Другое' }
];

// Pipeline Stages (default template)
const pipelineStages = [
    { id: 'new', name: 'Новые', color: '#64748b' },
    { id: 'screening', name: 'Скрининг', color: '#f59e0b' },
    { id: 'interview', name: 'Интервью', color: '#3b82f6' },
    { id: 'technical', name: 'Техническое', color: '#8b5cf6' },
    { id: 'final', name: 'Финал', color: '#ec4899' },
    { id: 'offer', name: 'Оффер', color: '#10b981' },
    { id: 'hired', name: 'Нанят', color: '#065f46' }
];

// Per-vacancy custom stages (overrides default when set)
const vacancyCustomStages = {
    // Sales Manager B2B - no technical interview, has demo stage
    9: [
        { id: 'new', name: 'Новые', color: '#64748b' },
        { id: 'screening', name: 'Скрининг', color: '#f59e0b' },
        { id: 'interview', name: 'HR интервью', color: '#3b82f6' },
        { id: 'demo', name: 'Демо-продажа', color: '#8b5cf6' },
        { id: 'final', name: 'Финал с директором', color: '#ec4899' },
        { id: 'offer', name: 'Оффер', color: '#10b981' },
        { id: 'hired', name: 'Нанят', color: '#065f46' }
    ],
    // Marketing Manager - has test task
    6: [
        { id: 'new', name: 'Новые', color: '#64748b' },
        { id: 'screening', name: 'Скрининг', color: '#f59e0b' },
        { id: 'interview', name: 'Интервью', color: '#3b82f6' },
        { id: 'test_task', name: 'Тестовое задание', color: '#8b5cf6' },
        { id: 'final', name: 'Финал', color: '#ec4899' },
        { id: 'offer', name: 'Оффер', color: '#10b981' },
        { id: 'hired', name: 'Нанят', color: '#065f46' }
    ]
};

// Helper: get stages for a vacancy (custom or default)
function getStagesForVacancy(vacancyId) {
    return vacancyCustomStages[vacancyId] || pipelineStages;
}

// Sources
const sources = [
    { value: 'hh', label: 'HeadHunter' },
    { value: 'linkedin', label: 'LinkedIn' },
    { value: 'telegram', label: 'Telegram' },
    { value: 'referral', label: 'Реферал' },
    { value: 'direct', label: 'Прямой отклик' },
    { value: 'other', label: 'Другое' }
];

// Analytics Data
const analyticsData = {
    funnelData: [
        { stage: 'Отклики', count: 156 },
        { stage: 'Скрининг', count: 89 },
        { stage: 'Интервью', count: 52 },
        { stage: 'Техническое', count: 28 },
        { stage: 'Финал', count: 15 },
        { stage: 'Оффер', count: 8 },
        { stage: 'Нанят', count: 5 }
    ],
    timeToHire: {
        average: 32,
        median: 28,
        min: 14,
        max: 56
    },
    sourceEfficiency: [
        { source: 'HeadHunter', applications: 78, hires: 2, conversion: 2.6 },
        { source: 'LinkedIn', applications: 34, hires: 2, conversion: 5.9 },
        { source: 'Реферал', applications: 18, hires: 1, conversion: 5.6 },
        { source: 'Telegram', applications: 15, hires: 0, conversion: 0 },
        { source: 'Прямой', applications: 11, hires: 0, conversion: 0 }
    ],
    weeklyActivity: [
        { week: 'Нед 1', applications: 28, interviews: 12, offers: 1 },
        { week: 'Нед 2', applications: 35, interviews: 15, offers: 2 },
        { week: 'Нед 3', applications: 42, interviews: 18, offers: 2 },
        { week: 'Нед 4', applications: 51, interviews: 22, offers: 3 }
    ]
};
