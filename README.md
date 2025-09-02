# 🛒 SparRadar Service

Ein intelligenter Service zur Verarbeitung von Einkaufslisten mit KI-gestützter Produkterkennung und Preiskalkulation für REWE-Märkte.

## 🎯 Überblick

SparRadar Service ist eine REST API, die unstrukturierte Einkaufslisten in strukturierte Produktdaten umwandelt. Der Service nutzt modernste KI-Technologie, um Produkte automatisch zu erkennen, mit einer umfangreichen Produktdatenbank abzugleichen und Gesamtpreise zu berechnen.

> **📍 Hinweis:** Aktuell werden nur REWE-Märkte unterstützt. Die Erweiterung auf weitere Einzelhandelsketten ist für zukünftige Versionen geplant.

### ✨ Hauptfeatures

- 🤖 **KI-basierte Einkaufslistenverarbeitung** - Automatische Strukturierung von Freitext-Einkaufslisten
- 🔍 **Intelligente Produktsuche** - Fuzzy-Search durch umfangreiche REWE-Produktdatenbank
- 💰 **Automatische Preiskalkulation** - Berechnung von Gesamtpreisen basierend auf Mengen und Grammaturen
- 🏪 **Multi-Markt-Unterstützung** - Verschiedene REWE-Standorte mit spezifischen Produktsortimenten
- 🔐 **Benutzerauthentifizierung** - Sichere API mit Cookie-basierter Authentifizierung
- 📋 **OpenAPI-Dokumentation** - Vollständige API-Spezifikation mit Swagger UI
- ⚡ **High Performance** - Gebaut mit Bun und TypeScript für optimale Performance

## 🛠️ Technologie-Stack

- **Runtime**: [Bun](https://bun.com) - Ultraschnelle JavaScript/TypeScript Runtime
- **Framework**: [Hono](https://hono.dev) - Leichtgewichtiges Web-Framework
- **Datenbank**: SQLite mit [TypeORM](https://typeorm.io)
- **KI**: OpenAI GPT mit [Vercel AI SDK](https://sdk.vercel.ai)
- **Validierung**: [Zod](https://zod.dev) - Schema-Validierung
- **Suche**: [Fuse.js](https://fusejs.io) - Fuzzy-Search-Engine

## 🚀 Installation

### Voraussetzungen

- [Bun](https://bun.com) v1.2.19 oder höher
- Node.js 18+ (für TypeScript-Unterstützung)

### Setup

1. **Repository klonen**
```bash
git clone <repository-url>
cd sparradar-service
```

2. **Dependencies installieren**
```bash
bun install
```

3. **Umgebungsvariablen konfigurieren**
```bash
# .env Datei erstellen
cp .env.example .env
```

Benötigte Umgebungsvariablen:
- `OPENAI_API_KEY` - OpenAI API-Schlüssel für KI-Features
- `DATABASE_URL` - SQLite-Datenbankpfad (optional, Standard: `./db.sqlite`)

4. **Datenbank initialisieren**
```bash
bun run src/app.ts
```

## 🏃‍♂️ Ausführung

### Entwicklungsmodus
```bash
bun run service:dev
```

### Produktionsmodus
```bash
bun run service:start
```

Der Service läuft standardmäßig auf `http://localhost:3000`

## 📊 Projektstruktur

```
sparradar-service/
├── data/                    # Produktdaten und Marktinformationen
│   ├── markets.json        # Markt-Konfigurationen
│   └── products_*.csv      # Produktkataloge pro Markt
├── src/
│   ├── ai/                 # KI-Integration
│   │   ├── llm.ts         # OpenAI-Konfiguration
│   │   ├── prompts.ts     # System-Prompts
│   │   └── tools/         # KI-Tools (Suche, Berechnung, Antworten)
│   ├── database/          # Datenbankmodelle und -konfiguration
│   │   ├── models/        # TypeORM-Entitäten
│   │   └── database.ts    # Datenbankverbindung
│   ├── middleware/        # Express-Middleware
│   ├── products/          # Produktmanagement
│   ├── routes/            # API-Routen
│   ├── schemas/           # Zod-Validierungsschemas
│   └── app.ts            # Hauptanwendung
└── README.md
```

## 🔌 API-Endpunkte

### Authentifizierung
- `POST /api/v1/auth/register` - Benutzerregistrierung
- `POST /api/v1/auth/login` - Benutzeranmeldung
- `POST /api/v1/auth/logout` - Benutzerabmeldung

### Einkaufslisten
- `POST /api/v1/shopping_list/parse` - Einkaufsliste verarbeiten

### Märkte
- `GET /api/v1/markets` - Verfügbare Märkte abrufen
- `GET /api/v1/markets/{id}` - Spezifischen Markt abrufen

### Dokumentation
- `GET /api/v1/spec` - OpenAPI-Spezifikation (JSON)
- `GET /api/v1/spec/ui` - Swagger UI

## 📝 Beispiel-Nutzung

### Einkaufsliste verarbeiten

```bash
curl -X POST http://localhost:3000/api/v1/shopping_list/parse \
  -H "Content-Type: application/json" \
  -H "Cookie: auth_token=<your-token>" \
  -d '{
    "shoppingList": "2x Milch, Brot, 500g Hackfleisch, 6 Eier",
    "marketId": "840129"
  }'
```

**Antwort:**
```json
{
  "items": [
    {
      "name": "Milch",
      "amount": 2,
      "productId": "12345",
      "price": 238,
      "grammage": "1L"
    },
    {
      "name": "Brot",
      "amount": 1,
      "productId": "67890",
      "price": 159,
      "grammage": "500g"
    }
  ],
  "totalPrice": 1234,
  "currency": "EUR"
}
```

## 🔍 KI-Features

### Intelligente Listenverarbeitung
- Automatische Erkennung von Produktnamen, Mengen und Einheiten
- Unterstützung für natürliche Sprache ("Six-Pack Bier" → 6x Bier)
- Mehrsprachige Verarbeitung (Deutsch/Englisch)

### Produktmatching
- Fuzzy-Search für ähnliche Produktnamen
- Berücksichtigung von Synonymen und Varianten
- Fallback auf ähnliche Produkte bei exakten Treffern

### Preisberechnung
- Automatische Mengenumrechnung basierend auf Grammatur
- Berücksichtigung von Packungsgrößen
- Präzise Berechnung in Cent-Genauigkeit

## 🗄️ Datenbank

Das System verwendet SQLite mit folgenden Hauptentitäten:

- **User** - Benutzerkonten und Authentifizierung
- **Market** - REWE-Märkte mit Standortinformationen
- **Product** - Produktkatalog mit Preisen und Grammaturen

## 🛡️ Sicherheit

- Passwort-Hashing mit bcrypt
- Cookie-basierte Session-Verwaltung
- CORS-Konfiguration für sichere Cross-Origin-Requests
- Input-Validierung mit Zod-Schemas

## 🧪 Entwicklung

### Code-Qualität
```bash
# Code formatieren
bun run prettier --write .
```

### Debugging
- Entwicklungsmodus mit automatischem Reload
- Detaillierte Fehlerbehandlung
- Strukturiertes Logging

## 📋 TODO / Roadmap

- [ ] Rate Limiting für API-Endpunkte
- [ ] Erweiterte Produktkategorisierung
- [ ] Preishistorie und Trends
- [ ] Mobile App Integration
- [ ] Mehrsprachige UI-Übersetzungen
- [ ] Redis-Caching für bessere Performance

## 🤝 Beitrag leisten

1. Fork des Repositories erstellen
2. Feature-Branch erstellen (`git checkout -b feature/amazing-feature`)
3. Änderungen committen (`git commit -m 'Add amazing feature'`)
4. Branch pushen (`git push origin feature/amazing-feature`)
5. Pull Request erstellen

## 📄 Lizenz

Dieses Projekt ist privat und nicht für die öffentliche Nutzung bestimmt.

## 🆘 Support

Bei Fragen oder Problemen:
1. Prüfen Sie die API-Dokumentation unter `/api/v1/spec/ui`
2. Überprüfen Sie die Logs für Fehlermeldungen
3. Stellen Sie sicher, dass alle Umgebungsvariablen korrekt gesetzt sind

---

**Entwickelt mit ❤️ und modernen Web-Technologien**
