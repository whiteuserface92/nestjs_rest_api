import { Injectable } from '@nestjs/common';
import * as db from '../db';
import { AdminRepositoryService } from './adminRepository.service';

@Injectable()
export class AdminService {
  constructor(private readonly adminRepositoryService: AdminRepositoryService) {}

  async getAdminUserList(
    hosCd: string,
    adminUserId: number,
    adminLevel: number,
    hospitalCd: string,
    userAccount: string,
    enabled: boolean
  ) {
    let returnObj;
    const poolClient = await db.getPoolClient();
    try {
      const result = await this.adminRepositoryService.selectAdminUser(poolClient, hosCd, adminUserId, adminLevel, hospitalCd, userAccount, enabled)

      returnObj = {
        code: 200,
        message: 'success',
        result: result,
      };
    } catch (err) {
      returnObj = {
        code: 410,
        message: `error, ${JSON.stringify(err)}`,
      };
    } finally {
      poolClient.release();
      return returnObj;
    }
  }

  async saveAdminUser(
    hosCd: string,
    saveAdminUser: any
  ) {
    let returnObj;
    const poolClient = await db.getPoolClient();
    try {
      const result = await this.adminRepositoryService.insertAdminUser(poolClient, hosCd, saveAdminUser)

      returnObj = {
        code: 200,
        message: 'success',
        result: {
          userId: result[0].user_id,
          userAccount: result[0].user_account,
          adminLevel: result[0].admin_level,
          adminStatus: result[0].admin_status,
          appliedOn: result[0].applied_on,
          approvedOn: result[0].approved_on,
          userName: result[0].user_name,
          hospitalCd: result[0].hospital_cd,
          enabled: result[0].enabled
        }
      };
    } catch (err) {
      returnObj = {
        code: 410,
        message: `error, ${JSON.stringify(err)}`,
      };
    } finally {
      poolClient.release();
      return returnObj;
    }
  }

  async modifyAdminUser(
    hosCd: string,
    saveAdminUser: any
  ) {
    let returnObj;
    const poolClient = await db.getPoolClient();
    try {
      const result = await this.adminRepositoryService.updateAdminUser(poolClient, hosCd, saveAdminUser)

      returnObj = {
        code: 200,
        message: 'success',
        result: {
          userId: result[0].user_id,
          userAccount: result[0].user_account,
          adminLevel: result[0].admin_level,
          adminStatus: result[0].admin_status,
          appliedOn: result[0].applied_on,
          approvedOn: result[0].approved_on,
          userName: result[0].user_name,
          hospitalCd: result[0].hospital_cd,
          enabled: result[0].enabled
        }
      };
    } catch (err) {
      returnObj = {
        code: 410,
        message: `error, ${JSON.stringify(err)}`,
      };
    } finally {
      poolClient.release();
      return returnObj;
    }
  }

  async resetPwdAdminUser(
    hosCd: string,
    resetPwdAdminUser: any
  ) {
    let returnObj;
    const poolClient = await db.getPoolClient();
    try {
      const result = await this.adminRepositoryService.updatePasswordAdminUser(poolClient, hosCd, resetPwdAdminUser)

      returnObj = {
        code: 200,
        message: 'passwordReset success',
        result: {
          adminUserId: result[0].user_id,
          userAccount: result[0].user_account,
        }
      };
    } catch (err) {
      returnObj = {
        code: 410,
        message: `error, ${JSON.stringify(err)}`,
      };
    } finally {
      poolClient.release();
      return returnObj;
    }
  }

  async getAdminAccessHistory(
    hosCd: string,
    actionVal: string,
    hospitalCdVal: string,
    ipVal: string,
    targetUserIdVal: number,
    userAccntVal: string,
    startDtVal: string,
    endDtVal: string,
  ) {
    let returnObj;
    const poolClient = await db.getPoolClient();
    try {
      
      const result = await this.adminRepositoryService.selectAdminAccessHistory(poolClient, 
        hosCd, actionVal, hospitalCdVal, ipVal, targetUserIdVal, userAccntVal, startDtVal, endDtVal)

      returnObj = {
        code: 200,
        message: 'success',
        result: result,
      };
    } catch (err) {
      returnObj = {
        code: 410,
        message: `error, ${JSON.stringify(err)}`,
      };
    } finally {
      poolClient.release();
      return returnObj;
    }
  }

  async getAdminLoginHistory(
    hosCd: string,
    ipVal: string,
    successVal: string,
    userAccntVal: string,
    startDtVal: string,
    endDtVal: string,
  ) {
    let returnObj;
    const poolClient = await db.getPoolClient();
    try {
      const result = await this.adminRepositoryService.selectAdminLoginHistory(poolClient,
        hosCd, ipVal, successVal, userAccntVal, startDtVal, endDtVal)

      // console.log(`result`, result);
      returnObj = {
        code: 200,
        message: 'success',
        result: result
      };
    } catch (err) {
      returnObj = {
        code: 410,
        message: `error, ${JSON.stringify(err)}`,
      };
    } finally {
      poolClient.release();
      return returnObj;
    }
  }

  async getAdminPrivacyAccess(
    hosCd: string,
    userAccntVal: string,
    hospitalCdVal: string,
    serviceVal: string,
    ipVal: string,
    actionVal: string,
    startDtVal: string,
    endDtVal: string,
  ) {
    let returnObj;
    const poolClient = await db.getPoolClient();
    try {
      const result = await this.adminRepositoryService.selectAdminPrivacyAccess(poolClient, 
        hosCd, userAccntVal, hospitalCdVal, serviceVal, ipVal, actionVal, startDtVal, endDtVal)

      returnObj = {
        code: 200,
        message: 'success',
        result: result
      };
    } catch (err) {
      returnObj = {
        code: 410,
        message: `error, ${JSON.stringify(err)}`,
      };
    } finally {
      poolClient.release();
      return returnObj;
    }
  }

  async insertLoginHistory(AdminLoginHistory: any) {
    const details = AdminLoginHistory.details;
    const userIp = AdminLoginHistory.userIp;
    const success = AdminLoginHistory.success;
    const userAccnt = AdminLoginHistory.userAccnt;
    let returnObj;

    const poolClient = await db.getPoolClient();
    try {
      if (!details || !userIp || !success || !userAccnt) {
        throw '필수값이 없습니다.';
      }

      await this.adminRepositoryService.insertAdminLoginHistory(poolClient, AdminLoginHistory)

      returnObj = {
        code: 200,
        message: 'success'
      };
    } catch (err) {
      returnObj = {
        code: 410,
        message: `error, ${JSON.stringify(err)}`,
      };
    } finally {
      poolClient.release();
      return returnObj;
    }
  }
}
