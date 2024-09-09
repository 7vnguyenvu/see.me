import Link from "next/link";
import React from "react";
import { useGlobalContext } from "@/context/store";

interface Props {
    url: string;
    children: React.ReactNode;
    sx?: any;
}

const LinkTo = ({ url, sx, children }: Props) => {
    const { lang, handleClickLinkTo } = useGlobalContext();

    return (
        <Link onClick={() => handleClickLinkTo(url)} href={`/${lang}/${url}`} style={{ textDecoration: "none", ...sx }}>
            {children}
        </Link>
    );
};

export default LinkTo;
