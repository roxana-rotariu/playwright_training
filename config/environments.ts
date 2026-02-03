export type EnvName = 'dev' | 'stage' | 'prod';

export const ENV: Record<EnvName, { baseURL: string }> = {
  dev: {
    baseURL: 'https://www.demoblaze.com/'
  },
  stage: {
    baseURL: 'https://www.demoblaze.com/'
  },
  prod: {
    baseURL: 'https://www.demoblaze.com/'
  }
};