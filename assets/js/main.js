$(document).ready(function(){

    if( window.location.href =="http://127.0.0.1:8080/sajt%20web2/" || window.location.href == "http://127.0.0.1:8080/sajt%20web2/index.html" || window.location.href == "http://127.0.0.1:8080/sajt%20web2/index.html#filmovi" || window.location.href == "http://127.0.0.1:8080/sajt%20web2/index.html#autor2"){

        ajaxFilmovi(
            function(filmovi){
                ispisiSlajderFilmove(filmovi);
                ispisFilmove(filmovi);
                ispisiZanrove(filmovi);
            }
        )


        slajder();

        document.getElementById("searchMovies").addEventListener("keyup", pretraga);
        document.getElementById("listaZaSortiranje").addEventListener("change", sortiraj);
        document.getElementById("ok").addEventListener("click", function(){
            document.getElementById("popup").style.display = "none";
        })


        $("#forma form table tr th:even").css("margin-top", "35px");

        document.getElementById("submit").addEventListener("click", provera);


        $("#filter").click(function(e){
            e.preventDefault();
            var margina = $("#sortiranje").css("marginLeft");
            margina = parseInt(margina);
            if(margina == 0){
                $("#sortiranje").animate({
                    marginLeft: "-100%"
                }, 400)
            }
            else {
                $("#sortiranje").animate({
                    marginLeft: "0%"
                }, 400)
            }
        })

        $(".fa-times").click(function(e){
            e.preventDefault();
            $("#sortiranje").animate({
                marginLeft: "-100%"
            }, 400)
        })
    }

    $("#lista").hide();
    $(".fa-bars").click(function(){
        $('#lista').slideToggle();
    })
    $("#lista > ul > li").click(function(){
        $("#lista").slideToggle();
    })


    $.ajax({
        url: "data/ikonice.json",
        method: "GET",
        type: "json",
        success: function(data){
            futer(document.getElementById("futerIkonice"), data);
        },
        error: function(err){
            console.error(err);
        }
    })


    $.ajax({
        url: "data/menu.json",
        method: "GET",
        type: "json",
        success: function(data){
            meni(document.getElementById("meni1"), data);
            meni(document.getElementById("meniLista"), data);
        },
        error: function(err){
            console.error(err);
        }
    })


    //--------------------  FILM -----------------------------
    for(let i=0; i<=30; i++){
        if(window.location.href == `http://127.0.0.1:8080/sajt%20web2/film.html?id=${i}`){
            filtrirajFilm();

            document.getElementById("ok").addEventListener("click", function(){
                document.getElementById("popup").style.display = "none";
                document.getElementById("ocenaKorisnika").disabled = true;
            })
        }
    }

    //--------------------- WATCHLIST ---------------------------
    if(window.location.href == "http://127.0.0.1:8080/sajt%20web2/watchlist.html"){
        $("#prazno").hide();
        var filmovi = JSON.parse(localStorage.getItem("filmovi"));

        if(!filmovi || filmovi.length == 0){
            $("#tabela").hide();
            $("#prazno").show();
        }
        else {
            prikaziFilmove();
        }
    }
})


function ajaxFilmovi(success){ 
    $.ajax({
        url: "data/filmovi.json",
        method: "GET",
        success: success
    });
}


function meni(x, data){
    let ispis = "";

    data.forEach(el => {
        ispis += `<li><a href="${el.putanja}">${el.tekst}</a></li>`;
    })

    x.innerHTML = ispis;
}


function futer(x, data){
    let ispis = "";

    data.forEach(el => {
        ispis += `<li><a href="${el.putanja}" target="_blank"><i class="${el.ikonica}" aria-hidden="true"></i></a></li>`;
    })

    x.innerHTML = ispis;
}


function slajder(){
    var trenutni = $('#slajder .aktivan');
    var sledeci = trenutni.next().length ? trenutni.next() : trenutni.parent().children(':first');

    trenutni.hide().removeClass('aktivan');
    sledeci.fadeIn(3000).addClass('aktivan');

    setTimeout(slajder, 10000);
}


function provera(){
    var ime, prezime, noviFilm, email;
    var ispravno = true;
    ime = document.getElementById("firstName").value;
    prezime = document.getElementById("lastName").value;
    noviFilm = document.getElementById("filmForma").value;
    email = document.getElementById("email").value;


    var reIme, rePrezime, reEmail;
    reIme = /^[A-Z][a-z]{1,13}$/;
    rePrezime = /^([A-Z][a-z]{1,30}\s?)+$/;
    reEmail = /^[a-z][a-z\d\_\.\-]+\@[a-z\d]+(\.[a-z]{2,4})+$/;

    if(ime == ""){
        document.getElementById("firstName").classList.add("crveno");
        ispravno = false;
    }
    else if(!reIme.test(ime)){
        document.getElementById("firstName").classList.add("crveno");
        ispravno = false;
    }
    else {
        document.getElementById("firstName").classList.remove("crveno");
    }

    if(prezime == ""){
        document.getElementById("lastName").classList.add("crveno");
        ispravno = false;
    }
    else if(!rePrezime.test(prezime)){
        document.getElementById("lastName").classList.add("crveno");
        ispravno = false;
    }
    else {
        document.getElementById("lastName").classList.remove("crveno");
    }

    if(email == ""){
        document.getElementById("email").classList.add("crveno");
        ispravno = false;
    }
    else if(!reEmail.test(email)){
        document.getElementById("email").classList.add("crveno");
        ispravno = false;
    }
    else {
        document.getElementById("email").classList.remove("crveno");
    }

    if(noviFilm == ""){
        document.getElementById("filmForma").classList.add("crveno");
        ispravno = false;
    }
    else {
        document.getElementById("filmForma").classList.remove("crveno");
    }

    if(ispravno){
        document.getElementById("textModal").innerHTML = "Data successffuly sent!";
            document.getElementById("popup").style.display = "block";
        var polja = document.querySelectorAll("#forma")[0].querySelectorAll("input");
        for(var i=0; i<polja.length-1; i++){
            polja[i].value = "";
        }
    }
}

function ispisiSlajderFilmove(filmovi){
    let ispis = "";
    filmovi.forEach(element => {
        if(element.slajder){
            ispis += `<div class="slajderFilm" style="dispay:none;">
            <div class="slika">
                <img src="${element.slikaVelika}" alt="${element.naziv}" />
            </div>
            <div class="opisFilma">
                <h1>${element.naziv}</h1>
                <p>${element.opis}</p>
                <p> Director: ${element.ekipa.direktor} </br>
                    Writers: ${obrada(element.ekipa.pisci)}</br>
                    Stars: ${obrada(element.ekipa.glumci)}
                </p>
                <a href="film.html?id=${element.id}"><input type="button" class="seeMore" name="seeMore" value="See more" /></a>
            </div>
        </div>`
        }
    });

    document.getElementById("slajder").innerHTML = ispis;

    $(".slajderFilm").first().addClass("aktivan");
    $(".slajderFilm").hide();
    $(".aktivan").show();
}


function obrada(data){
    let ispis = "";
    data.forEach((element, i) => {
        if(typeof element == "object"){
            i == 0 ? ispis += element.nazivZanra : ispis += ", " + element.nazivZanra;
        }
        else {
            i == 0 ? ispis += element : ispis += ", " + element;
        }
    })

    return ispis;
}


function ispisFilmove(data){
    let ispis = "";
    data.forEach(element => {
        var glumci = [];
        glumci = element.ekipa.glumci;
        ispis += `<div class="film">
                    <div class="slikaFilma">
                        <a href="film.html?id=${element.id}"><img src="${element.slikaMala}" alt="${element.naziv}" /></a>
                    </div>
                    <div class="informacije">
                        <a href="film.html?id=${element.id}"><h3>${element.naziv}</h3></a>
                        <p>${obrada(element.zanrovi)}</p>
                        <p>Stars: ${obrada(element.ekipa.glumci)}</p>
                    </div>
                    <span><i class="fa fa-star" aria-hidden="true"></i> ${element.ocena}</span>
                    <input type="button" data-id="${element.id}" name="watchlist" class="watchlist" value="Add to watchlist" />
                </div>`
    })

    document.getElementById("filmovi").innerHTML = ispis;
    $(".watchlist").click(dodajUWatchlist);
}


function dodajUWatchlist(){
    let id = this.dataset.id;

    var filmovi = JSON.parse(localStorage.getItem("filmovi"));

    if(filmovi){
        if(vecDodato()){
            document.getElementById("textModal").innerHTML = "This movie is already in your watchlist!";
            document.getElementById("popup").style.display = "block";
        }
        else {
            var filmovi = JSON.parse(localStorage.getItem("filmovi"));
            filmovi.push({
                id : id
            });
            localStorage.setItem("filmovi", JSON.stringify(filmovi));
            document.getElementById("textModal").innerHTML = "Movie successfully added to your watchlist!";
            document.getElementById("popup").style.display = "block";
        }
    }
    else {
        var filmovi = [];
        filmovi[0] = {
            id : id
        };
        localStorage.setItem("filmovi", JSON.stringify(filmovi));
    }


    function vecDodato(){
        return filmovi.filter(f => f.id == id).length;
    }
    
}


function ispisiZanrove(zanrovi){
    let ispis = "";
    var nizZanrova = [];

    zanrovi.forEach(element => {
        element.zanrovi.forEach(el => {
            if(!nizZanrova.includes(el.nazivZanra)){
                nizZanrova.push(el.nazivZanra);
            }
        })
    })

    nizZanrova.sort((a, b) => {
        if(a == b) 
            return 0
        return a > b ? 1 : -1;
    })

    nizZanrova.forEach(z => {
        ispis += `<li><input type="checkbox" value="${z}" name="zanrovi"/> ${z}</li>`;
    })

    document.getElementById("listaZanrova").innerHTML = ispis;
    $("#listaZanrova li input").change(filtrirajPoZanru);
}


var nizIzabranih = [];
var nizFiltriranih = [];

function filtrirajPoZanru(){
    var naziv = this.value;
    if(!nizIzabranih.includes(naziv)){
        nizIzabranih.push(naziv);
    }
    else {
        const odcekirano = nizIzabranih.filter(el => el != naziv)
        nizIzabranih = odcekirano;
    }


    ajaxFilmovi(
        function(filmovi){
            if(nizIzabranih.length != 0){
                const filtrirano = filmovi.filter(f=>{
                    return f.zanrovi.some(zanr => {
                        for (let i of nizIzabranih){
                            if(zanr.nazivZanra==i){
                                return true;
                            }
                        }
                    })
                })
                ispisFilmove(filtrirano);
                nizFiltriranih.push(filtrirano);
            }
            else {
                ispisFilmove(filmovi);
            }
        }
    )
}


function pretraga(){
    const unos = this.value;

    ajaxFilmovi(
        function(filmovi){
            const filtrirano = filmovi.filter(el => {
                if(el.naziv.toLowerCase().indexOf(unos.toLowerCase()) != -1){
                    return true;
                }
                for(let i=0; i<el.ekipa.glumci.length; i++){
                    if(el.ekipa.glumci[i].toLowerCase().indexOf(unos.toLowerCase()) != -1){
                        return true;
                    }
                }
            })
                
            ispisFilmove(filtrirano);
        }
    )
}


function sortiraj() {
    const izabrano = this.value;

    ajaxFilmovi(
        function(filmovi){
            if(nizFiltriranih.length > 0){
                nizFiltriranih.forEach(nf => {
                    if(izabrano == "najbolji"){
                        nf.sort((a,b) => {
                            if(a.ocena == b.ocena)
                                return 0;
                            return a.ocena > b.ocena ? -1 : 1;
                        })
                        ispisFilmove(nf);
                    }
                    else if(izabrano == "najpopularnije"){
                        nf.sort((a,b) =>{
                            if(a.popularno == b.popularno)
                                return 0;
                            return a.popularno > b.popularno ? 1 : -1;
                        })
                        ispisFilmove(nf);
                    }
                    else if(izabrano == "najnovije"){
                        nf.sort((a,b) => {
                            const datum1 = new Date(a.datum);
                            const datum2 = new Date(b.datum);
    
                            return Date.UTC(datum2.getFullYear(), datum2.getMonth(), datum2.getDate()) - Date.UTC(datum1.getFullYear(), datum1.getMonth(), datum1.getDate());
                        })
                        ispisFilmove(nf);
                    }
                    else if(izabrano == "adoz"){
                        nf.sort((a,b) => {
                            if(a.naziv == b.naziv)
                                return 0;
                            return a.naziv > b.naziv ? 1 : -1;
                        })
                        ispisFilmove(nf);
                    }
                    else {
                        ispisFilmove(nf);
                    }
                })
            }
            else{
                if(izabrano == "najbolji"){
                    filmovi.sort((a,b) => {
                        if(a.ocena == b.ocena)
                            return 0;
                        return a.ocena > b.ocena ? -1 : 1;
                    })
                    ispisFilmove(filmovi);
                }
                else if(izabrano == "najpopularnije"){
                    filmovi.sort((a,b) =>{
                        if(a.popularno == b.popularno)
                            return 0;
                        return a.popularno > b.popularno ? 1 : -1;
                    })
                    ispisFilmove(filmovi);
                }
                else if(izabrano == "najnovije"){
                    filmovi.sort((a,b) => {
                        const datum1 = new Date(a.datum);
                        const datum2 = new Date(b.datum);

                        return Date.UTC(datum2.getFullYear(), datum2.getMonth(), datum2.getDate()) - Date.UTC(datum1.getFullYear(), datum1.getMonth(), datum1.getDate());
                    })
                    ispisFilmove(filmovi);
                }
                else if(izabrano == "adoz"){
                    filmovi.sort((a,b) => {
                        if(a.naziv == b.naziv)
                            return 0;
                        return a.naziv > b.naziv ? 1 : -1;
                    })
                    ispisFilmove(filmovi);
                }
                else {
                    ispisFilmove(filmovi);
                }
            }
        }
    )
}


//----------------------------- FILM --------------------------------

function ispisiFilm(film){
    let ispisi = "";
    let niz = film.slice(0, 1);

    niz.forEach(element =>{
        ispisi += `<div id="content">
                        <h1>${element.naziv}</h1>
                        <p>Release Date: ${datum(element.datum)}</p>
                        <p>Contry: ${element.zemlja}</p>
                        <p>Running Time: ${element.trajanje}min</p>
                        <p>Genre: ${obrada(element.zanrovi)}</p>
                        <p>Starring: ${obrada(element.ekipa.glumci)}</p>
                        <p>Written by: ${obrada(element.ekipa.pisci)}</p>
                        <p>Directed by: ${element.ekipa.direktor}</p>
                        <p><a href="${element.trailer}" target="_blank">Watch trailer</a></p>
                        <p><i class="fa fa-star" aria-hidden="true"></i>${element.ocena}/10</p>
                        <div id="userRating">
                            <p>Your rating: </p>
                            <select id="ocenaKorisnika" data-idFilma="${element.id}">`
                            for(let i = 1; i <= 10; i++){
                                ispisi += `<option value="${i}">${i}</option>`
                            }
                            ispisi += `
                            </select>
                        </div>
                    </div>
                    <div id="image">
                        <img src="${element.slikaVelika}" alt="${element.naziv}" />
                        <p>${element.opis}</p>
                    </div>`
    })

    document.getElementById("movie").innerHTML = ispisi;
    document.getElementById("ocenaKorisnika").addEventListener("change", ocenaKorisnika);
    var ocena = JSON.parse(localStorage.getItem("ocenaKorisnika"));
    var disabled = JSON.parse(localStorage.getItem("disabled"));

    niz.filter(el => {
        for(let i=0; i<ocena.length; i++){
            if(el.id == ocena[i].id){
                document.getElementById("ocenaKorisnika").value = ocena[i].vrednost;
                document.getElementById("ocenaKorisnika").disabled = disabled;
            }
        }
    })

}



function filtrirajFilm(){
    var url = window.location.href;
    var idVrednost = url.split("?")[1].split("=")[1];

    ajaxFilmovi(
        function(filmovi){
            const filtrirano = filmovi.filter(el => el.id == idVrednost);

            ispisiFilm(filtrirano);
        }
    )
}


function datum(datum){
    var datumObj = new Date(datum);

    return datumObj.getDate() + "." + (datumObj.getMonth()+1) + "." + datumObj.getFullYear() +".";
}  


function ocenaKorisnika(){
    let id = this.dataset.idfilma;
    let vrednost = this.value;
    var ocena = JSON.parse(localStorage.getItem("ocenaKorisnika"));

    if(ocena){
        var ocena = JSON.parse(localStorage.getItem("ocenaKorisnika"));

        ocena.push({
            id : id,
            vrednost:vrednost
        });
        localStorage.setItem("ocenaKorisnika", JSON.stringify(ocena));
        document.getElementById("textModal").innerHTML = "Thank you for rating this movie!";
        document.getElementById("popup").style.display = "block";
        localStorage.setItem("disabled", true);
        
    }
    else {
        var ocena = [];
        ocena[0] = {
            id : id,
            vrednost:vrednost
        };
        localStorage.setItem("ocenaKorisnika", JSON.stringify(ocena));
        document.getElementById("textModal").innerHTML = "Thank you for rating this movie!";
        document.getElementById("popup").style.display = "block";
        localStorage.setItem("disabled", true);
    }

}


//-------------------------------- WATCHLIST ---------------------------

function prikaziFilmove(){
    var filmovi = JSON.parse(localStorage.getItem("filmovi"));
    const izabrano = this.value;    

    ajaxFilmovi(
        function(data){
            data = data.filter(el => {
                for(let film of filmovi)
                {
                    if(el.id == film.id) {
                        return true;
                    }
                        
                }
            });

            if(izabrano == "najbolji"){
                data.sort(function(a,b){
                    if(a.ocena > b.ocena){
                        return -1;
                    }
                    else if(a.ocena == b.ocena) {
                        return 0;
                    }
                    else {
                        return 1;
                    }
                })
                ispisiWatchlistu(data);
            }
            else if(izabrano == "najpopularnije"){
                data.sort(function(a,b){
                    if(a.popularno > b.popularno){
                        return 1;
                    }
                    else if(a.popularno == b.popularno) {
                        return 0;
                    }
                    else {
                        return -1;
                    }
                })
                ispisiWatchlistu(data);
            }
            else if(izabrano == "najnovije"){
                data.sort(function(a,b){
                    const datum1 = new Date(a.datum);
                    const datum2 = new Date(b.datum);

                    return Date.UTC(datum2.getFullYear(), datum2.getMonth(), datum2.getDate()) - Date.UTC(datum1.getFullYear(), datum1.getMonth(), datum1.getDate());
                })
                ispisiWatchlistu(data);
            }
            else if(izabrano == "adoz"){
                data.sort(function(a,b){
                    if(a.naziv > b.naziv){
                        return 1;
                    }
                    else if(a.naziv == b.naziv) {
                        return 0;
                    }
                    else {
                        return -1;
                    }
                })
                ispisiWatchlistu(data);
            }
            else {
                ispisiWatchlistu(data);
            }

            ispisiWatchlistu(data);
        }
    )
}


function ispisiWatchlistu(filmovi){
    var filmoviPostoje = JSON.parse(localStorage.getItem("filmovi"));
    var ispis = "";
    if(filmoviPostoje){ 
        filmovi.forEach(element => {
            ispis += `<tr>
                <td colspan="2">
                    <div class="filmWatchlist">
                        <div class="slikaWatchlist">
                            <a href="film.html?id=${element.id}"> <img src="${element.slikaMala}" alt="${element.naziv}" /> </a>
                        </div>
                        <div class="infoWatchlist">
                        <a href="film.html?id=${element.id}"> <h1>${element.naziv}</h1> </a>
                            <p>${datum1(element.datum)} | ${element.trajanje} min | ${obrada(element.zanrovi)} | <i class="fa fa-star" aria-hidden="true"></i> ${element.ocena}</p>
                            <p>${element.opis}</p>
                            <p>Stars: ${obrada(element.ekipa.glumci)}</p>
                        </div> 
                    </div>
                    <input type="button" value="Remove" onclick="obrisiIzWatchliste(${element.id})" class="remove"/>
                </td>
            </tr>`
        });
            
    }

    document.getElementById("bodi").innerHTML = ispis;
    document.getElementById("sortirajWatchlist").addEventListener("change", prikaziFilmove);
    document.getElementById("brojFilmova").innerHTML = `Number of movies: ${filmoviPostoje.length}`;
}


function datum1(datum){
    var datumObj = new Date(datum);

    return datumObj.getFullYear();
}

function obrisiIzWatchliste(id){
    var filmovi = JSON.parse(localStorage.getItem("filmovi"));
    var obrisano = filmovi.filter(function(el){
        return el.id != id;
    })

    localStorage.setItem("filmovi", JSON.stringify(obrisano));

    if(obrisano.length == 0){
        $("#tabela").hide();
        $("#prazno").show();
    }
    prikaziFilmove();   
}
