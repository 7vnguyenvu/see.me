const defaultExport = {
    head: {
        title: "Công cụ & Dịch vụ",
        description: "Công cụ của SEE.ME - chia sẻ các tính năng và dịch vụ hỗ trợ bạn trong công việc và học tập hiệu quả nhất.",
    },
    page: {
        title: {
            xs: `Công cụ`,
            md: `Công cụ & Dịch vụ`,
        },
        description: {
            xs: `[ SEE . ME ] Tools
Hỗ trợ bạn hiệu quả nhất!`,
            md: `Công cụ của [ SEE . ME ]
Chia sẻ các tính năng và dịch vụ hỗ trợ bạn trong công việc và học tập hiệu quả nhất.`,
        },
    },
    imageGetter: {
        name: "Trình thu thập Ảnh",
        head: {
            title: "Lấy ảnh qua URLs",
            description: "Công cụ hỗ trợ lấy ảnh nhanh từ URL - Lấy ảnh theo danh sách một cách nhanh chống và hiệu quả.",
        },
        page: {
            title: {
                xs: `Danh sách URL`,
                md: `Tải ảnh từ danh sách URL của bạn`,
            },
            textAreaPlaceholder: "Nhập danh sách URL ảnh, mỗi dòng là một URL",
            folderNameLabel: "Đặt tên cho file chứa",
            folderNamePlaceholder: "Ví dụ: Danh sách ảnh",
            progressLabel: "Đang tìm ảnh…",
            handleDownloadImages: {
                missingImage: "Không có ảnh hợp lệ để tải.",
                missingFolderName: "Vui lòng nhập tên thư mục.",
                errorDownloading: "Lỗi khi tải hình ảnh",
            },
            checkValidImagesFail: "Lỗi khi tải hình ảnh:",
            analytics: {
                total: "Tổng số URL",
                success: "URL tìm thấy",
                fail: "URL lỗi",
            },
            buttonClear: "Làm mới",
            buttonDownloadAll: "Tải tất cả",
            showEnd: "Tất cả kết quả đã được hiển thị!",
        },
        modal: {
            FindImageLinksModal: {
                handleFindImageLinks_Null: "Không tìm thấy link ảnh nào.",
                buttonOpenModalText: "Tìm URLs trong văn bản ⚡",
                buttonFindText: "Tìm",
                titleModal: "Tìm URLs ⚡",
                placeholderTextarea: "Dán đoạn văn bản có chứa link ảnh vào đây...",
            },
        },
    },
};

export default defaultExport;
