"use client";

import { useEffect, useState } from "react";

import Link from "next/link";
import { useColorScheme } from "@mui/joy/styles";
import { useGlobalContext } from "@/context/store";
import { useSystemColorMode } from "@/hooks";

export default function Home() {
    const { lang } = useGlobalContext();
    const { mode } = useColorScheme();
    const systemMode = useSystemColorMode();

    /* Handle Hydration */ {
        const [mounted, setMounted] = useState(false);

        useEffect(() => {
            setMounted(true);
        }, []);

        if (!mounted) {
            return null;
        }
    }

    return (
        <div>
            <Link href={`/`}>Home</Link>
            <hr />
            <h1>Chế độ hiện tại [mode]: {mode}</h1>
            <p>Chế độ hệ thống [systemMode]: {systemMode}</p>
            <h4>Tự động thay đổi theo cài đặt hệ thống.</h4>
            <hr style={{ borderTop: "1px dashed #ccc" }} />
            <p>Ngôn ngữ đang chọn [lang]: {lang}</p>
        </div>
    );
}
