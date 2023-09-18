import { Injectable } from '@nestjs/common';
import * as db from '../db';
import { LoggerService } from '@nestjs/common';
import { Logger } from '@nestjs/common';
import { HospitalRepositoryService } from './hospitalRepository.service';


@Injectable() 
export class HospitalService {

    private readonly logger = new Logger(HospitalService.name);

    constructor(private readonly hospitalRepositoryService : HospitalRepositoryService) {}

    /* 신규 병원목록 조회 */
    async getHospitals(hosCd: string) {
        const poolClient = await db.getPoolClient();
        
        let returnObj = {
            code : 200,
            message : 'getHospitals',
            result : {}
        }

        let getHospital;

        try {
            getHospital = await this.hospitalRepositoryService.getHospitalMst(hosCd, poolClient);
            
            this.logger.log(getHospital);
            returnObj.result = getHospital;
        } catch(e){
            returnObj.code = 401;
            returnObj.message = 'getHospitals fail'
        } finally {
            poolClient.release();
            this.logger.log("connect release..")
            return returnObj;
        }
    }
 
    /* 신규 병원 등록 */
    async saveHospital(hosCd: string, postHospitalParam: any) {
        const poolClient = await db.getPoolClient();

        let returnObj = {
            code : 200,
            message : "postHospital",
            result : {}
        }

        let savedHospitalInfo;

        try {
            
            let saveParam = { //hospital_mst에 저장할 객체 값
                adminUserId : postHospitalParam.adminUserId, //createdBy 컬럼
                enabled: postHospitalParam.enabled, //NotNull
                familyEnabled: postHospitalParam.familyEnabled, //NotNull
                fidoEnabled: postHospitalParam.fidoEnabled,//NotNull
                hospitalCd: postHospitalParam.hospitalCd, //NotNull  
                hospitalType: postHospitalParam.hospitalType, //NotNull
                serviceIp: postHospitalParam.serviceIp, //NotNull

                homeUrl: postHospitalParam.homeUrl ? postHospitalParam.homeUrl : null,
                hospitalNm: postHospitalParam.hospitalNm ? postHospitalParam.hospitalNm: null, 
                logoUrl: postHospitalParam.logoUrl ? postHospitalParam.logoUrl : null,
                memo: postHospitalParam.memo ? postHospitalParam.memo : null,
                telNo: postHospitalParam.telNo ? postHospitalParam.telNo : null,
            }

            if (saveParam.adminUserId == null || saveParam.enabled == null || saveParam.familyEnabled == null
                || saveParam.fidoEnabled == null || saveParam.hospitalCd == null || saveParam.hospitalType == null || saveParam.serviceIp == null) {
                    throw '필수값이 없습니다.';
            }

            db.transaction_Begin(poolClient);

            //mst에 저장
            savedHospitalInfo = await this.hospitalRepositoryService.insertHospital(hosCd, saveParam, poolClient);
            this.logger.log(savedHospitalInfo);
            returnObj.result = savedHospitalInfo;

            db.transaction_Commit(poolClient);
            
        }catch (e){
            db.transaction_Rollback(poolClient);
            returnObj.code = 401;
            returnObj.result = e;
        } finally {
            poolClient.release();
            return returnObj;
        }
    }
    
    /* 신규 병원 수정 */
    async updateHospital(hosCd: string, updateHospitalParam: any) {
        const poolClient = await db.getPoolClient();

        let updateParam = { //hospital_mst에 업데이트할 객체 값
                id: updateHospitalParam.id,
                adminUserId : updateHospitalParam.adminUserId, //updatedBy 컬럼
                enabled: updateHospitalParam.enabled ? updateHospitalParam.enabled : null, //NotNull
                familyEnabled: updateHospitalParam.familyEnabled ? updateHospitalParam.familyEnabled : null, //NotNull
                fidoEnabled: updateHospitalParam.fidoEnabled ? updateHospitalParam.fidoEnabled : null,//NotNull
                hospitalCd: updateHospitalParam.hospitalCd ? updateHospitalParam.hospitalCd : null, //NotNull
                hospitalType: updateHospitalParam.hospitalType ? updateHospitalParam.hospitalType : null, //NotNull
                serviceIp: updateHospitalParam.serviceIp ? updateHospitalParam.serviceIp : null, //NotNull

                homeUrl: updateHospitalParam.homeUrl ? updateHospitalParam.homeUrl : null,
                hospitalNm: updateHospitalParam.hospitalNm ? updateHospitalParam.hospitalNm: null, 
                logoUrl: updateHospitalParam.logoUrl ? updateHospitalParam.logoUrl : null,
                memo: updateHospitalParam.memo ? updateHospitalParam.memo : null,
                telNo: updateHospitalParam.telNo ? updateHospitalParam.telNo : null,
        }
        
        let returnObj = {
            code : 200,
            message : "updateHospital",
            result : {}
        }

        let updateResult;

        try {
            if (!updateParam.adminUserId) {
                throw "필수값 [adminUserId]가 없습니다.";
            }

            db.transaction_Begin(poolClient);

            updateResult = await this.hospitalRepositoryService.updateHospital(hosCd, updateParam, poolClient);
            returnObj.result = updateResult;

            db.transaction_Commit(poolClient);
        }catch (e){
            db.transaction_Rollback(poolClient);
            returnObj.code = 401;
            returnObj.result = e;
        } finally {
            poolClient.release();
            return returnObj;
        }
    }
    
 
 
    // /*
    //     병원 기본정보 저장 및 메뉴복사, 병원 그룹매핑
    //     사용 Table : hospital_mst, hospital_menu, menu_def, group_def, group_mbr

    //     ******현재 수정 중단
    // */
    // async postHospital(postHospitalParam: any) {
    //     const poolClient = await db.getPoolClient();

    //     let returnObj = {
    //         code : 200,
    //         message : "postHospital",
    //         result : {}
    //     }

    //     let savedReturnId;
    //     //카피해야할 메뉴들 불러오기
    //     let getCopyMenu;
    //     //카피된 메뉴
    //     let menuCopy;

    //     try { 
    //         db.transaction_Begin(poolClient);
    //         //mst에 저장 후 id값 리턴
    //         savedReturnId = await this.hospitalRepositoryService.returningId(postHospitalParam, poolClient);
    //         this.logger.log(savedReturnId);
    //         getCopyMenu = await this.hospitalRepositoryService.selectCopyMenu(postHospitalParam, poolClient);
    //         this.logger.log(getCopyMenu);
    //         menuCopy = await this.hospitalRepositoryService.postHospital3(postHospitalParam, savedReturnId, getCopyMenu,  poolClient);
    //         this.logger.log(menuCopy);


    //         db.transaction_Commit(poolClient);
    //     }catch (e){
    //         db.transaction_Rollback(poolClient);
    //         returnObj.code = 401;
    //         returnObj.result = "postHospital failed"
    //     } finally {
    //         return menuCopy;
    //     }

    // }
    // /*
    //     병원 기본정보 저장 및 메뉴복사, 병원 그룹매핑 백업
    //     사용 Table : hospital_mst, hospital_menu, menu_def, group_def, group_mbr
    // */
    // // async postHospital_bak(postHospitalParam: any) {
    // //     let returnObj;
    // //     const poolClient = await db.getPoolClient();
        
    // //     try { 
    // //         //hospital_mst에 저장할 객체 값
    // //         let saveParam = {
    // //             createdBy : 1,
    // //             apiUrl: postHospitalParam.apiUrl, //NotNull
    // //             domainUrl: postHospitalParam.domainUrl, //NotNull
    // //             enabled: postHospitalParam.enabled, //NotNull
    // //             familyEnabled: postHospitalParam.familyEnabled, //NotNull
    // //             fidoEnabled: postHospitalParam.fidoEnabled,//NotNull
    // //             hospitalAddrCd: postHospitalParam.hospitalAddrCd, //NotNull
    // //             hospitalCd: postHospitalParam.hospitalCd, //NotNull
    // //             hospitalNmCd: postHospitalParam.hospitalNmCd, //NotNull
    // //             hospitalTelnoCd: postHospitalParam.hospitalTelnoCd, //NotNull
    // //             hospitalType: postHospitalParam.hospitalType, //NotNull
    // //             locCd: postHospitalParam.locCd, //NotNull
    // //             maxDormantAge: postHospitalParam.maxDormantAge, //NotNull
    // //             maxPwdAge: postHospitalParam.maxPwdAge, //NotNull
    // //             pwdRetryCnt: postHospitalParam.pwdRetryCnt, //NotNull
    // //             serviceIp: postHospitalParam.serviceIp, //NotNull

    // //             bedCnt: postHospitalParam.bedCnt ? postHospitalParam.bedCnt : null,
    // //             bizNo: postHospitalParam.bizNo ? postHospitalParam.bizNo : null,
    // //             campainText: postHospitalParam.campainText ? postHospitalParam.campainText : null,
    // //             dailyVisitCnt: postHospitalParam.dailyVisitCnt ? postHospitalParam.dailyVisitCnt : null,
    // //             homeUrl: postHospitalParam.homeUrl ? postHospitalParam.homeUrl : null,
    // //             hospitalNm: postHospitalParam.hospitalNm ? postHospitalParam.hospitalNm: null, 
    // //             introContent: postHospitalParam.introContent ? postHospitalParam.introContent : null,
    // //             logoUrl: postHospitalParam.logoUrl ? postHospitalParam.logoUrl : null,
    // //             memo: postHospitalParam.memo ? postHospitalParam.memo : null,
    // //             openedOn: postHospitalParam.openedOn ? postHospitalParam.openedOn : null,
    // //             repNm: postHospitalParam.repNm ? postHospitalParam.repNm : null, 
    // //             telNo: postHospitalParam.telNo ? postHospitalParam.telNo : null,
    // //         }

    // //         if (saveParam.apiUrl == null || saveParam.domainUrl == null || saveParam.enabled == null || saveParam.familyEnabled == null
    // //             || saveParam.fidoEnabled == null || saveParam.hospitalAddrCd == null || saveParam.hospitalCd == null || saveParam.hospitalNmCd == null || saveParam.hospitalTelnoCd == null
    // //             || saveParam.hospitalType == null || saveParam.locCd == null || saveParam.maxDormantAge == null || saveParam.maxPwdAge == null || saveParam.pwdRetryCnt == null || saveParam.serviceIp == null) {
    // //                 throw '필수값이 없습니다.';
    // //         }

    // //         let addSQL = ``;
    // //         let addParam = ``;
    // //         let rowCount = 0;

    // //         if (saveParam.bedCnt != null) {
    // //             addSQL += `, bed_cnt \n`;
    // //             addParam += `, ${saveParam.bedCnt} \n`;
    // //         }
    // //         if (saveParam.bizNo != null) {
    // //             addSQL += `, biz_no \n`;
    // //             addParam += `, '${saveParam.bizNo}' \n`
    // //         }
    // //         if (saveParam.campainText != null) {
    // //             addSQL += `, campain_txt \n`;
    // //             addParam += `, '${saveParam.campainText}' \n`
    // //         }
    // //         if (saveParam.dailyVisitCnt != null) {
    // //             addSQL += `, daily_visit_cnt \n`;
    // //             addParam += `, ${saveParam.dailyVisitCnt} \n`
    // //         }
    // //         if (saveParam.homeUrl != null) {
    // //             addSQL += `, home_url \n`;
    // //             addParam += `, '${saveParam.homeUrl}' \n`
    // //         }
    // //         if (saveParam.hospitalNm != null) {
    // //             addSQL += `, hospital_nm \n`;
    // //             addParam += `, '${saveParam.hospitalNm}' \n`
    // //         }
    // //         if (saveParam.introContent != null) {
    // //             addSQL += `, intro_content \n`;
    // //             addParam += `, '${saveParam.introContent}' \n`
    // //         }
    // //         if (saveParam.logoUrl != null) {
    // //             addSQL += `, logo_url \n`;
    // //             addParam += `, '${saveParam.logoUrl}' \n`
    // //         }
    // //         if (saveParam.memo != null) {
    // //             addSQL += `, memo \n`;
    // //             addParam += `, '${saveParam.memo}' \n`
    // //         }
    // //         if (saveParam.openedOn != null) {
    // //             addSQL += `, opened_on \n`;
    // //             addParam += `, '${saveParam.openedOn}' \n`
    // //         }
    // //         if (saveParam.repNm != null) {
    // //             addSQL += `, rep_nm \n`;
    // //             addParam += `, '${saveParam.repNm}' \n`
    // //         }
    // //         if (saveParam.telNo != null) {
    // //             addSQL += `, tel_no \n`;
    // //             addParam += `, '${saveParam.telNo}' \n`
    // //         }

    // //         let saveHospitalSql = `insert into hospital_mst(created_by
    // //                                                        ,created_on
    // //                                                        ,api_url
    // //                                                        ,domain_url
    // //                                                        ,enabled
    // //                                                        ,family_enabled
    // //                                                        ,fido_enabled
    // //                                                        ,hospital_addr_cd
    // //                                                        ,hospital_cd
    // //                                                        ,hospital_nm_cd
    // //                                                        ,hospital_telno_cd
    // //                                                        ,hospital_type
    // //                                                        ,loc_cd
    // //                                                        ,max_dormant_age
    // //                                                        ,max_pwd_age
    // //                                                        ,pwd_retry_cnt
    // //                                                        ,service_ip
    // //                                                        ${addSQL}
    // //                                                     ) values(
    // //                                                            ${saveParam.createdBy}
    // //                                                          , now()
    // //                                                          , '${saveParam.apiUrl}'
    // //                                                          , '${saveParam.domainUrl}'
    // //                                                          , ${saveParam.enabled}
    // //                                                          , ${saveParam.familyEnabled}
    // //                                                          , ${saveParam.fidoEnabled}
    // //                                                          , '${saveParam.hospitalAddrCd}'
    // //                                                          , '${saveParam.hospitalCd}'
    // //                                                          , '${saveParam.hospitalNmCd}'
    // //                                                          , '${saveParam.hospitalTelnoCd}'
    // //                                                          , '${saveParam.hospitalType}'
    // //                                                          , '${saveParam.locCd}'
    // //                                                          , ${saveParam.maxDormantAge}
    // //                                                          , ${saveParam.maxPwdAge}
    // //                                                          , ${saveParam.pwdRetryCnt}
    // //                                                          , '${saveParam.serviceIp}'
    // //                                                          ${addParam}
    // //                                                         ) RETURNING id `
            
    // //         const saveResult = await db.query(poolClient, saveHospitalSql, []);
    // //         //병원 메뉴 복사                                             
    // //         if (postHospitalParam.baseMenuHospitalId != null) {
                
    // //             let selectSql = ` select b.disp_ord
    // //                                     ,b.enabled
    // //                                     ,b."level"
    // //                                     ,b.menu_type
    // //                                     ,b.prod_cd
    // //                                     ,b.ovrd_service_url
    // //                                     ,b.ovrd_name_cd
    // //                                     ,b.ovrd_img_url
    // //                                     ,c.id as menu_id
    // //                                     ,b.parent_id
    // //                                 FROM hospital_mst a
    // //                                     left join hospital_menu b
    // //                                             ON a.id = b.hospital_id
    // //                                     left join menu_def c
    // //                                             ON b.menu_id = c.id
    // //                                 WHERE a.id = ${postHospitalParam.baseMenuHospitalId}`
    // //             const selectResult = await db.query(poolClient, selectSql, []);

    // //             for (let i = 0; i < selectResult.rows.length; i++) {
    // //                 let addSQL = ``;
    // //                 let addParam = ``;

    // //                 if (selectResult.rows[i].parent_id != null) {
    // //                     addSQL += `, parent_id \n`;
    // //                     addParam += `, ${selectResult.rows[i].parent_id} \n`
    // //                 }
    // //                 if (selectResult.rows[i].ovrd_service_url != null) {
    // //                     addSQL += `, ovrd_service_url \n`;
    // //                     addParam += `, '${selectResult.rows[i].ovrd_service_url}' \n`
    // //                 }
    // //                 if (selectResult.rows[i].ovrd_name_cd != null) {
    // //                     addSQL += `, ovrd_name_cd \n`;
    // //                     addParam += `, '${selectResult.rows[i].ovrd_name_cd}' \n`
    // //                 }
    // //                 if (selectResult.rows[i].ovrd_img_url != null) {
    // //                     addSQL += `, ovrd_img_url \n`;
    // //                     addParam += `, '${selectResult.rows[i].ovrd_img_url}' \n`
    // //                 }

    // //                 let insertSql = `  insert into hospital_menu(created_by
    // //                                                             ,created_on 
    // //                                                             ,disp_ord 
    // //                                                             ,enabled
    // //                                                             ,"level" 
    // //                                                             ,menu_type
    // //                                                             ,prod_cd
    // //                                                             ,hospital_id 
    // //                                                             ,menu_id
    // //                                                             ${addSQL}
    // //                                                             )
    // //                                                             values(
    // //                                                                 1
    // //                                                                ,now()
    // //                                                                ,'${selectResult.rows[i].disp_ord}'
    // //                                                                ,${selectResult.rows[i].enabled}
    // //                                                                ,${selectResult.rows[i].level}
    // //                                                                ,'${selectResult.rows[i].menu_type}'
    // //                                                                ,'${selectResult.rows[i].prod_cd}'
    // //                                                                ,${saveResult.rows[0].id}
    // //                                                                ,${selectResult.rows[0].menu_id}
    // //                                                                ${addParam}
    // //                                                             )`
    // //                 const menuInsertResult = await db.query(poolClient, insertSql, []);
    // //                 //저장에 성공하면 카운트 쌓기.
    // //                 if (menuInsertResult.rowCount === 1) {
    // //                     rowCount++;
    // //                 }
    // //             }   
    // //         }

    // //         //병원과 그룹 매핑은 필수가 아님
    // //         if (postHospitalParam.groupId != null && postHospitalParam.groupId > 0) {
    // //             let addSQL = ``;
    // //             let addParam = ``;

    // //             let findGroupSql = `select * from group_def where id = ${postHospitalParam.groupId}`;
    // //             const findGroupResult = await db.query(poolClient, findGroupSql, []);

    // //             if (postHospitalParam.ovrdImageUrl != null) {
    // //                 addSQL += `, ovrd_img_url \n`;
    // //                 addParam += `, '${postHospitalParam.ovrdImageUrl}' \n`
    // //             }
                
    // //             let insertGroupMbrSql = `insert into group_mbr(created_by
    // //                                                           ,created_on
    // //                                                           ,disp_ord
    // //                                                           ,group_id
    // //                                                           ,hospital_id
    // //                                                           ${addSQL} 
    // //                                                           )
    // //                                                           values(
    // //                                                             1
    // //                                                            ,now()
    // //                                                            ,'99' --원본에서 임시세팅해놓음
    // //                                                            ,${findGroupResult.rows[0].id}
    // //                                                            ,${saveResult.rows[0].id}
    // //                                                            ${addParam}
    // //                                                           )`
                
    // //             const insertGroupMbrResult = await db.query(poolClient, insertGroupMbrSql, []);
    // //         }

    // //         returnObj = {
    // //             code: 401,
    // //             message: `success !`,
    // //         };
            
    // //     } catch (err) {
    // //         returnObj = {
    // //             code: 401,
    // //             message: `error, ${JSON.stringify(err)}`,
    // //         };
    // //     } finally {
    // //         poolClient.release;
    // //         return returnObj;
    // //     }

    // // }


    // /*
    //     병원정보와 환자번호 가져와서 등록 (수정완료)
    //     사용 Table : hospital_mst, user_mst
    // */
    // async setPatientHospital(reqHospitalInfoParam: any) {
    //     const poolClient = await db.getPoolClient();
        
    //      let returnObj = {
    //         code : 200,
    //         message : "setPatientHospital",
    //         result : {}
    //     }
    //     //병원별 유저정보가 존재하면 환자정보를 가져온다.
    //     if (Object.keys(reqHospitalInfoParam).length == 0) {
    //         throw `파라미터 reqHospitalInfoParam 정보가 없습니다.`
    //     }

    //     let userMst;
    //     let userPatients;
    //     let delPatient;
    //     let insertPatient;

    //     try {
    //         db.transaction_Begin(poolClient);

    //         userMst = await this.hospitalRepositoryService.selectUserId(reqHospitalInfoParam, poolClient);
    //         this.logger.log(userMst);
    //         userPatients = await this.hospitalRepositoryService.getUserPatients(reqHospitalInfoParam, userMst, poolClient);
    //         this.logger.log(userPatients);
    //         delPatient = await this.hospitalRepositoryService.delPatientInfo(reqHospitalInfoParam, userMst, userPatients, poolClient);
    //         this.logger.log(delPatient);
    //         insertPatient = await this.hospitalRepositoryService.insertPatientInfo(reqHospitalInfoParam, userMst, userPatients, poolClient);
    //         this.logger.log(insertPatient);
    //         returnObj.result = insertPatient;

    //         db.transaction_Commit(poolClient);
    //     } catch (e){
    //         db.transaction_Rollback(poolClient);
    //         returnObj.code = 401;
    //         returnObj.result = "setPatientHospital failed"
    //     } finally {
    //         return returnObj;
    //     }
    // }



    // /*
    //     병원별 환자번호 삭제 (수정완료)
    //     사용 Table : hospital_mst, user_patient
    // */
    // async delPatientHospital(reqHospitalInfoParam: any) {
    //     const poolClient = await db.getPoolClient();
        
    //     let returnObj = {
    //         code : 200,
    //         message : "delPatientHospital",
    //         result : {}
    //     }

    //     let selectResult;
    //     let deleteResult;

    //     try {
    //         db.transaction_Begin(poolClient);

    //         selectResult = await this.hospitalRepositoryService.selectHospitalMst(reqHospitalInfoParam, poolClient);
    //         this.logger.log(selectResult);

    //         deleteResult = await this.hospitalRepositoryService.delUserPatient(reqHospitalInfoParam, selectResult, poolClient);
    //         this.logger.log(deleteResult);
    //         //삭제 결과 넣어주기
    //         returnObj.result = deleteResult;

    //         db.transaction_Commit(poolClient);
    //     } catch (e){
    //         db.transaction_Rollback(poolClient);
    //         returnObj.code = 401;
    //         returnObj.result = "delPatientHospital failed"
    //     } finally {
    //         return returnObj;
    //     }
    // }

    // /*
    //     병원 옵션 정보 저장 (수정완료)
    //     사용 Table : hospital_opt_site_map
    // */
    // async saveOptSiteMap(optSiteMapParam: any) {
    //     const poolClient = await db.getPoolClient();

    //     let returnObj = {
    //         code : 200,
    //         message : "saveOptSiteMap",
    //         result : {}
    //     }

    //     if (!optSiteMapParam.hospitalId) {
    //         throw '필수값 [hospitalId]가 없습니다.';
    //     }

    //     let savedSiteMap;
        
    //     try {
    //         db.transaction_Begin(poolClient);
            
    //         savedSiteMap = await this.hospitalRepositoryService.saveOptSiteMapToDB(optSiteMapParam, poolClient);
    //         this.logger.log(savedSiteMap);
    //         returnObj.result = savedSiteMap;
    //         db.transaction_Commit(poolClient);
    //     } catch (e){
    //         db.transaction_Rollback(poolClient);
    //         returnObj.code = 401;
    //         returnObj.result = "saveOptSiteMap failed"
    //     } finally {
    //         return returnObj;
    //     }
    // }

    // /*
    //     병원 옵션 정보 조회 (수정완료)
    //     사용 Table : code_mst, hospital_opt_site_map
    // */
    // async findAllByHospitalOptSiteMapList(hospitalId?: number, keyword?: string) {
    //     //connection Pool 생성
    //     const poolClient = await db.getPoolClient();
        
    //     let returnObj = {
    //         code : 200,
    //         message : 'findAllByHospitalOptSiteMapList',
    //         result : {}
    //     }

    //     let refVals;
    //     let optionList;
        
    //     if (null == hospitalId) {
    //         throw ('hospitalId를 입력해주세요.');
    //     }

    //     try{
    //         //인자로 넣을 ref_val 조회
    //         refVals = await this.hospitalRepositoryService.findRefValToCodeMst(hospitalId, keyword, poolClient);
    //         //refVals 값 확인
    //         this.logger.log(refVals.toString()); 

    //         //코드리스트 조회
    //         optionList = await this.hospitalRepositoryService.findHospitalOptSiteMapList(hospitalId, keyword, refVals, poolClient);
    //         returnObj.result = optionList;
    //     } catch(e){
    //         returnObj.code = 401;
    //         returnObj.message = 'findAllByHospitalOptSiteMapList fail'
    //     } finally {
    //         return returnObj;
    //     }
    // }

    // /*
    //     병원 그룹정보 조회 - 현재 DB에 데이터가 없음 (수정완료)
    //     사용 Table : group_mbr, hospital_mst
    // */
    // async getGroupHospitals(groupId?: string) {
    //     const poolClient = await db.getPoolClient();

    //     let returnObj = {
    //         code : 200,
    //         message : 'getGroupHospitals',
    //         result : {}
    //     }

    //     let group;

    //     try {
    //         group =  await this.hospitalRepositoryService.getGroupHospitalsToDB(groupId, poolClient);
            
    //         this.logger.log(group);
    //         returnObj.result = group;
    //     } catch(e){
    //         returnObj.code = 401;
    //         returnObj.message = 'getGroupHospitals fail'
    //     } finally {
    //         return returnObj;
    //     }
        
    // }

    // /*
    //     병원 코드 목록 조회(수정완료)
    //     사용 Table : code_mst, hospital_opt_cd
    // */
    // async hospitalFindAllByKeyword(hospitalId?: number, keyword?: string) {
    //     const poolClient = await db.getPoolClient();
        
    //     let returnObj = {
    //         code : 200,
    //         message : 'hospitalFindAllByKeyword',
    //         result : {}
    //     }

    //     let hospitalOptCd;

    //     //필수값 체크
    //     if (!hospitalId || hospitalId == null || hospitalId == undefined) {
    //         throw '필수값 [hospitalId]가 없습니다.';
    //     }

    //     try {
    //         hospitalOptCd = await this.hospitalRepositoryService.hospitalFindOptCd(hospitalId, keyword, poolClient);
            
    //         this.logger.log(hospitalOptCd); 
    //         returnObj.result = hospitalOptCd;
    //     } catch(e){
    //         returnObj.code = 401;
    //         returnObj.message = 'hospitalFindAllByKeyword fail'
    //     } finally {
    //         return returnObj;
    //     }
    // }

    // /*
    //     병원 옵션코드 저장 (수정완료)
    //     저장 Table : hospital_opt_cd
    // */
    // async saveOptCode(optInfo: any) {
    //     //connection pool 생성
    //     const poolClient = await db.getPoolClient();

    //     let returnObj = {
    //         code : 200,
    //         message : "saveOptCode",
    //         result : {}
    //     }

    //     let savedOpt;

    //     if (!optInfo.hospitalId || optInfo.hospitalId == null) {
    //         throw '필수값 [hospitalId]가 없습니다.';
    //     }

    //     try {
    //         db.transaction_Begin(poolClient);
    //         savedOpt = await this.hospitalRepositoryService.saveOptCode(optInfo, poolClient);

    //         this.logger.log(savedOpt);
    //         returnObj.result = savedOpt;

    //         db.transaction_Commit(poolClient);
    //      } catch (e){
    //         db.transaction_Rollback(poolClient);
    //         returnObj.code = 401;
    //         returnObj.result = "saveOptCode failed"
    //     } finally {
    //         return returnObj;
    //     }
    // }
}
