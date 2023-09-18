import { Controller, Post, Get, Patch, Body, Query, Param } from '@nestjs/common';
import { HospitalService } from './hospital.service';
import { Logger } from '@nestjs/common'
import { Public } from 'src/auth/auth.guard';

@Public()
@Controller('hospital')
export class HospitalController {

    private readonly logger = new Logger(HospitalController.name);

    constructor(private readonly hospitalService: HospitalService) { }
 
    /*
        신규 병원목록 조회 컨트롤러 
        context-path : /api/hospital/hospitals
    */
    @Get('getHospitals')
    getHospitalList(
         @Query('hosCd') hosCd: string
    ) {
        return this.hospitalService.getHospitals(hosCd);
    }

    /*
        신규 병원 등록 컨트롤러
        context-path : /api/hospital/saveHospital
    */
    @Post('/saveHospital')
    saveHospital(
        @Query('hosCd') hosCd: string,
        @Body() postHospitalParam: any) {
        return this.hospitalService.saveHospital(hosCd, postHospitalParam);
    }

    /*
        신규 병원 수정 컨트롤러
        context-path : /api/hospital/saveHospital
    */
    @Patch('/updateHospital')
    updateHospital(
        @Query('hosCd') hosCd: string,
        @Body() updateHospitalParam: any
    ) {
        return this.hospitalService.updateHospital(hosCd, updateHospitalParam);
    }


//     /*
//         병원 기본정보 저장 (AS-IS HospitalController) 
//         AS-IS context-path : /rest/hospitals
//     */
//     @Post('/hospitals')
//     postHospital(@Body() postHospitalParam: any) {
//         return this.hospitalService.postHospital(postHospitalParam);
//     }
    
//     /*
//         병원정보와 환자번호를 가져와서 등록 (AS-IS HospitalPatientController) 
//         AS-IS context-path : /rest/setPatientHospital
//     */
//     @Post('/setPatientHospital')
//     setPatientHospital(@Body() reqHospitalInfoParam: any) {
//         return this.hospitalService.setPatientHospital(reqHospitalInfoParam);
//     }

//     /*
//         병원정보와 환자번호를 가져와서 삭제한다 (AS-IS HospitalPatientController) 
//         AS-IS context-path : /rest/deletePatientHospital
//     */
//     @Post('/deletePatientHospital')
//     delPatientHospital(@Body() reqHospitalInfoParam: any) {
//         return this.hospitalService.delPatientHospital(reqHospitalInfoParam);
//     }


//     /*
//         병원 옵션 Site Map 조회 (AS-IS HospitalOptSiteMapController)
//         AS-IS context-path : /rest/hospitalOptSiteMap/findAllByHospitalOptSiteMapList
//     */
//     @Get('hospitalOptSiteMap/findAllByHospitalOptSiteMapList')
//     findAllByHospitalOptSiteMapList(
//         @Query('hospitalId') hospitalId?: number,
//         @Query('keyword') keyword?: string,
//     ) {
//         return this.hospitalService.findAllByHospitalOptSiteMapList(hospitalId, keyword);
//     }
//     /*
//         병원 옵션 정보 저장 (AS-IS HospitalOptSiteMapController)
//         AS-IS context-path : /rest/hospitalOptSiteMap/saveOptSiteMap
//     */    
//     @Post('/hospitalOptSiteMap/saveOptSiteMap')
//     saveOptSiteMap(@Body() optSiteMapParam: any) {
//         return this.hospitalService.saveOptSiteMap(optSiteMapParam);
//     }




//     /*
//         그룹정보 커스텀 컨트롤러 (AS-IS GroupHospitalController) ** 현재 DB Table에 데이터가 없음
//         AS-IS context-path : /rest/groups/{id}/groupHospitals
//     */
//     @Get('groups/:id/groupHospitals')
//     getGroupHospitals(
//         @Param('id') groupId: string
//     ) {
//         return this.hospitalService.getGroupHospitals(groupId);
//     }
    
//     /*
//         병원 옵션 코드 목록 (AS-IS HospitalOptionCodeController)
//         AS-IS context-path : /rest/hospitalOptionCode/findAllByHospitalOptionList
//     */
//     @Get('hospitalOptionCode/findAllByHospitalOptionList')
//     hospitalFindAllByKeyword(
//         @Query('hospitalId') hospitalId?: number,
//         @Query('keyword') keyword?: string,
//     ) {
//         return this.hospitalService.hospitalFindAllByKeyword(hospitalId, keyword);
//     }

//    /*
//         병원별 옵션 코드 정보 저장 (AS-IS HospitalOptionCodeController)
//         AS-IS context-path : /rest/hospitalOptionCode/saveOptCode
//    */
//     @Post('/hospitalOptionCode/saveOptCode')
//     saveOptCode(@Body() optInfo: any) {
//         return this.hospitalService.saveOptCode(optInfo);
//     }

}
