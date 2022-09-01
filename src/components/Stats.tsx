import { useEffect, useState } from "react";
import { TypingTestStatus } from "../reducer";

export type StatsProps = {
  cpm: number;
  wpm: number;
  accuracy: number;
  startTime: number;
  currentState: TypingTestStatus;
  dispatchRecalculateStats: () => void;
};

export function Stats({
  cpm,
  wpm,
  accuracy,
  startTime,
  currentState,
  dispatchRecalculateStats,
}: StatsProps) {
  const [elapsedTime, setElapsedTime] = useState(0);

  useEffect(() => {
    let updateElapsedTimeInterval: any;
    if (currentState === "ACTIVE") {
      updateElapsedTimeInterval = setInterval(() => {
        const elapsedTime = Math.round((Date.now() - startTime) / 1000);
        setElapsedTime(elapsedTime);
        dispatchRecalculateStats();
      }, 1000);
    } else {
      clearInterval(updateElapsedTimeInterval);
    }
    return () => clearInterval(updateElapsedTimeInterval);
  }, [currentState, startTime]);

  return (
    <div className="stats">
      <span>CPM: {cpm}</span>
      <span>WPM: {wpm}</span>
      <span>Accuracy: {Math.max(0, Math.floor(accuracy * 100))}%</span>
      <span>Elapsed Time: {elapsedTime} seconds</span>
    </div>
  );
}
