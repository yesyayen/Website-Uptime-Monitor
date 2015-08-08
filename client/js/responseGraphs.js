(function basic(container) {

  var
    d1 = [[0, 3], [4, 8], [8, 5], [9, 13]], // First data series                              // Second data series
    i, graph;

  // Draw Graph
  graph = Flotr.draw(container, [ d1 ], {
    xaxis: {
      minorTickFreq: 4
    }, 
    grid: {
      minorVerticalLines: true
    }
  });
})(document.getElementById("editor-render-0"));


