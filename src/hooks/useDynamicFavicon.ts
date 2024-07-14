import { useColorScheme } from "@mui/joy/styles";
import { useLayoutEffect } from "react";

export function useDynamicFavicon() {
    const { mode } = useColorScheme();

    useLayoutEffect(() => {
        const favicon = document.querySelector('link[rel="icon"]') as HTMLLinkElement;
        if (favicon) {
            const timestamp = new Date().getTime();
            favicon.href = mode === "dark" ? `/see.me-light.svg?v=${timestamp}` : `/see.me-dark.svg?v=${timestamp}`;
            favicon.type = "image/svg+xml";
        }
    }, [mode]);
}
