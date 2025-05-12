// 📁 modules/sort.js
// Trình mô phỏng thuật toán sắp xếp sử dụng ArrayVisualizer
import { ArrayVisualizer } from "./array-visualization.js"; // 👈 Import lớp ArrayVisualizer đã viết

export class SortSimulator {
    constructor() {
        this.visualizer = null;
        this.size = 0;
    }

    init(values = []) {
        this.size = values.length;

        // 🎨 Khởi tạo visualizer với số phần tử
        this.visualizer = new ArrayVisualizer('simulation-canvas', this.size);

        // 📦 Cập nhật toàn bộ mảng bằng 1 lệnh
        this.visualizer.setArray(values);
    }

    // 🫧 Bubble Sort với hiệu ứng Temp sử dụng ArrayVisualizer
    async bubbleSort() {
        const v = this.visualizer;
        v.resetControlFlags(); // 🧼 Reset các cờ tạm dừng/dừng
        let n = this.size;
        // Tô mầu đoạn sắp xếp
        v.setColorRange(0, n-1, "SeaGreen");
        for (let i = 0; i < n - 1; i++) {
            // Tô mầu phần tử thứ i
            v.setColor(i, "Blue");
            for (let j = n - 1; j > i; j--) {
                v.clear();
    
                // 🌀 Cập nhật biến vòng lặp
                v.setMessage([
                    `🔁 Vòng lặp ngoài, i = ${i}`,
                    `🔁 Vòng lặp trong, j = ${j}`,
                    `💬 So sánh A[${j - 1}] = ${v.getValue(j-1)} và A[${j}] = ${v.getValue(j)}`
                ]);    
                // 👉 Gán con trỏ
                v.clearAllPointers();
                v.addPointer(i, "I");
                v.addPointer(j, "J");
                v.addPointer(j - 1, "J-1");
    
                v.drawArray();
                await v.sleep(300);
    
                // So sánh và hoán đổi nếu cần
                if (v.getValue(j) < v.getValue(j - 1)) {
                    // Hoạt cảnh hoán đổi
                    this.visualizer.setMessageLine(3, `🔄 Hoán đổi vì ${v.getValue(j-1)} < ${v.getValue(j)} → false`);
                    await v.animateSwap(j, j - 1, {
                        low: i,
                        high: n - 1,
                        color: "orange"
                    });

                    await v.sleep(200);
                } else {
                    v.setMessageLine(3, `✅ Không cần hoán đổi`);
                    v.sleep(300);
                }
            }
        }
    
        // 🎯 Kết thúc
        v.setColor(n-1, "Blue");
        v.clearAllPointers();
        v.clear();
        v.drawArray();
    }

    // Selection Sort với hiệu ứng Temp sử dụng ArrayVisualizer 
    async selectionSort() {
        const v = this.visualizer;
        v.resetControlFlags(); // 🧼 Reset các cờ tạm dừng/dừng
        const n = this.size;
        // Tô mầu đoạn sắp xếp
        v.setColorRange(0, n-1, "SeaGreen");
    
        for (let i = 0; i < n - 1; i++) {
            let minIdx = i;
            // Tô mầu phần tử thứ i
            v.setColor(i, "Blue");

            // 🎯 Đặt con trỏ
            v.clearAllPointers();
            v.addPointer(i, "I");
            v.addPointer(minIdx, "Min");
    
            for (let j = i + 1; j < n; j++) {
                const a = v.getValue(j);
                const b = v.getValue(minIdx);

                v.addPointer(j, "J");
                v.clear();
                v.drawArray();
                // 🌀 Hiển thị thông báo vòng lặp và so sánh
                v.setMessage([
                    `🔁 Vòng lặp ngoài, i = ${i}`,
                    `🔁 Vòng lặp trong, j = ${j}`,
                    `💬 So sánh A[${j}] = ${a} với A[min = ${minIdx}] = ${b}`
                ]);

                await v.sleep(300);
    
                if (a < b) {
                    v.removePointer(minIdx, "Min")
                    minIdx = j;
                    v.addPointer(minIdx, "Min");
                    v.clear();
                    v.drawArray();
                    v.setMessageLine(3, `✅ Cập nhật min thành vị trí ${minIdx}`);
                    await v.sleep(300);
                } else {
                    v.setMessageLine(3, `❎ Không cập nhật min`);
                    await v.sleep(200);
                }
                v.removePointer(j, "J");
            }
    
            // ⚡ Sau vòng j, nếu minIdx thay đổi → swap
            if (minIdx !== i) {
                const valI = v.getValue(i);
                const valMin = v.getValue(minIdx);
    
                v.setMessageLine(3, `🔄 Hoán đổi A[${i}] = ${valI} với A[${minIdx}] = ${valMin}`);
    
                await v.animateSwap(i, minIdx, {
                    low: i,
                    high: n - 1,
                    color: "orange"
                });
    
                await v.sleep(300);
            } else {
                v.setMessageLine(3, `✅ Không cần hoán đổi`);
                await v.sleep(300);
            }
        }
    
        // 🎯 Kết thúc
        v.setColor(n-1, "Blue");
        v.clearAllPointers();
        v.clear();
        v.drawArray();
    }
    
    // Insertion Sort với hiệu ứng Temp sử dụng ArrayVisualizer
    async insertionSort() {
        const v = this.visualizer;
        v.resetControlFlags(); // 🧼 Reset các cờ tạm dừng/dừng
        const n = this.size;
        // Tô mầu đoạn sắp xếp
        v.setColorRange(0, n-1, "SeaGreen");
    
        for (let i = 1; i < n; i++) {
            let j = i;
            v.clear();
            // Tô mầu phần tử thứ j-1
            v.setColor(i, "SandyBrown");
            v.setColor(j-1, "Blue");
    
            const currVal = v.getValue(j);
    
            v.setMessage([
                `🔁 i = ${i}, bắt đầu chèn A[${i}] = ${currVal} vào đoạn đã sắp xếp`,
                `↪️ So sánh và hoán đổi nếu cần trong đoạn A[0...${i}]`
            ]);
    
            v.clearAllPointers();
            v.addPointer(i, "I");
            v.addPointer(j, "J");
            v.addPointer(j - 1, "J-1");
            v.drawArray();
    
            await v.sleep(400);
    
            while (j > 0 && v.getValue(j) < v.getValue(j - 1)) {
                v.clear();
                const a = v.getValue(j);
                const b = v.getValue(j - 1);
    
                v.setMessageLine(2, `💬 So sánh A[${j}] = ${a} < A[${j - 1}] = ${b} → Hoán đổi`);
    
                v.clearAllPointers();
                v.addPointer(i, "I");
                v.addPointer(j, "J");
                v.addPointer(j - 1, "J-1");
                v.drawArray();
    
                await v.animateSwap(j, j - 1, {
                    low: 0,
                    high: i,
                    color: "orange"
                });
    
                j--;
    
                await v.sleep(200);
            }
    
            if (j === i) {
                v.setMessageLine(2, `✅ A[${i}] đã đúng vị trí, không cần hoán đổi`);
                await v.sleep(300);
            }
        }
    
        // 🎯 Kết thúc
        v.setColor(n-1, "Blue");
        v.clearAllPointers();
        v.clear();
        v.drawArray();
    }

    // Quick Sort
    async quickSort(low = 0, high = this.size - 1) {
        if (low === 0 && high === this.size - 1) {
            this.visualizer.resetControlFlags(); // 🧼 reset nếu gọi lần đầu
        }
    
        if (low < high) {
            // 🧭 Hiển thị vùng phân hoạch
            this.visualizer.clearAllPointers();
            this.visualizer.addPointer(low, "Low");
            this.visualizer.addPointer(high, "High");
    
            this.visualizer.clear();
            this.visualizer.setColorRange(low, high, "Teal");
            this.visualizer.drawArray();
            this.visualizer.setMessage([
                `📌 QuickSort đoạn [${low}...${high}]`
            ]);
            await this.visualizer.sleep(400);
    
            const pivotIdx = await this.partition(low, high);
    
            await this.quickSort(low, pivotIdx - 1);
            await this.quickSort(pivotIdx + 1, high);
        }
    
        if (low === 0 && high === this.size - 1) {
            this.visualizer.clearAllPointers();
            this.visualizer.setColorRange(low, high, "Blue");
            this.visualizer.clear();
            this.visualizer.drawArray();
        }
    }
    
    async partition(low, high) {
        const v = this.visualizer;
        const pivotVal = v.getValue(low);
        let left = low + 1;
        let right = high;
    
        v.setMessage([
            `🔻 Chia đoạn [${low}...${high}]`,
            `🎯 Chọn pivot = A[${low}] = ${pivotVal}`
        ]);
    
        // 🎯 Vẽ ban đầu
        this.drawPartitionPointers(v, low, high, left, right);
        await v.sleep(500);
    
        while (left <= right) {
            while (left <= right && v.getValue(left) <= pivotVal) {
                left++;
            }
    
            while (left <= right && v.getValue(right) >= pivotVal) {
                right--;
            }

            this.drawPartitionPointers(v, low, high, left, right);
            await v.sleep(400);
    
            if (left < right) {
                v.setMessageLine(2, `🔄 Hoán đổi A[${left}] = ${v.getValue(left)} ↔ A[${right}] = ${v.getValue(right)}`);
                await v.animateSwap(left, right, {
                    low,
                    high,
                    color: "teal"
                });
                left++;
                right--;
                this.drawPartitionPointers(v, low, high, left, right);
                await v.sleep(400);
            }
    
            await v.sleep(300);
        }
    
        if (low < right) {
            v.setMessageLine(2, `🔄 Đưa pivot về đúng vị trí: A[${low}] ↔ A[${right}]`);
            await v.animateSwap(low, right, {
                low,
                high,
                color: "teal"
            });
            await v.sleep(300);
        }
    
        v.setMessageLine(2, `✅ Pivot A[${right}] đã ổn định tại vị trí ${right}`);
        v.setMessageLine(3, `✅ Sắp xếp xong đoạn A[${low}, ${high}]`);
    
        v.clearAllPointers();
        v.addPointer(right, "Pivot");
        v.clear();
        v.setColorRange(low, high, "Blue");
        v.drawArray();
        v.drawMessages();
        await v.sleep(1000);
    
        return right;
    }

    drawPartitionPointers(v, low, high, left, right) {
        v.clearAllPointers();
        v.addPointer(low, "Pivot");
        v.addPointer(low, "Low");
        v.addPointer(high, "High");
        if (left < this.size) v.addPointer(left, "L");
        if (right >= 0) v.addPointer(right, "R");
        v.clear();
        v.setColorRange(low, high, "Teal");
        v.drawArray();
        v.drawMessages();
    }

    async mergeSort() {
        this.visualizer.resetControlFlags(); // 🔄 Reset trạng thái tạm dừng/dừng
        const tempCtx = this.visualizer.tempCtx; // Dùng canvas phụ có sẵn

        this.originalY = this.visualizer.startY; // ✅ Khởi tạo originalY ở đây
        await this.mergeSortHelper(0, this.size - 1, tempCtx, this.originalY); // Truyền originalY

        // 🧹 Sau khi hoàn tất, vẽ lại mảng
        this.visualizer.clearAllPointers();
        this.visualizer.setColorRange(0, this.size - 1, "Blue");
        this.visualizer.clear();
        this.visualizer.drawArray();
    }

    async mergeSortHelper(low, high, tempCtx, originalY) { // ✅ Thêm originalY vào tham số
        const v = this.visualizer;
        const offsetY = 10;

        // 💡 Highlight đoạn đang xử lý
        v.setMessage([`🔁 Phân chia đoạn [${low}...${high}]`]);
        v.clearAllPointers();
        v.addPointer(low, "Low");
        v.addPointer(high, "High");

        // 📌 Tô mầu phân đoạn hiện tại
        // Thay đổi tầm cao của phân đoạn hiện tại
        for(let i = low; i <= high; i++) {
            v.updateBoxPosition(i, v.boxes[i].x, originalY);
        }
        v.setColorRange(low, high, "SeaGreen");
        v.clear();
        v.drawArray();
        v.drawMessages();
        await v.sleep(400);

        if (low < high) {
            const mid = Math.floor((low + high) / 2);
            await this.mergeSortHelper(low, mid, tempCtx, originalY + offsetY); // Truyền offsetY
            await v.sleep(400);
            await this.mergeSortHelper(mid + 1, high, tempCtx, originalY+ offsetY);
            await v.sleep(400);
            await this.merge(low, mid, high, tempCtx, offsetY);
        }

    }

    async merge(low, mid, high, tempCtx, offsetY) { // ✅ Thêm originalY
        const v = this.visualizer;
        const n1 = mid - low + 1;
        const n2 = high - mid;
    
        const tempY = v.startY - 3 * v.boxHeight;
    
        v.clearAllPointers();
        v.addPointer(low, "Low");
        v.addPointer(mid, "Mid");
        v.addPointer(high, "High");
    
        v.setMessage([
            `🔄 Gộp đoạn [${low}...${mid}] và [${mid + 1}...${high}]`,
            `📤 Di chuyển sang mảng tạm...`
        ]);
        v.clear();
        v.setColorRange(low, mid, "Peru");
        v.setColorRange(mid + 1, high, "LightSeaGreen");
        v.drawArray();
        await v.sleep(500);
    
        const left = [], right = [];
    
        // 📤 Di chuyển sang vùng tạm - mảng trái
        for (let i = 0; i < n1; i++) {
            const val = v.getValue(low + i);
            const fromX = v.boxes[low + i].x;
            const fromY = v.boxes[low + i].y;
            const toX = v.startX + i * (v.boxWidth + v.spacing);
            const toY = tempY;
    
            for (let f = 0; f <= 30; f++) {
                const t = f / 30;
                const currX = fromX + (toX - fromX) * t;
                const currY = fromY + (toY - fromY) * t;
    
                v.clearTempCanvas();
                v.drawMessages();
                drawStaticTempArrays(i - 1, -1);
                v.drawMovingBox(val, currX, currY, "SandyBrown", tempCtx);
                await v.sleep(10);
            }
    
            left[i] = val;
            await v.sleep(100);
        }
    
        // 📤 Mảng phải
        for (let j = 0; j < n2; j++) {
            const val = v.getValue(mid + 1 + j);
            const fromX = v.boxes[mid + 1 + j].x;
            const fromY = v.boxes[mid + 1 + j].y;
            const toX = v.startX + (n1 + j) * (v.boxWidth + v.spacing);
            const toY = tempY;
    
            for (let f = 0; f <= 30; f++) {
                const t = f / 30;
                const currX = fromX + (toX - fromX) * t;
                const currY = fromY + (toY - fromY) * t;
    
                v.clearTempCanvas();
                v.drawMessages();
                drawStaticTempArrays(n1 - 1, j - 1);
                v.drawMovingBox(val, currX, currY, "LimeGreen", tempCtx);
                await v.sleep(10);
            }
    
            right[j] = val;
            await v.sleep(100);
        }
    
        // 🌟 Giai đoạn 2: Trộn về mảng chính
        v.setMessage([
            `🔄 Gộp đoạn [${low}...${mid}] và [${mid + 1}...${high}]`,
            `📥 Di chuyển từ mảng tạm về...`
        ]);

        let i = 0, j = 0;
        for (let k = low; k <= high; k++) {
            let val, fromX, color;
    
            v.drawMessages();
            drawStaticTempArrays(i, j);
            await v.sleep(300);
    
            if (i < left.length && (j >= right.length || left[i] <= right[j])) {
                val = left[i];
                fromX = v.startX + i * (v.boxWidth + v.spacing);
                color = "SandyBrown";
                i++;
            } else {
                val = right[j];
                fromX = v.startX + (left.length + j) * (v.boxWidth + v.spacing);
                color = "LimeGreen";
                j++;
            }
    
            const toX = v.boxes[k].x;
            const toY = v.boxes[k].y;
                
            for (let f = 0; f <= 30; f++) {
                const t = f / 30;
                const currX = fromX + (toX - fromX) * t;
                const currY = tempY + (toY - tempY) * t;
    
                v.clearTempCanvas();
                v.drawMessages();
                drawStaticTempArrays(i, j);
                v.drawMovingBox(val, currX, currY, color, tempCtx);
                await v.sleep(10);
            }
    
            v.setValue(k, val);
            await v.sleep(100);
        }
    
        // ✅ Kết thúc
        for(let i = low; i <= high; i++) {
            v.updateBoxPosition(i, v.boxes[i].x, v.boxes[i].y -= offsetY);
        }
        v.clear();
        v.drawArray();
        v.setMessageLine(2, `✅ Đã gộp xong đoạn [${low}...${high}]`);
        v.drawMessages();
        await v.sleep(400);
    
        // 🔧 Hàm nội bộ vẽ mảng tạm
        function drawStaticTempArrays(iHighlight = -1, jHighlight = -1) {
            const spacing = v.spacing;
            const w = v.boxWidth;
            const h = v.boxHeight;
    
            for (let i = 0; i < left.length; i++) {
                const x = v.startX + i * (w + spacing);
                const y = tempY;
                const color = (i === iHighlight) ? "Peru" : "SandyBrown";
                v.drawMovingBox(left[i], x, y, color, tempCtx);
            }
    
            for (let j = 0; j < right.length; j++) {
                const x = v.startX + (left.length + j) * (w + spacing);
                const y = tempY;
                const color = (j === jHighlight) ? "Green" : "LimeGreen";
                v.drawMovingBox(right[j], x, y, color, tempCtx);
            }
        }
    }
    

}

// import { ArrayVisualizer } from "./array-visualization.js"; // 👈 Import lớp ArrayVisualizer đã viết

// export class SortSimulator {
//     constructor() {
//         this.array = [];
//         this.size = 0;
//         this.visualizer = new ArrayVisualizer("simulation-canvas"); // 📦 Sử dụng visualizer để thao tác canvas
//     }

//     init(values = []) {
//         this.array = [...values]; // 🌟 Tạo bản sao mảng đầu vào
//         this.size = this.array.length;
//         // 🎨 Khởi tạo visualizer với mảng
//         this.visualizer = new ArrayVisualizer('simulation-canvas', values.length);
//         // Cập nhật giá trị cho từng phần tử trong mảng
//         for (let i = 0; i < values.length; i++) {
//           this.visualizer.setElement(i, values[i]);
//         }
//     }

// // 🫧 Bubble Sort với hiệu ứng Temp sử dụng ArrayVisualizer
// async bubbleSort() {
//     let n = this.size;

//     // Vòng lặp chính của thuật toán Bubble Sort
//     for (let i = 0; i < n - 1; i++) {
//         // Cập nhật số lần lặp và vẽ lại mảng
//         this.visualizer.setLoopCount(i + 1); // Cập nhật số lần lặp
//         this.visualizer.drawArray(); // Vẽ mảng

//         // Vòng lặp con thực hiện so sánh và hoán đổi
//         for (let j = n - 1; j > i; j--) {
//             // Vẽ mảng + chỉ số j và j-1
//             this.visualizer.drawArray();
//             this.visualizer.drawPointer(i, "I", "red"); // Vẽ chỉ số i
//             this.visualizer.drawPointer(j, "J", "red"); // Vẽ chỉ số j
//             this.visualizer.drawPointer(j - 1, "J-1", "blue"); // Vẽ chỉ số j-1
//             await this.visualizer.sleep(300); // Dừng lại một chút để người dùng có thể thấy

//             // So sánh và hoán đổi nếu cần
//             if (this.visualizer.elements[j] < this.visualizer.elements[j - 1]) {
//                 await this.visualizer.animateSwapUnified(j, j - 1, {
//                     labelI: "J",
//                     labelJ: "J-1",
//                     drawK: i,
//                     labelK: "I",
//                     color: "blue"
//                 });
//             }
//         }
//     }

//     // Sau khi hoàn thành sắp xếp, vẽ lại mảng đã sắp xếp
//     this.visualizer.drawArray();
// }

// // Hàm sắp xếp chọn trực tiếp có hoạt ảnh
// async selectionSort() {
//     let n = this.size;

//     for (let i = 0; i < n - 1; i++) {
//         let minIndex = i;

//         // Cập nhật vòng lặp và hiển thị mảng hiện tại
//         this.visualizer.setLoopCount(i + 1);
//         this.visualizer.clear();
//         this.visualizer.drawArray();
//         this.visualizer.drawPointer(i, "I", "red");
//         this.visualizer.drawPointer(minIndex, "min", "blue");
//         await this.visualizer.sleep(300);

//         for (let j = i + 1; j < n; j++) {
//             // Hiển thị con trỏ hiện tại
//             this.visualizer.clear();
//             this.visualizer.drawArray();
//             this.visualizer.drawPointer(i, "I", "red");
//             this.visualizer.drawPointer(minIndex, "min", "blue");
//             this.visualizer.drawPointer(j, "J", "green");
//             await this.visualizer.sleep(300);

//             if (this.visualizer.elements[j] < this.visualizer.elements[minIndex]) {
//                 minIndex = j;

//                 // Vẽ lại để cập nhật min mới
//                 this.visualizer.clear();
//                 this.visualizer.drawArray();
//                 this.visualizer.drawPointer(i, "I", "red");
//                 this.visualizer.drawPointer(minIndex, "min", "blue");
//                 this.visualizer.drawPointer(j, "J", "green");
//                 await this.visualizer.sleep(300);
//             }
//         }

//         // Thực hiện hoán đổi nếu cần
//         if (minIndex !== i) {
//             await this.visualizer.animateSwapUnified(i, minIndex, {
//                 labelI: "I",
//                 labelJ: "min",
//                 color: "blue"
//             });
//         }

//         // Hiển thị sau mỗi vòng lặp i
//         this.visualizer.clear();
//         this.visualizer.drawArray();
//         this.visualizer.drawPointer(i, "I", "red");
//         await this.visualizer.sleep(300);
//     }
//     // Sau khi hoàn thành sắp xếp, vẽ lại mảng đã sắp xếp
//     this.visualizer.drawArray();
// }

// // Hàm sắp xếp chèn trực tiếp có hoạt ảnh
// async insertionSort() {
//     let n = this.size;

//     for (let i = 1; i < n; i++) {
//         let j = i;

//         // Cập nhật số vòng lặp và hiển thị mảng ban đầu
//         this.visualizer.setLoopCount(i);
//         this.visualizer.drawArray();
//         this.visualizer.drawPointer(i, "I", "red");
//         await this.visualizer.sleep(300);

//         // Lặp ngược và hoán đổi nếu cần
//         while (j > 0 && this.visualizer.elements[j] < this.visualizer.elements[j - 1]) {
//             // Vẽ mảng và con trỏ i, j, j-1
//             this.visualizer.drawArray();
//             this.visualizer.drawPointer(i, "I", "red");         // Vị trí ban đầu đang xét
//             this.visualizer.drawPointer(j, "J", "green");       // Phần tử đang xét
//             this.visualizer.drawPointer(j - 1, "J-1", "blue");  // Phần tử phía trước
//             await this.visualizer.sleep(300);

//             await this.visualizer.animateSwapUnified(j, j - 1, {
//                 labelI: "J",
//                 labelJ: "J-1",
//                 drawK: i,
//                 labelK: "I",
//                 color: "blue"
//             });

//             j--; // Dịch ngược để tiếp tục chèn
//         }

//         // Vẽ lại sau mỗi vòng lặp i
//         this.visualizer.drawArray();
//         this.visualizer.drawPointer(i, "I", "red");
//         await this.visualizer.sleep(300);
//     }

//     // Vẽ lại mảng hoàn chỉnh sau khi sắp xếp
//     this.visualizer.drawArray();
// }

// // Hàm sắp xếp nhanh có hoạt ảnh
// async quickSort(low = 0, high = this.size - 1) {
//     if (low < high) {
//         // Vẽ lại mảng
//         this.visualizer.clear();
//         this.visualizer.drawArray();
//         await this.visualizer.sleep(500);

//         // Gọi phân hoạch
//         const pi = await this.partition(low, high);

//         // Đệ quy tiếp
//         await this.quickSort(low, pi - 1);
//         await this.quickSort(pi + 1, high);
//     } 

// }


// // Hàm partition() – pivot là phần tử đầu
// async partition(low, high) {
//     let pivot = this.visualizer.elements[low];
//     let left = low + 1;
//     let right = high;

//     while (left <= right) {
//         // Highlight toàn vùng + Pivot màu đỏ
//         this.visualizer.clear();
//         this.visualizer.drawArray("teal", low, high);

//         this.visualizer.drawPointer(left, "L", "blue");
//         this.visualizer.drawPointer(right, "R", "red");
//         await this.visualizer.sleep(500);

//         while (left <= right && this.visualizer.elements[left] < pivot) {
//             left++;
//             this.visualizer.clear();
//             this.visualizer.drawArray("teal", low, high);
//             this.visualizer.drawPointer(left, "L", "blue");
//             this.visualizer.drawPointer(right, "R", "red");
//             await this.visualizer.sleep(500);
//         }

//         while (left <= right && this.visualizer.elements[right] >= pivot) {
//             right--;
//             this.visualizer.clear();
//             this.visualizer.drawArray("teal", low, high);
//             this.visualizer.drawPointer(left, "L", "blue");
//             this.visualizer.drawPointer(right, "R", "red");
//             await this.visualizer.sleep(500);
//         }

//         if (left < right) {
//             await this.visualizer.animateSwapUnified(left, right, {
//                 labelI: "L",
//                 labelJ: "R",
//                 color: "teal",
//                 low,
//                 high
//             });
//             left++;
//             right--;
//         }
//         await this.visualizer.sleep(500);
//     }

//     if (low < right) {
//         await this.visualizer.animateSwapUnified(low, right, {
//             labelI: "Pivot",
//             labelJ: "R",
//             color: "teal",
//             low,
//             high
//         });
//     }
//     await this.visualizer.sleep(500);

//     this.visualizer.clear();
//     this.visualizer.drawArray();

//     return right;
// }

// // Sắp xếp trộn
// async mergeSort() {
//     const tempCtx = this.visualizer.createTempCanvas(); // Tạo tempCanvas

//     await this.mergeSortHelper(0, this.size - 1, tempCtx);
    
//     this.visualizer.removeTempCanvas(tempCtx); // Xóa tempCanvas

//     this.visualizer.drawArray(); // Vẽ lại mảng đã sắp xếp
// }

// async mergeSortHelper(low, high, tempCtx) {
//     // Tô màu đoạn phân chia
//     await this.visualizer.highlightElements(low, high);

//     if (low < high) {
//         const middle = Math.floor((low + high) / 2);

//         // Gọi đệ quy để chia nửa bên trái
//         await this.mergeSortHelper(low, middle, tempCtx);

//         // Gọi đệ quy để chia nửa bên phải
//         await this.mergeSortHelper(middle + 1, high, tempCtx);

//         // Thực hiện trộn
//         await this.merge(low, middle, high, tempCtx);
//     }
// }

// async merge(low, middle, high, tempCtx) {
//     const elementsOfLeft = middle - low + 1;

//     // Vẽ mảng chính lần đầu
//     this.visualizer.clear();
//     this.visualizer.drawMainArrayDivided(low, middle, high);

//     // --- Giai đoạn 1: Sao chép vào mảng tạm với hoạt ảnh ---
//     const tempArr = await this.visualizer.moveBoxToTemp(low, middle, high, tempCtx);
//     // Tách mảng tạm thành hai nửa: bên trái, bên phải
//     const left = tempArr.slice(0, elementsOfLeft);
//     const right = tempArr.slice(elementsOfLeft, tempArr.length);

//     // --- Giai đoạn 2: Trộn và sao chép về mảng chính với hoạt ảnh ---
//     await this.visualizer.moveBoxToMain(low, middle, high, left, right, tempCtx)

//     // Sau khi trộn xong một phân đoạn, vẽ lại với màu khác biệt
//     this.visualizer.clear();
//     this.visualizer.drawMainArrayDivided(low, middle, high);
//     await this.visualizer.sleep(400);
// }
// }
