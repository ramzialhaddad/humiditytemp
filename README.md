# Home Humidity & Temperature Monitor
Instead of buying some prebuilt subscription based spyware. Build your own network of temp & humidity sensors!

## What will you need?
1. Raspberry Pi (or similar)
2. ESP32 (or similar Arduino with WiFi capabilities)
3. DHT11/22
4. 2.4GHz WiFi connection
## Installation & Use
1. Install and run [pocketbase](https://pocketbase.io/docs/)
2. Inside the Pocketbase dashboard:
	- Go to settings
	- Import collections
	- Import the `pb_schema.json` file in `ESP32 Code & Pocketbase Config` repository folder
3. Place the `registerDevice.pb.js` file inside a new folder called `pb_hooks` next to the other auto-generated pocketbase folders (`pb_migrations`, `pb_data`)
4. Ensure your Raspberry Pi (or other device) has a hostname (preferably `raspberrypi.local`)
	- If your device doesn't/can't have a hostname you will be required to replace all instances of `raspberrypi.local` in all source code.
5. Make sure `nginx` is installed on your Pi and insert the contents of the text file `nginxForwardProxy.txt` in `/etc/nginx/sites-enabled/default`
6. Upload the `esp32TempHumidPocketBase.ino` code onto an ESP32/Arduino, make sure to replace the WiFi name and password (and `serverName` variable with your URL path if you didn't use `raspberrypi.local` for your device's hostname)
7. Plug in the DHT11/22 into the ESP32/Arduino
8. In the pocketbase dashboard, if everything worked correctly, there should be a new record in the `devices` collection. Change the name of the new device to something meaningful.
9. Repeat steps 5-7 for each ESP32/Arduino you want to deploy.
10. Install [node](https://nodejs.org/en) or [nvm](https://github.com/nvm-sh/nvm) and run `npm install` on your Raspberry Pi
11. Run `npm run dev` (Yes I know, it'll eventually will be fixed)
12. Test if everything's working, head to `https://raspberrypi.local` and check if you see something!

## Quirks:
1. Windows being windows, you may not be able to use `http://raspberrypi.local` in your browser. Either add it as a manual entry to your DNS or look up how to get mDNS working in Windows.
2. HTTPS-Only browsers will get angry when trying to access the Pi, add the URL to your exceptions list
3. This project is quite duct-taped together, I hope to come back to this at a later time and revise it.
