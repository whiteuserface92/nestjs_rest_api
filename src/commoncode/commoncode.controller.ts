import { Controller, Get, Param, Query } from '@nestjs/common';
import { CommoncodeService } from './commoncode.service';
import { Public } from '../auth/auth.guard';

@Public()
@Controller('commoncode')
export class CommoncodeController {

    constructor(private readonly commoncodeService: CommoncodeService) {}

    /*
    * code_cls 컬럼만 code_mst table 정보 조회
    공통코드 부분조회 후 가져오기  (AS-IS CommonCodeController)
    AS-IS GET context-path : /commonCodes/codeClses
    */

    @Get('commonCodes/codeClses')
    getCodeClses(
        @Query('hosCd') hosCd: string,
    ){
        return this.commoncodeService.getCodeClsesLogic(hosCd);
    }

    /*
    *code_cls로 부분조회 후 code_mst table에서 가져오기
    공통코드 가져오기  (AS-IS CommonCodeController)
    AS-IS GET context-path : /commonCodes/findByCodeClsDetailList
    */

    @Get('commonCodes/findByCodeClsDetailList/:codeCls')
    findByCodeClsDetailList(
        @Query('hosCd') hosCd: string,
        @Param('codeCls') codeCls : string
        ){
        console.log(JSON.stringify(codeCls));
        return this.commoncodeService.findByCodeClsDetailListLogic(hosCd, codeCls);
    }
}
