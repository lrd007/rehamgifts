// lib/types/index.ts
import type { Timestamp } from "firebase/firestore";

export interface UserData {
  id: string;
  name: string;  // Changed from fullName to name
  email: string;
  country: string;  // Added country
  phoneNumber: string;
  watchedVideos: string[];
}

export interface VideoComment {
  id: string;
  userId: string;
  userName: string;
  content: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface VideoComments {
  [commentId: string]: VideoComment;
}

export interface Country {
  code: string;
  name: string;
  flag: string;
  phoneCode: number;
}

export interface Video {
  title: string;
  description: string;
  url: string;
  thumbnail: string;
}

export interface VideoWithId extends Video {
  id: string;
}
export interface SendPulseResponse {
  result: boolean;
  message?: string;
}
