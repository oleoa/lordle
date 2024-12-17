import { useEffect } from "react";

export default function Message(props) {
  let bgColor = "";
  if (props.message.type == "alert") bgColor = "bg-red-500";
  if (props.message.type == "info") bgColor = "bg-blue-500";
  if (props.message.type == "congrats") bgColor = "bg-yellow-500";

  useEffect(() => {
    let interval;
    if (props.message.type == "alert") {
      interval = setInterval(() => {
        props.setMessage({ text: "", type: "" });
        clearInterval(interval);
      }, 2000);
    }
    return () => {
      clearInterval(interval);
    };
  }, [props.message]);

  return (
    <div className="fixed bottom-0 z-50 p-4">
      <div className={"px-4 py-2 rounded-lg " + bgColor}>
        <p className="text-xl">{props.message.text}</p>
      </div>
    </div>
  );
}
