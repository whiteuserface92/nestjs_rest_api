import {Controller, Get, Query } from '@nestjs/common';
import { Public } from '../auth/auth.guard';
import { CachereloadService } from './cachereload.service';

@Public()
@Controller('cachereload')
export class CachereloadController {
    
    constructor(private readonly cachereloadService: CachereloadService) {}

    @Get("/getUserConfig")
    async getCache(
        @Query('hosCd') hosCd: string,
        @Query('id') id : number
    ): Promise<any> {
      return this.cachereloadService.getHello(hosCd, id);
    }
}
