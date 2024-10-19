import { Box, Button, Modal, ModalClose, Sheet, Typography } from "@mui/joy";
import { ToolEn, ToolVi } from "@/locales";

import { ImageSearch } from "@mui/icons-material";
import { color } from "@/components";
import { useGlobalContext } from "@/context/store";
import { useState } from "react";

const parserDOM = new DOMParser();

export function FindImageLinksModal({ setImageURLs }: { setImageURLs: (urls: string) => void }) {
    const { lang } = useGlobalContext();
    const T = lang === "en" ? ToolEn.imageGetter.modal.FindImageLinksModal : ToolVi.imageGetter.modal.FindImageLinksModal;

    const [open, setOpen] = useState(false);
    const [inputText, setInputText] = useState("");
    const [error, setError] = useState<string | null>(null);

    const handleFindImageLinks = async () => {
        const links = await findImageLinks(inputText);

        if (links && links.length > 0) {
            setImageURLs(links.join("\n"));
            setError(null);
            setOpen(false);
        } else {
            setError(T.handleFindImageLinks_Null);
        }
    };

    return (
        <>
            <Button
                onClick={() => setOpen(true)}
                startDecorator={<ImageSearch />}
                sx={{
                    backgroundColor: color.primary.main,
                    color: color.primary.contrastText,
                    "&:hover": {
                        backgroundColor: color.primary.dark,
                    },
                }}
            >
                {T.buttonOpenModalText}
            </Button>

            <Modal
                aria-labelledby="modal-title"
                aria-describedby="modal-desc"
                open={open}
                onClose={() => setOpen(false)}
                sx={{ display: "flex", justifyContent: "center", alignItems: "center", px: 1 }}
            >
                <Sheet variant="outlined" sx={{ width: "100%", maxWidth: 600, borderRadius: "md", p: 2, boxShadow: "lg" }}>
                    <ModalClose variant="plain" sx={{ m: 1 }} />

                    <Box
                        sx={{
                            width: "100%",
                            bgcolor: "background.paper",
                            boxShadow: 24,
                            borderRadius: 2,
                            mx: "auto",
                            display: "flex",
                            flexDirection: "column",
                        }}
                    >
                        <Typography level="h3" marginBottom={2} startDecorator={<ImageSearch sx={{ color: "inherit" }} />}>
                            {T.titleModal}
                        </Typography>
                        <textarea
                            value={inputText}
                            onChange={(e) => setInputText(e.target.value)}
                            placeholder={T.placeholderTextarea}
                            rows={20}
                            style={{
                                width: "100%",
                                padding: "10px",
                                marginBottom: "20px",
                                borderRadius: "4px",
                                boxSizing: "border-box",
                                resize: "vertical",
                                fontSize: "1rem",
                            }}
                        />
                        {error && (
                            <Typography color="danger" marginBottom={2}>
                                {error}
                            </Typography>
                        )}
                        <Button
                            onClick={handleFindImageLinks}
                            variant="solid"
                            color="success"
                            sx={{
                                width: "100%",
                                fontSize: "1rem",
                                padding: "10px",
                            }}
                        >
                            {T.buttonFindText}
                        </Button>
                    </Box>
                </Sheet>
            </Modal>
        </>
    );
}

// //////////////////////////////////////////////////////// HANDLE COMPLEX

export function isBase64Image(url: string): boolean {
    return url.startsWith("data:image/");
}

function extractDomain(url: string): string {
    try {
        const parsedUrl = new URL(url);
        return parsedUrl.protocol + "//" + parsedUrl.hostname;
    } catch (error) {
        return "";
    }
}

function findImageLinksFromTags(text: string): string[] {
    if (!text.includes("<a") && !text.includes("<img")) {
        return [];
    }

    const doc = parserDOM.parseFromString(`<div>${text}</div>`, "text/html");

    const anchorImages = Array.from(doc.querySelectorAll("a"))
        .map((a) => a.getAttribute("href"))
        .filter((href): href is string => href !== null);

    const imgTags = Array.from(doc.querySelectorAll("img"))
        .map((img) => img.getAttribute("src"))
        .filter((src): src is string => src !== null);

    return imgTags;

    // // Sử dụng Object để loại bỏ các phần tử trùng lặp
    // const uniqueLinks: { [key: string]: boolean } = {};
    // anchorImages.concat(imgTags).forEach((link) => {
    //     uniqueLinks[link] = true;
    // });

    // return Object.keys(uniqueLinks);
}

function findImageLinksWithRegex(text: string): string[] {
    const regex = /(https?:\/\/[^\s"']+\.(?:jpg|jpeg|png|svg|gif|webp))/gi;
    const matches = text.match(regex);

    if (!matches) return [];

    return matches.map((link) => {
        const cleanMatch = link.match(/https?:\/\/.*?(?=https?:\/\/[^\s]*\.(?:jpg|jpeg|png|svg|gif|webp))/);
        return cleanMatch ? link.replace(cleanMatch[0], "") : link;
    });
}

function combineWithDomain(links: string[], text: string): string[] {
    const doc = parserDOM.parseFromString(text, "text/html");

    const domainElement = doc.querySelector('a[href^="http"]');
    const domain = domainElement ? extractDomain(domainElement.getAttribute("href") || "") : "";

    return links.map((link) => {
        if (isBase64Image(link)) return link;
        if (link.startsWith("http")) return link;
        if (link.startsWith("//")) return "https:" + link;
        if (link.startsWith("/")) return domain + link;
        return domain + "/" + link;
    });
}

async function findImageLinks(text: string): Promise<string[]> {
    const tagsLinks = findImageLinksFromTags(text);
    const regexLinks = findImageLinksWithRegex(text);

    // Sử dụng object để loại bỏ các phần tử trùng lặp
    const uniqueLinks: { [key: string]: boolean } = {};
    tagsLinks.concat(regexLinks).forEach((link) => {
        uniqueLinks[link] = true;
    });

    const allLinks = Object.keys(uniqueLinks);
    const combinedLinks = combineWithDomain(allLinks, text);

    return combinedLinks;
}
