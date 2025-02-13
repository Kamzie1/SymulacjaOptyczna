(function(){

"use strict";

/// Canvas

let canvas = document.getElementById('canvas');
canvas.style.display='block';
canvas.style.width='100%';
canvas.style.height='100%';
let WYSOKOSC = canvas.height=canvas.offsetHeight;
let SZEROKOSC = canvas.width=canvas.offsetWidth;
const j = 50;
const ctx = canvas.getContext("2d");

/// zmienne globalne

let soczewkaSkupiajaca = {nazwa: "SoczS", typ: "SoczS", wspx: SZEROKOSC/2, h: WYSOKOSC/4, F: 100, id: 0, P:0};
let promienSwietlny = {nazwa: "PromS", typ: "PromS", wspx: SZEROKOSC/4, wspy: WYSOKOSC/3, alfa: 0, id: 0};

let os_Optyczna;
let wstazka="SYMULACJA";
let id_Obiektu=-1;
let pokazOgniskowe = 0;
let pokazGrid = 0;
let N1 = 1;
let wpisywanie ="";
let ifNazwa = 0;
let isFunctionActive = false;

const epsilon = 1e-10;
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
    wyswietlWstazke(wstazka, id_Obiektu);

    rysuj();
}

/// Event listenery 

canvas.addEventListener("click", (event) => {
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    
    sprawdzWspolrzedne(x, y);
    document.getElementById('okno-zaawansowane').style.display = "none";   
    
    document.getElementById('R1').value="";
    document.getElementById('R2').value="";
    document.getElementById('Ns').value="";

    main();
});


window.addEventListener("resize", zmianaEkranu);

window.addEventListener("orientationchange", zmianaEkranu);

document.getElementById('Opcja-symulacji').addEventListener('click', function() {
    wyswietlWstazke("SYMULACJA", id_Obiektu);
});

document.getElementById('Opcja-tworzenia').addEventListener('click', function() {
    wyswietlWstazke("TWORZENIE", id_Obiektu);
});

document.addEventListener("keydown", function(event) {
    if (["INPUT", "TEXTAREA"].includes(event.target.tagName)) return;

    zaladujIfNazwa();
    zaladujAktualneId();
    zaladujWpisywanie();
    zaladujOs();
    zaladujWstazke();

    const key = event.key;
    
    if (key === "'") wpiszNazwe(id_Obiektu);
    else if (key === "Backspace") usunOstatniaLiterke();
    else if (key === "Escape") esc();
    else if (ifNazwa==1) Wpisz(key);
    else if (key === "Enter") Enter();
    else if (key === "r") rysuj();
    else if (key === "Delete") deleteObject(id_Obiektu);
    else if (key === " " || event.code === "Space") Ogniskowe(wstazka);
    else if (key === "g") Grid(wstazka);
    else if (key === "s") zaktualizujOs(soczewkaSkupiajaca);
    else if (key === "p") zaktualizujOs(promienSwietlny);
    else if (key>="0" && key <="9" ||key===".") Wpisz(key);
    else if (key === "o") wybierzObjekt();
    else if (key === "x") zaktulizujZmienna("wspx", "obiekt", id_Obiektu);
    else if (key === "h") zaktulizujZmienna("h", "SoczS", id_Obiektu);
    else if (key === "F") zaktulizujZmienna("F", "SoczS", id_Obiektu);
    else if (key === "y") zaktulizujZmienna("wspy", "PromS", id_Obiektu);
    else if (key === "a") zaktulizujZmienna("alfa", "PromS", id_Obiektu);
    else if (key === "S") wyswietlWstazke("SYMULACJA", id_Obiektu);
    else if (key === "T") wyswietlWstazke("TWORZENIE", id_Obiektu);
    else if (key === "W"&&id_Obiektu!=-1) wyswietlWstazke("WŁAŚCIWOŚCI", id_Obiektu);
    else if (key === "z") pokazZaawansowane();
    else if (key === "q") opuscObiekt();
    else if (key === "N") zaktulizujZmienna("N1", "N1", id_Obiektu);
});

// logika do eventListenerów

function zmianaEkranu() {
    odswiezWspElementow();

    WYSOKOSC = canvas.height = canvas.offsetHeight;
    SZEROKOSC = canvas.width = canvas.offsetWidth;

    soczewkaSkupiajaca = {nazwa: "SoczS", typ: "SoczS", wspx: SZEROKOSC/2, h: WYSOKOSC/4, F: 100, id: 0, P:0};
    promienSwietlny = {nazwa: "PromS", typ: "PromS", wspx: SZEROKOSC/4, wspy: WYSOKOSC/3, alfa: 0, id: 0};

    main();
}

function Wpisz(tekst){
    wpisywanie+=tekst;

    localStorage.setItem('wpisywanie', wpisywanie);
}

function usunOstatniaLiterke(){
    wpisywanie = wpisywanie.slice(0, -1); 

    localStorage.setItem('wpsiywanie', wpisywanie);

}

function zaktulizujZmienna(zmienna, typ, id){
    zaladujOs();
    zaladujAktualneId();
    id = id_Obiektu;
    wpisywanie = parseFloat(wpisywanie) ||0;
    if(typ === "N1"){
        if(!sprawdzZgodnoscDanych(wpisywanie, "N")){wyczyscWpisywanie();  return;}
        localStorage.setItem("N1", wpisywanie);
    }
    else if(id==-1){
        wyczyscWpisywanie();
        return;
    }
    else if(zmienna === "wspx"){
        if(!sprawdzZgodnoscDanych(wpisywanie, "wspx")){wyczyscWpisywanie();  return;}
        os_Optyczna[id].wspx = wpisywanie;
    }
    else if(typ === "PromS" && os_Optyczna[id].typ === "PromS"){
        if(zmienna === "wspy"){
            if(!sprawdzZgodnoscDanych(wpisywanie, "wspy")){wyczyscWpisywanie();  return;}
            os_Optyczna[id].wspy = wpisywanie;
        }
        else if(zmienna === "alfa"){
            if(!sprawdzZgodnoscDanych(wpisywanie, "alfa")){wyczyscWpisywanie();  return;}
            os_Optyczna[id].alfa = wpisywanie;
        }
    }
    else if(typ === "SoczS" && os_Optyczna[id].typ === "SoczS"){
        if(zmienna === "h"){
            if(!sprawdzZgodnoscDanych(wpisywanie, "h")){wyczyscWpisywanie();  return;}
            os_Optyczna[id].h = wpisywanie;
        }
        else if(zmienna === "F"){
            if(!sprawdzZgodnoscDanych(wpisywanie, "F")){wyczyscWpisywanie();  return;}
            os_Optyczna[id].F = wpisywanie;
        }
    }
    localStorage.setItem('os_Optyczna', JSON.stringify(os_Optyczna));
    wyczyscWpisywanie();
    main();
}

function Ogniskowe(wstazka){
    if(wstazka === "SYMULACJA"){
        obsluzOgniskowe();
    }
    else{
        if(pokazOgniskowe==1)
        {
            pokazOgniskowe = 0;
        }
        else if(pokazOgniskowe==0)
        {
            pokazOgniskowe=1;
        }
        localStorage.setItem('pokazOgniskowe', pokazOgniskowe);
        rysuj();
    }
}

function Grid(wstazka){
    if(wstazka === "SYMULACJA"){
        obsluzGrid();
    }
    else{
        if(pokazGrid==1)
        {
            pokazGrid = 0;
        }
        else if(pokazGrid==0)
        {
            pokazGrid=1;
        }
        localStorage.setItem('pokazGrid', pokazGrid);
        rysuj();
    }
}

function esc(){
    ukryjOknoZaawansowane();
    wyczyscWpisywanie();
    localStorage.setItem('ifNazwa', 0);
    main();
}

function Enter() {
    let okno = document.getElementById('okno-zaawansowane');
    let displayStyle = window.getComputedStyle(okno).display; 

    if (displayStyle === "none") {
        uruchomSymulacje();
    } else {
        policz();
    }
}


function deleteObject(id){
    if(id==-1)  wyczysc();
    else{
        usunObject(id);
    }
}

function wybierzObjekt(){
    wpisywanie = parseFloat(wpisywanie) ||0;
    if(!sprawdzZgodnoscDanych(wpisywanie, "id"))  {wyczyscWpisywanie(); return;}
    localStorage.setItem('id_Obiektu', wpisywanie);
    wyswietlWstazke("WŁAŚCIWOŚCI", wpisywanie);
    rysuj();
    wyczyscWpisywanie();
}

function pokazZaawansowane(){
    let okno = document.getElementById('okno-zaawansowane');
    let displayStyle = window.getComputedStyle(okno).display; 

    if(displayStyle = "none" && wstazka === "WŁAŚCIWOŚCI"){
        document.getElementById('okno-zaawansowane').style.display = "block";
        wyczyscWpisywanie();
    }
    else{
        wyczyscWpisywanie();
        return;
    }
}

function opuscObiekt(){
    localStorage.setItem('id_Obiektu', -1);
    wyswietlWstazke("SYMULACJA");
    usunWstazkeWlasciwosci();
    main();
}

function wpiszNazwe(id){
    zaladujAktualneId();
    zaladujIfNazwa();
    id = id_Obiektu;
    if(id==-1)  return;
    if(ifNazwa==0)  
    {
        ifNazwa=1;
        localStorage.setItem("ifNazwa", ifNazwa);
    }
    else{
        ifNazwa=0;
        zaladujOs();
        os_Optyczna[id_Obiektu].nazwa = wpisywanie;
        localStorage.setItem('os_Optyczna', JSON.stringify(os_Optyczna));
        localStorage.setItem("ifNazwa", ifNazwa);
        wyczyscWpisywanie();
        main();
    }
}

document.getElementById('zamknij').addEventListener('click', function(){
    policz();
});

/// Funkcje odświeżania

function zaladujWpisywanie(){
    if(localStorage.getItem('wpisywanie'))
        {
            id_Obiektu = localStorage.getItem('wpisywanie');
        }
}

function wyczyscWpisywanie(){
    wpisywanie="";
    localStorage.setItem("wpisywanie", wpisywanie);
}

function usunLocalStorage(){
    if (!sessionStorage.getItem("sessionVisit")) {
        localStorage.removeItem('wstazka');
        localStorage.removeItem('os_Optyczna');
        localStorage.removeItem('id_Obiektu');
        localStorage.removeItem('pokazOgniskowe');
        localStorage.removeItem('pokazGrid');
        localStorage.removeItem('N1');
        localStorage.removeItem('wpisywanie');
        localStorage.removeItem('ifNazwa');
        sessionStorage.setItem("sessionVisit", "true");
        main();
    } 
}

function zaladujIfNazwa(){
    if(localStorage.getItem('ifNazwa'))
        {
            ifNazwa = localStorage.getItem('ifNazwa');
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

function odswiezWspElementow(){
    for(let i=0;i<os_Optyczna.length;i++){
        if(os_Optyczna[i].typ === "PromS")
            odswiezPromien(i);
        else if(os_Optyczna[i].typ === "SoczS")
            odswiezSoczewke(i);
    }
}

function odswiezPromien(id){
    os_Optyczna[id].wspx = os_Optyczna[id].wspx * (canvas.offsetWidth/SZEROKOSC);
    os_Optyczna[id].wspy = os_Optyczna[id].wspy * (canvas.offsetHeight/WYSOKOSC);
    localStorage.setItem("os_Optyczna", JSON.stringify(os_Optyczna));
}

function odswiezSoczewke(id){
    os_Optyczna[id].wspx = os_Optyczna[id].wspx * (canvas.offsetWidth/SZEROKOSC);
    os_Optyczna[id].h = os_Optyczna[id].h * (canvas.offsetHeight/WYSOKOSC);
    localStorage.setItem("os_Optyczna", JSON.stringify(os_Optyczna));
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
                min = Math.abs(xo-obiektyOptyczne[i].wspx);
                min_id = i;
            }
        }

        if(min_id==-1){
            if(kierunek==1)
            {
                if(Math.abs(a)<epsilon)
                    ctx.lineTo(SZEROKOSC, b);
                else{
                    ctx.lineTo(SZEROKOSC+100, a*(SZEROKOSC+100)+b);
                }
            }
            else{
                if(Math.abs(a)<epsilon)
                    ctx.lineTo(0, b);
                else
                    ctx.lineTo( -100,a*(-100)+b);
            }
            ctx.stroke();
            break;
        }

        ctx.lineTo(obiektyOptyczne[min_id].wspx, obiektyOptyczne[min_id].P);
        xo = obiektyOptyczne[min_id].wspx;

        if(kierunek==1){
            b_pomo = WYSOKOSC/2 - a*(obiektyOptyczne[min_id].wspx - obiektyOptyczne[min_id].F);
            y_pomo = a*obiektyOptyczne[min_id].wspx + b_pomo;
            
            if((obiektyOptyczne[min_id].wspx + obiektyOptyczne[min_id].F)-xo!=0)
                a = (y_pomo-obiektyOptyczne[min_id].P)/((obiektyOptyczne[min_id].wspx + obiektyOptyczne[min_id].F)-xo);
            else{
                alert("błąd");
                break;
            }
            b = y_pomo-a*(obiektyOptyczne[min_id].wspx + obiektyOptyczne[min_id].F);
        }
        else{
            b_pomo = WYSOKOSC/2 - a*(obiektyOptyczne[min_id].wspx + obiektyOptyczne[min_id].F);
            y_pomo = a*obiektyOptyczne[min_id].wspx + b_pomo;
            
            if((obiektyOptyczne[min_id].wspx - obiektyOptyczne[min_id].F)-xo!=0)
                a = (y_pomo-obiektyOptyczne[min_id].P)/((obiektyOptyczne[min_id].wspx - obiektyOptyczne[min_id].F)-xo);
            else{
                alert("błąd");
                break;
            }
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

    zaladujAktualneId();
    if(id_Obiektu!=-1){
        rysujElementyKontrolne(id_Obiektu);
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
    if(os_Optyczna[id].typ==="PromS"){
        rysujElementyKontrolnePromienia(id);
    }
    else{
        rysujElementyKontrolneSoczewki(id);
    }
}

function rysujElementyKontrolnePromienia(id){
    ctx.beginPath();
    ctx.lineWidth=3;
    ctx.arc(os_Optyczna[id].wspx, os_Optyczna[id].wspy+20, 5, 0, 360);
    ctx.moveTo(os_Optyczna[id].wspx+20, os_Optyczna[id].wspy+20);
    ctx.arc(os_Optyczna[id].wspx+20, os_Optyczna[id].wspy+20, 5, 0, 360);
    ctx.fill();
    ctx.stroke();
}

function rysujElementyKontrolneSoczewki(id){
    ctx.beginPath();
    ctx.lineWidth=3;
    ctx.arc(os_Optyczna[id].wspx+30, WYSOKOSC/2-30, 10, 0, 360);
    ctx.moveTo(os_Optyczna[id].wspx+30, WYSOKOSC/2-os_Optyczna[id].h+10);
    ctx.arc(os_Optyczna[id].wspx+30, WYSOKOSC/2-os_Optyczna[id].h+10, 10, 0, 360);
    ctx.moveTo(os_Optyczna[id].wspx+os_Optyczna[id].F, WYSOKOSC/2+80);
    ctx.arc(os_Optyczna[id].wspx+os_Optyczna[id].F, WYSOKOSC/2+80, 10, 0, 360);
    ctx.fill();
    ctx.stroke();
}

/// Funkcje obsługi wstążek

function wyswietlWstazke(wstazka, id_Obiektu){
    localStorage.setItem('wstazka', wstazka);
    zaladujAktualneId();

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
        wyswietlWstazke("WŁAŚCIWOŚCI", id);
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
    let nowyObiekt = { ...obiekt }; 
    nowyObiekt.id = os_Optyczna.length;

    localStorage.setItem('id_Obiektu', os_Optyczna.length);
    os_Optyczna.push(nowyObiekt);

    localStorage.setItem('os_Optyczna', JSON.stringify(os_Optyczna));
    wyswietlWstazke("WŁAŚCIWOŚCI", os_Optyczna.length - 1);
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
        usunWstazkeWlasciwosci();
        main();
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
        usunObject(id);
    });
}

function usunObject(id){
    wyswietlWstazke("SYMULACJA");
    os_Optyczna.splice(id, 1);
    localStorage.setItem('os_Optyczna', JSON.stringify(os_Optyczna));
    odswiez_os_optyczna();
    localStorage.setItem('id_Obiektu', -1);
    usunWstazkeWlasciwosci();
    main();
}

function sprawdzZgodnoscDanych(x, typ){
    if(typ!="alfa" && typ!="wspx" && typ!="wspy" && typ!="id"){
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
    if(typ=="alfa"){
        if(x-360*Math.floor(x/360)==90||x-360*Math.floor(x/360)==270)   return false;
    }
    if(typ=="id"){
        zaladujOs();
        if(x<0||x>=os_Optyczna.length||Math.floor(x)!=x)    return false;
    }
    if(Number.isNaN(x))  return false;
    return true;
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

// Klikanie

function sprawdzWspolrzedne(x, y){
    let cosZadzialo = 0;
    for(let i=0;i<os_Optyczna.length;i++){
        if(id_Obiektu==i){
            if(os_Optyczna[i].typ=="SoczS"){
            if(x>=os_Optyczna[i].wspx+20-margines&&x<=os_Optyczna[i].wspx+40+margines&&y>= WYSOKOSC/2-40-margines&&y<= WYSOKOSC/2-20+margines){
                zmienWspx(i, x, y, "wspx", "SoczS");
                cosZadzialo=1;
                break;
            }
            else if(x<=os_Optyczna[i].wspx+40+margines&&x>=os_Optyczna[i].wspx+20-margines&&y>=WYSOKOSC/2-os_Optyczna[i].h-margines&&y<= WYSOKOSC/2-os_Optyczna[i].h+20+margines){
                zmienWspx(i, x, y, "h", "SoczS");
                cosZadzialo=1;
                break;
            }
            else if(x>=os_Optyczna[i].wspx+os_Optyczna[i].F-10-margines&&x<=os_Optyczna[i].wspx+os_Optyczna[i].F+10+margines&&y<= WYSOKOSC/2+90+margines&&y>=WYSOKOSC/2+70-margines){
                zmienWspx(i, x, y, "F", "SoczS");
                cosZadzialo=1;
                break;
            }
        }
        else if(os_Optyczna[i].typ=="PromS"){
            if(x>=os_Optyczna[i].wspx-margines&&x<=os_Optyczna[i].wspx+margines&&y>= os_Optyczna[i].wspy+15-margines&&y<= os_Optyczna[i].wspy+25+margines){
                zmienWspx(i, x, y, "wspXY", "PromS");
                cosZadzialo=1;
                break;
            }
            else if(x>=os_Optyczna[i].wspx+15-margines&&x<=os_Optyczna[i].wspx+15+margines&&y>= os_Optyczna[i].wspy+15-margines&&y<= os_Optyczna[i].wspy+25+margines){
                zmienWspx(i, x, y, "alfa", "PromS");
                cosZadzialo=1;
                break;
            }
        }
        }
        if(czykliknal(x, y, i)){
            wyswietlWstazke("WŁAŚCIWOŚCI", i);
            localStorage.setItem('id_Obiektu', i);
            cosZadzialo=1;
            break;
        }
    }

    if(cosZadzialo==0){
        localStorage.setItem('id_Obiektu', -1);
        wyswietlWstazke("SYMULACJA");
        usunWstazkeWlasciwosci();
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

/// przesuwanie myszą obiektów

function zmienWspx(id, startX, startY, zmienna, typ) {
    if (isFunctionActive) {
        console.log("Funkcja już działa, operacja zablokowana.");
        return; 
      }
    
    isFunctionActive = true; 
    
    if (!os_Optyczna[id]) {
        console.error(`Nie znaleziono os_Optyczna[${id}]`);
        isFunctionActive = false; 
        return;
      }

    let prevWspX, prevh, prevF, preva, prevWspY;

    if(typ=="SoczS"){
        prevWspX = os_Optyczna[id].wspx;
        prevh = os_Optyczna[id].h;
        prevF = os_Optyczna[id].F;
    }
    else{
        preva = os_Optyczna[id].alfa;
        prevWspY = os_Optyczna[id].wspy;
        prevWspX = os_Optyczna[id].wspx;  
    }

    let prevMouseX = startX;
    let prevMouseY = startY;

    function mouseMoveHandler(event) {

      const dx = event.clientX - prevMouseX;
      const dy = event.clientY - (window.innerHeight*0.2) - prevMouseY;
      
      prevMouseX = event.clientX;
      prevMouseY = event.clientY-(window.innerHeight*0.2);
      
      if(zmienna==="wspx")  os_Optyczna[id].wspx += dx;
      else if(zmienna ==="h")   os_Optyczna[id].h -= dy;
      else if(zmienna ==="F")   os_Optyczna[id].F += dx;
      else if(zmienna === "wspXY") {os_Optyczna[id].wspy += dy; os_Optyczna[id].wspx += dx;}
      else if(zmienna === "alfa"){
        if(prevWspX-event.clientX<0){
            os_Optyczna[id].alfa = -Math.atan((prevWspY-event.clientY)/(prevWspX-event.clientX))*180/Math.PI;
        }else{
            os_Optyczna[id].alfa =180 -Math.atan((prevWspY-event.clientY)/(prevWspX-event.clientX))*180/Math.PI;
        }
      } 

      localStorage.setItem('os_Optyczna', JSON.stringify(os_Optyczna));
      
      rysuj();
    }
    
    function removeListeners() {
      document.removeEventListener('mousemove', mouseMoveHandler);
      document.removeEventListener('click', clickHandler);
      document.removeEventListener('keydown', keydownHandler);
    }
    
    function clickHandler(event) {
        console.log("Kliknięto");
        removeListeners();
        isFunctionActive = false;
        rysuj();
    }
    
    function keydownHandler(event) {
      if (event.key === 'Escape') {
        removeListeners();

        if(typ=="SoczS"){
        os_Optyczna[id].wspx = prevWspX;
        os_Optyczna[id].F = prevF;
        os_Optyczna[id].h = prevh;
        }
        else{
            os_Optyczna[id].wspx = prevWspX;    
            os_Optyczna[id].wspy = prevWspY;    
            os_Optyczna[id].alfa = preva;  
        }
        localStorage.setItem('os_Optyczna', JSON.stringify(os_Optyczna));
        isFunctionActive = false;
        rysuj();
        console.log("Działanie przerwane przez naciśnięcie ESC.");
      }
    }
    
    document.addEventListener('mousemove', mouseMoveHandler);
    
    setTimeout(() => {
      document.addEventListener('click', clickHandler);
      document.addEventListener('keydown', keydownHandler);
    }, 0);
}
  

})();
