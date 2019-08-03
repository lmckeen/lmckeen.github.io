var delay = false
var touchStartRef
var activePage
var allPages = document.querySelectorAll('.page')

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

function delayPage() {
  if (delay) return true

  delay = true
  setTimeout(function() {
    delay = false
  }, 500)

  return false
}

function updateHistory(isReveal) {
  var pageIndex = 1;
  var url = isReveal ? '#Reveal' : '#'

  allPages.forEach(function(item, i) {
    if (activePage === item) {
      pageIndex = i + 1
    }
  })

  history.pushState({}, "", url + pageIndex)
}

function scrollUp () {
  var pages = document.querySelectorAll('.page.scroll')

  if (pages.length > 0) {
    pages[pages.length-1].classList.remove('scroll')
  }
}

function scrollDown () {
  var pages = document.querySelectorAll('.page:not(.scroll)')

  if (pages.length > 1) {
    pages[0].classList.add('scroll')
  }
}

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

document.addEventListener('wheel', function(e) {
  scroll(e.deltaY < 0)
})

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

if ('serviceWorker' in navigator) {
  window.addEventListener('load', function() {
    navigator.serviceWorker.register('./sw.js')
  });
}