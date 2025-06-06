// Controller functions (commented out for clarity)
/*
const handleGroupNameUpdate = async () => { ... }
const getUsers = async () => { ... }
const deleteGroupChat = async () => { ... }
const removeParticipant = async (participantId: string) => { ... }
const addParticipant = async () => { ... }
const fetchGroupInformation = async () => { ... }
const handleClose = () => { ... }
useEffect(() => { ... }, [open]);
*/

/**
 * GroupChatDetailsModal component for group chat management and details.
 *
 * @param {Object} props
 * @param {boolean} props.open - Whether the modal is open.
 * @param {Function} props.onClose - Function to close the modal.
 * @param {string} props.chatId - The group chat ID.
 * @param {Function} props.onGroupDelete - Callback when group is deleted.
 */
const GroupChatDetailsModal = ({
  open,
  onClose,
  chatId,
  onGroupDelete,
}) => {
  const [groupDetails, setGroupDetails] = useState(null);  }
    const [renamingGroup, setRenamingGroup] = useState(false);
    const [newGroupName, setNewGroupName] = useState("");
    const [addingParticipant, setAddingParticipant] = useState(false);
    const [participantToBeAdded, setParticipantToBeAdded] = useState("");
    const [users, setUsers] = useState([]);
    const { user } = useAuth();
    const { socket } = useSocket();
    const { getGroupChat, updateGroupChat, deleteGroupChat, addParticipantToGroup, removeParticipantFromGroup } = useChat();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <Dialog.Content className="max-w-2xl bg-secondary p-0">
        <div className="flex h-full flex-col overflow-y-scroll py-6">
          <div className="px-4 sm:px-6">
            <div className="flex items-start justify-between">
              <div className="ml-3 flex h-7 items-center">
                <Dialog.Close asChild>
                  <button
                    type="button"
                    className="relative rounded-md bg-secondary text-zinc-400 hover:text-zinc-500 focus:outline-none"
                    onClick={onClose}
                  >
                    <span className="absolute -inset-2.5" />
                    <span className="sr-only">Close panel</span>
                    <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                  </button>
                </Dialog.Close>
              </div>
            </div>
          </div>
          <div className="relative mt-6 flex-1 px-4 sm:px-6">
            <div className="flex flex-col justify-center items-start">
              <div className="flex pl-16 justify-center items-center relative w-full h-max gap-3">
                {groupDetails?.participants.slice(0, 3).map((p) => (
                  <img
                    className="w-24 h-24 -ml-16 rounded-full outline outline-4 outline-secondary"
                    key={p._id}
                    src={p.avatar.url}
                    alt="avatar"
                  />
                ))}
                {groupDetails?.participants &&
                groupDetails?.participants.length > 3 ? (
                  <p>+{groupDetails?.participants.length - 3}</p>
                ) : null}
              </div>
              <div className="w-full flex flex-col justify-center items-center text-center">
                {renamingGroup ? (
                  <div className="w-full flex justify-center items-center mt-5 gap-2">
                    <Input
                      placeholder="Enter new group name..."
                      value={newGroupName}
                      onChange={(e) => setNewGroupName(e.target.value)}
                    />
                    <Button severity="primary" onClick={handleGroupNameUpdate}>
                      Save
                    </Button>
                    <Button
                      severity="secondary"
                      onClick={() => setRenamingGroup(false)}
                    >
                      Cancel
                    </Button>
                  </div>
                ) : (
                  <div className="w-full inline-flex justify-center items-center text-center mt-5">
                    <h1 className="text-2xl font-semibold truncate-1">
                      {groupDetails?.name}
                    </h1>
                    {groupDetails?.admin === user?._id ? (
                      <button onClick={() => setRenamingGroup(true)}>
                        <PencilIcon className="w-5 h-5 ml-4" />
                      </button>
                    ) : null}
                  </div>
                )}
                <p className="mt-2 text-zinc-400 text-sm">
                  Group · {groupDetails?.participants.length} participants
                </p>
              </div>
              <hr className="border-[0.1px] border-zinc-600 my-5 w-full" />
              <div className="w-full">
                <p className="inline-flex items-center">
                  <UserGroupIcon className="h-6 w-6 mr-2" />{" "}
                  {groupDetails?.participants.length} Participants
                </p>
                <div className="w-full">
                  {groupDetails?.participants?.map((part) => (
                    <React.Fragment key={part._id}>
                      <div className="flex justify-between items-center w-full py-4">
                        <div className="flex justify-start items-start gap-3 w-full">
                          <img
                            className="h-12 w-12 rounded-full"
                            src={part.avatar.url}
                          />
                          <div>
                            <p className="text-white font-semibold text-sm inline-flex items-center w-full">
                              {part.username}{" "}
                              {part._id === groupDetails.admin ? (
                                <span className="ml-2 text-[10px] px-4 bg-success/10 border-[0.1px] border-success rounded-full text-success">
                                  admin
                                </span>
                              ) : null}
                            </p>
                            <small className="text-zinc-400">
                              {part.email}
                            </small>
                          </div>
                        </div>
                        {groupDetails.admin === user?._id ? (
                          <div>
                            <Button
                              onClick={() => {
                                const ok = confirm(
                                  "Are you sure you want to remove " +
                                    user.username +
                                    " ?"
                                );
                                if (ok) {
                                  removeParticipant(part._id || "");
                                }
                              }}
                              size="small"
                              severity="danger"
                            >
                              Remove
                            </Button>
                          </div>
                        ) : null}
                      </div>
                      <hr className="border-[0.1px] border-zinc-600 my-1 w-full" />
                    </React.Fragment>
                  ))}
                  {groupDetails?.admin === user?._id ? (
                    <div className="w-full my-5 flex flex-col justify-center items-center gap-4">
                      {!addingParticipant ? (
                        <Button
                          onClick={() => setAddingParticipant(true)}
                          fullWidth
                          severity="primary"
                        >
                          <UserPlusIcon className="w-5 h-5 mr-1" /> Add participant
                        </Button>
                      ) : (
                        <div className="w-full flex justify-start items-center gap-2">
                          <Select
                            placeholder="Select a user to add..."
                            value={participantToBeAdded}
                            options={users.map((user) => ({
                              label: user.username,
                              value: user._id,
                            }))}
                            onChange={({ value }) => setParticipantToBeAdded(value)}
                          />
                          <Button onClick={() => addParticipant()}>+ Add</Button>
                          <Button
                            severity="secondary"
                            onClick={() => {
                              setAddingParticipant(false);
                              setParticipantToBeAdded("");
                            }}
                          >
                            Cancel
                          </Button>
                        </div>
                      )}
                      <Button
                        fullWidth
                        severity="danger"
                        onClick={() => {
                          const ok = confirm(
                            "Are you sure you want to delete this group?"
                          );
                          if (ok) {
                            deleteGroupChat();
                          }
                        }}
                      >
                        <TrashIcon className="w-5 h-5 mr-1" /> Delete group
                      </Button>
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
          </div>
        </div>
      </Dialog.Content>
    </Dialog>
  );
;

export default GroupChatDetailsModal;