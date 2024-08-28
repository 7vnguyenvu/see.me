import { Box, styled } from "@mui/joy";
import { HEADER_HEIGHT, MD_PADDING, XS_PADDING } from "..";

// Main Area
export const Main = styled(Box)({
    position: "relative",
    top: HEADER_HEIGHT,
});

// Main Area > Main Container
export const Main_Container = ({ children }: { children: React.ReactNode }) => (
    <Box
        sx={{
            position: "relative",
            padding: {
                xs: `0 ${XS_PADDING}px`,
                md: `0 ${MD_PADDING}px`,
            },
        }}
    >
        {children}
    </Box>
);
