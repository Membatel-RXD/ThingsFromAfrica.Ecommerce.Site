console.log('Environment variable VITE_API_BASE_URL:', import.meta.env.VITE_API_BASE_URL);

export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL,
  TIMEOUT: 30_000, // 30 seconds
  HEADERS: {
    "Content-Type": "application/json",
    Accept: "text/plain",
  },
};

