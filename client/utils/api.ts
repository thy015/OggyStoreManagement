import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

// Custom error class for API errors
export class APIError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public response?: unknown
  ) {
    super(message);
    this.name = 'APIError';
  }
}
// Export a singleton instance with convenience methods
export interface ApiRequestOptions {
  headers?: Record<string, string>;
  data?: any;
  params?: Record<string, unknown> & ApiQueryParams;
  isRest?: boolean;
}

export interface ApiQueryParams {
  page?: number;
  limit?: number;
  sort?: string;
}

// Create and configure axios instance
const createAxiosInstance = (): AxiosInstance => {
  const instance = axios.create({
    baseURL: process.env.EXPO_PUBLIC_SERVER_URL ?? 'https://oggy-store-management-be.vercel.app',
    timeout: 30000,
  });
  return instance;
};

/**
 * Makes an HTTP request using the specified method, URL, and options.
 *
 * @template TData - The type of the response data
 * @template TError - The type of the error response
 */
export const makeRequest = async <TData = unknown, TError = unknown>(
  method: HttpMethod,
  url: string,
  options?: ApiRequestOptions & { [key: string]: any }
): Promise<TData> => {
  const httpClient = createAxiosInstance();

  const config: AxiosRequestConfig = {
    method,
    url,
    headers: options?.headers,
    params: options?.params,
    ...(options?.isRest && { transformResponse: [] }),
    ...(method !== 'GET' &&
      method !== 'DELETE' && {
        data: options?.data ?? {},
      }),
  };

  try {
    const response = await httpClient.request<TData>(config);

    return response.data;
  } catch (error) {
    console.error('Request error:', error);
    if (error instanceof APIError) {
      throw error;
    }
    throw new APIError('An unexpected error occurred', 500, error as TError);
  }
};

export const api = {
  get: <TData = unknown, TError = unknown>(
    url: string,
    options?: ApiRequestOptions
  ) => makeRequest<TData, TError>('GET', url, options),

  post: <TData = unknown, TError = unknown>(
    url: string,
    options?: ApiRequestOptions
  ) => makeRequest<TData, TError>('POST', url, options),

  put: <TData = unknown, TError = unknown>(
    url: string,
    options?: ApiRequestOptions
  ) => makeRequest<TData, TError>('PUT', url, options),

  patch: <TData = unknown, TError = unknown>(
    url: string,
    options?: ApiRequestOptions
  ) => makeRequest<TData, TError>('PATCH', url, options),

  delete: <TData = unknown, TError = unknown>(
    url: string,
    options?: ApiRequestOptions
  ) => makeRequest<TData, TError>('DELETE', url, options),
};

export default api;
