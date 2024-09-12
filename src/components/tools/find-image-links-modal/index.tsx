import { Box, Button, Modal, ModalClose, Sheet, Typography } from "@mui/joy";
import { ToolEn, ToolVi } from "@/locales";

import { ImageSearch } from "@mui/icons-material";
import { color } from "@/components";
import { useGlobalContext } from "@/context/store";
import { useState } from "react";

export function FindImageLinksModal({ setImageURLs }: { setImageURLs: (urls: string) => void }) {
    const { lang } = useGlobalContext();
    const T = lang === "en" ? ToolEn.imageGetter.modal.FindImageLinksModal : ToolVi.imageGetter.modal.FindImageLinksModal;

    const [open, setOpen] = useState(false);
    const [inputText, setInputText] = useState("");

    const handleFindImageLinks = () => {
        const regex = /(https?:\/\/(?:[a-zA-Z0-9\-]+\.)+[a-zA-Z]{2,}(\/[^\s"']*\.(?:jpg|jpeg|png|svg|gif|webp))(?:\?[^\s"']*)?)/g;
        const foundLinks = inputText.match(regex);

        if (foundLinks) {
            const cleanedLinks = foundLinks.map((link) => {
                const cleanedLink = link;
                const match = cleanedLink.match(/https?:\/\/.*?(?=https?:\/\/[^\s]*\.(?:jpg|jpeg|png|svg|gif|webp))/);
                if (match) {
                    return cleanedLink.replace(match[0], "");
                }
                return cleanedLink;
            });

            setImageURLs(cleanedLinks.join("\n"));
        } else {
            alert(T.handleFindImageLinks_Null);
        }

        setOpen(false);
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
