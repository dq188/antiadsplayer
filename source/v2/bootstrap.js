const {classes: Cc, interfaces: Ci, results: Cr, utils: Cu} = Components;
Cu.import('resource://gre/modules/osfile.jsm');
Cu.import('resource://gre/modules/Downloads.jsm');
Cu.import('resource://gre/modules/NetUtil.jsm');

var aPath = OS.Path.join(OS.Constants.Path.profileDir, 'antiadsplayer');

var aLocale = Cc['@mozilla.org/preferences-service;1'].getService(Ci.nsIPrefBranch).getComplexValue('general.useragent.locale', Ci.nsISupportsString).data;
if (aLocale == 'en-US') {
  var aLang = {
    needupdate: ' is out of date',
    filecorrupted: ' may be corrupted',
    fileready: ' is ready to serve',
    filenotexist: ' is not exist',
    filedownloaded: ' download session complete',
    remotefailed: ' failed to load remote file',
    localfailed: ' failed to save local file',
  };
} else if (aLocale == 'ja') {
  var aLang = {
    needupdate: ' \u306E\u6700\u65B0\u7248\u767A\u898B',
    filecorrupted: ' \u304C\u58CA\u308C\u3066\u3044\u308B\u53EF\u80FD\u6027\u304C\u3042\u308A\u307E\u3059',
    fileready: ' \u6E96\u5099\u5B8C\u4E86',
    filenotexist: ' \u304C\u5B58\u5728\u3057\u307E\u305B\u3093',
    filedownloaded: ' \u30C0\u30A6\u30F3\u30ED\u30FC\u30C9\u5B8C\u4E86',
    remotefailed: ' \u306E\u8AAD\u307F\u8FBC\u307F\u306B\u5931\u6557',
    localfailed: ' \u306E\u66F8\u304D\u8FBC\u307F\u306B\u5931\u6557',
  };
} else if (aLocale == 'zh-CN') {
  var aLang = {
    needupdate: ' \u9700\u8981\u66F4\u65B0',
    filecorrupted: ' \u6587\u4EF6\u53EF\u80FD\u5DF2\u635F\u574F',
    fileready: ' \u5DF2\u5C31\u4F4D',
    filenotexist: ' \u4E0D\u5B58\u5728',
    filedownloaded: ' \u4E0B\u8F7D\u5B8C\u6210',
    remotefailed: ' \u52A0\u8F7D\u6587\u4EF6\u5931\u8D25',
    localfailed: ' \u4FDD\u5B58\u6587\u4EF6\u5931\u8D25',
  };
} else if (aLocale == 'zh-TW') {
  var aLang = {
    needupdate: ' \u9700\u8981\u66F4\u65B0',
    filecorrupted: ' \u6587\u4EF6\u53EF\u80FD\u5DF2\u7D93\u640D\u58DE',
    fileready: ' \u5DF2\u5C31\u7DD2',
    filenotexist: ' \u4E0D\u5B58\u5728',
    filedownloaded: ' \u4E0B\u8F09\u6210\u529F',
    remotefailed: ' \u7121\u6CD5\u8B80\u53D6\u6587\u4EF6',
    localfailed: ' \u7121\u6CD5\u7DE9\u5B58\u6587\u4EF6',
  };
} else {
  console.log('Your locale is not supported');
}

var aName = [
  'loader.swf',
  'player.swf',
  'tudou.swf',
  'sp.swf',
  'iqiyi_out.swf',
  'iqiyi5.swf',
  'iqiyi.swf',
  'pps.swf',
  'letv.swf',
  'letv.in.Live.swf',
  'pptv.in.Ikan.swf',
  'pptv.in.Live.swf',
  'sohu.injs.Lite.swf',
  'sohu.inyy.Lite.swf',
  'sohu.inbj.Live.swf',
  'sohu.inyy+injs.Lite.s1.swf',
  '17173.in.Vod.swf',
  '17173.out.Vod.swf',
  '17173.in.Live.swf',
  '17173.out.Live.swf',
  'ku6_in_player.swf',
  'ku6_out_player.swf',
  '56.in.NM.swf',
  '56.in.TM.swf',
  'baidu.call.swf'
  ];
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
      var aSize = aClient.getResponseHeader('Content-Length');
      if (aDate > info.lastModificationDate) {
        console.log(aName + aLang.needupdate);
        aDownload(aLink, aFile, aName);
      } else if (aSize != info.size) {
        console.log(aName + aLang.filecorrupted);
        aDownload(aLink, aFile, aName);
      } else {
        console.log(aName + aLang.fileready);
      }
    }
  }, function onFailure(reason) {
    if (reason instanceof OS.File.Error && reason.becauseNoSuchFile) {
      console.log(aName + aLang.filenotexist);
      aDownload(aLink, aFile, aName);
    }
  });
}

function aDownload(aLink, aFile, aName) {
  Downloads.fetch(aLink, aFile, {isPrivate: true}).then(function onSuccess() {
    console.log(aName + aLang.filedownloaded);
  }, function onFailure(reason) {
    if (reason instanceof Downloads.Error && reason.becauseSourceFailed) {
      console.log(aLink + aLang.remotefailed);
    } else if (reason instanceof Downloads.Error && reason.becauseTargetFailed) {
      console.log(aFile + aLang.localfailed);
    } else {
      console.log(reason);
    }
  });
}

var aURI = OS.Path.toFileURI(aPath);

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
      'object': aURI + '/iqiyi.swf',
      'target': /http:\/\/www\.iqiyi\.com\/common\/flashplayer\/\d+\/PPSMainPlayer.*\.swf/i
    },
    'pps_out': {
      'object': aURI + '/pps.swf',
      'target': /http:\/\/www\.iqiyi\.com\/player\/cupid\/common\/pps_flvplay_s\.swf/i
    },
/**  -------------------------------------------------------------------------------------------------------  */
    'letv': {
      'object': aURI + '/letv.swf',
      'target': /http:\/\/.*\.letv(cdn)?\.com\/.*(new)?player\/((SDK)?Letv|swf)Player\.swf/i
    },
    'letv_skin': {
      'object': 'http://player.letvcdn.com/p/201407/24/15/newplayer/1/SSLetvPlayer.swf',
      'target': /http:\/\/player\.letvcdn\.com\/p\/((?!15)\d+\/){3}newplayer\/1\/S?SLetvPlayer\.swf/i
    },
    'letv_live': {
      'object': aURI + '/letv.in.Live.swf',
      'target': /http:\/\/player\.letvcdn\.com\/.*\/newplayer\/(SDK)?LivePlayer\.swf/i
    },
/**  -------------------------------------------------------------------------------------------------------  */
    'pptv': {
      'object': aURI + '/pptv.in.Ikan.swf',
      'target': /http:\/\/player.pplive.cn\/ikan\/.*\/player4player2\.swf/i
    },
    'pplive': {
      'object': aURI + '/pptv.in.Live.swf',
      'target': /http:\/\/player.pplive.cn\/live\/.*\/player4live2\.swf/i
    },
/**  -------------------------------------------------------------------------------------------------------  */
    'sohu': {
      'object': aURI + '/sohu.inyy.Lite.swf',
      'target': /http:\/\/(tv\.sohu\.com\/upload\/swf\/(?!live|sv)|[\d+\.]+\/).*\/(Main|PlayerShell)\.swf/i
    },
    'sohu2': {
      'object': aURI + '/sohu.injs.Lite.swf',
      'target': /http:\/\/tv\.sohu\.com\/upload\/swf\/sv\d+\/Main\.swf/i
    },
    'sohu_skin': {
      'object': aURI + '/sohu.inyy+injs.Lite.s1.swf',
      'target': /http\:\/\/tv\.sohu\.com\/upload\/swf(\/live)?\/\d+\/skins\/s1\.swf/i
    },
    'sohu_live': {
      'object': aURI + '/sohu.inbj.Live.swf',
      'target': /http:\/\/(tv\.sohu\.com\/upload\/swf\/live\/\d+|[\d+\.]+:\d+\/test\/player)\/Main\.swf/i
    },
/**  -------------------------------------------------------------------------------------------------------  */
    '17173': {
      'object': aURI + '/17173.in.Vod.swf',
      'target': /http:\/\/f\.v\.17173cdn\.com\/\d+\/flash\/Player_file\.swf/i
    },
    '17173_out': {
      'object': aURI + '/17173.out.Vod.swf',
      'target': /http:\/\/f\.v\.17173cdn\.com\/(\d+\/)?flash\/Player_file_(custom)?out\.swf/i
    },
    '17173_live': {
      'object': aURI + '/17173.in.Live.swf',
      'target': /http:\/\/f\.v\.17173cdn\.com\/\d+\/flash\/Player_stream(_firstpage)?\.swf/i
    },
    '17173_live_out': {
      'object': aURI + '/17173.out.Live.swf',
      'target': /http:\/\/f\.v\.17173cdn\.com\/\d+\/flash\/Player_stream_(custom)?Out\.swf/i
    },
/**  -------------------------------------------------------------------------------------------------------  */
    'ku6': {
      'object': aURI + '/ku6_in_player.swf',
      'target': /http:\/\/player\.ku6cdn\.com\/default\/(\w+\/){2}\d+\/player\.swf/i
    },
    'ku6_out': {
      'object': aURI + '/ku6_out_player.swf',
      'target': /http:\/\/player\.ku6cdn\.com\/default\/out\/\d+\/player\.swf/i
    },
/**  -------------------------------------------------------------------------------------------------------  */
    '56': {
      'object': aURI + '/56.in.NM.swf',
      'target': /http:\/\/(www|s1)\.56(img)?\.com\/flashApp\/v_player.(?!tm).*\.swf/i
    },
    '56_danmu': {
      'object': aURI + '/56.in.TM.swf',
      'target': /http:\/\/s1\.56img\.com\/flashApp\/v_player_tm.*\.swf/i
    },
/**  -------------------------------------------------------------------------------------------------------  */
    'baidu': {
      'object': aURI + '/baidu.call.swf',
      'target': /http:\/\/list\.video\.baidu\.com\/swf\/advPlayer\.swf/i
    },
  },
  FILTERS: {
/**  -------------------------------------------------------------------------------------------------------  */
    'tudou_css': {
      'object': 'https://raw.githubusercontent.com/jc3213/antiadsplayer/master/test/play_50.css',
      'target': /http:\/\/css\.tudouui\.com\/v3\/dist\/css\/play\/play_50\.css/i
    },
/**  -------------------------------------------------------------------------------------------------------  */
    'youku_tudou': {
      'object': 'http://valf.atm.youku.com/vf?vip=0',
      'target': /http:\/\/val[fcopb]\.atm\.youku\.com\/v.+/i
    },
/**  -------------------------------------------------------------------------------------------------------  */
    'iqiyi_pps': {
      'object': 'http://www.iqiyi.com/player/cupid/common/clear.swf',
      'target': /http:\/\/www\.iqiyi\.com\/common\/flashplayer\/\d+\/((dsp)?roll|hawkeye|pause).*\.swf/i
    },
/**  -------------------------------------------------------------------------------------------------------  */
    'letv': {
      'object': 'http://ark.letv.com/s',
      'target': /http:\/\/ark\.letv\.com\/s\?ark/i
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
    '56': {
      'object': 'http://www.56.com',
      'target': /http:\/\/acs\.stat\.v-56\.com\/vml\/\d+\/ac\/ac.*\.xml/i
    },
/**  -------------------------------------------------------------------------------------------------------  */
    'qq': {
      'object': 'http://livep.l.qq.com/livemsg',
      'target': /http:\/\/livew\.l\.qq\.com\/livemsg\?/i
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
    if (!rule) return;
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
  if (reason == ADDON_UPGRADE) {
    OS.File.move(OS.Path.join(aPath, 'sohu.swf'), OS.Path.join(aPath, 'sohu.inyy.Lite.swf'));
    OS.File.move(OS.Path.join(aPath, 'sohu2.swf'), OS.Path.join(aPath, 'sohu.injs.Lite.swf'));
    OS.File.move(OS.Path.join(aPath, 'sohu_live.swf'), OS.Path.join(aPath, 'sohu.inbj.Live.swf'));
    OS.File.move(OS.Path.join(aPath, 'pplive.swf'), OS.Path.join(aPath, 'pptv.in.Ikan.swf'));
    OS.File.move(OS.Path.join(aPath, 'Player_file.swf'), OS.Path.join(aPath, '17173.in.Vod.swf'));
    OS.File.move(OS.Path.join(aPath, 'Player_file_out.swf'), OS.Path.join(aPath, '17173.out.Vod.swf'));
    OS.File.move(OS.Path.join(aPath, 'Player_stream.swf'), OS.Path.join(aPath, '17173.in.Live.swf'));
    OS.File.move(OS.Path.join(aPath, 'Player_stream_out.swf'), OS.Path.join(aPath, '17173.out.Live.swf'));
    OS.File.move(OS.Path.join(aPath, 'ku6.swf'), OS.Path.join(aPath, 'ku6.in.swf'));
    OS.File.move(OS.Path.join(aPath, 'ku6_out.swf'), OS.Path.join(aPath, 'ku6.out.swf'));
    OS.File.move(OS.Path.join(aPath, 'pplive_live.swf'), OS.Path.join(aPath, 'pptv.in.Live.swf'));
  }
}

function uninstall(data, reason) {
  if (reason == ADDON_UNINSTALL) {
    OS.File.removeDir(aPath);
  }
}
