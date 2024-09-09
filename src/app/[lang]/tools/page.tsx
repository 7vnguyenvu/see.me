"use client";

import { Breadcrumb, Header, ImageGetter_Tools, Main, Main_Container, TopPage, color } from "@/components";
import { ToolEn, ToolVi } from "@/locales";

import { FaToolbox } from "react-icons/fa";
import { Fragment } from "react";
import { Grid } from "@mui/material";
import { useGlobalContext } from "@/context/store";

const imageTopURL = {
    light: "see.me-light.svg",
    dark: "see.me-dark.svg",
};

export default function Page() {
    const { lang } = useGlobalContext();
    const T = lang === "en" ? ToolEn : ToolVi;

    return (
        <Fragment>
            <Header />
            <Main>
                <Main_Container sx={{ height: 4000 }}>
                    <TopPage
                        bgcolor={color.black.sub}
                        image={imageTopURL}
                        title={T.page.title}
                        description={T.page.description}
                        afterTitle={
                            <Fragment>
                                {"|| "}
                                <FaToolbox />
                            </Fragment>
                        }
                    />
                    {/* BREADCRUMB */}
                    <Breadcrumb currentText={T.page.title.md} />
                    {/* BODY */}
                    <Grid container spacing={{ xs: 1, md: 1 }} sx={{ flexGrow: 1 }}>
                        {/* Image Geter */}
                        <Grid item xs={12} sm={6} md={3} lg={2}>
                            <ImageGetter_Tools lang={lang} />
                        </Grid>
                    </Grid>
                </Main_Container>
            </Main>
        </Fragment>
    );
}
