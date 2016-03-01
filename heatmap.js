(function() {

  d3.heatmap = function() {
    var dx = 0.1,
        dy = 0.1, 
        std = 2,
        x = heatmapX,
        y = heatmapY;

    function heatmap(points) {
      var xExtent = d3.extent(points, function(d, i){ return x.call(heatmap, d, i) ;});
      var yExtent = d3.extent(points, function(d, i){ return y.call(heatmap, d, i) ;});
      var bins = [];
      var xRange = d3.range(xExtent[0], xExtent[1] + dx, dx);
      var yRange = d3.range(yExtent[0], yExtent[1] + dx, dx);
      yRange.forEach(function(Y){
        xRange.forEach(function(X){
          var pi = trunc(X / dx); 
          var pj = trunc(Y / dy);
          var bin = [];
          bin.i = pi;
          bin.j = pj;
          bin.x = pi * dx;
          bin.y = pj * dy;
          bins.push(bin);
        });
      });

      points.forEach(function(point, i) {
        var py = (y.call(heatmap, point, i) - yExtent[0]) / dy; 
        var pj = trunc(py);
        var px = (x.call(heatmap, point, i) - xExtent[0]) / dx;
        var pi = trunc(px);

        var bin = bins[xRange.length * pj + pi];
        bin.push(point);
      });
      // apply gaussian blur
      
      var blurred = new Array(bins.length);
      blurred = gaussBlur_4(bins.map(function(d){return d.length;}), xRange.length, yRange.length, std);
      bins.forEach(function(d, i) {
        d.v = blurred[i];
      });
      return bins;
    }

    heatmap.x = function(_) {
      if (!arguments.length) return x;
      x = _;
      return heatmap;
    };

    heatmap.y = function(_) {
      if (!arguments.length) return y;
      y = _;
      return heatmap;
    };

    heatmap.dx = function(_) {
      if (!arguments.length) return dx;
      dx = _;
      return heatmap;
    };

    heatmap.dy = function(_) {
      if (!arguments.length) return dy;
      dy = _;
      return heatmap;
    };

    heatmap.std = function(_) {
      if (!arguments.length) return std;
      std = _;
      return heatmap;
    };

    return heatmap;
  };

  var heatmapX = function(d) { return d[0]; },
      heatmapY = function(d) { return d[1]; };

})();

function trunc(x) {
  return x < 0 ? Math.ceil(x) : Math.floor(x);
}

function boxesForGauss(sigma, n)  // standard deviation, number of boxes
{
  var wIdeal = Math.sqrt((12 * sigma * sigma / n) + 1);  // Ideal averaging filter width 
  var wl = Math.floor(wIdeal);  if(wl%2 == 0) wl--;
  var wu = wl + 2;
      
  var mIdeal = (12 * sigma * sigma - n * wl * wl - 4 * n * wl - 3 * n) / (-4 * wl - 4);
  var m = Math.round(mIdeal);
      
  var sizes = [];  for(var i=0; i<n; i++) sizes.push(i<m?wl:wu);
  return sizes;
}
function gaussBlur_4 (scl, w, h, r) {
  var bxs = boxesForGauss(r, 3);
  var tcl = new Array(scl.length); 
  boxBlur_4 (scl, tcl, w, h, (bxs[0] - 1) / 2);
  boxBlur_4 (tcl, scl, w, h, (bxs[1] - 1) / 2);
  boxBlur_4 (scl, tcl, w, h, (bxs[2] - 1) / 2);
  return tcl;
}
function boxBlur_4 (scl, tcl, w, h, r) {
  for(var i=0; i < scl.length; i++) tcl[i] = scl[i];
  boxBlurH_4(tcl, scl, w, h, r);
  boxBlurT_4(scl, tcl, w, h, r);
}
function boxBlurH_4 (scl, tcl, w, h, r) {
  var iarr = 1 / (r + r + 1);
  for(var i=0; i<h; i++) {
    var j;
    var ti = i * w, li = ti, ri = ti + r;
    var fv = scl[ti], lv = scl[ti + w - 1], val = (r + 1) * fv;
    for(j = 0; j<r; j++) {val += scl[ti + j];}
    for(j = 0  ; j <= r ; j++) {
      val += scl[ri++] - fv ;
      tcl[ti++] = val * iarr;
    }
    for(j = r + 1; j < w - r; j++) {
      val += scl[ri++] - scl[li++];
      tcl[ti++] = val * iarr;
    }
    for(j = w - r; j < w  ; j++) {
      val += lv - scl[li++];
      tcl[ti++] = val * iarr;
    }
  }
}
function boxBlurT_4 (scl, tcl, w, h, r) {
  var iarr = 1 / (r + r + 1);
  for(var i = 0; i < w; i++) {
    var j;
    var ti = i,
        li = ti,
        ri = ti + r * w;
    var fv = scl[ti],
        lv = scl[ti + w * (h - 1)],
        val = (r + 1) * fv;
    for(j = 0; j < r; j++) { val += scl[ti + j * w]; }
    for(j = 0  ; j <= r ; j++) {
      val += scl[ri] - fv;
      tcl[ti] = val * iarr;
      ri += w;
      ti += w;
    }
    for(j = r + 1; j < h - r; j++) {
      val += scl[ri] - scl[li];
      tcl[ti] = val * iarr;
      li += w;
      ri +=w;
      ti += w;
    }
    for(j = h - r; j<h  ; j++) {
      val += lv - scl[li];
      tcl[ti] = val * iarr;
      li += w;
      ti += w;
    }
  }
}

