window.W = Object.assign(window.W || {}, {
    version: "36.0.0",
    assets: "36.0.0.lib.cc7c",
    sha: "2c435cc7c",
    target: "lib",
    build: "2022-08-04, 10:40"
}),
function(e) {
    Date.now();
    var t = [];

    function n(e, t, n, i, o, r, a) {
        W.rootScope, W.connection, W.device && W.device.getVirtualDeviceID(), Date.now()
    }
    e.wError = function(e, t, i) {
        console.error(e, t, i), n()
    }, e.windySentErrors = t, e.onerror = n.bind(null, "error")
}(window),
function(e) {
    var t = {};

    function n(e, n, i, o, r) {
        if (e in t) throw new Error("DI conflict: Module " + e + " already defined.");
        t[e] = {
            name: e,
            dependencies: n,
            callback: i,
            wasLoaded: !1,
            html: o,
            css: r
        }
    }

    function i(n, o) {
        var r = [];
        n.dependencies.forEach((function(e) {
            var o = t[e];
            if (!o) throw new Error("DI error: Module " + e + " not defined. Required by: " + n.name);
            o.wasLoaded ? r.push(o.exports) : r.push(i(o))
        }));
        var a = {};
        try {
            n.callback.apply(o || null, [a].concat(r)), n.wasLoaded = !0
        } catch (e) {
            window.wError("tinyrequire", "DI error: Can not resolve " + n.name + " module", e)
        }
        var s = "default" in a ? a.default : a;
        return n.exports = s, e[n.name] = s, s
    }
    e.require = function(e, n) {
        var o = t[e];
        if (!o) throw new Error('Tinyrequire error: Module "' + e + '" does not exist');
        return o.wasLoaded ? o.exports : i(o, n)
    }, e.define = n, e.tag = function(e, t, i, o, r) {
        n("@plugins/" + e, [], r, t, i)
    }, e.modules = t, e.loadOrphanedModules = function() {
        for (var e in t) t[e].wasLoaded || i(t[e])
    }
}(W), L.CanvasLayer = L.Layer.extend({
    initialize: function(e) {
        L.Util.setOptions(this, e || {}), this.targetPane = "tilePane", this._showCanvasOn = !0, this.onInit()
    },
    addTo: function(e) {
        return this.failed = !1, e.addLayer(this), this
    },
    onAdd: function(e) {
        this._map = e;
        var t = e.getSize(),
            n = e.options.zoomAnimation && L.Browser.any3d;
        return this._canvas = L.DomUtil.create("canvas", "leaflet-canvas"), this.onResizeCanvas(t.x, t.y), L.DomUtil.addClass(this._canvas, "leaflet-layer leaflet-zoom-" + (n ? "animated" : "hide")), e.getPanes()[this.targetPane].appendChild(this._canvas), this.onCreateCanvas(this._canvas) ? (e.on("resize", this._resize, this), e.on("zoomanim", this._animateZoom, this), e.on("zoom", this._onZoom, this), e.on("zoomstart", this._onZoomStart, this), e.on("zoomend", this._onZoomEnd, this), this.options.disableAutoReset || e.on("moveend", this._moveEnd, this), this._reset(), this._redraw(), this) : (this.failed = !0, this.onCanvasFailed(), this)
    },
    onRemove: function(e) {
        var t;
        return this.onRemoveCanvas(null !== (t = this._canvas) && void 0 !== t ? t : void 0), e.getPanes()[this.targetPane].removeChild(this._canvas), e.off("resize", this._resize, this), e.off("zoomanim", this._animateZoom, this), e.off("zoom", this._onZoom, this), e.off("zoomstart", this._onZoomStart, this), e.off("zoomend", this._onZoomEnd, this), this.options.disableAutoReset || e.off("moveend", this._moveEnd, this), this._canvas = null, this
    },
    getCanvas: function() {
        return this._canvas
    },
    showCanvas: function(e) {
        this._showCanvasOn !== e && (this._showCanvasOn = e, this._canvas.style.display = this._showCanvasOn ? "block" : "none")
    },
    onResizeCanvas: function(e, t) {
        this._canvas.width = e, this._canvas.height = t
    },
    _resize: function(e) {
        this.onResizeCanvas(e.newSize.x, e.newSize.y)
    },
    _reset: function() {
        if (this._map && this._canvas) {
            var e = this._map.containerPointToLayerPoint([0, 0]);
            L.DomUtil.setPosition(this._canvas, e), this._center = this._map.getCenter(), this._zoom = this._map.getZoom(), this.onReset()
        }
    },
    reset: function() {
        this._reset()
    },
    onReset: function() {},
    _redraw: function() {
        this._frame = null
    },
    redraw: function() {
        return this._frame || (this._frame = L.Util.requestAnimFrame(this._redraw, this)), this
    },
    _moveEnd: function() {
        this._reset(), this.onMoveEnd()
    },
    _onZoomStart: function() {
        this.wasOnZoom = !1
    },
    _onZoomEnd: function() {
        this.canvasDisplay(!0)
    },
    canvasDisplay: function(e) {
        this._canvas && (this._canvas.style.display = e ? "block" : "none")
    },
    _animateZoom: function(e) {
        this.wasOnZoom && this.canvasDisplay(!1);
        var t = this._map.getZoomScale(e.zoom),
            n = this._map._latLngBoundsToNewLayerBounds(this._map.getBounds(), e.zoom, e.center).min;
        L.DomUtil.setTransform(this._canvas, n, t)
    },
    _onZoom: function() {
        this.wasOnZoom = !0, this._updateTransform(this._map.getCenter(), this._map.getZoom())
    },
    _updateTransform: function(e, t) {
        if (this._map && this._canvas && this._center) {
            var n = this._map.getZoomScale(t, this._zoom),
                i = this._canvas._leaflet_pos || new L.Point(0, 0),
                o = this._map.getSize().multiplyBy(.5 + (this.options.padding || 0)),
                r = this._map.project(this._center, t),
                a = this._map.project(e, t).subtract(r),
                s = o.multiplyBy(-n).add(i).add(o).subtract(a);
            L.DomUtil.setTransform(this._canvas, s, n)
        }
    },
    onInit: function() {},
    onCreateCanvas: function() {
        return !0
    },
    onCanvasFailed: function() {},
    onRemoveCanvas: function() {},
    onMoveEnd: function() {},
    onZoomEnd: function() {}
}), W.define("Class", [], (function(e) {
    var t = {
        extend: function() {
            for (var e = arguments, t = Object.create(this), n = 0; n < arguments.length; n++) {
                var i = e[n];
                for (var o in i) t[o] = i[o]
            }
            return t
        },
        instance: function() {
            for (var e = [], t = arguments.length; t--;) e[t] = arguments[t];
            var n = this.extend.apply(this, e);
            return "function" == typeof n._init && n._init.call(n), n
        }
    };
    e.default = t
})), W.define("Evented", ["Class"], (function(e, t) {
    var n = function() {
            var e;
            return null === (e = window.W.lib) || void 0 === e ? void 0 : e.verbose
        },
        i = 0,
        o = [];

    function r(e, t, n) {
        o.push({
            ts: Date.now(),
            txt: e + ": " + t + ("string" == typeof n ? " " + n : "")
        }), o.length > 5 && o.shift()
    }
    W.latestBcasts = o;
    var a = t.extend({
        _init: function() {
            if (this.latestId = 1, this._eventedCache = {}, n()) {
                var e = ["red", "darkcyan", "green", "orange", "darkblue", "violet", "darkgreen", "blue", "brown", "blueviolet", "coral", "darkcyan", "midnightblue"];
                this.terminalColor = e[i], ++i > e.length - 1 && (i = 0)
            }
            this.trigger = this.emit, this.fire = this.emit
        },
        emit: function(e) {
            for (var t, i = [], o = arguments.length - 1; o-- > 0;) i[o] = arguments[o + 1];
            n() && console.log.apply(console, ["%c" + this.ident + ": " + e, "color:" + this.terminalColor].concat(i)), r(this.ident || "eventedModule", e, i[0]);
            var a = this._eventedCache[e];
            if (a)
                for (var s = a.length; s--;) {
                    var l = a[s];
                    try {
                        (t = l.callback).call.apply(t, [l.context].concat(i)), l.once && this.off(l.id)
                    } catch (t) {
                        window.wError("Evented", "Failed to call " + e, t)
                    }
                }
        },
        on: function(e, t, n, i) {
            return this.latestId = this.latestId || 0, this._eventedCache ? (e in this._eventedCache || (this._eventedCache[e] = []), this._eventedCache[e].push({
                id: ++this.latestId,
                callback: t,
                context: n || this,
                once: i || !1
            }), this.latestId) : this.latestId
        },
        once: function(e, t, n) {
            return this.on(e, t, n, !0)
        },
        off: function(e, t, n) {
            if ("number" == typeof e)
                for (var i in this._eventedCache) {
                    var o = this._eventedCache[i];
                    if (o) {
                        for (var r = o.length; r--;) o[r].id === e && o.splice(r, 1);
                        0 === o.length && delete this._eventedCache[i]
                    }
                } else {
                    var a = this._eventedCache[e];
                    if (a) {
                        for (var s = a.length; s--;) a[s].callback !== t || n && n !== a[s].context || a.splice(s, 1);
                        this._eventedCache && 0 === a.length && delete this._eventedCache[e]
                    }
                }
        }
    });
    e.default = a
})), W.define("http", ["lruCache", "rootScope", "utils", "broadcast", "device", "store"], (function(e, t, n, i, o, r, a) {
    var s = i.joinPath,
        l = i.addQs,
        c = i.qs,
        d = new t(50),
        u = "",
        h = 0,
        p = r.getVirtualDeviceID(),
        f = a.get("sessionCounter"),
        m = "application/json binary/" + (W.assets || "").replace(/\./g, ""),
        v = new RegExp("^/users/", "i"),
        g = new RegExp("^https://account.windy.com/", "i"),
        w = new RegExp("^https://ims-s.windy.com/forecast/citytile/", "i"),
        y = function(e) {
            var t = document.head.querySelector('meta[name="token"]'),
                i = {
                    token: t && t.content,
                    token2: a.get("userToken") || "pending",
                    uid: p,
                    sc: f,
                    pr: +e,
                    v: n.version
                };
            u = c(i)
        },
        b = function(e) {
            return function(e) {
                return !/^http/.test(e) && !/^v\/\d*/.test(e)
            }(e) || w.test(e) || !1
        },
        T = function(e) {
            return b(e) ? (/^http/.test(e) || (e = s(n.nodeServer, e)), u && (e = l(e, u)), e = l(e, "poc=" + ++h)) : e
        };
    y(!0), a.on("userToken", (function() {
        return y(!1)
    }));
    var S = function(e) {
            return {
                headers: e.headers,
                status: e.status,
                data: e.data && e.isJSON ? JSON.parse(e.data) : e.data
            }
        },
        _ = function(e, t, n) {
            if (void 0 === n && (n = {}), "object" == typeof n.qs) {
                var i = c(n.qs);
                i && (t = l(t, i))
            }
            var r, s = v.test(t) || g.test(t) || n.withCredentials,
                u = t;
            if (void 0 === n.cache && "get" === e && (n.cache = !0), n.cache) {
                var h = d.get(t);
                if (h) {
                    if (r = h, Promise.resolve(r) == r) return h;
                    var p = h.expire;
                    if (!(p && Date.now() > p)) {
                        var f = S(h);
                        return Promise.resolve(f)
                    }
                    d.remove(t)
                }
            }
            var w = new XMLHttpRequest;
            n.timeout && (w.timeout = n.timeout);
            var y = !1;
            if (b(t) && (t = T(t), /^\/?forecast\//.test(u))) {
                var _ = /^(.+)\/forecast\/([^/]+)\/([^/]+)\/(.+)$/.exec(t) || [],
                    E = _[1],
                    A = _[2],
                    P = _[3],
                    L = A + "/" + P + "/" + _[4];
                t = E + "/" + ("Zm9yZWNhc3Q/" + window.btoa(P).replace(/=/g, "")) + "/" + window.btoa(L).replace(/=/g, ""), y = !0
            }
            if (t = encodeURI(t), w.open(e, t, !0), n.binary && (w.responseType = "arraybuffer"), s) {
                w.withCredentials = !0;
                var C = a.get("userToken");
                C && w.setRequestHeader("Authorization", "Bearer " + C)
            }
            w.setRequestHeader("Accept", m);
            var M = new Promise((function(e, t) {
                    w.onreadystatechange = function() {
                        var i, r = {};
                        if (4 === w.readyState)
                            if (n.parseHeaders && w.getAllResponseHeaders().split(/\n/).forEach((function(e) {
                                    (i = e.match(/(.*:?): (.*)/)) && (r[i[1].toLowerCase()] = i[2])
                                })), w.status >= 200 && w.status < 300 || 304 === w.status) {
                                var a = {
                                    status: w.status,
                                    headers: r,
                                    data: void 0
                                };
                                n.binary ? a.data = w.response : y ? (a.isJSON = !0, a.data = window.atob(w.responseText)) : (a.isJSON = n.json || /json/.test(w.getResponseHeader("Content-Type") || ""), a.data = w.responseText), n.cache && (a.expire = (n.ttl || 3e5) + Date.now(), d.put(u, a));
                                var s = S(a);
                                e(s)
                            } else 0 === w.status && o.emit("noConnection", "http"), n.cache && d.remove(u), t(w)
                    }
                })),
                O = null;
            "post" !== e && "put" !== e || (w.setRequestHeader("Content-type", "application/json; charset=utf-8"), O = JSON.stringify(n.data));
            try {
                w.send(O)
            } catch (e) {
                return o.emit("noConnection", "httpError"), Promise.reject(e)
            }
            return n.cache && d.put(u, M), M
        },
        E = _.bind(null, "get"),
        A = _.bind(null, "delete"),
        P = _.bind(null, "post"),
        L = _.bind(null, "put");
    e.createEventSource = function(e, t) {
        void 0 === t && (t = {});
        try {
            var n = T(e);
            return new EventSource(n, t)
        } catch (e) {
            return null
        }
    }, e.del = A, e.get = E, e.post = P, e.put = L
})), W.define("storage", [], (function(e) {
    var t = {
            isAvbl: !1,
            put: function(e, t) {
                return window.localStorage.setItem(e, JSON.stringify(t))
            },
            hasKey: function(e) {
                return e in window.localStorage
            },
            get: function(e) {
                var t = window.localStorage.getItem(e);
                return t ? JSON.parse(t) : null
            },
            remove: function(e) {
                return window.localStorage.removeItem(e)
            }
        },
        n = {},
        i = {
            isAvbl: !1,
            put: function(e, t) {
                return n[e] = t
            },
            hasKey: function(e) {
                return e in n
            },
            get: function(e) {
                return e in n ? n[e] : null
            },
            remove: function(e) {
                return delete n[e]
            }
        };
    try {
        if (window.localStorage.setItem("test", "bar"), "bar" !== window.localStorage.getItem("test")) throw new Error("Comparsion failed");
        window.localStorage.removeItem("test"), t.isAvbl = !0
    } catch (e) {
        0
    }
    var o = t.isAvbl ? t : i;
    e.default = o
})), W.define("subscription", ["store", "http", "broadcast"], (function(e, t, n, i) {
    var o = function() {
            return t.get("subscription")
        },
        r = function() {
            t.remove("pendingSubscription")
        },
        a = function() {
            t.set("detail1h", !1), t.set("startUpLastStep", null)
        },
        s = function(e, n) {
            return void 0 === n && (n = {}), null === e ? a() : (r(), t.remove("failedSubscriptionPayment"), document.body.classList.add("subs-" + e)), t.set("subscription", e), n.reloadUserToken && i.emit("userReloadInfo"), e
        },
        l = function() {
            t.get("pendingSubscription") && i.emit("rqstOpen", "pending-subscription")
        };
    i.once("dependenciesResolved", l), i.on("checkPendingSubscriptions", l);
    var c = {
        getTier: o,
        setTier: s,
        hasAny: function() {
            return null !== o()
        },
        clearPendingSubscription: r,
        checkPendingSubscription: l,
        setPendingSubscription: function(e) {
            t.set("pendingSubscription", e)
        },
        redeem: function(e) {
            return n.post("https://account.windy.com/api/v1/subscription/redeem", {
                data: {
                    redeemCode: e
                },
                withCredentials: !0
            }).then((function(e) {
                var t = e.data;
                s(t.tier, {
                    reloadUserToken: !0
                })
            })).catch((function(e) {
                throw window.wError("subscription", "Failed to redeem subscription", e), e
            }))
        },
        deactivateAllFeatures: a
    };
    e.default = c
})), W.define("lruCache", [], (function(e) {
    var t = function(e) {
        this.size = 0, this.limit = e, this._keymap = {}
    };
    t.prototype.put = function(e, t) {
        var n = {
            key: e,
            value: t,
            older: void 0
        };
        if (this._keymap[e] = n, this.tail ? (this.tail.newer = n, n.older = this.tail) : this.head = n, this.tail = n, this.size === this.limit) return this.shift();
        this.size++
    }, t.prototype.toJSON = function() {
        for (var e = [], t = this.head; t;) e.push({
            key: t.key,
            value: t.value
        }), t = t.newer;
        return e
    }, t.prototype.shift = function() {
        var e = this.head;
        return e && this.head && (this.head.newer ? (this.head = this.head.newer, this.head.older = void 0) : this.head = void 0, e.newer = e.older = void 0, delete this._keymap[e.key]), e
    }, t.prototype.get = function(e) {
        var t = this._keymap[e];
        if (void 0 !== t) return t === this.tail || (t.newer && (t === this.head && (this.head = t.newer), t.newer.older = t.older), t.older && (t.older.newer = t.newer), t.newer = void 0, t.older = this.tail, this.tail && (this.tail.newer = t), this.tail = t), t.value
    }, t.prototype.remove = function(e) {
        var t = this._keymap[e];
        if (t) return delete this._keymap[t.key], t.newer && t.older ? (t.older.newer = t.newer, t.newer.older = t.older) : t.newer ? (t.newer.older = void 0, this.head = t.newer) : t.older ? (t.older.newer = void 0, this.tail = t.older) : this.head = this.tail = void 0, this.size--, t.value
    }, t.prototype.removeAll = function() {
        this.head = this.tail = void 0, this.size = 0, this._keymap = {}
    }, e.default = t
})), W.define("ga", ["rootScope", "utils", "store", "device"], (function(e, t, n, i, o) {
    var r = window.screen,
        a = n.qs({
            ul: t.prefLang,
            sr: r.width + "x" + r.height,
            cid: o.getVirtualDeviceID(),
            an: "Windy",
            av: t.version
        }),
        s = 1;
    s = 22;
    var l = !0,
        c = function(e) {
            var t = "dp=" + e + "&dl=https://ai4.windy.com/&" + a;
            if (i.get("userToken") && (t += "&token2=" + i.get("userToken")), l) {
                var n = document.location.href;
                /www.windy.com/.test(n) || (t += "&dr=" + encodeURIComponent(n)), l = !1
            }
            setTimeout((function() {
                var e = new XMLHttpRequest;
                e.open("HEAD", "https://node.windy.com/sedlina/ga/" + s + "?" + t, !0), e.send(null)
            }), 100)
        };
    var d = {
        pageview: c
    };
    e.default = d
})), W.define("utils", ["rootScope"], (function(e, t) {
    var n = t.supportedLanguages;

    function i(e, t, n) {
        return t in e ? Object.defineProperty(e, t, {
            value: n,
            enumerable: !0,
            configurable: !0,
            writable: !0
        }) : e[t] = n, e
    }
    var o = "bcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789a",
        r = o.split(""),
        a = function(e) {
            var t = "";
            do {
                t = o.charAt(e % 60) + t, e = Math.floor(e / 60)
            } while (e);
            return t
        },
        s = function(e) {
            for (var t = 0, n = 0; n < e.length; n++) t = 60 * t + r.indexOf(e.charAt(n));
            return t
        },
        l = function(e, t) {
            for (var n in e) t(e[n], n)
        },
        c = function(e, t) {
            if (null === e) return e;
            if (e instanceof Date) return new Date(e.getTime());
            if (e instanceof Array) {
                var n = [];
                return e.forEach((function(e) {
                    n.push(e)
                })), n.map((function(e) {
                    return c(e)
                }))
            }
            if ("object" == typeof e && e !== {}) {
                var o = function(e) {
                    for (var t = arguments, n = 1; n < arguments.length; n++) {
                        var o = null != t[n] ? t[n] : {},
                            r = Object.keys(o);
                        "function" == typeof Object.getOwnPropertySymbols && (r = r.concat(Object.getOwnPropertySymbols(o).filter((function(e) {
                            return Object.getOwnPropertyDescriptor(o, e).enumerable
                        })))), r.forEach((function(t) {
                            i(e, t, o[t])
                        }))
                    }
                    return e
                }({}, e);
                return Object.keys(o).forEach((function(e) {
                    t && !t.includes(e) || (o[e] = c(o[e]))
                })), o
            }
            return e
        },
        d = function(e) {
            return "number" == typeof e.dir && "number" == typeof e.wind && e.dir <= 360 && e.wind > 0
        },
        u = function(e, t, n) {
            return Math.max(Math.min(e, n), t)
        },
        h = function(e) {
            return (Math.PI - Math.log(Math.tan(.5 * (1 - e) * Math.PI))) / (2 * Math.PI)
        },
        p = 0,
        f = function(e, t, n, i, o) {
            return (.5 * -e + 3 * t * .5 - 3 * n * .5 + .5 * i) * o * o * o + (e - 5 * t * .5 + 2 * n - .5 * i) * o * o + (.5 * -e + .5 * n) * o + t
        },
        m = function(e, t, n) {
            return e + n * (t - e)
        };
    e.$ = function(e, t) {
        return (t || document).querySelector(e)
    }, e.addQs = function(e, t) {
        return e + (/\?/.test(e) ? "&" : "?") + t
    }, e.bicubicFiltering = function(e, t, n) {
        return f(f(e[0], e[1], e[2], e[3], t), f(e[4], e[5], e[6], e[7], t), f(e[8], e[9], e[10], e[11], t), f(e[12], e[13], e[14], e[15], t), n)
    }, e.bound = u, e.char2num = s, e.clamp0X = function(e, t) {
        return Math.min(Math.max(e, 0), t - 1)
    }, e.clone = c, e.copy2clipboard = function(e) {
        var t = document.createElement("textarea");
        t.value = e, document.body.appendChild(t), t.select(), document.execCommand("copy"), document.body.removeChild(t)
    }, e.cubicHermite = f, e.debounce = function(e, t, n) {
        var i;
        return function() {
            for (var o = [], r = arguments.length; r--;) o[r] = arguments[r];
            var a = this;

            function s() {
                clearTimeout(i), n || e.apply(a, o)
            }
            var l = n && !i;
            clearTimeout(i), i = setTimeout(s, t), l && e.apply(a, o)
        }
    }, e.deg2rad = function(e) {
        return e * Math.PI / 180
    }, e.degToRad = .017453292, e.download = function(e, t, n) {
        var i = document.createElement("a"),
            o = e instanceof Blob ? e : new Blob([e], {
                type: t
            });
        i.style.display = "none", document.body.appendChild(i), window.URL && (i.href = window.URL.createObjectURL(o)), i.setAttribute("download", n), i.click(), window.URL && window.URL.revokeObjectURL(i.href), document.body.removeChild(i)
    }, e.each = l, e.emptyFun = function() {}, e.emptyGIF = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==", e.getAdjustedNow = function(e) {
        var t, n = Date.now() - p;
        return e && ((t = n - e) < 0 && (p += t), t > 1e4 && (p += t)), n
    }, e.getNativePlugin = function(e) {
        return null
    }, e.hasDirection = d, e.isFunction = function(e) {
        return "function" == typeof e
    }, e.isNear = function(e, t) {
        return Math.abs(+e.lat - +t.lat) < .01 && Math.abs(+e.lon - +t.lon) < .01
    }, e.isTouchEvent = function(e) {
        return Boolean("touches" in e && e.touches)
    }, e.isValidLang = function(e) {
        return n.includes(e)
    }, e.isValidLatLonObj = function(e) {
        return e && "object" == typeof e && "lat" in e && "lon" in e && !isNaN(+e.lat) && !isNaN(+e.lon) || !1
    }, e.joinPath = function(e, t) {
        return e + ("/" === t.charAt(0) ? "" : "/") + t
    }, e.lat01ToYUnit = h, e.latDegToYUnit = function(e) {
        return h(.5 - .00555555555555555 * e)
    }, e.latLon2str = function(e) {
        var t = Math.floor(100 * (e.lat + 90)),
            n = Math.floor(100 * (e.lon + 180));
        return a(t) + "a" + a(n)
    }, e.lerp = m, e.lerpColor256 = function(e, t, n) {
        return e.map((function(i, o) {
            return u(m(e[o], t[o], n), 0, 255)
        }))
    }, e.loadScript = function(e, t) {
        return new Promise((function(n, i) {
            var o = document.createElement("script");
            o.type = "text/javascript", o.async = !0, o.onload = function() {
                n()
            }, o.onerror = function(e) {
                i(e)
            }, document.head.appendChild(o), t && "function" == typeof t && t(o), o.src = e
        }))
    }, e.lonDegToXUnit = function(e) {
        return .5 + .00277777777777777 * e
    }, e.normalizeLatLon = function(e) {
        return parseFloat(e).toFixed(3)
    }, e.num2char = a, e.pad = function(e, t) {
        void 0 === t && (t = 2);
        for (var n = String(e); n.length < t;) n = "0" + n;
        return n
    }, e.qs = function(e) {
        var t = [];
        return l(e, (function(e, n) {
            return void 0 !== e && t.push(n + "=" + e)
        })), t.join("&")
    }, e.radToDeg = 57.2957795, e.replaceClass = function(e, t, n) {
        void 0 === n && (n = document.body);
        var i = n.className;
        e.test(i) ? n.className = i.replace(e, t) : n.classList.add(t)
    }, e.smoothstep = function(e, t, n) {
        var i = u((n - e) / (t - e), 0, 1);
        return i * i * i * (i * (6 * i - 15) + 10)
    }, e.spline = function(e, t, n, i, o) {
        return .5 * (2 * t + (-e + n) * o + (2 * e - 5 * t + 4 * n - i) * o * o + (3 * t - e - 3 * n + i) * o * o * o)
    }, e.str2latLon = function(e) {
        var t = e.split("a");
        return {
            lat: s(t[0]) / 100 - 90,
            lon: s(t[1]) / 100 - 180
        }
    }, e.template = function(e, t) {
        return e ? e.replace(/\{\{?\s*(.+?)\s*\}?\}/g, (function(e, n) {
            return t && n in t ? String(t[n]) : ""
        })) : ""
    }, e.throttle = function(e, t) {
        var n, i, o = this;

        function r() {
            n = !1, i && (a.apply(o, i), i = !1)
        }

        function a() {
            for (var a = [], s = arguments.length; s--;) a[s] = arguments[s];
            n ? i = a : (e.apply(o, a), setTimeout(r, t), n = !0)
        }
        return a
    }, e.toggleClass = function(e, t, n) {
        return e.classList[t ? "add" : "remove"](n)
    }, e.tsHour = 36e5, e.tsMinute = 6e4, e.unitXToLonDeg = function(e) {
        return 360 * (e - .5)
    }, e.unitXToLonRad = function(e) {
        return 2 * (e - .5) * Math.PI
    }, e.unitYToLatDeg = function(e) {
        return Math.atan(Math.exp(Math.PI - e * (2 * Math.PI))) / (.5 * Math.PI) * 180 - 90
    }, e.unitYToLatRad = function(e) {
        return 2 * Math.atan(Math.exp(Math.PI - 2 * e * Math.PI)) - .5 * Math.PI
    }, e.wave2obj = function(e) {
        return {
            period: Math.sqrt(e[0] * e[0] + e[1] * e[1]),
            dir: 10 * Math.floor(18 + 18 * Math.atan2(e[0], e[1]) / Math.PI),
            size: e[2]
        }
    }, e.wind2obj = function(e) {
        return {
            wind: Math.sqrt(e[0] * e[0] + e[1] * e[1]),
            dir: 10 * Math.floor(18 + 18 * Math.atan2(e[0], e[1]) / Math.PI)
        }
    }, e.windDir2html = function(e) {
        return d(e) ? '<div class="iconfont" style="transform: rotate(' + e.dir + "deg); -webkit-transform:rotate(" + e.dir + 'deg);">"</div>' : ""
    }
})), W.define("urls", ["rootScope", "utils", "store", "subscription", "products"], (function(e, t, n, i, o, r) {
    e.getCitytile = function(e, t) {
        var i, a, s, l, c = "https://ims-s.windy.com/forecast/citytile/v1.3/" + e + "/" + t,
            d = null === (i = r[e]) || void 0 === i || null === (a = i.calendar) || void 0 === a ? void 0 : a.numOfHours;
        return c = n.addQs(c, "step=" + (!1 === (null === (s = r[e]) || void 0 === s || null === (l = s.minifest) || void 0 === l ? void 0 : l.premium) || o.hasAny() ? 1 : 3)), d && (c = n.addQs(c, "hours=" + d)),
            function(e, t) {
                var i = r[t];
                if (!(null == i ? void 0 : i.refTime)) return e;
                var o = i.getUpdateTimes.call(i).refTime;
                return o ? n.addQs(e, "refTime=" + o) : e
            }(c, e)
    }, e.getMeteogramForecast = function(e, t) {
        return "/forecast/meteogram/" + e + "/" + t.lat + "/" + t.lon + "?step=" + t.step
    }, e.getPointForecast = function(e, n, i, o) {
        var r = n.lat,
            a = n.lon,
            s = n.step;
        return "/forecast/point/" + e + "/" + t.pointForecast + "/" + r + "/" + a + "?source=" + i + (s ? "&step=" + s : "") + (o ? "&" + o : "")
    }, e.getWebcamArchive = function(e) {
        return "/webcams/v2.0/archive/" + e
    }, e.getWebcamDetail = function(e) {
        return "/webcams/v1.0/detail/" + e + "?lang=" + (i.get("usedLang") || "en")
    }, e.getWebcamMetrics = function(e) {
        return "/webcams/ping/" + e
    }, e.getWebcamsList = function(e) {
        var t = e.lat,
            o = e.lon;
        return "/webcams/v1.0/list?" + n.qs({
            nearby: t + "," + o,
            lang: i.get("usedLang") || "en"
        })
    }
})), W.define("format", ["trans", "store", "utils"], (function(e, t, n, i) {
    var o = t.t,
        r = function(e, t) {
            return "" + (e % 12 || 12) + (void 0 !== t ? ":" + i.pad(t) : "") + (e >= 12 ? " PM" : " AM")
        },
        a = function(e, t) {
            return e + ":" + (void 0 !== t ? i.pad(t) : "00")
        },
        s = function(e) {
            return e ? e.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") : ""
        },
        l = ["N", "NE", "E", "SE", "S", "SW", "W", "NW", "N"],
        c = function(e) {
            var t = Math.floor((+e + 22.5) / 45);
            return o["DIRECTION_" + l[t]] || "-"
        },
        d = function(e) {
            return e + "Â°"
        },
        u = function(e) {
            return [Math.abs(0 | e), "Â°", 0 | (e < 0 ? e = -e : e) % 1 * 60, "'", 0 | 60 * e % 1 * 60, '"'].join("")
        },
        h = function(e) {
            return e.replace(/[,.]/g, " ").replace(/â‚‚/g, "2").replace(/â‚ƒ/g, "3").replace(/\s+/g, "-").replace(/-+/g, "-")
        };
    e.DD2DMS = function(e, t) {
        return [e < 0 ? "S" : "N", u(e), ", ", t < 0 ? "W" : "E", u(t)].join("")
    }, e.animateViews = function(e, t) {
        setTimeout((function() {
            return function(e, t) {
                var n = Date.now(),
                    o = n + 4e3,
                    r = function() {
                        var a = Math.floor(i.smoothstep(n, o, Date.now()) * e);
                        t && (t.textContent = s(a) + " views"), t && a < e && window.requestAnimationFrame(r)
                    };
                r()
            }(e, t)
        }), 2e3)
    }, e.getDirFunction = function() {
        return n.get("numDirection") ? d : c
    }, e.getHoursFunction = function() {
        return "12h" === n.get("hourFormat") ? r : a
    }, e.hourMinuteUTC = function(e) {
        var t = new Date(e);
        return i.pad(t.getUTCHours()) + ":" + i.pad(t.getUTCMinutes()) + "Z"
    }, e.hourUTC = function(e) {
        return i.pad(new Date(e).getUTCHours()) + ":00Z"
    }, e.howOld = function(e) {
        var t = !1,
            n = -1;
        if ("diffMin" in e) n = +e.diffMin;
        else if ("ts" in e) n = Math.floor((Date.now() - +e.ts) / 6e4);
        else if ("min" in e) n = Math.floor(Date.now() / 6e4 - +e.min);
        else {
            if (!("ux" in e)) return "";
            n = Math.floor((Date.now() / 1e3 - +e.ux) / 60)
        }
        if (n < 0 && (t = !0), n = Math.abs(n), e && e.translate) {
            if (0 === n) return o.NOW;
            if (n < 60) {
                var r = t ? o.METAR_MIN_LATER : o.METAR_MIN_AGO;
                return i.template(r, {
                    DURATION: n
                })
            }
            if (n < 240) {
                var a = Math.floor(n / 60),
                    s = n - 60 * a,
                    l = t ? o.METARS_H_M_LATER : o.METARS_H_M_AGO;
                return i.template(l, {
                    DURATION: a,
                    DURATIONM: s
                })
            }
            if (n < 1440) {
                var c = t ? o.METAR_HOURS_LATER : o.METAR_HOURS_AGO;
                return i.template(c, {
                    DURATION: Math.floor(n / 60)
                })
            }
            var d = t ? o.METARS_DAYS_LATER : o.METARS_DAYS_AGO;
            return i.template(d, {
                DURATION: Math.floor(n / 1440)
            })
        }
        return (e.useAgo && t ? "in " : "") + (n < 60 ? Math.floor(n) + "m" : Math.floor(n / 60) + "h " + Math.floor(n % 60) + "m") + (e.useAgo && !t ? " ago" : "")
    }, e.obsoleteClass = function(e, t) {
        void 0 === t && (t = 30);
        var n = (Date.now() / 1e3 - e) / 60;
        return n < .3 * t ? "fresh" : n < t ? "normal" : "obsolete"
    }, e.seoLang = function(e) {
        return "en" === e ? "" : e + "/"
    }, e.seoString = function(e) {
        return h(e).replace(/\/+/g, "-")
    }, e.seoUrlString = h, e.thousands = s, e.utcOffsetStr = function(e) {
        return (e < 0 ? "-" : "+") + i.pad(Math.abs(Math.round(e))) + ":00"
    }
})), W.define("Calendar", ["format", "utils", "trans"], (function(e, t, n, i) {
    var o = i.t,
        r = function e(t) {
            this.initProperties(), Object.assign(this, t), this.midnight = e.getMidnight(), this.startOfTimeline = this.startOfTimeline || this.midnight, this.start = this.startOfTimeline.getTime(), this.days = [], this.endOfcalendar = e.add(this.startOfTimeline, this.calendarHours), this.endOfCal = this.endOfcalendar.getTime(), this.maxTimestamp = this.endOfcalendar.getTime(), this.type = this.endOfcalendar < this.midnight ? "historical" : this.startOfTimeline < this.midnight ? "mixed" : "forecast", this.timestamps = [], this.paths = [], this.interTimestamps = [], this.minifestFile && this.createTimestampsFromMinifest(this.minifestFile) ? this.minifestValid = !0 : (this.createTimestamps(), this.minifestValid = !1), this.end = Math.min(this.timestamps[this.timestamps.length - 1], this.endOfCal);
            for (var n = e.add(this.startOfTimeline, 12), i = 0; i < this.calendarHours / 24; i++) {
                var o = e.add(this.startOfTimeline, i, "days").getTime(),
                    r = e.add(this.startOfTimeline, 24),
                    a = e.add(r, i, "days").getTime(),
                    s = e.add(n, i, "days"),
                    l = s.getTime(),
                    c = e.weekdays[s.getDay()];
                this.days[i] = {
                    display: c + "2",
                    displayLong: c,
                    day: s.getDate(),
                    middayTs: l,
                    start: o,
                    end: a,
                    month: s.getMonth() + 1,
                    year: s.getFullYear()
                }
            }
            for (var d = 1; d < this.paths.length; d++) this.interTimestamps.push(this.timestamps[d - 1] + Math.floor((this.timestamps[d] - this.timestamps[d - 1]) / 2))
        };
    r.prototype.initProperties = function() {
        this.calendarHours = 240, this.numOfHours = 240
    }, r.prototype.boundTs = function(e) {
        return n.bound(e, this.start, this.end)
    }, r.prototype.ts2path = function(e) {
        for (var t = this.interTimestamps, n = 0; n < t.length; n++)
            if (e < t[n]) return this.paths[n];
        return this.paths[this.paths.length - 1]
    }, r.prototype.createTimestamps = function() {
        var e = this.startOfTimeline.getUTCHours() % 3;
        e && (this.startOfTimeline = r.add(this.startOfTimeline, 3 - e, "hours"));
        for (var t = 0; t < this.numOfHours; t += 3) {
            var n = r.add(this.startOfTimeline, t, "hours");
            this.paths.push(r.date2path(n)), this.timestamps.push(n.getTime())
        }
    }, r.prototype.prepareTimesFromMinifest = function(e) {
        return e && "object" == typeof e && e.ref && e.dst ? (this.refTime = e.ref.replace(/(\d+)-(\d+)-(\d+)T(\d+):.*/, "$1$2$3$4"), this.refTimeTxt = e.ref, this.updateTxt = e.update, this.refTimeTs = new Date(e.ref).getTime(), this.updateTs = new Date(e.update).getTime(), !0) : (window.wError("Calendar", "Invalid format of minifest"), !1)
    }, r.prototype.createTimestampsFromMinifest = function(e) {
        var t = this;
        if (!this.prepareTimesFromMinifest(e)) return !1;
        var i = n.tsHour,
            o = Math.min(12, this.numOfHours / 24),
            a = r.add(this.startOfTimeline, o, "days").getTime();
        return e.dst.forEach((function(e) {
            for (var n = e[1]; n <= e[2]; n += e[0]) {
                var o = t.refTimeTs + n * i;
                o <= a && (t.timestamps.push(o), t.paths.push(r.date2path(new Date(o))))
            }
        })), !0
    }, r.date2path = function(e) {
        return e.toISOString().replace(/(\d\d\d\d)-(\d\d)-(\d\d)T(\d\d):.*/, "$1$2$3$4")
    }, r.path2date = function(e) {
        var t = e.split(/(.{4})(.{2})(.{2})(.{2})/g).filter(Boolean).map((function(e) {
            return parseInt(e, 10)
        }));
        return new Date(Date.UTC(t[0], t[1] - 1, t[2], t[3], 0, 0))
    }, r.ts2string = function(e) {
        var t = new Date(e),
            n = t.getDay(),
            i = t.getDate(),
            a = r.localeHours(t.getHours());
        return o[r.weekdays[n]] + " " + i + " - " + a
    }, r.add = function(e, t, i) {
        var o = new Date(e.getTime());
        return o.setTime(e.getTime() + ("days" === i ? 24 : 1) * t * n.tsHour), o
    }, r.getMidnight = function() {
        var e = new Date;
        return e.setHours(0), e.setMinutes(0), e.setSeconds(0), e.setMilliseconds(0), e
    }, r.localeHours = t.getHoursFunction(), r.weekdays = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"], e.Calendar = r
})), W.define("Metric", ["store", "broadcast", "trans"], (function(e, t, n, i) {
    var o = i.t,
        r = function(e) {
            return e
        },
        a = function(e) {
            this.initProperties(), Object.assign(this, e), this.key = this._createKey(this.ident), t.insert(this.key, {
                def: this.getDefault(),
                save: !0,
                sync: !0,
                nativeSync: this.nativeSync,
                allowed: Object.keys(this.conv)
            }), this.metric = t.get(this.key), t.on(this.key, this.onMetricChanged, this), t.once("isImperial", this.setDefault, this)
        };
    a.prototype.onMetricChanged = function(e) {
        this.metric = e, n.emit("metricChanged", this.ident, e)
    }, a.prototype.getDefault = function() {
        return t.get("isImperial") && this.defaults.length > 1 ? this.defaults[1] : this.defaults[0]
    }, a.prototype.setDefault = function() {
        t.setDefault(this.key, this.getDefault())
    }, a.prototype.convertValue = function(e, t) {
        var n;
        return void 0 === e ? "" : this.convertNumber(e) + (t || this.separator) + ((null === (n = this.conv[this.metric]) || void 0 === n ? void 0 : n.label) || this.metric)
    }, a.prototype.na = function() {
        var e;
        return (null === (e = this.conv[this.metric]) || void 0 === e ? void 0 : e.na) || "-"
    }, a.prototype.listMetrics = function() {
        return Object.keys(this.conv)
    }, a.prototype.howManyMetrics = function() {
        return this.listMetrics().length
    }, a.prototype.setMetric = function(e) {
        var n = this;
        t.set(this.key, e), this.cohesion && Object.keys(this.cohesion).forEach((function(i) {
            var o, r, a = null === (o = n.cohesion) || void 0 === o || null === (r = o[i]) || void 0 === r ? void 0 : r[e];
            a && t.set(n._createKey(i), a)
        }))
    }, a.prototype.cycleMetric = function() {
        var e = this.description.indexOf(this.metric) + 1;
        e === this.description.length && (e = 0), this.setMetric(this.description[e])
    }, a.prototype.renderLegend = function(e, t, n) {
        var i = n.description,
            o = n.lines;
        if (e.getColor()) {
            var r = o.length,
                a = i.indexOf(this.metric),
                s = 100 / (o.length + 1),
                l = [],
                c = e.color(o[0][0]);
            l.push(c, c, c);
            for (var d = '<span style="width:' + s + '%">' + this.metric + "</span>", u = 0; u < r; u++) {
                var h = o[u][0],
                    p = o[Math.min(u + 1, r - 1)][0],
                    f = e.color(h),
                    m = e.color(.5 * (h + p));
                l.push(f, m), d += '<span style="width: ' + s + '%">' + o[u][1 + a] + "</span>"
            }
            t.dataset.overlay = this.ident, t.classList[this.howManyMetrics() > 1 ? "remove" : "add"]("one-metric"), t.style.background = "linear-gradient(to right, " + l.join(",") + ")", t.innerHTML = d
        }
    }, a.prototype.initProperties = function() {
        this.separator = "", this.nativeSync = !1
    }, a.prototype._createKey = function(e) {
        return "metric_" + e
    };
    var s = function(e) {
            function t() {
                e.apply(this, arguments)
            }
            return e && (t.__proto__ = e), t.prototype = Object.create(e && e.prototype), t.prototype.constructor = t, t.prototype.convertNumber = function(e, t, n) {
                var i = this.conv[n || this.metric];
                if (!i) throw new Error("Convertion method for " + (n || this.metric) + " is not defined!");
                var o = i.conversion(e),
                    r = void 0 !== t ? t : i.precision;
                return r ? parseFloat(o.toFixed(r)) : Math.round(o)
            }, t
        }(a),
        l = function(e) {
            function t(t) {
                e.call(this, t), this.updateLines([321.25, 192.75])
            }
            return e && (t.__proto__ = e), t.prototype = Object.create(e && e.prototype), t.prototype.constructor = t, t.prototype.updateLines = function(e) {
                var t = this,
                    n = {
                        "Â°C": {
                            conversion: function(e) {
                                return e - 273.15
                            },
                            precision: 0
                        },
                        "Â°F": {
                            conversion: function(e) {
                                return 9 * e / 5 - 459.67
                            },
                            precision: 0
                        }
                    },
                    i = e[0],
                    o = e[1],
                    r = [function(e) {
                        return e
                    }, n["Â°C"].conversion, n["Â°F"].conversion],
                    a = [],
                    s = [],
                    l = [];
                this.conv = {};
                for (var c = function(e) {
                        var n = r[e](i),
                            c = r[e](o) - n;
                        a.push(c / 255), s.push(n);
                        var d = t.description[e],
                            u = function(t) {
                                return Math.round(a[e] * t + s[e])
                            };
                        l[e] = u, t.conv[d] = {
                            conversion: u,
                            precision: 0,
                            na: ""
                        }
                    }, d = 0; d < r.length; d++) c(d);
                for (var u = [150, 168, 186, 205, 223], h = [], p = function(e) {
                        var t = u[e],
                            n = [t].concat(l.map((function(e) {
                                return e(t)
                            })));
                        h.push(n)
                    }, f = 0; f < u.length; f++) p(f);
                this.lines = h
            }, t
        }(s),
        c = function(e) {
            function t() {
                e.apply(this, arguments)
            }
            return e && (t.__proto__ = e), t.prototype = Object.create(e && e.prototype), t.prototype.constructor = t, t.prototype.initProperties = function() {
                e.prototype.initProperties.call(this), this.defaults = ["mm", "in"], this.nativeSync = !0, this.description = ["mm", "in"], this.cohesion = {
                    snow: {
                        in: "in",
                        mm: "cm"
                    }
                }, this.conv = {
                    mm: {
                        conversion: r,
                        precision: 1
                    },
                    in: {
                        conversion: function(e) {
                            return .0394 * e
                        },
                        precision: 2
                    }
                }
            }, t
        }(s),
        d = function(e) {
            function t() {
                e.apply(this, arguments)
            }
            return e && (t.__proto__ = e), t.prototype = Object.create(e && e.prototype), t.prototype.constructor = t, t.prototype.convertNumber = function(e) {
                var t = {
                    0: "RAIN",
                    1: "JUST_RAIN",
                    2: "THUNDER",
                    3: "FZ_RAIN",
                    4: "MX_ICE",
                    5: "SNOW",
                    6: "WET_SN",
                    7: "RA_SN",
                    8: "PELLETS",
                    9: "LIGHT_THUNDER",
                    10: "THUNDER",
                    11: "HEAVY_THUNDER"
                };
                return e in t ? o[t[e]] : ""
            }, t.prototype.renderLegend = function(e, t) {
                var n = this;
                e.getColor();
                var i = [1, 3, 4, 5, 6, 7, 8].map((function(t) {
                    return '<span style="background: ' + e.colorDark(t, 50) + ';">' + n.convertNumber(t) + "</span>"
                })).join("");
                t.style.removeProperty("background"), t.dataset.overlay = "ptype", t.innerHTML = i
            }, t
        }(a);
    e.Metric = a, e.NumberedMetric = s, e.PrecipMetric = c, e.PtypeMetric = d, e.SatelliteMetric = l, e.rtrnSelf = r
})), W.define("Color", ["store", "Class"], (function(e, t, n) {
    var i = n.extend({
        prepare: !1,
        save: !0,
        sync: !0,
        opaque: !0,
        _init: function() {
            this.key = "color2_" + this.ident, this.default ? this.defineColor(this.default) : this.defaultKey = this.defaultKey || this.ident
        },
        defineColor: function(e) {
            t.insert(this.key, {
                def: e,
                save: this.save,
                sync: this.sync,
                allowed: this.checkValidity
            }), t.on(this.key, this.colorChanged, this), this.prepare && this.getColor()
        },
        checkValidity: function(e) {
            if (!Array.isArray(e)) return !1;
            for (var t = 0; t < e.length; t++) {
                var n = e[t];
                if (!Array.isArray(n) || !n.length || !Array.isArray(n[1])) return !1
            }
            return !0
        },
        colorChanged: function(e) {
            e && this.colors && this.forceGetColor()
        },
        changeColor: function(e, n) {
            t.set(this.key, e, n)
        },
        toDefault: function() {
            t.remove(this.key)
        },
        setMinMax: function() {
            this.min = this.gradient[0][0], this.max = this.gradient[this.gradient.length - 1][0]
        },
        forceGetColor: function() {
            return this.colors = null, this.getColor()
        },
        color: function(e) {
            var t = this.RGBA(e);
            return "rgb(" + t[0] + "," + t[1] + "," + t[2] + ")"
        },
        colorDark: function(e, t) {
            var n = this.RGBA(e);
            return "rgb(" + Math.max(0, n[0] - t) + "," + Math.max(0, n[1] - t) + "," + Math.max(0, n[2] - t) + ")"
        },
        RGBA: function(e) {
            var t = this.value2index(e);
            return [this.colors[t], this.colors[++t], this.colors[++t], this.colors[++t]]
        },
        getMulArray: function(e, t) {
            for (var n = [], i = e.length, o = 0; o < i; o++) n.push(e[o] * t);
            return n
        },
        lerpArray: function(e, t, n) {
            for (var i = 1 - n, o = e.length, r = [], a = 0; a < o; a++) r.push(e[a] * i + t[a] * n);
            return r
        },
        rgba2yuva: function(e) {
            var t = e[0],
                n = e[1],
                i = e[2],
                o = .299 * t + .587 * n + .114 * i;
            return [o, .565 * (i - o), .713 * (t - o), e[3]]
        },
        yuva2rgba: function(e) {
            var t = e[0],
                n = e[1],
                i = e[2];
            return [t + 1.403 * i, t - .344 * n - .714 * i, t + 1.77 * n, e[3]]
        },
        gradYuva: function(e, t, n, i) {
            var o = this.lerpArray(e, t, n);
            if (i) {
                var r = this.vec2size(e[1], e[2]),
                    a = this.vec2size(t[1], t[2]);
                if (r > .05 && a > .05) {
                    var s = this.vec2size(o[1], o[2]);
                    if (s > .01) {
                        var l = (r * (1 - n) + a * n) / s;
                        o[1] *= l, o[2] *= l
                    }
                }
            }
            return o
        },
        vec2size: function(e, t) {
            return Math.sqrt(e * e + t * t)
        },
        getGradientColorYUVA: function(e, t, n) {
            for (var i = 1 / 255, o = this.getMulArray(e, i), r = this.getMulArray(t, i), a = this.rgba2yuva(o), s = this.rgba2yuva(r), l = this.gradYuva(a, s, n, !0), c = this.yuva2rgba(l), d = 0; d < c.length; d++) c[d] = Math.max(0, Math.min(256 * c[d], 255));
            return c
        },
        makePremultiplied: function(e) {
            for (var t = e[3] / 255, n = 0; n < 3; n++) e[n] = Math.max(0, Math.min(t * e[n], 255));
            return e
        },
        createGradientArray: function(e, t, n) {
            void 0 === e && (e = !0), void 0 === t && (t = !1), void 0 === n && (n = 1);
            var i, o, r, a, s, l = this.steps + 1,
                c = new Uint8Array(l << 2),
                d = (this.max - this.min) / this.steps,
                u = this.gradient,
                h = 0,
                p = 1,
                f = u[0],
                m = null !== (i = u[p++]) && void 0 !== i ? i : u[0];
            for (s = 0; s < this.steps; s++)(o = this.min + d * s * n) > m[0] && p < u.length && (f = m, m = u[p++]), a = (o - f[0]) / (m[0] - f[0]), r = this.getGradientColorYUVA(f[1], m[1], a), t && this.makePremultiplied(r), c[h++] = Math.round(r[0]), c[h++] = Math.round(r[1]), c[h++] = Math.round(r[2]), c[h++] = e ? 255 : Math.round(r[3]);
            return this.neutralGrayIndex = h, c[h++] = c[h++] = c[h++] = 128, c[h++] = 255, c
        },
        createSteppedArray: function(e, t, n) {
            n || (n = t);
            for (var i, o = e.length, r = new Uint8Array(o), a = o >> 2, s = t >> 1, l = n, c = 0, d = 0; d < a;) {
                for (i = 0; i < 4; i++) r[4 * d + i] = e[c + i];
                --l <= 0 && (l = t, c = 4 * (d + s)), d++
            }
            return r
        },
        getColor: function() {
            return this.colors ? this : t.hasProperty(this.key) ? (this.gradient = t.get(this.key), this.setMinMax(), this.colors = this.createGradientArray(this.opaque), this.maxIndex = this.steps - 1 << 2, this.step = (this.max - this.min) / this.steps, this) : null
        },
        value2index: function(e) {
            return isNaN(e) ? this.neutralGrayIndex : Math.max(0, Math.min(this.maxIndex, (e - this.min) / this.step << 2))
        }
    });
    e.default = i
})), W.define("Product", ["utils", "rootScope", "broadcast", "colors", "http", "storage", "store", "Class", "Calendar", "Window", "rhMessage"], (function(e, t, n, i, o, r, a, s, l, c, d, u) {
    var h = d.Window,
        p = c.Calendar,
        f = l.extend({
            ident: "ecmwf",
            maxTileZoom: 10,
            animationSpeed: 3e3,
            animationSpeed1h: 1e3,
            fileSuffix: "jpg",
            JPGtransparency: !1,
            PNGtransparency: !1,
            dataQuality: "normal",
            betterDataQuality: [],
            animation: !0,
            forecastSize: 240,
            labelsTemp: !0,
            overlays: [],
            requiresInfoJson: !1,
            prefferedProduct: "ecmwf",
            productExpires: 0,
            pathGenerator: "",
            loadingPromise: null,
            isolines: [],
            directory: "",
            _init: function() {
                this.productExpires = 0, this.minifest = null, this.loadingPromise = null, this.pathGenerator = "{server}/im/v3.0/{directory}/{refTime}/{path}/wm_grid_257/<z>/<x>/<y>/{filename}-{level}.{fileSuffix}"
            },
            setMinifest: function(e) {
                var t = this.getStoreKey();
                if (e.forced) this.minifest = e;
                else {
                    var n = a.get(t);
                    this.minifest = n && "ref" in n ? e.ref >= n.ref ? e : n : e
                }
                a.put(t, this.minifest)
            },
            refTime: function() {
                return this.calendar ? this.calendar.refTime : ""
            },
            getUpdateTimes: function() {
                return this.calendar ? {
                    refTime: this.calendar.refTimeTxt,
                    minUpdate: this.calendar.updateTs
                } : {}
            },
            setExpireTime: function() {
                this.productExpires = Date.now() + 5 * t.tsMinute
            },
            moveTs: function(e, n) {
                if (void 0 === n && (n = !1), n) {
                    var i = this.acTimes.indexOf(s.get("acTime"));
                    if (i > -1) return i = t.bound(i + (e ? 1 : -1), 0, this.acTimes.length), s.set("acTime", this.acTimes[i]), !0
                } else {
                    var o = this.calendar,
                        r = o.paths,
                        a = o.timestamps,
                        l = r.indexOf(s.get("path"));
                    if (l > -1) return l = t.bound(l + (e ? 1 : -1), 0, r.length), s.set("timestamp", a[l], {
                        UIident: "keyboard"
                    }), !0
                }
                return !1
            },
            getTimeFrag: function() {
                return (new Date).toISOString().replace(/.*T(\d+):(\d+).*/, "$1$2")
            },
            loadMinifest: function(e) {
                void 0 === e && (e = !1);
                var t = this.getTimeFrag(),
                    i = (this.server || n.server) + "/im/v3.0/" + this.directory + "/" + this.getMinifestFilename() + "?" + t;
                return r.get(i, {
                    cache: !e
                })
            },
            loadAndProcessMinifest: function(e) {
                var t = this;
                return void 0 === e && (e = !1), this.loadMinifest().then((function(n) {
                    var i = n.data;
                    i.refTime && (i.ref = i.refTime, delete i.refTime), t.minifest && !e && t.minifest.ref === i.ref || (t.setMinifest(i), t.infoVersion = i.info, t.calendar = new p({
                        numOfHours: t.forecastSize,
                        minifestFile: t.minifest
                    }), s.get("product") === t.ident && s.set("calendar", t.calendar), s.set("lastModified", new Date(t.minifest.ref).getTime()))
                })).catch((function(e) {
                    window.wError("Product", "Minifest load/parsing failed", e);
                    var n = (null == e ? void 0 : e.responseText) || "Sorry, but we are unable to download data for the " + t.modelName + '. Please check the <a href="https://community.windy.com/category/24/system-status" target="_blank">system status</a> to make sure there is no any outage, or try again later.';
                    throw new h({
                        ident: "message",
                        className: "bg-error",
                        html: "<span>" + n + "</span>"
                    }).open(), e
                }))
            },
            loadInfo: function(e) {
                var i = this;
                if (void 0 === e && (e = 3), e <= 0) return Promise.reject();
                var o = (this.server || n.server) + "/im/v3.0/" + this.directory + "/" + this.infoVersion + "/info.json";
                return r.get(o, {
                    ttl: 48 * t.tsHour
                }).catch((function() {
                    return i.loadInfo(e - 1)
                }))
            },
            loadAndProcessInfo: function() {
                return this.requiresInfoJson ? this.loadInfo().then((function(e) {
                    var t = e.data;
                    Object.keys(t && t.param || {}).forEach((function(e) {
                        if (t.param[e].color) {
                            var n = Object.keys(o).find((function(t) {
                                return o[t].defaultKey === e
                            }));
                            n && o[n] && o[n].defineColor.call(o[n], t.param[e].color)
                        }
                    }))
                })).catch((function() {
                    var e = "Cannot get info.json from im server.";
                    throw new h({
                        ident: "message",
                        className: "bg-error",
                        html: "<span>" + e + "</span>"
                    }).open(), e
                })) : Promise.resolve()
            },
            checkNewMinifest: function() {
                var e = this;
                this.loadAndProcessMinifest().then((function() {
                    e.loadingPromise = null, s.set("product", e.ident, {
                        forceChange: !0
                    }).then((function() {
                        setTimeout((function() {
                            i.emit("redrawLayers", {
                                noCache: !0
                            })
                        }), 1e3)
                    }))
                }))
            },
            open: function() {
                var e = this;
                return this.refreshInterval || (this.refreshInterval = setInterval(this.checkNewMinifest.bind(this), 18e5)), n.isMobileOrTablet || this.printLogo(), this.loadingPromise ? this.loadingPromise : Date.now() < this.productExpires ? Promise.resolve(this.calendar) : (this.loadingPromise = new Promise((function(t, n) {
                    e.loadAndProcessMinifest().then((function() {
                        return e.loadAndProcessInfo()
                    })).then((function() {
                        e.setExpireTime(), e.loadingPromise = null, t(e.calendar)
                    })).catch(n)
                })), this.loadingPromise)
            },
            close: function() {
                n.isMobileOrTablet || this.removeLogo(), clearInterval(this.refreshInterval), this.refreshInterval = null
            },
            pointIsInBounds: function(e) {
                if (!this.bounds) return !0;
                for (var t = +e.lat, n = +e.lon, i = 0; i < this.bounds.length; i++) {
                    for (var o = !1, r = this.bounds[i].length, a = this.bounds[i], s = 0, l = r - 1; s < r; l = s++) {
                        var c = a[s][0],
                            d = a[s][1],
                            u = a[l][0],
                            h = a[l][1];
                        d > n != h > n && t < (u - c) * (n - d) / (h - d) + c && (o = !o)
                    }
                    if (o) return !0
                }
                return !1
            },
            printLogo: function() {
                u.clear(), this.logo && (this.logoEl || (this.logoEl = document.createElement("div"), this.logoEl.innerHTML = this.logo, this.logoEl.className = "rh-absoluted rh-transparent"), u.insert(this.logoEl))
            },
            removeLogo: function() {
                this.logoEl && this.logo && u.remove(this.logoEl)
            },
            expire: function() {
                this.productExpires = 0
            },
            getStoreKey: function() {
                return "lastMinifest/" + this.directory
            },
            getMinifestFilename: function() {
                return "minifest2.json"
            }
        });
    e.default = f
})), W.define("Product1h", ["Product", "subscription"], (function(e, t, n) {
    var i = t.extend({
        loadAndProcessMinifest: function() {
            return t.loadAndProcessMinifest.call(this, !0)
        },
        getMinifestFilename: function() {
            return "minifest2" + (this.isUsingOneHourMinifest() ? "_1h" : "") + ".json"
        },
        isUsingOneHourMinifest: function() {
            return n.hasAny()
        },
        getStoreKey: function() {
            return "lastMinifest/" + this.directory + (this.isUsingOneHourMinifest() ? "1h" : "")
        }
    });
    e.default = i
})), W.define("StaticProduct", ["Product"], (function(e, t) {
    var n = t.extend({
        dailyCache: (new Date).toISOString().replace(/^\d+-(\d+)-(\d+)T.*$/, "$1$2"),
        _init: function() {},
        refTime: function() {
            return this.dailyCache
        },
        open: function() {
            return Promise.resolve()
        }
    });
    e.default = n
})), W.define("NamProducts", ["Product"], (function(e, t) {
    var n = t.extend({
        provider: "NOAA",
        interval: 360,
        modelName: "NAM",
        dataQuality: "high",
        betterDataQuality: ["rain", "clouds", "lclouds", "hclouds", "mclouds"],
        JPGtransparency: !0,
        forecastSize: 72,
        levels: ["surface", "975h", "950h", "925h", "900h", "850h", "800h", "700h", "600h", "500h", "400h", "300h", "250h", "200h", "150h"],
        overlays: ["wind", "temp", "clouds", "cape", "rh", "gust", "pressure", "dewpoint", "rain", "lclouds", "hclouds", "mclouds", "snowAccu", "rainAccu", "ptype", "gustAccu", "ccl"],
        acTimes: ["next12h", "next24h", "next48h", "next60h"],
        isolines: ["pressure", "temp"]
    });
    e.default = n
})), W.define("HrrrProducts", ["Product1h"], (function(e, t) {
    var n = t.extend({
        provider: "NCEP",
        modelName: "HRRR",
        dataQuality: "extreme",
        betterDataQuality: ["rain", "clouds", "lclouds", "hclouds", "mclouds"],
        interval: 720,
        JPGtransparency: !0,
        forecastSize: 72,
        levels: ["surface", "975h", "950h", "925h", "900h", "850h", "800h", "700h", "600h", "500h", "400h", "300h", "250h", "200h", "150h"],
        overlays: ["wind", "temp", "clouds", "rh", "cape", "gust", "pressure", "dewpoint", "rain", "lclouds", "hclouds", "mclouds", "snowAccu", "rainAccu", "ptype", "gustAccu", "ccl"],
        acTimes: ["next12h", "next24h", "next48h"],
        isolines: ["pressure", "temp"]
    });
    e.default = n
})), W.define("IconProducts", ["Product1h"], (function(e, t) {
    var n = t.extend({
        provider: "DWD",
        interval: 720,
        intervalPremium: 360,
        prefferedProduct: "icon",
        animation: !0,
        betterDataQuality: ["rain", "clouds", "lclouds", "mclouds", "hclouds"],
        forecastSize: 120,
        labelsTemp: !0,
        levels: ["surface", "950h", "925h", "900h", "850h", "800h", "700h", "600h", "500h", "400h", "300h", "250h", "200h", "150h"],
        overlays: ["snowcover", "wind", "temp", "pressure", "clouds", "lclouds", "mclouds", "hclouds", "rh", "gust", "cape", "dewpoint", "rain", "deg0", "snowAccu", "rainAccu", "ptype", "gustAccu", "fog", "ccl"],
        acTimes: ["next12h", "next24h", "next2d", "next3d", "next5d"],
        isolines: ["pressure", "gh", "temp"]
    });
    e.default = n
})), W.define("Layer", ["products", "utils", "rootScope", "store", "colors", "metrics"], (function(e, t, n, i, o, r, a) {
    var s = function(e) {
        this.initProperties(), Object.assign(this, e)
    };
    s.prototype.getColor = function() {
        return this.c.getColor()
    }, s.prototype.getCalendar = function(e) {
        var n = t[e] ? t[e].calendar : t.ecmwf.calendar;
        return n ? Promise.resolve(n) : new Promise((function(n) {
            t[e].open.call(t[e]).then((function(e) {
                return n(e)
            }))
        }))
    }, s.prototype.getParams = function(e, r) {
        var a, s, l, c, d, u = this,
            h = this.product || e.product,
            p = t[h],
            f = Object.assign({}, e, {
                layer: this.ident,
                server: p.server || i.server,
                JPGtransparency: this.JPGtransparency || p.JPGtransparency,
                PNGtransparency: this.PNGtransparency || p.PNGtransparency,
                maxTileZoom: this.maxTileZoom || p.maxTileZoom,
                transformR: this.transformR || void 0,
                transformG: this.transformG || void 0,
                transformB: this.transformB || void 0,
                directory: p.directory,
                filename: this.filename || e.overlay || this.ident,
                fileSuffix: this.fileSuffix || p.fileSuffix,
                dataQuality: this.dataQuality || p.dataQuality,
                upgradeDataQuality: p.betterDataQuality && p.betterDataQuality.includes(this.ident),
                refTime: p.refTime.call(p),
                level: (a = u.levels || p.levels, s = e.level, l = e.hasMoreLevels, c = e.overlay, d = s, l || (d = "surface"), a && !a.includes(d) && (d = a[0]), "100m" === d && "wind" !== c && (d = "surface"), d),
                fullPath: ""
            }, this.renderParams);
        return (p.ident === r ? Promise.resolve() : this.getCalendar(p.ident).then((function(e) {
            e && (f.path = e.ts2path(o.get("timestamp")), f.refTime = e.refTime, f.level = u.levels && u.levels[0] || f.level)
        }))).then((function() {
            var e = u.isAccu ? "{server}/im/v3.0/{directory}/{refTime}/{acTime}/wm_grid_257/<z>/<x>/<y>/{filename}-surface.{fileSuffix}" : u.pathGenerator || p.pathGenerator;
            return f.fullPath = n.template(e, f), u.query && (f.fullPath = n.addQs(f.fullPath, u.query)), f
        }))
    }, s.prototype.initProperties = function() {
        this.renderer = "tileLayer", this.sea = !1, this.JPGtransparency = !1, this.renderParams = {
            renderFrom: "R"
        }
    };
    var l = function(e) {
        function t() {
            e.apply(this, arguments)
        }
        return e && (t.__proto__ = e), t.prototype = Object.create(e && e.prototype), t.prototype.constructor = t, t.prototype.initProperties = function() {
            e.prototype.initProperties.call(this), this.PNGtransparency = !0, this.renderParams = {
                interpolate: "interpolateWaves",
                renderFrom: "B",
                sea: !0
            }, this.c = r.waves, this.m = a.waves
        }, t
    }(s);
    e.Layer = s, e.WaveLayer = l
})), W.define("Overlay", ["layers", "trans"], (function(e, t, n) {
    var i = n.t,
        o = function(e) {
            this.initProperties(), Object.assign(this, e);
            var n = t[this.ident];
            if (n) {
                var i = n.m;
                i && (this.convertValue = i.convertValue.bind(i), this.convertNumber = i.convertNumber.bind(i), this.setMetric = i.setMetric.bind(i), this.cycleMetric = i.cycleMetric.bind(i), this.listMetrics = i.listMetrics.bind(i), this.m = i), this.c = n.c, this.l = n.l, this.cm = n.cm
            }
        },
        r = {
            metric: {
                configurable: !0
            }
        };
    o.prototype.paintLegend = function(e) {
        this.m && this.m.description && this.c ? this.m.renderLegend(this.c, e, this.l || this.m) : e.innerHTML = ""
    }, o.prototype.getName = function() {
        return this.trans in i && i[this.trans] ? i[this.trans] : this.ident
    }, r.metric.get = function() {
        return this.m ? this.m.metric : ""
    }, o.prototype.initProperties = function() {
        this.poiInCities = !0
    }, Object.defineProperties(o.prototype, r), e.Overlay = o
})), W.define("overlays", ["Overlay", "colors", "Window"], (function(e, t, n, i) {
    var o = i.Window,
        r = t.Overlay,
        a = new r({
            ident: "wind",
            hasMoreLevels: !0,
            trans: "WIND",
            icon: "&#9780",
            layers: ["windParticles", "wind"],
            globeNotSupported: !1
        }),
        s = new r({
            ident: "temp",
            trans: "TEMP",
            icon: "&#x1F321",
            layers: ["windParticles", "temp"],
            hasMoreLevels: !0
        }),
        l = new r({
            parentMenu: "temp",
            ident: "dewpoint",
            trans: "DEW_POINT",
            icon: "&#x1F321",
            layers: ["windParticles", "dewpoint"],
            hasMoreLevels: !0
        }),
        c = new r({
            parentMenu: "wind",
            ident: "gust",
            trans: "GUST",
            icon: "&#x1F321",
            layers: ["windParticles", "gust"]
        }),
        d = new r({
            parentMenu: "wind",
            ident: "gustAccu",
            trans: "GUSTACCU",
            icon: "&#x1F321",
            isAccu: !0,
            layers: ["windParticles", "gustAccu"]
        }),
        u = new r({
            parentMenu: "temp",
            ident: "rh",
            icon: "&#xf76b",
            trans: "RH",
            layers: ["windParticles", "rh"],
            hasMoreLevels: !0
        }),
        h = new r({
            ident: "pressure",
            trans: "PRESS",
            icon: "&#13225",
            layers: ["windParticles", "pressure"]
        }),
        p = new r({
            ident: "rain",
            trans: "RAIN_THUNDER",
            icon: "&#xf75a",
            layers: ["windParticles", "rain"]
        }),
        f = new r({
            ident: "clouds",
            trans: "CLOUDS2",
            icon: "&#xf75f",
            layers: ["windParticles", "clouds"],
            paintLegend: function(e) {
                this.m.renderLegend(n.rainClouds, e, this.m)
            }
        }),
        m = new r({
            parentMenu: "clouds",
            ident: "lclouds",
            trans: "LOW_CLOUDS",
            icon: "&#xf75f",
            layers: ["windParticles", "lclouds"]
        }),
        v = new r({
            parentMenu: "clouds",
            ident: "mclouds",
            trans: "MEDIUM_CLOUDS",
            icon: "&#xf75f",
            layers: ["windParticles", "mclouds"]
        }),
        g = new r({
            parentMenu: "clouds",
            ident: "hclouds",
            trans: "HIGH_CLOUDS",
            layers: ["windParticles", "hclouds"],
            icon: "&#xf75f"
        }),
        w = new r({
            parentMenu: "clouds",
            ident: "cape",
            trans: "CAPE",
            layers: ["windParticles", "cape"],
            icon: "&#xf75f;"
        }),
        y = new r({
            parentMenu: "clouds",
            ident: "cbase",
            trans: "CLOUD_ALT",
            icon: "&#xf75f;",
            layers: ["windParticles", "cbase"]
        }),
        b = new r({
            parentMenu: "rain",
            ident: "snowAccu",
            trans: "NEWSNOW",
            icon: "&#xf740",
            isAccu: !0,
            layers: ["snowAccu"],
            hideParticles: !0
        }),
        T = new r({
            parentMenu: "rain",
            ident: "rainAccu",
            trans: "RACCU",
            icon: "&#xf740",
            isAccu: !0,
            layers: ["rainAccu"],
            hideParticles: !0
        }),
        S = new r({
            ident: "waves",
            hideWxLabels: !0,
            trans: "WAVES",
            icon: "&#12316",
            layers: ["waveParticles", "waves"]
        }),
        _ = new r({
            parentMenu: "waves",
            hideWxLabels: !0,
            ident: "wwaves",
            trans: "WWAVES",
            icon: "|",
            layers: ["waveParticles", "wwaves"]
        }),
        E = new r({
            parentMenu: "waves",
            hideWxLabels: !0,
            ident: "swell1",
            trans: "SWELL",
            icon: "{",
            layers: ["waveParticles", "swell1"]
        }),
        A = {
            wind: a,
            temp: s,
            dewpoint: l,
            gust: c,
            gustAccu: d,
            rh: u,
            pressure: h,
            rain: p,
            clouds: f,
            lclouds: m,
            mclouds: v,
            hclouds: g,
            cape: w,
            cbase: y,
            snowAccu: b,
            rainAccu: T,
            waves: S,
            wwaves: _,
            swell1: E,
            swell2: new r({
                parentMenu: "waves",
                hideWxLabels: !0,
                ident: "swell2",
                trans: "SWELL2",
                icon: "&#12316 ",
                layers: ["waveParticles", "swell2"]
            }),
            swell3: new r({
                parentMenu: "waves",
                hideWxLabels: !0,
                ident: "swell3",
                trans: "SWELL3",
                icon: "&#12316",
                layers: ["waveParticles", "swell3"]
            }),
            swell: E,
            currents: new r({
                parentMenu: "waves",
                hideWxLabels: !0,
                ident: "currents",
                trans: "CURRENT",
                icon: "&#12316",
                layers: ["currentParticles", "currents"]
            }),
            currentsTide: new r({
                parentMenu: "waves",
                hideWxLabels: !0,
                ident: "currentsTide",
                trans: "CURRENT_TIDE",
                icon: "&#12316",
                layers: ["currentsTideParticles", "currentsTide"]
            }),
            sst: new r({
                parentMenu: "waves",
                hideWxLabels: !0,
                ident: "sst",
                trans: "SST2",
                icon: "&#12316",
                layers: ["currentParticles", "sst"]
            }),
            visibility: new r({
                parentMenu: "clouds",
                ident: "visibility",
                trans: "VISIBILITY",
                icon: "&#9729",
                layers: ["windParticles", "visibility"]
            }),
            fog: new r({
                parentMenu: "clouds",
                ident: "fog",
                trans: "FOG",
                icon: "&#9729",
                layers: ["fog"],
                hideParticles: !0
            }),
            thunder: new r({
                parentMenu: "rain",
                ident: "thunder",
                trans: "THUNDER",
                icon: "&#xf0e7",
                layers: ["windParticles", "thunder"]
            }),
            snowcover: new r({
                parentMenu: "rain",
                ident: "snowcover",
                trans: "SNOWDEPTH",
                icon: "&#xf740",
                layers: ["windParticles", "snowcover"]
            }),
            cloudtop: new r({
                parentMenu: "clouds",
                ident: "cloudtop",
                trans: "CTOP",
                icon: "&#9729",
                layers: ["windParticles", "cloudtop"]
            }),
            deg0: new r({
                parentMenu: "temp",
                ident: "deg0",
                trans: "FREEZING",
                icon: "&#xf76b",
                layers: ["windParticles", "deg0"]
            }),
            airQ: new r({
                ident: "airQ",
                trans: "AIR_QUALITY",
                icon: "&#xf773",
                virtual: !0
            }),
            gtco3: new r({
                parentMenu: "airQ",
                ident: "gtco3",
                trans: "OZONE",
                icon: "&#xf773",
                layers: ["ecmwfWindParticles150h", "gtco3"]
            }),
            pm2p5: new r({
                parentMenu: "airQ",
                ident: "pm2p5",
                trans: "PM2P5",
                icon: "&#xf773",
                layers: ["ecmwfWindParticles", "pm2p5"]
            }),
            no2: new r({
                parentMenu: "airQ",
                ident: "no2",
                trans: "NO22",
                icon: "&#xf773",
                layers: ["ecmwfWindParticles", "no2"]
            }),
            aod550: new r({
                parentMenu: "airQ",
                ident: "aod550",
                trans: "AOD550",
                icon: "&#xf773",
                layers: ["ecmwfWindParticles600h", "aod550"]
            }),
            tcso2: new r({
                parentMenu: "airQ",
                ident: "tcso2",
                trans: "TCSO2",
                icon: "&#xf773",
                layers: ["ecmwfWindParticles500h", "tcso2"]
            }),
            go3: new r({
                parentMenu: "airQ",
                ident: "go3",
                trans: "GO3",
                icon: "&#xf773",
                layers: ["ecmwfWindParticles", "go3"]
            }),
            fires: new r({
                parentMenu: "airQ",
                ident: "fires",
                trans: "FIRE_INTENSITY",
                icon: "&#xf773",
                layers: ["ecmwfWindParticles", "fires"]
            }),
            cosc: new r({
                parentMenu: "airQ",
                ident: "cosc",
                trans: "COSC",
                icon: "&#xf773",
                layers: ["ecmwfWindParticles", "cosc"]
            }),
            dustsm: new r({
                parentMenu: "airQ",
                ident: "dustsm",
                trans: "DUSTSM",
                icon: "&#xf773",
                layers: ["ecmwfWindParticles", "dustsm"]
            }),
            ptype: new r({
                parentMenu: "rain",
                ident: "ptype",
                trans: "PTYPE",
                icon: "&#xf740",
                layers: ["windParticles", "ptype"],
                paintLegend: function(e) {
                    this.m.renderLegend(n.ptype.getColor(), e)
                }
            }),
            ccl: new r({
                parentMenu: "clouds",
                ident: "ccl",
                trans: "CCL",
                icon: "î¤€",
                layers: ["ccl", "windParticles"],
                onopen: function() {
                    this.infoWasAlreadyDispayed || (this.window = new o({
                        ident: "ccl-info",
                        attachPoint: "#bottom",
                        className: "window transparent-window size-m",
                        html: '\n                <p>\n                    This is <strong>beta version</strong> of our new thermals forecast.\n                    Let us know how you like it <a target="_blank" style="text-decoration: underline" href="https://community.windy.com/topic/16458/windy-com-introduces-soaring-forecast">here</a>.\n                </p>\n                <p data-icon="îŽ">\n                    Full version will be available only to Premium users later, so <span class="clickable" style="text-decoration: underline" data-do="rqstOpen,subscription">subscribe to Premium now</span>.\n                </p>\n            '
                    }), this.window.open(), this.infoWasAlreadyDispayed = !0)
                },
                onclose: function() {
                    this.window && this.window.close.call(this.window)
                }
            }),
            gh: new r({
                ident: "gh",
                layers: ["gh"]
            }),
            radarSat: new r({
                ident: "radarSat",
                globeNotSupported: !0,
                virtual: !0,
                trans: "RADAR_SAT",
                icon: "O"
            }),
            radar: new r({
                parentMenu: "radarSat",
                allwaysOn: !0,
                poiInCities: !1,
                globeNotSupported: !0,
                ident: "radar",
                trans: "RADAR",
                icon: "î€—",
                layers: ["radar"],
                hideParticles: !0
            }),
            satellite: new r({
                parentMenu: void 0,
                allwaysOn: !0,
                poiInCities: !1,
                globeNotSupported: !0,
                ident: "satellite",
                trans: "SATELLITE",
                icon: "î†",
                layers: ["satellite"],
                hideParticles: !0
            }),
            satelliteIRBT: new r({
                ident: "satellite",
                trans: "SATELLITE",
                globeNotSupported: !0,
                partOf: "satellite",
                icon: "î†"
            }),
            capAlerts: new r({
                ident: "capAlerts",
                trans: "WX_WARNINGS",
                icon: "î…",
                layers: ["capAlerts"],
                hideParticles: !0
            }),
            map: new r({
                ident: "map",
                trans: "HMAP",
                icon: "î€”",
                layers: ["map"],
                hideParticles: !0
            }),
            efiWind: new r({
                icon: "î€¯",
                trans: "EFORECAST",
                hideParticles: !0,
                ident: "efiWind",
                trans2: "WIND",
                layers: ["efiWind"]
            }),
            efiTemp: new r({
                icon: "î€¯",
                trans: "EFORECAST",
                hideParticles: !0,
                ident: "efiTemp",
                trans2: "TEMP",
                partOf: "efiWind",
                layers: ["efiTemp"]
            }),
            efiRain: new r({
                icon: "î€¯",
                trans: "EFORECAST",
                hideParticles: !0,
                ident: "efiRain",
                trans2: "RAIN",
                partOf: "efiWind",
                layers: ["efiRain"]
            }),
            intersucho: new r({
                ident: "intersucho",
                trans: "INTERSUCHO",
                icon: "î¤„",
                virtual: !0
            }),
            awd_0_40: new r({
                icon: "î¤",
                parentMenu: "intersucho",
                trans: "INTERSUCHO_AWD",
                hideParticles: !0,
                ident: "awd_0_40",
                trans2: "INTERSUCHO_40",
                layers: ["awd_0_40"]
            }),
            awd_0_100: new r({
                icon: "î¤",
                parentMenu: "intersucho",
                trans: "INTERSUCHO_AWD",
                hideParticles: !0,
                ident: "awd_0_100",
                trans2: "INTERSUCHO_100",
                partOf: "awd_0_40",
                layers: ["awd_0_100"]
            }),
            awp_0_40: new r({
                icon: "î¤‚",
                parentMenu: "intersucho",
                trans: "INTERSUCHO_AWP",
                hideParticles: !0,
                ident: "awp_0_40",
                trans2: "INTERSUCHO_40",
                layers: ["awp_0_40"],
                paintLegend: function(e) {
                    this.m.renderLegend(n.awp_0_40.getColor(), e, this.m)
                }
            }),
            awp_0_100: new r({
                icon: "î¤‚",
                parentMenu: "intersucho",
                trans: "INTERSUCHO_AWP",
                hideParticles: !0,
                ident: "awp_0_100",
                trans2: "INTERSUCHO_100",
                partOf: "awp_0_40",
                layers: ["awp_0_100"],
                paintLegend: function(e) {
                    this.m.renderLegend(n.awp_0_40.getColor(), e, this.m)
                }
            }),
            awr_0_40: new r({
                icon: "î¤ƒ",
                parentMenu: "intersucho",
                trans: "INTERSUCHO_AWR",
                hideParticles: !0,
                ident: "awr_0_40",
                trans2: "INTERSUCHO_40",
                layers: ["awr_0_40"]
            }),
            awr_0_100: new r({
                icon: "î¤ƒ",
                parentMenu: "intersucho",
                trans: "INTERSUCHO_AWR",
                hideParticles: !0,
                ident: "awr_0_100",
                trans2: "INTERSUCHO_100",
                partOf: "awr_0_40",
                layers: ["awr_0_100"]
            })
        };
    e.default = A
})), W.define("metrics", ["Metric", "trans"], (function(e, t, n) {
    var i, o = n.t,
        r = t.PtypeMetric,
        a = t.SatelliteMetric,
        s = t.PrecipMetric,
        l = t.rtrnSelf,
        c = t.NumberedMetric,
        d = {
            "%": {
                conversion: function(e) {
                    return Math.round(100 * e)
                },
                precision: 0
            }
        },
        u = new c({
            ident: "temp",
            separator: "",
            defaults: ["Â°C", "Â°F"],
            conv: (i = 0, {
                "Â°C": {
                    conversion: function(e) {
                        return e - 273.15
                    },
                    precision: i
                },
                "Â°F": {
                    conversion: function(e) {
                        return 9 * e / 5 - 459.67
                    },
                    precision: i
                }
            }),
            description: ["Â°C", "Â°F"],
            nativeSync: !0,
            lines: [
                [252, -20, -5],
                [262, -10, 15],
                [272, 0, 30],
                [282, 10, 50],
                [292, 20, 70],
                [302, 30, 85],
                [313, 40, 100]
            ]
        }),
        h = new c({
            ident: "wind",
            defaults: ["kt"],
            nativeSync: !0,
            conv: {
                kt: {
                    conversion: function(e) {
                        return 1.943844 * e
                    },
                    precision: 0
                },
                bft: {
                    conversion: function(e) {
                        for (var t = [.3, 1.5, 3.3, 5.5, 8, 10.8, 13.9, 17.2, 20.7, 24.5, 28.4, 32.6], n = 0; n < t.length; n++)
                            if (e < t[n]) return n;
                        return 12
                    },
                    precision: 0
                },
                "m/s": {
                    conversion: l,
                    precision: 0
                },
                "km/h": {
                    conversion: function(e) {
                        return 3.6 * e
                    },
                    precision: 0
                },
                mph: {
                    conversion: function(e) {
                        return 2.236936 * e
                    },
                    precision: 0
                }
            },
            description: ["kt", "bft", "m/s", "mph", "km/h"],
            lines: [
                [0, 0, 0, 0, 0, 0],
                [3, 5, 2, 3, 6, 10],
                [5, 10, 3, 5, 10, 20],
                [10, 20, 5, 10, 20, 35],
                [15, 30, 7, 15, 35, 55],
                [20, 40, 8, 20, 45, 70],
                [30, 60, 11, 30, 70, 100]
            ]
        }),
        p = new c({
            ident: "rh",
            defaults: ["%"],
            conv: {
                "%": {
                    conversion: l,
                    precision: 0
                }
            },
            description: ["%"],
            lines: [
                [30, 30],
                [50, 50],
                [80, 80],
                [90, 90],
                [100, 100]
            ]
        }),
        f = new c({
            ident: "clouds",
            defaults: ["rules"],
            conv: {
                rules: {
                    conversion: l,
                    precision: 0
                },
                "%": {
                    conversion: l,
                    precision: 0
                }
            },
            description: ["rules", "%"],
            lines: [
                [25, "FEW", 25],
                [50, "SCT", 50],
                [70, "BKN", 70],
                [100, "OVC", 100]
            ]
        }),
        m = new c({
            ident: "pressure",
            defaults: ["hPa", "inHg", "mmHg"],
            conv: {
                hPa: {
                    conversion: function(e) {
                        return e / 100
                    },
                    precision: 0
                },
                mmHg: {
                    conversion: function(e) {
                        return e / 133.322387415
                    },
                    precision: 0
                },
                inHg: {
                    conversion: function(e) {
                        return e / 3386.389
                    },
                    precision: 2
                }
            },
            description: ["hPa", "inHg", "mmHg"],
            lines: [
                [99e3, 990, 29.2, 742],
                [1e5, 1e3, 29.6, 750],
                [101e3, 1010, 29.8, 757],
                [102e3, 1020, 30.1, 765],
                [103e3, 1030, 30.4, 772]
            ]
        }),
        v = new s({
            ident: "rain",
            lines: [
                [1.5, 1.5, ".06"],
                [2, 2, ".08"],
                [3, 3, ".11"],
                [7, 7, ".24"],
                [10, 10, ".39"],
                [20, 20, ".78"],
                [30, 30, 1.2]
            ]
        }),
        g = new c({
            ident: "snow",
            defaults: ["cm", "in"],
            nativeSync: !0,
            conv: {
                cm: {
                    conversion: l,
                    precision: 1
                },
                in: {
                    conversion: function(e) {
                        return .39 * e
                    },
                    precision: 1
                }
            },
            description: ["cm", "in"],
            lines: [
                [2, 2, ".8"],
                [5, 5, 2],
                [10, 10, 4],
                [50, 50, 20],
                [100, "1m", "3ft"],
                [300, "3m", "9ft"]
            ],
            cohesion: {
                rain: {
                    in: "in",
                    cm: "mm"
                }
            }
        }),
        w = new c({
            ident: "cape",
            defaults: ["J/kg"],
            conv: {
                "J/kg": {
                    conversion: l,
                    precision: 0
                }
            },
            description: ["J/kg"],
            lines: [
                [0, 0],
                [500, 500],
                [1500, 1500],
                [2500, 2500],
                [5e3, 5e3]
            ]
        }),
        y = new c({
            ident: "gtco3",
            defaults: ["DU"],
            conv: {
                DU: {
                    conversion: l,
                    precision: 0
                }
            },
            description: ["DU"],
            lines: [
                [150, 150],
                [220, 220],
                [280, 280],
                [330, 330],
                [400, 400]
            ]
        }),
        b = new c({
            ident: "aod550",
            defaults: ["AOD"],
            conv: {
                AOD: {
                    conversion: l,
                    precision: 3
                }
            },
            description: ["AOD"],
            lines: [
                [0, 0],
                [.25, .25],
                [.5, .5],
                [1, 1],
                [2, 2],
                [4, 4]
            ]
        }),
        T = new c({
            ident: "pm2p5",
            defaults: ["Âµg/mÂ³"],
            conv: {
                "Âµg/mÂ³": {
                    conversion: l,
                    precision: 0
                }
            },
            description: ["Âµg/mÂ³"],
            lines: [
                [0, 0],
                [10, 10],
                [20, 20],
                [100, 100],
                [1e3, 1e3]
            ]
        }),
        S = new c({
            ident: "no2",
            defaults: ["Âµg/mÂ³"],
            conv: {
                "Âµg/mÂ³": {
                    conversion: l,
                    precision: 2
                }
            },
            description: ["Âµg/mÂ³"],
            lines: [
                [0, 0],
                [1, 1],
                [5, 5],
                [25, 25],
                [100, 100]
            ]
        }),
        _ = new c({
            ident: "tcso2",
            defaults: ["mg/mÂ²"],
            conv: {
                "mg/mÂ²": {
                    conversion: l,
                    precision: 2
                }
            },
            description: ["mg/mÂ²"],
            lines: [
                [0, 0],
                [1, 1],
                [5, 5],
                [25, 25],
                [100, 100]
            ]
        }),
        E = new c({
            ident: "go3",
            defaults: ["Âµg/mÂ³"],
            conv: {
                "Âµg/mÂ³": {
                    conversion: l,
                    precision: 2
                }
            },
            description: ["Âµg/mÂ³"],
            lines: [
                [0, 0],
                [10, 10],
                [20, 20],
                [100, 100],
                [1e3, 1e3]
            ]
        }),
        A = new c({
            ident: "altitude",
            defaults: ["m", "ft"],
            conv: {
                m: {
                    conversion: function(e) {
                        return 100 * Math.round(e / 100)
                    },
                    precision: 0
                },
                ft: {
                    conversion: function(e) {
                        return 100 * Math.round(.0328 * e)
                    },
                    precision: 0
                }
            },
            description: ["m", "ft"],
            lines: [
                [0, 0, 0],
                [1e3, 1e3, 3e3],
                [1500, 1500, 5e3],
                [5e3, "5k", "FL150"],
                [9e3, "9k", "FL300"]
            ]
        }),
        P = new c({
            ident: "elevation",
            defaults: ["m", "ft"],
            conv: {
                m: {
                    conversion: l,
                    precision: 0
                },
                ft: {
                    conversion: function(e) {
                        return Math.round(3.28 * e)
                    },
                    precision: 0
                }
            },
            description: ["m", "ft"]
        }),
        L = new c({
            ident: "distance",
            defaults: ["km", "mi"],
            conv: {
                km: {
                    conversion: function(e) {
                        return e / 1e3
                    },
                    precision: 1
                },
                mi: {
                    conversion: function(e) {
                        return e / 1609.344
                    },
                    precision: 1
                },
                NM: {
                    conversion: function(e) {
                        return e / 1852
                    },
                    precision: 1
                }
            },
            description: ["km", "mi", "NM"]
        }),
        C = new c({
            ident: "speed",
            defaults: ["kt"],
            conv: {
                "km/h": {
                    conversion: function(e) {
                        return 3.6 * e
                    },
                    precision: 0
                },
                mph: {
                    conversion: function(e) {
                        return 2.236936 * e
                    },
                    precision: 0
                },
                kt: {
                    conversion: function(e) {
                        return 1.943844 * e
                    },
                    precision: 0
                },
                "m/s": {
                    conversion: l,
                    precision: 0
                }
            },
            description: ["km/h", "mph", "kt", "m/s"]
        }),
        M = new c({
            ident: "waves",
            defaults: ["m", "ft"],
            conv: {
                m: {
                    conversion: l,
                    precision: 1
                },
                ft: {
                    conversion: function(e) {
                        return 3.28 * e
                    },
                    precision: 0
                }
            },
            description: ["m", "ft"],
            lines: [
                [.5, .5, 1.6],
                [1, 1, 3.3],
                [1.5, 1.5, 5],
                [2, 2, 6.6],
                [6, 6, 20],
                [9, 9, 30]
            ]
        }),
        O = new c({
            ident: "currents",
            separator: " ",
            defaults: ["kt"],
            conv: {
                kt: {
                    conversion: function(e) {
                        return 1.943844 * e
                    },
                    precision: 1
                },
                "m/s": {
                    conversion: l,
                    precision: 2
                },
                "km/h": {
                    conversion: function(e) {
                        return 3.6 * e
                    },
                    precision: 1
                },
                mph: {
                    conversion: function(e) {
                        return 2.236936 * e
                    },
                    precision: 1
                }
            },
            description: ["kt", "m/s", "mph", "km/h"],
            lines: [
                [0, 0, 0, 0, 0],
                [.2, .4, .2, .4, .7],
                [.4, .8, .4, .9, 1.4],
                [.8, 1.6, .8, 1.8, 2.9],
                [1, 2, 1, 2.2, 3.6],
                [1.6, 3.2, 1.6, 3.6, 5.8]
            ]
        }),
        R = new c({
            ident: "visibility",
            defaults: ["km", "sm"],
            conv: {
                rules: {
                    conversion: function(e) {
                        return e / 1e3
                    },
                    label: "km",
                    precision: 1
                },
                km: {
                    conversion: function(e) {
                        return e / 1e3
                    },
                    precision: 1
                },
                sm: {
                    conversion: function(e) {
                        return 62137e-8 * e
                    },
                    precision: 1
                }
            },
            description: ["rules", "km", "sm"],
            lines: [
                [0, "LIFR", ".8", ".5"],
                [3e3, "IFR", 2.7, 1.5],
                [7e3, "MVFR", 6, 4],
                [16e3, "VFR", 16, 10]
            ]
        }),
        x = new c({
            ident: "visibilityNoRules",
            defaults: ["km", "sm"],
            conv: {
                km: {
                    conversion: function(e) {
                        return e / 1e3
                    },
                    precision: 1
                },
                sm: {
                    conversion: function(e) {
                        return 62137e-8 * e
                    },
                    precision: 1
                }
            },
            description: ["km", "sm"],
            lines: [
                [0, ".8", ".5"],
                [3e3, 2.7, 1.5],
                [7e3, 6, 4],
                [16e3, 16, 10]
            ]
        }),
        D = new c({
            ident: "so2",
            defaults: ["Âµg/mÂ³"],
            conv: {
                "Âµg/mÂ³": {
                    conversion: l,
                    precision: 2
                }
            },
            description: ["Âµg/mÂ³"],
            lines: [
                [0, 0],
                [1, 1],
                [5, 5],
                [10, 10],
                [80, 80]
            ]
        }),
        I = new c({
            ident: "dust",
            defaults: ["Âµg/mÂ³"],
            conv: {
                "Âµg/mÂ³": {
                    conversion: l,
                    precision: 1
                }
            },
            description: ["Âµg/mÂ³"],
            lines: [
                [0, 0],
                [50, 50],
                [100, 100],
                [500, 500],
                [800, 800]
            ]
        }),
        N = new c({
            ident: "cosc",
            defaults: ["ppbv"],
            conv: {
                ppbv: {
                    conversion: l,
                    precision: 0
                }
            },
            description: ["ppbv"],
            lines: [
                [0, 0],
                [50, 50],
                [100, 100],
                [500, 500],
                [1200, 1200]
            ]
        }),
        W = function(e) {
            return Math.pow(.005 * Math.pow(10, .1 * e), .625)
        },
        k = new c({
            ident: "radar",
            defaults: ["dBZ", "mm/h", "in/h"],
            conv: {
                dBZ: {
                    conversion: l,
                    precision: 0
                },
                "mm/h": {
                    conversion: function(e) {
                        return W(e)
                    },
                    precision: 1
                },
                "in/h": {
                    conversion: function(e) {
                        return W(e) / 25.4
                    },
                    precision: 2
                }
            },
            description: ["dBZ", "mm/h", "in/h"],
            lines: [
                [0, 0, 0, 0],
                [20, 20, .6, .02],
                [30, 30, 3, .1],
                [40, 40, 12, .5],
                [50, 50, 50, 2],
                [60, 60, 200, 8]
            ]
        }),
        U = {
            conversion: function(e) {
                return e
            },
            precision: 0,
            na: ""
        },
        F = new a({
            ident: "satellite",
            defaults: ["K", "Â°C", "Â°F"],
            conv: {
                K: U,
                "Â°C": U,
                "Â°F": U
            },
            description: ["K", "Â°C", "Â°F"],
            lines: []
        }),
        H = new r({
            ident: "ptype",
            defaults: ["ptype"],
            conv: {
                ptype: {
                    conversion: l,
                    precision: 0,
                    label: ""
                }
            }
        }),
        G = new c({
            ident: "gh",
            defaults: ["m"],
            conv: {
                m: {
                    conversion: l,
                    precision: 0
                }
            }
        }),
        z = new c({
            ident: "fog",
            defaults: ["type"],
            conv: {
                type: {
                    conversion: l,
                    precision: 0
                }
            },
            description: ["type"],
            lines: [
                [1, "Fog"],
                [2, "Fog & rime"]
            ]
        }),
        B = new c({
            ident: "lightDensity",
            defaults: ["l/kmÂ²"],
            conv: {
                "l/kmÂ²": {
                    conversion: l,
                    precision: 2
                }
            },
            description: ["l/kmÂ²"],
            lines: [
                [0, 0],
                [.025, ".025"],
                [.1, ".1"],
                [1, 1],
                [10, 10],
                [20, 20]
            ]
        }),
        j = new c({
            ident: "efiWind",
            defaults: ["%"],
            conv: d,
            description: ["%"],
            lines: [
                [-1, "unusually"],
                [-.75, "calm"],
                [.25, ""],
                [.75, "extreme"],
                [1, "wind"]
            ]
        }),
        V = new c({
            ident: "efiTemp",
            defaults: ["%"],
            conv: d,
            description: ["%"],
            lines: [
                [-1, "extreme"],
                [-.75, "cold"],
                [-.25, ""],
                [.25, ""],
                [.75, "extreme"],
                [1, "warm"]
            ]
        }),
        Y = new c({
            ident: "efiRain",
            defaults: ["%"],
            conv: d,
            description: ["%"],
            lines: [
                [-1, "very dry"],
                [0, ""],
                [.1, ""],
                [.75, "extreme"],
                [1, "precip."]
            ]
        }),
        q = new c({
            ident: "fires",
            defaults: ["W/mÂ²"],
            conv: {
                "W/mÂ²": {
                    conversion: l,
                    precision: 3
                }
            },
            description: ["W/mÂ²"],
            lines: [
                [0, "0"],
                [.05, ".05"],
                [.5, ".5"],
                [1, "1"]
            ]
        }),
        X = new s({
            ident: "awd_0_100",
            lines: [
                [-100, -100, -3.94],
                [-60, -60, -2.36],
                [-30, -30, 1.18],
                [0, 0, 0],
                [30, 30, 1.18],
                [60, 60, 2.36],
                [100, 100, 3.94]
            ]
        }),
        Q = new s({
            ident: "awd_0_40",
            lines: [
                [-60, -60, -2.36],
                [-30, -30, 1.18],
                [0, 0, 0],
                [30, 30, 1.18],
                [60, 60, 2.36]
            ]
        }),
        Z = {
            temp: u,
            wind: h,
            rh: p,
            clouds: f,
            pressure: m,
            rain: v,
            snow: g,
            cape: w,
            gtco3: y,
            aod550: b,
            pm2p5: T,
            no2: S,
            tcso2: _,
            go3: E,
            altitude: A,
            elevation: P,
            distance: L,
            speed: C,
            waves: M,
            currents: O,
            visibility: R,
            visibilityNoRules: x,
            so2: D,
            dust: I,
            cosc: N,
            radar: k,
            satellite: F,
            ptype: H,
            gh: G,
            fog: z,
            lightDensity: B,
            efiWind: j,
            efiTemp: V,
            efiRain: Y,
            fires: q,
            awp: new c({
                ident: "awp",
                defaults: ["awp"],
                conv: {
                    awp: {
                        conversion: l,
                        precision: 0
                    }
                },
                labels: ["INTERSUCHO_AWP_0", "INTERSUCHO_AWP_1", "INTERSUCHO_AWP_2", "INTERSUCHO_AWP_3", "INTERSUCHO_AWP_4", "INTERSUCHO_AWP_5", "INTERSUCHO_AWP_6"],
                renderLegend: function(e, t) {
                    var n;
                    e.getColor(), t.style.background = "", t.dataset.overlay = "awp", t.innerHTML = (null !== (n = this.labels.map((function(t, n) {
                        return n > 0 ? '<span style="text-align:center;background:' + e.colorDark(n - 1, 50) + ';">' + o[t] + "</span>" : ""
                    }))) && void 0 !== n ? n : []).join("")
                }
            }),
            awd_0_40: Q,
            awd_0_100: X
        };
    e.default = Z
})), W.define("layers", ["colors", "metrics", "Layer", "legends"], (function(e, t, n, i, o) {
    var r = i.WaveLayer,
        a = i.Layer,
        s = function(e) {
            return Math.max(0, Math.pow(2, e) - .001)
        },
        l = function(e) {
            return function(t) {
                return Math.pow(2, t) - e
            }
        },
        c = new a({
            ident: "capAlerts",
            renderer: "capAlerts"
        }),
        d = new a({
            ident: "pressureIsolines",
            renderer: "isolines",
            levels: ["surface"]
        }),
        u = new a({
            ident: "ghIsolines",
            renderer: "isolines",
            levels: ["975h", "950h", "925h", "900h", "850h", "800h", "700h", "600h", "500h", "400h", "300h", "250h", "200h", "150h"]
        }),
        h = new a({
            ident: "tempIsolines",
            renderer: "isolines",
            levels: ["surface", "950h", "925h", "900h", "850h", "800h", "700h", "600h", "500h", "400h", "300h", "250h", "200h", "150h"]
        }),
        p = new a({
            ident: "deg0Isolines",
            renderer: "isolines",
            levels: ["surface"]
        }),
        f = new a({
            ident: "windParticles",
            renderer: "particles",
            filename: "wind",
            fileSuffix: "jpg",
            renderParams: {
                particlesIdent: "wind"
            }
        }),
        m = new a({
            ident: "ecmwfWindParticles",
            renderer: "particles",
            product: "ecmwf",
            levels: ["surface"],
            filename: "wind",
            fileSuffix: "jpg",
            renderParams: {
                particlesIdent: "wind"
            }
        }),
        v = new a({
            ident: "ecmwfWindParticles150h",
            renderer: "particles",
            product: "ecmwf",
            levels: ["150h"],
            filename: "wind",
            fileSuffix: "jpg",
            renderParams: {
                particlesIdent: "wind"
            }
        }),
        g = new a({
            ident: "ecmwfWindParticles500h",
            renderer: "particles",
            product: "ecmwf",
            levels: ["500h"],
            filename: "wind",
            fileSuffix: "jpg",
            renderParams: {
                particlesIdent: "wind"
            }
        }),
        w = new a({
            ident: "ecmwfWindParticles600h",
            renderer: "particles",
            product: "ecmwf",
            levels: ["600h"],
            filename: "wind",
            fileSuffix: "jpg",
            renderParams: {
                particlesIdent: "wind"
            }
        }),
        y = new a({
            ident: "waveParticles",
            renderer: "particles",
            PNGtransparency: !0,
            renderParams: {
                particlesIdent: "waves"
            }
        }),
        b = new a({
            ident: "currentParticles",
            renderer: "particles",
            filename: "seacurrents",
            product: "cmems",
            renderParams: {
                particlesIdent: "currents"
            }
        }),
        T = new a({
            ident: "currentsTideParticles",
            renderer: "particles",
            filename: "seacurrents_tide",
            renderParams: {
                particlesIdent: "currents"
            }
        }),
        S = new a({
            ident: "wind",
            renderParams: {
                renderFrom: "RG"
            },
            c: t.wind,
            m: n.wind
        }),
        _ = new a({
            ident: "temp",
            c: t.temp,
            m: n.temp
        }),
        E = new a({
            ident: "dewpoint",
            c: t.temp,
            m: n.temp
        }),
        A = new a({
            ident: "gust",
            c: t.wind,
            m: n.wind
        }),
        P = new a({
            ident: "gustAccu",
            isAccu: !0,
            filename: "gust",
            fileSuffix: "jpg",
            JPGtransparency: !0,
            c: t.wind,
            m: n.wind,
            query: "acc=maxip"
        }),
        L = new a({
            ident: "rh",
            c: t.rh,
            m: n.rh
        }),
        C = new a({
            ident: "pressure",
            fileSuffix: "png",
            PNGtransparency: !0,
            c: t.pressure,
            m: n.pressure
        }),
        M = new a({
            ident: "ccl",
            renderer: "tileLayerPatternator",
            fileSuffix: "png",
            PNGtransparency: !0,
            c: t.cclAltitude,
            m: n.altitude,
            l: o.ccl,
            renderParams: {
                pattern: "cclPattern",
                interpolateNearestG: !0
            },
            transformG: function(e) {
                return Math.round(4 * e) / 4
            }
        }),
        O = new a({
            ident: "rain",
            renderer: "tileLayerPatternator",
            filename: "rainlogptype2",
            fileSuffix: "png",
            PNGtransparency: !0,
            c: t.rain,
            m: n.rain,
            renderParams: {
                pattern: "rainPattern",
                interpolateNearestG: !0
            },
            transformR: s,
            transformG: function(e) {
                return Math.round(4 * e) / 4
            },
            wTransformR: "rainLog"
        }),
        R = new a({
            ident: "ptype",
            renderer: "tileLayerPatternator",
            filename: "rainlogptype",
            fileSuffix: "png",
            PNGtransparency: !0,
            c: t.justGray,
            m: n.ptype,
            renderParams: {
                pattern: "ptypePattern",
                interpolateNearestG: !0
            },
            transformR: s,
            transformG: Math.round,
            wTransformR: "rainLog"
        }),
        x = new a({
            ident: "thunder",
            filename: "lightdens",
            c: t.lightDensity,
            m: n.lightDensity,
            transformR: s,
            wTransformR: "rainLog"
        }),
        D = new a({
            ident: "clouds",
            filename: "cloudsrain",
            renderParams: {
                renderFrom: "RG",
                isMultiColor: !0
            },
            c: t.clouds,
            m: n.rain,
            cm: n.clouds,
            transformG: function(e) {
                return e < 10 ? e : 10 * (e - 10) + 10
            },
            getColor2: function() {
                return t.rainClouds.getColor()
            },
            getAmountByColor: function(e, t) {
                return t < .3 ? 0 : t < 3 ? 1 : t < 6 ? 2 : 3
            }
        }),
        I = new a({
            ident: "lclouds",
            c: t.lclouds,
            m: n.clouds
        }),
        N = new a({
            ident: "mclouds",
            c: t.mclouds,
            m: n.clouds
        }),
        W = new a({
            ident: "hclouds",
            c: t.hclouds,
            m: n.clouds
        }),
        k = new a({
            ident: "cape",
            c: t.cape,
            m: n.cape
        }),
        U = new a({
            ident: "cbase",
            fileSuffix: "png",
            PNGtransparency: !0,
            c: t.cbase,
            m: n.altitude,
            l: o.cbase
        }),
        F = new a({
            ident: "fog",
            filename: "fogtype",
            fileSuffix: "png",
            c: t.fog,
            m: n.fog,
            PNGtransparency: !0
        }),
        H = new a({
            ident: "snowAccu",
            isAccu: !0,
            filename: "snowaccumulationlog",
            fileSuffix: "jpg",
            JPGtransparency: !0,
            c: t.snow,
            m: n.snow,
            transformR: s,
            wTransformR: "rainLog",
            renderParams: {
                interpolate: "interpolateOverlay"
            }
        }),
        G = new a({
            ident: "rainAccu",
            isAccu: !0,
            filename: "rainaccumulationlog",
            fileSuffix: "jpg",
            JPGtransparency: !0,
            transformR: s,
            wTransformR: "rainLog",
            renderParams: {
                interpolate: "interpolateOverlay"
            },
            c: t.rainAccu,
            m: n.rain,
            l: o.rainAccu
        }),
        z = new r({
            ident: "waves"
        }),
        B = new r({
            ident: "wwaves"
        }),
        j = new r({
            ident: "swell1"
        }),
        V = {
            capAlerts: c,
            pressureIsolines: d,
            ghIsolines: u,
            tempIsolines: h,
            deg0Isolines: p,
            windParticles: f,
            ecmwfWindParticles: m,
            ecmwfWindParticles150h: v,
            ecmwfWindParticles500h: g,
            ecmwfWindParticles600h: w,
            waveParticles: y,
            currentParticles: b,
            currentsTideParticles: T,
            wind: S,
            temp: _,
            dewpoint: E,
            gust: A,
            gustAccu: P,
            rh: L,
            pressure: C,
            ccl: M,
            rain: O,
            ptype: R,
            thunder: x,
            clouds: D,
            lclouds: I,
            mclouds: N,
            hclouds: W,
            cape: k,
            cbase: U,
            fog: F,
            snowAccu: H,
            rainAccu: G,
            waves: z,
            wwaves: B,
            swell1: j,
            swell2: new r({
                ident: "swell2"
            }),
            swell3: new r({
                ident: "swell3"
            }),
            swell: j,
            currents: new a({
                ident: "currents",
                filename: "seacurrents",
                renderParams: {
                    renderFrom: "RG",
                    sea: !0
                },
                c: t.currents,
                m: n.currents
            }),
            currentsTide: new a({
                ident: "currentsTide",
                filename: "seacurrents_tide",
                renderParams: {
                    renderFrom: "RG",
                    sea: !0
                },
                c: t.currentsTide,
                m: n.currents
            }),
            sst: new a({
                ident: "sst",
                PNGtransparency: !0,
                renderParams: {
                    sea: !0
                },
                c: t.temp,
                m: n.temp,
                l: o.sst,
                pathGenerator: "{server}/im/v3.0/analysis/ecmwf-hres/{refTime}/{refTime}/wm_grid_257/<z>/<x>/<y>/{filename}-{level}.{fileSuffix}"
            }),
            visibility: new a({
                ident: "visibility",
                c: t.visibility,
                m: n.visibility
            }),
            snowcover: new a({
                ident: "snowcover",
                filename: "snowcoverlog",
                transformR: s,
                wTransformR: "rainLog",
                c: t.snow,
                m: n.snow
            }),
            cloudtop: new a({
                ident: "cloudtop",
                hasParticles: !0,
                levels: ["surface"],
                c: t.levels,
                m: n.altitude,
                l: o.cloudtop
            }),
            deg0: new a({
                ident: "deg0",
                levels: ["surface"],
                c: t.deg0,
                m: n.altitude
            }),
            cosc: new a({
                ident: "cosc",
                filename: "chem_cosc",
                c: t.cosc,
                m: n.cosc,
                transformR: l(1),
                wTransformR: 1
            }),
            dustsm: new a({
                ident: "dustsm",
                filename: "chem_dustsm",
                hasParticles: !1,
                c: t.dust,
                m: n.dust,
                transformR: l(.1),
                wTransformR: .1
            }),
            radar: new a({
                ident: "radar",
                renderer: "radar",
                c: t.radar,
                m: n.radar
            }),
            satellite: new a({
                ident: "satellite",
                renderer: "satellite",
                c: t.satellite,
                m: n.satellite
            }),
            gtco3: new a({
                ident: "gtco3",
                c: t.gtco3,
                m: n.gtco3
            }),
            pm2p5: new a({
                ident: "pm2p5",
                c: t.pm2p5,
                m: n.pm2p5,
                transformR: l(.001),
                wTransformR: .001
            }),
            no2: new a({
                ident: "no2",
                c: t.no2,
                m: n.no2,
                transformR: l(.001),
                wTransformR: .001
            }),
            aod550: new a({
                ident: "aod550",
                c: t.aod550,
                m: n.aod550,
                transformR: l(.001),
                wTransformR: .001
            }),
            tcso2: new a({
                ident: "tcso2",
                c: t.tcso2,
                m: n.tcso2,
                transformR: l(.001),
                wTransformR: .001
            }),
            go3: new a({
                ident: "go3",
                c: t.go3,
                m: n.go3,
                transformR: l(.001),
                wTransformR: .001
            }),
            gh: new a({
                ident: "gh",
                m: n.gh
            }),
            map: new a({
                ident: "map",
                renderer: "map"
            }),
            efiWind: new a({
                ident: "efiWind",
                filename: "wsi",
                renderer: "daySwitcher",
                c: t.efiWind,
                m: n.efiWind
            }),
            efiTemp: new a({
                ident: "efiTemp",
                filename: "ti",
                renderer: "daySwitcher",
                c: t.efiTemp,
                m: n.efiTemp
            }),
            efiRain: new a({
                ident: "efiRain",
                filename: "tpi",
                renderer: "daySwitcher",
                c: t.efiRain,
                m: n.efiRain
            }),
            fires: new a({
                ident: "fires",
                filename: "frpfire",
                c: t.fires,
                m: n.fires,
                transformR: l(1e-4),
                wTransformR: 1e-4
            }),
            awd_0_40: new a({
                ident: "awd_0_40",
                renderer: "daySwitcher",
                renderParams: {
                    landOnly: !0
                },
                c: t.awd_0_40,
                m: n.awd_0_40
            }),
            awd_0_100: new a({
                ident: "awd_0_100",
                renderer: "daySwitcher",
                renderParams: {
                    landOnly: !0
                },
                c: t.awd_0_100,
                m: n.awd_0_100
            }),
            awp_0_40: new a({
                ident: "awp_0_40",
                renderer: "daySwitcher",
                renderParams: {
                    landOnly: !0
                },
                c: t.awp_0_40,
                m: n.awp
            }),
            awp_0_100: new a({
                ident: "awp_0_100",
                renderer: "daySwitcher",
                renderParams: {
                    landOnly: !0
                },
                c: t.awp_0_100,
                m: n.awp
            }),
            awr_0_40: new a({
                ident: "awr_0_40",
                renderer: "daySwitcher",
                renderParams: {
                    landOnly: !0
                },
                c: t.awr_0_40,
                m: n.rh
            }),
            awr_0_100: new a({
                ident: "awr_0_100",
                renderer: "daySwitcher",
                renderParams: {
                    landOnly: !0
                },
                c: t.awr_0_100,
                m: n.rh
            })
        };
    e.default = V
})), W.define("models", ["store", "broadcast", "utils", "rootScope", "products", "layers", "overlays"], (function(e, t, n, i, o, r, a, s) {
    var l = (0, i.$)('meta[name="model"]');
    l && l.content && o.globalProducts.includes(l.content) && "ecmwf" !== l.content && t.set("product", l.content);
    var c = {},
        d = {},
        u = Object.keys(r);
    Object.keys(a).forEach((function(e) {
        for (var t = [], n = 0; n < u.length; n++) r[u[n]].overlays.includes(e) && t.push(u[n]);
        c[e] = t
    })), Object.keys(s).forEach((function(e) {
        for (var t = [], n = 0; n < u.length; n++) r[u[n]].overlays.includes(e) && t.push(u[n]);
        d[e] = t
    }));
    var h = function(e) {
            return e.includes("iconD2") && (e = e.filter((function(e) {
                return "icon" !== e && "iconEu" !== e
            }))), e.includes("iconEu") && (e = e.filter((function(e) {
                return "icon" !== e
            }))), e.includes("iconEuWaves") && (e = e.filter((function(e) {
                return "iconWaves" !== e
            }))), e
        },
        p = function(e, t) {
            for (var n = t ? o.localPointProducts : o.localProducts, i = [], a = 0; a < n.length; a++) {
                var s = n[a],
                    l = r[s];
                l.pointIsInBounds.call(l, e) && i.push(s)
            }
            return i
        },
        f = function() {
            var e = t.get("mapCoords"),
                n = p(e).concat(o.globalProducts);
            if (t.set("visibleProducts", n) && !n.includes(t.get("product"))) {
                var i = t.get("prefferedProduct"),
                    a = t.get("overlay");
                if (r[i].overlays.includes(a)) t.set("product", i);
                else {
                    var s = n.filter((function(e) {
                        return r[e].overlays.includes(a)
                    }));
                    s.length && t.set("product", s[0])
                }
            }
        };
    n.once("paramsChanged", (function() {
        f(), t.on("mapCoords", f)
    }));
    e.betterProducts = p, e.dedupeIcon = h, e.getIconModel = function(e, t) {
        return "icon" === e && t.includes("iconEu") ? "iconEu" : "iconWaves" === e && t.includes("iconEuWaves") ? "iconEuWaves" : "iconEuWaves" === e && t.includes("iconWaves") ? "iconWaves" : "iconEu" === e && t.includes("icon") ? "icon" : null
    }, e.getPointProducts = function(e) {
        var t = p(e, !0).filter((function(e) {
            return !/Waves/.test(e)
        }));
        return h(o.globalPointProducts.concat(t))
    }, e.getProduct = function(e, n) {
        var i = c[e];
        (i = i.filter((function(e) {
            return o.products.concat(o.seaProducts).includes(e)
        }))).length || console.error('No products available for overlay "' + e + '" using your API key. Original products: ' + c[e].join(", "));
        var a = t.get("prefferedProduct");
        if (2 === i.length && i.includes("cams")) {
            var s = t.get("mapCoords");
            return r.camsEu.pointIsInBounds(s) ? "camsEu" : "cams"
        }
        if (i.includes(n)) return n;
        if (i.includes("iconD2") && "iconEu" === a) return "iconD2";
        if (i.includes("iconEu") && "icon" === a) return "iconEu";
        if (i.includes(a)) return a;
        if (i.includes("ecmwfWaves") && "ecmwf" === a) return "ecmwfWaves";
        if (i.includes("gfsWaves") && "gfs" === a) return "gfsWaves";
        if (i.includes("iconEuWaves") && "icon" === a) return "iconEuWaves";
        if (i.includes("iconWaves") && "icon" === a) return "iconWaves";
        if (i.length > 1) {
            var l = t.get("mapCoords"),
                d = i.filter((function(e) {
                    return r[e].pointIsInBounds.call(r[e], l)
                }))[0];
            if (d) return d
        }
        return i[0]
    }, e.layer2product = c, e.overlay2product = d
})), W.define("products", ["Product", "Product1h", "StaticProduct", "NamProducts", "HrrrProducts", "IconProducts", "Calendar", "utils", "store", "rootScope", "http"], (function(e, t, n, i, o, r, a, s, l, c, d, u) {
    var h = u.get,
        p = d.isMobile,
        f = l.bound,
        m = (l.$, s.Calendar),
        v = '<a href="https://atmosphere.copernicus.eu/" target="_blank"><img style="max-width:150px;height:auto;" src="img/providers/copernicus-white.svg" /></a>',
        g = n.instance({
            ident: "ecmwf",
            directory: "forecast/ecmwf-hres",
            modelName: "ECMWF",
            modelResolution: 9,
            provider: "ECMWF",
            interval: 720,
            intervalPremium: 360,
            maxTileZoom: 3,
            dataQuality: "normal",
            betterDataQuality: ["rain", "clouds", "lclouds", "mclouds", "hclouds", "cbase", "snowAccu", "rainAccu", "snowcover", "ptype", "sst"],
            levels: ["surface", "100m", "950h", "925h", "900h", "850h", "800h", "700h", "600h", "500h", "400h", "300h", "250h", "200h", "150h"],
            overlays: ["snowcover", "wind", "temp", "pressure", "clouds", "lclouds", "mclouds", "hclouds", "rh", "gust", "cbase", "cape", "dewpoint", "rain", "visibility", "deg0", "cloudtop", "thunder", "snowAccu", "rainAccu", "ptype", "sst", "gustAccu", "ccl"],
            acTimes: ["next12h", "next24h", "next3d", "next5d", "next10d"],
            isolines: ["pressure", "gh", "temp", "deg0"],
            _init: function() {
                var e = this;
                t._init.call(this), c.on("subscription", (function() {
                    e.expire(), e.open()
                })), this.createBackupMinifest()
            },
            createBackupMinifest: function() {
                this.minifest = {
                    v: "2.0",
                    note: "This is automatically generated fallback minifest",
                    info: "XXXXXXX",
                    ref: (new Date).toISOString().replace(/T.*$/, "T00:34:56Z"),
                    update: (new Date).toISOString(),
                    dst: [
                        [3, 3, 144],
                        [6, 150, 240]
                    ]
                }, this.calendar = new m({
                    numOfHours: this.forecastSize,
                    minifestFile: this.minifest
                })
            }
        }),
        w = t.instance({
            ident: "cams",
            provider: "Copernicus",
            interval: 720,
            PNGtransparency: !0,
            modelName: "CAMS",
            modelResolution: 40,
            fileSuffix: "png",
            directory: "forecast/cams-global",
            dataQuality: "normal",
            levels: ["surface"],
            overlays: ["gtco3", "aod550", "pm2p5", "no2", "tcso2", "go3"],
            labelsTemp: !1,
            requiresInfoJson: !0,
            logo: v
        }),
        y = t.instance({
            ident: "camsEu",
            provider: "Copernicus",
            interval: 1440,
            PNGtransparency: !0,
            modelName: "CAMS EU",
            modelResolution: 10,
            fileSuffix: "png",
            directory: "forecast/cams-eu",
            bounds: [
                [
                    [70, -25],
                    [70, 45],
                    [30, 45],
                    [30, -25]
                ]
            ],
            maxTileZoom: 3,
            dataQuality: "high",
            levels: ["surface"],
            overlays: ["pm2p5", "no2", "go3"],
            labelsTemp: !1,
            requiresInfoJson: !0,
            logo: v
        }),
        b = t.instance({
            ident: "camsGfas",
            provider: "Copernicus",
            interval: 1440,
            PNGtransparency: !0,
            modelName: "CAMS",
            modelResolution: 40,
            fileSuffix: "png",
            directory: "analysis/cams-gfas",
            dataQuality: "normal",
            levels: ["surface"],
            overlays: ["fires"],
            labelsTemp: !1,
            requiresInfoJson: !0,
            logo: v
        }),
        T = t.instance({
            ident: "cmems",
            JPGtransparency: !0,
            requiresInfoJson: !0,
            maxTileZoom: 3,
            modelName: "CMEMS",
            modelResolution: 9,
            provider: "Copernicus",
            directory: "forecast/cmems",
            labelsTemp: !1,
            interval: 1440,
            dataQuality: "normal",
            overlays: ["currents", "currentsTide"],
            levels: ["surface"],
            logo: v
        }),
        S = t.instance({
            ident: "gfs",
            prefferedProduct: "gfs",
            provider: "NOAA",
            interval: 360,
            modelName: "GFS",
            modelResolution: 22,
            directory: "forecast/gfs",
            maxTileZoom: 3,
            dataQuality: "low",
            betterDataQuality: ["rain", "clouds", "lclouds", "mclouds", "hclouds"],
            levels: ["surface", "100m", "975h", "950h", "925h", "900h", "850h", "800h", "700h", "600h", "500h", "400h", "300h", "250h", "200h", "150h"],
            overlays: ["wind", "temp", "pressure", "clouds", "rh", "gust", "dewpoint", "rain", "lclouds", "mclouds", "hclouds", "snowAccu", "rainAccu", "ptype", "gustAccu", "cape", "ccl"],
            acTimes: ["next12h", "next24h", "next3d", "next5d", "next10d"],
            isolines: ["pressure", "gh", "temp"]
        }),
        _ = a.instance({
            ident: "iconEu",
            modelName: "ICON-EU",
            modelResolution: 7,
            JPGtransparency: !0,
            dataQuality: "high",
            directory: "forecast/icon-eu",
            bounds: [
                [
                    [70, -23],
                    [70, 44],
                    [30, 44],
                    [30, -23]
                ]
            ]
        }),
        E = a.instance({
            ident: "icon",
            modelName: "ICON",
            modelResolution: 13,
            dataQuality: "normal",
            directory: "forecast/icon-global"
        }),
        A = a.instance({
            ident: "iconD2",
            modelName: "ICON-D2",
            modelResolution: 2.2,
            JPGtransparency: !0,
            dataQuality: "extreme",
            directory: "forecast/icon-d2",
            prefferedProduct: "iconEu",
            bounds: [
                [
                    [57.237, -3.724],
                    [57.722, 1.088],
                    [57.973, 6.218],
                    [57.962, 10.261],
                    [57.669, 14.952],
                    [57.651, 20.314],
                    [43.485, 17.501],
                    [43.692, 15.26],
                    [43.858, 10.547],
                    [43.604, 5.01],
                    [43.676, .231]
                ]
            ],
            acTimes: ["next12h", "next24h", "next2d"]
        }),
        P = n.instance({
            ident: "iconWaves",
            modelName: "ICON",
            modelResolution: 13,
            provider: "DWD",
            interval: 300,
            prefferedProduct: "icon",
            labelsTemp: !1,
            directory: "forecast/icon-gwam",
            fileSuffix: "png",
            dataQuality: "low",
            overlays: ["waves", "swell1", "wwaves"],
            levels: ["surface"]
        }),
        L = n.instance({
            ident: "iconEuWaves",
            modelName: "ICON-EU",
            modelResolution: 7,
            bounds: [
                [
                    [66, -10.525],
                    [66, 42.025],
                    [29.95, 42.025],
                    [29.95, -10.525]
                ]
            ],
            provider: "DWD",
            interval: 300,
            prefferedProduct: "icon",
            labelsTemp: !1,
            directory: "forecast/icon-ewam",
            fileSuffix: "png",
            dataQuality: "normal",
            overlays: ["waves", "swell1", "wwaves"],
            levels: ["surface"]
        }),
        C = n.instance({
            ident: "bomAccess",
            provider: "BOM",
            interval: 360,
            modelName: "ACCESS",
            modelResolution: 12,
            JPGtransparency: !0,
            dataQuality: "normal",
            directory: "forecast/bom-access",
            forecastSize: 240,
            bounds: [
                [
                    [-65, 65],
                    [-65, 180],
                    [17, 180],
                    [17, 65]
                ],
                [
                    [-65, -180],
                    [-65, -175],
                    [17, -175],
                    [17, -180]
                ]
            ],
            levels: ["surface", "950h", "925h", "900h", "850h", "800h", "700h", "600h", "500h", "400h", "300h", "250h", "200h", "150h"],
            overlays: ["wind", "temp", "pressure", "clouds", "lclouds", "mclouds", "hclouds", "rh", "gust", "dewpoint", "rain", "snowAccu", "rainAccu", "ptype", "gustAccu", "ccl"],
            acTimes: ["next12h", "next24h", "next3d", "next5d", "next10d"],
            isolines: ["pressure", "gh", "temp"]
        }),
        M = t.instance({
            ident: "arome",
            provider: "MF",
            interval: 360,
            modelName: "AROME",
            modelResolution: 1.3,
            JPGtransparency: !0,
            animation: !0,
            dataQuality: "ultra",
            betterDataQuality: [],
            directory: "forecast/arome",
            labelsTemp: !1,
            forecastSize: 72,
            bounds: [
                [
                    [55, -10],
                    [55, 15],
                    [38, 15],
                    [38, -10]
                ]
            ],
            levels: ["surface"],
            overlays: ["wind", "temp", "clouds", "lclouds", "mclouds", "hclouds", "rh", "gust", "cape", "dewpoint", "rain", "ptype"]
        }),
        O = t.instance({
            ident: "nems",
            modelName: "NEMS",
            modelResolution: 4,
            provider: "Meteoblue.com",
            interval: 720,
            JPGtransparency: !0,
            animation: !0,
            dataQuality: "high",
            betterDataQuality: ["rain", "clouds"],
            directory: "forecast/mbeurope",
            labelsTemp: !1,
            forecastSize: 72,
            bounds: [
                [
                    [57, -19],
                    [57, 33],
                    [33, 33],
                    [33, -19]
                ]
            ],
            levels: ["surface", "975h", "950h", "925h", "900h", "850h"],
            overlays: ["wind", "temp", "clouds", "rh", "gust", "dewpoint", "rain"],
            logo: '<a class="mobilehide" href="https://www.meteoblue.com/" target="_blank">NEMS4 model by <img style="max-width:90px;height:auto;" src="img/logo-mb.svg" /></a>'
        }),
        R = i.instance({
            ident: "mblue",
            modelName: p ? "MBLUE" : "METEOBLUE"
        }),
        x = o.instance({
            ident: "namConus",
            modelResolution: 5,
            directory: "forecast/nam-conus",
            bounds: [
                [
                    [47.7, -133],
                    [51.27, -116.89],
                    [52.57, -98.94],
                    [51.43, -79.14],
                    [47.7, -61.13],
                    [21.27, -72.46],
                    [24.43, -97.66],
                    [21.33, -122.67]
                ]
            ]
        }),
        D = o.instance({
            ident: "namHawaii",
            modelResolution: 3,
            directory: "forecast/nam-hawaii",
            bounds: [
                [
                    [22.99, -161.39],
                    [22.99, -154],
                    [18.23, -154],
                    [18.23, -161.39]
                ]
            ]
        }),
        I = o.instance({
            ident: "namAlaska",
            modelResolution: 6,
            directory: "forecast/nam-alaska",
            bounds: [
                [
                    [71.3, 171.8],
                    [57.7, 160.9],
                    [51, 172],
                    [47.8, 180],
                    [73, 180]
                ],
                [
                    [47.8, -180],
                    [43.2, -172.1],
                    [46.1, -157],
                    [45.7, -142.4],
                    [49.7, -128.6],
                    [51.5, -116.8],
                    [53.2, -114.9],
                    [66.6, -119],
                    [73.6, -124],
                    [75.3, -153.4],
                    [73, -180]
                ]
            ]
        }),
        N = r.instance({
            ident: "hrrrConus",
            modelName: "HRRR",
            modelResolution: 3,
            JPGtransparency: !0,
            dataQuality: "extreme",
            directory: "forecast/hrrr-conus",
            intervalPremium: 60,
            bounds: [
                [
                    [50.2, -123.3],
                    [51.6, -114.9],
                    [52.5, -97.2],
                    [52.1, -85.8],
                    [50.5, -73.1],
                    [47.8, -60.7],
                    [42.1, -63.8],
                    [30.9, -68.7],
                    [21, -72],
                    [22.5, -78.9],
                    [23.8, -89],
                    [24.2, -97.4],
                    [23.9, -105.2],
                    [22.7, -115.1],
                    [20.9, -122.5],
                    [29.7, -125.4],
                    [43.2, -131.3],
                    [47.8, -133.9]
                ]
            ]
        }),
        W = r.instance({
            ident: "hrrrAlaska",
            modelName: "HRRR",
            modelResolution: 3,
            JPGtransparency: !0,
            dataQuality: "extreme",
            directory: "forecast/hrrr-alaska",
            intervalPremium: 180,
            bounds: [
                [
                    [55.7, 157],
                    [51.2, 170.4],
                    [46, 180],
                    [71.6, 180],
                    [65.8, 167]
                ],
                [
                    [46, -180],
                    [41.8, -175],
                    [48.8, -160],
                    [51.7, -145],
                    [52, -129],
                    [64.9, -125],
                    [76, -116.5],
                    [76, -158],
                    [71.6, -180]
                ]
            ]
        }),
        k = t.extend({
            modelName: "InterSucho",
            modelResolution: 9,
            provider: "InterSucho",
            interval: 1440,
            fileSuffix: "png",
            PNGtransparency: !0,
            dataQuality: "normal",
            directory: "forecast/intersucho",
            levels: ["surface"],
            acTimes: [],
            isolines: [],
            labelsTemp: !1,
            requiresInfoJson: !0,
            logo: '<a href="https://www.droughtimpacts.eu/" target="_blank" class="uiyellow noselect clickable-size" style="font-size: 11px;">\n        <img style="position:relative;width:100px;height:auto;opacity:0.7;-webkit-filter:drop-shadow(0 0 3px rgba(0, 0, 0, 0.8));filter:drop-shadow(0 0 3px rgba(0, 0, 0, 0.8));" src="img/providers/czechglobe.svg" />\n        <p style="white-space: break-spaces;">Help us to monitor drought impacts in your region for a safer World - go to www.droughtImpacts.eu</p>\n    </a>'
        }),
        U = k.instance({
            ident: "intersuchoAWD",
            overlays: ["awd_0_40", "awd_0_100"]
        }),
        F = k.instance({
            ident: "intersuchoAWP",
            overlays: ["awp_0_40", "awp_0_100"]
        }),
        H = k.instance({
            ident: "intersuchoAWR",
            overlays: ["awr_0_40", "awr_0_100"]
        }),
        G = n.instance({
            ident: "ecmwfWaves",
            modelName: "ECMWF",
            modelResolution: 13,
            provider: "ECMWF",
            interval: 720,
            labelsTemp: !1,
            maxTileZoom: 3,
            directory: "forecast/ecmwf-wam",
            fileSuffix: "png",
            dataQuality: "normal",
            overlays: ["waves", "swell1", "swell2", "swell3", "wwaves"],
            levels: ["surface"]
        }),
        z = t.instance({
            ident: "gfsWaves",
            modelName: "GFS",
            modelResolution: 22,
            provider: "NOAA",
            interval: 360,
            prefferedProduct: "gfs",
            labelsTemp: !1,
            directory: "forecast/gfs-wave",
            fileSuffix: "png",
            dataQuality: "normal",
            overlays: ["waves", "swell1", "swell2", "swell3", "wwaves"],
            levels: ["surface"]
        }),
        B = t.instance({
            ident: "geos5",
            modelName: "GEOS-5",
            modelResolution: 22,
            labelsTemp: !1,
            provider: "NASA",
            interval: 3240,
            directory: "forecast/nasa-chem",
            dataQuality: "normal",
            overlays: ["cosc", "dustsm"],
            levels: ["surface"],
            logo: '<a href="https://geos5.org/" target="_blank"><img style="position: relative;top: 10px;max-width:50px;height:auto;" src="img/providers/nasa.svg" /></a>'
        }),
        j = i.instance({
            ident: "capAlerts",
            productReady: !0,
            labelsTemp: !1,
            modelName: "CAP Alerts",
            interval: 0,
            provider: "National weather institutes",
            overlays: ["capAlerts"]
        }),
        V = i.instance({
            ident: "map",
            productReady: !0,
            labelsTemp: !1,
            modelName: "Outdoor Map",
            interval: 0,
            provider: "Seznam.cz",
            overlays: ["map"]
        }),
        Y = t.instance({
            ident: "efi",
            provider: "ECMWF",
            interval: 720,
            modelName: "ECMWF",
            modelResolution: 9,
            labelsTemp: !1,
            directory: "forecast/ecmwf-efi",
            dataQuality: "normal",
            levels: ["surface"],
            overlays: ["efiWind", "efiTemp", "efiRain"],
            requiresInfoJson: !0
        }),
        q = i.instance({
            ident: "satellite",
            animation: !1,
            modelName: "EUMETSAT",
            provider: "EUMETSAT",
            interval: 3,
            directory: "satellite/tile",
            server: "https://sat.windy.com",
            urlSuff: "visir.jpg?mosaic=true",
            urlSuffFlow: "visir.jpg",
            labelsTemp: !1,
            overlays: ["satellite"],
            levels: ["surface"],
            logo: '<a href="https://www.eumetsat.int/" target="_blank"><img src="img/providers/eumetsat2.svg" /></a>',
            open: function() {
                return this.loadInfoJson(), Promise.resolve()
            },
            loadInfoJson: function(e) {
                var t = (new Date).toISOString().replace(/.*T(\d+):(\d+).*/, "$1$2"),
                    n = this.server + "/satellite/info.json?" + t;
                return h(n, {
                    cache: !e
                })
            },
            moveTs: function(e) {
                var t = this.calendar.timestamps,
                    n = c.get("satelliteTimestamp"),
                    i = t.length - 1,
                    o = t.find((function(e) {
                        return e >= n
                    }));
                void 0 === o && (o = t[i]);
                var r = f(t.indexOf(o) + (e ? 1 : -1), 0, i);
                c.set("satelliteTimestamp", t[r])
            }
        }),
        X = {
            bomAccess: C,
            mblue: R,
            ecmwf: g,
            ecmwfWaves: G,
            cams: w,
            camsEu: y,
            camsGfas: b,
            cmems: T,
            gfs: S,
            gfsWaves: z,
            icon: E,
            iconD2: A,
            iconEu: _,
            iconEuWaves: L,
            iconWaves: P,
            arome: M,
            nems: O,
            namAlaska: I,
            namConus: x,
            namHawaii: D,
            geos5: B,
            capAlerts: j,
            map: V,
            efi: Y,
            radar: i.instance({
                ident: "radar",
                animation: !1,
                modelName: "",
                interval: 3,
                directory: "radar2/composite",
                server: "https://rdr.windy.com",
                pathGenerator: "{server}/{directory}/{path}/257w<z>/<y>/<x>/{filename}-{level}.{fileSuffix}",
                labelsTemp: !1,
                overlays: ["radar"],
                levels: ["surface"],
                open: function() {
                    return this.loadMinifest(), Promise.resolve()
                },
                loadMinifest: function() {
                    return h(this.server + "/" + this.directory + "/" + this.getMinifestFilename() + "?" + this.getTimeFrag())
                },
                moveTs: function(e) {
                    var t = this.calendar.timestamps,
                        n = c.get("radarTimestamp"),
                        i = t.length - 1,
                        o = t.find((function(e) {
                            return e >= n
                        }));
                    void 0 === o && (o = t[i]);
                    var r = f(t.indexOf(o) + (e ? 1 : -1), 0, i);
                    c.set("radarTimestamp", t[r])
                }
            }),
            satellite: q,
            intersuchoAWD: U,
            intersuchoAWP: F,
            intersuchoAWR: H,
            hrrrAlaska: W,
            hrrrConus: N
        };
    e.default = X
})), W.define("legends", [], (function(e) {
    e.default = {
        cbase: {
            description: ["m", "ft"],
            lines: [
                [0, 0, 0],
                [200, 300, 1e3],
                [500, 500, 1500],
                [1500, "1.5k", 5e3]
            ]
        },
        ccl: {
            description: ["m", "ft"],
            lines: [
                [0, 0, 0],
                [1e3, "1k", "3.3k"],
                [2e3, "2k", "6.6k"],
                [3e3, "3k", "10k"],
                [4e3, "4k", "13k"],
                [6e3, "6k", "20k"],
                [8e3, "8k", "26k"]
            ]
        },
        sst: {
            description: ["Â°C", "Â°F"],
            lines: [
                [272, 0, 30],
                [282, 10, 50],
                [292, 20, 70],
                [302, 30, 85],
                [313, 40, 100]
            ]
        },
        cloudtop: {
            description: ["m", "ft"],
            lines: [
                [0, 0, 0],
                [5e3, "5k", "FL150"],
                [9e3, "9k", "FL300"],
                [12e3, "12k", "FL400"],
                [15e3, "15k", "FL500"]
            ]
        },
        rainAccu: {
            description: ["mm", "in"],
            lines: [
                [5, 5, ".2"],
                [10, 10, ".4"],
                [20, 20, ".8"],
                [40, 40, 1.5],
                [1e3, "1m", "3ft"]
            ]
        }
    }
})), W.define("broadcast", ["Evented"], (function(e, t) {
    var n = t.instance({
        ident: "bcast"
    });
    e.default = n
})), W.define("detectDevice", [], (function(e) {
    var t, n, i, o, r, a = window.navigator.userAgent,
        s = /android/i.test(a) ? "android" : /(iPhone|iPod|iPad)/i.test(a) ? "ios" : "desktop",
        l = (t = window.screen.width, n = window.screen.height, i = Math.min(t, n), o = Math.max(t, n), r = /ios|android/.test(s), o <= 600 || o <= 960 && i <= 600 || i <= 500 && r ? "mobile" : o <= 1024 || i <= 1080 && r ? "tablet" : "desktop");
    e.device = l, e.platform = s
})), W.define("device", ["utils", "storage", "store"], (function(e, t, n, i) {
    var o, r, a, s = null,
        l = n.get("UUID") || (a = (r = function() {
            return Math.floor(65536 * (1 + Math.random())).toString(16).substring(1)
        })() + r() + "-" + r() + "-" + r() + "-" + r() + "-" + r() + r() + r(), n.put("UUID", a), a),
        c = t.getNativePlugin("Device");
    c ? (c.getInfo().then((function(e) {
        s = e
    })), c.getId().then((function(e) {
        o = e.uuid
    }))) : o = l, i.get("firstUserSession") || i.set("firstUserSession", Date.now());
    e.getDeviceID = function() {
        return o
    }, e.getDeviceInfo = function() {
        return s
    }, e.getVirtualDeviceID = function() {
        return l
    }
})), W.define("rootScope", ["detectDevice"], (function(e, t) {
    var n = W.version,
        i = W.target,
        o = t.platform,
        r = t.device,
        a = "https://www.windy.com/v/" + W.assets,
        s = ["nems", "namConus", "namHawaii", "namAlaska", "iconEu", "iconD2", "arome", "camsEu", "iconEuWaves", "hrrrAlaska", "hrrrConus", "bomAccess"],
        l = ["gfs", "ecmwf", "geos5", "radar", "ecmwfWaves", "gfsWaves", "icon", "iconWaves", "capAlerts", "cams", "map", "efi", "satellite", "camsGfas", "cmems", "intersuchoAWD", "intersuchoAWP", "intersuchoAWR"],
        c = ["cams", "camsEu", "geos5"],
        d = ["namConus", "namHawaii", "namAlaska", "iconD2", "iconEu", "iconEuWaves", "arome", "hrrrAlaska", "hrrrConus", "bomAccess"],
        u = ["gfs", "ecmwf", "icon", "mblue"],
        h = l.concat(s, c, ["mblue"]),
        p = u.concat(d),
        f = /(googlebot|bingbot|baiduspider|slurp|yandexbot)/i.test(navigator.userAgent),
        m = "mobile" === r,
        v = "tablet" === r,
        g = "mobile" === r || "tablet" === r,
        w = Boolean(window.devicePixelRatio && window.devicePixelRatio > 1),
        y = (navigator.languages ? navigator.languages[0] : navigator.language) || "en";
    e.acTimes = ["next12h", "next24h", "next2d", "next48h", "next60h", "next3d", "next5d", "next10d"], e.airQualityProducts = c, e.assets = a, e.community = "https://community.windy.com", e.device = r, e.globalPointProducts = u, e.globalProducts = l, e.hereMapsID = "app_id=Ps0PWVjNew3jM9lpFHFG&app_code=eEg9396D7_C6NCcM1DUK2A", e.iconsDir = "img/icons6", e.isCrawler = f, e.isMobile = m, e.isMobileOrTablet = g, e.isRetina = w, e.isTablet = v, e.isolines = ["off", "pressure", "gh", "temp", "deg0"], e.levels = ["surface", "100m", "975h", "950h", "925h", "900h", "850h", "800h", "700h", "600h", "500h", "400h", "300h", "250h", "200h", "150h"], e.levelsData = {
        "150h": ["150hPa", "13,5km FL450"],
        "200h": ["200hPa", "11.7km FL390"],
        "250h": ["250hPa", "10km FL340"],
        "300h": ["300hPa", "9000m FL300"],
        "400h": ["400hPa", "7000m FL240"],
        "500h": ["500hPa", "5500m FL180"],
        "600h": ["600hPa", "4200m FL140"],
        "700h": ["700hPa", "3000m FL100"],
        "800h": ["800hPa", "2000m 6400ft"],
        "850h": ["850hPa", "1500m 5000ft"],
        "900h": ["900hPa", "900m 3000ft"],
        "925h": ["925hPa", "750m 2500ft"],
        "950h": ["950hPa", "600m 2000ft"],
        "975h": ["975hPa", "300m 1000ft"],
        "100m": ["100m", "330ft"],
        surface: ["", ""]
    }, e.localPointProducts = d, e.localProducts = s, e.nodeServer = "https://node.windy.com", e.overlays = ["radarSat", "radar", "satellite", "wind", "gust", "gustAccu", "rain", "rainAccu", "snowAccu", "snowcover", "ptype", "thunder", "temp", "dewpoint", "rh", "deg0", "clouds", "hclouds", "mclouds", "lclouds", "fog", "cloudtop", "cbase", "visibility", "cape", "ccl", "waves", "swell1", "swell2", "swell3", "wwaves", "sst", "currents", "currentsTide", "airQ", "no2", "pm2p5", "aod550", "gtco3", "tcso2", "go3", "cosc", "dustsm", "fires", "pressure", "efiWind", "efiTemp", "efiRain", "capAlerts", "map", "intersucho", "awr_0_40", "awr_0_100", "awd_0_40", "awd_0_100", "awp_0_40", "awp_0_100"], e.platform = o, e.pointForecast = "v2.7", e.pointProducts = p, e.pois = {
        favs: ["POI_FAVS", "k"],
        cities: ["POI_FCST", "&"],
        wind: ["POI_WIND", "î€ˆ"],
        temp: ["POI_TEMP", "î€…"],
        metars: ["POI_AD", "Q"],
        cams: ["POI_CAMS", "l"],
        pgspots: ["POI_PG", "î€‰"],
        kitespots: ["POI_KITE", "î€‚"],
        surfspots: ["POI_SURF", "{"],
        tide: ["POI_TIDE", "q"],
        radiation: ["POI_RADIATION", "î¤†"],
        firespots: ["ACTIVE_FIRES", "î€³"],
        airq: ["POI_AIRQ", "î€«"],
        empty: ["POI_EMPTY", "t"]
    }, e.prefLang = y, e.products = h, e.seaProducts = ["ecmwfWaves", "gfsWaves", "iconWaves", "iconEuWaves", "cmems"], e.server = "https://ims-s.windy.com", e.supportedLanguages = ["en", "zh-TW", "zh", "ja", "fr", "ko", "it", "ru", "nl", "cs", "tr", "pl", "sv", "fi", "ro", "el", "hu", "hr", "ca", "da", "ar", "fa", "hi", "ta", "sk", "uk", "bg", "he", "is", "lt", "et", "vi", "sl", "sr", "id", "th", "sq", "pt", "nb", "es", "de", "bn"], e.target = i, e.tileServer = "https://tiles-s.windy.com", e.version = n
})), W.define("trans", ["utils", "rootScope", "storage", "store", "seoParser", "langEn", "http"], (function(e, t, n, i, o, r, a, s) {
    var l, c = {
            main: {
                loaded: "en",
                filename: "lang/{lang}.json",
                test: "MON"
            },
            widgets: {
                filename: "lang/widgets/{lang}.json",
                test: "EMBED_SELECT_VIEW"
            },
            alerts: {
                filename: "lang/alerts/{lang}.json",
                test: "ALERT_DELETE"
            },
            favs: {
                filename: "lang/favs/{lang}.json",
                test: "FAVS_HOW_TO_ADD"
            },
            hurricanes: {
                filename: "lang/hurricanes/{lang}.json",
                test: "HURR_PREDICTED_RADIUS"
            },
            info: {
                filename: "lang/info/{lang}.json",
                test: "NOW_AT_ANY_MOMENT"
            },
            products: {
                filename: "lang/products/{lang}.json",
                test: "waves"
            },
            settings: {
                filename: "lang/settings/{lang}.json",
                test: "S_LANG"
            },
            register: {
                filename: "lang/register/{lang}.json",
                test: "ALREADY_REGISTERED"
            },
            webcams: {
                filename: "lang/webcams/{lang}.json",
                test: "CAM_STREAM"
            },
            subscription: {
                filename: "lang/subscription/{lang}.json",
                test: "SUB_HEADING"
            },
            notifications: {
                filename: "lang/notifications/{lang}.json",
                test: "NOTIF_ALERT_TITLE"
            },
            airq: {
                filename: "lang/airq/{lang}.json",
                test: "AIRQ_US_AIR_QUALITY_INDEX"
            },
            radiation: {
                filename: "lang/radiation/{lang}.json",
                test: "RADIATION_STATION"
            },
            watchface: {
                filename: "lang/watchface/{lang}.json",
                test: "WATCHFACES_TITLE"
            },
            lib: {
                filename: "lang/lib/{lang}.json",
                test: "DO_YOU_LIKE_THIS_MAP"
            }
        },
        d = a,
        u = "en",
        h = o.get("lang"),
        p = r.lang || n.prefLang;

    function f(e) {
        void 0 === e && (e = "");
        return /\|/.test(e) ? e.replace(/(\w+)\|(\w+):(\w+)/, (function(t, n, i, o) {
            var r = d[n];
            return r && o ? r.replace(/\{\{[^}]+\}\}/g, o) : e
        })) : d[e] || e
    }
    "auto" !== h && t.isValidLang(h) && (p = h), p && (t.isValidLang(p) ? u = p : (p = p.replace(/-\S+$/, "")) !== (u = t.isValidLang(p) ? p : "en") && (l = p));
    var m = function(e, t) {
            void 0 === t && (t = {});
            var o = i.get(e);
            return o && (t.absoluteURL || o.version === n.version) && (!t.test || o.data && t.test && o.data[t.test]) ? Promise.resolve(o.data) : new Promise((function(o, r) {
                s.get(t.absoluteURL ? e : n.assets + "/" + e, {
                    json: !0
                }).then((function(a) {
                    var s = a.data;
                    t.test && !(t.test in s) ? r("File did not passed the test") : (i.put(e, {
                        data: s,
                        version: t.absoluteURL ? "notAplicable" : n.version
                    }), o(s))
                })).catch((function(e) {
                    window.wError("storage", "Failed to load lang file as .json", e), r(e)
                }))
            }))
        },
        v = function(e, n) {
            return void 0 === n && (n = u), new Promise((function(i, o) {
                if (c[e].loaded !== n) {
                    var r = c[e],
                        a = r.filename,
                        s = r.test,
                        l = t.template(a, {
                            lang: n
                        });
                    m(l, {
                        absoluteURL: !1,
                        test: s
                    }).then((function(t) {
                        Object.assign(d, t), c[e].loaded = n, i(t)
                    })).catch(o)
                } else i()
            }))
        },
        g = ["title", "placeholder", "t", "afterbegin", "beforeend", "tooltipsrc"],
        w = function(e) {
            g.forEach((function(t) {
                for (var n = e.querySelectorAll("[data-" + t + "]"), i = 0, o = n.length; i < o; i++) {
                    var r = n[i],
                        a = f(r.dataset[t]);
                    switch (t) {
                        case "t":
                            /</.test(a) ? r.innerHTML = a : r.textContent = a;
                            break;
                        case "title":
                        case "placeholder":
                            t in r && (r[t] = a);
                            break;
                        case "tooltipsrc":
                            r.dataset.tooltip = a;
                            break;
                        case "afterbegin":
                            r.firstChild && 3 == r.firstChild.nodeType && r.removeChild(r.firstChild), r.insertAdjacentHTML(t, a);
                            break;
                        case "beforeend":
                            r.lastChild && 3 == r.lastChild.nodeType && r.removeChild(r.lastChild), r.insertAdjacentHTML(t, a)
                    }
                }
            }))
        };

    function y(e) {
        var t = Object.keys(c).filter((function(e) {
            return c[e].loaded
        })).map((function(t) {
            return v(t, e)
        }));
        Promise.all(t).then((function() {
            w(document.body), u = e, o.set("usedLang", e), document.documentElement.lang = e
        }))
    }
    var b = function() {
        w(document.body), y(u), o.on("lang", (function(e) {
            "auto" !== e && e !== o.get("usedLang") && y(e)
        }))
    };
    "loading" !== document.readyState ? b() : document.addEventListener("DOMContentLoaded", b), e.getFile = m, e.loadLangFile = v, e.missingLang = l, e.t = d, e.translateDocument = w
})), W.define("store", ["dataSpecifications", "storage", "Evented"], (function(e, t, n, i) {
    var o = {},
        r = function(e, t) {
            return "function" == typeof e.allowed ? e.allowed(t) : Array.isArray(e.def) ? Array.isArray(t) && t.every((function(t) {
                return e.allowed.includes(t)
            })) : e.allowed.includes(t)
        },
        a = function(e) {
            return Boolean("asyncSet" in e && e.asyncSet)
        },
        s = function(e) {
            if (e in o) return o[e];
            var i, a = t[e];
            if (!a) throw window.wError("store", "Trying to get invalid dataSpec. ident: " + e), new Error('Cannot find "' + e + '" key in dataSpecifications');
            return a.save && n.isAvbl ? null === (i = n.get("settings_" + e)) ? i = a.def : r(a, i) || (window.wError("store", "Attempt to get invalid value from localStorage: " + e), i = a.def) : i = a.def, o[e] = i, i
        },
        l = function(e) {
            return t[e].def
        },
        c = function(e, t, n) {
            return t.compare ? !t.compare(n, s(e)) : e in o ? o[e] !== n : l(e) !== n
        },
        d = function(e, n) {
            t[e].def = n, delete o[e]
        },
        u = function(e, n, i) {
            void 0 === i && (i = {});
            var o = t[e];
            if (!o) throw window.wError("store", "Trying to set dataSpec. ident: " + e), new Error('Cannot find "' + e + '" key in dataSpecifications');
            if (!i.doNotCheckValidity && !r(o, n)) return console.warn("Invalid value for " + e + ", " + n), !!a(o) && Promise.reject();
            if (o.syncSet && (i.forceChange || c(e, o, n))) {
                var s = o.syncSet(n);
                if (i.forceChange || c(e, o, s)) return p(e, o, i, s), !0
            } else {
                if (a(o)) {
                    if (i.forceChange || c(e, o, n)) {
                        var l = o.asyncSet(n);
                        return l.then((function(t) {
                            (i.forceChange || c(e, o, t)) && p(e, o, i, t)
                        })).catch((function(t) {
                            return window.wError("store", "Unable to change store value " + e + ", " + n, t)
                        })), l
                    }
                    return Promise.resolve(n)
                }
                if (i.forceChange || c(e, o, n)) return p(e, o, i, n), !0
            }
            return !1
        },
        h = i.instance({
            ident: "store",
            get: s,
            set: u,
            remove: function(e, t) {
                void 0 === t && (t = {
                    doNotCheckValidity: !0
                }), u(e, null, t)
            },
            insert: function(e, n) {
                t[e] = n
            },
            defineProperty: function(e, n, i) {
                t[e][n] = i
            },
            getProperty: function(e) {
                return t[e]
            },
            setDefault: d,
            getAll: function() {
                Object.keys(t).map((function(e) {
                    return console.log(e + ":", s(e))
                }))
            },
            getDefault: l,
            getAllowed: function(e) {
                var n = t[e].allowed;
                return n && Array.isArray(n) ? n : "Allowed values are checked by function"
            },
            hasProperty: function(e) {
                return e in t
            }
        });

    function p(e, t, i, r) {
        if (null === r ? delete o[e] : o[e] = r, t.save && !i.doNotStore && n.isAvbl) {
            var a = i.update || Date.now();
            n.put("settings_" + e, r), t.sync && (t.update = a, n.put("settings_" + e + "_ts", a), n.put("lastSyncableUpdatedItem", a)), s("user") && t.sync && !i.doNotSaveToCloud && h.emit("_cloudSync")
        }
        h.emit(e, null === r ? t.def : r, i.UIident)
    }
    h.once("country", (function(e) {
        d("hourFormat", /us|uk|ph|ca|au|nz|in|eg|sa|co|pk|my/.test(e) ? "12h" : "24h"), u("isImperial", /us|my|lr/.test(e))
    }));
    var f = Math.max(s("sessionCounter"), s("sessionCounter201803"));
    h.set("sessionCounter", f + 1), e.default = h
})), W.define("dataSpecifications", ["rootScope", "utils"], (function(e, t, n) {
    var i = [!0, !1],
        o = function(e) {
            return "number" == typeof + e && !isNaN(+e)
        },
        r = function(e) {
            return void 0 !== e && "object" == typeof e
        },
        a = function(e) {
            return n.isValidLatLonObj(e) || null == e
        },
        s = function(e) {
            return void 0 !== e && "string" == typeof e
        },
        l = function(e) {
            return null === e || s(e)
        },
        c = function(e) {
            return e.slice().sort().toString()
        },
        d = function(e, t) {
            return c(e) === c(t)
        },
        u = {
            overlay: {
                def: "wind",
                allowed: t.overlays,
                save: !1,
                sync: !1,
                nativeSync: !1
            },
            level: {
                def: "surface",
                allowed: t.levels
            },
            acTime: {
                def: "next3d",
                allowed: t.acTimes
            },
            timestamp: {
                def: Date.now(),
                allowed: o
            },
            path: {
                def: "",
                allowed: s
            },
            isolines: {
                def: "off",
                allowed: t.isolines,
                save: !0
            },
            startUpLastProduct: {
                def: null,
                allowed: t.products.concat([null]),
                save: !0,
                nativeSync: !0
            },
            product: {
                def: "ecmwf",
                allowed: t.products
            },
            availProducts: {
                def: ["ecmwf"],
                allowed: Array.isArray,
                compare: d
            },
            visibleProducts: {
                def: ["ecmwf"],
                allowed: Array.isArray,
                compare: d
            },
            availAcTimes: {
                def: ["next12h"],
                allowed: Array.isArray
            },
            prefferedProduct: {
                def: "ecmwf",
                allowed: ["ecmwf", "gfs", "icon", "iconEu"]
            },
            animation: {
                def: !1,
                allowed: i
            },
            calendar: {
                def: null,
                allowed: r
            },
            availLevels: {
                def: [].concat(t.levels),
                allowed: function(e) {
                    return e.every((function(e) {
                        return t.levels.includes(e)
                    }))
                }
            },
            particlesAnim: {
                def: "on",
                allowed: ["on", "off", "intensive"],
                save: !0
            },
            lastModified: {
                def: 0,
                allowed: o
            },
            graticule: {
                def: !1,
                allowed: i,
                save: !0,
                sync: !1
            },
            latlon: {
                def: !1,
                allowed: i,
                save: !0,
                sync: !1
            },
            lang: {
                def: "auto",
                allowed: function(e) {
                    return "auto" === e || n.isValidLang(e)
                },
                save: !0,
                sync: !0
            },
            englishLabels: {
                def: !1,
                allowed: i,
                save: !0,
                sync: !0
            },
            numDirection: {
                def: !1,
                allowed: i,
                save: !0,
                sync: !0
            },
            favOverlays: {
                def: ["radar", "satellite", "wind", "gust", "rain", "rainAccu", "snowAccu", "thunder", "temp", "rh", "clouds", "lclouds", "cbase", "visibility", "waves", "swell1", "swell2", "sst", "no2", "gtco3", "aod550", "pm2p5"],
                allowed: Array.isArray,
                save: !0,
                sync: !1
            },
            hourFormat: {
                def: "24h",
                allowed: ["12h", "24h"],
                save: !0,
                sync: !0
            },
            country: {
                def: "xx",
                save: !0,
                allowed: function(e) {
                    return /[a-z][a-z0-9]/.test(e)
                }
            },
            isImperial: {
                def: !1,
                allowed: i
            },
            map: {
                def: "sznmap",
                allowed: ["sznmap", "sat", "winter"],
                save: !0,
                sync: !1
            },
            showWeather: {
                def: !0,
                allowed: i,
                save: !0,
                sync: !1
            },
            disableWebGL: {
                def: !1,
                allowed: i,
                save: !0,
                sync: !1
            },
            glParticlesOn: {
                def: !1,
                allowed: i
            },
            usedLang: {
                def: "en",
                allowed: t.supportedLanguages
            },
            expertMode: {
                def: !1,
                allowed: i,
                save: !0,
                sync: !1
            },
            lhpaneSwitch: {
                def: "tools",
                save: !0,
                allowed: ["tools", "favs", "settings"]
            },
            particles: {
                def: {
                    multiplier: 1,
                    velocity: 1,
                    width: 1,
                    blending: 1,
                    opacity: 1
                },
                save: !0,
                allowed: function(e) {
                    var t;
                    if (!e || "object" != typeof e) return !1;
                    for (var n in this.def)
                        if ("number" != typeof(t = e[n]) || t > 2 || t < 0) return !1;
                    return !0
                }
            },
            startUp: {
                def: "ip",
                allowed: ["ip", "gps", "location", "last"],
                save: !0,
                nativeSync: !0
            },
            startUpLastPosition: {
                def: {
                    lat: 50,
                    lon: 14,
                    zoom: 4,
                    source: "maps"
                },
                allowed: function(e) {
                    return null !== e && n.isValidLatLonObj(e) && Number.isInteger(e.zoom) && ("maps" === e.source || "globe" === e.source)
                },
                save: !0,
                nativeSync: !0
            },
            homeLocation: {
                def: null,
                allowed: a,
                save: !0,
                sync: !0,
                nativeSync: !0
            },
            startUpOverlay: {
                def: "wind",
                allowed: t.overlays,
                save: !0,
                nativeSync: !0
            },
            startUpLastOverlay: {
                def: !1,
                allowed: i,
                save: !0,
                nativeSync: !0
            },
            startUpLastStep: {
                def: null,
                allowed: [1, 3, null],
                save: !0,
                nativeSync: !0
            },
            ipLocation: {
                def: null,
                allowed: a,
                save: !0,
                nativeSync: !0
            },
            gpsLocation: {
                def: null,
                allowed: a,
                save: !0,
                nativeSync: !0
            },
            startupReverseName: {
                def: null,
                allowed: r,
                save: !0
            },
            notams: {
                def: null,
                allowed: r,
                save: !0,
                sync: !0
            },
            email: {
                def: "",
                allowed: function(e) {
                    return /\S+@\S+/.test(e)
                },
                save: !0,
                sync: !0
            },
            metarsRAW: {
                def: !1,
                allowed: i,
                save: !0,
                sync: !0
            },
            sessionCounter201803: {
                def: 0,
                allowed: o,
                save: !0
            },
            sessionCounter: {
                def: 0,
                allowed: o,
                save: !0
            },
            firstUserSession: {
                def: 0,
                allowed: o,
                save: !0
            },
            seenRadarInfo: {
                def: !1,
                save: !0,
                allowed: i
            },
            wasDragged: {
                def: !1,
                allowed: i,
                save: !0,
                sync: !0
            },
            detailLocation: {
                def: null,
                allowed: a
            },
            detailDisplay: {
                def: "table",
                allowed: ["table", "meteogram", "airgram", "waves", "wind"]
            },
            detailProduct: {
                def: "ecmwf",
                allowed: ["ecmwf", "mblue", "gfs", "iconD2", "iconEu", "icon", "iconWaves", "iconEuWaves", "ecmwfWaves", "gfsWaves", "namConus", "namAlaska", "namHawaii", "arome", "hrrrConus", "hrrrAlaska", "bomAccess"]
            },
            detailAvailProducts: {
                def: ["ecmwf"],
                allowed: Array.isArray,
                compare: d
            },
            detailExtended: {
                def: !1,
                allowed: i
            },
            detail1h: {
                def: !1,
                allowed: i
            },
            webcamsDaylight: {
                def: !1,
                allowed: i
            },
            capColorizeType: {
                def: "severity",
                allowed: ["severity", "type"]
            },
            capDisplay: {
                def: "all",
                allowed: ["all", "today", "tomm", "later"]
            },
            radarRange: {
                def: "-1",
                allowed: ["-12", "-6", "-1"]
            },
            radarTimestamp: {
                def: Date.now(),
                allowed: o
            },
            radarSpeed: {
                def: "medium",
                allowed: ["slow", "medium", "fast"]
            },
            radarCalendar: {
                def: null,
                allowed: r
            },
            radarAnimation: {
                def: !1,
                allowed: i
            },
            blitzOn: {
                def: !0,
                allowed: i,
                save: !0
            },
            blitzSoundOn: {
                def: !0,
                allowed: i,
                save: !0
            },
            satelliteRange: {
                def: "short",
                allowed: ["long", "medium", "short"]
            },
            satelliteTimestamp: {
                def: Date.now(),
                allowed: o
            },
            satelliteCalendar: {
                def: null,
                allowed: r
            },
            satelliteAnimation: {
                def: !1,
                allowed: i
            },
            satelliteMode: {
                def: "BLUE",
                allowed: ["BLUE", "VISIR", "IRBT", "DBG"],
                save: !0,
                allowUrlRewrite: !0
            },
            satelliteSpeed: {
                def: "medium",
                allowed: ["slow", "medium", "fast"]
            },
            satelliteFlowOn: {
                def: !0,
                allowed: i,
                save: !0,
                sync: !1
            },
            satelliteExtraOn: {
                def: !0,
                allowed: i,
                save: !0
            },
            satelliteInterpolationOverride: {
                def: !1,
                allowed: i
            },
            hpShown: {
                def: !1,
                allowed: i
            },
            pois: {
                def: "favs",
                allowed: Object.keys(t.pois),
                save: !0,
                sync: !1
            },
            favPois: {
                def: ["favs", "wind", "temp", "cities", "metars", "cams", "pgspots"],
                allowed: function(e) {
                    return Array.isArray(e) && e.length < 8
                },
                save: !0,
                sync: !0
            },
            visibility: {
                def: !0,
                allowed: i
            },
            displayLocation: {
                def: !0,
                allowed: i,
                save: !0
            },
            vibrate: {
                def: !0,
                allowed: i,
                save: !0
            },
            donations: {
                def: [],
                allowed: Array.isArray,
                compare: d,
                save: !0,
                sync: !0
            },
            zuluMode: {
                def: !1,
                allowed: i,
                save: !0
            },
            plugins: {
                def: [],
                allowed: Array.isArray,
                compare: d,
                save: !0,
                sync: !0
            },
            pluginOrder: {
                def: [],
                allowed: Array.isArray,
                save: !0
            },
            stationsSort: {
                def: "profi",
                allowed: ["profi", "distance"],
                save: !0
            },
            stationCompareModel: {
                def: "noModel",
                allowed: s,
                save: !0
            },
            subscription: {
                def: null,
                allowed: function(e) {
                    return !0
                },
                save: !0,
                nativeSync: !0
            },
            pendingSubscription: {
                def: null,
                allowed: l,
                save: !0
            },
            failedSubscriptionPayment: {
                def: null,
                allowed: l,
                save: !0
            },
            motionSpeed: {
                def: 10,
                allowed: o,
                save: !0
            },
            notifications: {
                def: null,
                allowed: r,
                save: !0,
                sync: !0
            },
            adHocNotification: {
                def: !1,
                allowed: i,
                save: !0,
                nativeSync: !0
            },
            badgeNumber: {
                def: 0,
                allowed: o,
                save: !0
            },
            user: {
                def: null,
                allowed: r,
                nativeSync: !0
            },
            userToken: {
                def: null,
                allowed: s,
                save: !0,
                nativeSync: !0
            },
            authHash: {
                def: null,
                allowed: s,
                save: !0,
                nativeSync: !0
            },
            globeActive: {
                def: !1,
                allowed: i
            },
            lastPoiLocation: {
                def: null,
                allowed: a
            },
            pickerLocation: {
                def: null,
                allowed: function(e) {
                    return null === e || a(e)
                }
            },
            settingsLastSaved: {
                def: 0,
                allowed: o
            },
            renderedTime: {
                def: 0,
                allowed: o
            },
            loadedTime: {
                def: 0,
                allowed: o
            },
            mapCoords: {
                def: null,
                allowed: a
            },
            unresolvedErrors: {
                def: [],
                allowed: Array.isArray,
                save: !1,
                nativeSync: !1
            },
            closedErrors: {
                def: [],
                allowed: Array.isArray,
                save: !0,
                nativeSync: !0
            },
            launchedBy: {
                def: null,
                allowed: s
            },
            showDailyNotifications: {
                def: !1,
                allowed: i,
                nativeSync: !0,
                save: !0
            }
        };
    e.default = u
})), W.define("colors", ["Color"], (function(e, t) {
    var n = {
        temp: t.instance({
            ident: "temp",
            steps: 2048,
            prepare: !0,
            default: [
                [203, [115, 70, 105, 255]],
                [218, [202, 172, 195, 255]],
                [233, [162, 70, 145, 255]],
                [248, [143, 89, 169, 255]],
                [258, [157, 219, 217, 255]],
                [265, [106, 191, 181, 255]],
                [269, [100, 166, 189, 255]],
                [273.15, [93, 133, 198, 255]],
                [274, [68, 125, 99, 255]],
                [283, [128, 147, 24, 255]],
                [294, [243, 183, 4, 255]],
                [303, [232, 83, 25, 255]],
                [320, [71, 14, 0, 255]]
            ]
        }),
        airQ: t.instance({
            ident: "airQ",
            steps: 2048,
            prepare: !0,
            default: [
                [0, [0, 90, 0, 255]],
                [51, [170, 170, 0, 255]],
                [101, [255, 126, 0, 255]],
                [151, [255, 0, 0, 255]],
                [201, [143, 63, 151, 255]],
                [301, [126, 0, 35, 255]]
            ]
        }),
        wind: t.instance({
            ident: "wind",
            steps: 2048,
            prepare: !0,
            default: [
                [0, [98, 113, 183, 255]],
                [1, [57, 97, 159, 255]],
                [3, [74, 148, 169, 255]],
                [5, [77, 141, 123, 255]],
                [7, [83, 165, 83, 255]],
                [9, [53, 159, 53, 255]],
                [11, [167, 157, 81, 255]],
                [13, [159, 127, 58, 255]],
                [15, [161, 108, 92, 255]],
                [17, [129, 58, 78, 255]],
                [19, [175, 80, 136, 255]],
                [21, [117, 74, 147, 255]],
                [24, [109, 97, 163, 255]],
                [27, [68, 105, 141, 255]],
                [29, [92, 144, 152, 255]],
                [36, [125, 68, 165, 255]],
                [46, [231, 215, 215, 256]],
                [51, [219, 212, 135, 256]],
                [77, [205, 202, 112, 256]],
                [104, [128, 128, 128, 255]]
            ]
        }),
        windDetail: t.instance({
            ident: "windDetail",
            steps: 256,
            default: [
                [0, [243, 243, 243, 255]],
                [3, [243, 243, 243, 255]],
                [4, [0, 200, 254, 255]],
                [6, [0, 230, 0, 255]],
                [10, [254, 174, 0, 255]],
                [19, [254, 0, 150, 255]],
                [100, [151, 50, 222, 255]]
            ]
        }),
        wavesDetail: t.instance({
            ident: "wavesDetail",
            steps: 256,
            default: [
                [0, [255, 255, 255, 0]],
                [.1, [255, 255, 255, 0]],
                [1, [180, 180, 255, 255]],
                [2.5, [254, 174, 0, 255]],
                [20, [255, 255, 255, 255]]
            ]
        }),
        periodDetail: t.instance({
            ident: "periodDetail",
            steps: 256,
            default: [
                [0, [255, 255, 255, 0]],
                [5, [255, 255, 255, 0]],
                [10, [255, 237, 180, 255]],
                [20, [180, 255, 180, 255]]
            ]
        }),
        altitudeDetail: t.instance({
            ident: "altitudeDetail",
            steps: 256,
            default: [
                [0, [255, 197, 254, 256]],
                [129, [255, 199, 254, 256]],
                [149, [255, 167, 179, 256]],
                [279, [255, 177, 179, 256]],
                [299, [175, 203, 255, 256]],
                [879, [157, 194, 255, 256]],
                [914, [159, 255, 170, 256]],
                [1499, [163, 255, 172, 256]],
                [7999, [255, 255, 255, 256]]
            ]
        }),
        visibilityDetail: t.instance({
            ident: "visibilityDetail",
            steps: 256,
            default: [
                [0, [251, 180, 251, 256]],
                [1600, [253, 173, 255, 256]],
                [2200, [255, 175, 176, 256]],
                [5e3, [255, 165, 165, 256]],
                [6e3, [179, 187, 255, 256]],
                [8e3, [169, 182, 255, 256]],
                [9e3, [179, 255, 187, 256]],
                [15e3, [178, 255, 171, 255]],
                [20004, [255, 255, 255, 256]]
            ]
        }),
        dewpointSpreadDetail: t.instance({
            ident: "dewpointSpreadDetail",
            steps: 256,
            default: [
                [0, [251, 180, 251, 256]],
                [.1, [253, 173, 255, 256]],
                [.25, [255, 175, 176, 256]],
                [.5, [255, 165, 165, 256]],
                [1, [179, 187, 255, 256]],
                [2, [169, 182, 255, 256]],
                [3, [179, 255, 187, 256]],
                [4, [178, 255, 171, 255]],
                [5, [255, 255, 255, 256]]
            ]
        }),
        rh: t.instance({
            ident: "rh",
            steps: 1024,
            default: [
                [0, [173, 85, 56, 255]],
                [30, [173, 110, 56, 255]],
                [40, [173, 146, 56, 255]],
                [50, [105, 173, 56, 255]],
                [60, [56, 173, 121, 255]],
                [70, [56, 174, 173, 255]],
                [75, [56, 160, 173, 255]],
                [80, [56, 157, 173, 255]],
                [83, [56, 148, 173, 255]],
                [87, [56, 135, 173, 255]],
                [90, [56, 132, 173, 255]],
                [93, [56, 123, 173, 255]],
                [97, [56, 98, 157, 255]],
                [100, [56, 70, 114, 255]]
            ]
        }),
        pressure: t.instance({
            ident: "pressure",
            steps: 4e3,
            default: [
                [9e4, [8, 16, 48, 255]],
                [95e3, [0, 32, 96, 255]],
                [97600, [0, 52, 146, 255]],
                [98600, [0, 90, 148, 255]],
                [99500, [0, 117, 146, 255]],
                [100200, [26, 140, 147, 255]],
                [100700, [103, 162, 155, 255]],
                [101125, [155, 183, 172, 255]],
                [101325, [182, 182, 182, 255]],
                [101525, [176, 174, 152, 255]],
                [101900, [167, 147, 107, 255]],
                [102400, [163, 116, 67, 255]],
                [103e3, [159, 81, 44, 255]],
                [103800, [142, 47, 57, 255]],
                [104600, [111, 24, 64, 255]],
                [108e3, [48, 8, 24, 255]]
            ]
        }),
        cclAltitude: t.instance({
            ident: "cclAltitude",
            steps: 1024,
            default: [
                [0, [128, 128, 128, 255]],
                [500, [128, 128, 128, 255]],
                [1e3, [213, 211, 173, 256]],
                [2e3, [199, 143, 32, 256]],
                [2500, [201, 109, 12, 256]],
                [3e3, [193, 72, 16, 256]],
                [4500, [159, 29, 43, 256]],
                [5e3, [133, 12, 12, 256]],
                [8e3, [83, 5, 36, 256]]
            ]
        }),
        altitude: t.instance({
            ident: "altitude",
            steps: 1024,
            default: [
                [0, [105, 83, 83, 255]],
                [500, [162, 82, 140, 255]],
                [750, [99, 174, 174, 255]],
                [1000.15, [73, 106, 160, 255]],
                [1500, [75, 131, 70, 255]],
                [2e3, [191, 193, 93, 255]],
                [3e3, [184, 149, 73, 255]],
                [5e3, [182, 99, 83, 255]],
                [1e4, [171, 81, 102, 255]],
                [15e3, [108, 77, 97, 255]]
            ]
        }),
        deg0: t.instance({
            ident: "deg0",
            steps: 1024,
            default: [
                [0, [188, 197, 195, 255]],
                [500, [155, 195, 189, 255]],
                [750, [93, 173, 156, 255]],
                [1000.15, [80, 141, 129, 255]],
                [1500, [55, 122, 109, 255]],
                [2e3, [39, 93, 82, 255]],
                [3e3, [33, 68, 73, 255]],
                [5e3, [32, 55, 71, 255]],
                [1e4, [28, 33, 64, 255]],
                [15e3, [6, 6, 6, 255]]
            ]
        }),
        levels: t.instance({
            ident: "levels",
            steps: 2048,
            default: [
                [0, [111, 111, 111, 255]],
                [1e3, [111, 111, 111, 255]],
                [4e3, [80, 121, 154, 255]],
                [8e3, [78, 179, 102, 255]],
                [1e4, [189, 189, 68, 255]],
                [12e3, [177, 80, 80, 255]],
                [15e3, [178, 80, 178, 255]],
                [2e4, [184, 184, 184, 255]]
            ]
        }),
        rain: t.instance({
            ident: "rain",
            steps: 1024,
            default: [
                [0, [111, 111, 111, 255]],
                [.6, [60, 116, 160, 255]],
                [6, [59, 161, 161, 255]],
                [8, [59, 161, 61, 255]],
                [10, [130, 161, 59, 255]],
                [15, [161, 161, 59, 255]],
                [20, [161, 59, 59, 255]],
                [31, [161, 59, 161, 255]],
                [50, [168, 168, 168, 255]]
            ]
        }),
        ptype: t.instance({
            ident: "ptype",
            steps: 128,
            qualitative: !0,
            default: [
                [0, [111, 111, 111, 255]],
                [1, [0, 208, 239, 255]],
                [2, [0, 0, 255, 255]],
                [3, [197, 27, 195, 255]],
                [4, [129, 63, 63, 255]],
                [5, [227, 227, 227, 255]],
                [6, [129, 195, 129, 255]],
                [7, [202, 211, 57, 255]],
                [8, [183, 119, 8, 255]],
                [9, [227, 73, 19, 255]],
                [10, [195, 63, 63, 255]]
            ]
        }),
        rainClouds: t.instance({
            ident: "rainClouds",
            steps: 128,
            opaque: !1,
            default: [
                [0, [67, 87, 166, 56]],
                [.8, [70, 102, 163, 77]],
                [2, [62, 171, 171, 107]],
                [6, [62, 171, 171, 192]],
                [8, [62, 142, 62, 250]],
                [10, [129, 156, 62, 250]],
                [15, [171, 171, 62, 250]],
                [20, [169, 62, 62, 250]],
                [31, [171, 62, 171, 250]],
                [50, [177, 177, 177, 250]]
            ]
        }),
        clouds: t.instance({
            ident: "clouds",
            steps: 800,
            default: [
                [0, [146, 130, 70, 255]],
                [10, [132, 119, 70, 255]],
                [50, [116, 116, 116, 255]],
                [95, [171, 180, 179, 255]],
                [98, [198, 201, 201, 255]],
                [100, [213, 213, 205, 255]]
            ]
        }),
        lclouds: t.instance({
            ident: "lclouds",
            steps: 800,
            default: [
                [0, [156, 142, 87, 255]],
                [10, [143, 131, 87, 255]],
                [30, [129, 129, 129, 255]],
                [90, [137, 159, 182, 255]],
                [100, [187, 187, 187, 255]]
            ]
        }),
        hclouds: t.instance({
            ident: "hclouds",
            steps: 800,
            default: [
                [0, [156, 142, 87, 255]],
                [10, [143, 131, 87, 255]],
                [30, [125, 157, 157, 255]],
                [90, [141, 169, 169, 255]],
                [100, [187, 187, 187, 255]]
            ]
        }),
        mclouds: t.instance({
            ident: "mclouds",
            steps: 800,
            default: [
                [0, [156, 142, 87, 255]],
                [10, [143, 131, 87, 255]],
                [30, [157, 192, 157, 255]],
                [90, [145, 171, 145, 255]],
                [100, [187, 187, 187, 255]]
            ]
        }),
        cape: t.instance({
            ident: "cape",
            steps: 1024,
            default: [
                [0, [110, 110, 110, 255]],
                [350, [110, 110, 110, 255]],
                [400, [93, 95, 127, 255]],
                [500, [37, 98, 145, 255]],
                [800, [37, 165, 37, 255]],
                [1500, [163, 161, 55, 255]],
                [2e3, [155, 112, 63, 255]],
                [2500, [162, 55, 55, 255]],
                [5001, [151, 68, 151, 255]]
            ]
        }),
        lightDensity: t.instance({
            ident: "lightDensity",
            steps: 2048,
            default: [
                [0, [136, 136, 136, 255]],
                [.015, [136, 136, 136, 255]],
                [.025, [136, 200, 0, 255]],
                [.1, [218, 218, 0, 255]],
                [1, [241, 95, 0, 255]],
                [2, [248, 78, 120, 255]],
                [4, [135, 0, 0, 255]],
                [15, [221, 101, 255, 255]]
            ]
        }),
        cbase: t.instance({
            ident: "cbase",
            steps: 512,
            default: [
                [0, [166, 93, 165, 255]],
                [129, [162, 97, 160, 255]],
                [149, [167, 91, 91, 255]],
                [279, [167, 91, 91, 255]],
                [299, [98, 122, 160, 255]],
                [879, [98, 122, 160, 255]],
                [914, [90, 169, 90, 255]],
                [1499, [91, 167, 99, 255]],
                [7999, [119, 141, 120, 255]]
            ]
        }),
        snow: t.instance({
            ident: "snow",
            steps: 2048,
            default: [
                [0, [97, 97, 97, 255]],
                [2, [69, 82, 152, 255]],
                [10, [65, 165, 167, 255]],
                [20, [65, 141, 65, 255]],
                [50, [168, 168, 65, 255]],
                [80, [170, 126, 63, 255]],
                [120, [167, 65, 65, 255]],
                [500, [168, 65, 168, 255]]
            ]
        }),
        rainAccu: t.instance({
            ident: "rainAccu",
            steps: 12e3,
            default: [
                [0, [89, 89, 89, 255]],
                [1, [90, 88, 101, 255]],
                [5, [97, 88, 132, 255]],
                [10, [52, 117, 142, 255]],
                [30, [11, 140, 129, 255]],
                [40, [92, 153, 100, 255]],
                [80, [159, 157, 84, 255]],
                [120, [211, 154, 120, 255]],
                [500, [250, 157, 190, 255]],
                [8e3, [220, 220, 220, 255]]
            ]
        }),
        waves: t.instance({
            ident: "waves",
            steps: 1024,
            default: [
                [0, [159, 185, 191, 255]],
                [.5, [48, 157, 185, 255]],
                [1, [48, 98, 141, 255]],
                [1.5, [56, 104, 191, 255]],
                [2, [57, 60, 142, 255]],
                [2.5, [187, 90, 191, 255]],
                [3, [154, 48, 151, 255]],
                [4, [133, 48, 48, 255]],
                [5, [191, 51, 95, 255]],
                [7, [191, 103, 87, 255]],
                [10, [191, 191, 191, 255]],
                [12, [154, 127, 155, 255]]
            ]
        }),
        currents: t.instance({
            ident: "currents",
            defaultKey: "seacurrents",
            steps: 256
        }),
        currentsTide: t.instance({
            ident: "currentsTide",
            defaultKey: "seacurrents_tide",
            steps: 256
        }),
        visibility: t.instance({
            ident: "visibility",
            steps: 1024,
            default: [
                [0, [163, 89, 163, 255]],
                [1600, [161, 89, 163, 255]],
                [2200, [167, 86, 86, 255]],
                [5e3, [167, 86, 86, 255]],
                [6e3, [89, 97, 163, 255]],
                [8e3, [89, 101, 163, 255]],
                [9e3, [60, 188, 73, 255]],
                [15e3, [83, 167, 75, 255]],
                [20004, [121, 121, 121, 255]]
            ]
        }),
        gtco3: t.instance({
            ident: "gtco3",
            steps: 512
        }),
        aod550: t.instance({
            ident: "aod550",
            steps: 8e3
        }),
        pm2p5: t.instance({
            ident: "pm2p5",
            steps: 4e3
        }),
        no2: t.instance({
            ident: "no2",
            steps: 4e3
        }),
        tcso2: t.instance({
            ident: "tcso2",
            steps: 4096
        }),
        go3: t.instance({
            ident: "go3",
            steps: 4096
        }),
        so2: t.instance({
            ident: "so2",
            steps: 8e3,
            default: [
                [0, [171, 171, 171, 255]],
                [.05, [170, 174, 143, 255]],
                [.1, [164, 163, 120, 255]],
                [.5, [158, 139, 74, 255]],
                [2, [151, 112, 24, 255]],
                [10, [140, 81, 0, 255]],
                [20, [132, 64, 0, 255]],
                [50, [121, 45, 0, 255]],
                [80, [102, 11, 0, 255]]
            ]
        }),
        cosc: t.instance({
            ident: "cosc",
            steps: 4e3,
            default: [
                [0, [124, 124, 124, 255]],
                [70, [124, 124, 108, 255]],
                [110, [164, 157, 72, 255]],
                [200, [136, 113, 47, 255]],
                [450, [39, 31, 31, 255]],
                [2200, [255, 22, 22, 255]]
            ]
        }),
        dust: t.instance({
            ident: "dust",
            steps: 8e3,
            default: [
                [0, [172, 172, 172, 255]],
                [1, [170, 169, 167, 255]],
                [10, [148, 137, 118, 255]],
                [80, [124, 104, 59, 255]],
                [800, [100, 73, 0, 255]],
                [1200, [74, 44, 0, 255]],
                [4e3, [32, 20, 0, 255]]
            ]
        }),
        radar: t.instance({
            ident: "radar",
            steps: 255,
            opaque: !1,
            save: !1,
            sync: !1,
            default: [
                [0, [40, 16, 158, 0]],
                [3, [40, 16, 158, 20]],
                [8, [40, 16, 158, 100]],
                [14, [0, 101, 154, 180]],
                [20, [0, 144, 147, 220]],
                [26, [0, 179, 125, 240]],
                [32, [117, 208, 89, 255]],
                [36, [220, 220, 30, 255]],
                [40, [244, 202, 8, 255]],
                [44, [245, 168, 24, 255]],
                [48, [236, 130, 63, 255]],
                [52, [205, 75, 75, 255]],
                [56, [182, 45, 100, 255]],
                [60, [156, 16, 109, 255]],
                [64, [125, 0, 108, 255]],
                [68, [92, 0, 100, 255]],
                [100, [0, 0, 0, 255]],
                [101, [0, 0, 0, 0]],
                [255, [0, 0, 0, 0]]
            ]
        }),
        blitz: t.instance({
            ident: "blitz",
            steps: 288,
            opaque: !1,
            save: !1,
            sync: !1,
            default: [
                [0, [12, 0, 0, 240]],
                [.05, [48, 0, 0, 240]],
                [.1, [100, 20, 0, 240]],
                [.5, [130, 70, 0, 220]],
                [1, [140, 130, 20, 200]]
            ]
        }),
        satellite: t.instance({
            ident: "satellite",
            steps: 256,
            opaque: !1,
            default: [
                [0, [24, 24, 24, 255]],
                [149, [240, 240, 240, 255]],
                [150, [64, 64, 163, 255]],
                [159, [70, 106, 227, 255]],
                [168, [41, 187, 236, 255]],
                [177, [49, 241, 153, 255]],
                [186, [163, 253, 61, 255]],
                [195, [237, 208, 59, 255]],
                [205, [251, 128, 34, 255]],
                [214, [210, 49, 4, 255]],
                [223, [122, 4, 3, 255]],
                [256, [48, 0, 0, 255]]
            ]
        }),
        fog: t.instance({
            ident: "fog",
            steps: 512,
            default: [
                [0, [110, 110, 110, 255]],
                [1, [200, 200, 200, 255]],
                [2, [200, 200, 255, 255]]
            ]
        }),
        justGray: t.instance({
            ident: "justGray",
            steps: 4,
            default: [
                [-2e4, [111, 111, 111, 255]],
                [2e4, [111, 111, 111, 255]]
            ]
        }),
        efiWind: t.instance({
            ident: "efiWind",
            steps: 256,
            defaultKey: "wsi"
        }),
        efiTemp: t.instance({
            ident: "efiTemp",
            steps: 256,
            defaultKey: "ti"
        }),
        efiRain: t.instance({
            ident: "efiRain",
            steps: 256,
            defaultKey: "tpi"
        }),
        fires: t.instance({
            ident: "fires",
            steps: 8e3,
            defaultKey: "frpfire"
        }),
        awd_0_40: t.instance({
            ident: "awd_0_40",
            steps: 8e3
        }),
        awd_0_100: t.instance({
            ident: "awd_0_100",
            steps: 8e3
        }),
        awp_0_40: t.instance({
            ident: "awp_0_40",
            steps: 8e3
        }),
        awp_0_100: t.instance({
            ident: "awp_0_100",
            steps: 8e3
        }),
        awr_0_40: t.instance({
            ident: "awr_0_40",
            steps: 8e3
        }),
        awr_0_100: t.instance({
            ident: "awr_0_100",
            steps: 8e3
        })
    };
    e.default = n
})), W.define("geolocation", ["rootScope", "utils", "http", "store", "broadcast", "router", "showableErrorsService"], (function(e, t, n, i, o, r, a, s) {
    function l(e, t, n) {
        return t in e ? Object.defineProperty(e, t, {
            value: n,
            enumerable: !0,
            configurable: !0,
            writable: !0
        }) : e[t] = n, e
    }
    var c = function() {
            var e = o.get("ipLocation"),
                t = o.get("gpsLocation");
            return e && t ? e.ts > t.ts ? e : t : t || (e || {
                lat: 0,
                lon: -1 * (new Date).getTimezoneOffset() / 4,
                cc: "us",
                source: "fallback",
                zoom: 3,
                name: "",
                ts: Date.now()
            })
        },
        d = function(e) {
            void 0 === e && (e = {
                enableHighAccuracy: "android" === t.platform,
                timeout: 7e3
            });
            var n = function(e, t) {
                    var n = {
                        lat: t.coords.latitude,
                        lon: t.coords.longitude,
                        source: "gps",
                        ts: Date.now()
                    };
                    o.set("gpsLocation", n), r.emit("newLocation", n), e(n)
                },
                i = function(e, n) {
                    var i = {
                        errorId: "location disabled" === n.message && "android" === t.platform ? "LOC_1" : "LOC_2",
                        category: "location"
                    };
                    s.add(i), e(c())
                },
                a = null;
            return a ? new Promise((function(t) {
                a.getCurrentPosition(e).then(n.bind(null, t)).catch(i.bind(null, t))
            })) : navigator.geolocation ? new Promise((function(t) {
                navigator.geolocation.getCurrentPosition(n.bind(null, t), i.bind(null, t), e)
            })) : Promise.resolve(c())
        },
        u = function(e, t) {
            return parseFloat(e).toFixed(2) + ", " + parseFloat(t).toFixed(2)
        },
        h = function(e, t, n, i, a) {
            n && (n = n.toLowerCase(), o.set("country", n));
            var s = {
                ts: Date.now(),
                source: a,
                lat: parseFloat(e),
                lon: parseFloat(t),
                name: i || u(e, t)
            };
            o.set("ipLocation", s), r.emit("newLocation", s)
        };
    try {
        var p, f = n.$('meta[name="geoip"]');
        if (f && f.content && (p = f.content.split(","))) {
            var m = p[1],
                v = p[2],
                g = p[3],
                w = p[4];
            h(m, v, g, w, "meta")
        } else i.get("/node/umisteni").then((function(e) {
            var t = e.data;
            t && t.ll && t.ll.length && h(t.ll[0], t.ll[1], t.country, t.city, "api")
        })).catch((function(e) {
            window.wError("geolocation", "Unable to load/parse geoloc JSON", e)
        }))
    } catch (e) {
        window.wError("geolocation", "Module initialization failed", e)
    }
    e.getFallbackName = u, e.getGPSlocation = d, e.getHomeLocation = function(e) {
        var t = o.get("startUp"),
            i = Date.now(),
            a = o.get("homeLocation");
        if ("last" === t) {
            var s = o.get("startUpLastPosition");
            if (s) return void e(function(e) {
                for (var t = arguments, n = 1; n < arguments.length; n++) {
                    var i = null != t[n] ? t[n] : {},
                        o = Object.keys(i);
                    "function" == typeof Object.getOwnPropertySymbols && (o = o.concat(Object.getOwnPropertySymbols(i).filter((function(e) {
                        return Object.getOwnPropertyDescriptor(i, e).enumerable
                    })))), o.forEach((function(t) {
                        l(e, t, i[t])
                    }))
                }
                return e
            }({}, s, {
                ts: i,
                source: "last"
            }))
        }
        if ("location" === t && a) e(a);
        else if ("ip" === t) {
            var u = c();
            "fallback" === u.source || i - u.ts > 12 * n.tsHour ? r.once("newLocation", e) : e(u)
        } else {
            var h = o.get("gpsLocation");
            h && "gps" === h.source && i - h.ts < 9e5 ? e(h) : d().then(e)
        }
    }, e.getMyLatestPos = c
})), W.define("params", ["utils", "store", "models", "overlays", "broadcast", "products", "subscription", "router", "renderCtrl"], (function(e, t, n, i, o, r, a, s, l, c) {
    function d(e) {
        var t = n.get("overlay"),
            i = {
                overlay: t,
                hasMoreLevels: o[t].hasMoreLevels,
                acTime: n.get("acTime"),
                level: n.get("level"),
                isolines: n.get("isolines"),
                path: n.get("path"),
                product: n.get("product")
            };
        r.emit("paramsChanged", i, e)
    }
    var u = t.debounce(d, 100);

    function h() {
        ["acTime", "level", "isolines", "path", "overlay", "product"].forEach((function(e) {
            n.on(e, u.bind(null, e))
        }))
    }
    var p = a.ecmwf.calendar;
    n.setDefault("calendar", p), n.setDefault("path", p.ts2path(Date.now())), n.defineProperty("timestamp", "syncSet", (function(e) {
        "string" == typeof e && (e = parseInt(e));
        var t = n.get("calendar");
        return t && (e = t.boundTs(e), n.set("path", t.ts2path(e))), e
    })), n.defineProperty("product", "asyncSet", (function(e) {
        return new Promise((function(i, o) {
            var r = a[e];
            a[n.get("product")].close(), r.open().then((function(o) {
                t.replaceClass(/product-\S+/, "product-" + e), o && (n.set("calendar", o), n.set("timestamp", t.bound(n.get("timestamp"), o.start, o.end), {
                    forceChange: !0
                })), r.levels && (n.set("availLevels", r.levels), r.levels.includes(n.get("level")) || n.set("level", "surface")), r.acTimes && (n.set("availAcTimes", r.acTimes), !r.acTimes.includes(n.get("acTime")) && r.acTimes.length > 0 && n.set("acTime", r.acTimes[0])), n.set("prefferedProduct", r.prefferedProduct), i(e)
            })).catch(o)
        }))
    }));
    var f = function(e, r) {
        var a = o[e],
            s = o[r];
        t.replaceClass(/overlay-\S+/, "overlay-" + e), t.toggleClass(document.body, Boolean(a && a.hasMoreLevels), "has-more-levels"), t.toggleClass(document.body, Boolean(a && a.hideParticles), "hide-particles"), n.set("availProducts", i.overlay2product[e]), s && s.onclose && s.onclose.call(s), a && a.onopen && a.onopen()
    };
    n.defineProperty("overlay", "asyncSet", (function(e) {
        var t = n.get("overlay"),
            o = i.getProduct(e, n.get("product"));
        return o === n.get("product") ? (f(e, t), Promise.resolve(e)) : new Promise((function(i) {
            n.set("product", o).then((function() {
                f(e, t), i(e)
            }))
        }))
    })), h()
})), W.define("connection", ["broadcast", "Window"], (function(e, t, n) {
    var i = n.Window,
        o = !0,
        r = !1,
        a = null;

    function s(e) {
        var t = new XMLHttpRequest;
        t.open("HEAD", "https://node.windy.com/node/connection", !0), t.onreadystatechange = function() {
            4 === t.readyState && e(t.status >= 200 && t.status < 400)
        };
        try {
            t.send(null)
        } catch (t) {
            e(!1)
        }
    }

    function l(e) {
        e ? (o = !0, a && a.close(), setTimeout((function() {
            a = new i({
                ident: "message",
                className: "bg-ok",
                html: '<span data-t="MSG_ONLINE_APP"></span>',
                timeout: 1e4,
                onopen: function() {
                    this.node.onclick = function() {
                        return window.location.reload()
                    }
                }
            }).open(), t.emit("connectionRestored")
        }), 500)) : setTimeout(s.bind(null, l), 2e3)
    }
    t.on("noConnection", (function() {
        o && !r && (r = !0, s((function(e) {
            r = !1, e || (o = !1, a && a.close(), a = new i({
                ident: "message",
                className: "bg-error",
                html: '<span data-t="MSG_OFFLINE"></span>'
            }).open(), s(l))
        })))
    })), window.addEventListener("offline", (function() {
        t.emit("noConnection", "window")
    }));
    e.default = function() {
        return o
    }
})), W.define("ogTags", ["utils"], (function(e, t) {
    var n = t.each,
        i = t.$,
        o = document.head,
        r = {
            title: i('meta[property="og:title"]', o),
            description: i('meta[property="og:description"]', o),
            url: i('meta[property="og:url"]', o),
            type: i('meta[property="og:type"]', o),
            image: i('meta[property="og:image"]', o),
            imageWidth: i('meta[property="og:image:width"]', o),
            imageHeight: i('meta[property="og:image:height"]', o),
            published: i('meta[property="article:published_time"]', o)
        },
        a = {
            title: i('meta[name="twitter:title"]', o),
            description: i('meta[name="twitter:description"]', o),
            url: i('meta[name="twitter:url"]', o),
            image: i('meta[name="twitter:image"]', o)
        },
        s = {},
        l = {},
        c = function(e, t) {
            e && (e.content = String(t) || "")
        };
    e.restore = function() {
        n(l, (function(e, t) {
            c(r[t], e)
        })), n(s, (function(e, t) {
            c(a[t], e)
        }))
    }, e.save = function() {
        n(r, (function(e, t) {
            return e && (l[t] = e.content)
        })), n(a, (function(e, t) {
            return e && (s[t] = e.content)
        }))
    }, e.set = function(e) {
        n(e, (function(e, t) {
            c(r[t], e), c(a[t], e)
        }))
    }
})), W.define("deviceLogging", ["http", "rootScope", "storage", "utils", "device", "store"], (function(e, t, n, i, o, r, a) {
    var s = function(e) {
        return t.put("/users/v3/devices/" + e.deviceID, {
            data: e
        }).then((function() {
            e.updated = Date.now(), i.put("lastSentDevice", e)
        })).catch((function(e) {
            window.wError("devices", "Cannot save the device", e)
        }))
    };
    e.deactivateCurrentDevice = function() {
        var e = i.get("lastSentDevice");
        return e ? (e.deactivated = !0, s(e).then((function() {
            i.remove("lastSentDevice")
        }))) : Promise.resolve()
    }, e.saveCurrentDevice = function(e) {
        if (a.get("user")) {
            var t = {
                deviceID: r.getDeviceID(),
                platform: n.platform,
                target: n.target,
                version: n.version
            };
            window && window.screen && (t.screen = {
                width: window.screen.width,
                height: window.screen.height,
                devicePixelRatio: window.devicePixelRatio
            }), "mobile" === n.target && e && (t.registrationHash = e, t.notifPluginVersion = "Capacitor" in window ? 2 : 1);
            var l = i.get("lastSentDevice");
            (!l || l.deactivated || t.deviceID !== l.deviceID || l.updated && l.updated + 24 * o.tsHour < Date.now() || t.notifPluginVersion && t.notifPluginVersion !== l.notifPluginVersion || t.registrationHash && t.registrationHash !== l.registrationHash) && s(t)
        }
    }
})), W.define("notifications", ["utils", "http", "favs", "Evented", "store"], (function(e, t, n, i, o, r) {
    var a = t.getNativePlugin("PushNotifications"),
        s = t.getNativePlugin("LocalNotifications"),
        l = o.instance({
            ident: "notifService",
            data: {},
            eventSource: null,
            canRecieveNotif: !1,
            _init: function() {
                var e = this;
                o._init.call(this);
                var t = function() {
                    return i.getArray().filter((function(e) {
                        return "alert" === e.type
                    })).length > 0
                };
                t() ? r.get("user") ? this.watchChanges() : r.once("user", this.watchChanges, this) : i.on("favsChanged", (function() {
                    return t() && e.watchChanges()
                }))
            },
            clean: function() {
                this.eventSource && (this.eventSource.close(), this.eventSource = null)
            },
            watchChanges: function() {
                var e = this;
                this.canRecieveNotif = !0, this.emit("canRecieveNotif"), this.eventSource = n.createEventSource("/notif/v1/notifications/stream"), null !== this.eventSource && this.eventSource.addEventListener("notifications-update", (function(t) {
                    var n = JSON.parse(t.data);
                    e.updateInfo(n), e.markNotificationsAsReceived()
                }))
            },
            loadNotificationList: function(e, t) {
                var i = this,
                    o = {
                        current: e,
                        pageSize: t
                    };
                return 1 === e && (o.markAsViewed = !0), n.get("/notif/v1/notifications", {
                    cache: !1,
                    qs: o
                }).then((function(e) {
                    var t = e.data;
                    return i.updateInfo(t), t
                })).catch((function(e) {
                    window.wError("notifications", "Error loading notifications", e)
                }))
            },
            markAlertAsSeen: function(e) {
                return n.put("/notif/v1/notifications/" + e + "/alert")
            },
            markNotificationAsSeen: function(e) {
                return n.put("/notif/v1/notifications/" + e)
            },
            markNotificationsAsReceived: function() {
                return n.put("/notif/v1/notifications", {
                    qs: {
                        status: "received"
                    }
                }).catch((function(e) {
                    window.wError("notifications", "Error marking notifications", e)
                }))
            },
            deleteAllNotifications: function() {
                return n.del("/notif/v1/notifications/")
            },
            markAllAsSeen: function() {
                this.data.newCount = 0, r.set("badgeNumber", 0), a && a.removeAllDeliveredNotifications(), s && s.getPending().then((function(e) {
                    if (e && e.notifications && e.notifications.length) return s.cancel(e)
                }))
            },
            updateInfo: function(e) {
                var t = e.totalCount,
                    n = e.newCount;
                this.data = {
                    totalCount: t,
                    newCount: n
                }, r.set("badgeNumber", n)
            }
        });
    e.default = l
})), W.define("showableErrorsService", ["utils", "store", "favs"], (function(e, t, n, i) {
    var o = null,
        r = function(e, t) {
            return t.filter((function(t) {
                return t.errorId !== e
            }))
        },
        a = function() {
            var e = t.$("#menuErrorBangeContainer");
            e && (n.get("unresolvedErrors").length > 0 ? e.style.display = "block" : e.style.display = "none")
        },
        s = function(e) {},
        l = function(e) {
            var t = n.get("unresolvedErrors");
            t = r(e, t), n.set("unresolvedErrors", t, {
                forceChange: !0
            }), a()
        };

    function c(e) {
        switch (e.category) {
            case "location":
                "LOC_1" === e.errorId ? function(e) {
                    if (!o) return;
                    o.isGpsEnabled().then((function(t) {
                        t && "authorized" === t.status && l(e.errorId)
                    }), (function(e) {
                        window.wError("ShowableErrorsService", "ShowableErrorsService checkLocationServices error", e)
                    }))
                }(e) : function(e) {
                    if (!o) return;
                    o.getLocationPermnissions().then((function(t) {
                        t && "authorized" === t.status && l(e.errorId)
                    }), (function(e) {
                        window.wError("ShowableErrorsService", "ShowableErrorsService checkLocationServices error", e)
                    }))
                }(e);
                break;
            case "notification":
                ! function(e) {
                    if (!o) return;
                    o.getNotificationPermnissions().then((function(t) {
                        t && "authorized" === t.status && l(e.errorId)
                    }), (function(e) {
                        window.wError("ShowableErrorsService", "ShowableErrorsService chechNotificationSercices error", e)
                    }))
                }(e);
                break;
            case "iCloud":
                i.emit("favsChanged");
                break;
            case "battery":
                ! function(e) {
                    if (!o) return;
                    o.getBatteryUsagePermissions().then((function(t) {
                        t && "authorized" === t.status && l(e.errorId)
                    }), (function(e) {
                        window.wError("ShowableErrorsService", "ShowableErrorsService checkBatteryServices error", e)
                    }))
                }(e)
        }
    } [{
        errorId: "BATTERY_1",
        category: "battery"
    }].forEach(s);
    var d = {
        add: s,
        close: function(e) {
            var t = n.get("unresolvedErrors"),
                i = n.get("closedErrors");
            t = r(e, t), i.push(e), n.set("unresolvedErrors", t, {
                forceChange: !0
            }), n.set("closedErrors", i, {
                forceChange: !0
            }), a()
        },
        resolve: l,
        resolveCategory: function(e) {
            var t = n.get("unresolvedErrors");
            t = t.filter((function(t) {
                return t.category !== e
            })), n.set("unresolvedErrors", t, {
                forceChange: !0
            }), a()
        },
        getUnresolvedErrors: function() {
            return n.get("unresolvedErrors")
        },
        checkError: c
    };
    e.default = d
})), W.define("Plugin", ["rootScope", "utils", "trans"], (function(e, t, n, i) {
    var o = i.loadLangFile,
        r = function(e) {
            var t, n, i, o;
            this.initProperties(), this.dependencies = null !== (t = e.dependencies) && void 0 !== t ? t : this.dependencies, this.exclusive = e.exclusive, this.ident = e.ident, this.langFiles = e.langFiles, this.location = e.location, this.close = null !== (n = e.close) && void 0 !== n ? n : this.close, this.paramsChanged = null !== (i = e.paramsChanged) && void 0 !== i ? i : this.paramsChanged, this.redraw = null !== (o = e.redraw) && void 0 !== o ? o : this.redraw
        };
    r.prototype.getAssetsLocation = function() {
        return this.location ? "http" === this.location.substr(0, 4) ? this.location : n.joinPath("https://www.windy.com/js", this.location) : t.assets + "/plugins/" + this.ident + ".js"
    }, r.prototype.load = function() {
        var e, t = this;
        if (this.isLoaded) return Promise.resolve(!0);
        if (this.loading) return this.promise || Promise.resolve(!0);
        this.loading = !0;
        var i = this.dependencies.map((function(t) {
            var n;
            return null !== (e = null === (n = W.plugins[t]) || void 0 === n ? void 0 : n.load()) && void 0 !== e ? e : Promise.reject()
        }));
        return this.langFiles && i.push.apply(i, this.langFiles.map((function(e) {
            return o(e)
        }))), Promise.all(i).then((function() {
            if (!t.coreLoaded) return n.loadScript(t.getAssetsLocation()).then((function() {
                t.coreLoaded = !0
            }))
        })).then((function() {
            t.isLoaded = !0, t.loading = !1
        })).catch((function(e) {
            throw t.loading = !1, window.wError("plugin", "Failed to load/resolve dependencies: " + t.ident, e), e
        }))
    }, r.prototype.open = function() {
        for (var e = [], t = arguments.length; t--;) e[t] = arguments[t];
        return this.promise = this.load(), this.promise
    }, r.prototype.close = function() {}, r.prototype.redraw = function() {}, r.prototype.paramsChanged = function() {}, r.prototype.initProperties = function() {
        this.loading = !1, this.isLoaded = !1, this.coreLoaded = !1, this.dependencies = []
    }, r.iAm = "plugin", e.Plugin = r
})), W.define("WindowPlugin", ["Plugin", "Window", "trans", "BottomSlide", "utils", "broadcast", "rootScope"], (function(e, t, n, i, o, r, a, s) {
    var l = r.$,
        c = i.t,
        d = n.Window,
        u = function(e) {
            function t(t) {
                var n, i, o, r, a, s, l, c, d;
                e.call(this, t), this.unmountOnClose = null !== (n = t.unmountOnClose) && void 0 !== n ? n : this.unmountOnClose, this.hasURL = null !== (i = t.hasURL) && void 0 !== i ? i : this.hasURL, this.title = t.title, this.addMobileSlider = null !== (o = t.addMobileSlider) && void 0 !== o ? o : this.addMobileSlider, this.closeOnSwipeDown = null !== (r = t.closeOnSwipeDown) && void 0 !== r ? r : this.closeOnSwipeDown, this.noCloseOnBackButton = t.noCloseOnBackButton, this.hook = t.hook, this.interpolator = t.interpolator, this.close = null !== (a = t.close) && void 0 !== a ? a : this.close, this.onurl = null !== (s = t.onurl) && void 0 !== s ? s : this.onurl, this.onopen = null !== (l = t.onopen) && void 0 !== l ? l : this.onopen, this.onclose = null !== (c = t.onclose) && void 0 !== c ? c : this.onclose, this.onclosed = null !== (d = t.onclosed) && void 0 !== d ? d : this.onclosed, this.window = this.createWindow(t)
            }
            e && (t.__proto__ = e), t.prototype = Object.create(e && e.prototype), t.prototype.constructor = t;
            var n = {
                refs: {
                    configurable: !0
                },
                node: {
                    configurable: !0
                },
                domEl: {
                    configurable: !0
                }
            };
            return t.prototype.open = function(e, t) {
                var n = this,
                    i = function() {
                        n.isMounted || n.mount(), n.window.open(), n.onopen(e, t), n.hasURL && n.url(e, t)
                    };
                return this.isLoaded ? (i(), Promise.resolve()) : (this.loading && this.promise || (this.promise = this.load(), this.promise.then(i)), this.promise)
            }, t.prototype.close = function(e) {
                this.window.close(e)
            }, t.prototype.onurl = function(e, t) {
                return {
                    url: this.ident,
                    title: this.title && this.title in c ? c[this.title] : this.title || null
                }
            }, t.prototype.onopen = function() {
                for (var e = [], t = arguments.length; t--;) e[t] = arguments[t]
            }, t.prototype.onclose = function() {
                for (var e = [], t = arguments.length; t--;) e[t] = arguments[t]
            }, t.prototype.onclosed = function() {
                for (var e = [], t = arguments.length; t--;) e[t] = arguments[t]
            }, n.refs.get = function() {
                return this.window.refs
            }, n.refs.set = function(e) {
                this.window.refs = e
            }, n.node.get = function() {
                return this.window.node
            }, n.node.set = function(e) {
                this.window.node = e
            }, n.domEl.get = function() {
                return this.window.domEl
            }, n.domEl.set = function(e) {
                this.window.domEl = e
            }, t.prototype.initProperties = function() {
                e.prototype.initProperties.call(this), this.unmountOnClose = !1, this.hasURL = !0, this.addMobileSlider = !1, this.closeOnSwipeDown = !0, this.isMounted = !1, this.cssInserted = !1
            }, t.prototype.unmount = function() {
                var e;
                this.node && (this.unmountOnClose ? (null === (e = this.node.parentNode) || void 0 === e || e.removeChild(this.node), this.isMounted = !1) : this.node.style.display = "none")
            }, t.prototype.prepareMount = function() {
                var e = "@plugins/" + this.ident,
                    t = W.modules[e];
                if (t) return t.css && !this.cssInserted && (this.cssInserted = !0, document.head.insertAdjacentHTML("beforeend", "<style>" + t.css + "</style>")), t.wasLoaded = !1, this.window.html = t.html || "", this.window.mount(), {
                    module: t,
                    id: e
                };
                window.wError("Tag/WindowPlugin", "Error, module: " + e + " was not registered")
            }, t.prototype.mount = function() {
                var e = this.prepareMount() || {},
                    t = e.module,
                    n = e.id;
                t && n && (t.callback && "function" == typeof t.callback && W.require(n, this), this.isMounted = !0, this.onmounted())
            }, t.prototype.onmounted = function() {
                this.addMobileSlider && s.isMobile && this.node && (this.node.insertAdjacentHTML("beforeend", '<div class="sliding-x"></div>'), o.instance({
                    el: l(".sliding-x", this.node),
                    pluginEl: this.node,
                    pluginName: this.ident,
                    closeOnSwipeDown: this.closeOnSwipeDown
                }))
            }, t.prototype.url = function(e, t) {
                Promise.resolve(this.onurl(e, t)).then((function(e) {
                    W.location.setUrl(e.url, e.visibleUrl, e.search), e.title && W.location.setTitle(e.title)
                }))
            }, t.prototype.onWindowOpen = function() {
                var e = this;
                this.isOpen = !0, setTimeout((function() {
                    a.emit("pluginOpened", e.ident)
                }), 50)
            }, t.prototype.onWindowClose = function() {
                this.hasURL && W.location.reset && W.location.reset(), this.onclose(), this.isOpen = !1
            }, t.prototype.onWindowClosed = function() {
                this.onclosed(), this.unmount(), a.emit("pluginClosed", this.ident)
            }, t.prototype.createWindow = function(t) {
                return new d({
                    bodyClass: "on" + this.ident,
                    ident: t.ident,
                    keyboard: t.keyboard,
                    className: t.className,
                    replaceMountingPoint: t.replaceMountingPoint,
                    unmountOnClose: this.unmountOnClose,
                    attachPoint: t.attachPoint,
                    htmlID: t.htmlID || e.iAm + "-" + this.ident,
                    closeOnClick: t.closeOnClick,
                    displayBlock: t.displayBlock,
                    html: "",
                    onopen: this.onWindowOpen.bind(this),
                    onclose: this.onWindowClose.bind(this),
                    onclosed: this.onWindowClosed.bind(this)
                })
            }, Object.defineProperties(t.prototype, n), t
        }(t.Plugin);
    e.WindowPlugin = u
})), W.define("TagPlugin", ["WindowPlugin"], (function(e, t) {
    var n = function(e) {
        function t() {
            e.apply(this, arguments)
        }
        return e && (t.__proto__ = e), t.prototype = Object.create(e && e.prototype), t.prototype.constructor = t, t
    }(t.WindowPlugin);
    e.TagPlugin = n
})), W.define("AutoOpenPlugin", ["WindowPlugin"], (function(e, t) {
    var n = function(e) {
        function t() {
            e.apply(this, arguments)
        }
        return e && (t.__proto__ = e), t.prototype = Object.create(e && e.prototype), t.prototype.constructor = t, t.prototype.load = function() {
            return this.promise = e.prototype.load.call(this), this.promise.then(this.open.bind(this)), this.promise
        }, t.prototype.initProperties = function() {
            e.prototype.initProperties.call(this), this.hasURL = !1
        }, t
    }(t.WindowPlugin);
    e.AutoOpenPlugin = n
})), W.define("SveltePlugin", ["WindowPlugin", "utils"], (function(e, t, n) {
    var i = n.$,
        o = function(e) {
            function t(t) {
                var n;
                e.call(this, t), this.beforeOpen = null !== (n = t.beforeOpen) && void 0 !== n ? n : this.beforeOpen
            }
            return e && (t.__proto__ = e), t.prototype = Object.create(e && e.prototype), t.prototype.constructor = t, t.prototype.beforeOpen = function(e, t) {}, t.prototype.open = function(t, n) {
                return this.beforeOpen(t, n), e.prototype.open.call(this, t, n)
            }, t.prototype.onopen = function() {
                for (var t = [], n = arguments.length; n--;) t[n] = arguments[n];
                return this.svelteApp && this.svelteApp.onopen ? this.svelteApp.onopen.apply(this, t) : e.prototype.onopen.call(this, t)
            }, t.prototype.onclose = function() {
                for (var t = [], n = arguments.length; n--;) t[n] = arguments[n];
                return this.svelteApp && this.svelteApp.onclose ? this.svelteApp.onclose.apply(this, t) : e.prototype.onclose.call(this, t)
            }, t.prototype.onurl = function() {
                for (var t = [], n = arguments.length; n--;) t[n] = arguments[n];
                return this.svelteApp && this.svelteApp.onurl ? this.svelteApp.onurl.apply(this, t) : e.prototype.onurl.call(this, t)
            }, t.prototype.initProperties = function() {
                e.prototype.initProperties.call(this), this.unmountOnClose = !0
            }, t.prototype.mount = function() {
                var e = (this.prepareMount() || {}).id;
                if (e) {
                    var t = this.node,
                        n = i(".closing-x", this.node);
                    if (!t || !n) throw new Error("Cannot mount Svelte plugin " + this.ident + ", target element does not exist or does not contain closing element!");
                    var o = W.require(e, this);
                    this.svelteApp = new o({
                        target: t,
                        anchor: n
                    }), this.isMounted = !0, this.onmounted()
                }
            }, t.prototype.unmount = function() {
                var e;
                this.node && (this.unmountOnClose && this.svelteApp ? (this.svelteApp.$destroy(), null === (e = this.node.parentNode) || void 0 === e || e.removeChild(this.node), this.isMounted = !1, this.svelteApp = null) : this.node.style.display = "none")
            }, t
        }(t.WindowPlugin);
    e.SveltePlugin = o
})), W.define("plugins", ["rootScope", "Plugin", "TagPlugin", "AutoOpenPlugin", "SveltePlugin", "urls", "http", "broadcast"], (function(e, t, n, i, o, r, a, s, l) {
    var c = r.SveltePlugin,
        d = o.AutoOpenPlugin,
        u = i.TagPlugin,
        h = n.Plugin,
        p = {
            geodesic: new h({
                ident: "geodesic",
                location: "geodesic110.js"
            }),
            d3: new h({
                ident: "d3",
                location: "d3.v0507.custom01.js"
            }),
            colorpicker: new h({
                ident: "colorpicker",
                location: "colorpicker.js"
            }),
            graticule: new h({
                ident: "graticule",
                location: "graticule20.js"
            }),
            "fastspring-builder": new h({
                ident: "fastspring-builder",
                location: "fastspring-builder.js"
            }),
            nouislider: new d({
                ident: "nouislider",
                location: "nouislider.v0805.js"
            }),
            airgram: new h({
                ident: "airgram"
            }),
            "gl-particles": new h({
                ident: "gl-particles"
            }),
            gestures: new d({
                ident: "gestures"
            }),
            particles: new h({
                ident: "particles"
            }),
            "store-settings": new h({
                ident: "store-settings"
            }),
            "detail-render": new h({
                ident: "detail-render"
            }),
            patternator: new h({
                ident: "patternator"
            }),
            "gl-tile-render": new h({
                ident: "gl-tile-render"
            }),
            "cap-utils": new h({
                ident: "cap-utils"
            }),
            seo: new h({
                ident: "seo"
            }),
            nearest: new h({
                ident: "nearest"
            }),
            "plugin-data-loader": new h({
                ident: "plugin-data-loader"
            }),
            flatpickr: new d({
                ident: "flatpickr"
            }),
            fullscreen: new h({
                ident: "fullscreen"
            }),
            notifications: new h({
                ident: "notifications"
            }),
            "subscription-services": new h({
                ident: "subscription-services",
                langFiles: ["subscription"]
            }),
            isolines: new u({
                ident: "isolines",
                hasURL: !1
            }),
            patch: new d({
                ident: "patch",
                location: "https://www.windy.com/patch/lib/latest/patch.js?refTime=" + (new Date).toISOString().replace(/^(.*):.*$/, "$1"),
                hasURL: !1
            }),
            "gl-lib": new d({
                ident: "gl-lib",
                hasURL: !1
            }),
            lightnings: new d({
                ident: "lightnings",
                hasURL: !1
            }),
            "radar-sat": new d({
                ident: "radar-sat",
                hasURL: !1
            }),
            radar: new u({
                ident: "radar",
                title: "RADAR",
                hasURL: !1,
                exclusive: "neverClose",
                className: "shy left-border right-border notap",
                dependencies: ["gl-lib", "radar-sat", "lightnings"],
                noCloseOnBackButton: !0
            }),
            satellite: new u({
                ident: "satellite",
                title: "SATELLITE",
                hasURL: !1,
                exclusive: "neverClose",
                className: "shy left-border right-border notap",
                dependencies: ["gl-lib", "radar-sat", "lightnings"],
                noCloseOnBackButton: !0
            }),
            globe: new u({
                ident: "globe",
                title: "GLOBE",
                hasURL: !1,
                exclusive: "neverClose",
                className: "shy left-border right-border notap",
                dependencies: ["gl-lib", "cap-utils"],
                noCloseOnBackButton: !0
            }),
            "cap-alerts": new u({
                ident: "cap-alerts",
                exclusive: "neverClose",
                hasURL: !1,
                dependencies: ["cap-utils"],
                className: "shy left-border right-border bottom-border"
            }),
            "day-switcher": new u({
                ident: "day-switcher",
                exclusive: "neverClose",
                hasURL: !1,
                className: "shy left-border right-border bottom-border flex-container"
            }),
            "map-layers": new u({
                ident: "map-layers",
                exclusive: "neverClose",
                hasURL: !1,
                dependencies: t.isMobileOrTablet ? [] : ["rhpane"],
                className: "shy left-border bottom-border rounded-box bg-transparent fg-yellow"
            }),
            "share-mobile": new u({
                ident: "share-mobile",
                hasURL: !1
            }),
            overlays: new u({
                title: "S_ADD_OVERLAYS",
                ident: "overlays",
                className: "plugin-rhpane top-border plugin-mobile-rhpane",
                exclusive: "rhpane"
            }),
            "hp-weather": new u({
                ident: "hp-weather",
                hasURL: !1,
                replaceMountingPoint: !0,
                className: "weather-box clickable-size",
                attachPoint: '[data-plugin="weather"]'
            }),
            detail: new u({
                ident: "detail",
                keyboard: !0,
                dependencies: t.isMobileOrTablet ? ["detail-render", "nearest"] : ["rhpane", "detail-render", "nearest"],
                className: t.isMobile ? "detail plugin-mobile-bottom-red" : "detail bottom-border",
                htmlID: "detail",
                replaceMountingPoint: !0,
                hasURL: !1,
                exclusive: "all",
                attachPoint: t.isMobileOrTablet ? '[data-plugin="detail-rhpane"]' : '[data-plugin="detail"]'
            }),
            station: new u({
                ident: "station",
                exclusive: "all",
                dependencies: ["nearest"],
                className: t.isMobile ? "detail plugin-mobile-bottom-red" : "detail bottom-border bg-white",
                hasURL: !0
            }),
            "nearest-stations": new u({
                ident: "nearest-stations",
                dependencies: ["nearest"],
                className: "drop-down-window left boxshadow",
                hasURL: !1,
                unmountOnClose: !0,
                exclusive: "nearest"
            }),
            "nearest-webcams": new c({
                ident: "nearest-webcams",
                dependencies: ["nearest", "fullscreen"],
                className: "window left boxshadow normal-closing-x",
                hasURL: !1,
                langFiles: ["webcams"],
                exclusive: "nearest"
            }),
            "nearest-webcams-mobile": new c({
                ident: "nearest-webcams-mobile",
                dependencies: ["nearest"],
                className: "plugin-mobile-bottom-slide no-header auto-height dark-content",
                hasURL: !1,
                addMobileSlider: !0,
                langFiles: ["webcams"],
                exclusive: "nearest"
            }),
            rhpane: new d({
                ident: "rhpane",
                className: "right-border top-border flex-container",
                htmlID: "detail-rhpane-wrapper",
                hasURL: !1,
                displayBlock: !1,
                exclusive: "neverClose",
                replaceMountingPoint: !0,
                attachPoint: '[data-plugin="detail-rhpane"]'
            }),
            "user-menu": new c({
                ident: "user-menu",
                hasURL: !1,
                langFiles: ["notifications"],
                attachPoint: '[data-plugin="user"]'
            }),
            "fav-alert-menu": new u({
                ident: "fav-alert-menu",
                className: "drop-down-window size-l",
                hasURL: !1,
                closeOnClick: !0,
                attachPoint: '[data-plugin="fav-alert-menu"]'
            }),
            contextmenu: new u({
                ident: "contextmenu",
                className: "drop-down-window",
                closeOnClick: !0,
                hasURL: !1
            }),
            "poi-libs": new u({
                ident: "poi-libs",
                hasURL: !1
            }),
            menu: new u({
                ident: "menu",
                className: "plugin-rhpane plugin-mobile-rhpane",
                exclusive: "rhpane-mobile",
                title: "MENU"
            }),
            picker: new u({
                ident: "picker",
                hasURL: !1,
                className: "picker"
            }),
            waves: new u({
                ident: "waves",
                hasURL: !1
            }),
            wind: new u({
                ident: "wind",
                hasURL: !1
            }),
            "promo-mobile-intro": new u({
                ident: "promo-mobile-intro",
                className: "fg-white rounded-box",
                hasURL: !1
            }),
            sounding: new u({
                ident: "sounding",
                className: t.isMobile ? "window" : "drop-down-window",
                dependencies: ["d3"],
                attachPoint: t.isMobile ? "#plugins" : "#map-container .leaflet-popup-pane",
                title: "SOUNDING",
                hasURL: !1
            }),
            pois: new u({
                title: "SHOW_ON_MAP",
                ident: "pois",
                hasURL: !0,
                className: "plugin-rhpane top-border plugin-mobile-rhpane",
                exclusive: "rhpane"
            }),
            articles: new u({
                ident: "articles",
                className: t.isMobile ? "plugin-mobile-bottom-slide no-header" : "plugin-lhpane top-border",
                exclusive: "lhpane",
                addMobileSlider: !0,
                hasURL: !0
            }),
            screenshot: new u({
                ident: "screenshot",
                dependencies: ["upload"],
                hasURL: !0
            }),
            settings: new c({
                ident: "settings",
                langFiles: ["settings", "notifications"],
                hasURL: !0,
                title: "MENU_SETTINGS",
                exclusive: "lhpane",
                addMobileSlider: !0,
                className: t.isMobile ? "plugin-mobile-bottom-slide" : "plugin-lhpane top-border",
                dependencies: t.isMobileOrTablet ? [] : ["favs", "tools"]
            }),
            tools: new u({
                ident: "tools",
                hasURL: !0,
                unmountOnClose: !0,
                title: "MENU",
                exclusive: "lhpane",
                className: "plugin-lhpane top-border",
                dependencies: t.isMobileOrTablet ? [] : ["favs", "settings"]
            }),
            favs: new c({
                ident: "favs",
                langFiles: ["favs", "notifications"],
                title: "MENU_FAVS",
                hasURL: !0,
                keyboard: !0,
                exclusive: "lhpane",
                addMobileSlider: !0,
                closeOnSwipeDown: !1,
                className: t.isMobile ? "plugin-mobile-bottom-slide dark-content" : "plugin-lhpane top-border",
                dependencies: t.isMobileOrTablet ? ["gestures"] : ["gestures", "tools", "settings"]
            }),
            alerts: new c({
                ident: "alerts",
                langFiles: ["alerts", "notifications"],
                exclusive: "lhpane",
                hasURL: !1,
                keyboard: !0,
                addMobileSlider: !0,
                title: "EDIT_ALERT",
                className: t.isMobile ? "plugin-mobile-bottom-slide" : "plugin-lhpane top-border",
                dependencies: ["nouislider", "poi-libs"]
            }),
            colors: new c({
                ident: "colors",
                className: "plugin-lhpane top-border",
                exclusive: "lhpane",
                hasURL: !0,
                keyboard: !0,
                title: "S_COLORS",
                dependencies: ["colorpicker"]
            }),
            hurricanes: new c({
                ident: "hurricanes",
                langFiles: ["hurricanes"],
                exclusive: "lhpane",
                hasURL: !0,
                title: "HURR_TRACKER",
                className: t.isMobile ? "plugin-mobile-bottom-slide" : "plugin-lhpane top-border",
                addMobileSlider: !0,
                closeOnSwipeDown: !1,
                unmountOnClose: !0
            }),
            debug: new c({
                ident: "debug",
                exclusive: "lhpane",
                hasURL: !0,
                addMobileSlider: !0,
                className: t.isMobile ? "plugin-mobile-bottom-slide" : "plugin-lhpane top-border"
            }),
            info: new c({
                ident: "info",
                langFiles: ["info", "products"],
                dependencies: t.isMobileOrTablet ? [] : ["rhpane"],
                className: t.isMobile ? "plugin-mobile-bottom-slide" : "drop-down-window down",
                addMobileSlider: !0,
                hasURL: !1,
                exclusive: "middle-mobile",
                attachPoint: t.isMobileOrTablet ? "#plugins" : "#info-icon"
            }),
            "cap-alert": new c({
                ident: "cap-alert",
                dependencies: ["cap-utils", "detail-render"],
                className: t.isMobile ? "plugin-mobile-bottom-slide" : "plugin-lhpane top-border",
                addMobileSlider: !0,
                exclusive: "lhpane",
                hasURL: !1,
                title: "WX_WARNINGS"
            }),
            distance: new c({
                ident: "distance",
                title: "MENU_DISTANCE",
                exclusive: "all",
                keyboard: !1,
                hasURL: !0,
                className: "plugin-mobile-bottom-red",
                dependencies: ["geodesic"]
            }),
            animate: new c({
                ident: "animate",
                exclusive: "all",
                keyboard: !0,
                title: "Create Animation"
            }),
            airport: new u({
                ident: "airport",
                className: t.isMobile ? "plugin-mobile-bottom-slide" : "plugin-lhpane top-border",
                exclusive: t.isMobile ? "all" : "lhpane",
                hasURL: !1,
                dependencies: ["detail-render", "gestures"]
            }),
            airq: new c({
                ident: "airq",
                className: t.isMobile ? "plugin-mobile-bottom-slide" : "plugin-lhpane top-border",
                addMobileSlider: !0,
                exclusive: "lhpane",
                langFiles: ["airq"]
            }),
            radiation: new c({
                ident: "radiation",
                className: t.isMobile ? "plugin-mobile-bottom-slide" : "plugin-lhpane top-border",
                addMobileSlider: !0,
                exclusive: "lhpane",
                langFiles: ["radiation"]
            }),
            tides: new c({
                ident: "tides",
                className: t.isMobile ? "plugin-mobile-bottom-slide dark-content" : "plugin-rhpane top-border",
                addMobileSlider: !0,
                exclusive: "rhpane",
                dependencies: ["poi-libs"]
            }),
            share: new c({
                ident: "share",
                title: "SHARE",
                hasURL: !1,
                keyboard: !0,
                className: "window"
            }),
            widgets: new c({
                ident: "widgets",
                exclusive: "all",
                langFiles: ["widgets"],
                title: "EMBED",
                keyboard: !0,
                addMobileSlider: !0,
                className: t.isMobile ? "plugin-mobile-bottom-slide no-header dark-content" : "plugin-rhpane top-border"
            }),
            multimodel: new c({
                ident: "multimodel",
                dependencies: ["detail-render"],
                className: t.isMobile ? "plugin-mobile-bottom-slide" : "",
                addMobileSlider: !0
            }),
            login: new c({
                ident: "login",
                className: t.isMobile ? "plugin-mobile-bottom-slide" : "plugin-rhpane top-border",
                addMobileSlider: !0,
                exclusive: "all",
                langFiles: ["register"],
                keyboard: !0
            }),
            "article-publisher": new c({
                ident: "article-publisher",
                dependencies: ["flatpickr"],
                className: "plugin-rhpane top-border left-border",
                hasURL: !0,
                title: "Windy Article publisher",
                keyboard: !0
            }),
            rplanner: new u({
                ident: "rplanner",
                onurl: function() {
                    return {
                        url: "distance",
                        title: null
                    }
                },
                unmountOnClose: !0,
                exclusive: "all",
                dependencies: t.isMobileOrTablet ? ["geodesic"] : ["geodesic", "rhpane"],
                className: "detail bottom-border bg-white",
                hasURL: !0,
                attachPoint: t.isMobileOrTablet ? '[data-plugin="detail-rhpane"]' : '[data-plugin="rplanner"]'
            }),
            uploader: new c({
                ident: "uploader",
                className: t.isMobile ? "plugin-mobile-bottom-slide" : "plugin-lhpane top-border",
                addMobileSlider: !0,
                dependencies: ["upload"],
                exclusive: "lhpane",
                hasURL: !0,
                title: "Upload KML, GPX or geoJSON file",
                keyboard: !0
            }),
            upload: new u({
                ident: "upload",
                hasURL: !1
            }),
            subscription: new c({
                ident: "subscription",
                className: t.isMobile ? "plugin-mobile-bottom-slide no-header" : "",
                hasURL: !0,
                keyboard: !0,
                addMobileSlider: !0,
                dependencies: ["subscription-services"],
                onclosed: function() {
                    l.emit("checkPendingSubscriptions")
                }
            }),
            "pending-subscription": new c({
                ident: "pending-subscription",
                attachPoint: t.isMobileOrTablet ? "#top-messages" : "#rh-bottom-messages",
                hasURL: !1,
                langFiles: ["subscription"],
                exclusive: "neverClose"
            }),
            "delete-info": new c({
                ident: "delete-info",
                exclusive: "lhpane",
                hasURL: !0,
                keyboard: !0,
                className: t.isMobile ? "plugin-mobile-bottom-slide" : "plugin-lhpane top-border",
                addMobileSlider: !0
            }),
            webcams: new c({
                ident: "webcams",
                langFiles: ["webcams"],
                className: t.isMobile ? "plugin-mobile-bottom-slide no-header" : "plugin-lhpane top-border",
                addMobileSlider: !0,
                exclusive: "all",
                hasURL: !0,
                keyboard: !0
            }),
            "webcams-detail": new c({
                ident: "webcams-detail",
                langFiles: ["webcams"],
                dependencies: ["fullscreen"],
                className: t.isMobile ? "plugin-mobile-bottom-slide no-header dark-content" : "plugin-lhpane top-border",
                addMobileSlider: !0,
                exclusive: "all",
                hasURL: !1,
                keyboard: !0,
                beforeOpen: function(e) {
                    if (!this.isLoaded && !this.loading) {
                        var t = "object" == typeof e ? e.webcamId || e.id : e;
                        t && s.get(a.getWebcamDetail(t))
                    }
                }
            }),
            "webcams-add": new c({
                ident: "webcams-add",
                langFiles: ["webcams"],
                className: t.isMobile ? "plugin-mobile-bottom-slide" : "plugin-lhpane top-border",
                addMobileSlider: !0,
                exclusive: "all",
                hasURL: !1,
                title: "D_MISSING_CAM",
                keyboard: !0
            }),
            "webcams-edit": new c({
                ident: "webcams-edit",
                langFiles: ["webcams"],
                className: t.isMobile ? "plugin-mobile-bottom-slide" : "plugin-lhpane top-border",
                addMobileSlider: !0,
                exclusive: "all",
                hasURL: !1,
                keyboard: !0
            }),
            "webcams-remove": new c({
                ident: "webcams-remove",
                langFiles: ["webcams"],
                className: t.isMobile ? "plugin-mobile-bottom-slide" : "plugin-lhpane top-border",
                addMobileSlider: !0,
                exclusive: "all",
                hasURL: !1,
                keyboard: !0
            }),
            "webcams-embed": new c({
                ident: "webcams-embed",
                exclusive: "all",
                langFiles: ["webcams"],
                title: "EMBED",
                keyboard: !0,
                className: t.isMobile ? "plugin-mobile-bottom-slide" : "plugin-lhpane top-border",
                addMobileSlider: !0
            })
        };
    e.default = p
})), W.define("pluginsCtrl", ["rootScope", "plugins", "broadcast", "utils"], (function(e, t, n, i, o) {
    var r = function(e) {
        return e in n
    };

    function a(e, t) {
        var i = r(e) && n[e];
        i && "neverClose" !== i.exclusive && i.close.call(i, t)
    }

    function s(e, t) {
        o.each(n, (function(n, i) {
            n.exclusive && n.exclusive === t && n.isOpen && i !== e && n.close.call(n)
        }))
    }

    function l(e) {
        for (var i = [], l = arguments.length - 1; l-- > 0;) i[l] = arguments[l + 1];
        var c = "rplanner" === e && t.isMobileOrTablet ? "distance" : "distance" !== e || t.isMobileOrTablet ? e : "rplanner",
            d = r(c) && n[c];
        d && (d.exclusive && "neverClose" !== d.exclusive && ("all" === d.exclusive ? o.each(n, (function(t, n) {
            t.isOpen && n !== e && a(n)
        })) : "rhpane" === d.exclusive || "lhpane" === d.exclusive ? (["detail", "rplanner", "station", "webcams-detail"].forEach((function(e) {
            var t = n[e];
            t.close.call(t)
        })), t.isMobile ? (s(e, "rhpane"), s(e, "lhpane")) : s(e, d.exclusive)) : s(e, d.exclusive)), d.open.apply(d, i))
    }
    i.on("rqstOpen", l), i.on("rqstClose", a), i.on("closeAllPlugins", (function(e) {
        void 0 === e && (e = []), o.each(n, (function(t, n) {
            t.isOpen && !e.includes(n) && a(n)
        }))
    })), i.on("toggle", (function(e) {
        var t = n[e];
        t && (t.isOpen ? a(e) : l(e))
    })), i.on("closePane", s)
})), W.define("Bar", ["utils", "Drag", "GhostBox", "Resizable", "rootScope"], (function(e, t, n, i, o, r) {
    var a = o.extend(n, i, {
        offset: 0,
        borderOffset: 0,
        jumpingGhost: !0,
        bcastLimit: 100,
        jumpingWidth: 140,
        _init: function() {
            this.left = 0, this.calendarHours = 0, this.timestamp = Date.now(), this.resizableEl = this.progressBar, this.el = this.timecode = t.$(".main-timecode", this.progressBar), this.text = t.$(".box", this.timecode), this.progressLine = t.$(".progress-line", this.progressBar), this.b = t.$(".progress-line i", this.progressBar), this.played = t.$(".progress-line .played", this.progressBar), this.ghost = t.$(".ghost-timecode", this.progressBar), this.ghostTxt = this.ghost && t.$(".box", this.ghost), n._init.call(this), o._init.call(this), r.isMobile || i._init.call(this), this.progressLine.addEventListener("mouseup", this.click.bind(this)), this.ondragend = this.bcast.bind(this), this.throttledBcast = t.throttle.call(this, this.bcast, this.bcastLimit)
        },
        ondrag: function(e) {
            this.update(e + 20 - this.offset), this.throttledBcast()
        },
        update: function(e) {
            return this.left = t.bound(e, 0, this.maxWidth), this.timecode.style.left = this.left + this.offset + "px", this.text.textContent = this.createText(this.text), this.played && (this.played.style.width = this.left + "px"), this.left
        },
        createText: function() {
            return ""
        },
        createGhostText: function() {
            return ""
        },
        bcast: function() {
            this.timestamp = this.pos2ts(this.left), this.onbcast()
        },
        onbcast: function() {},
        pos2ts: function(e) {
            return this.calendar ? this.calendar.start + e / this.pxRatio : Date.now()
        },
        addAnimation: function() {
            this.progressBar.classList.add("anim-allowed")
        },
        removeAnimation: function() {
            var e = this;
            window.setTimeout((function() {
                e.progressBar.classList.remove("anim-allowed")
            }), 300)
        },
        click: function(e) {
            if (!this.dragging) {
                this.addAnimation();
                var n = t.bound(e.pageX - this.offset - this.borderOffset, 0, this.maxWidth);
                this.timestamp = this.pos2ts(n), this.update(n), this.bcast(), this.removeAnimation()
            }
        },
        set: function(e) {
            this.addAnimation(), this.timestamp = e, this.update(this.ts2pos(e)), this.removeAnimation()
        },
        ts2pos: function(e) {
            return this.calendar ? (e - this.calendar.start) * this.pxRatio : 0
        },
        onresize: function() {
            if (this.calendar) {
                if (this.progressWidth = this.progressBar.offsetWidth - this.offset, this.pxRatio = this.progressWidth / (this.calendar.endOfCal - this.calendar.start), this.maxWidth = this.ts2pos(this.calendar.end), this.progressLine.style.width = t.bound(this.maxWidth, 0, this.progressWidth) + "px", this.borderOffset = this.elLeft, this.b) {
                    var e = this.ts2pos(Date.now());
                    this.b.style.left = e + "px"
                }
                this.set(this.timestamp)
            }
        },
        updateGhost: function(e) {
            var n = t.bound(e.clientX - this.offset - this.borderOffset, 0, this.maxWidth);
            this.ghost.style.left = n + this.offset + "px", this.jumpingGhost && (this.ghost.style.marginTop = this.left - n < 40 && n - this.left < this.jumpingWidth ? "-25px" : "0px"), this.ghostTxt.textContent = this.createGhostText(n)
        }
    });
    e.default = a
})), W.define("BindedCheckbox", ["store", "Class"], (function(e, t, n) {
    var i = n.extend({
        onValue: !0,
        offValue: !1,
        _init: function() {
            var e = t.get(this.bindStore);
            this.set(e), this.el.onclick = this.toggle.bind(this), t.on(this.bindStore, this.set, this)
        },
        unmount: function() {
            t.off(this.bindStore, this.set, this)
        },
        toggle: function() {
            var e = t.get(this.bindStore);
            t.set(this.bindStore, e === this.onValue ? this.offValue : this.onValue)
        },
        set: function(e) {
            this.el.classList[e === this.onValue ? "remove" : "add"]("off")
        }
    });
    e.default = i
})), W.define("BindedSwitch", ["utils", "store", "Switch"], (function(e, t, n, i) {
    var o = t.isFunction,
        r = t.$,
        a = i.extend({
            _init: function() {
                this.initValue = n.get(this.bindStore), n.on(this.bindStore, this.set, this), "function" == typeof this.render && n.on("usedLang", this.render, this), i._init.call(this)
            },
            unmount: function() {
                n.off(this.bindStore, this.set, this), "function" == typeof this.render && n.off("usedLang", this.render, this)
            },
            set: function(e) {
                var t = r(".selected", this.el),
                    n = this.getEl(e);
                t && t.classList.remove("selected"), n && n.classList.add("selected")
            },
            click: function(e, t) {
                if ("set" === e) n.set(this.bindStore, t);
                else {
                    var i = this[e];
                    o(i) && i.call(this, t)
                }
            }
        });
    e.default = a
})), W.define("Drag", ["Class", "utils"], (function(e, t, n) {
    var i = n.isTouchEvent,
        o = t.extend({
            supportTouch: !0,
            preventDefault: !0,
            passiveListener: !0,
            _init: function() {
                this.dragging = !1, this.bindedDrag = this._drag.bind(this), this.bindedEndDrag = this.endDrag.bind(this), this.bindedStart = this.startDrag.bind(this), this.el.addEventListener("mousedown", this.bindedStart), this.supportTouch && this.el.addEventListener("touchstart", this.bindedStart)
            },
            destroy: function() {
                this.el.removeEventListener("mousedown", this.bindedStart), this.supportTouch && this.el.removeEventListener("touchstart", this.bindedStart)
            },
            getXY: function(e) {
                return i(e) ? [e.touches[0].pageX, e.touches[0].pageY] : [e.pageX, e.pageY]
            },
            startDrag: function(e) {
                this.preventDefault && e.preventDefault(), this.startXY = this.getXY(e), this.offsetX = -this.el.offsetLeft, this.offsetY = -this.el.offsetTop, this.dragging = !0, this.ondragstart && this.ondragstart.call(this, this.startXY), window.addEventListener("mousemove", this.bindedDrag), window.addEventListener("mouseup", this.bindedEndDrag), this.supportTouch && (window.addEventListener("touchmove", this.bindedDrag, this.passiveListener ? void 0 : {
                    passive: !1
                }), window.addEventListener("touchend", this.bindedEndDrag), window.addEventListener("touchcancel", this.bindedEndDrag))
            },
            _drag: function(e) {
                var t = this.getXY(e);
                this.ondrag(t[0] - this.startXY[0] - this.offsetX, t[1] - this.startXY[1] - this.offsetY, e)
            },
            endDrag: function(e) {
                window.removeEventListener("mousemove", this.bindedDrag), window.removeEventListener("touchmove", this.bindedDrag, this.passiveListener ? void 0 : {
                    passive: !1
                }), window.removeEventListener("mouseup", this.bindedEndDrag), window.removeEventListener("touchend", this.bindedEndDrag), window.removeEventListener("touchcancel", this.bindedEndDrag), this.ondragend && this.ondragend(e), this.dragging = !1
            }
        });
    e.default = o
})), W.define("DraggableDiv", ["Class", "utils"], (function(e, t, n) {
    var i = n.bound,
        o = n.isTouchEvent,
        r = t.extend({
            _init: function() {
                this.scrollEl.addEventListener("mousedown", this.startDrag.bind(this))
            },
            getX: function(e) {
                return o(e) ? e.touches[0].pageX : e.pageX
            },
            startDrag: function(e) {
                var t = this;
                e.preventDefault();
                var n = this.getX(e),
                    o = 0,
                    r = 0,
                    a = Date.now(),
                    s = 0,
                    l = this.scrollEl.scrollLeft,
                    c = function() {
                        var e = Date.now(),
                            n = e - a,
                            o = t.scrollEl.scrollLeft,
                            r = o - l;
                        a = e, l = o, s = i(.8 * (1e3 * r / (1 + n)) + .2 * s, -500, 500)
                    },
                    d = setInterval(c, 100);
                c(), window.cancelAnimationFrame(this.inertiaAnim);
                var u = function(e) {
                        var i = t.getX(e);
                        t.scrollEl.scrollLeft += n - i, n = i, e.preventDefault(), e.stopPropagation()
                    },
                    h = function() {
                        var e = Date.now() - a,
                            n = -o * Math.exp(-e / 325);
                        Math.abs(n) > .5 && e < 3e3 && (t.scrollEl.scrollLeft = r + n, t.inertiaAnim = window.requestAnimationFrame(h))
                    },
                    p = function() {
                        clearInterval(d), window.removeEventListener("mousemove", u), window.removeEventListener("mouseup", p), Math.abs(s) > 10 && (o = .6 * s, r = t.scrollEl.scrollLeft + o, a = Date.now(), t.inertiaAnim = window.requestAnimationFrame(h)), e.preventDefault(), e.stopPropagation()
                    };
                window.addEventListener("mousemove", u), window.addEventListener("mouseup", p)
            }
        });
    e.default = r
})), W.define("ClickHandler", ["Class", "broadcast", "store"], (function(e, t, n, i) {
    var o = function(e, t) {
            return n.emit.apply(n, t), e.stopPropagation(), !0
        },
        r = t.extend({
            defaultHandlers: {
                rqstOpen: o,
                rqstClose: o,
                toggle: o,
                share: function() {
                    return n.emit("rqstOpen", "share"), !0
                },
                login: function() {
                    return n.emit("userLogin"), !0
                },
                logout: function() {
                    return n.emit("userLogout"), !0
                },
                store: function(e, t) {
                    return i.set(t[1], t[2]), !0
                }
            },
            _init: function() {
                this.el.addEventListener("click", this.onevent.bind(this))
            },
            onevent: function(e) {
                var t;
                if (!e || !(e.target instanceof HTMLElement || e.target instanceof SVGElement)) throw new Error("Event target is not instance of HTMLElement or SVGElement");
                var n, i = e.target,
                    o = Boolean("A" === i.nodeName && (null === (t = i.href) || void 0 === t ? void 0 : t.length));
                for (this.stopPropagation && !o && (e.preventDefault(), e.stopPropagation()); i && i !== this.el;) {
                    if (i && i.dataset && (n = i.dataset.do)) {
                        var r = n.split(",");
                        return void(this.defaultClickHandlers(e, r) || this.click.apply(this, r))
                    }
                    i = i.parentElement
                }
            },
            defaultClickHandlers: function(e, t) {
                var n = this,
                    i = t[0];
                return i in n.defaultHandlers && this.defaultHandlers[i](e, t)
            }
        });
    e.default = r
})), W.define("GhostBox", ["Class"], (function(e, t) {
    var n = t.extend({
        _init: function() {
            this.progressLine.addEventListener("mouseenter", this.onGhostMouseEnter.bind(this)), this.progressLine.addEventListener("mouseleave", this.onGhostMouseLeave.bind(this)), this.progressLine.addEventListener("mousemove", this.onGhostMouseMove.bind(this))
        },
        onGhostMouseEnter: function() {
            this.dragging || (this.ghost.style.opacity = "1")
        },
        onGhostMouseLeave: function() {
            this.ghost.style.opacity = "0"
        },
        onGhostMouseMove: function(e) {
            this.dragging ? this.ghost.style.opacity = "0" : this.updateGhost(e)
        }
    });
    e.default = n
})), W.define("OverlaysMenu", ["overlays", "store", "trans", "rootScope", "utils", "BindedSwitch", "format"], (function(e, t, n, i, o, r, a, s) {
    var l = i.t,
        c = a.extend({
            bindStore: "overlay",
            _init: function() {
                a._init.call(this), n.on("favOverlays", this.render, this), n.on("expertMode", this.render, this)
            },
            render: function() {
                this._render(), this.resize(), this.set(n.get("overlay"))
            },
            resize: function() {},
            set: function(e) {
                this.unfold(e), a.set.call(this, e)
            },
            unfold: function(e) {
                for (var n = t[e], i = n && n.parentMenu || e, o = this.el.querySelectorAll("[data-parent]"), a = 0; a < o.length; a++) {
                    var s = o[a];
                    r.toggleClass(s, s.dataset.parent === i, "menu-unfold")
                }
            },
            _render: function() {
                var e, i = n.get("favOverlays"),
                    a = n.get("expertMode"),
                    c = n.get("usedLang"),
                    d = (s.seoLang(c), {}),
                    u = {},
                    h = 1,
                    p = 0;
                if (a || r.each(t, (function(e, n) {
                        var o = e.virtual,
                            r = e.parentMenu;
                        !o && r && i.includes(n) && t[r].virtual && (u[r] || (u[r] = []), u[r].push(n))
                    })), a) e = o.overlays;
                else {
                    var f = [].concat(o.overlays);
                    Object.keys(u).forEach((function(e) {
                        if (!f.includes(e)) {
                            var t = f.findIndex((function(t) {
                                return u[e].includes(t)
                            }));
                            t >= 0 && f.splice(t, 0, e)
                        }
                    })), e = f
                }
                var m = e.map((function(e) {
                    var n = t[e],
                        o = (n.allwaysOn, n.icon),
                        r = n.trans,
                        s = n.parentMenu,
                        l = n.virtual,
                        c = n.globeNotSupported,
                        p = e in u,
                        f = i.includes(e) || p;
                    if (!n || !r || !o || !f || a && l || n.partOf) return "";
                    var m = s && (i.includes(s) || u[s]);
                    s ? s in d ? d[s]++ : d[s] = 1 : h++;
                    var v = n.getName.call(n);
                    return '<a data-do="' + (l ? "unfold" : "set") + "," + e + '" data-parent="' + (s || "isParent") + '"\n                        \n                        ' + (!a && s && m ? 'class="sub-menu' + (c ? " globe-not-supported" : "") + '"' : c ? 'class="globe-not-supported"' : "") + '>\n                        <div class="iconfont noselect notap">' + o + '</div>\n                        <div class="menu-text noselect notap">' + v + "</div>\n                    </a>"
                })).join("");
                for (var v in m += '<a data-do="toggle,overlays" id="ovr-menu"\n                    \n                    class="menu-unfold">\n                        <div class="iconfont noselect notap"><</div>\n                        <div class="menu-text noselect notap">' + l.MORE_LAYERS + "</div>\n                    </a>", d) p = Math.max(p, d[v]);
                this.iconNum = a ? 1 + i.length : h + p, this.el.innerHTML = m
            }
        });
    e.default = c
})), W.define("ProductSwitch", ["BindedSwitch", "products", "store", "rootScope", "trans", "utils"], (function(e, t, n, i, o, r, a) {
    var s = a.$,
        l = r.t,
        c = t.extend({
            bindStore: "product",
            showResolution: !0,
            menu: ["camsEu", "cams", "geos5", "ecmwf", "ecmwfWaves", "gfs", "bomAccess", "hrrrAlaska", "hrrrConus", "namConus", "namHawaii", "namAlaska", "gfsWaves", "iconD2", "iconEu", "icon", "iconEuWaves", "iconWaves", "nems", "arome"],
            _init: function() {
                t._init.call(this), i.on("availProducts", this.redraw, this), i.on("visibleProducts", this.redraw, this), i.on("product", this.redraw, this), this.redraw()
            },
            getEl: function(e) {
                return s('.i[data-do="set,' + e + '"]', this.el) || s(".more-products", this.el)
            },
            toggleMoreProducts: function() {
                var e = s(".more-products", this.el);
                e && e.classList && e.classList.toggle("open")
            },
            printHTML: function(e, t) {
                var o = this;
                void 0 === t && (t = []);
                var r, a = i.get("availProducts"),
                    s = function(e) {
                        var t = n[e];
                        return '<div data-do="set,' + e + '" class="i' + (a.includes(e) ? "" : " disabled") + '">' + t.modelName + (o.showResolution && t.modelResolution ? "<small>" + t.modelResolution + "km</small>" : "") + "</div>"
                    },
                    c = [],
                    d = (t || []).map(s).join("");
                if (c.length) {
                    var u = c.includes(e);
                    d += '\n                <span data-do="toggleMoreProducts" class="more-products">\n                    ' + (u ? n[e].modelName : l.MORE_PRODUCTS.replace("{{count}}", c.length.toString())) + "\n                    " + (r = '<div id="more-products-box">', r += c.map((function(t) {
                        return u && e === t ? "" : s(t)
                    })).join(""), (r += "</div>") + "\n                </span>\n            ")
                }
                this.el.innerHTML = d
            },
            redraw: function() {
                var e = i.get("visibleProducts"),
                    t = i.get("product"),
                    n = o.seaProducts.includes(t),
                    r = o.airQualityProducts.includes(t),
                    a = this.menu.filter((function(t) {
                        var i = o.seaProducts.includes(t),
                            a = o.airQualityProducts.includes(t);
                        return e.includes(t) && n === i && r === a
                    }));
                this.printHTML(t, a), this.set(t)
            }
        });
    e.default = c
})), W.define("Resizable", ["utils", "broadcast", "Class"], (function(e, t, n, i) {
    var o = t.debounce,
        r = i.extend({
            _init: function() {
                window.addEventListener("resize", o(this.resize.bind(this), 300)), n.on("pluginOpened", this.uiChanged, this), n.on("pluginClosed", this.uiChanged, this), n.on("detailRendered", this.resize, this), n.on("uiChanged", this.uiChanged, this), this.rects = {
                    left: -1
                }, this.resize()
            },
            uiChanged: function() {
                setTimeout(this.resize.bind(this), 200), setTimeout(this.resize.bind(this), 500), setTimeout(this.resize.bind(this), 1500)
            },
            resize: function() {
                var e = this.resizableEl.getBoundingClientRect();
                this.rects.top === e.top && this.rects.bottom === e.bottom && this.rects.left === e.left && this.rects.right === e.right || (this.height = Math.max(1, e.height), this.width = Math.max(1, e.width), this.rects = e, this.elTop = e.top, this.elBottom = e.bottom, this.elLeft = e.left, this.elRight = e.right, this.onresize(this.rects))
            },
            onresize: function() {}
        });
    e.default = r
})), W.define("Scrollable", ["Class", "utils"], (function(e, t, n) {
    var i = t.extend({
        _init: function() {
            this.scrollTicking = !1, this.scrollEndTimer = null, this.scrollEl.addEventListener("scroll", this.scrollFired.bind(this))
        },
        scrollFired: function(e) {
            this.scrollTicking || (window.requestAnimationFrame(this.onscroll.bind(this, e)), clearTimeout(this.scrollEndTimer), this.scrollEndTimer = setTimeout(this.onscrollend.bind(this), 100), this.scrollTicking = !0)
        },
        scrollTo: function(e) {
            var t = this,
                i = this.scrollEl.scrollLeft,
                o = Date.now(),
                r = e - i,
                a = o + Math.max(500, 1.2 * Math.abs(r)),
                s = function() {
                    var e = Date.now();
                    t.scrollEl.scrollLeft = n.smoothstep(o, a, e) * r + i, e < a && window.requestAnimationFrame(s)
                };
            s()
        },
        onscroll: function() {},
        onscrollend: function() {}
    });
    e.default = i
})), W.define("Swipe", ["Class"], (function(e, t) {
    var n = t.extend({
        threshold: 50,
        _init: function() {
            this.el.addEventListener("touchstart", this.touchStart.bind(this)), this.el.addEventListener("touchmove", this.touchMove.bind(this)), this.el.addEventListener("touchend", this.touchEnd.bind(this))
        },
        touchStart: function(e) {
            this.isSwipeValid = !0, this.direction = null, this.x = this.xStart = this.xThrottled = e.touches[0].clientX, this.y = this.yStart = this.yThrottled = e.touches[0].clientY, this.onswipestart(e)
        },
        touchMove: function(e) {
            this.x = e.touches[0].clientX, this.y = e.touches[0].clientY;
            var t = this.x - this.xThrottled,
                n = this.y - this.yThrottled;
            if (!(Math.sqrt(t * t + n * n) < this.threshold)) {
                this.xThrottled = this.x, this.yThrottled = this.y;
                var i = null;
                Math.abs(n / t) < .2 ? i = t > 0 ? "right" : "left" : Math.abs(t / n) < .2 && (i = n > 0 ? "down" : "up"), null !== i && (null === this.direction || this.direction === i ? this.direction = i : this.isSwipeValid = !1)
            }
        },
        touchEnd: function(e) {
            if (null !== this.direction && this.isSwipeValid) {
                var t = this.x - this.xStart,
                    n = this.y - this.yStart,
                    i = Math.sqrt(t * t + n * n);
                this.onswipe(this.direction, i, e)
            }
        },
        onswipestart: function() {},
        onswipe: function() {}
    });
    e.default = n
})), W.define("Switch", ["utils", "ClickHandler"], (function(e, t, n) {
    var i = t.isFunction,
        o = t.$,
        r = n.extend({
            initValue: null,
            stopPropagation: !0,
            _init: function() {
                var e;
                this.el && this.initValue && (e = this.getEl(this.initValue)) && e.classList.add("selected"), this.selected = this.initValue, n._init.call(this)
            },
            getEl: function(e) {
                return o('*[data-do="set,' + e + '"]', this.el)
            },
            set: function(e, t) {
                this.click("set", e, t)
            },
            click: function(e, t, n) {
                if ("set" === e) {
                    var r = o(".selected", this.el),
                        a = this.getEl(t);
                    r && r.classList.remove("selected"), a && a.classList.add("selected"), n || t !== this.selected && this.onset(t), this.selected = t
                } else {
                    var s = this[e];
                    i(s) && s.call(this, t)
                }
            },
            onset: function() {}
        });
    e.default = r
})), W.define("Webcams", ["store", "map", "trans", "http", "format", "ClickHandler", "broadcast", "metrics", "urls"], (function(e, t, n, i, o, r, a, s, l, c) {
    var d = i.t,
        u = n.map,
        h = n.markers,
        p = a.extend({
            maxAmount: 5,
            imgRatio: 400 / 224,
            data: [],
            toOpen: "webcams-detail",
            currentLocation: null,
            singleLine: !0,
            useHover: !0,
            addListeners: function() {
                return this.hasListener || (t.on("webcamsDaylight", this.render, this), this.hasListener = !0), this
            },
            unmount: function() {
                this.hasListener && (t.off("webcamsDaylight", this.render, this), this.hasListener = !1), this.removeMarker()
            },
            load: function(e) {
                var t = this;
                return this.removeMarker(), this.currentLocation = L.latLng(e.lat, e.lon), new Promise((function(n) {
                    var i = c.getWebcamsList(e);
                    o.get(i, {
                        cache: !e.forceReload
                    }).then((function(e) {
                        var i = e.data;
                        t.daylight = !1, i.cams.length > 0 ? (t.data = i.cams.slice(0, t.maxAmount), t.render()) : (t.data = [], t.el && (t.el.innerHTML = "")), n(t.data)
                    }))
                }))
            },
            index2location: function(e) {
                return [this.data[e].location.lat, this.data[e].location.lon]
            },
            addMarker: function(e) {
                this.marker ? this.marker.setLatLng(this.index2location(e)) : this.marker = L.marker(this.index2location(e), {
                    icon: h.webcamIcon,
                    zIndexOffset: 1e3
                }).addTo(u)
            },
            removeMarker: function() {
                this.marker && (u.removeLayer(this.marker), this.marker = null)
            },
            render: function() {
                var e = this;
                if (this.data && this.data.length) {
                    var n = t.get("webcamsDaylight");
                    this.el.innerHTML = this.data.map((function(t, i) {
                        var o = r.howOld({
                                ts: n && t.lastDaylight || t.lastUpdate,
                                translate: !0
                            }),
                            a = r.obsoleteClass((n && t.lastDaylight || t.lastUpdate) / 1e3),
                            s = L.latLng(t.location.lat, t.location.lon).distanceTo(e.currentLocation) / 1e3,
                            c = s > 0 ? d.D_DISTANCE + " " + l.distance.convertValue.call(l.distance, 1e3 * s, " ") : "";
                        return '<div class="webcam" data-do="webcam,' + i + '" data-webcam="' + i + '">\n                <div class="webcam-inner">\n                    <div class="webcam-image" style="background-image: url( img/ajax-loader.gif );"></div>\n                    <div class="webcam-description">\n                        <div class="wbcm-name noselect">' + t.title + "</div>\n                        " + (e.singleLine ? '<small class="noselect fresh-title ' + a + '">' + o + ", " + c + "</small>" : '<small class="noselect multilined fresh-title ' + a + '">' + o + "<br />" + c + "</small>") + "\n                    </div>\n                </div>\n            </div>"
                    })).join(""), this.useHover && this.el.querySelectorAll("div[data-webcam]").forEach((function(t) {
                        t.onmouseover = e.addMarker.bind(e, +t.dataset.webcam), t.onmouseout = e.removeMarker.bind(e)
                    }))
                }
            },
            forEach: function(e) {
                for (var t = this.el.querySelectorAll(".webcam"), n = 0; n < t.length; n++) e(t[n], n)
            },
            setWH: function(e, t) {
                this.forEach((function(n) {
                    n.style.width = e + "px", n.style.height = t + "px"
                }))
            },
            loadImages: function() {
                var e = this,
                    n = t.get("webcamsDaylight");
                this.forEach((function(t, i) {
                    var o = e.data[i].images[n ? "daylight" : "current"].preview;
                    t.querySelector(".webcam-image").style.backgroundImage = "url(" + o + "), url( img/ajax-loader.gif )", t.classList.add("loaded")
                }))
            },
            click: function(e, t) {
                "webcam" === e && s.emit("rqstOpen", this.toOpen, this.data[+t].id)
            }
        });
    e.default = p
})), W.define("BindedBar", ["store", "Bar", "format"], (function(e, t, n, i) {
    var o = n.extend({
        displayHour: i.getHoursFunction(),
        zuluMode: t.get("zuluMode"),
        _init: function() {
            n._init.call(this), t.on("usedLang", this.render, this), t.on("hourFormat", this.render, this), t.on("zuluMode", this.render, this), t.on(this.bindTimestamp, this.ontstamp, this), t.on(this.bindCalendar, this.setCal, this), this.ondragstart = this.stopAnim, this.setCal(t.get(this.bindCalendar)), this.set(t.get(this.bindTimestamp))
        },
        render: function() {
            this.zuluMode = t.get("zuluMode"), this.text.removeAttribute("data-zulu"), this.displayHour = i.getHoursFunction(), this.text.textContent = this.createText(this.text)
        },
        ontstamp: function(e, t) {
            this.UIident !== t && this.set(e)
        },
        onbcast: function() {
            t.set(this.bindTimestamp, this.timestamp, {
                UIident: this.UIident
            })
        },
        stopAnim: function() {
            this.bindAnimation && t.set(this.bindAnimation, !1)
        },
        click: function(e) {
            this.stopAnim(), n.click.call(this, e)
        },
        setCal: function(e) {
            e && (this.numberOfHours = e.calendarHours, this.calendar = e, this.onresize())
        }
    });
    e.default = o
})), W.define("Window", ["utils", "trans"], (function(e, t, n) {
    var i = n.translateDocument,
        o = t.$,
        r = function(e) {
            var t, n, i, o, r, a, s, l, c, d, u, h;
            this.initProperties(), this.unmountOnClose = null !== (t = e.unmountOnClose) && void 0 !== t ? t : this.unmountOnClose, this.attachPoint = null !== (n = e.attachPoint) && void 0 !== n ? n : this.attachPoint, this.bodyClass = null !== (i = e.bodyClass) && void 0 !== i ? i : this.bodyClass, this.className = e.className, this.closeOnClick = null !== (o = e.closeOnClick) && void 0 !== o ? o : this.closeOnClick, this.displayBlock = null !== (r = e.displayBlock) && void 0 !== r ? r : this.displayBlock, this.html = e.html, this.domEl = null !== (a = e.domEl) && void 0 !== a ? a : this.domEl, this.htmlID = e.htmlID, this.ident = e.ident, this.keyboard = null !== (s = e.keyboard) && void 0 !== s ? s : this.keyboard, this.replaceMountingPoint = null !== (l = e.replaceMountingPoint) && void 0 !== l ? l : this.replaceMountingPoint, this.timeout = null !== (c = e.timeout) && void 0 !== c ? c : this.timeout, this.onclose = null !== (d = e.onclose) && void 0 !== d ? d : this.onclose, this.onclosed = null !== (u = e.onclosed) && void 0 !== u ? u : this.onclosed, this.onopen = null !== (h = e.onopen) && void 0 !== h ? h : this.onopen
        };
    r.prototype.close = function(e) {
        var t, n = this;
        this.isOpen && (this.isOpen = !1, document.body.classList.remove(this.bodyClass), null === (t = this.node) || void 0 === t || t.classList.remove("open"), Promise.resolve(this.onclose()).then((function() {
            n.closingTimer = setTimeout((function() {
                n.onclosed(), n.unmount()
            }), 500)
        })), this.removeHooks(), !this.closeOnClick && (null == e ? void 0 : e.stopPropagation) && e.stopPropagation())
    }, r.prototype.open = function() {
        var e = this;
        if (this.closingTimer && clearTimeout(this.closingTimer), this.timeoutTimer && clearTimeout(this.timeoutTimer), this.isOpen) return this;
        if (this.mount(), !this.node) throw new Error("Cannot open Window " + this.ident + ", mount method does not set node property!");
        return document.body.classList.add(this.bodyClass), this.displayBlock && (this.node.style.display = "block"), this.addHooks(), setTimeout((function() {
            var t;
            null === (t = e.node) || void 0 === t || t.classList.add("open")
        }), 50), this.isOpen = !0, this.timeout && (this.timeoutTimer = setTimeout(this.bindedClose, this.timeout)), this.onopen(), this
    }, r.prototype.onopen = function() {}, r.prototype.onclose = function() {}, r.prototype.onclosed = function() {}, r.prototype.mount = function() {
        this.node || (this.node = this.createNode(), i(this.node), this.attachRefs())
    }, r.prototype.initProperties = function() {
        this.domEl = null, this.closingTimer = null, this.timeoutTimer = null, this.attachPoint = "#plugins", this.keyboard = !1, this.closeOnClick = !1, this.replaceMountingPoint = !1, this.unmountOnClose = !0, this.displayBlock = !0, this.timeout = 0, this.isOpen = !1, this.bindedClose = this.close.bind(this), this.bodyClass = "on" + r.iAm + "-" + this.ident
    }, r.prototype.createNode = function() {
        var e = document.createElement("div");
        e.id = this.htmlID || r.iAm + "-" + this.ident, this.className && (e.className = this.className), e.innerHTML = this.html + '<div class="closing-x"></div>';
        var t = this.domEl || o(this.attachPoint);
        if (!t || this.replaceMountingPoint && !t.parentElement) throw new Error("Cannot create node for Window " + this.ident + ", target element does not exist.");
        return this.replaceMountingPoint ? t.parentElement.replaceChild(e, t) : t.appendChild(e), o(".closing-x", e).onclick = this.bindedClose, e
    }, r.prototype.attachRefs = function() {
        var e, t;
        this.refs = {};
        for (var n = null !== (t = null === (e = this.node) || void 0 === e ? void 0 : e.querySelectorAll("[data-ref]")) && void 0 !== t ? t : [], i = 0, o = n.length; i < o; i++) {
            var r = n[i];
            r.dataset.ref && (this.refs[r.dataset.ref] = r)
        }
    }, r.prototype.removeHooks = function() {
        this.closeOnClick && (document.removeEventListener("mousedown", this.bindedClose, !0), document.removeEventListener("touchstart", this.bindedClose, !0)), this.keyboard && this.node && this.node.removeEventListener("keydown", this.keyCatcher)
    }, r.prototype.addHooks = function() {
        this.closeOnClick && (document.addEventListener("mousedown", this.bindedClose, !0), document.addEventListener("touchstart", this.bindedClose, !0)), this.keyboard && this.node && this.node.addEventListener("keydown", this.keyCatcher)
    }, r.prototype.keyCatcher = function(e) {
        e.stopPropagation()
    }, r.prototype.unmount = function() {
        var e;
        this.unmountOnClose && this.node && (null === (e = this.node.parentNode) || void 0 === e || e.removeChild(this.node), this.node = void 0)
    }, r.iAm = "window", e.Window = r
})), W.define("DropDown", ["Switch", "utils"], (function(e, t, n) {
    var i = n.$,
        o = t.extend({
            _init: function() {
                t._init.call(this), this.opened = !1, this.switch = i("ul", this.el), this.el.addEventListener("click", this.toggle.bind(this)), this.bindedClose = this.close.bind(this), this.fill()
            },
            fill: function() {
                var e = this.getEl(this.selected);
                e && (this.el.dataset.content = e.textContent)
            },
            set: function(e, n) {
                t.set.call(this, e, n), this.fill()
            },
            toggle: function() {
                this.opened ? (this.fill(), this.close()) : this.open()
            },
            open: function() {
                this.switch.classList.add("show"), this.el.classList.add("opened"), this.opened = !0
            },
            close: function() {
                this.switch.classList.remove("show"), this.el.classList.remove("opened"), this.opened = !1
            }
        });
    e.default = o
})), W.define("BindedDropDown", ["BindedSwitch", "DropDown", "store"], (function(e, t, n, i) {
    var o = n.extend(t, {
        _init: function() {
            this.initValue = i.get(this.bindStore), i.on(this.bindStore, this.set, this), "function" == typeof this.render && i.on("usedLang", this.render, this), n._init.call(this)
        },
        set: function(e) {
            t.set.call(this, e), this.selected = e, this.fill()
        }
    });
    e.default = o
})), W.define("TimestampBar", ["BindedBar", "format", "trans"], (function(e, t, n, i) {
    var o = i.t,
        r = t.extend({
            bindTimestamp: "timestamp",
            bindCalendar: "calendar",
            bindAnimation: "animation",
            createText: function(e) {
                var t = Math.floor(this.numberOfHours * this.left / (24 * this.progressWidth)),
                    i = this.calendar.days[t],
                    r = i ? "" + o[this.zuluMode ? i.display : i.displayLong] + (i.day && " " + i.day) + " - " : "";
                if (this.zuluMode) {
                    var a = this.calendar.start + 36e5 * (.5 + this.numberOfHours * this.left / this.progressWidth);
                    e.dataset.zulu = n.hourUTC(a)
                }
                return "" + r + this.displayHour(Math.round(this.numberOfHours * this.left / this.progressWidth) % 24)
            },
            createGhostText: function(e) {
                var t = Math.floor(e / this.progressWidth * this.numberOfHours) % 24;
                return this.displayHour(t)
            }
        });
    e.default = r
})), W.define("BottomSlide", ["Drag", "broadcast", "utils", "Swipe"], (function(e, t, n, i, o) {
    var r = i.$,
        a = t.extend({
            preventDefault: !1,
            passiveListener: !1,
            threshold: 30,
            _init: function() {
                var e = this;
                t._init.call(this);
                var n = this.scrollEl || r(".plugin-content", this.pluginEl);
                if (n) {
                    var i = !1;
                    n.addEventListener("scroll", (function() {
                        n.scrollTop > 20 && !i ? (e.pluginEl.classList.add("show-header"), i = !0) : n.scrollTop < 21 && i && (e.pluginEl.classList.remove("show-header"), i = !1)
                    })), this.closeOnSwipeDown && this.initCloseOnSwipeDown(n)
                }
            },
            initCloseOnSwipeDown: function(e) {
                var t, i = this;
                this.swipeHandler = o.instance({
                    el: this.pluginEl,
                    threshold: 80,
                    onswipestart: function() {
                        t = e.scrollTop <= 0
                    },
                    onswipe: function(e) {
                        t && "down" === e && n.emit("rqstClose", i.pluginName)
                    }
                })
            },
            startDrag: function(e) {
                t.startDrag.call(this, e);
                var n = window.getComputedStyle(this.pluginEl).transform,
                    i = /matrix\(.+,\s*(\S+)\)/.exec(n);
                this.startY = i && i[1] ? +i[1] : 0, this.transformedY = this.startY, this.throttledY = this.startY, this.difference = 0, this.pluginEl.style.transition = "none"
            },
            updatePosition: function(e) {
                this.pluginEl.style.transform = "translate(0px," + Math.floor(e) + "px)"
            },
            ondrag: function(e, t, n) {
                this.transformedY = this.startY + t, this.updatePosition(Math.max(0, this.transformedY)), Math.abs(this.throttledY - this.transformedY) > this.threshold && (this.difference = this.transformedY - this.throttledY, this.throttledY = this.transformedY), n.preventDefault()
            },
            ondragend: function() {
                Math.abs(this.transformedY - this.startY) > this.threshold ? (this.pluginEl.style.transition = "", this.pluginEl.style.transform = "", this.difference > 0 ? this.closeOnSwipeDown || this.pluginEl.classList.contains("open-half") ? n.emit("rqstClose", this.pluginName) : this.pluginEl.classList.add("open-half") : this.pluginEl.classList.remove("open-half")) : this.updatePosition(this.startY)
            }
        });
    e.default = a
})), W.define("components", ["products", "trans", "store", "query", "utils", "rootScope", "broadcast", "overlays", "Class", "ClickHandler", "BindedSwitch", "BindedCheckbox", "TimestampBar"], (function(e, t, n, i, o, r, a, s, l, c, d, u, h, p) {
    var f, m = n.t;
    u.instance({
        el: r.$("#accumulations .ui-switch"),
        bindStore: "acTime",
        _init: function() {
            u._init.call(this), i.on("availAcTimes", this.render, this)
        },
        render: function() {
            var e = i.get("availAcTimes");
            this.el.innerHTML = e.map((function(e) {
                var t = /next(\d+)(h|d)/.exec(e);
                return '<div data-do="set,' + e + '">' + r.template("h" === t[2] ? m.ACC_NEXT_HOURS : m.ACC_NEXT_DAYS, {
                    num: t[1]
                }) + "</div>"
            })).join(""), this.set(i.get("acTime"))
        }
    }), h.instance({
        el: (a.isMobile, r.$("#playpause")),
        bindStore: "animation"
    }), a.isMobile, p.instance({
        progressBar: r.$("#progress-bar"),
        offset: 45,
        borderOffset: 10,
        UIident: "main"
    }), d.instance({
        el: document.body,
        click: function(e) {
            switch (e) {
                case "openapp":
                    window.location.href = "ios" === a.platform ? "https://apps.apple.com/app/apple-store/id1161387262?pt=118417623&ct=webapp&mt=8" : "https://play.google.com/store/apps/details?id=com.windyty.android&utm_source=menu&utm_medium=windy&utm_campaign=openAppLink&utm_content=openAppLink";
                    break;
                case "title":
                    s.emit("back2home");
                    break;
                case "search":
                    s.emit("closeAllPlugins"), o.set(""), s.emit("focusRqstd");
                    break;
                case "openRadarSat":
                    f.open.call(f);
                    break;
                case "hamburgerMenu":
                    s.emit("rqstOpen", i.get("lhpaneSwitch"));
                    break;
                default:
                    s.emit(e)
            }
        }
    }), a.isMobileOrTablet, c.instance({
        el: r.$("#legend-mobile"),
        _init: function() {
            i.on("overlay", this.render, this), s.on("metricChanged", this.render, this)
        },
        render: function() {
            var e = i.get("overlay");
            l[e].paintLegend.call(l[e], this.el)
        }
    }), c.instance({
        el: r.$("#mobile-ovr-select"),
        _init: function() {
            this.debouncedRedraw = r.debounce(this.render.bind(this), 50), i.on("usedLang", this.render, this), i.on("level", this.debouncedRedraw), i.on("overlay", this.debouncedRedraw), i.on("product", this.debouncedRedraw), s.on("radarProviderChanged", this.render, this), this.render()
        },
        render: function() {
            var e = i.get("overlay"),
                n = l[e],
                o = t[i.get("product")],
                r = i.get("level"),
                s = [];
            n.hasMoreLevels && "surface" !== r && s.push(a.levelsData[r][0].replace(/Pa/, "")), !/ecmwf/.test(o.ident) && o.modelName && o.modelName.length && s.push(o.modelName);
            var c = '<span class="uiyellow"\n                ' + (s.length ? 'data-notes="' + s.join(" ") + '"' : "") + "\n                >" + n.getName.call(n) + "</span>";
            c != this.lastString && (this.el.innerHTML = c, this.el.dataset.icon = n.icon, this.lastString = c)
        }
    })
})), W.define("calendarUI", ["utils", "rootScope", "trans", "store", "format", "Scrollable", "broadcast"], (function(e, t, n, i, o, r, a, s) {
    var l = i.t;
    n.isMobile && a.instance({
        scrollEl: t.$("#days"),
        box: t.$("#mobile_box"),
        nowBar: t.$("#now-bar"),
        hoursHtml: "",
        scrolling: !1,
        noAnimation: !1,
        ticking: !1,
        tsPx: 3 * t.tsHour / 20,
        calExpandedTimeout: null,
        UIident: "botomCal",
        _init: function() {
            var e = this;
            a._init.call(this), o.on("timestamp", this.set, this), o.on("hourFormat", this.render, this), o.on("calendar", this.render, this), o.on("usedLang", this.render, this), o.on("zuluMode", this.render, this), window.addEventListener("resize", setTimeout.bind(null, this.render.bind(this), 500)), setInterval(this.render.bind(this), t.tsHour), this.render(), this.set(o.get("timestamp")), s.on("detailClose", (function() {
                e.set(o.get("timestamp"))
            }))
        },
        render: function() {
            this.calendar = o.get("calendar"), this.zuluMode = o.get("zuluMode"), this.localeHours = r.getHoursFunction(), this.timestamp = 0;
            var e = this.calendar;
            if (e) {
                for (var n = e.days.filter((function(t) {
                        return t.start < e.end
                    })), i = "12h" === o.get("hourFormat"), a = "<b></b>", s = "", c = 1; c < 24; c += 3) {
                    var d = i ? (c + 11) % 12 + 1 : c;
                    s += "<li>" + t.pad(d) + "</li>"
                }
                for (var u = 0; u < n.length; u++) {
                    var h = n[u];
                    a += "<div>&nbsp;&nbsp;" + l[h.displayLong] + "&nbsp;" + h.day + "<ul>" + s + "</ul></div>"
                }
                this.scrollEl.innerHTML = a;
                var p = o.get("timestamp");
                this.box.removeAttribute("data-zulu"), this.set(p), this.renderBox(), t.$("b", this.scrollEl).style.left = window.innerWidth / 2 + (Date.now() - e.start) / this.tsPx + "px"
            }
        },
        slideUp: function() {
            this.scrolling || this.noAnimation || (this.scrolling = !0, clearTimeout(this.calExpandedTimeout), document.body.classList.add("mobile-calendar-expanded")), this.noAnimation && (this.scrolling = !0, this.noAnimation = !1)
        },
        onscroll: function(e) {
            this.slideUp(), this.timestamp = this.tsPx * e.target.scrollLeft + this.calendar.start, this.renderBox(), this.scrollTicking = !1
        },
        renderBox: function() {
            this.zuluMode && (this.box.dataset.zulu = r.hourUTC(this.timestamp)), this.box.textContent = this.localeHours(new Date(this.timestamp).getHours())
        },
        onscrollend: function() {
            this.scrolling = !1;
            var e = t.bound(this.timestamp, this.calendar.start, this.calendar.end);
            o.set("timestamp", e, {
                UIident: this.UIident
            }), this.calExpandedTimeout = setTimeout((function() {
                document.body.classList.remove("mobile-calendar-expanded")
            }), 1500)
        },
        set: function(e, t) {
            if (this.calendar && t !== this.UIident) {
                this.timestamp = e;
                var n = (e - this.calendar.start) / this.tsPx;
                this.noAnimation = !0, this.scrollEl.scrollLeft = n
            }
        }
    })
})), W.define("calendarUIdesktop", ["store", "utils", "trans", "rootScope", "ClickHandler", "Resizable"], (function(e, t, n, i, o, r, a) {
    var s = i.t,
        l = n.$;
    if (!o.isMobile) {
        var c = l("#calendar");
        r.instance(a, {
            el: c,
            resizableEl: c,
            stopPropagation: !0,
            _init: function() {
                r._init.call(this), a._init.call(this), t.on("calendar", this.render, this), t.on("usedLang", this.render, this), this.onresize = this.render.bind(this), this.click = t.set.bind(t, "timestamp"), this.render()
            },
            render: function() {
                var e = t.get("calendar");
                if (e) {
                    var n, i = e.end,
                        o = e.days.length,
                        r = this.width / o,
                        a = 100 / o,
                        s = "";
                    if (r > 100) n = this.createDayStringLong;
                    else if (r > 60) n = this.createDayString;
                    else {
                        if (!(r > 40)) return void(this.el.innerHTML = "");
                        n = this.createDayStringShort
                    }
                    for (var l = 0; l < o; l++) {
                        var c = e.days[l];
                        s += '<div data-do="' + Math.min(c.middayTs, i) + '"\n                    class="uiyellow' + (c.middayTs < i ? " clickable" : " disabled") + '"\n                    style="width: ' + a + '%;">' + n(c) + "</div>"
                    }
                    this.el.innerHTML = s
                }
            },
            createDayStringLong: function(e) {
                return s[e.displayLong] + (e.day ? " " + e.day : "")
            },
            createDayString: function(e) {
                return s[e.display] + (e.day ? " " + e.day : "")
            },
            createDayStringShort: function(e) {
                return "" + s[e.display]
            }
        })
    }
})), W.define("loadersUI", ["broadcast", "utils"], (function(e, t, n) {
    var i = n.debounce,
        o = !1;
    var r = i((function() {
        o = !0, document.body.classList.remove("loading-overlay"), document.body.classList.remove("loading-path"), document.body.classList.remove("loading-level")
    }), 300);
    t.on("paramsChanged", (function(e, t) {
        /^(overlay|path|level)$/.test(t) && (r(), o = !1, setTimeout((function() {
            return function(e) {
                o || document.body.classList.add("loading-" + e)
            }(t)
        }), 200))
    })), t.on("redrawFinished", r), t.on("loadingFailed", r), t.on("noConnection", r)
})), W.define("timeAnimation", ["utils", "store", "products", "broadcast"], (function(e, t, n, i, o) {
    var r, a, s, l, c = !1,
        d = 2,
        u = 0,
        h = !1,
        p = function() {
            return n.set("animation", !1)
        },
        f = function(e) {
            e || p()
        },
        m = function(e) {
            return s = e.path
        },
        v = function(e) {
            return /Accu$/.test(e) && p()
        },
        g = function(e) {
            h = l !== s, l = e.path
        };

    function w() {
        d = t.bound(d + (h ? -.25 : .1), .8, 3);
        var e = n.get("timestamp") + u * d;
        e < a.calendar.end ? (n.set("timestamp", e), r = setTimeout(w, 50)) : p()
    }

    function y() {
        var e;
        (a = i[n.get("product")]).animation ? (c = !0, l = s = n.get("path"), d = 2, u = 50 * ((e = a.calendar.timestamps)[1] - e[0] < 2 * t.tsHour ? a.animationSpeed1h : a.animationSpeed), n.on("visibility", f), n.on("product", p), n.on("overlay", v), o.on("redrawFinished", m), o.on("paramsChanged", g), o.on("pluginOpened", p), w(), o.emit("animationStarted")) : p()
    }
    n.on("animation", (function(e) {
        e !== c && (e ? y() : (c = !1, clearTimeout(r), n.off("visibility", f), n.off("product", p), n.off("overlay", v), o.off("redrawFinished", m), o.off("paramsChanged", g), o.off("pluginOpened", p)))
    }))
})), W.define("visibility", ["store"], (function(e, t) {
    "hidden" in document && document.addEventListener("visibilitychange", (function() {
        t.set("visibility", !document.hidden)
    }))
})), W.define("rhMessage", ["utils"], (function(e, t) {
    var n = t.$,
        i = function() {
            return n("#rh-bottom-messages")
        };
    e.clear = function() {
        var e = i();
        e && (e.innerHTML = "")
    }, e.insert = function(e) {
        var t = i();
        t && !t.contains(e) && t.appendChild(e)
    }, e.remove = function(e) {
        var t = i();
        t && t.contains(e) && t.removeChild(e)
    }
})), W.define("Renderer", ["plugins", "Class"], (function(e, t, n) {
    var i = n.extend({
        _init: function() {
            this.isMounted = !1, this.isLoaded = !(this.dependencies && this.dependencies.length)
        },
        open: function(e) {
            var n = this;
            if (this.isMounted) return Promise.resolve();
            if (this.isLoaded) return this.onopen(e), this.isMounted = !0, Promise.resolve();
            if (this.loadingPromise) return this.loadingPromise;
            for (var i = [], o = 0; o < this.dependencies.length; o++) {
                var r = this.dependencies[o],
                    a = t[r];
                if (a && !a.isLoaded) {
                    var s = a.open.call(a, e);
                    i.push(s)
                }
            }
            return this.loadingPromise = Promise.all(i).then((function() {
                n.isLoaded = !0, n.onopen(e), n.isMounted = !0
            })).catch((function(e) {
                window.wError("renderers", "Failed to load/open: " + n.dependencies, e)
            })).then((function() {
                n.loadingPromise = null
            })), this.loadingPromise
        },
        onopen: function() {},
        close: function(e) {
            this.onclose(e), this.isMounted = !1
        },
        onclose: function() {},
        paramsChanged: function() {},
        redraw: function() {}
    });
    e.default = i
})), W.define("DataTiler", ["utils", "map", "dataLoader", "renderUtils", "Class", "store"], (function(e, t, n, i, o, r, a) {
    var s = i.dataLoader,
        l = n.map,
        c = r.extend({
            _tag: "DataTiler",
            loader: s,
            syncCounter: 0,
            wrapCoords: function(e) {
                var t = 1 << e.z;
                return e.x = e.x % t, e.x < 0 && (e.x += t), e
            },
            getTiles: function(e) {
                var n = this,
                    i = l.getZoom();
                if (Math.floor(i) === i) {
                    this.syncCounter++;
                    for (var r = l.getPixelBounds(), s = [], c = r.min.x >> 8, d = r.max.x >> 8, u = r.min.y >> 8, h = r.max.y >> 8, p = u; p <= h; p++)
                        for (var f = c; f <= d; f++) {
                            var m = this.wrapCoords({
                                x: f,
                                y: p,
                                z: i
                            });
                            s.push(m)
                        }
                    var v = a.get("mapCoords"),
                        g = t.clone(v),
                        w = o.getDataZoom(e, i),
                        y = l.getSize(),
                        b = y.x,
                        T = y.y,
                        S = Object.assign(g, {
                            pixelOriginX: r.min.x,
                            pixelOriginY: r.min.y,
                            dZoom: w,
                            width: b,
                            height: T,
                            origTiles: {
                                minX: c,
                                minY: u,
                                maxX: d,
                                maxY: h
                            }
                        }),
                        _ = {},
                        E = [];
                    s.forEach((function(t) {
                        var i, r, a = o.whichTile(t, e),
                            s = a && (null === (r = (i = n).processTile) || void 0 === r ? void 0 : r.call(i, a, e));
                        if (s && !_[s.url]) {
                            _[s.url] = 1;
                            var l = n.loader.loadTile(s);
                            E.push(l)
                        }
                    })), Promise.all(E).then(this.postProcess.bind(this, this.syncCounter, S, e))
                }
            },
            processTile: function(e) {
                return e
            },
            postProcess: function(e, t, n, i) {
                if (e === this.syncCounter) {
                    var r = this.sortTiles(t, n, i);
                    this.trans = 0 | o.getTrans(t.zoom, t.dZoom), this.shift = 0 | Math.log2(this.trans), this.lShift = 0 | Math.log2(this.trans * this.trans);
                    var a = t.pixelOriginX / this.trans % 256,
                        s = t.pixelOriginY / this.trans % 256;
                    a < 0 && (a = 256 + a), this.offsetX = a * this.trans | 0, this.offsetY = s * this.trans | 0, this.offset = 2056, this.width = t.width, this.height = t.height, this.w = o.getWTable(this.trans), this.tilesReady.call(this, r, t, n)
                }
            },
            sortTiles: function(e, t, n) {
                for (var i, r, a = this, s = function(n, i) {
                        var r = a.wrapCoords({
                            x: n,
                            y: i,
                            z: e.zoom
                        });
                        return o.whichTile(r, t)
                    }, l = [], c = e.origTiles.minY; c <= e.origTiles.maxY; c++) {
                    var d = s(e.origTiles.minX, c);
                    if (!d || d.y !== r) {
                        i = null;
                        for (var u = [], h = function(e) {
                                var t = s(e, c);
                                if (t && t.x !== i) {
                                    var o = n.filter((function(e) {
                                        return e.x === t.x && e.y === t.y
                                    }))[0];
                                    u.push(o), i = t.x, r = t.y
                                }
                            }, p = e.origTiles.minX; p <= e.origTiles.maxX; p++) h(p);
                        u.length > 0 && l.push(u)
                    }
                }
                return l
            }
        });
    e.default = c
})), W.define("Particles", ["Class", "store"], (function(e, t, n) {
    var i = t.extend({
        configurable: !1,
        config: n.get("particles"),
        animation: "dot",
        stylesBlue: ["rgba(200,0,150,1)", "rgba(200,0,150,1)", "rgba(200,0,150,1)", "rgba(200,0,150,1)"],
        lineWidth: [.6, .6, .6, 1, 1.2, 1.6, 1.8, 2, 2.2, 2.4, 2.4, 2.4, 2.4, 2.6, 2.8, 3, 3, 3, 3, 3, 3, 3, 3, 3],
        zoom2speed: [.5, .5, .5, .6, .7, .8, .9, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        level2reduce: {
            surface: 1,
            "100m": 1,
            "975h": 1,
            "950h": 1,
            "925h": .98,
            "900h": .9,
            "850h": .8,
            "800h": .77,
            "700h": .7,
            "600h": .65,
            "500h": .6,
            "400h": .55,
            "300h": .5,
            "250h": .45,
            "200h": .45,
            "150h": .35
        },
        colors: [
            [200, 215, 235, 255],
            [215, 235, 255, 255],
            [235, 255, 255, 255],
            [255, 255, 255, 255]
        ],
        getIntensityFun: function() {
            return function(e) {
                return Math.min(3, Math.floor(e / 40))
            }
        },
        _init: function() {
            var e = this;
            n.on("particles", (function(t) {
                return e.config = t
            }))
        },
        getVelocityFun: function(e) {
            var t = this.zoom2speed[e.zoom],
                n = this.configurable ? this.config.velocity : 1,
                i = t * n * this.level2reduce[e.level] * this.velocity.max,
                o = t * n * this.velocity.damper;
            return function(e) {
                return i * (1 - 1 / (o * i * e - 1))
            }
        },
        getAmountMultiplier: function() {
            return this.configurable ? this.config.multiplier : 1
        },
        getAmount: function(e) {
            var t = e.speed2pixel < 1 ? 1 + 1.5 * (1 - e.speed2pixel) : 1,
                n = this.getAmountMultiplier(),
                i = 1 / (this.multiplier.constant * Math.pow(n * this.multiplier.pow, e.zoom - this.multiplier.zoom));
            return 0 | Math.min(15e3, Math.round(t * e.width * e.height * i))
        },
        getLineWidth: function(e) {
            return (this.configurable ? this.config.width : 1) * this.lineWidth[e.zoom]
        },
        getStyles: function(e) {
            var t = this.configurable ? this.config.opacity : 1;
            if (e.zoom >= 12) return this.stylesBlue;
            if (t <= 1) return this.colors[0].map((function(e) {
                return "rgba(" + e + "," + e + "," + e + "," + t.toFixed(1) + ")"
            }));
            var n = Math.min(3, Math.round(1.5 * t));
            return this.colors[n].map((function(e) {
                return "rgba(" + e + "," + e + "," + e + ",1)"
            }))
        },
        getMaxAge: function() {
            return 100
        },
        getBlendingAlpha: function(e) {
            var t = .9 * (this.configurable && 1 != this.config.blending ? this.config.blending : 1) * (e.speed2pixel < .8 ? 1 + (.8 - e.speed2pixel) / 7 : 1);
            return Math.min(.98, 2 * Math.round(100 * t / 2) / 100).toFixed(2)
        }
    });
    e.default = i
})), W.define("TileLayerCanvas", ["rootScope", "renderUtils", "utils", "dataLoader", "renderTile"], (function(e, t, n, i, o, r) {
    var a = r.renderTile,
        s = r.renderNoDataTile,
        l = o.dataLoader,
        c = L.GridLayer.extend({
            options: {
                maxZoom: 11,
                updateWhenIdle: !!t.isMobileOrTablet,
                updateWhenZooming: !1,
                keepBuffer: t.isMobileOrTablet ? 1 : 4,
                disableTransformForTiles: !0
            },
            syncCounter: 0,
            inMotion: !1,
            hasSea: !1,
            className: "overlay-layer",
            onAdd: function(e) {
                return L.GridLayer.prototype.onAdd.call(this), e.on("movestart", this.onMoveStart, this), e.on("moveend", this.onMoveEnd, this), this.on("load", this.checkLoaded, this), this
            },
            onRemove: function(e) {
                return e.off("movestart", this.onMoveStart, this), e.off("moveend", this.onMoveEnd, this), this.off("load", this.checkLoaded, this), L.GridLayer.prototype.onRemove.call(this, e), this.hasSea = !1, document.body.classList.remove("sea"), n.emitter.emit("toggleSeaMask", this.hasSea), this.landOnly = !1, document.body.classList.remove("land"), n.emitter.emit("toggleLandMask", this.landOnly), this
            },
            onMoveStart: function() {
                this.inMotion = !0
            },
            onMoveEnd: function() {
                this.inMotion = !1, this._loading || this.redrawFinished()
            },
            checkLoaded: function() {
                this.inMotion || this.redrawFinished()
            },
            redrawLayer: function() {
                var e = this._map,
                    t = e.getPixelBounds(),
                    n = t.min,
                    i = t.max,
                    o = n.divideBy(256)._floor(),
                    r = i.divideBy(256)._floor(),
                    a = L.bounds(o, r),
                    s = Math.round(e.getZoom());
                if (s > 11) this.redrawFinished();
                else {
                    this.removeOtherTiles(s, a);
                    var l = this.sortTilesFromCenterOut(a);
                    this._tilesToLoad = l.length;
                    for (var c = 0; c < l.length; c++) {
                        var d = l[c],
                            u = this._tileCoordsToKey(d);
                        u in this._tiles ? this.redrawTile(this._tiles[u]) : --this._tilesToLoad || this.redrawFinished()
                    }
                }
            },
            removeOtherTiles: function(e, t) {
                var n = t.min,
                    i = t.max;
                for (var o in this._tiles) {
                    var r = o.split(":"),
                        a = r[0],
                        s = r[1];
                    (+r[2] !== e || +a < n.x || +a > i.x || +s < n.y || +s > i.y) && this._removeTile(o)
                }
            },
            redrawTile: function(e) {
                var t = this;
                e.coords = this._wrapCoords(e.coords);
                var i = n.whichTile(e.coords, this.latestParams),
                    o = this.syncCounter;
                l.loadTile(i).then((function(n) {
                    t.renderTile.call(t, 2, e.el, o, i, n)
                })).catch((function(t) {
                    s(e.el, null == t ? void 0 : t.url)
                })).then((function() {
                    --t._tilesToLoad || t.redrawFinished()
                }))
            },
            paramsChanged: function(e) {
                e.fullPath === this.latestParams.fullPath && e.layer === this.latestParams.layer || (this.latestParams = i.clone(e), this.syncCounter++, this.redrawLayer())
            },
            sortTilesFromCenterOut: function(e) {
                var t, n, i = [],
                    o = e.getCenter(),
                    r = this._tileZoom;
                for (t = e.min.y; t <= e.max.y; t++)
                    for (n = e.min.x; n <= e.max.x; n++) {
                        var a = new L.Point(n, t);
                        a.z = r, i.push(a)
                    }
                return i.sort((function(e, t) {
                    return e.distanceTo(o) - t.distanceTo(o)
                })), i
            },
            redrawFinished: function() {
                this.latestParams.sea !== this.hasSea && (i.toggleClass(document.body, this.latestParams.sea, "sea"), this.hasSea = Boolean(this.latestParams.sea), n.emitter.emit("toggleSeaMask", this.hasSea)), this.latestParams.landOnly !== this.landOnly && (i.toggleClass(document.body, this.latestParams.landOnly, "land"), this.landOnly = this.latestParams.landOnly, n.emitter.emit("toggleLandMask", this.landOnly)), n.emitter.emit("rendered", "tileLayer")
            },
            createTile: function(e, t) {
                var i = this;
                e = this._wrapCoords(e);
                var o = n.whichTile(e, this.latestParams),
                    r = L.DomUtil.create("canvas"),
                    a = this.syncCounter;
                return r.width = r.height = 256, r.style.width = r.style.height = "256px", l.loadTile(o).then((function(e) {
                    i.renderTile.call(i, 2, r, a, o, e)
                })).catch((function(e) {
                    s(r, null == e ? void 0 : e.url)
                })).then((function() {
                    t(void 0, r)
                })), r
            },
            init: function(e) {
                this.latestParams = i.clone(e)
            },
            renderTile: a
        });
    e.default = c
})), W.define("TileLayer", ["Renderer", "map", "tileLayer", "tileInterpolator"], (function(e, t, n, i, o) {
    var r = n.map,
        a = t.extend({
            onopen: function(e) {
                r.hasLayer(i) ? i.paramsChanged.call(i, e) : (i.init(e), i.addTo(r), i.getContainer().classList.add("overlay-layer")), W.require("@plugins/gl-tile-render");
                try {
                    W["@plugins/gl-tile-render"].init()
                } catch (e) {
                    0
                }
            },
            interpolator: o,
            paramsChanged: i.paramsChanged.bind(i),
            redraw: i.redrawLayer.bind(i),
            onclose: function(e) {
                e.includes("tileLayer") || e.includes("tileLayerPatternator") || e.includes("daySwitcher") || r.removeLayer.call(r, i)
            }
        });
    e.default = a
})), W.define("dataLoader", ["lruCache", "rootScope", "utils", "broadcast"], (function(e, t, n, i, o) {
    var r = i.addQs,
        a = 0,
        s = n.isMobile ? 3 : 6,
        l = document.createElement("canvas"),
        c = l.getContext("2d"),
        d = function(e, t) {
            this.url = e, this.status = "undefined", this.data = null, this.x = t.x, this.y = t.y, this.z = t.z, this.transformR = t.transformR, this.transformG = t.transformG, this.transformB = t.transformB
        };
    d.prototype.load = function() {
        var e = this;
        return this.status = "loading", this.promise = new Promise((function(t, n) {
            var r = new Image;
            r.crossOrigin = "Anonymous", r.onload = function() {
                l.width = r.width, l.height = r.height, c.drawImage(r, 0, 0, r.width, r.height);
                var n = c.getImageData(0, 0, r.width, r.height);
                e.data = n.data, e.status = "loaded";
                var i = function(e, t) {
                        var n, i, o, r, a = new ArrayBuffer(28),
                            s = new Uint8Array(a),
                            l = new Float32Array(a),
                            c = 4 * t * 4 + 8;
                        for (r = 0; r < 28; r++) n = e[c], i = e[c + 1], o = e[c + 2], n = Math.round(n / 64), i = Math.round(i / 16), o = Math.round(o / 64), s[r] = (n << 6) + (i << 2) + o, c += 16;
                        return l
                    }(e.data, 257),
                    o = i[0],
                    s = (i[1] - i[0]) / 255,
                    d = i[2],
                    u = (i[3] - i[2]) / 255,
                    h = i[4],
                    p = (i[5] - i[4]) / 255;
                e.headerPars = [s, o, u, d, p, h], e.decodeR = e.transformR ? function(t) {
                    return e.transformR(t * s + o)
                } : function(e) {
                    return e * s + o
                }, e.decodeG = e.transformG ? function(t) {
                    return e.transformG(t * u + d)
                } : function(e) {
                    return e * u + d
                }, e.decodeB = e.transformB ? function(t) {
                    return e.transformB(t * p + h)
                } : function(e) {
                    return e * p + h
                }, a = 0, t(e)
            }, r.onerror = function() {
                e.status = "failed", o.emit("loadingFailed", e.url), ++a > s && (o.emit("noConnection"), a = 0), n({
                    message: "Failed to load tile",
                    url: e.url
                })
            }, Promise.resolve().then((function() {
                return y
            })).then((function(t) {
                e.url = t.getApiUrl(e.url), r.src = e.url, (r.complete || void 0 === r.complete) && (r.src = i.emptyGIF, r.src = e.url)
            }))
        })), this.promise
    };
    var u = new t(50);
    var h, p, f = {
            loadTile: function(e) {
                var t = e.url,
                    n = u.get(t);
                if (!n) {
                    var i = new d(t, e);
                    return u.put(t, i), i.load()
                }
                switch (n.status) {
                    case "loaded":
                        return Promise.resolve(n);
                    case "loading":
                        return n.promise;
                    case "failed":
                        return u.remove(t), Promise.reject({
                            message: "Failed to load tile",
                            url: t
                        });
                    default:
                        return Promise.reject({
                            message: "Unknown tile state",
                            url: t
                        })
                }
            }
        },
        m = !1,
        v = null === (p = window.W.lib) || void 0 === p ? void 0 : p.initAuth;
    h = function(e) {
        return r(e, "api=" + v)
    };
    var g = function() {
            if (!m) {
                m = !0;
                var e = window.W.require,
                    t = e("utils"),
                    n = e("trans"),
                    i = t.$("#windy"),
                    o = window.document.createElement("div"),
                    r = 5;
                o.innerHTML = '<div style="position: absolute;\n        bottom: 0;\n        left: 0;\n        height: 100%;\n        width: 100%;\n        z-index: 1000;\n        text-align: center;\n        display: flex;\n        align-items: center;\n        justify-content: center;">\n        <div style="background-color: rgba(0, 0, 0, 0.8);\n        padding: 2em 5em;\n        border-radius: 3em;">\n            <div style="width: 64px;\n            height: 64px;\n            background: url(\'https://www.windy.com/img/logo.svg\');\n            background-size: contain;\n            margin: 0 auto;"></div>\n            <h1 data-t="DO_YOU_LIKE_THIS_MAP"></h1>\n\n            <div class="web-hidden">\n                <p><span data-t="GO_TO_THE_ORIGINAL_WEBSITE"></span> <a style="color:#fff;font-size:1.2em;font-weight:bold" href="https://www.windy.com/">Windy.com</a></p>\n            </div>\n\n            <div class="stores-hidden">\n                <p data-t="DOWNLOAD_APP"></p>\n                <a\n                    data-do="openapp"\n                    name="ios"\n                    style="display: inline-block;"\n                    href="https://itunes.apple.com/app/apple-store/id1161387262?pt=118417623&ct=windycom-menu-badge&mt=8"\n                    ><img src="https://www.windy.com/img/app_store.svg" alt="Download Windy from the App Store" style="width:130px" />\n                </a>\n                <a\n                    data-do="openapp"\n                    name="android"\n                    style="display: inline-block;"\n                    href="https://play.google.com/store/apps/details?id=com.windyty.android&utm_source=menu&utm_medium=windy&utm_campaign=menu&utm_content=menu"\n                >\n                    <img src="https://www.windy.com/img/google_play.svg" alt="Download Windy from the Google Play" style="width:130px"/>\n                </a>\n            </div>\n            <div style="margin-top:1.5em;">\n                <span id="wnd-close" style="color: black;\n                background-color: white;\n                border-color: white;\n                border-radius: 0.5em;\n                text-transform: uppercase;\n                cursor: pointer;\n                font-weight: bold;\n                font-size: 0.7em;\n                padding: 0.75em 1.25em;"><span data-t="CLOSE"></span><span id="wnd-countdown"> (' + r + "s)</span>\n            </div>\n        </div>\n    </div>", n.loadLangFile("lib").then((function() {
                    n.translateDocument(o)
                })), i.appendChild(o), t.$('[data-t="CLOSE"]').addEventListener("click", (function(e) {
                    r > 0 || (e.stopPropagation(), e.preventDefault(), o.innerHTML = "")
                }));
                var a = setInterval((function() {
                    r > 0 ? t.$("#wnd-countdown").innerHTML = " (" + r + "s)" : (t.$("#wnd-countdown").innerHTML = "", clearInterval(a)), r--
                }), 1e3)
            }
        },
        w = function() {
            v ? ((0, window.W.require)("http").post("https://api.windy.com/api4/refresh", {
                data: {
                    token: v
                }
            }).then((function(e) {
                var t = e.data;
                t.exceeded ? (console.error("Windy API exceeded its daily limit. Please upgrade your plan."), g()) : v = t.auth
            })).catch((function(e) {
                401 === (null == e ? void 0 : e.status) && (console.error("Failed to verify Windy API token: " + e.response, e), v = void 0, h = function() {
                    return ""
                }, g())
            })), setTimeout(w, 3e4)) : g()
        };
    setTimeout(w, 2e3);
    var y = Object.freeze({
        __proto__: null,
        getApiUrl: function(e) {
            return h(e)
        }
    });
    e.DataTile = d, e.dataLoader = f
})), W.define("renderUtils", ["Evented"], (function(e, t) {
    var n = t.instance({
            ident: "render"
        }),
        i = {
            extreme: [0, 0, 1, 2, 3, 4, 4, 5, 5, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6],
            ultra: [0, 0, 0, 2, 3, 4, 4, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5],
            high: [0, 0, 0, 2, 3, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4],
            normal: [0, 0, 0, 2, 2, 3, 3, 3, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4],
            low: [0, 0, 0, 1, 1, 1, 1, 1, 2, 2, 2, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3]
        },
        o = function(e) {
            return Math.pow(2, e)
        },
        r = function(e, t) {
            return o(e) / o(t)
        },
        a = Object.keys(i),
        s = function(e, t) {
            if (e.dataTilesZoom) return e.dataTilesZoom;
            var n = e.dataQuality,
                o = e.upgradeDataQuality ? a[Math.max(a.indexOf(n) - 1, 0)] : n;
            return Math.min(e.maxTileZoom, i[o][t])
        },
        l = {},
        c = function(e, t, n) {
            var i = n.colors;
            if (!i) throw new Error("Creating fill fun failed, cTable is not defined!");
            var o = n.value2index.bind(n);
            switch (t) {
                case 1:
                    return function(t, n, r) {
                        var a = (n << 8) + t << 2,
                            s = o(r);
                        e[a++] = i[s++], e[a++] = i[s++], e[a] = i[s]
                    };
                case 2:
                    return function(t, n, r) {
                        var a = (n << 8) + t << 2,
                            s = o(r),
                            l = i[s++],
                            c = i[s++],
                            d = i[s];
                        e[a] = e[a + 4] = l, e[a + 1] = e[a + 5] = c, e[a + 2] = e[a + 6] = d, e[a += 1024] = e[a + 4] = l, e[a + 1] = e[a + 5] = c, e[a + 2] = e[a + 6] = d
                    }
            }
        },
        d = document.createElement("canvas"),
        u = d.getContext("2d");
    d.width = d.height = 256, u.fillStyle = "black", u.fillRect(0, 0, 256, 256);
    var h = u.getImageData(0, 0, 256, 256);
    e.createCombinedFillFun = function(e, t, n, i) {
        var o = t.colors,
            r = n.colors,
            a = t.value2index.bind(t),
            s = n.value2index.bind(n),
            l = c(e, 2, t),
            d = c(e, 2, n),
            u = function(t, n, i, o) {
                e[t] = n, e[t + 1] = i, e[t + 2] = o
            };
        return function(e, t, n, c) {
            var h = i(n, c);
            if (0 === h) return l(e, t, n);
            if (4 === h) return d(e, t, c);
            if (!o || !r) throw new Error("Cannot create combinedFillFun, col1 (" + o + ") or col2 (" + r + ") is not defined!");
            var p = (t << 8) + e << 2,
                f = a(n),
                m = s(c),
                v = o[f++],
                g = o[f++],
                w = o[f++],
                y = r[m++],
                b = r[m++],
                T = r[m++];
            switch (h) {
                case 1:
                    u(p, y, b, T), u(p + 4, v, g, w), u(p + 1024, v, g, w), u(p + 1028, v, g, w);
                    break;
                case 2:
                    u(p, y, b, T), u(p + 4, y, b, T), u(p + 1024, v, g, w), u(p + 1028, v, g, w);
                    break;
                case 3:
                    u(p, y, b, T), u(p + 4, y, b, T), u(p + 1024, y, b, T), u(p + 1028, v, g, w)
            }
        }
    }, e.createFillFun = c, e.emitter = n, e.getDataZoom = s, e.getTrans = r, e.getWTable = function(e) {
        if (e in l) return l[e];
        var t, n, i, o = 0;
        if (!(e <= 32)) return null;
        for (t = new Uint16Array(4 * e * e), i = 0; i < e; i++)
            for (n = 0; n < e; n++) t[o++] = (e - i) * (e - n), t[o++] = (e - i) * n, t[o++] = i * (e - n), t[o++] = n * i;
        return l[e] = t, t
    }, e.imgData = h, e.interpolateNearest = function(e, t, n, i, o, r, a, s, l, c) {
        null !== e && (a = e[t], s = e[t + 1], l = e[t + 2], c = e[t + 3]);
        var d = Math.max(a, s, l, c);
        return d === a ? n : d === s ? i : d === l ? o : r
    }, e.testJPGtransparency = function(e, t) {
        return !!(192 & e[t + 2] || 192 & e[t + 6] || 192 & e[t + 1030] || 192 & e[t + 1034])
    }, e.testPNGtransparency = function(e, t) {
        return !(e[t + 3] && e[t + 7] && e[t + 1028 + 3] && e[t + 1028 + 7])
    }, e.tileW = o, e.wTables = l, e.whichTile = function(e, t) {
        if (!t.fullPath) return null;
        var n = e.z,
            i = s(t, n),
            a = r(n, i),
            l = Math.floor(e.x / a),
            c = Math.floor(e.y / a),
            d = e.x % a,
            u = e.y % a,
            h = t.fullPath.replace("<z>", i.toString()).replace("<y>", c.toString()).replace("<x>", l.toString()),
            p = o(i);
        return l < 0 || c < 0 || l >= p || c >= p ? null : {
            url: h,
            x: l,
            y: c,
            z: i,
            intX: d,
            intY: u,
            trans: a,
            transformR: t.transformR || null,
            transformG: t.transformG || null,
            transformB: t.transformB || null
        }
    }, e.zoom2zoom = i
})), W.define("renderers", ["Renderer", "testWebGl", "plugins", "utils", "TileLayer"], (function(e, t, n, i, o, r) {
    var a = r.instance({
            dependencies: ["gl-tile-render"]
        }),
        s = r.instance({
            dependencies: ["patternator", "gl-tile-render"],
            onopen: function(e) {
                W.require("@plugins/patternator"), this.onopen = r.onopen.bind(this), r.onopen.call(this, e)
            }
        }),
        l = t.instance({
            dependencies: ["radar"],
            onopen: function() {
                var e = i.radar;
                this.onopen = e.onopen, this.onclose = e.onclose, this.redraw = e.redraw, this.interpolator = e.interpolator
            }
        }),
        c = t.instance({
            dependencies: ["satellite"],
            onopen: function() {
                var e = i.satellite;
                this.onopen = e.onopen, this.onclose = e.onclose, this.redraw = e.redraw, this.interpolator = e.interpolator
            }
        }),
        d = t.instance({
            dependencies: ["cap-alerts"],
            onopen: function() {
                var e = i["cap-alerts"];
                this.onopen = function(t) {
                    e.onopen(t), e.isOpen = !0
                }, this.onclose = function(t) {
                    e.onclose(t), e.isOpen = !1
                }
            }
        }),
        u = t.instance({
            dependencies: ["isolines"],
            onopen: function(e) {
                var t = W.require("@plugins/isolines");
                this.onopen = t.onopen, this.onclose = t.onclose, this.paramsChanged = t.paramsChanged, this.redraw = t.redraw, t.onopen(e)
            }
        }),
        h = t.instance({
            dependencies: ["particles"],
            onopen: function(e) {
                var t = W.require("@plugins/particles");
                this.paramsChanged = t.paramsChanged, this.onclose = t.close, this.redraw = t.redraw, t.open(e)
            }
        }),
        p = t.instance({
            dependencies: ["gl-particles"],
            onopen: function(e) {
                var t = W.require("@plugins/gl-particles");
                if (this.paramsChanged = t.paramsChanged, this.onclose = t.close, this.redraw = t.redraw, !t.open(e)) {
                    p = h;
                    try {
                        this.close.call(this, [])
                    } catch (e) {
                        console.error(e)
                    }
                    h.open(e), window.wError("renderers", "Failed to open glParticles")
                }
            }
        }),
        f = {
            tileLayer: a,
            tileLayerPatternator: s,
            radar: l,
            satellite: c,
            capAlerts: d,
            isolines: u,
            particles: n.useGLparticles() ? p : h,
            map: t.instance({
                dependencies: ["map-layers"],
                onopen: function() {
                    var e = i["map-layers"];
                    this.onopen = e.onopen, this.onclose = e.onclose, this.redraw = o.emptyFun, this.paramsChanged = o.emptyFun, this.interpolator = e.interpolator
                }
            }),
            daySwitcher: r.instance({
                dependencies: ["gl-tile-render", "day-switcher"],
                onopen: function(e) {
                    r.onopen.call(this, e), i["day-switcher"].onopen(e)
                },
                onclose: function(e) {
                    r.onclose.call(this, e), i["day-switcher"].onclose(e)
                }
            })
        };
    e.default = f
})), W.define("renderCtrl", ["renderers", "layers", "overlays", "broadcast", "utils", "renderUtils"], (function(e, t, n, i, o, r, a) {
    var s = a.emitter,
        l = Object.keys(t),
        c = null,
        d = 0,
        u = null,
        h = r.debounce((function() {
            o.emit("redrawFinished", c)
        }), 200);

    function p() {
        clearTimeout(u), u = null
    }

    function f() {
        d = 0, o.emit("redrawFinished", c)
    }
    o.on("paramsChanged", (function(e) {
        c = e, p();
        var o = i[e.overlay].layers.slice(),
            r = [];
        "off" !== e.isolines && o.unshift(e.isolines + "Isolines");
        var a = o.map((function(t) {
            var i = n[t];
            return r.push(i.renderer), {
                renderer: i.renderer,
                params: i.getParams(e, e.product)
            }
        }));
        l.forEach((function(e) {
            var n = t[e];
            r.indexOf(e) < 0 && n.isMounted && n.close.call(n, r)
        }));
        var s = [];
        Promise.all(a.map((function(e) {
            return e.params.then((function(n) {
                var i = t[e.renderer];
                i.isMounted ? i.paramsChanged.call(i, n) : s.push(i.open.call(i, n))
            }))
        }))).then((function() {
            s.length > 0 && Promise.all(s).catch((function(e) {
                window.wError("renderCtrl", "Unable to load render", e)
            })), d = a.length, u = setTimeout(f, 5e3)
        }))
    })), o.on("movestart", (function() {
        var e = c && i[c.overlay];
        d = e ? e.layers.length : 0
    })), o.on("redrawLayers", (function(e) {
        d = 0, r.each(t, (function(t) {
            t.isMounted && (t.redraw(e && e.noCache), d++)
        }))
    })), s.on("rendered", (function() {
        --d <= 0 && (p(), h())
    }))
})), W.define("particles", ["Particles"], (function(e, t) {
    var n = {
        wind: t.instance({
            configurable: !0,
            multiplier: {
                constant: 50,
                pow: 1.6,
                zoom: 2
            },
            velocity: {
                max: .1,
                damper: 1e-5
            },
            glSpeedCurvePowParam: .7,
            glMinSpeedParam: 1.5,
            glMaxSpeedParam: 30,
            glParticleWidth: 1.3,
            glParticleLengthEx: .1,
            glSpeedPx: 100,
            glCountMul: 1
        }),
        currents: t.instance({
            multiplier: {
                constant: 50,
                pow: 1.5,
                zoom: 2
            },
            velocity: {
                max: .4,
                damper: .35
            },
            glSpeedCurvePowParam: .4,
            glMinSpeedParam: .2,
            glMaxSpeedParam: 1.2,
            glParticleWidth: .6,
            glParticleLengthEx: .1,
            glSpeedPx: 50,
            glVelocity: 1,
            glOpacity: 1.3,
            glBlending: 1.05,
            glCountMul: 4,
            getBlendingAlpha: function() {
                return .96
            }
        }),
        waves: t.instance({
            animation: "wavecle",
            styles: ["rgba(100,100,100,0.25)", "rgba(150,150,150,0.3)", "rgba(200,200,200,0.35)", "rgba(255,255,255,0.4)"],
            lineWidth: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            multiplier: {
                constant: 50,
                pow: 1.3,
                zoom: 2
            },
            velocity: {
                max: .02,
                damper: .015
            },
            glSpeedCurvePowParam: 1,
            glMinSpeedParam: .5,
            glMaxSpeedParam: 10,
            glParticleWidth: 5.5,
            glParticleLengthEx: 1,
            glSpeedPx: 8,
            glVelocity: 1,
            glOpacity: 1.6,
            glBlending: .93,
            glCountMul: 1.5,
            getIntensityFun: function() {
                return function(e) {
                    return e < 12 ? 0 : e < 25 ? 1 : e < 37 ? 2 : e < 62 ? 3 : e < 75 ? 2 : e < 85 ? 1 : 0
                }
            },
            getStyles: function() {
                return this.styles
            },
            getBlendingAlpha: function() {
                return .9
            }
        })
    };
    e.default = n
})), W.define("interpolator", ["renderers"], (function(e, t) {
    var n = function() {
        return null
    };
    e.default = function(e) {
        var i = function() {
            for (var e in t) {
                var n = t[e];
                if (n.isMounted && "interpolator" in n) return n.interpolator
            }
        }();
        i ? i.createFun(e) : e(n, n, !1)
    }
})), W.define("tileInterpolator", ["map", "renderUtils", "tileLayer", "DataTiler"], (function(e, t, n, i, o) {
    var r = t.map,
        a = o.instance({
            createFun: function(e) {
                this.cb = e, this.getTiles(i.latestParams)
            },
            tilesReady: function(e, t, i) {
                var o = this,
                    a = function(t, r) {
                        var a = r + o.offsetY >> o.shift,
                            s = a >> 8,
                            l = a - (s << 8),
                            c = (r + o.offsetY) % o.trans,
                            d = t + o.offsetX >> o.shift,
                            u = d >> 8,
                            h = d - (u << 8),
                            p = (t + o.offsetX) % o.trans,
                            f = o.trans,
                            m = e && e[s] && e[s][u];
                        if (!m) return console.warn("interpolator: Undefined dTile"), NaN;
                        var v = m.data;
                        if (!v) return console.warn("interpolator: Undefined dTile.data"), NaN;
                        var g = o.offset + h + (l << 8) + l << 2;
                        if (i.PNGtransparency && n.testPNGtransparency(v, g)) return NaN;
                        if (i.JPGtransparency && n.testJPGtransparency(v, g)) return NaN;
                        var w = v[g],
                            y = v[g + 4],
                            b = v[g + 1],
                            T = v[g + 5],
                            S = v[g + 2],
                            _ = v[g + 6],
                            E = v[g += 1028],
                            A = v[g + 4],
                            P = v[g + 1],
                            L = v[g + 5],
                            C = v[g + 2],
                            M = v[g + 6],
                            O = (f - c) * (f - p),
                            R = (f - c) * p,
                            x = c * (f - p),
                            D = p * c,
                            I = f * f,
                            N = (w * O + y * R + E * x + A * D) / I,
                            W = i.interpolateNearestG ? n.interpolateNearest(null, 0, b, T, P, L, O, R, x, D) : (b * O + T * R + P * x + L * D) / I,
                            k = (S * O + _ * R + C * x + M * D) / I;
                        return [m.decodeR(N), m.decodeG(W), m.decodeB(k)]
                    };
                this.cb((function(e) {
                    var t = e.lat,
                        n = e.lon,
                        i = r.latLngToContainerPoint([t, n]),
                        s = i.x,
                        l = i.y;
                    return s < 0 || l < 0 || s > o.width || l > o.height ? null : a.call(o, s, l)
                }), a)
            }
        });
    e.default = a
})), W.define("tileLayer", ["TileLayerCanvas"], (function(e, t) {
    var n = new t;
    e.default = n
})), W.define("renderTile", ["renderUtils", "layers"], (function(e, t, n) {
    var i = function(e, i, o, r, a) {
        Date.now();
        var s, l = e.latestParams,
            c = l.isMultiColor;
        i |= 0;
        256 != o.width && (o.width = o.height = 256);
        var d, u = a.data,
            h = o.getContext("2d"),
            p = t.imgData.data;
        "png" === l.fileSuffix ? l.PNGtransparency && (d = t.testPNGtransparency) : l.JPGtransparency && (d = t.testJPGtransparency);
        var f, m, v, g, w = !1,
            y = 0 | r.trans,
            b = 0 | Math.log2(y),
            T = 0 | Math.log2(y * y),
            S = 0 | r.intX,
            _ = 0 | r.intY,
            E = 256 >> b,
            A = t.getWTable(y),
            P = 0,
            L = 0,
            C = S * E | 0,
            M = _ * E | 0,
            O = 0,
            R = 0,
            x = 256,
            D = 0,
            I = 0,
            N = 0,
            k = 0,
            U = 0,
            F = 0,
            H = 0,
            G = 0,
            z = 0,
            B = 0,
            j = 0,
            V = 0,
            Y = 0,
            q = 0,
            X = 0,
            Q = 0,
            Z = 0,
            J = n[l.layer],
            $ = "B" === l.renderFrom,
            K = "RG" === l.renderFrom,
            ee = a.decodeG,
            te = $ ? a.decodeB : a.decodeR,
            ne = J.getColor.call(J),
            ie = t.createFillFun(p, i, ne),
            oe = c && (null === (s = J.getColor2) || void 0 === s ? void 0 : s.call(J)),
            re = c && oe ? t.createCombinedFillFun(p, ne, oe, J.getAmountByColor) : null,
            ae = ie;
        for (g = 0; g < 256; g += i)
            for (N = g - ((R = g >> b) << b), v = 0; v < 256; v += i) I = v - ((O = v >> b) << b), x !== O && (L = 2056 + O + C + (((D = R + M) << 8) + D) << 2, void 0 !== d && (w = d(u, L)), !0 === $ && (L += 2), k = u[L], U = u[L + 4], F = u[L + 1028], H = u[L + 1032], !0 === K && (G = u[L + 1], z = u[L + 5], B = u[L + 1029], j = u[L + 1033]), x = O), w ? ae(v, g, NaN) : (Q = te(null !== A ? k * A[P = I + (N << b) << 2] + U * A[P + 1] + F * A[P + 2] + H * A[P + 3] >> T : k * (V = (1 - (f = I / y)) * (1 - (m = N / y))) + U * (Y = f * (1 - m)) + F * (q = m * (1 - f)) + H * (X = f * m)), !0 === K && (Z = ee(null !== A ? G * A[P] + z * A[P + 1] + B * A[P + 2] + j * A[P + 3] >> T : G * V + z * Y + B * q + j * X)), c && re ? re(v, g, Q, Z) : ie(v, g, K ? Math.sqrt(Q * Q + Z * Z) : Q));
        h.putImageData(t.imgData, 0, 0), "pattern" in l && l.pattern && "@plugins/patternator" in W && W["@plugins/patternator"][l.pattern].addPattern(h, y, u, 2056, C, M, E, te, ee), o.classList.add("leaflet-tile-loaded")
    };
    e.renderNoDataTile = function(e, t) {
        var n = 256;
        e.width != n && (e.width = e.height = n);
        var i = e.getContext("2d");
        i.fillStyle = "#888", i.fillRect(0, 0, n, n), t ? (i.fillStyle = i.strokeStyle = "#BBB", i.fillText("No data!", 14, 22), i.rect(3, 3, 250, 250), i.stroke()) : (i.fillStyle = "red", i.font = "20px Arial", i.fillText(atob("VU5BVVRIT1JJWkVEIFVTRSBPRg=="), 0, 20), i.fillText(atob("V2luZHkuY29tIEFQSQ=="), 0, 40), i.fillStyle = i.strokeStyle = "#BBB")
    }, e.renderTile = function(e, t, n, o, r) {
        var a = this;
        n === this.syncCounter && ("@plugins/gl-tile-render" in W ? W["@plugins/gl-tile-render"].processTile(this, t, o, r).then((function(n) {
            n || i(a, e, t, o, r)
        })) : i(this, e, t, o, r))
    }
})), W.define("GlObj", [], (function(e) {
    var t, n = WebGLRenderingContext,
        i = (t = new ArrayBuffer(2), new DataView(t).setInt16(0, 256, !0), 256 === new Int16Array(t)[0]),
        o = function(e) {
            return "a" === e.charAt(0)
        },
        r = function(e) {
            return "u" === e.charAt(0) || "s" === e.charAt(0)
        },
        a = function e(t, n) {
            void 0 === t && (t = !1), void 0 === n && (n = !1), this.id = e.newId++, this.keepRefs = t, this.keepRefsShaders = n, this.reset()
        };
    a.prototype.reset = function() {
        this.framebuffers = [], this.buffers = [], this.shaders = [], this.programs = [], this.textures = [], this._gl = null, this.canvas = null
    }, a.prototype.create = function(e, t, n) {
        if (this._name = n, !this._gl && !this.canvas) return this.canvas = e, this._gl = e.getContext("webgl", t) || e.getContext("experimental-webgl", t), this._gl
    }, a.prototype.gl = function() {
        return this._gl
    }, a.prototype.get = function() {
        return this.gl()
    }, a.prototype.getCanvas = function() {
        return this.canvas
    }, a.prototype.createShader = function(e, t, n) {
        var i = this.gl();
        if (!i) return null;
        var o = i.createShader(t ? i.VERTEX_SHADER : i.FRAGMENT_SHADER);
        if (o && (this.keepRefsShaders && this.shaders.push(o), i.shaderSource(o, e), i.compileShader(o), !i.getShaderParameter(o, i.COMPILE_STATUS))) {
            var r = i.getShaderInfoLog(o) || "getShaderInfoLog is null",
                a = new Error(r);
            throw a.contextLost = i.isContextLost(), a.isVertexShader = t, a.name = n || "shader", a.full = "ERROR compileShader! name: " + a.name + "; (" + (a.isVertexShader ? "VS" : "FS") + "); (" + (a.contextLost ? "contextLost" : "NOT contextLost") + "); msg: " + a.message, a
        }
        return o
    }, a.prototype.createProgramObj = function(e, t, n, i) {
        var a = this.gl();
        if (!a) return null;
        var s, l, c = a.createProgram(),
            d = {
                program: c
            },
            u = "";
        if (!c) throw (l = new Error).full = "gl.createProgram() is null; name: " + i, l;
        if (this.keepRefs && this.programs.push(c), n && n.length > 0)
            for (s = 0; s < n.length; s++) u += "#define " + n[s] + "\n";
        var h = this.createShader(u + e, !0, i),
            p = this.createShader(u + t, !1, i);
        if (!h || !p) throw l = new Error("vertexShader or fragmentShader is null; name: " + i);
        if (a.attachShader(c, h), a.attachShader(c, p), a.linkProgram(c), !a.getProgramParameter(c, a.LINK_STATUS)) {
            var f = a.getProgramInfoLog(c) || "getProgramInfoLog is null";
            throw (l = new Error(f)).contextLost = a.isContextLost(), l.name = i || "shader", l.full = "ERROR linkProgram! name: " + l.name + "; (" + (l.contextLost ? "contextLost" : "NOT contextLost") + "); msg: " + l.message, l
        }
        var m = a.getProgramParameter(c, a.ACTIVE_ATTRIBUTES);
        for (s = 0; s < m; s++) {
            var v = a.getActiveAttrib(c, s);
            if (v) {
                var g = v.name;
                if (!o(g)) throw 'Invalid attribute name "' + g + '"';
                d[g] = a.getAttribLocation(c, v.name)
            }
        }
        var w = a.getProgramParameter(c, a.ACTIVE_UNIFORMS);
        for (s = 0; s < w; s++) {
            var y = a.getActiveUniform(c, s);
            if (y) {
                var b = y.name;
                if (!r(b)) throw 'Invalid uniform name "' + b + '"';
                d[b] = a.getUniformLocation(c, y.name)
            }
        }
        return d
    }, a.prototype.deleteProgramObj = function(e) {
        var t;
        a.removeFromArray(e, this.programs), null === (t = this.gl()) || void 0 === t || t.deleteProgram(e)
    }, a.prototype.bindAttribute = function(e, t, i, o, r, a, s) {
        var l = this.gl();
        l && (l.bindBuffer(n.ARRAY_BUFFER, e), l.enableVertexAttribArray(t), l.vertexAttribPointer(t, i, o, r, a, s))
    }, a.prototype.textureFromUrlPromise = function(e, t, i, o, r, a, s) {
        var l = this;
        return new Promise((function(c) {
            var d = new Image,
                u = l.createTexture2D(o, r, a, null, 1, 1, n.RGBA);
            d.onload = function() {
                l.resizeTexture2D(u, d, d.width, d.height, n.RGBA, s), e[t] = u, c()
            }, d.crossOrigin = "", d.src = i
        }))
    }, a.prototype.createTextureFromBase64 = function(e, t, i, o, r) {
        var a = this,
            s = new Image,
            l = this.createTexture2D(e, t, i, null, 1, 1, n.RGBA);
        return s.onload = function() {
            a.resizeTexture2D(l, s, s.width, s.height, n.RGBA, r)
        }, s.src = o, l
    }, a.prototype.createTexture2D = function(e, t, n, i, o, r, a, s) {
        var l = this.gl();
        if (l) {
            var c = l.createTexture();
            return c && (this.keepRefs && this.textures.push(c), c._width = o, c._height = r, l.bindTexture(l.TEXTURE_2D, c), this.setBindedTexture2DParams(e, t, n)), this.resizeTexture2D(c, i, o, r, a, s)
        }
        return null
    }, a.prototype.resizeTexture2D = function(e, t, i, o, r, a) {
        if (!e) return e;
        var s = this.gl();
        if (r = r || n.RGBA, e._width = i, e._height = o, e._format = r, s) {
            if (s.bindTexture(n.TEXTURE_2D, e), Array.isArray(t)) {
                var l = i,
                    c = o;
                s.pixelStorei(n.UNPACK_ALIGNMENT, l > 4 ? 4 : 1);
                for (var d = 0; d < t.length; d++) {
                    4 === l && s.pixelStorei(n.UNPACK_ALIGNMENT, 1);
                    var u = t[d];
                    null === u || ArrayBuffer.isView(u) ? s.texImage2D(n.TEXTURE_2D, d, r, l, c, 0, r, n.UNSIGNED_BYTE, u) : s.texImage2D(n.TEXTURE_2D, d, r, r, n.UNSIGNED_BYTE, u), l = Math.max(l >> 1, 1), c = Math.max(c >> 1, 1)
                }
                a = !1
            } else null === t || ArrayBuffer.isView(t) ? s.texImage2D(n.TEXTURE_2D, 0, r, i, o, 0, r, n.UNSIGNED_BYTE, t) : s.texImage2D(n.TEXTURE_2D, 0, r, r, n.UNSIGNED_BYTE, t);
            a && s.generateMipmap(n.TEXTURE_2D), s.bindTexture(n.TEXTURE_2D, null)
        }
        return e
    }, a.prototype.deleteTexture2D = function(e) {
        var t;
        a.removeFromArray(e, this.textures), null === (t = this.gl()) || void 0 === t || t.deleteTexture(e)
    }, a.prototype.bindTexture2D = function(e, t, i) {
        var o = this.gl();
        o && (o.activeTexture(n.TEXTURE0 + (t || 0)), o.bindTexture(n.TEXTURE_2D, e), i && o.uniform1i(i, t))
    }, a.prototype.setBindedTexture2DParams = function(e, t, i, o) {
        var r = this.gl();
        r && (r.texParameteri(n.TEXTURE_2D, n.TEXTURE_MIN_FILTER, e), r.texParameteri(n.TEXTURE_2D, n.TEXTURE_MAG_FILTER, t), r.texParameteri(n.TEXTURE_2D, n.TEXTURE_WRAP_S, i), r.texParameteri(n.TEXTURE_2D, n.TEXTURE_WRAP_T, o || i))
    }, a.prototype.createBuffer = function(e) {
        var t = this.gl(),
            n = null;
        return t && (n = t.createBuffer()) && (this.keepRefs && this.buffers.push(n), this.setBufferData(n, e)), n
    }, a.prototype.deleteBuffer = function(e) {
        var t;
        a.removeFromArray(e, this.buffers), null === (t = this.gl()) || void 0 === t || t.deleteBuffer(e)
    }, a.prototype.setBufferData = function(e, t) {
        var i = this.gl();
        i && (i.bindBuffer(n.ARRAY_BUFFER, e), i.bufferData(n.ARRAY_BUFFER, t, n.STATIC_DRAW))
    }, a.prototype.createIndexBuffer = function(e) {
        var t = this.gl(),
            i = null;
        return t && (i = t.createBuffer(), this.keepRefs && i && this.buffers.push(i), t.bindBuffer(n.ELEMENT_ARRAY_BUFFER, i), t.bufferData(n.ELEMENT_ARRAY_BUFFER, e, n.STATIC_DRAW)), i
    }, a.prototype.createFramebuffer = function() {
        var e = null,
            t = this.gl();
        return t && (e = t.createFramebuffer(), this.keepRefs && e && this.framebuffers.push(e)), e
    }, a.prototype.deleteFramebuffer = function(e) {
        var t;
        a.removeFromArray(e, this.framebuffers), null === (t = this.gl()) || void 0 === t || t.deleteFramebuffer(e)
    }, a.prototype.bindFramebuffer = function(e, t) {
        var i = this.gl();
        i && (i.bindFramebuffer(n.FRAMEBUFFER, e), t && i.framebufferTexture2D(n.FRAMEBUFFER, n.COLOR_ATTACHMENT0, n.TEXTURE_2D, t, 0))
    }, a.prototype.release = function() {
        var e = this._gl;
        if (e) {
            e.flush(), e.finish();
            var t, n, i = this.textures.length;
            for (t = 0; t < i; t++) n = this.textures[t], e.isTexture(n) && e.deleteTexture(n);
            for (i = this.programs.length, t = 0; t < i; t++) n = this.programs[t], e.isProgram(n) && e.deleteProgram(n);
            for (i = this.shaders.length, t = 0; t < i; t++) n = this.shaders[t], e.isShader(n) && e.deleteShader(n);
            for (i = this.buffers.length, t = 0; t < i; t++) n = this.buffers[t], e.isBuffer(n) && e.deleteBuffer(n);
            for (i = this.framebuffers.length, t = 0; t < i; t++) n = this.framebuffers[t], e.isFramebuffer(n) && e.deleteFramebuffer(n);
            this.reset()
        }
    }, a.getNextPowerOf2Size = function(e) {
        return 2 << Math.floor(Math.log2(e - 1))
    }, a.removeFromArray = function(e, t) {
        for (var n = -1, i = 0; i < t.length; i++) t[i] === e && (n = i);
        return n > -1 && t.splice(n, 1), n
    }, a.littleEndian = i, a.newId = 0, e.default = a
})), W.define("testWebGl", ["GlObj", "store", "storage", "rootScope"], (function(e, t, n, i, o) {
    var r = WebGLRenderingContext,
        a = {
            shRectVS: "\n    attribute vec2 aPos;\n    varying vec2 vTc;\n    void main(void) {\n        gl_Position = vec4( aPos, 0.0, 1.0 );\n        vTc = aPos.xy * 0.5 + 0.5;\n    }\n",
            shEncodeDecodeFS: "\n    precision mediump float;\n    uniform vec4 uPars;\n    uniform sampler2D sTex0;\n    varying vec2 vTc;\n    void main(void) {\n        vec4 tex0 = texture2D( sTex0, vTc );\n        vec2 pos = tex0.ba + tex0.rg * uPars.x;\n        vec2 rg = fract( pos * uPars.y + uPars.z );\n        gl_FragColor.ba = pos + rg * uPars.w;\n        gl_FragColor.rg = rg;\n    }\n",
            retOk: "ok",
            glo: new t,
            it: {},
            shaderErrors: 0,
            useGLparticles: function() {
                var e = !1;
                try {
                    e = this.useGLparticlesInner()
                } catch (e) {
                    0,
                    window.wError("testWebGl", "useGLparticles", e)
                }
                return this.glo.release(), e
            },
            useGLparticlesInner: function() {
                var e = this,
                    t = n.get("disableWebGL"),
                    r = i.get("webGLtest3"),
                    a = window.navigator.userAgent,
                    s = function() {
                        var t = e.runParticlesTest();
                        return i.put("webGLtest3", {
                            status: t,
                            ua: a
                        }), t === e.retOk
                    };
                return "desktop" === o.platform && "embed2" !== W.target && (!t && (r && r.ua === a ? r.status === this.retOk : s()))
            },
            runParticlesTest: function() {
                this.it = {}, this.status = "error-unspecified";
                try {
                    this.initWebGl() && this.runParticlesUpdateTest()
                } catch (e) {
                    window.wError("testWebGl", "Unspecified error", e)
                }
                return this.it = null, this.status
            },
            runParticlesUpdateTest: function() {
                var e = 0;
                try {
                    this.initParticleUpdateTest() && (this.status = this.startParticleUpdateTest(), e = this.status === this.retOk ? 2 : 1)
                } catch (e) {
                    this.status = "error-in-particle-update-test"
                }
                return e
            },
            compileShader: function(e, t, n, i, o) {
                var r;
                o = o || "testWebGl";
                try {
                    r = this.glo.createProgramObj(e, t, n, i)
                } catch (e) {
                    0,
                    window.wError(o, e.full, e),
                    this.shaderErrors++,
                    r = null
                }
                return r
            },
            startParticleUpdateTest: function() {
                return this.renderParticleUpdateTest(1 / 255.5, 255, .125 / 255, -1 / 255), this.compareDataFast(this.it.data0, this.it.data1) > 1e3 ? "no-particles-update" : this.retOk
            },
            initWebGl: function() {
                var e = null;
                try {
                    this.it.fragment = document.createDocumentFragment();
                    var t = document.createElement("canvas");
                    this.it.fragment.appendChild(t);
                    e = this.glo.create(t, {
                        antialias: !1,
                        stencil: !1,
                        alpha: !0,
                        premultipliedAlpha: !0,
                        preserveDrawingBuffer: !1
                    }, "testWebGl"), this.it.gl = e, e ? this.it.framebuffer = this.glo.createFramebuffer() : window.WebGLRenderingContext ? this.status = "error-no-WebGL-context" : this.status = "error-no-WebGL-browser"
                } catch (e) {
                    window.wError("testWebGl", "initWebGl exception", e)
                }
                return e
            },
            initParticleUpdateTest: function() {
                var e = this.glo;
                if (this.shaderErrors = 0, this.it.shEncodeDecode = this.compileShader(this.shRectVS, this.shEncodeDecodeFS, void 0, "EncodeDecode", "glParticlesTest"), this.shaderErrors > 0) return this.status = "error-shader-compilation", !1;
                this.it.vertexBufferRect = e.createBuffer(new Float32Array([-1, -1, 1, -1, 1, 1, -1, 1])), this.it.w = 128, this.it.h = 256, this.it.data0 = new Uint8Array(this.it.w * this.it.h * 4), this.it.data1 = new Uint8Array(this.it.w * this.it.h * 4);
                var t, n, i = 0;
                for (n = 0; n < this.it.h; n++)
                    for (t = 0; t < this.it.w; t++) this.it.data0[i++] = t + t, this.it.data0[i++] = t + t + 1, this.it.data0[i++] = n, this.it.data0[i++] = n;
                return this.it.texture0 = e.createTexture2D(r.NEAREST, r.NEAREST, r.REPEAT, this.it.data0, this.it.w, this.it.h), this.it.texture1 = e.createTexture2D(r.NEAREST, r.NEAREST, r.REPEAT, this.it.data1, this.it.w, this.it.h), !0
            },
            renderParticleUpdateTest: function(e, t, n, i) {
                var o = this.glo,
                    a = o.gl();
                if (o.bindFramebuffer(this.it.framebuffer, this.it.texture1), a) {
                    a.viewport(0, 0, this.it.w, this.it.h);
                    var s = this.it.shEncodeDecode;
                    a.useProgram(s.program), o.bindAttribute(this.it.vertexBufferRect, s.aPos, 2, r.FLOAT, !1, 8, 0), o.bindTexture2D(this.it.texture0, 0, s.sTex0), a.uniform4f(s.uPars, e, t, n, i), a.drawArrays(r.TRIANGLE_FAN, 0, 4), a.readPixels(0, 0, this.it.w, this.it.h, r.RGBA, r.UNSIGNED_BYTE, this.it.data1)
                }
                o.bindFramebuffer(null)
            },
            compareDataFast: function(e, t) {
                for (var n = 0, i = 0; i < e.length; i++) {
                    e[i] !== t[i] && ++n
                }
                return n
            }
        };
    e.default = a
})), W.define("ImageGraph", ["ImageMaker"], (function(e, t) {
    var n = function(e) {
        function t() {
            for (var t = [], n = arguments.length; n--;) t[n] = arguments[n];
            e.apply(this, t), this.bottomWhitten = !0
        }
        return e && (t.__proto__ = e), t.prototype = Object.create(e && e.prototype), t.prototype.constructor = t, t.prototype.getY = function(e, t, n, i) {
            return i * (n - e) / (n - t)
        }, t.prototype.getControlPoint = function(e, t, n) {
            var i = 0;
            return n[1] <= t[1] && e[1] <= t[1] || n[1] >= t[1] && e[1] >= t[1] || (i = n[1] - e[1]), [.2 * (n[0] - e[0]) + t[0], .2 * i + t[1]]
        }, t.prototype.createGradient = function(e, t, n) {
            for (var i, o, r = this.fillColors.length, a = this.fillColors[0][0], s = this.fillColors[r - 1][0], l = 1 / (s - a), c = this.h / (e - t), d = c * (s - t), u = c * (a - t), h = this.ctx.createLinearGradient(0, u, 0, d), p = 0; p < r; ++p) o = this.fillColors[p][1], i = l * (this.fillColors[p][0] - a), h.addColorStop(i, "rgba( " + o[0] + ", " + o[1] + ", " + o[2] + ", " + n + " )");
            return h
        }, t.prototype.maskEnds = function(e) {
            var t = this.ctx,
                n = t.createLinearGradient(0, 0, e, 0);
            return t.globalCompositeOperation = "destination-out", n.addColorStop(0, "rgba(255,255,255,1)"), n.addColorStop(1, "rgba(255,255,255,0)"), t.fillStyle = n, t.fillRect(0, 0, e, this.h), (n = t.createLinearGradient(this.w - e, 0, this.w, 0)).addColorStop(0, "rgba(255,255,255,0)"), n.addColorStop(1, "rgba(255,255,255,1)"), t.fillStyle = n, t.fillRect(this.w - e, 0, this.w, this.h), this
        }, t.prototype.setViewport = function(e, t) {
            return this.viewport = [e, t], this
        }, t.prototype.findMinMax = function(e) {
            return [Math.min.apply(Math, e), Math.max.apply(Math, e)]
        }, t.prototype.whiteBottom = function(e, t) {
            void 0 === t && (t = 1);
            var n = .5 * this.h,
                i = e.createLinearGradient(0, n, 0, this.h);
            t < 1 && (e.globalCompositeOperation = "destination-out"), i.addColorStop(0, "rgba(255,255,255,0.0)"), i.addColorStop(1, "rgba(255,255,255,1.0)"), e.fillStyle = i, e.fillRect(0, n, this.w, .5 * this.h)
        }, t
    }(t.ImageMaker);
    e.ImageGraph = n
})), W.define("ImageMaker", [], (function(e) {
    var t = function e(t, n, i, o) {
        var r = t instanceof e;
        if (this.canvasRatio = Math.min(window.devicePixelRatio || 1, 2), r) this.num = t.num, this.canvas = t.canvas, this.ctx = t.ctx, this.tdWidth = t.tdWidth, this.w = t.w, this.h = t.h;
        else {
            if (void 0 === n || void 0 === i || void 0 === o) throw new Error("Invalid arguments passed to ImageMaker constructor");
            var a = t.getContext("2d");
            if (!a) throw new Error("Cannot initialize canvas context!");
            this.num = n, this.canvas = t, this.tdWidth = i, this.h = o, this.w = n * i, this.ctx = a, this.canvas.width = this.getPixelRatioAdjustedSize(this.num * this.tdWidth), this.canvas.height = this.getPixelRatioAdjustedSize(this.h), this.canvas.style.width = this.w + "px", this.canvas.style.height = this.h + "px", this.resetCanvas()
        }
    };
    t.prototype.getPixelRatioAdjustedSize = function(e) {
        return Math.round(e * this.canvasRatio)
    }, t.prototype.setHeight = function(e) {
        return this.h = e, this
    }, t.prototype.setOffset = function(e) {
        return this.ctx.translate(0, e), this
    }, t.prototype.resetCanvas = function() {
        return this.ctx.setTransform(1, 0, 0, 1, 0, 0), this.ctx.scale(this.canvasRatio, this.canvasRatio), this
    }, t.prototype.sanitizeData = function(e) {
        for (var t = [], n = e[0] || 0, i = 0; i < e.length; i++) {
            var o = e[i];
            null === o || isNaN(o) || void 0 === o ? t[i] = n : (t[i] = o, n = o)
        }
        return t
    }, e.ImageMaker = t
})), W.define("ImageRenderers", ["ImageMaker", "ImageGraph"], (function(e, t, n) {
    var i = n.ImageGraph,
        o = t.ImageMaker,
        r = [
            [203, [255, 209, 233, 255]],
            [219, [183, 225, 255, 255]],
            [233, [229, 137, 255, 255]],
            [243, [153, 170, 255, 255]],
            [258, [192, 195, 243, 255]],
            [263, [251, 206, 241, 255]],
            [268, [195, 251, 253, 255]],
            [272, [197, 219, 255, 255]],
            [274, [206, 255, 203, 255]],
            [278, [171, 245, 166, 255]],
            [283, [238, 239, 175, 255]],
            [288, [239, 221, 198, 255]],
            [293, [241, 205, 205, 255]],
            [298, [247, 214, 241, 255]],
            [303, [248, 218, 249, 255]],
            [308, [222, 213, 253, 255]],
            [331, [208, 200, 251, 255]]
        ],
        a = function(e) {
            function t() {
                e.apply(this, arguments)
            }
            return e && (t.__proto__ = e), t.prototype = Object.create(e && e.prototype), t.prototype.constructor = t, t.prototype.render = function(e, t) {
                void 0 === t && (t = 1);
                var n, i, o = this.sanitizeData(e),
                    r = this.ctx,
                    a = o.length,
                    s = this.tdWidth,
                    l = s >> 1,
                    c = this.h,
                    d = [],
                    u = -s - l,
                    h = this.viewport || this.findMinMax(o),
                    p = h[0],
                    f = h[1];
                for (i = 0; i < a + 4; ++i) n = o[Math.max(0, Math.min(i - 2, a - 1))], d.push([u, this.getY(n, p, f, c), n]), u += s;
                for (i = 0; i < a; ++i) d[i + 2][1] = .6 * d[i + 2][1] + .15 * (d[i + 1][1] + d[i + 3][1]) + .05 * (d[i][1] + d[i + 4][1]);
                for (r.beginPath(), r.moveTo(d[1][0], c), r.lineTo(d[1][0], d[1][1]), i = 0; i < a + 1; ++i) {
                    var m = this.getControlPoint(d[i], d[i + 1], d[i + 2]),
                        v = this.getControlPoint(d[i + 3], d[i + 2], d[i + 1]);
                    r.bezierCurveTo(m[0], m[1], v[0], v[1], d[i + 2][0], d[i + 2][1])
                }
                return r.lineTo(d[a + 2][0], c), this.fillColors ? (r.fillStyle = this.createGradient(p, f, t), r.fill()) : (r.lineWidth = this.lineWidth, r.strokeStyle = this.strokeStyle, r.stroke()), this.bottomWhitten && this.whiteBottom(r, t), this
            }, t
        }(i),
        s = function(e) {
            function t() {
                for (var t = [], n = arguments.length; n--;) t[n] = arguments[n];
                e.apply(this, t), this.fillColors = r
            }
            return e && (t.__proto__ = e), t.prototype = Object.create(e && e.prototype), t.prototype.constructor = t, t.prototype.findMinMax = function(e) {
                var t = Math.min.apply(Math, e),
                    n = Math.max.apply(Math, e);
                t -= 1;
                var i = (n = (t -= Math.round(.05 * (n - t))) + Math.round(n - t)) - t;
                return i < 10 && (i = Math.round(.5 * (10 - i)), t -= Math.round(.5 * i), n += Math.round(1.5 * i)), [t, n]
            }, t
        }(a),
        l = function(e) {
            function t() {
                for (var t = [], n = arguments.length; n--;) t[n] = arguments[n];
                e.apply(this, t), this.nightColor = "rgba(234,234,245,1)"
            }
            return e && (t.__proto__ = e), t.prototype = Object.create(e && e.prototype), t.prototype.constructor = t, t.prototype.render = function(e) {
                for (var t = e.isDay, n = 0; n < t.length; n++) {
                    var i = t[n],
                        o = n * this.tdWidth,
                        r = (n + 1) * this.tdWidth,
                        a = o + Math.abs(i) * this.tdWidth;
                    this.ctx.fillStyle = this.nightColor, 1 === i ? this.ctx.clearRect(o, 0, r, this.h) : 0 === i ? this.ctx.fillRect(o, 0, r, this.h) : i < 0 ? (this.ctx.clearRect(o, 0, a, this.h), this.ctx.fillRect(a, 0, r, this.h)) : (this.ctx.fillRect(o, 0, a, this.h), this.ctx.clearRect(a, 0, r, this.h))
                }
                return this
            }, t
        }(o);
    e.DayNightBackground = l, e.ImageGraphRenderer = a, e.TempGraph = s, e.tempFillColors = r
})), W.define("query", ["utils"], (function(e, t) {
    var n = (0, t.$)("#search #q");
    e.element = n, e.get = function() {
        return n.value && n.value.trim() || ""
    }, e.hideLoader = function() {
        n.classList.remove("search-loading")
    }, e.set = function(e) {
        n.value = e
    }, e.showLoader = function() {
        n.classList.add("search-loading")
    }
})), W.define("Favs", ["storage", "utils", "Class"], (function(e, t, n, i) {
    var o = i.extend({
        data: {},
        ident: null,
        key: function(e) {
            return "string" == typeof e ? e : e.id ? e.id : e.key ? e.key : "station" === e.type ? e.id : "webcam" === e.type ? String(e.webcamId) : "airport" === e.type && e.icao || e.icao ? e.icao : n.normalizeLatLon(e.lat) + "/" + n.normalizeLatLon(e.lon)
        },
        prepareAdd: function(e) {
            var t = this.key(e),
                n = {
                    id: e.id,
                    key: e.key || t,
                    lat: +e.lat,
                    lon: +e.lon,
                    title: e.title || e.name || e.lat + ", " + e.lon,
                    type: e.type || "fav",
                    updated: Date.now(),
                    counter: 1
                };
            switch (e.type) {
                case "airport":
                    n.icao = e.icao;
                    break;
                case "station":
                    n.stationId = e.stationId || e.id || e.key;
                    break;
                case "webcam":
                    n.webcamId = e.webcamId;
                    break;
                case "alert":
                    n.alert = e.alert;
                    break;
                case "route":
                    n.route = e.route
            }
            return this.data[t] = n, t
        },
        add: function(e) {
            return !!n.isValidLatLonObj(e) && (this.prepareAdd(e), this.onchange(), this.save(), !0)
        },
        findFavByProperties: function(e) {
            var t = this,
                n = Object.keys(this.data).map((function(e) {
                    return t.data[e]
                }));
            return this.dedupeFav(e, (function(e) {
                return n.find(e)
            }))
        },
        dedupeAndConcat: function(e, t) {
            var n = this;
            if (e.length && t.length) {
                var i = function(e) {
                    return t.find(e)
                };
                e = e.filter((function(e) {
                    return !n.dedupeFav(e, i)
                }))
            }
            return t.concat(e)
        },
        dedupeFav: function(e, t) {
            if ("string" == typeof e && this.data[e]) return this.data[e];
            if ("object" == typeof e) {
                if ("station" === e.type) return t((function(t) {
                    return t.stationId === (e.stationId || e.id)
                }));
                if ("webcam" === e.type) return t((function(t) {
                    return t.webcamId === e.webcamId
                }));
                if ("airport" === e.type || e.icao) return t((function(t) {
                    return t.icao === e.icao
                }));
                if (n.isValidLatLonObj(e)) {
                    return t((function(t) {
                        return n.normalizeLatLon(e.lat) == n.normalizeLatLon(t.lat) && n.normalizeLatLon(e.lon) == n.normalizeLatLon(t.lon)
                    })) || t((function(t) {
                        return n.isNear(e, t) && "fav" === t.type
                    }))
                }
            }
        },
        isFav: function(e) {
            return ! function(e) {
                return !Object.keys(e).length
            }(e) && Boolean(this.data[this.key(e)] || this.findFavByProperties(e))
        },
        save: function() {
            t.put(this.ident, this.data)
        },
        updateTimestamp: function() {
            this.lastModified = Date.now(), t.put(this.ident + "_ts", this.lastModified)
        },
        load: function() {
            this.data = t.get(this.ident) || {}, n.each(this.data, (function(e, t) {
                e.type || (e.type = "fav"), e.key = t
            }))
        },
        onchange: function() {},
        prepareRename: function(e, t) {
            var n = this.data[this.key(e)];
            return !!n && (n.title = t, n.updated = Date.now(), !0)
        },
        rename: function(e, t) {
            this.prepareRename(e, t) && (this.onchange(), this.save())
        },
        prepareRemove: function(e) {
            var t = this.key(e);
            this.data[t] && delete this.data[t]
        },
        remove: function(e) {
            return this.prepareRemove(e), this.onchange(), this.save(), Promise.resolve()
        },
        getAll: function() {
            return this.data
        },
        hit: function(e) {
            var t = this.data[this.key(e)];
            t && (t.counter ? t.counter++ : t.counter = 1, t.updated = Date.now(), this.save())
        },
        sortFavs: function(e, t, n) {
            var i = Object.keys(this.data);
            t = t || "counter";
            var o, r, a = this.data;
            if (e) try {
                var s = new RegExp("(?: |^)" + e, "i");
                i = i.filter((function(e) {
                    return s.test(a[e].title || "") || s.test(a[e].icao || "") || s.test(a[e].query || "")
                }))
            } catch (e) {
                console.error(e)
            }
            return n && (i = i.filter((function(e) {
                return !n.includes(e)
            }))), i = i.sort((function(e, n) {
                return (null !== (o = a[n][t]) && void 0 !== o ? o : 0) - (null !== (r = a[e][t]) && void 0 !== r ? r : 0)
            }))
        },
        get: function(e, t, i, o) {
            for (var r, a, s = [], l = o ? o.map((function(e) {
                    return e.key
                })).filter((function(e) {
                    return Boolean(e)
                })) : null, c = this.sortFavs(t, i, l), d = 0; d < Math.min(e, c.length); d++) a = c[d], r = n.clone(this.data[a]), s[d] = r;
            return s
        }
    });
    e.default = o
})), W.define("LabelsLayer", ["products", "http", "urls", "rootScope", "utils", "overlays", "store", "broadcast", "singleclick"], (function(e, t, n, i, o, r, a, s, l, c) {
    var d = L.GridLayer.extend({
        options: {
            minZoom: 3,
            maxZoom: 11,
            pane: "markerPane",
            className: "labels-layer",
            updateWhenIdle: !0,
            updateWhenZooming: !1,
            keepBuffer: o.isMobileOrTablet ? 2 : 4
        },
        cityDivs: {},
        latestTs: 0,
        latestIndex: 0,
        ts: s.get("timestamp"),
        hasHooks: !1,
        syncCounter: 0,
        onAdd: function() {
            return this.hasHooks || (this.updateProduct(), this.createTilesUrl(), c.on("poi-label", this.onClick, this), s.on("timestamp", this.onTsChange, this), s.on("usedLang", this.updateLabels, this), s.on("englishLabels", this.updateLabels, this), s.on("product", this.updateProduct.bind(this, !0)), l.on("metricChanged", this.refreshWeather, this), this.hasHooks = !0), L.GridLayer.prototype.onAdd.call(this)
        },
        createTilesUrl: function() {
            var e = s.get("englishLabels") ? "en" : s.get("usedLang");
            this.tilesUrl = o.tileServer + "/labels/v1.4/" + e
        },
        updateLabels: function() {
            this.createTilesUrl(), this._reset()
        },
        updateProduct: function(e) {
            var n = s.get("product");
            t[n].labelsTemp || (n = "ecmwf");
            var i = t[n].refTime.call(t[n]);
            if ((this.product !== n || this.refTime !== i) && (this.product = n, this.refTime = i, e))
                for (var o in this.cityDivs) this.loadFcstTile(this.cityDivs[o])
        },
        onClick: function(e, t) {
            var n = t.id,
                i = t.label;
            if (n) {
                var o = n.split("/"),
                    r = o[0],
                    a = o[1];
                l.emit("rqstOpen", "detail", {
                    lat: +r,
                    lon: +a,
                    name: i,
                    source: "label"
                })
            }
        },
        onTsChange: function(e) {
            this.ts = e, this.refreshWeather()
        },
        toArray: function() {
            var e = [];
            for (var t in this.cityDivs) e = e.concat(this.cityDivs[t].labels);
            return e
        },
        refreshWeather: function() {
            for (var e in this.cityDivs)
                for (var t = this.cityDivs[e].labels, n = 0; n < t.length; n++) this.renderWeather(t[n])
        },
        _animateZoom: function() {
            this._removeAllTiles()
        },
        _reset: function() {
            this.redraw()
        },
        loadFcstTile: function(e) {
            e.labels.length
        },
        onTileLoaded: function(e, t, n, i) {
            var o = i.data;
            if (e === this.syncCounter) {
                var r = this.renderTile(n, t, o);
                return this.cityDivs[t.x + ":" + t.y] = r, r
            }
        },
        onFcstLoaded: function(e, t, n) {
            var i = this,
                o = n.data;
            if (e === this.syncCounter)
                if (o && "object" == typeof o) {
                    var r = o.start,
                        a = o.step;
                    t.start = r, t.step = a, t.labels.forEach((function(e) {
                        var t = e.id;
                        t in o ? (e.data = o[t], i.renderWeather(e)) : (e.data = void 0, e.el.removeAttribute("data-temp"))
                    }))
                } else t.labels.forEach((function(e) {
                    e.data = void 0, e.el.removeAttribute("data-temp")
                }))
        },
        createTile: function(e, t) {
            var i = this,
                o = e.z + "/" + e.x + "/" + e.y,
                r = L.DomUtil.create("div", "leaflet-tile");
            return r.style.width = r.style.height = this.getTileSize() + "px", r.onselectstart = r.onmousemove = L.Util.falseFn, n.get(this.tilesUrl + "/" + o + ".json", {
                cache: !1
            }).then((function(t) {
                return i.onTileLoaded(i.syncCounter, e, r, t)
            })).then((function(e) {
                e && (e.urlFrag = o, i.loadFcstTile(e), t(void 0, r))
            })).catch(t), r
        },
        renderTile: function(e, t, n) {
            for (var i = this._getTilePos(t), o = i.x, a = i.y, s = this._map.getPixelOrigin(), l = s.x, c = s.y, d = 256 << t.z, u = [], h = 0; h < n.length; ++h) {
                var p = n[h],
                    f = p[0],
                    m = p[1],
                    v = p[2],
                    g = p[3],
                    w = p[4],
                    y = p[5],
                    b = p[6],
                    T = "ci" !== v.substr(0, 2),
                    S = T ? f : w.toFixed(2) + "/" + g.toFixed(2),
                    _ = Math.floor(r.lonDegToXUnit(g) * d - l - y / 2) - o,
                    E = Math.floor(r.latDegToYUnit(w) * d - c - b / 2) - a,
                    A = document.createElement("div");
                A.textContent = A.dataset.label = m, A.dataset.id = S, A.dataset.poi = "label", A.className = v, A.style.transform = "translate(" + _ + "px, " + E + "px)", A.style.width = y + "px", T || u.push({
                    id: S,
                    el: A
                }), e.appendChild(A)
            }
            return {
                labels: u
            }
        },
        getIndexToCityTileData: function() {
            var e, n, i = s.get("product"),
                o = null === (e = t[i]) || void 0 === e || null === (n = e.calendar) || void 0 === n ? void 0 : n.timestamps;
            if (!o) return null;
            for (var r = 0, a = o.length - 1; r <= a;) {
                var l = Math.floor((r + a) / 2),
                    c = o[l],
                    d = o[l + 1];
                if (c === this.ts) return l;
                if (c < this.ts && this.ts < d) return this.ts - c < d - this.ts ? l : l + 1;
                c < this.ts ? r = l + 1 : a = l - 1
            }
            return null
        },
        renderWeather: function(e) {
            void 0 === e && (e = {});
            var t = e.el,
                n = e.data;
            if (t)
                if (n && n.length) {
                    var i = this.getIndexToCityTileData();
                    i && i >= 0 && i < n.length ? t.dataset.temp = a.temp.convertNumber.call(a.temp.m, n[i]) + "Â°" : t.removeAttribute("data-temp")
                } else t.removeAttribute("data-temp")
        }
    });
    e.default = d
})), W.define("TileLayerMultiPatch", [], (function(e) {
    var t = {};
    e.default = t
})), W.define("LandMask", [], (function(e) {
    var t = L.TileLayer.extend({
        seaColorL: 128,
        getTempCtx: function() {
            if (!this.ctx) {
                var e = document.createElement("canvas");
                this.ctx = e.getContext("2d")
            }
            return this.ctx
        },
        createTile: function(e, t) {
            return this.createImageTile(e, t)
        },
        createImageTile: function(e, t) {
            var n = this,
                i = this.getTempCtx(),
                o = document.createElement("img");
            o.setAttribute("role", "presentation");
            var r = document.createElement("img");
            return r.onload = function() {
                var e = r.width,
                    a = document.createElement("canvas");
                a.width = e, a.height = e;
                var s = a.getContext("2d");
                if (s && i) {
                    i.canvas.width = e, i.canvas.height = e, i.drawImage(r, 0, 0);
                    var l = i.getImageData(0, 0, e, e),
                        c = s.createImageData(e, e),
                        d = l.data,
                        u = c.data;
                    d.length;
                    var h, p, f = function(e, t) {
                            return e = Math.min(Math.max(0, e), 255), t = Math.min(Math.max(0, t), 255), d[(t << 10) + (e << 2) + 3]
                        },
                        m = 1200,
                        v = 1024,
                        g = 255,
                        w = 7,
                        y = w + v,
                        b = y + v,
                        T = 1028;
                    for (p = 1; p < g; p++) {
                        var S = d[y - 4],
                            _ = d[y],
                            E = d[y += 4],
                            A = S + _ + E;
                        for (h = 1; h < g; h++) {
                            var P = A + d[w] + d[b];
                            u[T++] = n.seaColorL, u[T++] = n.seaColorL, u[T++] = n.seaColorL, u[T++] = P > m ? 0 : g, w += 4, b += 4, A -= S, S = _, _ = E, A += E = d[y += 4]
                        }
                        T += 8, w += 8, y += 4, b += 8
                    }
                    for (T = 0, h = 0; h < 256; h++) {
                        var L = f(h - 1, 0) + (f(h, 0) << 1) + f(h + 1, 0) + f(h, 1);
                        u[T++] = n.seaColorL, u[T++] = n.seaColorL, u[T++] = n.seaColorL, u[T++] = L > m ? 0 : g
                    }
                    for (T = 261120, h = 0; h < 256; h++) {
                        var C = f(h - 1, g) + (f(h, g) << 1) + f(h + 1, g) + f(h, 254);
                        u[T++] = n.seaColorL, u[T++] = n.seaColorL, u[T++] = n.seaColorL, u[T++] = C > m ? 0 : g
                    }
                    for (T = v, p = 1; p < g; p++) {
                        var M = f(0, p - 1) + (f(0, p) << 1) + f(1, p) + f(0, p + 1);
                        u[T++] = n.seaColorL, u[T++] = n.seaColorL, u[T++] = n.seaColorL, u[T++] = M > m ? 0 : g, T += 1020
                    }
                    for (T = 2044, p = 1; p < g; p++) {
                        var O = f(g, p - 1) + f(254, p) + (f(g, p) << 1) + f(g, p + 1);
                        u[T++] = n.seaColorL, u[T++] = n.seaColorL, u[T++] = n.seaColorL, u[T++] = O > m ? 0 : g, T += 1020
                    }
                    i.putImageData(c, 0, 0), s.putImageData(c, 0, 0), o.src = a.toDataURL()
                }
                t(void 0, o)
            }, r.onerror = function(e) {
                n._tileOnError(t, o, e)
            }, r.crossOrigin = "", r.src = this.getTileUrl(e), o
        },
        createCanvasTile: function(e, t) {
            var n = this,
                i = this.getTempCtx(),
                o = document.createElement("canvas");
            o.setAttribute("role", "presentation");
            var r = document.createElement("img");
            return r.onload = function() {
                var e = o.getContext("2d");
                if (e && i) {
                    var a = r.width;
                    o.width = a, o.height = a, i.canvas.width = a, i.canvas.height = a, i.drawImage(r, 0, 0);
                    for (var s = i.getImageData(0, 0, a, a), l = e.createImageData(a, a), c = s.data, d = l.data, u = c.length, h = 0; h < u;) d[h++] = n.seaColorL, d[h++] = n.seaColorL, d[h++] = n.seaColorL, d[h] = 255 - c[h++];
                    e.putImageData(l, 0, 0)
                }
                t(void 0, o)
            }, r.onerror = function(e) {
                n._tileOnError(t, o, e)
            }, r.crossOrigin = "", r.src = this.getTileUrl(e), o
        }
    });
    e.default = t
})), W.define("map", ["renderUtils", "plugins", "TileLayerMultiPatch", "rootScope", "utils", "store", "broadcast", "geolocation", "router", "LandMask"], (function(e, t, n, i, o, r, a, s, l, c, d) {
    var u = t.emitter,
        h = {
            icon: L.divIcon({
                className: "icon-dot",
                html: '<div class="pulsating-icon"></div>',
                iconSize: [10, 10],
                iconAnchor: [5, 5]
            }),
            pulsatingIcon: L.divIcon({
                className: "icon-dot",
                html: '<div class="pulsating-icon repeat"></div>',
                iconSize: [10, 10],
                iconAnchor: [5, 5]
            }),
            myLocationIcon: L.divIcon({
                className: "icon-dot mylocation",
                html: '<div class="pulsating-icon repeat"></div>',
                iconSize: [10, 10],
                iconAnchor: [5, 5]
            }),
            webcamIcon: L.divIcon({
                className: "iconfont icon-webcam",
                iconSize: [10, 10],
                iconAnchor: [5, 5]
            }),
            pulsatingWebcamIcon: L.divIcon({
                className: "iconfont icon-webcam",
                html: '<div class="pulsating-icon repeat"></div>',
                iconSize: [10, 10],
                iconAnchor: [5, 5]
            })
        };
    L.GridLayer.prototype.options.zIndex = void 0, L.Icon.Default.prototype.options.imagePath = "https://www.windy.com/img/leaflet/";
    var p = 0,
        f = a.get("startUp"),
        m = c.sharedCoords || ("location" === f ? a.get("homeLocation") || {
            lat: 50,
            lon: 14
        } : "last" === f ? a.get("startUpLastPosition") : l.getMyLatestPos()),
        v = ["vn", "in"].includes(a.get("country")),
        g = {
            zoomControl: !1,
            keyboard: !1,
            worldCopyJump: !0,
            zoomAnimationThreshold: 3,
            fadeAnimation: !1,
            center: [+m.lat, +m.lon],
            zoom: "zoom" in m ? m.zoom : 5,
            minZoom: 3,
            maxZoom: 11,
            maxBounds: [
                [-90, -720],
                [90, 720]
            ]
        },
        w = new L.Map("map-container", g),
        y = null,
        b = null;

    function T(e, t) {
        void 0 === t && (t = !1);
        var n = e.zoom ? r.bound(e.zoom, 3, 20) : w.getZoom();
        if (e.paddingLeft || e.paddingTop) {
            var i = e.paddingLeft || 0,
                o = e.paddingTop || 0,
                a = w.project([e.lat, e.lon], n).subtract([i / 2, o / 2]),
                s = w.unproject(a, n);
            w.setView(s, n, {
                animate: t
            })
        } else w.setView([e.lat, e.lon], n, {
            animate: t
        })
    }
    "source" in m && "fallback" === m.source && s.once("newLocation", (function(e) {
        e.zoom = 5, T(e, !0)
    }));
    var S, _, E, A = null;

    function P(e) {
        e && !A && n.graticule.load.call(n.graticule).then((function() {
            A = (new L.LatLngGraticule).addTo(w)
        })), !e && A && (w.removeLayer(A), A = null)
    }

    function C() {
        var e = w.getCenter(),
            t = Math.round(w.getZoom());
        a.set("mapCoords", {
            source: "maps",
            lat: e.lat,
            lon: e.wrap().lng,
            zoom: t
        }), t !== p && (r.replaceClass(/zoom\d+/, "zoom" + t), p = t)
    }

    function M() {
        var e = o.isRetina ? "-retina" : "",
            t = a.get("usedLang"),
            n = a.get("country"),
            i = null,
            r = null;
        b = t, y = n, "hi" !== t && "in" !== n || (i = "in", r = [44, 24, 50, 28, 6]);
        var s, l = {
                graymap: o.tileServer + "/tiles/v10.0/darkmap" + e + "/{z}/{x}/{y}.png",
                simplemap: o.tileServer + "/tiles/v10.0/simple" + e + "/{z}/{x}/{y}.png",
                graymapPatch5: o.tileServer + "/tiles/v10.0/" + i + "/darkmap" + e + "/{z}/{x}/{y}.png",
                graymapPatch11: o.tileServer + "/tiles/v10.0/" + i + "/darkmap" + e + "/{z}/{x}/{y}.png",
                simplemapPatch5: o.tileServer + "/tiles/v10.0/" + i + "/simple" + e + "/{z}/{x}/{y}.png",
                simplemapPatch9: o.tileServer + "/tiles/v10.0/" + i + "/simple" + e + "/{z}/{x}/{y}.png",
                sznmap: "https://windytiles.mapy.cz/turist-en/{z}-{x}-{y}",
                winter: "https://mapserver.mapy.cz/winter-m/{z}-{x}-{y}",
                satLocal: o.tileServer + "/tiles/orto/v1.0/{z}/{z}-{x}-{y}.jpg",
                sat: "https://{s}.aerial.maps.api.here.com/maptile/2.1/maptile/newest/satellite.day/{z}/{x}/{y}/256/jpg?" + o.hereMapsID
            },
            c = a.get("map"),
            d = "basemap-layer",
            u = a.get("overlay");
        s = "sat" === c ? {
            13: {
                url: l.satLocal
            },
            18: {
                url: l.sat,
                subdomains: "1234"
            }
        } : {
            18: {
                url: l[c] || l.sznmap
            }
        }, ("map" !== u || v) && (r ? (s[11] = {
            url: l.graymap,
            patchUrl: l.graymapPatch11,
            patch: r
        }, "satellite" === u ? (s[5] = {
            url: l.simplemapPatch5
        }, s[9] = {
            url: l.simplemap,
            patchUrl: l.simplemapPatch9,
            patch: r
        }) : s[5] = {
            url: l.graymapPatch5
        }) : (s[11] = {
            url: l.graymap
        }, "satellite" === u && (s[9] = {
            url: l.simplemap
        }))), S && w.removeLayer(S), S = L.tileLayer(l.graymap, {
            detectRetina: !1,
            minZoom: 3,
            maxZoom: 11,
            updateWhenIdle: !!o.isMobileOrTablet,
            updateWhenZooming: !1,
            className: d,
            keepBuffer: o.isMobileOrTablet ? 1 : 4
        }), document.body.dataset.map = c, S.addTo(w)
    }

    function O() {
        y == a.get("country") && b == a.get("usedLang") || M()
    }
    C(), M(), P(a.get("graticule")), w.on("moveend", C), w.on("movestart", (function() {
        s.emit("movestart")
    })), s.on("maps-zoomIn", w.zoomIn, w), s.on("maps-zoomOut", w.zoomOut, w), s.on("updateBasemap", M), a.on("map", M), a.on("graticule", P), u.on("toggleSeaMask", (function(e) {
        e && !_ ? (_ = L.tileLayer(o.tileServer + "/tiles/v9.0/grayland/{z}/{x}/{y}.png", {
            minZoom: 3,
            maxZoom: 11,
            updateWhenIdle: !!o.isMobileOrTablet,
            updateWhenZooming: !1,
            keepBuffer: o.isMobileOrTablet ? 1 : 4
        }).addTo(w)).getContainer().classList.add("sea-mask-layer") : !e && _ && (w.removeLayer(_), _ = null)
    })), u.on("toggleLandMask", (function(e) {
        var t;
        e && !E ? null === (t = null == (E = new d(o.tileServer + "/tiles/v9.0/grayland/{z}/{x}/{y}.png", {
            minZoom: 3,
            maxZoom: 11,
            updateWhenIdle: !!o.isMobileOrTablet,
            updateWhenZooming: !1,
            keepBuffer: o.isMobileOrTablet ? 1 : 4
        }).addTo(w)) ? void 0 : E.getContainer()) || void 0 === t || t.classList.add("land-mask-layer") : !e && E && (w.removeLayer(E), E = null)
    })), a.on("usedLang", O), a.on("country", O), e.baseLayer = S, e.centerMap = T, e.ensurePointVisibleX = function(e, t, n) {
        var i = w.latLngToContainerPoint([e, t]).x;
        i < n && w.panBy([i - n, 0])
    }, e.ensurePointVisibleY = function(e, t, n) {
        var i = w.latLngToContainerPoint([e, t]).y,
            o = w.getSize();
        i > o.y - n && w.panBy([0, i - (o.y - n)])
    }, e.landMask = E, e.map = w, e.markers = h, e.removeZoomCenter = function() {
        w._zoomCenter = void 0
    }, e.seaLayer = _, e.setZoomCenter = function(e, t) {
        w._zoomCenter = L.point(e, t)
    }
})), W.define("mapGlobeCtrl", ["broadcast", "store"], (function(e, t, n) {
    var i = !1,
        o = function(e) {
            for (var n = [], o = arguments.length - 1; o-- > 0;) n[o] = arguments[o + 1];
            t.emit.apply(t, [(i ? "globe-" : "maps-") + e].concat(n))
        };
    n.on("globeActive", (function(e) {
        return i = e
    })), t.on("zoomIn", o.bind(null, "zoomIn")), t.on("zoomOut", o.bind(null, "zoomOut")), t.on("paramsChanged", o.bind(null, "paramsChanged"))
})), W.define("picker", ["Evented"], (function(e, t) {
    var n = t.instance({
        ident: "picker"
    });
    e.default = n
})), W.define("singleclick", ["map", "Evented", "rootScope", "store", "broadcast", "plugins"], (function(e, t, n, i, o, r, a) {
    var s = i.isMobile,
        l = t.map,
        c = n.instance({
            ident: "singleclick",
            hpJustClosed: !1,
            priorities: ["detail", "sounding", "distance", "rplanner", "cap-alerts"],
            _init: function() {
                n._init.call(this), l.on("singleclick", this.opener, this), s && o.on("hpShown", this.hpShown, this)
            },
            hpShown: function(e) {
                var t = this;
                e || (this.hpJustClosed = !0, setTimeout((function() {
                    return t.hpJustClosed = !1
                }), 1e3))
            },
            parseEvent: function(e) {
                return {
                    x: e.containerPoint.x,
                    y: e.containerPoint.y,
                    lat: e.latlng.lat,
                    lon: e.latlng.lng,
                    source: "singleclick"
                }
            },
            opener: function(e) {
                if (!this.hpJustClosed) {
                    var t = e.originalEvent && e.originalEvent.target,
                        n = t && t.dataset;
                    if (n && n.poi) this.emit("poi-" + n.poi, t, n);
                    else {
                        for (var i = this.parseEvent(e), o = 0; o < this.priorities.length; o++) {
                            var s = this.priorities[o];
                            if (a[s].isOpen) return void this.emit(s, i)
                        }
                        r.emit("rqstOpen", "picker", i)
                    }
                }
            }
        });
    e.default = c
})), W.define("labelsLayer", ["LabelsLayer", "map"], (function(e, t, n) {
    var i = n.map,
        o = (new t).addTo(i);
    e.default = o
})), W.define("seoParser", [], (function(e) {
    e.default = {
        purl: "/",
        startupUrl: "/"
    }
})), W.define("favs", ["utils"], (function(e, t) {
    var n = t.emptyFun,
        i = {
            hasTimestamps: n,
            getArray: function() {
                return []
            },
            on: n
        };
    e.default = i
})), W.define("router", ["utils"], (function(e, t) {
    var n = t.emptyFun,
        i = {
            url: n,
            url404: n
        };
    e.default = i
})), W.define("log", ["utils"], (function(e, t) {
    var n = {
        page: t.emptyFun
    };
    e.default = n
})), W.define("location", ["utils"], (function(e, t) {
    var n = t.emptyFun,
        i = n,
        o = n,
        r = n,
        a = n,
        s = n,
        l = n;
    e.description = a, e.reset = r, e.setTitle = l, e.setUrl = s, e.title = o, e.url = i
})), W.define("promo", ["utils"], (function(e, t) {
    var n = t.emptyFun,
        i = {
            getCounter2: n,
            hitCounter: n
        };
    e.default = i
})), W.define("libHtml", [], (function(e) {
    e.default = '\n\n<div id="map-container"\n    style="position: absolute; top: 0; bottom: 0; left: 0; right: 0; width: 100%; height: 100%;"\n    class="noselect"></div>\n\n<div id="bottom" class="shy left-border right-border bottom-border">\n\n\n    \x3c!-- progress bar --\x3e\n    <div id="progress-bar" class="progress-bar">\n\n        <div class="progress-line">\n            <div class="played"></div><div class="avbl"></div>\n            <i></i>\n        </div>\n\n        \x3c!-- GHOST --\x3e\n        <div class="timecode ghost-timecode">\n            <div class="box"></div>\n        </div>\n\n        \x3c!-- M A I N --\x3e\n        <div data-title="D_LT2" class="timecode main-timecode">\n            <div class="box"></div><div class="loading ld-lgray size-l loader-path"></div>\x3c!-- dayLoader --\x3e\n        </div>\n\n        \x3c!-- PLAY BUTTON apply class play/pause--\x3e\n        <div id="playpause"  class="play-pause iconfont clickable"></div>\n\n        \x3c!-- CALENDAR WITH DAYS --\x3e\n        <div id="calendar"></div>\n\n    </div>\n\n    \x3c!-- ACCUMULATIONS --\x3e\n    <div id="accumulations" class="size-s fg-yellow">\n\n        <span id="acc-title-rain" data-t="RAINACCU" class="capitalize"></span>\n        <span id="acc-title-snow" data-t="SNOWACCU" class="capitalize"></span>\n\n        <div class="ui-switch noselect notap"></div>\n\n    </div>\n\n    \x3c!-- mobile version of calendar --\x3e\n    <div id="mobile-calendar">\n\n        <div id="timecode-mobile" data-title="D_LT2" class="timecode">\n            <div id="mobile_box" class="box"></div><div class="loading ld-lgray size-l loader-path"></div>\x3c!-- dayLoader --\x3e\n        </div>\n\n        <div id="days"></div>\n\n        \x3c!-- PLAY BUTTON FOR MOBILE VERSION apply class play/pause--\x3e\n        <div id="playpause-mobile" class="play-pause iconfont bottom-border"></div>\n\n    </div>\n\n    \x3c!-- mobile bottom legend --\x3e\n    <div id="legend-mobile" class="metric-legend bottom-border"></div>\n\n</div>\n\n\x3c!-- LOGO --\x3e\n<div id="logo-wrapper" class="top-border left-border right-border">\n    <a id="logo" href="https://www.windy.com/?utm_medium=__APIUSER__&utm_source=api4" target="_top">\n     </a>\n</div>\n\n\n<div id="plugins" class="shy"></div>\n\n<div id="mobile-ovr-select" data-icon="|" class="top-border noselect clickable" data-do="rqstOpen,menu"></div>\n\n<div id="embed-zoom">\n    <div data-do="zoomIn" class="clickable iconfont noselect zoom-ctrl zoom-plus" title="Zoom in">+</div>\n    <div data-do="zoomOut" class="clickable iconfont noselect zoom-ctrl zoom-minus" title="Zoom out">-</div>\n</div>\n'
})), W.define("langEn", [], (function(e) {
    e.default = {
        MON: "Monday",
        TUE: "Tuesday",
        WED: "Wednesday",
        THU: "Thursday",
        FRI: "Friday",
        SAT: "Saturday",
        SUN: "Sunday",
        MON2: "Mon",
        TUE2: "Tue",
        WED2: "Wed",
        THU2: "Thu",
        FRI2: "Fri",
        SAT2: "Sat",
        SUN2: "Sun",
        SMON01: "Jan",
        SMON02: "Feb",
        SMON03: "Mar",
        SMON04: "Apr",
        SMON05: "May",
        SMON06: "Jun",
        SMON07: "Jul",
        SMON08: "Aug",
        SMON09: "Sep",
        SMON10: "Oct",
        SMON11: "Nov",
        SMON12: "Dec",
        TODAY: "Today",
        TOMORROW: "Tomorrow",
        LATER: "Later",
        ALL: "All",
        HOURS_SHORT: "hrs",
        FOLLOW: "Follow us",
        EMBED: "Embed widget on page",
        MENU: "Menu",
        MENU_SETTINGS: "Settings",
        MENU_HELP: "Help",
        MENU_ABOUT: "About us",
        MENU_LOCATION: "Find my location",
        MENU_FULLSCREEN: "Fullscreen mode",
        MENU_DISTANCE: "Distance & planning",
        MENU_HISTORICAL: "Show historical data",
        MENU_MOBILE: "Download App",
        MENU_FAVS: "Favorites",
        MENU_FEEDBACK: "Feedback",
        MENU_UPLOAD: "Upload KML, GPX or geoJSON file",
        MENU_VIDEO: "Create video or animated GIF",
        MENU_PLUGIN: "Install Windy plugin",
        MENU_ERROR: "Error console",
        MENU_NEWS: "Weather news",
        NOTIFICATIONS: "Notifications",
        SHOW_PICKER: "Show weather picker",
        TOOLBOX_INFO: "info",
        TOOLBOX_ANIMATION: "animation",
        TOOLBOX_START: "Hide/show animated particles",
        MENU_F_MODEL: "Data",
        MENU_U_INTERVAL: "Update interval",
        MENU_D_UPDATED: "Updated",
        OUTDATED: "Outdated",
        MENU_D_REFTIME: "Reference time",
        MENU_D_NEXT_UPDATE: "Next update expected at:",
        ABOUT_OVERLAY: "About",
        ABOUT_DATA: "About these data",
        OVERLAY: "Layer",
        MODEL: "Forecast model",
        PROVIDER: "Provider",
        WIND: "Wind",
        GUST: "Wind gusts",
        GUSTACCU: "Wind accumulation",
        WIND_DIR: "Wind dir.",
        TEMP: "Temperature",
        DISTANCE: "Distance",
        PRESS: "Pressure",
        CLOUDS: "Clouds, rain",
        CLOUDS2: "Clouds",
        CLOUD_ALT: "Cloud base",
        RADAR: "Weather radar",
        RADAR_BLITZ: "Radar, lightning",
        SATELLITE: "Satellite",
        TOTAL_CLOUDS: "Total clouds",
        LOW_CLOUDS: "Low clouds",
        MEDIUM_CLOUDS: "Medium clouds",
        HIGH_CLOUDS: "High clouds",
        CAPE: "CAPE Index",
        RAIN: "Rain, snow",
        RAIN_THUNDER: "Rain, thunder",
        RAIN3H: "Precip. past 3h",
        JUST_RAIN: "Rain",
        CONVECTIVE_RAIN: "Convective r.",
        RAINRATE: "Max. rain rate",
        LIGHT_THUNDER: "Light thunder",
        THUNDER: "Thunderstorms",
        HEAVY_THUNDER: "Heavy thunder",
        SNOW: "Snow",
        OZONE: "Ozone layer",
        PM2P5: "PM2.5",
        AIR_QUALITY: "Air quality",
        NO22: "NOâ‚‚",
        AOD550: "Aerosol",
        TCSO2: "SOâ‚‚",
        GO3: "Surface Ozone",
        SHOW_GUST: "force of wind gusts",
        RH: "Humidity",
        WAVES: "Waves",
        WAVES2: "Waves, sea",
        SWELL: "Swell",
        SWELL1: "Swell 1",
        SWELL2: "Swell 2",
        SWELL3: "Swell 3",
        WWAVES: "Wind waves",
        ALL_WAVES: "All waves",
        SWELLPER: "Swell period",
        RACCU: "Rain accumulation",
        SACCU: "Snow accumulation",
        ACCU: "Accumulations",
        RAINACCU: "RAIN ACCUMULATION",
        SNOWACCU: "SNOW ACCUMULATION",
        SNOWCOVER: "Actual Snow Cover",
        SST: "Surface sea temperature",
        SST2: "Sea temperature",
        CURRENT: "Currents",
        CURRENT_TIDE: "Tidal currents",
        VISIBILITY: "Visibility",
        SURFACE_VISIBILITY: "Surface visibility",
        ACTUAL_TEMP: "Actual temperature",
        SSTAVG: "Average sea temperature",
        AVAIL_FOR: "Available for:",
        DEW_POINT: "Dew point",
        DEW_POINT_SPREAD: "Dew point spread",
        ISA_DIFFERENCE: "ISA difference",
        SLP: "Pressure (sea l.)",
        QFE: "Station pressure",
        SNOWDEPTH: "Snow depth",
        NEWSNOW: "New snow",
        SNOWDENSITY: "Snow density",
        GH: "Geopot. height",
        FLIGHT_RULES: "Flight rules",
        CTOP: "Cloud tops",
        FREEZING: "Freezing altitude",
        COSC: "CO concentration",
        DUSTSM: "Dust mass",
        WX_WARNINGS: "Weather warnings",
        PTYPE: "Precip. type",
        CCL: "Thermals",
        FOG: "Fog",
        FLOOD: "Flood",
        FIRE: "Fire",
        EFORECAST: "Extreme forecast",
        RADAR_SAT: "Radar & Satellite",
        FZ_RAIN: "Freezing rain",
        MX_ICE: "Mixed ice",
        WET_SN: "Wet snow",
        RA_SN: "Rain with snow",
        PELLETS: "Ice pellets",
        HAIL: "Hail",
        ELEVATION: "Elevation",
        ACTIVE_FIRES: "Active fires",
        FIRE_INTENSITY: "Fire intensity",
        SOIL_PROFILE_DEPTH: "Soil profile depth",
        INTERSUCHO: "Drought monitoring",
        INTERSUCHO_AWD: "Moisture anomaly",
        INTERSUCHO_AWP: "Drought intensity",
        INTERSUCHO_AWR: "Soil moisture",
        INTERSUCHO_40: "0-40cm",
        INTERSUCHO_100: "0-100cm",
        INTERSUCHO_AWP_0: "No risk",
        INTERSUCHO_AWP_1: "Minor",
        INTERSUCHO_AWP_2: "Mild",
        INTERSUCHO_AWP_3: "Moderate",
        INTERSUCHO_AWP_4: "Severe",
        INTERSUCHO_AWP_5: "Exceptional",
        INTERSUCHO_AWP_6: "Extreme",
        MORE_LAYERS: "More layers...",
        MORE_PRODUCTS: "{{count}} more",
        NONE: "None",
        ACC_LAST_DAYS: "Last {{num}} days",
        ACC_LAST_HOURS: "Last {{num}} hours",
        ACC_NEXT_DAYS: "Next {{num}} days",
        ACC_NEXT_HOURS: "Next {{num}} hours",
        ALTITUDE: "Altitude",
        SFC: "Surface",
        CLICK_ON_LEGEND: "Click to change units",
        ALTERNATIVE_UNIT_CHANGE: "Any Layer unit can be changed by clicking on color legend",
        COPY_TO_C: "Copy to clipboard",
        SEARCH: "Search location...",
        JUST_SEARCH: "Search",
        NEXT: "Next results...",
        LOW_PREDICT: "Low predictability of forecast",
        DAYS_AGO: "{{daysago}} days ago:",
        SHOW_ACTUAL: "Show actual forecast",
        SHARE: "Share",
        SHARE_FCST: "Share forecast",
        SHARE_LINK: "Share link",
        SHARE_SOCIAL_MEDIA_HEADING: "Share on social media",
        JUST_EMBED: "Embed",
        POSITION: "Position",
        WIDTH: "Width",
        HEIGHT: "Height",
        DEFAULT_UNITS: "Default units",
        NOW: "Now",
        FORECAST_FOR: "Forecast for",
        ZOOM_LEVEL: "Zoom level",
        EXPERT_MODE: "Expert mode",
        EXPERT_MODE_DESC: "Do not fold overlays in quick menu",
        DETAILED: "Detailed forecast for this location",
        PERIOD: "Period",
        DRAG_ME: "Drag me if you want",
        D_FCST: "Forecast for this location",
        D_WEBCAMS: "Webcams in vicinity",
        D_STATIONS: "Nearest weather stations",
        D_NO_WEBCAMS: "There are no webcams around this location (or we don't know about them)",
        D_DAYLIGHT: "image during daylight",
        D_DISTANCE: "distance",
        D_MILES: "miles",
        D_MORE_THAN_HOUR: "more than hour ago",
        D_MIN_AGO: "{{duration}} minutes ago",
        D_SUNRISE: "Sunrise",
        D_SUNSET: "sunset",
        D_DUSK: "dusk",
        D_SUN_NEVER_SET: "Sun never set",
        D_POLAR_NIGHT: "Polar night",
        D_LT2: "local time",
        D_FAVORITES: "Add to Favorites",
        D_FAVORITES2: "Remove from Favorites",
        D_WAVE_FCST2: "Waves and sea",
        D_MISSING_CAM: "Add new webcam",
        D_HOURS: "Hours",
        D_TEMP2: "Temp.",
        D_PRECI: "Precit.",
        D_ABOUT_LOC: "About this location",
        D_ABOUT_LOC2: "About location",
        D_TIMEZONE: "Timezone",
        D_WEBCAMS_24: "Show last 24 hours",
        D_FORECAST_FOR: "{{duration}} days forecast",
        D_1H_FORECAST: "1h forecast",
        D_STEPS_1_HOUR: "1 hour",
        D_STEPS_3_HOURS: "3 hours",
        D_STEPS_FORECAST: "forecast",
        D_DISPLAY_AS: "Display as:",
        D_FCST_MODEL: "Fcst model:",
        E_MESSAGE: "Awesome weather forecast at",
        METAR_VAR: "Variable",
        METAR_MIN_AGO: "{DURATION}m ago",
        METAR_HOURS_AGO: "{DURATION}h ago",
        METARS_H_M_AGO: "{DURATION}h {DURATIONM}m ago",
        METARS_DAYS_AGO: "{DURATION} days ago",
        METAR_MIN_LATER: "in {DURATION}m",
        METAR_HOURS_LATER: "in {DURATION}h",
        METARS_H_M_LATER: "in {DURATION}h {DURATIONM}m",
        METARS_DAYS_LATER: "in {DURATION} days",
        DEVELOPED: "Developed with",
        FAVS_DELETE: "delete",
        FAVS_SYNCHRO_ERROR_TITLE: "Favorites sync error",
        SHOW_ON_MAP: "Display on map",
        POI_STATIONS: "Weather stations",
        POI_AD: "Airports",
        POI_AIRQ: "Air quality stations",
        POI_CAMS: "Webcams",
        POI_PG: "Paragliding spots",
        POI_KITE: "Kite/WS spots",
        POI_SURF: "Surfing spots",
        POI_EMPTY: "Empty map",
        POI_WIND: "Reported wind",
        POI_TEMP: "Reported temp.",
        POI_FAVS: "My favorites",
        POI_FCST: "Forecasted weather",
        POI_TIDE: "Tide forecast",
        POI_RADIATION: "Radiation",
        P_ANDROID_APP: "Windy for Android, free on Google Play",
        ND_MODEL: "Forecast model",
        ND_COMPARE: "Compare forecasts",
        ND_DISPLAY: "Display",
        ND_DISPLAY_BASIC: "Basic",
        S_ADVANCED_SETTINGS: "Advanced settings",
        S_COLORS: "Customize color scale",
        S_SAVE: "Save",
        S_SAVE2: "Login/Register to save all your settings to the cloud",
        S_SAVE_AUTO: "Your settings are saved to the cloud",
        S_SPEED: "Speed",
        S_ADD_OVERLAYS: "Show / add more layers",
        S_OVR_QUICK: "Add to quick menu",
        S_DELETE_INFO: "Delete all my data from this device",
        U_LOGIN: "Login",
        U_LOGOUT: "Logout",
        U_PROFILE: "My profile",
        OVR_RECOMENDED: "Recommended for:",
        OVR_ALL: "All",
        OVR_FLYING: "Flying",
        OVR_WATER: "Water",
        OVR_SKI: "Ski",
        MSG_OFFLINE: "WOW it appears that you are offline :-(",
        MSG_ONLINE_APP: "Online again, click here to reload app :-)",
        MSG_LOGIN_SUCCESFULL: "You have successfully logged in!",
        FIELD_CANNOT_BE_EMPTY: "This field can't be empty",
        FIELD_INVALID_EMAIL: "This doesn't look like an email address",
        PASSWORD_EMPTY: "Password can't be empty",
        PASSWORD_SHORT: "Password is too short",
        PASSWORD_DO_NOT_MATCH: "Password and confirmation don't match",
        ALERTS_LINK_SHORT: "Alert for this spot",
        MY_ALERTS: "My Alerts",
        ACTIVE_ALERTS: "active alerts",
        ALERT_NOTIFICATIONS: "Windy Alerts can be now sent directly to your mobile devices. Visit Settings for managing notification preferences.",
        DIRECTION_N: "N",
        DIRECTION_NE: "NE",
        DIRECTION_E: "E",
        DIRECTION_SE: "SE",
        DIRECTION_S: "S",
        DIRECTION_SW: "SW",
        DIRECTION_W: "W",
        DIRECTION_NW: "NW",
        DIRECTIONS: "Directions",
        DIRECTIONS_ANY: "Any direction",
        ACTIVATE: "Activate",
        DEACTIVATE: "Deactivate",
        REGISTER: "Register",
        REGISTER_HERE: "Register here",
        DONT_HAVE_ACCOUNT: "Don't have an account?",
        JUST_LOGIN: "Login",
        MY_ACCOUNT: "My account",
        EDIT_ALERT: "Edit alert",
        FAVS_RENAME: "Rename",
        ADD_ALERT: "Create alert",
        HOME: "Home",
        MAP: "Map",
        MORE: "More",
        LESS: "Less",
        COMPARE: "Compare",
        PRESS_ISOLINES: "Pressure isolines",
        PART_ANIMATION: "Particles animation",
        R_TIME_RANGE: "Time range",
        MY_LOCATION: "My location",
        D_ISOLINES: "Display isolines",
        ARTICLES: "Articles",
        NEW: "New!",
        WHAT_IS_NEW: "What is new:",
        PRIVACY: "Privacy protection",
        TERMS_OF_USE: "Terms of Use",
        PRIVACY_POLICY: "Privacy policy",
        SOUNDING: "Sounding",
        SOUND_ON: "Sound",
        BLITZ_ON: "Show lightning",
        WFORECAST: "weather forecast",
        TITLE: "Wind map & weather forecast",
        HURR_TRACKER: "Hurricane tracker",
        TOC: "Terms and conditions",
        SEND: "Send",
        SEARCH_LAYER: "Search layer...",
        CANCEL_SEARCH: "Cancel search",
        NOTHING_FOUND: "Nothing found",
        P_LOGIN_SYNC: "Please <b>login</b> or <b>register</b> to synchronize all your favorites and settings with all your devices.",
        P_LOCATION: "Please allow Windy to use location services (GPS) while using the app, so we can show weather at your location. We do not store your location at our servers.",
        DONE: "Done",
        HMAP: "Outdoor map",
        LICENCE: "Licence",
        LIST: "list",
        GALLERY: "gallery",
        AIRQ_RANGE_GOOD: "Good",
        AIRQ_RANGE_MODERATE: "Moderate",
        AIRQ_RANGE_UNHEALTHY_SENSITIVE: "Unhealthy for sensitive",
        AIRQ_RANGE_UNHEALTHY: "Unhealthy",
        AIRQ_RANGE_VERY_UNHEALTHY: "Very unhealthy",
        AIRQ_RANGE_HAZARDOUS: "Hazardous",
        POI_MAX_LAYERS: "Maximum is {{num}} favourite layers. Remove some to add new ones.",
        MENU_WATCHFACES: "Apple Watch Faces"
    }
})),
function() {
    window.TARGET_LIB = !0;
    var e = function(e) {
            var t;
            (null === (t = window.W.lib) || void 0 === t ? void 0 : t.verbose) && console.log("Initializing Windy API: " + e)
        },
        t = function(e) {
            throw new Error("Windy API error: " + e)
        };
    e("Checking Leaflet library"), window.L || t("Leaflet is missing. Add Leaflet to the HTML head tag."), /^1\.4/.test(window.L.version) || t("Wrong version of Leaflet library. Version 1.4.x is required");
    var n, i = function(n, o) {
        var r;
        if (null === (r = window.W.lib) || void 0 === r ? void 0 : r.initialized) {
            for (var a in W) delete W[a];
            var s = document.createElement("script");
            return s.type = "text/javascript", s.onload = function() {
                return i(n, o)
            }, s.src = "https://api.windy.com/assets/map-forecast/libBoot.js", document.head.append(s), void console.log('%c !!! Repeatedly calling "windyInit" of an already initialized API is an unsupported functionality and will be removed in future versions!', "color: red; font-size: large")
        }
        window.W.startTs = Date.now();
        var l = window.W.require;
        l("http").post("https://api.windy.com/api/map-forecast/v2/auth", {
            data: {
                key: n.key,
                hostname: document.location.hostname
            }
        }).then((function(i) {
            var r, a, s = i.data;
            window.W.lib = {
                verbose: n.verbose || !1,
                initialized: null !== (a = null === (r = window.W.lib) || void 0 === r ? void 0 : r.initialized) && void 0 !== a && a,
                get initAuth() {
                    return s.auth
                }
            };
            var c = l("libHtml"),
                d = l("utils").$,
                u = l("trans");
            e("Adding HTML to #windy DIV");
            var h = d("#windy");
            if (!h) throw new Error('Windy API error: Missing <div id="windy"></div> in the BODY of the page');
            h.innerHTML = c.replace("__APIUSER__", s.apiUser), h.classList.add(s.paid ? "paid-model" : "free-model"), document.body.classList.add("target-lib"), e("Adding start-up options"),
                function(t, n, i) {
                    var o, r = t("rootScope"),
                        a = t("dataSpecifications"),
                        s = t("store");
                    if (n.expertMode = null !== (o = null == n ? void 0 : n.expertMode) && void 0 !== o && o, i.paid) {
                        var l, c;
                        e("key type: paid");
                        var d, u = ["capAlerts", "radar", "map", "nems", "bomAccess", "mblue", "airQ", "radarSat", "intersucho"],
                            h = function(e, t) {
                                return e.filter((function(e) {
                                    return -1 === t.indexOf(e)
                                }))
                            };
                        (null === (l = i.features) || void 0 === l ? void 0 : l.intersucho) ? e("intersucho is enabled"): u.push("awr_0_40", "awr_0_100", "awp_0_40", "awp_0_100", "awd_0_40", "awd_0_100", "intersuchoAWD", "intersuchoAWP", "intersuchoAWR"), (null === (c = i.features) || void 0 === c ? void 0 : c.ecmwf) ? e("ECMWF is enabled") : (u.push("ecmwf", "ecmwfWaves", "thunder", "cloudtop", "cbase", "visibility", "sst", "efi", "efiTemp", "efiRain", "efiWind"), s.setDefault("product", null !== (d = n.product) && void 0 !== d ? d : "gfs"), s.setDefault("prefferedProduct", "icon" === n.product ? "icon" : "gfs"), r.isolines = ["off", "pressure", "gh", "temp"]), r.overlays = h(r.overlays, u), r.localProducts = h(r.localProducts, u), r.globalProducts = h(r.globalProducts, u), r.seaProducts = h(r.seaProducts, u)
                    } else e("key type: basic user"), r.localProducts = [], r.globalProducts = ["gfs"], r.overlays = ["wind", "temp", "pressure"], r.isolines = ["off", "pressure", "gh", "temp"], r.seaProducts = [], s.setDefault("product", "gfs"), s.setDefault("prefferedProduct", "gfs"), s.setDefault("availProducts", ["gfs"]), s.setDefault("visibleProducts", ["gfs"]);
                    r.products = r.globalProducts.concat(r.localProducts), a.product.allowed = r.globalProducts.concat(r.localProducts), a.overlay.allowed = [].concat(r.overlays), a.isolines.allowed = [].concat(r.isolines), a.prefferedProduct.allowed = [].concat(a.prefferedProduct.allowed).filter((function(e) {
                        return r.products.includes(e)
                    })), n.favOverlays || (n.favOverlays = [].concat(r.overlays)), a.favOverlays.def = n.favOverlays, e("Available products: " + r.products.join(", ")), e("Available overlays: " + r.overlays.join(", ")), (null == n ? void 0 : n.lat) && ((null == n ? void 0 : n.lon) || (null == n ? void 0 : n.lng)) && (s.set("startUp", "location"), s.set("homeLocation", {
                        lat: n.lat,
                        lon: n.lon || n.lng || 0,
                        title: "Start up location"
                    })), ["product", "overlay", "level", "particles", "numDirection", "lang", "disableWebGL", "graticule", "particlesAnim", "timestamp", "isolines", "isImperial", "latlon", "hourFormat", "favOverlays", "expertMode"].forEach((function(e) {
                        var t = null == n ? void 0 : n[e];
                        t && s.setDefault(e, t)
                    }))
                }(l, n, s), setTimeout((function() {
                    try {
                        u.translateDocument(h), e("Initializing rest of Windy API"),
                            function(n, i, o, r) {
                                var a, s = n("picker"),
                                    l = n("store"),
                                    c = n("rootScope"),
                                    d = n("broadcast"),
                                    u = n("overlays"),
                                    h = n("utils"),
                                    p = n("map").map,
                                    f = n("colors"),
                                    m = n("models"),
                                    v = n("ga").pageview;
                                W.loadOrphanedModules(), p.setZoom(i.zoom || 5, {
                                    animate: !1
                                }), s.open = function(e) {
                                    return d.emit("rqstOpen", "picker", e)
                                }, s.close = function() {
                                    return d.emit("rqstClose", "picker")
                                }, s.getParams = function() {
                                    var e = n("plugins").picker;
                                    if (e) return e.getParams();
                                    throw new Error("Picker plugin is not opened")
                                };
                                var g, w, y = null !== (a = i.overlay) && void 0 !== a ? a : l.get("overlay"),
                                    b = null !== (g = i.product) && void 0 !== g ? g : l.get("product"),
                                    T = m.getProduct(y, b);
                                if (b !== T) {
                                    if (i.product) return t('Product "' + i.product + '" set in options does not have an overlay "' + y + '".' + (T ? ' Use "' + T + '" instead.' : ""));
                                    i.product = T
                                }
                                l.set("product", i.product || l.get("product"), {
                                    forceChange: !0
                                }).then((function() {
                                    return l.set("overlay", null !== (w = i.overlay) && void 0 !== w ? w : "wind", {
                                        forceChange: !0
                                    })
                                })).then((function() {
                                    null == o || o({
                                        map: p,
                                        store: l,
                                        picker: s,
                                        utils: h,
                                        broadcast: d,
                                        overlays: u,
                                        colors: f
                                    })
                                })), v(c.version + "/" + r.apiUser + "-" + r.id + "/" + r.name), e("Done. Calling your windyInit callback"), setTimeout((function() {
                                    console.log("%c ðŸ„ Welcome to Windy JavaScript API. Please do not remove or conceal the Windy logo or the advertisement. The logo and the advertisement must remain a clickable link, and must lead to its target URL. Please see https://api.windy.com/ for documentation and for more information.", "color: #9D0300; font-size: large"), window.W.lib.initialized = !0
                                }), 200)
                            }(l, n, o, s)
                    } catch (e) {
                        console.error("Windy API error:", e)
                    }
                }), 50)
        })).catch((function(e) {
            var t, n;
            console.error("Failed to authorize Windy API key:", e), t = e.response && e.response.length > 0 ? e.response : "Cannot connect to Windy", n = function() {
                document.getElementById("windy").innerHTML = '<div style="height:100%;display:flex;align-items:center;justify-content:center;background-image:url(https://www.windy.com/img/api/api-error-bgr.jpg);background-size: cover;background-position: center top;">\n<p style="background:#9d0300;border-radius:1em;padding:1em;line-height:1.5">\nNot authorized to <a style="color: inherit" href="https://api.windy.com/" target="_blank">Windy API</a>: ' + t + '<br />\nCheck out the <a style="color: inherit" href="https://api.windy.com/map-forecast/docs" target="_blank">Map Forecast API documentation</a><br />\nOr visit the awesome weather forecast at <a style="color: inherit;font-weight:bold" href="https://www.windy.com/" target="_blank">Windy.com</a>!\n</p></div>'
            }, "complete" === document.readyState ? n() : window.addEventListener("load", n)
        }))
    };
    (n = document.createElement("link")).rel = "stylesheet", n.type = "text/css", n.href = "https://www.windy.com/v/" + W.assets + "/lib.css", document.head.appendChild(n), window.windyInit = function(e, t) {
        "loading" !== document.readyState ? i(e, t) : document.addEventListener("DOMContentLoaded", i.bind(null, e, t))
    }
}();