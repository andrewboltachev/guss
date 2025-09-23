const addSecondsToDate = (date1: Date, secondsToAdd: number) => {
  const millisecondsToAdd = secondsToAdd * 1000;
  return new Date(date1.getTime() + millisecondsToAdd);
};

export { addSecondsToDate };
