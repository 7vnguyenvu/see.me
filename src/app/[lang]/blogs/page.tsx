"use client";

import { BlogsEn, BlogsVi } from "@/locales";
import { Header, Main, Main_Container } from "@/components";

import { Fragment } from "react";
import { useGlobalContext } from "@/context/store";

export default function Page() {
    const { lang } = useGlobalContext();
    const T = lang === "en" ? BlogsEn : BlogsVi;

    return (
        <Fragment>
            <Header />
            <Main>
                <Main_Container>
                    <h1>{T.head.title}</h1>
                </Main_Container>
            </Main>
        </Fragment>
    );
}
