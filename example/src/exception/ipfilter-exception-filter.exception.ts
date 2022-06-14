import {
  Catch,
  ArgumentsHost,
  HttpException,
  ExceptionFilter,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { IpFilterDenyException } from 'nestjs-ip-filter';

@Catch(IpFilterDenyException)
export class IpFilterDenyExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const statusFromIpFilter = exception.getStatus();
    const responseFromIpFilter = exception.getResponse();

    console.log(`Client IP is "${responseFromIpFilter['clientIp']}"`);

    response.status(statusFromIpFilter).json({
      statusCode: statusFromIpFilter,
      timestamp: new Date().toISOString(),
      ipFilterData: responseFromIpFilter,
      path: request.url,
    });
  }
}
