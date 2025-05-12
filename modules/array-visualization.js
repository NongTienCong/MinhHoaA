// Lớp ArrayVisualizer dùng để mô phỏng hoạt động của mảng và hoạt ảnh tương tác
export class ArrayVisualizer {
    constructor(canvasId, size = 10) {
        // 🎯 Khởi tạo canvas chính
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext("2d");

        this.size = size;

        // ⚙️ Cấu hình cơ bản cho từng ô mảng
        this.boxWidth = 80;
        this.boxHeight = 40;
        this.spacing = 10;
        this.startX = 50;
        this.startY = 100;

        this.font = "20px Arial";

        // 📌 Khởi tạo danh sách các ô (box)
        this.boxes = new Array(this.size).fill(null).map((_, i) => {
            const x = this.startX + i * (this.boxWidth + this.spacing);
            const y = this.startY;

            return {
                index: i,                         // chỉ số mảng
                value: null,                      // giá trị ban đầu
                address: 1000 + i * 4,            // địa chỉ giả lập
                x, y,
                width: this.boxWidth,
                height: this.boxHeight,

                valuePos: {                       // vị trí vẽ value
                    x: x + this.boxWidth / 2,
                    y: y + this.boxHeight / 2 + 3
                },
                addressPos: {                     // địa chỉ phía trên
                    x: x + this.boxWidth / 2,
                    y: y - 5
                },
                indexPos: {                       // chỉ số phía dưới
                    x: x + this.boxWidth / 2,
                    y: y + this.boxHeight + 16
                },

                textColor: "White",             // màu chữ
                backgroundColor: "Blue",       // màu nền mặc định
                pointers: [],                     // danh sách con trỏ đang trỏ tới
                highlight: false,
                selected: false
            };
        });

        // 🖼️ Khởi tạo canvas phụ để vẽ hoạt ảnh mượt
        this.tempCanvas = document.createElement("canvas");
        this.tempCanvas.width = this.canvas.width;
        this.tempCanvas.height = this.canvas.height;
        this.tempCanvas.style.position = "absolute";
        this.tempCanvas.style.top = this.canvas.offsetTop + "px";
        this.tempCanvas.style.left = this.canvas.offsetLeft + "px";
        this.tempCanvas.style.pointerEvents = "none";
        this.tempCanvas.style.zIndex = 10;
        this.canvas.parentElement.appendChild(this.tempCanvas);

        this.tempCtx = this.tempCanvas.getContext("2d");


        // 📦 Tọa độ hộp tạm khi swap
        this.tempX = 100;
        this.tempY = 50;
        this.tempBox = null; // Giá trị viết trong hộp tạm

        // 📌 Vị trí hiển thị giá trị biến điều khiển vòng lặp
        this.currentLoop = null;
        this.currentLoopX = 20;
        this.currentLoopY = 30;  // 🟦 Dưới mảng

        this.messageLines = [];       // 💬 Danh sách các dòng thông báo
        this.messageLineHeight = 24;  // Cách dòng
        // 📌 Vị trí hiển thị các thông báo
        this.messageX = 20;
        this.messageY = 30;  // 💬 Dưới dòng biến lặp
        this.messageLineHeight = 24;

        // Các biến điều khiển
        this.speedFactor = 1;     // tốc độ: 1 = mặc định, 2 = nhanh gấp đôi
        this.isPaused = false;    // cờ tạm dừng
        this.isStopped = false;   // cờ dừng hẳn

        // 📌 Xoá nội dung canvas chính
        this.clear();
    }

    // Điều khiển hoạt cảnh
    setSpeedFactor(factor) {
        this.speedFactor = factor;
    }
    
    pause() {
        this.isPaused = true;
    }
    
    resume() {
        this.isPaused = false;
    }
    
    stop() {
        this.isStopped = true;
    }
    
    resetControlFlags() {
        this.isPaused = false;
        this.isStopped = false;
    }
    
    //==============================================================
    // Điều khiển thông báo

    // 🖋️ Ghi toàn bộ vùng thông báo
    setMessage(lines = []) {
        this.messageLines = lines.slice();  // Sao chép
        this.drawMessages();
    }

    // ✏️ Ghi dòng cụ thể
    setMessageLine(index, text) {
        this.messageLines[index] = text;
        this.drawMessages();
    }
    
    // 🧽 Xóa tất cả thông báo
    clearMessages() {
        this.messageLines = [];
        this.ctx.clearRect(this.messageX - 2, this.messageY - 2, this.canvas.with, this.canvas.height);
    }
    
    // 🖋️ Vẽ toàn bộ thông báo
    drawMessages(ctx = this.ctx) {
        const x = this.messageX;
        const y = this.messageY;
        const lh = this.messageLineHeight;
    
        ctx.clearRect(x - 2, y - 2, 400, this.messageLines.length * lh + 10);
    
        ctx.fillStyle = "black";
        ctx.font = "16px Arial";
        ctx.textAlign = "left";
        ctx.textBaseline = "top";
    
        this.messageLines.forEach((line, i) => {
            ctx.fillText(line, x, y + i * lh);
        });
    }    

    //==============================================================
    centerBoxesVertically() {
        // 🧮 Tính vị trí giữa theo chiều cao canvas
        this.startX = (this.canvas.width - (this.size * this.boxWidth + (this.size - 1) * this.spacing)) / 2;
        this.startY = this.canvas.height - this.canvas.height / 3;
    
        // 🔁 Cập nhật lại vị trí của từng box theo startX, startY mới
        for (let i = 0; i < this.size; i++) {
            const box = this.boxes[i];

            box.x = this.startX + i * (this.boxWidth + this.spacing);
            box.y = this.startY;
    
            box.valuePos.x = box.x + box.width / 2;
            box.valuePos.y = box.y + box.height / 2 + 3;

            box.addressPos.x = box.x + box.width / 2;
            box.addressPos.y = box.y - 5;

            box.indexPos.x = box.x + box.width / 2;
            box.indexPos.y = box.y + box.height + 16;
        }
        // Tính lại tọa độ tempX của biến tạm
        this.tempX = (this.canvas.width - this.boxWidth) / 2
        this.tempY = this.startY - 3 * this.boxHeight;
    }
       
    // ============================================================================
    // 🎨 Vẽ phần tử mảng

    drawBox(box, ctx = this.ctx) {
        const {
            x, y, width, height,
            value, address, index,
            valuePos, addressPos, indexPos,
            backgroundColor, textColor,
            pointers
        } = box;

        // 🎨 Vẽ nền
        ctx.fillStyle = backgroundColor;
        ctx.fillRect(x, y, width, height);

        // 🟦 Vẽ khung
        ctx.strokeStyle = "#000";
        ctx.lineWidth = 1;
        ctx.strokeRect(x, y, width, height);

        // 🔢 Vẽ giá trị chính giữa
        ctx.fillStyle = textColor;
        ctx.font = "20px Arial";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        if (value !== null) {
            ctx.fillText(value, valuePos.x, valuePos.y);
        }

        // 🧠 Vẽ địa chỉ (phía trên)
        ctx.fillStyle = "#888";
        ctx.font = "16px monospace";
        ctx.textBaseline = "alphabetic";
        ctx.fillText(address, addressPos.x, addressPos.y);

        // 🔣 Vẽ chỉ số (phía dưới)
        ctx.fillStyle = "#000";
        ctx.font = "16px Arial";
        ctx.fillText(index, indexPos.x, indexPos.y);

        // 📍 Vẽ mũi tên con trỏ (nếu có)
        if (pointers && pointers.length > 0) {
            this.drawPointer(index, pointers, "red", ctx);
        }
    }

    // 🧭 Vẽ con trỏ mảng tại chỉ số i
    drawPointer(i, labels = [], color = "red", ctx = this.ctx) {
        if (!this.boxes[i]) return;

        const box = this.boxes[i];
        const x = box.x + box.width / 2;
        const y = box.indexPos.y + 10;

        if (labels.length === 0) labels = box.pointers || [];
        if (labels.length === 0) return;

        const labelText = labels.join(", ");
        const arrowHeight = 15;
        const arrowWidth = 5;

        // Mũi tên hướng lên
        ctx.beginPath();
        ctx.moveTo(x, y + arrowHeight);
        ctx.lineTo(x, y);
        ctx.strokeStyle = color;
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Đầu mũi tên
        ctx.beginPath();
        ctx.moveTo(x - arrowWidth, y + 2);
        ctx.lineTo(x + arrowWidth, y + 2);
        ctx.lineTo(x, y - 6);
        ctx.closePath();
        ctx.fillStyle = color;
        ctx.fill();

        // Tên con trỏ
        ctx.fillStyle = color;
        ctx.font = "16px bold Arial";
        ctx.textAlign = "center";
        ctx.textBaseline = "top";
        ctx.fillText(labelText, x, y + arrowHeight + 8);
    }

    // Cập nhật lại tọa độ của phần tử thứ i
    updateBoxPosition(i, newX, newY) {
        if (!this.boxes[i]) return;

        this.boxes[i].x = newX;
        this.boxes[i].y = newY;

        // Cập nhật các vị trí phụ thuộc (value, address, index)
        this.boxes[i].valuePos.x = newX + this.boxes[i].width / 2;
        this.boxes[i].valuePos.y = newY + this.boxes[i].height / 2 + 3;
        this.boxes[i].addressPos.x = newX + this.boxes[i].width / 2;
        this.boxes[i].addressPos.y = newY - 5;
        this.boxes[i].indexPos.x = newX + this.boxes[i].width / 2;
        this.boxes[i].indexPos.y = newY + this.boxes[i].height + 16;

        this.drawBox(this.boxes[i]); // Vẽ lại hộp sau khi cập nhật
    }

    // 🧾 Vẽ toàn bộ mảng
    drawArray() {
        this.boxes.forEach(box => this.drawBox(box));
    }
    
    setColor(i, color) {
        if (!this.boxes[i]) return;
        this.boxes[i].backgroundColor = color;
    }

    setColorRange(from, to, color) {
        for (let i = from; i <= to; i++) {
            this.setColor(i, color);
        }
    }
    
    // ============================================================================
    // 🧠 Thao tác dữ liệu mảng

    getValue(i) {
        return this.boxes[i]?.value ?? null;
    }

    setValue(i, val) {
        if (this.boxes[i]) {
            this.boxes[i].value = val;
            this.drawBox(this.boxes[i]);
        }
    }

    swapValues(i, j) {
        if (this.boxes[i] && this.boxes[j]) {
            const temp = this.boxes[i].value;
            this.boxes[i].value = this.boxes[j].value;
            this.boxes[j].value = temp;
            this.drawBox(this.boxes[i]);
            this.drawBox(this.boxes[j]);
        }
    }
    

    setArray(values = []) {
        for (let i = 0; i < this.size; i++) {
            this.boxes[i].value = values[i] ?? null;
            this.boxes[i].pointers = [];
        }
    
        this.clear();        // Gọi clear để resize & làm sạch canvas
        // ✨ Cập nhật lại vị trí các box theo chiều cao mới
        this.centerBoxesVertically();
        this.drawArray();    // Vẽ lại toàn bộ
    }    

    highlightBox(i, color = "orange") {
        if (!this.boxes[i]) return;
        this.boxes[i].backgroundColor = color;
        this.drawBox(this.boxes[i]);
    }

    async blinkBox(i, times = 2, color = "yellow", delay = 200) {
        if (!this.boxes[i]) return;
        const originalColor = this.boxes[i].backgroundColor;

        for (let t = 0; t < times; t++) {
            this.highlightBox(i, color);
            await this.sleep(delay);
            this.highlightBox(i, originalColor);
            await this.sleep(delay);
        }
    }

    // ============================================================================
    // 🎯 Con trỏ thao tác

    addPointer(i, label) {
        if (!this.boxes[i]) return;
        if (!this.boxes[i].pointers.includes(label)) {
            this.boxes[i].pointers.push(label);
        }
    }

    removePointer(i, label) {
        if (!this.boxes[i]) return;
        this.boxes[i].pointers = this.boxes[i].pointers.filter(l => l !== label);
    }

    removePointers(i, labels) {
        if (!this.boxes[i]) return;
        this.boxes[i].pointers = this.boxes[i].pointers.filter(l => !labels.includes(l));
    }

    clearAllPointers() {
        this.boxes.forEach(box => box.pointers = []);
    }

    // ============================================================================
    // 🧊 Canvas phụ & hộp giá trị tạm

    setTemp(value = null, color = "orange") {
        // ❗️Chỉ xóa tempBox nếu value là null (giá trị đặc biệt)
        if (value === null) {
            this.tempBox = null;
            return;
        }
    
        this.tempBox = {
            value: value,
            x: this.tempX,
            y: this.tempY,
            width: this.boxWidth,
            height: this.boxHeight,
            textColor: "#fff",
            backgroundColor: color
        };
    }

    drawTemp(ctx = this.tempCtx) {
        if (!this.tempBox || this.tempBox.value === null) return;
        const box = this.tempBox;
    
        // 🎨 Vẽ hộp tạm
        ctx.fillStyle = box.backgroundColor;
        ctx.fillRect(box.x, box.y, box.width, box.height);
    
        ctx.strokeStyle = "#000";
        ctx.lineWidth = 1;
        ctx.strokeRect(box.x, box.y, box.width, box.height);
    
        ctx.fillStyle = box.textColor;
        ctx.font = "20px Arial";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(box.value, box.x + box.width / 2, box.y + box.height / 2 + 2);
    
        // 🏷️ Vẽ chữ "Temp" phía trên hộp tạm
        ctx.fillStyle = "black";
        ctx.font = "20px Arial";
        ctx.textAlign = "center";
        ctx.textBaseline = "bottom";
        ctx.fillText("Temp", box.x + box.width / 2, box.y - 5);
    }    

    clear() {
        // ✨ Đồng bộ lại kích thước canvas với kích thước thực tế hiển thị
        this.canvas.width = this.canvas.clientWidth;
        this.canvas.height = this.canvas.clientHeight;
    
        // ✨ Đồng bộ canvas phụ
        this.resizeTempCanvas();
    
        // ✨ Xoá vùng vẽ
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }      

    clearTempCanvas() {
        this.tempCtx.clearRect(0, 0, this.tempCanvas.width, this.tempCanvas.height);
    }

    resizeTempCanvas() {
        if (!this.tempCanvas) return;
        this.tempCanvas.width = this.canvas.width;
        this.tempCanvas.height = this.canvas.height;
    }    

    // ============================================================================
    // ⏱️ Hỗ trợ hiệu ứng

    // Lấy tốc độ hoạt cảnh
    getAdjustedDuration(duration) {
        return duration / this.speedFactor;
    }    

    async sleep(ms) {
        ms = ms / this.speedFactor;
        const interval = 20;
        let elapsed = 0;
    
        while (elapsed < ms) {
            if (this.isStopped) return;
            while (this.isPaused) {
                await new Promise(r => setTimeout(r, 50)); // đợi khi tạm dừng
            }
            await new Promise(r => setTimeout(r, interval));
            elapsed += interval;
        }
    }

    easeInOutQuad(t) {
        return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
    }

    //===================================================================
    // Vẽ hộp phần tử chuyển động
    drawMovingBox(value, x, y, color = "orange", ctx = this.tempCtx) {
        ctx.fillStyle = color;
        ctx.fillRect(x, y, this.boxWidth, this.boxHeight);
    
        ctx.strokeStyle = "Black";
        ctx.lineWidth = 1;
        ctx.strokeRect(x, y, this.boxWidth, this.boxHeight);
    
        ctx.fillStyle = "White";
        ctx.font = "20px Arial";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(value, x + this.boxWidth / 2, y + this.boxHeight / 2 + 2);
    }
    
    // 🧠 Hoạt cảnh hoán đổi giá trị phần tử i với phần tử j có sử dụng biến temp
    async animateSwap(i, j, config = {}) {
        const {
            low = null,
            high = null,
            color = "Blue",
            duration = this.getAdjustedDuration(config.duration ?? 500),
        } = config;
    
        if (i < 0 || i >= this.size || j < 0 || j >= this.size || i === j) return;

        const baseDuration = this.getAdjustedDuration(config.duration ?? 500);
        const adjustedDuration = baseDuration / this.speedFactor;

        const baseFrames = 45;
        const frames = Math.max(10, Math.floor(baseFrames / this.speedFactor));  // ít khung hơn nếu chạy nhanh

        const xI = this.boxes[i].x;
        const xJ = this.boxes[j].x;
        const y = this.boxes[i].y;
        const tempX = this.tempX;
        const tempY = this.tempY;
    
        const valI = this.boxes[i].value;
        const valJ = this.boxes[j].value;
    
        this.setTemp("NULL"); // ban đầu để rỗng
   
        // --- Bước 1: i → Temp ---
        for (let f = 0; f <= frames; f++) {
            const t = this.easeInOutQuad(f / frames);
            const currX = xI + (tempX - xI) * t;
            const currY = y + (tempY - y) * t;
        
            this.tempCtx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            this.clear();
            this.drawArray(color, low, high);
            this.drawTemp();  // ✅ Vẽ tempBox cố định

            this.setMessageLine(4, `📤 Gán: Temp = A[${i}]`);
        
            // 🎯 Vẽ ô đang di chuyển (giá trị valI)
            this.drawMovingBox(valI, currX, currY, "orange");
        
            await this.sleep(adjustedDuration / frames);
        }
    
        this.setTemp(valI);
        this.drawTemp();
    
        // --- Bước 2: j → i ---
        for (let f = 0; f <= frames; f++) {
            const t = this.easeInOutQuad(f / frames);
            const currX = xJ + (xI - xJ) * t;  // Di chuyển ngang từ j đến i
            const currY = y;
        
            this.tempCtx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            this.clear();
            this.drawArray(color, low, high);
            this.drawTemp();  // 🎯 Vẫn vẽ hộp tạm cố định
            //this.drawLoopVariable("Vòng lặp ngoài, i = ", low, 1);
            //this.drawLoopVariable("Vòng lặp trong, j = ", i, 2);
            this.setMessageLine(4, `📤 Gán: A[${i}] = A[${j}]`);
        
            // 🔶 Vẽ giá trị j đang di chuyển tới i
            this.drawMovingBox(valJ, currX, currY, "cyan");
        
            await this.sleep(adjustedDuration / frames);
        }
    
        this.setValue(i, valJ);
    
        // --- Bước 3: Temp → j ---
        for (let f = 0; f <= frames; f++) {
            const t = this.easeInOutQuad(f / frames);
            const currX = tempX + (xJ - tempX) * t;
            const currY = tempY + (y - tempY) * t;
        
            this.tempCtx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            this.clear();
            this.drawArray(color, low, high);
            this.drawTemp();  // 🎯 Hộp temp vẫn hiển thị tại chỗ

            this.setMessageLine(4, `📤 Gán: A[${j}] = Temp`);
        
            // 🟠 Vẽ hộp đang di chuyển từ temp → j
            this.drawMovingBox(valI, currX, currY, "orange");
        
            await this.sleep(adjustedDuration / frames);
        }
    
        this.setValue(j, valI);
    
        // --- Kết thúc ---
        this.setTemp(null);
        this.clearTempCanvas();
        this.clear();
        this.drawArray(color, low, high);
    }
   
    //==========================================================
    // Hàm hiển thị biến điều khiển vòng lặp (i, j, min, pivot...) trực quan trên canvas chính
    drawLoopVariable(name, value, line = 1, ctx = this.ctx) {
        const text = `${name} = ${value}`;
        const lineHeight = 24;
    
        ctx.fillStyle = "black";
        ctx.font = "16px Arial";
        ctx.textAlign = "left";
        ctx.textBaseline = "top";
    
        const x = this.currentLoopX;
        const y = this.currentLoopY + (line - 1) * lineHeight;
    
        // 📌 Xoá vùng dòng hiện tại (tránh chồng)
        ctx.clearRect(x - 2, y - 2, 150, lineHeight);
        // ✏️ Vẽ nội dung mới
        ctx.fillText(text, x, y);
    }

    // Các tiện ích mở rộng để bạn quản lý vùng hiển thị biến vòng lặp (loop variable)
    // Đặt lại vị trí hiển thị mặc định cho các biến (thay cho this.currentLoopX, this.currentLoopY)
    setLoopVariablePosition(x, y) {
        this.currentLoopX = x;
        this.currentLoopY = y;
    }

    // Xóa vùng hiển thị biến (giúp bạn "làm sạch" trước khi vẽ biến mới)
    clearLoopVariableArea(width = 150, height = 30) {
        this.ctx.clearRect(this.currentLoopX - 5, this.currentLoopY - 20, width, height);
    }
    
}

    // ---------------Hết các hàm phụ trợ chuẩn hóa ------------------------
  
    //======================================================================
//     export class ArrayVisualizer {
//         constructor(canvasId, size = 10) {
//             this.canvas = document.getElementById(canvasId);
//             this.ctx = this.canvas.getContext("2d");
//             this.size = size;
//             this.elements = new Array(size).fill(null);
//             this.boxWidth = 80;
//             this.boxHeight = 40;
//             this.startX = 50;
//             this.startY = 100;
//             this.spacing = 10;
//             this.font = "20px Arial";
            
//             // Thêm thuộc tính lưu giá trị Temp và vòng lặp hiện tại
//             this.currentTemp = null;
//             this.tempX = 100;
//             this.tempY = 50;
//             this.currentLoop = null;
//             this.currentLoopX = 20;
//             this.currentLoopY = 30;
    
//             this.clear();
//         }
//     // Vẽ hộp (mảng) tại vị trí chỉ định
//     drawBox(index, value, highlightColor = "#ffffff", ctx = null) {
//         const context = ctx || this.ctx;  // Nếu có context truyền vào, sử dụng nó, nếu không dùng context chính.

//         const x = this.startX + index * (this.boxWidth + this.spacing);
//         const y = this.startY;

//         context.fillStyle = highlightColor;
//         context.strokeStyle = "#000";
//         context.lineWidth = 1;
//         context.fillRect(x, y, this.boxWidth, this.boxHeight);
//         context.strokeRect(x, y, this.boxWidth, this.boxHeight);

//         const fakeAddress = 1000 + index * 4;
//         context.fillStyle = "#888";
//         context.font = "16px monospace";
//         context.fillText(fakeAddress, x + this.boxWidth / 2 - 15, y - 5);

//         context.fillStyle = "white";
//         context.font = this.font;
//         if (value !== null) {
//             context.fillText(value, x + this.boxWidth / 2 -5 , y + this.boxHeight / 2 + 8);
//         }

//         context.fillStyle = "#000";
//         context.font = "16px Arial";
//         context.fillText(index, x + this.boxWidth / 2 - 5, y + this.boxHeight + 15);
//     }

//     //Vẽ mảng lên canvas
//     drawArray(color = null, l = null, h = null) {
//         this.clear();
//         for (let i = 0; i < this.size; i++) {
//             if(i === l) {
//                 this.drawBox(i, this.elements[i], "red"); // Vị trí Pivot
//             } else {
//                 // Vẽ vùng phân hoạch mầu color, vùng khác mầu xanh
//                 this.drawBox(i, this.elements[i], 
//                     (i > l && i <= h) ? color : "blue"); // Vùng phân hoạch
//             }
//         }

//         // Hiển thị loop count (Lặp lần thứ: ...)
//         if (this.currentLoop !== null) {
//             this.showLoopCount();
//         }

//         // Hiển thị Temp
//         if (this.currentTemp !== null) {
//             this.renderTemp();
//         }
//     }

//     // Xoá và khởi tạo lại canvas
//     clear() {
//         this.canvas.width = this.canvas.clientWidth;
//         this.canvas.height = this.canvas.clientHeight;

//         this.tempX = this.canvas.width/2 - this.boxWidth/2;
//         this.tempY = 50;
//         this.currentLoopY = this.tempY + this.boxHeight/2 + 7;
//         this.currentLoopX = 50;
        
//         this.startX = (this.canvas.width - (this.size * this.boxWidth + (this.size - 1) * this.spacing)) / 2;
//         this.startY = (this.canvas.height - this.boxHeight) / 2;
//         this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
//     }

//     // Cập nhật giá trị cho một phần tử trong mảng
//     setElement(index, value) {
//         if (index >= 0 && index < this.size) {
//             this.elements[index] = value;
//             this.drawArray();
//         }
//     }

//     // Thêm hàm setTemp để cập nhật Temp
//     setTemp(value){
//         this.currentTemp = value;
//     }

//     renderTemp() {
//         this.ctx.fillStyle = "orange";
//         this.ctx.fillRect(this.tempX, this.tempY, this.boxWidth, this.boxHeight);

//         this.ctx.strokeStyle = "black";
//         this.ctx.strokeRect(this.tempX, this.tempY, this.boxWidth, this.boxHeight);

//         this.ctx.fillStyle = "black";
//         this.ctx.font = "20px Arial";
//         this.ctx.textAlign = "center";
//         this.ctx.fillText(this.currentTemp, this.tempX + this.boxWidth/2, this.tempY + this.boxHeight/2 + 7);

//         this.ctx.fillStyle = "black";
//         this.ctx.font = "18px Arial";
//         this.ctx.fillText("Temp", this.tempX + this.boxWidth/2, this.tempY - 8);
//     }

//     // Thêm hàm setLoopCount để cập nhật số lần lặp
//     showLoopCount() {
//         // Hiển thị loop count (Lặp lần thứ: ...)
//         this.ctx.fillStyle = "black";
//         this.ctx.font = "18px Arial";
//         this.ctx.fillText(`Lặp lần thứ: ${this.currentLoop}`, this.currentLoopX, this.currentLoopY);
//     }

//     setLoopCount(value){
//         this.currentLoop = value;
//     }

//     easeInOutQuad(t) {
//         return t < 0.5
//             ? 2 * t * t
//             : -1 + (4 - 2 * t) * t;
//     }
//     // Hàm hoán đổi hai phần tử qua biến Temp (có hoạt ảnh)
// async animateSwapUnified(i, j, config = {}) {
//     const {
//         labelI = "I",
//         labelJ = "J",
//         drawK = null,
//         labelK = "K",
//         low = null,
//         high = null,
//         color = "blue",
//         duration = 500
//     } = config;

//     if (i < 0 || i >= this.size || j < 0 || j >= this.size || i === j) return;

//     const frames = 45;
//     const xI = this.startX + i * (this.boxWidth + this.spacing);
//     const xJ = this.startX + j * (this.boxWidth + this.spacing);
//     const y = this.startY;
//     const tempX = this.tempX;
//     const tempY = this.tempY;

//     const valI = this.elements[i];
//     const valJ = this.elements[j];

//     const tempCtx = this.createTempCanvas();
//     this.setTemp("null");

//     // Bước 1: i -> Temp
//     for (let f = 0; f <= frames; f++) {
//         const t = this.easeInOutQuad(f / frames);
//         const currX = xI + (tempX - xI) * t;
//         const currY = y + (tempY - y) * t;

//         tempCtx.clearRect(0, 0, this.canvas.width, this.canvas.height);
//         this.clear();
//         this.drawArray(color, low, high);
//         this.drawPointer(i, labelI, "red");
//         this.drawPointer(j, labelJ, "blue");
//         if (drawK !== null) this.drawPointer(drawK, labelK, "red");
//         this.drawBoxWithPosition(currX, currY, valI, "orange", true, tempCtx);
//         await this.sleep(duration / frames);
//     }

//     this.setTemp(valI);

//     // Bước 2: j -> i
//     for (let f = 0; f <= frames; f++) {
//         const t = this.easeInOutQuad(f / frames);
//         const currX = xJ + (xI - xJ) * t;

//         tempCtx.clearRect(0, 0, this.canvas.width, this.canvas.height);
//         this.clear();
//         this.drawArray(color, low, high);
//         this.drawPointer(i, labelI, "red");
//         this.drawPointer(j, labelJ, "blue");
//         if (drawK !== null) this.drawPointer(drawK, labelK, "red");
//         this.drawBoxWithPosition(currX, y, valJ, "cyan", true, tempCtx);
//         await this.sleep(duration / frames);
//     }

//     this.elements[i] = valJ;

//     // Bước 3: Temp -> j
//     for (let f = 0; f <= frames; f++) {
//         const t = this.easeInOutQuad(f / frames);
//         const currX = tempX + (xJ - tempX) * t;
//         const currY = tempY + (y - tempY) * t;

//         tempCtx.clearRect(0, 0, this.canvas.width, this.canvas.height);
//         this.clear();
//         this.drawArray(color, low, high);
//         this.drawPointer(i, labelI, "red");
//         this.drawPointer(j, labelJ, "blue");
//         if (drawK !== null) this.drawPointer(drawK, labelK, "red");
//         this.drawBoxWithPosition(currX, currY, valI, "orange", true, tempCtx);
//         await this.sleep(duration / frames);
//     }

//     this.elements[j] = valI;

//     this.setTemp(null);
//     this.removeTempCanvas();
//     this.clear();
//     this.drawArray(color, low, high);
//     this.drawPointer(i, labelI, "red");
//     this.drawPointer(j, labelJ, "blue");
//     if (drawK !== null) this.drawPointer(drawK, labelK, "red");
// }

// createTempCanvas() {
//     // Tạo canvas phụ
//     const tempCanvas = document.createElement("canvas");
//     tempCanvas.width = this.canvas.width;
//     tempCanvas.height = this.canvas.height;

//     // Định vị tuyệt đối, đè đúng vị trí canvas chính
//     tempCanvas.style.position = "absolute";
//     tempCanvas.style.left = this.canvas.offsetLeft + "px";
//     tempCanvas.style.top = this.canvas.offsetTop + "px";

//     // Đảm bảo canvas chính có z-index trước
//     this.canvas.style.position = "relative"; 
//     this.canvas.style.zIndex = "1"; 

//     // Canvas phụ có z-index cao hơn để đè lên
//     tempCanvas.style.zIndex = "10"; 

//     // Gán id để dễ xoá sau
//     tempCanvas.id = "tempCanvasOverlay";

//     // Thêm vào cùng cha
//     this.canvas.parentNode.appendChild(tempCanvas);

//     return tempCanvas.getContext("2d");
// }

// removeTempCanvas() {
//     const old = document.getElementById("tempCanvasOverlay");
//     if (old) old.remove();
// }
//     // Vẽ hộp với vị trí tùy chỉnh
// drawBoxWithPosition(x, y, value, color, highlight = false, ctx = this.ctx) {
//     ctx.fillStyle = color;
//     ctx.fillRect(x, y, this.boxWidth, this.boxHeight);

//     if (highlight) {
//         ctx.strokeStyle = "#000";
//         ctx.lineWidth = 3;
//         ctx.strokeRect(x, y, this.boxWidth, this.boxHeight);
//     }

//     ctx.fillStyle = "#fff";
//     ctx.font = "20px Arial";
//     ctx.textAlign = "center";
//     ctx.textBaseline = "middle";
//     ctx.fillText(value, x + this.boxWidth / 2, y + this.boxHeight / 2);
// }

// async blinkBox(index, times = 3, color = "rgba(255, 0, 0, 0.5)") {
//     for (let i = 0; i < times; i++) {
//         this.drawBox(index, this.elements[i], color); // tô màu
//         this.drawArray();
//         await this.sleep(200);

//         this.drawBox(index, this.elements[i], color); // xóa tô
//         this.drawArray();
//         await this.sleep(200);
//     }
// }

// clearBoxHighlight(index) {
//     const box = this.boxes[index];
//     if (!box) return;

//     const { x, y, width, height } = box;

//     // Vẽ lại phần nền trắng để xóa highlight
//     this.ctx.clearRect(x - 1, y - 1, width + 2, height + 2);

//     // Vẽ lại ô gốc không có màu nền
//     this.ctx.strokeStyle = "black";
//     this.ctx.strokeRect(x, y, width, height);

//     // Vẽ lại giá trị bên trong ô
//     const value = this.elements[index];
//     this.ctx.fillStyle = "black";
//     this.ctx.font = "16px Arial";
//     this.ctx.textAlign = "center";
//     this.ctx.textBaseline = "middle";
//     this.ctx.fillText(value, x + width / 2, y + height / 2);
// }

//     drawPointer(index, label, color = "red") {
//         const x = this.startX + index * (this.boxWidth + this.spacing) + this.boxWidth / 2;
//         const y = this.startY + this.boxHeight + 15;
    
//         const arrowHeight = 20;
//         const labelOffset = 15;
    
//         // Vẽ mũi tên quay lên
//         this.ctx.beginPath();
//         this.ctx.moveTo(x, y + 10);                 // Đáy mũi tên
//         this.ctx.lineTo(x, y + 10 + arrowHeight);   // Thân mũi tên
//         this.ctx.strokeStyle = color;
//         this.ctx.lineWidth = 2;
//         this.ctx.stroke();
    
//         // Vẽ đầu mũi tên (tam giác hướng lên)
//         this.ctx.beginPath();
//         this.ctx.moveTo(x - 5, y + 10 + arrowHeight - 5);
//         this.ctx.lineTo(x + 5, y + 10 + arrowHeight - 5);
//         this.ctx.lineTo(x, y + 10 + arrowHeight - 15);
//         this.ctx.fillStyle = color;
//         this.ctx.fill();
    
//         // Vẽ nhãn (label) phía dưới mũi tên
//         this.ctx.fillStyle = color;
//         this.ctx.font = "16px bold Arial";
//         this.ctx.textAlign = "center";
//         this.ctx.fillText(label, x, y + 10 + arrowHeight + labelOffset);
//     }

//     // Hàm hoãn (sleep)
//     sleep(ms) {
//         return new Promise(resolve => setTimeout(resolve, ms));
//     }

//     // Khởi tạo lại mảng với các giá trị mới
//     init(values = []) {
//         this.size = values.length;
//         this.elements = [...values];
//         this.drawArray();
//     }

// //___________________________________________________________________
// // Hàm vẽ một ô trên canvas.
// // Tham số tempCtx chỉ định vẽ trên canvas chính (mặc định) hoặc tempCanvas
// drawTempBox(x, y, val, color, tempCtx = this.ctx) {
//     tempCtx.fillStyle = color;
//     tempCtx.fillRect(x, y, this.boxWidth, this.boxHeight);
//     tempCtx.fillStyle = "black";
//     tempCtx.font = "20px Arial";
//     tempCtx.textAlign = "center";
//     tempCtx.textBaseline = "middle";
//     tempCtx.fillText(val, x + this.boxWidth / 2, y + this.boxHeight / 2);
// }

// // Hàm vẽ tĩnh mảng tạm trên canvas chính
// drawStaticTempArrays(leftArr, rightArr, tempY, highlightLeftIndex = -1, highlightRightIndex = -1) {
//     const n1 = leftArr.length;
//     leftArr.forEach((val, index) => {
//         const tempX = this.startX + index * (this.boxWidth + this.spacing);
//         this.drawBoxWithPosition(tempX, tempY, val, index === highlightLeftIndex ? "SandyBrown" : "Chocolate", true);
//     });
//     rightArr.forEach((val, index) => {
//         const tempX = this.startX + (n1 + index) * (this.boxWidth + this.spacing);
//         this.drawBoxWithPosition(tempX, tempY, val, index === highlightRightIndex ? "LimeGreen" : "SeaGreen", true);
//     });
// }

// // Hàm tô mầu đoạn phần tử trên mảng chính
// async highlightElements(low, high) {
//     this.clear();
//     for (let i = 0; i < this.size; i++) {
//         let color = (i >= low && i <= high) ? "SandyBrown" : "Blue";
//         this.drawBox(i, this.elements[i], color);
//    }
//    await this.sleep(500);
// }

// // Hàm vẽ mảng chính với màu phân biệt nửa trái, nửa phải và vùng ngoài
// drawMainArrayDivided(low, middle, high) {
//     for (let i = 0; i < this.size; i++) {
//          let color = "blue";
//         if (i >= low && i <= high) {
//             color = (i <= middle) ? "Chocolate" : "SeaGreen";
//         }
//         this.drawBox(i, this.elements[i], color);
//     }
// }

// async moveBoxToTemp(low, middle, high, tempCtx) { // ✅ Nhận tempCtx
//     const n1 = middle - low + 1;
//     const n2 = high - middle;

//     // Vị trí Y cho mảng tạm
//     const tempY = this.startY - this.boxHeight * 1.5 - this.spacing * 2;
//     const originalY = this.startY;

//     // Tạo mảng tạm
//     const left = new Array(n1);
//     const right = new Array(n2);

//     for (let i = 0; i < n1; i++) {
//         const originalX = this.startX + (low + i) * (this.boxWidth + this.spacing);
//         const targetTempXLeft = this.startX + i * (this.boxWidth + this.spacing);
//         const value = this.elements[low + i];
//         left[i] = value;

//         // Hoạt ảnh di chuyển lên và sang vị trí tạm (nửa trái) trên tempCanvas
//         for (let f = 0; f <= 30; f++) {
//             const t = this.easeInOutQuad(f / 30);
//             const currentY = originalY + (tempY - originalY) * t;
//             const currentX = originalX + (targetTempXLeft - originalX) * t;
//             tempCtx.clearRect(0, 0, this.canvas.width, this.canvas.height); // Xóa tempCanvas
//             this.drawTempBox(currentX, currentY, value, "SandyBrown", tempCtx);
//             await this.sleep(15);
//         }
//         // Vẽ lại toàn bộ canvas chính
//         this.clear();
//         this.drawMainArrayDivided(low, middle, high);
//         this.drawStaticTempArrays(left.slice(0, i + 1), right, tempY);
//         await this.sleep(100);
//     }

//     for (let j = 0; j < n2; j++) {
//         const originalX = this.startX + (middle + 1 + j) * (this.boxWidth + this.spacing);
//         const targetTempXRight = this.startX + (n1 + j) * (this.boxWidth + this.spacing);
//         const valueRight = this.elements[middle + 1 + j];
//         right[j] = valueRight;

//         // Hoạt ảnh di chuyển lên và sang vị trí tạm (nửa phải) trên tempCanvas
//         for (let f = 0; f <= 30; f++) {
//             const t = this.easeInOutQuad(f / 30);
//             const currentY = originalY + (tempY - originalY) * t;
//             const currentX = originalX + (targetTempXRight - originalX) * t;
//             tempCtx.clearRect(0, 0, this.canvas.width, this.canvas.height); // Xóa tempCanvas
//             this.drawTempBox(currentX, currentY, valueRight, "LimeGreen", tempCtx);
//             await this.sleep(15);
//         }
//         // Vẽ lại toàn bộ canvas chính
//         this.clear();
//         this.drawMainArrayDivided(low, middle, high);
//         this.drawStaticTempArrays(left, right.slice(0, j + 1), tempY);
//         await this.sleep(100);
//     }

//     return [...left, ...right];
// }

// async moveBoxToMain(low, middle, high, left, right, tempCtx) { // ✅ Nhận tempCtx
//     const n1 = middle - low + 1;
//     const n2 = high - middle;

//     // Vị trí Y cho mảng tạm
//     const tempY = this.startY - this.boxHeight * 1.5 - this.spacing * 2;
//     const originalY = this.startY;

//     // Tạo mảng tạm
//     // const left = new Array(n1);
//     // const right = new Array(n2);
    
//     let i = 0;
//     let j = 0;
//     let k = low;

//     while (i < n1 && j < n2) {
//         const tempLeftX = this.startX + i * (this.boxWidth + this.spacing);
//         const tempRightX = this.startX + (n1 + j) * (this.boxWidth + this.spacing);
//         const mainX = this.startX + k * (this.boxWidth + this.spacing);

//         let valueToCopy;
//         let sourceX;
//         let sourceY = tempY;
//         let targetX = mainX;
//         let targetY = originalY;
//         let color = "";

//         // Vẽ lại toàn bộ canvas chính trước khi highlight
//         this.clear();
//         this.drawMainArrayDivided(low, middle, high);
//         this.drawStaticTempArrays(left, right, tempY, i, j);
//         await this.sleep(300);

//         if (left[i] <= right[j]) {
//             valueToCopy = left[i];
//             sourceX = tempLeftX;
//             color = "SandyBrown";
//             i++;
//         } else {
//             valueToCopy = right[j];
//             sourceX = tempRightX;
//             color = "LimeGreen";
//             j++;
//         }

//         // Hoạt ảnh di chuyển từ mảng tạm về mảng chính trên tempCanvas
//         for (let f = 0; f <= 30; f++) {
//             const t = this.easeInOutQuad(f / 30);
//             const currentY = sourceY + (targetY - sourceY) * t;
//             const currentX = sourceX + (targetX - sourceX) * t;
//             tempCtx.clearRect(0, 0, this.canvas.width, this.canvas.height); // Xóa tempCanvas
//             this.drawTempBox(currentX, currentY, valueToCopy, color, tempCtx);
//             await this.sleep(15);
//         }
//         this.setElement(k, valueToCopy);
//         // Vẽ lại toàn bộ canvas chính
//         this.clear();
//         this.drawMainArrayDivided(low, middle, high);
//         this.drawStaticTempArrays(left, right, tempY);
//         await this.sleep(100);
//         k++;
//     }

//     while (i < n1) {
//         const tempLeftX = this.startX + i * (this.boxWidth + this.spacing);
//         const mainX = this.startX + k * (this.boxWidth + this.spacing);
//         const valueToCopyLeft = left[i];
//         const sourceY = tempY;
//         const targetY = originalY;

//         for (let f = 0; f <= 30; f++) {
//             const t = this.easeInOutQuad(f / 30);
//             const currentY = sourceY + (targetY - sourceY) * t;
//             const currentX = tempLeftX + (mainX - tempLeftX) * t;
//             tempCtx.clearRect(0, 0, this.canvas.width, this.canvas.height);
//             this.drawTempBox(currentX, currentY, valueToCopyLeft, "SandyBrown", tempCtx);
//             await this.sleep(15);
//         }
//         this.setElement(k, valueToCopyLeft);
//         // Vẽ lại toàn bộ canvas chính
//         this.clear();
//         this.drawMainArrayDivided(low, middle, high);
//         this.drawStaticTempArrays(left, right, tempY);
//         await this.sleep(100);
//         i++;
//         k++;
//     }

//     while (j < n2) {
//         const tempRightX = this.startX + (n1 + j) * (this.boxWidth + this.spacing);
//         const mainX = this.startX + k * (this.boxWidth + this.spacing);
//         const valueToCopyRight = right[j];
//         const sourceY = tempY;
//         const targetY = originalY;

//         for (let f = 0; f <= 30; f++) {
//             const t = this.easeInOutQuad(f / 30);
//             const currentY = sourceY + (targetY - sourceY) * t;
//             const currentX = tempRightX + (mainX - tempRightX) * t;
//             tempCtx.clearRect(0, 0, this.canvas.width, this.canvas.height);
//             this.drawTempBox(currentX, currentY, valueToCopyRight, "LimeGreen", tempCtx);
//             await this.sleep(15);
//         }
//         this.setElement(k, valueToCopyRight);
//         // Vẽ lại toàn bộ canvas chính
//         this.clear();
//         this.drawMainArrayDivided(low, middle, high);
//         this.drawStaticTempArrays(left, right, tempY);
//         await this.sleep(100);
//         j++;
//         k++;
//     }
// }

// }
