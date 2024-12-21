import { useEffect } from "react";

import Minimap from "./Minimap";
import Secret from "./Secret";

import Toggle from "../../assets/toggle.svg";

export default function Menu(props) {
  const moreRows = () => {
    props.setRules((r) => {
      const newRows =
        r.rows >= parseInt(props.env.rowsMaxLimit)
          ? parseInt(props.env.rowsMaxLimit)
          : r.rows + 1;
      return {
        ...r,
        rows: newRows,
      };
    });
  };
  const lessRows = () => {
    props.setRules((r) => {
      const newRows =
        r.rows <= parseInt(props.env.rowsMinLimit)
          ? parseInt(props.env.rowsMinLimit)
          : r.rows - 1;
      return {
        ...r,
        rows: newRows,
      };
    });
  };
  const moreLetters = () => {
    props.setRules((r) => {
      const newLetters =
        r.letters >= parseInt(props.env.lettersMaxLimit)
          ? parseInt(props.env.lettersMaxLimit)
          : r.letters + 1;
      return {
        ...r,
        letters: newLetters,
      };
    });
  };
  const lessLetters = () => {
    props.setRules((r) => {
      const newLetters =
        r.letters <= parseInt(props.env.lettersMinLimit)
          ? parseInt(props.env.lettersMinLimit)
          : r.letters - 1;
      return {
        ...r,
        letters: newLetters,
      };
    });
  };
  const toggleClock = () => {
    if (props.rules.showTimer) {
      props.setRules((r) => {
        const newHaveTimer = false;
        const newHaveCountdown = true;
        return {
          ...r,
          showTimer: newHaveTimer,
          haveCountdown: newHaveCountdown,
        };
      });
    }
    if (props.rules.haveCountdown) {
      props.setRules((r) => {
        const newHaveTimer = false;
        const newHaveCountdown = false;
        return {
          ...r,
          showTimer: newHaveTimer,
          haveCountdown: newHaveCountdown,
        };
      });
    }
    if (!props.rules.showTimer && !props.rules.haveCountdown) {
      props.setRules((r) => {
        const newHaveTimer = true;
        const newHaveCountdown = false;
        return {
          ...r,
          showTimer: newHaveTimer,
          haveCountdown: newHaveCountdown,
        };
      });
    }
  };
  const moreCountdown = () => {
    props.rules.haveCountdown &&
      props.setRules((r) => {
        return {
          ...r,
          countdown:
            r.countdown >= parseInt(props.env.countdownMaxLimit)
              ? parseInt(props.env.countdownMaxLimit)
              : r.countdown + 10,
        };
      });
  };
  const lessCountdown = () => {
    props.rules.haveCountdown &&
      props.setRules((r) => {
        return {
          ...r,
          countdown:
            r.countdown <= parseInt(props.env.countdownMinLimit)
              ? parseInt(props.env.countdownMinLimit)
              : r.countdown - 10,
        };
      });
  };
  const startGame = () => {
    props.setPage("game");
  };

  // Handles the click for the menu
  const handleClick = (click) => {
    if (click.typed == "") return;
    if (click.address != "menu") return;
    if (click.typed == "Enter") startGame();
    else if (click.typed == "ArrowRight") moreLetters();
    else if (click.typed == "ArrowLeft") lessLetters();
    else if (click.typed == "ArrowDown") moreRows();
    else if (click.typed == "ArrowUp") lessRows();
    else if (click.typed == "c") toggleClock();
    else if (click.typed == "+" || props.click.typed == "=") moreCountdown();
    else if (click.typed == "-") lessCountdown();
  };
  useEffect(() => {
    handleClick(props.click);
  }, [props.click.observer]);

  return (
    <div className="flex flex-col items-start justify-center gap-4 h-full">
      <Secret click={props.click} />
      <Minimap
        gameStatus={props.gameStatus}
        letters={props.rules.letters}
        rows={props.rules.rows}
      />
      <div className="flex flex-col gap-4 justify-items-center">
        <div className="w-full grid grid-cols-2 gap-4 border-white border-2 rounded-lg p-4 bg-blur">
          <h3 className="font-bold col-span-2">Menu</h3>
          <div className="flex gap-2">
            <p>Rows</p>
            <button onClick={lessRows}>↑</button>
            <button onClick={moreRows}>↓</button>
          </div>
          <span className="text-end w-full">{props.rules.rows}</span>
          <div className="flex gap-2">
            <p>Letters</p>
            <button onClick={lessLetters}>←</button>
            <button onClick={moreLetters}>→</button>
          </div>
          <span className="text-end w-full">{props.rules.letters}</span>
          <div className="flex gap-2">
            <p>Clock</p>
            <button onClick={toggleClock}>
              <img src={Toggle.src} className="w-3" />
            </button>
            {props.rules.haveCountdown && (
              <>
                <button onClick={moreCountdown}>+</button>
                <button onClick={lessCountdown}>-</button>
              </>
            )}
          </div>
          <span className="text-end w-full">
            {props.rules.showTimer && "Timer"}
            {props.rules.haveCountdown && (
              <div className="flex gap-2 justify-end">
                {props.rules.countdown && (
                  <p>
                    {Math.floor(props.rules.countdown / 60)}:
                    {props.rules.countdown % 60 < 10
                      ? "0" + (props.rules.countdown % 60)
                      : props.rules.countdown % 60}
                  </p>
                )}
              </div>
            )}
            {!props.rules.showTimer && !props.rules.haveCountdown && "None"}
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
