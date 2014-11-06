# Demo

---

## Normal usage

<div id="grid"></div>
<div id="check"></div>

````javascript
seajs.use('tilegrid', function(TileGrid) {

  var gridBox = document.getElementById('grid');

  function random() {
    return Math.random() > 0.5 ? -1 : 1;
  }

  function randomColor() {
    return 'rgb(' + parseInt(255 * Math.random()) + ', ' + parseInt(255 * Math.random()) + ', ' + parseInt(255 * Math.random()) + ')';
  }

  function styl(elem, data) {
    var p;
    for (p in data) {
      elem.style[p] = data[p];
    }
  }

  styl(gridBox, {
    position: 'relative',
    width: '400px',
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
      left: 100 * (index % 4) + 'px',
      top: 100 * (index > 3 ? 1 : 0) + 'px',
      width: width + 'px',
      height: height + 'px',
      background: randomColor()
    });

    gridBox.appendChild(tileBox);
  }

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

  document.getElementById('check').innerHTML = '铺贴结果：' + (validate(tilegrid.grids, tilegrid.tiles) ? '正确' : '错误');
});
````
