"use client";

import { Header, Main, Main_Container } from "@/components";

import { Fragment } from "react";
import { useGlobalContext } from "@/context/store";

export default function Page() {
    const {} = useGlobalContext();

    return (
        <Fragment>
            <Header />
            <Main>
                <Main_Container>
                    <h1>HOME PAGE</h1>
                </Main_Container>
            </Main>
        </Fragment>
    );
}
