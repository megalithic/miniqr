// Generated by CoffeeScript 1.3.1
(function() {
  var Miniqr, scan;

  Miniqr = {};

  Miniqr.errorCallback = function(e) {};

  Miniqr.callback = qrcode.callback = function(data) {
    if (data) {
      return typeof console !== "undefined" && console !== null ? typeof console.log === "function" ? console.log(data) : void 0 : void 0;
    } else {
      return Miniqr.errorCallback(data);
    }
  };

  scan = function(video, canvas, ctx, options) {
    ctx.restore();
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    try {
      qrcode.decode(canvas);
    } catch (e) {
      if (e.toString() === "Couldn't find enough finder patterns") {

      } else {
        ctx.restore();
        ctx.translate(canvas.width, 0);
        ctx.scale(-1, 1);
        try {
          qrcode.decode(canvas);
        } catch (e2) {
          ctx.restore();
          ctx.rotate(Math.PI);
          ctx.drawImage(canvas, canvas.width * -1, canvas.height * -1);
          try {
            qrcode.decode(canvas);
          } catch (e3) {
            Miniqr.errorCallback(e3);
          } finally {
            ctx.rotate(Math.PI);
          }
        }
      }
    }
    if (options.scanloop === true) {
      return window.setTimeout((function() {
        return scan(video, canvas, ctx, options);
      }), 1000 / options.fps);
    }
  };

  Miniqr.getUserQR = function(videoSuccess, videoError, qrSuccess, qrError, options) {
    var canvas, ctx, default_options, key, options_, val, videoPreSuccess;
    canvas = document.createElement('canvas');
    ctx = canvas.getContext('2d');
    ctx.save();
    default_options = {
      fps: 10,
      scanloop: true,
      width: 320,
      height: 240,
      controls: false
    };
    options_ = {};
    for (key in default_options) {
      val = default_options[key];
      options_[key] = val;
    }
    for (key in options) {
      val = options[key];
      options_[key] = val;
    }
    options = options_;
    if (qrSuccess != null) {
      Miniqr.callback = qrcode.callback = qrSuccess;
    }
    if (qrError != null) {
      Miniqr.errorCallback = qrError;
    }
    videoPreSuccess = function(video, stream) {
      scan(video, canvas, ctx, options);
      return videoSuccess(video, stream);
    };
    return Sinne.getUserVideo(videoPreSuccess, videoError, options);
  };

  window.Miniqr = Miniqr;

}).call(this);
