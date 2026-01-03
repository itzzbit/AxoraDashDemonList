class DemonListApp {
  constructor() {
    this.levels = [];
    this.players = [];
    this.currentSearchQuery = '';
    
    // Инициализация менеджеров
    this.storage = new DataStorage();
    this.i18n = new I18nManager();
    this.renderer = new Renderer(this);
    
    // Загрузка и инициализация
    this.init();
  }

  async init() {
    console.log('Initializing Demon List App...');
    
    // Загрузка языка
    this.i18n.loadLanguage();
    
    // Загрузка данных
    await this.loadData();
    
    // Настройка событий
    this.setupEventListeners();
    
    // Первоначальный рендер
    this.renderCurrentPage();
    
    // Обновление локализации
    this.i18n.updatePageContent();
    this.i18n.initLanguageSelector();
    
    console.log('App initialized successfully');
    console.log('Levels:', this.levels.length);
    console.log('Players:', this.players.length);
  }

  async loadData() {
    console.log('Loading data...');
    
    // Пробуем загрузить из localStorage
    let storedLevels = this.storage.loadLevels();
    let storedPlayers = this.storage.loadPlayers();
    
    // Проверяем валидность данных
    const isValidLevels = storedLevels && 
                         Array.isArray(storedLevels) && 
                         storedLevels.length > 0;
    const isValidPlayers = storedPlayers && 
                          Array.isArray(storedPlayers) && 
                          storedPlayers.length > 0;
    
    if (isValidLevels && isValidPlayers) {
      console.log('Loading data from localStorage');
      this.levels = storedLevels;
      this.players = storedPlayers;
    } else {
      console.log('Loading initial data');
      this.levels = window.initialData.levels || [];
      this.players = window.initialData.players || [];
      
      // Сохраняем начальные данные
      this.storage.saveLevels(this.levels);
      this.storage.savePlayers(this.players);
    }
    
    // Сортируем уровни по умолчанию (по порядку в массиве = по позиции)
    // Сортируем игроков по очкам
    this.sortPlayers();
  }

  sortPlayers() {
    this.players = PointsSystem.sortPlayersByPoints(this.players, this.levels);
  }

  setupEventListeners() {
    // Обработка навигации
    document.addEventListener('click', (e) => {
      // Навигационные ссылки
      if (e.target.matches('.nav-link')) {
        e.preventDefault();
        const page = e.target.getAttribute('data-page');
        if (page) {
          this.navigateTo(page);
        }
      }
      
      // Кнопка "Назад"
      if (e.target.closest('.back-button')) {
        e.preventDefault();
        const page = e.target.closest('.back-button').getAttribute('data-page');
        this.navigateTo(page || 'home');
      }
      
      // Карточки уровней
      const levelCard = e.target.closest('.level-card');
      if (levelCard) {
        const levelId = parseInt(levelCard.getAttribute('data-level-id'));
        if (levelId) {
          this.navigateTo(`level/${levelId}`);
        }
      }
      
      // Карточки игроков
      const playerCard = e.target.closest('.player-card');
      if (playerCard) {
        const playerId = parseInt(playerCard.getAttribute('data-player-id'));
        if (playerId) {
          this.navigateTo(`player/${playerId}`);
        }
      }
    });

    // Поиск
    const searchHandler = Utils.debounce((e) => {
      this.currentSearchQuery = e.target.value.toLowerCase();
      this.renderCurrentPage();
    }, 300);

    document.addEventListener('input', (e) => {
      if (e.target.matches('.search-input')) {
        searchHandler(e);
      }
    });

    // Изменение языка
    document.addEventListener('change', (e) => {
      if (e.target.matches('#language-selector')) {
        this.i18n.setLanguage(e.target.value);
        this.storage.saveSettings({ language: e.target.value });
        this.i18n.updatePageContent();
        this.renderCurrentPage();
      }
    });

    // Обработка изменения hash в URL
    window.addEventListener('hashchange', () => {
      this.renderCurrentPage();
    });
  }

  navigateTo(page) {
    window.location.hash = page;
  }

  getCurrentPage() {
    const hash = window.location.hash.substring(1);
    return hash || 'home';
  }

  getFilteredLevels() {
    if (!this.currentSearchQuery) return null;
    
    return this.levels.filter(level => 
      level.name.toLowerCase().includes(this.currentSearchQuery) ||
      level.creator.toLowerCase().includes(this.currentSearchQuery) ||
      level.verifier.toLowerCase().includes(this.currentSearchQuery)
    );
  }

  getFilteredPlayers() {
    if (!this.currentSearchQuery) return null;
    
    return this.players.filter(player => 
      player.name.toLowerCase().includes(this.currentSearchQuery)
    );
  }

  renderCurrentPage() {
    const page = this.getCurrentPage();
    const app = document.getElementById('app');
    
    if (!app) {
      console.error('App container not found');
      return;
    }

    // Очищаем предыдущее состояние
    app.classList.remove('fade-in');
    
    // Рендерим в зависимости от страницы
    let content = '';
    
    if (page.startsWith('level/')) {
      const levelId = parseInt(page.split('/')[1]);
      const level = this.levels.find(l => l.id === levelId);
      content = level ? this.renderer.renderLevelDetail(level) : this.renderer.renderHome();
    } else if (page.startsWith('player/')) {
      const playerId = parseInt(page.split('/')[1]);
      const player = this.players.find(p => p.id === playerId);
      content = player ? this.renderer.renderPlayerDetail(player) : this.renderer.renderHome();
    } else {
      switch(page) {
        case 'home':
          content = this.renderer.renderHome();
          break;
        case 'levels':
          const filteredLevels = this.getFilteredLevels();
          content = this.renderer.renderLevelsPage(filteredLevels);
          break;
        case 'players':
          const filteredPlayers = this.getFilteredPlayers();
          content = this.renderer.renderPlayersPage(filteredPlayers);
          break;
        case 'about':
          content = this.renderer.renderAboutPage();
          break;
        default:
          content = this.renderer.renderHome();
      }
    }

    app.innerHTML = content;
    
    // Анимация появления
    setTimeout(() => app.classList.add('fade-in'), 10);
    
    // Обновляем активную ссылку в навигации
    this.updateActiveNavLink(page.split('/')[0] || 'home');
    
    // Обновляем локализацию для нового контента
    this.i18n.updatePageContent();
  }

  updateActiveNavLink(activePage) {
    document.querySelectorAll('.nav-link').forEach(link => {
      const page = link.getAttribute('data-page');
      if (page === activePage) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  }
}

// Запуск приложения
document.addEventListener('DOMContentLoaded', () => {
  window.app = new DemonListApp();
});