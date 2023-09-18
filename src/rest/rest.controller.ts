// import {
//   Controller,
//   Post,
//   Get,
//   Put,
//   Body,
//   Delete,
//   Query,
// } from '@nestjs/common';
// import { RestService } from './rest.service';
// import { Public } from '../auth/auth.guard';

// @Public()
// @Controller('rest')
// export class RestController {
//   constructor(private readonly restService: RestService) {}

//   @Get('test')
//   plusCheckedJoin() {
//     return this.restService.selectData();
//   }

//   @Get('test2')
//   exampleTransaction() {
//     return this.restService.exampleTransaction();
//   }

//   //관리자 접근 기록 (AS-IS AdminHistoryController)
//   @Get('getAdminAccessHistory')
//   getAdminAccessHistory(
//     @Query('actionVal') actionVal = 'ALL',
//     @Query('hospitalCdVal') hospitalCdVal = 'ALL',
//     @Query('ipVal') ipVal = 'ALL',
//     @Query('targetUserIdVal') targetUserIdVal = 0,
//     @Query('userAccntVal') userAccntVal = 'ALL',
//     @Query('startDtVal') startDtVal = '1900-01-01',
//     @Query('endDtVal') endDtVal = '1900-01-01',
//   ) {
//     return this.restService.getAdminAccessHistory(
//       actionVal,
//       hospitalCdVal,
//       ipVal,
//       targetUserIdVal,
//       userAccntVal,
//       startDtVal,
//       endDtVal,
//     );
//   }

//   //관리자 로그인 기록 (AS-IS AdminHistoryController)
//   @Get('getAdminLoginHistory')
//   getAdminLoginHistory(
//     @Query('ipVal') ipVal = 'ALL',
//     @Query('successVal') successVal = 'ALL',
//     @Query('userAccntVal') userAccntVal = 'ALL',
//     @Query('startDtVal') startDtVal = '1900-01-01',
//     @Query('endDtVal') endDtVal = '1900-01-01',
//   ) {
//     return this.restService.getAdminLoginHistory(
//       ipVal,
//       successVal,
//       userAccntVal,
//       startDtVal,
//       endDtVal,
//     );
//   }

//   //관리자 민감정보 접근 기록 (AS-IS AdminHistoryController)
//   @Get('getAdminPrivacyAccess')
//   getAdminPrivacyAccess(
//     @Query('userAccntVal') userAccntVal = 'ALL',
//     @Query('hospitalCdVal') hospitalCdVal = 'ALL',
//     @Query('serviceVal') serviceVal = 'ALL',
//     @Query('ipVal') ipVal = 'ALL',
//     @Query('actionVal') actionVal = 'ALL',
//     @Query('startDtVal') startDtVal = '1900-01-01',
//     @Query('endDtVal') endDtVal = '1900-01-01',
//   ) {
//     return this.restService.getAdminPrivacyAccess(
//       userAccntVal,
//       hospitalCdVal,
//       serviceVal,
//       ipVal,
//       actionVal,
//       startDtVal,
//       endDtVal,
//     );
//   }

//   //관리자 민감정보 접근 기록 (AS-IS AdminLoginHistoryController)
//   @Post('loginHistory')
//   insertLoginHistory(@Body() AdminLoginHistory: any) {
//     return this.restService.insertLoginHistory(AdminLoginHistory);
//   }

//   //앱 버전 목록 (AS-IS AppController)
//   @Get('apps/findAllByKeyword')
//   appFindAllByKeyword(
//     @Query('hospitalId') hospitalId?: number,
//     @Query('keyword') keyword?: string, //appNm
//   ) {
//     return this.restService.appFindAllByKeyword(hospitalId, keyword);
//   }

//   // (AS-IS AppController)
//   @Get('apps')
//   getAppsInfo(
//     @Query('appId') appId: string,
//     @Query('appPlatformId') appPlatformId: string,
//   ) {
//     return this.restService.getAppsInfo(appId, appPlatformId);
//   }

//   //유입 파라미터 확인 id기준 (AS-IS AppController)
//   // app_mst 등록 및 수정 (appId 값이 있으면 수정, 없으면 등록)
//   @Post('apps')
//   postApp(@Body() appInfo: any) {
//     return this.restService.saveAppMst(appInfo);
//   }

//   //
//   @Post('appVersions')
//   appVersions() {
//     return '';
//   }

//   //
//   @Put('appVersions/:appVersionId')
//   updateAppVersion() {
//     return '';
//   }

//   //AppController
//   @Delete('/rest/appPlatforms/forceDelete/:appPlatformId')
//   deleteAppVersion() {
//     return '';
//   }
// }
