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

    this.progressBar = this.mainContainer.querySelector('.full-scroll__progress-bar');

    this.currentSection = '';
    this.scrollDirection;

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
    // console.log(this.sections.indexOf(this.currentSection))
    if (this.sections.indexOf(this.currentSection) === this.sections.length - 1) {
      return Math.floor((pageYOffset - this.getCoords(this.currentSection).top) / (this.currentSection.clientHeight - window.innerHeight)  * 100);
    }

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
  
  
  setAboveBgOpacity() {

    // Показываем скроллбар
    this.progressBar.style.width = this.calcScrollPercent() + '%';
    
    // Если мы находимся не в области просмотра секции, все слоих сверху делаем прозрачными
    if (this.calcScrollPercent() === undefined || this.calcScrollPercent() < 0 || this.calcScrollPercent() > 100) {
      this.fog.style.opacity = 0;
      this.smoke1.style.opacity = 0;
      this.smoke2.style.opacity = 0;
      this.smoke3.style.opacity = 0;

      this.progressBar.style.width = 0;
      return;
    }

    // Обрабатываем скролл вниз
    if (this.direction === 'to-bottom') {

      // Для первого элемента не делаем анимаций "входа"
      if (this.sections.indexOf(this.currentSection) !== 0) {

        // Если скролл меньше 25%, то убираем прозрачность у "тумана".
        // и устанавливаем скорость транзишена, чтобы было плавно.
        if (this.calcScrollPercent() <= 25) {
          this.fog.style.transition = 'opacity 1s';
          this.fog.style.opacity = 0;
        } else {
          // Если нет, то возвращаем транзишн в стандартное положение
          this.fog.style.transition = 'opacity 0.2s';
        }
      }


      // Для последнего элемента не делаем анимаций "Выхода". 
      if (this.currentSection !== this.sections[this.sections.length - 1]) {

        //  Дым выход
        if (this.calcScrollPercent() >= 55) {
          this.smoke1.style.opacity = 1;
        } 

        if (this.calcScrollPercent() >= 65) {
          this.smoke2.style.opacity = 1;
        } 

        if (this.calcScrollPercent() >= 70) {
          this.smoke3.style.opacity = 1;
        } 

        if (this.calcScrollPercent() >= 75) {
          this.fog.style.opacity = (this.calcScrollPercent() - 75) * 5 + '%';
        } 
      }


      // Дым вход
      if (this.calcScrollPercent() >= 5 && this.calcScrollPercent() < 40 && this.direction === 'to-bottom') {
        this.smoke1.style.opacity = 0;
      } 

      if (this.calcScrollPercent() >= 13 && this.calcScrollPercent() < 40 && this.direction === 'to-bottom') {
        this.smoke2.style.opacity = 0;
      } 

      if (this.calcScrollPercent() >= 10 && this.calcScrollPercent() < 40 && this.direction === 'to-bottom') {
        this.smoke3.style.opacity = 0;
      } 

    }


    if (this.direction === 'to-top') {
      // Для первого элемента не делаем анимаций "входа"
      
      if (this.sections.indexOf(this.currentSection) !== 0) {

        // Делаем "затенение", если идём вверх
        if (this.calcScrollPercent() <= 25) {
          // console.log(125 - this.calcScrollPercent() * 4 + '%');
          this.fog.style.opacity = 125 - this.calcScrollPercent() * 4 + '%';
        } 

        // Дым при прокрутке вверх
        if (this.calcScrollPercent() <= 15) {
          this.smoke1.style.opacity = 1;
        } 

        if (this.calcScrollPercent() <= 23) {
          this.smoke2.style.opacity = 1;
        } 

        if (this.calcScrollPercent() <= 35) {
          this.smoke3.style.opacity = 1;
        } 
      }

      if (this.calcScrollPercent() >= 85) {
        this.fog.style.transition = 'opacity 1s';
        this.fog.style.opacity = 0;
      } else {
        // Если нет, то возвращаем транзишн в стандартное положение
        this.fog.style.transition = 'opacity 0.2s';
      }

      // Дым вверх затменение при переходе с предыдущего
      if (this.calcScrollPercent() <= 90 && this.calcScrollPercent() >= 50) {
        this.smoke1.style.opacity = 0;
      } 
  
      if (this.calcScrollPercent() <= 80 && this.calcScrollPercent() >= 50) {
        this.smoke2.style.opacity = 0;
      } 
  
      if (this.calcScrollPercent() <= 70 && this.calcScrollPercent() >= 50) {
        this.smoke3.style.opacity = 0;
      } 
      
    }

    // Меняем основной цвет
    if (this.calcScrollPercent() >= 40 && this.calcScrollPercent() <= 60) {

      if (this.currentSection.classList.contains('full-scroll__set-black-fog')) {
        this.fog.style.backgroundColor = '#030c1a';
        this.smoke1.style.backgroundImage = `url('img/smoke/1-black.png')`;
        this.smoke2.style.backgroundImage = `url('img/smoke/2-black.png')`;
        this.smoke3.style.backgroundImage = `url('img/smoke/3-black.png')`;
      } else {
        this.fog.style.backgroundColor = '#fdf5e6';
        this.smoke1.style.backgroundImage = `url('img/smoke/1.png')`;
        this.smoke2.style.backgroundImage = `url('img/smoke/2.png')`;
        this.smoke3.style.backgroundImage = `url('img/smoke/3.png')`;
      }
    }
  }

  eventHendler() {
    let offset = pageYOffset;
    
    document.addEventListener('scroll', () => {
      this.changeElementVisible();
      this.setAboveBgOpacity();
      
      if (pageYOffset - offset < 0) {
        this.direction = 'to-top';
      } else {
        this.direction = 'to-bottom';
      }
      offset = pageYOffset;

    });
  }

  toStandartScroll() {
    this.sections.forEach(item => {
      item.classList.add('full-scroll__element-standard-height');
    });
  }
}