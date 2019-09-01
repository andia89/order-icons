# order-icons
Gnome Shell extension for ordering icons in the top bar like for Ubuntu unity


## How to

you need to add a file in `~/.local/share/indicators/applications/ordering-override.keyfile` (you can also use `/usr/share/indicators/applications/ordering-override.keyfile` for systemwide installation where you define the order of your icons using their name. The name of the icons you can find in the corresponding `extension.js` file of the corresponding extension ("Caffeine" for the caffeine extensions for example).

If you also want to change the order of the icons made by the Ubuntu top-bar extension you need to find out the name of the icon it registers: `:1.274/org/ayatana/NotificationItem/variety` will become `variety`. You can do that by running `gnome-shell --replace` in the terminal and look at the output, which will tell you the name.

## Disclaimer

I made that extension for myself because I was annoyed by the fact that it was always changing the order when I was locking unlocking. It might very well be the case that this extension breaks your computer and only works on my setup. So use at your own risk and/or write a bug report and I will try to fix it. 

I am not a Javascript developer so improvements on how to do it are very much welcome!
