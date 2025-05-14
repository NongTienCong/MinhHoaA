import { quickSortText } from '../modules/quickSort-content.js';
import { mergeSortText } from '../modules/mergeSort-content.js';

// Helper tạo input
export function createInput(placeholder, type = "text") {
    const input = document.createElement("input");
    input.type = type;
    input.placeholder = placeholder;
    input.style.padding = "6px 8px";
    input.style.fontSize = "14px";
    input.style.border = "1px solid #aaa";
    input.style.borderRadius = "4px";
    input.style.width = "50px"; // 👈 Độ rộng rút gọn lại một nửa
    input.style.flex = "1";
    return input;
}
  
// Helper tạo button
export function createButton(text, onClick) {
    const btn = document.createElement("button");
    btn.textContent = text;
    btn.onclick = onClick;
  
    btn.style.margin = "1px";
    btn.style.padding = "8px 12px";
    btn.style.fontSize = "14px";
    btn.style.border = "1px solid #888";
    btn.style.borderRadius = "4px";
    btn.style.width = "160px";
    btn.style.backgroundColor = "#f0f0f0";
    btn.style.cursor = "pointer";
    btn.style.transition = "all 0.2s ease";
  
    // 💫 Hover effect
    btn.onmouseover = () => {
        btn.style.backgroundColor = "#007BFF";
        btn.style.color = "white";
        btn.style.borderColor = "#0056b3";
    };
  
    btn.onmouseout = () => {
        btn.style.backgroundColor = "#f0f0f0";
        btn.style.color = "black";
        btn.style.borderColor = "#888";
    };
  
    return btn;
}
  
  // Helper tạo đường kẻ ngang
  export function createHR() {
    const hr = document.createElement("hr");
    hr.style.margin = "4px 0";
    return hr;
  }
  
  // Hàm hiện mã giả giải thuật
  export function showPseudo(code) {
    const pre = document.getElementById("pseudo-code");
    if (pre) pre.innerText = code;
  }

  // Hàm đọc nội dung file .js
  export async function showFileTxt(typeOfSort) {
    try {
        //const response = await fetch(fileUrl);
        //const text = await response.text();
        let text = null;
        if (typeOfSort === "quickSort") {
            text = quickSortText;
        } else if (typeOfSort === "mergeSort") {
            text = mergeSortText;
        }
        showPseudo(text); // Giả sử showPseudo đã được định nghĩa
    } catch (error) {
        console.error("Lỗi khi đọc file:", error);
    }
  }

  // Hàm hiển thị nội dung file giới thiệu trong Dialog bổ sung
  export async function showDialog(fileOrText) {
    let text = "";

    try {
        // // Nếu là URL kết thúc bằng .txt → fetch như cũ
        // if (typeof fileOrText === "string" && (fileOrText.startsWith("http") || fileOrText.endsWith(".txt"))) {
        //     const response = await fetch(fileOrText);
        //     text = await response.text();
        // } 
        // // Nếu là module .js → truyền thẳng vào như chuỗi
        // else if (typeof fileOrText === "string") {
        //     text = fileOrText;
        // } 
        // // Nếu là kiểu dữ liệu không xác định
        
        // Nếu là module .js → truyền thẳng vào như chuỗi
        if (typeof fileOrText === "string") {
            text = fileOrText;
        }
        else {
            throw new Error("Không thể hiển thị nội dung từ kiểu dữ liệu không hợp lệ.");
        }

        let dialog = document.getElementById('my-dialog');

        if (!dialog) {
            dialog = document.createElement('dialog');
            dialog.id = 'my-dialog';
            dialog.style.width = '60%';
            dialog.style.maxWidth = '100%';
            dialog.style.padding = '0';
            dialog.style.border = '1px solid #ccc';
            dialog.style.borderRadius = '5px';
            dialog.style.position = 'fixed';
            dialog.style.top = '50%';
            dialog.style.left = '50%';
            dialog.style.transform = 'translate(-50%, -50%)';
            dialog.style.overflow = 'hidden';

            document.body.appendChild(dialog);
        } else {
            dialog.innerHTML = '';
        }

        const titleBar = document.createElement('div');
        titleBar.style.padding = '10px';
        titleBar.style.backgroundColor = '#f0f0f0';
        titleBar.style.fontWeight = 'bold';
        titleBar.textContent = 'Giới thiệu về ứng dụng';
        dialog.appendChild(titleBar);

        const content = document.createElement('div');
        content.style.padding = '20px';
        content.style.overflowY = 'auto';
        content.style.maxHeight = '400px';
        const pre = document.createElement('pre');
        pre.style.whiteSpace = 'pre-wrap';
        pre.style.wordBreak = 'break-word';
        pre.textContent = text;
        content.appendChild(pre);
        dialog.appendChild(content);

        const buttonContainer = document.createElement('div');
        buttonContainer.style.padding = '10px';
        buttonContainer.style.display = 'flex';
        buttonContainer.style.justifyContent = 'flex-end';
        buttonContainer.style.backgroundColor = '#f0f0f0';

        const okButton = createButton("Đóng", () => dialog.close());
        okButton.style.width = "100px";
        buttonContainer.appendChild(okButton);
        dialog.appendChild(buttonContainer);

        dialog.showModal();
    } catch (error) {
        console.error("Lỗi khi hiển thị nội dung:", error);
        alert("Không thể hiển thị nội dung.");
    }
}
