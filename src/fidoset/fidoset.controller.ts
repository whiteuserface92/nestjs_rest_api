import { Controller, Get, Param, Post, Body, Query } from '@nestjs/common';
import { Public } from '../auth/auth.guard';
import { FidosetService } from './fidoset.service';

@Public()
@Controller('fidoset')
export class FidosetController {

    constructor(private readonly fidosetService : FidosetService) {}

    /*
    * 기존 인증정보 조회
    병원별 인증정보 조회 fidoSet, hospital_mst  (AS-IS CommonCodeController)
    AS-IS GET context-path : /rest/fidoSets/findAllByKeyword
    */
    @Get('fidoSets/findAllByKeyword/:hospitalId') 
    findAllByKeyword(
        @Query('hosCd') hosCd: string,
        @Param('hospitalId') hospitalId : number
    ){
        return this.fidosetService.findAllByKeywordLogic(hosCd, hospitalId)
    }
    
    // FIDO 등록
    @Post('joinFido')
    joinFido(
        @Query('hosCd') hosCd: string,
        @Body('param') param : any
    ){
        console.log(JSON.stringify(param));
        return this.fidosetService.joinFidoLogic(hosCd, param);
    }

    //FIDO 인증
    @Post('authFido')
    authFido(
        @Query('hosCd') hosCd: string,
        @Body('param') param : any
    ){
        console.log(JSON.stringify(param));
        return this.fidosetService.authFidoLogic(hosCd, param);
    }

}
