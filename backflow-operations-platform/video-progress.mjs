export function createVideoProgressTracker() {
  const recorded = new Set();
  return (currentTime, duration) => {
    if (!Number.isFinite(currentTime) || !Number.isFinite(duration) || currentTime < 0 || duration <= 0) return [];
    const reached = [25, 50, 75].filter(percent => currentTime / duration >= percent / 100 && !recorded.has(percent));
    reached.forEach(percent => recorded.add(percent));
    return reached;
  };
}
