---
title: Stradivarius Pastoral AI
emoji: 🎻
colorFrom: green
colorTo: yellow
sdk: gradio
sdk_version: 4.19.2
app_file: app.py
pinned: false
---

# Stradivarius Pastoral AI - Audio Separation Backend

Đây là mã nguồn backend tách tiếng đàn vĩ cầm (violin) chuyên dụng chạy trên nền tảng **Hugging Face Spaces** hoàn toàn miễn phí.

## Cách Triển Khai Lên Hugging Face Spaces:

1. Đăng nhập hoặc đăng ký tài khoản trên [Hugging Face](https://huggingface.co/).
2. Nhấn vào **New Space** (Tạo Space mới) tại góc trên bên phải màn hình.
3. Cấu hình Space mới:
   - **Space Name:** Điền tên Space của bạn (Ví dụ: `violin-splitter-ai`).
   - **SDK:** Chọn **Gradio**.
   - **Space Hardware:** Chọn **CPU Basic** (Miễn phí 24/7).
   - **Visibility:** Chọn **Public** (Để ứng dụng Web có thể gọi API mà không cần Token).
4. Nhấn **Create Space**.
5. Sau khi Space được tạo, bạn có thể tải 3 tệp tin này lên thư mục gốc của Space:
   - `app.py`
   - `requirements.txt`
   - `README.md`
6. Đợi 2-3 phút để Hugging Face tự động cài đặt môi trường và khởi chạy Space.
7. Khi trạng thái chuyển sang màu xanh lá **Running**, hãy sao chép địa chỉ URL của Space (dạng `tên-tài-khoản-tên-space.hf.space`) và dán vào phần thiết lập API trên Website của bạn!
