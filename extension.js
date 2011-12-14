const Lang = imports.lang;
const Soup = imports.gi.Soup;
const Json = imports.gi.Json;
const St = imports.gi.St;
const Main = imports.ui.main;
const Panel = imports.ui.panel;
const PanelMenu = imports.ui.panelMenu;
const PopupMenu = imports.ui.popupMenu;
const Pango = imports.gi.Pango;
const GLib = imports.gi.GLib;
const Gtk = imports.gi.Gtk;
const Gettext = imports.gettext;
const _ = Gettext.gettext;
const BIBLE_VERSION = ['ChiUns', 'ChiNCVs', 'KJV'];
const BIBLE_BOOK_ABBR_OLD = {
    'ge': 'Genesis',
    'ex': 'Exodus',
    'le': 'Leviticus',
    'nu': 'Numbers',
    'de': 'Deuteronomy',
    'jos': 'Joshua',
    'jdg': 'Judges',
    'ru': 'Ruth',
    '1sa': 'I Samuel',
    '2sa': 'II Samuel',
    '1ki': 'I Kings',
    '2ki': 'II Kings',
    '1ch': 'I Chronicles',
    '2ch': 'II Chronicles',
    'ezr': 'Ezra',
    'ne': 'Nehemiah',
    'es': 'Esther',
    'job': 'Job',
    'ps': 'Psalms',
    'pr': 'Proverbs',
    'ec': 'Ecclesiastes',
    'so': 'Song of Solomon',
    'isa': 'Isaiah',
    'jer': 'Jeremiah',
    'la': 'Lamentations',
    'eze': 'Ezekiel',
    'da': 'Daniel',
    'ho': 'Hosea',
    'joe': 'Joel',
    'am': 'Amos',
    'ob': 'Obadiah',
    'jon': 'Jonah',
    'mic': 'Micah',
    'na': 'Nahum',
    'hab': 'Habakkuk',
    'zep': 'Zephaniah',
    'hag': 'Haggai',
    'zec': 'Zechariah',
    'mal': 'Malachi'
};
const BIBLE_BOOK_ABBR_NEW = {
    'mt': 'Matthew',
    'mr': 'Mark',
    'lu': 'Luke',
    'joh': 'John',
    'ac': 'Acts',
    'ro': 'Romans',
    '1co': 'I Corinthians',
    '2co': 'II Corinthians',
    'ga': 'Galatians',
    'eph': 'Ephesians',
    'php': 'Philippians',
    'col': 'Colossians',
    '1th': 'I Thessalonians',
    '2th': 'II Thessalonians',
    '1ti': 'I Timothy',
    '2ti': 'II Timothy',
    'tit': 'Titus',
    'phm': 'Philemon',
    'heb': 'Hebrews',
    'jas': 'James',
    '1pe': 'I Peter',
    '2pe': 'II Peter',
    '1jo': 'I John',
    '2jo': 'II John',
    '3jo': 'III John',
    'jude': 'Jude',
    're': 'Revelation of John'
};
const DAILY_VERSE = {
    '1-1' : '2 Corinthians 5:17',
    '1-2' : 'Psalm 90:12',
    '1-3' : 'Titus 2:11-12',
    '1-4' : 'Micah 6:8',
    '1-5' : 'Isaiah 1:16-17',
    '1-6' : '1 Peter 1:13',
    '1-7' : 'Ephesians 5:1-2',
    '1-8' : 'Amos 5:14-15',
    '1-9' : 'Matthew 6:19-21',
    '1-10' : '1 Peter 1:15-16',
    '1-11' : 'Psalm 118:5-6',
    '1-12' : 'Galatians 3:26-28',
    '1-13' : '2 Corinthians 5:19-20',
    '1-14' : '1 John 4:20-21',
    '1-15' : 'John 8:31-32',
    '1-16' : 'Galatians 5:16',
    '1-17' : 'Philippians 2:14-16',
    '1-18' : '1 Corinthians 10:13',
    '1-19' : 'Matthew 7:12',
    '1-20' : 'James 1:2-3',
    '1-21' : 'Galatians 6:7-8',
    '1-22' : 'Matthew 7:7-8',
    '1-23' : 'James 1:5',
    '1-24' : 'Galatians 6:1',
    '1-25' : 'Philippians 4:8',
    '1-26' : 'James 4:10',
    '1-27' : 'Ephesians 6:12-13',
    '1-28' : 'John 4:24',
    '1-29' : 'Mark 9:35',
    '1-30' : 'Ephesians 4:2',
    '1-31' : 'Psalm 86:5',
    '2-1' : 'Deuteronomy 6:4-5',
    '2-2' : '1 Corinthians 2:9',
    '2-3' : 'Psalm 59:16',
    '2-4' : 'Psalm 18:1-2',
    '2-5' : 'Psalm 33:4-5',
    '2-6' : 'Proverbs 21:21',
    '2-7' : 'Psalm 97:10',
    '2-8' : 'Matthew 5:43-45',
    '2-9' : '2 Thessalonians 1:3',
    '2-10' : '1 Corinthians 13:1-3',
    '2-11' : '1 Corinthians 13:4-5',
    '2-12' : '1 Corinthians 13: 6-7',
    '2-13' : 'John 3:16',
    '2-14' : 'John 13:34-35',
    '2-15' : '1 John 4:10',
    '2-16' : '1 John 3:11',
    '2-17' : 'Romans 8:35,37',
    '2-18' : 'Romans 8:38-39',
    '2-19' : '1 John 4:11-12',
    '2-20' : 'Proverbs 17:9',
    '2-21' : 'Romans 13:9-10',
    '2-22' : '1 John 4:18',
    '2-23' : 'Proverbs 14:22',
    '2-24' : 'Jeremiah 29:11-13',
    '2-25' : 'Matthew 22:37-39',
    '2-26' : '1 John 4:9',
    '2-27' : '1 John 3:18',
    '2-28' : '2 Timothy 1:7',
    '2-29' : 'Psalm 73:25-26',
    '3-1' : 'Psalm 73:25-26',
    '3-2' : 'Job 23:10-11',
    '3-3' : 'Isaiah 55:8-9',
    '3-4' : 'Joshua 1:9',
    '3-5' : 'Deuteronomy 6: 6-7',
    '3-6' : 'Isaiah 25:1',
    '3-7' : 'Psalm 139:23-24',
    '3-8' : '2 Corinthians 1:3-4',
    '3-9' : '2 Timothy 1:9',
    '3-10' : '1 Peter 3:15',
    '3-11' : 'Deuteronomy 7:9',
    '3-12' : '2 Peter 1:4',
    '3-13' : 'Romans 8:28',
    '3-14' : '2 Peter 1:5-8',
    '3-15' : 'Acts 4:10,12',
    '3-16' : 'Colossians 3:12',
    '3-17' : 'Psalm 23:1-3',
    '3-18' : 'Romans 15:13',
    '3-19' : 'Galatians 5:22-23',
    '3-20' : '1 Peter 2:2-3',
    '3-21' : 'Jeremiah 17:7-8',
    '3-22' : 'Ephesians 6:10-11',
    '3-23' : 'James 1:12',
    '3-24' : 'Romans 6:23',
    '3-25' : '1 John 1:9',
    '3-26' : 'Philippians 1:29',
    '3-27' : 'Psalm 62:7',
    '3-28' : '1 Timothy 2:5-6',
    '3-29' : '2 Corinthians 5:21',
    '3-30' : 'Isaiah 53:3-4',
    '3-31' : 'Isaiah 53:5-6',
    '4-1' : 'Psalm 14:1',
    '4-2' : 'Matthew 20: 17-19',
    '4-3' : 'Hebrews 12:2',
    '4-4' : 'Ephesians 1:7',
    '4-5' : '2 Corinthians 5:14-15',
    '4-6' : '1 John 3:16',
    '4-7' : 'Galatians 2:20',
    '4-8' : 'Romans 5:10',
    '4-9' : 'Hebrews 1:3',
    '4-10' : 'Romans 5:6-8',
    '4-11' : '1 Peter 2:24',
    '4-12' : 'Luke 9:23-24',
    '4-13' : 'Romans 3:23-24',
    '4-14' : '1 Corinthians 15:1, 3-4',
    '4-15' : 'Romans 13:6-7',
    '4-16' : 'Romans 13:8',
    '4-17' : '1 Corinthians 1:18',
    '4-18' : 'Romans 10:9-10',
    '4-19' : '1 Corinthians 15:20-22',
    '4-20' : '1 Corinthians 15:55-57',
    '4-21' : 'John 10:28-30',
    '4-22' : 'Romans 1:20',
    '4-23' : 'Romans 14:11',
    '4-24' : '1 Peter 1:18-19',
    '4-25' : 'Colossians 1:27-28',
    '4-26' : 'Hebrews 7:25',
    '4-27' : 'Luke 19:10',
    '4-28' : 'Philippians 2:5-8',
    '4-29' : 'Job 19:25',
    '4-30' : 'Ephesians 4:15',
    '5-1' : 'Hebrews 11:6',
    '5-2' : '1 John 5:14-15',
    '5-3' : 'Romans 12:12',
    '5-4' : '2 Chronicles 7:14',
    '5-5' : 'Philippians 4:6-7',
    '5-6' : 'James 5:16',
    '5-7' : '1 Thessalonians 5:16-18',
    '5-8' : 'Colossians 4:5-6',
    '5-9' : 'Romans 8:1-2',
    '5-10' : 'Matthew 18:15',
    '5-11' : 'Ephesians 4:32',
    '5-12' : 'Proverbs 31:10, 27-28',
    '5-13' : 'Proverbs 31:30',
    '5-14' : 'Psalm 139:13-14',
    '5-15' : 'Ecclesiastes 11:5',
    '5-16' : 'Zephaniah 3:17',
    '5-17' : 'Romans 11:33',
    '5-18' : 'Hebrews 6:10',
    '5-19' : 'James 3:17-18',
    '5-20' : 'Romans 15:5-6',
    '5-21' : '1 Corinthians 1:10',
    '5-22' : 'Galatians 5:13',
    '5-23' : 'Romans 15:2',
    '5-24' : 'Romans 12:10',
    '5-25' : 'James 1:19',
    '5-26' : 'John 3:17',
    '5-27' : 'Acts 20:24',
    '5-28' : 'Romans 12:15',
    '5-29' : 'Psalm 103:17-18',
    '5-30' : 'Psalm 56:4',
    '5-31' : '1 Thessalonians 4:16-17',
    '6-1' : 'Revelation 21: 2-4',
    '6-2' : 'Hebrews 9:28',
    '6-3' : 'Proverbs 15:1',
    '6-4' : '1 Chronicles 29:11',
    '6-5' : '1 Thessalonians 5:11',
    '6-6' : 'Ephesians 3:17-19',
    '6-7' : 'Psalm 90:2,4',
    '6-8' : 'Habakkuk 3:19',
    '6-9' : 'Matthew 7:13-14',
    '6-10' : 'Colossians 3:13',
    '6-11' : 'Psalm 46:10',
    '6-12' : 'Psalm 19:1-2',
    '6-13' : 'Luke 11:13',
    '6-14' : 'Philippians 3:20',
    '6-15' : 'Proverbs 23:24',
    '6-16' : 'Psalm 103:13',
    '6-17' : 'Psalm 68:4-5',
    '6-18' : 'Ephesians 6:4',
    '6-19' : 'Ephesians 5:25-26',
    '6-20' : 'Mark 8:36',
    '6-21' : 'Psalm 91:1',
    '6-22' : 'Psalm 121:7-8',
    '6-23' : 'Isaiah 40:31',
    '6-24' : '2 Thessalonians 3:3',
    '6-25' : 'Jeremiah 23:24',
    '6-26' : 'Leviticus 19:18',
    '6-27' : 'Matthew 16:25',
    '6-28' : '2 Peter 3:9',
    '6-29' : 'Psalm 138:8',
    '6-30' : 'Zechariah 14:9',
    '7-1' : 'Romans 12:3',
    '7-2' : 'Jeremiah 17:9-10',
    '7-3' : 'Proverbs 14:34',
    '7-4' : 'Psalm 33:12',
    '7-5' : 'Isaiah 12:4',
    '7-6' : 'Matthew 24:35',
    '7-7' : 'Psalm 18:30',
    '7-8' : 'Psalm 138:2',
    '7-9' : 'Ephesians 3:20-21',
    '7-10' : 'Philippians 1:6',
    '7-11' : 'Jeremiah 32:17',
    '7-12' : 'Matthew 4:4',
    '7-13' : 'Philippians 2:9-11',
    '7-14' : 'John 15:10',
    '7-15' : 'James 1:21',
    '7-16' : 'Colossians 2:9-10',
    '7-17' : 'Romans 1:16',
    '7-18' : 'Psalm 119:7',
    '7-19' : 'Isaiah 41:10',
    '7-20' : '1 John 1:7',
    '7-21' : 'Psalm 119:30',
    '7-22' : 'Matthew 16:15-16',
    '7-23' : 'Matthew 19:14',
    '7-24' : 'Psalm 112:5',
    '7-25' : 'Psalm 119:60',
    '7-26' : 'Hebrews 11:1',
    '7-27' : 'Hebrews 12:1',
    '7-28' : 'Philippians 3:14',
    '7-29' : 'Psalm 119:93',
    '7-30' : 'Matthew 5:14,16',
    '7-31' : 'John 1:12-13',
    '8-1' : 'Psalm 119:114',
    '8-2' : 'James 1:22',
    '8-3' : '1 Samuel 16:7',
    '8-4' : 'Jeremiah 33:2-3',
    '8-5' : 'Psalm 119:130',
    '8-6' : 'Psalm 119:160',
    '8-7' : 'Isaiah 33:22',
    '8-8' : 'Psalm 149:4',
    '8-9' : 'Luke 12:6-7',
    '8-10' : 'Psalm 46:1',
    '8-11' : 'Psalm 119:14',
    '8-12' : '1 Corinthians 6:19-20',
    '8-13' : 'Ephesians 2:10',
    '8-14' : 'Revelation 3:14,20',
    '8-15' : 'Romans 14:8',
    '8-16' : '2 Corinthians 7:1',
    '8-17' : '2 Corinthians 10:17-18',
    '8-18' : 'Philippians 1:21',
    '8-19' : '1 John 5:12',
    '8-20' : 'Psalm 16:8',
    '8-21' : 'Psalm 42:8',
    '8-22' : 'Romans 8:32',
    '8-23' : 'Psalm 94:18-19',
    '8-24' : 'Psalm 116:1-2',
    '8-25' : 'Psalm 119:165',
    '8-26' : 'Romans 12:4-5',
    '8-27' : 'Isaiah 26:3',
    '8-28' : 'John 6:29',
    '8-29' : 'Galatians 3:28',
    '8-30' : 'Ephesians 2:19',
    '8-31' : 'Psalm 95:6-7',
    '9-1' : 'Proverbs 22:6',
    '9-2' : 'Psalm 119:64',
    '9-3' : 'Isaiah 48:17',
    '9-4' : '2 Timothy 1:13-14',
    '9-5' : 'Matthew 28:18-20',
    '9-6' : 'John 14:23',
    '9-7' : 'Colossians 1:28',
    '9-8' : 'Psalm 143:10',
    '9-9' : 'Titus 2:2',
    '9-10' : 'Isaiah 46:4',
    '9-11' : 'Psalm 121:1-2',
    '9-12' : 'Philippians 4:4',
    '9-13' : '1 Peter 3:8',
    '9-14' : 'Philippians 2:1-2',
    '9-15' : '1 John 4:16',
    '9-16' : 'James 3:13',
    '9-17' : 'Ephesians 5:1',
    '9-18' : 'Philippians 2:3-4',
    '9-19' : 'Ephesians 4:29',
    '9-20' : 'Joel 2:23',
    '9-21' : '2 Corinthians 13:14',
    '9-22' : 'Romans 15:7',
    '9-23' : 'Romans 5:3-4',
    '9-24' : 'Hebrews 10:35-36',
    '9-25' : '1 John 2:1',
    '9-26' : 'Hebrews 10:30-31',
    '9-27' : 'Matthew 6:33',
    '9-28' : '1 Corinthians 2:14',
    '9-29' : 'John 3:20-21',
    '9-30' : 'Philippians 1:9-10',
    '10-1' : 'Matthew 5:11-12',
    '10-2' : 'Proverbs 29:25',
    '10-3' : '1 Peter 1:3',
    '10-4' : 'Proverbs 27:1',
    '10-5' : 'Isaiah 55:6',
    '10-6' : 'Isaiah 26:4',
    '10-7' : 'Psalm 63:1',
    '10-8' : 'Isaiah 43:11-12',
    '10-9' : 'Deuteronomy 13:4',
    '10-10' : 'Proverbs 19:20-21',
    '10-11' : 'Psalm 62:1',
    '10-12' : 'Proverbs 19:20-21',
    '10-13' : 'Jeremiah 29:11',
    '10-14' : 'Romans 12:2',
    '10-15' : '2 Samuel 7:22',
    '10-16' : 'Psalm 19:14',
    '10-17' : 'Psalm 25:14-15',
    '10-18' : 'Psalm 27:14',
    '10-19' : 'Psalm 37:4',
    '10-20' : 'Psalm 51:12',
    '10-21' : 'Psalm 40:8',
    '10-22' : 'Proverbs 15:23',
    '10-23' : 'Galatians 6:2',
    '10-24' : 'Proverbs 9:10',
    '10-25' : 'Ephesians 5:19-20',
    '10-26' : '2 Timothy 3:16-17',
    '10-27' : 'Hebrews 4:12',
    '10-28' : '1 Peter 1:24-25',
    '10-29' : 'Romans 12:1',
    '10-30' : 'Ephesians 2:8-9',
    '10-31' : '1 Peter 5:8-9',
    '11-1' : 'Ephesians 1:18',
    '11-2' : '1 Peter 2:9',
    '11-3' : 'Romans 13:1',
    '11-4' : '2 Corinthians 3:6',
    '11-5' : 'Romans 13:6',
    '11-6' : 'Ephesians 1:9-10',
    '11-7' : '1 Timothy 2:1-2',
    '11-8' : 'Joshua 24:15',
    '11-9' : 'Isaiah 1:18',
    '11-10' : 'Job 37:5-6',
    '11-11' : '1 John 2:15-16',
    '11-12' : 'Colossians 1:9',
    '11-13' : '1 Peter 2:15-16',
    '11-14' : '1 Peter 3:18',
    '11-15' : 'Psalm 119:143',
    '11-16' : 'Psalm 119:18',
    '11-17' : 'Psalm 119:105',
    '11-18' : 'John 17:17',
    '11-19' : 'Psalm 1:1-2',
    '11-20' : 'Psalm 95:1-2',
    '11-21' : '1 Corinthians 1:4-5',
    '11-22' : 'Colossians 3:15',
    '11-23' : 'Psalm 100:4-5',
    '11-24' : 'Colossians 2:6-7',
    '11-25' : 'Colossians 3:17',
    '11-26' : 'Hebrews 12:28',
    '11-27' : 'Colossians 3:16',
    '11-28' : '1 Chronicles 16:8',
    '11-29' : 'Psalm 136:1,26',
    '11-30' : '2 Peter 3:10-11',
    '12-1' : 'John 1:1-2, 14',
    '12-2' : 'Hebrews 1:1-2',
    '12-3' : 'John 6:35',
    '12-4' : 'John 8:12',
    '12-5' : 'John 10:7, 9-10',
    '12-6' : 'John 10:14-15',
    '12-7' : 'John 11:25',
    '12-8' : 'John 14:6',
    '12-9' : 'John 15:5,8',
    '12-10' : 'Deuteronomy 18:15',
    '12-11' : 'Isaiah 7:14',
    '12-12' : 'Galatians 4:4-5',
    '12-13' : 'Matthew 2:4-6',
    '12-14' : 'Luke 1:26-28',
    '12-15' : 'Luke 1:30-33',
    '12-16' : 'Luke 1:46-47, 49',
    '12-17' : 'Matthew 1:20-21',
    '12-18' : 'Luke 1:68-70',
    '12-19' : 'Luke 1:76-78',
    '12-20' : 'Luke 2:1, 4-5',
    '12-21' : 'Luke 2:6-7',
    '12-22' : 'Luke 2:8-11',
    '12-23' : 'Luke 2:11-14',
    '12-24' : 'Luke 2:16-20',
    '12-25' : 'Isaiah 9:6',
    '12-26' : 'Luke 2:28-32',
    '12-27' : 'Psalm 103:1-2',
    '12-28' : 'Matthew 11:28',
    '12-29' : 'John 14:1-3',
    '12-30' : 'John 16:33',
    '12-31' : 'Isaiah 43:16, 18-19'
};
/**
 * IconButton:
 * 
 */
function IconButton() { this._init.apply(this, arguments); }
IconButton.prototype = {
    _init: function(icon_name) {
        this._button = new St.Button({ style_class: 'app-button' });
        this._icon = new St.Icon({
            icon_type: St.IconType.APPLICATION,
            icon_name: icon_name,
            icon_size: 22,
            style_class: 'app-icon'
        });
        this._button.set_child(this._icon);
    },
    get actor() { return this._button; }
};
/**
 * BibleApplicaton:
 * 
 */
function BibleApplication() { this._init.apply(this, arguments); }
BibleApplication.prototype = {
    _init: function(owner, icon_name) {
        this._owner = owner;
        this._actor = null;
        if (icon_name != null){
            this._button = new IconButton(icon_name);
            this._button.actor.connect('clicked', Lang.bind(this, function(sender) {
                this._owner.set_application(this);
            }));
        } else this._button = null;
    },
    get button() { return this._button; },
    get actor() { return this._actor; }
};
/**
 * DailyVerse:
 * 
 */
function DailyVerse() { this._init.apply(this, arguments); }
DailyVerse.prototype = {
    __proto__ : BibleApplication.prototype,
    _init: function(owner) {
        BibleApplication.prototype._init.call(this, owner, 'zoom-original-symbolic');
        this._actor = new St.BoxLayout({vertical:true, style_class:'daily-verse'});
        // verse area
        this._verse = new St.Label({ style_class: 'verse-label' });
        this._verse.clutter_text.line_wrap = true;
        this._verse.clutter_text.line_wrap_mode = Pango.WrapMode.WORD_CHAR;
        this._verse.clutter_text.ellipsize = Pango.EllipsizeMode.NONE;
        this._ref = new St.Button({label:'', style_class:'ref-button'});
        this._ref._book = '';
        this._ref._chapter = 0;
        this._ref.connect('clicked', Lang.bind(this, function(sender){
            this._owner.set_reference(sender._book, sender._chapter);
        }));
        this._actor.add(this._verse, {x_align:St.Align.START,x_fill:true,y_align:St.Align.MIDDLE,y_fill:false,expand:true});
        this._actor.add(this._ref, {x_align:St.Align.END,x_fill:false,y_align:St.Align.MIDDLE,y_fill:false,expand:false});
        // control area
        let layout = new St.BoxLayout({style_class:'control-area'});
        for (let i=0;i<BIBLE_VERSION.length;i++) {
            let button = new St.Button({ label: BIBLE_VERSION[i], style_class: 'version-button' });
            button.set_tooltip_text(_(BIBLE_VERSION[i]));
            button.connect('clicked', Lang.bind(this, function (sender) {
                this._refresh(sender.label);
            }));
            layout.add(button);
        }
        this._actor.add(layout, {x_align:St.Align.MIDDLE,x_fill:false,y_align:St.Align.END,y_fill:false,expand:true});
        //
        this._refresh(BIBLE_VERSION[0]);
    },
    _refresh: function(version){
        let date = new Date();
        let timestamp = (date.getMonth()+1) + '-' + date.getDate();
        let cmd = 'diatheke -b ' + version + ' -k ' + DAILY_VERSE[timestamp];
        try{
            let [success, stdout, stderr, exit_status] = GLib.spawn_command_line_sync(cmd);
            if (success && exit_status == 0){
                let text = stdout.replace(/^.*:\s+/mg, '')
                    .replace(/\n\(.*\)\n$/, '')
                    .replace(/\u3000/g, '').replace(/\n/g, '');
                this._verse.set_text(text);
                // update ref label
                let book_name = stdout.match(/^([\dA-Za-z\s]+)\s+\d+:\d+/);
                let chapter_name = DAILY_VERSE[timestamp].match(/(\d+):\d+[-\d+]*/);
                if (book_name == null || chapter_name == null) {
                    this._ref.label = '';
                    this._ref._book = '';
                    this._ref._chapter = 0;
                } else {
                    this._ref.label = _(book_name[1]) + ' ' + chapter_name[0];
                    this._ref._book = book_name[1];
                    this._ref._chapter = parseInt(chapter_name[1]);
                }
            }
        } catch (err) {
            this._verse.set_text(err.message);
        }
    }
};
/**
 * BookNavigator:
 * 
 */
function BookNavigator() { this._init.apply(this, arguments); }
BookNavigator.prototype = {
    __proto__ : BibleApplication.prototype,
    _init: function(owner) {
        BibleApplication.prototype._init.call(this, owner, 'zoom-in-symbolic');
        this._actor = new St.Table({style_class:'book-navigator'});
        //
        let i = 0;
        for (let abbr in BIBLE_BOOK_ABBR_OLD){
            let button = new St.Button({label:_(abbr)});
            button.set_tooltip_text(_(BIBLE_BOOK_ABBR_OLD[abbr]));
            button._origin = abbr;
            button.connect('clicked', Lang.bind(this, function (sender) {
                this._owner.set_book(sender._origin);
            }));
            this._actor.add(button, {row:Math.floor(i/8), col:i%8});
            i++;
        }
        i = 0;
        for (let abbr in BIBLE_BOOK_ABBR_NEW){
            let button = new St.Button({label:_(abbr)});
            button.set_tooltip_text(_(BIBLE_BOOK_ABBR_NEW[abbr]));
            button._origin = abbr;
            button.connect('clicked', Lang.bind(this, function (sender) {
                this._owner.set_book(sender._origin);
            }));
            this._actor.add(button, {row:Math.floor(i/8)+5, col:i%8});
            i++;
        }
    }
};
/**
 * ChapterNavigator:
 * 
 */
function ChapterNavigator() { this._init.apply(this, arguments); }
ChapterNavigator.prototype = {
    __proto__ : BibleApplication.prototype,
    _init: function(owner) {
        BibleApplication.prototype._init.call(this, owner, null);
        this._actor = new St.Table({style_class:'chapter-navigator'});
        //
        this._label = new St.Label({text:'0',style_class:'chapter-label'});
        this._actor.add(this._label, {row:0,col:0,col_span:3});
        for (let i=1;i<10;i++){
            let button = new St.Button({label:String(i)});
            button.connect('clicked', Lang.bind(this, this._button_callback));
            this._actor.add(button, {row:3-Math.floor((i-1)/3), col:(i-1)%3, col_span:1});
        }
        
        let button = new St.Button({label:'0'});
        button.connect('clicked', Lang.bind(this, this._button_callback));
        this._actor.add(button, {row:4,col:0});
        
        let button = new St.Button({label:'C'});
        button.connect('clicked', Lang.bind(this, this._button_callback));
        this._actor.add(button, {row:4,col:1});
        
        let button = new St.Button({label:'\u23ce'});
        button.connect('clicked', Lang.bind(this, this._button_callback));
        this._actor.add(button, {row:4,col:2});
    },
    _button_callback: function(sender) {
        switch(sender.label){
            case 'C':
                this._label.set_text('0');
                break;
            case '\u23ce':
                if (this._label.text != '0') {
                    let chapter = parseInt(this._label.text);
                    this._label.set_text('0');
                    this._owner.set_chapter(chapter);
                }
                break;
            default:
                let value = parseInt(this._label.text);
                this._label.set_text(String(value * 10 + parseInt(sender.label)));
                break;
        }
    }
};
function VerseReader() { this._init.apply(this, arguments); }
VerseReader.prototype = {
    __proto__ : BibleApplication.prototype,
    _init: function(owner) {
        BibleApplication.prototype._init.call(this, owner, 'format-justify-fill-symbolic');
        this._actor = new St.BoxLayout({style_class:'verse-reader',vertical:true});
        //
        this._version = BIBLE_VERSION[0];
        this._reference = '';
        //
        this._ref = new St.Label({text:this._reference, style_class:'ref-label'});
        this._actor.add(this._ref,{x_align:St.Align.MIDDLE,x_fill:false,expand:false});
        this._verse = new St.Label({ text:'', style_class: 'verse-label' }); // verse label
        this._verse.clutter_text.line_wrap = true;
        this._verse.clutter_text.line_wrap_mode = Pango.WrapMode.WORD_CHAR;
        this._verse.clutter_text.ellipsize = Pango.EllipsizeMode.NONE;
        let layout = new St.BoxLayout({ vertical: true });
        layout.add(this._verse, { y_align: St.Align.START, expand: true });
        this._verseScroller = new St.ScrollView({style_class: 'verse-scroller'});
        this._verseScroller.add_actor(layout);
        this._verseScroller.set_policy(Gtk.PolicyType.NEVER, Gtk.PolicyType.AUTOMATIC);
        // TODO scroll by drag
        this._actor.add(this._verseScroller, {x_fill:true,y_fill:false,y_align: St.Align.START,expand:true});
        // control area
        let layout = new St.BoxLayout({style_class:'control-area'});
        for (let i=0;i<BIBLE_VERSION.length;i++) {
            let button = new St.Button({ label: BIBLE_VERSION[i], style_class: 'version-button' });
            button.set_tooltip_text(_(BIBLE_VERSION[i]));
            button.connect('clicked', Lang.bind(this, function (sender) {
                this._version = sender.label;
                this._refresh();
            }));
            layout.add(button);
        }
        this._actor.add(layout, {x_align:St.Align.MIDDLE,x_fill:false,y_align:St.Align.END,y_fill:false,expand:false});
    },
    set_reference: function(book, chapter) {
        this._reference = book + ' ' + chapter;
        this._refresh();
    },
    _refresh: function() {
        let cmd = 'diatheke -b ' + this._version + ' -k ' + this._reference;
        try{
            let [success, stdout, stderr, exit_status] = GLib.spawn_command_line_sync(cmd);
            if (success && exit_status == 0){
                let text = stdout.replace(/^[^\d]+\d+:(\d+):/mg, '$1')
                    .replace(/\u3000/g, '')
                    .replace(/\n\(.*\)\n$/, '');
                this._verse.set_text(text);
                // update ref label
                let result = stdout.match(/^([^\d]+)\s+(\d+)/);
                if (result == null) {
                    this._ref.set_text('');
                } else {
                    this._ref.set_text(_(result[1]) + ' ' + result[2]);
                }
                // scroll to top
                this._verseScroller.vscroll.adjustment.set_value(0);
            }
        } catch (err) {
            this._verse.set_text(err.message);
        }
    }
};
/**
 * Search:
 * 
 */
function Search() { this._init.apply(this, arguments); }
Search.prototype = {
    __proto__ : BibleApplication.prototype,
    _init: function(owner) {
        BibleApplication.prototype._init.call(this, owner, 'zoom-fit-best-symbolic');
        this._actor = new St.BoxLayout();
        //
        let label = new St.Label({text:'Search: not implemented'});
        this._actor.add_actor(label, {x_align:St.Align.MIDDLE, y_align:St.Align.MIDDLE});
    }
};
/**
 * Indicator:
 * 
 */
function Indicator() {
    this._init.apply(this, arguments);
}
Indicator.prototype = {
    __proto__: PanelMenu.SystemStatusButton.prototype,
    _init: function() {
        PanelMenu.SystemStatusButton.prototype._init.call(this, 'emblem-favorite', null);
        //
        this._book = '';
        this._chapter = 0;
        //
        this._dailyVerse = new DailyVerse(this);
        this._bookNavigator = new BookNavigator(this);
        this._chapterNavigator = new ChapterNavigator(this);
        this._verseReader = new VerseReader(this);
        this._search = new Search(this);
        let layout = new St.BoxLayout({style_class: 'app-panel'});
        layout.add_actor(this._dailyVerse.button.actor);
        layout.add_actor(this._bookNavigator.button.actor);
        layout.add_actor(this._search.button.actor);
        layout.add_actor(this._verseReader.button.actor);
        let bin = new St.Bin({x_align: St.Align.MIDDLE});
        bin.set_child(layout);
        let menuitem = new PopupMenu.PopupMenuSection();
        menuitem.addActor(bin);
        this.menu.addMenuItem(menuitem);

        this.menu.addMenuItem(new PopupMenu.PopupSeparatorMenuItem());
        
        this._content = new St.Bin({style_class:'content-panel', x_align: St.Align.MIDDLE, y_align: St.Align.MIDDLE});
        this._content.set_child(this._dailyVerse.actor);
        menuitem = new PopupMenu.PopupMenuSection();
        menuitem.addActor(this._content);
        this.menu.addMenuItem(menuitem);
    },
    set_application: function(app) {
        this._content.set_child(app.actor);
    },
    set_book: function(bookname) {
        this._book = bookname;
        this.set_application(this._chapterNavigator);
    },
    set_chapter: function(chapter) {
        this._chapter = chapter;
        this._verseReader.set_reference(this._book, this._chapter);
        this.set_application(this._verseReader);
    },
    set_reference: function(bookname, chapter){
        this._book = bookname;
        this._chapter = chapter;
        this._verseReader.set_reference(this._book, this._chapter);
        this.set_application(this._verseReader);
    }
};

function main(metadata) {
    Gettext.bindtextdomain("gnome-shell-extension-bible", metadata.path + '/locale');
    Gettext.textdomain("gnome-shell-extension-bible");

    Panel.STANDARD_TRAY_ICON_ORDER.unshift('tool');
    Panel.STANDARD_TRAY_ICON_SHELL_IMPLEMENTATION['tool'] = Indicator;
}
