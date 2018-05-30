(function (PIXI, g, c, window) {
    'use strict';

    if (typeof(require) === 'function') {
        window.Random = require('./js/lib/random.min.js');
        window.sprintf = require('./js/lib/sprintf.js');
    }
    PIXI.Container.prototype.eventAllCustom = function() {
        var that = this;
        if (this.custom_items) {
            this.custom_items.forEach(function(child) {
                if (child.visible) {
                    child.beforeDraw();
                    child.eventAllCustom();
                }
            });
        }
    };

    PIXI.Container.prototype.beforeDraw = function() {

    };
    PIXI.Container.prototype.drawAllCustom = function() {
        var that = this;
        if (this.custom_items) {
            this.custom_items.forEach(function(child) {
                if (child.visible && !child.skip_draw) {
                    child.draw();
                    child.drawAllCustom();
                }
            });
        }
    };
    PIXI.Container.prototype.draw = function() {
    };
    PIXI.Container.prototype.setRef = function(j) {
        this.j = j;
    };

    PIXI.Container.prototype.removeCustom = function(e) {
        var k = this.custom_items.indexOf(e);
        if (k > -1) {
            this.removeChild(e);
            this.custom_items.splice(k, 1);

        }
    };

    PIXI.Container.prototype.addCustom = function(e, j) {
        if (!this.custom_items) {
            this.custom_items = [];
        }
        this.custom_items.push(e);
        this.addChild(e);
    }


    var j = {};
    Object.assign(j, {
        randEngine : Random.engines.mt19937().autoSeed(),
        win_width : g.win_width,
        win_height : g.win_height,
        centerx : g.centerx,
        centery : g.centery,
    });


    g.app = new PIXI.Application({width: j.win_width, height: j.win_height});
    document.body.appendChild(g.app.view);
    j.view = new PIXI.Container();

    j.viewui = new PIXI.Container();
    g.app.stage.addChild(j.view);
    g.app.stage.addChild(j.viewui);

    for (var i = 0; i < 10000; i++ ) {
        var sp = new PIXI.Sprite();
        j.view.addChild(sp);
        g.mainmap_tex.push(sp);
    }


    // window.addEventListener('resize', function() {
    // g.app.renderer.resize(g.win_width, g.win_height);
    // j.win_width = g.win_width;
    // j.win_height = g.win_height;
    // j.centerx = g.centerx;
    // j.centery = g.centery;
    // }, true);

    document.getElementById('stats').appendChild  ( g.stats.domElement );

    // g.launchIntoFullscreen = function (element) {
    // if(element.requestFullscreen) {
    // element.requestFullscreen();
    // } else if(element.mozRequestFullScreen) {
    // element.mozRequestFullScreen();
    // } else if(element.webkitRequestFullscreen) {
    // element.webkitRequestFullscreen();
    // } else if(element.msRequestFullscreen) {
    // element.msRequestFullscreen();
    // }
    // }

    // g.exitFullscreen = function() {
    // if (document.exitFullscreen) {
    // document.exitFullscreen();
    // } else if (document.msExitFullscreen) {
    // document.msExitFullscreen();
    // } else if (document.mozCancelFullScreen) {
    // document.mozCancelFullScreen();
    // } else if (document.webkitExitFullscreen) {
    // document.webkitExitFullscreen();
    // }
    // }

    // document.getElementById('fullscreen').addEventListener('click', function() {
    // if (this.classList.contains('active')) {
    // g.exitFullscreen(document.documentElement);
    // }
    // else {
    // g.launchIntoFullscreen(document.documentElement);
    // }
    // this.classList.toggle('active');

    // }, true);

    g.utils = new c.Utils(j);
    g.keyconfig = {
        UP: 38,
        DOWN: 40,
        LEFT: 37,
        RIGHT: 39,
        RET: 13,
        ESC: 27,
        SPACE: 32,
    };
    g.pause_ = 0;
    g.pause = function(ms) {
        g.pause_ = 1;
        setTimeout (function() {
            g.pause_ = 0;
        }, ms);
    };
    j.target = [];
    j.save = new c.Save(j);
    j.mainmap = new c.MainMap(j);
    j.subscene = new c.SubScene(j);
    j.gevent = new c.Event(j);
    j.tm = new c.TextureManager(j);
    j.control = new c.Controls(j);
    j.gameutil = new c.gameUtil(j);
    j.type = new c.Type(j);
    j.battle = new c.BattleScene(j);
    j.battlemap = new c.BattleMap(j);
    j.op = new c.Option(j);




    var progress = {};
    var preload_screen = new PIXI.Container();
    let Resource = PIXI.loaders.Resource;

    Resource.setExtensionXhrType("002", Resource.XHR_RESPONSE_TYPE.BUFFER);
    Resource.setExtensionXhrType("idx32", Resource.XHR_RESPONSE_TYPE.BUFFER);
    Resource.setExtensionXhrType("grp32", Resource.XHR_RESPONSE_TYPE.BUFFER);
    Resource.setExtensionXhrType("grp", Resource.XHR_RESPONSE_TYPE.BUFFER);
    Resource.setExtensionXhrType("ka", Resource.XHR_RESPONSE_TYPE.BUFFER);
    Resource.setExtensionXhrType("idx", Resource.XHR_RESPONSE_TYPE.BUFFER);
    Resource.setExtensionXhrType("sta", Resource.XHR_RESPONSE_TYPE.BUFFER);
    const cache = {};
    var mycache = function(resource, next) {
        if (resource.extension == 'ka' || resource.extension == 'txt') {
            dbget(resource.url,
                function(data) {
                    resource.data = data;
                    resource.complete();
                    next();
                },
                function() {
                    resource.onComplete.once(function(i) {
                        dbsave(i.url, i.data);

                    });
                    next();
                });
        }
        else {
            next();
        }
    }

    var indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB || window.shimIndexedDB;


    function dbsave(key, data) {
        var open = indexedDB.open("jy", 1);
        open.onupgradeneeded = function() {
            var db = open.result;
            var store = db.createObjectStore("jy", {keyPath: "id"});
            var index = store.createIndex("dataIndex", ["data.data"]);
        };

        open.onsuccess = function() {
            var db = open.result;
            var tx = db.transaction("jy", "readwrite");
            var store = tx.objectStore("jy");
            var index = store.index("dataIndex");
            store.put({ id : key, data: data});
        }
    }
    function dbget(key, callback, next) {
        var open = indexedDB.open("jy", 1);
        open.onsuccess = function() {
            var db = open.result;
            var tx = db.transaction("jy", "readwrite");
            var store = tx.objectStore("jy");
            var index = store.index("dataIndex");
            var getdata = store.get(key);
            getdata.onsuccess = function() {
                if (getdata.result) {
                    callback(getdata.result.data);
                }
                else {
                    next();
                }
            }
        };

    }


    function load_file() {
        var file_load = new PIXI.loaders.Loader();
        file_load.pre(mycache);
        file_load.add('saveindex', 'game/save/ranger.idx32')
            .add('r0', 'game/save/ranger.grp32')
            .add('s0', 'game/save/ALLSIN.GRP')
            .add('d0', 'game/save/ALLDEF.GRP')
            .add('r1', 'game/save/r1.grp32')
            .add('s1', 'game/save/S1.grp')
            .add('d1', 'game/save/D1.grp')
            .add('r2', 'game/save/r2.grp32')
            .add('s2', 'game/save/S2.GRP')
            .add('d2', 'game/save/D2.GRP')
            .add('r3', 'game/save/r3.grp32')
            .add('s3', 'game/save/S3.GRP')
            .add('d3', 'game/save/D3.GRP')
            .add('r4', 'game/save/r4.grp32')
            .add('s4', 'game/save/S4.grp')
            .add('d4', 'game/save/D4.grp')
            .add('r5', 'game/save/r5.grp32')
            .add('s5', 'game/save/S5.grp')
            .add('d5', 'game/save/D5.grp')
            .add('r6', 'game/save/r6.grp32')
            .add('s6', 'game/save/s6.grp')
            .add('d6', 'game/save/d6.grp')
            .add('r7', 'game/save/r7.grp32')
            .add('s7', 'game/save/s7.grp')
            .add('d7', 'game/save/d7.grp')
            .add('r8', 'game/save/r8.grp32')
            .add('s8', 'game/save/s8.grp')
            .add('d8', 'game/save/d8.grp')
            .add('r9', 'game/save/r9.grp32')
            .add('s9', 'game/save/s9.grp')
            .add('d9', 'game/save/d9.grp')
            .add('r10', 'game/save/r99.grp32')
            .add('s10', 'game/save/s99.grp')
            .add('d10', 'game/save/d99.grp')
            .add('war', 'game/resource/war.sta')
            .add('waridx', 'game/resource/warfld.idx')
            .add('wargrp', 'game/resource/warfld.grp')
            .add('cloudindex', 'game/resource/cloud/index.ka')
            .add('smapindex', 'game/resource/smap/index.ka')
            .add('titleindex', 'game/resource/title/index.ka')
            .add('headindex', 'game/resource/head/index.ka')
            .add('itemindex', 'game/resource/item/index.ka')
            .add('mmapindex', 'game/resource/mmap/index.ka')
            .add('earth', 'game/resource/earth.002')
            .add('surface', 'game/resource/surface.002')
            .add('building', 'game/resource/building.002')
            .add('buildx', 'game/resource/buildx.002')
            .add('buildy', 'game/resource/buildy.002')
            .add('talkindex', 'game/resource/talk.idx')
            .add('talkgrp', 'game/resource/talk.grp')
            .add('kdefindex', 'game/resource/kdef.idx')
            .add('kdefgrp', 'game/resource/kdef.grp');

        var args = [];
        if (g.resload['mainmap']) {
            var arg = {};
            arg.name = 'mmapjson';
            arg.url = 'game/resource/mmap.json';
            args.push(arg);

            var arg = {};
            arg.name = 'cloudjson';
            arg.url = 'game/resource/cloud.json';
            args.push(arg);

        }
        if (g.resload['subscene']) {
            var arg = {};
            arg.name = 'smapjson';
            arg.url = 'game/resource/smap.json';
            args.push(arg);

        }
        if (g.resload['ui']) {
            var arg = {};
            arg.name = 'headjson';
            arg.url = 'game/resource/head.json';
            args.push(arg);

            var arg = {};
            arg.name = 'titlejson';
            arg.url = 'game/resource/title.json';
            args.push(arg);

            var arg = {};
            arg.name = 'itemjson';
            arg.url = 'game/resource/item.json';
            args.push(arg);

            var arg = {};
            arg.name = 'item-null.png';
            arg.url = 'game/resource/null.png';
            args.push(arg);

            for (var i = 1; i <= 23; i++) {
                var arg = {};
                arg.name = 'bgm-' + i;
                arg.url = 'game/music/' + i + '.ogg';
                args.push(arg);
            }
            for (var i = 0; i <= 24; i++) {
                var arg = {};
                arg.name = 'sound-atk-' + i;
                arg.url = 'game/sound/atk' + sprintf("%02d", i) + '.wav';
                args.push(arg);
            }
            for (var i = 0; i <= 52; i++) {
                var arg = {};
                arg.name = 'sound-e-' + i;
                arg.url = 'game/sound/e' + sprintf("%02d", i) + '.wav';
                args.push(arg);
            }


            battleids.forEach(function(i) {
                var ii = g.utils.zpad(i, 3);
                var arg = {};
                arg.name = 'fight-' + ii + 'json';
                arg.url = 'game/resource/fight/' + ii + '.json';
                args.push(arg);

                var arg = {};
                arg.name = 'fight-' + ii;
                arg.res_type = 'frame';
                arg.url = 'game/resource/fight/fight' + g.utils.zpad(i, 3) + '/fightframe.txt';
                args.push(arg);


                var arg = {};
                arg.name = 'fight-' + ii + '-index';
                arg.url = 'game/resource/fight/fight' + ii + '/index.ka';
                args.push(arg);
            });
            for (var i = 0; i <= 52; i++) {
                var ii = g.utils.zpad(i, 3);
                var arg = {};
                arg.name = 'eft-' + ii + 'json';
                arg.url = 'game/resource/eft/' + ii + '.json';
                args.push(arg);

                var arg = {};
                arg.name = 'eft-' + ii + '-index';
                arg.url = 'game/resource/eft/eft' + ii + '/index.ka';
                args.push(arg);
            }

        }
        file_load.add(args);

        file_load.load((file_loader, res) => {
            j.save.init(res);
            j.mainmap.init(res);
            j.battlemap.init(res);
            j.title = new c.TitleScene(j);
            g.jsonframes = [];
            j.battle.init();
            j.ui = new c.UI(j);
            j.ui.visible = false;
            j.viewui.addCustom(j.ui);


            for (var i = 0; i < 10; i++ ) {
                var gp = new PIXI.Graphics();
                j.viewui.addChild(gp);
                g.graphics.push(gp);
            }
            for (var i = 0; i < 400; i++ ) {
                var tx = new PIXI.Text();
                j.viewui.addChild(tx);
                g.txt.push(tx);
            }
            for (var i = 0; i < 20; i++ ) {
                var sp = new PIXI.Sprite();
                j.viewui.addChild(sp);
                g.gsprite.push(sp);
            }

            for (var k in res) {
                if (k.match(/json/g)) {
                    for (var k1 in res[k].data.frames) {
                        g.jsonframes.push(k1);
                    }
                }
            }
            var battletextures = {};

            battleids.forEach(function(i) {
                var ii = g.utils.zpad(i, 3);
                j.battle.battle_fight['fight-' + ii] = res['fight-' + ii].data;
                if (res['fight-' + ii + '-index']) {
                    var index = new Uint16Array(res['fight-' + ii + '-index'].data);
                    var delta_xy = g.utils.getIndex(res['fight-' + ii + '-index'].data, index);
                    g.delta['fight' + ii] = delta_xy;
                }
            });
            for (var i = 0; i <= 52; i++) {
                var ii = g.utils.zpad(i, 3);
                if (res['eft-' + ii + '-index']) {
                    var index = new Uint16Array(res['eft-' + ii + '-index'].data);
                    var delta_xy = g.utils.getIndex(res['eft-' + ii + '-index'].data, index);
                    g.delta['eft' + ii] = delta_xy;
                }

            }
            j.gevent.init(res);
            if (g.prefix) {
                load_extra();
            }
            else {
                load_db();
            }

        });
        file_load.on('progress', (file_loader, file_res) => {
            progress.setText(parseInt(file_loader.progress).toString() + '%');
            loadingbar.drawRect(0, 0, 200 * parseInt(file_loader.progress) / 100, 9);
        });
    }
    function load_db() {
        if (dbinit) {
            var cb = function(i) {
                progress.setText('載入預設存檔 - ' + i);
                if (i == 10) {
                    start();
                    j.title.save_menu.reload();
                    return;
                }
                i++;
                j.save.load(i, cb);
                j.save.writeData(i, cb);
            };
            j.save.load(0, cb);
            j.save.writeData(0, cb);
        }
        else {
            j.title.save_menu.reload();
            start();
        }
    }

    function start() {
        j.view.removeChild(preload_screen);

        j.control.start();
        j.view.scale.x =  j.win_width / (j.centerx * 2);
        j.view.scale.y =  j.win_height / (j.centery * 2);
        if (g.debug == 'subscene') {
            j.save.load(4);
            j.mainmap.debugSubscene(27);
            return;
        }
        if (g.debug == 'ui') {
            j.subscene.debugUI();
            return;
        }

        j.save.load(0);
        if (g.debug == 'battle') {
            j.battle.setID(77);
            j.battle.start();
            return;
        }
        if (g.debug == 'title') {
            j.viewui.addCustom(j.title);
            j.title.init();
            return;
        }
        if (g.debug == 'mainmap') {
            if (j.save.data.InSubMap > 0) {
                j.mainmap.forceEnterSubscene(j.save.data.InSubMap, j.save.data.SubMapX, j.save.data.SubMapY);
                return;
            }
            j.mainmap.setManPosition(j.save.data.MainMapX, j.save.data.MainMapY);
            j.mainmap.start();
        }
        j.viewui.addCustom(j.title);
        j.title.init();
        return;
    };

    function load_extra() {
        var extra_load = new PIXI.loaders.Loader();
        var args = [];
        for (var k in g.jsonframes) {
            var arg = {};
            arg.name = g.prefix + g.jsonframes[k];
            if (g.jsonframes[k].match(/fight/g)) {
                arg.url = 'game/resource/fight/' + g.jsonframes[k];
            }
            else if (g.jsonframes[k].match(/eft/g)) {
                arg.url = 'game/resource/eft/' + g.jsonframes[k];
            }
            else {
                arg.url = 'game/resource/' + g.jsonframes[k];
            }
            args.push(arg);
        }
        extra_load.add(args);
        extra_load.on('progress', (res_loader, res) => {
            progress.setText(parseInt(res_loader.progress).toString() + '%');
            loadingbar.drawRect(0, 0, 200 * parseInt(res_loader.progress) / 100, 9);
            progress.setText("資源載入中 " + parseInt(res_loader.progress).toString() + '%');
        });

        extra_load.load((extra_loader, res) => {
            load_db();
        });
    }

    var battleids = [
        0,1,2,3,4,5,6,7,8,9,10,
        11,12,13,14,15,16,17,18,19,20,
        21,22,23,24,25,26,27,28,29,
        31,32,33,34,35,36,37,38,
        43,44,45,46,47,48,49,50,
        51,53,54,55,56,57,58,59,60,
        61,62,63,64,65,67,68,69,70,
        71,76,77,78,79,80,
        81,82,83,84,85,86,87,88,90,
        91,92,93,94,95,96,97,98,99,100,
        101,102,109];
    var loadingbar = new PIXI.Graphics();
    var dbinit = false;
    PIXI.loader
        .add('bg', 'game/resource/title/0.png')
        .load((loader, resources) => {
            loadingbar.beginFill(g.utils.rgbToHex(94, 107, 101), 1);
            loadingbar.drawRect(0, 0, 200 * 0, 9);
            progress = new PIXI.Text('0%', { font: '10px', fill: g.utils.rgbToHex(0, 0, 0), align: 'left' });
            progress.position.x = g.app.view.width / 2	;
            progress.position.y = g.app.view.height / 2 + 25;
            loadingbar.position.x = g.app.view.width / 2 - 200 / 2;
            loadingbar.position.y = g.app.view.height / 2;
            progress.anchor.set(0.5);
            var bg = new PIXI.Sprite();
            preload_screen.addChild(bg);
            bg.setTexture(PIXI.TextureCache['bg']);
            bg.position.set(0, 0);




            preload_screen.addChild(loadingbar);
            preload_screen.addChild(progress);
            j.view.addChild(preload_screen);

            j.save.dbsave('init', 1, null, function() {
                dbinit = true;
            });
            load_file();

        });
})(PIXI, g, c, window);



