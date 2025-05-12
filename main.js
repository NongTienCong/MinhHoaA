// main.js

import { ArraySimulator } from './modules/array.js';
import { setupArrayUI } from './ui/array-ui.js';

import { LinkedListSimulator } from './modules/linkedlist.js';
import { setupLinkedListUI } from "./ui/linkedlist-ui.js";

import { StackSimulator } from './modules/stack.js';
import { setupStackUI } from './ui/stack-ui.js';

import { QueueSimulator } from './modules/queue.js';
import { setupQueueUI } from './ui/queue-ui.js';

import { SearchSimulator } from './modules/search.js';
import { setupSearchUI } from './ui/search-ui.js';

import { SortSimulator } from './modules/sort.js';
import { setupSortUI } from './ui/sort-ui.js';

import { showDialog } from './ui/render-control.js';
//----------------------------------------------

function onModelSelected(name) {
    const control = document.getElementById("control-panel");
    const explain = document.getElementById("explanation-panel");
    const mainLayout = document.getElementById("main-layout");
    control.innerHTML = "";
    explain.innerHTML = "";

    // 🟩 Hiển thị vùng nội dung khi có lựa chọn hợp lệ
    mainLayout.style.display = "flex";

    let module = null;

    switch (name) {
        case 'About':
          // Gọi hàm showDialog() để hiển thị giới thiệu
          showDialog("../about.txt");
          break;
        case 'Array':
          // Tạo hoặc gọi hàm để hiển thị mô phỏng mảng (Array)
          module = new ArraySimulator();
          window.arraySim = module;
          setupArrayUI();
          break;
    
        case 'List':
          // Tạo hoặc gọi hàm để hiển thị mô phỏng Linked List
          module = new LinkedListSimulator();
          window.linkedListSim = module;
          setupLinkedListUI();
          break;
    
        case 'Stack':
          // Tạo hoặc gọi hàm để hiển thị mô phỏng Stack
          module = new StackSimulator();
          window.stackSim = module;
          setupStackUI();
          break;
    
        case 'Queue':
          // Tạo hoặc gọi hàm để hiển thị mô phỏng Queue
          module = new QueueSimulator();
          window.queueSim = module;
          setupQueueUI();
          break;
    
        case 'Search':
          // Tạo hoặc gọi hàm để hiển thị mô phỏng Queue
          module = new SearchSimulator();
          window.searchSim = module;
          setupSearchUI();
          break;
        
        case 'Sort':
          // Tạo hoặc gọi hàm để hiển thị mô phỏng Queue
          module = new SortSimulator();
          window.sortSim = module;
          setupSortUI();
          break;
      
        default:
          alert("Mô phỏng không hợp lệ");
      }

}

window.onload = () => {
    // createMenu(onModelSelected);
    window.onModelSelected = onModelSelected; // ✅ Thêm dòng này để menu ngoài HTML gọi được
};