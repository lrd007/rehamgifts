// lib/utils/date.ts
import { Timestamp } from "firebase/firestore";

export function convertTimestampToDate(timestamp: Timestamp | string): Date {
  if (timestamp instanceof Timestamp) {
    return timestamp.toDate();
  } else if (typeof timestamp === "string") {
    const cleanedDateString = timestamp.replace(" at ", " ").split(" UTC")[0];
    return new Date(cleanedDateString);
  }
  throw new Error("Invalid timestamp format");
}