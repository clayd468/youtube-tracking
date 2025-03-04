export const VIDEO_SOURCES = ['video', 'video sourc'];
export const IMAGE_SOURCES = ['image', 'image'];
export const URL_PATTERN = new RegExp(
  '^(https?:\\/\\/)?' + // protocol
    '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.?)+[a-z]{2,}|' + // domain name
    '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
    '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
    '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
    '(\\#[-a-z\\d_]*)?$',
  'i',
); // fragment locator

// Regular expression for image file extensions
export const IMAGE_PATTERN = /\.(jpeg|jpg|gif|png|bmp|webp|svg)(\?.*)?$/i;

// Regular expression for video file extensions
export const VIDEO_PATTERN = /\.(mp4|webm|ogg|ogv|avi|mkv|flv|mov|wmv)(\?.*)?$/i;
