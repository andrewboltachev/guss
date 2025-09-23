const addSecondsToDate = (date1: Date, secondsToAdd: number) => {
  const millisecondsToAdd = secondsToAdd * 1000;
  return new Date(date1.getTime() + millisecondsToAdd);
};

const secondsBetweenDates = (dateFrom: Date, dateTo: Date) => {
  return Math.round((dateTo.getTime() - dateFrom.getTime()) / 1000);
};

export { addSecondsToDate, secondsBetweenDates };
