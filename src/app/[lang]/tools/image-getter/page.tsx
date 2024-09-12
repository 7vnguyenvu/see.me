"use client";

import { Box, Button, Divider, LinearProgress, Stack, Typography } from "@mui/joy";
import { Breadcrumb, FindImageLinksModal, Header, Main, Main_Container, chooseThemeValueIn, color } from "@/components";
import { Download, Refresh } from "@mui/icons-material";
import { ToolEn, ToolVi } from "@/locales";
import { useEffect, useState } from "react";

import { Fragment } from "react";
import { Grid } from "@mui/material";
import JSZip from "jszip";
import { useGlobalContext } from "@/context/store";

const BreadcrumbParentTag = [
    {
        text: {
            vi: "Công cụ & Dịch vụ",
            en: "Tools & Services",
        },
        url: "tools",
    },
];

// LinearProgressWithLabel function
function LinearProgressWithLabel({ text, progress }: { text: string; progress: number }) {
    return (
        <Box sx={{ bgcolor: "white", width: "100%" }}>
            <LinearProgress
                determinate
                variant="outlined"
                color="neutral"
                size="sm"
                thickness={32}
                value={progress}
                sx={{
                    "--LinearProgress-radius": "0px",
                    "--LinearProgress-progressThickness": "24px",
                    boxShadow: "sm",
                    borderColor: "neutral.500",
                }}
            >
                <Typography level="body-xs" textColor="common.white" sx={{ fontWeight: "xl", mixBlendMode: "difference" }}>
                    {text} {`${Math.round(progress)}%`}
                </Typography>
            </LinearProgress>
        </Box>
    );
}

export default function Page() {
    const { lang, systemMode } = useGlobalContext();
    const T = lang === "en" ? ToolEn.imageGetter : ToolVi.imageGetter;

    const [imageURLs, setImageURLs] = useState<string>("");
    const [folderName, setFolderName] = useState<string>("");
    const [alert, setAlert] = useState<string | null>(null);
    const [loadingValidImages, setLoadingValidImages] = useState<boolean>(false);
    const [validImages, setValidImages] = useState<string[]>([]);
    const [progress, setProgress] = useState<number>(0); // State to track progress
    const [errorImages, setErrorImages] = useState<number>(0); // State to track error images
    const [blobUrls, setBlobUrls] = useState<Record<string, string | null>>({});

    // Kiểm tra tính hợp lệ của URL ảnh
    useEffect(() => {
        setLoadingValidImages(true);
        const urls = imageURLs
            .split("\n")
            .map((url) => url.trim())
            .filter((url) => url !== "");

        const checkValidImages = async () => {
            const validImageList: string[] = [];
            let errorCount = 0; // Biến đếm số lượng ảnh bị lỗi

            for (let i = 0; i < urls.length; i++) {
                try {
                    const response = await fetch(urls[i]);
                    if (response.ok && response.headers.get("content-type")?.includes("image")) {
                        validImageList.push(urls[i]);
                    } else {
                        errorCount++; // Tăng biến đếm khi ảnh bị lỗi
                    }
                } catch (error) {
                    console.error(T.page.checkValidImagesFail, error);
                    errorCount++; // Tăng biến đếm khi xảy ra lỗi fetch
                }

                // Cập nhật thanh tiến trình
                setProgress(((i + 1) / urls.length) * 100);
            }

            setValidImages(validImageList); // Cập nhật danh sách URL ảnh hợp lệ
            setErrorImages(errorCount); // Cập nhật số lượng ảnh bị lỗi
            setLoadingValidImages(false); // Tắt trạng thái loading khi hoàn thành
        };

        checkValidImages();
    }, [imageURLs]);

    useEffect(() => {
        const fetchBlobs = async () => {
            const newBlobUrls: Record<string, string | null> = {};

            for (const url of validImages) {
                try {
                    const response = await fetch(url);
                    const blob = await response.blob();
                    const blobUrl = URL.createObjectURL(blob);
                    newBlobUrls[url] = blobUrl;
                } catch (error) {
                    // console.error(`Failed to fetch or create URL for image at ${url}`, error);
                    newBlobUrls[url] = null; // Set to null if there's an error
                }
            }

            setBlobUrls(newBlobUrls);
        };

        fetchBlobs();

        // Clean up blob URLs when the component unmounts
        return () => {
            Object.values(blobUrls).forEach((url) => {
                if (url) URL.revokeObjectURL(url);
            });
        };
    }, [validImages]);

    const handleDownloadImages = () => {
        if (validImages.length === 0) {
            setAlert(T.page.handleDownloadImages.missingImage);
            return;
        }

        if (folderName.trim() === "") {
            setAlert(T.page.handleDownloadImages.missingFolderName);
            return;
        }

        setAlert(null);

        const zip = new JSZip();
        const folder = zip.folder(folderName);

        // Kiểu dữ liệu cho usedFileNames để theo dõi các tên file đã sử dụng
        const usedFileNames: Record<string, boolean> = {};

        // Hàm để cắt ngắn tên file nếu dài hơn 25 ký tự
        const truncateFileName = (fileName: string): string => {
            const maxLength = 20;
            return fileName.length > maxLength ? fileName.substring(0, maxLength) : fileName;

            // if (fileName.length > maxLength) {
            //     const namePart = fileName.substring(0, maxLength); // Giữ lại phần tên chính
            //     const extension = fileName.split(".").pop(); // Phần mở rộng
            //     return `${namePart}...${extension}`; // Thêm dấu ba chấm để chỉ ra tên đã bị cắt ngắn
            // }
            // return fileName;
        };

        // Hàm để lấy tên file duy nhất
        const getUniqueFileName = (baseFileName: string, dimensions: [number, number]): string => {
            const [width, height] = dimensions;
            const truncatedFileName = truncateFileName(baseFileName);
            let uniqueName = `${truncatedFileName}_${width}x${height}`;
            let counter = 1;

            // Kiểm tra xem tên file với kích thước đã tồn tại chưa
            while (usedFileNames[uniqueName]) {
                uniqueName = `${truncatedFileName}_${width}x${height} (${counter})`;
                counter++;
            }

            // Đánh dấu tên file là đã sử dụng
            usedFileNames[uniqueName] = true;
            return uniqueName;
        };

        const promises = validImages.map((url, index) => {
            return fetch(url)
                .then((response) => response.blob())
                .then((blob) => {
                    // Lấy tên file từ URL
                    let fileName = url.split("/").pop() || `image-${index}.jpg`;

                    // Loại bỏ chuỗi sau phần mở rộng ảnh (.jpg, .png, .webp, ...)
                    const regex = /(\.jpg|\.jpeg|\.png|\.webp|\.gif|\.bmp|\.tiff)(\?.*)?$/i;
                    const match = fileName.match(regex);

                    if (match) {
                        // Chỉ giữ lại phần trước và bao gồm phần mở rộng
                        fileName = fileName.substring(0, fileName.indexOf(match[0]) + match[1].length);
                    }

                    // Loại bỏ phần query string (nếu có) từ tên file
                    fileName = fileName.split("?")[0];

                    // Convert .webp to .jpg, giữ phần mở rộng gốc cho các định dạng khác
                    const extension = fileName.split(".").pop();
                    const baseFileName = fileName.split(".").slice(0, -1).join("."); // Loại bỏ phần mở rộng

                    let newFileName = fileName;
                    if (extension === "webp") {
                        newFileName = `${baseFileName}.jpg`;
                    }

                    // Tạo đối tượng URL từ blob để lấy kích thước ảnh
                    return new Promise<void>((resolve) => {
                        const img = new Image();
                        img.src = URL.createObjectURL(blob);
                        img.onload = () => {
                            const width = img.width;
                            const height = img.height;
                            const dimensions: [number, number] = [width, height];

                            // Đảm bảo tên file không trùng lặp và thêm kích thước (width x height)
                            const uniqueFileName = getUniqueFileName(baseFileName, dimensions);

                            // Add file vào folder với tên duy nhất
                            folder?.file(`${uniqueFileName}.${extension === "jpg" ? "jpg" : extension}`, blob);
                            resolve();
                        };
                    });
                })
                .catch((error) => console.error(T.page.handleDownloadImages.errorDownloading, error));
        });

        Promise.all(promises).then(() => {
            zip.generateAsync({ type: "blob" }).then((content) => {
                const link = document.createElement("a");
                link.href = URL.createObjectURL(content);
                link.download = `${folderName}.zip`;
                link.click();
            });
        });
    };

    const handleClearContent = () => {
        setImageURLs("");
        setFolderName("");
        setValidImages([]); // Xóa luôn danh sách preview
        setAlert(null);
        setProgress(0); // Reset progress
        setErrorImages(0); // Reset error images
    };

    return (
        <Fragment>
            <Header />
            <Main>
                <Main_Container>
                    {/* BREADCRUMB */}
                    <Breadcrumb currentText={T.name} parentList={BreadcrumbParentTag} />
                    {/* BODY */}
                    <Box sx={{ width: { xs: "inherit", md: "80%", lg: "70%" }, my: 2, mx: "auto" }}>
                        <Typography
                            level="h1"
                            textColor={chooseThemeValueIn(color.black.dark, color.black.dark, systemMode)}
                            sx={{ bgcolor: "#", svg: { fontSize: "2rem" }, display: { xs: "none", sm: "block" } }}
                        >
                            {T.page.title.md}
                        </Typography>
                        <Typography
                            level="h1"
                            textColor={chooseThemeValueIn(color.black.dark, color.black.dark, systemMode)}
                            sx={{ bgcolor: "#", svg: { fontSize: "2rem" }, display: { xs: "block", sm: "none" } }}
                        >
                            {T.page.title.xs}
                        </Typography>

                        <Grid container spacing={{ xs: 1, md: 2 }} sx={{ flexGrow: 1, pt: 4, pb: 1 }}>
                            {/* Nút tìm link ảnh */}
                            <Grid item xs={12} md={12}>
                                <FindImageLinksModal setImageURLs={setImageURLs} />
                            </Grid>

                            <Grid item xs={12} md={12}>
                                <textarea
                                    value={imageURLs}
                                    onChange={(e) => {
                                        setImageURLs(e.target.value);
                                    }}
                                    rows={20}
                                    placeholder={T.page.textAreaPlaceholder}
                                    style={{
                                        width: "100%",
                                        minHeight: "172px",
                                        padding: "10px",
                                        margin: "10px 0",
                                        border: "1px solid #ddd",
                                        borderRadius: "4px",
                                        boxSizing: "border-box" as const,
                                        resize: "vertical" as const,
                                    }}
                                />
                                {alert && (
                                    <div
                                        style={{
                                            color: "red",
                                            fontWeight: "bold" as const,
                                            textAlign: "center" as const,
                                        }}
                                    >
                                        {alert}
                                    </div>
                                )}
                                {loadingValidImages && <LinearProgressWithLabel text={T.page.progressLabel} progress={progress} />}
                            </Grid>

                            {/* Phần hiển thị thống kê ngay dưới textarea */}
                            <Grid item xs={12} md={12}>
                                <Stack direction={"row"} gap={2} sx={{ alignItems: "center" }}>
                                    <Typography level="body-sm" textColor="neutral.600">
                                        {T.page.analytics.total}: {imageURLs.split("\n").filter((url) => url.trim() !== "").length}
                                    </Typography>
                                    <Typography level="body-sm" textColor="neutral.600">
                                        {T.page.analytics.success}: {validImages.length}
                                    </Typography>
                                    <Typography level="body-sm" textColor="neutral.600">
                                        {T.page.analytics.fail}: {errorImages}
                                    </Typography>
                                </Stack>
                            </Grid>

                            <Grid item xs={12} md={12}>
                                <Grid container spacing={{ xs: 1, md: 2 }} sx={{ flexGrow: 1, alignItems: "end" }}>
                                    <Grid item xs={12} md={8}>
                                        <Box>
                                            <label
                                                style={{
                                                    display: "block",
                                                    margin: "10px 0",
                                                    fontWeight: "bold" as const,
                                                    color: "#333",
                                                }}
                                            >
                                                {T.page.folderNameLabel}
                                            </label>
                                            <input
                                                type="text"
                                                value={folderName}
                                                onChange={(e) => setFolderName(e.target.value)}
                                                placeholder={T.page.folderNamePlaceholder}
                                                style={{
                                                    width: "100%",
                                                    padding: "10px",
                                                    border: "1px solid #ddd",
                                                    borderRadius: "4px",
                                                    boxSizing: "border-box" as const,
                                                }}
                                            />
                                        </Box>
                                    </Grid>
                                    <Grid item xs={12} md={4}>
                                        <Stack direction={"row"} gap={2} sx={{ flexGrow: 1, justifyContent: { xs: "center", md: "right" } }}>
                                            <Button onClick={handleClearContent} color="danger" startDecorator={<Refresh />}>
                                                {T.page.buttonClear}
                                            </Button>
                                            <Button
                                                disabled={validImages.length <= 0}
                                                onClick={handleDownloadImages}
                                                startDecorator={<Download />}
                                                sx={{ flexGrow: 1 }}
                                            >
                                                {T.page.buttonDownloadAll}
                                            </Button>
                                        </Stack>
                                    </Grid>
                                </Grid>
                            </Grid>

                            {/* Preview ảnh hợp lệ */}
                            {validImages.length > 0 && (
                                <Grid item xs={12}>
                                    <Grid container spacing={{ xs: 1, md: 1 }} sx={{ flexGrow: 1 }}>
                                        {validImages.map((imageUrl, index) => {
                                            let imgUrl = imageUrl;

                                            // Convert .webp to .jpg
                                            if (imgUrl.endsWith(".webp")) {
                                                imgUrl = imgUrl.replace(".webp", ".jpg");
                                            }

                                            // Create a unique URL for each image blob
                                            const blobUrl = blobUrls[imageUrl] || "";

                                            return (
                                                <Grid item xs={6} sm={3} md={2} key={index}>
                                                    <Box sx={{ position: "relative", width: "100%", height: "100%" }}>
                                                        {/* Hiển thị số thứ tự */}
                                                        <Typography
                                                            sx={{
                                                                position: "absolute",
                                                                top: 0,
                                                                left: 0,
                                                                backgroundColor: "rgba(0, 0, 0, 0.6)",
                                                                color: "white",
                                                                padding: "2px 5px",
                                                                borderRadius: "4px",
                                                                fontWeight: "bold",
                                                                fontSize: "0.8rem",
                                                            }}
                                                        >
                                                            {index + 1}
                                                        </Typography>

                                                        <img
                                                            src={blobUrl || ""}
                                                            alt={`preview-${index}`}
                                                            onError={() => {
                                                                // Xử lý lỗi tải ảnh
                                                                console.error(`Failed to load image at ${imgUrl}`);
                                                            }}
                                                            style={{
                                                                width: "100%",
                                                                height: "100%",
                                                                objectFit: "cover",
                                                                border: "1px solid #ddd",
                                                                borderRadius: "4px",
                                                            }}
                                                        />

                                                        {/* Nút tải ngay */}
                                                        <Button
                                                            variant="solid"
                                                            color="primary"
                                                            size="sm"
                                                            sx={{
                                                                position: "absolute",
                                                                bottom: 0,
                                                                right: 0,
                                                                margin: "5px",
                                                                fontSize: "0.7rem",
                                                            }}
                                                            onClick={async () => {
                                                                try {
                                                                    const response = await fetch(imageUrl);
                                                                    const blob = await response.blob();
                                                                    const link = document.createElement("a");
                                                                    link.href = URL.createObjectURL(blob);
                                                                    link.download = imageUrl.split("/").pop() || `image-${index}.jpg`; // Tên file download
                                                                    document.body.appendChild(link);
                                                                    link.click();
                                                                    URL.revokeObjectURL(link.href); // Dọn dẹp URL blob
                                                                    document.body.removeChild(link);
                                                                } catch (error) {
                                                                    console.error("Error downloading image:", error);
                                                                }
                                                            }}
                                                        >
                                                            <Download />
                                                        </Button>
                                                    </Box>
                                                </Grid>
                                            );
                                        })}
                                    </Grid>
                                    <Divider sx={{ my: 2 }}>{T.page.showEnd}</Divider>
                                </Grid>
                            )}
                        </Grid>
                    </Box>
                </Main_Container>
            </Main>
        </Fragment>
    );
}
