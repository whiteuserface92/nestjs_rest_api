import { Controller, Post, Get, Body, Query, HttpCode, UseInterceptors, UploadedFile, ParseFilePipe, MaxFileSizeValidator, FileTypeValidator, UploadedFiles } from '@nestjs/common';
import { AppService } from './app.service';
import { Public } from '../auth/auth.guard';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';

@Public()
@Controller('app')
export class AppController {
  constructor(private readonly appService: AppService) {}

  /* 
    앱 버전 목록 (AS-IS AppController)
    AS-IS context-path : /rest/apps/findAllByKeyword
  */
  @HttpCode(200)
  @Get('apps/appFindAllByKeyword')
  appFindAllByKeyword(
    @Query('hosCd') hosCd : string,
    @Query('hospitalId') hospitalId?: number,
    @Query('keyword') keyword?: string, //appNm
  ) {
    return this.appService.appFindAllByKeyword(hosCd, hospitalId, keyword);
  }

  /* 
    (AS-IS AppController)
    AS-IS context-path : /rest/apps
  */
  @HttpCode(200)
  @Get('apps')
  getAppsInfo(@Query('hosCd') hosCd : string, @Query('appId') appId: string, @Query('appPlatformId') appPlatformId: string) {
    return this.appService.getAppsInfo(hosCd, appId, appPlatformId);
  }

  /*
   유입 파라미터 확인 id기준 (AS-IS AppController)
   info : app_mst 등록 및 수정 (appId 값이 있으면 수정, 없으면 등록)
   AS-IS context-path : /rest/apps
  */
  @HttpCode(200)
  @Post('apps')
  postApp(@Query('hosCd') hosCd : string, @Body('appInfo') appInfo: any) {
    return this.appService.saveAppMst(hosCd, appInfo);
  }

  /*
    (AS-IS AppLogController)
    AS-IS context-path : /rest/applog/findAllByKeyword
  */
  @HttpCode(200)
  @Get('/applog/findAllByKeyword')
  applogSearch(
    @Query('hosCd') hosCd : string,
    @Query('keyword') keyword = '',
    @Query('startDt') startDt = '1900-01-01',
    @Query('endDt') endDt = '1900-01-01',
  ) {
    return this.appService.applogSearch(hosCd, keyword, startDt, endDt);
  }

  /*
    (AS-IS AppMenuLogController)
    AS-IS context-path : /rest/appmenulog/findAllByKeywordDto
  */
  @HttpCode(200)
  @Get('/appmenulog/findAllByKeywordDto')
  appMenuLogSearch(
    @Query('hosCd') hosCd : string,
    @Query('keyword') keyword = '',
    @Query('startDt') startDt = '1900-01-01',
    @Query('endDt') endDt = '1900-01-01',
  ) {
    return this.appService.appMenuLogSearch(hosCd, keyword, startDt, endDt);
  }

  /*
    앱 설치후 앱에서 요청하는 기본 정보
  */
  @HttpCode(200)
  @Post('/apps/findAppInfoForNative')
  findAppInfoForNative(
    @Query('hosCd') hosCd : string,
    @Body('deployType') deployType: string,
    @Body('pkgNm') pkgNm: string,
    @Body('platformType') platformType: string
  ) {
    // console.log(deployType, pkgNm, platformType)
    return this.appService.findAppInfoForNative(hosCd, deployType, pkgNm, platformType);
  }

  //App Upload Sample code
  @Post('uploadFile')
  @UseInterceptors(FileInterceptor('file'))
  uploadFile(@UploadedFile('file')
  file: Express.Multer.File) {
  console.log(file);
  }

  //App Upload Sample code
  @Post('uploadFiles')
  @UseInterceptors(FilesInterceptor('files',20,{
    storage: diskStorage({
      destination: `${process.env.LOCAL_SAVE_LOCATION}`, 
      filename: (req, file, cb) => {
        const fileNameSplit = file.originalname.split(".");
        const fileExt = fileNameSplit[fileNameSplit.length - 1];
        cb(null, `${fileNameSplit[0]}.${fileExt}`)
      }
    }),
  }))
  uploadFiles(@UploadedFiles(
    new ParseFilePipe({
      validators: [
        new FileTypeValidator({fileType:'.(png|jpeg|jpg)'}),
        new MaxFileSizeValidator({maxSize: 1024 * 1024 * 4}),
      ]
    })
  )
  files: Array<Express.Multer.File>) { 
    console.log(process.env.LOCAL_SAVE_LOCATION);
    const response = []; 
    files.forEach(file => {
      const fileReponse = {
        filename : file.filename,
      };
      response.push(fileReponse); 
    })
    return response 
  
  }


}
