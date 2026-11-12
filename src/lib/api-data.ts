import type { Product } from "./catalog-types";

/** Shape of the JSON our API routes send back. */
export type ApiData = { error?: string; product?: Product; products?: Product[]; key?: string; url?: string; ok?: boolean };

export const readJson = async (res: Response) => ((await res.json().catch(() => ({}))) as ApiData);
