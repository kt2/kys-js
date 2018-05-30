(function (PIXI, g, c, window) {
    'use strict';

    c.Utils = function (j) {
        this.j = j;
        this.line = 480;
    };
    c.Utils.prototype.constructor = c.Utils;

    c.Utils.prototype.setAll = function(layer, v, line)  {
        for (var i = 0; i < line * line; i++) {
            layer[i] = v;
        }
    };
    c.Utils.prototype.setData = function(layer, x, y, line, target)  {
        var i = x + line * y;
        layer[i] = target;
    };
    c.Utils.prototype.getData = function(layer, x, y, line) {
        if (!line) {
            line = this.line;
        }
        return layer[x + line * y];
    }


    c.Utils.prototype.getCurrentTime = function() {
        var d = new Date();
        return ("0" + d.getDate()).slice(-2) + "-" + ("0"+(d.getMonth()+1)).slice(-2) + "-" +
            d.getFullYear() + "  " + ("0" + d.getHours()).slice(-2) + ":" + ("0" + d.getMinutes()).slice(-2) + ":" + ("0" + d.getSeconds()).slice(-2);
    };
    c.Utils.prototype.componentToHex = function(c) {
        var hex = c.toString(16);
        return hex.length == 1 ? "0" + hex : hex;
    }

    c.Utils.prototype.rgbToHex = function(r, g, b) {
        return "0x" + this.componentToHex(r) + this.componentToHex(g) + this.componentToHex(b);
    }



    c.Utils.prototype.lformat = function(str) {

        if (parseInt(str) >= 0) {
            return '+' + str.toString();
        }
        else {
            return  str.toString();
        }

    };
    c.Utils.prototype.findNumber = function(s, data) {
        var n = 0;
        var str = "";
        var haveNum = false;
        for (var i = 0; i < s.length; i++) {
            var c = s[i];
            var findNumChar = ((parseInt(c) >= 0 && parseInt(c) <= 9) || c == "." || c == "-" || c == "+" || c == "E" || c == "e");
            if (findNumChar) {
                str += c;
                if ((parseInt(c) >= 0 && parseInt(c) <= 9)) {
                    haveNum = true;
                }
            }
            if (!findNumChar || (i == (s.length - 1))) {
                if (str != "" && haveNum) {
                    data.push(str);
                    n++;
                }
                str = "";
                haveNum = false;
            }
        }
        return n;
    };
    c.Utils.prototype.zpad = function(str, len) {
        var r = len - str.toString().length;
        for (var i = 0; i < r; i++) {
            str = '0' + str;
        }
        return str;
    };



    c.Utils.prototype.strim = function(str) {
        return str.toString().replace(/\0/g, "");
    };
    c.Utils.prototype.lpad = function(str, len) {
        str = str.toString().replace(/\0/g,"");
        var l = 0;
        var p = 0;
        while (p < str.length) {
            if (str[p].charCodeAt(0) > 128) {
                l += 2;
            }
            else {
                l ++;
            }
            p++;
        }


        var r = len - l;
        if (len < 0) {
            r = Math.abs(len) - l;
            for (var i = 0; i < r; i++) {
                str = str + " ";
            }
            return str;
        }
        for (var i = 0; i < r; i++) {
            str = " " + str;
        }

        return str;
    }
    c.Utils.prototype.getIdxContent2 = function(resources, offset, length_arr) {
        var len = resources.byteLength;
        let data_idx = new Uint16Array(resources);
        for (var i = 0; i < len; i++) {
            var offset_i = data_idx[i];
            if (offset_i) {
                offset[i + 1] = offset_i;
            }
            var length_diff = offset[i + 1] - offset[i];
            if (length_diff) {
                length_arr[i] = length_diff;
            }
        }
    };
    c.Utils.prototype.getIdxContent = function(resources, offset, length_arr) {
        var len = resources.byteLength;
        let data_idx = new Uint32Array(resources);
        for (var i = 0; i < len; i++) {
            var offset_i = data_idx[i];
            if (offset_i) {
                offset[i + 1] = offset_i;
            }
            var length_diff = offset[i + 1] - offset[i];
            if (length_diff) {
                length_arr[i] = length_diff;
            }
        }
    };

    c.Utils.prototype.rand = function(i) {
        // create a distribution that will consistently produce integers within inclusive range [0, i].
        var distribution = Random.integer(0, i - 1);
        // generate a number that is guaranteed to be within [0, i] without any particular bias.
        return distribution(this.j.randEngine);
    };


    c.Utils.prototype.getIndex = function(r, dataindex) {
        var l = r.byteLength / 4;
        var delta_xy = {};
        for (var i = 0; i < l; i++) {
            var delta_obj = {};
            delta_obj.dx = dataindex[i * 4 / 2];
            delta_obj.dy = dataindex[i * 4 / 2 + 1];
            // if not uint ?
            if (delta_obj.dx > 60000) {
                delta_obj.dx = 65536 - delta_obj.dx;
                if (delta_obj.dx > 0) {
                    delta_obj.dx = -delta_obj.dx;
                }

            }
            if (delta_obj.dy > 60000) {
                delta_obj.dy = 65536 - delta_obj.dy;
                if (delta_obj.dy > 0) {
                    delta_obj.dy = -delta_obj.dy;
                }
            }
            delta_xy[i] = delta_obj;
        }
        return delta_xy;
    };

    c.Utils.prototype.divide2 = function(data) {
        var layer = new Uint16Array(data);
        for (var i = 0; i < 480 * 480; i++) {
            layer[i] = (layer[i] ) / 2;
        }
        return layer;
    }

    c.Utils.prototype.dataclone = function(r){
        var r0 = Object.assign( Object.create( Object.getPrototypeOf(r)), r);
        r0.data = Object.assign( Object.create( Object.getPrototypeOf(r.data)), r.data);
        r0.data.MagicLevel = Object.assign( Object.create( Object.getPrototypeOf(r.data.MagicLevel)), r.data.MagicLevel);

        return r0;
    };
    c.Utils.prototype.clone = function(obj){
        if(obj == null || typeof(obj) != 'object')
            return obj;

        var temp = new obj.constructor();
        for(var key in obj)
            temp[key] = this.clone(obj[key]);

        return temp;
    }




    c.TextBox = function(j) {
        this.j = j;
        PIXI.Container.call(this);
        Object.assign(this, {
            text_ : '',
            txt_max : 10,
            tex_index : 0,
            txt : [],
            sp : '',
            text_x : 0,
            text_y : 0,
            custom : true,
            onpress : false,
            txt_allocate : 0,
            is_menu_item : 0,
            have_box : true,
            resize_with_text : 0,
            font_size : 20,
            spbg : null,
            color_press : 0xFF0000,
            color_normal: 0x000000,
            color : 0x000000,
            color_pass: 0xFFFFFF,
            texture_path: '',
            texture_normal_id: '',
            state_ : 0,
            state : {
                Normal : 0,
                Pass : 1,
                Press : 2,
            }
        });
    };


    c.TextBox.prototype.constructor = c.TextBox;
    c.TextBox.prototype = Object.create(PIXI.Container.prototype);

    c.TextBox.prototype.rendertxt = function(txt, fontsize, color, padding) {
        this.bgResize();
        this.j.tm.rendertxt(txt, fontsize, this.text_x, this.text_y, color, padding, this);
    };
    c.TextBox.prototype.run = function() {
        // this.j.target.unshift(this);
        // for (var i = 0; i < this.children.length; i++) {
        // if (this.children[i].custom) {
        // this.j.target.unshift(this.children[i]);
        // }
        // }
        // this.visible = 1;
    };

    c.TextBox.prototype.setFontSize = function(v) {
        this.tex_index = 0;
        this.font_size = v;
        this.rendertxt(this.text_, this.font_size, this.color, 0);
    };
    c.TextBox.prototype.setHaveBox = function(i) {
        this.have_box = (i) ? true : false;

    };

    c.TextBox.prototype.setTexture = function(normal_id, res_type, pass_id, press_id) {
        this.texture_path = res_type;
        this.texture_normal_id = normal_id;
        this.sp = new PIXI.Sprite();
        this.addChild(this.sp);
        this.j.tm.render2(normal_id, res_type, 0, 0, this.sp);

    };
    c.TextBox.prototype.bgResize = function() {
        if (this.have_box && this.spbg) {
            var p = 0;
            var w = 0;
            var eng_count = 0;
            while (p < this.text_.length) {
                if (this.text_[p].charCodeAt(0) > 128) {
                    w += this.font_size;
                }
                else {
                    eng_count ++;
                    w += this.font_size / 2;
                }
                p++;
            }
            this.spbg.width = w + 20;
            this.spbg.height = this.font_size + 6;
        }
    }
    c.TextBox.prototype.setText = function(txt) {
        this.tex_index = 0;
        this.text_ = txt;
        if (this.text_ == '') {
            return;
        }
        if (this.have_box) {

            if (this.spbg == null) {
                this.spbg = new PIXI.Sprite();
                this.addChild(this.spbg);
                this.bgResize();
            }


        }
        var that = this;
        if (!this.txt_allocate) {
            this.txt.forEach(function(i) {
                i.visible = false;
            });
            for (var i = 0; i < this.text_.length ; i++ ) {
                if (!this.txt[i]) {
                    var tx = new PIXI.Text();
                    this.addChild(tx);
                    this.txt.push(tx);
                }
            }
        }
        this.rendertxt(this.text_, this.font_size, this.color, 0);
    };

    c.TextBox.prototype.setStatePass = function() {
        this.state_ = this.state.Pass;
    };
    c.TextBox.prototype.isPass = function() {
        var mousepos = g.app.renderer.plugins.interaction.mouse.global;
        if (this.text_) {
            if (this.state_ == this.state.Press) {
                return false;
            }
            if (this.state_ == this.state.Pass) {
                return true;
            }
            else if (this.inSide(mousepos.x, mousepos.y)) {
                this.state_ = this.state.Pass;
                return true;
            }
        }
        return false;
    };
    c.TextBox.prototype.mouseDown = function(e, mousepos) {
        this.onpress = true;
        if (this.inSide(mousepos.x, mousepos.y)) {
            this.state_ = this.state.Press;
        }
    };
    c.TextBox.prototype.dealEvent = function(e) {
    };
    c.TextBox.prototype.mouseClick = function(e, mousepos) {
        this.onpress = false;

    };
    c.TextBox.prototype.keyUp = function(e, mousepos) {
    };
    c.TextBox.prototype.keyDown = function(e, mousepos) {

    };

    c.TextBox.prototype.mouseMove = function() {
        var mousepos = g.app.renderer.plugins.interaction.mouse.global;
        var hit = this.inSide(mousepos.x, mousepos.y);
        if (!this.onpress && !hit) {
            this.state_ = this.state.Normal;
        }
        else if (!this.onpress && hit) {
            this.state_ = this.state.Pass;
        }
        else if (this.onpress && hit) {
            this.state_ = this.state.Press;
        }
        else {
            this.state_ = this.state.Normal;
        }
    };

    c.TextBox.prototype.drawtxt = function() {
        this.tex_index = 0;
        if (this.have_box && this.spbg) {
            this.spbg.x = this.text_x - 10;
            this.spbg.y = this.text_y - 3;
            this.bgResize();
            this.j.tm.render2(126, 'title', this.text_x - 10,  this.text_y - 3, this.spbg);
        }
        this.rendertxt(this.text_, this.font_size, this.color, 0);
    };
    c.TextBox.prototype.draw = function() {
        if (this.text_) {
            //this.color = this.color_normal;
            this.drawtxt();
        }
    };
    c.TextBox.prototype.setTextPosition = function(x, y) {
        this.text_x = x;
        this.text_y = y;
    };
    c.TextBox.prototype.inSide = function(x, y) {
        var spos = this.getGlobalPosition();
        return x > spos.x && x < spos.x + this.width && y > spos.y && y < spos.y + this.height;
    };


    c.Button = function (j, is_menu_item, path, normal_id, pass_id, press_id) {
        c.TextBox.call(this, j);
        this.sp = new PIXI.Sprite();
        this.addChild(this.sp);
        if (is_menu_item) {
            this.is_menu_item = is_menu_item;
        }

        Object.assign(this, {
            texture_normal_id : normal_id,
            texture_pass_id : pass_id,
            texture_press_id : press_id,
            res_type : path
        });
        if (this.texture_normal_id) {
            this.j.tm.renderbtn(this.texture_normal_id, this.res_type, this.x, this.y, this.sp);
        }

    };

    c.Button.prototype = Object.create(c.TextBox.prototype);
    c.Button.prototype.constructor = c.Button;
    c.Button.prototype.setTexture = function(num, res_type) {
        this.texture_normal_id = num;
        this.res_type = res_type;
        this.j.tm.renderbtn(this.texture_normal_id, res_type, this.sp.x, this.sp.y, this.sp);
    };

    c.Button.prototype.draw = function() {
        if (this.text_) {
            if (this.state_ == this.state.Normal) {
                this.color = this.color_normal;
            }
            else if (this.state_ == this.state.Pass) {
                this.color = this.color_pass;
            }
            else if (this.state_ == this.state.Press) {
                this.color = this.color_press;
            }
        }
        c.TextBox.prototype.drawtxt.call(this);
        this.sp.tint = g.utils.rgbToHex(255, 255, 255);
        this.sp.alpha = 255 / 255;

        if (this.state_ == this.state.Normal) {
            this.sp.tint = g.utils.rgbToHex(128, 128, 128);
            if (this.texture_normal_id) {
                this.j.tm.renderbtn(this.texture_normal_id, this.res_type, this.sp.x, this.sp.y, this.sp);
            }
        }
        if (this.state_ == this.state.Pass) {
            this.sp.alpha = 240 / 255;
            if (this.texture_pass_id) {
                this.j.tm.renderbtn(this.texture_pass_id, this.res_type, this.sp.x, this.sp.y, this.sp);
            }
        }
        else if (this.state_ == this.state.Press) {
            this.sp.alpha = 255 / 255;
            if (this.texture_pass_id) {
                this.j.tm.renderbtn(this.texture_press_id, this.res_type, this.sp.x, this.sp.y, this.sp);
            }
        }
    };
    c.Button.prototype.mouseMove = function(e, mousepos) {
        if (!this.is_menu_item) {
            c.TextBox.prototype.mouseMove.call(this, e, mousepos);
        }
    };

    c.Button.prototype.mouseDown = function(e, mousepos) {
        if (!this.is_menu_item) {
            this.onpress = true;
            var hit = this.inSide(mousepos.x, mousepos.y);
            if (this.onpress && hit) {
                this.state_ = this.state.Press;
            }
        }
    };
    c.Button.prototype.mouseClick = function(e, mousepos) {
        if (!this.is_menu_item) {
            this.onpress = false;
        }
    };
    c.Button.prototype.keyDown = function(e, mousepos) {
        if (!this.is_menu_item) {

        }
    };

    c.MapSquare = function () {
        Object.assign(this, {
            line : 0,
        });
    };

    c.MapSquare.constructor = c.MapSquare;

    c.Menu = function (j) {
        c.TextBox.call(this, j);
        Object.assign(this, {
            selected : null,
            onpress : false,
            result : -1,
            menu_items : [],
            skip_draw : 0
        });
    };
    c.Menu.prototype = Object.create(c.TextBox.prototype);
    c.Menu.prototype.constructor = c.Menu;
    c.Menu.prototype.addItem = function(res_type, normal_id, pass_id, press_id, x, y) {
        var b = new c.Button(this.j, true, res_type, normal_id, pass_id, press_id);
        b.position.set(x, y);
        this.addCustom(b);
        this.menu_items.push(b);

    };
    c.Menu.prototype.draw = function() {
        if (this.skip_draw) {
            return;
        }
        if (!this.selected) {
            for (var i = 0; i < this.menu_items.length; i++) {
                this.menu_items[i].state_ = this.state.Pass;
                this.selected = this.menu_items[i];
                break;
            }
        }
        for(var i = 0; i < this.menu_items.length; i++) {
            this.menu_items[i].state_ = this.state.Normal;
        }
        if (this.selected) {
            if (this.onpress) {
                this.selected.state_ = this.state.Press;
            }
            else {
                this.selected.state_ = this.state.Pass;
            }
        }
        c.TextBox.prototype.draw.call(this);
    };
    c.Menu.prototype.mouseMove = function(e, mousepos) {
        for(var i = 0; i < this.menu_items.length; i++) {
            if (this.menu_items[i].visible && this.menu_items[i].inSide(mousepos.x, mousepos.y)) {
                this.selected = this.menu_items[i];
            }
        }
    };
    c.Menu.prototype.clear = function() {
        // for (var i = 0; i < this.menu_items.length; i++) {
        // var k = this.j.target.indexOf(this.menu_items[i]);
        // if (k > -1) {
        // this.j.target.splice(k, 1);
        // }
        // }
        // var i = this.j.target.indexOf(this);
        // if (i > -1) {
        // this.j.target.splice(i, 1);
        // }
        this.selected = null;
    };
    c.Menu.prototype.getSelected = function() {
        return this.menu_items.indexOf(this.selected);
    };

    c.Menu.prototype.mouseDown = function(e, mousepos) {
        for(var i = 0; i < this.menu_items.length; i++) {
            if (this.menu_items[i].visible && this.menu_items[i].inSide(mousepos.x, mousepos.y)) {
                this.onpress = true;
                this.selected = this.menu_items[i];
            }
        }
    }
    c.Menu.prototype.mouseClick = function(e, mousepos) {
        if (this.selected && this.onpress) {
            this.getResult();
        }
        this.onpress = false;
    };
    c.Menu.prototype.keyUp = function(e) {
        if (this.selected && this.onpress) {
            this.getResult();
        }
        this.onpress = false;

    };
    c.Menu.prototype.keyDown = function(e) {
        if (e.keyCode == g.keyconfig.SPACE || e.keyCode == g.keyconfig.RET) {
            this.onpress = true;
        }
        var i = this.menu_items.indexOf(this.selected);
        if (e.keyCode == g.keyconfig.UP || e.keyCode == g.keyconfig.LEFT) {
            var k = 0;
            var c = 1;
            while (true) {
                if (i - c < 0) {
                    k = 0;
                    break;
                }
                if (this.menu_items[i - c].visible) {
                    k = i - c;
                    break;
                }
                c++;
            }
            this.selected =this.menu_items[k];
        }
        if (e.keyCode == g.keyconfig.DOWN || e.keyCode == g.keyconfig.RIGHT) {
            var k = 0;
            var c = 1;
            while (true) {
                if (i + c >= this.menu_items.length) {
                    k = 0;
                    break;
                }
                if (this.menu_items[i + c].visible) {
                    k = i + c;
                    break;
                }
                c++;
            }
            this.selected = this.menu_items[k];
        }
        if (this.selected) {
            if (this.onpress) {
                this.selected.state_ = this.state.Press;
            }
            else {
                this.selected.state_ = this.state.Pass;
            }
        }
    };


    c.Menu.prototype.arrange = function(x, y, inc_x, inc_y, next_x, inc_next_y) {
        var oldx = x;
        for (var i = 0; i < this.menu_items.length; i++) {
            if (this.menu_items[i].visible) {
                this.menu_items[i].x = x;
                this.menu_items[i].y = y;
                x += inc_x;
                y += inc_y;
                if (next_x && ((i + 1) % next_x == 0)) {
                    x = oldx;
                    y += inc_next_y;
                }
            }
        }
    };
    c.Menu.prototype.setFontSize = function(fontsize) {
        for(var i = 0; i < this.menu_items.length; i++) {
            this.menu_items[i].setFontSize(fontsize);
        }
        c.TextBox.prototype.setFontSize.call(this, fontsize);
    };
    c.Menu.prototype.getResult = function() {
        this.result = this.menu_items.indexOf(this.selected);
        if (this.j.gevent.event_running) {
            var i = this.menu_items.indexOf(this.selected);
            //this.j.gevent.event_result(i == this.j.gevent.expected_result);
            //g.pause(1000);
            this.clear();
            this.visible = 0;

        }
        else {
            if (this.onpress) {
                return this.menu_items.indexOf(this.selected);
            }
        }
        return -1;

    };


    c.MenuText = function (j, strings, x, y) {
        c.Menu.call(this, j);
        this.x = x;
        this.y = y;
        this.setStrings(strings);

        // this.w = 10 * len;
        // this.h = 25 * strings.length;
    };


    c.MenuText.prototype = Object.create(c.Menu.prototype);
    c.MenuText.prototype.constructor = c.MenuText;

    c.MenuText.prototype.setStrings = function(strings) {
        this.custom_items = [];
        for (var i = 0; i < this.menu_items.length; i++) {
            this.removeChild(this.menu_items[i]);
        }
        this.menu_items = [];
        this.strings = strings;
        this.childs_text = {};
        var i = 0;
        var len = 0;
        for (var m = 0; m < strings.length; m++) {
            if (strings[m].length > len) { len = strings[m].length; }
            var b = new c.Button(this.j, true);
            b.setText(strings[m]);
            b.visible = true;
            this.addCustom(b);
            this.menu_items.push(b);
            this.childs_text[strings[m]] = b;
            b.x = 0;
            b.y = i * 25;
            i++;
        }

    };
    c.MenuText.prototype.getResultString = function() {
        return this.strings[this.result];
    }
    c.MenuText.prototype.getResultFromString = function(str) {
        for (var m = 0; m < this.strings.length; m++) {
            if (this.strings[m] == str) {
                return m;
            }
        };
        return -1;
    };

    c.gameUtil = function(j) {
        this.j = j;
        Object.assign(this, {

        });
    }
    c.gameUtil.prototype.constructor = c.gameUtil;

    c.gameUtil.prototype.equip = function(r, i) {
        if (!r || !i) {
            return;
        }
        var r0 = this.j.save.getRole(i.data.User);
        var book = this.j.save.getItem(i.data.PracticeItem);
        var equip0 = this.j.save.getItem(i.data.Equip0);
        var equip1 = this.j.save.getItem(i.data.Equip1);
        i.data.User = r.data.ID;
        if (i.data.ItemType == 2) {
            if (book) {
                book.data.User = -1;
            }
            r.data.PracticeItem = i.data.ID;
            if (r0) {
                r0.data.PraticeItem = -1;
            }
        }

        if (i.data.ItemType == 1) {
            if (i.data.EquipType == 0) {
                if (equip0) {
                    equip0.data.User = -1;
                }
                r.data.Equip0 = i.data.ID;
                if (r0) {
                    r0.data.Equip0 = -1;
                }
            }
            if (i.data.ItemType == 1) {
                if (i.data.EquipType == 0) {
                    if (equip0) {
                        equip0.data.User = 0;
                    }
                    r.data.Equip0 = i.data.ID;
                    if (r0) {
                        r0.data.Equip0 = -1;
                    }
                }
                if (i.data.EquipType == 1) {
                    if (equip1) {
                        equip1.data.User = -1;
                    }
                    r.data.Equip1 = i.data.ID;
                    if (r0) {
                        r0.data.Equip1 = -1;
                    }
                }
            }
        }
    };
    c.gameUtil.prototype.useItem = function(r, i) {
        if (!r) {
            return;
        }
        if (!i) {
            return;
        }
        r.data.PhysicalPower += i.data.AddPhysicalPower;
        r.data.HP += i.data.AddHP;
        r.data.MaxHP += i.data.AddMaxHP;
        r.data.MP += i.data.AddMP;
        r.data.MaxMP += i.data.AddMaxMP;

        r.data.Poison += i.data.AddPoison;

        r.data.Medcine += i.data.AddMedcine;
        r.data.Detoxification += i.data.AddDetoxification;
        r.data.UsePoison += i.data.AddUsePoison;

        r.data.Attack += i.data.AddAttack;
        r.data.Defence += i.data.AddDefence;
        r.data.Speed += i.data.AddSpeed;

        r.data.Fist += i.data.AddFist;

        r.data.Sword += i.data.AddSword;

        r.data.Knife += i.data.AddKnife;
        r.data.Unusual += i.data.AddUnusual;
        r.data.HiddenWeapon += i.data.AddHiddenWeapon;

        r.data.Knowledge += i.data.AddKnowledge;
        r.data.Morality += i.data.AddMorality;
        r.data.AntiPoison += i.data.AddAntiPoison;
        r.data.AttackWithPoison += i.data.AddAttackWithPoison;

        if (i.data.ChangeMPType == 2) {
            r.data.MPType = 2;
        }
        if (i.data.AddAttackTwice) {
            r.data.AttackTwice = 1;
        }

        var need_item_exp = this.getFinishedExpForItem(r, i);


        if (r.data.ExpForItem >= need_item_exp) {
            r.learnMagic(i.data.MagicID);
            r.data.ExpForItem -= need_item_exp;
        }


        r.limit();
    };
    c.gameUtil.prototype.canUseItem = function(r, i) {
        if (!r) {
            return false;
        }
        if (!i) {
            return false;
        }
        if (i.data.ItemType == 0) {
            return false;
        }
        else if (i.data.ItemType == 1 || i.data.ItemType == 2) {
            if (i.data.ItemType == 2) {
                if ((r.data.MPType == 0 || r.data.MPType ==1) && i.data.NeepMPType == 0 || i.data.NeedMPType == 1) {
                    if (r.data.MPType != i.data.NeedMPType) {
                        return false;
                    }
                }
                if (i.data.OnlySuitableRole >= 0) {
                    return i.data.OnlySuitableRole == r.data.ID;
                }
            }
            if (i.data.MagicID > 0) {
                var level = r.getMagicLevelIndex(i.data.MagicID);
                if (level >= 0 && level < this.j.type.max_magic_level_index) {
                    return true;
                }
                if (level < 0 && r.getLearnedMagicCount() == this.j.type.role_magic_count) {
                    return false;
                }
            }
            var test = function(v, v_need) {
                if (v_need > 0 && v < v_need) {
                    return false;
                }
                if (v_need < 0 && v > -v_need) {
                    return false;
                }
                return true;
            };
            return test(r.data.Attack, i.data.NeedAttack) && test(r.data.Speed, i.data.NeedSpeed) &&
                test(r.data.Medcine, i.data.NeedMedcine) &&
                test(r.data.UsePosion, i.data.NeedUsePoison) &&
                test(r.data.Detoxification, i.data.NeedDetoxification) &&
                test(r.data.Fist, i.data.NeedFist) &&
                test(r.data.Sword, i.data.NeedSword) &&
                test(r.data.Knife, i.data.NeedKnife) &&
                test(r.data.Unusual, i.data.NeedUnusual) &&
                test(r.data.HiddenWeapon, i.data.NeedHiddenWeapon) &&
                test(r.data.MP, i.data.NeedMP)
            test(r.data.IQ, i.data.NeedIQ);
        }
        else if (i.data.ItemType == 3) {
            return true;
        }
        else if (i.data.ItemType == 4) {
            return false;
        }
        return false;

    };
    c.gameUtil.prototype.medcine = function(r1, r2) {
        if (!r1 || !r2) {
            return 0;
        }
        var temp = r2.data.HP;
        r2.data.HP += r1.data.Medcine;
        r2.data.HP = this.j.gameutil.limit (r2.data.HP, 0, r2.data.MaxHP);
        return parseInt(r2.data.HP - temp);
    }
    c.gameUtil.prototype.detoxification = function(r1, r2) {
        if (!r1 || !r2) {
            return 0;
        }
        var temp = r2.data.Poison;
        r2.data.Poison -= parseInt(r1.data.Detoxification / 3);
        r2.data.Poison = this.j.gameutil.limit (r2.data.Poison, 0, this.j.op.MaxPoison);
        return parseInt(r2.data.Poison - temp);
    }
    c.gameUtil.prototype.usePoison = function(r1, r2) {
        if (!r1 || !r2) {
            return 0;
        }
        var temp = r2.data.Poison;
        r2.data.Poison += r1.data.UsePoison / 3;
        r2.data.Poison = this.j.gameutil.limit (r2.data.Poison, 0, this.j.op.MaxPoison);
        return parseInt(r2.data.Poison - temp);
    };
    c.gameUtil.prototype.limit = function(current, min_value, max_value) {
        if (current < min_value) {
            current = min_value;
        }
        if (current > max_value) {
            current = max_value;
        }
        return current;
    };
    c.gameUtil.prototype.digit = function(x) {
        var n = Math.floor(Math.log10(0.5 + Math.abs(x)));
        if (x >= 0) {
            return n;
        }
        else {
            return n + 1;
        }

    };
    c.gameUtil.prototype.sign = function(v) {
        if (v > 0) {
            return 1;
        }
        if (v < 0) {
            return -1;
        }
        return 0;
    };
    c.gameUtil.prototype.canFinishedItem = function(r) {
        var item = this.j.save.getItem(r.data.PracticeItem);
        if (r.data.ExpForItem >= this.getFinishedExpForItem(r, item)) {
            return true;
        }
        return false;
    };
    c.gameUtil.prototype.levelUp = function(r) {
        if (!r) {
            return;
        }
        r.data.Exp -= this.level_up_list[r.data.Level - 1];
        r.data.Level++;
        r.data.PhysicalPower = this.j.op.MaxPhysicalPower;
        r.data.MaxHP += r.data.IncLife * 3 + g.utils.rand(6);
        r.data.HP = r.data.MaxHP;
        r.data.MaxMP += 20 + g.utils.rand(6);
        r.data.MP = r.data.MaxMP;
        r.data.Hurt = 0;
        r.data.Poison = 0;
        r.data.Attack += g.utils.rand(7);
        r.data.Speed += g.utils.rand(7);
        r.data.Defence += g.utils.rand(7);
        var check_up = function(value, limit, max_inc) {
            if (value > limit) {
                value += 1 + g.utils.rand(max_inc);
            }
            return value;
        };
        r.data.Medcine = check_up(r.data.Medcine, 0, 3);
        r.data.Detoxification = check_up(r.data.Detoxification, 0, 3);
        r.data.UsePoison = check_up(r.data.UsePoison, 0, 3);
        r.data.Fist = check_up(r.data.Fist, 10, 3);
        r.data.Sword = check_up(r.data.Sword, 10, 3);
        r.data.Knife = check_up(r.data.Knife, 10, 3);
        r.data.Unusual = check_up(r.data.Unusual, 10, 3);
        r.data.HiddenWeapon = check_up(r.data.HiddenWeapon, 10, 3);

        r.limit();

    };
    c.gameUtil.prototype.getLevelUpExp = function(level) {
        var str = '50, 100, 150, 200, 250, 300, 350, 400, 450, 500, 1100, 1200, 1300, 1400, 1500, 1600, 1700, 1800, 2400, 1500, 3150, 3300, 3450, 3650, 3700, 3900, 4050, 4200, 4350, 4500, 4600, 4800, 5000, 5100, 5200, 5300, 5500, 5600, 5800, 6000, 6200, 6400, 6600, 6800, 7000, 7200, 7400, 7600, 7800, 8000, 8200, 8400, 8600, 8800, 9200, 9600, 10000, 20000, 30000';
        if (level <= 0 || level >= this.j.op.MaxLevel) {
            return 999999999;
        }
        this.level_up_list = str.split(', ');
        return this.level_up_list[level - 1];

    };
    c.gameUtil.prototype.canLevelUp = function(r) {
        if (r.data.Level >= 1 && r.data.Level <= this.j.op.MaxLevel) {
            if (r.data.Exp >= this.getLevelUpExp (r.data.Level)) {
                return true;
            }
        }
        return false;
    };

    c.gameUtil.prototype.getFinishedExpForItem = function(r, i) {
        if (i == null || i.data.NeedExp <= 0) {
            return Number.MAX_SAFE_INTEGER;
        }
        var multiple = 7 - r.data.IQ / 15;
        if (multiple <= 0) {
            multiple = 1;
        }
        if (i.data.MagicID > 0) {
            var magic_level_index = r.getMagicLevelIndex(i.data.MagicID);
            if (magic_level_index == this.j.type.max_magic_level_index) {
                return Number.MAX_SAFE_INTEGER;
            }
            if (magic_level_index > 0) {
                multiple *= magic_level_index;
            }
        }

        return parseInt(i.data.NeedExp * multiple);
    };


})(PIXI, g, c, window);
