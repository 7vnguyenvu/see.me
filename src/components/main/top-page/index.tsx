"use client";

import { Box, Stack, Typography } from "@mui/joy";
import { MD_PADDING, XS_PADDING, color } from "@/components";

import { FaPenNib } from "react-icons/fa";

const HEIGHT = {
    xs: 160,
    md: 280,
};

interface Props {
    bgcolor?: string;
    image: string;
    title: string;
    description: {
        xs: string;
        md: string;
    };
}

export function TopPage({ bgcolor, image, title, description }: Props) {
    return (
        <Box sx={{ position: "relative" }}>
            <Box
                sx={{
                    position: "relative",
                    height: { xs: `${HEIGHT.xs}px`, md: `${HEIGHT.md}px` },
                    backgroundImage: `linear-gradient(70deg, ${bgcolor || color.primary.main}, ${color.black.dark});`,
                    my: { xs: `${XS_PADDING}px`, md: `${MD_PADDING}px` },
                    p: { xs: `${XS_PADDING}px`, md: `${MD_PADDING}px` },
                    borderRadius: "md",
                    overflow: "hidden",

                    "&:after": {
                        content: '""',
                        backgroundImage: `linear-gradient(200deg, #00000000, ${color.black.dark});`,
                        position: "absolute",
                        top: "0",
                        right: "0",
                        bottom: "0",
                        left: "0",
                    },
                }}
            >
                <Box
                    sx={{
                        position: "absolute",
                        top: { xs: "-70%", sm: "-60%", md: "-60%" },
                        right: { xs: "-20%", sm: "8%", md: "4%" },
                        bottom: { xs: "-10%", sm: "-40%", md: "-40%" },
                        img: {
                            height: "100%",
                            objectFit: "cover",
                        },
                    }}
                >
                    <img src={`../${image}`} alt="see.me logo" />
                </Box>
            </Box>

            <Stack
                sx={{
                    position: "absolute",
                    left: { xs: "6%", sm: "4%", md: "8%" },
                    right: { xs: "0%", sm: "40%", md: "40%" },
                    bottom: { xs: "8%", sm: "8%", md: "12%" },
                }}
            >
                <Typography level="h1" textTransform={"uppercase"} sx={{ bgcolor: "#", svg: { fontSize: "2rem" } }}>
                    {title} ..
                    <FaPenNib />
                </Typography>

                <Typography
                    level="body-xs"
                    textColor={color.white.cream}
                    sx={{ width: "100%", display: { xs: "none", sm: "block" }, whiteSpace: "pre-wrap" }}
                >
                    {description.md}
                </Typography>
                <Typography
                    level="body-xs"
                    textColor={color.white.cream}
                    sx={{ width: "100%", display: { xs: "block", sm: "none" }, whiteSpace: "pre-wrap" }}
                >
                    {description.xs}
                </Typography>
            </Stack>
        </Box>
    );
}
