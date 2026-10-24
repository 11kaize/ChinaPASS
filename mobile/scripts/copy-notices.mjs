import { copyFile, mkdir } from "node:fs/promises";

const output = new URL("../dist/", import.meta.url);
await mkdir(output, { recursive: true });
await copyFile(new URL("../NOTICE.md", import.meta.url), new URL("THIRD_PARTY_NOTICES.txt", output));
