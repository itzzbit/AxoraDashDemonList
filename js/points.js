class PointsSystem {
  // Формула из второго проекта
  static calculateLevelPoints(levelPosition, totalLevels) {
    const maxScore = 1000;
    const minScore = 1;
    
    if (totalLevels <= 1) {
      return maxScore;
    }
    
    // Формула: maxScore - (maxScore - minScore) * ((position-1)/(totalLevels-1))^0.66
    const points = maxScore - (maxScore - minScore) * 
      Math.pow((levelPosition - 1) / (totalLevels - 1), 0.66);
    
    return Math.round(points);
  }

  // Расчет очков игрока на основе пройденных уровней
  static calculatePlayerPoints(player, levels) {
    if (!player || !Array.isArray(player.levels) || !Array.isArray(levels)) {
      return 0;
    }

    const totalLevels = levels.length;
    let totalPoints = 0;

    // Для каждого уровня, пройденного игроком
    player.levels.forEach(levelId => {
      // Находим позицию уровня в общем списке
      const levelIndex = levels.findIndex(l => l.id === levelId);
      if (levelIndex !== -1) {
        const position = levelIndex + 1;
        const points = this.calculateLevelPoints(position, totalLevels);
        totalPoints += points;
      }
    });

    return Math.round(totalPoints);
  }

  // Получение позиции уровня по ID
  static getLevelPosition(levels, levelId) {
    const index = levels.findIndex(level => level.id === levelId);
    return index !== -1 ? index + 1 : 0;
  }

  // Сортировка уровней по позиции (от 1 до N)
  static sortLevelsByPosition(levels) {
    return [...levels].sort((a, b) => {
      const posA = levels.indexOf(a) + 1;
      const posB = levels.indexOf(b) + 1;
      return posA - posB;
    });
  }

  // Сортировка игроков по очкам (по убыванию)
  static sortPlayersByPoints(players, levels) {
    return [...players].sort((a, b) => {
      const pointsA = this.calculatePlayerPoints(a, levels);
      const pointsB = this.calculatePlayerPoints(b, levels);
      return pointsB - pointsA;
    });
  }

  // Получение списка игроков, прошедших уровень
  static getPlayersForLevel(levelId, players) {
    if (!Array.isArray(players)) return [];
    
    return players.filter(player => 
      Array.isArray(player.levels) && 
      player.levels.includes(levelId)
    ).map(player => player.name);
  }

  // Получение списка уровней, пройденных игроком
  static getLevelsForPlayer(player, levels) {
    if (!player || !Array.isArray(player.levels)) return [];
    
    return player.levels
      .map(levelId => levels.find(level => level.id === levelId))
      .filter(level => level !== undefined);
  }
}