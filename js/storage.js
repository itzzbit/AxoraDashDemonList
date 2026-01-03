class DataStorage {
  constructor() {
    this.keys = {
      levels: 'demonlist_v2_levels',
      players: 'demonlist_v2_players',
      settings: 'demonlist_v2_settings'
    };
  }

  // Проверка доступности localStorage
  isAvailable() {
    return Utils.isLocalStorageAvailable();
  }

  // Сохранение уровней
  saveLevels(levels) {
    if (!this.isAvailable()) return false;
    
    try {
      localStorage.setItem(this.keys.levels, JSON.stringify(levels));
      return true;
    } catch (error) {
      console.error('Failed to save levels:', error);
      return false;
    }
  }

  // Сохранение игроков
  savePlayers(players) {
    if (!this.isAvailable()) return false;
    
    try {
      localStorage.setItem(this.keys.players, JSON.stringify(players));
      return true;
    } catch (error) {
      console.error('Failed to save players:', error);
      return false;
    }
  }

  // Загрузка уровней
  loadLevels() {
    if (!this.isAvailable()) return null;
    
    try {
      const data = localStorage.getItem(this.keys.levels);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Failed to load levels:', error);
      return null;
    }
  }

  // Загрузка игроков
  loadPlayers() {
    if (!this.isAvailable()) return null;
    
    try {
      const data = localStorage.getItem(this.keys.players);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Failed to load players:', error);
      return null;
    }
  }

  // Сохранение настроек
  saveSettings(settings) {
    if (!this.isAvailable()) return false;
    
    try {
      localStorage.setItem(this.keys.settings, JSON.stringify(settings));
      return true;
    } catch (error) {
      console.error('Failed to save settings:', error);
      return false;
    }
  }

  // Загрузка настроек
  loadSettings() {
    if (!this.isAvailable()) return { language: 'en' };
    
    try {
      const data = localStorage.getItem(this.keys.settings);
      return data ? JSON.parse(data) : { language: 'en' };
    } catch (error) {
      console.error('Failed to load settings:', error);
      return { language: 'en' };
    }
  }

  // Проверка валидности данных
  validateLevels(levels) {
    if (!Array.isArray(levels)) return false;
    
    return levels.every(level => {
      const required = ['id', 'name', 'creator', 'verifier', 'videoURL'];
      return required.every(field => level.hasOwnProperty(field));
    });
  }

  validatePlayers(players) {
    if (!Array.isArray(players)) return false;
    
    return players.every(player => {
      return player.hasOwnProperty('id') && 
             player.hasOwnProperty('name') && 
             Array.isArray(player.levels);
    });
  }

  // Очистка всех данных
  clearAll() {
    if (!this.isAvailable()) return;
    
    Object.values(this.keys).forEach(key => {
      localStorage.removeItem(key);
    });
  }

  // Инициализация начальных данных
  initializeDefaultData() {
    // Если данных нет, вернем null, чтобы приложение использовало начальные данные
    return null;
  }
}