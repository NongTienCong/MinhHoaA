// 📁 ui/array-ui.js
// Trình cài đặt giao diện mô phỏng cấu trúc mảng
import { createInput, createButton, createHR, showPseudo } from './render-control.js';

export function setupArrayUI() {
  const control = document.getElementById("control-panel");

  const explainPanel = document.getElementById("explanation-panel");
  let explainContent = document.getElementById("explanation-content");
  let resultContent = document.getElementById("result-content");

  // Nếu phần tử explanation-content chưa tồn tại, tạo mới
  if (!explainContent) {
    explainContent = document.createElement("div");
    explainContent.id = "explanation-content";
    explainPanel.appendChild(explainContent);
  }

  // Nếu phần tử result-content chưa tồn tại, tạo mới
  if (!resultContent) {
    resultContent = document.createElement("div");
    resultContent.id = "result-content";
    explainPanel.appendChild(resultContent);
  }

  // Tiêu đề vùng điều khiển
  const controlTitle = document.createElement("h3");
  controlTitle.textContent = "🔧 Điều khiển";
  control.appendChild(controlTitle);

  // Tiêu đề vùng giải thích (chỉ thêm nếu chưa có)
  if (!explainPanel.querySelector("h3")) {
    const explainTitle = document.createElement("h3");
    explainTitle.textContent = "📝 Giải thích";
    explainPanel.insertBefore(explainTitle, explainContent);
  }

  // Thêm nội dung vùng giải thích
  explainContent.innerHTML = `
        <ol>
          <h4>Mảng (Array)</h4>
          <hr>
          <br>
          <li><b>Khái niệm</b>: Mảng là cấu trúc dữ liệu tuyến tính gồm các phần tử có cùng kiểu, được lưu trữ liên tiếp trong bộ nhớ.</li>
          <li><b>Đặc điểm</b>: 
            <ul>
              <li>Truy cập nhanh phần tử thông qua chỉ số.</li>
              <li>Kích thước cố định sau khi khai báo.</li>
            </ul>
          </li>
          <li><b>Các thao tác cơ bản</b>:
            <ul>
              <li>Khởi tạo, gán giá trị, truy xuất theo chỉ số.</li>
              <li>Duyệt mảng, tìm kiếm, cập nhật, sắp xếp.</li>
            </ul>
          </li>
        </ol>
        <pre id="pseudo-code" style="background:#fef9c3;padding:10px;border:1px solid #ddd;margin-top:10px;"></pre>`

  // Flex container helper
  const createFlexRow = (...elements) => {
    const row = document.createElement("div");
    row.style.display = "flex";
    row.style.alignItems = "center";
    row.style.gap = "8px";
    row.style.margin = "6px 0";
    elements.forEach(el => row.appendChild(el));
    return row;
  };

  // Tạo input và button
  const sizeInput = createInput("Số phần tử", "number");
  const initBtn = createButton("Khởi tạo", () => {
    const size = parseInt(sizeInput.value);
    if (!isNaN(size) && size > 0) {
      showPseudo(`// Init(size)\nKhởi tạo arr[size]`);
      window.arraySim.init(size);
      resultContent.textContent = `✅ Đã khởi tạo mảng ${size} phần tử.`;
    }
  });

  const indexSet = createInput("Chỉ số", "number");
  const valueSet = createInput("Giá trị", "text");
  const setBtn = createButton("Gán (Set)", () => {
    showPseudo(`// Set(value, index)\narr[index] = value`);
    window.arraySim.set(parseInt(indexSet.value), valueSet.value);
    resultContent.textContent = `🔹 Gán giá trị ${valueSet.value} tại chỉ số ${indexSet.value}.`;
  });

  //setBtn.style.width = "240px";

  const indexGet = createInput("Chỉ số", "number");
  const getBtn = createButton("Lấy (Get)", () => {
    showPseudo(`// Get(index)\nreturn arr[index]`);
    const value = window.arraySim.get(parseInt(indexGet.value));
    resultContent.textContent = `🔸 Giá trị tại chỉ số ${indexGet.value} là: ${value}`;
  });

  const traverseBtn = createButton("Duyệt mảng", () => {
    showPseudo(`// ArrayTraverse()\nDuyệt qua từng phần tử`);
    window.arraySim.traverse();
    resultContent.textContent = `🚶‍♂️ Duyệt toàn bộ mảng.`;
  });

  const clearBtn = createButton("Xóa (Clear)", () => {
    showPseudo(`// ArrayClear()\nReset all`);
    window.arraySim.clear();
    resultContent.textContent = `🗑️ Đã xóa toàn bộ giá trị trong mảng.`;
  });

  // Thêm tất cả vào control-panel theo hàng ngang
  control.append(
    createFlexRow(sizeInput),
    createFlexRow(initBtn),
    createHR(),
    createFlexRow(indexSet, valueSet),
    createFlexRow(setBtn),
    createHR(),
    createFlexRow(indexGet),
    createFlexRow(getBtn),
    createHR(),
    createFlexRow(traverseBtn, clearBtn)
  );

  // Xóa vùng mô phỏng 
  const canvas = document.getElementById("simulation-canvas");
  const ctx = canvas.getContext("2d");
  canvas.width = canvas.clientWidth;
  canvas.height = canvas.clientHeight;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}
