export type StatsProps = {
  cpm: number;
  wpm: number;
  accuracy: number;
  elapsedSeconds: number;
  maxTime: number;
};

export function Stats({
  cpm,
  wpm,
  accuracy,
  elapsedSeconds,
  maxTime,
}: StatsProps) {

  return (
    <div className="stats">
      <span>CPM: {cpm}</span>
      <span>WPM: {wpm}</span>
      <span>Accuracy: {Math.max(0, Math.floor(accuracy * 100))}%</span>
      <span>{Math.round(maxTime - elapsedSeconds)}s remaining</span>
    </div>
  );
}
