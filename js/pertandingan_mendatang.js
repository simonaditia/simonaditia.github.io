function pertMendatangJSON(data) {
    let MendatangHTML = ''
    data.matches.forEach(function (mendatang) {
        mendatang = JSON.parse(JSON.stringify(mendatang).replace(/http:/g, 'https:'));
        MendatangHTML += `
        <h4>- : -</h4>
        <p><b>${mendatang.homeTeam.name} VS ${mendatang.awayTeam.name}</b></p>
        <p>${mendatang.competition.name}</p>
        <p><b>${convertDate(new Date(mendatang.utcDate))}</b></p>`;
    });
    console.log("Pertandingan Mendatang = " + data.matches.length);
    if(data.matches.length == 0)
    {
        MendatangHTML += `<h5 class="center">Belum Tersedia</h5>`;
    }
    document.getElementById("mendatang-content").innerHTML = MendatangHTML;
}