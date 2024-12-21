import Letter from "./Letter";

export default function Row(props) {
  const letters = props.row;

  return (
    <div className="flex gap-4">
      {letters &&
        letters.map((letter, k) => (
          <Letter letter={letter.typed} status={letter.status} key={k} />
        ))}
    </div>
  );
}
