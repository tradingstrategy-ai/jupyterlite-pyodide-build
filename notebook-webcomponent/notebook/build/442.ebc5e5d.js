var __webpack_exports__ = {};

;// CONCATENATED MODULE: ./node_modules/comlink/dist/esm/comlink.mjs
/**
 * Copyright 2019 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *     http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const proxyMarker = Symbol("Comlink.proxy");
const createEndpoint = Symbol("Comlink.endpoint");
const releaseProxy = Symbol("Comlink.releaseProxy");
const throwMarker = Symbol("Comlink.thrown");
const isObject = (val) => (typeof val === "object" && val !== null) || typeof val === "function";
/**
 * Internal transfer handle to handle objects marked to proxy.
 */
const proxyTransferHandler = {
    canHandle: (val) => isObject(val) && val[proxyMarker],
    serialize(obj) {
        const { port1, port2 } = new MessageChannel();
        expose(obj, port1);
        return [port2, [port2]];
    },
    deserialize(port) {
        port.start();
        return wrap(port);
    },
};
/**
 * Internal transfer handler to handle thrown exceptions.
 */
const throwTransferHandler = {
    canHandle: (value) => isObject(value) && throwMarker in value,
    serialize({ value }) {
        let serialized;
        if (value instanceof Error) {
            serialized = {
                isError: true,
                value: {
                    message: value.message,
                    name: value.name,
                    stack: value.stack,
                },
            };
        }
        else {
            serialized = { isError: false, value };
        }
        return [serialized, []];
    },
    deserialize(serialized) {
        if (serialized.isError) {
            throw Object.assign(new Error(serialized.value.message), serialized.value);
        }
        throw serialized.value;
    },
};
/**
 * Allows customizing the serialization of certain values.
 */
const transferHandlers = new Map([
    ["proxy", proxyTransferHandler],
    ["throw", throwTransferHandler],
]);
function expose(obj, ep = self) {
    ep.addEventListener("message", function callback(ev) {
        if (!ev || !ev.data) {
            return;
        }
        const { id, type, path } = Object.assign({ path: [] }, ev.data);
        const argumentList = (ev.data.argumentList || []).map(fromWireValue);
        let returnValue;
        try {
            const parent = path.slice(0, -1).reduce((obj, prop) => obj[prop], obj);
            const rawValue = path.reduce((obj, prop) => obj[prop], obj);
            switch (type) {
                case "GET" /* GET */:
                    {
                        returnValue = rawValue;
                    }
                    break;
                case "SET" /* SET */:
                    {
                        parent[path.slice(-1)[0]] = fromWireValue(ev.data.value);
                        returnValue = true;
                    }
                    break;
                case "APPLY" /* APPLY */:
                    {
                        returnValue = rawValue.apply(parent, argumentList);
                    }
                    break;
                case "CONSTRUCT" /* CONSTRUCT */:
                    {
                        const value = new rawValue(...argumentList);
                        returnValue = proxy(value);
                    }
                    break;
                case "ENDPOINT" /* ENDPOINT */:
                    {
                        const { port1, port2 } = new MessageChannel();
                        expose(obj, port2);
                        returnValue = transfer(port1, [port1]);
                    }
                    break;
                case "RELEASE" /* RELEASE */:
                    {
                        returnValue = undefined;
                    }
                    break;
                default:
                    return;
            }
        }
        catch (value) {
            returnValue = { value, [throwMarker]: 0 };
        }
        Promise.resolve(returnValue)
            .catch((value) => {
            return { value, [throwMarker]: 0 };
        })
            .then((returnValue) => {
            const [wireValue, transferables] = toWireValue(returnValue);
            ep.postMessage(Object.assign(Object.assign({}, wireValue), { id }), transferables);
            if (type === "RELEASE" /* RELEASE */) {
                // detach and deactive after sending release response above.
                ep.removeEventListener("message", callback);
                closeEndPoint(ep);
            }
        });
    });
    if (ep.start) {
        ep.start();
    }
}
function isMessagePort(endpoint) {
    return endpoint.constructor.name === "MessagePort";
}
function closeEndPoint(endpoint) {
    if (isMessagePort(endpoint))
        endpoint.close();
}
function wrap(ep, target) {
    return createProxy(ep, [], target);
}
function throwIfProxyReleased(isReleased) {
    if (isReleased) {
        throw new Error("Proxy has been released and is not useable");
    }
}
function createProxy(ep, path = [], target = function () { }) {
    let isProxyReleased = false;
    const proxy = new Proxy(target, {
        get(_target, prop) {
            throwIfProxyReleased(isProxyReleased);
            if (prop === releaseProxy) {
                return () => {
                    return requestResponseMessage(ep, {
                        type: "RELEASE" /* RELEASE */,
                        path: path.map((p) => p.toString()),
                    }).then(() => {
                        closeEndPoint(ep);
                        isProxyReleased = true;
                    });
                };
            }
            if (prop === "then") {
                if (path.length === 0) {
                    return { then: () => proxy };
                }
                const r = requestResponseMessage(ep, {
                    type: "GET" /* GET */,
                    path: path.map((p) => p.toString()),
                }).then(fromWireValue);
                return r.then.bind(r);
            }
            return createProxy(ep, [...path, prop]);
        },
        set(_target, prop, rawValue) {
            throwIfProxyReleased(isProxyReleased);
            // FIXME: ES6 Proxy Handler `set` methods are supposed to return a
            // boolean. To show good will, we return true asynchronously ¯\_(ツ)_/¯
            const [value, transferables] = toWireValue(rawValue);
            return requestResponseMessage(ep, {
                type: "SET" /* SET */,
                path: [...path, prop].map((p) => p.toString()),
                value,
            }, transferables).then(fromWireValue);
        },
        apply(_target, _thisArg, rawArgumentList) {
            throwIfProxyReleased(isProxyReleased);
            const last = path[path.length - 1];
            if (last === createEndpoint) {
                return requestResponseMessage(ep, {
                    type: "ENDPOINT" /* ENDPOINT */,
                }).then(fromWireValue);
            }
            // We just pretend that `bind()` didn’t happen.
            if (last === "bind") {
                return createProxy(ep, path.slice(0, -1));
            }
            const [argumentList, transferables] = processArguments(rawArgumentList);
            return requestResponseMessage(ep, {
                type: "APPLY" /* APPLY */,
                path: path.map((p) => p.toString()),
                argumentList,
            }, transferables).then(fromWireValue);
        },
        construct(_target, rawArgumentList) {
            throwIfProxyReleased(isProxyReleased);
            const [argumentList, transferables] = processArguments(rawArgumentList);
            return requestResponseMessage(ep, {
                type: "CONSTRUCT" /* CONSTRUCT */,
                path: path.map((p) => p.toString()),
                argumentList,
            }, transferables).then(fromWireValue);
        },
    });
    return proxy;
}
function myFlat(arr) {
    return Array.prototype.concat.apply([], arr);
}
function processArguments(argumentList) {
    const processed = argumentList.map(toWireValue);
    return [processed.map((v) => v[0]), myFlat(processed.map((v) => v[1]))];
}
const transferCache = new WeakMap();
function transfer(obj, transfers) {
    transferCache.set(obj, transfers);
    return obj;
}
function proxy(obj) {
    return Object.assign(obj, { [proxyMarker]: true });
}
function windowEndpoint(w, context = self, targetOrigin = "*") {
    return {
        postMessage: (msg, transferables) => w.postMessage(msg, targetOrigin, transferables),
        addEventListener: context.addEventListener.bind(context),
        removeEventListener: context.removeEventListener.bind(context),
    };
}
function toWireValue(value) {
    for (const [name, handler] of transferHandlers) {
        if (handler.canHandle(value)) {
            const [serializedValue, transferables] = handler.serialize(value);
            return [
                {
                    type: "HANDLER" /* HANDLER */,
                    name,
                    value: serializedValue,
                },
                transferables,
            ];
        }
    }
    return [
        {
            type: "RAW" /* RAW */,
            value,
        },
        transferCache.get(value) || [],
    ];
}
function fromWireValue(value) {
    switch (value.type) {
        case "HANDLER" /* HANDLER */:
            return transferHandlers.get(value.name).deserialize(value.value);
        case "RAW" /* RAW */:
            return value.value;
    }
}
function requestResponseMessage(ep, msg, transfers) {
    return new Promise((resolve) => {
        const id = generateUUID();
        ep.addEventListener("message", function l(ev) {
            if (!ev.data || !ev.data.id || ev.data.id !== id) {
                return;
            }
            ep.removeEventListener("message", l);
            resolve(ev.data);
        });
        if (ep.start) {
            ep.start();
        }
        ep.postMessage(Object.assign({ id }, msg), transfers);
    });
}
function generateUUID() {
    return new Array(4)
        .fill(0)
        .map(() => Math.floor(Math.random() * Number.MAX_SAFE_INTEGER).toString(16))
        .join("-");
}


//# sourceMappingURL=comlink.mjs.map

;// CONCATENATED MODULE: ./node_modules/@jupyterlite/contents/lib/drivefs.js
// Types and implementation inspired from https://github.com/jvilk/BrowserFS
// LICENSE: https://github.com/jvilk/BrowserFS/blob/8977a704ea469d05daf857e4818bef1f4f498326/LICENSE
// And from https://github.com/gzuidhof/starboard-notebook
// LICENSE: https://github.com/gzuidhof/starboard-notebook/blob/cd8d3fc30af4bd29cdd8f6b8c207df8138f5d5dd/LICENSE
const DIR_MODE = 16895; // 040777
const FILE_MODE = 33206; // 100666
const SEEK_CUR = 1;
const SEEK_END = 2;
const DRIVE_SEPARATOR = ':';
const encoder = new TextEncoder();
const decoder = new TextDecoder('utf-8');
// Mapping flag -> do we need to overwrite the file upon closing it
const flagNeedsWrite = {
    0 /*O_RDONLY*/: false,
    1 /*O_WRONLY*/: true,
    2 /*O_RDWR*/: true,
    64 /*O_CREAT*/: true,
    65 /*O_WRONLY|O_CREAT*/: true,
    66 /*O_RDWR|O_CREAT*/: true,
    129 /*O_WRONLY|O_EXCL*/: true,
    193 /*O_WRONLY|O_CREAT|O_EXCL*/: true,
    514 /*O_RDWR|O_TRUNC*/: true,
    577 /*O_WRONLY|O_CREAT|O_TRUNC*/: true,
    578 /*O_CREAT|O_RDWR|O_TRUNC*/: true,
    705 /*O_WRONLY|O_CREAT|O_EXCL|O_TRUNC*/: true,
    706 /*O_RDWR|O_CREAT|O_EXCL|O_TRUNC*/: true,
    1024 /*O_APPEND*/: true,
    1025 /*O_WRONLY|O_APPEND*/: true,
    1026 /*O_RDWR|O_APPEND*/: true,
    1089 /*O_WRONLY|O_CREAT|O_APPEND*/: true,
    1090 /*O_RDWR|O_CREAT|O_APPEND*/: true,
    1153 /*O_WRONLY|O_EXCL|O_APPEND*/: true,
    1154 /*O_RDWR|O_EXCL|O_APPEND*/: true,
    1217 /*O_WRONLY|O_CREAT|O_EXCL|O_APPEND*/: true,
    1218 /*O_RDWR|O_CREAT|O_EXCL|O_APPEND*/: true,
    4096 /*O_RDONLY|O_DSYNC*/: true,
    4098 /*O_RDWR|O_DSYNC*/: true,
};
class DriveFSEmscriptenStreamOps {
    constructor(fs) {
        this.fs = fs;
    }
    open(stream) {
        const path = this.fs.realPath(stream.node);
        if (this.fs.FS.isFile(stream.node.mode)) {
            stream.file = this.fs.API.get(path);
        }
    }
    close(stream) {
        if (!this.fs.FS.isFile(stream.node.mode) || !stream.file) {
            return;
        }
        const path = this.fs.realPath(stream.node);
        const flags = stream.flags;
        let parsedFlags = typeof flags === 'string' ? parseInt(flags, 10) : flags;
        parsedFlags &= 0x1fff;
        let needsWrite = true;
        if (parsedFlags in flagNeedsWrite) {
            needsWrite = flagNeedsWrite[parsedFlags];
        }
        if (needsWrite) {
            this.fs.API.put(path, stream.file);
            stream.file = undefined;
        }
    }
    read(stream, buffer, offset, length, position) {
        var _a;
        if (length <= 0 || stream.file === undefined) {
            return 0;
        }
        const size = Math.min(((_a = stream.file.data.length) !== null && _a !== void 0 ? _a : 0) - position, length);
        try {
            buffer.set(stream.file.data.subarray(position, position + size), offset);
        }
        catch (e) {
            throw new this.fs.FS.ErrnoError(this.fs.ERRNO_CODES['EPERM']);
        }
        return size;
    }
    write(stream, buffer, offset, length, position) {
        var _a, _b;
        if (length <= 0 || stream.file === undefined) {
            return 0;
        }
        stream.node.timestamp = Date.now();
        try {
            if (position + length > ((_b = (_a = stream.file) === null || _a === void 0 ? void 0 : _a.data.length) !== null && _b !== void 0 ? _b : 0)) {
                const oldData = stream.file.data ? stream.file.data : new Uint8Array();
                stream.file.data = new Uint8Array(position + length);
                stream.file.data.set(oldData);
            }
            stream.file.data.set(buffer.subarray(offset, offset + length), position);
            return length;
        }
        catch (e) {
            throw new this.fs.FS.ErrnoError(this.fs.ERRNO_CODES['EPERM']);
        }
    }
    llseek(stream, offset, whence) {
        let position = offset;
        if (whence === SEEK_CUR) {
            position += stream.position;
        }
        else if (whence === SEEK_END) {
            if (this.fs.FS.isFile(stream.node.mode)) {
                if (stream.file !== undefined) {
                    position += stream.file.data.length;
                }
                else {
                    throw new this.fs.FS.ErrnoError(this.fs.ERRNO_CODES['EPERM']);
                }
            }
        }
        if (position < 0) {
            throw new this.fs.FS.ErrnoError(this.fs.ERRNO_CODES['EINVAL']);
        }
        return position;
    }
}
class DriveFSEmscriptenNodeOps {
    constructor(fs) {
        this.fs = fs;
    }
    getattr(node) {
        return this.fs.API.getattr(this.fs.realPath(node));
    }
    setattr(node, attr) {
        // TODO
    }
    lookup(parent, name) {
        const path = this.fs.PATH.join2(this.fs.realPath(parent), name);
        const result = this.fs.API.lookup(path);
        if (!result.ok) {
            throw this.fs.FS.genericErrors[this.fs.ERRNO_CODES['ENOENT']];
        }
        return this.fs.createNode(parent, name, result.mode);
    }
    mknod(parent, name, mode, dev) {
        const path = this.fs.PATH.join2(this.fs.realPath(parent), name);
        this.fs.API.mknod(path, mode);
        return this.fs.createNode(parent, name, mode, dev);
    }
    rename(oldNode, newDir, newName) {
        this.fs.API.rename(oldNode.parent
            ? this.fs.PATH.join2(this.fs.realPath(oldNode.parent), oldNode.name)
            : oldNode.name, this.fs.PATH.join2(this.fs.realPath(newDir), newName));
        // Updating the in-memory node
        oldNode.name = newName;
        oldNode.parent = newDir;
    }
    unlink(parent, name) {
        this.fs.API.rmdir(this.fs.PATH.join2(this.fs.realPath(parent), name));
    }
    rmdir(parent, name) {
        this.fs.API.rmdir(this.fs.PATH.join2(this.fs.realPath(parent), name));
    }
    readdir(node) {
        return this.fs.API.readdir(this.fs.realPath(node));
    }
    symlink(parent, newName, oldPath) {
        throw new this.fs.FS.ErrnoError(this.fs.ERRNO_CODES['EPERM']);
    }
    readlink(node) {
        throw new this.fs.FS.ErrnoError(this.fs.ERRNO_CODES['EPERM']);
    }
}
/**
 * Wrap ServiceWorker requests for an Emscripten-compatible synchronous API.
 */
class ContentsAPI {
    constructor(baseUrl, driveName, mountpoint, FS, ERRNO_CODES) {
        this._baseUrl = baseUrl;
        this._driveName = driveName;
        this._mountpoint = mountpoint;
        this.FS = FS;
        this.ERRNO_CODES = ERRNO_CODES;
    }
    request(method, path, data = null) {
        const xhr = new XMLHttpRequest();
        xhr.open(method, encodeURI(`${this.endpoint}${path}`), false);
        try {
            if (data === null) {
                xhr.send();
            }
            else {
                xhr.send(data);
            }
        }
        catch (e) {
            console.error(e);
        }
        if (xhr.status >= 400) {
            throw new this.FS.ErrnoError(this.ERRNO_CODES['EINVAL']);
        }
        return JSON.parse(xhr.responseText);
    }
    lookup(path) {
        return this.request('GET', `${this.normalizePath(path)}?m=lookup`);
    }
    getmode(path) {
        return Number.parseInt(this.request('GET', `${this.normalizePath(path)}?m=getmode`));
    }
    mknod(path, mode) {
        return this.request('GET', `${this.normalizePath(path)}?m=mknod&args=${mode}`);
    }
    rename(oldPath, newPath) {
        return this.request('GET', `${this.normalizePath(oldPath)}?m=rename&args=${this.normalizePath(newPath)}`);
    }
    readdir(path) {
        const dirlist = this.request('GET', `${this.normalizePath(path)}?m=readdir`);
        dirlist.push('.');
        dirlist.push('..');
        return dirlist;
    }
    rmdir(path) {
        return this.request('GET', `${this.normalizePath(path)}?m=rmdir`);
    }
    get(path) {
        const response = this.request('GET', `${this.normalizePath(path)}?m=get`);
        const serializedContent = response.content;
        const format = response.format;
        switch (format) {
            case 'json':
            case 'text':
                return {
                    data: encoder.encode(serializedContent),
                    format,
                };
            case 'base64': {
                const binString = atob(serializedContent);
                const len = binString.length;
                const data = new Uint8Array(len);
                for (let i = 0; i < len; i++) {
                    data[i] = binString.charCodeAt(i);
                }
                return {
                    data,
                    format,
                };
            }
            default:
                throw new this.FS.ErrnoError(this.ERRNO_CODES['ENOENT']);
        }
    }
    put(path, value) {
        switch (value.format) {
            case 'json':
            case 'text':
                return this.request('PUT', `${this.normalizePath(path)}?m=put&args=${value.format}`, decoder.decode(value.data));
            case 'base64': {
                let binary = '';
                for (let i = 0; i < value.data.byteLength; i++) {
                    binary += String.fromCharCode(value.data[i]);
                }
                return this.request('PUT', `${this.normalizePath(path)}?m=put&args=${value.format}`, btoa(binary));
            }
        }
    }
    getattr(path) {
        const stats = this.request('GET', `${this.normalizePath(path)}?m=getattr`);
        // Turn datetimes into proper objects
        stats.atime = new Date(stats.atime);
        stats.mtime = new Date(stats.mtime);
        stats.ctime = new Date(stats.ctime);
        return stats;
    }
    /**
     * Normalize a Path by making it compliant for the content manager
     *
     * @param path: the path relatively to the Emscripten drive
     */
    normalizePath(path) {
        // Remove mountpoint prefix
        if (path.startsWith(this._mountpoint)) {
            path = path.slice(this._mountpoint.length);
        }
        // Add JupyterLab drive name
        if (this._driveName) {
            path = `${this._driveName}${DRIVE_SEPARATOR}${path}`;
        }
        return path;
    }
    /**
     * Get the api/drive endpoint
     */
    get endpoint() {
        return `${this._baseUrl}api/drive/`;
    }
}
class DriveFS {
    constructor(options) {
        this.FS = options.FS;
        this.PATH = options.PATH;
        this.ERRNO_CODES = options.ERRNO_CODES;
        this.API = new ContentsAPI(options.baseUrl, options.driveName, options.mountpoint, this.FS, this.ERRNO_CODES);
        this.driveName = options.driveName;
        this.node_ops = new DriveFSEmscriptenNodeOps(this);
        this.stream_ops = new DriveFSEmscriptenStreamOps(this);
    }
    mount(mount) {
        return this.createNode(null, mount.mountpoint, DIR_MODE | 511, 0);
    }
    createNode(parent, name, mode, dev) {
        const FS = this.FS;
        if (!FS.isDir(mode) && !FS.isFile(mode)) {
            throw new FS.ErrnoError(this.ERRNO_CODES['EINVAL']);
        }
        const node = FS.createNode(parent, name, mode, dev);
        node.node_ops = this.node_ops;
        node.stream_ops = this.stream_ops;
        return node;
    }
    getMode(path) {
        return this.API.getmode(path);
    }
    realPath(node) {
        const parts = [];
        let currentNode = node;
        parts.push(currentNode.name);
        while (currentNode.parent !== currentNode) {
            currentNode = currentNode.parent;
            parts.push(currentNode.name);
        }
        parts.reverse();
        return this.PATH.join.apply(null, parts);
    }
}

;// CONCATENATED MODULE: ./node_modules/@jupyterlite/pyolite-kernel/lib/worker.js
// Copyright (c) Jupyter Development Team.
// Distributed under the terms of the Modified BSD License.

// TODO Once this https://github.com/pyodide/pyodide/pull/2582/files is released
// Remove this shameless copy
const ERRNO_CODES = {
    E2BIG: 1,
    EACCES: 2,
    EADDRINUSE: 3,
    EADDRNOTAVAIL: 4,
    EADV: 122,
    EAFNOSUPPORT: 5,
    EAGAIN: 6,
    EALREADY: 7,
    EBADE: 113,
    EBADF: 8,
    EBADFD: 127,
    EBADMSG: 9,
    EBADR: 114,
    EBADRQC: 103,
    EBADSLT: 102,
    EBFONT: 101,
    EBUSY: 10,
    ECANCELED: 11,
    ECHILD: 12,
    ECHRNG: 106,
    ECOMM: 124,
    ECONNABORTED: 13,
    ECONNREFUSED: 14,
    ECONNRESET: 15,
    EDEADLK: 16,
    EDEADLOCK: 16,
    EDESTADDRREQ: 17,
    EDOM: 18,
    EDOTDOT: 125,
    EDQUOT: 19,
    EEXIST: 20,
    EFAULT: 21,
    EFBIG: 22,
    EHOSTDOWN: 142,
    EHOSTUNREACH: 23,
    EIDRM: 24,
    EILSEQ: 25,
    EINPROGRESS: 26,
    EINTR: 27,
    EINVAL: 28,
    EIO: 29,
    EISCONN: 30,
    EISDIR: 31,
    EL2HLT: 112,
    EL2NSYNC: 156,
    EL3HLT: 107,
    EL3RST: 108,
    ELIBACC: 129,
    ELIBBAD: 130,
    ELIBEXEC: 133,
    ELIBMAX: 132,
    ELIBSCN: 131,
    ELNRNG: 109,
    ELOOP: 32,
    EMFILE: 33,
    EMLINK: 34,
    EMSGSIZE: 35,
    EMULTIHOP: 36,
    ENAMETOOLONG: 37,
    ENETDOWN: 38,
    ENETRESET: 39,
    ENETUNREACH: 40,
    ENFILE: 41,
    ENOANO: 104,
    ENOBUFS: 42,
    ENOCSI: 111,
    ENODATA: 116,
    ENODEV: 43,
    ENOENT: 44,
    ENOEXEC: 45,
    ENOLCK: 46,
    ENOLINK: 47,
    ENOMEDIUM: 148,
    ENOMEM: 48,
    ENOMSG: 49,
    ENONET: 119,
    ENOPKG: 120,
    ENOPROTOOPT: 50,
    ENOSPC: 51,
    ENOSR: 118,
    ENOSTR: 100,
    ENOSYS: 52,
    ENOTBLK: 105,
    ENOTCONN: 53,
    ENOTDIR: 54,
    ENOTEMPTY: 55,
    ENOTRECOVERABLE: 56,
    ENOTSOCK: 57,
    ENOTSUP: 138,
    ENOTTY: 59,
    ENOTUNIQ: 126,
    ENXIO: 60,
    EOPNOTSUPP: 138,
    EOVERFLOW: 61,
    EOWNERDEAD: 62,
    EPERM: 63,
    EPFNOSUPPORT: 139,
    EPIPE: 64,
    EPROTO: 65,
    EPROTONOSUPPORT: 66,
    EPROTOTYPE: 67,
    ERANGE: 68,
    EREMCHG: 128,
    EREMOTE: 121,
    EROFS: 69,
    ESHUTDOWN: 140,
    ESOCKTNOSUPPORT: 137,
    ESPIPE: 70,
    ESRCH: 71,
    ESRMNT: 123,
    ESTALE: 72,
    ESTRPIPE: 135,
    ETIME: 117,
    ETIMEDOUT: 73,
    ETOOMANYREFS: 141,
    ETXTBSY: 74,
    EUNATCH: 110,
    EUSERS: 136,
    EWOULDBLOCK: 6,
    EXDEV: 75,
    EXFULL: 115,
};
class PyoliteRemoteKernel {
    constructor() {
        /**
         * Initialization options.
         */
        this._options = null;
        this._initializer = null;
        /** TODO: real typing */
        this._localPath = '';
        this._driveName = '';
        this._driveFS = null;
        this._initialized = new Promise((resolve, reject) => {
            this._initializer = { resolve, reject };
        });
    }
    /**
     * Accept the URLs from the host
     **/
    async initialize(options) {
        var _a;
        this._options = options;
        if (options.location.includes(':')) {
            const parts = options.location.split(':');
            this._driveName = parts[0];
            this._localPath = parts[1];
        }
        else {
            this._driveName = '';
            this._localPath = options.location;
        }
        await this.initRuntime(options);
        await this.initFilesystem(options);
        await this.initPackageManager(options);
        await this.initKernel(options);
        await this.initGlobals(options);
        (_a = this._initializer) === null || _a === void 0 ? void 0 : _a.resolve();
    }
    async initRuntime(options) {
        const { pyodideUrl, indexUrl } = options;
        if (pyodideUrl.endsWith('.mjs')) {
            const pyodideModule = await import(/* webpackIgnore: true */ pyodideUrl);
            this._pyodide = await pyodideModule.loadPyodide({ indexURL: indexUrl });
        }
        else {
            importScripts(pyodideUrl);
            this._pyodide = await self.loadPyodide({ indexURL: indexUrl });
        }
    }
    async initPackageManager(options) {
        if (!this._options) {
            throw new Error('Uninitialized');
        }
        const { pipliteWheelUrl, disablePyPIFallback, pipliteUrls } = this._options;
        // this is the only use of `loadPackage`, allow `piplite` to handle the rest
        await this._pyodide.loadPackage(['micropip']);
        // get piplite early enough to impact pyolite dependencies
        await this._pyodide.runPythonAsync(`
      import micropip
      await micropip.install('${pipliteWheelUrl}', keep_going=True)
      import piplite.piplite
      piplite.piplite._PIPLITE_DISABLE_PYPI = ${disablePyPIFallback ? 'True' : 'False'}
      piplite.piplite._PIPLITE_URLS = ${JSON.stringify(pipliteUrls)}
    `);
    }
    async initKernel(options) {
        // from this point forward, only use piplite
        await this._pyodide.runPythonAsync(`
      await piplite.install(['matplotlib', 'ipykernel'], keep_going=True);
      await piplite.install(['pyolite'], keep_going=True);
      await piplite.install(['ipython'], keep_going=True);
      import pyolite
    `);
        // cd to the kernel location
        if (options.mountDrive && this._localPath) {
            await this._pyodide.runPythonAsync(`
        import os;
        os.chdir("${this._localPath}");
      `);
        }
    }
    async initGlobals(options) {
        const { globals } = this._pyodide;
        this._kernel = globals.get('pyolite').kernel_instance.copy();
        this._stdout_stream = globals.get('pyolite').stdout_stream.copy();
        this._stderr_stream = globals.get('pyolite').stderr_stream.copy();
        this._interpreter = this._kernel.interpreter.copy();
        this._interpreter.send_comm = this.sendComm.bind(this);
    }
    /**
     * Setup custom Emscripten FileSystem
     */
    async initFilesystem(options) {
        if (options.mountDrive) {
            const mountpoint = '/drive';
            const { FS } = this._pyodide;
            const { baseUrl } = options;
            // TODO Once this https://github.com/pyodide/pyodide/pull/2582/files is released
            // We'll be able to acces PATH and ERRNO_CODES from this._pyodide directly (not through _module)
            const driveFS = new DriveFS({
                FS,
                PATH: this._pyodide._module.PATH,
                ERRNO_CODES: ERRNO_CODES,
                baseUrl,
                driveName: this._driveName,
                mountpoint,
            });
            FS.mkdir(mountpoint);
            FS.mount(driveFS, {}, mountpoint);
            FS.chdir(mountpoint);
            this._driveFS = driveFS;
        }
    }
    /**
     * Recursively convert a Map to a JavaScript object
     * @param obj A Map, Array, or other  object to convert
     */
    mapToObject(obj) {
        const out = obj instanceof Array ? [] : {};
        obj.forEach((value, key) => {
            out[key] =
                value instanceof Map || value instanceof Array
                    ? this.mapToObject(value)
                    : value;
        });
        return out;
    }
    /**
     * Format the response from the Pyodide evaluation.
     *
     * @param res The result object from the Pyodide evaluation
     */
    formatResult(res) {
        if (!this._pyodide.isPyProxy(res)) {
            return res;
        }
        // TODO: this is a bit brittle
        const m = res.toJs();
        const results = this.mapToObject(m);
        return results;
    }
    /**
     * Makes sure pyodide is ready before continuing, and cache the parent message.
     */
    async setup(parent) {
        await this._initialized;
        this._kernel._parent_header = this._pyodide.toPy(parent);
    }
    /**
     * Execute code with the interpreter.
     *
     * @param content The incoming message with the code to execute.
     */
    async execute(content, parent) {
        await this.setup(parent);
        const publishExecutionResult = (prompt_count, data, metadata) => {
            const bundle = {
                execution_count: prompt_count,
                data: this.formatResult(data),
                metadata: this.formatResult(metadata),
            };
            postMessage({
                parentHeader: this.formatResult(this._kernel._parent_header)['header'],
                bundle,
                type: 'execute_result',
            });
        };
        const publishExecutionError = (ename, evalue, traceback) => {
            const bundle = {
                ename: ename,
                evalue: evalue,
                traceback: traceback,
            };
            postMessage({
                parentHeader: this.formatResult(this._kernel._parent_header)['header'],
                bundle,
                type: 'execute_error',
            });
        };
        const clearOutputCallback = (wait) => {
            const bundle = {
                wait: this.formatResult(wait),
            };
            postMessage({
                parentHeader: this.formatResult(this._kernel._parent_header)['header'],
                bundle,
                type: 'clear_output',
            });
        };
        const displayDataCallback = (data, metadata, transient) => {
            const bundle = {
                data: this.formatResult(data),
                metadata: this.formatResult(metadata),
                transient: this.formatResult(transient),
            };
            postMessage({
                parentHeader: this.formatResult(this._kernel._parent_header)['header'],
                bundle,
                type: 'display_data',
            });
        };
        const updateDisplayDataCallback = (data, metadata, transient) => {
            const bundle = {
                data: this.formatResult(data),
                metadata: this.formatResult(metadata),
                transient: this.formatResult(transient),
            };
            postMessage({
                parentHeader: this.formatResult(this._kernel._parent_header)['header'],
                bundle,
                type: 'update_display_data',
            });
        };
        const publishStreamCallback = (name, text) => {
            const bundle = {
                name: this.formatResult(name),
                text: this.formatResult(text),
            };
            postMessage({
                parentHeader: this.formatResult(this._kernel._parent_header)['header'],
                bundle,
                type: 'stream',
            });
        };
        this._stdout_stream.publish_stream_callback = publishStreamCallback;
        this._stderr_stream.publish_stream_callback = publishStreamCallback;
        this._interpreter.display_pub.clear_output_callback = clearOutputCallback;
        this._interpreter.display_pub.display_data_callback = displayDataCallback;
        this._interpreter.display_pub.update_display_data_callback =
            updateDisplayDataCallback;
        this._interpreter.displayhook.publish_execution_result = publishExecutionResult;
        this._interpreter.input = this.input.bind(this);
        this._interpreter.getpass = this.getpass.bind(this);
        const res = await this._kernel.run(content.code);
        const results = this.formatResult(res);
        if (results['status'] === 'error') {
            publishExecutionError(results['ename'], results['evalue'], results['traceback']);
        }
        return results;
    }
    /**
     * Complete the code submitted by a user.
     *
     * @param content The incoming message with the code to complete.
     */
    async complete(content, parent) {
        await this.setup(parent);
        const res = this._kernel.complete(content.code, content.cursor_pos);
        const results = this.formatResult(res);
        return results;
    }
    /**
     * Inspect the code submitted by a user.
     *
     * @param content The incoming message with the code to inspect.
     */
    async inspect(content, parent) {
        await this.setup(parent);
        const res = this._kernel.inspect(content.code, content.cursor_pos, content.detail_level);
        const results = this.formatResult(res);
        return results;
    }
    /**
     * Check code for completeness submitted by a user.
     *
     * @param content The incoming message with the code to check.
     */
    async isComplete(content, parent) {
        await this.setup(parent);
        const res = this._kernel.is_complete(content.code);
        const results = this.formatResult(res);
        return results;
    }
    /**
     * Respond to the commInfoRequest.
     *
     * @param content The incoming message with the comm target name.
     */
    async commInfo(content, parent) {
        await this.setup(parent);
        const res = this._kernel.comm_info(content.target_name);
        const results = this.formatResult(res);
        return {
            comms: results,
            status: 'ok',
        };
    }
    /**
     * Respond to the commOpen.
     *
     * @param content The incoming message with the comm open.
     */
    async commOpen(content, parent) {
        await this.setup(parent);
        const res = this._kernel.comm_manager.comm_open(this._pyodide.toPy(content));
        const results = this.formatResult(res);
        return results;
    }
    /**
     * Respond to the commMsg.
     *
     * @param content The incoming message with the comm msg.
     */
    async commMsg(content, parent) {
        await this.setup(parent);
        const res = this._kernel.comm_manager.comm_msg(this._pyodide.toPy(content));
        const results = this.formatResult(res);
        return results;
    }
    /**
     * Respond to the commClose.
     *
     * @param content The incoming message with the comm close.
     */
    async commClose(content, parent) {
        await this.setup(parent);
        const res = this._kernel.comm_manager.comm_close(this._pyodide.toPy(content));
        const results = this.formatResult(res);
        return results;
    }
    /**
     * Resolve the input request by getting back the reply from the main thread
     *
     * @param content The incoming message with the reply
     */
    async inputReply(content, parent) {
        await this.setup(parent);
        this._resolveInputReply(content);
    }
    /**
     * Send a input request to the front-end.
     *
     * @param prompt the text to show at the prompt
     * @param password Is the request for a password?
     */
    async sendInputRequest(prompt, password) {
        const content = {
            prompt,
            password,
        };
        postMessage({
            type: 'input_request',
            parentHeader: this.formatResult(this._kernel._parent_header)['header'],
            content,
        });
    }
    async getpass(prompt) {
        prompt = typeof prompt === 'undefined' ? '' : prompt;
        await this.sendInputRequest(prompt, true);
        const replyPromise = new Promise((resolve) => {
            this._resolveInputReply = resolve;
        });
        const result = await replyPromise;
        return result['value'];
    }
    async input(prompt) {
        prompt = typeof prompt === 'undefined' ? '' : prompt;
        await this.sendInputRequest(prompt, false);
        const replyPromise = new Promise((resolve) => {
            this._resolveInputReply = resolve;
        });
        const result = await replyPromise;
        return result['value'];
    }
    /**
     * Send a comm message to the front-end.
     *
     * @param type The type of the comm message.
     * @param content The content.
     * @param metadata The metadata.
     * @param ident The ident.
     * @param buffers The binary buffers.
     */
    async sendComm(type, content, metadata, ident, buffers) {
        postMessage({
            type: type,
            content: this.formatResult(content),
            metadata: this.formatResult(metadata),
            ident: this.formatResult(ident),
            buffers: this.formatResult(buffers),
            parentHeader: this.formatResult(this._kernel._parent_header)['header'],
        });
    }
}

;// CONCATENATED MODULE: ./node_modules/@jupyterlite/pyolite-kernel/lib/comlink.worker.js
// Copyright (c) Jupyter Development Team.
// Distributed under the terms of the Modified BSD License.
/**
 * A WebWorker entrypoint that uses comlink to handle postMessage details
 */


const worker = new PyoliteRemoteKernel();
expose(worker);


//# sourceMappingURL=442.ebc5e5d.js.map