/****************************************************************************
 Copyright (c) 2011-2012 cocos2d-x.org
 Copyright (c) 2013-2014 Chukong Technologies Inc.

 http://www.cocos2d-x.org

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 ****************************************************************************/

/**
 * Base class for ccui.CheckBox
 * @class
 * @extends ccui.Widget
 *
 * @property {Boolean}  selected    - Indicate whether the check box has been selected
 */
ccui.CheckBox = ccui.Widget.extend(/** @lends ccui.CheckBox# */{
    _backGroundBoxRenderer: null,
    _backGroundSelectedBoxRenderer: null,
    _frontCrossRenderer: null,
    _backGroundBoxDisabledRenderer: null,
    _frontCrossDisabledRenderer: null,
    _isSelected: true,
    _checkBoxEventListener: null,
    _checkBoxEventSelector:null,
    _checkBoxEventCallback: null,
    _backGroundTexType: ccui.Widget.LOCAL_TEXTURE,
    _backGroundSelectedTexType: ccui.Widget.LOCAL_TEXTURE,
    _frontCrossTexType: ccui.Widget.LOCAL_TEXTURE,
    _backGroundDisabledTexType: ccui.Widget.LOCAL_TEXTURE,
    _frontCrossDisabledTexType: ccui.Widget.LOCAL_TEXTURE,
    _backGroundFileName: "",
    _backGroundSelectedFileName: "",
    _frontCrossFileName: "",
    _backGroundDisabledFileName: "",
    _frontCrossDisabledFileName: "",
    _className: "CheckBox",

    _backGroundBoxRendererAdaptDirty:true,
    _backGroundSelectedBoxRendererAdaptDirty:true,
    _frontCrossRendererAdaptDirty: true,
    _backGroundBoxDisabledRendererAdaptDirty: true,
    _frontCrossDisabledRendererAdaptDirty: true,

    /**
     * allocates and initializes a UICheckBox.
     * Constructor of ccui.CheckBox
     * @example
     * // example
     * var uiCheckBox = new ccui.CheckBox();
     */
    ctor: function () {
        ccui.Widget.prototype.ctor.call(this);
    },
    init: function (backGround, backGroundSeleted, cross, backGroundDisabled, frontCrossDisabled, texType) {
        if (ccui.Widget.prototype.init.call(this)) {
            this._isSelected = true;
            this.setTouchEnabled(true);
//            this.setSelectedState(false);
            if(backGround === undefined)
                this.loadTextures(backGround, backGroundSeleted, cross, backGroundDisabled, frontCrossDisabled, texType);
            return true;
        }
        return false;
    },

    initRenderer: function () {
        this._backGroundBoxRenderer = cc.Sprite.create();
        this._backGroundSelectedBoxRenderer = cc.Sprite.create();
        this._frontCrossRenderer = cc.Sprite.create();
        this._backGroundBoxDisabledRenderer = cc.Sprite.create();
        this._frontCrossDisabledRenderer = cc.Sprite.create();
        this.addProtectedChild(this._backGroundBoxRenderer, ccui.CheckBox.BOX_RENDERER_ZORDER, -1);
        this.addProtectedChild(this._backGroundSelectedBoxRenderer, ccui.CheckBox.BOX_SELECTED_RENDERER_ZORDER, -1);
        this.addProtectedChild(this._frontCrossRenderer, ccui.CheckBox.FRONT_CROSS_RENDERER_ZORDER, -1);
        this.addProtectedChild(this._backGroundBoxDisabledRenderer, ccui.CheckBox.BOX_DISABLED_RENDERER_ZORDER, -1);
        this.addProtectedChild(this._frontCrossDisabledRenderer, ccui.CheckBox.FRONT_CROSS_DISABLED_RENDERER_ZORDER, -1);

        window.test = [
            this._backGroundBoxRenderer,
            this._backGroundSelectedBoxRenderer,
            this._frontCrossRenderer,
            this._backGroundBoxDisabledRenderer,
            this._frontCrossDisabledRenderer
        ];

        window.a = this;
    },

    /**
     * Load textures for checkbox.
     * @param {String} backGround
     * @param {String} backGroundSelected
     * @param {String} cross
     * @param {String} backGroundDisabled
     * @param {String} frontCrossDisabled
     * @param {ccui.Widget.LOCAL_TEXTURE|ccui.Widget.PLIST_TEXTURE} texType
     */
    loadTextures: function (backGround, backGroundSelected, cross, backGroundDisabled, frontCrossDisabled, texType) {
        this.loadTextureBackGround(backGround, texType);
        this.loadTextureBackGroundSelected(backGroundSelected, texType);
        this.loadTextureFrontCross(cross, texType);
        this.loadTextureBackGroundDisabled(backGroundDisabled, texType);
        this.loadTextureFrontCrossDisabled(frontCrossDisabled, texType);
    },

    /**
     * Load backGround texture for checkbox.
     * @param {String} backGround
     * @param {ccui.Widget.LOCAL_TEXTURE|ccui.Widget.PLIST_TEXTURE} texType
     */
    loadTextureBackGround: function (backGround, texType) {
        if (!backGround)
            return;

        texType = texType || ccui.Widget.LOCAL_TEXTURE;
        this._backGroundFileName = backGround;
        this._backGroundTexType = texType;
        var bgBoxRenderer = this._backGroundBoxRenderer;
        switch (this._backGroundTexType) {
            case ccui.Widget.LOCAL_TEXTURE:
                bgBoxRenderer.setTexture(backGround);
                break;
            case ccui.Widget.PLIST_TEXTURE:
                bgBoxRenderer.setSpriteFrame(backGround);
                break;
            default:
                break;
        }

        this.backGroundTextureScaleChangedWithSize();       //TODO need test
        if (!bgBoxRenderer.textureLoaded()) {
            this._backGroundBoxRenderer.setContentSize(this._customSize);
            bgBoxRenderer.addLoadedEventListener(function () {
                this.backGroundTextureScaleChangedWithSize();
            }, this);
        }
        this.updateFlippedX();
        this.updateFlippedY();
        this._backGroundBoxRenderer.setColor(this.getColor());
        this._backGroundBoxRenderer.setOpacity(this.getOpacity());

        this._updateContentSizeWithTextureSize(this._backGroundBoxRenderer.getContentSize());
        this._backGroundBoxRendererAdaptDirty = true;
    },
    /**
     * Load backGroundSelected texture for checkbox.
     * @param {String} backGroundSelected
     * @param {ccui.Widget.LOCAL_TEXTURE|ccui.Widget.PLIST_TEXTURE} texType
     */
    loadTextureBackGroundSelected: function (backGroundSelected, texType) {
        if (!backGroundSelected)
            return;

        texType = texType || ccui.Widget.LOCAL_TEXTURE;
        this._backGroundSelectedFileName = backGroundSelected;
        this._backGroundSelectedTexType = texType;
        switch (this._backGroundSelectedTexType) {
            case ccui.Widget.LOCAL_TEXTURE:
                this._backGroundSelectedBoxRenderer.setTexture(backGroundSelected);
                break;
            case ccui.Widget.PLIST_TEXTURE:
                this._backGroundSelectedBoxRenderer.setSpriteFrame(backGroundSelected);
                break;
            default:
                break;
        }

        this.updateFlippedX();
        this.updateFlippedY();
        this._backGroundSelectedBoxRenderer.setColor(this.getColor());
        this._backGroundSelectedBoxRenderer.setOpacity(this.getOpacity());
        this._backGroundSelectedBoxRendererAdaptDirty = true;
    },

    /**
     * Load cross texture for checkbox.
     * @param {String} cross
     * @param {ccui.Widget.LOCAL_TEXTURE|ccui.Widget.PLIST_TEXTURE} texType
     */
    loadTextureFrontCross: function (cross, texType) {
        if (!cross)
            return;
        texType = texType || ccui.Widget.LOCAL_TEXTURE;
        this._frontCrossFileName = cross;
        this._frontCrossTexType = texType;
        switch (this._frontCrossTexType) {
            case ccui.Widget.LOCAL_TEXTURE:
                this._frontCrossRenderer.setTexture(cross);
                break;
            case ccui.Widget.PLIST_TEXTURE:
                this._frontCrossRenderer.setSpriteFrame(cross);
                break;
            default:
                break;
        }
        this.updateFlippedX();
        this.updateFlippedY();
        this._frontCrossRenderer.setColor(this.getColor());
        this._frontCrossRenderer.setOpacity(this.getOpacity());
        this._frontCrossRendererAdaptDirty = true;
    },

    /**
     * Load backGroundDisabled texture for checkbox.
     * @param {String} backGroundDisabled
     * @param {ccui.Widget.LOCAL_TEXTURE|ccui.Widget.PLIST_TEXTURE} texType
     */
    loadTextureBackGroundDisabled: function (backGroundDisabled, texType) {
        if (!backGroundDisabled)
            return;
        texType = texType || ccui.Widget.LOCAL_TEXTURE;
        this._backGroundDisabledFileName = backGroundDisabled;
        this._backGroundDisabledTexType = texType;
        switch (this._backGroundDisabledTexType) {
            case ccui.Widget.LOCAL_TEXTURE:
                this._backGroundBoxDisabledRenderer.setTexture(backGroundDisabled);
                break;
            case ccui.Widget.PLIST_TEXTURE:
                this._backGroundBoxDisabledRenderer.setSpriteFrame(backGroundDisabled);
                break;
            default:
                break;
        }
        this.updateFlippedX();
        this.updateFlippedY();
        this._backGroundBoxDisabledRenderer.setColor(this.getColor());
        this._backGroundBoxDisabledRenderer.setOpacity(this.getOpacity());
        this._backGroundBoxDisabledRendererAdaptDirty = true;
    },

    /**
     * Load frontCrossDisabled texture for checkbox.
     * @param {String} frontCrossDisabled
     * @param {ccui.Widget.LOCAL_TEXTURE|ccui.Widget.PLIST_TEXTURE} texType
     */
    loadTextureFrontCrossDisabled: function (frontCrossDisabled, texType) {
        if (!frontCrossDisabled)
            return;
        texType = texType || ccui.Widget.LOCAL_TEXTURE;
        this._frontCrossDisabledFileName = frontCrossDisabled;
        this._frontCrossDisabledTexType = texType;
        switch (this._frontCrossDisabledTexType) {
            case ccui.Widget.LOCAL_TEXTURE:
                this._frontCrossDisabledRenderer.setTexture(frontCrossDisabled);
                break;
            case ccui.Widget.PLIST_TEXTURE:
                this._frontCrossDisabledRenderer.setSpriteFrame(frontCrossDisabled);
                break;
            default:
                break;
        }
        this.updateFlippedX();
        this.updateFlippedY();
        this._frontCrossDisabledRenderer.setColor(this.getColor());
        this._frontCrossDisabledRenderer.setOpacity(this.getOpacity());
        this._frontCrossDisabledRendererAdaptDirty = true;
    },

    onPressStateChangedToNormal: function () {
        this._backGroundBoxRenderer.setVisible(true);
        this._backGroundSelectedBoxRenderer.setVisible(false);
        this._backGroundBoxDisabledRenderer.setVisible(false);
        this._frontCrossDisabledRenderer.setVisible(false);
    },

    onPressStateChangedToPressed: function () {
        this._backGroundBoxRenderer.setVisible(false);
        this._backGroundSelectedBoxRenderer.setVisible(true);
        this._backGroundBoxDisabledRenderer.setVisible(false);
        this._frontCrossDisabledRenderer.setVisible(false);
    },

    onPressStateChangedToDisabled: function () {
        this._backGroundBoxRenderer.setVisible(false);
        this._backGroundSelectedBoxRenderer.setVisible(false);
        this._backGroundBoxDisabledRenderer.setVisible(true);
        this._frontCrossRenderer.setVisible(false);
        if (this._isSelected) {
            this._frontCrossDisabledRenderer.setVisible(true);
        }
    },

    setSelectedState: function (selected) {
        if (selected == this._isSelected)
            return;
        this._isSelected = selected;
        this._frontCrossRenderer.setVisible(this._isSelected);
    },

    getSelectedState: function () {
        return this._isSelected;
    },

    selectedEvent: function () {
        if(this._checkBoxEventCallback)
            this._checkBoxEventCallback(this, ccui.CheckBox.EVENT_SELECTED);
        if (this._checkBoxEventListener && this._checkBoxEventSelector)
            this._checkBoxEventSelector.call(this._checkBoxEventListener, this, ccui.CheckBox.EVENT_SELECTED);
    },

    unSelectedEvent: function () {
        if(this._checkBoxEventCallback)
            this._checkBoxEventCallback(this, ccui.CheckBox.EVENT_UNSELECTED);
        if (this._checkBoxEventListener && this._checkBoxEventSelector)
            this._checkBoxEventSelector.call(this._checkBoxEventListener, this, ccui.CheckBox.EVENT_UNSELECTED);
    },

    releaseUpEvent: function(){
        ccui.Widget.prototype.releaseUpEvent.call(this);

        if (this._isSelected){
            this.setSelectedState(false);
            this.unSelectedEvent();
        } else {
            this.setSelectedState(true);
            this.selectedEvent();
        }
    },

    /**
     * add event listener
     * @param {Function} selector
     * @param {Object} target
     */
    addEventListenerCheckBox: function (selector, target) {
        this._checkBoxEventSelector = selector;
        this._checkBoxEventListener = target;
    },

    addEventListener: function(callback){
        this._checkBoxEventCallback = callback;
    },

    getVirtualRendererSize: function(){
        return this._backGroundBoxRenderer.getContentSize();
    },

    updateFlippedX: function () {
        this._backGroundBoxRenderer.setFlippedX(this._flippedX);
        this._backGroundSelectedBoxRenderer.setFlippedX(this._flippedX);
        this._frontCrossRenderer.setFlippedX(this._flippedX);
        this._backGroundBoxDisabledRenderer.setFlippedX(this._flippedX);
        this._frontCrossDisabledRenderer.setFlippedX(this._flippedX);
    },

    updateFlippedY: function () {
        this._backGroundBoxRenderer.setFlippedY(this._flippedY);
        this._backGroundSelectedBoxRenderer.setFlippedY(this._flippedY);
        this._frontCrossRenderer.setFlippedY(this._flippedY);
        this._backGroundBoxDisabledRenderer.setFlippedY(this._flippedY);
        this._frontCrossDisabledRenderer.setFlippedY(this._flippedY);
    },

    /**
     * override "setAnchorPoint" of widget.
     * @param {cc.Point|Number} point The anchor point of UICheckBox or The anchor point.x of UICheckBox.
     * @param {Number} [y] The anchor point.y of UICheckBox.
     */
    setAnchorPoint: function (point, y) {
        if (y === undefined) {
            ccui.Widget.prototype.setAnchorPoint.call(this, point);
            this._backGroundBoxRenderer.setAnchorPoint(point);
            this._backGroundSelectedBoxRenderer.setAnchorPoint(point);
            this._backGroundBoxDisabledRenderer.setAnchorPoint(point);
            this._frontCrossRenderer.setAnchorPoint(point);
            this._frontCrossDisabledRenderer.setAnchorPoint(point);
        } else {
            ccui.Widget.prototype.setAnchorPoint.call(this, point, y);
            this._backGroundBoxRenderer.setAnchorPoint(point, y);
            this._backGroundSelectedBoxRenderer.setAnchorPoint(point, y);
            this._backGroundBoxDisabledRenderer.setAnchorPoint(point, y);
            this._frontCrossRenderer.setAnchorPoint(point, y);
            this._frontCrossDisabledRenderer.setAnchorPoint(point, y);
        }
    },
    _setAnchorX: function (value) {
        ccui.Widget.prototype._setAnchorX.call(this, value);
        this._backGroundBoxRenderer._setAnchorX(value);
        this._backGroundSelectedBoxRenderer._setAnchorX(value);
        this._backGroundBoxDisabledRenderer._setAnchorX(value);
        this._frontCrossRenderer._setAnchorX(value);
        this._frontCrossDisabledRenderer._setAnchorX(value);
    },
    _setAnchorY: function (value) {
        ccui.Widget.prototype._setAnchorY.call(this, value);
        this._backGroundBoxRenderer._setAnchorY(value);
        this._backGroundSelectedBoxRenderer._setAnchorY(value);
        this._backGroundBoxDisabledRenderer._setAnchorY(value);
        this._frontCrossRenderer._setAnchorY(value);
        this._frontCrossDisabledRenderer._setAnchorY(value);
    },

    onSizeChanged: function () {
        ccui.Widget.prototype.onSizeChanged.call(this);
        this._backGroundBoxRendererAdaptDirty = true;
        this._backGroundSelectedBoxRendererAdaptDirty = true;
        this._frontCrossRendererAdaptDirty = true;
        this._backGroundBoxDisabledRendererAdaptDirty = true;
        this._frontCrossDisabledRendererAdaptDirty = true;
    },

    /**
     * override "getContentSize" method of widget.
     * @returns {cc.Size}
     */
    getContentSize: function () {
        return this._backGroundBoxRenderer.getContentSize();
    },
    _getWidth: function () {
        return this._backGroundBoxRenderer._getWidth();
    },
    _getHeight: function () {
        return this._backGroundBoxRenderer._getHeight();
    },

    /**
     * override "getVirtualRenderer" method of widget.
     * @returns {cc.Node}
     */
    getVirtualRenderer: function () {
        return this._backGroundBoxRenderer;
    },

    backGroundTextureScaleChangedWithSize: function () {
        if (this._ignoreSize)
            this._backGroundBoxRenderer.setScale(1.0);
        else{
            var textureSize = this._backGroundBoxRenderer.getContentSize();
            if (textureSize.width <= 0.0 || textureSize.height <= 0.0){
                this._backGroundBoxRenderer.setScale(1.0);
                return;
            }
            var scaleX = this._size.width / textureSize.width;
            var scaleY = this._size.height / textureSize.height;
            this._backGroundBoxRenderer.setScaleX(scaleX);
            this._backGroundBoxRenderer.setScaleY(scaleY);
        }

        var x = this._contentSize.width / 2;
        var y = this._contentSize.height / 2;
        this._backGroundBoxRenderer.setPosition(x, y);
        this._backGroundSelectedBoxRenderer.setPosition(x, y);
        this._frontCrossRenderer.setPosition(x, y);
        this._backGroundBoxDisabledRenderer.setPosition(x, y);
        this._frontCrossDisabledRenderer.setPosition(x, y);
    },

    backGroundSelectedTextureScaleChangedWithSize: function () {
        if (this._ignoreSize) {
            this._backGroundSelectedBoxRenderer.setScale(1.0);
        } else {
            var textureSize = this._backGroundSelectedBoxRenderer.getContentSize();
            if (textureSize.width <= 0.0 || textureSize.height <= 0.0) {
                this._backGroundSelectedBoxRenderer.setScale(1.0);
                return;
            }
            var scaleX = this._size.width / textureSize.width;
            var scaleY = this._size.height / textureSize.height;
            this._backGroundSelectedBoxRenderer.setScaleX(scaleX);
            this._backGroundSelectedBoxRenderer.setScaleY(scaleY);
        }
    },

    frontCrossTextureScaleChangedWithSize: function () {
        if (this._ignoreSize) {
            this._frontCrossRenderer.setScale(1.0);
        } else {
            var textureSize = this._frontCrossRenderer.getContentSize();
            if (textureSize.width <= 0.0 || textureSize.height <= 0.0) {
                this._frontCrossRenderer.setScale(1.0);
                return;
            }
            var scaleX = this._size.width / textureSize.width;
            var scaleY = this._size.height / textureSize.height;
            this._frontCrossRenderer.setScaleX(scaleX);
            this._frontCrossRenderer.setScaleY(scaleY);
        }
    },

    backGroundDisabledTextureScaleChangedWithSize: function () {
        if (this._ignoreSize) {
            this._backGroundBoxDisabledRenderer.setScale(1.0);
        }else {
            var textureSize = this._backGroundBoxDisabledRenderer.getContentSize();
            if (textureSize.width <= 0.0 || textureSize.height <= 0.0) {
                this._backGroundBoxDisabledRenderer.setScale(1.0);
                return;
            }
            var scaleX = this._size.width / textureSize.width;
            var scaleY = this._size.height / textureSize.height;
            this._backGroundBoxDisabledRenderer.setScaleX(scaleX);
            this._backGroundBoxDisabledRenderer.setScaleY(scaleY);
        }
    },

    frontCrossDisabledTextureScaleChangedWithSize: function () {
        if (this._ignoreSize) {
            this._frontCrossDisabledRenderer.setScale(1.0);
        } else {
            var textureSize = this._frontCrossDisabledRenderer.getContentSize();
            if (textureSize.width <= 0.0 || textureSize.height <= 0.0) {
                this._frontCrossDisabledRenderer.setScale(1.0);
                return;
            }
            var scaleX = this._size.width / textureSize.width;
            var scaleY = this._size.height / textureSize.height;
            this._frontCrossDisabledRenderer.setScaleX(scaleX);
            this._frontCrossDisabledRenderer.setScaleY(scaleY);
        }
    },

    updateTextureColor: function () {
        this.updateColorToRenderer(this._backGroundBoxRenderer);
        this.updateColorToRenderer(this._backGroundSelectedBoxRenderer);
        this.updateColorToRenderer(this._frontCrossRenderer);
        this.updateColorToRenderer(this._backGroundBoxDisabledRenderer);
        this.updateColorToRenderer(this._frontCrossDisabledRenderer);
    },

    updateTextureOpacity: function () {
        this.updateOpacityToRenderer(this._backGroundBoxRenderer);
        this.updateOpacityToRenderer(this._backGroundSelectedBoxRenderer);
        this.updateOpacityToRenderer(this._frontCrossRenderer);
        this.updateOpacityToRenderer(this._backGroundBoxDisabledRenderer);
        this.updateOpacityToRenderer(this._frontCrossDisabledRenderer);
    },

    /**
     * Returns the "class name" of widget.
     * @returns {string}
     */
    getDescription: function () {
        return "CheckBox";
    },

    createCloneInstance: function () {
        return ccui.CheckBox.create();
    },

    copySpecialProperties: function (uiCheckBox) {
        if (uiCheckBox instanceof ccui.CheckBox) {
            this.loadTextureBackGround(uiCheckBox._backGroundFileName, uiCheckBox._backGroundTexType);
            this.loadTextureBackGroundSelected(uiCheckBox._backGroundSelectedFileName, uiCheckBox._backGroundSelectedTexType);
            this.loadTextureFrontCross(uiCheckBox._frontCrossFileName, uiCheckBox._frontCrossTexType);
            this.loadTextureBackGroundDisabled(uiCheckBox._backGroundDisabledFileName, uiCheckBox._backGroundDisabledTexType);
            this.loadTextureFrontCrossDisabled(uiCheckBox._frontCrossDisabledFileName, uiCheckBox._frontCrossDisabledTexType);
            this.setSelectedState(uiCheckBox._isSelected);
            this._checkBoxEventListener = uiCheckBox._checkBoxEventListener;
            this._checkBoxEventSelector = uiCheckBox._checkBoxEventSelector;
            this._checkBoxEventCallback = uiCheckBox._checkBoxEventCallback;
        }
    },

    adaptRenderers: function(){
        if (this._backGroundBoxRendererAdaptDirty){
            this.backGroundTextureScaleChangedWithSize();
            this._backGroundBoxRendererAdaptDirty = false;
        }
        if (this._backGroundSelectedBoxRendererAdaptDirty) {
            this.backGroundSelectedTextureScaleChangedWithSize();
            this._backGroundSelectedBoxRendererAdaptDirty = false;
        }
        if (this._frontCrossRendererAdaptDirty){
            this.frontCrossTextureScaleChangedWithSize();
            this._frontCrossRendererAdaptDirty = false;
        }
        if (this._backGroundBoxDisabledRendererAdaptDirty) {
            this.backGroundDisabledTextureScaleChangedWithSize();
            this._backGroundBoxDisabledRendererAdaptDirty = false;
        }
        if (this._frontCrossDisabledRendererAdaptDirty) {
            this.frontCrossDisabledTextureScaleChangedWithSize();
            this._frontCrossDisabledRendererAdaptDirty = false;
        }
    }
});

var _p = ccui.CheckBox.prototype;

// Extended properties
/** @expose */
_p.selected;
cc.defineGetterSetter(_p, "selected", _p.getSelectedState, _p.setSelectedState);

_p = null;

/**
 * allocates and initializes a UICheckBox.
 * @param {string} [backGround]     backGround texture.
 * @param {string} [backGroundSeleted]  backGround selected state texture.
 * @param {string} [cross]  cross texture.
 * @param {string} [backGroundDisabled]   cross dark state texture.
 * @param {string} [frontCrossDisabled]   cross dark state texture.
 * @param {Number} [texType]
 * @return {ccui.CheckBox}
 * @example
 * // example
 * var uiCheckBox = ccui.CheckBox.create();
 */
ccui.CheckBox.create = function (backGround, backGroundSeleted, cross, backGroundDisabled, frontCrossDisabled, texType) {
    var widget = new ccui.CheckBox();
    if(backGround === undefined)
        widget.init();
    else
        widget.init(backGround, backGroundSeleted,cross,backGroundDisabled,frontCrossDisabled,texType);
    return widget;
};

// Constants
//CheckBoxEvent type
ccui.CheckBox.EVENT_SELECTED = 0;
ccui.CheckBox.EVENT_UNSELECTED = 1;

//Render zorder
ccui.CheckBox.BOX_RENDERER_ZORDER = -1;
ccui.CheckBox.BOX_SELECTED_RENDERER_ZORDER = -1;
ccui.CheckBox.BOX_DISABLED_RENDERER_ZORDER = -1;
ccui.CheckBox.FRONT_CROSS_RENDERER_ZORDER = -1;
ccui.CheckBox.FRONT_CROSS_DISABLED_RENDERER_ZORDER = -1;
