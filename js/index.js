document.querySelector('#title').addEventListener('click', () => {
  if (location.pathname.includes('game.html')) {
    let exitConfirmation = confirm("Are you sure you want to go back to the main menu?")
    if (exitConfirmation) {
      location.href = 'index.html'
    } else {
      return
    }
  } else {
    location.href = 'index.html'

  }
})