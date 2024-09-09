import { Breadcrumbs, Typography } from "@mui/joy";

import { HomeRounded } from "@mui/icons-material";
import LinkTo from "@/components/link";

export function Breadcrumb() {
    return (
        <Breadcrumbs separator="›" aria-label="breadcrumbs">
            <LinkTo url="">
                <HomeRounded sx={{ mr: 0.5 }} />
                Trang chủ
            </LinkTo>
            {["Springfield", "Simpson"].map((item) => (
                <LinkTo key={item} url={item}>
                    {/* Cần xử lý url phân cấp theo như trên thanh địa chỉ => Trang hiện tại không cần gắn link */}
                    {item}
                </LinkTo>
            ))}

            <Typography>Homer</Typography>
        </Breadcrumbs>
    );
}
