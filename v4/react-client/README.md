# SafeMeal React frontend (nâng cấp cho môn học)

Cần Node.js 22 trở lên và kết nối Internet lần đầu để cài `react`, `react-dom`, `vite`.

1. Terminal 1: `cd ../express-server && npm install && DEMO_SEED=1 npm start` (Windows cmd: `set DEMO_SEED=1 && npm start`).
2. Terminal 2: `cd react-client && npm install && npm run dev`.
3. Mở http://127.0.0.1:5173. Vite proxy `/api` → `http://127.0.0.1:8000`.

Có các React function components/Hooks (`useState`, `useEffect`, `useMemo`, `useCallback`), các trang tổng quan/kiểm định/QR phản ánh/ví và sử dụng REST API của backend thật. Đây là **source React để chạy trên máy có npm**, chưa build hoặc chạy được trong môi trường soạn bài không có kết nối registry npm. Bản website GitHub Pages được xuất bản từ `MO_NGAY_V4.html` dạng JS độc lập, không nên giới thiệu nhầm là build React.
