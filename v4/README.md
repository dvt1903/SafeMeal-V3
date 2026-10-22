# SafeMeal V4.5 — Truy xuất & kiểm định thực phẩm + kết nối ví MetaMask

**Bài tập sinh viên:** Đoàn Văn Tâm · Nâng cấp từ SafeMeal V3. Ứng dụng gồm **frontend public demo** (chạy trên GitHub Pages), **Node.js REST API + SQLite có đăng nhập thật trong môi trường cục bộ**, **WebCrypto AES-256-GCM**, **EIP-1193 MetaMask** và **hợp đồng Solidity tùy chọn trên Sepolia**.

## Chạy trên Windows, không cần npm install

1. Cài Node.js **22.13 trở lên** tại https://nodejs.org/ nếu máy chưa có.
2. Giải nén ZIP, nhấp đúp **`CHAY_SAFEMEAL_WINDOWS.bat`**. Hoặc mở Terminal trong thư mục gốc và dùng **`npm run dev`** (không phải npm install).
3. Giữ cửa sổ CMD mở và truy cập **http://127.0.0.1:8000**.
4. Dùng các tài khoản **chỉ dành cho máy demo** dưới đây (cùng mật khẩu **`SafeMeal@2026`**):

| Vai trò | Email |
|---|---|
| Vùng trồng | farm@safemeal.demo |
| Chế biến | factory@safemeal.demo |
| Điểm bán | store@safemeal.demo |
| Kiểm định / xử lý phản ánh | inspector@safemeal.demo |

> File `.bat` đặt DEMO_SEED=1, tạo tài khoản và dữ liệu mẫu khi database trống. Mật khẩu demo tuyệt đối không dùng ở production. Đây là server phục vụ dùng cá nhân trên 127.0.0.1, chưa cấu hình reverse proxy HTTPS, chống CSRF/session hardening, audit ký số đa tổ chức hoặc migrations production.

## Bản mở ngay (không cài đặt)

Mở `MO_NGAY_V4.html` bằng Chrome/Edge hoặc URL V4 trên GitHub Pages. Trang này chạy với dữ liệu mẫu **riêng trên từng trình duyệt**, hoàn toàn độc lập với server; kiểm định demo, phản ánh demo, AES WebCrypto và kết nối MetaMask (nếu cài). **Không thể dùng QR tự tạo ở máy A để tra dữ liệu mới ở máy B** cho đến khi triển khai server/API dùng chung qua HTTPS.

## Ứng dụng chủ đạo

1. Nhà sản xuất ghi kiểm định vùng trồng.
2. Xưởng ghi kiểm định chế biến/đóng gói, kèm hạn sử dụng.
3. Điểm bán xác nhận nhận hàng, kiểm niêm phong và nhiệt độ.
4. Server tự cấp **duy nhất một mã SMKD** tổng hợp 3 dấu SHA-256 và bàn giao.
5. Khách tra mã (QR dẫn đến `?verify=SMKD-...`), xem lịch sử ba nơi, tình trạng hết hạn/tạm giữ.
6. Khi có phản ánh, tra mã → đối chiếu bao bì/niêm phong → truy các mẻ ăn → kiểm định viên tạm giữ.

Cần phân biệt: `SHA-256` kiểm tra toàn vẹn; `AES-256-GCM` mã hóa chứng từ; **MetaMask connect** là cấp quyền truy cập địa chỉ, **personal_sign** là chữ ký ví, và **on-chain** chỉ xảy ra nếu deploy hợp đồng, kết nối đúng Sepolia và chủ ví xác nhận giao dịch. QR và mã SMKD **không phải giấy chứng nhận an toàn thực phẩm**.

## API và cơ sở dữ liệu (backend Node 22, không phụ thuộc thư viện ngoài)

- `POST /api/auth/login`, `GET /api/me`
- `GET /api/lots`, `POST /api/lots` (nhà sản xuất)
- `POST /api/lots/:id/inspect/:step` (đúng role và đúng thứ tự)
- `POST /api/lots/:id/handoff` (điểm bán)
- `GET /api/verify/:code` (công khai; kiểm tra hết hạn và tạm giữ)
- `POST /api/complaints` (công khai; kiểm tra dữ liệu)
- `POST /api/lots/:id/hold` (kiểm định viên)
- `GET /api/audit` (kiểm định viên)

Backend sử dụng `node:sqlite` và mật khẩu `scrypt` + salt ngẫu nhiên. Các endpoint ghi có kiểm tra quyền máy chủ. Token ngẫu nhiên 256-bit hết hạn sau 8 giờ được lưu hash trong SQLite; token khách demo ở sessionStorage. Đưa lên Internet cần TLS, giới hạn tốc độ toàn diện, cơ chế thu hồi token và bảo mật bổ sung.

## Chạy test

```bash
npm test  # tương đương node --test tests/*.test.mjs
```

Kiểm thử gồm: mật khẩu, role, thứ tự bước, bàn giao, niêm phong, cấp mã, sửa chứng từ, hạn sử dụng, tìm mẻ, mã không đăng ký, tạm giữ, nhật ký hash. Không nhầm kiểm thử này với test blockchain hoặc kiểm thử tải/CI nếu chưa kích hoạt GitHub Actions.

## Kết nối ví / hợp đồng Sepolia

Xem `contracts/README.md`. **Không gửi seed phrase/khóa riêng vào website.** `personal_sign` hiện được minh họa trên client, **chưa là đăng nhập bằng ví có xác minh chữ ký trên backend**. Nếu muốn dùng ví làm định danh khi kiểm định, cần nonce đăng nhập riêng, xác minh EIP-191/EIP-4361 ở server, chống replay và ràng buộc với tổ chức.

## Những điểm chưa đáp ứng hoàn toàn yêu cầu môn Lập trình Web nâng cao

- Trang web công khai này là JavaScript thuần **chưa phải frontend React**. Thư mục `react-client/` cung cấp nguồn React để chạy khi cài npm; trước khi báo cáo cần build/chạy/test React trên máy nhóm.
- Backend đang chạy Node core HTTP. Thư mục `express-server/` có adapter Express (cần npm install) cho bài môn học. Các kiểm thử đã chạy trong môi trường làm bài là cho Node core và quy tắc nghiệp vụ, **chưa kiểm chứng Express/React build**.
- GitHub Pages chỉ phục vụ tệp tĩnh, **không vận hành SQLite và REST API**. Để cả lớp thao tác chung qua Internet phải triển khai API lên hosting Node có HTTPS và database có lưu trữ bền vững.
- Chưa có mạng nhiều tổ chức, chữ ký cơ quan kiểm định, IPFS thực hoặc kiểm định thực địa. Hợp đồng tùy chọn hiện chỉ cho người deploy neo root hash.

## Repo và phiên bản
Giữ nguyên `index.html` V3 của repository; V4 triển khai tại `/v4/` để không làm gián đoạn đường link đã nộp.


## V4.5 — Chế độ demo dễ thao tác cho giảng viên (22/10/2026)

- Nhấn **Bắt đầu demo 4 bước** ở trang Tổng quan; ứng dụng chọn lô L004 chưa kiểm định, tự đưa về vai trò vùng trồng trên bản mô phỏng.
- Hoàn thành kiểm định vùng trồng → xưởng chế biến → điểm bán xác nhận nhận hàng.
- Bản V4.5 nhắc rõ báo cáo AI tại bước 3. Chọn **Mở phòng lab AI** → **Chạy demo AI nhanh** → **Lưu hồ sơ AI + SHA-256**, sau đó quay về phiếu bước 3 và ghi kết quả thực tế.
- Tải CSV cảm biến (`time,temp`) trực tiếp từ máy; thay đổi nguồn CSV hoặc văn bản sẽ tự xóa kết quả cũ để tránh nhầm dữ liệu. Có thể **Tải hồ sơ JSON** đã phân tích.
- Xem **Hộ chiếu & QR**, thử nhập mã, sau đó thực hiện phản ánh mẫu. Mã QR trên bản GitHub Pages chỉ tra được dữ liệu đã có trong chính trình duyệt (dữ liệu mới không tự đồng bộ).
- Backend cũng từ chối bước 3 Đạt nếu sản phẩm đã hết hạn sử dụng, không chỉ dựa vào hash/AI. Lỗi nhập dữ liệu và tải model có thông báo riêng; nút AI lâu tạm khóa để tránh bấm trùng.
- **Đã chạy kiểm thử `node --test tests/*.test.mjs`**; trình duyệt tự động trong môi trường tạo mã bị hạn chế khi mở URL localhost/file nên chưa thể xác minh bằng Playwright toàn bộ tương tác trên trình duyệt thực. Bạn nên kiểm thử trên Chrome/Edge trước buổi nộp.

Bản web công khai chỉ là **demo hỗ trợ quyết định với dữ liệu tự khai hoặc giả lập**, chưa xác minh ảnh gốc qua backend và không được dùng làm hệ thống kiểm định pháp lý, chứng nhận an toàn thực phẩm, hay hệ thống nhiều tổ chức vận hành thật. Chức năng MobileNet / Tesseract yêu cầu Internet và tải thư viện bên ngoài khi được kích hoạt.

## SafeMeal V4.6 — ổn định luồng dữ liệu và kiểm thử tích hợp (22/10/2026)

- **34 bài test** (`npm test`) kiểm tra cả HTTP API thật (4 vai trò → lưu AI → cấp mã → phản ánh → tạm giữ) và quy tắc bảo vệ nghiệp vụ.
- Đã sửa Express adapter thiếu API báo cáo AI và loại bỏ tuyến AI bị khai báo trùng trong Node HTTP server.
- Báo cáo AI mới ghi loại nguồn `demo` / `csv` / `manual`, mô tả nguồn, SHA-256 của chuỗi nhiệt độ. Không tự nhận dữ liệu đầu vào đã có chữ ký cảm biến độc lập.
- Backend không cho lập báo cáo bước 3 trước khi xác nhận nhận hàng; không cho đăng ký báo cáo hồi tố vào một bước đã hoàn thành. Bước 3 dùng báo cáo lập sau bàn giao.
- Trang AI nhắc rõ nguồn mẫu/CSV/nhập tay và nhắc kiểm tra lại khi sửa dữ liệu đầu vào.
- Các hướng dẫn: `docs/NGUON_DU_LIEU_V46.md`, `docs/HUONG_DAN_DEMO_V46.md`, `docs/TRANG_THAI_NOP_BAI_V46.md`.
- **Giới hạn còn lại:** bản React/Express chưa build kiểm chứng do npm registry không truy cập được trong môi trường tạo; bản public vẫn chạy tĩnh, không có backend Internet dùng chung. Xem bảng kiểm trước khi nộp.
