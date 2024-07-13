import { CssVarsProvider } from "@mui/joy/styles";
import { GlobalContextProvider } from "@/context/store";
import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import NextTopLoader from "nextjs-toploader";
import { Box } from "@mui/joy";

const inter = Montserrat({ subsets: ["latin"] });

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
        <GlobalContextProvider lang={params.lang}>
            <CssVarsProvider defaultMode="system">
                <NextTopLoader color={process.env.TOP_PROGRESS} showSpinner={false} />
                <Box className={inter.className}>{children}</Box>
            </CssVarsProvider>
        </GlobalContextProvider>
    );
}
