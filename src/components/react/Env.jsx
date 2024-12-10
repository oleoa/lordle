import { useEffect, useState } from "react";
import Game from "./Game";

export default function Env() {
  // ---------- Track the game status ----------
  const [gameStatus, setGameStatus] = useState("menu");
  const handleGameStatus = (status) => {
    if (!["won", "lost", "ready", "menu", "playing"].includes(status)) return;
    setGameStatus(status);
  };
  // ---------- Track the game status ----------

  // ---------- Track the keyboard click ----------
  const [clickId, setClickId] = useState(0);
  const [click, setClick] = useState();
  const handleKeydown = (event) => {
    setClickId((prevClickId) => prevClickId + 1);
    setClick(event.key);
    if (gameStatus == "menu") {
      if (event.key == "Enter") setGameStatus("ready");
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeydown);
    return () => {
      window.removeEventListener("keydown", handleKeydown);
    };
  });
  // ---------- Track the keyboard click ----------

  return (
    <div className="flex flex-col gap-4">
      {gameStatus == "won" && (
        <>
          <h1 className="text-5xl font-bold">You Won!</h1>
          <button className="rounded-lg bg-green-500 py-2">
            Play Again (Enter)
          </button>
          <button className="rounded-lg bg-blue-500 py-2">
            Menu (Backspace)
          </button>
        </>
      )}
      {gameStatus == "ready" && (
        <Game
          rows={6}
          letters={5}
          gameStatus={gameStatus}
          setGameStatus={handleGameStatus}
          clickId={clickId}
          click={click}
        />
      )}
    </div>
  );
}
