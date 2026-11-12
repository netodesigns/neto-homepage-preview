const carousel = document.querySelector('[data-carousel]');
const slides = [...carousel.querySelectorAll('.hero-slide')];
const controls = carousel.querySelector('.hero-controls');
const position = controls.querySelector('[data-position]');
const toggle = controls.querySelector('[data-toggle]');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const now = new Date();
const month = new Intl.DateTimeFormat('it-IT', { month: 'long' }).format(now);

for (const label of carousel.querySelectorAll('[data-month]')) {
  label.textContent = month;
}

let index = (now.getMonth() + 1) % slides.length;
let paused = reducedMotion.matches;
let timer;

function show(next) {
  index = (next + slides.length) % slides.length;
  slides.forEach((slide, i) => {
    slide.hidden = index !== i;
  });
  position.textContent = `${index + 1} / ${slides.length}`;
}

function setPaused(value) {
  paused = value;
  window.clearInterval(timer);
  toggle.textContent = paused ? 'Avvia rotazione' : 'Metti in pausa';
  position.setAttribute('aria-live', paused ? 'polite' : 'off');
  if (!paused) {
    timer = window.setInterval(() => {
      if (!document.hidden && !carousel.matches(':hover, :focus-within')) {
        show(index + 1);
      }
    }, 9000);
  }
}

controls.querySelector('[data-prev]').addEventListener('click', () => {
  setPaused(true);
  show(index - 1);
});
controls.querySelector('[data-next]').addEventListener('click', () => {
  setPaused(true);
  show(index + 1);
});
toggle.addEventListener('click', () => setPaused(!paused));
reducedMotion.addEventListener('change', (event) => setPaused(event.matches));

show(index);
setPaused(paused);
controls.hidden = false;
