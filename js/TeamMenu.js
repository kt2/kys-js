(function (PIXI, g, c, window) {
    'use strict';

    c.TeamMenu = function (j) {
        this.j = j;
        Object.assign(this, {
            heads: [],
            mode: 0,
            item: null,
            result: -1,
        });
        c.Menu.call(this, j);
        this.bg = new PIXI.Graphics();
        this.bg.beginFill(0x000000, 0.3);
        this.bg.drawRect(0, 0, g.app.view.width, g.app.view.height);

        this.addChild(this.bg);

        for (var i = 0; i < this.j.type.teammate_count; i++) {
            var h = new c.Head(j);
            h.have_box = false;
            h.color_normal = 0xffffff;
            h.txt_allocate = false;
            h.visible = false;
            this.heads.push(h);
            h.position.set(parseInt(i % 2) * 250, parseInt(i / 2) * 100);
            this.addCustom(h);
        }
        for (var i = 0; i < this.j.type.teammate_count; i++) {
            var r = this.j.save.getTeamMate(i);
            if (r) {
                this.heads[i].setRole(r);
                this.heads[i].visible = true;
            }
        }
        this.button_all = new c.Button(j);
        this.button_all.setText("全選");
        this.button_ok = new c.Button(j);
        this.button_ok.setText("確定");
        this.button_all.position.set(50, 300);
        this.button_ok.position.set(150, 300);
        this.addCustom(this.button_all);
        this.addCustom(this.button_ok);
        this.position.set(200, 150);
        this.setTextPosition(20, -30);

        this.bg.position.set(-this.x, -this.y);

    };
    c.TeamMenu.prototype = Object.create(c.Menu.prototype);
    c.TeamMenu.constructor = c.TeamMenu;
    c.TeamMenu.prototype.getRole = function() {
        return this.role;
    };
    c.TeamMenu.prototype.getRoles = function() {
        var roles = [];

        for (var h in this.heads) {
            if (this.heads[h].result == 0 && this.heads[h].getRole()) {
                roles.push(this.heads[h].getRole());
            }
        }
        return this.j.battle.buildRoles(roles);

    };
    c.TeamMenu.prototype.onPressedCancel = function() {
        if (this.mode == 0) {
            this.visible = false;
        }
    };
    c.TeamMenu.prototype.onPressedOK = function() {
        if (this.mode == 0) {
            this.role = null;
            for (var k in this.heads) {
                var h = this.heads[k];
                if (h.state_ == h.state.Press) {
                    this.role = h.getRole();
                }
            }
            if (this.role) {
                h.result = 0;
                this.visible = false;
            }
            return true;
        }
        if (this.mode == 1) {
            for (var k in this.heads) {
                var h = this.heads[k];
                if (h.state_ == h.state.Press) {
                    if (h.result == -1) {
                        h.result = 0;
                    }
                    else {
                        h.result = -1;
                    }
                }
            }
            if (this.button_all.state_ == this.button_all.state.Press) {
                var all = -1;
                for (var k in this.heads) {
                    var h = this.heads[k];
                    if (h.result != 0) {
                        all = 0;
                        break;
                    }
                }
                for (var k in this.heads) {
                    var h = this.heads[k];
                    h.result = all;
                }
            }
            if (this.button_ok.state_ == this.button_ok.state.Press) {
                for (var k in this.heads) {
                    var h = this.heads[k];
                    if (h.result == 0) {
                        this.getRoles();
                        this.visible = false;
                        return;
                    }
                }
            }
        }
    };
    c.TeamMenu.prototype.beforeDraw = function() {
        for (var i = 0; i < this.j.type.teammate_count; i++) {
            var r = this.j.save.getTeamMate(i);
            if (r) {
                this.heads[i].setRole(r);
                this.heads[i].visible = true;
                if (this.mode == 0 && this.item) {
                    if (!this.j.gameutil.canUseItem(r, this.item)) {
                        this.heads[i].setText("不適合", 1);
                    }
                    if (r.data.PracticeItem == this.item.data.ID || r.data.Equip0 == this.item.data.ID || r.data.Equip1 == this.item.data.ID) {
                        this.heads[i].setText("使用中", 1);
                    }
                }
            }
            if (this.mode == 0) {
                this.button_all.visible = false;
                this.button_ok.visible = false;
            }
        }


        if (this.mode == 0) {
            if (this.item) {

                for (var k in this.heads) {

                    if (this.heads[k].state_ != this.heads[k].state.Normal && !this.j.gameutil.canUseItem(this.heads[k].getRole(), this.item)) {
                        this.heads[k].state_ = this.heads[k].state.Normal;
                    }
                }
            }
        }
        if (this.mode == 1) {
            for (var k in this.heads) {
                if (this.heads[k].result == 0) {
                    this.heads[k].setText("已選中", 1);
                }
                else {
                    this.heads[k].setText("", 1);
                }
            }
        }
    }


})(PIXI, g, c, window);
