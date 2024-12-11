import { useEffect, useState } from "react";

export default function Testing() {
  const [counter, setCounter] = useState(0);

  const handleKeydown = () => {
    setCounter(counter + 1);
    logCounter();
  };

  const logCounter = () => {
    console.log(counter);
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeydown);
    return () => {
      window.removeEventListener("keydown", handleKeydown);
    };
  }, [counter]);

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <h1 className="text-4xl">Testing</h1>
      <h2 className="text-3xl">{counter}</h2>
    </div>
  );
}
