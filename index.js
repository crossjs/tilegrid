'use strict';

var TileGrid = function(data) {
  var p;

  if (data) {
    for (p in data) {
      if (data.hasOwnProperty(p)) {
        this[p] = data[p];
      }
    }
  }

  this.length = this.grids.length;
  this.middle = this.length / 2;
};

TileGrid.prototype.arrange = function() {
  var tiles = this.tiles,
    scope = this, count = 2;

  // 第一轮，排横版，1 个
  tiles.some(function(tile, i) {
    if (scope.tileIsHor(tile)) {
      scope.placeHor(i % scope.length, tile);
      return true;
    }
  });

  // 第二轮，排竖版，1 个
  tiles.some(function(tile, i) {
    if (scope.tileIsVer(tile)) {
      scope.placeVer(i % scope.middle, tile);
      return true;
    }
  });

  // 第三轮，排常规，6 个
  tiles.some(function(tile, i) {
    if (scope.TileIsNor(tile)) {
      scope.placeNor(i % scope.length, tile);

      if (++count === scope.length) {
        return true;
      }
    }
  });

  return this;
};

// FOR OVERRIDE
TileGrid.prototype.tileIsHor = function(tile) {
  return tile[0] > 1;
};

// FOR OVERRIDE
TileGrid.prototype.tileIsVer = function(tile) {
  return tile[1] > 1;
};

// FOR OVERRIDE
TileGrid.prototype.TileIsNor = function(tile) {
  return tile[0] === tile[1];
};

// FOR OVERRIDE
TileGrid.prototype.paint = function(tile, index, index2) {
};

TileGrid.prototype.gridIsEmpty = function(index) {
  return this.grids[index] === -1;
};

// 横版 2*1
TileGrid.prototype.placeHor = function(index, tile) {
  var grids = this.grids,
    slotIndex = index,
    slotIndex2;

  // 位置不够长，往回缩
  while (slotIndex % this.middle > this.middle - 2) {
    slotIndex--;
  }

  slotIndex2 = slotIndex + 1;

  // 如果位置已经被占，重新安排
  // if (!this.gridIsEmpty(slotIndex)) {
    // this.placeNor((slotIndex + 2) % this.length, tile, [slotIndex, slotIndex2]);
  // }

  // 如果位置已经被占，重新安排
  // if (!this.gridIsEmpty(slotIndex2)) {
    // this.placeNor((slotIndex2 + 2) % this.length, tile, [slotIndex, slotIndex2]);
  // }

  // 占坑
  grids[slotIndex] = grids[slotIndex2] = tile;

  // 画图
  this.paint(tile, slotIndex, slotIndex2);
};

// 竖版 1*2
TileGrid.prototype.placeVer = function(index, tile) {
  var grids = this.grids,
    slotIndex = index,
    slotIndex2 = slotIndex + this.middle;

  while (slotIndex !== -1 && !(this.gridIsEmpty(slotIndex) && this.gridIsEmpty(slotIndex2))) {
    slotIndex++;

    // 走到尽头，从头开始
    if (slotIndex >= this.middle) {
      slotIndex = 0;
    }

    slotIndex2 = slotIndex + this.middle;

    // 没有找到空位
    // if (slotIndex === index) {
      // slotIndex = -1;
    // }
  }

  // 没有找到空位，强制插入到默认位置
  // if (slotIndex === -1) {
    // slotIndex = index;
    // slotIndex2 = slotIndex + this.middle;
  // }

  // 如果位置已经被占，重新安排
  // if (!this.gridIsEmpty(slotIndex)) {
    // this.placeNor(slotIndex + 1, tile, [slotIndex, slotIndex2]);
  // }

  // 如果位置已经被占，重新安排
  // if (!this.gridIsEmpty(slotIndex + this.middle)) {
    // this.placeNor(slotIndex2 + 1, tile, [slotIndex, slotIndex2]);
  // }

  // 占坑
  grids[slotIndex] = grids[slotIndex2] = tile;

  // 画图
  this.paint(tile, slotIndex, slotIndex2);
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
    if (slotIndex >= this.length) {
      slotIndex = 0;
    }

    // 没有找到空位
    if (slotIndex === index) {
      slotIndex = -1;
    }
  }

  if (slotIndex > -1) {
    // 占坑
    grids[slotIndex] = tile;

    // 画图
    this.paint(tile, slotIndex);
  }
};

module.exports = TileGrid;
