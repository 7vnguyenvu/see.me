"use client";

import { Fragment } from "react";
import Link from "next/link";
import { useGlobalContext } from "@/context/store";

export default function Page() {
    const { lang } = useGlobalContext();

    return (
        <Fragment>
            <h1>HOME PAGE</h1>
            <Link href={`${lang}/check`}>Check</Link>
        </Fragment>
    );
}
