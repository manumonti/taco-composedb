import {conditions, decrypt, domains, encrypt, getPorterUri, ThresholdMessageKit,} from '@nucypher/taco';

import {Domain} from "domains";

import {ethers} from "ethers";

export async function encryptWithTACo(
    messageToEncrypt: string,
    accessCondition: conditions.condition,
    domain: Domain,
    ritualId: number,
): Promise<ThresholdMessageKit> {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    return await encrypt(
      provider,
      domain,
      messageToEncrypt,
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

export function parseUrsulaError(error: String): Array<String> {
    const jsonLike = error.split('TACo decryption failed with errors:')[1].trim();

    // Escape double quotes inside the error message strings
    const escaped = jsonLike.replace(/ThresholdDecryptionRequestFailed\('(.*?)'\)/g, 'ThresholdDecryptionRequestFailed(\\"$1\\")');

    // Parse the escaped string as JSON
    const errors = JSON.parse(escaped);

    // Extract the specific part of the error messages
    const errorParts = Object.values(errors).map(error => {
        const match = error.match(/Node (.*?) raised (.*?)(?=\")/);
        return match ? match[2] : null; // match[2] contains the error type
    });

    return [...new Set(errorParts.filter(Boolean))];
}
