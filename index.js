(function(window, undefined) {

  'use strict';

  function placeIsEmpty(canvas, index) {
    return canvas[index] === -1;
  }

  function placeBigger(canvas, index, tile) {
    var slotIndex = index;

    // 横版
    if (tile[0] > 1) {
      // 位置不够长，往回缩
      while (slotIndex % 4 > 2) {
        slotIndex--;
      }

      // 如果位置已经被占，重新安排原客人
      if (!placeIsEmpty(canvas, slotIndex)) {
        placeNormal(canvas, (slotIndex + 2) % 8, tile, [slotIndex, slotIndex + 1]);
      }

      // 如果位置已经被占，重新安排原客人
      if (!placeIsEmpty(canvas, slotIndex + 1)) {
        placeNormal(canvas, (slotIndex + 3) % 8, tile, [slotIndex, slotIndex + 1]);
      }

      canvas[slotIndex] = canvas[slotIndex + 1] = index;
    }
    // 竖版
    else {
      if (slotIndex > 3) {
        slotIndex = slotIndex % 4;
      }

      while (slotIndex !== -1 && !placeIsEmpty(canvas, slotIndex)) {
        slotIndex++;

        // 走到尽头，从头开始
        if (slotIndex > 3) {
          slotIndex = 0;
        }

        // 没有找到空位
        if (slotIndex === index % 4) {
          slotIndex = -1;
        }
      }

      // 没有找到空位，强制插入到默认位置
      if (slotIndex === -1) {
        slotIndex = index % 4;
      }

      // 如果位置已经被占，重新安排原客人
      if (!placeIsEmpty(canvas, slotIndex)) {
        placeNormal(canvas, slotIndex + 1, tile, [slotIndex, slotIndex + 4]);
      }

      // 如果位置已经被占，重新安排原客人
      if (!placeIsEmpty(canvas, slotIndex + 4)) {
        placeNormal(canvas, slotIndex + 5, tile, [slotIndex, slotIndex + 4]);
      }

      canvas[slotIndex] = canvas[slotIndex + 4] = index;
    }
  }

  function placeNormal(canvas, index, tile, skipIndexes) {
    var slotIndex = index;

    function isInSkip(index) {
      return skipIndexes && (skipIndexes.indexOf(index) !== -1);
    }

    // 默认从 index 开始找
    while (slotIndex !== -1 && (!placeIsEmpty(canvas, slotIndex) || isInSkip(slotIndex))) {
      slotIndex++;

      // 走到尽头，从头开始
      if (slotIndex > 7) {
        slotIndex = 0;
      }

      // 没有找到空位
      if (slotIndex === index) {
        slotIndex = -1;
      }
    }

    if (slotIndex > -1) {
      canvas[slotIndex] = index;
    }
  }

  function order(canvas, tiles) {
    // 第一轮，排横版
    tiles.forEach(function(tile, i) {
      if (tile[0] > 1) {
        placeBigger(canvas, i, tile);
      }
    });

    // 第二轮，排竖版
    tiles.forEach(function(tile, i) {
      if (tile[1] > 1) {
        placeBigger(canvas, i, tile);
      }
    });

    // 第三轮，排常规
    tiles.forEach(function(tile, i) {
      if (tile[0] === tile[1] === 1) {
        placeNormal(canvas, i, tile);
      }
    });

    console.log(validate(canvas, tiles), canvas, tiles);
  }

  function validate(canvas, tiles) {
    var valid = true;

    tiles.forEach(function(tile, i) {
      if (!valid) {
        return;
      }

      // 横版
      if (tile[0]  > 1) {
        canvas.forEach(function(slot, index) {
          if (!valid) {
            return;
          }

          if (slot === i) {
            if (index % 4 > 2 && canvas[index - 1] !== i) {
              valid = false;
            }
          }
        });
      }
      // 竖版
      else if (tile[1]  > 1) {
        canvas.forEach(function(slot, index) {
          if (!valid) {
            return;
          }

          if (slot === i) {
            if (index > 3 && canvas[index - 4] !== i) {
              valid = false;
            }
          }
        });
      }
    });

    return valid;
  }

  function random() {
    return Math.random() > 0.5 ? -1 : 1;
  }

  var n = 100;

  while (n--) {
    order([
      -1, -1, -1, -1,
      -1, -1, -1, -1
    ], [
      [1, 1],
      [1, 1],
      [1, 1],
      [2, 1],
      [1, 2],
      [1, 1]
    ].sort(random));
  }

})(this);
