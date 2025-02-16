import {ctx, WYSOKOSC, SZEROKOSC, kontener, j, zaladujAktualneId, id_Obiektu} from './dane.js';

/// deklaracja klas
const epsilon = 1e-10;
const margines = 10;
let os_OptycznaKlas;
function zaladujOs(){
    if(localStorage.getItem('os_Optyczna'))
    {
        os_OptycznaKlas = JSON.parse(localStorage.getItem('os_Optyczna'));
        os_OptycznaKlas = os_OptycznaKlas.map(obj => {
            if (obj._typ === "SoczewkaSkupiajaca") return Object.assign(new SoczewkaSkupiajaca(), obj);
            if (obj._typ === "Promien") return Object.assign(new Promien(), obj);
    });
    }
    else
    {
        os_OptycznaKlas =[];
        localStorage.setItem('os_Optyczna', JSON.stringify(os_OptycznaKlas));
    }
}

let pokazOgniskoweRysuj = 0;
let pokazGridRysuj = 0;

function zaladujOgniskowe(){
    if(localStorage.getItem('pokazOgniskowe'))
    {
        pokazOgniskoweRysuj = localStorage.getItem('pokazOgniskowe');
    }
}

function zaladujGrid(){
    if(localStorage.getItem('pokazGrid'))
    {
        pokazGridRysuj = localStorage.getItem('pokazGrid');
    }
}

export function rysuj(){
    zaladujOs();
    zaladujGrid();
    zaladujOgniskowe();
    ctx.clearRect(0, 0, SZEROKOSC, WYSOKOSC);
    
    rysuj_os();
    rysuj_obiekty();
    rysujObiektyPomocnicze();

}

export function rysuj_os(){
    ctx.beginPath();
    ctx.lineWidth=3;

    ctx.moveTo(0,WYSOKOSC/2);
    ctx.lineTo(SZEROKOSC, WYSOKOSC/2);

    ctx.stroke();
}

export function rysuj_obiekty(){
    for(let i=0;i<os_OptycznaKlas.length; i++)
        {
            zaladujAktualneId();
            console.log("os_Optyczna:", os_OptycznaKlas);
            console.log("id:", id_Obiektu);
            console.log("os_Optyczna[id]:", os_OptycznaKlas[id_Obiektu]);
            console.log("os_Optyczna[id].wyswietl:", os_OptycznaKlas[id_Obiektu]?.wyswietl(id_Obiektu));
            os_OptycznaKlas[i].rysuj();
        }
}

export function rysujObiektyPomocnicze(){
    if(pokazOgniskoweRysuj==1)
    {
        rysujOgniskowe();
    }
    if(pokazGridRysuj==1)
    {
        rysujGrid();
    }
}

export function rysujGrid(){
    let odl=j;

    ctx.beginPath();

    rysujOsPionowa(odl);
    rysujOsPozioma(odl);

    ctx.stroke();
}

export function rysujOsPionowa(odl){
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

export function rysujOsPozioma(odl){
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

export function rysujOgniskowe(){

    for(let i=0;i<os_OptycznaKlas.length;i++){

        if(!os_OptycznaKlas[i].filter()) continue;

        os_OptycznaKlas[i].rysujOgniskowe();
    }

}


export class Obiekt {
    constructor() {
        this._nazwa = "Obiekt";
        this._typ = "Obiekt";
        this._id = 0;
    }

    rysuj(){

    }

    wyswietl(){

    }

    czyKliknal(x, y){

    }

    filter(){

    }

}

export class Optyka extends Obiekt{
    constructor(){
        super();
        this.typ=="Optyka";
    }

    filter(){
        return true;
    }

    zmienBiegPromienia(){

    }

    wZasiegu(){

    }
}

export class Soczewka extends Optyka{
    constructor(){
        super();
        this._F = 100;
        this._wspx = SZEROKOSC/2;
        this._h = WYSOKOSC/4;
    }

    wyswietl(id){
        zaladujOs();
        kontener.innerHTML=`<div class="dane">
        <div class="kontener-przyciskow">
        <div class='nazwa'>
            <form>  
                <label for='nazwa'>Nazwa: </label>
                <input type='text' id='nazwa' placeholder='podaj nazwę:' value=${this._nazwa}>
            </form>
        </div>
        <div class="wspx">
            <form>
                <label for='wspx'>Współrzędne: </label>
                <input type='number' id='wspx' placeholder='podaj wspx:' value=${this._wspx}>
            </form>
        </div>
        <div class ="h">
            <form>
                <label for='h'>Wysokość soczewki: </label>
                <input type='number' id='h' placeholder='podaj h:' value=${this._h}>
            </form>
        </div>
        <div class='optyka' id='optyka'>
            <form>
                <label for='F'>F: </label>
                <input type='number' id='F' placeholder='podaj F:' value=${this._F}>
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

        document.getElementById('nazwa').addEventListener("input", function(){
            os_OptycznaKlas[id].nazwa = this.value;
            localStorage.setItem('os_Optyczna', JSON.stringify(os_OptycznaKlas));
            os_OptycznaKlas[id].rysuj();
        });
    
        document.getElementById('wspx').addEventListener("input", function(){
            os_OptycznaKlas[id].wspx = parseFloat(this.value) || 0;
            localStorage.setItem('os_Optyczna', JSON.stringify(os_OptycznaKlas));
            rysuj();
        });
    
        document.getElementById('h').addEventListener("input", function(){
            os_OptycznaKlas[id].h = parseFloat(this.value) || 0;
            localStorage.setItem('os_Optyczna', JSON.stringify(os_OptycznaKlas));
            os_OptycznaKlas[id].rysuj();
        });
    
        document.getElementById('F').addEventListener("input", function(){
            os_OptycznaKlas[id].F = parseFloat(this.value) || 0;
            localStorage.setItem('os_Optyczna', JSON.stringify(os_OptycznaKlas));
            os_OptycznaKlas[id].rysuj();
        });
    
        document.getElementById('usun').addEventListener("click", function(){
            wyswietlWstazke("SYMULACJA");
            os_Optyczna.splice(this._id, 1);
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

    set wspx(x){
        if(x<=SZEROKOSC&&x>=0&&!Number.isNaN(x)) 
            this._wspx = x;
    }

    set h(x){
        if(x<=WYSOKOSC/2&&x>=0&&!Number.isNaN(x))
            this._h = x;
    }

    set F(x){
        if(x!=0&&!Number.isNaN(x))
            this._F = x;
    }

    czyKliknal(x, y){
        if(this._wspx-x<-1*margines||this._wspx-x>margines)   return false;
        if(y>this._h+WYSOKOSC/2+margines||y<-1*this._h+WYSOKOSC/2-margines)   return false;
        return true;
    }

    wZasiegu(kierunek, xo, Px, Py){
        if(kierunek==1){
            if(this._wspx<=xo)    return false;
        }
        else{
            if(this._wspx>=xo)    return false;
        }
        if(WYSOKOSC/2+this._h<Py)  return false;
        if(WYSOKOSC/2-this._h>Py)  return false;
        return true;
    }

    rysujOgniskowe(){
        ctx.beginPath();
        ctx.lineWidth=3;
        ctx.font = "1.5vw Arial bold";

        ctx.moveTo(this._wspx-this._F, WYSOKOSC/2-10);
        ctx.lineTo(this._wspx-this._F, WYSOKOSC/2+10);

        ctx.fillText(`F${this._nazwa}`,this._wspx-this._F, WYSOKOSC/2+10+50);

        ctx.moveTo(this._wspx+this._F, WYSOKOSC/2-10);
        ctx.lineTo(this._wspx+this._F, WYSOKOSC/2+10);

        ctx.fillText(`F${this._nazwa}`,this._wspx+this._F, WYSOKOSC/2+10+50);

        ctx.stroke();
    }
}

export class SoczewkaSkupiajaca extends Soczewka{
    constructor(){
        super();
        this._typ = "SoczewkaSkupiajaca";
        this._nazwa = "SoczS";
    }

    rysuj(){
        ctx.beginPath();
        ctx.lineWidth=2;
    
        ctx.moveTo(this._wspx,WYSOKOSC/2-this._h);
        ctx.lineTo(this._wspx-10,WYSOKOSC/2-this._h+10)
    
        ctx.moveTo(this._wspx,WYSOKOSC/2-this._h);
        ctx.lineTo(this._wspx+10,WYSOKOSC/2-this._h+10)
    
        ctx.moveTo(this._wspx,WYSOKOSC/2-this._h)
        ctx.lineTo(this._wspx, WYSOKOSC/2+this._h);
    
        ctx.lineTo(this._wspx-10,WYSOKOSC/2+this._h-10)
        ctx.moveTo(this._wspx,WYSOKOSC/2+this._h);
        ctx.lineTo(this._wspx+10,WYSOKOSC/2+this._h-10)
    
        ctx.stroke();
    }

    zmienBiegPromienia(kierunek, a, b, xo, Px, Py){
        let b_pomo = WYSOKOSC/2 - a*(this._wspx - (kierunek*this._F));
        let y_pomo = a*this._wspx + b_pomo;
        
        if((this._wspx +(kierunek*this._F))-xo!=0)
            a = (y_pomo-Py)/((this._wspx + (kierunek*this._F))-xo);
        else
            a = NaN;
        b = y_pomo-a*(this._wspx + (kierunek*this._F));
        return [a, b];
    }

}

export class ZrodloSwiatla extends Obiekt{
    constructor(){
        super();
    }

    filter(){
        return false;
    }

    Symuluj(){

    }
}

export class Promien extends ZrodloSwiatla{
    constructor(){
        super();
        this._typ = "Promien";
        this._nazwa = "PromS";
        this._wspx = SZEROKOSC/4;
        this._wspy = WYSOKOSC/3;
        this._alfa = 0;
    }

    wyswietl(id){
        zaladujOs();
        kontener.innerHTML=`<div class="dane">
        <div class="kontener-przyciskow">
        <div class='nazwa'>
            <form>  
                <label for='nazwa'>Nazwa: </label>
                <input type='text' id='nazwa' placeholder='podaj nazwę:' value=${this._nazwa}>
            </form>
        </div>
        <div class="wspx">
            <form>
                <label for='wspx'>Współrzędne x: </label>
                <input type='number' id='wspx' placeholder='podaj wspx:' value=${this._wspx}>
            </form>
        </div>
        <div class ="h">
            <form>
                <label for='wspy'>Współrzędne y: </label>
                <input type='number' id='wspy' placeholder='podaj wspy:' value=${this._wspy}>
            </form>
        </div>
        <div class='optyka' id='optyka'>
            <form>
                <label for='alfa'>Kąt: </label>
                <input type='number' id='alfa' placeholder='podaj kąt:' value=${this._alfa}>
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
        document.getElementById('nazwa').addEventListener("input", function(){
            os_OptycznaKlas[id].nazwa = this.value;
            localStorage.setItem('os_Optyczna', JSON.stringify(os_OptycznaKlas));
            os_OptycznaKlas[id].rysuj();
        });
    
        document.getElementById('wspx').addEventListener("input", function(){
            os_OptycznaKlas[id].wspx = parseFloat(this.value) || 0;
            localStorage.setItem('os_Optyczna', JSON.stringify(os_OptycznaKlas));
            os_OptycznaKlas[id].rysuj();
        });
    
        document.getElementById('wspy').addEventListener("input", function(){
            os_OptycznaKlas[id].wspy = parseFloat(this.value) || 0;
            localStorage.setItem('os_Optyczna', JSON.stringify(os_OptycznaKlas));
            os_OptycznaKlas[id].rysuj();
        });
    
        document.getElementById('alfa').addEventListener("input", function(){
            os_OptycznaKlas[id]._alfa = parseFloat(this.value) || 0;
            localStorage.setItem('os_Optyczna', JSON.stringify(os_OptycznaKlas));
            os_OptycznaKlas[id].rysuj();
        });
    
        document.getElementById('usun').addEventListener("click", function(){
            wyswietlWstazke("SYMULACJA");
            os_Optyczna.splice(this._id, 1);
            localStorage.setItem('os_Optyczna', JSON.stringify(os_Optyczna));
            odswiez_os_optyczna();
            localStorage.setItem('id_Obiektu', -1);
            usunWstazkeWlasciwosci();
            main();
        });
    }

    set wspx(x){
        if(x<=SZEROKOSC&&x>=0&&!Number.isNaN(x)) 
            this._wspx = x;
    }

    set wspy(x){
        if(x<=WYSOKOSC&&x>=0&&!Number.isNaN(x))
            this._wspy = x;
    }



    czyKliknal(x, y){
        if(this._wspx-x<-1*margines||this._wspx-x>margines)   return false;
        if(this._wspy-y<-1*margines||this._wspy-y>margines)   return false;
        return true;
    }

    rysuj(){
        let dl = 30;
    
        ctx.beginPath();
        ctx.lineWidth=2;
    
        ctx.moveTo(this._wspx, this._wspy);
        ctx.arc(this._wspx, this._wspy, 2, 0, Math.PI * 2, true);
        ctx.fill();
    
        ctx.moveTo(this._wspx, this._wspy);
        ctx.lineTo(this._wspx +dl*Math.cos(this._alfa*Math.PI/180),this._wspy - dl*Math.sin(this._alfa*Math.PI/180));
    
        ctx.stroke();
    }

    Symuluj(){
    zaladujOs();
    let obiektyOptyczne = os_OptycznaKlas.filter(obj => obj.filter());
    let a, b, xo, yo, kierunek, Py, Pmin;

    if(this._alfa-360*Math.floor(this._alfa/360)<=270&&this._alfa-360*Math.floor(this._alfa/360)>=90){
        kierunek=-1;
    }
    else{
        kierunek=1;
    }

    xo = this._wspx;
    yo = this._wspy;

    a = Math.tan((Math.PI/180*(180-this._alfa)));
    b = yo-a*xo;

    ctx.beginPath();
    ctx.lineWidth=2;
    ctx.moveTo(xo, yo);

    while(true){
        let min = SZEROKOSC+100;
        let min_id = -1;
        for(let i=0;i<obiektyOptyczne.length;i++){
            Py = a*obiektyOptyczne[i]._wspx + b;

            if(!obiektyOptyczne[i].wZasiegu(kierunek, xo, 0, Py)){
                continue;
            }

            if(Math.abs(xo-obiektyOptyczne[i]._wspx)<min){
                min = Math.abs(xo-obiektyOptyczne[i]._wspx);
                min_id = i;
                Pmin = Py;
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

        ctx.lineTo(obiektyOptyczne[min_id]._wspx, Pmin);
        xo = obiektyOptyczne[min_id]._wspx;

        [a, b] = obiektyOptyczne[min_id].zmienBiegPromienia(kierunek, a, b, xo, 0, Pmin);

    }
    }
}