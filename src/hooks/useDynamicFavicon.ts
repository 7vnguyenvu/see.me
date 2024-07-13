import { useColorScheme } from "@mui/joy/styles";
import { useEffect } from "react";

export function useDynamicFavicon() {
    const { mode } = useColorScheme();

    useEffect(() => {
        const favicon = document.querySelector('link[rel="icon"]') as HTMLLinkElement;
        if (favicon) {
            favicon.href = mode === "dark" ? "/see.me-light.ico" : "/see.me-dark.ico";
        }
    }, [mode]);
}
