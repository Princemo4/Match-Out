let sampleIcons = ['smurf', 'amethyst', 'catwoman', 'keiji', 'peter_pan', 'avatar', 'cookie_monster', 'dobby', 'harry_potter', 'joker', 'stan_marsh', 'trinity', 'undyne', 'wonder_woman', 'yoda']
let baselineBoxImages = []
let level = sessionStorage.getItem('level') || 20
let numberOfIcons = level * 3
let winningIcon;
let testbox = document.querySelector('#testbox')
let lives = sessionStorage.getItem('lives') || 3
let finalIcons = []
let interval;
let levelPoints = 0;
let timePoints = 0;


function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function displayStatus(){
  let levelShown =  document.getElementById('level')
  let scoreElement = document.querySelector('#score')
  scoreElement.innerHTML = sessionStorage.getItem('score') || 0
  levelShown.innerHTML = level
}
function startTimer() {
  let timer = document.querySelector('#timer')
  let time = 20
  timer.innerHTML = time
  interval = setInterval(function () {
    time--
    timer.innerHTML = time
    if (time < 6 && time > 0) {
      playAudio('sounds/1sec_warning.wav')
    }
    if (time === 0) {

      playAudio('sounds/you_lost.wav')
      clearInterval(interval)
      // display modal with game over
      let modal = document.querySelector('.modal')
      let modalbackdrop = document.querySelector('#modal-backdrop')
      modalbackdrop.classList.add('show')
      modal.style.display = 'block'
      let modalContent = document.querySelector('.modal-content')
      modalContent.innerHTML = `
        <h2 class="text-danger">Game Over</h2>
        <br>
        <h4>Time Ran Out</h4>
        <hr>
        <button href="#" onclick="location.reload()" >Play Again</button> 
      `

      level = 1
      sessionStorage.setItem('level', level)
      resetCurrentScore()

    }
  }, 1000)
}

function resizeImagesBasedOnLevel() {
  // each level increases by 3x the number of icons
  // switch (level) {
  //   case 1:
  //     imageWidth = 33
  //     break;
  //   case 2:
  //     imageWidth = 100 / 6
  //     break;
  //   case 3:
  //     numberOfIcons = 9
  //     break;
  //   case 4:
  //     numberOfIcons = 12
  //     break;
  //   case 5:
  //     numberOfIcons = 15
  //     break;
  //   default:
  //     numberOfIcons = 18
  //     break;
  // }

  if (level >= 0) {
    let imageWidth;
    let numberOfIcons = document.querySelectorAll('.game-icon').length
    if (numberOfIcons == 3) {
      imageWidth = 25
    }
    if (numberOfIcons == 6) {
      imageWidth = 100 / 6
    }
    if (numberOfIcons == 9) {
      imageWidth = 19
    }
    if (numberOfIcons == 12) {
      imageWidth = 100 / (12 / 2) 
    } 

    if (numberOfIcons == 15) {
      imageWidth = 100 / (15 / 3) 
    }

    if (numberOfIcons > 15) {
      imageWidth = (100 / level) < 4 ? 4 : (100 / level)
    }

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
  finalIcons.forEach( (icon, index) => {
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

  let testbox = document.querySelector('#testbox')
  testbox.innerHTML = ''
  // get textbox width
  let textboxWidth = testbox.offsetWidth
  // fill the textbox with images
  let imagesize = textboxWidth / numberOfIcons
  console.log('imagesize ', imagesize)
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
  levelPoints = (latestLevel * 1000)
  timePoints = (timeLeft * 100)

  let lastLevelScore = levelPoints + timePoints
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
  sessionStorage.removeItem('score')
  sessionStorage.removeItem('lives')
  // go to index.html
  window.location.href = './index.html'
}

// function displayCurrentScore() {
//   let scoreElement = document.querySelector('#score')
//   let currentScore = sessionStorage.getItem('score')
//   scoreElement.innerHTML = `<h4>Current Score: ${currentScore}</h4>`
// }

function resetCurrentScore() {
  sessionStorage.setItem('score', 0)
  sessionStorage.setItem('lives', 3)
  return true;
}

function playAudio(soundfile) {
  settings = JSON.parse(localStorage.getItem('settings')) || {}
  if (true) {
    let audio = new Audio(soundfile)
    audio.play()
  }
}

function displayLives() {
  let livesElement = document.querySelector('#lives')
  let heart = document.createElement('img')
  heart.src = 'images/heart.png'
  livesElement.innerHTML = ''
  for (let i = 0; i < lives; i++) {
    livesElement.appendChild(heart.cloneNode())
  }
}

function main() {
  getusername()
  displayStatus()
  showScoreboard()
  createImages()
  resizeImagesBasedOnLevel()
  displayLives()
  if (level > 3) {
    let speed = 9000 / level 
    setInterval(shiftIconPosition, speed)
  }
  testbox.addEventListener('click', async function (event) {
    console.log(event.target)
    if (event.target === winningIcon) {
      clearInterval(interval)
      calculateScore(level, document.querySelector('#timer').innerHTML)
      winningIcon.classList.remove('icon-flipped')
      playAudio('sounds/correct_click.wav')
      let modal = document.querySelector('.modal')
      modal.style.display = 'block'
      let modalbackdrop = document.querySelector('#modal-backdrop')
      modalbackdrop.classList.add('show')
      let modalContent = document.querySelector('.modal-content')
      modalContent.innerHTML = `
        <h2>YOU WIN</h2>
        <br>
        <h4>Level Points: ${levelPoints}</h4>
        <h4>Time Points: ${timePoints}</h4>
        <h4 class="text-primary"><strong>Total Points: ${levelPoints + timePoints}</strong></h4>
        <hr>
        <h4><button id="next-level" onclick="location.reload()">Next Level</button></h4>
      `
      level++
      sessionStorage.setItem('level', level)
      // reload page

    } else {
      icon = event.target
      icon.classList.add('shake');
      lives--;
      playAudio('sounds/wrong_click.wav')
      sessionStorage.setItem('lives', lives)
      // let livesLeft = document.getElementById('lives')
      // livesLeft.innerHTML = lives
      displayLives()
      setTimeout(function () {
        icon.classList.remove('shake');
      }, 500); 
    }

    if (lives === 0) {
      level = 1
      sessionStorage.setItem('level', level)
      resetCurrentScore()
      let modal = document.querySelector('.modal')
      modal.style.display = 'block'
      let modalbackdrop = document.querySelector('#modal-backdrop')
      modalbackdrop.classList.add('show')
      let modalContent = document.querySelector('.modal-content')
      modalContent.innerHTML = `
        <h2 class="text-danger">GAME OVER</h2>
        <h3>YOU ARE OUT OF LIVES</h3>
        <hr>
        <button id="next-level" onclick="location.reload()" >PLAY AGAIN</button>
      `
      clearInterval(interval)
    }
  })

  startTimer()

}

main()