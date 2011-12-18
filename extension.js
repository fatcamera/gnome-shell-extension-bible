const Lang = imports.lang;
const Clutter = imports.gi.Clutter;
const Mainloop = imports.mainloop;
const St = imports.gi.St;
const Panel = imports.ui.panel;
const PanelMenu = imports.ui.panelMenu;
const PopupMenu = imports.ui.popupMenu;
const Pango = imports.gi.Pango;
const GLib = imports.gi.GLib;
const Gio = imports.gi.Gio;
const Gtk = imports.gi.Gtk;
const Gettext = imports.gettext;
const _ = Gettext.gettext;
const SEARCH_PAGE_SIZE = 20;
const BIBLE_SETTINGS_SCHEMA = 'org.gnome.shell.extensions.bible';
const SCHEMA_KEY_ENABLED_VERSIONS = 'enabled-versions';
const TERM = '\u0001';
let BIBLE_VERSION = [];
const BIBLE_BOOK = {
    'Genesis': {abbr:'ge',chapter:50,old:true,next:'Exodus',prev:'Revelation of John'},
    'Exodus': {abbr:'ex',chapter:40,old:true,next:'Leviticus',prev:'Genesis'},
    'Leviticus': {abbr:'le',chapter:27,old:true,next:'Numbers',prev:'Exodus'},
    'Numbers': {abbr:'nu',chapter:36,old:true,next:'Deuteronomy',prev:'Leviticus'},
    'Deuteronomy': {abbr:'de',chapter:34,old:true,next:'Joshua',prev:'Numbers'},
    'Joshua': {abbr:'jos',chapter:24,old:true,next:'Judges',prev:'Deuteronomy'},
    'Judges': {abbr:'jdg',chapter:21,old:true,next:'Ruth',prev:'Joshua'},
    'Ruth': {abbr:'ru',chapter:4,old:true,next:'I Samuel',prev:'Judges'},
    'I Samuel': {abbr:'1sa',chapter:31,old:true,next:'II Samuel',prev:'Ruth'},
    'II Samuel': {abbr:'2sa',chapter:24,old:true,next:'I Kings',prev:'I Samuel'},
    'I Kings': {abbr:'1ki',chapter:22,old:true,next:'II Kings',prev:'II Samuel'},
    'II Kings': {abbr:'2ki',chapter:25,old:true,next:'I Chronicles',prev:'I Kings'},
    'I Chronicles': {abbr:'1ch',chapter:29,old:true,next:'II Chronicles',prev:'II Kings'},
    'II Chronicles': {abbr:'2ch',chapter:36,old:true,next:'Ezra',prev:'I Chronicles'},
    'Ezra': {abbr:'ezr',chapter:10,old:true,next:'Nehemiah',prev:'II Chronicles'},
    'Nehemiah': {abbr:'ne',chapter:13,old:true,next:'Esther',prev:'Ezra'},
    'Esther': {abbr:'es',chapter:10,old:true,next:'Job',prev:'Nehemiah'},
    'Job': {abbr:'job',chapter:42,old:true,next:'Psalms',prev:'Esther'},
    'Psalms': {abbr:'ps',chapter:150,old:true,next:'Proverbs',prev:'Job'},
    'Proverbs': {abbr:'pr',chapter:31,old:true,next:'Ecclesiastes',prev:'Psalms'},
    'Ecclesiastes': {abbr:'ec',chapter:12,old:true,next:'Song of Solomon',prev:'Proverbs'},
    'Song of Solomon': {abbr:'so',chapter:8,old:true,next:'Isaiah',prev:'Ecclesiastes'},
    'Isaiah': {abbr:'isa',chapter:66,old:true,next:'Jeremiah',prev:'Song of Solomon'},
    'Jeremiah': {abbr:'jer',chapter:52,old:true,next:'Lamentations',prev:'Isaiah'},
    'Lamentations': {abbr:'la',chapter:5,old:true,next:'Ezekiel',prev:'Jeremiah'},
    'Ezekiel': {abbr:'eze',chapter:48,old:true,next:'Daniel',prev:'Lamentations'},
    'Daniel': {abbr:'da',chapter:12,old:true,next:'Hosea',prev:'Ezekiel'},
    'Hosea': {abbr:'ho',chapter:14,old:true,next:'Joel',prev:'Daniel'},
    'Joel': {abbr:'joe',chapter:3,old:true,next:'Amos',prev:'Hosea'},
    'Amos': {abbr:'am',chapter:9,old:true,next:'Obadiah',prev:'Joel'},
    'Obadiah': {abbr:'ob',chapter:1,old:true,next:'Jonah',prev:'Amos'},
    'Jonah': {abbr:'jon',chapter:4,old:true,next:'Micah',prev:'Obadiah'},
    'Micah': {abbr:'mic',chapter:7,old:true,next:'Nahum',prev:'Jonah'},
    'Nahum': {abbr:'na',chapter:3,old:true,next:'Habakkuk',prev:'Micah'},
    'Habakkuk': {abbr:'hab',chapter:3,old:true,next:'Zephaniah',prev:'Nahum'},
    'Zephaniah': {abbr:'zep',chapter:3,old:true,next:'Haggai',prev:'Habakkuk'},
    'Haggai': {abbr:'hag',chapter:2,old:true,next:'Zechariah',prev:'Zephaniah'},
    'Zechariah': {abbr:'zec',chapter:14,old:true,next:'Malachi',prev:'Haggai'},
    'Malachi': {abbr:'mal',chapter:4,old:true,next:'Matthew',prev:'Zechariah'},
    'Matthew': {abbr:'mt',chapter:28,old:false,next:'Mark',prev:'Malachi'},
    'Mark': {abbr:'mr',chapter:16,old:false,next:'Luke',prev:'Matthew'},
    'Luke': {abbr:'lu',chapter:24,old:false,next:'John',prev:'Mark'},
    'John': {abbr:'joh',chapter:21,old:false,next:'Acts',prev:'Luke'},
    'Acts': {abbr:'ac',chapter:28,old:false,next:'Romans',prev:'John'},
    'Romans': {abbr:'ro',chapter:16,old:false,next:'I Corinthians',prev:'Acts'},
    'I Corinthians': {abbr:'1co',chapter:16,old:false,next:'II Corinthians',prev:'Romans'},
    'II Corinthians': {abbr:'2co',chapter:13,old:false,next:'Galatians',prev:'I Corinthians'},
    'Galatians': {abbr:'ga',chapter:6,old:false,next:'Ephesians',prev:'II Corinthians'},
    'Ephesians': {abbr:'eph',chapter:6,old:false,next:'Philippians',prev:'Galatians'},
    'Philippians': {abbr:'php',chapter:4,old:false,next:'Colossians',prev:'Ephesians'},
    'Colossians': {abbr:'col',chapter:4,old:false,next:'I Thessalonians',prev:'Philippians'},
    'I Thessalonians': {abbr:'1th',chapter:5,old:false,next:'II Thessalonians',prev:'Colossians'},
    'II Thessalonians': {abbr:'2th',chapter:3,old:false,next:'I Timothy',prev:'I Thessalonians'},
    'I Timothy': {abbr:'1ti',chapter:6,old:false,next:'II Timothy',prev:'II Thessalonians'},
    'II Timothy': {abbr:'2ti',chapter:4,old:false,next:'Titus',prev:'I Timothy'},
    'Titus': {abbr:'tit',chapter:3,old:false,next:'Philemon',prev:'II Timothy'},
    'Philemon': {abbr:'phm',chapter:1,old:false,next:'Hebrews',prev:'Titus'},
    'Hebrews': {abbr:'heb',chapter:13,old:false,next:'James',prev:'Philemon'},
    'James': {abbr:'jas',chapter:5,old:false,next:'I Peter',prev:'Hebrews'},
    'I Peter': {abbr:'1pe',chapter:5,old:false,next:'II Peter',prev:'James'},
    'II Peter': {abbr:'2pe',chapter:3,old:false,next:'I John',prev:'I Peter'},
    'I John': {abbr:'1jo',chapter:5,old:false,next:'II John',prev:'II Peter'},
    'II John': {abbr:'2jo',chapter:1,old:false,next:'III John',prev:'I John'},
    'III John': {abbr:'3jo',chapter:1,old:false,next:'Jude',prev:'II John'},
    'Jude': {abbr:'jude',chapter:1,old:false,next:'Revelation of John',prev:'III John'},
    'Revelation of John': {abbr:'re',chapter:22,old:false,next:'Genesis',prev:'Jude'}
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
function onReadUptoAsync(source, res, callback){
    try{
        let [stdout, length] = source.read_upto_finish(res);
        source.close(null);
        if (stdout == null) throw new Error('no data');
        callback(stdout.toString());
    } catch(err) {
        global.logError('['+err.lineNumber+'] ' + err.name +' : '+err.message);
        callback(null);
    }
}
/**
 * Read command line output asynchorous.
 */
function readCmdOutputAsync(cmd, callback){
    try{
        let [success,argv] = GLib.shell_parse_argv(cmd);
        if (!success) throw new Error(cmd);
        let [success2,pid,stdin,stdout,stderr] = GLib.spawn_async_with_pipes(null,argv,null,GLib.SpawnFlags.SEARCH_PATH,null);
        if (!success2) throw new Error(cmd);
        else {
            let source = new Gio.UnixInputStream({fd:stderr,close_fd:true});
            source.close(null);
            source = new Gio.UnixOutputStream({fd:stdin,close_fd:true});
            source.close(null);
            source = Gio.DataInputStream.new(new Gio.UnixInputStream({fd:stdout, close_fd:true}));
            source.read_upto_async(TERM, TERM.length, 0, null, Lang.bind(this, onReadUptoAsync, callback));
        }
    } catch (err) {
        global.logError('['+err.lineNumber+'] ' + err.name +' : '+err.message);
        callback(null);
    }
}
/**
 * BibleApplicaton:
 * 
 */
function BibleApplication() { this._init.apply(this, arguments); }
BibleApplication.prototype = {
    _init: function(owner, label_text) {
        this._owner = owner;
        this._actor = null;
        if (label_text != null){
            this._button = new St.Button({label:label_text});
            this._button.connect('clicked', Lang.bind(this, function(sender) {
                this._owner.setApplication(this);
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
        BibleApplication.prototype._init.call(this, owner, '\u263c');
        this._actor = new St.BoxLayout({vertical:true, style_class:'daily-verse'});
        this._versionButtons = [];
        // verse area
        this._verse = new St.Label({ style_class: 'verse-label' });
        this._verse.clutter_text.line_wrap = true;
        this._verse.clutter_text.line_wrap_mode = Pango.WrapMode.WORD_CHAR;
        this._verse.clutter_text.ellipsize = Pango.EllipsizeMode.NONE;
        this._ref = new St.Button({label:'', style_class:'ref-button'});
        this._ref._book = '';
        this._ref._chapter = 0;
        this._ref.connect('clicked', Lang.bind(this, function(sender){
            this._owner.setReference(sender._book, sender._chapter);
        }));
        this._actor.add(this._verse, {x_align:St.Align.START,x_fill:true,y_align:St.Align.MIDDLE,y_fill:false,expand:true});
        this._actor.add(this._ref, {x_align:St.Align.END,x_fill:false,y_align:St.Align.MIDDLE,y_fill:false,expand:false});
        // control area
        let layout = new St.BoxLayout({style_class:'control-area'});
        for (let i=0;i<BIBLE_VERSION.length;i++) {
            let button = new St.Button({ label: BIBLE_VERSION[i], style_class: 'version-button' });
            button.set_tooltip_text(_(BIBLE_VERSION[i]));
            button.connect('clicked', Lang.bind(this, this._onVersionButtonClicked));
            this._versionButtons.push(button);
            layout.add(button);
        }
        this._actor.add(layout, {x_align:St.Align.MIDDLE,x_fill:false,y_align:St.Align.END,y_fill:false,expand:true});
        //
        this._onVersionButtonClicked(this._versionButtons[0]);
    },
    _onVersionButtonClicked: function(sender){
        for (let i=0;i<this._versionButtons.length;i++){
            if (sender != this._versionButtons[i]) this._versionButtons[i].remove_style_class_name('current');
        }
        sender.add_style_class_name('current');
        this._refresh(sender.label);
        return true;
    },
    _refresh: function(version){
        let date = new Date();
        let timestamp = (date.getMonth()+1) + '-' + date.getDate();
        let cmd = 'diatheke -b ' + version + ' -k ' + DAILY_VERSE[timestamp];
        let [success, stdout, stderr, exit_status] = GLib.spawn_command_line_sync(cmd);
        if (success && exit_status == 0){
            stdout = stdout.toString();
            let text = stdout.replace(/^[^\d]+[\d:\s]+/mg, '')
                .replace(/\n\(.*\)\n$/, '')
                .replace(/\u3000/g, '').replace(/\n/g, '');
            this._verse.set_text(text);
            // update ref label
            let book_name = stdout.match(/^([\dA-Za-z\s]+)\s+\d+:\d+/);
            let chapter_name = DAILY_VERSE[timestamp].match(/(\d+):[\d-,\s]*/);
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
        BibleApplication.prototype._init.call(this, owner, '\u2756');
        this._actor = new St.Table({style_class:'book-navigator'});
        //
        let i = 0;
        for (let book in BIBLE_BOOK){
            let button = new St.Button({label:_(BIBLE_BOOK[book].abbr)});
            button.set_tooltip_text(_(book));
            button.connect('clicked', Lang.bind(this, this._onBookButtonClicked, book));
            if (BIBLE_BOOK[book].old){
                this._actor.add(button, {row:Math.floor(i/8), col:i%8});
            } else {
                this._actor.add(button, {row:Math.floor((i+1)/8), col:(i+1)%8});
            }
            i++;
        }
    },
    _onBookButtonClicked: function(sender, button, book){
        this._owner.setBook(book);
        return true;
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
        this._max = 0;
        this._label = new St.Label({text:'0',style_class:'chapter-label'});
        this._actor.add(this._label, {row:0,col:0,col_span:3});
        for (let i=1;i<10;i++){
            let button = new St.Button({label:String(i)});
            button.connect('clicked', Lang.bind(this, this._onButtonClicked));
            this._actor.add(button, {row:3-Math.floor((i-1)/3), col:(i-1)%3, col_span:1});
        }
        
        let button = new St.Button({label:'0'});
        button.connect('clicked', Lang.bind(this, this._onButtonClicked));
        this._actor.add(button, {row:4,col:0});
        
        let button = new St.Button({label:'C'});
        button.connect('clicked', Lang.bind(this, this._onButtonClicked));
        this._actor.add(button, {row:4,col:1});
        
        let button = new St.Button({label:'\u23ce'});
        button.connect('clicked', Lang.bind(this, this._onButtonClicked));
        this._actor.add(button, {row:4,col:2});
    },
    set max(value) { this._max = value; },
    _onButtonClicked: function(sender) {
        switch(sender.label){
            case 'C':
                this._label.set_text('0');
                break;
            case '\u23ce':
                if (this._label.text != '0') {
                    let chapter = Math.min(parseInt(this._label.text), this._max);
                    this._label.set_text('0');
                    this._owner.setChapter(chapter);
                }
                break;
            default:
                let value = parseInt(this._label.text);
                value = value * 10 + parseInt(sender.label);
                value = Math.min(value, this._max);
                if (value * 10 > this._max){
                    this._label.set_text('0');
                    this._owner.setChapter(value);
                } else {
                    this._label.set_text(String(value));
                }
                break;
        }
        return true;
    }
};
/**
 * VerseReader:
 * 
 */
function VerseReader() { this._init.apply(this, arguments); }
VerseReader.prototype = {
    __proto__ : BibleApplication.prototype,
    _init: function(owner) {
        BibleApplication.prototype._init.call(this, owner, '\u270e');
        this._actor = new St.BoxLayout({style_class:'verse-reader',vertical:true});
        //
        this._version = BIBLE_VERSION[0];
        this._book = '';
        this._chapter = 0;
        this._versionButtons = [];
        //
        let layout = new St.BoxLayout({style_class:'nav-area'});
        let button = new St.Button({ label:'\u25c0'});
        button.connect('clicked', Lang.bind(this, this._onNavButtonClicked));
        layout.add(button, {x_align:St.Align.START,x_fill:false,expand:false});
        button = new St.Button({ label:'\u25c1'});
        button.connect('clicked', Lang.bind(this, this._onNavButtonClicked));
        layout.add(button, {x_align:St.Align.START,x_fill:false,expand:false});
        this._ref = new St.Label({text:'', style_class:'ref-label'});
        layout.add(this._ref,{x_align:St.Align.MIDDLE,x_fill:false,expand:true});
        button = new St.Button({ label:'\u25b7' });
        button.connect('clicked', Lang.bind(this, this._onNavButtonClicked));
        layout.add(button,{x_align:St.Align.END,x_fill:false,expand:false});
        button = new St.Button({ label:'\u25b6'});
        button.connect('clicked', Lang.bind(this, this._onNavButtonClicked));
        layout.add(button, {x_align:St.Align.END,x_fill:false,expand:false});
        this._actor.add(layout,{x_align:St.Align.MIDDLE,x_fill:true,expand:false});
        //
        this._verse = new St.Label({ text:'', style_class: 'verse-label' }); // verse label
        this._verse.clutter_text.line_wrap = true;
        this._verse.clutter_text.line_wrap_mode = Pango.WrapMode.WORD_CHAR;
        this._verse.clutter_text.ellipsize = Pango.EllipsizeMode.NONE;
        layout = new St.BoxLayout({ vertical: true });
        layout.add(this._verse, { y_align: St.Align.START, expand: true });
        this._verseScroller = new St.ScrollView({style_class: 'verse-scroller'});
        this._verseScroller.add_actor(layout);
        this._verseScroller.set_policy(Gtk.PolicyType.NEVER, Gtk.PolicyType.AUTOMATIC);
        this._actor.add(this._verseScroller, {x_fill:true,y_fill:true,y_align: St.Align.START,expand:true});
        // control area
        let layout = new St.BoxLayout({style_class:'control-area'});
        for (let i=0;i<BIBLE_VERSION.length;i++) {
            let button = new St.Button({ label: BIBLE_VERSION[i], style_class: 'version-button' });
            button.set_tooltip_text(_(BIBLE_VERSION[i]));
            button.connect('clicked', Lang.bind(this, this._onVersionButtonClicked));
            this._versionButtons.push(button);
            layout.add(button);
        }
        this._versionButtons[0].add_style_class_name('current');
        this._actor.add(layout, {x_align:St.Align.MIDDLE,x_fill:false,y_align:St.Align.END,y_fill:false,expand:false});
    },
    setReference: function(book, chapter) {
        this._book = book;
        this._chapter = chapter;
        this._refresh();
    },
    _onNavButtonClicked: function(sender) {
        if (this._book == '') return true;
        switch(sender.label){
            case '\u25c0':this.setReference(BIBLE_BOOK[this._book].prev, 1);break;
            case '\u25c1':this.setReference(this._book, this._chapter - 1);break;
            case '\u25b7':this.setReference(this._book, this._chapter + 1);break;
            case '\u25b6':this.setReference(BIBLE_BOOK[this._book].next, 1);break;
        }
        return true;
    },
    _onVersionButtonClicked: function(sender){
        this._version = sender.label;
        for (let i=0;i<this._versionButtons.length;i++){
            if (sender != this._versionButtons[i]) this._versionButtons[i].remove_style_class_name('current');
        }
        sender.add_style_class_name('current');
        this._refresh();
        return true;
    },
    _onRead: function(stdout){
        if (stdout == null) {
            this._book = '';
            this._chapter = 0;
            this._ref.set_text('');
            this._verse.set_text('');
        } else {
            let text = stdout.replace(/^[^\d\n]+\d+:(\d+):/mg, '$1')
                .replace(/\u3000/g, '')
                .replace(/^\(.*\)/mg, '')
                .replace(/^\n/mg, '');
            this._verse.set_text(text);
            // update ref label
            let result = stdout.match(/^([^\d]+)\s+(\d+)/);
            if (result == null) {
                this._ref.set_text('');
                this._book = '';
                this._chapter = 0;
            } else {
                this._ref.set_text(_(result[1]) + ' ' + result[2]);
                this._book = result[1];
                this._chapter = parseInt(result[2]);
            }
            // scroll to top
            this._verseScroller.vscroll.adjustment.set_value(0);
        }
    },
    _refresh: function() {
        let cmd = 'diatheke -b ' + this._version + ' -k ' + this._book + ' ' + this._chapter;
        readCmdOutputAsync(cmd, Lang.bind(this, this._onRead));
    }
};
/**
 * Search:
 * 
 * todo:
 * entry focus, the menu closed automatically when focus move out of entry
 * version, allow search for any version
 * 
 */
function Search() { this._init.apply(this, arguments); }
Search.prototype = {
    __proto__ : BibleApplication.prototype,
    _init: function(owner) {
        BibleApplication.prototype._init.call(this, owner, '\u2707');
        this._actor = new St.BoxLayout({vertical:true,style_class:'search'});
        this._verses = [];
        this._page = 0;
        // nav area
        let layout = new St.BoxLayout({style_class:'nav-area'});
        let button = new St.Button({ label:'\u25c0'});
        button.connect('clicked', Lang.bind(this, this._onNavButtonClicked));
        layout.add(button, {x_align:St.Align.START,x_fill:false,expand:false});
        this._entry = new St.Entry({
            style_class:'search-entry',
            text:'',
            hint_text:_('Type to search ...'),
            track_hover: true,
            can_focus: true
        });
        this._keyword = '';
        this._text = this._entry.clutter_text;
        this._text.connect('key-press-event', Lang.bind(this, this._onKeyPress));
        this._inactiveIcon = new St.Icon({
            style_class: 'search-entry-icon',
            icon_name: 'edit-find',
            icon_type: St.IconType.SYMBOLIC
        });
        this._activeIcon = new St.Icon({
            style_class: 'search-entry-icon',
            icon_name: 'edit-clear',
            icon_type: St.IconType.SYMBOLIC
        });
        this._entry.set_primary_icon(this._inactiveIcon);
        this._entry.set_secondary_icon(this._activeIcon);
        this._entry.connect('secondary-icon-clicked', Lang.bind(this, function(sender){
            this._text.text = '';
            global.stage.set_key_focus(this._text);
        }));
        layout.add(this._entry,{x_align:St.Align.MIDDLE,x_fill:true,expand:true});
        button = new St.Button({ label:'\u25b6'});
        button.connect('clicked', Lang.bind(this, this._onNavButtonClicked));
        layout.add(button, {x_align:St.Align.END,x_fill:false,expand:false});
        this._actor.add(layout,{x_align:St.Align.MIDDLE,x_fill:true,expand:false});
        // label
        this._resultLabel = new St.Label({text:'', style_class:'res-label'});
        this._actor.add(this._resultLabel, {x_align:St.Align.MIDDLE,x_fill:false});
        // result area
        this._verseContainer = new St.BoxLayout({ vertical: true });
        this._verseButton = [];
        for (let i=0;i<SEARCH_PAGE_SIZE;i++){
            let button = new St.Button({label:''});
            button._book = '';
            button._chapter = 0;
            button.connect('clicked', Lang.bind(this, this._onVerseButtonClicked));
            this._verseButton.push(button);
            this._verseContainer.add(button, {x_align:St.Align.START,y_align:St.Align.START,x_fill:false,y_fill:false,expand:false});
        }
        this._spinner = new Panel.AnimatedIcon('process-working.svg', 24);
        //
        this._verseArea = new St.Bin({
            style_class:'verse-area',
            x_align:St.Align.START,
            y_align:St.Align.START,
            x_fill:true,
            y_fill:true
        });
        this._verseArea.set_child(this._verseContainer);
        this._actor.add(this._verseArea, {x_fill:true,y_fill:true,expand:true});
    },
    _onNavButtonClicked: function(sender){
        if (this._verses.length == 0) return true;
        let page = this._page;
        switch(sender.label){
            case '\u25c0':
                page = Math.max(page-1,0);
                page = Math.min(page, Math.ceil(this._verses.length/SEARCH_PAGE_SIZE)-1);
                if (page != this._page) {
                    this._page = page;
                    this._refresh();
                }
                break;
            case '\u25b6':
                page = Math.max(page+1,0);
                page = Math.min(page, Math.ceil(this._verses.length/SEARCH_PAGE_SIZE)-1);
                if (page != this._page) {
                    this._page = page;
                    this._refresh();
                }
                break;
        }
    },
    _onVerseButtonClicked: function(sender){
        if (sender._book != '' && sender._chapter != 0)
            this._owner.setReference(sender._book,sender._chapter);
    },
    _resetVerseButton: function(){
        for (let i=0;i<SEARCH_PAGE_SIZE;i++){
            this._verseButton[i].set_label('');
            this._verseButton[i]._book = '';
            this._verseButton[i]._chapter = 0;
        }
    },
    _showSpinner: function() {
        this._verseArea.set_child(this._spinner.actor);
        this._spinner.actor.show();
    },
    _hideSpinner: function(){
        this._spinner.actor.hide();
        this._verseArea.set_child(this._verseContainer);
    },
    _onKeyPress: function(entry, event) {
        let symbol = event.get_key_symbol();
        if (symbol == Clutter.Escape) {
            this._text.text = '';
            return true;
        } else if (symbol == Clutter.Return) {
            if (this._text.text != '') {
                this._keyword = this._text.text;
                this._text.text = '';
                this._doSearch();
            }
            return true;
        }
        return false;
    },
    _onReadVerse: function(stdout, i){
        if (stdout != null){
            let text = stdout.replace(/^[^\d]+\d+:\d+:\s*/g, '')
                .replace(/\u3000/g, '')
                .replace(/^\(.*\)/mg, '')
                .replace(/\n/g, '');
            let button = this._verseButton[i%SEARCH_PAGE_SIZE];
            let current = this._verses[i];
            button.set_label(_(current.book) + ' ' + current.chapter + ':'+current.verse+' '+text);
            button._book = current.book;
            button._chapter = current.chapter;
        }
    },
    _refresh: function(){
        this._resultLabel.set_text(_('Search "%s" : %d results, %d/%d').format(
            this._keyword, this._verses.length,
            this._verses.length == 0 ? 0 : this._page + 1,
            Math.ceil(this._verses.length/SEARCH_PAGE_SIZE)));
        this._resetVerseButton();
        for (let i=SEARCH_PAGE_SIZE*this._page;
            i<Math.min(this._verses.length, SEARCH_PAGE_SIZE*(this._page+1));i++){
            let current = this._verses[i];
            let cmd = 'diatheke -b ' + 'ChiUns' + ' -k ' + current.book + ' ' + current.chapter + ':' + current.verse;
            readCmdOutputAsync(cmd, Lang.bind(this, this._onReadVerse, i));
        }
        this._hideSpinner();
    },
    _onRead: function(stdout){
        if (stdout != null){
            let start = stdout.indexOf('--');
            let end = stdout.lastIndexOf('--');
            if (start == end) {
                this._refresh();
            } else {
                stdout = stdout.substring(start+2,end);
                let seg = stdout.split(';');
                for (let i=0;i<seg.length;i++){
                    let result = seg[i].trim().match(/([^\d]+)\s*(\d+):(\d+)/);
                    this._verses.push({book:result[1].trim(),chapter:parseInt(result[2]),verse:parseInt(result[3])});
                }
                this._refresh();
            }
        }
    },
    _doSearch: function(){
        this._verses = [];
        this._page = 0;
        this._resetVerseButton();
        let cmd = 'diatheke -b ChiUns -s phrase -k ' + this._keyword;
        this._resultLabel.set_text(_('Search "%s" : ...').format(this._keyword));
        this._showSpinner();
        readCmdOutputAsync(cmd, Lang.bind(this, this._onRead));
    }
};
/**
 * Indicator:
 * 
 */
function Indicator() { this._init.apply(this, arguments); }
Indicator.prototype = {
    __proto__: PanelMenu.SystemStatusButton.prototype,
    _init: function() {
        PanelMenu.SystemStatusButton.prototype._init.call(this, 'emblem-favorite', null);
        try{
            this._settings = new Gio.Settings({ schema: BIBLE_SETTINGS_SCHEMA });
            let modules = this._settings.get_strv(SCHEMA_KEY_ENABLED_VERSIONS);
            let cmd = 'diatheke -b system -k modulelistnames';
            let [success, stdout, stderr, exit_status] = GLib.spawn_command_line_sync(cmd);
            if (success && exit_status == 0){
                let installed = stdout.toString().trim().split('\n');
                for (let i=0;i<modules.length;i++) {
                    if (installed.indexOf(modules[i])!=-1) BIBLE_VERSION.push(modules[i]);
                }
            }
            if (BIBLE_VERSION.length == 0) throw new RangeError(_('No bible text modules found.'));
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
            layout.add(this._dailyVerse.button);
            layout.add(this._bookNavigator.button);
            layout.add(this._search.button);
            layout.add(this._verseReader.button);
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
        } catch (err) {
            global.logError('['+err.lineNumber+'] ' + err.name +' : '+err.message);
            if (err instanceof RangeError) {
                menuitem = new PopupMenu.PopupMenuItem(err.message);
                this.menu.addMenuItem(menuitem);
            }
        }
    },
    setApplication: function(app) {
        this._content.set_child(app.actor);
    },
    setBook: function(bookname) {
        this._book = bookname;
        this._chapterNavigator.max = BIBLE_BOOK[bookname].chapter;
        this.setApplication(this._chapterNavigator);
    },
    setChapter: function(chapter) {
        this._chapter = chapter;
        this._verseReader.setReference(this._book, this._chapter);
        this.setApplication(this._verseReader);
    },
    setReference: function(bookname, chapter){
        this._book = bookname;
        this._chapter = chapter;
        this._verseReader.setReference(this._book, this._chapter);
        this.setApplication(this._verseReader);
    }
};
function main(metadata) {
    Gettext.bindtextdomain("gnome-shell-extension-bible", metadata.path + '/locale');
    Gettext.textdomain("gnome-shell-extension-bible");

    Panel.STANDARD_TRAY_ICON_ORDER.unshift('tool');
    Panel.STANDARD_TRAY_ICON_SHELL_IMPLEMENTATION['tool'] = Indicator;
}
