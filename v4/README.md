# SafeMeal V4 — Truy xuất & kiểm định thực phẩm + kết nối ví MetaMask

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
