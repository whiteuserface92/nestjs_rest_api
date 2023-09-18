import { Injectable } from '@nestjs/common';
import * as db from '../db';

@Injectable()
export class StatRepositoryService {

    async getPeriodMenuStat(hosCd : string,hospitalCd : string, startDt : string, endDt : string, poolClient : any){
        return new Promise(async (resolve, reject) => {
            const schemaNm = await db.getSchemaNm(hosCd);
            let result : any;
            let addQuery = "";
            //만약 hospitalCd가 있다면 해당 query 추가
            if(hospitalCd){
                addQuery = `and hospital_cd  = '${hospitalCd}'`
            }

            try {
                const sql = `SELECT coalesce(json_agg(q), '[]'::json)::text
                                from 
                                    ( select 
                                        ( select hm.id from hospital_mst hm where hm.hospital_cd = sm.hospital_cd) as "hospitalId"
                                        , hospital_cd as "hospitalCd"
                                        , hospital_nm as "hospitalNm"
                                        , ( select msg_content from i18n_msg im where msg_cd = menu_cd and lang_cd = '" + lang + "' ) as "menuNameCd"
                                        , ( select msg_content from i18n_msg im where msg_cd = hospital_menu_cd and lang_cd = '" + lang + "' ) as "ovrdNameCd"
                                        , sum( cnt ) as "cnt" 
                                    from lemon_eis.stat_menu sm
                                    where 1 = 1
                                    and stat_dt between '${startDt}' and '${endDt}' ${addQuery}
                                    group by hospital_cd , hospital_nm , menu_cd, hospital_menu_cd
                                    order by sum( cnt )  desc ) q `;
                
                console.log(sql);
            
                result = await db.query(poolClient, sql, []);


                if(result.rowCount > 0){
                    resolve(result.rows)
                } else {
                    reject("StatService getPeriodMenuStat failed")
                }
            } catch (err) {
                reject("StatService getPeriodMenuStat failed")
            } 
        });
    }

    async getUserStat(hosCd : string,startDt : string, endDt : string, poolClient : any){
        return new Promise(async (resolve, reject) => {
            const schemaNm = await db.getSchemaNm(hosCd);
            let result : any;

            try {
                const sql = `SELECT coalesce(json_agg(q), '[]'::json)::text 
                                from                                            
                                (select stat_dt            as "ymd"             
                                        , ''               as "menuHospitalId"  
                                        , hospital_cd      as "hospitalId"      
                                        , sum( cnt )       as "cnt"             
                                    
                                        from lemon_eis.stat_menu sm                 
                                        
                                        where stat_dt between '${startDt}' and '${endDt}'    
                                    
                                        group by stat_dt, hospital_cd              
                                        order by stat_dt asc, sum( cnt ) asc ) 
                                q`;
                    
                console.log(sql);

                result = await db.query(poolClient, sql, []);
                if(result.rowCount > 0){
                    resolve(result.rows)
                } else {
                    reject("StatService getPeriodMenuStat failed")
                }
            } catch (err) {
                reject("StatService getPeriodMenuStat failed")
            } 
        });
    }

    async getUserHourlyStat(hosCd : string,startDt : string, endDt : string, poolClient: any){
        return new Promise(async (resolve, reject) => {
            const schemaNm = await db.getSchemaNm(hosCd);
            let result : any;

            let whereSql = ` and a.created_on between '${startDt}' and '${endDt}' `;

            let selectSql = `
                            SELECT coalesce(json_agg(q), '[]'::json)::text 
                            from 
                            ( 
                            SELECT * 
                            FROM 
                                (SELECT concat(a.created_on::DATE,' 24:00:00')::text as ymd, 
                                to_char(a.created_on,'HH') as hours , 
                                        a.hospital_id as "menuHospitalId", 
                                        b.hospital_id as "hospitalId", 
                                        count(*) as cnt 
                                FROM   app_menu_log a 
                                INNER JOIN hospital_menu b on a.hospital_menu_id = b.id 
                                INNER JOIN hospital_mst d on b.hospital_id = d.id 
                                WHERE    a.log_type <> 99 
                                AND    a.menu_id is not null 
                                ${whereSql}
                                group by  a.created_on::DATE,
                                            to_char(a.created_on,'HH'), 
                                a.hospital_id, 
                                b.hospital_id 
                                ) T  order by ymd asc, hours asc, cnt desc 
                            ) q `;

            

            let querySql = selectSql;

            try {
                const sql = querySql;
                    
                console.log(sql);

                result = await db.query(poolClient, sql, []);
                if(result.rowCount > 0){
                    resolve(result.rows)
                } else {
                    reject("StatService getPeriodMenuStat failed")
                }
            } catch (err) {
                reject("StatService getUserHourlyStat failed")
            } 
        });
    }

    async getLoginLogStat(hosCd : string,startDt :string, endDt: string, platformType: string, hospitalId: string, poolClient : any){
        return new Promise(async (resolve, reject) => {
            const schemaNm = await db.getSchemaNm(hosCd);
            let result : any;
            try {
                const sql = `
                SELECT coalesce(json_agg(q), '[]'::json)::text 
                        from 
                        ( 
                        SELECT leged_on as "legetOn"
                            , service_nm as "serviceNm"
                                , ( CASE WHEN platform_type = 'ANDROID' THEN platform_type 
                                        WHEN platform_type = 'IOS' THEN platform_type 
                                        ELSE 'ETC' 
                                    END 
                                ) AS "platformType"
                                , hospital_id as "hospitalId"
                                , hospital_cd as "hospitalCd"
                                , hospital_nm as "hospitalNm"
                                , cnt 
                            FROM ( SELECT loged_on::date as leged_on , service_nm , hospital_id , platform_type , hospital_cd , hospital_nm , count( 1 ) AS cnt 
                                    FROM lemon_eis.stat_login 
                                WHERE loged_on BETWEEN '${startDt}' AND '${endDt}' 
                                    AND ( CASE WHEN 'ALL' = '${platformType}' THEN 'ALL' = '${platformType}'
                                                ELSE platform_type = '${platformType}'
                                            END 
                                        ) 
                                    AND ( CASE WHEN 0 = ${hospitalId}  THEN 0 = ${hospitalId}
                                            ELSE hospital_id = ${hospitalId} 
                                            END 
                                        ) 
                                    GROUP BY loged_on::date , service_nm , platform_type , hospital_id , hospital_cd , hospital_nm 
                                ) AA 
                        ORDER BY leged_on ASC 
                        ) q 
                `;
                                
                console.log(sql);

                result = await db.query(poolClient, sql, []);

                if(result.rowCount > 0){
                    resolve(result.rows)
                } else {
                    reject("StatService getLoginLogStat failed")
                }
            } catch (err) {
                reject("StatService getLoginLogStat failed")
            } 
        });

    }

    async getMonthlyLoginLogtat(hosCd : string,startMm: string, endMm: string, platformType: string, hospitalId: string, serviceNmAllSum: string, platformTypeAllSum: string, poolClient : any){
        return new Promise(async (resolve, reject) => {
            const schemaNm = await db.getSchemaNm(hosCd);
            let result : any;
            
            let querySql = `
                SELECT coalesce(json_agg(q), '[]'::json)::text         
                from                                                          
                    (                                                       
                        select a.loged_on       as "logedOn" 
                            , a.service_nm     as "serviceNm" 
                            , a.platform_type  as "platformType" 
                            , a.hospital_id    as "hospitalId" 
                            , a.hospital_cd    as "hospitalCd" 
                            , a.hospital_nm    as "hospitalNm" 
                            , sum(a.cnt)       as "cnt" 
                        from ( 
                                select to_char( loged_on, 'yyyy-mm') as loged_on 
                                    , case when 'Y' = '${serviceNmAllSum}' then 'ALLSUM' 
                                            else service_nm
                                        end as service_nm
                                    , case when 'Y' = '${platformTypeAllSum}' then 'ALLSUM' 
                                            else platform_type
                                        end as platform_type 
                                    , case when 0 = '${hospitalId}' then 0
                                            else hospital_id
                                        end
                                    , case when 0 = '${hospitalId}' then 'ALLSUM'
                                            else hospital_cd
                                        end as hospital_cd
                                    , case when 0 = '${hospitalId}' then 'ALLSUM'
                                            else hospital_nm
                                        end as hospital_nm
                                    , count(1) as cnt
                                    from lemon_eis.stat_login
                                where to_char( loged_on, 'yyyy-mm') between '${startMm}' and '${endMm}'
                                    and ( case when 'ALL' = '${platformType}' then 'ALL' = '${platformType}'
                                                else platform_type = '${platformType}'
                                            end
                                        )
                                    and ( case when 0 =  '${hospitalId}' then 0 =  '${hospitalId}'
                                                else hospital_id =  '${hospitalId}'
                                            end
                                        )
                                group by to_char( loged_on, 'yyyy-mm'), service_nm , platform_type , hospital_id , hospital_cd , hospital_nm
                                ) a
                        group by a.loged_on, a.service_nm, a.platform_type, a.hospital_id, a.hospital_cd, a.hospital_nm
                        order by a.loged_on asc 
                        ) q                                                 
                `;

            try {
                const sql = querySql;
                    
                console.log(sql);
    
                result = await db.query(poolClient, sql, []);
                if(result.rowCount > 0){
                    resolve(result.rows)
                } else {
                    reject("StatService getMonthlyLoginLogtat failed")
                }
            } catch (err) {
                reject("StatService getMonthlyLoginLogtat failed")
            } 
        });    
    }

    async getJoinStat(hosCd : string,startDt: string, endDt: string, hospitalCd: string, platformType, hospitalCdALL: string, ageCdAll: string, sexCdAll: string, areaCdAll: string, poolClient : any){
        return new Promise(async (resolve, reject) => {
            const schemaNm = await db.getSchemaNm(hosCd);
            let result : any;
            
            let querySql = `
                            SELECT coalesce(json_agg(q), '[]'::json)::text          
                            from                                                        
                                (                                                      
                                    select a.stat_dt       as "statDt" 
                                        , a.stat_ym       as "statYm" 
                                        , a.hospital_cd   as "hospitalCd" 
                                        , a.age_cd        as "ageCd" 
                                        , a.sex_cd        as "sexCd" 
                                        , a.area_cd       as "areaCd" 
                                        , a.platform_type as "platformType" 
                                        , sum(a.cnt)      as cnt
                                    from ( select stat_dt 
                                                , stat_ym
                                                , case when 'Y' = '${hospitalCdALL}' then 'ALLSUM'
                                                        else hospital_cd
                                                    end
                                                , case when 'Y' = '${ageCdAll}' then 'ALLSUM'
                                                        else age_cd
                                                    end 
                                                , case when 'Y' = '${sexCdAll}' then 'ALLSUM'
                                                        else sex_cd
                                                    end 
                                                , case when 'Y' = '${areaCdAll}' then 'ALLSUM'
                                                        else area_cd
                                                    end
                                                , case when 'ALL' = '${platformType}' then 'ALLSUM'
                                                        else platform_type
                                                    end      
                                                , cnt
                                                from lemon_eis.stat_join sj 
                                            where stat_dt between '${startDt}' and '${endDt}' 
                                                and ( case when 'ALL' = '${hospitalCd}' then 'ALL' = '${hospitalCd}'
                                                            else hospital_cd = '${hospitalCd}'
                                                        end
                                                    )
                                                and ( case when 'ALL' = '${platformType}' then 'ALL' = '${platformType}'
                                                            else platform_type = '${platformType}'
                                                        end
                                                    )
                                            group by stat_dt, stat_ym, hospital_cd, age_cd, sex_cd, area_cd, platform_type
                                            ) a
                                    group by a.stat_dt, a.stat_ym, a.hospital_cd, a.age_cd, a.sex_cd, a.area_cd, a.platform_type
                                    order by stat_dt asc 
                                ) q                                                                                            
                            `;

            try {
                const sql = querySql;
                    
                console.log(sql);
    
                result = await db.query(poolClient, sql, []);
                await console.log(JSON.stringify(result));
                if(result.rowCount > 0){
                    resolve(result.rows)
                } else {
                    reject("StatService getPeriodMenuStat failed")
                }
            } catch (err) {
                reject("StatService getMonthlyLoginLogtat failed")
            } 
        });
    }



}