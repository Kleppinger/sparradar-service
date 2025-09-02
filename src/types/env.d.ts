declare global {
  namespace NodeJS {
    interface ProcessEnv {
        OPENAI_API_KEY: string;
        JWT_SECRET: string;
    }
  }
}

declare module "bun" {
  interface Env {
    OPENAI_API_KEY: string;
    JWT_SECRET: string;
  }
}