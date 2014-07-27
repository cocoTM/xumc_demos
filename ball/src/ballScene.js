/**
 * Created by caicai on 14-7-27.
 */
var Ball = cc.Sprite.extend({
    velocity:null,
    ctor:function () {
        this._super(res.Ball_png);
        var size = cc.director.getWinSize();
        this.x = size.width/2;
        this.y = size.height/2;

        this.velocity = cc.p(10,10);
    },
    update:function(dt){
        this.setPosition(cc.pAdd(this.getPosition(), cc.pMult(this.velocity, dt)));
        this.checkHitEdge();
    },
    checkHitEdge: function() {
        var pos = this.getPosition();
        var winSize = cc.director.getWinSize();

        if (pos.x > winSize.width - this.width || pos.x < this.width) {
            this.velocity.x *= -1;
        } else if (pos.y > winSize.height - this.height || pos.y < this.height) {
            this.velocity.y *= -1;
        }
    }
});

var GameLayer = cc.Layer.extend({
    _ball:null,
    _touchBeginAt: null,
    ctor:function () {
        this._super();

        this._ball = new Ball();
        this.addChild(this._ball);

        cc.eventManager.addListener({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: true,
            onTouchBegan: this.onTouchBegan,
            onTouchMoved: this.onTouchMoved,
            onTouchEnded: this.onTouchEnded
        }, this);

        this.scheduleUpdate();
        return true;
    },

    update:function(dt){
        this._ball.update(dt);
    },

    onTouchBegan:function(touch, event) {
        this._touchBeginAt = touch.getLocation();
        console.log("begin")
        return true;
    },

    onTouchMoved:function(touch, event) {
    },

    onTouchEnded:function(touch, event) {
        console.log("end")
        var endAt = touch.getLocation();
        if(this._touchBeginAt == null) return true;
        var velocity = cc.pSub(endAt, this._touchBeginAt);
        event.getCurrentTarget()._ball.velocity = velocity;
        return true;
    }

});

var BallScene = cc.Scene.extend({
    layer:null,
    onEnter:function () {
        this._super();
        this.layer = new GameLayer();
        this.addChild(this.layer);

        this.schedule(this.update, 0);

    },
    update: function(dt){
        this.layer.update(dt);
    }

});
