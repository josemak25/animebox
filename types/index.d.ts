/**
 * Global type definitions for AnimeBOX
 *
 * This file contains type augmentations and global interfaces
 * used throughout the AnimeBOX React Native application.
 */

// Third-party library extensions
/// <reference path="./dayjs.d.ts" />

// Global utility types
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export type RequiredKeys<T, K extends keyof T> = T & Required<Pick<T, K>>;

// Error handling types
export interface AppError {
  code?: string;
  stack?: string;
  message: string;
}
