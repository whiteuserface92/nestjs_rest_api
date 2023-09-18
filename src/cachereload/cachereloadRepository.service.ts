import { Injectable, Inject } from '@nestjs/common';
import { RedisClientType } from '@redis/client';

@Injectable()
export class CacheReloadRepositoryService {

    constructor(
        @Inject('REDIS_CLIENT')
        private readonly redis: RedisClientType
    ) {}

    async getMenuCache(hosCd : string, id : number){
        return await this.redis.HGETALL('MenuCache:1');
    }


    
}