var redis = require("redis")

export const redisProvider = [
    {
        
        provide: 'REDIS_CLIENT',
        useFactory: async () => {
            const client = redis.createClient({
                host : process.env.REDIS_HOST,
                port : process.env.REDIS_PORT,
                // store : redisCacheStore,
                // db : 0,
                // password:"P@ssw0rd"
            });
            await client.connect();
            return client;  
        } 
    }
]