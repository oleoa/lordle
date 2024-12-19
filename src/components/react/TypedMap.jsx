import Letter from "./Letter";

export default function TypedMap(props) {
  const letters = props.typedMap[0].length;
  return (
    <div
      className="grid gap-4"
      style={{
        gridTemplateColumns: "repeat(" + letters + ", minmax(0, 1fr))",
      }}
    >
      {props.typedMap.map((row, ri) => {
        return row.map((letter, li) => {
          return (
            <Letter
              letter={letter.typed}
              status={letter.status}
              key={ri + "" + li}
            />
          );
        });
      })}
    </div>
  );
}
