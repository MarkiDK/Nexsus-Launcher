<!DOCTYPE html>
<html lang="da">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Events - Nexus FiveM Launcher</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <div class="titlebar">
        <div class="titlebar-drag">Nexus FiveM Launcher</div>
        <div class="window-controls">
            <button class="minimize-btn">─</button>
            <button class="close-btn">✕</button>
        </div>
    </div>

    <div class="sidebar">
        <div class="logo-container">
            <img src="assets/images/logo.png" alt="Nexus Logo" class="logo">
        </div>
        <nav class="sidebar-nav">
            <a href="index.html" class="nav-item">
                <span class="nav-icon">🏠</span> Hjem
            </a>
            <a href="news.html" class="nav-item">
                <span class="nav-icon">📰</span> Nyheder
            </a>
            <a href="#" class="nav-item active">
                <span class="nav-icon">🎉</span> Events
            </a>
            <a href="navigation.html" class="nav-item">
                <span class="nav-icon">🗺️</span> Navigation
            </a>
            <a href="settings.html" class="nav-item">
                <span class="nav-icon">⚙️</span> Indstillinger
            </a>
            <a href="support.html" class="nav-item">
                <span class="nav-icon">❓</span> Support
            </a>
        </nav>
    </div>

    <main class="main-content">
        <section class="events-section">
            <div class="section-header">
                <h2>Events</h2>
                <div class="search-bar">
                    <input type="text" placeholder="Søg efter events...">
                    <button class="search-btn">🔍</button>
                </div>
            </div>
            
            <div class="event-filters">
                <button class="event-filter active">Alle</button>
                <button class="event-filter">Kommende</button>
                <button class="event-filter">Igangværende</button>
                <button class="event-filter">Afsluttede</button>
            </div>

            <div class="events-grid">
                <!-- Upcoming Event -->
                <div class="event-card">
                    <div class="event-image">
                        <img src="assets/images/events/race-event.jpg" alt="Street Race Event">
                        <span class="event-status upcoming">Kommende</span>
                    </div>
                    <div class="event-content">
                        <div class="event-date">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                                <line x1="16" y1="2" x2="16" y2="6"></line>
                                <line x1="8" y1="2" x2="8" y2="6"></line>
                                <line x1="3" y1="10" x2="21" y2="10"></line>
                            </svg>
                            25. November 2024 - 20:00
                        </div>
                        <h3 class="event-title">Street Race Championship</h3>
                        <p class="event-description">Deltag i byens største street race event! Vind eksklusive præmier og blive kronet som gadens konge.</p>
                        <div class="event-footer">
                            <div class="event-participants">
                                <div class="participant-avatars">
                                    <img src="assets/images/avatars/1.jpg" alt="Participant" class="participant-avatar">
                                    <img src="assets/images/avatars/2.jpg" alt="Participant" class="participant-avatar">
                                    <img src="assets/images/avatars/3.jpg" alt="Participant" class="participant-avatar">
                                </div>
                                <span class="participant-count">+42 deltagere</span>
                            </div>
                            <button class="event-action">Tilmeld</button>
                        </div>
                    </div>
                </div>

                <!-- Ongoing Event -->
                <div class="event-card">
                    <div class="event-image">
                        <img src="assets/images/events/heist-event.jpg" alt="Bank Heist Event">
                        <span class="event-status ongoing">Igangværende</span>
                    </div>
                    <div class="event-content">
                        <div class="event-date">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                                <line x1="16" y1="2" x2="16" y2="6"></line>
                                <line x1="8" y1="2" x2="8" y2="6"></line>
                                <line x1="3" y1="10" x2="21" y2="10"></line>
                            </svg>
                            Nu - Slutter kl. 22:00
                        </div>
                        <h3 class="event-title">Mega Bank Heist</h3>
                        <p class="event-description">Det ultimative bank røveri er i gang! Tilslut dig nu og vær med til at score kassen.</p>
                        <div class="event-footer">
                            <div class="event-participants">
                                <div class="participant-avatars">
                                    <img src="assets/images/avatars/4.jpg" alt="Participant" class="participant-avatar">
                                    <img src="assets/images/avatars/5.jpg" alt="Participant" class="participant-avatar">
                                    <img src="assets/images/avatars/6.jpg" alt="Participant" class="participant-avatar">
                                </div>
                                <span class="participant-count">+28 deltagere</span>
                            </div>
                            <button class="event-action">Deltag Nu</button>
                        </div>
                    </div>
                </div>

                <!-- Ended Event -->
                <div class="event-card">
                    <div class="event-image">
                        <img src="assets/images/events/car-show.jpg" alt="Car Show Event">
                        <span class="event-status ended">Afsluttet</span>
                    </div>
                    <div class="event-content">
                        <div class="event-date">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                                <line x1="16" y1="2" x2="16" y2="6"></line>
                                <line x1="8" y1="2" x2="8" y2="6"></line>
                                <line x1="3" y1="10" x2="21" y2="10"></line>
                            </svg>
                            20. Oktober 2024
                        </div>
                        <h3 class="event-title">Luxury Car Show</h3>
                        <p class="event-description">Se highlights fra byens største bil show. Vinderen blev kåret med sin custom Skyline GT-R.</p>
                        <div class="event-footer">
                            <div class="event-participants">
                                <div class="participant-avatars">
                                    <img src="assets/images/avatars/7.jpg" alt="Participant" class="participant-avatar">
                                    <img src="assets/images/avatars/8.jpg" alt="Participant" class="participant-avatar">
                                    <img src="assets/images/avatars/9.jpg" alt="Participant" class="participant-avatar">
                                </div>
                                <span class="participant-count">86 deltog</span>
                            </div>
                            <button class="event-action">Se Resultater</button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Pagination -->
            <div class="pagination">
                <button class="page-btn active">1</button>
                <button class="page-btn">2</button>
                <button class="page-btn">3</button>
                <span class="page-dots">...</span>
                <button class="page-btn">8</button>
            </div>
        </section>
    </main>

    <script src="events.js"></script>
</body>
</html>
