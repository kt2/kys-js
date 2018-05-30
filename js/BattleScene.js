(function (PIXI, g, c, window) {
    'use strict';

    c.BattleScene = function (j) {
        this.j = j;
        Object.assign(this, {
            coord_count : this.j.type.battle_coord_count,
            earth_layer : {},
            building_layer : {},
            select_layer : {},
            effect_layer : {},
            battle_menu : {},
            role_layer : {},
            battle_infos : [],
            battle_roles : [],
            battle_id : 0,
            battle_enemy_count : 20,
            action_type : -1,
            action_role : '',
            action_frame : 0,
            act_frame : '',
            battle_fight : {},
            battle_frames : [],
            friends : [],
            act_cmd : '',
            act_move_arr : [],
            act_magic_arr : [],
            act_action_frame : [],
            act_magic_num : [],
            eff_num : '',
            txt_max : 50,
            txt : [],
            fail_exp : false,
            result : -1,
            queue : [],
            team_menu : {},
            visible : false
        });
        this.bg = new PIXI.Graphics();
        this.bg.beginFill(0x000000, 0.3);
        this.bg.drawRect(0, 0, g.app.view.width, g.app.view.height);
        this.j.viewui.addChild(this.bg);
        this.bg.visible = false;
        this.scene_init();
        for (var i = 0; i < this.txt_max; i++ ) {
            var tx = new PIXI.Text();
            this.j.viewui.addChild(tx);
            this.txt.push(tx);
        }
        this.show_exp = new c.ShowExp(this.j)
        this.j.viewui.addCustom(this.show_exp);
        this.df = new c.ShowRoleDifference(this.j);
        this.j.viewui.addCustom(this.df);
        this.df.visible = false;
    };
    c.BattleScene.prototype = Object.create(c.Scene.prototype);
    c.BattleScene.constructor = c.BattleScene;


    c.BattleScene.prototype.init = function(resources) {
        this.item_menu = new c.BattleItemMenu(this.j);
        this.j.viewui.addCustom(this.item_menu);
        this.battle_cursor = new c.BattleCursor(this.j);
        this.j.viewui.addCustom(this.battle_cursor);
        this.battle_menu = new c.BattleMenu(this.j);
        this.battle_menu.visible = false;
        this.battle_menu.position.set(160, 200);
        this.j.viewui.addCustom(this.battle_menu);
        this.head_self = new c.Head(this.j);
        this.j.viewui.addCustom(this.head_self);
        this.magic_menu = new c.BattleMagicMenu(this.j);
        this.j.viewui.addCustom(this.magic_menu);
        this.magic_name = new c.TextBox(this.j);
        this.magic_name.setText('');
        this.j.viewui.addCustom(this.magic_name);
        this.head_self.visible = false;
        this.magic_menu.visible = false;
        this.magic_name.visible = false;
    };
    c.BattleScene.prototype.setSelectPosition = function(x, y) {
        this.select_x = x;
        this.select_y = y;

    };
    c.BattleScene.prototype.moveAnimation = function(r, x, y) {
        this.act_move_arr = [];
        var way = [];
        var that = this;
        var check_next = function (p1, step) {
            if (that.canSelect(p1.x, p1.y) && g.utils.getData(that.select_layer, p1.x, p1.y, 64) == step) {
                way.push(p1);
                return true;
            }
            return false;
        };
        way.push({"x" : x, "y" : y});

        for (var i = g.utils.getData(this.select_layer, x, y, 64); i < g.utils.getData(this.select_layer, r.data.X, r.data.Y, 64); i++) {
            var x1 = way[way.length - 1].x;
            var y1 = way[way.length - 1].y;
            if (check_next({ "x" : x1 - 1, "y" : y1}, i + 1)) { continue; }
            if (check_next({ "x" : x1 + 1, "y" : y1}, i + 1)) { continue; }
            if (check_next({ "x" : x1 , "y" : y1 - 1}, i + 1)) { continue; }
            if (check_next({ "x" : x1 , "y" : y1 + 1}, i + 1)) { continue; }
        }

        for (var i = way.length - 2; i >= 0 ; i--) {
            this.act_move_arr.push({x: way[i].x, y : way[i].y });
        }
        //this.act_move_arr.push({x : x, y : y});

        g.utils.setAll(this.select_layer, -1, 64);
    };


    c.BattleScene.prototype.clearDead = function(r) {
        var found_dead = false;
        for (var i in this.battle_roles) {
            var r = this.battle_roles[i];
            if (r.data.HP <= 0) {
                r.dead_alpha -= 10;
                if (r.dead_alpha < 0) {
                    r.setPosition(-1, -1);
                    this.battle_roles.splice(i, 1);
                    found_dead = true;
                }
                else {
                    found_dead = true;
                }
            }
        }
        return found_dead;
    };
    c.BattleScene.prototype.showNumberAnimation = function() {
        var need_show = false;
        for (var i in this.battle_roles) {
            var r = this.battle_roles[i];
            if (r.ShowString) {
                need_show = true;
                break;
            }
        }
        if (!need_show) {
            return;
        }
        var size = 20;
        for (var i = 0; i <= 10; i++) {
            var group = [];
            for (var k in this.battle_roles) {
                var r = this.battle_roles[k];
                if (r.ShowString != 0 && r.ShowString != '') {
                    var p = this.getPositionOnWindow(r.data.X, r.data.Y, this.man_x, this.man_y)
                    var x = p.x - size * r.ShowString.length / 4;
                    var y = p.y - 100 - i * 2;
                    group.push({x : x, y : y, num : r.ShowString, color: r.ShowColor});

                }

            }
            this.act_magic_num.push(group);
        }

        for (var i in this.battle_roles) {
            this.battle_roles[i].ShowString = '';
        }
    };
    c.BattleScene.prototype.showMagicName = function(name) {
        this.magic_name.setFontSize(20);
        this.magic_name.position.set(450, 150);
        this.magic_name.setText(g.utils.strim(name));
        this.magic_name.visible = true;
    };
    c.BattleScene.prototype.calHiddenWeaponHurt = function(r1, r2, item) {
        var v = r1.data.HiddenWeapon - item.data.AddHP;
        var dis = this.calRoleDistance(r1, r2);
        var v = v / Math.exp((dis - 1) / 10);
        v += g.utils.rand(10) - g.utils.rand(10);
        if (v < 1) {
            v = 1;
        }
        return parseInt(v);
    };
    c.BattleScene.prototype.setMagicCursor = function(r) {
        r.ActTeam = 1;
        var magic = this.magic_menu.getMagic();
        var level_index = r.getMagicLevelIndex(magic.data.ID);
        this.calSelectLayerByMagic(r.data.X, r.data.Y, r.Team, magic, level_index);
        this.battle_cursor.mode_ = this.battle_cursor.mode.Action;
        this.battle_cursor.cmd = 'magic';
        this.battle_cursor.setRoleAndMagic(r, magic, level_index);
    };
    c.BattleScene.prototype.actStatusRet = function(r) {
        this.head_self.visible = true;
        this.battle_cursor.head_selected.visible = true;
        this.battle_cursor.ui_status.visible = false;


    };
    c.BattleScene.prototype.actUseDragRet = function(r, item) {
        this.battle_menu.visible = false;
        this.item_menu.cmd = '';
        this.item_menu.selected = null;
        this.act_cmd = 'drug';

        var r0 = Object.assign( Object.create( Object.getPrototypeOf(r)), r);
        r0.data = Object.assign( Object.create( Object.getPrototypeOf(r.data)), r.data);
        this.j.gameutil.useItem(r, item);
        this.df.setTwinRole(r0, r);
        this.df.auto = true;
        this.df.show_head = false;
        this.df.visible = true;
        this.df.setText(sprintf("%s服用%s", g.utils.strim(r.data.Name), g.utils.strim(item.data.Name)));
        this.df.position.set(250, 220);
        this.item_menu.addItem(item, -1);
        r.Acted = 1;

    };
    c.BattleScene.prototype.actHiddenWeaponRet = function(r, item) {
        r.ActTeam = 1;
        this.item_menu.cmd = '';
        this.item_menu.selected = null;
        this.act_cmd = 'hiddenweapon';
        var v = 0;
        var r2 = this.getSelectedRole();
        if (r2) {
            var v = this.calHiddenWeaponHurt(r, r2, item);
            r2.ShowString = "-" + Math.abs(v);
            r2.ShowColor = g.utils.rgbToHex(255, 20, 20);
        }
        this.showMagicName (item.data.Name);
        r.data.PhysicalPower = this.j.gameutil.limit(r.data.PhysicalPower - 5, 0, this.j.op.MaxPhysicalPower);
        this.actionAnimation(r, 0, item.data.HiddenWeaponEffectID);

        if (r2) {
            r2.data.HP = this.j.gameutil.limit(r2.data.HP - v, 0, r2.data.MaxHP);
        }

        this.showNumberAnimation();
        this.item_menu.addItem(item, -1);
        r.Acted = 1;
    };
    c.BattleScene.prototype.actMedcineRet = function(r) {
        this.act_cmd = 'medcine';
        var r2 = this.getSelectedRole();
        if (r2) {
            var v = this.j.gameutil.medcine(r, r2);
            r2.ShowString = "+" + Math.abs(v);
            r2.ShowColor = g.utils.rgbToHex(255, 255, 200);
        }
        r.data.PhysicalPower = this.j.gameutil.limit(r.data.PhysicalPower - 5, 0 , this.j.op.MaxPhysicalPower);
        this.actionAnimation(r, 0, 0);
        this.showNumberAnimation();
        r.Acted = 1;
    };
    c.BattleScene.prototype.actDetoxificationRet = function(r) {
        this.act_cmd = 'detoxificaton';
        var r2 = this.getSelectedRole();
        if (r2) {
            var v = this.j.gameutil.detoxification(r, r2);
            r2.ShowString = "-" + Math.abs(v);
            r2.ShowColor = g.utils.rgbToHex(20, 200, 255);
        }
        r.data.PhysicalPower = this.j.gameutil.limit(r.data.PhysicalPower - 5, 0 , this.j.op.MaxPhysicalPower);
        this.actionAnimation(r, 0, 36);
        this.showNumberAnimation();
        r.Acted = 1;
    };

    c.BattleScene.prototype.poisonEffect = function(r) {
        if (r) {
            r.data.Poison -= r.data.AntiPoison;
            r.data.Poison = this.j.gameutil.limit(r.data.Poison, 0, this.j.op.MaxPoison);
            r.data.HP -= r.data.Poison / 3;
            if (r.data.HP < 1) {
                r.data.HP = 1;
            }
        }
    };
    c.BattleScene.prototype.actUsePoisonRet = function(r) {
        this.act_cmd = 'poison';
        var r2 = this.getSelectedRole();
        if (r2) {
            var v = this.j.gameutil.usePoison(r, r2);
            r2.ShowString = "+" + v;
            r2.ShowColor = g.utils.rgbToHex(20, 255, 20);
        }
        r.data.PhysicalPower = this.j.gameutil.limit(r.data.PhysicalPower - 3, 0 , this.j.op.MaxPhysicalPower);
        this.actionAnimation(r, 0, 30);
        this.showNumberAnimation();
        r.Acted = 1;
    };
    c.BattleScene.prototype.actUseMagicRet = function(r, magic) {
        this.act_cmd = 'magic';
        var level_index = r.getMagicLevelIndex(magic.data.ID);
        for (var i = 0;i <= this.j.gameutil.sign(r.data.AttackTwice); i++) {
            this.showMagicName(magic.data.Name);
            r.data.PhysicalPower = this.j.gameutil.limit(r.data.PhysicalPower - 3, 0, this.j.op.MaxPhysicalPower);
            r.data.MP = this.j.gameutil.limit(r.data.MP - magic.calNeedMP(level_index), 0 , r.data.MaxMP);

            this.useMagicAnimation(r, magic);
            this.calMagiclHurtAllEnemies(r, magic);
            this.showNumberAnimation();
            var index = 1 + r.getMagicOfRoleIndex(magic);
            if (index >= 0) {
                r.data.MagicLevel[index] += g.utils.rand(2);
                this.j.gameutil.limit(r.data.MagicLevel[index], 0, this.j.type.max_magic_level);
            }
        }
        r.Acted = 1;

    };
    c.BattleScene.prototype.actUseMagic = function(r) {
        //while (true) {
        this.act_cmd = 'magic';
        this.magic_menu.start = r.SelectedMagic;
        this.magic_menu.runAsRole(r);

        var magic = this.magic_menu.getMagic();
        r.SelectedMagic = this.magic_menu.result;
        if (!magic) {
            //break;
            return;
        }
        r.ActTeam = 1;
        var level_index = r.getMagicLevelIndex(magic.data.ID);
        this.calSelectLayerByMagic(r.data.X, r.data.Y, r.Team, magic, level_index);
        this.battle_cursor.mode_ = this.battle_cursor.mode.Action;
        this.battle_cursor.cmd = 'magic';

        this.battle_cursor.setRoleAndMagic(r, magic, level_index);

        var selected = this.battle_cursor.run();
        if (selected < 0) {
            return;
        }
        else {
            this.actUseMagicRet(r, magic);
            r.Acted = 1;
            return;
        }
        //}
    };
    c.BattleScene.prototype.actionAnimation = function(r, style, effect_id, shake) {
        if (r.data.X != this.select_x || r.data.Y != this.select_y) {
            r.FaceTowards = this.calTowards(r.data.X, r.data.Y, this.select_x, this.select_y);
        }
        if (r.isAuto()) {

            this.setFaceTowardsNearest(r, true);
        }
        var frame_count = r.FightFrame[style];
        this.action_type = style;
        this.action_role = r.data.ID;
        for (this.action_frame = 0; this.action_frame < frame_count; this.action_frame++) {
            this.act_action_frame.push(this.action_frame);
        }
        this.effect_id = effect_id;
        var path = "eft/eft" + effect_id;
        var effect_count = 0;
        PIXI.sound.play('sound-e-' + effect_id ,{loop : 0, volume : 0.1});
        for (this.effect_frame = 0; this.effect_frame < effect_count + 10; this.effect_frame++) {

            if (shake > 0) {
                this.x = Math.random(shake) - Math.random (shake);
                this.y = Math.random(shake) - Math.random (shake);

            }
            this.act_magic_arr.push({x : this.x, y : this.y, effect_id : this.effect_id, frame : this.effect_frame});
        }
        this.action_frame = 0;
        //this.action_type = -1;
        this.effect_frame = 0;
        this.effect_id = -1;
        this.x = 0;
        this.y = 0;
    };
    c.BattleScene.prototype.useMagicAnimation = function(r, m) {
        if (r && m) {
            PIXI.sound.play('sound-atk-' + m.data.SoundID ,{loop : 0, volume : 0.1});
            this.actionAnimation(r, m.data.MagicType, m.data.EffectID);
        }
    };
    c.BattleScene.prototype.actRet = function(cmd, r, m) {
        if (cmd == 'move') {
            this.actMoveRet(r);
        }
        else if (cmd == 'magic') {
            this.actUseMagicRet(r, m);
        }
        else if (cmd == 'poison') {
            this.actUsePoisonRet(r);
        }
        else if (cmd == 'detoxification') {
            this.actDetoxificationRet(r);
        }
        else if (cmd == 'medcine') {
            this.actMedcineRet(r);
        }
        else if (cmd == 'hiddenweapon') {
            this.actHiddenWeaponRet(r, m);
        }
        else if (cmd == 'drug') {
            this.actUseDragRet(r);
        }
        else if (cmd == 'status') {
            this.actStatusRet(r);
        }
    };
    c.BattleScene.prototype.actMoveRet = function(r) {
        this.act_cmd = 'move';
        r.data.PhysicalPower = this.j.gameutil.limit(r.data.PhysicalPower - 2, 0, this.j.op.MaxPhysicalPower);
        r.setPrevPosition(r.data.X, r.data.Y);
        this.moveAnimation (r, this.select_x, this.select_y);
        r.Moved = 1;
    };
    c.BattleScene.prototype.actMove = function(r) {
        var step = parseInt(this.calMoveStep(r));
        this.calSelectLayer(r, 0, step);
        this.battle_cursor.setRoleAndMagic(r);
        this.battle_cursor.mode_ = this.battle_cursor.mode.Move;
        this.battle_cursor.cmd = 'move';
        if (this.battle_cursor.run() == 0) {
            this.actMoveRet(r);
        }
    };



    c.BattleScene.prototype.action = function(r) {
        if (this.battle_cursor.isRunning() || this.magic_menu.isRunning()) {
            return;
        }
        this.battle_menu.runAsRole(r);

        var str = this.battle_menu.getResultString();
        if (str == "移動") {
            this.actMove(r);
        }
        else if (str == "武學") {
            this.actUseMagic(r);
        }
        else if (str == "用毒") {
            this.actUsePoison(r);
        }
        else if (str == "解毒") {
            this.actDetoxification(r);
        }
        else if (str == "醫療") {
            this.actMedcine(r);
        }
        else if (str == "暗器") {
            this.actUseHiddenWeapon(r);
        }
        else if (str == "藥品") {
            this.actUseDrag(r);
        }
        else if (str == "等待") {
            this.actWait(r);
        }
        else if (str == "狀態") {
            this.actStatus(r);
        }
        else if (str == "自動") {
            this.actAuto(r);
        }
        else if (str == "結束") {
            this.actRest(r);
        }


        this.battle_menu.result = -1;
        if (r.Acted) {
            this.battle_menu.start = 0;
        }
    };
    c.BattleScene.prototype.getSelectedRole = function() {
        return g.utils.getData(this.role_layer, this.select_x, this.select_y, 64);
    };
    c.BattleScene.prototype.calActionStep = function(ability) {
        return parseInt(ability / 15 + 1);
    };

    c.BattleScene.prototype.onPressedCancel = function(e) {
        for (var i in this.battle_roles) {
            this.battle_roles[i].Auto = 0;
        }
    };
    c.BattleScene.prototype.actRest = function(r) {
        if (!r.Moved) {
            r.data.PhysicalPower = this.j.gameutil.limit(r.data.PhysicalPower + 5, 0, this.j.op.MaxPhysicalPower);
            r.data.HP = this.j.gameutil.limit(r.data.HP + 0.05 * parseFloat(r.data.MaxHP), 0, r.data.MaxHP);
            r.data.MP = this.j.gameutil.limit(r.data.MP + 0.05 * parseFloat(r.data.MaxMP), 0, r.data.MaxMP);
        }
        r.Acted = 1;
    };
    c.BattleScene.prototype.actAuto = function(r) {
        for (var i in this.battle_roles) {
            this.battle_roles[i].Auto = 1;
        }
    };
    c.BattleScene.prototype.actStatus = function(r) {
        this.calSelectLayer(r, 2, 0);
        this.battle_cursor.setRoleAndMagic(r);
        this.head_self.visible = false;
        this.battle_cursor.head_selected.visible = false;
        this.battle_cursor.ui_status.visible = true;

        this.battle_cursor.mode_ = this.battle_cursor.mode.Action;
        this.battle_cursor.cmd = 'status';
        var selected = this.battle_cursor.run();
        if (selected < 0) {
        }
        else {
            return;
        }
    };
    c.BattleScene.prototype.actUseDrag = function(r) {
        this.item_menu.setRole(r);
        this.item_menu.position.set(300, 0);
        this.item_menu.setForceItemType(2);
        this.item_menu.cmd = 'drug';
        this.battle_menu.visible = false;
    };
    c.BattleScene.prototype.actUseHiddenWeapon = function(r) {
        this.item_menu.setRole(r);
        this.item_menu.position.set(300, 0);
        this.item_menu.setForceItemType(3);
        this.item_menu.cmd = 'hiddenweapon';
        this.battle_menu.visible = false;
    };
    c.BattleScene.prototype.actMedcine = function(r) {
        this.calSelectLayer(r, 1, this.calActionStep(r.data.Medcine));
        this.battle_cursor.mode_ = this.battle_cursor.mode.Action;
        this.battle_cursor.cmd = 'medcine';
        this.battle_cursor.setRoleAndMagic(r);
        r.ActTeam = 0;
        var selected = this.battle_cursor.run();
        if (selected < 0) {
        }
        else {
            this.actMedcineRet(r);
            return;
        }
    };
    c.BattleScene.prototype.actDetoxification = function(r) {
        this.calSelectLayer(r, 1, this.calActionStep(r.data.Detoxification));
        this.battle_cursor.mode_ = this.battle_cursor.mode.Action;
        this.battle_cursor.cmd = 'detoxification';
        this.battle_cursor.setRoleAndMagic(r);
        r.ActTeam = 0;
        var selected = this.battle_cursor.run();
        if (selected < 0) {
        }
        else {
            this.actDetoxificationRet(r);
            return;
        }
    };
    c.BattleScene.prototype.actUsePoison = function(r) {
        this.calSelectLayer(r, 1, this.calActionStep(r.data.UsePoison));
        this.battle_cursor.mode_ = this.battle_cursor.mode.Action;
        this.battle_cursor.cmd = 'poison'
        this.battle_cursor.setRoleAndMagic(r);
        r.ActTeam = 1;
        var selected = this.battle_cursor.run();
        if (selected < 0) {
            return;
        }
        else {
            this.actUsePoisonRet(r);
            return;
        }

    };

    c.BattleScene.prototype.readFightFrame = function(r) {
        if (r.FightFrame[0] >= 0) {
            return;
        }
        for (var i = 0; i < 5; i++) {
            r.FightFrame[i] = 0;
        }
        var frames = [];
        g.utils.findNumber(this.battle_fight['fight-' + g.utils.zpad(r.data.HeadID, 3)], frames);
        for (var i = 0; i < frames.length / 2; i++) {
            r.FightFrame[frames[i * 2]] = frames[i * 2 + 1];
        }

    };
    c.BattleScene.prototype.readBattleInfo = function() {
        this.battle_roles = [];
        var r = this.j.save.roles;
        for (var i = 0; i < r.length; i++) {
            r[i].setRolePositionLayer(this.role_layer);
            r[i].Team = 2;
            r[i].Auto = 1;
        }
        for (var i = 0; i < this.battle_enemy_count; i++) {
            var r = this.j.save.getRole(this.info.Enemy[i]);
            if (r) {
                this.battle_roles.push(r);
                r.setPosition(this.info.EnemyX[i], this.info.EnemyY[i]);
                r.Team = 1;
                this.readFightFrame(r);
                r.FaceTowards = g.utils.rand(4);
            }
        }
        if (this.battle_roles.length > 0) {
            this.man_x = this.battle_roles[0].data.X;
            this.man_y = this.battle_roles[0].data.Y;
        }
        else {
            this.man_x = this.coord_count / 2;
            this.man_y = this.coord_count / 2;
        }
        if (this.info.AutoTeamMate[0] >= 0) {
            for (var i = 0; i < this.j.type.teammate_count; i++) {
                r = this.j.save.getRole(this.info.AutoTeamMate[i]);
                if (r) {
                    this.friends.push(r);
                }
            }
            this.buildRoles(this.friends);
        }
        else {

            this.team_menu = new c.TeamMenu(this.j);
            this.j.viewui.addCustom(this.team_menu);

            this.team_menu.mode = 1;
            this.team_menu.visible = 1;
        }

    };
    c.BattleScene.prototype.buildRoles = function(roles) {
        this.friends = roles;
        var that = this;
        for (var i = 0; i < this.friends.length; i++) {
            var r = this.friends[i];
            if (r) {
                that.battle_roles.push(r);
                r.setPosition(that.info.TeamMateX[i], that.info.TeamMateY[i]);
                r.Team = 0;
            }
        };
        for (var i in this.battle_roles) {
            this.setRoleInitState(this.battle_roles[i]);
        }
        this.sortRoles();
    };
    c.BattleScene.prototype.setRoleInitState = function(r) {
        r.Acted = 0;
        r.ExpGot = 0;
        r.ShowString = 0;
        r.FightingFrame = 0;
        r.Moved = 0;
        r.AI_Action = -1;
        r.dead_alpha = 255;

        if (r.Team == 0) {
            r.Auto = 0;
            r.data.HP = this.j.gameutil.limit(r.data.HP, r.data.MaxHP / 10, r.data.MaxHP);
            r.data.HP = this.j.gameutil.limit(r.data.HP, r.data.MaxHP / 10, r.data.MaxHP);
        }
        else {
            r.Auto = 1;
            r.data.PhysicalPower = 90;
            r.data.HP = r.data.MaxHP;
            r.data.MP = r.data.MaxMP;
            r.data.Poison = 0;
            r.data.Hurt = 0;
        }
        this.readFightFrame(r);
        this.setFaceTowardsNearest(r);
    };



    c.BattleScene.prototype.calMagicHurt = function(r1, r2, magic) {
        var level_index = this.j.save.getRoleLearnedMagicLevelIndex(r1, magic)
        level_index = magic.calMaxLevelIndexByMP(r1.data.MP, level_index);

        if (magic.data.HurtType == 0) {
            if (r1.data.MP <= 10) {
                return 1 + g.utils.rand(10);
            }
            var attack = r1.data.Attack + magic.data.Attack[level_index] / 3;
            var defence = r2.data.Defence;
            if (r1.data.Equip0 >= 0) {
                var i = this.j.save.getItem(r1.data.Equip0);
                attack += i.data.AddAttack;
            }
            if (r1.data.Equip1 >= 0) {
                var i = this.j.save.getItem(r1.data.Equip1);
                attack += i.data.AddAttack;
            }
            if (r2.data.Equip0 >= 0) {
                var i = this.j.save.getItem(r2.data.Equip0);
                defence += i.data.AddDefence;
            }
            if (r2.data.Equip1 >= 0) {
                var i = this.j.save.getItem(r2.data.Equip1);
                defence += i.data.AddDefence;
            }

            var v = attack - defence;
            var dis = this.calRoleDistance(r1, r2);
            v = v / Math.exp((dis - 1) / 10);
            v += g.utils.rand(10) - g.utils.rand(10);
            if (v < 10) {
                v = 1 + g.utils.rand(10);
            }
            return parseInt(v);
        }
        else if (magic.data.HurtType == 1) {
            var v = magic.data.HurtMP[level_index];
            v += g.utils.rand(10) - g.utils.rand(10);
            if (v < 10) {
                v = 1 + g.utils.rand(10);
            }
            return parseInt(v);
        }
    };
    c.BattleScene.prototype.calMagiclHurtAllEnemies = function(r, m, simulation) {
        var total = 0;
        for (var i in this.battle_roles) {
            var r2 = this.battle_roles[i];
            if (r2.Team != r.Team && this.haveEffect(r2.data.X, r2.data.Y)) {
                var hurt = this.calMagicHurt(r, r2, m);
                if (!simulation) {
                    if (m.data.HurtType == 0) {
                        r2.ShowString = "-" + hurt;
                        r2.ShowColor = g.utils.rgbToHex(255, 20, 20);
                        var prevHP = r2.data.HP;
                        r2.data.HP = this.j.gameutil.limit(r2.data.HP - hurt, 0, r2.data.MaxHP);
                        var hurt1 = prevHP - r2.data.HP;
                        r.ExpGot += hurt1;
                        if (r2.data.HP <= 0) {
                            r.ExpGot += hurt1;
                        }
                        if (r2.data.HP <= 0) {
                            r.ExpGot += hurt1 / 2;
                        }
                    }
                    else if (m.data.HurtType == 1) {
                        r2.ShowString = "-" + hurt;
                        r2.ShowColor = g.utils.rgbToHex( 160, 32, 240 );
                        var prevMP = r2.data.MP;
                        r2.data.MP = this.j.gameutil.limit(r2.data.MP - hurt, 0, r2.data.MaxMP);
                        r.data.MP = this.j.gameutil.limit(r.data.MP + hurt, 0, r.data.MaxMP);
                        var hurt1 = prevMP - r2.data.MP;
                        r.ExpGot += hurt1 / 2;
                    }
                    else {
                        if (r.data.AttackTwice) {
                            hurt *= 2;
                            if (hurt >= r2.data.HP) {
                                hurt = 1.25 * r2.HP;
                            }
                            else if (m.data.HurtType == 1) {
                                hurt /= 5;
                            }
                        }
                    }
                }
                total += hurt;
            }
        }
        return total;
    };

    c.BattleScene.prototype.haveEffect = function(x, y) {
        return g.utils.getData (this.effect_layer, x, y, 64) >= 0;
    };
    c.BattleScene.prototype.isOutLine = function(x, y) {
        return (x < 0 || x >= this.coord_count || y < 0 || y >= this.coord_count);
    };
    c.BattleScene.prototype.canSelect = function(x, y) {
        return (!this.isOutLine(x, y) && (g.utils.getData(this.select_layer, x, y, 64) >= 0));
    };
    c.BattleScene.prototype.inEffect = function(r1, r2) {
        if (this.haveEffect(r2.data.X, r2.data.Y)) {

            if (r1.ActTeam == 0 && r1.Team == r2.Team) {
                return true;
            }
            else if (r1.ActTeam != 0 && r1.Team != r2.Team) {
                return true;
            }
        }
        return false;
    };

    c.BattleScene.prototype.calDistance = function(x1, y1, x2, y2) {
        return Math.abs(x1 - x2) + Math.abs(y1 - y2);
    };
    c.BattleScene.prototype.calEffectlayer2 = function(r, select_x, select_y, m, level_index) {
        this.calEffectlayer(r.data.X, r.data.Y, select_x, select_y, m , level_index);
    };
    c.BattleScene.prototype.calEffectlayer = function(x, y, select_x, select_y, m, level_index) {

        g.utils.setAll(this.effect_layer, -1, 64);
        if (!m || m.data.AttackAreaType == 0) {
            g.utils.setData(this.effect_layer, select_x, select_y, 64, 0);
            return;
        }

        if (m.data.AttackAreaType == 1) {
            var tw = this.calTowards (x, y, select_x, select_y);
            var dis = m.data.SelectDistance[level_index];
            for (var ix = x - dis; ix <= x + dis; ix++) {
                for (var iy = y - dis; iy <= y + dis; iy++) {
                    if (!this.isOutLine(ix, iy) && (x == ix || y == iy) && this.calTowards(x, y, ix, iy) == tw) {
                        g.utils.setData(this.effect_layer, ix, iy, 64, 0);
                    }
                }
            }
        }
        else if (m.data.AttackAreaType == 2) {
            var dis = m.data.SelectDistance[level_index];
            for (var ix = x - dis; ix <= x + dis; ix++) {
                for (var iy = y - dis; iy <= y + dis; iy++) {
                    if (!this.isOutLine(ix, iy) && (x == ix || y == iy)) {
                        g.utils.setData(this.effect_layer, ix, iy, 64, 0);
                    }
                }
            }
        }
        else if (m.data.AttackAreaType == 3) {
            var dis = m.data.AttackDistance[level_index];
            for (var ix = select_x - dis; ix <= select_x + dis; ix++) {
                for (var iy = select_y - dis; iy <= select_y + dis; iy++) {
                    if (!this.isOutLine(ix, iy)) {
                        g.utils.setData(this.effect_layer, ix, iy, 64, 0);
                    }
                }
            }
        }


    };
    c.BattleScene.prototype.calRoleDistance = function(r1, r2) {
        return this.calDistance(r1.data.X, r1.data.Y, r2.data.X, r2.data.Y);
    };

    c.BattleScene.prototype.setFaceTowardsNearest = function(r, in_effect) {
        var min_distance = this.coord_count * this.coord_count;
        var r_near = null;
        for (var i in this.battle_roles) {
            var r1 = this.battle_roles[i];
            if (!in_effect && r.Team != r1.Team || in_effect && this.inEffect(r, r1)) {
                var dis = this.calRoleDistance(r, r1);
                if (dis < min_distance) {

                    r_near = r1;
                    min_distance = dis;
                }
            }
        }
        if (r_near) {
            r.FaceTowards = this.calTowards(r.data.X, r.data.Y, r_near.data.X, r_near.data.Y);
        }


    };

    c.BattleScene.prototype.start = function(towards) {
        this.role_layer = {};
        this.j.target = this.j.battle;
        this.result = -1;
        this.visible = true;
        this.towards = towards;
        this.head_self.position.set(80, 100);
        this.head_self.visible = true;
        PIXI.sound.stopAll();
        PIXI.sound.play('bgm-' + this.info.Music ,{loop : 1, volume : g.volume});
        this.readBattleInfo();
        this.draw();
    };

    c.BattleScene.prototype.stop = function() {
        this.bg.visible = false;
        this.resetRolesAct();
        this.queue = [];
        this.friends = [];
        this.battle_roles = [];
        this.head_self.setRole();
        this.j.viewui.removeCustom(this.team_menu);
        this.visible = false;
        this.head_self.visible = false;
        this.magic_menu.visible = false;
        this.magic_name.visible = false;
        cancelAnimationFrame(this.requestid);
        if (g.mainmap_tex) {
            for (var k in g.mainmap_tex) {
                g.mainmap_tex[k].visible = false;
            }
        }
    };




    c.BattleScene.prototype.sortRoles = function() {
        return this.battle_roles.sort(function(r1, r2) {
            return r1.data.Speed < r2.data.Speed;
        });
    };

    c.BattleScene.prototype.resetRolesAct = function() {
        for (var i in this.battle_roles) {
            var r = this.battle_roles[i];
            r.Acted = 0;
            r.Moved = 0;
            r.setPosition(r.data.X, r.data.Y);
        };

    };


    c.BattleScene.prototype.actCmdReset = function(r) {
        if (r.Acted) {
            this.battle_roles.shift();
            this.battle_roles.push(r);
            this.poisonEffect(r);
        }
        this.act_cmd = '';


    };
    c.BattleScene.prototype.getTeamMateCount = function(team) {
        var count = 0;
        for (var i in this.battle_roles) {
            var r = this.battle_roles[i];
            if (r.Team == team) {
                count++;
            }
        }
        return count;
    }
    c.BattleScene.prototype.checkResult = function() {
        var team0 = this.getTeamMateCount(0);
        if (team0 == this.battle_roles.length) {
            return 0;
        }
        if (team0 == 0) {
            return 1;
        }
        return -1;

    };
    c.BattleScene.prototype.eventAllCustom = function() {
        this.head_self.state_ = this.head_self.state.Pass;
        if (this.battle_cursor.isRunning()) {
            return;
        }
        if (!this.battle_roles) {
            return;
        }
        var r = this.battle_roles[0];
        this.battle_menu.visible = false;
        if (this.queue.length) {
            var q = this.queue[0];
            if (!q.r) {
                q.r = 1;
                q.target.visible = 1;
                q.func();
            }
            else {
                q.func();

                if (!q.target.visible) {
                    this.queue.splice(0, 1);
                }

            }
            return;
        };
        if (this.act_cmd == 'move' && this.fupdate) {

            if (this.act_move_arr.length) {
                var p = this.act_move_arr.shift();
                r.FaceTowards = this.calTowards(r.data.X, r.data.Y, p.x, p.y);
                r.setPosition(p.x, p.y);
            }
            else {
                this.actCmdReset(r);
                r.Moved = 1;
            }

        }
        if (this.item_menu.cmd == 'drug') {
            if (this.item_menu.selected) {
                this.actUseDragRet(r, this.item_menu.selected);
            }
            return;
        }
        if (this.item_menu.cmd == 'hiddenweapon') {

            if (this.item_menu.selected) {
                this.calSelectLayer(r, 1, this.calActionStep(r.data.HiddenWeapon));
                this.battle_cursor.mode_ = this.battle_cursor.mode.Action;
                this.battle_cursor.cmd = 'hiddenweapon';
                this.battle_cursor.item = this.item_menu.selected;
                this.battle_cursor.setRoleAndMagic(r);
                var selected = this.battle_cursor.run();
                if (selected < 0) {
                }
                else {
                    this.actHiddenWeaponRet(r, this.item_menu.selected);
                    return;
                }
            }
            return;
        }



        if (this.act_cmd != '') {
            return;
        }
        if (r.Acted != 0) {
            r = this.battle_roles[0];
            this.resetRolesAct();
            r = this.battle_roles[0];
        }

        this.man_x = r.data.X;
        this.man_y = r.data.Y;
        this.select_x = r.data.X;
        this.select_y = r.data.Y;


        if (!this.team_menu.visible) {
            var found_dead = this.clearDead(r);
            if (found_dead) {
                return;
            }
            var battle_result = this.checkResult();
            if (battle_result >= 0) {
                this.bg.visible = true;
                this.result = battle_result;
                if (this.result == 0 || this.result == 1 && this.fail_exp) {
                    this.calExpGot();
                }
                var f = function() {this.stop();this.j.subscene.start(this.j.subscene.towards);};
                this.queue.push({'target' : this, 'func' : f.bind(this), 'r' : 0});
                return;
            }
        }

        if (!this.team_menu.visible) {
            this.head_self.setRole(r);
            this.action(r);
        }
        this.j.viewui.eventAllCustom();
        if (this.act_cmd == '') {
            this.actCmdReset(r);
        }
    };
    c.BattleScene.prototype.drawAllCustom = function() {
        this.j.gevent.run();
        this.j.viewui.drawAllCustom();
    };
    c.BattleScene.prototype.draw = function() {
        if (!this.fixed_update) {
            this.requestid = requestAnimationFrame(this.draw.bind(this));
            this.fupdate = this.current_frame % g.frame_rate == 0;
        }
        else {
            var timeNow = (new Date()).getTime();
            var timeDiff = timeNow - this.g_Time;
            if (timeDiff < 2)
                return;
            this.g_Time = timeNow;
            this.requestid = requestAnimationFrame(this.draw.bind(this));
        }
        if (this.debug) {
            g.stats.begin();
        }
        var r0 = this.battle_roles[0];
        this.eventAllCustom();
        this.tex_key = 0;
        this.tex_index = 0;
        if (this.txt) {
            for (var k in this.txt) {
                this.txt[k].visible = false;
            }
        }

        if (g.mainmap_tex) {
            for (var k in g.mainmap_tex) {
                g.mainmap_tex[k].visible = false;
            }
        }

        this.width_region = parseInt(this.j.centerx / 18 / 2 + 3);
        this.sum_region = parseInt(this.j.centery / 9 + 2);
        for (var sum = -this.sum_region; sum <= (this.sum_region + 15); sum++) {
            for (var i = -this.width_region; i <= this.width_region; i++) {
                var ix = Math.round(this.man_x + i + (sum / 2));
                var iy = Math.trunc(this.man_y - i + (sum - sum / 2));
                var p = this.getPositionOnRender(ix, iy, this.man_x, this.man_y);
                // p.x += this.x;
                // p.y += this.y;
                if (this.isOutLine(ix, iy)) {
                    continue;
                }

                if (p.x < - this.margin  || p.x > this.j.win_width + this.margin  || p.y < - this.margin  || p.y > this.j.win_height + this.margin ) {
                    continue;
                }
                var color = g.utils.rgbToHex(255, 255, 255);
                if (this.battle_cursor.isRunning() && !r0.isAuto()) {
                    if (g.utils.getData(this.select_layer, ix, iy, 64) < 0) {
                        color = g.utils.rgbToHex(64, 64, 64);
                    }
                    else {
                        color = g.utils.rgbToHex(128, 128, 128);
                    }
                    if (this.battle_cursor.mode_ == this.battle_cursor.mode.Action) {
                        if (this.haveEffect(ix, iy)) {
                            if (this.haveEffect(ix, iy)) {
                                if (!this.canSelect(ix, iy)) {
                                    color = g.utils.rgbToHex(160, 160, 160);
                                }
                                else {
                                    color = g.utils.rgbToHex(192, 192, 192);
                                }
                            }
                        }
                    }
                    if (ix == this.select_x && iy == this.select_y) {
                        color = g.utils.rgbToHex(255, 255, 255);
                    }
                }


                this.j.tm.render(this.earth_layer, 'smap', ix, iy, p.x, p.y, this.tex_key++, null, 64, true, color);
            }
        }

        this.width_region = parseInt(this.j.centerx / 18 / 2 + 3);
        this.sum_region = parseInt(this.j.centery / 9 + 2);

        if (this.act_cmd == 'magic' || this.act_cmd == 'poison' || this.act_cmd == 'detoxificaton' || this.act_cmd == 'medcine' || this.act_cmd == 'hiddenweapon') {
            if (!this.act_action_frame.length && this.act_magic_arr.length) {
                var eff_item = this.act_magic_arr[0];
                if (this.eff_num == '') {
                    this.eff_num = eff_item.frame;// + g.utils.rand(10) - g.utils.rand(10);
                }
                if (this.fupdate) {
                    eff_item = this.act_magic_arr.shift();
                    this.eff_num = eff_item.frame;// + g.utils.rand(10) - g.utils.rand(10);
                }
            }
        }


        for (var sum = -this.sum_region; sum <= (this.sum_region + 15); sum++) {
            for (var i = -this.width_region; i <= this.width_region; i++) {
                var ix = Math.round(this.man_x + i + (sum / 2));
                var iy = Math.trunc(this.man_y - i + (sum - sum / 2));
                var p = this.getPositionOnRender(ix, iy, this.man_x, this.man_y);
                // p.x += this.x;
                // p.y += this.y;
                if (this.isOutLine(ix, iy)) {
                    continue;
                }

                if (p.x < - this.margin  || p.x > this.j.win_width + this.margin  || p.y < - this.margin  || p.y > this.j.win_height + this.margin ) {
                    continue;
                }
                this.j.tm.render(this.building_layer, 'smap', ix, iy, p.x, p.y, this.tex_key++, null, 64, true, color, 1);
                var r = g.utils.getData (this.role_layer, ix, iy, 64);
                var pic;
                if (r) {
                    var res_type = 'fight' + g.utils.zpad(r.data.HeadID, 3);

                    if (r.data.ID == this.action_role) {
                        if (this.act_action_frame.length) {
                            this.act_frame = this.act_action_frame[0];
                            if (this.fupdate) {
                                this.act_frame = this.act_action_frame.shift();
                            }
                        }
                        pic = this.calRolePic(r, this.action_type, this.act_frame);
                    }
                    else {
                        pic = this.calRolePic(r);
                    }
                    var alpha = 255;
                    if (r.data.HP <= 0 || r.dead_alpha <= 0) {
                        alpha = r.dead_alpha;
                    }
                    this.j.tm.render(pic, res_type, ix, iy, p.x, p.y, this.tex_key++, null, null, null, null, alpha / 255);
                }
                if (this.act_cmd == 'magic' || this.act_cmd == 'poison' || this.act_cmd == 'detoxificaton' || this.act_cmd == 'medcine' || this.act_cmd == 'hiddenweapon') {
                    if (!this.act_action_frame.length && this.act_magic_arr.length) {
                        if (eff_item && this.act_magic_arr[0].effect_id >= 0 && this.haveEffect(ix, iy)) {
                            var res_type = 'eft' + g.utils.zpad(eff_item.effect_id, 3);
                            var tx = p.x + eff_item.x;
                            var ty = p.y + eff_item.y;
                            this.j.tm.render(Math.abs(this.eff_num), res_type, ix, iy, tx, ty, this.tex_key++, null);
                        }
                    }
                }
            }
        }
        if (this.act_cmd == 'magic' || this.act_cmd == 'poison' || this.act_cmd == 'detoxificaton' || this.act_cmd == 'medcine' || this.act_cmd == 'hiddenweapon') {
            if (!this.act_magic_arr.length && this.act_magic_num.length) {
                for (var i in this.act_magic_num[0]) {
                    var magic_num = this.act_magic_num[0][i];
                    this.j.tm.rendertxt(magic_num.num, 24, magic_num.x, magic_num.y, magic_num.color, 0, this);
                }
                if (this.fupdate) {
                    this.act_magic_num.shift();
                }
            }
            else if (!this.act_magic_arr.length) {
                this.actCmdReset(r0);
                this.magic_name.visible = false;
                this.eff_num = '';
                this.action_type = -1;
                this.action_role = '';
                this.act_frame = '';
            }
        }
        if (this.act_cmd == 'drug') {
            if (!this.df.visible) {
                this.actCmdReset(r0);
            }
        }


        this.drawAllCustom();
        this.current_frame++;
        if (this.current_frame == 10000) {
            this.current_frame = 0;
        }
        if (this.debug) {
            g.stats.end();
        }
    };


    c.BattleScene.prototype.calRolePic = function(r, style, frame) {

        if (style == undefined || r.FightFrame[style] <= 0) {
            style = -1;
        }
        if (style == -1) {
            for (var i = 0; i < 5; i++) {
                if (r.FightFrame[i] > 0) {
                    return r.FightFrame[i] * r.FaceTowards;
                }
            }
        }
        else {
            var total = 0;
            for (var i = 0; i < 5; i++) {
                if (i == style) {
                    return total + r.FightFrame[style] * r.FaceTowards + frame;
                }
                total += r.FightFrame[i] * 4;
            }
        }
        return r.FaceTowards;
    };
    c.BattleScene.prototype.setID = function(id) {
        this.battle_id = id;
        this.info = this.j.battlemap.getBattleInfo(id);
        this.earth_layer = this.j.battlemap.copyLayerData(this.info.BattleFieldID, 0);
        this.building_layer = this.j.battlemap.copyLayerData(this.info.BattleFieldID, 1);
        g.utils.setAll(this.select_layer, -1, 64);
        g.utils.setAll(this.effect_layer, -1, 64);

    };


    c.BattleScene.prototype.calSelectLayerByMagic = function(x, y, team, magic, level_index) {
        if (magic.data.AttackAreaType == 0 || magic.data.AttackAreaType == 3) {
            this.calSelectLayer2(x, y, team, 1, magic.data.SelectDistance[level_index]);
        }
        else if (magic.data.AttackAreaType == 1) {
            this.calSelectLayer2(x, y, team, 3, magic.data.SelectDistance[level_index]);
        }
        else {
            this.calSelectLayer2(x, y, team, 4);
        }

    };

    c.BattleScene.prototype.calDistance = function(x1, y1, x2, y2) {
        return Math.abs(x1 - x2) + Math.abs(y1 - y2);
    };
    c.BattleScene.prototype.isNearEnemy = function(team, x, y) {
        for (var i in this.battle_roles) {
            var r1 = this.battle_roles[i];
            if (team != r1.Team && this.calDistance(r1.data.X, r1.data.Y, x, y) <= 1) {
                return true;
            }
        }
        return false;
    };
    c.BattleScene.prototype.isRole = function(x, y) {
        return g.utils.getData(this.role_layer, x, y, 64);
    };
    c.BattleScene.prototype.isWater = function(x, y) {
        var num = g.utils.getData(this.earth_layer, x, y, 64) / 2;
        if (num >= 179 && num <= 181 || num == 261 || num == 511 || num >= 622 && num <= 665 || num == 674) {
            return true;
        }
        return false;
    };
    c.BattleScene.prototype.isBuilding = function(x, y) {
        return g.utils.getData(this.building_layer, x, y, 64) > 0;

    };
    c.BattleScene.prototype.canWalk = function(x, y) {
        if (this.isOutLine(x, y) || this.isBuilding(x, y) || this.isWater(x, y) ||this.isRole(x, y)) {
            return false
        }
        return true;
    };

    c.BattleScene.prototype.calSelectLayer2 = function(x, y, team, mode, step) {

        if (mode == 0) {
            g.utils.setAll(this.select_layer, -1, 64);
            var cal_stack = [];
            g.utils.setData(this.select_layer, x, y, 64, step);
            cal_stack.push({"x" : x, "y" : y});
            var that = this;
            var count = 0;
            var check_next = function(p1) {
                if ((g.utils.getData(that.select_layer, p1.x, p1.y, that.coord_count) == -1) && that.canWalk(p1.x, p1.y)) {
                    g.utils.setData(that.select_layer, p1.x, p1.y, 64, step - 1);
                    cal_stack_next.push(p1);
                    count++;
                }
            };

            while (step >= 0) {
                var cal_stack_next = [];
                for (var i in cal_stack) {
                    var p = cal_stack[i];
                    if (!this.isNearEnemy(team, p.x, p.y) || (p.x == x && p.y == y)) {
                        check_next({"x" : p.x - 1, "y" : p.y});
                        check_next({"x" : p.x + 1, "y" : p.y});
                        check_next({"x" : p.x, "y" : p.y - 1});
                        check_next({"x" : p.x, "y" : p.y + 1});
                    }
                    if (count >= this.coord_count * this.coord_count) {
                        break;
                    }
                }
                if (cal_stack_next.length == 0) {
                    break;
                }
                cal_stack = cal_stack_next;
                step--;
            }
        }
        else if (mode == 1) {
            for (var ix = 0; ix < this.coord_count; ix++) {
                for ( var iy = 0; iy < this.coord_count; iy++) {
                    if (ix == 26 && iy == 24) {

                    }
                    g.utils.setData(this.select_layer, ix, iy, 64, step - this.calDistance(ix, iy, x, y));
                }
            }
        }
        else if (mode == 2) {
            g.utils.setAll(this.select_layer, 0, 64);
        }
        else if (mode == 3) {
            for (var ix = 0; ix < this.coord_count; ix++) {
                for (var iy = 0; iy < this.coord_count; iy++) {
                    var dx = Math.abs(ix - x);
                    var dy = Math.abs(iy - y);
                    if (dx == 0 && dy <= step || dy == 0 && dx <= step) {
                        g.utils.setData(this.select_layer, ix, iy, 64, 0);
                    }
                    else {
                        g.utils.setData(this.select_layer, ix, iy, 64, -1);
                    }
                }
            }
            g.utils.setData(this.select_layer, x, y, 64, -1);
        }
        else {
            g.utils.setAll(this.select_layer, -1, 64);
            g.utils.setData(this.select_layer, x, y, 64, 0);
        }
    };
    c.BattleScene.prototype.calSelectLayer = function(r, mode, step) {
        this.calSelectLayer2(r.data.X, r.data.Y, r.Team, mode, step);
    };
    c.BattleScene.prototype.calMoveStep = function(r) {
        if (r.Moved) {
            return 0;
        }
        var speed = r.data.Speed;
        if (r.data.Equip0 >= 0) {
            var i = this.j.save.getItem(r.data.Equip0);
            speed += i.data.AddSpeed;
        }
        if (r.data.Equip1 >= 0) {
            var i = this.j.save.getItem(r.data.Equip1);
            speed += i.data.AddSpeed;
        }
        return speed / 15 + 1;

    };

    c.BattleScene.prototype.calExpGot = function() {

        this.head_self.visible = false;
        var alive_teammate = [];
        if (this.result == 0) {
            for (var i in this.battle_roles) {
                if (this.battle_roles[i].Team == 0) {
                    alive_teammate.push(this.battle_roles[i]);
                }
            }
        }
        else {
            alive_teammate = this.friends;
        }
        if (!alive_teammate.length) {
            return;
        }
        for (var i in alive_teammate) {
            alive_teammate[i].ExpGot += parseInt(this.info.Exp / alive_teammate.length);
        }

        this.show_exp.setRoles(alive_teammate);
        var f = function() {};
        this.queue.push({'target' : this.show_exp, 'func' : f, 'r' : 0});

        for (var i in alive_teammate) {
            var r = alive_teammate[i];
            var r0 = Object.assign( Object.create( Object.getPrototypeOf(r)), r);
            r0.data = Object.assign( Object.create( Object.getPrototypeOf(r.data)), r.data);
            var item = this.j.save.getItem(r.data.PracticeItem);
            if (r.data.Level >= this.j.op.MaxLevel) {
                r.data.ExpForItem += r.ExpGot;
            }
            else if (item) {
                r.data.Exp += r.ExpGot / 2;
                r.data.ExpForItem += r.ExpGot / 2;
            }
            else {
                r.data.Exp += r.ExpGot;
            }
            if (r.data.Exp < r0.data.Exp) {
                r.data.Exp = this.j.op.MaxExp;
            }
            if (r.data.ExpForItem < r0.data.ExpForItem) {
                r.data.ExpForItem = this.j.op.MaxExp;
            }
            var change = 0;
            while (this.j.gameutil.canLevelUp(r)) {
                this.j.gameutil.levelUp(r);
                change++;
            }
            if (change) {
                var f = function(r0, r) {
                    this.df.setTwinRole(r0, r);
                    this.df.auto = false;
                    this.df.show_head = true;
                    this.df.setText('升級');
                }
                this.queue.push({'target' : this.df, 'func' : f.bind(this, r0, r), 'r' : 0});
            }
            if (item) {
                // var r0 = Object.assign( Object.create( Object.getPrototypeOf(r)), r);
                // r0.data = Object.assign( Object.create( Object.getPrototypeOf(r.data)), r.data);
                var r0 = g.utils.dataclone(r);

                change = 0;

                while (this.j.gameutil.canFinishedItem(r)) {
                    this.j.gameutil.useItem(r, item);
                    change++;
                }
                if (change) {
                    var f = function(r0, r, item) {
                        this.df.setTwinRole(r0, r);
                        this.df.auto = false;
                        this.df.show_head = true;
                        this.df.setText(sprintf("修煉%s成功", g.utils.strim(item.data.Name)));
                    }
                    this.queue.push({'target' : this.df, 'func' : f.bind(this, r0, r, item), 'r' : 0});
                }
            }
        }


    };
    c.BattleMap = function (j) {
        this.j = j;
        Object.assign(this, {
            battle_infos : [],
            battle_field_data2 :[],
        });
    };




    c.BattleMap.prototype.copyLayerData = function(battle_field_id, layer) {
        var layer_data = this.battle_field_data2[battle_field_id];
        return layer_data[layer];
    };



    c.BattleMap.prototype.getBattleInfo = function(i) {
        if (i < 0 || i >= this.battle_infos.length) {
            return null;
        }
        return this.battle_infos[i];

    };


    c.BattleMap.prototype.init = function(resources) {
        this.wardata = resources['war'].data;


        var offset = [0];
        var length_arr = [];

        var teammate_count = this.j.type.teammate_count;
        var battle_enemy_count = this.j.type.battle_enemy_count;
        var jbinary_type = {
            'jBinary.all': 'name',
            'jBinary.littleEndian': true,
            'battleInfo' : {
                ID: 'int16',
                Name: ['string', 10, 'big5'],
                BattleFieldID: 'int16',
                Exp: 'int16',
                Music: 'int16',
                TeamMate: ['array', 'int16', teammate_count],
                AutoTeamMate: ['array', 'int16', teammate_count],
                TeamMateX: ['array', 'int16', teammate_count],
                TeamMateY: ['array', 'int16', teammate_count],
                Enemy: ['array', 'int16', battle_enemy_count],
                EnemyX: ['array', 'int16', battle_enemy_count],
                EnemyY: ['array', 'int16', battle_enemy_count]
            },
            'name': this.j.type.schema.battleInfoList
        };
        var dataview = new jDataView(this.wardata, undefined, undefined, true);
        var jdata = new jBinary(dataview, jbinary_type);
        this.battle_infos = jdata.readAll().Items;

        g.utils.getIdxContent(resources['waridx'].data, offset, length_arr);
        var wargrp_data = new Int16Array(resources['wargrp'].data);
        var s = 0;
        var o = 0;
        for (var i = 0; i < offset.length; i++) {
            s = o;
            var loop_index = 0;
            this.battle_field_data2[i] = [];




            while(loop_index < this.j.type.battle_save_layer_count) {
                this.battle_field_data2[i][loop_index] = [];
                this.battle_field_data2[i][loop_index] = wargrp_data.slice(s, s + 4096);
                s += 4096;
                loop_index++;
            }
            o += length_arr[i] / 4 + length_arr[i] / 4;


        }



    };
    c.BattleMap.constructor = c.BattleMap;


})(PIXI, g, c, window);
