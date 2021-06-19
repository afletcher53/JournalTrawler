import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";
import axiosThrottle from 'axios-request-throttle';
import { doajBaseurl, doajHeaders } from "../config/doaj.config";
import systemLogger from "../loggers/system.logger";



enum StatusCode {
  Unauthorized = 401,
  Forbidden = 403,
  TooManyRequests = 429,
  InternalServerError = 500,
  NotFound = 404,
}

const headers: Readonly<Record<string, string | boolean>> = doajHeaders;

class Http {
  private instance: AxiosInstance | null = null;

  private get http(): AxiosInstance {
    return this.instance != null ? this.instance : this.initHttp();
  }

  initHttp() {
    const http = axios.create({
      baseURL: doajBaseurl,
      headers,
      withCredentials: true,
    });

    http.interceptors.response.use(
      (response) => {
        systemLogger.info(`[RESPONSE: ${response.config.method} ${response.status}] URL:${response.config.url}]`);
        return response},
      (error) => {
        const { response } = error;
        console.log(error)
        return this.handleError(response);
      }
    );

    http.interceptors.request.use((config) => {
      systemLogger.info(`[REQUEST: ${config.method}] URL:${config.url}]`);
      return config;
    }, (error) => {
      systemLogger.error(error);
      return Promise.reject(error);
    });
    
    axiosThrottle.use(http, {requestsPerSecond: 5});

    this.instance = http;


    return http;
  }

  request<T = any, R = AxiosResponse<T>>(config: AxiosRequestConfig): Promise<R> {
    return this.http.request(config);
  }

  get<T = any, R = AxiosResponse<T>>(url: string, config?: AxiosRequestConfig): Promise<R> {
    console.log(url)
    return this.http.get<T, R>(url, config);
  }

  head<T = any, R = AxiosResponse<T>>(url: string, config?: AxiosRequestConfig): Promise<R> {
    return this.http.head(url, config);
  }

  // Handle global app errors
  // We can handle generic app errors depending on the status code
  private handleError(error) {
    const { status } = error;
  

    switch (status) {
      case StatusCode.InternalServerError: {
        this.generateError(error);
      }
      case StatusCode.Forbidden: {
        this.generateError(error);
      }
      case StatusCode.Unauthorized: {
        this.generateError(error);
      }
      case StatusCode.TooManyRequests: {
        this.generateError(error);
      }
      case StatusCode.NotFound: {
        this.generateError(error);
      }
    }

    return Promise.reject(error);
  }

  private generateError(error) {
    console.log(error)
    return systemLogger.error(`[${error.status}: ${error.config.method} ${error.config.url}:]`);
  }
}

export const http = new Http();