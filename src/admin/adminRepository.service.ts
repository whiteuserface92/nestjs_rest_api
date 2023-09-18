import { Injectable } from '@nestjs/common';
import * as db from '../db';
import { Logger } from '@nestjs/common';

@Injectable()
export class AdminRepositoryService {
    private readonly logger = new Logger(AdminRepositoryService.name);
    async selectAdminUser(
      poolClient: any,
      hosCd:any,
      adminUserId: number,
      adminLevel: number,
      hospitalCd: string,
      userAccount: string,
      enabled: boolean){
      let schemaNm: any
      try {
        schemaNm = await db.getSchemaNm(hosCd);

        let addSql = ``
        if(adminUserId){
          addSql += ` and ua.user_id = ${adminUserId}`
        }
        if(adminLevel && adminLevel>0){
          addSql += ` and ua.admin_level = ${adminLevel}`
        }
        if(hospitalCd){
          addSql += ` and ua.hospital_cd = '${hospitalCd}'`
        }
        if(userAccount){
          addSql += ` and ua.user_account = '${userAccount}'`
        }
        if(enabled){
          addSql += ` and ua.enabled = ${enabled}`
        }
        const sql = `select ua.user_id as "userId",
                            ua.user_account as "userAccount",
                            ua.admin_level as "adminLevel",
                            ua.admin_status as "adminStatus",
                            ua.applied_on as "appliedOn",
                            ua.approved_on as "approvedOn",
                            ua.user_name as "userName",
                            ua.hospital_cd as "hospitalCd",
                            ua.enabled as "enabled"
                      from ${schemaNm}.user_admin ua
                     where 1=1
                           ${addSql}
                     order by ua.user_id;
                        `;
        const result = await db.query(poolClient, sql, []);

        return Promise.resolve(result.rows)
      } catch (err) {
        return Promise.reject(`[${schemaNm}.user_admin] select error, ${JSON.stringify(err)}`)
      }
  }

  async insertAdminUser(poolClient: any, hosCd:string, saveAdminUser: any){
    let schemaNm
    let encrypt = require('../auth/crypto');
    try {
      console.log(`saveAdminUser`, saveAdminUser)
      if(!saveAdminUser.adminLevel) throw ('adminLevel는 필수값 입니다.')
      if(!saveAdminUser.userName) throw ('userName 필수값 입니다.')
      if (!saveAdminUser.hostpitalCd) throw ('hostpitalCd 필수값 입니다.')
      if (!saveAdminUser.userAccount) throw ('userAccount 필수값 입니다.')
      if (!saveAdminUser.password) throw ('password 필수값 입니다.')

      if (!saveAdminUser.password) {
        saveAdminUser.enabled = false;
      }

      const { secretKey, encryptPassword } = await encrypt.encrypt(saveAdminUser.password); 
      console.log(`secretKey: ${secretKey}`);
      console.log(`encryptPassword: ${encryptPassword}`);

      schemaNm = await db.getSchemaNm(hosCd);
      const sql = `INSERT INTO ${schemaNm}.user_admin (admin_level, admin_status, applied_on, approved_on, user_name, hospital_cd, enabled, password, user_account, secret_key) 
                                    VALUES ( ${saveAdminUser.adminLevel}, 'APPROVED', NOW(), NOW(), '${saveAdminUser.userName}', '${saveAdminUser.hostpitalCd}', ${saveAdminUser.enabled}, '${encryptPassword}', '${saveAdminUser.userAccount}', '${secretKey}')
                                    RETURNING *`;
      const result = await db.query(poolClient, sql, []);

      if(result.rowCount === 1){
        return Promise.resolve(result.rows)
      }else{
        return Promise.reject(`[${schemaNm}.user_admin] INSERT rowCount = 0`)
      }
    } catch (err) {
      return Promise.reject(`[${schemaNm}.user_admin] INSERT error, ${JSON.stringify(err)}`)
    }
  }

  async updateAdminUser(poolClient: any, hosCd:string, modifyAdminUser: any){
    let schemaNm
    let addSql = ``;
    let encrypt = require('../auth/crypto');
    try {
      if(!modifyAdminUser.adminUserId) throw ('userId 필수값 입니다.')
      if(!modifyAdminUser.adminLevel) throw ('adminLevel 필수값 입니다.')
      if(!modifyAdminUser.userName) throw ('userName 필수값 입니다.')
      if(!modifyAdminUser.hostpitalCd) throw ('hostpitalCd 필수값 입니다.')
      // if(!modifyAdminUser.enabled) throw ('enabled 필수값 입니다.')
      
      if (modifyAdminUser.password) {
        const { secretKey, encryptPassword } = await encrypt.encrypt(modifyAdminUser.password); 
        console.log(`secretKey: ${secretKey}`);
        console.log(`encryptPassword: ${encryptPassword}`);

        addSql += `,password = '${encryptPassword}' \n`
        addSql += `,secret_key = '${secretKey}' \n`
      }

      schemaNm = await db.getSchemaNm(hosCd);
      const sql = `UPDATE ${schemaNm}.user_admin 
                      SET 
                    admin_level = ${modifyAdminUser.adminLevel}, 
                    user_name = '${modifyAdminUser.userName}',
                    hospital_cd = '${modifyAdminUser.hostpitalCd}',
                    enabled = ${modifyAdminUser.enabled}
                    ${addSql}
                    WHERE 1=1
                      AND user_id = '${modifyAdminUser.adminUserId}'
                RETURNING *`;
      const result = await db.query(poolClient, sql, []);

      if(result.rowCount === 1){
        return Promise.resolve(result.rows)  
      }else{
        return Promise.reject(`[${schemaNm}.user_admin] UPDATE rowCount = 0`)
      }
    } catch (err) {
      return Promise.reject(`[${schemaNm}.user_admin] UPDATE error, ${JSON.stringify(err)}`)
    }
  }

  async updatePasswordAdminUser(poolClient: any, hosCd: string, resetPwdAdminUser: any) {
    let schemaNm;
    let encrypt = require('../auth/crypto');
    try {
      if(!resetPwdAdminUser.adminUserId) throw ('adminUserId 필수값 입니다.')
      
      const { secretKey, encryptPassword } = await encrypt.encrypt('admin123$'); 
      console.log(`secretKey: ${secretKey}`);
      console.log(`encryptPassword: ${encryptPassword}`);
      console.log(`resetAdminUser : ${JSON.stringify(resetPwdAdminUser)}`)
      schemaNm = await db.getSchemaNm(hosCd);
      const sql = `UPDATE ${schemaNm}.user_admin 
                      SET 
                    password = '${encryptPassword}', 
                    secret_key = '${secretKey}',
                    enabled = true
                    WHERE 1=1
                      AND user_id = ${resetPwdAdminUser.adminUserId}
                RETURNING *`;
      const result = await db.query(poolClient, sql, []);

      if(result.rowCount === 1){
        return Promise.resolve(result.rows)  
      }else{
        return Promise.reject(`[${schemaNm}.user_admin] UPDATE rowCount = 0`)
      }
    } catch (err) {
      return Promise.reject(`[${schemaNm}.user_admin] UPDATE error, ${JSON.stringify(err)}`)
    }
  }

  async selectAdminAccessHistory(
    poolClient: any,
    hosCd:any,
    actionVal: string,
    hospitalCdVal: string,
    ipVal: string,
    targetUserIdVal: number,
    userAccntVal: string,
    startDtVal: string,
    endDtVal: string,
  ) {
    try {
      const schemaNm = await db.getSchemaNm(hosCd);
      const sql = `select id             as "id"                                    
                        , action         as "action"                                          
                        , description    as "description"                                     
                        , hospital_cd    as "hospitalCd"                                      
                        , ip             as "ip"                                              
                        , target_user_id as "targetUserId"                                    
                        , user_accnt     as "userAccnt"                                       
                        , ymd            as "ymd"                                             
                        , created_on     as "createdOn"                                       
                    from ${schemaNm}.admin_access_history                                              
                    where ( case when '${actionVal}' = 'ALL' then 1 = 1                         
                                  else action = '${actionVal}'                                   
                              end                                                            
                          )                                                                 
                      and ( case when '${hospitalCdVal}' = 'ALL' then 1 = 1                     
                                  else hospital_cd = '${hospitalCdVal}'                         
                              end                                                            
                          )                                                                 
                      and ( case when '${ipVal}' = 'ALL' then 1 = 1                             
                                  else ip = '${ipVal}'                                          
                              end                                                            
                          )                                                                 
                      and ( case when '${targetUserIdVal}' = 0 then 1 = 1                       
                                  else target_user_id = '${targetUserIdVal}'                    
                              end                                                            
                          )                                                                 
                      and ( case when '${userAccntVal}' = 'ALL' then 1 = 1                      
                                  else user_accnt = '${userAccntVal}'            
                              end                                                            
                          )                                                                 
                      and ( case when ( '${startDtVal}' = '1900-01-01' or '${endDtVal}' = '1900-01-01' ) then 1 = 1
                                  else ymd between to_date('${startDtVal}', 'YYYY-MM-DD') and to_date('${endDtVal}', 'YYYY-MM-DD')
                              end
                          ) `;
      const result = await db.query(poolClient, sql, []);

      return Promise.resolve(result.rows)
    } catch (err) {
      return Promise.reject(`admin_access_history select error, ${JSON.stringify(err)}`)
    }
  }

  async selectAdminLoginHistory(
    poolClient: any,
    hosCd: string,
    ipVal: string,
    successVal: string,
    userAccntVal: string,
    startDtVal: string,
    endDtVal: string,
  ) {
    try {
      const schemaNm = await db.getSchemaNm(hosCd);
      const sql = `select id         as id                                      
                        , user_accnt as "userAccnt"                                            
                        , success    as success                                              
                        , details    as details                                              
                        , ip         as ip                                                   
                        , ymd        as ymd                                                  
                        , created_on as "createdOn"                                            
                    from ${schemaNm}.admin_login_history                                                
                    where ( case when '${ipVal}' = 'ALL' then 1 = 1                              
                                  else ip = '${ipVal}'                                           
                              end                                                             
                          )                                                                  
                      and ( case when '${successVal}' = 'ALL' then 1 = 1                         
                                  else success = '${successVal}'                                  
                              end                                                             
                          )                                                                  
                      and ( case when '${userAccntVal}' = 'ALL' then 1 = 1                       
                                  else user_accnt = '${userAccntVal}'                             
                              end                                                             
                          )                                                                  
                      and ( case when ( '${startDtVal}' = '1900-01-01' or' ${endDtVal}' = '1900-01-01' ) then 1 = 1               
                                  else ymd between to_date('${startDtVal}', 'YYYY-MM-DD') and to_date('${endDtVal}', 'YYYY-MM-DD') 
                              end                                                             
                          ) `;

      const result = await db.query(poolClient, sql, []);

      return Promise.resolve(result.rows)
    } catch (err) {
      return Promise.reject(`admin_login_history select error, ${JSON.stringify(err)}`)
    }
  }

  async selectAdminPrivacyAccess(
    poolClient: any,
    hosCd: string,
    userAccntVal: string,
    hospitalCdVal: string,
    serviceVal: string,
    ipVal: string,
    actionVal: string,
    startDtVal: string,
    endDtVal: string,
  ) {
    try {
      const schemaNm = await db.getSchemaNm(hosCd);
      const sql = `select id           as id                              
                        , user_accnt   as "userAccnt"                     
                        , hospital_cd  as "hospitalCd"
                        , service      as service
                        , action       as action
                        , description  as description
                        , request      as request
                        , result       as result
                        , ip           as ip
                        , ymd          as ymd
                        , created_on   as "createdOn"
                    from ${schemaNm}.admin_privacy_access
                    where ( case when '${userAccntVal}' = 'ALL' then 1 = 1
                                  else user_accnt = '${userAccntVal}'
                              end
                          )
                      and ( case when '${hospitalCdVal}' = 'ALL' then 1 = 1
                                  else hospital_cd = '${hospitalCdVal}'
                              end
                          )
                      and ( case when '${serviceVal}' = 'ALL' then 1 = 1
                                  else service = '${serviceVal}'
                              end
                          )
                      and ( case when '${ipVal}' = 'ALL' then 1 = 1
                                  else ip = '${ipVal}'
                              end
                          )
                      and ( case when '${actionVal}' = 'ALL' then 1 = 1
                                  else action = '${actionVal}'
                              end
                          )
                      and ( case when ( '${startDtVal}' = '1900-01-01' or '${endDtVal}' = '1900-01-01' ) then 1 = 1
                                  else ymd between to_date('${startDtVal}', 'YYYY-MM-DD') and to_date('${endDtVal}', 'YYYY-MM-DD')
                              end
                          )`;

      const result = await db.query(poolClient, sql, []);

      return Promise.resolve(result.rows)
    } catch (err) {
      return Promise.reject(`admin_privacy_access select error, ${JSON.stringify(err)}`)
    }
  }

  async insertAdminLoginHistory(poolClient: any, AdminLoginHistory: any) {
    const details = AdminLoginHistory.details;
    const userIp = AdminLoginHistory.userIp;
    const success = AdminLoginHistory.success;
    const userAccnt = AdminLoginHistory.userAccnt;

    try {
      if (!details || !userIp || !success || !userAccnt) {
        throw '필수값이 없습니다.';
      }

      const sql = `INSERT INTO admin_login_history (created_on, details, ip, success, user_accnt, ymd) 
                  VALUES (NOW(), '${details}', '${userIp}', '${success}', '${userAccnt}', TO_DATE(TO_CHAR(NOW(), 'YYYY-MM-DD'), 'YYYY-MM-DD') )`;

      const result = await db.query(poolClient, sql, []);

      if (result.rowCount === 1) {
        return Promise.resolve(true)
      } else {
        return Promise.reject(`admin_login_history insert fail [insert rowCount = 1]`)
      }
    } catch (err) {
      return Promise.reject(`error, ${JSON.stringify(err)}`)
    }
  }
}
