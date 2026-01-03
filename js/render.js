class Renderer {
  constructor(appInstance) {
    this.app = appInstance;
  }

  // Рендер главной страницы
  renderHome() {
    const topLevels = this.app.levels.slice(0, 6);
    const topPlayers = this.app.players.slice(0, 6);

    return `
      <div class="container fade-in">
        <div class="welcome-section">
          <h1 class="welcome-title" data-i18n="welcome_title">Geometry Dash Demon List</h1>
          <p class="welcome-text" data-i18n="welcome_text">Community-maintained ranking of the hardest Geometry Dash levels</p>
        </div>
        
        <section>
          <h2 class="section-title" data-i18n="top_levels">Top Levels</h2>
          <div class="levels-grid">
            ${topLevels.map(level => this.renderLevelCard(level)).join('')}
          </div>
          <div class="view-all">
            <a href="#levels" class="nav-link view-all-link" data-page="levels" data-i18n="view_all_levels">View All Levels →</a>
          </div>
        </section>
        
        <section>
          <h2 class="section-title" data-i18n="top_players">Top Players</h2>
          <div class="players-grid">
            ${topPlayers.map(player => this.renderPlayerCard(player)).join('')}
          </div>
          <div class="view-all">
            <a href="#players" class="nav-link view-all-link" data-page="players" data-i18n="view_all_players">View All Players →</a>
          </div>
        </section>
      </div>
    `;
  }

  // Рендер страницы уровней
  renderLevelsPage(filteredLevels = null) {
    const levels = filteredLevels || this.app.levels;
    const hasSearch = filteredLevels !== null;

    return `
      <div class="container fade-in">
        <h2 class="section-title" data-i18n="levels_title">Demon Levels</h2>
        
        <div class="controls">
          <div class="search-container">
            <i class='bx bx-search search-icon'></i>
            <input type="text" class="search-input" data-i18n-placeholder="search" placeholder="Search...">
          </div>
        </div>
        
        <div class="levels-grid">
          ${levels.length > 0 ? 
            levels.map(level => this.renderLevelCard(level)).join('') : 
            `<p class="no-results" data-i18n="${hasSearch ? 'no_levels_found' : 'error_loading'}">${hasSearch ? 'No levels found matching your search.' : 'Error loading levels.'}</p>`
          }
        </div>
      </div>
    `;
  }

  // Рендер страницы игроков
  renderPlayersPage(filteredPlayers = null) {
    const players = filteredPlayers || this.app.players;
    const hasSearch = filteredPlayers !== null;

    return `
      <div class="container fade-in">
        <h2 class="section-title" data-i18n="players_title">Top Players</h2>
        
        <div class="controls">
          <div class="search-container">
            <i class='bx bx-search search-icon'></i>
            <input type="text" class="search-input" data-i18n-placeholder="search" placeholder="Search...">
          </div>
        </div>
        
        <div class="players-grid">
          ${players.length > 0 ? 
            players.map(player => this.renderPlayerCard(player)).join('') : 
            `<p class="no-results" data-i18n="${hasSearch ? 'no_players_found' : 'error_loading'}">${hasSearch ? 'No players found matching your search.' : 'Error loading players.'}</p>`
          }
        </div>
      </div>
    `;
  }

  // Рендер страницы "О сайте"
  renderAboutPage() {
    return `
      <div class="container fade-in">
        <h2 class="section-title" data-i18n="about_title">About Demon List</h2>
        
        <div class="detail-container">
          <p data-i18n="about_content">This is a community-maintained demon list for Geometry Dash levels.</p>
          
          <h3 data-i18n="rules_title">Rules for Level Inclusion</h3>
          <ul>
            <li data-i18n="rule_1">Level must be rated Extreme Demon</li>
            <li data-i18n="rule_2">Level must have a verification video</li>
            <li data-i18n="rule_3">Level must be harder than #25 on the list</li>
          </ul>
          
          <h3 data-i18n="points_system_title">Points System</h3>
          <p data-i18n="points_system_description">Points are calculated based on level position. Higher positions give more points.</p>
          
          <h3 data-i18n="contact_title">Contact</h3>
          <p data-i18n="contact_email">Email: contact@demondlist.com</p>
        </div>
      </div>
    `;
  }

  // Рендер карточки уровня
  renderLevelCard(level) {
    if (!level || typeof level !== 'object') {
      return `
        <div class="level-card error">
          <div class="level-position">#404</div>
          <div class="level-name" data-i18n="level_not_found">Level not found</div>
        </div>
      `;
    }

    const position = this.app.levels.indexOf(level) + 1;
    const points = PointsSystem.calculateLevelPoints(position, this.app.levels.length);

    return `
      <div class="level-card" data-level-id="${level.id}">
        <div class="level-position">#${position}</div>
        <div class="level-name">${level.name}</div>
        <div class="level-creator" data-i18n="creator">Creator: ${level.creator}</div>
        <div class="level-verifier" data-i18n="verifier">Verifier: ${level.verifier}</div>
        <div class="level-points">${Utils.formatNumber(points)} <span data-i18n="points">points</span></div>
      </div>
    `;
  }

  // Рендер карточки игрока
  renderPlayerCard(player) {
    if (!player || typeof player !== 'object') {
      return `
        <div class="player-card error">
          <div class="player-rank">#404</div>
          <div class="player-name" data-i18n="player_not_found">Player not found</div>
        </div>
      `;
    }

    const position = this.app.players.indexOf(player) + 1;
    const points = PointsSystem.calculatePlayerPoints(player, this.app.levels);
    const levelsCompleted = player.levels ? player.levels.length : 0;

    return `
      <div class="player-card" data-player-id="${player.id}">
        <div class="player-rank">#${position}</div>
        <div class="player-name">${player.name}</div>
        <div class="player-points">${Utils.formatNumber(points)} <span data-i18n="points">points</span></div>
        <div class="player-levels-count" data-i18n="levels_completed">Levels completed: ${levelsCompleted}</div>
      </div>
    `;
  }

  // Рендер детальной страницы уровня
  renderLevelDetail(level) {
    const position = this.app.levels.indexOf(level) + 1;
    const points = PointsSystem.calculateLevelPoints(position, this.app.levels.length);
    const victors = PointsSystem.getPlayersForLevel(level.id, this.app.players);

    return `
      <div class="container fade-in">
        <button class="back-button" data-page="levels" data-i18n="back_to_levels">← Back to Levels</button>
        
        <div class="detail-container">
          <div class="detail-header">
            <h1 class="detail-title">#${position} - ${level.name}</h1>
            <div class="detail-subtitle">
              <span data-i18n="creator">Creator</span>: ${level.creator} | 
              <span data-i18n="verifier">Verifier</span>: ${level.verifier}
            </div>
            <div class="level-points">${Utils.formatNumber(points)} <span data-i18n="points">points</span></div>
          </div>

          <div class="detail-content">
            ${level.videoURL ? `
              <h3 data-i18n="video">Video</h3>
              <a href="${level.videoURL}" target="_blank" class="video-link" data-i18n="watch_video">Watch Verification Video</a>
            ` : ''}
            
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

  // Рендер детальной страницы игрока
  renderPlayerDetail(player) {
    const position = this.app.players.indexOf(player) + 1;
    const points = PointsSystem.calculatePlayerPoints(player, this.app.levels);
    const playerLevels = PointsSystem.getLevelsForPlayer(player, this.app.levels);

    return `
      <div class="container fade-in">
        <button class="back-button" data-page="players" data-i18n="back_to_players">← Back to Players</button>
        
        <div class="detail-container">
          <div class="detail-header">
            <h1 class="detail-title">#${position} - ${player.name}</h1>
            <div class="player-points">${Utils.formatNumber(points)} <span data-i18n="points">points</span></div>
          </div>

          <div class="detail-content">
            <h3 data-i18n="completed_levels">Completed Levels</h3>
            ${playerLevels.length > 0 ? 
              playerLevels.map(level => {
                const levelPosition = this.app.levels.indexOf(level) + 1;
                const levelPoints = PointsSystem.calculateLevelPoints(levelPosition, this.app.levels.length);
                return `<p>#${levelPosition} - ${level.name} (${Utils.formatNumber(levelPoints)} points)</p>`;
              }).join('') : 
              `<p data-i18n="no_victors">No levels completed yet.</p>`
            }
          </div>
        </div>
      </div>
    `;
  }
}