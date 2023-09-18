import { Pool } from 'pg';

let pool: any;

export const query = async (poolClient: any, text: string, params: []) => {
  const start = Date.now();
  const res = await poolClient.query(text, params);
  const duration = Date.now() - start;
  console.log(`[executed Query]\n* SQL: ${text}\n* duration: ${duration}\n* rows: ${res.rowCount}`);
  return res;
};

//CREATE DB Pool
export const createPool = async (config) => {
  return new Pool(config);
};

//GET DB Pool
export const getPoolClient = async () => {
  if (!pool) {
    const db_config = { //DB커넥션 설정
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      port: process.env.DB_PORT,
      max: process.env.DB_POOL_MAX,
    };
    console.log(`db_config : ${JSON.stringify(db_config, null, 2)}`);
    pool = await createPool(db_config);
  }

  // console.log(`pool.totalCount:${pool.totalCount}`) //풀 내에 존재하는 총 클라이언트 수
  // console.log(`pool.idleCount:${pool.idleCount}`) //체크아웃되지 않았지만 현재 풀에서 유휴 상태인 클라이언트 수
  // console.log(`pool.waitingCount:${pool.waitingCount}`) //모든 클라이언트가 체크아웃될 때 클라이언트에서 대기 중인 대기 중인 요청 수

  return await pool.connect()
};

//GET schema Name
export const getSchemaNm = async (hospitalCd: string) => {
  const schema: string = process.env[`SCHEMA_${hospitalCd}`]
  if(!schema){
    return Promise.reject('hospitalCd 값에 해당하는 schema 정보가 없습니다.')
  }
  return Promise.resolve(schema)
};

//Transaction BEGIN
export const transaction_Begin = async (poolClient) => {
  return await poolClient.query('BEGIN');
};

//Transaction COMMIT
export const transaction_Commit = async (poolClient) => {
  return await poolClient.query('COMMIT');
};

//Transaction ROLLBACK
export const transaction_Rollback = async (poolClient) => {
  return await poolClient.query('ROLLBACK');
};
