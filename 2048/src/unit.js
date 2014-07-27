/**
 * Created by caicai on 14-7-22.
 */

var Unit = cc.Sprite.extend({
    posX:0,
    posY:0,
    value:0,
    gotoLeft:function(){
        if(this._collapseLeft()){
            this._moveTo(this.posY, 0);
        }else{
            var leftUnit = this._collapseLeftWith();
            if(this.value == leftUnit.value){
                this._moveTo(leftUnit.posY,leftUnit.posX);
                this._merge(leftUnit);
            }else{
                this._moveTo(leftUnit.posY, leftUnit.posX + 1);
            }
        }

    },
    destroy:function(){
        //to-do destroy self
        alert("hello")
    },
    _collapseLeft:function(){
        for(i = this.posX -1; i>=0 ;i--){
            if(board[posY][i] != null){
                return false;
            }
        }
        return true;
    },
    _collapseLeftWith:function(){
        var collapsed = true;
        i = this.posX;
//        loop{
//            i--;
//        }until(board[posY][i] != null || i<0);

        return board[posY][i];
    },
    _moveTo:function(posY, posX){
        //to-do move action
        this.posY = posY;
        this.posX = posX;
    },
    _merge:function(unit){
        this.value *= 2;
        unit.destroy();
    }
});
