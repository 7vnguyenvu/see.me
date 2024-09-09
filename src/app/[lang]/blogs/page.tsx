"use client";

import { BlogsEn, BlogsVi } from "@/locales";
import { Header, Main, Main_Container, TopPage } from "@/components";

import { FaPenNib } from "react-icons/fa";
import { Fragment } from "react";
import { useGlobalContext } from "@/context/store";

const imageTopURL = {
    light: "see.me-light.svg",
    dark: "see.me-dark.svg",
};

export default function Page() {
    const { lang } = useGlobalContext();
    const T = lang === "en" ? BlogsEn : BlogsVi;

    return (
        <Fragment>
            <Header />
            <Main>
                <Main_Container sx={{ height: 4000 }}>
                    <TopPage
                        image={imageTopURL}
                        title={T.page.title}
                        description={T.page.description}
                        afterTitle={
                            <Fragment>
                                ..
                                <FaPenNib />
                            </Fragment>
                        }
                    />
                    {/* BODY */}
                </Main_Container>
            </Main>
        </Fragment>
    );
}
