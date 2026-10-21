# Kịch bản trình diễn SafeMeal AI V4.2 — khoảng 4 phút

**0:00 – 0:45:** Mở `🧠 Phòng lab AI`, chọn lô L003, giới thiệu 4 nhóm công nghệ: nhận dạng ảnh (MobileNet TensorFlow.js), OCR (Tesseract.js), phát hiện bất thường chuỗi nhiệt và phân loại phản ánh (Naive Bayes). Chọn `Dữ liệu bình thường` → `Phân tích`. Chỉ ra biểu đồ và ngưỡng.

**0:45 – 1:20:** Chọn `Có đợt tăng nhiệt` → Phân tích. Giải thích 3 mẫu vượt ngưỡng 8°C, ngưỡng MAD và mức cần xem xét. Lưu hồ sơ AI. Demo một lô đang chờ kiểm định bước 3 sẽ bị chặn nếu hệ thống đang đánh giá rủi ro cao.

**1:20 – 2:10:** Nhập phản ánh “QR không khớp mã lô, nghi hàng giả” → `Phân loại phản ánh`, trình bày mô hình Naive Bayes. Thay bằng “rau bị mốc, có mùi hôi” để so sánh. Điểm mô hình chỉ có ý nghĩa xếp ưu tiên xử lý.

**2:10 – 3:00:** Tải ảnh bao bì đã chuẩn bị, chạy OCR tìm `L003` và ngày trên nhãn. Nếu đã tải model MobileNet từ trước, bấm phân loại ảnh và so sánh với ảnh tham chiếu. Trình bày rằng model ImageNet không thể nhận biết độc tố hay vi khuẩn.

**3:00 – 4:00:** Mở báo cáo tổng hợp, xem lý do rủi ro. Đổi sang Ban kiểm định, ghi kết luận kiểm tra bằng chứng thực tế; trở lại Điểm bán và hoàn thành bước 3. Giải thích vì sao AI chỉ hỗ trợ, con người chịu trách nhiệm cấp một mã SMKD tổng hợp.

## Trả lời khi thầy hỏi

- **Phần nào là AI thực?** MobileNet pretrained, OCR engine nhận dạng chữ, Multinomial Naive Bayes học từ 35 câu tổng hợp; phát hiện bất thường dùng thống kê robust MAD. AI không sinh tự động giấy chứng nhận.
- **Mô hình đã đạt độ chính xác bao nhiêu?** Chưa đánh giá trên bộ dữ liệu thực địa độc lập; không đưa ra tỷ lệ chính xác không có chứng cứ. Các bài Node test hiện kiểm tra hành vi hệ thống, không phải đánh giá độ chính xác mô hình ngoài thực địa.
- **Có upload ảnh lên bên thứ ba?** Ứng dụng không chủ động upload ảnh; browser tải JS/weights/worker từ CDN khi dùng và chạy mô hình cục bộ. Không dùng ảnh nhạy cảm.
- **Nếu khách không có mạng?** Lõi cold-chain/NLP và chức năng demo vẫn hoạt động. Model MobileNet và OCR cần tải trước; lần đầu không có mạng sẽ báo lỗi.
- **Nếu AI nói an toàn nhưng thực tế có vấn đề?** AI không có quyền cấp giấy, người kiểm định chịu trách nhiệm lấy mẫu/đối chiếu, và quy tắc ngưỡng nhiệt độ vẫn được kiểm tra độc lập phía máy chủ.
