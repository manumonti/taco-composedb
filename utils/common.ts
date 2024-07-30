export function encodeB64(uint8Array: any) {
  return Buffer.from(uint8Array).toString("base64");
}

export function decodeB64(b64String: any) {
  return new Uint8Array(Buffer.from(b64String, "base64"));
}
