'use strict';

var expect = require('expect.js');
var TileGrid = require('../index');

/*globals describe, it*/

describe('tilegrid', function() {
  var grids = [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1].slice(0, 6 + parseInt(Math.random() * 3, 10) * 2);

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

  function random() {
    return Math.random() > 0.5 ? -1 : 1;
  }

  it('arrange 1000 times', function() {

    var tilegrid, n = 1000;

    while (n--) {
      tilegrid = new TileGrid({
        grids: grids.slice(),
        tiles: [
          [1, 1],
          [1, 1],
          [1, 1],
          [1, 1],
          [1, 1],
          [1, 1],
          [1, 1],
          [1, 1],
          [2, 1],
          [1, 2]
        ].sort(random)
      }).arrange();

      expect(validate(tilegrid)).to.be.ok();
    }

  });

});
