import { http } from '../utils/http';

import logger from '../config/logger';
import { NewsItem, NewsResponse } from '../types';
import { NewsQuery } from '../schemas/common.schema';
import { ApiError } from '../middlewares/error.middleware';

const HN_API_BASE = 'https://hacker-news.firebaseio.com/v0';

export class NewsService {

    async getTopStories(params: NewsQuery): Promise<NewsResponse> {
        const { query } = params;

        try {
            logger.info('Fetching top stories from Hacker News');
            const response = await http.get(`${HN_API_BASE}/topstories.json`);
            const storyIds: number[] = response.data;

            if (!storyIds || !storyIds.length) {
                throw new ApiError('No stories found', 404);
            }

            logger.debug('Fetching all story details');
            const promises = storyIds.map(id =>
                http.get<NewsItem>(`${HN_API_BASE}/item/${id}.json`)
                    .then(res => res.data)
                    .catch(err => {
                        logger.warn(`Failed to fetch item ${id}:`, err);
                        return null;
                    })
            );

            const items = (await Promise.all(promises)).filter(Boolean) as NewsItem[];

            let filteredItems = items;
            if (query) {
                const lowerQuery = query.toLowerCase();
                filteredItems = items.filter(item =>
                    item.title && item.title.toLowerCase().includes(lowerQuery)
                );
            }

            const result: NewsResponse = {
                items: filteredItems,
                total: filteredItems.length,
            };

            return result;
        } catch (error) {
            logger.error('Error fetching news:', error);
            if (error instanceof ApiError) {
                throw error;
            }
            throw new ApiError('Failed to fetch news', 500);
        }
    }
}

export default new NewsService();
