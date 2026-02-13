export type EnvName = "dev" | "stage" | "prod";

export type EnvConfig = {
  baseURL: string;
  apiBaseURL: string;
};

export const ENV: Record<EnvName, EnvConfig> = {
  dev: {
    baseURL: "https://www.demoblaze.com/",
    apiBaseURL: "https://api.demoblaze.com/",
  },
  stage: {
    baseURL: "https://www.demoblaze.com/",
    apiBaseURL: "https://api.demoblaze.com/",
  },
  prod: {
    baseURL: "https://www.demoblaze.com/",
    apiBaseURL: "https://api.demoblaze.com/",
  },
};
