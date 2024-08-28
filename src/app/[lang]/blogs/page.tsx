"use client";

import { BlogsEn, BlogsVi } from "@/locales";
import { Header, Main, Main_Container, TopPage } from "@/components";

import { Fragment } from "react";
import { useGlobalContext } from "@/context/store";

const imageTopURL = "see.me-dark.svg";

export default function Page() {
    const { lang } = useGlobalContext();
    const T = lang === "en" ? BlogsEn : BlogsVi;

    return (
        <Fragment>
            <Header />
            <Main>
                <Main_Container sx={{ height: 4000 }}>
                    <TopPage image={imageTopURL} title={T.page.title} description={T.page.description} />
                    {/* BODY */}
                </Main_Container>
            </Main>
        </Fragment>
    );
}
