# THE VOLUME MASTER — DJ C.O.B Web App

Official sample website for **DJ C.O.B aka THE VOLUME MASTER** (Music Producer & DJ).

## Features

- **Home** — Hero with your official logo & trademark slogan, slow-trailing photo gallery, services, featured beats, reviews
- **Studio Sessions** — Session gallery with filters + "log a session" (saves on device)
- **Beat Store** — Beat catalog with genre/price filters, lease & exclusive pricing
- **Booking** — Session/event booking form that sends the request straight to WhatsApp
- **Contact** — Contact channels + message form (WhatsApp or email)
- **Quote Generator** — Branded "THE VOLUME MASTER" quotes, printable / save as PDF
- **Receipt Generator** — Branded receipts with payment method, balance due, printable

## Project structure

```
├── index.html                  # Home page
├── pages/
│   ├── studio.html             # Studio sessions
│   ├── beats.html              # Beat store
│   ├── booking.html            # Book a session
│   ├── contact.html            # Contact
│   ├── quotes.html             # Quote generator
│   └── receipts.html           # Receipt generator
├── constants/
│   ├── header.html             # Shared site header (loaded on every page)
│   └── footer.html             # Shared site footer
└── Assets/
    ├── css/                    # One stylesheet per page + header-footer.css
    ├── js/                     # One script per page + loader.js
    └── img/                    # Your images and logo (see Assets/img/README.txt)
```

Each page uses its own stylesheet and JavaScript file. The header and footer live in
`constants/` and are injected automatically by `Assets/js/loader.js`.

## Adding your own images

Your photos and logo are already wired in — see `Assets/img/README.txt` for the full
file list. To swap any image, replace the file and keep the same name.

## Hosting on GitHub Pages

1. Push this folder to a GitHub repository.
2. On GitHub, open **Settings → Pages**.
3. Under **Branch**, select `main` and folder `/ (root)`, then **Save**.
4. Wait ~1 minute, then your site is live at:
   `https://<username>.github.io/<repo-name>/`

### Testing locally

Because the site loads the header/footer over HTTP, open it with a local server
(not by double-clicking the file):

```
python -m http.server 8080
```

Then visit `http://localhost:8080`.
