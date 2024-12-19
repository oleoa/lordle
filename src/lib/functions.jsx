import { allWords, answers } from "../assets/wordle.ts";
import AllAvaiableWords from "../assets/words.json";

import KeyboardStatus from "../assets/keyboard.json";

export const arraysEqual = (arr1, arr2) => {
  return (
    arr1.length === arr2.length &&
    arr1.every((val, index) => val === arr2[index])
  );
};

export const formatTime = (time) => {
  // Get the true values
  const trueCentiSeconds = time;
  const trueSeconds = trueCentiSeconds / 100;
  const trueMinutes = trueSeconds / 60;

  // Floor the values (3.2465 sec -> 3 sec)
  const flooredCentiSeconds = Math.floor(trueCentiSeconds);
  const flooredSeconds = Math.floor(trueSeconds);
  const flooredMinutes = Math.floor(trueMinutes);

  // Removes the reset (110 sec -> 50 sec)
  const formatedCentiSeconds = flooredCentiSeconds % 100;
  const formatedSeconds = flooredSeconds % 60;
  const formatedMinutes = flooredMinutes % 60;

  // Adds the remainings zeros (9 sec -> 09 sec)
  const finalCentiSeconds =
    formatedCentiSeconds < 10
      ? "0" + formatedCentiSeconds
      : formatedCentiSeconds;
  const finalSeconds =
    formatedSeconds < 10 ? "0" + formatedSeconds : formatedSeconds;
  const finalMinutes =
    formatedMinutes < 10 ? "0" + formatedMinutes : formatedMinutes;
  return (
    <>
      <span className="flex w-40">
        {finalMinutes}:{finalSeconds}:{finalCentiSeconds}
      </span>
    </>
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
