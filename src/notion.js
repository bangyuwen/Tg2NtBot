import { Client } from '@notionhq/client';
import pino from 'pino';

const logger = pino();

const databaseId = '8dcd4c8da59d425996f4aa8bfa89124d';

const notion = new Client({
  auth: process.env.NOTION_TOKEN,
});

const retrievePage = async () => {
  const pageId = 'a885b256bde94d9c8aae7d1562ac7c04';
  const response = await notion.pages.retrieve({ page_id: pageId });
  logger.info(response);
};

const retrieveBlock = async () => {
  const blockId = 'a885b256bde94d9c8aae7d1562ac7c04';
  const response = await notion.blocks.retrieve({
    block_id: blockId,
  });
  logger.info(response);
};

const appendBlock = async () => {
  logger.info('append block');
  const blockId = 'a885b256bde94d9c8aae7d1562ac7c04';
  const response = await notion.blocks.children.append({
    block_id: blockId,
    children: [
      {
        object: 'block',
        type: 'paragraph',
        paragraph: {
          text: [
            {
              type: 'text',
              text: {
                content: 'abcde',
              },
            },
          ],
        },
      },
    ],
  });
  logger.info(response);
};

const retrieveBlockChild = async () => {
  const blockId = 'a885b256bde94d9c8aae7d1562ac7c04';
  const response = await notion.blocks.children.list({
    block_id: blockId,
    page_size: 50,
  });
  logger.info(response);
};

const createPage = async () => {
  const response = await notion.pages.create({
    parent: {
      database_id: databaseId,
    },
    properties: {
      Date: {
        type: 'date',
        date: {
          start: '2021-09-01',
        },
      },
      Name: {
        type: 'title',
        title: [
          {
            type: 'text',
            text: {
              content: 'Telegram 20210901',
            },
          },
        ],
      },
    },
  });
  logger.info(response);
};

const getPageID = async () => {
  const response = await notion.databases.query({
    database_id: databaseId,
    filter: {
      property: 'Name',
      text: {
        equals: 'Telegram 20210902',
      },
    },
  });
  logger.info(response);
};

const getDBContent = async () => {
  const response = await notion.databases.query({
    database_id: databaseId,
  });
  logger.info(response);
};

export {
  getDBContent,
  getPageID,
  createPage,
  retrievePage,
  retrieveBlock,
  retrieveBlockChild,
  appendBlock,
};
