// -*- mode: js2; indent-tabs-mode: nil; js2-basic-offset: 4 -*-

/* exported init, buildPrefsWidget */

import GObject from 'gi://GObject';
import GLib from 'gi://GLib';
import Gtk from 'gi://Gtk';

import { ExtensionPreferences, gettext as _ } from 'resource:///org/gnome/Shell/Extensions/js/extensions/prefs.js';


export default class OrderIconsPreferences extends ExtensionPreferences {
    getPreferencesWidget() {
        return new OrderIconsPreferencesBox(this);
    }
}

const OrderIconsPreferencesBox = GObject.registerClass(
    class OrderIconsPreferencesBox extends Gtk.Box {
        _init(extension) {
            super._init({
                orientation: Gtk.Orientation.VERTICAL,
                spacing: 30
            });
            this._settings = extension.getSettings();

            // Boxes for list stores
            this.right_order_hbox = new Gtk.Box({
                orientation: Gtk.Orientation.HORIZONTAL,
                spacing: 8,
                margin_start: 30,
                margin_end: 0,
                margin_top: 30,
                margin_bottom: 30
            });
            this.center_order_hbox = new Gtk.Box({
                orientation: Gtk.Orientation.HORIZONTAL,
                spacing: 8,
                margin_start: 30,
                margin_end: 0,
                margin_top: 30,
                margin_bottom: 30
            });
            this.left_order_hbox = new Gtk.Box({
                orientation: Gtk.Orientation.HORIZONTAL,
                spacing: 8,
                margin_start: 30,
                margin_end: 0,
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

            const button_up_left = new Gtk.Button()
            button_up_left.set_icon_name("go-up-symbolic");
            const button_down_left = new Gtk.Button()
            button_down_left.set_icon_name("go-down-symbolic");
            const button_del_left = new Gtk.Button()
            button_del_left.set_icon_name("edit-delete-symbolic");
            const button_blacklist_left = new Gtk.Button();
            button_blacklist_left.set_icon_name('action-unavailable-symbolic');

            button_up_left.set_tooltip_text( _('Moves selected entry up'));
            button_down_left.set_tooltip_text( _('Moves selected entry down'));
            button_del_left.set_tooltip_text( _('Removes entry from this list'));
            button_blacklist_left.set_tooltip_text( _('Removes/reenables icon from top panel (restart of extension required)'));

            this.left_button_vbox.append(button_up_left);
            this.left_button_vbox.append(button_down_left);
            this.left_button_vbox.append(button_del_left);
            this.left_button_vbox.append(button_blacklist_left);


            const button_up_center = new Gtk.Button()
            button_up_center.set_icon_name("go-up-symbolic");
            const button_down_center = new Gtk.Button()
            button_down_center.set_icon_name("go-down-symbolic");
            const button_del_center = new Gtk.Button()
            button_del_center.set_icon_name("edit-delete-symbolic");
            const button_blacklist_center = new Gtk.Button();
            button_blacklist_center.set_icon_name('action-unavailable-symbolic');

            button_up_center.set_tooltip_text( _('Moves selected entry up'));
            button_down_center.set_tooltip_text( _('Moves selected entry down'));
            button_del_center.set_tooltip_text( _('Removes entry from this list'));
            button_blacklist_center.set_tooltip_text( _('Removes/reenables icon from top panel (restart of extension required)'));

            this.center_button_vbox.append(button_up_center);
            this.center_button_vbox.append(button_down_center);
            this.center_button_vbox.append(button_del_center);
            this.center_button_vbox.append(button_blacklist_center);


            const button_up_right = new Gtk.Button()
            button_up_right.set_icon_name("go-up-symbolic");
            const button_down_right = new Gtk.Button()
            button_down_right.set_icon_name("go-down-symbolic");
            const button_del_right = new Gtk.Button()
            button_del_right.set_icon_name("edit-delete-symbolic");
            const button_blacklist_right = new Gtk.Button();
            button_blacklist_right.set_icon_name('action-unavailable-symbolic');

            button_up_right.set_tooltip_text( _('Moves selected entry up'));
            button_down_right.set_tooltip_text( _('Moves selected entry down'));
            button_del_right.set_tooltip_text( _('Removes entry from this list'));
            button_blacklist_right.set_tooltip_text( _('Removes/reenables icon from top panel (restart of extension required)'));

            this.right_button_vbox.append(button_up_right);
            this.right_button_vbox.append(button_down_right);
            this.right_button_vbox.append(button_del_right);
            this.right_button_vbox.append(button_blacklist_right);


            const cell_renderer = new Gtk.CellRendererText({
                editable: false
            });

            this.blacklist_array = this._settings.get_value('icons-blacklist').deep_unpack();

            // right box
            this.order_right_store = new Gtk.ListStore();
            this.order_right_store.set_column_types([
                GObject.TYPE_STRING, GObject.TYPE_BOOLEAN
            ]);
            const right_order_array = this._settings.get_value('order-icons-right').deep_unpack()
            right_order_array.forEach(value => {
                let is_blacklisted = this.blacklist_array.includes(value)
                this.order_right_store.set(this.order_right_store.append(), [0, 1], [value, is_blacklisted])
            });

            const right_order_tree_view = new Gtk.TreeView({
                model: this.order_right_store,
                hexpand: true,
                vexpand: true
            });
            right_order_tree_view.set_reorderable(true);
            this.order_right_store.connect("row-deleted", () => { this._orderChanged('panelRight', this.order_right_store) });
            const right_order_column = new Gtk.TreeViewColumn({
                title: "Order Indicators",
            });
            const right_order_window = new Gtk.ScrolledWindow()
            right_order_window.set_child(right_order_tree_view)

            // center box
            this.order_center_store = new Gtk.ListStore();
            this.order_center_store.set_column_types([
                GObject.TYPE_STRING, GObject.TYPE_BOOLEAN
            ]);
            const center_order_array = this._settings.get_value('order-icons-center').deep_unpack()
            center_order_array.forEach(value => {
                let is_blacklisted = this.blacklist_array.includes(value)
                this.order_center_store.set(this.order_center_store.append(), [0, 1], [value, is_blacklisted])
            });
            const center_order_tree_view = new Gtk.TreeView({
                model: this.order_center_store,
                hexpand: true,
                vexpand: true
            });
            center_order_tree_view.set_reorderable(true);
            this.order_center_store.connect("row-deleted", () => { this._orderChanged('panelCenter', this.order_center_store) });
            const center_order_column = new Gtk.TreeViewColumn({
                title: "Order Indicators",
            });
            const center_order_window = new Gtk.ScrolledWindow()
            center_order_window.set_child(center_order_tree_view)


            // left box
            this.order_left_store = new Gtk.ListStore();
            this.order_left_store.set_column_types([
                GObject.TYPE_STRING, GObject.TYPE_BOOLEAN
            ]);
            const left_order_array = this._settings.get_value('order-icons-left').deep_unpack()
            left_order_array.forEach(value => {
                let is_blacklisted = this.blacklist_array.includes(value)
                this.order_left_store.set(this.order_left_store.append(), [0, 1], [value,  is_blacklisted])
            });
            const left_order_tree_view = new Gtk.TreeView({
                model: this.order_left_store,
                hexpand: true,
                vexpand: true
            });
            left_order_tree_view.set_reorderable(true);
            this.order_left_store.connect("row-deleted", () => { this._orderChanged('panelLeft', this.order_left_store) });
            const left_order_column = new Gtk.TreeViewColumn({
                title: "Order Indicators",
            });
            
            const left_order_window = new Gtk.ScrolledWindow()
            left_order_window.set_child(left_order_tree_view)

            left_order_column.pack_start(cell_renderer, true);
            left_order_column.add_attribute(cell_renderer, 'text', 0);
            left_order_column.add_attribute(cell_renderer, 'strikethrough', 1);
            left_order_tree_view.insert_column(left_order_column, 0);
            left_order_tree_view.set_grid_lines(Gtk.TreeViewGridLines.BOTH);

            center_order_column.pack_start(cell_renderer, true);
            center_order_column.add_attribute(cell_renderer, 'text', 0);
            center_order_column.add_attribute(cell_renderer, 'strikethrough', 1);
            center_order_tree_view.insert_column(center_order_column, 0);
            center_order_tree_view.set_grid_lines(Gtk.TreeViewGridLines.BOTH);

            right_order_column.pack_start(cell_renderer, true);
            right_order_column.add_attribute(cell_renderer, 'text', 0);
            right_order_column.add_attribute(cell_renderer, 'strikethrough', 1);
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

            button_blacklist_center.connect('clicked', _ => this._onButtonBlacklistClicked(center_order_tree_view, this.order_center_store));
            button_blacklist_left.connect('clicked', _ => this._onButtonBlacklistClicked(left_order_tree_view, this.order_left_store));
            button_blacklist_right.connect('clicked', _ => this._onButtonBlacklistClicked(right_order_tree_view, this.order_right_store));

            this.left_order_hbox.append(left_order_window);
            this.left_order_hbox.append(this.left_button_vbox);
            this.center_order_hbox.append(center_order_window);
            this.center_order_hbox.append(this.center_button_vbox);
            this.right_order_hbox.append(right_order_window);
            this.right_order_hbox.append(this.right_button_vbox);



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
            this.append(this.notebook);
        }


        _onButtonUpClicked(panel, treeView) {
            let selection = treeView.get_selection();
            let [isSelected, model, selected_row] = selection.get_selected();
            if (isSelected == false) return

            let [index2, listStore] = selection.get_selected_rows()
            let index = index2[0].get_indices()
            let index_above = parseInt(index) - 1
            if (index_above >= 0) {

                const returnIter = listStore.iter_nth_child(null, index_above);
                const [success_above, iter_above] = returnIter;
                if (!success_above)
                    return;
                listStore.move_before(selected_row, iter_above)
                this._orderChanged(panel, listStore)
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
                this._orderChanged(panel, listStore)
            }
        }

        _orderChanged(panel, listStore) {
            let length_store = listStore.iter_n_children(null);
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

        _onButtonBlacklistClicked(treeView, listStoreToSet) {
            let selection = treeView.get_selection();
            let [isSelected, model, selected_row] = selection.get_selected();
            if (isSelected == false) return

            let [indexSelected, listStore] = selection.get_selected_rows()
            let index = indexSelected[0].get_indices()
            const selectedElement = listStore.iter_nth_child(null, index);
            const [success, iterList] = selectedElement;
            if (!success){
                return;
            }
            const selectedValue = listStore.get_value(iterList, 0);
            const inBlacklistArray = this.blacklist_array.indexOf(selectedValue);
            if (inBlacklistArray > -1){
                this.blacklist_array.splice(inBlacklistArray, 1);
                listStoreToSet.set(iterList, [1], [false])
            }
            else {
                this.blacklist_array.push(selectedValue)
                listStoreToSet.set(iterList, [1], [true])
            }
            this._settings.set_value("icons-blacklist", new GLib.Variant('as', this.blacklist_array))
        }

    });