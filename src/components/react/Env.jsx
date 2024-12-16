import { useEffect, useState } from "react";
import AvaiableWords from "../../assets/words.json";
import Game from "./Game";
import Minimap from "./Minimap";
import Menu from "./Menu";
import Shortcuts from "./Shortcuts";
import Keyboard from "./Keyboard";
import Timer from "./Timer";
import Countdown from "./Countdown";
import KeyboardStatus from "../../assets/keyboard.json";

export default function Env() {
  // Static configs for the game
  const rowsMinLimit = 1;
  const rowsMaxLimit = 10;
  const lettersMinLimit = 2;
  const lettersMaxLimit = 11;
  const countdownMinLimit = 10;
  const countdownMaxLimit = 1800;

  // Track the game data
  const [round, setRound] = useState(1);
  const keyboard = JSON.parse(JSON.stringify(KeyboardStatus));
  const [chosenLettersKeyboard, setChosenLettersKeyboard] = useState(keyboard);
  const resetKeyboardColors = () => {
    setChosenLettersKeyboard(keyboard);
  };

  // Sets the rules of the game
  const [rows, setRows] = useState(6);
  const [letters, setLetters] = useState(5);
  const [haveTimer, setHaveTimer] = useState(true);
  const [haveCountdown, setHaveCountdown] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const moreRows = () => {
    setRows((r) => (r >= rowsMaxLimit ? rowsMaxLimit : r + 1));
  };
  const lessRows = () => {
    setRows((r) => (r <= rowsMinLimit ? rowsMinLimit : r - 1));
  };
  const moreLetters = () => {
    setLetters((l) => (l >= lettersMaxLimit ? lettersMaxLimit : l + 1));
  };
  const lessLetters = () => {
    setLetters((l) => (l <= lettersMinLimit ? lettersMinLimit : l - 1));
  };
  const toggleTimer = () => {
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
  };
  const moreTimeCounter = () => {
    haveCountdown &&
      setCountdown((cd) =>
        cd >= countdownMaxLimit ? countdownMaxLimit : cd + 10,
      );
  };
  const lessTimeCounter = () => {
    haveCountdown &&
      setCountdown((cd) =>
        cd <= countdownMinLimit ? countdownMinLimit : cd - 10,
      );
  };
  const resetCountdown = () => {};

  // Track the game status
  const [gameStatus, setGameStatus] = useState("menu");
  const handleGameStatus = (status) => {
    if (!["won", "lost", "ready", "menu", "playing"].includes(status)) return;
    setGameStatus(status);
  };

  // Track the keyboard click
  const [clickObserver, setClickObserver] = useState(0);
  const [click, setClick] = useState();
  const handleKeydown = (event) => {
    setClick(event.key);

    if (gameStatus == "ready") {
      setClickObserver((prevClickId) => prevClickId + 1);
      return;
    }

    if (gameStatus == "menu") {
      if (event.key == "Enter") {
        setGameStatus("ready");
        createNewChosenWord();
        resetKeyboardColors();
      }
      if (event.key == "ArrowRight") moreLetters();
      if (event.key == "ArrowLeft") lessLetters();
      if (event.key == "ArrowDown") moreRows();
      if (event.key == "ArrowUp") lessRows();
      if (event.key == "t") toggleTimer();
      if (event.key == "+" || event.key == "=") moreTimeCounter();
      if (event.key == "-") lessTimeCounter();
      return;
    }

    if (gameStatus == "won" || gameStatus == "lost") {
      if (event.key == "Enter") {
        createNewChosenWord();
        setRound((prevRound) => prevRound + 1);
        setGameStatus("ready");
        resetKeyboardColors();
        resetCountdown();
        return;
      }
      if (event.key == "Escape") {
        window.location.reload();
        return;
      }
      return;
    }
  };
  useEffect(() => {
    window.addEventListener("keydown", handleKeydown);
    return () => {
      window.removeEventListener("keydown", handleKeydown);
    };
  });

  // Creates a new random word
  const [avaiableWords, setAvaiableWords] = useState();
  const [chosenWord, setChosenWord] = useState();
  const createNewChosenWord = () => {
    const allWordsAvaiable = [...AvaiableWords];
    const randomWords = allWordsAvaiable.filter(
      (word) => word.length == letters,
    );
    const min = 0;
    const max = randomWords.length - 1;
    const randomInRange = Math.floor(Math.random() * (max - min + 1)) + min;
    setChosenWord(randomWords[randomInRange].toUpperCase());
    setAvaiableWords(
      allWordsAvaiable.map((word) => {
        return word.toUpperCase();
      }),
    );
  };

  return (
    <>
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
            chosenWord={chosenWord}
            avaiableWords={avaiableWords}
            gameStatus={gameStatus}
            setGameStatus={handleGameStatus}
            round={round}
            clickObserver={clickObserver}
            click={click}
            chosenLettersKeyboard={chosenLettersKeyboard}
            setChosenLettersKeyboard={setChosenLettersKeyboard}
          />
          <Keyboard chosenLettersKeyboard={chosenLettersKeyboard} />
          <div className="fixed bottom-0 right-0 min-w-48 text-center p-4 flex flex-col items-center justify-start">
            {haveCountdown && (
              <Countdown
                gameStatus={gameStatus}
                countdown={countdown}
                round={round}
                haveCountdown={haveCountdown}
                setGameStatus={handleGameStatus}
              />
            )}
            {haveTimer && <Timer gameStatus={gameStatus} />}
          </div>
        </>
      )}
      <Shortcuts gameStatus={gameStatus} chosenWord={chosenWord} />
    </>
  );
}
