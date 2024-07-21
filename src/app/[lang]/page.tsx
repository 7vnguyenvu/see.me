"use client";

import { Header, MD_PADDING, Main } from "@/components";

import { Fragment } from "react";
import { useGlobalContext } from "@/context/store";

export default function Page() {
    const {} = useGlobalContext();

    return (
        <Fragment>
            <Header />
            <Main sx={{ px: { md: `${MD_PADDING}px` } }}>
                <h1>HOME PAGE</h1>
            </Main>
        </Fragment>
    );
}
