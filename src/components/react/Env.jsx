import { useEffect, useState } from "react";

import {
  createNewRandomAnswer,
  createNewAvaiableGuesses,
  getLastUserRecord,
  setNewUserRecord,
} from "../../lib/functions.jsx";

import Game from "./Game";
import Minimap from "./Minimap";
import Menu from "./Menu";
import Shortcuts from "./Shortcuts";
import Clock from "./Clock";
import Message from "./Message";

export default function Env(props) {
  // Creates the environment and some games variables
  const [rows, setRows] = useState(6); // The number of rows the game have
  const [letters, setLetters] = useState(5); // The number of letters the words have
  const [avaiableWords, setAvaiableWords] = useState([]); // List of all words the player can guess
  const [answer, setAnswer] = useState(""); // The only correct answer
  const [haveTimer, setHaveTimer] = useState(true); // If the game will show the timer for the player
  const [haveCountdown, setHaveCountdown] = useState(false); // If the game will have a countdown
  const [countdown, setCountdown] = useState(60); // How long is the countdown
  const [message, setMessage] = useState(["", ""]); // The message that appears on the bottom of the screen
  const [gameStatus, setGameStatus] = useState("menu"); // The current game status ["menu", "ready", "won", "lost"]
  const [clickObserver, setClickObserver] = useState(0); // How many times the player clicked on any key (used for observer)
  const [click, setClick] = useState(); // The last key the player pressed
  const [lastRecord, setLastRecord] = useState(null); // The last record in time of the current player
  const [lastWonInCs, setLastWonInCs] = useState(0); // The time it took for player to win the last game
  const [attempts, setAttempts] = useState(null); // The map of the typed letters used for the records

  // Function that gets the environment ready for a new round
  const newRound = () => {
    setGameStatus("ready");
    setAnswer(createNewRandomAnswer(letters));
    setAvaiableWords(createNewAvaiableGuesses(letters));
  };

  // Track the keyboard click
  const handleKeydown = (event) => {
    if (gameStatus == "ready") {
      setClickObserver((prevClickId) => prevClickId + 1);
      setClick(event.key);
    } else if (gameStatus == "won" || gameStatus == "lost") {
      if (event.key == "Enter") newRound();
      if (event.key == "Escape") window.location.reload();
    } else if (gameStatus == "menu") {
      if (event.key == "Enter") newRound();
      else if (event.key == "ArrowRight")
        setLetters((l) =>
          l >= props.rules.lettersMaxLimit
            ? props.rules.lettersMaxLimit
            : l + 1,
        );
      else if (event.key == "ArrowLeft")
        setLetters((l) =>
          l <= props.rules.lettersMinLimit
            ? props.rules.lettersMinLimit
            : l - 1,
        );
      else if (event.key == "ArrowDown") {
        setRows((r) =>
          r >= parseInt(props.rules.rowsMaxLimit)
            ? parseInt(props.rules.rowsMaxLimit)
            : r + 1,
        );
      } else if (event.key == "ArrowUp")
        setRows((r) =>
          r <= parseInt(props.rules.rowsMinLimit)
            ? parseInt(props.rules.rowsMinLimit)
            : r - 1,
        );
      else if (event.key == "t") {
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
      } else if (event.key == "+" || event.key == "=")
        haveCountdown &&
          setCountdown((cd) =>
            cd >= props.rules.countdownMaxLimit
              ? props.rules.countdownMaxLimit
              : cd + 10,
          );
      else if (event.key == "-")
        haveCountdown &&
          setCountdown((cd) =>
            cd <= props.rules.countdownMinLimit
              ? props.rules.countdownMinLimit
              : cd - 10,
          );
    }
  };
  useEffect(() => {
    window.addEventListener("keydown", handleKeydown);
    return () => {
      window.removeEventListener("keydown", handleKeydown);
    };
  });

  // Tracks for the user's record
  useEffect(() => {
    if (!props.isLoggedIn) return;
    const asyncFetchUserRecord = async () => {
      try {
        const lr = await getLastUserRecord();
        setLastRecord(lr);
      } catch (error) {
        console.error("Failed to fetch the last user record:", error);
      }
    };
    asyncFetchUserRecord();
    if (lastWonInCs && lastWonInCs < lastRecord) {
      setMessage(["New Record!", "congrats"]);
      setLastWonInCs(lastWonInCs);
      const asyncSetNewRecord = async () => {
        try {
          await setNewUserRecord(lastWonInCs, rows, letters, answer, attempts);
        } catch (error) {
          console.error("Failed to set a new record:", error);
        }
      };
      asyncSetNewRecord();
    }
  }, [lastWonInCs]);

  return (
    <>
      <Message message={message} setMessage={setMessage} />
      <Shortcuts gameStatus={gameStatus} answer={answer} />
      {gameStatus == "menu" && (
        <>
          <Minimap gameStatus={gameStatus} letters={letters} rows={rows} />
          <Menu
            countdown={countdown}
            setCountdown={setCountdown}
            haveCountdown={haveCountdown}
            haveTimer={haveTimer}
            rows={rows}
            letters={letters}
          />
        </>
      )}
      {(gameStatus == "ready" ||
        gameStatus == "won" ||
        gameStatus == "lost") && (
        <>
          <Game
            rows={rows}
            letters={letters}
            answer={answer}
            avaiableWords={avaiableWords}
            gameStatus={gameStatus}
            setGameStatus={setGameStatus}
            setMessage={setMessage}
            click={click}
            clickObserver={clickObserver}
            isLoggedIn={props.isLoggedIn}
            setAttempts={setAttempts}
          />
          <Clock
            setLastWonInCs={setLastWonInCs}
            haveTimer={haveTimer}
            haveCountdown={haveCountdown}
            countdown={countdown}
            gameStatus={gameStatus}
            setGameStatus={setGameStatus}
          />
        </>
      )}
    </>
  );
}
