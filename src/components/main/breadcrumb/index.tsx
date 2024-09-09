import { Breadcrumbs, Stack, Typography } from "@mui/joy";

import { HomeRounded } from "@mui/icons-material";
import LinkTo from "@/components/link";
import { color } from "@/components";
import { useGlobalContext } from "@/context/store";

export interface BreadcrumbParentTag {
    text: {
        vi: string;
        en: string;
    };
    url: string;
}

interface Props {
    currentText: string;
    parentList?: Array<BreadcrumbParentTag>;
}

export function Breadcrumb({ currentText, parentList }: Props) {
    const { lang } = useGlobalContext();

    return (
        <Breadcrumbs separator="/" aria-label="breadcrumbs" sx={{ fontWeight: "md" }}>
            <LinkTo url="/">
                <Stack direction={"row"} gap={1} sx={{ alignItems: "center", color: color.primary.main }}>
                    <HomeRounded sx={{ color: "inherit" }} />
                    <Typography>Trang chủ</Typography>
                </Stack>
            </LinkTo>
            {parentList?.map((item) => (
                <LinkTo key={item.url} url={item.url} sx={{ color: color.primary.dark }}>
                    {item.text[lang]}
                </LinkTo>
            ))}
            <Typography sx={{ color: color.black.dark, fontWeight: "md" }}>{currentText}</Typography>
        </Breadcrumbs>
    );
}
