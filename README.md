# Hán Ngữ — Học mỗi ngày

Web học tiếng Trung bằng tiếng Việt, bố cục tự điều chỉnh cho điện thoại và máy tính. Mở `dist/index.html` hoặc phục vụ thư mục `dist` bằng một máy chủ web tĩnh. Không cần cài thư viện hay bước biên dịch.

## Nội dung bản đầu

- 22 thẻ từ vựng, tìm kiếm, đánh dấu đã nhớ và ôn flashcard.
- Hai điểm ngữ pháp, hai hội thoại có pinyin và nghĩa tiếng Việt.
- Sáu câu ôn tập tự biên soạn kèm giải thích; không phải bản chép toàn bộ bài tập sách.
- Bốn bản ghi người dùng cung cấp, chọn tốc độ và ghi chú.
- Bảng tự luyện viết bằng chuột hoặc cảm ứng, chưa chấm nét.
- Tiến độ và ghi chú lưu bằng localStorage trên từng trình duyệt, chưa đồng bộ tài khoản.

Các file nghe chưa được đối chiếu với mã nghe trong sách. PDF đáp án, từ mới nâng cao và vở viết chưa được trích xuất hay tích hợp. Bản đầu chỉ có Bài 1 quyển 2; không tuyên bố đã có toàn bộ HSK 2–4.

## GitHub Pages

Workflow `.github/workflows/pages.yml` kiểm tra bản web khi có thay đổi trên `main`. Khi tài khoản và kho đủ điều kiện dùng Pages, mở Settings → Pages → Source → GitHub Actions; sau đó vào Actions → Publish learning website → Run workflow để xuất bản thư mục `dist`. Không dùng `.openai` để xuất bản trên GitHub.

Tại thời điểm thiết lập, GitHub hiển thị yêu cầu nâng cấp hoặc chuyển kho sang công khai để bật Pages. Kho được giữ riêng tư; chưa có website trực tuyến. Việc chuyển công khai cần người dùng quyết định vì mã nguồn và âm thanh trong kho sẽ có thể được xem hoặc tải về.

Trước khi bật website công khai, bảo đảm quyền sử dụng nội dung và âm thanh. Website tĩnh không có cơ chế bảo vệ các file nghe bằng đăng nhập. Không đưa PDF nguyên bản vào bản công khai nếu chưa có quyền phân phối.


Advanced vocabulary HSK1–HSK6

The read-only source snapshot is advanced-source-full.json (tabs 1–6 in the user's spreadsheet). Practice/check columns are excluded. The tab assignment is preserved, including 41 procurement entries in tab 1. advanced-example-fixes.json records corrected or supplemented examples; advanced-procurement-dialogues.json contains six original workplace dialogues. Source examples for other new levels are grouped by topic into short question-and-answer practice lessons with authored connecting turns. These are topical exchanges rather than newly authored continuous narratives. HSK2 retains the original 12 connected dialogues and their progress IDs. Textbook vocabulary remains separate.

Build with node build-advanced-library.cjs, then node verify.cjs. dist/advanced-coverage.json lists per-level source row coverage, sections, lessons and sentences. All 5,043 source entries must have a tagged occurrence in practice; display annotations and alternate spellings are normalized only when checking literal occurrence.
