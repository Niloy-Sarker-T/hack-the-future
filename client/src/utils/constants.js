
export const HOST = import.meta.env.VITE_SERVER_URL;
export const AUTH_ROUTES = "api/auth";
export const SIGNUP_ROUTE = `${AUTH_ROUTES}/signup`;
export const LOGIN_ROUTE = `${AUTH_ROUTES}/login`;
export const GET_USER_INFO = `${AUTH_ROUTES}/userInfo`;
export const UPDATE_PROFILE_ROUTE = `${AUTH_ROUTES}/updateProfile`;
export const ADD_PROFILE_IMAGE_ROUTE = `${AUTH_ROUTES}/addProfileImage`;
export const REMOVE_PROFILE_IMAGE_ROUTE = `${AUTH_ROUTES}/del_image`;
export const LOGOUT_ROUTE = `${AUTH_ROUTES}/logout`


export const CONTACT_ROUTES = "api/contacts"
export const SEARCH_CONTACT_ROUTES = `${CONTACT_ROUTES}/search`
export const GET_DM_CONTACT_ROUTE = `${CONTACT_ROUTES}/get-contacts-for-dm`
export const GET_ALL_CONTACT_ROUTES = `${CONTACT_ROUTES}//get-all-contacts`
export const MESSAGE_ROUTES = "/api/messages"
export const GET_ALL_MESSAGE_ROUTE = `${MESSAGE_ROUTES}/get-messages`
export const UPLOAD_FILE_ROUTE = `${MESSAGE_ROUTES}/upload-file`


export const CHANNEL_ROUTES = "api/channel"
export const CREATE_CHANNEL_ROUTE = `${CHANNEL_ROUTES}/create-channel`

export const GET_USER_CHANNELS_ROUTES=`${CHANNEL_ROUTES}/get-user-channels`
export const GET_CHANNEL_MESSAGES=`${CHANNEL_ROUTES}/get-channel-messages`