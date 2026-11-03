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
const clicks = { '/pricing/': 'backflow_pricing_click', '/contact/': 'backflow_contact_click', '/how-it-works/': 'backflow_workflow_click', '/faq/': 'backflow_faq_click' };
document.querySelectorAll('a[href^="/backflow-operations-platform/"]').forEach(link => {
  const event = clicks[link.getAttribute('href').replace('/backflow-operations-platform', '')];
  if (event) link.addEventListener('click', () => track(event, { link_text: link.textContent.trim().slice(0, 60) }));
});
document.querySelectorAll('[data-subscribe]').forEach(link => link.addEventListener('click', () => track('backflow_checkout_click')));
document.querySelector('.demo-form')?.addEventListener('submit', () => track('backflow_inquiry_submit'));
