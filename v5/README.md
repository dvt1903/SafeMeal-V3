# SafeMeal V5 — Hộ chiếu thực phẩm số, AI kiểm định và QR liên thiết bị

**Đề tài sinh viên cá nhân:** Đoàn Văn Tâm · **GVHD:** TS. Võ Thái Anh  
**Website công khai:** https://dvt1903.github.io/SafeMeal-V3/v5/  
**Hộ chiếu số công khai:** `/v5/passport.html#p=<dữ liệu QR>`  
**Phiên bản V4 cũ được giữ tại `/v4/` để đối chiếu.**

## 1. Cách chạy chỉ bằng một lệnh

Cài Node.js **22.13+** rồi chạy từ thư mục `v5`:

```sh
npm run dev
```

Mở http://127.0.0.1:8000. **Không cần npm install**, không cần API key, không có phí dùng thử. Hoặc mở `SafeMeal_V5_MO_NGAY.html` để trình diễn một tệp duy nhất; bản GitHub Pages sử dụng nguồn file module trong `js/`.

## 2. Cách demo từ đầu tới cuối

1. Vào **Quản lý lô** → **Tạo lô mới**, nhập mã bất kỳ (ví dụ `L987`), sản phẩm, nơi sản xuất và ngưỡng nhiệt. Hệ thống tự chọn lô mới và đưa sang kiểm định bước 1. Hoặc chọn L003/L001 để xem ví dụ.
2. **Bước 1**: vai trò Vùng trồng → ghi phiếu Đạt.
3. **Bước 2**: chuyển sang Xưởng sản xuất → cố tình ghi **Không đạt**, xem hồ sơ bị trả về. Sau đó bấm **Khắc phục và kiểm định lại**; nhập phương án khắc phục, ghi **Đạt**. Lịch sử vẫn lưu cả hai phiếu.
4. **Bước 3**: chuyển vai trò Điểm bán → xác nhận nhận hàng; truy cập **AI Inspection Lab**, chọn dữ liệu bình thường/CSV rồi bấm **Phân tích** → **Lưu báo cáo AI**.
5. Trở về **Kiểm định 3 bước** (nút ngay trong phòng AI), ghi phiếu bước 3 với nhiệt độ đúng ngưỡng và niêm phong nguyên vẹn. Hệ thống cấp duy nhất **một mã SMKD**.
6. Mở **Hộ chiếu & QR**, chọn lô vừa tạo → QR tự sinh. Dùng điện thoại **khác** quét ảnh QR này. Trình duyệt điện thoại sẽ mở `passport.html` và đọc thông tin sản phẩm, xuất xứ, hạn dùng và cả 3 giai đoạn.
7. Mở **Phản ánh & thu hồi**, chọn lô của bạn, nhập một mẻ ăn (tên, số suất, lượng nguyên liệu) để có dữ liệu truy vết; tạo phản ánh rồi chuyển vai trò Ban kiểm định nếu cần tạm giữ.

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

## 7. Tác giả và tính chất nghiên cứu

**Đoàn Văn Tâm — bài làm cá nhân (100%).** Giảng viên hướng dẫn: **TS. Võ Thái Anh**. Đây là **nguyên mẫu nghiên cứu/học tập**, không phải chứng nhận an toàn thực phẩm thực tế. Công cụ AI được dùng để hỗ trợ thiết kế và phát triển phần mềm; mọi phần cần được sinh viên giải thích và kiểm chứng trước khi nộp.

## 8. Quản lý lô không giới hạn ở bốn lô mẫu (nâng cấp V5.1)

- Trang **Quản lý lô** trong menu hiển thị mọi lô đã tạo, kể cả `L987`, `TRAU-2026-01`, v.v.; mỗi lô có các nút **Kiểm định / AI / QR / Phản ánh**.
- Tạo lô ở trang Tổng quan, Quản lý lô hoặc trong Kiểm định. Lô mới tự được chọn và bắt đầu bước 1; kết quả kiểm định, báo cáo AI, QR và sự cố đều gắn theo **mã lô đang chọn**.
- Dữ liệu cảm biến mẫu tự sinh quanh **ngưỡng riêng của lô** thay vì dùng cố định 6°C/8°C. Ảnh mẫu chỉ dùng cho L003/L004; lô khác cần tải ảnh của sản phẩm thật, tránh gán sai loại.
- Có thể gắn mẻ ăn mới với lô vừa tạo bằng tên mẻ, số suất và lượng nguyên liệu sử dụng.
- **Xuất bản sao lưu JSON / Nhập lại bản sao lưu** ở Quản lý lô hỗ trợ chuyển trạng thái đã nhập sang trình duyệt khác. Để máy khác quét QR hộ chiếu đã cấp, chỉ cần dùng URL trong QR (không cần nhập JSON).
- **Không có đồng bộ tự động đa máy:** website hiện chạy trên GitHub Pages tĩnh, dữ liệu nghiệp vụ của lô mới lưu trên máy đã tạo. Nếu cần người dùng trên các máy khác cùng thấy các lô đang xử lý và các thay đổi thu hồi theo thời gian thực, cần triển khai API, DB và quyền truy cập server.
- Chạy `npm test` kiểm tra bộ test tạo lô mới L987 và toàn bộ quy trình từ bước 1 đến QR.

## 9. Bản V5.2 — sửa lỗi lô mới không xuất hiện (26/10/2026)

- Đã đối chiếu bản V5.1 cục bộ với mã nguồn đang phục vụ trên GitHub, tìm thấy file app.mjs của website vẫn thuộc V5 cũ, khiến bảng Quản lý lô mới không được triển khai.
- Trang Quản lý lô hiển thị ngay lô vừa tạo bằng khung xác nhận và hàng đánh dấu màu, có nút Kiểm định và AI. Có thể tạo ở Tổng quan hoặc trang này.
- Chỉ báo lưu thành công nếu đọc lại được hồ sơ trong localStorage; nếu thất bại thì không báo đã lưu.
- Khi tải lại trang, lô được lấy từ bộ nhớ cục bộ; các tab cùng origin đồng bộ khi thay đổi. Không hỗ trợ đồng bộ tự động giữa các thiết bị.
- Có bài kiểm tra tạo lô L987, hoàn thành 3 bước/AI/QR và kiểm tra lại danh sách sau khi tạo.

## V5.4 — AI liên thông điểm bán

- Màn hình bước 3 có nút **Tiếp tục** dẫn đúng theo quy trình: xác nhận nhận hàng (yêu cầu người dùng đồng ý) → tạo báo cáo AI sau bàn giao → Ban kiểm định xem xét nếu cảnh báo cao → mở phiếu kiểm định tại điểm bán.
- Khi lưu báo cáo AI mức thấp, tự trở về Kiểm định và mở phiếu bước 3, không cần chọn thủ công vai trò. Quy trình vẫn bắt buộc nhập nhiệt độ, tình trạng niêm phong và ghi chú thực tế trước khi cấp mã QR.
- Nếu AI đã lưu trước bàn giao thì phải lập báo cáo mới sau bàn giao; không hợp thức hóa báo cáo cũ.
- Vai trò chỉ được đổi tự động trong giao diện mô phỏng của bản GitHub Pages, **không phải phân quyền backend thực**.

## Hồ sơ nộp phiên bản V5.4

- **Link demo:** https://dvt1903.github.io/SafeMeal-V3/v5/
- **Mã nguồn phiên bản cuối:** https://github.com/dvt1903/SafeMeal-V3/tree/final
- **Danh mục tài liệu và điều kiện nộp:** [Hướng dẫn nộp bài](../docs/NOP_BAI_HUONG_DAN.md).
- Giới hạn hệ thống: dữ liệu được lưu theo trình duyệt; mã QR tự mang bản tóm tắt, không đồng bộ trạng thái thu hồi thời gian thực.
