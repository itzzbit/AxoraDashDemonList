// js/points.js
// Система подсчета очков для Geometry Dash Demon List
// Формула из второго проекта: maxScore - (maxScore - minScore) * ((position-1)/(totalLevels-1))^0.66

console.log('✅ Loading points.js...');

// Функция для совместимости с существующим кодом
function getLevelPoints(levelPosition, verifier, totalLevels) {
    return PointsSystem.calculateLevelPoints(levelPosition, totalLevels);
}

// Класс для управления системой очков
class PointsSystem {
    // Формула из второго проекта
    static calculateLevelPoints(levelPosition, totalLevels) {
        const maxScore = 1000;
        const minScore = 1;
        
        // Проверка входных данных
        if (typeof levelPosition !== 'number' || typeof totalLevels !== 'number') {
            console.error('❌ calculateLevelPoints: неверные параметры', {levelPosition, totalLevels});
            return 0;
        }
        
        if (levelPosition <= 0 || totalLevels <= 0) {
            console.error('❌ calculateLevelPoints: позиция и количество уровней должны быть > 0', {levelPosition, totalLevels});
            return 0;
        }
        
        if (totalLevels === 1) {
            return maxScore;
        }
        
        // Если позиция равна общему количеству уровней (последний уровень)
        if (levelPosition === totalLevels) {
            return minScore;
        }
        
        try {
            // Формула: maxScore - (maxScore - minScore) * ((position-1)/(totalLevels-1))^0.66
            const points = maxScore - (maxScore - minScore) * 
                Math.pow((levelPosition - 1) / (totalLevels - 1), 0.66);
            
            const roundedPoints = Math.round(points);
            
            // Гарантируем, что очки в пределах [minScore, maxScore]
            const finalPoints = Math.max(minScore, Math.min(maxScore, roundedPoints));
            
            console.log(`📊 calculateLevelPoints(${levelPosition}, ${totalLevels}) = ${finalPoints}`);
            return finalPoints;
        } catch (error) {
            console.error('❌ Ошибка в calculateLevelPoints:', error);
            return Math.round((maxScore + minScore) / 2);
        }
    }

    // Расчет очков игрока на основе пройденных уровней (учитывает структуру [[levelID]])
    static calculatePlayerPoints(player, levels) {
        if (!player || !Array.isArray(player.levels) || !Array.isArray(levels)) {
            console.warn('❌ calculatePlayerPoints: неверные параметры');
            return 0;
        }

        const totalLevels = levels.length;
        let totalPoints = 0;
        let validLevels = 0;

        // Для каждого уровня, пройденного игроком
        player.levels.forEach(levelArray => {
            if (!Array.isArray(levelArray) || levelArray.length < 1) {
                console.warn('⚠️ Некорректный формат levelArray:', levelArray);
                return;
            }
            
            const levelId = levelArray[0]; // Берем первый элемент массива
            
            // Находим позицию уровня в общем списке
            const levelIndex = levels.findIndex(l => l.id === levelId);
            if (levelIndex !== -1) {
                const position = levelIndex + 1;
                const points = this.calculateLevelPoints(position, totalLevels);
                totalPoints += points;
                validLevels++;
                console.log(`  ${player.name}: уровень ${levelId} (позиция ${position}) = ${points} очков`);
            } else {
                console.warn(`⚠️ Уровень с ID ${levelId} не найден для игрока ${player.name}`);
            }
        });

        const roundedPoints = Math.round(totalPoints);
        console.log(`📊 ${player.name}: всего ${validLevels} уровней, ${roundedPoints} очков`);
        return roundedPoints;
    }

    // Получение позиции уровня по ID
    static getLevelPosition(levels, levelId) {
        const index = levels.findIndex(level => level.id === levelId);
        return index !== -1 ? index + 1 : 0;
    }

    // Сортировка уровней по позиции (от 1 до N)
    static sortLevelsByPosition(levels) {
        return [...levels].sort((a, b) => {
            const posA = levels.findIndex(l => l.id === a.id) + 1;
            const posB = levels.findIndex(l => l.id === b.id) + 1;
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
            player.levels.some(levelArray => levelArray[0] === levelId)
        ).map(player => player.name);
    }

    // Получение списка уровней, пройденных игроком
    static getLevelsForPlayer(player, levels) {
        if (!player || !Array.isArray(player.levels)) return [];
        
        return player.levels
            .map(levelArray => {
                const levelId = levelArray[0];
                return levels.find(level => level.id === levelId);
            })
            .filter(level => level !== undefined);
    }
    
    // Пересчет очков для всех уровней
    static recalculateAllLevels(levels) {
        if (!Array.isArray(levels)) return levels;
        
        const totalLevels = levels.length;
        return levels.map((level, index) => {
            const position = index + 1;
            const points = this.calculateLevelPoints(position, totalLevels);
            return {
                ...level,
                position: position,
                points: points
            };
        });
    }
    
    // Пересчет очков для всех игроков
    static recalculateAllPlayers(players, levels) {
        if (!Array.isArray(players) || !Array.isArray(levels)) return players;
        
        return players.map(player => {
            const points = this.calculatePlayerPoints(player, levels);
            const passedLevels = player.levels ? player.levels.length : 0;
            return {
                ...player,
                points: points,
                levelsCount: passedLevels
            };
        });
    }
    
    // Тестирование формулы
    static testFormula() {
        console.log('🧪 Тестирование формулы очков:');
        
        const testCases = [
            { position: 1, totalLevels: 2, expected: 1000 },
            { position: 2, totalLevels: 2, expected: 1 },
            { position: 1, totalLevels: 5, expected: 1000 },
            { position: 3, totalLevels: 5 },
            { position: 5, totalLevels: 5, expected: 1 }
        ];
        
        testCases.forEach(test => {
            const result = this.calculateLevelPoints(test.position, test.totalLevels);
            const status = test.expected ? (result === test.expected ? '✅' : '❌') : '📊';
            console.log(`${status} Позиция ${test.position}/${test.totalLevels}: ${result} очков`);
        });
    }
}

// Экспорт для использования в других файлах
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { getLevelPoints, PointsSystem };
}

// Экспорт для использования в браузере
if (typeof window !== 'undefined') {
    window.getLevelPoints = getLevelPoints;
    window.PointsSystem = PointsSystem;
}

// Автоматическое тестирование при загрузке
console.log('✅ points.js loaded');
console.log('getLevelPoints доступна:', typeof getLevelPoints);
console.log('PointsSystem доступен:', typeof PointsSystem);

// Запускаем тест формулы
PointsSystem.testFormula();