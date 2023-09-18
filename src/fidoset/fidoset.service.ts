import { Injectable, Response } from '@nestjs/common';
import * as db from '../db';
import { FidoSetRepositoryService } from './fidosetRepository.service';
import { UserRepositoryService } from 'src/user/userRepository.service';
import axios from 'axios';

@Injectable()
export class FidosetService {

    constructor(private readonly fidosetRepositoryService: FidoSetRepositoryService, private readonly userRepositoryService: UserRepositoryService) {}

    async findAllByKeywordLogic(hosCd:string, hospitalId : number){
        let returnObj = {
            code : 200,
            message : 'findAllByKeywordLogic success',
            result : {}
        }
        const poolClient = await db.getPoolClient();

        try { 
            returnObj.result =  await this.fidosetRepositoryService.findAllByKeyword(hosCd, poolClient, hospitalId)
            console.log(returnObj.result);
        } catch(e){
            returnObj.code = 401
            returnObj.message = 'findAllByKeywordLogic fail'
        } finally {
            poolClient.release();
            return returnObj
        }
    }

    /* 기존 joinFido param
            {
            "tenantCd":"AJFVHQVYCA","
            appId":"b4768731-0ba4-4bf1-b0a7-89756dad7950",
         
            --history상 accessToken은 앱팀 요청으로 사용하지 않았음.   
         
            "accessToken":"eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE2NjEyNTAwMTEsInVzZXJfbmFtZSI6IntcImFwcElkXCI6MSxcImF1dGhUeXBlXCI6XCJTTlNcIixcInVzZXJBY2NvdW50XCI6XCIxMDAwMDAwMFwiLFwidXNlcklkXCI6NDQ5MixcImxvZ2luVHlwZVwiOlwiU0VWXCIsXCJ1dWlkXCI6XCJjZDZkNDUxNi0wNGQxLTRlNjUtYTQ5MS03MTA4MjFiY2M3YzVcIn0iLCJhdXRob3JpdGllcyI6WyIxMSIsIjEwMSIsIjEwMyIsIjcxIiwiNjEiLCIxNjEiLCI1MSIsIjczIiwiNDEiLCI3NCIsIjE2MyIsIjU0Il0sImp0aSI6Ijg5Zjc4MzQ4LWZjMmQtNGYyOC1iMTUwLWQ0Y2RiMDU1MDU2NyIsImNsaWVudF9pZCI6ImxlbW9uY2FyZUBsZW1vbmhjLmNvbSIsInNjb3BlIjpbInJlYWQiLCJ3cml0ZSJdfQ.Gz3W1OmpShw01JzheRfTRwBFni_RGx3Brrz2qozQQWs4krBh4vClRFcG1NDu4dLXZgXpHNNez320sO9cXBRa5p1W_qmwAwizFrF2QKv-I8dD4SfutlcEXrS3l8LzQ1ZSxtOz1wT5VLzTlG7Q8xTwYD15Qc9WwbMVPF06hrn8yBrAotEtbrbVFOd8bCRjAk-rS-S2TnHyMQuZTGo6t1PGVc3go_bZl1k3qHLGH0HIcV5gT-LSJ1eJzYhAfrDz977F0-fCRRqxT0P08fReJEKzvIyv2bRMG5Mw7-E9VaKDbv6IxoTTjQR8tLj-NIqFx60jk5I08pSc9xZOGbXxNkduzg",
            
            "deviceId":"ftD7mj31",
            "clientId":"e2baf0ee-6682-4e21-aa45-603728a0fe8c",
            "authType":"FINGER",
            "uuid":"cd6d4516-04d1-4e65-a491-710821bcc7c5",
            "appPushId":"2"
            }
        */
       // TODO 저장되는 테이블을 찾아서 토큰인증 시 사용하는 authToken을 저장하고 encoding방식을 찾아야됨.
       // 현재 return값은 정상으로 옴.
    async joinFidoLogic(hosCd : string, param : any){
        let returnObj = {
            code : 200,
            message : 'joinFidoLogic success',
            result : {}
        }
        const poolClient = await db.getPoolClient();
        let fidoSet;
        let rs;

        try {
            fidoSet = await this.fidosetRepositoryService.findByTenantCd(hosCd, poolClient, param.tenantCd);
            param.user = await this.userRepositoryService.findByUserId(hosCd, poolClient, param.appPushId);

            await poolClient.release(); 
            await console.log(1);

            let token = `ApiKey:${fidoSet.api_key}`;
            await console.log(2);
            let encodedToken = Buffer.from(token).toString('base64');
            await console.log(3);

            let nexSignJoinFidoURI = `${process.env.NEXSIGN_URI}/${param.tenantCd}/${param.appId}/uma/v2/token/issue?userId=${param.user.my_ci}&systemId=${param.appId}&deviceId=${param.deviceId}&clientId=${param.clientId}`;               
            await console.log(nexSignJoinFidoURI);
            // nexSignRequestURI.split(' ').join('');

         
            rs =await axios.get(nexSignJoinFidoURI,  {
                headers: {'Authorization' : 'Basic '+ encodedToken }
                });
                returnObj.result = rs.data;
                console.log(returnObj);
        } catch (error) {
            if(error.code){
                if(error.code == 'ERR_BAD_REQUEST'){
                    returnObj.code = 401;
                    returnObj.message = 'joinFidoLogic failed';
                    returnObj.result = {
                        umaStatusCode : 102002,
                        errorMessage : "API Key authentication failed"
                    }
                }
            } else {
                returnObj.result = error;
            }
        } finally {
            return returnObj
        }
    }
    //authToken을 보내는데 해당 로직을 더 파헤쳐봐야됨.
    async authFidoLogic(hosCd : string, param : any){
        let returnObj = {
            code : 200,
            message : 'authFidoLogic success',
            result : {}
        }
        const poolClient = await db.getPoolClient();

        let authTokenEncode = encodeURI(param.authToken);

        let nexsignJoinAuthURI = `${process.env.NEXSIGN_URI}/${param.tenantCd}/${param.appId}/uma/v2/token/validate?authToken=${authTokenEncode}`

        let rs
        let fidoSet;

        try {
            fidoSet = await this.fidosetRepositoryService.findByTenantCd(hosCd, poolClient, param.tenantCd);

            let token = `ApiKey:${fidoSet.api_key}`;
            let encodedToken = Buffer.from(token).toString('base64');

            await poolClient.release();  

            if(!fidoSet){
                returnObj.code = 401;
                returnObj.message = 'authFidoLogic failed [fidoSet is null]' 
                return returnObj;
            }

            rs =await axios.get(nexsignJoinAuthURI,  {
                headers: {'Authorization' : 'Basic '+ encodedToken }
                });
                console.log(rs.data);
                console.log(rs);
                returnObj.result = rs.data;

        } catch (error) {
            if(error.code == 'ERR_BAD_REQUEST'){
                returnObj.code = 401;
                returnObj.message = 'authFidoLogic failed';
                returnObj.result = {
                    umaStatusCode : 102002,
                    errorMessage : "API Key authentication failed"
                }
            }
        } finally {
            return returnObj
        }
    }

}
