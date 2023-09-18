import { Module } from '@nestjs/common';
// import { CacheModule } from '@nestjs/cache-manager';
// import * as redisStore from 'cache-manager-ioredis';
// import { RestController } from './rest/rest.controller';
// import { RestService } from './rest/rest.service';
import { ConfigModule } from '@nestjs/config';
import { UserController } from './user/user.controller';
import { UserService } from './user/user.service';
import { HospitalController } from './hospital/hospital.controller';
import { HospitalService } from './hospital/hospital.service';
import { AdminController } from './admin/admin.controller';
import { AdminService } from './admin/admin.service';
import { AdminRepositoryService } from './admin/adminRepository.service';
import { MenuController } from './menu/menu.controller';
import { MenuService } from './menu/menu.service';
import { AppController } from './app/app.controller';
import { AppService } from './app/app.service';
import { AppRepositoryService } from './app/appRepository.service';
import { AuthModule } from './auth/auth.module';
import { AuthGuard } from './auth/auth.guard'
import { APP_GUARD } from '@nestjs/core';
import { FidosetController } from './fidoset/fidoset.controller';
import { CommoncodeController } from './commoncode/commoncode.controller';
import { RoleController } from './role/role.controller';
import { AdminMenuController } from './adminmenu/adminMenu.controller';
// import { CachereloadController } from './cachereload/cachereload.controller';
import { HistoryController } from './history/history.controller';
import { AdminMenuService } from './adminmenu/adminMenu.service';
// import { CachereloadService } from './cachereload/cachereload.service';
import { CommoncodeService } from './commoncode/commoncode.service';
import { FidosetService } from './fidoset/fidoset.service';
import { HistoryService } from './history/history.service';
import { RoleService } from './role/role.service';
import { StatService } from './stat/stat.service';
import { LogService } from './log/log.service';
import { LogController } from './log/log.controller';
import { StatController } from './stat/stat.controller';
import { UserRepositoryService } from './user/userRepository.service';
import { StatRepositoryService } from './stat/statRepository.service';
import { RoleRepositoryService } from './role/roleRepository.service';
import { MenuRepositoryService } from './menu/menuRepository.service';
import { LogRepositoryService } from './log/logRepository.service';
import { HospitalRepositoryService } from './hospital/hospitalRepository.service';
import { HistoryRepositoryService } from './history/historyRepository.service';
import { FidoSetRepositoryService } from './fidoset/fidosetRepository.service';
import { CommonCodeRepositoryService } from './commoncode/commoncodeRepository.service';
import { AdminMenuRepositoryService } from './adminmenu/adminMenuRepository.service';
// import { CacheReloadRepositoryService } from './cachereload/cachereloadRepository.service';
// import { redisProvider } from './cachereload/redis.Provider';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV}`,
    }),
    AuthModule,
  ],
  controllers: [UserController, HospitalController, AdminController, MenuController, AppController, FidosetController, CommoncodeController, RoleController, HistoryController, LogController, StatController, AdminMenuController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    }, 
    // ...redisProvider,
    UserService,
    HospitalService,
    AdminService,
    AdminRepositoryService,
    MenuService,
    AppService,
    AppRepositoryService,
    AdminMenuService,
    // CachereloadService,
    CommoncodeService,
    FidosetService,
    HistoryService,
    RoleService,
    StatService,
    LogService,
    UserRepositoryService,
    StatRepositoryService,
    RoleRepositoryService,
    MenuRepositoryService,
    LogRepositoryService,
    HospitalRepositoryService,
    HistoryRepositoryService,
    FidoSetRepositoryService,
    CommonCodeRepositoryService,
    // CacheReloadRepositoryService,
    AdminMenuRepositoryService
  ],
  // exports : [...redisProvider]
})
export class AppModule {}
