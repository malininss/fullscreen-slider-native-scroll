class ScreenSlider {
  constructor() {
    this.sections = Array.from(document.querySelectorAll('.full-scroll__element'));
    this.fog = document.querySelector('.full-scroll__fog');
    this.currentSection = '';

    this.eventHendler();
    this.changeElementVisible();
  }


  getCoords(elem) {
    var box = elem.getBoundingClientRect();
    return {
      top: box.top + pageYOffset,
      bottom: box.bottom + pageYOffset
    };
  }
  
  calcScrollPercent() {
    if (this.currentSection) {
      return Math.floor((pageYOffset - this.getCoords(this.currentSection).top) / this.currentSection.clientHeight * 100);
    }
  }
  changeElementVisible() {
    this.sections.forEach(item => {
      const fixedBlock = item.querySelector('.full-scroll__fixed-wrapper');
      const elemCoords = this.getCoords(item);
      if (pageYOffset >= elemCoords.top && elemCoords.bottom >= pageYOffset) {
        this.currentSection = item;
        fixedBlock.classList.add('full-scroll__fix-state');
      } else {
        fixedBlock.classList.remove('full-scroll__fix-state');
      }

      if (this.currentSection === this.sections[this.sections.length - 1]) {
        if (pageYOffset >= this.getCoords(this.currentSection).bottom - window.innerHeight) {
          fixedBlock.classList.remove('full-scroll__fix-state');
          fixedBlock.classList.add('full-scroll__last-elem');
        } else {
          fixedBlock.classList.remove('full-scroll__last-elem');
        }
      } 
    });
  }
  
  setFogOpacity() {
    if (this.sections.indexOf(this.currentSection) !== 0) {
      if (this.calcScrollPercent() <= 25) {
        this.fog.style.opacity = 100 - this.calcScrollPercent() * 4 + '%'; 
      }
    } 
    
    if (this.currentSection !== this.sections[this.sections.length - 1]) {
      if (this.calcScrollPercent() >= 75) {
        this.fog.style.opacity = (this.calcScrollPercent() - 75) * 5 + '%';
      } 
    }

    if (this.calcScrollPercent() >= 25 && this.calcScrollPercent() <= 75) {
      if (this.currentSection.classList.contains('full-scroll__set-black-fog')) {
        this.fog.style.backgroundColor = '#000';
      } else {
        this.fog.style.backgroundColor = '#fff';
      }
      this.fog.style.opacity = 0;
    }
  }


  eventHendler() {
    document.addEventListener('scroll', () => {
      this.changeElementVisible();
      this.setFogOpacity();
    });
  }
}