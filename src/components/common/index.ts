"use client";
export const XL_PADDING = 200;
export const LG_PADDING = 100;
export const MD_PADDING = 12;
export const XS_PADDING = 8;
export const HEADER_HEIGHT = 60;

export const color = {
    header: {
        light: "#ffffff",
        dark: "#272727",
    },
    primary: {
        light: "#ff7961",
        main: "#ba000d",
        dark: "#5f0a0c",
        darkSub: "#430708",
        contrastText: "#ffffff",
    },
    secondary: {
        light: "#ddf6f9",
        main: "#00bcd4",
        dark: "#008394",
        contrastText: "#ffffff",
    },
    third: {
        light: "#a1e39c",
        main: "#1cc622",
        dark: "#007200",
        contrastText: "#000000",
    },
    white: {
        cream: "#f8f6fa",
        lightSub: "#eeeeee",
        main: "#ffffff",
        invert: "#23241f",
        sub: "#7a7a7a",
        contrastText: "#000000",
    },
    black: {
        light: "#eeeeee",
        main: "#000000",
        dark: "#272727",
        contrastText: "#ffffff",
    },
    pink: {
        verylight: "#ffeef7",
        light: "#ffd5e8",
        main: "#eb1650",
        dark: "#8f0d36",
        contrastText: "#ffffff",
    },
    warning: {
        light: "#fff8e1",
        main: "#ffecb3",
        dark: "#ff6f00",
        contrastText: "#000000",
    },
    transparent: "transparent",
};

export const chooseThemeColorIn = (hexLight: string, hexDark: string, systemMode: "light" | "dark"): string => {
    return systemMode === "light" ? hexLight : hexDark;
};

export const chooseThemeImageIn = (urlLight: string, urlDark: string, systemMode: "light" | "dark"): string => {
    return systemMode === "light" ? urlLight : urlDark;
};
