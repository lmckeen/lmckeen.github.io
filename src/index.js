var delay = false
var touchStartRef
var activePage
var allPages = document.querySelectorAll('.page')

// on load if there is a hash in the url, load the page number specified
// else set the active page to the main page and update the history
if (location.hash) {
  var index = location.hash.replace(/[^0-9]/g, '') - 1
  activePage = allPages[index]

  allPages.forEach(function(item, i) {
    if (i < index) {
      item.classList.add('scroll')
    }
  }) 
} else {
  activePage = document.querySelector('main')
  updateHistory()
}

// animation delay for changing pages 
function delayPage() {
  if (delay) return true

  delay = true
  setTimeout(function() {
    delay = false
  }, 500)

  return false
}

// update the url and history to the active page
function updateHistory(isReveal) {
  var pageIndex = 1;
  var url = isReveal ? '#/Reveal' : '#/'

  allPages.forEach(function(item, i) {
    if (activePage === item) {
      pageIndex = i + 1
    }
  })

  history.pushState({}, "", url + pageIndex)
}

// remove class to scroll up a page
function scrollUp () {
  var pages = document.querySelectorAll('.page.scroll')

  if (pages.length > 0) {
    pages[pages.length-1].classList.remove('scroll')
  }
}

// add class to scroll down a page
function scrollDown () {
  var pages = document.querySelectorAll('.page:not(.scroll)')

  if (pages.length > 1) {
    pages[0].classList.add('scroll')
  }
}

// scroll to the next active [age and update the url history
function scroll (isUp) {
  if (delayPage() || document.querySelector('.page.reveal')) return

  if (isUp) {
    scrollUp()
  } else {
    scrollDown()
  }

  activePage = document.querySelector('.page:not(.scroll)')
  updateHistory(false)
}

// scroll event for changing pages
document.addEventListener('wheel', function(e) {
  scroll(e.deltaY < 0)
})

// touch events for changing pages
document.addEventListener('touchstart', function(e) {
  e.preventDefault()
  touchStartRef = e
})

document.addEventListener('touchend', function(touchEndRef) {
  var scrollBuffer = 50;
  var touchStartData = touchStartRef.changedTouches[0]
  var touchEndData = touchEndRef.changedTouches[0]
  var xDiff = Math.abs(touchStartData.clientX - touchEndData.clientX)
  var yDiff = Math.abs(touchStartData.clientY - touchEndData.clientY)

  if (xDiff > yDiff || yDiff < scrollBuffer) return
  
  scroll(touchStartData.clientY < touchEndData.clientY)
})

// click event for showing and hiding reveal panel
// TODO refactor this so it is not a click on the whole page
document.addEventListener('click', function(e) {
  if (delayPage()) return

  if (e.target.classList.contains('back-button')) {
    document.querySelector('.reveal').classList.remove('reveal')
    updateHistory(false)
    return
  }
  
  if (activePage.querySelector('.contents') && !e.target.querySelector('a')) {
    activePage.classList.add('reveal')
    updateHistory(true)
  }
})

// initialize service worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', function() {
    navigator.serviceWorker.register('./sw.js')
  });
}