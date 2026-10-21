# Hợp đồng SafeMealAnchor.sol — Ethereum Sepolia

## Cách thử với ví MetaMask (KHÔNG tốn ETH thật)
1. Vào https://remix.ethereum.org (trang chính thức). Tạo file `SafeMealAnchor.sol`, dán mã nguồn và Compile với compiler tương thích 0.8.24 trở lên.
2. Trong mục Deploy & Run, chọn **Injected Provider - MetaMask** (hoặc **Browser Extension** tùy giao diện) và kiểm tra MetaMask đang ở **Sepolia Test Network**, KHÔNG PHẢI Ethereum Mainnet.
3. Chọn `SafeMealAnchor`, bấm Deploy. Xem kỹ transaction, phí gas test ETH và xác nhận trong MetaMask. Lưu địa chỉ `contract address` từ Remix. Chỉ deploy bằng ví bạn định dùng để gọi `anchor`, vì hợp đồng hiện chỉ cho `owner` ghi.
4. Mở SafeMeal V4 → **Ví Web3 & Blockchain**, kết nối MetaMask, chuyển Sepolia. Nhập `contract address` vừa triển khai và chọn một lô đã có mã SMKD.
5. Nhấn **Gửi giao dịch thật lên Sepolia**. Chỉ khi bạn bấm đồng ý trong MetaMask mới có giao dịch. Ứng dụng hiện hash và link Etherscan. Kiểm tra giao dịch có `Success` và event `InspectionAnchored` trên block explorer.

**Lưu ý kỹ thuật:** Dấu gửi vào Solidity là `keccak256(UTF8(lotId))` (bytes32) cùng `0x` + SHA-256 digest tổng hợp. Smart contract chỉ neo hash, không kiểm định thức ăn, không xác nhận 3 bên ký, không quản lý quyền truy cập hồ sơ riêng. Sau khi neo một lô, không thể neo lần hai với cùng lotHash. MetaMask không có trong môi trường của người xem web vẫn có thể xem demo ngoại tuyến.

## Kiểm thử ABI
Trong thư mục `web/keccak.js` có `abiBytes32Anchor` để tạo calldata cho `anchor(bytes32,bytes32)`; Keccak-256 đã kiểm tra theo vector trống `c5d246…a470`, `abc` `4e0365…6c45` và selector ERC20 `transfer(address,uint256)` là `a9059cbb`.
