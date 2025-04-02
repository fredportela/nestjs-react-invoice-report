import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PdfExtractorModule } from './pdf-extractor/pdf-extractor.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CustomerModule } from './customer/customer.module';
import { DashboardModule } from './dashboard/dashboard.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync({
      useFactory: async (configService: ConfigService) => ({
        type: 'postgres',
        url: configService.get<string>('DATABASE_URL'),
        ssl: configService.get<string>('DATABASE_URL') === 'true' ? { rejectUnauthorized: false } : false,
        synchronize: true,
        autoLoadEntities: true,
        logging: true,
        extra: {
          parseNumeric: true,
        },
      }),
      inject: [ConfigService],
    }),
    CustomerModule,
    DashboardModule,
    PdfExtractorModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
