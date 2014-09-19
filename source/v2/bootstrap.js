const {classes: Cc, interfaces: Ci, results: Cr, utils: Cu} = Components;
Cu.import('resource://gre/modules/osfile.jsm');
Cu.import('resource://gre/modules/Downloads.jsm');
Cu.import('resource://gre/modules/NetUtil.jsm');

var aPath = OS.Path.join(OS.Constants.Path.profileDir, 'antiadsplayer')
var aName = ['loader.swf', 'player.swf', 'tudou.swf', 'sp.swf', 'iqiyi_out.swf', 'iqiyi5.swf', 'iqiyi.swf', 'pps.swf', 'letv.swf', 'pplive.swf', 'pplive_live.swf', 'sohu.swf', 'sohu2.swf', 'sohu_live.swf', 'Player_file.swf', 'Player_file_out.swf', 'Player_stream.swf', 'Player_stream_out.swf', 'ku6.swf', 'ku6_out.swf'];
aName.forEach(aCheck);

function aCheck(aName) {
    var aLink = 'http://jc3213.cwsurf.de/swfPack/' + aName;
    var aFile = OS.Path.join(aPath, aName);
    OS.File.stat(aFile).then(function onSuccess(info) {
        var aClient = Cc['@mozilla.org/xmlextras/xmlhttprequest;1'].createInstance(Ci.nsIXMLHttpRequest);
        aClient.open('HEAD', aLink, true);
        aClient.send();
        aClient.onload = function () {
            var aDate = new Date(aClient.getResponseHeader('Last-Modified'));
            if (aDate > info.lastModificationDate) {
                aDownload(aLink, aFile);
            }
        }
    }, 
    function onFailure(reason) {
        if (reason instanceof OS.File.Error && reason.becauseNoSuchFile) {
            aDownload(aLink, aFile);
        }
    });
}

function aDownload(aLink, aFile) {
    Downloads.fetch(aLink, aFile, {isPrivate: true}).then(function onSuccess() {
        console.log('Download sessions finished successfully');
    },
	function onFailure(reason) {
        if (reason instanceof Downloads.Error && reason.becauseSourceFailed) {
            console.log('Can not download |'  + aLink);
        } else if (reason instanceof Downloads.Error && reason.becauseTargetFailed) {
            console.log('Can not write |'  + aFile);
        }
    });
}

var aURI = 'file:///' + encodeURI(aPath.replace(/\\/g, '/'));

function aCommon() {}
aCommon.prototype = {
    PLAYERS: {
/**  -------------------------------------------------------------------------------------------------------  */
        'youku_loader': {
            'object': aURI + '/loader.swf',
            'target': /http:\/\/static\.youku\.com\/.*\/v\/swf\/loaders?\.swf/i
        },
        'youku_player': {
            'object': aURI + '/player.swf',
            'target': /http:\/\/static\.youku\.com\/.*\/v\/swf\/q?player.*\.swf/i
        },
/**  -------------------------------------------------------------------------------------------------------  */
        'tudou_portal': {
            'object': aURI + '/tudou.swf',
            'target': /http:\/\/js\.tudouui\.com\/bin\/lingtong\/PortalPlayer.*\.swf/i
        },
        'tudou_olc': {
            'object': 'http://js.tudouui.com/bin/player2/olc.swf',
            'target': /http:\/\/js\.tudouui\.com\/bin\/player2\/olc.+\.swf/i
        },
        'tudou_social': {
            'object': aURI + '/sp.swf',
            'target': /http:\/\/js\.tudouui\.com\/bin\/lingtong\/SocialPlayer.*\.swf/i
        },
/**  -------------------------------------------------------------------------------------------------------  */
        'iqiyi': {
            'object0': aURI + '/iqiyi_out.swf',
            'object1': aURI + '/iqiyi5.swf',
            'object2': aURI + '/iqiyi.swf',
            'target': /https?:\/\/www\.iqiyi\.com\/(common\/flash)?player\/\d+\/(Main|Share)?Player.*\.swf/i
        },
/**  -------------------------------------------------------------------------------------------------------  */
        'pps': {
            'object': aURI + '/pps.swf',
            'target': /http:\/\/www\.iqiyi\.com\/player\/cupid\/common\/pps_flvplay_s\.swf/i
        },
/**  -------------------------------------------------------------------------------------------------------  */
        'letv': {
            'object': aURI + '/letv.swf',
            'target': /http:\/\/.*\.letv(cdn)?\.com\/.*(new)?player\/((C?SDK)?Letv|swf)Player\.swf/i
        },
        'letv_skin': {
            'object': 'http://player.letvcdn.com/p/201407/24/15/newplayer/1/SSLetvPlayer.swf',
            'target': /http:\/\/player\.letvcdn\.com\/p\/((?!15)\d+\/){3}newplayer\/1\/S?SLetvPlayer\.swf/i
        },
/**  -------------------------------------------------------------------------------------------------------  */
        'pptv': {
            'object': aURI + '/pplive.swf',
            'target': /http:\/\/player.pplive.cn\/ikan\/.*\/player4player2\.swf/i
        },
        'pplive': {
            'object': aURI + '/pplive_live.swf',
            'target': /http:\/\/player.pplive.cn\/live\/.*\/player4live2\.swf/i
        },
/**  -------------------------------------------------------------------------------------------------------  */
        'sohu': {
            'object': aURI + '/sohu.swf',
            'target': /http:\/\/(tv\.sohu\.com\/upload\/swf\/(?!live|sv)|[\d+\.]+\/).*\/(Main|PlayerShell)\.swf/i
        },
        'sohu2': {
            'object': aURI + '/sohu2.swf',
            'target': /http:\/\/tv\.sohu\.com\/upload\/swf\/sv\d+\/Main\.swf/i
        },
        'sohu_live': {
            'object': aURI + '/sohu_live.swf',
            'target': /http:\/\/(tv\.sohu\.com\/upload\/swf\/live\/\d+|[\d+\.]+:\d+\/test\/player)\/Main\.swf/i
        },
/**  -------------------------------------------------------------------------------------------------------  */
        '17173': {
            'object': aURI + '/Player_file.swf',
            'target': /http:\/\/f\.v\.17173cdn\.com\/\d+\/flash\/Player_file\.swf/i
        },
        '17173_out': {
            'object': aURI + '/Player_file_out.swf',
            'target': /http:\/\/f\.v\.17173cdn\.com\/(\d+\/)?flash\/Player_file_out\.swf/i
        },
        '17173_live': {
            'object': aURI + '/Player_stream.swf',
            'target': /http:\/\/f\.v\.17173cdn\.com\/\d+\/flash\/Player_stream(_firstpage)?\.swf/i
        },
        '17173_live_out': {
            'object': aURI + '/Player_stream_out.swf',
            'target': /http:\/\/f\.v\.17173cdn\.com\/\d+\/flash\/Player_stream_(custom)?Out\.swf/i
        },
/**  -------------------------------------------------------------------------------------------------------  */
        'ku6_common': {
            'object': aURI + '/Ku6.swf',
            'target': /http:\/\/player\.ku6cdn\.com\/default\/(\w+\/){2}\d+\/player\.swf/i
        },
        'ku6_out': {
            'object': aURI + '/ku6_out.swf',
            'target': /http:\/\/player\.ku6cdn\.com\/default\/out\/\d+\/player\.swf/i
        },
    },
    FILTERS: {
/**  -------------------------------------------------------------------------------------------------------  */
        'youku_tudou': {
            'object': 'http://valc.atm.youku.com/vc',
            'target': /http:\/\/val[fcopb]\.atm\.youku\.com\/v[fcopb].+/i
        },
        'tudou_css': {
            'object': 'https://raw.githubusercontent.com/jc3213/antiadsplayer/master/test/play_50.css',
            'target': /http:\/\/css\.tudouui\.com\/v3\/dist\/css\/play\/play_50\.css/i
        },
/**  -------------------------------------------------------------------------------------------------------  */
        'iqiyi_pps': {
            'object': 'http://www.iqiyi.com/player/cupid/common/clear.swf',
            'target': /http:\/\/www\.iqiyi\.com\/(common\/flash)?player\/(\d+\/((dsp)?roll|hawkeye)|cupid\/\d+).*\.swf/i
        },
/**  -------------------------------------------------------------------------------------------------------  */
        'letv': {
            'object': 'http://ark.letv.com/s',
            'target': /http:\/\/(pro\.hoye|ark)\.letv\.com\/(main\/s\?|s\?ark)/i
        },
/**  -------------------------------------------------------------------------------------------------------  */
        'pptv_pplive': {
            'object': 'http://de.as.pptv.com/ikandelivery/vast/draft',
            'target': /http:\/\/de\.as\.pptv\.com\/ikandelivery\/vast\/.+draft/i
        },
/**  -------------------------------------------------------------------------------------------------------  */
        'sohu': {
            'object': 'http://v.aty.sohu.com/v',
            'target': /http:\/\/v\.aty\.sohu\.com\/v\?/i
        },
/**  -------------------------------------------------------------------------------------------------------  */
        '17173': {
            'object': 'http://cdn4.v.17173.com/crossdomain.xml',
            'target': /http:\/\/cdn4\.v\.17173\.com\/(?!crossdomain\.xml).*/i
        },
/**  -------------------------------------------------------------------------------------------------------  */
        'ku6': {
            'object': 'http://p1.sdo.com',
            'target': /http:\/\/g1\.sdo\.com/i
        },
/**  -------------------------------------------------------------------------------------------------------  */
        'qq': {
            'object': 'http://livep.l.qq.com/livemsg',
            'target': /http:\/\/livew\.l\.qq\.com\/livemsg\?/i
        },
/**  -------------------------------------------------------------------------------------------------------  */
        '56': {
            'object': 'http://www.56.com',
            'target': /http:\/\/acs\.stat\.v-56\.com\/vml\/\d+\/ac\/ac.*\.xml/i
        },
/**  -------------------------------------------------------------------------------------------------------  */
        '163': {
            'object': 'http://v.163.com',
            'target': /http:\/\/v\.163\.com\/special\/.*\.xml/i
        },
/**  -------------------------------------------------------------------------------------------------------  */
        'sina': {
            'object': 'http://sax.sina.com.cn/video/newimpress',
            'target': /http:\/\/sax\.sina\.com\.cn\/video\/newimpress/i
        },
/**  -------------------------------------------------------------------------------------------------------  */
        'duowan': {
            'object': 'http://yuntv.letv.com/bcloud.swf',
            'target': /http:\/\/assets\.dwstatic\.com\/video\/vppp\.swf/i
        },
    },
    DOMAINS: {
/**  -------------------------------------------------------------------------------------------------------  */
        'iqiyi': {
            'host': 'http://www.iqiyi.com/',
            'target': /http:\/\/.*\.qiyi\.com/i
        },
    },
    oService: Cc['@mozilla.org/observer-service;1'].getService(Ci.nsIObserverService),
    getObject: function (rule, callback) {
        NetUtil.asyncFetch(rule['object'], function (inputStream, status) {
            var binaryOutputStream = Cc['@mozilla.org/binaryoutputstream;1'].createInstance(Ci['nsIBinaryOutputStream']);
            var storageStream = Cc['@mozilla.org/storagestream;1'].createInstance(Ci['nsIStorageStream']);
            var count = inputStream.available();
            var data = NetUtil.readInputStreamToString(inputStream, count);
                storageStream.init(512, count, null);
                binaryOutputStream.setOutputStream(storageStream.getOutputStream(0));
                binaryOutputStream.writeBytes(data, count);
                rule['storageStream'] = storageStream;
                rule['count'] = count;
            if (typeof callback === 'function') {
                callback();
            }
        });
    },
    getWindowForRequest: function (request) {
        if (request instanceof Ci.nsIRequest) {
            try {
                if (request.notificationCallbacks) {
                    return request.notificationCallbacks.getInterface(Ci.nsILoadContext).associatedWindow;
                }
            } catch (e) {}
            try {
                if (request.loadGroup && request.loadGroup.notificationCallbacks) {
                    return request.loadGroup.notificationCallbacks.getInterface(Ci.nsILoadContext).associatedWindow;
                }
            } catch (e) {}
        }
        return null;
    },
    observe: function (aSubject, aTopic, aData) {
        if (aTopic == "http-on-modify-request") {
        var httpReferer = aSubject.QueryInterface(Ci.nsIHttpChannel);
        for (var i in this.DOMAINS) {
            var domain = this.DOMAINS[i];
                try {
                var URL = httpReferer.originalURI.spec;
                    if (domain['target'].test(URL)) {
                        httpReferer.setRequestHeader('Referer', domain['host'], false);
                    }
                } catch (e) {}
            }
        }

        if (aTopic != 'http-on-examine-response') return;
        var httpChannel = aSubject.QueryInterface(Ci.nsIHttpChannel);
        for (var i in this.FILTERS) {
            var rule = this.FILTERS[i];
            if (rule['target'].test(httpChannel.URI.spec)) {
                if (!rule['storageStream'] || !rule['count']) {
                    httpChannel.suspend();
                    this.getObject(rule, function () {
                        httpChannel.resume();
                    });
                }
                var newListener = new TrackingListener();
                aSubject.QueryInterface(Ci.nsITraceableChannel);
                newListener.originalListener = aSubject.setNewListener(newListener);
                newListener.rule = rule;
                break;
            }
        }

        var aVisitor = new HttpHeaderVisitor();
        httpChannel.visitResponseHeaders(aVisitor);
        if (!aVisitor.isFlash()) return;

        for (var i in this.PLAYERS) {
            var rule = this.PLAYERS[i];
            if (rule['target'].test(httpChannel.URI.spec)) {
                var fn = this, args = Array.prototype.slice.call(arguments);
                if (typeof rule['preHandle'] === 'function')
                    rule['preHandle'].apply(fn, args);
                if (!rule['storageStream'] || !rule['count']) {
                    httpChannel.suspend();
                    this.getObject(rule, function() {
                        httpChannel.resume();
                        if (typeof rule['callback'] === 'function')
                            rule['callback'].apply(fn, args);
                    });
                }
                var newListener = new TrackingListener();
                aSubject.QueryInterface(Ci.nsITraceableChannel);
                newListener.originalListener = aSubject.setNewListener(newListener);
                newListener.rule = rule;
                break;
            }
        }
    },
    QueryInterface: function (aIID) {
        if (aIID.equals(Ci.nsISupports) || aIID.equals(Ci.nsIObserver))
            return this;
        return Cr.NS_ERROR_NO_INTERFACE;
    },
    aResolver: function () {
        var rule = this.PLAYERS['iqiyi'];
        rule['preHandle'] = function (aSubject) {
            var wnd = this.getWindowForRequest(aSubject);
            if (wnd) {
                rule['command'] = [
                    !/(^((?!baidu|61|178).)*\.iqiyi\.com|pps\.tv)/i.test(wnd.self.location.host),
                    wnd.self.document.querySelector('span[data-flashplayerparam-flashurl]'),
                    true
                ];
                if (!rule['command']) return;
                for (var i = 0; i < rule['command'].length; i++) {
                    if (rule['command'][i]) {
                        if (rule['object'] != rule['object' + i]) {
                            rule['object'] = rule['object' + i];
                            rule['storageStream'] = rule['storageStream' + i] ? rule['storageStream' + i] : null;
                            rule['count'] = rule['count' + i] ? rule['count' + i] : null;
                        }
                        break;
                    }
                }
            }
        };
        rule['callback'] = function () {
            if (!rule['command']) return;
            for (var i = 0; i < rule['command'].length; i++) {
                if (rule['object' + i] == rule['object']) {
                    rule['storageStream' + i] = rule['storageStream'];
                    rule['count' + i] = rule['count'];
                    break;
                }
            }
        };
    },
    register: function () {
        this.aResolver();
        this.oService.addObserver(this, 'http-on-examine-response', false);
        this.oService.addObserver(this, "http-on-modify-request", false);
    },
    unregister: function () {
        this.oService.removeObserver(this, 'http-on-examine-response', false);
        this.oService.removeObserver(this, "http-on-modify-request", false);
    }
}

function TrackingListener() {
    this.originalListener = null;
    this.rule = null;
}
TrackingListener.prototype = {
    onStartRequest: function (request, context) {
        this.originalListener.onStartRequest(request, context);
    },
    onStopRequest: function (request, context) {
        this.originalListener.onStopRequest(request, context, Cr.NS_OK);
    },
    onDataAvailable: function (request, context) {
        this.originalListener.onDataAvailable(request, context, this.rule['storageStream'].newInputStream(0), 0, this.rule['count']);
    }
}

function HttpHeaderVisitor() {
    this._isFlash = false;
}
HttpHeaderVisitor.prototype = {
    visitHeader: function (aHeader, aValue) {
        if (aHeader.indexOf("Content-Type") !== -1) {
            if (aValue.indexOf("application/x-shockwave-flash") !== -1) {
                this._isFlash = true;
            }
        }
    },
    isFlash: function() {
        return this._isFlash;
    }
}

var aRun;

function startup(data, reason) {
    if (!aRun) {
        aRun = new aCommon();
        aRun.register();
    }
}

function shutdown(data, reason) {
    if (aRun) {
        aRun.unregister();
        aRun = null;
    }
}

function install(data, reason) {
    OS.File.makeDir(aPath);
}

function uninstall(data, reason) {
    OS.File.removeDir(aPath);
}
