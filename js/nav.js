document.addEventListener("DOMContentLoaded", function () {
    // Activate sidebar nav
    var elems = document.querySelectorAll(".sidenav");
    M.Sidenav.init(elems);
    var tipeFav = '';
    loadNav();

    function loadNav() {
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function () {
            if (this.readyState === 4) {
                if (this.status !== 200) return;

                // Muat daftar tautan menu
                document.querySelectorAll(".topnav, .mobilenav").forEach(function (elm) {
                    elm.innerHTML = xhttp.responseText;
                });

                // Daftarkan event listener untuk setiap tautan menu
                document
                    .querySelectorAll(".sidenav a, .topnav a")
                    .forEach(function (elm) {
                        elm.addEventListener("click", function (event) {
                            // Tutup sidenav
                            var sidenav = document.querySelector(".sidenav");
                            M.Sidenav.getInstance(sidenav).close();

                            // Muat konten halaman yang dipanggil
                            page = event.target.getAttribute("href").substr(1);
                            loadPage(page);
                        });
                    });
            }
        };
        xhttp.open("GET", "nav.html", true);
        xhttp.send();
    }

    // Load page content
    var page = window.location.hash.substr(1);
    loadPage(setupPage(page));

    function setupPage(page) {
        if (page === "" || page === "#") {
            page = "home";
        } else if (page === "favorit" || page === "fav-tim") {
            page = "favorit";
            tipeFav = "tim";
        } else if (page === "fav-pemain") {
            page = "favorit";
            tipeFav = "pemain";
        } else if (page === "fav-tanding") {
            page = "favorit";
            tipeFav = "tanding";
        }
        return page;
    }


    function loadPage(page) {
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function () {
            if (this.readyState == 4) {
                var content = document.querySelector("#body-content");

                if (page === "home") {
                    getPertTerakhir();
                    getPertMendatang();
                } else if (page === "jadwal") {
                    getJadwalTanding();
                } else if (page === "klasemen") {
                    getKlasemen();
                } else if (page === "favorit") {
                    readDataFavHtml(tipeFav);
                } else {
                    tipeFav = "";
                }

                if (this.status == 200) {
                    content.innerHTML = xhttp.responseText;
                } else if (this.status == 404) {
                    content.innerHTML = `<div class="center">
                                            <img class="center-align" src="../img/404.svg" width="400px">
                                            <h4>Halaman tidak ditemukan.</h4>
                                        </div>`;
                } else {
                    content.innerHTML = `<div class="center">
                                            <img class="center-align" src="../img/warning.svg" width="400px">
                                            <h4>Ups.. halaman tidak dapat diakses.</h4>
                                        </div>`;
                }
            }
        };
        xhttp.open("GET", "pages/" + page + ".html", true);
        xhttp.send();
    }

});