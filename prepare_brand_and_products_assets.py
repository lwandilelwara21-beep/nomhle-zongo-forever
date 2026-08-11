import os
import shutil
from PIL import Image

ROOT = os.path.abspath('.')
logo_src = os.path.join(ROOT, 'download.jpg')
logo_out = os.path.join(ROOT, 'assets', 'images', 'forever-logo.jpg')
raw = os.path.join(ROOT, 'assets', 'images', 'products', 'raw')
prod = os.path.join(ROOT, 'assets', 'images', 'products')

os.makedirs(os.path.dirname(logo_out), exist_ok=True)
os.makedirs(prod, exist_ok=True)

# Crop near-white empty logo margins without touching mark content.
img = Image.open(logo_src).convert('RGB')
pix = img.load()
width, height = img.size

# Detect non-white-ish pixels.
def is_bg(rgb):
    r, g, b = rgb
    return r > 245 and g > 245 and b > 245

min_x, min_y = width, height
max_x, max_y = 0, 0
for y in range(height):
    for x in range(width):
        if not is_bg(pix[x, y]):
            if x < min_x:
                min_x = x
            if y < min_y:
                min_y = y
            if x > max_x:
                max_x = x
            if y > max_y:
                max_y = y

if max_x > min_x and max_y > min_y:
    pad = 10
    left = max(0, min_x - pad)
    top = max(0, min_y - pad)
    right = min(width, max_x + pad + 1)
    bottom = min(height, max_y + pad + 1)
    cropped = img.crop((left, top, right, bottom))
else:
    cropped = img

cropped.save(logo_out, quality=95)

mapping = {
    'bee-propolis.png': 'page-007-img-02.png',
    'bee-pollen.png': 'page-008-img-02.png',
    'royal-jelly.png': 'page-009-img-02.png',
    'nature-min.png': 'page-010-img-03.png',
    'absorbent-c.png': 'page-011-img-04.png',
    'forever-calcium.png': 'page-015-img-01.png',
    'forever-arctic-sea-omega-3.png': 'page-026-img-02.png',
    'forever-daily.png': 'page-027-img-03.png',
    'forever-move.png': 'page-029-img-03.png',
    'active-pro-biotic.png': 'page-030-img-04.png',
    'garcinia-plus.png': 'page-032-img-05.png',
    'forever-lean.png': 'page-033-img-03.png',
    'forever-therm.png': 'page-034-img-01.png',
    'forever-fibre.png': 'page-035-img-03.png',
    'forever-lite.png': 'page-036-img-03.png',
    'forever-fast-break.png': 'page-037-img-03.png',
    'aloe-propolis-creme.png': 'page-039-img-02.png',
    'aloe-vera-gelly.png': 'page-040-img-02.png',
    'forever-aloe-heat-lotion.png': 'page-042-img-03.png',
    'forever-marine-collagen.png': 'page-054-img-03.png',
    'logic-skin-care-system.png': 'page-060-img-02.png',
    'logic-aloe-gel-cleanser.png': 'page-061-img-02.png',
    'logic-balancing-aloe-essence.png': 'page-062-img-02.png',
    'logic-soothing-gel-moisturizer.png': 'page-063-img-02.png',
    'forever-bright-toothgel.png': 'page-065-img-05.png',
    'aloe-ever-shield.png': 'page-066-img-02.png',
    'aloe-avocado-soap.png': 'page-067-img-03.png',
    'aloe-jojoba-shampoo-conditioner.png': 'page-072-img-02.png',
    'aloe-liquid-soap.png': 'page-073-img-01.png',
    'aloe-body-wash.png': 'page-074-img-02.png',
    'aloe-body-lotion.png': 'page-075-img-02.png',
    'c9-pack.png': 'page-080-img-01.png',
    'forever-aloe-vera-gel.png': 'page-001-img-03.png',
    'aloe-berry-nectar.png': 'page-002-img-01.png',
    'forever-aloe-peaches.png': 'page-003-img-02.png'
}

copied = 0
for out_name, src_name in mapping.items():
    src = os.path.join(raw, src_name)
    dst = os.path.join(prod, out_name)
    if os.path.exists(src):
        shutil.copyfile(src, dst)
        copied += 1

print('Logo written:', os.path.relpath(logo_out, ROOT))
print('Product images copied:', copied)
