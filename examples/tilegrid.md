# Demo

---

## Normal usage

<div id="grid"></div>
<div id="check"></div>

````javascript
seajs.use('index', function(TileGrid) {

  var grids = [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1]
              .slice(0, 6 + parseInt(Math.random() * 3, 10) * 2);

  console.log(grids.length);

  var gridBox = document.getElementById('grid');

  function random() {
    return Math.random() > 0.5 ? -1 : 1;
  }

  function randomColor() {
    return 'rgb(' +
      parseInt(255 * Math.random()) + ', ' +
      parseInt(255 * Math.random()) + ', ' +
      parseInt(255 * Math.random()) + ')';
  }

  function styl(elem, data) {
    var p;
    for (p in data) {
      elem.style[p] = data[p];
    }
  }

  styl(gridBox, {
    position: 'relative',
    width: (grids.length / 2) * 100 + 'px',
    height: '200px',
    border: '10px solid ' + randomColor()
  });

  function paint(tile, index, index2) {
    var tileBox = document.createElement('div'),
      width = 100,
      height = 100;

    if (typeof index2 !== 'undefined') {
      if (index - index2 === -1) {
        width = 200;
      } else {
        height = 200;
      }
    }

    styl(tileBox, {
      position: 'absolute',
      left: 100 * (index % this.middle) + 'px',
      top: 100 * (index >= this.middle ? 1 : 0) + 'px',
      width: width + 'px',
      height: height + 'px',
      background: randomColor()
    });

    gridBox.appendChild(tileBox);
  }

  /**
   * 验证排列是否正确
   */
  function validate(tilegrid) {
    var valid = true;

    var tiles = tilegrid.tiles,
      grids = tilegrid.grids,
      length = tilegrid.length,
      middle = tilegrid.middle;

    tiles.forEach(function(tile, i) {
      if (!valid) {
        return;
      }

      if (grids.indexOf(tile) === -1) {
        return;
      }

      // 横版
      if (tile[0] > 1) {
        grids.forEach(function(slot, index) {
          if (!valid) {
            return;
          }

          if (slot === tile) {
            if (grids[index - 1] !== tile && grids[index + 1] !== tile) {
              valid = false;
              return;
            }
          }
        });
      }
      // 竖版
      else if (tile[1] > 1) {
        grids.forEach(function(slot, index) {
          if (!valid) {
            return;
          }

          if (slot === tile) {
            if (grids[index - middle] !== tile && grids[index + middle] !== tile) {
              valid = false;
              return;
            }
          }
        });
      }
    });

    return valid;
  }

  var tilegrid = new TileGrid({
    grids: grids,
    tiles: [
      [1, 1],
      [1, 1],
      [1, 1],
      [1, 1],
      [1, 1],
      [1, 1],
      [2, 1],
      [1, 2],
      [1, 1],
      [1, 1],
      [1, 1],
      [1, 1],
      [1, 1],
      [1, 1],
      [2, 1],
      [1, 2]
    ].sort(random),
    paint: paint
  }).arrange();

  document.getElementById('check').innerHTML = '随机铺贴结果：' + (validate(tilegrid) ? '正确' : '错误');
});
````
