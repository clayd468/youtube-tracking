import { MediaStatusType, MediaType } from './media.types';

export interface Media {
  id: number;
  url: string;
  status: MediaStatusType;
  images: any;
  videos: any;
}

export interface Pagination {
  page?: string;
  limit?: string;
}

export interface SearchMediaParameters extends Pagination {
  userId: number;
  type?: MediaType;
  searchText?: string;
}

export interface SearchMediaInput {
  userId: number;
  searchText: string;
  limit: number;
  offset: number;
}

export interface SearchMediaResponse {
  totalRecords: number;
  results: Partial<Media>[];
}
