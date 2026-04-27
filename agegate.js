/**
 * XPLORE — Age Gate
 * Include script ini di semua halaman sebelum closing </body>
 * <script src="agegate.js"></script>
 */

(function () {
  const STORAGE_KEY = 'xplore_age_verified';
  const VERIFIED_VALUE = 'yes';

  // Sudah verified sebelumnya → skip
  if (localStorage.getItem(STORAGE_KEY) === VERIFIED_VALUE) return;

  // ===== Inject CSS =====
  const style = document.createElement('style');
  style.textContent = `
    #ag-overlay {
      position: fixed;
      inset: 0;
      z-index: 99999;
      background: #0a0a0f;
      display: flex;
      align-items: center;
      justify-content: center;
      font-family: 'DM Sans', sans-serif;
      padding: 20px;
    }

    #ag-box {
      background: #13131a;
      border: 1px solid rgba(255,255,255,0.07);
      border-radius: 16px;
      padding: 40px 32px;
      max-width: 420px;
      width: 100%;
      text-align: center;
      animation: ag-pop 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
    }

    @keyframes ag-pop {
      from { opacity: 0; transform: scale(0.9); }
      to   { opacity: 1; transform: scale(1); }
    }

    #ag-logo {
      font-family: 'Bebas Neue', cursive;
      font-size: 36px;
      letter-spacing: 4px;
      background: linear-gradient(135deg, #e8365d, #ff6b35);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      margin-bottom: 24px;
      display: block;
    }

    #ag-icon {
      font-size: 48px;
      margin-bottom: 16px;
      display: block;
    }

    #ag-title {
      font-size: 20px;
      font-weight: 600;
      color: #f0f0f5;
      margin-bottom: 10px;
    }

    #ag-desc {
      font-size: 13px;
      color: #6b6b80;
      line-height: 1.6;
      margin-bottom: 28px;
    }

    .ag-btn-row {
      display: flex;
      gap: 10px;
    }

    .ag-btn {
      flex: 1;
      padding: 12px;
      border-radius: 10px;
      font-family: 'DM Sans', sans-serif;
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
      border: none;
      transition: all 0.2s;
    }

    #ag-yes {
      background: #e8365d;
      color: #fff;
    }
    #ag-yes:hover { background: #c42d4f; transform: translateY(-1px); }

    #ag-no {
      background: #1c1c28;
      color: #6b6b80;
      border: 1px solid rgba(255,255,255,0.07);
    }
    #ag-no:hover { background: #242432; color: #f0f0f5; }

    #ag-disclaimer {
      font-size: 11px;
      color: #3a3a4a;
      margin-top: 20px;
      line-height: 1.5;
    }

    /* Shake animation untuk klik "No" */
    @keyframes ag-shake {
      0%, 100% { transform: translateX(0); }
      20%       { transform: translateX(-8px); }
      40%       { transform: translateX(8px); }
      60%       { transform: translateX(-5px); }
      80%       { transform: translateX(5px); }
    }
    #ag-box.shake { animation: ag-shake 0.4s ease; }
  `;
  document.head.appendChild(style);

  // ===== Inject HTML =====
  const overlay = document.createElement('div');
  overlay.id = 'ag-overlay';
  overlay.innerHTML = `
    <div id="ag-box">
      <span id="ag-logo">XPLORE</span>
      <span id="ag-icon">🔞</span>
      <div id="ag-title">Konten Dewasa</div>
      <div id="ag-desc">
        Website ini mengandung konten yang hanya ditujukan untuk orang dewasa berusia
        <strong style="color:#f0f0f5">18 tahun ke atas</strong>.
        Dengan melanjutkan, kamu menyatakan bahwa kamu memenuhi persyaratan usia tersebut.
      </div>
      <div class="ag-btn-row">
        <button class="ag-btn" id="ag-yes">✓ Ya, saya 18+</button>
        <button class="ag-btn" id="ag-no">✕ Tidak</button>
      </div>
      <div id="ag-disclaimer">
        Dengan mengklik "Ya", kamu menyetujui bahwa kamu berusia 18 tahun atau lebih
        dan bersedia melihat konten dewasa sesuai hukum yang berlaku di wilayahmu.
      </div>
    </div>
  `;
  document.body.appendChild(overlay);

  // Prevent scroll di belakang overlay
  document.body.style.overflow = 'hidden';

  // ===== Logic =====
  function verify() {
    localStorage.setItem(STORAGE_KEY, VERIFIED_VALUE);
    document.body.style.overflow = '';
    overlay.style.transition = 'opacity 0.3s';
    overlay.style.opacity = '0';
    setTimeout(() => overlay.remove(), 300);
  }

  function deny() {
    // Shake box
    const box = document.getElementById('ag-box');
    box.classList.remove('shake');
    void box.offsetWidth; // reflow biar animation re-trigger
    box.classList.add('shake');

    // Redirect ke Google setelah shake
    setTimeout(() => {
      window.location.replace('https://www.google.com');
    }, 500);
  }

  document.getElementById('ag-yes').addEventListener('click', verify);
  document.getElementById('ag-no').addEventListener('click', deny);

  // Prevent close dengan klik outside
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) {
      const box = document.getElementById('ag-box');
      box.classList.remove('shake');
      void box.offsetWidth;
      box.classList.add('shake');
    }
  });
})();