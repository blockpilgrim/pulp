import { Redis } from "@upstash/redis";

const DEMO_LIMIT = 10;
const WINDOW_SECONDS = 86400; // 24h

function getRedis(): Redis | null {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;
  return new Redis({ url, token });
}

export async function checkDemoLimit(ip: string): Promise<{
  allowed: boolean;
  remaining: number;
  limit: number;
}> {
  const redis = getRedis();
  if (!redis) return { allowed: true, remaining: DEMO_LIMIT, limit: DEMO_LIMIT };

  const key = `demo:${ip}`;
  const count = await redis.incr(key);
  if (count === 1) {
    await redis.expire(key, WINDOW_SECONDS);
  }

  return {
    allowed: count <= DEMO_LIMIT,
    remaining: Math.max(0, DEMO_LIMIT - count),
    limit: DEMO_LIMIT,
  };
}

export async function getDemoStatus(ip: string): Promise<{
  remaining: number;
  limit: number;
}> {
  const redis = getRedis();
  if (!redis) return { remaining: DEMO_LIMIT, limit: DEMO_LIMIT };

  const key = `demo:${ip}`;
  const count = (await redis.get<number>(key)) ?? 0;

  return {
    remaining: Math.max(0, DEMO_LIMIT - count),
    limit: DEMO_LIMIT,
  };
}
