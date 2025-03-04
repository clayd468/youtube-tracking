import { IMAGE_PATTERN, URL_PATTERN, VIDEO_PATTERN } from '../constants';

export const validateImageSource = (source?: string): boolean => {
  if (!source) return false;
  return validateMediaSource(source, IMAGE_PATTERN);
};

// Validate video source
export const validateVideoSource = (source?: string): boolean => {
  if (!source) return false;
  return validateMediaSource(source, VIDEO_PATTERN);
};

const validateMediaSource = (source: string, pattern: RegExp): boolean => {
  // Check if the URL is well-formed
  if (!URL_PATTERN.test(source)) {
    return false;
  }

  // Check if the URL matches the provided pattern
  if (!pattern.test(source)) {
    return false;
  }

  return true;
};
