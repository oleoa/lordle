export default function LetterSquare(props) {
  let color;
  if (props.color == "green") color = "rgba(0, 255, 0, 0.5)";
  if (props.color == "yellow") color = "rgba(255, 255, 0, 0.5)";
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
