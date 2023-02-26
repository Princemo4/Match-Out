let sampleIcons = ['smurf', 'amethyst', 'catwoman', 'keiji', 'peter_pan', 'avatar', 'cookie_monster', 'dobby', 'harry_potter', 'joker', 'stan_marsh', 'trinity', 'undyne', 'wonder_woman', 'yoda']
let baselineBoxImages = []
level = sessionStorage.getItem('level') || 1
let numberOfIcons = level * 3
let winningIcon;
let testbox = document.querySelector('#testbox')
let lives = 3
let finalIcons = []
let interval;

function startTimer() {
  let timer = document.querySelector('#timer')
  let time = 30
  timer.innerHTML = time
  interval = setInterval(function () {
    time--
    timer.innerHTML = time
    if (time === 0) {
      clearInterval(interval)
      alert('You lose!')
      level = 1
      sessionStorage.setItem('level', level)
      location.reload();
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
  let scoreElement = document.querySelector('#score')
  let username = sessionStorage.getItem('username')
  let scoreboard = JSON.parse(localStorage.getItem('scoreboard'))
  if (scoreboard === null) {
    scoreElement.innerHTML = 'No scores yet'
    localStorage.setItem('scoreboard', JSON.stringify([]))
  }
}

function calculateScore(latestLevel, timeLeft) {
  let levelScore = (latestLevel * 1000) + (timeLeft * 100)
  let username = sessionStorage.getItem('username')
  let currentScores = JSON.parse(localStorage.getItem('scoreboard')) || []

  let currentScore = currentScores.find( (score) => {
    return score.username === username
  })
  currentScore = currentScore || {username, score: 0}
  score = levelScore + currentScore.score
  let scoreEntry = [...currentScores, {username, score}]
  localStorage.setItem('scoreboard', JSON.stringify(scoreEntry))

}

function main() {
  getusername()
  showScoreboard()
  createImages()
  resizeImagesBasedOnLevel()
  testbox.addEventListener('click', function (event) {
    console.log(event.target)
    if (event.target === winningIcon) {
      clearInterval(interval)
      alert('You win!')
      calculateScore(level, document.querySelector('#timer').innerHTML)
      level++
      sessionStorage.setItem('level', level)
      // reload page
      location.reload()
    } else {
      icon = event.target
      icon.classList.add('shake');
      lives--;
      setTimeout(function () {
        icon.classList.remove('shake');
      }, 500); 

    }

    if (lives === 0) {
      alert('You lose!')
      level = 1
      sessionStorage.setItem('level', level)
      location.reload();
    }
  })
  startTimer()

}

main()