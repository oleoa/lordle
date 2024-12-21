import Row from "./Row";

export default function TypedMap(props) {
  const rows = props.typedMap;

  let midIndex = Math.ceil(rows.length / 2);
  let firstRowsHalf = rows.slice(0, midIndex);
  let secondRowsHalf = rows.slice(midIndex);

  return (
    <div className="flex gap-12">
      {rows && rows.length <= 8 && (
        <div className="flex flex-col gap-4">
          {rows.map((row, k) => (
            <Row key={k} row={row} />
          ))}
        </div>
      )}
      {rows && rows.length > 8 && (
        <>
          <div className="flex flex-col gap-4">
            {firstRowsHalf.map((row, k) => (
              <Row key={k} row={row} />
            ))}
          </div>
          <div className="flex flex-col gap-4">
            {secondRowsHalf.map((row, k) => (
              <Row key={k} row={row} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
