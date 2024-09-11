export interface VideoFileInfo {
  id: number;
  name: string;
  displayName: string;
  size: number;
  lastModified: Date;
  contentType: string;
  description: string;
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
