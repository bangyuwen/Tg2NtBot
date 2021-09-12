require('dotenv').config();
import pino from 'pino';
import { Telegraf, Context } from 'telegraf';
import { MessageEntity, Message } from 'typegram';

const logger = pino();
const Notion = require('./notion');

const message2text = (message: Message.TextMessage) => {
  if (!message) return '';
  const links = message.entities
    ?.filter((e) => e.type === 'text_link')
    .map((e) => (e as MessageEntity.TextLinkMessageEntity).url)
    .join('\n');
  return links ? `${message.text}\n${links}` : message.text;
};

const bot = new Telegraf(process.env.TG_TOKEN as string);

bot.start((ctx) => ctx.reply('Welcome'));
bot.help((ctx) => ctx.reply('Send me a sticker'));
bot.on('sticker', (ctx) => ctx.reply('👍'));
bot.on('text', async (ctx) => {
  await new Notion().writeMessage(message2text(ctx.message));
  ctx.reply('Stored Message');
});
bot.launch();

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
