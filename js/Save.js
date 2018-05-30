(function (PIXI, g, c, window) {
    'use strict';

    c.Save = function (j) {
        this.j = j;
        Object.assign(this, {
            submap_infos : [],
            submap_coord_count : 64,
            savedata : [],
            data : {},
            roles : [],
            items : [],
            items : [],
            magics	 : [],
            ddata_length : 0,
            sdata_length : 0,
            teamMate_count : 6,
            role_magic_count : 10,
            item_in_bag_count : 200,
            role_taking_item_count : 4

        });

    };

    c.Save.prototype.getItemByBagIndex = function(i) {
        if (i < 0 || i >= this.item_in_bag_count) {
            return null;
        }
        var r = this.data.Items[i].item_id;
        if (r < 0 || r >= this.data.Items.length) {
            return null;
        }
        return this.items[r];
    };

    c.Save.prototype.getItem = function(i) {
        if (i < 0 || i > this.items.length) {
            return null;
        }
        return this.items[i];
    };


    c.Save.prototype.getShop = function(i) {
        if (i < 0 || i >= this.shops.length) {
            return null;
        }
        return this.shops[i];

    };

    c.Save.prototype.getTeamMate = function(i) {
        if (i < 0 || i >= this.teamMate_count) {
            return null;
        }
        var r = this.data.Team[i];
        if (r < 0 || r >= this.roles.length) {
            return null;
        }
        return this.roles[r];
    };

    c.Save.prototype.init = function(resources) {
        this.resources = resources;
    };
    c.Save.prototype.load = function(i) {
        var save_lang = ["big5", "gbk", "gbk", "gbk", "big5", "big5","gbk", "gbk", "gbk", "gbk", "gbk"];
        this.j.type.schema.magicSave.Name[2] = save_lang[i];
        this.j.type.schema.roleSave.Name[2] = save_lang[i];
        this.j.type.schema.roleSave.Nick[2] = save_lang[i];
        this.j.type.schema.ItemSave.Name[2] = save_lang[i];
        this.j.type.schema.ItemSave.Introduction[2] = save_lang[i];
        this.j.type.schema.subMapInfoSave.Name[2] = save_lang[i];

        this.savefile = this.resources["r" + i].data;
        var s3data = this.resources["s" + i].data;
        var s3 = new Int16Array(s3data);
        var d3data = this.resources["d" + i].data;
        var d3 = new Int8Array(d3data);
        this.sdata_length = 2 * this.j.type.submap_layer_count * this.j.type.submap_coord_count * this.j.type.submap_coord_count;
        this.ddata_length = 22 * this.j.type.submap_event_count;
        //var ddata_length = jy.type.submap_event_count;

        //var saveindex = new Uint16Array(resources.saveindex.data);
        // var len = resources.saveindex.data.byteLength;
        // var data_idx = new Uint32Array(resources.saveindex.data);
        //var data_grp = new Uint32Array(resources.savegrp.data);


        var offset = [0];
        var length_arr = [];

        g.utils.getIdxContent(this.resources.saveindex.data, offset, length_arr);

        // for (var i = 0; i < len; i++) {
        // var offset_i = data_idx[i];
        // if (offset_i) {
        // offset[i + 1] = offset_i;
        // }
        // var length_diff = offset[i + 1] - offset[i];
        // if (length_diff) {
        // length_arr[i] = length_diff;
        // }
        // }

        this.savedata = [];
        this.items = [];
        this.submap_infos = [];
        this.magics = [];
        this.roles = [];
        this.shops = [];


        this.readData(0, this.resources, this.savedata, length_arr, offset);
        this.data = this.savedata[0].data;

        delete this.savedata;
        this.readData(1, this.resources, this.roles, length_arr, offset);
        this.readData(2, this.resources, this.items, length_arr, offset);
        this.readData(3, this.resources, this.submap_infos, length_arr, offset);
        this.readData(4, this.resources, this.magics, length_arr, offset);
        this.readData(5, this.resources, this.shops, length_arr, offset);
        var submap_count = this.submap_infos.length - 1;

        var submapEventType = {
            'jBinary.all': 'subMapEventList',
            'jBinary.littleEndian': true,
            'subMapEvent' : {
                CannotWalk: 'int16',
                Index: 'int16',
                Event1: 'int16',
                Event2: 'int16',
                Event3: 'int16',
                CurrentPic: 'int16',
                EndPic: 'int16',
                BeginPic: 'int16',
                PicDelay: 'int16',
                X: 'int16',
                Y: 'int16'
            }
        };

        Object.assign(submapEventType, {'subMapEventList' : this.j.type.schema.subMapEventList});
        var s = 0;


        var dataview = new jDataView(d3, 0, this.ddata_length * submap_count , true);
        var tmp = new jBinary(dataview, submapEventType);
        var eventdata = tmp.readAll();

        for (var i = 0; i < submap_count; i++) {
            var loop_index = 0;

            while(loop_index < this.j.type.submap_layer_count) {
                this.submap_infos[i].layer_data[loop_index] = [];
                this.submap_infos[i].layer_data[loop_index] = s3.slice(s, s + this.j.type.submap_coord_count * this.j.type.submap_coord_count);
                s += this.j.type.submap_coord_count * this.j.type.submap_coord_count;
                loop_index++;
            }
            var start = i * this.j.type.submap_event_count;
            for (var j = start; j < (start + this.j.type.submap_event_count); j++) {
                this.submap_infos[i].events.push(new c.subMapEvent(eventdata.Items[j]));
            }
            // var d = this.ddata_length * i;
            // for (var j = 0; j < this.j.type.submap_event_count; j++) {
            // var dataview = new jDataView(d3, d, this.ddata_length , true);
            // var eventdata = new jBinary(dataview, submapEventType);
            // this.submap_infos[i].events.push(new c.subMapEvent(eventdata.readAll()));
            // d += 22;
            // }
        }



    }
    c.Save.prototype.loadFromDB = function(num) {

    };
    c.Save.prototype.writeData = function(num = 1, cb = null) {
        var save = {
            roles : [],
            submap_infos : [],
            submap_events : [],
            magics : [],
            items : [],
            shops : [],
            date : g.utils.getCurrentTime()
        };
        if (typeof(cb) != 'function') {
            if (this.j.target == this.j.mainmap) {
                this.data.InSubMap = -1;
            }
            this.data.MainMapX = this.j.mainmap.man_x;
            this.data.MainMapY = this.j.mainmap.man_y;
            if (this.j.target == this.j.subscene) {
                this.data.InSubMap = this.j.subscene.submap_id;
                this.data.SubMapX = this.j.subscene.man_x;
                this.data.SubMapY = this.j.subscene.man_y;
            }
        }
        save.savedata = this.data;
        for (var i in this.roles) {
            save.roles.push(this.roles[i].data);
        }
        for (var i in this.submap_infos) {
            save.submap_infos[i] = {}
            save.submap_infos[i].data = this.submap_infos[i].data;
            save.submap_infos[i].layer_data = this.submap_infos[i].layer_data;
        }
        for (var i in this.submap_infos) {
            save.submap_events[i] = [];
            for (var k in this.submap_infos[i].events) {
                save.submap_events[i].push(this.submap_infos[i].events[k].data);
            }
        }
        for (var i in this.magics) {
            save.magics.push(this.magics[i].data);
        }
        for (var i in this.items) {
            save.items.push(this.items[i].data);
        }
        for (var i in this.shops) {
            save.shops.push(this.shops[i].data);
        }
        this.j.title.save_menu.savedata[num - 1] = save;
        this.dbsave('jysave-' + num + '-date', save.date);
        if (cb) {
            this.dbsave('jysave-' + num, JSON.stringify(save), cb.bind(window, num));
        }
        else {
            this.dbsave('jysave-' + num, JSON.stringify(save));
        }
        if (this.j.title.save_menu.menu_items[num - 1]) {
            this.j.title.save_menu.menu_items[num - 1].setText("進度" + sprintf("%02d", num) + "  " + save.date);
        }
    };
    c.Save.prototype.readData = function(idx, resources, target, length_arr, offset) {
        var jbinary_type = {
            'jBinary.all': 'name',
            'jBinary.littleEndian': true,
            'ItemList' : {
                item_id : 'int32',
                count : 'int32',
            },
        };


        var attr = [
            {
                'data_length' : 2320,
                'data_class' : 'saveData',
                'data_schema' : this.j.type.schema.saveData
            },
            {
                'data_length' : 364,
                'data_class' : 'role',
                'data_schema' : this.j.type.schema.roleSave
            }, {
                'data_length' : 380,
                'data_class' : 'item',
                'data_schema' : this.j.type.schema.ItemSave
            }, {
                'data_length' : 104,
                'data_class' : 'subMapInfo',
                'data_schema' : this.j.type.schema.subMapInfoSave
            }, {
                'data_length' : 272,
                'data_class' : 'magic',
                'data_schema' :this.j.type.schema.magicSave
            }, {
                'data_length' : 60,
                'data_class' : 'shop',
                'data_schema' : this.j.type.schema.shopSave
            },
        ];
        Object.assign(jbinary_type, {'name' : attr[idx].data_schema});
        var length_one = attr[idx].data_length;
        var count = length_arr[idx] / length_one;
        var grp_start = offset[idx];

        for (var i = 0; i < count; i++) {
            var dataview = new jDataView(this.savefile, grp_start + i * length_one, length_one, true);
            var jdata = new jBinary(dataview, jbinary_type);
            target.push(new c[attr[idx].data_class](jdata.readAll(), this.j));
        }
    };

    c.Save.prototype.moneyUsed = function(amount) {
        var item_id = this.j.op.MoneyItemID;
        for (var i = 0; i < this.item_in_bag_count; i++) {
            var id = this.data.Items[i].item_id;
            if (id < 0) {
                break;
            }
            if (id == item_id) {

                this.data.Items[i].count -= amount;
            }
        }
    };
    c.Save.prototype.getItemCountInBag = function(item_id) {
        for (var i = 0; i < this.item_in_bag_count; i++) {
            var id = this.data.Items[i].item_id;
            if (id < 0) {
                break;
            }
            if (id == item_id) {
                return this.data.Items[i].count;
            }
        }
        return 0;
    };
    c.Save.prototype.getMagic = function(i, obj) {
        if (i <= 0 || i >= this.magics.length) {
            return null;
        }
        if (obj) {
            return this.magics[i];
        }
        return this.magics[i].data;
    };
    c.Save.prototype.getRoleLearnedMagic = function(r, i) {
        if (i < 0 || i >= this.role_magic_count) {
            return null;
        }
        return this.getMagic(r.MagicID[i]);
    };
    c.Save.prototype.getRoleLearnedMagic2 = function(r, i) {
        if (i < 0 || i >= this.role_magic_count) {
            return null;
        }
        return this.getMagic(r.MagicID[i], true);
    };

    c.Save.prototype.getRoleLearnedMagicLevelIndex = function(r, m) {
        for (var i = 0; i < this.role_magic_count; i++) {
            if (r.data.MagicID[i] == m.data.ID) {
                return r.getRoleMagicLevelIndex(i);
            }
        }

    };

    c.Save.prototype.getMoneyCountInBag = function() {
        return this.getItemCountInBag(this.j.op.MoneyItemID);
    };


    c.Save.prototype.getRole = function(i) {
        if (i < 0 || i >= this.roles.length) {
            return null;
        }
        return this.roles[i];
    };
    c.Save.prototype.getSubMapInfo = function(i) {
        if (i < 0 || i >= this.submap_infos.length) {
            return null;
        }
        return this.submap_infos[i];
    };

    c.Save.prototype.dbsave = function(key, data, cb, upgrade_check) {
        var open = indexedDB.open("jy", 1);
        open.onupgradeneeded = function() {
            var db = open.result;
            var store = db.createObjectStore("jy", {keyPath: "id"});
            var index = store.createIndex("dataIndex", ["data.data"]);
            upgrade_check();
        };
        open.onsuccess = function() {
            var db = open.result;
            var tx = db.transaction("jy", "readwrite");
            var store = tx.objectStore("jy");
            var index = store.index("dataIndex");
            store.put({ id : key, data: data});
            if (cb) {
                cb();
            }
        }
    }
    c.Save.prototype.dbget = function(key, callback, next, idx) {
        var open = indexedDB.open("jy", 1);
        open.onsuccess = function() {
            var db = open.result;
            var tx = db.transaction("jy", "readwrite");
            var store = tx.objectStore("jy");
            var index = store.index("dataIndex");
            var getdata = store.get(key);
            getdata.onsuccess = function() {
                if (getdata.result) {
                    callback(getdata.result.data, idx);
                }
                else {
                    next(idx);
                }
            }
        };

    }


    // c.RoleSave = function() {
    // Object.assign({
    // 'ID' : null,
    // 'HeadID' : null,
    // 'IncLife' : null

    // }, this);


    // };




})(PIXI, g, c, window);
