import pino from 'pino';
import { Telegraf } from 'telegraf';
import { MessageEntity, Message, Chat, User } from 'typegram';

const logger = pino();
const Notion = require('./notion');

const parseAuthor = (message: Message.TextMessage) => {
  if ('forward_from_chat' in message) {
    const author = (message.forward_from_chat as Chat.TitleChat).title;
    return `[${author}]\n\n`;
  }
  if ('forward_from' in message) {
    const author =
      (message.forward_from as User).first_name +
      (message.forward_from as User).last_name;
    return `[${author}]: `;
  }
  return '';
};

const message2text = (message: Message.TextMessage) => {
  logger.info(JSON.stringify(message));
  if (!message) return '';
  const links = message.entities
    ?.filter((e) => e.type === 'text_link')
    .map((e) => (e as MessageEntity.TextLinkMessageEntity).url)
    .join('\n');
  const authorPart = parseAuthor(message);
  return links
    ? `${authorPart}${message.text}\n${links}\n`
    : `${authorPart}${message.text}\n`;
};

const bot = new Telegraf(process.env.TG_TOKEN as string);

bot.start((ctx) => ctx.reply('Welcome'));
bot.help((ctx) => ctx.reply('Send me a sticker'));
bot.on('sticker', (ctx) => ctx.reply('👍'));
bot.on('text', async (ctx) => {
  // logger.info(message2text(ctx.message));
  await new Notion().writeMessage(message2text(ctx.message));
  ctx.reply('Stored Message');
});
bot.launch();

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
