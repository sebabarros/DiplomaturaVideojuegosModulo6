(() => {
  const slides = [...document.querySelectorAll('.slide')];
  const counter = document.querySelector('#counter');
  const progressBar = document.querySelector('#progressBar');
  const notesButton = document.querySelector('#notesButton');
  const overview = document.querySelector('#overview');
  const overviewGrid = document.querySelector('#overviewGrid');
  let current = 0;

  const clamp = (value) => Math.max(0, Math.min(slides.length - 1, value));

  function indexFromHash() {
    const match = window.location.hash.match(/^#\/?slide-(\d+)$/);
    return match ? clamp(Number(match[1]) - 1) : 0;
  }

  function showSlide(index, updateHash = true) {
    current = clamp(index);
    slides.forEach((slide, position) => {
      const active = position === current;
      slide.classList.toggle('is-active', active);
      slide.setAttribute('aria-hidden', String(!active));
    });

    counter.textContent = `${current + 1} / ${slides.length}`;
    progressBar.style.width = `${((current + 1) / slides.length) * 100}%`;
    document.title = `${slides[current].dataset.title} · Módulo integrador`;

    if (updateHash) {
      history.replaceState(null, '', `#slide-${current + 1}`);
    }
  }

  function toggleNotes() {
    const visible = document.body.classList.toggle('notes-visible');
    notesButton.setAttribute('aria-pressed', String(visible));
  }

  function buildOverview() {
    slides.forEach((slide, index) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'overview-card';
      button.innerHTML = `<span>${String(index + 1).padStart(2, '0')} · Clase 1</span><strong>${slide.dataset.title}</strong>`;
      button.addEventListener('click', () => {
        overview.close();
        showSlide(index);
      });
      overviewGrid.append(button);
    });
  }

  document.querySelector('#prevButton').addEventListener('click', () => showSlide(current - 1));
  document.querySelector('#nextButton').addEventListener('click', () => showSlide(current + 1));
  document.querySelector('#homeButton').addEventListener('click', () => showSlide(0));
  notesButton.addEventListener('click', toggleNotes);
  document.querySelector('#overviewButton').addEventListener('click', () => overview.showModal());
  document.querySelector('#closeOverview').addEventListener('click', () => overview.close());
  document.querySelector('#fullscreenButton').addEventListener('click', async () => {
    if (!document.fullscreenElement) await document.documentElement.requestFullscreen();
    else await document.exitFullscreen();
  });

  document.addEventListener('keydown', (event) => {
    if (overview.open && event.key !== 'Escape') return;
    if (['ArrowRight', 'ArrowDown', 'PageDown', ' '].includes(event.key)) {
      event.preventDefault();
      showSlide(current + 1);
    }
    if (['ArrowLeft', 'ArrowUp', 'PageUp'].includes(event.key)) {
      event.preventDefault();
      showSlide(current - 1);
    }
    if (event.key === 'Home') showSlide(0);
    if (event.key === 'End') showSlide(slides.length - 1);
    if (event.key.toLowerCase() === 'n') toggleNotes();
    if (event.key.toLowerCase() === 'o') overview.showModal();
    if (event.key.toLowerCase() === 'f') document.querySelector('#fullscreenButton').click();
  });

  let touchStartX = 0;
  document.addEventListener('touchstart', (event) => { touchStartX = event.changedTouches[0].clientX; }, { passive: true });
  document.addEventListener('touchend', (event) => {
    const distance = event.changedTouches[0].clientX - touchStartX;
    if (Math.abs(distance) < 60) return;
    showSlide(current + (distance < 0 ? 1 : -1));
  }, { passive: true });

  window.addEventListener('hashchange', () => showSlide(indexFromHash(), false));
  buildOverview();
  showSlide(indexFromHash(), false);
})();
