import { Injectable } from '@nestjs/common';
import * as db from '../db';
import { UserRepositoryService } from './userRepository.service';

@Injectable()
export class UserService {

    constructor(private readonly userRepositoryService: UserRepositoryService) {}


    async saveUser(hosCd : string, saveUser : any){
        
        let returnObj = {
            code : 200,
            message : "saveUserLogic success",
            result : {}
        };

        let result;
        
        const poolClient = await db.getPoolClient();
        
        try{
            result = await this.userRepositoryService.saveUser(hosCd, saveUser, poolClient);
            returnObj.result= result;
        } catch(e){
            returnObj.code = 401;
            returnObj.message = `saveUserLogic failed, ${JSON.stringify(e)}`
        } finally {
            poolClient.release();
            return returnObj
        }
    }

    async getUserList(hosCd : string, id : number, enabled : boolean){
        let returnObj = {
            code : 200,
            message : "getUserListLogic success",
            result : {}
        }
        const poolClient = await db.getPoolClient();
        try{
            let result : any = await this.userRepositoryService.getUserList(hosCd, id, enabled, poolClient);
            returnObj.result = result;
        } catch(e){
            returnObj.code = 401;
            returnObj.message = `getUserListLogic failed, ${JSON.stringify(e)}`
        } finally {
            poolClient.release();
            return returnObj
        }
    }

    async modifyUser(hosCd : string, modifyUser : any){
        let returnObj = {
            code : 200,
            message : "modifyUserLogic success",
            result : {}
        }
        const poolClient = await db.getPoolClient();
        try{
            let result : any = await this.userRepositoryService.modifyUser(hosCd, modifyUser, poolClient);
            returnObj.result = result;
        } catch(e){
            returnObj.code = 401;
            returnObj.message = `modifyUserLogic failed, ${JSON.stringify(e)}`
        } finally {
            poolClient.release();
            return returnObj
        }
    }

    

    async getUserMenusByIdByHosCd(hosCd : string, userId : any, deptCd : any, hospitalCd : any, poolClient : any){
        let returnObj = {
            code : 200,
            message : "getUserMenusByIdByHosCd success",
            result : {}
        }
        try{
            let result: any  = await this.userRepositoryService.findMenuRoleHospitalMenus(hosCd, userId, poolClient);
            returnObj.result = result;
        } catch(e){
            returnObj.code = 401;
            returnObj.message = `getUserMenusByIdByHosCd failed, ${JSON.stringify(e)}`
        } finally {
            poolClient.release();
            return returnObj
        }
    }

    
    // TODO
    // 기존 AuthUtil을 사용하여, 호출하는 로직인데, Auth쪽이 개발되면 만들계획
    getCurrentUserId(){
        return 1
    }

    async putUserConfigsLogic(hosCd : string ,id : number, params : any){
        let returnObj = {
            code : 200,
            message : "putUserConfigsLogic success",
            result : {}
        }
        const poolClient = await db.getPoolClient();
          try{
            //기존 로직은 SecurityUtils.getCurrentUserId();  - 즉 header Authientication 에서 user_id값을 가져오는 로직
            //userId로 user조회
            let user;
            let userConfig;
            let result : any;

            console.log(JSON.stringify(params));

            await db.transaction_Begin(poolClient);
            //유저 조회
            user = await this.userRepositoryService.findByUserId(hosCd, id, poolClient);
      
            //유저 설정 조회
            userConfig = await this.userRepositoryService.userConfigFindByUserId(hosCd, id, poolClient);

            
      
            if(userConfig == undefined || userConfig == null || userConfig == ""){
              userConfig.user = user;
              userConfig.deptCd = params.deptCd;
              userConfig.langCd = params.langCd;
              console.log(JSON.stringify("1"+userConfig));
              result = await this.userRepositoryService.saveUserConfig(hosCd, userConfig, poolClient);
              returnObj.result = result;
            } else {
              userConfig.user = user;
              userConfig.deptCd = params.deptCd;
              userConfig.langCd = params.langCd;
              console.log(JSON.stringify("2"+userConfig));
              result = await this.userRepositoryService.updatedeptCdAndlangCd(hosCd, userConfig, poolClient);
              returnObj.result = result;
            }
            await db.transaction_Commit(poolClient);
          } catch (e){
            await db.transaction_Rollback(poolClient);
            returnObj.code = 401;
            returnObj.message = `putUserConfigsLogic failed, ${JSON.stringify(e)}`
            
          } finally {
            poolClient.release();
            return returnObj;
          }
    }

    async getUserRoleMenusDefaultPageById(hosCd : string ,loginUserId : any,  hospitalCd : any, poolClient : any){
        let returnObj = {
            code : 200,
            message : "getUserRoleMenusDefaultPageById success",
            result : {}
        }
        let result;
        try{
            result = await this.userRepositoryService.findMenuRoleHospitalMenus(hosCd, loginUserId, poolClient);
            returnObj.result = result;
        } catch (e){
            returnObj.code = 401;
            returnObj.message = "getUserRoleMenusDefaultPageById failed"
        } finally {
            return returnObj
        }
        
    }

    async getUserConfigsLogic(hosCd : string ,id : number){
       const poolClient = await db.getPoolClient();
      //기존 로직은 SecurityUtils.getCurrentUserId();  - 즉 header Authientication 에서 user_id값을 가져오는 로직
      //파라미터에 호출되는 id로 user_id 검색으로 바꿈.
      let user;
      let userConfig;
      
      let returnObj = {
        code : 200,
        message : "getUserConfigsLogic success",
        result : {
            userConfig : {}
        }
        }
      //user_mst에 id정보 조회
      try{
        console.info('getUserConfigsLogic started',[],[]);
        db.transaction_Begin(poolClient);
        user = await this.userRepositoryService.findByUserId(hosCd, id, poolClient);
        // await console.log(user);
        userConfig = await this.userRepositoryService.userConfigFindByUserId(hosCd, id, poolClient);
        if(userConfig == null){
          const userConfig = {
            user_id : 0,
            dept_cd : '',
            lang_cd : '',
            push_on_off : '',
            sess_timeout_mm : '',
            etc1 : '',
            etc2 : '',
            etc3 : ''
          } 
          //기본 userConfig 데이터 바이딩
          userConfig.user_id = id; 
          userConfig.dept_cd = "";
          userConfig.lang_cd = "ko";
          userConfig.push_on_off = "0"; // 방해금지 없음
          userConfig.sess_timeout_mm = "30"; // 30분
          userConfig.etc1 = "N";
          userConfig.etc2 = "N";
          userConfig.etc3 = "N";

          console.log(userConfig); 
          //UserConfig 저장
          
        await this.userRepositoryService.saveUserConfig(hosCd ,userConfig, poolClient);
        returnObj.message = "success [userConfig 정보가 없는 user_id입니다. 기본데이터 저장완료]"  
           
          
          //신규로 생성한 etc1,2,3 column이 비어있을 시 "N"으로 채워줌. 
        } else if((userConfig.etc1 == null || userConfig.etc1 == '') || 
                  (userConfig.etc2 == null || userConfig.etc2 == '') || 
                  (userConfig.etc3 == null || userConfig.etc3 == '')){ 
          userConfig.etc1 = "N";
          userConfig.etc2 = "N";
          userConfig.etc3 = "N";

          await this.userRepositoryService.updateUserConfigAllEtc(hosCd, userConfig, poolClient);
            
          
        } else if((userConfig.push_on_off == '' || userConfig.push_on_off == null) || 
                (userConfig.sess_timeout_mm == '' || userConfig.sess_timeout_mm == null)){ 
          let bSaveCheck = false;
          if((userConfig.push_on_off == null) || (userConfig.push_on_off == '' || (userConfig.push_on_off == undefined)))  {
            userConfig.push_on_off ="0"; // 방해금지 없음 
            bSaveCheck= true;
          }      
          if((userConfig.sess_timeout_mm == null || userConfig.sess_timeout_mm == '' || userConfig.sess_timeout_mm == undefined))  {
            userConfig.sess_timeout_mm="30"; // 30분  
            bSaveCheck= true;
          }      
          if(bSaveCheck){
            console.log("userConfig old value Default PushOnOff: 0,SessTimeoutMm: 30  get: userId : "+id);
            await this.userRepositoryService.updateUserConfigPushOffAndSessTimeOutMm(hosCd, id, userConfig, poolClient);
            bSaveCheck = false 
          }
      }
      returnObj.result.userConfig = userConfig;
      db.transaction_Commit(poolClient);
    } catch(e){
        console.error('getUserMenusByIdByHosCd failed',[],[]);
        db.transaction_Rollback(poolClient);
        returnObj.code = 401;
        returnObj.message = `getUserConfigsLogic failed, ${JSON.stringify(e)}`
    } finally {
        poolClient.release();
        return returnObj
    }
    }

    async putUiPushUserConfig(hosCd : string ,id: number){
        let returnObj = {
            code : 200,
            message : "putUiPushUserConfig success",
            result : {}
            }
        let poolClient = await db.getPoolClient();
        try{
          let user;
          let userConfig;
    
          //user 조회
          user = await this.userRepositoryService.findByUserId(hosCd, id, poolClient); 
          console.log(user)
    
          //userConfig 조회
          userConfig = await this.userRepositoryService.userConfigFindByUserId(hosCd, id, poolClient); 
    
          console.log(user);
    
    
          //user 정보가 있고, userConfig값이 없을 경우 getUserConfigs(전체 / 부분 재생성 로직 호출)
          if(user){
            if(!userConfig){
              console.log("해당 userConfig 정보가 없습니다. user_id = "+id);
              return this.getUserConfigs(hosCd, id); 
            }
          }  
          // console.log(userConfig); 
          returnObj.result = userConfig;   
          db.transaction_Commit(poolClient);
        } catch(e){
            db.transaction_Rollback(poolClient);
            returnObj.code = 401;
            returnObj.message = `putUiPushUserConfig failed, ${JSON.stringify(e)}`
        } finally {
            return returnObj
        }
          
    }

    async userRoleSaveAll(hosCd : string ,newUserRoles : any, poolClient : any){
        let returnObj = {
            code : 200,
            message : "userRoleSaveAll success",
            result : {}
            }
        try{
            db.transaction_Begin(poolClient);
            returnObj.result = this.userRepositoryService.insertUserRoles(hosCd, newUserRoles, poolClient);
            db.transaction_Commit(poolClient);
        } catch (e){
            db.transaction_Rollback(poolClient);
            returnObj.code = 401;
            returnObj.message = `userRoleSaveAll failed, ${JSON.stringify(e)}`
        } finally {
            return returnObj
        }
        
     }

     async postUserMenus(hosCd : string ,param : any){

        let poolClient = await db.getPoolClient();

        let returnObj = {
            code : 200,
            message : "postUserMenus success",
            result : {}
            }

        console.log(param);
        let user;
        let menu;
        let rootUserMenu;
        let savedRootUserMenu;
        let nameCd = "menu.name."+param.menuType
        let rootMenu;

        //해당 유저 검색
        try{
            db.transaction_Begin(poolClient);
            user = await this.userRepositoryService.findByUserId(hosCd, param.userId, poolClient);
            
        //해당 메뉴 검색

            menu = await this.userRepositoryService.findByMenuId(hosCd, param.menuId, poolClient);


        //user_menu table userId, menuType, level이 0인것으로 검색
   
            rootUserMenu = await this.userRepositoryService.findUserMenuByuserIdBymenuTypeBylevel(hosCd, param.userId, param.menuType, poolClient);

        

            rootMenu = this.userRepositoryService.menuFindByNameCd(hosCd, nameCd, poolClient);

            rootUserMenu.menuType = param.menuType;
            rootUserMenu.level = 0;
            rootUserMenu.menu = rootMenu;
            rootUserMenu.user = user;
            
            //user_menu를 저장하기 윈해서 갖춰져야할 2가지 조건
            // 1.  user_mst id로 created_by, updated_by 채우기
            // 2.  menu_type 정하기
            //

            savedRootUserMenu = this.userRepositoryService.saveUserMenu(hosCd, rootUserMenu, poolClient);

            returnObj.result=param;
            db.transaction_Commit(poolClient);
        } catch (e){
            db.transaction_Rollback(poolClient);
            returnObj.code = 401;
            returnObj.result = `postUserMenus failed, ${JSON.stringify(e)}`
        } finally {
            poolClient.release();
            return returnObj
        }
     }

     async putUiPushUserConfigLogic(hosCd : string, id : number, params : any){
        let returnObj = {
            code : 200,
            message : "putUiPushUserConfigLogic success",
            result : {}
            }
        let poolClient = await db.getPoolClient();

        // console.log(JSON.stringify(params));
        
        let user;
        let userConfig;

        try{
          //user 조회
          user = await this.userRepositoryService.findByUserId(hosCd, id, poolClient); 
          console.log(user)
    
          //userConfig 조회
          userConfig = await this.userRepositoryService.userConfigFindByUserId(hosCd, id, poolClient); 

          console.log(JSON.stringify(params));
    
          //user 정보가 있고, userConfig값이 없을 경우 getUserConfigs(전체 / 부분 재생성 로직 호출)
          if(user){
            if(!userConfig){
              console.log("해당 userConfig 정보가 없습니다. user_id = "+id);
              poolClient.release();
              return this.getUserConfigs(hosCd, id); 
            }
          }  else {
            returnObj.message = 'putUiPushUserConfigLogic failed : 해당 유저정보가 없습니다. (user_id : '+ id +' )';
            returnObj.code = 401;
            poolClient.release();
            return returnObj;
          }
          // 자동로그아웃 시간, 방해 금지 시간 입력
          // 데이터 바인딩

          console.log(JSON.stringify(params));

          userConfig.sessTimeoutMm = params.sessTimeoutMm;
          userConfig.alarmOffStarttime = params.alarmOffStarttime;
          userConfig.alarmOffEndtime = params.alarmOffEndtime;

          this.userRepositoryService.updateUserConfigTimes(hosCd, id, params, poolClient);

          userConfig = await this.userRepositoryService.userConfigFindByUserId(hosCd, id, poolClient); 

          returnObj.result = userConfig;   

          db.transaction_Commit(poolClient);
        } catch(e){
            db.transaction_Rollback(poolClient);
            returnObj.code = 401;
            returnObj.message = `putUiPushUserConfigLogic failed, ${JSON.stringify(e)}`
        } finally {
            poolClient.release();
            return returnObj
        }
     }

    

     async updateUserRoles(hosCd : string, updateRoleIds : any, userId : any, poolClient: any){
        
        let returnObj = {
            code : 200,
            message : "updateUserRoles Success!",
            result : {
                successRoleIds :[],
                beforeRoleIds : []
            }
        };
        try{
            console.log("updateRoleIds : "+JSON.stringify(updateRoleIds));
            console.log("userId : "+JSON.stringify(userId));

            db.transaction_Begin(poolClient);

            // 기존 user_id의 롤을 다 삭제해버린다.

            await this.userRepositoryService.deleteUserRoleAllByUserId(hosCd, userId, poolClient);


            //updateRoleIds로 다시 세팅한다.
            for(let i = 0; i < updateRoleIds.length; i++){  
                let tmpBox : any;
                let userRole = {
                    user_id : userId,
                    role_id : updateRoleIds[i]
                }
                console.log(JSON.stringify(userRole));

                tmpBox = await this.userRepositoryService.insertUserRoles(hosCd, userRole, poolClient);

                returnObj.result.successRoleIds.push(tmpBox.successResultBox[0]);
                console.log("tmpBox : "+JSON.stringify(tmpBox)); 
            }
            db.transaction_Commit(poolClient);
        } catch (e){
            db.transaction_Rollback(poolClient);
            returnObj.code = 401;
            returnObj.message = `updateUserRoles failed, ${JSON.stringify(e)}`
        } finally {
            poolClient.release();
            return returnObj
        }
        

     }

    

     async updateAdminLogic(hosCd : string, id : number, updateUserAdminDTO : any){
        let returnObj = {
            code : 200,
            message : "updateAdminLogic Success!",
            result : {}
        }
        const poolClient = await db.getPoolClient();
        try{
            db.transaction_Begin(poolClient);
            returnObj.result = this.updateUserAdmin(hosCd, id, updateUserAdminDTO, poolClient);

        } catch (e){
            db.transaction_Begin(poolClient);
            returnObj.code = 401;
            returnObj.message = `updateAdminLogic failed, ${JSON.stringify(e)}`
            db.transaction_Commit(poolClient);
        } finally {
            poolClient.release();
            return returnObj
        }
        
     }


     //! 사용안함 
     async updateUserAdmin(hosCd : string, id : number, updateUserAdminDTO : any, poolClient : any){
        
        let returnObj = {
            code : 200,
            message : "updateUserAdmin success",
            result : {
                newInsertRoles : {},
                beforeUserRoles : {}
            }
        }
        
        try {
            let user; // 사용자
            // let userAdmin; // 관리자
            //사용자 아이디 조회
            db.transaction_Begin(poolClient);
            user = await this.userRepositoryService.findByUserId(hosCd, id, poolClient);
            
            //기존 유저의 role들을 가져와서 이전 유저정보를 만든다.
            let BeforeUserRoles : any = await this.userRepositoryService.getUserRoles(hosCd, id, poolClient) ; 
            let BeforeRoles = [];
            for(let i = 0; i < BeforeUserRoles.length; i++){
                BeforeRoles.push(BeforeUserRoles[i].role_id);
            }
            returnObj.result.beforeUserRoles = BeforeRoles;

            if(BeforeUserRoles){
                //역할 수정
                //successResult 에 새로 넣은 권한에 대한 정보를 준다.
                returnObj.result.newInsertRoles = await this.updateUserRoles(hosCd, updateUserAdminDTO.roleIds, id, poolClient);
            }
            db.transaction_Commit(poolClient);
        }  catch(e){
            db.transaction_Rollback(poolClient);
            returnObj.code = 401;
            returnObj.message = `updateUserAdmin failed, ${JSON.stringify(e)}`
        } finally {
            poolClient.release();
            return returnObj
        }
            

        
     }

     

     async getUserConfigs (hosCd : string, id: number) {
        let resultObj = {
            code : 200,
            message : 'getUserConfigs success',
            result : {
                userConfig : {}
            }
        }
        let step = `0`;
        let userConfig : any;
        const poolClient = await db.getPoolClient();

        try {
            let user;
            let result;

            db.transaction_Begin(poolClient);

            user = await this.userRepositoryService.findByUserId(hosCd, id, poolClient);
            step = `1`;
            if(!user){
                console.log(`해당 유저아이디는 존재하지 않습니다 :${id}`); 
                resultObj.code = 401
                resultObj.message = `해당 유저아이디는 존재하지 않습니다 :${id}`
                throw `해당 유저아이디는 존재하지 않습니다`;
            }

            step = `2`;
            userConfig = await this.userRepositoryService.userConfigFindByUserId(hosCd, id, poolClient);

            console.log(userConfig);

            if(!userConfig){
                let userConfig = {
                    user_id : id,
                    dept_cd : '',
                    lang_cd : 'ko',
                    push_on_off : '0', // 방해금지 없음
                    sess_timeout_mm : '30', // 30분
                    etc1 : 'N',
                    etc2 : 'N',
                    etc3 : 'N'
                } 
                step = `3-1`;
                result = await this.userRepositoryService.saveUserConfig(hosCd, userConfig, poolClient);
                resultObj.result.userConfig = result;
                resultObj.message = "success [userConfig 정보가 없는 user_id입니다. 기본데이터 저장완료]" 
            } else if((userConfig.etc1 == null || userConfig.etc1 == '') || 
                        (userConfig.etc2 == null || userConfig.etc2 == '') || 
                        (userConfig.etc3 == null || userConfig.etc3 == '')){ 

                console.log("userCOnfig.etc1 : "+ userConfig)
                userConfig.etc1 = "N";
                userConfig.etc2 = "N";
                userConfig.etc3 = "N";

                step = `3-2`;
                await this.userRepositoryService.updateUserConfigAllEtc(hosCd, userConfig, poolClient);
                console.log(`updateUserConfigAllEtc is successed! : ${userConfig}`);
                resultObj.message="success [etc1, etc2, etc3] 값 리셋완료"
                
            } else if((userConfig.push_on_off == '' || userConfig.push_on_off == null) || 
                        (userConfig.sess_timeout_mm == '' || userConfig.sess_timeout_mm == null)){ 

                console.log("userCOnfig.pushONOff : "+ userConfig)

                let bSaveCheck = false; 
                if((userConfig.push_on_off == null) || (userConfig.push_on_off == '' || (userConfig.push_on_off == undefined)))  {
                    userConfig.push_on_off ="0"; // 방해금지 없음 
                    bSaveCheck= true;
                }      
                if((userConfig.sess_timeout_mm == null || userConfig.sess_timeout_mm == '' || userConfig.sess_timeout_mm == undefined))  {
                    userConfig.sess_timeout_mm="30"; // 30분  
                    bSaveCheck= true;
                }      
                if(bSaveCheck){
                    console.log("userConfig old value Default PushOnOff: 0,SessTimeoutMm: 30  get: userId : "+id);
                    step = `3-3`;
                    await this.userRepositoryService.updateUserConfigPushOffAndSessTimeOutMm(hosCd, id, userConfig, poolClient);
                    bSaveCheck = false 
                }
            }
            resultObj.result.userConfig = userConfig;
            db.transaction_Commit(poolClient);
        } catch (error) {
            console.log(`getUserConfigs error [${error}], STEP:${step}`)
            db.transaction_Rollback(poolClient);
        } finally {
            poolClient.release();
            return resultObj
        }

     }
}
