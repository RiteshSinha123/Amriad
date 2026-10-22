AMRIAD WEBSITE - SETUP GUIDE

FILES
- index.html: Home page
- products.html: Product page
- style.css: Website styling, prices display, and flip-card animation
- script.js: Product data, cart, search/filter, and WhatsApp order flow
- images/: Add your logo and product images here

PRICES
Car Perfume: original ₹499, discounted ₹299
Room Spray: original ₹999, discounted ₹599
These values are configured near the top of script.js.

WHATSAPP
Open script.js and replace:
const WHATSAPP_NUMBER = "91XXXXXXXXXX";
with your WhatsApp number including country code, digits only. Example format: 919876543210.

HOW TO ADD A LOGO
1. Put your logo image in the images folder.
2. Name it exactly: amriad-logo.png
3. Recommended: transparent PNG, ideally around 500-1000 pixels wide.
4. The header and footer will use it. If the file is missing, the text logo appears instead.

HOW TO ADD PRODUCT IMAGES
Put each image in the images folder with the exact filenames listed below:
Pacific:        pacific-car.jpg, pacific-room.jpg
Rubaab:         rubaab-car.jpg, rubaab-room.jpg
Mehfil:          mehfil-car.jpg, mehfil-room.jpg
Fitoor:          fitoor-car.jpg, fitoor-room.jpg
Clubman:         clubman-car.jpg, clubman-room.jpg
White Orchid:    white-orchid-car.jpg, white-orchid-room.jpg
Citrus Splash:   citrus-splash-car.jpg, citrus-splash-room.jpg

The "-car" image is shown on the Car Perfume card.
The "-room" image is shown on the Room Spray card.
Use JPG/JPEG images and rename them exactly as above. If you use PNG instead,
edit the corresponding image extension in script.js.
The homepage hero currently uses images/pacific-room.jpg. You can change that
path in index.html to another image filename.

RUN LOCALLY
1. Extract the ZIP.
2. Open the extracted folder in Visual Studio Code.
3. Add your image files to the images folder.
4. Install the Live Server extension in VS Code if needed.
5. Right-click index.html and choose "Open with Live Server".
6. Use the "Our Products" navigation link to open the product page.
7. Click a product card to flip it and see the description and price.

NOTE
This is a front-end demo. WhatsApp checkout drafts a message; it does not
process payments or automatically manage stock, shipping, or order confirmation.
