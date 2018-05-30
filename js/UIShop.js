(function (PIXI, g, c, window) {
    'use strict';

    c.UIShop = function (j) {
        this.j = j;
        Object.assign(this, {
            visible : false,
            shop_item_count : 5,
            buttons : [],
            result : -1,
            plan_buy : [0 ,0 ,0 ,0 ,0],
            txt_max : 400,
            txt : [],
            tex_index : 0,
            state : null
        });
        PIXI.Container.call(this);
        this.position.set(200, 200);
        for (var i = 0; i < this.shop_item_count; i++) {
            var button_left = new c.Button(this.j);
            button_left.setTexture(104, 'title');
            button_left.position.set(36 * 12 + 36, 30 + 25 * i);
            this.addCustom(button_left);
            this.buttons.push(button_left);

            var button_right = new c.Button(this.j);
            button_right.setTexture(105, 'title');
            button_right.position.set(36 * 12 + 108, 30 + 25 * i);
            this.addCustom(button_right);
            this.buttons.push(button_right);
        }
        this.bg = new PIXI.Graphics();
        this.bg.beginFill(0x000000, 0.5);
        this.bg.drawRect(-this.x, -this.y, g.app.view.width, g.app.view.height);
        this.addChild(this.bg);

        this.button_ok = new c.Button(this.j);
        this.button_ok.setText("確認");
        this.button_ok.position.set(300, 190);
        this.button_cancel = new c.Button(this.j);
        this.button_cancel.setText("取消");
        this.button_cancel.position.set(400, 190);
        this.button_clear = new c.Button(this.j);
        this.button_clear.setText("清除");
        this.button_clear.position.set(500, 190);
        this.addCustom(this.button_ok);
        this.addCustom(this.button_cancel);
        this.addCustom(this.button_clear);
        for (var i = 0; i < this.txt_max; i++ ) {
            var tx = new PIXI.Text();
            this.addChild(tx);
            this.txt.push(tx);
        }
    };

    c.UIShop.prototype = Object.create(PIXI.Container.prototype);
    c.UIShop.constructor = c.UIShop;

    c.UIShop.prototype.onPressedOK = function() {
        for (var i = 0; i < this.shop_item_count * 2 ; i++ ) {
            if (this.buttons[i].state_ == this.buttons[i].state.Press) {
                var index = parseInt(i / 2);
                var lr = parseInt(i % 2);
                if (lr == 0) {
                    if (this.plan_buy[index] > 0) {
                        this.plan_buy[index]--;
                    }
                }
                else {
                    if (this.plan_buy[index] < this.shop.data.Total[index]) {
                        this.plan_buy[index]++;
                    }
                }
            }
        }
        if (this.state == 'ok') {
            if (this.calNeedMoney() <= this.j.save.getMoneyCountInBag()) {
                for (var i = 0; i < this.shop_item_count; i++) {
                    this.j.gevent.addItemWithoutHint(this.shop.data.ItemID[i], this.plan_buy[i]);
                    this.shop.data.Total[i] -= this.plan_buy[i];
                }
                this.j.save.moneyUsed(this.calNeedMoney());
                for (var i = 0; i < this.shop_item_count; i++) {
                    this.plan_buy[i] = 0;
                }
                this.result = 0;
                this.visible = false;
            }
        }
        if (this.state == 'cancel') {
            this.result  = -1;
            this.visible = false;
        }
        if (this.state == 'clear') {
            for (var i = 0; i < this.shop_item_count; i++) {
                this.plan_buy[i] = 0;
            }
        }
        this.state = '';
        return true;
    };
    c.UIShop.prototype.mouseDown = function() {
        if (this.button_ok.state_ == this.button_ok.state.Press) {
            this.state = 'ok';
        }
        if (this.button_cancel.state_ == this.button_cancel.state.Press) {	  this.state = 'cancel';
        }
        if (this.button_clear.state_ == this.button_clear.state.Press) {
            this.state = 'clear';
        }
    };

    c.UIShop.prototype.calNeedMoney = function() {
        var need_money = 0;
        for (var i = 0; i < this.shop_item_count; i++) {
            need_money += this.plan_buy[i] * this.shop.data.Price[i];
        }
        return parseInt(need_money);
    };
    c.UIShop.prototype.setShopID = function(id) {
        this.shop = this.j.save.getShop(id);
    }
    c.UIShop.prototype.draw = function() {
        this.tex_index = 0;
        var x = 0;
        var y = 0;
        if (this.txt) {
            for (var k in this.txt) {
                this.txt[k].visible = false;
            }
        }
        var str = g.utils.lpad("品名", -12) + g.utils.lpad("價格", 8) + g.utils.lpad("存貨", 8) + g.utils.lpad("持有", 8) + g.utils.lpad("計劃", 8);
        this.j.tm.rendertxt(str, 24, x, y, g.utils.rgbToHex(200, 150, 50), 0, this);
        for (var i = 0; i < 5; i++) {
            var item = this.j.save.getItem(this.shop.data.ItemID[i]);
            var count = this.j.save.getItemCountInBag(item.data.ID);
            var str = g.utils.lpad(g.utils.strim(item.data.Name), -12) + g.utils.lpad(this.shop.data.Price[i], 8) +  g.utils.lpad(this.shop.data.Total[i], 8) +  g.utils.lpad(count, 8) + g.utils.lpad(this.plan_buy[i], 8);
            this.j.tm.rendertxt(str, 24, x, y + 25 + i * 25, g.utils.rgbToHex(255, 255, 255), 0, this);
        }
        var need_money = this.calNeedMoney();
        var str = sprintf("總計銀兩%8d", need_money);
        this.j.tm.rendertxt(str, 24, x, y + 25 + 6 * 25, g.utils.rgbToHex(255, 255, 255), 0, this);

        var money = this.j.save.getMoneyCountInBag();
        var str = sprintf("持有銀兩%8d", money);
        var c = g.utils.rgbToHex(255, 255, 255);
        if (money < need_money) {
            c = g.utils.rgbToHex(255, 50, 50);
        }
        this.j.tm.rendertxt(str, 24, x, y + 25 + 7 * 25, c, 0, this);

    }

})(PIXI, g, c, window);
