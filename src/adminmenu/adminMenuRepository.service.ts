import { Injectable } from '@nestjs/common';
import * as db from '../db';
import { Logger } from '@nestjs/common'


@Injectable()
export class AdminMenuRepositoryService {

    private readonly logger = new Logger(AdminMenuRepositoryService.name);

    /* 어드민 메뉴 조회 */
    async getAdminMenuMst(hosCd: string, poolClient: any) {
         return new Promise(async (resolve, reject) => {
             try {
                const schemaNm = await db.getSchemaNm(hosCd);
                let sql = `select  id
                                  ,created_by as "createdBy"
                                  ,created_on as "createdOn"
                                  ,updated_by as "updatedBy"
                                  ,updated_on as "updatedOn"
                                  ,menu_desc as "menuDesc"
                                  ,hospital_cd as "hospitalCd"
                                  ,name
                               from ${schemaNm}.admin_menu_mst
                               order by id`

                const result = await db.query(poolClient, sql, []);
                
                resolve(result.rows);
            } catch (err) {
                reject(`error, ${JSON.stringify(err)}`);
            }
         });
    }

    /* 어드민 메뉴 등록 */
    async insertAdminMenu(hosCd: string,adminMenuParam: any, poolClient: any) {
        return new Promise(async (resolve, reject) => {
            try {
                let addSQL = ``;
                let addParam = ``;
                console.log(`hosCd`, hosCd)
                const schemaNm = await db.getSchemaNm(hosCd);

                if (adminMenuParam.menuDesc) {
                    addSQL += `, menu_desc \n`;
                    addParam += `, '${adminMenuParam.menuDesc}' \n`;
                }
                if (adminMenuParam.hospitalCd) {
                    addSQL += `, hospital_cd \n`;
                    addParam += `, '${adminMenuParam.hospitalCd}' \n`;
                }
               
                console.log(`schemaNm`, schemaNm)
                let saveAdminMenuSql = `insert into ${schemaNm}.admin_menu_mst(created_by
                                                            ,created_on
                                                            ,name
                                                            ${addSQL}
                                                            ) values(
                                                                ${adminMenuParam.adminUserId}
                                                                , now()
                                                                , '${adminMenuParam.name}'
                                                                ${addParam}
                                                                ) RETURNING * `
                
                const saveResult = await db.query(poolClient, saveAdminMenuSql, []);

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

    /* 어드민 메뉴 수정 */
    async updateAdminMenuMst(hosCd: string, adminMenuParam: any, poolClient: any) {
        return new Promise(async (resolve, reject) => {
            try{
                const schemaNm = await db.getSchemaNm(hosCd);
                //sql 쿼리 추가
                function sqlChk(adminMenuParam: any) {
                    let addSQL = ``;

                    adminMenuParam.name ? addSQL += `, name = '${adminMenuParam.name}' \n` : ``;
                    adminMenuParam.menuDesc ? addSQL += `, menu_desc = '${adminMenuParam.menuDesc}' \n` : ``;
                    adminMenuParam.hospitalCd ? addSQL += `, hospital_cd = '${adminMenuParam.hospitalCd}' \n` : ``;
                    
                    return addSQL;
                }

                let updateSql = `UPDATE ${schemaNm}.admin_menu_mst
                                 SET       updated_by = ${adminMenuParam.adminUserId}       
                                         , updated_on = Now()
                                         ${sqlChk(adminMenuParam)}
                                 WHERE     id = ${adminMenuParam.id}
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
    
    /* 어드민 유저 레벨 변경 */
    async updateUserAdminLevel(hosCd:string, adminParam: any, poolClient: any) {
        return new Promise(async (resolve, reject) => {
            try {
                const schemaNm = await db.getSchemaNm(hosCd);
                
                let sql = `update ${schemaNm}.user_admin 
                           set      admin_level = ${adminParam.adminLevel}
                           where user_id = ${adminParam.adminUserId}
                           returning *`;
                
                const updateResult = await db.query(poolClient, sql, []);

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

    /* 레벨별 어드민 메뉴 조회 */
    async selectAdminMenuByLevel(hosCd: string, allowLevel: number, hospitalCd: string, poolClient: any) {
        return new Promise(async (resolve, reject) => {
            try {
                let addSql = ``;
                if (hospitalCd) {
                    addSql = `and mm.hospital_cd = '${hospitalCd}'`
                }
                const schemaNm = await db.getSchemaNm(hosCd);
                let sql = `select   mm.id
                                    ,mm.created_by as "createdBy"
                                    ,mm.created_on as "createdOn"
                                    ,mm.updated_by as "updatedBy"
                                    ,mm.updated_on as "updatedOn"
                                    ,mm.menu_desc as "menuDesc" 
                                    ,mm.name as name
                                    ,mm.hospital_cd as "hospitalCd"
                                    ,ma.enabled
                                from ${schemaNm}.admin_menu_mst mm
                                    ,${schemaNm}.admin_menu_allow ma
                            where mm.id = ma.menu_id
                              and ma.allow_level = ${allowLevel}
                              ${addSql}
                              and ma.enabled = true;`
                
                const result = await db.query(poolClient, sql, []);
                resolve(result.rows);
            } catch (err) {
                reject(`error, ${JSON.stringify(err)}`);
            }
         });
    }

    /* 레벨별 어드민 메뉴 등록1 (동일 값 있는지 확인 로직) */
    async getAdminMenuAllowCount(hosCd: string, adminMenuParam: any, poolClient: any) {
        return new Promise(async (resolve, reject) => {
            try {
                const schemaNm = await db.getSchemaNm(hosCd);
                let sql= `SELECT Count(*) AS count
                            FROM ${schemaNm}.admin_menu_allow
                            WHERE menu_id = ${adminMenuParam.menuId}
                                AND allow_level = ${adminMenuParam.allowLevel};`
                
                const result = await db.query(poolClient, sql, []);

                resolve(result.rows[0].count);
            } catch (err) {
                reject(`error, ${JSON.stringify(err)}`);
            }
         });
    }
    /* 레벨별 어드민 메뉴 등록2 (동일 값 있으면 enabled수정 / 없으면 저장) */
    async saveAdminMenuAllow(hosCd: string, adminMenuParam: any, checkValue: string, poolClient: any) {
        return new Promise(async (resolve, reject) => {
            try {
                const schemaNm = await db.getSchemaNm(hosCd);
                if (checkValue == "update") {
                    let addSql =``;

                    if (adminMenuParam.allowDesc) {
                        addSql += `,allow_desc = '${adminMenuParam.allowDesc}'`
                    }

                    let updateSql = ` update ${schemaNm}.admin_menu_allow
                                         set enabled = true
                                            ,updated_by = ${adminMenuParam.adminUserId}
                                            ,updated_on = now()
                                            ${addSql}
                                       where menu_id = ${adminMenuParam.menuId}
                                         and allow_level = ${adminMenuParam.allowLevel}
                                      returning * ;`

                    const result = await db.query(poolClient, updateSql, []);

                    if (result.rowCount > 0) {
                        resolve(result.rows);
                    } else {
                        reject('update Failed');
                    }

                } else if (checkValue == "insert") {
                    let addSql =``;
                    let addParam = ``;

                    if (adminMenuParam.allowDesc) {
                        addSql += `,allow_desc`
                        addParam += `,'${adminMenuParam.allowDesc}'`
                    }

                    let insertSql = ` insert into ${schemaNm}.admin_menu_allow(menu_id
                                                                                ,alloW_level
                                                                                ,created_by
                                                                                ,created_on
                                                                                ,enabled
                                                                                ${addSql}
                                                                                )
                                                                                values(${adminMenuParam.menuId}
                                                                                        ,${adminMenuParam.allowLevel}
                                                                                        ,${adminMenuParam.adminUserId}
                                                                                        ,now()
                                                                                        ,true
                                                                                        ${addParam}
                                                                                        )
                                                                                        returning *;`
                    
                    const result = await db.query(poolClient, insertSql, []);
                    if (result.rowCount > 0) {
                        resolve(result.rows);
                    } else {
                            reject('insert Failed');
                    }
                }
            } catch (err) {
                reject(`error, ${JSON.stringify(err)}`);
            }
         });
    }

    /* 레벨별 어드민 메뉴 활성화/비활성화 */
    async flagAdminMenuAllow(hosCd: string, params: any, poolClient: any) {
        return new Promise(async (resolve, reject) => {
            try {

                const schemaNm = await db.getSchemaNm(hosCd);
                let updateSql = ` update ${schemaNm}.admin_menu_allow
                                         set enabled = ${params.enabled}
                                            ,updated_by = ${params.adminUserId}
                                            ,updated_on = now()
                                       where menu_id = ${params.menuId}
                                         and allow_level = ${params.allowLevel}
                                      returning * ;`
    
                const result = await db.query(poolClient, updateSql, []);
                
                if (result.rowCount > 0) {
                    resolve(result.rows);
                } else {
                    reject('flag update Failed');
                }
            } catch (err) {
                reject(`error, ${JSON.stringify(err)}`);
            }
         });
    }
}