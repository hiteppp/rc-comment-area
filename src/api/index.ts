import axios from "axios";
import { apiConfig } from "./config";
import { ParamsType } from "../interface";
const instance = axios.create({
  baseURL: "http://localhost:3000",
  timeout: 3000,
});

export const request = (config: string, params: ParamsType) => {
  const { path, methods } = apiConfig[config];
  if (methods === "get") {
    return get(path, params);
  } else {
    return post(path, params);
  }
};

const get = (path: string, params: ParamsType) => {
  return instance.get(path, { params });
};
const post = (path: string, params: ParamsType) => {
  return instance.post(path, params);
};
