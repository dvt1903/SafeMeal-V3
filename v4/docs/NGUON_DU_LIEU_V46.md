# SafeMeal V4.6 — dữ liệu vào từ đâu và xử lý ra sao?

**Dùng khi giảng viên hỏi nguồn dữ liệu và kiểm định AI.**

| Đầu vào | Nguồn thực tế phiên bản này | Phương pháp | Giới hạn |
|---|---|---|---|
| Chuỗi nhiệt độ | CSV tải từ máy, nhập tay hoặc ba bộ dữ liệu mẫu có sẵn | Trung vị, MAD, số mốc vượt ngưỡng liên tiếp; điểm rủi ro theo quy tắc | Chưa nối MQTT/IoT thật; CSV người dùng tải lên chưa có chữ ký thiết bị |
| Nội dung phản ánh | Người dùng nhập bằng tiếng Việt | Naive Bayes học từ 35 câu mẫu tự biên soạn | Chưa có tập kiểm tra độc lập, không dùng điểm như xác suất thực phẩm hỏng |
| Ảnh sản phẩm | Người dùng chọn JPG/PNG/WebP trên thiết bị | MobileNet (ImageNet), cosine similarity của vector ảnh | Không xác định được độc tố, vi khuẩn, nấm mốc chuyên ngành; cần Internet tải mô hình |
| Ảnh nhãn hàng | Người dùng tải ảnh bao bì | Tesseract OCR đọc mã lô/ngày; kiểm tra trùng khớp | Có thể đọc sai chữ/ảnh mờ; kết quả là chứng cứ cần xem xét |
| Chứng từ ba bước | Do vai trò tương ứng khai báo trong hệ thống | SHA-256 gắn hồ sơ + một root hash SMKD | Hash chỉ chứng minh cùng nội dung, không chứng minh người khai báo nói thật |

## Chuỗi xử lý có thể demo

1. Chọn lô L004 → lần lượt vùng trồng (vai trò nhà sản xuất) và cơ sở chế biến (ghi hạn dùng).
2. Điểm bán nhận hàng → mở AI Studio, tải file `fixtures/L003_nhiet_do_binh_thuong.csv` (đây là dữ liệu minh họa và dùng thử với lô L004 được) hoặc chọn mẫu bình thường.
3. Ứng dụng kiểm tra định dạng `time,temp`, đối chiếu ngưỡng của lô, tính số điểm bất thường. Nhãn nguồn phân biệt `demo` (mẫu), `csv` (tệp tải lên), `manual` (nhập tay).
4. Khi lưu, bản có API tính lại chỉ số phía backend, ghi dấu SHA-256 của chuỗi nhập cùng người thao tác, mã lô, bước, thời gian. **Trường `verifiedByIndependentSensor=false`** thể hiện chưa có xác thực thiết bị.
5. Nếu kết quả có rủi ro cao, bắt buộc Ban kiểm định ghi nhận xem xét trước khi có thể cân nhắc bước 3; hệ thống vẫn kiểm tra tem, nhiệt độ đo trực tiếp và hạn sử dụng.
6. Chỉ khi đủ ba phiếu đạt và bàn giao, hệ thống cấp mã SMKD, rồi cho phép khách tra trạng thái (còn lưu hành / hết hạn / tạm giữ).

**Nghiêm cấm kết luận:** “AI chứng nhận thực phẩm an toàn”, “ảnh chứng minh không có vi khuẩn”, “QR chống hàng giả tuyệt đối”, “có Blockchain đã ghi giao dịch” khi chưa thực hiện giao dịch thật.

## Cần làm để triển khai sản xuất

Cảm biến vật lý hoặc gateway MQTT/HTTPS có mã thiết bị, chữ ký và đồng bộ thời gian; ảnh và hồ sơ có nguồn gốc, kiểm tra độc lập; bộ dữ liệu chuyên ngành được cấp nhãn bởi chuyên gia và chia tập train/validation/test; báo cáo độ chính xác Precision/Recall/F1; lưu trữ máy chủ được phân quyền, backup, monitor và HTTPS; ký xác nhận giữa các tổ chức. Những mục này **chưa hoàn tất trong V4.6**.
