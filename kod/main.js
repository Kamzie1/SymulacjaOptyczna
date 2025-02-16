//import
import { kontener, ctx, SZEROKOSC, WYSOKOSC, j, zaladujAktualneId, zaladujWstazke, id_Obiektu, wstazka} from './dane.js';

import {SoczewkaSkupiajaca, Promien } from './klasy.js';

import {rysuj} from './rysuj.js';

"use strict";

let pokazOgniskowe = 0;
let pokazGrid = 0;
let N1 = 1;
let os_Optyczna;

function zaladujOgniskowe(){
    if(localStorage.getItem('pokazOgniskowe'))
    {
        pokazOgniskowe = localStorage.getItem('pokazOgniskowe');
    }
}

function zaladujGrid(){
    if(localStorage.getItem('pokazGrid'))
    {
        pokazGrid = localStorage.getItem('pokazGrid');
    }
}

function zaladujN1(){
    if(localStorage.getItem('N1'))
    {
            N1 = localStorage.getItem('N1');
    }
}

function usunLocalStorage(){
    if (!sessionStorage.getItem("sessionVisit")) {
        localStorage.clear();
        sessionStorage.setItem("sessionVisit", "true");
        main();
    } 
}

function zaladujOs(){
    if(localStorage.getItem('os_Optyczna'))
    {
        os_Optyczna = JSON.parse(localStorage.getItem('os_Optyczna'));
        os_Optyczna = os_Optyczna.map(obj => {
            if (obj._typ === "SoczewkaSkupiajaca") return Object.assign(new SoczewkaSkupiajaca(), obj);
            if (obj._typ === "Promien") return Object.assign(new Promien(), obj);
    });
    }
    else
    {
        os_Optyczna =[];
        localStorage.setItem('os_Optyczna', JSON.stringify(os_Optyczna));
    }
}

/// Główna pętla

main();

function main(){

    usunLocalStorage();
    zaladujAktualneId();
    zaladujWstazke();
    zaladujOs();
    zaladujGrid();
    zaladujN1();
    zaladujOgniskowe();

    wyswietlWstazke(wstazka, id_Obiektu);

    rysuj();
}

/// Event listenery 

document.getElementById('Opcja-symulacji').addEventListener('click', function() {
    wyswietlWstazke("SYMULACJA", id_Obiektu);
});

document.getElementById('Opcja-tworzenia').addEventListener('click', function() {
    wyswietlWstazke("TWORZENIE", id_Obiektu);
});

document.getElementById('zamknij').addEventListener('click', function() {
    ukryjOknoZaawansowane();
});

document.getElementById('Policz').addEventListener('click', function(){
    policz();
});

/// Funckje symulacji

function uruchomSymulacje(){
    zaladujOs();
    let zrodla_swiatla = os_Optyczna.filter(obj => (!obj.filter()));
    for(let i=0;i<zrodla_swiatla.length;i++){
        zrodla_swiatla[i].Symuluj();
    }
}


/// Funkcje obsługi wstążek

function wyswietlWstazke(wstazka, id_Obiektu){

    localStorage.setItem('wstazka', wstazka);

    if(id_Obiektu!=-1){
        zaladujWstazkeWlasciwosci();
    }
    if(wstazka=="SYMULACJA")
    {
        document.getElementById('Opcja-symulacji').style.boxShadow = "0px 0px 2px 0px black inset";
        document.getElementById('Opcja-tworzenia').style.boxShadow = "";
        zaladujSymulacje();
    }
    else if(wstazka=="TWORZENIE")
    {
        document.getElementById('Opcja-tworzenia').style.boxShadow = "0px 0px 2px 0px black inset";
        document.getElementById('Opcja-symulacji').style.boxShadow = "";
        zaladujTworzenie();
    }
    else{
        document.getElementById('Opcja-symulacji').style.boxShadow = "";
        document.getElementById('Opcja-tworzenia').style.boxShadow = "";
        zaladujAktualneId();
        console.log("os_Optyczna:", os_Optyczna);
        console.log("id:", id_Obiektu);
        console.log("os_Optyczna[id]:", os_Optyczna[id_Obiektu]);
        console.log("os_Optyczna[id].wyswietl:", os_Optyczna[id_Obiektu]?.wyswietl(id_Obiektu));

        zaladujWlasciwosci(id_Obiektu);
    }
}

/// Funckje obsługi Symulacji

function zaladujSymulacje(){

    wypelnijSymulacje();
    
    wypelnijListeObiektow();

    obsluzElementyPomocnicze();

    dodajEventSymulacji();
}

function wypelnijSymulacje(){
    let Symulacja = `<div class="sterowanie" id="sterowanie">
    <div class="kontener-przyciskow">
        <button class="uruchom" id="uruchom"> <img src="img/uruchom.png" width="100%" height="100%"> <span class="span-przycisk">Uruchom</span></button> 
        <button class="reset" id="reset"><img src="img/reset.png" width="100%" height="100%"> <span  class="span-przycisk">Reset</span></button> 
        <button class="wyczysc" id="wyczysc"><img src="img/wyczysc.png" width="100%" height="100%"> <span  class="span-przycisk">Wyczyść</span></button>
    </div>
    <span>Sterowanie</span>
</div>
<div class="pokazywanie">
     <div class="kontener-przyciskow">
        <button class="pokaz-ogniskowe" id="pokaz-ogniskowe"> <img id="pokaz-ogniskowe-img" src="img/pokaz-ogniskowe.png" width="100%" height="100%"> <span  class="span-przycisk" id="pokaz-ogniskowe-span"></span></button>
        <button class="pokaz-grid" id="pokaz-grid">  <img id="pokaz-grid-img" src="img/pokaz-grid.png" width="100%" height="100%"> <span  class="span-przycisk" id="pokaz-grid-span"></span></button>
    </div>
    <span>Widok</span>
</div>
<div class="material">
    <form class="osrodek">
        <label for="N1">N1:</label>
        <input type="number" id="N1" placeholder="podaj N1:" value="${N1}">
    </form>
    <span>Ośrodek</span>
</div>
<div class="obiekty" id="obiekty">
    <div class="kontener-listy">
        <div class="lista-obiektow" id="lista-obiektow"></div>
    </div>
    <span>Obiekty</span>
</div>`;
    kontener.innerHTML=Symulacja;
}

function wypelnijListeObiektow(){
    document.getElementById('lista-obiektow').innerHTML='';
    for(let i=0;i<os_Optyczna.length;i++)
    {
        dodajPrzycisk(i);
    }
}

function obsluzElementyPomocnicze(){
        
    if(pokazGrid==1)
        {
            document.getElementById('pokaz-grid-img').src = "img/schowaj-grid.png";
            document.getElementById('pokaz-grid-span').innerText = "Schowaj siatkę";
        }
        else if(pokazGrid==0)
        {
            document.getElementById('pokaz-grid-img').src = "img/pokaz-grid.png";
            document.getElementById('pokaz-grid-span').innerText = "Pokaż siatkę";
        }
        if(pokazOgniskowe==1)
        {
            document.getElementById('pokaz-ogniskowe-img').src = "img/schowaj-ogniskowe.png";
            document.getElementById('pokaz-ogniskowe-span').innerText = "Schowaj ogniskowe";
        }
        else if(pokazOgniskowe==0)
        {
            document.getElementById('pokaz-ogniskowe-img').src = "img/pokaz-ogniskowe.png";
            document.getElementById('pokaz-ogniskowe-span').innerText = "Pokaż ogniskowe";
        }
}

function dodajEventSymulacji(){
    document.getElementById('wyczysc').addEventListener('click', function(){
        wyczysc();
    });

    document.getElementById('pokaz-ogniskowe').addEventListener('click', function(){
        obsluzOgniskowe();
    });

    document.getElementById('pokaz-grid').addEventListener('click', function(){
        obsluzGrid();
    });

    document.getElementById('uruchom').addEventListener('click', function(){
        uruchomSymulacje();
    });

    document.getElementById('reset').addEventListener('click', function(){
        rysuj();
    });

    document.getElementById('N1').addEventListener('input', function(){
        localStorage.setItem('N1', parseFloat(this.value) || 0);
    });
}

function obsluzOgniskowe(){
    if(pokazOgniskowe==1)
        {
            document.getElementById('pokaz-ogniskowe-img').src = "img/pokaz-ogniskowe.png";
            document.getElementById('pokaz-ogniskowe-span').innerText = "Pokaż ogniskowe";
            pokazOgniskowe = 0;
        }
        else if(pokazOgniskowe==0)
        {
                document.getElementById('pokaz-ogniskowe-img').src = "img/schowaj-ogniskowe.png";
                document.getElementById('pokaz-ogniskowe-span').innerText = "Schowaj ogniskowe";
                pokazOgniskowe=1;
        }
        localStorage.setItem('pokazOgniskowe', pokazOgniskowe);
        rysuj();
}

function obsluzGrid(){
    if(pokazGrid==1)
        {
            document.getElementById('pokaz-grid-img').src = "img/pokaz-grid.png";
            document.getElementById('pokaz-grid-span').innerText = "Pokaż siatkę";
            pokazGrid = 0;
        }
        else if(pokazGrid==0)
        {
            document.getElementById('pokaz-grid-img').src = "img/schowaj-grid.png";
            document.getElementById('pokaz-grid-span').innerText = "Schowaj siatkę";
            pokazGrid=1;
        }
        localStorage.setItem('pokazGrid', pokazGrid);
        rysuj();
}

function wyczysc(){
    os_Optyczna=[];
    localStorage.setItem('os_Optyczna', JSON.stringify(os_Optyczna));
    localStorage.setItem('id_Obiektu', -1);
    usunWstazkeWlasciwosci();
    main();
}

function dodajPrzycisk(id){
    let przycisk = document.createElement("button");
    przycisk.innerText = `${id} : ${os_Optyczna[id].nazwa}`;
    przycisk.classList.add("przyciskObiektu");

    let usun = document.createElement("button");
    let img = document.createElement("img");

    if(window.innerWidth>800&&window.innerHeight>400){
        img.src = "img/usun.png";
    
        img.classList.add("imgUsun");
    
        usun.appendChild(img);
    }
    usun.classList.add("przyciskUsun");

    usun.onclick = function(){
        usunObject(id);
    }

    przycisk.onclick = function(){
        localStorage.setItem('id_Obiektu', id);
        wyswietlWstazke("WŁAŚCIWOŚCI", id);
        rysuj();
    }

    let objectHolder = document.createElement("div");
    objectHolder.classList.add("objectHolder");
    
    objectHolder.appendChild(przycisk);
    objectHolder.appendChild(usun);


    document.getElementById('lista-obiektow').appendChild(objectHolder);
}

/// Funkcje obsługi Tworzenia

function zaladujTworzenie(){

    wypelnijTworzenie();

    dodajEventTworzenia();
}

function wypelnijTworzenie(){
    let Tworzenie = `<div class='soczewki'>
                    <div class="kontener-przyciskow">
                        <button class='skupiajaca' id='skupiajaca'><img height=100% width=100% src="img/skupiajaca.png"><span class="span-przycisk">Skupiająca</span></button>
                    </div>
                    <span>Soczewki</span>
                </div>
                <div class='zrodla-swiatla'>
                    <div class="kontener-przyciskow">
                        <button class='promien-swietlny' id='promien-swietlny'><img height=100% width=100% src="img/promien-swietlny.png"><span class="span-przycisk">Promień</span></button>
                    </div>
                    <span>Żródła światła</span>
                </div>`;
    kontener.innerHTML= Tworzenie;
}

function dodajEventTworzenia(){
    document.getElementById('skupiajaca').addEventListener('click', function(){
        let nowyObiekt = new SoczewkaSkupiajaca(); 
        nowyObiekt._id = os_Optyczna.length;
    
        localStorage.setItem('id_Obiektu', os_Optyczna.length);
        os_Optyczna.push(nowyObiekt);
    
        localStorage.setItem('os_Optyczna', JSON.stringify(os_Optyczna));
        wyswietlWstazke("WŁAŚCIWOŚCI", os_Optyczna.length - 1);
        rysuj();
    });
    
    document.getElementById('promien-swietlny').addEventListener('click', function(){
        let nowyObiekt = new Promien(); 
        nowyObiekt._id = os_Optyczna.length;
    
        localStorage.setItem('id_Obiektu', os_Optyczna.length);
        os_Optyczna.push(nowyObiekt);
    
        localStorage.setItem('os_Optyczna', JSON.stringify(os_Optyczna));
        wyswietlWstazke("WŁAŚCIWOŚCI", os_Optyczna.length - 1);
        rysuj();
    });
}

/// Funkcje obsługi Właściwości

function zaladujWstazkeWlasciwosci(){
    if(!document.getElementById('Opcja-wlasciwosci'))
    {
        tworzWstazkeWlasciwosci();
        dodajEventWstazkiWlasciwosci();
    }
}

function tworzWstazkeWlasciwosci(){
    const wlasciwosci = document.createElement("div");
    wlasciwosci.className = "Opcja-wlasciwosci";
    wlasciwosci.id = "Opcja-wlasciwosci";

    const p = document.createElement("p");
    const tekst = document.createTextNode("WŁAŚCIWOŚCI");

    p.appendChild(tekst);
    wlasciwosci.appendChild(p);
    document.getElementById('pasek_rodzaji').appendChild(wlasciwosci);

    document.getElementById('Opcja-symulacji').style.boxShadow = "";
    document.getElementById('Opcja-tworzenia').style.boxShadow = "";
}

function dodajEventWstazkiWlasciwosci(){
    document.getElementById('Opcja-wlasciwosci').addEventListener('click', function() {
        zaladujAktualneId();
        wyswietlWstazke("WŁAŚCIWOŚCI", id_Obiektu);
    });
}

function usunWstazkeWlasciwosci(){
    if(document.getElementById('Opcja-wlasciwosci'))
    {
        document.getElementById('Opcja-wlasciwosci').remove();
    }
}

function zaladujWlasciwosci(id){
    os_Optyczna[id].wyswietl(id);
}

function policz(){
    zaladujAktualneId();
    zaladujN1();
    zaladujOs();
    let R1, R2, Ns;

    if(sprawdzZgodnoscDanych(parseFloat(document.getElementById('R1').value) || 0 ,  "R")){
        R1 = parseFloat(document.getElementById('R1').value) || 0;
    }
    else{
        return;
    }

    if(sprawdzZgodnoscDanych(parseFloat(document.getElementById('R2').value) || 0 ,  "R")){
        R2 = parseFloat(document.getElementById('R2').value) || 0;
    }
    else{
        return;
    }

    if(sprawdzZgodnoscDanych(parseFloat(document.getElementById('Ns').value) || 0 ,  "N")){
        Ns = parseFloat(document.getElementById('Ns').value) || 0;
    }
    else{
        return;
    }
    if(Ns==N1)  return;

    if(R1==-R2) return;

    if(sprawdzZgodnoscDanych(1/(((1/R1)+(1/R2))*((Ns/N1)-1)), "F")){
        os_Optyczna[id_Obiektu].F = 1/(((1/R1)+(1/R2))*((Ns/N1)-1));
    }
    else{
        return;
    }

    localStorage.setItem('os_Optyczna', JSON.stringify(os_Optyczna));
    ukryjOknoZaawansowane();

    main();
}

function ukryjOknoZaawansowane(){
    document.getElementById('okno-zaawansowane').style.display = "none";

    document.getElementById('R1').value="";
    document.getElementById('R2').value="";
    document.getElementById('Ns').value="";
}

