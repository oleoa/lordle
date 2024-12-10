export default function LetterSquare(props) {
  let color;
  if (props.color == "gray") color = "rgba(125, 132, 145)";
  if (props.color == "green") color = "rgba(77, 170, 87)";
  if (props.color == "yellow") color = "rgba(255, 200, 87)";
  return (
    <div
      id={props.chance}
      className="w-16 h-16 border-2 border-white rounded-lg flex items-center justify-center"
      style={{ backgroundColor: color }}
    >
      <p className="text-xl font-bold">{props.letter}</p>
    </div>
  );
}
