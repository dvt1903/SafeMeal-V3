# SafeMeal V3 — Demo truy xuất và kiểm định nguyên liệu

**Tác giả bài demo:** Đoàn Văn Tâm  
**Công nghệ:** HTML / CSS / JavaScript thuần — chạy trong trình duyệt, không cần máy chủ.

## Chức năng

- **Kiểm định 3 bước:** (1) vùng trồng/sản xuất nguồn, (2) cơ sở chế biến & đóng gói, (3) kiểm định tại **điểm bán** sau khi nhận hàng.
- **Một mã kiểm định tổng hợp SMKD cho mỗi lô:** chỉ cấp khi cả ba bước và điều kiện bàn giao được xác nhận đạt. Mã liên kết ba hồ sơ kiểm định.
- **Truy xuất QR và lô–mẻ ăn:** tra thông tin công bố và truy ngược các mẻ sử dụng lô liên quan.
- **Phản ánh chất lượng:** đối chiếu mã đăng ký, thông tin nhãn/tem, cảnh báo và khoanh vùng hồ sơ có liên quan.
- **Bảo vệ hồ sơ:** SHA-256 giúp phát hiện thay đổi nội dung; AES-256-GCM minh họa mã hóa và giải mã thông tin nội bộ.

## Cách sử dụng

Mở trang đã xuất bản trên GitHub Pages, hoặc tải `index.html` và mở bằng Chrome/Edge. Có dữ liệu mẫu để thử nghiệm chức năng.

## Xuất bản website bằng GitHub Pages

1. Vào [Settings → Pages](https://github.com/dvt1903/SafeMeal-V3/settings/pages).
2. Ở **Build and deployment → Source**, chọn **Deploy from a branch**.
3. Chọn nhánh **main**, thư mục **/(root)** rồi bấm **Save**.
4. Chờ GitHub triển khai; địa chỉ dự kiến: https://dvt1903.github.io/SafeMeal-V3/

## Phạm vi và giới hạn

Đây là **bản demo học tập**. Dữ liệu và vai trò được mô phỏng và lưu trên từng trình duyệt (không có tài khoản tổ chức/SQL chung). Mã SMKD không phải chứng nhận pháp lý; đối chiếu QR không tự chứng minh hàng vật lý thật vì mã có thể bị sao chép. Demo minh họa hàm băm SHA-256 và mã hóa AES, **chưa triển khai smart contract lên Blockchain đa tổ chức** hoặc kiểm định thực địa.

Dữ liệu demo không nên dùng để lưu thông tin cá nhân nhạy cảm hoặc làm căn cứ chứng nhận chất lượng thực phẩm.
