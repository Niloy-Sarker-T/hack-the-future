import React from "react";
import ProfileInfo from "./components/profile-info/ProfileInfo";
import NewDm from "./components/newdm/NewDm";
import { useEffect } from "react";
import { appClient } from "@/lib/api-client";
import { GET_DM_CONTACT_ROUTE, GET_USER_CHANNELS_ROUTES } from "@/utils/constants";
import { useappStore } from "@/store/usestore";
import ContactList from "@/components/ContactList";
import CreateChannel from "./components/create-chanel/CreateChannel";
const ContactsContainer = () => {
  const { setDirectMessagesContacts, directMessagesContacts,channels,setChannels } = useappStore();
  useEffect(() => {
    const getContacts = async () => {
      try {
        const response = await appClient.get(GET_DM_CONTACT_ROUTE, {
          withCredentials: true,
        });

        if (response.data.contacts) {
          console.log(response.data.contacts);
          setDirectMessagesContacts(response.data.contacts);
        }
      } catch (error) {
        console.error("Error fetching contacts:", error);
      }
    };
    const getChannels = async () => {
      try {
        const response = await appClient.get(GET_USER_CHANNELS_ROUTES, {
          withCredentials: true,
        });

        if (response.data.channels) {
          console.log(response.data.channels);
          setChannels(response.data.channels);
        }
      } catch (error) {
        console.error("Error fetching channels:", error);
      }
    };
    getContacts();
    getChannels();
  }, [setChannels,setDirectMessagesContacts]);
  return (
    <div
      className="relative w-full fixed left-0 top-0 h-full bg-[#1b1c24] border-r-2 border-[#2f303b] 
    sm:w-full md:w-[30vw] lg:w-[35vw] xl:w-[40vw] overflow-auto"
    >
      <div className="pt-3">
        <Logo />
      </div>

      <div className="my-5">
        <div className="flex items-center justify-between pr-10">
          <Title text="Direct Messages" />
          <NewDm />
        </div>
        <div className=" max-h-[38vh] overflow-y-auto ">
          <ContactList contacts={directMessagesContacts} />
        </div>
      </div>

      <div className="my-5">
        <div className="flex items-center justify-between pr-10">
          <Title text="Channel" />
          <CreateChannel />
        </div>
        <div className=" max-h-[38vh] overflow-y-auto ">
          <ContactList contacts={channels} isChannel={true}/>
        </div>
      </div>

      <ProfileInfo />
    </div>
  );
};

export default ContactsContainer;

const Logo = () => {
  return (
    <div className="flex p-5  justify-start items-center gap-2">
      <svg
        id="logo-38"
        width="78"
        height="32"
        viewBox="0 0 78 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {" "}
        <path
          d="M55.5 0H77.5L58.5 32H36.5L55.5 0Z"
          className="ccustom"
          fill="#8338ec"
        ></path>{" "}
        <path
          d="M35.5 0H51.5L32.5 32H16.5L35.5 0Z"
          className="ccompli1"
          fill="#975aed"
        ></path>{" "}
        <path
          d="M19.5 0H31.5L12.5 32H0.5L19.5 0Z"
          className="ccompli2"
          fill="#a16ee8"
        ></path>{" "}
      </svg>
      <span className="text-3xl font-semibold ">Syncronus</span>
    </div>
  );
};

const Title = ({ text }) => {
  return (
    <h6 className="uppercase tracking-widest text-neutral-400 pl-10 font-light text-opacity-90 text-sm">
      {text}
    </h6>
  );
};
