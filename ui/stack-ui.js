// 📁 ui/stack-ui.js
// Trình cài đặt giao diện mô phỏng cấu trúc Stack
import { createInput, createButton, createHR, showPseudo } from './render-control.js';

export function setupStackUI() {
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
          <h4>Ngăn xếp (Stack) cài đặt trên mảng</h4>
          <hr>
          <br>
          <li><b>Khái niệm</b>: Là cấu trúc dữ liệu tuyến tính hoạt động theo nguyên lý LIFO (Last In - First Out).</li>
          <li><b>Đặc điểm</b>: 
            <ul>
              <li>Phần tử cuối cùng được thêm vào sẽ là phần tử đầu tiên được lấy ra.</li>
              <li>Thường được cài đặt bằng mảng hoặc danh sách liên kết.</li>
            </ul>
          </li>
          <li><b>Các thao tác cơ bản</b>:
            <ul>
              <li>push(x): Thêm phần tử x vào đỉnh ngăn xếp.</li>
              <li>pop(): Loại bỏ và trả về phần tử ở đỉnh.</li>
              <li>peek(): Xem giá trị phần tử ở đỉnh.</li>
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
    const sizeInput = createInput("Kích thước", "number");
    const initBtn = createButton("Khởi tạo", () => {
        const size = parseInt(sizeInput.value);
        if (!isNaN(size) && size > 0) {
            showPseudo(`// Init(size)\n- Khởi tạo arr[size]\n- capacity = size\n- top = -1`);
            window.stackSim.init(size);
            resultContent.textContent = `✅ Đã khởi tạo ngăn xếp có kích thước ${size} phần tử.`;
        }
    });
  
    const valuePush = createInput("Giá trị", "text");
    const pushBtn = createButton("Thêm (Push)", () => {
        showPseudo(`// Push(value)\nif(IsFull())\n  return -1\nelse\n  top = top + 1\n  array[top] = value\n  return 1`);
        let resul = window.stackSim.push(valuePush.value);
        resultContent.textContent = resul ? `🔼 Đã thêm "${valuePush.value}" vào ngăn xếp.` : `🛑 Ngăn xếp đầy.`;
    });
  
    const popBtn = createButton("Lấy (Pop)", () => {
        showPseudo(`// Pop()\nif(IsEmpty())\n  return -1\nelse\n  value = array[top]\n  top = top - 1\n  return value`);
        const value = window.stackSim.pop();
        resultContent.textContent = value ? `🔸 Lấy ${value} từ ngăn xếp` : `🛑 Ngăn xếp rỗng.`;
    });

    //popBtn.style.width = "240px";

    const peekBtn = createButton("Xem đỉnh (Peek)", () => {
        showPseudo(`// Peek()\nif(IsEmpty())\n  return -1\nelse\n  return array[top]`);
        const value = window.stackSim.peek();
        resultContent.textContent = value ? `👁 Giá trị tại đỉnh ngăn xếp là ${value}.` : `🛑 Ngăn xếp rỗng.`;
    });

    //peekBtn.style.width = "240px";

    const isEmptyBtn = createButton("Kiểm tra rỗng (Is Empty)", () => {
        showPseudo(`// IsEmpty()\nreturn top == -1`);
        const value = window.stackSim.isEmpty();
        resultContent.textContent = value ? `❓ Ngăn xếp rỗng.` : `❓ Ngăn xếp không rỗng.`;
    });

    //isEmptyBtn.style.width = "240px";

    const isFullBtn = createButton("Kiểm tra đầy (Is Full)", () => {
        showPseudo(`// IsFull()\nreturn top == capacity - 1`);
        const value = window.stackSim.isFull();
        resultContent.textContent = value ? `❓ Ngăn xếp đầy.` : `❓ Ngăn xếp không đầy.`;
    });

    //isFullBtn.style.width = "240px";
  
    const clearBtn = createButton("Xóa (Clear)", () => {
        showPseudo(`// Clear()\ntop = -1`);
        window.stackSim.clear();
        resultContent.textContent = `🗑️ Đã xóa rỗng ngăn xếp.`;
    });

    //clearBtn.style.width = "240px";
  
    // Thêm tất cả vào control-panel theo hàng ngang
    control.append(
      createFlexRow(sizeInput),
      createFlexRow(initBtn),
      createHR(),
      createFlexRow(valuePush),
      createFlexRow(pushBtn),
      createHR(),
      createFlexRow(popBtn),
      createFlexRow(peekBtn),
      createFlexRow(isEmptyBtn),
      createFlexRow(isFullBtn),
      createHR(),
      createFlexRow(clearBtn)
    );
  
    // Xóa vùng mô phỏng 
    const canvas = document.getElementById("simulation-canvas");
    const ctx = canvas.getContext("2d");
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }
  