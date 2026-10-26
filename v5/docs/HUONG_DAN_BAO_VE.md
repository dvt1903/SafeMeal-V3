# Kịch bản bảo vệ SafeMeal V5 (khoảng 4 phút)

**0:00–0:30:** Nêu lỗi thực tế: khi tạo mã QR trên trình duyệt A rồi dùng điện thoại B, V4 không có dữ liệu lô nên không mở được hộ chiếu. Giải pháp V5 dùng URL hộ chiếu tự chứa mã SMKD và toàn bộ ba phiếu tối giản.

**0:30–1:10:** Vào Kiểm định L003, chứng minh chỉ đúng vai trò mới ghi bước; cố tình ghi bước 2 “Không đạt”. Giải thích quy trình trả về xưởng để sửa, kiểm định lại và giữ hai kết quả.

**1:10–2:00:** Xác nhận hàng tại điểm bán. Vào phòng AI, tải `fixtures/L003_binh_thuong.csv`, chạy thống kê MAD và giải thích vì sao điểm AI không phải kết luận chất lượng. Thử `L003_vuot_nguong.csv` để thấy cảnh báo và điều kiện phải kiểm định viên xem xét.

**2:00–2:40:** Ghi bước 3 sau khi có báo cáo AI, nhận một mã SMKD. Mở Hộ chiếu & QR, dùng điện thoại khác quét QR và mở trang đích từ GitHub Pages. Đường dẫn có gzip + SHA-256, không cần localStorage từ máy phát hành.

**2:40–3:20:** Gửi một phản ánh chất lượng, xem truy vết mẻ, chọn vai trò Ban kiểm định và tạm giữ. Mã tự chứa cũ không được cập nhật thu hồi trên máy khác: đây là giới hạn có chủ đích và hướng triển khai backend public.

**3:20–4:00:** Giải thích đối tượng: khách hàng, xưởng, vùng trồng, điểm bán, Ban kiểm định. Phân biệt MobileNet/Tesseract online tùy chọn, Naive Bayes mô hình mini và MAD thống kê. Công bố test đã chạy; không nhận là hệ thống chứng nhận pháp lý.

**Câu hỏi thầy dễ hỏi:**
1. QR mới mở được ở máy khác vì mang ảnh chụp sản phẩm trong URL; hash không ngăn người cố tình sửa rồi tính lại.
2. Khi “Không đạt”, `nextStep()` dựa trên *phiếu cuối của từng bước* chứ không đếm phiếu; kết quả cũ không ghi đè.
3. AI cao vẫn cần quyết định con người và chứng từ thật. `MobileNet ImageNet` không phát hiện thuốc trừ sâu hoặc vi sinh.
4. Khi mở rộng thật, cần API Node/Express, CSDL tập trung, xác thực server, ký số của đơn vị cấp phép, link QR ngắn và kiểm tra trạng thái thu hồi thời gian thực.
