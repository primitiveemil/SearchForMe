import { AmazonScraper, WalmartScraper, EbayScraper, MetroScraper, Product } from './scraper';

export class ScraperManager {
  private scrapers: Map<string, any>;

  constructor() {
    this.scrapers = new Map();
    // Initialize scrapers
    this.scrapers.set('amazon', new AmazonScraper());
    this.scrapers.set('walmart', new WalmartScraper());
    this.scrapers.set('ebay', new EbayScraper());
    this.scrapers.set('metro', new MetroScraper());
  }

  async searchAllSources(query: string): Promise<Product[]> {
    try {
      // Run all scrapers in parallel
      const searchPromises = Array.from(this.scrapers.values()).map(scraper => 
        scraper.searchProducts(query)
          .catch((error: Error) => {
            console.error(`Error with ${scraper.constructor.name}:`, error);
            return []; // Return empty array on error
          })
      );

      const results = await Promise.all(searchPromises);
      // Flatten the array of arrays into a single array
      return results.flat();
    } catch (error) {
      console.error('Error searching all sources:', error);
      return [];
    }
  }

  async searchSpecificSource(source: string, query: string): Promise<Product[]> {
    const scraper = this.scrapers.get(source.toLowerCase());
    if (!scraper) {
      console.error(`No scraper found for source: ${source}`);
      return [];
    }

    try {
      return await scraper.searchProducts(query);
    } catch (error) {
      console.error(`Error searching ${source}:`, error);
      return [];
    }
  }

  // Get list of available sources
  getSources(): string[] {
    return Array.from(this.scrapers.keys());
  }
} 