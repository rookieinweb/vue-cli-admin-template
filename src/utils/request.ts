import axios, { type AxiosRequestConfig } from "axios";

interface ApiResult<T> {
  success: boolean;
  message: string;
  data: T;
}

interface EggResult<T = unknown> {
  code: number;
  msg?: string;
  data?: T;
  token?: string;
}

const TOKEN_KEY = "vue-admin-token";

const axiosGetConfigKeys = new Set([
  "params",
  "headers",
  "timeout",
  "withCredentials",
  "auth",
  "responseType",
  "responseEncoding",
  "onUploadProgress",
  "onDownloadProgress",
  "maxContentLength",
  "validateStatus",
  "maxRedirects",
  "cancelToken",
  "signal",
  "adapter",
  "transformRequest",
  "transformResponse",
  "paramsSerializer",
]);

function normalizeGetConfig(
  config?: AxiosRequestConfig | Record<string, unknown>,
): AxiosRequestConfig | undefined {
  if (!config) {
    return undefined;
  }

  const hasAxiosConfigKey = Object.keys(config).some((key) =>
    axiosGetConfigKeys.has(key),
  );

  if (hasAxiosConfigKey) {
    return config as AxiosRequestConfig;
  }

  return { params: config };
}

const http = axios.create({
  baseURL: "/api",
  timeout: 10000,
});

http.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY);
  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

http.interceptors.response.use((response) => {
  const body = response.data as EggResult | ApiResult<unknown>;

  if (body && typeof body === "object" && "code" in body) {
    const eggBody = body as EggResult;

    if (eggBody.code !== 200) {
      return Promise.reject(new Error(eggBody.msg ?? "请求失败"));
    }

    response.data = {
      success: true,
      message: eggBody.msg ?? "成功",
      data: eggBody.data ?? eggBody.token ?? null,
    } satisfies ApiResult<unknown>;

    return response;
  }

  const apiBody = body as ApiResult<unknown>;
  if (apiBody?.success === false) {
    return Promise.reject(new Error(apiBody.message));
  }

  return response;
});

const request = {
  get<T>(url: string, config?: AxiosRequestConfig | Record<string, unknown>) {
    return http.get<ApiResult<T>>(url, normalizeGetConfig(config));
  },
  post<T>(url: string, data?: unknown, config?: AxiosRequestConfig) {
    return http.post<ApiResult<T>>(url, data, config);
  },
};

export default request;
