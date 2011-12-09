const St = imports.gi.St;
const Mainloop = imports.mainloop;

const Main = imports.ui.main;
const PanelMenu = imports.ui.panelMenu;
const PopupMenu = imports.ui.popupMenu;

function Indicator() {
    this._init.apply(this, arguments);
}

Indicator.prototype = {
    __proto__: PanelMenu.SystemStatusButton.prototype,

    _init: function() {
        PanelMenu.SystemStatusButton.prototype._init.call(this, 'emblem-favorite', null);
        
        this._key = 'John 8:12';
		item = new PopupMenu.PopupMenuItem(this._key);
		item.connect('activate', function () {
            global.log('bible key activated');
		});
        this.menu.addMenuItem(item);
        
        this._verse = '耶稣又对众人说：我是世界的光。跟从我的，就不在黑暗里走，必要得著生命的光。';
        item = new PopupMenu.PopupMenuItem(this._verse);
		item.connect('activate', function () {
            global.log('bible verse activated.');
		});
        this.menu.addMenuItem(item);
    }
};

function main(metadata) {
    Main.Panel.STANDARD_TRAY_ICON_ORDER.unshift('bible');
    Main.Panel.STANDARD_TRAY_ICON_SHELL_IMPLEMENTATION['bible'] = Indicator;
}
