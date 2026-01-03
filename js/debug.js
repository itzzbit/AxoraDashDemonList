// js/debug.js
function debugSystem() {
    console.log('=== DEBUG DEMON LIST ===');
    
    // 1. Проверка данных
    console.log('1. Исходные данные:');
    console.log('- Уровней:', window.initialData.levels.length);
    console.log('- Игроков:', window.initialData.players.length);
    
    // 2. Проверка app
    console.log('2. Состояние приложения:');
    console.log('- app существует:', !!window.app);
    console.log('- Уровней в app:', window.app?.levels?.length);
    console.log('- Игроков в app:', window.app?.players?.length);
    
    // 3. Проверка функции подсчета очков
    console.log('3. Тест формулы:');
    console.log('- getLevelPoints существует:', typeof getLevelPoints === 'function');
    console.log('- 1й уровень (позиция 1):', getLevelPoints(1, false, 2));
    console.log('- 2й уровень (позиция 2):', getLevelPoints(2, false, 2));
    
    // 4. Проверка конкретного игрока
    const player = window.app?.players?.find(p => p.name === "notdogorix");
    if (player) {
        console.log('4. notdogorix:');
        console.log('- ID пройденных уровней:', player.levels.map(l => l[0]));
        console.log('- Текущие очки:', player.points);
        
        // Ручной пересчет
        let manualPoints = 0;
        player.levels.forEach(levelArray => {
            const levelId = levelArray[0];
            const level = window.app.levels.find(l => l.id === levelId);
            if (level) {
                manualPoints += level.points;
                console.log(`  Уровень ${levelId} (${level.name}): ${level.points} очков`);
            }
        });
        console.log('- Ручной пересчет:', manualPoints);
    }
    
    console.log('=== КОНЕЦ ОТЛАДКИ ===');
}

// Запустить через 2 секунды после загрузки
setTimeout(debugSystem, 2000);