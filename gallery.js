

const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbz_9ElVLqdMTQhnZoK7jdOk3kqyUYgRWJ7ghhevJx_uqEVIvKwqCOAOhX0mTh1a-gYn/exec";

document.addEventListener('DOMContentLoaded', loadGallery);

async function loadGallery() {
    const container = document.querySelector('.art-grid');
    container.innerHTML = "<p style='grid-column:1/-1; text-align:center;'>Menghubungkan ke Database...</p>";

    try {
        const response = await fetch(SCRIPT_URL);
        const data = await response.json();
        
        container.innerHTML = ""; 

        // AMBIL DARI LACI "all"
        const listKarya = data.all; 

        if (listKarya && listKarya.length > 0) {
            listKarya.forEach((item, index) => {
                // Ekstrak ID Gambar dari URL Drive
                const fileId = item.driveUrl.split('id=')[1] || item.driveUrl.split('/d/')[1].split('/')[0];
                // Menggunakan thumbnail resolusi tinggi agar lebih enteng & muncul
                const directImg = `https://lh3.googleusercontent.com/u/0/d/${fileId}=w1000`;

                const card = `
                    <div class="art-card">
                        <div class="card-img-container">
                            <img src="${directImg}" alt="${item.judul}" class="cover-img" onerror="this.src='https://via.placeholder.com/300x400?text=Gambar+Privat'">
                        </div>
                        <div class="card-content">
                            <h3 class="art-title-bold">${item.judul}</h3>
                            <p class="art-info-sub">Oleh ${item.nama}</p>
                            <p class="art-info-sub">Kelas ${item.kelas}</p>
                            
                            <div class="card-action">
                                <button id="btn-karya-${index}" class="btn-like" onclick="handleLike(${item.rowId}, 'karya-${index}')">
                                    <i class="${localStorage.getItem('liked_row_' + item.rowId) ? 'fa-solid' : 'fa-regular'} fa-heart" 
                                       style="${localStorage.getItem('liked_row_' + item.rowId) ? 'color:#ff4757' : ''}"></i> 
                                    <span id="count-karya-${index}">${item.likes}</span>
                                </button>
                                <button class="btn-lihat" onclick="openLightbox('${directImg}')">Lihat Full</button>
                            </div>
                        </div>
                    </div>
                `;
                container.innerHTML += card;
            });
        } else {
            container.innerHTML = "<p style='grid-column:1/-1; text-align:center;'>Belum ada karya untuk ditampilkan.</p>";
        }
    } catch (err) {
        console.error("Gallery Error:", err);
        container.innerHTML = "<p style='grid-column:1/-1; text-align:center; color:red;'>Gagal memuat gallery. Cek koneksi atau URL Script.</p>";
    }
}

// 2. Fungsi Like Permanen ke Database
async function handleLike(rowId, elementId) {
    const counter = document.getElementById('count-' + elementId);
    const icon = document.querySelector(`#btn-${elementId} i`);
    
    const isLiked = localStorage.getItem('liked_row_' + rowId);
    let action = isLiked ? 'removeLike' : 'addLike';

    // 1. Kirim ke Database
    fetch(SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        body: JSON.stringify({ action: action, rowId: rowId })
    });

    // 2. Update UI & LocalStorage
    let currentCount = parseInt(counter.innerText);
    if (!isLiked) {
        // Proses Like
        counter.innerText = currentCount + 1;
        icon.classList.replace('fa-regular', 'fa-solid');
        icon.style.color = '#ff4757';
        localStorage.setItem('liked_row_' + rowId, 'true');
        showNotification("Disukai!");
    } else {
        // Proses Unlike
        counter.innerText = Math.max(0, currentCount - 1);
        icon.classList.replace('fa-solid', 'fa-regular');
        icon.style.color = ''; // Balik ke warna asli
        localStorage.removeItem('liked_row_' + rowId);
        showNotification("Batal menyukai");
    }
}

// 3. Fungsi Search Bar di Gallery
function searchArt() {
    let input = document.getElementById('searchInput').value.toLowerCase();
    let cards = document.querySelectorAll('.art-card'); 

    cards.forEach(card => {
        if (card.innerText.toLowerCase().includes(input)) {
            card.style.display = "block"; 
        } else {
            card.style.display = "none";
        }
    });
}

// 4. Fitur Lightbox (Lihat Gambar Full)
// 1. Ambil elemen modal
const modal = document.getElementById('imageModal');
const modalImg = document.getElementById('imgFull');
const closeBtn = document.getElementById('closeModal');

// 2. Fungsi untuk membuka modal (panggil ini saat gambar/tombol 'lihat' diklik)
function openLightbox(src) {
    modal.style.display = "flex";
    modalImg.src = src;
}

// 3. Fungsi tutup modal
function closeLightbox() {
    modal.style.display = "none";
    modalImg.src = ""; // Bersihkan src biar gak berat
}

// Event listener buat tombol tutup dan klik di area gelap
closeBtn.onclick = closeLightbox;
modal.onclick = (e) => {
    if (e.target === modal) closeLightbox();
};

// 4. INTEGRASI KE DATA GOOGLE SHEETS
// Di dalam loop data Sheets kamu, tambahkan event listener ke gambar:
// Contoh:
// imgElement.onclick = () => openLightbox(directLink);

// 5. Fungsi Notifikasi (Sesuai permintaan)
function showNotification(text) {
    const oldNotif = document.querySelector('.art-notification');
    if (oldNotif) oldNotif.remove();

    const notif = document.createElement('div');
    notif.className = 'art-notification';
    notif.innerText = text;
    document.body.appendChild(notif);

    setTimeout(() => {
        notif.classList.add('fade-out');
        setTimeout(() => notif.remove(), 500);
    }, 2000);
}

window.addEventListener('DOMContentLoaded', () => {
    const title = document.querySelector('.bounce-target');
    const desc = document.querySelector('.fade-target');

    // Kasih sedikit delay biar gak kaget
    setTimeout(() => {
        if(title) title.classList.add('animate-bounce');
    }, 100);

    setTimeout(() => {
        if(desc) desc.classList.add('animate-fade');
    }, 600); // Deskripsi muncul belakangan
});

// Kode ini otomatis cari link yang href-nya sama dengan URL sekarang
const currentPath = window.location.pathname.split("/").pop();
const navLinks = document.querySelectorAll('.dropdown-menu a');

navLinks.forEach(link => {
    if (link.getAttribute('href') === currentPath) {
        link.classList.add('active');
    }
});

// Jalankan ini setiap halaman Gallery dibuka
window.addEventListener('DOMContentLoaded', () => {
    // 1. Cek apakah ada parameter 'search' di URL
    const urlParams = new URLSearchParams(window.location.search);
    const searchQuery = urlParams.get('search');

    if (searchQuery) {
        // 2. Tunggu sebentar sampai data gallery selesai dimuat
        setTimeout(() => {
            const searchInput = document.getElementById('searchInput');
            if (searchInput) {
                searchInput.value = searchQuery; // Masukkan judul ke kotak search
                searchArt(); // Jalankan fungsi cari otomatis
            }
        }, 1500); // Delay 1.5 detik biar data database muncul dulu
    }
});