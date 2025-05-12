// 📁 ui/linkedlist-ui.js
// Trình cài đặt giao diện mô phỏng cấu trúc danh sách
import { createInput, createButton, createHR, showPseudo } from './render-control.js';

export function setupLinkedListUI() {
  const control = document.getElementById("control-panel");
  control.innerHTML = ""; // Xóa nội dung cũ nếu có

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
      <h4>Danh sách liên kết đơn (Singly linked list)</h4>
      <hr>
      <br>
      <li><b>Khái niệm</b>: Là tập hợp các nút (node), mỗi nút có thành phần chứa dữ liệu và thành phần con trỏ chỉ đến nút kế tiếp.</li>
      <li><b>Đặc điểm</b>:
        <ul>
          <li>Kích thước linh hoạt, dễ chèn/xóa phần tử.</li>
          <li>Truy cập tuần tự (O(n)).</li>
        </ul>
      </li>
      <li><b>Các thao tác cơ bản</b>:</li>
        <ul>
          <li>Thêm/Xóa ở đầu/cuối/vị trí bất kỳ.</li>
          <li>Duyệt danh sách, tìm kiếm theo giá trị hoặc vị trí.</li>
        </ul>
    </ol>
    <pre id="pseudo-code" style="background:#fef9c3;padding:10px;border:1px solid #ddd;margin-top:10px;"></pre>`

  const createFlexRow = (...elements) => {
    const row = document.createElement("div");
    row.style.display = "flex";
    row.style.alignItems = "center";
    row.style.gap = "8px";
    row.style.margin = "6px 0";
    elements.forEach(el => row.appendChild(el));
    return row;
  };

  const initInput = createInput("Danh sách: A, B, C,..", "text");
  //initInput.style.width = "240px";
  
  const initBtn = createButton("Khởi tạo danh sách", () => {
    showPseudo(`// Init(val[])\nNếu(val[] == null)\n HEAD = null\nNgược lại\n Lặp với mỗi i (i = 1, 2,..)\n   AddFirst(val[i])`);
    const values = initInput.value.split(",").map(s => s.trim()).filter(s => s !== "");
    window.linkedListSim.init(values);
    resultContent.textContent = `🚀 Danh sách đã được khởi tạo với: [${values.join(", ")}]`;
  });

  // console.log("initBtn là:", initBtn);
  // initBtn.style.setProperty("width", "240px", "important");
  initBtn.style.width = "240px";

  // Input
  const valueInput = createInput("Giá trị", "text");
  const indexInput = createInput("Vị trí", "number");

  // Buttons
  const addFirstBtn = createButton("Thêm đầu", () => {
    showPseudo(`// AddFirst(value)\n- Thêm value vào đầu DS\n- HEAD trỏ vào nút đầu`);
    window.linkedListSim.insertAtHead(valueInput.value);
    resultContent.textContent = `🔼 Đã thêm "${valueInput.value}" vào đầu danh sách.`;
  });

  //addFirstBtn.style.width = "100px";

  const addLastBtn = createButton("Thêm cuối", () => {
    showPseudo(`// AddLast(value)\n- Tìm đến nút cuối DS\n- Thêm value vào cuối DS`);
    window.linkedListSim.insertAtTail(valueInput.value);
    resultContent.textContent = `🔽 Đã thêm "${valueInput.value}" vào cuối danh sách.`;
  });

  //addLastBtn.style.width = "100px";

  const addAtBtn = createButton("Thêm tại vị trí", () => {
    showPseudo(`// AddAt(value, index)\n- Tìm đến vị trí index\n- Nếu tìm thấy\n    Chèn value vào DS\n    return 1\n  Ngược lại\n    return -1`);
    window.linkedListSim.insertAt(parseInt(indexInput.value), valueInput.value)
      .then(success => {
        if (success) {
          // ✅ Thêm thành công
          resultContent.textContent = `✅ Đã thêm "${valueInput.value}" tại vị trí ${indexInput.value}.`;
        } else {
          // ❌ Vị trí không hợp lệ (lớn hơn chiều dài danh sách)
          resultContent.textContent = `❌ Không thể thêm vào vị trí ${indexInput.value} – vị trí không hợp lệ.`;
        }
      });
  });

  //addAtBtn.style.width = "240px";

  const removeAtBtn = createButton("Xóa tại vị trí", () => {
    showPseudo(`// RemoveAt(index)\n- Tìm đến vị trí index\n- Nếu tìm thấy\n    Xóa phần tử\n    return 1\n  Ngược lại\n    return -1`);
    const index = parseInt(indexInput.value);
    window.linkedListSim.removeAt(index).then(success => {
      if (success) {
        resultContent.textContent = `🗑️ Đã xóa phần tử tại vị trí ${index}.`;
      } else {
        resultContent.textContent = `❌ Không thể xóa – danh sách rỗng hoặc vị trí ${index} không hợp lệ.`;
      }
    });
  });

  //removeAtBtn.style.width = "240px";

  const findValueBtn = createButton("Tìm theo giá trị", () => {
    showPseudo(`// SearchValue(value)\nTìm từ đầu đến cuối DS\n  Nếu tìm thấy\n    return index\n  Ngược lại\n    return -1`);
    window.linkedListSim.findByValue(valueInput.value).then((post) => {
      resultContent.textContent = post !== null
        ? `🔍 Tìm thấy "${valueInput.value}" tại vị trí "${post}".`
        : `🔍 Danh sách không có "${valueInput.value}".`;
    });
  });

  //findValueBtn.style.width = "240px";
  
  const traverseBtn = createButton("Duyệt danh sách", () => {
    showPseudo(`// TraverseLinkedList()\nDuyệt qua từng phần tử`);
    window.linkedListSim.traverse();
    resultContent.textContent = `🚶‍♂️ Duyệt toàn bộ danh sách.`;
  });

  //traverseBtn.style.width = "240px";

  const clearBtn = createButton("Xóa danh sách (Remove All)", () => {
    showPseudo(`// RemoveAll()\nLặp(HEAD != null)\n  RemoveAt(0)`);
    window.linkedListSim.clear();
    resultContent.textContent = `🗑️ Đã xóa toàn bộ danh sách.`;
  });

  //clearBtn.style.width = "240px";

  control.append(
    createFlexRow(initInput),
    createFlexRow(initBtn),
    createHR(),
    createFlexRow(valueInput, indexInput),
    createFlexRow(addFirstBtn, addLastBtn, addAtBtn),
    createFlexRow(addAtBtn),
    createHR(),
    createFlexRow(findValueBtn),
    createFlexRow(traverseBtn),
    createHR(),
    createFlexRow(removeAtBtn),
    createFlexRow(clearBtn)
  );

  // Xóa vùng mô phỏng 
  const canvas = document.getElementById("simulation-canvas");
  const ctx = canvas.getContext("2d");
  canvas.width = canvas.clientWidth;
  canvas.height = canvas.clientHeight;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}
