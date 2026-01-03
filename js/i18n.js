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
        'loading': 'Loading...',
        'position': 'Position',
        'points': 'points',
        'creator': 'Creator',
        'verifier': 'Verifier',
        'video': 'Video',
        
        // Главная страница
        'welcome_title': 'Geometry Dash Demon List',
        'welcome_text': 'Community-maintained ranking of the hardest Geometry Dash levels',
        'top_levels': 'Top Levels',
        'top_players': 'Top Players',
        'view_all_levels': 'View All Levels →',
        'view_all_players': 'View All Players →',
        
        // Страница уровней
        'levels_title': 'Demon Levels',
        'no_levels_found': 'No levels found matching your search.',
        
        // Страница игроков
        'players_title': 'Top Players',
        'no_players_found': 'No players found matching your search.',
        'levels_completed': 'Levels completed',
        
        // Страница "О сайте"
        'about_title': 'About Demon List',
        'about_content': 'This is a list of daemons for Geometry Dash levels maintained by weirdo. The list ranks the most difficult user-created levels in the gdps.',
        'rules_title': 'Rules for Level Inclusion',
        'rule_1': 'Level must be rated',
        'rule_2': 'Level must have a verification video (optional)',
        'rule_3': 'Level must be (idk)',
        'points_system_title': 'Points System',
        'points_system_description': 'Points are calculated based on level position. Higher positions give more points.',
        'contact_title': 'Contact',
        'contact_email': 'Discord: .itzbit',
        
        // Детальные страницы
        'back_to_levels': '← Back to Levels',
        'back_to_players': '← Back to Players',
        'level_info': 'Level Information',
        'player_info': 'Player Information',
        'victors': 'Players who completed this level',
        'completed_levels': 'Completed Levels',
        'no_victors': 'No players have completed this level yet.',
        'watch_video': 'Watch Verification Video',
        
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
        'loading': 'Загрузка...',
        'position': 'Позиция',
        'points': 'очки',
        'creator': 'Создатель',
        'verifier': 'Верификатор',
        'video': 'Видео',
        
        // Главная страница
        'welcome_title': 'Geometry Dash Демон Лист',
        'welcome_text': 'Рейтинг самых сложных уровней Geometry Dash, поддерживаемый сообществом',
        'top_levels': 'Топ Уровней',
        'top_players': 'Топ Игроков',
        'view_all_levels': 'Все Уровни →',
        'view_all_players': 'Все Игроки →',
        
        // Страница уровней
        'levels_title': 'Демон Уровни',
        'no_levels_found': 'Уровни, соответствующие запросу, не найдены.',
        
        // Страница игроков
        'players_title': 'Лучшие Игроки',
        'no_players_found': 'Игроки, соответствующие запросу, не найдены.',
        'levels_completed': 'Пройдено уровней',
        
        // Страница "О сайте"
        'about_title': 'О Демон Листе',
        'about_content': 'Это демон-лист для уровней Geometry Dash, поддерживаемый чудаком. Список ранжирует самые сложные пользовательские уровни на гдпс.',
        'rules_title': 'Правила включения уровня',
        'rule_1': 'Уровень должен иметь рейт',
        'rule_2': 'Уровень должен иметь видео верификации (выборочно)',
        'rule_3': 'Уровень должен быть (по желанию)',
        'points_system_title': 'Система Очков',
        'points_system_description': 'Очки рассчитываются на основе позиции уровня. Более высокие позиции дают больше очков.',
        'contact_title': 'Контакты',
        'contact_email': 'Discord: .itzbit',
        
        // Детальные страницы
        'back_to_levels': '← Назад к уровням',
        'back_to_players': '← Назад к игрокам',
        'level_info': 'Информация об уровне',
        'player_info': 'Информация об игроке',
        'victors': 'Игроки, прошедшие этот уровень',
        'completed_levels': 'Пройденные Уровни',
        'no_victors': 'Этот уровень еще никто не прошел.',
        'watch_video': 'Смотреть видео верификации',
        
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
  }

  // Инициализация выбора языка в селекторе
  initLanguageSelector() {
    const selector = document.getElementById('language-selector');
    if (selector) {
      selector.value = this.currentLanguage;
    }
  }
}