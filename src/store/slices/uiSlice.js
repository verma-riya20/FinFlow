import { createSlice } from '@reduxjs/toolkit';

const uiSlice = createSlice({
  name: 'ui',
  initialState: {
    theme:       localStorage.getItem('finflow_theme') || 'dark',
    role:        'admin',
    activePage:  'dashboard',
    sidebarOpen: false,
  },
  reducers: {
    toggleTheme(state) {
      state.theme = state.theme === 'dark' ? 'light' : 'dark';
    },
    setTheme(state, action) {
      state.theme = action.payload;
    },
    setRole(state, action) {
      state.role = action.payload;
    },
    setActivePage(state, action) {
      state.activePage = action.payload;
      state.sidebarOpen = false;
    },
    toggleSidebar(state) {
      state.sidebarOpen = !state.sidebarOpen;
    },
    closeSidebar(state) {
      state.sidebarOpen = false;
    },
  },
});

export const { toggleTheme, setTheme, setRole, setActivePage, toggleSidebar, closeSidebar } = uiSlice.actions;
export const selectTheme       = s => s.ui.theme;
export const selectRole        = s => s.ui.role;
export const selectActivePage  = s => s.ui.activePage;
export const selectSidebarOpen = s => s.ui.sidebarOpen;
export default uiSlice.reducer;
