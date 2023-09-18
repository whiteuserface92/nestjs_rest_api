import { Injectable } from '@nestjs/common';
import * as db from '../db';
import { JwtService } from '@nestjs/jwt';
import { jwtConstants } from './constants';
import { Logger } from '@nestjs/common';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) { }
  private readonly logger = new Logger(AuthService.name);
  async signIn(loginInfo: any) {
    let returnObj;
    let checkStatus;
    let encrypt = require('../auth/crypto'); //password 암호화
    const poolClient = await db.getPoolClient();
    try {

      //병원코드와 스키마 세팅
      const hosCd = loginInfo.hospitalCd;
      const schemaNm = await db.getSchemaNm(loginInfo.hospitalCd);

      //회원 정보 조회
      const sql = `SELECT a.user_account as "userAccount",
                          a.user_id as "userId",
                          a.admin_level as "adminLevel",
                          a.password as "password",
                          a.secret_key as "secretKey"
                     FROM ${schemaNm}.user_admin a
                    WHERE 1=1
                      AND a.user_account = '${loginInfo.id}'`;

      const result = await db.query(poolClient, sql, []);

      if (result.rowCount < 1) {
        throw '해당 어드민 계정은 없습니다.';
      }

      // 저장되어있는 사용자 key와 password 값(랜덤한 암호값)
      const secretKey = result.rows[0].secretKey;
      const dbPassword = result.rows[0].password;

      // db에서 가져온 password와 로그인시 넣은 값을 비교
      const loginPassword = await encrypt.encryptWithSalt(loginInfo.password, secretKey);
      console.log(`loginPassword : ${loginPassword}`);
      console.log(`dbPassword : ${dbPassword}`);


      checkStatus = { status: true, msg: '' };
      if (!loginInfo.id || loginInfo.id !== result.rows[0].userAccount) {
        checkStatus.status = false;
        checkStatus.msg = '아이디 오류';
      }
      if (!loginInfo.password || loginPassword !== dbPassword) {
        checkStatus.status = false;
        checkStatus.msg = '비밀번호 오류';
      }

      if (!loginInfo.hospitalCd) {
        checkStatus.status = false;
        checkStatus.msg = 'hospitalCd 필수값 null';
      }

      if (!checkStatus.status) {
        throw checkStatus.msg;
      }

      const payload = { adminUserId: result.rows[0].userId, hospitalCd: hosCd }; //id와 hospitalCd를 세팅해서 토큰값 생성함.
      const secret = process.env.JWT_SECRET //설정해놓은 암호값
      const accessTokenSignOptions = {
        secret: secret,
        expiresIn: jwtConstants.default.accessTokenExpiresIn,
      };
      const refreshTokenSignOptions = {
        secret: secret,
        expiresIn: jwtConstants.default.refreshTokenExpiresIn,
      };
      const [accessToken, refreshToken] = await Promise.all([ //토큰 발급해서 리턴
        this.jwtService.signAsync(payload, accessTokenSignOptions), 
        this.jwtService.signAsync(payload, refreshTokenSignOptions),
      ]);

      returnObj = {
        code: 200,
        message: 'success',
        accessToken: accessToken,
        refreshToken: refreshToken,
        adminUserInfo: {
          adminUserId: result.rows[0].userId,
          userAccount: result.rows[0].userAccount,
          adminLevel : result.rows[0].adminLevel
        },
      };
    } catch (err) {
      returnObj = {
        code: 410,
        message: `error, ${JSON.stringify(err)}`,
      };
    } finally {
      poolClient.release();
      return returnObj;
    }
  }

  async refreshToken(refreshInfo: any, beforeRefreshToken: string) {
    let returnObj;
    const poolClient = await db.getPoolClient();
    try {
      //refreshToken 체크
      const secret = process.env.JWT_SECRET
      const decPayload = await this.jwtService.verifyAsync(beforeRefreshToken, {
        secret: secret,
      }); 
      const payload = { adminUserId: refreshInfo.adminUserId, hospitalCd: decPayload.hospitalCd };
      const accessTokenSignOptions = {
        secret: secret,
        expiresIn: jwtConstants.default.accessTokenExpiresIn,
      };
      const refreshTokenSignOptions = {
        secret: secret,
        expiresIn: jwtConstants.default.refreshTokenExpiresIn,
      };
      const [accessToken, refreshToken] = await Promise.all([
        this.jwtService.signAsync(payload, accessTokenSignOptions),
        this.jwtService.signAsync(payload, refreshTokenSignOptions),
      ]);

      returnObj = {
        code: 200,
        message: 'success',
        accessToken: accessToken,
        refreshToken: refreshToken,
      };
    } catch (err) {
      returnObj = {
        code: 410,
        message: `error, ${JSON.stringify(err)}`,
      };
    } finally {
      poolClient.release();
      return returnObj;
    }
  }
}
