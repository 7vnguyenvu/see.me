import { Avatar, Box, Divider, List, ListItem, ListItemButton, Stack, Typography } from "@mui/joy";
import {
    CategoryRounded,
    HistoryEduRounded,
    HomeRepairServiceRounded,
    HomeRounded,
    NearMe,
    SportsEsports,
    VisibilityRounded,
} from "@mui/icons-material";
import { chooseThemeValueIn, color } from "..";

import { Fragment } from "react";
import LinkTo from "../link";
import { useGlobalContext } from "@/context/store";

const HOME_PAGE = process.env.NEXT_PUBLIC_HOME_PAGE;

const userMenu = [
    {
        _id: "lu1",
        url: "/",
        name: {
            en: "Home",
            vi: "Trang chủ",
        },
        iconMUI: "HomeRounded",
    },
    {
        _id: "lu2",
        url: "blogs",
        name: {
            en: "Blogs & Diaries",
            vi: "Bài viết & Nhật ký",
        },
        iconMUI: "HistoryEduRounded",
    },
    {
        _id: "lu6",
        url: "tools",
        name: {
            en: "Tools & Services",
            vi: "Công cụ & Dịch vụ",
        },
        iconMUI: "HomeRepairServiceRounded",
    },
    {
        _id: "lu3",
        url: "entertaiments",
        name: {
            en: "Entertainment",
            vi: "Giải trí",
        },
        iconMUI: "SportsEsports",
    },
    {
        _id: "lu4",
        url: "projects",
        name: {
            en: "Projects & Sketches",
            vi: "Dự án & Phác thảo",
        },
        iconMUI: "CategoryRounded",
    },
    {
        _id: "lu5",
        url: "check",
        name: {
            en: "SEE.Check",
            vi: "SEE.Check",
        },
        iconMUI: "VisibilityRounded",
    },
];

const systemMenu = [
    {
        _id: "ls1",
        url: "explore",
        name: {
            en: "Explore",
            vi: "Khám phá",
        },
        iconMUI: "",
    },
    {
        _id: "ls2",
        url: "check",
        name: {
            en: "SEE.Check",
            vi: "SEE.Check",
        },
        iconMUI: "VisibilityRounded",
    },
];

const getIcon = (iconMUI: string) => {
    const Icon =
        {
            HomeRounded,
            HomeRepairServiceRounded,
            HistoryEduRounded,
            SportsEsports,
            CategoryRounded,
            VisibilityRounded,
        }[iconMUI] || NearMe;

    return <Icon />;
};

export function ListMenuLeft() {
    const { lang, systemMode } = useGlobalContext();

    return (
        <Fragment>
            <List>
                <ListItem sx={{}}>
                    <Stack
                        direction={"row"}
                        gap={2}
                        sx={{
                            my: 2,
                            mx: 2,
                            width: `${100}%`,
                            alignItems: "center",
                            justifyContent: "start",
                            ":hover": {
                                cursor: "default",
                            },
                        }}
                    >
                        <Box
                            sx={{
                                img: {
                                    width: "auto",
                                    height: "90%",
                                    objectFit: "contain",
                                    borderRadius: `calc(infinity * 1px)`,
                                },
                            }}
                        >
                            <Avatar
                                alt="user-avatar"
                                src={`${HOME_PAGE}/see.me-light.svg`}
                                size="lg"
                                sx={{
                                    bgcolor: chooseThemeValueIn(color.white.lightSub, color.white.main, systemMode),
                                }}
                            />
                        </Box>
                        <Stack>
                            <Typography sx={{ fontWeight: "bold", fontSize: "xl" }}>7V NGUYEN VU</Typography>
                            <Typography sx={{ fontSize: "sm" }}>@7v52nguyenvu</Typography>
                        </Stack>
                    </Stack>
                </ListItem>
            </List>
            <Divider />
            <List>
                {userMenu.map((link) => (
                    <ListItem key={link._id}>
                        <LinkTo url={link.url} sx={{ textDecoration: "none", width: "100%" }}>
                            <ListItemButton sx={{ gap: 2 }}>
                                {getIcon(link.iconMUI)}
                                <Typography>{link.name[lang]}</Typography>
                            </ListItemButton>
                        </LinkTo>
                    </ListItem>
                ))}
            </List>
        </Fragment>
    );
}

export function ListMenuRight() {
    const { lang } = useGlobalContext();
    return (
        <Fragment>
            <List>
                {systemMenu.map((link) => (
                    <ListItem key={link._id}>
                        <LinkTo url={link.url} sx={{ textDecoration: "none", width: "100%" }}>
                            <ListItemButton>
                                {getIcon(link.iconMUI)}
                                <Typography>{link.name[lang]}</Typography>
                            </ListItemButton>
                        </LinkTo>
                    </ListItem>
                ))}
            </List>
        </Fragment>
    );
}
