import { Client } from '@notionhq/client';
import moment from 'moment';
import pino from 'pino';

const logger = pino();

const databaseId = '8dcd4c8da59d425996f4aa8bfa89124d';

class Notion {
  static getPageNameToday(date) {
    const today = moment(date).format('YYYYMMDD');
    return `Telegram ${today}`;
  }

  constructor() {
    this.client = new Client({
      auth: process.env.NOTION_TOKEN,
    });
  }

  async queryPage(date) {
    const response = await this.client.databases.query({
      database_id: databaseId,
      filter: {
        property: 'Name',
        text: {
          equals: Notion.getPageNameToday(date),
        },
      },
    });
    return response.results.length ? response.results[0].id : -1;
  }

  async createPage(date) {
    const response = await this.client.pages.create({
      parent: {
        database_id: databaseId,
      },
      properties: {
        Date: {
          type: 'date',
          date: {
            start: date || moment().format('YYYY-MM-DD'),
          },
        },
        Name: {
          type: 'title',
          title: [
            {
              type: 'text',
              text: {
                content: Notion.getPageNameToday(date),
              },
            },
          ],
        },
      },
    });
    return response.id;
  }

  async appendBlock(blockId, message) {
    try {
      await this.client.blocks.children.append({
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
                    content: message,
                  },
                },
              ],
            },
          },
        ],
      });
    } catch (error) {
      logger.error('something goes wrong when appending the block');
    }
  }

  async writeMessage(message) {
    let id = await this.queryPage();
    if (id === -1) {
      id = await this.createPage();
    }
    this.appendBlock(id, message);
  }
}

module.exports = Notion;
