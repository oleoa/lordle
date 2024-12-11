export default function Minimap(props) {
  const rows = props.rows;
  const letters = props.letters;
  const length = rows * letters;
  const minimap = [...Array(length).keys()];
  return (
    <div className="fixed top-0 left-0 p-4">
      <div className="px-4 pt-2 pb-4 rounded-lg border-2 border-white flex flex-col gap-2">
        {letters >= 4 && <span>Minimap</span>}
        {letters == 3 && <span>Mini</span>}
        {letters <= 2 && <span>Map</span>}
        <div
          className="grid gap-1"
          style={{
            gridTemplateColumns: "repeat(" + letters + ", minmax(0, 1fr))",
          }}
        >
          {minimap.map((map) => (
            <div
              key={map}
              className="w-4 h-4 border-2 border-white rounded flex items-center justify-center"
            ></div>
          ))}
        </div>
      </div>
    </div>
  );
}
