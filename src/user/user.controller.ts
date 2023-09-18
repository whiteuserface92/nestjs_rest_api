import { Controller, Get, Post, Patch, Body, Put, Query} from '@nestjs/common';
import { UserService } from './user.service';
import { Public } from '../auth/auth.guard';

@Public()
@Controller('user')
export class UserController {

  constructor(private readonly userService: UserService) {}
 
  @Get('getUserList')
  async getUserList(
    @Query('hosCd') hosCd: string,
    @Query('id') id : number,
    // @Query('hospitalCd') hospitalCd: string,
    @Query('enabled') enabled : boolean,
  ) {
    return this.userService.getUserList(hosCd, id, enabled)
  }

  @Post('saveUser')
  async saveUser(
    @Query('hosCd') hosCd: string,
    @Body('saveUser') saveUser: any
  ) {
    return this.userService.saveUser(hosCd, saveUser)
  }

  @Patch('modifyUser')
  async modifyUser(
    @Query('hosCd') hosCd: string,
    @Body('modifyUser') modifyUser: any
  ) {
    // console.log(hosCd);
    // console.log(JSON.stringify(modifyUser))
    return this.userService.modifyUser(hosCd, modifyUser)
  }
  // @Put('userConfig/:id')
  // async putUserConfigs(
  //   @Query('hosCd') hosCd: string,
  //   @Param('id') id : number,
  //   @Body('params') params : any
  // ) {
  //   // console.log(JSON.stringify(params));
  //   return this.userService.putUserConfigsLogic(hosCd, id, params)
  // }

  // /*
  //   * 사용자 정의 기본정보 조회 호출
  //   * 1. 처음 로그인 시 호출
  //   * 처음 로그인 시 Get호출 후 PUT도 호출이 됨.
  //   병원 기본정보 조회 호출  (AS-IS UserConfigController)
  //   AS-IS GET context-path : /userMenus/{id}
  // */
  // @Get('userConfigs/:id')
  // async getUserConfigs(
  //   @Query('hosCd') hosCd: string,
  //   @Param('id') id : number
  //   ){
  //     return this.userService.getUserConfigsLogic(hosCd, id);
  //   }


  // /*
  //   * 사용자 정의 기본정보 조회 호출
  //   * 1. 처음 로그인 시 호출
  //   * 처음 로그인 시 Get호출 후 PUT도 호출이 됨.
  //   병원 기본정보 조회 호출  (AS-IS UserConfigController)
  //   AS-IS GET context-path : /userMenus/{id}
  // */
  // @Get('userConfigs2/:id')
  // async getUserConfigs2(
  //   @Query('hosCd') hosCd: string,
  //   @Param('id') id : number
  //   ){
  //     //기존 로직은 SecurityUtils.getCurrentUserId();  - 즉 header Authientication 에서 user_id값을 가져오는 로직
  //     //파라미터에 호출되는 id로 user_id 검색으로 바꿈.
      
  //     return this.userService.getUserConfigs(hosCd, id);

  //   }

  //   /*
  //   * 자동로그아웃 시간, 방해 금지 시간 입력
  //   병원 기본정보 조회 호출  (AS-IS UserConfigController)
  //   AS-IS GET context-path : /userConfigs/uiPush/{id}

  //       @Get('userConfigs/:id') 상단 REST/API에서 UserConfig 정보가 없는 user는 기본값으로 자동생성되게 만듬.
  //       만들필요 X

  //   */
  //  @Get('userConfigs/uiPush/:id')
  //  getUiPushUserConfigs(
  //   @Query('hosCd') hosCd: string,
  //   @Param('id') id : number
  //   ){
  //   // return this.userService.getUiPushUserConfigsLogin(id);
  //  }
    
  //   /*
  //   * 자동로그아웃 시간, 방해 금지 시간 입력
  //   병원 기본정보 조회 호출  (AS-IS UserConfigController)
  //   AS-IS PUT context-path : /userConfigs/uiPush/{id}
  //   2023-06-27  18:33 김동인프로
  //   */
  //   @Put('userConfigs/uiPush/:id')
  //   putUiPushUserConfig(
  //     @Query('hosCd') hosCd: string,
  //     @Param('id') id : number,
  //     @Body('params') params : any
  //   ){
  //     return this.userService.putUiPushUserConfigLogic(hosCd, id, params);
  //   } 
  //   /*
  //   * 유저 롤 수정 API
  //   병원 기본정보 조회 호출  (AS-IS UserAdminController)
  //   AS-IS PUT context-path : /updateAdmin/{id}
  //   */
  //   @Put('updateAdmin/:id')
  //   updateAdmin(
  //     @Query('hosCd') hosCd: string,
  //     @Param('id') id : number,
  //     @Body('updateUserAdminDTO') updateUserAdminDTO : any
  //   ){
  //     return this.userService.updateAdminLogic(hosCd, id, updateUserAdminDTO)  
  //   }

  

}
