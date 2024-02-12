var CanvasKitInit = (() => {
  var _scriptDir = typeof document !== 'undefined' && document.currentScript ? document.currentScript.src : undefined;
  if (typeof __filename !== 'undefined') _scriptDir = _scriptDir || __filename;
  return function (CanvasKitInit = {}) {
    var r;
    r || (r = typeof CanvasKitInit !== 'undefined' ? CanvasKitInit : {});
    var aa, ba;
    r.ready = new Promise(function (a, b) {
      aa = a;
      ba = b;
    });
    (function (a) {
      a.Id = a.Id || [];
      a.Id.push(function () {
        a.MakeSWCanvasSurface = function (b) {
          var c = b,
            e = "undefined" !== typeof OffscreenCanvas && c instanceof OffscreenCanvas;
          if (!("undefined" !== typeof HTMLCanvasElement && c instanceof HTMLCanvasElement || e || (c = document.getElementById(b), c))) throw "Canvas with id " + b + " was not found";
          if (b = a.MakeSurface(c.width, c.height)) b.fe = c;
          return b;
        };
        a.MakeCanvasSurface || (a.MakeCanvasSurface = a.MakeSWCanvasSurface);
        a.MakeSurface = function (b, c) {
          var e = {
              width: b,
              height: c,
              colorType: a.ColorType.RGBA_8888,
              alphaType: a.AlphaType.Unpremul,
              colorSpace: a.ColorSpace.SRGB
            },
            f = b * c * 4,
            k = a._malloc(f);
          if (e = a.Surface._makeRasterDirect(e, k, 4 * b)) e.fe = null, e.Qe = b, e.Ne = c, e.Oe = f, e.pe = k, e.getCanvas().clear(a.TRANSPARENT);
          return e;
        };
        a.MakeRasterDirectSurface = function (b, c, e) {
          return a.Surface._makeRasterDirect(b, c.byteOffset, e);
        };
        a.Surface.prototype.flush = function (b) {
          a.Fd(this.Ed);
          this._flush();
          if (this.fe) {
            var c = new Uint8ClampedArray(a.HEAPU8.buffer, this.pe, this.Oe);
            c = new ImageData(c, this.Qe, this.Ne);
            b ? this.fe.getContext("2d").putImageData(c, 0, 0, b[0], b[1], b[2] - b[0], b[3] - b[1]) : this.fe.getContext("2d").putImageData(c, 0, 0);
          }
        };
        a.Surface.prototype.dispose = function () {
          this.pe && a._free(this.pe);
          this.delete();
        };
        a.Fd = a.Fd || function () {};
        a.ge = a.ge || function () {
          return null;
        };
      });
    })(r);
    (function (a) {
      a.Id = a.Id || [];
      a.Id.push(function () {
        function b(l, q, x) {
          return l && l.hasOwnProperty(q) ? l[q] : x;
        }
        function c(l) {
          var q = ca(ea);
          ea[q] = l;
          return q;
        }
        function e(l) {
          return l.naturalHeight || l.videoHeight || l.displayHeight || l.height;
        }
        function f(l) {
          return l.naturalWidth || l.videoWidth || l.displayWidth || l.width;
        }
        function k(l, q, x, y) {
          l.bindTexture(l.TEXTURE_2D, q);
          y || x.alphaType !== a.AlphaType.Premul || l.pixelStorei(l.UNPACK_PREMULTIPLY_ALPHA_WEBGL, !0);
          return q;
        }
        function m(l, q, x) {
          x || q.alphaType !== a.AlphaType.Premul || l.pixelStorei(l.UNPACK_PREMULTIPLY_ALPHA_WEBGL, !1);
          l.bindTexture(l.TEXTURE_2D, null);
        }
        a.GetWebGLContext = function (l, q) {
          if (!l) throw "null canvas passed into makeWebGLContext";
          var x = {
            alpha: b(q, "alpha", 1),
            depth: b(q, "depth", 1),
            stencil: b(q, "stencil", 8),
            antialias: b(q, "antialias", 0),
            premultipliedAlpha: b(q, "premultipliedAlpha", 1),
            preserveDrawingBuffer: b(q, "preserveDrawingBuffer", 0),
            preferLowPowerToHighPerformance: b(q, "preferLowPowerToHighPerformance", 0),
            failIfMajorPerformanceCaveat: b(q, "failIfMajorPerformanceCaveat", 0),
            enableExtensionsByDefault: b(q, "enableExtensionsByDefault", 1),
            explicitSwapControl: b(q, "explicitSwapControl", 0),
            renderViaOffscreenBackBuffer: b(q, "renderViaOffscreenBackBuffer", 0)
          };
          x.majorVersion = q && q.majorVersion ? q.majorVersion : "undefined" !== typeof WebGL2RenderingContext ? 2 : 1;
          if (x.explicitSwapControl) throw "explicitSwapControl is not supported";
          l = fa(l, x);
          if (!l) return 0;
          ha(l);
          u.Pd.getExtension("WEBGL_debug_renderer_info");
          return l;
        };
        a.deleteContext = function (l) {
          u === ia[l] && (u = null);
          "object" == typeof JSEvents && JSEvents.vf(ia[l].Pd.canvas);
          ia[l] && ia[l].Pd.canvas && (ia[l].Pd.canvas.He = void 0);
          ia[l] = null;
        };
        a._setTextureCleanup({
          deleteTexture: function (l, q) {
            var x = ea[q];
            x && ia[l].Pd.deleteTexture(x);
            ea[q] = null;
          }
        });
        a.MakeWebGLContext = function (l) {
          if (!this.Fd(l)) return null;
          var q = this._MakeGrContext();
          if (!q) return null;
          q.Ed = l;
          var x = q.delete.bind(q);
          q["delete"] = function () {
            a.Fd(this.Ed);
            x();
          }.bind(q);
          return u.re = q;
        };
        a.MakeGrContext = a.MakeWebGLContext;
        a.GrDirectContext.prototype.getResourceCacheLimitBytes = function () {
          a.Fd(this.Ed);
          this._getResourceCacheLimitBytes();
        };
        a.GrDirectContext.prototype.getResourceCacheUsageBytes = function () {
          a.Fd(this.Ed);
          this._getResourceCacheUsageBytes();
        };
        a.GrDirectContext.prototype.releaseResourcesAndAbandonContext = function () {
          a.Fd(this.Ed);
          this._releaseResourcesAndAbandonContext();
        };
        a.GrDirectContext.prototype.setResourceCacheLimitBytes = function (l) {
          a.Fd(this.Ed);
          this._setResourceCacheLimitBytes(l);
        };
        a.MakeOnScreenGLSurface = function (l, q, x, y, B, D) {
          if (!this.Fd(l.Ed)) return null;
          q = void 0 === B || void 0 === D ? this._MakeOnScreenGLSurface(l, q, x, y) : this._MakeOnScreenGLSurface(l, q, x, y, B, D);
          if (!q) return null;
          q.Ed = l.Ed;
          return q;
        };
        a.MakeRenderTarget = function () {
          var l = arguments[0];
          if (!this.Fd(l.Ed)) return null;
          if (3 === arguments.length) {
            var q = this._MakeRenderTargetWH(l, arguments[1], arguments[2]);
            if (!q) return null;
          } else if (2 === arguments.length) {
            if (q = this._MakeRenderTargetII(l, arguments[1]), !q) return null;
          } else return null;
          q.Ed = l.Ed;
          return q;
        };
        a.MakeWebGLCanvasSurface = function (l, q, x) {
          q = q || null;
          var y = l,
            B = "undefined" !== typeof OffscreenCanvas && y instanceof OffscreenCanvas;
          if (!("undefined" !== typeof HTMLCanvasElement && y instanceof HTMLCanvasElement || B || (y = document.getElementById(l), y))) throw "Canvas with id " + l + " was not found";
          l = this.GetWebGLContext(y, x);
          if (!l || 0 > l) throw "failed to create webgl context: err " + l;
          l = this.MakeWebGLContext(l);
          q = this.MakeOnScreenGLSurface(l, y.width, y.height, q);
          return q ? q : (q = y.cloneNode(!0), y.parentNode.replaceChild(q, y), q.classList.add("ck-replaced"), a.MakeSWCanvasSurface(q));
        };
        a.MakeCanvasSurface = a.MakeWebGLCanvasSurface;
        a.Surface.prototype.makeImageFromTexture = function (l, q) {
          a.Fd(this.Ed);
          l = c(l);
          if (q = this._makeImageFromTexture(this.Ed, l, q)) q.be = l;
          return q;
        };
        a.Surface.prototype.makeImageFromTextureSource = function (l, q, x) {
          q || (q = {
            height: e(l),
            width: f(l),
            colorType: a.ColorType.RGBA_8888,
            alphaType: x ? a.AlphaType.Premul : a.AlphaType.Unpremul
          });
          q.colorSpace || (q.colorSpace = a.ColorSpace.SRGB);
          a.Fd(this.Ed);
          var y = u.Pd;
          x = k(y, y.createTexture(), q, x);
          2 === u.version ? y.texImage2D(y.TEXTURE_2D, 0, y.RGBA, q.width, q.height, 0, y.RGBA, y.UNSIGNED_BYTE, l) : y.texImage2D(y.TEXTURE_2D, 0, y.RGBA, y.RGBA, y.UNSIGNED_BYTE, l);
          m(y, q);
          this._resetContext();
          return this.makeImageFromTexture(x, q);
        };
        a.Surface.prototype.updateTextureFromSource = function (l, q, x) {
          if (l.be) {
            a.Fd(this.Ed);
            var y = l.getImageInfo(),
              B = u.Pd,
              D = k(B, ea[l.be], y, x);
            2 === u.version ? B.texImage2D(B.TEXTURE_2D, 0, B.RGBA, f(q), e(q), 0, B.RGBA, B.UNSIGNED_BYTE, q) : B.texImage2D(B.TEXTURE_2D, 0, B.RGBA, B.RGBA, B.UNSIGNED_BYTE, q);
            m(B, y, x);
            this._resetContext();
            ea[l.be] = null;
            l.be = c(D);
            y.colorSpace = l.getColorSpace();
            q = this._makeImageFromTexture(this.Ed, l.be, y);
            x = l.jd.Gd;
            B = l.jd.Ld;
            l.jd.Gd = q.jd.Gd;
            l.jd.Ld = q.jd.Ld;
            q.jd.Gd = x;
            q.jd.Ld = B;
            q.delete();
            y.colorSpace.delete();
          }
        };
        a.MakeLazyImageFromTextureSource = function (l, q, x) {
          q || (q = {
            height: e(l),
            width: f(l),
            colorType: a.ColorType.RGBA_8888,
            alphaType: x ? a.AlphaType.Premul : a.AlphaType.Unpremul
          });
          q.colorSpace || (q.colorSpace = a.ColorSpace.SRGB);
          var y = {
            makeTexture: function () {
              var B = u,
                D = B.Pd,
                v = k(D, D.createTexture(), q, x);
              2 === B.version ? D.texImage2D(D.TEXTURE_2D, 0, D.RGBA, q.width, q.height, 0, D.RGBA, D.UNSIGNED_BYTE, l) : D.texImage2D(D.TEXTURE_2D, 0, D.RGBA, D.RGBA, D.UNSIGNED_BYTE, l);
              m(D, q, x);
              return c(v);
            },
            freeSrc: function () {}
          };
          "VideoFrame" === l.constructor.name && (y.freeSrc = function () {
            l.close();
          });
          return a.Image._makeFromGenerator(q, y);
        };
        a.Fd = function (l) {
          return l ? ha(l) : !1;
        };
        a.ge = function () {
          return u && u.re && !u.re.isDeleted() ? u.re : null;
        };
      });
    })(r);
    (function (a) {
      function b(g) {
        return (f(255 * g[3]) << 24 | f(255 * g[0]) << 16 | f(255 * g[1]) << 8 | f(255 * g[2]) << 0) >>> 0;
      }
      function c(g) {
        if (g && g._ck) return g;
        if (g instanceof Float32Array) {
          for (var d = Math.floor(g.length / 4), h = new Uint32Array(d), n = 0; n < d; n++) h[n] = b(g.slice(4 * n, 4 * (n + 1)));
          return h;
        }
        if (g instanceof Uint32Array) return g;
        if (g instanceof Array && g[0] instanceof Float32Array) return g.map(b);
      }
      function e(g) {
        if (void 0 === g) return 1;
        var d = parseFloat(g);
        return g && -1 !== g.indexOf("%") ? d / 100 : d;
      }
      function f(g) {
        return Math.round(Math.max(0, Math.min(g || 0, 255)));
      }
      function k(g, d) {
        d && d._ck || a._free(g);
      }
      function m(g, d, h) {
        if (!g || !g.length) return M;
        if (g && g._ck) return g.byteOffset;
        var n = a[d].BYTES_PER_ELEMENT;
        h || (h = a._malloc(g.length * n));
        a[d].set(g, h / n);
        return h;
      }
      function l(g) {
        var d = {
          Md: M,
          count: g.length,
          colorType: a.ColorType.RGBA_F32
        };
        if (g instanceof Float32Array) d.Md = m(g, "HEAPF32"), d.count = g.length / 4;else if (g instanceof Uint32Array) d.Md = m(g, "HEAPU32"), d.colorType = a.ColorType.RGBA_8888;else if (g instanceof Array) {
          if (g && g.length) {
            for (var h = a._malloc(16 * g.length), n = 0, t = h / 4, w = 0; w < g.length; w++) for (var z = 0; 4 > z; z++) a.HEAPF32[t + n] = g[w][z], n++;
            g = h;
          } else g = M;
          d.Md = g;
        } else throw "Invalid argument to copyFlexibleColorArray, Not a color array " + typeof g;
        return d;
      }
      function q(g) {
        if (!g) return M;
        var d = S.toTypedArray();
        if (g.length) {
          if (6 === g.length || 9 === g.length) return m(g, "HEAPF32", H), 6 === g.length && a.HEAPF32.set(dd, 6 + H / 4), H;
          if (16 === g.length) return d[0] = g[0], d[1] = g[1], d[2] = g[3], d[3] = g[4], d[4] = g[5], d[5] = g[7], d[6] = g[12], d[7] = g[13], d[8] = g[15], H;
          throw "invalid matrix size";
        }
        if (void 0 === g.m11) throw "invalid matrix argument";
        d[0] = g.m11;
        d[1] = g.m21;
        d[2] = g.m41;
        d[3] = g.m12;
        d[4] = g.m22;
        d[5] = g.m42;
        d[6] = g.m14;
        d[7] = g.m24;
        d[8] = g.m44;
        return H;
      }
      function x(g) {
        if (!g) return M;
        var d = da.toTypedArray();
        if (g.length) {
          if (16 !== g.length && 6 !== g.length && 9 !== g.length) throw "invalid matrix size";
          if (16 === g.length) return m(g, "HEAPF32", Y);
          d.fill(0);
          d[0] = g[0];
          d[1] = g[1];
          d[3] = g[2];
          d[4] = g[3];
          d[5] = g[4];
          d[7] = g[5];
          d[10] = 1;
          d[12] = g[6];
          d[13] = g[7];
          d[15] = g[8];
          6 === g.length && (d[12] = 0, d[13] = 0, d[15] = 1);
          return Y;
        }
        if (void 0 === g.m11) throw "invalid matrix argument";
        d[0] = g.m11;
        d[1] = g.m21;
        d[2] = g.m31;
        d[3] = g.m41;
        d[4] = g.m12;
        d[5] = g.m22;
        d[6] = g.m32;
        d[7] = g.m42;
        d[8] = g.m13;
        d[9] = g.m23;
        d[10] = g.m33;
        d[11] = g.m43;
        d[12] = g.m14;
        d[13] = g.m24;
        d[14] = g.m34;
        d[15] = g.m44;
        return Y;
      }
      function y(g, d) {
        return m(g, "HEAPF32", d || ua);
      }
      function B(g, d, h, n) {
        var t = La.toTypedArray();
        t[0] = g;
        t[1] = d;
        t[2] = h;
        t[3] = n;
        return ua;
      }
      function D(g) {
        for (var d = new Float32Array(4), h = 0; 4 > h; h++) d[h] = a.HEAPF32[g / 4 + h];
        return d;
      }
      function v(g, d) {
        return m(g, "HEAPF32", d || V);
      }
      function E(g, d) {
        return m(g, "HEAPF32", d || Cb);
      }
      a.Color = function (g, d, h, n) {
        void 0 === n && (n = 1);
        return a.Color4f(f(g) / 255, f(d) / 255, f(h) / 255, n);
      };
      a.ColorAsInt = function (g, d, h, n) {
        void 0 === n && (n = 255);
        return (f(n) << 24 | f(g) << 16 | f(d) << 8 | f(h) << 0 & 268435455) >>> 0;
      };
      a.Color4f = function (g, d, h, n) {
        void 0 === n && (n = 1);
        return Float32Array.of(g, d, h, n);
      };
      Object.defineProperty(a, "TRANSPARENT", {
        get: function () {
          return a.Color4f(0, 0, 0, 0);
        }
      });
      Object.defineProperty(a, "BLACK", {
        get: function () {
          return a.Color4f(0, 0, 0, 1);
        }
      });
      Object.defineProperty(a, "WHITE", {
        get: function () {
          return a.Color4f(1, 1, 1, 1);
        }
      });
      Object.defineProperty(a, "RED", {
        get: function () {
          return a.Color4f(1, 0, 0, 1);
        }
      });
      Object.defineProperty(a, "GREEN", {
        get: function () {
          return a.Color4f(0, 1, 0, 1);
        }
      });
      Object.defineProperty(a, "BLUE", {
        get: function () {
          return a.Color4f(0, 0, 1, 1);
        }
      });
      Object.defineProperty(a, "YELLOW", {
        get: function () {
          return a.Color4f(1, 1, 0, 1);
        }
      });
      Object.defineProperty(a, "CYAN", {
        get: function () {
          return a.Color4f(0, 1, 1, 1);
        }
      });
      Object.defineProperty(a, "MAGENTA", {
        get: function () {
          return a.Color4f(1, 0, 1, 1);
        }
      });
      a.getColorComponents = function (g) {
        return [Math.floor(255 * g[0]), Math.floor(255 * g[1]), Math.floor(255 * g[2]), g[3]];
      };
      a.parseColorString = function (g, d) {
        g = g.toLowerCase();
        if (g.startsWith("#")) {
          d = 255;
          switch (g.length) {
            case 9:
              d = parseInt(g.slice(7, 9), 16);
            case 7:
              var h = parseInt(g.slice(1, 3), 16);
              var n = parseInt(g.slice(3, 5), 16);
              var t = parseInt(g.slice(5, 7), 16);
              break;
            case 5:
              d = 17 * parseInt(g.slice(4, 5), 16);
            case 4:
              h = 17 * parseInt(g.slice(1, 2), 16), n = 17 * parseInt(g.slice(2, 3), 16), t = 17 * parseInt(g.slice(3, 4), 16);
          }
          return a.Color(h, n, t, d / 255);
        }
        return g.startsWith("rgba") ? (g = g.slice(5, -1), g = g.split(","), a.Color(+g[0], +g[1], +g[2], e(g[3]))) : g.startsWith("rgb") ? (g = g.slice(4, -1), g = g.split(","), a.Color(+g[0], +g[1], +g[2], e(g[3]))) : g.startsWith("gray(") || g.startsWith("hsl") || !d || (g = d[g], void 0 === g) ? a.BLACK : g;
      };
      a.multiplyByAlpha = function (g, d) {
        g = g.slice();
        g[3] = Math.max(0, Math.min(g[3] * d, 1));
        return g;
      };
      a.Malloc = function (g, d) {
        var h = a._malloc(d * g.BYTES_PER_ELEMENT);
        return {
          _ck: !0,
          length: d,
          byteOffset: h,
          Wd: null,
          subarray: function (n, t) {
            n = this.toTypedArray().subarray(n, t);
            n._ck = !0;
            return n;
          },
          toTypedArray: function () {
            if (this.Wd && this.Wd.length) return this.Wd;
            this.Wd = new g(a.HEAPU8.buffer, h, d);
            this.Wd._ck = !0;
            return this.Wd;
          }
        };
      };
      a.Free = function (g) {
        a._free(g.byteOffset);
        g.byteOffset = M;
        g.toTypedArray = null;
        g.Wd = null;
      };
      var H = M,
        S,
        Y = M,
        da,
        ua = M,
        La,
        ma,
        V = M,
        gc,
        Aa = M,
        hc,
        Db = M,
        ic,
        Eb = M,
        Fb,
        gb = M,
        jc,
        Cb = M,
        kc,
        lc = M,
        dd = Float32Array.of(0, 0, 1),
        M = 0;
      a.onRuntimeInitialized = function () {
        function g(d, h, n, t, w, z, F) {
          z || (z = 4 * t.width, t.colorType === a.ColorType.RGBA_F16 ? z *= 2 : t.colorType === a.ColorType.RGBA_F32 && (z *= 4));
          var K = z * t.height;
          var I = w ? w.byteOffset : a._malloc(K);
          if (F ? !d._readPixels(t, I, z, h, n, F) : !d._readPixels(t, I, z, h, n)) return w || a._free(I), null;
          if (w) return w.toTypedArray();
          switch (t.colorType) {
            case a.ColorType.RGBA_8888:
            case a.ColorType.RGBA_F16:
              d = new Uint8Array(a.HEAPU8.buffer, I, K).slice();
              break;
            case a.ColorType.RGBA_F32:
              d = new Float32Array(a.HEAPU8.buffer, I, K).slice();
              break;
            default:
              return null;
          }
          a._free(I);
          return d;
        }
        La = a.Malloc(Float32Array, 4);
        ua = La.byteOffset;
        da = a.Malloc(Float32Array, 16);
        Y = da.byteOffset;
        S = a.Malloc(Float32Array, 9);
        H = S.byteOffset;
        jc = a.Malloc(Float32Array, 12);
        Cb = jc.byteOffset;
        kc = a.Malloc(Float32Array, 12);
        lc = kc.byteOffset;
        ma = a.Malloc(Float32Array, 4);
        V = ma.byteOffset;
        gc = a.Malloc(Float32Array, 4);
        Aa = gc.byteOffset;
        hc = a.Malloc(Float32Array, 3);
        Db = hc.byteOffset;
        ic = a.Malloc(Float32Array, 3);
        Eb = ic.byteOffset;
        Fb = a.Malloc(Int32Array, 4);
        gb = Fb.byteOffset;
        a.ColorSpace.SRGB = a.ColorSpace._MakeSRGB();
        a.ColorSpace.DISPLAY_P3 = a.ColorSpace._MakeDisplayP3();
        a.ColorSpace.ADOBE_RGB = a.ColorSpace._MakeAdobeRGB();
        a.GlyphRunFlags = {
          IsWhiteSpace: a._GlyphRunFlags_isWhiteSpace
        };
        a.Path.MakeFromCmds = function (d) {
          var h = m(d, "HEAPF32"),
            n = a.Path._MakeFromCmds(h, d.length);
          k(h, d);
          return n;
        };
        a.Path.MakeFromVerbsPointsWeights = function (d, h, n) {
          var t = m(d, "HEAPU8"),
            w = m(h, "HEAPF32"),
            z = m(n, "HEAPF32"),
            F = a.Path._MakeFromVerbsPointsWeights(t, d.length, w, h.length, z, n && n.length || 0);
          k(t, d);
          k(w, h);
          k(z, n);
          return F;
        };
        a.Path.prototype.addArc = function (d, h, n) {
          d = v(d);
          this._addArc(d, h, n);
          return this;
        };
        a.Path.prototype.addCircle = function (d, h, n, t) {
          this._addCircle(d, h, n, !!t);
          return this;
        };
        a.Path.prototype.addOval = function (d, h, n) {
          void 0 === n && (n = 1);
          d = v(d);
          this._addOval(d, !!h, n);
          return this;
        };
        a.Path.prototype.addPath = function () {
          var d = Array.prototype.slice.call(arguments),
            h = d[0],
            n = !1;
          "boolean" === typeof d[d.length - 1] && (n = d.pop());
          if (1 === d.length) this._addPath(h, 1, 0, 0, 0, 1, 0, 0, 0, 1, n);else if (2 === d.length) d = d[1], this._addPath(h, d[0], d[1], d[2], d[3], d[4], d[5], d[6] || 0, d[7] || 0, d[8] || 1, n);else if (7 === d.length || 10 === d.length) this._addPath(h, d[1], d[2], d[3], d[4], d[5], d[6], d[7] || 0, d[8] || 0, d[9] || 1, n);else return null;
          return this;
        };
        a.Path.prototype.addPoly = function (d, h) {
          var n = m(d, "HEAPF32");
          this._addPoly(n, d.length / 2, h);
          k(n, d);
          return this;
        };
        a.Path.prototype.addRect = function (d, h) {
          d = v(d);
          this._addRect(d, !!h);
          return this;
        };
        a.Path.prototype.addRRect = function (d, h) {
          d = E(d);
          this._addRRect(d, !!h);
          return this;
        };
        a.Path.prototype.addVerbsPointsWeights = function (d, h, n) {
          var t = m(d, "HEAPU8"),
            w = m(h, "HEAPF32"),
            z = m(n, "HEAPF32");
          this._addVerbsPointsWeights(t, d.length, w, h.length, z, n && n.length || 0);
          k(t, d);
          k(w, h);
          k(z, n);
        };
        a.Path.prototype.arc = function (d, h, n, t, w, z) {
          d = a.LTRBRect(d - n, h - n, d + n, h + n);
          w = (w - t) / Math.PI * 180 - 360 * !!z;
          z = new a.Path();
          z.addArc(d, t / Math.PI * 180, w);
          this.addPath(z, !0);
          z.delete();
          return this;
        };
        a.Path.prototype.arcToOval = function (d, h, n, t) {
          d = v(d);
          this._arcToOval(d, h, n, t);
          return this;
        };
        a.Path.prototype.arcToRotated = function (d, h, n, t, w, z, F) {
          this._arcToRotated(d, h, n, !!t, !!w, z, F);
          return this;
        };
        a.Path.prototype.arcToTangent = function (d, h, n, t, w) {
          this._arcToTangent(d, h, n, t, w);
          return this;
        };
        a.Path.prototype.close = function () {
          this._close();
          return this;
        };
        a.Path.prototype.conicTo = function (d, h, n, t, w) {
          this._conicTo(d, h, n, t, w);
          return this;
        };
        a.Path.prototype.computeTightBounds = function (d) {
          this._computeTightBounds(V);
          var h = ma.toTypedArray();
          return d ? (d.set(h), d) : h.slice();
        };
        a.Path.prototype.cubicTo = function (d, h, n, t, w, z) {
          this._cubicTo(d, h, n, t, w, z);
          return this;
        };
        a.Path.prototype.dash = function (d, h, n) {
          return this._dash(d, h, n) ? this : null;
        };
        a.Path.prototype.getBounds = function (d) {
          this._getBounds(V);
          var h = ma.toTypedArray();
          return d ? (d.set(h), d) : h.slice();
        };
        a.Path.prototype.lineTo = function (d, h) {
          this._lineTo(d, h);
          return this;
        };
        a.Path.prototype.moveTo = function (d, h) {
          this._moveTo(d, h);
          return this;
        };
        a.Path.prototype.offset = function (d, h) {
          this._transform(1, 0, d, 0, 1, h, 0, 0, 1);
          return this;
        };
        a.Path.prototype.quadTo = function (d, h, n, t) {
          this._quadTo(d, h, n, t);
          return this;
        };
        a.Path.prototype.rArcTo = function (d, h, n, t, w, z, F) {
          this._rArcTo(d, h, n, t, w, z, F);
          return this;
        };
        a.Path.prototype.rConicTo = function (d, h, n, t, w) {
          this._rConicTo(d, h, n, t, w);
          return this;
        };
        a.Path.prototype.rCubicTo = function (d, h, n, t, w, z) {
          this._rCubicTo(d, h, n, t, w, z);
          return this;
        };
        a.Path.prototype.rLineTo = function (d, h) {
          this._rLineTo(d, h);
          return this;
        };
        a.Path.prototype.rMoveTo = function (d, h) {
          this._rMoveTo(d, h);
          return this;
        };
        a.Path.prototype.rQuadTo = function (d, h, n, t) {
          this._rQuadTo(d, h, n, t);
          return this;
        };
        a.Path.prototype.stroke = function (d) {
          d = d || {};
          d.width = d.width || 1;
          d.miter_limit = d.miter_limit || 4;
          d.cap = d.cap || a.StrokeCap.Butt;
          d.join = d.join || a.StrokeJoin.Miter;
          d.precision = d.precision || 1;
          return this._stroke(d) ? this : null;
        };
        a.Path.prototype.transform = function () {
          if (1 === arguments.length) {
            var d = arguments[0];
            this._transform(d[0], d[1], d[2], d[3], d[4], d[5], d[6] || 0, d[7] || 0, d[8] || 1);
          } else if (6 === arguments.length || 9 === arguments.length) d = arguments, this._transform(d[0], d[1], d[2], d[3], d[4], d[5], d[6] || 0, d[7] || 0, d[8] || 1);else throw "transform expected to take 1 or 9 arguments. Got " + arguments.length;
          return this;
        };
        a.Path.prototype.trim = function (d, h, n) {
          return this._trim(d, h, !!n) ? this : null;
        };
        a.Image.prototype.encodeToBytes = function (d, h) {
          var n = a.ge();
          d = d || a.ImageFormat.PNG;
          h = h || 100;
          return n ? this._encodeToBytes(d, h, n) : this._encodeToBytes(d, h);
        };
        a.Image.prototype.makeShaderCubic = function (d, h, n, t, w) {
          w = q(w);
          return this._makeShaderCubic(d, h, n, t, w);
        };
        a.Image.prototype.makeShaderOptions = function (d, h, n, t, w) {
          w = q(w);
          return this._makeShaderOptions(d, h, n, t, w);
        };
        a.Image.prototype.readPixels = function (d, h, n, t, w) {
          var z = a.ge();
          return g(this, d, h, n, t, w, z);
        };
        a.Canvas.prototype.clear = function (d) {
          a.Fd(this.Ed);
          d = y(d);
          this._clear(d);
        };
        a.Canvas.prototype.clipRRect = function (d, h, n) {
          a.Fd(this.Ed);
          d = E(d);
          this._clipRRect(d, h, n);
        };
        a.Canvas.prototype.clipRect = function (d, h, n) {
          a.Fd(this.Ed);
          d = v(d);
          this._clipRect(d, h, n);
        };
        a.Canvas.prototype.concat = function (d) {
          a.Fd(this.Ed);
          d = x(d);
          this._concat(d);
        };
        a.Canvas.prototype.drawArc = function (d, h, n, t, w) {
          a.Fd(this.Ed);
          d = v(d);
          this._drawArc(d, h, n, t, w);
        };
        a.Canvas.prototype.drawAtlas = function (d, h, n, t, w, z, F) {
          if (d && t && h && n && h.length === n.length) {
            a.Fd(this.Ed);
            w || (w = a.BlendMode.SrcOver);
            var K = m(h, "HEAPF32"),
              I = m(n, "HEAPF32"),
              T = n.length / 4,
              p = m(c(z), "HEAPU32");
            if (F && "B" in F && "C" in F) this._drawAtlasCubic(d, I, K, p, T, w, F.B, F.C, t);else {
              let A = a.FilterMode.Linear,
                L = a.MipmapMode.None;
              F && (A = F.filter, "mipmap" in F && (L = F.mipmap));
              this._drawAtlasOptions(d, I, K, p, T, w, A, L, t);
            }
            k(K, h);
            k(I, n);
            k(p, z);
          }
        };
        a.Canvas.prototype.drawCircle = function (d, h, n, t) {
          a.Fd(this.Ed);
          this._drawCircle(d, h, n, t);
        };
        a.Canvas.prototype.drawColor = function (d, h) {
          a.Fd(this.Ed);
          d = y(d);
          void 0 !== h ? this._drawColor(d, h) : this._drawColor(d);
        };
        a.Canvas.prototype.drawColorInt = function (d, h) {
          a.Fd(this.Ed);
          this._drawColorInt(d, h || a.BlendMode.SrcOver);
        };
        a.Canvas.prototype.drawColorComponents = function (d, h, n, t, w) {
          a.Fd(this.Ed);
          d = B(d, h, n, t);
          void 0 !== w ? this._drawColor(d, w) : this._drawColor(d);
        };
        a.Canvas.prototype.drawDRRect = function (d, h, n) {
          a.Fd(this.Ed);
          d = E(d, Cb);
          h = E(h, lc);
          this._drawDRRect(d, h, n);
        };
        a.Canvas.prototype.drawImage = function (d, h, n, t) {
          a.Fd(this.Ed);
          this._drawImage(d, h, n, t || null);
        };
        a.Canvas.prototype.drawImageCubic = function (d, h, n, t, w, z) {
          a.Fd(this.Ed);
          this._drawImageCubic(d, h, n, t, w, z || null);
        };
        a.Canvas.prototype.drawImageOptions = function (d, h, n, t, w, z) {
          a.Fd(this.Ed);
          this._drawImageOptions(d, h, n, t, w, z || null);
        };
        a.Canvas.prototype.drawImageNine = function (d, h, n, t, w) {
          a.Fd(this.Ed);
          h = m(h, "HEAP32", gb);
          n = v(n);
          this._drawImageNine(d, h, n, t, w || null);
        };
        a.Canvas.prototype.drawImageRect = function (d, h, n, t, w) {
          a.Fd(this.Ed);
          v(h, V);
          v(n, Aa);
          this._drawImageRect(d, V, Aa, t, !!w);
        };
        a.Canvas.prototype.drawImageRectCubic = function (d, h, n, t, w, z) {
          a.Fd(this.Ed);
          v(h, V);
          v(n, Aa);
          this._drawImageRectCubic(d, V, Aa, t, w, z || null);
        };
        a.Canvas.prototype.drawImageRectOptions = function (d, h, n, t, w, z) {
          a.Fd(this.Ed);
          v(h, V);
          v(n, Aa);
          this._drawImageRectOptions(d, V, Aa, t, w, z || null);
        };
        a.Canvas.prototype.drawLine = function (d, h, n, t, w) {
          a.Fd(this.Ed);
          this._drawLine(d, h, n, t, w);
        };
        a.Canvas.prototype.drawOval = function (d, h) {
          a.Fd(this.Ed);
          d = v(d);
          this._drawOval(d, h);
        };
        a.Canvas.prototype.drawPaint = function (d) {
          a.Fd(this.Ed);
          this._drawPaint(d);
        };
        a.Canvas.prototype.drawParagraph = function (d, h, n) {
          a.Fd(this.Ed);
          this._drawParagraph(d, h, n);
        };
        a.Canvas.prototype.drawPatch = function (d, h, n, t, w) {
          if (24 > d.length) throw "Need 12 cubic points";
          if (h && 4 > h.length) throw "Need 4 colors";
          if (n && 8 > n.length) throw "Need 4 shader coordinates";
          a.Fd(this.Ed);
          const z = m(d, "HEAPF32"),
            F = h ? m(c(h), "HEAPU32") : M,
            K = n ? m(n, "HEAPF32") : M;
          t || (t = a.BlendMode.Modulate);
          this._drawPatch(z, F, K, t, w);
          k(K, n);
          k(F, h);
          k(z, d);
        };
        a.Canvas.prototype.drawPath = function (d, h) {
          a.Fd(this.Ed);
          this._drawPath(d, h);
        };
        a.Canvas.prototype.drawPicture = function (d) {
          a.Fd(this.Ed);
          this._drawPicture(d);
        };
        a.Canvas.prototype.drawPoints = function (d, h, n) {
          a.Fd(this.Ed);
          var t = m(h, "HEAPF32");
          this._drawPoints(d, t, h.length / 2, n);
          k(t, h);
        };
        a.Canvas.prototype.drawRRect = function (d, h) {
          a.Fd(this.Ed);
          d = E(d);
          this._drawRRect(d, h);
        };
        a.Canvas.prototype.drawRect = function (d, h) {
          a.Fd(this.Ed);
          d = v(d);
          this._drawRect(d, h);
        };
        a.Canvas.prototype.drawRect4f = function (d, h, n, t, w) {
          a.Fd(this.Ed);
          this._drawRect4f(d, h, n, t, w);
        };
        a.Canvas.prototype.drawShadow = function (d, h, n, t, w, z, F) {
          a.Fd(this.Ed);
          var K = m(w, "HEAPF32"),
            I = m(z, "HEAPF32");
          h = m(h, "HEAPF32", Db);
          n = m(n, "HEAPF32", Eb);
          this._drawShadow(d, h, n, t, K, I, F);
          k(K, w);
          k(I, z);
        };
        a.getShadowLocalBounds = function (d, h, n, t, w, z, F) {
          d = q(d);
          n = m(n, "HEAPF32", Db);
          t = m(t, "HEAPF32", Eb);
          if (!this._getShadowLocalBounds(d, h, n, t, w, z, V)) return null;
          h = ma.toTypedArray();
          return F ? (F.set(h), F) : h.slice();
        };
        a.Canvas.prototype.drawTextBlob = function (d, h, n, t) {
          a.Fd(this.Ed);
          this._drawTextBlob(d, h, n, t);
        };
        a.Canvas.prototype.drawVertices = function (d, h, n) {
          a.Fd(this.Ed);
          this._drawVertices(d, h, n);
        };
        a.Canvas.prototype.getDeviceClipBounds = function (d) {
          this._getDeviceClipBounds(gb);
          var h = Fb.toTypedArray();
          d ? d.set(h) : d = h.slice();
          return d;
        };
        a.Canvas.prototype.getLocalToDevice = function () {
          this._getLocalToDevice(Y);
          for (var d = Y, h = Array(16), n = 0; 16 > n; n++) h[n] = a.HEAPF32[d / 4 + n];
          return h;
        };
        a.Canvas.prototype.getTotalMatrix = function () {
          this._getTotalMatrix(H);
          for (var d = Array(9), h = 0; 9 > h; h++) d[h] = a.HEAPF32[H / 4 + h];
          return d;
        };
        a.Canvas.prototype.makeSurface = function (d) {
          d = this._makeSurface(d);
          d.Ed = this.Ed;
          return d;
        };
        a.Canvas.prototype.readPixels = function (d, h, n, t, w) {
          a.Fd(this.Ed);
          return g(this, d, h, n, t, w);
        };
        a.Canvas.prototype.saveLayer = function (d, h, n, t) {
          h = v(h);
          return this._saveLayer(d || null, h, n || null, t || 0);
        };
        a.Canvas.prototype.writePixels = function (d, h, n, t, w, z, F, K) {
          if (d.byteLength % (h * n)) throw "pixels length must be a multiple of the srcWidth * srcHeight";
          a.Fd(this.Ed);
          var I = d.byteLength / (h * n);
          z = z || a.AlphaType.Unpremul;
          F = F || a.ColorType.RGBA_8888;
          K = K || a.ColorSpace.SRGB;
          var T = I * h;
          I = m(d, "HEAPU8");
          h = this._writePixels({
            width: h,
            height: n,
            colorType: F,
            alphaType: z,
            colorSpace: K
          }, I, T, t, w);
          k(I, d);
          return h;
        };
        a.ColorFilter.MakeBlend = function (d, h, n) {
          d = y(d);
          n = n || a.ColorSpace.SRGB;
          return a.ColorFilter._MakeBlend(d, h, n);
        };
        a.ColorFilter.MakeMatrix = function (d) {
          if (!d || 20 !== d.length) throw "invalid color matrix";
          var h = m(d, "HEAPF32"),
            n = a.ColorFilter._makeMatrix(h);
          k(h, d);
          return n;
        };
        a.ContourMeasure.prototype.getPosTan = function (d, h) {
          this._getPosTan(d, V);
          d = ma.toTypedArray();
          return h ? (h.set(d), h) : d.slice();
        };
        a.ImageFilter.MakeDropShadow = function (d, h, n, t, w, z) {
          w = y(w, ua);
          return a.ImageFilter._MakeDropShadow(d, h, n, t, w, z);
        };
        a.ImageFilter.MakeDropShadowOnly = function (d, h, n, t, w, z) {
          w = y(w, ua);
          return a.ImageFilter._MakeDropShadowOnly(d, h, n, t, w, z);
        };
        a.ImageFilter.MakeImage = function (d, h, n, t) {
          n = v(n, V);
          t = v(t, Aa);
          if ("B" in h && "C" in h) return a.ImageFilter._MakeImageCubic(d, h.B, h.C, n, t);
          const w = h.filter;
          let z = a.MipmapMode.None;
          "mipmap" in h && (z = h.mipmap);
          return a.ImageFilter._MakeImageOptions(d, w, z, n, t);
        };
        a.ImageFilter.MakeMatrixTransform = function (d, h, n) {
          d = q(d);
          if ("B" in h && "C" in h) return a.ImageFilter._MakeMatrixTransformCubic(d, h.B, h.C, n);
          const t = h.filter;
          let w = a.MipmapMode.None;
          "mipmap" in h && (w = h.mipmap);
          return a.ImageFilter._MakeMatrixTransformOptions(d, t, w, n);
        };
        a.Paint.prototype.getColor = function () {
          this._getColor(ua);
          return D(ua);
        };
        a.Paint.prototype.setColor = function (d, h) {
          h = h || null;
          d = y(d);
          this._setColor(d, h);
        };
        a.Paint.prototype.setColorComponents = function (d, h, n, t, w) {
          w = w || null;
          d = B(d, h, n, t);
          this._setColor(d, w);
        };
        a.Path.prototype.getPoint = function (d, h) {
          this._getPoint(d, V);
          d = ma.toTypedArray();
          return h ? (h[0] = d[0], h[1] = d[1], h) : d.slice(0, 2);
        };
        a.Picture.prototype.makeShader = function (d, h, n, t, w) {
          t = q(t);
          w = v(w);
          return this._makeShader(d, h, n, t, w);
        };
        a.Picture.prototype.cullRect = function (d) {
          this._cullRect(V);
          var h = ma.toTypedArray();
          return d ? (d.set(h), d) : h.slice();
        };
        a.PictureRecorder.prototype.beginRecording = function (d, h) {
          d = v(d);
          return this._beginRecording(d, !!h);
        };
        a.Surface.prototype.getCanvas = function () {
          var d = this._getCanvas();
          d.Ed = this.Ed;
          return d;
        };
        a.Surface.prototype.makeImageSnapshot = function (d) {
          a.Fd(this.Ed);
          d = m(d, "HEAP32", gb);
          return this._makeImageSnapshot(d);
        };
        a.Surface.prototype.makeSurface = function (d) {
          a.Fd(this.Ed);
          d = this._makeSurface(d);
          d.Ed = this.Ed;
          return d;
        };
        a.Surface.prototype.Pe = function (d, h) {
          this.ae || (this.ae = this.getCanvas());
          return requestAnimationFrame(function () {
            a.Fd(this.Ed);
            d(this.ae);
            this.flush(h);
          }.bind(this));
        };
        a.Surface.prototype.requestAnimationFrame || (a.Surface.prototype.requestAnimationFrame = a.Surface.prototype.Pe);
        a.Surface.prototype.Me = function (d, h) {
          this.ae || (this.ae = this.getCanvas());
          requestAnimationFrame(function () {
            a.Fd(this.Ed);
            d(this.ae);
            this.flush(h);
            this.dispose();
          }.bind(this));
        };
        a.Surface.prototype.drawOnce || (a.Surface.prototype.drawOnce = a.Surface.prototype.Me);
        a.PathEffect.MakeDash = function (d, h) {
          h || (h = 0);
          if (!d.length || 1 === d.length % 2) throw "Intervals array must have even length";
          var n = m(d, "HEAPF32");
          h = a.PathEffect._MakeDash(n, d.length, h);
          k(n, d);
          return h;
        };
        a.PathEffect.MakeLine2D = function (d, h) {
          h = q(h);
          return a.PathEffect._MakeLine2D(d, h);
        };
        a.PathEffect.MakePath2D = function (d, h) {
          d = q(d);
          return a.PathEffect._MakePath2D(d, h);
        };
        a.Shader.MakeColor = function (d, h) {
          h = h || null;
          d = y(d);
          return a.Shader._MakeColor(d, h);
        };
        a.Shader.Blend = a.Shader.MakeBlend;
        a.Shader.Color = a.Shader.MakeColor;
        a.Shader.MakeLinearGradient = function (d, h, n, t, w, z, F, K) {
          K = K || null;
          var I = l(n),
            T = m(t, "HEAPF32");
          F = F || 0;
          z = q(z);
          var p = ma.toTypedArray();
          p.set(d);
          p.set(h, 2);
          d = a.Shader._MakeLinearGradient(V, I.Md, I.colorType, T, I.count, w, F, z, K);
          k(I.Md, n);
          t && k(T, t);
          return d;
        };
        a.Shader.MakeRadialGradient = function (d, h, n, t, w, z, F, K) {
          K = K || null;
          var I = l(n),
            T = m(t, "HEAPF32");
          F = F || 0;
          z = q(z);
          d = a.Shader._MakeRadialGradient(d[0], d[1], h, I.Md, I.colorType, T, I.count, w, F, z, K);
          k(I.Md, n);
          t && k(T, t);
          return d;
        };
        a.Shader.MakeSweepGradient = function (d, h, n, t, w, z, F, K, I, T) {
          T = T || null;
          var p = l(n),
            A = m(t, "HEAPF32");
          F = F || 0;
          K = K || 0;
          I = I || 360;
          z = q(z);
          d = a.Shader._MakeSweepGradient(d, h, p.Md, p.colorType, A, p.count, w, K, I, F, z, T);
          k(p.Md, n);
          t && k(A, t);
          return d;
        };
        a.Shader.MakeTwoPointConicalGradient = function (d, h, n, t, w, z, F, K, I, T) {
          T = T || null;
          var p = l(w),
            A = m(z, "HEAPF32");
          I = I || 0;
          K = q(K);
          var L = ma.toTypedArray();
          L.set(d);
          L.set(n, 2);
          d = a.Shader._MakeTwoPointConicalGradient(V, h, t, p.Md, p.colorType, A, p.count, F, I, K, T);
          k(p.Md, w);
          z && k(A, z);
          return d;
        };
        a.Vertices.prototype.bounds = function (d) {
          this._bounds(V);
          var h = ma.toTypedArray();
          return d ? (d.set(h), d) : h.slice();
        };
        a.Id && a.Id.forEach(function (d) {
          d();
        });
      };
      a.computeTonalColors = function (g) {
        var d = m(g.ambient, "HEAPF32"),
          h = m(g.spot, "HEAPF32");
        this._computeTonalColors(d, h);
        var n = {
          ambient: D(d),
          spot: D(h)
        };
        k(d, g.ambient);
        k(h, g.spot);
        return n;
      };
      a.LTRBRect = function (g, d, h, n) {
        return Float32Array.of(g, d, h, n);
      };
      a.XYWHRect = function (g, d, h, n) {
        return Float32Array.of(g, d, g + h, d + n);
      };
      a.LTRBiRect = function (g, d, h, n) {
        return Int32Array.of(g, d, h, n);
      };
      a.XYWHiRect = function (g, d, h, n) {
        return Int32Array.of(g, d, g + h, d + n);
      };
      a.RRectXY = function (g, d, h) {
        return Float32Array.of(g[0], g[1], g[2], g[3], d, h, d, h, d, h, d, h);
      };
      a.MakeAnimatedImageFromEncoded = function (g) {
        g = new Uint8Array(g);
        var d = a._malloc(g.byteLength);
        a.HEAPU8.set(g, d);
        return (g = a._decodeAnimatedImage(d, g.byteLength)) ? g : null;
      };
      a.MakeImageFromEncoded = function (g) {
        g = new Uint8Array(g);
        var d = a._malloc(g.byteLength);
        a.HEAPU8.set(g, d);
        return (g = a._decodeImage(d, g.byteLength)) ? g : null;
      };
      var Ra = null;
      a.MakeImageFromCanvasImageSource = function (g) {
        var d = g.width,
          h = g.height;
        Ra || (Ra = document.createElement("canvas"));
        Ra.width = d;
        Ra.height = h;
        var n = Ra.getContext("2d", {
          xf: !0
        });
        n.drawImage(g, 0, 0);
        g = n.getImageData(0, 0, d, h);
        return a.MakeImage({
          width: d,
          height: h,
          alphaType: a.AlphaType.Unpremul,
          colorType: a.ColorType.RGBA_8888,
          colorSpace: a.ColorSpace.SRGB
        }, g.data, 4 * d);
      };
      a.MakeImage = function (g, d, h) {
        var n = a._malloc(d.length);
        a.HEAPU8.set(d, n);
        return a._MakeImage(g, n, d.length, h);
      };
      a.MakeVertices = function (g, d, h, n, t, w) {
        var z = t && t.length || 0,
          F = 0;
        h && h.length && (F |= 1);
        n && n.length && (F |= 2);
        void 0 === w || w || (F |= 4);
        g = new a._VerticesBuilder(g, d.length / 2, z, F);
        m(d, "HEAPF32", g.positions());
        g.texCoords() && m(h, "HEAPF32", g.texCoords());
        g.colors() && m(c(n), "HEAPU32", g.colors());
        g.indices() && m(t, "HEAPU16", g.indices());
        return g.detach();
      };
      (function (g) {
        g.Id = g.Id || [];
        g.Id.push(function () {
          function d(p) {
            if (!p || !p.length) return [];
            for (var A = [], L = 0; L < p.length; L += 5) {
              var W = g.LTRBRect(p[L], p[L + 1], p[L + 2], p[L + 3]),
                xa = g.TextDirection.LTR;
              0 === p[L + 4] && (xa = g.TextDirection.RTL);
              A.push({
                rect: W,
                dir: xa
              });
            }
            g._free(p.byteOffset);
            return A;
          }
          function h(p) {
            p = p || {};
            void 0 === p.weight && (p.weight = g.FontWeight.Normal);
            p.width = p.width || g.FontWidth.Normal;
            p.slant = p.slant || g.FontSlant.Upright;
            return p;
          }
          function n(p) {
            if (!p || !p.length) return M;
            for (var A = [], L = 0; L < p.length; L++) {
              var W = t(p[L]);
              A.push(W);
            }
            return m(A, "HEAPU32");
          }
          function t(p) {
            if (F[p]) return F[p];
            var A = ja(p) + 1,
              L = g._malloc(A);
            ka(p, C, L, A);
            return F[p] = L;
          }
          function w(p) {
            p._colorPtr = y(p.color);
            p._foregroundColorPtr = M;
            p._backgroundColorPtr = M;
            p._decorationColorPtr = M;
            p.foregroundColor && (p._foregroundColorPtr = y(p.foregroundColor, K));
            p.backgroundColor && (p._backgroundColorPtr = y(p.backgroundColor, I));
            p.decorationColor && (p._decorationColorPtr = y(p.decorationColor, T));
            Array.isArray(p.fontFamilies) && p.fontFamilies.length ? (p._fontFamiliesPtr = n(p.fontFamilies), p._fontFamiliesLen = p.fontFamilies.length) : (p._fontFamiliesPtr = M, p._fontFamiliesLen = 0);
            if (p.locale) {
              var A = p.locale;
              p._localePtr = t(A);
              p._localeLen = ja(A) + 1;
            } else p._localePtr = M, p._localeLen = 0;
            if (Array.isArray(p.shadows) && p.shadows.length) {
              A = p.shadows;
              var L = A.map(function (pa) {
                  return pa.color || g.BLACK;
                }),
                W = A.map(function (pa) {
                  return pa.blurRadius || 0;
                });
              p._shadowLen = A.length;
              for (var xa = g._malloc(8 * A.length), Gb = xa / 4, Hb = 0; Hb < A.length; Hb++) {
                var mc = A[Hb].offset || [0, 0];
                g.HEAPF32[Gb] = mc[0];
                g.HEAPF32[Gb + 1] = mc[1];
                Gb += 2;
              }
              p._shadowColorsPtr = l(L).Md;
              p._shadowOffsetsPtr = xa;
              p._shadowBlurRadiiPtr = m(W, "HEAPF32");
            } else p._shadowLen = 0, p._shadowColorsPtr = M, p._shadowOffsetsPtr = M, p._shadowBlurRadiiPtr = M;
            Array.isArray(p.fontFeatures) && p.fontFeatures.length ? (A = p.fontFeatures, L = A.map(function (pa) {
              return pa.name;
            }), W = A.map(function (pa) {
              return pa.value;
            }), p._fontFeatureLen = A.length, p._fontFeatureNamesPtr = n(L), p._fontFeatureValuesPtr = m(W, "HEAPU32")) : (p._fontFeatureLen = 0, p._fontFeatureNamesPtr = M, p._fontFeatureValuesPtr = M);
            Array.isArray(p.fontVariations) && p.fontVariations.length ? (A = p.fontVariations, L = A.map(function (pa) {
              return pa.axis;
            }), W = A.map(function (pa) {
              return pa.value;
            }), p._fontVariationLen = A.length, p._fontVariationAxesPtr = n(L), p._fontVariationValuesPtr = m(W, "HEAPF32")) : (p._fontVariationLen = 0, p._fontVariationAxesPtr = M, p._fontVariationValuesPtr = M);
          }
          function z(p) {
            g._free(p._fontFamiliesPtr);
            g._free(p._shadowColorsPtr);
            g._free(p._shadowOffsetsPtr);
            g._free(p._shadowBlurRadiiPtr);
            g._free(p._fontFeatureNamesPtr);
            g._free(p._fontFeatureValuesPtr);
            g._free(p._fontVariationAxesPtr);
            g._free(p._fontVariationValuesPtr);
          }
          g.Paragraph.prototype.getRectsForRange = function (p, A, L, W) {
            p = this._getRectsForRange(p, A, L, W);
            return d(p);
          };
          g.Paragraph.prototype.getRectsForPlaceholders = function () {
            var p = this._getRectsForPlaceholders();
            return d(p);
          };
          g.TypefaceFontProvider.prototype.registerFont = function (p, A) {
            p = g.Typeface.MakeFreeTypeFaceFromData(p);
            if (!p) return null;
            A = t(A);
            this._registerFont(p, A);
          };
          g.ParagraphStyle = function (p) {
            p.disableHinting = p.disableHinting || !1;
            if (p.ellipsis) {
              var A = p.ellipsis;
              p._ellipsisPtr = t(A);
              p._ellipsisLen = ja(A) + 1;
            } else p._ellipsisPtr = M, p._ellipsisLen = 0;
            null == p.heightMultiplier && (p.heightMultiplier = -1);
            p.maxLines = p.maxLines || 0;
            p.replaceTabCharacters = p.replaceTabCharacters || !1;
            A = (A = p.strutStyle) || {};
            A.strutEnabled = A.strutEnabled || !1;
            A.strutEnabled && Array.isArray(A.fontFamilies) && A.fontFamilies.length ? (A._fontFamiliesPtr = n(A.fontFamilies), A._fontFamiliesLen = A.fontFamilies.length) : (A._fontFamiliesPtr = M, A._fontFamiliesLen = 0);
            A.fontStyle = h(A.fontStyle);
            null == A.fontSize && (A.fontSize = -1);
            null == A.heightMultiplier && (A.heightMultiplier = -1);
            A.halfLeading = A.halfLeading || !1;
            A.leading = A.leading || 0;
            A.forceStrutHeight = A.forceStrutHeight || !1;
            p.strutStyle = A;
            p.textAlign = p.textAlign || g.TextAlign.Start;
            p.textDirection = p.textDirection || g.TextDirection.LTR;
            p.textHeightBehavior = p.textHeightBehavior || g.TextHeightBehavior.All;
            p.textStyle = g.TextStyle(p.textStyle);
            p.applyRoundingHack = !1 !== p.applyRoundingHack;
            return p;
          };
          g.TextStyle = function (p) {
            p.color || (p.color = g.BLACK);
            p.decoration = p.decoration || 0;
            p.decorationThickness = p.decorationThickness || 0;
            p.decorationStyle = p.decorationStyle || g.DecorationStyle.Solid;
            p.textBaseline = p.textBaseline || g.TextBaseline.Alphabetic;
            null == p.fontSize && (p.fontSize = -1);
            p.letterSpacing = p.letterSpacing || 0;
            p.wordSpacing = p.wordSpacing || 0;
            null == p.heightMultiplier && (p.heightMultiplier = -1);
            p.halfLeading = p.halfLeading || !1;
            p.fontStyle = h(p.fontStyle);
            return p;
          };
          var F = {},
            K = g._malloc(16),
            I = g._malloc(16),
            T = g._malloc(16);
          g.ParagraphBuilder.Make = function (p, A) {
            w(p.textStyle);
            A = g.ParagraphBuilder._Make(p, A);
            z(p.textStyle);
            return A;
          };
          g.ParagraphBuilder.MakeFromFontProvider = function (p, A) {
            w(p.textStyle);
            A = g.ParagraphBuilder._MakeFromFontProvider(p, A);
            z(p.textStyle);
            return A;
          };
          g.ParagraphBuilder.MakeFromFontCollection = function (p, A) {
            w(p.textStyle);
            A = g.ParagraphBuilder._MakeFromFontCollection(p, A);
            z(p.textStyle);
            return A;
          };
          g.ParagraphBuilder.ShapeText = function (p, A, L) {
            let W = 0;
            for (const xa of A) W += xa.length;
            if (W !== p.length) throw "Accumulated block lengths must equal text.length";
            return g.ParagraphBuilder._ShapeText(p, A, L);
          };
          g.ParagraphBuilder.prototype.pushStyle = function (p) {
            w(p);
            this._pushStyle(p);
            z(p);
          };
          g.ParagraphBuilder.prototype.pushPaintStyle = function (p, A, L) {
            w(p);
            this._pushPaintStyle(p, A, L);
            z(p);
          };
          g.ParagraphBuilder.prototype.addPlaceholder = function (p, A, L, W, xa) {
            L = L || g.PlaceholderAlignment.Baseline;
            W = W || g.TextBaseline.Alphabetic;
            this._addPlaceholder(p || 0, A || 0, L, W, xa || 0);
          };
          g.ParagraphBuilder.prototype.setWordsUtf8 = function (p) {
            var A = m(p, "HEAPU32");
            this._setWordsUtf8(A, p && p.length || 0);
            k(A, p);
          };
          g.ParagraphBuilder.prototype.setWordsUtf16 = function (p) {
            var A = m(p, "HEAPU32");
            this._setWordsUtf16(A, p && p.length || 0);
            k(A, p);
          };
          g.ParagraphBuilder.prototype.setGraphemeBreaksUtf8 = function (p) {
            var A = m(p, "HEAPU32");
            this._setGraphemeBreaksUtf8(A, p && p.length || 0);
            k(A, p);
          };
          g.ParagraphBuilder.prototype.setGraphemeBreaksUtf16 = function (p) {
            var A = m(p, "HEAPU32");
            this._setGraphemeBreaksUtf16(A, p && p.length || 0);
            k(A, p);
          };
          g.ParagraphBuilder.prototype.setLineBreaksUtf8 = function (p) {
            var A = m(p, "HEAPU32");
            this._setLineBreaksUtf8(A, p && p.length || 0);
            k(A, p);
          };
          g.ParagraphBuilder.prototype.setLineBreaksUtf16 = function (p) {
            var A = m(p, "HEAPU32");
            this._setLineBreaksUtf16(A, p && p.length || 0);
            k(A, p);
          };
        });
      })(r);
      a.Id = a.Id || [];
      a.Id.push(function () {
        a.Path.prototype.op = function (g, d) {
          return this._op(g, d) ? this : null;
        };
        a.Path.prototype.simplify = function () {
          return this._simplify() ? this : null;
        };
      });
      a.Id = a.Id || [];
      a.Id.push(function () {
        a.Canvas.prototype.drawText = function (g, d, h, n, t) {
          var w = ja(g),
            z = a._malloc(w + 1);
          ka(g, C, z, w + 1);
          this._drawSimpleText(z, w, d, h, t, n);
          a._free(z);
        };
        a.Canvas.prototype.drawGlyphs = function (g, d, h, n, t, w) {
          if (!(2 * g.length <= d.length)) throw "Not enough positions for the array of gyphs";
          a.Fd(this.Ed);
          const z = m(g, "HEAPU16"),
            F = m(d, "HEAPF32");
          this._drawGlyphs(g.length, z, F, h, n, t, w);
          k(F, d);
          k(z, g);
        };
        a.Font.prototype.getGlyphBounds = function (g, d, h) {
          var n = m(g, "HEAPU16"),
            t = a._malloc(16 * g.length);
          this._getGlyphWidthBounds(n, g.length, M, t, d || null);
          d = new Float32Array(a.HEAPU8.buffer, t, 4 * g.length);
          k(n, g);
          if (h) return h.set(d), a._free(t), h;
          g = Float32Array.from(d);
          a._free(t);
          return g;
        };
        a.Font.prototype.getGlyphIDs = function (g, d, h) {
          d || (d = g.length);
          var n = ja(g) + 1,
            t = a._malloc(n);
          ka(g, C, t, n);
          g = a._malloc(2 * d);
          d = this._getGlyphIDs(t, n - 1, d, g);
          a._free(t);
          if (0 > d) return a._free(g), null;
          t = new Uint16Array(a.HEAPU8.buffer, g, d);
          if (h) return h.set(t), a._free(g), h;
          h = Uint16Array.from(t);
          a._free(g);
          return h;
        };
        a.Font.prototype.getGlyphIntercepts = function (g, d, h, n) {
          var t = m(g, "HEAPU16"),
            w = m(d, "HEAPF32");
          return this._getGlyphIntercepts(t, g.length, !(g && g._ck), w, d.length, !(d && d._ck), h, n);
        };
        a.Font.prototype.getGlyphWidths = function (g, d, h) {
          var n = m(g, "HEAPU16"),
            t = a._malloc(4 * g.length);
          this._getGlyphWidthBounds(n, g.length, t, M, d || null);
          d = new Float32Array(a.HEAPU8.buffer, t, g.length);
          k(n, g);
          if (h) return h.set(d), a._free(t), h;
          g = Float32Array.from(d);
          a._free(t);
          return g;
        };
        a.FontMgr.FromData = function () {
          if (!arguments.length) return null;
          var g = arguments;
          1 === g.length && Array.isArray(g[0]) && (g = arguments[0]);
          if (!g.length) return null;
          for (var d = [], h = [], n = 0; n < g.length; n++) {
            var t = new Uint8Array(g[n]),
              w = m(t, "HEAPU8");
            d.push(w);
            h.push(t.byteLength);
          }
          d = m(d, "HEAPU32");
          h = m(h, "HEAPU32");
          g = a.FontMgr._fromData(d, h, g.length);
          a._free(d);
          a._free(h);
          return g;
        };
        a.Typeface.MakeFreeTypeFaceFromData = function (g) {
          g = new Uint8Array(g);
          var d = m(g, "HEAPU8");
          return (g = a.Typeface._MakeFreeTypeFaceFromData(d, g.byteLength)) ? g : null;
        };
        a.Typeface.prototype.getGlyphIDs = function (g, d, h) {
          d || (d = g.length);
          var n = ja(g) + 1,
            t = a._malloc(n);
          ka(g, C, t, n);
          g = a._malloc(2 * d);
          d = this._getGlyphIDs(t, n - 1, d, g);
          a._free(t);
          if (0 > d) return a._free(g), null;
          t = new Uint16Array(a.HEAPU8.buffer, g, d);
          if (h) return h.set(t), a._free(g), h;
          h = Uint16Array.from(t);
          a._free(g);
          return h;
        };
        a.TextBlob.MakeOnPath = function (g, d, h, n) {
          if (g && g.length && d && d.countPoints()) {
            if (1 === d.countPoints()) return this.MakeFromText(g, h);
            n || (n = 0);
            var t = h.getGlyphIDs(g);
            t = h.getGlyphWidths(t);
            var w = [];
            d = new a.ContourMeasureIter(d, !1, 1);
            for (var z = d.next(), F = new Float32Array(4), K = 0; K < g.length && z; K++) {
              var I = t[K];
              n += I / 2;
              if (n > z.length()) {
                z.delete();
                z = d.next();
                if (!z) {
                  g = g.substring(0, K);
                  break;
                }
                n = I / 2;
              }
              z.getPosTan(n, F);
              var T = F[2],
                p = F[3];
              w.push(T, p, F[0] - I / 2 * T, F[1] - I / 2 * p);
              n += I / 2;
            }
            g = this.MakeFromRSXform(g, w, h);
            z && z.delete();
            d.delete();
            return g;
          }
        };
        a.TextBlob.MakeFromRSXform = function (g, d, h) {
          var n = ja(g) + 1,
            t = a._malloc(n);
          ka(g, C, t, n);
          g = m(d, "HEAPF32");
          h = a.TextBlob._MakeFromRSXform(t, n - 1, g, h);
          a._free(t);
          return h ? h : null;
        };
        a.TextBlob.MakeFromRSXformGlyphs = function (g, d, h) {
          var n = m(g, "HEAPU16");
          d = m(d, "HEAPF32");
          h = a.TextBlob._MakeFromRSXformGlyphs(n, 2 * g.length, d, h);
          k(n, g);
          return h ? h : null;
        };
        a.TextBlob.MakeFromGlyphs = function (g, d) {
          var h = m(g, "HEAPU16");
          d = a.TextBlob._MakeFromGlyphs(h, 2 * g.length, d);
          k(h, g);
          return d ? d : null;
        };
        a.TextBlob.MakeFromText = function (g, d) {
          var h = ja(g) + 1,
            n = a._malloc(h);
          ka(g, C, n, h);
          g = a.TextBlob._MakeFromText(n, h - 1, d);
          a._free(n);
          return g ? g : null;
        };
        a.MallocGlyphIDs = function (g) {
          return a.Malloc(Uint16Array, g);
        };
      });
      a.Id = a.Id || [];
      a.Id.push(function () {
        a.MakePicture = function (g) {
          g = new Uint8Array(g);
          var d = a._malloc(g.byteLength);
          a.HEAPU8.set(g, d);
          return (g = a._MakePicture(d, g.byteLength)) ? g : null;
        };
      });
      a.Id = a.Id || [];
      a.Id.push(function () {
        a.RuntimeEffect.Make = function (g, d) {
          return a.RuntimeEffect._Make(g, {
            onError: d || function (h) {
              console.log("RuntimeEffect error", h);
            }
          });
        };
        a.RuntimeEffect.prototype.makeShader = function (g, d) {
          var h = !g._ck,
            n = m(g, "HEAPF32");
          d = q(d);
          return this._makeShader(n, 4 * g.length, h, d);
        };
        a.RuntimeEffect.prototype.makeShaderWithChildren = function (g, d, h) {
          var n = !g._ck,
            t = m(g, "HEAPF32");
          h = q(h);
          for (var w = [], z = 0; z < d.length; z++) w.push(d[z].jd.Gd);
          d = m(w, "HEAPU32");
          return this._makeShaderWithChildren(t, 4 * g.length, n, d, w.length, h);
        };
      });
    })(r);
    var la = Object.assign({}, r),
      na = "./this.program",
      oa = (a, b) => {
        throw b;
      },
      qa = "object" == typeof window,
      ra = "function" == typeof importScripts,
      sa = "object" == typeof process && "object" == typeof process.versions && "string" == typeof process.versions.node,
      ta = "",
      va,
      wa,
      ya;
    if (sa) {
      var fs = require("fs"),
        za = require("path");
      ta = ra ? za.dirname(ta) + "/" : __dirname + "/";
      va = (a, b) => {
        a = a.startsWith("file://") ? new URL(a) : za.normalize(a);
        return fs.readFileSync(a, b ? void 0 : "utf8");
      };
      ya = a => {
        a = va(a, !0);
        a.buffer || (a = new Uint8Array(a));
        return a;
      };
      wa = (a, b, c) => {
        a = a.startsWith("file://") ? new URL(a) : za.normalize(a);
        fs.readFile(a, function (e, f) {
          e ? c(e) : b(f.buffer);
        });
      };
      1 < process.argv.length && (na = process.argv[1].replace(/\\/g, "/"));
      process.argv.slice(2);
      if (15 > process.versions.node.split(".")[0]) process.on("unhandledRejection", function (a) {
        throw a;
      });
      oa = (a, b) => {
        if (noExitRuntime) throw process.exitCode = a, b;
        if (!(b instanceof Ba)) {
          var c = b;
          b && "object" == typeof b && b.stack && (c = [b, b.stack]);
          Ca("exiting due to exception: " + c);
        }
        process.exit(a);
      };
      r.inspect = function () {
        return "[Emscripten Module object]";
      };
    } else if (qa || ra) ra ? ta = self.location.href : "undefined" != typeof document && document.currentScript && (ta = document.currentScript.src), _scriptDir && (ta = _scriptDir), 0 !== ta.indexOf("blob:") ? ta = ta.substr(0, ta.replace(/[?#].*/, "").lastIndexOf("/") + 1) : ta = "", va = a => {
      var b = new XMLHttpRequest();
      b.open("GET", a, !1);
      b.send(null);
      return b.responseText;
    }, ra && (ya = a => {
      var b = new XMLHttpRequest();
      b.open("GET", a, !1);
      b.responseType = "arraybuffer";
      b.send(null);
      return new Uint8Array(b.response);
    }), wa = (a, b, c) => {
      var e = new XMLHttpRequest();
      e.open("GET", a, !0);
      e.responseType = "arraybuffer";
      e.onload = () => {
        200 == e.status || 0 == e.status && e.response ? b(e.response) : c();
      };
      e.onerror = c;
      e.send(null);
    };
    var Da = r.print || console.log.bind(console),
      Ca = r.printErr || console.warn.bind(console);
    Object.assign(r, la);
    la = null;
    r.thisProgram && (na = r.thisProgram);
    r.quit && (oa = r.quit);
    var Ea;
    r.wasmBinary && (Ea = r.wasmBinary);
    var noExitRuntime = r.noExitRuntime || !0;
    "object" != typeof WebAssembly && Fa("no native wasm support detected");
    var Ga,
      Ha = !1,
      Ia = "undefined" != typeof TextDecoder ? new TextDecoder("utf8") : void 0;
    function Ja(a, b, c) {
      var e = b + c;
      for (c = b; a[c] && !(c >= e);) ++c;
      if (16 < c - b && a.buffer && Ia) return Ia.decode(a.subarray(b, c));
      for (e = ""; b < c;) {
        var f = a[b++];
        if (f & 128) {
          var k = a[b++] & 63;
          if (192 == (f & 224)) e += String.fromCharCode((f & 31) << 6 | k);else {
            var m = a[b++] & 63;
            f = 224 == (f & 240) ? (f & 15) << 12 | k << 6 | m : (f & 7) << 18 | k << 12 | m << 6 | a[b++] & 63;
            65536 > f ? e += String.fromCharCode(f) : (f -= 65536, e += String.fromCharCode(55296 | f >> 10, 56320 | f & 1023));
          }
        } else e += String.fromCharCode(f);
      }
      return e;
    }
    function Ka(a, b) {
      return a ? Ja(C, a, b) : "";
    }
    function ka(a, b, c, e) {
      if (!(0 < e)) return 0;
      var f = c;
      e = c + e - 1;
      for (var k = 0; k < a.length; ++k) {
        var m = a.charCodeAt(k);
        if (55296 <= m && 57343 >= m) {
          var l = a.charCodeAt(++k);
          m = 65536 + ((m & 1023) << 10) | l & 1023;
        }
        if (127 >= m) {
          if (c >= e) break;
          b[c++] = m;
        } else {
          if (2047 >= m) {
            if (c + 1 >= e) break;
            b[c++] = 192 | m >> 6;
          } else {
            if (65535 >= m) {
              if (c + 2 >= e) break;
              b[c++] = 224 | m >> 12;
            } else {
              if (c + 3 >= e) break;
              b[c++] = 240 | m >> 18;
              b[c++] = 128 | m >> 12 & 63;
            }
            b[c++] = 128 | m >> 6 & 63;
          }
          b[c++] = 128 | m & 63;
        }
      }
      b[c] = 0;
      return c - f;
    }
    function ja(a) {
      for (var b = 0, c = 0; c < a.length; ++c) {
        var e = a.charCodeAt(c);
        127 >= e ? b++ : 2047 >= e ? b += 2 : 55296 <= e && 57343 >= e ? (b += 4, ++c) : b += 3;
      }
      return b;
    }
    var Ma, C, Na, Oa, G, J, N, Pa;
    function Qa() {
      var a = Ga.buffer;
      r.HEAP8 = Ma = new Int8Array(a);
      r.HEAP16 = Na = new Int16Array(a);
      r.HEAP32 = G = new Int32Array(a);
      r.HEAPU8 = C = new Uint8Array(a);
      r.HEAPU16 = Oa = new Uint16Array(a);
      r.HEAPU32 = J = new Uint32Array(a);
      r.HEAPF32 = N = new Float32Array(a);
      r.HEAPF64 = Pa = new Float64Array(a);
    }
    var Sa,
      Ta = [],
      Ua = [],
      Va = [];
    function Wa() {
      var a = r.preRun.shift();
      Ta.unshift(a);
    }
    var Xa = 0,
      Ya = null,
      Za = null;
    function Fa(a) {
      if (r.onAbort) r.onAbort(a);
      a = "Aborted(" + a + ")";
      Ca(a);
      Ha = !0;
      a = new WebAssembly.RuntimeError(a + ". Build with -sASSERTIONS for more info.");
      ba(a);
      throw a;
    }
    function $a(a) {
      return a.startsWith("data:application/octet-stream;base64,");
    }
    var ab;
    ab = "canvaskit.wasm";
    if (!$a(ab)) {
      var bb = ab;
      ab = r.locateFile ? r.locateFile(bb, ta) : ta + bb;
    }
    function cb(a) {
      try {
        if (a == ab && Ea) return new Uint8Array(Ea);
        if (ya) return ya(a);
        throw "both async and sync fetching of the wasm failed";
      } catch (b) {
        Fa(b);
      }
    }
    function db(a) {
      if (!Ea && (qa || ra)) {
        if ("function" == typeof fetch && !a.startsWith("file://")) return fetch(a, {
          credentials: "same-origin"
        }).then(function (b) {
          if (!b.ok) throw "failed to load wasm binary file at '" + a + "'";
          return b.arrayBuffer();
        }).catch(function () {
          return cb(a);
        });
        if (wa) return new Promise(function (b, c) {
          wa(a, function (e) {
            b(new Uint8Array(e));
          }, c);
        });
      }
      return Promise.resolve().then(function () {
        return cb(a);
      });
    }
    function eb(a, b, c) {
      return db(a).then(function (e) {
        return WebAssembly.instantiate(e, b);
      }).then(function (e) {
        return e;
      }).then(c, function (e) {
        Ca("failed to asynchronously prepare wasm: " + e);
        Fa(e);
      });
    }
    function fb(a, b) {
      var c = ab;
      return Ea || "function" != typeof WebAssembly.instantiateStreaming || $a(c) || c.startsWith("file://") || sa || "function" != typeof fetch ? eb(c, a, b) : fetch(c, {
        credentials: "same-origin"
      }).then(function (e) {
        return WebAssembly.instantiateStreaming(e, a).then(b, function (f) {
          Ca("wasm streaming compile failed: " + f);
          Ca("falling back to ArrayBuffer instantiation");
          return eb(c, a, b);
        });
      });
    }
    function Ba(a) {
      this.name = "ExitStatus";
      this.message = "Program terminated with exit(" + a + ")";
      this.status = a;
    }
    function hb(a) {
      for (; 0 < a.length;) a.shift()(r);
    }
    function ib(a) {
      this.Gd = a - 24;
      this.Le = function (b) {
        J[this.Gd + 4 >> 2] = b;
      };
      this.Ie = function (b) {
        J[this.Gd + 8 >> 2] = b;
      };
      this.Je = function () {
        G[this.Gd >> 2] = 0;
      };
      this.Ge = function () {
        Ma[this.Gd + 12 >> 0] = 0;
      };
      this.Ke = function () {
        Ma[this.Gd + 13 >> 0] = 0;
      };
      this.je = function (b, c) {
        this.Fe();
        this.Le(b);
        this.Ie(c);
        this.Je();
        this.Ge();
        this.Ke();
      };
      this.Fe = function () {
        J[this.Gd + 16 >> 2] = 0;
      };
    }
    var jb = 0,
      kb = {};
    function lb(a) {
      for (; a.length;) {
        var b = a.pop();
        a.pop()(b);
      }
    }
    function mb(a) {
      return this.fromWireType(G[a >> 2]);
    }
    var nb = {},
      ob = {},
      pb = {};
    function qb(a) {
      if (void 0 === a) return "_unknown";
      a = a.replace(/[^a-zA-Z0-9_]/g, "$");
      var b = a.charCodeAt(0);
      return 48 <= b && 57 >= b ? "_" + a : a;
    }
    function rb(a, b) {
      a = qb(a);
      return {
        [a]: function () {
          return b.apply(this, arguments);
        }
      }[a];
    }
    function sb(a) {
      var b = Error,
        c = rb(a, function (e) {
          this.name = a;
          this.message = e;
          e = Error(e).stack;
          void 0 !== e && (this.stack = this.toString() + "\n" + e.replace(/^Error(:[^\n]*)?\n/, ""));
        });
      c.prototype = Object.create(b.prototype);
      c.prototype.constructor = c;
      c.prototype.toString = function () {
        return void 0 === this.message ? this.name : this.name + ": " + this.message;
      };
      return c;
    }
    var tb = void 0;
    function ub(a) {
      throw new tb(a);
    }
    function vb(a, b, c) {
      function e(l) {
        l = c(l);
        l.length !== a.length && ub("Mismatched type converter count");
        for (var q = 0; q < a.length; ++q) wb(a[q], l[q]);
      }
      a.forEach(function (l) {
        pb[l] = b;
      });
      var f = Array(b.length),
        k = [],
        m = 0;
      b.forEach((l, q) => {
        ob.hasOwnProperty(l) ? f[q] = ob[l] : (k.push(l), nb.hasOwnProperty(l) || (nb[l] = []), nb[l].push(() => {
          f[q] = ob[l];
          ++m;
          m === k.length && e(f);
        }));
      });
      0 === k.length && e(f);
    }
    function xb(a) {
      switch (a) {
        case 1:
          return 0;
        case 2:
          return 1;
        case 4:
          return 2;
        case 8:
          return 3;
        default:
          throw new TypeError("Unknown type size: " + a);
      }
    }
    var yb = void 0;
    function O(a) {
      for (var b = ""; C[a];) b += yb[C[a++]];
      return b;
    }
    var zb = void 0;
    function P(a) {
      throw new zb(a);
    }
    function wb(a, b, c = {}) {
      if (!("argPackAdvance" in b)) throw new TypeError("registerType registeredInstance requires argPackAdvance");
      var e = b.name;
      a || P('type "' + e + '" must have a positive integer typeid pointer');
      if (ob.hasOwnProperty(a)) {
        if (c.cf) return;
        P("Cannot register type '" + e + "' twice");
      }
      ob[a] = b;
      delete pb[a];
      nb.hasOwnProperty(a) && (b = nb[a], delete nb[a], b.forEach(f => f()));
    }
    function Ab(a) {
      P(a.jd.Jd.Hd.name + " instance already deleted");
    }
    var Bb = !1;
    function Ib() {}
    function Jb(a) {
      --a.count.value;
      0 === a.count.value && (a.Ld ? a.Od.Sd(a.Ld) : a.Jd.Hd.Sd(a.Gd));
    }
    function Kb(a, b, c) {
      if (b === c) return a;
      if (void 0 === c.Qd) return null;
      a = Kb(a, b, c.Qd);
      return null === a ? null : c.Ue(a);
    }
    var Lb = {},
      Mb = [];
    function Nb() {
      for (; Mb.length;) {
        var a = Mb.pop();
        a.jd.Zd = !1;
        a["delete"]();
      }
    }
    var Ob = void 0,
      Pb = {};
    function Qb(a, b) {
      for (void 0 === b && P("ptr should not be undefined"); a.Qd;) b = a.ee(b), a = a.Qd;
      return Pb[b];
    }
    function Rb(a, b) {
      b.Jd && b.Gd || ub("makeClassHandle requires ptr and ptrType");
      !!b.Od !== !!b.Ld && ub("Both smartPtrType and smartPtr must be specified");
      b.count = {
        value: 1
      };
      return Sb(Object.create(a, {
        jd: {
          value: b
        }
      }));
    }
    function Sb(a) {
      if ("undefined" === typeof FinalizationRegistry) return Sb = b => b, a;
      Bb = new FinalizationRegistry(b => {
        Jb(b.jd);
      });
      Sb = b => {
        var c = b.jd;
        c.Ld && Bb.register(b, {
          jd: c
        }, b);
        return b;
      };
      Ib = b => {
        Bb.unregister(b);
      };
      return Sb(a);
    }
    function Tb() {}
    function Ub(a, b, c) {
      if (void 0 === a[b].Kd) {
        var e = a[b];
        a[b] = function () {
          a[b].Kd.hasOwnProperty(arguments.length) || P("Function '" + c + "' called with an invalid number of arguments (" + arguments.length + ") - expects one of (" + a[b].Kd + ")!");
          return a[b].Kd[arguments.length].apply(this, arguments);
        };
        a[b].Kd = [];
        a[b].Kd[e.Xd] = e;
      }
    }
    function Vb(a, b, c) {
      r.hasOwnProperty(a) ? ((void 0 === c || void 0 !== r[a].Kd && void 0 !== r[a].Kd[c]) && P("Cannot register public name '" + a + "' twice"), Ub(r, a, a), r.hasOwnProperty(c) && P("Cannot register multiple overloads of a function with the same number of arguments (" + c + ")!"), r[a].Kd[c] = b) : (r[a] = b, void 0 !== c && (r[a].uf = c));
    }
    function Wb(a, b, c, e, f, k, m, l) {
      this.name = a;
      this.constructor = b;
      this.$d = c;
      this.Sd = e;
      this.Qd = f;
      this.Xe = k;
      this.ee = m;
      this.Ue = l;
      this.gf = [];
    }
    function Xb(a, b, c) {
      for (; b !== c;) b.ee || P("Expected null or instance of " + c.name + ", got an instance of " + b.name), a = b.ee(a), b = b.Qd;
      return a;
    }
    function Yb(a, b) {
      if (null === b) return this.se && P("null is not a valid " + this.name), 0;
      b.jd || P('Cannot pass "' + Zb(b) + '" as a ' + this.name);
      b.jd.Gd || P("Cannot pass deleted object as a pointer of type " + this.name);
      return Xb(b.jd.Gd, b.jd.Jd.Hd, this.Hd);
    }
    function $b(a, b) {
      if (null === b) {
        this.se && P("null is not a valid " + this.name);
        if (this.ie) {
          var c = this.te();
          null !== a && a.push(this.Sd, c);
          return c;
        }
        return 0;
      }
      b.jd || P('Cannot pass "' + Zb(b) + '" as a ' + this.name);
      b.jd.Gd || P("Cannot pass deleted object as a pointer of type " + this.name);
      !this.he && b.jd.Jd.he && P("Cannot convert argument of type " + (b.jd.Od ? b.jd.Od.name : b.jd.Jd.name) + " to parameter type " + this.name);
      c = Xb(b.jd.Gd, b.jd.Jd.Hd, this.Hd);
      if (this.ie) switch (void 0 === b.jd.Ld && P("Passing raw pointer to smart pointer is illegal"), this.mf) {
        case 0:
          b.jd.Od === this ? c = b.jd.Ld : P("Cannot convert argument of type " + (b.jd.Od ? b.jd.Od.name : b.jd.Jd.name) + " to parameter type " + this.name);
          break;
        case 1:
          c = b.jd.Ld;
          break;
        case 2:
          if (b.jd.Od === this) c = b.jd.Ld;else {
            var e = b.clone();
            c = this.hf(c, ac(function () {
              e["delete"]();
            }));
            null !== a && a.push(this.Sd, c);
          }
          break;
        default:
          P("Unsupporting sharing policy");
      }
      return c;
    }
    function bc(a, b) {
      if (null === b) return this.se && P("null is not a valid " + this.name), 0;
      b.jd || P('Cannot pass "' + Zb(b) + '" as a ' + this.name);
      b.jd.Gd || P("Cannot pass deleted object as a pointer of type " + this.name);
      b.jd.Jd.he && P("Cannot convert argument of type " + b.jd.Jd.name + " to parameter type " + this.name);
      return Xb(b.jd.Gd, b.jd.Jd.Hd, this.Hd);
    }
    function cc(a, b, c, e, f, k, m, l, q, x, y) {
      this.name = a;
      this.Hd = b;
      this.se = c;
      this.he = e;
      this.ie = f;
      this.ff = k;
      this.mf = m;
      this.Ce = l;
      this.te = q;
      this.hf = x;
      this.Sd = y;
      f || void 0 !== b.Qd ? this.toWireType = $b : (this.toWireType = e ? Yb : bc, this.Nd = null);
    }
    function dc(a, b, c) {
      r.hasOwnProperty(a) || ub("Replacing nonexistant public symbol");
      void 0 !== r[a].Kd && void 0 !== c ? r[a].Kd[c] = b : (r[a] = b, r[a].Xd = c);
    }
    function Q(a) {
      return Sa.get(a);
    }
    function ec(a, b) {
      var c = [];
      return function () {
        c.length = 0;
        Object.assign(c, arguments);
        if (a.includes("j")) {
          var e = r["dynCall_" + a];
          e = c && c.length ? e.apply(null, [b].concat(c)) : e.call(null, b);
        } else e = Q(b).apply(null, c);
        return e;
      };
    }
    function R(a, b) {
      a = O(a);
      var c = a.includes("j") ? ec(a, b) : Q(b);
      "function" != typeof c && P("unknown function pointer with signature " + a + ": " + b);
      return c;
    }
    var fc = void 0;
    function nc(a) {
      a = oc(a);
      var b = O(a);
      pc(a);
      return b;
    }
    function qc(a, b) {
      function c(k) {
        f[k] || ob[k] || (pb[k] ? pb[k].forEach(c) : (e.push(k), f[k] = !0));
      }
      var e = [],
        f = {};
      b.forEach(c);
      throw new fc(a + ": " + e.map(nc).join([", "]));
    }
    function rc(a, b, c, e, f) {
      var k = b.length;
      2 > k && P("argTypes array size mismatch! Must at least get return value and 'this' types!");
      var m = null !== b[1] && null !== c,
        l = !1;
      for (c = 1; c < b.length; ++c) if (null !== b[c] && void 0 === b[c].Nd) {
        l = !0;
        break;
      }
      var q = "void" !== b[0].name,
        x = k - 2,
        y = Array(x),
        B = [],
        D = [];
      return function () {
        arguments.length !== x && P("function " + a + " called with " + arguments.length + " arguments, expected " + x + " args!");
        D.length = 0;
        B.length = m ? 2 : 1;
        B[0] = f;
        if (m) {
          var v = b[1].toWireType(D, this);
          B[1] = v;
        }
        for (var E = 0; E < x; ++E) y[E] = b[E + 2].toWireType(D, arguments[E]), B.push(y[E]);
        E = e.apply(null, B);
        if (l) lb(D);else for (var H = m ? 1 : 2; H < b.length; H++) {
          var S = 1 === H ? v : y[H - 2];
          null !== b[H].Nd && b[H].Nd(S);
        }
        v = q ? b[0].fromWireType(E) : void 0;
        return v;
      };
    }
    function sc(a, b) {
      for (var c = [], e = 0; e < a; e++) c.push(J[b + 4 * e >> 2]);
      return c;
    }
    var tc = [],
      uc = [{}, {
        value: void 0
      }, {
        value: null
      }, {
        value: !0
      }, {
        value: !1
      }];
    function vc(a) {
      4 < a && 0 === --uc[a].ue && (uc[a] = void 0, tc.push(a));
    }
    var wc = a => {
        a || P("Cannot use deleted val. handle = " + a);
        return uc[a].value;
      },
      ac = a => {
        switch (a) {
          case void 0:
            return 1;
          case null:
            return 2;
          case !0:
            return 3;
          case !1:
            return 4;
          default:
            var b = tc.length ? tc.pop() : uc.length;
            uc[b] = {
              ue: 1,
              value: a
            };
            return b;
        }
      };
    function xc(a, b, c) {
      switch (b) {
        case 0:
          return function (e) {
            return this.fromWireType((c ? Ma : C)[e]);
          };
        case 1:
          return function (e) {
            return this.fromWireType((c ? Na : Oa)[e >> 1]);
          };
        case 2:
          return function (e) {
            return this.fromWireType((c ? G : J)[e >> 2]);
          };
        default:
          throw new TypeError("Unknown integer type: " + a);
      }
    }
    function yc(a, b) {
      var c = ob[a];
      void 0 === c && P(b + " has unknown type " + nc(a));
      return c;
    }
    function Zb(a) {
      if (null === a) return "null";
      var b = typeof a;
      return "object" === b || "array" === b || "function" === b ? a.toString() : "" + a;
    }
    function zc(a, b) {
      switch (b) {
        case 2:
          return function (c) {
            return this.fromWireType(N[c >> 2]);
          };
        case 3:
          return function (c) {
            return this.fromWireType(Pa[c >> 3]);
          };
        default:
          throw new TypeError("Unknown float type: " + a);
      }
    }
    function Ac(a, b, c) {
      switch (b) {
        case 0:
          return c ? function (e) {
            return Ma[e];
          } : function (e) {
            return C[e];
          };
        case 1:
          return c ? function (e) {
            return Na[e >> 1];
          } : function (e) {
            return Oa[e >> 1];
          };
        case 2:
          return c ? function (e) {
            return G[e >> 2];
          } : function (e) {
            return J[e >> 2];
          };
        default:
          throw new TypeError("Unknown integer type: " + a);
      }
    }
    var Bc = "undefined" != typeof TextDecoder ? new TextDecoder("utf-16le") : void 0;
    function Cc(a, b) {
      var c = a >> 1;
      for (var e = c + b / 2; !(c >= e) && Oa[c];) ++c;
      c <<= 1;
      if (32 < c - a && Bc) return Bc.decode(C.subarray(a, c));
      c = "";
      for (e = 0; !(e >= b / 2); ++e) {
        var f = Na[a + 2 * e >> 1];
        if (0 == f) break;
        c += String.fromCharCode(f);
      }
      return c;
    }
    function Dc(a, b, c) {
      void 0 === c && (c = 2147483647);
      if (2 > c) return 0;
      c -= 2;
      var e = b;
      c = c < 2 * a.length ? c / 2 : a.length;
      for (var f = 0; f < c; ++f) Na[b >> 1] = a.charCodeAt(f), b += 2;
      Na[b >> 1] = 0;
      return b - e;
    }
    function Ec(a) {
      return 2 * a.length;
    }
    function Fc(a, b) {
      for (var c = 0, e = ""; !(c >= b / 4);) {
        var f = G[a + 4 * c >> 2];
        if (0 == f) break;
        ++c;
        65536 <= f ? (f -= 65536, e += String.fromCharCode(55296 | f >> 10, 56320 | f & 1023)) : e += String.fromCharCode(f);
      }
      return e;
    }
    function Gc(a, b, c) {
      void 0 === c && (c = 2147483647);
      if (4 > c) return 0;
      var e = b;
      c = e + c - 4;
      for (var f = 0; f < a.length; ++f) {
        var k = a.charCodeAt(f);
        if (55296 <= k && 57343 >= k) {
          var m = a.charCodeAt(++f);
          k = 65536 + ((k & 1023) << 10) | m & 1023;
        }
        G[b >> 2] = k;
        b += 4;
        if (b + 4 > c) break;
      }
      G[b >> 2] = 0;
      return b - e;
    }
    function Hc(a) {
      for (var b = 0, c = 0; c < a.length; ++c) {
        var e = a.charCodeAt(c);
        55296 <= e && 57343 >= e && ++c;
        b += 4;
      }
      return b;
    }
    var Ic = {};
    function Jc(a) {
      var b = Ic[a];
      return void 0 === b ? O(a) : b;
    }
    var Kc = [];
    function Lc() {
      function a(b) {
        b.$$$embind_global$$$ = b;
        var c = "object" == typeof $$$embind_global$$$ && b.$$$embind_global$$$ == b;
        c || delete b.$$$embind_global$$$;
        return c;
      }
      if ("object" == typeof globalThis) return globalThis;
      if ("object" == typeof $$$embind_global$$$) return $$$embind_global$$$;
      "object" == typeof global && a(global) ? $$$embind_global$$$ = global : "object" == typeof self && a(self) && ($$$embind_global$$$ = self);
      if ("object" == typeof $$$embind_global$$$) return $$$embind_global$$$;
      throw Error("unable to get global object.");
    }
    function Mc(a) {
      var b = Kc.length;
      Kc.push(a);
      return b;
    }
    function Nc(a, b) {
      for (var c = Array(a), e = 0; e < a; ++e) c[e] = yc(J[b + 4 * e >> 2], "parameter " + e);
      return c;
    }
    var Oc = [];
    function Pc(a) {
      var b = Array(a + 1);
      return function (c, e, f) {
        b[0] = c;
        for (var k = 0; k < a; ++k) {
          var m = yc(J[e + 4 * k >> 2], "parameter " + k);
          b[k + 1] = m.readValueFromPointer(f);
          f += m.argPackAdvance;
        }
        c = new (c.bind.apply(c, b))();
        return ac(c);
      };
    }
    var Qc = {},
      Rc;
    Rc = sa ? () => {
      var a = process.hrtime();
      return 1E3 * a[0] + a[1] / 1E6;
    } : () => performance.now();
    function Sc(a) {
      var b = a.getExtension("ANGLE_instanced_arrays");
      b && (a.vertexAttribDivisor = function (c, e) {
        b.vertexAttribDivisorANGLE(c, e);
      }, a.drawArraysInstanced = function (c, e, f, k) {
        b.drawArraysInstancedANGLE(c, e, f, k);
      }, a.drawElementsInstanced = function (c, e, f, k, m) {
        b.drawElementsInstancedANGLE(c, e, f, k, m);
      });
    }
    function Tc(a) {
      var b = a.getExtension("OES_vertex_array_object");
      b && (a.createVertexArray = function () {
        return b.createVertexArrayOES();
      }, a.deleteVertexArray = function (c) {
        b.deleteVertexArrayOES(c);
      }, a.bindVertexArray = function (c) {
        b.bindVertexArrayOES(c);
      }, a.isVertexArray = function (c) {
        return b.isVertexArrayOES(c);
      });
    }
    function Uc(a) {
      var b = a.getExtension("WEBGL_draw_buffers");
      b && (a.drawBuffers = function (c, e) {
        b.drawBuffersWEBGL(c, e);
      });
    }
    var Vc = 1,
      Wc = [],
      Xc = [],
      Yc = [],
      Zc = [],
      ea = [],
      $c = [],
      ad = [],
      ia = [],
      bd = [],
      cd = [],
      ed = {},
      fd = {},
      gd = 4;
    function U(a) {
      hd || (hd = a);
    }
    function ca(a) {
      for (var b = Vc++, c = a.length; c < b; c++) a[c] = null;
      return b;
    }
    function fa(a, b) {
      a.je || (a.je = a.getContext, a.getContext = function (e, f) {
        f = a.je(e, f);
        return "webgl" == e == f instanceof WebGLRenderingContext ? f : null;
      });
      var c = 1 < b.majorVersion ? a.getContext("webgl2", b) : a.getContext("webgl", b);
      return c ? jd(c, b) : 0;
    }
    function jd(a, b) {
      var c = ca(ia),
        e = {
          bf: c,
          attributes: b,
          version: b.majorVersion,
          Pd: a
        };
      a.canvas && (a.canvas.He = e);
      ia[c] = e;
      ("undefined" == typeof b.Ve || b.Ve) && kd(e);
      return c;
    }
    function ha(a) {
      u = ia[a];
      r.sf = X = u && u.Pd;
      return !(a && !X);
    }
    function kd(a) {
      a || (a = u);
      if (!a.df) {
        a.df = !0;
        var b = a.Pd;
        Sc(b);
        Tc(b);
        Uc(b);
        b.ye = b.getExtension("WEBGL_draw_instanced_base_vertex_base_instance");
        b.Be = b.getExtension("WEBGL_multi_draw_instanced_base_vertex_base_instance");
        2 <= a.version && (b.ze = b.getExtension("EXT_disjoint_timer_query_webgl2"));
        if (2 > a.version || !b.ze) b.ze = b.getExtension("EXT_disjoint_timer_query");
        b.tf = b.getExtension("WEBGL_multi_draw");
        (b.getSupportedExtensions() || []).forEach(function (c) {
          c.includes("lose_context") || c.includes("debug") || b.getExtension(c);
        });
      }
    }
    var u,
      hd,
      ld = [];
    function md(a, b, c, e) {
      for (var f = 0; f < a; f++) {
        var k = X[c](),
          m = k && ca(e);
        k ? (k.name = m, e[m] = k) : U(1282);
        G[b + 4 * f >> 2] = m;
      }
    }
    function nd(a, b, c) {
      if (b) {
        var e = void 0;
        switch (a) {
          case 36346:
            e = 1;
            break;
          case 36344:
            0 != c && 1 != c && U(1280);
            return;
          case 34814:
          case 36345:
            e = 0;
            break;
          case 34466:
            var f = X.getParameter(34467);
            e = f ? f.length : 0;
            break;
          case 33309:
            if (2 > u.version) {
              U(1282);
              return;
            }
            e = 2 * (X.getSupportedExtensions() || []).length;
            break;
          case 33307:
          case 33308:
            if (2 > u.version) {
              U(1280);
              return;
            }
            e = 33307 == a ? 3 : 0;
        }
        if (void 0 === e) switch (f = X.getParameter(a), typeof f) {
          case "number":
            e = f;
            break;
          case "boolean":
            e = f ? 1 : 0;
            break;
          case "string":
            U(1280);
            return;
          case "object":
            if (null === f) switch (a) {
              case 34964:
              case 35725:
              case 34965:
              case 36006:
              case 36007:
              case 32873:
              case 34229:
              case 36662:
              case 36663:
              case 35053:
              case 35055:
              case 36010:
              case 35097:
              case 35869:
              case 32874:
              case 36389:
              case 35983:
              case 35368:
              case 34068:
                e = 0;
                break;
              default:
                U(1280);
                return;
            } else {
              if (f instanceof Float32Array || f instanceof Uint32Array || f instanceof Int32Array || f instanceof Array) {
                for (a = 0; a < f.length; ++a) switch (c) {
                  case 0:
                    G[b + 4 * a >> 2] = f[a];
                    break;
                  case 2:
                    N[b + 4 * a >> 2] = f[a];
                    break;
                  case 4:
                    Ma[b + a >> 0] = f[a] ? 1 : 0;
                }
                return;
              }
              try {
                e = f.name | 0;
              } catch (k) {
                U(1280);
                Ca("GL_INVALID_ENUM in glGet" + c + "v: Unknown object returned from WebGL getParameter(" + a + ")! (error: " + k + ")");
                return;
              }
            }
            break;
          default:
            U(1280);
            Ca("GL_INVALID_ENUM in glGet" + c + "v: Native code calling glGet" + c + "v(" + a + ") and it returns " + f + " of type " + typeof f + "!");
            return;
        }
        switch (c) {
          case 1:
            c = e;
            J[b >> 2] = c;
            J[b + 4 >> 2] = (c - J[b >> 2]) / 4294967296;
            break;
          case 0:
            G[b >> 2] = e;
            break;
          case 2:
            N[b >> 2] = e;
            break;
          case 4:
            Ma[b >> 0] = e ? 1 : 0;
        }
      } else U(1281);
    }
    function od(a) {
      var b = ja(a) + 1,
        c = pd(b);
      ka(a, C, c, b);
      return c;
    }
    function qd(a) {
      return "]" == a.slice(-1) && a.lastIndexOf("[");
    }
    function rd(a) {
      a -= 5120;
      return 0 == a ? Ma : 1 == a ? C : 2 == a ? Na : 4 == a ? G : 6 == a ? N : 5 == a || 28922 == a || 28520 == a || 30779 == a || 30782 == a ? J : Oa;
    }
    function sd(a, b, c, e, f) {
      a = rd(a);
      var k = 31 - Math.clz32(a.BYTES_PER_ELEMENT),
        m = gd;
      return a.subarray(f >> k, f + e * (c * ({
        5: 3,
        6: 4,
        8: 2,
        29502: 3,
        29504: 4,
        26917: 2,
        26918: 2,
        29846: 3,
        29847: 4
      }[b - 6402] || 1) * (1 << k) + m - 1 & -m) >> k);
    }
    function Z(a) {
      var b = X.Se;
      if (b) {
        var c = b.de[a];
        "number" == typeof c && (b.de[a] = c = X.getUniformLocation(b, b.De[a] + (0 < c ? "[" + c + "]" : "")));
        return c;
      }
      U(1282);
    }
    var td = [],
      ud = [],
      vd = {};
    function wd() {
      if (!xd) {
        var a = {
            USER: "web_user",
            LOGNAME: "web_user",
            PATH: "/",
            PWD: "/",
            HOME: "/home/web_user",
            LANG: ("object" == typeof navigator && navigator.languages && navigator.languages[0] || "C").replace("-", "_") + ".UTF-8",
            _: na || "./this.program"
          },
          b;
        for (b in vd) void 0 === vd[b] ? delete a[b] : a[b] = vd[b];
        var c = [];
        for (b in a) c.push(b + "=" + a[b]);
        xd = c;
      }
      return xd;
    }
    var xd,
      yd = [null, [], []];
    function zd(a) {
      return 0 === a % 4 && (0 !== a % 100 || 0 === a % 400);
    }
    var Ad = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31],
      Bd = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    function Cd(a) {
      var b = Array(ja(a) + 1);
      ka(a, b, 0, b.length);
      return b;
    }
    function Dd(a, b, c, e) {
      function f(v, E, H) {
        for (v = "number" == typeof v ? v.toString() : v || ""; v.length < E;) v = H[0] + v;
        return v;
      }
      function k(v, E) {
        return f(v, E, "0");
      }
      function m(v, E) {
        function H(Y) {
          return 0 > Y ? -1 : 0 < Y ? 1 : 0;
        }
        var S;
        0 === (S = H(v.getFullYear() - E.getFullYear())) && 0 === (S = H(v.getMonth() - E.getMonth())) && (S = H(v.getDate() - E.getDate()));
        return S;
      }
      function l(v) {
        switch (v.getDay()) {
          case 0:
            return new Date(v.getFullYear() - 1, 11, 29);
          case 1:
            return v;
          case 2:
            return new Date(v.getFullYear(), 0, 3);
          case 3:
            return new Date(v.getFullYear(), 0, 2);
          case 4:
            return new Date(v.getFullYear(), 0, 1);
          case 5:
            return new Date(v.getFullYear() - 1, 11, 31);
          case 6:
            return new Date(v.getFullYear() - 1, 11, 30);
        }
      }
      function q(v) {
        var E = v.Ud;
        for (v = new Date(new Date(v.Vd + 1900, 0, 1).getTime()); 0 < E;) {
          var H = v.getMonth(),
            S = (zd(v.getFullYear()) ? Ad : Bd)[H];
          if (E > S - v.getDate()) E -= S - v.getDate() + 1, v.setDate(1), 11 > H ? v.setMonth(H + 1) : (v.setMonth(0), v.setFullYear(v.getFullYear() + 1));else {
            v.setDate(v.getDate() + E);
            break;
          }
        }
        H = new Date(v.getFullYear() + 1, 0, 4);
        E = l(new Date(v.getFullYear(), 0, 4));
        H = l(H);
        return 0 >= m(E, v) ? 0 >= m(H, v) ? v.getFullYear() + 1 : v.getFullYear() : v.getFullYear() - 1;
      }
      var x = G[e + 40 >> 2];
      e = {
        qf: G[e >> 2],
        pf: G[e + 4 >> 2],
        ne: G[e + 8 >> 2],
        ve: G[e + 12 >> 2],
        oe: G[e + 16 >> 2],
        Vd: G[e + 20 >> 2],
        Rd: G[e + 24 >> 2],
        Ud: G[e + 28 >> 2],
        wf: G[e + 32 >> 2],
        nf: G[e + 36 >> 2],
        rf: x ? Ka(x) : ""
      };
      c = Ka(c);
      x = {
        "%c": "%a %b %d %H:%M:%S %Y",
        "%D": "%m/%d/%y",
        "%F": "%Y-%m-%d",
        "%h": "%b",
        "%r": "%I:%M:%S %p",
        "%R": "%H:%M",
        "%T": "%H:%M:%S",
        "%x": "%m/%d/%y",
        "%X": "%H:%M:%S",
        "%Ec": "%c",
        "%EC": "%C",
        "%Ex": "%m/%d/%y",
        "%EX": "%H:%M:%S",
        "%Ey": "%y",
        "%EY": "%Y",
        "%Od": "%d",
        "%Oe": "%e",
        "%OH": "%H",
        "%OI": "%I",
        "%Om": "%m",
        "%OM": "%M",
        "%OS": "%S",
        "%Ou": "%u",
        "%OU": "%U",
        "%OV": "%V",
        "%Ow": "%w",
        "%OW": "%W",
        "%Oy": "%y"
      };
      for (var y in x) c = c.replace(new RegExp(y, "g"), x[y]);
      var B = "Sunday Monday Tuesday Wednesday Thursday Friday Saturday".split(" "),
        D = "January February March April May June July August September October November December".split(" ");
      x = {
        "%a": function (v) {
          return B[v.Rd].substring(0, 3);
        },
        "%A": function (v) {
          return B[v.Rd];
        },
        "%b": function (v) {
          return D[v.oe].substring(0, 3);
        },
        "%B": function (v) {
          return D[v.oe];
        },
        "%C": function (v) {
          return k((v.Vd + 1900) / 100 | 0, 2);
        },
        "%d": function (v) {
          return k(v.ve, 2);
        },
        "%e": function (v) {
          return f(v.ve, 2, " ");
        },
        "%g": function (v) {
          return q(v).toString().substring(2);
        },
        "%G": function (v) {
          return q(v);
        },
        "%H": function (v) {
          return k(v.ne, 2);
        },
        "%I": function (v) {
          v = v.ne;
          0 == v ? v = 12 : 12 < v && (v -= 12);
          return k(v, 2);
        },
        "%j": function (v) {
          for (var E = 0, H = 0; H <= v.oe - 1; E += (zd(v.Vd + 1900) ? Ad : Bd)[H++]);
          return k(v.ve + E, 3);
        },
        "%m": function (v) {
          return k(v.oe + 1, 2);
        },
        "%M": function (v) {
          return k(v.pf, 2);
        },
        "%n": function () {
          return "\n";
        },
        "%p": function (v) {
          return 0 <= v.ne && 12 > v.ne ? "AM" : "PM";
        },
        "%S": function (v) {
          return k(v.qf, 2);
        },
        "%t": function () {
          return "\t";
        },
        "%u": function (v) {
          return v.Rd || 7;
        },
        "%U": function (v) {
          return k(Math.floor((v.Ud + 7 - v.Rd) / 7), 2);
        },
        "%V": function (v) {
          var E = Math.floor((v.Ud + 7 - (v.Rd + 6) % 7) / 7);
          2 >= (v.Rd + 371 - v.Ud - 2) % 7 && E++;
          if (E) 53 == E && (H = (v.Rd + 371 - v.Ud) % 7, 4 == H || 3 == H && zd(v.Vd) || (E = 1));else {
            E = 52;
            var H = (v.Rd + 7 - v.Ud - 1) % 7;
            (4 == H || 5 == H && zd(v.Vd % 400 - 1)) && E++;
          }
          return k(E, 2);
        },
        "%w": function (v) {
          return v.Rd;
        },
        "%W": function (v) {
          return k(Math.floor((v.Ud + 7 - (v.Rd + 6) % 7) / 7), 2);
        },
        "%y": function (v) {
          return (v.Vd + 1900).toString().substring(2);
        },
        "%Y": function (v) {
          return v.Vd + 1900;
        },
        "%z": function (v) {
          v = v.nf;
          var E = 0 <= v;
          v = Math.abs(v) / 60;
          return (E ? "+" : "-") + String("0000" + (v / 60 * 100 + v % 60)).slice(-4);
        },
        "%Z": function (v) {
          return v.rf;
        },
        "%%": function () {
          return "%";
        }
      };
      c = c.replace(/%%/g, "\x00\x00");
      for (y in x) c.includes(y) && (c = c.replace(new RegExp(y, "g"), x[y](e)));
      c = c.replace(/\0\0/g, "%");
      y = Cd(c);
      if (y.length > b) return 0;
      Ma.set(y, a);
      return y.length - 1;
    }
    tb = r.InternalError = sb("InternalError");
    for (var Ed = Array(256), Fd = 0; 256 > Fd; ++Fd) Ed[Fd] = String.fromCharCode(Fd);
    yb = Ed;
    zb = r.BindingError = sb("BindingError");
    Tb.prototype.isAliasOf = function (a) {
      if (!(this instanceof Tb && a instanceof Tb)) return !1;
      var b = this.jd.Jd.Hd,
        c = this.jd.Gd,
        e = a.jd.Jd.Hd;
      for (a = a.jd.Gd; b.Qd;) c = b.ee(c), b = b.Qd;
      for (; e.Qd;) a = e.ee(a), e = e.Qd;
      return b === e && c === a;
    };
    Tb.prototype.clone = function () {
      this.jd.Gd || Ab(this);
      if (this.jd.ce) return this.jd.count.value += 1, this;
      var a = Sb,
        b = Object,
        c = b.create,
        e = Object.getPrototypeOf(this),
        f = this.jd;
      a = a(c.call(b, e, {
        jd: {
          value: {
            count: f.count,
            Zd: f.Zd,
            ce: f.ce,
            Gd: f.Gd,
            Jd: f.Jd,
            Ld: f.Ld,
            Od: f.Od
          }
        }
      }));
      a.jd.count.value += 1;
      a.jd.Zd = !1;
      return a;
    };
    Tb.prototype["delete"] = function () {
      this.jd.Gd || Ab(this);
      this.jd.Zd && !this.jd.ce && P("Object already scheduled for deletion");
      Ib(this);
      Jb(this.jd);
      this.jd.ce || (this.jd.Ld = void 0, this.jd.Gd = void 0);
    };
    Tb.prototype.isDeleted = function () {
      return !this.jd.Gd;
    };
    Tb.prototype.deleteLater = function () {
      this.jd.Gd || Ab(this);
      this.jd.Zd && !this.jd.ce && P("Object already scheduled for deletion");
      Mb.push(this);
      1 === Mb.length && Ob && Ob(Nb);
      this.jd.Zd = !0;
      return this;
    };
    r.getInheritedInstanceCount = function () {
      return Object.keys(Pb).length;
    };
    r.getLiveInheritedInstances = function () {
      var a = [],
        b;
      for (b in Pb) Pb.hasOwnProperty(b) && a.push(Pb[b]);
      return a;
    };
    r.flushPendingDeletes = Nb;
    r.setDelayFunction = function (a) {
      Ob = a;
      Mb.length && Ob && Ob(Nb);
    };
    cc.prototype.Ye = function (a) {
      this.Ce && (a = this.Ce(a));
      return a;
    };
    cc.prototype.xe = function (a) {
      this.Sd && this.Sd(a);
    };
    cc.prototype.argPackAdvance = 8;
    cc.prototype.readValueFromPointer = mb;
    cc.prototype.deleteObject = function (a) {
      if (null !== a) a["delete"]();
    };
    cc.prototype.fromWireType = function (a) {
      function b() {
        return this.ie ? Rb(this.Hd.$d, {
          Jd: this.ff,
          Gd: c,
          Od: this,
          Ld: a
        }) : Rb(this.Hd.$d, {
          Jd: this,
          Gd: a
        });
      }
      var c = this.Ye(a);
      if (!c) return this.xe(a), null;
      var e = Qb(this.Hd, c);
      if (void 0 !== e) {
        if (0 === e.jd.count.value) return e.jd.Gd = c, e.jd.Ld = a, e.clone();
        e = e.clone();
        this.xe(a);
        return e;
      }
      e = this.Hd.Xe(c);
      e = Lb[e];
      if (!e) return b.call(this);
      e = this.he ? e.Re : e.pointerType;
      var f = Kb(c, this.Hd, e.Hd);
      return null === f ? b.call(this) : this.ie ? Rb(e.Hd.$d, {
        Jd: e,
        Gd: f,
        Od: this,
        Ld: a
      }) : Rb(e.Hd.$d, {
        Jd: e,
        Gd: f
      });
    };
    fc = r.UnboundTypeError = sb("UnboundTypeError");
    r.count_emval_handles = function () {
      for (var a = 0, b = 5; b < uc.length; ++b) void 0 !== uc[b] && ++a;
      return a;
    };
    r.get_first_emval = function () {
      for (var a = 5; a < uc.length; ++a) if (void 0 !== uc[a]) return uc[a];
      return null;
    };
    for (var X, Gd = 0; 32 > Gd; ++Gd) ld.push(Array(Gd));
    var Hd = new Float32Array(288);
    for (Gd = 0; 288 > Gd; ++Gd) td[Gd] = Hd.subarray(0, Gd + 1);
    var Id = new Int32Array(288);
    for (Gd = 0; 288 > Gd; ++Gd) ud[Gd] = Id.subarray(0, Gd + 1);
    var Wd = {
      G: function (a, b, c) {
        new ib(a).je(b, c);
        jb++;
        throw a;
      },
      T: function () {
        return 0;
      },
      rb: function () {},
      tb: function () {
        return 0;
      },
      pb: function () {},
      ub: function () {},
      qb: function () {},
      C: function (a) {
        var b = kb[a];
        delete kb[a];
        var c = b.te,
          e = b.Sd,
          f = b.Ae,
          k = f.map(m => m.af).concat(f.map(m => m.kf));
        vb([a], k, m => {
          var l = {};
          f.forEach((q, x) => {
            var y = m[x],
              B = q.Ze,
              D = q.$e,
              v = m[x + f.length],
              E = q.jf,
              H = q.lf;
            l[q.We] = {
              read: S => y.fromWireType(B(D, S)),
              write: (S, Y) => {
                var da = [];
                E(H, S, v.toWireType(da, Y));
                lb(da);
              }
            };
          });
          return [{
            name: b.name,
            fromWireType: function (q) {
              var x = {},
                y;
              for (y in l) x[y] = l[y].read(q);
              e(q);
              return x;
            },
            toWireType: function (q, x) {
              for (var y in l) if (!(y in x)) throw new TypeError('Missing field:  "' + y + '"');
              var B = c();
              for (y in l) l[y].write(B, x[y]);
              null !== q && q.push(e, B);
              return B;
            },
            argPackAdvance: 8,
            readValueFromPointer: mb,
            Nd: e
          }];
        });
      },
      hb: function () {},
      yb: function (a, b, c, e, f) {
        var k = xb(c);
        b = O(b);
        wb(a, {
          name: b,
          fromWireType: function (m) {
            return !!m;
          },
          toWireType: function (m, l) {
            return l ? e : f;
          },
          argPackAdvance: 8,
          readValueFromPointer: function (m) {
            if (1 === c) var l = Ma;else if (2 === c) l = Na;else if (4 === c) l = G;else throw new TypeError("Unknown boolean type size: " + b);
            return this.fromWireType(l[m >> k]);
          },
          Nd: null
        });
      },
      l: function (a, b, c, e, f, k, m, l, q, x, y, B, D) {
        y = O(y);
        k = R(f, k);
        l && (l = R(m, l));
        x && (x = R(q, x));
        D = R(B, D);
        var v = qb(y);
        Vb(v, function () {
          qc("Cannot construct " + y + " due to unbound types", [e]);
        });
        vb([a, b, c], e ? [e] : [], function (E) {
          E = E[0];
          if (e) {
            var H = E.Hd;
            var S = H.$d;
          } else S = Tb.prototype;
          E = rb(v, function () {
            if (Object.getPrototypeOf(this) !== Y) throw new zb("Use 'new' to construct " + y);
            if (void 0 === da.Td) throw new zb(y + " has no accessible constructor");
            var La = da.Td[arguments.length];
            if (void 0 === La) throw new zb("Tried to invoke ctor of " + y + " with invalid number of parameters (" + arguments.length + ") - expected (" + Object.keys(da.Td).toString() + ") parameters instead!");
            return La.apply(this, arguments);
          });
          var Y = Object.create(S, {
            constructor: {
              value: E
            }
          });
          E.prototype = Y;
          var da = new Wb(y, E, Y, D, H, k, l, x);
          H = new cc(y, da, !0, !1, !1);
          S = new cc(y + "*", da, !1, !1, !1);
          var ua = new cc(y + " const*", da, !1, !0, !1);
          Lb[a] = {
            pointerType: S,
            Re: ua
          };
          dc(v, E);
          return [H, S, ua];
        });
      },
      e: function (a, b, c, e, f, k, m) {
        var l = sc(c, e);
        b = O(b);
        k = R(f, k);
        vb([], [a], function (q) {
          function x() {
            qc("Cannot call " + y + " due to unbound types", l);
          }
          q = q[0];
          var y = q.name + "." + b;
          b.startsWith("@@") && (b = Symbol[b.substring(2)]);
          var B = q.Hd.constructor;
          void 0 === B[b] ? (x.Xd = c - 1, B[b] = x) : (Ub(B, b, y), B[b].Kd[c - 1] = x);
          vb([], l, function (D) {
            D = [D[0], null].concat(D.slice(1));
            D = rc(y, D, null, k, m);
            void 0 === B[b].Kd ? (D.Xd = c - 1, B[b] = D) : B[b].Kd[c - 1] = D;
            return [];
          });
          return [];
        });
      },
      A: function (a, b, c, e, f, k) {
        0 < b || Fa();
        var m = sc(b, c);
        f = R(e, f);
        vb([], [a], function (l) {
          l = l[0];
          var q = "constructor " + l.name;
          void 0 === l.Hd.Td && (l.Hd.Td = []);
          if (void 0 !== l.Hd.Td[b - 1]) throw new zb("Cannot register multiple constructors with identical number of parameters (" + (b - 1) + ") for class '" + l.name + "'! Overload resolution is currently only performed using the parameter count, not actual type info!");
          l.Hd.Td[b - 1] = () => {
            qc("Cannot construct " + l.name + " due to unbound types", m);
          };
          vb([], m, function (x) {
            x.splice(1, 0, null);
            l.Hd.Td[b - 1] = rc(q, x, null, f, k);
            return [];
          });
          return [];
        });
      },
      a: function (a, b, c, e, f, k, m, l) {
        var q = sc(c, e);
        b = O(b);
        k = R(f, k);
        vb([], [a], function (x) {
          function y() {
            qc("Cannot call " + B + " due to unbound types", q);
          }
          x = x[0];
          var B = x.name + "." + b;
          b.startsWith("@@") && (b = Symbol[b.substring(2)]);
          l && x.Hd.gf.push(b);
          var D = x.Hd.$d,
            v = D[b];
          void 0 === v || void 0 === v.Kd && v.className !== x.name && v.Xd === c - 2 ? (y.Xd = c - 2, y.className = x.name, D[b] = y) : (Ub(D, b, B), D[b].Kd[c - 2] = y);
          vb([], q, function (E) {
            E = rc(B, E, x, k, m);
            void 0 === D[b].Kd ? (E.Xd = c - 2, D[b] = E) : D[b].Kd[c - 2] = E;
            return [];
          });
          return [];
        });
      },
      r: function (a, b, c) {
        a = O(a);
        vb([], [b], function (e) {
          e = e[0];
          r[a] = e.fromWireType(c);
          return [];
        });
      },
      xb: function (a, b) {
        b = O(b);
        wb(a, {
          name: b,
          fromWireType: function (c) {
            var e = wc(c);
            vc(c);
            return e;
          },
          toWireType: function (c, e) {
            return ac(e);
          },
          argPackAdvance: 8,
          readValueFromPointer: mb,
          Nd: null
        });
      },
      i: function (a, b, c, e) {
        function f() {}
        c = xb(c);
        b = O(b);
        f.values = {};
        wb(a, {
          name: b,
          constructor: f,
          fromWireType: function (k) {
            return this.constructor.values[k];
          },
          toWireType: function (k, m) {
            return m.value;
          },
          argPackAdvance: 8,
          readValueFromPointer: xc(b, c, e),
          Nd: null
        });
        Vb(b, f);
      },
      b: function (a, b, c) {
        var e = yc(a, "enum");
        b = O(b);
        a = e.constructor;
        e = Object.create(e.constructor.prototype, {
          value: {
            value: c
          },
          constructor: {
            value: rb(e.name + "_" + b, function () {})
          }
        });
        a.values[c] = e;
        a[b] = e;
      },
      W: function (a, b, c) {
        c = xb(c);
        b = O(b);
        wb(a, {
          name: b,
          fromWireType: function (e) {
            return e;
          },
          toWireType: function (e, f) {
            return f;
          },
          argPackAdvance: 8,
          readValueFromPointer: zc(b, c),
          Nd: null
        });
      },
      t: function (a, b, c, e, f, k) {
        var m = sc(b, c);
        a = O(a);
        f = R(e, f);
        Vb(a, function () {
          qc("Cannot call " + a + " due to unbound types", m);
        }, b - 1);
        vb([], m, function (l) {
          l = [l[0], null].concat(l.slice(1));
          dc(a, rc(a, l, null, f, k), b - 1);
          return [];
        });
      },
      E: function (a, b, c, e, f) {
        b = O(b);
        -1 === f && (f = 4294967295);
        f = xb(c);
        var k = l => l;
        if (0 === e) {
          var m = 32 - 8 * c;
          k = l => l << m >>> m;
        }
        c = b.includes("unsigned") ? function (l, q) {
          return q >>> 0;
        } : function (l, q) {
          return q;
        };
        wb(a, {
          name: b,
          fromWireType: k,
          toWireType: c,
          argPackAdvance: 8,
          readValueFromPointer: Ac(b, f, 0 !== e),
          Nd: null
        });
      },
      s: function (a, b, c) {
        function e(k) {
          k >>= 2;
          var m = J;
          return new f(m.buffer, m[k + 1], m[k]);
        }
        var f = [Int8Array, Uint8Array, Int16Array, Uint16Array, Int32Array, Uint32Array, Float32Array, Float64Array][b];
        c = O(c);
        wb(a, {
          name: c,
          fromWireType: e,
          argPackAdvance: 8,
          readValueFromPointer: e
        }, {
          cf: !0
        });
      },
      q: function (a, b, c, e, f, k, m, l, q, x, y, B) {
        c = O(c);
        k = R(f, k);
        l = R(m, l);
        x = R(q, x);
        B = R(y, B);
        vb([a], [b], function (D) {
          D = D[0];
          return [new cc(c, D.Hd, !1, !1, !0, D, e, k, l, x, B)];
        });
      },
      V: function (a, b) {
        b = O(b);
        var c = "std::string" === b;
        wb(a, {
          name: b,
          fromWireType: function (e) {
            var f = J[e >> 2],
              k = e + 4;
            if (c) for (var m = k, l = 0; l <= f; ++l) {
              var q = k + l;
              if (l == f || 0 == C[q]) {
                m = Ka(m, q - m);
                if (void 0 === x) var x = m;else x += String.fromCharCode(0), x += m;
                m = q + 1;
              }
            } else {
              x = Array(f);
              for (l = 0; l < f; ++l) x[l] = String.fromCharCode(C[k + l]);
              x = x.join("");
            }
            pc(e);
            return x;
          },
          toWireType: function (e, f) {
            f instanceof ArrayBuffer && (f = new Uint8Array(f));
            var k,
              m = "string" == typeof f;
            m || f instanceof Uint8Array || f instanceof Uint8ClampedArray || f instanceof Int8Array || P("Cannot pass non-string to std::string");
            c && m ? k = ja(f) : k = f.length;
            var l = pd(4 + k + 1),
              q = l + 4;
            J[l >> 2] = k;
            if (c && m) ka(f, C, q, k + 1);else if (m) for (m = 0; m < k; ++m) {
              var x = f.charCodeAt(m);
              255 < x && (pc(q), P("String has UTF-16 code units that do not fit in 8 bits"));
              C[q + m] = x;
            } else for (m = 0; m < k; ++m) C[q + m] = f[m];
            null !== e && e.push(pc, l);
            return l;
          },
          argPackAdvance: 8,
          readValueFromPointer: mb,
          Nd: function (e) {
            pc(e);
          }
        });
      },
      M: function (a, b, c) {
        c = O(c);
        if (2 === b) {
          var e = Cc;
          var f = Dc;
          var k = Ec;
          var m = () => Oa;
          var l = 1;
        } else 4 === b && (e = Fc, f = Gc, k = Hc, m = () => J, l = 2);
        wb(a, {
          name: c,
          fromWireType: function (q) {
            for (var x = J[q >> 2], y = m(), B, D = q + 4, v = 0; v <= x; ++v) {
              var E = q + 4 + v * b;
              if (v == x || 0 == y[E >> l]) D = e(D, E - D), void 0 === B ? B = D : (B += String.fromCharCode(0), B += D), D = E + b;
            }
            pc(q);
            return B;
          },
          toWireType: function (q, x) {
            "string" != typeof x && P("Cannot pass non-string to C++ string type " + c);
            var y = k(x),
              B = pd(4 + y + b);
            J[B >> 2] = y >> l;
            f(x, B + 4, y + b);
            null !== q && q.push(pc, B);
            return B;
          },
          argPackAdvance: 8,
          readValueFromPointer: mb,
          Nd: function (q) {
            pc(q);
          }
        });
      },
      D: function (a, b, c, e, f, k) {
        kb[a] = {
          name: O(b),
          te: R(c, e),
          Sd: R(f, k),
          Ae: []
        };
      },
      d: function (a, b, c, e, f, k, m, l, q, x) {
        kb[a].Ae.push({
          We: O(b),
          af: c,
          Ze: R(e, f),
          $e: k,
          kf: m,
          jf: R(l, q),
          lf: x
        });
      },
      zb: function (a, b) {
        b = O(b);
        wb(a, {
          ef: !0,
          name: b,
          argPackAdvance: 0,
          fromWireType: function () {},
          toWireType: function () {}
        });
      },
      wb: function () {
        return !0;
      },
      jb: function () {
        throw Infinity;
      },
      F: function (a, b, c) {
        a = wc(a);
        b = yc(b, "emval::as");
        var e = [],
          f = ac(e);
        J[c >> 2] = f;
        return b.toWireType(e, a);
      },
      O: function (a, b, c, e, f) {
        a = Kc[a];
        b = wc(b);
        c = Jc(c);
        var k = [];
        J[e >> 2] = ac(k);
        return a(b, c, k, f);
      },
      x: function (a, b, c, e) {
        a = Kc[a];
        b = wc(b);
        c = Jc(c);
        a(b, c, null, e);
      },
      c: vc,
      K: function (a) {
        if (0 === a) return ac(Lc());
        a = Jc(a);
        return ac(Lc()[a]);
      },
      u: function (a, b) {
        var c = Nc(a, b),
          e = c[0];
        b = e.name + "_$" + c.slice(1).map(function (m) {
          return m.name;
        }).join("_") + "$";
        var f = Oc[b];
        if (void 0 !== f) return f;
        var k = Array(a - 1);
        f = Mc((m, l, q, x) => {
          for (var y = 0, B = 0; B < a - 1; ++B) k[B] = c[B + 1].readValueFromPointer(x + y), y += c[B + 1].argPackAdvance;
          m = m[l].apply(m, k);
          for (B = 0; B < a - 1; ++B) c[B + 1].Te && c[B + 1].Te(k[B]);
          if (!e.ef) return e.toWireType(q, m);
        });
        return Oc[b] = f;
      },
      z: function (a, b) {
        a = wc(a);
        b = wc(b);
        return ac(a[b]);
      },
      o: function (a) {
        4 < a && (uc[a].ue += 1);
      },
      J: function (a, b, c, e) {
        a = wc(a);
        var f = Qc[b];
        f || (f = Pc(b), Qc[b] = f);
        return f(a, c, e);
      },
      I: function () {
        return ac([]);
      },
      f: function (a) {
        return ac(Jc(a));
      },
      H: function () {
        return ac({});
      },
      db: function (a) {
        a = wc(a);
        return !a;
      },
      B: function (a) {
        var b = wc(a);
        lb(b);
        vc(a);
      },
      h: function (a, b, c) {
        a = wc(a);
        b = wc(b);
        c = wc(c);
        a[b] = c;
      },
      g: function (a, b) {
        a = yc(a, "_emval_take_value");
        a = a.readValueFromPointer(b);
        return ac(a);
      },
      lb: function () {
        return -52;
      },
      mb: function () {},
      j: function () {
        Fa("");
      },
      vb: Rc,
      Tc: function (a) {
        X.activeTexture(a);
      },
      Uc: function (a, b) {
        X.attachShader(Xc[a], $c[b]);
      },
      Vc: function (a, b, c) {
        X.bindAttribLocation(Xc[a], b, Ka(c));
      },
      Wc: function (a, b) {
        35051 == a ? X.qe = b : 35052 == a && (X.Yd = b);
        X.bindBuffer(a, Wc[b]);
      },
      _: function (a, b) {
        X.bindFramebuffer(a, Yc[b]);
      },
      Xb: function (a, b) {
        X.bindRenderbuffer(a, Zc[b]);
      },
      Hb: function (a, b) {
        X.bindSampler(a, bd[b]);
      },
      Xc: function (a, b) {
        X.bindTexture(a, ea[b]);
      },
      pc: function (a) {
        X.bindVertexArray(ad[a]);
      },
      sc: function (a) {
        X.bindVertexArray(ad[a]);
      },
      Yc: function (a, b, c, e) {
        X.blendColor(a, b, c, e);
      },
      Zc: function (a) {
        X.blendEquation(a);
      },
      _c: function (a, b) {
        X.blendFunc(a, b);
      },
      Rb: function (a, b, c, e, f, k, m, l, q, x) {
        X.blitFramebuffer(a, b, c, e, f, k, m, l, q, x);
      },
      $: function (a, b, c, e) {
        2 <= u.version ? c && b ? X.bufferData(a, C, e, c, b) : X.bufferData(a, b, e) : X.bufferData(a, c ? C.subarray(c, c + b) : b, e);
      },
      aa: function (a, b, c, e) {
        2 <= u.version ? c && X.bufferSubData(a, b, C, e, c) : X.bufferSubData(a, b, C.subarray(e, e + c));
      },
      Yb: function (a) {
        return X.checkFramebufferStatus(a);
      },
      Q: function (a) {
        X.clear(a);
      },
      Z: function (a, b, c, e) {
        X.clearColor(a, b, c, e);
      },
      S: function (a) {
        X.clearStencil(a);
      },
      bb: function (a, b, c, e) {
        return X.clientWaitSync(cd[a], b, (c >>> 0) + 4294967296 * e);
      },
      ba: function (a, b, c, e) {
        X.colorMask(!!a, !!b, !!c, !!e);
      },
      ca: function (a) {
        X.compileShader($c[a]);
      },
      da: function (a, b, c, e, f, k, m, l) {
        2 <= u.version ? X.Yd || !m ? X.compressedTexImage2D(a, b, c, e, f, k, m, l) : X.compressedTexImage2D(a, b, c, e, f, k, C, l, m) : X.compressedTexImage2D(a, b, c, e, f, k, l ? C.subarray(l, l + m) : null);
      },
      ea: function (a, b, c, e, f, k, m, l, q) {
        2 <= u.version ? X.Yd || !l ? X.compressedTexSubImage2D(a, b, c, e, f, k, m, l, q) : X.compressedTexSubImage2D(a, b, c, e, f, k, m, C, q, l) : X.compressedTexSubImage2D(a, b, c, e, f, k, m, q ? C.subarray(q, q + l) : null);
      },
      Pb: function (a, b, c, e, f) {
        X.copyBufferSubData(a, b, c, e, f);
      },
      fa: function (a, b, c, e, f, k, m, l) {
        X.copyTexSubImage2D(a, b, c, e, f, k, m, l);
      },
      ga: function () {
        var a = ca(Xc),
          b = X.createProgram();
        b.name = a;
        b.me = b.ke = b.le = 0;
        b.we = 1;
        Xc[a] = b;
        return a;
      },
      ha: function (a) {
        var b = ca($c);
        $c[b] = X.createShader(a);
        return b;
      },
      ia: function (a) {
        X.cullFace(a);
      },
      ja: function (a, b) {
        for (var c = 0; c < a; c++) {
          var e = G[b + 4 * c >> 2],
            f = Wc[e];
          f && (X.deleteBuffer(f), f.name = 0, Wc[e] = null, e == X.qe && (X.qe = 0), e == X.Yd && (X.Yd = 0));
        }
      },
      Zb: function (a, b) {
        for (var c = 0; c < a; ++c) {
          var e = G[b + 4 * c >> 2],
            f = Yc[e];
          f && (X.deleteFramebuffer(f), f.name = 0, Yc[e] = null);
        }
      },
      ka: function (a) {
        if (a) {
          var b = Xc[a];
          b ? (X.deleteProgram(b), b.name = 0, Xc[a] = null) : U(1281);
        }
      },
      _b: function (a, b) {
        for (var c = 0; c < a; c++) {
          var e = G[b + 4 * c >> 2],
            f = Zc[e];
          f && (X.deleteRenderbuffer(f), f.name = 0, Zc[e] = null);
        }
      },
      Ib: function (a, b) {
        for (var c = 0; c < a; c++) {
          var e = G[b + 4 * c >> 2],
            f = bd[e];
          f && (X.deleteSampler(f), f.name = 0, bd[e] = null);
        }
      },
      la: function (a) {
        if (a) {
          var b = $c[a];
          b ? (X.deleteShader(b), $c[a] = null) : U(1281);
        }
      },
      Qb: function (a) {
        if (a) {
          var b = cd[a];
          b ? (X.deleteSync(b), b.name = 0, cd[a] = null) : U(1281);
        }
      },
      ma: function (a, b) {
        for (var c = 0; c < a; c++) {
          var e = G[b + 4 * c >> 2],
            f = ea[e];
          f && (X.deleteTexture(f), f.name = 0, ea[e] = null);
        }
      },
      qc: function (a, b) {
        for (var c = 0; c < a; c++) {
          var e = G[b + 4 * c >> 2];
          X.deleteVertexArray(ad[e]);
          ad[e] = null;
        }
      },
      tc: function (a, b) {
        for (var c = 0; c < a; c++) {
          var e = G[b + 4 * c >> 2];
          X.deleteVertexArray(ad[e]);
          ad[e] = null;
        }
      },
      na: function (a) {
        X.depthMask(!!a);
      },
      oa: function (a) {
        X.disable(a);
      },
      pa: function (a) {
        X.disableVertexAttribArray(a);
      },
      qa: function (a, b, c) {
        X.drawArrays(a, b, c);
      },
      nc: function (a, b, c, e) {
        X.drawArraysInstanced(a, b, c, e);
      },
      lc: function (a, b, c, e, f) {
        X.ye.drawArraysInstancedBaseInstanceWEBGL(a, b, c, e, f);
      },
      jc: function (a, b) {
        for (var c = ld[a], e = 0; e < a; e++) c[e] = G[b + 4 * e >> 2];
        X.drawBuffers(c);
      },
      ra: function (a, b, c, e) {
        X.drawElements(a, b, c, e);
      },
      oc: function (a, b, c, e, f) {
        X.drawElementsInstanced(a, b, c, e, f);
      },
      mc: function (a, b, c, e, f, k, m) {
        X.ye.drawElementsInstancedBaseVertexBaseInstanceWEBGL(a, b, c, e, f, k, m);
      },
      dc: function (a, b, c, e, f, k) {
        X.drawElements(a, e, f, k);
      },
      sa: function (a) {
        X.enable(a);
      },
      ta: function (a) {
        X.enableVertexAttribArray(a);
      },
      Nb: function (a, b) {
        return (a = X.fenceSync(a, b)) ? (b = ca(cd), a.name = b, cd[b] = a, b) : 0;
      },
      ua: function () {
        X.finish();
      },
      va: function () {
        X.flush();
      },
      $b: function (a, b, c, e) {
        X.framebufferRenderbuffer(a, b, c, Zc[e]);
      },
      ac: function (a, b, c, e, f) {
        X.framebufferTexture2D(a, b, c, ea[e], f);
      },
      wa: function (a) {
        X.frontFace(a);
      },
      xa: function (a, b) {
        md(a, b, "createBuffer", Wc);
      },
      bc: function (a, b) {
        md(a, b, "createFramebuffer", Yc);
      },
      cc: function (a, b) {
        md(a, b, "createRenderbuffer", Zc);
      },
      Jb: function (a, b) {
        md(a, b, "createSampler", bd);
      },
      ya: function (a, b) {
        md(a, b, "createTexture", ea);
      },
      rc: function (a, b) {
        md(a, b, "createVertexArray", ad);
      },
      uc: function (a, b) {
        md(a, b, "createVertexArray", ad);
      },
      Tb: function (a) {
        X.generateMipmap(a);
      },
      za: function (a, b, c) {
        c ? G[c >> 2] = X.getBufferParameter(a, b) : U(1281);
      },
      Aa: function () {
        var a = X.getError() || hd;
        hd = 0;
        return a;
      },
      Ba: function (a, b) {
        nd(a, b, 2);
      },
      Ub: function (a, b, c, e) {
        a = X.getFramebufferAttachmentParameter(a, b, c);
        if (a instanceof WebGLRenderbuffer || a instanceof WebGLTexture) a = a.name | 0;
        G[e >> 2] = a;
      },
      L: function (a, b) {
        nd(a, b, 0);
      },
      Ca: function (a, b, c, e) {
        a = X.getProgramInfoLog(Xc[a]);
        null === a && (a = "(unknown error)");
        b = 0 < b && e ? ka(a, C, e, b) : 0;
        c && (G[c >> 2] = b);
      },
      Da: function (a, b, c) {
        if (c) {
          if (a >= Vc) U(1281);else if (a = Xc[a], 35716 == b) a = X.getProgramInfoLog(a), null === a && (a = "(unknown error)"), G[c >> 2] = a.length + 1;else if (35719 == b) {
            if (!a.me) for (b = 0; b < X.getProgramParameter(a, 35718); ++b) a.me = Math.max(a.me, X.getActiveUniform(a, b).name.length + 1);
            G[c >> 2] = a.me;
          } else if (35722 == b) {
            if (!a.ke) for (b = 0; b < X.getProgramParameter(a, 35721); ++b) a.ke = Math.max(a.ke, X.getActiveAttrib(a, b).name.length + 1);
            G[c >> 2] = a.ke;
          } else if (35381 == b) {
            if (!a.le) for (b = 0; b < X.getProgramParameter(a, 35382); ++b) a.le = Math.max(a.le, X.getActiveUniformBlockName(a, b).length + 1);
            G[c >> 2] = a.le;
          } else G[c >> 2] = X.getProgramParameter(a, b);
        } else U(1281);
      },
      Vb: function (a, b, c) {
        c ? G[c >> 2] = X.getRenderbufferParameter(a, b) : U(1281);
      },
      Ea: function (a, b, c, e) {
        a = X.getShaderInfoLog($c[a]);
        null === a && (a = "(unknown error)");
        b = 0 < b && e ? ka(a, C, e, b) : 0;
        c && (G[c >> 2] = b);
      },
      Eb: function (a, b, c, e) {
        a = X.getShaderPrecisionFormat(a, b);
        G[c >> 2] = a.rangeMin;
        G[c + 4 >> 2] = a.rangeMax;
        G[e >> 2] = a.precision;
      },
      Fa: function (a, b, c) {
        c ? 35716 == b ? (a = X.getShaderInfoLog($c[a]), null === a && (a = "(unknown error)"), G[c >> 2] = a ? a.length + 1 : 0) : 35720 == b ? (a = X.getShaderSource($c[a]), G[c >> 2] = a ? a.length + 1 : 0) : G[c >> 2] = X.getShaderParameter($c[a], b) : U(1281);
      },
      P: function (a) {
        var b = ed[a];
        if (!b) {
          switch (a) {
            case 7939:
              b = X.getSupportedExtensions() || [];
              b = b.concat(b.map(function (e) {
                return "GL_" + e;
              }));
              b = od(b.join(" "));
              break;
            case 7936:
            case 7937:
            case 37445:
            case 37446:
              (b = X.getParameter(a)) || U(1280);
              b = b && od(b);
              break;
            case 7938:
              b = X.getParameter(7938);
              b = 2 <= u.version ? "OpenGL ES 3.0 (" + b + ")" : "OpenGL ES 2.0 (" + b + ")";
              b = od(b);
              break;
            case 35724:
              b = X.getParameter(35724);
              var c = b.match(/^WebGL GLSL ES ([0-9]\.[0-9][0-9]?)(?:$| .*)/);
              null !== c && (3 == c[1].length && (c[1] += "0"), b = "OpenGL ES GLSL ES " + c[1] + " (" + b + ")");
              b = od(b);
              break;
            default:
              U(1280);
          }
          ed[a] = b;
        }
        return b;
      },
      ab: function (a, b) {
        if (2 > u.version) return U(1282), 0;
        var c = fd[a];
        if (c) return 0 > b || b >= c.length ? (U(1281), 0) : c[b];
        switch (a) {
          case 7939:
            return c = X.getSupportedExtensions() || [], c = c.concat(c.map(function (e) {
              return "GL_" + e;
            })), c = c.map(function (e) {
              return od(e);
            }), c = fd[a] = c, 0 > b || b >= c.length ? (U(1281), 0) : c[b];
          default:
            return U(1280), 0;
        }
      },
      Ga: function (a, b) {
        b = Ka(b);
        if (a = Xc[a]) {
          var c = a,
            e = c.de,
            f = c.Ee,
            k;
          if (!e) for (c.de = e = {}, c.De = {}, k = 0; k < X.getProgramParameter(c, 35718); ++k) {
            var m = X.getActiveUniform(c, k);
            var l = m.name;
            m = m.size;
            var q = qd(l);
            q = 0 < q ? l.slice(0, q) : l;
            var x = c.we;
            c.we += m;
            f[q] = [m, x];
            for (l = 0; l < m; ++l) e[x] = l, c.De[x++] = q;
          }
          c = a.de;
          e = 0;
          f = b;
          k = qd(b);
          0 < k && (e = parseInt(b.slice(k + 1)) >>> 0, f = b.slice(0, k));
          if ((f = a.Ee[f]) && e < f[0] && (e += f[1], c[e] = c[e] || X.getUniformLocation(a, b))) return e;
        } else U(1281);
        return -1;
      },
      Fb: function (a, b, c) {
        for (var e = ld[b], f = 0; f < b; f++) e[f] = G[c + 4 * f >> 2];
        X.invalidateFramebuffer(a, e);
      },
      Gb: function (a, b, c, e, f, k, m) {
        for (var l = ld[b], q = 0; q < b; q++) l[q] = G[c + 4 * q >> 2];
        X.invalidateSubFramebuffer(a, l, e, f, k, m);
      },
      Ob: function (a) {
        return X.isSync(cd[a]);
      },
      Ha: function (a) {
        return (a = ea[a]) ? X.isTexture(a) : 0;
      },
      Ia: function (a) {
        X.lineWidth(a);
      },
      Ja: function (a) {
        a = Xc[a];
        X.linkProgram(a);
        a.de = 0;
        a.Ee = {};
      },
      hc: function (a, b, c, e, f, k) {
        X.Be.multiDrawArraysInstancedBaseInstanceWEBGL(a, G, b >> 2, G, c >> 2, G, e >> 2, J, f >> 2, k);
      },
      ic: function (a, b, c, e, f, k, m, l) {
        X.Be.multiDrawElementsInstancedBaseVertexBaseInstanceWEBGL(a, G, b >> 2, c, G, e >> 2, G, f >> 2, G, k >> 2, J, m >> 2, l);
      },
      Ka: function (a, b) {
        3317 == a && (gd = b);
        X.pixelStorei(a, b);
      },
      kc: function (a) {
        X.readBuffer(a);
      },
      La: function (a, b, c, e, f, k, m) {
        if (2 <= u.version) {
          if (X.qe) X.readPixels(a, b, c, e, f, k, m);else {
            var l = rd(k);
            X.readPixels(a, b, c, e, f, k, l, m >> 31 - Math.clz32(l.BYTES_PER_ELEMENT));
          }
        } else (m = sd(k, f, c, e, m)) ? X.readPixels(a, b, c, e, f, k, m) : U(1280);
      },
      Wb: function (a, b, c, e) {
        X.renderbufferStorage(a, b, c, e);
      },
      Sb: function (a, b, c, e, f) {
        X.renderbufferStorageMultisample(a, b, c, e, f);
      },
      Kb: function (a, b, c) {
        X.samplerParameterf(bd[a], b, c);
      },
      Lb: function (a, b, c) {
        X.samplerParameteri(bd[a], b, c);
      },
      Mb: function (a, b, c) {
        X.samplerParameteri(bd[a], b, G[c >> 2]);
      },
      Ma: function (a, b, c, e) {
        X.scissor(a, b, c, e);
      },
      Na: function (a, b, c, e) {
        for (var f = "", k = 0; k < b; ++k) {
          var m = e ? G[e + 4 * k >> 2] : -1;
          f += Ka(G[c + 4 * k >> 2], 0 > m ? void 0 : m);
        }
        X.shaderSource($c[a], f);
      },
      Oa: function (a, b, c) {
        X.stencilFunc(a, b, c);
      },
      Pa: function (a, b, c, e) {
        X.stencilFuncSeparate(a, b, c, e);
      },
      Qa: function (a) {
        X.stencilMask(a);
      },
      Ra: function (a, b) {
        X.stencilMaskSeparate(a, b);
      },
      Sa: function (a, b, c) {
        X.stencilOp(a, b, c);
      },
      Ta: function (a, b, c, e) {
        X.stencilOpSeparate(a, b, c, e);
      },
      Ua: function (a, b, c, e, f, k, m, l, q) {
        if (2 <= u.version) {
          if (X.Yd) X.texImage2D(a, b, c, e, f, k, m, l, q);else if (q) {
            var x = rd(l);
            X.texImage2D(a, b, c, e, f, k, m, l, x, q >> 31 - Math.clz32(x.BYTES_PER_ELEMENT));
          } else X.texImage2D(a, b, c, e, f, k, m, l, null);
        } else X.texImage2D(a, b, c, e, f, k, m, l, q ? sd(l, m, e, f, q) : null);
      },
      Va: function (a, b, c) {
        X.texParameterf(a, b, c);
      },
      Wa: function (a, b, c) {
        X.texParameterf(a, b, N[c >> 2]);
      },
      Xa: function (a, b, c) {
        X.texParameteri(a, b, c);
      },
      Ya: function (a, b, c) {
        X.texParameteri(a, b, G[c >> 2]);
      },
      ec: function (a, b, c, e, f) {
        X.texStorage2D(a, b, c, e, f);
      },
      Za: function (a, b, c, e, f, k, m, l, q) {
        if (2 <= u.version) {
          if (X.Yd) X.texSubImage2D(a, b, c, e, f, k, m, l, q);else if (q) {
            var x = rd(l);
            X.texSubImage2D(a, b, c, e, f, k, m, l, x, q >> 31 - Math.clz32(x.BYTES_PER_ELEMENT));
          } else X.texSubImage2D(a, b, c, e, f, k, m, l, null);
        } else x = null, q && (x = sd(l, m, f, k, q)), X.texSubImage2D(a, b, c, e, f, k, m, l, x);
      },
      _a: function (a, b) {
        X.uniform1f(Z(a), b);
      },
      $a: function (a, b, c) {
        if (2 <= u.version) b && X.uniform1fv(Z(a), N, c >> 2, b);else {
          if (288 >= b) for (var e = td[b - 1], f = 0; f < b; ++f) e[f] = N[c + 4 * f >> 2];else e = N.subarray(c >> 2, c + 4 * b >> 2);
          X.uniform1fv(Z(a), e);
        }
      },
      Pc: function (a, b) {
        X.uniform1i(Z(a), b);
      },
      Qc: function (a, b, c) {
        if (2 <= u.version) b && X.uniform1iv(Z(a), G, c >> 2, b);else {
          if (288 >= b) for (var e = ud[b - 1], f = 0; f < b; ++f) e[f] = G[c + 4 * f >> 2];else e = G.subarray(c >> 2, c + 4 * b >> 2);
          X.uniform1iv(Z(a), e);
        }
      },
      Rc: function (a, b, c) {
        X.uniform2f(Z(a), b, c);
      },
      Sc: function (a, b, c) {
        if (2 <= u.version) b && X.uniform2fv(Z(a), N, c >> 2, 2 * b);else {
          if (144 >= b) for (var e = td[2 * b - 1], f = 0; f < 2 * b; f += 2) e[f] = N[c + 4 * f >> 2], e[f + 1] = N[c + (4 * f + 4) >> 2];else e = N.subarray(c >> 2, c + 8 * b >> 2);
          X.uniform2fv(Z(a), e);
        }
      },
      Oc: function (a, b, c) {
        X.uniform2i(Z(a), b, c);
      },
      Nc: function (a, b, c) {
        if (2 <= u.version) b && X.uniform2iv(Z(a), G, c >> 2, 2 * b);else {
          if (144 >= b) for (var e = ud[2 * b - 1], f = 0; f < 2 * b; f += 2) e[f] = G[c + 4 * f >> 2], e[f + 1] = G[c + (4 * f + 4) >> 2];else e = G.subarray(c >> 2, c + 8 * b >> 2);
          X.uniform2iv(Z(a), e);
        }
      },
      Mc: function (a, b, c, e) {
        X.uniform3f(Z(a), b, c, e);
      },
      Lc: function (a, b, c) {
        if (2 <= u.version) b && X.uniform3fv(Z(a), N, c >> 2, 3 * b);else {
          if (96 >= b) for (var e = td[3 * b - 1], f = 0; f < 3 * b; f += 3) e[f] = N[c + 4 * f >> 2], e[f + 1] = N[c + (4 * f + 4) >> 2], e[f + 2] = N[c + (4 * f + 8) >> 2];else e = N.subarray(c >> 2, c + 12 * b >> 2);
          X.uniform3fv(Z(a), e);
        }
      },
      Kc: function (a, b, c, e) {
        X.uniform3i(Z(a), b, c, e);
      },
      Jc: function (a, b, c) {
        if (2 <= u.version) b && X.uniform3iv(Z(a), G, c >> 2, 3 * b);else {
          if (96 >= b) for (var e = ud[3 * b - 1], f = 0; f < 3 * b; f += 3) e[f] = G[c + 4 * f >> 2], e[f + 1] = G[c + (4 * f + 4) >> 2], e[f + 2] = G[c + (4 * f + 8) >> 2];else e = G.subarray(c >> 2, c + 12 * b >> 2);
          X.uniform3iv(Z(a), e);
        }
      },
      Ic: function (a, b, c, e, f) {
        X.uniform4f(Z(a), b, c, e, f);
      },
      Hc: function (a, b, c) {
        if (2 <= u.version) b && X.uniform4fv(Z(a), N, c >> 2, 4 * b);else {
          if (72 >= b) {
            var e = td[4 * b - 1],
              f = N;
            c >>= 2;
            for (var k = 0; k < 4 * b; k += 4) {
              var m = c + k;
              e[k] = f[m];
              e[k + 1] = f[m + 1];
              e[k + 2] = f[m + 2];
              e[k + 3] = f[m + 3];
            }
          } else e = N.subarray(c >> 2, c + 16 * b >> 2);
          X.uniform4fv(Z(a), e);
        }
      },
      vc: function (a, b, c, e, f) {
        X.uniform4i(Z(a), b, c, e, f);
      },
      wc: function (a, b, c) {
        if (2 <= u.version) b && X.uniform4iv(Z(a), G, c >> 2, 4 * b);else {
          if (72 >= b) for (var e = ud[4 * b - 1], f = 0; f < 4 * b; f += 4) e[f] = G[c + 4 * f >> 2], e[f + 1] = G[c + (4 * f + 4) >> 2], e[f + 2] = G[c + (4 * f + 8) >> 2], e[f + 3] = G[c + (4 * f + 12) >> 2];else e = G.subarray(c >> 2, c + 16 * b >> 2);
          X.uniform4iv(Z(a), e);
        }
      },
      xc: function (a, b, c, e) {
        if (2 <= u.version) b && X.uniformMatrix2fv(Z(a), !!c, N, e >> 2, 4 * b);else {
          if (72 >= b) for (var f = td[4 * b - 1], k = 0; k < 4 * b; k += 4) f[k] = N[e + 4 * k >> 2], f[k + 1] = N[e + (4 * k + 4) >> 2], f[k + 2] = N[e + (4 * k + 8) >> 2], f[k + 3] = N[e + (4 * k + 12) >> 2];else f = N.subarray(e >> 2, e + 16 * b >> 2);
          X.uniformMatrix2fv(Z(a), !!c, f);
        }
      },
      yc: function (a, b, c, e) {
        if (2 <= u.version) b && X.uniformMatrix3fv(Z(a), !!c, N, e >> 2, 9 * b);else {
          if (32 >= b) for (var f = td[9 * b - 1], k = 0; k < 9 * b; k += 9) f[k] = N[e + 4 * k >> 2], f[k + 1] = N[e + (4 * k + 4) >> 2], f[k + 2] = N[e + (4 * k + 8) >> 2], f[k + 3] = N[e + (4 * k + 12) >> 2], f[k + 4] = N[e + (4 * k + 16) >> 2], f[k + 5] = N[e + (4 * k + 20) >> 2], f[k + 6] = N[e + (4 * k + 24) >> 2], f[k + 7] = N[e + (4 * k + 28) >> 2], f[k + 8] = N[e + (4 * k + 32) >> 2];else f = N.subarray(e >> 2, e + 36 * b >> 2);
          X.uniformMatrix3fv(Z(a), !!c, f);
        }
      },
      zc: function (a, b, c, e) {
        if (2 <= u.version) b && X.uniformMatrix4fv(Z(a), !!c, N, e >> 2, 16 * b);else {
          if (18 >= b) {
            var f = td[16 * b - 1],
              k = N;
            e >>= 2;
            for (var m = 0; m < 16 * b; m += 16) {
              var l = e + m;
              f[m] = k[l];
              f[m + 1] = k[l + 1];
              f[m + 2] = k[l + 2];
              f[m + 3] = k[l + 3];
              f[m + 4] = k[l + 4];
              f[m + 5] = k[l + 5];
              f[m + 6] = k[l + 6];
              f[m + 7] = k[l + 7];
              f[m + 8] = k[l + 8];
              f[m + 9] = k[l + 9];
              f[m + 10] = k[l + 10];
              f[m + 11] = k[l + 11];
              f[m + 12] = k[l + 12];
              f[m + 13] = k[l + 13];
              f[m + 14] = k[l + 14];
              f[m + 15] = k[l + 15];
            }
          } else f = N.subarray(e >> 2, e + 64 * b >> 2);
          X.uniformMatrix4fv(Z(a), !!c, f);
        }
      },
      Ac: function (a) {
        a = Xc[a];
        X.useProgram(a);
        X.Se = a;
      },
      Bc: function (a, b) {
        X.vertexAttrib1f(a, b);
      },
      Cc: function (a, b) {
        X.vertexAttrib2f(a, N[b >> 2], N[b + 4 >> 2]);
      },
      Dc: function (a, b) {
        X.vertexAttrib3f(a, N[b >> 2], N[b + 4 >> 2], N[b + 8 >> 2]);
      },
      Ec: function (a, b) {
        X.vertexAttrib4f(a, N[b >> 2], N[b + 4 >> 2], N[b + 8 >> 2], N[b + 12 >> 2]);
      },
      fc: function (a, b) {
        X.vertexAttribDivisor(a, b);
      },
      gc: function (a, b, c, e, f) {
        X.vertexAttribIPointer(a, b, c, e, f);
      },
      Fc: function (a, b, c, e, f, k) {
        X.vertexAttribPointer(a, b, c, !!e, f, k);
      },
      Gc: function (a, b, c, e) {
        X.viewport(a, b, c, e);
      },
      cb: function (a, b, c, e) {
        X.waitSync(cd[a], b, (c >>> 0) + 4294967296 * e);
      },
      kb: function (a) {
        var b = C.length;
        a >>>= 0;
        if (2147483648 < a) return !1;
        for (var c = 1; 4 >= c; c *= 2) {
          var e = b * (1 + .2 / c);
          e = Math.min(e, a + 100663296);
          var f = Math,
            k = f.min;
          e = Math.max(a, e);
          e += (65536 - e % 65536) % 65536;
          a: {
            var m = Ga.buffer;
            try {
              Ga.grow(k.call(f, 2147483648, e) - m.byteLength + 65535 >>> 16);
              Qa();
              var l = 1;
              break a;
            } catch (q) {}
            l = void 0;
          }
          if (l) return !0;
        }
        return !1;
      },
      eb: function () {
        return u ? u.bf : 0;
      },
      nb: function (a, b) {
        var c = 0;
        wd().forEach(function (e, f) {
          var k = b + c;
          f = J[a + 4 * f >> 2] = k;
          for (k = 0; k < e.length; ++k) Ma[f++ >> 0] = e.charCodeAt(k);
          Ma[f >> 0] = 0;
          c += e.length + 1;
        });
        return 0;
      },
      ob: function (a, b) {
        var c = wd();
        J[a >> 2] = c.length;
        var e = 0;
        c.forEach(function (f) {
          e += f.length + 1;
        });
        J[b >> 2] = e;
        return 0;
      },
      Ab: function (a) {
        if (!noExitRuntime) {
          if (r.onExit) r.onExit(a);
          Ha = !0;
        }
        oa(a, new Ba(a));
      },
      U: function () {
        return 52;
      },
      fb: function () {
        return 52;
      },
      sb: function () {
        return 52;
      },
      gb: function () {
        return 70;
      },
      R: function (a, b, c, e) {
        for (var f = 0, k = 0; k < c; k++) {
          var m = J[b >> 2],
            l = J[b + 4 >> 2];
          b += 8;
          for (var q = 0; q < l; q++) {
            var x = C[m + q],
              y = yd[a];
            0 === x || 10 === x ? ((1 === a ? Da : Ca)(Ja(y, 0)), y.length = 0) : y.push(x);
          }
          f += l;
        }
        J[e >> 2] = f;
        return 0;
      },
      n: Jd,
      m: Kd,
      k: Ld,
      N: Md,
      Y: Nd,
      X: Od,
      w: Pd,
      y: Qd,
      p: Rd,
      v: Sd,
      Bb: Td,
      Cb: Ud,
      Db: Vd,
      ib: function (a, b, c, e) {
        return Dd(a, b, c, e);
      }
    };
    (function () {
      function a(c) {
        c = c.exports;
        r.asm = c;
        Ga = r.asm.$c;
        Qa();
        Sa = r.asm.bd;
        Ua.unshift(r.asm.ad);
        Xa--;
        r.monitorRunDependencies && r.monitorRunDependencies(Xa);
        if (0 == Xa && (null !== Ya && (clearInterval(Ya), Ya = null), Za)) {
          var e = Za;
          Za = null;
          e();
        }
        return c;
      }
      var b = {
        a: Wd
      };
      Xa++;
      r.monitorRunDependencies && r.monitorRunDependencies(Xa);
      if (r.instantiateWasm) try {
        return r.instantiateWasm(b, a);
      } catch (c) {
        Ca("Module.instantiateWasm callback failed with error: " + c), ba(c);
      }
      fb(b, function (c) {
        a(c.instance);
      }).catch(ba);
      return {};
    })();
    var pc = r._free = function () {
        return (pc = r._free = r.asm.cd).apply(null, arguments);
      },
      pd = r._malloc = function () {
        return (pd = r._malloc = r.asm.dd).apply(null, arguments);
      },
      oc = r.___getTypeName = function () {
        return (oc = r.___getTypeName = r.asm.ed).apply(null, arguments);
      };
    r.__embind_initialize_bindings = function () {
      return (r.__embind_initialize_bindings = r.asm.fd).apply(null, arguments);
    };
    function Xd() {
      return (Xd = r.asm.gd).apply(null, arguments);
    }
    function Yd() {
      return (Yd = r.asm.hd).apply(null, arguments);
    }
    function Zd() {
      return (Zd = r.asm.id).apply(null, arguments);
    }
    r.dynCall_viji = function () {
      return (r.dynCall_viji = r.asm.kd).apply(null, arguments);
    };
    r.dynCall_vijiii = function () {
      return (r.dynCall_vijiii = r.asm.ld).apply(null, arguments);
    };
    r.dynCall_viiiiij = function () {
      return (r.dynCall_viiiiij = r.asm.md).apply(null, arguments);
    };
    r.dynCall_jii = function () {
      return (r.dynCall_jii = r.asm.nd).apply(null, arguments);
    };
    r.dynCall_vij = function () {
      return (r.dynCall_vij = r.asm.od).apply(null, arguments);
    };
    r.dynCall_iiij = function () {
      return (r.dynCall_iiij = r.asm.pd).apply(null, arguments);
    };
    r.dynCall_iiiij = function () {
      return (r.dynCall_iiiij = r.asm.qd).apply(null, arguments);
    };
    r.dynCall_viij = function () {
      return (r.dynCall_viij = r.asm.rd).apply(null, arguments);
    };
    r.dynCall_viiij = function () {
      return (r.dynCall_viiij = r.asm.sd).apply(null, arguments);
    };
    r.dynCall_ji = function () {
      return (r.dynCall_ji = r.asm.td).apply(null, arguments);
    };
    r.dynCall_iij = function () {
      return (r.dynCall_iij = r.asm.ud).apply(null, arguments);
    };
    r.dynCall_jiiii = function () {
      return (r.dynCall_jiiii = r.asm.vd).apply(null, arguments);
    };
    r.dynCall_jiiiiii = function () {
      return (r.dynCall_jiiiiii = r.asm.wd).apply(null, arguments);
    };
    r.dynCall_jiiiiji = function () {
      return (r.dynCall_jiiiiji = r.asm.xd).apply(null, arguments);
    };
    r.dynCall_iijj = function () {
      return (r.dynCall_iijj = r.asm.yd).apply(null, arguments);
    };
    r.dynCall_jiji = function () {
      return (r.dynCall_jiji = r.asm.zd).apply(null, arguments);
    };
    r.dynCall_viijii = function () {
      return (r.dynCall_viijii = r.asm.Ad).apply(null, arguments);
    };
    r.dynCall_iiiiij = function () {
      return (r.dynCall_iiiiij = r.asm.Bd).apply(null, arguments);
    };
    r.dynCall_iiiiijj = function () {
      return (r.dynCall_iiiiijj = r.asm.Cd).apply(null, arguments);
    };
    r.dynCall_iiiiiijj = function () {
      return (r.dynCall_iiiiiijj = r.asm.Dd).apply(null, arguments);
    };
    function Sd(a, b, c, e, f) {
      var k = Yd();
      try {
        Q(a)(b, c, e, f);
      } catch (m) {
        Zd(k);
        if (m !== m + 0) throw m;
        Xd(1, 0);
      }
    }
    function Kd(a, b, c) {
      var e = Yd();
      try {
        return Q(a)(b, c);
      } catch (f) {
        Zd(e);
        if (f !== f + 0) throw f;
        Xd(1, 0);
      }
    }
    function Qd(a, b, c) {
      var e = Yd();
      try {
        Q(a)(b, c);
      } catch (f) {
        Zd(e);
        if (f !== f + 0) throw f;
        Xd(1, 0);
      }
    }
    function Jd(a, b) {
      var c = Yd();
      try {
        return Q(a)(b);
      } catch (e) {
        Zd(c);
        if (e !== e + 0) throw e;
        Xd(1, 0);
      }
    }
    function Pd(a, b) {
      var c = Yd();
      try {
        Q(a)(b);
      } catch (e) {
        Zd(c);
        if (e !== e + 0) throw e;
        Xd(1, 0);
      }
    }
    function Ld(a, b, c, e) {
      var f = Yd();
      try {
        return Q(a)(b, c, e);
      } catch (k) {
        Zd(f);
        if (k !== k + 0) throw k;
        Xd(1, 0);
      }
    }
    function Vd(a, b, c, e, f, k, m, l, q, x) {
      var y = Yd();
      try {
        Q(a)(b, c, e, f, k, m, l, q, x);
      } catch (B) {
        Zd(y);
        if (B !== B + 0) throw B;
        Xd(1, 0);
      }
    }
    function Rd(a, b, c, e) {
      var f = Yd();
      try {
        Q(a)(b, c, e);
      } catch (k) {
        Zd(f);
        if (k !== k + 0) throw k;
        Xd(1, 0);
      }
    }
    function Ud(a, b, c, e, f, k, m) {
      var l = Yd();
      try {
        Q(a)(b, c, e, f, k, m);
      } catch (q) {
        Zd(l);
        if (q !== q + 0) throw q;
        Xd(1, 0);
      }
    }
    function Md(a, b, c, e, f) {
      var k = Yd();
      try {
        return Q(a)(b, c, e, f);
      } catch (m) {
        Zd(k);
        if (m !== m + 0) throw m;
        Xd(1, 0);
      }
    }
    function Nd(a, b, c, e, f, k, m) {
      var l = Yd();
      try {
        return Q(a)(b, c, e, f, k, m);
      } catch (q) {
        Zd(l);
        if (q !== q + 0) throw q;
        Xd(1, 0);
      }
    }
    function Td(a, b, c, e, f, k) {
      var m = Yd();
      try {
        Q(a)(b, c, e, f, k);
      } catch (l) {
        Zd(m);
        if (l !== l + 0) throw l;
        Xd(1, 0);
      }
    }
    function Od(a, b, c, e, f, k, m, l, q, x) {
      var y = Yd();
      try {
        return Q(a)(b, c, e, f, k, m, l, q, x);
      } catch (B) {
        Zd(y);
        if (B !== B + 0) throw B;
        Xd(1, 0);
      }
    }
    var $d;
    Za = function ae() {
      $d || be();
      $d || (Za = ae);
    };
    function be() {
      function a() {
        if (!$d && ($d = !0, r.calledRun = !0, !Ha)) {
          hb(Ua);
          aa(r);
          if (r.onRuntimeInitialized) r.onRuntimeInitialized();
          if (r.postRun) for ("function" == typeof r.postRun && (r.postRun = [r.postRun]); r.postRun.length;) {
            var b = r.postRun.shift();
            Va.unshift(b);
          }
          hb(Va);
        }
      }
      if (!(0 < Xa)) {
        if (r.preRun) for ("function" == typeof r.preRun && (r.preRun = [r.preRun]); r.preRun.length;) Wa();
        hb(Ta);
        0 < Xa || (r.setStatus ? (r.setStatus("Running..."), setTimeout(function () {
          setTimeout(function () {
            r.setStatus("");
          }, 1);
          a();
        }, 1)) : a());
      }
    }
    if (r.preInit) for ("function" == typeof r.preInit && (r.preInit = [r.preInit]); 0 < r.preInit.length;) r.preInit.pop()();
    be();
    return CanvasKitInit.ready;
  };
})();
if (typeof exports === 'object' && typeof module === 'object') module.exports = CanvasKitInit;else if (typeof define === 'function' && define['amd']) define([], function () {
  return CanvasKitInit;
});else if (typeof exports === 'object') exports["CanvasKitInit"] = CanvasKitInit;