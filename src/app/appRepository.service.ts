import { Injectable } from '@nestjs/common';
import * as db from '../db';
@Injectable()
export class AppRepositoryService {

  async selectAppMstInfo(hosCd : string, poolClient: any, hospitalId?: number, keyword?: string){

    let schemaNm: string;

    console.log('keyword : '+keyword);

    console.log('hospitalId : '+hospitalId);
        
    try {
       let addSQL = '';

        //쿼리 조건문 
        
        if (keyword) {
          addSQL += ` AND a.app_nm LIKE CONCAT('%','${keyword}','%')`;
        }
        if (hospitalId) {
          addSQL += ` AND a.hospital_id = ${hospitalId}`;
        }
                
        schemaNm = await db.getSchemaNm(hosCd);
               const sql = `select a.id as "appId" ,
                            a.app_nm as "appNm" , 
                            a.app_state as "appState"  , 
                            COALESCE((select max(r.version_cd) from app_version r where r.app_platform_id = c.id),a.app_ver) as "appVer" ,
                            a.multi_enabled as "multiEnabled"  ,
                            a.hospital_id as "hospitalId"  ,
                            a.fcm_key as "fcmKey" ,
                            a.fido_api_key as "fidoApiKey" ,
                            b.hospital_nm as "hospitalNm"  ,
                            b.hospital_cd as "hospitalCd"  ,
                            a.prod_cd as "prodCd" ,
                            c.id as "appPlatformId" ,
                            c.platform_type as "platformType" ,
                            c.deploy_type as "deployType" ,
                            c.store_url as "storeUrl" ,
                            c.hash_key as "hashKey" ,
                            c.pkg_nm as "pkgNm" ,
                            COALESCE(c.ios_processed, false) as "iosProcessed" ,
                            a.created_by as "createdBy"  ,
                            a.created_on as "createdOn"  ,
                            a.updated_by as "updatedBy"  ,
                            a.updated_on as "updatedOn"
                            from ${schemaNm}.app_mst a
                            left outer join hospital_mst b on a.hospital_id = b.id
                            left outer join app_platform c on a.id = c.app_id
                            where 1=1 
                            ${addSQL} `;
                            console.log(sql);
        const result = await db.query(poolClient, sql, []);

        return Promise.resolve(result.rows)
    } catch (err) {
        return Promise.reject(`[${schemaNm}.app_mst] selectAppMstInfo err, ${err}`)
    } 

}
  // 기존로직 주석처리 (김동인 프로) -- 양식 통일화
  // async selectAppMstInfo(poolClient: any, hospitalId?: number, keyword?: string) {
  //   return new Promise(async (resolve, reject) => {
  //     try {
  //       let addSQL = ``;
  //       if (keyword) {
  //         addSQL += ` AND a.app_nm LIKE CONCAT('%','${keyword}','%')`;
  //       }
  //       if (hospitalId) {
  //         addSQL = ` AND a.hospital_id = ${hospitalId}`;
  //       }
  //       const sql = `select a.id as "appId" ,
  //                           a.app_nm as "appNm" , 
  //                           a.app_state as "appState"  , 
  //                           COALESCE((select max(r.version_cd) from app_version r where r.app_platform_id = c.id),a.app_ver) as "appVer" ,
  //                           a.multi_enabled as "multiEnabled"  ,
  //                           a.hospital_id as "hospitalId"  ,
  //                           a.fcm_key as "fcmKey" ,
  //                           a.fido_api_key as "fidoApiKey" ,
  //                           b.hospital_nm as "hospitalNm"  ,
  //                           b.hospital_cd as "hospitalCd"  ,
  //                           a.prod_cd as "prodCd" ,
  //                           c.id as "appPlatformId" ,
  //                           c.platform_type as "platformType" ,
  //                           c.deploy_type as "deployType" ,
  //                           c.store_url as "storeUrl" ,
  //                           c.hash_key as "hashKey" ,
  //                           c.pkg_nm as "pkgNm" ,
  //                           COALESCE(c.ios_processed, false) as "iosProcessed" ,
  //                           a.created_by as "createdBy"  ,
  //                           a.created_on as "createdOn"  ,
  //                           a.updated_by as "updatedBy"  ,
  //                           a.updated_on as "updatedOn"
  //                     from app_mst a
  //           left outer join hospital_mst b on a.hospital_id = b.id
  //           left outer join app_platform c on a.id = c.app_id
  //                     where 1=1 
  //                     ${addSQL} `;
        

  //       const result = await db.query(poolClient, sql, []);

  //       resolve(result.rows)
  //     } catch (err) {
  //       reject(`selectAppMstInfo error, ${JSON.stringify(err)}`)
  //     }
  //   });
  // }

  async selectAppsInfo(hosCd: string, poolClient: any,  appId: string, appPlatformId: string){

    let schemaNm: string;
        
    try {
        let addSql: string = ``;

        //정렬문

        // let orderByQuery = ` ORDER BY id ASC`; 

        //쿼리 조건문 
        let addSQL = ``;
        if (appId) {
          addSQL += ` AND a.id = '${appId}'`;
        }
        if (appPlatformId) {
          addSQL += ` AND c.id = '${appPlatformId}'`;
        }

        schemaNm = await db.getSchemaNm(hosCd);
        const sql = `select a.id as "appId" ,
                            a.app_nm as "appNm" , 
                            a.app_state as "appState"  , 
                            COALESCE((select max(r.version_cd) from app_version r where r.app_platform_id = c.id),a.app_ver) as "appVer" ,
                            a.multi_enabled as "multiEnabled"  ,
                            a.hospital_id as "hospitalId"  ,
                            a.fcm_key as "fcmKey" ,
                            a.fido_api_key as "fidoApiKey" ,
                            b.hospital_nm as "hospitalNm"  ,
                            b.hospital_cd as "hospitalCd"  ,
                            a.prod_cd as "prodCd" ,
                            c.id as "appPlatformId" ,
                            c.platform_type as "platformType" ,
                            c.deploy_type as "deployType" ,
                            c.store_url as "storeUrl" ,
                            c.hash_key as "hashKey" ,
                            c.pkg_nm as "pkgNm" ,
                            COALESCE(c.ios_processed, false) as "iosProcessed" ,
                            a.created_by as "createdBy"  ,
                            a.created_on as "createdOn"  ,
                            a.updated_by as "updatedBy"  ,
                            a.updated_on as "updatedOn"
                      from ${schemaNm}.app_mst a
            left outer join hospital_mst b on a.hospital_id = b.id
            left outer join app_platform c on a.id = c.app_id
                      where 1=1 
                      ${addSQL} `;
        const result = await db.query(poolClient, sql, []);

        return Promise.resolve(result.rows)
    } catch (err) {
        return Promise.reject(`[${schemaNm}.app_mst] selectAppsInfo err, ${err}`)
    } 

}
  // 기존로직 - 주석처리 (김동인프로) -- 양식 통일화
  // async selectAppsInfo(poolClient: any,  appId: string, appPlatformId: string) {
  //   let schemaNm: string
  //     console.log(hosCd, appId, appId, appPlatformId);
  //     try {
  //       schemaNm = await db.getSchemaNm(hosCd);

  //       let addSQL = ``;
  //       if (appId) {
  //         addSQL += ` AND a.id = '${appId}'`;
  //       }
  //       if (appPlatformId) {
  //         addSQL += ` AND c.id = '${appPlatformId}'`;
  //       }
  //       const sql = `select a.id as "appId" ,
  //                           a.app_nm as "appNm" , 
  //                           a.app_state as "appState"  , 
  //                           COALESCE((select max(r.version_cd) from app_version r where r.app_platform_id = c.id),a.app_ver) as "appVer" ,
  //                           a.multi_enabled as "multiEnabled"  ,
  //                           a.hospital_id as "hospitalId"  ,
  //                           a.fcm_key as "fcmKey" ,
  //                           a.fido_api_key as "fidoApiKey" ,
  //                           b.hospital_nm as "hospitalNm"  ,
  //                           b.hospital_cd as "hospitalCd"  ,
  //                           a.prod_cd as "prodCd" ,
  //                           c.id as "appPlatformId" ,
  //                           c.platform_type as "platformType" ,
  //                           c.deploy_type as "deployType" ,
  //                           c.store_url as "storeUrl" ,
  //                           c.hash_key as "hashKey" ,
  //                           c.pkg_nm as "pkgNm" ,
  //                           COALESCE(c.ios_processed, false) as "iosProcessed" ,
  //                           a.created_by as "createdBy"  ,
  //                           a.created_on as "createdOn"  ,
  //                           a.updated_by as "updatedBy"  ,
  //                           a.updated_on as "updatedOn"
  //                     from ${schemaNm}.app_mst a
  //           left outer join hospital_mst b on a.hospital_id = b.id
  //           left outer join app_platform c on a.id = c.app_id
  //                     where 1=1 
  //                     ${addSQL} `;
  //       console.log(sql);
  //       const result = await db.query(poolClient, sql, []);
  //       console.log(result);
  //       Promise.resolve(result.rows)
  //     } catch (err) {
  //       Promise.reject(`getAppsInfo error, ${JSON.stringify(err)}`)
  //     }
  // }

  async insertAppMst(hosCd : string, poolClient: any, appInfo: any){

    let schemaNm: string;
        
    try {
      schemaNm = await db.getSchemaNm(hosCd);
      if (!appInfo.adminUserId) {
                throw '필수값 [adminUserId]이 없습니다.';
              }
              let sql = ``;
              if (!appInfo.appId) {
                //등록
                sql = `insert into app_mst (created_by , created_on ,app_nm, app_state, app_ver, fcm_key, fido_api_key, multi_enabled, prod_cd, hospital_id) 
                      values (${appInfo.adminUserId}, NOW(), '${appInfo.appNm}', '${appInfo.appState}', '${appInfo.appVer}', '${appInfo.fcmKey}', '${appInfo.fidoApiKey}', ${appInfo.multiEnabled}, '${appInfo.prodCd}', ${appInfo.hospitalId});`;
              } else {
                //수정
                let addSQL = ``;
                if (appInfo.appNm) {
                  addSQL += `app_nm = '${appInfo.appNm}' `;
                }
                if (appInfo.appState) {
                  addSQL += `, app_state = '${appInfo.appState}'`;
                }
                if (appInfo.appVer) {
                  addSQL += `, app_ver = '${appInfo.appVer}'`;
                }
                if (appInfo.fcmKey) {
                  addSQL += `, fcm_key = '${appInfo.fcmKey}'`;
                }
                if (appInfo.fidoApiKey) {
                  addSQL += `, fido_api_key = '${appInfo.fidoApiKey}'`;
                }
                if (appInfo.multiEnabled) {
                  addSQL += `, multi_enabled = '${appInfo.multiEnabled}'`;
                }
                if (appInfo.prodCd) {
                  addSQL += `, prod_cd = '${appInfo.prodCd}'`;
                }
                if (appInfo.hospitalId) {
                  addSQL += `, hospital_id = '${appInfo.hospitalId}'`;
                }
                sql = `update ${schemaNm}.app_mst
                          set 
                          ${addSQL}
                            , updated_by = ${appInfo.adminUserId}
                            , updated_on = NOW()
                        where 
                          id = ${appInfo.appId}
                          RETURNING * `;
              }
              console.log(sql);
        const result = await db.query(poolClient, sql, []);

        return Promise.resolve(result.rows)
    } catch (err) {
        return Promise.reject(`[${schemaNm}.app_mst] insertAppMst err, ${err}`)
    } 

  }
  // 기존로직 - 주석처리 (김동인프로) -- 양식 통일화
  // async insertAppMst(poolClient: any, appInfo: any) {
  //   return new Promise(async (resolve, reject) => {
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
  //                   ${addSQL}
  //                     , updated_by = ${appInfo.adminUserId}
  //                     , updated_on = NOW()
  //                 where 
  //                   id = ${appInfo.appId}`;
  //       }
  //       const result = await db.query(poolClient, sql, []);

  //       if (result.rowCount === 1) {
  //         resolve(true)
  //       } else {
  //         reject(`insertAppMst error [insert rowCount = 1]`)
  //       }
  //     } catch (err) {
  //       reject(`insertAppMst error, ${JSON.stringify(err)}`)
  //     } 
  //   });
  // }

  async selectAppLog(hosCd: string, poolClient: any, keyword: string, startDt: string, endDt: string){

    let schemaNm: string;
        
    try {
        schemaNm = await db.getSchemaNm(hosCd);
        const sql = `SELECT a.id
                          , a.created_on as "createdOn"
                          , a.elapsed_time as "elapsedTime"
                          , a.error_enabled as "errorEnabled"
                          , a.prod_cd as "prodCd"
                          , a.req_data as "reqData"
                          , a.req_header as "reqHeader"
                          , a.req_url as "reqUrl"
                          , a.resp_data as "respData"
                          , a.server_ip as "serverIp"
                          , a.server_port as "serverPort"
                          , a.service_nm as "serviceNm"
                          , a.trace_id as "traceId"
                          , a.user_accnt as "userAccnt"
                          , a.user_id as "userId"
                          , a.log_cd as "logCd"
                          , a.user_ip as "userIp"
                      FROM ${schemaNm}.app_log a
                      WHERE 1=1
                        AND a.created_on BETWEEN TO_TIMESTAMP('${startDt} 00:00:00', 'YYYY-MM-DD HH24:MI:SS.MS') AND TO_TIMESTAMP('${endDt} 23:59:59', 'YYYY-MM-DD HH24:MI:SS.MS')
                        AND (
                            ( a.req_data like CONCAT('%','${keyword}','%') OR '${keyword}' = '' )
                              OR  ( a.req_url like CONCAT('%','${keyword}','%') OR '${keyword}' = '' )
                              OR  ( a.resp_data like CONCAT('%','${keyword}','%') OR '${keyword}' = '' )
                              OR  ( a.user_ip like CONCAT('%','${keyword}','%') OR '${keyword}' = '' )
                              OR  ( a.user_accnt like CONCAT('%','${keyword}','%') OR '${keyword}' = '' )
                            )
                      ORDER BY a.created_on
                      LIMIT 100`; //성능이슈로 임시로 LIMIT 100 적용
        const result = await db.query(poolClient, sql, []);

        return Promise.resolve(result.rows)
    } catch (err) {
        return Promise.reject(`[${schemaNm}.app_log] selectAppLog err, ${err}`)
    } 
  }
  // 기존로직 - 주석처리 (김동인프로) -- 양식 통일화
  // async selectAppLog(poolClient: any, keyword: string, startDt: string, endDt: string) {
  //   return new Promise(async (resolve, reject) => {
  //     try {
  //       const sql = `SELECT a.id
  //                         , a.created_on as "createdOn"
  //                         , a.elapsed_time as "elapsedTime"
  //                         , a.error_enabled as "errorEnabled"
  //                         , a.prod_cd as "prodCd"
  //                         , a.req_data as "reqData"
  //                         , a.req_header as "reqHeader"
  //                         , a.req_url as "reqUrl"
  //                         , a.resp_data as "respData"
  //                         , a.server_ip as "serverIp"
  //                         , a.server_port as "serverPort"
  //                         , a.service_nm as "serviceNm"
  //                         , a.trace_id as "traceId"
  //                         , a.user_accnt as "userAccnt"
  //                         , a.user_id as "userId"
  //                         , a.log_cd as "logCd"
  //                         , a.user_ip as "userIp"
  //                     FROM app_log a
  //                     WHERE 1=1
  //                       AND a.created_on BETWEEN TO_TIMESTAMP('${startDt} 00:00:00', 'YYYY-MM-DD HH24:MI:SS.MS') AND TO_TIMESTAMP('${endDt} 23:59:59', 'YYYY-MM-DD HH24:MI:SS.MS')
  //                       AND (
  //                           ( a.req_data like CONCAT('%','${keyword}','%') OR '${keyword}' = '' )
  //                             OR  ( a.req_url like CONCAT('%','${keyword}','%') OR '${keyword}' = '' )
  //                             OR  ( a.resp_data like CONCAT('%','${keyword}','%') OR '${keyword}' = '' )
  //                             OR  ( a.user_ip like CONCAT('%','${keyword}','%') OR '${keyword}' = '' )
  //                             OR  ( a.user_accnt like CONCAT('%','${keyword}','%') OR '${keyword}' = '' )
  //                           )
  //                     ORDER BY a.created_on
  //                     LIMIT 100`; //성능이슈로 임시로 LIMIT 100 적용
  //       const result = await db.query(poolClient, sql, []);

  //       resolve(result.rows)
  //     } catch (err) {
  //       reject(`selectAppLog select error, ${JSON.stringify(err)}`)
  //     }
  //   });
  // }

  async selectAppMenuLog(hosCd : string, poolClient: any, keyword: string, startDt: string, endDt: string){

    let schemaNm: string;
        
    try {
        schemaNm = await db.getSchemaNm(hosCd);
        const sql = `
            SELECT a.id 
                  , a.user_agent as "userAgent"
                  , a.device_type as "deviceType"
                  , a.user_ip as "userIp"
                  , a.menu_id as "menuId"
                  , a.hospital_menu_id as "hospitalMenuId"
                  , a.user_accnt as "userAccnt"
                  , a.app_id as "appId"
                  , a.device_uuid as "deviceUuid"
                  , a.user_id as "userId"
                  , a.patient_no as "patientNo"
                  , a.hospital_id as "hospitalId"
                  , a.hash_key as "hashKey"
                  , a.error_cd as "errorCd"
                  , a.error_msg as "errorMsg"
                  , a.log_type as "logType"
                  , a.trans_id as "transId"
                  , a.dest_url as "destUrl"
                  , a.created_on as "createdOn"
                  , b.name_cd as "nameCd"
              FROM app_menu_log a
            LEFT JOIN menu_def b
                ON a.menu_id = b.id
              WHERE 1=1 
                AND a.created_on BETWEEN TO_TIMESTAMP('${startDt} 00:00:00', 'YYYY-MM-DD HH24:MI:SS.MS') AND TO_TIMESTAMP('${endDt} 23:59:59', 'YYYY-MM-DD HH24:MI:SS.MS')
                AND (
                      ( a.user_accnt  LIKE CONCAT('%','${keyword}','%') OR '${keyword}' = '' )
                        OR  ( a.error_cd  LIKE CONCAT('%','${keyword}','%') OR '${keyword}' = '' )
                        OR  ( a.error_msg  LIKE CONCAT('%','${keyword}','%') OR '${keyword}' = '' )
                        OR  ( b.name_cd  LIKE CONCAT('%','${keyword}','%') OR '${keyword}' = '' )
                    )
              ORDER BY a.created_on
              LIMIT 100`; //성능이슈로 임시로 LIMIT 100 적용
        const result = await db.query(poolClient, sql, []);

        return Promise.resolve(result.rows)
    } catch (err) {
        return Promise.reject(`[${schemaNm}.app_menu_log] selectAppMenuLog err, ${err}`)
    } 
  }

  // 기존로직 - 주석처리 (김동인프로) -- 양식 통일화
  // async selectAppMenuLog(poolClient: any, keyword: string, startDt: string, endDt: string) {
  //   return new Promise(async (resolve, reject) => {
  //     try {
  //       const sql = `
  //     SELECT a.id 
  //           , a.user_agent as "userAgent"
  //           , a.device_type as "deviceType"
  //           , a.user_ip as "userIp"
  //           , a.menu_id as "menuId"
  //           , a.hospital_menu_id as "hospitalMenuId"
  //           , a.user_accnt as "userAccnt"
  //           , a.app_id as "appId"
  //           , a.device_uuid as "deviceUuid"
  //           , a.user_id as "userId"
  //           , a.patient_no as "patientNo"
  //           , a.hospital_id as "hospitalId"
  //           , a.hash_key as "hashKey"
  //           , a.error_cd as "errorCd"
  //           , a.error_msg as "errorMsg"
  //           , a.log_type as "logType"
  //           , a.trans_id as "transId"
  //           , a.dest_url as "destUrl"
  //           , a.created_on as "createdOn"
  //           , b.name_cd as "nameCd"
  //       FROM app_menu_log a
  //   LEFT JOIN menu_def b
  //         ON a.menu_id = b.id
  //       WHERE 1=1 
  //         AND a.created_on BETWEEN TO_TIMESTAMP('${startDt} 00:00:00', 'YYYY-MM-DD HH24:MI:SS.MS') AND TO_TIMESTAMP('${endDt} 23:59:59', 'YYYY-MM-DD HH24:MI:SS.MS')
  //         AND (
  //               ( a.user_accnt  LIKE CONCAT('%','${keyword}','%') OR '${keyword}' = '' )
  //                 OR  ( a.error_cd  LIKE CONCAT('%','${keyword}','%') OR '${keyword}' = '' )
  //                 OR  ( a.error_msg  LIKE CONCAT('%','${keyword}','%') OR '${keyword}' = '' )
  //                 OR  ( b.name_cd  LIKE CONCAT('%','${keyword}','%') OR '${keyword}' = '' )
  //             )
  //       ORDER BY a.created_on
  //       LIMIT 100`; //성능이슈로 임시로 LIMIT 100 적용
  //       const result = await db.query(poolClient, sql, []);

  //       resolve(result.rows)
  //     } catch (err) {
  //       reject(`selectAppMenuLog error, ${JSON.stringify(err)}`)
  //     }
  //   });
  // }

  async findByPkgNmAndDeployTypeAndPlatformTypeNative(hosCd: string, poolClient: any, deployType: string, pkgNm: string, platformType:string){

    let schemaNm: string;
        
    try {
        schemaNm = await db.getSchemaNm(hosCd);
        const sql = `SELECT 
                        b.id,
                        b.created_on as "createdOn",
                        b.created_by as "createdBy",
                        (select user_nm from ${schemaNm}.user_mst where id=b.created_by) as "createdByName",
                        b.updated_on as "updatedOn",
                        b.updated_by as "updatedBy",
                        (select user_nm from ${schemaNm}.user_mst where id=b.updated_by) as "updatedByName",
                        b.platform_type as "platformType", 
                        b.pkg_nm as "pkgNm", 
                        b.deploy_type as "deployType",
                        b.hash_key as "hashKey",
                        b.store_url as "storeUrl",
                        b.ios_processed as "iosProcessed",

                        b.app_id as "appId",

                        a.app_platform_id as "appPlatformId", 
                        a.version_cd as "versionCd",
           
                        c.id as "appId", 
                        c.app_nm as "appNm",
                        c.app_state as "appState",
                        c.fcm_key as "fcmKey",
                        c.fido_api_key,
                        d.required
                     FROM
                    (
                      SELECT 
                        app_platform_id,
                        MAX(version_cd) AS version_cd
                      FROM  ${schemaNm}.app_version GROUP BY app_platform_id
                    ) a JOIN ${schemaNm}.app_platform b ON(a.app_platform_id = b.id)
                     JOIN ${schemaNm}.app_mst c ON(b.app_id = c.id)
                     JOIN ${schemaNm}.app_version d ON(a.app_platform_id = d.app_platform_id and a.version_cd = d.version_cd)
                     WHERE b.pkg_nm = '${pkgNm}' AND b.deploy_type = '${deployType}' AND b.platform_type = '${platformType}' `;
        console.log(sql);
        const result = await db.query(poolClient, sql, []);

        return Promise.resolve(result.rows)
    } catch (err) {
        return Promise.reject(`[${schemaNm}.app_platform] findByPkgNmAndDeployTypeAndPlatformTypeNative err, ${err}`)
    } 
  }

  async findAppMstInfoForNative(hosCd: string, poolClient: any, appId:string ){
    let schemaNm: string;
        
    try {
        schemaNm = await db.getSchemaNm(hosCd);
        const sql = `SELECT 
                        id,
                        created_on as "createdOn",
                        created_by as "createdBy",
                        (select user_nm from ${schemaNm}.user_mst where id=created_by) as "createdByName",
                        updated_on as "updatedOn",
                        updated_by as "updatedBy",
                        (select user_nm from ${schemaNm}.user_mst where id=updated_by) as "updatedByName",
                     FROM
                      ${schemaNm}.app_mst
                     WHERE id = ${appId} `;
        console.log(sql);
        const result = await db.query(poolClient, sql, []);

        return Promise.resolve(result.rows)
    } catch (err) {
        return Promise.reject(`[${schemaNm}.app_platform] findByPkgNmAndDeployTypeAndPlatformTypeNative err, ${err}`)
    } 
  }

  // 기존로직 - 주석처리 (김동인프로) -- 양식 통일화
  // async selectAppPlatform(poolClient : any) {
  //   return new Promise(async (resolve, reject) => {
  //     try {
  //       const sql = ``;
  //       const result = await db.query(poolClient, sql, []);

  //       resolve(result.rows)
  //     } catch (err) {
  //       reject(`error, ${JSON.stringify(err)}`)
  //     }
  //   });
  // }
}
