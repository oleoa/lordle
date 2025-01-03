import Timer from "./Timer";

export default function Shortcuts(props) {
  return (
    <div className="fixed bottom-0 left-0 p-4">
      {(props.gameStatus == "ready" || props.gameStatus == "playing") && (
        <div className="flex flex-col items-start justify-center gap-4 w-full">
          <button
            className="border-2 px-4 py-2 rounded-lg"
            onClick={props.actions.giveUp}
          >
            Give up ( / )
          </button>
          <button
            className="border-2 px-4 py-2 rounded-lg"
            onClick={props.actions.returnMenu}
          >
            Leave (Escape)
          </button>
        </div>
      )}
      {props.gameStatus == "won" && (
        <div className="flex flex-col items-start justify-center gap-4 w-full">
          <h1 className="text-5xl font-bold">You Won!</h1>
          {props.lastRecord && (
            <h2 className="text-xl font-bold flex flex-col border-2 border-white rounded-lg px-4 py-2">
              <span>Best record:</span>
              <span className="w-full justify-center items-center flex underline">
                <Timer time={props.lastRecord} />
              </span>
            </h2>
          )}
          <button
            className="border-2 px-4 py-2 rounded-lg"
            onClick={props.actions.playAgain}
          >
            Play Again (Enter)
          </button>
          <button
            className="border-2 px-4 py-2 rounded-lg"
            onClick={props.actions.returnMenu}
          >
            Menu (Escape)
          </button>
        </div>
      )}
      {props.gameStatus == "lost" && (
        <div className="flex flex-col items-start justify-center gap-4 w-full">
          <h1 className="text-4xl font-bold">You Lost!</h1>
          <h2 className="text-xl font-bold flex flex-col">
            Answer: {props.answer}
          </h2>
          <button
            className="border-2 px-4 py-2 rounded-lg"
            onClick={props.actions.playAgain}
          >
            Play Again (Enter)
          </button>
          <button
            className="border-2 px-4 py-2 rounded-lg"
            onClick={props.actions.returnMenu}
          >
            Menu (Escape)
          </button>
        </div>
      )}
    </div>
  );
}
