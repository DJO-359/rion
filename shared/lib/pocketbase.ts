import PocketBase from "pocketbase";

const url =
  process.env.NEXT_PUBLIC_POCKETBASE_URL ?? "http://127.0.0.1:8090";

const pb = new PocketBase(url);

export default pb;

export function getPocketBaseUrl() {
  return url;
}

export function getProductFileUrl(
  record: { id: string; collectionId?: string },
  filename: string,
  collection = "products",
) {
  const publicUrl = process.env.POCKETBASE_PUBLIC_URL ?? url;
  return `${publicUrl}/api/files/${collection}/${record.id}/${filename}`;
}
