/* =========================================================
   PORTFOLIO — Filter & Services Accordion
   ========================================================= */

(function () {
  'use strict';

  /* -------------------------------------------------------
     PORTFOLIO FILTER
  ------------------------------------------------------- */
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projCards  = document.querySelectorAll('.proj-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Update active state
      filterBtns.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');

      const filter = btn.getAttribute('data-filter');

      projCards.forEach(card => {
        const cat = card.getAttribute('data-category');
        if (filter === 'all' || cat === filter) {
          card.classList.remove('hidden');
          // Reset grid-column for wide cards
          if (card.classList.contains('proj-card--wide') && filter === 'all') {
            card.style.gridColumn = '';
          }
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });

  /* -------------------------------------------------------
     SERVICES ACCORDION (services.html)
  ------------------------------------------------------- */
  const serviceItems = document.querySelectorAll('.service-item');

  serviceItems.forEach(item => {
    const header = item.querySelector('.service-item__header');
    if (!header) return;

    header.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');

      // Close all
      serviceItems.forEach(s => s.classList.remove('open'));

      // Toggle clicked
      if (!isOpen) item.classList.add('open');
    });

    // Keyboard: Enter/Space
    header.setAttribute('tabindex', '0');
    header.setAttribute('role', 'button');
    header.setAttribute('aria-expanded', 'false');

    header.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        header.click();
        header.setAttribute('aria-expanded', item.classList.contains('open') ? 'true' : 'false');
      }
    });
  });

  // Open first service by default
  if (serviceItems[0]) {
    serviceItems[0].classList.add('open');
  }

})();
