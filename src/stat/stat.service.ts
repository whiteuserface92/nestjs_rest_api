import { Injectable } from '@nestjs/common';
import * as db from '../db';
import { LoggerService } from '@nestjs/common';
import { StatRepositoryService } from './statRepository.service';

@Injectable()
export class StatService {

    constructor(private readonly statRepositoryService: StatRepositoryService) {}

    async getPeriodMenuStatLogic(hosCd : string, hospitalCd : string, startDt : string, endDt : string){
        let returnObj = {
            code : 200,
            message : 'getPeriodMenuStatLogic success',
            result : {}
        }
        const poolClient = await db.getPoolClient();
        try{
            
            db.transaction_Begin(poolClient);
            //만약 startDt 와 endDt 중 한개라도 없다면, 모두 now로 세팅한다.
            console.log(hospitalCd);
            console.log(startDt, endDt);
            //현재날짜
            let now = new Date().toISOString().split('T')[0];

            console.log(now);

            // let now = new Date().toISOString;
            // let nowString = now;

            // console.log("Sdt : "+sdt+" endDt : "+edt);
            if(!startDt || !endDt){
                startDt = now;
                endDt = now;
                console.log("sdt edt empty!");
            }
            returnObj.result = await this.statRepositoryService.getPeriodMenuStat(hosCd, hospitalCd, startDt, endDt, poolClient);
            db.transaction_Commit(poolClient);
        } catch(e){
            db.transaction_Rollback(poolClient);
            returnObj.code = 401;
            returnObj.message = "getPeriodMenuStatLogic failed"
        } finally {
            poolClient.release();
            return returnObj
        }
}

    

    async findUserStatLogic(hosCd : string,startDt : string, endDt : string, poolClient : any){
        let returnObj = {
            code : 200,
            message : 'findUserStatLogic success',
            result : {}
        }
        try{
            //만약 startDt 와 endDt 중 한개라도 없다면, 모두 now로 세팅한다.
            console.log(startDt, endDt);
            //현재날짜
            let now = new Date().toISOString().split('T')[0];
            console.log(now);

            if(!startDt || !endDt){
                startDt = now;
                endDt = now;
                console.log("startDt endDt empty!");
            }
            db.transaction_Begin(poolClient);
            returnObj.result = await this.statRepositoryService.getUserStat(hosCd, startDt, endDt, poolClient);
            db.transaction_Commit(poolClient);
        } catch(e){
            db.transaction_Rollback(poolClient);
            returnObj.code = 401;
            returnObj.message ="findUserStatLogic failed"
        } finally {
            return returnObj
        }
        
    }

    async getUserHourlyStatLogic(hosCd : string,startDt : string, endDt : string){
        let returnObj = {
            code : 200,
            message : 'getUserHourlyStatLogic success',
            result : {}
        }
        const poolClient = await db.getPoolClient();
        try{
            //만약 startDt 와 endDt 중 한개라도 없다면, 모두 now로 세팅한다.
            console.log(startDt, endDt);
            //현재날짜
            let now = new Date().toISOString().split('T')[0];
            console.log(now);
            
            if(!startDt || !endDt){
                startDt = now;
                endDt = now;
                console.log("startDt endDt empty!");
            }
            db.transaction_Begin(poolClient);
            returnObj.result = await this.statRepositoryService.getUserHourlyStat(hosCd, startDt, endDt, poolClient)
            db.transaction_Commit(poolClient);
        } catch (e){
            db.transaction_Rollback(poolClient);
            returnObj.code = 401;
            returnObj.message ="getUserHourlyStatLogic failed";
            
        } finally {
            poolClient.release();
            return returnObj
        }
        
    }

    

    async getLoginLogStatLogic (hosCd : string,startDt :string, endDt: string, platformType: string, hospitalId: string){

        let returnObj = {
            code : 200,
            message : 'getLoginLogStatLogic success',
            result : {}
        }

        let poolClient = await db.getPoolClient();

        try{
             //만약 startDt 와 endDt 중 한개라도 없다면, 모두 now로 세팅한다.
            console.log(startDt, endDt);
            //현재날짜
            let now = new Date().toISOString().split('T')[0];
            console.log(now);
            
            if(!startDt || !endDt){
                startDt = now;
                endDt = now;
                console.log("startDt endDt empty!");
            }
            db.transaction_Begin(poolClient);
            returnObj.result = await this.statRepositoryService.getLoginLogStat(hosCd, startDt, endDt, platformType, hospitalId, poolClient);

            // await console.log(JSON.stringify(returnObj));
            
            db.transaction_Commit(poolClient);
        } catch (e){
            db.transaction_Rollback(poolClient);
            returnObj.code = 401;
            returnObj.message = "getLoginLogStatLogic failed"
        } finally {
            poolClient.release();
            return returnObj
        }

       
    }

    

    async getMonthlyLoginLogtatLogic(hosCd : string,startMm: string, endMm: string, platformType: string, hospitalId: string, serviceNmAllSum: string, platformTypeAllSum: string){
        let returnObj = {
            code : 200,
            message : 'getMonthlyLoginLogtatLogic success',
            result : {}
        }
        let  poolClient = await db.getPoolClient();
        try {
            db.transaction_Begin(poolClient);
            returnObj.result = await this.statRepositoryService.getMonthlyLoginLogtat(hosCd, startMm, endMm, platformType, hospitalId ,serviceNmAllSum, platformTypeAllSum, poolClient);
            db.transaction_Commit(poolClient);
        } catch(e){
            db.transaction_Rollback(poolClient);
            returnObj.code = 401;
            returnObj.message = "getMonthlyLoginLogtatLogic failed"
        } finally {
            poolClient.release();
            return returnObj
        }
    }

    

    async getJoinStatLogic(hosCd : string,startDt: string, endDt: string, hospitalCd: string, platformType, hospitalCdALL: string, ageCdAll: string, sexCdAll: string, areaCdAll: string){

        let returnObj = {
            code : 200,
            message : 'getJoinStatLogic success',
            result : {
                joinStats : {}
            }
        }

        let poolClient = await db.getPoolClient();
        try{
             //만약 startDt 와 endDt 중 한개라도 없다면, 모두 now로 세팅한다.
            console.log(startDt, endDt);
            //현재날짜
            let now = new Date().toISOString().split('T')[0];
            
            if(!startDt || !endDt){
                startDt = now;
                endDt = now;
                console.log("startDt endDt empty!");
            }
            db.transaction_Begin(poolClient);
            returnObj.result.joinStats = await this.statRepositoryService.getJoinStat(hosCd, startDt, endDt, hospitalCd, platformType, hospitalCdALL, ageCdAll, sexCdAll, areaCdAll, poolClient);
            db.transaction_Commit(poolClient);
        } catch(e){
            db.transaction_Rollback(poolClient);
            returnObj.code = 401;
            returnObj.message = "getJoinStatLogic failed"
        } finally {
            poolClient.release();
            return returnObj
        }

        
    }

   

}
