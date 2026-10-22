# SafeMeal V4.5 — Kịch bản demo dễ thao tác

## Mục tiêu
Kiểm chứng được **nguồn dữ liệu → phân tích AI → 3 bước kiểm định → một mã SMKD → QR truy xuất → phản ánh**.

## Quy trình 3 phút
1. Mở website V4.5, chọn **Bắt đầu demo 4 bước**. Lô L004 (sữa thanh trùng) được chọn ở vai trò Nhà sản xuất.
2. Điền phiếu bước 1 (nguồn nguyên liệu) → Đạt. Chuyển **Xưởng chế biến**, điền phiếu bước 2, hạn dùng còn hiệu lực → Đạt.
3. Chuyển **Điểm bán**, xác nhận nhận hàng. Chuyển vào Phòng lab AI.
4. Nhấn **Chạy demo AI nhanh** → xem phân tích nhiệt độ và NLP → **Lưu hồ sơ AI + SHA-256**.
5. Trở lại Kiểm định, nhập nhiệt độ hợp lệ, niêm phong còn nguyên và địa điểm → Đạt. Hệ thống phát một mã SMKD.
6. Vào **Hộ chiếu & QR**, xem 3 dấu SHA-256; tạo phản ánh chất lượng để tra mã và lần theo lô.

## Giải thích dữ liệu
- Chuỗi cảm biến có thể nhập bằng tay hoặc tải CSV `thời gian,nhiệt độ`. Dữ liệu mặc định **là ví dụ giả lập**.
- Naive Bayes được huấn luyện trên 35 câu tiếng Việt mô phỏng; MAD là thuật toán thống kê. Điểm Risk Fusion là **quy tắc xếp ưu tiên**, không phải xác suất thực phẩm hư hỏng.
- MobileNet và Tesseract tải theo yêu cầu và cần Internet; **không thay xét nghiệm hay kiểm định hiện trường**.
- Trong bản web GitHub Pages, kết quả lưu localStorage của từng trình duyệt. Không chia sẻ giữa hai máy. Backend SQLite và API chỉ có khi chạy bản đầy đủ; hiện **chưa triển khai backend dùng chung trên Internet**.
- MetaMask kết nối ví/cho ký ngoài chuỗi. Ghi Sepolia chỉ khi có hợp đồng đã triển khai và giao dịch được xác nhận; không dùng seed phrase ở bất kỳ biểu mẫu nào.

## Những lỗi cần thử trước thầy
- Điểm bán chưa có báo cáo AI → chặn phiếu Đạt.
- Lô hết hạn hoặc nhiệt độ vượt ngưỡng / bao bì rách → chặn cấp mã Đạt.
- Nhập sai vai trò / nhảy bỏ bước → chặn ghi phiếu.
- Mã QR không thuộc hệ thống → thông báo không đăng ký; không tự kết luận hàng giả.
- Sửa CSV sau phân tích → xóa kết quả cũ, phải phân tích lại.

## Kiểm thử
Dùng Node.js >=22.13, từ thư mục dự án chạy `npm test`. GitHub CI kiểm thử nghiệp vụ API và mô phỏng giao diện, **không đo độ chính xác model MobileNet/OCR**. Nên mở Chrome thực tế và chạy lần lượt toàn bộ kịch bản trước khi nộp.
