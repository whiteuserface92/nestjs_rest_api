import { Injectable } from '@nestjs/common';
import * as db from '../db';
import { Certificate } from 'crypto';

@Injectable()
export class MenuRepositoryService {


    /* 전체 유저 메뉴 검색 */
    async selectUserMenu(hosCd: string, poolClient: any, userMenuParams: any) {
        
        try {
            const schemaNm = await db.getSchemaNm(hosCd);

            let addSQL = ``;
            let addJoin = ``;
            if (userMenuParams.allowType) {
                addJoin += `\ninner join user_menu_allow b
                               on a.id = b.menu_id`
                addSQL += `\nand b.allow_type in (${userMenuParams.allowType})
                           \nand b.enabled = true`;
            }
            if (userMenuParams.hospitalCd) {
                addSQL += `\nand a.hospital_cd = '${userMenuParams.hospitalCd}'`;
            }
            if (userMenuParams.enabled != null) {
                if (userMenuParams.enabled) {
                    addSQL += `\nand a.enabled = true`;
                } else if (!userMenuParams.enabled) {
                    addSQL += `\nand a.enabled = false`;
                }
            }

            let sql = `select a.id,
                              a."name",
                              a.parent_id as "parentId",
                              a.service_url as "serviceUrl",
                              a.disp_ord as "dispOrd",
                              a.menu_type as "menuType",
                              a.menu_desc as "menuDesc",
                              a.created_by as "createdBy",
                              a.created_on as "createdOn",
                              a.updated_by as "updatedBy",
                              a.updated_on as "updatedOn",
                              a.hospital_cd as "hospitalCd",
                              case when (select STRING_AGG(c.allow_type::character varying, ',' order by allow_type)
                                            from user_menu_allow c
                                          where a.id=c.menu_id 
                                            and c.enabled = true
                                        )  is null then ''
                                else 
                                        (select STRING_AGG(c.allow_type::character varying, ',' order by allow_type)
                                            from user_menu_allow c
                                          where a.id=c.menu_id 
                                            and c.enabled = true
                                        )
                                    end as "ocpType",
                              a.enabled
                            from ${schemaNm}.user_menu_mst a
                              ${addJoin}
                          where 1=1
                          ${addSQL}
                          group by a.id
                        order by a.id;`
            // console.log(sql);
            const result = await db.query(poolClient, sql, []);

            return Promise.resolve(result.rows);
        } catch (err) {
            return Promise.reject(`error, ${JSON.stringify(err)}`);
        } 
    }

    // async selectMenuIdFromUserMenuMstAndUserMenuAllow(hosCd: string, poolClient: any, menuId: number){
    //     try {
    //         const schemaNm = await db.getSchemaNm(hosCd);

    //         const sql = `
    //                     select 
    //                         menu_id AS "menuId" 
    //                     from ${schemaNm}.user_menu_allow ua, ${schemaNm}.user_menu_mst um 
    //                         where ua.menu_id=um.id and um.id = ${menuId} 
    //                     `;
    //         console.log(sql);
    //         const result = await db.query(poolClient, sql, []);
    //         return Promise.resolve(result.rows)
    //     } catch (err){
    //         return Promise.reject(`error, ${JSON.stringify(err)}`);
    //     }
    // }

    // async selectUserMenuAllowByUserType(hosCd: string, poolClient: any, userType: any){
    //     try {
    //         const schemaNm = await db.getSchemaNm(hosCd);

    //         const sql = `
    //                     select menu_id AS "menuId" from ${schemaNm}.user_menu_allow where allow_type like '%${userType}%' and enabled = true
    //                     `;
    //         console.log(sql);
    //         const result = await db.query(poolClient, sql, []);
    //         return Promise.resolve(result.rows)
    //     } catch (err){
    //         return Promise.reject(`error, ${JSON.stringify(err)}`);
    //     }
    // }

    // async seletcUserMenuMstByUserIdList(hosCd: string, poolClient: any, userMenuParams: any){

    //     let addNameSql: string;
    //     let addMenuTypeSql: string;
    //     let addMenuDescSql: string;
    //     let addUserIdSql: string;
        
    //     try {
    //         const schemaNm = await db.getSchemaNm(hosCd);

    //         addNameSql = ``;
    //         addMenuTypeSql = ``;
    //         addMenuDescSql = ``;
    //         addUserIdSql = ``;

    //         let queryCount : number = 0;

    //         if(userMenuParams.name){
    //             addNameSql = ` AND mm.name LIKE CONCAT('%','${userMenuParams.name}','%') `;
    //             queryCount += 1; 
    //         } else {
    //             addNameSql = ``;
    //         }

    //         if(userMenuParams.menuType){
    //             addMenuTypeSql = ` AND mm.menu_type LIKE CONCAT('%','${userMenuParams.menuType}','%') `;
    //             queryCount += 1; 
    //         } else {
    //             addMenuTypeSql = ``;
    //         }

    //         if(userMenuParams.menuDesc){
    //             addMenuDescSql = ` AND mm.menu_desc LIKE CONCAT('%','${userMenuParams.menuDesc}','%') `;
    //             queryCount += 1;
    //         } else {
    //             addMenuDescSql = ``;
    //         }
            
    //         //userId가 있을 시 userType이 같이 나오도록 설정
    //         if(userMenuParams.userId){
    //             addUserIdSql = ` , (select user_type from ${schemaNm}.user_mst where id = ${userMenuParams.userId}) AS "userType" `;
    //             queryCount += 1;
    //         } else {
    //             addMenuDescSql = ``;
    //         }

    //         let sql = `
    //                    select mm.id,
    //                           mm.name,
    //                           mm.parent_id AS "parentId",
    //                           mm.service_url AS "serviceUrl",
    //                           mm.disp_ord AS "dispOrd",
    //                           mm.menu_type AS "menuType",
    //                           mm.menu_desc AS "menuDesc",
    //                           mm.created_by AS "createdBy",
    //                           mm.created_on AS "createdOn",
    //                           mm.updated_by AS "updatedBy",
    //                           mm.updated_on AS "updatedOn",
    //                           mm.hospital_cd AS "hospitalCd" ${addUserIdSql}
    //                     from  ${schemaNm}.user_menu_mst mm where id in (${userMenuParams.userMenuListString}) ${addNameSql} ${addMenuTypeSql} ${addMenuDescSql}
    //                     ORDER by disp_ord ASC, id ASC    
    //                 `
    //         console.log(sql);
    //         // let sql = `select mm.id,
    //         //                   mm.name,
    //         //                   mm.parent_id AS parentId,
    //         //                   mm.service_url AS serviceUrl,
    //         //                   mm.disp_ord AS dispOrd,
    //         //                   mm.menu_type AS menuType,
    //         //                   mm.menu_desc AS menuDesc,
    //         //                   mm.created_by AS createdBy,
    //         //                   mm.created_on AS createdOn,
    //         //                   mm.updated_by AS updatedBy,
    //         //                   mm.updated_on AS updatedOn,
    //         //                   mm.hospital_cd AS hospitalCd,  
    //         //                 from ${schemaNm}.user_mst ua
    //         //                 , ${schemaNm}.user_menu_mst mm
    //         //                 , ${schemaNm}.user_menu_allow ma
    //         //             where ua.user_type = ma.allow_type
    //         //                 and mm.id = ma.menu_id
    //         //                 and ua.hospital_cd = mm.hospital_cd
    //         //                 and ma.enabled = true
    //         //                 ${addNameSql}
    //         //                 ${addUserIdSql}
    //         //                 ${addMenuTypeSql}
    //         //                 ${addMenuDescSql} 
    //         //                 order by disp_ord ASC; 
    //         //             `;
    //         // console.log(sql);
    //         const result = await db.query(poolClient, sql, []);

    //         return Promise.resolve(result.rows);
    //     } catch (err) {
    //         return Promise.reject(`error, ${JSON.stringify(err)}`);
    //     } 
    // }
    
    //allow 테이블 등록
    async insertUserMenuAllow(hosCd: string, poolClient: any, menuId: string, userId: string, allowType: string){
        let schemaNm: string;
        try{
            schemaNm = await db.getSchemaNm(hosCd);

            let sql = ` insert into ${schemaNm}.user_menu_allow(
                                                                menu_id,
                                                                allow_type,
                                                                created_by,
                                                                created_on,
                                                                allow_desc,
                                                                enabled)
                                                                values(${menuId}, 
                                                                      '${allowType}', 
                                                                       ${userId}, 
                                                                       now(),
                                                                      '${allowType}-allowDesc', 
                                                                       true) RETURNING menu_id as "menuId",
                                                                                        allow_type as "allowType",
                                                                                        created_by as "createdBy",
                                                                                        created_on as "createdOn",
                                                                                        allow_desc as "allowDesc",
                                                                                        enabled `;

            console.log(sql);
            const result = await db.query(poolClient, sql, []);

            return Promise.resolve(result.rows[0]);
        } catch(err){
            return Promise.reject(`error, ${JSON.stringify(err)}`);
        }
    }

    /* 유저 메뉴 등록 (Mst 테이블) */
    async insertUserMenuMst(hosCd: string, poolClient: any, menuParams: any) {

        let addSql: string;
        let addParam: string;
        let schemaNm: string;

        try { 
            schemaNm = await db.getSchemaNm(hosCd);

            addSql=``;
            addParam=``;

            if (menuParams.parentId) {
                addSql += `,parent_id \n`
                addParam += `,${menuParams.parentId} \n`
            }

            if (menuParams.serviceUrl) {
                addSql += `,service_url \n`
                addParam += `,'${menuParams.serviceUrl}' \n`
            }

            if (menuParams.menuDesc) {
                addSql += `,menu_desc \n`
                addParam += `,'${menuParams.menuDesc}' \n`
            }

            if (menuParams.hospitalCd) {
                addSql += `,hospital_cd \n`
                addParam += `,'${menuParams.hospitalCd}' \n`
            }

            if (menuParams.enabled != null) {
                if (menuParams.enabled) {
                    addSql += `,enabled \n`
                    addParam += `,true \n`
                }
                if (!menuParams.enabled) {
                    addSql += `,enabled \n`
                    addParam += `,false \n`
                }
            }

            let sql = `insert into ${schemaNm}.user_menu_mst(
                                                "name"      
                                                ,disp_ord 
                                                ,menu_type
                                                ,created_by 
                                                ,created_on --여기까지가 필수값
                                                ${addSql})
                                                values ('${menuParams.name}'
                                                        ,${menuParams.dispOrd}
                                                        ,'${menuParams.menuType}'
                                                        ,${menuParams.userId}
                                                        ,now()
                                                        ${addParam}) returning id,
                                                                               name,
                                                                               parent_id as "parentId",
                                                                               service_url as "serviceUrl",
                                                                               disp_ord as "dispOrd",
                                                                               menu_type as "menuType",
                                                                               menu_desc as "menuDesc",
                                                                               created_by as "createdBy",
                                                                               created_on as "createdOn",
                                                                               hospital_cd as "hospitalCd",
                                                                               enabled`;
            const result = await db.query(poolClient, sql, []);
            
            return Promise.resolve(result.rows); 
        } catch (err) {
            console.log(err);
            console.log(addSql);
            console.log(addParam);
            return Promise.reject(`error, ${JSON.stringify(err)}`);
        }
    }

     /* 유저 메뉴 enabled 수정 (allow 테이블) */
    async updateUserAllow(hosCd: string, poolClient: any, modifyUserMenuParams: any, flag: boolean) {

        let schemaNm: string;
        let addSQL = ``;
        try { 
            schemaNm = await db.getSchemaNm(hosCd);

            if (flag == true) {
                addSQL += `and allow_type in (${modifyUserMenuParams.allowType})`
            } else if (flag == false) {
                addSQL += `and not allow_type in (${modifyUserMenuParams.allowType})`
            }
    
            let sql = ` update ${schemaNm}.user_menu_allow
                           set enabled = ${flag}
                              ,updated_by = ${modifyUserMenuParams.userId}
                              ,updated_on = now()
                          where menu_id = ${modifyUserMenuParams.menuId}
                            and enabled = ${!flag}
                            ${addSQL}
                        returning menu_id as "menuId",
                                    allow_type as "allowType",
                                    updated_by as "updatedBy",
                                    updated_on as "updatedOn",
                                    allow_desc as "allowDesc",
                                    enabled;`
            const result = await db.query(poolClient, sql, []);
            
            return Promise.resolve(result.rows); 
        } catch (err) {
            console.log(err);
            return Promise.reject(`error, ${JSON.stringify(err)}`);
        }
    }

    //menuId와 allowType으로 행이 있는지 확인
    async selectFlagByMenuId(hosCd: string, poolClient: any, allowType: string, menuId: string) {
        
        try {
            const schemaNm = await db.getSchemaNm(hosCd); 

            let sql = `select case when count(*) > 0 then true
                                   when count(*) = 0 then false
                                end as flag
                           from ${schemaNm}.user_menu_allow
                         where menu_id = ${menuId}
                           and allow_type = '${allowType}';`
            // console.log(sql);
            const result = await db.query(poolClient, sql, []);

            return Promise.resolve(result.rows[0].flag);
        } catch (err) {
            return Promise.reject(`error, ${JSON.stringify(err)}`);
        } 
    }

    async updateUserMenuMst(hosCd: string, poolClient: any, param: any){
        let addUmSql: string;

        let setUmQueryCount: number;

        let umQueryResult: any;

        const schemaNm = await db.getSchemaNm(hosCd);

        try {
            setUmQueryCount = 0;

            addUmSql = ``;

            //dispOrd settings
            if (param.dispOrd){
                addUmSql += ` disp_ord = ${param.dispOrd}, `;
                setUmQueryCount += 1;
            }

            //menuType settings
            if(param.menuType){
                addUmSql += ` menu_type = '${param.menuType}', `
                setUmQueryCount += 1;
            }

            //menuDesc settings
            if(param.menuDesc){
                addUmSql += ` menu_desc = '${param.menuDesc}', `;
                setUmQueryCount += 1;
            }

            //parentId settings
            if(param.parentId){
                addUmSql += ` parent_id = ${param.parentId}, `
                setUmQueryCount += 1;
            }

            //hospitalCd settings
            if(param.hospitalCd){
                addUmSql += ` hospital_cd = '${param.hospitalCd}', `;
                setUmQueryCount += 1;
            }

            //name settings
            if(param.name){
                addUmSql += ` name = '${param.name}', `
                setUmQueryCount += 1;
            }

            //serviceUrl settings
            if(param.serviceUrl){
                addUmSql += ` service_url = '${param.serviceUrl}', `
                setUmQueryCount += 1;
            }

            //enabled settings
            if (param.enabled != null) {       
                if(param.enabled){
                    addUmSql += ` enabled = true, `
                    setUmQueryCount += 1;
                }
                if(!param.enabled){
                    addUmSql += ` enabled = false, `
                    setUmQueryCount += 1;
                }
            }

            if(setUmQueryCount == 0){
                // throw 'user_menu_mst의 수정할 데이터가 없습니다.'
                let selectUmSql = ` select * from user_menu_mst where id=${param.menuId} `;
                //console.log('selectUmSql : '+selectUmSql);
                umQueryResult = await db.query(poolClient, selectUmSql, []);
                //console.log(umQueryResult)
                return Promise.resolve(umQueryResult.rows);
            } else {
                let updateUmSql = ` UPDATE ${schemaNm}.user_menu_mst um 
                                       SET ${addUmSql} 
                                           updated_by = ${param.userId}, 
                                           updated_on = NOW()
                                      WHERE id = ${param.menuId} 
                                    RETURNING id,
                                              name,
                                              parent_id as "parentId",
                                              service_url as "serviceUrl",
                                              disp_ord as "dispOrd",
                                              menu_type as "menuType",
                                              menu_desc as "menuDesc",
                                              updated_by as "updatedBy",
                                              updated_on as "updatedOn",
                                              hospital_cd as "hospitalCd",
                                              enabled`;
                //console.log('updateUmSql : '+updateUmSql);
                umQueryResult = await db.query(poolClient, updateUmSql, []);
                //console.log(umQueryResult)
                return Promise.resolve(umQueryResult.rows);
            }
        } catch (err) {
            return Promise.reject(`error, ${err}`);
        }
    }

}