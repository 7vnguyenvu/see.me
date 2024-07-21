const NEXT_PUBLIC_UPLOAD_API_ENDPOINT = process.env.NEXT_PUBLIC_UPLOAD_API_ENDPOINT;

/**
 * UPLOAD FILE.
 *
 * @param {string} typeUpload - API path to upload. Example: 'image' || 'document'
 * @param {string} folderUpload - Example: 'logo', 'avatars', 'blog-thumbnails',...
 * @param {string} oldFileUrl - Url to delete old file
 * @param {File} newFile - File new
 * @returns {object} Return: {filename: 'filename', url: 'url'}
 * @example
 * uploadFile("image", "blog-thumbnails", data.blog?.thumbnail?.url, fileinput)
 */
export const uploadFile = async (typeUpload: string, folderUpload: string, oldFileUrl?: string, newFile?: File) => {
    try {
        const formData = new FormData();
        oldFileUrl && formData.append("oldFileUrl", oldFileUrl);
        newFile && formData.append("image", newFile);

        const response = await fetch(`${NEXT_PUBLIC_UPLOAD_API_ENDPOINT}/${typeUpload}`, {
            method: "POST",
            headers: { "folder-name": folderUpload },
            body: formData,
        });
        return await response.json();
    } catch (error) {
        console.error(error);
    }
};

export const uploadFiles = async (typeUpload: string, folderUpload: string, files: File[], oldFilesUrl?: string[]) => {
    try {
        const formData = new FormData();
        oldFilesUrl?.forEach((url) => formData.append("oldFilesUrl", url));
        files.forEach((file) => formData.append("images", file));

        const response = await fetch(`${NEXT_PUBLIC_UPLOAD_API_ENDPOINT}/${typeUpload}`, {
            method: "POST",
            headers: { "folder-name": folderUpload },
            body: formData,
        });
        return await response.json();
    } catch (error) {
        console.error(error);
    }
};
