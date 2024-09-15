// lib/types
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
  title: any;
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
  thumbnail: string;
  videoUrl: string;
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
// lib/types.ts
export interface Video {
  id: string;
  name: {
    en: string;
    ar: string;
  };
  videoUrl: string;
  description?: {
    en: string;
    ar: string;
  };
  thumbnail?: string;
  title?: string;
}
