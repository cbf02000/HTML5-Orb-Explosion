var context;
var explosionObj = [];

function fixSizing(){
    $("#canv").attr({height:$("#wrapper").height()});
    $("#canv").attr({width:$("#wrapper").width()});
}

function Explosion(ctx, x, y, hue, level) {

    var self = this;

    var HUE_RANGE = 20;
    var BASE_SIZE = 20;
    var BASE_SPEED = 5
    var DECREASE_RATE = 0.2;

    this.ctx = ctx;
    this.x = x;
    this.y = y;
    this.hue = hue;
    this.level = level;
    this.circles = [];

    this.particle = function() {        
        //Random radius between 2 and 6
        this.radius = (BASE_SIZE / 2) + Math.random()*BASE_SIZE; 
        
        this.currentX = self.x;
        this.currentY = self.y;

        //Random velocities
        this.vx = -BASE_SPEED + Math.random() * BASE_SPEED * 2;
        this.vy = -BASE_SPEED + Math.random() * BASE_SPEED * 2;
        
        //Random colors
        var targetHue = self.hue - HUE_RANGE + (Math.round(Math.random()*(HUE_RANGE*2)));
        if (targetHue < 0) {
            targetHue = 360 + targetHue;
        } else if (targetHue > 360) {
            targetHue = targetHue - 360;
        }

        var targetColor = hue2rgb(targetHue);
        this.r = targetColor.r;
        this.g = targetColor.g;
        this.b = targetColor.b;

    }

    this.draw = function(radius) {

        if (this.circles.length == 0) {
            return false;
        } else {        
            //Fill the canvas with circles
            for(var j = 0; j < this.circles.length; j++){
                var c = this.circles[j];            
                
                //Create the circles
                this.ctx.beginPath();
                this.ctx.arc(c.currentX, c.currentY, c.radius, 0, Math.PI*2, false);
                this.ctx.fillStyle = "rgba("+c.r+", "+c.g+", "+c.b+", 0.5)";
                this.ctx.fill();

                c.currentX += c.vx;
                c.currentY += c.vy;
                c.radius -= DECREASE_RATE;

                if (c.radius < 0) {
                    this.circles.splice(j, 1);
                }
            }

            return true;
        }

    }

    this.init = function() {

        if (this.level == null) {
            this.level = 5;
        } else if (this.level > 10) {
            this.level = 10;
        }

        for (var i = 0; i < this.level * 100; i++) {
            this.circles.push(new this.particle());
        }

    }

}

function animate() {

    context.globalCompositeOperation = "source-over";
    context.clearRect(0, 0, $("#canv").width(), $("#canv").height());

    //context.globalCompositeOperation = 'lighter';
    for (var i = 0; i < explosionObj.length; i++) {
        if (explosionObj[i].draw() == false) {
            explosionObj.splice(i, 1);
        }
    }

    requestAnimationFrame(animate);
}

$(function () {

    fixSizing();

    context = document.getElementById('canv').getContext("2d");

    setInterval(function(){
        var explosion = new Explosion(context, Math.random()*500, Math.random()*500, Math.random() * 360,1);
        explosion.init();
        explosionObj.push(explosion);
    },1000);

    animate();

});
