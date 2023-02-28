    let storedScoreboard = JSON.parse(localStorage.getItem("scoreboard")).sort((a, b) => b.score - a.score);
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