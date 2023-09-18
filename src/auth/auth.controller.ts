import { Body, Controller, Post, Get, Res, Req, HttpCode } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public } from './auth.guard';
import { Request, Response } from 'express';
import { Logger } from '@nestjs/common'

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) { }
  
  private readonly logger = new Logger(AuthController.name);

  //쿠키확인용 TEST
  @Get('/cookies')
  @Public()
  getCookies(@Req() req: Request, @Res() res: Response): any {
    const accessToken =  req.cookies['accessToken'];
    const refreshToken = req.cookies['refreshToken'];

    this.logger.log(`accessToken : ${accessToken}`);
    this.logger.log(`refreshToken : ${refreshToken}`);
    
    return res.send([accessToken,refreshToken]);
  }

  /*
  어드민 로그아웃 TEST
  */
  @Post('logout')
  @Public()
  logout(
    @Res() res: Response) {
    res.cookie('accessToken', '', {
      maxAge: 0 //현재시간으로부터 만료시간을 밀리초 단위로 설정
    })
    .cookie('refreshToken', '', {
      maxAge: 0
    })
    return res.send({
      code: 200,
      message: 'logOut success',
    })
  }

  /* 
    어드민 로그인
    요청데이터는 추후에 수정 필요.
  */
  @Public()
  @HttpCode(200) //object나 array 리턴시 200(Post는 201) 자동. 데코레이터 이용해서 임의 설정.
  @Post('login')
  async signIn(
    @Body() loginInfo: { id: string; password: string; hospitalCd: string }, 
    @Res({ passthrough: true }) res: Response) {
    const resultObj: any = await this.authService.signIn(loginInfo); //발급받은 토큰
    res
      .cookie('accessToken', resultObj.accessToken, { //쿠키에 토큰 값 삽입
        domain: process.env.DOMAIN, //도메인
        secure: true, // HTTPS에서만 cookie사용
        path: '/', //cookie 기본경로
        sameSite: 'none',  // cookie 정책 none/strict/Lax 세가지 *** 회의시 문의.
        httpOnly: false, //웹서버를 통해서만 쿠키에 접근가능 설정
        // expires: new Date(Date.now() + 8 * 24 * 60 * 1000),
        expires: new Date(new Date().getTime() + 24 * 60 * 60 * 1000) //cookie만료 날짜 설정. 지정안되거나 0이면 session Cookie 생성.
      })
      .cookie('refreshToken', resultObj.refreshToken, {
        domain: process.env.DOMAIN,
        secure: true,
        path: '/',
        sameSite: 'none',
        httpOnly: false,
        // expires: new Date(Date.now() + 8 * 24 * 60 * 1000),
        expires: new Date(new Date().getTime() + 24 * 60 * 60 * 1000)
      })
      .send({//res.send같은 직접적인 응답을 주지 않으면 HTTP 서버가 중단되는 상황이 있음.
        code: resultObj.code,
        message: resultObj.message,
        adminUserInfo: resultObj.adminUserInfo,
      });
  }

  /*
    refreshToken 
   */
  @Public()
  @Post('refreshToken')
  async refreshToken(@Body() refreshInfo: any, @Req() req: Request, @Res({ passthrough: true }) res: Response) {
    let refreshToken: string;
    if (req.cookies && req.cookies.refreshToken) {
      refreshToken = req.cookies.refreshToken;
      const resultObj: any = await this.authService.refreshToken(refreshInfo, refreshToken);
      res
        .cookie('accessToken', resultObj.accessToken, {
          domain: process.env.DOMAIN,
          secure: true,
          path: '/',
          sameSite: 'none',
          httpOnly: false,
          // expires: new Date(Date.now() + 8 * 24 * 60 * 1000),
          expires: new Date(new Date().getTime() + 24 * 60 * 60 * 1000)
        })
        .cookie('refreshToken', resultObj.refreshToken, {
          domain: process.env.DOMAIN,
          secure: true,
          path: '/',
          sameSite: 'none',
          httpOnly: false,
          // expires: new Date(Date.now() + 8 * 24 * 60 * 1000),
          expires: new Date(new Date().getTime() + 24 * 60 * 60 * 1000)
        })
        .status(200)
        .send({
          code: resultObj.code,
          message: resultObj.message,
          adminUserInfo: resultObj.adminUserInfo,
        });
      return
    }else{
      console.log(`refreshToken null`)
      res.status(210).send({
        code : 210,
        message : "refreshToken null"
      }) 
      return
    }
  }
}
