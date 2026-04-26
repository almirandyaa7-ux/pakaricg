const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbz_9ElVLqdMTQhnZoK7jdOk3kqyUYgRWJ7ghhevJx_uqEVIvKwqCOAOhX0mTh1a-gYn/exec";

// 1. Fungsi Search Bar di Home
function searchArt() {
    let input = document.getElementById('searchInput').value.toLowerCase();
    let items = document.querySelectorAll('.art-item'); 

    items.forEach(item => {
        let allText = item.innerText.toLowerCase();
        if (allText.includes(input)) {
            item.style.display = "grid"; 
        } else {
            item.style.display = "none";
        }
    });
}

// 2. Notifikasi jika user kembali dari Google Form (Opsional)
// Kamu bisa memicu ini jika menambah parameter di URL, tapi untuk sekarang:
function showHomeNotification(text) {
    const notif = document.createElement('div');
    notif.className = 'art-notification';
    notif.innerText = text;
    document.body.appendChild(notif);
    setTimeout(() => {
        notif.classList.add('fade-out');
        setTimeout(() => notif.remove(), 500);
    }, 3000);
}

async function loadTopKarya() {
    const container = document.getElementById('weekly-container');
    try {
        const response = await fetch(SCRIPT_URL);
        const data = await response.json();
        
        // AMBIL DARI WEEKLY, lalu potong jadi 3 untuk jaga-jaga
        const top3 = data.weekly.slice(0, 3); 

        container.innerHTML = ""; 
        renderTopArts(top3, 'weekly-container');
        
    } catch (err) {
        console.error(err);
    }
}
function renderTopArts(data, containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    container.innerHTML = ''; 

    data.forEach(item => {
        const card = document.createElement('div');
        card.className = 'karya-card';

        // Di dalam renderTopArts (home.js)
        card.innerHTML = `
    <div class="karya-content">
        <div class="karya-info">
            <h3 class="karya-judul">${item.judul}</h3>
            <p class="art-info-sub">Oleh ${item.nama}</p>
        </div>
        <div class="karya-badge">
            <span class="kelas-text">${item.kelas}</span>
            <a href="gallery.html?search=${encodeURIComponent(item.judul)}" class="btn-lihat">Lihat Karya</a>
        </div>
    </div>
`;
        container.appendChild(card);
    });
}
document.addEventListener('DOMContentLoaded', loadTopKarya);

// Tambahkan ini di baris paling bawah file JS kamu
document.addEventListener('mousedown', (e) => {
    if (e.target.classList.contains('btn-bounce')) {
        e.target.style.transform = "scale(0.9)";
    }
});

document.addEventListener('mouseup', (e) => {
    if (e.target.classList.contains('btn-bounce')) {
        e.target.style.transform = "scale(1)";
    }
});

// Kode ini otomatis cari link yang href-nya sama dengan URL sekarang
const currentPath = window.location.pathname.split("/").pop();
const navLinks = document.querySelectorAll('.dropdown-menu a');

navLinks.forEach(link => {
    if (link.getAttribute('href') === currentPath) {
        link.classList.add('active');
    }
});