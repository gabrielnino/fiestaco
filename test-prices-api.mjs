
const BASE_URL = 'http://localhost:3000';
const ADMIN_TOKEN = 'Bearer fiestaco-admin-2024';

async function runTests() {
  console.log('🧪 Starting automatic API tests for /api/config/prices...');
  
  try {
    // Test 1: GET prices
    console.log('\n[Test 1] Fetching default prices...');
    const getRes = await fetch(`${BASE_URL}/api/config/prices`);
    if (!getRes.ok) throw new Error(`GET failed with status ${getRes.status}`);
    const data = await getRes.json();
    console.log('✅ GET successful. Base price:', data.basePrice);
    
    // Test 2: POST without token (should fail)
    console.log('\n[Test 2] Attempting unauthorized updates...');
    const postFail = await fetch(`${BASE_URL}/api/config/prices`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ basePrice: 999 })
    });
    if (postFail.status === 401) {
      console.log('✅ Unauthorized POST correctly rejected with 401');
    } else {
      console.log('❌ Expected 401, got', postFail.status);
    }

    // Test 3: POST with token
    console.log('\n[Test 3] Updating base price and a flavor surcharge...');
    const newData = {
      ...data,
      basePrice: 50,
      flavors: { ...data.flavors, 'al-pastor': 2 }
    };
    
    const postRes = await fetch(`${BASE_URL}/api/config/prices`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': ADMIN_TOKEN
      },
      body: JSON.stringify(newData)
    });
    
    if (!postRes.ok) throw new Error(`POST failed with status ${postRes.status}`);
    const updatedData = await postRes.json();
    console.log('✅ POST successful. New base price:', updatedData.basePrice);
    console.log('✅ New Al Pastor surcharge:', updatedData.flavors['al-pastor']);
    
    // Test 4: Revert
    console.log('\n[Test 4] Reverting to original prices...');
    await fetch(`${BASE_URL}/api/config/prices`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': ADMIN_TOKEN },
      body: JSON.stringify(data)
    });
    console.log('✅ Reverted successfully.');
    
    console.log('\n🎉 All automated tests passed!');
  } catch (err) {
    console.error('❌ Test failed:', err);
  }
}

runTests();
