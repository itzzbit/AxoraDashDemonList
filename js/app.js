// js/app.js
// Geometry Dash Demon List - SPA приложение

console.log('✅ Initializing Demon List App...');

class DemonListApp {
    constructor() {
        this.levels = [];
        this.players = [];
        this.storage = new DataStorage();
        this.i18n = new I18nManager();
        
        this.currentSearchQuery = '';
        this.currentSortCriteria = 'position';
        
        this.isLoading = false;
        
        // Запускаем инициализацию после загрузки DOM
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.init());
        } else {
            this.init();
        }
    }
    
    async init() {
        console.log('🚀 Starting app initialization...');
        this.isLoading = true;
        
        try {
            // 1. Загружаем и обрабатываем данные
            await this.loadData();
            
            // 2. Настраиваем язык
            this.setupLanguage();
            
            // 3. Настраиваем события
            this.setupEventListeners();
            
            // 4. Рендерим текущую страницу
            this.renderCurrentPage();
            
            console.log('✅ App initialized successfully');
            console.log(`📊 Levels: ${this.levels.length}`);
            console.log(`👥 Players: ${this.players.length}`);
            
        } catch (error) {
            console.error('❌ App initialization failed:', error);
            Utils.showError(this.i18n.t('error_loading') || 'Error loading data. Please try again.');
        } finally {
            this.isLoading = false;
        }
    }
    
    // ==================== ДАННЫЕ ====================
    
    async loadData() {
        console.log('📥 Loading data...');
        
        // Проверяем, есть ли сохраненные данные
        let storedLevels = this.storage.loadLevels();
        let storedPlayers = this.storage.loadPlayers();
        
        const isValidLevels = storedLevels && 
                             Array.isArray(storedLevels) && 
                             storedLevels.length > 0;
        const isValidPlayers = storedPlayers && 
                              Array.isArray(storedPlayers) && 
                              storedPlayers.length > 0;
        
        if (isValidLevels && isValidPlayers) {
            console.log('📂 Loading from localStorage');
            this.levels = storedLevels;
            this.players = storedPlayers;
            
            // Обрабатываем данные из localStorage
            this.processLevels();
            this.processPlayers();
        } else {
            console.log('📦 Loading from initial data files');
            
            // Загружаем начальные данные
            this.levels = Array.isArray(window.initialData?.levels) ? 
                         window.initialData.levels : [];
            this.players = Array.isArray(window.initialData?.players) ? 
                          window.initialData.players : [];
            
            // Обрабатываем данные
            this.processLevels();
            this.processPlayers();
            
            // Сохраняем обработанные данные
            this.storage.saveLevels(this.levels);
            this.storage.savePlayers(this.players);
        }
    }
    
    processLevels() {
        console.log('🔄 Processing levels...');
        
        // Сортируем уровни по ID (можно изменить на другую логику)
        this.levels.sort((a, b) => a.id - b.id);
        
        // Пересчитываем позиции и очки
        this.levels = PointsSystem.recalculateAllLevels(this.levels);
        
        console.log('✅ Levels processed:', this.levels);
    }
    
    processPlayers() {
        console.log('🔄 Processing players...');
        
        // Пересчитываем очки для всех игроков
        this.players.forEach(player => {
            player.points = PointsSystem.calculatePlayerPoints(player, this.levels);
        });
        
        // Сортируем игроков по очкам (по убыванию)
        this.players.sort((a, b) => b.points - a.points);
        
        // Устанавливаем ранги и количество уровней
        this.players.forEach((player, index) => {
            player.rank = index + 1;
            player.levelsCount = player.levels ? player.levels.length : 0;
        });
        
        console.log('✅ Players processed:', this.players);
    }
    
    // ==================== НАСТРОЙКИ ====================
    
    setupLanguage() {
        const settings = this.storage.loadSettings();
        const language = settings.language || 'en';
        this.i18n.setLanguage(language);
        this.i18n.loadLanguage();
        
        // Устанавливаем значение в селекторе языка
        const selector = document.getElementById('language-selector');
        if (selector) {
            selector.value = this.i18n.getLanguage();
        }
    }
    
    setupEventListeners() {
        // Навигация по клику на ссылки
        document.addEventListener('click', (e) => {
            // Клик по навигационным ссылкам
            if (e.target.matches('.nav-link')) {
                e.preventDefault();
                const page = e.target.getAttribute('data-page') || 
                           e.target.getAttribute('href')?.substring(1);
                if (page) {
                    this.navigateTo(page);
                }
            }
            
            // Клик по кнопке "Назад"
            if (e.target.matches('.back-button') || 
                e.target.closest('.back-button')) {
                e.preventDefault();
                const page = e.target.getAttribute('data-page') || 
                           e.target.closest('.back-button')?.getAttribute('data-page') || 
                           'home';
                this.navigateTo(page);
            }
            
            // Клик по карточке уровня
            const levelCard = e.target.closest('.level-card');
            if (levelCard) {
                const levelId = levelCard.getAttribute('data-level-id');
                if (levelId) {
                    this.navigateTo(`level/${levelId}`);
                    return;
                }
            }
            
            // Клик по карточке игрока
            const playerCard = e.target.closest('.player-card');
            if (playerCard) {
                const playerId = playerCard.getAttribute('data-player-id');
                if (playerId) {
                    this.navigateTo(`player/${playerId}`);
                    return;
                }
            }
            
            // Клик по ссылке "View All"
            if (e.target.matches('.view-all-link')) {
                e.preventDefault();
                const page = e.target.getAttribute('href')?.substring(1);
                if (page) {
                    this.navigateTo(page);
                }
            }
        });
        
        // Поиск
        document.addEventListener('input', (e) => {
            if (e.target.matches('.search-input')) {
                this.currentSearchQuery = e.target.value;
                this.renderCurrentPage();
            }
        });
        
        // Сортировка и язык
        document.addEventListener('change', (e) => {
            if (e.target.matches('.sort-select')) {
                this.currentSortCriteria = e.target.value;
                this.renderCurrentPage();
            }
            
            if (e.target.matches('#language-selector')) {
                this.i18n.setLanguage(e.target.value);
                this.storage.saveSettings({ language: e.target.value });
                this.renderCurrentPage();
            }
        });
        
        // Изменение hash в URL
        window.addEventListener('hashchange', () => {
            this.renderCurrentPage();
        });
        
        // Обработка клавиатуры для доступности
        document.addEventListener('keydown', (e) => {
            // Escape для выхода из детального просмотра
            if (e.key === 'Escape' && this.getCurrentPage().includes('/')) {
                const page = this.getCurrentPage().split('/')[0] || 'home';
                this.navigateTo(page);
            }
            
            // Enter для активации элементов
            if (e.key === 'Enter' && e.target.matches('.level-card, .player-card')) {
                e.target.click();
            }
        });
    }
    
    // ==================== НАВИГАЦИЯ ====================
    
    navigateTo(page) {
        window.location.hash = page;
    }
    
    getCurrentPage() {
        const hash = window.location.hash.substring(1);
        return hash || 'home';
    }
    
    // ==================== РЕНДЕРИНГ ====================
    
    renderCurrentPage() {
        const page = this.getCurrentPage();
        const app = document.getElementById('app');
        
        if (!app) {
            console.error('❌ #app element not found');
            return;
        }
        
        // Анимация появления
        app.classList.remove('fade-in');
        setTimeout(() => app.classList.add('fade-in'), 10);
        
        // Рендерим в зависимости от страницы
        try {
            if (page.startsWith('level/')) {
                this.renderLevelDetailPage(page);
            } else if (page.startsWith('player/')) {
                this.renderPlayerDetailPage(page);
            } else {
                switch(page) {
                    case 'home':
                        this.renderHomePage();
                        break;
                    case 'levels':
                        this.renderLevelsPage();
                        break;
                    case 'players':
                        this.renderPlayersPage();
                        break;
                    case 'about':
                        this.renderAboutPage();
                        break;
                    default:
                        this.renderHomePage();
                }
            }
            
            // Обновляем локализацию
            this.i18n.updatePageContent();
            
            // Обновляем активную ссылку в навигации
            this.updateActiveNavLink(page);
            
        } catch (error) {
            console.error('❌ Error rendering page:', error);
            app.innerHTML = `
                <div class="error-message">
                    <h3>${this.i18n.t('error') || 'Error'}</h3>
                    <p>${error.message}</p>
                    <button onclick="app.navigateTo('home')">${this.i18n.t('back_to_home') || 'Back to Home'}</button>
                </div>
            `;
        }
    }
    
    updateActiveNavLink(page) {
        // Убираем .active у всех ссылок
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        });
        
        // Добавляем .active к текущей странице
        const basePage = page.split('/')[0];
        const selector = `[data-page="${basePage}"], [href="#${basePage}"]`;
        document.querySelectorAll(selector).forEach(link => {
            link.classList.add('active');
        });
    }
    
    // ==================== СТРАНИЦЫ ====================
    
    renderHomePage() {
        const app = document.getElementById('app');
        
        app.innerHTML = `
            <div class="container">
                <div class="welcome-section">
                    <h1 class="welcome-title" data-i18n="welcome_title">Geometry Dash Demon List</h1>
                    <p class="welcome-text" data-i18n="welcome_text">Community-maintained ranking of the hardest Geometry Dash levels</p>
                </div>
                
                <section>
                    <h2 class="section-title" data-i18n="top_levels">Top Levels</h2>
                    <div class="levels-grid">
                        ${this.renderTopLevels(6)}
                    </div>
                    <div class="view-all">
                        <a href="#levels" class="nav-link view-all-link" data-page="levels" data-i18n="view_all_levels">View All Levels →</a>
                    </div>
                </section>
                
                <section>
                    <h2 class="section-title" data-i18n="top_players">Top Players</h2>
                    <div class="players-grid">
                        ${this.renderTopPlayers(6)}
                    </div>
                    <div class="view-all">
                        <a href="#players" class="nav-link view-all-link" data-page="players" data-i18n="view_all_players">View All Players →</a>
                    </div>
                </section>
                
                <section class="stats-section">
                    <h2 class="section-title" data-i18n="statistics">Statistics</h2>
                    ${this.renderStats()}
                </section>
            </div>
        `;
    }
    
    renderLevelsPage() {
        const app = document.getElementById('app');
        
        // Фильтруем и сортируем уровни
        let filteredLevels = [...this.levels];
        
        // Применяем поиск
        if (this.currentSearchQuery.trim()) {
            const query = this.currentSearchQuery.toLowerCase();
            filteredLevels = filteredLevels.filter(level => 
                level.name.toLowerCase().includes(query) ||
                level.creator.toLowerCase().includes(query) ||
                level.verifier.toLowerCase().includes(query)
            );
        }
        
        // Применяем сортировку
        if (this.currentSortCriteria) {
            filteredLevels = this.sortLevels(filteredLevels, this.currentSortCriteria);
        }
        
        // Получаем опции сортировки
        const sortOptions = [
            { value: 'position', label: 'sort_position' },
            { value: 'name', label: 'sort_name' },
            { value: 'creator', label: 'sort_creator' },
            { value: 'points', label: 'sort_points' }
        ];
        
        const sortOptionsHtml = sortOptions.map(option => `
            <option value="${option.value}" data-i18n="${option.label}">${this.i18n.t(option.label) || option.label}</option>
        `).join('');
        
        app.innerHTML = `
            <div class="container">
                <h2 class="section-title" data-i18n="levels_title">Demon Levels</h2>
                
                <div class="controls">
                    <div class="search-container">
                        <i class='bx bx-search search-icon'></i>
                        <input type="text" 
                               class="search-input" 
                               data-i18n-placeholder="search_levels" 
                               placeholder="${this.i18n.t('search_levels') || 'Search levels...'}" 
                               value="${this.currentSearchQuery}">
                    </div>
                    <select class="sort-select">
                        <option value="" data-i18n="sort_by">${this.i18n.t('sort_by') || 'Sort by'}</option>
                        ${sortOptionsHtml}
                    </select>
                </div>
                
                <div class="levels-grid">
                    ${filteredLevels.length > 0 ? 
                        filteredLevels.map(level => this.renderLevelCard(level)).join('') : 
                        `<p class="no-results" data-i18n="no_levels_found">${this.i18n.t('no_levels_found') || 'No levels found matching your search.'}</p>`
                    }
                </div>
                
                <div class="view-all">
                    <a href="#home" class="nav-link" data-page="home" data-i18n="back_to_home">
                        ← ${this.i18n.t('back_to_home') || 'Back to Home'}
                    </a>
                </div>
            </div>
        `;
        
        // Устанавливаем выбранное значение сортировки
        const sortSelect = app.querySelector('.sort-select');
        if (sortSelect && this.currentSortCriteria) {
            sortSelect.value = this.currentSortCriteria;
        }
    }
    
    renderPlayersPage() {
        const app = document.getElementById('app');
        
        // Фильтруем и сортируем игроков
        let filteredPlayers = [...this.players];
        
        // Применяем поиск
        if (this.currentSearchQuery.trim()) {
            const query = this.currentSearchQuery.toLowerCase();
            filteredPlayers = filteredPlayers.filter(player => 
                player.name.toLowerCase().includes(query)
            );
        }
        
        // Применяем сортировку
        if (this.currentSortCriteria) {
            filteredPlayers = this.sortPlayers(filteredPlayers, this.currentSortCriteria);
        }
        
        // Получаем опции сортировки
        const sortOptions = [
            { value: 'rank', label: 'sort_rank' },
            { value: 'name', label: 'sort_name' },
            { value: 'points', label: 'sort_points' }
        ];
        
        const sortOptionsHtml = sortOptions.map(option => `
            <option value="${option.value}" data-i18n="${option.label}">${this.i18n.t(option.label) || option.label}</option>
        `).join('');
        
        app.innerHTML = `
            <div class="container">
                <h2 class="section-title" data-i18n="players_title">Top Players</h2>
                
                <div class="controls">
                    <div class="search-container">
                        <i class='bx bx-search search-icon'></i>
                        <input type="text" 
                               class="search-input" 
                               data-i18n-placeholder="search_players" 
                               placeholder="${this.i18n.t('search_players') || 'Search players...'}" 
                               value="${this.currentSearchQuery}">
                    </div>
                    <select class="sort-select">
                        <option value="" data-i18n="sort_by">${this.i18n.t('sort_by') || 'Sort by'}</option>
                        ${sortOptionsHtml}
                    </select>
                </div>
                
                <div class="players-grid">
                    ${filteredPlayers.length > 0 ? 
                        filteredPlayers.map(player => this.renderPlayerCard(player)).join('') : 
                        `<p class="no-results" data-i18n="no_players_found">${this.i18n.t('no_players_found') || 'No players found matching your search.'}</p>`
                    }
                </div>
                
                <div class="view-all">
                    <a href="#home" class="nav-link" data-page="home" data-i18n="back_to_home">
                        ← ${this.i18n.t('back_to_home') || 'Back to Home'}
                    </a>
                </div>
            </div>
        `;
        
        // Устанавливаем выбранное значение сортировки
        const sortSelect = app.querySelector('.sort-select');
        if (sortSelect && this.currentSortCriteria) {
            sortSelect.value = this.currentSortCriteria;
        }
    }
    
    renderAboutPage() {
        const app = document.getElementById('app');
        
        app.innerHTML = `
            <div class="container">
                <h2 class="section-title" data-i18n="about_title">About Demon List</h2>
                
                <div class="detail-container">
                    <h3 data-i18n="about_project">About the Project</h3>
                    <p data-i18n="about_description">This is a community-maintained demon list for Geometry Dash levels.</p>
                    
                    <h3 data-i18n="points_system">Points System</h3>
                    <p data-i18n="points_description">Points are calculated using a formula that considers level position and total number of levels.</p>
                    <ul>
                        <li>Formula: 1000 - (1000 - 1) * ((position-1)/(totalLevels-1))^0.66</li>
                        <li>First place: 1000 points</li>
                        <li>Last place: 1 point</li>
                        <li>Player points = sum of points from completed levels</li>
                    </ul>
                    
                    <h3 data-i18n="rules">Rules</h3>
                    <ul>
                        <li data-i18n="rule_verification">Levels must be verified with video proof</li>
                        <li data-i18n="rule_demon">Only Extreme Demon levels are listed</li>
                        <li data-i18n="rule_fairplay">No hacked or modified game versions allowed</li>
                    </ul>
                    
                    <h3 data-i18n="contact">Contact</h3>
                    <p data-i18n="contact_info">For questions or suggestions, please contact the administrator.</p>
                    
                    <h3 data-i18n="version">Version</h3>
                    <p>Demon List v2.0</p>
                </div>
            </div>
        `;
    }
    
    renderLevelDetailPage(page) {
        const app = document.getElementById('app');
        const levelId = parseInt(page.split('/')[1]);
        const level = this.levels.find(l => l.id === levelId);
        
        if (!level) {
            this.renderHomePage();
            return;
        }
        
        // Находим игроков, которые прошли этот уровень
        const victors = PointsSystem.getPlayersForLevel(level.id, this.players);
        
        app.innerHTML = `
            <div class="container fade-in">
                <button class="back-button" data-page="levels" data-i18n="back_to_levels">← Back to Levels</button>
                
                <div class="detail-container">
                    <div class="detail-header">
                        <h1 class="detail-title">#${level.position || 0} - ${level.name}</h1>
                        <div class="detail-subtitle">
                            <span data-i18n="creator">Creator</span>: ${level.creator} | 
                            <span data-i18n="verifier">Verifier</span>: ${level.verifier}
                        </div>
                        <div class="level-points">${level.points || 0} <span data-i18n="points">points</span></div>
                    </div>
                    
                    <div class="detail-stats">
                        <div class="detail-stat">
                            <div class="detail-stat-value">${level.verifier}</div>
                            <div class="detail-stat-label" data-i18n="verifier">Verifier</div>
                        </div>
                        <div class="detail-stat">
                            <div class="detail-stat-value">${victors.length}</div>
                            <div class="detail-stat-label" data-i18n="victors">Victors</div>
                        </div>
                    </div>
                    
                    ${level.videoURL ? `
                        <div class="detail-content">
                            <h3 data-i18n="video">Video</h3>
                            <a href="${level.videoURL}" target="_blank" class="video-link" data-i18n="watch_video">Watch Verification Video</a>
                        </div>
                    ` : ''}
                    
                    <div class="detail-content">
                        <h3 data-i18n="victors">Players who completed this level</h3>
                        ${victors.length > 0 ? 
                            victors.map(victor => `<p>${victor}</p>`).join('') : 
                            `<p data-i18n="no_victors">No players have completed this level yet.</p>`
                        }
                    </div>
                </div>
            </div>
        `;
    }
    
    renderPlayerDetailPage(page) {
        const app = document.getElementById('app');
        const playerId = parseInt(page.split('/')[1]);
        const player = this.players.find(p => p.id === playerId);
        
        if (!player) {
            this.renderHomePage();
            return;
        }
        
        // Получаем уровни, пройденные игроком
        const playerLevels = PointsSystem.getLevelsForPlayer(player, this.levels);
        
        app.innerHTML = `
            <div class="container fade-in">
                <button class="back-button" data-page="players" data-i18n="back_to_players">← Back to Players</button>
                
                <div class="detail-container">
                    <div class="detail-header">
                        <h1 class="detail-title">#${player.rank || 0} - ${player.name}</h1>
                        <div class="player-points">${player.points || 0} <span data-i18n="points">points</span></div>
                    </div>
                    
                    <div class="detail-stats">
                        <div class="detail-stat">
                            <div class="detail-stat-value">${playerLevels.length}</div>
                            <div class="detail-stat-label" data-i18n="levels_completed">Levels Completed</div>
                        </div>
                        <div class="detail-stat">
                            <div class="detail-stat-value">${playerLevels.length > 0 ? Math.round(player.points / playerLevels.length) : 0}</div>
                            <div class="detail-stat-label" data-i18n="average_points">Average Points</div>
                        </div>
                    </div>
                    
                    <div class="detail-content">
                        <h3 data-i18n="completed_levels">Completed Levels</h3>
                        
                        ${playerLevels.length > 0 ? `
                            <div class="levels-grid mini-grid">
                                ${playerLevels.map(level => `
                                    <div class="level-card mini-card" data-level-id="${level.id}">
                                        <div class="level-position">#${level.position}</div>
                                        <div class="level-name">${level.name}</div>
                                        <div class="level-creator">${this.i18n.t('by') || 'by'} ${level.creator}</div>
                                        <div class="level-points">${level.points} ${this.i18n.t('points') || 'points'}</div>
                                    </div>
                                `).join('')}
                            </div>
                        ` : `
                            <p class="no-levels" data-i18n="no_levels_completed">No levels completed yet</p>
                        `}
                    </div>
                </div>
            </div>
        `;
    }
    
    // ==================== КОМПОНЕНТЫ ====================
    
    renderLevelCard(level) {
        const position = level.position || 0;
        const points = level.points || 0;
        
        return `
            <div class="level-card" data-level-id="${level.id}" 
                 tabindex="0" 
                 aria-label="${this.i18n.t('level_card') || 'Level card'}: ${level.name}">
                <div class="level-position">#${position}</div>
                <div class="level-name">${level.name}</div>
                <div class="level-creator" data-i18n="creator">Creator: ${level.creator}</div>
                <div class="level-verifier" data-i18n="verifier">Verifier: ${level.verifier}</div>
                <div class="level-points">${points} <span data-i18n="points">points</span></div>
            </div>
        `;
    }
    
    renderPlayerCard(player) {
        const rank = player.rank || 0;
        const points = player.points || 0;
        const levelsCount = player.levelsCount || (player.levels ? player.levels.length : 0);
        
        return `
            <div class="player-card" data-player-id="${player.id}"
                 tabindex="0"
                 aria-label="${this.i18n.t('player_card') || 'Player card'}: ${player.name}">
                <div class="player-rank">#${rank}</div>
                <div class="player-name">${player.name}</div>
                <div class="player-points">${points} <span data-i18n="points">points</span></div>
                <div class="player-levels-count" data-i18n="levels_completed">Levels completed: ${levelsCount}</div>
            </div>
        `;
    }
    
    renderTopLevels(limit) {
        if (!this.levels || this.levels.length === 0) {
            return `<div class="no-results" data-i18n="no_levels">${this.i18n.t('no_levels') || 'No levels available'}</div>`;
        }
        
        const topLevels = [...this.levels]
            .sort((a, b) => (a.position || 0) - (b.position || 0))
            .slice(0, Math.min(limit, this.levels.length));
        
        return topLevels.map(level => this.renderLevelCard(level)).join('');
    }
    
    renderTopPlayers(limit) {
        if (!this.players || this.players.length === 0) {
            return `<div class="no-results" data-i18n="no_players">${this.i18n.t('no_players') || 'No players available'}</div>`;
        }
        
        const topPlayers = [...this.players]
            .sort((a, b) => (a.rank || 0) - (b.rank || 0))
            .slice(0, Math.min(limit, this.players.length));
        
        return topPlayers.map(player => this.renderPlayerCard(player)).join('');
    }
    
    renderStats() {
        const totalLevels = this.levels.length;
        const totalPlayers = this.players.length;
        const totalPoints = this.players.reduce((sum, player) => sum + (player.points || 0), 0);
        const avgPointsPerPlayer = totalPlayers > 0 ? Math.round(totalPoints / totalPlayers) : 0;
        
        return `
            <div class="stats-grid">
                <div class="stat-card">
                    <div class="stat-value">${totalLevels}</div>
                    <div class="stat-label" data-i18n="total_levels">Total Levels</div>
                </div>
                <div class="stat-card">
                    <div class="stat-value">${totalPlayers}</div>
                    <div class="stat-label" data-i18n="total_players">Total Players</div>
                </div>
                <div class="stat-card">
                    <div class="stat-value">${totalPoints.toLocaleString()}</div>
                    <div class="stat-label" data-i18n="total_points">Total Points</div>
                </div>
                <div class="stat-card">
                    <div class="stat-value">${avgPointsPerPlayer.toLocaleString()}</div>
                    <div class="stat-label" data-i18n="avg_points_per_player">Avg Points/Player</div>
                </div>
            </div>
        `;
    }
    
    // ==================== СОРТИРОВКА ====================
    
    sortLevels(levels, criteria) {
        const sorted = [...levels];
        
        switch(criteria) {
            case 'position':
                sorted.sort((a, b) => (a.position || 0) - (b.position || 0));
                break;
            case 'name':
                sorted.sort((a, b) => a.name.localeCompare(b.name));
                break;
            case 'creator':
                sorted.sort((a, b) => a.creator.localeCompare(b.creator));
                break;
            case 'points':
                sorted.sort((a, b) => (b.points || 0) - (a.points || 0));
                break;
            default:
                sorted.sort((a, b) => (a.position || 0) - (b.position || 0));
        }
        
        return sorted;
    }
    
    sortPlayers(players, criteria) {
        const sorted = [...players];
        
        switch(criteria) {
            case 'rank':
                sorted.sort((a, b) => (a.rank || 0) - (b.rank || 0));
                break;
            case 'name':
                sorted.sort((a, b) => a.name.localeCompare(b.name));
                break;
            case 'points':
                sorted.sort((a, b) => (b.points || 0) - (a.points || 0));
                break;
            default:
                sorted.sort((a, b) => (a.rank || 0) - (b.rank || 0));
        }
        
        return sorted;
    }
    
    // ==================== УТИЛИТЫ ====================
    
    recalculateAll() {
        console.log('🔄 Recalculating all data...');
        this.processLevels();
        this.processPlayers();
        this.storage.saveLevels(this.levels);
        this.storage.savePlayers(this.players);
        this.renderCurrentPage();
        console.log('✅ All data recalculated');
    }
    
    exportData() {
        return {
            levels: this.levels,
            players: this.players,
            timestamp: new Date().toISOString()
        };
    }
    
    importData(data) {
        if (!data.levels || !data.players) {
            throw new Error('Invalid data format');
        }
        
        this.levels = data.levels;
        this.players = data.players;
        this.recalculateAll();
    }
}

// Запуск приложения при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    // Небольшая задержка для загрузки всех скриптов
    setTimeout(() => {
        window.app = new DemonListApp();
    }, 100);
});

// Глобальные функции для отладки
window.debugApp = function() {
    console.log('=== APP DEBUG INFO ===');
    console.log('Levels:', window.app?.levels);
    console.log('Players:', window.app?.players);
    console.log('Current Page:', window.app?.getCurrentPage());
    console.log('Search Query:', window.app?.currentSearchQuery);
    console.log('Sort Criteria:', window.app?.currentSortCriteria);
    console.log('=== END DEBUG ===');
};

window.recalculateAll = function() {
    if (window.app) {
        window.app.recalculateAll();
    }
};