import axios, { AxiosRequestConfig } from 'axios'

const apiServices = axios.create({
  baseURL: process.env.VUE_APP_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: false, // atau true jika backend pakai cookie
})

apiServices.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('session_token')
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

function downloadFile(url: string, config: AxiosRequestConfig = {}) {
  // Pastikan responseType blob
  const finalConfig: AxiosRequestConfig = {
    ...config,
    responseType: 'blob' as const,
  };

  return apiServices.get(url, finalConfig)
    .then((response) => {
      // Ambil nama file dari Content-Disposition header
      console.log("response", response.headers)
      const disposition = response.headers['content-disposition'];
      let filename = 'downloaded_file';

      if (disposition && disposition.includes('filename=')) {
        const match = disposition.match(/filename="?(.+?)"?$/);
        if (match) {
          filename = decodeURIComponent(match[1]);
        }
      }

      // Download file
      const blob = new Blob([response.data]);
      const blobUrl = window.URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = blobUrl;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    })
    .catch((error) => {
      console.error('Download failed:', error);
      throw error;
    });
}

export { apiServices, downloadFile }