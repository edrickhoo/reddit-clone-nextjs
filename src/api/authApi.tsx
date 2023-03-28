import axios from "axios";

export const BASE_URL = "http://localhost:8080/api/";

export interface loginData {
  username: String;
  password: String;
}

export const loginApi = async (loginData: loginData) => {
  const res = await axios.post(BASE_URL + "auth/login", loginData);
  return res.data;
};
