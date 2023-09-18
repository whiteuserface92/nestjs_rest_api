import { Controller, Put, Param, Body, Get, Patch, Query, Post, Delete } from '@nestjs/common';
import { MenuService } from './menu.service';
import { Public } from '../auth/auth.guard';

@Public()
@Controller('menu')
export class MenuController {

  constructor(private readonly menuService: MenuService) { }
  
  /**
   * 사용자 메뉴 리스트 전체 조회(Mst 테이블)
   * @param hosCd 스키마 사용 병원코드 // ! Token에서 관리 
   * @returns 
   */
  @Post('getUserMenuList')
  getUserMenuList(
    @Query('hosCd') hosCd: string,
    @Body() userMenuParams: any
  ) {
    return this.menuService.getUserMenuList(hosCd, userMenuParams);
  }

  /**
   * 사용자 메뉴 등록(user_menu_mst 테이블)
   * @param hosCd 스키마 사용 병원코드 // ! Token에서 관리 
   * @param menuParams 
   * @returns
   */
  @Post('/saveUserMenu')
  saveUserMenuList(
    @Query('hosCd') hosCd: string,
    @Body() menuParams: any
  ) {
    return this.menuService.saveUserMenuList(hosCd, menuParams);
  }

  /**
   * 유저메뉴 수정
   * @param hosCd 스키마 사용 병원코드 // ! Token에서 관리 
   * @param menuParams
   * @returns
   */
  @Patch('/modifyUserMenu')
  modifyUserMenu(
    @Query('hosCd') hosCd: string,
    @Body() modifyUserMenuParams: any
  ) {
    //console.log(JSON.stringify(modifyUserMenuParams))
    return this.menuService.modifyUserMenu(hosCd, modifyUserMenuParams);
  }


}
