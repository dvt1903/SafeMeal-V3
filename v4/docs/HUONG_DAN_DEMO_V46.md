# Hướng dẫn demo SafeMeal V4.6 — 4 phút

**Bắt đầu bằng bản xem công khai** `https://dvt1903.github.io/SafeMeal-V3/v4/` hoặc mở `MO_NGAY_V4.html` (bản offline cần WebCrypto được hỗ trợ). Trên bản công khai, mọi thao tác giữ dữ liệu ở trình duyệt hiện tại.

0:00–0:40 — Vào **Tổng quan**, bấm **Bắt đầu demo 4 bước**. Chọn L004; nhà sản xuất ghi bước 1, chuyển xưởng chế biến ghi bước 2, chọn ngày hết hạn tương lai.

0:40–1:30 — Chọn điểm bán, xác nhận nhận hàng. Bấm **Mở phòng lab AI**. Chọn **Chạy demo AI nhanh** (nguồn mẫu); hoặc nhập CSV `fixtures/L003_nhiet_do_binh_thuong.csv`, chạy phân tích, rồi **Lưu hồ sơ AI**. Cột nguồn cho biết đây là demo / CSV do người dùng tải lên, không giả nhận IoT được xác minh.

1:30–2:15 — Quay lại **Kiểm định 3 bước**, ghi bước 3 (niêm phong còn nguyên, nhiệt độ dưới ngưỡng). Hệ thống tạo **một mã SMKD**. Vào **Hộ chiếu & QR** xem ba phiếu, trạng thái lưu hành và root hash.

2:15–3:15 — Thử **Có đợt tăng nhiệt** để thấy ba mốc vượt ngưỡng; giải thích MAD + quy tắc và cảnh báo cần xem xét. Thử NLP phân loại câu “mã QR không khớp với bao bì”. Không tuyên bố MobileNet phát hiện độc tố.

3:15–4:00 — Đến **Phản ánh chất lượng**, nhập mã đã cấp và mô tả lỗi. Nêu khả năng truy vết các mẻ ăn M01, M02 qua lô L001. Kết luận với phân biệt demo GitHub Pages (dữ liệu riêng trình duyệt) và backend SQLite (dữ liệu trên máy server, có phân quyền).

### Hai tình huống thầy nên thử

- Chưa có báo cáo AI mà bước 3 đã chọn Đạt → bị chặn.
- Kết quả AI có rủi ro cao mà chưa được Ban kiểm định xem xét → bị chặn; mã giả không được kết luận ngay là hàng giả.

### Nếu đường link công khai không mở được

Mở `MO_NGAY_V4.html`; hoặc trên Windows cài Node.js 22.13+, chạy `CHAY_SAFEMEAL_WINDOWS.bat`, rồi vào `http://127.0.0.1:8000`. Hai chế độ khác nhau; không trộn kết quả từ trình duyệt với kết quả SQLite.
