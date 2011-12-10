const Lang = imports.lang;
const Soup = imports.gi.Soup;
const Json = imports.gi.Json;
const St = imports.gi.St;
const Main = imports.ui.main;
const Panel = imports.ui.panel;
const PanelMenu = imports.ui.panelMenu;
const PopupMenu = imports.ui.popupMenu;
const Pango = imports.gi.Pango;
const BIBLE_VERSION = {
	'CUVS':80,
	'KJV':9,
	'NIV':31
};
// Indicator -----------------------------------------------------------
function Indicator() {
    this._init.apply(this, arguments);
}
Indicator.prototype = {
    __proto__: PanelMenu.SystemStatusButton.prototype,

    _init: function() {
		PanelMenu.SystemStatusButton.prototype._init.call(this, 'emblem-favorite', null);
		// verse
		this._verse = new St.Label({ style_class: 'verse-label' });
		this._verse.clutter_text.line_wrap = true;
		this._verse.clutter_text.line_wrap_mode = Pango.WrapMode.WORD_CHAR;
		this._verse.clutter_text.ellipsize = Pango.EllipsizeMode.NONE;
		this._verse.clutter_text.set_markup('<span>Loading ...</span>');
		let verseArea = new St.Bin({style_class: 'verse-area', x_align: St.Align.MIDDLE});
		verseArea.set_child(this._verse);
		let verseMenuItem = new PopupMenu.PopupMenuSection();
        verseMenuItem.addActor(verseArea);
        this.menu.addMenuItem(verseMenuItem);
		// ref
		this._ref = new St.Label({ style_class: 'ref-label'});
		let refArea = new St.Bin({style_class: 'verse-area', x_align: St.Align.END});
		refArea.set_child(this._ref);
		let refMenuItem = new PopupMenu.PopupMenuSection();
        refMenuItem.addActor(refArea);
        this.menu.addMenuItem(refMenuItem);
		this.menu.addMenuItem(new PopupMenu.PopupSeparatorMenuItem());
        // version
        this._versions = {};
        let controlBox = new St.BoxLayout();
        for (key in BIBLE_VERSION) {
			let button = new St.Button({ label: key, style_class: 'version-button' });
			button.connect('clicked', Lang.bind(this, function (sender) {
				//this._version = sender.label;
				for (j in BIBLE_VERSION) {
					if (sender === this._versions[j]) this._versions[j].add_style_class_name('current');
					else this._versions[j].remove_style_class_name('current');
				}
				this.refresh_verse(sender.label);
			}));
			this._versions[key] = button;
			controlBox.add_actor(button);
		}
        let controlArea = new St.Bin({style_class: 'version-area', x_align: St.Align.MIDDLE});
        controlArea.set_child(controlBox);
        let versionMenuItem = new PopupMenu.PopupMenuSection();
        versionMenuItem.addActor(controlArea);
        this.menu.addMenuItem(versionMenuItem);
        // init
        let version = 'CUVS';
        this._versions[version].add_style_class_name('current');
        this.refresh_verse(version);
	},
	
	load_json_async: function(url, callback) {
		let here = this; // important
        let session = new Soup.SessionAsync();
        let message = Soup.Message.new('GET', url);
        session.queue_message(message, function(session, message) {
            let jp = new Json.Parser();
            jp.load_from_data(message.response_body.data, -1);
            callback.call(here, jp.get_root().get_object());
        });
    },
    
    get_url: function(version) {
		return 'http://www.biblegateway.com/votd/get/?format=json&version=' + BIBLE_VERSION[version];
	},
	
    refresh_verse: function(version) {
		this.load_json_async(this.get_url(version), function(json_data) {
			global.log('json gotted');
			let votd = json_data.get_object_member('votd');
			let text = votd.get_string_member('text');
			text = text.replace(/^\&ldquo\;/g, '')
				.replace(/\&rdquo\;$/g, '')
				.replace(/\&\#(\d*)\;[\ ]*/g, function(str, p1) { // &#32822
					return String.fromCharCode(p1);
			});
			this._verse.clutter_text.set_markup('<span gravity="east">' + text + '</span>');
			let display_ref = votd.get_string_member('display_ref');
			this._ref.clutter_text.set_markup('<i>' + display_ref + '</i>');
		});
	}
};

function main(metadata) {
    Panel.STANDARD_TRAY_ICON_ORDER.unshift('bible');
    Panel.STANDARD_TRAY_ICON_SHELL_IMPLEMENTATION['bible'] = Indicator;
}
