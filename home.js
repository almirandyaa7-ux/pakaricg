const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbz_9ElVLqdMTQhnZoK7jdOk3kqyUYgRWJ7ghhevJx_uqEVIvKwqCOAOhX0mTh1a-gYn/exec";

async function loadTopKarya() {
    try {
        const response = await fetch(SCRIPT_URL);
        const data = await response.json();
        
        // Render Weekly (Top 3)
        renderTopArts(data.weekly.slice(0, 3), 'weekly-container');
        
        // Render Monthly (Top 3) - Pastikan data.monthly ada di JSON kamu
        if(data.monthly) {
            renderTopArts(data.monthly.slice(0, 3), 'monthly-container');
        }
        
    } catch (err) {
        console.error("Gagal memuat data:", err);
    }
}

function renderTopArts(data, containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    container.innerHTML = ''; 

    data.forEach(item => {
        const card = document.createElement('div');
        card.className = 'karya-card';
        card.innerHTML = `
    <div class="karya-info">
        <h3 class="karya-judul" style="margin:0; color:white; font-weight:800;">${item.judul}</h3>
        <p class="art-info-sub" style="margin:5px 0 0 0; color:rgba(255,255,255,0.6); font-size:0.9rem;">Oleh ${item.nama}</p>
    </div>
    <div class="karya-badge">
        <span class="kelas-text" style="font-weight:bold; color:white;">${item.kelas}</span>
        <a href="gallery.html?search=${encodeURIComponent(item.judul)}" class="btn-lihat">Lihat Karya</a>
    </div>
`;
        container.appendChild(card);
    });
}

// Inisialisasi
document.addEventListener('DOMContentLoaded', () => {
    loadTopKarya();
    
    // Pastikan link Home aktif jika URL sesuai
    const currentPath = window.location.pathname.split("/").pop() || "index.html";
    document.querySelectorAll('.nav-link').forEach(link => {
        if (link.getAttribute('href') === currentPath) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
});