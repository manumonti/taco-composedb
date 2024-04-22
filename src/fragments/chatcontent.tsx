import React, { useState } from "react";
import { Message } from "../../types";
import {} from "../hooks/messages-transform.types";
import Avatar from "./avatar";
import { decryptWithTACo, decodeb64 } from "../../utils/taco";
import { domains, ThresholdMessageKit } from '@nucypher/taco';

interface ChatContentProps {
  messages: Message[];
}

const ChatContent = ({ messages }: ChatContentProps) => {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleDecrypt = async (event: any, message: Message) => {
    const mkb64 = message.ciphertext;
    const mkBytes = await decodeb64(mkb64);
    const thresholdMessageKit = ThresholdMessageKit.fromBytes(mkBytes);
    let decryptedMessageBytes;
    try {
      decryptedMessageBytes = await decryptWithTACo(
          thresholdMessageKit,
          domains.TESTNET,
      );
    } catch (code) {
      console.error(`Error decrypting message: ${code}`);
      setErrorMessage(`Error decrypting message: ${code}`);
      return;
    }
    const decryptedMessage = new TextDecoder().decode(decryptedMessageBytes);
    event.target.parentElement.children[1].innerText = decryptedMessage;
    event.target.innerText = "Decoded!";
  }

  return (
    <div className="max-h-100 h-80 px-6 py-1 overflow-auto">
      {errorMessage && <div className="error-message">{errorMessage}</div>}

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
            <div className="text-s max-w-md break-words" id="targetItem">{message.text}</div>
            {message.isChatOwner && (
                <button
                    type="button"
                    className="bg-transparent hover:bg-red-500 text-blue-200 font-semibold hover:text-black text-xs px-4 py-2  border border-black-300 hover:border-transparent rounded w-1/4 "
                    onClick={(el) => handleDecrypt(el, message)}
                >
                  Decrypt
                </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ChatContent;
