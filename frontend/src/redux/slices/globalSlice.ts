import { createSlice,type PayloadAction } from "@reduxjs/toolkit";

interface GlobalState {
  // AUTH
  token: string | null;
  isAuthenticated: boolean;

  // UI STATE (kept minimal)
  loading: boolean;
  error: string | null;
}

const initialState: GlobalState = {
  token: localStorage.getItem("token"),
  isAuthenticated: !!localStorage.getItem("token"),

  loading: false,
  error: null,
};

const globalSlice = createSlice({
  name: "global",
  initialState,
  reducers: {
    // ================= AUTH =================
    loginSuccess: (state, action: PayloadAction<string>) => {
      state.token = action.payload;
      state.isAuthenticated = true;

      localStorage.setItem("token", action.payload);
    },

    logout: (state) => {
      state.token = null;
      state.isAuthenticated = false;

      localStorage.removeItem("token");
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