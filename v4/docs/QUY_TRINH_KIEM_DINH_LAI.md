# Quy trình xử lý kiểm định không đạt – SafeMeal V4.7

Ví dụ L003, bước 2 tại xưởng: chọn Không đạt, ghi rõ nguyên nhân (ví dụ bao bì rách) và lưu. Trang kiểm định sẽ hiển thị **HỒ SƠ KHÔNG ĐẠT — TRẢ VỀ ĐƠN VỊ PHỤ TRÁCH**, không được chuyển sang bước 3.

Chọn vai trò Xưởng chế biến (bản demo công khai) hoặc đăng nhập đúng tài khoản (bản có API), nhấn **Khắc phục và kiểm định lại bước 2**, ghi biện pháp đã thực hiện (tối thiểu 8 ký tự), bổ sung chứng từ và kết quả.

Mỗi lần gửi tạo hash SHA-256 riêng. Bản demo lưu trong inspectionHistory của localStorage; backend lưu các lần vào bảng SQLite inspection_attempts, ghi sự kiện REINSPECTION trong nhật ký audit; bảng inspections chứa trạng thái mới nhất từng bước. Phiếu Đạt không được sửa; không có mã SMKD khi thiếu ba bước Đạt và bàn giao.

Đây là mô phỏng quy trình kiểm định trong bài học, không phải chứng nhận chất lượng thực phẩm thực tế.
