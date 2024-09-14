import { Timestamp } from "firebase/firestore";

export interface UserData {
  id: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  watchedVideos: number[];
}

export interface VideoComment {
  id: string;
  userId: string;
  userName: string;
  content: string;
  videoId: number;
  createdAt: Date;
  updatedAt: Date;
}

export type VideoData = {
  id: number;
  name: string;
  displayName: {
    en: string;
    ar: string;
  };
  size: number;
  lastModified: Date;
  contentType: string;
  description: {
    en: string;
    ar: string;
  };
};

export interface VideoFileInfo {
  id: number;
  name: string;
  displayName: string;
  size: number;
  lastModified: Date;
  contentType: string;
  description: string;
}

export interface Country {
  code: string;
  name: string;
  flag: string;
  phoneCode: number;
}
