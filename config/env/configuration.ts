export const configuration = () => ({
    NODE_ENV: process.env.NODE_ENV,
    PORT: parseInt(process.env.PORT, 10) || 3000,
    ENABLE_CORS: process.env.ENABLE_CORS || true,
    ENABLE_DOCS: process.env.ENABLE_CORS || true,
});