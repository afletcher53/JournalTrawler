import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import axiosThrottle from 'axios-request-throttle';
import { Logger } from 'winston';
import HttpErrors from '../Typescript/Interfaces/HttpErrors.class';

import VendorHeader from '../Typescript/Interfaces/VendorHeader.interface';

export default class Http extends HttpErrors {
  private instance: AxiosInstance | null = null;
  baseURL: any;
  logger: any;
  headers: VendorHeader;

  constructor(baseURL: String, headers: VendorHeader, logger: Logger) {
    super();
    this.baseURL = baseURL;
    this.logger = logger;
    this.headers = headers;
  }

  private get http(): AxiosInstance {
    return this.instance != null ? this.instance : this.initHttp();
  }

  initHttp() {
    const http = axios.create({
      baseURL: this.baseURL,
      withCredentials: true,
      headers: this.headers
    });

    http.interceptors.response.use((response) => {
      this.logger.info(
        `[RESPONSE: ${response.config.method} ${response.status}] URL:${response.config.url}]`
      );
      return response;
    });

    http.interceptors.request.use(
      (config) => {
        this.logger.info(`[REQUEST: ${config.method}] URL:${config.url}]`);
        return config;
      },
      (error) => {
        this.logger.error(error);
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
    return this.http.get<T, R>(url, config);
  }

  head<T = any, R = AxiosResponse<T>>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<R> {
    return this.http.head(url, config);
  }
}
