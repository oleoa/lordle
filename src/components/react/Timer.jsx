export default function Timer(props) {
  return (
    <div className="flex gap-0">
      <span>
        {Math.floor(props.time / 100 / 60) % 60 < 10
          ? "0" + (Math.floor(props.time / 100 / 60) % 60)
          : Math.floor(props.time / 100 / 60) % 60}
      </span>
      <span>:</span>
      <span>
        {Math.floor(props.time / 100) % 60 < 10
          ? "0" + (Math.floor(props.time / 100) % 60)
          : Math.floor(props.time / 100) % 60}
      </span>
      <span>:</span>
      <span>
        {Math.floor(props.time) % 100 < 10
          ? "0" + (Math.floor(props.time) % 100)
          : Math.floor(props.time) % 100}
      </span>
    </div>
  );
}
