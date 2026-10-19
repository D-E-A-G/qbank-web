import { Icon } from "./Icon";

/** At five minutes or less the timer turns to the low-time state. */
const LOW_SECONDS = 5 * 60;

/**
 * The exam's time left. The low-time state changes the icon and fill and always says "left",
 * so it does not rely on color alone.
 */
export function CountdownTimer({ seconds, compact }: { seconds: number; compact: boolean }) {
  const left = Math.max(0, Math.ceil(seconds));
  const low = left <= LOW_SECONDS;
  const text = clock(left);
  return (
    <span role="timer" aria-label={`${text} left`} className={low ? "timer timer-low" : "timer"}>
      <Icon name={low ? "triangle-alert" : "timer"} size={16} />
      <span className="timer-clock">{text}</span>
      {low || !compact ? <span className="timer-left">left</span> : null}
    </span>
  );
}

function clock(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  return `${String(minutes)}:${String(seconds % 60).padStart(2, "0")}`;
}
