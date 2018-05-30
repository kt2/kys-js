(function (PIXI, g, c, window) {
    'use strict';
    c.ShowExp = function (j) {
        this.j = j;

        PIXI.Container.call(this);
        Object.assign(this, {
            sp_index : 0,
            tex_index : 0,
            txt_max : 200,
            sp_max : 10,
            sp : [],
            txt: []

        });
        this.visible = false;
        for (var i = 0; i < this.sp_max; i++ ) {
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
    c.ShowExp.prototype.constructor = c.ShowExp;
    c.ShowExp.prototype = Object.create(PIXI.Container.prototype);

    c.ShowExp.prototype.onPressedCancel = function(e) {
        this.visible = false;
    };
    c.ShowExp.prototype.onPressedOK = function(e) {
        this.visible = false;
    };
    c.ShowExp.prototype.setRoles = function(r) {
        this.roles = r;
    };
    c.ShowExp.prototype.draw = function() {
        this.tex_index = 0;
        this.sp_index = 0;
        for (var i = 0; i < this.sp_max; i++ ) {
            this.sp[i].visible = false;
        }
        for (var i = 0; i < this.txt_max; i++ ) {
            this.txt[i].visible = false;
        }
        for (var i = 0; i < this.roles.length; i++) {
            var r = this.roles[i];
            var x = 100 + i % 3 * 300;
            var y = 100 + parseInt(i / 3) * 200;
            this.j.tm.render2 (r.data.HeadID, 'head', x, y, this.sp[this.sp_index++]);
            var str = sprintf("%s獲得經驗%d", r.data.Name, r.ExpGot);
            this.j.tm.rendertxt(str, 20, x, y + 170, g.utils.rgbToHex(255,255,255), 0, this);
        }
    };
})(PIXI, g, c, window);
