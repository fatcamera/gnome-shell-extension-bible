const GLib = imports.gi.GLib;
let cmd = 'diatheke -b KJV -k ro 7';
let [success,argc,argv] = GLib.shell_parse_argv(cmd);
let [success,pid,stdin,stdout,stderr] = GLib.spawn_async_with_pipes(null,argv,null,GLib.SpawnFlags.SEARCH_PATH|GLib.SpawnFlags.DO_NOT_REAP_CHILD,null);
print('success = ' + success);
print('pid = ' + pid);
print('stdin = ' + stdin);
print('stdout = ' + stdout);
print('stderr = ' + stderr);

const Gio = imports.gi.Gio;
let stream = new Gio.BufferedInputStream(new Gio.UnixInputStream({fd:stdout}));
print('stream = ' + stream.toString());
stream.fill(100,null);
/*
stream.read_line_async(0, null, function(source, result){
    let ret = source.read_line_finish(result, null);
    print(ret);
});
*/
