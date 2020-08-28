function databasePromise(idb) {
    const dbPromise = idb.open("football-pwa", 1, upgradeDb => {
        if (!upgradeDb.objectStoreNames.contains("tim_favorit")) {
            const indexFavTeam = upgradeDb.createObjectStore("tim_favorit", {
                keyPath: "id"
            });
            indexFavTeam.createIndex("nameTeam", "name", {
                unique: false
            });
        }

        if (!upgradeDb.objectStoreNames.contains("tanding_favorit")) {
            const indexFavMatch = upgradeDb.createObjectStore("tanding_favorit", {
                keyPath: "id"
            });
            indexFavMatch.createIndex("homeTeam", "match.homeTeam.name", {
                unique: false
            });
            indexFavMatch.createIndex("awayTeam", "match.awayTeam.name", {
                unique: false
            });
        }
    });

    return dbPromise;
}

function checkData(storeName, id) {
    return new Promise(function (resolve, reject) {
        databasePromise(idb)
            .then(function (db) {
                let tran = db.transaction(storeName, "readonly");
                let obstore = tran.objectStore(storeName);
                return obstore.get(id);
            })
            .then(function (data) {
                if (data != undefined) {
                    resolve("Ini Data favorit")
                } else {
                    reject("Ini Bukan data favorit")
                }
            });
    });
}

function createDataFav(dataType, data) {
    let storeName = "";
    let dataToCreate = {}
    if (dataType == "tim") {
        storeName = "tim_favorit"
        dataToCreate = {
            id: data.id,
            name: data.name,
            shortName: data.shortName,
            tla: data.tla,
            crestUrl: data.crestUrl,
            address: data.address,
            phone: data.phone,
            website: data.website,
            email: data.email,
            founded: data.founded,
            clubColors: data.clubColors,
            venue: data.venue,
            squad: data.squad
        }
    } else if (dataType == "tanding") {
        storeName = "tanding_favorit"
        dataToCreate = {
            id: data.match.id,
            head2head: {
                numberOfMatches: data.head2head.numberOfMatches,
                totalGoals: data.head2head.totalGoals,
                homeTeam: {
                    wins: data.head2head.homeTeam.wins,
                    draws: data.head2head.homeTeam.draws,
                    losses: data.head2head.homeTeam.losses
                },
                awayTeam: {
                    wins: data.head2head.awayTeam.wins,
                    draws: data.head2head.awayTeam.draws,
                    losses: data.head2head.awayTeam.losses
                }
            },
            match: {
                utcDate: data.match.utcDate,
                venue: data.match.venue,
                matchday: data.match.matchday,
                homeTeam: {
                    name: data.match.homeTeam.name
                },
                awayTeam: {
                    name: data.match.awayTeam.name
                }
            }
        }
    }

    databasePromise(idb).then(db => {
        const tran = db.transaction(storeName, 'readwrite');
        tran.objectStore(storeName).put(dataToCreate);

        return tran.complete;
    }).then(function () {
        console.log('Berhasil difavoritkan!');
        document.getElementById("iconFav").innerHTML = "favorite";
        const title = 'FOOTBALL_PWA';
        const options = {
            'body': 'Berhasil difavoritkan!',
            'icon': '/img/192x192c.png',
            'badge': '/img/favicon.ico'
        };
        if (Notification.permission === 'granted') {
            navigator.serviceWorker.ready.then(function(registration) {
                registration.showNotification(title, options);
            });
        } else {
            console.error('Fitur notifikasi tidak diijinkan.');
        }
        M.toast({
            html: 'Berhasil Di Favoritkan!',                        
            completeCallback: function () {
                swal({
                        title: "Mau ke halaman Favorit?",
                        icon: "warning",
                        buttons: true
                    })
                    .then((keFavorit) => {
                        if (keFavorit) {
                            swal("Menuju halaman Favorit...", {
                                icon: "success",
                            });
                            window.location = "../#favorit";
                        }
                    });
            }
        });
    }).catch(function () {
        M.toast({
            html: 'Terjadi Kesalahan'
        });
    });
}

function deleteDatafav(storeName, data) {
    databasePromise(idb).then(function (db) {
        let tran = db.transaction(storeName, 'readwrite');
        let store = tran.objectStore(storeName);
        store.delete(data);
        return tran.complete;
    }).then(function () {
        console.log('Berhasil di hapus!');
        document.getElementById("iconFav").innerHTML = "favorite_border";
        const title = 'FOOTBALL_PWA';
        const options = {
            'body': 'Berhasil dihapus dari favorit!',
            'icon': '/img/192x192c.png',
            'badge': '/img/favicon.ico'
        };
        if (Notification.permission === 'granted') {
            navigator.serviceWorker.ready.then(function(registration) {
                registration.showNotification(title, options);
            });
        } else {
            console.error('Fitur notifikasi tidak diijinkan.');
        }
        M.toast({
            html: 'Data berhasil dihapus dari Favorit!'
        });
    }).catch(function () {
        M.toast({
            html: 'Terjadi Kesalahan'
        });
    });
}

function getSavedDataById(dataType) {
    let urlParams = new URLSearchParams(window.location.search);
    let idParam = Number(urlParams.get("id"));

    if (dataType == "tim") {
        let dataPemainLeftHTML = ''
        let dataPemainRightHTML = ''
        getDataById("tim_favorit", idParam).then(function (tim) {
            tim = JSON.parse(JSON.stringify(tim).replace(/http:/g, 'https:'));
            document.getElementById("a-namaklub").innerHTML = tim.name;
            document.getElementById("a-logoklub").src = tim.crestUrl;
            document.getElementById("a-name").innerHTML = tim.name;
            document.getElementById("a-shortName").innerHTML = tim.shortName;
            document.getElementById("a-tla").innerHTML = tim.tla;
            document.getElementById("a-address").innerHTML = tim.address;
            document.getElementById("a-phone").innerHTML = tim.phone;
            document.getElementById("a-website").innerHTML = tim.website;
            document.getElementById("a-email").innerHTML = tim.email;
            document.getElementById("a-founded").innerHTML = tim.founded;
            document.getElementById("a-clubColors").innerHTML = tim.clubColors;
            document.getElementById("a-venue").innerHTML = tim.venue;
            document.getElementById("a-preloader1").innerHTML = '';
            document.getElementById("a-preloader2").innerHTML = '';
            document.getElementById("a-websitee").innerHTML = `<a href="${tim.website}" target="_blank">${tim.website}</a>`;
            dataTimJSON = tim;
            tim.squad.forEach(function (squad, index) {
                dataSquadJSON = squad;
                if (index < (tim.squad.length / 2)) {
                    dataSquadJSON = squad,
                        dataPemainLeftHTML += `
                    <div class="card">
                        <div class="card-image waves-effect waves-block waves-light">
                            <img class="activator" src="../img/player.png" width="200px">
                        </div>
                        <div class="card-content">
                            <span class="card-title activator grey-text text-darken-4">${squad.name}<i class="material-icons right">more_vert</i>
                            </span>
                            <p>${squad.position}</p>
                        </div>
                        <div class="card-reveal">
                            <span class="card-title grey-text text-darken-4">${squad.name}<i class="material-icons right">close</i></span>
                            <p>Position : ${squad.position}</p>
                            <p>Date Of Birth : ${convertDateBirth(new Date(squad.dateOfBirth))}</p>
                            <p>Country Of Birth : ${squad.countryOfBirth}</p>
                            <p>Nationality : ${squad.nationality}</p>
                            <p>Role : ${squad.role}</p>
                        </div>
                    </div>`
                } else {
                    dataPemainRightHTML += `
                    <div class="card">
                        <div class="card-image waves-effect waves-block waves-light">
                            <img class="activator" src="../img/player.png" width="200px">
                        </div>
                        <div class="card-content">
                            <span class="card-title activator grey-text text-darken-4">${squad.name}<i class="material-icons right">more_vert</i>
                            </span>
                            <p>${squad.position}</p>
                        </div>
                        <div class="card-reveal">
                            <span class="card-title grey-text text-darken-4">${squad.name}<i class="material-icons right">close</i></span>
                            <p>Position : ${squad.position}</p>
                            <p>Date Of Birth : ${convertDateBirth(new Date(squad.dateOfBirth))}</p>
                            <p>Country Of Birth : ${squad.countryOfBirth}</p>
                            <p>Nationality : ${squad.nationality}</p>
                            <p>Role : ${squad.role}</p>
                        </div>
                    </div>
                    `
                }
            });
            document.getElementById("squadLeft").innerHTML = dataPemainLeftHTML;
            document.getElementById("squadRight").innerHTML = dataPemainRightHTML;
        })
    } else if (dataType == "tanding") {
        getDataById("tanding_favorit", idParam).then(function (tanding) {
            const matchDay = tanding.match.matchday;
            const kickOff = convertDate(new Date(tanding.match.utcDate));
            const homeTeamName = tanding.match.homeTeam.name;
            const awayTeamName = tanding.match.awayTeam.name;
            const numberOfMatches = tanding.head2head.numberOfMatches;
            const totalGoals = tanding.head2head.totalGoals;
            const homeTeamWins = tanding.head2head.homeTeam.wins;
            const awayTeamWins = tanding.head2head.awayTeam.wins;
            const homeTeamDraws = tanding.head2head.homeTeam.draws;
            const awayTeamDraws = tanding.head2head.awayTeam.draws;
            const homeTeamLosses = tanding.head2head.homeTeam.losses;
            const awayTeamLosses = tanding.head2head.awayTeam.losses;
            const venue = tanding.match.venue;
            document.getElementById("a-matchDay").innerHTML = `Matchday : ${matchDay}`;
            document.getElementById("a-kickOff").innerHTML = `Kick Off : ${kickOff}`;
            document.getElementById("a-homeTeamName").innerHTML = homeTeamName;
            document.getElementById("a-awayTeamName").innerHTML = awayTeamName;
            document.getElementById("a-numberOfMatches").innerHTML = `Number Of Matches: ${numberOfMatches}`;
            document.getElementById("a-totalGoals").innerHTML = `Total Goals: ${totalGoals}`;
            document.getElementById("a-homeTeamWins").innerHTML = homeTeamWins;
            document.getElementById("a-awayTeamWins").innerHTML = awayTeamWins;
            document.getElementById("a-homeTeamDraws").innerHTML = homeTeamDraws;
            document.getElementById("a-awayTeamDraws").innerHTML = awayTeamDraws;
            document.getElementById("a-homeTeamLosses").innerHTML = homeTeamLosses;
            document.getElementById("a-awayTeamLosses").innerHTML = awayTeamLosses;
            document.getElementById("a-venue").innerHTML = venue;
            document.getElementById("a-preloader").innerHTML = '';
        });
    }
}

function getDataById(storeName, id) {
    return new Promise(function (resolve, reject) {
        databasePromise(idb)
            .then(function (db) {
                let tran = db.transaction(storeName, "readonly");
                let obstore = tran.objectStore(storeName);
                return obstore.get(id);
            })
            .then(function (data) {
                resolve(data);
            });
    });
}

function getAllData(storeName) {
    return new Promise(function (resolve, reject) {
        databasePromise(idb)
            .then(function (db) {
                let tran = db.transaction(storeName, "readonly");
                let obstore = tran.objectStore(storeName);
                return obstore.getAll();
            })
            .then(function (data) {
                resolve(data);
            });
    });
}

function readDataFavHtml(dataType) {
    if (dataType == "tim") {
        getAllData("tim_favorit").then(function (data) {
            let dataTimFavHtml = ''
            data.forEach(function (tim) {
                dataTimFavHtml += `
                <div class="col s12 m6 l6">
                    <div class="card">
                        <div class="card-content indigo darken-1 center">
                            <a class="white-text" href="./pages/tim.html?id=${tim.id}"><img src="${tim.crestUrl}" alt="${tim.name}" width="170px" height="170px"></a>
                            <h5>
                                <a class="white-text" href="./pages/tim.html?id=${tim.id}">${tim.name}</a>
                            </h5>
                        </div>
                    </div>
                </div>
                `
            });
            if(data.length == 0) dataTimFavHtml += '<h5 class="center">Tidak ada data TIM yang difavoritkan!</h5>'
            document.getElementById("favorit-content").innerHTML = dataTimFavHtml;
        });
    } else if (dataType == "tanding") {
        getAllData("tanding_favorit").then(function (data) {
            let dataTandingFavHtml = ''
            data.forEach(function (tanding) {
                dataTandingFavHtml += `
            <div class="col s12 m6 l6">
                <div class="card horizontal">
                <div class="card-image">
                            <img src="../img/indigo.png">
                        </div>
                        <div class="card-stacked">
                    <div class="card-content">
                        <div class="center">
                            <h5 class="center">Matchday : ${tanding.match.matchday}</h5>
                            <div class="center">Kick Off : ${convertDate(new Date(tanding.match.utcDate))}</div>
        
                            <div class="row" style="margin:20px">
                                <div class="col s5 truncate right-align">
                                    <span class="teal-text">  ${tanding.match.homeTeam.name}</span>
                                </div>
                                <div class="col s2 ">
                                    VS
                                </div>
                                <div class="col s5 truncate left-align">
                                    <span class="teal-text">  ${tanding.match.awayTeam.name}</span>
                                </div>
                            </div>
                            <div class="center">
                                <a class="brown darken-3 waves-effect waves-light btn" href="./pages/tanding.html?id=${tanding.id}">Lihat Detail <i
                                class="material-icons right">navigate_next</i></a>
                            </div>  
                        </div>
                    </div>
                    </div>
                </div>
            </div>`
            });
            if(data.length == 0) dataTandingFavHtml += '<h5 class="center">Tidak ada data Pertandingan yang difavoritkan!</h5>'
            document.getElementById("favorit-content").innerHTML = dataTandingFavHtml;
        });
    }
}
