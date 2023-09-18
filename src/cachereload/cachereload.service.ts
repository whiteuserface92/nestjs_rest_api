import { Injectable, Inject } from '@nestjs/common';
import { CacheReloadRepositoryService } from './cachereloadRepository.service';



@Injectable()
export class CachereloadService {
    constructor(private readonly cacheReloadRepositoryService : CacheReloadRepositoryService) {}

    async getHello(hosCd : string, id : number){
        return this.cacheReloadRepositoryService.getMenuCache(hosCd, id);
    } 
}
