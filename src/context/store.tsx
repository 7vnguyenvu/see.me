"use client";

import { Dispatch, SetStateAction, createContext, useCallback, useContext, useEffect, useState } from "react";
import { useDynamicFavicon, useSystemColorMode } from "@/hooks";

import { ApolloProvider } from "@apollo/client";
import client from "@/apollo-client";

interface PageSave {
    prev: string | null;
    curr: string | null;
}

interface ContextProps {
    systemMode: "light" | "dark";
    lang: "en" | "vi";
    pageSave: PageSave | null;
    setPageSave: Dispatch<SetStateAction<PageSave | null>>;
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
    const systemMode = useSystemColorMode();
    const storedToken = typeof localStorage !== "undefined" ? localStorage.getItem("access-token") : null;
    const [pageSave, setPageSave] = useState<PageSave | null>({
        prev: "",
        curr: typeof location !== "undefined" ? location.href.substring(location.href.indexOf(`/${lang}`) + lang.length + 1) || "/" : "",
    });
    const [token, setToken] = useState<string | null>(storedToken);

    const handleClickLinkTo = useCallback((url: string) => {
        if (url.includes("login")) return;
        setPageSave((prevState) => ({ curr: url, prev: prevState!.curr }));
    }, []);

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
