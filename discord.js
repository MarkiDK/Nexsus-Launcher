// discord.js

class DiscordManager {
    constructor() {
        this.isConnected = false;
        this.currentActivity = null;
        this.initializeListeners();
    }

    initializeListeners() {
        // Lyt efter Discord events
        window.electronAPI.onDiscordReady(this.handleDiscordReady.bind(this));
        window.electronAPI.onDiscordError(this.handleDiscordError.bind(this));
        window.electronAPI.onDiscordDisconnect(this.handleDiscordDisconnect.bind(this));

        // UI event listeners
        const connectBtn = document.querySelector('.discord-connect-btn');
        if (connectBtn) {
            connectBtn.addEventListener('click', () => this.toggleConnection());
        }

        // Status opdatering interval
        setInterval(() => this.updateActivity(), 15000);
    }

    async handleDiscordReady() {
        this.isConnected = true;
        this.updateConnectionUI(true);
        
        try {
            // Hent og vis brugerinfo
            const userInfo = await window.electronAPI.getDiscordUser();
            this.displayUserInfo(userInfo);
            
            // Start initial aktivitet
            this.updateActivity();
            
            window.nexusApp.showNotification('Discord forbundet', 'success');
        } catch (error) {
            console.error('Discord brugerinfo fejl:', error);
        }
    }

    handleDiscordError(error) {
        this.isConnected = false;
        this.updateConnectionUI(false);
        
        window.nexusApp.showNotification(
            `Discord fejl: ${error.message}`,
            'error'
        );
    }

    handleDiscordDisconnect() {
        this.isConnected = false;
        this.updateConnectionUI(false);
        
        window.nexusApp.showNotification(
            'Discord forbindelse afbrudt',
            'warning'
        );
    }

    async toggleConnection() {
        try {
            if (this.isConnected) {
                await window.electronAPI.disconnectDiscord();
                this.isConnected = false;
            } else {
                await window.electronAPI.connectDiscord();
                // isConnected opdateres via handleDiscordReady
            }
            
            this.updateConnectionUI(this.isConnected);
        } catch (error) {
            console.error('Discord toggle fejl:', error);
            window.nexusApp.showNotification(
                'Kunne ikke ændre Discord forbindelse',
                'error'
            );
        }
    }

    updateConnectionUI(connected) {
        const connectBtn = document.querySelector('.discord-connect-btn');
        const statusIndicator = document.querySelector('.discord-status');
        
        if (connectBtn) {
            connectBtn.textContent = connected ? 'Afbryd Discord' : 'Forbind Discord';
            connectBtn.classList.toggle('connected', connected);
        }
        
        if (statusIndicator) {
            statusIndicator.className = `discord-status ${connected ? 'connected' : 'disconnected'}`;
            statusIndicator.textContent = connected ? 'Forbundet' : 'Ikke forbundet';
        }
    }

    displayUserInfo(userInfo) {
        const userElement = document.querySelector('.discord-user-info');
        if (!userElement) return;

        userElement.innerHTML = `
            <img src="${userInfo.avatar}" alt="${userInfo.username}" class="discord-avatar">
            <div class="discord-user-details">
                <span class="discord-username">${userInfo.username}</span>
                <span class="discord-discriminator">#${userInfo.discriminator}</span>
            </div>
        `;
    }

    async updateActivity() {
        if (!this.isConnected) return;

        try {
            const gameStatus = await window.electronAPI.getGameStatus();
            const newActivity = this.createActivityObject(gameStatus);

            // Kun opdater hvis aktiviteten har ændret sig
            if (this.hasActivityChanged(newActivity)) {
                await window.electronAPI.setDiscordActivity(newActivity);
                this.currentActivity = newActivity;
            }
        } catch (error) {
            console.error('Aktivitet opdatering fejl:', error);
        }
    }

    createActivityObject(gameStatus) {
        const activity = {
            details: 'I launcher',
            state: 'Browser servere',
            startTimestamp: Date.now(),
            largeImageKey: 'server_logo',
            largeImageText: 'Server navn',
            smallImageKey: 'launcher_icon',
            smallImageText: 'Launcher v' + window.electronAPI.getCurrentVersion(),
            buttons: [
                {
                    label: 'Join server',
                    url: 'fivem://connect/din.server.ip'
                },
                {
                    label: 'Discord',
                    url: 'https://discord.gg/dinserver'
                }
            ]
        };

        if (gameStatus.inGame) {
            activity.details = `Spiller på ${gameStatus.serverName}`;
            activity.state = `${gameStatus.playerCount}/32 spillere`;
            activity.startTimestamp = gameStatus.sessionStart;
        }

        return activity;
    }

    hasActivityChanged(newActivity) {
        if (!this.currentActivity) return true;
        
        return JSON.stringify(this.currentActivity) !== JSON.stringify(newActivity);
    }
}

// Initialiser Discord manager når dokumentet er klar
document.addEventListener('DOMContentLoaded', () => {
    window.discordManager = new DiscordManager();
});
