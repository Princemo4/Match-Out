    let scores = [{"username":"max_verstappen","score":8583777,"level":18},{"username":"charles_leclerc","score":3583000,"level":8},{"username":"sergio_perez","score":3050000,"level":7},{"username":"george_russell","score":2750000,"level":14},{"username":"lance_stroll","score":2640000,"level":6},{"username":"lewis_hamilton","score":2580000,"level":9},{"username":"valtteri_bottas","score":2550000,"level":10},{"username":"pierre_gasly","score":2332000,"level":5}];

    
    let storedScoreboard = JSON.parse(localStorage.getItem("scoreboard"))

    if (storedScoreboard && storedScoreboard.length > 0) {
      //do nothing
      storedScoreboard = storedScoreboard.sort((a, b) => b.score - a.score)
    } else {
      localStorage.setItem("scoreboard", JSON.stringify(scores));
      storedScoreboard = scores.sort((a, b) => b.score - a.score);
    }


    let scoreboardTable = document.getElementById("scoreboard-table");
    
    for (let i = 0; i < storedScoreboard.length; i++) {
      let row = document.createElement("tr");
      row.className = "c-table__row";
      let place = document.createElement("td");
      place.className = "c-table__cell c-table__cell--place u-text--center";
      let placeSpan = document.createElement("span");
      placeSpan.className = "c-place";
      if (i < 3) placeSpan.classList.add("c-place--" + ["first", "second", "third"][i]);
      placeSpan.innerHTML = i + 1;
      place.appendChild(placeSpan);
      let levelElement = '<small style="opacity: .4;"> highest level :   ' + storedScoreboard[i].level + '</small>';
      let username = document.createElement("td");
      username.className = "c-table__cell c-table__cell--name";
      username.innerHTML = storedScoreboard[i].username + "<br>" + levelElement;
      let score = document.createElement("td");
      score.className = "c-table__cell c-table__cell--count u-text--right";
      score.innerHTML = "<strong>" + storedScoreboard[i].score + "</strong>";
      row.appendChild(place);
      row.appendChild(username);
      row.appendChild(score);
      scoreboardTable.appendChild(row);
    }