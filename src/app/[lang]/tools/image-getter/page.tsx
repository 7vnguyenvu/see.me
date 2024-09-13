"use client";

import { Box, Button, CircularProgress, Divider, LinearProgress, Stack, Typography } from "@mui/joy";
import { Breadcrumb, FindImageLinksModal, Header, Main, Main_Container, chooseThemeValueIn, color } from "@/components";
import { Delete, Download, Refresh } from "@mui/icons-material";
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
    const [excludedImages, setExcludedImages] = useState<Set<string>>(new Set());
    const [progress, setProgress] = useState<number>(0); // State to track progress
    const [errorImages, setErrorImages] = useState<number>(0); // State to track error images
    const [blobUrls, setBlobUrls] = useState<Record<string, string | null>>({});
    const [isDownAllLoading, setIsDownAllLoading] = useState<boolean>(false); // Loading state for the button

    const [duplicates, setDuplicates] = useState<Record<string, number[]>>({}); // Store duplicate groups
    const [isHandleDuplicateLoading, setIsHandleDuplicateLoading] = useState<boolean>(false); // Loading state for the button
    const [progressHandleImage, setProgressHandleImage] = useState<number>(0); // State to track progress

    useEffect(() => {
        const findDuplicates = async () => {
            const imageGroups: Record<string, number[]> = {};

            for (let i = 0; i < validImages.length; i++) {
                const imageUrl = validImages[i];
                const fileName = imageUrl.split("/").pop()?.split("?")[0]; // Lấy tên file từ URL

                if (fileName) {
                    if (!imageGroups[fileName]) {
                        imageGroups[fileName] = [];
                    }
                    imageGroups[fileName].push(i + 1); // Lưu lại số thứ tự của ảnh
                }
            }

            // Chỉ giữ lại các nhóm có hơn 1 ảnh (các ảnh trùng nhau)
            const duplicates = Object.fromEntries(Object.entries(imageGroups).filter(([_, indexes]) => indexes.length > 1));

            setDuplicates(duplicates); // Lưu lại các ảnh trùng
        };

        findDuplicates();
    }, [validImages]);

    const handleRemoveAllLowerQuality = async () => {
        setIsHandleDuplicateLoading(true); // Hiển thị loading
        setProgressHandleImage(0); // Đặt tiến độ bắt đầu từ 0%

        // Hàm để so sánh ảnh pixel theo pixel
        const areImagesIdentical = async (url1: string, url2: string): Promise<boolean> => {
            const img1 = await loadImage(url1);
            const img2 = await loadImage(url2);

            if (img1.width !== img2.width || img1.height !== img2.height) return false;

            const canvas1 = document.createElement("canvas");
            const canvas2 = document.createElement("canvas");
            const ctx1 = canvas1.getContext("2d");
            const ctx2 = canvas2.getContext("2d");

            canvas1.width = img1.width;
            canvas1.height = img1.height;
            canvas2.width = img2.width;
            canvas2.height = img2.height;

            ctx1?.drawImage(img1, 0, 0);
            ctx2?.drawImage(img2, 0, 0);

            const data1 = ctx1?.getImageData(0, 0, img1.width, img1.height).data;
            const data2 = ctx2?.getImageData(0, 0, img2.width, img2.height).data;

            // So sánh pixel theo pixel
            if (data1 && data2) {
                for (let i = 0; i < data1.length; i++) {
                    if (data1[i] !== data2[i]) {
                        return false;
                    }
                }
                return true;
            }
            return false;
        };

        let updatedValidImages = [...validImages];
        const processedGroups = new Set();

        // Xử lý từng nhóm ảnh trùng lặp
        const totalGroups = Object.keys(duplicates).length;
        let processedGroupsCount = 0;

        for (const [fileName, indexes] of Object.entries(duplicates)) {
            if (processedGroups.has(fileName)) continue;

            // Lấy tất cả các URL ảnh trùng lặp
            const duplicateUrls = indexes.map((index) => validImages[index - 1]);

            if (duplicateUrls.length > 1) {
                const resolutions = await Promise.all(duplicateUrls.map((url) => getImageResolution(url)));

                // Tìm ảnh có độ phân giải cao nhất
                const highestQualityIndex = resolutions.reduce((maxIdx, current, idx, arr) => {
                    return current.width * current.height > arr[maxIdx].width * arr[maxIdx].height ? idx : maxIdx;
                }, 0);

                const highestQualityUrl = duplicateUrls[highestQualityIndex];

                // Đánh dấu các ảnh cần loại bỏ
                const duplicatesToRemove = new Set<string>();

                // Xử lý các ảnh có chất lượng giống nhau
                for (let i = 0; i < duplicateUrls.length; i++) {
                    for (let j = i + 1; j < duplicateUrls.length; j++) {
                        if (await areImagesIdentical(duplicateUrls[i], duplicateUrls[j])) {
                            duplicatesToRemove.add(duplicateUrls[j]);
                        }
                    }
                }

                // Loại bỏ tất cả các ảnh trùng lặp có chất lượng thấp hơn hoặc trùng tên
                updatedValidImages = updatedValidImages.filter((url) => url === highestQualityUrl || !duplicatesToRemove.has(url));
                processedGroups.add(fileName);
            }

            processedGroupsCount++;
            setProgressHandleImage(Math.round((processedGroupsCount / totalGroups) * 100));
        }

        // Loại bỏ ảnh có chất lượng giống nhau hoặc trùng tên
        const uniqueValidImages = Array.from(new Set(updatedValidImages));

        setValidImages(uniqueValidImages);
        setIsHandleDuplicateLoading(false);
        setProgressHandleImage(100);
    };

    // Hàm để load ảnh từ URL
    const loadImage = (url: string): Promise<HTMLImageElement> => {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.crossOrigin = "Anonymous"; // Đảm bảo có thể lấy dữ liệu pixel từ ảnh
            img.onload = () => resolve(img);
            img.onerror = reject;
            img.src = url;
        });
    };

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
        setIsDownAllLoading(true);
        if (validImages.length === 0) {
            window.alert(T.page.handleDownloadImages.missingFolderName);
            setAlert(T.page.handleDownloadImages.missingImage);
            setIsDownAllLoading(false);
            return;
        }

        if (folderName.trim() === "") {
            window.alert(T.page.handleDownloadImages.missingFolderName);
            setAlert(T.page.handleDownloadImages.missingFolderName);
            setIsDownAllLoading(false);
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

        const promises = validImages
            .filter((url) => !excludedImages.has(url)) // Lọc ảnh bị loại bỏ
            .map((url) => {
                return fetch(url)
                    .then((response) => response.blob())
                    .then((blob) => {
                        const urlParts = url.split("/");
                        let fileName = urlParts[urlParts.length - 1];

                        // Loại bỏ phần query string (nếu có) từ tên file
                        fileName = fileName.split("?")[0];

                        // Convert .webp to .jpg, giữ phần mở rộng gốc cho các định dạng khác
                        const extension = fileName.split(".").pop();
                        const baseFileName = fileName.split(".").slice(0, -1).join("."); // Loại bỏ phần mở rộng

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
                                folder?.file(`${uniqueFileName}.${extension === "webp" ? "jpg" : extension}`, blob);
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

        setIsDownAllLoading(false);
    };

    const handleClearContent = () => {
        setImageURLs("");
        setFolderName("");
        setValidImages([]);
        setExcludedImages(new Set());
        setBlobUrls({});
        setAlert(null);
        setProgress(0);
        setErrorImages(0);

        setLoadingValidImages(false);
        setIsDownAllLoading(false);
        setDuplicates({});
        setIsHandleDuplicateLoading(false);
        setProgressHandleImage(0);
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
                                <Stack direction={"row"} gap={2} sx={{ alignItems: "center", mt: 1 }}>
                                    <Typography level="body-sm" textColor="neutral.600">
                                        {/* Thống kê số lượng ảnh trùng */}
                                        {T.page.analytics.duplicates}: {Object.keys(duplicates).length}
                                    </Typography>

                                    {/* Nút xóa ảnh có chất lượng thấp */}
                                    {!!Object.keys(duplicates).length && (
                                        <Button
                                            variant="solid"
                                            color="warning"
                                            size="sm"
                                            disabled={isHandleDuplicateLoading}
                                            onClick={handleRemoveAllLowerQuality}
                                            endDecorator={
                                                isHandleDuplicateLoading ? (
                                                    <CircularProgress
                                                        size="sm"
                                                        variant="solid"
                                                        color="warning"
                                                        sx={{ scale: ".7 .7" }}
                                                        thickness={4}
                                                    />
                                                ) : null
                                            }
                                        >
                                            <Typography level="title-sm">
                                                {isHandleDuplicateLoading ? `${progressHandleImage}%` : T.page.buttonHandleDuplicate}
                                            </Typography>
                                        </Button>
                                    )}
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
                                                loading={isDownAllLoading}
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
                                {alert && (
                                    <Box
                                        sx={{
                                            mt: 2,
                                            color: "red",
                                            fontSize: ".8rem",
                                            fontWeight: "bold",
                                            textAlign: "center",
                                        }}
                                    >
                                        {alert}
                                    </Box>
                                )}
                            </Grid>

                            {/* Preview ảnh hợp lệ */}
                            {validImages.length > 0 && (
                                <Grid item xs={12}>
                                    <Grid container spacing={{ xs: 1, md: 1 }} sx={{ flexGrow: 1 }}>
                                        {validImages.map((imageUrl, index) => {
                                            // Check if the image is excluded
                                            if (excludedImages.has(imageUrl)) {
                                                return null; // Skip rendering the excluded image
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
                                                                console.error(`Failed to load image at ${imageUrl}`);
                                                            }}
                                                            style={{
                                                                width: "100%",
                                                                height: "100%",
                                                                objectFit: "cover",
                                                                border: "1px solid #ddd",
                                                                borderRadius: "4px",
                                                            }}
                                                        />

                                                        {/* Nút xóa */}
                                                        <Button
                                                            variant="solid"
                                                            color="danger"
                                                            size="sm"
                                                            sx={{
                                                                position: "absolute",
                                                                bottom: 0,
                                                                left: 0,
                                                                margin: "5px",
                                                                fontSize: "0.7rem",
                                                            }}
                                                            onClick={() => {
                                                                setExcludedImages((prev) => new Set(prev).add(imageUrl));
                                                            }}
                                                        >
                                                            <Delete />
                                                        </Button>

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
                                                                    link.download = imageUrl.endsWith(".webp")
                                                                        ? imageUrl.replace(".webp", ".jpg").split("?")[0].split("/").pop() ||
                                                                          `image-${index}.jpg`
                                                                        : imageUrl.split("?")[0].split("/").pop() || `image-${index}.jpg`; // Tên file download
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

// Helper function to compare image resolutions or sizes
const getImageResolution = async (imageUrl: string) => {
    return new Promise<{ width: number; height: number }>((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve({ width: img.width, height: img.height });
        img.onerror = reject;
        img.src = imageUrl;
    });
};
