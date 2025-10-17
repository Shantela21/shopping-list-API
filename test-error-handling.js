// Comprehensive test for error handling and response consistency
const http = require('http');

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
          body: body ? JSON.parse(body) : null,
          headers: res.headers
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

function validateResponseStructure(response, expectedSuccess) {
  const { body } = response;
  
  if (!body) return true; // 204 responses have no body
  
  // Check if response has consistent structure
  if (typeof body.success !== 'boolean') {
    console.log('Response missing success field:', body);
    return false;
  }
  
  if (body.success !== expectedSuccess) {
    console.log(`Expected success: ${expectedSuccess}, got: ${body.success}`);
    return false;
  }
  
  if (expectedSuccess) {
    if (!body.hasOwnProperty('data')) {
      console.log('Success response missing data field:', body);
      return false;
    }
  } else {
    if (!body.error || typeof body.error !== 'string') {
      console.log('Error response missing or invalid error field:', body);
      return false;
    }
  }
  
  return true;
}

async function testErrorHandlingAndConsistency() {
  console.log('Testing Error Handling & Response Consistency...\n');
  
  let testsPassed = 0;
  let totalTests = 0;
  
  // Test 1: GET all items (success)
  console.log('1. Testing GET /items (success)');
  totalTests++;
  try {
    const response = await makeRequest('GET', '/items');
    if (response.statusCode === 200 && validateResponseStructure(response, true)) {
      console.log('GET /items returns consistent success response');
      testsPassed++;
    } else {
      console.log('GET /items failed consistency check');
    }
  } catch (error) {
    console.log('GET /items failed:', error.message);
  }
  
  // Test 2: GET invalid item ID (400 error)
  console.log('\n2. Testing GET /items/invalid (400 error)');
  totalTests++;
  try {
    const response = await makeRequest('GET', '/items/invalid');
    if (response.statusCode === 400 && validateResponseStructure(response, false)) {
      console.log('GET invalid ID returns consistent 400 error');
      testsPassed++;
    } else {
      console.log('GET invalid ID failed consistency check');
    }
  } catch (error) {
    console.log('GET invalid ID failed:', error.message);
  }
  
  // Test 3: GET non-existent item (404 error)
  console.log('\n3. Testing GET /items/999 (404 error)');
  totalTests++;
  try {
    const response = await makeRequest('GET', '/items/999');
    if (response.statusCode === 404 && validateResponseStructure(response, false)) {
      console.log('✅ GET non-existent item returns consistent 404 error');
      testsPassed++;
    } else {
      console.log('❌ GET non-existent item failed consistency check');
    }
  } catch (error) {
    console.log('❌ GET non-existent item failed:', error.message);
  }
  
  // Test 4: POST valid item (201 success)
  console.log('\n4. Testing POST /items (201 success)');
  totalTests++;
  try {
    const testItem = { name: "Test Item", quantity: 5, purchasedStatus: false };
    const response = await makeRequest('POST', '/items', testItem);
    if (response.statusCode === 201 && validateResponseStructure(response, true)) {
      console.log('✅ POST valid item returns consistent 201 success');
      testsPassed++;
    } else {
      console.log('❌ POST valid item failed consistency check');
    }
  } catch (error) {
    console.log('❌ POST valid item failed:', error.message);
  }
  
  // Test 5: POST invalid item - missing name (400 error)
  console.log('\n5. Testing POST /items with missing name (400 error)');
  totalTests++;
  try {
    const invalidItem = { quantity: 5, purchasedStatus: false };
    const response = await makeRequest('POST', '/items', invalidItem);
    if (response.statusCode === 400 && validateResponseStructure(response, false)) {
      console.log('✅ POST missing name returns consistent 400 error');
      testsPassed++;
    } else {
      console.log('❌ POST missing name failed consistency check');
    }
  } catch (error) {
    console.log('❌ POST missing name failed:', error.message);
  }
  
  // Test 6: POST invalid JSON (400 error)
  console.log('\n6. Testing POST /items with invalid JSON (400 error)');
  totalTests++;
  try {
    const options = {
      hostname: 'localhost',
      port: 4000,
      path: '/items',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    };
    
    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => { body += chunk; });
      res.on('end', () => {
        const response = {
          statusCode: res.statusCode,
          body: body ? JSON.parse(body) : null
        };
        if (response.statusCode === 400 && validateResponseStructure(response, false)) {
          console.log('✅ POST invalid JSON returns consistent 400 error');
          testsPassed++;
        } else {
          console.log('❌ POST invalid JSON failed consistency check');
        }
      });
    });
    
    req.write('{ invalid json }');
    req.end();
  } catch (error) {
    console.log('❌ POST invalid JSON failed:', error.message);
  }
  
  // Test 7: PUT with invalid ID (400 error)
  console.log('\n7. Testing PUT /items/invalid (400 error)');
  totalTests++;
  try {
    const updates = { name: "Updated Name" };
    const response = await makeRequest('PUT', '/items/invalid', updates);
    if (response.statusCode === 400 && validateResponseStructure(response, false)) {
      console.log('✅ PUT invalid ID returns consistent 400 error');
      testsPassed++;
    } else {
      console.log('❌ PUT invalid ID failed consistency check');
    }
  } catch (error) {
    console.log('❌ PUT invalid ID failed:', error.message);
  }
  
  // Test 8: DELETE with invalid ID (400 error)
  console.log('\n8. Testing DELETE /items/invalid (400 error)');
  totalTests++;
  try {
    const response = await makeRequest('DELETE', '/items/invalid');
    if (response.statusCode === 400 && validateResponseStructure(response, false)) {
      console.log('✅ DELETE invalid ID returns consistent 400 error');
      testsPassed++;
    } else {
      console.log('❌ DELETE invalid ID failed consistency check');
    }
  } catch (error) {
    console.log('❌ DELETE invalid ID failed:', error.message);
  }
  
  // Test 9: Method not allowed (405 error)
  console.log('\n9. Testing PATCH /items (405 error)');
  totalTests++;
  try {
    const response = await makeRequest('PATCH', '/items');
    if (response.statusCode === 405 && validateResponseStructure(response, false)) {
      console.log('✅ PATCH method returns consistent 405 error');
      testsPassed++;
    } else {
      console.log('❌ PATCH method failed consistency check');
    }
  } catch (error) {
    console.log('❌ PATCH method failed:', error.message);
  }
  
  // Summary
  console.log(`\n📊 Test Results: ${testsPassed}/${totalTests} tests passed`);
  
  if (testsPassed === totalTests) {
    console.log('🎉 All error handling and response consistency tests passed!');
  } else {
    console.log('⚠️  Some tests failed. Check the error handling implementation.');
  }
  
  console.log('\n📋 Response Structure Validation:');
  console.log('✅ Success responses: { success: true, data: any, message?: string }');
  console.log('✅ Error responses: { success: false, error: string }');
  console.log('✅ 204 responses: No body (as expected)');
}

// Wait a moment for any previous tests to complete, then run
setTimeout(testErrorHandlingAndConsistency, 1000);
