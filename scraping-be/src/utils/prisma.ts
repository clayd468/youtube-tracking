import { PrismaClient, Prisma, Media } from '@prisma/client';
import { SearchMediaInput, SearchMediaResponse } from '../types';

const prisma = new PrismaClient({ errorFormat: 'pretty' });

function calculateLimitAndOffset(page: string | undefined, limit: string | undefined): { limit: number; offset: number } {
  const _page = isNaN(Number(page)) ? 1 : (Number(page) || 1);
  const _limit = isNaN(Number(limit)) ? 10 : (Number(limit) || 10); 
  const offset = (_page - 1) * _limit;

  return { limit: _limit, offset };
}

async function getMediaById(data: any): Promise<Media | null> {
  const { userId, mediaId } = data;

  const media = await prisma.$queryRaw<Media[]>`
    SELECT m.id, m.url, m.status, m.images, m.videos
    FROM "media" m
    JOIN "user_media" um ON m.id = um."media_id"
    WHERE um."user_id" = ${userId}
      AND m.id = ${mediaId}
  `;

  // If media is found, return the first result; otherwise, return null
  return media.length > 0 ? media[0] : null;
}

async function searchByUrl(data: SearchMediaInput): Promise<SearchMediaResponse> {
  const { userId, searchText, offset, limit } = data;

  // Perform the count query
  const totalRecordsResult = await prisma.$queryRaw<{ count: BigInt }[]>`
    SELECT COUNT(*)::BIGINT AS count
    FROM "media" m
    JOIN "user_media" um ON m.id = um."media_id"
    WHERE um."user_id" = ${userId}
      AND m.url ILIKE ${'%' + searchText + '%'}
  `;

  const totalRecords = Number(totalRecordsResult[0].count);

  // Perform the paginated query
  const results = await prisma.$queryRaw<Partial<Media>[]>`
    SELECT m.*
    FROM "media" m
    JOIN "user_media" um ON m.id = um."media_id"
    WHERE um."user_id" = ${userId}
      AND m.url ILIKE ${'%' + searchText + '%'}
    ORDER BY m.id
    LIMIT ${limit}
    OFFSET ${offset}
  `;

  return { totalRecords, results };
}

async function searchByImages(data: SearchMediaInput): Promise<SearchMediaResponse> {
  const { userId, searchText, offset, limit } = data;

  // Perform the count query
  const totalRecordsResult = await prisma.$queryRaw<{ count: BigInt }[]>`
    SELECT COUNT(*)::BIGINT AS count
    FROM "media" m
    JOIN "user_media" um ON m.id = um."media_id",
    jsonb_array_elements_text(m.images) AS image
    WHERE um."user_id" = ${userId}
      AND image ILIKE ${'%' + searchText + '%'}
  `;

  const totalRecords = Number(totalRecordsResult[0].count);

  // Perform the paginated query
  const results = await prisma.$queryRaw<Partial<Media>[]>`
    SELECT m.id, m.url, jsonb_agg(image) AS images, m.status
    FROM "media" m
    JOIN "user_media" um ON m.id = um."media_id",
    jsonb_array_elements_text(m.images) AS image
    WHERE um."user_id" = ${userId}
      AND image ILIKE ${'%' + searchText + '%'}
    GROUP BY m.id, m.url, m.status
    ORDER BY m.id
    LIMIT ${limit}
    OFFSET ${offset}
  `;

  console.log('!results:', results);

  return { totalRecords, results };
}

async function searchByVideos(data: SearchMediaInput): Promise<SearchMediaResponse> {
  const { userId, searchText, offset, limit } = data;

  // Perform the count query
  const totalRecordsResult = await prisma.$queryRaw<{ count: BigInt }[]>`
    SELECT COUNT(*)::BIGINT AS count
    FROM "media" m
    JOIN "user_media" um ON m.id = um."media_id",
    jsonb_array_elements_text(m.videos) AS video
    WHERE um."user_id" = ${userId}
      AND video ILIKE ${'%' + searchText + '%'}
  `;

  const totalRecords = Number(totalRecordsResult[0].count);

  // Perform the paginated query
  const results = await prisma.$queryRaw<Partial<Media>[]>`
    SELECT m.id, m.url, jsonb_agg(video) AS videos, m.status
    FROM "media" m
    JOIN "user_media" um ON m.id = um."media_id",
    jsonb_array_elements_text(m.videos) AS video
    WHERE um."user_id" = ${userId}
      AND video ILIKE ${'%' + searchText + '%'}
    GROUP BY m.id, m.url, m.status
    ORDER BY m.id
    LIMIT ${limit}
    OFFSET ${offset}
  `;

  return { totalRecords, results };
}

async function searchAll(data: SearchMediaInput): Promise<SearchMediaResponse> {
  const { userId, searchText, offset, limit } = data;

  // Perform the count query
  const totalRecordsResult = await prisma.$queryRaw<{ count: BigInt }[]>`
    SELECT COUNT(*)::BIGINT AS count
    FROM "media" m
    JOIN "user_media" um ON m.id = um."media_id"
    WHERE um."user_id" = ${userId}
      AND (
        m.url ILIKE ${'%' + searchText + '%'}
        OR EXISTS (
          SELECT 1
          FROM jsonb_array_elements_text(m.images) AS image
          WHERE image ILIKE ${'%' + searchText + '%'}
        )
        OR EXISTS (
          SELECT 1
          FROM jsonb_array_elements_text(m.videos) AS video
          WHERE video ILIKE ${'%' + searchText + '%'}
        )
      )
  `;

  const totalRecords = Number(totalRecordsResult[0].count);

  // Perform the paginated query
  const results = await prisma.$queryRaw<Partial<Media>[]>`
    SELECT m.id, m.url, m.status, m.images, m.videos
    FROM "media" m
    JOIN "user_media" um ON m.id = um."media_id"
    WHERE um."user_id" = ${userId}
      AND (
        m.url ILIKE ${'%' + searchText + '%'}
        OR EXISTS (
          SELECT 1
          FROM jsonb_array_elements_text(m.images) AS image
          WHERE image ILIKE ${'%' + searchText + '%'}
        )
        OR EXISTS (
          SELECT 1
          FROM jsonb_array_elements_text(m.videos) AS video
          WHERE video ILIKE ${'%' + searchText + '%'}
        )
      )
    ORDER BY m.id
    LIMIT ${limit}
    OFFSET ${offset}
  `;

  const filteredResults = results.map((result) => ({
    id: result.id,
    url: result.url,
    status: result.status,
    images: (result.images as unknown as string[]).filter((image) => image.toLowerCase().includes(searchText.toLowerCase())),
    videos: (result.videos as unknown as string[]).filter((video) => video.toLowerCase().includes(searchText.toLowerCase())),
  }));

  return { totalRecords, results: filteredResults };
}

export { prisma, Prisma, searchByUrl, searchByImages, searchByVideos, searchAll, calculateLimitAndOffset, getMediaById };
