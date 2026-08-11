import request from "@/utils/request";

export default {
    getOverview: (params: any) => request.get<any>("/dashboard/overview", { params }),
}
