import { CssVarsProvider } from "@mui/joy/styles";
import { GlobalContextProvider } from "@/context/store";
import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import NextTopLoader from "nextjs-toploader";

const inter = Montserrat({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: {
        default: "[ SEE . ME ]",
        template: "%s - [ SEE . ME ]",
    },
    icons: {
        icon: "/see.me-dark.ico", // Default
    },
};

export async function generateStaticParams() {
    return [{ lang: "vi" }, { lang: "en" }];
}

export default async function RootLayout({ children, params }: { children: React.ReactNode; params: Record<string, "en" | "vi"> }) {
    return (
        <html lang={params.lang ?? "vi"}>
            <body className={inter.className}>
                <GlobalContextProvider lang={params.lang}>
                    <CssVarsProvider defaultMode="system">
                        <NextTopLoader color={process.env.TOP_PROGRESS} showSpinner={false} />
                        {children}
                    </CssVarsProvider>
                </GlobalContextProvider>
            </body>
        </html>
    );
}
