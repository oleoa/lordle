import { useEffect, useState } from "react";

import Timer from "./Timer";

export default function Clock(props) {
  // Get the countdown value in centiseconds
  const countdownCS = props.rules.countdown * 100;

  // Centiseconds of the clock and the player
  const [cs, setCs] = useState(0);
  const [s, setS] = useState(props.rules.haveCountdown ? countdownCS : 0);

  // Track the gameStatus changes
  useEffect(() => {
    let timer;
    if (props.gameStatus == "loading") {
      setCs(0);
      setS(props.rules.haveCountdown ? countdownCS : 0);
    }
    if (props.gameStatus == "playing") {
      timer = setInterval(() => setCs((cs) => cs + 1), 10);
    }
    if (props.gameStatus == "won") {
      props.setLastWinTime(cs);
    }
    return () => {
      clearInterval(timer);
    };
  }, [props.gameStatus]);

  // Track the timer changes
  useEffect(() => {
    if (props.rules.showTimer) setS(cs);
    if (props.rules.haveCountdown) setS(countdownCS - cs);
    if (props.rules.haveCountdown && countdownCS - cs == 0)
      props.setGameStatus("lost");
  }, [cs]);

  return (
    <div className="fixed bottom-0 right-0 min-w-48 text-center p-4 flex flex-col items-center justify-start">
      {(props.rules.showTimer || props.rules.haveCountdown) && (
        <div className="text-4xl w-40">
          <Timer time={s} />
        </div>
      )}
    </div>
  );
}
