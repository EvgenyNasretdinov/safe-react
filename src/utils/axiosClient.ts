import axios, { AxiosInstance } from 'axios'

export const client = async (baseURL: string): Promise<AxiosInstance> =>
  axios.create({
    baseURL,
    maxRedirects: 0,
    validateStatus(status: number) {
      return status >= 200 && status <= 302
    },
  })
