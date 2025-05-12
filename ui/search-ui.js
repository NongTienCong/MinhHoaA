// 📁 ui/search-ui.js
// Trình cài đặt giao diện mô phỏng các giải thuật tìm kiếm
import { createInput, createButton, createHR, showPseudo } from './render-control.js';

export function setupSearchUI() {
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
      <h4>Giải thuật tìm kiếm (Search algorithm)</h4>
      <hr>
      <br>
      <li><b>Khái niệm</b>: Giải thuật tìm kiếm là kỹ thuật dùng để tìm kiếm phần tử (theo giá trị, khóa, hoặc điều kiện) trong một tập dữ liệu như mảng, danh sách, cây, v.v.</li>
      <li><b>Phân loại</b>:
        <ul>
          <li>Tìm kiếm tuần tự (Linear Search).</li>
          <li>Tìm kiếm nhị phân (Binary Search).</li>
        </ul>
      </li>
      <li><b>Ứng dụng</b>:
        <ul>
          <li>Phân tích dữ liệu, tìm kiếm thông tin.</li>
          <li>Tối ưu hóa công cụ tìm kiếm.</li>
          <li>Trong AI, xử lý ảnh, mạng máy tính,v.v.</li>
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
  
    // Input khởi tạo danh sách
    const initInput = createInput("Danh sách: 1, 2, 3,...", "text");
    //initInput.style.width = "100px";

    // Nút khởi tạo danh sách
    const initBtn = createButton("Tạo danh sách khóa", () => {
      showPseudo(`// Init(val[])\nTạo danh sách khóa từ dãy đầu vào`);
  
      // 🔧 Xử lý chuỗi đầu vào thành mảng số
      const values = initInput.value
        .split(/[\s,]+/)
        .map(val => Number(val))
        .filter(val => !isNaN(val));

      if (values.length === 0) {
        resultContent.textContent = `⚠️ Danh sách khóa không hợp lệ!`;
        return;
      }

      window.searchSim.init(values);
      resultContent.textContent = `🚀 Danh sách khóa được tạo là: [${values.join(", ")}]`;
    });
    initBtn.style.width = "200px";

    // Input giá trị cần tìm
    const valueInput = createInput("Giá trị cần tìm", "text");
    //valueInput.style.width = "200px";

    // Nút tìm kiếm tuyến tính
    const linearSearchBtn = createButton("Tìm kiếm tuần tự", () => {
      showPseudo(`// LinearSearch(a[], x)\ni = 0\nwhile(i < size(a[]) && a[i] != x)\n  i++\nif(i < size(a[]))\n  return i\nelse\n  return -1`);

      const value = Number(valueInput.value);
      if (isNaN(value)) {
        resultContent.textContent = `⚠️ Giá trị tìm kiếm không hợp lệ!`;
        return;
      }

      window.searchSim.linearSearch(value).then((index) => {
        resultContent.textContent = index !== null
          ? `🔍 Tìm thấy "${value}" tại vị trí "${index}".`
          : `🔍 Không tìm thấy "${value}" trong mảng.`;
      });
    });
    linearSearchBtn.style.width = "200px";

    // Nút tìm kiếm nhị phân
    const binarySearchBtn = createButton("Tìm kiếm nhị phân", () => {
      showPseudo(`// BinarySearch(a[], x)\nleft = 0, right = size-1\nwhile(left <= right)\n  mid = (left+right)/2\n  if(a[mid] == x)\n    return mid\n  else if(x > a[mid])\n    left = mid+1\n  else\n    right = mid-1\nreturn -1`);

      const value = Number(valueInput.value);
      if (isNaN(value)) {
        resultContent.textContent = `⚠️ Giá trị tìm kiếm không hợp lệ!`;
        return;
      }

      window.searchSim.binarySearch(value).then((index) => {
        resultContent.textContent = index !== null
          ? `🔍 Tìm thấy "${value}" tại vị trí "${index}".`
          : `🔍 Không tìm thấy "${value}" trong mảng.`;
      });
    });
    binarySearchBtn.style.width = "200px";

    // Thêm tất cả vào control-panel theo hàng ngang
    control.append(
      createFlexRow(initInput),
      createFlexRow(initBtn),
      createHR(),
      createFlexRow(valueInput),
      createHR(),
      createFlexRow(linearSearchBtn),
      createFlexRow(binarySearchBtn),
    );
  
    // Xóa vùng mô phỏng 
    const canvas = document.getElementById("simulation-canvas");
    const ctx = canvas.getContext("2d");
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }
