import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";
import crossrefConfig from '../config/crossref.config';
import { crossRefLogger } from '../../logger';
import axiosThrottle from 'axios-request-throttle';

enum StatusCode {
  Unauthorized = 401,
  Forbidden = 403,
  TooManyRequests = 429,
  InternalServerError = 500,
  NotFound = 404,
}

const headers: Readonly<Record<string, string | boolean>> = crossrefConfig.headers;

class Http {
  private instance: AxiosInstance | null = null;

  private get http(): AxiosInstance {
    return this.instance != null ? this.instance : this.initHttp();
  }

  initHttp() {
    const http = axios.create({
      baseURL: crossrefConfig.baseurl,
      headers,
      withCredentials: true,
    });

    http.interceptors.response.use(
      (response) => {
        crossRefLogger.info(`[RESPONSE: ${response.config.method} ${response.status}] URL:${response.config.url}]`);
        return response},
      (error) => {
        const { response } = error;
        return this.handleError(response);
      }
    );

    http.interceptors.request.use((config) => {
      crossRefLogger.info(`[REQUEST: ${config.method}] URL:${config.url}]`);
      return config;
    }, (error) => {
      crossRefLogger.error(error);
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
    return crossRefLogger.error(`[${error.status}: ${error.config.method} ${error.config.url}:]`);
  }
}

export const http = new Http();