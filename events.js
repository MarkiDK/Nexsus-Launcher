// events.js

document.addEventListener('DOMContentLoaded', () => {
    loadEvents();
    initializeCalendar();
    
    // Event listeners for filtreringsknapper
    const filterButtons = document.querySelectorAll('.event-filter-btn');
    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => filterEvents(btn.dataset.type));
    });
});

async function loadEvents() {
    try {
        const events = await window.electronAPI.getEvents();
        displayEvents(events);
    } catch (error) {
        window.nexusApp.showNotification('Kunne ikke indlæse begivenheder', 'error');
    }
}

function displayEvents(events) {
    const eventsContainer = document.querySelector('.events-container');
    if (!eventsContainer) return;

    eventsContainer.innerHTML = ''; // Ryd eksisterende events

    events.forEach(event => {
        const eventCard = createEventCard(event);
        eventsContainer.appendChild(eventCard);
    });
}

function createEventCard(event) {
    const card = document.createElement('div');
    card.className = 'event-card';
    card.dataset.type = event.type;
    
    const startTime = new Date(event.startTime);
    const endTime = new Date(event.endTime);
    
    card.innerHTML = `
        <img src="${event.banner}" alt="${event.title}" class="event-banner">
        <div class="event-details">
            <div class="event-date">${formatEventDate(startTime, endTime)}</div>
            <h3 class="event-title">${event.title}</h3>
            <div class="event-location">
                <i class="location-icon"></i>
                ${event.location}
            </div>
            <p class="event-description">${event.description}</p>
            <div class="event-meta">
                <span class="event-type">${event.type}</span>
                <span class="event-participants">
                    ${event.currentParticipants}/${event.maxParticipants} deltagere
                </span>
            </div>
            <button class="join-event-btn" data-event-id="${event.id}">
                ${event.isJoined ? 'Forlad event' : 'Deltag i event'}
            </button>
        </div>
    `;

    // Tilføj event listener til deltag/forlad knap
    const joinBtn = card.querySelector('.join-event-btn');
    joinBtn.addEventListener('click', () => toggleEventParticipation(event.id, joinBtn));

    return card;
}

function formatEventDate(start, end) {
    const sameDay = start.toDateString() === end.toDateString();
    
    if (sameDay) {
        return `${start.toLocaleDateString('da-DK', { 
            day: 'numeric',
            month: 'long'
        })} ${start.toLocaleTimeString('da-DK', { 
            hour: '2-digit',
            minute: '2-digit'
        })} - ${end.toLocaleTimeString('da-DK', { 
            hour: '2-digit',
            minute: '2-digit'
        })}`;
    }
    
    return `${start.toLocaleDateString('da-DK', { 
        day: 'numeric',
        month: 'long'
    })} - ${end.toLocaleDateString('da-DK', { 
        day: 'numeric',
        month: 'long'
    })}`;
}

async function toggleEventParticipation(eventId, button) {
    try {
        const isJoined = button.textContent.includes('Forlad');
        const action = isJoined ? 'leaveEvent' : 'joinEvent';
        
        await window.electronAPI[action](eventId);
        
        // Opdater knappen
        button.textContent = isJoined ? 'Deltag i event' : 'Forlad event';
        
        // Opdater deltagerantal
        const card = button.closest('.event-card');
        const participantsElement = card.querySelector('.event-participants');
        const [current, max] = participantsElement.textContent.split('/');
        
        const newCount = isJoined ? 
            parseInt(current) - 1 : 
            parseInt(current) + 1;
            
        participantsElement.textContent = `${newCount}/${max} deltagere`;
        
        // Vis bekræftelse
        window.nexusApp.showNotification(
            isJoined ? 'Du har forladt eventet' : 'Du deltager nu i eventet',
            'success'
        );
    } catch (error) {
        window.nexusApp.showNotification('Der skete en fejl', 'error');
    }
}

function filterEvents(type) {
    const cards = document.querySelectorAll('.event-card');
    
    cards.forEach(card => {
        if (type === 'all' || card.dataset.type === type) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}

function initializeCalendar() {
    const calendar = document.querySelector('.calendar');
    if (!calendar) return;

    // Implementer kalender logik her
    // Dette kunne være med et bibliotek som FullCalendar
    // eller en custom implementation
}

// Eksporter funktioner der skal være tilgængelige i andre filer
window.eventsApp = {
    refreshEvents: loadEvents,
    filterEvents: filterEvents
};
