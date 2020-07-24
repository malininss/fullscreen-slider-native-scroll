const sections = Array.from(document.querySelectorAll('.section'));

let currentSection;

const getCoords = elem => {
  var box = elem.getBoundingClientRect();
  return {
    top: box.top + pageYOffset,
    bottom: box.bottom + pageYOffset
  };
}

changeSectionVisible = () => {
  sections.forEach(item => {
    const fixedBlock = item.querySelector('.fixed-block')
    elemCoords = getCoords(item)
    if (pageYOffset >= elemCoords.top && elemCoords.bottom >= pageYOffset) {
      currentSection = item;
      fixedBlock.classList.add('fix');
    } else {
      fixedBlock.classList.remove('fix');
    }
  })
}

const calcScrollPercent = () => {
  if (currentSection) {
    return Math.floor((pageYOffset - getCoords(currentSection).top) / currentSection.clientHeight * 100);
  }
}

document.addEventListener('scroll', () => {
  changeSectionVisible();
  const currentBg = currentSection.querySelector('.fixed-block__bg');


  if (sections.indexOf(currentSection) !== 0) {
    if (calcScrollPercent() <= 25) {
      if (currentBg.classList.contains('white-to-black')) {
         currentBg.style.backgroundColor = '#fff';
      }
     
      currentBg.style.opacity = 100 - calcScrollPercent() * 4 + '%';
    }
  } 
  
  if (calcScrollPercent() >= 75) {
    if (currentBg.classList.contains('white-to-black')) {
      currentBg.style.backgroundColor = '#000';
   }
    currentBg.style.opacity = (calcScrollPercent() - 75) * 5 + '%';
  } 
  
  if (calcScrollPercent() >= 25 && calcScrollPercent() <= 75) {
    currentBg.style.opacity = 0;
  }

});

changeSectionVisible();













// const fixCoords = {};

// sections.forEach(item => {
//   fixCoords[item.className.split(' ')[0]] = {
//     top: getCoords(item).top,
//     bottom: getCoords(item).bottom
//   }
// })