# order-icons
Gnome Shell extension for ordering icons in the top bar like for Ubuntu unity

## Install
Either install it via github or enable via extensions.gnome.org

https://extensions.gnome.org/extension/2114/order-gnome-shell-extensions/

## How to

you need to add a file in `~/.local/share/indicators/applications/ordering-override.keyfile` (you can also use `/usr/share/indicators/applications/ordering-override.keyfile` for systemwide installation where you define the order of your icons using their name. 

The name of the icons you can find by running `journalctl /usr/bin/gnome-shell -f -n 40` in a terminal and afterwards you enable the extension. You should see something like
```
Nov 05 11:48:45 user gnome-shell[18321]: Order application icons: activities
Nov 05 11:48:45 user gnome-shell[18321]: Order application icons: appMenu
Nov 05 11:48:45 user gnome-shell[18321]: Order application icons: dateMenu
Nov 05 11:48:45 user gnome-shell[18321]: Order application icons: dwellClick
Nov 05 11:48:45 user gnome-shell[18321]: Order application icons: a11y
Nov 05 11:48:45 user gnome-shell[18321]: Order application icons: keyboard
Nov 05 11:48:45 user gnome-shell[18321]: Order application icons: aggregateMenu
Nov 05 11:48:45 user gnome-shell[18321]: Order application icons: system-monitor
Nov 05 11:48:45 user gnome-shell[18321]: Order application icons: Caffeine
Nov 05 11:48:45 user gnome-shell[18321]: Order application icons: diodonGnomeIndicator
Nov 05 11:48:45 user gnome-shell[18321]: Order application icons: Insync
Nov 05 11:48:45 user gnome-shell[18321]: Order application icons: ownCloud
Nov 05 11:48:45 user gnome-shell[18321]: Order application icons: unity-mail
Nov 05 11:48:45 user gnome-shell[18321]: Order application icons: remmina-icon
Nov 05 11:48:45 user gnome-shell[18321]: Order application icons: Franz1
Nov 05 11:48:45 user gnome-shell[18321]: Order application icons: dropbox
Nov 05 11:48:45 user gnome-shell[18321]: Order application icons: TeamViewer
```
depending on the apps you are using. The names shown here are the ones you should put in the file. The file should then look something like

```
[left box]
activites=1
appMenu=2

[middle box]
dateMenu=1

[right box]
a11y=1
system-monitor=2
.
.
.
```


## Disclaimer

I made that extension for myself because I was annoyed by the fact that it was always changing the order when I was locking unlocking. It might very well be the case that this extension breaks your computer and only works on my setup. So use at your own risk and/or write a bug report and I will try to fix it. 

I am not a Javascript developer so improvements on how to do it are very much welcome!
