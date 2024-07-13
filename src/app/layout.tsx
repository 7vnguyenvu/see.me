import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
    icons: {
        icon: "/see.me-dark.ico", // Default
    },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html>
            <body>{children}</body>
        </html>
    );
}
