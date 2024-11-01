// settings.js

document.addEventListener('DOMContentLoaded', () => {
    // Indlæs gemte indstillinger
    loadSettings();

    // Event listeners for alle toggle switches
    const toggleSwitches = document.querySelectorAll('.toggle-switch input');
    toggleSwitches.forEach(toggle => {
        toggle.addEventListener('change', handleSettingChange);
    });

    // Nulstil knap
    const resetBtn = document.querySelector('.reset-btn');
    if (resetBtn) {
        resetBtn.addEventListener('click', resetSettings);
    }

    // Gem knap
    const saveBtn = document.querySelector('.save-btn');
    if (saveBtn) {
        saveBtn.addEventListener('click', saveSettings);
    }
});

// Indlæs gemte indstillinger
async function loadSettings() {
    try {
        const settings = await window.electronAPI.getSettings();
        
        // Opdater UI med gemte indstillinger
        Object.entries(settings).forEach(([key, value]) => {
            const toggle = document.querySelector(`input[data-setting="${key}"]`);
            if (toggle) {
                toggle.checked = value;
            }
        });
    } catch (error) {
        window.nexusApp.showNotification('Kunne ikke indlæse indstillinger', 'error');
    }
}

// Håndter ændringer i indstillinger
function handleSettingChange(event) {
    const setting = event.target.dataset.setting;
    const value = event.target.checked;
    
    // Gem ændringen midlertidigt
    tempSettings[setting] = value;
    
    // Aktiver gem knappen
    const saveBtn = document.querySelector('.save-btn');
    if (saveBtn) {
        saveBtn.classList.add('active');
    }
}

// Gem indstillinger
async function saveSettings() {
    try {
        await window.electronAPI.saveSettings(tempSettings);
        window.nexusApp.showNotification('Indstillinger gemt', 'success');
        
        // Deaktiver gem knappen
        const saveBtn = document.querySelector('.save-btn');
        if (saveBtn) {
            saveBtn.classList.remove('active');
        }
    } catch (error) {
        window.nexusApp.showNotification('Kunne ikke gemme indstillinger', 'error');
    }
}

// Nulstil til standardindstillinger
async function resetSettings() {
    const confirm = await window.electronAPI.showConfirmDialog(
        'Nulstil indstillinger',
        'Er du sikker på, at du vil nulstille alle indstillinger til standard?'
    );
    
    if (confirm) {
        try {
            const defaultSettings = await window.electronAPI.getDefaultSettings();
            
            // Opdater UI
            Object.entries(defaultSettings).forEach(([key, value]) => {
                const toggle = document.querySelector(`input[data-setting="${key}"]`);
                if (toggle) {
                    toggle.checked = value;
                }
            });
            
            // Gem standardindstillingerne
            await window.electronAPI.saveSettings(defaultSettings);
            window.nexusApp.showNotification('Indstillinger nulstillet', 'success');
        } catch (error) {
            window.nexusApp.showNotification('Kunne ikke nulstille indstillinger', 'error');
        }
    }
}

// Performance indstillinger
function updatePerformanceSettings() {
    const performanceMode = document.querySelector('input[data-setting="performanceMode"]');
    if (performanceMode && performanceMode.checked) {
        // Aktiver performance optimering
        window.electronAPI.setPerformanceMode(true);
    } else {
        // Deaktiver performance optimering
        window.electronAPI.setPerformanceMode(false);
    }
}

// Cache indstillinger
async function clearCache() {
    try {
        await window.electronAPI.clearCache();
        window.nexusApp.showNotification('Cache er blevet ryddet', 'success');
    } catch (error) {
        window.nexusApp.showNotification('Kunne ikke rydde cache', 'error');
    }
}

// Midlertidige indstillinger der venter på at blive gemt
const tempSettings = {};