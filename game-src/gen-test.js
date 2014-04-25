
var run = require('gen-run');
run(function*() {
  for (var i = 0; i < 10; i++) {
    document.body.textContent += " " + i;
    yield sleep(500);
  }
  document.body.textContent += " " + i;
});

function sleep(ms) {
  return function (callback) {
    setTimeout(callback, ms);
  };
}
