# SafeMeal — Đồ án cuối kỳ Lập trình Web nâng cao

**Sinh viên đã xác định:** Đoàn Văn Tâm · MSSV 20010921  
**Repository:** https://github.com/dvt1903/SafeMeal-V3  
**Website demo công khai:** https://dvt1903.github.io/SafeMeal-V3/v4/  
**Thư mục mã nguồn V4.6:** [`v4/`](v4/)

## 1. Chạy dự án bằng đúng một lệnh

Cài Node.js **22.13 trở lên**, clone repository, mở terminal ở thư mục gốc và chạy:

```bash
npm run dev
```

Truy cập **http://127.0.0.1:8000**. Không cần npm install để chạy bản Node core REST + SQLite. Mặc định lệnh tạo dữ liệu mẫu trong SQLite khi CSDL chưa có; xem `v4/server/.env.example` để cấu hình.

**Lệnh test:** `npm test` — bộ kiểm thử Node 34 trường hợp, gồm một kịch bản HTTP end-to-end.

**Tài khoản demo (CHỈ CHO MÁY CỤC BỘ):** cùng mật khẩu `SafeMeal@2026` (không phải secret production).

| Vai trò | Tài khoản |
|---|---|
| Vùng trồng | `farm@safemeal.demo` |
| Nhà máy | `factory@safemeal.demo` |
| Điểm bán | `store@safemeal.demo` |
| Ban kiểm định | `inspector@safemeal.demo` |

## 2. Chức năng nổi bật

1. Phiếu kiểm định vùng trồng → nhà máy → điểm bán, có kiểm tra quyền ở backend.
2. Bàn giao lô và báo cáo phân tích chuỗi lạnh trước bước ba.
3. Cấp duy nhất một mã **SMKD** gắn 3 hash SHA-256 và biên bản giao nhận.
4. Quét QR/tra mã, kiểm tra hạn dùng, tạm giữ và truy vết mẻ ăn có sử dụng lô.
5. Nhận phản ánh, phân tích NLP, CSV nhiệt độ và các tùy chọn MobileNet/OCR trên trình duyệt.
6. Kết nối ví MetaMask qua chuẩn EIP-1193; hợp đồng Solidity Sepolia chỉ ghi on-chain khi được triển khai và xác nhận giao dịch.

## 3. Bản triển khai công khai và giới hạn

**GitHub Pages là bản thử HTML/JS độc lập, dữ liệu ở localStorage từng thiết bị, không yêu cầu đăng nhập.** Nó không chạy Node REST API hoặc SQLite trên Internet. Hệ thống có API + phân quyền thật nằm trong `v4/server/`, chạy tại localhost. Mã nguồn React/Vite và Express nằm ở `v4/react-client/`, `v4/express-server/`; chưa xác nhận build triển khai công khai. Mô hình AI chỉ hỗ trợ sàng lọc, chưa là kiểm định chất lượng được chứng nhận.

## 4. Bộ 5 sản phẩm nộp

| Hạng mục | Vị trí |
|---|---|
| GitHub | Repository này; nhánh `main`, mã nguồn ở `v4/`. Tag `final` là mốc nộp sau khi kiểm tra |
| Link deploy | https://dvt1903.github.io/SafeMeal-V3/v4/ |
| Báo cáo PDF 5–8 trang | Tệp `Bao_cao_cuoi_ky_SafeMeal_NOP_BAI.pdf` trong gói nộp ngoài repo |
| Bảng phân công 100% có xác nhận | Tệp `Bang_phan_cong_SafeMeal_CAN_XAC_NHAN.pdf` trong gói nộp; cần ký xác nhận thực |
| Video dự phòng 3–5 phút | Tệp `SafeMeal_V46_Video_Demo_Du_Phong_3p40.mp4` trong gói nộp |

**Lưu ý nộp nhóm:** giảng viên yêu cầu mỗi thành viên commit bằng tài khoản GitHub riêng. Chỉ một tên thành viên đã được cung cấp; trước khi nộp phải bổ sung toàn bộ tên, tỷ lệ công việc và xác nhận nếu có thành viên khác.

## 5. Minh chứng kỹ thuật và trung thực AI

`v4/server/core.mjs`: cấp mã, API RBAC và lưu SQLite; `v4/web/ai-engine.js`: MAD, Naive Bayes; `v4/web/app.js`: giao diện, CSV, MobileNet/OCR; `v4/tests/`: test. Có dùng ChatGPT hỗ trợ sinh mẫu mã, tìm lỗi và soạn báo cáo; sinh viên phải đọc hiểu và chịu trách nhiệm về code nộp.