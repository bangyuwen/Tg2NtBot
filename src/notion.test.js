require('dotenv').config();
import { expect, test } from '@jest/globals';

const Notion = require('./notion');

test('check get notion page name', () => {
  expect(Notion.getPageNameToday('2021-01-01')).toBe('Telegram 20210101');
});

test('check get notion page exists', async () => {
  expect(await new Notion().queryPage('2021-09-01')).toBe(
    'a885b256-bde9-4d9c-8aae-7d1562ac7c04',
  );
});

test('append message to block', async () => {
  await new Notion().writeMessage('test append message block');
});
