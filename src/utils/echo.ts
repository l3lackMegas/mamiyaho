import ky from "ky"

const baseUrl = "https://echo.mamiyaho.com";

export const client = ky.create({
    prefixUrl: baseUrl,
});

export const clientBaseUrl = baseUrl;