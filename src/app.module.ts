import { Treaty } from 'src/treaty/entities/treaty.entity';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CountryModule } from './country/country.module';
import { CityModule } from './city/city.module';
import { GraphQLModule } from '@nestjs/graphql';
import { join } from 'path';
import { City } from './city/entities/city.entity';
import { Country } from './country/entities/country.entity';
import { ConfigModule } from '@nestjs/config';
import { TreatyModule } from './treaty/treaty.module';
import { OnentModule } from './onent/onent.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    GraphQLModule.forRoot({
      autoSchemaFile: join(process.cwd(), 'schema.gql'),
    }),
    TypeOrmModule.forRoot({
      name: 'countrydb',
      type: 'postgres',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT),
      database: process.env.DB_NAME,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      entities: [Country, City, Treaty],
      //synchronize: true,
      //logging: true,
    }),
    TypeOrmModule.forRoot({
      name: 'onent',
      type: 'mssql',
      host: 'NOKTAWANK01.ng.entp.tgc\\NOKTAFCI02',
      port: 62595,
      username: 'MSIIS',
      password: 'vaco_3xX?219',
      database: 'ONENT',
      extra: {
        trustServerCertificate: true,
      },
      //logging: true,
    }),
    CountryModule,
    CityModule,
    TreatyModule,
    OnentModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
