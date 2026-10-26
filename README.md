# SafeMeal V5 — Digital Food Passport & AI Inspection

**Phiên bản mới:** [MỞ SAFEMEAL V5](https://dvt1903.github.io/SafeMeal-V3/v5/)

**Repo nguồn:** `v5/` · [Hướng dẫn chạy và bảo vệ](v5/README.md) · [Kịch bản demo](v5/docs/HUONG_DAN_BAO_VE.md)

**Bài làm cá nhân:** Đoàn Văn Tâm · **Giảng viên hướng dẫn:** TS. Võ Thái Anh.

## Chạy 1 lệnh
Cài Node.js 22.13 trở lên, tại gốc repository chạy `npm run dev`, rồi mở http://127.0.0.1:8000. Bản công khai sử dụng GitHub Pages (không cần đăng nhập).

**Điểm cải tiến:** mã QR chứa hộ chiếu tối giản đã nén, điện thoại khác mở được tên sản phẩm/xuất xứ/3 phiếu ngay mà không cần dữ liệu trình duyệt ban đầu. Lỗi kiểm định Không đạt có hướng khắc phục/kiểm lại mà vẫn giữ lịch sử. AI hỗ trợ bằng nhiệt độ/MAD, OCR, NLP và MobileNet (tùy chọn mạng).

**Giới hạn:** frontend công khai là ứng dụng tĩnh dùng localStorage; QR tự chứa không phải xác minh độc lập bởi đơn vị kiểm định và không đồng bộ tình trạng thu hồi thời gian thực. Không gọi đây là hệ thống chứng nhận thực phẩm thật. React/Express/SQLite ở phiên bản cũ vẫn có trong `v4/` nhưng **chưa được triển khai làm backend công khai cho V5**.

Bản V4 cũ: https://dvt1903.github.io/SafeMeal-V3/v4/ ; bản V3 trước khi nâng cấp nằm trong lịch sử Git/tag cũ.
