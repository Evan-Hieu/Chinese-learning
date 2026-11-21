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


HSK2 Lesson 2

Select Lesson 2 — 你平时几点起床？ under HSK2. lesson2-data.js transcribes the 20 vocabulary entries, two dialogues and reading passage from the supplied pages 15–26. lesson2.js adds the seven learning views and isolates known words, mistakes, exercises, notes and matching scores per textbook lesson. The advanced HSK vocabulary library is unchanged. The twelve original page images are available in collapsible references. Clock practice deliberately uses newly rendered times and is labelled as supplementary practice rather than an asserted reading of the small printed clocks.

The four supplied Q2B2 BTNC MP3 files are playable with speed controls. Their correspondence to printed codes 02-1/02-2/02-3 is unverified; no listening answer keys are inferred from filenames. Device TTS of the two transcribed dialogues is separately labelled; 02-3 questions await a verified recording/transcript.

The supplied answer PDF was subsequently checked visually at PDF page 13. lesson2-btnc.js contains the Nâng cao 1–3 listening transcripts and their original answer-letter sequences. Each audio card also offers five newly authored comprehension questions, graded against their own choices. These new questions are explicitly distinguished from the unavailable original BTNC question sheets. The PDF page is available as a reference image. This does not establish correspondence to the textbook recording codes 02-1/02-2/02-3.

HSK2 Lesson 3

Select Lesson 3 — 可以用一下你的手机吗？. The 21 textbook vocabulary groups (电话 and 号 remain associated subwords), two transcribed dialogues, reading passage, fill-in and reading exercises are in lesson3-data.js. lesson3.js adds the seven learning views, borrowing simulation, fictional telephone-number role-play and independent lesson progress. All eleven original pages 27–37 are accessible in references.

The four supplied Q2B3 files are playable. BTNC NC1–NC3 transcripts and original answer keys were checked against PDF page 14; the page image is included. The 15 automatically graded comprehension questions are newly authored and labelled separately from the absent original BTNC question sheets. Textbook code 03-3 remains ungraded without a verified corresponding recording/transcript. Device speech of the two textbook dialogues is separate from the MP3 recordings.


HSK2 Lesson 4

Lesson 4 — 你想要哪件？ contains the 19 textbook vocabulary groups (色 remains a subword of 颜色), two shopping dialogues, the reading passage, fill-in and reading-comprehension exercises, and a shopping role-play for colours, sizes and bargaining. Progress is isolated across Lessons 1–4. All thirteen supplied image excerpts are preserved, with labels for their overlapping pages 39–50. Four Q2B4 audio files are playable. NC1–NC3 transcripts and original answer-letter sequences were checked visually against PDF page 15. The fifteen graded comprehension questions are newly authored and labelled separately from the original BTNC questions. Textbook 04-3 remains ungraded pending a verified corresponding recording/transcript.


HSK2 Lesson 5

Lesson 5 — 你这个周末什么时候有空儿？ adds twenty vocabulary groups, two transcribed telephone dialogues, 跟/给 and 有点儿/一点儿 grammar, a reading passage, picture activities, practice responses and an appointment role-play. All thirteen supplied pages 51–63 are preserved in references. Progress for vocabulary, exercises and the appointment form is isolated across Lessons 1–5. Four Q2B5 MP3s are playable. NC1–NC3 transcripts and original answer letters were checked against PDF page 16; fifteen newly authored listening-comprehension questions are labelled separately. Textbook recording 05-3 remains ungraded without its verified transcript/recording.


HSK2 Lesson 6

Lesson 6 — 上个周末你做什么了？ contains nineteen vocabulary groups, two transcribed dialogues, completion 了 / negative 没 and subject-predicate-predicate grammar, reading/cloze activities, three past-event question forms and a weekend-report simulation. The twelve source pages 65–76 and four supplied Q2B6 MP3 files are preserved. The first page has a clipboard notification covering some lesson goals; those obscured goals were not reconstructed. NC1–NC3 transcripts and original letter keys were checked visually against PDF page 17; the fifteen graded comprehension questions are independently authored and labelled. Textbook recording 06-3 remains ungraded without a verified corresponding recording/transcript. Vocabulary and exercise progress is isolated across Lessons 1–6; the advanced vocabulary library is unchanged.

HSK2 Lesson 7

Lesson 7 — 你是跟谁一起去的？ adds 21 vocabulary groups, two transcribed dialogues, 是……的 grammar, transport/photo/reading exercises and a recent-trip simulation. Fourteen supplied pages 77–90 and all four Q2B7 audio files are preserved. NC1–NC3 transcripts and original letter keys were checked against answer PDF page 18; fifteen independently authored listening questions are labelled separately. Textbook 07-3 remains ungraded until its corresponding recording/transcript is verified. Progress is isolated across Lessons 1–7; advanced vocabulary is unchanged.

HSK2 Lesson 8

Lesson 8 — 你会做菜吗？ adds sixteen vocabulary groups (回来 remains a companion of 回), two transcribed dialogues, skill 会 / 除了……以外，还…… grammar, cloze and reading exercises, skill/picture practice, and a saved classmate interview. Thirteen source pages 91–103 and all four supplied Q2B8 MP3s are preserved. NC1–NC3 transcripts and original answer letters were visually checked against answer PDF page 19; fifteen independently authored listening questions are labelled separately. Textbook 08-3 is ungraded pending verification of the corresponding recording/transcript. Progress is isolated across Lessons 1–8. Also namespaced the listening-form binders for Lessons 4–7 so loading a later lesson cannot bind another lesson’s forms.
