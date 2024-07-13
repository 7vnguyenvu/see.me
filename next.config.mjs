/** @type {import('next').NextConfig} */
const nextConfig = {
    async redirects() {
        return [
            {
                source: "/",
                destination: "/vi", // Điều hướng từ / đến /vi
                permanent: true,
            },
        ];
    },
};

export default nextConfig;
