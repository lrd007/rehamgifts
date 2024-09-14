export interface VideoFileInfo {
  id: number;
  name: string;
  displayName: string;
  size: number;
  lastModified: Date;
  contentType: string;
  description: string;
}

interface VideoDescription {
  en: string;
  ar: string;
}

export interface Video {
  id?: string;
  name: string;
  displayName: VideoDescription;
  lastModified: Date;
  description: VideoDescription;
  videoUrl: string;
  thumbnail: string;
}

export interface VideoComment {
  id?: string;
  userId: string;
  userName: string;
  content: string;
  videoId: number;
  createdAt: Date;
  updatedAt: Date;
}
