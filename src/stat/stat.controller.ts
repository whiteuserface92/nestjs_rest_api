import { Controller, Get, Query } from '@nestjs/common';
import { StatService } from './stat.service';
import { Public } from '../auth/auth.guard';

@Public()
@Controller('stat')
export class StatController {
    
    constructor(private readonly statService: StatService) {}

    /*
    admin-ui 사용자 메뉴사용 현황 대쉬보드 조회 (AS-IS StatController)
    AS-IS GET context-path : /stats/findMenuStat
    */
    @Get('stats/findMenuStat')
    getMenuStat(
        @Query('hosCd') hosCd: string,
        @Query('hospitalCd') hospitalCd : string,
        @Query('startDt') startDt : string,
        @Query('endDt') endDt : string
    ){
        return this.statService.getPeriodMenuStatLogic(hosCd, hospitalCd, startDt, endDt);
    }

    /*
    사용자 방문현황 대쉬보드 조회 (AS-IS StatController)
    AS-IS GET context-path : /stats/findUserStat
    */
    @Get('stats/findUserStat')
    getUserStat(
        @Query('hosCd') hosCd: string,
        @Query('startDt') startDt : string,
        @Query('endDt') endDt : string
    ){
        return ""
    }

    /*
    사용자 시간별 방문현황 대쉬보드 조회 (AS-IS StatController)
    AS-IS GET context-path : /stats/findUserHourlyStat
    */
    @Get('stats/findUserHourlyStat')
    getUserHourlyStat(
        @Query('hosCd') hosCd: string,
        @Query('startDt') startDt : string,
        @Query('endDt') endDt : string
    ){
            return this.statService.getUserHourlyStatLogic(hosCd, startDt, endDt);
    }

     /*
    일별 사용자 방문 플랫폼 현황 (AS-IS StatController)
    AS-IS GET context-path : /stats/findLoginLogtat
    */
    @Get('stats/findLoginLogtat')
    getLoginLogStat(
        @Query('hosCd') hosCd: string,
        @Query('startDt') startDt : string,
        @Query('endDt') endDt : string,
        @Query('platformType') platformType : string,
        @Query('hospitalId') hospitalId : string
    ){
        return this.statService.getLoginLogStatLogic(hosCd, startDt, endDt, platformType, hospitalId);
    } 

    /*
    월별 누적 사용자 현황 (AS-IS StatController)
    AS-IS GET context-path : /stats/findMonthlyLoginLogtat
    */
    @Get('stats/findMonthlyLoginLogtat')
    getMonthlyLoginLogtat(
        @Query('hosCd') hosCd: string,
        @Query('startMm') startMm : string,
        @Query('endMm') endMm : string,
        @Query('platformType') platformType : string,
        @Query('hospitalId') hospitalId : string,
        @Query('serviceNmAllSum') serviceNmAllSum : string,
        @Query('platformTypeAllSum') platformTypeAllSum : string
    ){
        return this.statService.getMonthlyLoginLogtatLogic(hosCd, startMm, endMm, platformType, hospitalId, serviceNmAllSum, platformTypeAllSum);
    } 


    /*
    회원 가입 현황(가입유형별) (AS-IS StatController)
    AS-IS GET context-path : /stats/findStatJoin
    */
    @Get('stats/findStatJoin')
    getJoinStat(
        @Query('hosCd') hosCd: string,
        @Query('startDt') startDt : string,
        @Query('endDt') endDt : string,
        @Query('platformType') platformType : string,
        @Query('hospitalCd') hospitalCd : string,
        @Query('hospitalCdALL') hospitalCdALL : string,
        @Query('ageCdAll') ageCdAll : string,
        @Query('sexCdAll') sexCdAll : string,
        @Query('areaCdAll') areaCdAll : string
    ){
        return this.statService.getJoinStatLogic(hosCd, startDt, endDt, hospitalCd, platformType, hospitalCdALL, ageCdAll, sexCdAll, areaCdAll);
    } 
}
