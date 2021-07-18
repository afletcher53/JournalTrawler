import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import axiosThrottle from 'axios-request-throttle';
import { doajBaseurl, doajHeaders } from '../config/doaj.config';
import doajLogger from '../loggers/doaj.logger.';
import HttpErrors from '../Typescript/Interfaces/HttpErrors.class';
import VendorHeader from '../Typescript/Interfaces/VendorHeader.interface';

const headers: VendorHeader = doajHeaders;

class Http extends HttpErrors {
  private instance: AxiosInstance | null = null;

  private get http(): AxiosInstance {
    return this.instance != null ? this.instance : this.initHttp();
  }

  initHttp() {
    const http = axios.create({
      baseURL: doajBaseurl,
      withCredentials: true,
      headers
    });

    http.interceptors.response.use(
      (response) => {
        doajLogger.info(
          `[RESPONSE: ${response.config.method} ${response.status}] URL:${response.config.url}]`
        );
        return response;
      },
      (error) => {
        const { response } = error;
        doajLogger.error(error);
        return this.handleError(response);
      }
    );

    http.interceptors.request.use(
      (config) => {
        doajLogger.info(`[REQUEST: ${config.method}] URL:${config.url}]`);
        return config;
      },
      (error) => {
        doajLogger.error(error);
        return Promise.reject(error);
      }
    );
    axiosThrottle.use(http, { requestsPerSecond: 5 });
    this.instance = http;

    return http;
  }

  request<T = any, R = AxiosResponse<T>>(
    config: AxiosRequestConfig
  ): Promise<R> {
    return this.http.request(config);
  }

  get<T = any, R = AxiosResponse<T>>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<R> {
    doajLogger.info(url);
    return this.http.get<T, R>(url, config);
  }

  head<T = any, R = AxiosResponse<T>>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<R> {
    return this.http.head(url, config);
  }
}

export const http = new Http();
