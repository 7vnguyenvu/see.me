import { Badge, Box, Chip, Dropdown, IconButton, ListDivider, ListItemDecorator, Menu, MenuButton, MenuItem, Stack, Typography } from "@mui/joy";
import { Campaign, Circle, Notifications } from "@mui/icons-material";
import { Fragment, useState } from "react";
import { chooseThemeValueIn, color } from "..";

import LinkTo from "../link";
import { timePassed } from "@/utils";
import { useGlobalContext } from "@/context/store";

interface NotiFyItem_Props {
    activator: string;
    content: string;
    timepass: Date;
    seen: boolean;
}

const notifies = [
    {
        activator: "[SEE.ME]",
        content: "Hệ thống thông báo bảo trì tính năng viết blog và tăng trải nghiệm tốt hơn cho bạn.",
        createdAt: new Date("2024-07-19T03:10:25.723+00:00"),
        seen: false,
    },
    {
        activator: "Nàng",
        content: "Lát qua chở tui đi mua đồ nhea.",
        createdAt: new Date("2024-07-19T02:10:25.723+00:00"),
        seen: false,
    },
    {
        activator: "[SEE.ME]",
        content: "Chào mừng bạn đến với SEE.ME!",
        createdAt: new Date("2024-07-18T10:10:25.723+00:00"),
        seen: true,
    },
];

export default function NotiFy() {
    const unreadCount = notifies.filter((item) => !item.seen).length;
    const [filterSeen, setFilterSeen] = useState<string>("all");

    return (
        <Fragment>
            <Box sx={{ display: { xs: "none", sm: "inline-flex" } }}>
                <Dropdown>
                    <MenuButton
                        slots={{ root: IconButton }}
                        slotProps={{ root: { variant: "plain", color: "neutral" } }}
                        sx={{ ":hover": { bgcolor: color.transparent } }}
                    >
                        <Badge badgeContent={unreadCount} size="sm" color="danger">
                            <Notifications />
                        </Badge>
                    </MenuButton>
                    <Menu
                        placement="bottom-end"
                        sx={{
                            minWidth: 300,
                            maxWidth: 320,
                            overflow: "visible",
                            filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                            mt: 1.5,
                            "& .MuiAvatar-root": {
                                width: 32,
                                height: 32,
                                ml: -0.5,
                                mr: 1,
                            },
                            "&:before": {
                                content: '""',
                                display: "block",
                                position: "absolute",
                                top: 0,
                                right: 14,
                                width: 10,
                                height: 10,
                                bgcolor: "inherit",
                                transform: "translateY(-50%) rotate(45deg)",
                                zIndex: 0,
                            },
                        }}
                    >
                        <Stack gap={1} sx={{ px: 2 }}>
                            <Stack direction={"row"} sx={{ alignItems: "center", justifyContent: "space-between" }}>
                                <Typography sx={{ fontSize: "xl", fontWeight: "bold" }}>Thông báo</Typography>
                                <Typography
                                    sx={{ fontSize: "xs", ":hover": { cursor: "pointer" } }}
                                    onClick={() => {
                                        alert("Đánh dấu đọc tất cả");
                                    }}
                                >
                                    Đánh dấu đọc tất cả
                                </Typography>
                            </Stack>
                            <Stack direction={"row"} gap={1}>
                                <Chip
                                    variant={filterSeen === "all" ? "soft" : "plain"}
                                    color={filterSeen === "all" ? "primary" : "neutral"}
                                    onClick={() => setFilterSeen("all")}
                                >
                                    <Typography sx={{ fontSize: "xs" }}>Tất cả</Typography>
                                </Chip>
                                <Chip
                                    variant={filterSeen === "unread" ? "soft" : "plain"}
                                    color={filterSeen === "unread" ? "primary" : "neutral"}
                                    onClick={() => setFilterSeen("unread")}
                                >
                                    <Typography sx={{ fontSize: "xs" }}>Chưa đọc</Typography>
                                </Chip>
                            </Stack>
                        </Stack>
                        <ListDivider />
                        {notifies
                            .filter((item) => filterSeen === "all" || (filterSeen === "unread" && !item.seen))
                            .map((item, index) => (
                                <NotiFyItem
                                    key={item.content + index}
                                    activator={item.activator}
                                    content={item.content}
                                    timepass={new Date(item.createdAt)}
                                    seen={item.seen}
                                />
                            ))}
                    </Menu>
                </Dropdown>
            </Box>

            {/* Responsive */}
            <Box sx={{ display: { xs: "inline-flex", sm: "none" } }}>
                <LinkTo url="#notification">
                    <Badge badgeContent={unreadCount} size="sm" color="danger">
                        <Notifications />
                    </Badge>
                </LinkTo>
            </Box>
        </Fragment>
    );
}

function NotiFyItem({ activator, content, timepass, seen }: NotiFyItem_Props) {
    const { lang, systemMode } = useGlobalContext();
    const colorActive = seen ? color.white.sub : chooseThemeValueIn(color.black.main, color.white.lightSub, systemMode);

    return (
        <MenuItem>
            <ListItemDecorator sx={{ alignSelf: "start" }}>
                <Campaign sx={{ color: colorActive }} />
            </ListItemDecorator>
            <Stack>
                <Typography sx={{ fontSize: "xs", wordBreak: "break-word", color: colorActive }}>
                    <b>{activator}:</b> {content}
                </Typography>
                <Typography sx={{ fontSize: "xs", color: colorActive }}>{timePassed(timepass, lang)}</Typography>
            </Stack>
            {!seen && <Circle sx={{ fontSize: "xs", ml: "auto", color: color.pink.main }} />}
        </MenuItem>
    );
}
