import React, { useState } from "react";
import { EllipsisVerticalIcon, PaperClipIcon, TrashIcon, ArrowDownTrayIcon, XMarkIcon, MagnifyingGlassPlusIcon } from "@heroicons/react/20/solid";
import moment from "moment";
import { classNames } from "../../utils";
import { Dropdown } from "@/components/ui/dropdown"; // Adjust path if needed

/**
 * MessageItem component for rendering a single chat message with actions and attachments.
 *
 * @param {Object} props
 * @param {Object} props.message - The message object.
 * @param {boolean} [props.isOwnMessage] - Whether the message is sent by the current user.
 * @param {boolean} [props.isGroupChatMessage] - Whether the message is in a group chat.
 * @param {Function} props.deleteChatMessage - Callback to delete the message.
 */
export default function MessageItem({
  message,
  isOwnMessage,
  isGroupChatMessage,
  deleteChatMessage,
}) {
  // State to control image preview
  const [resizedImage, setResizedImage] = useState(null);
  // State to control dropdown options visibility
  const [openOptions, setopenOptions] = useState(false);

  return (
    <>
      {resizedImage ? (
        <div className="h-full z-40 p-8 overflow-hidden w-full absolute inset-0 bg-black/70 flex justify-center items-center">
          <XMarkIcon
            className="absolute top-5 right-5 w-9 h-9 text-white cursor-pointer"
            onClick={() => setResizedImage(null)}
          />
          <img
            className="w-full h-full object-contain"
            src={resizedImage}
            alt="chat image"
          />
        </div>
      ) : null}
      <div
        className={classNames(
          "flex justify-start items-end gap-3 max-w-lg min-w-",
          isOwnMessage ? "ml-auto" : ""
        )}
      >
        <img
          src={message.sender?.avatar?.url}
          className={classNames(
            "h-7 w-7 object-cover rounded-full flex flex-shrink-0",
            isOwnMessage ? "order-2" : "order-1"
          )}
        />
        <div
          onMouseLeave={() => setopenOptions(false)}
          className={classNames(
            "p-4 rounded-3xl flex flex-col cursor-pointer group hover:bg-secondary",
            isOwnMessage
              ? "order-1 rounded-br-none bg-primary"
              : "order-2 rounded-bl-none bg-secondary"
          )}
        >
          {isGroupChatMessage && !isOwnMessage ? (
            <p
              className={classNames(
                "text-xs font-semibold mb-2",
                ["text-success", "text-danger"][
                  message.sender.username.length % 2
                ]
              )}
            >
              {message.sender?.username}
            </p>
          ) : null}
          {message?.attachments?.length > 0 ? (
            <div>
              {isOwnMessage ? (
                <Dropdown open={openOptions} onOpenChange={setopenOptions}>
                  <Dropdown.Trigger asChild>
                    <button
                      className="self-center p-1 relative options-button"
                      onClick={() => setopenOptions(!openOptions)}
                    >
                      <EllipsisVerticalIcon className="group-hover:w-6 group-hover:opacity-100 w-0 opacity-0 transition-all ease-in-out duration-100 text-zinc-300" />
                    </button>
                  </Dropdown.Trigger>
                  <Dropdown.Content className="z-30 text-left absolute botom-0 translate-y-1 text-[10px] w-auto bg-dark rounded-2xl p-2 shadow-md border-[1px] border-secondary">
                    <Dropdown.Item
                      onSelect={(e) => {
                        e.preventDefault();
                        const ok = confirm(
                          "Are you sure you want to delete this message"
                        );
                        if (ok) {
                          deleteChatMessage(message);
                        }
                      }}
                      className="border border-red-500 p-4 text-danger rounded-lg w-auto inline-flex items-center hover:bg-secondary"
                    >
                      <TrashIcon className="h-4 w-4 mr-2" />
                      Delete Message
                    </Dropdown.Item>
                  </Dropdown.Content>
                </Dropdown>
              ) : null}
              <div
                className={classNames(
                  "grid max-w-7xl gap-2",
                  message.attachments?.length === 1 ? " grid-cols-1" : "",
                  message.attachments?.length === 2 ? " grid-cols-2" : "",
                  message.attachments?.length >= 3 ? " grid-cols-3" : "",
                  message.content ? "mb-6" : ""
                )}
              >
                {message.attachments?.map((file) => (
                  <div
                    key={file._id}
                    className="group relative aspect-square rounded-xl overflow-hidden cursor-pointer"
                  >
                    <button
                      onClick={() => setResizedImage(file.url)}
                      className="absolute inset-0 z-20 flex justify-center items-center w-full gap-2 h-full bg-black/60 group-hover:opacity-100 opacity-0 transition-opacity ease-in-out duration-150"
                    >
                      <MagnifyingGlassPlusIcon className="h-6 w-6 text-white" />
                      <a
                        href={file.url}
                        download
                        onClick={(e) => e.stopPropagation()}
                      >
                        <ArrowDownTrayIcon
                          title="download"
                          className="hover:text-zinc-400 h-6 w-6 text-white cursor-pointer"
                        />
                      </a>
                    </button>
                    <img
                      className="h-full w-full object-cover"
                      src={file.url}
                      alt="msg_img"
                    />
                  </div>
                ))}
              </div>
            </div>
          ) : null}
          {message.content ? (
            <div className="relative flex justify-between">
              {isOwnMessage ? (
                <Dropdown open={openOptions} onOpenChange={setopenOptions}>
                  <Dropdown.Trigger asChild>
                    <button
                      className="self-center relative options-button"
                      onClick={() => setopenOptions(!openOptions)}
                    >
                      <EllipsisVerticalIcon className="group-hover:w-4 group-hover:opacity-100 w-0 opacity-0 transition-all ease-in-out duration-100 text-zinc-300" />
                    </button>
                  </Dropdown.Trigger>
                  <Dropdown.Content className="delete-menu z-20 text-left -translate-x-24 -translate-y-4 absolute botom-0  text-[10px] w-auto bg-dark rounded-2xl  shadow-md border-[1px] border-secondary">
                    <Dropdown.Item
                      onSelect={(e) => {
                        e.preventDefault();
                        const ok = confirm(
                          "Are you sure you want to delete this message"
                        );
                        if (ok) {
                          deleteChatMessage(message);
                        }
                      }}
                      className="p-2 text-danger rounded-lg w-auto inline-flex items-center hover:bg-secondary"
                    >
                      <TrashIcon className="h-4 w-auto mr-1" />
                      Delete Message
                    </Dropdown.Item>
                  </Dropdown.Content>
                </Dropdown>
              ) : null}
              <p className="text-sm">{message.content}</p>
            </div>
          ) : null}
          <p
            className={classNames(
              "mt-1.5 self-end text-[10px] inline-flex items-center",
              isOwnMessage ? "text-zinc-50" : "text-zinc-400"
            )}
          >
            {message.attachments?.length > 0 ? (
              <PaperClipIcon className="h-4 w-4 mr-2 " />
            ) : null}
            {moment(message.updatedAt).add("TIME_ZONE", "hours").fromNow(true)}{" "}
            ago
          </p>
        </div>
      </div>
    </>
  );
}