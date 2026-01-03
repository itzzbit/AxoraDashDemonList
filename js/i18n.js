class I18nManager {
  constructor() {
    this.currentLanguage = 'en';
    this.translations = {
      en: {
        // Навигация
        'home': 'Home',
        'levels': 'Levels',
        'players': 'Players',
        'about': 'About',
        
        // Общие
        'search': 'Search...',
        'search_levels': 'Search levels...',
        'search_players': 'Search players...',
        'loading': 'Loading...',
        'position': 'Position',
        'points': 'points',
        'creator': 'Creator',
        'verifier': 'Verifier',
        'video': 'Video',
        'by': 'by',
        'verified_by': 'Verified by',
        'error': 'Error',
        'back_to_home': 'Back to Home',
        'sort_by': 'Sort by',
        'sort_position': 'Position',
        'sort_name': 'Name',
        'sort_creator': 'Creator',
        'sort_points': 'Points',
        'sort_rank': 'Rank',
        'level_card': 'Level card',
        'player_card': 'Player card',
        
        // Главная страница
        'welcome_title': 'Geometry Dash Demon List',
        'welcome_text': 'Community-maintained ranking of the hardest Geometry Dash levels',
        'top_levels': 'Top Levels',
        'top_players': 'Top Players',
        'view_all_levels': 'View All Levels →',
        'view_all_players': 'View All Players →',
        'statistics': 'Statistics',
        'total_levels': 'Total Levels',
        'total_players': 'Total Players',
        'total_points': 'Total Points',
        'avg_points_per_player': 'Avg Points/Player',
        
        // Страница уровней
        'levels_title': 'Demon Levels',
        'no_levels_found': 'No levels found matching your search.',
        'no_levels': 'No levels available',
        
        // Страница игроков
        'players_title': 'Top Players',
        'no_players_found': 'No players found matching your search.',
        'levels_completed': 'Levels completed',
        'no_players': 'No players available',
        
        // Страница "О сайте"
        'about_title': 'About Demon List',
        'about_description': 'This is a community-maintained demon list for Geometry Dash levels.',
        'points_system': 'Points System',
        'points_description': 'Points are calculated using a formula that considers level position and total number of levels.',
        'rules': 'Rules',
        'rule_verification': 'Levels must be verified with video proof',
        'rule_demon': 'Only Extreme Demon levels are listed',
        'rule_fairplay': 'No hacked or modified game versions allowed',
        'contact': 'Contact',
        'contact_info': 'For questions or suggestions, please contact the administrator.',
        'version': 'Version',
        'about_project': 'About the Project',
        
        // Детальные страницы
        'back_to_levels': '← Back to Levels',
        'back_to_players': '← Back to Players',
        'level_info': 'Level Information',
        'player_info': 'Player Information',
        'victors': 'Players who completed this level',
        'completed_levels': 'Completed Levels',
        'no_victors': 'No players have completed this level yet.',
        'watch_video': 'Watch Verification Video',
        'by_creator': 'by',
        'video_proof': 'Video Proof',
        'watch_verification': 'Watch verification video',
        'players_completed': 'Players who completed this level',
        'no_victors_yet': 'No victors yet',
        'be_first': 'Be the first to complete this level!',
        'rank': 'Rank',
        'levels_completed': 'Levels Completed',
        'average_points': 'Average Points',
        'no_levels_completed': 'No levels completed yet',
        
        // Статистика
        'stat_total_levels': 'Total Levels',
        'stat_total_players': 'Total Players',
        'stat_total_points': 'Total Points',
        'stat_avg_points': 'Avg Points/Player',
        
        // Ошибки
        'error_loading': 'Error loading data. Please try again.',
        'level_not_found': 'Level not found',
        'player_not_found': 'Player not found'
      },
      
      ru: {
        // Навигация
        'home': 'Главная',
        'levels': 'Уровни',
        'players': 'Игроки',
        'about': 'О сайте',
        
        // Общие
        'search': 'Поиск...',
        'search_levels': 'Поиск уровней...',
        'search_players': 'Поиск игроков...',
        'loading': 'Загрузка...',
        'position': 'Позиция',
        'points': 'очки',
        'creator': 'Создатель',
        'verifier': 'Верификатор',
        'video': 'Видео',
        'by': 'от',
        'verified_by': 'Проверил',
        'error': 'Ошибка',
        'back_to_home': 'На главную',
        'sort_by': 'Сортировать по',
        'sort_position': 'Позиция',
        'sort_name': 'Название',
        'sort_creator': 'Создатель',
        'sort_points': 'Очки',
        'sort_rank': 'Ранг',
        'level_card': 'Карточка уровня',
        'player_card': 'Карточка игрока',
        
        // Главная страница
        'welcome_title': 'Geometry Dash Демон Лист',
        'welcome_text': 'Рейтинг самых сложных уровней Geometry Dash, поддерживаемый сообществом',
        'top_levels': 'Топ Уровней',
        'top_players': 'Топ Игроков',
        'view_all_levels': 'Все Уровни →',
        'view_all_players': 'Все Игроки →',
        'statistics': 'Статистика',
        'total_levels': 'Всего уровней',
        'total_players': 'Всего игроков',
        'total_points': 'Всего очков',
        'avg_points_per_player': 'Среднее очков/игрока',
        
        // Страница уровней
        'levels_title': 'Демон Уровни',
        'no_levels_found': 'Уровни, соответствующие запросу, не найдены.',
        'no_levels': 'Нет доступных уровней',
        
        // Страница игроков
        'players_title': 'Лучшие Игроки',
        'no_players_found': 'Игроки, соответствующие запросу, не найдены.',
        'levels_completed': 'Пройдено уровней',
        'no_players': 'Нет доступных игроков',
        
        // Страница "О сайте"
        'about_title': 'О Демон Листе',
        'about_description': 'Это демон-лист для уровней Geometry Dash, поддерживаемый сообществом.',
        'points_system': 'Система Очков',
        'points_description': 'Очки рассчитываются по формуле, учитывающей позицию уровня и общее количество уровней.',
        'rules': 'Правила',
        'rule_verification': 'Уровни должны быть проверены видео-доказательством',
        'rule_demon': 'В списке только уровни Extreme Demon',
        'rule_fairplay': 'Запрещены взломанные или модифицированные версии игры',
        'contact': 'Контакты',
        'contact_info': 'По вопросам и предложениям, пожалуйста, свяжитесь с администратором.',
        'version': 'Версия',
        'about_project': 'О проекте',
        
        // Детальные страницы
        'back_to_levels': '← Назад к уровням',
        'back_to_players': '← Назад к игрокам',
        'level_info': 'Информация об уровне',
        'player_info': 'Информация об игроке',
        'victors': 'Игроки, прошедшие этот уровень',
        'completed_levels': 'Пройденные Уровни',
        'no_victors': 'Этот уровень еще никто не прошел.',
        'watch_video': 'Смотреть видео верификации',
        'by_creator': 'от',
        'video_proof': 'Видео доказательство',
        'watch_verification': 'Смотреть видео верификации',
        'players_completed': 'Игроки, прошедшие этот уровень',
        'no_victors_yet': 'Еще нет победителей',
        'be_first': 'Будьте первым, кто пройдет этот уровень!',
        'rank': 'Ранг',
        'levels_completed': 'Пройдено уровней',
        'average_points': 'Среднее количество очков',
        'no_levels_completed': 'Еще не пройдено ни одного уровня',
        
        // Статистика
        'stat_total_levels': 'Всего уровней',
        'stat_total_players': 'Всего игроков',
        'stat_total_points': 'Всего очков',
        'stat_avg_points': 'Среднее очков/игрока',
        
        // Ошибки
        'error_loading': 'Ошибка загрузки данных. Пожалуйста, попробуйте снова.',
        'level_not_found': 'Уровень не найден',
        'player_not_found': 'Игрок не найден'
      }
    };
  }

  setLanguage(language) {
    if (this.translations[language]) {
      this.currentLanguage = language;
      localStorage.setItem('demonlist_language', language);
      return true;
    }
    return false;
  }

  getLanguage() {
    return this.currentLanguage;
  }

  loadLanguage() {
    const savedLanguage = localStorage.getItem('demonlist_language');
    if (savedLanguage && this.translations[savedLanguage]) {
      this.currentLanguage = savedLanguage;
    } else {
      // Определение языка браузера
      const browserLang = navigator.language.split('-')[0];
      if (this.translations[browserLang]) {
        this.currentLanguage = browserLang;
      }
    }
  }

  t(key) {
    return this.translations[this.currentLanguage][key] || key;
  }

  updatePageContent() {
    // Обновляем все элементы с атрибутом data-i18n
    document.querySelectorAll('[data-i18n]').forEach(element => {
      const key = element.getAttribute('data-i18n');
      const translation = this.t(key);
      
      if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
        element.placeholder = translation;
      } else {
        element.textContent = translation;
      }
    });
    
    // Обновляем атрибуты title, alt и т.д.
    document.querySelectorAll('[data-i18n-title]').forEach(element => {
      const key = element.getAttribute('data-i18n-title');
      element.title = this.t(key);
    });
    
    document.querySelectorAll('[data-i18n-alt]').forEach(element => {
      const key = element.getAttribute('data-i18n-alt');
      element.alt = this.t(key);
    });
    
    // Обновляем атрибуты placeholder
    document.querySelectorAll('[data-i18n-placeholder]').forEach(element => {
      const key = element.getAttribute('data-i18n-placeholder');
      element.placeholder = this.t(key);
    });
  }

  // Инициализация выбора языка в селекторе
  initLanguageSelector() {
    const selector = document.getElementById('language-selector');
    if (selector) {
      selector.value = this.currentLanguage;
    }
  }
}