const defaultExport = {
    head: {
        title: "Tools & Services",
        // description: "Công cụ của SEE.ME - chia sẻ các tính năng và dịch vụ hỗ trợ bạn trong công việc và học tập hiệu quả nhất.",
        description: "SEE.ME Tools - sharing features and services to support you in your work and study most effectively.",
    },
    page: {
        title: {
            xs: `Tools`,
            md: `Tools & Services`,
        },
        description: {
            xs: `[ SEE . ME ]
Support you most effectively!`,
            md: `[ SEE . ME ] Tools
Share features and services to support you in your work and study most effectively.`,
        },
    },
    imageGetter: {
        name: "Image Getter",
        head: {
            title: "Get images via URLs",
            description: "A tool to quickly get images from URLs - Get images from a list quickly and effectively.",
        },
        page: {
            title: {
                xs: `Images URLs`,
                md: `Download images from your URL list`,
            },
            textAreaPlaceholder: "Enter a list of image URLs, one per line",
            folderNameLabel: "Name the container",
            folderNamePlaceholder: "Example: List of images",
            progressLabel: "Searching for images…",
            handleDownloadImages: {
                missingImage: "There are no valid images to download.",
                missingFolderName: "Please enter a folder name containing the images.",
                errorDownloading: "Error download images",
            },
            checkValidImagesFail: "Error fetching images:",
            analytics: {
                total: "Total URLs",
                success: "Valid URL",
                fail: "Error URLs",
                duplicates: "Duplicate URLs",
            },
            buttonHandleDuplicate: "Clean up now",
            buttonClear: "Refresh",
            buttonDownloadAll: "Download all",
            showEnd: "All results shown!",
        },
        modal: {
            FindImageLinksModal: {
                handleFindImageLinks_Null: "No image links found.",
                buttonOpenModalText: "Find URLs in text ⚡",
                buttonFindText: "Find",
                titleModal: "Find URLs ⚡",
                placeholderTextarea: "Paste text containing image links here...",
            },
        },
    },
};

export default defaultExport;
