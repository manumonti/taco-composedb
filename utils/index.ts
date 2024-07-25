import { DIDSession } from "did-session";
import { EthereumWebAuth, getAccountId } from "@didtools/pkh-ethereum";
import { SiweMessage } from "@didtools/cacao";
import type { CeramicApi } from "@ceramicnetwork/common"
import type { ComposeClient } from "@composedb/client";
import { ethers } from "ethers";

// If you are relying on an injected provider this must be here otherwise you will have a type error. 
declare global {
  interface Window {
    ethereum: any;
  }
}

/**
 * Checks localStorage for a stored DID Session. If one is found we authenticate it, otherwise we create a new one.
 * @returns Promise<DID-Session> - The User's authenticated sesion.
 */
export const authenticateCeramic = async (ceramic: CeramicApi, compose: ComposeClient) => {
  if (window.ethereum === null || window.ethereum === undefined) {
    throw new Error("No injected Ethereum provider found.");
  }

  // We enable the ethereum provider to get the user's addresses.
  const ethProvider = window.ethereum;
  // request ethereum accounts.
  const addresses = await ethProvider.request({
    method: "eth_requestAccounts",
  });

  const sessionStr = localStorage.getItem(`did-${addresses[0]}`) // for production you will want a better place than localStorage for your sessions.
  let session

  if(sessionStr) {
    session = await DIDSession.fromSession(sessionStr)
  }

  if(!session || (session.hasSession && session.isExpired)) {
    const accountId = await getAccountId(ethProvider, addresses[0]);
    const authMethod = await EthereumWebAuth.getAuthMethod(ethProvider, accountId);

    /**
     * Create DIDSession & provide capabilities that we want to access.
     * @NOTE: Any production applications will want to provide a more complete list of capabilities.
     *        This is not done here to allow you to add more datamodels to your application.
     */
    // TODO: update resources to only provide access to our composites
    const resources = compose.resources;
    session = await DIDSession.authorize(authMethod, { resources });
    // Set the session in localStorage.
    localStorage.setItem(`did-${addresses[0]}`, session.serialize());
  }

  // Set our Ceramic DID to be our session DID.
  compose.setDID(session.did)
  ceramic.did = session.did
  return session.did
}

export const getCeramicSiweInfo = async(address: string) => {
  const sessionStr = localStorage.getItem(`did-${address}`) // for production you will want a better place than localStorage for your sessions.
  if(!sessionStr) {
    throw new Error("DID session not found.")
  }
  const session = await DIDSession.fromSession(sessionStr);
  const message = SiweMessage.fromCacao(session.cacao);
  const messageStr = message.toMessageEip55();
  const signature = message.signature;
  if (!signature) {
    throw new Error("SIWE signature not found.")
  }

  return {messageStr, signature}
}

export const alreadyLoggedIn = (address: string) => {
    return localStorage.getItem(`did-${address}`);
}

export const reset = () => {
    localStorage.clear();
    window.location.reload();
}
