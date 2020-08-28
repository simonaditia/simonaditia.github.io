const base_url = "https://api.football-data.org/v2/";
const token = "711dc62def17423cadec6e7b267de809";

function status(response) {
  if (response.status !== 200)
  {
    console.log("Error : " + response.status);
    return Promise.reject(new Error(response.statusText));
  } 
  else 
  {
    return Promise.resolve(response);
  }
}

function json(response) {
  return response.json();
}

function error(error) {
  console.log("Error : " + error);
  // let jaringanPutus = `Error : TypeError: Failed to fetch`;
  // if(jaringanPutus = true)
  // {
  //   console.error("Data belum tersedia atau mungkin Jaringan anda kurang stabil atau terputus!");
  //   swal({
  //     title: "Data belum tersedia atau mungkin Jaringan anda kurang stabil atau terputus!",
  //     text: "Mau muat ulang?",
  //     icon: "warning",
  //       buttons: true
  //   })
  //   .then((gooo) => {
  //       if (gooo) {
  //           swal("Loading...", {
  //               icon: "success",
  //           });
  //           window.location = "http://localhost:8080";
  //       }
  //   });
  // }

  //kalau kosong
  // let nullMatches = `Error : TypeError: Cannot read property 'numberOfMatches' of null`;
  // if(nullMatches = true)
  // {
  //   let numberOfMatchesHTML = ''
  //   console.log("NDAK ada numberOfMatches");
  //   numberOfMatchesHTML += `<h4 class="center">Data Pertandingan Belum Tersedia Semetara!</h4>`;
  //   document.getElementById("ndakAda").innerHTML = numberOfMatchesHTML;
  // }
}

function getPerToday() {
  if ('caches' in window) {
    caches.match(`${base_url}matches/`)
    .then(function (response) {
      if (response) {
        response.json().then(function (data) {
          pertTodayJSON(data);
        });
      }
    })
  }

  fetch(`${base_url}matches/`,
  {
    headers: {
      'X-Auth-Token' : token
    }
  })
  .then(status)
  .then(json)
  .then(function (data) {
    pertTodayJSON(data)
  })
  .catch(error);
}

function getPertTerakhir() {
  if ('caches' in window) {
    caches.match(`${base_url}teams/86/matches?status=FINISHED&limit=1`)
    .then(function (response) {
      if (response) {
        response.json().then(function (data) {
          PertTerakhirJSON(data);
        });
      }
    });
  }

  fetch(`${base_url}teams/86/matches?status=FINISHED&limit=1`,
  {
    headers: {
      'X-Auth-Token' : token
    }
  })
  .then(status)
  .then(json)
  .then(function (data) {
    PertTerakhirJSON(data)
  })
  .catch(error);
}

function getPertMendatang() {
  if ('caches' in window) {
    caches.match(`${base_url}teams/81/matches?status=SCHEDULED&limit=1`)
    .then(function (response) {
      if (response) {
        response.json().then(function (data) {
          pertMendatangJSON(data);
        });
      }
    });
  }

  fetch(`${base_url}teams/81/matches?status=SCHEDULED&limit=1`,
  {
    headers: {
      'X-Auth-Token' : token
    }
  })
  .then(status)
  .then(json)
  .then(function (data) {
    pertMendatangJSON(data)
  })
  .catch(error);
}

function getKlasemen() {
  if ('caches' in window) {
    caches.match(`${base_url}competitions/2001/standings/?standingType=TOTAL`)
    .then(function (response) {
      if (response) {
        response.json().then(function (data) {
          let tblKlsmnHTML = ''
          data.standings.forEach(function (klasemen) {
            let dataKlsmn = ''
            klasemen.table.forEach(function (dataK) {
              dataK = JSON.parse(JSON.stringify(dataK).replace(/http:/g, 'https:'));
              dataKlsmn += `<tr>
                <td class="center-align">${dataK.position}</td>
                <td class="center-align">
                <a href="./pages/tim.html?id=${dataK.team.id}">
                    <p class="hide-on-small-only">
                        <img class ="show-on-medium-and-up show-on-medium-and-down a-img-club-klasemen" src=${dataK.team.crestUrl}  alt="${dataK.team.name}">
                        ${dataK.team.name}
                    </p>
                    <p class="hide-on-med-and-up">
                        <img src=${dataK.team.crestUrl}  alt="${dataK.team.name}" class="a-img-club-klasemen">
                    </p>
                </a>
                </td>
                <td class="center-align">${dataK.playedGames}</td>
                <td class="center-align">${dataK.won}</td>
                <td class="center-align">${dataK.draw}</td>
                <td class="center-align">${dataK.lost}</td>
                <td class="center-align">${dataK.goalsFor}</td>
                <td class="center-align">${dataK.goalsAgainst}</td>
                <td class="center-align">${dataK.goalDifference}</td>
                <td class="center-align">${dataK.points}</td>
            </tr>`
            })

            tblKlsmnHTML += `
        <div class="card">
            <div class="card-content">
                <h6 class="a-font-bold a-mb-2">Last Updated: ${convertDate(new Date(data.competition.lastUpdated))}</h6> 
                <table class="responsive-table striped " >
                    <thead>
                    <tr>
                        <th class="center-align">Position</th>
                        <th>Team</th>
                        <th class="center-align">Played</th>
                        <th class="center-align">Won</th>
                        <th class="center-align">Draw</th>
                        <th class="center-align">Lost</th>
                        <th class="center-align">GF</th>
                        <th class="center-align">GA</th>
                        <th class="center-align">GD</th>
                        <th class="center-align">Points</th>
                    </tr>
                    </thead>
                    <tbody>` + dataKlsmn + `</tbody>
                </table>
            </div>
        </div>`
          });

          document.getElementById("klasemen").innerHTML = tblKlsmnHTML;
        });
      }
    });
  }
  fetch(`${base_url}competitions/2001/standings/?standingType=TOTAL`,
  {
    headers : {
      'X-Auth-Token' : token
    }
  })
  .then(status)
  .then(json)
  .then(function (data) {
    console.log(data);
    let tblKlsmnHTML = ''
    data.standings.forEach(function (klasemen) {
      let dataKlsmn = ''
      klasemen.table.forEach(function (dataK) {
        dataK = JSON.parse(JSON.stringify(dataK).replace(/http:/g, 'https:'));
        dataKlsmn += `<tr>
              <td class="center-align">${dataK.position}</td>
              <td class="center-align">
              <a href="./pages/tim.html?id=${dataK.team.id}">
                  <p class="hide-on-small-only">
                      <img class ="show-on-medium-and-up show-on-medium-and-down a-img-club-klasemen" src=${dataK.team.crestUrl}  alt="${dataK.team.name}">
                      ${dataK.team.name}
                  </p>
                  <p class="hide-on-med-and-up">
                      <img src=${dataK.team.crestUrl}  alt="${dataK.team.name}" class="a-img-club-klasemen">
                  </p>
              </a>
              </td>
              <td colspan="2" class="center-align">${dataK.playedGames}</td>
              <td class="center-align">${dataK.won}</td>
              <td class="center-align">${dataK.draw}</td>
              <td class="center-align">${dataK.lost}</td>
              <td class="center-align">${dataK.goalsFor}</td>
              <td class="center-align">${dataK.goalsAgainst}</td>
              <td class="center-align">${dataK.goalDifference}</td>
              <td class="center-align">${dataK.points}</td>
          </tr>`
      })      
      tblKlsmnHTML += `
      <div class="card">
          <div class="card-content">
              <h6 class="a-font-bold a-mb-2">Last Updated: ${convertDate(new Date(data.competition.lastUpdated))}</h6> 
              <table class="responsive-table striped " >
                  <thead>
                  <tr>
                      <th class="center-align">Position</th>
                      <th colspan="2" class="center-align">Club</th>
                      <th class="center-align">Played</th>
                      <th class="center-align">Won</th>
                      <th class="center-align">Draw</th>
                      <th class="center-align">Lost</th>
                      <th class="center-align">GF</th>
                      <th class="center-align">GA</th>
                      <th class="center-align">GD</th>
                      <th class="center-align">Points</th>
                  </tr>
                  </thead>
                  <tbody>` + dataKlsmn + `</tbody>
              </table>
          </div>
      </div>`
    });

    document.getElementById("klasemen").innerHTML = tblKlsmnHTML;
  })
  .catch(error);
}

function getJadwalTanding() {
  return new Promise(function (resolve, reject) {
    if ('caches' in window) {
      caches.match(`${base_url}competitions/2001/matches?status=SCHEDULED&limit=10`)
      .then(function (response) {
        if (response) {
          response.json().then(function (data) {
            let JadwalHTML = ''
            data.matches.forEach(function (match) {
              JadwalHTML += `
        <div class="col s12 m6 l6">
            <div class="card horizontal">
                <div class="card-image">
                    <img src="../img/indigo.png">
                </div>
                <div class="card-stacked">
                    <div class="card-content">
                        <div center-align>
                            <h5 class="center">Matchday : ${match.matchday}</h5>
                            <div class="center">Kick Off : ${convertDate(new Date(match.utcDate))}</div>
                            <div class="row" style="margin:20px">
                                <div class="col s5 truncate right-align">
                                    <span class="teal-text"> ${match.homeTeam.name}</span>
                                </div>
                                <div class="col s2 ">
                                    VS
                                </div>
                                <div class="col s5 truncate left-align">
                                    <span class="teal-text"> ${match.awayTeam.name}</span>
                                </div>
                            </div>
                            <div class="center">
                                <a class="brown darken-3 waves-effect waves-light btn"
                                    href="./pages/tanding.html?id=${match.id}">Detail <i
                                        class="material-icons right">navigate_next</i></a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>`
            });
            document.getElementById("jadwal").innerHTML = JadwalHTML;
            resolve(data);
          });
        }
      });
    }
    fetch(`${base_url}competitions/2001/matches?status=SCHEDULED&limit=10`,
    {
      headers : {
        'X-Auth-Token' : token
      }
    })
    .then(status)
    .then(json)
    .then(function (data) {
      resolve(data);
      let JadwalHTML = ''
      data.matches.forEach(function (match) {
        JadwalHTML += `
      <div class="col s12 m6 l6">
          <div class="card horizontal">
              <div class="card-image">
                  <img src="../img/indigo.png">
              </div>
              <div class="card-stacked">
                  <div class="card-content">
                      <div center-align>
                          <h5 class="center">Matchday : ${match.matchday}</h5>
                          <div class="center">Kick Off : ${convertDate(new Date(match.utcDate))}</div>
                          <div class="row" style="margin:20px">
                              <div class="col s5 truncate right-align">
                                  <span class="teal-text"> ${match.homeTeam.name}</span>
                              </div>
                              <div class="col s2 ">
                                  VS
                              </div>
                              <div class="col s5 truncate left-align">
                                  <span class="teal-text"> ${match.awayTeam.name}</span>
                              </div>
                          </div>
                          <div class="center">
                              <a class="brown darken-3 waves-effect waves-light btn"
                                  href="./pages/tanding.html?id=${match.id}">Detail <i
                                      class="material-icons right">navigate_next</i></a>
                          </div>
                      </div>
                  </div>
              </div>
          </div>
      </div>`
      });
      document.getElementById("jadwal").innerHTML = JadwalHTML;
    })
    .catch(error);
  });
}

function getDetailTandingById() {
  return new Promise(function (resolve, reject) {
    const urlParams = new URLSearchParams(window.location.search);
    const idParam = urlParams.get("id");
    if ('caches' in window) {
      caches.match(`${base_url}matches/${idParam}`)
      .then(function (response) {
        if (response) {
          response.json().then(function (data) {
            const matchDay = data.match.matchday;
            const kickOff = convertDate(new Date(data.match.utcDate));
            const homeTeamName = data.match.homeTeam.name;
            const awayTeamName = data.match.awayTeam.name;
            const numberOfMatches = data.head2head.numberOfMatches;
            const totalGoals = data.head2head.totalGoals;
            const homeTeamWins = data.head2head.homeTeam.wins;
            const awayTeamWins = data.head2head.awayTeam.wins;
            const homeTeamDraws = data.head2head.homeTeam.draws;
            const awayTeamDraws = data.head2head.awayTeam.draws;
            const homeTeamLosses = data.head2head.homeTeam.losses;
            const awayTeamLosses = data.head2head.awayTeam.losses;
            const venue = data.match.venue;
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
            resolve(data);
          });
        }
      });
    }
    fetch(`${base_url}matches/${idParam}`,
    {
      headers : {
        'X-Auth-Token' : token
      }
    })
    .then(status)
    .then(json)
    .then(function (data) {
      const matchDay = data.match.matchday;
      const kickOff = convertDate(new Date(data.match.utcDate));
      const homeTeamName = data.match.homeTeam.name;
      const awayTeamName = data.match.awayTeam.name;
      const numberOfMatches = data.head2head.numberOfMatches;
      const totalGoals = data.head2head.totalGoals;
      const homeTeamWins = data.head2head.homeTeam.wins;
      const awayTeamWins = data.head2head.awayTeam.wins;
      const homeTeamDraws = data.head2head.homeTeam.draws;
      const awayTeamDraws = data.head2head.awayTeam.draws;
      const homeTeamLosses = data.head2head.homeTeam.losses;
      const awayTeamLosses = data.head2head.awayTeam.losses;
      const venue = data.match.venue;
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
      resolve(data);
    })
    .catch(error);
  })
}

function getDetailTeamById() {
  return new Promise(function (resolve, reject) {
    let urlParams = new URLSearchParams(window.location.search);
    let idParam = urlParams.get("id");
    let dataPemainLeftHTML = ''
    let dataPemainRightHTML = ''
    if ("caches" in window) {
      caches.match(`${base_url}teams/${idParam}`)
      .then(function (response) {
        if (response) {
          response.json().then(function (data) {
            data = JSON.parse(JSON.stringify(data).replace(/http:/g, 'https:'));
            document.getElementById("a-namaklub").innerHTML = data.name;
            document.getElementById("a-logoklub").src = data.crestUrl;
            document.getElementById("a-name").innerHTML = data.name;
            document.getElementById("a-shortName").innerHTML = data.shortName;
            document.getElementById("a-tla").innerHTML = data.tla;
            document.getElementById("a-address").innerHTML = data.address;
            document.getElementById("a-phone").innerHTML = data.phone;
            document.getElementById("a-website").innerHTML = data.website;
            document.getElementById("a-email").innerHTML = data.email;
            document.getElementById("a-founded").innerHTML = data.founded;
            document.getElementById("a-clubColors").innerHTML = data.clubColors;
            document.getElementById("a-venue").innerHTML = data.venue;
            document.getElementById("a-preloader1").innerHTML = '';
            document.getElementById("a-preloader2").innerHTML = '';
            document.getElementById("a-websitee").innerHTML = `<a href="${data.website}" target="_blank">${data.website}</a>`;
            data.squad.forEach(function (squad, index) {
              if (index < (data.squad.length / 2)) {
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
                </div>
              `
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
            resolve(data);
          });
        }
      });
    }
    fetch(`${base_url}teams/${idParam}`,
    {
      headers : {
        'X-Auth-Token' : token
      }
    })
    .then(status)
    .then(json)
    .then(function (data) {
      data = JSON.parse(JSON.stringify(data).replace(/http:/g, 'https:'));
      document.getElementById("a-namaklub").innerHTML = data.name;
      document.getElementById("a-logoklub").src = data.crestUrl;
      document.getElementById("a-name").innerHTML = data.name;
      document.getElementById("a-shortName").innerHTML = data.shortName;
      document.getElementById("a-tla").innerHTML = data.tla;
      document.getElementById("a-address").innerHTML = data.address;
      document.getElementById("a-phone").innerHTML = data.phone;
      document.getElementById("a-website").innerHTML = data.website;
      document.getElementById("a-email").innerHTML = data.email;
      document.getElementById("a-founded").innerHTML = data.founded;
      document.getElementById("a-clubColors").innerHTML = data.clubColors;
      document.getElementById("a-venue").innerHTML = data.venue;
      document.getElementById("a-preloader1").innerHTML = '';
      document.getElementById("a-preloader2").innerHTML = '';
      document.getElementById("a-websitee").innerHTML = `<a href="${data.website}" target="_blank">${data.website}</a>`;
      dataTimJSON = data;
      data.squad.forEach(function (squad, index) {
        dataSquadJSON = squad;
        if (squad.position === null) {
          squad.position = "Coach"
        }
        if (index < (data.squad.length / 2)) {
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
            </div>
        `
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
      resolve(data);
    })
    .catch(error);
  });
}