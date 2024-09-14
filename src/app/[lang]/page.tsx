"use client";

import { BOTTOMMENU_HEIGHT, BottomMenu, HEADER_HEIGHT, Header, Main, Main_Container, chooseThemeValueIn, color } from "@/components";
import { Box, Stack, Typography } from "@mui/joy";
import { Fragment, useLayoutEffect, useState } from "react";
import { HomeEn, HomeVi } from "@/locales";

import { useGlobalContext } from "@/context/store";

export default function Page() {
    const { lang, systemMode } = useGlobalContext();
    const T = lang === "en" ? HomeEn.page : HomeVi.page;

    const [windowHeight, setWindowHeight] = useState(0);

    useLayoutEffect(() => {
        function handleResize() {
            setWindowHeight(window.innerHeight);
        }

        window.addEventListener("resize", handleResize);
        handleResize(); // Set initial window height

        return () => window.removeEventListener("resize", handleResize);
    }, []);

    return (
        <Fragment>
            <Header />
            <Main>
                <Main_Container sx={{ height: windowHeight - (HEADER_HEIGHT + 8) - (BOTTOMMENU_HEIGHT + 16 * 2) }}>
                    <BottomMenu />
                    <Box
                        sx={{
                            width: "100%",
                            height: "80%",
                            position: "relative",
                            top: "50%",
                            transform: "translateY(-50%)",
                            // bgcolor: color.primary.main,
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            overflow: "hidden",
                            img: {
                                width: { xs: "140%", md: "70%" },
                                height: { xs: "100%", md: "70%" },
                                objectFit: "contain",
                            },
                        }}
                    >
                        {/* TITLE - H1 - RESPONSIVE */}
                        <Typography
                            textAlign={"center"}
                            level="h1"
                            fontSize={"2.2rem"}
                            textTransform={"capitalize"}
                            textColor={chooseThemeValueIn(color.black.dark, color.black.dark, systemMode)}
                            sx={{ display: { xs: "none", sm: "block" } }}
                        >
                            {T.title.md}
                        </Typography>
                        <Typography
                            textAlign={"center"}
                            level="h1"
                            fontSize={"1.8rem"}
                            textTransform={"capitalize"}
                            textColor={chooseThemeValueIn(color.black.dark, color.black.dark, systemMode)}
                            sx={{ display: { xs: "block", sm: "none" } }}
                        >
                            {T.title.xs}
                        </Typography>

                        {/* DESCRIPTION - RESPONSIVE */}
                        <Typography
                            textAlign={"center"}
                            level="body-md"
                            textColor={chooseThemeValueIn(color.black.dark, color.black.dark, systemMode)}
                            sx={{ mt: 2, display: { xs: "none", sm: "block" }, whiteSpace: "pre-wrap" }}
                        >
                            {T.description.md}
                        </Typography>
                        <Typography
                            textAlign={"center"}
                            level="body-md"
                            textColor={chooseThemeValueIn(color.black.dark, color.black.dark, systemMode)}
                            sx={{ mt: 2, display: { xs: "block", sm: "none" }, whiteSpace: "pre-wrap" }}
                        >
                            {T.description.xs}
                        </Typography>

                        <img
                            src="https://img001.prntscr.com/file/img001/F_0Fi6-gQfS90kioH7ICNw.png"
                            alt="home-img"
                            width={"aotu"}
                            height={"aotu"}
                            draggable={false}
                        />
                    </Box>
                </Main_Container>
            </Main>
        </Fragment>
    );
}
