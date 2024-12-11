export default function Keyboard(props) {
  const keyboard = [
    ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
    ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
    ["Z", "X", "C", "V", "B", "N", "M"],
  ];
  let color = {};
  color["bg"] = "#1b1b1e";
  color["green"] = "rgba(77, 170, 87)";
  color["yellow"] = "rgba(255, 200, 87)";
  return (
    <div className="px-4 pt-2 pb-4 rounded-lg border-2 border-white flex flex-col gap-2 bg">
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
                    : props.chosenLettersKeyboard[keyboardKey].state == "100"
                      ? color["yellow"]
                      : "",
                borderColor:
                  props.chosenLettersKeyboard[keyboardKey].state == "404"
                    ? color["bg"]
                    : "",
                color:
                  props.chosenLettersKeyboard[keyboardKey].state == "404"
                    ? color["bg"]
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
  );
}
