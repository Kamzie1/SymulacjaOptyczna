/// Funckje rysowania

import {SZEROKOSC, WYSOKOSC, ctx, j, zaladujAktualneId, id_Obiektu} from './dane.js';

import {SoczewkaSkupiajaca, Promien} from './klasy.js';

let os_OptycznaRysuj;
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

function zaladujOs(){
    if(localStorage.getItem('os_Optyczna'))
    {
        os_OptycznaRysuj = JSON.parse(localStorage.getItem('os_Optyczna'));
        os_OptycznaRysuj = os_OptycznaRysuj.map(obj => {
            if (obj._typ === "SoczewkaSkupiajaca") return Object.assign(new SoczewkaSkupiajaca(), obj);
            if (obj._typ === "Promien") return Object.assign(new Promien(), obj);
    });
    }
    else
    {
        os_OptycznaRysuj =[];
        localStorage.setItem('os_Optyczna', JSON.stringify(os_OptycznaRysuj));
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
    for(let i=0;i<os_OptycznaRysuj.length; i++)
        {
            zaladujAktualneId();
            console.log("os_Optyczna:", os_OptycznaRysuj);
            console.log("id:", id_Obiektu);
            console.log("os_Optyczna[id]:", os_OptycznaRysuj[id_Obiektu]);
            console.log("os_Optyczna[id].wyswietl:", os_OptycznaRysuj[id_Obiektu]?.wyswietl(id_Obiektu));
            os_OptycznaRysuj[i].rysuj();
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

    for(let i=0;i<os_OptycznaRysuj.length;i++){

        if(!os_OptycznaRysuj[i].filter()) continue;

        os_OptycznaRysuj[i].rysujOgniskowe();
    }

}
