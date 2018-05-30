(function (window) {
    'use strict';

    if (window.g) { return; }

    var g = {
        volume : 0.1,
        get config() {
            return {
                fixed_update : 0,
                debug : 1,
                tilew : 18,
                tileh : 9,
                margin : 60,
                astar_limit : 1000,
                talk_up : 0,
                talk_down : 1,
                talk_width : 40,
                talk_height : 5
            };
        }
    };
    g.delta = {};
    g.mainmap_tex = [];
    g.graphics = [];
    g.gsprite = [];
    g.txt = [];
    g.mmap_res = {};
    g.debug = '';
    g.frame_rate = 3;
    g.resload = {};
    g.resload['save'] = 1;
    g.resload['subscene'] = 1;
    g.resload['mainmap'] = 1;
    g.resload['ui'] = 1;
    g.current_language = 'gbk';
    g.stats = new Stats();
    g.stats.setMode( 0 );


    if (1) {
        g.scale_rate = 4.5 / 6;
        // load original resources
        // g.prefix = 'original-';

        // load sprite sheet
        g.prefix = '';
        g.win_width = 1024;
        g.win_height = 640;
        g.centerx = 1024 * g.scale_rate / 2;
        g.centery = 640 * g.scale_rate  / 2;

    }
    else {
        g.prefix = '';
        g.win_width = document.documentElement.clientWidth;
        g.win_height = document.documentElement.clientHeight;
        g.centerx = document.documentElement.clientWidth * 3 / 5 / 2;
        g.centery = document.documentElement.clientHeight * 3 / 5 / 2;
    }


    window.g = g;
    window.c = {};

})(window);
