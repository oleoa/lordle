import { useEffect, useState } from "react";

import Game from "./Game";
import Menu from "./Menu";

export default function Root(props) {
  const [click, setClick] = useState({ typed: "", observer: 0, address: "" }); // { typed: "A", observer: 23, address: "game" }
  const [page, setPage] = useState("menu"); // ["menu", "game"]
  const [rules, setRules] = useState({
    rows: 6,
    letters: 5,
    showTimer: true,
    haveCountdown: false,
    countdown: 60,
  });

  // Handle the keyboard click
  const handleKeydown = (event) => {
    setClick((t) => {
      return {
        typed: event.key,
        observer: t.observer + 1,
        address: page,
      };
    });
  };
  useEffect(() => {
    window.addEventListener("keydown", handleKeydown);
    return () => {
      window.removeEventListener("keydown", handleKeydown);
    };
  });

  return (
    <>
      {page == "menu" && (
        <Menu
          env={props.env}
          rules={rules}
          setRules={setRules}
          click={click}
          setPage={setPage}
        />
      )}
      {page == "game" && (
        <Game
          isLoggedIn={props.isLoggedIn}
          rules={rules}
          click={click}
          setPage={setPage}
        />
      )}
    </>
  );
}
