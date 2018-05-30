(function (PIXI, g, c, window) {
    'use strict';

    c.Talk = function(j, pos) {
        this.j = j;
        Object.assign(this, g.config);
        Object.assign(this, {
            running : 0,
            content : "",
            pos : pos,
            visible : false,
            head_id : -1,
            head_style : 0,
            content_lines : [],
            gp_talk_up : 0,
            gp_talk_down : 1,
            gp_head_up : 0,
            gp_head_down : 1,
            target : null,
            target_head : null,
            cwidth : 20,
            cheight : 5,
            x : 0,
            y : 0,
            p : 0,
            end_line : 0,
            current_line : 0,
        });
        if (this.pos == "up") {
            this.target = this.gp_talk_up;
            this.target_head = this.gp_head_up;
            g.graphics[this.target].beginFill(0x000000, 0.3);
            g.graphics[this.target].drawRect(225, 65, 530, 150);
        }
        if (this.pos == "down") {
            this.target = this.gp_talk_down;
            this.target_head = this.gp_head_down;
            g.graphics[this.target].beginFill(0x000000, 0.3);
            g.graphics[this.target].drawRect(225, 65, 530, 150);
            g.graphics[this.target].x = 0;
            this.y = g.graphics[this.target].y = 400;
        }
        g.graphics[this.target].visible = false;
    };

    c.Talk.prototype.constructor = c.Talk;
    c.Talk.prototype.clear = function() {
        if (this.pos == "up") {
            this.p = 0;
            for (var i = 0; i < 200; i++) {
                g.txt[i].visible = false;
            }
        }
        if (this.pos == "down") {
            this.p = 200;
            for (var i = 200; i < 400; i++) {
                g.txt[i].visible = false;
            }
        }
        g.graphics[this.target].visible = false;
        g.gsprite[this.target_head].visible = false;
    };

    c.Talk.prototype.setContent = function(str) {
        this.current_line = 0;
        this.clear();
        this.content_lines = [];
        this.content = str;
        var i = 0;

        while (i < this.content.length) {
            var len = this.cwidth;
            if (i + len >= this.content.length) {
                len = this.content.length - i;
            }
            var line = this.content.substring(i, i + len);
            var eng_count = 0;
            for (var j = 0; j < line.length; j++) {
                if (line[j].charCodeAt(0) > 128) {
                    eng_count++;
                }
            }
            if (eng_count % 2 == 1 && len == this.cwidth && this.content[i + len].charCodeAt(0) >= 128) {
                len++;
                line = this.content.substring(i, i + len);
            }
            this.content_lines.push(line);
            i += len;
        }
    };
    c.Talk.prototype.setHeadStyle = function(style) {
        this.head_style = style;
    };
    c.Talk.prototype.setHeadID = function(head_id) {
        this.head_id = head_id;
    };
    c.Talk.prototype.run = function() {
        if (this.running) {
            if (this.current_line + this.cheight >= this.content_lines.length) {
                this.running = false;
                //this.visible = false;
                return;
            }
            this.current_line += this.cheight;
        }
        this.running = true;
        this.clear();
        g.graphics[this.target].visible = true;
        if (this.head_id >= 0) {
            if (this.head_style == 0) {
                this.j.tm.render(this.head_id, 'head', 0, 0, this.x + 50, this.y + 50, this.target_head);
            }
            else {
                this.j.tm.render(this.head_id, 'head', 0, 0, this.x + 770, this.y + 50, this.target_head);
            }
        }

        if (this.content.length) {
            this.end_line = this.current_line + this.cheight;
            if (this.end_line > this.content_lines.length) {
                this.end_line = this.content_lines.length;
            }
            for (var i = this.current_line; i < this.end_line; i++) {
                this.renderLine(this.content_lines[i], 24, this.x + 250, this.y + 75 + 25 * (i - this.current_line), 0);
            }
        }

    };
    c.Talk.prototype.renderLine = function(ctext, size, x, y, color) {
        var i = 0;
        var w = size;
        var h = size;
        while (i < ctext.length) {
            var txt = ctext[i];
            if (g.current_language == 'big5') {
                txt = ChineseConverter.toTraditionalChinese(txt);
            }
            else {
                txt = ChineseConverter.toSimplifiedChinese(txt);
            }
            g.txt[this.p].setText(txt);
            g.txt[this.p].x = x + 1;
            g.txt[this.p].y = y;
            g.txt[this.p].style.fill = 0xFFFFFF;
            g.txt[this.p].style.font = size + 'px chinese';
            g.txt[this.p].visible = true;
            g.txt[this.p].width = w;
            g.txt[this.p].height = h;
            x += w;
            i++;
            g.txt[this.p].updateText();
            this.p++;
        }

    };
})(PIXI, g, c, window);
