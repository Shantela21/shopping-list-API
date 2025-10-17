// Quick test for DELETE endpoint functionality
const http = require('http');

// Test data
const testItem = {
  name: "Test Item",
  quantity: 1,
  purchasedStatus: false
};

function makeRequest(method, path, data = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 4000,
      path: path,
      method: method,
      headers: {
        'Content-Type': 'application/json'
      }
    };

    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => {
        body += chunk;
      });
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          body: body ? JSON.parse(body) : null
        });
      });
    });

    req.on('error', reject);

    if (data) {
      req.write(JSON.stringify(data));
    }
    req.end();
  });
}

async function testDeleteEndpoint() {
  try {
    console.log('Testing DELETE endpoint...');
    
    // 1. Create an item first
    console.log('1. Creating test item...');
    const createResponse = await makeRequest('POST', '/items', testItem);
    console.log('Created item:', createResponse);
    
    if (createResponse.statusCode !== 201) {
      throw new Error('Failed to create test item');
    }
    
    const itemId = createResponse.body.id;
    
    // 2. Delete the item
    console.log(`2. Deleting item with ID ${itemId}...`);
    const deleteResponse = await makeRequest('DELETE', `/items/${itemId}`);
    console.log('Delete response status:', deleteResponse.statusCode);
    
    if (deleteResponse.statusCode === 204) {
      console.log('✅ DELETE successful - returned 204 No Content');
    } else {
      console.log('❌ DELETE failed - expected 204, got', deleteResponse.statusCode);
    }
    
    // 3. Try to get the deleted item (should return 404)
    console.log(`3. Trying to get deleted item ${itemId}...`);
    const getResponse = await makeRequest('GET', `/items/${itemId}`);
    console.log('Get response status:', getResponse.statusCode);
    
    if (getResponse.statusCode === 404) {
      console.log('✅ Item properly deleted - GET returns 404');
    } else {
      console.log('❌ Item still exists - expected 404, got', getResponse.statusCode);
    }
    
    // 4. Try to delete non-existent item (should return 404)
    console.log('4. Trying to delete non-existent item...');
    const deleteNonExistentResponse = await makeRequest('DELETE', '/items/999');
    console.log('Delete non-existent response status:', deleteNonExistentResponse.statusCode);
    
    if (deleteNonExistentResponse.statusCode === 404) {
      console.log('✅ DELETE non-existent item returns 404');
    } else {
      console.log('❌ DELETE non-existent item failed - expected 404, got', deleteNonExistentResponse.statusCode);
    }
    
    console.log('\n🎉 DELETE endpoint test completed!');
    
  } catch (error) {
    console.error('Test failed:', error.message);
    console.log('Make sure the server is running with: npm run dev');
  }
}

testDeleteEndpoint();
