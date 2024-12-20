import { useEffect, useState, useRef } from "react";

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
  getLastUserRecord,
  setNewUserRecord,
  createNewRandomAnswer,
  createNewAvaiableGuesses,
  arraysEqual,
} from "../../lib/functions";

import alphabet from "../../assets/alphabet.json";

export default function Game(props) {
  const isFirstRender = useRef(true); // Track for the click to know if it is the first render

  const [avaiableWords, setAvaiableWords] = useState([]); // List of all words the player can guess
  const [answer, setAnswer] = useState(""); // The only correct answer

  const [currentRow, setCurrentRow] = useState(0); // Indicates what row is the player in
  const [cl, setCurrentLetter] = useState(0); // Indicates what letter is the player typing

  const [lastRecord, setLastRecord] = useState(null); // The last record in time of the current player
  const [lastWonInCs, setLastWonInCs] = useState(0); // The time it took for player to win the last game
  const [attempts, setAttempts] = useState(null); // The map of the typed letters used for the records

  const [message, setMessage] = useState(["", ""]); // The message that appears on the bottom of the screen

  const [virtualKeyboard, setVirtualKeyboard] = useState(
    getCleanVirtualKeyboard(),
  ); // The virtual keyboard

  const [typedMap, setTypedMap] = useState(
    Array(props.rows).fill(
      Array(props.letters).fill({
        typed: "", // The letter
        status: "", // ["no", "init", "correct"]
      }),
    ),
  ); // The map of the typed letters

  const giveUp = () => {
    props.setGameStatus("lost");
  };
  const returnMenu = () => {
    props.setGameStatus("menu");
  };
  const backspace = () => {
    if (cl == 0) return;
    setTypedMap(setNewTypedMapDeleteKey(typedMap, currentRow, cl));
    setCurrentLetter((cl) => cl - 1);
    return;
  };
  const addLetter = (letter) => {
    if (cl > props.letters - 1) return;
    setTypedMap(setNewTypedMapPressedKey(typedMap, currentRow, cl, letter));
    setCurrentLetter((cl) => cl + 1);
    return;
  };
  const enterClick = () => {
    // Get the written word and the answer in array
    const writtenWordArray = typedMap[currentRow].map((ww) => ww.typed);
    const answerArray = answer.split("");

    // If the written word is shorter than the whole length returns
    if (writtenWordArray.filter((wwa) => wwa).length < props.letters) {
      setMessage(["Not full length", "alert"]);
      return;
    }

    // Checks if the word is a word
    if (!avaiableWords.includes(writtenWordArray.join(""))) {
      setMessage(["That is not a word", "alert"]);
      return;
    }

    // Creates both the new TypedMap and VirtualKeyboard
    let [newTypedMap, newVirtualKeyboard] =
      setNewTypedMapAndVirtualKeyboardFromWrittenWord(
        props.letters,
        currentRow,
        answerArray,
        writtenWordArray,
        typedMap,
        virtualKeyboard,
      );
    setTypedMap(newTypedMap);
    setVirtualKeyboard(newVirtualKeyboard);

    // Checks if the written word is equal to the chosen one
    if (arraysEqual(writtenWordArray, answerArray)) {
      props.setGameStatus("won");
      if (!props.isLoggedIn) setMessage(["Log in to save the records", "info"]);
      else setAttempts(typedMap);
    } else {
      // If it is not it checks if the user lost
      if (currentRow >= props.rows - 1) {
        props.setGameStatus("lost");
        return;
      }

      // If the player didn't lose it passes to the next line
      setCurrentRow((prevRow) => prevRow + 1);
      setCurrentLetter(0);
      return;
    }
  };

  const userActions = {
    backspace,
    addLetter,
    enterClick,
  };

  // Tracks the users keyboard while in game
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    const avaiableKeys = [...alphabet];
    avaiableKeys.push(...["Enter", "Backspace", "Escape", "/"]);
    if (!avaiableKeys.includes(props.click)) return;

    // Checks if is full length, is a word, any close and corrects
    if (props.click == "Enter") enterClick();

    // Takes the player back to the menu
    if (props.click == "Escape") returnMenu();

    // Resets the game
    if (props.click == "/") giveUp();

    // Deletes a letter
    if (props.click == "Backspace") backspace();

    // Add a new letter
    if (alphabet.includes(props.click)) addLetter(props.click);
  }, [props.clickObserver]);

  // Tracks if the game has restarted and cleans up the old stats
  useEffect(() => {
    if (props.gameStatus == "ready") {
      setCurrentRow(0);
      setCurrentLetter(0);
      setAnswer(createNewRandomAnswer(props.letters));
      setAvaiableWords(createNewAvaiableGuesses(props.letters));
      setTypedMap(
        Array(props.rows).fill(
          Array(props.letters).fill({
            typed: "", // The letter
            status: "", // ["no", "init", "correct"]
          }),
        ),
      );
      setVirtualKeyboard(getCleanVirtualKeyboard());
    }
  }, [props.gameStatus]);

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
          await setNewUserRecord(
            lastWonInCs,
            props.rows,
            props.letters,
            answer,
            attempts,
          );
        } catch (error) {
          console.error("Failed to set a new record:", error);
        }
      };
      asyncSetNewRecord();
    }
  }, [lastWonInCs]);

  return (
    <div className="flex flex-col items-center justify-center gap-12 w-full">
      <Message message={message} setMessage={setMessage} />
      <Shortcuts
        actions={{
          giveUp,
          returnMenu,
        }}
        lastRecord={lastRecord}
        gameStatus={props.gameStatus}
        answer={answer}
      />
      <TypedMap typedMap={typedMap} />
      <VirtualKeyboard virtualKeyboard={virtualKeyboard} />
      <Clock
        setLastWonInCs={setLastWonInCs}
        haveTimer={props.haveTimer}
        haveCountdown={props.haveCountdown}
        countdown={props.countdown}
        gameStatus={props.gameStatus}
        setGameStatus={props.setGameStatus}
      />
    </div>
  );
}
