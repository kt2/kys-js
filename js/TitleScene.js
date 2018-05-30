(function (PIXI, g, c, window) {
    'use strict';
    c.TitleScene = function(j) {
        PIXI.Container.call(this);
        this.j = j;
        Object.assign(this, {
            count : 0,
            head_id : null,
            head_x : 0,
            head_y : 0,
            color : g.utils.rgbToHex(255, 255, 255)
        });
        this.bg = new PIXI.Sprite();
        this.head = new PIXI.Sprite();
        this.addChild(this.bg);
        this.addChild(this.head);
        this.menu = new c.Menu(j);
        this.save_menu = new c.UISave(j);
        this.save_menu.visible = false;
        this.addCustom(this.save_menu);
        this.addCustom(this.menu);
        this.save_menu.position.set(500, 300);
        this.menu.position.set(400, 250);
        var that = this;

        this.menu.getResult = function() {
            var i = this.menu_items.indexOf(this.selected);
            this.selected = null;
            that.menu.visible = false;

            if (i == 0) {
                j.save.load(0);
                that.newRole();
            }

            else if (i == 1) {
                that.removeCustom(that.save_menu);
                that.addCustom(that.save_menu);
                that.save_menu.visible = true;
            }
            else if (i == 2) {
                var remote = require('electron').remote;
                remote.getCurrentWindow().close();
            }

        };
        this.overlay = new PIXI.Graphics();
        this.overlay.beginFill(0x000000, 192/255);
        this.overlay.drawRect(0, 0, g.app.view.width, g.app.view.height);
        this.overlay.visible = false;
        this.addChild(this.overlay);
    };

    c.TitleScene.prototype = Object.create(PIXI.Container.prototype);
    c.TitleScene.constructor = c.TitleScene;
    c.TitleScene.prototype.op1 = function() {
        g.pause(1000);
        this.visible = false;
        this.j.mainmap.man_x = this.j.save.data.MainMapX;
        this.j.mainmap.man_y = this.j.save.data.MainMapY;
        this.j.mainmap.towards = 1;
        this.j.mainmap.start(1);
        this.j.mainmap.forceEnterSubscene(70, 19, 20);
        this.removeCustom(this.newrole);
        this.overlay.visible = false;
        this.stop();

    };
    c.TitleScene.prototype.stop = function() {
        cancelAnimationFrame(this.requestid);
    };
    c.TitleScene.prototype.newRole = function() {
        this.overlay.visible = true;
        this.newrole = new c.RandomRole(this.j);
        this.newrole.x = 300;
        this.newrole.setRole(this.j.save.getRole(0));
        this.addCustom(this.newrole);


    };
    c.TitleScene.prototype.draw = function() {
        if (!this.fixed_update) {
            this.requestid = requestAnimationFrame(this.draw.bind(this));
        }
        else {
            var timeNow = (new Date()).getTime();
            var timeDiff = timeNow - this.g_Time;
            if (timeDiff < this.g_Tick)
                return;
            this.g_Time = timeNow;
            this.requestid = requestAnimationFrame(this.draw.bind(this));
        }
        if (this.debug) {
            g.stats.begin();
        }
        this.eventAllCustom();
        this.overlay.width = g.app.view.width;
        this.overlay.height = g.app.view.height;
        var cc = this.count / 20;
        var alpha = parseInt(255 - Math.abs(255 - this.count % 510));
        this.count++;
        if (alpha == 0) {
            this.head_id = g.utils.rand(115);
            this.head_x = g.utils.rand(1024 - 150);
            this.head_y = g.utils.rand(640 - 150);
        }
        if (this.head_id != null) {
            this.j.tm.render2(this.head_id, "head", this.head_x, this.head_y, this.head, this.color, alpha / 255);
        }
        this.drawAllCustom();
        if (this.debug) {
            g.stats.end();
        }
    };

    c.TitleScene.prototype.start = function() {
        this.j.target = this.j.title;
        this.visible = true;
        this.menu.visible = true;
        PIXI.sound.stopAll();
        PIXI.sound.play('bgm-16', {loop : true, volume : g.volume});
        this.save_menu.position.set(500, 300);
        this.draw();
    };
    c.TitleScene.prototype.init = function() {
        this.j.tm.render2(0, 'title', 0, 0, this.bg);
        this.menu.addItem('title', 3, 23, 23, 20, 0);
        this.menu.addItem('title', 4, 24, 24, 20, 50);
        this.menu.addItem('title', 6, 26, 26, 20, 100);
        this.start();
    };



})(PIXI, g, c, window);
