"use strict";

const haushaltsBuch = {
  gesamtBilanz: new Map(),
  eintraege: [],
  fehler: [],

  eintrag_erfassen() {
    let neuerEintrag = new Map();
    const titelInput = prompt("Titel:");
    neuerEintrag.set(
      "titel",
      this.titelVerarbeiten(titelInput ? titelInput.trim() : "")
    );
    const typInput = prompt("Typ (Einahmen und Ausgaben:)");
    neuerEintrag.set(
      "typ",
      this.typVerarbeiten(typInput ? typInput.trim() : "")
    );
    const betragInput = prompt("Betrag (in Euro, ohne €-Zeichen:)");
    neuerEintrag.set(
      "betrag",
      this.betragVerarbeiten(betragInput ? betragInput.trim() : "")
    );
    const datumInput = prompt("Datum (JJJJ-MM-TT:)");
    neuerEintrag.set(
      "datum",
      this.datumVerarbeiten(datumInput ? datumInput.trim() : "")
    );
    neuerEintrag.set("timespamp", Date.now());

    if (this.fehler.length === 0) {
      this.eintraege.push(neuerEintrag);
    } else {
      console.log("Folgenden Fehler wurden gefunden:");
      this.fehler.forEach(function (fehler) {
        console.log(fehler);
      });
    }
  },

  titelVerarbeiten(titel) {
    titel = titel.trim();
    if (this.titelValidieren(titel)) {
      return titel;
    } else {
      this.fehler.push("Kein Titel angegeben.");
    }
  },

  titelValidieren(titel) {
    if (titel !== "") {
      return true;
    } else {
      return false;
    }
  },

  typVerarbeiten(typ) {
    typ = typ.trim().toLowerCase();
    if (this.typValidieren(typ)) {
      return typ;
    } else {
      this.fehler.push(`Ungültiger Eintrags-Typ: "${typ}".`);
    }
  },

  typValidieren(typ) {
    if (typ.match(/^(?:einnahmen|ausgabe)$/) !== null) {
      return true;
    } else {
      return false;
    }
  },

  betragVerarbeiten(betrag) {
    betrag = betrag.trim();
    if (this.betragValidieren(betrag)) {
      return parseFloat(betrag.replace(",", ".")) * 100;
    } else {
      this.fehler.push(`Ungültiger Betrag: ${betrag} €`);
    }
  },

  betragValidieren(betrag) {
    if (betrag.match(/^\d{4}-\d{2}-\d{2}$/) !== null) {
      return true;
    } else {
      return false;
    }
  },

  datumVerarbeiten(datum) {
    datum = datum.trim();
    if (this.datumValidieren(datum)) {
      return new Date(`${datum} 00:00:00`);
    } else {
      this.fehler.push(`Ungültiger Datumsformat: "${datum}".`);
    }
  },

  datumValidieren(datum) {
    if (datum.match(/ /) !== null) {
      return true;
    } else {
      return false;
    }
  },

  eintraege_sortieren() {
    this.eintraege.sort(function (eintrag_a, eintrag_b) {
      if (eintrag_a.get("datum") > eintrag_b.get("datum")) {
        return -1;
      } else if (eintrag_a.get("datum") < eintrag_b.get("datum")) {
        return 1;
      } else {
        return 0;
      }
    });
  },

  html_eintrag_generieren(eintrag) {
    //li erstellen
    let listenpunkt = document.createElement("li");
    //Klasse setzen
    if (eintrag.get("typ") === "einnahme") {
      listenpunkt.setAttribute("class", "einnahme");
    } else if (eintrag.get("typ") === "ausgabe") {
      listenpunkt.setAttribute("class", "ausgabe");
    }
    listenpunkt.setAttribute("data-timestamp", eintrag.get("timestamp")); //Datum erstellen
    //span für Datum erstellen
    let datum = document.createElement("span");
    //Klasse fürs Datum  setzen
    datum.setAttribute("class", "datum");
    // eintragstyp setzen
    datum.textContent = eintrag.get("datum").toLocaleDateString("de-DE", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
    //Datum in den li einsetzen
    listenpunkt.insertAdjacentElement("afterbegin", datum);

    //span für Titel erstellen
    let titel = document.createElement("span");
    //klasse setzen
    titel.setAttribute("class", "titel");
    //Textcontent setzen
    titel.textContent = eintrag.get("titel");
    //Titel span einsetzen
    datum.insertAdjacentElement("afterend", titel);

    //span für Betrag erstellen
    let betrag = document.createElement("span");
    //klasse setzen
    betrag.setAttribute("class", "betrag");
    //Textcontent setzen
    betrag.textContent = `${(eintrag.get("betrag") / 100).toFixed(2).replace(/\./, ",")} €`;
    //Betrag einsetzen
    titel.insertAdjacentElement("afterend", betrag);

    // Button erstellen
    let button = document.createElement("button");
    //klasse für button setzen
    button.setAttribute("class", "entfernen-button");
    //Textcontent für button setzen
    betrag.insertAdjacentElement("afterend", button);

    //Icon erstellen
    let icon = document.createElement("i");
    //klasse für icon setzen
    icon.setAttribute("class", "fas fa-trash");
    //Icon einsetzen
    button.insertAdjacentElement("afterbegin", icon);
    return listenpunkt;
  },

  eintraege_anzeigen() {
    //überprüfen ob eine ul vorhanden ist, ggf. ul entfernen
    document
      .querySelectorAll("monaltsliste ul")
      .forEach(function (eintragsliste) {
        eintragsliste.remove();
      });
    //<ul> erstellen
    let eintragsliste = document.createElement("ul");
    //über eintraege[]iterierern
    for (let eintrag of this.eintraege) {
      // für jeden Eintrag einen HTML-Eintrag erstellen,HTML Eintrag in die <ul> einsetzen
      eintragsliste.insertAdjacentElement(
        "beforeend",
        this.html_eintrag_generieren(eintrag)
      );
    }
    // <ul>in den article.monatsliste einsetzen
    document
      .querySelector(".monatsliste")
      .insertAdjacentElement("afterbegin", eintragsliste);
  },

  gesamtbilanz_erstellen() {
    let neue_gesamtBilanz = new Map();
    neue_gesamtBilanz.set("einnahmen", 0);
    neue_gesamtBilanz.set("ausgaben", 0);
    neue_gesamtBilanz.set("bilanz", 0);

    this.eintraege.forEach(function (eintrag) {
      switch (eintrag.get("typ")) {
        case "einahme":
          neue_gesamtBilanz.set(
            "einnahmen",
            neue_gesamtBilanz.get("einnahmen") + eintrag.get("betrag")
          );
          neue_gesamtBilanz.set(
            "bilanz",
            neue_gesamtBilanz.get("bilanz") + eintrag.get("betrag")
          );
          break;
        case "ausgabe":
          neue_gesamtBilanz.set(
            "ausgaben",
            neue_gesamtBilanz.get("ausgaben") + eintrag.get("betrag")
          );
          neue_gesamtBilanz.set(
            "bilanz",
            neue_gesamtBilanz.get("bilanz") - eintrag.get("betrag")
          );
          break;
        default:
          console.log(`der Typ "${eintrag.get("typ")}" ist nicht bekannt`);
          break;
      }
    });
    this.gesamtBilanz = neue_gesamtBilanz;
  },

  // <aside id="gesamtbilanz">
  //       <h1>Gesamtbilanz</h1>
  //       <div class="gesamtbilanz-zeile einnahmen"><span>Einnahmen:</span><span>4228,74€</span></div>
  //       <div class="gesamtbilanz-zeile ausgaben"><span>Ausgaben:</span><span>2988,88€</span></div>
  //       <div class="gesamtbilanz-zeile bilanz"><span>Bilanz:</span><span class="positiv">1239,86€</span></div>
  //   </aside>

  //html gesamtbilanz generieren
  html_gesamtbilanz_generieren() {
    //anhand der aktuellen gesamzbilanz, die gesamtbilanz neu generieren
    let gesamtbilanz = document.createElement("aside");
    //id setzen
    gesamtbilanz.setAttribute("id", "gesamtbilanz");
    //h1 erstellen
    let h1 = document.createElement("h1");
    //Textcontent setzen
    ueberschrift.textContent = "Gesamtbilanz";
    //h1 in die aside einsetzen
    gesamtbilanz.insertAdjacentElement("afterbegin", ueberschrift);

    //ERSTER DIV für Einnahmen erstellen
    let einnahmen_zeile = document.createElement("div");
    //klasse setzen
    einnahmen_zeile.setAttribute("class", "gesamtbilanz-zeile einnahmen");
    //span für Einnahmen erstellen
    let einnahmen_titel = document.createElement("span");
    //Textcontent setzen
    einnahmen_titel.textContent = "Einnahmen:";
    //span in die div einsetzen
    einnahmen_zeile.insertAdjacentElement("afterbegin", einnahmen_titel);

    //span für Betrag erstellen
    let einnahmen_betrag = document.createElement("span");
    //Textcontent setzen
    einnahmen_betrag.textContent = `${(this.gesamtbilanz.get("einnahmen")/100).toFixed(2).replace(/\./, ",")} €`;
    //span in die div einsetzen
    einnahmen_zeile.insertAdjacentElement("beforend", einnahmen_betrag);
    //div in die aside einsetzen
    gesamtbilanz.insertAdjacentElement("beforeend", einnahmen_zeile);

    //ZWEITES DIV für Ausgaben erstellen
     //div für Einnahmen erstellen
     let ausgaben_zeile = document.createElement("div");
     //klasse setzen
     ausgaben_zeile.setAttribute("class", "gesamtbilanz-zeile ausgaben");
     //span für Einnahmen erstellen
     let ausgaben_titel = document.createElement("span");
     //Textcontent setzen
     ausgaben_titel.textContent = "Ausgaben:";
     //span in die div einsetzen
     ausgaben_zeile.insertAdjacentElement("afterbegin", ausgaben_titel);
     //span für Betrag erstellen
     let ausgaben_betrag = document.createElement("span");
     //Textcontent setzen
     ausgaben_betrag.textContent = `${(this.gesamtbilanz.get("ausgaben")/100).toFixed(2).replace(/\./, ",")} €`;
     //span in die div einsetzen
     ausgaben_zeile.insertAdjacentElement("beforend", ausgaben_betrag);
     //div in die aside einsetzen
     gesamtbilanz.insertAdjacentElement("beforeend", ausgaben_zeile);
    
     // DRITTES DIV für Bilanz erstellen
     //div für Bilanz erstellen
     let bilanz_zeile = document.createElement("div");
     bilanz_zeile.setAttribute("class", "gesamtbilanz-zeile bilanz");
     let bilanz_titel = document.createElement("span");
     bilanz_titel.textContent = "Bilanz:";
     bilanz_zeile.insertAdjacentElement("afterbegin", bilanz_titel);
     let bilanz_betrag = document.createElement("span");
      if(this.gesamtbilanz.get("bilanz") >= 0) {
        bilanz_betrag.setAttribute("class", "positiv");
      } else if(this.gesamtbilanz.get("bilanz") < 0) {
        bilanz_betrag.setAttribute("class", "negativ");
      }
     bilanz_betrag.textContent = `${(this.gesamtbilanz.get("bilanz")/100).toFixed(2).replace(/\./, ",")} €`;
     bilanz_zeile.insertAdjacentElement("beforend", bilanz_betrag);
     gesamtbilanz.insertAdjacentElement("beforeend", bilanz_zeile);
     return gesamtbilanz;
  },

  gesamtbilanz_anzeigen() {
    //prüfen ob bereits Gesamtbilanz angezeigt wird,
    document.querySelectorAll("#gesamtbilanz").forEach(function (gesamtbilanz) {
      gesamtbilanz.remove(); // ggf. entfernen
    });
    // neue gesamtbilanz anzeigen (html_gesamtbilanz-generieren())
    document
      .querySelector("body")
      .insertAdjacentElement("beforeend", this.html_gesamtbilanz_generieren());
  },

  eintrag_hinzufuegen() {
    let weiterer_eintrag = true;
    while (weiterer_eintrag) {
      this.eintrag_erfassen();
      if (this.fehler.length === 0) {
        this.eintraege_sortieren();
        this.eintraege_anzeigen();
        this.gesamtbilanz_erstellen();
        this.gesamtbilanz_anzeigen();
      } else {
        this.fehler = []; // Fehler löschen
      }
      weiterer_eintrag = confirm("Weiteren Eintrag hinzufügen?");
    }
  },
};

haushaltsBuch.eintrag_hinzufuegen();
console.log(haushaltsBuch);
