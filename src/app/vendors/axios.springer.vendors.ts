import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import axiosThrottle from 'axios-request-throttle';
import { springerBaseurl, springerHeaders } from '../config/springer.config';
import crossrefLogger from '../loggers/crossref.logger';

enum StatusCode {
  Unauthorized = 401,
  Forbidden = 403,
  TooManyRequests = 429,
  InternalServerError = 500,
  NotFound = 404
}

const headers: Readonly<Record<string, string | boolean>> = springerHeaders;

class Http {
  private instance: AxiosInstance | null = null;

  private get http(): AxiosInstance {
    return this.instance != null ? this.instance : this.initHttp();
  }

  initHttp() {
    const http = axios.create({
      baseURL: springerBaseurl,
      withCredentials: true,
      headers
    });

    http.interceptors.response.use(
      (response) => {
        crossrefLogger.info(
          `[RESPONSE: ${response.config.method} ${response.status}] URL:${response.config.url}]`
        );
        return response;
      },
      (error) => {
        const { response } = error;
        crossrefLogger.error(error);
        return this.handleError(response);
      }
    );

    http.interceptors.request.use(
      (config) => {
        crossrefLogger.info(`[REQUEST: ${config.method}] URL:${config.url}]`);
        return config;
      },
      (error) => {
        crossrefLogger.error(error);
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
      default:
        this.generateError(error);
    }

    return Promise.reject(error);
  }

  private generateError(error) {
    crossrefLogger.error(error);
    return crossrefLogger.error(
      `[${error.status}: ${error.config.method} ${error.config.url}:]`
    );
  }
}

export const http = new Http();
