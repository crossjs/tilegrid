// 大矩形
var canvas = [
  0, 0, 0, 0,
  0, 0, 0, 0
];

// 小矩形
var tiles = [
  [1, 1],
  [1, 1],
  [1, 1],
  [2, 1],
  [1, 2],
  [1, 1]
];

// http://codepen.io/anon/pen/gvhDE

var pendingIndexes = [];

function placeBigger(index, tile) {
  var slotIndex = index;
  // 横版
  if (tile[0] > 1) {
    while ((slotIndex % 4 > 2)) {
      slotIndex--;
      // if (slotIndex < 0) {
      //   slotIndex = 7;
      // }
    }
    if (canvas[slotIndex]) {
      pendingIndexes.push(slotIndex);
      if (canvas[slotIndex + 4]) {
        // canvas[slotIndex + 4] = 0;
        pendingIndexes.push(slotIndex + 4);
      }
    }
    if (canvas[slotIndex + 1]) {
      pendingIndexes.push(slotIndex + 1);
      if (canvas[slotIndex + 5]) {
        // canvas[slotIndex + 5] = 0;
        pendingIndexes.push(slotIndex + 5);
      }
    }
    canvas[slotIndex] = canvas[slotIndex + 1] = '' + index;
  } else {
    if (slotIndex > 3) {
      slotIndex = slotIndex % 4;
    }
    while (canvas[slotIndex]) {
      slotIndex--;
      if (slotIndex < 0) {
        slotIndex += 4;
      }
    }
    canvas[slotIndex] = canvas[slotIndex + 4] = '' + index;
  }
  console.log('b', slotIndex, index);
}

function placeNormal(index, tile) {
  while (canvas[index]) {
    index++;
    if (index > 7) {
      index = 0;
    }
  }
  console.log('n', index);
  canvas[index] = '' + index;
}

// 第一轮
tiles.forEach(function(tile, i) {
  if (tile[0] * tile[1] > 1) {
    placeBigger(i, tile);
  } else {
    placeNormal(i, tile);
  }
});

// 第二轮
pendingIndexes.forEach(function(index) {
  console.log(index);
});

console.log(canvas);
