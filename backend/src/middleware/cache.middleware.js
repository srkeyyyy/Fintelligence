import redis, { isRedisEnabled } from "../config/redis.js";

const userCacheIndexKey = (userId) =>
  `cache:user:${userId}:keys`;

const makeCacheKey = (req) =>
  `cache:user:${req.user.id}:${req.method}:${req.originalUrl}`;

export const cacheResponse =
  (ttlSeconds = 300) =>
  async (req, res, next) => {
    if (!isRedisEnabled || !req.user?.id) {
      return next();
    }

    const cacheKey = makeCacheKey(req);

    try {
      const cached = await redis.get(cacheKey);

      if (cached) {
        return res.status(200).json(cached);
      }
    } catch (error) {
      console.warn("Redis cache read skipped:", error.message);
      return next();
    }

    const originalJson = res.json.bind(res);

    res.json = (body) => {
      if (res.statusCode >= 200 && res.statusCode < 300) {
        redis
          .set(cacheKey, body, { ex: ttlSeconds })
          .then(() =>
            redis.sadd(
              userCacheIndexKey(req.user.id),
              cacheKey
            )
          )
          .catch((error) => {
            console.warn(
              "Redis cache write skipped:",
              error.message
            );
          });
      }

      return originalJson(body);
    };

    return next();
  };

export const invalidateUserCacheOnSuccess = () => (req, res, next) => {
  if (!isRedisEnabled || !req.user?.id) {
    return next();
  }

  const originalJson = res.json.bind(res);

  res.json = (body) => {
    if (res.statusCode >= 200 && res.statusCode < 300) {
      invalidateUserCache(req.user.id).catch((error) => {
        console.warn(
          "Redis cache invalidation skipped:",
          error.message
        );
      });
    }

    return originalJson(body);
  };

  return next();
};

export const invalidateUserCache = async (userId) => {
  if (!isRedisEnabled || !userId) {
    return;
  }

  const indexKey = userCacheIndexKey(userId);
  const keys = await redis.smembers(indexKey);

  if (keys.length > 0) {
    await redis.del(...keys);
  }

  await redis.del(indexKey);
};













