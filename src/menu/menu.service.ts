import { Injectable } from '@nestjs/common';
import * as db from '../db';
import { Logger } from '@nestjs/common';
import { MenuRepositoryService } from './menuRepository.service';



@Injectable()
export class MenuService {

    constructor(private readonly menuRepositoryServive: MenuRepositoryService) { }
    private readonly logger = new Logger(MenuService.name);

    //배열로 오면 문자열로 치환 메서드
    async arrayToString(allowTypeArray:any){
        let result = ``;
        for(let i = 0; i < allowTypeArray.length; i++){
            if (allowTypeArray.length-1 == i){
                result += `'${allowTypeArray[i]}'`;
            } else {
                result += `'${allowTypeArray[i]}',`;
            } 
        }
        return result
    }
    
    /* 유저 메뉴 리스트 조회(Mst 테이블)*/
    async getUserMenuList(hosCd: string ,userMenuParams: any) {
        const poolClient = await db.getPoolClient();

        let returnObj = {
            code : 200,
            message : 'getUserMenuList success',
            result : {}
        }
        try {

            if (userMenuParams.allowType) {
                console.log(userMenuParams.allowType);
                userMenuParams.allowType = await this.arrayToString(userMenuParams.allowType);
            }
            
            //전체 조회/ ocpType조건 조회
            let result = await this.menuRepositoryServive.selectUserMenu(hosCd, poolClient, userMenuParams);

            returnObj.result = result;
            } catch(e){
                console.log(e);
                returnObj.code = 410;
                returnObj.message = e;
            } finally {
                poolClient.release();
                return returnObj;
            }
    }
    

    /* 유저 메뉴 리스트 저장(Mst 테이블 / allow 테이블) */
    async saveUserMenuList(hosCd: string, menuParams: any) {
        const poolClient = await db.getPoolClient();

        let returnObj = {
            code: 200,
            message: 'saveUserMenuList success',
            result: {
                userMenuMstInsertResult : {

                },
                userMenuAllowInsertResult : {

                }
            }
        }
        let mstInsertResult;
        let allowInsertResult;
        let allowType;
        try {

            mstInsertResult = ``;
            allowInsertResult = ``;
            if (!menuParams.name) {
                throw '[name] 값이 있어야 합니다.'
            }
            if (!menuParams.dispOrd) {
                throw '[dispOrd] 값이 있어야 합니다.'
            }
            if (!menuParams.menuType) {
                throw '[menuType] 값이 있어야 합니다.'
            }
            if (!menuParams.userId) {
                throw '[userId] 값이 있어야 합니다.'
            }
            // if (!menuParams.allowType) { //allow_type을 신규 생성화면에서 선택하도록 한다.
            //     throw '[allowType] 값이 있어야 합니다.'
            // }
            
            db.transaction_Begin(poolClient);
            
            //mst테이블 insert
            mstInsertResult = await this.menuRepositoryServive.insertUserMenuMst(hosCd, poolClient, menuParams);
            //returnObj 데이터 바인딩
            returnObj.result.userMenuMstInsertResult = mstInsertResult;

            // //allow에 넣을 params
            let menuId = mstInsertResult[0].id;
            let userId = mstInsertResult[0].createdBy;
            if (menuParams.allowType) {
                allowType= menuParams.allowType;
            }
            let temp = [];

            // UserMenuAllow에 해당 menu_id와 해당 유저의 allowType을 등록하여, 사용가능하게 한다.
            if (menuParams.allowType) {
                for (let i = 0; i < allowType.length; i++) {
                    allowInsertResult = await this.menuRepositoryServive.insertUserMenuAllow(hosCd, poolClient, menuId, userId, allowType[i]);
                    temp.push(allowInsertResult);
                }
            }
            
            console.log(temp.length);
            if (temp.length > 0) {
                returnObj.result.userMenuAllowInsertResult = temp;
            }

            db.transaction_Commit(poolClient);
        } catch(e){
            returnObj.code = 410;
            returnObj.message = e;
            db.transaction_Rollback(poolClient);
        } finally {
            poolClient.release();
            return returnObj;
        }
    }


    /* 유저 메뉴 수정(mst / allow) */
    async modifyUserMenu(hosCd: string, modifyUserMenuParams: any) {
        const poolClient = await db.getPoolClient();

        let returnObj = {
            code : 200,
            message : 'modifyUserMenu success',
            result : {
                updateUserMenuMstResult : {

                },
                updateUserMenuAllowResult : {

                }
            }
        }

        try {
            let updateMstResult;
            let selectResult;
            let allowInsertResult;
            let allowModifyResultEnabledTrue;
            let allowModifyEnabledFalse;

            if (!modifyUserMenuParams.userId) {
                throw '[userId] 값이 있어야 합니다.'
            }
            if (!modifyUserMenuParams.menuId) {
                throw '[menuId] 값이 있어야 합니다.'
            }

            db.transaction_Begin(poolClient);
            let tmp = [];

            //mst 관련 param 있을 시, mst update
            updateMstResult = await this.menuRepositoryServive.updateUserMenuMst(hosCd, poolClient, modifyUserMenuParams);
            returnObj.result.updateUserMenuMstResult = updateMstResult;

            if (modifyUserMenuParams.allowType && modifyUserMenuParams.allowType.length > 0) {

                //값이 없다면 insert
                for (let i = 0; i < modifyUserMenuParams.allowType.length; i++) {

                    //select문 호출 (해당 menuId에 맞는 allowType이 있으면 true / 없으면 false)
                    selectResult = await this.menuRepositoryServive.selectFlagByMenuId(hosCd, poolClient, modifyUserMenuParams.allowType[i], modifyUserMenuParams.menuId);

                    if (selectResult == false) {
                        //insert
                        allowInsertResult = await this.menuRepositoryServive.insertUserMenuAllow(hosCd, poolClient, modifyUserMenuParams.menuId, modifyUserMenuParams.userId, modifyUserMenuParams.allowType[i]);
                        tmp.push(allowInsertResult);
                    }
                }
            
                //allowType가 배열이기 때문에 문자열로 치환
                modifyUserMenuParams.allowType = await this.arrayToString(modifyUserMenuParams.allowType);
                
                //enabled True로 변경
                allowModifyResultEnabledTrue = await this.menuRepositoryServive.updateUserAllow(hosCd, poolClient, modifyUserMenuParams, true);
                for (let i = 0; i < allowModifyResultEnabledTrue.length; i++) {
                    tmp.push(allowModifyResultEnabledTrue[i]);
                }
                returnObj.result.updateUserMenuAllowResult = tmp;
                //나머지 enabled False로 변경
                allowModifyEnabledFalse = await this.menuRepositoryServive.updateUserAllow(hosCd, poolClient, modifyUserMenuParams, false);


            } else if (!modifyUserMenuParams.allowType || modifyUserMenuParams.allowType.length == 0) {
                modifyUserMenuParams.allowType = "''";
                //enabled 모두 false로 update
                //allowType 안들어오면 menuId row 모두 enabled = false로 변경
                allowModifyEnabledFalse = await this.menuRepositoryServive.updateUserAllow(hosCd, poolClient, modifyUserMenuParams, false);
                returnObj.result.updateUserMenuAllowResult = allowModifyEnabledFalse;
                for (let i = 0; i < allowModifyEnabledFalse.length; i++) {
                    tmp.push(allowModifyEnabledFalse[i]);
                }
            }

            db.transaction_Commit(poolClient);
        } catch(e){
            returnObj.code = 410;
            returnObj.message = e;
            db.transaction_Rollback(poolClient);
        } finally {
            poolClient.release();
            return returnObj;
        }
    }

}


