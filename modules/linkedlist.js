// 📁 modules/linkedlist.js
//---------------------------------------------------------------------------
// LỚP MÔ PHỎNG DANH SÁCH (SINGLY LINKED LIST)
// Định nghĩa nút, danh sách và các thao tác trên danh sách 
//---------------------------------------------------------------------------

// Định nghĩa nút 
class Node {
  // Hàm tạo lập, đặt giá trị value và địa chỉ giả lập address của nút
  constructor(value, address) {
    this.value = value;       // Giá trị của nút
    this.next = null;         // Trỏ đến phần tử kế tiếp
    this.address = address;   // Địa chỉ giả lập của nút
    this.nextAddress = null;  // Địa chỉ giả lập của nút kế tiếp
  }
}

// Định nghĩa và xuất khẩu lớp tạo hoạt hình trên danh sách
export class LinkedListSimulator {
  // Hàm tạo lập mặc định, đặt các thông số ban đầu cho DS
  constructor() {
    this.head = null;         // Trỏ đến đầu danh sách
    this.boxWidth = 80;       // Chiều rộng hình mô phỏng phần tử
    this.boxHeight = 80;      // Chiều cao hình mô phòng phần tử
    this.spacing = 30;        // Khoảng cách giữa các hình
    this.nextAddress = 1000;  // Địa chỉ giả lập nút kế tiếp

    // Khai báo sẵn để dùng chung
    // Định vị khu vực mô phỏng
    this.canvas = document.getElementById("simulation-canvas");
    // Đặt "ngữ cảnh vẽ" (drawing context) trên canvas là 2D
    this.ctx = this.canvas.getContext("2d");
  }

  // Khởi tạo danh sách. values = [] danh sách các giá trị nhập vào
  init(values = []) {
    this.head = null;
    // Khi DS sỗng đặt về tất cả về trạng thái sẵn sàng
    if (values.length === 0) {
      this.clear();
      return;
    }

    this.nextAddress = 1000; // Đặt địa chỉ giả lập hiện thời khởi đầu

    // Lần lượt đọc các giá trị trong values để thêm vào đầu DS
    for (let i = 0; i < values.length; i++) {
        this.insertAtHead(values[i]);
      }
    }

    // Thêm giá trị value vào đầu DS
    insertAtHead(value) {
      const node = new Node(value, this.nextAddress); // Tạo nút mới
      // Nếu HEAD != null thì node.nextAddress = địa chỉ giả lập của nút đầu
      node.nextAddress = this.head ? this.head.address : null;
      node.next = this.head;  // Nút mới trỏ đến nút đầu DS
      this.head = node;       // HEAD trỏ đến nút mới
      this.nextAddress += 4;  // Tăng địa chỉ giả lập của nút tiếp theo
      this.render();          // Vẽ lại danh sách trong vùng mô phỏng
    }

    // Thêm giá trị value vào cuối DS
    insertAtTail(value) {
      const node = new Node(value, this.nextAddress); // Tạo nút mới
    
      if (!this.head) {
        // Nếu danh sách rỗng thì gán trực tiếp node mới làm head
        this.head = node;
        this.nextAddress += 4;
        this.render();
        return;
      }
    
      // Nếu danh sách không rỗng, tìm node cuối có hiệu ứng
      let current = this.head;
      let index = 0;
    
      // Dùng Promise để chờ hiệu ứng duyệt node hoàn tất
      const findTail = () => {
        return new Promise((resolve) => {
          const step = () => {
            if (!current.next) {
              // Đã đến node cuối cùng
              return resolve();
            }
    
            this.flash(index, "lime"); // Hiệu ứng nhấp nháy
            setTimeout(() => {
              this.render(); // Cập nhật hiển thị
              current = current.next; // Sang node tiếp theo
              index++;
              setTimeout(step, 300); // Lặp tiếp sau 300ms
            }, 300);
          };
    
          step();
        });
      };
    
      // Sau khi duyệt xong thì chèn node mới
      findTail().then(() => {
        current.next = node;
        current.nextAddress = node.address;
        this.nextAddress += 4;
        this.render(); // Cập nhật danh sách sau khi chèn
      });
    }

    // Chèn value vào vị trí chỉ định index trong DS
    insertAt(index, value) {
      return new Promise((resolve, reject) => {
        // Nếu vị trí là 0 thì chèn vào đầu danh sách
        if (index === 0) {
          this.insertAtHead(value); // Gọi hàm chèn đầu có sẵn
          resolve(true);            // Trả kết quả thành công
          return;
        }
    
        let current = this.head;       // Bắt đầu từ nút đầu tiên
        let prev = null;               // Biến lưu nút trước đó
        let i = 0;                     // Biến đếm vị trí hiện tại
        const node = new Node(value, this.nextAddress); // Tạo nút mới
    
        /**
         * Hàm lặp từng bước để tìm đến đúng vị trí cần chèn.
         * Có hiệu ứng nhấp nháy khi đi qua từng nút.
         */
        const step = () => {
          // Khi tìm đến đúng vị trí hoặc hết danh sách
          if (i === index || !current) {
            // Nếu vị trí hợp lệ (tìm thấy vị trí và có nút trước đó)
            if (i === index && prev) {
              prev.next = node;                 // Nối nút trước với nút mới
              prev.nextAddress = node.address; // Cập nhật địa chỉ giả lập
              node.next = current;             // Nút mới trỏ đến nút hiện tại
              node.nextAddress = current ? current.address : null;
              this.nextAddress += 4;           // Tăng địa chỉ giả lập cho lần sau
              this.render();                   // Vẽ lại danh sách
              resolve(true);                   // ✅ Thành công
            } else {
              resolve(false);                  // ❌ Vị trí không hợp lệ
            }
            return;
          }
    
          // Hiệu ứng nhấp nháy từng nút khi duyệt qua
          this.flash(i, "lime");
          setTimeout(() => {
            prev = current;          // Cập nhật nút trước
            current = current.next;  // Di chuyển đến nút kế tiếp
            i++;                     // Tăng chỉ số
            setTimeout(step, 300);   // Gọi tiếp sau 300ms
          }, 300);
        };
    
        step(); // Bắt đầu thực hiện bước đầu tiên
      });
    }
    

    // Xóa phần tử tại vị trí index
    /**
    * Xóa phần tử tại vị trí bất kỳ trong danh sách liên kết đơn.
    * @param {number} index - Vị trí phần tử cần xóa (bắt đầu từ 0).
    * @returns {Promise<boolean>} - Trả về true nếu xóa thành công, false nếu không hợp lệ.
    */
    removeAt(index) {
      return new Promise((resolve, reject) => {
        // 🌑 Kiểm tra danh sách rỗng
        if (!this.head) {
          resolve(false); // ❌ Không thể xóa khi danh sách trống
          return;
        }

        // ✅ Trường hợp đặc biệt: Xóa phần tử đầu danh sách
        if (index === 0) {
          this.flash(0, "red");              // Hiệu ứng nhấp nháy đỏ phần tử đầu
          setTimeout(() => {
            this.head = this.head.next;      // Cập nhật HEAD trỏ đến phần tử kế
            this.render();                   // Vẽ lại danh sách
            resolve(true);                   // ✅ Thành công
          }, 300);
          return;
        }

        // 🚶‍♀️ Ngược lại: cần tìm đến vị trí chỉ định để xóa
        let current = this.head;             // Nút hiện tại bắt đầu từ HEAD
        let prev = null;                     // Nút trước (ban đầu là null)
        let i = 0;                           // Chỉ số nút hiện tại

        // 👣 Duyệt từng bước qua danh sách
        const step = () => {
          if (i === index || !current) {
            if (prev && current) {
              this.flash(i, "red");          // Nhấp nháy đỏ nút cần xóa
              setTimeout(() => {
                prev.next = current.next;    // Nút trước bỏ qua nút hiện tại
                prev.nextAddress = current.nextAddress; // Cập nhật địa chỉ
                this.render();               // Vẽ lại danh sách
                resolve(true);               // ✅ Thành công
              }, 300);
            } else {
              resolve(false);                // ❌ Không tìm thấy vị trí
            }
            return;
          }

          // ✨ Hiệu ứng khi duyệt qua từng nút
          this.flash(i, "lime");
          setTimeout(() => {
            prev = current;
            current = current.next;
            i++;
            setTimeout(step, 300);
          }, 300);
        };

        step(); // Bắt đầu duyệt
      });
    }


    // Tìm giá trị value trên DS
    // Trả về Promise để có thể dùng async/await hoặc .then()
    findByValue(value) {
      return new Promise((resolve) => {
        let current = this.head; // Bắt đầu từ phần tử đầu danh sách
        let index = 0;           // Biến đếm vị trí

        // Hàm thực hiện tìm kiếm theo từng bước
        const step = () => {
          if (!current) {
            // Nếu đã duyệt hết danh sách mà không thấy => trả về null
            return resolve(null);
          }

          // Hiệu ứng nháy phần tử đang xét (ví dụ: màu xanh chanh 'lime')
          this.flash(index, "lime");

          // Nếu tìm thấy giá trị phù hợp => trả về vị trí
          if (current.value == value) {
            return resolve(index);
          }

          // Nếu chưa tìm thấy, chuyển sang phần tử tiếp theo
          current = current.next;
          index++;

          // Đợi 400ms rồi tiếp tục duyệt phần tử tiếp theo
          setTimeout(step, 400);
        };

        // Bắt đầu quá trình tìm kiếm
        step();
      });
    }    

    // Duyệt DS
    traverse(delay = 500) {
      let current = this.head;
      let index = 0;
      const step = () => {
        if (!current) return;
        this.flash(index, "lime");
        setTimeout(() => {
          this.render();
          index++;
          setTimeout(step, delay);
        }, 300);
      };
      step();
    }

    // Xóa toàn bộ DS
    clear() {
      this.head = null;
      this.nextAddress = 1000;
      this.render();
    }

    // Hàm vẽ DS trong vùng mô phỏng
    render() {
      // Đặt kích thước vùng mô phỏng về kích thước chính xác để tránh co giãn
      this.canvas.width = this.canvas.clientWidth;
      this.canvas.height = this.canvas.clientHeight;
      const ctx = this.ctx;
      const canvas = this.canvas;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      const y = canvas.height / 2 - this.boxHeight / 2;
      const startX = 20;
      let x = startX;
      
      // 🎯 Vẽ HEAD
      const headBoxWidth = 60;
      const headBoxHeight = 30;
      const headX = x + this.boxWidth / 2 - headBoxWidth / 2;
      const headY = y - 70;
      
      // Hộp HEAD
      ctx.fillStyle = "#f5a623";
      ctx.fillRect(headX, headY, headBoxWidth, headBoxHeight);
      ctx.strokeStyle = "black";
      ctx.strokeRect(headX, headY, headBoxWidth, headBoxHeight);
      
      // Nội dung HEAD: địa chỉ nếu có node, NULL nếu danh sách rỗng
      ctx.fillStyle = "black";
      ctx.font = "14px monospace";
      ctx.textAlign = "center";
      ctx.fillText(this.head ? this.head.address : "NULL", headX + headBoxWidth / 2, headY + 20);

      // Nhãn HEAD
      ctx.font = "14px Arial";
      ctx.fillText("HEAD", headX + headBoxWidth / 2, headY - 5);
      
      // Mũi tên từ HEAD đến node đầu tiên
      if (this.head) {
        ctx.beginPath();
        ctx.moveTo(headX + headBoxWidth, headY + headBoxHeight);
        ctx.lineTo(headX + headBoxWidth, y);
        ctx.lineTo(headX + headBoxWidth - 5, y - 10);
        ctx.moveTo(headX + headBoxWidth, y);
        ctx.lineTo(headX + headBoxWidth + 5, y - 10);
        ctx.stroke();
      }
      
      // 🟦 Vẽ các node từ trái sang phải
      let current = this.head;
      let index = 0;
      
      while (current) {
        // Hình chữ nhật trên (Data: giá trị node)
        ctx.fillStyle = "#0074cc";
        ctx.fillRect(x, y, this.boxWidth, this.boxHeight / 2);
        ctx.strokeStyle = "black";
        ctx.strokeRect(x, y, this.boxWidth, this.boxHeight / 2);
      
        // Văn bản cho Data
        ctx.fillStyle = "white";
        ctx.font = "20px Arial";
        ctx.textAlign = "center";
        ctx.fillText(current.value, x + this.boxWidth / 2, y + this.boxHeight / 4 + 6);
      
        // Hình chữ nhật dưới (Next: địa chỉ kế tiếp của node)
        ctx.fillStyle = "#f5a623";
        ctx.fillRect(x, y + this.boxHeight / 2, this.boxWidth, this.boxHeight / 2);
        ctx.strokeStyle = "black";
        ctx.strokeRect(x, y + this.boxHeight / 2, this.boxWidth, this.boxHeight / 2);
      
        // Văn bản cho Next
        ctx.fillStyle = "white";
        ctx.font = "16px Arial";
        ctx.textAlign = "center";
        ctx.fillText(current.next ? current.nextAddress : "NULL", x + this.boxWidth / 2, y + this.boxHeight - 10);
          
        // Địa chỉ giả lập của node (phía trên node)
        ctx.fillStyle = "black";
        ctx.font = "16px monospace";
        ctx.textAlign = "center";
        ctx.fillText(current.address, x + this.boxWidth / 2, y - 10); // Địa chỉ giả lập
        
        // Chỉ số của node (phía dưới node)
        ctx.fillStyle = "black";
        ctx.font = "16px Arial";
        ctx.fillText(index, x + this.boxWidth / 2, y + this.boxHeight + 20); // Chỉ số
      
        // Mũi tên đến node kế tiếp
        if (current.next) {
          const arrowX = x + this.boxWidth;
          ctx.beginPath();
          ctx.moveTo(arrowX, y + this.boxHeight/2);
          ctx.lineTo(arrowX + this.spacing, y + this.boxHeight/2);
          ctx.lineTo(arrowX + this.spacing - 15, y + this.boxHeight/2 - 5);
          ctx.moveTo(arrowX + this.spacing, y + this.boxHeight/2);
          ctx.lineTo(arrowX + this.spacing - 15, y + this.boxHeight/2 + 5);
          ctx.stroke();
        }
      
        x += this.boxWidth + this.spacing;
        current = current.next;
        index++;
      }
    }

    // Tạo hiệu ứng nhấp ngáy
    flash(index, color = "yellow") {
      let current = this.head;
      let i = 0;
      let x = 20;
  
      while (current && i < index) {
        current = current.next;
        x += this.boxWidth + this.spacing;
        i++;
      }
  
      if (!current) return;
  
      const y = this.canvas.height / 2 - this.boxHeight / 2;
      const ctx = this.ctx;
      ctx.save();
      ctx.fillStyle = color;
      ctx.fillRect(x, y, this.boxWidth, this.boxHeight);
      ctx.restore();
  
      setTimeout(() => this.render(), 300);
    }
}
  