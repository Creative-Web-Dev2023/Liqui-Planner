"use strict";

const haushaltsBuch = {
  gesamtBilanz: new Map(),
  eintraege: [],
  fehler : [],


  eintrag_erfassen() {
    let neuerEintrag = new Map();
    neuerEintrag.set("titel",this.titelVerarbeiten(prompt("Titel:").trim()));
    neuerEintrag.set("typ",this.typVerarbeiten (prompt("Typ (Einahmen und Ausgaben:)").trim()));
    neuerEintrag.set("betrag",this.betragVerarbeiten(prompt("Betrag (in Euro, ohne €-Zeichen:)")));
    neuerEintrag.set("datum",this.datumVerarbeiten(prompt("Datum (JJJJ-MM-TT:)")));
    neuerEintrag.set("timespamp", Date.now());
    

    if (this.fehler.length === 0) {
    this.eintraege.push(neuerEintrag);
       }else {
    console.log("Folgenden Fehler wurden gefunden:");
    this.fehler.forEach(function(fehler) {
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
    if(titel !== "") {
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
    if(typ.match(/^(?:einnahmen|ausgabe)$/) !== null) {
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
    if(betrag.match(/^\d{4}-\d{2}-\d{2}$/) !== null) {
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
    if(datum.match(/ / )!== null) {
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

  eintraege_ausgeben() {
    console.clear();
    this.eintraege.forEach(function (eintrag) {
      console.log(
        `Title:${eintrag.get("titel")}\n` +
          `Typ: ${eintrag.get("typ")}\n` +
          `Betrag: ${(eintrag.get("betrag") / 100).toFixed(2)} €\n` +
          `Datum: ${eintrag.get("datum").toLocaleDateString("de-DE", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
          })}\n`
      );
    });
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

  gesamtbilanz_ausgeben() {
    console.log(
      `Einahmen:${this.gesamtBilanz.get("einnahmen")}ct\n` +
        `Ausgaben:${(this.gesamtBilanz.get("ausgaben") / 100).toFixed(2)} €\n` +
        `Bilanz:${(this.gesamtBilanz.get("bilanz") / 100).toFixed(2)} €\n` +
        `Bilanz ist positiv:${this.gesamtBilanz.get("bilanz") / 100 >= 0}`
    );
  },

  eintrag_hinzufuegen() {
    let weiterer_eintrag = true;
    while (weiterer_eintrag) {
      this.eintrag_erfassen();
      if(this.fehler.length ===0){
      this.eintraege_sortieren();
      this.eintraege_ausgeben();
      this.gesamtbilanz_erstellen();
      this.gesamtbilanz_ausgeben();
    } else {
      this.fehler =[];  // Fehler löschen
    }
      weiterer_eintrag = confirm("Weiteren Eintrag hinzufügen?");
    }
  },
};

haushaltsBuch.eintrag_hinzufuegen();
console.log(haushaltsBuch);
