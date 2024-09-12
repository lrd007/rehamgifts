export interface Country {
  code: string;
  name: string;
  flag: string;
  phoneCode: number;
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