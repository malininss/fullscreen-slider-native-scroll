class ScreenSlider {
  constructor(id) {
    this.mainContainer = document.querySelector(`#${id}`);

    if (!this.mainContainer) {
      throw(new Error('Id не передан в конструктор элемента ScreenSlider, либо элемент не найден на странице'));
    }

    this.sections = Array.from(this.mainContainer.querySelectorAll('.full-scroll__element'));
    this.fog = this.mainContainer.querySelector('.full-scroll__fog');

    this.smoke1 = this.mainContainer.querySelector('.full-scroll__smoke_bg1');
    this.smoke2 = this.mainContainer.querySelector('.full-scroll__smoke_bg2');
    this.smoke3 = this.mainContainer.querySelector('.full-scroll__smoke_bg3');


    this.currentSection = '';

    if (this.mainContainer.classList.contains('full-scroll__to-standart-scroll')) {
      this.toStandartScroll();
      return;
    }

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

      console.log(this.calcScrollPercent());


      //  дым выход
      if (this.calcScrollPercent() >= 40) {
        this.smoke1.style.opacity = 1;
      } 

      if (this.calcScrollPercent() >= 60) {
        this.smoke2.style.opacity = 1;
      } 

      if (this.calcScrollPercent() >= 75) {
        this.smoke3.style.opacity = 1;
      } 

      if (this.calcScrollPercent() >= 75) {
        this.fog.style.opacity = (this.calcScrollPercent() - 75) * 5 + '%';
      } 
    }


    // дым вход

    if (this.calcScrollPercent() >= 5 && this.calcScrollPercent() < 40) {
      this.smoke1.style.opacity = 0;
    } 

    if (this.calcScrollPercent() >= 10 && this.calcScrollPercent() < 40) {
      this.smoke2.style.opacity = 0;
    } 


    if (this.calcScrollPercent() >= 15 && this.calcScrollPercent() < 40) {
      this.smoke3.style.opacity = 0;
    } 

          


    if (this.calcScrollPercent() >= 25 && this.calcScrollPercent() <= 75) {
      if (this.currentSection.classList.contains('full-scroll__set-black-fog')) {
        this.fog.style.backgroundColor = '#000';
      } else {
        this.fog.style.backgroundColor = '#fdf5e6';
      }

      this.fog.style.opacity = 0;
      // this.smoke1.style.opacity = 0;
    }
  }

  eventHendler() {
    document.addEventListener('scroll', () => {
      this.changeElementVisible();
      this.setFogOpacity();
    });
  }

  toStandartScroll() {
    this.sections.forEach(item => {
      item.classList.add('full-scroll__element-standard-height');
    });
  }
}