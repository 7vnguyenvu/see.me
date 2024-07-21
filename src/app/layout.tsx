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
            <body style={{ margin: 0, padding: 0, boxSizing: "border-box" }}>{children}</body>
        </html>
    );
}
