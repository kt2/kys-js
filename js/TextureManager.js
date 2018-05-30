(function (PIXI, g, c, window) {
    'use strict';

    c.TextureManager = function() {
    };
    c.TextureManager.prototype.renderbtn = function(data, res_type, px, py, sp) {
        var filename = res_type + '/' + data + '.png';
        var texture = PIXI.TextureCache[g.prefix + filename];
        if (texture) {
            sp.visible = true;
            sp.setTexture(texture);
        }
        if (!texture) {
            sp.visible = false;
            return;
        }

        if (res_type == 'item' || res_type == 'mmap' || res_type == 'smap' || res_type == 'cloud' || res_type == 'head' || res_type == 'title') {
            if (data in g.delta[res_type]) {
                px = px - g.delta[res_type][data].dx;
                py = py - g.delta[res_type][data].dy;
            }
        }
        sp.width = texture.width;
        sp.height = texture.height;

        sp.x = px;
        sp.y = py;

    };
    c.TextureManager.prototype.render2 = function(data, res_type, px, py, sp, color, alpha, zoom_x, zoom_y) {
        var filename = res_type + '/' + data + '.png';

        var texture = PIXI.TextureCache[g.prefix + filename];
        if (texture) {
            sp.setTexture(texture);
            sp.visible = true;
        }

        if (res_type == 'item' || res_type == 'mmap' || res_type == 'smap' || res_type == 'cloud' || res_type == 'head'|| res_type == 'title') {
            if (data in g.delta[res_type]) {
                px = px - g.delta[res_type][data].dx;
                py = py - g.delta[res_type][data].dy;
            }
        }

        if (color) {

            sp.alpha = alpha;
            sp.tint = color;

        }
        if (zoom_x > 0) {

            sp.scale.x = zoom_x;
        }
        if (zoom_y > 0) {
            sp.scale.y = zoom_y;
        }
        if (px) {
            sp.x = px;
        }
        if (py) {
            sp.y = py;
        }
    };



    c.TextureManager.prototype.rendertxt = function(txt, fontsize, x, y, color, padding, target) {
        var p = 0;
        var w = parseInt(fontsize);
        var h = parseInt(fontsize);
        txt = txt.toString();
        if (typeof (txt) == 'string') {
            txt = txt.replace(/\0/g,"");
        }
        if (padding) {
            txt = g.utils.lpad(txt, padding);
        }
        if (g.current_language == 'big5') {
            txt = ChineseConverter.toTraditionalChinese(txt);
        }
        else {
            txt = ChineseConverter.toSimplifiedChinese(txt);
        }
        var wx = x;
        var eng_count = 0;
        while (p < txt.length) {
            if (txt[p].charCodeAt(0) > 128) {
                w = fontsize;
            }
            else {
                eng_count ++;
                w = fontsize / 2;
            }

            target.txt[target.tex_index].visible = true;
            target.txt[target.tex_index].setText(txt[p]);
            target.txt[target.tex_index].x = wx;
            target.txt[target.tex_index].width = w;
            target.txt[target.tex_index].height = h;
            target.txt[target.tex_index].y = y;
            target.txt[target.tex_index].style.fontSize = fontsize;
            target.txt[target.tex_index].style.fontFamily = 'chinese';

            target.txt[target.tex_index].style.fill = color;
            target.txt[target.tex_index].updateText();
            target.tex_index++;
            wx += w;
            p++;
        }
        if (eng_count) {
            padding += eng_count;
        }
    };


    c.TextureManager.prototype.render = function(layer_or_num, res_type, ix, iy, px, py, tex_key, post_render = null, line, divide2, color, alpha, is_man_pic) {
        is_man_pic = is_man_pic ? 1 : 0;
        if (!line) {
            line = 480;
        }
        if (typeof(layer_or_num) != 'number') {
            var data = layer_or_num[ix + line * iy];
        }
        else {
            var data = layer_or_num;
        }
        if (line == 64) {
            if (data <= 0) {
                return false;
            }
        }

        if (divide2) {
            data /= 2;
        }

        if (res_type == 'mmap' && data <= 0) {
            return false;
        }
        if (data >= 0) {

            if (res_type == 'mmap' || res_type == 'smap') {
                var filename = g.prefix + res_type + '/' + data + '.png';

                if (!(filename in PIXI.TextureCache)) {
                    var filename = g.prefix + res_type + '/' + data + '_' + this.rand(8) + '.png';
                }
            }

            else if (res_type == 'cloud' || res_type == 'head' || res_type == 'title') {
                var filename = g.prefix + res_type + '/' + data + '.png';
            }
            else if (res_type.substring(0, 5) == 'fight') {
                var filename = g.prefix + res_type + '/' + data + '.png';
            }
            else if (res_type.substring(0, 3) == 'eft') {
                var filename = g.prefix + res_type + '/' + data + '.png';
            }

            if (res_type) {
                var texture = PIXI.TextureCache[filename];
            }

            if (filename == undefined) {
                console.log(filename);
            }
            if (!texture) {

                return false;
            }

            if (res_type == 'mmap' || res_type == 'smap' || res_type == 'cloud' || res_type == 'head' || res_type.substring(0, 5) == 'fight' || res_type.substring(0, 3) == 'eft') {
                if (data in g.delta[res_type]) {
                    px = px - g.delta[res_type][data].dx;
                    py = py - g.delta[res_type][data].dy;
                }
            }

            if (!post_render) {
                if (res_type == 'head') {
                    g.gsprite[tex_key].setTexture(texture);
                    var mmap = g.gsprite[tex_key];
                }
                else if (tex_key in g.mainmap_tex) {
                    g.mainmap_tex[tex_key].setTexture(texture);
                    var mmap = g.mainmap_tex[tex_key];
                }
                mmap.x = px;
                mmap.y = py;

                mmap.visible = true;
            }

            if (color) {
                mmap.tint = color;
            }
            if (alpha) {
                mmap.alpha = alpha;
            }
            if (post_render) {
                if (is_man_pic) {
                    //var cx = 0;
                    var cx = 1024 * (ix + iy) + ix;
                    cx = 2 * cx;

                }
                else {
                    var cx = ((ix + iy) - (texture.width + 35) / 36 - (g.delta[res_type][data].dy - texture.height + 1) / 9) * 1024 + ix;
                    cx = 2 * cx + 1;
                }
                post_render[parseInt(cx)] = {'x' : px, 'y' : py, 't' : texture};
            }
        }
    };
    c.TextureManager.prototype.constructor = c.TextureManager;
    c.TextureManager.prototype.rand = function(i) {
        return parseInt(Math.random() * i);
    };
})(PIXI, g, c, window);
