document.querySelector('#logo').addEventListener('click', () => {
  //make the logo redirect user
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
document.onkeydown = function (e){
  if(e.key === "Escape"){
    console.log("escape pressed")
    if (location.pathname.includes('game.html')) {
      let exitConfirmation = confirm("Are you sure you want to go back to the main menu?")
      if (exitConfirmation) {
        location.href = 'index.html'
      } else {
        return
      }
    } 
  }
}