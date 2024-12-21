import { useState, useRef, useEffect } from "react";

export default function VirtualKey(props) {
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
  }, [props.state]);

  let color;
  if (props.state == 0) color = "bg-white border-white text-black";
  if (props.state == 404) color = "";
  if (props.state == 100) color = "bg-yellow border-yellow";
  if (props.state == 200) color = "bg-green border-green";

  return (
    <button
      key={animationKey}
      className={
        (props.isKeyshort ? "px-2 " : "w-8 ") +
        "h-8 transition-all duration-500 border-2 rounded-lg flex items-center justify-center " +
        color +
        " " +
        (animate && " giggle")
      }
      onClick={(e) => {
        e.target.blur();
        props.handleClick({
          typed: props.keyboardKey,
          address: "game",
        });
      }}
    >
      {props.keyboardKey}
    </button>
  );
}
