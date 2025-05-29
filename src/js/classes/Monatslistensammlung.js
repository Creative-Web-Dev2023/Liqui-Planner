"use strict";


//  <section id="monatslisten">
      
// </section>
class Monatslistensammlung {
    constructor() {
        this._monatslisten = [];
        this._html = this._html_generieren();
    }

eintrag_hinzufuegen(eintrag, ){
    //Werte für MOnat und Jahr holen
    let eintragsmonat = eintrag.datum().toLocaleString("de-DE", { month: "numeric" });
    let eintragsjahr = eintrag.datum().toLocaleString("de-DE", { year: "numeric" });
    // prüfen ob MOnatsliste schon vorhanden ist
    let monatsliste_vorhanden = false;
    this._monatslisten.forEach(monatsliste => {
        if(eintragsmonat === monatsliste.monat() && eintragsjahr === monatsliste.jahr()){
          monatsliste.eintrag_hinzufuegen(eintrag);
          monatsliste_vorhanden = true;
           
        }
    });
    if(!monatsliste_vorhanden){
        this. _monatsliste_hinzufuegen();
    }
    // wenn ja, dann Eintrag hinzufügen 
    // wenn nein, dann neue Monatsliste erstellen und Eintrag hinzufügen
}

_monatsliste_hinzufuegen() {

}



    anzeigen(){
        
    }
}