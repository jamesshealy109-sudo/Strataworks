import { createVideoProgressTracker } from './video-progress.mjs';

const track = (event, extra = {}) => {
  if (typeof window.gtag === 'function') window.gtag('event', event, {
    event_category: 'backflow_sales', page_path: location.pathname, ...extra,
  });
};
const video = document.querySelector('#sales-video');
if (video) {
  const progress = createVideoProgressTracker();
  let started = false;
  let finished = false;
  video.addEventListener('play', () => {
    if (!started) { track('backflow_video_start'); started = true; }
  });
  video.addEventListener('timeupdate', () => progress(video.currentTime, video.duration).forEach(percent => {
    track('backflow_video_progress', { video_percent: percent });
  }));
  video.addEventListener('ended', () => {
    if (!finished) { track('backflow_video_complete'); finished = true; }
  });
}
document.querySelectorAll('a[href="#pricing"]').forEach(link => link.addEventListener('click', () => track('backflow_pricing_click')));
document.querySelectorAll('[data-subscribe]').forEach(link => link.addEventListener('click', () => track('backflow_checkout_click')));
document.querySelectorAll('a[href="#demo"]').forEach(link => link.addEventListener('click', () => track('backflow_contact_click')));
document.querySelector('.demo-form')?.addEventListener('submit', () => track('backflow_inquiry_submit'));
