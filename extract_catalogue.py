import os
import re
import fitz

PDF_PATH = "NEW PRODUCTS CATALOG 01 March 2026.pdf"
TEXT_OUT = os.path.join("data", "catalogue_text_full.txt")
IMG_DIR = os.path.join("assets", "images", "products", "raw")
INDEX_OUT = os.path.join("data", "catalogue_image_index.csv")

os.makedirs(os.path.dirname(TEXT_OUT), exist_ok=True)
os.makedirs(IMG_DIR, exist_ok=True)

if not os.path.exists(PDF_PATH):
    raise SystemExit(f"Missing PDF: {PDF_PATH}")

with fitz.open(PDF_PATH) as doc:
    page_count = len(doc)
    text_chunks = []
    index_lines = ["page,image_idx,file,width,height,ext"]

    for pno, page in enumerate(doc, start=1):
        text = page.get_text("text")
        text_chunks.append(f"\n\n===== PAGE {pno} =====\n{text}")

        images = page.get_images(full=True)
        for i, img in enumerate(images, start=1):
            xref = img[0]
            pix = fitz.Pixmap(doc, xref)
            if pix.n - pix.alpha > 3:
                pix = fitz.Pixmap(fitz.csRGB, pix)
            ext = "png"
            name = f"page-{pno:03d}-img-{i:02d}.{ext}"
            out_path = os.path.join(IMG_DIR, name)
            pix.save(out_path)
            index_lines.append(f"{pno},{i},{name},{pix.width},{pix.height},{ext}")

    with open(TEXT_OUT, "w", encoding="utf-8") as f:
        f.write("".join(text_chunks))

    with open(INDEX_OUT, "w", encoding="utf-8") as f:
        f.write("\n".join(index_lines))

print(f"Pages: {page_count}")
print(f"Wrote text: {TEXT_OUT}")
print(f"Wrote image index: {INDEX_OUT}")
print(f"Extracted images to: {IMG_DIR}")
