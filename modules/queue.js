// 📁 js/modules/queue.js
// Trình mô phỏng cấu trúc Queue cài đặt trên mảng
export class QueueSimulator {
    constructor() {
        this.array = [];
        this.capacity = 0;
        this.front = 0;
        this.rear = -1;
        this.size = 0;

        this.boxWidth = 80;  // Chiều rộng ô (phần tử)
        this.boxHeight = 40; // Chiều cao ô (phần tử)
        this.gap = 10;       // Khoảng cách các ô

        // Khai báo sẵn để dùng chung
        // Định vị khu vực mô phỏng
        this.canvas = document.getElementById("simulation-canvas");
        // Đặt "ngữ cảnh vẽ" (drawing context) trên canvas là 2D
        this.ctx = this.canvas.getContext("2d");
    }

    // Khởi tạo Queue với size phần tử
    init(size) {
        this.capacity = size;
        this.front = 0;
        this.rear = -1;
        this.size = 0;
        this.array = new Array(size).fill(null);
        this.draw(this.ctx);
    }

    // Thêm value vào phía sau Queue
    enqueue(value) {
        if (this.isFull()) return null;
        this.rear = (this.rear + 1) % this.capacity;
        this.array[this.rear] = value;
        this.size++;
        this.draw(this.ctx);
        return 1;
    }

    // Xóa phần tử phí trước Queue
    dequeue() {
        if (this.isEmpty()) return null;
        // Không xóa giá trị khỏi mảng, chỉ thay đổi con trỏ front
        let value = this.array[this.front];
        this.front = (this.front + 1) % this.capacity;
        this.size--;
        this.draw(this.ctx);
        return value;
    }

    // Xem giá trị phần tử phía trước Queue
    peek() {
        return this.isEmpty() ? null : this.array[this.front];
    }

    // Kiểm tra rỗng
    isEmpty() {
        return this.size === 0;
    }

    // Kiểm tra đầy
    isFull() {
        return this.size === this.capacity;
    }

    // Đặt các thành phần về giá trị khởi động
    clear() {
        this.front = 0;
        this.rear = -1;
        this.size = 0;
        this.draw(this.ctx);
    }

    // Vẽ Queue trên vùng mô phỏng
    draw(ctx) {
        // Đặt kích thước vùng mô phỏng về kích thước chính xác để tránh co giãn
        this.canvas.width = this.canvas.clientWidth;
        this.canvas.height = this.canvas.clientHeight;
        //const ctx = this.ctx;
        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      
        //const baseX = this.canvas.width / 2;
        const startX = 100;
        const startY = this.canvas.height/2 - this.boxHeight/2;
        const baseAddress = 1000; // Địa chỉ giả lập cơ sở

        ctx.font = "20px Arial";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";

        // Vẽ ô vị trí -1 (giả lập)
        const negX = startX - (this.boxWidth + this.gap);
        ctx.fillText("-1", negX + this.boxWidth / 2, startY + this.boxHeight + 18);

        // Vẽ các ô phần tử
        for (let i = 0; i < this.capacity; i++) {
            const x = startX + i * (this.boxWidth + this.gap);
            const y = startY;

            const isInsideQueue = (this.size > 0) && (
                (this.front <= this.rear && i >= this.front && i <= this.rear) ||
                (this.front > this.rear && (i >= this.front || i <= this.rear))
            );

            ctx.fillStyle = isInsideQueue ? "#6c63ff" : "#ccc";
            ctx.strokeStyle = "#000";
            ctx.fillRect(x, y, this.boxWidth, this.boxHeight);
            ctx.strokeRect(x, y, this.boxWidth, this.boxHeight);

            if (this.array[i] !== null) {
                ctx.fillStyle = isInsideQueue ? "#fff" : "#444";
                ctx.fillText(this.array[i], x + this.boxWidth / 2, y + this.boxHeight / 2);
            }

            ctx.fillStyle = "#000";
            ctx.fillText(i.toString(), x + this.boxWidth / 2, y + this.boxHeight + 18);
            ctx.fillText((baseAddress + i*4).toString(), x + this.boxWidth / 2, y - 15);
        }

        // Luôn vẽ con trỏ FRONT
        const frontX = startX + this.front * (this.boxWidth + this.gap);
        ctx.fillStyle = "green";
        ctx.fillText("FRONT", frontX + this.boxWidth / 2, startY - 40);

        // Con trỏ REAR
        const rearX = this.rear === -1 ? negX : startX + this.rear * (this.boxWidth + this.gap);
        ctx.fillStyle = "red";
        ctx.fillText("REAR", rearX + this.boxWidth / 2, startY + this.boxHeight + 40);
    }
}
