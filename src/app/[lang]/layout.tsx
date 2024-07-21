import { Box } from "@mui/joy";
import { CssVarsProvider } from "@mui/joy/styles";
import { GlobalContextProvider } from "@/context/store";
import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import NextTopLoader from "nextjs-toploader";

const font = Montserrat({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: {
        default: "[ SEE . ME ]",
        template: "%s - [ SEE . ME ]",
    },
};

export async function generateStaticParams() {
    return [{ lang: "vi" }, { lang: "en" }];
}

export default async function Layout({ children, params }: { children: React.ReactNode; params: Record<string, "en" | "vi"> }) {
    return (
        <CssVarsProvider defaultMode="system">
            <GlobalContextProvider lang={params.lang}>
                <NextTopLoader color={process.env.TOP_PROGRESS} showSpinner={false} />
                <Box className={font.className}>{children}</Box>
            </GlobalContextProvider>
        </CssVarsProvider>
    );
}
