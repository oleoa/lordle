import { useEffect } from "react";

import Minimap from "./Minimap";

import Toggle from "../../assets/toggle.svg";

export default function Menu(props) {
  // Functions to handle both the shortcuts and the buttons
  const startGame = () => {
    props.setGameStatus("ready");
  };
  const moreRows = () => {
    props.setRows((r) =>
      r >= parseInt(props.rules.rowsMaxLimit)
        ? parseInt(props.rules.rowsMaxLimit)
        : r + 1,
    );
  };
  const lessRows = () => {
    props.setRows((r) =>
      r <= parseInt(props.rules.rowsMinLimit)
        ? parseInt(props.rules.rowsMinLimit)
        : r - 1,
    );
  };
  const moreLetters = () => {
    props.setLetters((l) =>
      l >= parseInt(props.rules.lettersMaxLimit)
        ? parseInt(props.rules.lettersMaxLimit)
        : l + 1,
    );
  };
  const lessLetters = () => {
    props.setLetters((l) =>
      l <= parseInt(props.rules.lettersMinLimit)
        ? parseInt(props.rules.lettersMinLimit)
        : l - 1,
    );
  };
  const toggleClock = () => {
    if (props.haveTimer) {
      props.setHaveTimer(false);
      props.setHaveCountdown(true);
    }
    if (props.haveCountdown) {
      props.setHaveTimer(false);
      props.setHaveCountdown(false);
    }
    if (!props.haveTimer && !props.haveCountdown) {
      props.setHaveTimer(true);
      props.setHaveCountdown(false);
    }
  };
  const moreCountdown = () => {
    props.haveCountdown &&
      props.setCountdown((cd) =>
        cd >= parseInt(props.rules.countdownMaxLimit)
          ? parseInt(props.rules.countdownMaxLimit)
          : cd + 10,
      );
  };
  const lessCountdown = () => {
    props.haveCountdown &&
      props.setCountdown((cd) =>
        cd <= parseInt(props.rules.countdownMinLimit)
          ? parseInt(props.rules.countdownMinLimit)
          : cd - 10,
      );
  };

  // Handles the click for the menu
  useEffect(() => {
    if (props.click == "Enter") startGame();
    else if (props.click == "ArrowRight") moreLetters();
    else if (props.click == "ArrowLeft") lessLetters();
    else if (props.click == "ArrowDown") moreRows();
    else if (props.click == "ArrowUp") lessRows();
    else if (props.click == "c") toggleClock();
    else if (props.click == "+" || props.click == "=") moreCountdown();
    else if (props.click == "-") lessCountdown();
  }, [props.clickObserver]);

  return (
    <div className="flex flex-col items-start justify-center gap-4 h-full">
      <Minimap
        gameStatus={props.gameStatus}
        letters={props.letters}
        rows={props.rows}
      />
      <div className="flex flex-col gap-4 justify-items-center">
        <div className="w-full grid grid-cols-2 gap-4 border-white border-2 rounded-lg p-4 bg-blur">
          <h3 className="font-bold col-span-2">Menu</h3>
          <div className="flex gap-2">
            <p>Rows</p>
            <button onClick={lessRows}>↑</button>
            <button onClick={moreRows}>↓</button>
          </div>
          <span className="text-end w-full">{props.rows}</span>
          <div className="flex gap-2">
            <p>Letters</p>
            <button onClick={lessLetters}>←</button>
            <button onClick={moreLetters}>→</button>
          </div>
          <span className="text-end w-full">{props.letters}</span>
          <div className="flex gap-2">
            <p>Clock</p>
            <button onClick={toggleClock}>
              <img src={Toggle.src} className="w-3" />
            </button>
            {props.haveCountdown && (
              <>
                <button onClick={moreCountdown}>+</button>
                <button onClick={lessCountdown}>-</button>
              </>
            )}
          </div>
          <span className="text-end w-full">
            {props.haveTimer && "Timer"}
            {props.haveCountdown && (
              <div className="flex gap-2 justify-end">
                {props.countdown && (
                  <p>
                    {Math.floor(props.countdown / 60)}:
                    {props.countdown % 60 < 10
                      ? "0" + (props.countdown % 60)
                      : props.countdown % 60}
                  </p>
                )}
              </div>
            )}
            {!props.haveTimer && !props.haveCountdown && "None"}
          </span>
        </div>
        <button
          onClick={startGame}
          className="w-full flex gap-4 transition-all border-2 rounded-lg p-4 items-center justify-center"
        >
          Start the game (Enter)
        </button>
      </div>
    </div>
  );
}
