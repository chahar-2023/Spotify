import { http } from "./http";
import { ENDPOINTS } from "./config";

export const registerUser = ({ username, email, password, role }) =>
  http(ENDPOINTS.registerUser, { method: "POST", body: { username, email, password, role } });

export const loginUser = ({ email, password }) =>
  http(ENDPOINTS.loginUser, { method: "POST", body: { email, password } });

// If your backend logout route is router.get("/logout"), change "POST" to "GET"
export const logoutUser = () => http(ENDPOINTS.logoutUser, { method: "POST" });