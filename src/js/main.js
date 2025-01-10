"use strict";
// Gesamtbilanz anlegen
let einnahmen = 0,
    ausgaben = 0,
    bilanz = 0,
    titel,typ, betrag, datum;

const eintrag_erfassen = function () {
  titel = prompt("Titel:");
  typ = prompt("Typ (Einahmen und Ausgaben:)");
  betrag = parseInt(prompt("Betrag (in Cent:)")); // um keine Kommazahlen zu verwenden
  datum= prompt("Datum (JJJJ-MM-TT:)");
};

const eintrag_ausgeben = function (titel, typ, betrag, datum) {
     console.log(`Title:${titel}    
       Typ:${typ}
       Betrag:${betrag} ct
       Datum:${datum}`
      );
}

const eintrag_mit_gesamtbilanz_verechnen = function ( typ, betrag) {
      if (typ === "Einahme") {
         einnahmen = einnahmen + betrag;
         bilanz = bilanz + betrag;
     } else if (typ === "Ausgabe") {
         ausgaben = ausgaben + betrag;
        bilanz = bilanz - betrag;
    } else {
         console.log(`der Typ "${typ}" ist nicht bekannt`);
}
}

const  gesamtbilanz_ausgeben = function (einnahmen, ausgaben, bilanz) {
   let positiv = bilanz >= 0;
    console.log(`Einahmen:${einnahmen}ct
                 Ausgaben:${ausgaben}ct
                 Bilanz:${bilanz}ct
                 Bilanz ist positiv:${bilanz >= 0}`);
}

const eintrag_hinzufuegen = function () {
    eintrag_erfassen();
    eintrag_ausgeben(titel, typ, betrag, datum);
    eintrag_mit_gesamtbilanz_verechnen(typ, betrag);
    gesamtbilanz_ausgeben(einnahmen, ausgaben, bilanz);
}
eintrag_hinzufuegen();
eintrag_hinzufuegen();