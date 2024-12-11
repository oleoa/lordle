import { useEffect, useState } from "react";
import RandomWords from "../../assets/words.json";
import Game from "./Game";
import Minimap from "./Minimap";
import Menu from "./Menu";
import Shortcuts from "./Shortcuts";
import Keyboard from "./Keyboard";
import KeyboardStatus from "../../assets/keyboard.json";

export default function Env() {
  // Track the game data
  const [round, setRound] = useState(1);
  const rowsMinLimit = 1;
  const rowsMaxLimit = 10;
  const lettersMinLimit = 2;
  const lettersMaxLimit = 11;
  const [chosenLettersKeyboard, setChosenLettersKeyboard] = useState({
    ...KeyboardStatus,
  });
  const setChosenLetterKeyboard = (letter, state) => {
    setChosenLettersKeyboard((prev) => ({
      ...prev,
      [letter]: {
        ...prev[letter],
        state: state,
      },
    }));
  };
  const resetKeyboardColors = () => {
    setChosenLettersKeyboard({ ...KeyboardStatus });
  };

  // Sets the rules of the game
  const [rows, setRows] = useState(6);
  const [letters, setLetters] = useState(5);
  const [language, setLanguage] = useState("EN");
  const moreRows = () => {
    if (rows >= rowsMaxLimit) setRows(rowsMaxLimit);
    else setRows((prevRows) => prevRows + 1);
  };
  const lessRows = () => {
    if (rows <= rowsMinLimit) setRows(rowsMinLimit);
    else setRows((prevRows) => prevRows - 1);
  };
  const moreLetters = () => {
    if (letters >= lettersMaxLimit) setLetters(lettersMaxLimit);
    else setLetters((prevLetters) => prevLetters + 1);
  };
  const lessLetters = () => {
    if (letters <= lettersMinLimit) setLetters(lettersMinLimit);
    else setLetters((prevLetters) => prevLetters - 1);
  };
  const setLangEN = () => {
    setLanguage("EN");
  };
  const setLangPT = () => {
    setLanguage("PT");
  };

  // Track the game status
  const [gameStatus, setGameStatus] = useState("menu");
  const handleGameStatus = (status) => {
    if (!["won", "lost", "ready", "menu", "playing"].includes(status)) return;
    setGameStatus(status);
  };

  // Track the keyboard click
  const [clickId, setClickId] = useState(0);
  const [click, setClick] = useState();
  const handleKeydown = (event) => {
    setClick(event.key);

    if (gameStatus == "ready") {
      setClickId((prevClickId) => prevClickId + 1);
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
      if (event.key == "e") setLangEN();
      if (event.key == "p") setLangPT();
      return;
    }

    if (gameStatus == "won" || gameStatus == "lost") {
      if (event.key == "Enter") {
        createNewChosenWord();
        setRound((prevRound) => prevRound + 1);
        setGameStatus("ready");
        resetKeyboardColors();
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
    const randomWords = RandomWords[language].filter(
      (word) => word.length == letters,
    );
    const min = 1;
    const max = randomWords.length - 1;
    const randomInRange = Math.floor(Math.random() * (max - min + 1)) + min;
    setChosenWord(randomWords[randomInRange].toUpperCase());
    setAvaiableWords(
      randomWords.map((word) => {
        return word.toUpperCase();
      }),
    );
  };

  return (
    <>
      {gameStatus == "menu" && (
        <>
          <Minimap gameStatus={gameStatus} letters={letters} rows={rows} />
          <Menu rows={rows} letters={letters} language={language} />
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
            clickId={clickId}
            click={click}
            chosenLettersKeyboard={chosenLettersKeyboard}
            setChosenLetterKeyboard={setChosenLetterKeyboard}
          />
          <Keyboard chosenLettersKeyboard={chosenLettersKeyboard} />
        </>
      )}
      <Shortcuts gameStatus={gameStatus} chosenWord={chosenWord} />
    </>
  );
}
