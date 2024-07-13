import { useEffect, useState } from "react";

import { useColorScheme } from "@mui/joy/styles";

export function useSystemColorMode() {
    const { setMode } = useColorScheme();
    const [systemMode, setSystemMode] = useState<"light" | "dark">("light");

    useEffect(() => {
        const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

        const updateMode = (isDark: boolean) => {
            const newMode = isDark ? "dark" : "light";
            setSystemMode(newMode);
            setMode(newMode);
        };

        // Set initial mode
        updateMode(mediaQuery.matches);

        // Add listener for changes
        const handler = (e: MediaQueryListEvent) => updateMode(e.matches);
        mediaQuery.addEventListener("change", handler);

        // Cleanup
        return () => mediaQuery.removeEventListener("change", handler);
    }, [setMode]);

    return systemMode;
}
