"use strict";

class Haushaltsbuch {

    constructor() {
        this._eintraege = [];
        this.navigationsleiste = new Navigationsleiste();
        this.eingabeformular = new Eingabeformular();
        this._monatslistensammlung = new Monatslistensammlung();
        this._gesamtbilanz = new Gesamtbilanz();
        console.log(this);
    }

    eintrag_hinzufuegen(formulardaten) {
        let neuer_eintrag = new Eintrag(
            formulardaten.titel, 
            formulardaten.betrag,
            formulardaten.typ, 
            formulardaten.datum);
        this._eintraege.push(neuer_eintrag);
        this._monatslistensammlung.aktualisieren(this._eintraege);
        this._gesamtbilanz.aktualisieren(this._eintraege);
    
    }

    eintrag_entfernen(timestamp) {
        let start_index;
        for (let i = 0; i < this._eintraege.length; i++) {
            if (this._eintraege[i].timestamp() === parseInt(timestamp)) {
                start_index = i;
                break;
            }
        }
        this._eintraege.splice(start_index, 1);
        this._monatslistensammlung.aktualisieren(this._eintraege);
        this._gesamtbilanz.aktualisieren(this._eintraege);
       
    }
   start(){
    this.navigationsleiste.anzeigen();
    this.eingabeformular.anzeigen();
    this._monatslistensammlung.anzeigen();  
    this._gesamtbilanz.anzeigen();
    }
    
    
}