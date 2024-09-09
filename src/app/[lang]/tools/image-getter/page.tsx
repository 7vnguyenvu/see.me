"use client";

import { Breadcrumb, Header, ImageGetter_Tools, Main, Main_Container, TopPage, color } from "@/components";
import { FaPenNib, FaToolbox } from "react-icons/fa";
import React, { useState } from "react";
import { ToolEn, ToolVi } from "@/locales";

import { Box } from "@mui/joy";
import { Fragment } from "react";
import { Grid } from "@mui/material";
import JSZip from "jszip";
import { useGlobalContext } from "@/context/store";

const imageTopURL = {
    light: "see.me-light.svg",
    dark: "see.me-dark.svg",
};

export default function Page() {
    const { lang } = useGlobalContext();
    const T = lang === "en" ? ToolEn : ToolVi;

    const [imageURLs, setImageURLs] = useState<string>("");
    const [folderName, setFolderName] = useState<string>("");
    const [alert, setAlert] = useState<string | null>(null);

    const handleDownloadImages = () => {
        const urls = imageURLs
            .split("\n")
            .map((url) => url.trim())
            .filter((url) => url !== "");
        if (urls.length === 0) {
            setAlert("Vui lòng nhập danh sách URL.");
            return;
        }

        if (folderName.trim() === "") {
            setAlert("Vui lòng nhập tên thư mục.");
            return;
        }

        setAlert(null); // Clear any previous alerts

        const zip = new JSZip();
        const folder = zip.folder(folderName);

        const promises = urls.map((url) => {
            return fetch(url)
                .then((response) => response.blob())
                .then((blob) => {
                    const urlParts = url.split("/");
                    let fileName = urlParts[urlParts.length - 1];

                    // Convert .webp to .jpg
                    if (fileName.endsWith(".webp")) {
                        fileName = fileName.replace(".webp", ".jpg");
                    }

                    // Add file to folder
                    folder?.file(fileName, blob);
                })
                .catch((error) => console.error("Error downloading image:", error));
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
        setAlert(null);
    };

    return (
        <Fragment>
            <Header />
            <Main>
                <Main_Container sx={{ height: 4000 }}>
                    {/* BREADCRUMB */}
                    <Breadcrumb />
                    {/* BODY */}
                    <div style={styles.container}>
                        <h1>Tải ảnh từ danh sách URL</h1>

                        <textarea
                            value={imageURLs}
                            onChange={(e) => setImageURLs(e.target.value)}
                            rows={10}
                            placeholder="Nhập danh sách URL ảnh, mỗi dòng là một URL"
                            style={styles.textarea}
                        />

                        <label style={styles.label}>Tên thư mục lưu ảnh:</label>
                        <input
                            type="text"
                            value={folderName}
                            onChange={(e) => setFolderName(e.target.value)}
                            placeholder="Nhập tên thư mục"
                            style={styles.input}
                        />

                        <div style={styles.buttonGroup}>
                            <button onClick={handleClearContent} style={styles.clearButton}>
                                Làm mới
                            </button>
                            <button onClick={handleDownloadImages} style={styles.downloadButton}>
                                Tải tất cả ảnh
                            </button>
                        </div>

                        {alert && <div style={styles.alert}>{alert}</div>}
                    </div>
                </Main_Container>
            </Main>
        </Fragment>
    );
}

// CSS styles for inline styling
const styles = {
    container: {
        width: "80%",
        margin: "0 auto",
        maxWidth: "1200px",
        padding: "20px",
        backgroundColor: "#fff",
        borderRadius: "8px",
        boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
    },
    textarea: {
        width: "100%",
        padding: "10px",
        margin: "10px 0",
        border: "1px solid #ddd",
        borderRadius: "4px",
        boxSizing: "border-box" as const,
    },
    input: {
        width: "100%",
        padding: "10px",
        margin: "10px 0",
        border: "1px solid #ddd",
        borderRadius: "4px",
        boxSizing: "border-box" as const,
    },
    label: {
        display: "block",
        margin: "10px 0",
        fontWeight: "bold" as const,
        color: "#333",
    },
    buttonGroup: {
        textAlign: "center" as const,
    },
    downloadButton: {
        backgroundColor: "#007bff",
        color: "#fff",
        padding: "10px 20px",
        margin: "10px 5px",
        border: "none",
        borderRadius: "4px",
        cursor: "pointer",
    },
    clearButton: {
        backgroundColor: "#dc3545",
        color: "#fff",
        padding: "10px 20px",
        margin: "10px 5px",
        border: "none",
        borderRadius: "4px",
        cursor: "pointer",
    },
    alert: {
        color: "red",
        fontWeight: "bold" as const,
        textAlign: "center" as const,
    },
};
