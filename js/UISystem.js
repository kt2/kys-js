(function (PIXI, g, c, window) {
    'use strict';

    c.UISystem = function(j) {
        PIXI.Container.call(this);
        this.j = j;
        Object.assign(this, {
            tex_index : 0,
            txt : [],
            queue : []
        });
        this.title = new c.MenuText(j, ["讀取進度", "保存進度", "我的代碼", "離開遊戲"], 0, 0);
        this.title.setFontSize(24);
        this.title.arrange(100, 50, 120, 0);
        this.addCustom(this.title);
        this.visible = false;
    };

    c.UISystem.constructor = c.UISystem;
    c.UISystem.prototype = Object.create(PIXI.Container.prototype);

    c.UISystem.prototype.eventAllCustom = function() {
        if (this.queue.length) {
            if (this.title.selected) {
                this.title.selected.state_ = this.title.selected.state.Normal;
                this.title.selected.draw();
                this.title.skip_draw = true;
                //this.title.selected = null;
            }

            var q = this.queue[0];

            if (!q.init) {
                q.init = 1;
                this.addCustom(q.target);
                q.target.visible = true;
                q.func();
            }
            else {
                q.func();

                if (!q.target.visible) {
                    this.removeCustom(q.target);
                    this.title.skip_draw = false;
                    this.queue.splice(0, 1);
                }

            }
            return;
        };
    };
    c.UISystem.prototype.onPressedCancel = function() {
        if (this.queue.length) {
            var q = this.queue[0];
            q.target.visible = false;
            this.queue.splice(0, 1);
            this.title.skip_draw = false;
            return 1;
        }
    };
    c.UISystem.prototype.onPressedOK = function() {
        if (this.queue.length) {
            return;
        }
        if (this.title.getResult() == 0) {
            var ui_save = this.j.title.save_menu;
            ui_save.mode = 0;
            ui_save.setFontSize(22);
            ui_save.position.set(400 - this.x, 100 - this.y);
            var f = function() {};
            this.queue.push({'target' : ui_save, 'func' : f, 'init' : 0});
        }
        else if (this.title.getResult() == 1) {
            ui_save = this.j.title.save_menu;
            ui_save.mode = 1;
            ui_save.setFontSize(22);
            ui_save.position.set(400 - this.x, 100 - this.y);
            var f = function() {};
            this.queue.push({'target' : ui_save, 'func' : f, 'init' : 0});
        }
        else if (this.title.getResult() == 3) {
            this.j.ui.visible = false;
            this.j.target.stop();
            this.j.title.start();
        }
        this.result = -1;
    };


})(PIXI, g, c, window);
