// -*- mode: js2; indent-tabs-mode: nil; js2-basic-offset: 4 -*-

/* exported init, buildPrefsWidget */

const Gio = imports.gi.Gio;
const GLib = imports.gi.GLib;

try {
    // eslint-disable-next-line no-unused-expressions
    imports.misc.extensionUtils;
} catch (e) {
    const resource = Gio.Resource.load(
        '/usr/share/gnome-shell/org.gnome.Extensions.src.gresource');
    resource._register();
    imports.searchPath.push('resource:///org/gnome/Extensions/js');

    const gtkVersion = GLib.getenv('FORCE_GTK_VERSION') || '4.0';
    imports.gi.versions.Gtk = gtkVersion;
    imports.gi.versions.Gdk = gtkVersion;
}

const GObject = imports.gi.GObject;
const Gtk = imports.gi.Gtk;

const ExtensionUtils = imports.misc.extensionUtils;
const Me = ExtensionUtils.getCurrentExtension();
const Convenience = Me.imports.convenience;
const Gettext = imports.gettext.domain(
    Me ? Me.metadata['gettext-domain'] : 'OrderIconsExtension');
const _ = Gettext.gettext;

function init() {
    ExtensionUtils.initTranslations();
}




const OrderIconsPreferences = GObject.registerClass(
class OrderIconsPreferences extends Gtk.Box {
    _init() {
        super._init({ orientation: Gtk.Orientation.VERTICAL, spacing: 30 });

        this._settings = Convenience.getSettings('org.gnome.shell.extensions.order-icons');
        let label = null;
        let button_up_left = null;
        let button_down_left = null;
        let button_up_center = null;
        let button_down_center = null;
        let button_up_right = null;
        let button_down_right = null;
        
        // Boxes for list stores
        this.right_order_hbox = new Gtk.Box({ orientation: Gtk.Orientation.HORIZONTAL,
            spacing: 8,
            margin_start: 30,
            margin_end: 30,
            margin_top: 30,
            margin_bottom: 30 });
        this.center_order_hbox = new Gtk.Box({ orientation: Gtk.Orientation.HORIZONTAL,
            spacing: 8,
            margin_start: 30,
            margin_end: 30,
            margin_top: 30,
            margin_bottom: 30 });
          this.left_order_hbox = new Gtk.Box({ orientation: Gtk.Orientation.HORIZONTAL,
            spacing: 8,
            margin_start: 30,
            margin_end: 30,
            margin_top: 30,
            margin_bottom: 30 });
         
         // Button boxes
         this.left_button_vbox = new Gtk.Box({ orientation: Gtk.Orientation.VERTICAL,
            spacing: 8,
            margin_start: 30,
            margin_end: 30,
            margin_top: 30,
            margin_bottom: 30 });
            
         this.center_button_vbox = new Gtk.Box({ orientation: Gtk.Orientation.VERTICAL,
            spacing: 8,
            margin_start: 30,
            margin_end: 30,
            margin_top: 30,
            margin_bottom: 30 });
            
        this.right_button_vbox = new Gtk.Box({ orientation: Gtk.Orientation.VERTICAL,
            spacing: 8,
            margin_start: 30,
            margin_end: 30,
            margin_top: 30,
            margin_bottom: 30 });
        
        button_up_left = new Gtk.Button()
        button_up_left.set_icon_name("gtk-go-up");
        button_down_left = new Gtk.Button()
        button_down_left.set_icon_name("gtk-go-down");
        
        
        
        
        if (imports.gi.versions.Gtk === '4.0') {
            this.left_button_vbox.append(button_up_left);
            this.left_button_vbox.append(button_down_left);
        } else {
            this.left_button_vbox.pack_start(button_up_left, true, true, 0);
            this.left_button_vbox.pack_start(button_down_left, false, false, 0);
        }
        
        button_up_center = new Gtk.Button()
        button_up_center.set_icon_name("gtk-go-up");
        button_down_center = new Gtk.Button()
        button_down_center.set_icon_name("gtk-go-down");
        
        if (imports.gi.versions.Gtk === '4.0') {
            this.center_button_vbox.append(button_up_center);
            this.center_button_vbox.append(button_down_center);
        } else {
            this.center_button_vbox.pack_start(button_up_center, true, true, 0);
            this.center_button_vbox.pack_start(button_down_center, false, false, 0);
        }
        
        
        button_up_right = new Gtk.Button()
        button_up_right.set_icon_name("gtk-go-up");
        button_down_right = new Gtk.Button()
        button_down_right.set_icon_name("gtk-go-down");
        
        if (imports.gi.versions.Gtk === '4.0') {
            this.right_button_vbox.append(button_up_right);
            this.right_button_vbox.append(button_down_right);
        } else {
            this.right_button_vbox.pack_start(button_up_right, true, true, 0);
            this.right_button_vbox.pack_start(button_down_right, false, false, 0);
        }
        
        
        const cellrenderer = new Gtk.CellRendererText({ editable: false });
        
        // right box
        const order_right_store = new Gtk.ListStore();
        order_right_store.set_column_types([
            GObject.TYPE_STRING
        ]);
        const right_order_array = this._settings.get_value('order-icons-right').deep_unpack()
        right_order_array.forEach(value => {
            order_right_store.set(order_right_store.append(), [0], [value])
        });
        
        const rightorderTreeView = new Gtk.TreeView({
            model: order_right_store,
            hexpand: true,
            vexpand: true,
        });
        const right_order_column = new Gtk.TreeViewColumn({
            title: "Order Indicators",
            sizing: Gtk.TreeViewColumnSizing.AUTOSIZE,
        });
        
        // center box
        const order_center_store = new Gtk.ListStore();
        order_center_store.set_column_types([
            GObject.TYPE_STRING,
        ]);
        
        const center_order_array = this._settings.get_value('order-icons-center').deep_unpack()
        center_order_array.forEach(value => {
            order_center_store.set(order_center_store.append(), [0], [value])
        });
        
        const centerorderTreeView = new Gtk.TreeView({
            model: order_center_store,
            hexpand: true,
            vexpand: true,
        });
        
        const center_order_column = new Gtk.TreeViewColumn({
            title: "Order Indicators",
            sizing: Gtk.TreeViewColumnSizing.AUTOSIZE,
        });
        
        // left box
        const order_left_store = new Gtk.ListStore();
        order_left_store.set_column_types([
            GObject.TYPE_STRING,
        ]);
        
        const left_order_array = this._settings.get_value('order-icons-left').deep_unpack()
        left_order_array.forEach(value => {
            order_left_store.set(order_left_store.append(), [0], [value])
        });
        
        const leftorderTreeView = new Gtk.TreeView({
            model: order_left_store,
            hexpand: true,
            vexpand: true,
        });

        
        const left_order_column = new Gtk.TreeViewColumn({
            title: "Order Indicators",
            sizing: Gtk.TreeViewColumnSizing.AUTOSIZE,
        });
        
        
        left_order_column.pack_start(cellrenderer, true);
        left_order_column.add_attribute(cellrenderer, 'text', 0);
        leftorderTreeView.insert_column(left_order_column, 0);
        leftorderTreeView.set_grid_lines(Gtk.TreeViewGridLines.BOTH);
        
        center_order_column.pack_start(cellrenderer, true);
        center_order_column.add_attribute(cellrenderer, 'text', 0);
        centerorderTreeView.insert_column(center_order_column, 0);
        centerorderTreeView.set_grid_lines(Gtk.TreeViewGridLines.BOTH);
        
        right_order_column.pack_start(cellrenderer, true);
        right_order_column.add_attribute(cellrenderer, 'text', 0);
        rightorderTreeView.insert_column(right_order_column, 0);
        rightorderTreeView.set_grid_lines(Gtk.TreeViewGridLines.BOTH);



        button_up_left.connect("clicked",  _ => {
            let selection = leftorderTreeView.get_selection();
            let [isSelected, model, selected_row] = selection.get_selected();
            if (isSelected == false) return
            
            let [index2, model2] = selection.get_selected_rows()
            let index = index2[0].get_indices()
            let index_above = parseInt(index)  - 1
            let length_store = order_left_store.iter_n_children(null);
            if (index_above >= 0){
                 let path_above = Gtk.TreePath.new_from_string(index_above.toString())
                 let iter_above = order_left_store.get_iter(path_above)[1]
                 order_left_store.move_before(selected_row, iter_above)
                 let new_order_arr = []
                 for (let i = 0; i < length_store; i++) {
                        const returnIter = order_left_store.iter_nth_child(null, i);
                        const [success, iterList] = returnIter;
                        if (!success)
                            break;
                        if (iterList) {
                            new_order_arr.push(order_left_store.get_value(iterList, 0));
                        } else {
                            break;
                        }
                 }
                 this._settings.set_value("order-icons-left", new GLib.Variant('as', new_order_arr))
            }
        });
        
        button_down_left.connect("clicked",  _ => {
            let selection = leftorderTreeView.get_selection();
            let [isSelected, model, selected_row] = selection.get_selected();
            if (isSelected == false) return
            
            let [index2, model2] = selection.get_selected_rows()
            let index = index2[0].get_indices()
            let index_below = parseInt(index)  + 1
            let length_store = order_left_store.iter_n_children(null);
            
            if (index_below < length_store){
                 let path_below = Gtk.TreePath.new_from_string(index_below.toString())
                 let iter_below = order_left_store.get_iter(path_below)[1]
                 order_left_store.move_after(selected_row, iter_below)
                 let new_order_arr = []
                 for (let i = 0; i < length_store; i++) {
                        const returnIter = order_left_store.iter_nth_child(null, i);
                        const [success, iterList] = returnIter;
                        if (!success)
                            break;
                        if (iterList) {
                            new_order_arr.push(order_left_store.get_value(iterList, 0));
                        } else {
                            break;
                        }
                 }
                 this._settings.set_value("order-icons-left", new GLib.Variant('as', new_order_arr))
            }
        });
        
        
        
        button_up_center.connect("clicked",  _ => {
            let selection = centerorderTreeView.get_selection();
            let [isSelected, model, selected_row] = selection.get_selected();
            if (isSelected == false) return
            
            let [index2, model2] = selection.get_selected_rows()
            let index = index2[0].get_indices()
            let index_above = parseInt(index)  - 1
            let length_store = order_center_store.iter_n_children(null);
            if (index_above >= 0){
                 let path_above = Gtk.TreePath.new_from_string(index_above.toString())
                 let iter_above = order_center_store.get_iter(path_above)[1]
                 order_center_store.move_before(selected_row, iter_above)
                 let new_order_arr = []
                 for (let i = 0; i < length_store; i++) {
                        const returnIter = order_center_store.iter_nth_child(null, i);
                        const [success, iterList] = returnIter;
                        if (!success)
                            break;
                        if (iterList) {
                            new_order_arr.push(order_center_store.get_value(iterList, 0));
                        } else {
                            break;
                        }
                 }
                 this._settings.set_value("order-icons-center", new GLib.Variant('as', new_order_arr))
            }
        });
        
        button_down_center.connect("clicked",  _ => {
            let selection = centerorderTreeView.get_selection();
            let [isSelected, model, selected_row] = selection.get_selected();
            if (isSelected == false) return
            
            let [index2, model2] = selection.get_selected_rows()
            let index = index2[0].get_indices()
            let index_below = parseInt(index)  + 1
            let length_store = order_center_store.iter_n_children(null);
            
            if (index_below < length_store){
                 let path_below = Gtk.TreePath.new_from_string(index_below.toString())
                 let iter_below = order_center_store.get_iter(path_below)[1]
                 order_center_store.move_after(selected_row, iter_below)
                 let new_order_arr = []
                 for (let i = 0; i < length_store; i++) {
                        const returnIter = order_center_store.iter_nth_child(null, i);
                        const [success, iterList] = returnIter;
                        if (!success)
                            break;
                        if (iterList) {
                            new_order_arr.push(order_center_store.get_value(iterList, 0));
                        } else {
                            break;
                        }
                 }
                 this._settings.set_value("order-icons-center", new GLib.Variant('as', new_order_arr))
            }
        });
        
        
        
        button_up_right.connect("clicked",  _ => {
            let selection = rightorderTreeView.get_selection();
            let [isSelected, model, selected_row] = selection.get_selected();
            if (isSelected == false) return
            
            let [index2, model2] = selection.get_selected_rows()
            let index = index2[0].get_indices()
            let index_above = parseInt(index)  - 1
            let length_store = order_right_store.iter_n_children(null);
            if (index_above >= 0){
                 let path_above = Gtk.TreePath.new_from_string(index_above.toString())
                 let iter_above = order_right_store.get_iter(path_above)[1]
                 order_right_store.move_before(selected_row, iter_above)
                 let new_order_arr = []
                 for (let i = 0; i < length_store; i++) {
                        const returnIter = order_right_store.iter_nth_child(null, i);
                        const [success, iterList] = returnIter;
                        if (!success)
                            break;
                        if (iterList) {
                            new_order_arr.push(order_right_store.get_value(iterList, 0));
                        } else {
                            break;
                        }
                 }
                 this._settings.set_value("order-icons-right", new GLib.Variant('as', new_order_arr))
            }
        });
        
        button_down_right.connect("clicked",  _ => {
            let selection = rightorderTreeView.get_selection();
            let [isSelected, model, selected_row] = selection.get_selected();
            if (isSelected == false) return
            
            let [index2, model2] = selection.get_selected_rows()
            let index = index2[0].get_indices()
            let index_below = parseInt(index)  + 1
            let length_store = order_right_store.iter_n_children(null);
            
            if (index_below < length_store){
                 let path_below = Gtk.TreePath.new_from_string(index_below.toString())
                 let iter_below = order_right_store.get_iter(path_below)[1]
                 order_right_store.move_after(selected_row, iter_below)
                 let new_order_arr = []
                 for (let i = 0; i < length_store; i++) {
                        const returnIter = order_right_store.iter_nth_child(null, i);
                        const [success, iterList] = returnIter;
                        if (!success)
                            break;
                        if (iterList) {
                            new_order_arr.push(order_right_store.get_value(iterList, 0));
                        } else {
                            break;
                        }
                 }
                 this._settings.set_value("order-icons-right", new GLib.Variant('as', new_order_arr))
            }
        });
        

        if (imports.gi.versions.Gtk === '4.0'){
            this.left_order_hbox.append(leftorderTreeView);
            this.left_order_hbox.append(this.left_button_vbox);
            this.center_order_hbox.append(centerorderTreeView);
            this.center_order_hbox.append(this.center_button_vbox);
            this.right_order_hbox.append(rightorderTreeView);
            this.right_order_hbox.append(this.right_button_vbox);
            }
        else{
            this.left_order_hbox.pack_start(leftorderTreeView, false, false, 0);
            this.left_order_hbox.pack_start(this.left_button_vbox, false, false, 0);
            this.center_order_hbox.pack_start(centerorderTreeView, false, false, 0);
            this.center_order_hbox.pack_start(this.center_button_vbox, false, false, 0);
            this.right_order_hbox.pack_start(rightorderTreeView, false, false, 0);
            this.right_order_hbox.pack_start(this.right_button_vbox, false, false, 0);
            }


        this.notebook = new Gtk.Notebook();
        this.notebook.append_page(this.right_order_hbox,
            new Gtk.Label({ label: _('Right Panel') }));
        this.notebook.append_page(this.center_order_hbox,
            new Gtk.Label({ label: _('Center Panel') }));
        this.notebook.append_page(this.left_order_hbox,
            new Gtk.Label({ label: _('Left Panel') }));
        if (imports.gi.versions.Gtk === '4.0')
            this.append(this.notebook);
        else
            this.add(this.notebook);
    }
});

function buildPrefsWidget() {
    let widget = new OrderIconsPreferences();

    if (widget.show_all)
        widget.show_all();

    return widget;
}

if (!Me) {
    GLib.setenv('GSETTINGS_SCHEMA_DIR', './schemas', true);
    Gtk.init(null);

    const loop = GLib.MainLoop.new(null, false);
    const win = new Gtk.Window();
    if (win.set_child) {
        win.set_child(buildPrefsWidget());
        win.connect('close-request', () => loop.quit());
    } else {
        win.add(buildPrefsWidget());
        win.connect('delete-event', () => loop.quit());
    }
    win.present();

    loop.run();
}
