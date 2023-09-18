import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Observable } from 'rxjs';
import { JwtService } from '@nestjs/jwt';
import { jwtConstants } from './constants';
import { Request } from 'express';
import { SetMetadata } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService, private reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      // 💡 See this condition
      console.log('public api pass');
      return true;
    }
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request); //발급된 토큰을 check한다.
    if (!token) {
      console.log(`UnauthorizedException [token is null]`)
      throw new UnauthorizedException();
    }
    try { //토큰의 값과 일치하는지 대조 ? ...
      const secret = process.env.JWT_SECRET
      const payload = await this.jwtService.verifyAsync(token, {
        secret: secret
      });
      // console.log(`request`,request.query)
      // console.log(`authguard payload`, payload);
      if(!payload.hospitalCd) throw ('jwt hosCd null')
      request.query.hosCd = payload.hospitalCd;
    } catch (err) {
      console.log(`jwt verify error, ${JSON.stringify(err)}`);
      throw new UnauthorizedException();
    }
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
