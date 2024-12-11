import { useEffect, useState } from "react";

export default function LetterSquare(props) {
  let color;
  if (props.color == "gray") color = "rgba(125, 132, 145)";
  if (props.color == "green") color = "rgba(77, 170, 87)";
  if (props.color == "yellow") color = "rgba(255, 200, 87)";

  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    if (!props.letter) return;
    setAnimate(true);
    return () => {
      setAnimate(false);
    };
  }, [props.letter]);

  return (
    <div
      id={props.chance}
      className={
        "w-16 h-16 border-2 border-white rounded-lg flex items-center justify-center bg " +
        (animate && "giggle")
      }
      style={{ backgroundColor: color }}
    >
      <p className="text-xl font-bold">{props.letter}</p>
    </div>
  );
}
