export default function AddChatModal({
  open,
  handleClose,
  users,
  createChat,
}) {
  const [isGroupChat, setIsGroupChat] = useState(false);
  const [groupName, setGroupName] = useState("");
  const [selectedUserId, setSelectedUserId] = useState("");
  const [groupParticipants, setGroupParticipants] = useState([]);
  const [creatingChat, setCreatingChat] = useState(false);

  const createNewChat = async () => {
    if (!selectedUserId) return;

    setCreatingChat(true);
    try {
      await createChat({ userId: selectedUserId });
      handleClose();
    } catch (error) {
      console.error("Error creating chat:", error);
    } finally {
      setCreatingChat(false);
    }
  };

  const createNewGroupChat = async () => {
    if (!groupName || groupParticipants.length === 0) return;

    setCreatingChat(true);
    try {
      await createChat({ groupName, participants: groupParticipants });
      handleClose();
    } catch (error) {
      console.error("Error creating group chat:", error);
    } finally {
      setCreatingChat(false);
    }
  };

return (
  <Dialog open={open} onOpenChange={handleClose}>
    <Dialog.Content className="sm:max-w-3xl bg-dark">
      <Dialog.Header>
        <Dialog.Title className="text-lg font-semibold text-white">
          Create chat
        </Dialog.Title>
        <Dialog.Close asChild>
          <button
            className="rounded-md bg-transparent text-zinc-400 hover:text-zinc-600 focus:outline-none focus:ring-1 focus:ring-white focus:ring-offset-2"
            onClick={handleClose}
          >
            <span className="sr-only">Close</span>
            <XMarkIcon className="h-6 w-6" aria-hidden="true" />
          </button>
        </Dialog.Close>
      </Dialog.Header>
      <div>
        <div className="flex items-center my-5">
          <Switch
            checked={isGroupChat}
            onCheckedChange={setIsGroupChat}
            className={classNames(
              isGroupChat ? "bg-secondary" : "bg-zinc-200",
              "relative outline outline-[1px] outline-white inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:ring-0"
            )}
          >
            <span
              aria-hidden="true"
              className={classNames(
                isGroupChat
                  ? "translate-x-5 bg-success"
                  : "translate-x-0 bg-white",
                "pointer-events-none inline-block h-5 w-5 transform rounded-full shadow ring-0 transition duration-200 ease-in-out"
              )}
            />
          </Switch>
          <span className={classNames("ml-3 text-sm font-medium text-white", isGroupChat ? "" : "opacity-40")}>
            Is it a group chat?
          </span>
        </div>
        {isGroupChat && (
          <div className="my-5">
            <Input
              placeholder="Enter a group name..."
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
            />
          </div>
        )}
        <div className="my-5">
          <Select
            placeholder={
              isGroupChat
                ? "Select group participants..."
                : "Select a user to chat..."
            }
            value={isGroupChat ? "" : selectedUserId || ""}
            options={users.map((user) => ({
              label: user.username,
              value: user._id,
            }))}
            onValueChange={({ value }) => {
              if (isGroupChat && !groupParticipants.includes(value)) {
                setGroupParticipants([...groupParticipants, value]);
              } else {
                setSelectedUserId(value);
              }
            }}
          />
        </div>
        {isGroupChat && (
          <div className="my-5">
            <span className="font-medium text-white inline-flex items-center">
              <UserGroupIcon className="h-5 w-5 mr-2" /> Selected participants
            </span>
            <div className="flex flex-wrap gap-2 mt-3">
              {users
                .filter((user) => groupParticipants.includes(user._id))
                .map((participant) => (
                  <div
                    className="inline-flex bg-secondary rounded-full p-2 border-[1px] border-zinc-400 items-center gap-2"
                    key={participant._id}
                  >
                    <img
                      className="h-6 w-6 rounded-full object-cover"
                      src={participant.avatar.url}
                    />
                    <p className="text-white">{participant.username}</p>
                    <XCircleIcon
                      role="button"
                      className="w-6 h-6 hover:text-primary cursor-pointer"
                      onClick={() =>
                        setGroupParticipants(
                          groupParticipants.filter((p) => p !== participant._id)
                        )
                      }
                    />
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>
      <Dialog.Footer className="mt-5 flex justify-between items-center gap-4">
        <Button
          disabled={creatingChat}
          variant="secondary"
          onClick={handleClose}
          className="w-1/2"
        >
          Close
        </Button>
        <Button
          disabled={creatingChat}
          onClick={isGroupChat ? createNewGroupChat : createNewChat}
          className="w-1/2"
        >
          Create
        </Button>
      </Dialog.Footer>
    </Dialog.Content>
  </Dialog>
);
}