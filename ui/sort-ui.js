// 📁 ui/sort-ui.js
// Trình cài đặt giao diện mô phỏng các giải thuật tìm kiếm
import { createInput, createButton, createHR, showPseudo, showFileTxt } from './render-control.js';

export function setupSortUI() {
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
      <h4>Giải thuật sắp xếp (Sorting algorithm)</h4>
      <hr>
      <br>
      <li><b>Khái niệm</b>: Sắp xếp là quá trình tổ chức lại các phần tử trong một tập dữ liệu theo thứ tự tăng dần hoặc giảm dần dựa trên một tiêu chí nào đó.</li>
      <li><b>Phân loại</b>:
        <ul>
          <li>Sắp xếp đơn giản (Simple Sort).</li>
          <li>Sắp xếp hiệu quả (Efficient Sort).</li>
          <li>Sắp xếp theo đặc thù (Sort by characteristics).</li>
        </ul>
      </li>
      <li><b>Ứng dụng</b>:
        <ul>
          <li>Quản lý cơ sở dữ liệu, phân tích dữ liệu.</li>
          <li>Là bước tiền xử lý cho các thuật toán khác.</li>
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

      window.sortSim.init(values);
      resultContent.textContent = `🚀 Danh sách khóa được tạo là: [${values.join(", ")}]`;
    });
    initBtn.style.width = "200px";

    // Nút tạo dãy ngẫu nhiên
    const generateRandomBtn = createButton("Tạo dãy ngẫu nhiên", () => {
      showPseudo(`// Init(val[])\nTạo dãy số ngẫu nhiên gồm 8 phần tử`);

      // 🔧 Tạo dãy 8 số tự nhiên ngẫu nhiên từ 1 đến 99
      const randomValues = Array.from({ length: 8 }, () =>
        Math.floor(Math.random() * 99) + 1
      );

      // ✍️ Hiển thị dãy vào ô nhập, không gọi init
      initInput.value = randomValues.join(", ");

      // 📢 Hiển thị thông báo
      resultContent.textContent = `🎲 Dãy ngẫu nhiên được tạo: [${randomValues.join(", ")}]`;
    });
    generateRandomBtn.style.width = "200px";

    // Nút sắp xếp nổi bọt
    const bubbleSortBtn = createButton("Sắp xếp nổi bọt", () => {
        showPseudo(`// BubbleSort(a[])\nfor(i = 0; i < size(a[]); i++)\n  for(j = size(a[])-1; j > 0; i--)\n    if(a[j] < a[j-1])\n      swap(a[j], a[j-1])`);
        window.sortSim.bubbleSort().then(() => {
          resultContent.textContent = "🚀 Dãy số đã được sắp xếp!";
        });
      });
    bubbleSortBtn.style.width = "200px";

    // Nút sắp xếp chọn trực tiếp
    const selectionSortBtn = createButton("Sắp xếp kiểu chọn", () => {
      showPseudo(`// SelectionSort(a[])\nfor(i = 0; i < size(a[]); i++)\n  Min = i\n  for(j = i+1; j < size(a[]); j++)\n    if(a[j] < a[Min])\n      Min = j\n  if(i != Min)\n    swap(a[i], a[Min])`);
      window.sortSim.selectionSort().then(() => {
        resultContent.textContent = "🚀 Dãy số đã được sắp xếp!";
      });
    });
    selectionSortBtn.style.width = "200px";

    // Nút sắp xếp chèn trực tiếp
    const insertionSortBtn = createButton("Sắp xếp kiểu chèn", () => {
      showPseudo(`// InsertionSort(a[])\nfor(i = 1; i < size(a[]); i++)\n  j = i\n  while(j > 0 && a[j] < a[j-1])\n    sawp(a[j], a[j-1]\n    j--`);
      window.sortSim.insertionSort().then(() => {
        resultContent.textContent = "🚀 Dãy số đã được sắp xếp!";
      });
    });
    insertionSortBtn.style.width = "200px";

    // Nút sắp xếp nhanh
    const quickSortBtn = createButton("Sắp xếp nhanh", () => {
      showFileTxt("../modules/quickSort.txt");
      window.sortSim.quickSort().then(() => {
        resultContent.textContent = "🚀 Dãy số đã được sắp xếp!";
      });
    });
    quickSortBtn.style.width = "200px";

    // Nút sắp xếp trộn
    const megerSortBtn = createButton("Sắp xếp trộn", () => {
      showFileTxt("../modules/mergeSort.txt");
      window.sortSim.mergeSort().then(() => {
        resultContent.textContent = "🚀 Dãy số đã được sắp xếp!";
      });
    });
    megerSortBtn.style.width = "200px";

    // Thêm tất cả vào control-panel theo hàng ngang
    control.append(
      createFlexRow(initInput),
      createFlexRow(generateRandomBtn),
      createFlexRow(initBtn),
      createHR(),
      createFlexRow(bubbleSortBtn),
      createFlexRow(selectionSortBtn),
      createFlexRow(insertionSortBtn),
      createFlexRow(quickSortBtn),
      createFlexRow(megerSortBtn),
    );

    //================================================================
        // ====== Điều khiển thuật toán (Tạm dừng, Tiếp tục, Tốc độ) ======

        const pauseBtn = createButton("⏸️", () => {
          if (window.sortSim?.visualizer) {
            window.sortSim.visualizer.pause();
          }
        });
    
        const resumeBtn = createButton("▶️", () => {
          if (window.sortSim?.visualizer) {
            window.sortSim.visualizer.resume();
          }
        });
    
        const stopBtn = createButton("⏹️", () => {
          if (window.sortSim?.visualizer) {
            window.sortSim.visualizer.stop();
          }
        });
    
        // Tốc độ thực thi
        const speedSelect = document.createElement("select");
        ["0.5", "1", "1.5", "2"].forEach(speed => {
          const option = document.createElement("option");
          option.value = speed;
          option.textContent = `${speed}×`;
          if (speed === "1") option.selected = true;
          speedSelect.appendChild(option);
        });
    
        speedSelect.onchange = () => {
          if (window.sortSim?.visualizer) {
            window.sortSim.visualizer.setSpeedFactor(parseFloat(speedSelect.value));
          }
        };
    
        const speedLabel = document.createElement("label");
        speedLabel.textContent = "⚡ Tốc độ:";
        speedLabel.style.marginRight = "6px";
        const speedRow = createFlexRow(speedLabel, speedSelect);
    
        // Thêm các nút vào control panel
        control.append(
          createHR(),
          createFlexRow(pauseBtn, resumeBtn, stopBtn),
          speedRow
        );
    //===============================================================
  
    // Xóa vùng mô phỏng 
    const canvas = document.getElementById("simulation-canvas");
    const ctx = canvas.getContext("2d");
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }
