import GLib from 'gi://GLib';
import * as Main from 'resource:///org/gnome/shell/ui/main.js';
import * as Panel from 'resource:///org/gnome/shell/ui/panel.js';
import { Extension, gettext as _ } from 'resource:///org/gnome/shell/extensions/extension.js';

const _origAddToPanelBox = Panel.Panel.prototype._addToPanelBox;

let timeout_id = null;
let settings = null;
let order_arr_left = null;
let order_arr_center = null;
let order_arr_right = null;
let blacklist_array = null;
let order_arr = null;

export default class OrderIcons extends Extension {
    enable() {
        settings = this.getSettings()
        order_arr_left = settings.get_value("order-icons-left").deep_unpack()
        order_arr_center = settings.get_value("order-icons-center").deep_unpack()
        order_arr_right = settings.get_value("order-icons-right").deep_unpack()
        blacklist_array = settings.get_value("icons-blacklist").deep_unpack()
        Panel.Panel.prototype._redrawIndicators = _redrawIndicators;
        Panel.Panel.prototype._addToPanelBox = _addToPanelBox;
        Main.panel._redrawIndicators();
        this.settingsIDs = [];
        this.settingsIDs.push(settings.connect('changed::order-icons-left', _ => {
            Main.panel._redrawIndicators()
        }));
        this.settingsIDs.push(settings.connect('changed::order-icons-center', _ => {
            Main.panel._redrawIndicators()
        }));
        this.settingsIDs.push(settings.connect('changed::order-icons-right', _ => {
            Main.panel._redrawIndicators()
        }));
        this.settingsIDs.push(settings.connect('changed::icons-blacklist', _ => {
            Main.panel._redrawIndicators()
        }));
    }

    disable() {
        Panel.Panel.prototype._redrawIndicators = undefined;
        Panel.Panel.prototype._addToPanelBox = _origAddToPanelBox;
        this.settingsIDs.forEach(id => settings.disconnect(id));
        GLib.Source.remove(timeout_id);
        timeout_id = null;
        order_arr_left = null;
        order_arr_center = null;
        order_arr_right = null;
        blacklist_array = null;
        this.settingsIDs = null;
        settings = null;
    }
}



function _redrawIndicators() {
    order_arr_left = settings.get_value("order-icons-left").deep_unpack()
    order_arr_center = settings.get_value("order-icons-center").deep_unpack()
    order_arr_right = settings.get_value("order-icons-right").deep_unpack()
    blacklist_array = settings.get_value("icons-blacklist").deep_unpack()
    for (const k in this.statusArea) {
        const role = k;
        const indicator = this.statusArea[k];
        let box = indicator.get_parent().get_parent();
        if (box == undefined) continue
        this._addToPanelBox(role, indicator, 0, box)
    }

}


function _addToPanelBox(role, indicator, position, box) {

    const container = indicator.container;
    container.show();
    const parent = container.get_parent();
    if (parent) {
        parent.remove_actor(container);
    }

    this.statusArea[role] = indicator;
    // not ideal, but due to recent changes in appindicator-extension we have to wait for the ID to become available
    let in_blacklist = false;
    waitForId(indicator, role).then(() => {
        let position_corr = getRelativePosition(indicator, role, box.name, this.statusArea);
        let testName = getTestName(indicator, role);
        if (blacklist_array.includes(testName)) {
            in_blacklist = true;
        }
        else {
            setSettingValues(testName, box);
            box.insert_child_at_index(container, position_corr ? position_corr : position);
        }
    }).catch((error) => { console.log(error) })
    if (in_blacklist) {
        delete this.statusArea[role];
    }
    else {
        if (indicator.menu) {
            this.menuManager.addMenu(indicator.menu);
        }
        const destroyId = indicator.connect('destroy', (emitter) => {
            delete this.statusArea[role];
            emitter.disconnect(destroyId);
        });
        indicator.connect('menu-set', this._onMenuSet.bind(this));
        this._onMenuSet(indicator);
    }
}


function setSettingValues(name, box) {

    let index = null;
    let index_arr = null;

    if (box.name == "panelRight") {
        index = getSettingsPosition(name, order_arr_right);
        index_arr = order_arr_right.indexOf(name);
        if (index_arr == -1) {
            order_arr_right.splice(index, 0, name);
        }
    }
    if (box.name == "panelCenter") {
        index = getSettingsPosition(name, order_arr_center);
        index_arr = order_arr_center.indexOf(name);
        if (index_arr == -1) {
            order_arr_center.splice(index, 0, name);
        }
    }
    if (box.name == "panelLeft") {
        index = getSettingsPosition(name, order_arr_left);
        index_arr = order_arr_left.indexOf(name);
        if (index_arr == -1) {
            order_arr_left.splice(index, 0, name);
        }
    }

    settings.set_value("order-icons-right", new GLib.Variant('as', order_arr_right))
    settings.set_value("order-icons-center", new GLib.Variant('as', order_arr_center))
    settings.set_value("order-icons-left", new GLib.Variant('as', order_arr_left))
}


function getRelativePosition(indicator, role, boxName, statusArea) {
    const indicatorTestName = getTestName(indicator, role);
    if (boxName == "panelRight")
        order_arr = order_arr_right
    else if (boxName == "panelCenter")
        order_arr = order_arr_center
    else if (boxName == "panelLeft")
        order_arr = order_arr_left
    const indicatorPosition = getSettingsPosition(indicatorTestName, order_arr);

    let ctr = 0
    for (const k in statusArea) {
        if (k == role) continue
        if (statusArea[k].get_parent().get_parent() != null && boxName === statusArea[k].get_parent().get_parent().get_name()) {
            const toTest = getTestName(statusArea[k], k);
            let setPosition = getSettingsPosition(toTest, order_arr);
            if (setPosition == null) {
                setPosition = 0;
            }
            if (setPosition < indicatorPosition) {
                ctr = ctr + 1;
            }

        }
    }
    return ctr
}


function until(conditionFunction) {
    const poll = resolve => {
        if (conditionFunction()) {
            resolve();
            return GLib.G_SOURCE_REMOVE;
        } else {
            timeout_id = GLib.timeout_add(GLib.PRIORITY_DEFAULT, 500, _ => poll(resolve));
            return GLib.G_SOURCE_REMOVE;
        }
    }
    return new Promise(poll);
}



function getTestName(indicator, name) {
    let toTest = name;
    if (indicator._indicator) {
        let id = indicator._indicator.id;
        if (name.startsWith('appindicator-')) {
            if (id.startsWith('chrome_status_icon')) {
                // electron apps don't give a good ID with newer releases, so we have to revert to command line and try to get something useful
                let commandLine = indicator._indicator._commandLine;
                let commandLineSplit = commandLine.split('/');
                toTest = commandLineSplit[commandLineSplit.length - 1];
            }
            else {
                toTest = id;
            }
        }
    }
    if (toTest) {
        const match = toTest.match(/appindicator-legacy:(.*?):/);
        if (match && match.length > 1) {
            return match[1];
        }
        if (toTest.includes('dropbox')) {
            // dropbox needs special treatment because it appends the pid to the id.
            // So we need to hardcode the name
            return 'dropbox';
        }
        return toTest;
    }
    let ret = name.split("/")
    return ret[ret.length - 1].replaceAll("_", "-")
}

async function waitForId(indicator, name) {
    if (indicator._indicator && name.startsWith('appindicator-')) {
        await until(_ => (indicator._indicator.id != undefined && indicator._indicator._commandLine != undefined));
    }
    return true
}

function getSettingsPosition(name, arr) {
    if (arr == null) {
        return 0;
    }
    let index = arr.indexOf(name);
    return index != -1 ? index : 0;
}
