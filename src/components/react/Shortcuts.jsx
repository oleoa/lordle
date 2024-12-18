export default function Shortcuts(props) {
  return (
    <div className="fixed bottom-0 left-0 p-4">
      {props.gameStatus == "menu" && (
        <div className="flex flex-col items-start justify-center gap-4 w-full">
          <span>Less rows (↑)</span>
          <span>More rows (↓)</span>
          <span>Less letters (←)</span>
          <span>More letters (→)</span>
          <span>Toggle timer / countdown (T)</span>
          <span>Manage time countdown (-/+)</span>
          <span>Start (Enter)</span>
        </div>
      )}
      {props.gameStatus == "ready" && (
        <div className="flex flex-col items-start justify-center gap-4 w-full">
          <span>Leave (Escape)</span>
        </div>
      )}
      {props.gameStatus == "won" && (
        <div className="flex flex-col items-start justify-center gap-4 w-full">
          <h1 className="text-5xl font-bold">You Won!</h1>
          <span>Play Again (Enter)</span>
          <button>Menu (Escape)</button>
        </div>
      )}
      {props.gameStatus == "lost" && (
        <div className="flex flex-col items-start justify-center gap-4 w-full">
          <h1 className="text-4xl font-bold">You Lost!</h1>
          <h2 className="text-xl font-bold flex flex-col underline border-2 border-white rounded-lg w-min px-2 py-1">
            {props.answer}
          </h2>
          <span>Play Again (Enter)</span>
          <span>Menu (Escape)</span>
        </div>
      )}
    </div>
  );
}
