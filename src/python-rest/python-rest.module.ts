import { Module } from '@nestjs/common';
import { PythonRestService } from './python-rest.service';
import { PythonRestController } from './python-rest.controller';

@Module({
  controllers: [PythonRestController],
  providers: [PythonRestService]
})
export class PythonRestModule {}
