import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BooksModule } from './modules/books/books.module';
import { CategoryModule } from './modules/category/category.module';
import { Category } from './modules/category/entity/category.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT) || 5432,
      username: process.env.DB_USER || 'kusumaningrat',
      password: process.env.DB_PASSWORD || 'kusumaningrat16',
      database: process.env.DB_NAME || 'bookshelf',
      entities: [
        Category
      ],
      synchronize: true,
      logging: true
    }),
    BooksModule,
    CategoryModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
