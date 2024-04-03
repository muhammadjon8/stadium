import { Injectable } from '@nestjs/common';
import { CreateBotDto } from './dto/create-bot.dto';
import { UpdateBotDto } from './dto/update-bot.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Bot } from './models/bot.model';
import { InjectBot } from 'nestjs-telegraf';
import { BOT_NAME } from '../app.constants';
import { Context, Telegraf, Markup } from 'telegraf';

@Injectable()
export class BotService {
  constructor(
    @InjectModel(Bot) private botRepo: typeof Bot,
    @InjectBot(BOT_NAME) private readonly bot: Telegraf<Context>,
  ) {}

  async start(ctx: Context) {
    const user_id = ctx.from.id;
    const user = await this.botRepo.findOne({ where: { user_id } });
    if (!user) {
      await this.botRepo.create({
        user_id: user_id,
        username: ctx.from.username,
        first_name: ctx.from.first_name,
        last_name: ctx.from.last_name,
      });
      await ctx.reply("Iltimos telefon raqamingizni jo'nating", {
        parse_mode: 'HTML',
        ...Markup.keyboard([Markup.button.contactRequest('Telefon raqam')])
          .oneTime()
          .resize(),
      });
    } else if (!user.status) {
      await ctx.reply("Iltimos telefon raqamingizni jo'nating", {
        parse_mode: 'HTML',
        ...Markup.keyboard([Markup.button.contactRequest('Telefon raqam')])
          .oneTime()
          .resize(),
      });
    } else {
      await ctx.reply(
        "Bu bot orqali stadium dasturi bilan muloqot o'rnatiladi",
        {
          parse_mode: 'HTML',
          ...Markup.removeKeyboard(),
        },
      );
    }
  }

  async onContact(ctx: Context) {
    if ('contact' in ctx.message) {
      const user_id = ctx.from.id;
      const user = await this.botRepo.findOne({ where: { user_id } });
      if (!user) {
        await ctx.reply('Iltimos /start tugmasini bosing', {
          parse_mode: 'HTML',
          ...Markup.keyboard([['/start']])
            .oneTime()
            .resize(),
        });
      } else if (ctx.message.contact.user_id !== user_id) {
        await ctx.reply("Iltimos telefon raqamingizni jo'nating", {
          parse_mode: 'HTML',
          ...Markup.keyboard([Markup.button.contactRequest('Telefon raqam')])
            .oneTime()
            .resize(),
        });
      } else {
        await this.botRepo.update(
          {
            phone_number: ctx.message.contact.phone_number,
            status: true,
          },
          {
            where: {
              user_id,
            },
          },
        );
        await ctx.reply("Tabriklaymiz jo'natildi", {
          parse_mode: 'HTML',
          ...Markup.removeKeyboard(),
        });
      }
    }
  }
}
