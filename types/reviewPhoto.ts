export interface NewReviewPhotoDraft {
  id: string;
  uri: string;
  filename: string;
  contentType: string;
  size?: number;
  photoKey?: never;
}

export interface ExistingReviewPhotoDraft {
  id: string;
  photoKey: string;
  uri?: string;
  filename?: never;
  contentType?: never;
  size?: never;
}

export type ReviewPhotoDraft = NewReviewPhotoDraft | ExistingReviewPhotoDraft;
