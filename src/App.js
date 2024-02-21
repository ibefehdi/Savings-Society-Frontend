import './App.css';
import { CssBaseline, ThemeProvider } from "@mui/material";
import { Routes, Route, Navigate } from "react-router-dom";
import { theme } from "./theme"
import axiosInstance from './constants/axiosInstance';
function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />

    </ThemeProvider>

  );
}

export default App;
