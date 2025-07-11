export interface IAPIResponse<T> {
    isSuccessful: boolean;
    message?: string | null;
    payload?: T | null;
  }
  import axios, {
    type AxiosInstance,
    type AxiosResponse,
    AxiosError,
  } from "axios";
  import { API_CONFIG } from "../config/api-config";
  
  class ApiService {
    private api: AxiosInstance;
  
    constructor() {
      this.api = axios.create({
        baseURL: API_CONFIG.BASE_URL,
        timeout: API_CONFIG.TIMEOUT,
        headers: API_CONFIG.HEADERS,
      });
      // Request interceptor
      this.api.interceptors.request.use(
        (config: any) => {         
          return config;
        },
        (error: any) => {
          return Promise.reject(error);
        }
      );
  
      // Response interceptor
      this.api.interceptors.response.use(
        (response) => response,
        (error: AxiosError) => {
          // Handle global error cases
          if (error.response?.status === 401) {
            // Handle unauthorized access
            // You might want to redirect to login or refresh token
          }
          return Promise.reject(error);
        }
      );
    }
  
    // Generic GET method
    async get<T>(url: string, params?: unknown): Promise<T> {
      const response: AxiosResponse<T> = await this.api.get(url, { params });
      return response.data;
    }
  
    // Generic POST method
    async post<T>(url: string, data: unknown): Promise<T> {
      const response: AxiosResponse<T> = await this.api.post(url, data);
      return response.data;
    }
  
    // Generic PUT method
    async put<T>(url: string, data: unknown): Promise<T> {
      const response: AxiosResponse<T> = await this.api.put(url, data);
      return response.data;
    }
  
    // Generic DELETE method
    async delete<T>(url: string): Promise<T> {
      const response: AxiosResponse<T> = await this.api.delete(url);
      return response.data;
    }
  }
  
  export const apiService = new ApiService();
  