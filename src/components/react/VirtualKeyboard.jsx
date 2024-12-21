import VirtualKey from "./VirtualKey";

export default function VirtualKeyboard(props) {
  let keyboard = [];
  keyboard[0] = Object.values(props.virtualKeyboard)
    .filter((k) => k.row == 0)
    .sort((a, b) => a.order - b.order);
  keyboard[1] = Object.values(props.virtualKeyboard)
    .filter((k) => k.row == 1)
    .sort((a, b) => a.order - b.order);
  keyboard[2] = Object.values(props.virtualKeyboard)
    .filter((k) => k.row == 2)
    .sort((a, b) => a.order - b.order);
  const keyshorts = ["Backspace", "Enter"];

  return (
    <div className="px-4 pt-2 pb-4 rounded-lg border-2 border-white flex flex-col gap-2 bg-blur">
      <div className="flex w-full gap-2 items-center justify-between">
        <span>Mini-keyboard</span>
        <div className="flex gap-2">
          {keyshorts.map((keyshort) => (
            <VirtualKey
              key={keyshort}
              keyboardKey={keyshort}
              handleClick={props.handleClick}
              state={0}
              isKeyshort={true}
            />
          ))}
        </div>
      </div>
      {keyboard.map((keyboardRow) => (
        <div
          key={keyboard.indexOf(keyboardRow)}
          className="flex gap-2 items-center justify-center"
        >
          {keyboardRow.map((keyboardKey) => (
            <VirtualKey
              key={keyboardKey.letter}
              keyboardKey={keyboardKey.letter}
              handleClick={props.handleClick}
              state={keyboardKey.state}
            />
          ))}
        </div>
      ))}
    </div>
  );
}
