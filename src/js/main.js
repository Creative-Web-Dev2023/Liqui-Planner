"use strict";
// Gesamtbilanz anlegen
const haushaltsBuch = {
  gesamtBilanz: {
    einnahmen: 0,
    ausgaben: 0,
    bilanz: 0,
  },
  
  neuerEintrag: {
    titel: null,
    typ: null,
    betrag: null,
    datum: null,
  },

  eintrag_erfassen() {
    this.neuerEintrag.titel = prompt("Titel:");
    this.neuerEintrag.typ = prompt("Typ (Einahmen und Ausgaben:)");
    this.neuerEintrag.betrag = parseInt(prompt("Betrag (in Cent:)")); // um keine Kommazahlen zu verwenden
    this.neuerEintrag.datum = prompt("Datum (JJJJ-MM-TT:)");
  },

  eintrag_ausgeben() {
    console.log(`Title:${ this.neuerEintrag.titel}    
 Typ:${this.neuerEintrag.typ}
 Betrag:${ this.neuerEintrag.betrag} ct
 Datum:${ this.neuerEintrag.datum}`);
  },

  eintrag_mit_gesamtbilanz_verechnen(){
    switch(this.neuerEintrag.typ){
      case "Einahme":
        this.gesamtBilanz.einnahmen += this.neuerEintrag.betrag;
        this.gesamtBilanz.bilanz +=  this.neuerEintrag.betrag;
        break;
      case "Ausgabe" :
        this.gesamtBilanz.ausgaben +=this.neuerEintrag.betrag;
        this.gesamtBilanz.bilanz -=this.neuerEintrag.betrag;
        break;
      default:
        console.log(`der Typ "${this.neuerEintrag.typ}" ist nicht bekannt`);
        break;
    }
  },

  gesamtbilanz_ausgeben(){
    console.log(`Einahmen:${this.gesamtBilanz.einnahmen}ct
                   Ausgaben:${this.gesamtBilanz.ausgaben}ct
                   Bilanz:${this.gesamtBilanz.bilanz}ct
                   Bilanz ist positiv:${this.gesamtBilanz.bilanz >= 0}`);
  },
  eintrag_hinzufuegen(){
    this.eintrag_erfassen();
    this.eintrag_ausgeben();
    this.eintrag_mit_gesamtbilanz_verechnen();
    this.gesamtbilanz_ausgeben();
  }
};

haushaltsBuch.eintrag_hinzufuegen();
haushaltsBuch.eintrag_hinzufuegen();
haushaltsBuch.eintrag_hinzufuegen();
