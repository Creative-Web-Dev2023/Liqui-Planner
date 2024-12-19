"use strict";
// Gesamtbilanz anlegen
let einnahmen = 0;
let ausgaben = 0;
let bilanz = 0;

//Eingabedaten holen
let titel_1 = prompt("Titel:");
let typ_1 = prompt("Typ (Einahmen und Ausgaben:)");
let betrag_1 = parseInt(prompt("Betrag (in Cent:)")); // um keine Kommazahlen zu verwenden
let datum_1 = prompt("Datum (JJJJ-MM-TT:)");

console.log(`Title:${titel_1}    
Typ:${typ_1}
Betrag:${betrag_1} ct
Datum:${datum_1}`);

if (typ_1 === "Einahme") {
  einnahmen = einnahmen + betrag_1;
  bilanz = bilanz + betrag_1;
} else if (typ_1 === "Ausgabe") {
  ausgaben = ausgaben + betrag_1;
  bilanz = bilanz - betrag_1;
} else {
  console.log(`der Typ "${typ_1}" ist nicht bekannt`);
}

let titel_2 = prompt("Titel:");
let typ_2 = prompt("Typ {Einahmen und Ausgaben:}");
let betrag_2 = parseInt(prompt("Betrag {in Cent:}")); // um keine Kommazahlen zu verwenden
let datum_2 = prompt("Datum {JJJJ-MM-TT:}");

console.log(`Title:${titel_2}
Typ:${typ_2}
Betrag:${betrag_2} ct
Datum:${datum_2}`);

if (typ_2 === "Einahme") {
    einnahmen = einnahmen + betrag_2;
    bilanz = bilanz + betrag_2;
  } else if (typ_2 === "Ausgabe") {
    ausgaben = ausgaben + betrag_2;
    bilanz = bilanz - betrag_2;
  } else {
    console.log(`der Typ "${typ_2}" ist nicht bekannt`);
  }

//Gesamtbilanz ausgeben
let positiv = bilanz >= 0;

console.log(`Einahmen:${einnahmen}ct
Ausgaben:${ausgaben}ct
Bilanz:${bilanz}ct
Bilanz ist positiv:${positiv}`);
