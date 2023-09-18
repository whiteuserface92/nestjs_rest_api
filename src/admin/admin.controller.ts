import { Controller, Post, Get, Patch, Body, Query, HttpCode, Res, HttpStatus } from '@nestjs/common';
import { AdminService } from './admin.service';
import { Public } from 'src/auth/auth.guard';
import { Request, Response } from 'express';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  /**
   * 
   * @param hosCd 스키마 사용 병원코드 // ! Token에서 관리 
   * @param adminUserId 관리자 user_id 
   * @param adminLevel 관리자 level
   * @param hospitalCd 병원코드
   * @param enabled 활성여부
   * @returns 
   */
  
  @Get('getAdminUserList')
  @HttpCode(200)
  getAdminUserList(
    @Res({ passthrough: true }) res: Response,
    @Query('hosCd') hosCd: string,
    @Query('adminUserId') adminUserId: number,
    @Query('adminLevel') adminLevel: number,
    @Query('hospitalCd') hospitalCd: string,
    @Query('userAccount') userAccount: string,
    @Query('enabled') enabled: boolean
  ) {
    return this.adminService.getAdminUserList(hosCd, adminUserId, adminLevel, hospitalCd, userAccount, enabled);
  }

  /**
   * @param hosCd 스키마 사용 병원코드 // ! Token에서 관리 
   * @param saveAdminUser 관리자 계정 등록 Object 
     //! saveAdminUser Object 필수항목 : (adminLevel: number, userName: string, hostpitalCd: string)
   * @returns 
   */
  @Post('saveAdminUser')
  @HttpCode(200)
  saveAdminUser(
    @Query('hosCd') hosCd: string,
    @Body() saveAdminUser: any) {
    return this.adminService.saveAdminUser(hosCd, saveAdminUser);
  }

  /**
   * 
   * @param hosCd 스키마 사용 병원코드 // ! Token에서 관리 
   * @param modifyAdminUser 관리자 계정 수정 Object 
     //! modifyAdminUser Object 필수항목 : (adminUserId: number, adminLevel: number, userName: string, hostpitalCd: string, enabled: boolean)
   * @returns 
   */
  @Patch('modifyAdminUser')
  @HttpCode(200)
  modifyAdminUser(
    @Query('hosCd') hosCd: string,
    @Body() modifyAdminUser: any) {
    return this.adminService.modifyAdminUser(hosCd, modifyAdminUser);
  }

  
    /**
   * 
   * @param hosCd 스키마 사용 병원코드 // ! Token에서 관리 
   * @param resetPwdAdminUser 관리자 패스워드 초기화 Object 
   * @returns 
   */
  @Patch('resetPwdAdminUser')
  @HttpCode(200)
  resetPwdAdminUser(
    @Query('hosCd') hosCd: string,
    @Body() resetPwdAdminUser: any) {
    return this.adminService.resetPwdAdminUser(hosCd, resetPwdAdminUser);
  }

  /*
    관리자 접근 기록 (AS-IS AdminHistoryController)
    AS-IS context-path : /rest/getAdminAccessHistory
  */
  @Get('getAdminAccessHistory')
  @HttpCode(200)
  getAdminAccessHistory(
    @Query('hosCd') hosCd: string,
    @Query('actionVal') actionVal = 'ALL',
    @Query('hospitalCdVal') hospitalCdVal = 'ALL',
    @Query('ipVal') ipVal = 'ALL',
    @Query('targetUserIdVal') targetUserIdVal = 0,
    @Query('userAccntVal') userAccntVal = 'ALL',
    @Query('startDtVal') startDtVal = '1900-01-01',
    @Query('endDtVal') endDtVal = '1900-01-01',
  ) {
    return this.adminService.getAdminAccessHistory(
      hosCd,
      actionVal,
      hospitalCdVal,
      ipVal,
      targetUserIdVal,
      userAccntVal,
      startDtVal,
      endDtVal,
    );
  }

  /* 
    관리자 로그인 기록 (AS-IS AdminHistoryController)
    AS-IS context-path : /rest/getAdminLoginHistory
  */
  @Get('getAdminLoginHistory')
  @HttpCode(200)
  getAdminLoginHistory(
    @Query('hosCd') hosCd: string,
    @Query('ipVal') ipVal = 'ALL',
    @Query('successVal') successVal = 'ALL',
    @Query('userAccntVal') userAccntVal = 'ALL',
    @Query('startDtVal') startDtVal = '1900-01-01',
    @Query('endDtVal') endDtVal = '1900-01-01',
  ) {
    // let hosCd = req.query.hosCd.toString()
    return this.adminService.getAdminLoginHistory(hosCd, ipVal, successVal, userAccntVal, startDtVal, endDtVal);
  }

  /* 
    관리자 민감정보 접근 기록 (AS-IS AdminHistoryController)
    AS-IS context-path : /rest/getAdminPrivacyAccess
  */
  @Get('getAdminPrivacyAccess')
  @HttpCode(200)
  getAdminPrivacyAccess(
    @Query('hosCd') hosCd: string,
    @Query('userAccntVal') userAccntVal = 'ALL',
    @Query('hospitalCdVal') hospitalCdVal = 'ALL',
    @Query('serviceVal') serviceVal = 'ALL',
    @Query('ipVal') ipVal = 'ALL',
    @Query('actionVal') actionVal = 'ALL',
    @Query('startDtVal') startDtVal = '1900-01-01',
    @Query('endDtVal') endDtVal = '1900-01-01',
  ) {
    return this.adminService.getAdminPrivacyAccess(
      hosCd,
      userAccntVal,
      hospitalCdVal,
      serviceVal,
      ipVal,
      actionVal,
      startDtVal,
      endDtVal,
    );
  }

  /* 
    관리자 민감정보 접근 기록 (AS-IS AdminLoginHistoryController)
    AS-IS context-path : /rest/insertLoginHistory
  */
  @Post('loginHistory')
  @HttpCode(200)
  insertLoginHistory(@Body() AdminLoginHistory: any) {
    return this.adminService.insertLoginHistory(AdminLoginHistory);
  }
}
