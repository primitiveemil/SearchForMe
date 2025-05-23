# AISearch - Modern AI Search Assistant

AISearch is a mobile-first React Native application that offers dual-purpose AI search functionality for Shopping and OSINT (Open Source Intelligence).

## Features

### Shopping Module
- Search for products across multiple stores with detailed product information
- Input form with fields for:
  - Item Name (required)
  - Item Description (optional)
  - Brand Name (required)
  - Packing Size (required)
- Store selection with multi-select capability
- Results grouped by store with product cards

### OSINT Module
- Two search modes:
  - Phone Number Search
  - Person Search
- Validated input with real-time validation
- Detailed results based on search type
- Social profile links and information visualization

### Shared Features
- Modern minimalist UI with:
  - Consistent typography
  - Color scheme
  - Spacing
- Animations:
  - Loading states
  - Transitions
  - Micro-interactions
- Error handling:
  - Form validation
  - API errors
  - Network states
- Responsive design:
  - Mobile-first approach
  - Adaptive layouts
  - Dynamic sizing

## Tech Stack

- React Native with Expo
- TypeScript
- React Navigation (Stack and Tab navigation)
- Custom UI components
- React hooks for state management

## Project Structure

```
AISearch/
├── assets/              # Images, fonts, etc.
├── src/
│   ├── components/      # Reusable UI components
│   ├── hooks/           # Custom React hooks
│   ├── navigation/      # Navigation setup
│   ├── screens/         # Application screens
│   ├── services/        # API services
│   ├── types/           # TypeScript types and interfaces
│   └── utils/           # Utility functions
├── .cursorrules         # Project coding standards
└── App.tsx              # Entry point
```

## Getting Started

### Prerequisites

- Node.js (v14 or newer)
- npm or yarn
- Expo CLI

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/AISearch.git
cd AISearch
```

2. Install dependencies
```bash
npm install
# or
yarn install
```

3. Start the development server
```bash
npm start
# or
yarn start
```

4. Open the app on your device or emulator
   - Use Expo Go app to scan the QR code
   - Press 'a' to open on Android emulator
   - Press 'i' to open on iOS simulator

## Development Guidelines

- Follow the TypeScript conventions defined in .cursorrules
- Use functional components with hooks
- Maintain consistent styling as defined in src/utils/theme.ts
- Add proper validation for all user inputs

## Technology Stack

- React Native with TypeScript
- Expo for cross-platform development
- React Navigation for navigation
- Custom animations with React Native Animated API

## Project Structure

```
AISearch/
├── App.tsx              # Entry point of the application
├── assets/              # Static assets like images and fonts
├── src/
│   ├── components/      # Reusable UI components
│   ├── hooks/           # Custom React hooks
│   ├── navigation/      # Navigation configuration
│   ├── screens/         # Screen components
│   ├── services/        # API and backend services
│   ├── types/           # TypeScript type definitions
│   └── utils/           # Utility functions and constants
└── package.json         # Project dependencies
```

## Development Setup

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- Expo CLI

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/AISearch.git
   cd AISearch
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the development server:
   ```
   npm start
   ```

4. Open the app on your device using Expo Go or run on an emulator.

## Git Workflow

This project follows a feature branching strategy:
- `main` branch is the stable version
- Create feature branches for new development
- Follow commit message conventions
- Review code before merging to main

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Backend Scraping Documentation

The backend service provides web scraping capabilities for product searches. It's built with Express and uses Cheerio for scraping.

### Running the Backend

To start the backend in development mode:
```bash
npm run backend:dev
```

To build and run the backend for production:
```bash
npm run backend:build
npm run backend:start
```

### Backend API Endpoints

The backend provides the following API endpoints:

#### Get Available Sources

```
GET /api/sources
```

Returns a list of available e-commerce sources that can be searched.

**Response:**
```json
{
  "success": true,
  "sources": ["amazon", "walmart", "ebay"]
}
```

#### Search All Sources

```
GET /api/search?q=searchTerm
```

Searches for products across all available sources.

**Query Parameters:**
- `q` (required): The search term

**Response:**
```json
{
  "success": true,
  "query": "searchTerm",
  "count": 15,
  "products": [
    {
      "id": "amazon-0-product-na",
      "name": "Product Name",
      "price": "$19.99",
      "imageUrl": "https://example.com/image.jpg",
      "url": "https://example.com/product",
      "source": "amazon"
    },
    // More products...
  ]
}
```

#### Search Specific Source

```
GET /api/search/:source?q=searchTerm
```

Searches for products from a specific source.

**URL Parameters:**
- `source`: The source to search (e.g., "amazon", "walmart", "ebay")

**Query Parameters:**
- `q` (required): The search term

**Response:**
```json
{
  "success": true,
  "source": "amazon",
  "query": "searchTerm",
  "count": 5,
  "products": [
    {
      "id": "amazon-0-product-na",
      "name": "Product Name",
      "price": "$19.99",
      "imageUrl": "https://example.com/image.jpg",
      "url": "https://example.com/product",
      "source": "amazon"
    },
    // More products...
  ]
}
```

## Adding New Scrapers

To add support for additional e-commerce websites:

1. Create a new scraper class in `src/backend/scraper.ts` that extends the `WebScraper` abstract class
2. Implement the required methods and properties
3. Add the new scraper to the `ScraperManager` in `src/backend/scraperManager.ts`

Example for adding a new scraper:

```typescript
// In scraper.ts
export class NewStoreScraper extends WebScraper {
  protected readonly baseUrl = 'https://www.newstore.com';
  protected readonly source = 'newstore';

  async searchProducts(query: string): Promise<Product[]> {
    // Implementation specific to the new store
    // ...
  }
}

// In scraperManager.ts - constructor
this.scrapers.set('newstore', new NewStoreScraper());
```

## Important Notes

- The scraping functionality is intended for personal use and educational purposes only.
- Be aware that some websites may have terms of service that prohibit scraping.
- Excessive requests may result in IP blocking by the target websites.
- Use appropriate rate limiting and user agents to be respectful of target websites.

## Web Scraping Implementation Details

The backend for AISearch uses web scraping to gather product data from various e-commerce websites. Here's an overview of the implementation:

### Architecture

- **Modular Design**: Each scraper is implemented as a separate class extending a common base class, making it easy to add support for new websites.
- **Express API**: The backend exposes RESTful endpoints for searching products using Express.js.
- **Cheerio for Parsing**: We use Cheerio, a jQuery-like library for server-side HTML parsing.

### Key Components

1. **WebScraper (Abstract Base Class)**: Defines the interface and common utilities for all scrapers.
2. **Specific Scrapers**: 
   - `AmazonScraper`
   - `WalmartScraper`
   - `EbayScraper`
3. **ScraperManager**: Manages multiple scrapers and allows searching across all or specific sources.
4. **Express Server**: Handles API requests and routes them to the appropriate scrapers.

### How Scraping Works

For each website:

1. The scraper constructs a search URL based on the query
2. It fetches the HTML content of the search results page
3. Using Cheerio selectors, it extracts product information (name, price, image, etc.)
4. The data is normalized into a common `Product` interface
5. Results are returned as JSON via the API

### Customization Tips

To customize the scraping behavior:

1. Adjust the CSS selectors in each scraper class to match website changes.
2. Modify the rate limiting strategy if you encounter blocking issues.
3. Add more data fields to the `Product` interface if needed (e.g., ratings, seller info).

### Deployment Considerations

When deploying the backend:

1. **Rate Limiting**: Implement proper rate limiting to avoid overloading target websites.
2. **Proxy Rotation**: For production use, consider implementing proxy rotation to avoid IP bans.
3. **Caching**: Add Redis or another caching layer to reduce repeated scraping of the same queries.
4. **Error Handling**: Enhance error handling for production scenarios. 