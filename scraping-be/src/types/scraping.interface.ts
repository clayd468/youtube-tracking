import { MediaStatusEnum } from './media.enum';

export interface ScrapingContent {
  images: string[];
  videos: string[];
}

export interface ScrapingUrlsResult extends ScrapingContent {
  id?: number;
  url: string;
  status?: MediaStatusEnum;
}
