/// deklaracja klas

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

    wyswietl(id){
        wypelnijWstazke();
        dodajEventy(id);
    }

    wypelnijWstazke(){
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
                <input type='number' id='h' placeholder='podaj h:' value=${this._h}
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
        dodajEventy();
    }

    dodajEventy(id){
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

    set wspx(x){
        if(x<=SZEROKOSC&&x>=0&&!Number.isNaN(x)) 
            this._wspx = x;
    }

    set wspy(x){
        if(x<=WYSOKOSC&&x>=0&&!Number.isNaN(x))
            this._wspy = x;
    }
    
    wyswietl(id){
        wypelnijWstazke();
        dodajEventy(id);
    }

    wypelnijWstazke(){
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
        dodajEventy(id);
    }

    dodajEventy(id){
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
            os_Optyczna[id]._alfa = parseFloat(this.value) || 0;
            localStorage.setItem('os_Optyczna', JSON.stringify(os_Optyczna));
            rysuj();
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
    let obiektyOptyczne = os_Optyczna.filter(filter);
    let a, b, xo, yo, y_pomo, b_pomo, kierunek, Py, Pmin;

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