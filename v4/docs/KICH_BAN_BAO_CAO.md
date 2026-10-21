# Kịch bản bảo vệ SafeMeal V4 — 10 phút

- 00:00–01:00: Bài toán khi sản phẩm bị phản ánh: làm sao biết có phải lô của hệ thống và đã dùng ở mẻ ăn nào.
- 01:00–03:00: Sơ đồ web public → Node REST API → SQLite → chứng từ hash + ký ví testnet tùy chọn.
- 03:00–05:00: Demo bước 1 (vùng trồng) → bước 2 (xưởng) → bàn giao → bước 3 (điểm bán). Chỉ khi đủ điều kiện hệ thống cấp một mã SMKD.
- 05:00–06:00: Dùng QR đọc hồ sơ, chứng minh còn đúng hash nhưng HẾT HẠN vẫn bị cảnh báo (L002).
- 06:00–07:00: Tạo phản ánh lô L001 → truy ra M01, M02 → chuyển quyền kiểm định → tạm giữ → xác minh lại trạng thái.
- 07:00–08:00: Kết nối MetaMask thật, ký thông điệp thật (không mất gas). Với hợp đồng trên Sepolia có thể gửi giao dịch ghi hash và xem Etherscan.
- 08:00–09:00: Mở code core.mjs: inspect(), issueCertificate(), verify() và tests.
- 09:00–10:00: Hạn chế: chưa có thực địa, QR sao chép được, Web3 đa bên cần ký/triển khai thật; GitHub Pages chỉ là bản public tĩnh.

**Khi thầy hỏi React/Express:** Không được khẳng định đã deploy React/Express nếu chưa chạy thử. Nói rõ phần demo thực tế hiện là Node core / JavaScript và đang có mã React/Express để chuẩn hóa môn học; ưu tiên chạy kiểm chứng trước buổi bảo vệ.
