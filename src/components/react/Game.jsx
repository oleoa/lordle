import { useEffect, useState } from "react";
import LetterSquare from "./LetterSquare";
import alphabet from "../../assets/alphabet.json";

export default function Game(props) {
  // Indicates the rules the game will be played with
  const chosenWord = props.chosenWord;
  const rows = props.rows;
  const letters = props.letters;

  // Indicates where the user is typing
  const [currentRow, setCurrentRow] = useState(0);
  const [currentLetter, setCurrentLetter] = useState(0);

  // Creates the spaces for the letters and colors to be filled
  const [colors, setColors] = useState(Array(rows).fill([]));
  const [keys, setKeys] = useState(Array(rows).fill([]));
  const setKey = (row, letter, value) => {
    let newKeys = keys.map((rowArr) => [...rowArr]);
    newKeys[row][letter] = value;
    setKeys(newKeys);
  };
  const unsetKey = (row, letter) => {
    let newKeys = keys.map((rowArr) => [...rowArr]);
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
  useEffect(() => {
    const avaiableKeys = alphabet;
    avaiableKeys.push(...["Enter", "Backspace", "Escape"]);
    if (!avaiableKeys.includes(props.click)) return;

    if (props.click == "Enter") {
      // Get the written word in an array
      const writtenWord = keys[currentRow];

      // If the written word is shorter than the whole length returns
      if (writtenWord.length < props.letters) return;

      // Checks if the word is a word
      if (!props.avaiableWords.includes(writtenWord.join(""))) return;

      // Checks if there is any compatibility and colors it
      // TO FIX THE DUPLICATE CASE LETTER
      let chosenWordArray = chosenWord.split("");
      let newColor = colors.map((rowArr) => [...rowArr]);
      for (let i = 0; i < writtenWord.length; i++) {
        if (writtenWord[i] == chosenWordArray[i]) {
          newColor[currentRow][i] = "green";
        } else if (chosenWordArray.includes(writtenWord[i])) {
          newColor[currentRow][i] = "yellow";
        } else {
          newColor[currentRow][i] = "gray";
        }
      }
      setColors(newColor);

      // Checks if the written word is equal to the chosen one
      if (
        writtenWord.every((value, index) => value === chosenWordArray[index])
      ) {
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
  }, [props.clickId]);

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

  return (
    <div className="flex flex-col items-center justify-center gap-4 w-full">
      <div
        className="grid gap-4"
        style={{
          gridTemplateColumns: "repeat(" + letters + ", minmax(0, 1fr))",
        }}
      >
        {lettersSquares}
      </div>
    </div>
  );
}
