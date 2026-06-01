# Fullstack Task Manager (React + Node.js + Express + MongoDB + TypeScript)

Một ứng dụng quản lý công việc cá nhân (Personal Task Manager) hoàn chỉnh, được xây dựng với kiến trúc hiện đại, giao diện trực quan và cơ chế bảo mật tối ưu.

## 🚀 Tính năng nổi bật
* **Xác thực người dùng bảo mật (JWT Authentication)**: Đăng ký tài khoản (mã hóa mật khẩu bằng `bcryptjs`), Đăng nhập nhận JWT Token, bảo vệ route bằng Middleware.
* **Quản lý Task CRUD toàn diện**: Thêm công việc, xem danh sách công việc, sửa tiêu đề (inline double-click), bật/tắt trạng thái hoàn thành và xóa công việc.
* **Owner-isolated Data**: Mỗi người dùng chỉ có quyền xem và chỉnh sửa dữ liệu công việc của chính mình.
* **Bộ lọc & Tìm kiếm thời gian thực (Live Search)**: Lọc tìm kiếm công việc ngay lập tức bằng tiếng Việt (không phân biệt chữ hoa/thường).
* **Kiểm tra dữ liệu đầu vào (Zod Schema Validation)**: Đảm bảo dữ liệu từ client gửi lên đúng định dạng (username tối thiểu 3 ký tự, password tối thiểu 6 ký tự) thông qua Middleware tập trung.
* **Giao diện Cao cấp (Dark Glassmorphism UI)**: Giao diện tối mượt mà, sử dụng các thẻ kính mờ (glassmorphism), các vòng sáng chuyển động nền và hiệu ứng micro-animations.

---

## 🛠️ Công nghệ sử dụng
### Backend
* Node.js & Express
* TypeScript
* MongoDB & Mongoose (ODM)
* JSON Web Token (JWT) & Bcryptjs
* Zod (Data Validation)
* Dotenv (Cấu hình môi trường)

### Frontend
* React (Vite) & TypeScript
* Axios (HTTP Client gọi API)
* Vanilla CSS (Hệ thống thiết kế Custom Variables)

---

## 📂 Cấu trúc dự án
```text
├── backend/
│   ├── src/
│   │   ├── controllers/      # Bộ điều khiển xử lý logic nghiệp vụ (Auth, Task)
│   │   ├── middlewares/      # Middleware kiểm tra JWT và Schema Zod
│   │   ├── models/           # Mongoose schemas (user.model.ts, Task.ts)
│   │   ├── routes/           # Định tuyến API
│   │   ├── schemas/          # Định nghĩa Schema kiểm chuẩn Zod
│   │   └── index.ts          # Điểm khởi chạy backend & kết nối DB
│   ├── .env.example          # File mẫu cấu hình biến môi trường
│   ├── tsconfig.json         # Cấu hình TypeScript Backend
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/       # Các components giao diện (Auth.tsx, TaskList.tsx)
│   │   ├── App.tsx           # Quản lý phiên đăng nhập và định tuyến giao diện
│   │   ├── index.css         # Hệ thống Style chính (CSS Variables)
│   │   └── main.tsx
│   ├── tsconfig.json         # Cấu hình TypeScript Frontend
│   └── package.json
```

---

## ⚙️ Cài đặt và Khởi chạy

### 1. Khởi chạy Backend
1. Di chuyển vào thư mục backend:
   ```bash
   cd backend
   ```
2. Cài đặt các thư viện cần thiết:
   ```bash
   npm install
   ```
3. Tạo file `.env` từ file mẫu và điền thông tin MongoDB Atlas Connection String cùng mã bí mật JWT:
   ```env
   PORT=5000
   MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.xxxx.mongodb.net/taskmanager
   JWT_SECRET=your_jwt_secret_key_here
   ```
4. Khởi chạy server ở chế độ dev (tự động tải lại khi đổi code):
   ```bash
   npm run dev
   ```

### 2. Khởi chạy Frontend
1. Mở một terminal mới và di chuyển vào thư mục frontend:
   ```bash
   cd frontend
   ```
2. Cài đặt các package phụ thuộc:
   ```bash
   npm install
   ```
3. Khởi chạy ứng dụng client:
   ```bash
   npm run dev
   ```
4. Mở trình duyệt và truy cập: `http://localhost:5173`.

---

## ☁️ Chuẩn bị cho việc Deploy
Phần backend đã được cấu hình sẵn sàng cho các dịch vụ Cloud như Render, Railway hay Heroku:
* Script Build biên dịch từ TypeScript sang JavaScript: `"build": "tsc"`
* Script Start chạy dự án production: `"start": "node dist/index.js"`

---

## 📦 Hướng dẫn đẩy Code lên GitHub cá nhân (`TinhDean`)

Để đẩy toàn bộ mã nguồn lên kho chứa GitHub một cách an toàn mà **không làm lộ mã bảo mật** trong file `.env`, bạn hãy thực hiện theo các bước sau trong terminal ở thư mục gốc (`d:/fullstack-learning`):

1. **Khởi tạo Git repo địa phương** (nếu chưa khởi tạo):
   ```bash
   git init
   ```
2. **Kiểm tra trạng thái file**:
   ```bash
   git status
   ```
   *Đảm bảo các file `.env` và thư mục `node_modules/`, `dist/` nằm trong danh sách bị bỏ qua (không hiện màu xanh/đỏ để add).*
3. **Thêm các file vào hàng chờ commit**:
   ```bash
   git add .
   ```
4. **Tạo Commit đầu tiên**:
   ```bash
   git commit -m "feat: complete fullstack task manager with jwt and zod validation"
   ```
5. **Liên kết với Repository GitHub của bạn**:
   ```bash
   git remote add origin https://github.com/TinhDean/fullstack-learning.git
   ```
   *(Thay đổi URL trên nếu bạn đặt tên Repo khác trên GitHub cá nhân của mình)*
6. **Đổi tên nhánh chính thành main**:
   ```bash
   git branch -M main
   ```
7. **Đẩy mã nguồn lên GitHub**:
   ```bash
   git push -u origin main
   ```

> [!WARNING]
> **Tuyệt đối không bao giờ đẩy file `.env` lên GitHub công khai.** File `.env` chứa thông tin đăng nhập MongoDB Atlas và khóa bí mật JWT. Nó đã được đưa vào `.gitignore` để tự động bỏ qua khi đẩy code.
