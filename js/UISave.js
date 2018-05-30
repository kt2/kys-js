(function (PIXI, g, c, window) {
    'use strict';

    c.UISave = function (j) {
        this.j = j;
        Object.assign(this, {
            visible : false,
            max_record : 10,
            savedata : {},
            mode : 0
        });
        c.MenuText.call(this, j, []);
    };

    c.UISave.prototype = Object.create(c.MenuText.prototype);
    c.UISave.constructor = c.UISave;

    c.UISave.prototype.load = function() {


    };
    c.UISave.prototype.reload = function() {
        var str = [];
        var loaded = 0;
        var that = this;
        var addRecord = function(data, idx) {
            str.push("進度" + sprintf("%02d", idx) + "  " + data);
            loaded++;
            if (loaded == that.max_record) {
                that.setmenu(str);
            }
        };
        var skipRecord = function(idx) {
            str.push("進度" + sprintf("%02d", idx) + " " + " ------------------- ");
            loaded++;
            that.savedata[loaded] = '';
            if (loaded == that.max_record) {
                that.setmenu(str);
            }
        };

        var that = this;
        for (var i = 1; i <= this.max_record + 1; i++) {
            this.j.save.dbget('jysave-' + i + '-date', addRecord, skipRecord, i);
        }
    };
    c.UISave.prototype.onPressedCancel = function() {
        this.visible = false;

        this.j.title.menu.visible = true;

    };
    c.UISave.prototype.getResult = function() {
        var i = this.menu_items.indexOf(this.selected);
        if (this.mode == 1) {
            this.j.save.writeData(i + 1);
            this.visible = false;
            return;
        }
        var save_skipped = function() {

        };
        var save_loaded = function(data) {
            var i = 0;
            this.savedata[i] = JSON.parse(data);
            if (this.savedata[i]) {
                this.j.save.savedata = [];
                this.j.save.items = [];
                this.j.save.magics = [];
                this.j.save.roles = [];
                for (var k in this.savedata[i].roles) {
                    this.j.save.roles.push (new c.role(this.savedata[i].roles[k], this.j));
                }
                for (var k in this.savedata[i].items) {
                    this.j.save.items.push (new c.item(this.savedata[i].items[k], this.j));
                }
                for (var k in this.savedata[i].shops) {
                    this.j.save.shops.push (new c.shop(this.savedata[i].shops[k], this.j));
                }
                for (var k in this.savedata[i].submap_infos) {
                    this.j.save.submap_infos[k].data = this.savedata[i].submap_infos[k].data;
                    this.j.save.submap_infos[k].layer_data = this.savedata[i].submap_infos[k].layer_data;
                    for (var kk in this.savedata[i].submap_events[k]) {
                        this.j.save.submap_infos[k].events[kk].data = this.savedata[i].submap_events[k][kk];
                    }
                }

                for (var k in this.savedata[i].magics) {
                    this.j.save.magics.push (new c.magic(this.savedata[i].magics[k], this.j));
                }
                this.j.save.data = this.savedata[i].savedata;
                this.j.mainmap.setManPosition(this.j.save.data.MainMapX, this.j.save.data.MainMapY);
                if (this.j.target) {
                    this.j.target.stop();
                }
                this.j.title.stop();
                this.j.title.visible = false;
                this.j.mainmap.start();
                if (this.j.save.data.InSubMap >= 0) {
                    this.j.mainmap.forceEnterSubscene(this.j.save.data.InSubMap, this.j.save.data.SubMapX, this.j.save.data.SubMapY);
                }
                this.visible = false;
            }
        }
        i++;
        this.j.save.dbget('jysave-' + i, save_loaded.bind(this), save_skipped.bind(this), i);


    };
    c.UISave.prototype.setmenu = function(str) {
        this.setStrings(str);
        this.setFontSize(22);
        this.arrange(0,0,0,28);
    };



})(PIXI, g, c, window);
