import { Injectable } from '@nestjs/common';
import * as db from '../db';
import { Logger } from '@nestjs/common';
import { AdminMenuRepositoryService } from './adminMenuRepository.service';

@Injectable()
export class AdminMenuService { 
    private readonly logger = new Logger(AdminMenuService.name);

    constructor(private readonly adminMenuRepositoryService: AdminMenuRepositoryService) { }

    /* 어드민 메뉴 조회 */
    async getAdminMenuList(hosCd: string) {
        const poolClient = await db.getPoolClient();
        
        let returnObj = {
            code : 200,
            message : 'getAdminMenuList',
            result : {}
        }

        let getAdminMenu;

        try {
            getAdminMenu = await this.adminMenuRepositoryService.getAdminMenuMst(hosCd, poolClient);
            
            this.logger.log(getAdminMenu);
            returnObj.result = getAdminMenu;
        } catch(e){
            returnObj.code = 401;
            returnObj.message = e;
        } finally {
            poolClient.release();
            return returnObj;
        }
    }

    /* 어드민 메뉴 등록 */
    async saveAdminMenu(hosCd: string, adminMenuParam: any) {
        const poolClient = await db.getPoolClient();

        let returnObj = {
            code : 200,
            message : "saveAdminMenu",
            result : {}
        }

        let savedAdminInfo;

        try {
            if (!adminMenuParam.adminUserId) {
                throw "필수값 [adminUserId]가 없습니다.";
            }
            if (!adminMenuParam.name) {
                throw "필수값 [name]이 없습니다.";
            }

            db.transaction_Begin(poolClient);
            //mst에 저장
            savedAdminInfo = await this.adminMenuRepositoryService.insertAdminMenu(hosCd, adminMenuParam, poolClient);
            this.logger.log(savedAdminInfo);
            returnObj.result = savedAdminInfo;

            db.transaction_Commit(poolClient);
            
        }catch (e){
            db.transaction_Rollback(poolClient);
            returnObj.code = 401;
            returnObj.result = e;
        } finally {
            poolClient.release();
            return returnObj;
        }
    }

    /* 어드민 메뉴 수정 */
    async updateAdminMenu(hosCd: string, adminMenuParam: any) {
        const poolClient = await db.getPoolClient();
        
        let returnObj = {
            code : 200,
            message : "updateAdminMenu",
            result : {}
        }

        let updateResult;

        try {
            if (!adminMenuParam.adminUserId) {
                throw "필수값 [adminUserId]가 없습니다.";
            }
            if (!adminMenuParam.id) {
                throw "필수값 [id]가 없습니다.";
            }

            db.transaction_Begin(poolClient);

            updateResult = await this.adminMenuRepositoryService.updateAdminMenuMst(hosCd, adminMenuParam, poolClient);
            returnObj.result = updateResult;

            db.transaction_Commit(poolClient);
        }catch (e){
            db.transaction_Rollback(poolClient);
            returnObj.code = 401;
            returnObj.result = e;
        } finally {
            poolClient.release();
            return returnObj;
        }
    }

    /* 어드민 별 레벨 수정 */
    async updateAdminLevel(hosCd: string, adminParam: any) {
        const poolClient = await db.getPoolClient();

        let returnObj = {
            code : 200,
            message : "updateAdminLevel",
            result : {}
        }

        let updateUserAdmin;

        try {
            if (!adminParam.adminUserId) {
                throw "필수값 [adminUserId]가 없습니다.";
            }

            db.transaction_Begin(poolClient);

            updateUserAdmin = await this.adminMenuRepositoryService.updateUserAdminLevel(hosCd, adminParam, poolClient);
            returnObj.result = updateUserAdmin;

            db.transaction_Commit(poolClient);
        }catch (e){
            db.transaction_Rollback(poolClient);
            returnObj.code = 401;
            returnObj.result = e;
        } finally {
            poolClient.release();
            return returnObj;
        }
    }

    /* 어드민 레벨 별 목록 조회 */
    async getAdminMenuByLevel(hosCd: string, allowLevel: number, hospitalCd: string) {
        const poolClient = await db.getPoolClient();

        let returnObj = {
            code : 200,
            message : 'getAdminMenuByLevel',
            result : {}
        }

        let getAdminMenu;

        try {
            if (!allowLevel) {
                throw '[allowLevel]이 없습니다.'
            }

            getAdminMenu = await this.adminMenuRepositoryService.selectAdminMenuByLevel(hosCd, allowLevel, hospitalCd ,poolClient);
            
            //this.logger.log(getAdminMenu);
            returnObj.result = getAdminMenu;
        } catch(e){
            returnObj.code = 401;
            returnObj.message = e
        } finally {
            poolClient.release();
            return returnObj;
        }
    }

    /* 어드민 레벨 별 등록 */
    async saveAdminMenuByLevel(hosCd: string, adminMenuParam: any) {
        const poolClient = await db.getPoolClient();

        let returnObj = {
            code : 200,
            message : 'saveAdminMenuByLevel',
            result : {}
        }

        let adminMenuAllowCount;
        let adminMenuAllowSave;

        try {
            if (!adminMenuParam.adminUserId) {
                throw '[adminUserId]가 없습니다.'
            }
            if (!adminMenuParam.menuId) {
                throw '[menuId]가 없습니다.'
            }
            if (!adminMenuParam.allowLevel) {
                throw '[allowLevel]이 없습니다.'
            }

            db.transaction_Begin(poolClient);
            
            adminMenuAllowCount = await this.adminMenuRepositoryService.getAdminMenuAllowCount(hosCd, adminMenuParam ,poolClient);
            if (adminMenuAllowCount > 0) {
                //update
                adminMenuAllowSave = await this.adminMenuRepositoryService.saveAdminMenuAllow(hosCd, adminMenuParam, "update", poolClient);
                returnObj.message = 'update adminMenuAllow'
            } else {
                //insert
                adminMenuAllowSave = await this.adminMenuRepositoryService.saveAdminMenuAllow(hosCd, adminMenuParam, "insert" ,poolClient);
                returnObj.message = 'insert adminMenuAllow'
            }

            returnObj.result = adminMenuAllowSave;
            db.transaction_Commit(poolClient);

        } catch (e) {
            db.transaction_Rollback(poolClient);
            returnObj.code = 401;
            returnObj.message = e
        } finally {
            poolClient.release();
            return returnObj;
        }
    }

    /* 어드민 레벨 별 메뉴 활성화/비활성화 (true / false)*/
    async flagAdminMenuByLevel(hosCd: string, adminMenuParam: any) {
       const poolClient = await db.getPoolClient();

        let returnObj = {
            code : 200,
            message : 'flagAdminMenuByLevel',
            result : {}
        }

        let params = {};
        let updateResult;

        try {
            if (!adminMenuParam.adminUserId) {
                throw '[adminUserId]가 없습니다.'
            }
            if (!adminMenuParam.menuId) {
                throw '[menuId]가 없습니다.'
            }
            if (!adminMenuParam.allowLevel) {
                throw '[allowLevel]이 없습니다.'
            }
            if (!adminMenuParam.enabled) {
                throw '[enabled]가 없습니다.'
            }

            params = {
                adminUserId: adminMenuParam.adminUserId,
                menuId: adminMenuParam.menuId,
                allowLevel: adminMenuParam.allowLevel,
                enabled: adminMenuParam.enabled
            }

            updateResult = await this.adminMenuRepositoryService.flagAdminMenuAllow(hosCd, params ,poolClient);

            returnObj.result = updateResult;

        } catch (e) {
            db.transaction_Rollback(poolClient);
            returnObj.code = 401;
            returnObj.message = e;
        } finally {
            poolClient.release();
            return returnObj;
        }
   }
}