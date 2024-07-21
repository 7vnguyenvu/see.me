import { useColorScheme } from "@mui/joy/styles";
import { useLayoutEffect } from "react";

export function useDynamicFavicon() {
    const { mode } = useColorScheme();

    useLayoutEffect(() => {
        const favicon = document.querySelector('link[rel="icon"]') as HTMLLinkElement;
        if (favicon) {
            favicon.href = mode === "dark" ? `/see.me-dark.svg` : `/see.me-light.svg`;
            favicon.type = "image/svg+xml";
        }
    }, [mode]);
}
