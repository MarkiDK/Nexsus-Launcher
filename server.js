const Logger = require('./logger');
const EventEmitter = require('events');

class ServerManager extends EventEmitter {
    constructor() {
        super();
        this.servers = [];
        this.currentFilter = 'all';
        this.currentSort = 'name';
        this.favorites = new Set();
        Logger.info('ServerManager initialized');
    }

    async fetchServers() {
        try {
            Logger.info('Fetching servers...');
            // Her ville man normalt lave et API kald til FiveM's server liste
            // For eksempel: const response = await fetch('https://servers-frontend.fivem.net/api/servers/');
            
            // Mock data for nu
            const mockServers = [
                { 
                    id: '1',
                    name: 'Test Server 1',
                    players: 32,
                    maxPlayers: 64,
                    address: '127.0.0.1:30120',
                    online: true,
                    ping: 25
                },
                // Flere test servere kan tilføjes her
            ];

            this.servers = mockServers.map(server => ({
                ...server,
                favorite: this.favorites.has(server.id)
            }));

            this.emit('serversUpdated', this.servers);
            Logger.info(`Fetched ${this.servers.length} servers successfully`);
            return this.servers;
        } catch (error) {
            Logger.error(`Failed to fetch servers: ${error.message}`);
            throw error;
        }
    }

    setFilter(filter) {
        if (!['all', 'online', 'offline', 'favorites'].includes(filter)) {
            Logger.error(`Invalid filter: ${filter}`);
            throw new Error('Invalid filter');
        }
        this.currentFilter = filter;
        Logger.debug(`Filter set to: ${filter}`);
        this.emit('filterChanged', filter);
    }

    setSorting(sortBy) {
        if (!['name', 'players', 'ping'].includes(sortBy)) {
            Logger.error(`Invalid sorting: ${sortBy}`);
            throw new Error('Invalid sorting parameter');
        }
        this.currentSort = sortBy;
        Logger.debug(`Sorting set to: ${sortBy}`);
        this.emit('sortingChanged', sortBy);
    }

    getFilteredServers() {
        let filtered = [...this.servers];
        
        switch(this.currentFilter) {
            case 'online':
                filtered = filtered.filter(server => server.online);
                break;
            case 'offline':
                filtered = filtered.filter(server => !server.online);
                break;
            case 'favorites':
                filtered = filtered.filter(server => server.favorite);
                break;
            case 'all':
            default:
                // Returner alle servere
                break;
        }

        return filtered;
    }

    getSortedServers() {
        let servers = this.getFilteredServers();
        
        switch(this.currentSort) {
            case 'players':
                servers.sort((a, b) => b.players - a.players);
                break;
            case 'name':
                servers.sort((a, b) => a.name.localeCompare(b.name));
                break;
            case 'ping':
                servers.sort((a, b) => a.ping - b.ping);
                break;
        }

        return servers;
    }

    toggleFavorite(serverId) {
        const server = this.servers.find(s => s.id === serverId);
        if (!server) {
            Logger.error(`Server not found: ${serverId}`);
            throw new Error('Server not found');
        }

        if (this.favorites.has(serverId)) {
            this.favorites.delete(serverId);
            server.favorite = false;
            Logger.info(`Removed server ${serverId} from favorites`);
        } else {
            this.favorites.add(serverId);
            server.favorite = true;
            Logger.info(`Added server ${serverId} to favorites`);
        }

        this.emit('favoritesChanged', serverId, server.favorite);
        return server.favorite;
    }

    async connectToServer(serverId) {
        try {
            const server = this.servers.find(s => s.id === serverId);
            if (!server) {
                throw new Error('Server not found');
            }

            if (!server.online) {
                throw new Error('Server is offline');
            }

            Logger.info(`Connecting to server: ${server.name} (${server.address})`);
            
            // Her ville man implementere FiveM connection logik
            // For eksempel: await fivem.connect(server.address);
            
            this.emit('serverConnect', server);
            return true;
        } catch (error) {
            Logger.error(`Failed to connect to server: ${error.message}`);
            throw error;
        }
    }

    getServerDetails(serverId) {
        const server = this.servers.find(s => s.id === serverId);
        if (!server) {
            Logger.error(`Server details not found for ID: ${serverId}`);
            throw new Error('Server not found');
        }
        return server;
    }

    updateServerStatus(serverId, status) {
        const server = this.servers.find(s => s.id === serverId);
        if (!server) {
            Logger.error(`Cannot update status for unknown server: ${serverId}`);
            throw new Error('Server not found');
        }

        server.online = status.online;
        server.players = status.players;
        server.ping = status.ping;

        Logger.info(`Updated status for server ${serverId}: ${JSON.stringify(status)}`);
        this.emit('serverStatusUpdated', server);
    }

    startStatusUpdates(interval = 30000) {
        if (this._updateInterval) {
            clearInterval(this._updateInterval);
        }

        this._updateInterval = setInterval(async () => {
            try {
                await this.fetchServers();
                Logger.debug('Server status update completed');
            } catch (error) {
                Logger.error(`Failed to update server status: ${error.message}`);
            }
        }, interval);

        Logger.info(`Started server status updates with interval: ${interval}ms`);
    }

    stopStatusUpdates() {
        if (this._updateInterval) {
            clearInterval(this._updateInterval);
            this._updateInterval = null;
            Logger.info('Stopped server status updates');
        }
    }
}

// Eksporter ServerManager klassen
module.exports = { ServerManager };
