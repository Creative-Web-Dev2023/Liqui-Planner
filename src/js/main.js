"use strict";

const haushaltsBuch = {
  gesamtBilanz: {
    einnahmen: 0,
    ausgaben: 0,
    bilanz: 0,
  },

  neuereintrag: {
    titel: null,
    typ: null,
    betrag: null,
    datum: null,
  },
  eintraege: [],

  eintrag_erfassen() {
    this.eintraege.push(
      {
      titel: prompt("Titel:"),
      typ: prompt("Typ (Einahmen und Ausgaben:)"),
      betrag: parseInt(prompt("Betrag (in Cent:)")),
      datum: prompt("Datum (JJJJ-MM-TT:)")
      }
    );
  },

  eintraege_sortieren(){
    this.eintraege.sort(function(eintrag_a, eintrag_b){
       if (eintrag_a.datum > eintrag_b.datum){
           return -1;
       } else if (eintrag_a.datum < eintrag_b.datum){
           return 1;
       }else {
          return 0;
       }
    });
  },


    eintraege_ausgeben() {
      console.clear();
      this.eintraege.forEach(function(eintrag){
        console.log(`Title:${ eintrag.titel}\n`
                    +`Typ: ${eintrag.typ}\n`
                    +`Betrag: ${eintrag.betrag} ct\n`
                    + `Datum: ${eintrag.datum}`
       );
      });
    },

    gesamtbilanz_erstellen(){
      let neue_gesamtBilanz = {
        einnahmen: 0,
        ausgaben:0,
        bilanz:0
      };
      this.eintraege.forEach(function(eintrag){
        switch(eintrag.typ){
          case "Einahme":
            this.neue_gesamtBilanz.einnahmen += eintrag.betrag;
            this.neue_gesamtBilanz.bilanz += eintrag.betrag;
            break;
          case "Ausgabe" :
            this.neue_gesamtBilanz.ausgaben +=eintrag.betrag;
            this.neue_gesamtBilanz.bilanz -=eintrag.betrag;
            break;
          default:
            console.log(`der Typ "${eintrag.typ}" ist nicht bekannt`);
            break;
        }
      })  ;
      this.gesamtBilanz = neue_gesamtBilanz;
    },

    gesamtbilanz_ausgeben(){
      console.log(`Einahmen:${this.gesamtBilanz.einnahmen}ct\n`
                  +`Ausgaben:${this.gesamtBilanz.ausgaben}ct\n`
                  +`Bilanz:${this.gesamtBilanz.bilanz}ct\n`
                  +`Bilanz ist positiv:${this.gesamtBilanz.bilanz >= 0}`
                );
    },

  eintrag_hinzufuegen() {
    let weiterer_eintrag =true;
    while(weiterer_eintrag){
      this.eintrag_erfassen();
      this.eintraege_sortieren();
      this.eintraege_ausgeben();
      this.gesamtbilanz_erstellen();
      this.gesamtbilanz_ausgeben();
      weiterer_eintrag = confirm ("Weiteren Eintrag hinzufügen?");
    }  
  },
};

haushaltsBuch.eintrag_hinzufuegen();
console.log(haushaltsBuch);

