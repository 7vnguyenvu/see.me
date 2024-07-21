const NEXT_PUBLIC_BACKEND_URI = process.env.NEXT_PUBLIC_BACKEND_URI;

export const getImage = (url: string) => {
    return `${NEXT_PUBLIC_BACKEND_URI}/${url}`;
};
