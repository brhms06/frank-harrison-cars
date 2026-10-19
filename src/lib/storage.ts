import { Files } from "files-sdk";
import { neon } from "files-sdk/neon";

// Public-read bucket declared in neon.ts; credentials/endpoint come from the injected AWS_* env vars.
export const carFiles = new Files({ adapter: neon({ bucket: "cars" }) });

export const carImageUrl = (key: string) => `${process.env.AWS_ENDPOINT_URL_S3}/cars/${key}`;
