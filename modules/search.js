// 📁 modules/search.js
// Trình mô phỏng các thuật toán tìm kiếm
import { ArrayVisualizer } from "./array-visualization.js"; // 👈 Import lớp ArrayVisualizer đã viết

export class SearchSimulator {
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

    // Tìm kiếm tuyến tính (Linear Search)
    async linearSearch(value) {
        const v = this.visualizer;
        v.resetControlFlags();
        v.clearAllPointers();
        v.setColorRange(0, this.size-1, "Blue");
        v.clear();
        v.drawArray();
        const n = v.size;
        let i = 0;
        while (i < n && v.boxes[i].value != value) {
            // Highlight ô đang xét
            v.addPointer(i, "I");
            v.clear();
            v.setMessage([`🔍 Tìm kiếm ${value} tại vị trí ${i}`]);
            v.drawArray();
            v.highlightBox(i, "SandyBrown");
            await v.sleep(500);
            v.highlightBox(i, "Blue");
            await v.sleep(500);
            v.removePointer(i, "I");
            i++;
        }
        if (i < n) {
            // Nếu tìm thấy, nhấp nháy ô đó và kết thúc
            v.addPointer(i, "I");
            v.highlightBox(i, "SandyBrown");
            v.clear();
            v.setMessage([`🔍 Tìm kiếm ${value} tại vị trí ${i}`]);
            v.drawArray();
            await v.blinkBox(i, 3, "Lime", 300);
            v.setMessageLine(1, `✅ Đã tìm thấy ${value} tại vị trí ${i}`);
            return i;
        } else {
            // Nếu không tìm thấy, tô lại màu và tiếp tục
            v.clear();
            v.setMessageLine(1, `❌ Không tìm thấy ${value} trong mảng`);
            v.drawArray();
            return -1;
        }
    }

    // Tìm kiếm nhị phân (Binary Search) - Chỉ hoạt động trên mảng đã sắp xếp
    async binarySearch(target) {
        const v = this.visualizer;
        v.resetControlFlags();
        let low = 0;
        let high = this.size - 1;
        let mid;

        while (low <= high) {
            mid = Math.floor((low + high) / 2);

            // Highlight vùng tìm kiếm
            v.setColorRange(low, high, "LightSeaGreen");
            v.highlightBox(mid, "SandyBrown");
            v.setMessage([
                `🔍 Tìm kiếm ${target} trong đoạn [${low}...${high}]`,
                `👉 Kiểm tra A[${mid}] = ${v.boxes[mid].value}`
            ]);
            v.clearAllPointers();
            v.addPointer(low, "Low");
            v.addPointer(mid, "Mid");
            v.addPointer(high, "High");
            v.clear();
            v.drawArray();

            await v.sleep(500);

            if (v.boxes[mid].value === target) {
                // Tìm thấy
                await v.blinkBox(mid, 3, "Lime", 300);
                v.setMessageLine(1, `✅ Đã tìm thấy ${target} tại vị trí ${mid}`);
                return mid;
            } else if (v.boxes[mid].value < target) {
                // Target ở nửa phải. Trả lại mầu nửa trái
                v.setColorRange(low, mid, "Blue");
                low = mid + 1;
                v.setMessageLine(1, `❌ ${target} > A[${mid}], tìm trong nửa phải`);
                await v.sleep(500);

            } else {
                // Target ở nửa dưới. Trả lại mầu nửa phải
                v.setColorRange(mid, high, "Blue");
                high = mid - 1;
                v.setMessageLine(1, `❌ ${target} < A[${mid}], tìm trong nửa trái`);
                await v.sleep(500);
            }
        }

        // Không tìm thấy
        v.clear();
        v.clearAllPointers();
        v.setMessageLine(1, `❌ Không tìm thấy ${target} trong mảng`);
        v.drawArray();
        return -1;
    }
}
