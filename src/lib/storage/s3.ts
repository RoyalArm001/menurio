import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
  HeadObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { nanoid } from "nanoid";

export interface StorageConfig {
  endpoint: string;
  region: string;
  bucket: string;
  accessKeyId: string;
  secretAccessKey: string;
  publicBaseUrl: string;
}

function getStorageConfig(): StorageConfig {
  const endpoint = process.env.S3_ENDPOINT;
  const bucket = process.env.S3_BUCKET;
  const accessKeyId = process.env.S3_ACCESS_KEY_ID;
  const secretAccessKey = process.env.S3_SECRET_ACCESS_KEY;
  const publicBaseUrl = process.env.S3_PUBLIC_BASE_URL;

  if (!endpoint || !bucket || !accessKeyId || !secretAccessKey || !publicBaseUrl) {
    throw new Error("S3 storage is not configured");
  }

  return {
    endpoint,
    region: process.env.S3_REGION ?? "us-east-1",
    bucket,
    accessKeyId,
    secretAccessKey,
    publicBaseUrl: publicBaseUrl.replace(/\/$/, ""),
  };
}

let s3Client: S3Client | null = null;

function getS3Client(): S3Client {
  if (s3Client) return s3Client;
  const config = getStorageConfig();
  s3Client = new S3Client({
    endpoint: config.endpoint,
    region: config.region,
    credentials: {
      accessKeyId: config.accessKeyId,
      secretAccessKey: config.secretAccessKey,
    },
    forcePathStyle: true, // Required for Beget and most S3-compatible providers
  });
  return s3Client;
}

const IMAGE_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
]);

const FAVICON_TYPES = new Set([
  "image/png",
  "image/webp",
  "image/x-icon",
  "image/vnd.microsoft.icon",
]);

const DOCUMENT_TYPES = new Set([
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "application/vnd.ms-excel",
  "application/pdf",
]);

const MAX_BYTES: Record<string, number> = {
  logo: 2 * 1024 * 1024,
  cover: 8 * 1024 * 1024,
  favicon: 256 * 1024,
  design: 5 * 1024 * 1024,
  product: 8 * 1024 * 1024,
  category: 5 * 1024 * 1024,
  gallery: 8 * 1024 * 1024,
  import: 20 * 1024 * 1024,
};

export function validateUploadConstraints(params: {
  purpose: string;
  contentType: string;
  sizeBytes?: number;
}): void {
  const allowed =
    params.purpose === "favicon"
      ? FAVICON_TYPES.has(params.contentType)
      : params.purpose === "import"
        ? IMAGE_TYPES.has(params.contentType) || DOCUMENT_TYPES.has(params.contentType)
        : IMAGE_TYPES.has(params.contentType);
  if (!allowed) {
    throw new Error("Unsupported content type");
  }
  const limit = MAX_BYTES[params.purpose] ?? 5 * 1024 * 1024;
  if (params.sizeBytes != null && params.sizeBytes > limit) {
    throw new Error("File exceeds the allowed size for this upload");
  }
}

const EXTENSIONS: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
  "image/x-icon": "ico",
  "image/vnd.microsoft.icon": "ico",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": "xlsx",
  "application/vnd.ms-excel": "xls",
  "application/pdf": "pdf",
};

export function buildObjectKey(
  restaurantId: string,
  purpose: string,
  filename: string,
  contentType: string,
): string {
  validateUploadConstraints({ purpose, contentType });
  const ext = EXTENSIONS[contentType] ?? "bin";
  const safeName = filename.replace(/[^a-zA-Z0-9._-]/g, "_").slice(0, 80);
  return `restaurants/${restaurantId}/${purpose}/${nanoid(12)}-${safeName}.${ext}`;
}

export async function createPresignedUploadUrl(params: {
  restaurantId: string;
  purpose: string;
  filename: string;
  contentType: string;
  sizeBytes: number;
  expiresIn?: number;
}): Promise<{ uploadUrl: string; key: string; publicUrl: string }> {
  const config = getStorageConfig();
  validateUploadConstraints({
    purpose: params.purpose,
    contentType: params.contentType,
    sizeBytes: params.sizeBytes,
  });
  const key = buildObjectKey(
    params.restaurantId,
    params.purpose,
    params.filename,
    params.contentType,
  );

  const command = new PutObjectCommand({
    Bucket: config.bucket,
    Key: key,
    ContentType: params.contentType,
    ContentLength: params.sizeBytes,
    ACL: "public-read",
  });

  const uploadUrl = await getSignedUrl(getS3Client(), command, {
    expiresIn: params.expiresIn ?? 300,
  });

  return {
    uploadUrl,
    key,
    publicUrl: `${config.publicBaseUrl}/${key}`,
  };
}

/** Verify a client-registerable asset is the exact object we presigned for this tenant. */
export async function verifyManagedUpload(params: {
  restaurantId: string;
  key: string;
  publicUrl: string;
  mimeType: string;
  sizeBytes: number;
  purpose: string;
}): Promise<void> {
  validateUploadConstraints({
    purpose: params.purpose,
    contentType: params.mimeType,
    sizeBytes: params.sizeBytes,
  });

  const config = getStorageConfig();
  const expectedPrefix = `restaurants/${params.restaurantId}/${params.purpose}/`;
  const expectedUrl = `${config.publicBaseUrl}/${params.key}`;
  if (
    !params.key.startsWith(expectedPrefix) ||
    params.key.includes("..") ||
    params.publicUrl !== expectedUrl
  ) {
    throw new Error("Upload reference does not belong to this restaurant");
  }

  const object = await getS3Client().send(
    new HeadObjectCommand({ Bucket: config.bucket, Key: params.key }),
  );
  if (
    object.ContentLength !== params.sizeBytes ||
    object.ContentType !== params.mimeType
  ) {
    throw new Error("Uploaded object does not match its signed upload request");
  }
}

export async function deleteObject(key: string): Promise<void> {
  const config = getStorageConfig();
  await getS3Client().send(
    new DeleteObjectCommand({
      Bucket: config.bucket,
      Key: key,
    }),
  );
}

export async function getObjectBuffer(key: string): Promise<Buffer> {
  const config = getStorageConfig();
  const { GetObjectCommand } = await import("@aws-sdk/client-s3");
  const response = await getS3Client().send(
    new GetObjectCommand({
      Bucket: config.bucket,
      Key: key,
    }),
  );
  return Buffer.from(await response.Body!.transformToByteArray());
}

export { IMAGE_TYPES as ALLOWED_CONTENT_TYPES };
