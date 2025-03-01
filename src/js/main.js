"use strict";

const haushaltsBuch = {
  gesamtBilanz: new Map(),

  eintraege: [],

  eintrag_erfassen() {
    let neuerEintrag = new Map();
    neuerEintrag.set("titel", prompt("Titel:"));
    neuerEintrag.set("typ", prompt("Typ (Einahmen und Ausgaben:)"));
    neuerEintrag.set("betrag", parseInt(prompt("Betrag (in Cent:)")));
    neuerEintrag.set("datum", prompt("Datum (JJJJ-MM-TT:)"));
    this.eintraege.push(neuerEintrag);
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
          `Betrag: ${eintrag.get("betrag")} ct\n` +
          `Datum: ${eintrag.get("datum")}`
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
        case "Einahme":
          neue_gesamtBilanz.set("einnahmen", neue_gesamtBilanz.get("einnahmen") + eintrag.get("betrag"));
          neue_gesamtBilanz.set("bilanz", neue_gesamtBilanz.get("bilanz") + eintrag.get("betrag"));
          break;
        case "Ausgabe":
          neue_gesamtBilanz.set("ausgaben", neue_gesamtBilanz.get("ausgaben") + eintrag.get("betrag"));
          neue_gesamtBilanz.set("bilanz", neue_gesamtBilanz.get("bilanz") - eintrag.get("betrag"));
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
        `Ausgaben:${this.gesamtBilanz.get("ausgaben")}ct\n` +
        `Bilanz:${this.gesamtBilanz.get("bilanz")}ct\n` +
        `Bilanz ist positiv:${this.gesamtBilanz.get("bilanz") >= 0}`
    );
  },

  eintrag_hinzufuegen() {
    let weiterer_eintrag = true;
    while (weiterer_eintrag) {
      this.eintrag_erfassen();
      this.eintraege_sortieren();
      this.eintraege_ausgeben();
      this.gesamtbilanz_erstellen();
      this.gesamtbilanz_ausgeben();
      weiterer_eintrag = confirm("Weiteren Eintrag hinzufügen?");
    }
  },
};

haushaltsBuch.eintrag_hinzufuegen();
console.log(haushaltsBuch);
