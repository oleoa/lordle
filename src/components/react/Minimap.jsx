export default function Minimap(props) {
  const rows = props.rows;
  const letters = props.letters;
  const length = rows * letters;
  const minimap = [...Array(length).keys()];
  const keyboard = [
    ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
    ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
    ["Z", "X", "C", "V", "B", "N", "M"],
  ];
  let color = {};
  color["gray"] = "rgba(125, 132, 145)";
  color["green"] = "rgba(77, 170, 87)";
  color["yellow"] = "rgba(255, 200, 87)";
  return (
    <div className="fixed top-0 left-0 py-24 px-4">
      {props.gameStatus == "menu" && (
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
      )}
      {props.gameStatus != "menu" && (
        <div className="px-4 pt-2 pb-4 rounded-lg border-2 border-white flex flex-col gap-2">
          <span>Mini-keyboard</span>
          {keyboard.map((keyboardRow) => (
            <div
              key={keyboard.indexOf(keyboardRow)}
              className="flex gap-2 items-center justify-center"
            >
              {keyboardRow.map((keyboardKey) => (
                <span
                  key={keyboardKey}
                  style={{
                    backgroundColor:
                      props.chosenLettersKeyboard[keyboardKey].state == "200"
                        ? color["green"]
                        : props.chosenLettersKeyboard[keyboardKey].state ==
                            "100"
                          ? color["yellow"]
                          : props.chosenLettersKeyboard[keyboardKey].state ==
                              "404"
                            ? color["gray"]
                            : "",
                  }}
                  className="w-8 h-8 border-2 border-white rounded-lg flex items-center justify-center"
                >
                  {keyboardKey}
                </span>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
