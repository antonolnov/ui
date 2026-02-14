// ===== ATS WorkHere Application =====

// State
let currentPage = 'dashboard';
let selectedVacancyId = null;
let selectedCandidateId = null;

// ===== Initialization =====
document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    initModals();
    initPanels();
    initForms();
    initCreateVacancyForm();
    renderDashboard();
});

// ===== Navigation =====
function initNavigation() {
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            const page = item.dataset.page;
            navigateTo(page);
        });
    });

    // Mobile menu toggle
    const menuToggle = document.getElementById('menuToggle');
    const sidebar = document.getElementById('sidebar');
    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            sidebar.classList.toggle('active');
        });
    }
}

function navigateTo(page) {
    currentPage = page;
    
    // Update nav
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.toggle('active', item.dataset.page === page);
    });
    
    // Update pages
    document.querySelectorAll('.page').forEach(p => {
        p.classList.remove('active');
    });
    document.getElementById(`${page}-page`).classList.add('active');
    
    // Render page content
    switch(page) {
        case 'dashboard':
            renderDashboard();
            break;
        case 'vacancies':
            renderVacancies();
            break;
        case 'candidates':
            renderCandidates();
            break;
        case 'pipeline':
            renderPipeline();
            break;
        case 'interviews':
            renderInterviews();
            break;
        case 'talent-pool':
            renderTalentPool();
            break;
        case 'offers':
            renderOffers();
            break;
        case 'analytics':
            renderAnalytics();
            break;
        case 'settings':
            renderSettings();
            break;
    }
    
    // Close sidebar on mobile
    document.getElementById('sidebar').classList.remove('active');
}

// ===== Dashboard =====
function renderDashboard() {
    const page = document.getElementById('dashboard-page');
    
    const today = new Date();
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const dateStr = today.toLocaleDateString('ru-RU', options);
    
    // Calculate stats
    const activeVacancies = vacancies.filter(v => v.status === 'active').length;
    const totalCandidates = candidates.length;
    const todayInterviews = interviews.filter(i => i.date === '2025-01-27').length;
    const pendingOffers = offers.filter(o => o.status === 'pending' || o.status === 'sent').length;
    const urgentCandidates = candidates.filter(c => c.urgent).length;
    const noNextStep = candidates.filter(c => !c.nextStep && c.stage !== 'rejected' && c.stage !== 'hired').length;
    
    page.innerHTML = `
        <div class="dashboard-header">
            <h1>Доброе утро, Мария!</h1>
            <p>${dateStr}</p>
        </div>
        
        <div class="stats-grid">
            <div class="stat-card" onclick="navigateTo('vacancies')">
                <div class="stat-icon primary">
                    <i class="fas fa-clipboard-list"></i>
                </div>
                <div class="stat-value">${activeVacancies}</div>
                <div class="stat-label">Активных вакансий</div>
                <div class="stat-change positive">
                    <i class="fas fa-arrow-up"></i> +2 за неделю
                </div>
            </div>
            <div class="stat-card" onclick="navigateTo('candidates')">
                <div class="stat-icon success">
                    <i class="fas fa-users"></i>
                </div>
                <div class="stat-value">${totalCandidates}</div>
                <div class="stat-label">Кандидатов в работе</div>
                <div class="stat-change positive">
                    <i class="fas fa-arrow-up"></i> +18 за неделю
                </div>
            </div>
            <div class="stat-card" onclick="navigateTo('interviews')">
                <div class="stat-icon warning">
                    <i class="fas fa-calendar-check"></i>
                </div>
                <div class="stat-value">${todayInterviews}</div>
                <div class="stat-label">Интервью сегодня</div>
            </div>
            <div class="stat-card" onclick="navigateTo('offers')">
                <div class="stat-icon danger">
                    <i class="fas fa-file-signature"></i>
                </div>
                <div class="stat-value">${pendingOffers}</div>
                <div class="stat-label">Ожидают оффер</div>
            </div>
        </div>
        
        <div class="dashboard-grid">
            <div class="card">
                <div class="card-header">
                    <h3><i class="fas fa-fire text-danger"></i> Приоритеты на сегодня</h3>
                    <span class="text-muted">${priorityTasks.length} задач</span>
                </div>
                <div class="card-body">
                    <div class="priority-list">
                        ${priorityTasks.map(task => `
                            <div class="priority-item ${task.type}" onclick="${task.candidateId ? `openCandidateModal(${task.candidateId})` : ''}">
                                <div class="priority-icon ${task.iconClass}">
                                    <i class="fas ${task.icon}"></i>
                                </div>
                                <div class="priority-content">
                                    <div class="priority-title">${task.title}</div>
                                    <div class="priority-meta">
                                        <span>${task.description}</span>
                                        ${task.meta.deadline ? `<span class="text-danger">${task.meta.deadline}</span>` : ''}
                                    </div>
                                </div>
                                <div class="priority-action">
                                    <button class="btn btn-sm btn-outline">
                                        <i class="fas fa-arrow-right"></i>
                                    </button>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
            
            <div class="card">
                <div class="card-header">
                    <h3><i class="fas fa-history"></i> Последняя активность</h3>
                </div>
                <div class="card-body">
                    <div class="activity-list">
                        ${activityFeed.map(activity => `
                            <div class="activity-item">
                                <img src="${activity.userAvatar}" alt="" class="activity-avatar">
                                <div class="activity-content">
                                    <div class="activity-text">
                                        <strong>${activity.action}</strong>: ${activity.target}
                                    </div>
                                    <div class="activity-time">${formatTime(activity.timestamp)}</div>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        </div>
        
        <div class="card mt-4">
            <div class="card-header">
                <h3><i class="fas fa-exclamation-triangle text-warning"></i> Требуют внимания</h3>
            </div>
            <div class="card-body">
                <div class="stats-grid">
                    <div class="stat-card" style="cursor: pointer" onclick="navigateTo('candidates')">
                        <div class="stat-value text-danger">${urgentCandidates}</div>
                        <div class="stat-label">Срочные кандидаты</div>
                    </div>
                    <div class="stat-card" style="cursor: pointer">
                        <div class="stat-value text-warning">${noNextStep}</div>
                        <div class="stat-label">Без следующего шага</div>
                    </div>
                    <div class="stat-card" style="cursor: pointer">
                        <div class="stat-value text-warning">3</div>
                        <div class="stat-label">Ждут фидбек 3+ дня</div>
                    </div>
                    <div class="stat-card" style="cursor: pointer">
                        <div class="stat-value">2</div>
                        <div class="stat-label">Возможные дубли</div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// ===== Vacancies =====
function renderVacancies() {
    const page = document.getElementById('vacancies-page');
    
    page.innerHTML = `
        <div class="page-header">
            <h1>Вакансии</h1>
            <div class="page-actions">
                <button class="btn btn-primary" onclick="openCreateVacancyModal()">
                    <i class="fas fa-plus"></i> Новая вакансия
                </button>
            </div>
        </div>
        
        <div class="vacancies-filters">
            <button class="filter-btn active" data-filter="all">Все (${vacancies.length})</button>
            <button class="filter-btn" data-filter="active">Активные (${vacancies.filter(v => v.status === 'active').length})</button>
            <button class="filter-btn" data-filter="urgent">Срочные (${vacancies.filter(v => v.urgent).length})</button>
            <button class="filter-btn" data-filter="paused">На паузе (${vacancies.filter(v => v.status === 'paused').length})</button>
            <button class="filter-btn" data-filter="closed">Закрытые (${vacancies.filter(v => v.status === 'closed').length})</button>
        </div>
        
        <div class="vacancies-grid" id="vacanciesGrid">
            ${renderVacancyCards(vacancies)}
        </div>
    `;
    
    // Filter buttons
    page.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            page.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            const filter = btn.dataset.filter;
            let filtered = vacancies;
            if (filter === 'active') filtered = vacancies.filter(v => v.status === 'active');
            else if (filter === 'urgent') filtered = vacancies.filter(v => v.urgent);
            else if (filter === 'paused') filtered = vacancies.filter(v => v.status === 'paused');
            else if (filter === 'closed') filtered = vacancies.filter(v => v.status === 'closed');
            
            document.getElementById('vacanciesGrid').innerHTML = renderVacancyCards(filtered);
        });
    });
}

function renderVacancyCards(vacanciesList) {
    return vacanciesList.map(v => {
        const manager = hiringManagers.find(m => m.id === v.managerId);
        const dept = departments.find(d => d.id === v.department);
        const totalInPipeline = Object.values(v.stages).reduce((a, b) => a + b, 0);
        
        return `
            <div class="vacancy-card ${v.urgent ? 'urgent' : ''} ${v.priority === 'high' ? 'priority' : ''}" onclick="openVacancyModal(${v.id})">
                <div class="vacancy-header">
                    <div>
                        <div class="vacancy-title">${v.title}</div>
                        <div class="vacancy-department">${dept.name} · ${v.location}</div>
                    </div>
                    <span class="vacancy-status ${v.status}">${getStatusLabel(v.status)}</span>
                </div>
                
                <div class="vacancy-stats">
                    <div class="vacancy-stat">
                        <span class="vacancy-stat-value">${v.candidatesCount}</span>
                        <span class="vacancy-stat-label">Кандидатов</span>
                    </div>
                    <div class="vacancy-stat">
                        <span class="vacancy-stat-value">${v.stages.interview + v.stages.technical + v.stages.final}</span>
                        <span class="vacancy-stat-label">На интервью</span>
                    </div>
                    <div class="vacancy-stat">
                        <span class="vacancy-stat-value">${v.stages.offer}</span>
                        <span class="vacancy-stat-label">Офферы</span>
                    </div>
                </div>
                
                <div class="vacancy-funnel">
                    ${pipelineStages.slice(0, -1).map(stage => {
                        const count = v.stages[stage.id] || 0;
                        const percent = totalInPipeline > 0 ? (count / totalInPipeline * 100) : 0;
                        return `<div class="funnel-stage" title="${stage.name}: ${count}"><div class="fill" style="width: ${percent}%; background: ${stage.color}"></div></div>`;
                    }).join('')}
                </div>
                
                <div class="vacancy-footer">
                    <div class="vacancy-manager">
                        <img src="${manager.avatar}" alt="${manager.name}">
                        <span>${manager.name}</span>
                    </div>
                    <span>${formatDate(v.deadline)}</span>
                </div>
            </div>
        `;
    }).join('');
}

function getStatusLabel(status) {
    const labels = {
        active: 'Активна',
        paused: 'На паузе',
        closed: 'Закрыта'
    };
    return labels[status] || status;
}

function openVacancyModal(vacancyId) {
    const vacancy = vacancies.find(v => v.id === vacancyId);
    if (!vacancy) return;
    
    selectedVacancyId = vacancyId;
    const manager = hiringManagers.find(m => m.id === vacancy.managerId);
    const dept = departments.find(d => d.id === vacancy.department);
    const vacancyCandidates = candidates.filter(c => c.vacancyId === vacancyId);
    
    document.getElementById('vacancyModalTitle').textContent = vacancy.title;
    document.getElementById('vacancyModalBody').innerHTML = `
        <div class="vacancy-detail">
            <div class="form-row mb-4">
                <div>
                    <span class="vacancy-status ${vacancy.status}" style="font-size: 0.875rem;">${getStatusLabel(vacancy.status)}</span>
                    ${vacancy.urgent ? '<span class="stage-badge" style="background: #fee2e2; color: #ef4444; margin-left: 8px;">Срочная</span>' : ''}
                </div>
                <div class="text-muted">
                    Создана: ${formatDate(vacancy.createdAt)} · Дедлайн: ${formatDate(vacancy.deadline)}
                </div>
            </div>
            
            <div class="stats-grid mb-4">
                <div class="stat-card">
                    <div class="stat-value">${vacancy.candidatesCount}</div>
                    <div class="stat-label">Всего кандидатов</div>
                </div>
                <div class="stat-card">
                    <div class="stat-value">${vacancy.stages.offer}</div>
                    <div class="stat-label">На оффере</div>
                </div>
                <div class="stat-card">
                    <div class="stat-value">${formatSalary(vacancy.salary)}</div>
                    <div class="stat-label">Зарплата</div>
                </div>
            </div>
            
            <h4>Описание</h4>
            <p class="mb-4">${vacancy.description}</p>
            
            <h4>Требования (must-have)</h4>
            <ul class="mb-4">
                ${vacancy.requirements.map(r => `<li>${r}</li>`).join('')}
            </ul>
            
            <h4>Желательно (nice-to-have)</h4>
            <ul class="mb-4">
                ${vacancy.niceToHave.map(r => `<li>${r}</li>`).join('')}
            </ul>
            
            <h4>Нанимающий менеджер</h4>
            <div class="vacancy-manager mb-4" style="gap: 12px;">
                <img src="${manager.avatar}" alt="${manager.name}" style="width: 40px; height: 40px;">
                <div>
                    <div style="font-weight: 500;">${manager.name}</div>
                    <div class="text-muted">${manager.role}, ${dept.name}</div>
                </div>
            </div>
            
            <h4>Воронка кандидатов</h4>
            <div class="funnel-chart">
                ${pipelineStages.map(stage => {
                    const count = vacancy.stages[stage.id] || 0;
                    const maxCount = Math.max(...Object.values(vacancy.stages));
                    const percent = maxCount > 0 ? (count / maxCount * 100) : 0;
                    return `
                        <div class="funnel-stage-row">
                            <div class="funnel-stage-label">${stage.name}</div>
                            <div class="funnel-stage-bar-wrapper">
                                <div class="funnel-stage-bar ${stage.id}" style="width: ${percent}%">${count}</div>
                            </div>
                        </div>
                    `;
                }).join('')}
            </div>
            
            <div class="form-actions">
                <button class="btn btn-secondary" onclick="closeModal('vacancyModal')">Закрыть</button>
                <button class="btn btn-primary" onclick="closeModal('vacancyModal'); navigateTo('pipeline'); filterPipelineByVacancy(${vacancy.id})">
                    <i class="fas fa-columns"></i> Открыть воронку
                </button>
            </div>
        </div>
    `;
    
    openModal('vacancyModal');
}

// ===== Candidates =====
function renderCandidates() {
    const page = document.getElementById('candidates-page');
    
    page.innerHTML = `
        <div class="page-header">
            <h1>Кандидаты</h1>
            <div class="page-actions">
                <button class="btn btn-outline" onclick="showToast('info', 'Экспорт', 'Экспорт списка кандидатов')">
                    <i class="fas fa-download"></i> Экспорт
                </button>
                <button class="btn btn-primary" onclick="openModal('addCandidateModal')">
                    <i class="fas fa-user-plus"></i> Добавить кандидата
                </button>
            </div>
        </div>
        
        <div class="candidates-toolbar">
            <div class="candidates-filters">
                <select class="filter-select" id="vacancyFilter" onchange="filterCandidates()">
                    <option value="">Все вакансии</option>
                    ${vacancies.filter(v => v.status !== 'closed').map(v => `<option value="${v.id}">${v.title}</option>`).join('')}
                </select>
                <select class="filter-select" id="stageFilter" onchange="filterCandidates()">
                    <option value="">Все этапы</option>
                    ${pipelineStages.map(s => `<option value="${s.id}">${s.name}</option>`).join('')}
                    <option value="rejected">Отказ</option>
                </select>
                <select class="filter-select" id="sourceFilter" onchange="filterCandidates()">
                    <option value="">Все источники</option>
                    ${sources.map(s => `<option value="${s.value}">${s.label}</option>`).join('')}
                </select>
            </div>
            <div class="search-box" style="width: 300px;">
                <i class="fas fa-search"></i>
                <input type="text" placeholder="Поиск кандидатов..." id="candidateSearch" oninput="filterCandidates()">
            </div>
        </div>
        
        <div class="candidates-table-wrapper">
            <table class="candidates-table">
                <thead>
                    <tr>
                        <th>Кандидат</th>
                        <th>Вакансия</th>
                        <th>Этап</th>
                        <th>Источник</th>
                        <th>Ожидания</th>
                        <th>Дней на этапе</th>
                        <th>Действия</th>
                    </tr>
                </thead>
                <tbody id="candidatesTableBody">
                    ${renderCandidateRows(candidates.filter(c => c.stage !== 'rejected'))}
                </tbody>
            </table>
        </div>
    `;
    
    // Populate vacancy select in add candidate form
    const addVacancySelect = document.getElementById('addCandidateVacancy');
    if (addVacancySelect) {
        addVacancySelect.innerHTML = vacancies.filter(v => v.status === 'active').map(v => 
            `<option value="${v.id}">${v.title}</option>`
        ).join('');
    }
}

function renderCandidateRows(candidatesList) {
    return candidatesList.map(c => {
        const vacancy = vacancies.find(v => v.id === c.vacancyId);
        const sourceLabel = sources.find(s => s.value === c.source)?.label || c.source;
        
        return `
            <tr onclick="openCandidateModal(${c.id})" style="cursor: pointer;">
                <td>
                    <div class="candidate-info">
                        <img src="${c.avatar}" alt="" class="candidate-avatar">
                        <div>
                            <div class="candidate-name">${c.firstName} ${c.lastName}</div>
                            <div class="candidate-position">${c.currentCompany || ''} · ${c.experience}</div>
                        </div>
                    </div>
                </td>
                <td>${vacancy ? vacancy.title : '-'}</td>
                <td><span class="stage-badge ${c.stage}">${getStageLabel(c.stage)}</span></td>
                <td>${sourceLabel}</td>
                <td>${c.salaryExpectation || '-'}</td>
                <td>
                    <span class="${c.daysInStage > 5 ? 'text-danger' : ''}">${c.daysInStage} дн.</span>
                </td>
                <td>
                    <div class="candidate-actions" onclick="event.stopPropagation()">
                        <button class="action-btn" title="Назначить интервью" onclick="openScheduleInterview(${c.id})">
                            <i class="fas fa-calendar-plus"></i>
                        </button>
                        <button class="action-btn" title="Перевести на этап" onclick="openMoveStage(${c.id})">
                            <i class="fas fa-arrow-right"></i>
                        </button>
                        <button class="action-btn danger" title="Отказать" onclick="openRejectModal(${c.id})">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `;
    }).join('');
}

function getStageLabel(stage) {
    const labels = {
        new: 'Новый',
        screening: 'Скрининг',
        interview: 'Интервью',
        technical: 'Техническое',
        final: 'Финал',
        offer: 'Оффер',
        hired: 'Нанят',
        rejected: 'Отказ'
    };
    return labels[stage] || stage;
}

function filterCandidates() {
    const vacancyFilter = document.getElementById('vacancyFilter').value;
    const stageFilter = document.getElementById('stageFilter').value;
    const sourceFilter = document.getElementById('sourceFilter').value;
    const search = document.getElementById('candidateSearch').value.toLowerCase();
    
    let filtered = candidates.filter(c => c.stage !== 'rejected');
    
    if (vacancyFilter) {
        filtered = filtered.filter(c => c.vacancyId === parseInt(vacancyFilter));
    }
    if (stageFilter) {
        filtered = filtered.filter(c => c.stage === stageFilter);
    }
    if (sourceFilter) {
        filtered = filtered.filter(c => c.source === sourceFilter);
    }
    if (search) {
        filtered = filtered.filter(c => 
            `${c.firstName} ${c.lastName}`.toLowerCase().includes(search) ||
            c.email.toLowerCase().includes(search)
        );
    }
    
    document.getElementById('candidatesTableBody').innerHTML = renderCandidateRows(filtered);
}

// ===== Pipeline (Kanban) with Drag & Drop =====
let draggedCandidateId = null;

function renderPipeline() {
    const page = document.getElementById('pipeline-page');
    
    page.innerHTML = `
        <div class="pipeline-header">
            <h1>Воронка кандидатов</h1>
            <select class="pipeline-vacancy-select" id="pipelineVacancySelect" onchange="filterPipelineByVacancy(this.value)">
                <option value="">Все вакансии</option>
                ${vacancies.filter(v => v.status !== 'closed').map(v => `<option value="${v.id}">${v.title}</option>`).join('')}
            </select>
        </div>
        
        <div class="kanban-board" id="kanbanBoard">
            ${renderKanbanColumns(candidates.filter(c => c.stage !== 'rejected' && c.stage !== 'hired'))}
        </div>
    `;

    initKanbanDragDrop();
}

function renderKanbanColumns(candidatesList) {
    return pipelineStages.filter(s => s.id !== 'hired').map(stage => {
        const stageCandidates = candidatesList.filter(c => c.stage === stage.id);
        
        return `
            <div class="kanban-column" data-stage="${stage.id}">
                <div class="kanban-column-header">
                    <div class="kanban-column-title">
                        <span style="display:inline-block; width:10px; height:10px; border-radius:50%; background:${stage.color}; margin-right:6px;"></span>
                        ${stage.name}
                        <span class="kanban-column-count">${stageCandidates.length}</span>
                    </div>
                </div>
                <div class="kanban-column-body" data-stage="${stage.id}">
                    ${stageCandidates.map(c => renderKanbanCard(c)).join('')}
                    ${stageCandidates.length === 0 ? '<div class="empty-state" style="padding: 24px 12px;"><p style="font-size: 0.8rem;">Нет кандидатов</p></div>' : ''}
                </div>
            </div>
        `;
    }).join('');
}

function renderKanbanCard(candidate) {
    const vacancy = vacancies.find(v => v.id === candidate.vacancyId);
    
    return `
        <div class="kanban-card ${candidate.urgent ? 'urgent' : ''}" 
             data-candidate-id="${candidate.id}" 
             draggable="true">
            <div class="kanban-card-header" onclick="openCandidateModal(${candidate.id})">
                <img src="${candidate.avatar}" alt="" class="kanban-card-avatar">
                <div>
                    <div class="kanban-card-name">${candidate.firstName} ${candidate.lastName}</div>
                    <div class="kanban-card-vacancy">${vacancy ? vacancy.title : ''}</div>
                </div>
            </div>
            <div class="kanban-card-meta">
                ${candidate.skills.slice(0, 3).map(s => `<span class="kanban-card-tag">${s}</span>`).join('')}
            </div>
            <div class="kanban-card-footer">
                <div class="kanban-card-days ${candidate.daysInStage > 5 ? 'overdue' : ''}">
                    <i class="fas fa-clock"></i> ${candidate.daysInStage} дн.
                </div>
                ${candidate.urgent ? '<span class="text-danger"><i class="fas fa-fire"></i></span>' : ''}
            </div>
        </div>
    `;
}

function initKanbanDragDrop() {
    const board = document.getElementById('kanbanBoard');
    if (!board) return;

    board.addEventListener('dragstart', (e) => {
        const card = e.target.closest('.kanban-card');
        if (!card) return;
        draggedCandidateId = parseInt(card.dataset.candidateId);
        card.classList.add('dragging');
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/plain', draggedCandidateId);
    });

    board.addEventListener('dragend', (e) => {
        const card = e.target.closest('.kanban-card');
        if (card) card.classList.remove('dragging');
        document.querySelectorAll('.kanban-column').forEach(col => col.classList.remove('drag-over'));
        draggedCandidateId = null;
    });

    board.addEventListener('dragover', (e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        const column = e.target.closest('.kanban-column');
        if (column) {
            document.querySelectorAll('.kanban-column').forEach(col => col.classList.remove('drag-over'));
            column.classList.add('drag-over');
        }
    });

    board.addEventListener('dragleave', (e) => {
        const column = e.target.closest('.kanban-column');
        if (column && !column.contains(e.relatedTarget)) {
            column.classList.remove('drag-over');
        }
    });

    board.addEventListener('drop', (e) => {
        e.preventDefault();
        document.querySelectorAll('.kanban-column').forEach(col => col.classList.remove('drag-over'));
        
        const column = e.target.closest('.kanban-column');
        if (!column || !draggedCandidateId) return;

        const newStage = column.dataset.stage;
        const candidate = candidates.find(c => c.id === draggedCandidateId);
        if (!candidate || candidate.stage === newStage) return;

        const oldStage = candidate.stage;
        candidate.stage = newStage;
        candidate.daysInStage = 0;
        candidate.updatedAt = new Date().toISOString().split('T')[0];

        if (!candidate.timeline) candidate.timeline = [];
        candidate.timeline.push({
            date: new Date().toISOString().split('T')[0],
            event: getStageLabel(newStage),
            type: 'stage',
            description: `Переведен с ${getStageLabel(oldStage)} на ${getStageLabel(newStage)}`
        });

        showToast('success', 'Этап изменен', `${candidate.firstName} ${candidate.lastName} → ${getStageLabel(newStage)}`);

        // Re-render preserving vacancy filter
        const vacancySelect = document.getElementById('pipelineVacancySelect');
        const currentFilter = vacancySelect ? vacancySelect.value : '';
        let filtered = candidates.filter(c => c.stage !== 'rejected' && c.stage !== 'hired');
        if (currentFilter) {
            filtered = filtered.filter(c => c.vacancyId === parseInt(currentFilter));
        }
        document.getElementById('kanbanBoard').innerHTML = renderKanbanColumns(filtered);
        initKanbanDragDrop();
    });
}

function filterPipelineByVacancy(vacancyId) {
    const select = document.getElementById('pipelineVacancySelect');
    if (select && vacancyId) {
        select.value = vacancyId;
    }
    
    let filtered = candidates.filter(c => c.stage !== 'rejected' && c.stage !== 'hired');
    if (vacancyId) {
        filtered = filtered.filter(c => c.vacancyId === parseInt(vacancyId));
    }
    
    document.getElementById('kanbanBoard').innerHTML = renderKanbanColumns(filtered);
    initKanbanDragDrop();
}

// ===== Interviews =====
function renderInterviews() {
    const page = document.getElementById('interviews-page');
    
    page.innerHTML = `
        <div class="page-header">
            <h1>Интервью</h1>
            <div class="page-actions">
                <div class="interviews-view-toggle">
                    <button class="view-toggle-btn active" data-view="list">
                        <i class="fas fa-list"></i>
                    </button>
                    <button class="view-toggle-btn" data-view="calendar">
                        <i class="fas fa-calendar"></i>
                    </button>
                </div>
            </div>
        </div>
        
        <div id="interviewsContent">
            ${renderInterviewsList()}
        </div>
    `;
    
    // View toggle
    page.querySelectorAll('.view-toggle-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            page.querySelectorAll('.view-toggle-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            const view = btn.dataset.view;
            document.getElementById('interviewsContent').innerHTML = 
                view === 'list' ? renderInterviewsList() : renderInterviewsCalendar();
        });
    });
}

function renderInterviewsList() {
    const sortedInterviews = [...interviews].sort((a, b) => {
        const dateA = new Date(`${a.date}T${a.time}`);
        const dateB = new Date(`${b.date}T${b.time}`);
        return dateA - dateB;
    });
    
    return `
        <div class="interviews-list">
            ${sortedInterviews.map(interview => {
                const candidate = candidates.find(c => c.id === interview.candidateId);
                const vacancy = vacancies.find(v => v.id === interview.vacancyId);
                const interviewersList = interview.interviewers.map(id => hiringManagers.find(m => m.id === id));
                
                return `
                    <div class="interview-card" onclick="openCandidateModal(${candidate.id})">
                        <div class="interview-time">
                            <div class="interview-time-value">${interview.time}</div>
                            <div class="interview-time-date">${formatDate(interview.date)}</div>
                        </div>
                        <div class="interview-details">
                            <div class="interview-candidate">${candidate.firstName} ${candidate.lastName}</div>
                            <div class="interview-type">${getInterviewTypeLabel(interview.type)} · ${vacancy.title}</div>
                            <div class="interview-interviewers">
                                ${interviewersList.map(i => `<img src="${i.avatar}" alt="${i.name}" title="${i.name}">`).join('')}
                            </div>
                        </div>
                        <div class="interview-status">
                            <span class="interview-format">${getFormatLabel(interview.format)}</span>
                            <div class="candidate-actions" onclick="event.stopPropagation()">
                                <button class="action-btn" title="Перенести" onclick="showToast('info', 'Перенос', 'Функция переноса интервью')">
                                    <i class="fas fa-clock"></i>
                                </button>
                                <button class="action-btn success" title="Оставить фидбек" onclick="openFeedbackModal(${candidate.id}, ${interview.id})">
                                    <i class="fas fa-comment"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                `;
            }).join('')}
        </div>
    `;
}

function renderInterviewsCalendar() {
    const days = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];
    const hours = ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00'];
    
    return `
        <div class="interviews-calendar">
            <div class="calendar-header">
                <div class="calendar-nav">
                    <button><i class="fas fa-chevron-left"></i></button>
                    <span class="calendar-title">27 января - 2 февраля 2025</span>
                    <button><i class="fas fa-chevron-right"></i></button>
                </div>
                <button class="btn btn-sm btn-outline">Сегодня</button>
            </div>
            <div class="calendar-week">
                <div class="calendar-day-header"></div>
                ${days.map((day, i) => `
                    <div class="calendar-day-header ${i === 0 ? 'today' : ''}">${day}</div>
                `).join('')}
            </div>
            <div class="calendar-week">
                <div class="calendar-times">
                    ${hours.map(h => `<div class="calendar-time">${h}</div>`).join('')}
                </div>
                ${days.map((day, dayIndex) => `
                    <div class="calendar-day">
                        ${dayIndex === 0 ? `
                            <div class="calendar-event hr" style="top: 60px; height: 60px;">
                                10:00 HR Анна М.
                            </div>
                            <div class="calendar-event final" style="top: 120px; height: 60px;">
                                11:00 Финал Алексей С.
                            </div>
                            <div class="calendar-event hr" style="top: 300px; height: 45px;">
                                14:00 HR Дмитрий В.
                            </div>
                            <div class="calendar-event" style="top: 420px; height: 60px;">
                                16:00 Финал Андрей Р.
                            </div>
                        ` : ''}
                        ${dayIndex === 1 ? `
                            <div class="calendar-event technical" style="top: 120px; height: 90px;">
                                11:00 Техн. Максим Н.
                            </div>
                            <div class="calendar-event technical" style="top: 360px; height: 90px;">
                                15:00 Техн. Елена К.
                            </div>
                        ` : ''}
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}

function getInterviewTypeLabel(type) {
    const labels = {
        screening: 'Скрининг',
        hr: 'HR интервью',
        technical: 'Техническое интервью',
        final: 'Финальное интервью',
        manager: 'С менеджером'
    };
    return labels[type] || type;
}

function getFormatLabel(format) {
    const labels = {
        online: 'Онлайн',
        offline: 'Офис',
        phone: 'Телефон'
    };
    return labels[format] || format;
}

// ===== Talent Pool =====
function renderTalentPool() {
    const page = document.getElementById('talent-pool-page');
    
    page.innerHTML = `
        <div class="page-header">
            <h1>Талант-пул</h1>
            <div class="page-actions">
                <button class="btn btn-primary" onclick="showToast('info', 'Добавление', 'Добавление в талант-пул')">
                    <i class="fas fa-plus"></i> Добавить
                </button>
            </div>
        </div>
        
        <div class="talent-pool-stats">
            <div class="pool-stat">
                <div class="pool-stat-value">${talentPool.length}</div>
                <div class="pool-stat-label">Всего в пуле</div>
            </div>
            <div class="pool-stat">
                <div class="pool-stat-value">2</div>
                <div class="pool-stat-label">Можно связаться</div>
            </div>
            <div class="pool-stat">
                <div class="pool-stat-value">5</div>
                <div class="pool-stat-label">Frontend</div>
            </div>
            <div class="pool-stat">
                <div class="pool-stat-value">3</div>
                <div class="pool-stat-label">Backend</div>
            </div>
        </div>
        
        <div class="talent-pool-grid">
            ${talentPool.map(talent => {
                const candidate = talent.candidateId ? candidates.find(c => c.id === talent.candidateId) : talent;
                return `
                    <div class="talent-card" onclick="${talent.candidateId ? `openCandidateModal(${talent.candidateId})` : 'showToast("info", "Талант", "Просмотр таланта")'}">
                        <div class="talent-card-header">
                            <img src="${candidate.avatar}" alt="" class="talent-avatar">
                            <div class="talent-info">
                                <h4>${candidate.firstName} ${candidate.lastName}</h4>
                                <p>${candidate.skills ? candidate.skills.slice(0, 2).join(', ') : ''} · ${candidate.experience}</p>
                            </div>
                        </div>
                        <div class="talent-tags">
                            ${(talent.tags || []).map(t => `<span class="talent-tag">${t}</span>`).join('')}
                        </div>
                        <p class="text-muted" style="font-size: 0.875rem; margin-bottom: 12px;">
                            ${talent.reason}
                        </p>
                        <div class="talent-footer">
                            <span>Добавлен: ${formatDate(talent.addedAt)}</span>
                            <span>Связаться: ${formatDate(talent.nextContactAt)}</span>
                        </div>
                    </div>
                `;
            }).join('')}
        </div>
    `;
}

// ===== Offers =====
function renderOffers() {
    const page = document.getElementById('offers-page');
    
    page.innerHTML = `
        <div class="page-header">
            <h1>Офферы</h1>
        </div>
        
        <div class="offers-grid">
            ${offers.map(offer => {
                const candidate = candidates.find(c => c.id === offer.candidateId);
                const vacancy = vacancies.find(v => v.id === offer.vacancyId);
                
                return `
                    <div class="offer-card ${offer.status}">
                        <div class="offer-header">
                            <div class="offer-candidate-info">
                                <img src="${candidate.avatar}" alt="">
                                <div>
                                    <div class="offer-candidate-name">${candidate.firstName} ${candidate.lastName}</div>
                                    <div class="offer-position">${vacancy.title}</div>
                                </div>
                            </div>
                            <span class="offer-status-badge ${offer.status}">${getOfferStatusLabel(offer.status)}</span>
                        </div>
                        <div class="offer-body">
                            <div class="offer-details">
                                <div class="offer-detail">
                                    <span class="offer-detail-label">Оклад</span>
                                    <span class="offer-detail-value">${offer.salary}</span>
                                </div>
                                <div class="offer-detail">
                                    <span class="offer-detail-label">Дата выхода</span>
                                    <span class="offer-detail-value">${formatDate(offer.startDate)}</span>
                                </div>
                                <div class="offer-detail">
                                    <span class="offer-detail-label">Формат</span>
                                    <span class="offer-detail-value">${getWorkFormatLabel(offer.workFormat)}</span>
                                </div>
                                <div class="offer-detail">
                                    <span class="offer-detail-label">Действует до</span>
                                    <span class="offer-detail-value">${formatDate(offer.expiryDate)}</span>
                                </div>
                            </div>
                        </div>
                        <div class="offer-footer">
                            ${offer.status === 'pending' ? `
                                <button class="btn btn-sm btn-success" onclick="updateOfferStatus(${offer.id}, 'sent')">
                                    <i class="fas fa-paper-plane"></i> Отправить
                                </button>
                            ` : ''}
                            ${offer.status === 'sent' ? `
                                <button class="btn btn-sm btn-success" onclick="updateOfferStatus(${offer.id}, 'accepted')">
                                    <i class="fas fa-check"></i> Принят
                                </button>
                                <button class="btn btn-sm btn-danger" onclick="updateOfferStatus(${offer.id}, 'rejected')">
                                    <i class="fas fa-times"></i> Отклонен
                                </button>
                            ` : ''}
                            <button class="btn btn-sm btn-outline" onclick="openCandidateModal(${candidate.id})">
                                <i class="fas fa-user"></i> Кандидат
                            </button>
                        </div>
                    </div>
                `;
            }).join('')}
        </div>
    `;
}

function getOfferStatusLabel(status) {
    const labels = {
        pending: 'Согласование',
        sent: 'Отправлен',
        accepted: 'Принят',
        rejected: 'Отклонен',
        expired: 'Истек'
    };
    return labels[status] || status;
}

function getWorkFormatLabel(format) {
    const labels = {
        office: 'Офис',
        remote: 'Удаленно',
        hybrid: 'Гибрид'
    };
    return labels[format] || format;
}

function updateOfferStatus(offerId, newStatus) {
    const offer = offers.find(o => o.id === offerId);
    if (offer) {
        offer.status = newStatus;
        renderOffers();
        showToast('success', 'Статус обновлен', `Статус оффера изменен на "${getOfferStatusLabel(newStatus)}"`);
    }
}

// ===== Analytics =====
function renderAnalytics() {
    const page = document.getElementById('analytics-page');
    
    const maxFunnel = Math.max(...analyticsData.funnelData.map(d => d.count));
    
    page.innerHTML = `
        <div class="page-header">
            <h1>Аналитика</h1>
            <div class="page-actions">
                <select class="filter-select">
                    <option>Последние 30 дней</option>
                    <option>Последние 90 дней</option>
                    <option>Этот год</option>
                </select>
                <button class="btn btn-outline" onclick="showToast('info', 'Экспорт', 'Экспорт отчета')">
                    <i class="fas fa-download"></i> Экспорт
                </button>
            </div>
        </div>
        
        <div class="stats-grid mb-4">
            <div class="stat-card">
                <div class="stat-icon primary"><i class="fas fa-clock"></i></div>
                <div class="stat-value">${analyticsData.timeToHire.average}</div>
                <div class="stat-label">Среднее время найма (дни)</div>
            </div>
            <div class="stat-card">
                <div class="stat-icon success"><i class="fas fa-percentage"></i></div>
                <div class="stat-value">3.2%</div>
                <div class="stat-label">Конверсия в найм</div>
            </div>
            <div class="stat-card">
                <div class="stat-icon warning"><i class="fas fa-users"></i></div>
                <div class="stat-value">156</div>
                <div class="stat-label">Всего откликов</div>
            </div>
            <div class="stat-card">
                <div class="stat-icon danger"><i class="fas fa-user-check"></i></div>
                <div class="stat-value">5</div>
                <div class="stat-label">Нанято за период</div>
            </div>
        </div>
        
        <div class="analytics-grid">
            <div class="chart-card">
                <div class="chart-header">
                    <h3 class="chart-title">Воронка найма</h3>
                </div>
                <div class="funnel-chart">
                    ${analyticsData.funnelData.map((item, idx) => {
                        const percent = (item.count / maxFunnel * 100);
                        const colors = ['#4f46e5', '#60a5fa', '#818cf8', '#a78bfa', '#c084fc', '#34d399', '#10b981'];
                        const prevCount = idx > 0 ? analyticsData.funnelData[idx - 1].count : null;
                        const convRate = prevCount ? ((item.count / prevCount) * 100).toFixed(0) : null;
                        return `
                            <div class="funnel-stage-row">
                                <div class="funnel-stage-label">${item.stage}</div>
                                <div class="funnel-stage-bar-wrapper">
                                    <div class="funnel-stage-bar" style="width: ${percent}%; background: ${colors[idx] || colors[0]};">${item.count}</div>
                                </div>
                                <span class="text-muted" style="font-size:0.75rem; min-width:45px; text-align:right;">${convRate ? convRate + '%' : ''}</span>
                            </div>
                        `;
                    }).join('')}
                </div>
            </div>
            
            <div class="chart-card">
                <div class="chart-header">
                    <h3 class="chart-title">Эффективность источников</h3>
                </div>
                <table class="candidates-table" style="margin: 0;">
                    <thead>
                        <tr>
                            <th>Источник</th>
                            <th>Откликов</th>
                            <th>Наймов</th>
                            <th>Конверсия</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${analyticsData.sourceEfficiency.map(item => `
                            <tr>
                                <td>${item.source}</td>
                                <td>${item.applications}</td>
                                <td>${item.hires}</td>
                                <td>${item.conversion}%</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
            
            <div class="chart-card full-width">
                <div class="chart-header">
                    <h3 class="chart-title">Активность по неделям</h3>
                </div>
                <div class="metrics-row">
                    ${analyticsData.weeklyActivity.map(week => `
                        <div class="metric-item">
                            <div class="metric-label">${week.week}</div>
                            <div class="metric-value">${week.applications}</div>
                            <div class="metric-label">откликов</div>
                        </div>
                    `).join('')}
                </div>
            </div>
            
            <div class="chart-card">
                <div class="chart-header">
                    <h3 class="chart-title">Время найма</h3>
                </div>
                <div class="metrics-row">
                    <div class="metric-item">
                        <div class="metric-value">${analyticsData.timeToHire.min}</div>
                        <div class="metric-label">Минимум</div>
                    </div>
                    <div class="metric-item">
                        <div class="metric-value">${analyticsData.timeToHire.median}</div>
                        <div class="metric-label">Медиана</div>
                    </div>
                    <div class="metric-item">
                        <div class="metric-value">${analyticsData.timeToHire.average}</div>
                        <div class="metric-label">Среднее</div>
                    </div>
                    <div class="metric-item">
                        <div class="metric-value">${analyticsData.timeToHire.max}</div>
                        <div class="metric-label">Максимум</div>
                    </div>
                </div>
            </div>
            
            <div class="chart-card">
                <div class="chart-header">
                    <h3 class="chart-title">Причины отказов</h3>
                </div>
                <div class="funnel-chart">
                    <div class="funnel-stage-row">
                        <div class="funnel-stage-label">Навыки</div>
                        <div class="funnel-stage-bar-wrapper">
                            <div class="funnel-stage-bar" style="width: 45%; background: #ef4444;">28</div>
                        </div>
                    </div>
                    <div class="funnel-stage-row">
                        <div class="funnel-stage-label">Зарплата</div>
                        <div class="funnel-stage-bar-wrapper">
                            <div class="funnel-stage-bar" style="width: 30%; background: #f59e0b;">18</div>
                        </div>
                    </div>
                    <div class="funnel-stage-row">
                        <div class="funnel-stage-label">Не отвечает</div>
                        <div class="funnel-stage-bar-wrapper">
                            <div class="funnel-stage-bar" style="width: 15%; background: #64748b;">9</div>
                        </div>
                    </div>
                    <div class="funnel-stage-row">
                        <div class="funnel-stage-label">Другой оффер</div>
                        <div class="funnel-stage-bar-wrapper">
                            <div class="funnel-stage-bar" style="width: 10%; background: #3b82f6;">6</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// ===== Settings =====
let currentSettingsSection = 'profile';

function renderSettings() {
    const page = document.getElementById('settings-page');
    
    page.innerHTML = `
        <div class="page-header">
            <h1>Настройки</h1>
        </div>
        
        <div class="settings-grid">
            <div class="settings-nav">
                <div class="settings-nav-item active" data-section="profile">
                    <i class="fas fa-user"></i> Профиль
                </div>
                <div class="settings-nav-item" data-section="notifications">
                    <i class="fas fa-bell"></i> Уведомления
                </div>
                <div class="settings-nav-item" data-section="pipeline">
                    <i class="fas fa-columns"></i> Этапы воронки
                </div>
                <div class="settings-nav-item" data-section="templates">
                    <i class="fas fa-file-alt"></i> Шаблоны
                </div>
                <div class="settings-nav-item" data-section="integrations">
                    <i class="fas fa-plug"></i> Интеграции
                </div>
                <div class="settings-nav-item" data-section="team">
                    <i class="fas fa-users"></i> Команда
                </div>
            </div>
            
            <div class="settings-content" id="settingsContent">
                ${renderSettingsSection('profile')}
            </div>
        </div>
    `;
    
    // Settings nav
    page.querySelectorAll('.settings-nav-item').forEach(item => {
        item.addEventListener('click', () => {
            page.querySelectorAll('.settings-nav-item').forEach(i => i.classList.remove('active'));
            item.classList.add('active');
            currentSettingsSection = item.dataset.section;
            document.getElementById('settingsContent').innerHTML = renderSettingsSection(currentSettingsSection);
        });
    });
}

function renderSettingsSection(section) {
    switch(section) {
        case 'profile':
            return `
                <div class="settings-section">
                    <h3>Профиль</h3>
                    <div style="display:flex; align-items:center; gap:20px; margin-bottom:24px;">
                        <img src="https://i.pravatar.cc/80?img=1" alt="" style="width:80px; height:80px; border-radius:50%; object-fit:cover;">
                        <div>
                            <button class="btn btn-outline btn-sm">Загрузить фото</button>
                            <p class="text-muted" style="font-size:0.75rem; margin-top:4px;">JPG, PNG до 2 МБ</p>
                        </div>
                    </div>
                    <div class="form-row">
                        <div class="form-group">
                            <label>Имя</label>
                            <input type="text" value="Мария">
                        </div>
                        <div class="form-group">
                            <label>Фамилия</label>
                            <input type="text" value="Иванова">
                        </div>
                    </div>
                    <div class="form-group">
                        <label>Email</label>
                        <input type="email" value="maria.ivanova@workhere.com">
                    </div>
                    <div class="form-row">
                        <div class="form-group">
                            <label>Телефон</label>
                            <input type="tel" value="+7 (999) 000-00-00">
                        </div>
                        <div class="form-group">
                            <label>Telegram</label>
                            <input type="text" value="@maria_hr">
                        </div>
                    </div>
                    <div class="form-group">
                        <label>Роль</label>
                        <input type="text" value="Рекрутер" readonly class="readonly-input">
                    </div>
                </div>
                <div class="form-actions" style="border-top: none; padding-top: 0;">
                    <button class="btn btn-primary" onclick="showToast('success', 'Сохранено', 'Профиль обновлен')">Сохранить</button>
                </div>
            `;

        case 'notifications':
            return `
                <div class="settings-section">
                    <h3>Email-уведомления</h3>
                    <div class="checkbox-group">
                        <label class="checkbox-item"><input type="checkbox" checked><span>Новые отклики на мои вакансии</span></label>
                        <label class="checkbox-item"><input type="checkbox" checked><span>Напоминания об интервью (за 1 час)</span></label>
                        <label class="checkbox-item"><input type="checkbox" checked><span>Просроченные фидбеки (3+ дня)</span></label>
                        <label class="checkbox-item"><input type="checkbox" checked><span>Изменения статуса оффера</span></label>
                        <label class="checkbox-item"><input type="checkbox"><span>Ежедневный дайджест (утренний)</span></label>
                        <label class="checkbox-item"><input type="checkbox"><span>Еженедельный отчет</span></label>
                    </div>
                </div>
                <div class="settings-section">
                    <h3>Push-уведомления в браузере</h3>
                    <div class="checkbox-group">
                        <label class="checkbox-item"><input type="checkbox" checked><span>Срочные события</span></label>
                        <label class="checkbox-item"><input type="checkbox" checked><span>Новые сообщения от кандидатов</span></label>
                        <label class="checkbox-item"><input type="checkbox"><span>Все изменения по кандидатам</span></label>
                    </div>
                </div>
                <div class="settings-section">
                    <h3>Telegram-уведомления</h3>
                    <div class="form-group">
                        <label>Telegram Bot</label>
                        <div style="display:flex; gap:8px;">
                            <input type="text" value="" placeholder="Нажмите для подключения..." readonly class="readonly-input" style="flex:1;">
                            <button class="btn btn-outline" onclick="showToast('info', 'Telegram', 'Откройте бота @WorkHereBot в Telegram')">Подключить</button>
                        </div>
                    </div>
                </div>
                <div class="form-actions" style="border-top: none; padding-top: 0;">
                    <button class="btn btn-primary" onclick="showToast('success', 'Сохранено', 'Настройки уведомлений обновлены')">Сохранить</button>
                </div>
            `;

        case 'pipeline':
            return `
                <div class="settings-section">
                    <h3>Этапы воронки</h3>
                    <p class="text-muted mb-4" style="font-size:0.875rem;">Настройте этапы для процесса найма. Порядок можно менять перетаскиванием.</p>
                    <div style="display:flex; flex-direction:column; gap:8px;">
                        ${pipelineStages.map((stage, i) => `
                            <div style="display:flex; align-items:center; gap:12px; padding:12px 16px; background:var(--bg-tertiary); border-radius:var(--border-radius); border:1px solid var(--border-color);">
                                <i class="fas fa-grip-vertical text-muted" style="cursor:grab;"></i>
                                <span style="width:12px; height:12px; border-radius:50%; background:${stage.color}; flex-shrink:0;"></span>
                                <input type="text" value="${stage.name}" style="flex:1; border:none; background:transparent; font-size:0.875rem; color:var(--text-primary); outline:none;">
                                <span class="text-muted" style="font-size:0.75rem;">Этап ${i + 1}</span>
                                ${stage.id !== 'new' && stage.id !== 'hired' ? '<button class="action-btn danger" style="width:28px; height:28px;"><i class="fas fa-times" style="font-size:0.7rem;"></i></button>' : ''}
                            </div>
                        `).join('')}
                    </div>
                    <button class="btn btn-outline btn-sm mt-4" onclick="showToast('info', 'Этапы', 'Функция добавления нового этапа')">
                        <i class="fas fa-plus"></i> Добавить этап
                    </button>
                </div>
                <div class="form-actions" style="border-top: none; padding-top: 0;">
                    <button class="btn btn-primary" onclick="showToast('success', 'Сохранено', 'Этапы воронки обновлены')">Сохранить</button>
                </div>
            `;

        case 'templates':
            return `
                <div class="settings-section">
                    <h3>Шаблоны писем</h3>
                    <div style="display:flex; flex-direction:column; gap:12px;">
                        ${[
                            { name: 'Приглашение на скрининг', uses: 45 },
                            { name: 'Приглашение на интервью', uses: 38 },
                            { name: 'Приглашение на техническое', uses: 22 },
                            { name: 'Отказ (общий)', uses: 67 },
                            { name: 'Отказ (после интервью)', uses: 31 },
                            { name: 'Отправка оффера', uses: 12 }
                        ].map(t => `
                            <div style="display:flex; align-items:center; justify-content:space-between; padding:14px 16px; background:var(--bg-tertiary); border-radius:var(--border-radius); border:1px solid var(--border-color);">
                                <div>
                                    <div style="font-weight:500;">${t.name}</div>
                                    <div class="text-muted" style="font-size:0.75rem;">Использовано ${t.uses} раз</div>
                                </div>
                                <div style="display:flex; gap:8px;">
                                    <button class="btn btn-outline btn-sm" onclick="showToast('info', 'Шаблон', 'Редактирование шаблона')">
                                        <i class="fas fa-edit"></i>
                                    </button>
                                    <button class="btn btn-outline btn-sm" onclick="showToast('info', 'Шаблон', 'Предпросмотр шаблона')">
                                        <i class="fas fa-eye"></i>
                                    </button>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                    <button class="btn btn-outline btn-sm mt-4" onclick="showToast('info', 'Шаблоны', 'Создание нового шаблона')">
                        <i class="fas fa-plus"></i> Новый шаблон
                    </button>
                </div>
            `;

        case 'integrations':
            return `
                <div class="settings-section">
                    <h3>Подключенные интеграции</h3>
                    <div style="display:flex; flex-direction:column; gap:12px;">
                        ${[
                            { name: 'HeadHunter', icon: 'fa-globe', status: 'connected', desc: 'Публикация вакансий, получение откликов' },
                            { name: 'Google Calendar', icon: 'fa-calendar', status: 'connected', desc: 'Синхронизация интервью' },
                            { name: 'Gmail', icon: 'fa-envelope', status: 'disconnected', desc: 'Отправка писем кандидатам' },
                            { name: 'Telegram Bot', icon: 'fa-paper-plane', status: 'disconnected', desc: 'Уведомления и напоминания' },
                            { name: 'Slack', icon: 'fa-hashtag', status: 'disconnected', desc: 'Уведомления для команды' },
                            { name: 'Zoom', icon: 'fa-video', status: 'disconnected', desc: 'Видео-интервью' }
                        ].map(i => `
                            <div style="display:flex; align-items:center; gap:16px; padding:16px; background:var(--bg-tertiary); border-radius:var(--border-radius); border:1px solid var(--border-color);">
                                <div style="width:44px; height:44px; border-radius:var(--border-radius); background:var(--bg-secondary); display:flex; align-items:center; justify-content:center; font-size:1.25rem; color:var(--text-secondary);"><i class="fas ${i.icon}"></i></div>
                                <div style="flex:1;">
                                    <div style="font-weight:500;">${i.name}</div>
                                    <div class="text-muted" style="font-size:0.75rem;">${i.desc}</div>
                                </div>
                                ${i.status === 'connected' 
                                    ? '<span class="stage-badge offer" style="font-size: 0.7rem;">Подключено</span><button class="btn btn-outline btn-sm">Настроить</button>' 
                                    : '<button class="btn btn-primary btn-sm" onclick="showToast(\'info\', \'Интеграция\', \'Подключение ' + i.name + '\')">Подключить</button>'
                                }
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;

        case 'team':
            return `
                <div class="settings-section">
                    <h3>Команда</h3>
                    <div style="display:flex; flex-direction:column; gap:12px;">
                        ${[
                            { name: 'Мария Иванова', role: 'Рекрутер', email: 'maria@workhere.com', avatar: 'https://i.pravatar.cc/40?img=1', status: 'Онлайн' },
                            { name: 'Ольга Смирнова', role: 'HR Director', email: 'olga@workhere.com', avatar: 'https://i.pravatar.cc/40?img=5', status: 'Онлайн' },
                            { name: 'Алексей Петров', role: 'Tech Lead', email: 'alexey@workhere.com', avatar: 'https://i.pravatar.cc/40?img=11', status: 'Офлайн' },
                            { name: 'Дмитрий Козлов', role: 'CTO', email: 'dmitry@workhere.com', avatar: 'https://i.pravatar.cc/40?img=12', status: 'Офлайн' },
                            { name: 'Анна Федорова', role: 'Product Manager', email: 'anna@workhere.com', avatar: 'https://i.pravatar.cc/40?img=9', status: 'Онлайн' }
                        ].map(m => `
                            <div style="display:flex; align-items:center; gap:12px; padding:14px 16px; background:var(--bg-tertiary); border-radius:var(--border-radius); border:1px solid var(--border-color);">
                                <img src="${m.avatar}" alt="" style="width:40px; height:40px; border-radius:50%; object-fit:cover;">
                                <div style="flex:1;">
                                    <div style="font-weight:500;">${m.name}</div>
                                    <div class="text-muted" style="font-size:0.75rem;">${m.role} · ${m.email}</div>
                                </div>
                                <span style="font-size:0.75rem; color: ${m.status === 'Онлайн' ? 'var(--success)' : 'var(--text-muted)'};">
                                    <i class="fas fa-circle" style="font-size:0.5rem; margin-right:4px;"></i>${m.status}
                                </span>
                                <button class="btn btn-outline btn-sm">
                                    <i class="fas fa-ellipsis-v"></i>
                                </button>
                            </div>
                        `).join('')}
                    </div>
                    <button class="btn btn-primary btn-sm mt-4" onclick="showToast('info', 'Команда', 'Отправка приглашения')">
                        <i class="fas fa-user-plus"></i> Пригласить участника
                    </button>
                </div>
            `;

        default:
            return '<p class="text-muted">Раздел в разработке</p>';
    }
}

// ===== Candidate Detail Modal =====
function openCandidateModal(candidateId) {
    const candidate = candidates.find(c => c.id === candidateId);
    if (!candidate) return;
    
    selectedCandidateId = candidateId;
    const vacancy = vacancies.find(v => v.id === candidate.vacancyId);
    const sourceLabel = sources.find(s => s.value === candidate.source)?.label || candidate.source;
    
    document.getElementById('candidateModalTitle').textContent = `${candidate.firstName} ${candidate.lastName}`;
    document.getElementById('candidateModalBody').innerHTML = `
        <div class="candidate-detail">
            <div class="candidate-sidebar">
                <div class="candidate-profile">
                    <img src="${candidate.avatar}" alt="" class="candidate-profile-avatar">
                    <div class="candidate-profile-name">${candidate.firstName} ${candidate.lastName}</div>
                    <div class="candidate-profile-position">${candidate.currentCompany || ''}</div>
                    <span class="stage-badge ${candidate.stage}">${getStageLabel(candidate.stage)}</span>
                </div>
                
                <div class="candidate-contact-list">
                    <div class="candidate-contact-item">
                        <i class="fas fa-envelope"></i>
                        <a href="mailto:${candidate.email}">${candidate.email}</a>
                    </div>
                    <div class="candidate-contact-item">
                        <i class="fas fa-phone"></i>
                        <span>${candidate.phone}</span>
                    </div>
                    ${candidate.telegram ? `
                        <div class="candidate-contact-item">
                            <i class="fab fa-telegram"></i>
                            <span>${candidate.telegram}</span>
                        </div>
                    ` : ''}
                    ${candidate.linkedin ? `
                        <div class="candidate-contact-item">
                            <i class="fab fa-linkedin"></i>
                            <a href="${candidate.linkedin}" target="_blank">LinkedIn</a>
                        </div>
                    ` : ''}
                </div>
                
                <div class="mt-4">
                    <div class="candidate-contact-item">
                        <i class="fas fa-briefcase"></i>
                        <span>${vacancy ? vacancy.title : '-'}</span>
                    </div>
                    <div class="candidate-contact-item">
                        <i class="fas fa-money-bill"></i>
                        <span>${candidate.salaryExpectation || '-'}</span>
                    </div>
                    <div class="candidate-contact-item">
                        <i class="fas fa-map-marker-alt"></i>
                        <span>${candidate.location || '-'}</span>
                    </div>
                    <div class="candidate-contact-item">
                        <i class="fas fa-user-tag"></i>
                        <span>${sourceLabel}${candidate.referrer ? ` (${candidate.referrer})` : ''}</span>
                    </div>
                </div>
                
                <div class="candidate-quick-actions">
                    <button class="btn btn-primary" onclick="openScheduleInterview(${candidate.id}); closeModal('candidateModal');">
                        <i class="fas fa-calendar-plus"></i> Назначить интервью
                    </button>
                    <button class="btn btn-outline" onclick="openMoveStage(${candidate.id}); closeModal('candidateModal');">
                        <i class="fas fa-arrow-right"></i> Перевести на этап
                    </button>
                    ${candidate.stage === 'final' || candidate.stage === 'offer' ? `
                        <button class="btn btn-success" onclick="openOfferModal(${candidate.id}); closeModal('candidateModal');">
                            <i class="fas fa-file-signature"></i> Создать оффер
                        </button>
                    ` : ''}
                    <button class="btn btn-danger" onclick="openRejectModal(${candidate.id}); closeModal('candidateModal');">
                        <i class="fas fa-times"></i> Отказать
                    </button>
                </div>
            </div>
            
            <div class="candidate-main">
                <div class="candidate-tabs">
                    <div class="candidate-tab active" data-tab="overview">Обзор</div>
                    <div class="candidate-tab" data-tab="timeline">История</div>
                    <div class="candidate-tab" data-tab="feedback">Фидбек</div>
                    <div class="candidate-tab" data-tab="notes">Заметки</div>
                </div>
                
                <div class="candidate-tab-content active" id="tab-overview">
                    <h4>Навыки</h4>
                    <div class="kanban-card-meta mb-4">
                        ${candidate.skills.map(s => `<span class="kanban-card-tag">${s}</span>`).join('')}
                    </div>
                    
                    <h4>Опыт</h4>
                    <p class="mb-4">${candidate.experience} опыта${candidate.currentCompany ? `, сейчас в ${candidate.currentCompany}` : ''}</p>
                    
                    <h4>Следующий шаг</h4>
                    <div class="priority-item info mb-4">
                        <div class="priority-icon info">
                            <i class="fas fa-arrow-right"></i>
                        </div>
                        <div class="priority-content">
                            <div class="priority-title">${candidate.nextStep || 'Не определен'}</div>
                            <div class="priority-meta">
                                ${candidate.nextStepDue ? `<span>До: ${formatDate(candidate.nextStepDue)}</span>` : ''}
                            </div>
                        </div>
                    </div>
                    
                    <h4>Статус</h4>
                    <div class="stats-grid">
                        <div class="stat-card">
                            <div class="stat-value">${candidate.daysInStage}</div>
                            <div class="stat-label">Дней на этапе</div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-value">${candidate.feedbacks?.length || 0}</div>
                            <div class="stat-label">Фидбеков</div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-value">${candidate.rating || '-'}</div>
                            <div class="stat-label">Рейтинг</div>
                        </div>
                    </div>
                </div>
                
                <div class="candidate-tab-content" id="tab-timeline">
                    <div class="timeline">
                        ${(candidate.timeline || []).reverse().map(item => `
                            <div class="timeline-item ${item.type === 'completed' ? 'completed' : ''}">
                                <div class="timeline-date">${formatDate(item.date)}</div>
                                <div class="timeline-title">${item.event}</div>
                                <div class="timeline-content">${item.description}</div>
                            </div>
                        `).join('') || '<p class="text-muted">История пока пуста</p>'}
                    </div>
                </div>
                
                <div class="candidate-tab-content" id="tab-feedback">
                    ${(candidate.feedbacks || []).map(fb => {
                        const interviewer = hiringManagers.find(m => m.id === fb.interviewerId);
                        return `
                            <div class="feedback-card">
                                <div class="feedback-header">
                                    <div class="feedback-author">
                                        <img src="${interviewer?.avatar || 'https://i.pravatar.cc/40'}" alt="">
                                        <div>
                                            <div class="feedback-author-name">${interviewer?.name || 'Неизвестно'}</div>
                                            <div class="feedback-author-role">${interviewer?.role || ''} · ${formatDate(fb.date)}</div>
                                        </div>
                                    </div>
                                    <span class="feedback-rating ${fb.rating >= 4 ? 'positive' : fb.rating >= 3 ? 'neutral' : 'negative'}">
                                        ${fb.rating}/5 - ${getRecommendationLabel(fb.recommendation)}
                                    </span>
                                </div>
                                <div class="feedback-body">
                                    ${fb.strengths ? `<p><strong>Сильные стороны:</strong> ${fb.strengths}</p>` : ''}
                                    ${fb.weaknesses ? `<p><strong>Зоны развития:</strong> ${fb.weaknesses}</p>` : ''}
                                    ${fb.comment ? `<p>${fb.comment}</p>` : ''}
                                </div>
                            </div>
                        `;
                    }).join('') || '<p class="text-muted">Фидбеков пока нет</p>'}
                    
                    <button class="btn btn-outline mt-4" onclick="openFeedbackModal(${candidate.id}); closeModal('candidateModal');">
                        <i class="fas fa-plus"></i> Добавить фидбек
                    </button>
                </div>
                
                <div class="candidate-tab-content" id="tab-notes">
                    ${(candidate.notes || []).map(note => `
                        <div class="feedback-card">
                            <div class="feedback-header">
                                <div class="feedback-author">
                                    <div class="feedback-author-name">${note.author}</div>
                                    <div class="feedback-author-role">${formatDate(note.date)}</div>
                                </div>
                            </div>
                            <div class="feedback-body">${note.text}</div>
                        </div>
                    `).join('') || '<p class="text-muted">Заметок пока нет</p>'}
                    
                    <div class="note-input">
                        <input type="text" placeholder="Добавить заметку..." id="newNoteInput">
                        <button class="btn btn-primary" onclick="addNote(${candidate.id})">
                            <i class="fas fa-plus"></i>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Tab switching
    document.querySelectorAll('.candidate-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            document.querySelectorAll('.candidate-tab').forEach(t => t.classList.remove('active'));
            document.querySelectorAll('.candidate-tab-content').forEach(c => c.classList.remove('active'));
            tab.classList.add('active');
            document.getElementById(`tab-${tab.dataset.tab}`).classList.add('active');
        });
    });
    
    openModal('candidateModal');
}

function getRecommendationLabel(rec) {
    const labels = {
        hire: 'Нанять',
        next_stage: 'Следующий этап',
        hold: 'Отложить',
        reject: 'Отказать'
    };
    return labels[rec] || rec;
}

function addNote(candidateId) {
    const input = document.getElementById('newNoteInput');
    const text = input.value.trim();
    if (!text) return;
    
    const candidate = candidates.find(c => c.id === candidateId);
    if (candidate) {
        if (!candidate.notes) candidate.notes = [];
        candidate.notes.unshift({
            id: Date.now(),
            text: text,
            author: 'Мария Иванова',
            date: new Date().toISOString().split('T')[0]
        });
        input.value = '';
        openCandidateModal(candidateId);
        showToast('success', 'Заметка добавлена', 'Заметка успешно сохранена');
    }
}

// ===== Modals =====
function initModals() {
    // Close on overlay click
    document.querySelectorAll('.modal-overlay').forEach(overlay => {
        overlay.addEventListener('click', () => {
            overlay.closest('.modal').classList.remove('active');
        });
    });
    
    // Close on X button
    document.querySelectorAll('[data-close-modal]').forEach(btn => {
        btn.addEventListener('click', () => {
            btn.closest('.modal').classList.remove('active');
        });
    });
    
    // Add candidate button
    document.getElementById('addCandidateBtn').addEventListener('click', () => {
        openModal('addCandidateModal');
    });
}

function openModal(modalId) {
    document.getElementById(modalId).classList.add('active');
}

function closeModal(modalId) {
    document.getElementById(modalId).classList.remove('active');
}

function openScheduleInterview(candidateId) {
    const candidate = candidates.find(c => c.id === candidateId);
    if (!candidate) return;
    
    document.getElementById('interviewCandidateId').value = candidateId;
    document.getElementById('interviewCandidateName').value = `${candidate.firstName} ${candidate.lastName}`;
    
    // Set default date to tomorrow
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    document.querySelector('#scheduleInterviewForm input[name="date"]').value = tomorrow.toISOString().split('T')[0];
    
    openModal('scheduleInterviewModal');
}

function openFeedbackModal(candidateId, interviewId) {
    const candidate = candidates.find(c => c.id === candidateId);
    if (!candidate) return;
    
    document.getElementById('feedbackCandidateId').value = candidateId;
    document.getElementById('feedbackInterviewId').value = interviewId || '';
    document.getElementById('feedbackCandidateName').value = `${candidate.firstName} ${candidate.lastName}`;
    
    openModal('feedbackModal');
}

function openRejectModal(candidateId) {
    const candidate = candidates.find(c => c.id === candidateId);
    if (!candidate) return;
    
    document.getElementById('rejectCandidateId').value = candidateId;
    document.getElementById('rejectCandidateName').value = `${candidate.firstName} ${candidate.lastName}`;
    
    openModal('rejectModal');
}

function openOfferModal(candidateId) {
    const candidate = candidates.find(c => c.id === candidateId);
    if (!candidate) return;
    
    const vacancy = vacancies.find(v => v.id === candidate.vacancyId);
    
    document.getElementById('offerCandidateId').value = candidateId;
    document.getElementById('offerCandidateName').value = `${candidate.firstName} ${candidate.lastName}`;
    document.getElementById('offerPosition').value = vacancy ? vacancy.title : '';
    
    // Set default dates
    const startDate = new Date();
    startDate.setDate(startDate.getDate() + 14);
    document.querySelector('#offerForm input[name="startDate"]').value = startDate.toISOString().split('T')[0];
    
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + 5);
    document.querySelector('#offerForm input[name="expiryDate"]').value = expiryDate.toISOString().split('T')[0];
    
    openModal('offerModal');
}

function openMoveStage(candidateId) {
    const candidate = candidates.find(c => c.id === candidateId);
    if (!candidate) return;
    
    document.getElementById('moveStageCandidateId').value = candidateId;
    document.getElementById('moveStageSelect').value = candidate.stage;
    
    openModal('moveStageModal');
}

// ===== Panels =====
function initPanels() {
    // Notifications panel
    document.getElementById('notificationsBtn').addEventListener('click', () => {
        document.getElementById('notificationsPanel').classList.toggle('active');
        document.getElementById('quickActionsPanel').classList.remove('active');
        renderNotifications();
    });
    
    // Quick actions panel
    document.getElementById('quickActionsBtn').addEventListener('click', () => {
        document.getElementById('quickActionsPanel').classList.toggle('active');
        document.getElementById('notificationsPanel').classList.remove('active');
    });
    
    // Quick action items
    document.querySelectorAll('.quick-action-item').forEach(item => {
        item.addEventListener('click', () => {
            const action = item.dataset.action;
            document.getElementById('quickActionsPanel').classList.remove('active');
            
            switch(action) {
                case 'addCandidate':
                    openModal('addCandidateModal');
                    break;
                case 'newVacancy':
                    openCreateVacancyModal();
                    break;
                case 'bulkEmail':
                    showToast('info', 'Массовая рассылка', 'Функция массовой рассылки');
                    break;
                case 'exportReport':
                    showToast('info', 'Экспорт', 'Экспорт отчета');
                    break;
                case 'checkDuplicates':
                    showToast('info', 'Проверка дублей', 'Проверка дублей в базе');
                    break;
            }
        });
    });
    
    // Mark all read
    document.getElementById('markAllRead').addEventListener('click', () => {
        notifications.forEach(n => n.read = true);
        renderNotifications();
        document.querySelector('.notification-count').textContent = '0';
        showToast('success', 'Готово', 'Все уведомления прочитаны');
    });
    
    // Close panels on outside click
    document.addEventListener('click', (e) => {
        if (!e.target.closest('#notificationsPanel') && !e.target.closest('#notificationsBtn')) {
            document.getElementById('notificationsPanel').classList.remove('active');
        }
        if (!e.target.closest('#quickActionsPanel') && !e.target.closest('#quickActionsBtn')) {
            document.getElementById('quickActionsPanel').classList.remove('active');
        }
    });
}

function renderNotifications() {
    const list = document.getElementById('notificationsList');
    list.innerHTML = notifications.map(n => `
        <div class="notification-item ${n.read ? '' : 'unread'}" onclick="handleNotificationClick(${n.id})">
            <div class="notification-icon ${n.icon}">
                <i class="fas ${n.icon === 'danger' ? 'fa-exclamation' : n.icon === 'warning' ? 'fa-clock' : n.icon === 'success' ? 'fa-check' : 'fa-info'}"></i>
            </div>
            <div class="notification-content">
                <strong>${n.title}</strong>
                <p>${n.message}</p>
                <div class="notification-time">${formatTime(n.timestamp)}</div>
            </div>
        </div>
    `).join('');
}

function handleNotificationClick(notificationId) {
    const notification = notifications.find(n => n.id === notificationId);
    if (!notification) return;
    
    notification.read = true;
    
    if (notification.link) {
        document.getElementById('notificationsPanel').classList.remove('active');
        
        if (notification.link.type === 'candidate') {
            openCandidateModal(notification.link.id);
        } else if (notification.link.type === 'vacancy') {
            navigateTo('vacancies');
        } else if (notification.link.type === 'interview') {
            navigateTo('interviews');
        }
    }
    
    // Update unread count
    const unreadCount = notifications.filter(n => !n.read).length;
    document.querySelector('.notification-count').textContent = unreadCount;
}

// ===== Forms =====
function initForms() {
    // Add candidate form
    document.getElementById('addCandidateForm').addEventListener('submit', (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        
        const newCandidate = {
            id: candidates.length + 1,
            firstName: formData.get('firstName'),
            lastName: formData.get('lastName'),
            email: formData.get('email'),
            phone: formData.get('phone'),
            vacancyId: parseInt(formData.get('vacancyId')),
            stage: 'new',
            source: formData.get('source'),
            salaryExpectation: formData.get('salaryExpectation'),
            resumeUrl: formData.get('resumeUrl'),
            avatar: `https://i.pravatar.cc/100?img=${Math.floor(Math.random() * 70)}`,
            skills: [],
            createdAt: new Date().toISOString().split('T')[0],
            updatedAt: new Date().toISOString().split('T')[0],
            daysInStage: 0,
            rating: 0,
            inTalentPool: false,
            notes: formData.get('notes') ? [{ id: 1, text: formData.get('notes'), author: 'Мария Иванова', date: new Date().toISOString().split('T')[0] }] : [],
            timeline: [{ date: new Date().toISOString().split('T')[0], event: 'Добавлен', type: 'created', description: 'Добавлен в систему' }],
            feedbacks: []
        };
        
        candidates.push(newCandidate);
        
        closeModal('addCandidateModal');
        e.target.reset();
        showToast('success', 'Кандидат добавлен', `${newCandidate.firstName} ${newCandidate.lastName} добавлен в систему`);
        
        if (currentPage === 'candidates') {
            renderCandidates();
        } else if (currentPage === 'pipeline') {
            renderPipeline();
        }
    });
    
    // Schedule interview form
    document.getElementById('scheduleInterviewForm').addEventListener('submit', (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const candidateId = parseInt(formData.get('candidateId'));
        const candidate = candidates.find(c => c.id === candidateId);
        
        const newInterview = {
            id: interviews.length + 1,
            candidateId: candidateId,
            vacancyId: candidate.vacancyId,
            type: formData.get('interviewType'),
            date: formData.get('date'),
            time: formData.get('time'),
            duration: parseInt(formData.get('duration')),
            format: formData.get('format'),
            interviewers: formData.getAll('interviewers').map(i => parseInt(i)),
            status: 'scheduled',
            notes: formData.get('notes')
        };
        
        interviews.push(newInterview);
        
        closeModal('scheduleInterviewModal');
        e.target.reset();
        showToast('success', 'Интервью назначено', `Интервью с ${candidate.firstName} ${candidate.lastName} назначено на ${formatDate(newInterview.date)}`);
        
        if (currentPage === 'interviews') {
            renderInterviews();
        }
    });
    
    // Feedback form
    document.getElementById('feedbackForm').addEventListener('submit', (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const candidateId = parseInt(formData.get('candidateId'));
        const candidate = candidates.find(c => c.id === candidateId);
        
        if (!candidate.feedbacks) candidate.feedbacks = [];
        
        candidate.feedbacks.push({
            id: Date.now(),
            interviewerId: 1, // Current user
            rating: parseInt(formData.get('rating')),
            recommendation: formData.get('recommendation'),
            strengths: formData.get('strengths'),
            weaknesses: formData.get('weaknesses'),
            comment: formData.get('comment'),
            date: new Date().toISOString().split('T')[0]
        });
        
        closeModal('feedbackModal');
        e.target.reset();
        showToast('success', 'Фидбек сохранен', 'Фидбек успешно добавлен');
    });
    
    // Reject form
    document.getElementById('rejectForm').addEventListener('submit', (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const candidateId = parseInt(formData.get('candidateId'));
        const candidate = candidates.find(c => c.id === candidateId);
        
        candidate.stage = 'rejected';
        candidate.rejectionReason = formData.get('reason');
        candidate.rejectionDetails = formData.get('details');
        
        if (formData.get('addToPool')) {
            candidate.inTalentPool = true;
            talentPool.push({
                id: talentPool.length + 1,
                candidateId: candidateId,
                reason: candidate.rejectionDetails || 'Добавлен для будущих вакансий',
                addedAt: new Date().toISOString().split('T')[0],
                tags: candidate.skills.slice(0, 3),
                lastContactAt: new Date().toISOString().split('T')[0],
                nextContactAt: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
            });
        }
        
        closeModal('rejectModal');
        e.target.reset();
        showToast('success', 'Кандидат отклонен', `${candidate.firstName} ${candidate.lastName} переведен в отказ${formData.get('addToPool') ? ' и добавлен в пул' : ''}`);
        
        if (currentPage === 'candidates') {
            renderCandidates();
        } else if (currentPage === 'pipeline') {
            renderPipeline();
        }
    });
    
    // Offer form
    document.getElementById('offerForm').addEventListener('submit', (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const candidateId = parseInt(formData.get('candidateId'));
        const candidate = candidates.find(c => c.id === candidateId);
        
        const newOffer = {
            id: offers.length + 1,
            candidateId: candidateId,
            vacancyId: candidate.vacancyId,
            status: 'pending',
            salary: formData.get('salary'),
            bonus: formData.get('bonus'),
            startDate: formData.get('startDate'),
            probation: parseInt(formData.get('probation')),
            workFormat: formData.get('workFormat'),
            benefits: formData.get('benefits'),
            expiryDate: formData.get('expiryDate'),
            createdAt: new Date().toISOString().split('T')[0],
            approvers: formData.getAll('approvers'),
            approvalStatus: {}
        };
        
        formData.getAll('approvers').forEach(a => {
            newOffer.approvalStatus[a] = 'pending';
        });
        
        offers.push(newOffer);
        candidate.stage = 'offer';
        
        closeModal('offerModal');
        e.target.reset();
        showToast('success', 'Оффер создан', `Оффер для ${candidate.firstName} ${candidate.lastName} создан и отправлен на согласование`);
        
        if (currentPage === 'offers') {
            renderOffers();
        }
    });
    
    // Move stage form
    document.getElementById('moveStageForm').addEventListener('submit', (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const candidateId = parseInt(formData.get('candidateId'));
        const candidate = candidates.find(c => c.id === candidateId);
        const newStage = formData.get('stage');
        
        const oldStage = candidate.stage;
        candidate.stage = newStage;
        candidate.daysInStage = 0;
        candidate.updatedAt = new Date().toISOString().split('T')[0];
        
        if (!candidate.timeline) candidate.timeline = [];
        candidate.timeline.push({
            date: new Date().toISOString().split('T')[0],
            event: getStageLabel(newStage),
            type: 'stage',
            description: `Переведен с ${getStageLabel(oldStage)} на ${getStageLabel(newStage)}${formData.get('comment') ? `. ${formData.get('comment')}` : ''}`
        });
        
        closeModal('moveStageModal');
        e.target.reset();
        showToast('success', 'Этап изменен', `${candidate.firstName} ${candidate.lastName} переведен на этап "${getStageLabel(newStage)}"`);
        
        if (currentPage === 'candidates') {
            renderCandidates();
        } else if (currentPage === 'pipeline') {
            renderPipeline();
        }
    });
}

// ===== Create Vacancy =====
function openCreateVacancyModal() {
    // Populate department select
    const deptSelect = document.getElementById('vacancyDepartment');
    if (deptSelect) {
        deptSelect.innerHTML = departments.map(d => `<option value="${d.id}">${d.name}</option>`).join('');
    }
    // Populate manager select
    const mgrSelect = document.getElementById('vacancyManager');
    if (mgrSelect) {
        mgrSelect.innerHTML = hiringManagers.map(m => `<option value="${m.id}">${m.name} (${m.role})</option>`).join('');
    }
    // Default deadline 30 days from now
    const deadlineInput = document.querySelector('#createVacancyForm input[name="deadline"]');
    if (deadlineInput) {
        const d = new Date();
        d.setDate(d.getDate() + 30);
        deadlineInput.value = d.toISOString().split('T')[0];
    }
    openModal('createVacancyModal');
}

// Create vacancy form submit (init in initForms)
function initCreateVacancyForm() {
    const form = document.getElementById('createVacancyForm');
    if (!form) return;
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const fd = new FormData(e.target);
        const newVacancy = {
            id: vacancies.length + 100,
            title: fd.get('title'),
            department: parseInt(fd.get('department')),
            managerId: parseInt(fd.get('managerId')),
            status: 'active',
            priority: fd.get('priority'),
            urgent: !!fd.get('urgent'),
            salary: {
                min: parseInt(fd.get('salaryMin')) || 0,
                max: parseInt(fd.get('salaryMax')) || 0,
                currency: 'RUB'
            },
            location: fd.get('location') || 'Не указано',
            workFormat: fd.get('workFormat'),
            createdAt: new Date().toISOString().split('T')[0],
            deadline: fd.get('deadline') || '',
            description: fd.get('description') || '',
            requirements: fd.get('requirements') ? fd.get('requirements').split(',').map(r => r.trim()).filter(Boolean) : [],
            niceToHave: [],
            candidatesCount: 0,
            stages: { new: 0, screening: 0, interview: 0, technical: 0, final: 0, offer: 0, hired: 0 }
        };
        vacancies.push(newVacancy);
        closeModal('createVacancyModal');
        e.target.reset();
        showToast('success', 'Вакансия создана', `${newVacancy.title} добавлена в список`);
        if (currentPage === 'vacancies') {
            renderVacancies();
        }
    });
}

// ===== Toast Notifications =====
function showToast(type, title, message) {
    const container = document.getElementById('toastContainer');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
        <div class="toast-icon">
            <i class="fas ${type === 'success' ? 'fa-check' : type === 'error' ? 'fa-times' : type === 'warning' ? 'fa-exclamation' : 'fa-info'}"></i>
        </div>
        <div class="toast-content">
            <div class="toast-title">${title}</div>
            <div class="toast-message">${message}</div>
        </div>
        <button class="toast-close" onclick="this.parentElement.remove()">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    container.appendChild(toast);
    
    setTimeout(() => {
        toast.remove();
    }, 5000);
}

// ===== Utility Functions =====
function formatDate(dateStr) {
    if (!dateStr) return '-';
    const date = new Date(dateStr);
    return date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' });
}

function formatTime(timestamp) {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    
    if (diffMins < 60) return `${diffMins} мин назад`;
    if (diffHours < 24) return `${diffHours} ч назад`;
    if (diffDays < 7) return `${diffDays} дн назад`;
    return formatDate(timestamp);
}

function formatSalary(salary) {
    if (!salary) return '-';
    return `${(salary.min / 1000).toFixed(0)}-${(salary.max / 1000).toFixed(0)}k`;
}

// ===== Global Search with Dropdown =====
const globalSearchInput = document.getElementById('globalSearch');
const searchDropdown = document.getElementById('searchDropdown');
let searchHighlightIndex = -1;

function highlightText(text, query) {
    if (!query) return text;
    const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    return text.replace(regex, '<mark>$1</mark>');
}

function renderSearchDropdown(query) {
    if (!query || query.length < 1) {
        searchDropdown.classList.remove('active');
        searchHighlightIndex = -1;
        return;
    }

    const q = query.toLowerCase();

    const matchingCandidates = candidates.filter(c =>
        `${c.firstName} ${c.lastName}`.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q) ||
        (c.skills || []).some(s => s.toLowerCase().includes(q))
    ).slice(0, 5);

    const matchingVacancies = vacancies.filter(v =>
        v.title.toLowerCase().includes(q) ||
        departments.find(d => d.id === v.department)?.name.toLowerCase().includes(q)
    ).slice(0, 3);

    if (matchingCandidates.length === 0 && matchingVacancies.length === 0) {
        searchDropdown.innerHTML = `
            <div class="search-dropdown-empty">
                <i class="fas fa-search" style="font-size: 1.5rem; margin-bottom: 8px; display: block; opacity: 0.4;"></i>
                Ничего не найдено по запросу «${query}»
            </div>
        `;
        searchDropdown.classList.add('active');
        return;
    }

    let html = '';

    if (matchingCandidates.length > 0) {
        html += `<div class="search-dropdown-section">
            <div class="search-dropdown-label">Кандидаты</div>
            ${matchingCandidates.map((c, i) => {
                const vacancy = vacancies.find(v => v.id === c.vacancyId);
                return `
                    <div class="search-dropdown-item" data-type="candidate" data-id="${c.id}" data-index="${i}">
                        <img src="${c.avatar}" alt="">
                        <div class="search-item-info">
                            <div class="search-item-title">${highlightText(`${c.firstName} ${c.lastName}`, query)}</div>
                            <div class="search-item-subtitle">${vacancy ? vacancy.title : ''} · ${c.experience}</div>
                        </div>
                        <span class="stage-badge ${c.stage} search-item-badge">${getStageLabel(c.stage)}</span>
                    </div>
                `;
            }).join('')}
        </div>`;
    }

    if (matchingVacancies.length > 0) {
        html += `<div class="search-dropdown-section">
            <div class="search-dropdown-label">Вакансии</div>
            ${matchingVacancies.map((v, i) => {
                const dept = departments.find(d => d.id === v.department);
                return `
                    <div class="search-dropdown-item" data-type="vacancy" data-id="${v.id}" data-index="${matchingCandidates.length + i}">
                        <div class="search-item-icon"><i class="fas fa-briefcase"></i></div>
                        <div class="search-item-info">
                            <div class="search-item-title">${highlightText(v.title, query)}</div>
                            <div class="search-item-subtitle">${dept ? dept.name : ''} · ${v.candidatesCount} кандидатов</div>
                        </div>
                        <span class="vacancy-status ${v.status} search-item-badge">${getStatusLabel(v.status)}</span>
                    </div>
                `;
            }).join('')}
        </div>`;
    }

    html += `<div class="search-dropdown-hint">
        <kbd>↑↓</kbd> навигация <kbd>Enter</kbd> перейти <kbd>Esc</kbd> закрыть
    </div>`;

    searchDropdown.innerHTML = html;
    searchDropdown.classList.add('active');
    searchHighlightIndex = -1;

    // Click handlers on dropdown items
    searchDropdown.querySelectorAll('.search-dropdown-item').forEach(item => {
        item.addEventListener('click', () => {
            const type = item.dataset.type;
            const id = parseInt(item.dataset.id);
            searchDropdown.classList.remove('active');
            globalSearchInput.value = '';
            globalSearchInput.blur();

            if (type === 'candidate') {
                openCandidateModal(id);
            } else if (type === 'vacancy') {
                openVacancyModal(id);
            }
        });
    });
}

globalSearchInput.addEventListener('input', (e) => {
    renderSearchDropdown(e.target.value);
});

globalSearchInput.addEventListener('focus', () => {
    if (globalSearchInput.value.length >= 1) {
        renderSearchDropdown(globalSearchInput.value);
    }
});

globalSearchInput.addEventListener('keydown', (e) => {
    const items = searchDropdown.querySelectorAll('.search-dropdown-item');
    if (!searchDropdown.classList.contains('active') || items.length === 0) {
        if (e.key === 'Escape') {
            globalSearchInput.blur();
            searchDropdown.classList.remove('active');
        }
        return;
    }

    if (e.key === 'ArrowDown') {
        e.preventDefault();
        searchHighlightIndex = Math.min(searchHighlightIndex + 1, items.length - 1);
        items.forEach((item, i) => item.classList.toggle('highlighted', i === searchHighlightIndex));
        items[searchHighlightIndex]?.scrollIntoView({ block: 'nearest' });
    } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        searchHighlightIndex = Math.max(searchHighlightIndex - 1, 0);
        items.forEach((item, i) => item.classList.toggle('highlighted', i === searchHighlightIndex));
        items[searchHighlightIndex]?.scrollIntoView({ block: 'nearest' });
    } else if (e.key === 'Enter') {
        e.preventDefault();
        if (searchHighlightIndex >= 0 && items[searchHighlightIndex]) {
            items[searchHighlightIndex].click();
        }
    } else if (e.key === 'Escape') {
        searchDropdown.classList.remove('active');
        globalSearchInput.blur();
    }
});

// Close search dropdown on outside click
document.addEventListener('click', (e) => {
    if (!e.target.closest('#searchBox')) {
        searchDropdown.classList.remove('active');
    }
});

// ===== Keyboard Shortcuts =====
document.addEventListener('keydown', (e) => {
    // Cmd+K or Ctrl+K - Focus search
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        globalSearchInput.focus();
        globalSearchInput.select();
    }

    // Escape - Close modals/panels
    if (e.key === 'Escape') {
        // Close active modal
        const activeModal = document.querySelector('.modal.active');
        if (activeModal) {
            activeModal.classList.remove('active');
            return;
        }
        // Close panels
        document.getElementById('notificationsPanel').classList.remove('active');
        document.getElementById('quickActionsPanel').classList.remove('active');
    }
});

// ===== Dark Mode =====
function initTheme() {
    const saved = localStorage.getItem('workhere-theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const theme = saved || (prefersDark ? 'dark' : 'light');
    applyTheme(theme);
}

function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('workhere-theme', theme);
    const icon = document.querySelector('#themeToggle i');
    if (icon) {
        icon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
    }
}

document.getElementById('themeToggle').addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme');
    applyTheme(current === 'dark' ? 'light' : 'dark');
});

initTheme();

// Update keyboard shortcut hint for non-Mac
if (navigator.platform && !navigator.platform.match(/Mac/)) {
    const shortcutEl = document.querySelector('.search-shortcut');
    if (shortcutEl) {
        shortcutEl.innerHTML = '<kbd>Ctrl</kbd><kbd>K</kbd>';
    }
}

// ===== Sidebar Collapse =====
const sidebarCollapseBtn = document.getElementById('sidebarCollapseBtn');
if (sidebarCollapseBtn) {
    const savedMini = localStorage.getItem('workhere-sidebar-mini');
    if (savedMini === 'true') {
        document.getElementById('sidebar').classList.add('mini');
    }

    sidebarCollapseBtn.addEventListener('click', () => {
        const sidebar = document.getElementById('sidebar');
        sidebar.classList.toggle('mini');
        localStorage.setItem('workhere-sidebar-mini', sidebar.classList.contains('mini'));
    });
}
