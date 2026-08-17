# Inform Bestellsystem

Webanwendung zur Verwaltung von Produkten und zur Aufgabe von Bestellungen. Das Backend berechnet Gesamtpreise serverseitig und reduziert den Lagerbestand transaktional. Das Frontend ist eine typsichere React-Anwendung, die über einen generierten OpenAPI-Client mit dem Backend kommuniziert.

---

## Architekturüberblick

### Backend — Onion Architecture

```
┌─────────────────────────────────────────┐
│           Presentation (NestJS)         │  HTTP-Controller, Request-DTOs,
│                                         │  Response-DTOs, Exception-Filter
├─────────────────────────────────────────┤
│        Infrastructure (Prisma)          │  Repository-Implementierungen,
│                                         │  DB-Mapper, Prisma-Client
├─────────────────────────────────────────┤
│           Application                   │  Use Cases (ein File pro Operation),
│                                         │  Application-DTOs
├─────────────────────────────────────────┤
│              Domain                     │  Entities, Value Objects,
│                                         │  Repository-Interfaces, Fehler
└─────────────────────────────────────────┘
         Abhängigkeiten zeigen nach innen
```

Die Domänenschicht ist vollständig framework- und datenbankfrei. Jede äußere Schicht darf nur auf die unmittelbar darunter liegende zeigen. Repository-Interfaces liegen in der Domain; Prisma implementiert sie in der Infrastructure. Das Prisma-Modell verlässt die Infrastrukturschicht nie — zwischen DB-Typen und Domain-Entities wird explizit gemappt.

Der Aufwand für diese Trennung ist für ein Projekt dieser Größe bewusst hoch gewählt, um die Architektur demonstrierbar zu machen.

### Frontend — Feature Slices

```
src/features/
  products/
    api/          openapi-fetch-Aufruf
    model/        Zod-Schema, Formtypen
    hooks/        TanStack Query Hooks
    components/   UI-Bausteine
    pages/        Routen-Komponenten
  orders/         (gleiche Struktur)
src/shared/
  api/            generierter OpenAPI-Client + Schema
  ui/             wiederverwendbare Komponenten
```

Kein DDD im Frontend: Die Schichtentrennung beschränkt sich auf Feature-Isolierung und klare Datenflusskontrolle über React Query.

### Typ-Sharing via OpenAPI

Das Backend generiert eine statische `openapi.json`. Das Frontend liest diese Datei und erzeugt daraus TypeScript-Typen (`generate:api`). Damit sind Request- und Response-Typen an einer einzigen Quelle verankert — ohne geteilte Pakete oder manuelles Synchronisieren.

---

## Vorgehen

Ich habe mit der Infrastruktur begonnen: Docker-Compose für Postgres, `.env`-Datei, Prisma-Schema mit `snake_case`-Mapping über `@map`/`@@map`. Datenbank-Modelle und Domain-Entities sind von Anfang an getrennt behandelt worden.

Im Backend habe ich mich strikt schichtenweise von innen nach außen vorgearbeitet: zuerst Domain (Entities, Value Objects, Repository-Interfaces, Fehler-Hierarchie), dann Application (Use Cases), dann Infrastructure (Prisma-Repositories, Mapper), schließlich Presentation (Controller, DTOs, Exception-Filter). Erst nach Abschluss von `product` habe ich `order` in derselben Reihenfolge umgesetzt.

Nachdem beide Module liefen, habe ich die OpenAPI-Spezifikation als statische Datei generiert und die Swagger-UI eingebunden. Anschließend habe ich Unit-Tests auf zwei Ebenen ergänzt: Domain-Entity-Tests belegen die Geschäftsregeln ohne jede externe Abhängigkeit; Use-Case-Tests mit In-Memory-Repository-Implementierungen zeigen, dass die Anwendungsschicht vollständig ohne Datenbankverbindung und ohne NestJS-Bootstrap testbar ist — das ist der konkrete Nutzen der Onion Architecture. Eine GitHub-Actions-Pipeline führt diese Tests bei jedem Push automatisch aus.

Das Frontend habe ich feature-basiert aufgebaut: zunächst den typisierten API-Client auf Basis der generierten Spec, dann produktseitig Hooks, Formulare und Tabelle, danach dasselbe für Bestellungen. Die Demo-User-Kontext-Schicht kam am Ende, um das Bestellformular mit einer festen Benutzer-ID zu versorgen.

---

## Designentscheidungen

**Onion Architecture als Grundgerüst**
Ich habe mich für Onion Architecture entschieden, weil sie Geschäftslogik und technische Details konsequent trennt: Die Domänenschicht kennt weder NestJS noch Prisma, sondern nur reines TypeScript. Änderungen an der Datenbank oder am HTTP-Framework berühren die Kernlogik nicht. Der zentrale Vorteil ist Testbarkeit — Domain und Use Cases lassen sich ohne laufende Datenbank und ohne Framework-Bootstrap testen. Ein weiterer Vorteil ist Nachvollziehbarkeit: Wer ein Modul öffnet, sieht sofort, wo Geschäftsregeln liegen und wo Infrastrukturdetails. Der Preis dafür ist Vorabaufwand durch explizites Mapping, DI-Tokens und mehrschichtige DTOs — für ein Projekt dieser Größe bewusst in Kauf genommen, um die Architektur klar demonstrierbar zu machen.

**Serverseitige Preisberechnung**
Der Gesamtpreis einer Bestellung wird ausschließlich im Backend berechnet. Der Client sendet nur Produkt-ID und Menge. Das schützt vor Preismanipulation und stellt sicher, dass die Validierung der Geschäftsregeln (verfügbarer Stock, gültiger Preis) nicht umgangen werden kann.

**`unitPrice`-Historisierung in `OrderItem`**
Zum Zeitpunkt der Bestellung wird der aktuelle Preis jedes Produkts im `OrderItem` festgeschrieben. Spätere Preisänderungen am Produkt verfälschen keine historischen Bestellwerte.

**Atomare Stock-Reduktion via `$transaction`**
Lagerbestandsänderungen und das Anlegen der Bestellung erfolgen in einer einzigen Prisma-Transaktion. Schlägt ein Teil fehl, wird nichts persistiert.

**OpenAPI-CodeGen**
`openapi-typescript` erzeugt aus der Backend-Spec ein typisiertes Schema. `openapi-fetch` nutzt dieses Schema für einen vollständig typisierten HTTP-Client. Damit werden Breaking Changes im API sofort als TypeScript-Fehler sichtbar.

**Chakra UI v3**
Vollständige Komponentenbibliothek mit vernünftigen Defaults. Der Trade-off: Chakra UI v3 setzt Emotion als CSS-in-JS-Runtime voraus, was einen kleinen Laufzeit-Overhead mit sich bringt. Für ein internes Bestell-Tool ist das vertretbar.

---

## Setup

**Voraussetzungen:** Node.js 22+, Docker

### 1. Umgebungsvariablen

Das Projekt verwendet drei separate `.env`-Dateien:

**`.env`** (Projektroot — Docker Compose)

```env
POSTGRES_USER=inform
POSTGRES_PASSWORD=inform
POSTGRES_DB=inform_bestellsystem
```

**`backend/.env`** (NestJS / Prisma)

```env
DATABASE_URL=postgresql://inform:inform@localhost:5432/inform_bestellsystem
```

**`frontend/.env.local`** (Vite)

```env
VITE_API_BASE_URL=http://localhost:3000
```

### 2. Datenbank starten

```bash
docker compose up -d
```

### 3. Backend einrichten und starten

```bash
cd backend
npm install
npx prisma migrate dev
npm run seed
npm run start:dev
```

Die API läuft auf `http://localhost:3000`.  
Swagger-UI: `http://localhost:3000/api/docs`

### 4. OpenAPI-Typen generieren

```bash
# im backend-Verzeichnis
npm run openapi:generate
```

Das schreibt `backend/openapi.json`. Danach im Frontend:

```bash
cd ../frontend
npm run generate:api
```

Das aktualisiert `src/shared/api/schema.ts`.

### 5. Backend-Tests ausführen

```bash
# im backend-Verzeichnis
npm test
```

### 6. Frontend starten

```bash
# im frontend-Verzeichnis
npm install
npm run dev
```

Das Frontend läuft auf `http://localhost:5173`.

---

## Orientierung im Code

| Was                                        | Wo                                                    |
| ------------------------------------------ | ----------------------------------------------------- |
| Domain-Schicht (Entities, VOs, Interfaces) | `backend/src/modules/{product,order}/domain/`         |
| Application (Use Cases)                    | `backend/src/modules/{product,order}/application/`    |
| Infrastructure (Prisma-Repos, Mapper)      | `backend/src/modules/{product,order}/infrastructure/` |
| Presentation (Controller, DTOs)            | `backend/src/modules/{product,order}/presentation/`   |
| Prisma-Schema                              | `backend/prisma/schema.prisma`                        |
| Generierte OpenAPI-Spec                    | `backend/openapi.json`                                |
| Typisierter API-Client                     | `frontend/src/shared/api/client.ts`                   |
| Generierte API-Typen                       | `frontend/src/shared/api/schema.ts`                   |
| Feature-Slices                             | `frontend/src/features/{products,orders}/`            |
| Unit-Tests (Domain + Use Cases)            | `backend/src/**/*.spec.ts`                            |
| CI-Pipeline                                | `.github/workflows/ci.yml`                            |

---

## Weiterentwicklung

**Echte Authentifizierung**
Der Demo-User-Kontext kann durch ein JWT-basiertes Auth-System ersetzt werden. `userId` fließt bereits als Parameter durch alle Schichten — der Umbau beschränkt sich auf Presentation und den Frontend-Kontext.

**Theme Datei**
Eine Theme Datei die alle Brand spezifischen Farben, Größen, Abstände etc. in wiederverwendbaren Tokens definiert und in den Komponenten statt Hardcoded Werten verwendet wird

**Bestellstornierung**
Eine `CANCELLED`-Status-Spalte in `Order` plus ein `cancel`-Use-Case, der den Stock transaktional zurückbucht. Die Domänen-Invarianten sind bereits klar genug, um das ohne strukturelle Änderungen ergänzen zu können.

**Bestellungen bearbeiten**
Eine Bearbeitung aufgegebener Bestellungen ist technisch denkbar, erfordert aber vorab Klärung mit dem Product Owner. Die Aufgabenstellung lässt viele Fragen offen: Darf die Produktauswahl geändert werden oder nur die Menge? Was passiert mit dem Lagerbestand — wird er bei Mengenänderung sofort angepasst oder erst beim Speichern? Wie verhält sich der historisierte `unitPrice`, wenn sich der Produktpreis zwischenzeitlich geändert hat? Gibt es einen Zeitraum, nach dem eine Bestellung nicht mehr bearbeitet werden kann? Ohne Antworten auf diese Fragen lässt sich kein konsistentes Datenmodell entwerfen — hier ist Refinement vor Implementierung zwingend.

---

## KI-Nutzung und Transparenz

### Wo ich KI eingesetzt habe

**Repetitive Boilerplate nach bestehendem Muster**
Sobald ein Muster im Code etabliert war, habe ich KI zur Erstgenerierung strukturell ähnlicher Dateien genutzt. Beispiel: `create-order.use-case.ts` wurde auf Basis des bereits fertiggestellten `create-product.use-case.ts` generiert und anschließend manuell auf die Order-spezifische Logik angepasst. Wichtig: KI kam hier erst zum Einsatz, nachdem ich den Kontext selbst erarbeitet hatte nicht als Ausgangspunkt.

Ähnliches gilt für das Prisma-Schema: Die Entitäten `Product`, `Order` und `OrderItem` mit ihren Grundeigenschaften waren durch die Aufgabenstellung vorgegeben. Die konkrete Umsetzung — `snake_case`-Mapping via `@map`/`@@map`, `Decimal(10,2)` für Geldbeträge, `unitPrice` als historisierte Spalte in `OrderItem`, `onDelete: Cascade` auf der Order-Relation habe ich selbst durchdacht und modelliert.

**OpenAPI-Annotationen**
Das Hinzufügen von `@ApiProperty`, `@ApiOperation` und `@ApiResponse` Dekorationen in DTOs und Controllern ist inhaltlich repetitiv und fehleranfällig. Hier habe ich KI-Unterstützung genutzt, jede Ausgabe aber vor der Übernahme einzeln geprüft.

**CodeGen-Skript**
Beim Aufsetzen von `backend/scripts/generate-openapi.ts`, dem Skript, das die NestJS-App headless startet und die OpenAPI-Spec als statische Datei schreibt, habe ich KI zur Unterstützung herangezogen.

**Tests**
KI half beim Identifizieren sinnvoller Testfälle und lieferte eine initiale Implementierung für `order.entity.spec.ts` und `create-order.use-case.spec.ts`.

**Dokumentation**
Bei Formulierungen und der Markdown-Struktur dieser README habe ich KI-Unterstützung genutzt.

### Wo ich bewusst auf KI verzichtet habe

**Architektonische Kernentscheidungen**
Der Schicht-Schnitt der Onion Architecture, die Abhängigkeitsrichtung, die Entscheidung welche Regel in welcher Schicht liegt — diese Entscheidungen habe ich selbst getroffen. KI kann etablierte Architekturmuster reproduzieren, aber das saubere Erkennen der Domänengrenzen und das konsequente Einhalten der Schichtgrenzen im konkreten fachlichen Kontext erfordert ein Verständnis, das nicht delegierbar ist.
