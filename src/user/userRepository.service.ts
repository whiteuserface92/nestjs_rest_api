import { Injectable } from '@nestjs/common';
import * as db from '../db';
import { LoggerService } from '@nestjs/common';
import { error } from 'console';

@Injectable()
export class UserRepositoryService {

    async saveUser(hosCd : string, saveUser : any, poolClient : any){
        let schemaNm: string;
        
        try {

            //saveUser userNm 중복 시 reject 로직
            const validateValue = await this.getUserByUserAccnt(hosCd, saveUser.userAccnt, poolClient);
            console.log('validateValue : '+JSON.stringify(validateValue));
            if(validateValue.length > 0){
                throw (`[해당 병원코드에 동일한 userAccnt 값이 존재합니다.]`)
            }

            schemaNm = await db.getSchemaNm(hosCd);
            const sql = `INSERT INTO ${schemaNm}.user_mst
                        (
                            created_by, 
                            created_on, 
                            updated_by, 
                            updated_on, 
                            enabled, 
                            hospital_cd, 
                            user_nm, 
                            user_type,
                            user_accnt
                        )
                        VALUES
                        (
                            1, 
                            now(), 
                            1, 
                            now(), 
                            true, 
                            '${hosCd}', 
                            '${saveUser.userNm}', 
                            '${saveUser.userType}',
                            '${saveUser.userAccnt}'
                        ) RETURNING *
                `;
                console.log(sql);
            const result = await db.query(poolClient, sql, []);
            return Promise.resolve(result.rows[0])
        } catch (err) {
            return Promise.reject(`[${schemaNm}.user_mst] insert err, ${err}`)
        } 
    }

    async getUserByUserAccnt(hosCd : string, userAccnt : string, poolClient : any){
        let schemaNm: string;

        try {
            if(!hosCd) throw('hospitalCd 필수값 입니다.')
            if(!userAccnt) throw('userAccnt는 필수값 입니다.')

            schemaNm = await db.getSchemaNm(hosCd);

            const sql = `SELECT * 
                           FROM ${schemaNm}.user_mst
                          where hospital_cd = '${hosCd}'
                            AND user_accnt = '${userAccnt}'`;
            const result = await db.query(poolClient, sql, []);
            return Promise.resolve(result.rows)
        } catch (err) {
            // console.log(`[${schemaNm}.user_mst] getUserByUserNm err, ${err}`)
            return Promise.reject(`[${schemaNm}.user_mst] getUserByUserNm err, ${err}`)
        }
    }

    async getUser(hosCd : string, id : number, poolClient : any){
        let schemaNm: string;

        try {
            schemaNm = await db.getSchemaNm(hosCd);
            const sql = `SELECT * FROM ${schemaNm}.user_mst where id=${id}`;

            const result = await db.query(poolClient, sql, []);

            return Promise.resolve(result.rows)
            
        } catch (err) {
            return Promise.reject(`[${schemaNm}.user_mst] getUser err, ${err}`)
        } 
    }

    async getUserList(hosCd : string, id : number , enabled : boolean, poolClient : any){

        let schemaNm: string;
            
        try {
            let addSql: string = ``;

            //정렬문

            let orderByQuery = ` ORDER BY id ASC`; 

            //쿼리 조건문 
            if(hosCd) addSql += ` AND hospital_cd = '${hosCd}'`;
            if(id) addSql += ` AND id = ${id}`;
            if(enabled) addSql += ` AND enabled = ${enabled}`;

            schemaNm = await db.getSchemaNm(hosCd);
            const sql = `SELECT * 
                           FROM ${schemaNm}.user_mst 
                          WHERE 1=1 
                         ${addSql} ${orderByQuery}`;

            console.log(sql);
            const result = await db.query(poolClient, sql, []);

            return Promise.resolve(result.rows)
        } catch (err) {
            return Promise.reject(`[${schemaNm}.user_mst] getUserList err, ${err}`)
        } 

    }

    async modifyUser(hosCd: string, modifyUser : any, poolClient : any){
        let schemaNm: string
        
        try {
            let addSql: string = ``;
            schemaNm = await db.getSchemaNm(hosCd);

            if(!modifyUser.id){
                throw (`id값은 필수 값 입니다.`)
            }

            if(!modifyUser.userNm && !modifyUser.userType && !modifyUser.enabled && !modifyUser.userAccnt){
                throw (`modifyUser 수정할 사항이 없습니다.`)
            }


            // if(!modifyUser.userNm){
            //     user = await this.getUser(hosCd, modifyUser.id, poolClient);
            //     modifyUser.userNm = user.user_nm;
            // }
            // if(!modifyUser.userType){
            //     user = await this.getUser(hosCd, modifyUser.id, poolClient);
            //     modifyUser.userType = user.user_type;
            // }
            // if(!modifyUser.enabled){
            //     user = await this.getUser(hosCd, modifyUser.id, poolClient);
            //     modifyUser.enabled = user.enabled;
            // }
            if(modifyUser.userAccnt) addSql += ` user_accnt='${modifyUser.userAccnt}',`
            if(modifyUser.userNm) addSql += ` user_nm='${modifyUser.userNm}',`;
            if(modifyUser.enabled) addSql += ` enabled=${modifyUser.enabled},`;
            if(modifyUser.userType) addSql += ` user_type='${modifyUser.userType}',`;

            const sql = `UPDATE ${schemaNm}.user_mst
                            SET  
                                ${addSql}
                                updated_by=1, 
                                updated_on=now()
                          WHERE id=${modifyUser.id}
                      RETURNING *
                `;
                console.log(sql);
            const result = await db.query(poolClient, sql, []);
            return Promise.resolve(result.rows)
        } catch (err) {
            return Promise.reject(`[${schemaNm}.user_mst] modifyUser err, ${err}`)
        } 
    }

    async findByUserId(hosCd : string, userId : number, poolClient: any){
            let schemaNm: string
            
            try {
                schemaNm = await db.getSchemaNm(hosCd);
                const sql = `select * from ${schemaNm}.user_mst where id=${userId}`;
                const result = await db.query(poolClient, sql, []);
            
                Promise.resolve(result.rows)
            } catch (err) {
                Promise.reject(`[${schemaNm}.user_mst] select err, ${err}`)
            } 
    }

    async userConfigFindByUserId(hosCd : string, userId : number, poolClient: any){
            let schemaNm
            let result;

            try {
                schemaNm = await db.getSchemaNm(hosCd);
                let sql = `SELECT * FROM ${schemaNm}.user_config WHERE user_id = ${userId}`;

                result = await db.query(poolClient, sql, []);
                
                Promise.resolve(result.rows)
            } catch (err) {
                Promise.reject(`[${schemaNm}.user_config] select err, ${err}`)
            } 
    }

    async updatedeptCdAndlangCd(hosCd : string, userConfig : any, poolClient : any){
            let schemaNm
            let result : any;
        
            try { 
                if(userConfig.deptCd == undefined || userConfig.deptCd == null || userConfig.deptCd == ''){
                    userConfig.deptCd = ''; // 방해금지 없음
                }
                if(userConfig.langCd == undefined || userConfig.langCd == null || userConfig.langCd == ''){
                    userConfig.langCd = ''; // 30분
                }

                schemaNm = await db.getSchemaNm(hosCd);
                let sql = `
                    update ${schemaNm}.user_config SET 
                        updated_by = ${userConfig.user.id},
                        updated_on = NOW(),
                        dept_cd ='${userConfig.deptCd}', 
                        lang_cd = '${userConfig.langCd}' 
                    where user_id = ${userConfig.user.id}
                    RETURNING *`;

                result = await db.query(poolClient, sql, []); 

                

                if(result.rowCount === 0){
                    Promise.reject(`updatedeptCdAndlangCd [${schemaNm}.user_config] UPDATE err, rowCount = 0`)
                }else{
                    Promise.resolve(result.rows)
                }
            } catch (e) {
                Promise.reject(`updatedeptCdAndlangCd [${schemaNm}.user_config] UPDATE err, ${e}`)
            } 
    }

    async saveUserConfig(hosCd : string, userConfig: any, poolClient: any){ 
            const schemaNm = await db.getSchemaNm(hosCd);
            let result; 

            try {
                // console.log(typeof userConfig.user_id);
                // //user_id number 변환
                // userConfig.user_id = Number(userConfig.user_id); 
                let sql = `INSERT INTO ${schemaNm}.user_config
                            (
                                created_by, 
                                created_on, 
                                updated_by, 
                                updated_on, 
                                dept_cd, 
                                lang_cd, 
                                user_id, 
                                push_on_off, 
                                alarm_off_starttime, 
                                alarm_off_endtime, 
                                sess_timeout_mm, 
                                etc1, 
                                etc2, 
                                etc3
                            )
                            VALUES
                            (
                                ${userConfig.user_id}, 
                                now(), 
                                ${userConfig.user_id}, 
                                now(), 
                                '${userConfig.dept_cd}', 
                                '${userConfig.lang_cd}',  
                                ${userConfig.user_id},
                                '0', 
                                '', 
                                '', 
                                '${userConfig.sess_timeout_mm}',   
                                '${userConfig.etc1}', 
                                '${userConfig.etc2}', 
                                '${userConfig.etc3}'
                            ) RETURNING *
                `;
                
                result = await db.query(poolClient, sql, []);

                await db.transaction_Commit(poolClient);

                if(result.rowCount > 0){
                    Promise.reject(`insert fail`)
                }else{
                    Promise.resolve(result.rows)
                }
            } catch (err) {
                Promise.reject(err)
                await db.transaction_Rollback(poolClient);
            } 
    }

    async updateUserConfigPushOffAndSessTimeOutMm(hosCd : string, id : number, userConfig: any, poolClient: any){
            const schemaNm = await db.getSchemaNm(hosCd);
            let result : any;

            if(userConfig.push_on_off == undefined || userConfig.push_on_off == null || userConfig.push_on_off == ""){
                userConfig.PushOnOff = '0'; // 방해금지 없음
            }
            if(userConfig.sess_timeout_mm == undefined || userConfig.sess_timeout_mm == null || userConfig.sess_timeout_mm == ""){
                userConfig.sessTimeoutMm = '30'; // 30분
            }
        
            try { 
                let sql = `
                    update ${schemaNm}.user_config 
                    SET 
                        push_on_off =${userConfig.push_on_off}, 
                        sess_timeout_mm = ${userConfig.sess_timeout_mm} 
                    where user_id=${id}
                    RETURNING *
                `;

                result = await db.query(poolClient, sql, []); 

                if(result.rowCount > 0){
                    Promise.reject(`updateUserConfigPushOffAndSessTimeOutMm fail`)
                }else{
                    Promise.resolve(result)
                }
            } catch (e) {
                await db.transaction_Rollback(poolClient);
                Promise.reject(`updateUserConfigPushOffAndSessTimeOutMm fail ${e}`)
            } 
    }

    async updateUserConfigAllEtc(hosCd : string, userConfig : any, poolClient: any){
            const schemaNm = await db.getSchemaNm(hosCd);
            let result : any;
        
            try {
                let sql = `
                    update ${schemaNm}.user_config 
                    SET 
                        etc1 = '${userConfig.etc1}', 
                        etc2 = '${userConfig.etc2}',
                        etc3 = '${userConfig.etc2}'
                    where user_id=${userConfig.user_id}
                    RETURNING *
                `;
                    console.log(sql);
                result = await db.query(poolClient, sql, []);  
                if(result.rowCount > 0){
                    Promise.resolve(result)
                }else{
                    Promise.reject(`update user_config fail`)
                }
            } catch (e) {
                Promise.reject(`updateUserConfigAllEtc fail ${e}`)
            } 
    }
    async getUserRoleMenusById(hosCd : string, id : any, poolClient : any){
            const schemaNm = await db.getSchemaNm(hosCd);
    
            let returnObj;
    
            // const poolClient = await db.getPoolClient();

            let result;
    
            try {
                // const sql = 'select c.id as hospital_menu_id from user_role a left join role_menu b on a.role_id = b.role_id join hospital_menu c on b.hospital_menu_id = c.id where a.user_id = ?';
                
                const sql = `select c.id as hospital_menu_id 
                                from ${schemaNm}.user_role a 
                                left join ${schemaNm}.role_menu b on a.role_id = b.role_id 
                                join ${schemaNm}.hospital_menu c on b.hospital_menu_id = c.id 
                                where a.user_id =${id}
                            `;
    
                result = await db.query(poolClient, sql, []);
           
                Promise.resolve(result)
            } catch (err) {
                    Promise.reject(`getUserRoleMenusById fail`)
                    returnObj = {
                        code: 401,
                        message: `error, ${JSON.stringify(err)}`,
                    };
            } 
    }

    async findMenuRoleHospitalMenus(hosCd : string, loginUserId : number, poolClient : any){
            

            let result;

            const schemaNm = await db.getSchemaNm(hosCd);
            
            try {
                const sql = `select c.id as hospital_menu_id 
                            from ${schemaNm}.user_role a 
                            left join ${schemaNm}.role_menu b on a.role_id = b.role_id 
                            join ${schemaNm}.hospital_menu c on b.hospital_menu_id = c.id 
                            where a.user_id =${loginUserId}
                            `;

                result = await db.query(poolClient, sql, []);
                Promise.resolve(result)
            } catch (err) {
                    Promise.reject(`findMenuRoleHospitalMenus fail`)
            } 
    }

    async deleteUserMenus(hosCd : string, userMenuId : any, poolClient : any) {
        return new Promise(async (resolve, reject) => {
            const schemaNm = await db.getSchemaNm(hosCd);

            // const poolClient = await db.getPoolClient();

            let result;

            try {
                const sql = `
                            delete FROM ${schemaNm}.user_menu WHERE id = ${userMenuId} 
                            RETURNING *
                            `;

                result = await db.query(poolClient, sql, []);
                if(result.rowCount > 0){
                    Promise.resolve(result.rows)
                } else {
                    Promise.reject("deleteUserMenus fail")
                }
            } catch (err) {
                reject("deleteUserMenus fail")
            } 
    });
 }

 async getUserMenu(hosCd : string, userId : number, poolClient : any){
        const schemaNm = await db.getSchemaNm(hosCd);

        let result;

        try {
            const sql = `select * from ${schemaNm}.user_menu where user_id=${userId} order by id asc`;
            
            console.log(sql);

            result = await db.query(poolClient, sql, []);

            if(result.rowCount > 0){
                Promise.resolve(result.rows)
            }else{
                Promise.reject(`getUserMenu fail`)
            }
        } catch (err) {
            Promise.reject("getUserMenu fail")
        }
}

async getUserMenusAndMenuType(hosCd : string, userId: number, menuType: string, poolClient : any){
        const schemaNm = await db.getSchemaNm(hosCd);


        console.log(userId, menuType);

        // const poolClient = await db.getPoolClient();
        let result;
            try {
                    const sql = `select * from ${schemaNm}.user_menu where user_id=${userId} and menu_type='${menuType}' order by id asc`;
                    
                    console.log(sql);

                    result = await db.query(poolClient, sql, []);
                    
                    if(result.rowCount > 0){
                        Promise.resolve(result.rows)
                    }else{
                        Promise.reject(`findMenuRoleHospitalMenus fail`)
                    }
                    
                } catch (err) {
                    Promise.reject("getUserMenusAndMenuType fail")
                } 
    }

    async deleteUserRoleAllByUserId(hosCd : string, userId : any, poolClient : any){
            const schemaNm = await db.getSchemaNm(hosCd);
            let result : any;
        
            try {
                let sql = `DELETE FROM ${schemaNm}.user_role WHERE user_id=${userId}
                           RETURNING *`;
                result = await db.query(poolClient, sql, []);
                if(result.rowCount > 0){
                    Promise.resolve(result);
                } else {
                    Promise.reject('deleteUserRoleAllByUserId fail')
                }
            } catch (err) {
                Promise.reject("deleteUserRoleAllByUserId fail")
            } 
     }

     

     async roleDefFindAllById(hosCd : string, roleIds : any, poolClient : any){
            const schemaNm = await db.getSchemaNm(hosCd);

            let result;
            
            let resultBox = [];
            for(let i=0; i<roleIds.length; i++){
                try{
                    let sql = `select * from ${schemaNm}.role_def where id=${roleIds[i].id}`;
                    result = await db.query(poolClient, sql, []);
                    if(result.rowCount !== 1){
                        Promise.reject(`userConfigFindByUserId fail`)
                    }else{
                        resultBox.push(result);
                    }
                    
                } catch (err) {
                    Promise.reject("userService roleDefFindAllById failed!");
                } 
            }
            Promise.resolve(resultBox)
     }

     async roleIdsRemove(hosCd : string, roleId : number, userId : number, poolClient: any){
        
        return new Promise(async (resolve, reject) => {
            const schemaNm = await db.getSchemaNm(hosCd);
            let result; 
            try {
                let sql = `delete from ${schemaNm}.user_role where role_id=${roleId} and user_id=${userId}`;

                result = await db.query(poolClient, sql, []);
                resolve(result);
            } catch (err) {
                reject("roleIdsRemove fail")
            } 
        });
     }

     async saveUserMenu(hosCd : string, rootUserMenu : any, poolClient : any){
        
            const schemaNm = await db.getSchemaNm(hosCd);
            let result;
            // const poolClient = await db.getPoolClient();
        
            try {
                const sql = `INSERT INTO ${schemaNm}.user_menu (
                                created_by, 
                                created_on, 
                                updated_by, 
                                updated_on, 
                                disp_ord, 
                                level, 
                                menu_type, 
                                ovrd_img_url, 
                                ovrd_msg_cd, 
                                ovrd_service_url, 
                                u_menu_id, 
                                up_u_menu_id, 
                                user_id) 
                            VALUES (
                                '${rootUserMenu.user.id}', 
                                now(), 
                                '${rootUserMenu.user.id}', 
                                now(), 
                                1, 
                                ${rootUserMenu.level}, 
                                '${rootUserMenu.menuType}', 
                                '${rootUserMenu.menu.imgUrlCd}', 
                                '${rootUserMenu.menu.nameCd}', 
                                '${rootUserMenu.menu.serviceUrl}', 
                                '${rootUserMenu.menu.id}', 
                                0, 
                                0)`;
            
                result = await db.query(poolClient, sql, []);

                // await console.log(JSON.stringify(result));

                Promise.resolve(result);
            } catch (err) {
                Promise.reject("saveUserMenu fail")
            } 
     }

     async menuFindByNameCd(hosCd : string, menuType : string, poolClient : any){
            const schemaNm = await db.getSchemaNm(hosCd);
            let result : any;
            // let returnObj;

            // const poolClient = await db.getPoolClient();
        
            try {
              const sql = `select * from ${schemaNm}.menu_def where name_cd=${menuType}`;

               result = await db.query(poolClient, sql, []);
                
               Promise.resolve(result.rows)

            } catch (e){
                
                Promise.reject("menuFindByNameCd fail")
            
            }
     }

    //  async findByUserId2(hosCd : string, userId : any, poolClient: any){
    //     // let user : any;
    //     let result : any;
    //     let returnObj;
    //     return new Promise(async (resolve, reject) => {
    //         try {
    //         const sql = `select * from user_mst where id=${userId}`;

    //         result = await db.query(poolClient, sql, []);
    //         console.log(result);
    //         // returnObj = {
    //         //     code: 200,
    //         //     message: 'success',
    //         //     result: result.rows[0],
    //         // };
    //             returnObj = result.rows[0]

    //             if(result.rowCount !== 1){
    //                 reject(`menuFindByNameCd fail`)
    //             }else{
    //                 resolve(returnObj)
    //             }
    //         } catch (err) {
    //             reject(`menuFindByNameCd fail`)
    //         } 
    //     });
    //  }

     async findByMenuId(hosCd : string, menuId : any, poolClient: any){
        let result : any;

            const schemaNm = await db.getSchemaNm(hosCd);
            try {
                const sql = `select * from ${schemaNm}.menu_def where id=${menuId}`;

                result = await db.query(poolClient, sql, []);
            
                console.log(result);

                Promise.resolve(result.rows)
        
            } catch (err) {

                Promise.reject(`findByMenuId fail`)
            
            } 
     }

     async findUserMenuByuserIdBymenuTypeBylevel(hosCd : string, userId : number, menuType : string, poolClient: any){
        // let rootUserMenu : any;
        let result : any;
        // let returnObj;
            const schemaNm = await db.getSchemaNm(hosCd);
        
            try {
                let sql = `select * from ${schemaNm}.user_menu where user_id=${userId} and menu_type= '${menuType}' and level=0`;

                result = await db.query(poolClient, sql, []);

                Promise.resolve(result.rows)

            } catch (err) {
                Promise.reject("findUserMenuByuserIdBymenuTypeBylevel fail")
            } 

     }

     async updateUserConfigTimes(hosCd : string, id : number, userConfig : any, poolClient : any){
            let result : any;
            
            const schemaNm = await db.getSchemaNm(hosCd);
            try {
                let sql = `
                    update ${schemaNm}.user_config 
                    SET 
                        alarm_off_starttime = '${userConfig.alarmOffStarttime}', 
                        alarm_off_endtime = '${userConfig.alarmOffEndtime}',
                        sess_timeout_mm = '${userConfig.sessTimeoutMm}'
                    where user_id=${id}
                    RETURNING *
                `;
                console.log(sql);
                result = await db.query(poolClient, sql, []);  
                if(result.rowCount > 0){
                    Promise.resolve(result)
                }else{
                    Promise.reject(`update user_config fail`)
                }
            } catch (e) {
                Promise.reject(`updateUserConfigAllEtc fail ${e}`)
            } 
     }


    //  async userConfigFindByUserId2(userId : number, poolClient: any){
    //     let result : any;
    
    //     try {
    //     let sql = `select * from user_config where user_id=${userId}`;

    //     result = await db.query(poolClient, sql, []);
    //     console.log(result);
    //     } catch (err) {
            
    //     } finally {
    //         return result.rows[0];
    //     }
    //  }

    //  async saveUserConfig2(userConfig: any, poolClient: any){ 
    //     let result : any;

    //     let failedResult = {
    //         code: 401,
    //         message: 'failed!',
    //      }
    
    //     try {
    //         // console.log(typeof userConfig.user_id);
    //         // //user_id number 변환
    //         // userConfig.user_id = Number(userConfig.user_id); 
    //     let sql = `INSERT INTO user_config
    //                 (
    //                     created_by, 
    //                     created_on, 
    //                     updated_by, 
    //                     updated_on, 
    //                     dept_cd, 
    //                     lang_cd, 
    //                     user_id, 
    //                     push_on_off, 
    //                     alarm_off_starttime, 
    //                     alarm_off_endtime, 
    //                     sess_timeout_mm, 
    //                     etc1, 
    //                     etc2, 
    //                     etc3
    //                 )
    //                 VALUES
    //                 (
    //                     ${userConfig.user_id}, 
    //                     now(), 
    //                     ${userConfig.user_id}, 
    //                     now(), 
    //                     '${userConfig.dept_cd}', 
    //                     '${userConfig.lang_cd}',  
    //                     ${userConfig.user_id},
    //                     '0', 
    //                     '', 
    //                     '', 
    //                     '${userConfig.sess_timeout_mm}',   
    //                     '${userConfig.etc1}', 
    //                     '${userConfig.etc2}', 
    //                     '${userConfig.etc3}'
    //                 ) 
    //     `;
    //     console.log(sql);
    //     result = await db.query(poolClient, sql, []);
    //     console.log(result);
    //     } catch (err) {
    //     return failedResult
    //     } finally {
    //     return result 
    //     }
    //  }

    //  async updateUserConfigAllEtc2(userConfig : any, poolClient: any){
    //     let result : any;
    //     return new Promise(async (resolve, reject) => {
    //         try {
    //             let sql = `
    //                 update user_config 
    //                 SET 
    //                     etc1 = '${userConfig.etc1}', 
    //                     etc2 = '${userConfig.etc2}',
    //                     etc3 = '${userConfig.etc2}'
    //                 where user_id=${userConfig.user_id}
    //             `;
    //             console.log(sql);
    //             result = await db.query(poolClient, sql, []);  
    //             if(result.rowCount !== 1){
    //                 reject(`findByMenuId fail`)
    //             }else{
    //                 resolve(result.rows)
    //             }
    //         } catch (e) {
    //             reject(`findByMenuId fail`) 
    //         } finally {
    //             return result; 
    //         }
    //     });
    //  }

     async userAdminFindByUserId(hosCd : string, userId : number, poolClient: any){

        
            let result : any;

            const schemaNm = await db.getSchemaNm(hosCd);
        
            try {
                let sql = `select * from ${schemaNm}.user_admin where user_id=${userId}`;

                console.log("userAdminFindByUserID query : "+sql);
                result = await db.query(poolClient, sql, []);
                console.log("userAdminFindByUserId result : "+JSON.stringify(result.rows[0]));

                Promise.resolve(result.rows)
            } catch (err) {
                Promise.reject(`findByMenuId fail`)
            } 
     }

     async deleteUserRoles(hosCd : string, userRoles : any, poolClient: any){
        let result : any;
        let successResultBox = [];
        let failedResultBox = [];

        let returnData = {
            successResultBox : [],
            failedResultBox : []
        }
        //일단 resolve, reject 처리하지 않음. 실패하거나, 성공하거나 그 result를 반환함.
        return new Promise(async (resolve, reject) => {

            const schemaNm = await db.getSchemaNm(hosCd);

            let i = 0;
            try {
                for(i; i<userRoles.length; i++){
                   
                        let sql = `delete from ${schemaNm}.user_role where id=${userRoles[i].id}`;
                
                        result = await db.query(poolClient, sql, []);
                        
                        console.log(result);

                        successResultBox.push(result);
                }
            } catch (err) {
                failedResultBox.push(result);
            } 
            resolve(returnData)
        });

        
     }

     async insertUserRoles(hosCd : string, userRole : any, poolClient: any){


            const schemaNm = await db.getSchemaNm(hosCd);

            let result;
        
            try {
                let sql = `INSERT INTO ${schemaNm}.user_role
                            (   
                                created_by, 
                                created_on, 
                                updated_by, 
                                updated_on, 
                                role_id, 
                                user_id
                            )
                            VALUES
                            (
                                ${userRole.user_id}, 
                                now(), 
                                ${userRole.user_id}, 
                                now(), 
                                ${userRole.role_id}, 
                                ${userRole.user_id}
                            ) 
                            RETURNING *
                            `;
        
                result = await db.query(poolClient, sql, []);
                if(result.rowCount > 0){
                    Promise.resolve(result);
                } else {
                    Promise.reject("insertUserRoles faile");
                }
            } catch (err) {
                Promise.reject("insertUserRoles faile");
            }     
        
     }
     async getUserRoles(hosCd : string, id : number, poolClient : any){
        let result : any;
            const schemaNm = await db.getSchemaNm(hosCd);

            try {
                let sql = `select * from ${schemaNm}.user_role where user_id=${id}`;
        
                result = await db.query(poolClient, sql, []);
                console.log(result);
                if(result.rowCount > 0 ){
                    Promise.resolve(result.rows)
                } else {
                    Promise.reject("getUserRoles fail")
                }
                } catch (err) {
                    Promise.reject("getUserRoles fail")
                } 

     }

}

