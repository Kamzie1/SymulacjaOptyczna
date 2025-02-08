/// Canvas

let canvas = document.getElementById('canvas');
canvas.style.display='block';
canvas.style.width='100%';
canvas.style.height='100%';
let WYSOKOSC = canvas.height=canvas.offsetHeight;
let SZEROKOSC = canvas.width=canvas.offsetWidth;
let j = 50;
const ctx = canvas.getContext("2d");

/// zmienne globalne

const soczewkaSkupiajaca = {nazwa: "SoczS", typ: "SoczS", wspx: SZEROKOSC/2, h: WYSOKOSC/4, F: 100, id: 0, P:0};
const promienSwietlny = {nazwa: "PromS", typ: "PromS", wspx: SZEROKOSC/4, wspy: WYSOKOSC/3, alfa: 0, id: 0};

let os_Optyczna;
let wstazka;
let id_Obiektu=-1;
let pokazOgniskowe = 0;
let pokazGrid = 0;

const kontener = document.getElementById("trescWstazki");

let Tworzenie = `<div class='soczewki'>
                    <button class='skupiajaca' id='skupiajaca'>Skupiająca</button>
                </div>
                <div class='zrodla-swiatla'>
                    <button class='promien-swietlny' id='promien-swietlny'>Promień Świetlny</button>
                </div>`;

let Symulacja = `<div class="sterowanie" id="sterowanie">
                    <button class="uruchom" id="uruchom">Uruchom</button> 
                    <button class="reset" id="reset">Reset</button> 
                    <button class="wyszysc" id="wyczysc">Wyczyść</button>
                </div>
                <div class="pokazywanie">
                    <button class="pokaz-ogniskowe" id="pokaz-ogniskowe"> </button>
                    <button class="pokaz-grid" id="pokaz-grid">  </button>
                </div>
                <div class="material">
                    <form>
                        <label for="N1">N1:</label>
                        <input type="text" id="N1" placeholder="podaj N1:" value="1">
                    </form>
                </div>
                <div class="lista-obiektow" id="lista-obiektow">

                </div>
                `;

/// Główna pętla

rysuj();

function rysuj(){
    usunLocalStorage();
    ctx.clearRect(0, 0, SZEROKOSC, WYSOKOSC);
    rysuj_os();
    rysuj_obiekty();
    rysujObiektyPomocnicze();
}

/// Funkcje odświeżania

window.onload = function(){
    usunLocalStorage();
    zaladujWstazke();
    zaladujOs();
    dodawanieEventListener();
    wyswietlWstazke(wstazka);
    zaladujGrid();
}

function usunLocalStorage(){
    if (!sessionStorage.getItem("sessionVisit")) {
        localStorage.removeItem('wstazka');
        localStorage.removeItem('os_Optyczna');
        localStorage.removeItem('id_Obiektu');
        localStorage.removeItem('pokazOgniskowe');
        localStorage.removeItem('pokazGrid');
        sessionStorage.setItem("sessionVisit", "true");
        location.reload();
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
    else
        {
            id_Obiektu=-1;
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
    else
    {
        wstazka = "SYMULACJA";
        localStorage.setItem('wstazka', wstazka);
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

function wZasiegu(wspx, h, P, xo){
    if(wspx<=xo)    return false;
    if(WYSOKOSC/2+h<P)  return false;
    if(WYSOKOSC/2-h>P)  return false;
    return true;
}

function Symuluj(wspx, wspy, alfa, os_Optyczna){
    let obiektyOptyczne = os_Optyczna.filter(filterOptyki);
    let a, b, xo, yo, y_pomo, b_pomo;
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

            if(!wZasiegu(obiektyOptyczne[i].wspx, obiektyOptyczne[i].h, obiektyOptyczne[i].P, xo)){
                continue;
            }

            if(obiektyOptyczne[i].wspx<min){
                min = obiektyOptyczne[i].wspx;
                min_id = i;
            }
        }

        if(min_id==-1){
            if(a<0)
                ctx.lineTo(-b/a,0);
            else if(a==0)
                ctx.lineTo(SZEROKOSC, b);
            else
                ctx.lineTo( (WYSOKOSC-b)/a,WYSOKOSC);
            ctx.stroke();
            break;
        }

        ctx.lineTo(obiektyOptyczne[min_id].wspx, obiektyOptyczne[min_id].P);
        xo = obiektyOptyczne[min_id].wspx;

        b_pomo = WYSOKOSC/2 - a*(obiektyOptyczne[min_id].wspx - obiektyOptyczne[min_id].F);
        y_pomo = a*obiektyOptyczne[min_id].wspx + b_pomo;

        a = (y_pomo-obiektyOptyczne[min_id].P)/((obiektyOptyczne[min_id].wspx + obiektyOptyczne[min_id].F)-xo);
        b = y_pomo-a*(obiektyOptyczne[min_id].wspx + obiektyOptyczne[min_id].F);

    }
}

/// Funckje rysowania

function rysuj_soczS(id){
    if (!os_Optyczna[id]) return;
    ctx.beginPath();
    ctx.lineWidth=2;
    ctx.moveTo(os_Optyczna[id].wspx,WYSOKOSC/2-os_Optyczna[id].h);
    ctx.lineTo(os_Optyczna[id].wspx, WYSOKOSC/2+ os_Optyczna[id].h);
    ctx.stroke();
}

function rysuj_promS(id){
    if (!os_Optyczna[id]) return;
    ctx.beginPath();
    ctx.lineWidth=2;
    let dl = 30;
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
    zaladujOs();
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
    zaladujGrid();
    zaladujOgniskowe();
    if(pokazOgniskowe==1)
    {
        rysujOgniskowe();
    }
    if(pokazGrid==1)
    {
        rysujGrid();
    }
    return;
}

function rysujGrid(){
    let odl=j;
    ctx.beginPath();
    while(odl<=SZEROKOSC){
        ctx.moveTo(odl,WYSOKOSC/2);
        if(odl%100==0)
        {
            ctx.lineWidth=2;
            ctx.moveTo(odl,WYSOKOSC/2+7.5);
            ctx.lineTo(odl,WYSOKOSC/2-7.5);
            ctx.font = "10px Arial";
            ctx.fillText(`${odl}`,odl,WYSOKOSC/2+7.5+15);
        }
        else{
            ctx.lineWidth=1;
            ctx.moveTo(odl,WYSOKOSC/2+3.75);
            ctx.lineTo(odl,WYSOKOSC/2-3.75);
            ctx.font = "8px Arial";
            ctx.fillText(`${odl}`,odl,WYSOKOSC/2+7.5+12);
        }
        odl+=50;
    }
    odl=j;
    while(odl<=WYSOKOSC){
        ctx.moveTo(0,odl);
        if(odl%100==0)
        {
            ctx.lineWidth=2;
            ctx.lineTo(7.5,odl);
            ctx.font = "10px Arial";
            ctx.fillText(`${odl}`,7.5+15,odl);
        }
        else{
            ctx.lineWidth=1;
            ctx.lineTo(3.75,odl);
            ctx.font = "8px Arial";
            ctx.fillText(`${odl}`,3.75+12,odl);
        }
        odl+=50;
    }
    ctx.stroke();
}

function rysujOgniskowe(){
    zaladujOs();
    ctx.beginPath();
    ctx.lineWidth=3;
    ctx.font = "15px Arial bold";
    for(let i=0;i<os_Optyczna.length;i++){
        if(os_Optyczna[i].typ=="PromS") continue;
        ctx.moveTo(os_Optyczna[i].wspx-os_Optyczna[i].F, WYSOKOSC/2-10);
        ctx.lineTo(os_Optyczna[i].wspx-os_Optyczna[i].F, WYSOKOSC/2+10);
        ctx.fillText(`F${os_Optyczna[i].nazwa}`,os_Optyczna[i].wspx-os_Optyczna[i].F, WYSOKOSC/2+10+25);
        ctx.moveTo(os_Optyczna[i].wspx+os_Optyczna[i].F, WYSOKOSC/2-10);
        ctx.lineTo(os_Optyczna[i].wspx+os_Optyczna[i].F, WYSOKOSC/2+10);
        ctx.fillText(`F${os_Optyczna[i].nazwa}`,os_Optyczna[i].wspx+os_Optyczna[i].F, WYSOKOSC/2+10+25);
    }
    ctx.stroke();
}

/// Funkcje obsługi wstążek

function wyswietlWstazke(wstazka){
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
}

/// Funckje obsługi Symulacji

function zaladujSymulacje(){
    kontener.innerHTML=Symulacja;
    document.getElementById('lista-obiektow').innerHTML='';
    zaladujOs();
    for(let i=0;i<os_Optyczna.length;i++)
    {
        dodajPrzycisk(i);
    }

    if(pokazGrid==0)
    {
        document.getElementById('pokaz-grid').innerText="Pokaż siatkę";
    }
    else if(pokazGrid==1)
    {
        document.getElementById('pokaz-grid').innerText="Schowaj siatkę";
    }
    zaladujOgniskowe();
    if(pokazOgniskowe==0)
    {
        document.getElementById('pokaz-ogniskowe').innerText="Pokaż ogniskowe";
    }
    else if(pokazOgniskowe==1)
    {
        document.getElementById('pokaz-ogniskowe').innerText="Schowaj ogniskowe";
    }

    document.getElementById('wyczysc').addEventListener('click', function(){
        wyczysc();
    });

    document.getElementById('pokaz-ogniskowe').addEventListener('click', function(){
        zaladujOgniskowe();
        if(pokazOgniskowe==1)
        {
                document.getElementById('pokaz-ogniskowe').innerText="Pokaż ogniskowe";
                pokazOgniskowe = 0;
        }
        else if(pokazOgniskowe==0)
        {
                document.getElementById('pokaz-ogniskowe').innerText="Schowaj ogniskowe";
                pokazOgniskowe=1;
        }
        localStorage.setItem('pokazOgniskowe', pokazOgniskowe);
        rysuj();
    });

    document.getElementById('pokaz-grid').addEventListener('click', function(){
        zaladujGrid();
        if(pokazGrid==1)
        {
            document.getElementById('pokaz-grid').innerText="Pokaż siatkę";
            pokazGrid = 0;
        }
        else if(pokazGrid==0)
        {
            document.getElementById('pokaz-grid').innerText="Schowaj siatkę";
            pokazGrid=1;
        }
        localStorage.setItem('pokazGrid', pokazGrid);
        rysuj();
    });

    document.getElementById('uruchom').addEventListener('click', function(){
        uruchomSymulacje();
    });

    document.getElementById('reset').addEventListener('click', function(){
        rysuj();
    });
}

function wyczysc(){
    os_Optyczna=[];
    localStorage.setItem('os_Optyczna', JSON.stringify(os_Optyczna));
    localStorage.setItem('id_Obiektu', -1);
    location.reload();
    rysuj();
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
    kontener.innerHTML= Tworzenie;
    document.getElementById('skupiajaca').addEventListener('click', function(){
        zaktualizujOs(soczewkaSkupiajaca);
    });
    
    document.getElementById('promien-swietlny').addEventListener('click', function(){
        zaktualizujOs(promienSwietlny);
    });
}

function zaktualizujOs(obiekt){
    obiekt.id = os_Optyczna.length;
    localStorage.setItem('id_Obiektu', obiekt.id)
    os_Optyczna.push(obiekt);

    localStorage.setItem('os_Optyczna', JSON.stringify(os_Optyczna));
    wyswietlWlasciwosci(os_Optyczna.length-1);
    rysuj();
}

/// Funkcje obsługi Właściwości

function zaladujWstazkeWlasciwosci(){
    if(!document.getElementById('Opcja-wlasciwosci'))
    {
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

        document.getElementById('Opcja-wlasciwosci').addEventListener('click', function() {
            zaladujAktualneId();
            wyswietlWlasciwosci(id_Obiektu);
        });
    }
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
    kontener.innerHTML=`<div class='rys' id='rys'>
                            <form>  
                                <label for='nazwa'>Nazwa: </label>
                                <input type='text' id='nazwa' placeholder='podaj nazwę:' value=${os_Optyczna[id].nazwa}>
                                <label for='wspx'>Współrzędne: </label>
                                <input type='text' id='wspx' placeholder='podaj wspx:' value=${os_Optyczna[id].wspx}>
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
                        <div class='dod_przyciski' id='dod_przyciski'>
                            <button class="usun" id="usun">Usuń</button>
                        </div>`;
    dodawanieEventListener();
    EventSoczS(id);
}

function zaladujWlasciwosciPromienia(id){
    kontener.innerHTML=`<div class='rys' id='rys'>
                            <form>
                                <label for='nazwa'>Nazwa: </label>
                                <input type='text' id='nazwa' placeholder='podaj nazwę:' value=${os_Optyczna[id].nazwa}>
                                <label for='wspx'>Współrzędne x: </label>
                                <input type='text' id='wspx' placeholder='podaj wspx:' value=${os_Optyczna[id].wspx}>
                                <label for='wspy'>Współrzędne y: </label>
                                <input type='text' id='wspy' placeholder='podaj wspy:' value=${os_Optyczna[id].wspy}>
                                <label for='alfa'>alfa: </label>
                                <input type='text'' id='alfa' placeholder='podaj alfa:' value=${os_Optyczna[id].alfa}>
                            </form>
                        </div>
                        <div class='dod_przyciski' id='dod_przyciski'>
                            <button class="usun" id="usun">Usuń</button>
                        </div>`;
    dodawanieEventListener();
    EventPromS(id);
}

function EventSoczS(id){

    document.getElementById('nazwa').addEventListener("input", function(){
        os_Optyczna[id].nazwa = this.value;
        localStorage.setItem('os_Optyczna', JSON.stringify(os_Optyczna));
        rysuj();
    });

    document.getElementById('wspx').addEventListener("input", function(){
        os_Optyczna[id].wspx = parseFloat(this.value) || 0;
        localStorage.setItem('os_Optyczna', JSON.stringify(os_Optyczna));
        rysuj();
    });

    document.getElementById('h').addEventListener("input", function(){
        os_Optyczna[id].h = parseFloat(this.value) || 0;
        localStorage.setItem('os_Optyczna', JSON.stringify(os_Optyczna));
        rysuj();
    });

    document.getElementById('F').addEventListener("input", function(){
        os_Optyczna[id].F = parseFloat(this.value) || 0;
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

function EventPromS(id){

    document.getElementById('nazwa').addEventListener("input", function(){
        os_Optyczna[id].nazwa = this.value;
        localStorage.setItem('os_Optyczna', JSON.stringify(os_Optyczna));
        rysuj();
    });

    document.getElementById('wspx').addEventListener("input", function(){
        os_Optyczna[id].wspx = parseFloat(this.value) || 0;
        localStorage.setItem('os_Optyczna', JSON.stringify(os_Optyczna));
        rysuj();
    });

    document.getElementById('wspy').addEventListener("input", function(){
        os_Optyczna[id].wspy = parseFloat(this.value) || 0;
        localStorage.setItem('os_Optyczna', JSON.stringify(os_Optyczna));
        rysuj();
    });

    document.getElementById('alfa').addEventListener("input", function(){
        os_Optyczna[id].alfa = parseFloat(this.value) || 0;
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

///


