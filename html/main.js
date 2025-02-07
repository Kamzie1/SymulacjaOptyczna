let canvas = document.getElementById('canvas');
canvas.style.display='block';
canvas.style.width='100%';
canvas.style.height='100%';
let WYSOKOSC = canvas.height=canvas.offsetHeight;
let SZEROKOSC = canvas.width=canvas.offsetWidth;
let SZER_J = SZEROKOSC/10;
let SZER_j = SZEROKOSC/100;
let WYS_j = WYSOKOSC/100;
let WYS_J = WYSOKOSC/10; 
const ctx = canvas.getContext("2d");

///

const soczewkaSkupiajaca = {nazwa: "SoczS", typ: "SoczS", wspx: SZEROKOSC/2, h: WYSOKOSC/4, F: 1, id: 0};
const promienSwietlny = {nazwa: "PromS", typ: "PromS", wspx: SZEROKOSC/4, wspy: WYSOKOSC/8, alfa: 0, id: 0};
let os_Optyczna;

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


///

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
                    <form>
                        <input type="checkbox" id="ogniskowe" value="tak">
                        <label for="ogniskowe"> pokaż ogniskowe</label>
                    </form>
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
let wstazka;
let id_Obiektu=-1;
const kontener = document.getElementById("trescWstazki");


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
        wyswietlWlasciwosci(id);
    }
    document.getElementById('lista-obiektow').appendChild(przycisk);
}

function zaladujSymulacje(){
    kontener.innerHTML=Symulacja;
    zaladujOs();
    for(let i=0;i<os_Optyczna.length;i++)
    {
        dodajPrzycisk(i);
    }
    document.getElementById('wyczysc').addEventListener('click', function(){
        wyczysc();
    });
}

function zaladujTworzenie(){
    kontener.innerHTML= Tworzenie;
    document.getElementById('skupiajaca').addEventListener('click', function(){
        zaktualizujOs(soczewkaSkupiajaca);
        console.log(os_Optyczna);
    });
    
    document.getElementById('promien-swietlny').addEventListener('click', function(){
        zaktualizujOs(promienSwietlny);
        console.log(os_Optyczna);
    });
}

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

function usunLocalStorage(){
    if (!sessionStorage.getItem("sessionVisit")) {
        localStorage.removeItem('wstazka');
        localStorage.removeItem('os_Optyczna');
        localStorage.removeItem('id_Obiektu');
        sessionStorage.setItem("sessionVisit", "true");
        location.reload();
    } 
}

window.onload = function(){
    usunLocalStorage();
    zaladujWstazke();
    zaladujOs();
    dodawanieEventListener();
    wyswietlWstazke(wstazka);
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
                        </div>`;
    dodawanieEventListener();
}

function EventSoczS(id){

    document.getElementById('nazwa').addEventListener("input", function(){
        os_Optyczna[id].nazwa = this.value;
        localStorage.setItem('os_Optyczna', JSON.stringify(os_Optyczna));
        rysuj();
    });

    document.getElementById('wspx').addEventListener("input", function(){
        os_Optyczna[id].wspx = this.value;
        localStorage.setItem('os_Optyczna', JSON.stringify(os_Optyczna));
        rysuj();
    });

    document.getElementById('h').addEventListener("input", function(){
        os_Optyczna[id].h = this.value;
        localStorage.setItem('os_Optyczna', JSON.stringify(os_Optyczna));
        rysuj();
    });

    document.getElementById('F').addEventListener("input", function(){
        os_Optyczna[id].F = this.value;
        localStorage.setItem('os_Optyczna', JSON.stringify(os_Optyczna));
        rysuj();
    });

}
///

function zaktualizujOs(obiekt){
    obiekt.id = os_Optyczna.length;
    localStorage.setItem('id_Obiektu', obiekt.id)
    os_Optyczna.push(obiekt);

    localStorage.setItem('os_Optyczna', JSON.stringify(os_Optyczna));
    wyswietlWlasciwosci(os_Optyczna.length-1);
    rysuj();
}

function rysuj_soczS(id){
    if (!os_Optyczna[id]) return;
    ctx.beginPath();
    ctx.lineWidth=2;
    ctx.moveTo(os_Optyczna[id].wspx,WYSOKOSC/2);
    ctx.lineTo(os_Optyczna[id].wspx, WYSOKOSC/2-os_Optyczna[id].h);
    ctx.moveTo(os_Optyczna[id].wspx,WYSOKOSC/2);
    ctx.lineTo(os_Optyczna[id].wspx, WYSOKOSC/2+os_Optyczna[id].h);
    ctx.stroke();
}

function rysuj_promS(id){
    if (!os_Optyczna[id]) return;
    ctx.beginPath();
    ctx.lineWidth=2;
    ctx.arc(os_Optyczna[id].wspx, os_Optyczna[id].wspy, 2, 0, Math.PI * 2, true);
    ctx.fill();
    ctx.lineTo(os_Optyczna[id].wspx +30, os_Optyczna[id].wspy);
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

function rysuj(){
    ctx.clearRect(0, 0, SZEROKOSC, WYSOKOSC);
    rysuj_os();
    rysuj_obiekty();
}

rysuj();
