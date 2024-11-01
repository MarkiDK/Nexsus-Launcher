// notifications.js

class NotificationManager {
    constructor() {
        this.container = this.createContainer();
        this.notifications = new Map();
        this.counter = 0;
    }

    createContainer() {
        const container = document.createElement('div');
        container.className = 'notification-container';
        document.body.appendChild(container);
        return container;
    }

    show(message, type = 'info', duration = 5000) {
        const id = this.counter++;
        const notification = this.createNotification(id, message, type);
        
        this.notifications.set(id, notification);
        this.container.appendChild(notification);

        // Tilføj show klasse efter en frame for at triggere animation
        requestAnimationFrame(() => {
            notification.classList.add('show');
        });

        // Auto-fjern efter duration
        if (duration > 0) {
            setTimeout(() => this.remove(id), duration);
        }

        return id;
    }

    createNotification(id, message, type) {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.dataset.id = id;

        // Tilføj ikon baseret på type
        const icon = this.getIconForType(type);
        
        notification.innerHTML = `
            <div class="notification-content">
                <i class="notification-icon ${icon}"></i>
                <span class="notification-message">${message}</span>
            </div>
            <button class="notification-close">✕</button>
        `;

        // Tilføj event listener til luk knap
        const closeBtn = notification.querySelector('.notification-close');
        closeBtn.addEventListener('click', () => this.remove(id));

        return notification;
    }

    getIconForType(type) {
        switch (type) {
            case 'success': return 'check-circle';
            case 'error': return 'alert-circle';
            case 'warning': return 'alert-triangle';
            case 'info':
            default: return 'info';
        }
    }

    remove(id) {
        const notification = this.notifications.get(id);
        if (!notification) return;

        // Start fade out animation
        notification.classList.remove('show');

        // Fjern efter animation
        notification.addEventListener('transitionend', () => {
            notification.remove();
            this.notifications.delete(id);
        });
    }

    // Hjælpefunktioner for forskellige notifikationstyper
    success(message, duration) {
        return this.show(message, 'success', duration);
    }

    error(message, duration) {
        return this.show(message, 'error', duration);
    }

    warning(message, duration) {
        return this.show(message, 'warning', duration);
    }

    info(message, duration) {
        return this.show(message, 'info', duration);
    }

    // Fjern alle aktive notifikationer
    clearAll() {
        this.notifications.forEach((_, id) => this.remove(id));
    }
}

// Initialiser notification manager når dokumentet er klar
document.addEventListener('DOMContentLoaded', () => {
    window.notificationManager = new NotificationManager();
});
