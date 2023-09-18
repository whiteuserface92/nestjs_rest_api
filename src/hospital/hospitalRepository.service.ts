import { Injectable } from '@nestjs/common';
import * as db from '../db';
import { Logger } from '@nestjs/common'
import { rejects } from 'assert';

@Injectable()
export class HospitalRepositoryService {

    private readonly logger = new Logger(HospitalRepositoryService.name);

    /* 신규 병원 목록 조회 */
    async getHospitalMst(hosCd: string, poolClient: any) {
        return new Promise(async (resolve, reject) => {
            try {
                const schemaNm = await db.getSchemaNm(hosCd);
                let sql = `select  id
                                  ,created_by as "createdBy"
                                  ,created_on as "createdOn"
                                  ,updated_by as "updatedBy"
                                  ,updated_on as "updatedOn"
                                  ,enabled
                                  ,family_enabled as "familyEnabled"
                                  ,fido_enabled as "fidoEnabled"
                                  ,home_url as "homeUrl"
                                  ,hospital_cd as "hospitalCd"
                                  ,hospital_nm as "hospitalNm"
                                  ,hospital_type as "hospitalType"
                                  ,logo_url as "logoUrl"
                                  ,memo
                                  ,service_ip as "serviceIp"
                                  ,tel_no as "telNo"
                               from ${schemaNm}.hospital_mst
                               order by id`

                const result = await db.query(poolClient, sql, []);
                
                resolve(result.rows);
            } catch (err) {
                reject(`error, ${JSON.stringify(err)}`);
            }
         });
    }
    /* 신규 병원 등록 */
    async insertHospital(hosCd: string, saveParam: any, poolClient: any) { 
        return new Promise(async (resolve, reject) => {
            try {
                let addSQL = ``;
                let addParam = ``;
                const schemaNm = await db.getSchemaNm(hosCd);

                if (saveParam.homeUrl != null) {
                    addSQL += `, home_url \n`;
                    addParam += `, '${saveParam.homeUrl}' \n`
                }
                if (saveParam.hospitalNm != null) {
                    addSQL += `, hospital_nm \n`;
                    addParam += `, '${saveParam.hospitalNm}' \n`
                }
                if (saveParam.logoUrl != null) {
                    addSQL += `, logo_url \n`;
                    addParam += `, '${saveParam.logoUrl}' \n`
                }
                if (saveParam.memo != null) {
                    addSQL += `, memo \n`;
                    addParam += `, '${saveParam.memo}' \n`
                }
                if (saveParam.telNo != null) {
                    addSQL += `, tel_no \n`;
                    addParam += `, '${saveParam.telNo}' \n`
                }

                let saveHospitalSql = `insert into ${schemaNm}.hospital_mst(created_by
                                                            ,created_on
                                                            ,enabled
                                                            ,family_enabled
                                                            ,fido_enabled
                                                            ,hospital_cd
                                                            ,hospital_type
                                                            ,service_ip
                                                            ${addSQL}
                                                            ) values(
                                                                ${saveParam.adminUserId}
                                                                , now()
                                                                , ${saveParam.enabled}
                                                                , ${saveParam.familyEnabled}
                                                                , ${saveParam.fidoEnabled}
                                                                , '${saveParam.hospitalCd}'
                                                                , '${saveParam.hospitalType}'
                                                                , '${saveParam.serviceIp}'
                                                                ${addParam}
                                                                ) RETURNING * `
                
                const saveResult = await db.query(poolClient, saveHospitalSql, []);

                if (saveResult.rowCount > 0) {
                    resolve(saveResult.rows);
                } else {
                    reject('insert failed');
                 }
                
            } catch (err) {
                reject(`error, ${JSON.stringify(err)}`);
            }
         });
    }
    /* 신규 병원 수정 */
    async updateHospital(hosCd: string, updateParam: any, poolClient: any) {
        return new Promise(async (resolve, reject) => {
            try{
                const schemaNm = await db.getSchemaNm(hosCd);

                //sql 쿼리 추가
                function sqlChk(updateParam: any) {
                    let addSQL = ``;

                    updateParam.enabled ? addSQL += `, enabled = ${updateParam.enabled} \n` : ``;
                    updateParam.familyEnabled ? addSQL += `, family_enabled = ${updateParam.familyEnabled} \n` : ``;
                    updateParam.fidoEnabled ? addSQL += `, fido_enabled = ${updateParam.fidoEnabled} \n` : ``;
                    updateParam.hospitalCd ? addSQL += `, hospital_cd = '${updateParam.hospitalCd}' \n` : ``;
                    updateParam.hospitalType ? addSQL += `, hospital_type = '${updateParam.hospitalType}' \n` : ``;
                    updateParam.serviceIp ? addSQL += `, service_ip = '${updateParam.serviceIp}' \n` : ``;
                    
                    updateParam.homeUrl ? addSQL += `, home_url = '${updateParam.homeUrl}' \n` : ``;
                    updateParam.hospitalNm ? addSQL += `, hospital_nm = '${updateParam.hospitalNm}' \n` : ``;
                    updateParam.logoUrl ? addSQL += `, logo_url = '${updateParam.logoUrl}' \n` : ``;
                    updateParam.memo ? addSQL += `, memo = '${updateParam.memo}' \n` : ``;
                    updateParam.telNo ? addSQL += `, tel_no = '${updateParam.telNo}' \n` : ``;

                    return addSQL;
                }

                let updateSql = `UPDATE ${schemaNm}.hospital_mst
                                 SET       updated_by = ${updateParam.adminUserId}       
                                         , updated_on = Now()
                                          ${sqlChk(updateParam)}
                                 WHERE     id = ${updateParam.id} 
                                 returning *`

                const updateResult = await db.query(poolClient, updateSql, []);
                
                if (updateResult.rowCount > 0) {
                    resolve(updateResult.rows);
                } else {
                    reject('update fail');
                }
            } catch (err) {
                reject(`error, ${JSON.stringify(err)}`);
            }
         });
    }
    





    // 하위 메서드들은 중단

    //  /* 병원 기본정보 저장 및 메뉴복사, 병원 그룹매핑1(insertHospitalMst returning Id) mst저장 후 id값 반환 (수정완료)*/
    // async returningId(postHospitalParam: any, poolClient: any) {
    //     return new Promise(async (resolve, reject) => {
            
    //         let saveParam = { //hospital_mst에 저장할 객체 값
    //             createdBy : 1,
    //             apiUrl: postHospitalParam.apiUrl, //NotNull
    //             domainUrl: postHospitalParam.domainUrl, //NotNull
    //             enabled: postHospitalParam.enabled, //NotNull
    //             familyEnabled: postHospitalParam.familyEnabled, //NotNull
    //             fidoEnabled: postHospitalParam.fidoEnabled,//NotNull
    //             hospitalAddrCd: postHospitalParam.hospitalAddrCd, //NotNull
    //             hospitalCd: postHospitalParam.hospitalCd, //NotNull
    //             hospitalNmCd: postHospitalParam.hospitalNmCd, //NotNull
    //             hospitalTelnoCd: postHospitalParam.hospitalTelnoCd, //NotNull
    //             hospitalType: postHospitalParam.hospitalType, //NotNull
    //             locCd: postHospitalParam.locCd, //NotNull
    //             maxDormantAge: postHospitalParam.maxDormantAge, //NotNull
    //             maxPwdAge: postHospitalParam.maxPwdAge, //NotNull
    //             pwdRetryCnt: postHospitalParam.pwdRetryCnt, //NotNull
    //             serviceIp: postHospitalParam.serviceIp, //NotNull

    //             bedCnt: postHospitalParam.bedCnt ? postHospitalParam.bedCnt : null,
    //             bizNo: postHospitalParam.bizNo ? postHospitalParam.bizNo : null,
    //             campainText: postHospitalParam.campainText ? postHospitalParam.campainText : null,
    //             dailyVisitCnt: postHospitalParam.dailyVisitCnt ? postHospitalParam.dailyVisitCnt : null,
    //             homeUrl: postHospitalParam.homeUrl ? postHospitalParam.homeUrl : null,
    //             hospitalNm: postHospitalParam.hospitalNm ? postHospitalParam.hospitalNm: null, 
    //             introContent: postHospitalParam.introContent ? postHospitalParam.introContent : null,
    //             logoUrl: postHospitalParam.logoUrl ? postHospitalParam.logoUrl : null,
    //             memo: postHospitalParam.memo ? postHospitalParam.memo : null,
    //             openedOn: postHospitalParam.openedOn ? postHospitalParam.openedOn : null,
    //             repNm: postHospitalParam.repNm ? postHospitalParam.repNm : null, 
    //             telNo: postHospitalParam.telNo ? postHospitalParam.telNo : null,
    //         }

    //         if (saveParam.apiUrl == null || saveParam.domainUrl == null || saveParam.enabled == null || saveParam.familyEnabled == null
    //             || saveParam.fidoEnabled == null || saveParam.hospitalAddrCd == null || saveParam.hospitalCd == null || saveParam.hospitalNmCd == null || saveParam.hospitalTelnoCd == null
    //             || saveParam.hospitalType == null || saveParam.locCd == null || saveParam.maxDormantAge == null || saveParam.maxPwdAge == null || saveParam.pwdRetryCnt == null || saveParam.serviceIp == null) {
    //                 throw '필수값이 없습니다.';
    //         }

    //         try{
    //             let addSQL = ``;
    //             let addParam = ``;
    //             let rowCount = 0;

    //             if (saveParam.bedCnt != null) {
    //                 addSQL += `, bed_cnt \n`;
    //                 addParam += `, ${saveParam.bedCnt} \n`;
    //             }
    //             if (saveParam.bizNo != null) {
    //                 addSQL += `, biz_no \n`;
    //                 addParam += `, '${saveParam.bizNo}' \n`
    //             }
    //             if (saveParam.campainText != null) {
    //                 addSQL += `, campain_txt \n`;
    //                 addParam += `, '${saveParam.campainText}' \n`
    //             }
    //             if (saveParam.dailyVisitCnt != null) {
    //                 addSQL += `, daily_visit_cnt \n`;
    //                 addParam += `, ${saveParam.dailyVisitCnt} \n`
    //             }
    //             if (saveParam.homeUrl != null) {
    //                 addSQL += `, home_url \n`;
    //                 addParam += `, '${saveParam.homeUrl}' \n`
    //             }
    //             if (saveParam.hospitalNm != null) {
    //                 addSQL += `, hospital_nm \n`;
    //                 addParam += `, '${saveParam.hospitalNm}' \n`
    //             }
    //             if (saveParam.introContent != null) {
    //                 addSQL += `, intro_content \n`;
    //                 addParam += `, '${saveParam.introContent}' \n`
    //             }
    //             if (saveParam.logoUrl != null) {
    //                 addSQL += `, logo_url \n`;
    //                 addParam += `, '${saveParam.logoUrl}' \n`
    //             }
    //             if (saveParam.memo != null) {
    //                 addSQL += `, memo \n`;
    //                 addParam += `, '${saveParam.memo}' \n`
    //             }
    //             if (saveParam.openedOn != null) {
    //                 addSQL += `, opened_on \n`;
    //                 addParam += `, '${saveParam.openedOn}' \n`
    //             }
    //             if (saveParam.repNm != null) {
    //                 addSQL += `, rep_nm \n`;
    //                 addParam += `, '${saveParam.repNm}' \n`
    //             }
    //             if (saveParam.telNo != null) {
    //                 addSQL += `, tel_no \n`;
    //                 addParam += `, '${saveParam.telNo}' \n`
    //             }

    //             let saveHospitalSql = `insert into hospital_mst(created_by
    //                                                         ,created_on
    //                                                         ,api_url
    //                                                         ,domain_url
    //                                                         ,enabled
    //                                                         ,family_enabled
    //                                                         ,fido_enabled
    //                                                         ,hospital_addr_cd
    //                                                         ,hospital_cd
    //                                                         ,hospital_nm_cd
    //                                                         ,hospital_telno_cd
    //                                                         ,hospital_type
    //                                                         ,loc_cd
    //                                                         ,max_dormant_age
    //                                                         ,max_pwd_age
    //                                                         ,pwd_retry_cnt
    //                                                         ,service_ip
    //                                                         ${addSQL}
    //                                                         ) values(
    //                                                             ${saveParam.createdBy}
    //                                                             , now()
    //                                                             , '${saveParam.apiUrl}'
    //                                                             , '${saveParam.domainUrl}'
    //                                                             , ${saveParam.enabled}
    //                                                             , ${saveParam.familyEnabled}
    //                                                             , ${saveParam.fidoEnabled}
    //                                                             , '${saveParam.hospitalAddrCd}'
    //                                                             , '${saveParam.hospitalCd}'
    //                                                             , '${saveParam.hospitalNmCd}'
    //                                                             , '${saveParam.hospitalTelnoCd}'
    //                                                             , '${saveParam.hospitalType}'
    //                                                             , '${saveParam.locCd}'
    //                                                             , ${saveParam.maxDormantAge}
    //                                                             , ${saveParam.maxPwdAge}
    //                                                             , ${saveParam.pwdRetryCnt}
    //                                                             , '${saveParam.serviceIp}'
    //                                                             ${addParam}
    //                                                             ) RETURNING id `
                
    //             const saveResult = await db.query(poolClient, saveHospitalSql, []);

    //             resolve(saveResult.rows);
                
    //         } catch (err) {
    //             reject(`error, ${JSON.stringify(err)}`);
    //         }
    //     });
    // }
    //  /* 병원 기본정보 저장 및 메뉴복사, 병원 그룹매핑2(복사할 메뉴 찾기) (수정완료)*/
    // async selectCopyMenu(postHospitalParam: any, poolClient: any) {
    //     return new Promise(async (resolve, reject) => { 
    //         try{
    //             let result;

    //             //병원 메뉴 복사                                             
    //             if (postHospitalParam.baseMenuHospitalId != null) {
                    
    //                 let selectSql = ` select b.disp_ord
    //                                         ,b.enabled
    //                                         ,b."level"
    //                                         ,b.menu_type
    //                                         ,b.prod_cd
    //                                         ,b.ovrd_service_url
    //                                         ,b.ovrd_name_cd
    //                                         ,b.ovrd_img_url
    //                                         ,c.id as menu_id
    //                                         ,b.parent_id
    //                                     FROM hospital_mst a
    //                                         left join hospital_menu b
    //                                                 ON a.id = b.hospital_id
    //                                         left join menu_def c
    //                                                 ON b.menu_id = c.id
    //                                     WHERE a.id = ${postHospitalParam.baseMenuHospitalId}`
    //                 const selectResult = await db.query(poolClient, selectSql, []);
                    
    //                 result = selectResult.rows;
    //             }

    //             resolve(result);
                
    //         } catch (err) {
    //             reject(`error, ${JSON.stringify(err)}`);
    //         }
    //     });
    // }
    //  /* 병원 기본정보 저장 및 메뉴복사, 병원 그룹매핑3(MENU 복사) (수정중)*/
    // async postHospital3(postHospitalParam: any, savedReturnId: any, getCopyMenu: any, poolClient: any) {
    //     return new Promise(async (resolve, reject) => { 
    //         try{
    //             let addSQL = ``;
    //             let addParam = ``;
    //             let rowCount = 0;

    //             //병원 메뉴 복사                                             
    //             if (postHospitalParam.baseMenuHospitalId != null) {
    //                 for (let i = 0; i < getCopyMenu.length; i++) {
    //                     let addSQL = ``;
    //                     let addParam = ``;

    //                     if (getCopyMenu[i].parent_id != null) {
    //                         addSQL += `, parent_id \n`;
    //                         addParam += `, ${getCopyMenu[i].parent_id} \n`
    //                     }
    //                     if (getCopyMenu[i].ovrd_service_url != null) {
    //                         addSQL += `, ovrd_service_url \n`;
    //                         addParam += `, '${getCopyMenu[i].ovrd_service_url}' \n`
    //                     }
    //                     if (getCopyMenu[i].ovrd_name_cd != null) {
    //                         addSQL += `, ovrd_name_cd \n`;
    //                         addParam += `, '${getCopyMenu[i].ovrd_name_cd}' \n`
    //                     }
    //                     if (getCopyMenu[i].ovrd_img_url != null) {
    //                         addSQL += `, ovrd_img_url \n`;
    //                         addParam += `, '${getCopyMenu[i].ovrd_img_url}' \n`
    //                     }

    //                     let insertSql = `  insert into hospital_menu(created_by
    //                                                                 ,created_on 
    //                                                                 ,disp_ord 
    //                                                                 ,enabled
    //                                                                 ,"level" 
    //                                                                 ,menu_type
    //                                                                 ,prod_cd
    //                                                                 ,hospital_id 
    //                                                                 ,menu_id
    //                                                                 ${addSQL}
    //                                                                 )
    //                                                                 values(
    //                                                                     1
    //                                                                 ,now()
    //                                                                 ,'${getCopyMenu[i].disp_ord}'
    //                                                                 ,${getCopyMenu[i].enabled}
    //                                                                 ,${getCopyMenu[i].level}
    //                                                                 ,'${getCopyMenu[i].menu_type}'
    //                                                                 ,'${getCopyMenu[i].prod_cd}'
    //                                                                 ,${savedReturnId[0].id}
    //                                                                 ,${getCopyMenu[0].menu_id}
    //                                                                 ${addParam}
    //                                                                 )`
    //                     const menuInsertResult = await db.query(poolClient, insertSql, []);
    //                     //저장에 성공하면 카운트 쌓기.
    //                     if (menuInsertResult.rowCount === 1) {
    //                         rowCount++;
    //                     }
    //                 }   
    //             }

    //             resolve(`success , rowCount : ${rowCount}`);
                
    //         } catch (err) {
    //             reject(`error, ${JSON.stringify(err)}`);
    //         } finally {
    //             poolClient.release();
    //         }
    //     });
    // }
    //  /* 병원 기본정보 저장 및 메뉴복사, 병원 그룹매핑 bak*/
    // async postHospital_bak(postHospitalParam: any, saveParam: any, poolClient: any) {
    //     return new Promise(async (resolve, reject) => { 
    //         try{
    //             let addSQL = ``;
    //             let addParam = ``;
    //             let rowCount = 0;

    //             if (saveParam.bedCnt != null) {
    //                 addSQL += `, bed_cnt \n`;
    //                 addParam += `, ${saveParam.bedCnt} \n`;
    //             }
    //             if (saveParam.bizNo != null) {
    //                 addSQL += `, biz_no \n`;
    //                 addParam += `, '${saveParam.bizNo}' \n`
    //             }
    //             if (saveParam.campainText != null) {
    //                 addSQL += `, campain_txt \n`;
    //                 addParam += `, '${saveParam.campainText}' \n`
    //             }
    //             if (saveParam.dailyVisitCnt != null) {
    //                 addSQL += `, daily_visit_cnt \n`;
    //                 addParam += `, ${saveParam.dailyVisitCnt} \n`
    //             }
    //             if (saveParam.homeUrl != null) {
    //                 addSQL += `, home_url \n`;
    //                 addParam += `, '${saveParam.homeUrl}' \n`
    //             }
    //             if (saveParam.hospitalNm != null) {
    //                 addSQL += `, hospital_nm \n`;
    //                 addParam += `, '${saveParam.hospitalNm}' \n`
    //             }
    //             if (saveParam.introContent != null) {
    //                 addSQL += `, intro_content \n`;
    //                 addParam += `, '${saveParam.introContent}' \n`
    //             }
    //             if (saveParam.logoUrl != null) {
    //                 addSQL += `, logo_url \n`;
    //                 addParam += `, '${saveParam.logoUrl}' \n`
    //             }
    //             if (saveParam.memo != null) {
    //                 addSQL += `, memo \n`;
    //                 addParam += `, '${saveParam.memo}' \n`
    //             }
    //             if (saveParam.openedOn != null) {
    //                 addSQL += `, opened_on \n`;
    //                 addParam += `, '${saveParam.openedOn}' \n`
    //             }
    //             if (saveParam.repNm != null) {
    //                 addSQL += `, rep_nm \n`;
    //                 addParam += `, '${saveParam.repNm}' \n`
    //             }
    //             if (saveParam.telNo != null) {
    //                 addSQL += `, tel_no \n`;
    //                 addParam += `, '${saveParam.telNo}' \n`
    //             }

    //             let saveHospitalSql = `insert into hospital_mst(created_by
    //                                                         ,created_on
    //                                                         ,api_url
    //                                                         ,domain_url
    //                                                         ,enabled
    //                                                         ,family_enabled
    //                                                         ,fido_enabled
    //                                                         ,hospital_addr_cd
    //                                                         ,hospital_cd
    //                                                         ,hospital_nm_cd
    //                                                         ,hospital_telno_cd
    //                                                         ,hospital_type
    //                                                         ,loc_cd
    //                                                         ,max_dormant_age
    //                                                         ,max_pwd_age
    //                                                         ,pwd_retry_cnt
    //                                                         ,service_ip
    //                                                         ${addSQL}
    //                                                         ) values(
    //                                                             ${saveParam.createdBy}
    //                                                             , now()
    //                                                             , '${saveParam.apiUrl}'
    //                                                             , '${saveParam.domainUrl}'
    //                                                             , ${saveParam.enabled}
    //                                                             , ${saveParam.familyEnabled}
    //                                                             , ${saveParam.fidoEnabled}
    //                                                             , '${saveParam.hospitalAddrCd}'
    //                                                             , '${saveParam.hospitalCd}'
    //                                                             , '${saveParam.hospitalNmCd}'
    //                                                             , '${saveParam.hospitalTelnoCd}'
    //                                                             , '${saveParam.hospitalType}'
    //                                                             , '${saveParam.locCd}'
    //                                                             , ${saveParam.maxDormantAge}
    //                                                             , ${saveParam.maxPwdAge}
    //                                                             , ${saveParam.pwdRetryCnt}
    //                                                             , '${saveParam.serviceIp}'
    //                                                             ${addParam}
    //                                                             ) RETURNING id `
                
    //             const saveResult = await db.query(poolClient, saveHospitalSql, []);
    //             //병원 메뉴 복사                                             
    //             if (postHospitalParam.baseMenuHospitalId != null) {
                    
    //                 let selectSql = ` select b.disp_ord
    //                                         ,b.enabled
    //                                         ,b."level"
    //                                         ,b.menu_type
    //                                         ,b.prod_cd
    //                                         ,b.ovrd_service_url
    //                                         ,b.ovrd_name_cd
    //                                         ,b.ovrd_img_url
    //                                         ,c.id as menu_id
    //                                         ,b.parent_id
    //                                     FROM hospital_mst a
    //                                         left join hospital_menu b
    //                                                 ON a.id = b.hospital_id
    //                                         left join menu_def c
    //                                                 ON b.menu_id = c.id
    //                                     WHERE a.id = ${postHospitalParam.baseMenuHospitalId}`
    //                 const selectResult = await db.query(poolClient, selectSql, []);

    //                 for (let i = 0; i < selectResult.rows.length; i++) {
    //                     let addSQL = ``;
    //                     let addParam = ``;

    //                     if (selectResult.rows[i].parent_id != null) {
    //                         addSQL += `, parent_id \n`;
    //                         addParam += `, ${selectResult.rows[i].parent_id} \n`
    //                     }
    //                     if (selectResult.rows[i].ovrd_service_url != null) {
    //                         addSQL += `, ovrd_service_url \n`;
    //                         addParam += `, '${selectResult.rows[i].ovrd_service_url}' \n`
    //                     }
    //                     if (selectResult.rows[i].ovrd_name_cd != null) {
    //                         addSQL += `, ovrd_name_cd \n`;
    //                         addParam += `, '${selectResult.rows[i].ovrd_name_cd}' \n`
    //                     }
    //                     if (selectResult.rows[i].ovrd_img_url != null) {
    //                         addSQL += `, ovrd_img_url \n`;
    //                         addParam += `, '${selectResult.rows[i].ovrd_img_url}' \n`
    //                     }

    //                     let insertSql = `  insert into hospital_menu(created_by
    //                                                                 ,created_on 
    //                                                                 ,disp_ord 
    //                                                                 ,enabled
    //                                                                 ,"level" 
    //                                                                 ,menu_type
    //                                                                 ,prod_cd
    //                                                                 ,hospital_id 
    //                                                                 ,menu_id
    //                                                                 ${addSQL}
    //                                                                 )
    //                                                                 values(
    //                                                                     1
    //                                                                 ,now()
    //                                                                 ,'${selectResult.rows[i].disp_ord}'
    //                                                                 ,${selectResult.rows[i].enabled}
    //                                                                 ,${selectResult.rows[i].level}
    //                                                                 ,'${selectResult.rows[i].menu_type}'
    //                                                                 ,'${selectResult.rows[i].prod_cd}'
    //                                                                 ,${saveResult.rows[0].id}
    //                                                                 ,${selectResult.rows[0].menu_id}
    //                                                                 ${addParam}
    //                                                                 )`
    //                     const menuInsertResult = await db.query(poolClient, insertSql, []);
    //                     //저장에 성공하면 카운트 쌓기.
    //                     if (menuInsertResult.rowCount === 1) {
    //                         rowCount++;
    //                     }
    //                 }   
    //             }

    //             //병원과 그룹 매핑은 필수가 아님
    //             if (postHospitalParam.groupId != null && postHospitalParam.groupId > 0) {
    //                 let addSQL = ``;
    //                 let addParam = ``;

    //                 let findGroupSql = `select * from group_def where id = ${postHospitalParam.groupId}`;
    //                 const findGroupResult = await db.query(poolClient, findGroupSql, []);

    //                 if (postHospitalParam.ovrdImageUrl != null) {
    //                     addSQL += `, ovrd_img_url \n`;
    //                     addParam += `, '${postHospitalParam.ovrdImageUrl}' \n`
    //                 }
                    
    //                 let insertGroupMbrSql = `insert into group_mbr(created_by
    //                                                             ,created_on
    //                                                             ,disp_ord
    //                                                             ,group_id
    //                                                             ,hospital_id
    //                                                             ${addSQL} 
    //                                                             )
    //                                                             values(
    //                                                                 1
    //                                                             ,now()
    //                                                             ,'99' --원본에서 임시세팅해놓음
    //                                                             ,${findGroupResult.rows[0].id}
    //                                                             ,${saveResult.rows[0].id}
    //                                                             ${addParam}
    //                                                             )`
                    
    //                 const insertGroupMbrResult = await db.query(poolClient, insertGroupMbrSql, []);
    //             }

    //             resolve(`success !`);
                
    //         } catch (err) {
    //             reject(`error, ${JSON.stringify(err)}`);
    //         } finally {
    //             poolClient.release();
    //         }
    //     });
    // }

    // /* 병원정보와 환자정보 가져와서 등록1(getUserIds) (수정완료)*/
    // async selectUserId(reqHospitalInfoParam: any, poolClient: any) {
    //     return new Promise(async (resolve, reject) => {
    //         try {
    //                 let users = [];

    //                 for (let i = 0; i < reqHospitalInfoParam.length; i++) {
    //                     let getIdSql = `select * from user_mst where id = '${reqHospitalInfoParam[i].userId}'`
    //                     const idResult = await db.query(poolClient, getIdSql, []);
                    
    //                     users.push(idResult.rows[0]);
    //                 }

    //                 resolve(users);
            
    //         } catch (err) {
    //             reject( `error, ${JSON.stringify(err)}`)
    //         }
    //      });
    // }   
    // /* 병원정보와 환자정보 가져와서 등록2(getHospital) (수정완료)*/
    // async getUserPatients(reqHospitalInfoParam: any, userMst: any, poolClient: any) {
    //     return new Promise(async (resolve, reject) => {
    //         try {
    //                 let userId = 0;
    //                 let userPatients = [];

    //                 for (let i = 0; i < reqHospitalInfoParam.length; i++) {

    //                     userId = userMst[i].id;

    //                     let getHospital = `select * from hospital_mst where hospital_cd = '${userMst[i].hospital_cd}'`;
    //                     const hospitalResult = await db.query(poolClient, getHospital, []);

    //                     //returnObj.message.push(hospitalResult.rows[0]);

    //                     let userPatient = {
    //                         hospitalId: hospitalResult.rows[0].id,
    //                         user: userMst[i],
    //                         patientNo: reqHospitalInfoParam[i].patientId,
    //                         patientRel: '10',
    //                         patientNm: userMst[i].user_nm,
    //                         encAlgo: 'N/A',
    //                     }
    //                     //userPatients 배열에 담음.
    //                     userPatients.push(userPatient);
    //                 }

    //                 resolve(userPatients);
                
    //         } catch (err) {
    //             reject( `error, ${JSON.stringify(err)}`)
    //         }
    //      });
    // }
    // /* 병원정보와 환자정보 가져와서 등록3(deleteUserPatient) (수정완료)*/
    // async delPatientInfo(reqHospitalInfoParam: any, userMst: any, userPatients: any, poolClient: any) {
    //     return new Promise(async (resolve, reject) => {
    //         try {
    //                 let userId = 0;
    //                 let delCount = 0;

    //                 for (let i = 0; i < reqHospitalInfoParam.length; i++) {
                    
    //                     userId = userMst[i].id;

    //                     // 환자정보가 존재하면 환자를 삭제후 등록한다.
    //                     if (userId != 0 || userPatients != null) {
    //                         //기존정보 삭제
    //                         let deleteSql = `delete from user_patient where user_id = ${userId}`;
    //                         const deleteResult = await db.query(poolClient, deleteSql, []);
                            
    //                         if (deleteResult.rowCount == 1) {
    //                             delCount++;
    //                         }
    //                     }
    //                 }

    //                 resolve( `success, delCount: ${delCount}`);
    //         } catch (err) {
    //             reject( `error, ${JSON.stringify(err)}`)
    //         }
    //      });
    // }
    // /* 병원정보와 환자정보 가져와서 등록4(insertUserPatient) (수정완료)*/
    // async insertPatientInfo(reqHospitalInfoParam: any, userMst: any, userPatients: any, poolClient: any) {
    //     return new Promise(async (resolve, reject) => {
    //         try {
    //                 let userId = 0;
    //                 let rowCount = 0;

    //                 for (let i = 0; i < reqHospitalInfoParam.length; i++) {
                        
    //                     userId = userMst[i].id;
    //                     //신규정보 추가
    //                     let insertSql = `insert into user_patient(
    //                                                             created_by, 
    //                                                             created_on, 
    //                                                             agreed_on, 
    //                                                             enc_algo, 
    //                                                             patient_nm, 
    //                                                             patient_no, 
    //                                                             patient_rel, 
    //                                                             hospital_id, 
    //                                                             user_id)
    //                                                     values(1, 
    //                                                             now(),
    //                                                             now(),
    //                                                             '${userPatients[i].encAlgo}', 
    //                                                             '${userPatients[i].patientNm}',
    //                                                             '${userPatients[i].patientNo}', 
    //                                                             '10',
    //                                                             ${userPatients[i].hospitalId}, 
    //                                                             ${userId})`;
    //                     const insertResult = await db.query(poolClient, insertSql, []);
                            
    //                     if (insertResult.rowCount == 1) {
    //                         rowCount++;
    //                     }
    //                 }

    //             resolve( `success, insertCount: ${rowCount} `);
    //         } catch (err) {
    //             reject( `error, ${JSON.stringify(err)}`)
    //         } finally {
    //             poolClient.release();
    //         }
    //      });
    // }


    // /* 병원별 환자번호 삭제1(hospital_mst 조회) (수정완료)*/
    // async selectHospitalMst(reqHospitalInfoParam: any, poolClient: any) {
    //     return new Promise(async (resolve, reject) => {
    //         let returnObj;

    //         try {
    //             //병원별 유저정보가 존재하면 환자정보를 가져온다.
    //             if (Object.keys(reqHospitalInfoParam).length !== 0) {
    //                 let result = [];

    //                 for (let i = 0; i < reqHospitalInfoParam.length; i++) {
    //                     let getMstIdSql = `select * from hospital_mst where hospital_cd = '${reqHospitalInfoParam[i].hospitalCd}'`

    //                     const idResult = await db.query(poolClient, getMstIdSql, []);
    //                     result.push(idResult.rows);
    //                 }
 
    //                 resolve(result);
    //             }
    //         } catch (err) {
    //             reject(`error, ${JSON.stringify(err)}`);
    //         }
    //      });
    // }
    // /* 병원별 환자번호 삭제2(user_patient 삭제) (수정완료) */
    // async delUserPatient(reqHospitalInfoParam: any, selectResult: any, poolClient: any) {
    //     return new Promise(async (resolve, reject) => {
    //         let returnObj;

    //         try {
    //             //병원별 유저정보가 존재하면 환자정보를 가져온다.
    //             if (Object.keys(reqHospitalInfoParam).length !== 0) {
    //                 let rowCount = 0;

    //                 for (let i = 0; i < reqHospitalInfoParam.length; i++) {
    //                     let deleteSql = `delete 
    //                                         from user_patient 
    //                                     where user_id = ${reqHospitalInfoParam[i].userId} 
    //                                         and patient_no = '${reqHospitalInfoParam[i].patientId}'
    //                                         and hospital_id = ${selectResult[i][0].id}`
    //                     const deleteResult = await db.query(poolClient, deleteSql, []);

    //                     //삭제에 성공하면 카운트 쌓기.
    //                     if (deleteResult.rowCount === 1) {
    //                         rowCount++;
    //                     }
    //                 }

    //                 if (rowCount >= 1) {
    //                     resolve(` success, rowCount : ${rowCount}`);
    //                 } else {
    //                     reject('fail');
    //                 }
    //             }
    //         } catch (err) {
    //             reject(`error, ${JSON.stringify(err)}`);
    //         } finally {
    //             poolClient.release();
    //             this.logger.log("done!")
    //         }
    //      });
    // }


    // /* 병원 옵션 정보 저장 (수정완료) */
    // async saveOptSiteMapToDB(optSiteMapParam: any, poolClient: any) {
    //     return new Promise(async (resolve, reject) => {

    //         let result: any;

    //         try {
    //             let addParam = ``;
    //             let addSQL = ``;
    //             if (optSiteMapParam.refCd) {
    //                 addParam += `, ref_cd`;
    //                 addSQL += `, '${optSiteMapParam.refCd}'`;
    //             }
    //             if (optSiteMapParam.defCd) {
    //                 addParam += `, def_cd`;
    //                 addSQL += `, '${optSiteMapParam.defCd}'`
    //             }
    //             if (optSiteMapParam.siteCd) {
    //                 addParam += `, site_cd`;
    //                 addSQL += `, '${optSiteMapParam.siteCd}'`
    //             }

    //             let sql = `insert into hospital_opt_site_map (hospital_id ${addParam}) 
    //                 values (${optSiteMapParam.hospitalId} ${addSQL});`;
                
    //             result = await db.query(poolClient, sql, []);

    //             if (result.rowCount > 0) {
    //                 resolve(`success, rowCount: ${result.rowCount}`);
    //             } else {
    //                 reject(`fail`);
    //             }
    //         } catch (err) {
    //             reject(`error, ${JSON.stringify(err)}`);
    //         } finally {
    //             poolClient.release();
    //         }
    //      });
    // }


    // /* 병원 옵션 정보 조회1(rev_val 조회)  (수정완료)*/
    // async findRefValToCodeMst(hospitalId: number, keyword: string, poolClient: any) {
    //     return new Promise(async (resolve, reject) => {
          
    //         try {

    //             let refVals = [];
                
                
    //             // SITE_CD_MAP 사이트코드 매핑에서 서브쿼리로 돌릴 상세 코드를 조회 하기 위해 공통코드 목록 조회
    //             let codeMstSql = `SELECT a.id,
    //                                     a.ref_val as refVal,
    //                                     a.code_nm as codeNm,
    //                                     a.disp_ord as dispOrd
    //                                 FROM code_mst a
    //                                 WHERE a.code_cls = 'SITE_CD_MAP'
    //                                     AND a.code_type = '2'
    //                                 ORDER BY a.disp_ord ASC `
    //             const codeResult = await db.query(poolClient, codeMstSql, []);

    //             //받아온 데이터 refVals에 넣기 (다음쿼리에 인자값으로 제공) - await 사용해야함.
    //             // await codeResult.rows.map( (item) => {
    //             //     refVals.push(`'${item.refval}'`);
    //             // });

    //             //동기처리해줘야 정상동작한다.
    //             await Promise.all( codeResult.rows.map( async (item) => {
    //                 await refVals.push(`'${item.refval}'`);
    //             })
    //             )
        
    //             resolve(refVals);
    //         } catch (err) {
    //             reject(`error, ${JSON.stringify(err)}`);
    //         }
    //      });
    // }
    // /* 병원 옵션 정보 조회2(병원 옵션리스트 조회) (수정완료)*/
    // async findHospitalOptSiteMapList(hospitalId: number, keyword: string, refVals: any, poolClient: any) {
    //     return new Promise(async (resolve, reject) => {
    //         try {

    //             let addKeyword = ``;

    //             //키워드 조건 넣기
    //             if (keyword) {
    //                 addKeyword +=  `AND ( ( b.code LIKE Concat('%', '${keyword}', '%') OR '${keyword}' = '' )
    //                                 OR ( b.code_nm LIKE Concat('%', '${keyword}', '%') OR '${keyword}' = '' )
    //                                 OR ( b.code_cls LIKE Concat('%', '${keyword}', '%') OR '${keyword}' = '' ) )`
    //             } else if (!keyword) {
    //                 addKeyword += `AND ( ( b.code LIKE Concat('%', null, '%') OR null = '' )
    //                                 OR ( b.code_nm LIKE Concat('%', null, '%') OR null = '' )
    //                                 OR ( b.code_cls LIKE Concat('%', null, '%') OR null = '' ) )`
    //             }

    //             let sql = `SELECT a.id,
    //                             a.hospital_id as hospitalId,
    //                             b.code_cls as codeCls,
    //                             b.code as code,
    //                             a.site_cd as siteCd,
    //                             b.code_nm as codeNm,
    //                             b.code_cls as codeCls
    //                         FROM   code_mst b
    //                     left join hospital_opt_site_map a
    //                         ON b.code = a.def_cd
    //                             AND b.code_cls = a.ref_cd
    //                             AND a.hospital_id = ${hospitalId}
    //                         WHERE  ( 1 = 1 )
    //                             AND b.code_cls IN ( ${refVals.toString()} )
    //                             AND b.code_type = '2'
    //                             ${addKeyword}
    //                         ORDER  BY b.code_cls,
    //                                 b.disp_ord `
                
    //             const result = await db.query(poolClient, sql, []);

    //             resolve(result.rows);
    //         } catch (err) {
    //             reject(`error, ${JSON.stringify(err)}`);
    //         } finally {
    //             poolClient.release();
    //         }
    //      });
    // }


    // /* 병원 그룹정보 조회 (수정완료) */
    // async getGroupHospitalsToDB(groupId: string, poolClient: any) {
    //     return new Promise(async (resolve, reject) => {
            
    //         try{
    //             let whereSql =``;
    //             if (groupId != ':id' && groupId != null && groupId != undefined) {
    //                 whereSql += `where a.group_id =${groupId}`;
    //             }

    //             let sql =`select a.id as id,
    //                             a.group_id as groupId,
    //                             a.hospital_id as hospitalId,
    //                             b.hospital_nm as hospitalNm,
    //                             b.hospital_nm_cd as hospitalNmCd,
    //                             a.ovrd_img_url as ovrdImgUrl,
    //                             a.disp_ord as dispOrd,
    //                             a.created_by as createdBy,
    //                             a.created_on as createdOn,
    //                             a.updated_by as updatedBy,
    //                             a.updated_on as updatedOn
    //                         from group_mbr a  
    //                     left outer join hospital_mst b on a.hospital_id = b.id
    //                         ${whereSql}
    //                         order by a.disp_ord`;
                
    //             const result = await db.query(poolClient, sql, []);
                
    //             resolve(result.rows);
    //         } catch (err) {
    //             reject(`error, ${JSON.stringify(err)}`);
    //         } finally {
    //             poolClient.release();
    //         }
    //     });
    //  }
    // /* 병원 코드목록 조회 (수정완료)*/
    // async hospitalFindOptCd(hospitalId: number, keyword: string, poolClient: any) {
    //     return new Promise(async (resolve, reject) => {
            
    //         try {
    //             let array = [];
    //             let addKeyword = ``;
                
    //             if (keyword) {
    //                 addKeyword += ` AND ( ( a.code like CONCAT('%','${keyword}','%') OR '${keyword}' = '' ) 
    //                             OR (  a.code_nm  like CONCAT('%','${keyword}','%') OR '${keyword}' = '' ) )`;
    //             } else if (!keyword) {
    //                 addKeyword += ` AND ( ( a.code like CONCAT('%',null,'%') OR null = '' ) 
    //                             OR (  a.code_nm  like CONCAT('%',null,'%') OR null = '' ) )`;
    //             }

    //             let sql = `select b.id as id ,
    //                             a.code as optCd ,
    //                             a.code_nm as codeNm,
    //                             b.opt_val as optVal,
    //                             a.ref_val as refVal,
    //                             b.hospital_id as hospitalId
    //                             from code_mst a
    //                         left join hospital_opt_cd b on a.code = b.opt_cd and b.hospital_id = ${hospitalId}
    //                             WHERE  (1=1)
    //                             AND a.code_cls ='OPT_CD' and a.code_type ='2'
    //                             ${addKeyword}
    //                         order by a.code , a.disp_ord `;

    //             const result = await db.query(poolClient, sql, []);

    //             // AS-IS는 HospitalOptionCodeDto내의 List<CommonCodeDto> baseCodes 객체?에 값을 set해줌. TO-BE에서는 보류 (필요시 로직 추가해야함.)
    //             // 토의 시 이해한게 맞는지 문의.
    //             /* for (let i = 0; i < result.rows.length; i++) {
    //                 if (null != result.rows[i].refval) {
    //                     let findCodeClsDetails = `SELECT a.id, a.code, a.code_nm, a.disp_ord 
    //                                                     FROM code_mst a 
    //                                                 WHERE a.code_cls = '${result.rows[i].refval}' 
    //                                                 AND a.code_type='2' order by a.disp_ord asc`;
    //                     const resultCode = await db.query(poolClient, findCodeClsDetails, []);
                        
    //                     array.push(resultCode.rows);
    //                 }
    //             } */
    //             resolve(result.rows);
    //         } catch (err) {
    //             reject(`error, ${JSON.stringify(err)}`);
    //         } finally {
    //             poolClient.release();
    //         }
    //     });
    // }
    // /* 병원 옵션코드 저장  (수정완료) */
    // async saveOptCode(optInfo: any, poolClient: any) { 
    //     return new Promise(async (resolve, reject) => {

    //         try {
    //             let sql = ``;
    //             let addParam = ``;
    //             let addSQL = ``;

    //             if (optInfo.hospitalId) {
    //                 if (optInfo.optCd) {
    //                     addParam += `, opt_cd`;
    //                     addSQL += `, '${optInfo.optCd}'`;
    //                 }
    //                 if (optInfo.optVal) {
    //                     addParam += `, opt_val`;
    //                     addSQL += `, '${optInfo.optVal}'`
    //                 }

    //                 //등록
    //                 sql = `insert into hospital_opt_cd (hospital_id ${addParam}) 
    //                     values (${optInfo.hospitalId} ${addSQL});`;
    //             }
    //             const result = await db.query(poolClient, sql, []);
                
    //             if (result.rowCount > 0) {
    //                 resolve(` success, rowCount : ${result.rowCount}`);
    //             } else {
    //                 reject(`fail`);
    //             }
    //         } catch (err) {
    //             reject(`error, ${JSON.stringify(err)}`);
    //         } finally {
    //             poolClient.release();
    //         }
    //     });
    // }
}