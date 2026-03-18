# JWT RS256 - RSA 2048-bit Asymmetric Encryption

## Tìm hiểu RS256

### Định nghĩa
- **RS256**: RSA Signature with SHA-256
- **Độ an toàn**: 2048-bit RSA (120-bit security level)
- **Loại**: Asymmetric cryptography (Mã hóa bất đối xứng)

### So sánh HS256 vs RS256

| Tiêu chí | HS256 | RS256 |
|---------|-------|-------|
| **Kiểu mã hóa** | Symmetric (Đối xứng) | Asymmetric (Bất đối xứng) |
| **Key** | 1 secret key | 2 keys: private + public |
| **Ký token** | Dùng secret key | Dùng private key |
| **Kiểm tra token** | Dùng secret key | Dùng public key |
| **Bảo mật** | Cần giữ secret key | Có thể chia sẻ public key |
| **Microservices** | Khó (toàn bộ share secret) | Dễ (dùng public key để verify) |
| **Performance** | Nhanh | Chậm hơn |

---

## Cấu trúc JWT RS256

JWT gồm 3 phần: **Header.Payload.Signature**

### 1. Header
```json
{
  "alg": "RS256",
  "typ": "JWT"
}
```

### 2. Payload
```json
{
  "id": "user_id",
  "iat": 1773804547,
  "exp": 1773808147
}
```
- `id`: User ID
- `iat`: Issued At (thời gian tạo)
- `exp`: Expiration time (thời gian hết hạn)

### 3. Signature
```
RSASHA256(
  base64UrlEncode(header) + "." +
  base64UrlEncode(payload),
  privateKey
)
```

---

## RSA 2048-bit Keys

### Private Key Format (PKCS#8)
```
-----BEGIN PRIVATE KEY-----
MIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQC08N67zXA+lC7D
bn7IRLS3mkALWTCpnY2bD38nHbBnfYaj9FJqqbS4pkwe8B+RMV6RRLROGWc15nLUQ
...
-----END PRIVATE KEY-----
```

**Đặc điểm:**
- Kích thước: ~1.7 KB (1704 bytes)
- Được bảo vệ bởi private (không chia sẻ)
- Dùng để ký JWT token

### Public Key Format (PKCS#1)
```
-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAtPDeu81wPpQuw25+yESy
t5pAC1kwqZ2Nmw9/Jx2wZ32Go/RSaqm0uKZMHvAfkTFekS0ThLnNeZy1EGJW3DgP
...
-----END PUBLIC KEY-----
```

**Đặc điểm:**
- Kích thước: ~451 bytes  
- Có thể chia sẻ công khai
- Dùng để verify JWT token

---

## Cách Hoạt Động

### Khi User Login (Ký Token)
```
1. User gửi username + password
2. Server verify password
3. Server tạo JWT payload: { id: userId }
4. Server ký token bằng PRIVATE KEY
5. Server gửi token cho client
```

**Code:**
```javascript
let token = jwt.sign({
    id: user._id
}, privateKey, {
    algorithm: 'RS256',
    expiresIn: '1h'
})
```

### Khi User Request (Kiểm Tra Token)
```
1. Client gửi Authorization: Bearer <TOKEN>
2. Server lấy token từ header
3. Server kiểm tra token bằng PUBLIC KEY
4. Nếu valid: cho phép request
5. Nếu invalid: từ chối request
```

**Code:**
```javascript
let result = jwt.verify(token, publicKey, { algorithm: 'RS256' })
```

---

## Ưu Điểm RS256 so với HS256

### 1. **Bảo mật cao hơn**
- Private key chỉ trên authentication server
- Public key có thể chia sẻ cho mọi nơi
- Không cần chia sẻ secret key

### 2. **Phù hợp với Microservices**
- Multiple servers có thể verify token với cung 1 public key
- Không cần sync secret key

### 3. **Non-repudiation**
- Server có thể chứng minh nó ký token
- Client không thể phủ nhận

### 4. **Scalability**
- Dễ mở rộng hệ thống
- Các service khác có thể verify token độc lập

---

## RSA 2048-bit Security

### Độ bảo mật
- **2048-bit RSA ≈ 112-bit symmetric encryption** (tương đương AES-128)
- **Đủ bảo mật cho 10+ năm** (theo NIST)
- **Khuyến nghị**: 2048-bit tối thiểu, 3072+ cho bảo mật dài hạn

### Thời gian ký/verify (2048-bit)
- Ký: **10-50ms** (phụ thuộc server)
- Verify: **5-30ms** (phụ thuộc server)

---

## Cách Generate RSA Keys

### Dùng OpenSSL

**Generate Private Key:**
```bash
openssl genrsa -out private.key 2048
```

**Generate Public Key từ Private Key:**
```bash
openssl rsa -in private.key -pubout -out public.key
```

**Verify key size:**
```bash
openssl rsa -in private.key -text -noout | grep "Private-Key"
```

---

## Project Implementation

### File Cấu Hình
- **Private Key**: `./private.key` - Ký token
- **Public Key**: `./public.key` - Verify token
- **Expiration**: 1 hour (3600 seconds)

### Middleware Verification
```javascript
const publicKey = fs.readFileSync('./public.key', 'utf8');

jwt.verify(token, publicKey, { algorithm: 'RS256' })
```

### Controllers
```javascript
const privateKey = fs.readFileSync('./private.key', 'utf8');

jwt.sign({ id: user._id }, privateKey, {
    algorithm: 'RS256',
    expiresIn: '1h'
})
```

---

## Security Best Practices

1. ✅ **Bảo vệ Private Key**
   - Cấp quyền restricted (chmod 600)
   - Không commit vào git
   - Lưu trữ an toàn (environment variable, secret manager)

2. ✅ **Validate Token**
   - Luôn kiểm tra signature
   - Luôn kiểm tra expiration
   - Kiểm tra algorithm (reject nếu "none")

3. ✅ **HTTPS Only**
   - Gửi token qua HTTPS
   - Tránh token bị intercept

4. ✅ **Rotate Keys**
   - Định kỳ regenerate keys
   - Hỗ trợ multiple public keys (old + new)

---

## Tài Liệu Tham Khảo

- [JWT.io](https://jwt.io/) - Decode & verify JWT online
- [RFC 7518](https://tools.ietf.org/html/rfc7518) - JSON Web Algorithms (JWA)
- [OpenSSL Documentation](https://www.openssl.org/docs/)
- [Node.js jsonwebtoken](https://github.com/auth0/node-jsonwebtoken)
