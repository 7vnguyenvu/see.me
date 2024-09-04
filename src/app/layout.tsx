import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
    icons: {
        icon: "see.me-dark.svg", // Default
    },
    title: "[ SEE . ME ]",
    description: `SEE.ME - Điểm hẹn của cảm hứng và trải nghiệm, khám phá góc nhìn mới, kết nối với những tâm hồn đồng điệu trên hành trình khám phá bản thân.`,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="vi">
            <head>
                <meta name="google-site-verification" content="b5bNeRjLnl_Puwsh7FMLL0JJWfUfu_8X_8K-xAdNydQ" />
            </head>
            <body style={{ margin: 0, padding: 0, boxSizing: "border-box" }}>{children}</body>
        </html>
    );
}
