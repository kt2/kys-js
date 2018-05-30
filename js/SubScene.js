(function (PIXI, g, c, window) {
    'use strict';

    c.SubScene = function (j) {
        this.j = j;
        Object.assign(this, {
            force_man_pic : [],
            force_event_pic : [],
            man_pic : 0,
            man_pic_0 : 2501,
            man_pic_count : 7,
            cur_pos : null,
            coord_count : 64,
            submap_id : null,
            submap_info : null,
            view_x : 55,
            view_y : 32,
            man_x : 55,
            man_y : 32,
            cameraView : [],
            x : 0,
            y : 0,
            mouse_event_x : -1,
            mouse_event_y : -1,
            bg_alpha : 0,
            queue : [],
            exit_music : null,
        });
        this.setID(25);
        this.scene_init();
        this.bg = new PIXI.Graphics();
        this.bg.beginFill(0x000000);
        this.bg.drawRect(0, 0, g.app.view.width, g.app.view.height);
        this.bg.visible = false;
        this.j.viewui.addChild(this.bg);
    };

    c.SubScene.prototype = Object.create(c.Scene.prototype);
    c.SubScene.prototype.constructor = c.SubScene;

    c.SubScene.prototype.getMapInfo = function() {
        return this.submap_info;
    };
    c.SubScene.prototype.stop = function() {
        this.way_que = [];
        cancelAnimationFrame(this.requestid);
        if (g.mainmap_tex) {
            for (var k in g.mainmap_tex) {
                g.mainmap_tex[k].visible = false;
            }
        }
    };


    c.SubScene.prototype.forceJumpSubScene = function(submap_id, x, y) {
        this.stop();
        this.setID(submap_id);
        this.setManViewPosition(x, y);
        this.start(this.towards);
    };
    c.SubScene.prototype.isJumpSubScene = function(x, y) {
        if (this.submap_info.data.JumpSubMap >=0 && this.man_x == this.submap_info.data.JumpX && this.man_y == this.submap_info.data.JumpY) {
            var x;
            var y;
            var new_submap = this.j.save.getSubMapInfo(this.submap_info.data.JumpSubMap);
            if (this.submap_info.data.MainEntranceX1 != 0) {
                x = new_submap.data.EntranceX;
                y = new_submap.data.EntranceY;
            }
            else {
                x = new_submap.data.JumpReturnX;
                y = new_submap.data.JumpReturnY;
            }
            this.forceJumpSubScene(this.submap_info.data.JumpSubMap, x, y);return true;
        }
        return false;
    };
    c.SubScene.prototype.isExit = function(x, y) {
        if (this.submap_info.data.ExitX[0] == x && this.submap_info.data.ExitY[0] == y
            || this.submap_info.data.ExitX[1] == x && this.submap_info.data.ExitY[1] == y
            || this.submap_info.data.ExitX[2] == x && this.submap_info.data.ExitY[2] == y) {
            return true;
        }
        return false;
    };

    c.SubScene.prototype.mouseDown = function(e) {


    };
    c.SubScene.prototype.setMouseEventPoint = function(x, y) {
        this.mouse_event_x = x;
        this.mouse_event_y = y;
    };

    c.SubScene.prototype.mouseClick = function(e, mousepos) {
        if (this.j.gevent.queue.length || this.j.gevent.event_running || this.force_event_pic.length || g.pause_) {
            return false;
        }
        this.setMouseEventPoint (-1, -1);
        var p = this.calCursorPosition(this.man_x, this.man_y, mousepos);
        if (this.canWalk()) {
            this.way_que = [];
            this.findWay(this.man_x, this.man_y, p.x, p.y);
        }

        if (this.isCannotPassEvent(p.x, p.y) || this.isCanPassEvent1(p.x, p.y) && this.calDistance(p.x, p.y, this.man_x, this.man_y) == 1) {
            var ps = [];
            if (this.calDistance(p.x, p.y, this.man_x, this.man_y) == 1) {
                ps.push({'x' : this.man_x, 'y' : this.man_y});
            }
            else {
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
            }
            if (ps.length) {
                var i = g.utils.rand(ps.length);
                this.findWay(this.man_x, this.man_y, ps[i].x, ps[i].y);
                if (this.way_que.length) {
                    this.setMouseEventPoint(p.x, p.y);
                }
            }
        }
        if (!this.way_que.length) {
            this.checkEvent1(this.man_x, this.man_y);
        }
    };

    c.SubScene.prototype.onPressedOK = function(e) {
        if (this.force_man_pic.length || this.force_event_pic.length) {
            return;
        }


        if (e.keyCode == g.keyconfig.RET || e.keyCode == g.keyconfig.SPACE) {
            this.checkEvent1(this.man_x, this.man_y);
        }


    };


    c.SubScene.prototype.keyDown = function(e) {
        if (this.j.gevent.event_running) {
            return false;
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
                    this.way_que.push(newpos);
                }
            }

        }
    };



    c.SubScene.prototype.debugUI = function() {
        this.j.viewui.eventAllCustom();
        this.j.viewui.drawAllCustom();

    };
    c.SubScene.prototype.start = function(towards) {
        if (this.submap_info.data.EntranceMusic > 0) {
            PIXI.sound.stopAll();
            PIXI.sound.play('bgm-' + this.submap_info.data.EntranceMusic, {loop : true, volume : 0.1});
        }
        if (this.submap_info.data.ExitMusic) {
            this.exit_music = this.submap_info.data.ExitMusic;
        }

        this.j.target = this.j.subscene;
        this.towards = towards;
        this.draw();
    };
    c.SubScene.prototype.apath_move = function() {
        if (this.j.gevent.event_running) {
            return false;
        }
        if (this.current_frame % g.frame_rate == 0 || this.j.control.iskeydown) {
            if (this.way_que.length) {
                var que_p = this.way_que.pop();
                var tw = this.calTowards(this.man_x, this.man_y, que_p.x, que_p.y);
                if (tw != this.towards_none) {
                    this.towards = tw;
                }
                this.tryWalk(que_p.x, que_p.y);
            }
            if (!this.way_que.length && this.mouse_event_x >= 0 && this.mouse_event_y >= 0) {
                this.towards = this.calTowards(this.man_x, this.man_y, this.mouse_event_x, this.mouse_event_y);
                this.checkEvent1(this.man_x, this.man_y, this.toawrds);
                this.setMouseEventPoint(-1, -1);

            }
        }

    };


    c.SubScene.prototype.eventAllCustom = function() {
        this.checkEvent3(this.man_x, this.man_y);
        this.j.viewui.eventAllCustom();
    };
    c.SubScene.prototype.drawAllCustom = function() {
        this.j.gevent.run();
        this.j.viewui.drawAllCustom();
    };


    c.SubScene.prototype.draw = function() {
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
        if (this.queue.length) {
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
                    this.queue.splice(0, 1);
                }

            }
            return;
        };
        this.eventAllCustom();

        this.apath_move();
        this.tex_key = 0;

        if (g.mainmap_tex) {
            for (var k in g.mainmap_tex) {
                g.mainmap_tex[k].visible = false;
            }
        }
        if (this.cameraView.length) {
            var cpos = this.cameraView.shift();
            this.setViewPosition(cpos[0], cpos[1]);
        }

        this.width_region = parseInt(this.j.centerx / 18 / 2 + 3);
        this.sum_region = parseInt(this.j.centery / 9 + 2);
        if (this.current_frame % g.frame_rate == 0) {
            this.cur_pos = this.calCursorPosition(this.man_x, this.man_y);
        }
        for (var sum = -this.sum_region; sum <= (this.sum_region + 15); sum++) {
            for (var i = -this.width_region; i <= this.width_region; i++) {
                var ix = Math.round(this.view_x + i + (sum / 2));
                var iy = Math.trunc(this.view_y - i + (sum - sum / 2));

                var p = this.getPositionOnRender(ix, iy, this.view_x, this.view_y);
                p.x += this.x;
                p.y += this.y;
                if (this.isOutLine(ix, iy)) {
                    continue;
                }

                if (p.x < - this.margin  || p.x > this.j.win_width + this.margin  || p.y < - this.margin  || p.y > this.j.win_height + this.margin ) {
                    continue;
                }

                var h = this.submap_info.buildingHeight(ix, iy);
                var num = this.submap_info.earth(ix, iy) / 2;

                if (num > 0 && h >= 0) {
                    this.j.tm.render(num, 'smap', ix, iy, p.x, p.y, this.tex_key++);
                }

                if (ix == this.cur_pos.x && iy == this.cur_pos.y) {
                    //cur_pos = this.getPositionOnRender(cur_pos.x, cur_pos.y, this.man_x, this.man_y);
                    this.j.tm.render(1, 'mmap', ix, iy, p.x, p.y - h, this.tex_key++);
                }


                num = this.submap_info.building(ix, iy) / 2;
                if (num > 0) {
                    this.j.tm.render(num, 'smap', ix, iy, p.x, p.y - h, this.tex_key++);
                }

                if (ix == this.man_x && iy == this.man_y) {

                    if (this.force_man_pic.length <= 0) {
                        this.man_pic = this.calManPic();
                    }
                    else {
                        if (this.current_frame % g.frame_rate == 0) {
                            this.man_pic = this.force_man_pic.pop();
                        }
                    }

                    this.j.tm.render(this.man_pic, 'smap', ix, iy, p.x, p.y - h, this.tex_key++);
                }

                var event = this.submap_info.event(ix, iy);
                if (event) {
                    num = parseInt(event.data.CurrentPic / 2);
                    if (num > 0) {
                        this.j.tm.render(num, 'smap', ix, iy, p.x, p.y - h, this.tex_key++);
                    }
                }


                num = this.submap_info.decoration(ix, iy) / 2;

                if (num > 0) {
                    var py = p.y - this.submap_info.decorationHeight(ix, iy);
                    this.j.tm.render(num, 'smap', ix, iy, p.x, py, this.tex_key++);
                }

                //	this.tex_key++;
            }
        }

        // var cur_pos = this.calCursorPosition(this.man_x, this.man_y);
        // if (cur_pos) {
        // cur_pos = this.getPositionOnRender(cur_pos.x, cur_pos.y, this.man_x, this.man_y);
        // this.j.tm.render(1, 'mmap', ix, iy, cur_pos.x, cur_pos.y, this.tex_key++);
        // }
        if (this.current_frame % g.frame_rate == 0) {
            if (this.force_event_pic.length) {
                this.force_event_pic.pop();
            }
            for (var i = 0; i < this.j.type.submap_event_count; i++) {
                var e = this.submap_info.events[i];
                if (e.data.EventEnd && e.data.EventEnd == e.data.CurrentPic) {

                }
                else if (e.data.BeginPic < e.data.EndPic) {
                    e.data.CurrentPic++;
                    if (e.data.CurrentPic > e.data.EndPic) {
                        e.data.CurrentPic = e.data.BeginPic;
                    }
                }
            }
        }
        this.current_frame++;
        if (this.current_frame == 10000) {
            this.current_frame = 0;
        }
        if (this.isExit(this.man_x, this.man_y)) {
            this.stop();
            if (this.exit_music) {
                PIXI.sound.stopAll();
                PIXI.sound.play('bgm-' + this.exit_music, {loop : true, volume : g.volume});
            }
            this.way_que = [];
            this.j.mainmap.start(this.towards);
        }
        if (this.isJumpSubScene(this.man_x, this.man_y)) {
            this.way_que = [];
            return;
        }

        this.drawAllCustom();
        if (this.rest_time > 50) {
            this.step = 0;
        }
        this.rest_time++;
        if (this.debug) {
            g.stats.end();
        }
    };
    c.SubScene.prototype.onPressedCancel = function(e) {
        if (!this.j.gevent.event_running) {
            this.j.ui.visible = true;
        }
    };
    c.SubScene.prototype.tryWalk = function(x, y) {
        if (this.canWalk(x, y)) {
            this.man_x = x;
            this.man_y = y;
            this.view_x = x;
            this.view_y = y;
        }
        this.step++;
        if (this.step >= this.man_pic_count) {
            this.step = 1;
        }
        this.rest_time = 0;
    };

    c.SubScene.prototype.setID = function(id) {

        this.submap_id = id;
        this.submap_info = this.j.save.getSubMapInfo(id);

    }
    c.SubScene.prototype.canWalk = function(x, y) {
        if (this.isOutLine(x, y) || this.isBuilding(x, y) || this.isWater()
            || this.isCannotPassEvent(x, y)) {
            return false;
        }
        return true;
    };


    c.SubScene.prototype.isWater = function(x, y) {
        var num = this.submap_info.earth(x, y) / 2;
        if (num >= 179 && num <= 181
            || num == 261 || num == 511
            || num >= 662 && num <= 665
            || num == 674) {
            return true;
        }
        return false;
    };
    c.SubScene.prototype.isBuilding = function(x, y) {
        return this.submap_info.building(x, y) > 0;
    };
    c.SubScene.prototype.isCanPassEvent1 = function(x, y) {
        var e = this.submap_info.event(x, y);
        if (e && e.data.CannotWalk && e.data.Event1 > 0) {
            return true;
        }
        return false;
    };
    c.SubScene.prototype.isCannotPassEvent = function(x, y) {
        var e = this.submap_info.event(x, y);
        if (e && e.data.CannotWalk) {
            return true;
        }
        return false;
    };

    c.SubScene.prototype.setManViewPosition = function(x, y) {
        this.setViewPosition(x, y);
        this.setManPosition(x, y);
    }
    c.SubScene.prototype.setViewPosition = function(x, y) {
        this.view_x = x;
        this.view_y = y;
    };
    c.SubScene.prototype.setManPosition = function(x, y) {
        this.man_x = x;
        this.man_y = y;
    };
    c.SubScene.prototype.calManPic = function() {
        return this.man_pic_0 + this.towards * this.man_pic_count + this.step;
    };
    c.SubScene.prototype.isOutLine = function(x, y) {
        return (x < 0|| x >= this.coord_count || y < 0 || y >= this.coord_count);
    };
    c.SubScene.prototype.useEventItem = function(item_id) {
        this.checkEvent2(this.man_x, this.man_y, this.towards, item_id);
    };
    c.SubScene.prototype.checkEvent1 = function(x, y) {
        return this.checkEvent(x, y, this.towards, -1);
    }
    c.SubScene.prototype.checkEvent2 = function(x, y, tw, item_id) {
        return this.checkEvent(x, y, this.towards, item_id);
    };
    c.SubScene.prototype.checkEvent3 = function(x, y) {
        return this.checkEvent(x, y, this.towards_none, -1);
    }
    c.SubScene.prototype.checkEvent = function(x, y, tw, item_id) {
        var newpos = {'x' : null, 'y' : null};

        this.getTowardsPosition(tw, this.man_x, this.man_y, newpos);
        var event_index_submap = this.submap_info.eventIndex(newpos.x, newpos.y);
        if (event_index_submap >= 0) {
            var id = 0;
            if (tw != this.towards_none) {
                if (item_id < 0) {
                    id = this.submap_info.event(newpos.x, newpos.y).data.Event1;
                }
                else {
                    id = this.submap_info.event(newpos.x, newpos.y).data.Event2;
                }
                if (id > 0) {
                    this.step = 0;
                }
            }
            else {
                id = this.submap_info.event(newpos.x, newpos.y).data.Event3;
            }
            if (id) {
                return this.j.gevent.callEvent(id, item_id, event_index_submap, newpos.x, newpos.y);
            }
        }
    };
})(PIXI, g, c, window);














