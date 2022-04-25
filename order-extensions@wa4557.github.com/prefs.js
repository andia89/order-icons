// -*- mode: js2; indent-tabs-mode: nil; js2-basic-offset: 4 -*-

/* exported init, buildPrefsWidget */
const Gio = imports.gi.Gio;
const GLib = imports.gi.GLib;
const GObject = imports.gi.GObject;
const Gtk = imports.gi.Gtk;

const ExtensionUtils = imports.misc.extensionUtils;
const Me = ExtensionUtils.getCurrentExtension();

const Gettext = imports.gettext.domain(
    Me ? Me.metadata['gettext-domain'] : 'OrderIconsExtension');
const _ = Gettext.gettext;

function init() {
    ExtensionUtils.initTranslations();
}


const OrderIconsPreferences = GObject.registerClass(
    class OrderIconsPreferences extends Gtk.Box {
        _init() {
            super._init({
                orientation: Gtk.Orientation.VERTICAL,
                spacing: 30
            });

            this._settings = ExtensionUtils.getSettings('org.gnome.shell.extensions.order-icons');

            let button_up_left = null;
            let button_down_left = null;
            let button_up_center = null;
            let button_down_center = null;
            let button_up_right = null;
            let button_down_right = null;
            let button_del_left = null;
            let button_del_right = null;
            let button_del_center = null;
            // Boxes for list stores
            this.right_order_hbox = new Gtk.Box({
                orientation: Gtk.Orientation.HORIZONTAL,
                spacing: 8,
                margin_start: 30,
                margin_end: 30,
                margin_top: 30,
                margin_bottom: 30
            });
            this.center_order_hbox = new Gtk.Box({
                orientation: Gtk.Orientation.HORIZONTAL,
                spacing: 8,
                margin_start: 30,
                margin_end: 30,
                margin_top: 30,
                margin_bottom: 30
            });
            this.left_order_hbox = new Gtk.Box({
                orientation: Gtk.Orientation.HORIZONTAL,
                spacing: 8,
                margin_start: 30,
                margin_end: 30,
                margin_top: 30,
                margin_bottom: 30
            });

            // Button boxes
            this.left_button_vbox = new Gtk.Box({
                orientation: Gtk.Orientation.VERTICAL,
                spacing: 8,
                margin_start: 30,
                margin_end: 30,
                margin_top: 30,
                margin_bottom: 30
            });

            this.center_button_vbox = new Gtk.Box({
                orientation: Gtk.Orientation.VERTICAL,
                spacing: 8,
                margin_start: 30,
                margin_end: 30,
                margin_top: 30,
                margin_bottom: 30
            });

            this.right_button_vbox = new Gtk.Box({
                orientation: Gtk.Orientation.VERTICAL,
                spacing: 8,
                margin_start: 30,
                margin_end: 30,
                margin_top: 30,
                margin_bottom: 30
            });

            button_up_left = new Gtk.Button()
            button_up_left.set_icon_name("go-up-symbolic");
            button_down_left = new Gtk.Button()
            button_down_left.set_icon_name("go-down-symbolic");
            button_del_left = new Gtk.Button()
            button_del_left.set_icon_name("edit-delete-symbolic");
            if (imports.gi.versions.Gtk === '4.0') {
                this.left_button_vbox.append(button_up_left);
                this.left_button_vbox.append(button_down_left);
                this.left_button_vbox.append(button_del_left);
            } else {
                this.left_button_vbox.pack_start(button_up_left, true, true, 0);
                this.left_button_vbox.pack_start(button_down_left, false, false, 0);
                this.left_button_vbox.pack_start(button_del_left, false, false, 0);
            }

            button_up_center = new Gtk.Button()
            button_up_center.set_icon_name("go-up-symbolic");
            button_down_center = new Gtk.Button()
            button_down_center.set_icon_name("go-down-symbolic");
            button_del_center = new Gtk.Button()
            button_del_center.set_icon_name("edit-delete-symbolic");
            if (imports.gi.versions.Gtk === '4.0') {
                this.center_button_vbox.append(button_up_center);
                this.center_button_vbox.append(button_down_center);
                this.center_button_vbox.append(button_del_center);
            } else {
                this.center_button_vbox.pack_start(button_up_center, true, true, 0);
                this.center_button_vbox.pack_start(button_down_center, false, false, 0);
                this.center_button_vbox.pack_start(button_del_center, false, false, 0);
            }

            button_up_right = new Gtk.Button()
            button_up_right.set_icon_name("go-up-symbolic");
            button_down_right = new Gtk.Button()
            button_down_right.set_icon_name("go-down-symbolic");
            button_del_right = new Gtk.Button()
            button_del_right.set_icon_name("edit-delete-symbolic");
            if (imports.gi.versions.Gtk === '4.0') {
                this.right_button_vbox.append(button_up_right);
                this.right_button_vbox.append(button_down_right);
                this.right_button_vbox.append(button_del_right);
            } else {
                this.right_button_vbox.pack_start(button_up_right, true, true, 0);
                this.right_button_vbox.pack_start(button_down_right, false, false, 0);
                this.right_button_vbox.pack_start(button_del_right, false, false, 0);
            }


            const cell_renderer = new Gtk.CellRendererText({
                editable: false
            });

            // right box
            const order_right_store = new Gtk.ListStore();
            order_right_store.set_column_types([
                GObject.TYPE_STRING
            ]);
            const right_order_array = this._settings.get_value('order-icons-right').deep_unpack()
            right_order_array.forEach(value => {
                order_right_store.set(order_right_store.append(), [0], [value])
            });

            const right_order_tree_view = new Gtk.TreeView({
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
            const center_order_tree_view = new Gtk.TreeView({
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
            const left_order_tree_view = new Gtk.TreeView({
                model: order_left_store,
                hexpand: true,
                vexpand: true,
            });
            const left_order_column = new Gtk.TreeViewColumn({
                title: "Order Indicators",
                sizing: Gtk.TreeViewColumnSizing.AUTOSIZE,
            });


            left_order_column.pack_start(cell_renderer, true);
            left_order_column.add_attribute(cell_renderer, 'text', 0);
            left_order_tree_view.insert_column(left_order_column, 0);
            left_order_tree_view.set_grid_lines(Gtk.TreeViewGridLines.BOTH);

            center_order_column.pack_start(cell_renderer, true);
            center_order_column.add_attribute(cell_renderer, 'text', 0);
            center_order_tree_view.insert_column(center_order_column, 0);
            center_order_tree_view.set_grid_lines(Gtk.TreeViewGridLines.BOTH);

            right_order_column.pack_start(cell_renderer, true);
            right_order_column.add_attribute(cell_renderer, 'text', 0);
            right_order_tree_view.insert_column(right_order_column, 0);
            right_order_tree_view.set_grid_lines(Gtk.TreeViewGridLines.BOTH);


            button_up_left.connect("clicked", _ => this._onButtonUpClicked("panelLeft", left_order_tree_view));
            button_down_left.connect("clicked", _ => this._onButtonDownClicked("panelLeft", left_order_tree_view));
            button_del_left.connect("clicked", _ => this._onButtonDelClicked("panelLeft", left_order_tree_view));

            button_up_center.connect("clicked", _ => this._onButtonUpClicked("panelCenter", center_order_tree_view));
            button_down_center.connect("clicked", _ => this._onButtonDownClicked("panelCenter", center_order_tree_view));
            button_del_center.connect("clicked", _ => this._onButtonDelClicked("panelCenter", center_order_tree_view));

            button_up_right.connect("clicked", _ => this._onButtonUpClicked("panelRight", right_order_tree_view));
            button_down_right.connect("clicked", _ => this._onButtonDownClicked("panelRight", right_order_tree_view));
            button_del_right.connect("clicked", _ => this._onButtonDelClicked("panelRight", right_order_tree_view));


            if (imports.gi.versions.Gtk === '4.0') {
                this.left_order_hbox.append(left_order_tree_view);
                this.left_order_hbox.append(this.left_button_vbox);
                this.center_order_hbox.append(center_order_tree_view);
                this.center_order_hbox.append(this.center_button_vbox);
                this.right_order_hbox.append(right_order_tree_view);
                this.right_order_hbox.append(this.right_button_vbox);
            } else {
                this.left_order_hbox.pack_start(left_order_tree_view, false, false, 0);
                this.left_order_hbox.pack_start(this.left_button_vbox, false, false, 0);
                this.center_order_hbox.pack_start(center_order_tree_view, false, false, 0);
                this.center_order_hbox.pack_start(this.center_button_vbox, false, false, 0);
                this.right_order_hbox.pack_start(right_order_tree_view, false, false, 0);
                this.right_order_hbox.pack_start(this.right_button_vbox, false, false, 0);
            }


            this.notebook = new Gtk.Notebook();
            this.notebook.append_page(this.right_order_hbox,
                new Gtk.Label({
                    label: _('Right Panel')
                }));
            this.notebook.append_page(this.center_order_hbox,
                new Gtk.Label({
                    label: _('Center Panel')
                }));
            this.notebook.append_page(this.left_order_hbox,
                new Gtk.Label({
                    label: _('Left Panel')
                }));
            if (imports.gi.versions.Gtk === '4.0')
                this.append(this.notebook);
            else
                this.add(this.notebook);
        }


        _onButtonUpClicked(panel, treeView) {
            let selection = treeView.get_selection();
            let [isSelected, model, selected_row] = selection.get_selected();
            if (isSelected == false) return

            let [index2, listStore] = selection.get_selected_rows()
            let index = index2[0].get_indices()
            let index_above = parseInt(index) - 1
            let length_store = listStore.iter_n_children(null);
            if (index_above >= 0) {

                const returnIter = listStore.iter_nth_child(null, index_above);
                const [success_above, iter_above] = returnIter;
                if (!success_above)
                    return;
                listStore.move_before(selected_row, iter_above)

                let new_order_arr = []
                for (let i = 0; i < length_store; i++) {
                    const returnIter = listStore.iter_nth_child(null, i);
                    const [success, iterList] = returnIter;
                    if (!success)
                        break;
                    if (iterList) {
                        new_order_arr.push(listStore.get_value(iterList, 0));
                    } else {
                        break;
                    }
                }
                if (panel == "panelRight")
                    this._settings.set_value("order-icons-right", new GLib.Variant('as', new_order_arr))
                else if (panel == "panelCenter")
                    this._settings.set_value("order-icons-center", new GLib.Variant('as', new_order_arr))
                else if (panel == "panelLeft")
                    this._settings.set_value("order-icons-left", new GLib.Variant('as', new_order_arr))
            }

        }


        _onButtonDownClicked(panel, treeView) {
            let selection = treeView.get_selection();
            let [isSelected, model, selected_row] = selection.get_selected();
            if (isSelected == false) return

            let [index2, listStore] = selection.get_selected_rows()
            let index = index2[0].get_indices()
            let index_below = parseInt(index) + 1
            let length_store = listStore.iter_n_children(null);
            if (index_below < length_store) {

                const returnIter = listStore.iter_nth_child(null, index_below);
                const [success_above, iter_below] = returnIter;
                if (!success_above)
                    return;
                listStore.move_after(selected_row, iter_below)

                let new_order_arr = []
                for (let i = 0; i < length_store; i++) {
                    const returnIter = listStore.iter_nth_child(null, i);
                    const [success, iterList] = returnIter;
                    if (!success)
                        break;
                    if (iterList) {
                        new_order_arr.push(listStore.get_value(iterList, 0));
                    } else {
                        break;
                    }
                }
                if (panel == "panelRight")
                    this._settings.set_value("order-icons-right", new GLib.Variant('as', new_order_arr))
                else if (panel == "panelCenter")
                    this._settings.set_value("order-icons-center", new GLib.Variant('as', new_order_arr))
                else if (panel == "panelLeft")
                    this._settings.set_value("order-icons-left", new GLib.Variant('as', new_order_arr))
            }
        }

        _onButtonDelClicked(panel, treeview) {
            let selection = treeview.get_selection();
            let [isSelected, model, selected_row] = selection.get_selected();
            if (isSelected == false) return

            let [index2, listStore] = selection.get_selected_rows()
            let index = index2[0].get_indices()

            let length_store = listStore.iter_n_children(null);

            listStore.remove(selected_row)
            let new_order_arr = []
            for (let i = 0; i < length_store; i++) {
                const returnIter = listStore.iter_nth_child(null, i);
                const [success, iterList] = returnIter;
                if (!success)
                    break;
                if (iterList) {
                    new_order_arr.push(listStore.get_value(iterList, 0));
                } else {
                    break;
                }
            }
            if (panel == "panelRight")
                this._settings.set_value("order-icons-right", new GLib.Variant('as', new_order_arr))
            else if (panel == "panelCenter")
                this._settings.set_value("order-icons-center", new GLib.Variant('as', new_order_arr))
            else if (panel == "panelLeft")
                this._settings.set_value("order-icons-left", new GLib.Variant('as', new_order_arr))
        }
    });

function buildPrefsWidget() {
    let widget = new OrderIconsPreferences();
    return widget;
}
