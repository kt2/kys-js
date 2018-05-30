(function (PIXI, g, c, window) {
    'use strict';
    c.BattleItemMenu = function (j) {
        this.j = j;
        Object.assign(this, {
            select_user : true,
            current_item : null,
            role : null,
            cmd : '',
            force_item_type : -1,
            role_taking_item_count : 4,
        });
        c.UIItem.call(this, j);
        this.visible = false;
    };
    c.BattleItemMenu.prototype = Object.create(c.UIItem.prototype);
    c.BattleItemMenu.constructor = c.BattleItemMenu;

    c.BattleItemMenu.prototype.setRole = function(r) {
        this.role = r;

        if (this.role.isAuto()) {
            this.selected = this.role.AI_Item;
        }
        else {
            this.visible = true;
        }

    };
    c.BattleItemMenu.prototype.getItemDetailType = function(item) {
        if (item == null) {
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
            var m = this.j.save.getMagic (item.MagicID);
            if (m) {
                if (m.HurtType == 0) {
                    return m.MagicType + 3;
                }
            }
            return 8;
        }
        return 0;
    };


    c.BattleItemMenu.prototype.getAvailableItems = function(role, type) {
        var item_menu = new c.BattleItemMenu(this.j);
        item_menu.setRole(role);
        item_menu.force_item_type = type;
        var items = item_menu.getAvailableItems2();
        return items;
    };
    c.BattleItemMenu.prototype.getAvailableItems2 = function() {
        if (this.role.Team == 0) {
            this.getItemsByType(this.force_item_type);
        }
        else {
            this.available_items = [];
            for (var i = 0; i < this.role_taking_item_count; i++) {
                var item = this.j.save.getItem(this.role.data.TakingItem[i]);
                if (item && this.getItemDetailType(item.data) == this.force_item_type) {
                    this.available_items.push(item);
                }
            }
        }
        return this.available_items;
    };
    c.BattleItemMenu.prototype.addItem = function(item, count) {
        if (this.role.Team == 0) {
            this.j.gevent.addItemWithoutHint(item.data.ID, count);
        }
        else {
            this.j.gevent.roleAddItem(this.role.data.ID, item.data.ID, count);
        }

    };
    c.BattleItemMenu.prototype.setForceItemType = function(t) {
        for (var i in this.title.menu_items) {
            this.title.menu_items[i].visible = false;
        }
        this.title.menu_items[t].visible = true;
        this.title.selected = this.title.menu_items[t];
    };
    c.BattleItemMenu.prototype.setSelectUser = function(s) {
        this.select_user = s;
    };

    c.BattleItemMenu.prototype.onPressedCancel = function() {
        this.visible = false;
        this.j.battle.battle_menu.visible = true;
        this.cmd = '';
    };
    c.BattleItemMenu.prototype.onPressedOK = function() {
        this.selected = this.current_item;
        this.visible = false;
    };
    c.BattleItemMenu.prototype.draw = function() {
        if (!this.role) {
            return;
        }
        c.UIItem.prototype.draw.call(this);
        this.title.arrange(0, 50, 64, 0);
    };

    c.BattleMagicMenu = function (j) {
        this.j = j;
        Object.assign(this, {
            role : null,
            magic : null,
            visible : false
        });
        c.MenuText.call(this, j, []);
    };
    c.BattleMagicMenu.prototype = Object.create(c.MenuText.prototype);
    c.BattleMagicMenu.constructor = c.BattleMagicMenu;

    c.BattleMagicMenu.prototype.runAsRole = function(r) {
        this.setRole(r);
        this.run();
    }
    c.BattleMagicMenu.prototype.onPressedCancel = function() {
        this.visible = false;
        this.j.battle.battle_menu.visible = true;
    };

    c.BattleMagicMenu.prototype.getResult = function(r) {
        var i = this.menu_items.indexOf(this.selected);
        this.result = i;
        this.magic = this.j.save.getRoleLearnedMagic2(this.role.data, i);
        this.role.SelectedMagic = this.result;
        this.j.battle.setMagicCursor(this.role);
        this.j.battle.battle_cursor.visible = true;
        this.visible = false;
    };
    c.BattleMagicMenu.prototype.getMagic = function() {
        return this.magic;
    };
    c.BattleMagicMenu.prototype.isRunning = function() {
        return this.visible;
    };
    c.BattleMagicMenu.prototype.run = function() {
        if (!this.role) {
            return;
        }
        if (this.role.isAuto()) {
            this.magic = this.role.AI_Magic;
            this.result = 0;
        }
        else {
            this.visible = true;
            this.j.battle.battle_menu.visible = false;
        }
    };
    c.BattleMagicMenu.prototype.setRole = function(r) {
        this.role = r;
        this.result = -1;
        this.magic = null;
        this.magic_names = [];
        for (var i = 0; i < 10; i++) {
            var m = this.j.save.getRoleLearnedMagic(this.role.data, i);
            if (m) {
                this.magic_names.push(g.utils.strim(m.Name) + ' ' + this.role.getRoleShowLearnedMagicLevel(i));
            }
            else {
                this.magic_names.push("");
            }
        }
        this.setStrings(this.magic_names);
        this.position.set(160, 200);
        for (var i in this.menu_items) {
            var child = this.menu_items[i];
            var w = child.width;
            var h = child.height;
            if (w <= 1) {
                child.visible = false;
            }
        }
        this.arrange(0, 0, 0, 30);
    };

    c.BattleMenu = function (j) {
        this.j = j;
        Object.assign(this, {
            friends : [],
            enemies : [],
            max_step : 64,
            visible : false,
            battlemap_coord_count : 64
        });
        c.MenuText.call(this, j, [ "移動", "武學", "用毒", "解毒", "醫療", "暗器", "藥品", "等待", "狀態", "自動", "結束" ]);
        this.distance_layer = {}
    };
    c.BattleMenu.prototype = Object.create(c.MenuText.prototype);
    c.BattleMenu.constructor = c.BattleMenu;

    c.BattleMenu.prototype.setRole = function(r) {
        this.role = r;
        for (var i in this.childs_text) {
            this.childs_text[i].visible = true;
        };
        for (var i = 0; i < this.childs_text.length; i++) {
            this.childs_text[i].visible = true;
            this.childs_text[i].state_ = this.childs_text[i].state.Normal;
        };
        if (r.Moved || r.data.PhysicalPower < 10) {
            this.childs_text["移動"].visible = false;
        }
        if (r.getLearnedMagicCount(r) <= 0 || r.data.PhysicalPower < 20) {
            this.childs_text["武學"].visible = false;
        }
        if (r.data.UsePoison <= 0 || r.data.PhysicalPower < 30) {
            this.childs_text["用毒"].visible = false;
        }
        if (r.data.Detoxification <= 0 || r.data.PhysicalPower < 30) {
            this.childs_text["解毒"].visible = false;
        }
        if (r.data.Medcine <= 0 || r.data.PhysicalPower < 10) {
            this.childs_text["醫療"].visible = false;
        }
        if (r.data.HiddenWeapon <= 15 || r.data.PhysicalPower < 10) {
            this.childs_text["暗器"].visible = false;
        }
        this.childs_text["等待"].visible = false;

        this.setFontSize(20);
        this.arrange(0, 0, 0, 28);
        if (!r.Moved) {
            r.AI_Action = -1;
        }
    };

    c.BattleMenu.prototype.Aiaction = function(aa) {
        Object.assign(aa, {
            Action : null,
            point : 0,
            MoveX : null,
            MoveY : null,
            magic : null,
            item : null
        });
    };

    c.BattleMenu.prototype.calAIActionNearest = function(r2, aa, r_temp) {
        this.getNearestPosition(r2.data.X, r2.data.Y, aa);
        aa.ActionX = r2.data.X;
        aa.ActionY = r2.data.Y;
        if (r_temp) {
            r_temp.x = aa.MoveX;
            r_temp.y = aa.MoveY;
        }

    };

    c.BattleMenu.prototype.calDistanceLayer = function(x, y) {
        var max_step = 64;
        g.utils.setAll(this.distance_layer, max_step + 1, 64);
        var cal_stack = [];
        g.utils.setData(this.distance_layer, x, y, 64, 0);
        cal_stack.push({"x" : x, "y" : y});
        var count = 0;
        var step = 0;
        var that = this;
        var check_next = function(p1) {
            if (g.utils.getData(that.distance_layer, p1.x, p1.y, 64) == max_step + 1 && that.j.battle.canWalk(p1.x, p1.y)) {
                g.utils.setData(that.distance_layer, p1.x, p1.y, 64, step + 1);
                cal_stack_next.push(p1);
                count++;
            }
        };
        while (step <= 64) {
            var cal_stack_next = [];
            for (var i in cal_stack) {
                var p = cal_stack[i];
                g.utils.setData(this.distance_layer, p.x, p.y, 64, step);
                check_next({"x" : p.x - 1, "y" : p.y});
                check_next({"x" : p.x + 1, "y" : p.y});
                check_next({"x" : p.x, "y" : p.y - 1});
                check_next({"x" : p.x, "y" : p.y + 1});
                if (count >= 64 * 64) {
                    break;
                }
            }
            if (cal_stack_next.length == 0)  {
                break;
            }
            cal_stack = cal_stack_next;
            step++;
        }
    };

    c.BattleMenu.prototype.getNearestRole = function(role, roles) {
        var min_dis = 4096;
        var r2 = null;

        for (var r in roles) {
            var cur_dis = this.j.battle.calRoleDistance(role, roles[r]);
            if (cur_dis < min_dis) {
                r2 = roles[r];
                min_dis = cur_dis;
            }
        }
        return r2;
    };

    c.BattleMenu.prototype.getFarthestToAll = function(role, roles, aa) {
        var max_dis = 0;
        for (var ix = 0; ix < this.battlemap_coord_count; ix++) {
            for (var iy = 0; iy < this.battlemap_coord_count; iy++) {
                if (this.j.battle.canSelect(ix, iy)) {
                    var cur_dis = Math.random();
                    for (var i in roles) {
                        var r2 = roles[i];
                        cur_dis += this.j.battle.calDistance(ix, iy, r2.data.X, r2.data.Y);
                    }
                    if (cur_dis > max_dis) {
                        max_dis = cur_dis;
                        aa.MoveX = ix;
                        aa.MoveY = iy;
                    }
                }
            }
        }

    };
    c.BattleMenu.prototype.getNearestPosition = function(x0, y0, aa) {

        this.calDistanceLayer(x0, y0);
        var min_dis = 64 * 64;
        for (var ix = 0; ix < 64; ix++) {
            for (var iy = 0; iy < 64; iy++) {
                if (this.j.battle.canSelect(ix, iy)) {

                    var cur_dis = g.utils.getData(this.distance_layer, ix, iy, 64);
                    if (cur_dis < min_dis) {
                        min_dis = cur_dis;
                        aa.MoveX = ix;
                        aa.MoveY = iy;
                    }
                }
            }
        }
    };
    c.BattleMenu.prototype.calNeedActionDistance = function(aa) {
        return this.j.battle.calDistance(aa.MoveX, aa.MoveY, aa.ActionX, aa.ActionY);
    };


    c.BattleMenu.prototype.autoSelect = function(r) {
        var that = this;
        this.friends = [];
        this.enemies = [];
        this.j.battle.battle_roles.forEach (function(i) {
            if (i.Team == r.Team) {
                that.friends.push(i);
            }
            else {
                that.enemies.push(i);
            }
        });
        this.ai_actions = [];
        if (r.AI_Action == -1) {
            var role_temp = Object.assign( Object.create( Object.getPrototypeOf(r)), r);
            role_temp.data = Object.assign( Object.create( Object.getPrototypeOf(r.data)), r.data);
            r.AI_Action = this.getResultFromString("結束");
            r.AI_MoveX = r.data.X;
            r.AI_MoveY = r.data.Y;
            r.AI_ActionX = r.data.X;
            r.AI_ActionY = r.data.Y;
            r.AI_Magic = null;
            r.AI_Item = null;

            if (this.friends && this.enemies) {
                this.j.battle.calSelectLayer(r, 0, this.j.battle.calMoveStep(r));

                var action_text = "藥品";
                if (this.childs_text[action_text].visible &&
                    (r.data.HP < 0.2 * r.data.MaxHP || r.data.MP < 0.2 * r.data.MaxMP || r.data.PhysicalPower < 0.2 * this.j.op.MaxPhysicalPower)) {
                    var aa = {};
                    this.Aiaction(aa);
                    aa.Action = this.getResultFromString(action_text);
                    var items = this.j.battle.item_menu.getAvailableItems(r, 2);
                    for (var i in items) {
                        var item = items[i];
                        aa.point = 0;
                        if (item.data.AddHP > 0) {
                            aa.point += Math.min(item.data.AddHP, r.data.MaxHP - r.data.HP) - item.data.AddHP / 10;
                        }
                        if (item.data.AddHP > 0) {
                            aa.point += Math.min(item.data.AddMP, r.data.MaxMP - r.data.MP) / 2 - item.data.AddMP / 10;
                        }
                        else if (item.data.AddPhyscalPower > 0) {
                            aa.point += Math.min(item.data.AddPhysicalPower, this.j.op.MaxPhysicalPower - r.data.PhysicalPower) - item.data.AddPhysicalPower / 10;
                        }
                        if (aa.point > 0) {
                            var itemclone = Object.assign( Object.create( Object.getPrototypeOf(item)), item);
                            aa.item = itemclone;
                            aa.point *= 1.5;
                            this.getFarthestToAll(r, this.enemies, aa);
                            var aaclone = Object.assign( Object.create( Object.getPrototypeOf(aa)), aa);
                            this.ai_actions.push(aaclone);

                        }
                    }
                }

                if (r.data.Morality > 50) {
                    action_text = "解毒";
                    if (this.childs_text[action_text].visible) {
                        for (var i in this.friends) {
                            var r2 = this.friends[i];
                            if (r2.data.Poison > 50) {
                                var aa = {};
                                this.Aiaction(aa);
                                this.calAIActionNearest(r2, aa);
                                var action_dis = this.j.battle.calActionStep(r.data.Detoxification);
                                if (action_dis >= this.calNeedActionDistance(aa)) {
                                    aa.Action = this.getResultFromString(action_text);
                                    aa.point = r2.data.Poison;
                                    var aaclone = Object.assign( Object.create( Object.getPrototypeOf(aa)), aa);
                                    this.ai_actions.push(aaclone);
                                }
                            }
                        }
                    }
                    action_text = "醫療";
                    if (this.childs_text[action_text].visible) {
                        for (var i in this.friends) {
                            var r2 = this.friends[i];
                            if (r2.data.HP < 0.2 * r2.data.MaxHP) {
                                var aa = {};
                                this.Aiaction(aa);
                                this.calAIActionNearest(r2, aa);
                                var action_dis = this.j.battle.calActionStep(r.data.Detoxification);
                                if (action_dis >= this.calNeedActionDistance(aa)) {
                                    aa.Action = this.getResultFromString(action_text);
                                    aa.point = r2.data.Medcine;
                                    var aaclone = Object.assign( Object.create( Object.getPrototypeOf(aa)), aa);
                                    this.ai_actions.push(aaclone);
                                }
                            }
                        }

                    }

                }
                else {
                    action_text = "用毒";
                    if (this.childs_text[action_text].visible) {
                        var r2 = this.getNearestRole(r, this.enemies);
                        var aa = {};
                        this.Aiaction(aa);
                        this.calAIActionNearest(r2, aa);
                        var action_dis = this.j.battle.calActionStep(r.data.UsePoison);
                        if (action_dis >= this.calNeedActionDistance(aa)) {
                            aa.Action = this.getResultFromString(action_text);
                            aa.point = Math.min(this.j.op.MaxPoison - r2.data.Poison, r.data.UsePoison) / 2;
                            if (r2.data.HP < 10) {
                                aa.point = 1;
                            }
                            var aaclone = Object.assign( Object.create( Object.getPrototypeOf(aa)), aa);
                            this.ai_actions.push(aaclone);
                        }
                    }
                }
                action_text = "暗器";
                if (this.childs_text[action_text].visible) {

                    var r2 = this.getNearestRole(r, this.enemies);
                    var aa = {};
                    this.Aiaction(aa);
                    this.calAIActionNearest(r2, aa, role_temp);
                    var action_dis = this.j.battle.calActionStep(r.data.HiddenWeapon);
                    if (action_dis >= this.calNeedActionDistance(aa)) {
                        var items = this.j.battle.item_menu.getAvailableItems(r, 3);
                        for (var i in items) {
                            aa.Action = this.getResultFromString(action_text);
                            var item = items[i];

                            aa.point = this.j.battle.calHiddenWeaponHurt(role_temp, r2, item);

                            if (aa.point > r2.data.HP) {
                                aa.point = r2.data.HP * 1.25;
                            }
                            aa.point *= 0.9;
                            var itemclone = Object.assign( Object.create( Object.getPrototypeOf(item)), item);
                            aa.item = itemclone;
                            var aaclone = Object.assign( Object.create( Object.getPrototypeOf(aa)), aa);
                            this.ai_actions.push(aaclone);
                        }
                    }
                }

                action_text = "武學";
                if (this.childs_text[action_text].visible) {
                    var aa = {};
                    this.Aiaction(aa);
                    aa.Action = this.getResultFromString(action_text);
                    var r2 = this.getNearestRole(r, this.enemies);

                    this.calAIActionNearest(r2, aa, role_temp);
                    for (var i = 0; i < this.j.type.role_magic_count; i++) {
                        var max_hurt = -1;
                        var magic = this.j.save.getRoleLearnedMagic2(r.data, i);
                        if (!magic) {
                            continue;
                        }
                        var level_index = r.getRoleMagicLevelIndex(i);
                        this.j.battle.calSelectLayerByMagic (aa.MoveX, aa.MoveY, r.Team, magic, level_index);
                        for (var ix = 0; ix < 64; ix++) {
                            for (var iy = 0; iy < 64; iy++) {
                                var total_hurt = 0;

                                if (this.j.battle.canSelect(ix, iy)) {
                                    this.j.battle.calEffectlayer(aa.MoveX, aa.MoveY, ix, iy, magic, level_index);

                                    total_hurt = this.j.battle.calMagiclHurtAllEnemies(role_temp, magic, true);
                                    if (total_hurt > max_hurt) {
                                        max_hurt = total_hurt;
                                        aa.magic = magic;
                                        aa.ActionX = ix;
                                        aa.ActionY = iy;
                                    }
                                    if (total_hurt > -1) {

                                    }
                                }
                            }
                        }
                        aa.point = max_hurt;
                        var aaclone = Object.assign( Object.create( Object.getPrototypeOf(aa)), aa);
                        this.ai_actions.push(aaclone);
                    }
                }
                var max_point = -1;
                for (var i in this.ai_actions) {
                    var aa = this.ai_actions[i];
                    if (aa.item) {
                    }
                    if (aa.magic) {
                    }

                    if (aa.point == 0) {
                        aa.Action = this.getResultFromString("結束");
                    }

                    var p = aa.point; //+ Math.random() * 10;
                    if (p >= max_point) {
                        max_point = p;
                        this.setAIActionToRole(aa, r);
                    }
                }
            }
        }

        if (!r.Moved) {
            return this.getResultFromString("移動");
        }
        else {
            return r.AI_Action;
        }
    };

    c.BattleMenu.prototype.getResult = function(r) {
        var i = this.menu_items.indexOf(this.selected);
        this.result = i;
    };
    c.BattleMenu.prototype.setAIActionToRole = function(aa, role) {
        role.AI_Action = aa.Action;
        role.AI_MoveX = aa.MoveX;
        role.AI_MoveY = aa.MoveY;
        role.AI_ActionX = aa.ActionX;
        role.AI_ActionY = aa.ActionY;
        role.AI_Magic = aa.magic;
        role.AI_Item = aa.item;
    };

    c.BattleMenu.prototype.draw = function() {
        c.MenuText.prototype.draw.call(this);

    };
    c.BattleMenu.prototype.isRunning = function() {
        return this.visible;
    };
    c.BattleMenu.prototype.runAsRole = function(r) {
        this.setRole(r);
        if (this.role.isAuto()) {
            var act = this.autoSelect(this.role);
            this.result = act;
            this.visible = false;
            this.menu_items[act].state_ = this.menu_items[act].state.Press;
        }
        else {
            this.visible = true;
        }
    };
})(PIXI, g, c, window);
