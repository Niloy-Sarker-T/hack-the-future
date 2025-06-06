import React from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { FaPlus } from "react-icons/fa";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { animationDefaultOptions } from "@/lib/utils";
import Lottie from "react-lottie";
import { appClient } from "@/lib/api-client";
import { SEARCH_CONTACT_ROUTES } from "@/utils/constants";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { HOST } from "@/utils/constants";
import { getColor } from "@/lib/utils";
import { useappStore } from "@/store/usestore";

const NewDm = () => {
  const { setSelectedChatType, setSelectedChatData } = useappStore();
  const [openNewContactModel, setopenNewContactModel] = useState(false);
  const [searchContacts, setsearchContacts] = useState([]);

  const searchContactsfunc = async (searchTerm) => {
    try {
      if (searchTerm.length > 0) {
        const response = await appClient.post(
          SEARCH_CONTACT_ROUTES,
          { searchTerm },
          { withCredentials: true }
        );

        if (response.status === 200 && response.data.contacts) {
          setsearchContacts(response.data.contacts);
        } else {
          setsearchContacts([]);
        }
      }
    } catch (error) {
      console.log({ error });
    }
  };
  const selectNewContact = (contact) => {
    setopenNewContactModel(false);
    setSelectedChatType("contact");
    setSelectedChatData(contact);
    console.log("Selected Chat Type: ", "contact");
    console.log("Selected Chat Data: ", contact);
    setsearchContacts([]);
  };
  return (
    <>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <FaPlus
              className="text-neutral-400 font-light text-opacity-90 text-start hover:text-neutral-100 cursor-pointer transition-all duration-300"
              onClick={() => {
                setopenNewContactModel(true);
              }}
            />
          </TooltipTrigger>
          <TooltipContent className="bg-[#1c1b1e] border-none mb-2 p-3 text-white">
            Select New Contact
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <Dialog open={openNewContactModel} onOpenChange={setopenNewContactModel}>
        <DialogContent className="flex flex-col w-[400px] h-[400px] bg-black text-white border-none">
          <DialogHeader>
            <DialogTitle>Please Select a Contact</DialogTitle>
            <DialogDescription></DialogDescription>
          </DialogHeader>

          <div>
            <Input
              placeholder="Search contacts"
              onChange={(e) => searchContactsfunc(e.target.value)}
            />
          </div>
          {searchContacts.length > 0 && (
            <ScrollArea className="h-[250px]">
              <div className="flex flex-col gap-5">
                {searchContacts.map((contact) => {
                  return (
                    <div
                      key={contact._id}
                      className="flex gap-3 items-center cursor-pointer"
                      onClick={() => {
                        selectNewContact(contact);
                      }}
                    >
                      <div className=" w-12 h-12 relative">
                        <Avatar className="h-12 w-12 rounded-full overflow-hidden">
                          {contact.image ? (
                            <AvatarImage
                              src={`${HOST}/${contact.image}`}
                              alt="profile"
                              className="object object-cover w-full h-full bg-black rounded-full"
                            />
                          ) : (
                            <div
                              className={`uppercase h-12 w-12  text-lg border-[1px] flex items-center justify-center rounded-full ${getColor(
                                contact.color
                              )}`}
                            >
                              {contact.firstName
                                ? contact.firstName.split("")[0] // `shift()` is unnecessary; use `[0]`
                                : contact.email.split("")[0]}
                            </div>
                          )}
                        </Avatar>
                      </div>
                      <div className="flex flex-col">
                        <span>
                          {contact.firstName && contact.lastName
                            ? `${contact.firstName} ${contact.lastName}`
                            : ""}
                        </span>
                        <span className="text-xs">{contact.email}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </ScrollArea>
          )}
          {searchContacts.length <= 0 && (
            <div className="flex-1 flex flex-col justify-center items-center overflow-hidden mt-[-50px]">
              {/* Reduced animation size */}
              <div className="w-[120px] h-[120px] sm:w-[140px] sm:h-[140px]">
                <Lottie
                  isClickToPauseDisabled={true}
                  options={animationDefaultOptions}
                  height={"100%"}
                  width={"100%"}
                />
              </div>

              {/* Added margin for better spacing */}
              <div className="text-opacity-80 text-white flex flex-col gap-3 items-center mt-6 text-base sm:text-lg md:text-xl text-center">
                <h3 className="poppins-medium">
                  Hi<span className="text-purple-500">!</span> Search New
                  <span className="text-purple-500"> Contacts</span>
                </h3>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default NewDm;
