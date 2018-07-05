(function (PIXI, g, c, window) {
    'use strict';

    c.Event = function (j) {
        this.j = j;
        Object.assign(this, {
            kdef : [],
            talk : [],
            i : 0,
            e : {},
            loop : 0,
            expected_result : null,
            submap_id : -1,
            event_running : 0,
            item_in_bag_count : 200,
            queue : [],
            shopui : {},
            menu2 : {},
            tbox : {},
            item_id : -1,
            leave_event_0 : 950,
            visible : false,
            leave_event_id : [1, 2, 9, 16, 17, 25, 28, 29, 35, 36, 37, 38, 44, 45, 47, 48, 49, 51, 53, 54, 58, 59, 61, 63, 76]
        });
        this.registerFunc();

    };

    c.Event.prototype.constructor = c.Event;

    c.Event.prototype.onPressedOK = function (e) {
        if (this.j.subscene.force_man_pic.length || this.j.subscene.force_event_pic.length) {
            return;
        }
        if (this.talk_box_up.running) {
            this.talk_box_up.run();
        }
        else if (this.talk_box_down.running) {
            this.talk_box_down.run();
        }
        return true;
    };
    c.Event.prototype.run = function () {
        if (this.queue.length) {
            var q = this.queue[0];
            if (!q.init) {
                q.init = 1;
                q.target.visible = 1;
                if (q.initfunc) {
                    q.initfunc();
                }
                q.func();

            }
            else {
                q.func();
                if (!q.target.visible || (q.target.running != undefined && q.target.running == false)) {
                    this.queue.splice(0, 1);
                    if (q.result) {
                        q.result();
                    }
                    if (q.target == this.j.mainmap.bg) {
                        this.run();
                    }
                    if (!this.queue.length) {
                        this.eventContinue();
                    }
                }
            }
            return;
        };




    };
    c.Event.prototype.init = function(resources) {
        let big5decoder = new TextDecoder('big5');

        let data_grp = new Uint8Array(resources.talkgrp.data);
        for (var i = 0; i < data_grp.length; i++) {
            data_grp[i] = data_grp[i] ^ 0xff;
        }

        var offset = [0];
        var length_arr = [];

        g.utils.getIdxContent(resources.talkindex.data, offset, length_arr);

        var current_len = 0;
        for (var i = 0; i < length_arr.length; i++) {

            var str = big5decoder.decode(data_grp.slice(current_len, current_len + length_arr[i] - 1));
            str = str.replace(/\*/g , "");
            this.talk.push(str);
            current_len += length_arr[i];
        }

        data_grp = new Int16Array(resources.kdefgrp.data);
        var offset = [0];
        var length_arr = [];
        g.utils.getIdxContent(resources.kdefindex.data, offset, length_arr);

        var current_len = 0;
        for (var i = 0; i < length_arr.length; i++) {
            this.kdef[i] = [];
            for (var k = 0; k < length_arr[i] / 2; k++) {
                var i16 = data_grp.slice(current_len, ++current_len);
                this.kdef[i][k] = i16[0];
            }
        }


        this.talk_box_up = new c.Talk(this.j, "up");
        this.talk_box_down = new c.Talk(this.j, "down");
        this.menu2 = new c.MenuText(this.j, ["確認（Y）", "取消（N）"], 400, 300);
        this.menu2.setFontSize(24);
        this.menu2.setHaveBox(true);
        this.menu2.arrange(0, 50, 150, 0);
        this.menu2.visible = 0;
        this.j.viewui.addCustom(this.menu2);
        this.tbox = new c.TextBox(this.j);
        this.tbox.visible = false;
        this.tbox.position.set(400, 200);
        this.j.viewui.addCustom(this.tbox);

        this.shopui = new c.UIShop(this.j);
        this.shopui.visible = false;
        this.j.viewui.addCustom(this.shopui);
    }

    c.Event.prototype.registerFunc = function() {
        var scope = this;
        this.print_e = function(k) {  }
        this.f = function(j) {return this.e[this.i + j];}
        this.void0 = function(func) {this.print_e(0); func(); this.i+=1;}
        this.void1 = function(func) {this.print_e(1); func(this.f(1)); this.i+=2;}
        this.void2 = function(func) {this.print_e(2); func(this.f(1), this.f(2)); this.i+=3;}
        this.void3 = function(func) {this.print_e(3); func(this.f(1), this.f(2), this.f(3)); this.i+=4;}
        this.void4 = function(func) {this.print_e(4); func(this.f(1), this.f(2), this.f(3), this.f(4)); this.i+=5;}
        this.void5 = function(func) {this.print_e(5); func(this.f(1), this.f(2), this.f(3), this.f(4), this.f(5)); this.i+=6;}
        this.void6 = function(func) {this.print_e(6); func(this.f(1), this.f(2), this.f(3), this.f(4), this.f(5), this.f(6)); this.i+=7;}
        this.void7 = function(func) {this.print_e(7); func(this.f(1), this.f(2), this.f(3), this.f(4), this.f(5), this.f(6), this.f(7)); this.i+=8;}
        this.void8 = function(func) {this.print_e(8); func(this.f(1), this.f(2), this.f(3), this.f(4), this.f(5), this.f(6), this.f(7), this.f(8)); this.i+=9;}
        this.void9 = function(func) {this.print_e(9); func(this.f(1), this.f(2), this.f(3), this.f(4), this.f(5), this.f(6), this.f(7), this.f(8), this.f(9)); this.i+=10;}
        this.void10 = function(func) {this.print_e(10); func(this.f(1), this.f(2), this.f(3), this.f(4), this.f(5), this.f(6), this.f(7), this.f(8), this.f(9), this.f(10)); this.i+=11;}
        this.void11 = function(func) {this.print_e(11); func(this.f(1), this.f(2), this.f(3), this.f(4), this.f(5), this.f(6), this.f(7), this.f(8), this.f(9), this.f(10), this.f(11)); this.i+=12;}
        this.void12 = function(func) {this.print_e(12); func(this.f(1), this.f(2), this.f(3), this.f(4), this.f(5), this.f(6), this.f(7), this.f(8), this.f(9), this.f(10), this.f(11), this.f(12)); this.i+=13;}
        this.void13 = function(func) {this.print_e(13); func(this.f(1), this.f(2), this.f(3), this.f(4), this.f(5), this.f(6), this.f(7), this.f(8), this.f(9), this.f(10), this.f(11), this.f(12), this.f(13)); this.i+=14;}
        this.bool0 = function(func) {this.print_e(0);this.event_result = function(ret) {if (ret) {scope.i += scope.f(1);} else { scope.i += scope.f(2); }scope.i += 3;};func();}
        this.bool1 = function(func) {this.print_e(1);this.event_result = function(ret) {if (ret) {scope.i += scope.f(2);} else {scope.i += scope.f(3); } scope.i += 4;};func(this.f(1));}
        this.bool2 = function(func) {this.print_e(2);this.event_result = function(ret) {if (ret) {scope.i += scope.f(3);} else { scope.i += scope.f(4); } scope.i += 5;};func(this.f(1), this.f(2));}
        this.bool2_2 = function(func) {this.print_e(2);this.event_result = function(ret) {if (ret) {scope.i += scope.f(2);} else { scope.i += scope.f(3); } scope.i += 5;};func(this.f(1), this.f(4));}
        this.bool3 = function(func) {this.print_e(3);this.event_result = function(ret) {if (ret) {scope.i += scope.f(4);} else { scope.i += scope.f(5); } scope.i += 6;};func(this.f(1), this.f(2), this.f(3));}
        this.bool4 = function(func) {this.print_e(4);this.event_result = function(ret) {if (ret) {scope.i += scope.f(5);} else { scope.i += scope.f(6); } scope.i += 7;};func(this.f(1), this.f(2), this.f(3), this.f(4));}
        this.bool5 = function(func) {this.print_e(5); this.event_result = function(ret) {if (ret) {scope.i += scope.f(6);} else { scope.i += scope.f(7); } scope.i += 8;};func(this.f(1), this.f(2), this.f(3), this.f(4), this.f(5));}

    };
    c.Event.prototype.shop = function() {
        this.loop = false;
        this.oldTalk(0xB9E, 0x6F, 0, true);
        this.shopui.setShopID(g.utils.rand(5));
        var ret = function(){
            if (this.shopui.result < 0) {

            }
            else {
                this.oldTalk(0xBA0, 0x6F, 0);
            }
        }
        this.queue.push({'target' : this.shopui, 'func' : function(){}, 'init' : 0, 'result' : ret.bind(this)});

    };
    c.Event.prototype.isUsingItem = function(id) {
        this.event_result(this.item_id == id);
    };
    c.Event.prototype.addAttack = function(role_id, value) {
        this.loop = false;
        var r = this.j.save.getRole(role_id);
        var v0 = r.data.Attack;
        r.data.Attack = this.j.gameutil.limit(v0 + value, 0, this.j.op.MaxAttack);
        var that = this;
        var f = function() {
            that.tbox.visible = true;
            that.tbox.setText(sprintf("%s武力增加%d", r.data.Name, r.data.Attack - v0));
            that.tbox.onPressedOK = function(e) {
                that.tbox.visible = false;
                that.visible = false;
            };
        };
        this.queue.push({'target' : this, 'func' : function() {}, 'init' : 0, 'initfunc' : f.bind(this), 'result' : function() {}});

    };
    c.Event.prototype.checkHave5Item = function(item_id1, item_id2, item_id3, item_id4, item_id5) {
        this.event_result(this.haveItemBool(item_id1) &&
            this.haveItemBool(item_id2) &&
            this.haveItemBool(item_id3) &&
            this.haveItemBool(item_id4) &&
            this.haveItemBool(item_id5));
    };
    c.Event.prototype.setMPType = function(role_id, value) {
        this.j.save.getRole(role_id).data.MPType = value;
    };
    c.Event.prototype.addMaxHP = function(role_id, value) {
        this.loop = false;
        var r = this.j.save.getRole(role_id);
        var v0 = r.data.MaxHP;
        r.data.MaxHP = this.j.gameutil.limit(v0 + value, 0, this.j.op.MaxHP);
        var f = function() {
            that.tbox.visible = true;
            that.tbox.setText(sprintf("%生命增加%d", r.data.Name, r.data.MaxHP - v0));
            that.tbox.onPressedOK = function(e) {
                that.tbox.visible = false;
                that.visible = false;
            };
        };
        this.queue.push({'target' : this, 'func' : function() {}, 'init' : 0, 'initfunc' : f.bind(this), 'result' : function() {}});

    };
    c.Event.prototype.addMaxMP = function(role_id, value) {
        this.loop = false;
        var r = this.j.save.getRole(role_id);
        var v0 = r.data.MaxMP;
        r.data.MaxMP = this.j.gameutil.limit(v0 + value, 0, this.j.op.MaxMP);
        var f = function() {
            that.tbox.visible = true;
            that.tbox.setText(sprintf("%s內力增加%d", r.data.Name, r.data.MaxMP - v0));
            that.tbox.onPressedOK = function(e) {
                that.tbox.visible = false;
                that.visible = false;
            };
        };
        this.queue.push({'target' : this, 'func' : function() {}, 'init' : 0, 'initfunc' : f.bind(this), 'result' : function() {}});

    };
    c.Event.prototype.addSpeed = function(role_id, value) {
        this.loop = false;
        var r = this.j.save.getRole(role_id);
        var v0 = r.data.Speed;
        r.data.Speed = this.j.gameutil.limit(v0 + value, 0, this.j.op.MaxSpeed);
        var that = this;
        var f = function() {
            that.tbox.visible = true;
            that.tbox.setText(sprintf("%s輕功增加%d", r.data.Name, r.data.Speed - v0));
            that.tbox.onPressedOK = function(e) {
                that.tbox.visible = false;
                that.visible = false;
            };
        };
        this.queue.push({'target' : this, 'func' : function() {}, 'init' : 0, 'initfunc' : f.bind(this), 'result' : function() {}});

    };
    c.Event.prototype.play2Animation = function(event_index1, begin_pic1, end_pic1, event_index2, begin_pic2) {
        alert('play2');
        var e1 = this.j.subscene.getMapInfo().events[event_index1];
        var e2 = this.j.subscene.getMapInfo().events[event_index2];
        if (e1 && e2 && e3) {
            var inc1 = g.utils.gameutil.sign(end_pic1 - begin_pic1);
            for (var i = 0; i != end_pic1 - begin_pic1; i += inc1) {
                this.j.subscene.force_man_pic.push(i);
            }
            e1.setPic(begin_pic1, begin_pic1 + end_pic1 - begin_pic1);
            e2.setPic(begin_pic2, begin_pic2 + end_pic1 - begin_pic1);
        }
    };

    c.Event.prototype.play3Animation = function(event_index1, begin_pic1, end_pic1, event_index2, begin_pic2, event_index3, begin_pic3) {
        alert('play2');
        var e1 = this.j.subscene.getMapInfo().events[event_index1];
        var e2 = this.j.subscene.getMapInfo().events[event_index2];
        var e3 = this.j.subscene.getMapInfo().events[event_index3];
        if (e1 && e2 && e3) {
            var inc1 = this.j.gameutil.sign(end_pic1 - begin_pic1);
            for (var i = 0; i != end_pic1 - begin_pic1; i += inc1) {
                this.j.subscene.force_event_pic.push(i);
            }
            e1.setPic(begin_pic1, begin_pic1 + end_pic1 - begin_pic1);
            e2.setPic(begin_pic2, begin_pic2 + end_pic1 - begin_pic1);
            e3.setPic(begin_pic3, begin_pic3 + end_pic1 - begin_pic1);
        }
    };

    c.Event.prototype.add3EventNum = function(submap_id, event_index, v1, v2, v3) {
        var s = this.getSubMapRecordFromID(submap_id);
        var e = s.events[event_index];
        if (e) {
            e.data.Event1 += v1;
            e.data.Event2 += v2;
            e.data.Event3 += v3;
        }
    };

    c.Event.prototype.playAnimation = function(event_index, begin_pic, end_pic) {
        if (this.j.target != this.j.subscene) {
            return;
        }
        if (event_index == -1) {
            var inc = this.j.gameutil.sign(end_pic - begin_pic);
            for (var i = begin_pic / 2; i != end_pic / 2; i += inc) {
                this.j.subscene.force_man_pic.push(i);
            }
            this.j.subscene.force_man_pic.push(end_pic / 2);
        }
        else {
            var e = this.j.subscene.submap_info.events[event_index];
            if (e) {
                var inc = this.j.gameutil.sign(end_pic - begin_pic);
                for (var i = 0; i < Math.abs(end_pic - begin_pic); i++) {
                    this.j.subscene.force_event_pic.push(1);
                }
                e.setPic(begin_pic, end_pic);
            }

        }
    };

    c.Event.prototype.checkRoleAttack = function(role_id, low, high) {
        var role = this.j.save.getRole(role_id);
        this.event_result(this.j.save.getRole(role_id).data.Attack >= low);
    };
    c.Event.prototype.checkRoleMorality = function(role_id, low, high) {
        var role = this.j.save.getRole(role_id);
        this.event_result(role.data.Morality >= low && role.data.Morality <= high);
    };




    c.Event.prototype.callLeaveEvent = function(role) {
        this.callEvent(this.getLeaveEvent(role));
    };
    c.Event.prototype.getLeaveEvent = function(role) {
        for (var i = 0; i < this.leave_event_id.length; i++) {
            if (this.leave_event_id[i] == role.data.ID) {
                return this.leave_event_0 + 2 * i;
            }
        }
        return -1;
    };


    c.Event.prototype.oldTalk2 = function(talk_id, head_id, style) {
        if (style % 2 == 0) {
            var talk = this.talk_box_up;
        }
        else {
            var talk = this.talk_box_down;
        }
        var f = function(talk_id, head_id, style) {

            talk.setContent(this.talk[talk_id]);
            talk.setHeadID(head_id);
            if (style == 2 || style == 3) {
                talk.setHeadID(-1);
            }
            if (style == 0 || style == 5) {
                talk.setHeadStyle(0);
            }
            if (style == 4 || style == 1) {
                talk.setHeadStyle(1);
            }
            talk.run();
        };
        var f2 = function() {
            this.clearTalkBox();
        };
        this.queue.push({'target' : talk, 'func' : function() {}, 'init' : 0, 'initfunc' : f.bind(this, talk_id, head_id, style), 'result' : f2.bind(this)});
    };

    c.Event.prototype.oldTalk = function(talk_id, head_id, style) {
        this.loop = false;
        if (style % 2 == 0) {
            var talk = this.talk_box_up;
        }
        else {
            var talk = this.talk_box_down;
        }
        talk.setContent(this.talk[talk_id]);
        talk.setHeadID(head_id);
        if (style == 2 || style == 3) {
            talk.setHeadID(-1);
        }
        if (style == 0 || style == 5) {
            talk.setHeadStyle(0);
        }
        if (style == 4 || style == 1) {
            talk.setHeadStyle(1);
        }
        talk.run();

        this.queue.push({'target' : talk, 'func' : function() {}, 'init' : 0, 'result' : function() {}});

    };
    c.Event.prototype.clearTalkBox = function() {
        this.talk_box_up.clear();
        this.talk_box_down.clear();
    };
    c.Event.prototype.haveItemBool = function(item_id) {
        this.event_result(this.j.save.getItemCountInBag(item_id) > 0);
    };

    c.Event.prototype.checkFemaleInTeam = function() {
        for (var i in this.j.save.data.Team) {
            var r = this.j.save.data.Team[i];
            if (r >= 0) {
                if (this.j.save.getRole(r).data.Sexual == 1) {
                    this.event_result(true);
                }
            }
        }
        this.event_result(false);
    };


    c.Event.prototype.roleAddItem = function(role_id, item_id, count) {
        if (item_id < 0 || count == 0) {
            return;
        }
        var role = this.j.save.getRole(role_id);
        var pos = -1;
        if (!role) {
            return;
        }
        for (var i = 0; i < this.j.type.role_magic_count; i++) {
            if (role.data.TakingItem[i] == item_id) {
                pos = i;
                break;
            }
        }
        if (pos >= 0) {
            role.data.TakingItemCount[pos] += count;

        }
        else {
            for (var i = 0; i < this.j.type.role_magic_count; i++) {
                if (role.data.TakingItem[i] < 0) {
                    pos = i;
                    break;
                }
            }
            if (pos >= 0) {
                role.data.TakingItem[pos] = item_id;
                role.data.TakingItemCount[pos] = count;
            }
        }
        var item_count = {};
        for (var i = 0; i < this.j.type.role_taking_item_count; i++) {
            if (role.data.TakingItem[i] >= 0 && role.data.TakingItemCount[i] > 0) {
                if (!item_count[role.data.TakingItem[i]]) {
                    item_count[role.data.TakingItem[i]] = 0;
                }
                item_count[role.data.TakingItem[i]] += role.data.TakingItemCount[i];
            }
            role.data.TakingItem[i] = -1;
            role.data.TakingItemCount[i] = 0;
        }
        var k = 0;
        for (var i in item_count) {
            role.data.TakingItem[k] = i;
            role.data.TakingItemCount[k] = item_count[i];
            k++;
        }
    };
    c.Event.prototype.setRoleMagic = function(role_id, magic_index_role, magic_id, level) {
        var r = this.j.save.getRole(role_id);
        r.data.MagicID[magic_index_role] = magic_id;
        r.data.MagicLevel[magic_index_role] = level;
    };
    c.Event.prototype.checkRoleSexual = function(sexual) {
        if (sexual <= 255) {
            this.event_result(this.j.save.getRole(0).data.Sexual == sexual);
        }
        else {
            this.event_result(false);
        }
    };

    c.Event.prototype.addIQ = function(role_id, value) {
        this.loop = false;
        var r = this.j.save.getRole(role_id);
        var v0 = r.data.IQ;
        r.data.IQ = this.j.gameutil.limit(v0 + value, 0, this.j.op.MaxIQ);
        var that = this;
        var f = function() {
            that.tbox.visible = true;
            that.tbox.setText(sprintf("%s資質增加%d", r.data.Name, r.data.IQ - v0));
            that.tbox.onPressedOK = function(e) {
                that.tbox.visible = false;
                that.visible = false;
            };
        };
        this.queue.push({'target' : this, 'func' : function() {}, 'init' : 0, 'initfunc' : f.bind(this), 'result' : function() {}});
    };
    c.Event.prototype.oldLearnMagic = function(role_id, magic_id, no_display) {
        var r = this.j.save.getRole(role_id);
        var m = this.j.save.getMagic(magic_id, true);
        r.learnMagic(m.data.ID);
        if (no_display) {
            return;
        }
        this.loop = false;
        var that = this;
        var f = function() {
            that.tbox.visible = true;
            that.tbox.setText(sprintf("%s習得武學%s", r.data.Name, g.utils.strim(m.data.Name)));
            that.tbox.onPressedOK = function(e) {
                that.tbox.visible = false;
                that.visible = false;
            };
        };
        this.queue.push({'target' : this, 'func' : function() {}, 'init' : 0, 'initfunc' : f.bind(this), 'result' : function() {}});
    };
    c.Event.prototype.addItemWithoutHint = function(item_id, count) {
        if (item_id < 0 || count == 0) {
            return;
        }
        var pos = -1;
        for (var i = 0; i < this.item_in_bag_count; i++) {
            if (this.j.save.data.Items[i].item_id == item_id) {
                pos = i;
                break;
            }
        }
        if (pos >= 0) {
            this.j.save.data.Items[pos].count += count;
        }
        else {
            for (var i = 0; i < this.item_in_bag_count; i++) {
                if (this.j.save.data.Items[i].item_id < 0) {
                    pos = i;
                    break;
                }
            }
            if (pos >= 0) {
                this.j.save.data.Items[pos].item_id = item_id;
                this.j.save.data.Items[pos].count = count;
            }
        }
        if (count < 0) {
            this.arrangeBag();
        }

    };







    c.Event.prototype.changeMainMapMusic = function(music_id) {
        if (this.j.subscene == this.j.target) {
            this.j.subscene.exit_music = music_id;
        }
    };
    c.Event.prototype.askJoin = function() {
        this.loop = false;
        this.menu2.setText("是否要求加入？");
        var f = function() {};
        var f2 = function() {this.event_result(this.menu2.result == 0);}
        this.queue.push({'target' : this.menu2, 'func' : f, 'init' : 0, 'result' : f2.bind(this)});
    };
    c.Event.prototype.join = function(role_id) {
        for (var i in this.j.save.data.Team) {
            var r = this.j.save.data.Team[i];
            if (r < 0) {
                this.j.save.data.Team[i] = role_id;
                var role = this.j.save.getRole(role_id);
                for (var i = 0; i < this.j.type.role_taking_item_count; i++) {
                    if (role.data.TakingItem[i] >= 0) {
                        if (role.data.TakingItemCount[i] == 0) {
                            role.data.TakingItemCount[i] = 1;
                        }
                        var f = function(a1, a2) {
                            this.addItem(a1, a2, true);
                        };
                        this.queue.push({'target' : this, 'func' : function() {}, 'init' : 0, 'initfunc' : f.bind(this, role.data.TakingItem[i], role.data.TakingItemCount[i]), 'result' : function() {}});
                        //this.addItem(role.data.TakingItem[i], role.data.TakingItemCount[i]);
                        role.data.TakingItem[i] = -1;
                        role.data.TakingItemCount[i] = 0;
                    }
                }
                return;
            }
        }
    };

    c.Event.prototype.arrangeBag = function(item_id, count) {
        var item_count = {};
        for (var i = 0; i < this.j.type.item_in_bag_count; i++) {
            if (this.j.save.data.Items[i].item_id >= 0 && this.j.save.data.Items[i].count > 0) {
                if (!item_count[this.j.save.data.Items[i].item_id]) {
                    item_count[this.j.save.data.Items[i].item_id] = 0;
                }
                item_count[this.j.save.data.Items[i].item_id] += this.j.save.data.Items[i].count;
            }
            this.j.save.data.Items[i].item_id = -1;
            this.j.save.data.Items[i].count = 0;
        }
        var k = 0;
        for (var i in item_count) {
            this.j.save.data.Items[k].item_id = i;
            this.j.save.data.Items[k].count = item_count[i];
            k++;
        }
    };

    c.Event.prototype.addItem = function(item_id, count, skip_queue) {
        this.loop = false;
        this.addItemWithoutHint(item_id, count);
        var that = this;
        var f = function() {
            that.tbox.visible = true;
            that.tbox.setText("獲得" + that.j.save.getItem(item_id).data.Name.replace(/\0/g,"") + count);
            that.tbox.setTextPosition(-20, 100);

            that.tbox.setTexture(item_id, "item");
            that.tbox.onPressedOK = function(e) {
                that.tbox.visible = false;
                that.visible = false;
            };
        };
        if (skip_queue) {
            f();
        }
        else {
            this.queue.push({'target' : this, 'func' : function() {}, 'init' : 0, 'initfunc' : f.bind(this), 'result' : function() {}});
        }

    };
    c.Event.prototype.playMusic = function(id) {
        PIXI.sound.play('bgm-' + id ,{loop : 1, volume : g.volume});
    };
    c.Event.prototype.playWave = function(id) {
        PIXI.sound.play('sound-atk-' + id ,{volume : g.volume});
    };
    c.Event.prototype.setTowards = function(tw) {
        this.j.subscene.towards = tw;
    };
    c.Event.prototype.modifyEvent = function(submap_id, event_index, cannotwalk, index, event1, event2, event3, currentPic, endPic, beginPic, picDelay, x, y) {
        if (submap_id < 0) {
            submap_id = this.submap_id;
        }
        if (submap_id < 0) {
            return;
        }
        if (event_index < 0) {
            event_index = this.event_index;
        }
        var e = this.j.save.getSubMapInfo(submap_id).events[event_index];
        if (cannotwalk >= -1) {
            e.data.CannotWalk = cannotwalk;
        }
        if (index >= -1) {
            e.data.Index = index;
        }
        if (event1 >= -1) {
            e.data.Event1 = event1;
        }
        if (event2 >= -1) {
            e.data.Event2 == event2;
        }
        if (event3 >= -1) {
            e.data.Event3 = event3;
        }
        if (currentPic >= -1) {
            e.data.CurrentPic = currentPic;
        }
        if (endPic >= -1) {
            e.data.EndPic = endPic;
        }
        if (beginPic >= -1) {
            e.data.BeginPic = beginPic;
        }
        if (picDelay >= -1) {
            e.data.PicDelay = picDelay;
        }
        if (x < -1) {
            x = e.data.X;
        }
        if (y < -1) {
            y = e.data.Y;
        }
        e.setPosition(x, y, this.j.save.getSubMapInfo(submap_id));

    };
    c.Event.prototype.setSexual = function() {
        this.j.save.getRole(role_id).data.Sexual = value;
    };
    c.Event.prototype.backHome = function() {
        // ?
    };

    c.Event.prototype.check14BooksPlaced = function() {
        for (var i = 11; i <= 24; i++) {
            if (this.j.subscene.getMapInfo().events[i].data.CurrentPic != 4664) {
                this.event_result(false);
            }
        }
        this.event_result(true);
    };
    c.Event.prototype.checkSubMapPic = function(submap_id, event_index, pic) {
        this.loop = false;
        var s = this.getSubMapRecordFromID(submap_id);
        if (s) {
            var e = s.events[event_index];
            if (e) {
                this.event_result(e.data.CurrentPic == pic || e.data.BeginPic == pic || e.data.EndPic == pic);
            }
        }
        this.event_result(false);
    };
    c.Event.prototype.allLeave = function() {
        for (var i = 1; i < this.j.type.teammate_count; i++) {
            this.j.save.data.Team[i] = -1;
        }
    };
    c.Event.prototype.subMapViewFromTo = function(x0, y0, x1, y1) {
        var incx = this.j.gameutil.sign(x1 - x0);
        var incy = this.j.gameutil.sign(y1 - y0);
        if (incx) {
            for (var i = x0; i != x1; i += incx) {
                this.j.subscene.cameraView.push([i, y0]);
            }
        }
        if (incy) {
            for (var i = y0; i != y1; i += incy) {
                this.j.subscene.cameraView.push([x1, i]);
            }
        }
        this.j.subscene.cameraView.push([x1, y1]);
    };
    c.Event.prototype.tryBattle = function(battle_id, get_exp, skip_queue) {
        this.loop = false;
        this.j.battle.setID(battle_id);
        this.clearTalkBox();
        this.j.subscene.stop();
        this.j.battle.start();
        var f = function() {};

        if (skip_queue) {
            return;
        }
        var f2 = function() {this.event_result(this.j.battle.result === 0);}
        this.queue.push({'target' : this.j.battle, 'func' : f, 'init' : 0, 'result' : f2.bind(this)});

    };
    c.Event.prototype.openAllSubMap = function() {
        var i = 0;
        while (this.j.save.getSubMapInfo(i)) {
            this.j.save.getSubMapInfo(i).data.EntranceCondition = 0;
            i++;
        }
        this.j.save.getSubMapInfo(2).data.EntranceCondition = 2;
        this.j.save.getSubMapInfo(38).data.EntranceCondition = 2;
        this.j.save.getSubMapInfo(75).data.EntranceCondition = 1;
        this.j.save.getSubMapInfo(80).data.EntranceCondition = 1;
    };
    c.Event.prototype.checkEventID = function(event_index, value) {
        this.event_result(this.j.subscene.getMapInfo().events[event_index].data.Event1 == value);
    };
    c.Event.prototype.askBattle = function() {
        this.loop = false;
        this.menu2.setText('是否與之過招？');
        var f = function() {};
        var f2 = function() {this.event_result(this.menu2.result == 0);}
        this.queue.push({'target' : this.menu2, 'func' : f, 'init' : 0, 'result' : f2.bind(this)});
    };
    c.Event.prototype.teamIsFull = function() {
        var ret = true;
        for (var i in this.j.save.data.Team) {
            var r = this.j.save.data.Team[i];
            if (r < 0) {
                ret = false;
            }
        }
        this.event_result(ret);
    };
    c.Event.prototype.leaveTeam = function(role_id) {
        for (var i = 0; i < this.j.type.teammate_count; i++) {
            if (this.j.save.data.Team[i] == role_id) {
                for (var j = i; j < this.j.type.teammate_count - 1; j++) {
                    this.j.save.data.Team[j] = this.j.save.data.Team[j + 1];
                }
                this.j.save.data.Team[this.j.type.teammate_count - 1] = -1;
                this.j.ui.clear();
                break;
            }
        }
    };
    c.Event.prototype.zeroAllMP = function() {
        for (var i in this.j.save.data.Team) {
            var r = this.j.save.data.Team[i];
            if (r >= 0) {
                this.j.save.getRole(r).data.MP = 0;
            }
        }

    };
    c.Event.prototype.setRoleUsePoison = function(role_id, v) {
        this.j.getRole(role_id).data.UsePoison = v;
    };
    c.Event.prototype.showMorality = function() {
        this.loop = false;
        var that = this;
        var f = function() {
            that.tbox.visible = true;
            that.tbox.setText(sprintf("你的道德指數為%d", this.j.save.getRole(0).data.Morality));
            that.tbox.setTextPosition(0, 0);
            that.tbox.onPressedOK = function(e) {
                that.tbox.visible = false;
                that.visible = false;
            };
        };
        this.queue.push({'target' : this, 'func' : function() {}, 'init' : 0, 'initfunc' : f.bind(this), 'result' : function() {}});
    };
    c.Event.prototype.showFame = function() {
        this.loop = false;
        var that = this;
        var f = function() {
            that.tbox.visible = true;
            that.tbox.setText(sprintf("你的聲望指數為%d", this.j.save.getRole(0).data.Fame));
            that.tbox.setTextPosition(0, 0);
            that.tbox.onPressedOK = function(e) {
                that.tbox.visible = false;
                that.visible = false;
            };
        };
        this.queue.push({'target' : this, 'func' : function() {}, 'init' : 0, 'initfunc' : f.bind(this), 'result' : function() {}});
    };
    c.Event.prototype.askSoftStar = function() {
        this.oldTalk(2547 + g.utils.rand(18), 114, 0);

    };
    c.Event.prototype.getSubMapRecordFromID = function(submap_id) {
        var submap_record = this.j.save.getSubMapInfo(submap_id);
        if (submap_record == null) {
            submap_record = this.j.subscene.getMapInfo();
        }
        return submap_record;
    }
    c.Event.prototype.addFame = function(value) {
        this.j.save.getRole(0).data.Fame += value;
        if (this.j.save.getRole(0).data.Fame > 200 && this.j.save.getRole(0).data.Fame - value <= 200) {
            this.modifyEvent(70, 11, 0, 11, 932, -1, -1, 7968, 7968, 7968, 0, 18, 21);
        }
    };
    c.Event.prototype.addMorality = function(value) {
        var role = this.j.save.getRole(0);
        role.data.Morality = this.j.gameutil.limit(role.data.Morality + value, 0, this.j.op.MaxMorality);
    };

    c.Event.prototype.changeSubMapPic = function(submap_id, layer, old_pic, new_pic) {
        var s = this.getSubMapRecordFromID (submap_id);
        if (s) {
            for (var i1 = 0; i1 < this.j.type.submap_coord_count; i1++) {
                for (var i2 = 0; i2 < this.j.type.submap_coord_count; i2++) {
                    if (g.utils.getData(s.layer_data[layer], i1, i2, this.j.type.submap_coord_count) == old_pic) {
                        g.utils.setData(s.layer_data[layer], i1, i2, this.j.type.submap_coord_count, new_pic);
                    }
                }
            }
        }

    };
    c.Event.prototype.openSubMap = function(submap_id) {
        this.j.save.getSubMapInfo(submap_id).data.EntranceCondition = 0;

    };

    c.Event.prototype.setSubMapLayerData = function(submap_id, layer, x, y, v) {
        var r = this.getSubMapRecordFromID(submap_id);
        g.utils.setData(r.layer_data[layer], x, y, 64, v);
    };

    c.Event.prototype.inTeam = function(role_id) {
        var ret = false;
        for (var i in this.j.save.data.Team) {
            var r = this.j.save.data.Team[i];
            if (r == role_id) {
                ret = true;
            }
        }
        this.event_result(ret);
    };
    c.Event.prototype.oldSetScenePosition = function(x, y) {
        if (this.j.target == this.j.subscene) {
            this.j.subscene.setManViewPosition(x, y);
        }
    };
    c.Event.prototype.walkFromTo = function(x0, y0, x1, y1) {
        if (this.j.target != this.j.subscene) {
            return;
        }
        var incx = this.j.gameutil.sign(x1 - x0);
        var incy = this.j.gameutil.sign(y1 - y0);
        if (incx) {
            var i = x0;
            var f = function(){
                if (this.j.subscene.current_frame % g.frame_rate == 0) {
                    i += incx;
                    this.j.subscene.tryWalk(i, y0);
                    this.j.subscene.towards = this.j.subscene.calTowards(x0, y0, i, y0);
                    if (i == x1) {
                        this.j.subscene.setManViewPosition(x1, y1);
                        this.visible = false;
                    }
                }
            };
            this.queue.push({'target' : this, 'func' : f.bind(this), 'init' : 0, 'result' : function() {}});
        }
        if (incy) {
            var i = y0;
            var f = function(){
                if (this.j.subscene.current_frame % g.frame_rate == 0) {
                    i += incy;
                    this.j.subscene.tryWalk(x1, i);
                    this.j.subscene.towards = this.j.subscene.calTowards(x1, y0, x1, i);
                    if (i == y1) {
                        this.j.subscene.setManViewPosition(x1, y1);
                        this.visible = false;
                    }
                }
            };
            this.queue.push({'target' : this, 'func' : f.bind(this), 'init' : 0, 'result' : function() {}});
        }
    };
    c.Event.prototype.checkEnoughMoney = function(money_count) {
        this.event_result(this.j.save.getMoneyCountInBag);
    };

    c.Event.prototype.setManLoc = function(x, y) {
        var f = function() {
            this.visible = false;
            this.j.target.man_x = x;
            this.j.target.man_y = y;
            this.j.target.bg.visible = false;
        };
        this.queue.push({'target' : this.j.target.bg, 'func' : f.bind(this), 'init' : 1, 'result' : function(){} });
    };
    c.Event.prototype.lightScene = function() {
        this.loop = false;
        var f = function() {
            this.bg_alpha -= 0.02;
            this.bg.alpha = this.bg_alpha;
            if (this.bg_alpha <= 0) {
                this.bg_alpha = 0;
                this.bg.visible = false;
            }
        };
        var f2 = function() {
            this.j.target.bg_alpha = 1;
        }

        this.queue.push({'target' : this.j.target.bg, 'func' : f.bind(this.j.target), 'initfunc' : f2.bind(this.j.target), 'init' : 0, 'result' : function(){} });

        this.clearTalkBox();
    };
    c.Event.prototype.darkScene = function() {
        this.loop = false;
        var f = function() {
            this.bg_alpha += 0.02;
            this.bg.alpha = this.bg_alpha;

            if (this.bg_alpha >= 1) {
                this.bg_alpha = 1;
                this.bg.visible = false;
            }
        };
        var f2 = function() {
            this.j.target.bg_alpha = 0;
        }
        this.queue.push({'target' : this.j.target.bg, 'func' : f.bind(this.j.target),'initfunc' : f2.bind(this.j.target), 'init' : 0, 'result' : function(){} });

    };

    c.Event.prototype.dead = function() {
        this.visible = false;
        this.j.ui.visible = false;
        this.j.target.stop();
        this.j.title.start();
    };

    c.Event.prototype.breakStoneGate = function() {
        var f1 = function() {
            this.playAnimation(-1, 3832 * 2, 3844 * 2);
            this.play3Animation(2, 3845 * 2, 3873 * 2, 3, 3874 * 2, 4, 3903 * 2);
        };
        var f3 = function() {
            if (!this.j.subscene.force_event_pic.length == 1 && !this.j.subscene.force_man_pic.length) {
                this.queue.splice(0, 1);
            }
        };
        this.queue.push({'target' : this, 'func' : f3.bind(this),'initfunc' : f1.bind(this), 'init' : 0, 'result' : function(){} });
    };

    c.Event.prototype.fightForTop = function() {
        this.loop = false;
        var heads = [8, 21, 23, 31, 32, 43, 7, 11, 14, 20, 33, 34, 10, 12, 19, 22, 56, 68, 13, 55, 62, 67, 70, 71, 26, 57, 60, 64, 3, 69];
        for (var i = 0; i < 15; i++) {
            var p = g.utils.rand(2);

            var style = heads[i * 2 + p];
            this.oldTalk2(2854 + i * 2 + p, heads[i * 2 + p], g.utils.rand(2) * 4 + g.utils.rand(2));


            var f4 = function() {
                this.queue = [];
            };
            var f3 = function(i, p) {
                this.tryBattle(102 + i * 2 + p, 0, true);
            };
            this.queue.push({'target' : this.j.battle, 'func' : function() {}, 'init' : 0, 'initfunc' : f3.bind(this, i, p), 'result' : function() {} });
        }

        this.darkScene();
        this.lightScene();
        if (i % 3 == 2) {

            this.oldTalk2(2891, 70, 4);
            this.rest();
            this.darkScene();
            this.lightScene();
        }
        this.oldTalk2(2884, 0, 3);
        this.oldTalk2(2885, 0, 3);
        this.oldTalk2(2886, 0, 3);
        this.oldTalk2(2887, 0, 3);
        this.oldTalk2(2888, 0, 3);
        this.oldTalk2(2889, 0, 1);

        var f5 = function() {
            this.addItem(0x8F, 1, true);
        };
        this.queue.push({'target' : this, 'func' : function() {}, 'init' : 0, 'initfunc' : f5.bind(this), 'result' : function() {} });
    };


    c.Event.prototype.askRest = function() {
        this.loop = false;
        this.menu2.setText("請選擇是或否？");
        var f = function() {};
        var f2 = function() {this.event_result(this.menu2.result == 0);}
        this.queue.push({'target' : this.menu2, 'func' : f, 'init' : 0, 'result' : f2.bind(this)});
    };
    c.Event.prototype.rest = function() {
        for (var i in this.j.save.data.Team) {
            var r = this.j.save.data.Team[i];
            var role = this.j.save.getRole(r);
            if (role) {
                role.data.PhysicalPower = this.j.op.MaxPhysicalPower;
                role.data.HP = role.data.MaxHP;
                role.data.MP = role.data.MaxMP;
                role.data.Hurt = 0;
                role.data.Poison = 0;
            }
        }

    };

    c.Event.prototype.registerInstruct = function(func1, func2) {
        console.log('case : '  + this.e[this.i]);
        var pfunc1 = func1.bind(this);
        var pfunc2 = func2.bind(this);
        pfunc2 (pfunc1);
        this.event_running = 1;
    };

    c.Event.prototype.eventContinue = function() {
        this.loop = true;
        this.expected_result = null;
        console.log('continue');
        this.callEvent("continue");
        //this.event_result = function(){};
    };

    c.Event.prototype.callEvent = function(event_id, item_id, event_index, x, y) {
        this.item_id = item_id;
        if (event_id <= 0 || event_id >= this.kdef) {
            if (event_id != 'continue') {
                return false;
            }
        }
        if (!this.queue.length && !this.event_running) {
            if (this.j.subscene == this.j.target) {
                this.submap_id = this.j.subscene.submap_info.data.ID;
            }
            this.loop = true;
            this.e = this.kdef[event_id];
            this.i = 0;
            this.event_id = event_id;
            this.event_index = event_index;
        }
        if (!this.e) {
            return;
        }

        while (this.i < this.e.length && this.loop) {
            switch (this.e[this.i]) {
                case 1:	this.registerInstruct(this.oldTalk, this.void3);break;
                case 2:	this.registerInstruct(this.addItem, this.void2);break;
                case 3:	this.registerInstruct(this.modifyEvent, this.void13);break;
                case 4:	this.registerInstruct(this.isUsingItem, this.bool1);break;
                case 5:	this.registerInstruct(this.askBattle, this.bool0);break;
                case 6:	this.registerInstruct(this.tryBattle, this.bool2_2);break;
                case 8:	this.registerInstruct(this.changeMainMapMusic, this.void1);break;
                case 9:	this.registerInstruct(this.askJoin, this.bool0);break;
                case 10: this.registerInstruct(this.join, this.void1);break;
                case 11: this.registerInstruct(this.askRest, this.bool0);break;
                case 12: this.registerInstruct(this.rest, this.void0);break;
                case 13: this.registerInstruct(this.lightScene, this.void0);break;
                case 14: this.registerInstruct(this.darkScene, this.void0);break;
                case 15: this.registerInstruct(this.dead, this.void0);break;
                case 16: this.registerInstruct(this.inTeam, this.bool1);break;
                case 17: this.registerInstruct(this.setSubMapLayerData, this.void5);break;
                case 18: this.registerInstruct(this.haveItemBool, this.bool1);break;
                case 19: this.registerInstruct(this.oldSetScenePosition, this.void2);break;
                case 20: this.registerInstruct(this.teamIsFull, this.bool0);break;
                case 21: this.registerInstruct(this.leaveTeam, this.void1);break;
                case 22: this.registerInstruct(this.zeroAllMP, this.void0);break;
                case 23: this.registerInstruct(this.setRoleUsePoison, this.void2);break;
                case 25: this.registerInstruct(this.subMapViewFromTo, this.void4);break;
                case 26: this.registerInstruct(this.add3EventNum, this.void5);break;
                case 27: this.registerInstruct(this.playAnimation, this.void3);break;
                case 28: this.registerInstruct(this.checkRoleMorality, this.bool3);break;
                case 29: this.registerInstruct(this.checkRoleAttack, this.bool3);break;
                case 30: this.registerInstruct(this.walkFromTo, this.void4);break;
                case 31: this.registerInstruct(this.checkEnoughMoney, this.bool1);break;
                case 32: this.registerInstruct(this.addItemWithoutHint, this.void2);break;
                case 33: this.registerInstruct(this.oldLearnMagic, this.void3);break;
                case 34: this.registerInstruct(this.addIQ, this.void2);break;
                case 35: this.registerInstruct(this.setRoleMagic, this.void4);break;
                case 36: this.registerInstruct(this.checkRoleSexual, this.bool1);break;
                case 37: this.registerInstruct(this.addMorality, this.void1);break;
                case 38: this.registerInstruct(this.changeSubMapPic, this.void4);break;
                case 39: this.registerInstruct(this.openSubMap, this.void1);break;
                case 40: this.registerInstruct(this.setTowards, this.void1);break;
                case 41: this.registerInstruct(this.roleAddItem, this.void3);break;
                case 42: this.registerInstruct(this.checkFemaleInTeam, this.bool0);break;
                case 43: this.registerInstruct(this.haveItemBool, this.bool1);break;
                case 44: this.registerInstruct(this.play2Animation, this.void6);break;
                case 45: this.registerInstruct(this.addSpeed, this.void2);break;
                case 46: this.registerInstruct(this.addMaxMP, this.void2);break;
                case 47: this.registerInstruct(this.addAttack, this.void2);break;
                case 48: this.registerInstruct(this.addMaxHP, this.void2);break;
                case 49: this.registerInstruct(this.setMPType, this.void2);break;
                case 51: this.registerInstruct(this.askSoftStar, this.void0);break;
                case 52: this.registerInstruct(this.showMorality, this.void0);break;
                case 53: this.registerInstruct(this.showFame, this.void0);break;
                case 54: this.registerInstruct(this.openAllSubMap, this.void0);break;
                case 55: this.registerInstruct(this.checkEventID, this.bool2);break;
                case 56: this.registerInstruct(this.addFame, this.void1);break;
                case 57: this.registerInstruct(this.breakStoneGate, this.void0);break;
                case 58: this.registerInstruct(this.fightForTop, this.void0);break;
                case 59: this.registerInstruct(this.allLeave, this.void0);break;
                case 60: this.registerInstruct(this.checkSubMapPic, this.bool3);break;
                case 61: this.registerInstruct(this.check14BooksPlaced, this.bool0);break;
                case 62: this.registerInstruct(this.backHome, this.void0);break;
                case 63: this.registerInstruct(this.setSexual, this.void2);break;
                case 64: this.registerInstruct(this.shop, this.void0);break;
                case 66: this.registerInstruct(this.playMusic, this.void1);break;
                case 67: this.registerInstruct(this.playWave, this.void1);break;
                case 50:
                    if (f(1) > 128) {
                        this.bool5(this.checkHave5Item);
                    }
                    else {
                        this.instruct50e(this.f(1), this.f(2), this.f(3), this.f(4), this.f(5), this.f(6), this.f(7), this.f(8));
                        this.i += 8;
                    }
                    break;
                case 7:
                case -1:
                    this.i += 1;
                    this.loop = false;
                    this.clearTalkBox();
                    this.event_running = 0;
                    break;
                default:
                    this.i += 1;
            }
        }
    };

})(PIXI, g, c, window);
