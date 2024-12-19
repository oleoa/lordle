import { useEffect, useState, useRef } from "react";

import VirtualKeyboard from "./VirtualKeyboard";
import TypedMap from "./TypedMap";

import {
  getCleanVirtualKeyboard,
  setNewTypedMapPressedKey,
  setNewTypedMapDeleteKey,
  setNewTypedMapStatus,
  arraysEqual,
} from "../../lib/functions";

import alphabet from "../../assets/alphabet.json";

export default function Game(props) {
  const isFirstRender = useRef(true); // Track for the click to know if it is the first render
  const [currentRow, setCurrentRow] = useState(0); // Indicates what row is the player in
  const [cl, setCurrentLetter] = useState(0); // Indicates what letter is the player typing
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

  // Tracks the users keyboard while in game
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    const avaiableKeys = [...alphabet];
    avaiableKeys.push(...["Enter", "Backspace", "Escape", "/"]);
    if (!avaiableKeys.includes(props.click)) return;

    if (props.click == "Enter") {
      // Get the written word and the answer in array
      const writtenWordArray = typedMap[currentRow].map((ww) => ww.typed);
      const answerArray = props.answer.split("");

      // If the written word is shorter than the whole length returns
      if (writtenWordArray.filter((wwa) => wwa).length < props.letters) {
        props.setMessage(["Not full length", "alert"]);
        return;
      }

      // Checks if the word is a word
      if (!props.avaiableWords.includes(writtenWordArray.join(""))) {
        props.setMessage(["That is not a word", "alert"]);
        return;
      }

      let tempAnswerVerify = [...answerArray];
      let tempGuessVerify = [...writtenWordArray];
      let newTypedMap = [...typedMap];

      for (let cl = 0; cl < props.letters; cl++) {
        if (tempAnswerVerify[cl] == tempGuessVerify[cl]) {
          newTypedMap = setNewTypedMapStatus(
            newTypedMap,
            currentRow,
            cl,
            "correct",
          );
          const currentLetterBeingAnalised = tempGuessVerify[cl];
          setVirtualKeyboard((vk) => {
            return {
              ...vk,
              [currentLetterBeingAnalised]: {
                ...vk[currentLetterBeingAnalised],
                state: 200,
              },
            };
          });
          tempAnswerVerify[cl] = "";
          tempGuessVerify[cl] = "";
        }
      }
      for (let cl = 0; cl < props.letters; cl++) {
        if (
          tempGuessVerify[cl] &&
          tempAnswerVerify.includes(tempGuessVerify[cl])
        ) {
          newTypedMap = setNewTypedMapStatus(
            newTypedMap,
            currentRow,
            cl,
            "init",
          );
          const currentLetterBeingAnalised = tempGuessVerify[cl];
          setVirtualKeyboard((vk) => {
            if (vk[currentLetterBeingAnalised].state != 0) return vk;
            return {
              ...vk,
              [currentLetterBeingAnalised]: {
                ...vk[currentLetterBeingAnalised],
                state: 100,
              },
            };
          });
          tempAnswerVerify[tempAnswerVerify.indexOf(tempGuessVerify[cl])] = "";
          tempGuessVerify[cl] = "";
        }
      }
      for (let cl = 0; cl < props.letters; cl++) {
        if (tempGuessVerify[cl]) {
          newTypedMap = setNewTypedMapStatus(newTypedMap, currentRow, cl, "no");
          const currentLetterBeingAnalised = tempGuessVerify[cl];
          setVirtualKeyboard((vk) => {
            if (vk[currentLetterBeingAnalised].state != 0) return vk;
            return {
              ...vk,
              [currentLetterBeingAnalised]: {
                ...vk[currentLetterBeingAnalised],
                state: 404,
              },
            };
          });
        }
      }
      setTypedMap(newTypedMap);

      // Checks if the written word is equal to the chosen one
      if (arraysEqual(writtenWordArray, answerArray)) {
        props.setGameStatus("won");
        return;
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
    }

    // Takes the player back to the menu
    if (props.click == "Escape") props.setGameStatus("menu");

    // Resets the game
    if (props.click == "/") props.setGameStatus("lost");

    // Deletes a letter
    if (props.click == "Backspace") {
      // Deletes one character
      if (cl == 0) return;
      setTypedMap(setNewTypedMapDeleteKey(typedMap, currentRow, cl));
      setCurrentLetter((cl) => cl - 1);
      return;
    }

    // Add a new letter
    if (alphabet.includes(props.click)) {
      if (cl > props.letters - 1) return;
      setTypedMap(
        setNewTypedMapPressedKey(typedMap, currentRow, cl, props.click),
      );
      setCurrentLetter((cl) => cl + 1);
      return;
    }
  }, [props.clickObserver]);

  // Tracks if the game has restarted and cleans up the old stats
  useEffect(() => {
    if (props.gameStatus == "ready") {
      setCurrentRow(0);
      setCurrentLetter(0);
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
    if (props.gameStatus == "won") {
      if (!props.isLoggedIn)
        props.setMessage(["Log in to save the records", "info"]);
      else props.setAttempts(typedMap);
    }
  }, [props.gameStatus]);

  return (
    <div className="flex flex-col items-center justify-center gap-12 w-full">
      <TypedMap typedMap={typedMap} />
      <VirtualKeyboard virtualKeyboard={virtualKeyboard} />
    </div>
  );
}
