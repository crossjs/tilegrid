var expect = require('expect.js');
var TileGrid = require('../tilegrid');

describe('tilegrid', function() {

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

  function random() {
    return Math.random() > 0.5 ? -1 : 1;
  }

  it('arrange 1000 times', function() {

    var tilegrid, n = 1000;

    while (n--) {
      tilegrid = new TileGrid({
        grids: [-1, -1, -1, -1, -1, -1, -1, -1],
        tiles: [
          [1, 1],
          [1, 1],
          [1, 1],
          [1, 1],
          [2, 1],
          [1, 2]
        ].sort(random)
      }).arrange();

      expect(validate(tilegrid.grids, tilegrid.tiles)).to.ok();
    }

  });

});
