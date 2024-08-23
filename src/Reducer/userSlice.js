import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: {
    uid: "",
    accessToken: "",
    admin: false,
    name: "",
    phone: "",
    point: 0,
  },
  reducers: {
    loginUser: (state, action) => {
      state.uid = action.payload.uid;
      state.accessToken = action.payload.accessToken;
      state.admin = action.payload.admin;
      state.name = action.payload.name;
      state.phone = action.payload.phone;
      state.point = action.payload.point;
    },
    clearUser: state => {
      state.uid = "";
      state.accessToken = "";
      state.admin = false;
      state.name = "";
      state.phone = "";
      state.point = 0;
    },
    buyGift: (state, action) => {
      state.point = action.payload.point;
    },
  },
});

export const { loginUser, clearUser, buyGift } = userSlice.actions;
export default userSlice.reducer;
