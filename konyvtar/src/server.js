const express = require("express");
const path = require("path");
const app = express();
const PORT = 3000;

const konyvek = [
    { id: 1, cim: "A Pál utcai fiúk", szerzo: "Molnár Ferenc", kiadva: 1906 },
    { id: 2, cim: "Egri csillagok", szerzo: "Gárdonyi Géza", kiadva: 1899 },
    { id: 3, cim: "Az ember tragédiája", szerzo: "Madách Imre", kiadva: 1861 }
];

app.use((req, res, next) => {
    const idopont = new Date().toLocaleTimeString("hu-HU");
    console.log(`[${idopont}] ${req.method} ${req.originalUrl}`);
    next();
});

app.use(express.json());

app.use(express.static(path.join(__dirname, "..", "public")));

app.get("/udvozles", (req, res) => {
    res.send("<h1>Iskolai könyvtár API</h1><p>Jó olvasást!</p>");
});
app.get("/api/konyvek", (req, res) => {
    res.json(konyvek);
});
app.get("/api/konyvek/:id", (req, res) => {
    const id = Number(req.params.id);
    const talalat = konyvek.find(k => k.id === id);

    if (!talalat) {
        return res.status(404).json({ hiba: "Nincs ilyen könyv", id: id });
    }
    res.json(talalat);
});
app.get("/api/statisztika", (req, res) => {
    const statisztika = {
        konyvekSzama: konyvek.length,
        legregebbi: Math.min(...konyvek.map(k => k.kiadva)),
        lekerdezve: new Date().toLocaleString("hu-HU")
    };
    res.json(statisztika);
});


app.use((req, res) => {
    res.status(404).json({
        hiba: "Nincs ilyen végpont",
        utvonal: req.originalUrl
    });
});

app.listen(PORT, () => {
    console.log(`Szerver fut: http://localhost:${PORT}`);
});