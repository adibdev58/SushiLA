import { formatInTimeZone } from 'date-fns-tz'

export function getTimeStampNowUtcIso() {
    const dateNow = new Date();
    
    const dateFormatted = formatInTimeZone(dateNow,"Etc/UTC","yyyy-MM-dd HH:mm:ssXXX");
    

    console.log(dateFormatted)
    
  return dateFormatted
}
