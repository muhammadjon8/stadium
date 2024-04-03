import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { UsersModule } from './users/users.module';
import { User } from './users/models/user.model';
import { ComfortModule } from './comfort/comfort.module';
import { CategoriesModule } from './categories/categories.module';
import { DistrictModule } from './district/district.module';
import { RegionModule } from './region/region.module';
import { AdminModule } from './admin/admin.module';
import { Region } from './region/models/region.model';
import { District } from './district/models/district.model';
import { Category } from './categories/models/category.model';
import { Comfort } from './comfort/models/comfort.model';
// import { Admin } from './admin/models/admin.entity';
import { MailModule } from './mail/mail.module';
import { StadiumModule } from './stadium/stadium.module';
import { ComfortStadiumModule } from './comfort_stadium/comfort_stadium.module';
import { MediaModule } from './media/media.module';
import { Admin } from './admin/models/admin.entity';
import { BotModule } from './bot/bot.module';
import { TelegrafModule } from 'nestjs-telegraf';
import { BOT_NAME } from './app.constants';
import { Bot } from './bot/models/bot.model';
import { StadiumTime } from './stadium_times/models/stadium_time.models';
import { Comments } from './comment/models/comment.models';
import { Order } from './order/models/order.models';
import { UserCard } from './user_cards/models/user_card.models';
import { StadiumTimesModule } from './stadium_times/stadium_times.module';
import { UserCardsModule } from './user_cards/user_cards.module';
import { OrderModule } from './order/order.module';
import { CommentModule } from './comment/comment.module';

@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: '.env', isGlobal: true }),
    SequelizeModule.forRoot({
      dialect: 'postgres',
      host: process.env.POSTGRES_HOST,
      port: Number(process.env.POSTGRES_PORT),
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DB,
      models: [
        User,
        Region,
        District,
        Category,
        Comfort,
        Admin,
        Bot,
        StadiumTime,
        Comments,
        Order,
        UserCard,
      ],
      autoLoadModels: true,
      sync: { alter: true },
      logging: false,
    }),
    TelegrafModule.forRootAsync({
      botName: BOT_NAME,
      useFactory: () => ({
        token: process.env.BOT_TOKEN,
        middlewares: [],
        include: [BotModule],
      }),
    }),
    UsersModule,
    ComfortModule,
    CategoriesModule,
    DistrictModule,
    RegionModule,
    AdminModule,
    MailModule,
    StadiumModule,
    ComfortStadiumModule,
    MediaModule,
    BotModule,
    StadiumTimesModule,
    UserCardsModule,
    OrderModule,
    CommentModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
