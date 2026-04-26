const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbyU4rwTZ6PVTbnLmHEf55xi_9NfjLHUpdi5Nla1V8lsvwySCcHA-psZagY7XkU3oXn7zw/exec";

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
    // Cari containernya dulu
    const weeklyCont = document.getElementById('weekly-container');
    const monthlyCont = document.getElementById('monthly-container');

    if (weeklyCont) weeklyCont.innerHTML = "<p>Loading rank...</p>";

    try {
        const response = await fetch(SCRIPT_URL);
        const data = await response.json();

        // Panggil fungsi gambar untuk masing-masing section
        if (weeklyCont) renderTopArts(data.weekly, 'weekly-container');
        if (monthlyCont) renderTopArts(data.monthly, 'monthly-container');
        
    } catch (err) {
        console.error("Error database:", err);
        if (weeklyCont) weeklyCont.innerHTML = "<p>Gagal memuat data.</p>";
    }
}

function renderTopArts(items, containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    container.innerHTML = ""; 

    if (!items || items.length === 0) {
        container.innerHTML = "<p style='color:gray;'>Belum ada karya untuk periode ini.</p>";
        return;
    }

    items.forEach(item => {
        // Kita gunakan struktur yang sama persis dengan desainmu
        const rowHTML = `
            <div class="top-item-row">
                <div class="item-left">
                    <h3 class="item-title">${item.judul}</h3>
                    <p class="item-author">Oleh ${item.nama}</p>
                </div>
                <div class="item-divider"></div>
                <div class="item-right">
                    <span class="item-class">${item.kelas}</span>
                    <a href="gallery.html?highlight=${item.rowId}" class="btn-lihat-karya">Lihat Karya</a>
                </div>
            </div>
        `;
        container.innerHTML += rowHTML;
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