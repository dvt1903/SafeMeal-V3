# Bảng kiểm theo hướng dẫn cuối kỳ — Lập trình Web nâng cao

**Đã có mã và đã tự kiểm thử:** chức năng cốt lõi kiểm định 3 bước, vai trò phía API, SQLite, phát mã SMKD, QR tham chiếu, phản ánh, tạm giữ, AI hỗ trợ quyết định, MetaMask EIP-1193, hợp đồng Solidity tùy chọn. `npm test` chạy 34 test gồm tích hợp HTTP thực qua SQLite tạm.

**Đã có mã nguồn nhưng chưa kiểm chứng build trong môi trường này:** React + Vite, Express adapter. Môi trường không truy cập được `registry.npmjs.org`; cần chạy `npm install && npm run build` với React và khởi chạy Express/React trên máy có Internet trước khi nộp. Express adapter đã được bổ sung các endpoint `/api/ai-reports`.

**Chưa có:** backend Internet dùng chung nhiều người; database production có backup/HTTPS; AI thực phẩm chuyên ngành được đánh giá trên dữ liệu thực; triển khai smart contract và giao dịch Sepolia có TXID; video demo dự phòng do người dùng quay; chứng thực nguồn dữ liệu từ thiết bị IoT; xác nhận bảng phân công từ toàn nhóm; git commit từ tài khoản riêng của mỗi thành viên; tag `final` sau khi nhóm đồng ý chốt.

**Không thể khẳng định trước khi làm:** toàn bộ các phần trên đã sẵn sàng nộp bài ở mức tối đa. Khung chấm điểm của thầy yêu cầu những phần còn thiếu này.

### Việc cần làm trên máy nhóm

1. Tải ZIP mới, `npm test` và chạy file `.bat`; kiểm tra mọi bước trên Chrome/Edge.
2. Nếu chọn trình bày React+Express, cài dependencies và chạy thử cả frontend React lẫn Express bằng mã nguồn nằm trong ZIP.
3. Nếu thầy yêu cầu link full-stack, cần thuê/kết nối hosting có Node HTTPS và SQLite/Postgres lưu bền vững; GitHub Pages không thể lưu database cho nhiều người.
4. Quay video demo dự phòng 3–5 phút. Không quay tên đăng nhập/mật khẩu thật hoặc seed phrase.
5. Kiểm tra thông tin lớp, danh sách thành viên và tỷ lệ đóng góp trước khi cập nhật báo cáo PDF 5–8 trang.
