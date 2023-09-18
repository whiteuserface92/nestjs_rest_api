import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(
    AppModule, 
    // {
    //   logger: console,
    // }
  );
  await console.log('REDIS 정보 host/port/password : '+process.env.REDIS_HOST, process.env.REDIS_PORT, process.env.REDIS_PASSWORD);
  await console.log('SENTIENL 정보 : \n'+process.env.SENTINEL_MASTER_NAME, process.env.SENTINEL_HOST1, process.env.SENTINEL_PORT1+'\n'
                                      +process.env.SENTINEL_HOST2, process.env.SENTINEL_PORT2+'\n'
                                      +process.env.SENTINEL_HOST3, process.env.SENTINEL_PORT3+'\n'
                                      +process.env.SENTINEL_HOST4, process.env.SENTINEL_PORT4+'\n'
                                      +process.env.SENTINEL_HOST5, process.env.SENTINEL_PORT5+'\n'
                                      ) 

  app.use(cookieParser());
  await app.listen(process.env.PORT);
  console.log(`Running PORT: ${process.env.PORT}`);
}
bootstrap();
