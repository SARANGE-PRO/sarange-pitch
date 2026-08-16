import { db } from '@/db';
import type { Photo } from '@/types';
import { uid } from '@/utils/id';

const MAX_DIMENSION = 1600;
const JPEG_QUALITY = 0.8;

/** Compresse une image avant stockage IndexedDB pour préserver le quota. */
export async function compressImage(file: File): Promise<Blob> {
  try {
    const bitmap = await createImageBitmap(file);
    const scale = Math.min(1, MAX_DIMENSION / Math.max(bitmap.width, bitmap.height));
    if (scale >= 1 && file.size < 500_000) return file;
    const canvas = document.createElement('canvas');
    canvas.width = Math.round(bitmap.width * scale);
    canvas.height = Math.round(bitmap.height * scale);
    const ctx = canvas.getContext('2d');
    if (!ctx) return file;
    ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    return await new Promise<Blob>((resolve) =>
      canvas.toBlob((b) => resolve(b ?? file), 'image/jpeg', JPEG_QUALITY),
    );
  } catch {
    return file;
  }
}

export async function addPhoto(refType: Photo['refType'], refId: string, file: File): Promise<string> {
  const blob = await compressImage(file);
  const id = uid('photo');
  await db.photos.put({
    id,
    refType,
    refId,
    blob,
    mimeType: 'image/jpeg',
    createdAt: new Date().toISOString(),
  });
  return id;
}

export async function getPhotos(refType: Photo['refType'], refId: string): Promise<Photo[]> {
  return db.photos.where('[refType+refId]').equals([refType, refId]).toArray();
}

export async function deletePhoto(id: string): Promise<void> {
  await db.photos.delete(id);
}
