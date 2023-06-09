import axios from "axios";
import { cookies } from "./subredditApi";

export const BASE_URL =
  "https://reddit-clone-back-end-production.up.railway.app/api/";

export interface LoginData {
  username: String;
  password: String;
}

interface LoginResponse {
  authenticationToken: string;
  refreshToken: string;
  expiresAt: number;
  username: string;
}

export const getUsername = () => {
  if (parseJwt(cookies.get("jwt"))) {
    const jwt = parseJwt(cookies.get("jwt"));
    return jwt.sub;
  }
};

export const loginApi = async (loginData: LoginData) => {
  const res = await axios.post<LoginResponse>(
    BASE_URL + "auth/login",
    loginData
  );
  return res.data;
};

export function parseJwt(token: string) {
  if (!token) {
    return;
  }
  const base64Url = token.split(".")[1];
  const base64 = base64Url.replace("-", "+").replace("_", "/");
  return JSON.parse(window.atob(base64));
}

export const checkJwtValidation = async () => {
  const cookieExpire = new Date(new Date().getTime() + 5 * 24 * 60 * 60 * 1000);

  if (Date.now() / 1000 < cookies.get("jwt-expire")) {
    return;
  }

  if (cookies.get("jwt-refresh")) {
    const res = await axios.post(BASE_URL + "auth/refresh/token", {
      refreshToken: cookies.get("jwt-refresh"),
      username: cookies.get("jwt") ? parseJwt(cookies.get("jwt")).sub : null,
    });
    cookies.remove("jwt");
    cookies.remove("jwt-expire");
    cookies.set("jwt", res.data.authenticationToken, {
      expires: cookieExpire,
    });
    cookies.set("jwt-refresh", res.data.refreshToken, {
      expires: cookieExpire,
    });
    cookies.set("jwt-expire", res.data.expiresAt, {
      expires: cookieExpire,
    });
    return true;
  }

  throw new Error("User is not logged in");
};
