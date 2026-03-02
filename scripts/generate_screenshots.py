"""
Generate 7-inch tablet screenshots for Google Play Store.
Required size: 1024x1600 (portrait) for 7-inch tablet.
Creates mock screens: Login, Dashboard, Client List, Session Detail, Calendar.
"""

from PIL import Image, ImageDraw, ImageFont
import math
import os

STORE_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), "store", "screenshots", "tablet-7")

# Colors
BG = (26, 26, 46)
SURFACE = (36, 36, 62)
CARD = (46, 46, 78)
ACCENT = (100, 149, 237)
ACCENT_LIGHT = (140, 180, 255)
WHITE = (255, 255, 255)
WHITE_90 = (240, 240, 240)
WHITE_70 = (180, 180, 180)
WHITE_50 = (128, 128, 128)
GREEN = (76, 175, 80)
ORANGE = (255, 152, 0)
RED = (244, 67, 54)
TAB_BG = (20, 20, 38)
STATUS_BAR = (16, 16, 32)

W, H = 1024, 1600


def get_fonts(scale=1.0):
    sizes = {
        "title": int(48 * scale),
        "heading": int(36 * scale),
        "body": int(28 * scale),
        "small": int(22 * scale),
        "tiny": int(18 * scale),
        "icon_large": int(56 * scale),
    }
    fonts = {}
    for key, sz in sizes.items():
        try:
            fonts[key] = ImageFont.truetype("arial.ttf", sz)
        except:
            try:
                fonts[key] = ImageFont.truetype("arialbd.ttf" if key in ["title", "heading"] else "arial.ttf", sz)
            except:
                fonts[key] = ImageFont.load_default()
    return fonts


def draw_status_bar(draw, w):
    """Draw Android status bar."""
    draw.rectangle([0, 0, w, 48], fill=STATUS_BAR)
    f = get_fonts(0.8)
    draw.text((w - 120, 12), "12:30", fill=WHITE_70, font=f["small"])


def draw_tab_bar(draw, w, h, active=0, tabs=None):
    """Draw bottom navigation bar."""
    if tabs is None:
        tabs = ["Ana Sayfa", "Danisanlar", "Takvim", "Ayarlar"]
    bar_h = 100
    y = h - bar_h
    draw.rectangle([0, y, w, h], fill=TAB_BG)
    draw.line([(0, y), (w, y)], fill=(50, 50, 80), width=1)

    tab_w = w // len(tabs)
    icons = ["◉", "◎", "▦", "⚙"]
    f = get_fonts(0.7)
    for i, (label, icon) in enumerate(zip(tabs, icons)):
        cx = i * tab_w + tab_w // 2
        color = ACCENT if i == active else WHITE_50
        draw.text((cx - 10, y + 16), icon, fill=color, font=f["body"])
        bbox = draw.textbbox((0, 0), label, font=f["tiny"])
        tw = bbox[2] - bbox[0]
        draw.text((cx - tw // 2, y + 58), label, fill=color, font=f["tiny"])


def draw_card(draw, x, y, w, h, radius=16):
    """Draw a card background."""
    draw.rounded_rectangle([x, y, x+w, y+h], radius=radius, fill=CARD)


def draw_avatar(draw, cx, cy, r, color, initials="", font=None):
    """Draw a circular avatar."""
    draw.ellipse([cx-r, cy-r, cx+r, cy+r], fill=color)
    if initials and font:
        bbox = draw.textbbox((0, 0), initials, font=font)
        tw, th = bbox[2] - bbox[0], bbox[3] - bbox[1]
        draw.text((cx - tw//2, cy - th//2 - 4), initials, fill=WHITE, font=font)


# ============ SCREEN 1: LOGIN ============
def create_login_screen():
    img = Image.new("RGB", (W, H), BG)
    draw = ImageDraw.Draw(img)
    f = get_fonts()
    draw_status_bar(draw, W)

    # Logo circle
    cx, cy = W//2, 340
    cr = 80
    draw.ellipse([cx-cr, cy-cr, cx+cr, cy+cr], fill=SURFACE)

    # Psi symbol in circle
    draw.text((cx - 24, cy - 34), "Ψ", fill=ACCENT, font=f["icon_large"])

    # App name
    txt = "PsikoPlanner"
    bbox = draw.textbbox((0, 0), txt, font=f["title"])
    draw.text((cx - (bbox[2]-bbox[0])//2, cy + 100), txt, fill=ACCENT, font=f["title"])

    sub = "Profesyonel dijital ajandaniz"
    bbox2 = draw.textbbox((0, 0), sub, font=f["small"])
    draw.text((cx - (bbox2[2]-bbox2[0])//2, cy + 160), sub, fill=WHITE_50, font=f["small"])

    # Welcome text
    wel = "Tekrar Hos Geldiniz"
    bbox3 = draw.textbbox((0, 0), wel, font=f["heading"])
    draw.text((cx - (bbox3[2]-bbox3[0])//2, cy + 240), wel, fill=WHITE, font=f["heading"])

    # Email input
    input_y = cy + 320
    input_x = 80
    input_w = W - 160
    draw.rounded_rectangle([input_x, input_y, input_x+input_w, input_y+70], radius=12, outline=WHITE_50, width=2)
    draw.text((input_x + 50, input_y + 18), "E-posta", fill=WHITE_50, font=f["body"])
    draw.text((input_x + 16, input_y + 20), "✉", fill=WHITE_50, font=f["body"])

    # Password input
    pass_y = input_y + 100
    draw.rounded_rectangle([input_x, pass_y, input_x+input_w, pass_y+70], radius=12, outline=WHITE_50, width=2)
    draw.text((input_x + 50, pass_y + 18), "Sifre", fill=WHITE_50, font=f["body"])
    draw.text((input_x + 16, pass_y + 20), "🔒", fill=WHITE_50, font=f["body"])

    # Login button
    btn_y = pass_y + 110
    draw.rounded_rectangle([input_x, btn_y, input_x+input_w, btn_y+70], radius=35, fill=ACCENT)
    btxt = "Giris Yap"
    bbox4 = draw.textbbox((0, 0), btxt, font=f["body"])
    draw.text((cx - (bbox4[2]-bbox4[0])//2, btn_y + 18), btxt, fill=WHITE, font=f["body"])

    # Forgot password
    fp = "Sifremi Unuttum"
    bbox5 = draw.textbbox((0, 0), fp, font=f["small"])
    draw.text((cx - (bbox5[2]-bbox5[0])//2, btn_y + 100), fp, fill=ACCENT_LIGHT, font=f["small"])

    # Register
    reg = "Hesabiniz yok mu?  Kayit Ol"
    bbox6 = draw.textbbox((0, 0), reg, font=f["small"])
    draw.text((cx - (bbox6[2]-bbox6[0])//2, btn_y + 150), reg, fill=WHITE_70, font=f["small"])

    return img


# ============ SCREEN 2: DASHBOARD ============
def create_dashboard_screen():
    img = Image.new("RGB", (W, H), BG)
    draw = ImageDraw.Draw(img)
    f = get_fonts()
    draw_status_bar(draw, W)

    # Header
    draw.text((40, 70), "Ana Sayfa", fill=WHITE, font=f["title"])
    draw.text((40, 130), "Hos geldiniz, Dr. Ayse", fill=WHITE_70, font=f["body"])

    # Stat cards row 1
    y = 200
    card_w = (W - 120) // 2
    stats = [
        ("24", "Aktif Danisan", ACCENT),
        ("156", "Toplam Seans", GREEN),
        ("5", "Bu Hafta", ORANGE),
        ("3", "Bugun", ACCENT_LIGHT),
    ]

    for i, (num, label, color) in enumerate(stats):
        row = i // 2
        col = i % 2
        cx = 40 + col * (card_w + 40)
        cy = y + row * 170
        draw_card(draw, cx, cy, card_w, 140)
        draw.text((cx + 24, cy + 20), num, fill=color, font=f["title"])
        draw.text((cx + 24, cy + 85), label, fill=WHITE_70, font=f["small"])

    # Today's sessions
    sessions_y = y + 380
    draw.text((40, sessions_y), "Bugunun Seanslari", fill=WHITE, font=f["heading"])

    session_items = [
        ("09:00", "Mehmet Y.", "Bireysel Terapi", GREEN),
        ("10:30", "Zeynep K.", "Cift Terapisi", ACCENT),
        ("14:00", "Ali D.", "Bireysel Terapi", GREEN),
        ("15:30", "Fatma S.", "Aile Terapisi", ORANGE),
    ]

    for i, (time, name, stype, color) in enumerate(session_items):
        sy = sessions_y + 60 + i * 120
        draw_card(draw, 40, sy, W - 80, 100)

        # Time
        draw.text((70, sy + 16), time, fill=ACCENT_LIGHT, font=f["body"])

        # Color dot
        draw.ellipse([200, sy + 28, 216, sy + 44], fill=color)

        # Name & type
        draw.text((230, sy + 12), name, fill=WHITE, font=f["body"])
        draw.text((230, sy + 52), stype, fill=WHITE_50, font=f["small"])

        # Arrow
        draw.text((W - 120, sy + 26), "›", fill=WHITE_50, font=f["heading"])

    draw_tab_bar(draw, W, H, active=0)
    return img


# ============ SCREEN 3: CLIENT LIST ============
def create_client_list_screen():
    img = Image.new("RGB", (W, H), BG)
    draw = ImageDraw.Draw(img)
    f = get_fonts()
    draw_status_bar(draw, W)

    # Header
    draw.text((40, 70), "Danisanlar", fill=WHITE, font=f["title"])

    # Search bar
    sy = 140
    draw.rounded_rectangle([40, sy, W-40, sy+60], radius=30, fill=SURFACE)
    draw.text((80, sy + 14), "🔍  Danisan ara...", fill=WHITE_50, font=f["body"])

    # Client list
    clients = [
        ("MY", "Mehmet Yilmaz", "Bireysel Terapi", "Son seans: 28 Sub", (76, 110, 175)),
        ("ZK", "Zeynep Kaya", "Cift Terapisi", "Son seans: 27 Sub", (175, 76, 110)),
        ("AD", "Ali Demir", "Bireysel Terapi", "Son seans: 26 Sub", (110, 175, 76)),
        ("FS", "Fatma Sahin", "Aile Terapisi", "Son seans: 25 Sub", (175, 140, 76)),
        ("EO", "Elif Ozturk", "Bireysel Terapi", "Son seans: 24 Sub", (76, 175, 140)),
        ("HB", "Hasan Bulut", "Bireysel Terapi", "Son seans: 23 Sub", (140, 76, 175)),
        ("SA", "Selin Aksoy", "Cift Terapisi", "Son seans: 22 Sub", (175, 110, 76)),
        ("BT", "Burak Tan", "Bireysel Terapi", "Son seans: 20 Sub", (76, 140, 175)),
    ]

    for i, (init, name, therapy, last, color) in enumerate(clients):
        cy = 230 + i * 130
        if cy + 110 > H - 120:
            break
        draw_card(draw, 40, cy, W - 80, 110)

        # Avatar
        draw_avatar(draw, 110, cy + 55, 34, color, init, f["small"])

        # Info
        draw.text((170, cy + 15), name, fill=WHITE, font=f["body"])
        draw.text((170, cy + 52), therapy, fill=ACCENT_LIGHT, font=f["small"])
        draw.text((170, cy + 78), last, fill=WHITE_50, font=f["tiny"])

        # Arrow
        draw.text((W - 120, cy + 35), "›", fill=WHITE_50, font=f["heading"])

    # FAB button
    fab_x, fab_y = W - 120, H - 200
    draw.ellipse([fab_x, fab_y, fab_x+80, fab_y+80], fill=ACCENT)
    draw.text((fab_x + 22, fab_y + 10), "+", fill=WHITE, font=f["title"])

    draw_tab_bar(draw, W, H, active=1)
    return img


# ============ SCREEN 4: CLIENT DETAIL ============
def create_client_detail_screen():
    img = Image.new("RGB", (W, H), BG)
    draw = ImageDraw.Draw(img)
    f = get_fonts()
    draw_status_bar(draw, W)

    # Back arrow + header
    draw.text((40, 70), "← Danisan Detayi", fill=WHITE, font=f["heading"])

    # Avatar + name
    cx = W // 2
    draw_avatar(draw, cx, 220, 60, (76, 110, 175), "MY", f["heading"])
    name = "Mehmet Yilmaz"
    bbox = draw.textbbox((0, 0), name, font=f["heading"])
    draw.text((cx - (bbox[2]-bbox[0])//2, 300), name, fill=WHITE, font=f["heading"])

    info = "Bireysel Terapi  •  12 Seans"
    bbox2 = draw.textbbox((0, 0), info, font=f["small"])
    draw.text((cx - (bbox2[2]-bbox2[0])//2, 348), info, fill=WHITE_70, font=f["small"])

    # Info cards
    sections = [
        ("Kisisel Bilgiler", [
            ("Telefon", "0532 xxx xx xx"),
            ("E-posta", "mehmet@email.com"),
            ("Dogum Tarihi", "15.03.1988"),
            ("Meslek", "Muhendis"),
        ]),
        ("Terapi Ozeti", [
            ("Basvuru Nedeni", "Anksiyete, is stresi"),
            ("Baslangic", "15.09.2025"),
            ("Seans Sayisi", "12"),
            ("Son Seans", "28.02.2026"),
        ]),
    ]

    y = 410
    for title, items in sections:
        draw.text((40, y), title, fill=ACCENT_LIGHT, font=f["body"])
        y += 50
        draw_card(draw, 40, y, W - 80, len(items) * 62 + 20)
        for j, (key, val) in enumerate(items):
            iy = y + 16 + j * 62
            draw.text((70, iy), key, fill=WHITE_50, font=f["small"])
            draw.text((70, iy + 28), val, fill=WHITE, font=f["body"])
            if j < len(items) - 1:
                draw.line([(70, iy + 58), (W - 120, iy + 58)], fill=(50, 50, 80), width=1)
        y += len(items) * 62 + 50

    # Action buttons
    btn_y = y + 20
    btn_w = (W - 120) // 3
    btns = [("Seans Ekle", ACCENT), ("Anamnez", GREEN), ("Notlar", ORANGE)]
    for i, (label, color) in enumerate(btns):
        bx = 40 + i * (btn_w + 20)
        draw.rounded_rectangle([bx, btn_y, bx + btn_w, btn_y + 55], radius=12, fill=color)
        bbox = draw.textbbox((0, 0), label, font=f["small"])
        tw = bbox[2] - bbox[0]
        draw.text((bx + btn_w//2 - tw//2, btn_y + 14), label, fill=WHITE, font=f["small"])

    return img


# ============ SCREEN 5: CALENDAR ============
def create_calendar_screen():
    img = Image.new("RGB", (W, H), BG)
    draw = ImageDraw.Draw(img)
    f = get_fonts()
    draw_status_bar(draw, W)

    # Header
    draw.text((40, 70), "Takvim", fill=WHITE, font=f["title"])
    draw.text((W - 250, 80), "← Mart 2026 →", fill=ACCENT_LIGHT, font=f["body"])

    # Calendar grid
    cal_y = 160
    cal_x = 40
    cell_w = (W - 80) // 7
    cell_h = 90

    # Day headers
    days = ["Pzt", "Sal", "Car", "Per", "Cum", "Cmt", "Paz"]
    for i, d in enumerate(days):
        dx = cal_x + i * cell_w + cell_w // 2
        bbox = draw.textbbox((0, 0), d, font=f["small"])
        tw = bbox[2] - bbox[0]
        draw.text((dx - tw//2, cal_y), d, fill=WHITE_50, font=f["small"])

    # Calendar days
    cal_y += 50
    day_num = 0
    month_days = [0, 0, 0, 0, 0, 0, 1]  # March 2026 starts on Sunday
    for d in range(1, 32):
        month_days.append(d)

    # Sessions per day (mock)
    session_days = {2: 2, 3: 1, 5: 3, 9: 2, 10: 1, 12: 2, 16: 1, 17: 3, 19: 2, 23: 1, 24: 2, 26: 1, 30: 2}

    for week in range(5):
        for dow in range(7):
            idx = week * 7 + dow
            if idx >= len(month_days) or month_days[idx] == 0:
                continue
            d = month_days[idx]
            cx = cal_x + dow * cell_w + cell_w // 2
            cy = cal_y + week * cell_h + cell_h // 2

            # Today highlight
            if d == 2:
                draw.ellipse([cx-28, cy-28, cx+28, cy+28], fill=ACCENT)
                draw.text((cx - 10, cy - 14), str(d), fill=WHITE, font=f["body"])
            else:
                draw.text((cx - (14 if d >= 10 else 7), cy - 14), str(d), fill=WHITE_90, font=f["body"])

            # Session dots
            if d in session_days:
                count = session_days[d]
                dot_colors = [GREEN, ACCENT, ORANGE]
                total_w = count * 8 + (count - 1) * 4
                start_x = cx - total_w // 2
                for di in range(count):
                    dx = start_x + di * 12 + 4
                    draw.ellipse([dx, cy + 22, dx + 6, cy + 28], fill=dot_colors[di % 3])

    # Today's schedule
    sched_y = cal_y + 5 * cell_h + 40
    draw.text((40, sched_y), "2 Mart 2026 - Bugun", fill=WHITE, font=f["heading"])

    today_sessions = [
        ("09:00 - 09:50", "Mehmet Y.", "Bireysel", GREEN),
        ("10:30 - 11:20", "Zeynep K.", "Cift", ACCENT),
    ]

    for i, (time, name, stype, color) in enumerate(today_sessions):
        sy = sched_y + 50 + i * 110
        draw_card(draw, 40, sy, W - 80, 90)
        draw.rectangle([40, sy, 48, sy + 90], fill=color)
        draw.text((70, sy + 12), time, fill=ACCENT_LIGHT, font=f["small"])
        draw.text((70, sy + 42), f"{name}  •  {stype}", fill=WHITE, font=f["body"])

    draw_tab_bar(draw, W, H, active=2)
    return img


if __name__ == "__main__":
    os.makedirs(STORE_DIR, exist_ok=True)

    screens = [
        ("01_login.png", create_login_screen, "Login"),
        ("02_dashboard.png", create_dashboard_screen, "Dashboard"),
        ("03_clients.png", create_client_list_screen, "Client List"),
        ("04_client_detail.png", create_client_detail_screen, "Client Detail"),
        ("05_calendar.png", create_calendar_screen, "Calendar"),
    ]

    for filename, func, label in screens:
        print(f"Generating {label}...")
        img = func()
        img.save(os.path.join(STORE_DIR, filename), "PNG", quality=95)

    print(f"\nDone! {len(screens)} screenshots saved to {STORE_DIR}")
