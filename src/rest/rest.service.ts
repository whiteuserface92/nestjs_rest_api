// import { Injectable } from '@nestjs/common';
// import * as db from '../db';

// @Injectable()
// export class RestService {
//   async selectData() {
//     const poolClient = await db.getPoolClient();
//     try {
//       const sql = `select * from public.user_mst where my_ci='mplusS'`;
//       const result = await db.query(poolClient, sql, []);

//       return result.rows[0];
//     } catch (err) {
//       console.log(err);
//     } finally {
//       poolClient.release;
//     }
//   }

//   /**
//    * Transaction Example
//    */
//   async exampleTransaction() {
//     const poolClient = await db.getPoolClient();
//     let returnObj;
//     try {
//       await db.transaction_Begin(poolClient); //Transaction Start

//       const sql1 = `insert into plus_dev_origin.test 
//                     (app_id, app_ver_id, file_nm, file_org_nm, file_path)
//                     values (1, 2, 'fileName', 'fileOriginName', 'filePath')`;
//       const result = await db.query(poolClient, sql1, []);

//       //트랜잭션 롤백 처리를 위해 강제로 에러 발생
//       if (result.rowCount === 1) {
//         throw 'test';
//       }

//       const sql2 = `select * from plus_dev_origin.test`;
//       const result2 = await db.query(poolClient, sql2, []);

//       await db.transaction_Commit(poolClient); //위 로직이 정상적이면 commit

//       returnObj = {
//         code: 200,
//         message: 'success',
//         result: result.rows[0],
//       };
//     } catch (err) {
//       await db.transaction_Rollback(poolClient); //중간에 에러가 있다면, rollback
//       returnObj = {
//         code: 401,
//         message: `error, ${JSON.stringify(err)}`,
//       };
//     } finally {
//       poolClient.release; //pool connection 반환
//       return returnObj;
//     }
//   }

//   async getAdminAccessHistory(
//     actionVal: string,
//     hospitalCdVal: string,
//     ipVal: string,
//     targetUserIdVal: number,
//     userAccntVal: string,
//     startDtVal: string,
//     endDtVal: string,
//   ) {
//     let returnObj;
//     const poolClient = await db.getPoolClient();
//     try {
//       const sql = `select id             as id                                    
//                         , action         as action                                          
//                         , description    as description                                     
//                         , hospital_cd    as hospitalCd                                      
//                         , ip             as ip                                              
//                         , target_user_id as targetUserId                                    
//                         , user_accnt     as userAccnt                                       
//                         , ymd            as ymd                                             
//                         , created_on     as createdOn                                       
//                      from admin_access_history                                              
//                     where ( case when '${actionVal}' = 'ALL' then 1 = 1                         
//                                   else action = '${actionVal}'                                   
//                               end                                                            
//                           )                                                                 
//                       and ( case when '${hospitalCdVal}' = 'ALL' then 1 = 1                     
//                                   else hospital_cd = '${hospitalCdVal}'                         
//                               end                                                            
//                           )                                                                 
//                       and ( case when '${ipVal}' = 'ALL' then 1 = 1                             
//                                   else ip = '${ipVal}'                                          
//                               end                                                            
//                           )                                                                 
//                       and ( case when '${targetUserIdVal}' = 0 then 1 = 1                       
//                                   else target_user_id = '${targetUserIdVal}'                    
//                               end                                                            
//                           )                                                                 
//                       and ( case when '${userAccntVal}' = 'ALL' then 1 = 1                      
//                                   else user_accnt = '${userAccntVal}'            
//                               end                                                            
//                           )                                                                 
//                       and ( case when ( '${startDtVal}' = '1900-01-01' or '${endDtVal}' = '1900-01-01' ) then 1 = 1
//                                   else ymd between to_date('${startDtVal}', 'YYYY-MM-DD') and to_date('${endDtVal}', 'YYYY-MM-DD')
//                               end
//                           ) `;
//       const result = await db.query(poolClient, sql, []);

//       returnObj = {
//         code: 200,
//         message: 'success',
//         result: result.rows[0] ? result.rows[0] : [],
//       };
//     } catch (err) {
//       returnObj = {
//         code: 401,
//         message: `error, ${JSON.stringify(err)}`,
//       };
//     } finally {
//       poolClient.release;
//       return returnObj;
//     }
//   }

//   async getAdminLoginHistory(
//     ipVal: string,
//     successVal: string,
//     userAccntVal: string,
//     startDtVal: string,
//     endDtVal: string,
//   ) {
//     let returnObj;
//     const poolClient = await db.getPoolClient();
//     try {
//       const sql = `select id         as id                                      
//                         , user_accnt as userAccnt                                            
//                         , success    as success                                              
//                         , details    as details                                              
//                         , ip         as ip                                                   
//                         , ymd        as ymd                                                  
//                         , created_on as createdOn                                            
//                      from admin_login_history                                                
//                     where ( case when '${ipVal}' = 'ALL' then 1 = 1                              
//                                   else ip = '${ipVal}'                                           
//                               end                                                             
//                           )                                                                  
//                       and ( case when '${successVal}' = 'ALL' then 1 = 1                         
//                                   else success = '${successVal}'                                  
//                               end                                                             
//                           )                                                                  
//                       and ( case when '${userAccntVal}' = 'ALL' then 1 = 1                       
//                                   else user_accnt = '${userAccntVal}'                             
//                               end                                                             
//                           )                                                                  
//                       and ( case when ( '${startDtVal}' = '1900-01-01' or' ${endDtVal}' = '1900-01-01' ) then 1 = 1               
//                                   else ymd between to_date('${startDtVal}', 'YYYY-MM-DD') and to_date('${endDtVal}', 'YYYY-MM-DD') 
//                               end                                                             
//                           ) `;

//       const result = await db.query(poolClient, sql, []);

//       returnObj = {
//         code: 200,
//         message: 'success',
//         result: result.rows[0] ? result.rows[0] : [],
//       };
//     } catch (err) {
//       returnObj = {
//         code: 401,
//         message: `error, ${JSON.stringify(err)}`,
//       };
//     } finally {
//       poolClient.release;
//       return returnObj;
//     }
//   }

//   async getAdminPrivacyAccess(
//     userAccntVal: string,
//     hospitalCdVal: string,
//     serviceVal: string,
//     ipVal: string,
//     actionVal: string,
//     startDtVal: string,
//     endDtVal: string,
//   ) {
//     let returnObj;
//     const poolClient = await db.getPoolClient();
//     try {
//       const sql = `select id           as id                              
//                         , user_accnt   as userAccnt                     
//                         , hospital_cd  as hospitalCd
//                         , service      as service
//                         , action       as action
//                         , description  as description
//                         , request      as request
//                         , result       as result
//                         , ip           as ip
//                         , ymd          as ymd
//                         , created_on   as createdOn
//                      from admin_privacy_access
//                     where ( case when '${userAccntVal}' = 'ALL' then 1 = 1
//                                   else user_accnt = '${userAccntVal}'
//                               end
//                           )
//                       and ( case when '${hospitalCdVal}' = 'ALL' then 1 = 1
//                                   else hospital_cd = '${hospitalCdVal}'
//                               end
//                           )
//                       and ( case when '${serviceVal}' = 'ALL' then 1 = 1
//                                   else service = '${serviceVal}'
//                               end
//                           )
//                       and ( case when '${ipVal}' = 'ALL' then 1 = 1
//                                   else ip = '${ipVal}'
//                               end
//                           )
//                       and ( case when '${actionVal}' = 'ALL' then 1 = 1
//                                   else action = '${actionVal}'
//                               end
//                           )
//                       and ( case when ( '${startDtVal}' = '1900-01-01' or '${endDtVal}' = '1900-01-01' ) then 1 = 1
//                                   else ymd between to_date('${startDtVal}', 'YYYY-MM-DD') and to_date('${endDtVal}', 'YYYY-MM-DD')
//                               end
//                           )`;

//       const result = await db.query(poolClient, sql, []);

//       returnObj = {
//         code: 200,
//         message: 'success',
//         result: result.rows[0] ? result.rows[0] : [],
//       };
//     } catch (err) {
//       returnObj = {
//         code: 401,
//         message: `error, ${JSON.stringify(err)}`,
//       };
//     } finally {
//       poolClient.release;
//       return returnObj;
//     }
//   }

//   async insertLoginHistory(AdminLoginHistory: any) {
//     const details = AdminLoginHistory.details;
//     const userIp = AdminLoginHistory.userIp;
//     const success = AdminLoginHistory.success;
//     const userAccnt = AdminLoginHistory.userAccnt;
//     let returnObj;

//     const poolClient = await db.getPoolClient();
//     try {
//       if (!details || !userIp || !success || !userAccnt) {
//         throw '필수값이 없습니다.';
//       }

//       const sql = `INSERT INTO admin_login_history (created_on, details, ip, success, user_accnt, ymd) 
//                    VALUES (NOW(), '${details}', '${userIp}', '${success}', '${userAccnt}', TO_DATE(TO_CHAR(NOW(), 'YYYY-MM-DD'), 'YYYY-MM-DD') )`;

//       const result = await db.query(poolClient, sql, []);

//       if (result.rowCount === 1) {
//         returnObj = {
//           code: 200,
//           message: 'success',
//         };
//       } else {
//         returnObj = {
//           code: 401,
//           message: 'fail',
//         };
//       }
//     } catch (err) {
//       returnObj = {
//         code: 401,
//         message: `error, ${JSON.stringify(err)}`,
//       };
//     } finally {
//       poolClient.release;
//       return returnObj;
//     }
//   }

//   async appFindAllByKeyword(hospitalId?: number, keyword?: string) {
//     let returnObj;

//     const poolClient = await db.getPoolClient();
//     try {
//       let addSQL = ``;
//       if (keyword) {
//         addSQL += ` AND a.app_nm LIKE CONCAT('%','${keyword}','%')`;
//       }
//       if (hospitalId) {
//         addSQL = ` AND a.hospital_id = ${hospitalId}`;
//       }
//       const sql = `select a.id as appId ,
//                           a.app_nm as appNm , 
//                           a.app_state as appState  , 
//                           COALESCE((select max(r.version_cd) from app_version r where r.app_platform_id = c.id),a.app_ver) as appVer ,
//                           a.multi_enabled as multiEnabled  ,
//                           a.hospital_id as hospitalId  ,
//                           a.fcm_key as fcmKey ,
//                           a.fido_api_key as fidoApiKey ,
//                           b.hospital_nm as hospitalNm  ,
//                           b.hospital_cd as hospitalCd  ,
//                           b.hospital_nm_cd as hospitalNmCd  ,
//                           a.prod_cd as prodCd ,
//                           c.id as appPlatformId ,
//                           c.platform_type as platformType ,
//                           c.deploy_type as deployType ,
//                           c.store_url as storeUrl ,
//                           c.hash_key as hashKey ,
//                           c.pkg_nm as pkgNm ,
//                           COALESCE(c.ios_processed, false) as iosProcessed ,
//                           a.created_by as createdBy  ,
//                           a.created_on as createdOn  ,
//                           a.updated_by as updatedBy  ,
//                           a.updated_on as updatedOn
//                      from app_mst a
//           left outer join hospital_mst b on a.hospital_id = b.id
//           left outer join app_platform c on a.id = c.app_id
//                     where 1=1 
//                     ${addSQL} `;

//       const result = await db.query(poolClient, sql, []);

//       returnObj = {
//         code: 200,
//         message: 'success',
//         result: result.rows[0] ? result.rows[0] : [],
//       };
//     } catch (err) {
//       returnObj = {
//         code: 401,
//         message: `error, ${JSON.stringify(err)}`,
//       };
//     } finally {
//       poolClient.release;
//       return returnObj;
//     }
//   }

//   async getAppsInfo(appId: string, appPlatformId: string) {
//     let returnObj;

//     const poolClient = await db.getPoolClient();
//     try {
//       let addSQL = ``;
//       console.log(appId);
//       console.log(appPlatformId);
//       if (appId) {
//         addSQL += ` AND a.id = '${appId}'`;
//       }
//       if (appPlatformId) {
//         addSQL += ` AND c.id = '${appPlatformId}'`;
//       }
//       const sql = `select a.id as appId ,
//                           a.app_nm as appNm , 
//                           a.app_state as appState  , 
//                           COALESCE((select max(r.version_cd) from app_version r where r.app_platform_id = c.id),a.app_ver) as appVer ,
//                           a.multi_enabled as multiEnabled  ,
//                           a.hospital_id as hospitalId  ,
//                           a.fcm_key as fcmKey ,
//                           a.fido_api_key as fidoApiKey ,
//                           b.hospital_nm as hospitalNm  ,
//                           b.hospital_cd as hospitalCd  ,
//                           b.hospital_nm_cd as hospitalNmCd  ,
//                           a.prod_cd as prodCd ,
//                           c.id as appPlatformId ,
//                           c.platform_type as platformType ,
//                           c.deploy_type as deployType ,
//                           c.store_url as storeUrl ,
//                           c.hash_key as hashKey ,
//                           c.pkg_nm as pkgNm ,
//                           COALESCE(c.ios_processed, false) as iosProcessed ,
//                           a.created_by as createdBy  ,
//                           a.created_on as createdOn  ,
//                           a.updated_by as updatedBy  ,
//                           a.updated_on as updatedOn
//                      from app_mst a
//           left outer join hospital_mst b on a.hospital_id = b.id
//           left outer join app_platform c on a.id = c.app_id
//                     where 1=1 
//                     ${addSQL} `;
//       const result = await db.query(poolClient, sql, []);

//       returnObj = {
//         code: 200,
//         message: 'success',
//         result: result.rows[0] ? result.rows[0] : [],
//       };
//     } catch (err) {
//       returnObj = {
//         code: 401,
//         message: `error, ${JSON.stringify(err)}`,
//       };
//     } finally {
//       poolClient.release;
//       return returnObj;
//     }
//   }

//   async saveAppMst(appInfo: any) {
//     let returnObj;
//     const poolClient = await db.getPoolClient();
//     try {
//       if (!appInfo.adminUserId) {
//         throw '필수값 [adminUserId]이 없습니다.';
//       }
//       let sql = ``;
//       if (!appInfo.appId) {
//         //등록
//         sql = `insert into app_mst (created_by , created_on ,app_nm, app_state, app_ver, fcm_key, fido_api_key, multi_enabled, prod_cd, hospital_id) 
//               values (${appInfo.adminUserId}, NOW(), '${appInfo.appNm}', '${appInfo.appState}', '${appInfo.appVer}', '${appInfo.fcmKey}', '${appInfo.fidoApiKey}', ${appInfo.multiEnabled}, '${appInfo.prodCd}', ${appInfo.hospitalId});`;
//       } else {
//         //수정
//         let addSQL = ``;
//         if (appInfo.appNm) {
//           addSQL += `app_nm = '${appInfo.appNm}' `;
//         }
//         if (appInfo.appState) {
//           addSQL += `, app_state = '${appInfo.appState}'`;
//         }
//         if (appInfo.appVer) {
//           addSQL += `, app_ver = '${appInfo.appVer}'`;
//         }
//         if (appInfo.fcmKey) {
//           addSQL += `, fcm_key = '${appInfo.fcmKey}'`;
//         }
//         if (appInfo.fidoApiKey) {
//           addSQL += `, fido_api_key = '${appInfo.fidoApiKey}'`;
//         }
//         if (appInfo.multiEnabled) {
//           addSQL += `, multi_enabled = '${appInfo.multiEnabled}'`;
//         }
//         if (appInfo.prodCd) {
//           addSQL += `, prod_cd = '${appInfo.prodCd}'`;
//         }
//         if (appInfo.hospitalId) {
//           addSQL += `, hospital_id = '${appInfo.hospitalId}'`;
//         }
//         sql = `update app_mst
//                   set 
//                    ${addSQL}
//                     , updated_by = ${appInfo.adminUserId}
//                     , updated_on = NOW()
//                 where 
//                    id = ${appInfo.appId}`;
//       }
//       const result = await db.query(poolClient, sql, []);

//       if (result.rowCount === 1) {
//         returnObj = {
//           code: 200,
//           message: 'success',
//         };
//       } else {
//         returnObj = {
//           code: 401,
//           message: 'fail',
//         };
//       }
//     } catch (err) {
//       returnObj = {
//         code: 401,
//         message: `error, ${JSON.stringify(err)}`,
//       };
//     } finally {
//       poolClient.release;
//       return returnObj;
//     }
//   }
// }
