import { useEffect, useState } from "react";

import Game from "./Game";
import Menu from "./Menu";

export default function Root(props) {
  const [rows, setRows] = useState(6); // The number of rows the game have
  const [letters, setLetters] = useState(5); // The number of letters the words have

  const [haveTimer, setHaveTimer] = useState(true); // If the game will show the timer for the player
  const [haveCountdown, setHaveCountdown] = useState(false); // If the game will have a countdown
  const [countdown, setCountdown] = useState(60); // How long is the countdown

  const [gameStatus, setGameStatus] = useState("menu"); // The current game status ["menu", "ready", "won", "lost"]
  const [showGame, setShowGame] = useState(false); // If the game should mount

  const [menuClickObserver, setMenuClickObserver] = useState(0); // Observer for the menu click
  const [gameClickObserver, setGameClickObserver] = useState(0); // Observer for the game click
  const [click, setClick] = useState(); // The last key the player pressed

  // Handle the keyboard click
  const handleKeydown = (event) => {
    setClick(event.key);

    if (gameStatus == "ready") {
      setGameClickObserver((prevClickId) => prevClickId + 1);
      return;
    }

    if (gameStatus == "menu") {
      setMenuClickObserver((prevClickId) => prevClickId + 1);
      return;
    }

    if (gameStatus == "won" || gameStatus == "lost") {
      if (event.key == "Enter") setGameStatus("ready");
      if (event.key == "Escape") setGameStatus("menu");
    }
  };
  useEffect(() => {
    window.addEventListener("keydown", handleKeydown);
    return () => {
      window.removeEventListener("keydown", handleKeydown);
    };
  });

  useEffect(() => {
    if (gameStatus == "ready") setShowGame(true);
    if (gameStatus == "menu") setShowGame(false);
  }, [gameStatus]);

  return (
    <>
      {gameStatus == "menu" && (
        <Menu
          rules={props.rules}
          letters={letters}
          setLetters={setLetters}
          rows={rows}
          setRows={setRows}
          haveTimer={haveTimer}
          setHaveTimer={setHaveTimer}
          haveCountdown={haveCountdown}
          setHaveCountdown={setHaveCountdown}
          countdown={countdown}
          setCountdown={setCountdown}
          click={click}
          clickObserver={menuClickObserver}
          gameStatus={gameStatus}
          setGameStatus={setGameStatus}
        />
      )}
      {showGame && (
        <Game
          rows={rows}
          letters={letters}
          gameStatus={gameStatus}
          setGameStatus={setGameStatus}
          click={click}
          clickObserver={gameClickObserver}
          isLoggedIn={props.isLoggedIn}
          haveTimer={haveTimer}
          haveCountdown={haveCountdown}
          countdown={countdown}
        />
      )}
    </>
  );
}
