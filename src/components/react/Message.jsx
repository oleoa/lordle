import { useEffect } from "react";

export default function Message(props) {
  let bgColor = "";
  if (props.message[1] == "alert") bgColor = "bg-red-500";
  if (props.message[1] == "info") bgColor = "bg-blue";
  if (props.message[1] == "congrats") bgColor = "bg-yellow";

  useEffect(() => {
    let interval;
    if (props.message[1] == "alert") {
      interval = setInterval(() => {
        props.setMessage({ text: "", type: "" });
        clearInterval(interval);
      }, 2000);
    }
    if (props.message[1] == "info") {
      interval = setInterval(() => {
        props.setMessage({ text: "", type: "" });
        clearInterval(interval);
      }, 4000);
    }
    return () => {
      clearInterval(interval);
    };
  }, [props.message]);

  return (
    <div className="fixed bottom-0 z-50 p-4">
      <div className={"px-4 py-2 rounded-lg " + bgColor}>
        <p className="text-xl">{props.message[0]}</p>
      </div>
    </div>
  );
}
