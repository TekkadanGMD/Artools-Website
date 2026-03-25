import os
from PIL import Image

def convert_to_webp(directory):
    if not os.path.exists(directory):
        print(f"Directory {directory} does not exist.")
        return
    for filename in os.listdir(directory):
        if filename.lower().endswith((".jpg", ".jpeg", ".png")):
            filepath = os.path.join(directory, filename)
            try:
                img = Image.open(filepath)
                # Ensure the same filename but with .webp extension
                name_without_ext = os.path.splitext(filename)[0]
                webp_path = os.path.join(directory, name_without_ext + ".webp")
                
                # If it has an alpha channel (for PNGs), keep it
                if img.mode in ("RGBA", "P"):
                    img = img.convert("RGBA")
                
                img.save(webp_path, "WEBP", quality=80)
                print(f"Converted {filename} to WebP")
                # Optional: delete the original if you want to save space
                # os.remove(filepath)
            except Exception as e:
                print(f"Failed to convert {filename}: {e}")

# Base path
base = r"g:\Meu Drive\Marketing Digital\Tekkadan Gestão de Mídias Digitais\Vibe Design\Construindo site estáticos com IA"

print("Starting conversion...")
convert_to_webp(os.path.join(base, "assets", "video_frames"))
convert_to_webp(os.path.join(base, "assets", "raw_files"))
convert_to_webp(os.path.join(base, "assets"))
print("Conversion finished.")
