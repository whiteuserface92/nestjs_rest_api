import { Injectable } from '@nestjs/common';
import { CommonCodeRepositoryService } from './commoncodeRepository.service';
import * as db from '../db';

@Injectable()
export class CommoncodeService {

    constructor(private readonly commonCodeRepostoryService: CommonCodeRepositoryService) {}

    async getCodeClsesLogic(hosCd : string){

        let returnObj = {
            code : 200,
            message : 'getCodeClsesLogic success',
            result : {}
        }

        const poolClient = await db.getPoolClient();

        try {
            returnObj.result = await this.commonCodeRepostoryService.findDistinctCodeCls(hosCd, poolClient);
        } catch(e){
            returnObj.code = 401;
            returnObj.message = 'getCodeClsesLogic fail';
        } finally {
            poolClient.release();
            return returnObj;
        }
    }

    async findByCodeClsDetailListLogic(hosCd : string, codeCls : string){
        let returnObj = {
            code : 200,
            message : 'findByCodeClsDetailListLogic success',
            result : {}
        }

        const poolClient = await db.getPoolClient();

        await console.log(poolClient);

        try {
            returnObj.result = await this.commonCodeRepostoryService.findByCodeClsDetailList(hosCd, codeCls , poolClient);
        } catch(e){
            returnObj.code = 401;
            returnObj.message = 'findByCodeClsDetailListLogic fail';
        } finally {
            poolClient.release();
            return returnObj;
        }
    }
}
