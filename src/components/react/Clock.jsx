import { useEffect, useState } from "react";
import { formatTime } from "../../lib/functions";

// [ haveTimer, haveCountdown, countdown, gameStatus, setGameStatus ]
export default function Clock(props) {
  // Get the countdown value in centiseconds
  const countdownCS = props.countdown * 100;

  // Centiseconds of the clock and the player
  const [cs, setCs] = useState(0);
  const [s, setS] = useState(props.haveCountdown ? countdownCS : 0);

  // Track the gameStatus changes
  useEffect(() => {
    let timer;
    if (props.gameStatus == "ready") {
      setCs(0);
      setS(props.haveCountdown ? countdownCS : 0);
      timer = setInterval(() => setCs((cs) => cs + 1), 10);
    }
    return () => {
      clearInterval(timer);
    };
  }, [props.gameStatus]);

  // Track the timer changes
  useEffect(() => {
    if (props.haveTimer) setS(cs);
    if (props.haveCountdown) setS(countdownCS - cs);
    if (props.haveCountdown && countdownCS - cs == 0)
      props.setGameStatus("lost");
  }, [cs]);

  return (
    <>
      {(props.haveTimer || props.haveCountdown) && (
        <div className="text-4xl w-40">{formatTime(s)}</div>
      )}
    </>
  );
}
