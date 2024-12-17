export const formatTime = (time) => {
  // Get the true values
  const trueCentiSeconds = time;
  const trueSeconds = trueCentiSeconds / 100;
  const trueMinutes = trueSeconds / 60;

  // Floor the values (3.2465 sec -> 3 sec)
  const flooredCentiSeconds = Math.floor(trueCentiSeconds);
  const flooredSeconds = Math.floor(trueSeconds);
  const flooredMinutes = Math.floor(trueMinutes);

  // Removes the reset (110 sec -> 50 sec)
  const formatedCentiSeconds = flooredCentiSeconds % 100;
  const formatedSeconds = flooredSeconds % 60;
  const formatedMinutes = flooredMinutes % 60;

  // Adds the remainings zeros (9 sec -> 09 sec)
  const finalCentiSeconds =
    formatedCentiSeconds < 10
      ? "0" + formatedCentiSeconds
      : formatedCentiSeconds;
  const finalSeconds =
    formatedSeconds < 10 ? "0" + formatedSeconds : formatedSeconds;
  const finalMinutes =
    formatedMinutes < 10 ? "0" + formatedMinutes : formatedMinutes;
  return (
    <>
      <span className="flex w-40">
        {finalMinutes}:{finalSeconds}:{finalCentiSeconds}
      </span>
    </>
  );
};
