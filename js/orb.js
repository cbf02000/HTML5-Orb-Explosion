var context;
var orbObj = [];

function fixSizing(){
    $("#canv").attr({height:$("#wrapper").height()});
    $("#canv").attr({width:$("#wrapper").width()});
}

function Orb(ctx, x, y, hue, speed) {
    
    var ORB_MIN = 100;
    var ORB_MAX = 200;
    var OBB_GROW_RATE = 10;

    var self = this;
    
    this.radius = {value: 0};
    this.shrinkRadius = {value: 0};
    this.growRadius = {value: 0};
    this.tweenGrow = new TWEEN.Tween(self.radius);
    this.tweenShrink = new TWEEN.Tween(self.radius);
    this.ctx = ctx;
    this.x = x;
    this.y = y;
    this.color = hue2rgb(hue);
    this.speed = speed;

    this.drawOrb = function(rad){

        this.ctx.beginPath();
        var edgecolor1 = "rgba(" + this.color.r + "," + this.color.g + "," + this.color.b + ",0.9)";
        var edgecolor2 = "rgba(" + this.color.r + "," + this.color.g + "," + this.color.b + ",0.6)";
        var edgecolor3 = "rgba(" + this.color.r + "," + this.color.g + "," + this.color.b + ",0.1)";
        var edgecolor4 = "rgba(" + this.color.r + "," + this.color.g + "," + this.color.b + ",0)";
        var gradblur = this.ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, rad);
        gradblur.addColorStop(0,edgecolor1);
        gradblur.addColorStop(0.4,edgecolor1);
        gradblur.addColorStop(0.7,edgecolor2);
        gradblur.addColorStop(0.9,edgecolor3);
        gradblur.addColorStop(1,edgecolor4);
        this.ctx.fillStyle = gradblur;
        this.ctx.arc(this.x, this.y, rad, 0, Math.PI*2, false);
        this.ctx.fill();

    };

    this.init = function() {

        this.growRadius.value = ORB_MIN + OBB_GROW_RATE;
        this.shrinkRadius.value = ORB_MIN;
        this.radius.value = ORB_MIN;

        this.tweenGrow.to(self.growRadius, this.speed/2);
        this.tweenGrow.easing(TWEEN.Easing.Circular.Out);
        this.tweenGrow.onStart(function() {
            self.tweenGrow.to(self.growRadius, self.speed/2);
        });
        this.tweenGrow.onUpdate(function () {

            self.radius.value = this.value;
            self.drawOrb(this.value);
        });
        this.tweenGrow.onComplete(function () {

            self.shrinkRadius.value = ORB_MIN;
        });


        this.tweenShrink.to(self.shrinkRadius, this.speed/2);
        this.tweenShrink.easing(TWEEN.Easing.Circular.In);
        this.tweenShrink.onStart(function() {
            self.tweenShrink.to(self.shrinkRadius, self.speed/2);
        });
        this.tweenShrink.onUpdate(function () {
            self.radius.value = this.value;
            self.drawOrb(this.value);
        });    
        this.tweenShrink.onComplete(function () {
            if (self.growRadius.value < ORB_MAX) {
                self.growRadius.value = self.growRadius.value + OBB_GROW_RATE;
            }
        });


        this.tweenGrow.chain(self.tweenShrink);

        this.tweenShrink.chain(self.tweenGrow);
    }

    this.start = function() {
        this.tweenGrow.start();
    }

    this.stop = function() {
        this.tweenGrow.stop();
        this.tweenShrink.stop();

        this.ctx.globalCompositeOperation = "source-over";
        this.ctx.fillStyle = "rgba(0, 0, 0, 1)";
        this.ctx.fillRect(0, 0, $("#canv").width(), $("#canv").height());
    }
}

function animate() {

    context.globalCompositeOperation = "source-over";
    context.clearRect(0, 0, $("#canv").width(), $("#canv").height());

    //context.globalCompositeOperation = 'lighter';

    requestAnimationFrame(animate);
    TWEEN.update();
}

$(function () {
    fixSizing();

    context = document.getElementById('canv').getContext('2d');

    for (var i = 0; i < 3; i++) {
        var orb = new Orb(context, Math.random()*400, Math.random()*400, Math.random()*360, 1000);
        orbObj.push(orb);
        orbObj[i].init();
        orbObj[i].start();
    }
    
    setTimeout(function() {
        for (var i = 0; i < 3; i++) {
            orbObj[i].stop();
        }
    }, 10000);

    animate();

    
})

