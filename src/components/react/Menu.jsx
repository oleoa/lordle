export default function Menu(props) {
  return (
    <div className="flex flex-col items-start justify-center gap-4 h-full">
      <div className="grid gap-4 justify-items-center">
        <div className="w-full grid grid-cols-2 gap-4 border-white border-2 rounded-lg p-4 bg">
          <h1 className="text-4xl font-bold col-span-2">Menu</h1>
          <p>Rows</p>
          <span className="text-end w-full">{props.rows}</span>
          <p>Letters</p>
          <span className="text-end w-full">{props.letters}</span>
          <p>Language</p>
          <span className="text-end w-full">{props.language}</span>
          <p>Have Timer</p>
          <span className="text-end w-full">
            {props.haveTimer ? "TRUE" : "FALSE"}
          </span>
        </div>
      </div>
    </div>
  );
}
