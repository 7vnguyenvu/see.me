"use client";

import { CheckEn, CheckVi } from "@/locales";
import { Header, Main, Main_Container } from "@/components";

import { useGlobalContext } from "@/context/store";
import { useSystemColorMode } from "@/hooks";

// import { useEffect, useState } from "react";

// import { useColorScheme } from "@mui/joy/styles";

export default function Home() {
    const { lang } = useGlobalContext();
    const T = lang === "en" ? CheckEn : CheckVi;
    // const { mode } = useColorScheme();
    const systemMode = useSystemColorMode();

    // /* Handle Hydration */ {
    //     const [mounted, setMounted] = useState(false);

    //     useEffect(() => {
    //         setMounted(true);
    //     }, []);

    //     if (!mounted) {
    //         return null;
    //     }
    // }

    return (
        <div>
            <Header />
            <Main>
                <Main_Container>
                    {/* <h1>Chế độ hiện tại [mode]: {mode}</h1> */}
                    <h1>
                        {T.page.systemMode} [systemMode]: {systemMode}
                    </h1>
                    <h4>{T.page.note_AutoChange}</h4>
                    <hr style={{ borderTop: "1px dashed #ccc" }} />
                    <p>
                        {T.page.languageSelected} [lang]: {lang}
                    </p>
                </Main_Container>
            </Main>
        </div>
    );
}
