/// Canvas
let canvas = document.getElementById('canvas');
canvas.style.display='block';
canvas.style.width='100%';
canvas.style.height='100%';
export let WYSOKOSC = canvas.height=canvas.offsetHeight;
export let SZEROKOSC = canvas.width=canvas.offsetWidth;
export const j = 50;
export const ctx = canvas.getContext("2d");

/// zmienne globalne

export let wstazka="SYMULACJA";
export let id_Obiektu=-1;

export const kontener = document.getElementById("trescWstazki");

/// Funkcje odświeżania

export function odswiez_os_optyczna(){
    zaladujOs();
    for(let i=0;i<os_Optyczna.length;i++)
    {
        os_Optyczna[i].id = i;
    }
    localStorage.setItem('os_Optyczna', JSON.stringify(os_Optyczna));
}

export function zaladujAktualneId(){
    if(localStorage.getItem('id_Obiektu'))
        {
            id_Obiektu = localStorage.getItem('id_Obiektu');
        }
}

export function zaladujWstazke()
{
    if(localStorage.getItem('wstazka'))
    {
        wstazka = localStorage.getItem('wstazka');
    }
}

