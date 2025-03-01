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
    
    /// deklaracja klas
    
    class Obiekt {
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
    
    class Optyka extends Obiekt{
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

        rysujOgniskowe(){

        }
    }
    
    class Soczewka extends Optyka{
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
    
        odswiez(){
            this.wspx = this._wspx * (canvas.offsetWidth/SZEROKOSC);
            this.h = this._h * (canvas.offsetHeight/WYSOKOSC);
            localStorage.setItem("os_Optyczna", JSON.stringify(os_Optyczna));
        }
    
        wyswietl(id){
            this.wypelnijWstazke();
            this.dodajEventy(id);
        }

        liczPx(a, b){
            return this._wspx;   
        }

        liczPy(a, b, Px){
            return a*Px+b;
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
        }
    
        dodajEventy(id){
            document.getElementById('nazwa').addEventListener("input", function(){
                os_Optyczna[id]._nazwa = this.value;
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
    
        rysujElementyKontrolne(){
            ctx.beginPath();
            ctx.lineWidth=3;
            ctx.arc(this._wspx+30, WYSOKOSC/2-30, 10, 0, 2 * Math.PI);
            ctx.moveTo(this._wspx+30, WYSOKOSC/2-this._h+10);
            ctx.arc(this._wspx+30, WYSOKOSC/2-this._h+10, 10, 0, 2 * Math.PI);
            ctx.moveTo(this._wspx+this._F, WYSOKOSC/2+80);
            ctx.arc(this._wspx+this._F, WYSOKOSC/2+80, 10, 0, 2 * Math.PI);
            ctx.fill();
            ctx.stroke();
        }
    
        prev(){
            return [this._wspx, this._h, this._F];
        }
    
        wrocPrev(prev){
            this.wspx = prev[0];
            this.h = prev[1];
            this.F = prev[2];
        }
    
        klikniety(x, y){
            if(x>=this._wspx+20-margines&&x<=this._wspx+40+margines&&y>= WYSOKOSC/2-40-margines&&y<= WYSOKOSC/2-20+margines){
                zmienWspx(this._id, x, y, "wspx");
                return 1;
            }
            else if(x<=this._wspx+40+margines&&x>=this._wspx+20-margines&&y>=WYSOKOSC/2-this._h-margines&&y<= WYSOKOSC/2-this._h+20+margines){
                zmienWspx(this._id, x, y, "h");
                return 1;
            }
            else if(x>=this._wspx+this._F-10-margines&&x<=this._wspx+this._F+10+margines&&y<= WYSOKOSC/2+90+margines&&y>=WYSOKOSC/2+70-margines){
                zmienWspx(this._id, x, y, "F");
                return 1;
            }
            return 0;
        }
    }
    
    class SoczewkaSkupiajaca extends Soczewka{
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
            return [a, b, kierunek];
        }
    
    }
    
    class SoczewkaRozpraszajaca extends Soczewka{
        constructor(){
            super();
            this._typ = "SoczewkaRozpraszajaca";
            this._nazwa = "SoczR";
        }
    
        rysuj(){
            ctx.beginPath();
            ctx.lineWidth=2;
        
            ctx.moveTo(this._wspx,WYSOKOSC/2-this._h);
            ctx.lineTo(this._wspx-10,WYSOKOSC/2-this._h-10)
        
            ctx.moveTo(this._wspx,WYSOKOSC/2-this._h);
            ctx.lineTo(this._wspx+10,WYSOKOSC/2-this._h-10)
        
            ctx.moveTo(this._wspx,WYSOKOSC/2-this._h)
            ctx.lineTo(this._wspx, WYSOKOSC/2+this._h);
        
            ctx.lineTo(this._wspx-10,WYSOKOSC/2+this._h+10)
            ctx.moveTo(this._wspx,WYSOKOSC/2+this._h);
            ctx.lineTo(this._wspx+10,WYSOKOSC/2+this._h+10)
        
            ctx.stroke();
        }
    
        zmienBiegPromienia(kierunek, a, b, xo, Px, Py){
            let b_pomo = WYSOKOSC/2 - a*(this._wspx + (kierunek*this._F));
            let y_pomo = a*this._wspx + b_pomo;
            
            if((this._wspx -(kierunek*this._F))-xo!=0)
                a = (y_pomo-Py)/((this._wspx - (kierunek*this._F))-xo);
            else
                a = NaN;
            b = y_pomo-a*(this._wspx - (kierunek*this._F));
            return [a, b, kierunek];
        }
    }

    class Obudowa extends Optyka{
        constructor(){
            super();
            this._nazwa = "Ob";
            this._typ = "Obudowa";
            this._wspx = SZEROKOSC/2;
            this._wspy = WYSOKOSC/2;
            this._dl = WYSOKOSC/6;
            this._alfa = 89;
            this._a = Math.tan((Math.PI/180*(180-this._alfa)));
            this._b = this._wspy-this._a*this._wspx;;

            this._kierunek = 1;

            [this._wspx2, this._wspy2] = this.liczWsp();
        }

        set wspx(x){
            if(x<=SZEROKOSC&&x>=0&&!Number.isNaN(x)) 
                this._wspx = x;
            this._b = this._wspy-this._a*this._wspx;
            [this._wspx2, this._wspy2] = this.liczWsp();
        }

        set wspy(x){
            if(x<=WYSOKOSC&&x>=0&&!Number.isNaN(x)) 
                this._wspy = x;
            this._b = this._wspy-this._a*this._wspx;
            [this._wspx2, this._wspy2] = this.liczWsp();
        }
    
        set dl(x){
            if(x>=0&&!Number.isNaN(x))
                this._dl = x;
            [this._wspx2, this._wspy2] = this.liczWsp();
        }

        set wspx2(x){
            if(x<=SZEROKOSC&&x>=0&&!Number.isNaN(x)) 
                this._wspx2 = x;
            this._b = this._wspy-this._a*this._wspx;
            [this.dl, this.alfa, this._kierunek] = this.liczDl();
        }

        set wspy2(x){
            if(x<=WYSOKOSC&&x>=0&&!Number.isNaN(x)) 
                this._wspy2 = x;
            this._b = this._wspy-this._a*this._wspx;
            [this.dl, this.alfa, this._kierunek] = this.liczDl();
        }

        set alfa(x){
            this._alfa = x;
            if(x!=90||x!=270){
                this._a = Math.tan((Math.PI/180*(180-this._alfa)));
                this._b = this._wspy-this._a*this._wspx;
                if(x-360*Math.floor(x/360)>90&&x-360*Math.floor(x/360)<270){
                    this._kierunek=-1;
                }
                else{
                    this._kierunek=1;
                }
            }
            else if(x==90){
                this._kierunek = 0;
            }
            else{
                this._kierunek=-2;
            }
            [this._wspx2, this._wspy2] = this.liczWsp();
        }
    
        liczDl(){
            let kierunek;
            let  kat;
            if(this._wspx2<this._wspx){
                kat = 180+180/Math.PI*Math.atan((this._wspy2-this._wspy)/(this._wspx2-this._wspx));
                kierunek=-1;
            }
            else {
                kat = 180/Math.PI*Math.atan((this._wspy2-this._wspy)/(this._wspx2-this._wspx));
                kierunek=1;
            }
            return [Math.sqrt((this._wspx-this._wspx2)**2+(this._wspy-this._wspy2)**2),kat, kierunek];
        }

        liczWsp(){
            let x = rownanieKwadratowe(1+this._a**2,-2*this._wspx+2*this._a*this._b-2*this._a*this._wspy,this._wspx**2 + this._b**2 - (2*this._b*this._wspy) + (this._wspy)**2 - this._dl**2);
            let y = [this._a*x[0]+this._b, this._a*x[1]+this._b];
            if(this._kierunek==1){
                if(x[0]>x[1]){
                    return [x[0], y[0]];
                }
                else{
                    return [x[1], y[1]];
                }
            }
            else{
                if(x[0]>x[1]){
                    return [x[1], y[1]];
                }
                else{
                    return [x[0], y[0]];
                }
            }
        }

        odswiez(){
            this.wspx = this._wspx * (canvas.offsetWidth/SZEROKOSC);
            this.wspy = this._wspy * (canvas.offsetWidth/WYSOKOSC);
            localStorage.setItem("os_Optyczna", JSON.stringify(os_Optyczna));
        }
    
        wyswietl(id){
            this.wypelnijWstazke();
            this.dodajEventy(id);
        }

        liczPx(a, b){
            return (b-this._b)/(-a+this._a);   
        }

        liczPy(a, b, Px){
            return a*Px+b;
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
                    <label for='wspx'>Współrzędne X: </label>
                    <input type='number' id='wspx' placeholder='podaj wspx:' value=${this._wspx}>
                </form>
            </div>
            <div class="wspy">
                <form>
                    <label for='wspy'>Współrzędne Y: </label>
                    <input type='number' id='wspy' placeholder='podaj wspy:' value=${this._wspy}>
                </form>
            </div>
            <div class ="h">
                <form>
                    <label for='h'>Wysokość obudowy: </label>
                    <input type='number' id='h' placeholder='podaj h:' value=${this._dl}>
                </form>
            </div>
            <div class='optyka' id='optyka'>
                <form>
                    <label for='alfa'>alfa: </label>
                    <input type='number' id='alfa' placeholder='podaj a:' value=${this._alfa}>
                </form>
            </div>
            </div>
            <span>Właściwości</span>
            </div>
            <div class='dod_przyciski' id='dod_przyciski'>
                <div class="kontener-przyciskow">
                    <button class="usun" id="usun"><img height=100% width=100% src="img/usun.png"><span class="span-przycisk">Usuń</span></button>
                </div>
                <span>Zaawansowane</span>
            </div>`;
        }
    
        dodajEventy(id){
            document.getElementById('nazwa').addEventListener("input", function(){
                os_Optyczna[id]._nazwa = this.value;
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
        
            document.getElementById('h').addEventListener("input", function(){
                os_Optyczna[id].dl = parseFloat(this.value) || 0;
                localStorage.setItem('os_Optyczna', JSON.stringify(os_Optyczna));
                rysuj();
            });
        
            document.getElementById('alfa').addEventListener("input", function(){
                os_Optyczna[id].alfa = parseFloat(this.value) || 0;
                localStorage.setItem('os_Optyczna', JSON.stringify(os_Optyczna));
                rysuj();
            });
        
            document.getElementById('usun').addEventListener("click", function(){
                wyswietlWstazke("SYMULACJA");
                os_Optyczna.splice(id, 1);
                localStorage.setItem('os_Optyczna', JSON.stringify(os_Optyczna));
                odswiez_os_optyczna();
                localStorage.setItem('id_Obiektu', -1);
                usunWstazkeWlasciwosci();
                main();
            });
        }
    
        czyKliknal(x, y){
            console.log(this._kierunek);
            console.log(this._wspx, this._wspy, this._wspx2, this._wspy2);
            if(x*this._a+this._b>y+margines||x*this._a+this._b<y-margines)  return false;
            if(this._kierunek==1){
                if(x>=this._wspx-margines&&x<=this._wspx2+margines){
                    if(this._wspy2>this._wspy){
                        if(y>=this._wspy-margines&&y<=this._wspy2+margines)   return true;
                    }
                    else{
                        if(y<=this._wspy+margines&&y>=this._wspy2-margines)   return true;
                    }
                }
                return false;
            }
            else{
                if(x<=this._wspx+margines&&x>=this._wspx2-margines){
                    if(this._wspy2>this._wspy){
                        if(y>=this._wspy-margines&&y<=this._wspy2+margines)   return true;
                    }
                    else{
                        if(y<=this._wspy+margines&&y>=this._wspy2-margines)   return true;
                    }
                }
                return false;
            }
        }
    
        rysuj(){        
            ctx.beginPath();
            ctx.lineWidth=5;
        
            ctx.moveTo(this._wspx, this._wspy);
            ctx.lineTo(this._wspx +this._dl*Math.cos(this._alfa*Math.PI/180),this._wspy - this._dl*Math.sin(this._alfa*Math.PI/180));
        
            ctx.stroke();
        }

        wZasiegu(kierunek, xo, Px, Py){
            if(kierunek==1){
                if(Px<=xo) return false;
                if(Math.sqrt((Px-this._wspx)**2+(Py-this._wspy)**2)<=this._dl)
                {
                    if(this._kierunek==1){
                        if(Px<this._wspx)   return false;
                    }
                    else{
                        if(Px>this._wspx)   return false;
                    }
                    return true;
                }
                else return false;
            }
            else{
                if(Px>=xo) return false;
                if(Math.sqrt((Px-this._wspx)**2+(Py-this._wspy)**2)<=this._dl)
                {
                        if(this._kierunek==1){
                            if(Px<this._wspx)   return false;
                        }
                        else{
                            if(Px>this._wspx)   return false;
                        }
                        return true;
                }
                return false;
            }
        }
    
        rysujElementyKontrolne(){
            ctx.beginPath();
            ctx.lineWidth=2;
            ctx.moveTo(this._wspx, this._wspy);
            ctx.arc(this._wspx, this._wspy, 5, 0, Math.PI*2);
            
            ctx.moveTo(this._wspx2, this._wspy2);
            ctx.arc(this._wspx2, this._wspy2, 5, 0, Math.PI*2);

            ctx.fill();
            ctx.stroke();
        }
    
        prev(){
            return [this._wspx,this._wspy, this._wspx2, this.wspy2];
        }
    
        wrocPrev(prev){
            this.wspx = prev[0];
            this.wspy = prev[1];
            this.wspx2 = prev[2];
            this.wspy2 = prev[3];
        }
    
        klikniety(x, y){
            if(Math.abs(x-this._wspx)<=margines+5&&Math.abs(y-this._wspy)<=margines+5){
                zmienWspx(this._id, x, y, "wspXY");
                return 1;
            }
            else if(Math.abs(x-this._wspx2)<=margines+5&&Math.abs(y-this._wspy2)<=margines+5){
                zmienWspx(this._id, x, y, "wspXY2");
                return 1;
            }
            return 0;
        }
    }
    
    class ZrodloSwiatla extends Obiekt{
        constructor(){
            super();
        }
    
        filter(){
            return false;
        }
    
        Symuluj(){
    
        }
    }
    
    class Promien extends ZrodloSwiatla{
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
        
        odswiez(){
            this.wspx = this._wspx * (canvas.offsetWidth/SZEROKOSC);
            this.wspy = this._wspy * (canvas.offsetHeight/WYSOKOSC);
            localStorage.setItem("os_Optyczna", JSON.stringify(os_Optyczna));
        }
    
        wyswietl(id){
            this.wypelnijWstazke();
            this.dodajEventy(id);
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
        }
    
        dodajEventy(id){
            document.getElementById('nazwa').addEventListener("input", function(){
                os_Optyczna[id]._nazwa = this.value;
                localStorage.setItem('os_Optyczna', JSON.stringify(os_Optyczna));
                rysuj();
            });
        
            document.getElementById('wspx').addEventListener("input", function(){
                os_Optyczna[id]._wspx = parseFloat(this.value) || 0;
                localStorage.setItem('os_Optyczna', JSON.stringify(os_Optyczna));
                rysuj();
            });
        
            document.getElementById('wspy').addEventListener("input", function(){
                os_Optyczna[id]._wspy = parseFloat(this.value) || 0;
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
                os_Optyczna.splice(id, 1);
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
        let obiektyOptyczne = os_Optyczna.filter(obj => obj.filter());
        let a, b, xo, yo, kierunek, Px, Py, Pmin, Pminx;
    
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
                Px = obiektyOptyczne[i].liczPx(a, b);
                Py = obiektyOptyczne[i].liczPy(a, b, Px);
    
                if(!obiektyOptyczne[i].wZasiegu(kierunek, xo, Px, Py)){
                    continue;
                }
    
                if(Px.length==2){
                    if(Math.abs(xo-Px[0])<min){
                        min = Math.abs(xo-Px[0]);
                        min_id = i;
                        Pmin = Py[0];
                        Pminx = Px[0];
                    }
                    if(Math.abs(xo-Px[1])<min){
                        min = Math.abs(xo-Px);
                        min_id = i;
                        Pmin = Py[1];
                        Pminx = Px[1];
                    }
                }
                else{
                    if(Math.abs(xo-Px)<min){
                        min = Math.abs(xo-Px);
                        min_id = i;
                        Pmin = Py;
                        Pminx = Px;
                    }
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
    
            ctx.lineTo(Pminx, Pmin);
            xo = Pminx;
    
            if(obiektyOptyczne[min_id]._typ==="Obudowa") {ctx.stroke();break;}
            else    [a, b, kierunek] = obiektyOptyczne[min_id].zmienBiegPromienia(kierunek, a, b, xo, Pminx, Pmin);
    
        }
        }
    
        rysujElementyKontrolne(){
            ctx.beginPath();
            ctx.lineWidth = 3;
        
            ctx.arc(this._wspx, this._wspy + 20, 5, 0, 2 * Math.PI);
            ctx.moveTo(this._wspx +50*Math.cos(this._alfa*Math.PI/180), this._wspy - 50*Math.sin(this._alfa*Math.PI/180));
            ctx.arc(this._wspx +50*Math.cos(this._alfa*Math.PI/180), this._wspy - 50*Math.sin(this._alfa*Math.PI/180), 5, 0, 2 * Math.PI);
        
            ctx.fill();
            ctx.stroke();
        }
    
        prev(){
            return [this._wspx, this._wspy, this._alfa];
        }
    
        wrocPrev(prev){
            this.wspx = prev[0];
            this.wspy = prev[1];
            this.alfa = prev[2];
        }
    
        klikniety(x, y){
            if(x>=this._wspx-margines&&x<=this._wspx+margines&&y>= this._wspy+15-margines&&y<= this._wspy+25+margines){
                zmienWspx(this._id, x, y, "wspXY");
                return 1;
            }
            else if(x>=this._wspx +50*Math.cos(this._alfa*Math.PI/180)-5-margines&&x<=this._wspx +50*Math.cos(this._alfa*Math.PI/180)+5+margines&&y>= this._wspy - 50*Math.sin(this._alfa*Math.PI/180)-5-margines&&y<= this._wspy - 50*Math.sin(this._alfa*Math.PI/180)+5+margines){
                zmienWspx(this._id, x, y, "alfa");
                return 1;
            }
            return 0;
        }
    
    }

    class Zarowka extends ZrodloSwiatla{
        constructor(){
            super();
            this._typ = "Żarówka";
            this._nazwa = "Zar";
            this._wspx = SZEROKOSC/4;
            this._wspy = WYSOKOSC/3;
            this._promienie = 12;
        }
    
        set wspx(x){
            if(x<=SZEROKOSC&&x>=0&&!Number.isNaN(x)) 
                this._wspx = x;
        }
    
        set wspy(x){
            if(x<=WYSOKOSC&&x>=0&&!Number.isNaN(x))
                this._wspy = x;
        }
        
        odswiez(){
            this.wspx = this._wspx * (canvas.offsetWidth/SZEROKOSC);
            this.wspy = this._wspy * (canvas.offsetHeight/WYSOKOSC);
            localStorage.setItem("os_Optyczna", JSON.stringify(os_Optyczna));
        }
    
        wyswietl(id){
            this.wypelnijWstazke();
            this.dodajEventy(id);
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
                    <label for='promienie'>Liczba promieni: </label>
                    <input type='number' id='promienie' placeholder='podaj liczbę:' value=${this._promienie}>
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
        }
    
        dodajEventy(id){
            document.getElementById('nazwa').addEventListener("input", function(){
                os_Optyczna[id]._nazwa = this.value;
                localStorage.setItem('os_Optyczna', JSON.stringify(os_Optyczna));
                rysuj();
            });
        
            document.getElementById('wspx').addEventListener("input", function(){
                os_Optyczna[id]._wspx = parseFloat(this.value) || 0;
                localStorage.setItem('os_Optyczna', JSON.stringify(os_Optyczna));
                rysuj();
            });
        
            document.getElementById('wspy').addEventListener("input", function(){
                os_Optyczna[id]._wspy = parseFloat(this.value) || 0;
                localStorage.setItem('os_Optyczna', JSON.stringify(os_Optyczna));
                rysuj();
            });
        
            document.getElementById('promienie').addEventListener("input", function(){
                os_Optyczna[id]._promienie = parseFloat(this.value) || 0;
                localStorage.setItem('os_Optyczna', JSON.stringify(os_Optyczna));
                rysuj();
            });
        
            document.getElementById('usun').addEventListener("click", function(){
                wyswietlWstazke("SYMULACJA");
                os_Optyczna.splice(id, 1);
                localStorage.setItem('os_Optyczna', JSON.stringify(os_Optyczna));
                odswiez_os_optyczna();
                localStorage.setItem('id_Obiektu', -1);
                usunWstazkeWlasciwosci();
                main();
            });
        }
    
        czyKliknal(x, y){
            if(this._wspx-x<-1*margines-10||this._wspx-x>margines+10)   return false;
            if(this._wspy-y<-1*margines-10||this._wspy-y>margines+10)   return false;
            return true;
        }
    
        rysuj(){
            ctx.beginPath();
            ctx.lineWidth=2;
        
            ctx.moveTo(this._wspx+20, this._wspy);
            ctx.arc(this._wspx, this._wspy, 20, 0, Math.PI * 2);
        
            ctx.stroke();
        }
    
        Symuluj(){
        let obiektyOptyczne = os_Optyczna.filter(obj => obj.filter());
        let a, b, xo, yo, kierunek, Px, Py, Pmin, Pminx, alfa=0;
    

        for(let j=0;j<this._promienie;j++)
        {
            alfa=j*(360/this._promienie);
            if(alfa ==90||alfa==270)   continue;
            if(alfa<=270&&alfa>=90){
                kierunek=-1;
            }
            else{
                kierunek=1;
            }
        
            xo = this._wspx;
            yo = this._wspy;
        
            a = Math.tan((Math.PI/180*(180-alfa)));
            b = yo-a*xo;
        
            ctx.beginPath();
            ctx.lineWidth=2;
            ctx.moveTo(xo, yo);
        
            while(true){
                let min = SZEROKOSC+100;
                let min_id = -1;
                for(let i=0;i<obiektyOptyczne.length;i++){
                    Px = obiektyOptyczne[i].liczPx(a, b);
                    Py = obiektyOptyczne[i].liczPy(a, b, Px);
        
                    if(!obiektyOptyczne[i].wZasiegu(kierunek, xo, Px, Py)){
                        continue;
                    }
        
                    if(Px.length==2){
                        if(Math.abs(xo-Px[0])<min){
                            min = Math.abs(xo-Px[0]);
                            min_id = i;
                            Pmin = Py[0];
                            Pminx = Px[0];
                        }
                        if(Math.abs(xo-Px[1])<min){
                            min = Math.abs(xo-Px);
                            min_id = i;
                            Pmin = Py[1];
                            Pminx = Px[1];
                        }
                    }
                    else{
                        if(Math.abs(xo-Px)<min){
                            min = Math.abs(xo-Px);
                            min_id = i;
                            Pmin = Py;
                            Pminx = Px;
                        }
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
        
                ctx.lineTo(Pminx, Pmin);
                xo = Pminx;
        
                if(obiektyOptyczne[min_id]._typ==="Obudowa") {ctx.stroke();break;}
                else    [a, b, kierunek] = obiektyOptyczne[min_id].zmienBiegPromienia(kierunek, a, b, xo, Pminx, Pmin);
        
            }
        }
        
        }
    
        rysujElementyKontrolne(){
            ctx.beginPath();
            ctx.lineWidth = 3;
        

            ctx.moveTo(this._wspx, this._wspy);
            ctx.arc(this._wspx, this._wspy, 3, 0, 2 * Math.PI);
        
            ctx.fill();
            ctx.stroke();
        }
    
        prev(){
            return [this._wspx, this._wspy];
        }
    
        wrocPrev(prev){
            this.wspx = prev[0];
            this.wspy = prev[1];
        }
    
        klikniety(x, y){
            if(x>=this._wspx-2-margines&&x<=this._wspx+2+margines&&y>= this._wspy-2-margines&&y<= this._wspy+2+margines){
                zmienWspx(this._id, x, y, "wspXY");
                return 1;
            }
            return 0;
        }
    }
    
    /// zmienne globalne
    
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
        zaladujWpisywanie();
        document.getElementById('wpisywanie').innerHTML = wpisywanie;
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
    
    document.getElementById('zamknij').addEventListener('click', function() {
        ukryjOknoZaawansowane();
    });
    
    document.getElementById('Policz').addEventListener('click', function(){
        policz();
    });
    
    document.addEventListener("keydown", function(event) {
        if (["INPUT", "TEXTAREA"].includes(event.target.tagName)) return;
    
        zaladujIfNazwa();
        zaladujWpisywanie();
        zaladujOs();
        zaladujWstazke();
        zaladujAktualneId();
    
        const key = event.key;
        
        if (key === "'") wpiszNazwe(id_Obiektu);
        else if (key === "Backspace") usunOstatniaLiterke();
        else if (key === "Escape") esc();
        else if (ifNazwa==1) Wpisz(key);
        else if (key === "Enter") Enter();
        else if (key === "Delete") deleteObject(id_Obiektu);
        else if (key === " " || event.code === "Space") Ogniskowe(wstazka);
        else if (key === "g") Grid(wstazka);
        else if (key === "s") zaktualizujOs(SoczewkaSkupiajaca);
        else if (key === "r") zaktualizujOs(SoczewkaRozpraszajaca);
        else if (key === "p") zaktualizujOs(Promien);
        else if (key>="0" && key <="9" ||key===".") Wpisz(key);
        else if (key === "o") wybierzObjekt();
        else if (key === "x") zaktulizujZmienna("wspx", "obiekt", id_Obiektu);
        else if (key === "h") zaktulizujZmienna("h", "SoczS", id_Obiektu);
        else if (key === "F") zaktulizujZmienna("F", "SoczS", id_Obiektu);
        else if (key === "R") zaktulizujZmienna("R", "Zw", id_Obiektu);
        else if (key === "y") zaktulizujZmienna("wspy", "PromS", id_Obiektu);
        else if (key === "a") zaktulizujZmienna("alfa", "PromS", id_Obiektu);
        else if (key === "S") wyswietlWstazke("SYMULACJA", id_Obiektu);
        else if (key === "T") wyswietlWstazke("TWORZENIE", id_Obiektu);
        else if (key === "W" && id_Obiektu!=-1) wyswietlWstazke("WŁAŚCIWOŚCI", id_Obiektu);
        else if (key === "z") pokazZaawansowane();
        else if (key === "q") opuscObiekt();
        else if (key === "N") zaktulizujZmienna("N1", "N1", id_Obiektu);
    
    });
    
    // logika do eventListenerów
    
    function zmianaEkranu() {
        odswiezWspElementow();
    
        WYSOKOSC = canvas.height = canvas.offsetHeight;
        SZEROKOSC = canvas.width = canvas.offsetWidth;
    
        main();
    }
    
    function Wpisz(tekst){
        
        wpisywanie += tekst;
        document.getElementById('wpisywanie').innerHTML = wpisywanie;
        localStorage.setItem('wpisywanie', wpisywanie);
        
    }
    
    function usunOstatniaLiterke(){
        wpisywanie = wpisywanie.slice(0, -1); 
    
        document.getElementById('wpisywanie').innerHTML = wpisywanie;
        
        localStorage.setItem('wpsiywanie', wpisywanie);
    
    }
    
    function zaktulizujZmienna(zmienna, typ, id){
        zaladujOs();
        zaladujAktualneId();
        id = id_Obiektu;
        wpisywanie = parseFloat(wpisywanie) ||0;
        if(typ === "N1"){
            if(!sprawdzZgodnoscDanych(wpisywanie, "N")){wyczyscWpisywanie(); document.getElementById('wpisywanie').innerHTML = wpisywanie;  return;}
            localStorage.setItem("N1", wpisywanie);
        }
        else if(id==-1){
            wyczyscWpisywanie();
            document.getElementById('wpisywanie').innerHTML = wpisywanie;
            return;
        }
        else if(zmienna === "wspx"){
            os_Optyczna[id].wspx = wpisywanie;
        }
        else if(typ === "PromS" && os_Optyczna[id]._typ === "PromS"){
            if(zmienna === "wspy"){
                os_Optyczna[id].wspy = wpisywanie;
            }
            else if(zmienna === "alfa"){
                os_Optyczna[id]._alfa = wpisywanie;
            }
        }
        else if(typ === "SoczS" && os_Optyczna[id]._typ === "SoczS"){
            if(zmienna === "h"){
                os_Optyczna[id].h = wpisywanie;
            }
            else if(zmienna === "F"){
                os_Optyczna[id].F = wpisywanie;
            }
        }
        else if(typ==="Zw"&& os_Optyczna[id]._typ === "Zwierciadlo"){
            if(zmienna === "R"){
                os_Optyczna[id].R = wpisywanie;
            }
        }
        localStorage.setItem('os_Optyczna', JSON.stringify(os_Optyczna));
        wyczyscWpisywanie();
        document.getElementById('wpisywanie').innerHTML = wpisywanie;
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
        document.getElementById('wpisywanie').innerHTML = wpisywanie;
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
        if(!sprawdzZgodnoscDanych(wpisywanie, "id"))  {wyczyscWpisywanie(); document.getElementById('wpisywanie').innerHTML = wpisywanie; return;}
        localStorage.setItem('id_Obiektu', wpisywanie);
        wyswietlWstazke("WŁAŚCIWOŚCI", wpisywanie);
        rysuj();
        wyczyscWpisywanie();
        document.getElementById('wpisywanie').innerHTML = wpisywanie;
    }
    
    function pokazZaawansowane(){
        let okno = document.getElementById('okno-zaawansowane');
        let displayStyle = window.getComputedStyle(okno).display; 
    
        if(displayStyle === "none" && wstazka === "WŁAŚCIWOŚCI"){
            document.getElementById('okno-zaawansowane').style.display = "block";
        }
        else{
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
            document.getElementById('tu_wpisz').innerHTML = "   Włączony";
        }
        else{
            ifNazwa=0;
            zaladujOs();
            os_Optyczna[id_Obiektu]._nazwa = wpisywanie;
            localStorage.setItem('os_Optyczna', JSON.stringify(os_Optyczna));
            localStorage.setItem("ifNazwa", ifNazwa);
            wyczyscWpisywanie();
            document.getElementById('wpisywanie').innerHTML = wpisywanie;
            document.getElementById('tu_wpisz').innerHTML = "   Wyłączony";
            main();
        }
    }
    
    /// Funkcje odświeżania
    
    function zaladujWpisywanie(){
        if(localStorage.getItem('wpisywanie'))
            {
                wpisywanie = localStorage.getItem('wpisywanie');
            }
    }
    
    function wyczyscWpisywanie(){
        wpisywanie="";
        localStorage.setItem("wpisywanie", wpisywanie);
    }
    
    function usunLocalStorage(){
        if (!sessionStorage.getItem("sessionVisit")) {
            localStorage.clear();
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
            os_Optyczna[i]._id = i;
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
                os_Optyczna = os_Optyczna.map(obj => {
                    if (obj._typ === "SoczewkaSkupiajaca") return Object.assign(new SoczewkaSkupiajaca(), obj);
                    if (obj._typ === "SoczewkaRozpraszajaca") return Object.assign(new SoczewkaRozpraszajaca(), obj);
                    if (obj._typ === "ZwierciadloWklesle") return Object.assign(new ZwierciadloWklesle(), obj);
                    if (obj._typ === "ZwierciadloWypukle") return Object.assign(new ZwierciadloWypukle(), obj);
                    if (obj._typ === "Obudowa") return Object.assign(new Obudowa(), obj);
                    if (obj._typ === "Lustro") return Object.assign(new Lustro(), obj);
                    if (obj._typ === "Promien") return Object.assign(new Promien(), obj);
                    if (obj._typ === "Żarówka") return Object.assign(new Zarowka(), obj);
                    return obj;  
                });
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
            os_Optyczna[i].odswiez();
        }
    }
    
    /// Funckje symulacji
    
    function uruchomSymulacje(){
        zaladujOs();
        let zrodla_swiatla = os_Optyczna.filter(obj => !(obj.filter()));
        for(let i=0;i<zrodla_swiatla.length;i++){
            zrodla_swiatla[i].Symuluj();
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
            os_Optyczna[id_Obiektu].rysujElementyKontrolne();
        }
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
            os_Optyczna[i].rysuj();
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
        for(let i=0;i<os_Optyczna.length;i++){
            if(os_Optyczna[i].filter())
                os_Optyczna[i].rysujOgniskowe();
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
            os_Optyczna[id_Obiektu].wyswietl(id_Obiektu);
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
        przycisk.innerText = `${id} : ${os_Optyczna[id]._nazwa}`;
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
                            <button class='rozpraszajaca' id='rozpraszajaca'><img height=100% width=100% src="img/rozpraszajaca.png"><span class="span-przycisk">Rozpraszająca</span></button>
                        </div>
                        <span>Soczewki</span>
                    </div>
                    <div class='zwierciadla'>
                        <div class="kontener-przyciskow">
                            <button class='zwierciadlo-wklesle' id='zwierciadlo-wklesle'><img height=100% width=100% src="img/skupiajaca.png"><span class="span-przycisk">Wklęsłe</span></button>
                            <button class='zwierciadlo-wypukle' id='zwierciadlo-wypukle'><img height=100% width=100% src="img/rozpraszajaca.png"><span class="span-przycisk">Wypukłe</span></button>
                        </div>
                        <span>Zwierciadła</span>
                    </div>
                    <div class='zrodla-swiatla'>
                        <div class="kontener-przyciskow">
                            <button class='promien-swietlny' id='promien-swietlny'><img height=100% width=100% src="img/promien-swietlny.png"><span class="span-przycisk">Promień</span></button>
                            <button class='promien-swietlny' id='zarowka'><img height=100% width=100% src="img/promien-swietlny.png"><span class="span-przycisk">Żarówka</span></button>
                        </div>
                        <span>Żródła światła</span>
                    </div>  
                    <div class='zwierciadla'>
                    <div class="kontener-przyciskow">
                        <button class='zwierciadlo-wklesle' id='Lustro'><img height=100% width=100% src="img/skupiajaca.png"><span class="span-przycisk">Lustro</span></button>
                        <button class='zwierciadlo-wypukle' id='Obudowa'><img height=100% width=100% src="img/rozpraszajaca.png"><span class="span-przycisk">Obudowa</span></button>
                    </div>
                    <span>Inne</span>
                </div>`;       
        kontener.innerHTML= Tworzenie;
    }
    
    function dodajEventTworzenia(){
        document.getElementById('skupiajaca').addEventListener('click', function(){
            zaktualizujOs(SoczewkaSkupiajaca);
        });
    
        document.getElementById('rozpraszajaca').addEventListener('click', function(){
            zaktualizujOs(SoczewkaRozpraszajaca);
        });
        
        document.getElementById('promien-swietlny').addEventListener('click', function(){
            zaktualizujOs(Promien);
        });

        document.getElementById('zarowka').addEventListener('click', function(){
            zaktualizujOs(Zarowka);
        });

        document.getElementById('zwierciadlo-wklesle').addEventListener('click', function(){
            zaktualizujOs(ZwierciadloWklesle);
        });

        document.getElementById('zwierciadlo-wypukle').addEventListener('click', function(){
            zaktualizujOs(ZwierciadloWypukle);
        });

        document.getElementById('Lustro').addEventListener('click', function(){
            zaktualizujOs(Lustro);
        });

        document.getElementById('Obudowa').addEventListener('click', function(){
            zaktualizujOs(Obudowa);
        });
    }
    
    function zaktualizujOs(obiekt) {  
        let nowyObiekt = new obiekt(); 
        nowyObiekt._id = os_Optyczna.length;
    
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
        if(typ!="alfa" && typ!="wspx" && typ!="wspy" && typ!="id"&&typ!="F"&&typ!="R"){
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
                cosZadzialo = os_Optyczna[i].klikniety(x, y);
            }
            if(os_Optyczna[i].czyKliknal(x, y)){
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
    
    /// przesuwanie myszą obiektów
    
    function zmienWspx(id, startX, startY, zmienna) {
        if (isFunctionActive) {
            return; 
          }
        
        isFunctionActive = true; 
        
        if (!os_Optyczna[id]) {
            console.error(`Nie znaleziono os_Optyczna[${id}]`);
            isFunctionActive = false; 
            return;
          }
    
        let prev;
    
        prev = os_Optyczna[id].prev();
    
        let prevMouseX = startX;
        let prevMouseY = startY;
    
        function mouseMoveHandler(event) {
    
          const dx = event.clientX - prevMouseX;
          const dy = event.clientY - (window.innerHeight*0.2) - prevMouseY;
          
          prevMouseX = event.clientX;
          prevMouseY = event.clientY-(window.innerHeight*0.2);
          
          if(zmienna==="wspx")  os_Optyczna[id].wspx = os_Optyczna[id]._wspx + dx;
          else if(zmienna ==="h")   os_Optyczna[id].h = os_Optyczna[id]._h - dy;
          else if(zmienna ==="F")   os_Optyczna[id].F = dx + os_Optyczna[id]._F;
          else if(zmienna ==="R")   os_Optyczna[id].R = dx + os_Optyczna[id]._R;
          else if(zmienna === "wspXY") {os_Optyczna[id].wspy = os_Optyczna[id]._wspy + dy; os_Optyczna[id].wspx =os_Optyczna[id]._wspx + dx;}
          else if(zmienna === "wspXY2"){os_Optyczna[id].wspy2 = os_Optyczna[id]._wspy2 + dy; os_Optyczna[id].wspx2 =os_Optyczna[id]._wspx2 + dx;}
          else if(zmienna === "alfa"){
            if(prev[0]-event.clientX<0){
                os_Optyczna[id]._alfa = -Math.atan((prev[1]-event.clientY)/(prev[0]-event.clientX))*180/Math.PI;
            }else{
                os_Optyczna[id]._alfa =180 -Math.atan((prev[1]-event.clientY)/(prev[0]-event.clientX))*180/Math.PI;
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
            removeListeners();
            isFunctionActive = false;
            rysuj();
        }
        
        function keydownHandler(event) {
          if (event.key === 'Escape') {
            removeListeners();
    
            os_Optyczna[id].wrocPrev(prev);
            localStorage.setItem('os_Optyczna', JSON.stringify(os_Optyczna));
            isFunctionActive = false;
            rysuj();
          }
        }
        
        document.addEventListener('mousemove', mouseMoveHandler);
        
        setTimeout(() => {
          document.addEventListener('click', clickHandler);
          document.addEventListener('keydown', keydownHandler);
        }, 0);
    }
      
    
    })();
    