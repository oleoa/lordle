import { allWords, answers } from "../assets/wordle.ts";
import AllAvaiableWords from "../assets/words.json";

import KeyboardStatus from "../assets/keyboard.json";

export const arraysEqual = (arr1, arr2) => {
  return (
    arr1.length === arr2.length &&
    arr1.every((val, index) => val === arr2[index])
  );
};

export const createNewRandomAnswer = (numberOfLetters) => {
  const allAvaiableAnswers =
    numberOfLetters == 5 ? [...answers] : [...AllAvaiableWords];
  const allFilteredAvaiableAnswers = allAvaiableAnswers.filter(
    (word) => word.length == numberOfLetters,
  );
  const randomKeyInRange =
    Math.floor(
      Math.random() * (allFilteredAvaiableAnswers.length - 1 - 0 + 1),
    ) + 0;
  return allFilteredAvaiableAnswers[randomKeyInRange].toUpperCase();
};

export const createNewAvaiableGuesses = (numberOfLetters) => {
  const allAvaiableGuesses =
    numberOfLetters == 5 ? [...allWords] : [...AllAvaiableWords];
  return allAvaiableGuesses.map((word) => {
    return word.toUpperCase();
  });
};

export const getCleanVirtualKeyboard = () => {
  return JSON.parse(JSON.stringify(KeyboardStatus));
};

export const getLastUserRecord = async () => {
  const response = await fetch("/api/records");
  const data = await response.json();
  const times = data.map((r) => {
    return r.time;
  });
  return Math.min(...times);
};

export const setNewUserRecord = async (
  lastWonInCs,
  rows,
  letters,
  answer,
  attempts,
) => {
  const response = await fetch("/api/records", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      time: lastWonInCs,
      rows: rows,
      letters: letters,
      answer: answer,
      attempts: attempts,
    }),
  });
  return response;
};

export const setNewTypedMapPressedKey = (
  typedMap,
  currentRow,
  currentLetter,
  typed,
) => {
  const nextTypedMap = typedMap.map((rowsOnTypedMap, currentRowOnMap) => {
    if (currentRowOnMap != currentRow) return rowsOnTypedMap;
    const newRow = rowsOnTypedMap.map((letter, index) => {
      if (index != currentLetter) return letter;
      return {
        typed: typed.toUpperCase(),
        status: "",
      };
    });
    return newRow;
  });
  return nextTypedMap;
};

export const setNewTypedMapDeleteKey = (
  typedMap,
  currentRow,
  currentLetter,
) => {
  const nextTypedMap = typedMap.map((rowsOnTypedMap, currentRowOnMap) => {
    if (currentRowOnMap != currentRow) return rowsOnTypedMap;
    const newRow = rowsOnTypedMap.map((letter, index) => {
      if (index != currentLetter - 1) return letter;
      return {
        typed: "",
        status: "",
      };
    });
    return newRow;
  });
  return nextTypedMap;
};

export const setNewTypedMapStatus = (
  typedMap,
  currentRow,
  currentLetter,
  status,
) => {
  const nextTypedMap = typedMap.map((rowsOnTypedMap, currentRowOnMap) => {
    if (currentRowOnMap != currentRow) return rowsOnTypedMap;
    const newRow = rowsOnTypedMap.map((letter, index) => {
      if (index != currentLetter) return letter;
      return {
        ...letter,
        status: status,
      };
    });
    return newRow;
  });
  return nextTypedMap;
};

export const setNewTypedMapAndVirtualKeyboardFromWrittenWord = (
  letters,
  currentRow,
  answerArray,
  writtenWordArray,
  typedMap,
  virtualKeyboard,
) => {
  let tempAnswerVerify = [...answerArray];
  let tempGuessVerify = [...writtenWordArray];
  let newTypedMap = [...typedMap];
  let newVirtualKeyboard = { ...virtualKeyboard };

  for (let cl = 0; cl < letters; cl++) {
    if (tempAnswerVerify[cl] == tempGuessVerify[cl]) {
      newTypedMap = setNewTypedMapStatus(
        newTypedMap,
        currentRow,
        cl,
        "correct",
      );
      newVirtualKeyboard = {
        ...newVirtualKeyboard,
        [tempGuessVerify[cl]]: {
          ...newVirtualKeyboard[tempGuessVerify[cl]],
          state: 200,
        },
      };
      tempAnswerVerify[cl] = "";
      tempGuessVerify[cl] = "";
    }
  }
  for (let cl = 0; cl < letters; cl++) {
    if (tempGuessVerify[cl] && tempAnswerVerify.includes(tempGuessVerify[cl])) {
      newTypedMap = setNewTypedMapStatus(newTypedMap, currentRow, cl, "init");
      if (newVirtualKeyboard[tempGuessVerify[cl]].state != 200) {
        newVirtualKeyboard = {
          ...newVirtualKeyboard,
          [tempGuessVerify[cl]]: {
            ...newVirtualKeyboard[tempGuessVerify[cl]],
            state: 100,
          },
        };
      }
      tempAnswerVerify[tempAnswerVerify.indexOf(tempGuessVerify[cl])] = "";
      tempGuessVerify[cl] = "";
    }
  }
  for (let cl = 0; cl < letters; cl++) {
    if (tempGuessVerify[cl]) {
      newTypedMap = setNewTypedMapStatus(newTypedMap, currentRow, cl, "no");
      if (
        newVirtualKeyboard[tempGuessVerify[cl]].state != 200 ||
        newVirtualKeyboard[tempGuessVerify[cl]].state != 100
      ) {
        newVirtualKeyboard = {
          ...newVirtualKeyboard,
          [tempGuessVerify[cl]]: {
            ...newVirtualKeyboard[tempGuessVerify[cl]],
            state: 404,
          },
        };
      }
    }
  }
  return [newTypedMap, newVirtualKeyboard];
};
