function jadwalJSON(data) {
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
    console.log(data.matches.length);
      if(data.matches.length == 0)
      {
          JadwalHTML += `<h5 class="center">Belum Tersedia</h5>`;
      }
    document.getElementById("jadwal").innerHTML = JadwalHTML;
}