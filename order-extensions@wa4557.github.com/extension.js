const Main = imports.ui.main;
const Panel = imports.ui.panel;
const GLib = imports.gi.GLib;
const ByteArray = imports.byteArray
const ExtensionUtils = imports.misc.extensionUtils;
const Me = ExtensionUtils.getCurrentExtension();

const _origAddToPanelBox = Panel.Panel.prototype._addToPanelBox;

let timeout_id = null;
let settingIds = null;
let settings = null;
let order_arr_left = null;
let order_arr_center= null;
let order_arr_right = null;


function enable() {
    settings = ExtensionUtils.getSettings("org.gnome.shell.extensions.order-icons")
    order_arr_left = settings.get_value("order-icons-left").deep_unpack()
    order_arr_center = settings.get_value("order-icons-center").deep_unpack()
    order_arr_right = settings.get_value("order-icons-right").deep_unpack()
    Panel.Panel.prototype._redrawIndicators = _redrawIndicators;
    Panel.Panel.prototype._addToPanelBox = _addToPanelBox;
    Main.panel._redrawIndicators();
    settingIds = [];
    settingIds.push(settings.connect('changed::order-icons-left', _ => {
        Main.panel._redrawIndicators()
    }));
    settingIds.push(settings.connect('changed::order-icons-center', _ => {
        Main.panel._redrawIndicators()
    }));
    settingIds.push(settings.connect('changed::order-icons-right', _ => {
        Main.panel._redrawIndicators()
    }));
}


function disable() {
    Panel.Panel.prototype._redrawIndicators = undefined;
    Panel.Panel.prototype._addToPanelBox = _origAddToPanelBox;
    settingIds.forEach(id => settings.disconnect(id));
    GLib.Source.remove(timeout_id);
    timeout_id = null;
    order_arr_left = null;
    order_arr_center = null;
    order_arr_right = null;
    settingIds = null;
}


function _redrawIndicators() {
    order_arr_left = settings.get_value("order-icons-left").deep_unpack()
    order_arr_center = settings.get_value("order-icons-center").deep_unpack()
    order_arr_right = settings.get_value("order-icons-right").deep_unpack()
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
    waitForId(indicator, role).then(_ => {
        let position_corr = getRelativePosition(indicator, role, box.name, this.statusArea)
        setSettingValues(indicator, role, box)
        box.insert_child_at_index(container, position_corr ? position_corr : position);
    });

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


function setSettingValues(indicator, role, box) {

    let index = null;
    let index_arr = null;
    let name = getTestName(indicator, role);

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


async function waitForId(indicator, name) {
    if (indicator._indicator && name.startsWith('appindicator-')) {
        await until(_ => indicator._indicator.id != null);
    }
    return true
}


function getTestName(indicator, name) {
    let toTest = name;
    if (indicator._indicator) {
        if (name.startsWith('appindicator-')) {
            if (name.includes('dropbox')) {
                // dropbox needs special treatment because it appends the pid to the id.
                // So we need to use the less appropriate title
                toTest = indicator._indicator.title;
            } else {
                toTest = indicator._indicator.id;
            }
        }
    }
    if (toTest) {
        return toTest;
    } else {
        let ret = name.split("/")
        return ret[ret.length - 1].replaceAll("_", "-")
    }
}


function getSettingsPosition(name, arr) {
    if (arr == null) {
        return 0;
    }
    let index = arr.indexOf(name);
    return index != -1 ? index : 0;
}
