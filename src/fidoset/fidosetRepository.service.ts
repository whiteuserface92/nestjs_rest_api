import { Injectable } from '@nestjs/common';
import * as db from '../db';

@Injectable()
export class FidoSetRepositoryService {

    

    async findAllByKeyword(hosCd:string, poolClient : any, hospitalId : number){
        let schemaNm: string;
        let result;

            try {  
                schemaNm = await db.getSchemaNm(hosCd);
                
                

                const selCountSql = `select count(1) `;

                const selectSql = `select 
                                        a.id as id 
                                        ,a.tenant_cd as tenantCd
                                        ,a.api_key as apiKey
                                        ,a.hospital_id as hospitalId
                                        ,b.hospital_nm as hospitalNm
                                        ,b.hospital_cd as hospitalCd
                                        ,a.created_by as createdBy
                                        ,a.created_on as createdOn
                                        ,a.updated_by as updatedBy
                                        ,a.updated_on as updatedOn `;

                const fromSql = `from ${schemaNm}.fido_set a 
                                left outer join ${schemaNm}.hospital_mst b on a.hospital_id = b.id `;

                let whereSql;

                if(hospitalId != null || hospitalId != undefined){
                    whereSql = `where hospital_id = ${hospitalId} `;
                }
                
                const orderSql = ` order by a.id `;

                const countSql = selCountSql + fromSql + whereSql;

                const querySql = selectSql + fromSql + whereSql + orderSql;

                //로직은 만들어놨지만, 현재 API서버에서 pageable countQuery 는 사용하지 않는다.
                // countResult = await db.query(poolClient, countSql, []);

                result = await db.query(poolClient, querySql, []);
                
                console.log(result.rows); 
                return Promise.resolve(result.rows);
            } catch(err){
                return Promise.reject(`[${schemaNm}.fido_set] FidoSetRepositoryService findAllByKeyword err, ${err}`)
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

    async findByTenantCd(hosCd:string, poolClient : any, tenantCd : string ){
            let schemaNm: string;

            try {
                schemaNm = await db.getSchemaNm(hosCd);
                const selectSql = `SELECT * FROM ${schemaNm}.fido_set WHERE tenant_cd = '${tenantCd}'`;
                //로직은 만들어놨지만, 현재 API서버에서 pageable countQuery 는 사용하지 않는다.
                // countResult = await db.query(poolClient, countSql, []);
                // await console.log(selectSql);
                const result = await db.query(poolClient, selectSql, []);
                // await console.log(JSON.stringify(result));
                Promise.resolve(result.rows);
            } catch(e){
                Promise.reject('findByTenantCd fail')
            }
    }
}