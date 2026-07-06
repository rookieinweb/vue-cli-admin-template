import axios, {
  type AxiosError,
  type AxiosInstance,
  type AxiosRequestConfig,
} from "axios";
import { ElMessage } from "element-plus";

const TOKEN_KEY = "vue-admin-token";
const DEFAULT_ERROR_MESSAGE = "请求失败，请稍后重试";

export interface ApiResult<T = unknown> {
  success: boolean;
  message: string;
  data: T;
}

interface EggResult<T = unknown> {
  code: number;
  msg?: string;
  data?: T;
  token?: string;
  user?: unknown;
}

type RequestConfig = AxiosRequestConfig & {
  showError?: boolean;
};

const axiosConfigKeys = new Set([
  "params",
  "headers",
  "timeout",
  "withCredentials",
  "auth",
  "responseType",
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
  "showError",
]);

function isPlainParams(config: unknown): config is Record<string, unknown> {
  if (!config || typeof config !== "object") {
    return false;
  }

  return !Object.keys(config).some((key) => axiosConfigKeys.has(key));
}

function normalizeGetConfig(
  config?: RequestConfig | Record<string, unknown>,
): RequestConfig | undefined {
  if (isPlainParams(config)) {
    return { params: config };
  }

  return config as RequestConfig | undefined;
}

function normalizeApiBody<T>(body: ApiResult<T> | EggResult<T> | T): ApiResult<T> {
  if (body && typeof body === "object" && "code" in body) {
    const eggBody = body as EggResult<T>;

    if (eggBody.code !== 200) {
      throw new Error(eggBody.msg || DEFAULT_ERROR_MESSAGE);
    }

    const hasLoginShape = "token" in eggBody && "user" in eggBody;
    return {
      success: true,
      message: eggBody.msg || "操作成功",
      data: (hasLoginShape
        ? { token: eggBody.token, user: eggBody.user }
        : eggBody.data ?? eggBody.token ?? null) as T,
    };
  }

  if (body && typeof body === "object" && "success" in body) {
    const apiBody = body as ApiResult<T>;
    if (!apiBody.success) {
      throw new Error(apiBody.message || DEFAULT_ERROR_MESSAGE);
    }
    return apiBody;
  }

  return {
    success: true,
    message: "操作成功",
    data: body as T,
  };
}

function getErrorMessage(error: AxiosError | Error | unknown) {
  if (axios.isAxiosError(error)) {
    const responseData = error.response?.data as
      | { message?: string; msg?: string }
      | undefined;

    if (error.response?.status === 401) {
      return "登录已过期，请重新登录";
    }

    return (
      responseData?.message ||
      responseData?.msg ||
      error.message ||
      DEFAULT_ERROR_MESSAGE
    );
  }

  if (error instanceof Error) {
    return error.message || DEFAULT_ERROR_MESSAGE;
  }

  return DEFAULT_ERROR_MESSAGE;
}

const http: AxiosInstance = axios.create({
  baseURL: "/api",
  timeout: 10000,
});

http.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY);

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

http.interceptors.response.use(
  (response) => {
    response.data = normalizeApiBody(response.data);
    return response;
  },
  (error: AxiosError) => {
    const config = error.config as RequestConfig | undefined;
    const message = getErrorMessage(error);

    if (config?.showError !== false) {
      ElMessage.error(message);
    }

    return Promise.reject(new Error(message));
  },
);

const request = {
  async get<T>(url: string, config?: RequestConfig | Record<string, unknown>) {
    const response = await http.get<ApiResult<T>>(url, normalizeGetConfig(config));
    return response.data.data;
  },

  async post<T>(url: string, data?: unknown, config?: RequestConfig) {
    const response = await http.post<ApiResult<T>>(url, data, config);
    return response.data.data;
  },

  async put<T>(url: string, data?: unknown, config?: RequestConfig) {
    const response = await http.put<ApiResult<T>>(url, data, config);
    return response.data.data;
  },

  async delete<T>(url: string, config?: RequestConfig | Record<string, unknown>) {
    const response = await http.delete<ApiResult<T>>(
      url,
      normalizeGetConfig(config),
    );
    return response.data.data;
  },
};

export { http };
export default request;
