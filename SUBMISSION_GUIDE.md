# HƯỚNG DẪN NỘP BÀI - NNPTUDM Buoi6

## ✅ CÔNG VIỆC ĐÃ HOÀN THÀNH

### 1. Chức năng **LOGIN** ✓
- Route: `POST /api/v1/auth/login`
- Yêu cầu: username, password
- Trả về: JWT Token (RS256)
- Xác thực: So sánh password với bcrypt hash

### 2. Chức năng **/ME** ✓
- Route: `GET /api/v1/auth/me`
- Yêu cầu: Authorization header có Bearer token
- Trả về: Thông tin user hiện tại
- Xác thực: Dùng middleware CheckLogin (verify RS256 JWT)

### 3. Chức năng **CHANGE PASSWORD** ✓
- Route: `POST /api/v1/auth/changepassword`
- Yêu cầu: 
  - Authorization header (Bearer token)
  - Body: { oldpassword, newpassword }
- Validate newpassword:
  - Tối thiểu 8 ký tự
  - 1 ký tự in hoa (A-Z)
  - 1 ký tự thường (a-z)
  - 1 ký tự số (0-9)
  - 1 ký tự đặc biệt (!@#$%^&*)
- Response: { message: "Thay đổi mật khẩu thành công" }

### 4. JWT RS256 (2048-bit) ✓
- **Algorithm**: RS256 (RSA + SHA-256)
- **Key Size**: 2048 bits
- **Private Key**: `./private.key` (1704 bytes)
- **Public Key**: `./public.key` (451 bytes)
- **Token Expiration**: 1 hour
- **Files**: 
  - Ký token: `routes/auth.js` (dùng private.key)
  - Verify token: `utils/authHandler.js` (dùng public.key)

---

## 📋 FILES CẦN NỘP

### 1. **Git Repository**
✅ Tất cả code đã push lên: https://github.com/VoThanhHa28/NNPTUDM_Buoi6

### 2. **2 File Mã Hóa RSA**
```
private.key    - Private Key (ký JWT)
public.key     - Public Key (verify JWT)
```
**Kích thước:**
- private.key: 1,704 bytes
- public.key: 451 bytes

### 3. **Hình Ảnh Chức Năng (trên Postman)**
Cần chụp 4 ảnh:

#### Ảnh 1: LOGIN
```
POST http://localhost:3000/api/v1/auth/login

Body:
{
  "username": "testuser1234567890",
  "password": "TestPass@1234"
}

Response (Status 200):
eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...
```

#### Ảnh 2: GET /ME
```
GET http://localhost:3000/api/v1/auth/me

Headers:
Authorization: Bearer eyJhbGciOiJSUzI1NiIs...

Response (Status 200):
{
  "_id": "69ba1bdb0d1ffd2601c7a3e6",
  "username": "testuser1234567890",
  "email": "testuser@example.com",
  ...
}
```

#### Ảnh 3: CHANGE PASSWORD
```
POST http://localhost:3000/api/v1/auth/changepassword

Headers:
Authorization: Bearer eyJhbGciOiJSUzI1NiIs...

Body:
{
  "oldpassword": "TestPass@1234",
  "newpassword": "NewPass@5678"
}

Response (Status 200):
{
  "message": "Thay đổi mật khẩu thành công"
}
```

#### Ảnh 4: LOGIN with NEW PASSWORD (Verify Changes)
```
POST http://localhost:3000/api/v1/auth/login

Body:
{
  "username": "testuser1234567890",
  "password": "NewPass@5678"
}

Response (Status 200):
eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...
(New token with updated user)
```

---

## 🎥 CÁCH CHỤP ẢNH TRÊN POSTMAN

### Bước 1: Chuẩn bị Postman
1. Mở Postman
2. Tạo Collection mới: "NNPTUDM_Buoi6"
3. Tạo 4 requests (Register, Login, /me, Change Password)

### Bước 2: Test Login
1. Click request "Login"
2. Nhập URL: `http://localhost:3000/api/v1/auth/login`
3. Chọn method: **POST**
4. Tab "Body" → Raw → JSON
5. Nhập:
   ```json
   {
     "username": "testuser1234567890",
     "password": "TestPass@1234"
   }
   ```
6. Click "Send"
7. **Chụp ảnh**: Toàn bộ request + response hiển thị
8. **Copy token**: Select token từ response → Ctrl+C

### Bước 3: Test /ME
1. Click request "/me"
2. Nhập URL: `http://localhost:3000/api/v1/auth/me`
3. Chọn method: **GET**
4. Tab "Headers" → Thêm:
   - Key: `Authorization`
   - Value: `Bearer ` + paste token từ bước 2
5. Click "Send"
6. **Chụp ảnh**: Request + Response hiển thị user info

### Bước 4: Test Change Password
1. Click request "Change Password"
2. Nhập URL: `http://localhost:3000/api/v1/auth/changepassword`
3. Chọn method: **POST**
4. Tab "Headers" → Thêm Authorization header (như bước 3)
5. Tab "Body" → Raw → JSON
6. Nhập:
   ```json
   {
     "oldpassword": "TestPass@1234",
     "newpassword": "NewPass@5678"
   }
   ```
7. Click "Send"
8. **Chụp ảnh**: Request + Response (success message)

### Bước 5: Verify Change Password (Login with New Password)
1. Click request "Login"
2. Thay password thành: `NewPass@5678`
3. Click "Send"
4. **Chụp ảnh**: Thể hiện login thành công với mật khẩu mới

### Bước 6: Inspect Token (Optional but Good)
1. Vào https://jwt.io
2. Paste token vào decoder
3. Kiểm tra:
   - Header: `"alg": "RS256"`
   - Payload: `"id": "user_id"`
   - Signature: Signed with RSA 2048-bit
4. **Chụp ảnh**: Token decoded thể hiện RS256

---

## 📁 STRUCTURE NỘP BÀI

```
Submission/
├── NNPTUDM_Buoi6/                  (Toàn bộ project)
│   ├── private.key                 (File mã hóa - Copy từ project)
│   ├── public.key                  (File mã hóa - Copy từ project)
│   ├── package.json
│   ├── app.js
│   ├── routes/
│   │   └── auth.js                 (Có route /changepassword)
│   ├── controllers/
│   │   └── users.js                (Có hàm ChangePassword)
│   ├── utils/
│   │   ├── authHandler.js
│   │   └── validateHandler.js      (Có ChangePasswordValidator)
│   └── ...
│
├── Anh_1_Login.png                 (Chụp login + token)
├── Anh_2_Me.png                    (Chụp /me endpoint)
├── Anh_3_ChangePassword.png        (Chụp change password success)
├── Anh_4_LoginNewPassword.png      (Chụp login với password mới)
├── Anh_5_TokenDecoded.png          (Optional: JWT decoded tại jwt.io)
│
├── private.key                     (2 file mã hóa)
└── public.key
```

---

## 🔍 YÊU CẦU KIỂM TRA TRƯỚC KHI NỘP

- [ ] ✅ Git repository đã push: https://github.com/VoThanhHa28/NNPTUDM_Buoi6
- [ ] ✅ Route `/changepassword` hoạt động
- [ ] ✅ Validate newpassword (ít nhất 8 ký tự, 1 hoa, 1 thường, 1 số, 1 đặc biệt)
- [ ] ✅ Login endpoint hoạt động
- [ ] ✅ GET /me endpoint hoạt động
- [ ] ✅ JWT sử dụng RS256 (2048-bit)
- [ ] ✅ Có 2 file private.key + public.key
- [ ] ✅ Có 4 hình ảnh chụp từ Postman
- [ ] ✅ Có file private.key (1704 bytes)
- [ ] ✅ Có file public.key (451 bytes)

---

## 📖 DOCUMENTATION FILES

Project có 4 file hướng dẫn:

1. **POSTMAN_GUIDE.md** - Hướng dẫn chi tiết test trên Postman
2. **RS256_EXPLANATION.md** - Tìm hiểu RS256 vs HS256
3. **RSA_KEYS_INFO.md** - Thông tin chi tiết RSA keys
4. **README.md** - Project overview

---

## 🚀 CÁCH START SERVER ĐỂ TEST

```bash
# 1. Đảm bảo MongoDB đang chạy
mongod

# 2. Navigate vào project
cd NNPTUDM_Buoi6

# 3. Install dependencies (nếu chưa)
npm install

# 4. Seed database (tạo roles)
node seed.js

# 5. Start server
npm start

# 6. Server chạy ở: http://localhost:3000
```

---

## 📝 API SUMMARY

| Endpoint | Method | Auth | Purpose |
|----------|--------|------|---------|
| `/api/v1/auth/register` | POST | ❌ | Tạo tài khoản |
| `/api/v1/auth/login` | POST | ❌ | Đăng nhập (trả JWT) |
| `/api/v1/auth/me` | GET | ✅ Bearer JWT | Lấy info user |
| `/api/v1/auth/changepassword` | POST | ✅ Bearer JWT | Thay mật khẩu |

---

## 🎯 KẾT QUẢ KIỂM TEST

```javascript
/**
 * ✅ TEST RESULTS
 */

// 1. REGISTER
Status: 200
User tạo thành công

// 2. LOGIN
Status: 200
Token: eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9... (RS256)

// 3. GET /ME
Status: 200
Headers: Authorization: Bearer <TOKEN>
Response: { _id, username, email, ... }

// 4. CHANGE PASSWORD
Status: 200
{ "message": "Thay đổi mật khẩu thành công" }

// 5. LOGIN WITH OLD PASSWORD
Status: 404
{ "message": "thong tin dang nhap sai" }

// 6. LOGIN WITH NEW PASSWORD
Status: 200
New Token: eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9... (RS256)
```

---

## ❓ TROUBLESHOOTING

### Lỗi: "Cannot find module"
```bash
npm install
```

### Lỗi: "MongoDB connection failed"
```bash
# Đảm bảo MongoDB đang chạy
mongod
```

### Lỗi: "thong tin dang nhap sai"
- Kiểm tra username có đúng không
- Kiểm tra password có chính xác không

### Lỗi: "ban chua dang nhap" khi test /me
- Kiểm tra Authorization header có đúng format không
- Format: `Bearer <TOKEN>` (không phải `Bearer<TOKEN>`)

---

**Chúc bạn nộp bài thành công!** 🎉
