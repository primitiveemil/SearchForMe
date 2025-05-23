import express from 'express';
import cors from 'cors';
import { ScraperManager } from './scraperManager';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize the scraper manager
const scraperManager = new ScraperManager();

// Route to get available sources
app.get('/api/sources', (req, res) => {
  try {
    const sources = scraperManager.getSources();
    res.json({ success: true, sources });
  } catch (error) {
    console.error('Error getting sources:', error);
    res.status(500).json({ success: false, error: 'Failed to get sources' });
  }
});

// Route to search all sources
app.get('/api/search', async (req, res) => {
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
app.get('/api/search/:source', async (req, res) => {
  try {
    const { source } = req.params;
    const query = req.query.q as string;
    
    if (!query) {
      return res.status(400).json({ success: false, error: 'Query parameter (q) is required' });
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

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app; 