var spawn = require("child_process").spawn;

module.exports = function (source) {
  var callback = this.async();
  var haml;
  var loaderUtils;
  var loaderOptions;
  var result = "";

  this.cacheablecacheable && this.cacheable(true);

  loaderUtils = require("loader-utils");
  loaderOptions = loaderUtils.getOptions(this);

  try {
    haml = spawn("haml", ["-s"]);
    haml.stdin.write(source);
    haml.stdin.end();
    haml.stdout.on("data", function (data) {
      result = result + data;
    });
    haml.stderr.on(
      "data",
      function (data) {
        this.emitError(data);
      }.bind(this)
    );
    haml.on(
      "close",
      function (code) {
        if (code === 0) {
          callback(null, "module.exports = " + JSON.stringify(result) + ";");
        } else {
          this.emitError("`haml` exited with code " + code);
          callback("haml exited with code " + code);
        }
      }.bind(this)
    );
  } catch (err) {
    this.emitError("Exception in ruby-haml-loader:" + err);
    callback(err);
  }
};
