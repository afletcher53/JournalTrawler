import { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";
declare class Http {
    private instance;
    private get http();
    initHttp(): AxiosInstance;
    request<T = any, R = AxiosResponse<T>>(config: AxiosRequestConfig): Promise<R>;
    get<T = any, R = AxiosResponse<T>>(url: string, config?: AxiosRequestConfig): Promise<R>;
    head<T = any, R = AxiosResponse<T>>(url: string, config?: AxiosRequestConfig): Promise<R>;
    private handleError;
    private generateError;
}
export declare const http: Http;
export {};
//# sourceMappingURL=axiosCrossref.vendors.d.ts.map