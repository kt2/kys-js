(function (PIXI, g, c, window) {
    'use strict';

    c.BattleCursor = function (j) {
        this.j = j;
        PIXI.Container.call(this);
        Object.assign(this, {
            mode : {
                Other : -1,
                Move : 0,
                Action : 1,
                Check : 2
            },
            mode_ : null,
            cmd : '',
            role : null,
            item : null,
            magic : null,
            level_index : null,
            head_selected: null,
            ui_status: null,
        });
        this.head_selected = new c.Head(this.j);
        this.head_selected.visible = false;
        this.addCustom(this.head_selected);
        this.ui_status = new c.UIStatus(this.j);
        this.ui_status.visible = false;
        this.ui_status.show_button = false;
        this.ui_status.position.set(300, 0);
        this.addCustom(this.ui_status);
        this.visible = false;

    };
    c.BattleCursor.prototype = Object.create(PIXI.Container.prototype);
    c.BattleCursor.constructor = c.BattleCursor;

    c.BattleCursor.prototype.mouseMove = function(e) {
        var p = {x : null, y : null};
        if (this.magic && this.magic.AttackAreaType == 1) {
            var tw = this.battle.getTowardsByMouse();
            this.j.battle.getTowardsPosition2(this.role.data.X, this.role.data.Y, p);
        }
        else {
            var p = this.j.battle.getMousePosition(this.role.data.X, this.role.data.Y);
        }
        this.setCursor(p.x, p.y);
    };

    c.BattleCursor.prototype.keyDown = function(e) {
        if (!this.role.isAuto()) {
            var p = {x : null, y : null};
            var tw = this.j.battle.getTowardsByKey2(e.keyCode);
            if (this.magic && this.magic.data.AttackAreaType == 1) {
                this.j.battle.getTowardsPosition2 (this.role.data.X, this.role.data.Y, tw, p);
            }
            else {
                this.j.battle.getTowardsPosition2 (this.j.battle.select_x, this.j.battle.select_y, tw, p);
            }
        }
        this.setCursor(p.x, p.y);
    };

    c.BattleCursor.prototype.onPressedOK = function(e) {
        this.visible = false;
        //this.j.battle.battle_menu.visible = true;
        var act_cmd = this.cmd;
        if (act_cmd == 'hiddenweapon') {
            this.j.battle.actRet(act_cmd, this.role, this.item);
            this.item = null;
        }
        else {
            this.j.battle.actRet(act_cmd, this.role, this.magic);
        }
        this.head_selected.visible = false;
    };

    c.BattleCursor.prototype.onPressedCancel = function(e) {
        if (this.cmd == 'status') {
            this.j.battle.head_self.visible = true;
            this.head_selected.visible = true;
            this.ui_status.visible = false;
            this.j.battle.battle_menu.visible = true;
            this.visible = false;
        }
        else if (this.cmd == 'hiddenweapon') {
            this.j.battle.item_menu.selected = null;
            this.j.battle.item_menu.visible = true;
            this.visible = false;

        }
        else {
            this.j.battle.battle_menu.visible = true;
            this.visible = false;
        }
    };

    c.BattleCursor.prototype.run = function() {
        var w = this.j.win_width;
        var h = this.j.win_height;
        this.head_selected.position.set(w - 400, h - 150);
        this.j.battle.towards = this.role.FaceTowards;
        if (this.role.isAuto()) {
            var x = -1;
            var y = -1;
            if (this.mode_ == this.mode.Move) {
                x = this.role.AI_MoveX;
                y = this.role.AI_MoveY;
                this.result = 0;
            }
            else if (this.mode_ == this.mode.Action) {
                x = this.role.AI_ActionX;
                y = this.role.AI_ActionY;
                this.result = 0;
            }
            this.setCursor(x, y);
            return this.result;
        }
        this.j.battle.battle_menu.visible = false;
        this.visible = true;
        return -1;
    };

    c.BattleCursor.prototype.isRunning = function () {
        return this.visible;
    };

    c.BattleCursor.prototype.setCursor = function (x, y) {
        if (this.j.battle.canSelect(x, y)) {
            this.j.battle.setSelectPosition(x, y);
            if (this.ui_status.visible) {
                this.ui_status.setRole(g.utils.getData(this.j.battle.role_layer, x, y, 64));
                this.head_selected.visible = false;
            }
            else if (this.head_selected.visible) {
                this.head_selected.setRole(g.utils.getData(this.j.battle.role_layer, x, y, 64));
            }

        }
        if (this.mode_ == this.mode.Move) {

        }
        else if (this.mode_ == this.mode.Action) {
            this.j.battle.calEffectlayer2(this.role, this.j.battle.select_x, this.j.battle.select_y, this.magic, this.level_index);
        }
    };

    c.BattleCursor.prototype.setRoleAndMagic = function(r, m, l) {
        this.role = r;
        this.magic = m;
        this.level_index = l;
        this.head_selected.setRole(r);
        this.head_selected.visible = true;
    }
})(PIXI, g, c, window);
