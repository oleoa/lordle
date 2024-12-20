import { useEffect } from "react";
import Minimap from "./Minimap";

export default function Menu(props) {
  // Handles the click for the menu
  useEffect(() => {
    if (props.click == "Enter") props.setGameStatus("ready");
    else if (props.click == "ArrowRight")
      props.setLetters((l) =>
        l >= props.rules.lettersMaxLimit ? props.rules.lettersMaxLimit : l + 1,
      );
    else if (props.click == "ArrowLeft")
      props.setLetters((l) =>
        l <= props.rules.lettersMinLimit ? props.rules.lettersMinLimit : l - 1,
      );
    else if (props.click == "ArrowDown") {
      props.setRows((r) =>
        r >= parseInt(props.rules.rowsMaxLimit)
          ? parseInt(props.rules.rowsMaxLimit)
          : r + 1,
      );
    } else if (props.click == "ArrowUp")
      props.setRows((r) =>
        r <= parseInt(props.rules.rowsMinLimit)
          ? parseInt(props.rules.rowsMinLimit)
          : r - 1,
      );
    else if (props.click == "t") {
      if (haveTimer) {
        setHaveTimer(false);
        setHaveCountdown(true);
      }
      if (haveCountdown) {
        setHaveTimer(false);
        setHaveCountdown(false);
      }
      if (!haveTimer && !haveCountdown) {
        setHaveTimer(true);
        setHaveCountdown(false);
      }
    } else if (props.click == "+" || props.click == "=")
      haveCountdown &&
        setCountdown((cd) =>
          cd >= props.rules.countdownMaxLimit
            ? props.rules.countdownMaxLimit
            : cd + 10,
        );
    else if (props.click == "-")
      haveCountdown &&
        setCountdown((cd) =>
          cd <= props.rules.countdownMinLimit
            ? props.rules.countdownMinLimit
            : cd - 10,
        );
  }, [props.clickObserver]);

  return (
    <div className="flex flex-col items-start justify-center gap-4 h-full">
      <Minimap
        gameStatus={props.gameStatus}
        letters={props.letters}
        rows={props.rows}
      />
      <div className="grid gap-4 justify-items-center">
        <div className="w-full grid grid-cols-2 gap-4 border-white border-2 rounded-lg p-4 bg-blur">
          <h1 className="text-4xl font-bold col-span-2">Menu</h1>
          <p>Rows</p>
          <span className="text-end w-full">{props.rows}</span>
          <p>Letters</p>
          <span className="text-end w-full">{props.letters}</span>
          <p>Clock</p>
          <span className="text-end w-full">
            {props.haveTimer && "Timer"}
            {props.haveCountdown && (
              <div className="flex gap-4">
                {props.countdown && (
                  <p>
                    {Math.floor(props.countdown / 60)}:
                    {props.countdown % 60 < 10
                      ? "0" + (props.countdown % 60)
                      : props.countdown % 60}
                  </p>
                )}
                <p>Countdown</p>
              </div>
            )}
            {!props.haveTimer && !props.haveCountdown && "None"}
          </span>
        </div>
      </div>
    </div>
  );
}
