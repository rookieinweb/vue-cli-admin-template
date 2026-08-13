import request from "@/utils/request";

type DashboardQuery = Record<string, unknown>;

export default {
    getOverview: (params: DashboardQuery) =>
        request.get<unknown>("/dashboard/overview", { params }),
    getSalesFunnel: (params: DashboardQuery) =>
        request.get<unknown>("/dashboard/sales-funnel", { params }),
}
