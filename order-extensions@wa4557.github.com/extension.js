const Main = imports.ui.main;
const ExtensionUtils = imports.misc.extensionUtils;
const Extension = ExtensionUtils.getCurrentExtension();
const Lang = imports.lang;
const Panel = imports.ui.panel;
const GLib = imports.gi.GLib;
const Scripting = imports.ui.scripting;


const home_dir = GLib.get_home_dir();
const orderfile_path = ["/usr/share/indicators/application/", home_dir + "/.local/share/indicators/application/"];
const orderfile_fn = "ordering-override.keyfile";

/**
 * The method, which is invoked, when the extension has been enabled.
 */


function enable() {
    Panel.Panel.prototype._redrawIndicator = _redrawIndicator;
    Panel.Panel.prototype._addToPanelBox = _addToPanelBox;
}


function disable() {
}

function _redrawIndicator (pos_arr){

        let prev = pos_arr.length;
        for (let i = 0; i < pos_arr.length; i++){
            let role = pos_arr[i].role;
            let indicator = pos_arr[i].indicator;
            let position = prev;
            
            
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
            prev--;
      }


function  _addToPanelBox(role, indicator, position, box) {
        let orderfile = null;
        let order_file = false;
        
        let order_arr = (readFile(orderfile_path[0]+orderfile_fn));
        if (order_arr == null)
            order_arr = (readFile(orderfile_path[1]+orderfile_fn));
        if (order_arr !== null){
            order_file = true;
        }

        let pos_arr = []


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
        for (let k in this.statusArea) {
            let set_position = getFilePosition(k, order_arr);
            if (set_position == null){
                set_position = 0;
            }
            pos_obj = {}
            pos_obj.role = k;
            pos_obj.indicator = this.statusArea[k];
            pos_obj.position = set_position;
            pos_arr.push(pos_obj);
        }
        pos_arr.sort(function(a,b){ 
            if(a.position > b.position) return 1;
            else if(b.position > a.position) return -1;
            else if(b.position == a.position){
                if (a.role > b.role) return 1;
                else if (b.role > a.role) return -1;
                else return 1;
                }
            })
        if (order_file){
            this._redrawIndicator(pos_arr);
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


function getFilePosition(name, arr) {
    if (arr == null){
        return null;
    }
    let toTest = name;
    if (name.includes("/")){
        let dummy = name.split("/");
        toTest = dummy[dummy.length-1];
        }
    for (let val of arr) {
        if (toTest.replace(/_/g, '-') == val[0])
            return parseInt(val[1]);
        }
    return null;
    }
    



