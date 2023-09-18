import { Controller, Post, Get, Patch, Body, Query, Param } from '@nestjs/common';
import { Logger } from '@nestjs/common'
import { AdminMenuService } from './adminMenu.service';
import { Public } from '../auth/auth.guard';

@Controller('adminMenu')
export class AdminMenuController { 
    private readonly logger = new Logger(AdminMenuController.name);

    constructor(private readonly adminMenuService: AdminMenuService) { }

    /*
        어드민 메뉴 조회 컨트롤러 
        context-path : /api/adminMenu/getAdminMenu
    */
    @Get('getAdminMenu') 
    getAdminMenu(
        @Query('hosCd') hosCd: string,
    ) {
        return this.adminMenuService.getAdminMenuList(hosCd);
    }

    /*
        어드민 메뉴 등록 컨트롤러 
        context-path : /api/adminMenu/saveAdminMenu
    */
    @Post('/saveAdminMenu')
    saveAdminMenu(
        @Query('hosCd') hosCd: string,
        @Body() adminMenuParam: any
    ) {
        return this.adminMenuService.saveAdminMenu(hosCd, adminMenuParam);
    }

    /*
        어드민 메뉴 수정 컨트롤러 
        context-path : /api/adminMenu/updateAdminMenu
    */
    @Patch('/updateAdminMenu')
    updateAdminMenu(
        @Query('hosCd') hosCd: string,
        @Body() adminMenuParam: any
    ) {
        return this.adminMenuService.updateAdminMenu(hosCd, adminMenuParam);
    }

    /*
        어드민 유저 레벨 수정 컨트롤러 
        context-path : /api/adminMenu/updateAdminMenu
    */
    @Patch('/updateAdminLevel')
    updateAdminLevel(
        @Query('hosCd') hosCd: string,
        @Body() adminParam: any) {
        return this.adminMenuService.updateAdminLevel(hosCd, adminParam);
    }

    /*
        어드민 레벨별 메뉴 조회 컨트롤러 
        context-path : /api/adminMenu/getAdminMenuByLevel
    */
    @Get('getAdminMenuByLevel') 
    getAdminMenuByLevel(
        @Query('hosCd') hosCd: string,
        @Query('allowLevel') allowLevel?: number,
        @Query('hospitalCd') hospitalCd?: string,
    ) {
        return this.adminMenuService.getAdminMenuByLevel(hosCd ,allowLevel, hospitalCd);
    }

    /*
        어드민 레벨별 메뉴 등록 컨트롤러 
        context-path : /api/adminMenu/saveAdminMenuByLevel
    */
    @Post('/saveAdminMenuByLevel')
    saveAdminMenuByLevel(
        @Query('hosCd') hosCd: string,
        @Body() adminMenuParam: any) {
        return this.adminMenuService.saveAdminMenuByLevel(hosCd, adminMenuParam);
    }

    /*
        어드민 레벨별 메뉴 활성화 / 비활성화
        context-path : /api/adminMenu/updateAdminMenuByLevel
    */
    @Patch('/flagAdminMenuByLevel')
    flagAdminMenuByLevel(
        @Query('hosCd') hosCd: string,
        @Body() adminMenuParam: any
    ) {
        return this.adminMenuService.flagAdminMenuByLevel(hosCd, adminMenuParam);
    }
}