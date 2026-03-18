const http = require('http');

const baseUrl = 'http://localhost:3000';
let token = null;

function makeRequest(method, path, body = null, useToken = false) {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: 'localhost',
            port: 3000,
            path: path,
            method: method,
            headers: {
                'Content-Type': 'application/json'
            }
        };

        if (useToken && token) {
            options.headers['Authorization'] = `Bearer ${token}`;
        }

        const req = http.request(options, (res) => {
            let data = '';
            res.on('data', (chunk) => { data += chunk; });
            res.on('end', () => {
                try {
                    resolve({
                        status: res.statusCode,
                        body: JSON.parse(data)
                    });
                } catch (e) {
                    resolve({
                        status: res.statusCode,
                        body: data
                    });
                }
            });
        });

        req.on('error', reject);
        if (body) req.write(JSON.stringify(body));
        req.end();
    });
}

async function runTests() {
    try {
        console.log('=== TEST API COMPLETE FLOW ===\n');

        // Test 1: Register new user
        const timestamp = Date.now();
        const newUsername = `testuser${timestamp}`;
        const password = 'TestPass@1234';
        const email = `test${timestamp}@example.com`;

        console.log('1. REGISTER - Creating new user:');
        console.log(`   username: ${newUsername}`);
        console.log(`   password: ${password}`);
        console.log(`   email: ${email}`);
        
        const registerRes = await makeRequest('POST', '/api/v1/auth/register', {
            username: newUsername,
            password,
            email
        });
        console.log(`   Status: ${registerRes.status}`);
        console.log(`   Response:`, JSON.stringify(registerRes.body, null, 2));
        console.log('\n');

        // Test 2: Login
        console.log('2. LOGIN - Authenticating user:');
        console.log(`   username: ${newUsername}`);
        console.log(`   password: ${password}`);
        
        const loginRes = await makeRequest('POST', '/api/v1/auth/login', {
            username: newUsername,
            password
        });
        console.log(`   Status: ${loginRes.status}`);
        if (typeof loginRes.body === 'string' && loginRes.body.length > 200) {
            token = loginRes.body;
            console.log(`   Token (RS256): ${token.substring(0, 100)}...`);
            console.log(`   Token length: ${token.length} characters`);
        } else {
            console.log(`   Token/Response:`, JSON.stringify(loginRes.body, null, 2));
        }
        console.log('\n');

        // Test 3: Get /me
        console.log('3. GET /me - Get current user info:');
        console.log(`   Authorization: Bearer [TOKEN]`);
        
        const meRes = await makeRequest('GET', '/api/v1/auth/me', null, true);
        console.log(`   Status: ${meRes.status}`);
        console.log(`   Response:`, JSON.stringify(meRes.body, null, 2));
        console.log('\n');

        // Test 4: Change Password
        if (token) {
            console.log('4. CHANGE PASSWORD - Update password:');
            const newPassword = 'NewPass@5678';
            console.log(`   oldpassword: ${password}`);
            console.log(`   newpassword: ${newPassword}`);
            console.log(`   Authorization: Bearer [TOKEN]`);
            
            const changeRes = await makeRequest('POST', '/api/v1/auth/changepassword', {
                oldpassword: password,
                newpassword: newPassword
            }, true);
            console.log(`   Status: ${changeRes.status}`);
            console.log(`   Response:`, JSON.stringify(changeRes.body, null, 2));
            console.log('\n');

            // Test 5: Try logging in with old password (should fail)
            console.log('5. LOGIN with OLD password (should fail):');
            const loginOldRes = await makeRequest('POST', '/api/v1/auth/login', {
                username: newUsername,
                password: password
            });
            console.log(`   Status: ${loginOldRes.status}`);
            console.log(`   Response:`, JSON.stringify(loginOldRes.body, null, 2));
            console.log('\n');

            // Test 6: Try logging in with new password (should succeed)
            console.log('6. LOGIN with NEW password (should succeed):');
            const loginNewRes = await makeRequest('POST', '/api/v1/auth/login', {
                username: newUsername,
                password: newPassword
            });
            console.log(`   Status: ${loginNewRes.status}`);
            if (typeof loginNewRes.body === 'string' && loginNewRes.body.length > 200) {
                console.log(`   Token (RS256): ${loginNewRes.body.substring(0, 100)}...`);
            } else {
                console.log(`   Response:`, JSON.stringify(loginNewRes.body, null, 2));
            }
        }

    } catch (error) {
        console.error('ERROR:', error.message);
    }
    process.exit(0);
}

runTests();
