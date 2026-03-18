# HƯỚNG DẪN TEST API TRÊN POSTMAN

## 1. REGISTER - Tạo tài khoản mới

**Method:** POST  
**URL:** `http://localhost:3000/api/v1/auth/register`

**Headers:**
```
Content-Type: application/json
```

**Body (JSON):**
```json
{
  "username": "testuser123",
  "password": "TestPass@1234",
  "email": "testuser@example.com"
}
```

**Expected Response (Status 200):**
```json
{
  "_id": "69ba1bdb0d1ffd2601c7a3e6",
  "username": "testuser123",
  "password": "$2b$10$o29ZtMZ.CB...",
  "email": "testuser@example.com",
  "fullName": "",
  "avatarUrl": "https://i.sstatic.net/l60Hf.png",
  "status": false,
  "role": "69ba18015fed555ea69195cd",
  "loginCount": 0,
  "isDeleted": false,
  "createdAt": "2026-03-18T03:28:27.192Z",
  "updatedAt": "2026-03-18T03:28:27.192Z"
}
```

---

## 2. LOGIN - Đăng nhập

**Method:** POST  
**URL:** `http://localhost:3000/api/v1/auth/login`

**Headers:**
```
Content-Type: application/json
```

**Body (JSON):**
```json
{
  "username": "testuser123",
  "password": "TestPass@1234"
}
```

**Expected Response (Status 200):**
```
eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY5YmExYmRiMGQxZmZkMjYwMWM3YTNlNiIsImlhdCI6MTc3MzgwNDU0NywiZXhwIjoxNzczODA4MTQ3fQ.signature...
```

**Lưu ý:** 
- Token là JWT sử dụng thuật toán **RS256** (RSA 2048-bit)
- Sao chép token này để dùng cho request tiếp theo

---

## 3. GET /ME - Lấy thông tin người dùng đang đăng nhập

**Method:** GET  
**URL:** `http://localhost:3000/api/v1/auth/me`

**Headers:**
```
Content-Type: application/json
Authorization: Bearer <TOKEN>
```

**Thay thế `<TOKEN>` bằng token từ step 2**

**Expected Response (Status 200):**
```json
{
  "_id": "69ba1bdb0d1ffd2601c7a3e6",
  "username": "testuser123",
  "password": "$2b$10$o29ZtMZ.CBWvYhEoveWJD.mDG2W2zvc/.pv15/TkNPiJL..VaAk06",
  "email": "testuser@example.com",
  "fullName": "",
  "avatarUrl": "https://i.sstatic.net/l60Hf.png",
  "status": false,
  "role": "69ba18015fed555ea69195cd",
  "loginCount": 0,
  "isDeleted": false,
  "createdAt": "2026-03-18T03:28:27.192Z",
  "updatedAt": "2026-03-18T03:28:27.192Z"
}
```

---

## 4. CHANGE PASSWORD - Thay đổi mật khẩu

**Method:** POST  
**URL:** `http://localhost:3000/api/v1/auth/changepassword`

**Headers:**
```
Content-Type: application/json
Authorization: Bearer <TOKEN>
```

**Body (JSON):**
```json
{
  "oldpassword": "TestPass@1234",
  "newpassword": "NewPass@5678"
}
```

**Yêu cầu New Password:**
- Tối thiểu 8 ký tự
- Ít nhất 1 ký tự chữ hoa (A-Z)
- Ít nhất 1 ký tự chữ thường (a-z)
- Ít nhất 1 ký tự số (0-9)
- Ít nhất 1 ký tự đặc biệt (!@#$%^&*)

**Expected Response (Status 200):**
```json
{
  "message": "Thay đổi mật khẩu thành công"
}
```

---

## CÁC LỖI THƯỜNG GẶP

### Lỗi Register
- **Duplicate key error**: Username hoặc email đã tồn tại
- **Giải pháp**: Dùng username/email khác

### Lỗi Login
- **"thong tin dang nhap sai"**: Username hoặc password không đúng
- **"ban dang bi ban"**: Tài khoản bị khóa do login sai 3 lần

### Lỗi Change Password
- **"ban chua dang nhap"**: Token không được gửi hoặc token sai/hết hạn
- **"Mật khẩu cũ không chính xác"**: Old password nhập sai
- **Password validation error**: New password không đạt yêu cầu độ mạnh

---

## JWT TOKEN DETAILS (RS256)

- **Algorithm**: RS256 (RSA with SHA-256)
- **Key Size**: 2048 bits
- **Token Expiration**: 1 hour
- **Payload**: `{ id: userId }`

Token được ký bởi private key tại `private.key` file và được verify bởi public key tại `public.key` file.

---

## POSTMAN SETUP TIPS

1. **Lưu token vào environment variable:**
   - Sau khi login, click vào response
   - Chọn token text và copy
   - Tạo environment variable mới: `token` = <TOKEN>
   - Trong Authorization header, dùng: `Bearer {{token}}`

2. **Tạo Collection:**
   - Tạo folder "Authentication"
   - Thêm 4 request: Register, Login, Get /me, Change Password
   - Tiết kiệm thời gian cho lần test tiếp theo

3. **Tests Script:**
   - Thêm test script để tự động validate response status code
   - Tự động lưu token từ response login
