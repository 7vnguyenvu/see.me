import { CheckEn, CheckVi } from "@/locales";

import type { Metadata } from "next";

type Props = {
    params: { lang: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const lang = params.lang || "en";
    const T = lang === "en" ? CheckEn : CheckVi;

    return {
        title: T.head.title,
        description: `Kiểm toán chất lượng trạng thái và các thông tin khác của UI -> Hướng đến trải nghiệm tốt nhất.`,
    };
}

export default function Root({ children }: { children: React.ReactNode }) {
    return children;
}
