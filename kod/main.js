/// Canvas

let canvas = document.getElementById('canvas');
canvas.style.display='block';
canvas.style.width='100%';
canvas.style.height='100%';
let WYSOKOSC = canvas.height=canvas.offsetHeight;
let SZEROKOSC = canvas.width=canvas.offsetWidth;
let j = 50;
const ctx = canvas.getContext("2d");

canvas.addEventListener("click", (event) => {
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    
    sprawdzWspolrzedne(x, y);
});


/// zmienne globalne

const soczewkaSkupiajaca = {nazwa: "SoczS", typ: "SoczS", wspx: SZEROKOSC/2, h: WYSOKOSC/4, F: 100, id: 0, P:0};
const promienSwietlny = {nazwa: "PromS", typ: "PromS", wspx: SZEROKOSC/4, wspy: WYSOKOSC/3, alfa: 0, id: 0};

let os_Optyczna;
let wstazka="SYMULACJA";
let id_Obiektu=-1;
let pokazOgniskowe = 0;
let pokazGrid = 0;
let N1 = 1;

const margines = 10;
const kontener = document.getElementById("trescWstazki");

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
    wyswietlWstazke(wstazka);
    dodawanieEventListener();

    rysuj();
}

/// Funkcje odświeżania

function usunLocalStorage(){
    if (!sessionStorage.getItem("sessionVisit")) {
        localStorage.removeItem('wstazka');
        localStorage.removeItem('os_Optyczna');
        localStorage.removeItem('id_Obiektu');
        localStorage.removeItem('pokazOgniskowe');
        localStorage.removeItem('pokazGrid');
        localStorage.removeItem('N1');
        sessionStorage.setItem("sessionVisit", "true");
        main();
    } 
}

function odswiez_os_optyczna(){
    zaladujOs();
    for(let i=0;i<os_Optyczna.length;i++)
    {
        os_Optyczna[i].id = i;
    }
    localStorage.setItem('os_Optyczna', JSON.stringify(os_Optyczna));
}

function zaladujAktualneId(){
    if(localStorage.getItem('id_Obiektu'))
        {
            id_Obiektu = localStorage.getItem('id_Obiektu');
        }
}

function zaladujOs(){
    if(localStorage.getItem('os_Optyczna'))
    {
            os_Optyczna = JSON.parse(localStorage.getItem('os_Optyczna'));
    }
    else
    {
        os_Optyczna =[];
        localStorage.setItem('os_Optyczna', JSON.stringify(os_Optyczna));
    }
}

function zaladujWstazke()
{
    if(localStorage.getItem('wstazka'))
    {
        wstazka = localStorage.getItem('wstazka');
    }
}

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

/// Funckje symulacji

function filterOptyki(object){
    return object.typ == "SoczS";
}

function filterZrodlaSwiatla(object){
    return object.typ == "PromS";
}

function uruchomSymulacje(){
    zaladujOs();
    let zrodla_swiatla = os_Optyczna.filter(filterZrodlaSwiatla);
    for(let i=0;i<zrodla_swiatla.length;i++){
        Symuluj(zrodla_swiatla[i].wspx, zrodla_swiatla[i].wspy, zrodla_swiatla[i].alfa, os_Optyczna);
    }
}

function wZasiegu(wspx, h, P, xo, kierunek){
    if(kierunek==1){
        if(wspx<=xo)    return false;
    }
    else{
        if(wspx>=xo)    return false;
    }
    if(WYSOKOSC/2+h<P)  return false;
    if(WYSOKOSC/2-h>P)  return false;
    return true;
}

function Symuluj(wspx, wspy, alfa, os_Optyczna){
    let obiektyOptyczne = os_Optyczna.filter(filterOptyki);
    console.log(obiektyOptyczne);
    let a, b, xo, yo, y_pomo, b_pomo, kierunek;

    if(alfa-360*Math.floor(alfa/360)<=270&&alfa-360*Math.floor(alfa/360)>=90){
        kierunek=-1;
    }
    else{
        kierunek=1;
    }

    xo = wspx;
    yo = wspy;

    a = Math.tan((Math.PI/180*(180-alfa)));
    b = yo-a*xo;

    ctx.beginPath();
    ctx.lineWidth=2;
    ctx.moveTo(xo, yo);

    while(true){
        let min = SZEROKOSC+100;
        let min_id = -1;
        for(let i=0;i<obiektyOptyczne.length;i++){
            obiektyOptyczne[i].P = a*obiektyOptyczne[i].wspx + b;

            if(!wZasiegu(obiektyOptyczne[i].wspx, obiektyOptyczne[i].h, obiektyOptyczne[i].P, xo, kierunek)){
                continue;
            }

            if(Math.abs(xo-obiektyOptyczne[i].wspx)<min){
                min = xo-obiektyOptyczne[i].wspx;
                min_id = i;
                console.log(min_id);
            }
        }

        if(min_id==-1){
            if(kierunek==1)
            {
                if(a<0)
                    ctx.lineTo(-b/a,0);
                else if(a==0)
                    ctx.lineTo(SZEROKOSC, b);
                else
                    ctx.lineTo( (WYSOKOSC-b)/a,WYSOKOSC);
            }
            else{
                if(a>0)
                    ctx.lineTo(-b/a,0);
                else if(a==0)
                    ctx.lineTo(0, b);
                else
                    ctx.lineTo( (WYSOKOSC-b)/a,WYSOKOSC);
            }
            ctx.stroke();
            break;
        }

        ctx.lineTo(obiektyOptyczne[min_id].wspx, obiektyOptyczne[min_id].P);
        xo = obiektyOptyczne[min_id].wspx;

        if(kierunek==1){
            b_pomo = WYSOKOSC/2 - a*(obiektyOptyczne[min_id].wspx - obiektyOptyczne[min_id].F);
            y_pomo = a*obiektyOptyczne[min_id].wspx + b_pomo;
    
            a = (y_pomo-obiektyOptyczne[min_id].P)/((obiektyOptyczne[min_id].wspx + obiektyOptyczne[min_id].F)-xo);
            b = y_pomo-a*(obiektyOptyczne[min_id].wspx + obiektyOptyczne[min_id].F);
        }
        else{
            b_pomo = WYSOKOSC/2 - a*(obiektyOptyczne[min_id].wspx + obiektyOptyczne[min_id].F);
            y_pomo = a*obiektyOptyczne[min_id].wspx + b_pomo;
    
            a = (y_pomo-obiektyOptyczne[min_id].P)/((obiektyOptyczne[min_id].wspx - obiektyOptyczne[min_id].F)-xo);
            b = y_pomo-a*(obiektyOptyczne[min_id].wspx - obiektyOptyczne[min_id].F);
        }

    }
}

/// Funckje rysowania

function rysuj(){
    ctx.clearRect(0, 0, SZEROKOSC, WYSOKOSC);
    
    rysuj_os();
    rysuj_obiekty();
    rysujObiektyPomocnicze();

    if(id_Obiektu!=-1){
        //rysujElementyKontrolne(id_Obiektu);
    }
}

function rysuj_soczS(id){
    if (!os_Optyczna[id]) return;

    ctx.beginPath();
    ctx.lineWidth=2;

    ctx.moveTo(os_Optyczna[id].wspx,WYSOKOSC/2-os_Optyczna[id].h);
    ctx.lineTo(os_Optyczna[id].wspx-10,WYSOKOSC/2-os_Optyczna[id].h+10)

    ctx.moveTo(os_Optyczna[id].wspx,WYSOKOSC/2-os_Optyczna[id].h);
    ctx.lineTo(os_Optyczna[id].wspx+10,WYSOKOSC/2-os_Optyczna[id].h+10)

    ctx.moveTo(os_Optyczna[id].wspx,WYSOKOSC/2-os_Optyczna[id].h)
    ctx.lineTo(os_Optyczna[id].wspx, WYSOKOSC/2+ os_Optyczna[id].h);

    ctx.lineTo(os_Optyczna[id].wspx-10,WYSOKOSC/2+os_Optyczna[id].h-10)
    ctx.moveTo(os_Optyczna[id].wspx,WYSOKOSC/2+os_Optyczna[id].h);
    ctx.lineTo(os_Optyczna[id].wspx+10,WYSOKOSC/2+os_Optyczna[id].h-10)

    ctx.stroke();
}

function rysuj_promS(id){
    let dl = 30;
    if (!os_Optyczna[id]) return;

    ctx.beginPath();
    ctx.lineWidth=2;

    ctx.moveTo(os_Optyczna[id].wspx, os_Optyczna[id].wspy);
    ctx.arc(os_Optyczna[id].wspx, os_Optyczna[id].wspy, 2, 0, Math.PI * 2, true);
    ctx.fill();

    ctx.moveTo(os_Optyczna[id].wspx, os_Optyczna[id].wspy);
    ctx.lineTo(os_Optyczna[id].wspx +dl*Math.cos(os_Optyczna[id].alfa*Math.PI/180), os_Optyczna[id].wspy - dl*Math.sin(os_Optyczna[id].alfa*Math.PI/180));

    ctx.stroke();
}

function rysuj_os(){
    ctx.beginPath();
    ctx.lineWidth=3;

    ctx.moveTo(0,WYSOKOSC/2);
    ctx.lineTo(SZEROKOSC, WYSOKOSC/2);

    ctx.stroke();
}

function rysuj_obiekty(){
    for(let i=0;i<os_Optyczna.length; i++)
        {
            if(os_Optyczna[i].typ=='SoczS')
            {
                rysuj_soczS(i);
            }
            else if(os_Optyczna[i].typ=='PromS')
            {
                rysuj_promS(i);
            }
        }
}

function rysujObiektyPomocnicze(){
    if(pokazOgniskowe==1)
    {
        rysujOgniskowe();
    }
    if(pokazGrid==1)
    {
        rysujGrid();
    }
}

function rysujGrid(){
    let odl=j;

    ctx.beginPath();

    rysujOsPionowa(odl);
    rysujOsPozioma(odl);

    ctx.stroke();
}

function rysujOsPionowa(odl){
    while(odl<=SZEROKOSC){

        ctx.moveTo(odl,WYSOKOSC/2);

        if(odl%100==0)
        {
            ctx.lineWidth=2;

            ctx.moveTo(odl,WYSOKOSC/2+7.5);
            ctx.lineTo(odl,WYSOKOSC/2-7.5);

            ctx.font = "0.8vw Arial";
            ctx.fillText(`${odl}`,odl,WYSOKOSC/2+7.5+15);
        }
        else{
            ctx.lineWidth=1;

            ctx.moveTo(odl,WYSOKOSC/2+3.75);
            ctx.lineTo(odl,WYSOKOSC/2-3.75);

            ctx.font = "0.6vw Arial";
            ctx.fillText(`${odl}`,odl,WYSOKOSC/2+7.5+12);
        }

        odl+=50;
    }
}

function rysujOsPozioma(odl){
    while(odl<=WYSOKOSC){

        ctx.moveTo(0,odl);

        if(odl%100==0)
        {
            ctx.lineWidth=2;

            ctx.lineTo(7.5,odl);

            ctx.font = "0.8vw Arial";
            ctx.fillText(`${odl}`,7.5+15,odl);
        }
        else{
            ctx.lineWidth=1;

            ctx.lineTo(3.75,odl);

            ctx.font = "0.6vw Arial";
            ctx.fillText(`${odl}`,3.75+12,odl);
        }
        odl+=50;
    }
}

function rysujOgniskowe(){
    ctx.beginPath();
    ctx.lineWidth=3;
    ctx.font = "1.5vw Arial bold";

    for(let i=0;i<os_Optyczna.length;i++){

        if(os_Optyczna[i].typ=="PromS") continue;

        ctx.moveTo(os_Optyczna[i].wspx-os_Optyczna[i].F, WYSOKOSC/2-10);
        ctx.lineTo(os_Optyczna[i].wspx-os_Optyczna[i].F, WYSOKOSC/2+10);

        ctx.fillText(`F${os_Optyczna[i].nazwa}`,os_Optyczna[i].wspx-os_Optyczna[i].F, WYSOKOSC/2+10+50);

        ctx.moveTo(os_Optyczna[i].wspx+os_Optyczna[i].F, WYSOKOSC/2-10);
        ctx.lineTo(os_Optyczna[i].wspx+os_Optyczna[i].F, WYSOKOSC/2+10);

        ctx.fillText(`F${os_Optyczna[i].nazwa}`,os_Optyczna[i].wspx+os_Optyczna[i].F, WYSOKOSC/2+10+50);
    }

    ctx.stroke();
}

function rysujElementyKontrolne(id){
    zaladujOs();
    if(os_Optyczna[id].typ=="PromS"){
        rysujElementyKontrolnePromienia(id);
    }
    else{
        rysujElementyKontrolneSoczewki(id);
    }
}

function rysujElementyKontrolnePromienia(id){

}

function rysujElementyKontrolneSoczewki(id){
    let wsp = os_Optyczna[id].wspx;
    ctx.beginPath();
    ctx.lineWidth=3;
    ctx.arc(wsp+30, WYSOKOSC/2-30, 10, 0, 360);
    ctx.fill();
    ctx.stroke();
}

/// Funkcje obsługi wstążek

function wyswietlWstazke(wstazka){
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
        zaladujWlasciwosci(id_Obiektu);
    }
}

function dodawanieEventListener(){
    document.getElementById('Opcja-symulacji').addEventListener('click', function() {
        wstazka = "SYMULACJA";
        localStorage.setItem('wstazka', wstazka);
        wyswietlWstazke(wstazka);
    });
    
    document.getElementById('Opcja-tworzenia').addEventListener('click', function() {
        wstazka = "TWORZENIE";
        localStorage.setItem('wstazka', wstazka);
        wyswietlWstazke(wstazka);
    });

    document.addEventListener("keydown", function(event) {
        if (event.key === "Escape") {
            document.getElementById('okno-zaawansowane').style.display = "none";
            main();
        }
    });
    
    
    document.getElementById('zamknij').addEventListener('click', function(){
        zaladujAktualneId();
        zaladujN1();
        zaladujOs();
        let R1, R2, Ns;

        if(sprawdzZgodnoscDanych(parseFloat(document.getElementById('R1').value) || 0 ,  "R")){
            R1 = document.getElementById('R1').value || 0;
        }
        else{
            return;
        }

        if(sprawdzZgodnoscDanych(parseFloat(document.getElementById('R2').value) || 0 ,  "R")){
            R2 = document.getElementById('R2').value || 0;
        }
        else{
            return;
        }

        if(sprawdzZgodnoscDanych(parseFloat(document.getElementById('Ns').value) || 0 ,  "N")){
            Ns = document.getElementById('Ns').value || 0;
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
        document.getElementById('okno-zaawansowane').style.display = "none";
        main();
    });
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
        <input type="text" id="N1" placeholder="podaj N1:" value="${N1}">
    </form>
    <span>Ośrodek</span>
</div>
<div class="lista-obiektow" id="lista-obiektow">

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

    przycisk.onclick = function(){
        localStorage.setItem('id_Obiektu', id);
        wyswietlWlasciwosci(id);
    }
    document.getElementById('lista-obiektow').appendChild(przycisk);
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
        zaktualizujOs(soczewkaSkupiajaca);
    });
    
    document.getElementById('promien-swietlny').addEventListener('click', function(){
        zaktualizujOs(promienSwietlny);
    });
}

function zaktualizujOs(obiekt) {    
    let nowyObiekt = { ...obiekt }; // Tworzenie nowego obiektu (płytka kopia)
    nowyObiekt.id = os_Optyczna.length;

    localStorage.setItem('id_Obiektu', os_Optyczna.length);
    os_Optyczna.push(nowyObiekt);

    localStorage.setItem('os_Optyczna', JSON.stringify(os_Optyczna));
    wyswietlWlasciwosci(os_Optyczna.length - 1);
    rysuj();
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
        wyswietlWlasciwosci(id_Obiektu);
    });
}

function usunWstazkeWlasciwosci(){
    if(document.getElementById('Opcja-wlasciwosci'))
    {
        document.getElementById('Opcja-wlasciwosci').remove();
    }
}

function wyswietlWlasciwosci(id){
    zaladujWstazkeWlasciwosci();
    wstazka = "WŁAŚCIWOŚCI";
    localStorage.setItem('wstazka', wstazka);
    document.getElementById('Opcja-symulacji').style.boxShadow = "";
    document.getElementById('Opcja-tworzenia').style.boxShadow = "";
    zaladujWlasciwosci(id);
}

function zaladujWlasciwosci(id){
    if(os_Optyczna[id].typ =="SoczS")
    {
        zaladujWlasciwosciSoczewki(id);
    }
    else if(os_Optyczna[id].typ =="PromS")
    {
        zaladujWlasciwosciPromienia(id);
    }
}

function zaladujWlasciwosciSoczewki(id){
    if (!os_Optyczna[id]) return;

    kontener.innerHTML=`<div class="dane">
                        <div class="kontener-przyciskow">
                        <div class='nazwa'>
                            <form>  
                                <label for='nazwa'>Nazwa: </label>
                                <input type='text' id='nazwa' placeholder='podaj nazwę:' value=${os_Optyczna[id].nazwa}>
                            </form>
                        </div>
                        <div class="wspx">
                            <form>
                                <label for='wspx'>Współrzędne: </label>
                                <input type='text' id='wspx' placeholder='podaj wspx:' value=${os_Optyczna[id].wspx}>
                            </form>
                        </div>
                        <div class ="h">
                            <form>
                                <label for='h'>Wysokość soczewki: </label>
                                <input type='text' id='h' placeholder='podaj h:' value=${os_Optyczna[id].h}
                            </form>
                        </div>
                        <div class='optyka' id='optyka'>
                            <form>
                                <label for='F'>F: </label>
                                <input type='text'' id='F' placeholder='podaj F:' value=${os_Optyczna[id].F}>
                            </form>
                        </div>
                        </div>
                        <span>Właściwości</span>
                        </div>
                        <div class='dod_przyciski' id='dod_przyciski'>
                            <div class="kontener-przyciskow">
                                <button class="F-zaawansowane" id="F-zaawansowane"><img height=100% width=100% src="img/zaawansowane.png"><span class="span-przycisk">Zaawansowane</span></button>
                                <button class="usun" id="usun"><img height=100% width=100% src="img/usun.png"><span class="span-przycisk">Usuń</span></button>
                            </div>
                            <span>Zaawansowane</span>
                        </div>`;
    EventSoczS(id);
}

function zaladujWlasciwosciPromienia(id){
    if (!os_Optyczna[id]) return;

    kontener.innerHTML=`<div class="dane">
                        <div class="kontener-przyciskow">
                        <div class='nazwa'>
                            <form>  
                                <label for='nazwa'>Nazwa: </label>
                                <input type='text' id='nazwa' placeholder='podaj nazwę:' value=${os_Optyczna[id].nazwa}>
                            </form>
                        </div>
                        <div class="wspx">
                            <form>
                                <label for='wspx'>Współrzędne x: </label>
                                <input type='text' id='wspx' placeholder='podaj wspx:' value=${os_Optyczna[id].wspx}>
                            </form>
                        </div>
                        <div class ="h">
                            <form>
                                <label for='wspy'>Współrzędne y: </label>
                                <input type='text' id='wspy' placeholder='podaj wspy:' value=${os_Optyczna[id].wspy}>
                            </form>
                        </div>
                        <div class='optyka' id='optyka'>
                            <form>
                                <label for='alfa'>Kąt: </label>
                                <input type='text'' id='alfa' placeholder='podaj kąt:' value=${os_Optyczna[id].alfa}>
                            </form>
                        </div>
                        </div>
                        <span>Właściwości</span>
                        </div>
                        <div class='dod_przyciski' id='dod_przyciski'>
                            <div class="kontener-przyciskow">
                                <button class="usun" id="usun"><img height=100% width=100% src="img/usun.png"><span class="span-przycisk">Usuń</span></button>
                            </div>
                            <span>Usuwanie</span>
                        </div>`;
    EventPromS(id);
}

function EventSoczS(id){
    document.getElementById('nazwa').addEventListener("input", function(){
        os_Optyczna[id].nazwa = this.value;
        localStorage.setItem('os_Optyczna', JSON.stringify(os_Optyczna));
        rysuj();
    });

    document.getElementById('wspx').addEventListener("input", function(){
        if(sprawdzZgodnoscDanych(parseFloat(this.value) || 0 ,  "wspx")){
            os_Optyczna[id].wspx = parseFloat(this.value) || 0;
        }
        localStorage.setItem('os_Optyczna', JSON.stringify(os_Optyczna));
        rysuj();
    });

    document.getElementById('h').addEventListener("input", function(){
        if(sprawdzZgodnoscDanych(parseFloat(this.value) || 0 ,  "h")){
            os_Optyczna[id].h = parseFloat(this.value) || 0;
        }
        localStorage.setItem('os_Optyczna', JSON.stringify(os_Optyczna));
        rysuj();
    });

    document.getElementById('F').addEventListener("input", function(){
        if(sprawdzZgodnoscDanych(parseFloat(this.value) || 0 ,  "F")){
            os_Optyczna[id].F = parseFloat(this.value) || 0;
        }
        localStorage.setItem('os_Optyczna', JSON.stringify(os_Optyczna));
        rysuj();
    });

    document.getElementById('usun').addEventListener("click", function(){
        wstazka = "SYMULACJA";
        localStorage.setItem('wstazka', wstazka);
        wyswietlWstazke(wstazka);
        os_Optyczna.splice(id, 1);
        localStorage.setItem('os_Optyczna', JSON.stringify(os_Optyczna));
        odswiez_os_optyczna();
        localStorage.setItem('id_Obiektu', -1);
        location.reload();
        rysuj();
    });

    document.getElementById('F-zaawansowane').addEventListener("click", function(){
        document.getElementById('okno-zaawansowane').style.display = "block";
    });
}

function EventPromS(id){

    document.getElementById('nazwa').addEventListener("input", function(){
        os_Optyczna[id].nazwa = this.value;
        localStorage.setItem('os_Optyczna', JSON.stringify(os_Optyczna));
        rysuj();
    });

    document.getElementById('wspx').addEventListener("input", function(){
        if(sprawdzZgodnoscDanych(parseFloat(this.value) || 0 ,  "wspx")){
            os_Optyczna[id].wspx = parseFloat(this.value) || 0;
        }
        localStorage.setItem('os_Optyczna', JSON.stringify(os_Optyczna));
        rysuj();
    });

    document.getElementById('wspy').addEventListener("input", function(){
        if(sprawdzZgodnoscDanych(parseFloat(this.value) || 0 ,  "wspy")){
            os_Optyczna[id].wspy = parseFloat(this.value) || 0;
        }
        localStorage.setItem('os_Optyczna', JSON.stringify(os_Optyczna));
        rysuj();
    });

    document.getElementById('alfa').addEventListener("input", function(){
        if(sprawdzZgodnoscDanych(parseFloat(this.value) || 0 ,  "alfa")){
            os_Optyczna[id].alfa = parseFloat(this.value) || 0;
        }
        localStorage.setItem('os_Optyczna', JSON.stringify(os_Optyczna));
        rysuj();
    });

    document.getElementById('usun').addEventListener("click", function(){
        wstazka = "SYMULACJA";
        localStorage.setItem('wstazka', wstazka);
        wyswietlWstazke(wstazka);
        os_Optyczna.splice(id, 1);
        localStorage.setItem('os_Optyczna', JSON.stringify(os_Optyczna));
        odswiez_os_optyczna();
        localStorage.setItem('id_Obiektu', -1);
        location.reload();
        rysuj();
    });
}

function sprawdzZgodnoscDanych(x, typ){
    if(typ!="alfa" && typ!="wspx" && typ!="wspy"){
        if(x<=0)    return false;
    }
    if(typ=="h"){
        if(x>WYSOKOSC/2)    return false;
    }
    if(typ=="wspx"){
        if(x>SZEROKOSC||x<0)  return false;
    }
    if(typ=="wspy"){
        if(x>WYSOKOSC||x<0)  return false;
    }
    if(Number.isNaN(x))  return false;
    return true;
}

// Klikanie

function sprawdzWspolrzedne(x, y){
    let cosZadzialo = 0;
    for(let i=0;i<os_Optyczna.length;i++){
        if(czykliknal(x, y, i)){
            wyswietlWlasciwosci(i);
            //rysujElementyKontrolne(i);
            localStorage.setItem('id_Obiektu', i);
            cosZadzialo=1;
            break;
        }
    }

    if(cosZadzialo==0){
            localStorage.setItem('id_Obiektu', -1);
            wstazka = "SYMULACJA";
            localStorage.setItem('wstazka', wstazka);
            document.getElementById('Opcja-symulacji').style.boxShadow = "0px 0px 2px 0px black inset";
            document.getElementById('Opcja-tworzenia').style.boxShadow = "";
            zaladujSymulacje();
            usunWstazkeWlasciwosci();
            main();
    }
}

function czykliknal(x, y, i){
    if(os_Optyczna[i].typ=="PromS"){
        return czykliknalPromien(x, y, i);
    }
    else{
        return czykliknalSoczewke(x, y, i);
    }
}

function czykliknalSoczewke(x, y, i){
    if(os_Optyczna[i].wspx-x<-1*margines||os_Optyczna[i].wspx-x>margines)   return false;
    if(y>os_Optyczna[i].h+WYSOKOSC/2+margines||y<-1*os_Optyczna[i].h+WYSOKOSC/2-margines)   return false;
    return true;
}

function czykliknalPromien(x, y, i){
    if(os_Optyczna[i].wspx-x<-1*margines||os_Optyczna[i].wspx-x>margines)   return false;
    if(os_Optyczna[i].wspy-y<-1*margines||os_Optyczna[i].wspy-y>margines)   return false;
    return true;
}

///


