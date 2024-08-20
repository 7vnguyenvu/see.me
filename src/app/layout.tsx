import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
    icons: {
        icon: "see.me-dark.svg", // Default
    },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html>
            <head>
                <meta name="google-site-verification" content="b5bNeRjLnl_Puwsh7FMLL0JJWfUfu_8X_8K-xAdNydQ" />
            </head>
            <body style={{ margin: 0, padding: 0, boxSizing: "border-box" }}>{children}</body>
        </html>
    );
}
