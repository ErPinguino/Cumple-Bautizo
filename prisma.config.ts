import "dotenv/config";
import { defineConfig, env } from "@prisma/config";

export default defineConfig({
  datasource: {
    url: env("LOCAL_DATABASE_URL"),
  },
});