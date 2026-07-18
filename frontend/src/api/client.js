import axios from "axios";

const client = axios.create({ baseURL: "/api" });

client.interceptors.request.use((config) => {
  const token = localStorage.getItem("bhmis_token");
  if (token) {
    config.headers.Authorization = `Token ${token}`;
  }
  return config;
});

client.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && !error.config.url.includes("/auth/login")) {
      localStorage.removeItem("bhmis_token");
      localStorage.removeItem("bhmis_user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export function apiErrorMessage(error) {
  const data = error.response?.data;
  if (!data) return error.message || "Request failed";
  if (typeof data === "string") return data;
  if (data.detail) return data.detail;
  if (Array.isArray(data.non_field_errors)) return data.non_field_errors.join(" ");
  const parts = [];
  for (const [key, value] of Object.entries(data)) {
    parts.push(`${key}: ${Array.isArray(value) ? value.join(" ") : value}`);
  }
  return parts.join(" | ") || "Request failed";
}

export default client;
