import * as cheerio from 'cheerio';
import { http } from '../utils/http';

import logger from '../config/logger';
import { Quote, QuotesResponse } from '../types';
import { QuotesQuery } from '../schemas/common.schema';
import { ApiError } from '../middlewares/error.middleware';

const BASE_URL = 'https://quotes.toscrape.com';

export class QuotesService {
    async getQuotes(params: QuotesQuery): Promise<QuotesResponse> {
        const { tag, page, limit } = params;

        try {
            let url = BASE_URL;
            if (tag) {
                url += `/tag/${encodeURIComponent(tag)}/`;
            }
            if (page > 1) {
                url += `/page/${page}/`;
            }

            logger.info(`Scraping quotes from: ${url}`);

            const response = await http.get(url);
            const html = response.data;

            const $ = cheerio.load(html);
            const quotes: Quote[] = [];

            $('.quote').each((i, el) => {
                if (i >= limit) return false; // Stop when limit is reached

                const text = $(el).find('.text').text().trim().replace(/^"|"$/g, '');
                const author = $(el).find('.author').text().trim();
                const tags: string[] = [];

                $(el).find('.tags .tag').each((_, tagEl) => {
                    tags.push($(tagEl).text().trim());
                });

                quotes.push({ text, author, tags });
            });

            const hasMore = $('.pager .next').length > 0;

            const result: QuotesResponse = {
                quotes,
                total: quotes.length, // Note: The site doesn't provide total count
                page,
                limit,
                hasMore,
            };

            return result;
        } catch (error) {
            logger.error('Error scraping quotes:', error);
            throw new ApiError('Failed to fetch quotes', 500);
        }
    }
}

export default new QuotesService();
