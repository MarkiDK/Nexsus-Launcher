// chat.js

class ChatManager {
    constructor() {
        this.messages = [];
        this.isConnected = false;
        this.unreadCount = 0;
        this.initializeListeners();
    }

    initializeListeners() {
        // Chat container elements
        this.chatContainer = document.querySelector('.chat-container');
        this.messageList = document.querySelector('.chat-messages');
        this.messageInput = document.querySelector('.chat-input');
        this.sendButton = document.querySelector('.chat-send-btn');

        // Tilføj event listeners
        if (this.messageInput) {
            this.messageInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    this.sendMessage();
                }
            });
        }

        if (this.sendButton) {
            this.sendButton.addEventListener('click', () => this.sendMessage());
        }

        // Lyt efter nye beskeder
        window.electronAPI.onChatMessage(this.handleNewMessage.bind(this));
        window.electronAPI.onChatConnect(this.handleConnect.bind(this));
        window.electronAPI.onChatDisconnect(this.handleDisconnect.bind(this));

        // Auto-scroll når ny besked tilføjes
        if (this.messageList) {
            this.messageList.addEventListener('DOMNodeInserted', this.scrollToBottom.bind(this));
        }
    }

    async sendMessage() {
        if (!this.isConnected || !this.messageInput.value.trim()) return;

        try {
            await window.electronAPI.sendChatMessage(this.messageInput.value);
            this.messageInput.value = '';
        } catch (error) {
            window.nexusApp.showNotification('Kunne ikke sende besked', 'error');
        }
    }

    handleNewMessage(message) {
        // Tilføj besked til array
        this.messages.push(message);
        
        // Opdater UI
        this.displayMessage(message);
        
        // Opdater ulæste beskeder hvis chat ikke er i fokus
        if (!document.hasFocus()) {
            this.incrementUnreadCount();
        }
    }

    displayMessage(message) {
        if (!this.messageList) return;

        const messageElement = document.createElement('div');
        messageElement.className = `chat-message ${message.type}`;
        
        const timestamp = new Date(message.timestamp).toLocaleTimeString();
        
        messageElement.innerHTML = `
            <span class="message-timestamp">[${timestamp}]</span>
            <span class="message-author">${message.author}:</span>
            <span class="message-content">${this.formatMessage(message.content)}</span>
        `;

        this.messageList.appendChild(messageElement);
    }

    formatMessage(content) {
        // Erstat emojis
        content = this.replaceEmojis(content);
        
        // Konverter links til klikbare links
        content = content.replace(
            /(https?:\/\/[^\s]+)/g,
            '<a href="$1" target="_blank">$1</a>'
        );
        
        return content;
    }

    replaceEmojis(text) {
        const emojiMap = {
            ':)': '😊',
            ':(': '😢',
            ':D': '😃',
            ':P': '😛',
            '<3': '❤️'
            // Tilføj flere efter behov
        };

        return text.replace(/:\)|:\(|:D|:P|<3/g, match => emojiMap[match] || match);
    }

    handleConnect() {
        this.isConnected = true;
        this.updateConnectionStatus(true);
        
        // Aktiver input
        if (this.messageInput) {
            this.messageInput.disabled = false;
            this.messageInput.placeholder = 'Skriv en besked...';
        }
    }

    handleDisconnect() {
        this.isConnected = false;
        this.updateConnectionStatus(false);
        
        // Deaktiver input
        if (this.messageInput) {
            this.messageInput.disabled = true;
            this.messageInput.placeholder = 'Chat ikke tilgængelig...';
        }
    }

    updateConnectionStatus(connected) {
        const statusElement = document.querySelector('.chat-status');
        if (statusElement) {
            statusElement.className = `chat-status ${connected ? 'connected' : 'disconnected'}`;
            statusElement.textContent = connected ? 'Forbundet' : 'Ikke forbundet';
        }
    }

    incrementUnreadCount() {
        this.unreadCount++;
        this.updateUnreadBadge();
    }

    resetUnreadCount() {
        this.unreadCount = 0;
        this.updateUnreadBadge();
    }

    updateUnreadBadge() {
        const badge = document.querySelector('.chat-unread-badge');
        if (badge) {
            badge.textContent = this.unreadCount || '';
            badge.style.display = this.unreadCount ? 'block' : 'none';
        }
    }

    scrollToBottom() {
        if (this.messageList) {
            this.messageList.scrollTop = this.messageList.scrollHeight;
        }
    }

    clearChat() {
        this.messages = [];
        if (this.messageList) {
            this.messageList.innerHTML = '';
        }
    }
}

// Initialiser chat manager når dokumentet er klar
document.addEventListener('DOMContentLoaded', () => {
    window.chatManager = new ChatManager();
});
