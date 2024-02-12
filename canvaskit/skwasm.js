var skwasm = (() => {
  var _scriptDir = typeof document !== 'undefined' && document.currentScript ? document.currentScript.src : undefined;
  if (typeof __filename !== 'undefined') _scriptDir = _scriptDir || __filename;
  return function (skwasm = {}) {
    function GROWABLE_HEAP_I8() {
      if (wasmMemory.buffer != HEAP8.buffer) {
        updateMemoryViews();
      }
      return HEAP8;
    }
    function GROWABLE_HEAP_U8() {
      if (wasmMemory.buffer != HEAP8.buffer) {
        updateMemoryViews();
      }
      return HEAPU8;
    }
    function GROWABLE_HEAP_I16() {
      if (wasmMemory.buffer != HEAP8.buffer) {
        updateMemoryViews();
      }
      return HEAP16;
    }
    function GROWABLE_HEAP_U16() {
      if (wasmMemory.buffer != HEAP8.buffer) {
        updateMemoryViews();
      }
      return HEAPU16;
    }
    function GROWABLE_HEAP_I32() {
      if (wasmMemory.buffer != HEAP8.buffer) {
        updateMemoryViews();
      }
      return HEAP32;
    }
    function GROWABLE_HEAP_U32() {
      if (wasmMemory.buffer != HEAP8.buffer) {
        updateMemoryViews();
      }
      return HEAPU32;
    }
    function GROWABLE_HEAP_F32() {
      if (wasmMemory.buffer != HEAP8.buffer) {
        updateMemoryViews();
      }
      return HEAPF32;
    }
    function GROWABLE_HEAP_F64() {
      if (wasmMemory.buffer != HEAP8.buffer) {
        updateMemoryViews();
      }
      return HEAPF64;
    }
    var Module = typeof skwasm != "undefined" ? skwasm : {};
    var readyPromiseResolve, readyPromiseReject;
    Module["ready"] = new Promise(function (resolve, reject) {
      readyPromiseResolve = resolve;
      readyPromiseReject = reject;
    });
    var moduleOverrides = Object.assign({}, Module);
    var arguments_ = [];
    var thisProgram = "./this.program";
    var quit_ = (status, toThrow) => {
      throw toThrow;
    };
    var ENVIRONMENT_IS_WEB = typeof window == "object";
    var ENVIRONMENT_IS_WORKER = typeof importScripts == "function";
    var ENVIRONMENT_IS_NODE = typeof process == "object" && typeof process.versions == "object" && typeof process.versions.node == "string";
    var ENVIRONMENT_IS_PTHREAD = Module["ENVIRONMENT_IS_PTHREAD"] || false;
    var scriptDirectory = "";
    function locateFile(path) {
      if (Module["locateFile"]) {
        return Module["locateFile"](path, scriptDirectory);
      }
      return scriptDirectory + path;
    }
    var read_, readAsync, readBinary, setWindowTitle;
    function logExceptionOnExit(e) {
      if (e instanceof ExitStatus) return;
      let toLog = e;
      if (e && typeof e == "object" && e.stack) {
        toLog = [e, e.stack];
      }
      err("exiting due to exception: " + toLog);
    }
    if (ENVIRONMENT_IS_NODE) {
      var fs = require("fs");
      var nodePath = require("path");
      if (ENVIRONMENT_IS_WORKER) {
        scriptDirectory = nodePath.dirname(scriptDirectory) + "/";
      } else {
        scriptDirectory = __dirname + "/";
      }
      read_ = (filename, binary) => {
        filename = isFileURI(filename) ? new URL(filename) : nodePath.normalize(filename);
        return fs.readFileSync(filename, binary ? undefined : "utf8");
      };
      readBinary = filename => {
        var ret = read_(filename, true);
        if (!ret.buffer) {
          ret = new Uint8Array(ret);
        }
        return ret;
      };
      readAsync = (filename, onload, onerror) => {
        filename = isFileURI(filename) ? new URL(filename) : nodePath.normalize(filename);
        fs.readFile(filename, function (err, data) {
          if (err) onerror(err);else onload(data.buffer);
        });
      };
      if (process.argv.length > 1) {
        thisProgram = process.argv[1].replace(/\\/g, "/");
      }
      arguments_ = process.argv.slice(2);
      process.on("uncaughtException", function (ex) {
        if (!(ex instanceof ExitStatus)) {
          throw ex;
        }
      });
      var nodeMajor = process.versions.node.split(".")[0];
      if (nodeMajor < 15) {
        process.on("unhandledRejection", function (reason) {
          throw reason;
        });
      }
      quit_ = (status, toThrow) => {
        if (keepRuntimeAlive()) {
          process.exitCode = status;
          throw toThrow;
        }
        logExceptionOnExit(toThrow);
        process.exit(status);
      };
      Module["inspect"] = function () {
        return "[Emscripten Module object]";
      };
      let nodeWorkerThreads;
      try {
        nodeWorkerThreads = require("worker_threads");
      } catch (e) {
        console.error('The "worker_threads" module is not supported in this node.js build - perhaps a newer version is needed?');
        throw e;
      }
      global.Worker = nodeWorkerThreads.Worker;
    } else if (ENVIRONMENT_IS_WEB || ENVIRONMENT_IS_WORKER) {
      if (ENVIRONMENT_IS_WORKER) {
        scriptDirectory = self.location.href;
      } else if (typeof document != "undefined" && document.currentScript) {
        scriptDirectory = document.currentScript.src;
      }
      if (_scriptDir) {
        scriptDirectory = _scriptDir;
      }
      if (scriptDirectory.indexOf("blob:") !== 0) {
        scriptDirectory = scriptDirectory.substr(0, scriptDirectory.replace(/[?#].*/, "").lastIndexOf("/") + 1);
      } else {
        scriptDirectory = "";
      }
      if (!ENVIRONMENT_IS_NODE) {
        read_ = url => {
          var xhr = new XMLHttpRequest();
          xhr.open("GET", url, false);
          xhr.send(null);
          return xhr.responseText;
        };
        if (ENVIRONMENT_IS_WORKER) {
          readBinary = url => {
            var xhr = new XMLHttpRequest();
            xhr.open("GET", url, false);
            xhr.responseType = "arraybuffer";
            xhr.send(null);
            return new Uint8Array(xhr.response);
          };
        }
        readAsync = (url, onload, onerror) => {
          var xhr = new XMLHttpRequest();
          xhr.open("GET", url, true);
          xhr.responseType = "arraybuffer";
          xhr.onload = () => {
            if (xhr.status == 200 || xhr.status == 0 && xhr.response) {
              onload(xhr.response);
              return;
            }
            onerror();
          };
          xhr.onerror = onerror;
          xhr.send(null);
        };
      }
      setWindowTitle = title => document.title = title;
    } else {}
    if (ENVIRONMENT_IS_NODE) {
      if (typeof performance == "undefined") {
        global.performance = require("perf_hooks").performance;
      }
    }
    var defaultPrint = console.log.bind(console);
    var defaultPrintErr = console.warn.bind(console);
    if (ENVIRONMENT_IS_NODE) {
      defaultPrint = str => fs.writeSync(1, str + "\n");
      defaultPrintErr = str => fs.writeSync(2, str + "\n");
    }
    var out = Module["print"] || defaultPrint;
    var err = Module["printErr"] || defaultPrintErr;
    Object.assign(Module, moduleOverrides);
    moduleOverrides = null;
    if (Module["arguments"]) arguments_ = Module["arguments"];
    if (Module["thisProgram"]) thisProgram = Module["thisProgram"];
    if (Module["quit"]) quit_ = Module["quit"];
    var wasmBinary;
    if (Module["wasmBinary"]) wasmBinary = Module["wasmBinary"];
    var noExitRuntime = Module["noExitRuntime"] || true;
    if (typeof WebAssembly != "object") {
      abort("no native wasm support detected");
    }
    var wasmMemory;
    var wasmModule;
    var ABORT = false;
    var EXITSTATUS;
    function assert(condition, text) {
      if (!condition) {
        abort(text);
      }
    }
    var UTF8Decoder = typeof TextDecoder != "undefined" ? new TextDecoder("utf8") : undefined;
    function UTF8ArrayToString(heapOrArray, idx, maxBytesToRead) {
      var endIdx = idx + maxBytesToRead;
      var endPtr = idx;
      while (heapOrArray[endPtr] && !(endPtr >= endIdx)) ++endPtr;
      if (endPtr - idx > 16 && heapOrArray.buffer && UTF8Decoder) {
        return UTF8Decoder.decode(heapOrArray.slice(idx, endPtr));
      }
      var str = "";
      while (idx < endPtr) {
        var u0 = heapOrArray[idx++];
        if (!(u0 & 128)) {
          str += String.fromCharCode(u0);
          continue;
        }
        var u1 = heapOrArray[idx++] & 63;
        if ((u0 & 224) == 192) {
          str += String.fromCharCode((u0 & 31) << 6 | u1);
          continue;
        }
        var u2 = heapOrArray[idx++] & 63;
        if ((u0 & 240) == 224) {
          u0 = (u0 & 15) << 12 | u1 << 6 | u2;
        } else {
          u0 = (u0 & 7) << 18 | u1 << 12 | u2 << 6 | heapOrArray[idx++] & 63;
        }
        if (u0 < 65536) {
          str += String.fromCharCode(u0);
        } else {
          var ch = u0 - 65536;
          str += String.fromCharCode(55296 | ch >> 10, 56320 | ch & 1023);
        }
      }
      return str;
    }
    function UTF8ToString(ptr, maxBytesToRead) {
      return ptr ? UTF8ArrayToString(GROWABLE_HEAP_U8(), ptr, maxBytesToRead) : "";
    }
    function stringToUTF8Array(str, heap, outIdx, maxBytesToWrite) {
      if (!(maxBytesToWrite > 0)) return 0;
      var startIdx = outIdx;
      var endIdx = outIdx + maxBytesToWrite - 1;
      for (var i = 0; i < str.length; ++i) {
        var u = str.charCodeAt(i);
        if (u >= 55296 && u <= 57343) {
          var u1 = str.charCodeAt(++i);
          u = 65536 + ((u & 1023) << 10) | u1 & 1023;
        }
        if (u <= 127) {
          if (outIdx >= endIdx) break;
          heap[outIdx++] = u;
        } else if (u <= 2047) {
          if (outIdx + 1 >= endIdx) break;
          heap[outIdx++] = 192 | u >> 6;
          heap[outIdx++] = 128 | u & 63;
        } else if (u <= 65535) {
          if (outIdx + 2 >= endIdx) break;
          heap[outIdx++] = 224 | u >> 12;
          heap[outIdx++] = 128 | u >> 6 & 63;
          heap[outIdx++] = 128 | u & 63;
        } else {
          if (outIdx + 3 >= endIdx) break;
          heap[outIdx++] = 240 | u >> 18;
          heap[outIdx++] = 128 | u >> 12 & 63;
          heap[outIdx++] = 128 | u >> 6 & 63;
          heap[outIdx++] = 128 | u & 63;
        }
      }
      heap[outIdx] = 0;
      return outIdx - startIdx;
    }
    function stringToUTF8(str, outPtr, maxBytesToWrite) {
      return stringToUTF8Array(str, GROWABLE_HEAP_U8(), outPtr, maxBytesToWrite);
    }
    function lengthBytesUTF8(str) {
      var len = 0;
      for (var i = 0; i < str.length; ++i) {
        var c = str.charCodeAt(i);
        if (c <= 127) {
          len++;
        } else if (c <= 2047) {
          len += 2;
        } else if (c >= 55296 && c <= 57343) {
          len += 4;
          ++i;
        } else {
          len += 3;
        }
      }
      return len;
    }
    var HEAP8, HEAPU8, HEAP16, HEAPU16, HEAP32, HEAPU32, HEAPF32, HEAPF64;
    function updateMemoryViews() {
      var b = wasmMemory.buffer;
      Module["HEAP8"] = HEAP8 = new Int8Array(b);
      Module["HEAP16"] = HEAP16 = new Int16Array(b);
      Module["HEAP32"] = HEAP32 = new Int32Array(b);
      Module["HEAPU8"] = HEAPU8 = new Uint8Array(b);
      Module["HEAPU16"] = HEAPU16 = new Uint16Array(b);
      Module["HEAPU32"] = HEAPU32 = new Uint32Array(b);
      Module["HEAPF32"] = HEAPF32 = new Float32Array(b);
      Module["HEAPF64"] = HEAPF64 = new Float64Array(b);
    }
    var INITIAL_MEMORY = Module["INITIAL_MEMORY"] || 16777216;
    assert(INITIAL_MEMORY >= 65536, "INITIAL_MEMORY should be larger than STACK_SIZE, was " + INITIAL_MEMORY + "! (STACK_SIZE=" + 65536 + ")");
    if (ENVIRONMENT_IS_PTHREAD) {
      wasmMemory = Module["wasmMemory"];
    } else {
      if (Module["wasmMemory"]) {
        wasmMemory = Module["wasmMemory"];
      } else {
        wasmMemory = new WebAssembly.Memory({
          "initial": INITIAL_MEMORY / 65536,
          "maximum": 2147483648 / 65536,
          "shared": true
        });
        if (!(wasmMemory.buffer instanceof SharedArrayBuffer)) {
          err("requested a shared WebAssembly.Memory but the returned buffer is not a SharedArrayBuffer, indicating that while the browser has SharedArrayBuffer it does not have WebAssembly threads support - you may need to set a flag");
          if (ENVIRONMENT_IS_NODE) {
            err("(on node you may need: --experimental-wasm-threads --experimental-wasm-bulk-memory and/or recent version)");
          }
          throw Error("bad memory");
        }
      }
    }
    updateMemoryViews();
    INITIAL_MEMORY = wasmMemory.buffer.byteLength;
    var wasmTable;
    var __ATPRERUN__ = [];
    var __ATINIT__ = [];
    var __ATEXIT__ = [];
    var __ATPOSTRUN__ = [];
    var runtimeInitialized = false;
    function keepRuntimeAlive() {
      return noExitRuntime;
    }
    function preRun() {
      if (Module["preRun"]) {
        if (typeof Module["preRun"] == "function") Module["preRun"] = [Module["preRun"]];
        while (Module["preRun"].length) {
          addOnPreRun(Module["preRun"].shift());
        }
      }
      callRuntimeCallbacks(__ATPRERUN__);
    }
    function initRuntime() {
      runtimeInitialized = true;
      if (ENVIRONMENT_IS_PTHREAD) return;
      callRuntimeCallbacks(__ATINIT__);
    }
    function postRun() {
      if (ENVIRONMENT_IS_PTHREAD) return;
      if (Module["postRun"]) {
        if (typeof Module["postRun"] == "function") Module["postRun"] = [Module["postRun"]];
        while (Module["postRun"].length) {
          addOnPostRun(Module["postRun"].shift());
        }
      }
      callRuntimeCallbacks(__ATPOSTRUN__);
    }
    function addOnPreRun(cb) {
      __ATPRERUN__.unshift(cb);
    }
    function addOnInit(cb) {
      __ATINIT__.unshift(cb);
    }
    function addOnPostRun(cb) {
      __ATPOSTRUN__.unshift(cb);
    }
    var runDependencies = 0;
    var runDependencyWatcher = null;
    var dependenciesFulfilled = null;
    function addRunDependency(id) {
      runDependencies++;
      if (Module["monitorRunDependencies"]) {
        Module["monitorRunDependencies"](runDependencies);
      }
    }
    function removeRunDependency(id) {
      runDependencies--;
      if (Module["monitorRunDependencies"]) {
        Module["monitorRunDependencies"](runDependencies);
      }
      if (runDependencies == 0) {
        if (runDependencyWatcher !== null) {
          clearInterval(runDependencyWatcher);
          runDependencyWatcher = null;
        }
        if (dependenciesFulfilled) {
          var callback = dependenciesFulfilled;
          dependenciesFulfilled = null;
          callback();
        }
      }
    }
    function abort(what) {
      if (Module["onAbort"]) {
        Module["onAbort"](what);
      }
      what = "Aborted(" + what + ")";
      err(what);
      ABORT = true;
      EXITSTATUS = 1;
      what += ". Build with -sASSERTIONS for more info.";
      var e = new WebAssembly.RuntimeError(what);
      readyPromiseReject(e);
      throw e;
    }
    var dataURIPrefix = "data:application/octet-stream;base64,";
    function isDataURI(filename) {
      return filename.startsWith(dataURIPrefix);
    }
    function isFileURI(filename) {
      return filename.startsWith("file://");
    }
    var wasmBinaryFile;
    wasmBinaryFile = "skwasm.wasm";
    if (!isDataURI(wasmBinaryFile)) {
      wasmBinaryFile = locateFile(wasmBinaryFile);
    }
    function getBinary(file) {
      try {
        if (file == wasmBinaryFile && wasmBinary) {
          return new Uint8Array(wasmBinary);
        }
        if (readBinary) {
          return readBinary(file);
        }
        throw "both async and sync fetching of the wasm failed";
      } catch (err) {
        abort(err);
      }
    }
    function getBinaryPromise(binaryFile) {
      if (!wasmBinary && (ENVIRONMENT_IS_WEB || ENVIRONMENT_IS_WORKER)) {
        if (typeof fetch == "function" && !isFileURI(binaryFile)) {
          return fetch(binaryFile, {
            credentials: "same-origin"
          }).then(function (response) {
            if (!response["ok"]) {
              throw "failed to load wasm binary file at '" + binaryFile + "'";
            }
            return response["arrayBuffer"]();
          }).catch(function () {
            return getBinary(binaryFile);
          });
        } else {
          if (readAsync) {
            return new Promise(function (resolve, reject) {
              readAsync(binaryFile, function (response) {
                resolve(new Uint8Array(response));
              }, reject);
            });
          }
        }
      }
      return Promise.resolve().then(function () {
        return getBinary(binaryFile);
      });
    }
    function instantiateArrayBuffer(binaryFile, imports, receiver) {
      return getBinaryPromise(binaryFile).then(function (binary) {
        return WebAssembly.instantiate(binary, imports);
      }).then(function (instance) {
        return instance;
      }).then(receiver, function (reason) {
        err("failed to asynchronously prepare wasm: " + reason);
        abort(reason);
      });
    }
    function instantiateAsync(binary, binaryFile, imports, callback) {
      if (!binary && typeof WebAssembly.instantiateStreaming == "function" && !isDataURI(binaryFile) && !isFileURI(binaryFile) && !ENVIRONMENT_IS_NODE && typeof fetch == "function") {
        return fetch(binaryFile, {
          credentials: "same-origin"
        }).then(function (response) {
          var result = WebAssembly.instantiateStreaming(response, imports);
          return result.then(callback, function (reason) {
            err("wasm streaming compile failed: " + reason);
            err("falling back to ArrayBuffer instantiation");
            return instantiateArrayBuffer(binaryFile, imports, callback);
          });
        });
      } else {
        return instantiateArrayBuffer(binaryFile, imports, callback);
      }
    }
    function createWasm() {
      var info = {
        "env": wasmImports,
        "wasi_snapshot_preview1": wasmImports
      };
      function receiveInstance(instance, module) {
        var exports = instance.exports;
        Module["asm"] = exports;
        registerTLSInit(Module["asm"]["_emscripten_tls_init"]);
        wasmTable = Module["asm"]["__indirect_function_table"];
        addOnInit(Module["asm"]["__wasm_call_ctors"]);
        wasmModule = module;
        PThread.loadWasmModuleToAllWorkers(() => removeRunDependency("wasm-instantiate"));
        return exports;
      }
      addRunDependency("wasm-instantiate");
      function receiveInstantiationResult(result) {
        receiveInstance(result["instance"], result["module"]);
      }
      if (Module["instantiateWasm"]) {
        try {
          return Module["instantiateWasm"](info, receiveInstance);
        } catch (e) {
          err("Module.instantiateWasm callback failed with error: " + e);
          readyPromiseReject(e);
        }
      }
      instantiateAsync(wasmBinary, wasmBinaryFile, info, receiveInstantiationResult).catch(readyPromiseReject);
      return {};
    }
    function ExitStatus(status) {
      this.name = "ExitStatus";
      this.message = "Program terminated with exit(" + status + ")";
      this.status = status;
    }
    function terminateWorker(worker) {
      worker.terminate();
      worker.onmessage = e => {};
    }
    function killThread(pthread_ptr) {
      var worker = PThread.pthreads[pthread_ptr];
      delete PThread.pthreads[pthread_ptr];
      terminateWorker(worker);
      __emscripten_thread_free_data(pthread_ptr);
      PThread.runningWorkers.splice(PThread.runningWorkers.indexOf(worker), 1);
      worker.pthread_ptr = 0;
    }
    function cancelThread(pthread_ptr) {
      var worker = PThread.pthreads[pthread_ptr];
      worker.postMessage({
        "cmd": "cancel"
      });
    }
    function cleanupThread(pthread_ptr) {
      var worker = PThread.pthreads[pthread_ptr];
      assert(worker);
      PThread.returnWorkerToPool(worker);
    }
    function spawnThread(threadParams) {
      var worker = PThread.getNewWorker();
      if (!worker) {
        return 6;
      }
      PThread.runningWorkers.push(worker);
      PThread.pthreads[threadParams.pthread_ptr] = worker;
      worker.pthread_ptr = threadParams.pthread_ptr;
      var msg = {
        "cmd": "run",
        "start_routine": threadParams.startRoutine,
        "arg": threadParams.arg,
        "pthread_ptr": threadParams.pthread_ptr
      };
      msg.moduleCanvasId = threadParams.moduleCanvasId;
      msg.offscreenCanvases = threadParams.offscreenCanvases;
      if (ENVIRONMENT_IS_NODE) {
        worker.ref();
      }
      worker.postMessage(msg, threadParams.transferList);
      return 0;
    }
    var SYSCALLS = {
      varargs: undefined,
      get: function () {
        SYSCALLS.varargs += 4;
        var ret = GROWABLE_HEAP_I32()[SYSCALLS.varargs - 4 >> 2];
        return ret;
      },
      getStr: function (ptr) {
        var ret = UTF8ToString(ptr);
        return ret;
      }
    };
    function _proc_exit(code) {
      if (ENVIRONMENT_IS_PTHREAD) return _emscripten_proxy_to_main_thread_js(1, 1, code);
      EXITSTATUS = code;
      if (!keepRuntimeAlive()) {
        PThread.terminateAllThreads();
        if (Module["onExit"]) Module["onExit"](code);
        ABORT = true;
      }
      quit_(code, new ExitStatus(code));
    }
    function exitJS(status, implicit) {
      EXITSTATUS = status;
      if (ENVIRONMENT_IS_PTHREAD) {
        exitOnMainThread(status);
        throw "unwind";
      }
      _proc_exit(status);
    }
    var _exit = exitJS;
    function handleException(e) {
      if (e instanceof ExitStatus || e == "unwind") {
        return EXITSTATUS;
      }
      quit_(1, e);
    }
    var PThread = {
      unusedWorkers: [],
      runningWorkers: [],
      tlsInitFunctions: [],
      pthreads: {},
      init: function () {
        if (ENVIRONMENT_IS_PTHREAD) {
          PThread.initWorker();
        } else {
          PThread.initMainThread();
        }
      },
      initMainThread: function () {
        var pthreadPoolSize = 1;
        while (pthreadPoolSize--) {
          PThread.allocateUnusedWorker();
        }
      },
      initWorker: function () {
        noExitRuntime = false;
      },
      setExitStatus: function (status) {
        EXITSTATUS = status;
      },
      terminateAllThreads__deps: ["$terminateWorker"],
      terminateAllThreads: function () {
        for (var worker of PThread.runningWorkers) {
          terminateWorker(worker);
        }
        for (var worker of PThread.unusedWorkers) {
          terminateWorker(worker);
        }
        PThread.unusedWorkers = [];
        PThread.runningWorkers = [];
        PThread.pthreads = [];
      },
      returnWorkerToPool: function (worker) {
        var pthread_ptr = worker.pthread_ptr;
        delete PThread.pthreads[pthread_ptr];
        PThread.unusedWorkers.push(worker);
        PThread.runningWorkers.splice(PThread.runningWorkers.indexOf(worker), 1);
        worker.pthread_ptr = 0;
        if (ENVIRONMENT_IS_NODE) {
          worker.unref();
        }
        __emscripten_thread_free_data(pthread_ptr);
      },
      receiveObjectTransfer: function (data) {
        if (typeof GL != "undefined") {
          Object.assign(GL.offscreenCanvases, data.offscreenCanvases);
          if (!Module["canvas"] && data.moduleCanvasId && GL.offscreenCanvases[data.moduleCanvasId]) {
            Module["canvas"] = GL.offscreenCanvases[data.moduleCanvasId].offscreenCanvas;
            Module["canvas"].id = data.moduleCanvasId;
          }
        }
      },
      threadInitTLS: function () {
        PThread.tlsInitFunctions.forEach(f => f());
      },
      loadWasmModuleToWorker: worker => new Promise(onFinishedLoading => {
        worker.onmessage = e => {
          var d = e["data"];
          var cmd = d["cmd"];
          if (worker.pthread_ptr) PThread.currentProxiedOperationCallerThread = worker.pthread_ptr;
          if (d["targetThread"] && d["targetThread"] != _pthread_self()) {
            var targetWorker = PThread.pthreads[d.targetThread];
            if (targetWorker) {
              targetWorker.postMessage(d, d["transferList"]);
            } else {
              err('Internal error! Worker sent a message "' + cmd + '" to target pthread ' + d["targetThread"] + ", but that thread no longer exists!");
            }
            PThread.currentProxiedOperationCallerThread = undefined;
            return;
          }
          if (cmd === "processProxyingQueue") {
            executeNotifiedProxyingQueue(d["queue"]);
          } else if (cmd === "spawnThread") {
            spawnThread(d);
          } else if (cmd === "cleanupThread") {
            cleanupThread(d["thread"]);
          } else if (cmd === "killThread") {
            killThread(d["thread"]);
          } else if (cmd === "cancelThread") {
            cancelThread(d["thread"]);
          } else if (cmd === "loaded") {
            worker.loaded = true;
            if (ENVIRONMENT_IS_NODE && !worker.pthread_ptr) {
              worker.unref();
            }
            onFinishedLoading(worker);
          } else if (cmd === "print") {
            out("Thread " + d["threadId"] + ": " + d["text"]);
          } else if (cmd === "printErr") {
            err("Thread " + d["threadId"] + ": " + d["text"]);
          } else if (cmd === "alert") {
            alert("Thread " + d["threadId"] + ": " + d["text"]);
          } else if (d.target === "setimmediate") {
            worker.postMessage(d);
          } else if (cmd === "callHandler") {
            Module[d["handler"]](...d["args"]);
          } else if (cmd) {
            err("worker sent an unknown command " + cmd);
          }
          PThread.currentProxiedOperationCallerThread = undefined;
        };
        worker.onerror = e => {
          var message = "worker sent an error!";
          err(message + " " + e.filename + ":" + e.lineno + ": " + e.message);
          throw e;
        };
        if (ENVIRONMENT_IS_NODE) {
          worker.on("message", function (data) {
            worker.onmessage({
              data: data
            });
          });
          worker.on("error", function (e) {
            worker.onerror(e);
          });
          worker.on("detachedExit", function () {});
        }
        var handlers = [];
        var knownHandlers = ["onExit", "onAbort", "print", "printErr"];
        for (var handler of knownHandlers) {
          if (Module.hasOwnProperty(handler)) {
            handlers.push(handler);
          }
        }
        worker.postMessage({
          "cmd": "load",
          "handlers": handlers,
          "urlOrBlob": Module["mainScriptUrlOrBlob"] || _scriptDir,
          "wasmMemory": wasmMemory,
          "wasmModule": wasmModule
        });
      }),
      loadWasmModuleToAllWorkers: function (onMaybeReady) {
        if (ENVIRONMENT_IS_PTHREAD) {
          return onMaybeReady();
        }
        let pthreadPoolReady = Promise.all(PThread.unusedWorkers.map(PThread.loadWasmModuleToWorker));
        pthreadPoolReady.then(onMaybeReady);
      },
      allocateUnusedWorker: function () {
        var worker;
        var pthreadMainJs = locateFile("skwasm.worker.js");
        worker = new Worker(pthreadMainJs);
        PThread.unusedWorkers.push(worker);
      },
      getNewWorker: function () {
        if (PThread.unusedWorkers.length == 0) {
          PThread.allocateUnusedWorker();
          PThread.loadWasmModuleToWorker(PThread.unusedWorkers[0]);
        }
        return PThread.unusedWorkers.pop();
      }
    };
    Module["PThread"] = PThread;
    function callRuntimeCallbacks(callbacks) {
      while (callbacks.length > 0) {
        callbacks.shift()(Module);
      }
    }
    function establishStackSpace() {
      var pthread_ptr = _pthread_self();
      var stackTop = GROWABLE_HEAP_I32()[pthread_ptr + 52 >> 2];
      var stackSize = GROWABLE_HEAP_I32()[pthread_ptr + 56 >> 2];
      var stackMax = stackTop - stackSize;
      _emscripten_stack_set_limits(stackTop, stackMax);
      stackRestore(stackTop);
    }
    Module["establishStackSpace"] = establishStackSpace;
    function exitOnMainThread(returnCode) {
      if (ENVIRONMENT_IS_PTHREAD) return _emscripten_proxy_to_main_thread_js(2, 0, returnCode);
      try {
        _exit(returnCode);
      } catch (e) {
        handleException(e);
      }
    }
    function getWasmTableEntry(funcPtr) {
      return wasmTable.get(funcPtr);
    }
    function invokeEntryPoint(ptr, arg) {
      var result = getWasmTableEntry(ptr)(arg);
      if (keepRuntimeAlive()) {
        PThread.setExitStatus(result);
      } else {
        __emscripten_thread_exit(result);
      }
    }
    Module["invokeEntryPoint"] = invokeEntryPoint;
    function registerTLSInit(tlsInitFunc) {
      PThread.tlsInitFunctions.push(tlsInitFunc);
    }
    function ExceptionInfo(excPtr) {
      this.excPtr = excPtr;
      this.ptr = excPtr - 24;
      this.set_type = function (type) {
        GROWABLE_HEAP_U32()[this.ptr + 4 >> 2] = type;
      };
      this.get_type = function () {
        return GROWABLE_HEAP_U32()[this.ptr + 4 >> 2];
      };
      this.set_destructor = function (destructor) {
        GROWABLE_HEAP_U32()[this.ptr + 8 >> 2] = destructor;
      };
      this.get_destructor = function () {
        return GROWABLE_HEAP_U32()[this.ptr + 8 >> 2];
      };
      this.set_refcount = function (refcount) {
        GROWABLE_HEAP_I32()[this.ptr >> 2] = refcount;
      };
      this.set_caught = function (caught) {
        caught = caught ? 1 : 0;
        GROWABLE_HEAP_I8()[this.ptr + 12 >> 0] = caught;
      };
      this.get_caught = function () {
        return GROWABLE_HEAP_I8()[this.ptr + 12 >> 0] != 0;
      };
      this.set_rethrown = function (rethrown) {
        rethrown = rethrown ? 1 : 0;
        GROWABLE_HEAP_I8()[this.ptr + 13 >> 0] = rethrown;
      };
      this.get_rethrown = function () {
        return GROWABLE_HEAP_I8()[this.ptr + 13 >> 0] != 0;
      };
      this.init = function (type, destructor) {
        this.set_adjusted_ptr(0);
        this.set_type(type);
        this.set_destructor(destructor);
        this.set_refcount(0);
        this.set_caught(false);
        this.set_rethrown(false);
      };
      this.add_ref = function () {
        Atomics.add(GROWABLE_HEAP_I32(), this.ptr + 0 >> 2, 1);
      };
      this.release_ref = function () {
        var prev = Atomics.sub(GROWABLE_HEAP_I32(), this.ptr + 0 >> 2, 1);
        return prev === 1;
      };
      this.set_adjusted_ptr = function (adjustedPtr) {
        GROWABLE_HEAP_U32()[this.ptr + 16 >> 2] = adjustedPtr;
      };
      this.get_adjusted_ptr = function () {
        return GROWABLE_HEAP_U32()[this.ptr + 16 >> 2];
      };
      this.get_exception_ptr = function () {
        var isPointer = ___cxa_is_pointer_type(this.get_type());
        if (isPointer) {
          return GROWABLE_HEAP_U32()[this.excPtr >> 2];
        }
        var adjusted = this.get_adjusted_ptr();
        if (adjusted !== 0) return adjusted;
        return this.excPtr;
      };
    }
    var exceptionLast = 0;
    var uncaughtExceptionCount = 0;
    function ___cxa_throw(ptr, type, destructor) {
      var info = new ExceptionInfo(ptr);
      info.init(type, destructor);
      exceptionLast = ptr;
      uncaughtExceptionCount++;
      throw ptr;
    }
    function ___emscripten_init_main_thread_js(tb) {
      __emscripten_thread_init(tb, !ENVIRONMENT_IS_WORKER, 1, !ENVIRONMENT_IS_WEB);
      PThread.threadInitTLS();
    }
    function ___emscripten_thread_cleanup(thread) {
      if (!ENVIRONMENT_IS_PTHREAD) cleanupThread(thread);else postMessage({
        "cmd": "cleanupThread",
        "thread": thread
      });
    }
    function pthreadCreateProxied(pthread_ptr, attr, startRoutine, arg) {
      if (ENVIRONMENT_IS_PTHREAD) return _emscripten_proxy_to_main_thread_js(3, 1, pthread_ptr, attr, startRoutine, arg);
      return ___pthread_create_js(pthread_ptr, attr, startRoutine, arg);
    }
    function ___pthread_create_js(pthread_ptr, attr, startRoutine, arg) {
      if (typeof SharedArrayBuffer == "undefined") {
        err("Current environment does not support SharedArrayBuffer, pthreads are not available!");
        return 6;
      }
      var transferList = [];
      var error = 0;
      var transferredCanvasNames = attr ? GROWABLE_HEAP_U32()[attr + 40 >> 2] : 0;
      if (transferredCanvasNames == -1 >>> 0) transferredCanvasNames = "#canvas";else if (transferredCanvasNames) transferredCanvasNames = UTF8ToString(transferredCanvasNames).trim();
      if (transferredCanvasNames) transferredCanvasNames = transferredCanvasNames.split(",");
      var offscreenCanvases = {};
      var moduleCanvasId = Module["canvas"] ? Module["canvas"].id : "";
      for (var i in transferredCanvasNames) {
        var name = transferredCanvasNames[i].trim();
        var offscreenCanvasInfo;
        try {
          if (name == "#canvas") {
            if (!Module["canvas"]) {
              err('pthread_create: could not find canvas with ID "' + name + '" to transfer to thread!');
              error = 28;
              break;
            }
            name = Module["canvas"].id;
          }
          if (GL.offscreenCanvases[name]) {
            offscreenCanvasInfo = GL.offscreenCanvases[name];
            GL.offscreenCanvases[name] = null;
            if (Module["canvas"] instanceof OffscreenCanvas && name === Module["canvas"].id) Module["canvas"] = null;
          } else if (!ENVIRONMENT_IS_PTHREAD) {
            var canvas = Module["canvas"] && Module["canvas"].id === name ? Module["canvas"] : document.querySelector(name);
            if (!canvas) {
              err('pthread_create: could not find canvas with ID "' + name + '" to transfer to thread!');
              error = 28;
              break;
            }
            if (canvas.controlTransferredOffscreen) {
              err('pthread_create: cannot transfer canvas with ID "' + name + '" to thread, since the current thread does not have control over it!');
              error = 63;
              break;
            }
            if (canvas.transferControlToOffscreen) {
              if (!canvas.canvasSharedPtr) {
                canvas.canvasSharedPtr = _malloc(12);
                GROWABLE_HEAP_I32()[canvas.canvasSharedPtr >> 2] = canvas.width;
                GROWABLE_HEAP_I32()[canvas.canvasSharedPtr + 4 >> 2] = canvas.height;
                GROWABLE_HEAP_I32()[canvas.canvasSharedPtr + 8 >> 2] = 0;
              }
              offscreenCanvasInfo = {
                offscreenCanvas: canvas.transferControlToOffscreen(),
                canvasSharedPtr: canvas.canvasSharedPtr,
                id: canvas.id
              };
              canvas.controlTransferredOffscreen = true;
            } else {
              err('pthread_create: cannot transfer control of canvas "' + name + '" to pthread, because current browser does not support OffscreenCanvas!');
              err("pthread_create: Build with -sOFFSCREEN_FRAMEBUFFER to enable fallback proxying of GL commands from pthread to main thread.");
              return 52;
            }
          }
          if (offscreenCanvasInfo) {
            transferList.push(offscreenCanvasInfo.offscreenCanvas);
            offscreenCanvases[offscreenCanvasInfo.id] = offscreenCanvasInfo;
          }
        } catch (e) {
          err('pthread_create: failed to transfer control of canvas "' + name + '" to OffscreenCanvas! Error: ' + e);
          return 28;
        }
      }
      if (ENVIRONMENT_IS_PTHREAD && (transferList.length === 0 || error)) {
        return pthreadCreateProxied(pthread_ptr, attr, startRoutine, arg);
      }
      if (error) return error;
      for (var canvas of Object.values(offscreenCanvases)) {
        GROWABLE_HEAP_I32()[canvas.canvasSharedPtr + 8 >> 2] = pthread_ptr;
      }
      var threadParams = {
        startRoutine: startRoutine,
        pthread_ptr: pthread_ptr,
        arg: arg,
        moduleCanvasId: moduleCanvasId,
        offscreenCanvases: offscreenCanvases,
        transferList: transferList
      };
      if (ENVIRONMENT_IS_PTHREAD) {
        threadParams.cmd = "spawnThread";
        postMessage(threadParams, transferList);
        return 0;
      }
      return spawnThread(threadParams);
    }
    function ___syscall_fcntl64(fd, cmd, varargs) {
      if (ENVIRONMENT_IS_PTHREAD) return _emscripten_proxy_to_main_thread_js(4, 1, fd, cmd, varargs);
      SYSCALLS.varargs = varargs;
      return 0;
    }
    function ___syscall_fstat64(fd, buf) {
      if (ENVIRONMENT_IS_PTHREAD) return _emscripten_proxy_to_main_thread_js(5, 1, fd, buf);
    }
    function ___syscall_ioctl(fd, op, varargs) {
      if (ENVIRONMENT_IS_PTHREAD) return _emscripten_proxy_to_main_thread_js(6, 1, fd, op, varargs);
      SYSCALLS.varargs = varargs;
      return 0;
    }
    function ___syscall_openat(dirfd, path, flags, varargs) {
      if (ENVIRONMENT_IS_PTHREAD) return _emscripten_proxy_to_main_thread_js(7, 1, dirfd, path, flags, varargs);
      SYSCALLS.varargs = varargs;
    }
    function __emscripten_default_pthread_stack_size() {
      return 65536;
    }
    var nowIsMonotonic = true;
    function __emscripten_get_now_is_monotonic() {
      return nowIsMonotonic;
    }
    function executeNotifiedProxyingQueue(queue) {
      Atomics.store(GROWABLE_HEAP_I32(), queue >> 2, 1);
      if (_pthread_self()) {
        __emscripten_proxy_execute_task_queue(queue);
      }
      Atomics.compareExchange(GROWABLE_HEAP_I32(), queue >> 2, 1, 0);
    }
    Module["executeNotifiedProxyingQueue"] = executeNotifiedProxyingQueue;
    function __emscripten_notify_task_queue(targetThreadId, currThreadId, mainThreadId, queue) {
      if (targetThreadId == currThreadId) {
        setTimeout(() => executeNotifiedProxyingQueue(queue));
      } else if (ENVIRONMENT_IS_PTHREAD) {
        postMessage({
          "targetThread": targetThreadId,
          "cmd": "processProxyingQueue",
          "queue": queue
        });
      } else {
        var worker = PThread.pthreads[targetThreadId];
        if (!worker) {
          return;
        }
        worker.postMessage({
          "cmd": "processProxyingQueue",
          "queue": queue
        });
      }
    }
    function withStackSave(f) {
      var stack = stackSave();
      var ret = f();
      stackRestore(stack);
      return ret;
    }
    var JSEvents = {
      inEventHandler: 0,
      removeAllEventListeners: function () {
        for (var i = JSEvents.eventHandlers.length - 1; i >= 0; --i) {
          JSEvents._removeHandler(i);
        }
        JSEvents.eventHandlers = [];
        JSEvents.deferredCalls = [];
      },
      registerRemoveEventListeners: function () {
        if (!JSEvents.removeEventListenersRegistered) {
          __ATEXIT__.push(JSEvents.removeAllEventListeners);
          JSEvents.removeEventListenersRegistered = true;
        }
      },
      deferredCalls: [],
      deferCall: function (targetFunction, precedence, argsList) {
        function arraysHaveEqualContent(arrA, arrB) {
          if (arrA.length != arrB.length) return false;
          for (var i in arrA) {
            if (arrA[i] != arrB[i]) return false;
          }
          return true;
        }
        for (var i in JSEvents.deferredCalls) {
          var call = JSEvents.deferredCalls[i];
          if (call.targetFunction == targetFunction && arraysHaveEqualContent(call.argsList, argsList)) {
            return;
          }
        }
        JSEvents.deferredCalls.push({
          targetFunction: targetFunction,
          precedence: precedence,
          argsList: argsList
        });
        JSEvents.deferredCalls.sort(function (x, y) {
          return x.precedence < y.precedence;
        });
      },
      removeDeferredCalls: function (targetFunction) {
        for (var i = 0; i < JSEvents.deferredCalls.length; ++i) {
          if (JSEvents.deferredCalls[i].targetFunction == targetFunction) {
            JSEvents.deferredCalls.splice(i, 1);
            --i;
          }
        }
      },
      canPerformEventHandlerRequests: function () {
        return JSEvents.inEventHandler && JSEvents.currentEventHandler.allowsDeferredCalls;
      },
      runDeferredCalls: function () {
        if (!JSEvents.canPerformEventHandlerRequests()) {
          return;
        }
        for (var i = 0; i < JSEvents.deferredCalls.length; ++i) {
          var call = JSEvents.deferredCalls[i];
          JSEvents.deferredCalls.splice(i, 1);
          --i;
          call.targetFunction.apply(null, call.argsList);
        }
      },
      eventHandlers: [],
      removeAllHandlersOnTarget: function (target, eventTypeString) {
        for (var i = 0; i < JSEvents.eventHandlers.length; ++i) {
          if (JSEvents.eventHandlers[i].target == target && (!eventTypeString || eventTypeString == JSEvents.eventHandlers[i].eventTypeString)) {
            JSEvents._removeHandler(i--);
          }
        }
      },
      _removeHandler: function (i) {
        var h = JSEvents.eventHandlers[i];
        h.target.removeEventListener(h.eventTypeString, h.eventListenerFunc, h.useCapture);
        JSEvents.eventHandlers.splice(i, 1);
      },
      registerOrRemoveHandler: function (eventHandler) {
        var jsEventHandler = function jsEventHandler(event) {
          ++JSEvents.inEventHandler;
          JSEvents.currentEventHandler = eventHandler;
          JSEvents.runDeferredCalls();
          eventHandler.handlerFunc(event);
          JSEvents.runDeferredCalls();
          --JSEvents.inEventHandler;
        };
        if (eventHandler.callbackfunc) {
          eventHandler.eventListenerFunc = jsEventHandler;
          eventHandler.target.addEventListener(eventHandler.eventTypeString, jsEventHandler, eventHandler.useCapture);
          JSEvents.eventHandlers.push(eventHandler);
          JSEvents.registerRemoveEventListeners();
        } else {
          for (var i = 0; i < JSEvents.eventHandlers.length; ++i) {
            if (JSEvents.eventHandlers[i].target == eventHandler.target && JSEvents.eventHandlers[i].eventTypeString == eventHandler.eventTypeString) {
              JSEvents._removeHandler(i--);
            }
          }
        }
      },
      queueEventHandlerOnThread_iiii: function (targetThread, eventHandlerFunc, eventTypeId, eventData, userData) {
        withStackSave(function () {
          var varargs = stackAlloc(12);
          GROWABLE_HEAP_I32()[varargs >> 2] = eventTypeId;
          GROWABLE_HEAP_I32()[varargs + 4 >> 2] = eventData;
          GROWABLE_HEAP_I32()[varargs + 8 >> 2] = userData;
          _emscripten_dispatch_to_thread_(targetThread, 637534208, eventHandlerFunc, eventData, varargs);
        });
      },
      getTargetThreadForEventCallback: function (targetThread) {
        switch (targetThread) {
          case 1:
            return 0;
          case 2:
            return PThread.currentProxiedOperationCallerThread;
          default:
            return targetThread;
        }
      },
      getNodeNameForTarget: function (target) {
        if (!target) return "";
        if (target == window) return "#window";
        if (target == screen) return "#screen";
        return target && target.nodeName ? target.nodeName : "";
      },
      fullscreenEnabled: function () {
        return document.fullscreenEnabled || document.webkitFullscreenEnabled;
      }
    };
    function stringToNewUTF8(jsString) {
      var length = lengthBytesUTF8(jsString) + 1;
      var cString = _malloc(length);
      stringToUTF8(jsString, cString, length);
      return cString;
    }
    function _emscripten_set_offscreencanvas_size_on_target_thread_js(targetThread, targetCanvas, width, height) {
      withStackSave(function () {
        var varargs = stackAlloc(12);
        var targetCanvasPtr = 0;
        if (targetCanvas) {
          targetCanvasPtr = stringToNewUTF8(targetCanvas);
        }
        GROWABLE_HEAP_I32()[varargs >> 2] = targetCanvasPtr;
        GROWABLE_HEAP_I32()[varargs + 4 >> 2] = width;
        GROWABLE_HEAP_I32()[varargs + 8 >> 2] = height;
        _emscripten_dispatch_to_thread_(targetThread, 654311424, 0, targetCanvasPtr, varargs);
      });
    }
    function _emscripten_set_offscreencanvas_size_on_target_thread(targetThread, targetCanvas, width, height) {
      targetCanvas = targetCanvas ? UTF8ToString(targetCanvas) : "";
      _emscripten_set_offscreencanvas_size_on_target_thread_js(targetThread, targetCanvas, width, height);
    }
    function __webgl_enable_ANGLE_instanced_arrays(ctx) {
      var ext = ctx.getExtension("ANGLE_instanced_arrays");
      if (ext) {
        ctx["vertexAttribDivisor"] = function (index, divisor) {
          ext["vertexAttribDivisorANGLE"](index, divisor);
        };
        ctx["drawArraysInstanced"] = function (mode, first, count, primcount) {
          ext["drawArraysInstancedANGLE"](mode, first, count, primcount);
        };
        ctx["drawElementsInstanced"] = function (mode, count, type, indices, primcount) {
          ext["drawElementsInstancedANGLE"](mode, count, type, indices, primcount);
        };
        return 1;
      }
    }
    function __webgl_enable_OES_vertex_array_object(ctx) {
      var ext = ctx.getExtension("OES_vertex_array_object");
      if (ext) {
        ctx["createVertexArray"] = function () {
          return ext["createVertexArrayOES"]();
        };
        ctx["deleteVertexArray"] = function (vao) {
          ext["deleteVertexArrayOES"](vao);
        };
        ctx["bindVertexArray"] = function (vao) {
          ext["bindVertexArrayOES"](vao);
        };
        ctx["isVertexArray"] = function (vao) {
          return ext["isVertexArrayOES"](vao);
        };
        return 1;
      }
    }
    function __webgl_enable_WEBGL_draw_buffers(ctx) {
      var ext = ctx.getExtension("WEBGL_draw_buffers");
      if (ext) {
        ctx["drawBuffers"] = function (n, bufs) {
          ext["drawBuffersWEBGL"](n, bufs);
        };
        return 1;
      }
    }
    function __webgl_enable_WEBGL_draw_instanced_base_vertex_base_instance(ctx) {
      return !!(ctx.dibvbi = ctx.getExtension("WEBGL_draw_instanced_base_vertex_base_instance"));
    }
    function __webgl_enable_WEBGL_multi_draw_instanced_base_vertex_base_instance(ctx) {
      return !!(ctx.mdibvbi = ctx.getExtension("WEBGL_multi_draw_instanced_base_vertex_base_instance"));
    }
    function __webgl_enable_WEBGL_multi_draw(ctx) {
      return !!(ctx.multiDrawWebgl = ctx.getExtension("WEBGL_multi_draw"));
    }
    var GL = {
      counter: 1,
      buffers: [],
      programs: [],
      framebuffers: [],
      renderbuffers: [],
      textures: [],
      shaders: [],
      vaos: [],
      contexts: {},
      offscreenCanvases: {},
      queries: [],
      samplers: [],
      transformFeedbacks: [],
      syncs: [],
      stringCache: {},
      stringiCache: {},
      unpackAlignment: 4,
      recordError: function recordError(errorCode) {
        if (!GL.lastError) {
          GL.lastError = errorCode;
        }
      },
      getNewId: function (table) {
        var ret = GL.counter++;
        for (var i = table.length; i < ret; i++) {
          table[i] = null;
        }
        return ret;
      },
      getSource: function (shader, count, string, length) {
        var source = "";
        for (var i = 0; i < count; ++i) {
          var len = length ? GROWABLE_HEAP_I32()[length + i * 4 >> 2] : -1;
          source += UTF8ToString(GROWABLE_HEAP_I32()[string + i * 4 >> 2], len < 0 ? undefined : len);
        }
        return source;
      },
      createContext: function (canvas, webGLContextAttributes) {
        if (!canvas.getContextSafariWebGL2Fixed) {
          canvas.getContextSafariWebGL2Fixed = canvas.getContext;
          function fixedGetContext(ver, attrs) {
            var gl = canvas.getContextSafariWebGL2Fixed(ver, attrs);
            return ver == "webgl" == gl instanceof WebGLRenderingContext ? gl : null;
          }
          canvas.getContext = fixedGetContext;
        }
        var ctx = webGLContextAttributes.majorVersion > 1 ? canvas.getContext("webgl2", webGLContextAttributes) : canvas.getContext("webgl", webGLContextAttributes);
        if (!ctx) return 0;
        var handle = GL.registerContext(ctx, webGLContextAttributes);
        return handle;
      },
      registerContext: function (ctx, webGLContextAttributes) {
        var handle = _malloc(8);
        GROWABLE_HEAP_I32()[handle + 4 >> 2] = _pthread_self();
        var context = {
          handle: handle,
          attributes: webGLContextAttributes,
          version: webGLContextAttributes.majorVersion,
          GLctx: ctx
        };
        if (ctx.canvas) ctx.canvas.GLctxObject = context;
        GL.contexts[handle] = context;
        if (typeof webGLContextAttributes.enableExtensionsByDefault == "undefined" || webGLContextAttributes.enableExtensionsByDefault) {
          GL.initExtensions(context);
        }
        return handle;
      },
      makeContextCurrent: function (contextHandle) {
        GL.currentContext = GL.contexts[contextHandle];
        Module.ctx = GLctx = GL.currentContext && GL.currentContext.GLctx;
        return !(contextHandle && !GLctx);
      },
      getContext: function (contextHandle) {
        return GL.contexts[contextHandle];
      },
      deleteContext: function (contextHandle) {
        if (GL.currentContext === GL.contexts[contextHandle]) GL.currentContext = null;
        if (typeof JSEvents == "object") JSEvents.removeAllHandlersOnTarget(GL.contexts[contextHandle].GLctx.canvas);
        if (GL.contexts[contextHandle] && GL.contexts[contextHandle].GLctx.canvas) GL.contexts[contextHandle].GLctx.canvas.GLctxObject = undefined;
        _free(GL.contexts[contextHandle].handle);
        GL.contexts[contextHandle] = null;
      },
      initExtensions: function (context) {
        if (!context) context = GL.currentContext;
        if (context.initExtensionsDone) return;
        context.initExtensionsDone = true;
        var GLctx = context.GLctx;
        __webgl_enable_ANGLE_instanced_arrays(GLctx);
        __webgl_enable_OES_vertex_array_object(GLctx);
        __webgl_enable_WEBGL_draw_buffers(GLctx);
        __webgl_enable_WEBGL_draw_instanced_base_vertex_base_instance(GLctx);
        __webgl_enable_WEBGL_multi_draw_instanced_base_vertex_base_instance(GLctx);
        if (context.version >= 2) {
          GLctx.disjointTimerQueryExt = GLctx.getExtension("EXT_disjoint_timer_query_webgl2");
        }
        if (context.version < 2 || !GLctx.disjointTimerQueryExt) {
          GLctx.disjointTimerQueryExt = GLctx.getExtension("EXT_disjoint_timer_query");
        }
        __webgl_enable_WEBGL_multi_draw(GLctx);
        var exts = GLctx.getSupportedExtensions() || [];
        exts.forEach(function (ext) {
          if (!ext.includes("lose_context") && !ext.includes("debug")) {
            GLctx.getExtension(ext);
          }
        });
      }
    };
    function maybeCStringToJsString(cString) {
      return cString > 2 ? UTF8ToString(cString) : cString;
    }
    function findCanvasEventTarget(target) {
      target = maybeCStringToJsString(target);
      return GL.offscreenCanvases[target.substr(1)] || target == "canvas" && Object.keys(GL.offscreenCanvases)[0] || typeof document != "undefined" && document.querySelector(target);
    }
    function _emscripten_set_canvas_element_size_calling_thread(target, width, height) {
      var canvas = findCanvasEventTarget(target);
      if (!canvas) return -4;
      if (canvas.canvasSharedPtr) {
        GROWABLE_HEAP_I32()[canvas.canvasSharedPtr >> 2] = width;
        GROWABLE_HEAP_I32()[canvas.canvasSharedPtr + 4 >> 2] = height;
      }
      if (canvas.offscreenCanvas || !canvas.controlTransferredOffscreen) {
        if (canvas.offscreenCanvas) canvas = canvas.offscreenCanvas;
        var autoResizeViewport = false;
        if (canvas.GLctxObject && canvas.GLctxObject.GLctx) {
          var prevViewport = canvas.GLctxObject.GLctx.getParameter(2978);
          autoResizeViewport = prevViewport[0] === 0 && prevViewport[1] === 0 && prevViewport[2] === canvas.width && prevViewport[3] === canvas.height;
        }
        canvas.width = width;
        canvas.height = height;
        if (autoResizeViewport) {
          canvas.GLctxObject.GLctx.viewport(0, 0, width, height);
        }
      } else if (canvas.canvasSharedPtr) {
        var targetThread = GROWABLE_HEAP_I32()[canvas.canvasSharedPtr + 8 >> 2];
        _emscripten_set_offscreencanvas_size_on_target_thread(targetThread, target, width, height);
        return 1;
      } else {
        return -4;
      }
      return 0;
    }
    function _emscripten_set_canvas_element_size_main_thread(target, width, height) {
      if (ENVIRONMENT_IS_PTHREAD) return _emscripten_proxy_to_main_thread_js(8, 1, target, width, height);
      return _emscripten_set_canvas_element_size_calling_thread(target, width, height);
    }
    function _emscripten_set_canvas_element_size(target, width, height) {
      var canvas = findCanvasEventTarget(target);
      if (canvas) {
        return _emscripten_set_canvas_element_size_calling_thread(target, width, height);
      }
      return _emscripten_set_canvas_element_size_main_thread(target, width, height);
    }
    var __emscripten_set_offscreencanvas_size = _emscripten_set_canvas_element_size;
    function __emscripten_throw_longjmp() {
      throw Infinity;
    }
    function __mmap_js(len, prot, flags, fd, off, allocated, addr) {
      if (ENVIRONMENT_IS_PTHREAD) return _emscripten_proxy_to_main_thread_js(9, 1, len, prot, flags, fd, off, allocated, addr);
      return -52;
    }
    function __munmap_js(addr, len, prot, flags, fd, offset) {
      if (ENVIRONMENT_IS_PTHREAD) return _emscripten_proxy_to_main_thread_js(10, 1, addr, len, prot, flags, fd, offset);
    }
    function _abort() {
      abort("");
    }
    function warnOnce(text) {
      if (!warnOnce.shown) warnOnce.shown = {};
      if (!warnOnce.shown[text]) {
        warnOnce.shown[text] = 1;
        if (ENVIRONMENT_IS_NODE) text = "warning: " + text;
        err(text);
      }
    }
    function _emscripten_check_blocking_allowed() {
      if (ENVIRONMENT_IS_NODE) return;
      if (ENVIRONMENT_IS_WORKER) return;
      warnOnce("Blocking on the main thread is very dangerous, see https://emscripten.org/docs/porting/pthreads.html#blocking-on-the-main-browser-thread");
    }
    var _emscripten_get_now;
    if (ENVIRONMENT_IS_NODE) {
      _emscripten_get_now = () => {
        var t = process.hrtime();
        return t[0] * 1e3 + t[1] / 1e6;
      };
    } else _emscripten_get_now = () => performance.timeOrigin + performance.now();
    function _emscripten_glActiveTexture(x0) {
      GLctx["activeTexture"](x0);
    }
    function _emscripten_glAttachShader(program, shader) {
      GLctx.attachShader(GL.programs[program], GL.shaders[shader]);
    }
    function _emscripten_glBindAttribLocation(program, index, name) {
      GLctx.bindAttribLocation(GL.programs[program], index, UTF8ToString(name));
    }
    function _emscripten_glBindBuffer(target, buffer) {
      if (target == 35051) {
        GLctx.currentPixelPackBufferBinding = buffer;
      } else if (target == 35052) {
        GLctx.currentPixelUnpackBufferBinding = buffer;
      }
      GLctx.bindBuffer(target, GL.buffers[buffer]);
    }
    function _emscripten_glBindFramebuffer(target, framebuffer) {
      GLctx.bindFramebuffer(target, GL.framebuffers[framebuffer]);
    }
    function _emscripten_glBindRenderbuffer(target, renderbuffer) {
      GLctx.bindRenderbuffer(target, GL.renderbuffers[renderbuffer]);
    }
    function _emscripten_glBindSampler(unit, sampler) {
      GLctx["bindSampler"](unit, GL.samplers[sampler]);
    }
    function _emscripten_glBindTexture(target, texture) {
      GLctx.bindTexture(target, GL.textures[texture]);
    }
    function _emscripten_glBindVertexArray(vao) {
      GLctx["bindVertexArray"](GL.vaos[vao]);
    }
    function _emscripten_glBindVertexArrayOES(vao) {
      GLctx["bindVertexArray"](GL.vaos[vao]);
    }
    function _emscripten_glBlendColor(x0, x1, x2, x3) {
      GLctx["blendColor"](x0, x1, x2, x3);
    }
    function _emscripten_glBlendEquation(x0) {
      GLctx["blendEquation"](x0);
    }
    function _emscripten_glBlendFunc(x0, x1) {
      GLctx["blendFunc"](x0, x1);
    }
    function _emscripten_glBlitFramebuffer(x0, x1, x2, x3, x4, x5, x6, x7, x8, x9) {
      GLctx["blitFramebuffer"](x0, x1, x2, x3, x4, x5, x6, x7, x8, x9);
    }
    function _emscripten_glBufferData(target, size, data, usage) {
      if (GL.currentContext.version >= 2) {
        if (data && size) {
          GLctx.bufferData(target, GROWABLE_HEAP_U8(), usage, data, size);
        } else {
          GLctx.bufferData(target, size, usage);
        }
      } else {
        GLctx.bufferData(target, data ? GROWABLE_HEAP_U8().subarray(data, data + size) : size, usage);
      }
    }
    function _emscripten_glBufferSubData(target, offset, size, data) {
      if (GL.currentContext.version >= 2) {
        size && GLctx.bufferSubData(target, offset, GROWABLE_HEAP_U8(), data, size);
        return;
      }
      GLctx.bufferSubData(target, offset, GROWABLE_HEAP_U8().subarray(data, data + size));
    }
    function _emscripten_glCheckFramebufferStatus(x0) {
      return GLctx["checkFramebufferStatus"](x0);
    }
    function _emscripten_glClear(x0) {
      GLctx["clear"](x0);
    }
    function _emscripten_glClearColor(x0, x1, x2, x3) {
      GLctx["clearColor"](x0, x1, x2, x3);
    }
    function _emscripten_glClearStencil(x0) {
      GLctx["clearStencil"](x0);
    }
    function convertI32PairToI53(lo, hi) {
      return (lo >>> 0) + hi * 4294967296;
    }
    function _emscripten_glClientWaitSync(sync, flags, timeout_low, timeout_high) {
      var timeout = convertI32PairToI53(timeout_low, timeout_high);
      return GLctx.clientWaitSync(GL.syncs[sync], flags, timeout);
    }
    function _emscripten_glColorMask(red, green, blue, alpha) {
      GLctx.colorMask(!!red, !!green, !!blue, !!alpha);
    }
    function _emscripten_glCompileShader(shader) {
      GLctx.compileShader(GL.shaders[shader]);
    }
    function _emscripten_glCompressedTexImage2D(target, level, internalFormat, width, height, border, imageSize, data) {
      if (GL.currentContext.version >= 2) {
        if (GLctx.currentPixelUnpackBufferBinding || !imageSize) {
          GLctx["compressedTexImage2D"](target, level, internalFormat, width, height, border, imageSize, data);
        } else {
          GLctx["compressedTexImage2D"](target, level, internalFormat, width, height, border, GROWABLE_HEAP_U8(), data, imageSize);
        }
        return;
      }
      GLctx["compressedTexImage2D"](target, level, internalFormat, width, height, border, data ? GROWABLE_HEAP_U8().subarray(data, data + imageSize) : null);
    }
    function _emscripten_glCompressedTexSubImage2D(target, level, xoffset, yoffset, width, height, format, imageSize, data) {
      if (GL.currentContext.version >= 2) {
        if (GLctx.currentPixelUnpackBufferBinding || !imageSize) {
          GLctx["compressedTexSubImage2D"](target, level, xoffset, yoffset, width, height, format, imageSize, data);
        } else {
          GLctx["compressedTexSubImage2D"](target, level, xoffset, yoffset, width, height, format, GROWABLE_HEAP_U8(), data, imageSize);
        }
        return;
      }
      GLctx["compressedTexSubImage2D"](target, level, xoffset, yoffset, width, height, format, data ? GROWABLE_HEAP_U8().subarray(data, data + imageSize) : null);
    }
    function _emscripten_glCopyBufferSubData(x0, x1, x2, x3, x4) {
      GLctx["copyBufferSubData"](x0, x1, x2, x3, x4);
    }
    function _emscripten_glCopyTexSubImage2D(x0, x1, x2, x3, x4, x5, x6, x7) {
      GLctx["copyTexSubImage2D"](x0, x1, x2, x3, x4, x5, x6, x7);
    }
    function _emscripten_glCreateProgram() {
      var id = GL.getNewId(GL.programs);
      var program = GLctx.createProgram();
      program.name = id;
      program.maxUniformLength = program.maxAttributeLength = program.maxUniformBlockNameLength = 0;
      program.uniformIdCounter = 1;
      GL.programs[id] = program;
      return id;
    }
    function _emscripten_glCreateShader(shaderType) {
      var id = GL.getNewId(GL.shaders);
      GL.shaders[id] = GLctx.createShader(shaderType);
      return id;
    }
    function _emscripten_glCullFace(x0) {
      GLctx["cullFace"](x0);
    }
    function _emscripten_glDeleteBuffers(n, buffers) {
      for (var i = 0; i < n; i++) {
        var id = GROWABLE_HEAP_I32()[buffers + i * 4 >> 2];
        var buffer = GL.buffers[id];
        if (!buffer) continue;
        GLctx.deleteBuffer(buffer);
        buffer.name = 0;
        GL.buffers[id] = null;
        if (id == GLctx.currentPixelPackBufferBinding) GLctx.currentPixelPackBufferBinding = 0;
        if (id == GLctx.currentPixelUnpackBufferBinding) GLctx.currentPixelUnpackBufferBinding = 0;
      }
    }
    function _emscripten_glDeleteFramebuffers(n, framebuffers) {
      for (var i = 0; i < n; ++i) {
        var id = GROWABLE_HEAP_I32()[framebuffers + i * 4 >> 2];
        var framebuffer = GL.framebuffers[id];
        if (!framebuffer) continue;
        GLctx.deleteFramebuffer(framebuffer);
        framebuffer.name = 0;
        GL.framebuffers[id] = null;
      }
    }
    function _emscripten_glDeleteProgram(id) {
      if (!id) return;
      var program = GL.programs[id];
      if (!program) {
        GL.recordError(1281);
        return;
      }
      GLctx.deleteProgram(program);
      program.name = 0;
      GL.programs[id] = null;
    }
    function _emscripten_glDeleteRenderbuffers(n, renderbuffers) {
      for (var i = 0; i < n; i++) {
        var id = GROWABLE_HEAP_I32()[renderbuffers + i * 4 >> 2];
        var renderbuffer = GL.renderbuffers[id];
        if (!renderbuffer) continue;
        GLctx.deleteRenderbuffer(renderbuffer);
        renderbuffer.name = 0;
        GL.renderbuffers[id] = null;
      }
    }
    function _emscripten_glDeleteSamplers(n, samplers) {
      for (var i = 0; i < n; i++) {
        var id = GROWABLE_HEAP_I32()[samplers + i * 4 >> 2];
        var sampler = GL.samplers[id];
        if (!sampler) continue;
        GLctx["deleteSampler"](sampler);
        sampler.name = 0;
        GL.samplers[id] = null;
      }
    }
    function _emscripten_glDeleteShader(id) {
      if (!id) return;
      var shader = GL.shaders[id];
      if (!shader) {
        GL.recordError(1281);
        return;
      }
      GLctx.deleteShader(shader);
      GL.shaders[id] = null;
    }
    function _emscripten_glDeleteSync(id) {
      if (!id) return;
      var sync = GL.syncs[id];
      if (!sync) {
        GL.recordError(1281);
        return;
      }
      GLctx.deleteSync(sync);
      sync.name = 0;
      GL.syncs[id] = null;
    }
    function _emscripten_glDeleteTextures(n, textures) {
      for (var i = 0; i < n; i++) {
        var id = GROWABLE_HEAP_I32()[textures + i * 4 >> 2];
        var texture = GL.textures[id];
        if (!texture) continue;
        GLctx.deleteTexture(texture);
        texture.name = 0;
        GL.textures[id] = null;
      }
    }
    function _emscripten_glDeleteVertexArrays(n, vaos) {
      for (var i = 0; i < n; i++) {
        var id = GROWABLE_HEAP_I32()[vaos + i * 4 >> 2];
        GLctx["deleteVertexArray"](GL.vaos[id]);
        GL.vaos[id] = null;
      }
    }
    function _emscripten_glDeleteVertexArraysOES(n, vaos) {
      for (var i = 0; i < n; i++) {
        var id = GROWABLE_HEAP_I32()[vaos + i * 4 >> 2];
        GLctx["deleteVertexArray"](GL.vaos[id]);
        GL.vaos[id] = null;
      }
    }
    function _emscripten_glDepthMask(flag) {
      GLctx.depthMask(!!flag);
    }
    function _emscripten_glDisable(x0) {
      GLctx["disable"](x0);
    }
    function _emscripten_glDisableVertexAttribArray(index) {
      GLctx.disableVertexAttribArray(index);
    }
    function _emscripten_glDrawArrays(mode, first, count) {
      GLctx.drawArrays(mode, first, count);
    }
    function _emscripten_glDrawArraysInstanced(mode, first, count, primcount) {
      GLctx["drawArraysInstanced"](mode, first, count, primcount);
    }
    function _emscripten_glDrawArraysInstancedBaseInstanceWEBGL(mode, first, count, instanceCount, baseInstance) {
      GLctx.dibvbi["drawArraysInstancedBaseInstanceWEBGL"](mode, first, count, instanceCount, baseInstance);
    }
    var tempFixedLengthArray = [];
    function _emscripten_glDrawBuffers(n, bufs) {
      var bufArray = tempFixedLengthArray[n];
      for (var i = 0; i < n; i++) {
        bufArray[i] = GROWABLE_HEAP_I32()[bufs + i * 4 >> 2];
      }
      GLctx["drawBuffers"](bufArray);
    }
    function _emscripten_glDrawElements(mode, count, type, indices) {
      GLctx.drawElements(mode, count, type, indices);
    }
    function _emscripten_glDrawElementsInstanced(mode, count, type, indices, primcount) {
      GLctx["drawElementsInstanced"](mode, count, type, indices, primcount);
    }
    function _emscripten_glDrawElementsInstancedBaseVertexBaseInstanceWEBGL(mode, count, type, offset, instanceCount, baseVertex, baseinstance) {
      GLctx.dibvbi["drawElementsInstancedBaseVertexBaseInstanceWEBGL"](mode, count, type, offset, instanceCount, baseVertex, baseinstance);
    }
    function _glDrawElements(mode, count, type, indices) {
      GLctx.drawElements(mode, count, type, indices);
    }
    function _emscripten_glDrawRangeElements(mode, start, end, count, type, indices) {
      _glDrawElements(mode, count, type, indices);
    }
    function _emscripten_glEnable(x0) {
      GLctx["enable"](x0);
    }
    function _emscripten_glEnableVertexAttribArray(index) {
      GLctx.enableVertexAttribArray(index);
    }
    function _emscripten_glFenceSync(condition, flags) {
      var sync = GLctx.fenceSync(condition, flags);
      if (sync) {
        var id = GL.getNewId(GL.syncs);
        sync.name = id;
        GL.syncs[id] = sync;
        return id;
      }
      return 0;
    }
    function _emscripten_glFinish() {
      GLctx["finish"]();
    }
    function _emscripten_glFlush() {
      GLctx["flush"]();
    }
    function _emscripten_glFramebufferRenderbuffer(target, attachment, renderbuffertarget, renderbuffer) {
      GLctx.framebufferRenderbuffer(target, attachment, renderbuffertarget, GL.renderbuffers[renderbuffer]);
    }
    function _emscripten_glFramebufferTexture2D(target, attachment, textarget, texture, level) {
      GLctx.framebufferTexture2D(target, attachment, textarget, GL.textures[texture], level);
    }
    function _emscripten_glFrontFace(x0) {
      GLctx["frontFace"](x0);
    }
    function __glGenObject(n, buffers, createFunction, objectTable) {
      for (var i = 0; i < n; i++) {
        var buffer = GLctx[createFunction]();
        var id = buffer && GL.getNewId(objectTable);
        if (buffer) {
          buffer.name = id;
          objectTable[id] = buffer;
        } else {
          GL.recordError(1282);
        }
        GROWABLE_HEAP_I32()[buffers + i * 4 >> 2] = id;
      }
    }
    function _emscripten_glGenBuffers(n, buffers) {
      __glGenObject(n, buffers, "createBuffer", GL.buffers);
    }
    function _emscripten_glGenFramebuffers(n, ids) {
      __glGenObject(n, ids, "createFramebuffer", GL.framebuffers);
    }
    function _emscripten_glGenRenderbuffers(n, renderbuffers) {
      __glGenObject(n, renderbuffers, "createRenderbuffer", GL.renderbuffers);
    }
    function _emscripten_glGenSamplers(n, samplers) {
      __glGenObject(n, samplers, "createSampler", GL.samplers);
    }
    function _emscripten_glGenTextures(n, textures) {
      __glGenObject(n, textures, "createTexture", GL.textures);
    }
    function _emscripten_glGenVertexArrays(n, arrays) {
      __glGenObject(n, arrays, "createVertexArray", GL.vaos);
    }
    function _emscripten_glGenVertexArraysOES(n, arrays) {
      __glGenObject(n, arrays, "createVertexArray", GL.vaos);
    }
    function _emscripten_glGenerateMipmap(x0) {
      GLctx["generateMipmap"](x0);
    }
    function _emscripten_glGetBufferParameteriv(target, value, data) {
      if (!data) {
        GL.recordError(1281);
        return;
      }
      GROWABLE_HEAP_I32()[data >> 2] = GLctx.getBufferParameter(target, value);
    }
    function _emscripten_glGetError() {
      var error = GLctx.getError() || GL.lastError;
      GL.lastError = 0;
      return error;
    }
    function writeI53ToI64(ptr, num) {
      GROWABLE_HEAP_U32()[ptr >> 2] = num;
      GROWABLE_HEAP_U32()[ptr + 4 >> 2] = (num - GROWABLE_HEAP_U32()[ptr >> 2]) / 4294967296;
    }
    function emscriptenWebGLGet(name_, p, type) {
      if (!p) {
        GL.recordError(1281);
        return;
      }
      var ret = undefined;
      switch (name_) {
        case 36346:
          ret = 1;
          break;
        case 36344:
          if (type != 0 && type != 1) {
            GL.recordError(1280);
          }
          return;
        case 34814:
        case 36345:
          ret = 0;
          break;
        case 34466:
          var formats = GLctx.getParameter(34467);
          ret = formats ? formats.length : 0;
          break;
        case 33309:
          if (GL.currentContext.version < 2) {
            GL.recordError(1282);
            return;
          }
          var exts = GLctx.getSupportedExtensions() || [];
          ret = 2 * exts.length;
          break;
        case 33307:
        case 33308:
          if (GL.currentContext.version < 2) {
            GL.recordError(1280);
            return;
          }
          ret = name_ == 33307 ? 3 : 0;
          break;
      }
      if (ret === undefined) {
        var result = GLctx.getParameter(name_);
        switch (typeof result) {
          case "number":
            ret = result;
            break;
          case "boolean":
            ret = result ? 1 : 0;
            break;
          case "string":
            GL.recordError(1280);
            return;
          case "object":
            if (result === null) {
              switch (name_) {
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
                  {
                    ret = 0;
                    break;
                  }
                default:
                  {
                    GL.recordError(1280);
                    return;
                  }
              }
            } else if (result instanceof Float32Array || result instanceof Uint32Array || result instanceof Int32Array || result instanceof Array) {
              for (var i = 0; i < result.length; ++i) {
                switch (type) {
                  case 0:
                    GROWABLE_HEAP_I32()[p + i * 4 >> 2] = result[i];
                    break;
                  case 2:
                    GROWABLE_HEAP_F32()[p + i * 4 >> 2] = result[i];
                    break;
                  case 4:
                    GROWABLE_HEAP_I8()[p + i >> 0] = result[i] ? 1 : 0;
                    break;
                }
              }
              return;
            } else {
              try {
                ret = result.name | 0;
              } catch (e) {
                GL.recordError(1280);
                err("GL_INVALID_ENUM in glGet" + type + "v: Unknown object returned from WebGL getParameter(" + name_ + ")! (error: " + e + ")");
                return;
              }
            }
            break;
          default:
            GL.recordError(1280);
            err("GL_INVALID_ENUM in glGet" + type + "v: Native code calling glGet" + type + "v(" + name_ + ") and it returns " + result + " of type " + typeof result + "!");
            return;
        }
      }
      switch (type) {
        case 1:
          writeI53ToI64(p, ret);
          break;
        case 0:
          GROWABLE_HEAP_I32()[p >> 2] = ret;
          break;
        case 2:
          GROWABLE_HEAP_F32()[p >> 2] = ret;
          break;
        case 4:
          GROWABLE_HEAP_I8()[p >> 0] = ret ? 1 : 0;
          break;
      }
    }
    function _emscripten_glGetFloatv(name_, p) {
      emscriptenWebGLGet(name_, p, 2);
    }
    function _emscripten_glGetFramebufferAttachmentParameteriv(target, attachment, pname, params) {
      var result = GLctx.getFramebufferAttachmentParameter(target, attachment, pname);
      if (result instanceof WebGLRenderbuffer || result instanceof WebGLTexture) {
        result = result.name | 0;
      }
      GROWABLE_HEAP_I32()[params >> 2] = result;
    }
    function _emscripten_glGetIntegerv(name_, p) {
      emscriptenWebGLGet(name_, p, 0);
    }
    function _emscripten_glGetProgramInfoLog(program, maxLength, length, infoLog) {
      var log = GLctx.getProgramInfoLog(GL.programs[program]);
      if (log === null) log = "(unknown error)";
      var numBytesWrittenExclNull = maxLength > 0 && infoLog ? stringToUTF8(log, infoLog, maxLength) : 0;
      if (length) GROWABLE_HEAP_I32()[length >> 2] = numBytesWrittenExclNull;
    }
    function _emscripten_glGetProgramiv(program, pname, p) {
      if (!p) {
        GL.recordError(1281);
        return;
      }
      if (program >= GL.counter) {
        GL.recordError(1281);
        return;
      }
      program = GL.programs[program];
      if (pname == 35716) {
        var log = GLctx.getProgramInfoLog(program);
        if (log === null) log = "(unknown error)";
        GROWABLE_HEAP_I32()[p >> 2] = log.length + 1;
      } else if (pname == 35719) {
        if (!program.maxUniformLength) {
          for (var i = 0; i < GLctx.getProgramParameter(program, 35718); ++i) {
            program.maxUniformLength = Math.max(program.maxUniformLength, GLctx.getActiveUniform(program, i).name.length + 1);
          }
        }
        GROWABLE_HEAP_I32()[p >> 2] = program.maxUniformLength;
      } else if (pname == 35722) {
        if (!program.maxAttributeLength) {
          for (var i = 0; i < GLctx.getProgramParameter(program, 35721); ++i) {
            program.maxAttributeLength = Math.max(program.maxAttributeLength, GLctx.getActiveAttrib(program, i).name.length + 1);
          }
        }
        GROWABLE_HEAP_I32()[p >> 2] = program.maxAttributeLength;
      } else if (pname == 35381) {
        if (!program.maxUniformBlockNameLength) {
          for (var i = 0; i < GLctx.getProgramParameter(program, 35382); ++i) {
            program.maxUniformBlockNameLength = Math.max(program.maxUniformBlockNameLength, GLctx.getActiveUniformBlockName(program, i).length + 1);
          }
        }
        GROWABLE_HEAP_I32()[p >> 2] = program.maxUniformBlockNameLength;
      } else {
        GROWABLE_HEAP_I32()[p >> 2] = GLctx.getProgramParameter(program, pname);
      }
    }
    function _emscripten_glGetRenderbufferParameteriv(target, pname, params) {
      if (!params) {
        GL.recordError(1281);
        return;
      }
      GROWABLE_HEAP_I32()[params >> 2] = GLctx.getRenderbufferParameter(target, pname);
    }
    function _emscripten_glGetShaderInfoLog(shader, maxLength, length, infoLog) {
      var log = GLctx.getShaderInfoLog(GL.shaders[shader]);
      if (log === null) log = "(unknown error)";
      var numBytesWrittenExclNull = maxLength > 0 && infoLog ? stringToUTF8(log, infoLog, maxLength) : 0;
      if (length) GROWABLE_HEAP_I32()[length >> 2] = numBytesWrittenExclNull;
    }
    function _emscripten_glGetShaderPrecisionFormat(shaderType, precisionType, range, precision) {
      var result = GLctx.getShaderPrecisionFormat(shaderType, precisionType);
      GROWABLE_HEAP_I32()[range >> 2] = result.rangeMin;
      GROWABLE_HEAP_I32()[range + 4 >> 2] = result.rangeMax;
      GROWABLE_HEAP_I32()[precision >> 2] = result.precision;
    }
    function _emscripten_glGetShaderiv(shader, pname, p) {
      if (!p) {
        GL.recordError(1281);
        return;
      }
      if (pname == 35716) {
        var log = GLctx.getShaderInfoLog(GL.shaders[shader]);
        if (log === null) log = "(unknown error)";
        var logLength = log ? log.length + 1 : 0;
        GROWABLE_HEAP_I32()[p >> 2] = logLength;
      } else if (pname == 35720) {
        var source = GLctx.getShaderSource(GL.shaders[shader]);
        var sourceLength = source ? source.length + 1 : 0;
        GROWABLE_HEAP_I32()[p >> 2] = sourceLength;
      } else {
        GROWABLE_HEAP_I32()[p >> 2] = GLctx.getShaderParameter(GL.shaders[shader], pname);
      }
    }
    function _emscripten_glGetString(name_) {
      var ret = GL.stringCache[name_];
      if (!ret) {
        switch (name_) {
          case 7939:
            var exts = GLctx.getSupportedExtensions() || [];
            exts = exts.concat(exts.map(function (e) {
              return "GL_" + e;
            }));
            ret = stringToNewUTF8(exts.join(" "));
            break;
          case 7936:
          case 7937:
          case 37445:
          case 37446:
            var s = GLctx.getParameter(name_);
            if (!s) {
              GL.recordError(1280);
            }
            ret = s && stringToNewUTF8(s);
            break;
          case 7938:
            var glVersion = GLctx.getParameter(7938);
            if (GL.currentContext.version >= 2) glVersion = "OpenGL ES 3.0 (" + glVersion + ")";else {
              glVersion = "OpenGL ES 2.0 (" + glVersion + ")";
            }
            ret = stringToNewUTF8(glVersion);
            break;
          case 35724:
            var glslVersion = GLctx.getParameter(35724);
            var ver_re = /^WebGL GLSL ES ([0-9]\.[0-9][0-9]?)(?:$| .*)/;
            var ver_num = glslVersion.match(ver_re);
            if (ver_num !== null) {
              if (ver_num[1].length == 3) ver_num[1] = ver_num[1] + "0";
              glslVersion = "OpenGL ES GLSL ES " + ver_num[1] + " (" + glslVersion + ")";
            }
            ret = stringToNewUTF8(glslVersion);
            break;
          default:
            GL.recordError(1280);
        }
        GL.stringCache[name_] = ret;
      }
      return ret;
    }
    function _emscripten_glGetStringi(name, index) {
      if (GL.currentContext.version < 2) {
        GL.recordError(1282);
        return 0;
      }
      var stringiCache = GL.stringiCache[name];
      if (stringiCache) {
        if (index < 0 || index >= stringiCache.length) {
          GL.recordError(1281);
          return 0;
        }
        return stringiCache[index];
      }
      switch (name) {
        case 7939:
          var exts = GLctx.getSupportedExtensions() || [];
          exts = exts.concat(exts.map(function (e) {
            return "GL_" + e;
          }));
          exts = exts.map(function (e) {
            return stringToNewUTF8(e);
          });
          stringiCache = GL.stringiCache[name] = exts;
          if (index < 0 || index >= stringiCache.length) {
            GL.recordError(1281);
            return 0;
          }
          return stringiCache[index];
        default:
          GL.recordError(1280);
          return 0;
      }
    }
    function jstoi_q(str) {
      return parseInt(str);
    }
    function webglGetLeftBracePos(name) {
      return name.slice(-1) == "]" && name.lastIndexOf("[");
    }
    function webglPrepareUniformLocationsBeforeFirstUse(program) {
      var uniformLocsById = program.uniformLocsById,
        uniformSizeAndIdsByName = program.uniformSizeAndIdsByName,
        i,
        j;
      if (!uniformLocsById) {
        program.uniformLocsById = uniformLocsById = {};
        program.uniformArrayNamesById = {};
        for (i = 0; i < GLctx.getProgramParameter(program, 35718); ++i) {
          var u = GLctx.getActiveUniform(program, i);
          var nm = u.name;
          var sz = u.size;
          var lb = webglGetLeftBracePos(nm);
          var arrayName = lb > 0 ? nm.slice(0, lb) : nm;
          var id = program.uniformIdCounter;
          program.uniformIdCounter += sz;
          uniformSizeAndIdsByName[arrayName] = [sz, id];
          for (j = 0; j < sz; ++j) {
            uniformLocsById[id] = j;
            program.uniformArrayNamesById[id++] = arrayName;
          }
        }
      }
    }
    function _emscripten_glGetUniformLocation(program, name) {
      name = UTF8ToString(name);
      if (program = GL.programs[program]) {
        webglPrepareUniformLocationsBeforeFirstUse(program);
        var uniformLocsById = program.uniformLocsById;
        var arrayIndex = 0;
        var uniformBaseName = name;
        var leftBrace = webglGetLeftBracePos(name);
        if (leftBrace > 0) {
          arrayIndex = jstoi_q(name.slice(leftBrace + 1)) >>> 0;
          uniformBaseName = name.slice(0, leftBrace);
        }
        var sizeAndId = program.uniformSizeAndIdsByName[uniformBaseName];
        if (sizeAndId && arrayIndex < sizeAndId[0]) {
          arrayIndex += sizeAndId[1];
          if (uniformLocsById[arrayIndex] = uniformLocsById[arrayIndex] || GLctx.getUniformLocation(program, name)) {
            return arrayIndex;
          }
        }
      } else {
        GL.recordError(1281);
      }
      return -1;
    }
    function _emscripten_glInvalidateFramebuffer(target, numAttachments, attachments) {
      var list = tempFixedLengthArray[numAttachments];
      for (var i = 0; i < numAttachments; i++) {
        list[i] = GROWABLE_HEAP_I32()[attachments + i * 4 >> 2];
      }
      GLctx["invalidateFramebuffer"](target, list);
    }
    function _emscripten_glInvalidateSubFramebuffer(target, numAttachments, attachments, x, y, width, height) {
      var list = tempFixedLengthArray[numAttachments];
      for (var i = 0; i < numAttachments; i++) {
        list[i] = GROWABLE_HEAP_I32()[attachments + i * 4 >> 2];
      }
      GLctx["invalidateSubFramebuffer"](target, list, x, y, width, height);
    }
    function _emscripten_glIsSync(sync) {
      return GLctx.isSync(GL.syncs[sync]);
    }
    function _emscripten_glIsTexture(id) {
      var texture = GL.textures[id];
      if (!texture) return 0;
      return GLctx.isTexture(texture);
    }
    function _emscripten_glLineWidth(x0) {
      GLctx["lineWidth"](x0);
    }
    function _emscripten_glLinkProgram(program) {
      program = GL.programs[program];
      GLctx.linkProgram(program);
      program.uniformLocsById = 0;
      program.uniformSizeAndIdsByName = {};
    }
    function _emscripten_glMultiDrawArraysInstancedBaseInstanceWEBGL(mode, firsts, counts, instanceCounts, baseInstances, drawCount) {
      GLctx.mdibvbi["multiDrawArraysInstancedBaseInstanceWEBGL"](mode, GROWABLE_HEAP_I32(), firsts >> 2, GROWABLE_HEAP_I32(), counts >> 2, GROWABLE_HEAP_I32(), instanceCounts >> 2, GROWABLE_HEAP_U32(), baseInstances >> 2, drawCount);
    }
    function _emscripten_glMultiDrawElementsInstancedBaseVertexBaseInstanceWEBGL(mode, counts, type, offsets, instanceCounts, baseVertices, baseInstances, drawCount) {
      GLctx.mdibvbi["multiDrawElementsInstancedBaseVertexBaseInstanceWEBGL"](mode, GROWABLE_HEAP_I32(), counts >> 2, type, GROWABLE_HEAP_I32(), offsets >> 2, GROWABLE_HEAP_I32(), instanceCounts >> 2, GROWABLE_HEAP_I32(), baseVertices >> 2, GROWABLE_HEAP_U32(), baseInstances >> 2, drawCount);
    }
    function _emscripten_glPixelStorei(pname, param) {
      if (pname == 3317) {
        GL.unpackAlignment = param;
      }
      GLctx.pixelStorei(pname, param);
    }
    function _emscripten_glReadBuffer(x0) {
      GLctx["readBuffer"](x0);
    }
    function computeUnpackAlignedImageSize(width, height, sizePerPixel, alignment) {
      function roundedToNextMultipleOf(x, y) {
        return x + y - 1 & -y;
      }
      var plainRowSize = width * sizePerPixel;
      var alignedRowSize = roundedToNextMultipleOf(plainRowSize, alignment);
      return height * alignedRowSize;
    }
    function __colorChannelsInGlTextureFormat(format) {
      var colorChannels = {
        5: 3,
        6: 4,
        8: 2,
        29502: 3,
        29504: 4,
        26917: 2,
        26918: 2,
        29846: 3,
        29847: 4
      };
      return colorChannels[format - 6402] || 1;
    }
    function heapObjectForWebGLType(type) {
      type -= 5120;
      if (type == 0) return GROWABLE_HEAP_I8();
      if (type == 1) return GROWABLE_HEAP_U8();
      if (type == 2) return GROWABLE_HEAP_I16();
      if (type == 4) return GROWABLE_HEAP_I32();
      if (type == 6) return GROWABLE_HEAP_F32();
      if (type == 5 || type == 28922 || type == 28520 || type == 30779 || type == 30782) return GROWABLE_HEAP_U32();
      return GROWABLE_HEAP_U16();
    }
    function heapAccessShiftForWebGLHeap(heap) {
      return 31 - Math.clz32(heap.BYTES_PER_ELEMENT);
    }
    function emscriptenWebGLGetTexPixelData(type, format, width, height, pixels, internalFormat) {
      var heap = heapObjectForWebGLType(type);
      var shift = heapAccessShiftForWebGLHeap(heap);
      var byteSize = 1 << shift;
      var sizePerPixel = __colorChannelsInGlTextureFormat(format) * byteSize;
      var bytes = computeUnpackAlignedImageSize(width, height, sizePerPixel, GL.unpackAlignment);
      return heap.subarray(pixels >> shift, pixels + bytes >> shift);
    }
    function _emscripten_glReadPixels(x, y, width, height, format, type, pixels) {
      if (GL.currentContext.version >= 2) {
        if (GLctx.currentPixelPackBufferBinding) {
          GLctx.readPixels(x, y, width, height, format, type, pixels);
        } else {
          var heap = heapObjectForWebGLType(type);
          GLctx.readPixels(x, y, width, height, format, type, heap, pixels >> heapAccessShiftForWebGLHeap(heap));
        }
        return;
      }
      var pixelData = emscriptenWebGLGetTexPixelData(type, format, width, height, pixels, format);
      if (!pixelData) {
        GL.recordError(1280);
        return;
      }
      GLctx.readPixels(x, y, width, height, format, type, pixelData);
    }
    function _emscripten_glRenderbufferStorage(x0, x1, x2, x3) {
      GLctx["renderbufferStorage"](x0, x1, x2, x3);
    }
    function _emscripten_glRenderbufferStorageMultisample(x0, x1, x2, x3, x4) {
      GLctx["renderbufferStorageMultisample"](x0, x1, x2, x3, x4);
    }
    function _emscripten_glSamplerParameterf(sampler, pname, param) {
      GLctx["samplerParameterf"](GL.samplers[sampler], pname, param);
    }
    function _emscripten_glSamplerParameteri(sampler, pname, param) {
      GLctx["samplerParameteri"](GL.samplers[sampler], pname, param);
    }
    function _emscripten_glSamplerParameteriv(sampler, pname, params) {
      var param = GROWABLE_HEAP_I32()[params >> 2];
      GLctx["samplerParameteri"](GL.samplers[sampler], pname, param);
    }
    function _emscripten_glScissor(x0, x1, x2, x3) {
      GLctx["scissor"](x0, x1, x2, x3);
    }
    function _emscripten_glShaderSource(shader, count, string, length) {
      var source = GL.getSource(shader, count, string, length);
      GLctx.shaderSource(GL.shaders[shader], source);
    }
    function _emscripten_glStencilFunc(x0, x1, x2) {
      GLctx["stencilFunc"](x0, x1, x2);
    }
    function _emscripten_glStencilFuncSeparate(x0, x1, x2, x3) {
      GLctx["stencilFuncSeparate"](x0, x1, x2, x3);
    }
    function _emscripten_glStencilMask(x0) {
      GLctx["stencilMask"](x0);
    }
    function _emscripten_glStencilMaskSeparate(x0, x1) {
      GLctx["stencilMaskSeparate"](x0, x1);
    }
    function _emscripten_glStencilOp(x0, x1, x2) {
      GLctx["stencilOp"](x0, x1, x2);
    }
    function _emscripten_glStencilOpSeparate(x0, x1, x2, x3) {
      GLctx["stencilOpSeparate"](x0, x1, x2, x3);
    }
    function _emscripten_glTexImage2D(target, level, internalFormat, width, height, border, format, type, pixels) {
      if (GL.currentContext.version >= 2) {
        if (GLctx.currentPixelUnpackBufferBinding) {
          GLctx.texImage2D(target, level, internalFormat, width, height, border, format, type, pixels);
        } else if (pixels) {
          var heap = heapObjectForWebGLType(type);
          GLctx.texImage2D(target, level, internalFormat, width, height, border, format, type, heap, pixels >> heapAccessShiftForWebGLHeap(heap));
        } else {
          GLctx.texImage2D(target, level, internalFormat, width, height, border, format, type, null);
        }
        return;
      }
      GLctx.texImage2D(target, level, internalFormat, width, height, border, format, type, pixels ? emscriptenWebGLGetTexPixelData(type, format, width, height, pixels, internalFormat) : null);
    }
    function _emscripten_glTexParameterf(x0, x1, x2) {
      GLctx["texParameterf"](x0, x1, x2);
    }
    function _emscripten_glTexParameterfv(target, pname, params) {
      var param = GROWABLE_HEAP_F32()[params >> 2];
      GLctx.texParameterf(target, pname, param);
    }
    function _emscripten_glTexParameteri(x0, x1, x2) {
      GLctx["texParameteri"](x0, x1, x2);
    }
    function _emscripten_glTexParameteriv(target, pname, params) {
      var param = GROWABLE_HEAP_I32()[params >> 2];
      GLctx.texParameteri(target, pname, param);
    }
    function _emscripten_glTexStorage2D(x0, x1, x2, x3, x4) {
      GLctx["texStorage2D"](x0, x1, x2, x3, x4);
    }
    function _emscripten_glTexSubImage2D(target, level, xoffset, yoffset, width, height, format, type, pixels) {
      if (GL.currentContext.version >= 2) {
        if (GLctx.currentPixelUnpackBufferBinding) {
          GLctx.texSubImage2D(target, level, xoffset, yoffset, width, height, format, type, pixels);
        } else if (pixels) {
          var heap = heapObjectForWebGLType(type);
          GLctx.texSubImage2D(target, level, xoffset, yoffset, width, height, format, type, heap, pixels >> heapAccessShiftForWebGLHeap(heap));
        } else {
          GLctx.texSubImage2D(target, level, xoffset, yoffset, width, height, format, type, null);
        }
        return;
      }
      var pixelData = null;
      if (pixels) pixelData = emscriptenWebGLGetTexPixelData(type, format, width, height, pixels, 0);
      GLctx.texSubImage2D(target, level, xoffset, yoffset, width, height, format, type, pixelData);
    }
    function webglGetUniformLocation(location) {
      var p = GLctx.currentProgram;
      if (p) {
        var webglLoc = p.uniformLocsById[location];
        if (typeof webglLoc == "number") {
          p.uniformLocsById[location] = webglLoc = GLctx.getUniformLocation(p, p.uniformArrayNamesById[location] + (webglLoc > 0 ? "[" + webglLoc + "]" : ""));
        }
        return webglLoc;
      } else {
        GL.recordError(1282);
      }
    }
    function _emscripten_glUniform1f(location, v0) {
      GLctx.uniform1f(webglGetUniformLocation(location), v0);
    }
    var miniTempWebGLFloatBuffers = [];
    function _emscripten_glUniform1fv(location, count, value) {
      if (GL.currentContext.version >= 2) {
        count && GLctx.uniform1fv(webglGetUniformLocation(location), GROWABLE_HEAP_F32(), value >> 2, count);
        return;
      }
      if (count <= 288) {
        var view = miniTempWebGLFloatBuffers[count - 1];
        for (var i = 0; i < count; ++i) {
          view[i] = GROWABLE_HEAP_F32()[value + 4 * i >> 2];
        }
      } else {
        var view = GROWABLE_HEAP_F32().subarray(value >> 2, value + count * 4 >> 2);
      }
      GLctx.uniform1fv(webglGetUniformLocation(location), view);
    }
    function _emscripten_glUniform1i(location, v0) {
      GLctx.uniform1i(webglGetUniformLocation(location), v0);
    }
    var __miniTempWebGLIntBuffers = [];
    function _emscripten_glUniform1iv(location, count, value) {
      if (GL.currentContext.version >= 2) {
        count && GLctx.uniform1iv(webglGetUniformLocation(location), GROWABLE_HEAP_I32(), value >> 2, count);
        return;
      }
      if (count <= 288) {
        var view = __miniTempWebGLIntBuffers[count - 1];
        for (var i = 0; i < count; ++i) {
          view[i] = GROWABLE_HEAP_I32()[value + 4 * i >> 2];
        }
      } else {
        var view = GROWABLE_HEAP_I32().subarray(value >> 2, value + count * 4 >> 2);
      }
      GLctx.uniform1iv(webglGetUniformLocation(location), view);
    }
    function _emscripten_glUniform2f(location, v0, v1) {
      GLctx.uniform2f(webglGetUniformLocation(location), v0, v1);
    }
    function _emscripten_glUniform2fv(location, count, value) {
      if (GL.currentContext.version >= 2) {
        count && GLctx.uniform2fv(webglGetUniformLocation(location), GROWABLE_HEAP_F32(), value >> 2, count * 2);
        return;
      }
      if (count <= 144) {
        var view = miniTempWebGLFloatBuffers[2 * count - 1];
        for (var i = 0; i < 2 * count; i += 2) {
          view[i] = GROWABLE_HEAP_F32()[value + 4 * i >> 2];
          view[i + 1] = GROWABLE_HEAP_F32()[value + (4 * i + 4) >> 2];
        }
      } else {
        var view = GROWABLE_HEAP_F32().subarray(value >> 2, value + count * 8 >> 2);
      }
      GLctx.uniform2fv(webglGetUniformLocation(location), view);
    }
    function _emscripten_glUniform2i(location, v0, v1) {
      GLctx.uniform2i(webglGetUniformLocation(location), v0, v1);
    }
    function _emscripten_glUniform2iv(location, count, value) {
      if (GL.currentContext.version >= 2) {
        count && GLctx.uniform2iv(webglGetUniformLocation(location), GROWABLE_HEAP_I32(), value >> 2, count * 2);
        return;
      }
      if (count <= 144) {
        var view = __miniTempWebGLIntBuffers[2 * count - 1];
        for (var i = 0; i < 2 * count; i += 2) {
          view[i] = GROWABLE_HEAP_I32()[value + 4 * i >> 2];
          view[i + 1] = GROWABLE_HEAP_I32()[value + (4 * i + 4) >> 2];
        }
      } else {
        var view = GROWABLE_HEAP_I32().subarray(value >> 2, value + count * 8 >> 2);
      }
      GLctx.uniform2iv(webglGetUniformLocation(location), view);
    }
    function _emscripten_glUniform3f(location, v0, v1, v2) {
      GLctx.uniform3f(webglGetUniformLocation(location), v0, v1, v2);
    }
    function _emscripten_glUniform3fv(location, count, value) {
      if (GL.currentContext.version >= 2) {
        count && GLctx.uniform3fv(webglGetUniformLocation(location), GROWABLE_HEAP_F32(), value >> 2, count * 3);
        return;
      }
      if (count <= 96) {
        var view = miniTempWebGLFloatBuffers[3 * count - 1];
        for (var i = 0; i < 3 * count; i += 3) {
          view[i] = GROWABLE_HEAP_F32()[value + 4 * i >> 2];
          view[i + 1] = GROWABLE_HEAP_F32()[value + (4 * i + 4) >> 2];
          view[i + 2] = GROWABLE_HEAP_F32()[value + (4 * i + 8) >> 2];
        }
      } else {
        var view = GROWABLE_HEAP_F32().subarray(value >> 2, value + count * 12 >> 2);
      }
      GLctx.uniform3fv(webglGetUniformLocation(location), view);
    }
    function _emscripten_glUniform3i(location, v0, v1, v2) {
      GLctx.uniform3i(webglGetUniformLocation(location), v0, v1, v2);
    }
    function _emscripten_glUniform3iv(location, count, value) {
      if (GL.currentContext.version >= 2) {
        count && GLctx.uniform3iv(webglGetUniformLocation(location), GROWABLE_HEAP_I32(), value >> 2, count * 3);
        return;
      }
      if (count <= 96) {
        var view = __miniTempWebGLIntBuffers[3 * count - 1];
        for (var i = 0; i < 3 * count; i += 3) {
          view[i] = GROWABLE_HEAP_I32()[value + 4 * i >> 2];
          view[i + 1] = GROWABLE_HEAP_I32()[value + (4 * i + 4) >> 2];
          view[i + 2] = GROWABLE_HEAP_I32()[value + (4 * i + 8) >> 2];
        }
      } else {
        var view = GROWABLE_HEAP_I32().subarray(value >> 2, value + count * 12 >> 2);
      }
      GLctx.uniform3iv(webglGetUniformLocation(location), view);
    }
    function _emscripten_glUniform4f(location, v0, v1, v2, v3) {
      GLctx.uniform4f(webglGetUniformLocation(location), v0, v1, v2, v3);
    }
    function _emscripten_glUniform4fv(location, count, value) {
      if (GL.currentContext.version >= 2) {
        count && GLctx.uniform4fv(webglGetUniformLocation(location), GROWABLE_HEAP_F32(), value >> 2, count * 4);
        return;
      }
      if (count <= 72) {
        var view = miniTempWebGLFloatBuffers[4 * count - 1];
        var heap = GROWABLE_HEAP_F32();
        value >>= 2;
        for (var i = 0; i < 4 * count; i += 4) {
          var dst = value + i;
          view[i] = heap[dst];
          view[i + 1] = heap[dst + 1];
          view[i + 2] = heap[dst + 2];
          view[i + 3] = heap[dst + 3];
        }
      } else {
        var view = GROWABLE_HEAP_F32().subarray(value >> 2, value + count * 16 >> 2);
      }
      GLctx.uniform4fv(webglGetUniformLocation(location), view);
    }
    function _emscripten_glUniform4i(location, v0, v1, v2, v3) {
      GLctx.uniform4i(webglGetUniformLocation(location), v0, v1, v2, v3);
    }
    function _emscripten_glUniform4iv(location, count, value) {
      if (GL.currentContext.version >= 2) {
        count && GLctx.uniform4iv(webglGetUniformLocation(location), GROWABLE_HEAP_I32(), value >> 2, count * 4);
        return;
      }
      if (count <= 72) {
        var view = __miniTempWebGLIntBuffers[4 * count - 1];
        for (var i = 0; i < 4 * count; i += 4) {
          view[i] = GROWABLE_HEAP_I32()[value + 4 * i >> 2];
          view[i + 1] = GROWABLE_HEAP_I32()[value + (4 * i + 4) >> 2];
          view[i + 2] = GROWABLE_HEAP_I32()[value + (4 * i + 8) >> 2];
          view[i + 3] = GROWABLE_HEAP_I32()[value + (4 * i + 12) >> 2];
        }
      } else {
        var view = GROWABLE_HEAP_I32().subarray(value >> 2, value + count * 16 >> 2);
      }
      GLctx.uniform4iv(webglGetUniformLocation(location), view);
    }
    function _emscripten_glUniformMatrix2fv(location, count, transpose, value) {
      if (GL.currentContext.version >= 2) {
        count && GLctx.uniformMatrix2fv(webglGetUniformLocation(location), !!transpose, GROWABLE_HEAP_F32(), value >> 2, count * 4);
        return;
      }
      if (count <= 72) {
        var view = miniTempWebGLFloatBuffers[4 * count - 1];
        for (var i = 0; i < 4 * count; i += 4) {
          view[i] = GROWABLE_HEAP_F32()[value + 4 * i >> 2];
          view[i + 1] = GROWABLE_HEAP_F32()[value + (4 * i + 4) >> 2];
          view[i + 2] = GROWABLE_HEAP_F32()[value + (4 * i + 8) >> 2];
          view[i + 3] = GROWABLE_HEAP_F32()[value + (4 * i + 12) >> 2];
        }
      } else {
        var view = GROWABLE_HEAP_F32().subarray(value >> 2, value + count * 16 >> 2);
      }
      GLctx.uniformMatrix2fv(webglGetUniformLocation(location), !!transpose, view);
    }
    function _emscripten_glUniformMatrix3fv(location, count, transpose, value) {
      if (GL.currentContext.version >= 2) {
        count && GLctx.uniformMatrix3fv(webglGetUniformLocation(location), !!transpose, GROWABLE_HEAP_F32(), value >> 2, count * 9);
        return;
      }
      if (count <= 32) {
        var view = miniTempWebGLFloatBuffers[9 * count - 1];
        for (var i = 0; i < 9 * count; i += 9) {
          view[i] = GROWABLE_HEAP_F32()[value + 4 * i >> 2];
          view[i + 1] = GROWABLE_HEAP_F32()[value + (4 * i + 4) >> 2];
          view[i + 2] = GROWABLE_HEAP_F32()[value + (4 * i + 8) >> 2];
          view[i + 3] = GROWABLE_HEAP_F32()[value + (4 * i + 12) >> 2];
          view[i + 4] = GROWABLE_HEAP_F32()[value + (4 * i + 16) >> 2];
          view[i + 5] = GROWABLE_HEAP_F32()[value + (4 * i + 20) >> 2];
          view[i + 6] = GROWABLE_HEAP_F32()[value + (4 * i + 24) >> 2];
          view[i + 7] = GROWABLE_HEAP_F32()[value + (4 * i + 28) >> 2];
          view[i + 8] = GROWABLE_HEAP_F32()[value + (4 * i + 32) >> 2];
        }
      } else {
        var view = GROWABLE_HEAP_F32().subarray(value >> 2, value + count * 36 >> 2);
      }
      GLctx.uniformMatrix3fv(webglGetUniformLocation(location), !!transpose, view);
    }
    function _emscripten_glUniformMatrix4fv(location, count, transpose, value) {
      if (GL.currentContext.version >= 2) {
        count && GLctx.uniformMatrix4fv(webglGetUniformLocation(location), !!transpose, GROWABLE_HEAP_F32(), value >> 2, count * 16);
        return;
      }
      if (count <= 18) {
        var view = miniTempWebGLFloatBuffers[16 * count - 1];
        var heap = GROWABLE_HEAP_F32();
        value >>= 2;
        for (var i = 0; i < 16 * count; i += 16) {
          var dst = value + i;
          view[i] = heap[dst];
          view[i + 1] = heap[dst + 1];
          view[i + 2] = heap[dst + 2];
          view[i + 3] = heap[dst + 3];
          view[i + 4] = heap[dst + 4];
          view[i + 5] = heap[dst + 5];
          view[i + 6] = heap[dst + 6];
          view[i + 7] = heap[dst + 7];
          view[i + 8] = heap[dst + 8];
          view[i + 9] = heap[dst + 9];
          view[i + 10] = heap[dst + 10];
          view[i + 11] = heap[dst + 11];
          view[i + 12] = heap[dst + 12];
          view[i + 13] = heap[dst + 13];
          view[i + 14] = heap[dst + 14];
          view[i + 15] = heap[dst + 15];
        }
      } else {
        var view = GROWABLE_HEAP_F32().subarray(value >> 2, value + count * 64 >> 2);
      }
      GLctx.uniformMatrix4fv(webglGetUniformLocation(location), !!transpose, view);
    }
    function _emscripten_glUseProgram(program) {
      program = GL.programs[program];
      GLctx.useProgram(program);
      GLctx.currentProgram = program;
    }
    function _emscripten_glVertexAttrib1f(x0, x1) {
      GLctx["vertexAttrib1f"](x0, x1);
    }
    function _emscripten_glVertexAttrib2fv(index, v) {
      GLctx.vertexAttrib2f(index, GROWABLE_HEAP_F32()[v >> 2], GROWABLE_HEAP_F32()[v + 4 >> 2]);
    }
    function _emscripten_glVertexAttrib3fv(index, v) {
      GLctx.vertexAttrib3f(index, GROWABLE_HEAP_F32()[v >> 2], GROWABLE_HEAP_F32()[v + 4 >> 2], GROWABLE_HEAP_F32()[v + 8 >> 2]);
    }
    function _emscripten_glVertexAttrib4fv(index, v) {
      GLctx.vertexAttrib4f(index, GROWABLE_HEAP_F32()[v >> 2], GROWABLE_HEAP_F32()[v + 4 >> 2], GROWABLE_HEAP_F32()[v + 8 >> 2], GROWABLE_HEAP_F32()[v + 12 >> 2]);
    }
    function _emscripten_glVertexAttribDivisor(index, divisor) {
      GLctx["vertexAttribDivisor"](index, divisor);
    }
    function _emscripten_glVertexAttribIPointer(index, size, type, stride, ptr) {
      GLctx["vertexAttribIPointer"](index, size, type, stride, ptr);
    }
    function _emscripten_glVertexAttribPointer(index, size, type, normalized, stride, ptr) {
      GLctx.vertexAttribPointer(index, size, type, !!normalized, stride, ptr);
    }
    function _emscripten_glViewport(x0, x1, x2, x3) {
      GLctx["viewport"](x0, x1, x2, x3);
    }
    function _emscripten_glWaitSync(sync, flags, timeout_low, timeout_high) {
      var timeout = convertI32PairToI53(timeout_low, timeout_high);
      GLctx.waitSync(GL.syncs[sync], flags, timeout);
    }
    function _emscripten_proxy_to_main_thread_js(index, sync) {
      var numCallArgs = arguments.length - 2;
      var outerArgs = arguments;
      return withStackSave(() => {
        var serializedNumCallArgs = numCallArgs;
        var args = stackAlloc(serializedNumCallArgs * 8);
        var b = args >> 3;
        for (var i = 0; i < numCallArgs; i++) {
          var arg = outerArgs[2 + i];
          GROWABLE_HEAP_F64()[b + i] = arg;
        }
        return __emscripten_run_in_main_runtime_thread_js(index, serializedNumCallArgs, args, sync);
      });
    }
    var _emscripten_receive_on_main_thread_js_callArgs = [];
    function _emscripten_receive_on_main_thread_js(index, numCallArgs, args) {
      _emscripten_receive_on_main_thread_js_callArgs.length = numCallArgs;
      var b = args >> 3;
      for (var i = 0; i < numCallArgs; i++) {
        _emscripten_receive_on_main_thread_js_callArgs[i] = GROWABLE_HEAP_F64()[b + i];
      }
      var func = proxiedFunctionTable[index];
      return func.apply(null, _emscripten_receive_on_main_thread_js_callArgs);
    }
    function getHeapMax() {
      return 2147483648;
    }
    function emscripten_realloc_buffer(size) {
      var b = wasmMemory.buffer;
      try {
        wasmMemory.grow(size - b.byteLength + 65535 >>> 16);
        updateMemoryViews();
        return 1;
      } catch (e) {}
    }
    function _emscripten_resize_heap(requestedSize) {
      var oldSize = GROWABLE_HEAP_U8().length;
      requestedSize = requestedSize >>> 0;
      if (requestedSize <= oldSize) {
        return false;
      }
      var maxHeapSize = getHeapMax();
      if (requestedSize > maxHeapSize) {
        return false;
      }
      let alignUp = (x, multiple) => x + (multiple - x % multiple) % multiple;
      for (var cutDown = 1; cutDown <= 4; cutDown *= 2) {
        var overGrownHeapSize = oldSize * (1 + .2 / cutDown);
        overGrownHeapSize = Math.min(overGrownHeapSize, requestedSize + 100663296);
        var newSize = Math.min(maxHeapSize, alignUp(Math.max(requestedSize, overGrownHeapSize), 65536));
        var replacement = emscripten_realloc_buffer(newSize);
        if (replacement) {
          return true;
        }
      }
      return false;
    }
    function _emscripten_unwind_to_js_event_loop() {
      throw "unwind";
    }
    var __emscripten_webgl_power_preferences = ["default", "low-power", "high-performance"];
    function _emscripten_webgl_do_create_context(target, attributes) {
      var a = attributes >> 2;
      var powerPreference = GROWABLE_HEAP_I32()[a + (24 >> 2)];
      var contextAttributes = {
        "alpha": !!GROWABLE_HEAP_I32()[a + (0 >> 2)],
        "depth": !!GROWABLE_HEAP_I32()[a + (4 >> 2)],
        "stencil": !!GROWABLE_HEAP_I32()[a + (8 >> 2)],
        "antialias": !!GROWABLE_HEAP_I32()[a + (12 >> 2)],
        "premultipliedAlpha": !!GROWABLE_HEAP_I32()[a + (16 >> 2)],
        "preserveDrawingBuffer": !!GROWABLE_HEAP_I32()[a + (20 >> 2)],
        "powerPreference": __emscripten_webgl_power_preferences[powerPreference],
        "failIfMajorPerformanceCaveat": !!GROWABLE_HEAP_I32()[a + (28 >> 2)],
        majorVersion: GROWABLE_HEAP_I32()[a + (32 >> 2)],
        minorVersion: GROWABLE_HEAP_I32()[a + (36 >> 2)],
        enableExtensionsByDefault: GROWABLE_HEAP_I32()[a + (40 >> 2)],
        explicitSwapControl: GROWABLE_HEAP_I32()[a + (44 >> 2)],
        proxyContextToMainThread: GROWABLE_HEAP_I32()[a + (48 >> 2)],
        renderViaOffscreenBackBuffer: GROWABLE_HEAP_I32()[a + (52 >> 2)]
      };
      var canvas = findCanvasEventTarget(target);
      if (!canvas) {
        return 0;
      }
      if (canvas.offscreenCanvas) canvas = canvas.offscreenCanvas;
      if (contextAttributes.explicitSwapControl) {
        var supportsOffscreenCanvas = canvas.transferControlToOffscreen || typeof OffscreenCanvas != "undefined" && canvas instanceof OffscreenCanvas;
        if (!supportsOffscreenCanvas) {
          return 0;
        }
        if (canvas.transferControlToOffscreen) {
          if (!canvas.controlTransferredOffscreen) {
            GL.offscreenCanvases[canvas.id] = {
              canvas: canvas.transferControlToOffscreen(),
              canvasSharedPtr: _malloc(12),
              id: canvas.id
            };
            canvas.controlTransferredOffscreen = true;
          } else if (!GL.offscreenCanvases[canvas.id]) {
            return 0;
          }
          canvas = GL.offscreenCanvases[canvas.id];
        }
      }
      var contextHandle = GL.createContext(canvas, contextAttributes);
      return contextHandle;
    }
    var _emscripten_webgl_create_context = _emscripten_webgl_do_create_context;
    function _emscripten_webgl_do_get_current_context() {
      return GL.currentContext ? GL.currentContext.handle : 0;
    }
    var _emscripten_webgl_get_current_context = _emscripten_webgl_do_get_current_context;
    function _emscripten_webgl_init_context_attributes(attributes) {
      var a = attributes >> 2;
      for (var i = 0; i < 56 >> 2; ++i) {
        GROWABLE_HEAP_I32()[a + i] = 0;
      }
      GROWABLE_HEAP_I32()[a + (0 >> 2)] = GROWABLE_HEAP_I32()[a + (4 >> 2)] = GROWABLE_HEAP_I32()[a + (12 >> 2)] = GROWABLE_HEAP_I32()[a + (16 >> 2)] = GROWABLE_HEAP_I32()[a + (32 >> 2)] = GROWABLE_HEAP_I32()[a + (40 >> 2)] = 1;
      if (ENVIRONMENT_IS_WORKER) GROWABLE_HEAP_I32()[attributes + 48 >> 2] = 1;
    }
    function _emscripten_webgl_make_context_current(contextHandle) {
      var success = GL.makeContextCurrent(contextHandle);
      return success ? 0 : -5;
    }
    var ENV = {};
    function getExecutableName() {
      return thisProgram || "./this.program";
    }
    function getEnvStrings() {
      if (!getEnvStrings.strings) {
        var lang = (typeof navigator == "object" && navigator.languages && navigator.languages[0] || "C").replace("-", "_") + ".UTF-8";
        var env = {
          "USER": "web_user",
          "LOGNAME": "web_user",
          "PATH": "/",
          "PWD": "/",
          "HOME": "/home/web_user",
          "LANG": lang,
          "_": getExecutableName()
        };
        for (var x in ENV) {
          if (ENV[x] === undefined) delete env[x];else env[x] = ENV[x];
        }
        var strings = [];
        for (var x in env) {
          strings.push(x + "=" + env[x]);
        }
        getEnvStrings.strings = strings;
      }
      return getEnvStrings.strings;
    }
    function writeAsciiToMemory(str, buffer, dontAddNull) {
      for (var i = 0; i < str.length; ++i) {
        GROWABLE_HEAP_I8()[buffer++ >> 0] = str.charCodeAt(i);
      }
      if (!dontAddNull) GROWABLE_HEAP_I8()[buffer >> 0] = 0;
    }
    function _environ_get(__environ, environ_buf) {
      if (ENVIRONMENT_IS_PTHREAD) return _emscripten_proxy_to_main_thread_js(11, 1, __environ, environ_buf);
      var bufSize = 0;
      getEnvStrings().forEach(function (string, i) {
        var ptr = environ_buf + bufSize;
        GROWABLE_HEAP_U32()[__environ + i * 4 >> 2] = ptr;
        writeAsciiToMemory(string, ptr);
        bufSize += string.length + 1;
      });
      return 0;
    }
    function _environ_sizes_get(penviron_count, penviron_buf_size) {
      if (ENVIRONMENT_IS_PTHREAD) return _emscripten_proxy_to_main_thread_js(12, 1, penviron_count, penviron_buf_size);
      var strings = getEnvStrings();
      GROWABLE_HEAP_U32()[penviron_count >> 2] = strings.length;
      var bufSize = 0;
      strings.forEach(function (string) {
        bufSize += string.length + 1;
      });
      GROWABLE_HEAP_U32()[penviron_buf_size >> 2] = bufSize;
      return 0;
    }
    function _fd_close(fd) {
      if (ENVIRONMENT_IS_PTHREAD) return _emscripten_proxy_to_main_thread_js(13, 1, fd);
      return 52;
    }
    function _fd_pread(fd, iov, iovcnt, offset_low, offset_high, pnum) {
      if (ENVIRONMENT_IS_PTHREAD) return _emscripten_proxy_to_main_thread_js(14, 1, fd, iov, iovcnt, offset_low, offset_high, pnum);
      return 52;
    }
    function _fd_read(fd, iov, iovcnt, pnum) {
      if (ENVIRONMENT_IS_PTHREAD) return _emscripten_proxy_to_main_thread_js(15, 1, fd, iov, iovcnt, pnum);
      return 52;
    }
    function _fd_seek(fd, offset_low, offset_high, whence, newOffset) {
      if (ENVIRONMENT_IS_PTHREAD) return _emscripten_proxy_to_main_thread_js(16, 1, fd, offset_low, offset_high, whence, newOffset);
      return 70;
    }
    var printCharBuffers = [null, [], []];
    function printChar(stream, curr) {
      var buffer = printCharBuffers[stream];
      if (curr === 0 || curr === 10) {
        (stream === 1 ? out : err)(UTF8ArrayToString(buffer, 0));
        buffer.length = 0;
      } else {
        buffer.push(curr);
      }
    }
    function _fd_write(fd, iov, iovcnt, pnum) {
      if (ENVIRONMENT_IS_PTHREAD) return _emscripten_proxy_to_main_thread_js(17, 1, fd, iov, iovcnt, pnum);
      var num = 0;
      for (var i = 0; i < iovcnt; i++) {
        var ptr = GROWABLE_HEAP_U32()[iov >> 2];
        var len = GROWABLE_HEAP_U32()[iov + 4 >> 2];
        iov += 8;
        for (var j = 0; j < len; j++) {
          printChar(fd, GROWABLE_HEAP_U8()[ptr + j]);
        }
        num += len;
      }
      GROWABLE_HEAP_U32()[pnum >> 2] = num;
      return 0;
    }
    function _glDeleteTextures(n, textures) {
      for (var i = 0; i < n; i++) {
        var id = GROWABLE_HEAP_I32()[textures + i * 4 >> 2];
        var texture = GL.textures[id];
        if (!texture) continue;
        GLctx.deleteTexture(texture);
        texture.name = 0;
        GL.textures[id] = null;
      }
    }
    function skwasm_support_setup() {
      const objectMap = new Map();
      skwasm_registerObject = function (id, object) {
        objectMap.set(id, object);
      };
      skwasm_unregisterObject = function (id) {
        objectMap.delete(id);
      };
      skwasm_getObject = function (id) {
        return objectMap.get(id);
      };
      addEventListener("message", function (event) {
        const transfers = event.data.skwasmObjectTransfers;
        if (!transfers) {
          return;
        }
        transfers.forEach(function (object, objectId) {
          objectMap.set(objectId, object);
        });
      });
      skwasm_transferObjectToMain = function (objectId) {
        postMessage({
          skwasmObjectTransfers: new Map([[objectId, objectMap[objectId]]])
        });
        objectMap.delete(objectId);
      };
      skwasm_transferObjectToThread = function (objectId, threadId) {
        PThread.pthreads[threadId].postMessage({
          skwasmObjectTransfers: new Map([[objectId, objectMap.get(objectId)]])
        });
        objectMap.delete(objectId);
      };
      _skwasm_createGlTextureFromVideoFrame = function (videoFrameId, width, height) {
        const videoFrame = skwasm_getObject(videoFrameId);
        const glCtx = GL.currentContext.GLctx;
        const newTexture = glCtx.createTexture();
        glCtx.bindTexture(glCtx.TEXTURE_2D, newTexture);
        glCtx.pixelStorei(glCtx.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true);
        glCtx.texImage2D(glCtx.TEXTURE_2D, 0, glCtx.RGBA, width, height, 0, glCtx.RGBA, glCtx.UNSIGNED_BYTE, videoFrame);
        glCtx.pixelStorei(glCtx.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false);
        glCtx.bindTexture(glCtx.TEXTURE_2D, null);
        const textureId = GL.getNewId(GL.textures);
        GL.textures[textureId] = newTexture;
        return textureId;
      }, _skwasm_disposeVideoFrame = function (videoFrameId) {
        const videoFrame = skwasm_getObject(videoFrameId);
        videoFrame.close();
        skwasm_unregisterObject(videoFrameId);
      };
    }
    function skwasm_getObject() {}
    function _skwasm_createGlTextureFromVideoFrame() {}
    function skwasm_unregisterObject() {}
    function _skwasm_disposeVideoFrame() {}
    function __isLeapYear(year) {
      return year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
    }
    function __arraySum(array, index) {
      var sum = 0;
      for (var i = 0; i <= index; sum += array[i++]) {}
      return sum;
    }
    var __MONTH_DAYS_LEAP = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    var __MONTH_DAYS_REGULAR = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    function __addDays(date, days) {
      var newDate = new Date(date.getTime());
      while (days > 0) {
        var leap = __isLeapYear(newDate.getFullYear());
        var currentMonth = newDate.getMonth();
        var daysInCurrentMonth = (leap ? __MONTH_DAYS_LEAP : __MONTH_DAYS_REGULAR)[currentMonth];
        if (days > daysInCurrentMonth - newDate.getDate()) {
          days -= daysInCurrentMonth - newDate.getDate() + 1;
          newDate.setDate(1);
          if (currentMonth < 11) {
            newDate.setMonth(currentMonth + 1);
          } else {
            newDate.setMonth(0);
            newDate.setFullYear(newDate.getFullYear() + 1);
          }
        } else {
          newDate.setDate(newDate.getDate() + days);
          return newDate;
        }
      }
      return newDate;
    }
    function intArrayFromString(stringy, dontAddNull, length) {
      var len = length > 0 ? length : lengthBytesUTF8(stringy) + 1;
      var u8array = new Array(len);
      var numBytesWritten = stringToUTF8Array(stringy, u8array, 0, u8array.length);
      if (dontAddNull) u8array.length = numBytesWritten;
      return u8array;
    }
    function writeArrayToMemory(array, buffer) {
      GROWABLE_HEAP_I8().set(array, buffer);
    }
    function _strftime(s, maxsize, format, tm) {
      var tm_zone = GROWABLE_HEAP_I32()[tm + 40 >> 2];
      var date = {
        tm_sec: GROWABLE_HEAP_I32()[tm >> 2],
        tm_min: GROWABLE_HEAP_I32()[tm + 4 >> 2],
        tm_hour: GROWABLE_HEAP_I32()[tm + 8 >> 2],
        tm_mday: GROWABLE_HEAP_I32()[tm + 12 >> 2],
        tm_mon: GROWABLE_HEAP_I32()[tm + 16 >> 2],
        tm_year: GROWABLE_HEAP_I32()[tm + 20 >> 2],
        tm_wday: GROWABLE_HEAP_I32()[tm + 24 >> 2],
        tm_yday: GROWABLE_HEAP_I32()[tm + 28 >> 2],
        tm_isdst: GROWABLE_HEAP_I32()[tm + 32 >> 2],
        tm_gmtoff: GROWABLE_HEAP_I32()[tm + 36 >> 2],
        tm_zone: tm_zone ? UTF8ToString(tm_zone) : ""
      };
      var pattern = UTF8ToString(format);
      var EXPANSION_RULES_1 = {
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
      for (var rule in EXPANSION_RULES_1) {
        pattern = pattern.replace(new RegExp(rule, "g"), EXPANSION_RULES_1[rule]);
      }
      var WEEKDAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
      var MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
      function leadingSomething(value, digits, character) {
        var str = typeof value == "number" ? value.toString() : value || "";
        while (str.length < digits) {
          str = character[0] + str;
        }
        return str;
      }
      function leadingNulls(value, digits) {
        return leadingSomething(value, digits, "0");
      }
      function compareByDay(date1, date2) {
        function sgn(value) {
          return value < 0 ? -1 : value > 0 ? 1 : 0;
        }
        var compare;
        if ((compare = sgn(date1.getFullYear() - date2.getFullYear())) === 0) {
          if ((compare = sgn(date1.getMonth() - date2.getMonth())) === 0) {
            compare = sgn(date1.getDate() - date2.getDate());
          }
        }
        return compare;
      }
      function getFirstWeekStartDate(janFourth) {
        switch (janFourth.getDay()) {
          case 0:
            return new Date(janFourth.getFullYear() - 1, 11, 29);
          case 1:
            return janFourth;
          case 2:
            return new Date(janFourth.getFullYear(), 0, 3);
          case 3:
            return new Date(janFourth.getFullYear(), 0, 2);
          case 4:
            return new Date(janFourth.getFullYear(), 0, 1);
          case 5:
            return new Date(janFourth.getFullYear() - 1, 11, 31);
          case 6:
            return new Date(janFourth.getFullYear() - 1, 11, 30);
        }
      }
      function getWeekBasedYear(date) {
        var thisDate = __addDays(new Date(date.tm_year + 1900, 0, 1), date.tm_yday);
        var janFourthThisYear = new Date(thisDate.getFullYear(), 0, 4);
        var janFourthNextYear = new Date(thisDate.getFullYear() + 1, 0, 4);
        var firstWeekStartThisYear = getFirstWeekStartDate(janFourthThisYear);
        var firstWeekStartNextYear = getFirstWeekStartDate(janFourthNextYear);
        if (compareByDay(firstWeekStartThisYear, thisDate) <= 0) {
          if (compareByDay(firstWeekStartNextYear, thisDate) <= 0) {
            return thisDate.getFullYear() + 1;
          }
          return thisDate.getFullYear();
        }
        return thisDate.getFullYear() - 1;
      }
      var EXPANSION_RULES_2 = {
        "%a": function (date) {
          return WEEKDAYS[date.tm_wday].substring(0, 3);
        },
        "%A": function (date) {
          return WEEKDAYS[date.tm_wday];
        },
        "%b": function (date) {
          return MONTHS[date.tm_mon].substring(0, 3);
        },
        "%B": function (date) {
          return MONTHS[date.tm_mon];
        },
        "%C": function (date) {
          var year = date.tm_year + 1900;
          return leadingNulls(year / 100 | 0, 2);
        },
        "%d": function (date) {
          return leadingNulls(date.tm_mday, 2);
        },
        "%e": function (date) {
          return leadingSomething(date.tm_mday, 2, " ");
        },
        "%g": function (date) {
          return getWeekBasedYear(date).toString().substring(2);
        },
        "%G": function (date) {
          return getWeekBasedYear(date);
        },
        "%H": function (date) {
          return leadingNulls(date.tm_hour, 2);
        },
        "%I": function (date) {
          var twelveHour = date.tm_hour;
          if (twelveHour == 0) twelveHour = 12;else if (twelveHour > 12) twelveHour -= 12;
          return leadingNulls(twelveHour, 2);
        },
        "%j": function (date) {
          return leadingNulls(date.tm_mday + __arraySum(__isLeapYear(date.tm_year + 1900) ? __MONTH_DAYS_LEAP : __MONTH_DAYS_REGULAR, date.tm_mon - 1), 3);
        },
        "%m": function (date) {
          return leadingNulls(date.tm_mon + 1, 2);
        },
        "%M": function (date) {
          return leadingNulls(date.tm_min, 2);
        },
        "%n": function () {
          return "\n";
        },
        "%p": function (date) {
          if (date.tm_hour >= 0 && date.tm_hour < 12) {
            return "AM";
          }
          return "PM";
        },
        "%S": function (date) {
          return leadingNulls(date.tm_sec, 2);
        },
        "%t": function () {
          return "\t";
        },
        "%u": function (date) {
          return date.tm_wday || 7;
        },
        "%U": function (date) {
          var days = date.tm_yday + 7 - date.tm_wday;
          return leadingNulls(Math.floor(days / 7), 2);
        },
        "%V": function (date) {
          var val = Math.floor((date.tm_yday + 7 - (date.tm_wday + 6) % 7) / 7);
          if ((date.tm_wday + 371 - date.tm_yday - 2) % 7 <= 2) {
            val++;
          }
          if (!val) {
            val = 52;
            var dec31 = (date.tm_wday + 7 - date.tm_yday - 1) % 7;
            if (dec31 == 4 || dec31 == 5 && __isLeapYear(date.tm_year % 400 - 1)) {
              val++;
            }
          } else if (val == 53) {
            var jan1 = (date.tm_wday + 371 - date.tm_yday) % 7;
            if (jan1 != 4 && (jan1 != 3 || !__isLeapYear(date.tm_year))) val = 1;
          }
          return leadingNulls(val, 2);
        },
        "%w": function (date) {
          return date.tm_wday;
        },
        "%W": function (date) {
          var days = date.tm_yday + 7 - (date.tm_wday + 6) % 7;
          return leadingNulls(Math.floor(days / 7), 2);
        },
        "%y": function (date) {
          return (date.tm_year + 1900).toString().substring(2);
        },
        "%Y": function (date) {
          return date.tm_year + 1900;
        },
        "%z": function (date) {
          var off = date.tm_gmtoff;
          var ahead = off >= 0;
          off = Math.abs(off) / 60;
          off = off / 60 * 100 + off % 60;
          return (ahead ? "+" : "-") + String("0000" + off).slice(-4);
        },
        "%Z": function (date) {
          return date.tm_zone;
        },
        "%%": function () {
          return "%";
        }
      };
      pattern = pattern.replace(/%%/g, "\0\0");
      for (var rule in EXPANSION_RULES_2) {
        if (pattern.includes(rule)) {
          pattern = pattern.replace(new RegExp(rule, "g"), EXPANSION_RULES_2[rule](date));
        }
      }
      pattern = pattern.replace(/\0\0/g, "%");
      var bytes = intArrayFromString(pattern, false);
      if (bytes.length > maxsize) {
        return 0;
      }
      writeArrayToMemory(bytes, s);
      return bytes.length - 1;
    }
    function _strftime_l(s, maxsize, format, tm, loc) {
      return _strftime(s, maxsize, format, tm);
    }
    function uleb128Encode(n, target) {
      if (n < 128) {
        target.push(n);
      } else {
        target.push(n % 128 | 128, n >> 7);
      }
    }
    function sigToWasmTypes(sig) {
      var typeNames = {
        "i": "i32",
        "j": "i32",
        "f": "f32",
        "d": "f64",
        "p": "i32"
      };
      var type = {
        parameters: [],
        results: sig[0] == "v" ? [] : [typeNames[sig[0]]]
      };
      for (var i = 1; i < sig.length; ++i) {
        type.parameters.push(typeNames[sig[i]]);
        if (sig[i] === "j") {
          type.parameters.push("i32");
        }
      }
      return type;
    }
    function generateFuncType(sig, target) {
      var sigRet = sig.slice(0, 1);
      var sigParam = sig.slice(1);
      var typeCodes = {
        "i": 127,
        "p": 127,
        "j": 126,
        "f": 125,
        "d": 124
      };
      target.push(96);
      uleb128Encode(sigParam.length, target);
      for (var i = 0; i < sigParam.length; ++i) {
        target.push(typeCodes[sigParam[i]]);
      }
      if (sigRet == "v") {
        target.push(0);
      } else {
        target.push(1, typeCodes[sigRet]);
      }
    }
    function convertJsFunctionToWasm(func, sig) {
      if (typeof WebAssembly.Function == "function") {
        return new WebAssembly.Function(sigToWasmTypes(sig), func);
      }
      var typeSectionBody = [1];
      generateFuncType(sig, typeSectionBody);
      var bytes = [0, 97, 115, 109, 1, 0, 0, 0, 1];
      uleb128Encode(typeSectionBody.length, bytes);
      bytes.push.apply(bytes, typeSectionBody);
      bytes.push(2, 7, 1, 1, 101, 1, 102, 0, 0, 7, 5, 1, 1, 102, 0, 0);
      var module = new WebAssembly.Module(new Uint8Array(bytes));
      var instance = new WebAssembly.Instance(module, {
        "e": {
          "f": func
        }
      });
      var wrappedFunc = instance.exports["f"];
      return wrappedFunc;
    }
    function updateTableMap(offset, count) {
      if (functionsInTableMap) {
        for (var i = offset; i < offset + count; i++) {
          var item = getWasmTableEntry(i);
          if (item) {
            functionsInTableMap.set(item, i);
          }
        }
      }
    }
    var functionsInTableMap = undefined;
    function getFunctionAddress(func) {
      if (!functionsInTableMap) {
        functionsInTableMap = new WeakMap();
        updateTableMap(0, wasmTable.length);
      }
      return functionsInTableMap.get(func) || 0;
    }
    var freeTableIndexes = [];
    function getEmptyTableSlot() {
      if (freeTableIndexes.length) {
        return freeTableIndexes.pop();
      }
      try {
        wasmTable.grow(1);
      } catch (err) {
        if (!(err instanceof RangeError)) {
          throw err;
        }
        throw "Unable to grow wasm table. Set ALLOW_TABLE_GROWTH.";
      }
      return wasmTable.length - 1;
    }
    function setWasmTableEntry(idx, func) {
      wasmTable.set(idx, func);
    }
    function addFunction(func, sig) {
      var rtn = getFunctionAddress(func);
      if (rtn) {
        return rtn;
      }
      var ret = getEmptyTableSlot();
      try {
        setWasmTableEntry(ret, func);
      } catch (err) {
        if (!(err instanceof TypeError)) {
          throw err;
        }
        var wrapped = convertJsFunctionToWasm(func, sig);
        setWasmTableEntry(ret, wrapped);
      }
      functionsInTableMap.set(func, ret);
      return ret;
    }
    function removeFunction(index) {
      functionsInTableMap.delete(getWasmTableEntry(index));
      freeTableIndexes.push(index);
    }
    function skwasm_registerObject() {}
    function skwasm_transferObjectToThread() {}
    PThread.init();
    var GLctx;
    for (var i = 0; i < 32; ++i) tempFixedLengthArray.push(new Array(i));
    var miniTempWebGLFloatBuffersStorage = new Float32Array(288);
    for (var i = 0; i < 288; ++i) {
      miniTempWebGLFloatBuffers[i] = miniTempWebGLFloatBuffersStorage.subarray(0, i + 1);
    }
    var __miniTempWebGLIntBuffersStorage = new Int32Array(288);
    for (var i = 0; i < 288; ++i) {
      __miniTempWebGLIntBuffers[i] = __miniTempWebGLIntBuffersStorage.subarray(0, i + 1);
    }
    skwasm_support_setup();
    var proxiedFunctionTable = [null, _proc_exit, exitOnMainThread, pthreadCreateProxied, ___syscall_fcntl64, ___syscall_fstat64, ___syscall_ioctl, ___syscall_openat, _emscripten_set_canvas_element_size_main_thread, __mmap_js, __munmap_js, _environ_get, _environ_sizes_get, _fd_close, _fd_pread, _fd_read, _fd_seek, _fd_write];
    var wasmImports = {
      "__cxa_throw": ___cxa_throw,
      "__emscripten_init_main_thread_js": ___emscripten_init_main_thread_js,
      "__emscripten_thread_cleanup": ___emscripten_thread_cleanup,
      "__pthread_create_js": ___pthread_create_js,
      "__syscall_fcntl64": ___syscall_fcntl64,
      "__syscall_fstat64": ___syscall_fstat64,
      "__syscall_ioctl": ___syscall_ioctl,
      "__syscall_openat": ___syscall_openat,
      "_emscripten_default_pthread_stack_size": __emscripten_default_pthread_stack_size,
      "_emscripten_get_now_is_monotonic": __emscripten_get_now_is_monotonic,
      "_emscripten_notify_task_queue": __emscripten_notify_task_queue,
      "_emscripten_set_offscreencanvas_size": __emscripten_set_offscreencanvas_size,
      "_emscripten_throw_longjmp": __emscripten_throw_longjmp,
      "_mmap_js": __mmap_js,
      "_munmap_js": __munmap_js,
      "abort": _abort,
      "emscripten_check_blocking_allowed": _emscripten_check_blocking_allowed,
      "emscripten_get_now": _emscripten_get_now,
      "emscripten_glActiveTexture": _emscripten_glActiveTexture,
      "emscripten_glAttachShader": _emscripten_glAttachShader,
      "emscripten_glBindAttribLocation": _emscripten_glBindAttribLocation,
      "emscripten_glBindBuffer": _emscripten_glBindBuffer,
      "emscripten_glBindFramebuffer": _emscripten_glBindFramebuffer,
      "emscripten_glBindRenderbuffer": _emscripten_glBindRenderbuffer,
      "emscripten_glBindSampler": _emscripten_glBindSampler,
      "emscripten_glBindTexture": _emscripten_glBindTexture,
      "emscripten_glBindVertexArray": _emscripten_glBindVertexArray,
      "emscripten_glBindVertexArrayOES": _emscripten_glBindVertexArrayOES,
      "emscripten_glBlendColor": _emscripten_glBlendColor,
      "emscripten_glBlendEquation": _emscripten_glBlendEquation,
      "emscripten_glBlendFunc": _emscripten_glBlendFunc,
      "emscripten_glBlitFramebuffer": _emscripten_glBlitFramebuffer,
      "emscripten_glBufferData": _emscripten_glBufferData,
      "emscripten_glBufferSubData": _emscripten_glBufferSubData,
      "emscripten_glCheckFramebufferStatus": _emscripten_glCheckFramebufferStatus,
      "emscripten_glClear": _emscripten_glClear,
      "emscripten_glClearColor": _emscripten_glClearColor,
      "emscripten_glClearStencil": _emscripten_glClearStencil,
      "emscripten_glClientWaitSync": _emscripten_glClientWaitSync,
      "emscripten_glColorMask": _emscripten_glColorMask,
      "emscripten_glCompileShader": _emscripten_glCompileShader,
      "emscripten_glCompressedTexImage2D": _emscripten_glCompressedTexImage2D,
      "emscripten_glCompressedTexSubImage2D": _emscripten_glCompressedTexSubImage2D,
      "emscripten_glCopyBufferSubData": _emscripten_glCopyBufferSubData,
      "emscripten_glCopyTexSubImage2D": _emscripten_glCopyTexSubImage2D,
      "emscripten_glCreateProgram": _emscripten_glCreateProgram,
      "emscripten_glCreateShader": _emscripten_glCreateShader,
      "emscripten_glCullFace": _emscripten_glCullFace,
      "emscripten_glDeleteBuffers": _emscripten_glDeleteBuffers,
      "emscripten_glDeleteFramebuffers": _emscripten_glDeleteFramebuffers,
      "emscripten_glDeleteProgram": _emscripten_glDeleteProgram,
      "emscripten_glDeleteRenderbuffers": _emscripten_glDeleteRenderbuffers,
      "emscripten_glDeleteSamplers": _emscripten_glDeleteSamplers,
      "emscripten_glDeleteShader": _emscripten_glDeleteShader,
      "emscripten_glDeleteSync": _emscripten_glDeleteSync,
      "emscripten_glDeleteTextures": _emscripten_glDeleteTextures,
      "emscripten_glDeleteVertexArrays": _emscripten_glDeleteVertexArrays,
      "emscripten_glDeleteVertexArraysOES": _emscripten_glDeleteVertexArraysOES,
      "emscripten_glDepthMask": _emscripten_glDepthMask,
      "emscripten_glDisable": _emscripten_glDisable,
      "emscripten_glDisableVertexAttribArray": _emscripten_glDisableVertexAttribArray,
      "emscripten_glDrawArrays": _emscripten_glDrawArrays,
      "emscripten_glDrawArraysInstanced": _emscripten_glDrawArraysInstanced,
      "emscripten_glDrawArraysInstancedBaseInstanceWEBGL": _emscripten_glDrawArraysInstancedBaseInstanceWEBGL,
      "emscripten_glDrawBuffers": _emscripten_glDrawBuffers,
      "emscripten_glDrawElements": _emscripten_glDrawElements,
      "emscripten_glDrawElementsInstanced": _emscripten_glDrawElementsInstanced,
      "emscripten_glDrawElementsInstancedBaseVertexBaseInstanceWEBGL": _emscripten_glDrawElementsInstancedBaseVertexBaseInstanceWEBGL,
      "emscripten_glDrawRangeElements": _emscripten_glDrawRangeElements,
      "emscripten_glEnable": _emscripten_glEnable,
      "emscripten_glEnableVertexAttribArray": _emscripten_glEnableVertexAttribArray,
      "emscripten_glFenceSync": _emscripten_glFenceSync,
      "emscripten_glFinish": _emscripten_glFinish,
      "emscripten_glFlush": _emscripten_glFlush,
      "emscripten_glFramebufferRenderbuffer": _emscripten_glFramebufferRenderbuffer,
      "emscripten_glFramebufferTexture2D": _emscripten_glFramebufferTexture2D,
      "emscripten_glFrontFace": _emscripten_glFrontFace,
      "emscripten_glGenBuffers": _emscripten_glGenBuffers,
      "emscripten_glGenFramebuffers": _emscripten_glGenFramebuffers,
      "emscripten_glGenRenderbuffers": _emscripten_glGenRenderbuffers,
      "emscripten_glGenSamplers": _emscripten_glGenSamplers,
      "emscripten_glGenTextures": _emscripten_glGenTextures,
      "emscripten_glGenVertexArrays": _emscripten_glGenVertexArrays,
      "emscripten_glGenVertexArraysOES": _emscripten_glGenVertexArraysOES,
      "emscripten_glGenerateMipmap": _emscripten_glGenerateMipmap,
      "emscripten_glGetBufferParameteriv": _emscripten_glGetBufferParameteriv,
      "emscripten_glGetError": _emscripten_glGetError,
      "emscripten_glGetFloatv": _emscripten_glGetFloatv,
      "emscripten_glGetFramebufferAttachmentParameteriv": _emscripten_glGetFramebufferAttachmentParameteriv,
      "emscripten_glGetIntegerv": _emscripten_glGetIntegerv,
      "emscripten_glGetProgramInfoLog": _emscripten_glGetProgramInfoLog,
      "emscripten_glGetProgramiv": _emscripten_glGetProgramiv,
      "emscripten_glGetRenderbufferParameteriv": _emscripten_glGetRenderbufferParameteriv,
      "emscripten_glGetShaderInfoLog": _emscripten_glGetShaderInfoLog,
      "emscripten_glGetShaderPrecisionFormat": _emscripten_glGetShaderPrecisionFormat,
      "emscripten_glGetShaderiv": _emscripten_glGetShaderiv,
      "emscripten_glGetString": _emscripten_glGetString,
      "emscripten_glGetStringi": _emscripten_glGetStringi,
      "emscripten_glGetUniformLocation": _emscripten_glGetUniformLocation,
      "emscripten_glInvalidateFramebuffer": _emscripten_glInvalidateFramebuffer,
      "emscripten_glInvalidateSubFramebuffer": _emscripten_glInvalidateSubFramebuffer,
      "emscripten_glIsSync": _emscripten_glIsSync,
      "emscripten_glIsTexture": _emscripten_glIsTexture,
      "emscripten_glLineWidth": _emscripten_glLineWidth,
      "emscripten_glLinkProgram": _emscripten_glLinkProgram,
      "emscripten_glMultiDrawArraysInstancedBaseInstanceWEBGL": _emscripten_glMultiDrawArraysInstancedBaseInstanceWEBGL,
      "emscripten_glMultiDrawElementsInstancedBaseVertexBaseInstanceWEBGL": _emscripten_glMultiDrawElementsInstancedBaseVertexBaseInstanceWEBGL,
      "emscripten_glPixelStorei": _emscripten_glPixelStorei,
      "emscripten_glReadBuffer": _emscripten_glReadBuffer,
      "emscripten_glReadPixels": _emscripten_glReadPixels,
      "emscripten_glRenderbufferStorage": _emscripten_glRenderbufferStorage,
      "emscripten_glRenderbufferStorageMultisample": _emscripten_glRenderbufferStorageMultisample,
      "emscripten_glSamplerParameterf": _emscripten_glSamplerParameterf,
      "emscripten_glSamplerParameteri": _emscripten_glSamplerParameteri,
      "emscripten_glSamplerParameteriv": _emscripten_glSamplerParameteriv,
      "emscripten_glScissor": _emscripten_glScissor,
      "emscripten_glShaderSource": _emscripten_glShaderSource,
      "emscripten_glStencilFunc": _emscripten_glStencilFunc,
      "emscripten_glStencilFuncSeparate": _emscripten_glStencilFuncSeparate,
      "emscripten_glStencilMask": _emscripten_glStencilMask,
      "emscripten_glStencilMaskSeparate": _emscripten_glStencilMaskSeparate,
      "emscripten_glStencilOp": _emscripten_glStencilOp,
      "emscripten_glStencilOpSeparate": _emscripten_glStencilOpSeparate,
      "emscripten_glTexImage2D": _emscripten_glTexImage2D,
      "emscripten_glTexParameterf": _emscripten_glTexParameterf,
      "emscripten_glTexParameterfv": _emscripten_glTexParameterfv,
      "emscripten_glTexParameteri": _emscripten_glTexParameteri,
      "emscripten_glTexParameteriv": _emscripten_glTexParameteriv,
      "emscripten_glTexStorage2D": _emscripten_glTexStorage2D,
      "emscripten_glTexSubImage2D": _emscripten_glTexSubImage2D,
      "emscripten_glUniform1f": _emscripten_glUniform1f,
      "emscripten_glUniform1fv": _emscripten_glUniform1fv,
      "emscripten_glUniform1i": _emscripten_glUniform1i,
      "emscripten_glUniform1iv": _emscripten_glUniform1iv,
      "emscripten_glUniform2f": _emscripten_glUniform2f,
      "emscripten_glUniform2fv": _emscripten_glUniform2fv,
      "emscripten_glUniform2i": _emscripten_glUniform2i,
      "emscripten_glUniform2iv": _emscripten_glUniform2iv,
      "emscripten_glUniform3f": _emscripten_glUniform3f,
      "emscripten_glUniform3fv": _emscripten_glUniform3fv,
      "emscripten_glUniform3i": _emscripten_glUniform3i,
      "emscripten_glUniform3iv": _emscripten_glUniform3iv,
      "emscripten_glUniform4f": _emscripten_glUniform4f,
      "emscripten_glUniform4fv": _emscripten_glUniform4fv,
      "emscripten_glUniform4i": _emscripten_glUniform4i,
      "emscripten_glUniform4iv": _emscripten_glUniform4iv,
      "emscripten_glUniformMatrix2fv": _emscripten_glUniformMatrix2fv,
      "emscripten_glUniformMatrix3fv": _emscripten_glUniformMatrix3fv,
      "emscripten_glUniformMatrix4fv": _emscripten_glUniformMatrix4fv,
      "emscripten_glUseProgram": _emscripten_glUseProgram,
      "emscripten_glVertexAttrib1f": _emscripten_glVertexAttrib1f,
      "emscripten_glVertexAttrib2fv": _emscripten_glVertexAttrib2fv,
      "emscripten_glVertexAttrib3fv": _emscripten_glVertexAttrib3fv,
      "emscripten_glVertexAttrib4fv": _emscripten_glVertexAttrib4fv,
      "emscripten_glVertexAttribDivisor": _emscripten_glVertexAttribDivisor,
      "emscripten_glVertexAttribIPointer": _emscripten_glVertexAttribIPointer,
      "emscripten_glVertexAttribPointer": _emscripten_glVertexAttribPointer,
      "emscripten_glViewport": _emscripten_glViewport,
      "emscripten_glWaitSync": _emscripten_glWaitSync,
      "emscripten_receive_on_main_thread_js": _emscripten_receive_on_main_thread_js,
      "emscripten_resize_heap": _emscripten_resize_heap,
      "emscripten_set_canvas_element_size": _emscripten_set_canvas_element_size,
      "emscripten_unwind_to_js_event_loop": _emscripten_unwind_to_js_event_loop,
      "emscripten_webgl_create_context": _emscripten_webgl_create_context,
      "emscripten_webgl_get_current_context": _emscripten_webgl_get_current_context,
      "emscripten_webgl_init_context_attributes": _emscripten_webgl_init_context_attributes,
      "emscripten_webgl_make_context_current": _emscripten_webgl_make_context_current,
      "environ_get": _environ_get,
      "environ_sizes_get": _environ_sizes_get,
      "exit": _exit,
      "fd_close": _fd_close,
      "fd_pread": _fd_pread,
      "fd_read": _fd_read,
      "fd_seek": _fd_seek,
      "fd_write": _fd_write,
      "glDeleteTextures": _glDeleteTextures,
      "invoke_i": invoke_i,
      "invoke_ii": invoke_ii,
      "invoke_iii": invoke_iii,
      "invoke_iiii": invoke_iiii,
      "invoke_iiiii": invoke_iiiii,
      "invoke_iiiiii": invoke_iiiiii,
      "invoke_iiiiiii": invoke_iiiiiii,
      "invoke_v": invoke_v,
      "invoke_vi": invoke_vi,
      "invoke_vii": invoke_vii,
      "invoke_viii": invoke_viii,
      "invoke_viiii": invoke_viiii,
      "invoke_viiiiii": invoke_viiiiii,
      "invoke_viiiiiii": invoke_viiiiiii,
      "invoke_viiiiiiiii": invoke_viiiiiiiii,
      "memory": wasmMemory || Module["wasmMemory"],
      "skwasm_createGlTextureFromVideoFrame": _skwasm_createGlTextureFromVideoFrame,
      "skwasm_disposeVideoFrame": _skwasm_disposeVideoFrame,
      "strftime_l": _strftime_l
    };
    var asm = createWasm();
    var ___wasm_call_ctors = function () {
      return (___wasm_call_ctors = Module["asm"]["__wasm_call_ctors"]).apply(null, arguments);
    };
    var _canvas_saveLayer = Module["_canvas_saveLayer"] = function () {
      return (_canvas_saveLayer = Module["_canvas_saveLayer"] = Module["asm"]["canvas_saveLayer"]).apply(null, arguments);
    };
    var _canvas_save = Module["_canvas_save"] = function () {
      return (_canvas_save = Module["_canvas_save"] = Module["asm"]["canvas_save"]).apply(null, arguments);
    };
    var _canvas_restore = Module["_canvas_restore"] = function () {
      return (_canvas_restore = Module["_canvas_restore"] = Module["asm"]["canvas_restore"]).apply(null, arguments);
    };
    var _canvas_restoreToCount = Module["_canvas_restoreToCount"] = function () {
      return (_canvas_restoreToCount = Module["_canvas_restoreToCount"] = Module["asm"]["canvas_restoreToCount"]).apply(null, arguments);
    };
    var _canvas_getSaveCount = Module["_canvas_getSaveCount"] = function () {
      return (_canvas_getSaveCount = Module["_canvas_getSaveCount"] = Module["asm"]["canvas_getSaveCount"]).apply(null, arguments);
    };
    var _canvas_translate = Module["_canvas_translate"] = function () {
      return (_canvas_translate = Module["_canvas_translate"] = Module["asm"]["canvas_translate"]).apply(null, arguments);
    };
    var _canvas_scale = Module["_canvas_scale"] = function () {
      return (_canvas_scale = Module["_canvas_scale"] = Module["asm"]["canvas_scale"]).apply(null, arguments);
    };
    var _canvas_rotate = Module["_canvas_rotate"] = function () {
      return (_canvas_rotate = Module["_canvas_rotate"] = Module["asm"]["canvas_rotate"]).apply(null, arguments);
    };
    var _canvas_skew = Module["_canvas_skew"] = function () {
      return (_canvas_skew = Module["_canvas_skew"] = Module["asm"]["canvas_skew"]).apply(null, arguments);
    };
    var _canvas_transform = Module["_canvas_transform"] = function () {
      return (_canvas_transform = Module["_canvas_transform"] = Module["asm"]["canvas_transform"]).apply(null, arguments);
    };
    var _canvas_clipRect = Module["_canvas_clipRect"] = function () {
      return (_canvas_clipRect = Module["_canvas_clipRect"] = Module["asm"]["canvas_clipRect"]).apply(null, arguments);
    };
    var _canvas_clipRRect = Module["_canvas_clipRRect"] = function () {
      return (_canvas_clipRRect = Module["_canvas_clipRRect"] = Module["asm"]["canvas_clipRRect"]).apply(null, arguments);
    };
    var _canvas_clipPath = Module["_canvas_clipPath"] = function () {
      return (_canvas_clipPath = Module["_canvas_clipPath"] = Module["asm"]["canvas_clipPath"]).apply(null, arguments);
    };
    var _canvas_drawColor = Module["_canvas_drawColor"] = function () {
      return (_canvas_drawColor = Module["_canvas_drawColor"] = Module["asm"]["canvas_drawColor"]).apply(null, arguments);
    };
    var _canvas_drawLine = Module["_canvas_drawLine"] = function () {
      return (_canvas_drawLine = Module["_canvas_drawLine"] = Module["asm"]["canvas_drawLine"]).apply(null, arguments);
    };
    var _canvas_drawPaint = Module["_canvas_drawPaint"] = function () {
      return (_canvas_drawPaint = Module["_canvas_drawPaint"] = Module["asm"]["canvas_drawPaint"]).apply(null, arguments);
    };
    var _canvas_drawRect = Module["_canvas_drawRect"] = function () {
      return (_canvas_drawRect = Module["_canvas_drawRect"] = Module["asm"]["canvas_drawRect"]).apply(null, arguments);
    };
    var _canvas_drawRRect = Module["_canvas_drawRRect"] = function () {
      return (_canvas_drawRRect = Module["_canvas_drawRRect"] = Module["asm"]["canvas_drawRRect"]).apply(null, arguments);
    };
    var _canvas_drawDRRect = Module["_canvas_drawDRRect"] = function () {
      return (_canvas_drawDRRect = Module["_canvas_drawDRRect"] = Module["asm"]["canvas_drawDRRect"]).apply(null, arguments);
    };
    var _canvas_drawOval = Module["_canvas_drawOval"] = function () {
      return (_canvas_drawOval = Module["_canvas_drawOval"] = Module["asm"]["canvas_drawOval"]).apply(null, arguments);
    };
    var _canvas_drawCircle = Module["_canvas_drawCircle"] = function () {
      return (_canvas_drawCircle = Module["_canvas_drawCircle"] = Module["asm"]["canvas_drawCircle"]).apply(null, arguments);
    };
    var _canvas_drawArc = Module["_canvas_drawArc"] = function () {
      return (_canvas_drawArc = Module["_canvas_drawArc"] = Module["asm"]["canvas_drawArc"]).apply(null, arguments);
    };
    var _canvas_drawPath = Module["_canvas_drawPath"] = function () {
      return (_canvas_drawPath = Module["_canvas_drawPath"] = Module["asm"]["canvas_drawPath"]).apply(null, arguments);
    };
    var _canvas_drawShadow = Module["_canvas_drawShadow"] = function () {
      return (_canvas_drawShadow = Module["_canvas_drawShadow"] = Module["asm"]["canvas_drawShadow"]).apply(null, arguments);
    };
    var _canvas_drawParagraph = Module["_canvas_drawParagraph"] = function () {
      return (_canvas_drawParagraph = Module["_canvas_drawParagraph"] = Module["asm"]["canvas_drawParagraph"]).apply(null, arguments);
    };
    var _canvas_drawPicture = Module["_canvas_drawPicture"] = function () {
      return (_canvas_drawPicture = Module["_canvas_drawPicture"] = Module["asm"]["canvas_drawPicture"]).apply(null, arguments);
    };
    var _canvas_drawImage = Module["_canvas_drawImage"] = function () {
      return (_canvas_drawImage = Module["_canvas_drawImage"] = Module["asm"]["canvas_drawImage"]).apply(null, arguments);
    };
    var _canvas_drawImageRect = Module["_canvas_drawImageRect"] = function () {
      return (_canvas_drawImageRect = Module["_canvas_drawImageRect"] = Module["asm"]["canvas_drawImageRect"]).apply(null, arguments);
    };
    var _canvas_drawImageNine = Module["_canvas_drawImageNine"] = function () {
      return (_canvas_drawImageNine = Module["_canvas_drawImageNine"] = Module["asm"]["canvas_drawImageNine"]).apply(null, arguments);
    };
    var _canvas_drawVertices = Module["_canvas_drawVertices"] = function () {
      return (_canvas_drawVertices = Module["_canvas_drawVertices"] = Module["asm"]["canvas_drawVertices"]).apply(null, arguments);
    };
    var _canvas_drawPoints = Module["_canvas_drawPoints"] = function () {
      return (_canvas_drawPoints = Module["_canvas_drawPoints"] = Module["asm"]["canvas_drawPoints"]).apply(null, arguments);
    };
    var _canvas_drawAtlas = Module["_canvas_drawAtlas"] = function () {
      return (_canvas_drawAtlas = Module["_canvas_drawAtlas"] = Module["asm"]["canvas_drawAtlas"]).apply(null, arguments);
    };
    var _canvas_getTransform = Module["_canvas_getTransform"] = function () {
      return (_canvas_getTransform = Module["_canvas_getTransform"] = Module["asm"]["canvas_getTransform"]).apply(null, arguments);
    };
    var _canvas_getLocalClipBounds = Module["_canvas_getLocalClipBounds"] = function () {
      return (_canvas_getLocalClipBounds = Module["_canvas_getLocalClipBounds"] = Module["asm"]["canvas_getLocalClipBounds"]).apply(null, arguments);
    };
    var _canvas_getDeviceClipBounds = Module["_canvas_getDeviceClipBounds"] = function () {
      return (_canvas_getDeviceClipBounds = Module["_canvas_getDeviceClipBounds"] = Module["asm"]["canvas_getDeviceClipBounds"]).apply(null, arguments);
    };
    var _contourMeasureIter_create = Module["_contourMeasureIter_create"] = function () {
      return (_contourMeasureIter_create = Module["_contourMeasureIter_create"] = Module["asm"]["contourMeasureIter_create"]).apply(null, arguments);
    };
    var _contourMeasureIter_next = Module["_contourMeasureIter_next"] = function () {
      return (_contourMeasureIter_next = Module["_contourMeasureIter_next"] = Module["asm"]["contourMeasureIter_next"]).apply(null, arguments);
    };
    var _contourMeasureIter_dispose = Module["_contourMeasureIter_dispose"] = function () {
      return (_contourMeasureIter_dispose = Module["_contourMeasureIter_dispose"] = Module["asm"]["contourMeasureIter_dispose"]).apply(null, arguments);
    };
    var _contourMeasure_dispose = Module["_contourMeasure_dispose"] = function () {
      return (_contourMeasure_dispose = Module["_contourMeasure_dispose"] = Module["asm"]["contourMeasure_dispose"]).apply(null, arguments);
    };
    var _contourMeasure_length = Module["_contourMeasure_length"] = function () {
      return (_contourMeasure_length = Module["_contourMeasure_length"] = Module["asm"]["contourMeasure_length"]).apply(null, arguments);
    };
    var _contourMeasure_isClosed = Module["_contourMeasure_isClosed"] = function () {
      return (_contourMeasure_isClosed = Module["_contourMeasure_isClosed"] = Module["asm"]["contourMeasure_isClosed"]).apply(null, arguments);
    };
    var _contourMeasure_getPosTan = Module["_contourMeasure_getPosTan"] = function () {
      return (_contourMeasure_getPosTan = Module["_contourMeasure_getPosTan"] = Module["asm"]["contourMeasure_getPosTan"]).apply(null, arguments);
    };
    var _contourMeasure_getSegment = Module["_contourMeasure_getSegment"] = function () {
      return (_contourMeasure_getSegment = Module["_contourMeasure_getSegment"] = Module["asm"]["contourMeasure_getSegment"]).apply(null, arguments);
    };
    var _skData_create = Module["_skData_create"] = function () {
      return (_skData_create = Module["_skData_create"] = Module["asm"]["skData_create"]).apply(null, arguments);
    };
    var _skData_getPointer = Module["_skData_getPointer"] = function () {
      return (_skData_getPointer = Module["_skData_getPointer"] = Module["asm"]["skData_getPointer"]).apply(null, arguments);
    };
    var _skData_getConstPointer = Module["_skData_getConstPointer"] = function () {
      return (_skData_getConstPointer = Module["_skData_getConstPointer"] = Module["asm"]["skData_getConstPointer"]).apply(null, arguments);
    };
    var _skData_getSize = Module["_skData_getSize"] = function () {
      return (_skData_getSize = Module["_skData_getSize"] = Module["asm"]["skData_getSize"]).apply(null, arguments);
    };
    var _skData_dispose = Module["_skData_dispose"] = function () {
      return (_skData_dispose = Module["_skData_dispose"] = Module["asm"]["skData_dispose"]).apply(null, arguments);
    };
    var _imageFilter_createBlur = Module["_imageFilter_createBlur"] = function () {
      return (_imageFilter_createBlur = Module["_imageFilter_createBlur"] = Module["asm"]["imageFilter_createBlur"]).apply(null, arguments);
    };
    var _imageFilter_createDilate = Module["_imageFilter_createDilate"] = function () {
      return (_imageFilter_createDilate = Module["_imageFilter_createDilate"] = Module["asm"]["imageFilter_createDilate"]).apply(null, arguments);
    };
    var _imageFilter_createErode = Module["_imageFilter_createErode"] = function () {
      return (_imageFilter_createErode = Module["_imageFilter_createErode"] = Module["asm"]["imageFilter_createErode"]).apply(null, arguments);
    };
    var _imageFilter_createMatrix = Module["_imageFilter_createMatrix"] = function () {
      return (_imageFilter_createMatrix = Module["_imageFilter_createMatrix"] = Module["asm"]["imageFilter_createMatrix"]).apply(null, arguments);
    };
    var _imageFilter_createFromColorFilter = Module["_imageFilter_createFromColorFilter"] = function () {
      return (_imageFilter_createFromColorFilter = Module["_imageFilter_createFromColorFilter"] = Module["asm"]["imageFilter_createFromColorFilter"]).apply(null, arguments);
    };
    var _imageFilter_compose = Module["_imageFilter_compose"] = function () {
      return (_imageFilter_compose = Module["_imageFilter_compose"] = Module["asm"]["imageFilter_compose"]).apply(null, arguments);
    };
    var _imageFilter_dispose = Module["_imageFilter_dispose"] = function () {
      return (_imageFilter_dispose = Module["_imageFilter_dispose"] = Module["asm"]["imageFilter_dispose"]).apply(null, arguments);
    };
    var _imageFilter_getFilterBounds = Module["_imageFilter_getFilterBounds"] = function () {
      return (_imageFilter_getFilterBounds = Module["_imageFilter_getFilterBounds"] = Module["asm"]["imageFilter_getFilterBounds"]).apply(null, arguments);
    };
    var _colorFilter_createMode = Module["_colorFilter_createMode"] = function () {
      return (_colorFilter_createMode = Module["_colorFilter_createMode"] = Module["asm"]["colorFilter_createMode"]).apply(null, arguments);
    };
    var _colorFilter_createMatrix = Module["_colorFilter_createMatrix"] = function () {
      return (_colorFilter_createMatrix = Module["_colorFilter_createMatrix"] = Module["asm"]["colorFilter_createMatrix"]).apply(null, arguments);
    };
    var _colorFilter_createSRGBToLinearGamma = Module["_colorFilter_createSRGBToLinearGamma"] = function () {
      return (_colorFilter_createSRGBToLinearGamma = Module["_colorFilter_createSRGBToLinearGamma"] = Module["asm"]["colorFilter_createSRGBToLinearGamma"]).apply(null, arguments);
    };
    var _colorFilter_createLinearToSRGBGamma = Module["_colorFilter_createLinearToSRGBGamma"] = function () {
      return (_colorFilter_createLinearToSRGBGamma = Module["_colorFilter_createLinearToSRGBGamma"] = Module["asm"]["colorFilter_createLinearToSRGBGamma"]).apply(null, arguments);
    };
    var _colorFilter_compose = Module["_colorFilter_compose"] = function () {
      return (_colorFilter_compose = Module["_colorFilter_compose"] = Module["asm"]["colorFilter_compose"]).apply(null, arguments);
    };
    var _colorFilter_dispose = Module["_colorFilter_dispose"] = function () {
      return (_colorFilter_dispose = Module["_colorFilter_dispose"] = Module["asm"]["colorFilter_dispose"]).apply(null, arguments);
    };
    var _maskFilter_createBlur = Module["_maskFilter_createBlur"] = function () {
      return (_maskFilter_createBlur = Module["_maskFilter_createBlur"] = Module["asm"]["maskFilter_createBlur"]).apply(null, arguments);
    };
    var _maskFilter_dispose = Module["_maskFilter_dispose"] = function () {
      return (_maskFilter_dispose = Module["_maskFilter_dispose"] = Module["asm"]["maskFilter_dispose"]).apply(null, arguments);
    };
    var _fontCollection_create = Module["_fontCollection_create"] = function () {
      return (_fontCollection_create = Module["_fontCollection_create"] = Module["asm"]["fontCollection_create"]).apply(null, arguments);
    };
    var _fontCollection_dispose = Module["_fontCollection_dispose"] = function () {
      return (_fontCollection_dispose = Module["_fontCollection_dispose"] = Module["asm"]["fontCollection_dispose"]).apply(null, arguments);
    };
    var _typeface_create = Module["_typeface_create"] = function () {
      return (_typeface_create = Module["_typeface_create"] = Module["asm"]["typeface_create"]).apply(null, arguments);
    };
    var _typeface_dispose = Module["_typeface_dispose"] = function () {
      return (_typeface_dispose = Module["_typeface_dispose"] = Module["asm"]["typeface_dispose"]).apply(null, arguments);
    };
    var _typefaces_filterCoveredCodePoints = Module["_typefaces_filterCoveredCodePoints"] = function () {
      return (_typefaces_filterCoveredCodePoints = Module["_typefaces_filterCoveredCodePoints"] = Module["asm"]["typefaces_filterCoveredCodePoints"]).apply(null, arguments);
    };
    var _fontCollection_registerTypeface = Module["_fontCollection_registerTypeface"] = function () {
      return (_fontCollection_registerTypeface = Module["_fontCollection_registerTypeface"] = Module["asm"]["fontCollection_registerTypeface"]).apply(null, arguments);
    };
    var _fontCollection_clearCaches = Module["_fontCollection_clearCaches"] = function () {
      return (_fontCollection_clearCaches = Module["_fontCollection_clearCaches"] = Module["asm"]["fontCollection_clearCaches"]).apply(null, arguments);
    };
    var _image_createFromPicture = Module["_image_createFromPicture"] = function () {
      return (_image_createFromPicture = Module["_image_createFromPicture"] = Module["asm"]["image_createFromPicture"]).apply(null, arguments);
    };
    var _image_createFromPixels = Module["_image_createFromPixels"] = function () {
      return (_image_createFromPixels = Module["_image_createFromPixels"] = Module["asm"]["image_createFromPixels"]).apply(null, arguments);
    };
    var _image_createFromVideoFrame = Module["_image_createFromVideoFrame"] = function () {
      return (_image_createFromVideoFrame = Module["_image_createFromVideoFrame"] = Module["asm"]["image_createFromVideoFrame"]).apply(null, arguments);
    };
    var _image_ref = Module["_image_ref"] = function () {
      return (_image_ref = Module["_image_ref"] = Module["asm"]["image_ref"]).apply(null, arguments);
    };
    var _image_dispose = Module["_image_dispose"] = function () {
      return (_image_dispose = Module["_image_dispose"] = Module["asm"]["image_dispose"]).apply(null, arguments);
    };
    var _image_getWidth = Module["_image_getWidth"] = function () {
      return (_image_getWidth = Module["_image_getWidth"] = Module["asm"]["image_getWidth"]).apply(null, arguments);
    };
    var _image_getHeight = Module["_image_getHeight"] = function () {
      return (_image_getHeight = Module["_image_getHeight"] = Module["asm"]["image_getHeight"]).apply(null, arguments);
    };
    var _paint_create = Module["_paint_create"] = function () {
      return (_paint_create = Module["_paint_create"] = Module["asm"]["paint_create"]).apply(null, arguments);
    };
    var _paint_dispose = Module["_paint_dispose"] = function () {
      return (_paint_dispose = Module["_paint_dispose"] = Module["asm"]["paint_dispose"]).apply(null, arguments);
    };
    var _paint_setBlendMode = Module["_paint_setBlendMode"] = function () {
      return (_paint_setBlendMode = Module["_paint_setBlendMode"] = Module["asm"]["paint_setBlendMode"]).apply(null, arguments);
    };
    var _paint_setStyle = Module["_paint_setStyle"] = function () {
      return (_paint_setStyle = Module["_paint_setStyle"] = Module["asm"]["paint_setStyle"]).apply(null, arguments);
    };
    var _paint_getStyle = Module["_paint_getStyle"] = function () {
      return (_paint_getStyle = Module["_paint_getStyle"] = Module["asm"]["paint_getStyle"]).apply(null, arguments);
    };
    var _paint_setStrokeWidth = Module["_paint_setStrokeWidth"] = function () {
      return (_paint_setStrokeWidth = Module["_paint_setStrokeWidth"] = Module["asm"]["paint_setStrokeWidth"]).apply(null, arguments);
    };
    var _paint_getStrokeWidth = Module["_paint_getStrokeWidth"] = function () {
      return (_paint_getStrokeWidth = Module["_paint_getStrokeWidth"] = Module["asm"]["paint_getStrokeWidth"]).apply(null, arguments);
    };
    var _paint_setStrokeCap = Module["_paint_setStrokeCap"] = function () {
      return (_paint_setStrokeCap = Module["_paint_setStrokeCap"] = Module["asm"]["paint_setStrokeCap"]).apply(null, arguments);
    };
    var _paint_getStrokeCap = Module["_paint_getStrokeCap"] = function () {
      return (_paint_getStrokeCap = Module["_paint_getStrokeCap"] = Module["asm"]["paint_getStrokeCap"]).apply(null, arguments);
    };
    var _paint_setStrokeJoin = Module["_paint_setStrokeJoin"] = function () {
      return (_paint_setStrokeJoin = Module["_paint_setStrokeJoin"] = Module["asm"]["paint_setStrokeJoin"]).apply(null, arguments);
    };
    var _paint_getStrokeJoin = Module["_paint_getStrokeJoin"] = function () {
      return (_paint_getStrokeJoin = Module["_paint_getStrokeJoin"] = Module["asm"]["paint_getStrokeJoin"]).apply(null, arguments);
    };
    var _paint_setAntiAlias = Module["_paint_setAntiAlias"] = function () {
      return (_paint_setAntiAlias = Module["_paint_setAntiAlias"] = Module["asm"]["paint_setAntiAlias"]).apply(null, arguments);
    };
    var _paint_getAntiAlias = Module["_paint_getAntiAlias"] = function () {
      return (_paint_getAntiAlias = Module["_paint_getAntiAlias"] = Module["asm"]["paint_getAntiAlias"]).apply(null, arguments);
    };
    var _paint_setColorInt = Module["_paint_setColorInt"] = function () {
      return (_paint_setColorInt = Module["_paint_setColorInt"] = Module["asm"]["paint_setColorInt"]).apply(null, arguments);
    };
    var _paint_getColorInt = Module["_paint_getColorInt"] = function () {
      return (_paint_getColorInt = Module["_paint_getColorInt"] = Module["asm"]["paint_getColorInt"]).apply(null, arguments);
    };
    var _paint_setMiterLimit = Module["_paint_setMiterLimit"] = function () {
      return (_paint_setMiterLimit = Module["_paint_setMiterLimit"] = Module["asm"]["paint_setMiterLimit"]).apply(null, arguments);
    };
    var _paint_getMiterLImit = Module["_paint_getMiterLImit"] = function () {
      return (_paint_getMiterLImit = Module["_paint_getMiterLImit"] = Module["asm"]["paint_getMiterLImit"]).apply(null, arguments);
    };
    var _paint_setShader = Module["_paint_setShader"] = function () {
      return (_paint_setShader = Module["_paint_setShader"] = Module["asm"]["paint_setShader"]).apply(null, arguments);
    };
    var _paint_setImageFilter = Module["_paint_setImageFilter"] = function () {
      return (_paint_setImageFilter = Module["_paint_setImageFilter"] = Module["asm"]["paint_setImageFilter"]).apply(null, arguments);
    };
    var _paint_setColorFilter = Module["_paint_setColorFilter"] = function () {
      return (_paint_setColorFilter = Module["_paint_setColorFilter"] = Module["asm"]["paint_setColorFilter"]).apply(null, arguments);
    };
    var _paint_setMaskFilter = Module["_paint_setMaskFilter"] = function () {
      return (_paint_setMaskFilter = Module["_paint_setMaskFilter"] = Module["asm"]["paint_setMaskFilter"]).apply(null, arguments);
    };
    var _path_create = Module["_path_create"] = function () {
      return (_path_create = Module["_path_create"] = Module["asm"]["path_create"]).apply(null, arguments);
    };
    var _path_dispose = Module["_path_dispose"] = function () {
      return (_path_dispose = Module["_path_dispose"] = Module["asm"]["path_dispose"]).apply(null, arguments);
    };
    var _path_copy = Module["_path_copy"] = function () {
      return (_path_copy = Module["_path_copy"] = Module["asm"]["path_copy"]).apply(null, arguments);
    };
    var _path_setFillType = Module["_path_setFillType"] = function () {
      return (_path_setFillType = Module["_path_setFillType"] = Module["asm"]["path_setFillType"]).apply(null, arguments);
    };
    var _path_getFillType = Module["_path_getFillType"] = function () {
      return (_path_getFillType = Module["_path_getFillType"] = Module["asm"]["path_getFillType"]).apply(null, arguments);
    };
    var _path_moveTo = Module["_path_moveTo"] = function () {
      return (_path_moveTo = Module["_path_moveTo"] = Module["asm"]["path_moveTo"]).apply(null, arguments);
    };
    var _path_relativeMoveTo = Module["_path_relativeMoveTo"] = function () {
      return (_path_relativeMoveTo = Module["_path_relativeMoveTo"] = Module["asm"]["path_relativeMoveTo"]).apply(null, arguments);
    };
    var _path_lineTo = Module["_path_lineTo"] = function () {
      return (_path_lineTo = Module["_path_lineTo"] = Module["asm"]["path_lineTo"]).apply(null, arguments);
    };
    var _path_relativeLineTo = Module["_path_relativeLineTo"] = function () {
      return (_path_relativeLineTo = Module["_path_relativeLineTo"] = Module["asm"]["path_relativeLineTo"]).apply(null, arguments);
    };
    var _path_quadraticBezierTo = Module["_path_quadraticBezierTo"] = function () {
      return (_path_quadraticBezierTo = Module["_path_quadraticBezierTo"] = Module["asm"]["path_quadraticBezierTo"]).apply(null, arguments);
    };
    var _path_relativeQuadraticBezierTo = Module["_path_relativeQuadraticBezierTo"] = function () {
      return (_path_relativeQuadraticBezierTo = Module["_path_relativeQuadraticBezierTo"] = Module["asm"]["path_relativeQuadraticBezierTo"]).apply(null, arguments);
    };
    var _path_cubicTo = Module["_path_cubicTo"] = function () {
      return (_path_cubicTo = Module["_path_cubicTo"] = Module["asm"]["path_cubicTo"]).apply(null, arguments);
    };
    var _path_relativeCubicTo = Module["_path_relativeCubicTo"] = function () {
      return (_path_relativeCubicTo = Module["_path_relativeCubicTo"] = Module["asm"]["path_relativeCubicTo"]).apply(null, arguments);
    };
    var _path_conicTo = Module["_path_conicTo"] = function () {
      return (_path_conicTo = Module["_path_conicTo"] = Module["asm"]["path_conicTo"]).apply(null, arguments);
    };
    var _path_relativeConicTo = Module["_path_relativeConicTo"] = function () {
      return (_path_relativeConicTo = Module["_path_relativeConicTo"] = Module["asm"]["path_relativeConicTo"]).apply(null, arguments);
    };
    var _path_arcToOval = Module["_path_arcToOval"] = function () {
      return (_path_arcToOval = Module["_path_arcToOval"] = Module["asm"]["path_arcToOval"]).apply(null, arguments);
    };
    var _path_arcToRotated = Module["_path_arcToRotated"] = function () {
      return (_path_arcToRotated = Module["_path_arcToRotated"] = Module["asm"]["path_arcToRotated"]).apply(null, arguments);
    };
    var _path_relativeArcToRotated = Module["_path_relativeArcToRotated"] = function () {
      return (_path_relativeArcToRotated = Module["_path_relativeArcToRotated"] = Module["asm"]["path_relativeArcToRotated"]).apply(null, arguments);
    };
    var _path_addRect = Module["_path_addRect"] = function () {
      return (_path_addRect = Module["_path_addRect"] = Module["asm"]["path_addRect"]).apply(null, arguments);
    };
    var _path_addOval = Module["_path_addOval"] = function () {
      return (_path_addOval = Module["_path_addOval"] = Module["asm"]["path_addOval"]).apply(null, arguments);
    };
    var _path_addArc = Module["_path_addArc"] = function () {
      return (_path_addArc = Module["_path_addArc"] = Module["asm"]["path_addArc"]).apply(null, arguments);
    };
    var _path_addPolygon = Module["_path_addPolygon"] = function () {
      return (_path_addPolygon = Module["_path_addPolygon"] = Module["asm"]["path_addPolygon"]).apply(null, arguments);
    };
    var _path_addRRect = Module["_path_addRRect"] = function () {
      return (_path_addRRect = Module["_path_addRRect"] = Module["asm"]["path_addRRect"]).apply(null, arguments);
    };
    var _path_addPath = Module["_path_addPath"] = function () {
      return (_path_addPath = Module["_path_addPath"] = Module["asm"]["path_addPath"]).apply(null, arguments);
    };
    var _path_close = Module["_path_close"] = function () {
      return (_path_close = Module["_path_close"] = Module["asm"]["path_close"]).apply(null, arguments);
    };
    var _path_reset = Module["_path_reset"] = function () {
      return (_path_reset = Module["_path_reset"] = Module["asm"]["path_reset"]).apply(null, arguments);
    };
    var _path_contains = Module["_path_contains"] = function () {
      return (_path_contains = Module["_path_contains"] = Module["asm"]["path_contains"]).apply(null, arguments);
    };
    var _path_transform = Module["_path_transform"] = function () {
      return (_path_transform = Module["_path_transform"] = Module["asm"]["path_transform"]).apply(null, arguments);
    };
    var _path_getBounds = Module["_path_getBounds"] = function () {
      return (_path_getBounds = Module["_path_getBounds"] = Module["asm"]["path_getBounds"]).apply(null, arguments);
    };
    var _path_combine = Module["_path_combine"] = function () {
      return (_path_combine = Module["_path_combine"] = Module["asm"]["path_combine"]).apply(null, arguments);
    };
    var _pictureRecorder_create = Module["_pictureRecorder_create"] = function () {
      return (_pictureRecorder_create = Module["_pictureRecorder_create"] = Module["asm"]["pictureRecorder_create"]).apply(null, arguments);
    };
    var _pictureRecorder_dispose = Module["_pictureRecorder_dispose"] = function () {
      return (_pictureRecorder_dispose = Module["_pictureRecorder_dispose"] = Module["asm"]["pictureRecorder_dispose"]).apply(null, arguments);
    };
    var _pictureRecorder_beginRecording = Module["_pictureRecorder_beginRecording"] = function () {
      return (_pictureRecorder_beginRecording = Module["_pictureRecorder_beginRecording"] = Module["asm"]["pictureRecorder_beginRecording"]).apply(null, arguments);
    };
    var _pictureRecorder_endRecording = Module["_pictureRecorder_endRecording"] = function () {
      return (_pictureRecorder_endRecording = Module["_pictureRecorder_endRecording"] = Module["asm"]["pictureRecorder_endRecording"]).apply(null, arguments);
    };
    var _picture_getCullRect = Module["_picture_getCullRect"] = function () {
      return (_picture_getCullRect = Module["_picture_getCullRect"] = Module["asm"]["picture_getCullRect"]).apply(null, arguments);
    };
    var _picture_dispose = Module["_picture_dispose"] = function () {
      return (_picture_dispose = Module["_picture_dispose"] = Module["asm"]["picture_dispose"]).apply(null, arguments);
    };
    var _picture_approximateBytesUsed = Module["_picture_approximateBytesUsed"] = function () {
      return (_picture_approximateBytesUsed = Module["_picture_approximateBytesUsed"] = Module["asm"]["picture_approximateBytesUsed"]).apply(null, arguments);
    };
    var _shader_createLinearGradient = Module["_shader_createLinearGradient"] = function () {
      return (_shader_createLinearGradient = Module["_shader_createLinearGradient"] = Module["asm"]["shader_createLinearGradient"]).apply(null, arguments);
    };
    var _shader_createRadialGradient = Module["_shader_createRadialGradient"] = function () {
      return (_shader_createRadialGradient = Module["_shader_createRadialGradient"] = Module["asm"]["shader_createRadialGradient"]).apply(null, arguments);
    };
    var _shader_createConicalGradient = Module["_shader_createConicalGradient"] = function () {
      return (_shader_createConicalGradient = Module["_shader_createConicalGradient"] = Module["asm"]["shader_createConicalGradient"]).apply(null, arguments);
    };
    var _shader_createSweepGradient = Module["_shader_createSweepGradient"] = function () {
      return (_shader_createSweepGradient = Module["_shader_createSweepGradient"] = Module["asm"]["shader_createSweepGradient"]).apply(null, arguments);
    };
    var _shader_dispose = Module["_shader_dispose"] = function () {
      return (_shader_dispose = Module["_shader_dispose"] = Module["asm"]["shader_dispose"]).apply(null, arguments);
    };
    var _runtimeEffect_create = Module["_runtimeEffect_create"] = function () {
      return (_runtimeEffect_create = Module["_runtimeEffect_create"] = Module["asm"]["runtimeEffect_create"]).apply(null, arguments);
    };
    var _runtimeEffect_dispose = Module["_runtimeEffect_dispose"] = function () {
      return (_runtimeEffect_dispose = Module["_runtimeEffect_dispose"] = Module["asm"]["runtimeEffect_dispose"]).apply(null, arguments);
    };
    var _runtimeEffect_getUniformSize = Module["_runtimeEffect_getUniformSize"] = function () {
      return (_runtimeEffect_getUniformSize = Module["_runtimeEffect_getUniformSize"] = Module["asm"]["runtimeEffect_getUniformSize"]).apply(null, arguments);
    };
    var _shader_createRuntimeEffectShader = Module["_shader_createRuntimeEffectShader"] = function () {
      return (_shader_createRuntimeEffectShader = Module["_shader_createRuntimeEffectShader"] = Module["asm"]["shader_createRuntimeEffectShader"]).apply(null, arguments);
    };
    var _shader_createFromImage = Module["_shader_createFromImage"] = function () {
      return (_shader_createFromImage = Module["_shader_createFromImage"] = Module["asm"]["shader_createFromImage"]).apply(null, arguments);
    };
    var _skString_allocate = Module["_skString_allocate"] = function () {
      return (_skString_allocate = Module["_skString_allocate"] = Module["asm"]["skString_allocate"]).apply(null, arguments);
    };
    var _skString_getData = Module["_skString_getData"] = function () {
      return (_skString_getData = Module["_skString_getData"] = Module["asm"]["skString_getData"]).apply(null, arguments);
    };
    var _skString_free = Module["_skString_free"] = function () {
      return (_skString_free = Module["_skString_free"] = Module["asm"]["skString_free"]).apply(null, arguments);
    };
    var _skString16_allocate = Module["_skString16_allocate"] = function () {
      return (_skString16_allocate = Module["_skString16_allocate"] = Module["asm"]["skString16_allocate"]).apply(null, arguments);
    };
    var _skString16_getData = Module["_skString16_getData"] = function () {
      return (_skString16_getData = Module["_skString16_getData"] = Module["asm"]["skString16_getData"]).apply(null, arguments);
    };
    var _skString16_free = Module["_skString16_free"] = function () {
      return (_skString16_free = Module["_skString16_free"] = Module["asm"]["skString16_free"]).apply(null, arguments);
    };
    var _emscripten_dispatch_to_thread_ = function () {
      return (_emscripten_dispatch_to_thread_ = Module["asm"]["emscripten_dispatch_to_thread_"]).apply(null, arguments);
    };
    var _surface_createFromCanvas = Module["_surface_createFromCanvas"] = function () {
      return (_surface_createFromCanvas = Module["_surface_createFromCanvas"] = Module["asm"]["surface_createFromCanvas"]).apply(null, arguments);
    };
    var _surface_getThreadId = Module["_surface_getThreadId"] = function () {
      return (_surface_getThreadId = Module["_surface_getThreadId"] = Module["asm"]["surface_getThreadId"]).apply(null, arguments);
    };
    var _surface_setCallbackHandler = Module["_surface_setCallbackHandler"] = function () {
      return (_surface_setCallbackHandler = Module["_surface_setCallbackHandler"] = Module["asm"]["surface_setCallbackHandler"]).apply(null, arguments);
    };
    var _surface_destroy = Module["_surface_destroy"] = function () {
      return (_surface_destroy = Module["_surface_destroy"] = Module["asm"]["surface_destroy"]).apply(null, arguments);
    };
    var _surface_setCanvasSize = Module["_surface_setCanvasSize"] = function () {
      return (_surface_setCanvasSize = Module["_surface_setCanvasSize"] = Module["asm"]["surface_setCanvasSize"]).apply(null, arguments);
    };
    var _surface_renderPicture = Module["_surface_renderPicture"] = function () {
      return (_surface_renderPicture = Module["_surface_renderPicture"] = Module["asm"]["surface_renderPicture"]).apply(null, arguments);
    };
    var _surface_rasterizeImage = Module["_surface_rasterizeImage"] = function () {
      return (_surface_rasterizeImage = Module["_surface_rasterizeImage"] = Module["asm"]["surface_rasterizeImage"]).apply(null, arguments);
    };
    var _lineMetrics_create = Module["_lineMetrics_create"] = function () {
      return (_lineMetrics_create = Module["_lineMetrics_create"] = Module["asm"]["lineMetrics_create"]).apply(null, arguments);
    };
    var _lineMetrics_dispose = Module["_lineMetrics_dispose"] = function () {
      return (_lineMetrics_dispose = Module["_lineMetrics_dispose"] = Module["asm"]["lineMetrics_dispose"]).apply(null, arguments);
    };
    var _lineMetrics_getHardBreak = Module["_lineMetrics_getHardBreak"] = function () {
      return (_lineMetrics_getHardBreak = Module["_lineMetrics_getHardBreak"] = Module["asm"]["lineMetrics_getHardBreak"]).apply(null, arguments);
    };
    var _lineMetrics_getAscent = Module["_lineMetrics_getAscent"] = function () {
      return (_lineMetrics_getAscent = Module["_lineMetrics_getAscent"] = Module["asm"]["lineMetrics_getAscent"]).apply(null, arguments);
    };
    var _lineMetrics_getDescent = Module["_lineMetrics_getDescent"] = function () {
      return (_lineMetrics_getDescent = Module["_lineMetrics_getDescent"] = Module["asm"]["lineMetrics_getDescent"]).apply(null, arguments);
    };
    var _lineMetrics_getUnscaledAscent = Module["_lineMetrics_getUnscaledAscent"] = function () {
      return (_lineMetrics_getUnscaledAscent = Module["_lineMetrics_getUnscaledAscent"] = Module["asm"]["lineMetrics_getUnscaledAscent"]).apply(null, arguments);
    };
    var _lineMetrics_getHeight = Module["_lineMetrics_getHeight"] = function () {
      return (_lineMetrics_getHeight = Module["_lineMetrics_getHeight"] = Module["asm"]["lineMetrics_getHeight"]).apply(null, arguments);
    };
    var _lineMetrics_getWidth = Module["_lineMetrics_getWidth"] = function () {
      return (_lineMetrics_getWidth = Module["_lineMetrics_getWidth"] = Module["asm"]["lineMetrics_getWidth"]).apply(null, arguments);
    };
    var _lineMetrics_getLeft = Module["_lineMetrics_getLeft"] = function () {
      return (_lineMetrics_getLeft = Module["_lineMetrics_getLeft"] = Module["asm"]["lineMetrics_getLeft"]).apply(null, arguments);
    };
    var _lineMetrics_getBaseline = Module["_lineMetrics_getBaseline"] = function () {
      return (_lineMetrics_getBaseline = Module["_lineMetrics_getBaseline"] = Module["asm"]["lineMetrics_getBaseline"]).apply(null, arguments);
    };
    var _lineMetrics_getLineNumber = Module["_lineMetrics_getLineNumber"] = function () {
      return (_lineMetrics_getLineNumber = Module["_lineMetrics_getLineNumber"] = Module["asm"]["lineMetrics_getLineNumber"]).apply(null, arguments);
    };
    var _lineMetrics_getStartIndex = Module["_lineMetrics_getStartIndex"] = function () {
      return (_lineMetrics_getStartIndex = Module["_lineMetrics_getStartIndex"] = Module["asm"]["lineMetrics_getStartIndex"]).apply(null, arguments);
    };
    var _lineMetrics_getEndIndex = Module["_lineMetrics_getEndIndex"] = function () {
      return (_lineMetrics_getEndIndex = Module["_lineMetrics_getEndIndex"] = Module["asm"]["lineMetrics_getEndIndex"]).apply(null, arguments);
    };
    var _paragraph_dispose = Module["_paragraph_dispose"] = function () {
      return (_paragraph_dispose = Module["_paragraph_dispose"] = Module["asm"]["paragraph_dispose"]).apply(null, arguments);
    };
    var _paragraph_getWidth = Module["_paragraph_getWidth"] = function () {
      return (_paragraph_getWidth = Module["_paragraph_getWidth"] = Module["asm"]["paragraph_getWidth"]).apply(null, arguments);
    };
    var _paragraph_getHeight = Module["_paragraph_getHeight"] = function () {
      return (_paragraph_getHeight = Module["_paragraph_getHeight"] = Module["asm"]["paragraph_getHeight"]).apply(null, arguments);
    };
    var _paragraph_getLongestLine = Module["_paragraph_getLongestLine"] = function () {
      return (_paragraph_getLongestLine = Module["_paragraph_getLongestLine"] = Module["asm"]["paragraph_getLongestLine"]).apply(null, arguments);
    };
    var _paragraph_getMinIntrinsicWidth = Module["_paragraph_getMinIntrinsicWidth"] = function () {
      return (_paragraph_getMinIntrinsicWidth = Module["_paragraph_getMinIntrinsicWidth"] = Module["asm"]["paragraph_getMinIntrinsicWidth"]).apply(null, arguments);
    };
    var _paragraph_getMaxIntrinsicWidth = Module["_paragraph_getMaxIntrinsicWidth"] = function () {
      return (_paragraph_getMaxIntrinsicWidth = Module["_paragraph_getMaxIntrinsicWidth"] = Module["asm"]["paragraph_getMaxIntrinsicWidth"]).apply(null, arguments);
    };
    var _paragraph_getAlphabeticBaseline = Module["_paragraph_getAlphabeticBaseline"] = function () {
      return (_paragraph_getAlphabeticBaseline = Module["_paragraph_getAlphabeticBaseline"] = Module["asm"]["paragraph_getAlphabeticBaseline"]).apply(null, arguments);
    };
    var _paragraph_getIdeographicBaseline = Module["_paragraph_getIdeographicBaseline"] = function () {
      return (_paragraph_getIdeographicBaseline = Module["_paragraph_getIdeographicBaseline"] = Module["asm"]["paragraph_getIdeographicBaseline"]).apply(null, arguments);
    };
    var _paragraph_getDidExceedMaxLines = Module["_paragraph_getDidExceedMaxLines"] = function () {
      return (_paragraph_getDidExceedMaxLines = Module["_paragraph_getDidExceedMaxLines"] = Module["asm"]["paragraph_getDidExceedMaxLines"]).apply(null, arguments);
    };
    var _paragraph_layout = Module["_paragraph_layout"] = function () {
      return (_paragraph_layout = Module["_paragraph_layout"] = Module["asm"]["paragraph_layout"]).apply(null, arguments);
    };
    var _paragraph_getPositionForOffset = Module["_paragraph_getPositionForOffset"] = function () {
      return (_paragraph_getPositionForOffset = Module["_paragraph_getPositionForOffset"] = Module["asm"]["paragraph_getPositionForOffset"]).apply(null, arguments);
    };
    var _paragraph_getWordBoundary = Module["_paragraph_getWordBoundary"] = function () {
      return (_paragraph_getWordBoundary = Module["_paragraph_getWordBoundary"] = Module["asm"]["paragraph_getWordBoundary"]).apply(null, arguments);
    };
    var _paragraph_getLineCount = Module["_paragraph_getLineCount"] = function () {
      return (_paragraph_getLineCount = Module["_paragraph_getLineCount"] = Module["asm"]["paragraph_getLineCount"]).apply(null, arguments);
    };
    var _paragraph_getLineNumberAt = Module["_paragraph_getLineNumberAt"] = function () {
      return (_paragraph_getLineNumberAt = Module["_paragraph_getLineNumberAt"] = Module["asm"]["paragraph_getLineNumberAt"]).apply(null, arguments);
    };
    var _paragraph_getLineMetricsAtIndex = Module["_paragraph_getLineMetricsAtIndex"] = function () {
      return (_paragraph_getLineMetricsAtIndex = Module["_paragraph_getLineMetricsAtIndex"] = Module["asm"]["paragraph_getLineMetricsAtIndex"]).apply(null, arguments);
    };
    var _textBoxList_dispose = Module["_textBoxList_dispose"] = function () {
      return (_textBoxList_dispose = Module["_textBoxList_dispose"] = Module["asm"]["textBoxList_dispose"]).apply(null, arguments);
    };
    var _textBoxList_getLength = Module["_textBoxList_getLength"] = function () {
      return (_textBoxList_getLength = Module["_textBoxList_getLength"] = Module["asm"]["textBoxList_getLength"]).apply(null, arguments);
    };
    var _textBoxList_getBoxAtIndex = Module["_textBoxList_getBoxAtIndex"] = function () {
      return (_textBoxList_getBoxAtIndex = Module["_textBoxList_getBoxAtIndex"] = Module["asm"]["textBoxList_getBoxAtIndex"]).apply(null, arguments);
    };
    var _paragraph_getBoxesForRange = Module["_paragraph_getBoxesForRange"] = function () {
      return (_paragraph_getBoxesForRange = Module["_paragraph_getBoxesForRange"] = Module["asm"]["paragraph_getBoxesForRange"]).apply(null, arguments);
    };
    var _paragraph_getBoxesForPlaceholders = Module["_paragraph_getBoxesForPlaceholders"] = function () {
      return (_paragraph_getBoxesForPlaceholders = Module["_paragraph_getBoxesForPlaceholders"] = Module["asm"]["paragraph_getBoxesForPlaceholders"]).apply(null, arguments);
    };
    var _paragraph_getUnresolvedCodePoints = Module["_paragraph_getUnresolvedCodePoints"] = function () {
      return (_paragraph_getUnresolvedCodePoints = Module["_paragraph_getUnresolvedCodePoints"] = Module["asm"]["paragraph_getUnresolvedCodePoints"]).apply(null, arguments);
    };
    var _paragraphBuilder_create = Module["_paragraphBuilder_create"] = function () {
      return (_paragraphBuilder_create = Module["_paragraphBuilder_create"] = Module["asm"]["paragraphBuilder_create"]).apply(null, arguments);
    };
    var _paragraphBuilder_dispose = Module["_paragraphBuilder_dispose"] = function () {
      return (_paragraphBuilder_dispose = Module["_paragraphBuilder_dispose"] = Module["asm"]["paragraphBuilder_dispose"]).apply(null, arguments);
    };
    var _paragraphBuilder_addPlaceholder = Module["_paragraphBuilder_addPlaceholder"] = function () {
      return (_paragraphBuilder_addPlaceholder = Module["_paragraphBuilder_addPlaceholder"] = Module["asm"]["paragraphBuilder_addPlaceholder"]).apply(null, arguments);
    };
    var _paragraphBuilder_addText = Module["_paragraphBuilder_addText"] = function () {
      return (_paragraphBuilder_addText = Module["_paragraphBuilder_addText"] = Module["asm"]["paragraphBuilder_addText"]).apply(null, arguments);
    };
    var _paragraphBuilder_getUtf8Text = Module["_paragraphBuilder_getUtf8Text"] = function () {
      return (_paragraphBuilder_getUtf8Text = Module["_paragraphBuilder_getUtf8Text"] = Module["asm"]["paragraphBuilder_getUtf8Text"]).apply(null, arguments);
    };
    var _paragraphBuilder_pushStyle = Module["_paragraphBuilder_pushStyle"] = function () {
      return (_paragraphBuilder_pushStyle = Module["_paragraphBuilder_pushStyle"] = Module["asm"]["paragraphBuilder_pushStyle"]).apply(null, arguments);
    };
    var _paragraphBuilder_pop = Module["_paragraphBuilder_pop"] = function () {
      return (_paragraphBuilder_pop = Module["_paragraphBuilder_pop"] = Module["asm"]["paragraphBuilder_pop"]).apply(null, arguments);
    };
    var _paragraphBuilder_build = Module["_paragraphBuilder_build"] = function () {
      return (_paragraphBuilder_build = Module["_paragraphBuilder_build"] = Module["asm"]["paragraphBuilder_build"]).apply(null, arguments);
    };
    var _unicodePositionBuffer_create = Module["_unicodePositionBuffer_create"] = function () {
      return (_unicodePositionBuffer_create = Module["_unicodePositionBuffer_create"] = Module["asm"]["unicodePositionBuffer_create"]).apply(null, arguments);
    };
    var _unicodePositionBuffer_getDataPointer = Module["_unicodePositionBuffer_getDataPointer"] = function () {
      return (_unicodePositionBuffer_getDataPointer = Module["_unicodePositionBuffer_getDataPointer"] = Module["asm"]["unicodePositionBuffer_getDataPointer"]).apply(null, arguments);
    };
    var _unicodePositionBuffer_free = Module["_unicodePositionBuffer_free"] = function () {
      return (_unicodePositionBuffer_free = Module["_unicodePositionBuffer_free"] = Module["asm"]["unicodePositionBuffer_free"]).apply(null, arguments);
    };
    var _lineBreakBuffer_create = Module["_lineBreakBuffer_create"] = function () {
      return (_lineBreakBuffer_create = Module["_lineBreakBuffer_create"] = Module["asm"]["lineBreakBuffer_create"]).apply(null, arguments);
    };
    var _lineBreakBuffer_getDataPointer = Module["_lineBreakBuffer_getDataPointer"] = function () {
      return (_lineBreakBuffer_getDataPointer = Module["_lineBreakBuffer_getDataPointer"] = Module["asm"]["lineBreakBuffer_getDataPointer"]).apply(null, arguments);
    };
    var _lineBreakBuffer_free = Module["_lineBreakBuffer_free"] = function () {
      return (_lineBreakBuffer_free = Module["_lineBreakBuffer_free"] = Module["asm"]["lineBreakBuffer_free"]).apply(null, arguments);
    };
    var _paragraphBuilder_setGraphemeBreaksUtf16 = Module["_paragraphBuilder_setGraphemeBreaksUtf16"] = function () {
      return (_paragraphBuilder_setGraphemeBreaksUtf16 = Module["_paragraphBuilder_setGraphemeBreaksUtf16"] = Module["asm"]["paragraphBuilder_setGraphemeBreaksUtf16"]).apply(null, arguments);
    };
    var _paragraphBuilder_setWordBreaksUtf16 = Module["_paragraphBuilder_setWordBreaksUtf16"] = function () {
      return (_paragraphBuilder_setWordBreaksUtf16 = Module["_paragraphBuilder_setWordBreaksUtf16"] = Module["asm"]["paragraphBuilder_setWordBreaksUtf16"]).apply(null, arguments);
    };
    var _paragraphBuilder_setLineBreaksUtf16 = Module["_paragraphBuilder_setLineBreaksUtf16"] = function () {
      return (_paragraphBuilder_setLineBreaksUtf16 = Module["_paragraphBuilder_setLineBreaksUtf16"] = Module["asm"]["paragraphBuilder_setLineBreaksUtf16"]).apply(null, arguments);
    };
    var _paragraphStyle_create = Module["_paragraphStyle_create"] = function () {
      return (_paragraphStyle_create = Module["_paragraphStyle_create"] = Module["asm"]["paragraphStyle_create"]).apply(null, arguments);
    };
    var _paragraphStyle_dispose = Module["_paragraphStyle_dispose"] = function () {
      return (_paragraphStyle_dispose = Module["_paragraphStyle_dispose"] = Module["asm"]["paragraphStyle_dispose"]).apply(null, arguments);
    };
    var _paragraphStyle_setTextAlign = Module["_paragraphStyle_setTextAlign"] = function () {
      return (_paragraphStyle_setTextAlign = Module["_paragraphStyle_setTextAlign"] = Module["asm"]["paragraphStyle_setTextAlign"]).apply(null, arguments);
    };
    var _paragraphStyle_setTextDirection = Module["_paragraphStyle_setTextDirection"] = function () {
      return (_paragraphStyle_setTextDirection = Module["_paragraphStyle_setTextDirection"] = Module["asm"]["paragraphStyle_setTextDirection"]).apply(null, arguments);
    };
    var _paragraphStyle_setMaxLines = Module["_paragraphStyle_setMaxLines"] = function () {
      return (_paragraphStyle_setMaxLines = Module["_paragraphStyle_setMaxLines"] = Module["asm"]["paragraphStyle_setMaxLines"]).apply(null, arguments);
    };
    var _paragraphStyle_setHeight = Module["_paragraphStyle_setHeight"] = function () {
      return (_paragraphStyle_setHeight = Module["_paragraphStyle_setHeight"] = Module["asm"]["paragraphStyle_setHeight"]).apply(null, arguments);
    };
    var _paragraphStyle_setTextHeightBehavior = Module["_paragraphStyle_setTextHeightBehavior"] = function () {
      return (_paragraphStyle_setTextHeightBehavior = Module["_paragraphStyle_setTextHeightBehavior"] = Module["asm"]["paragraphStyle_setTextHeightBehavior"]).apply(null, arguments);
    };
    var _paragraphStyle_setEllipsis = Module["_paragraphStyle_setEllipsis"] = function () {
      return (_paragraphStyle_setEllipsis = Module["_paragraphStyle_setEllipsis"] = Module["asm"]["paragraphStyle_setEllipsis"]).apply(null, arguments);
    };
    var _paragraphStyle_setStrutStyle = Module["_paragraphStyle_setStrutStyle"] = function () {
      return (_paragraphStyle_setStrutStyle = Module["_paragraphStyle_setStrutStyle"] = Module["asm"]["paragraphStyle_setStrutStyle"]).apply(null, arguments);
    };
    var _paragraphStyle_setTextStyle = Module["_paragraphStyle_setTextStyle"] = function () {
      return (_paragraphStyle_setTextStyle = Module["_paragraphStyle_setTextStyle"] = Module["asm"]["paragraphStyle_setTextStyle"]).apply(null, arguments);
    };
    var _strutStyle_create = Module["_strutStyle_create"] = function () {
      return (_strutStyle_create = Module["_strutStyle_create"] = Module["asm"]["strutStyle_create"]).apply(null, arguments);
    };
    var _strutStyle_dispose = Module["_strutStyle_dispose"] = function () {
      return (_strutStyle_dispose = Module["_strutStyle_dispose"] = Module["asm"]["strutStyle_dispose"]).apply(null, arguments);
    };
    var _strutStyle_setFontFamilies = Module["_strutStyle_setFontFamilies"] = function () {
      return (_strutStyle_setFontFamilies = Module["_strutStyle_setFontFamilies"] = Module["asm"]["strutStyle_setFontFamilies"]).apply(null, arguments);
    };
    var _strutStyle_setFontSize = Module["_strutStyle_setFontSize"] = function () {
      return (_strutStyle_setFontSize = Module["_strutStyle_setFontSize"] = Module["asm"]["strutStyle_setFontSize"]).apply(null, arguments);
    };
    var _strutStyle_setHeight = Module["_strutStyle_setHeight"] = function () {
      return (_strutStyle_setHeight = Module["_strutStyle_setHeight"] = Module["asm"]["strutStyle_setHeight"]).apply(null, arguments);
    };
    var _strutStyle_setHalfLeading = Module["_strutStyle_setHalfLeading"] = function () {
      return (_strutStyle_setHalfLeading = Module["_strutStyle_setHalfLeading"] = Module["asm"]["strutStyle_setHalfLeading"]).apply(null, arguments);
    };
    var _strutStyle_setLeading = Module["_strutStyle_setLeading"] = function () {
      return (_strutStyle_setLeading = Module["_strutStyle_setLeading"] = Module["asm"]["strutStyle_setLeading"]).apply(null, arguments);
    };
    var _strutStyle_setFontStyle = Module["_strutStyle_setFontStyle"] = function () {
      return (_strutStyle_setFontStyle = Module["_strutStyle_setFontStyle"] = Module["asm"]["strutStyle_setFontStyle"]).apply(null, arguments);
    };
    var _strutStyle_setForceStrutHeight = Module["_strutStyle_setForceStrutHeight"] = function () {
      return (_strutStyle_setForceStrutHeight = Module["_strutStyle_setForceStrutHeight"] = Module["asm"]["strutStyle_setForceStrutHeight"]).apply(null, arguments);
    };
    var _textStyle_create = Module["_textStyle_create"] = function () {
      return (_textStyle_create = Module["_textStyle_create"] = Module["asm"]["textStyle_create"]).apply(null, arguments);
    };
    var _textStyle_copy = Module["_textStyle_copy"] = function () {
      return (_textStyle_copy = Module["_textStyle_copy"] = Module["asm"]["textStyle_copy"]).apply(null, arguments);
    };
    var _textStyle_dispose = Module["_textStyle_dispose"] = function () {
      return (_textStyle_dispose = Module["_textStyle_dispose"] = Module["asm"]["textStyle_dispose"]).apply(null, arguments);
    };
    var _textStyle_setColor = Module["_textStyle_setColor"] = function () {
      return (_textStyle_setColor = Module["_textStyle_setColor"] = Module["asm"]["textStyle_setColor"]).apply(null, arguments);
    };
    var _textStyle_setDecoration = Module["_textStyle_setDecoration"] = function () {
      return (_textStyle_setDecoration = Module["_textStyle_setDecoration"] = Module["asm"]["textStyle_setDecoration"]).apply(null, arguments);
    };
    var _textStyle_setDecorationColor = Module["_textStyle_setDecorationColor"] = function () {
      return (_textStyle_setDecorationColor = Module["_textStyle_setDecorationColor"] = Module["asm"]["textStyle_setDecorationColor"]).apply(null, arguments);
    };
    var _textStyle_setDecorationStyle = Module["_textStyle_setDecorationStyle"] = function () {
      return (_textStyle_setDecorationStyle = Module["_textStyle_setDecorationStyle"] = Module["asm"]["textStyle_setDecorationStyle"]).apply(null, arguments);
    };
    var _textStyle_setDecorationThickness = Module["_textStyle_setDecorationThickness"] = function () {
      return (_textStyle_setDecorationThickness = Module["_textStyle_setDecorationThickness"] = Module["asm"]["textStyle_setDecorationThickness"]).apply(null, arguments);
    };
    var _textStyle_setFontStyle = Module["_textStyle_setFontStyle"] = function () {
      return (_textStyle_setFontStyle = Module["_textStyle_setFontStyle"] = Module["asm"]["textStyle_setFontStyle"]).apply(null, arguments);
    };
    var _textStyle_setTextBaseline = Module["_textStyle_setTextBaseline"] = function () {
      return (_textStyle_setTextBaseline = Module["_textStyle_setTextBaseline"] = Module["asm"]["textStyle_setTextBaseline"]).apply(null, arguments);
    };
    var _textStyle_clearFontFamilies = Module["_textStyle_clearFontFamilies"] = function () {
      return (_textStyle_clearFontFamilies = Module["_textStyle_clearFontFamilies"] = Module["asm"]["textStyle_clearFontFamilies"]).apply(null, arguments);
    };
    var _textStyle_addFontFamilies = Module["_textStyle_addFontFamilies"] = function () {
      return (_textStyle_addFontFamilies = Module["_textStyle_addFontFamilies"] = Module["asm"]["textStyle_addFontFamilies"]).apply(null, arguments);
    };
    var _textStyle_setFontSize = Module["_textStyle_setFontSize"] = function () {
      return (_textStyle_setFontSize = Module["_textStyle_setFontSize"] = Module["asm"]["textStyle_setFontSize"]).apply(null, arguments);
    };
    var _textStyle_setLetterSpacing = Module["_textStyle_setLetterSpacing"] = function () {
      return (_textStyle_setLetterSpacing = Module["_textStyle_setLetterSpacing"] = Module["asm"]["textStyle_setLetterSpacing"]).apply(null, arguments);
    };
    var _textStyle_setWordSpacing = Module["_textStyle_setWordSpacing"] = function () {
      return (_textStyle_setWordSpacing = Module["_textStyle_setWordSpacing"] = Module["asm"]["textStyle_setWordSpacing"]).apply(null, arguments);
    };
    var _textStyle_setHeight = Module["_textStyle_setHeight"] = function () {
      return (_textStyle_setHeight = Module["_textStyle_setHeight"] = Module["asm"]["textStyle_setHeight"]).apply(null, arguments);
    };
    var _textStyle_setHalfLeading = Module["_textStyle_setHalfLeading"] = function () {
      return (_textStyle_setHalfLeading = Module["_textStyle_setHalfLeading"] = Module["asm"]["textStyle_setHalfLeading"]).apply(null, arguments);
    };
    var _textStyle_setLocale = Module["_textStyle_setLocale"] = function () {
      return (_textStyle_setLocale = Module["_textStyle_setLocale"] = Module["asm"]["textStyle_setLocale"]).apply(null, arguments);
    };
    var _textStyle_setBackground = Module["_textStyle_setBackground"] = function () {
      return (_textStyle_setBackground = Module["_textStyle_setBackground"] = Module["asm"]["textStyle_setBackground"]).apply(null, arguments);
    };
    var _textStyle_setForeground = Module["_textStyle_setForeground"] = function () {
      return (_textStyle_setForeground = Module["_textStyle_setForeground"] = Module["asm"]["textStyle_setForeground"]).apply(null, arguments);
    };
    var _textStyle_addShadow = Module["_textStyle_addShadow"] = function () {
      return (_textStyle_addShadow = Module["_textStyle_addShadow"] = Module["asm"]["textStyle_addShadow"]).apply(null, arguments);
    };
    var _textStyle_addFontFeature = Module["_textStyle_addFontFeature"] = function () {
      return (_textStyle_addFontFeature = Module["_textStyle_addFontFeature"] = Module["asm"]["textStyle_addFontFeature"]).apply(null, arguments);
    };
    var _textStyle_setFontVariations = Module["_textStyle_setFontVariations"] = function () {
      return (_textStyle_setFontVariations = Module["_textStyle_setFontVariations"] = Module["asm"]["textStyle_setFontVariations"]).apply(null, arguments);
    };
    var _vertices_create = Module["_vertices_create"] = function () {
      return (_vertices_create = Module["_vertices_create"] = Module["asm"]["vertices_create"]).apply(null, arguments);
    };
    var _vertices_dispose = Module["_vertices_dispose"] = function () {
      return (_vertices_dispose = Module["_vertices_dispose"] = Module["asm"]["vertices_dispose"]).apply(null, arguments);
    };
    var ___errno_location = function () {
      return (___errno_location = Module["asm"]["__errno_location"]).apply(null, arguments);
    };
    var _pthread_self = Module["_pthread_self"] = function () {
      return (_pthread_self = Module["_pthread_self"] = Module["asm"]["pthread_self"]).apply(null, arguments);
    };
    var _free = function () {
      return (_free = Module["asm"]["free"]).apply(null, arguments);
    };
    var _malloc = function () {
      return (_malloc = Module["asm"]["malloc"]).apply(null, arguments);
    };
    var __emscripten_tls_init = Module["__emscripten_tls_init"] = function () {
      return (__emscripten_tls_init = Module["__emscripten_tls_init"] = Module["asm"]["_emscripten_tls_init"]).apply(null, arguments);
    };
    var ___dl_seterr = function () {
      return (___dl_seterr = Module["asm"]["__dl_seterr"]).apply(null, arguments);
    };
    var __emscripten_thread_init = Module["__emscripten_thread_init"] = function () {
      return (__emscripten_thread_init = Module["__emscripten_thread_init"] = Module["asm"]["_emscripten_thread_init"]).apply(null, arguments);
    };
    var __emscripten_thread_crashed = Module["__emscripten_thread_crashed"] = function () {
      return (__emscripten_thread_crashed = Module["__emscripten_thread_crashed"] = Module["asm"]["_emscripten_thread_crashed"]).apply(null, arguments);
    };
    var _emscripten_main_thread_process_queued_calls = function () {
      return (_emscripten_main_thread_process_queued_calls = Module["asm"]["emscripten_main_thread_process_queued_calls"]).apply(null, arguments);
    };
    var _emscripten_main_browser_thread_id = function () {
      return (_emscripten_main_browser_thread_id = Module["asm"]["emscripten_main_browser_thread_id"]).apply(null, arguments);
    };
    var __emscripten_run_in_main_runtime_thread_js = function () {
      return (__emscripten_run_in_main_runtime_thread_js = Module["asm"]["_emscripten_run_in_main_runtime_thread_js"]).apply(null, arguments);
    };
    var __emscripten_proxy_execute_task_queue = Module["__emscripten_proxy_execute_task_queue"] = function () {
      return (__emscripten_proxy_execute_task_queue = Module["__emscripten_proxy_execute_task_queue"] = Module["asm"]["_emscripten_proxy_execute_task_queue"]).apply(null, arguments);
    };
    var __emscripten_thread_free_data = function () {
      return (__emscripten_thread_free_data = Module["asm"]["_emscripten_thread_free_data"]).apply(null, arguments);
    };
    var __emscripten_thread_exit = Module["__emscripten_thread_exit"] = function () {
      return (__emscripten_thread_exit = Module["__emscripten_thread_exit"] = Module["asm"]["_emscripten_thread_exit"]).apply(null, arguments);
    };
    var _setThrew = function () {
      return (_setThrew = Module["asm"]["setThrew"]).apply(null, arguments);
    };
    var _saveSetjmp = function () {
      return (_saveSetjmp = Module["asm"]["saveSetjmp"]).apply(null, arguments);
    };
    var _emscripten_stack_set_limits = function () {
      return (_emscripten_stack_set_limits = Module["asm"]["emscripten_stack_set_limits"]).apply(null, arguments);
    };
    var stackSave = function () {
      return (stackSave = Module["asm"]["stackSave"]).apply(null, arguments);
    };
    var stackRestore = function () {
      return (stackRestore = Module["asm"]["stackRestore"]).apply(null, arguments);
    };
    var stackAlloc = Module["stackAlloc"] = function () {
      return (stackAlloc = Module["stackAlloc"] = Module["asm"]["stackAlloc"]).apply(null, arguments);
    };
    var ___cxa_is_pointer_type = function () {
      return (___cxa_is_pointer_type = Module["asm"]["__cxa_is_pointer_type"]).apply(null, arguments);
    };
    function invoke_iii(index, a1, a2) {
      var sp = stackSave();
      try {
        return getWasmTableEntry(index)(a1, a2);
      } catch (e) {
        stackRestore(sp);
        if (e !== e + 0) throw e;
        _setThrew(1, 0);
      }
    }
    function invoke_iiiii(index, a1, a2, a3, a4) {
      var sp = stackSave();
      try {
        return getWasmTableEntry(index)(a1, a2, a3, a4);
      } catch (e) {
        stackRestore(sp);
        if (e !== e + 0) throw e;
        _setThrew(1, 0);
      }
    }
    function invoke_vii(index, a1, a2) {
      var sp = stackSave();
      try {
        getWasmTableEntry(index)(a1, a2);
      } catch (e) {
        stackRestore(sp);
        if (e !== e + 0) throw e;
        _setThrew(1, 0);
      }
    }
    function invoke_ii(index, a1) {
      var sp = stackSave();
      try {
        return getWasmTableEntry(index)(a1);
      } catch (e) {
        stackRestore(sp);
        if (e !== e + 0) throw e;
        _setThrew(1, 0);
      }
    }
    function invoke_viiiiiiiii(index, a1, a2, a3, a4, a5, a6, a7, a8, a9) {
      var sp = stackSave();
      try {
        getWasmTableEntry(index)(a1, a2, a3, a4, a5, a6, a7, a8, a9);
      } catch (e) {
        stackRestore(sp);
        if (e !== e + 0) throw e;
        _setThrew(1, 0);
      }
    }
    function invoke_v(index) {
      var sp = stackSave();
      try {
        getWasmTableEntry(index)();
      } catch (e) {
        stackRestore(sp);
        if (e !== e + 0) throw e;
        _setThrew(1, 0);
      }
    }
    function invoke_vi(index, a1) {
      var sp = stackSave();
      try {
        getWasmTableEntry(index)(a1);
      } catch (e) {
        stackRestore(sp);
        if (e !== e + 0) throw e;
        _setThrew(1, 0);
      }
    }
    function invoke_iiii(index, a1, a2, a3) {
      var sp = stackSave();
      try {
        return getWasmTableEntry(index)(a1, a2, a3);
      } catch (e) {
        stackRestore(sp);
        if (e !== e + 0) throw e;
        _setThrew(1, 0);
      }
    }
    function invoke_i(index) {
      var sp = stackSave();
      try {
        return getWasmTableEntry(index)();
      } catch (e) {
        stackRestore(sp);
        if (e !== e + 0) throw e;
        _setThrew(1, 0);
      }
    }
    function invoke_viii(index, a1, a2, a3) {
      var sp = stackSave();
      try {
        getWasmTableEntry(index)(a1, a2, a3);
      } catch (e) {
        stackRestore(sp);
        if (e !== e + 0) throw e;
        _setThrew(1, 0);
      }
    }
    function invoke_iiiiiii(index, a1, a2, a3, a4, a5, a6) {
      var sp = stackSave();
      try {
        return getWasmTableEntry(index)(a1, a2, a3, a4, a5, a6);
      } catch (e) {
        stackRestore(sp);
        if (e !== e + 0) throw e;
        _setThrew(1, 0);
      }
    }
    function invoke_iiiiii(index, a1, a2, a3, a4, a5) {
      var sp = stackSave();
      try {
        return getWasmTableEntry(index)(a1, a2, a3, a4, a5);
      } catch (e) {
        stackRestore(sp);
        if (e !== e + 0) throw e;
        _setThrew(1, 0);
      }
    }
    function invoke_viiii(index, a1, a2, a3, a4) {
      var sp = stackSave();
      try {
        getWasmTableEntry(index)(a1, a2, a3, a4);
      } catch (e) {
        stackRestore(sp);
        if (e !== e + 0) throw e;
        _setThrew(1, 0);
      }
    }
    function invoke_viiiiii(index, a1, a2, a3, a4, a5, a6) {
      var sp = stackSave();
      try {
        getWasmTableEntry(index)(a1, a2, a3, a4, a5, a6);
      } catch (e) {
        stackRestore(sp);
        if (e !== e + 0) throw e;
        _setThrew(1, 0);
      }
    }
    function invoke_viiiiiii(index, a1, a2, a3, a4, a5, a6, a7) {
      var sp = stackSave();
      try {
        getWasmTableEntry(index)(a1, a2, a3, a4, a5, a6, a7);
      } catch (e) {
        stackRestore(sp);
        if (e !== e + 0) throw e;
        _setThrew(1, 0);
      }
    }
    Module["keepRuntimeAlive"] = keepRuntimeAlive;
    Module["wasmMemory"] = wasmMemory;
    Module["addFunction"] = addFunction;
    Module["removeFunction"] = removeFunction;
    Module["ExitStatus"] = ExitStatus;
    Module["PThread"] = PThread;
    Module["skwasm_registerObject"] = skwasm_registerObject;
    Module["skwasm_unregisterObject"] = skwasm_unregisterObject;
    Module["skwasm_getObject"] = skwasm_getObject;
    Module["skwasm_transferObjectToThread"] = skwasm_transferObjectToThread;
    var calledRun;
    dependenciesFulfilled = function runCaller() {
      if (!calledRun) run();
      if (!calledRun) dependenciesFulfilled = runCaller;
    };
    function run() {
      if (runDependencies > 0) {
        return;
      }
      if (ENVIRONMENT_IS_PTHREAD) {
        readyPromiseResolve(Module);
        initRuntime();
        startWorker(Module);
        return;
      }
      preRun();
      if (runDependencies > 0) {
        return;
      }
      function doRun() {
        if (calledRun) return;
        calledRun = true;
        Module["calledRun"] = true;
        if (ABORT) return;
        initRuntime();
        readyPromiseResolve(Module);
        if (Module["onRuntimeInitialized"]) Module["onRuntimeInitialized"]();
        postRun();
      }
      if (Module["setStatus"]) {
        Module["setStatus"]("Running...");
        setTimeout(function () {
          setTimeout(function () {
            Module["setStatus"]("");
          }, 1);
          doRun();
        }, 1);
      } else {
        doRun();
      }
    }
    if (Module["preInit"]) {
      if (typeof Module["preInit"] == "function") Module["preInit"] = [Module["preInit"]];
      while (Module["preInit"].length > 0) {
        Module["preInit"].pop()();
      }
    }
    run();
    return skwasm.ready;
  };
})();
if (typeof exports === 'object' && typeof module === 'object') module.exports = skwasm;else if (typeof define === 'function' && define['amd']) define([], function () {
  return skwasm;
});else if (typeof exports === 'object') exports["skwasm"] = skwasm;