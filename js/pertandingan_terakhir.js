function PertTerakhirJSON(data) {
    var TerakhirHTML = ''
    data.matches.forEach(function (terakhir) {
        terakhir = JSON.parse(JSON.stringify(terakhir).replace(/http:/g, 'https:'));
        TerakhirHTML += `
        <h4>${terakhir.score.fullTime.homeTeam} : ${terakhir.score.fullTime.awayTeam}</h4>
        <p><b>${terakhir.homeTeam.name} VS ${terakhir.awayTeam.name}</b></p>
        <ul class="a-stadium">
            <p>${terakhir.competition.name}</p>
        </ul>
        <p><b>${convertDate(new Date(terakhir.utcDate))}</b></p>`
    });
    document.getElementById("terakhir-content").innerHTML = TerakhirHTML;
}