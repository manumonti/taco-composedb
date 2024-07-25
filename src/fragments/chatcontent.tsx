import React, { useState } from "react";
import { conditions, domains, SingleSignOnEIP4361AuthProvider, ThresholdMessageKit } from "@nucypher/taco";
import { decodeB64 } from "../../utils/common";
import { decryptWithTACo, parseUrsulaError } from "../../utils/taco";
import { getCeramicSiweInfo } from "../../utils";
import { Message } from "../../types";
import Avatar from "./avatar";
import Spinner from "~/fragments/spinner";


interface ChatContentProps {
  messages: Message[];
}

const ChatContent = ({ messages }: ChatContentProps) => {
  const [isDecrypting, setIsDecrypting] = useState(false);

  const handleDecrypt = async (event: any, message: Message) => {
    setIsDecrypting(true);
    // get ciphertext
    const mkB64 = message.ciphertext;
    const mkBytes = await decodeB64(mkB64);
    const thresholdMessageKit = ThresholdMessageKit.fromBytes(mkBytes);

    // use single sign-on information for context variable
    let {messageStr, signature} = await getCeramicSiweInfo();
    const singleSignOnEIP4361AuthProvider = await SingleSignOnEIP4361AuthProvider.fromExistingSiweInfo(messageStr, signature);
    const customParameters: Record<string, conditions.context.CustomContextParam> = {};
    customParameters[':userAddressExternalEIP4361'] = await singleSignOnEIP4361AuthProvider.getOrCreateAuthSignature();

    let decryptedMessageBytes;
    try {
      decryptedMessageBytes = await decryptWithTACo(
        thresholdMessageKit,
        domains.DEVNET,
        customParameters
      );
      message.errorText = null;
      message.decryptedText = new TextDecoder().decode(decryptedMessageBytes);
    } catch (err: any) {
      console.error(`Error decrypting message: ${err}`);
      const parsedErrors = parseUrsulaError(err.message);
      message.errorText = `Error decrypting message:\n${parsedErrors.join("\n")}.`;
    } finally {
      setIsDecrypting(false);
    }
  };

  return (
    <div className="max-h-100 h-80 px-6 py-1 overflow-auto">
      {messages.map((message: Message, index: number) => (
        <div
          key={index}
          className={`py-2 flex flex-row w-full ${
            message.isChatOwner ? "justify-end" : "justify-start"
          }`}
        >
          <div className={`${message.isChatOwner ? "order-2" : "order-1"}`}>
            <Avatar />
          </div>
          <div
              className={`px-2 w-fit py-3 flex flex-col bg-purple-500 rounded-lg text-white ${
                  message.isChatOwner ? "order-1 mr-2" : "order-2 ml-2"
              }`}
          >
            <span className="text-xs text-gray-200">
              {message.sentBy}&nbsp;-&nbsp;
              {new Date(message.sentAt).toLocaleTimeString("en-US", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
            <div className="text-s max-w-md break-words" id="targetItem">
              {message.decryptedText || message.text}
            </div>
            {message.isChatOwner && (
                <button
                    type="button"
                    disabled={isDecrypting || !!message.decryptedText}
                    className="flex justify-center items-center bg-transparent hover:bg-red-500 text-blue-200 font-semibold hover:text-black text-xs px-4 py-2  border border-black-300 hover:border-transparent rounded w-1/4 "
                    onClick={(el) => handleDecrypt(el, message)}
                >
                  {isDecrypting && !message.decryptedText? <Spinner/> : !!message.decryptedText ? 'Decrypted!': "Decrypt"}
                </button>
            )}
            {message.errorText && (
                <div className="text-red-500 text-sm mt-2 text-left w-full break-words">
                  {message.errorText}
                </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ChatContent;
