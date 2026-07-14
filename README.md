# Stradivarius Pastoral - AI Violin Separation Studio

[English](#english) | [Tiếng Việt](#tiếng-việt)

---

## English

**Stradivarius Pastoral** (also known as **Violin Spliter**) is a premium, web-based Single Page Application (SPA) designed for classical string musicians, virtuosos, and curators. It blends the heritage aesthetics of 18th-century classical music journals with modern WebGL shaders and AI-powered audio source separation.

### 🎻 Key Features

*   **The Separation Studio (AI Audio Splitter):** Upload any classical performance (WAV, FLAC, MP3) to isolate the lead violin track from the orchestral background using the state-of-the-art **Demucs (HTDemucs)** model.
*   **Tactile Audio Engine:** If the backend is offline, the app dynamically falls back to a browser-side simulation using Web Audio API filters (`BiquadFilterNode`), allowing you to manually adjust high-frequency violin bow-textures and low-frequency orchestral accompaniment.
*   **Manuscript Library:** Browse, search, and manage a collection of classical folios (Bach, Vivaldi, Paganini) with inline music previews.
*   **Grand Fullscreen Player:** Experience an editorial-grade player displaying a synchronized scroll of the manuscript's score matching the current track progress, along with inspirational musical quotes.
*   **Vellum Tonal Layering Theme:** Curated emerald-green (#062c21) and antique-gold (#d4b038) color palettes on soft cream paper textures with smooth Light & Dark mode transitions.
*   **Zero-Config Deployments:** Pre-configured for GitHub Actions to build and deploy to GitHub Pages automatically on push.

### 🛠️ Tech Stack

*   **Frontend:** Vite, Vanilla JavaScript, Tailwind CSS, Web Audio API, WebGL (GLSL Shaders).
*   **Backend:** Python, Gradio, Demucs (HTDemucs) hosted for free on Hugging Face Spaces.

### 🚀 Local Development

1.  Clone the repository and install dependencies:
    ```bash
    npm install
    ```
2.  Start the local development server:
    ```bash
    npm run dev
    ```
3.  Build the optimized production package:
    ```bash
    npm run build
    ```

---

## Tiếng Việt

**Stradivarius Pastoral** là ứng dụng web Single Page Application (SPA) cao cấp dành cho các nghệ sĩ vĩ cầm và nhà nghiên cứu âm nhạc cổ điển. Ứng dụng kết hợp hài hòa giữa phong cách thiết kế tạp chí cổ điển thế kỷ 18 với các công nghệ WebGL động và trí tuệ nhân tạo (AI) tách nhạc tiên tiến.

### 🎻 Các Tính Năng Chính

*   **Phòng Tách Tiếng Chuyên Sâu (Separation Studio):** Tải lên các tác phẩm cổ điển để tách riêng biệt tiếng đàn vĩ cầm chính (Violin Lead) khỏi âm nền dàn nhạc sử dụng mô hình AI **Demucs (HTDemucs)**.
*   **Bộ Lọc Âm Thanh Web Audio API:** Hỗ trợ chế độ chạy thử nghiệm giả lập ngay trên trình duyệt bằng cách cắt lọc tần số âm thanh, cho phép điều chỉnh độc lập tiếng vĩ cầm và nhạc nền mà không cần máy chủ AI.
*   **Thư Viện Bản Thảo (Manuscript Library):** Tìm kiếm và lưu trữ các bản thảo kinh điển (Bach, Vivaldi, Paganini) kèm theo dữ liệu thống kê trực quan.
*   **Trình Phát Nhạc Cổ Điển Phóng To (Grand Player):** Giao diện phát nhạc sang trọng hiển thị trang nhạc phổ trượt đồng bộ theo thời gian thực của tác phẩm.
*   **Giao Diện Sáng/Tối Học Thuật:** Sử dụng kết cấu giấy giả cổ và bảng màu xanh lục bảo - vàng hoàng gia vô cùng sang trọng và dịu mắt.

### 🌐 Hướng Dẫn Triển Khai AI Backend (Hugging Face)
Xem hướng dẫn từng bước để tự tạo máy chủ tách nhạc miễn phí của bạn trong thư mục [huggingface_space/](huggingface_space/README.md).
