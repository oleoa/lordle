import { useEffect, useState } from "react";
import LetterSquare from "./LetterSquare";
import alphabet from "../../assets/alphabet.json";

export default function Game(props) {
  const chosenWord = "MAYBE";

  const rows = props.rows;
  const letters = props.letters;

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
  const unsetKey = (row, letter) => {
    let newKeys = keys.map((rowArr) => [...rowArr]);
    newKeys[row].splice([letter], 1);
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

  // ---------- Checks if the user clicked ----------
  useEffect(() => {
    // ---------- Checks if the click is part of the allowed clicks ----------
    const avaiableKeys = alphabet;
    avaiableKeys.push(...["Enter", "Backspace"]);
    if (!avaiableKeys.includes(props.click)) return;
    // ---------- Checks if the click is part of the allowed clicks ----------

    // ---------- If the user clicked "Enter" ----------
    if (props.click == "Enter") {
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

      if (
        writtenWord.every((value, index) => value === chosenWordArray[index])
      ) {
        props.setGameStatus("won");
      } else {
        setCurrentRow((prevRow) => prevRow + 1);
        setCurrentLetter(0);
      }
      return;
    }
    // ---------- If the user clicked "Enter" ----------

    if (props.gameStatus == "won") return;

    if (props.click == "Backspace") {
      if (currentLetter == 0) return;
      unsetKey(currentRow, currentLetter - 1);
      setCurrentLetter((prevLetter) => prevLetter - 1);
      return;
    }

    if (alphabet.includes(props.click)) {
      if (currentLetter > 4) return;
      const pressedKey = props.click.toUpperCase();
      setKey(currentRow, currentLetter, pressedKey);
      setCurrentLetter((prevLetter) => prevLetter + 1);
    }
  }, [props.clickId]);
  // ---------- Checks if the user clicked ----------

  return (
    <div className="w-96 flex flex-col items-center justify-center gap-4">
      <div className="grid grid-cols-5 gap-4">{lettersSquares}</div>
    </div>
  );
}
