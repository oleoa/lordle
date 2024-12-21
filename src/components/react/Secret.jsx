import { useState, useEffect } from "react";

import SecretAudio from "../../assets/secret.mp3";

export default function Secret(props) {
  const [clickHistory, setClickHistory] = useState([]); // Tracks the user click history for commands
  let audio;
  useEffect(() => {
    audio = document.getElementById("secretAudio");
  });

  useEffect(() => {
    setClickHistory((ch) => {
      const newSequence = [...ch, props.click.typed];
      const correctSequence = [
        "ArrowUp",
        "ArrowUp",
        "ArrowDown",
        "ArrowDown",
        "ArrowLeft",
        "ArrowRight",
        "ArrowLeft",
        "ArrowRight",
        "b",
        "a",
      ].join("");
      const sequenceSent = newSequence.join("");
      const hasSecretShortcut = sequenceSent.includes(correctSequence);
      if (hasSecretShortcut) {
        setClickHistory([]);
        audio.play();
      }
      return newSequence;
    });
  }, [props.click.observer]);

  return <audio id="secretAudio" src={SecretAudio}></audio>;
}
