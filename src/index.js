import './styles/index.scss';
import regeneratorRuntime from "regenerator-runtime";

class SortingVisualizer {
  constructor() {
    this.canvas = document.getElementById("canvas");
    this.ctx = canvas.getContext("2d");

    this.colorStart = Math.floor(Math.random() * 360);

    this.algorithmType = document.getElementById("algorithm-type").value;
    this.algorithmInput = document.getElementById("algorithm").value;
  }

  clearCanvas() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  buildArray() {
    
    sessionStorage.getItem("size") ? 
    this.size = Number(sessionStorage.getItem("size")) :
    this.size = 42;

    this.array = [];
    for (let i = 1; i <= this.size; i++) {
      this.array.push(i);
    }
  }

  shuffleArray() {
    for (let i = this.size - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.array[i], this.array[j]] = [this.array[j], this.array[i]];
    }
  }

  drawCanvas() {
    let widthRatio = this.canvas.width / this.size;
    let heightRatio = this.canvas.height / this.size;

    this.clearCanvas();

    for (let i = 0; i < this.size; i++) {
      let val = this.array[i];
      let barHeight = val * heightRatio;
      this.ctx.fillStyle = this.gradient(val);
      this.ctx.fillRect(
        i * widthRatio,
        this.canvas.height - barHeight,
        widthRatio,
        barHeight
      );
      this.ctx.save();
    }
  }

  gradient(val) {
    let index = this.array.indexOf(val);

    let colorNext = (this.colorStart + index * (70 / this.size)) % 360;
    return "hsl(" + colorNext + ",90%,50%)";
  }

  // if algorithm is running disable the input fields
  toggleInputs(){
    if (!this.isSorted(this.array)) {
      document.getElementById("algorithm-type").disabled = true;
      document.getElementById("algorithm").disabled = true;
      document.getElementById("size").disabled = true;
    } else {
      document.getElementById("algorithm-type").disabled = false;
      document.getElementById("algorithm").disabled = false;
      document.getElementById("size").disabled = false;
    }
  }

  init() {
    this.colorStart = Math.floor(Math.random() * 360);
    this.buildArray();
    this.shuffleArray();
    this.drawCanvas();
  }

  resize() {
    this.buildArray();
    this.shuffleArray();
    this.drawCanvas();
  }

  algorithm() {
    let algorithmVal = document.getElementById("algorithm").value;
    
    if (algorithmVal === "0") return;
    if (algorithmVal === "1") {
      return this.bubbleSort(this.array);
    }
    if (algorithmVal === "Merge Sort") {
      return this.mergeSort(this.array, 0, this.array.size);
    }
    if (algorithmVal === "2") {
      return this.quickSort(this.array, 0, this.array.size);
    }
  }

  isSorted(arr) {
    for (let i = 0; i < arr.length; i++) {
      if (arr[i] > arr[i + 1]) {
        return false;
      }
    }
    return true;
  }

  sort() {
    
    let sortArray = this.algorithm();
    if (sortArray === undefined) return;

    const animate = () => {
      let speed = Math.floor(1000 / Number(document.getElementById("speed").value));

      this.drawCanvas();

      if (this.isSorted(this.array)) {
        this.toggleInputs();
        return;
      } else {
        this.toggleInputs();
        setTimeout(animate, speed);
        sortArray.next(); // call next iteration of the bubbleSort function
      }
    };
    animate();
  }


  //---------------------------------Algorithms-----------------------------------

  *bubbleSort(arr) {
    let swapped = true;
    while (swapped) {
      swapped = false;
      for (let i = 0; i < arr.length - 1; i++) {
        if (arr[i] > arr[i + 1]) {
          this.swap(arr, i, i + 1);
          swapped = true;
          yield swapped; // pause here
        }
      }
    }
    return;
  }

  swap(arr, idx1, idx2) {
    let temp = arr[idx1];
    arr[idx1] = arr[idx2];
    arr[idx2] = temp;
  }

  //------------------------------------------------------------------------------

  *quickSort(arr, min, max = arr.length) {
    if (max - min <= 1) return arr;

    // partitioning
    let [pivot, less, greater] = [arr[min], [], []];
    for (let i = min + 1; i < max; i++) {
      if (arr[i] < pivot) less.push(arr[i]);
      else greater.push(arr[i]);
      arr.splice(min, i - min + 1, ...less.concat(pivot, greater));
      yield arr;
    }

    yield* this.quickSort(arr, min, min + less.length);
    yield* this.quickSort(arr, min + less.length + 1, max);
  }

  //------------------------------------------------------------------------------

//   mergeSort(arr) {
//   if (arr.length <= 1) return arr;

//   let midIdx = Math.floor(arr.length / 2);
//   let left = arr.slice(0, midIdx);
//   let right = arr.slice(midIdx);

//   let sortedLeft = mergeSort(left);
//   let sortedRight = mergeSort(right);

//   return merge(sortedLeft, sortedRight);
// }


// merge(arr1, arr2) {
//   let merged = [];

//   while (arr1.length || arr2.length) {
//     let ele1 = arr1.length ? arr1[0] : Infinity;
//     let ele2 = arr2.length ? arr2[0] : Infinity;

//     let next;
//     if (ele1 < ele2) {
//       next = arr1.shift();
//     } else {
//       next = arr2.shift();
//     }

//     merged.push(next);
//   }

//   return merged;
// }

}

//----------------------------------Run Program---------------------------------

let visualizer = new SortingVisualizer
visualizer.init()

document.getElementById('sort').onclick = e => {
  visualizer.sort();
}

document.getElementById('reset').onclick = e => {
  location.reload();
}

document.getElementById("algorithm").onchange = function () {
  sessionStorage.setItem("algorithm", document.getElementById("algorithm").value);
};

if (sessionStorage.getItem("algorithm")) {
  document.getElementById("algorithm").options[sessionStorage.getItem("algorithm")].selected = true;
}

document.getElementById("size").oninput = () => {
  sessionStorage.setItem("size", document.getElementById("size").value);
  visualizer.resize();
};

if (sessionStorage.getItem("size")) {
  document.getElementById("size").value = sessionStorage.getItem("size");
} 

document.getElementById("speed").oninput = () => {
  sessionStorage.setItem("speed", document.getElementById("speed").value);
};

if (sessionStorage.getItem("speed")) {
  document.getElementById("speed").value = sessionStorage.getItem("speed");
}
