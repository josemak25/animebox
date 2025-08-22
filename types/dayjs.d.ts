/**
 * Global type definitions for dayjs extensions used in AnimeBOX
 */

import dayjs from "dayjs";

declare module "dayjs" {
  interface Dayjs {
    /**
     * Custom timeSince method that returns a human-readable time difference
     * @param input - Date, string, or timestamp to compare against
     * @returns Formatted string like "2 hours ago" or "in 3 minutes"
     */
    timeSince(input?: dayjs.ConfigType): string;
  }

  interface DayjsStatic {
    /**
     * Static method to get time since for any date input
     * @param input - Date, string, or timestamp to get time since for
     * @returns Formatted string like "2 hours ago" or "in 3 minutes"
     */
    timeSince(input?: dayjs.ConfigType): string;
  }
}
