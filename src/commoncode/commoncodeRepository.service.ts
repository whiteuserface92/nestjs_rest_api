import { Injectable } from '@nestjs/common';
import * as db from '../db';

@Injectable()
export class CommonCodeRepositoryService {

    async findDistinctCodeCls(hosCd : string, poolClient : any){
        return new Promise(async (resolve, reject) => {
            const schemaNm = await db.getSchemaNm(hosCd);

            let result : any;

            try {
                const sql = `SELECT DISTINCT code_cls FROM ${schemaNm}.code_mst cm`;
                
                console.log(sql);

                result = await db.query(poolClient, sql, []);

                
                if(result.rowCount <= 0){
                    reject(`hospitalMenusFindById failed`)
                }else{
                    resolve(result.rows)
                }
            } catch (err) {
                reject("hospitalMenusFindById failed")
            } 
        });
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

    async findByCodeClsDetailList(hosCd : string, codeCls : string, poolClient : any){
        return new Promise(async (resolve, reject) => {

                const schemaNm = await db.getSchemaNm(hosCd);
            
                let result;

                try {
                    const sql = ` SELECT a.id,
                                         a.ref_val as "refVal",
                                         a.code_nm as "codeNm",
                                         a.disp_ord as "dispOrd"
                                      FROM ${schemaNm}.code_mst a 
                                    WHERE a.code_cls = '${codeCls}' 
                                      AND a.code_type='2'
                                   ORDER BY a.disp_ord ASC`;
                    
                    await console.log(sql);

                    result = await db.query(poolClient, sql, []);

                    await console.log(result)

                    if(result.rowCount <= 0){
                        reject(`findByCodeClsDetailList failed`)
                    }else{
                        resolve(result.rows[0])
                    }
                } catch (err) {
                    reject("findByCodeClsDetailList failed")
                } 
        });
    }

}