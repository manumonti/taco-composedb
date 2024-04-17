import React from "react";
import { Message, Post } from "../../types";
import DebouncedInput from "./debounced";
import { encryptWithTACo, encodeb64 } from "../../utils/taco";
import { useCeramicContext } from "../../context";
import { conditions } from "@nucypher/taco";
import { domains } from "@nucypher/taco";

interface ChatInputBoxProps {
  sendANewMessage: (message: Message) => void;
  address: string;
}

const ritualId = 0
const domainTapir = domains.TESTNET

const ChatInputBox = ({ sendANewMessage, address }: ChatInputBoxProps) => {
  const [newMessage, setNewMessage] = React.useState("");
  const clients = useCeramicContext();
  const { composeClient } = clients;
  /**
   * Send message handler
   * Should empty text field after sent
   */
  const doSendMessage = async () => {
    const rpcCondition = new conditions.base.rpc.RpcCondition({
      chain: 80002,
      method: 'eth_getBalance',
      parameters: [':userAddress'],
      returnValueTest: {
        comparator: '>',
        value: 0,
      },
    });
    if (newMessage && newMessage.length > 0) {
      const thresholdMessageKit = await encryptWithTACo(
        newMessage,
        rpcCondition,
        domainTapir,
        ritualId,
      );

      const tmkBytes = thresholdMessageKit.toBytes()

      const thresholdMessageKitB64 = encodeb64(tmkBytes);
      console.log(thresholdMessageKitB64)

      const post: any = await composeClient.executeQuery<{
        createPosts: {
          document: Post;
        };
      }>(`
        mutation {
          createPosts(input: {
            content: {
              body: """${thresholdMessageKitB64}"""
              to: "${address}"
              created: "${new Date().toISOString()}"
              ciphertext: "${thresholdMessageKitB64}"
            }
          })
          {
            document {
              body
              to
              created
              ciphertext
            }
          }
        }
      `);
      sendANewMessage({
        sentAt: new Date(post.data.createPosts.document.created),
        sentBy: address,
        isChatOwner: true,
        text: post.data.createPosts.document.body,
        ...post.data.createPosts.document,
      });

      console.log(post);
      console.log(address);
      setNewMessage("");
    }
  };

  return (
    <div className="px-6 py-4 bg-white w-100 overflow-hidden rounded-bl-xl rounded-br-xla">
      <div className="flex flex-row items-center space-x-5">
        <DebouncedInput
          value={newMessage ?? ""}
          debounce={100}
          onChange={(value) => setNewMessage(String(value))}
        />
        <button
          type="button"
          disabled={!newMessage || newMessage.length === 0}
          className="px-3 py-2 text-xs font-medium text-center text-white bg-purple-500 rounded-lg hover:bg-purple-800 focus:ring-4 focus:outline-none focus:ring-purple-300 disabled:opacity-50"
          onClick={() => doSendMessage()}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatInputBox;
