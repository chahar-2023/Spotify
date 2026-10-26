import { BASE_URL, ENDPOINTS } from "./config";

// a 401 on these just means "wrong password", not "your session ended"
const AUTH_PATHS = [ENDPOINTS.registerUser, ENDPOINTS.loginUser, ENDPOINTS.logoutUser];

export async function http(path, { method = "GET", body } = {}) {
  const token = localStorage.getItem("token");
  const isForm = body instanceof FormData; // file upload: the browser sets the headers itself

  const res = await fetch(BASE_URL + path, {
    method,
    credentials: "include", // sends your JWT cookie
    headers: {
      ...(body && !isForm && { "Content-Type": "application/json" }),
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    body: body ? (isForm ? body : JSON.stringify(body)) : undefined,
  });

  const text = await res.text();
  let data = {};
  try { data = text ? JSON.parse(text) : {}; } catch { /* response was not JSON */ }

  // not logged in anymore (cookie expired / missing): clear the saved user and go to the login page
  if (res.status === 401 && !AUTH_PATHS.includes(path)) {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    if (window.location.pathname !== "/login") window.location.replace("/login");
  }

  if (!res.ok) {
    throw new Error(data.message || `Server returned ${res.status}. Check that the backend is running and the API path is correct.`);
  }
  return data;
}