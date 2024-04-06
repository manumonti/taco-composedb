import {
  conditions,
  decrypt,
  domains,
  encrypt,
  getPorterUri,
  initialize,
  ThresholdMessageKit,
} from '@nucypher/taco';

import { Condition } from "conditions.condition";

import { Domain } from "domains";

import { ethers } from "ethers";

const domain_tapir = domains.TESTNET

export function encodeb64(uintarray: any) {
  const b64 = Buffer.from(uintarray).toString("base64");
  return b64;
}

export function decodeb64(b64String: any) {
  return new Uint8Array(Buffer.from(b64String, "base64"));
}

export async function encryptWithTACo(
    aStringThatYouWishToEncrypt: string,
    accessCondition: conditions.condition,
    domain: Domain,
    ritualId: number,
): Promise<ThresholdMessageKit> {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    return await encrypt(
      provider,
      domain,
      aStringThatYouWishToEncrypt,
      accessCondition,
      ritualId,
      provider.getSigner(),
    );
}

export async function decryptWithTACo(
    encryptedMessage: ThresholdMessageKit,
    domain: Domain
): Promise<Uint8Array> {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    return await decrypt(
        provider,
        domain,
        encryptedMessage,
        getPorterUri(domain),
        provider.getSigner(),
    )
}
