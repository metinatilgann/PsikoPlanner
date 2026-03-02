"""
Generate PsikoPlanner app icons.
Clean Psi (Ψ) symbol with upward arms + calendar element.
"""

from PIL import Image, ImageDraw
import math
import os

ASSETS_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), "assets")

BG_COLOR = (26, 26, 46)
ACCENT = (100, 149, 237)
ACCENT_LIGHT = (140, 180, 255)
CIRCLE_BG = (36, 36, 62)


def draw_thick_arc(draw, center, radius, start_deg, end_deg, color, thickness):
    """Draw a thick arc using multiple thin arcs for smooth rendering."""
    cx, cy = center
    for t in range(-thickness//2, thickness//2 + 1):
        r = radius + t
        if r > 0:
            draw.arc([cx-r, cy-r, cx+r, cy+r], start_deg, end_deg, fill=color, width=2)


def draw_psi(draw, cx, cy, s, color, w):
    """
    Draw Psi (Ψ) - vertical stem with two arms curving UPWARD.
    PIL angles: 0=right, 90=bottom, 180=left, 270=top (clockwise, y-down).
    So arc 180->360 draws the UPPER semicircle (arms going up).
    """
    hw = w // 2

    # Vertical stem (full height)
    stem_top = cy - int(46 * s)
    stem_bot = cy + int(46 * s)
    draw.rectangle([cx - hw, stem_top, cx + hw, stem_bot], fill=color)

    # Arms: upper semicircle centered below the arm tips
    # This creates the ⌢ shape (arms going up and outward)
    arm_cy = cy + int(8 * s)  # center of arc, slightly below middle
    r_arm = int(30 * s)

    # Draw the upward-opening arc (180° to 360°)
    # 180° = left, 270° = top, 360° = right
    draw_thick_arc(draw, (cx, arm_cy), r_arm, 180, 360, color, w)


def draw_calendar(draw, cx, cy, s, color, w):
    """Draw a mini calendar icon."""
    bw = int(22 * s)
    bh = int(18 * s)
    top = cy - bh + int(4*s)
    bot = cy + bh
    r = int(4 * s)
    lw = max(w, 2)

    # Body
    draw.rounded_rectangle([cx-bw, top, cx+bw, bot], radius=r, outline=color, width=lw)

    # Header line
    bar_y = top + int(10*s)
    draw.line([(cx-bw, bar_y), (cx+bw, bar_y)], fill=color, width=lw)

    # Hooks
    for hx in [cx - int(12*s), cx + int(12*s)]:
        draw.rectangle([hx - lw//2, top - int(5*s), hx + lw//2, top + int(3*s)], fill=color)

    # Grid dots
    dot_r = max(int(2.5 * s), 2)
    for row in range(2):
        for col in range(3):
            dx = cx + int((-12 + col * 12) * s)
            dy = bar_y + int((7 + row * 9) * s)
            draw.ellipse([dx-dot_r, dy-dot_r, dx+dot_r, dy+dot_r], fill=color)


def create_icon(size=1024):
    """Main app icon with 2x rendering for anti-aliasing."""
    rs = size * 2  # render size
    img = Image.new("RGBA", (rs, rs), BG_COLOR + (255,))
    draw = ImageDraw.Draw(img)

    cx, cy = rs // 2, rs // 2 - int(rs * 0.02)
    s = rs * 0.50 / 100  # scale

    # Circle background
    cr = int(rs * 0.33)
    draw.ellipse([cx-cr, cy-cr, cx+cr, cy+cr], fill=CIRCLE_BG)
    draw.ellipse([cx-cr, cy-cr, cx+cr, cy+cr], outline=ACCENT+(40,), width=max(int(rs*0.003), 2))

    # Psi symbol
    draw_psi(draw, cx, cy - int(rs*0.01), s, ACCENT, int(rs * 0.03))

    # Calendar (bottom-right)
    cal_s = rs * 0.19 / 100
    draw_calendar(draw, cx + int(rs*0.17), cy + int(rs*0.18), cal_s, ACCENT_LIGHT, int(rs*0.013))

    return img.resize((size, size), Image.LANCZOS)


def create_adaptive(size=1024):
    """Android adaptive icon foreground."""
    rs = size * 2
    img = Image.new("RGBA", (rs, rs), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)

    cx, cy = rs // 2, rs // 2
    s = rs * 0.38 / 100

    cr = int(rs * 0.26)
    draw.ellipse([cx-cr, cy-cr, cx+cr, cy+cr], fill=CIRCLE_BG)
    draw.ellipse([cx-cr, cy-cr, cx+cr, cy+cr], outline=ACCENT+(40,), width=max(int(rs*0.003), 2))

    draw_psi(draw, cx, cy, s, ACCENT, int(rs * 0.025))

    cal_s = rs * 0.15 / 100
    draw_calendar(draw, cx + int(rs*0.13), cy + int(rs*0.14), cal_s, ACCENT_LIGHT, int(rs*0.01))

    return img.resize((size, size), Image.LANCZOS)


if __name__ == "__main__":
    os.makedirs(ASSETS_DIR, exist_ok=True)

    print("Generating icon.png...")
    create_icon(1024).save(os.path.join(ASSETS_DIR, "icon.png"), "PNG")

    print("Generating adaptive-icon.png...")
    create_adaptive(1024).save(os.path.join(ASSETS_DIR, "adaptive-icon.png"), "PNG")

    print("Generating splash-icon.png...")
    create_icon(1024).resize((200, 200), Image.LANCZOS).save(os.path.join(ASSETS_DIR, "splash-icon.png"), "PNG")

    print("Generating favicon.png...")
    create_icon(1024).resize((48, 48), Image.LANCZOS).save(os.path.join(ASSETS_DIR, "favicon.png"), "PNG")

    print("Done!")
