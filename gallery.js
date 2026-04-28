const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbyC1vgRiVg89W0KYfN51SsUqusy7dGu9OyMJG5CXkT-4XcDEiEfpsAjrgNFslBlA-fgXQ/exec";

// 1. Pemasangan Event Listener Global (Anti-Hilang)
document.addEventListener('DOMContentLoaded', () => {
    loadGallery();
    
    const modal = document.getElementById('imageModal');
    const closeBtn = document.getElementById('closeModal');

    if (closeBtn) {
        closeBtn.onclick = function() {
            modal.style.display = "none";
            document.body.style.overflow = "auto";
        };
    }

    window.onclick = function(event) {
        if (event.target === modal) {
            modal.style.display = "none";
            document.body.style.overflow = "auto";
        }
    };
});

// 2. Fungsi Buka Modal (Global)
function openLightbox(src) {
    const modal = document.getElementById('imageModal');
    const modalImg = document.getElementById('imgFull');
    if (modal && modalImg) {
        modalImg.src = src;
        modal.style.display = "flex";
        document.body.style.overflow = "hidden";
    }
}

// 3. Render Gallery
async function loadGallery() {
    const container = document.querySelector('.art-grid');
    if(!container) return;
    
    container.innerHTML = "<p style='grid-column:1/-1; text-align:center; color:white;'>Memuat Karya...</p>";

    try {
        const response = await fetch(SCRIPT_URL);
        const data = await response.json();
        container.innerHTML = ""; 

        data.all.forEach(item => {
            let fileId = "";
            try {
                fileId = item.driveUrl.split('id=')[1] || item.driveUrl.split('/d/')[1].split('/')[0];
            } catch(e) { console.error("URL Salah:", item.driveUrl); }
            
            const thumbImg = `https://lh3.googleusercontent.com/d/${fileId}`;

            // Bangun HTML Komentar
            const commentListHtml = (item.comments || []).map(c => `
                <div class="each-comment">
                    <span style="color: #ff4757; font-weight: bold;">${c.user}</span>: ${c.text}
                </div>
            `).join('');

            const card = `
                <div class="art-card">
                    <div class="card-img-container">
                        <img src="${thumbImg}" class="cover-img" loading="lazy" onerror="this.src='https://via.placeholder.com/300x400?text=Gambar+Privat'">
                    </div>
                    <div class="card-content">
                        <h3 class="art-title-bold">${item.judul}</h3>
                        <p class="art-info-sub">${item.nama} | ${item.kelas}</p>
                        
                        <div class="card-action">
                            <div style="display: flex; gap: 15px;">
                                <button class="btn-like ${localStorage.getItem('liked_'+item.id) ? 'liked' : ''}" onclick="handleLike('${item.id}', this)">
                                    <i class="${localStorage.getItem('liked_'+item.id) ? 'fa-solid' : 'fa-regular'} fa-heart"></i> 
                                    <span class="like-count">${item.likes}</span>
                                </button>
                                
                                <button class="btn-comment-toggle" style="background:none; border:none; color:white; cursor:pointer;" onclick="toggleComment('${item.id}')">
                                    <i class="fa-regular fa-comment"></i>
                                    <span>${item.comments ? item.comments.length : 0}</span>
                                </button>
                            </div>
                            
                            <button class="btn-lihat" onclick="openLightbox('${thumbImg}')">Lihat Full</button>
                        </div>

                        <div id="comment-area-${item.id}" class="comment-section" style="display: none; margin-top: 15px; background: rgba(255,255,255,0.05); padding: 10px; border-radius: 8px;">
                            <div class="comment-list" style="max-height: 100px; overflow-y: auto; font-size: 0.85rem; margin-bottom: 10px;">
                                ${commentListHtml || '<p style="font-size: 0.7rem; color: #888;">Belum ada komentar.</p>'}
                            </div>
                            <div class="comment-box" style="display: flex; gap: 5px;">
                                <input type="text" id="input-${item.id}" placeholder="Tulis komentar..." style="flex: 1; background: #000; border: 1px solid #333; color: white; padding: 5px; border-radius: 4px; font-size: 0.8rem;">
                                <button onclick="submitComment('${item.id}')" style="background: #ff4757; border: none; color: white; padding: 5px 10px; border-radius: 4px; cursor: pointer; font-size: 0.8rem;">Kirim</button>
                            </div>
                        </div>
                    </div>
                </div>`;
            container.innerHTML += card;
        });
    } catch (err) {
        container.innerHTML = "<p style='color:red;'>Gagal konek.</p>";
    }
}

// 4. Fungsi Like
async function handleLike(id, btn) {
    if (localStorage.getItem('liked_' + id)) return;
    const countSpan = btn.querySelector('.like-count');
    const icon = btn.querySelector('i');
    let current = parseInt(countSpan.innerText) || 0;

    countSpan.innerText = current + 1;
    icon.className = "fa-solid fa-heart";
    icon.style.color = "#ff4757";
    btn.style.pointerEvents = 'none';

    try {
        await fetch(`${SCRIPT_URL}?action=like&id=${encodeURIComponent(id)}`);
        localStorage.setItem('liked_' + id, 'true');
    } catch (e) {
        countSpan.innerText = current;
        icon.className = "fa-regular fa-heart";
        btn.style.pointerEvents = 'auto';
    }
}

// 5. Fungsi Search
let searchTimer;
function searchArt() {
    clearTimeout(searchTimer);
    const inputElemen = document.getElementById('searchInput');
    if (!inputElemen) return; 
    const filter = inputElemen.value.toLowerCase().trim();

    searchTimer = setTimeout(() => {
        const cards = document.querySelectorAll('.art-card');
        cards.forEach(card => {
            const isiKartu = card.innerText.toLowerCase();
            card.style.display = isiKartu.includes(filter) ? "" : "none";
        });
    }, 250);
}

// --- FITUR BARU: KOMENTAR ---

function toggleComment(id) {
    const area = document.getElementById(`comment-area-${id}`);
    area.style.display = area.style.display === "none" ? "block" : "none";
}

async function submitComment(id) {
    const input = document.getElementById(`input-${id}`);
    const text = input.value.trim();
    if (!text) return;

    const user = prompt("Masukkan namamu:") || "Anonim";

    try {
        const res = await fetch(`${SCRIPT_URL}?action=comment&id=${encodeURIComponent(id)}&text=${encodeURIComponent(text)}&user=${encodeURIComponent(user)}`);
        const result = await res.json();
        if (result.result === "success") {
            input.value = "";
            loadGallery(); // Refresh tampilan
        }
    } catch (e) {
        alert("Gagal mengirim komentar.");
    }
}