const http = require('http');

// Test API calls
const baseUrl = 'http://localhost:3000';
const username = 'testuser123';
const password = 'Test@1234';
const email = 'test123@example.com';

function makeRequest(method, path, body = null) {
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

        const req = http.request(options, (res) => {
            let data = '';
            res.on('data', (chunk) => { data += chunk; });
            res.on('end', () => {
                try {
                    resolve({
                        status: res.statusCode,
                        headers: res.headers,
                        body: JSON.parse(data)
                    });
                } catch (e) {
                    resolve({
                        status: res.statusCode,
                        headers: res.headers,
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
        console.log('=== TEST API ===\n');

        // Test 1: Register
        console.log('1. Register user:');
        const registerRes = await makeRequest('POST', '/api/v1/auth/register', {
            username,
            password,
            email
        });
        console.log('Status:', registerRes.status);
        console.log('Response:', JSON.stringify(registerRes.body, null, 2));
        console.log('\n');

        // Test 2: Login
        console.log('2. Login:');
        const loginRes = await makeRequest('POST', '/api/v1/auth/login', {
            username,
            password
        });
        console.log('Status:', loginRes.status);
        const token = loginRes.body;
        console.log('Token:', token.substring(0, 50) + '...');
        console.log('\n');

        // Test 3: Get /me
        console.log('3. Get /me:');
        const meRes = await makeRequest('GET', '/api/v1/auth/me', null);
        const meOptions = {
            hostname: 'localhost',
            port: 3000,
            path: '/api/v1/auth/me',
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        };

        const meReq = new Promise((resolve) => {
            const req = http.request(meOptions, (res) => {
                let data = '';
                res.on('data', (chunk) => { data += chunk; });
                res.on('end', () => {
                    resolve({
                        status: res.statusCode,
                        body: JSON.parse(data)
                    });
                });
            });
            req.end();
        });

        const meResult = await meReq;
        console.log('Status:', meResult.status);
        console.log('Response:', JSON.stringify(meResult.body, null, 2));
        console.log('\n');

        // Test 4: Change Password
        console.log('4. Change Password:');
        const changePassOptions = {
            hostname: 'localhost',
            port: 3000,
            path: '/api/v1/users/change-password',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        };

        const changePassReq = new Promise((resolve) => {
            const req = http.request(changePassOptions, (res) => {
                let data = '';
                res.on('data', (chunk) => { data += chunk; });
                res.on('end', () => {
                    resolve({
                        status: res.statusCode,
                        body: JSON.parse(data)
                    });
                });
            });
            req.write(JSON.stringify({
                oldpassword: password,
                newpassword: 'NewTest@5678'
            }));
            req.end();
        });

        const changePassResult = await changePassReq;
        console.log('Status:', changePassResult.status);
        console.log('Response:', JSON.stringify(changePassResult.body, null, 2));

    } catch (error) {
        console.error('Error:', error.message);
    }
}

runTests();
