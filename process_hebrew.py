#!/usr/bin/env python3
"""
Process a docx file to replace transliterated Hebrew words with Hebrew script.
"""

import re
import docx
from docx import Document
from copy import deepcopy

INPUT_FILE = "/root/.claude/uploads/cf94c50e-c949-47f6-b5b3-43a3b0dacedf/3f2cd0b9-nice_transcriptions_2.docx"
OUTPUT_FILE = "/root/.claude/uploads/cf94c50e-c949-47f6-b5b3-43a3b0dacedf/nice_transcriptions_hebrew.docx"

# Order matters - longer/more specific phrases first
REPLACEMENTS = [
    # Multi-word phrases first (most specific)
    ("Baal Shem Tov", "בעל שם טוב"),
    ("Chofetz Chaim", "חפץ חיים"),
    ("Chafetz Chaim", "חפץ חיים"),
    ("Klal Yisroel", "כלל ישראל"),
    ("Klal Yisrael", "כלל ישראל"),
    ("Eretz Yisroel", "ארץ ישראל"),
    ("Eretz Yisrael", "ארץ ישראל"),
    ("Eretz Yisroel", "ארץ ישראל"),
    ("Bnei Yisroel", "בני ישראל"),
    ("Bnei Yisrael", "בני ישראל"),
    ("Beis Hamikdash", "בית המקדש"),
    ("Beis Medrash", "בית מדרש"),
    ("Beis Din", "בית דין"),
    ("Olam Hazeh", "עולם הזה"),
    ("Olam Haba", "עולם הבא"),
    ("Gan Eden", "גן עדן"),
    ("Yom Kippur", "יום כיפור"),
    ("Rosh Hashana", "ראש השנה"),
    ("Rosh Hashanah", "ראש השנה"),
    ("Yom Tov", "יום טוב"),
    ("Sheva Brachos", "שבע ברכות"),
    ("Sheva Brochos", "שבע ברכות"),
    ("Bar Mitzvah", "בר מצווה"),
    ("Bas Mitzvah", "בת מצווה"),
    ("Bar Mitzva", "בר מצווה"),
    ("Bas Mitzva", "בת מצווה"),
    ("Shalom Bayis", "שלום בית"),
    ("Shalom Bayit", "שלום בית"),
    ("Kiddush Hashem", "קידוש ה'"),
    ("Chillul Hashem", "חילול ה'"),
    ("Matan Torah", "מתן תורה"),
    ("Har Sinai", "הר סיני"),
    ("Ma'amad Har Sinai", "מעמד הר סיני"),
    ("Maamad Har Sinai", "מעמד הר סיני"),
    ("Aseres Hadibros", "עשרת הדיברות"),
    ("Aseres Hadibrot", "עשרת הדיברות"),
    ("Talmid Chacham", "תלמיד חכם"),
    ("Talmidei Chachamim", "תלמידי חכמים"),
    ("Rosh Yeshiva", "ראש ישיבה"),
    ("Rosh Kolel", "ראש כולל"),
    ("Hashgacha Pratis", "השגחה פרטית"),
    ("Hashgacha Pratit", "השגחה פרטית"),
    ("Bein Adam Lachaveiro", "בין אדם לחבירו"),
    ("Bein Adam Lamakom", "בין אדם למקום"),
    ("Bein Adam LaMakom", "בין אדם למקום"),
    ("Kerias Shema", "קריאת שמע"),
    ("Krias Shema", "קריאת שמע"),
    ("Kerias Hatorah", "קריאת התורה"),
    ("Shemoneh Esrei", "שמונה עשרה"),
    ("Shmoneh Esrei", "שמונה עשרה"),
    ("Mussar Vaad", "מוסר ועד"),
    ("Dvar Torah", "דבר תורה"),
    ("Divrei Torah", "דברי תורה"),
    ("Refuah Sheleima", "רפואה שלמה"),
    ("Refuah Shalima", "רפואה שלמה"),
    ("Refuah Shlemah", "רפואה שלמה"),
    ("Tziduk Hadin", "צידוק הדין"),
    ("Alav Hashalom", "עליו השלום"),
    ("Olav Hashalom", "עליו השלום"),
    ("Aleha Hashalom", "עליה השלום"),
    ("Zichrono Livracha", "זכרונו לברכה"),
    ("Zichrona Livracha", "זכרונה לברכה"),
    ("Nichum Aveilim", "ניחום אבלים"),
    ("Chevra Kadisha", "חברה קדישא"),
    ("Yiras Shamayim", "יראת שמיים"),
    ("Yiras Shomayim", "יראת שמיים"),
    ("Shmirat Shabbos", "שמירת שבת"),
    ("Shemirat Shabbat", "שמירת שבת"),
    ("Lashon Hara", "לשון הרע"),
    ("Tzelem Elokim", "צלם אלוקים"),
    ("Yetzer Hara", "יצר הרע"),
    ("Yetzer Tov", "יצר הטוב"),
    ("Baal Tefila", "בעל תפילה"),
    ("Baal Tefilla", "בעל תפילה"),
    ("El Maleh", "אל מלא"),
    ("El Malei", "אל מלא"),
    ("Shulchan Aruch", "שולחן ערוך"),
    ("Tzaddik Hador", "צדיק הדור"),
    ("Parnassah", "פרנסה"),
    ("Parnasa", "פרנסה"),
    ("Hishtadlus", "השתדלות"),
    ("Hishtadlut", "השתדלות"),

    # Two-word phrases
    ("Yerushalayim", "ירושלים"),
    ("Yisroel", "ישראל"),
    ("Yisrael", "ישראל"),

    # Single words
    ("Davening", "דאווענען"),
    ("Daven", "דאווען"),
    ("Davened", "דאווענט"),
    ("Hashem", "ה'"),
    ("Chesed", "חסד"),
    ("Chessed", "חסד"),
    ("Gemara", "גמרא"),
    ("Gemaras", "גמראות"),
    ("Torah", "תורה"),
    ("Mishpacha", "משפחה"),
    ("Tefila", "תפילה"),
    ("Tefilla", "תפילה"),
    ("Tefilos", "תפילות"),
    ("Tefillos", "תפילות"),
    ("Tefillot", "תפילות"),
    ("Shabbos", "שבת"),
    ("Shabbat", "שבת"),
    ("Shabbas", "שבת"),
    ("Sukkos", "סוכות"),
    ("Sukkot", "סוכות"),
    ("Pesach", "פסח"),
    ("Shavuos", "שבועות"),
    ("Shavuot", "שבועות"),
    ("Chanukah", "חנוכה"),
    ("Hanukkah", "חנוכה"),
    ("Hanukah", "חנוכה"),
    ("Purim", "פורים"),
    ("Kiddush", "קידוש"),
    ("Havdalah", "הבדלה"),
    ("Havdala", "הבדלה"),
    ("Minyan", "מניין"),
    ("Minyanim", "מניינים"),
    ("Shul", "שול"),
    ("Yeshiva", "ישיבה"),
    ("Yeshivos", "ישיבות"),
    ("Yeshivot", "ישיבות"),
    ("Kollel", "כולל"),
    ("Kollelim", "כוללים"),
    ("Rebbi", "רבי"),
    ("Rebbe", "רבי"),
    ("Rabbi", "רב"),
    ("Rav", "רב"),
    ("Tzaddik", "צדיק"),
    ("Tzadikim", "צדיקים"),
    ("Tzaddikim", "צדיקים"),
    ("Chossid", "חסיד"),
    ("Chasid", "חסיד"),
    ("Chassidim", "חסידים"),
    ("Chasidim", "חסידים"),
    ("Mitzvah", "מצוה"),
    ("Mitzvos", "מצוות"),
    ("Mitzvot", "מצוות"),
    ("Mitzva", "מצוה"),
    ("Aveira", "עבירה"),
    ("Aveiros", "עבירות"),
    ("Aveirot", "עבירות"),
    ("Teshuva", "תשובה"),
    ("Teshuvah", "תשובה"),
    ("Emunah", "אמונה"),
    ("Emuna", "אמונה"),
    ("Bitachon", "בטחון"),
    ("Bitochin", "בטחון"),
    ("Simcha", "שמחה"),
    ("Simchos", "שמחות"),
    ("Tznius", "צניעות"),
    ("Tzniut", "צניעות"),
    ("Kedusha", "קדושה"),
    ("Kedushas", "קדושת"),
    ("Kadosh", "קדוש"),
    ("Bracha", "ברכה"),
    ("Brachos", "ברכות"),
    ("Brachot", "ברכות"),
    ("Brocha", "ברכה"),
    ("Brochos", "ברכות"),
    ("Tzedaka", "צדקה"),
    ("Tzedakah", "צדקה"),
    ("Ahavas", "אהבת"),
    ("Ahava", "אהבה"),
    ("Ahavah", "אהבה"),
    ("Achdus", "אחדות"),
    ("Achdut", "אחדות"),
    ("Shalom", "שלום"),
    ("Emes", "אמת"),
    ("Emet", "אמת"),
    ("Davka", "דווקא"),
    ("Mamash", "ממש"),
    ("Klal", "כלל"),
    ("Galus", "גלות"),
    ("Golus", "גלות"),
    ("Geula", "גאולה"),
    ("Geulah", "גאולה"),
    ("Moshiach", "משיח"),
    ("Mashiach", "משיח"),
    ("Neshama", "נשמה"),
    ("Neshamah", "נשמה"),
    ("Neshamos", "נשמות"),
    ("Neshamot", "נשמות"),
    ("Ruach", "רוח"),
    ("Guf", "גוף"),
    ("Gehenom", "גיהנום"),
    ("Gehinnom", "גיהנום"),
    ("Malach", "מלאך"),
    ("Malachim", "מלאכים"),
    ("Sefer", "ספר"),
    ("Seifer", "ספר"),
    ("Seforim", "ספרים"),
    ("Sforim", "ספרים"),
    ("Chiddush", "חידוש"),
    ("Chiddushim", "חידושים"),
    ("Chidush", "חידוש"),
    ("Psak", "פסק"),
    ("Halacha", "הלכה"),
    ("Halachah", "הלכה"),
    ("Halachos", "הלכות"),
    ("Halachot", "הלכות"),
    ("Minhag", "מנהג"),
    ("Minhagim", "מנהגים"),
    ("Poskim", "פוסקים"),
    ("Mishnah", "משנה"),
    ("Mishna", "משנה"),
    ("Talmud", "תלמוד"),
    ("Zohar", "זוהר"),
    ("Chumash", "חומש"),
    ("Parsha", "פרשה"),
    ("Parshas", "פרשת"),
    ("Parshios", "פרשיות"),
    ("Posuk", "פסוק"),
    ("Pasuk", "פסוק"),
    ("Pesukim", "פסוקים"),
    ("Rashi", 'רש"י'),
    ("Tosafos", "תוספות"),
    ("Tosafot", "תוספות"),
    ("Tosfos", "תוספות"),
    ("Ramban", 'רמב"ן'),
    ("Rambam", 'רמב"ם'),
    ("Mussar", "מוסר"),
    ("Chassidus", "חסידות"),
    ("Chasidus", "חסידות"),
    ("Kabbalah", "קבלה"),
    ("Kabbala", "קבלה"),
    ("Niggun", "ניגון"),
    ("Niggunim", "ניגונים"),
    ("Tikkun", "תיקון"),
    ("Tikun", "תיקון"),
    ("Kavana", "כוונה"),
    ("Kavanah", "כוונה"),
    ("Kavanos", "כוונות"),
    ("Kavanot", "כוונות"),
    ("Yeush", "יאוש"),
    ("Yetzer", "יצר"),
    ("Elokim", "אלוקים"),
    ("Elokim", "אלוקים"),
    ("Avoda", "עבודה"),
    ("Avodah", "עבודה"),
    ("Avoida", "עבודה"),
    ("Yirah", "יראה"),
    ("Shmirat", "שמירת"),
    ("Shemiras", "שמירת"),
    ("Hashgacha", "השגחה"),
    ("Seder", "סדר"),
    ("Chavrusa", "חברותא"),
    ("Chavrusah", "חברותא"),
    ("Shiur", "שיעור"),
    ("Shiurim", "שיעורים"),
    ("Drasha", "דרשה"),
    ("Machzor", "מחזור"),
    ("Siddur", "סידור"),
    ("Siddurim", "סידורים"),
    ("Piyut", "פיוט"),
    ("Nusach", "נוסח"),
    ("Chazan", "חזן"),
    ("Chazanim", "חזנים"),
    ("Kohen", "כהן"),
    ("Kohanim", "כהנים"),
    ("Levi", "לוי"),
    ("Leviim", "לויים"),
    ("Aliya", "עלייה"),
    ("Aliyah", "עלייה"),
    ("Aliyos", "עליות"),
    ("Aliyot", "עליות"),
    ("Chazara", "חזרה"),
    ("Amidah", "עמידה"),
    ("Tachanun", "תחנון"),
    ("Hallel", "הלל"),
    ("Musaf", "מוסף"),
    ("Mincha", "מנחה"),
    ("Maariv", "מעריב"),
    ("Maariv", "מעריב"),
    ("Shacharit", "שחרית"),
    ("Shacharis", "שחרית"),
    ("Zman", "זמן"),
    ("Zmanim", "זמנים"),
    ("Tzeis", "צאת"),
    ("Shkia", "שקיעה"),
    ("Alos", "עלות"),
    ("Netz", "נץ"),
    ("Chatzos", "חצות"),
    ("Refuah", "רפואה"),
    ("Choleh", "חולה"),
    ("Tzaros", "צרות"),
    ("Tzara", "צרה"),
    ("Nevuah", "נבואה"),
    ("Nevua", "נבואה"),
    ("Novi", "נביא"),
    ("Navi", "נביא"),
    ("Nevi'im", "נביאים"),
    ("Neviim", "נביאים"),
    ("Bnei", "בני"),
    ("Bnos", "בנות"),
    ("Chasan", "חתן"),
    ("Kallah", "כלה"),
    ("Kalla", "כלה"),
    ("Kiddushin", "קידושין"),
    ("Kesubah", "כתובה"),
    ("Ketubah", "כתובה"),
    ("Machatonim", "מחותנים"),
    ("Shadchan", "שדכן"),
    ("Shidduch", "שידוך"),
    ("Shidduchim", "שידוכים"),
    ("Mazal", "מזל"),
    ("Mazel", "מזל"),
    ("Bashert", "בשערט"),
    ("Koach", "כח"),
    ("Chizuk", "חיזוק"),
    ("Oneg", "עונג"),
    ("Kina", "קנאה"),
    ("Kinah", "קנאה"),
    ("Taavah", "תאווה"),
    ("Kavod", "כבוד"),
    ("Anava", "ענוה"),
    ("Anavah", "ענוה"),
    ("Gaavah", "גאווה"),
    ("Gaava", "גאווה"),
    ("Machlokes", "מחלוקת"),
    ("Machlokos", "מחלוקת"),
    ("Erev", "ערב"),
    ("Motza'ei", "מוצאי"),
    ("Motzaei", "מוצאי"),
    ("Leil", "ליל"),
    ("Layla", "לילה"),
    ("Boker", "בוקר"),
    ("Resha'im", "רשעים"),
    ("Reshaim", "רשעים"),
    ("Beinoni", "בינוני"),
    ("Beinonim", "בינונים"),
    ("Cheit", "חטא"),
    ("Avonos", "עוונות"),
    ("Aveiros", "עבירות"),
    ("Avon", "עוון"),
    ("Viduy", "וידוי"),
    ("Kapara", "כפרה"),
    ("Kaparah", "כפרה"),
    ("Mechila", "מחילה"),
    ("Mechilah", "מחילה"),
    ("Selicha", "סליחה"),
    ("Selichos", "סליחות"),
    ("Slichos", "סליחות"),
    ("Luchos", "לוחות"),
    ("Luchot", "לוחות"),
    ("Aron", "ארון"),
    ("Mishkan", "משכן"),
    ("Churban", "חורבן"),
    ("Shechinah", "שכינה"),
    ("Shechina", "שכינה"),
    ("Bitul", "ביטול"),
    ("Talmidim", "תלמידים"),
    ("Talmid", "תלמיד"),
    ("Chacham", "חכם"),
    ("Chachamim", "חכמים"),
    ("Gedolim", "גדולים"),
    ("Gadol", "גדול"),
    ("Posek", "פוסק"),
    ("Dayan", "דיין"),
    ("Dayanim", "דיינים"),
    ("Sanhedrin", "סנהדרין"),
    ("Nasi", "נשיא"),
    ("Mashgiach", "משגיח"),
    ("Mashgichim", "משגיחים"),
    ("Gabbai", "גבאי"),
    ("Shamash", "שמש"),
    ("Shiva", "שבעה"),
    ("Shloshim", "שלושים"),
    ("Yahrtzeit", "יארצייט"),
    ("Yahrzeit", "יארצייט"),
    ("Kaddish", "קדיש"),
    ("Hesped", "הספד"),
    ("Niftar", "נפטר"),
    ("Niftara", "נפטרה"),
    ("Zatzal", 'זצ"ל'),
    ("Shamayim", "שמיים"),
    ("Shomayim", "שמיים"),
    ("Eilu", "אלו"),
    ("Yom", "יום"),
    # Careful ones - only with clear context
]

def make_pattern(word):
    """Create a case-insensitive regex pattern with word boundaries."""
    escaped = re.escape(word)
    return re.compile(r'\b' + escaped + r'\b', re.IGNORECASE)

# Pre-compile all patterns
compiled_replacements = []
for english, hebrew in REPLACEMENTS:
    pattern = make_pattern(english)
    compiled_replacements.append((pattern, english, hebrew))

def replace_in_text(text):
    """Apply all replacements to a text string."""
    for pattern, english, hebrew in compiled_replacements:
        text = pattern.sub(hebrew, text)
    return text

def process_run(run):
    """Process a single run, replacing text while preserving formatting."""
    if run.text:
        new_text = replace_in_text(run.text)
        if new_text != run.text:
            run.text = new_text

def process_paragraph(para):
    """Process all runs in a paragraph."""
    for run in para.runs:
        process_run(run)

def process_table(table):
    """Process all cells in a table."""
    for row in table.rows:
        for cell in row.cells:
            for para in cell.paragraphs:
                process_paragraph(para)

def main():
    print(f"Loading document from: {INPUT_FILE}")
    doc = Document(INPUT_FILE)

    # Count paragraphs
    total_paragraphs = len(doc.paragraphs)
    total_tables = len(doc.tables)
    print(f"Found {total_paragraphs} paragraphs and {total_tables} tables")

    replacements_count = 0

    # Process all paragraphs
    for i, para in enumerate(doc.paragraphs):
        original_texts = [run.text for run in para.runs]
        process_paragraph(para)
        new_texts = [run.text for run in para.runs]
        for orig, new in zip(original_texts, new_texts):
            if orig != new:
                replacements_count += 1

    # Process all tables
    for table in doc.tables:
        process_table(table)

    # Also process headers and footers
    for section in doc.sections:
        if section.header:
            for para in section.header.paragraphs:
                process_paragraph(para)
        if section.footer:
            for para in section.footer.paragraphs:
                process_paragraph(para)

    print(f"Made replacements in approximately {replacements_count} runs")
    print(f"Saving to: {OUTPUT_FILE}")
    doc.save(OUTPUT_FILE)
    print("Done!")

if __name__ == "__main__":
    main()
