import request from "@/utils/request";

export type WebsiteProjectData = Record<string, unknown>;

export interface WebsitePageDetail {
  id: string | number;
  project_data?: WebsiteProjectData | null;
  domain?: string;
  publish_url?: string;
}

export interface WebsitePagePayload {
  id: string | number;
  project_data: WebsiteProjectData;
}

export interface WebsitePublishResult {
  url?: string;
  domain?: string;
}

export function getWebsitePageDetailApi(id: string | number) {
  return request.get<WebsitePageDetail>("/website/page/detail", {
    params: { id },
    showError: false,
  });
}

export function saveWebsitePageApi(payload: WebsitePagePayload) {
  return request.post<WebsitePageDetail>("/website/page/save", payload, {
    showError: false,
  });
}

export function publishWebsitePageApi(id: string | number) {
  return request.post<WebsitePublishResult>(
    "/website/page/publish",
    { id },
    { showError: false },
  );
}
