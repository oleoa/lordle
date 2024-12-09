import { useEffect, useState } from "react";
import LetterSquare from "./LetterSquare";
import alphabet from "../../assets/alphabet.json";

export default function Board() {
  const chosenWord = "MAYBE";

  const rows = 6;
  const letters = 5;

  let lettersSquares = [];
  let keysArray = [];
  let colorsArray = [];
  for (let i = 0; i < rows; i++) {
    keysArray[i] = [];
    colorsArray[i] = [];
    for (let n = 0; n < letters; n++) {
      keysArray[i][n];
      colorsArray[i][n];
    }
  }

  const [keys, setKeys] = useState(keysArray);
  const setKey = (row, letter, value) => {
    let newKeys = keys.map((rowArr) => [...rowArr]);
    newKeys[row][letter] = value;
    setKeys(newKeys);
  };

  const [colors, setColors] = useState(colorsArray);

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

  const [currentRow, setCurrentRow] = useState(0);
  const [currentLetter, setCurrentLetter] = useState(0);

  const handleKeydown = (event) => {
    console.log("Is listening!");

    const avaiableKeys = alphabet;
    avaiableKeys.push(...["Enter", "Backspace"]);
    if (!avaiableKeys.includes(event.key)) return;

    if (event.key == "Enter") {
      const writtenWord = keys[currentRow];
      if (writtenWord.length < 5) return;
      let chosenWordArray = chosenWord.split("");
      let newColor = colors.map((rowArr) => [...rowArr]);
      for (let i = 0; i < writtenWord.length; i++) {
        if (writtenWord[i] == chosenWordArray[i]) {
          newColor[currentRow][i] = "green";
        } else if (chosenWordArray.includes(writtenWord[i])) {
          newColor[currentRow][i] = "yellow";
        }
      }
      setColors(newColor);
      setCurrentRow((prevRow) => prevRow + 1);
      setCurrentLetter(0);
      return;
    }

    if (event.key == "Backspace") {
      if (currentLetter == 0) return;
      setKey(currentRow, currentLetter - 1, "");
      setCurrentLetter((prevLetter) => prevLetter - 1);
      return;
    }

    if (alphabet.includes(event.key)) {
      if (currentLetter > 4) return;
      const pressedKey = event.key.toUpperCase();
      setKey(currentRow, currentLetter, pressedKey);
      setCurrentLetter((prevLetter) => prevLetter + 1);
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeydown);
    return () => {
      window.removeEventListener("keydown", handleKeydown);
    };
  });

  return (
    <div className="w-96 flex flex-col items-center justify-center gap-4">
      <div className="grid grid-cols-5 gap-4">{lettersSquares}</div>
    </div>
  );
}
