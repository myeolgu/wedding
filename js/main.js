// =============================================
// COUNTDOWN TIMER
// =============================================
function initCountdown() {
  const target = new Date('2027-04-17T15:00:00');
  const daysEl = document.getElementById('cd-days');
  const hoursEl = document.getElementById('cd-hours');
  const minsEl = document.getElementById('cd-minutes');
  const secsEl = document.getElementById('cd-seconds');
  const ddayEl = document.getElementById('cd-dday');

  function pad(n) { return String(n).padStart(2, '0'); }

  function tick() {
    const now = new Date();
    const diff = target - now;
    if (diff <= 0) {
      if (daysEl) daysEl.textContent = '00';
      if (hoursEl) hoursEl.textContent = '00';
      if (minsEl) minsEl.textContent = '00';
      if (secsEl) secsEl.textContent = '00';
      if (ddayEl) ddayEl.textContent = '0';
      return;
    }
    const days    = Math.floor(diff / 86400000);
    const hours   = Math.floor((diff % 86400000) / 3600000);
    const minutes = Math.floor((diff % 3600000) / 60000);
    const seconds = Math.floor((diff % 60000) / 1000);

    if (daysEl)  daysEl.textContent  = pad(days);
    if (hoursEl) hoursEl.textContent = pad(hours);
    if (minsEl)  minsEl.textContent  = pad(minutes);
    if (secsEl)  secsEl.textContent  = pad(seconds);
    if (ddayEl)  ddayEl.textContent  = days;
  }
  tick();
  setInterval(tick, 1000);
}

// =============================================
// RELATIONSHIP COUNTER
// =============================================
function initRelationshipCounter() {
  const start = new Date('2025-02-23T00:00:00');
  const daysEl = document.getElementById('relationship-days');
  if (!daysEl) return;

  function update() {
    const now = new Date();
    const diff = now - start;
    const days = Math.floor(diff / 86400000) + 1; // 오늘을 1일로 계산하려면 +1
    daysEl.textContent = days.toLocaleString();
  }
  update();
}

// =============================================
// GALLERY LIGHTBOX
// =============================================
function initGallery() {
  const grid     = document.getElementById('gallery-grid');
  const lightbox = document.getElementById('lightbox');
  const lbImg    = document.getElementById('lightbox-img');
  const lbClose  = document.getElementById('lightbox-close');
  const lbPrev   = document.getElementById('lightbox-prev');
  const lbNext   = document.getElementById('lightbox-next');
  const moreBtn  = document.getElementById('gallery-more-btn');

  if (!grid || !lightbox) return;

  const cells = Array.from(grid.querySelectorAll('.gallery__cell'));
  let current = 0;

  function open(idx) {
    current = idx;
    const img = cells[idx].querySelector('img');
    lbImg.src = img.src;
    lbImg.alt = img.alt;
    lightbox.classList.add('active');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }
  function close() {
    lightbox.classList.remove('active');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }
  function prev() { open((current - 1 + cells.length) % cells.length); }
  function next() { open((current + 1) % cells.length); }

  cells.forEach((cell, i) => cell.addEventListener('click', () => open(i)));
  lbClose.addEventListener('click', close);
  lbPrev.addEventListener('click', prev);
  lbNext.addEventListener('click', next);
  lightbox.addEventListener('click', (e) => { if (e.target === lightbox) close(); });

  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('active')) return;
    if (e.key === 'Escape')      close();
    if (e.key === 'ArrowLeft')   prev();
    if (e.key === 'ArrowRight')  next();
  });

  if (moreBtn) {
    moreBtn.addEventListener('click', () => {
      moreBtn.style.display = 'none';
    });
  }
}

// =============================================
// ACCOUNT ACCORDION
// =============================================
function initAccordion() {
  document.querySelectorAll('.account__acc-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const expanded = btn.getAttribute('aria-expanded') === 'true';
      const contentId = btn.getAttribute('aria-controls');
      const content = document.getElementById(contentId);
      btn.setAttribute('aria-expanded', String(!expanded));
      if (content) {
        if (expanded) { content.hidden = true; }
        else { content.hidden = false; }
      }
    });
  });
}

// =============================================
// COPY ACCOUNT NUMBER
// =============================================
function initCopy() {
  document.querySelectorAll('.account__copy').forEach(btn => {
    btn.addEventListener('click', () => {
      const num = btn.dataset.account;
      navigator.clipboard.writeText(num).then(() => {
        const orig = btn.textContent;
        btn.textContent = '복사됨!';
        setTimeout(() => { btn.textContent = orig; }, 1500);
      }).catch(() => {
        const ta = document.createElement('textarea');
        ta.value = num;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
        const orig = btn.textContent;
        btn.textContent = '복사됨!';
        setTimeout(() => { btn.textContent = orig; }, 1500);
      });
    });
  });
}

// =============================================
// GUESTBOOK
// =============================================
function initGuestbook() {
  const writeBtn  = document.getElementById('guestbook-write-btn');
  const form      = document.getElementById('guestbook-form');
  const submitBtn = document.getElementById('guestbook-submit');
  const list      = document.getElementById('guestbook-list');

  if (!writeBtn || !form) return;

  writeBtn.addEventListener('click', () => {
    form.hidden = !form.hidden;
    if (!form.hidden) {
      document.getElementById('guestbook-name').focus();
    }
  });

  if (submitBtn) {
    submitBtn.addEventListener('click', () => {
      const name = document.getElementById('guestbook-name').value.trim();
      const msg  = document.getElementById('guestbook-msg').value.trim();
      if (!name || !msg) { alert('이름과 메시지를 입력해주세요.'); return; }

      const now = new Date();
      const dateStr = `${now.getFullYear()}.${String(now.getMonth()+1).padStart(2,'0')}.${String(now.getDate()).padStart(2,'0')} ${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}`;

      const item = document.createElement('div');
      item.className = 'guestbook__item';
      item.innerHTML = `
        <button class="guestbook__delete" aria-label="삭제">✕</button>
        <p class="guestbook__text">${msg.replace(/\n/g, '<br />')}</p>
        <p class="guestbook__from">From <strong>${name}</strong> <span class="guestbook__date">${dateStr}</span></p>
      `;
      item.querySelector('.guestbook__delete').addEventListener('click', () => {
        if (confirm('삭제하시겠습니까?')) item.remove();
      });
      list.prepend(item);

      document.getElementById('guestbook-name').value = '';
      document.getElementById('guestbook-msg').value = '';
      document.getElementById('guestbook-pw').value = '';
      form.hidden = true;
    });
  }

  // existing delete buttons
  list.querySelectorAll('.guestbook__delete').forEach(btn => {
    btn.addEventListener('click', () => {
      if (confirm('삭제하시겠습니까?')) btn.closest('.guestbook__item').remove();
    });
  });
}

// =============================================
// PETAL ANIMATION (dynamic creation)
// =============================================
function initPetals() {
  const wrap = document.querySelector('.hero__petals');
  if (!wrap) return;
  // petals are CSS-driven, nothing extra needed
}

// =============================================
// SCROLL FADE-IN
// =============================================
function initScrollReveal() {
  const els = document.querySelectorAll(
    '.sec-greeting, .sec-calendar, .sec-family, .sec-about, .sec-timeline, .sec-gallery, .sec-location, .sec-account, .sec-guestbook'
  );
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08 });

  els.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(32px)';
    el.style.transition = 'opacity 0.7s ease, transform 0.7s ease';
    observer.observe(el);
  });
}

// =============================================
// INTRO OVERLAY
// =============================================
function initIntro() {
  const overlay = document.getElementById('intro-overlay');
  const textEl = document.getElementById('intro-text');
  if (!overlay || !textEl) return;

  // 진입 시 최상단으로 스크롤 고정 및 스크롤 금지
  window.scrollTo(0, 0);
  document.body.style.overflow = 'hidden';

  const message = "우리의 결혼식에 환영합니다";
  let idx = 0;

  function type() {
    if (idx < message.length) {
      textEl.textContent += message.charAt(idx);
      idx++;
      setTimeout(type, 120);
    } else {
      setTimeout(() => {
        textEl.style.borderRight = 'none';
      }, 1000);
    }
  }

  setTimeout(type, 500);

  setTimeout(() => {
    overlay.classList.add('bg-show');
  }, 1000);

  // 인트로 페이드 아웃 및 스크롤 허용
  setTimeout(() => {
    overlay.classList.add('fade-out');
    document.body.style.overflow = '';
  }, 4500);
}

// =============================================
// INIT
// =============================================
document.addEventListener('DOMContentLoaded', () => {
  // 폰트가 완전히 로드될 때까지 기다린 후 실행
  document.fonts.ready.then(() => {
    document.body.style.opacity = '1';
    initIntro();
    initCountdown();
    initRelationshipCounter();
    initGallery();
    initAccordion();
    initCopy();
    initGuestbook();
    initPetals();
    initScrollReveal();
  });
});
