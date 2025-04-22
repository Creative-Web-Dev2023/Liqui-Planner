"use strict";

const haushaltsBuch = {
  gesamtBilanz: new Map(),
  eintraege: [],
  fehler: [],

  eintrag_erfassen() {
    let neuerEintrag = new Map();
    const titelInput = prompt("Titel:");
    neuerEintrag.set("titel",this.titelVerarbeiten(titelInput ? titelInput.trim() : ""));
    const typInput = prompt("Typ (Einahmen und Ausgaben:)");
    neuerEintrag.set("typ",this.typVerarbeiten(typInput ? typInput.trim() : ""));
    const betragInput = prompt("Betrag (in Euro, ohne €-Zeichen:)");
    neuerEintrag.set("betrag", this.betragVerarbeiten(betragInput ? betragInput.trim() : "")
    );
    const datumInput = prompt("Datum (JJJJ-MM-TT:)");
    neuerEintrag.set( "datum", this.datumVerarbeiten(datumInput ? datumInput.trim() : "")
    );
    neuerEintrag.set("timespamp", Date.now());

    if (this.fehler.length === 0) {
      this.eintraege.push(neuerEintrag);
    } else {
      console.log("Folgenden Fehler wurden gefunden:");
      this.fehler.forEach(fehler => 
        console.log(fehler));
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
    this.eintraege.sort((eintrag_a, eintrag_b) => {
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
    let listenpunkt = document.createElement("li");
    if (eintrag.get("typ") === "einnahme") {
      listenpunkt.setAttribute("class", "einnahme");
    } else if (eintrag.get("typ") === "ausgabe") {
      listenpunkt.setAttribute("class", "ausgabe");
    }
    listenpunkt.setAttribute("data-timestamp", eintrag.get("timestamp")); 
    let datum = document.createElement("span");
    datum.setAttribute("class", "datum");
    datum.textContent = eintrag.get("datum").toLocaleDateString("de-DE", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
    listenpunkt.insertAdjacentElement("afterbegin", datum);
    let titel = document.createElement("span");
    titel.setAttribute("class", "titel");
    titel.textContent = eintrag.get("titel");
    datum.insertAdjacentElement("afterend", titel);
    let betrag = document.createElement("span");
    betrag.setAttribute("class", "betrag");
    betrag.textContent = `${(eintrag.get("betrag") / 100).toFixed(2).replace(/\./, ",")} €`;
    titel.insertAdjacentElement("afterend", betrag);
    let button = document.createElement("button");
    button.setAttribute("class", "entfernen-button");
    betrag.insertAdjacentElement("afterend", button);
    let icon = document.createElement("i");
    icon.setAttribute("class", "fas fa-trash");
    button.insertAdjacentElement("afterbegin", icon);
    return listenpunkt;
  },

  eintraege_anzeigen() {
    document .querySelectorAll("monaltsliste ul").forEach(eintragsliste=>
      eintragsliste.remove());
    let eintragsliste = document.createElement("ul");
    this.eintraege.forEach(eintrag =>
      eintragsliste.insertAdjacentElement("beforeend",this.html_eintrag_generieren(eintrag)));
    document .querySelector(".monatsliste").insertAdjacentElement("afterbegin", eintragsliste);
  },

  gesamtbilanz_erstellen() {
    let neue_gesamtBilanz = new Map();
    neue_gesamtBilanz.set("einnahmen", 0);
    neue_gesamtBilanz.set("ausgaben", 0);
    neue_gesamtBilanz.set("bilanz", 0);

    this.eintraege.forEach (eintrag => {
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

  html_gesamtbilanz_generieren() {
    let gesamtbilanz = document.createElement("aside");
    gesamtbilanz.setAttribute("id", "gesamtbilanz");
    let h1 = document.createElement("h1");
    ueberschrift.textContent = "Gesamtbilanz";
    gesamtbilanz.insertAdjacentElement("afterbegin", ueberschrift);

    let einnahmen_zeile = document.createElement("div");
    einnahmen_zeile.setAttribute("class", "gesamtbilanz-zeile einnahmen");
    let einnahmen_titel = document.createElement("span");
    einnahmen_titel.textContent = "Einnahmen:";
    einnahmen_zeile.insertAdjacentElement("afterbegin", einnahmen_titel);
    let einnahmen_betrag = document.createElement("span");
    einnahmen_betrag.textContent = `${(this.gesamtbilanz.get("einnahmen")/100).toFixed(2).replace(/\./, ",")} €`;
    einnahmen_zeile.insertAdjacentElement("beforend", einnahmen_betrag);
    gesamtbilanz.insertAdjacentElement("beforeend", einnahmen_zeile);

     let ausgaben_zeile = document.createElement("div");
     ausgaben_zeile.setAttribute("class", "gesamtbilanz-zeile ausgaben");
     let ausgaben_titel = document.createElement("span");
     ausgaben_titel.textContent = "Ausgaben:";
     ausgaben_zeile.insertAdjacentElement("afterbegin", ausgaben_titel);  
     let ausgaben_betrag = document.createElement("span");
     ausgaben_betrag.textContent = `${(this.gesamtbilanz.get("ausgaben")/100).toFixed(2).replace(/\./, ",")} €`;
     ausgaben_zeile.insertAdjacentElement("beforend", ausgaben_betrag);
     gesamtbilanz.insertAdjacentElement("beforeend", ausgaben_zeile);
    
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
    document.querySelectorAll("#gesamtbilanz").forEach(gesamtbilanz => 
      gesamtbilanz.remove());
    document.querySelector("body") .insertAdjacentElement("beforeend", this.html_gesamtbilanz_generieren());
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
        this.fehler = []; 
      }
      weiterer_eintrag = confirm("Weiteren Eintrag hinzufügen?");
    }
  },
};
