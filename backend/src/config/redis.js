import { Redis } from "@upstash/redis";

const hasRedisEnv =
  process.env.UPSTASH_REDIS_REST_URL &&
  process.env.UPSTASH_REDIS_REST_TOKEN;

const redis = hasRedisEnv
  ? new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN,
    })
  : null;

export const isRedisEnabled = Boolean(redis);

export default redis;
