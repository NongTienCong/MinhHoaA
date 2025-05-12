// 📁 modules/stack.js
// Trình mô phỏng cấu trúc Stack cài đặt trên mảng
export class StackSimulator {
    constructor() {
        this.array = [];     // Mảng chứa các phần tử của Stack
        this.capacity = 0;   // Kích thước (số lượng phần tử tối đa)
        this.top = -1;       // Con trỏ chỉ đến phần tử đầu Stack

        this.boxWidth = 80;  // Chiều rộng ô (phần tử)
        this.boxHeight = 40; // Chiều cao ô (phần tử)
        this.gap = 10;       // Khoảng cách các ô

        // Khai báo sẵn để dùng chung
        // Định vị khu vực mô phỏng
        this.canvas = document.getElementById("simulation-canvas");
        // Đặt "ngữ cảnh vẽ" (drawing context) trên canvas là 2D
        this.ctx = this.canvas.getContext("2d");
    }

    // Khởi tạo Stack có kích thước size
    init(size) {
        this.capacity = size;   // Đặt kích thước = size
        this.top = -1;          // Đặt đỉnh Stack = -1 (chưa có phần tử nào)
        this.array = new Array(size).fill(null); // Tạo mảng có kích thước size
        this.draw();
    }

    // Đẩy value vào Stack
    push(value) {
        if (this.isFull()) return null;
        this.top++;
        this.array[this.top] = value;
        this.draw();
        return 1;
    }

    // Lấy ra phần từ đỉnh Stack
    pop() {
        if (this.isEmpty()) return null;
        let value = this.array[this.top];
        this.top--;
        this.draw();
        return value;
    }

    // Xem giá trị tại đỉnh Stack
    peek() {
        if (this.top === -1) return null;
        return this.array[this.top];
    }

    // Kiểm tra Stack rỗng
    isEmpty() {
        return this.top === -1;
    }

    // Kiểm tra Stack đầy
    isFull() {
        return this.top === this.capacity - 1;
    }

    // Xóa toàn bộ Stack
    clear() {
        this.top = -1;
        this.draw();
    }

    // Vẽ mô phỏng
    draw() {
        // Đặt kích thước vùng mô phỏng về kích thước chính xác để tránh co giãn
        this.canvas.width = this.canvas.clientWidth;
        this.canvas.height = this.canvas.clientHeight;
        const ctx = this.ctx;
        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      
        const baseX = this.canvas.width / 2;
        const startX = baseX - this.boxWidth/2;
        const startY = this.canvas.height - 100;
        const baseAddress = 1000; // Địa chỉ giả lập cơ sở

        ctx.font = "20px Arial";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";

        // Vị trí -1 (trước khi thêm phần tử đầu tiên)
        ctx.fillText("-1", startX + this.boxWidth + 20, startY + (this.boxHeight + this.gap) + this.boxHeight / 2);

        for (let i = 0; i < this.capacity; i++) {
            const x = startX;
            const y = startY - i * (this.boxHeight + this.gap);

            ctx.fillStyle = i <= this.top ? "#6c63ff" : "#ccc";
            ctx.strokeStyle = "#000";
            ctx.lineWidth = 1;
            ctx.fillRect(x, y, this.boxWidth, this.boxHeight);
            ctx.strokeRect(x, y, this.boxWidth, this.boxHeight);

            if (this.array[i] !== null) {
                ctx.fillStyle = i <= this.top ? "#fff" : "#444";
                ctx.fillText(this.array[i], x + this.boxWidth / 2, y + this.boxHeight / 2);
            }

            ctx.fillStyle = "#000";
            ctx.fillText(i.toString(), x + this.boxWidth + 20, y + this.boxHeight / 2);
            ctx.fillText((baseAddress + i*4).toString(), x - 40, y + this.boxHeight / 2);
        }

        // Vẽ mũi tên TOP
        const topY = this.top === -1 ? startY + (this.boxHeight + this.gap) + this.boxHeight / 2 : startY - this.top * (this.boxHeight + this.gap) + this.boxHeight / 2;
        ctx.beginPath();
        ctx.strokeStyle = "red";
        ctx.lineWidth = 1;
        ctx.moveTo(startX + this.boxWidth + 70, topY);
        ctx.lineTo(startX + this.boxWidth + 40, topY);
        ctx.lineTo(startX + this.boxWidth + 50, topY - 5);
        ctx.moveTo(startX + this.boxWidth + 40, topY);
        ctx.lineTo(startX + this.boxWidth + 50, topY + 5);
        ctx.stroke();
        ctx.fillStyle = "red";
        ctx.fillText("TOP", startX + this.boxWidth + 100, topY);
    }
}
