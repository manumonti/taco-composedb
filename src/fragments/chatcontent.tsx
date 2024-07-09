import React, { useState } from "react";
import { domains, ThresholdMessageKit } from "@nucypher/taco";
import { decodeB64 } from "../../utils/common";
import { decryptWithTACo, parseUrsulaError } from "../../utils/taco";
import { Message } from "../../types";
import Avatar from "./avatar";
import Spinner from "~/fragments/spinner";

interface ChatContentProps {
  messages: Message[];
}

const ChatContent = ({ messages }: ChatContentProps) => {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isDecrypting, setIsDecrypting] = useState(false);
  const [decryptedMessage, setDecryptedMessage] = useState<string | null>(null);

  const handleDecrypt = async (event: any, message: Message) => {
    setIsDecrypting(true);
    setDecryptedMessage(null);
    const mkB64 = message.ciphertext;
    const mkBytes = await decodeB64(mkB64);
    const thresholdMessageKit = ThresholdMessageKit.fromBytes(mkBytes);
    let decryptedMessageBytes;
    try {
      decryptedMessageBytes = await decryptWithTACo(
        thresholdMessageKit,
        domains.DEVNET
      );
      setErrorMessage(null);
    } catch (err: any) {
      console.error(`Error decrypting message: ${err}`);
      const parsedErrors = parseUrsulaError(err.message);
      setErrorMessage(`Error decrypting message:\n${parsedErrors.join("\n")}.`);
      return;
    } finally {
      setIsDecrypting(false);
    }
    setDecryptedMessage(new TextDecoder().decode(decryptedMessageBytes));
  };

  const decryptBtnText = !!decryptedMessage ? 'Decrypted!': "Decrypt";
  const isBtnDisabled = isDecrypting || !!decryptedMessage;

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
              {decryptedMessage || message.text}
            </div>
            {message.isChatOwner && (
                <button
                    type="button"
                    disabled={isBtnDisabled}
                    className="flex justify-center items-center bg-transparent hover:bg-red-500 text-blue-200 font-semibold hover:text-black text-xs px-4 py-2  border border-black-300 hover:border-transparent rounded w-1/4 "
                    onClick={(el) => handleDecrypt(el, message)}
                >
                  {isDecrypting ? <Spinner/> : decryptBtnText}
                </button>
            )}
            {errorMessage && (
                <div className="text-red-500 text-sm mt-2 text-left w-full break-words">
                  {errorMessage}
                </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ChatContent;
