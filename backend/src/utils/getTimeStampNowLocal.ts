import { appendOffset } from 'date-append-offset';

export function getTimeStampNowLocal() {
    const dateNow = new Date();
    const dateFormatted = appendOffset("2025-03-25","Europe/Berlin")
    console.log(dateFormatted)
  return dateFormatted
}
