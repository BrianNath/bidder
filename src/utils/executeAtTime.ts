export default function executeAtTime(fn: () => void, time: string) {
  const now = new Date().getTime();
  const targetTime = new Date(time).getTime();

  if (targetTime <= now) {
    fn();
  } else {
    const duration = targetTime - now;
    setTimeout(fn, duration);
  }
}
