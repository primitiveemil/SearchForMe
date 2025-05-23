import axios from 'axios';
import * as cheerio from 'cheerio';

interface Product {
  id: string;
  name: string;
  price: string;
  imageUrl: string;
  url: string;
  source: string;
}

// Generic scraper class that can be extended for different websites
export abstract class WebScraper {
  protected abstract readonly baseUrl: string;
  protected abstract readonly source: string;

  abstract searchProducts(query: string): Promise<Product[]>;
  
  protected async fetchHtml(url: string): Promise<string> {
    try {
      const headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
      };
      
      const response = await axios.get(url, { headers });
      return response.data;
    } catch (error) {
      console.error(`Error fetching from ${url}:`, error);
      return '';
    }
  }

  protected generateUniqueId(productName: string, index: number): string {
    return `${this.source}-${index}-${productName.substring(0, 10).replace(/\s+/g, '-')}`;
  }
}

// Metro Cash & Carry Pakistan scraper implementation
export class MetroScraper extends WebScraper {
  protected readonly baseUrl = 'https://www.metro-online.pk';
  protected readonly source = 'metro';

  async searchProducts(query: string): Promise<Product[]> {
    try {
      // Format the query string for the URL (replace spaces with hyphens)
      const formattedQuery = query.toLowerCase().replace(/\s+/g, '-');
      
      // Create the search URL
      const searchUrl = `${this.baseUrl}/search/${formattedQuery}?searchText=${encodeURIComponent(query)}&url=&isSearched=true`;
      
      console.log(`Searching Metro for: ${query} at URL: ${searchUrl}`);
      
      const html = await this.fetchHtml(searchUrl);
      if (!html) {
        console.error('No HTML content returned from Metro');
        return [];
      }
      
      const $ = cheerio.load(html);
      const products: Product[] = [];

      // Find all product cards
      $('.CategoryGrid_product_card__FUMXW').each((index, element) => {
        try {
          // Extract product details
          const nameElement = $(element).find('.CategoryGrid_product_name__3nYsN');
          const name = nameElement.attr('title') || nameElement.text().trim();
          
          if (!name) return; // Skip if no name found
          
          // Get the product URL
          const linkElement = $(element).find('a[target="_blank"]').first();
          const productPath = linkElement.attr('href') || '';
          const url = productPath.startsWith('http') ? productPath : this.baseUrl + productPath;
          
          // Get the price text (remove any linethrough price)
          const priceElement = $(element).find('.CategoryGrid_product_price__Svf8T');
          const price = priceElement.clone().children().remove().end().text().trim();
          
          // Get the image URL
          const imgElement = $(element).find('img[alt*="buy"]');
          // Extract the actual image URL from srcset
          const srcset = imgElement.attr('srcset') || '';
          // Parse the largest image from srcset
          const imageUrl = this.extractImageUrlFromSrcset(srcset);
          
          // Check if the product is sold out
          const isSoldOut = $(element).find('.CategoryGrid_soldOut_btn__u0X7H').length > 0;
          
          // Only add products that are not sold out
          if (!isSoldOut) {
            products.push({
              id: this.generateUniqueId(name, index),
              name,
              price: price || 'N/A',
              imageUrl,
              url,
              source: this.source
            });
          }
        } catch (e) {
          console.error('Error parsing Metro product:', e);
        }
      });

      console.log(`Found ${products.length} products from Metro`);
      return products;
    } catch (error) {
      console.error('Error searching Metro products:', error);
      return [];
    }
  }

  // Helper method to extract image URL from srcset attribute
  private extractImageUrlFromSrcset(srcset: string): string {
    if (!srcset) return '';
    
    // Split the srcset into parts
    const parts = srcset.split(',').map(part => part.trim());
    
    // If there are parts, get the last one (usually the largest image)
    if (parts.length > 0) {
      // Extract the URL part (before the size descriptor)
      const lastPart = parts[parts.length - 1];
      const urlMatch = lastPart.match(/(.+)\s+\d+w/);
      
      if (urlMatch && urlMatch[1]) {
        return urlMatch[1].trim();
      }
      
      // If no match with the pattern, just return the whole part
      // (might happen if the format is different)
      return lastPart.split(' ')[0];
    }
    
    return '';
  }
}

// Amazon scraper implementation
export class AmazonScraper extends WebScraper {
  protected readonly baseUrl = 'https://www.amazon.com';
  protected readonly source = 'amazon';

  async searchProducts(query: string): Promise<Product[]> {
    try {
      const searchUrl = `${this.baseUrl}/s?k=${encodeURIComponent(query)}`;
      const html = await this.fetchHtml(searchUrl);
      const $ = cheerio.load(html);
      const products: Product[] = [];

      $('.s-result-item[data-component-type="s-search-result"]').each((index, element) => {
        try {
          const nameElement = $(element).find('h2 .a-link-normal');
          const name = nameElement.text().trim();
          
          if (!name) return; // Skip if no name found
          
          const url = this.baseUrl + nameElement.attr('href');
          const price = $(element).find('.a-price .a-offscreen').first().text().trim();
          const imageUrl = $(element).find('img.s-image').attr('src') || '';
          
          products.push({
            id: this.generateUniqueId(name, index),
            name,
            price: price || 'N/A',
            imageUrl,
            url,
            source: this.source
          });
        } catch (e) {
          console.error('Error parsing product:', e);
        }
      });

      return products;
    } catch (error) {
      console.error('Error searching Amazon products:', error);
      return [];
    }
  }
}

// Walmart scraper implementation
export class WalmartScraper extends WebScraper {
  protected readonly baseUrl = 'https://www.walmart.com';
  protected readonly source = 'walmart';

  async searchProducts(query: string): Promise<Product[]> {
    try {
      const searchUrl = `${this.baseUrl}/search?q=${encodeURIComponent(query)}`;
      const html = await this.fetchHtml(searchUrl);
      const $ = cheerio.load(html);
      const products: Product[] = [];

      $('[data-item-id]').each((index, element) => {
        try {
          const nameElement = $(element).find('[data-automation-id="product-title"]');
          const name = nameElement.text().trim();
          
          if (!name) return; // Skip if no name found
          
          const url = nameElement.parent().attr('href') || '';
          const fullUrl = url.startsWith('http') ? url : this.baseUrl + url;
          const price = $(element).find('[data-automation-id="product-price"]').text().trim();
          const imageUrl = $(element).find('img').attr('src') || '';
          
          products.push({
            id: this.generateUniqueId(name, index),
            name,
            price: price || 'N/A',
            imageUrl,
            url: fullUrl,
            source: this.source
          });
        } catch (e) {
          console.error('Error parsing product:', e);
        }
      });

      return products;
    } catch (error) {
      console.error('Error searching Walmart products:', error);
      return [];
    }
  }
}

// eBay scraper implementation
export class EbayScraper extends WebScraper {
  protected readonly baseUrl = 'https://www.ebay.com';
  protected readonly source = 'ebay';

  async searchProducts(query: string): Promise<Product[]> {
    try {
      const searchUrl = `${this.baseUrl}/sch/i.html?_nkw=${encodeURIComponent(query)}`;
      const html = await this.fetchHtml(searchUrl);
      const $ = cheerio.load(html);
      const products: Product[] = [];

      $('.s-item__wrapper').each((index, element) => {
        try {
          const nameElement = $(element).find('.s-item__title');
          const name = nameElement.text().trim();
          
          if (!name || name.includes('Shop on eBay')) return; // Skip if no name or it's a promotion
          
          const url = $(element).find('.s-item__link').attr('href') || '';
          const price = $(element).find('.s-item__price').text().trim();
          const imageUrl = $(element).find('.s-item__image-img').attr('src') || '';
          
          products.push({
            id: this.generateUniqueId(name, index),
            name,
            price: price || 'N/A',
            imageUrl,
            url,
            source: this.source
          });
        } catch (e) {
          console.error('Error parsing product:', e);
        }
      });

      return products;
    } catch (error) {
      console.error('Error searching eBay products:', error);
      return [];
    }
  }
}

export { Product }; 