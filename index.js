(function(global, undefined) {

  'use strict';

  function TileGrid(data) {
    var p;

    if (data) {
      for (p in data) {
        this[p] = data[p];
      }
    }
  }

  TileGrid.prototype.arrange = function() {
    var tiles = this.tiles,
      scope = this;

    // 第一轮，排横版
    tiles.forEach(function(tile, i) {
      if (tile[0] > 1) {
        scope.placeHor(i, tile);
      }
    });

    // 第二轮，排竖版
    tiles.forEach(function(tile, i) {
      if (tile[1] > 1) {
        scope.placeVer(i, tile);
      }
    });

    // 第三轮，排常规
    tiles.forEach(function(tile, i) {
      if (tile[0] === tile[1]) {
        scope.placeNor(i, tile);
      }
    });

    return this;
  };

  // FOR OVERRIDE
  TileGrid.prototype.paint = function(tile, index, index2) {};

  TileGrid.prototype.gridIsEmpty = function(index) {
    return this.grids[index] === -1;
  };

  // 横版 2*1
  TileGrid.prototype.placeHor = function(index, tile) {
    var grids = this.grids,
      slotIndex = index;

    // 位置不够长，往回缩
    while (slotIndex % 4 > 2) {
      slotIndex--;
    }

    // 如果位置已经被占，重新安排
    if (!this.gridIsEmpty(slotIndex)) {
      this.placeNor((slotIndex + 2) % 8, tile, [slotIndex, slotIndex + 1]);
    }

    // 如果位置已经被占，重新安排
    if (!this.gridIsEmpty(slotIndex + 1)) {
      this.placeNor((slotIndex + 3) % 8, tile, [slotIndex, slotIndex + 1]);
    }

    // 占坑
    grids[slotIndex] = grids[slotIndex + 1] = index;

    // 画图
    this.paint(tile, slotIndex, slotIndex + 1);
  };

  // 竖版 1*2
  TileGrid.prototype.placeVer = function(index, tile) {
    var grids = this.grids,
      slotIndex = index;

    if (slotIndex > 3) {
      slotIndex = slotIndex % 4;
    }

    while (slotIndex !== -1 && !(this.gridIsEmpty(slotIndex) && this.gridIsEmpty(slotIndex + 4))) {
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

    // 如果位置已经被占，重新安排
    if (!this.gridIsEmpty(slotIndex)) {
      this.placeNor(slotIndex + 1, tile, [slotIndex, slotIndex + 4]);
    }

    // 如果位置已经被占，重新安排
    if (!this.gridIsEmpty(slotIndex + 4)) {
      this.placeNor(slotIndex + 5, tile, [slotIndex, slotIndex + 4]);
    }

    // 占坑
    grids[slotIndex] = grids[slotIndex + 4] = index;

    // 画图
    this.paint(tile, slotIndex, slotIndex + 4);
  };

  // 常规 1*1
  TileGrid.prototype.placeNor = function(index, tile, skipIndexes) {
    var grids = this.grids,
      slotIndex = index;

    function isInSkipIndexes(index) {
      return skipIndexes && (skipIndexes.indexOf(index) !== -1);
    }

    // 默认从 index 开始找
    while (slotIndex !== -1 && (!this.gridIsEmpty(slotIndex) || isInSkipIndexes(slotIndex))) {
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
      // 占坑
      grids[slotIndex] = index;

      // 画图
      this.paint(tile, slotIndex);
    }
  };

  if (typeof define === 'function') {
    define('tilegrid', function(require, exports, module) {
      return TileGrid;
    });
  } else {
    global.TileGrid = TileGrid;
  }

})(this);

/* demo begin */
(function(window, document) {

  function random() {
    return Math.random() > 0.5 ? -1 : 1;
  }

  function attr(elem, data) {
    var p;
    for (p in data) {
      elem.setAttribute(p, data[p]);
    }
  }

  function styl(elem, data) {
    var p;
    for (p in data) {
      elem.style[p] = data[p];
    }
  }

  function paint(tile, index, index2) {
    var gridBox,
      tileBox = document.createElement('div'),
      width = 100,
      height = 100;

    if (!(gridBox = document.getElementById('grid'))) {
      gridBox = document.createElement('div');

      attr(gridBox, {
        id: 'grid'
      });

      styl(gridBox, {
        position: 'relative',
        width: '400px',
        height: '200px',
        border: '1px solid red'
      });

      document.body.appendChild(gridBox);
    }

    if (typeof index2 !== 'undefined') {
      if (index - index2 === -1) {
        width = 200;
      } else {
        height = 200;
      }
    }

    styl(tileBox, {
      position: 'absolute',
      left: 100 * (index % 4) + 'px',
      top: 100 * (index > 3 ? 1 : 0) + 'px',
      width: width + 'px',
      height: height + 'px',
      border: '1px solid green'
    });

    gridBox.appendChild(tileBox);
  }

  var tilegrid = new TileGrid({
    grids: [-1, -1, -1, -1, -1, -1, -1, -1],
    tiles: [
      [1, 1],
      [1, 1],
      [1, 1],
      [1, 1],
      [2, 1],
      [1, 2]
    ].sort(random),
    paint: paint
  }).arrange();

  /**
   * 验证排列是否正确
   */
  function validate(grids, tiles) {
    var valid = true;

    tiles.forEach(function(tile, i) {
      if (!valid) {
        return;
      }

      // 横版
      if (tile[0]  > 1) {
        grids.forEach(function(slot, index) {
          if (!valid) {
            return;
          }

          if (slot === i) {
            if (index % 4 > 2 && grids[index - 1] !== i) {
              valid = false;
            }
          }
        });
      }
      // 竖版
      else if (tile[1]  > 1) {
        grids.forEach(function(slot, index) {
          if (!valid) {
            return;
          }

          if (slot === i) {
            if (index > 3 && grids[index - 4] !== i) {
              valid = false;
            }
          }
        });
      }
    });

    return valid;
  }

  console.log(validate(tilegrid.grids, tilegrid.tiles));

})(this, this.document);
/* demo end */
