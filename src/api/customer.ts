import request from "@/utils/request";
export default {
    getCustomers: () => request.get<any[]>("/customer"),
    createCustomer: (customer: any) => request.post<any>("/customer/create", customer),
    updateCustomer: (customer: any) => request.put<any>("/customer/update", customer),
    deleteCustomer: (id: number) => request.delete<any>(`/customer/${id}`),
}

