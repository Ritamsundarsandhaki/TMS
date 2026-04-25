import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

// ================= USER TYPE =================
interface User {
  id: number;
  email: string;
  profileImage?: string;
}

// ================= STATE =================
interface GlobalState {
  // AUTH
  token: string | null;
  isAuthenticated: boolean;

  // USER
  user: User | null;

  // UI STATE
  loading: boolean;
  error: string | null;
}

const initialState: GlobalState = {
  token: localStorage.getItem("token"),
  isAuthenticated: !!localStorage.getItem("token"),

  user: localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user") as string)
    : null,

  loading: false,
  error: null,
};

// ================= SLICE =================
const globalSlice = createSlice({
  name: "global",
  initialState,
  reducers: {
    // ================= AUTH LOGIN =================
    loginSuccess: (
      state,
      action: PayloadAction<{
        token: string;
        user: User;
      }>
    ) => {
      state.token = action.payload.token;
      state.user = action.payload.user;
      state.isAuthenticated = true;

      localStorage.setItem("token", action.payload.token);
      localStorage.setItem("user", JSON.stringify(action.payload.user));
    },

    // ================= LOGOUT =================
    logout: (state) => {
      state.token = null;
      state.user = null;
      state.isAuthenticated = false;

      localStorage.removeItem("token");
      localStorage.removeItem("user");
    },

    // ================= UI =================
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },

    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },

    resetGlobal: () => initialState,
  },
});

export const {
  loginSuccess,
  logout,
  setLoading,
  setError,
  resetGlobal,
} = globalSlice.actions;

export default globalSlice.reducer;