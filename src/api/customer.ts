import request from "@/utils/request";

export interface CustomerQuery {
    page?: number;
    size?: number;
    customer_name?: string;
    phone?: string;
    customer_status?: string;
}

export interface CustomerItem {
    id: number;
    customer_name?: string;
    phone?: string;
    customer_source?: string;
    customer_status?: string;
    owner?: { username?: string };
    remark?: string;
    create_time?: string;
}

export interface CustomerListResponse {
    list?: CustomerItem[];
    total?: number;
}

export interface CustomerDetailResponse extends CustomerItem {
    tags?: string[];
    follows?: Array<{
        created_at: string;
        follow_type: string;
        content: string;
    }>;
}

type CustomerPayload = Record<string, unknown>;

export default {
    getCustomers: (params: CustomerQuery) =>
        request.get<CustomerListResponse>("/customer/list", { params }),
    createCustomer: (customer: CustomerPayload) =>
        request.post<unknown>("/customer/create", customer),
    updateCustomer: (customer: CustomerPayload) =>
        request.put<unknown>("/customer/update", customer),
    deleteCustomer: (id: number) => request.delete<unknown>(`/customer/${id}`),
    getCustomerDetail: (id: number) =>
        request.get<CustomerDetailResponse>(`/customer/detail/${id}`),
    createFollow: (data: CustomerPayload) =>
        request.post<unknown>("/customer/create-follow", data),
}
