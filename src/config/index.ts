type AppConfig = {
  rtsp: {
    url: string;
    user: string;
    password: string;
    host: string;
    port: number;
    path: string;
    input: string;
    output: string;
  };
  hls: {
    url: string;
  };
  mediamtx: {
    rtspPort: number;
    hlsPort: number;
  };
  webapp: {
    port: number;
  };
  api: {
    url: string;
  };
  allowedHost: string;
  isDevelopment: boolean;
  isProduction: boolean;
};

export const config: AppConfig = {
  rtsp: {
    url: import.meta.env.VITE_RTSP_URL || "",
    user: import.meta.env.VITE_RTSP_USER || "",
    password: import.meta.env.VITE_RTSP_PASSWORD || "",
    host: import.meta.env.VITE_RTSP_HOST || "",
    port: parseInt(import.meta.env.VITE_RTSP_PORT) || 554,
    path: import.meta.env.VITE_RTSP_PATH || "",
    input: import.meta.env.VITE_RTSP_INPUT || "",
    output: import.meta.env.VITE_RTSP_OUTPUT || "",
  },
  hls: {
    url: import.meta.env.VITE_HLS_URL || "http://localhost:8888/cam/index.m3u8",
  },
  mediamtx: {
    rtspPort: parseInt(import.meta.env.VITE_MEDIAMTX_RTSP_PORT) || 8554,
    hlsPort: parseInt(import.meta.env.VITE_MEDIAMTX_HLS_PORT) || 8888,
  },
  webapp: {
    port: parseInt(import.meta.env.VITE_WEBAPP_PORT) || 5173,
  },
  api: {
    url: import.meta.env.VITE_API_URL || "http://localhost:3000",
  },
  allowedHost: import.meta.env.VITE_ALLOWED_HOST || "localhost",
  isDevelopment: import.meta.env.DEV === true,
  isProduction: import.meta.env.PROD === true,
};

export const getStreamUrl = () => {
  return config.hls.url;
};

export const getRtspInput = () => {
  return config.rtsp.input;
};

export const getRtspOutput = () => {
  return config.rtsp.output;
};

export const buildRtspUrl = () => {
  const encodedPassword = encodeURIComponent(config.rtsp.password);
  return `rtsp://${config.rtsp.user}:${encodedPassword}@${config.rtsp.host}:${config.rtsp.port}/${config.rtsp.path}`;
};

export const logConfig = () => {
  console.log("Current config:", {
    hlsUrl: config.hls.url,
    apiUrl: config.api.url,
    allowedHost: config.allowedHost,
    isDev: config.isDevelopment,
    isProd: config.isProduction,
    env: import.meta.env,
  });
};
