import { Box, Theme, styled } from "@mui/joy";
import { HEADER_HEIGHT, MD_PADDING, XS_PADDING } from "..";

import { SxProps } from "@mui/material";

export * from "./top-page";

// Main Area
export const Main = styled(Box)({
    position: "relative",
    top: HEADER_HEIGHT + 8,
});

// Main Area > Main Container
export const Main_Container = ({ children, sx }: { children: React.ReactNode; sx?: SxProps<Theme> | undefined }) => (
    <Box
        sx={{
            position: "relative",
            padding: {
                xs: `0 ${XS_PADDING}px`,
                md: `0 ${MD_PADDING}px`,
            },
            ...sx,
        }}
    >
        {children}
    </Box>
);
