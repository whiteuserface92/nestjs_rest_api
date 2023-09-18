import { Injectable } from '@nestjs/common';
import * as db from '../db';
import { AppRepositoryService } from './appRepository.service';
@Injectable()
export class AppService {
  constructor(private readonly appRepositoryService: AppRepositoryService) {}

  async appFindAllByKeyword(hosCd : string, hospitalId?: number, keyword?: string){
    let returnObj = {
        code : 200,
        message : "appFindAllByKeyword success",
        result : {}
    }
    const poolClient = await db.getPoolClient();
    try{
        let result : any = await this.appRepositoryService.selectAppMstInfo(hosCd, poolClient, hospitalId, keyword);
        returnObj.result = result;
    } catch(e){
        returnObj.code = 401;
        returnObj.message = `appFindAllByKeyword failed, ${JSON.stringify(e)}`
    } finally {
        poolClient.release();
        return returnObj
    }
}
  // 기존로직 - 주석처리 (김동인프로) -- 양식 통일화
  // async appFindAllByKeyword(hospitalId?: number, keyword?: string) {
  //   let returnObj;

  //   const poolClient = await db.getPoolClient();
  //   try {
      
  //     const result = await this.appRepositoryService.selectAppMstInfo(poolClient, hospitalId, keyword)

  //     returnObj = {
  //       code: 200,
  //       message: 'success',
  //       result: result
  //     };
  //   } catch (err) {
  //     returnObj = {
  //       code: 401,
  //       message: `error, ${JSON.stringify(err)}`,
  //     };
  //   } finally {
  //     poolClient.release();
  //     return returnObj;
  //   }
  // }


  async getAppsInfo(hosCd : string, appId: string, appPlatformId: string){
    let returnObj = {
        code : 200,
        message : "getAppsInfo success",
        result : {}
    }
    const poolClient = await db.getPoolClient();
    try{
        let result : any = await this.appRepositoryService.selectAppsInfo(hosCd, poolClient, appId, appPlatformId);
        returnObj.result = result;
    } catch(e){
        returnObj.code = 401;
        returnObj.message = `getAppsInfo failed, ${JSON.stringify(e)}`
    } finally {
        poolClient.release();
        return returnObj
    }
}
  // 기존로직 - 주석처리 (김동인프로) -- 양식 통일화
  // async getAppsInfo(appId: string, appPlatformId: string) {
  //   let returnObj;
  //   let result;

  //   const poolClient = await db.getPoolClient();
  //   try {
  //     console.log(hosCd, appId, appPlatformId); 
  //     result = await this.appRepositoryService.selectAppsInfo(hosCd, poolClient, appId, appPlatformId)
  //     returnObj = {
  //       code: 200,
  //       message: 'success',
  //       result: result
  //     };
  //   } catch (err) {
  //     console.log(result);
  //     returnObj = {
  //       code: 401,
  //       result : JSON.stringify(result),
  //       message: `error, ${JSON.stringify(err)}`,
  //     };
  //   } finally {
  //     poolClient.release();
  //     return returnObj;
  //   }
  // }

  async saveAppMst(hosCd : string, appInfo: any){

    console.log(JSON.stringify(appInfo));

    let returnObj = {
        code : 200,
        message : "saveAppMst success",
        result : {}
    }
    const poolClient = await db.getPoolClient();
    try{
        db.transaction_Begin(poolClient)
        let result : any = await this.appRepositoryService.insertAppMst(hosCd, poolClient, appInfo);;
        returnObj.result = result;
        db.transaction_Commit(poolClient)
    } catch(e){
        db.transaction_Rollback(poolClient)
        returnObj.code = 401;
        returnObj.message = `saveAppMst failed, ${JSON.stringify(e)}`
    } finally {
        poolClient.release();
        return returnObj
    }
}
  // 기존로직 - 주석처리 (김동인프로) -- 양식 통일화
  // async saveAppMst(appInfo: any) {
  //   let returnObj;
  //   const poolClient = await db.getPoolClient();
  //   try {
      
  //     await this.appRepositoryService.insertAppMst(poolClient, appInfo);

  //     returnObj = {
  //       code: 200,
  //       message: 'success'
  //     };
  //   } catch (err) {
  //     returnObj = {
  //       code: 401,
  //       message: `error, ${JSON.stringify(err)}`,
  //     };
  //   } finally {
  //     poolClient.release();
  //     return returnObj;
  //   }
  // }

  async applogSearch(hosCd : string, keyword: string, startDt: string, endDt: string){
    let returnObj = {
        code : 200,
        message : "applogSearch success",
        result : {}
    }
    const poolClient = await db.getPoolClient();
    try{
        let result : any = await this.appRepositoryService.selectAppLog(hosCd, poolClient, keyword, startDt, endDt);
        returnObj.result = result;
    } catch(e){
        returnObj.code = 401;
        returnObj.message = `applogSearch failed, ${JSON.stringify(e)}`
    } finally {
        poolClient.release();
        return returnObj
    }
  }
  // 기존로직 - 주석처리 (김동인프로) -- 양식 통일화
  // async applogSearch(keyword: string, startDt: string, endDt: string) {
  //   let returnObj;

  //   const poolClient = await db.getPoolClient();
  //   try {
  //     const result = await this.appRepositoryService.selectAppLog(poolClient, keyword, startDt, endDt);

  //     returnObj = {
  //       code: 200,
  //       message: 'success',
  //       result: result
  //     };
  //   } catch (err) {
  //     returnObj = {
  //       code: 401,
  //       message: `error, ${JSON.stringify(err)}`,
  //     };
  //   } finally {
  //     poolClient.release();
  //     return returnObj;
  //   }
  // }

  async appMenuLogSearch(hosCd : string, keyword: string, startDt: string, endDt: string){
    let returnObj = {
        code : 200,
        message : "appMenuLogSearch success",
        result : {}
    }
    const poolClient = await db.getPoolClient();
    try{
        let result : any = await this.appRepositoryService.selectAppMenuLog(hosCd, poolClient, keyword, startDt, endDt);
        returnObj.result = result;
    } catch(e){
        returnObj.code = 401;
        returnObj.message = `appMenuLogSearch failed, ${JSON.stringify(e)}`
    } finally {
        poolClient.release();
        return returnObj
    }
  }
  // 기존로직 - 주석처리 (김동인프로) -- 양식 통일화
  // async appMenuLogSearch(keyword: string, startDt: string, endDt: string) {
  //   let returnObj;

  //   const poolClient = await db.getPoolClient();
  //   try {
  //     const result = await this.appRepositoryService.selectAppMenuLog(poolClient, keyword, startDt, endDt);

  //     returnObj = {
  //       code: 200,
  //       message: 'success',
  //       result: result
  //     };
  //   } catch (err) {
  //     returnObj = {
  //       code: 401,
  //       message: `error, ${JSON.stringify(err)}`,
  //     };
  //   } finally {
  //     poolClient.release();
  //     return returnObj;
  //   }
  // }

  async findAppInfoForNative(hosCd : string, deployType: string, pkgNm: string, platformType: string){
    let returnObj = {
        code : 200,
        message : "findAppInfoForNative success",
        result : {
            app : {
                hospital : {}
            }
        }
    }
    const poolClient = await db.getPoolClient();
    try{
        let result : any = await this.appRepositoryService.findByPkgNmAndDeployTypeAndPlatformTypeNative(hosCd, poolClient, deployType, pkgNm, platformType);
        console.log(result);
        result.app = await this.appRepositoryService.findAppMstInfoForNative(hosCd, poolClient, result.appId);
        console.log(result);
        returnObj.result = result;
    } catch(e){
        returnObj.code = 401;
        returnObj.message = `findAppInfoForNative failed, ${JSON.stringify(e)}`
    } finally {
        poolClient.release();
        return returnObj
    }
  }


  // 기존로직 - 주석처리 (김동인프로) -- 양식 통일화
  // async appPlatformsSearch() {
  //   let returnObj;

  //   const poolClient = await db.getPoolClient();
  //   try {
  //     const result = await this.appRepositoryService.selectAppPlatform(poolClient);

  //     returnObj = {
  //       code: 200,
  //       message: 'success',
  //       result: result,
  //     };
  //   } catch (err) {
  //     returnObj = {
  //       code: 401,
  //       message: `error, ${JSON.stringify(err)}`,
  //     };
  //   } finally {
  //     poolClient.release();
  //     return returnObj;
  //   }
  // }
}
