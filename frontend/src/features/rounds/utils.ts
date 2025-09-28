import { format, parseISO } from 'date-fns';

export const formatDateTimeDate = (isoString: string): string => {
  const date = parseISO(isoString);
  return format(date, 'dd.MM.yyyy HH:mm:ss');
};
