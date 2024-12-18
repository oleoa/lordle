import { useEffect, useState, useRef } from "react";
import LetterSquare from "./LetterSquare";
import alphabet from "../../assets/alphabet.json";

export default function Game(props) {
  // Indicates the rules the game will be played with
  const answer = props.answer;
  const rows = props.rows;
  const letters = props.letters;

  // Indicates where the user is typing
  const [currentRow, setCurrentRow] = useState(0);
  const [currentLetter, setCurrentLetter] = useState(0);

  // Creates the spaces for the letters and colors to be filled
  const [colors, setColors] = useState(Array(rows).fill([]));

  // Functions to set and unset a specific key when typing
  const [keys, setKeys] = useState(Array(rows).fill([]));
  const setKey = (row, letter, value) => {
    let newKeys = JSON.parse(JSON.stringify(keys));
    newKeys[row][letter] = value;
    setKeys(newKeys);
  };
  const unsetKey = (row, letter) => {
    let newKeys = JSON.parse(JSON.stringify(keys));
    newKeys[row].splice([letter], 1);
    setKeys(newKeys);
  };

  // Check if the game has restarted
  useEffect(() => {
    setKeys(Array(rows).fill([]));
    setColors(Array(rows).fill([]));
    setCurrentRow(0);
    setCurrentLetter(0);
  }, [props.round]);

  // Tracks the users keyboard while in game
  const isFirstRender = useRef(true);
  useEffect(() => {
    if (isFirstRender.current) {
      // Skip the first run
      isFirstRender.current = false;
      return;
    }

    const avaiableKeys = alphabet;
    avaiableKeys.push(...["Enter", "Backspace", "Escape"]);
    if (!avaiableKeys.includes(props.click)) return;

    if (props.click == "Enter") {
      // Get the written word in an array
      const writtenWord = keys[currentRow];

      // If the written word is shorter than the whole length returns
      if (writtenWord.length < props.letters) {
        props.setMessage(["Not full length", "alert"]);
        return;
      }

      // Checks if the word is a word
      if (!props.avaiableWords.includes(writtenWord.join(""))) {
        props.setMessage(["That is not a word", "alert"]);
        return;
      }

      // Checks if there is any compatibility and colors it
      let answerArray = answer.split("");
      let newColor = colors.map((rowArr) => [...rowArr]);
      let newKeyboard = { ...props.virtualKeyboard };
      let tempChosenVerify = [...answerArray];
      let tempWrittenVerify = [...writtenWord];
      for (let i = 0; i < tempWrittenVerify.length; i++) {
        if (tempWrittenVerify[i] == tempChosenVerify[i]) {
          newKeyboard[tempWrittenVerify[i]].state = "200";
          tempChosenVerify[i] = "";
          tempWrittenVerify[i] = "";
          newColor[currentRow][i] = "green";
        }
      }
      for (let i = 0; i < writtenWord.length; i++) {
        if (
          tempWrittenVerify[i] &&
          tempChosenVerify.includes(tempWrittenVerify[i])
        ) {
          if (newKeyboard[tempWrittenVerify[i]].state != "200")
            newKeyboard[tempWrittenVerify[i]].state = "100";
          tempChosenVerify[tempChosenVerify.indexOf(tempWrittenVerify[i])] = "";
          tempWrittenVerify[i] = "";
          newColor[currentRow][i] = "yellow";
        }
      }
      for (let i = 0; i < writtenWord.length; i++) {
        if (tempWrittenVerify[i]) {
          if (
            newKeyboard[tempWrittenVerify[i]].state != "200" &&
            newKeyboard[tempWrittenVerify[i]].state != "100"
          )
            newKeyboard[tempWrittenVerify[i]].state = "404";
          newColor[currentRow][i] = "gray";
        }
      }
      setColors(newColor);
      props.setVirtualKeyboard(newKeyboard);

      // Checks if the written word is equal to the chosen one
      if (writtenWord.every((value, index) => value === answerArray[index])) {
        props.setGameStatus("won");
        return;
      } else {
        // If it is not it checks if the user lost
        if (currentRow >= rows - 1) {
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
    if (props.click == "Escape") {
      props.setGameStatus("menu");
      return;
    }

    // Deletes one character
    if (props.click == "Backspace") {
      if (currentLetter == 0) return;
      unsetKey(currentRow, currentLetter - 1);
      setCurrentLetter((prevLetter) => prevLetter - 1);
      return;
    }

    // Add a new letter
    if (alphabet.includes(props.click)) {
      if (currentLetter > props.letters - 1) return;
      const pressedKey = props.click.toUpperCase();
      setKey(currentRow, currentLetter, pressedKey);
      setCurrentLetter((prevLetter) => prevLetter + 1);
    }
  }, [props.clickObserver]);

  // Creates the components
  let lettersSquares = [];
  for (let i = 0; i < rows; i++) {
    lettersSquares[i] = [];
    for (let n = 0; n < letters; n++) {
      lettersSquares[i][n] = (
        <LetterSquare
          letter={keys[i][n]}
          color={colors[i][n]}
          key={i + "" + n}
        />
      );
    }
  }

  // Divide the lettersSquares into two differents arrays
  let midIndex = Math.ceil(lettersSquares.length / 2);
  let firstLettersSquaresHalf = lettersSquares.slice(0, midIndex);
  let secondLettersSquaresHalf = lettersSquares.slice(midIndex);

  return (
    <div className="flex items-center justify-center gap-12 w-full">
      {rows < 8 && (
        <div
          className="grid gap-4"
          style={{
            gridTemplateColumns: "repeat(" + letters + ", minmax(0, 1fr))",
          }}
        >
          {lettersSquares}
        </div>
      )}
      {rows >= 8 && (
        <>
          <div
            className="grid gap-4"
            style={{
              gridTemplateColumns: "repeat(" + letters + ", minmax(0, 1fr))",
            }}
          >
            {firstLettersSquaresHalf}
          </div>
          <div
            className="grid gap-4"
            style={{
              gridTemplateColumns: "repeat(" + letters + ", minmax(0, 1fr))",
            }}
          >
            {secondLettersSquaresHalf}
          </div>
        </>
      )}
    </div>
  );
}
