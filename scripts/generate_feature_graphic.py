"""
Generate Google Play Store feature graphic (1024x500).
Professional banner for PsikoPlanner.
"""

from PIL import Image, ImageDraw, ImageFont
import math
import os

ASSETS_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), "store")

# Colors
BG_DARK = (26, 26, 46)
BG_MID = (36, 36, 62)
ACCENT = (100, 149, 237)
ACCENT_LIGHT = (140, 180, 255)
ACCENT_GLOW = (100, 149, 237, 30)
WHITE = (255, 255, 255)
WHITE_80 = (255, 255, 255, 200)
WHITE_50 = (255, 255, 255, 128)
WHITE_20 = (255, 255, 255, 50)


def draw_thick_arc(draw, center, radius, start_deg, end_deg, color, thickness):
    cx, cy = center
    for t in range(-thickness//2, thickness//2 + 1):
        r = radius + t
        if r > 0:
            draw.arc([cx-r, cy-r, cx+r, cy+r], start_deg, end_deg, fill=color, width=2)


def draw_psi(draw, cx, cy, scale, color, width):
    """Draw Psi symbol."""
    s = scale
    hw = width // 2
    draw.rectangle([cx - hw, cy - int(46*s), cx + hw, cy + int(46*s)], fill=color)
    arm_cy = cy + int(8 * s)
    r_arm = int(30 * s)
    draw_thick_arc(draw, (cx, arm_cy), r_arm, 180, 360, color, width)


def draw_calendar_icon(draw, cx, cy, s, color, w):
    """Draw calendar icon."""
    bw = int(22 * s)
    bh = int(18 * s)
    top = cy - bh + int(4*s)
    bot = cy + bh
    r = int(4 * s)
    lw = max(w, 2)
    draw.rounded_rectangle([cx-bw, top, cx+bw, bot], radius=r, outline=color, width=lw)
    bar_y = top + int(10*s)
    draw.line([(cx-bw, bar_y), (cx+bw, bar_y)], fill=color, width=lw)
    for hx in [cx - int(12*s), cx + int(12*s)]:
        draw.rectangle([hx - lw//2, top - int(5*s), hx + lw//2, top + int(3*s)], fill=color)
    dot_r = max(int(2.5 * s), 2)
    for row in range(2):
        for col in range(3):
            dx = cx + int((-12 + col * 12) * s)
            dy = bar_y + int((7 + row * 9) * s)
            draw.ellipse([dx-dot_r, dy-dot_r, dx+dot_r, dy+dot_r], fill=color)


def draw_person_icon(draw, cx, cy, s, color, w):
    """Draw a simple person/client icon."""
    lw = max(w, 2)
    # Head
    hr = int(8 * s)
    draw.ellipse([cx-hr, cy-int(20*s)-hr, cx+hr, cy-int(20*s)+hr], outline=color, width=lw)
    # Body
    draw.arc([cx-int(14*s), cy-int(6*s), cx+int(14*s), cy+int(18*s)], 180, 360, fill=color, width=lw)


def draw_clipboard_icon(draw, cx, cy, s, color, w):
    """Draw a clipboard/notes icon."""
    lw = max(w, 2)
    bw = int(18*s)
    bh = int(24*s)
    top = cy - bh
    bot = cy + bh
    r = int(3*s)
    draw.rounded_rectangle([cx-bw, top, cx+bw, bot], radius=r, outline=color, width=lw)
    # Clip
    cw = int(10*s)
    draw.rounded_rectangle([cx-cw, top-int(4*s), cx+cw, top+int(6*s)], radius=int(2*s), outline=color, width=lw)
    # Lines
    for i in range(3):
        ly = top + int(16*s) + i * int(12*s)
        draw.line([(cx-int(10*s), ly), (cx+int(10*s), ly)], fill=color, width=max(lw-1, 1))


def draw_shield_icon(draw, cx, cy, s, color, w):
    """Draw a shield/security icon."""
    lw = max(w, 2)
    # Shield shape using polygon
    sw = int(16*s)
    sh = int(24*s)
    points = [
        (cx, cy - sh),           # top
        (cx + sw, cy - sh + int(8*s)),  # top-right
        (cx + sw, cy + int(4*s)),       # mid-right
        (cx, cy + sh),                  # bottom
        (cx - sw, cy + int(4*s)),       # mid-left
        (cx - sw, cy - sh + int(8*s)),  # top-left
    ]
    draw.polygon(points, outline=color, width=lw)
    # Checkmark
    draw.line([
        (cx - int(6*s), cy),
        (cx - int(1*s), cy + int(6*s)),
        (cx + int(8*s), cy - int(6*s))
    ], fill=color, width=lw, joint="curve")


def create_feature_graphic():
    """Create 1024x500 feature graphic."""
    W, H = 1024, 500
    rs = 2  # render scale
    rw, rh = W * rs, H * rs

    img = Image.new("RGBA", (rw, rh), BG_DARK + (255,))
    draw = ImageDraw.Draw(img)

    # Gradient background - subtle diagonal
    for y in range(rh):
        t = y / rh
        r = int(BG_DARK[0] + (BG_MID[0] - BG_DARK[0]) * t * 0.5)
        g = int(BG_DARK[1] + (BG_MID[1] - BG_DARK[1]) * t * 0.5)
        b = int(BG_DARK[2] + (BG_MID[2] - BG_DARK[2]) * t * 0.5)
        draw.line([(0, y), (rw, y)], fill=(r, g, b))

    # Decorative circles (background pattern)
    for cx, cy, r in [(int(rw*0.08), int(rh*0.3), 120), (int(rw*0.92), int(rh*0.7), 80),
                       (int(rw*0.5), int(rh*0.1), 60), (int(rw*0.75), int(rh*0.15), 40)]:
        for i in range(r, 0, -1):
            alpha = max(0, int(8 * (i / r)))
            draw.ellipse([cx-i, cy-i, cx+i, cy+i], outline=(*ACCENT[:3], alpha))

    # === LEFT SIDE: Psi + Circle ===
    psi_cx = int(rw * 0.22)
    psi_cy = int(rh * 0.48)

    # Glow behind circle
    glow_r = int(rh * 0.38)
    for i in range(40):
        r = glow_r + i * 3
        alpha = max(0, 12 - i // 3)
        draw.ellipse([psi_cx-r, psi_cy-r, psi_cx+r, psi_cy+r], outline=(*ACCENT[:3], alpha))

    # Circle bg
    cr = int(rh * 0.34)
    draw.ellipse([psi_cx-cr, psi_cy-cr, psi_cx+cr, psi_cy+cr], fill=BG_MID)
    draw.ellipse([psi_cx-cr, psi_cy-cr, psi_cx+cr, psi_cy+cr], outline=(*ACCENT[:3], 50), width=3)

    # Psi symbol
    psi_s = rh * 0.55 / 100
    psi_w = int(rh * 0.04)
    draw_psi(draw, psi_cx, psi_cy, psi_s, ACCENT, psi_w)

    # Calendar element
    cal_s = rh * 0.22 / 100
    draw_calendar_icon(draw, psi_cx + int(rh*0.2), psi_cy + int(rh*0.2), cal_s, ACCENT_LIGHT, int(rh*0.015))

    # === RIGHT SIDE: Text ===
    # App name - large
    try:
        font_large = ImageFont.truetype("arial.ttf", int(rh * 0.14))
        font_sub = ImageFont.truetype("arial.ttf", int(rh * 0.05))
        font_features = ImageFont.truetype("arial.ttf", int(rh * 0.038))
    except:
        try:
            font_large = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", int(rh * 0.14))
            font_sub = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", int(rh * 0.05))
            font_features = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", int(rh * 0.038))
        except:
            font_large = ImageFont.load_default()
            font_sub = ImageFont.load_default()
            font_features = ImageFont.load_default()

    text_x = int(rw * 0.43)
    text_y = int(rh * 0.18)

    # "PsikoPlanner"
    draw.text((text_x, text_y), "PsikoPlanner", fill=WHITE, font=font_large)

    # Subtitle
    sub_y = text_y + int(rh * 0.17)
    draw.text((text_x, sub_y), "Profesyonel Terapist Ajandasi", fill=WHITE_80, font=font_sub)

    # Divider line
    div_y = sub_y + int(rh * 0.1)
    draw.line([(text_x, div_y), (text_x + int(rw * 0.45), div_y)], fill=(*ACCENT[:3], 80), width=2)

    # Feature icons + text
    features_y = div_y + int(rh * 0.06)
    feature_items = [
        ("Danisan Yonetimi", draw_person_icon),
        ("Seans Takibi", draw_clipboard_icon),
        ("Guvenli & Yerel", draw_shield_icon),
    ]

    icon_spacing = int(rw * 0.17)
    for i, (label, icon_func) in enumerate(feature_items):
        fx = text_x + int(rw * 0.04) + i * icon_spacing
        fy = features_y + int(rh * 0.06)

        # Icon
        icon_s = rh * 0.04 / 100 * 2.5
        icon_w = int(rh * 0.018)
        icon_func(draw, fx, fy, icon_s, ACCENT_LIGHT, icon_w)

        # Label
        label_y = fy + int(rh * 0.1)
        bbox = draw.textbbox((0, 0), label, font=font_features)
        tw = bbox[2] - bbox[0]
        draw.text((fx - tw // 2, label_y), label, fill=WHITE_50, font=font_features)

    # Downscale
    img = img.resize((W, H), Image.LANCZOS)
    return img


if __name__ == "__main__":
    os.makedirs(ASSETS_DIR, exist_ok=True)

    print("Generating feature graphic (1024x500)...")
    fg = create_feature_graphic()
    fg.save(os.path.join(ASSETS_DIR, "feature-graphic.png"), "PNG")
    print("Done! Saved to store/feature-graphic.png")
