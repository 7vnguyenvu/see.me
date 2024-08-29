import { useColorScheme } from "@mui/joy/styles";
import { useLayoutEffect } from "react";

const HOME_PAGE = process.env.NEXT_PUBLIC_HOME_PAGE;

export function useDynamicFavicon() {
    const { mode } = useColorScheme();

    useLayoutEffect(() => {
        const favicon = document.querySelector('link[rel="icon"]') as HTMLLinkElement;
        if (favicon) {
            favicon.href = mode === "dark" ? `../see.me-dark.svg` : `../see.me-light.svg`;
            favicon.type = "image/svg+xml";
        }
    }, [mode]);
}
