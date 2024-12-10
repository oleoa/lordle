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
      const writtenWord = keys[currentRow];
      if (writtenWord.length < props.letters) return;
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

    if (props.gameStatus == "won") return;

    if (props.click == "Backspace") {
      if (currentLetter == 0) return;
      unsetKey(currentRow, currentLetter - 1);
      setCurrentLetter((prevLetter) => prevLetter - 1);
      return;
    }

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
    <div className="flex flex-col items-center justify-center gap-4">
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
