"use client";

import { Dispatch, SetStateAction, createContext, useCallback, useContext, useEffect, useState } from "react";
import { useDynamicFavicon, useSystemColorMode } from "@/hooks";

import { ApolloProvider } from "@apollo/client";
import client from "@/apollo-client";
import { usePathname } from "next/navigation";

interface PageSave {
    prev: string;
    curr: string;
}

interface ContextProps {
    systemMode: "light" | "dark";
    lang: "en" | "vi";
    pageSave: PageSave;
    setPageSave: Dispatch<SetStateAction<PageSave>>;
    token: string | null;
    setToken: Dispatch<SetStateAction<string | null>>;
    handleClickLinkTo: Function;
}

const GlobalContext = createContext<ContextProps>({
    systemMode: "dark",
    lang: "vi",
    pageSave: {} as PageSave,
    setPageSave: (): PageSave | any => {},
    token: null,
    setToken: (): string | any => {},
    handleClickLinkTo: (): any => {},
});

export function GlobalContextProvider({ children, lang }: { children: React.ReactNode; lang: "en" | "vi" }) {
    let countReRender = 0;
    const pathname = usePathname();
    const systemMode = useSystemColorMode();
    const storedToken = typeof localStorage !== "undefined" ? localStorage.getItem("access-token") : null;
    const [pageSave, setPageSave] = useState<PageSave>(() => {
        if (typeof window !== "undefined") {
            const currentPath = pathname || "";
            const langPart = `/${lang}/`;
            const currPath = currentPath.includes(langPart) ? currentPath.substring(currentPath.indexOf(langPart) + langPart.length) : "/";
            return {
                prev: "",
                curr: currPath,
            };
        }
        return {
            prev: "",
            curr: "/",
        };
    });
    const [token, setToken] = useState<string | null>(storedToken);

    const handleClickLinkTo = useCallback(
        (url: string) => {
            if (url.includes("login")) return;

            if (url != pageSave.curr) {
                setPageSave((prevState) => ({ curr: url, prev: prevState.curr }));
            }
        },
        [pageSave]
    );

    // DÒNG LOG CHECK -> XÓA SAU
    useEffect(() => {
        console.log("[Store] Render lần:", ++countReRender);
        console.log("Page-save:", pageSave);
    }, [pageSave]);

    const context = {
        systemMode,
        lang,
        pageSave,
        setPageSave,
        token,
        setToken,
        handleClickLinkTo,
    };

    return (
        <GlobalContext.Provider value={context}>
            <ApolloProvider client={client}>{children}</ApolloProvider>
        </GlobalContext.Provider>
    );
}

export function useGlobalContext() {
    useDynamicFavicon();

    return useContext(GlobalContext);
}
