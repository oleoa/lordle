import { useEffect, useState } from "react";
import RandomWords from "../../assets/words.json";
import Game from "./Game";

export default function Env() {
  // Track the game data
  const [round, setRound] = useState(1);
  const rowsMinLimit = 1;
  const rowsMaxLimit = 10;
  const lettersMinLimit = 2;
  const lettersMaxLimit = 11;

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
      }
      if (event.key == "l") moreLetters();
      if (event.key == "k") lessLetters();
      if (event.key == "r") moreRows();
      if (event.key == "e") lessRows();
      if (event.key == "o") setLangEN();
      if (event.key == "p") setLangPT();
      return;
    }

    if (gameStatus == "won" || gameStatus == "lost") {
      if (event.key == "Enter") {
        createNewChosenWord();
        setRound((prevRound) => prevRound + 1);
        setGameStatus("ready");
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
    <div className="flex flex-col items-center justify-center gap-4 py-8">
      {gameStatus == "menu" && (
        <div className="flex flex-col items-start justify-center gap-4 h-full">
          <h1 className="text-5xl font-bold">Menu</h1>
          <div className="grid gap-4 justify-items-center">
            <div className="w-full grid grid-cols-2 gap-4 border-white border-2 rounded-lg p-4 bg">
              <p>Rows</p>
              <span className="w-10">{rows}</span>
              <span className="rounded-lg px-4 py-2 bg-red-500">Less (E)</span>
              <span className="rounded-lg px-4 py-2 bg-blue-500">More (R)</span>
            </div>
            <div className="w-full grid grid-cols-2 gap-4 border-white border-2 rounded-lg p-4 bg">
              <p>Letters</p>
              <span className="w-10">{letters}</span>
              <span className="rounded-lg px-4 py-2 bg-red-500">Less (K)</span>
              <span className="rounded-lg px-4 py-2 bg-blue-500">More (L)</span>
            </div>
            <div className="w-full grid grid-cols-2 gap-4 border-white border-2 rounded-lg p-4 bg">
              <p>Language</p>
              <span className="w-10">{language}</span>
              <span className="rounded-lg px-4 py-2 bg-red-500">
                English (O)
              </span>
              <span className="rounded-lg px-4 py-2 bg-blue-500">
                Portuguese (P)
              </span>
            </div>
          </div>
          <span className="bg-green-500 rounded-lg px-4 py-2 text-center">
            Start (Enter)
          </span>
        </div>
      )}
      {(gameStatus == "ready" ||
        gameStatus == "won" ||
        gameStatus == "lost") && (
        <Game
          rows={rows}
          letters={letters}
          chosenWord={chosenWord}
          avaiableWords={avaiableWords}
          gameStatus={gameStatus}
          round={round}
          setGameStatus={handleGameStatus}
          clickId={clickId}
          click={click}
        />
      )}
      {gameStatus == "ready" && (
        <div className="flex flex-col items-start justify-center gap-4 w-full">
          <span className="rounded-lg bg-red-500 py-2 px-4">
            Leave (Escape)
          </span>
        </div>
      )}
      {gameStatus == "won" && (
        <div className="flex flex-col items-start justify-center gap-4 w-full">
          <h1 className="text-5xl font-bold">You Won!</h1>
          <span className="rounded-lg bg-green-500 py-2 px-4">
            Play Again (Enter)
          </span>
          <button className="rounded-lg bg-blue-500 py-2 px-4">
            Menu (Escape)
          </button>
        </div>
      )}
      {gameStatus == "lost" && (
        <div className="flex flex-col items-start justify-center gap-4 w-full">
          <h1 className="text-4xl font-bold">You Lost!</h1>
          <h2 className="text-xl font-bold">The word was: {chosenWord}</h2>
          <span className="rounded-lg bg-green-500 py-2 px-4">
            Play Again (Enter)
          </span>
          <button className="rounded-lg bg-blue-500 py-2 px-4">
            Menu (Escape)
          </button>
        </div>
      )}
    </div>
  );
}
