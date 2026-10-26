# SafeMeal V5 — Hộ chiếu thực phẩm số, AI kiểm định và QR liên thiết bị

**Đề tài sinh viên cá nhân:** Đoàn Văn Tâm · **GVHD:** TS. Võ Thái Anh  
**Website công khai:** https://dvt1903.github.io/SafeMeal-V3/v5/  
**Hộ chiếu số công khai:** `/v5/passport.html#p=<dữ liệu QR>`  
**Phiên bản V4 cũ được giữ tại `/v4/` để đối chiếu.**

## 1. Cách chạy chỉ bằng một lệnh

Cài Node.js **22.13+** rồi chạy từ thư mục gốc repository hoặc thư mục `v5`:

```sh
npm run dev
```

Mở http://127.0.0.1:8000. **Không cần npm install**, không cần API key, không có phí dùng thử. Hoặc mở `SafeMeal_V5_MO_NGAY.html` để trình diễn một tệp duy nhất; bản GitHub Pages sử dụng nguồn file module trong `js/`.

## 2. Cách demo từ đầu tới cuối

1. Tại **Tổng quan**, bấm **Bắt đầu với L003** (hoặc dùng lô L001 đã có hộ chiếu mẫu).
2. **Bước 1**: vai trò Vùng trồng → ghi phiếu Đạt.
3. **Bước 2**: chuyển sang Xưởng sản xuất → cố tình ghi **Không đạt**, xem hồ sơ bị trả về. Sau đó bấm **Khắc phục và kiểm định lại**; nhập phương án khắc phục, ghi **Đạt**. Lịch sử vẫn lưu cả hai phiếu.
4. **Bước 3**: chuyển vai trò Điểm bán → xác nhận nhận hàng; truy cập **AI Inspection Lab**, chọn dữ liệu bình thường/CSV rồi bấm **Phân tích** → **Lưu báo cáo AI**.
5. Trở về **Kiểm định 3 bước**, ghi phiếu bước 3 với nhiệt độ đúng ngưỡng và niêm phong nguyên vẹn. Hệ thống cấp duy nhất **một mã SMKD**.
6. Mở **Hộ chiếu & QR**, chọn L003 → QR tự sinh. Dùng điện thoại **khác** quét ảnh QR này. Trình duyệt điện thoại sẽ mở `passport.html` và đọc thông tin sản phẩm, xuất xứ, hạn dùng và cả 3 giai đoạn.
7. Mở **Phản ánh & thu hồi**, nhập mô tả, xem liên kết lô–mẻ ăn, rồi chuyển vai trò Ban kiểm định nếu muốn tạm giữ.

**Dữ liệu đi kèm:** `/fixtures` chứa CSV ngưỡng 6°C/8°C; `/assets` chứa ảnh cà rốt, ảnh sữa và ảnh nhãn L003/L004 phục vụ demo thử OCR/MobileNet. Chúng là **dữ liệu minh họa**, không phải mẫu thử phòng thí nghiệm.

## 3. Sửa gốc lỗi QR của V4

- **V4:** Mã QR và dữ liệu lô mới chủ yếu ở `localStorage` → máy khác không có dữ liệu nên tra không thấy.
- **V5:** QR chứa URL `https://dvt1903.github.io/SafeMeal-V3/v5/passport.html#p=...` với **hồ sơ nén gzip và SHA-256**. Trang passport giải nén và hiển thị dữ liệu trực tiếp từ URL, **không cần API, cookie, localStorage hay tài khoản từ thiết bị phát hành**.
- Đã thử tạo mã cho L001/L003 và **giải mã QR bằng OpenCV**; hai đường dẫn có thể giải mã được. Kiểm thử nghiệp vụ và browser được lưu tại `tests/`.

**Giới hạn quan trọng:** SHA-256 trong URL chỉ phát hiện hỏng/sai dữ liệu, **không chứng minh người phát hành**. Bản ghi QR tự chứa là ảnh chụp dữ liệu **tại thời điểm cấp QR**. Khi có thu hồi sau đó, QR cũ trên máy khác **không tự cập nhật trạng thái**. Sản phẩm dùng thật cần backend đồng bộ và chữ ký số của đơn vị chứng nhận được xác minh bởi bên thứ ba. QR và mô hình AI **không được xem là chứng nhận thực phẩm an toàn**.

## 4. AI có gì và giới hạn

- **Cold-chain:** Thu nhận CSV dạng `08:00,4.2`, chuẩn hóa và tính trung vị/MAD, các điểm ngoại lai, số lần vượt ngưỡng và chuỗi liên tục. Điểm rủi ro là công thức sàng lọc có thể kiểm tra lại, **không phải xác suất ML hiệu chuẩn**.
- **NLP:** Multinomial Naive Bayes tự cài trên **25 câu tiếng Việt tổng hợp**, phân loại phản ánh thành năm nhóm. Đây là mô hình học máy nhỏ, chưa có dữ liệu đánh giá ngoài tập huấn luyện.
- **Computer Vision (tùy chọn):** TensorFlow.js + MobileNet v2 pretrained ImageNet để phân loại ảnh tổng quát và cosine similarity để so sánh đặc trưng hai ảnh, tải từ CDN khi chạy. **Không xác định hóa chất, vi khuẩn, nấm mốc bằng ảnh.**
- **OCR (tùy chọn):** Tesseract.js đọc chữ trên nhãn, nhận diện mã `L003` rồi đối chiếu; kết quả cần người kiểm chứng lại bằng mắt. Mô hình được tải từ CDN lần đầu và có thể bị chặn bởi mạng trường.
- **Quy tắc cấp mã:** Sau khi nhận hàng, bước 3 bắt buộc có báo cáo AI. Cảnh báo cao yêu cầu vai trò Ban kiểm định ghi nhận xem xét trước khi bước 3 Đạt. Mọi kiểm định bị đánh dấu Không đạt phải có nội dung khắc phục trước khi kiểm định lại.

## 5. Kiến trúc và tính bảo mật

- `index.html`, `assets/style.css`, `js/app.mjs`: ứng dụng quản lý UI responsive.
- `js/engine.mjs`: nghiệp vụ kiểm định theo trạng thái, audit, mã SMKD, điều kiện cấp mã.
- `js/ai.mjs`: phân tích dữ liệu đầu vào và NLP.
- `js/passport.mjs`, `passport.html`, `js/passport-view.mjs`: QR + hộ chiếu tự chứa.
- `js/qr-lib.js`: thư viện QR nguồn mở MIT (Kazuhiko Arase) đóng gói trong repo.
- `server.mjs`: **máy chủ xem bản tĩnh trên localhost**, KHÔNG phải backend REST/SQL đa người dùng.
- `SafeMeal_V5_MO_NGAY.html`: bản standalone để dự phòng.
- `tests/domain.test.mjs`: kiểm thử tự động Node.

**Trung thực với rubric học phần:** V5 Pages hiện là frontend JavaScript thuần và localStorage, **chưa phải React production / backend Node/Express REST + CSDL triển khai Internet**. Phiên bản V4 có mã Node/SQLite và React/Express tham khảo nhưng không được tự gọi là V5 backend đã đồng bộ. Để triển khai quy trình xác minh thời gian thực với sản phẩm thật, cần backend công khai được vận hành và bảo vệ, chữ ký chống giả, phân quyền server, đồng bộ thiết bị và giám sát nhật ký.

## 6. Kiểm thử

```sh
npm test
```

Các bài test kiểm soát thứ tự bước, phân quyền, khắc phục khi Không đạt, AI làm điều kiện bước 3, chống cấp trùng, QR tự chứa, hết hạn, tạm giữ, NLP, OCR và dữ liệu cảm biến.

## Báo cáo học phần phiên bản V5

- [Báo cáo cuối kỳ V5 — PDF 8 trang](docs/BaoCao_SafeMeal_V5.pdf), cập nhật đúng mã nguồn và các giới hạn kiểm thử.
- Video V4 trước đây **không phải** bản quay liên tục của V5; trước ngày nộp cần quay video 3–5 phút theo [kịch bản bảo vệ](docs/HUONG_DAN_BAO_VE.md).

## 7. Tác giả và tính chất nghiên cứu

**Đoàn Văn Tâm — bài làm cá nhân (100%).** Giảng viên hướng dẫn: **TS. Võ Thái Anh**. Đây là **nguyên mẫu nghiên cứu/học tập**, không phải chứng nhận an toàn thực phẩm thực tế. Công cụ AI được dùng để hỗ trợ thiết kế và phát triển phần mềm; mọi phần cần được sinh viên giải thích và kiểm chứng trước khi nộp.
