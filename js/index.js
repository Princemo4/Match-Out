let sampleIcons = ['smurf', 'amethyst', 'catwoman', 'keiji', 'peter_pan', 'avatar', 'cookie_monster', 'dobby', 'harry_potter', 'joker', 'stan_marsh', 'trinity', 'undyne', 'wonder_woman', 'yoda']
let baselineBoxImages = []
let level = sessionStorage.getItem('level') || 1
let numberOfIcons = level * 3
let winningIcon;
let testbox = document.querySelector('#testbox')
let lives = 3
let finalIcons = []
let interval;

function displayStatus(){
  let levelShown =  document.getElementById('level')
  levelShown.innerHTML = level
}
function startTimer() {
  let timer = document.querySelector('#timer')
  let time = 5
  timer.innerHTML = time
  interval = setInterval(function () {
    time--
    timer.innerHTML = time
    if (time < 6 && time > 0) {
      let audio = new Audio('sounds/1sec_warning.wav')
      audio.play()
    }
    if (time === 0) {
      let audio = new Audio('sounds/you_lost.wav')
      audio.play()
      clearInterval(interval)
      // display modal with game over
      let modal = document.querySelector('.modal')
      modal.style.display = 'block'
      let modalContent = document.querySelector('.modal-content')
      modalContent.innerHTML = `
        <h2>Game Over</h2>
        <p>You lost all your lives</p>
        <p>Click <a href="./index.html">here</a> to play again</p>
      `

      level = 1
      sessionStorage.setItem('level', level)
      resetCurrentScore()

    }
  }, 1000)
}

function resizeImagesBasedOnLevel() {
  if (level > 0) {
    let imageWidth = (100 / level) < 4 ? 4 : (100 / level)
    imageWidth = imageWidth > 20 ? 20 : imageWidth
    let images = document.querySelectorAll('.game-icon')
    images.forEach( (image) => {
      image.style.width = `${imageWidth}%`
    })
  } 
}

function shiftIconPosition() {
  //  redraw the icons by moving the first icon to the end of the array
  let firstIcon = finalIcons.shift()
  finalIcons.push(firstIcon)
  // clear the current images
  document.querySelector('#testbox').innerHTML = ''
  // redraw the images
  finalIcons.forEach( (icon) => {
    document.querySelector('#testbox').appendChild(icon)
  })
}

function createImages() {
  let randomWinningIcon = Math.floor(Math.random() * numberOfIcons)
  let randomCombination = []

  for (let x = 0; x < level; x++) {
    let tempArray1 = sampleIcons.sort(() => Math.random() - 0.5)
    randomCombination.push(...tempArray1)
  }
  console.log(randomCombination)
  // clear the current images
  document.querySelector('#testbox').innerHTML = ''
  
  for (let i = 0; i < numberOfIcons; i++) {
    let img = document.createElement('img')
    img.src = `images/${randomCombination[i]}.svg`
    img.alt = randomCombination[i]
    img.classList.add('game-icon')
    if (i === randomWinningIcon) {
      img.classList.add('icon-flipped')
      winningIcon = img
    }
    document.querySelector('#testbox').appendChild(img)
    finalIcons.push(img)
  }     
}

function getusername() {
  if (sessionStorage.getItem('username') !== null) {
    return;
  }
  let username = prompt('Please enter your username')
  sessionStorage.setItem('username', username)
  let users = JSON.parse(localStorage.getItem('users'))
  if (users === null ) {
    users = []
  }
  if (users.indexOf(username) === -1) {
    users.push(username)
    localStorage.setItem('users', JSON.stringify(users))
  }
}

function showScoreboard() {
  // let scoreElement = document.querySelector('#scoreboard')
  // console.log('showing scoreboard', scoreElement)
  // let username = sessionStorage.getItem('username')
  // let scoreboard = JSON.parse(localStorage.getItem('scoreboard'))
  // if (scoreboard === null || scoreboard.length === 0) {
  //   scoreElement.innerHTML = 'No scores yet'
  //   localStorage.setItem('scoreboard', JSON.stringify([]))
  // } else {
  //   let currentScore = scoreboard.find( score => {
  //     return score.username === username
  //   })
  //   // show the 3 highest scores
  //   scoreboard.sort( (a, b) => {
  //     return b.score - a.score
  //   })
  //   scoreboard = scoreboard.slice(0, 3)
  //   let scoreboardHTML = scoreboard.map( (score) => {
  //     return `<i>${score.username}: ${score.score}</i> <hr>`
  //   })
  //   scoreElement.innerHTML = `<hr><h3>Highest Scores</h3>`
  //   scoreElement.innerHTML += `<p>${scoreboardHTML.join('')}</p>`

  // }
}

function calculateScore(latestLevel, timeLeft) {
  let username = sessionStorage.getItem('username')
  let scoreboard = JSON.parse(localStorage.getItem('scoreboard')) || []
  let userScoreboardEntry = scoreboard.find( score => {
    return score.username === username
  }) 
  
  if (userScoreboardEntry === undefined) {
    userScoreboardEntry = {
      username: username,
      score: 0,
      level: latestLevel
    }
    scoreboard.push(userScoreboardEntry)
    localStorage.setItem('scoreboard', JSON.stringify(scoreboard))
  }
  let lastLevelScore = (level * 1000) + (timeLeft * 100)
  let sessionScore = (parseInt(sessionStorage.getItem('score')) || 0) + lastLevelScore
  sessionStorage.setItem('score', sessionScore)

  if (sessionScore > userScoreboardEntry.score) {
    userScoreboardEntry.score = sessionScore
    console.log('scoreboard', scoreboard)
    scoreboard.map( score => {
      if (score.username === username) {
        score.score = sessionScore
      }
      return score
    })
    localStorage.setItem('scoreboard', JSON.stringify(scoreboard))

  }


}

function logout() {
  sessionStorage.removeItem('username')
  sessionStorage.removeItem('level')
  location.reload()
}

// function displayCurrentScore() {
//   let scoreElement = document.querySelector('#score')
//   let currentScore = sessionStorage.getItem('score')
//   scoreElement.innerHTML = `<h4>Current Score: ${currentScore}</h4>`
// }

function resetCurrentScore() {
  sessionStorage.setItem('score', 0)
  return true;
}

function changeBackground(){

}

function main() {
  getusername()
  displayStatus()
  showScoreboard()
  createImages()
  resizeImagesBasedOnLevel()
  if (level > 3) {
    setInterval(shiftIconPosition, 2000)
  }
  testbox.addEventListener('click', function (event) {
    console.log(event.target)
    if (event.target === winningIcon) {
      clearInterval(interval)
      calculateScore(level, document.querySelector('#timer').innerHTML)
      let audio = new Audio('sounds/correct_click.wav')
      audio.play()
      let modal = document.querySelector('.modal')
      modal.style.display = 'block'
      let modalContent = document.querySelector('.modal-content')
      modalContent.innerHTML = `
        <h2>YOU WIN</h2>
        <button id="next-level" onclick="location.reload()">Next Level</button>
      `
      level++
      sessionStorage.setItem('level', level)
      // reload page

    } else {
      icon = event.target
      icon.classList.add('shake');
      lives--;
      let livesLeft = document.getElementById('lives')
      livesLeft.innerHTML = lives
      setTimeout(function () {
        icon.classList.remove('shake');
      }, 500); 

    }

    if (lives === 0) {
      level = 1
      sessionStorage.setItem('level', level)
      resetCurrentScore()
      location.href = "./game_over.html"
    }
  })

  startTimer()

}

main()