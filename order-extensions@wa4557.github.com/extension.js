const Main = imports.ui.main;
const ExtensionUtils = imports.misc.extensionUtils;
const Extension = ExtensionUtils.getCurrentExtension();
const Lang = imports.lang;
const Panel = imports.ui.panel;
const GLib = imports.gi.GLib;

const home_dir = GLib.get_home_dir();
const orderfile_path = ["/usr/share/indicators/application/", home_dir + "/.local/share/indicators/application/"];
const orderfile_fn = "ordering-override.keyfile";

var _origAddToPanelBox = Panel.Panel.prototype._addToPanelBox;


let order_file = false;
let order_arr = null;

let order_arr_sys = (readFile(orderfile_path[0]+orderfile_fn));
let order_arr_user = (readFile(orderfile_path[1]+orderfile_fn));

if (order_arr_user !== null){
    order_arr = order_arr_user;
    order_file = true;
}
else if (order_arr_user == null && order_arr_sys !== null){
    order_arr = order_arr_sys;
    order_file = true;
}

function enable() {
    Panel.Panel.prototype._redrawIndicators = _redrawIndicators;
    Panel.Panel.prototype._addToPanelBox = _addToPanelBox;
    let pos_arrs = getPosArr(Main.panel.statusArea);
    if (order_file){
        for (let pos_arr of pos_arrs){
            Main.panel._redrawIndicators(pos_arr);
        }
    }
}

function disable() {
    Panel.Panel.prototype._redrawIndicators = undefined;
    Panel.Panel.prototype._addToPanelBox = _origAddToPanelBox;
}

function _redrawIndicators (pos_arr){
        for (let i = 0; i < pos_arr.length; i++){
            let role = pos_arr[i].role;
            let indicator = pos_arr[i].indicator;
            let position = i;
            let box = this.statusArea[role].get_parent().get_parent()
            let container = indicator.container;
            container.show();
            let parent = container.get_parent();
            if (parent)
                parent.remove_actor(container);
            box.insert_child_at_index(container, position);
            if (indicator.menu)
                this.menuManager.addMenu(indicator.menu);
            this.statusArea[role] = indicator;
            let destroyId = indicator.connect('destroy', emitter => {
                delete this.statusArea[role];
                emitter.disconnect(destroyId);
            });
            indicator.connect('menu-set', this._onMenuSet.bind(this));
            this._onMenuSet(indicator);
        }
}

function  _addToPanelBox(role, indicator, position, box) {
        order_arr_sys = (readFile(orderfile_path[0]+orderfile_fn));
        order_arr_user = (readFile(orderfile_path[1]+orderfile_fn));

        if (order_arr_user !== null){
            order_arr = order_arr_user;
            order_file = true;
        }
        else if (order_arr_user == null && order_arr_sys !== null){
            order_arr = order_arr_sys;
            order_file = true;
        }
        let container = indicator.container;
        container.show();
        let parent = container.get_parent();
        if (parent)
            parent.remove_actor(container);
        box.insert_child_at_index(container, position);
        if (indicator.menu)
            this.menuManager.addMenu(indicator.menu);
        this.statusArea[role] = indicator;
               

        let destroyId = indicator.connect('destroy', emitter => {
            delete this.statusArea[role];
            emitter.disconnect(destroyId);
        });
        indicator.connect('menu-set', this._onMenuSet.bind(this));
        this._onMenuSet(indicator);
        let pos_arrs = getPosArr(this.statusArea);
        if (order_file){
            for (let pos_arr of pos_arrs)
                this._redrawIndicators(pos_arr);
        }
}

function readFile(path) {
    let test = GLib.file_test(path, GLib.FileTest.IS_REGULAR)
    if (!test) {
        return null;
        }
    let [err, data] = GLib.file_get_contents(path);
    let s_data = String(data).split("\n");
    let ret_arr = [];
    for (let val of s_data) {
        if (!val.includes("="))
            continue;
        let temp_val = val.split("=")
        ret_arr.push(temp_val);
    }
    return ret_arr;
}

function getPosArr(statusArea){
    let pos_arr_left = []
    let pos_arr_middle = []
    let pos_arr_right = []

    for (let k in statusArea) {
        let toTest = getTestName(statusArea[k], k);
        log("Order application icons: " + toTest);
        let set_position = getFilePosition(toTest, order_arr);
        if (set_position == null){
            set_position = 0;
        }
        pos_obj = {}
        pos_obj.role = k;
        pos_obj.indicator = statusArea[k];
        pos_obj.position = set_position;
        pos_obj.box = statusArea[k].get_parent().get_parent();
        if (pos_obj.box.name == 'panelLeft')
            pos_arr_left.push(pos_obj);
        else if(pos_obj.box.name == 'panelCenter')
            pos_arr_middle.push(pos_obj);
        else if(pos_obj.box.name == 'panelRight')
            pos_arr_right.push(pos_obj);
    }
    pos_arr_left.sort(sortFun)
    pos_arr_middle.sort(sortFun)
    pos_arr_right.sort(sortFun)

    return [pos_arr_left, pos_arr_middle, pos_arr_right]
}


function getTestName(indicator, name){
    let toTest = name;
    if (name.startsWith("appindicator-:")){
        if (name.includes("dropbox")){
            // dropbox needs special treatment because it appends the pid to the id. So we need to use the less appropriate title
            toTest = indicator._indicator.title;
            }
        else {
            toTest = indicator._indicator.id;
        }
    }
    return toTest;
}

function getFilePosition(name, arr) {
    if (arr == null){
        return null;
    }
    for (let val of arr) {
        if (name == val[0]){
            return parseInt(val[1]);
            }
        }
    return null;
}

function sortFun(a, b){
    if(a.position > b.position) 
        return 1;
    else if(b.position > a.position) 
        return -1;
    else if(b.position == a.position){
        if (a.role > b.role) 
            return 1;
        else if (b.role > a.role) 
            return -1;
        else 
            return 1;
    }
}


