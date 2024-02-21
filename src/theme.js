import { createContext, useState, useMemo } from "react";
import { createTheme } from "@mui/material/styles";

export const tokens = {
    indigo: {
        100: "#d0e0f7",
        200: "#a1c2f0",
        300: "#71a3e8",
        400: "#4285e1",
        500: "#1366d9",
        600: "#0f52ae",
        700: "#0b3d82",
        800: "#082957",
        900: "#04142b"
    },
    teal: {
        100: "#cfeddf",
        200: "#9fdcbf",
        300: "#70caa0",
        400: "#40b980",
        500: "#10a760",
        600: "#0d864d",
        700: "#0a643a",
        800: "#064326",
        900: "#032113"
    },
    white: {
        100: "#ffffff",
        200: "#ffffff",
        300: "#ffffff",
        400: "#ffffff",
        500: "#ffffff",
        600: "#cccccc",
        700: "#999999",
        800: "#666666",
        900: "#333333"
    },
    red: {
        100: "#f8d8d6",
        200: "#f0b2ad",
        300: "#e98b85",
        400: "#e1655c",
        500: "#da3e33",
        600: "#ae3229",
        700: "#83251f",
        800: "#571914",
        900: "#2c0c0a"
    },
    orange: {
        100: "#f9e9d6",
        200: "#f3d3ad",
        300: "#edbd85",
        400: "#e7a75c",
        500: "#e19133",
        600: "#b47429",
        700: "#87571f",
        800: "#5a3a14",
        900: "#2d1d0a"
    },
    indigoButton: {
        100: "#d0e0f7",
        200: "#a1c2f0",
        300: "#71a3e8",
        400: "#4285e1",
        500: "#1366d9",
        600: "#0f52ae",
        700: "#0b3d82",
        800: "#082957",
        900: "#04142b"
    },
    textColor: {
        100: "#dadcdf",
        200: "#b6b9bf",
        300: "#91969e",
        400: "#6d737e",
        500: "#48505e",
        600: "#3a404b",
        700: "#2b3038",
        800: "#1d2026",
        900: "#0e1013"
    },
};
const theme = createTheme({
    palette: {
        primary: {
            main: tokens.indigo[500],
        },
        secondary: {
            main: tokens.teal[500],
        },
        error: {
            main: tokens.red[500],
        },
        warning: {
            main: tokens.orange[500],
        },
        info: {
            main: tokens.indigo[400],
        },
        success: {
            main: tokens.teal[400],
        },
        background: {
            default: tokens.white[100],
            paper: tokens.white[500],
        },
        text: {
            primary: tokens.textColor[700],
            secondary: tokens.textColor[500],
            disabled: tokens.textColor[300],
        },
    },
    typography: {
        fontFamily: ["Inter", "Source Sans Pro", "sans-serif"].join(","),
        fontSize: 12,
        h1: {
            fontFamily: "Inter, Source Sans Pro, sans-serif",
            fontSize: 40,
        },
        h2: {
            fontFamily: "Inter, Source Sans Pro, sans-serif",
            fontSize: 32,
        },
        h3: {
            fontFamily: "Inter, Source Sans Pro, sans-serif",
            fontSize: 24,
        },
        h4: {
            fontFamily: "Inter, Source Sans Pro, sans-serif",
            fontSize: 20,
        },
        h5: {
            fontFamily: "Inter, Source Sans Pro, sans-serif",
            fontSize: 16,
        },
        h6: {
            fontFamily: "Inter, Source Sans Pro, sans-serif",
            fontSize: 14,
        },
    },
});

export { theme };