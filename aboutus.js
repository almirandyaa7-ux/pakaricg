document.addEventListener('DOMContentLoaded', () => {
    // 1. ANIMASI SAAT LOAD (Bounce Judul & Fade Deskripsi)
    const title = document.querySelector('.bounce-target');
    const desc = document.querySelector('.fade-target');

    if (title) {
        setTimeout(() => {
            title.classList.add('animate-bounce');
        }, 100);
    }

    if (desc) {
        setTimeout(() => {
            desc.classList.add('animate-fade');
        }, 600);
    }

    // 2. LOGIKA KLIK SEGITIGA (Collapse/Expand)
    const toggleBtn = document.getElementById('toggleTeamBtn');
    const panel = document.getElementById('teamContentPanel');
    const icon = toggleBtn ? toggleBtn.querySelector('i') : null;

    if (toggleBtn && panel) {
        toggleBtn.addEventListener('click', () => {
            // Munculkan atau sembunyikan panel
            panel.classList.toggle('panel-show');

            // Ganti arah ikon segitiga (atas/bawah)
            if (panel.classList.contains('panel-show')) {
                if (icon) {
                    icon.classList.remove('fa-chevron-down');
                    icon.classList.add('fa-chevron-up');
                }
                // Scroll halus ke arah konten yang terbuka
                panel.scrollIntoView({ behavior: 'smooth' });
            } else {
                if (icon) {
                    icon.classList.remove('fa-chevron-up');
                    icon.classList.add('fa-chevron-down');
                }
            }
        });
    }
});

// Tambahkan ini di dalam listener klik segitiga jika ingin scroll otomatis
panel.scrollIntoView({ behavior: 'smooth' });