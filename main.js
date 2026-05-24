/* =========================================================
   GOAT STUDIO — Global JavaScript
   ========================================================= */

(function () {
  'use strict';

  /* -------------------------------------------------------
      CUSTOM CURSOR
  ------------------------------------------------------- */
  const cursor     = document.querySelector('.cursor');
  const cursorRing = document.querySelector('.cursor-ring');

  if (cursor && cursorRing) {
    let mouseX = 0, mouseY = 0;
    let ringX  = 0, ringY  = 0;

    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      cursor.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%, -50%)`;
    });

    function animRing() {
      ringX += (mouseX - ringX) * 0.12;
      ringY += (mouseY - ringY) * 0.12;
      cursorRing.style.transform = `translate(${ringX}px, ${ringY}px) translate(-50%, -50%)`;
      requestAnimationFrame(animRing);
    }
    animRing();

    document.addEventListener('mouseleave', () => {
      cursor.style.opacity = '0';
      cursorRing.style.opacity = '0';
    });
    document.addEventListener('mouseenter', () => {
      cursor.style.opacity = '1';
      cursorRing.style.opacity = '1';
    });
  }

  /* -------------------------------------------------------
      NAVBAR — scroll state & hamburger
  ------------------------------------------------------- */
  const nav         = document.querySelector('.nav');
  const hamburger   = document.querySelector('.nav__hamburger');
  const mobileMenu  = document.querySelector('.nav__mobile');
  const mobileLinks = document.querySelectorAll('.nav__mobile .nav__link, .nav__mobile .nav__cta');

  if (nav) {
    window.addEventListener('scroll', () => {
      nav.classList.toggle('scrolled', window.scrollY > 30);
    }, { passive: true });
  }

  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      const isOpen = hamburger.classList.toggle('open');
      mobileMenu.classList.toggle('open', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('open');
        mobileMenu.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  /* -------------------------------------------------------
      ACTIVE NAV LINK (by page)
  ------------------------------------------------------- */
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav__link').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  /* -------------------------------------------------------
      SCROLL REVEAL
  ------------------------------------------------------- */
  const revealElements = document.querySelectorAll('.reveal');

  if (revealElements.length) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });

    revealElements.forEach(el => observer.observe(el));
  }

  /* -------------------------------------------------------
      SMOOTH COUNTER ANIMATION
  ------------------------------------------------------- */
  function animateCounter(el) {
    const target = parseInt(el.getAttribute('data-target'), 10);
    const suffix = el.getAttribute('data-suffix') || '';
    const duration = 1600;
    const startTime = performance.now();

    function update(now) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 4);
      el.textContent = Math.floor(ease * target) + suffix;
      if (progress < 1) requestAnimationFrame(update);
    }
    requestAnimationFrame(update);
  }

  const counterEls = document.querySelectorAll('[data-target]');
  if (counterEls.length) {
    const counterObs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          counterObs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    counterEls.forEach(el => counterObs.observe(el));
  }

  /* -------------------------------------------------------
      PAGE TRANSITION
  ------------------------------------------------------- */
  const overlay = document.querySelector('.page-transition');

  if (overlay) {
    // Fade in on load
    window.addEventListener('load', () => {
      overlay.classList.remove('active');
    });

    // Fade out on link click
    document.querySelectorAll('a[href]').forEach(link => {
      const href = link.getAttribute('href');
      if (!href || href.startsWith('#') || href.startsWith('mailto') ||
          href.startsWith('tel') || href.startsWith('http') ||
          href.startsWith('whatsapp')) return;

      link.addEventListener('click', (e) => {
        e.preventDefault();
        overlay.classList.add('active');
        setTimeout(() => { window.location.href = href; }, 380);
      });
    });
  }

  /* -------------------------------------------------------
      CONTACT FORM — التعديل الاحترافي للإرسال السري في الخلفية
  ------------------------------------------------------- */
  const form = document.querySelector('.contact-form');
  if (form) {
    form.addEventListener('submit', (e) => {
      // 1. نمنع إعادة التوجيه وفتح أي صفحة خارجية تماماً
      e.preventDefault();

      // 2. التحقق من ملء جميع الحقول المطلوبة بشكل صحيح
      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }

      const btn = form.querySelector('.contact-form__submit');
      const original = btn.innerHTML; // حفظ الهيكل الأصلي بالـ SVG
      
      // 3. تغيير مظهر الزر فوراً لإشعار العميل ببث البيانات
      btn.style.color = 'var(--clr-accent)';
      btn.style.borderColor = 'var(--clr-accent)';
      const btnText = btn.querySelector('span');
      if (btnText) btnText.textContent = 'Sending...';

      // 4. حزم البيانات المكتوبة في النموذج لإرسالها بالخلفية
      const formData = new FormData(form);

      fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: formData
      })
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          // 5. عند نجاح العملية، نظهر نص اكتمال الإرسال الفخم
          if (btnText) btnText.textContent = 'Message Sent ✓';
          
          setTimeout(() => {
            btn.innerHTML = original; // إعادة شكل الزر الأصلي مع الـ SVG السينمائي
            btn.style.color = '';
            btn.style.borderColor = '';
            form.reset(); // تصفير جميع حقول النموذج تلقائياً
          }, 3500);
        } else {
          if (btnText) btnText.textContent = 'Error! Try Again';
          setTimeout(() => { btn.innerHTML = original; }, 2000);
        }
      })
      .catch(error => {
        if (btnText) btnText.textContent = 'Network Error';
        setTimeout(() => { btn.innerHTML = original; }, 2000);
      });
    });

    // Floating label effect
    form.querySelectorAll('.form-field__input, .form-field__select, .form-field__textarea').forEach(input => {
      function check() {
        input.closest('.form-field')?.classList.toggle('has-value', input.value.trim() !== '');
      }
      input.addEventListener('input', check);
      input.addEventListener('change', check);
      check();
    });
  }

  /* -------------------------------------------------------
      MARQUEE SPEED ON HOVER
  ------------------------------------------------------- */
  document.querySelectorAll('.marquee__track').forEach(track => {
    track.closest('.marquee')?.addEventListener('mouseenter', () => {
      track.style.animationPlayState = 'paused';
    });
    track.closest('.marquee')?.addEventListener('mouseleave', () => {
      track.style.animationPlayState = 'running';
    });
  });

})();