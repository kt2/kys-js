(function (PIXI, g, c, window) {
	'use strict';
	
	c.Controls = function(j) {
		this.j = j;
		this.touchDevice = !!('ontouchstart' in window) || !!('onmsgesturechange' in window),
		this.keysPressed = [];
		this.touchX = null;
		this.touchY = null;
		this.iskeydown = false;
	};

	c.Controls.prototype.constructor = c.Controls;
    c.Controls.prototype.dealEvent = function() {
	};
    c.Controls.prototype.pendingEvent = function() {
	};
    c.Controls.prototype.start = function() {
        var scope = this;
        
        if(this.touchDevice) {			
			this.touchHandler = function(e) {
				e.preventDefault();
				if (g.pause_) {
					return false;
				}
				var curpos = {};
				curpos.x = e.touches[0].pageX;
				curpos.y = e.touches[0].pageY;
				//scope.dealEvent(e);
				scope.mouseClick(e, curpos);
			}
			document.addEventListener("touchstart", this.touchHandler);

        } else {
			this.mouseMoveHandler = function(e) {
				if (g.pause_) {
					return false;
				}
				scope.mouseMove(e);
			};
			this.mouseClickHandler = function(e) {
				if (g.pause_) {
					return false;
				}
                
				var stop = false;
				if (e.which == 1) {
					scope.j.gevent.onPressedOK(e);
					stop = scope.populate(e, 'onPressedOK');
					
				}
				if (e.which == 3) {
					stop = scope.populate(e, 'onPressedCancel');
				}
				if (!stop) {
				    scope.mouseClick(e);
				}
            };
			this.mouseWheelHandler = function(e) {
				
				scope.populate(e, 'wheelEvent');
			};
			this.mouseDownHandler = function(e) {
				if (g.pause_) {
					return false;
				}
                scope.mouseDown(e);
            };			
            this.keyDownHandler = function(e) {
				if (e.keyCode == 76) { //l
					if (g.current_language == 'gbk') {
						g.current_language = 'big5';
					}
					else {
						g.current_language = 'gbk';
					}
				};
				if (e.keyCode == 68) { //d
					if (document.getElementById('stats').style.display == 'none') {
						document.getElementById('stats').style.display = 'block';
					}
					else {
						document.getElementById('stats').style.display = 'none';
					}
				}
				if (e.keyCode == 66) { //B
				  g.frame_rate += 1;
				}
				if (e.keyCode == 70) { //F
				  g.frame_rate -= 1;
				}
				if (g.frame_rate < 1) {
					g.frame_rate = 1;
				}
				if (g.frame_rate > 6) {
					g.frame_rate = 6;
				}
				if (e.keyCode == 188) { //<
					PIXI.sound.volumeAll -= 0.1;
				}
				if (e.keyCode == 190) { //>
					PIXI.sound.volumeAll += 0.1;
				}
				if (PIXI.sound.volumeAll < 0) {
					PIXI.sound.volumeAll = 0;
				}
				if (PIXI.sound.volumeAll > 3) {
					PIXI.sound.volumeAll = 3;
				}
				var scale_change = 0;
				if (e.keyCode == 189) { //+
					g.scale_rate += 0.1;
					scale_change = 1;
				}
				if (e.keyCode == 187) { //-
					g.scale_rate -= 0.1;
					scale_change = 1;
				}
				if (scale_change) {
					if (g.scale_rate < 0.25) {
						g.scale_rate = 0.25;
					}
					if (g.scale_rate >= 0.95) {
						g.scale_rate = 0.95;
					}
					g.centerx = 1024 * g.scale_rate / 2;
					g.centery = 640 * g.scale_rate  / 2;
					scope.j.centerx = g.centerx;
					scope.j.centery = g.centery;
					scope.j.view.scale.x =  scope.j.win_width / (scope.j.centerx * 2);
					scope.j.view.scale.y =  scope.j.win_height / (scope.j.centery * 2);
				}
				
				if (g.pause_) {
					return false;
				}
                scope.keyDown(e);
				this.iskeydown = true;
            };
            
            this.keyUpHandler = function(e) {
				this.iskeydown = false;
				if (g.pause_) {
					return false;
				}
				scope.populate(e, 'dealEvent');
                
				if (e.keyCode == g.keyconfig.RET || e.keyCode == g.keyconfig.SPACE) {
					scope.j.gevent.onPressedOK(e);
					scope.populate(e, 'onPressedOK');

				}
				if (e.keyCode == g.keyconfig.ESC) {
					scope.populate(e, 'onPressedCancel');
				}
				scope.keyUp(e);
				
            };
			
			document.addEventListener('mousemove', this.mouseMoveHandler);
			document.addEventListener('click', this.mouseClickHandler);
			document.addEventListener('mousedown', this.mouseDownHandler);
			document.addEventListener('keydown', this.keyDownHandler);
            document.addEventListener('keyup', this.keyUpHandler);
            document.addEventListener('mousewheel', this.mouseWheelHandler);
        }
        
    };
    
    c.Controls.prototype.stop = function() {
        if(this.touchDevice) {
			document.removeEventListener("touchstart", this.touchHandler);
        } else {
            document.removeEventListener('mousemove', this.mouseMoveHandler);
            document.removeEventListener('click', this.mouseClickHandler);
            document.removeEventListener('keydown', this.keyDownHandler);
            document.removeEventListener('keyup', this.keyUpHandler);
        }
        
    };
    c.Controls.prototype.mouseMove = function(e, mousepos) {
		if (!mousepos) {
			mousepos = g.app.renderer.plugins.interaction.mouse.global;
		}
		this.populate(e, 'mouseMove', mousepos);
	};
	c.Controls.prototype.populate_child = function(e, etype, mousepos, child) {
		var stop = 0;
		if (child.visible && child.custom_items  && !child.skip_event) {
			for (var i in child.custom_items) {
				var inchild = child.custom_items[i];
				stop = this.populate_child(e, etype, mousepos, inchild);
				if (stop) {
					return stop;
				}
			};
		};
		if (child.visible && !child.skip_event && typeof child[etype] === 'function') {
			stop = child[etype](e, mousepos);
		}
		return stop;
	};
	c.Controls.prototype.populate = function(e, etype, mousepos) {
		var ui_running = 0;
		if (this.j.viewui.custom_items) {
			for (var i in this.j.viewui.custom_items) {
				var child = this.j.viewui.custom_items[i];
				if (child.visible) {
					ui_running = 1;
					if (!child.skip_event) {
						var stop = this.populate_child(e, etype, mousepos, child);
						if (stop) {
							return stop;
						}
					}
				}
			};
		}
		if (!ui_running || this.j.target == this.j.battle) {
			if (typeof this.j.target[etype] === 'function') {
				this.j.target[etype](e, mousepos);
			}
		}
		return stop;
	};
    c.Controls.prototype.mouseDown = function(e, mousepos) {
		if (!mousepos) {
			mousepos = g.app.renderer.plugins.interaction.mouse.global;
		}
		this.populate(e, 'mouseDown', mousepos);
	};
    c.Controls.prototype.mouseClick = function(e, mousepos) {
		if (!mousepos) {
			mousepos = g.app.renderer.plugins.interaction.mouse.global;
		}
		this.populate(e, 'dealEvent');
		this.populate(e, 'mouseClick', mousepos);
    };
    c.Controls.prototype.keyDown = function(e) {
		this.populate(e, 'keyDown');
    };
    
    c.Controls.prototype.keyUp = function(e) {
		this.populate(e, 'keyUp');
    };
        
})(PIXI, g, c, window);
