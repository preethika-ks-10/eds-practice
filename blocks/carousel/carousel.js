import { fetchPlaceholders } from '../../scripts/placeholders.js';

function updateActiveSlide(slide) {
  const block = slide.closest('.carousel');
  const slideIndex = parseInt(slide.dataset.slideIndex, 10);
  block.dataset.activeSlide = slideIndex;

  const slides = block.querySelectorAll('.carousel-slide');
  slides.forEach((s, idx) => {
    s.setAttribute('aria-hidden', idx !== slideIndex);
  });
}

function showSlide(block, slideIndex = 0) {
  const slides = block.querySelectorAll('.carousel-slide');
  if (!slides.length) return;

  let realIndex = slideIndex;
  if (slideIndex < 0) realIndex = slides.length - 1;
  if (slideIndex >= slides.length) realIndex = 0;

  const activeSlide = slides[realIndex];
  const container = block.querySelector('.carousel-slides');
  if (!container) return;

  container.scrollTo({
    left: activeSlide.offsetLeft,
    behavior: 'smooth',
  });
}

function bindEvents(block) {
  const prevBtn = block.querySelector('.slide-prev');
  const nextBtn = block.querySelector('.slide-next');

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      showSlide(block, parseInt(block.dataset.activeSlide, 10) - 1);
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      showSlide(block, parseInt(block.dataset.activeSlide, 10) + 1);
    });
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) updateActiveSlide(entry.target);
    });
  }, { threshold: 0.6 });

  block.querySelectorAll('.carousel-slide').forEach((slide) => {
    observer.observe(slide);
  });
}

function createSlide(row, index, carouselId) {
  const slide = document.createElement('li');
  slide.className = 'carousel-slide';
  slide.dataset.slideIndex = index;
  slide.id = `carousel-${carouselId}-slide-${index}`;

  row.querySelectorAll(':scope > div').forEach((col, i) => {
    col.classList.add(`carousel-slide-${i === 0 ? 'image' : 'content'}`);
    slide.append(col);
  });

  return slide;
}

let carouselId = 0;

export default async function decorate(block) {
  carouselId += 1;
  block.id = `carousel-${carouselId}`;
  block.dataset.activeSlide = 0;

  const rows = [...block.children];
  const placeholders = await fetchPlaceholders();

  block.setAttribute('role', 'region');
  block.setAttribute('aria-roledescription', placeholders.carousel || 'Carousel');

  const container = document.createElement('div');
  container.className = 'carousel-slides-container';

  const slidesWrapper = document.createElement('ul');
  slidesWrapper.className = 'carousel-slides';

  const navButtons = document.createElement('div');
  navButtons.className = 'carousel-navigation-buttons';
  navButtons.innerHTML = `
    <button class="slide-prev" aria-label="Previous slide">‹</button>
    <button class="slide-next" aria-label="Next slide">›</button>
  `;

  rows.forEach((row, idx) => {
    const slide = createSlide(row, idx, carouselId);
    slidesWrapper.append(slide);
    row.remove();
  });

  container.append(slidesWrapper);
  container.append(navButtons);
  block.prepend(container);

  bindEvents(block);
  showSlide(block, 0);
}