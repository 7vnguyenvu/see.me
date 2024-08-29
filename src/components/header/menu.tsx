import { Avatar, Box, Divider, List, ListItem, ListItemButton, Stack, Typography } from "@mui/joy";
import { CategoryRounded, HistoryEduRounded, HomeRounded, NearMe, SportsEsports, VisibilityRounded } from "@mui/icons-material";
import { chooseThemeValueIn, color } from "..";

import { Fragment } from "react";
import LinkTo from "../link";
import { useGlobalContext } from "@/context/store";

const HOME_PAGE = process.env.NEXT_PUBLIC_HOME_PAGE;

const userMenu = [
    {
        _id: "lu1",
        url: "/",
        name: "Thông tin chung",
        iconMUI: "HomeRounded",
    },
    {
        _id: "lu2",
        url: "blogs",
        name: "Bài viết & Nhật ký",
        iconMUI: "HistoryEduRounded",
    },
    {
        _id: "lu3",
        url: "entertaimemts",
        name: "Trung tâm giải trí",
        iconMUI: "SportsEsports",
    },
    {
        _id: "lu4",
        url: "projects",
        name: "Dự án & Phác thảo",
        iconMUI: "CategoryRounded",
    },
    {
        _id: "lu5",
        url: "check",
        name: "SEE.Check",
        iconMUI: "VisibilityRounded",
    },
];

const systemMenu = [
    {
        _id: "ls1",
        url: "explore",
        name: "Khám phá",
        iconMUI: "",
    },
    {
        _id: "ls2",
        url: "check",
        name: "SEE.Check",
        iconMUI: "VisibilityRounded",
    },
];

const getIcon = (iconMUI: string) => {
    const Icon =
        {
            HomeRounded,
            HistoryEduRounded,
            SportsEsports,
            CategoryRounded,
            VisibilityRounded,
        }[iconMUI] || NearMe;

    return <Icon />;
};

export function ListMenuLeft() {
    const { systemMode } = useGlobalContext();

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
                                <Typography>{link.name}</Typography>
                            </ListItemButton>
                        </LinkTo>
                    </ListItem>
                ))}
            </List>
        </Fragment>
    );
}

export function ListMenuRight() {
    return (
        <Fragment>
            <List>
                {systemMenu.map((link) => (
                    <ListItem key={link._id}>
                        <LinkTo url={link.url} sx={{ textDecoration: "none", width: "100%" }}>
                            <ListItemButton>
                                {getIcon(link.iconMUI)}
                                <Typography>{link.name}</Typography>
                            </ListItemButton>
                        </LinkTo>
                    </ListItem>
                ))}
            </List>
        </Fragment>
    );
}
