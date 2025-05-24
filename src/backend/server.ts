import express from 'express';
import type { Request, Response } from 'express';
import cors from 'cors';
import { ScraperManager } from './scraperManager';

const app = express();
const PORT = parseInt(process.env.PORT || '3000', 10);

// Configure C for mobile access
app.use(cors({
  origin: '*', // In production, replace with your app's domain
  methods: ['GET'],
  allowedHeaders: ['Content-Type']
}));

app.use(express.json());

// Initialize the scraper manager
const scraperManager = new ScraperManager();

// Health check endpoint
app.get('/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Route to get available sources
app.get('/api/sources', (_req: Request, res: Response) => {
  try {
    const sources = scraperManager.getSources();
    res.json({ success: true, sources });
  } catch (error) {
    console.error('Error getting sources:', error);
    res.status(500).json({ success: false, error: 'Failed to get sources' });
  }
});

// Route to search all sources
app.get('/api/search', async (req: Request, res: Response) => {
  try {
    const query = req.query.q as string;
    
    if (!query) {
      return res.status(400).json({ success: false, error: 'Query parameter (q) is required' });
    }
    
    console.log(`Searching for: ${query}`);
    const products = await scraperManager.searchAllSources(query);
    
    res.json({ 
      success: true, 
      query, 
      count: products.length,
      products 
    });
  } catch (error) {
    console.error('Error searching products:', error);
    res.status(500).json({ success: false, error: 'Failed to search products' });
  }
});

// Route to search specific source
app.get('/api/search/:source', async (req: Request, res: Response) => {
  try {
    const { source } = req.params;
    const query = req.query.q as string;
    
    if (!query) {
      return res.status(400).json({ success: false, error: 'Query parameter (q) is required' });
    }
    
    if (!scraperManager.getSources().includes(source.toLowerCase())) {
      return res.status(400).json({ success: false, error: `Invalid source: ${source}` });
    }
    
    console.log(`Searching ${source} for: ${query}`);
    const products = await scraperManager.searchSpecificSource(source, query);
    
    res.json({ 
      success: true, 
      source,
      query, 
      count: products.length,
      products 
    });
  } catch (error) {
    console.error(`Error searching ${req.params.source}:`, error);
    res.status(500).json({ success: false, error: `Failed to search ${req.params.source}` });
  }
});

// Start the server only if this file is run directly
if (require.main === module) {
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
    console.log('Available endpoints:');
    console.log('- GET /health');
    console.log('- GET /api/sources');
    console.log('- GET /api/search?q=<query>');
    console.log('- GET /api/search/:source?q=<query>');
  });
}

export default app; 