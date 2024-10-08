// $lib/types/index.ts
import type { Timestamp } from "firebase/firestore";

export interface UserData {
  id: string;
  name: string;
  email: string;
  country: string;
  phoneNumber: string;
  watchedVideos: string[];
  createdAt: Timestamp; // Added this line
}

export interface VideoComment {
  id: string;
  userId: string;
  userName: string;
  content: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
export interface SerializedVideoComment {
  id: string;
  userId: string;
  userName: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export interface VideoComments {
  [commentId: string]: VideoComment;
}

export interface Country {
  code: string;
  name: string;
  phoneCode: number;
}

export interface Video {
  order: number;
  title: string;
  description: string;
  url: string;
  thumbnail: string;
  active: boolean;
}

export interface VideoWithId extends Video {
  id: string;
}

export interface SendPulseResponse {
  result: boolean;
  message?: string;
}
