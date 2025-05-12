// 📁 modules/array.js
// Trình mô phỏng cấu trúc mảng
export class ArraySimulator {
    constructor() {
        this.array = [];
        this.size = 0;
        this.boxWidth = 80;
        this.boxHeight = 40;
        this.spacing = 10;
        this.addressBase = 1000;
    
        // Khai báo sẵn để dùng chung
        this.canvas = document.getElementById("simulation-canvas");
        this.ctx = this.canvas.getContext("2d");
    }

    init(size) {
        this.size = size;
        this.array = new Array(size).fill(null);
        this.render();
    }

    set(index, value) {
        if (index >= 0 && index < this.size) {
            this.array[index] = value;
            this.flash(index, 'set');
            this.render();
        }
    }

    get(index) {
        if (index >= 0 && index < this.size) {
            this.flash(index, 'get');
            return this.array[index];
        }
        return null;
    }

    // update(index, value) {
    //     if (index >= 0 && index < this.size) {
    //         this.array[index] = value;
    //         this.flash(index, 'update');
    //         this.render();
    //     }
    // }

    traverse(delay = 500) {
        let i = 0;
        const step = () => {
            if (i >= this.size) return;

            this.flash(i, 'traverse');
            setTimeout(() => {
                this.render();
                i++;
                setTimeout(step, delay);
            }, 300);
        };
        step();
    }

    clear() {
        this.array.fill(null);
        this.render();
    }

    render() {
        this.canvas.width = this.canvas.clientWidth;
        this.canvas.height = this.canvas.clientHeight;
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
        // 🟨 Căn giữa theo chiều ngang
        this.startX = (this.canvas.width - (this.size * this.boxWidth + (this.size - 1) * this.spacing)) / 2;
    
        // 🟩 Căn giữa theo chiều dọc
        this.startY = (this.canvas.height - this.boxHeight) / 2;
    
        for (let i = 0; i < this.size; i++) {
            const x = this.startX + i * (this.boxWidth + this.spacing);
    
            // Ô nền
            this.ctx.fillStyle = this.array[i] === null ? "#ccc" : "#0074cc";
            this.ctx.fillRect(x, this.startY, this.boxWidth, this.boxHeight);
    
            // Viền
            this.ctx.strokeStyle = "black";
            this.ctx.strokeRect(x, this.startY, this.boxWidth, this.boxHeight);
    
            // Giá trị
            this.ctx.fillStyle = "white";
            this.ctx.font = "20px Arial";
            this.ctx.textAlign = "center";
            this.ctx.fillText(
                // this.array[i] !== null ? this.array[i] : "NULL",
                // x + this.boxWidth / 2,
                // this.startY + this.boxHeight / 2 + 8
                this.array[i] !== null ? this.array[i] : "",
                x + this.boxWidth / 2,
                this.startY + this.boxHeight / 2 + 8
            );
    
            // Chỉ số dưới ô
            this.ctx.fillStyle = "black";
            this.ctx.font = "15px Arial";
            this.ctx.fillText(i, x + this.boxWidth / 2, this.startY + this.boxHeight + 20);
    
            // Địa chỉ giả lập trên ô
            this.ctx.fillText(this.addressBase + i * 4, x + this.boxWidth / 2, this.startY - 10);
        }
    }

    flash(index, type) {
        const x = this.startX + index * (this.boxWidth + this.spacing);
        const y = this.startY;
    
        let color = "yellow";
        if (type === 'set') color = "#0074cc";
        if (type === 'update') color = "orange";
        if (type === 'get') color = "lime";
        if (type === 'traverse') color = "violet";
    
        this.ctx.save();
        this.ctx.fillStyle = color;
        this.ctx.fillRect(x, y, this.boxWidth, this.boxHeight);
        this.ctx.restore();
    
        setTimeout(() => this.render(), 300);
    }
}
