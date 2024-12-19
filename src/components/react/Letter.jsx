import { useEffect, useRef, useState } from "react";

export default function Letter(props) {
  let color;
  if (props.status == "no") color = "rgba(125, 132, 145)";
  if (props.status == "init") color = "rgba(255, 200, 87)";
  if (props.status == "correct") color = "rgba(77, 170, 87)";

  const [animationKey, setAnimationKey] = useState(0);
  const [animate, setAnimate] = useState(false);
  const firstRender = useRef(true);

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    setAnimate(true);
    setAnimationKey((ak) => ak + 1);
  }, [props.letter]);

  return (
    <div
      id={props.chance}
      key={animationKey}
      className={
        "w-16 h-16 border-2 border-white rounded-lg flex items-center justify-center bg-blur " +
        (animate && "giggle")
      }
      style={{ backgroundColor: color }}
    >
      <p className="text-xl font-bold">{props.letter}</p>
    </div>
  );
}
