// main.js

// Window control handlers
document.addEventListener('DOMContentLoaded', () => {
    // Minimize og luk knapper
    const minimizeBtn = document.querySelector('.minimize-btn');
    const closeBtn = document.querySelector('.close-btn');

    if (minimizeBtn) {
        minimizeBtn.addEventListener('click', () => {
            window.electronAPI.minimizeWindow();
        });
    }

    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            window.electronAPI.closeWindow();
        });
    }

    // Server status check
    updateServerStatus();
    setInterval(updateServerStatus, 60000); // Check hver minut
});

// Server status opdatering
async function updateServerStatus() {
    const statusIndicator = document.querySelector('.status-indicator');
    const playerCount = document.querySelector('.player-count');
    const queueCount = document.querySelector('.queue-count');
    
    try {
        const status = await window.electronAPI.getServerStatus();
        
        if (statusIndicator) {
            statusIndicator.classList.remove('status-offline');
            statusIndicator.classList.add('status-online');
        }
        
        if (playerCount) {
            playerCount.textContent = status.players;
        }
        
        if (queueCount) {
            queueCount.textContent = status.queue;
        }
    } catch (error) {
        if (statusIndicator) {
            statusIndicator.classList.remove('status-online');
            statusIndicator.classList.add('status-offline');
        }
        
        console.error('Kunne ikke hente server status:', error);
    }
}

// FiveM launch handler
const launchButton = document.querySelector('.launch-btn');
if (launchButton) {
    launchButton.addEventListener('click', async () => {
        try {
            launchButton.disabled = true;
            launchButton.textContent = 'Starter...';
            
            await window.electronAPI.launchFiveM();
            
            // Gendan knappen efter 5 sekunder
            setTimeout(() => {
                launchButton.disabled = false;
                launchButton.textContent = 'Start FiveM';
            }, 5000);
        } catch (error) {
            console.error('Fejl ved start af FiveM:', error);
            launchButton.disabled = false;
            launchButton.textContent = 'Start FiveM';
        }
    });
}

// Tilføj i main.js
const { autoUpdater } = require('electron-updater');
autoUpdater.checkForUpdatesAndNotify();

// Notifikation system
class NotificationSystem {
    static show(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        // Fade in animation
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);
        
        // Auto remove efter 3 sekunder
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 3000);
    }
}
webPreferences: {
  nodeIntegration: false,
  contextIsolation: true,
  sandbox: true
}

// Export functions for use in other files
window.nexusApp = {
    showNotification: NotificationSystem.show,
    updateServerStatus: updateServerStatus
};
