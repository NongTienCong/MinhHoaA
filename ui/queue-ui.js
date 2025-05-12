// 📁 ui/queue-ui.js
// Trình cài đặt giao diện mô phỏng cấu trúc Queue
import { createInput, createButton, createHR, showPseudo } from './render-control.js';

export function setupQueueUI() {
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
          <h4>Hàng đợi quay vòng (Circular Queue)</h4>
          <hr>
          <br>
          <li><b>Khái niệm</b>: Là cấu trúc dữ liệu tuyến tính hoạt động theo nguyên lý FIFO (First In - First Out).</li>
          <li><b>Đặc điểm</b>: 
            <ul>
              <li>Phần tử được thêm vào cuối (rear), lấy ra ở đầu (front).</li>
              <li>Khi cài đặt trên mảng, các chỉ số front và rear thường được quản lý quay vòng để tận dụng không gian mảng hiệu quả.</li>
            </ul>
          </li>
          <li><b>Các thao tác cơ bản</b>:
            <ul>
              <li>enqueue(x): Thêm phần tử x vào cuối hàng đợi.</li>
              <li>dequeue(): Loại bỏ và trả về phần tử ở đầu hàng.</li>
              <li>Kiểm tra đầy/rỗng, xem giá trị đầu/cuối hàng.</li>
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
            showPseudo(`// Init(number)\n- Khởi tạo arr[number]\n- capacity = number\n- size = 0\n- front = 0\n- rear = -1`);
            window.queueSim.init(size);
            resultContent.textContent = `✅ Đã khởi tạo hàng đợi có kích thước ${size} phần tử.`;
        }
    });
  
    const valuePush = createInput("Giá trị", "text");
    const enqueueBtn = createButton("Thêm (Enqueue)", () => {
        showPseudo(`// Enqueue(value)\nif(IsFull())\n  return -1\nelse\n  rear = (rear+1)%capacity\n  array[rear] = value\n  size = size+1\n  return 1`);
        let resul = window.queueSim.enqueue(valuePush.value);
        resultContent.textContent = resul ? `🔼 Đã thêm "${valuePush.value}" vào hàng đợi.` : `🛑 Hàng đợi đầy.`;
    });
  
    const dequeueBtn = createButton("Lấy (Dequeue)", () => {
        showPseudo(`// Dequeue()\nif(IsEmpty())\n  return -1\nelse\n  value = array[front]\n  front = (front+1)%capacity\n  size = size-1\n  return value`);
        const value = window.queueSim.dequeue();
        resultContent.textContent = value ? `🔸 Lấy ${value} từ hàng đợi` : `🛑 Hàng đợi rỗng.`;
    });

    dequeueBtn.style.width = "240px";

    const peekBtn = createButton("Xem đỉnh (Peek)", () => {
        showPseudo(`// Peek()\nif(IsEmpty())\n  return -1\nelse\n  return array[front]`);
        const value = window.queueSim.peek();
        resultContent.textContent = value ? `👁 Giá trị tại đỉnh hàng đợi là ${value}.` : `🛑 Hàng đợi rỗng.`;
    });

    peekBtn.style.width = "240px";

    const isEmptyBtn = createButton("Kiểm tra rỗng (Is Empty)", () => {
        showPseudo(`// IsEmpty()\nreturn size == 0`);
        const value = window.queueSim.isEmpty();
        resultContent.textContent = value ? `❓ Hàng đợi rỗng.` : `❓ Hàng đợi không rỗng.`;
    });

    isEmptyBtn.style.width = "240px";

    const isFullBtn = createButton("Kiểm tra đầy (Is Full)", () => {
        showPseudo(`// IsFull()\nreturn size == capacity`);
        const value = window.queueSim.isFull();
        resultContent.textContent = value ? `❓ Hàng đợi đầy.` : `❓ Hàng đợi không đầy.`;
    });

    isFullBtn.style.width = "240px";
  
    const clearBtn = createButton("Xóa (Clear)", () => {
        showPseudo(`// Clear()\n- size = 0\n- front = 0\n- rear = -1`);
        window.queueSim.clear();
        resultContent.textContent = `🗑️ Đã xóa rỗng hàng đợi.`;
    });

    clearBtn.style.width = "240px";
  
    // Thêm tất cả vào control-panel theo hàng ngang
    control.append(
      createFlexRow(sizeInput),
      createFlexRow(initBtn),
      createHR(),
      createFlexRow(valuePush),
      createFlexRow(enqueueBtn),
      createHR(),
      createFlexRow(dequeueBtn),
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
