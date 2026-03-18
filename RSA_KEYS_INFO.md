# Verify RSA 2048-bit Keys

## Project Keys Information

### Private Key (`private.key`)
- **File Size**: 1,704 bytes
- **Format**: PKCS#8 (BEGIN PRIVATE KEY)
- **Key Size**: 2048 bits (256 bytes)
- **Algorithm**: RSA
- **Purpose**: Ký JWT tokens

### Public Key (`public.key`)
- **File Size**: 451 bytes
- **Format**: PKCS#1 (BEGIN PUBLIC KEY)
- **Key Size**: 2048 bits (256 bytes)  
- **Algorithm**: RSA
- **Purpose**: Verify JWT tokens

## How to Verify Key Size (2048-bit)

### Using OpenSSL Command
```bash
# Check Private Key
openssl rsa -in private.key -text -noout | grep "Private-Key"
# Output should show: Private-Key: (2048 bit, RSA Public-Key: (2048 bit, Exponent: 65537 (0x10001))

# Check Public Key
openssl rsa -pubin -in public.key -text -noout | grep "Public-Key"
# Output should show: Public-Key: (2048 bit)
```

### Using Node.js
```javascript
const crypto = require('crypto');
const fs = require('fs');

// Read private key
const privateKeyPem = fs.readFileSync('private.key', 'utf8');
const keyObject = crypto.createPrivateKey(privateKeyPem);
const keyDetail = keyObject.asymmetricKeyDetails;

console.log('Key Type:', keyDetail.type);        // 'private'
console.log('Key Size (bits):', keyDetail.modulusLength); // 2048
```

## RSA 2048-bit in Project

### Token Generation (Login)
```javascript
// File: routes/auth.js
const privateKey = fs.readFileSync('./private.key', 'utf8');

let token = jwt.sign({
    id: user._id
}, privateKey, {
    algorithm: 'RS256',      // ← Sử dụng RS256 với 2048-bit key
    expiresIn: '1h'
})
```

### Token Verification (CheckLogin)
```javascript
// File: utils/authHandler.js
const publicKey = fs.readFileSync('./public.key', 'utf8');

let result = jwt.verify(token, publicKey, { algorithm: 'RS256' })
```

## Sample RS256 Token Decoded

### Header
```json
{
  "alg": "RS256",      // ← RSA with SHA-256
  "typ": "JWT"
}
```

### Payload
```json
{
  "id": "69ba1bdb0d1ffd2601c7a3e6",
  "iat": 1773804547,  // Issued at
  "exp": 1773808147   // Expires in 1 hour
}
```

### Sample Token (Redacted)
```
eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9
.eyJpZCI6IjY5YmExYmRiMGQxZmZkMjYwMWM3YTNlNiIsImlhdCI6MTc3MzgwNDU0NywiZXhwIjoxNzczODA4MTQ3fQ
.signature...
```

---

## Verify Project Configuration

File structure:
```
NNPTUDM_Buoi6/
├── private.key         (2048-bit RSA, 1704 bytes)
├── public.key          (2048-bit RSA, 451 bytes)
├── routes/
│   └── auth.js         (Ký token với private.key)
├── utils/
│   └── authHandler.js  (Verify token với public.key)
└── ...
```

## Token Lifecycle

1. **User Registration** → Password hashed (bcrypt)
2. **User Login**
   - Verify password
   - Generate JWT ← **Signed with 2048-bit PRIVATE KEY**
   - Return JWT token (470 characters)
3. **User Request** (with Authorization header)
   - Extract token
   - Verify signature ← **Using 2048-bit PUBLIC KEY**
   - Extract user id from payload
   - Continue request
4. **Change Password**
   - Verify old password
   - Hash new password
   - Update database
   - Token vẫn valid (không bị logout)

---

## Summary

✅ **Project sử dụng:**
- Algorithm: **RS256** (RSA + SHA-256)
- Key Size: **2048-bit** (industry standard)
- Xác thực: Verify signature + Expiration check
- Bảo mật: Private key được bảo vệ, Public key được share an toàn
