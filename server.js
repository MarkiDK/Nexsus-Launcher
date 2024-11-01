// servers.js

class ServerManager {
    constructor() {
        this.servers = [];
        this.favorites = new Set();
        this.currentFilter = 'all';
        this.sortBy = 'players';
        this.sortDirection = 'desc';
        
        this.initializeListeners();
        this.loadFavorites();
    }

    initializeListeners() {
        // Refresh knap
        const refreshBtn = document.querySelector('.refresh-servers-btn');
        if (refreshBtn) {
            refreshBtn.addEventListener('click', () => this.refreshServers());
        }

        // Filter knapper
        const filterBtns = document.querySelectorAll('.server-filter-btn');
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => this.setFilter(btn.dataset.filter));
        });

        // Sortering
        const sortBtns = document.querySelectorAll('.server-sort-btn');
        sortBtns.forEach(btn => {
            btn.addEventListener('click', () => this.setSorting(btn.dataset.sort));
        });

        // Søgefelt
        const searchInput = document.querySelector('.server-search-input');
        if (searchInput) {
            searchInput.addEventListener('input', () => this.handleSearch(searchInput.value));
        }

        // Auto-refresh interval
        setInterval(() => this.refreshServers(), 30000); // Hver 30. sekund
    }

    async loadFavorites() {
        try {
            const savedFavorites = await window.electronAPI.getFavoriteServers();
            this.favorites = new Set(savedFavorites);
            this.updateFavoriteButtons();
        } catch (error) {
            console.error('Kunne ikke indlæse favoritter:', error);
        }
    }

    async refreshServers() {
        try {
            const refreshBtn = document.querySelector('.refresh-servers-btn');
            if (refreshBtn) {
                refreshBtn.classList.add('spinning');
            }

            const servers = await window.electronAPI.getServerList();
            this.servers = servers;
            this.displayServers();

        } catch (error) {
            window.nexusApp.showNotification('Kunne ikke opdatere serverliste', 'error');
        } finally {
            const refreshBtn = document.querySelector('.refresh-servers-btn');
            if (refreshBtn) {
                refreshBtn.classList.remove('spinning');
            }
        }
    }

    displayServers() {
        const container = document.querySelector('.servers-container');
        if (!container) return;
    
        // Filtrer, søg og sortér servere
        let filteredServers = this.filterServers(this.servers);
        filteredServers = this.searchServers(filteredServers); // Tilføj denne linje
        filteredServers = this.sortServers(filteredServers);
    
        // Resten af koden forbliver den samme...
    }
    

        container.innerHTML = ''; // Ryd container

        if (filteredServers.length === 0) {
            container.innerHTML = `
                <div class="no-servers-message">
                    <i class="no-servers-icon"></i>
                    <p>Ingen servere fundet</p>
                </div>
            `;
            return;
        }

        filteredServers.forEach(server => {
            const serverCard = this.createServerCard(server);
            container.appendChild(serverCard);
        });

        this.updateServerCount(filteredServers.length);
    }

    createServerCard(server) {
        const card = document.createElement('div');
        card.className = 'server-card';
        card.dataset.serverId = server.id;

        const isFavorite = this.favorites.has(server.id);
        
        card.innerHTML = `
            <div class="server-header">
                <img src="${server.icon}" alt="${server.name}" class="server-icon">
                <div class="server-info">
                    <h3 class="server-name">${server.name}</h3>
                    <div class="server-meta">
                        <span class="server-players">
                            <i class="players-icon"></i>
                            ${server.players}/${server.maxPlayers}
                        </span>
                        <span class="server-ping">
                            <i class="ping-icon"></i>
                            ${server.ping}ms
                        </span>
                    </div>
                </div>
                <button class="favorite-btn ${isFavorite ? 'active' : ''}" data-server-id="${server.id}">
                    <i class="star-icon"></i>
                </button>
            </div>
            <div class="server-details">
                <p class="server-description">${server.description}</p>
                <div class="server-tags">
                    ${server.tags.map(tag => `<span class="server-tag">${tag}</span>`).join('')}
                </div>
            </div>
            <div class="server-actions">
                <button class="connect-btn" data-server-id="${server.id}">
                    Forbind
                </button>
                <button class="details-btn" data-server-id="${server.id}">
                    Detaljer
                </button>
            </div>
        `;

        // Tilføj event listeners
        const favoriteBtn = card.querySelector('.favorite-btn');
        favoriteBtn.addEventListener('click', () => this.toggleFavorite(server.id));

        const connectBtn = card.querySelector('.connect-btn');
        connectBtn.addEventListener('click', () => this.connectToServer(server));

        const detailsBtn = card.querySelector('.details-btn');
        detailsBtn.addEventListener('click', () => this.showServerDetails(server));

        return card;
    }

    async toggleFavorite(serverId) {
        try {
            if (this.favorites.has(serverId)) {
                this.favorites.delete(serverId);
                await window.electronAPI.removeFavoriteServer(serverId);
            } else {
                this.favorites.add(serverId);
                await window.electronAPI.addFavoriteServer(serverId);
            }
            
            this.updateFavoriteButtons();
        } catch (error) {
            window.nexusApp.showNotification('Kunne ikke opdatere favoritter', 'error');
        }
    }

    updateFavoriteButtons() {
        const favoriteBtns = document.querySelectorAll('.favorite-btn');
        favoriteBtns.forEach(btn => {
            const serverId = btn.dataset.serverId;
            btn.classList.toggle('active', this.favorites.has(serverId));
        });
    }

    async connectToServer(server) {
        try {
            const response = await window.electronAPI.connectToServer(server.id);
            if (response.success) {
                window.nexusApp.showNotification(`Forbinder til ${server.name}...`, 'info');
            } else {
                throw new Error(response.error);
            }
        } catch (error) {
            window.nexusApp.showNotification(
                `Kunne ikke forbinde til serveren: ${error.message}`,
                'error'
            );
        }
    }

    async showServerDetails(server) {
        try {
            const details = await window.electronAPI.getServerDetails(server.id);
            
            // Vis modal med serverdetaljer
            const modal = document.createElement('div');
            modal.className = 'server-details-modal';
            modal.innerHTML = `
                <div class="modal-content">
                    <h2>${server.name}</h2>
                    <div class="server-stats">
                        <div class="stat">
                            <span class="stat-label">Spillere</span>
                            <span class="stat-value">${details.players.length}/${server.maxPlayers}</span>
                        </div>
                        <div class="stat">
                            <span class="stat-label">Ping</span>
                            <span class="stat-value">${server.ping}ms</span>
                        </div>
                    </div>
                    <div class="player-list">
                        ${this.createPlayerList(details.players)}
                    </div>
                    <div class="server-resources">
                        <h3>Resources (${details.resources.length})</h3>
                        <div class="resources-list">
                            ${details.resources.map(r => `<span class="resource">${r}</span>`).join('')}
                        </div>
                    </div>
                    <button class="close-modal-btn">Luk</button>
                </div>
            `;

            document.body.appendChild(modal);
            
            // Tilføj event listener til luk knap
            const closeBtn = modal.querySelector('.close-modal-btn');
            closeBtn.addEventListener('click', () => modal.remove());
            
        } catch (error) {
            window.nexusApp.showNotification('Kunne ikke hente serverdetaljer', 'error');
        }
    }

    createPlayerList(players) {
        return players.map(player => `
            <div class="player-item">
                <span class="player-name">${player.name}</span>
                <span class="player-id">ID: ${player.id}</span>
                <span class="player-ping">${player.ping}ms</span>
            </div>
        `).join('');
    }

    // ... (fortsætter i næste del)
}
/ Fortsættelse af ServerManager klassen...

    setFilter(filter) {
        this.currentFilter = filter;
        
        // Opdater aktiv klasse på filter knapper
        const filterBtns = document.querySelectorAll('.server-filter-btn');
        filterBtns.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.filter === filter);
        });
        
        this.displayServers();
    }

    filterServers(servers) {
        switch (this.currentFilter) {
            case 'favorites':
                return servers.filter(server => this.favorites.has(server.id));
            case 'online':
                return servers.filter(server => server.online);
            case 'offline':
                return servers.filter(server => !server.online);
            case 'all':
            default:
                return servers;
        }
    }

    setSorting(sortBy) {
        if (this.sortBy === sortBy) {
            // Hvis samme sortering, vend retningen
            this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
        } else {
            this.sortBy = sortBy;
            this.sortDirection = 'desc'; // Standard retning for ny sortering
        }

        // Opdater aktiv klasse og retnings-ikon på sorteringsknapper
        const sortBtns = document.querySelectorAll('.server-sort-btn');
        sortBtns.forEach(btn => {
            const isActive = btn.dataset.sort === sortBy;
            btn.classList.toggle('active', isActive);
            if (isActive) {
                btn.classList.toggle('asc', this.sortDirection === 'asc');
                btn.classList.toggle('desc', this.sortDirection === 'desc');
            }
        });

        this.displayServers();
    }

    sortServers(servers) {
        return [...servers].sort((a, b) => {
            let comparison = 0;
            
            switch (this.sortBy) {
                case 'name':
                    comparison = a.name.localeCompare(b.name);
                    break;
                case 'players':
                    comparison = a.players - b.players;
                    break;
                case 'ping':
                    comparison = a.ping - b.ping;
                    break;
                case 'favorite':
                    const aFav = this.favorites.has(a.id);
                    const bFav = this.favorites.has(b.id);
                    comparison = aFav === bFav ? 0 : aFav ? -1 : 1;
                    break;
            }

            return this.sortDirection === 'asc' ? comparison : -comparison;
        });
    }

    handleSearch(searchTerm) {
        clearTimeout(this.searchTimeout);
        
        // Debounce søgningen for at undgå for mange opdateringer
        this.searchTimeout = setTimeout(() => {
            this.searchTerm = searchTerm.toLowerCase().trim();
            this.displayServers();
        }, 300);
    }

    searchServers(servers) {
        if (!this.searchTerm) return servers;

        return servers.filter(server => {
            return (
                server.name.toLowerCase().includes(this.searchTerm) ||
                server.description.toLowerCase().includes(this.searchTerm) ||
                server.tags.some(tag => tag.toLowerCase().includes(this.searchTerm))
            );
        });
    }

    updateServerCount(count) {
        const countElement = document.querySelector('.server-count');
        if (countElement) {
            countElement.textContent = `${count} server${count === 1 ? '' : 'e'}`;
        }
    }
}

// Opret og eksporter en instance af ServerManager
const serverManager = new ServerManager();
export default serverManager;