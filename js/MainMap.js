(function (PIXI, g, c, window) {
    'use strict';

    c.MainMap = function (j) {
        this.j = j;
        Object.assign(this, {
            post_render : {},
            clouds : [],
            earth_layer: {},
            surface_layer: {},
            building_layer: {},
            man_x : 192,
            man_y : 295,
            man_pic : {},
            man_pic : {},
            ship_pic_0 : 3715,
            man_pic_0 : 2501,
            ship_pic_count : 4,
            man_pic_count : 7,
            rest_time : 0,
            begin_rest_time : 200,
            rest_pic_count : 6,
            rest_pic_0 : 2529,
            rest_interval : 20,
            mouse_event_x : -1,
            mouse_event_y : -1,
            coord_count : 480,
            bg_alpha : 0
        });
        this.scene_init();
        this.uiloc = new c.UILoc(j);
        this.j.viewui.addCustom(this.uiloc);
        this.bg = new PIXI.Graphics();
        this.bg.beginFill(0x000000);
        this.bg.drawRect(0, 0, g.app.view.width, g.app.view.height);
        this.bg.visible = false;
        this.j.viewui.addChild(this.bg);
    };

    c.MainMap.prototype = Object.create(c.Scene.prototype);
    c.MainMap.prototype.constructor = c.MainMap;


    c.MainMap.prototype.keyDown = function(e) {
        this.mouse_event_x = -1;
        this.mouse_event_y = -1;

        if (e.keyCode == 77) {
            this.uiloc.init();
            this.uiloc.position.set(20, 20);
            this.uiloc.visible = true;
            this.uiloc.arrange(20, 0, 250, 0, 4, 30);
        }

        if (this.checkKeyPress(e.keyCode)) {
            this.pressed = e.keyCode;

            if (this.pressed && !this.way_que.length) {

                this.changeTowardsByKey(this.pressed);
                var newpos = {'x' : null, 'y' : null};
                this.getTowardsPosition(this.towards, this.man_x, this.man_y, newpos);
                if (this.man_x == newpos.x && this.man_y == newpos.y) {

                }
                else {
                    //this.tryWalk(newpos.x, newpos.y);
                    this.way_que.push(newpos);
                }
                if (this.checkEntrance(newpos.x, newpos.y)) {
                    this.way_que = [];
                }
            }

        }
    };


    c.MainMap.prototype.mouseDown = function(e, mousepos) {

    };
    c.MainMap.prototype.mouseClick = function(e, mousepos) {
        var p = this.calCursorPosition(this.man_x, this.man_y, mousepos);
        this.mouse_event_x = -1;
        this.mouse_event_y = -1;
        var toofar = 0;
        if (this.canWalk()) {
            this.way_que = [];
            this.findWay(this.man_x, this.man_y, p.x, p.y);
        }
        if (this.isBuilding(p.x, p.y)) {
            var building_x = g.utils.getData(this.build_x_layer, p.x, p.y);
            var building_y = g.utils.getData(this.build_y_layer, p.x, p.y);
            var found_entrance = false;
            for (var ix = building_x + 1; ix > building_x - 9; ix--) {
                for (var iy = building_y + 1; iy > building_y - 9; iy--) {
                    if (g.utils.getData(this.build_x_layer, ix, iy) == building_x
                        && g.utils.getData(this.build_y_layer, ix, iy) == building_y
                        && this.checkEntrance(ix, iy, true)) {
                        p.x = ix;
                        p.y = iy;
                        found_entrance = true;
                        break;
                    }
                }
                if (found_entrance) {
                    break;
                }
            }
            if (found_entrance) {
                var ps = [];
                if (this.canWalk(p.x - 1, p.y)) {
                    ps.push({'x' : p.x - 1, 'y' : p.y});
                }
                if (this.canWalk(p.x + 1, p.y)) {
                    ps.push({'x' : p.x + 1, 'y' : p.y});
                }
                if (this.canWalk(p.x, p.y - 1)) {
                    ps.push({'x' : p.x, 'y' : p.y - 1});
                }
                if (this.canWalk(p.x, p.y + 1)) {
                    ps.push({'x' : p.x, 'y' : p.y + 1});
                }
                if (ps.length) {
                    var i = g.utils.rand(ps.length);
                    this.findWay(this.man_x, this.man_y, ps[i].x, ps[i].y);
                    if (this.way_que.length) {
                        this.setMouseEventPoint(p.x, p.y);
                    }
                }
            }
        }
    }
    c.MainMap.prototype.start = function(towards) {
        //this.uiloc.init();
        for (var i = 0; i < 10000; i++ ) {
            this.j.view.removeChild(g.mainmap_tex[i]);
        };
        g.mainmap_tex = [];
        for (var i = 0; i < 10000; i++ ) {
            var sp = new PIXI.Sprite();
            this.j.view.addChild(sp);
            g.mainmap_tex.push(sp);
        }

        this.j.target = this.j.mainmap;
        if (towards) {
            this.towards = towards;
        }
        this.draw();
    };

    c.MainMap.prototype.setMouseEventPoint = function(x, y) {
        this.mouse_event_x = x;
        this.mouse_event_y = y;
    };
    c.MainMap.prototype.init = function(resources) {
        //	j.ui.position.set(200,200)
        // g.viewui.addChild(this.j.ui);
        // return false;

        var itemindex = new Uint8Array(resources.itemindex.data);
        var delta_xy = g.utils.getIndex(resources.itemindex.data, itemindex);
        g.delta['item'] = delta_xy;

        var titleindex = new Uint8Array(resources.titleindex.data);
        var delta_xy = g.utils.getIndex(resources.titleindex.data, titleindex);
        g.delta['title'] = delta_xy;

        var headindex = new Uint8Array(resources.headindex.data);
        var delta_xy = g.utils.getIndex(resources.headindex.data, headindex);
        g.delta['head'] = delta_xy;
        // mmap index
        var mmapindex = new Uint16Array(resources.mmapindex.data);
        var delta_xy = g.utils.getIndex(resources.mmapindex.data, mmapindex);
        g.delta['mmap'] = delta_xy;

        var smapindex = new Uint16Array(resources.smapindex.data);
        var delta_xy = g.utils.getIndex(resources.smapindex.data, smapindex);
        g.delta['smap'] = delta_xy;

        // cloud index
        var cloudindex = new Uint16Array(resources.cloudindex.data);
        var delta_xy = g.utils.getIndex(resources.cloudindex.data, cloudindex);
        g.delta['cloud'] = delta_xy;

        this.earth_layer = g.utils.divide2(resources.earth.data);
        this.surface_layer = g.utils.divide2(resources.surface.data);
        this.building_layer = g.utils.divide2(resources.building.data);
        this.build_x_layer = new Uint16Array(resources.buildx.data);
        this.build_y_layer = new Uint16Array(resources.buildy.data);

        for (var i = 0; i < 100; i++) {
            var cc = new c.Cloud();
            this.clouds.push(cc);
            cc.initRand();
        }
    };

    c.MainMap.prototype.apath_move = function() {
        if (this.current_frame % g.frame_rate == 0 || this.j.control.iskeydown) {
            if (this.way_que.length) {
                var que_p = this.way_que.pop();
                var tw = this.calTowards(this.man_x, this.man_y, que_p.x, que_p.y);
                if (tw != this.towards_none) {
                    this.towards = tw;
                }
                this.tryWalk(que_p.x, que_p.y);
            }

            else if (this.mouse_event_x >= 0 && this.mouse_event_y >= 0) {
                this.towards = this.calTowards(this.man_x, this.man_y, this.mouse_event_x, this.mouse_event_y);
                if (this.checkEntrance(this.mouse_event_x, this.mouse_event_y)) {
                    this.way_que = [];
                }
                this.setMouseEventPoint(-1, -1);
            }
        }

    };
    c.MainMap.prototype.eventAllCustom = function() {
        this.j.viewui.eventAllCustom();
    };
    c.MainMap.prototype.drawAllCustom = function() {
        this.j.gevent.run();
        this.j.viewui.drawAllCustom();
    };

    c.MainMap.prototype.onPressedCancel = function(e) {
        this.j.ui.visible = true;
    };

    c.MainMap.prototype.stop = function() {
        this.way_que = [];
        cancelAnimationFrame(this.requestid);
        if (g.mainmap_tex) {
            for (var k in g.mainmap_tex) {
                g.mainmap_tex[k].visible = false;
            }
        }
    }

    c.MainMap.prototype.draw = function() {
        if (!this.fixed_update) {
            this.requestid = requestAnimationFrame(this.draw.bind(this));
        }
        else {
            var timeNow = (new Date()).getTime();
            var timeDiff = timeNow - this.g_Time;
            if (timeDiff < this.g_Tick)
                return;
            this.g_Time = timeNow;
            this.requestid = requestAnimationFrame(this.draw.bind(this));
        }
        if (this.debug) {
            g.stats.begin();
        }
        this.eventAllCustom();
        this.apath_move();
        this.tex_key = 0;
        this.post_render = {};
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
                if (this.isOutLine(ix, iy)) {
                    continue;
                }
                if (p.x < - this.margin  || p.x > this.j.win_width + this.margin  || p.y < - this.margin  || p.y > this.j.win_height + this.margin ) {
                    continue;
                }

                this.j.tm.render(this.earth_layer, 'mmap', ix, iy, p.x, p.y, this.tex_key++);
                this.j.tm.render(this.surface_layer, 'mmap', ix, iy, p.x, p.y, this.tex_key++);
                this.j.tm.render(this.building_layer, 'mmap', ix, iy, p.x, p.y, 0, this.post_render);

                if (ix == this.man_x && iy == this.man_y) {
                    if (this.isWater(this.man_x, this.man_y)) {
                        this.man_pic = this.ship_pic_0 + this.towards * this.ship_pic_count + this.step;
                        this.j.tm.render(this.man_pic, 'mmap', ix, iy, p.x, p.y, 0, this.post_render, null, null, null, null, 1);
                    }
                    else {
                        this.man_pic = this.man_pic_0 + this.towards * this.man_pic_count + this.step;
                        if (this.rest_time >= this.begin_rest_time) {
                            this.man_pic = this.rest_pic_0 + this.towards * this.rest_pic_count + parseInt((this.rest_time - this.begin_rest_time) / this.rest_interval) % this.rest_pic_count;
                        }
                        this.j.tm.render(this.man_pic, 'mmap', ix, iy, p.x, p.y, 0, this.post_render);
                    }

                }
            }
        }

        for (const i in this.post_render) {
            var mmap = g.mainmap_tex[this.tex_key++];
            mmap.setTexture(this.post_render[i].t);
            mmap.x = this.post_render[i].x;
            mmap.y = this.post_render[i].y;
            mmap.visible = true;
        }

        var cur_pos = this.calCursorPosition(this.man_x, this.man_y);
        if (cur_pos) {
            cur_pos = this.getPositionOnRender(cur_pos.x, cur_pos.y, this.man_x, this.man_y);
            this.j.tm.render(1, 'mmap', ix, iy, cur_pos.x, cur_pos.y, this.tex_key++);
        }


        for (var i = 0; i < this.clouds.length; i++) {
            if (this.current_frame % g.frame_rate == 0) {
                this.clouds[i].flow();
                this.clouds[i].setPositionOnScreen(this.man_x, this.man_y, this.j.centerx, this.j.centery);
            }
            this.j.tm.render(this.clouds[i].num, 'cloud', ix, iy, this.clouds[i].x, this.clouds[i].y, this.tex_key++);
        }
        this.rest_time++;
        this.current_frame++;
        if (this.current_frame == 10000) {
            this.current_frame = 0;
        }
        this.drawAllCustom();
        if (this.debug) {
            g.stats.end();
        }


    };

    c.MainMap.prototype.forceEnterSubscene = function(i, subx, suby) {
        this.enterSubScene(i, subx, suby);
    };

    c.MainMap.prototype.debugSubscene = function(i) {
        var s = this.j.save.submap_infos[i].data;
        var x = s.EntranceX;
        var y = s.EntranceY;
        this.enterSubScene(i, x, y);
    };

    c.MainMap.prototype.checkEntrance = function(x, y, only_check) {
        for (var i = 0; i < this.j.save.submap_infos.length; i++) {
            var s = this.j.save.submap_infos[i].data;
            if (x == s.MainEntranceX1 && y == s.MainEntranceY1 || x == s.MainEntranceX2 && y == s.MainEntranceY2) {
                var can_enter = false;
                if (s.EntranceCondition == 0) {
                    can_enter = true;
                }
                else if (s.EntranceCondition == 2) {
                    for (var ii in this.j.save.data.Team) {
                        var r = this.j.save.data.Team[ii];
                        if (this.j.save.getRole(r).data.Speed >= 70) {
                            can_enter = true;
                            break;
                        }
                    }
                }
                if (only_check) {
                    return true;
                }
                if (can_enter) {
                    this.enterSubScene(i, s.EntranceX, s.EntranceY);
                    return true;
                }
            }
        }
        return false;
    };
    c.MainMap.prototype.isBuilding = function(x, y) {
        var bx = g.utils.getData(this.build_x_layer, x, y);
        var by = g.utils.getData(this.build_y_layer, x, y);

        return g.utils.getData(this.building_layer, bx, by) > 0;
    }


    c.MainMap.prototype.canWalk = function(x, y) {
        if (this.isOutLine(x, y) || this.isBuilding(x, y)) {
            return false;
        }
        else {
            return true;
        }
    };

    c.MainMap.prototype.tryWalk = function(x, y) {
        if (this.canWalk(x,y)) {
            this.man_x = x;
            this.man_y = y;
        }
        this.step++;
        if (this.isWater(this.man_x, this.man_y)) {
            this.step = this.step % this.ship_pic_count;
        }
        else {
            if (this.step >= this.man_pic_count) {
                this.step = 1;
            }
        }

        this.rest_time = 0;
    };

    c.MainMap.prototype.setManPosition = function(x, y) {
        this.man_x = x;
        this.man_y = y;
    };
    c.MainMap.prototype.enterSubScene = function(submap_id, x, y) {
        this.j.subscene.setManViewPosition(x, y);
        this.j.subscene.setID(submap_id);
        this.stop();
        this.j.subscene.start(this.towards);
    };


    c.MainMap.prototype.isOutLine = function(x, y) {
        return (x < 0 || x >= this.coord_count || y < 0 || y >= this.coord_count);
    };
    c.MainMap.prototype.isWater = function(x, y) {
        var pic = g.utils.getData(this.earth_layer, x, y);
        if (pic == 419 || pic >= 306 && pic <= 335) {
            return true;
        }
        else if (pic >= 179 && pic <= 181
            || pic >= 253 && pic <= 335
            || pic >= 508 && pic <= 511) {
            return true;
        }
        else {
            return false;
        }
    }

    c.Cloud = function() {
        this.x = -1000;
        this.y = -1000;
        this.maxx = 17280;
        this.maxy = 8640;
        this.num_style = 10;
    };

    c.Cloud.prototype.initRand = function() {
        this.position = {};
        this.position.x = g.utils.rand(this.maxx);
        this.position.y = g.utils.rand(this.maxy);
        this.speed = 1 + g.utils.rand(4);
        this.num = 1 + g.utils.rand(this.num_style);
        this.alpha = 64 + g.utils.rand(192);
        this.color = [g.utils.rand(256), g.utils.rand(256), g.utils.rand(256), 255];

    }

    c.Cloud.prototype.constructor = c.Cloud;
    c.Cloud.prototype.setPositionOnScreen = function(x, y,	centerx, centery) {
        this.x = this.position.x - (-y * 18 + x * 18 + this.maxx / 2 - centerx);
        this.y = this.position.y - (y * 9 + x * 9 + 9 - centery) ;
    };
    c.Cloud.prototype.flow = function() {
        this.position.x += this.speed;
        if (this.position.x > this.maxx) {
            //this.initRand();
            this.position.x = 0;
        }
    }


})(PIXI, g, c, window);
