(function (PIXI, g, c, window) {
    'use strict';
    c.ShowRoleDifference = function (j, r1, r2) {
        this.j = j;
        c.TextBox.call(this, j);
        Object.assign(this, {
            show_head : true,
            textboxes : [],
            is_running : false,
            step : 0,
            stayframe : 40
        });
        this.head1 = new c.Head(j);
        this.head2 = new c.Head(j);
        this.head1.skip_event = true;
        this.head2.skip_event = true;
        this.addCustom(this.head1);
        this.addCustom(this.head2);
        this.head2.position.set(400, 0);
        this.position.set(250, 180);
        this.text_x = 0;
        this.text_y = -30;
    };
    c.ShowRoleDifference.prototype = Object.create(c.TextBox.prototype);
    c.ShowRoleDifference.constructor = c.ShowRoleDifference;
    c.ShowRoleDifference.prototype.setTwinRole = function(r1, r2) {
        this.role1 = r1;
        this.role2 = r2;
    };
    c.ShowRoleDifference.prototype.onPressedOK = function(e) {

        this.exit();
    };
    c.ShowRoleDifference.prototype.onPressedCancel = function(e) {

        this.exit();
    };
    c.ShowRoleDifference.prototype.exit = function() {

        for (var i in this.textboxes) {
            this.removeCustom(this.textboxes[i]);
        }
        this.textboxes = [];
        this.is_running = false;
        this.visible = false;
        this.step = 0;

    };
    c.ShowRoleDifference.prototype.draw = function() {
        if (this.is_running) {
            this.step++;
            if (this.auto && this.step == this.stayframe) {
                this.exit();
            }
            return;
        }
        if (!this.role1 || !this.role2) {
            return;
        }
        this.is_running = true;
        this.step = 0;
        this.head1.setRole(this.role1);
        this.head2.setRole(this.role2);
        this.head1.state_ = this.head1.state.Press;
        this.head2.state_ = this.head2.state.Press;
        if (this.role1 && this.role2 && this.role1.data.ID == this.role2.data.ID) {
            this.head1.setRole(this.role2);
            this.head1.position.set(200 - this.x, 50 - this.y	);
            this.head2.setRole(null);
        }
        this.head1.visible = this.show_head;
        this.head2.visible = this.show_head;
        var color = g.utils.rgbToHex(255, 255, 255);
        var font_size = 25;
        var x = 0;
        var y = 0;
        this.showOneDifference("Level", "等級 %7d   -> %7d", 20, color, x, y);
        this.showOneDifference("Exp", "經驗 %7d   -> %7d", 20, color, x, y);
        this.showOneDifference("PhysicalPower", "體力 %7d   -> %7d", 20, color, x, y);
        if (this.role1.data.HP != this.role2.data.HP || this.role1.data.MaxHP != this.role2.data.MaxHP) {
            var str = sprintf("生命 %3d/%3d   -> %3d/%3d", this.role1.data.HP, this.role1.data.MaxHP, this.role2.data.HP, this.role2.data.MaxHP);
            this.showOneDifference("HP", str, 20, color, x, y, true);
        }
        if (this.role1.data.MP != this.role2.data.MP || this.role1.data.MaxMP != this.role2.data.MaxMP) {
            var str = sprintf("內力 %3d/%3d   -> %3d/%3d", this.role1.data.MP, this.role1.data.MaxMP, this.role2.data.MP, this.role2.data.MaxMP);
            this.showOneDifference("MP", str, 20, color, x, y, true);
        }
        this.showOneDifference("Attack", "攻擊 %7d   -> %7d", 20, color, x, y);
        this.showOneDifference("Defence", "防禦 %7d   -> %7d", 20, color, x, y);
        this.showOneDifference("Speed", "輕功 %7d   -> %7d", 20, color, x, y);
        this.showOneDifference("Medcine", "醫療 %7d   -> %7d", 20, color, x, y);
        this.showOneDifference("UsePoison", "用毒 %7d   -> %7d", 20, color, x, y);
        this.showOneDifference("Detoxification", "解毒 %7d   -> %7d", 20, color, x, y);
        this.showOneDifference("AntiPoison", "抗毒 %7d   -> %7d", 20, color, x, y);
        this.showOneDifference("AttackWithPoison", "帶毒 %7d   -> %7d", 20, color, x, y);
        this.showOneDifference("Fist", "拳掌 %7d   -> %7d", 20, color, x, y);
        this.showOneDifference("Sword", "御劍 %7d   -> %7d", 20, color, x, y);
        this.showOneDifference("Knife", "耍刀 %7d   -> %7d", 20, color, x, y);
        this.showOneDifference("Unusual", "特殊 %7d   -> %7d", 20, color, x, y);
        this.showOneDifference("HiddenWeapon", "暗器 %7d   -> %7d", 20, color, x, y);
        this.showOneDifference("Poison", "中毒 %7d   -> %7d", 20, color, x, y);
        this.showOneDifference("Morality", "道德 %7d   -> %7d", 20, color, x, y);
        this.showOneDifference("Fame", "聲望 %7d   -> %7d", 20, color, x, y);
        this.showOneDifference("IQ", "資質 %7d   -> %7d", 20, color, x, y);

        var str = "內力陰\陽調和";
        if (this.role2.data.MPType == 0) {
            str = "內力陰";
        }
        if (this.role2.data.MPType == 0) {
            str = "內力陽";
        }
        this.showOneDifference("MPType", str, 20, color, x, y);
        this.showOneDifference("AttackTwice", "雙擊", 20, color, x, y);
        for (var i = 0; i < this.j.type.role_magic_count; i++) {

            if (this.role2.data.MagicID[i] > 0
                && (this.role1.data.MagicID[i] <= 0 || this.role1.getRoleShowLearnedMagicLevel(i) != this.role2.getRoleShowLearnedMagicLevel(i))) {
                var m = this.j.save.getMagic(this.role2.data.MagicID[i]);

                var str = sprintf("武學%s目前修為%d", m.Name, this.role2.getRoleShowLearnedMagicLevel(i));
                this.showOneDifference("MagicLevel", str, 20, color, x, y, true, i);
            }

        }
        if (!this.textboxes.length) {
            this.showOneDifference("%s", "無明显效果", 20, color, x, y, true);
        }
        c.TextBox.prototype.draw.call(this);

    };


    c.ShowRoleDifference.prototype.showOneDifference = function (attr, str, size, color, x, y, force, key) {
        var v1 = '';
        var v2 = '';
        if (key) {
            v1 = this.role1.data[attr][key];
            v2 = this.role2.data[attr][key];
        }
        else {
            v1 = this.role1.data[attr];
            v2 = this.role2.data[attr];
        }
        if ((v1 != v2) || force) {
            var tbox = new c.TextBox(this.j);
            tbox.color = color;
            tbox.font_size = size;
            tbox.have_box = false;
            tbox.text_y += this.textboxes.length * size + 5;
            this.textboxes.push(tbox);
            tbox.setText(sprintf(str, v1, v2));

            this.addCustom(tbox);
        }
    };


})(PIXI, g, c, window);
