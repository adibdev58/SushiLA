import {format} from "date-fns"

  export function getTimeStampNowLocal() {
      const dateNow = new Date(Date.now());
      const timeStamp = format(dateNow,`yyyy-dd-MM pppp`);
    return timeStamp
  }
