(function (PIXI, g, c, window) {
    'use strict';


    c.Head = function(j, role) {
        c.TextBox.call(this, j);
        this.j = j;
        this.setTextPosition(20, 65);
        this.setFontSize(20);
        this.normal_color = 0xFFFFFF;
        this.have_box = false;
        Object.assign(this, {
            role : role,
            only_head : 0,
            width : 250,
            height : 90,
            gp_index : 0,
            sp_index : 0,
            sp : [],
            gp : [],
            txt_max : 50,
            result : -1,
            color_white : g.utils.rgbToHex(255, 255, 255)
        });
        for (var i = 0; i < 20; i++ ) {
            var gp = new PIXI.Graphics();
            this.addChild(gp);
            this.gp.push(gp);
        }
        for (var i = 0; i < 20; i++ ) {
            var sp = new PIXI.Sprite();
            this.addChild(sp);
            this.sp.push(sp);
        }
        for (var i = 0; i < this.txt_max; i++ ) {
            var tx = new PIXI.Text();
            this.addChild(tx);
            this.txt.push(tx);
        }
    };
    c.Head.prototype = Object.create(c.TextBox.prototype);
    c.Head.prototype.constructor = c.Head;
    c.Head.prototype.getRole = function() {
        return this.roleobj;
    };
    c.Head.prototype.rendertxt = function(txt, fontsize, x, y, color, padding) {
        this.j.tm.rendertxt(txt, fontsize, x, y, color, padding, this);
    };
    c.Head.prototype.setRole = function (r) {
        if (r) {
            this.roleobj = r;
            this.role = r.data;

        }
        else {
            this.roleobj = null;
            this.role = null;
        }
    };
    c.Head.prototype.draw = function () {
        for (var i = 0; i < this.gp.length; i++) {
            this.gp[i].graphicsData = [];
            this.gp[i].visible = false;
        }
        for (var i = 0; i < this.txt_max; i++ ) {
            this.txt[i].visible = false;
        }
        for (var i = 0; i < this.sp.length; i++ ) {
            this.sp[i].visible = false;
        }
        if (!this.role) {
            return;
        }
        for (var i = 0; i < this.gp.length; i++) {
            this.gp[i].visible = true;
        }
        this.sp_index = 0;
        this.gp_index = 0;
        this.tex_index = 0;

        if (this.text_) {
            this.color = this.color_normal;

            if (this.have_box) {
                this.spbg.x = this.text_x - 10;
                this.spbg.y = this.text_y - 3;
            }
            this.rendertxt(this.text_, this.font_size, this.text_x, this.text_y, this.color, 0);
        }




        var color = [255, 255, 255];

        if (!this.only_head) {
            this.j.tm.render2(102, "title", 0, 0, this.sp[this.sp_index++]);
        }
        if (this.state_ == this.state.Normal) {
            color = [128, 128, 128];
        }
        color[0] = parseInt(color[0] - 2 * this.role.Poison);
        color[1] = parseInt(color[1] - 2 * this.role.Poison);
        color = g.utils.rgbToHex(color[0], color[1], color[2]);
        var zoomx = 0.5;
        var zoomy = 0.5;
        var alpha = 1;
        this.j.tm.render2(this.role.HeadID, "head", 10, 0, this.sp[this.sp_index++], color, alpha, zoomx, zoomy);
        if (this.only_head) {
            return;
        }

        this.rendertxt(this.role.Name, 16, 117, 9, this.color_white, -1);

        this.rendertxt(this.role.Level, 16, 99 - 4 * this.j.gameutil.digit(this.role.Level), 5, g.utils.rgbToHex(250, 200, 50));
        this.gp[this.gp_index].beginFill(g.utils.rgbToHex(196, 25, 16), 192 / 255);
        if (this.role.MaxHP > 0) {
            this.gp[this.gp_index++].drawRect(96, 32, 138 * this.role.HP / this.role.MaxHP , 9);
        }
        else {
            this.gp[this.gp_index++].drawRect(0, 0, 0, 0);
        }
        this.rendertxt(g.utils.lpad(parseInt(this.role.HP), 3) + '/' + g.utils.lpad(this.role.MaxHP, 3), 16, 138, 27, g.utils.rgbToHex(250, 200, 50));

        if (this.role.MaxMP > 0) {
            this.gp[this.gp_index].drawRect(96, 48, 138 * this.role.MP / this.role.MaxMP, 9);
        }
        else {
            this.gp[this.gp_index].drawRect(0, 0, 0, 0);
        }
        var color = [200, 200, 200];
        var ctext = [255, 255, 255];
        if (this.role.MPType == 0) {
            color = [112, 12, 112];
            ctext = [240, 150, 240];
        }
        else if (this.role.MPType == 1) {
            color = [224, 180, 32];
            ctext = [250, 200, 50];
        }
        this.gp[this.gp_index++].beginFill(g.utils.rgbToHex(color[0], color[1], color[2]), 192 / 255);
        this.rendertxt(g.utils.lpad(parseInt(this.role.MP), 3) + '/' + g.utils.lpad(this.role.MaxMP, 3), 16, 138, 43, g.utils.rgbToHex(ctext[0], ctext[1], ctext[2]));

        this.gp[this.gp_index].drawRect(115, 65, 83 * this.role.PhysicalPower / 100, 9);
        this.gp[this.gp_index++].beginFill(g.utils.rgbToHex(128, 128, 255), 192 / 255);

        this.rendertxt(parseInt(this.role.PhysicalPower), 16, 154 - 4 * this.j.gameutil.digit(this.role.PhysicalPower), 60, g.utils.rgbToHex(250, 200, 50));

    };

    c.UI = function(j) {
        this.j = j;
        PIXI.Container.call(this);
        Object.assign(this, {
            teammate_count : 6,
            current_head : 0,
            current_button : 0,
            buttons : [],
            heads : []
        });
        this.bg = new PIXI.Graphics();
        this.bg.beginFill(0x000000, 0.3);
        this.bg.drawRect(0, 0, g.app.view.width, g.app.view.height);
        this.addChild(this.bg);


        this.ui_status = new c.UIStatus(j, true);
        this.ui_item = new c.UIItem(j);
        this.ui_system = new c.UISystem(j);
        this.ui_item.visible = false;
        this.ui_status.x = 300;
        this.ui_item.x = 300;
        this.ui_system.x = 300;

        this.addCustom(this.ui_status);
        this.addCustom(this.ui_item);
        this.addCustom(this.ui_system);

        this.button_status = new c.Button(j, false, 'title', 122);
        this.button_status.position.set (10, 10);
        this.button_item = new c.Button(j, false, 'title', 124);
        this.button_item.position.set (90, 10);
        this.button_system = new c.Button(j, false, 'title', 125);
        this.button_system.position.set (170, 10);
        this.addCustom(this.button_status);
        this.addCustom(this.button_item);
        this.addCustom(this.button_system);
        this.buttons.push(this.button_status);
        this.buttons.push(this.button_item);
        this.buttons.push(this.button_system);

        for (var i = 0; i < this.teammate_count; i++) {
            var h = new c.Head(j);
            h.position.set(20, 60 + i * 90);
            this.addCustom(h);
            this.heads.push(h);
        }
        this.heads[0].setStatePass();

    };

    c.UI.constructor = c.UI;
    c.UI.prototype = Object.create(PIXI.Container.prototype);
    c.UI.prototype.onPressedCancel = function(e) {
        if (!this.ui_system.queue.length) {
            this.visible = false;
        }
    };
    c.UI.prototype.onPressedOK = function(e) {
        if (this.button_status.state_ == this.button_status.state.Press) {
            this.ui_item.visible = 0;
            this.ui_system.visible = 0;
            this.ui_status.visible = 1;
            this.current_button = 0;
        }
        if (this.button_item.state_ == this.button_item.state.Press) {
            this.ui_status.visible = 0;
            this.ui_item.visible = 1;
            this.ui_system.visible = 0;
            this.current_button = 1;
        }
        if (this.button_system.state_ == this.button_system.state.Press) {
            this.ui_status.visible = 0;
            this.ui_item.visible = 0;
            this.ui_system.visible = 1;
            this.current_button = 2;
        }

    };


    c.UI.prototype.draw = function() {

        this.bg.width = g.app.view.width;
        this.bg.height = g.app.view.height;
    };
    c.UI.prototype.clear = function() {
        for (var i = 0; i < this.teammate_count; i++) {
            this.heads[i].state_ = this.heads[i].state.Normal;
        }

        this.current_head = 0;
        this.ui_status.setRole(null);
    };
    c.UI.prototype.beforeDraw = function() {
        for (var i = 0; i < this.teammate_count; i++) {
            var head = this.heads[i];
            var role = this.j.save.getTeamMate(i);
            head.setRole(role);
            if (!role) {
                continue;
            }
            if (head.state_  == head.state.Pass) {
                this.ui_status.setRole(role);
                this.current_head = i;
            }
            head.setText('');
            if (this.current_button == 1) {
                var item = this.ui_item.current_item;
                if (item) {
                    if (role.data.Equip0 == item.data.ID || role.data.Equip1 == item.data.ID || role.PracticeItem == item.data.ID) {
                        head.setText("使用中");
                    }
                }
                if (this.j.gameutil.canUseItem(role, item)) {
                    head.state_ = head.state.Pass;
                }
            }
        }
        if (this.current_button == 0) {
            this.heads[this.current_head].setStatePass();
        }
        this.buttons[this.current_button].setStatePass();
    };

    c.UIStatus = function(j, show_button) {
        PIXI.Container.call(this);
        this.j = j;
        Object.assign(this, {
            tex_index : 0,
            txt_max : 700,
            role : {},
            show_button : show_button,
            txt : [],
            sp : [],
            color_white : g.utils.rgbToHex(255, 255, 255),
            color_name : g.utils.rgbToHex(255, 215, 0),
            color_ability1 : g.utils.rgbToHex(255, 215, 205),
            color_ability2 : g.utils.rgbToHex(236, 200, 40),
            color_red : g.utils.rgbToHex(255, 90, 60),
            color_magic : g.utils.rgbToHex(236, 200, 40),
            color_magic_level1 : g.utils.rgbToHex(253, 101, 101),
            color_purple : g.utils.rgbToHex(208, 152, 208),
            color_magic_empty : g.utils.rgbToHex(236, 200, 40),
            color_equip : g.utils.rgbToHex(165, 28, 218),
            queue : [],
            team_menu : {},
            skip_event : false,
        });



        for (var i = 0; i < this.txt_max; i++ ) {
            var tx = new PIXI.Text();
            this.addChild(tx);
            this.txt.push(tx);
        }
        for (var i = 0; i < 10; i++ ) {
            var sp = new PIXI.Sprite();
            this.addChild(sp);
            this.sp.push(sp);
        }
        this.button_medicine = new c.Button(j);
        this.button_medicine.setText('醫療');
        this.button_medicine.x = 350;
        this.button_medicine.y = 55;

        this.button_detoxification = new c.Button(j);
        this.button_detoxification.setText('解毒');
        this.button_detoxification.x = 400;
        this.button_detoxification.y = 55;

        this.button_leave = new c.Button(j);
        this.button_leave.setText('離隊');
        this.button_leave.x = 450;
        this.button_leave.y = 55;


        this.addCustom(this.button_medicine);
        this.addCustom(this.button_detoxification);
        this.addCustom(this.button_leave);
    };
    c.UIStatus.constructor = c.UIStatus;
    c.UIStatus.prototype = Object.create(PIXI.Container.prototype);
    c.UIStatus.prototype.setRole = function(r) {
        this.role = r;
    };

    c.UIStatus.prototype.rendertxt = function(txt, fontsize, x, y, color, padding) {
        this.j.tm.rendertxt(txt, fontsize, x, y, color, padding, this);
        this.txt_index++;
    };




    c.UIStatus.prototype.onPressedOK = function() {
        if (!this.role) {
            return;
        }
        if (this.button_leave.state_ == this.button_leave.state.Press) {
            this.j.gevent.callLeaveEvent(this.role);
        }
        else if (this.button_medicine.state_ == this.button_medicine.state.Press) {
            this.team_menu = new c.TeamMenu(this.j);
            this.team_menu.setText(sprintf("%s要為誰醫療", this.role.data.Name));
            this.j.viewui.addCustom(this.team_menu);


            var f = function() {
                var r = this.team_menu.getRole();
                if (r) {
                    var r_temp = Object.assign( Object.create( Object.getPrototypeOf(r)), r);
                    r_temp.data = Object.assign( Object.create( Object.getPrototypeOf(r.data)), r.data);
                    this.j.gameutil.medcine(this.role, r);
                    this.df = new c.ShowRoleDifference(this.j);
                    this.df.setTwinRole(r_temp, r);
                    var txt = sprintf("%s接受%s醫療", g.utils.strim(r.data.Name), g.utils.strim(this.role.data.Name));

                    this.df.setText(txt);
                    this.j.viewui.addCustom(this.df);
                }
            };
            this.queue.push({'target' : this.team_menu, 'func' : function() {}, 'init' : 0, 'result' : f.bind(this)});
        }
        else if (this.button_detoxification.state_ == this.button_detoxification.state.Press) {
            this.team_menu = new c.TeamMenu(this.j);
            this.team_menu.setText(sprintf("%s要為誰解毒", this.role.data.Name));
            this.j.viewui.addCustom(this.team_menu);

            var f = function() {
                var r = this.team_menu.getRole();
                if (r) {
                    var r_temp = Object.assign( Object.create( Object.getPrototypeOf(r)), r);
                    r_temp.data = Object.assign( Object.create( Object.getPrototypeOf(r.data)), r.data);
                    this.j.gameutil.detoxification(this.role, r);
                    this.df = new c.ShowRoleDifference(this.j);
                    this.df.setTwinRole(r_temp, r);
                    var txt = sprintf("%s接受%s解毒	", g.utils.strim(r.data.Name), g.utils.strim(this.role.data.Name));

                    this.df.setText(txt);
                    this.j.viewui.addCustom(this.df);
                }
            };
            this.queue.push({'target' : this.team_menu, 'func' : function() {}, 'init' : 0, 'result' : f.bind(this)});

        };
    };
    c.UIStatus.prototype.select_color1 = function(v, max_v) {
        if (v >= max_v * 0.9) {
            return this.color_red;
        }
        else if (v >= max_v * 0.8) {
            return g.utils.rgbToHex(255, 165, 79, 255);
        }
        else  if (v >= max_v * 0.7) {
            return g.utils.rgbToHex(255, 255, 50, 255);
        }
        else if (v < 0) {
            return this.color_purple;
        }
        return this.color_white;
    };


    c.UIStatus.prototype.select_color2 = function(v) {
        if (v > 0) {
            return this.color_red;
        }
        if (v < 0) {
            return this.color_purple;
        }
        return this.color_white;
    };

    c.UIStatus.prototype.draw = function() {
        this.tex_index = 0;
        this.sp_index = 0;
        for (var i = 0; i < this.txt_max; i++ ) {
            this.txt[i].visible = false;
        }
        for (var i = 0; i < 10; i++ ) {
            this.sp[i].visible = false;
        }
        if (!this.role || !this.show_button) {
            this.button_medicine.visible = false;
            this.button_detoxification.visible = false;
            this.button_leave.visible = false;
        }
        if (this.queue.length) {
            this.j.ui.skip_event = true;
            var q = this.queue[0];
            if (!q.init) {
                q.init = 1;
                q.target.visible = 1;
                q.func();
            }
            else {
                q.func();
                if (!q.target.visible) {
                    q.result();
                    this.queue.splice(0, 1);
                    this.removeCustom(q.target);
                }

            }
            return;
        };
        this.j.ui.skip_event = false;

        var role = null;
        if (this.role) {
            role = this.role.data;
        }

        if (role) {
            if (this.show_button) {
                this.button_medicine.visible = role.Medcine > 0;
                this.button_detoxification.visible = role.Detoxification > 0;
                this.button_leave.visible = role.ID != 0;
            }
        }
        else {
            return;
        }

        this.j.tm.render2(role.HeadID, "head", this.x + 10 - 300, this.y + 20, this.sp[this.sp_index++]);

        var font_size = 22;

        var x, y;
        x = this.x + 200 - 300;
        y = this.y + 50;



        this.rendertxt(role.Name, 30, x - 10, y, this.color_name, -1);
        this.rendertxt("等級", font_size, x, y + 50, this.color_ability1);
        this.rendertxt(role.Level, font_size, x + 66, y + 50, this.color_white, 5);
        this.rendertxt("經驗", font_size, x, y + 75, this.color_ability1);
        this.rendertxt(role.Exp, font_size, x + 66, y + 75, this.color_white, 5);
        this.rendertxt("升級", font_size, x, y + 100, this.color_ability1);

        var exp_up = (0) ? '------' : 1;
        this.rendertxt(exp_up, font_size, x + 55, y + 100, this.color_white, 6);
        this.rendertxt("生命", font_size, x + 175, y + 50, this.color_ability1);
        this.rendertxt(g.utils.lpad(role.HP, 5) + "/", font_size, x + 219, y + 50, this.color_white);
        this.rendertxt(g.utils.lpad(role.MaxHP, 5), font_size, x + 285, y + 50, this.color_white);
        this.rendertxt("內力", font_size, x + 175, y + 75, this.color_ability1);

        var c = this.color_white;
        if (role.MPType == 0) {
            c = this.color_purple;
        }
        else if (role.MPType == 1) {
            c = this.color_magic;
        }
        this.rendertxt(g.utils.lpad(role.MP, 5) + '/', font_size, x + 219, y + 75, c);
        this.rendertxt(g.utils.lpad(role.MaxMP, 5), font_size, x + 285, y + 75, c);
        this.rendertxt("體力", font_size, x + 175, y + 100, this.color_ability1);
        this.rendertxt(g.utils.lpad(role.PhysicalPower, 5) + '/', font_size, x + 219, y + 100, this.color_white);
        this.rendertxt(g.utils.lpad(100, 5), font_size, x + 285, y + 100, 	this.color_white);

        x = this.x + 20 - 300;
        y = this.y + 200;

        this.rendertxt("攻擊", font_size, x, y, this.color_ability1);
        this.rendertxt(role.Attack, font_size, x + 44, y, this.select_color1(role.Attack, this.j.op.MaxAttack), 5);
        this.rendertxt("防禦", font_size, x + 200, y, this.color_ability1);
        this.rendertxt(role.Defence, font_size, x + 244, y, this.select_color1(role.Defence, this.j.op.MaxDefence), 5);
        this.rendertxt("輕功", font_size, x + 400, y, this.color_ability1);
        this.rendertxt(role.Speed, font_size, x + 444, y, this.select_color1(role.Speed, this.j.op.MaxSpeed), 5);
        this.rendertxt("醫療", font_size, x, y + 25, this.color_ability1);
        this.rendertxt(role.Medcine, font_size, x + 44, y + 25, this.select_color1(role.Medcine, this.j.op.MaxMedcine), 5);
        this.rendertxt("解毒", font_size, x + 200, y + 25, this.color_ability1);
        this.rendertxt(role.Detoxification, font_size, x + 244, y + 25, this.select_color1(role.Detoxification, this.j.op.MaxDetoxification), 5);
        this.rendertxt("用毒", font_size, x + 400, y + 25, this.color_ability1);
        this.rendertxt(role.UsePoison, font_size, x + 444, y + 25, this.select_color1(role.UsePoison, this.j.op.MaxUsePoison), 5);


        x = this.x + 20 - 300;
        y = this.y + 270;
        this.rendertxt("技能", font_size, x, y, this.color_name);
        this.rendertxt("拳掌", font_size, x, y + 30, this.color_ability1);
        this.rendertxt(role.Fist, font_size, x + 44, y + 30, this.select_color1(role.Fist, this.j.op.MaxFist), 5);
        this.rendertxt("御劍", font_size, x, y + 55, this.color_ability1);
        this.rendertxt(role.Sword, font_size, x + 44, y + 55, this.select_color1(role.Sword, this.j.op.MaxSword), 5);
        this.rendertxt("耍刀", font_size, x, y + 80, this.color_ability1);
        this.rendertxt(role.Knife, font_size, x + 44, y + 80, this.select_color1(role.Knife, this.j.op.MaxKnife), 5);
        this.rendertxt("特殊", font_size, x, y + 105, this.color_ability1);
        this.rendertxt(role.Unusual, font_size, x + 44, y + 105, this.select_color1(role.Unusual, this.j.op.MaxUnusual), 5);
        this.rendertxt("暗器", font_size, x, y + 130, this.color_ability1);
        this.rendertxt(role.HiddenWeapon, font_size, x + 44, y + 130, this.select_color1(role.HiddenWeapon, this.j.op.MaxHiddenWeapon), 5);
        x = this.x + 220 - 300;
        y = this.y + 270;

        this.rendertxt("武學", 25, x - 10, y, this.color_name);


        for (var i = 0; i < 10; i++) {
            var magic = this.j.save.getRoleLearnedMagic(role, i);
            var x1 = x + i % 2 * 200;
            var y1 = y + 30 + parseInt(i / 2) * 25;
            var str = "__________";
            if (magic) {
                str = magic.Name;
                this.rendertxt(str, font_size, x1, y1, this.color_ability1, -1);

                str = this.role.getRoleShowLearnedMagicLevel(i);
                this.rendertxt(str, font_size, x1 + 100, y1, this.role.getRoleShowLearnedMagicLevel(i) > 9 ? this.color_red : this.color_purple, 3);
            }
            else {
                this.rendertxt(str, font_size, x1, y1, this.color_ability1);
            }
        }

        x = this.x + 420 - 300;
        y = this.y + 445;
        this.rendertxt("修煉", 25, x - 10, y, this.color_name, -1);
        var book = this.j.save.getItem(role.PracticeItem);

        if (book) {
            this.j.tm.render2(book.data.ID, 'item', x, y + 30, this.sp[this.sp_index++]);
            this.rendertxt(book.data.Name, font_size, x + 90, y + 30, this.color_name);
            this.rendertxt("經驗" + g.utils.lpad(role.ExpForItem, 5), 18, x + 90, y + 55, this.color_ability1);
            var str = "升級 ----";
            var exp_up = this.j.gameutil.getFinishedExpForItem(this.role, book);
            if (exp_up != Number.MAX_SAFE_INTEGER) {
                this.rendertxt("升級" + g.utils.lpad(exp_up, 5), 18, x + 90, y + 75, this.color_ability1);
            }
            else {
                this.rendertxt(str, 18, x + 90, y + 75, this.color_ability1);
            }
        }
        x = this.x + 20 - 300	;
        y = this.y + 445;
        this.rendertxt("武器", 25, x - 10, y, this.color_name);
        var equip = this.j.save.getItem(role.Equip0);
        if (equip) {
            equip = equip.data;
            this.j.tm.render2(equip.ID, 'item', x, y + 30, this.sp[this.sp_index++]);
            this.rendertxt(equip.Name, font_size, x + 90, y + 30, this.color_name);
            this.rendertxt("攻擊", 18, x + 90, y + 55, this.color_ability1);
            this.rendertxt(g.utils.lformat(equip.AddAttack), 18, x + 126, y + 75, this.select_color2(equip.AddAttack));
            this.rendertxt("防禦", 18, x + 90, y + 75, this.color_ability1);
            this.rendertxt(g.utils.lformat(equip.AddDefence), 18, x + 126, y + 95, this.select_color2(equip.AddDefence));
            this.rendertxt("輕功", 18, x + 90	, y + 95, this.color_ability1);
            this.rendertxt(g.utils.lformat(equip.AddSpeed), 18, x + 126, y + 55, this.select_color2(equip.AddSpeed));
        }



        x = this.x + 220 - 300	;
        y = this.y + 445;

        this.rendertxt("防具", 25, x - 10, y, this.color_name);
        var equip = this.j.save.getItem(role.Equip1);
        if (equip) {
            equip = equip.data;
            this.j.tm.render2(equip.ID, 'item', x, y + 30, this.sp[this.sp_index++]);
            this.rendertxt(equip.Name, font_size, x + 90, y + 30, this.color_name);
            this.rendertxt("攻擊", 18, x + 90, y + 55, this.color_ability1);
            this.rendertxt(g.utils.lformat(equip.AddAttack), 18, x + 126, y + 75, this.select_color2(equip.AddAttack));
            this.rendertxt("防禦", 18, x + 90, y + 75, this.color_ability1);
            this.rendertxt(g.utils.lformat(equip.AddDefence), 18, x + 126, y + 95, this.select_color2(equip.AddDefence));
            this.rendertxt("輕功", 18, x + 90, y + 95, this.color_ability1);
            this.rendertxt(g.utils.lformat(equip.AddSpeed), 18, x + 126, y + 55, this.select_color2(equip.AddSpeed));
        }
    };


    c.UIItem = function(j) {
        PIXI.Container.call(this);
        this.j = j;
        Object.assign(this, {
            tex_index : 0,
            txt : [],
            px : 0,
            py : 0,
            line_count : 3,
            select_user : true,
            item_each_line : 7,
            item_buttons : [],
            title : {},
            cursor : {},
            leftup_index : 0,
            force_item_type : -1,
            item_in_bag_count: 200,
            available_items : -1,
            current_item : null,
            selected : null,
            txt_max: 100,
            queue : [],
            team_menu : {}
        });

        for (var i = 0; i < (this.line_count * this.item_each_line); i++) {
            var b = new c.Button(this.j);
            this.item_buttons.push(b);
            b.position.set(parseInt(i % this.item_each_line) * 85 + 40, parseInt(i / this.item_each_line) * 85 + 100);
            this.addCustom(b);
        }
        this.title = new c.MenuText(this.j, ["劇情", "兵甲", "丹藥", "暗器", "拳經", "劍譜", "刀錄", "奇門", "心法"], 0, 0);
        this.title.setFontSize(24);
        this.title.arrange(0, 50, 64, 0);
        this.title.setHaveBox(true);
        this.addCustom(this.title);
        this.cursor = new c.TextBox(this.j);
        this.cursor.setTexture(127, "title");
        this.cursor.visible = false;
        this.addChild(this.cursor);
        for (var i = 0; i < this.txt_max; i++ ) {
            var tx = new PIXI.Text();
            this.addChild(tx);
            this.txt.push(tx);
        }
    };
    c.UIItem.constructor = c.UIItem;
    c.UIItem.prototype = Object.create(PIXI.Container.prototype);
    c.UIItem.prototype.rendertxt = function(txt, fontsize, x, y, color, padding) {
        this.j.tm.rendertxt(txt, fontsize, x, y, color, padding, this);
    };

    c.UIItem.prototype.wheelEvent = function(e) {
        var delta;
        if ( e.wheelDelta ) {
            delta = e.wheelDelta / 60;
        } else if ( e.detail ) {
            delta = -e.detail / 2;
        }
        if (delta > 0) {
            this.leftup_index -= this.item_each_line;
        }
        else {
            this.leftup_index += this.item_each_line;
        }
    };
    c.UIItem.prototype.getItemsByType = function(item_type) {
        this.available_items = [];
        for (var i = 0; i < this.item_in_bag_count; i++) {
            var item = this.j.save.getItemByBagIndex(i);
            if (item && this.getItemDetailType(item.data) == item_type) {
                this.available_items.push(item);
            }
        }


    };
    c.UIItem.prototype.getItemDetailType = function(item) {
        if (!item) {
            return -1;
        }
        if (item.ItemType == 0) {
            return 0;
        }
        else if (item.ItemType == 1) {
            return 1;
        }
        else if (item.ItemType == 3) {
            return 2;
        }
        else if (item.ItemType == 4) {
            return 3;
        }
        else if (item.ItemType == 2) {
            var m = this.j.save.getMagic(item.MagicID);
            if (m) {
                if (m.HurtType == 0) {
                    return m.MagicType + 3;
                }
            }
            return 8;
        }
        return 0;

    };

    c.UIItem.prototype.getAvailableItem = function(i) {
        if (i >= 0 && i < this.available_items.length) {
            return this.available_items[i];
        }
        return null;
    };

    c.UIItem.prototype.onPressedOK = function(item) {
        this.current_item = null;
        for (var i = 0; i < this.item_buttons.length; i++) {

            var button = this.item_buttons[i];
            if (button.state_ == button.state.Press) {
                var item = this.getAvailableItem(i + this.leftup_index);
                this.current_item = item;
            }
        }
        if (!this.current_item) {
            return;
        }
        if (this.current_item.data.ItemType == 0) {
            this.result = this.current_item.data.ID;
            if (this.j.target == this.j.subscene) {
                this.j.subscene.useEventItem(this.result);
            }
            this.result = -1;
            this.j.ui.visible = false;
            return true;
        }
        if (this.select_user) {
            if (this.current_item.data.ItemType == 3) {
                this.team_menu = new c.TeamMenu(this.j);
                this.team_menu.item = this.current_item;
                this.team_menu.setText(sprintf("誰要使用%s", this.current_item.data.Name));
                this.j.viewui.addCustom(this.team_menu);

                var f = function() {
                    var role = this.team_menu.getRole();
                    if (role) {
                        var r = Object.assign( Object.create( Object.getPrototypeOf(role)), role);
                        r.data = Object.assign( Object.create( Object.getPrototypeOf(role.data)), role.data);
                        this.j.gameutil.useItem(role, this.current_item);
                        this.df = new c.ShowRoleDifference(this.j);
                        this.df.setTwinRole(r, role);
                        var txt = sprintf("%s服用%s", g.utils.strim(role.data.Name), g.utils.strim(this.current_item.data.Name));

                        this.df.setText(txt);
                        this.j.viewui.addCustom(this.df);
                        this.j.gevent.addItemWithoutHint(this.current_item.data.ID, -1);
                    }
                };
                this.queue.push({'target' : this.team_menu, 'func' : function() {}, 'init' : 0, 'result' : f.bind(this)});
            }
            else if (this.current_item.data.ItemType == 1 || this.current_item.data.ItemType == 2) {
                this.team_menu = new c.TeamMenu(this.j);
                this.team_menu.item = this.current_item;
                var str = "誰要修煉%s";
                if (this.current_item.ItemType == 1) {
                    str = "誰要裝備%s";
                }
                this.team_menu.setText(sprintf(str, this.current_item.data.Name));
                this.j.viewui.addCustom(this.team_menu);

                var f = function() {
                    var role = this.team_menu.getRole();
                    if (role) {
                        this.j.gameutil.equip(role, this.current_item);
                    }
                };
                this.queue.push({'target' : this.team_menu, 'func' : function() {}, 'init' : 0, 'result' : f.bind(this)});
            }
        }

    };
    c.UIItem.prototype.showItemProperty = function(item) {
        if (!item) {
            return;
        }
        var str = g.utils.lpad(item.data.Name, -14) + g.utils.lpad(this.j.save.getItemCountInBag(this.current_item.data.ID), 5);

        this.rendertxt(str, 24, 10, 370, g.utils.rgbToHex(255, 255, 255), 0);
        this.rendertxt(item.data.Introduction, 20, 10, 400, g.utils.rgbToHex(255, 255, 255), 0);
        this.px = 10;
        this.py = 430;
        var size = 20;
        var color = g.utils.rgbToHex(255, 215, 0);
        if (item.isCompass()) {
            var man_x = this.j.mainmap.man_x;
            var man_y = this.j.mainmap.man_y;
            var str = "當前坐標 " + man_x + ", " + man_y;
            this.showOneProperty();
        }
        if (item.data.ItemType == 0) {
            return;
        }
        this.showOneProperty("生命", item.data.AddHP, size, color, 1);
        this.showOneProperty("生命上限", item.data.AddMaxHP, size, color, 1);
        this.showOneProperty("內力", item.data.AddMP, size, color, 1);
        this.showOneProperty("內力上限", item.data.AddMaxMP, size, color, 1);
        this.showOneProperty("體力", item.data.AddPhysicalPower, size, color, 1);
        this.showOneProperty("中毒", item.data.AddPoison, size, color, 1);
        this.showOneProperty("攻擊", item.data.AddAttack, size, color, 1);
        this.showOneProperty("輕功", item.data.AddSpeed, size, color, 1);
        this.showOneProperty("防禦", item.data.AddDefence, size, color, 1);
        this.showOneProperty("醫療", item.data.AddMedcine, size, color, 1);
        this.showOneProperty("用毒", item.data.AddUsePoison, size, color, 1);
        this.showOneProperty("解毒", item.data.AddDetoxification, size, color, 1);
        this.showOneProperty("抗毒", item.data.AddAntiPoison, size, color, 1);
        this.showOneProperty("拳掌", item.data.AddFist, size, color, 1);
        this.showOneProperty("御劍", item.data.AddSword, size, color, 1);
        this.showOneProperty("耍刀", item.data.AddKnife, size, color, 1);
        this.showOneProperty("特殊兵器", item.data.AddUnusual, size, color, 1);
        this.showOneProperty("暗器", item.data.AddHiddenWeapon, size, color, 1);
        this.showOneProperty("作弊", item.data.AddKnowledge, size, color, 1);
        this.showOneProperty("道德", item.data.AddMorality, size, color, 1);
        this.showOneProperty("攻擊帶毒", item.data.AddAttackWithPoison, size, color, 1);
        this.showOneProperty("內力調和", item.data.ChangeMPType == 2, size, color, 1);
        this.showOneProperty("雙擊", item.data.AddAttackTwice == 1, size, color, 1);

        var magic = this.j.save.getMagic(item.data.MagicID);
        if (magic) {
            this.showOneProperty("習得武學", magic.Name, size, color);
        }
        if (item.data.ItemType == 4 || item.dataItemType == 4) {
            return;
        }
        this.px = 10;
        this.py += size + 10;
        color = g.utils.rgbToHex(224, 170, 255);
        var role = this.j.save.getRole(item.data.OnlySuitableRole);
        if (role) {
            this.showOneProperty("僅適合", role.data.Name, size, color);
            return;
        }

        this.showOneProperty("內力", item.data.NeedMP, size, color);
        this.showOneProperty("攻擊", item.data.NeedAttack, size, color);
        this.showOneProperty("輕功", item.data.NeedSpeed, size, color);
        this.showOneProperty("醫療", item.data.NeedMedcine, size, color);
        this.showOneProperty("用毒", item.data.NeedUsePoison, size, color);
        this.showOneProperty("解毒", item.data.NeedDetoxification, size, color);
        this.showOneProperty("拳掌", item.data.NeedFist, size, color);
        this.showOneProperty("御劍", item.data.NeedSword, size, color);
        this.showOneProperty("耍刀", item.data.NeedKnife, size, color);
        this.showOneProperty("特殊兵器", item.data.NeedUnusual, size, color);
        this.showOneProperty("暗器", item.data.NeedHiddenWeapon, size, color);
        this.showOneProperty("資質", item.data.NeedIQ, size, color);
        this.showOneProperty("基礎經驗", item.data.NeedExp, size, color);
    };
    c.UIItem.prototype.showOneProperty = function(format_str, v, size, color, f) {
        if (v != 0) {
            if (f == 1) {
                v = g.utils.lformat(v);
            }
            var str = format_str + v;
            var draw_length = size * str.length;
            var x1 = this.px + draw_length;
            if (x1 	> 700) {
                this.px = 10;
                this.py += size + 5;
            }
            this.rendertxt(str, size, this.px, this.py, color, 0, this);
            this.px += draw_length;
        }
    };

    c.UIItem.prototype.draw = function() {
        if (this.queue.length) {
            this.j.ui.skip_event = true;
            var q = this.queue[0];
            if (!q.init) {
                q.init = 1;
                q.target.visible = 1;
                q.func();
            }
            else {
                q.func();
                if (!q.target.visible) {
                    q.result();
                    this.queue.splice(0, 1);
                    this.removeCustom(q.target);
                }

            }
            return;
        };
        this.j.ui.skip_event = false;
        this.checkCurrentItem();

        this.tex_index = 0;
        for (var i = 0; i < this.txt_max; i++ ) {
            this.txt[i].visible = false;
        }
        this.showItemProperty(this.current_item);
    };
    c.UIItem.prototype.checkCurrentItem = function() {

        this.getItemsByType(this.title.getSelected());
        var type_item_count = this.available_items.length;
        var max_leftup = (parseInt((type_item_count + this.item_each_line - 1 ) / this.item_each_line) - this.line_count) * this.item_each_line;
        if (max_leftup < 0) {
            max_leftup = 0;
        }
        this.leftup_index = this.j.gameutil.limit(this.leftup_index, 0, max_leftup);

        for (var i = 0; i < this.item_buttons.length; i++) {
            var btn = this.item_buttons[i];
            var index = i + this.leftup_index;
            var item = this.getAvailableItem(index);
            if (item) {
                btn.setTexture(item.data.ID, "item");
            }
            else {
                btn.setTexture('null', "item");
            }
            if (btn.state_ == btn.state.Pass || btn.state_ == btn.state.Press) {
                this.current_button = btn;
            }
        }
        this.current_item = null;
        if (this.current_button) {
            var x = this.current_button.x;
            var y = this.current_button.y;
            this.current_item = this.j.save.getItem(this.current_button.texture_normal_id);
            this.cursor.position.set(x, y);
            this.cursor.visible = true;
        }
        else {
            this.cursor.visible = false;
        }

    };

    c.UIItem.prototype.beforeDraw = function() {

    };


    c.Option = function(j) {
        Object.assign(this, {
            MaxLevel : 30,
            MaxHP : 999,
            MaxMP : 999,
            MaxPhysicalPower : 100,

            MaxPoison : 100,

            MaxAttack : 100,
            MaxDefence : 100,
            MaxSpeed : 100,

            MaxMedcine : 100,
            MaxUsePoison : 100,
            MaxDetoxification : 100,
            MaxAntiPoison : 100,

            MaxFist : 100,
            MaxSword : 100,
            MaxKnife : 100,
            MaxUnusual : 100,
            MaxHiddenWeapon : 100,

            MaxKnowledge : 100,
            MaxMorality : 100,
            MaxAttackWithPoison : 100,
            MaxFame : 999,
            MaxIQ : 100,

            MaxExp : 99999,

            MoneyItemID : 174,
            CompassItemID : 182,
        });
    };

    c.Option.constructor = c.Option;



    c.RandomRole = function(j) {
        c.UIStatus.call(this, j, false);
        this.j = j;
        this.show_button = false;
        this.button_ok = new c.Button(j);
        this.button_ok.setText("確定");
        this.button_ok.position.set(350, 55);
        this.addCustom(this.button_ok);
        this.head = new c.Head(this.j);
        this.head.position.x = -290;
        this.head.position.y = 100;
        this.addCustom(this.head);
    };

    c.RandomRole.prototype = Object.create(c.UIStatus.prototype);
    c.RandomRole.constructor = c.RandomRole;
    c.RandomRole.prototype.onPressedOK = function(e) {
        if (this.button_ok.state_ == this.button_ok.state.Press) {
            this.j.target.op1();
        }
        this.role.data.MaxHP = 25 + g.utils.rand(26);
        this.role.data.HP = this.role.data.MaxHP;
        this.role.data.MaxMP = 25 + g.utils.rand(26);
        this.role.data.MP = this.role.data.MaxMP;
        this.role.data.MPType = g.utils.rand(2);
        this.role.data.IncLife = 1 + g.utils.rand(10);
        this.role.data.Attack = 25 + g.utils.rand(6);
        this.role.data.Speed = 25 + g.utils.rand(6);
        this.role.data.Defence = 25 + g.utils.rand(6);
        this.role.data.Medcine = 25 + g.utils.rand(6);
        this.role.data.UsePoison = 25 + g.utils.rand(6);
        this.role.data.Detoxification = 25 + g.utils.rand(6);
        this.role.data.Fist = 25 + g.utils.rand(6);
        this.role.data.Sword = 25 + g.utils.rand(6);
        this.role.data.Knife = 25 + g.utils.rand(6);
        this.role.data.Unusual = 25 + g.utils.rand(6);
        this.role.data.HiddenWeapon = 25 + g.utils.rand(6);
        this.role.data.IQ = 25 + g.utils.rand(100);
    };
    c.RandomRole.prototype.setRole = function(r) {
        this.role = r;
        this.head.setRole(r);
    };

})(PIXI, g, c, window);
