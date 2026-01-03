class Utils {
  // Форматирование чисел (1,000,000)
  static formatNumber(num) {
    return num.toLocaleString();
  }

  // Безопасное получение элемента по ID
  static getElement(id) {
    const element = document.getElementById(id);
    if (!element) {
      console.error(`Element with id "${id}" not found`);
      return null;
    }
    return element;
  }

  // Создание элемента с атрибутами
  static createElement(tag, attributes = {}, text = '') {
    const element = document.createElement(tag);
    
    Object.keys(attributes).forEach(key => {
      element.setAttribute(key, attributes[key]);
    });
    
    if (text) {
      element.textContent = text;
    }
    
    return element;
  }

  // Проверка, является ли объект пустым
  static isEmpty(obj) {
    return Object.keys(obj).length === 0;
  }

  // Глубокое клонирование объекта
  static deepClone(obj) {
    return JSON.parse(JSON.stringify(obj));
  }

  // Дебаунс для поиска
  static debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  // Проверка наличия localStorage
  static isLocalStorageAvailable() {
    try {
      const test = '__storage_test__';
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
      return true;
    } catch (e) {
      console.warn('LocalStorage is not available:', e);
      return false;
    }
  }

  // Обработка ошибок для отображения пользователю
  static showError(message) {
    const app = Utils.getElement('app');
    if (app) {
      app.innerHTML = `
        <div class="error-message">
          <h3>Error</h3>
          <p>${message}</p>
          <button onclick="location.reload()">Reload Page</button>
        </div>
      `;
    }
  }

  // Копирование текста в буфер обмена
  static copyToClipboard(text) {
    return navigator.clipboard.writeText(text);
  }

  // Получение параметра из URL
  static getUrlParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
  }

  // Проверка валидности ID
  static isValidId(id) {
    return !isNaN(id) && id > 0;
  }

  // Сортировка объектов по свойству
  static sortByProperty(array, property, ascending = true) {
    return array.sort((a, b) => {
      let aVal = a[property];
      let bVal = b[property];
      
      if (typeof aVal === 'string') {
        aVal = aVal.toLowerCase();
        bVal = bVal.toLowerCase();
      }
      
      if (aVal < bVal) return ascending ? -1 : 1;
      if (aVal > bVal) return ascending ? 1 : -1;
      return 0;
    });
  }
}