import { useEffect, useState } from "react";
import RandomWords from "../../assets/random.json";
import Game from "./Game";

export default function Env() {
  // Track the game data
  const [round, setRound] = useState(1);

  // ---------- Sets the rules of the game ----------
  const [rows, setRows] = useState(6);
  const [letters, setLetters] = useState(5);
  const moreRows = () => {
    if (rows >= 10) setRows(10);
    else setRows((prevRows) => prevRows + 1);
  };
  const lessRows = () => {
    if (rows <= 1) setRows(1);
    else setRows((prevRows) => prevRows - 1);
  };
  const moreLetters = () => {
    if (letters >= 16) setLetters(16);
    else setLetters((prevLetters) => prevLetters + 1);
  };
  const lessLetters = () => {
    if (letters <= 2) setLetters(2);
    else setLetters((prevLetters) => prevLetters - 1);
  };

  // ---------- Track the game status ----------
  const [gameStatus, setGameStatus] = useState("menu");
  const handleGameStatus = (status) => {
    if (!["won", "lost", "ready", "menu", "playing"].includes(status)) return;
    setGameStatus(status);
  };

  // ---------- Track the keyboard click ----------
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
      return;
    }

    if (gameStatus == "won") {
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
  const [chosenWord, setChosenWord] = useState();
  const createNewChosenWord = () => {
    const randomWords = RandomWords[letters];
    const min = 1;
    const max = randomWords.length - 1;
    const randomInRange = Math.floor(Math.random() * (max - min + 1)) + min;
    setChosenWord(randomWords[randomInRange].toUpperCase());
  };

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      {gameStatus == "menu" && (
        <div className="flex flex-col items-center gap-4">
          <h1 className="text-5xl font-bold">Menu</h1>
          <div className="grid grid-cols-2 gap-4 justify-items-center">
            <div className="w-full grid grid-cols-2 gap-4 border-white border-2 rounded-lg p-4">
              <p>Rows</p>
              <span className="w-10 bg-cyan-950">{rows}</span>
              <span className="rounded-lg px-4 py-2 bg-red-500">Less (E)</span>
              <span className="rounded-lg px-4 py-2 bg-blue-500">More (R)</span>
            </div>
            <div className="w-full grid grid-cols-2 gap-4 border-white border-2 rounded-lg p-4">
              <p>Letters</p>
              <span className="w-10 bg-cyan-950">{letters}</span>
              <span className="rounded-lg px-4 py-2 bg-red-500">Less (K)</span>
              <span className="rounded-lg px-4 py-2 bg-blue-500">More (L)</span>
            </div>
          </div>
          <span className="bg-green-500 rounded-lg px-4 py-2 w-full text-center">
            Start (Enter)
          </span>
        </div>
      )}
      {(gameStatus == "ready" || gameStatus == "won") && (
        <Game
          rows={rows}
          letters={letters}
          chosenWord={chosenWord}
          gameStatus={gameStatus}
          round={round}
          setGameStatus={handleGameStatus}
          clickId={clickId}
          click={click}
        />
      )}
      {gameStatus == "won" && (
        <div className="flex flex-col gap-4">
          <h1 className="text-5xl font-bold">You Won!</h1>
          <button className="rounded-lg bg-green-500 py-2">
            Play Again (Enter)
          </button>
          <button className="rounded-lg bg-blue-500 py-2">Menu (Escape)</button>
        </div>
      )}
    </div>
  );
}
