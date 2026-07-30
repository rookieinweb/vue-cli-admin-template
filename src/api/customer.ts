import request from "@/utils/request";
export default {
    getCustomers: (params: any) => request.get<any[]>("/customer/list", {params}),
    createCustomer: (customer: any) => request.post<any>("/customer/create", customer),
    updateCustomer: (customer: any) => request.put<any>("/customer/update", customer),
    deleteCustomer: (id: number) => request.delete<any>(`/customer/${id}`),
    getCustomerDetail: (id: number) => request.get<any>(`/customer/detail/${id}`),
    createFollow: (data:any) => request.post<any>(`/customer/create-follow`,data),
}

