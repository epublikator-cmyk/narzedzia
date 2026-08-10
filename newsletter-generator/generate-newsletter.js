// generate-newsletter.js
//
// Co robi ten skrypt:
// 1. Pobiera RSS z Twojego bloga (Bear Blog)
// 2. Wyciąga z niego kilka najnowszych wpisów (tytuł, link, krótki opis)
// 3. Wstawia je do szablonu (template.html)
// 4. Zapisuje gotowy plik HTML w folderze output/
//
// Ten gotowy plik HTML możesz otworzyć w przeglądarce, sprawdzić jak wygląda,
// a potem skopiować jego zawartość i wkleić jako treść maila w naffy albo Buttondown.

const fs = require('fs');
const path = require('path');

// ====================================================
// USTAWIENIA — TO JEST JEDYNE MIEJSCE, KTÓRE MUSISZ EDYTOWAĆ
// ====================================================

// Adres RSS Twojego bloga. Dla Bear Bloga zwykle wygląda tak:
// https://NAZWATWOJEGOBLOGA.bearblog.dev/feed/
const RSS_URL = 'https://ptaszarnia.bearblog.dev/feed/';

// Ile najnowszych wpisów ma się znaleźć w newsletterze
const LICZBA_WPISOW = 3;

// ====================================================
// Poniżej nic nie musisz zmieniać
// ====================================================

const TEMPLATE_PATH = path.join(__dirname, 'template.html');
const OUTPUT_PATH = path.join(__dirname, 'output', 'newsletter.html');

async function main() {
  console.log(`Pobieram RSS z: ${RSS_URL}`);
  const response = await fetch(RSS_URL);
  if (!response.ok) {
    throw new Error(`Nie udało się pobrać RSS (kod błędu: ${response.status}). Sprawdź, czy adres RSS_URL jest poprawny.`);
  }
  const xml = await response.text();

  const items = parseRssItems(xml).slice(0, LICZBA_WPISOW);

  if (items.length === 0) {
    throw new Error('Nie znaleziono żadnych wpisów w RSS. Sprawdź adres RSS_URL — czy na pewno to jest adres kanału RSS, a nie samego bloga?');
  }

  const itemsHtml = items.map(itemToHtml).join('\n');

  const template =
