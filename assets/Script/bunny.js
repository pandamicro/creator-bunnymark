var bunnys = [];
var bunnyFrames = [];
var currentFrame = null;
var bunnyType = 0;
var gravity = 0.5;

var maxX = 0;
var minX = 0;
var maxY = 0;
var minY = 0;

var startBunnyCount = 2;
var isAdding = false;
var count = 0;
var amount = 100;
var number;

var checking = false;
var totalDt = 0;
var frames = 0;
var startTime = 0;

function beforeUpdate () {
    if (checking) {
        startTime = Date.now();
    }
}

function afterDraw () {
    if (checking) {
        if (startTime === 0) {
            return;
        }
        var endTime = Date.now();
        totalDt += endTime - startTime;
        frames++;
    }
}

cc.Class({
    extends: cc.Component,

    properties: {
        tex: {
            type: cc.Texture2D,
            default: null
        },
        number: cc.Label
    },

    // use this for initialization
    onLoad: function () {
        if (!cc.sys.isNative && cc.sys.browserType !== cc.sys.BROWSER_TYPE_WECHAT_GAME) {
            var logo = document.createElement('img');
            logo.src = 'res/raw-assets/resources/HelloWorld.png';
            logo.style.position = 'absolute';
            logo.style.right = '0px';
            logo.style.bottom = '20px';
            logo.style.width = '64px';
            cc.game.container.appendChild(logo);
            var hint = document.createElement('img');
            hint.src = 'res/raw-assets/resources/click.png';
            hint.style.position = 'absolute';
            hint.style.right = '64px';
            hint.style.bottom = '30px';
            cc.game.container.appendChild(hint);
            number = document.createElement('div');
            number.style.position = 'absolute';
            number.style.left = '0px';
            number.style.width = '100%';
            number.style.top = '50%';
            number.style.textAlign = 'center';
            number.style.color = 'rgb(255, 255, 255)';
            number.style.font = 'bold 50px Helvetica, Arial';
            cc.game.container.appendChild(number);
        }
        else {
            number = this.number;
            number.node.active = true;
            number.node.zIndex = 100;
            cc.defineGetterSetter(number, 'innerText', function() {
                return number.string;
            }, function (value) {
                number.string = value;
            });
        }

        maxX = cc.winSize.width / 2;
        maxY = cc.winSize.height / 2;
        minX = -maxX;
        minY = -maxY;
        
        bunnyFrames.push( new cc.SpriteFrame(this.tex, cc.rect(2, 47, 26, 37)) );
        bunnyFrames.push( new cc.SpriteFrame(this.tex, cc.rect(2, 86, 26, 37)) );
        bunnyFrames.push( new cc.SpriteFrame(this.tex, cc.rect(2, 125, 26, 37)) );
        bunnyFrames.push( new cc.SpriteFrame(this.tex, cc.rect(2, 164, 26, 37)) );
        bunnyFrames.push( new cc.SpriteFrame(this.tex, cc.rect(2, 2, 26, 37)) );
        currentFrame = bunnyFrames[0];
        
        // for (var i = 0; i < startBunnyCount; i++) 
        // {
        //     var bunny = new cc.Node();
        //     var bunnysp = bunny.addComponent(cc.Sprite);
        //     bunnysp.spriteFrame = currentFrame;
        //     bunny.speedX = Math.random() * 10;
        //     bunny.speedY = (Math.random() * 10) - 5;
        //     bunny.x = minX + 10;
        //     bunny.y = maxY * 0.7;
            
        //     bunny.anchorX = 0.5;
        //     bunny.anchorY = 1;

        //     bunnys.push(bunny);

        //     this.node.addChild(bunny);
        // }
        // count = startBunnyCount;
        // number.innerText = count;
        
        this.node.on('touchstart', function () {
            isAdding = true;
        });
        this.node.on('touchend', function () {
            bunnyType++;
            bunnyType %= 5;
            currentFrame = bunnyFrames[bunnyType];
            isAdding = false;
        });
        this.node.on('touchcancel', function () {
            bunnyType++;
            bunnyType %= 5;
            currentFrame = bunnyFrames[bunnyType];
            isAdding = false;
        });

        // this.add();
        // this.addOne();
    },

    add: function () {
        this.addOnce();
        this.scheduleOnce(this.check, 5);
    },

    check: function () {
        checking = true;
        totalDt = 0;
        frames = 0;
        startTime = 0;
        cc.director.on(cc.Director.EVENT_BEFORE_UPDATE, beforeUpdate);
        cc.director.on(cc.Director.EVENT_AFTER_DRAW, afterDraw);
        this.scheduleOnce(this.checkEnd, 3);
    },

    checkEnd: function () {
        checking = false;
        cc.director.off(cc.Director.EVENT_BEFORE_UPDATE, beforeUpdate);
        cc.director.off(cc.Director.EVENT_AFTER_DRAW, afterDraw);
        var dt = totalDt / frames;
        if (dt > 20) {
            number.innerText = "STOPPED !!! \nFINAL SCORE : " + count;
        }
        else {
            bunnyType++;
            bunnyType %= 5;
            currentFrame = bunnyFrames[bunnyType];
            if (dt < 1) dt = 1;
            var extra = Math.floor(20 / dt);
            for (var i = 0; i < extra; i++) {
                this.addOnce();
            }
            this.add();
        }
    },

    addOne: function () {
        var bunny, bunnysp;
        bunny = new cc.Node();
        bunnysp = bunny.addComponent(cc.Sprite);
        bunnysp.spriteFrame = currentFrame;
        bunny.speedX = Math.random() * 10;
        bunny.speedY = (Math.random() * 10) - 5;
        bunny.x = minX + 10;
        bunny.y = maxY * 0.7;
        bunny.anchorY = 1;
        //bunny.alpha = 0.3 + Math.random() * 0.7;
        bunnys.push(bunny);
        bunny.scale = 0.5 + Math.random()*0.5;

        bunny.rotation = 360 * (Math.random()*0.2 - 0.1);

        this.node.addChild(bunny);
        count++;
        number.innerText = count;
    },

    addOnce: function () {
        var bunny, bunnysp, i;
        for (i = 0; i < amount; i++) {
            bunny = new cc.Node();
            bunnysp = bunny.addComponent(cc.Sprite);
            bunnysp.spriteFrame = currentFrame;
            bunny.speedX = Math.random() * 10;
            bunny.speedY = (Math.random() * 10) - 5;
            bunny.x = minX + 10;
            bunny.y = maxY * 0.7;
            bunny.anchorY = 1;
            //bunny.alpha = 0.3 + Math.random() * 0.7;
            bunnys.push(bunny);
            bunny.scale = 0.5 + Math.random()*0.5;

            bunny.rotation = 360 * (Math.random()*0.2 - 0.1);

            this.node.addChild(bunny);
            count++;
        }
        number.innerText = count;
    },

    // called every frame, uncomment this function to activate update callback
    update: function (dt) {
        if (isAdding) {
            this.addOnce();
        }

        // var start = new Date().getTime();
        for (var i = 0; i < bunnys.length; i++) 
        {
            var bunny = bunnys[i];
            
            var x = bunny.x + bunny.speedX;
            var y = bunny.y - bunny.speedY;
            bunny.speedY += gravity;
            
            if (x > maxX)
            {
                bunny.speedX *= -1;
                x = maxX;
            }
            else if (x < minX)
            {
                bunny.speedX *= -1;
                x = minX;
            }
            
            if (y < minY)
            {
                bunny.speedY *= -0.85;
                y = minY;
                if (Math.random() > 0.5)
                {
                    bunny.speedY -= Math.random() * 6;
                }
            } 
            else if (y > maxY)
            {
                bunny.speedY = 0;
                y = maxY;
            }
            bunny.setPosition(x, y);
        }
        // var end = new Date().getTime();
        // console.log('Update / Delta Time =', end-start, '/', dt*1000, '=', ((end-start)/(dt*1000)).toFixed(2));
    },
});
