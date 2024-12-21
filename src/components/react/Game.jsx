import { useEffect, useState } from "react";

import VirtualKeyboard from "./VirtualKeyboard";
import TypedMap from "./TypedMap";
import Clock from "./Clock";
import Shortcuts from "./Shortcuts";
import Message from "./Message";

import {
  setNewTypedMapAndVirtualKeyboardFromWrittenWord,
  getCleanVirtualKeyboard,
  setNewTypedMapPressedKey,
  setNewTypedMapDeleteKey,
  getBestUserRecord,
  setNewUserRecord,
  createNewRandomAnswer,
  createNewAvaiableGuesses,
  arraysEqual,
} from "../../lib/functions";

import alphabet from "../../assets/alphabet.json";

export default function Game(props) {
  const [status, setStatus] = useState("loading"); // ["loading", "ready", "playing", "won", "lost"]
  const [message, setMessage] = useState(["", ""]); // The message that appears on the bottom of the screen, ["alert", "info", "congrats"]
  const [bestRecord, setBestRecord] = useState(null); // The best record in time of the current player
  const [lastWinTime, setLastWinTime] = useState(0); // The time it took for player to win the last game
  const [words, setWords] = useState({
    avaiable: [],
    answer: "",
  });
  const [position, setPosition] = useState({
    row: 0,
    letter: 0,
  });
  const [virtualKeyboard, setVirtualKeyboard] = useState(
    getCleanVirtualKeyboard(),
  );
  const [typedMap, setTypedMap] = useState(
    Array(props.rules.rows).fill(
      Array(props.rules.letters).fill({
        typed: "", // The letter
        status: "", // ["no", "init", "correct"]
      }),
    ),
  ); // The map of the typed letters

  const giveUp = () => {
    setStatus("lost");
  };
  const returnMenu = () => {
    props.setPage("menu");
  };
  const playAgain = () => {
    setStatus("loading");
  };
  const backspace = () => {
    if (position.letter == 0) return;
    setTypedMap(
      setNewTypedMapDeleteKey(typedMap, position.row, position.letter),
    );
    setPosition((p) => {
      return {
        ...p,
        letter: p.letter - 1,
      };
    });
    return;
  };
  const addLetter = (letter) => {
    if (position.letter > props.rules.letters - 1) return;
    setTypedMap(
      setNewTypedMapPressedKey(typedMap, position.row, position.letter, letter),
    );
    setPosition((p) => {
      return {
        ...p,
        letter: p.letter + 1,
      };
    });
    return;
  };
  const enter = () => {
    // Get the written word and the answer in array
    const writtenWordArray = typedMap[position.row].map((ww) => ww.typed);
    const answerArray = words.answer.split("");

    // If the written word is shorter than the whole length returns
    if (writtenWordArray.filter((wwa) => wwa).length < props.rules.letters) {
      setMessage(["Not full length", "alert"]);
      return;
    }

    // Checks if the word is a word
    if (!words.avaiable.includes(writtenWordArray.join(""))) {
      setMessage(["That is not a word", "alert"]);
      return;
    }

    // Creates both the new TypedMap and VirtualKeyboard
    let [newTypedMap, newVirtualKeyboard] =
      setNewTypedMapAndVirtualKeyboardFromWrittenWord(
        props.rules.letters,
        position.row,
        answerArray,
        writtenWordArray,
        typedMap,
        virtualKeyboard,
      );
    setTypedMap(newTypedMap);
    setVirtualKeyboard(newVirtualKeyboard);

    // Checks if the written word is equal to the chosen one
    if (arraysEqual(writtenWordArray, answerArray)) {
      setStatus("won");
      return;
    }

    // If it is not it checks if the user lost
    if (position.row >= props.rules.rows - 1) {
      setStatus("lost");
      return;
    }

    // If the player didn't lose nor won it passes to the next line
    setPosition((p) => {
      return {
        row: p.row + 1,
        letter: 0,
      };
    });
  };

  const handleClick = (click) => {
    if (click.typed == "") return;
    if (click.address != "game") return;
    const authorized = [...alphabet, "Enter", "Backspace", "Escape", "/"];
    if (!authorized.includes(click.typed)) return;

    if (status == "loading") return;

    if (status == "ready" || status == "playing") {
      if (status == "ready") setStatus("playing");
      if (click.typed == "Enter") enter();
      if (click.typed == "Escape") returnMenu();
      if (click.typed == "/") giveUp();
      if (click.typed == "Backspace") backspace();
      if (alphabet.includes(click.typed)) addLetter(click.typed);
      return;
    }

    if (status == "won" || status == "lost") {
      if (click.typed == "Enter") playAgain();
      if (click.typed == "Escape") returnMenu();
      return;
    }
  };
  useEffect(() => {
    handleClick(props.click);
  }, [props.click.observer]);

  useEffect(() => {
    if (status == "loading") {
      setPosition(() => {
        return {
          row: 0,
          letter: 0,
        };
      });
      setWords(() => {
        return {
          answer: createNewRandomAnswer(props.rules.letters),
          avaiable: createNewAvaiableGuesses(props.rules.letters),
        };
      });
      setTypedMap(
        Array(props.rules.rows).fill(
          Array(props.rules.letters).fill({
            typed: "", // The letter
            status: "", // ["no", "init", "correct"]
          }),
        ),
      );
      setVirtualKeyboard(getCleanVirtualKeyboard());
      if (props.isLoggedIn) {
        const asyncFetchUserRecord = async () => {
          try {
            const br = await getBestUserRecord();
            setBestRecord(br);
          } catch (error) {
            console.error("Failed to fetch the last user record:", error);
          }
        };
        asyncFetchUserRecord();
      }
      setStatus("ready");
    }
    if (status == "won") {
      if (!props.isLoggedIn) setMessage(["Log in to save the records", "info"]);
      else {
        if (lastWinTime && lastWinTime < bestRecord) {
          setMessage(["New Record!", "congrats"]);
          setBestRecord(lastWinTime);
          const asyncSetNewRecord = async () => {
            try {
              await setNewUserRecord(
                lastWinTime,
                props.rules.rows,
                props.rules.letters,
                words.answer,
                typedMap,
              );
            } catch (error) {
              console.error("Failed to set a new record:", error);
            }
          };
          asyncSetNewRecord();
        }
      }
    }
  }, [status]);

  return (
    <div className="flex flex-col items-center justify-center gap-12 w-full">
      <Message message={message} setMessage={setMessage} />
      <Shortcuts
        actions={{
          giveUp,
          returnMenu,
          playAgain,
        }}
        lastRecord={bestRecord}
        gameStatus={status}
        answer={words.answer}
      />
      <TypedMap typedMap={typedMap} />
      <VirtualKeyboard
        virtualKeyboard={virtualKeyboard}
        handleClick={handleClick}
      />
      <Clock
        rules={props.rules}
        setLastWinTime={setLastWinTime}
        gameStatus={status}
        setGameStatus={setStatus}
      />
    </div>
  );
}
