let canvas = document.getElementById('canvas');
canvas.style.display='block';
canvas.style.width='100%';
canvas.style.height='100%';
let WYSOKOSC = canvas.height=canvas.offsetHeight;
let SZEROKOSC = canvas.width=canvas.offsetWidth;
const ctx = canvas.getContext("2d");

///

ctx.beginPath();
ctx.lineWidth=3;
ctx.moveTo(0,WYSOKOSC/2);
ctx.lineTo(SZEROKOSC, WYSOKOSC/2);
ctx.stroke();

///

let wstazka;

function jakaWstazka(wstazka)
{
    if(wstazka=="SYMULACJA")
    {
        document.getElementById('Opcja-symulacji').style.boxShadow = "0px 0px 2px 0px black inset";
        document.getElementById('Opcja-tworzenia').style.boxShadow = "";
    }
    else if(wstazka=="TWORZENIE")
    {
        document.getElementById('Opcja-tworzenia').style.boxShadow = "0px 0px 2px 0px black inset";
        document.getElementById('Opcja-symulacji').style.boxShadow = "";
    }
}

function zaladujWstazke()
{
    if(localStorage.getItem('wstazka'))
    {
        wstazka = localStorage.getItem('wstazka');
    }
    else
    {
        wstazka = "SYMULACJA";
        localStorage.setItem('wstazka', wstazka);
    }
}


function zaladujSymulacje(kontener){
    kontener.innerHTML='<div class="sterowanie" id="sterowanie"> <button class="uruchom" id="uruchom">Uruchom</button> <button class="reset" id="reset">Reset</button> <button class="wyszysc" id="wyczysc">Wyczyść</button></div><div class="pokazywanie"><form><input type="checkbox" id="ogniskowe" value="tak"><label for="ogniskowe"> pokaż ogniskowe</label><input type="checkbox" id="promienie" value="tak"><label for="ogniskowe"> pokaż promienie pomocnicze</label></form></div><div class="material"><form><label for="N1">N1:</label><input type="text" id="N1" placeholder="podaj N1:" value="1"></form></div>';
    
}

function zaladujTworzenie(kontener){
    kontener.innerHTML='<div class="soczewki"><button class="skupiajaca" id="skupiajaca">Skupiająca</button></div><div class="zrodla-swiatla"><button class="promien-swietlny" id="promien-swietlny">Promień Świetlny</button></div>';
}

function wyswietlWstazke(wstazka){
    const kontener = document.getElementById("trescWstazki");
    if(wstazka=="SYMULACJA")
    {
        zaladujSymulacje(kontener);
    }
    else if(wstazka=="TWORZENIE")
    {
        zaladujTworzenie(kontener);
    }
}

window.onload = function(){
    zaladujWstazke();
    jakaWstazka(wstazka);
    wyswietlWstazke(wstazka);
}

document.getElementById('Opcja-symulacji').addEventListener('click', function() {
    wstazka = "SYMULACJA";
    localStorage.setItem('wstazka', wstazka);
    jakaWstazka(wstazka);
    wyswietlWstazke(wstazka);
});

document.getElementById('Opcja-tworzenia').addEventListener('click', function() {
    wstazka = "TWORZENIE";
    localStorage.setItem('wstazka', wstazka);
    jakaWstazka(wstazka);
    wyswietlWstazke(wstazka);
});
