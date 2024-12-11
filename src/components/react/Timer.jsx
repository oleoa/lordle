import { useEffect, useState } from "react";

export default function Timer(props) {
  const [cs, setCs] = useState(0);

  useEffect(() => {
    let timer;

    if (props.gameStatus == "ready") {
      setCs(0);
      timer = setInterval(() => {
        setCs((prevCentiseconds) => prevCentiseconds + 1);
      }, 10);
    }

    if (props.gameStatus == "won" || props.gameStatus == "lost") {
      clearInterval(timer);
    }

    return () => {
      clearInterval(timer);
    };
  }, [props.gameStatus]);

  const formatTime = (time) => {
    // Get the true values
    const trueCentiSeconds = time;
    const trueSeconds = trueCentiSeconds / 100;
    const trueMinutes = trueSeconds / 60;

    // Floor the values (3.2465 sec -> 3 sec)
    const flooredCentiSeconds = Math.floor(trueCentiSeconds);
    const flooredSeconds = Math.floor(trueSeconds);
    const flooredMinutes = Math.floor(trueMinutes);

    // Removes the reset (110 sec -> 50 sec)
    const formatedCentiSeconds = flooredCentiSeconds % 100;
    const formatedSeconds = flooredSeconds % 60;
    const formatedMinutes = flooredMinutes % 60;

    // Adds the remainings zeros (9 sec -> 09 sec)
    const finalCentiSeconds =
      formatedCentiSeconds < 10
        ? "0" + formatedCentiSeconds
        : formatedCentiSeconds;
    const finalSeconds =
      formatedSeconds < 10 ? "0" + formatedSeconds : formatedSeconds;
    const finalMinutes =
      formatedMinutes < 10 ? "0" + formatedMinutes : formatedMinutes;
    return (
      <>
        <span className="w-20">
          {finalMinutes}:{finalSeconds}:{finalCentiSeconds}
        </span>
      </>
    );
  };
  return (
    <div className="fixed bottom-0 right-0 w-48 text-center p-5 flex items-center justify-start">
      <div className="text-4xl">{formatTime(cs)}</div>
    </div>
  );
}
