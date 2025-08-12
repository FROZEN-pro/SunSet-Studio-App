import contentData from './config.js';

// Global variables
let currentMainTab = 'multfilm';
let currentSection = 'trending';
let allContent = []; // Barcha kontentlar uchun massiv
let favourites = []; // Sevimlilar ro'yxati
let currentContent = null; // Hozirgi kontent

// Initialize when page loads
window.onload = function() {
    checkLogin();
    loadAllContent();
    loadContent(); // Boshlang'ich kontentni yuklash

    // Boshlang'ich holat: main sahifa
    showPage('main');
};

// Handle login
function handleLogin() {
    const nameInput = document.getElementById('nameInput');
    const name = nameInput.value.trim();
    
    if (name.length === 0) {
        alert('Iltimos, ismingizni kiriting!');
        nameInput.focus();
        return;
    }

    if (name.length < 2) {
        alert('Ism kamida 2 ta belgidan iborat bo\'lishi kerak!');
        nameInput.focus();
        return;
    }

    // Save user data
    localStorage.setItem('userName', name);
    
    // Update profile name
    document.getElementById('profileName').textContent = name;
    
    // Hide login screen and show app
    document.getElementById('loginScreen').style.display = 'none';
    document.getElementById('appContainer').style.display = 'block';
    
    // Load initial content
    loadContent();
}

// Check if user is already logged in
function checkLogin() {
    const savedName = localStorage.getItem('userName');
    if (savedName && savedName.trim().length > 0) {
        document.getElementById('profileName').textContent = savedName;
        document.getElementById('loginScreen').style.display = 'none';
        document.getElementById('appContainer').style.display = 'block';
        showPage('main');
        loadContent();
    }
}

// Switch main tabs
function switchMainTab(tab, element) {
    // Update tab appearance
    document.querySelectorAll('.nav-tab').forEach(t => t.classList.remove('active'));
    element.classList.add('active');
    
    currentMainTab = tab;
    loadContent();
}

// Switch section tabs
function switchSectionTab(section, element) {
    // Update tab appearance
    document.querySelectorAll('.section-tab').forEach(t => t.classList.remove('active'));
    element.classList.add('active');
    
    // Animate content change
    const grid = document.getElementById('contentGrid');
    grid.classList.add('slide-out');
    
    setTimeout(() => {
        currentSection = section;
        loadContent();
        grid.classList.remove('slide-out');
    }, 200);
}

   // Show page
function showPage(page) {
    // Headerni ko'rsatish/yashirish
    const mainHeader = document.getElementById('mainHeader');
    if (page === 'main') {
        mainHeader.style.display = 'flex';
    } else {
        mainHeader.style.display = 'none';
    }

    // Update bottom nav
    document.querySelectorAll('.bottom-nav-item').forEach(item => {
        item.classList.remove('active');
    });
    
    if (page === 'main') {
        document.querySelectorAll('.bottom-nav-item')[0].classList.add('active');
    } else if (page === 'favourites') {
        document.querySelectorAll('.bottom-nav-item')[1].classList.add('active');
    } else if (page === 'profile') {
        document.querySelectorAll('.bottom-nav-item')[2].classList.add('active');
    }

    // Hide all page sections
    document.querySelectorAll('.page-section').forEach(section => {
                           section.classList.remove('active');
    });

    // Show selected page
    const pageElement = document.getElementById(page + 'Page');
    if (pageElement) {
        pageElement.classList.add('active');
    }

    // Load content for specific pages
    if (page === 'favourites') {
        loadFavourites();
    }
}

// Load content into grid
function loadContent() {
    const grid = document.getElementById('contentGrid');
    let data = contentData[currentMainTab][currentSection];

    grid.innerHTML = data.map(item => createContentItem(item)).join('');
}

// Create content item HTML
function createContentItem(item) {
    return `
        <div class="content-item" onclick="showContentDetails(${item.id})">
            <img src="${item.imageUrl}" alt="${item.title}" class="content-image">
            <div class="content-info">
                <div class="content-title">${item.title}</div>
                <div class="content-meta">
                    <span>${item.year}</span>
                    <span class="content-rating">⭐ ${item.rating}</span>
                </div>
            </div>
        </div>
    `;
}

// Show content details
function showContentDetails(contentId) {
    currentContent = allContent.find(item => item.id === contentId);

    if (currentContent) {
        document.getElementById('contentDetailsTitle').textContent = currentContent.title;
        document.getElementById('contentDetailsDescription').textContent = currentContent.description;
        // YouTube player manzilini yangilash
        const player = document.querySelector('#contentDetailsModal .youtube-player iframe');
        player.src = currentContent.videoUrl;
        showModal('contentDetailsModal');
    }
}

// Toggle like
function toggleLike() {
    if (currentContent) {
        const index = favourites.findIndex(item => item.id === currentContent.id);
        if (index === -1) {
            favourites.push(currentContent);
            alert('Sevimli kontentga qo\'shildi!');
        } else {
            favourites.splice(index, 1);
            alert('Sevimli kontentdan olib tashlandi!');
        }
        loadFavourites(); // Sevimlilar sahifasini yangilash
    }
}

// Watch content
function watchContent() {
    // Keyinroq funksiyani qo'shamiz
    alert('Watch funksiyasi keyinroq qo\'shiladi!');
}

// Load favourites
function loadFavourites() {
    const favouritesGrid = document.getElementById('favouritesGrid');
    favouritesGrid.innerHTML = favourites.map(item => createContentItem(item)).join('');
}

// Show modal
function showModal(modalId) {
    document.getElementById(modalId).style.display = 'block';
}

// Close modal
function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}

// Handle logout
function handleLogout() {
    if (confirm('Haqiqatan ham chiqmoqchimisiz?')) {
        localStorage.removeItem('userName');
        document.getElementById('appContainer').style.display = 'none';
        document.getElementById('loginScreen').style.display = 'flex';
        document.getElementById('nameInput').value = '';
    }
}

// Handle Enter key in login input
document.addEventListener('DOMContentLoaded', function() {
    const nameInput = document.getElementById('nameInput');
    if (nameInput) {
        nameInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                handleLogin();
            }
        });
    }
});

// Close modals when clicking outside
window.onclick = function(event) {
    if (event.target.classList.contains('modal')) {
        event.target.style.display = 'none';
    }
}

// Barcha kontentlarni yuklash
function loadAllContent() {
    for (let tab in contentData) {
        for (let section in contentData[tab]) {
            allContent = allContent.concat(contentData[tab][section]);
        }
    }
}

// Qidiruvni amalga oshirish
function handleSearch() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const filteredContent = allContent.filter(item => item.title.toLowerCase().includes(searchTerm));
    displaySearchResults(filteredContent);
}

// Qidiruv natijalarini ko'rsatish
function displaySearchResults(results) {
    const grid = document.getElementById('contentGrid');
    grid.innerHTML = results.map(item => createContentItem(item)).join('');
}