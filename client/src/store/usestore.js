// import { create } from "zustand";
// import { createAuthSlice } from "./slice/auth-slice";
// import { createChatSlice } from "./slice/chat-slice";
// export const useappStore = create((a) => ({
//     ...createAuthSlice(...a),
//     ...createChatSlice(...a)
// }));

import { create } from "zustand";
import { createAuthSlice } from "./slice/auth-slice";
import { createChatSlice } from "./slice/chat-slice";

// Combining the slices
export const useappStore = create((set, get) => ({
    ...createAuthSlice(set),        // Passing 'set' for auth slice
    ...createChatSlice(set, get),   // Passing 'set' and 'get' for chat slice
}));