import PocketBase from "pocketbase";

function getServerUrl() {
  return (
    process.env.POCKETBASE_URL ??
    process.env.NEXT_PUBLIC_POCKETBASE_URL ??
    "http://127.0.0.1:8090"
  );
}

export async function getAdminPb(): Promise<PocketBase> {
  const pb = new PocketBase(getServerUrl());

  const email = process.env.POCKETBASE_ADMIN_EMAIL;
  const password = process.env.POCKETBASE_ADMIN_PASSWORD;

  if (!email || !password) {
    throw new Error(
      "POCKETBASE_ADMIN_EMAIL and POCKETBASE_ADMIN_PASSWORD must be set",
    );
  }

  if (!pb.authStore.isValid) {
    await pb.collection("_superusers").authWithPassword(email, password);
  }

  return pb;
}

export function createPbFromCookie(cookieHeader: string | null): PocketBase {
  const pb = new PocketBase(getServerUrl());
  pb.authStore.loadFromCookie(cookieHeader ?? "");
  return pb;
}

/** Публичный клиент — без авторизации, для заявок от гостей */
export function createPublicPb(): PocketBase {
  return new PocketBase(getServerUrl());
}
