import { Injectable, NestInterceptor, ExecutionContext, CallHandler, Logger } from '@nestjs/common';
import { log } from 'console';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any>
  {
      let logFile = process.env.LOGGER_APP + ".log";
      let logPath = process.cwd() + "<path>" + logFile;

      let { url, method, headers, body } = context.switchToHttp().getRequest();
      
      let logMessage = "\n\n=======================================\n\nTIME: " + Date().toString() + "\nMETHOD: " + JSON.stringify(method) + "\nURL: " + JSON.stringify(url) + "\nHEADERS: " + JSON.stringify(headers) + "\nBODY: " + JSON.stringify(body) + "\nRESPONSE: ";
      Logger.log(logMessage)
      if (url != "/logs/dev.log")
      {
          
          return next.handle().pipe(tap((data) => 
          {
              let responseBody = JSON.stringify(data);

              logMessage += responseBody;

              // Reading old data.
              // logMessage += fs.readFileSync(logPath);

              // fs.writeFile(logPath, logMessage, function (err, file) { });
              console.log(logMessage)
          }));
      }
  }
};