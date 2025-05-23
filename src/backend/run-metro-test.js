// Simple script to test the Metro scraper directly

// Since this is a JavaScript file, we need to use require and CommonJS
const { MetroScraper } = require('./scraper');

// Create a test function that we can run
async function testMetroScraper() {
  try {
    console.log('Testing Metro Scraper...');
    
    // Create a new Metro scraper
    const metroScraper = new MetroScraper();
    
    // Test with a search term
    const searchTerm = 'surf excel';
    console.log(`Searching for: "${searchTerm}"`);
    
    // Perform the search
    const results = await metroScraper.searchProducts(searchTerm);
    
    // Display the results
    console.log(`Found ${results.length} results:`);
    results.forEach((product, index) => {
      console.log(`\nProduct ${index + 1}:`);
      console.log(`  Name: ${product.name}`);
      console.log(`  Price: ${product.price}`);
      console.log(`  URL: ${product.url}`);
      console.log(`  Image: ${product.imageUrl.substring(0, 50)}...`);
    });
    
    console.log('\nTest completed successfully!');
  } catch (error) {
    console.error('Error testing Metro scraper:', error);
  }
}

// Run the test
testMetroScraper(); 