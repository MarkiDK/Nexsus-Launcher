// profile.js

document.addEventListener('DOMContentLoaded', () => {
    loadUserProfile();
    
    // Event listeners for profilredigering
    const editProfileBtn = document.querySelector('.edit-profile-btn');
    if (editProfileBtn) {
        editProfileBtn.addEventListener('click', toggleEditMode);
    }
    
    // Avatar upload
    const avatarInput = document.querySelector('.avatar-input');
    if (avatarInput) {
        avatarInput.addEventListener('change', handleAvatarUpload);
    }
});

async function loadUserProfile() {
    try {
        const profile = await window.electronAPI.getUserProfile();
        displayProfile(profile);
    } catch (error) {
        window.nexusApp.showNotification('Kunne ikke indlæse profil', 'error');
    }
}

function displayProfile(profile) {
    // Opdater profilbillede
    const avatar = document.querySelector('.profile-avatar');
    if (avatar) {
        avatar.src = profile.avatar || 'default-avatar.png';
    }
    
    // Opdater profilinfo
    document.querySelector('.profile-username').textContent = profile.username;
    document.querySelector('.profile-rank').textContent = profile.rank;
    document.querySelector('.profile-joined-date').textContent = 
        `Medlem siden ${formatDate(profile.joinedDate)}`;
    
    // Opdater statistikker
    document.querySelector('.playtime').textContent = 
        formatPlaytime(profile.playtime);
    document.querySelector('.events-participated').textContent = 
        profile.eventsParticipated;
    document.querySelector('.achievement-count').textContent = 
        profile.achievements.length;
        
    // Vis achievements
    displayAchievements(profile.achievements);
}

function formatPlaytime(minutes) {
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    
    if (days > 0) {
        return `${days} dage ${hours % 24} timer`;
    }
    return `${hours} timer`;
}

function displayAchievements(achievements) {
    const container = document.querySelector('.achievements-container');
    if (!container) return;
    
    container.innerHTML = achievements.map(achievement => `
        <div class="achievement-card ${achievement.unlocked ? 'unlocked' : 'locked'}">
            <img src="${achievement.icon}" alt="${achievement.name}">
            <div class="achievement-info">
                <h4>${achievement.name}</h4>
                <p>${achievement.description}</p>
                ${achievement.unlocked ? 
                    `<span class="unlock-date">Opnået ${formatDate(achievement.unlockedDate)}</span>` : 
                    '<span class="locked-text">Låst</span>'
                }
            </div>
        </div>
    `).join('');
}

function toggleEditMode() {
    const profileFields = document.querySelectorAll('.profile-field');
    const isEditing = document.body.classList.toggle('editing-profile');
    
    profileFields.forEach(field => {
        const value = field.textContent;
        if (isEditing) {
            field.innerHTML = `<input type="text" value="${value}">`;
        } else {
            field.textContent = field.querySelector('input').value;
        }
    });
    
    // Opdater knaptekst
    const editBtn = document.querySelector('.edit-profile-btn');
    if (editBtn) {
        editBtn.textContent = isEditing ? 'Gem ændringer' : 'Rediger profil';
    }
}

async function handleAvatarUpload(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    try {
        const formData = new FormData();
        formData.append('avatar', file);
        
        await window.electronAPI.uploadAvatar(formData);
        
        // Opdater avatar preview
        const avatar = document.querySelector('.profile-avatar');
        if (avatar) {
            avatar.src = URL.createObjectURL(file);
        }
        
        window.nexusApp.showNotification('Profilbillede opdateret', 'success');
    } catch (error) {
        window.nexusApp.showNotification('Kunne ikke uploade profilbillede', 'error');
    }
}
