"use strict";

/* <article class="monatsliste">
     
          <h2>
                <span class="monat-jahr">Februar 2020</span>
                <span class="monatsbilanz negativ">-326,84€</span>
            </h2> 
              <ul>
                <li> </li>
                 <li> </li>
              </ul>
 </article>*/

class Monatsliste {

  constructor(jahr, monat, eintraege) {
    this._jahr = jahr;
    this._monat = monat;
    this._eintraege = [];
    this._bilanz = 0;
    this._html = this._html_generieren();
  }

  monat(){
    return this._monat;
  }

  jahr(){
    return this._jahr;
  }

 eintrag_hinzufuegen(eintrag){
   this._eintraege.push(eintrag);
 }
  //  _eintraege_sortieren() {
  //       this._eintraege.sort((eintrag_a, eintrag_b) => {
  //           return eintrag_a.datum()> eintrag_b.datum() ? -1 : eintrag_a.datum() < eintrag_b.datum() ? 1 : 0;
  //       });
  //   }

   _eintraege_anzeigen() {
        document.querySelectorAll(".monatsliste ul").forEach(eintragsliste => eintragsliste.remove());
        let eintragsliste = document.createElement("ul");
        this._eintraege.forEach(eintrag => eintragsliste.insertAdjacentElement("beforeend",eintrag.html()));
        document.querySelector(".monatsliste").insertAdjacentElement("afterbegin", eintragsliste);
    }

  _html_generieren(){
    
  }
}
