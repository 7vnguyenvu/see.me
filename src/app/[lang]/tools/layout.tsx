import { ToolEn, ToolVi } from "@/locales";

import type { Metadata } from "next";

type Props = {
    params: { lang: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const lang = params.lang || "en";
    const T = lang === "en" ? ToolEn : ToolVi;

    return {
        title: T.head.title,
        description: T.head.description,
    };
}

export default function Root({ children }: { children: React.ReactNode }) {
    return children;
}
