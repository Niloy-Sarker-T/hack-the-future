import React, { useState } from "react";
import { EllipsisVerticalIcon, PaperClipIcon, TrashIcon } from "@heroicons/react/20/solid";
import { InformationCircleIcon } from "@heroicons/react/24/outline";
import moment from "moment";
import GroupChatDetailsModal from "./GroupChatDetailsModal";
import { classNames, getChatObjectMetadata } from "../../utils";
import { Dropdown } from "@/components/ui/dropdown"; // Adjust path if needed

/**
 * ChatItem component for rendering a chat list item with actions and details.
 *
 * @param {Object} props
 * @param {Object} props.chat - Chat object containing chat details.
 * @param {Object} props.user - Current user object.
 * @param {boolean} props.isActive - Whether this chat is currently active.
 * @param {Function} props.onClick - Callback when chat is clicked.
 * @param {number} props.unreadCount - Number of unread messages.
 * @param {Function} props.onChatDelete - Callback to delete the chat.
 */
export default function ChatItem({
  chat,
  user,
  isActive,
  onClick,
  unreadCount,
  onChatDelete,
}) {
  // State to control group info modal visibility
  const [openGroupInfo, setOpenGroupInfo] = useState(false);
  // State to control dropdown options visibility
  const [openOptions, setOpenOptions] = useState(false);

  // Handler to delete a chat
  const deleteChat = async () => {
    try {
      await onChatDelete(chat._id);
    } catch (error) {
      console.error("Error deleting chat:", error);
    }
  };

  // Guard clause for missing chat or user
  if (!chat || !user) return null;

  return (
    <>
      <GroupChatDetailsModal
        open={openGroupInfo}
        onClose={() => setOpenGroupInfo(false)}
        chatId={chat._id}
        onGroupDelete={onChatDelete}
      />
      <div
        role="button"
        onClick={() => onClick(chat)}
        onMouseLeave={() => setOpenOptions(false)}
        className={classNames(
          "group p-4 my-2 flex justify-between gap-3 items-start cursor-pointer rounded-3xl hover:bg-secondary",
          isActive ? "border-[1px] border-zinc-500 bg-secondary" : "",
          unreadCount > 0
            ? "border-[1px] border-success bg-success/20 font-bold"
            : ""
        )}
      >
        <Dropdown open={openOptions} onOpenChange={setOpenOptions}>
          <Dropdown.Trigger asChild>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setOpenOptions(!openOptions);
              }}
              className="self-center p-1 relative"
            >
              <EllipsisVerticalIcon className="h-6 group-hover:w-6 group-hover:opacity-100 w-0 opacity-0 transition-all ease-in-out duration-100 text-zinc-300" />
            </button>
          </Dropdown.Trigger>
          <Dropdown.Content className="z-20 text-left absolute bottom-0 translate-y-full text-sm w-52 bg-dark rounded-2xl p-2 shadow-md border-[1px] border-secondary">
            {chat.isGroupChat ? (
              <Dropdown.Item
                onSelect={(e) => {
                  e.preventDefault();
                  setOpenGroupInfo(true);
                }}
                className="p-4 w-full rounded-lg inline-flex items-center hover:bg-secondary"
              >
                <InformationCircleIcon className="h-4 w-4 mr-2" /> About group
              </Dropdown.Item>
            ) : (
              <Dropdown.Item
                onSelect={(e) => {
                  e.preventDefault();
                  const ok = confirm("Are you sure you want to delete this chat?");
                  if (ok) {
                    deleteChat();
                  }
                }}
                className="p-4 text-danger rounded-lg w-full inline-flex items-center hover:bg-secondary"
              >
                <TrashIcon className="h-4 w-4 mr-2" />
                Delete chat
              </Dropdown.Item>
            )}
          </Dropdown.Content>
        </Dropdown>
        <div className="flex justify-center items-center flex-shrink-0">
          {chat.isGroupChat ? (
            <div className="w-12 relative h-12 flex-shrink-0 flex justify-start items-center flex-nowrap">
              {chat.participants.slice(0, 3).map((participant, i) => (
                <img
                  key={participant._id}
                  src={participant.avatar.url}
                  className={classNames(
                    "w-8 h-8 border-[1px] border-white rounded-full absolute outline outline-4 outline-dark group-hover:outline-secondary",
                    i === 0
                      ? "left-0 z-[3]"
                      : i === 1
                      ? "left-2.5 z-[2]"
                      : i === 2
                      ? "left-[18px] z-[1]"
                      : ""
                  )}
                />
              ))}
            </div>
          ) : (
            <img
              src={getChatObjectMetadata(chat, user).avatar}
              className="w-12 h-12 rounded-full"
            />
          )}
        </div>
        <div className="w-full">
          <p className="truncate-1">
            {getChatObjectMetadata(chat, user).title}
          </p>
          <div className="w-full inline-flex items-center text-left">
            {chat.lastMessage && chat.lastMessage.attachments.length > 0 ? (
              <PaperClipIcon className="text-white/50 h-3 w-3 mr-2 flex flex-shrink-0" />
            ) : null}
            <small className="text-white/50 truncate-1 text-sm text-ellipsis inline-flex items-center">
              {getChatObjectMetadata(chat, user).lastMessage}
            </small>
          </div>
        </div>
        <div className="flex text-white/50 h-full text-sm flex-col justify-between items-end">
          <small className="mb-2 inline-flex flex-shrink-0 w-max">
            {moment(chat.updatedAt).add("TIME_ZONE", "hours").fromNow(true)}
          </small>
          {unreadCount <= 0 ? null : (
            <span className="bg-success h-2 w-2 aspect-square flex-shrink-0 p-2 text-white text-xs rounded-full inline-flex justify-center items-center">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </div>
      </div>
    </>
  );
}