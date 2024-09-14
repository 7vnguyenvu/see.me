import { Box, Typography, styled } from "@mui/joy";
import { MD_PADDING, chooseThemeValueIn, color } from "..";
import { useLayoutEffect, useState } from "react";

import LinkTo from "@/components/link";
import { useGlobalContext } from "@/context/store";

type PageLink = {
    child: Array<PageLink>;
    hiden: boolean;
    page: string;
    pos: number;
    text: {
        en: string;
        vi: string;
    };
};

const bottomMenu: PageLink[] = [
    {
        child: [],
        hiden: false,
        page: "blogs",
        pos: 1,
        text: {
            en: "Articles",
            vi: "Bài viết",
        },
    },
    {
        child: [],
        hiden: false,
        page: "tools",
        pos: 2,
        text: {
            en: "Tools & Services",
            vi: "Công cụ & Dịch vụ",
        },
    },
    {
        child: [],
        hiden: false,
        page: "/",
        pos: 3,
        text: {
            en: "SEE . ME",
            vi: "SEE . ME",
        },
    },
    {
        child: [],
        hiden: false,
        page: "entertaiments",
        pos: 4,
        text: {
            en: "Entertainment",
            vi: "Giải trí",
        },
    },
    {
        child: [],
        hiden: false,
        page: "projects",
        pos: 5,
        text: {
            en: "Projects",
            vi: "Dự án",
        },
    },
];

export function BottomMenu() {
    const { lang, systemMode } = useGlobalContext();

    return (
        <BottomMenuWrapper sx={{ display: { xs: "none", md: "flex" }, zIndex: 1299 }}>
            <BottomMenuContainer>
                {bottomMenu.map((item: PageLink, index: number) => (
                    <LinkTo key={index} url={item.page}>
                        <Typography
                            sx={{
                                fontWeight: "bold",
                                userSelect: "none",
                                color:
                                    item.pos === 3
                                        ? chooseThemeValueIn(color.white.main, color.white.main, systemMode)
                                        : chooseThemeValueIn(color.black.dark, color.black.dark, systemMode),
                            }}
                        >
                            {item.text[lang]}
                        </Typography>
                    </LinkTo>
                ))}
            </BottomMenuContainer>
        </BottomMenuWrapper>
    );
}

export const BOTTOMMENU_HEIGHT = 50;
const BOTTOMMENU_PSEUDO_CLASS_WIDTH = 15;

const BottomMenuWrapper = styled(Box)(() => ({
    height: BOTTOMMENU_HEIGHT,
    backgroundColor: "transparent",
    alignItems: "center",
    justifyContent: "center",
    position: "fixed",
    left: 0,
    right: 0,
    bottom: 16,
}));

const BottomMenuContainer = styled(Box)(() => {
    const [windowWidth, setWindowWidth] = useState(0);

    useLayoutEffect(() => {
        function handleResize() {
            setWindowWidth(window.innerWidth);
        }

        window.addEventListener("resize", handleResize);
        handleResize(); // Set initial window height

        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const gap = 30;

    return {
        flexGrow: 1,
        height: "inherit",
        backgroundColor: "transparent",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: gap,
        "& > *": {
            width: (windowWidth - gap * 4 - MD_PADDING * 4 - BOTTOMMENU_PSEUDO_CLASS_WIDTH * 4) / 5,
            height: "inherit",
            background: color.white.lightSub,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
            fontWeight: 700,
            "&:hover": {
                background: color.pink.light,

                "&::before": {
                    borderTopColor: color.pink.light,
                },
                "&::after": {
                    borderTopColor: color.pink.light,
                },
            },
        },
        "& > *::before": {
            content: "''",
            borderTop: `${BOTTOMMENU_HEIGHT}px solid ${color.white.lightSub}`,
            borderLeft: `${BOTTOMMENU_PSEUDO_CLASS_WIDTH}px solid transparent`,
            position: "absolute",
            right: "100%",
        },
        "& > *::after": {
            content: "''",
            borderTop: `${BOTTOMMENU_HEIGHT}px solid ${color.white.lightSub}`,
            borderRight: `${BOTTOMMENU_PSEUDO_CLASS_WIDTH}px solid transparent`,
            position: "absolute",
            left: "100%",
        },
        "& > *:nth-child(-n+2)": {
            "&:hover": {
                background: color.pink.light,

                "&::before": {
                    borderTopColor: color.pink.light,
                },
                "&::after": {
                    borderBottomColor: color.pink.light,
                },
            },
            "&::after": {
                borderTop: "none",
                borderBottom: `${BOTTOMMENU_HEIGHT}px solid ${color.white.lightSub}`,
                borderRight: `${BOTTOMMENU_PSEUDO_CLASS_WIDTH}px solid transparent`,
            },
        },
        "& > *:nth-last-child(-n+2)": {
            "&:hover": {
                background: color.pink.light,

                "&::before": {
                    borderBottomColor: color.pink.light,
                },
            },
            "&::before": {
                borderTop: "none",
                borderBottom: `${BOTTOMMENU_HEIGHT}px solid ${color.white.lightSub}`,
                borderLeft: `${BOTTOMMENU_PSEUDO_CLASS_WIDTH}px solid transparent`,
            },
        },
        "& > :nth-child(3)": {
            background: color.primary.main,
            // color: color.primary.contrastText,
            "&::after, &::before": {
                borderTop: `${BOTTOMMENU_HEIGHT}px solid ${color.primary.main}`,
            },
            "&:hover": {
                background: color.primary.dark,

                "&::after, &::before": {
                    borderTopColor: color.primary.dark,
                },
            },
        },
    };
});
