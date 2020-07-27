"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var GetCoords = /*#__PURE__*/function () {
  function GetCoords() {
    _classCallCheck(this, GetCoords);
  }

  _createClass(GetCoords, null, [{
    key: "getCoords",
    value: function getCoords(element) {
      var box = element.getBoundingClientRect();
      return {
        top: box.top + pageYOffset,
        bottom: box.bottom + pageYOffset
      };
    }
  }]);

  return GetCoords;
}();

var AnchorAdder = /*#__PURE__*/function () {
  function AnchorAdder() {
    _classCallCheck(this, AnchorAdder);

    if (!history.pushState) {
      return;
    }

    this.scrollHandler();
  }

  _createClass(AnchorAdder, [{
    key: "addAnchor",
    value: function addAnchor(name) {
      var baseUrl = window.location.protocol + "//" + window.location.host + window.location.pathname;
      var newUrl = baseUrl + "#".concat(name);
      history.pushState(null, null, newUrl);
    }
  }, {
    key: "scrollHandler",
    value: function scrollHandler() {
      var _this = this;

      document.addEventListener('scroll', function () {
        // Надо вынести значения в отдельный массив, чтобы не пробегать каждый раз циклом
        _this.anchorsLink.forEach(function (item) {
          var anchorTopCoord = GetCoords.getCoords(item).top;

          if (pageYOffset >= anchorTopCoord && pageYOffset <= anchorTopCoord + 500) {
            _this.addAnchor(item.name);
          }
        });
      });
    }
  }, {
    key: "anchorsLink",
    get: function get() {
      return document.querySelectorAll('a.anchor');
    }
  }]);

  return AnchorAdder;
}();

var ScreenSlider = /*#__PURE__*/function () {
  function ScreenSlider(id) {
    _classCallCheck(this, ScreenSlider);

    this.mainContainer = document.querySelector("#".concat(id));

    if (!this.mainContainer) {
      throw new Error('Id не передан в конструктор элемента ScreenSlider, либо элемент не найден на странице');
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

  _createClass(ScreenSlider, [{
    key: "calcScrollPercent",
    value: function calcScrollPercent() {
      // console.log(this.sections.indexOf(this.currentSection))
      if (this.sections.indexOf(this.currentSection) === this.sections.length - 1) {
        return Math.floor((pageYOffset - GetCoords.getCoords(this.currentSection).top) / (this.currentSection.clientHeight - window.innerHeight) * 100);
      }

      if (this.currentSection) {
        return Math.floor((pageYOffset - GetCoords.getCoords(this.currentSection).top) / this.currentSection.clientHeight * 100);
      }
    }
  }, {
    key: "changeElementVisible",
    value: function changeElementVisible() {
      var _this2 = this;

      this.sections.forEach(function (item) {
        var fixedBlock = item.querySelector('.full-scroll__fixed-wrapper');
        var elemCoords = GetCoords.getCoords(item);

        if (pageYOffset >= elemCoords.top && elemCoords.bottom >= pageYOffset) {
          _this2.currentSection = item;
          fixedBlock.classList.add('full-scroll__fix-state');
        } else {
          fixedBlock.classList.remove('full-scroll__fix-state');
        }

        if (_this2.currentSection === _this2.sections[_this2.sections.length - 1]) {
          if (pageYOffset >= GetCoords.getCoords(_this2.currentSection).bottom - window.innerHeight) {
            fixedBlock.classList.remove('full-scroll__fix-state');
            fixedBlock.classList.add('full-scroll__last-elem');
          } else {
            fixedBlock.classList.remove('full-scroll__last-elem');
          }
        }
      });
    }
  }, {
    key: "setAboveBgOpacity",
    value: function setAboveBgOpacity() {
      // Показываем скроллбар
      this.progressBar.style.width = this.calcScrollPercent() + '%'; // Если мы находимся не в области просмотра секции, все слоих сверху делаем прозрачными

      if (this.calcScrollPercent() === undefined || this.calcScrollPercent() < 0 || this.calcScrollPercent() > 100) {
        this.fog.style.opacity = 0;
        this.smoke1.style.opacity = 0;
        this.smoke2.style.opacity = 0;
        this.smoke3.style.opacity = 0;
        this.progressBar.style.width = 0;
        return;
      } // Обрабатываем скролл вниз


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
        } // Для последнего элемента не делаем анимаций "Выхода". 


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
        } // Дым вход


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
          } // Дым при прокрутке вверх


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
        } // Дым вверх затменение при переходе с предыдущего


        if (this.calcScrollPercent() <= 90 && this.calcScrollPercent() >= 50) {
          this.smoke1.style.opacity = 0;
        }

        if (this.calcScrollPercent() <= 80 && this.calcScrollPercent() >= 50) {
          this.smoke2.style.opacity = 0;
        }

        if (this.calcScrollPercent() <= 75 && this.calcScrollPercent() >= 50) {
          this.smoke3.style.opacity = 0;
        }
      } // Меняем основной цвет


      if (this.calcScrollPercent() >= 40 && this.calcScrollPercent() <= 60) {
        if (this.currentSection.classList.contains('full-scroll__set-black-fog')) {
          this.fog.style.backgroundColor = '#030c1a';
          this.smoke1.style.backgroundImage = "url('img/smoke/1-black.png')";
          this.smoke2.style.backgroundImage = "url('img/smoke/2-black.png')";
          this.smoke3.style.backgroundImage = "url('img/smoke/3-black.png')";
        } else {
          this.fog.style.backgroundColor = '#fdf5e6';
          this.smoke1.style.backgroundImage = "url('img/smoke/1.png')";
          this.smoke2.style.backgroundImage = "url('img/smoke/2.png')";
          this.smoke3.style.backgroundImage = "url('img/smoke/3.png')";
        }
      }
    }
  }, {
    key: "eventHendler",
    value: function eventHendler() {
      var _this3 = this;

      var offset = pageYOffset;
      document.addEventListener('scroll', function () {
        _this3.changeElementVisible();

        _this3.setAboveBgOpacity();

        if (pageYOffset - offset < 0) {
          _this3.direction = 'to-top';
        } else {
          _this3.direction = 'to-bottom';
        }

        offset = pageYOffset;
      });
    }
  }, {
    key: "toStandartScroll",
    value: function toStandartScroll() {
      this.sections.forEach(function (item) {
        item.classList.add('full-scroll__element-standard-height');
      });
    }
  }]);

  return ScreenSlider;
}();

var sectionSlider = new ScreenSlider('full-scroll');
var sectionSlider2 = new ScreenSlider('full-scroll2');
var anchorAdder = new AnchorAdder();
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkdldENvb3Jkcy5qcyIsIkFuY2hvckFkZGVyLmpzIiwiU2NyZWVuU2xpZGVyLmpzIiwic2NyaXB0LmpzIl0sIm5hbWVzIjpbIkdldENvb3JkcyIsImVsZW1lbnQiLCJib3giLCJnZXRCb3VuZGluZ0NsaWVudFJlY3QiLCJ0b3AiLCJwYWdlWU9mZnNldCIsImJvdHRvbSIsIkFuY2hvckFkZGVyIiwiaGlzdG9yeSIsInB1c2hTdGF0ZSIsInNjcm9sbEhhbmRsZXIiLCJuYW1lIiwiYmFzZVVybCIsIndpbmRvdyIsImxvY2F0aW9uIiwicHJvdG9jb2wiLCJob3N0IiwicGF0aG5hbWUiLCJuZXdVcmwiLCJkb2N1bWVudCIsImFkZEV2ZW50TGlzdGVuZXIiLCJhbmNob3JzTGluayIsImZvckVhY2giLCJpdGVtIiwiYW5jaG9yVG9wQ29vcmQiLCJnZXRDb29yZHMiLCJhZGRBbmNob3IiLCJxdWVyeVNlbGVjdG9yQWxsIiwiU2NyZWVuU2xpZGVyIiwiaWQiLCJtYWluQ29udGFpbmVyIiwicXVlcnlTZWxlY3RvciIsIkVycm9yIiwic2VjdGlvbnMiLCJBcnJheSIsImZyb20iLCJmb2ciLCJzbW9rZTEiLCJzbW9rZTIiLCJzbW9rZTMiLCJwcm9ncmVzc0JhciIsImN1cnJlbnRTZWN0aW9uIiwic2Nyb2xsRGlyZWN0aW9uIiwiY2xhc3NMaXN0IiwiY29udGFpbnMiLCJ0b1N0YW5kYXJ0U2Nyb2xsIiwiZXZlbnRIZW5kbGVyIiwiY2hhbmdlRWxlbWVudFZpc2libGUiLCJpbmRleE9mIiwibGVuZ3RoIiwiTWF0aCIsImZsb29yIiwiY2xpZW50SGVpZ2h0IiwiaW5uZXJIZWlnaHQiLCJmaXhlZEJsb2NrIiwiZWxlbUNvb3JkcyIsImFkZCIsInJlbW92ZSIsInN0eWxlIiwid2lkdGgiLCJjYWxjU2Nyb2xsUGVyY2VudCIsInVuZGVmaW5lZCIsIm9wYWNpdHkiLCJkaXJlY3Rpb24iLCJ0cmFuc2l0aW9uIiwiYmFja2dyb3VuZENvbG9yIiwiYmFja2dyb3VuZEltYWdlIiwib2Zmc2V0Iiwic2V0QWJvdmVCZ09wYWNpdHkiLCJzZWN0aW9uU2xpZGVyIiwic2VjdGlvblNsaWRlcjIiLCJhbmNob3JBZGRlciJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7SUFBQUEsUzs7Ozs7Ozs4QkFDQUMsTyxFQUFBO0FBQ0EsVUFBQUMsR0FBQSxHQUFBRCxPQUFBLENBQUFFLHFCQUFBLEVBQUE7QUFFQSxhQUFBO0FBQ0FDLFFBQUFBLEdBQUEsRUFBQUYsR0FBQSxDQUFBRSxHQUFBLEdBQUFDLFdBREE7QUFFQUMsUUFBQUEsTUFBQSxFQUFBSixHQUFBLENBQUFJLE1BQUEsR0FBQUQ7QUFGQSxPQUFBO0FBSUE7Ozs7OztJQ1JBRSxXO0FBQ0EseUJBQUE7QUFBQTs7QUFDQSxRQUFBLENBQUFDLE9BQUEsQ0FBQUMsU0FBQSxFQUFBO0FBQ0E7QUFDQTs7QUFFQSxTQUFBQyxhQUFBO0FBQ0E7Ozs7OEJBRUFDLEksRUFBQTtBQUNBLFVBQUFDLE9BQUEsR0FBQUMsTUFBQSxDQUFBQyxRQUFBLENBQUFDLFFBQUEsR0FBQSxJQUFBLEdBQUFGLE1BQUEsQ0FBQUMsUUFBQSxDQUFBRSxJQUFBLEdBQUFILE1BQUEsQ0FBQUMsUUFBQSxDQUFBRyxRQUFBO0FBQ0EsVUFBQUMsTUFBQSxHQUFBTixPQUFBLGNBQUFELElBQUEsQ0FBQTtBQUNBSCxNQUFBQSxPQUFBLENBQUFDLFNBQUEsQ0FBQSxJQUFBLEVBQUEsSUFBQSxFQUFBUyxNQUFBO0FBQ0E7OztvQ0FFQTtBQUFBOztBQUNBQyxNQUFBQSxRQUFBLENBQUFDLGdCQUFBLENBQUEsUUFBQSxFQUFBLFlBQUE7QUFFQTtBQUVBLFFBQUEsS0FBQSxDQUFBQyxXQUFBLENBQUFDLE9BQUEsQ0FBQSxVQUFBQyxJQUFBLEVBQUE7QUFDQSxjQUFBQyxjQUFBLEdBQUF4QixTQUFBLENBQUF5QixTQUFBLENBQUFGLElBQUEsRUFBQW5CLEdBQUE7O0FBRUEsY0FBQUMsV0FBQSxJQUFBbUIsY0FBQSxJQUFBbkIsV0FBQSxJQUFBbUIsY0FBQSxHQUFBLEdBQUEsRUFBQTtBQUNBLFlBQUEs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ZUFBQTVCLE1BQUEsQ0FBQXFCLEtBQUEsQ0FBQVEsZUFBQTtBQUNBLGVBQUE1QixNQUFBLENBQUFvQixLQUFBLENBQUFRLGVBQUE7QUFDQSxlQUFBM0IsTUFBQSxDQUFBbUIsS0FBQSxDQUFBUSxlQUFBO0FBQ0E7QUFDQTtBQUNBOzs7bUNBRUE7QUFBQTs7QUFDQSxVQUFBQyxNQUFBLEdBQUE5RCxXQUFBO0FBRUFjLE1BQUFBLFFBQUEsQ0FBQUMsZ0JBQUEsQ0FBQSxRQUFBLEVBQUEsWUFBQTtBQUNBLFFBQUEsTUFBQSxDQUFBMkIsb0JBQUE7O0FBQ0EsUUFBQSxNQUFBLENBQUFxQixpQkFBQTs7QUFFQSxZQUFBL0QsV0FBQSxHQUFBOEQsTUFBQSxHQUFBLENBQUEsRUFBQTtBQUNBLFVBQUEsTUFBQSxDQUFBSixTQUFBLEdBQUEsUUFBQTtBQUNBLFNBRkEsTUFFQTtBQUNBLFVBQUEsTUFBQSxDQUFBQSxTQUFBLEdBQUEsV0FBQTtBQUNBOztBQUNBSSxRQUFBQSxNQUFBLEdBQUE5RCxXQUFBO0FBRUEsT0FYQTtBQVlBOzs7dUNBRUE7QUFDQSxXQUFBNEIsUUFBQSxDQUFBWCxPQUFBLENBQUEsVUFBQUMsSUFBQSxFQUFBO0FBQ0FBLFFBQUFBLElBQUEsQ0FBQW9CLFNBQUEsQ0FBQWEsR0FBQSxDQUFBLHNDQUFBO0FBQ0EsT0FGQTtBQUdBOzs7Ozs7QUM3TkEsSUFBQWEsYUFBQSxHQUFBLElBQUF6QyxZQUFBLENBQUEsYUFBQSxDQUFBO0FBQ0EsSUFBQTBDLGNBQUEsR0FBQSxJQUFBMUMsWUFBQSxDQUFBLGNBQUEsQ0FBQTtBQUNBLElBQUEyQyxXQUFBLEdBQUEsSUFBQWhFLFdBQUEsRUFBQSIsImZpbGUiOiJzY3JpcHQuanMiLCJzb3VyY2VzQ29udGVudCI6WyJjbGFzcyBHZXRDb29yZHMge1xuICBzdGF0aWMgZ2V0Q29vcmRzKGVsZW1lbnQpIHtcbiAgICBjb25zdCBib3ggPSBlbGVtZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgICBcbiAgICByZXR1cm4ge1xuICAgICAgdG9wOiBib3gudG9wICsgcGFnZVlPZmZzZXQsIFxuICAgICAgYm90dG9tOiBib3guYm90dG9tICsgcGFnZVlPZmZzZXQgIFxuICAgIH07IFxuICB9IFxufSIsImNsYXNzIEFuY2hvckFkZGVyIHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgaWYgKCFoaXN0b3J5LnB1c2hTdGF0ZSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHRoaXMuc2Nyb2xsSGFuZGxlcigpO1xuICB9XG5cbiAgYWRkQW5jaG9yKG5hbWUpIHtcbiAgICB2YXIgYmFzZVVybCA9IHdpbmRvdy5sb2NhdGlvbi5wcm90b2NvbCArIFwiLy9cIiArIHdpbmRvdy5sb2NhdGlvbi5ob3N0ICsgd2luZG93LmxvY2F0aW9uLnBhdGhuYW1lO1xuICAgIHZhciBuZXdVcmwgPSBiYXNlVXJsICsgYCMke25hbWV9YDtcbiAgICBoaXN0b3J5LnB1c2hTdGF0ZShudWxsLCBudWxsLCBuZXdVcmwpO1xuICB9IFxuXG4gIHNjcm9sbEhhbmRsZXIoKSB7XG4gICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignc2Nyb2xsJywgKCkgPT4ge1xuXG4gICAgICAvLyDQndCw0LTQviDQstGL0L3QtdGB0YLQuCDQt9C90LDRh9C10L3QuNGPINCyINC+0YLQtNC10LvRjNC90YvQuSDQvNCw0YHRgdC40LIsINGH0YLQvtCx0Ysg0L3QtSDQv9GA0L7QsdC10LPQsNGC0Ywg0LrQsNC20LTRi9C5INGA0LDQtyDRhtC40LrQu9C+0LxcblxuICAgICAgdGhpcy5hbmNob3JzTGluay5mb3JFYWNoKGl0ZW0gPT4ge1xuICAgICAgICBsZXQgYW5jaG9yVG9wQ29vcmQgPSBHZXRDb29yZHMuZ2V0Q29vcmRzKGl0ZW0pLnRvcDtcbiAgICAgICAgXG4gICAgICAgIGlmIChwYWdlWU9mZnNldCA+PSBhbmNob3JUb3BDb29yZCAmJiBwYWdlWU9mZnNldCA8PSBhbmNob3JUb3BDb29yZCArIDUwMCkge1xuICAgICAgICAgIHRoaXMuYWRkQW5jaG9yKGl0ZW0ubmFtZSk7XG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgfSk7XG4gIH1cblxuICBnZXQgYW5jaG9yc0xpbmsgKCkge1xuICAgIHJldHVybiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCdhLmFuY2hvcicpO1xuICB9XG59IiwiY2xhc3MgU2NyZWVuU2xpZGVyIHtcbiAgY29uc3RydWN0b3IoaWQpIHtcbiAgICB0aGlzLm1haW5Db250YWluZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGAjJHtpZH1gKTtcblxuICAgIGlmICghdGhpcy5tYWluQ29udGFpbmVyKSB7XG4gICAgICB0aHJvdyhuZXcgRXJyb3IoJ0lkINC90LUg0L/QtdGA0LXQtNCw0L0g0LIg0LrQvtC90YHRgtGA0YPQutGC0L7RgCDRjdC70LXQvNC10L3RgtCwIFNjcmVlblNsaWRlciwg0LvQuNCx0L4g0Y3Qu9C10LzQtdC90YIg0L3QtSDQvdCw0LnQtNC10L0g0L3QsCDRgdGC0YDQsNC90LjRhtC1JykpO1xuICAgIH1cblxuICAgIHRoaXMuc2VjdGlvbnMgPSBBcnJheS5mcm9tKHRoaXMubWFpbkNvbnRhaW5lci5xdWVyeVNlbGVjdG9yQWxsKCcuZnVsbC1zY3JvbGxfX2VsZW1lbnQnKSk7XG4gICAgdGhpcy5mb2cgPSB0aGlzLm1haW5Db250YWluZXIucXVlcnlTZWxlY3RvcignLmZ1bGwtc2Nyb2xsX19mb2cnKTtcblxuICAgIHRoaXMuc21va2UxID0gdGhpcy5tYWluQ29udGFpbmVyLnF1ZXJ5U2VsZWN0b3IoJy5mdWxsLXNjcm9sbF9fc21va2VfYmcxJyk7XG4gICAgdGhpcy5zbW9rZTIgPSB0aGlzLm1haW5Db250YWluZXIucXVlcnlTZWxlY3RvcignLmZ1bGwtc2Nyb2xsX19zbW9rZV9iZzInKTtcbiAgICB0aGlzLnNtb2tlMyA9IHRoaXMubWFpbkNvbnRhaW5lci5xdWVyeVNlbGVjdG9yKCcuZnVsbC1zY3JvbGxfX3Ntb2tlX2JnMycpO1xuXG4gICAgdGhpcy5wcm9ncmVzc0JhciA9IHRoaXMubWFpbkNvbnRhaW5lci5xdWVyeVNlbGVjdG9yKCcuZnVsbC1zY3JvbGxfX3Byb2dyZXNzLWJhcicpO1xuXG4gICAgdGhpcy5jdXJyZW50U2VjdGlvbiA9ICcnO1xuICAgIHRoaXMuc2Nyb2xsRGlyZWN0aW9uO1xuXG4gICAgaWYgKHRoaXMubWFpbkNvbnRhaW5lci5jbGFzc0xpc3QuY29udGFpbnMoJ2Z1bGwtc2Nyb2xsX190by1zdGFuZGFydC1zY3JvbGwnKSkge1xuICAgICAgdGhpcy50b1N0YW5kYXJ0U2Nyb2xsKCk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdGhpcy5ldmVudEhlbmRsZXIoKTtcbiAgICB0aGlzLmNoYW5nZUVsZW1lbnRWaXNpYmxlKCk7XG4gICAgXG4gIH1cbiAgXG4gIGNhbGNTY3JvbGxQZXJjZW50KCkge1xuICAgIC8vIGNvbnNvbGUubG9nKHRoaXMuc2VjdGlvbnMuaW5kZXhPZih0aGlzLmN1cnJlbnRTZWN0aW9uKSlcbiAgICBpZiAodGhpcy5zZWN0aW9ucy5pbmRleE9mKHRoaXMuY3VycmVudFNlY3Rpb24pID09PSB0aGlzLnNlY3Rpb25zLmxlbmd0aCAtIDEpIHtcbiAgICAgIHJldHVybiBNYXRoLmZsb29yKChwYWdlWU9mZnNldCAtIEdldENvb3Jkcy5nZXRDb29yZHModGhpcy5jdXJyZW50U2VjdGlvbikudG9wKSAvICh0aGlzLmN1cnJlbnRTZWN0aW9uLmNsaWVudEhlaWdodCAtIHdpbmRvdy5pbm5lckhlaWdodCkgICogMTAwKTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5jdXJyZW50U2VjdGlvbikge1xuICAgICAgcmV0dXJuIE1hdGguZmxvb3IoKHBhZ2VZT2Zmc2V0IC0gR2V0Q29vcmRzLmdldENvb3Jkcyh0aGlzLmN1cnJlbnRTZWN0aW9uKS50b3ApIC8gdGhpcy5jdXJyZW50U2VjdGlvbi5jbGllbnRIZWlnaHQgKiAxMDApO1xuICAgIH1cbiAgfVxuICBjaGFuZ2VFbGVtZW50VmlzaWJsZSgpIHtcbiAgICB0aGlzLnNlY3Rpb25zLmZvckVhY2goaXRlbSA9PiB7XG4gICAgICBjb25zdCBmaXhlZEJsb2NrID0gaXRlbS5xdWVyeVNlbGVjdG9yKCcuZnVsbC1zY3JvbGxfX2ZpeGVkLXdyYXBwZXInKTtcbiAgICAgIGNvbnN0IGVsZW1Db29yZHMgPSBHZXRDb29yZHMuZ2V0Q29vcmRzKGl0ZW0pO1xuICAgICAgaWYgKHBhZ2VZT2Zmc2V0ID49IGVsZW1Db29yZHMudG9wICYmIGVsZW1Db29yZHMuYm90dG9tID49IHBhZ2VZT2Zmc2V0KSB7XG4gICAgICAgIHRoaXMuY3VycmVudFNlY3Rpb24gPSBpdGVtO1xuICAgICAgICBmaXhlZEJsb2NrLmNsYXNzTGlzdC5hZGQoJ2Z1bGwtc2Nyb2xsX19maXgtc3RhdGUnKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGZpeGVkQmxvY2suY2xhc3NMaXN0LnJlbW92ZSgnZnVsbC1zY3JvbGxfX2ZpeC1zdGF0ZScpO1xuICAgICAgfVxuXG4gICAgICBpZiAodGhpcy5jdXJyZW50U2VjdGlvbiA9PT0gdGhpcy5zZWN0aW9uc1t0aGlzLnNlY3Rpb25zLmxlbmd0aCAtIDFdKSB7XG4gICAgICAgIGlmIChwYWdlWU9mZnNldCA+PSBHZXRDb29yZHMuZ2V0Q29vcmRzKHRoaXMuY3VycmVudFNlY3Rpb24pLmJvdHRvbSAtIHdpbmRvdy5pbm5lckhlaWdodCkge1xuICAgICAgICAgIGZpeGVkQmxvY2suY2xhc3NMaXN0LnJlbW92ZSgnZnVsbC1zY3JvbGxfX2ZpeC1zdGF0ZScpO1xuICAgICAgICAgIGZpeGVkQmxvY2suY2xhc3NMaXN0LmFkZCgnZnVsbC1zY3JvbGxfX2xhc3QtZWxlbScpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGZpeGVkQmxvY2suY2xhc3NMaXN0LnJlbW92ZSgnZnVsbC1zY3JvbGxfX2xhc3QtZWxlbScpO1xuICAgICAgICB9XG4gICAgICB9IFxuICAgIH0pO1xuICB9XG4gIFxuICBcbiAgc2V0QWJvdmVCZ09wYWNpdHkoKSB7XG5cbiAgICAvLyDQn9C+0LrQsNC30YvQstCw0LXQvCDRgdC60YDQvtC70LvQsdCw0YBcbiAgICB0aGlzLnByb2dyZXNzQmFyLnN0eWxlLndpZHRoID0gdGhpcy5jYWxjU2Nyb2xsUGVyY2VudCgpICsgJyUnO1xuICAgIFxuICAgIC8vINCV0YHQu9C4INC80Ysg0L3QsNGF0L7QtNC40LzRgdGPINC90LUg0LIg0L7QsdC70LDRgdGC0Lgg0L/RgNC+0YHQvNC+0YLRgNCwINGB0LXQutGG0LjQuCwg0LLRgdC1INGB0LvQvtC40YUg0YHQstC10YDRhdGDINC00LXQu9Cw0LXQvCDQv9GA0L7Qt9GA0LDRh9C90YvQvNC4XG4gICAgaWYgKHRoaXMuY2FsY1Njcm9sbFBlcmNlbnQoKSA9PT0gdW5kZWZpbmVkIHx8IHRoaXMuY2FsY1Njcm9sbFBlcmNlbnQoKSA8IDAgfHwgdGhpcy5jYWxjU2Nyb2xsUGVyY2VudCgpID4gMTAwKSB7XG4gICAgICB0aGlzLmZvZy5zdHlsZS5vcGFjaXR5ID0gMDtcbiAgICAgIHRoaXMuc21va2UxLnN0eWxlLm9wYWNpdHkgPSAwO1xuICAgICAgdGhpcy5zbW9rZTIuc3R5bGUub3BhY2l0eSA9IDA7XG4gICAgICB0aGlzLnNtb2tlMy5zdHlsZS5vcGFjaXR5ID0gMDtcblxuICAgICAgdGhpcy5wcm9ncmVzc0Jhci5zdHlsZS53aWR0aCA9IDA7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgLy8g0J7QsdGA0LDQsdCw0YLRi9Cy0LDQtdC8INGB0LrRgNC+0LvQuyDQstC90LjQt1xuICAgIGlmICh0aGlzLmRpcmVjdGlvbiA9PT0gJ3RvLWJvdHRvbScpIHtcblxuICAgICAgLy8g0JTQu9GPINC/0LXRgNCy0L7Qs9C+INGN0LvQtdC80LXQvdGC0LAg0L3QtSDQtNC10LvQsNC10Lwg0LDQvdC40LzQsNGG0LjQuSBcItCy0YXQvtC00LBcIlxuICAgICAgaWYgKHRoaXMuc2VjdGlvbnMuaW5kZXhPZih0aGlzLmN1cnJlbnRTZWN0aW9uKSAhPT0gMCkge1xuXG4gICAgICAgIC8vINCV0YHQu9C4INGB0LrRgNC+0LvQuyDQvNC10L3RjNGI0LUgMjUlLCDRgtC+INGD0LHQuNGA0LDQtdC8INC/0YDQvtC30YDQsNGH0L3QvtGB0YLRjCDRgyBcItGC0YPQvNCw0L3QsFwiLlxuICAgICAgICAvLyDQuCDRg9GB0YLQsNC90LDQstC70LjQstCw0LXQvCDRgdC60L7RgNC+0YHRgtGMINGC0YDQsNC90LfQuNGI0LXQvdCwLCDRh9GC0L7QsdGLINCx0YvQu9C+INC/0LvQsNCy0L3Qvi5cbiAgICAgICAgaWYgKHRoaXMuY2FsY1Njcm9sbFBlcmNlbnQoKSA8PSAyNSkge1xuICAgICAgICAgIHRoaXMuZm9nLnN0eWxlLnRyYW5zaXRpb24gPSAnb3BhY2l0eSAxcyc7XG4gICAgICAgICAgdGhpcy5mb2cuc3R5bGUub3BhY2l0eSA9IDA7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgLy8g0JXRgdC70Lgg0L3QtdGCLCDRgtC+INCy0L7Qt9Cy0YDQsNGJ0LDQtdC8INGC0YDQsNC90LfQuNGI0L0g0LIg0YHRgtCw0L3QtNCw0YDRgtC90L7QtSDQv9C+0LvQvtC20LXQvdC40LVcbiAgICAgICAgICB0aGlzLmZvZy5zdHlsZS50cmFuc2l0aW9uID0gJ29wYWNpdHkgMC4ycyc7XG4gICAgICAgIH1cbiAgICAgIH1cblxuXG4gICAgICAvLyDQlNC70Y8g0L/QvtGB0LvQtdC00L3QtdCz0L4g0Y3Qu9C10LzQtdC90YLQsCDQvdC1INC00LXQu9Cw0LXQvCDQsNC90LjQvNCw0YbQuNC5IFwi0JLRi9GF0L7QtNCwXCIuIFxuICAgICAgaWYgKHRoaXMuY3VycmVudFNlY3Rpb24gIT09IHRoaXMuc2VjdGlvbnNbdGhpcy5zZWN0aW9ucy5sZW5ndGggLSAxXSkge1xuXG4gICAgICAgIC8vICDQlNGL0Lwg0LLRi9GF0L7QtFxuICAgICAgICBpZiAodGhpcy5jYWxjU2Nyb2xsUGVyY2VudCgpID49IDU1KSB7XG4gICAgICAgICAgdGhpcy5zbW9rZTEuc3R5bGUub3BhY2l0eSA9IDE7XG4gICAgICAgIH0gXG5cbiAgICAgICAgaWYgKHRoaXMuY2FsY1Njcm9sbFBlcmNlbnQoKSA+PSA2NSkge1xuICAgICAgICAgIHRoaXMuc21va2UyLnN0eWxlLm9wYWNpdHkgPSAxO1xuICAgICAgICB9IFxuXG4gICAgICAgIGlmICh0aGlzLmNhbGNTY3JvbGxQZXJjZW50KCkgPj0gNzApIHtcbiAgICAgICAgICB0aGlzLnNtb2tlMy5zdHlsZS5vcGFjaXR5ID0gMTtcbiAgICAgICAgfSBcblxuICAgICAgICBpZiAodGhpcy5jYWxjU2Nyb2xsUGVyY2VudCgpID49IDc1KSB7XG4gICAgICAgICAgdGhpcy5mb2cuc3R5bGUub3BhY2l0eSA9ICh0aGlzLmNhbGNTY3JvbGxQZXJjZW50KCkgLSA3NSkgKiA1ICsgJyUnO1xuICAgICAgICB9IFxuICAgICAgfVxuXG5cbiAgICAgIC8vINCU0YvQvCDQstGF0L7QtFxuICAgICAgaWYgKHRoaXMuY2FsY1Njcm9sbFBlcmNlbnQoKSA+PSA1ICYmIHRoaXMuY2FsY1Njcm9sbFBlcmNlbnQoKSA8IDQwICYmIHRoaXMuZGlyZWN0aW9uID09PSAndG8tYm90dG9tJykge1xuICAgICAgICB0aGlzLnNtb2tlMS5zdHlsZS5vcGFjaXR5ID0gMDtcbiAgICAgIH0gXG5cbiAgICAgIGlmICh0aGlzLmNhbGNTY3JvbGxQZXJjZW50KCkgPj0gMTMgJiYgdGhpcy5jYWxjU2Nyb2xsUGVyY2VudCgpIDwgNDAgJiYgdGhpcy5kaXJlY3Rpb24gPT09ICd0by1ib3R0b20nKSB7XG4gICAgICAgIHRoaXMuc21va2UyLnN0eWxlLm9wYWNpdHkgPSAwO1xuICAgICAgfSBcblxuICAgICAgaWYgKHRoaXMuY2FsY1Njcm9sbFBlcmNlbnQoKSA+PSAxMCAmJiB0aGlzLmNhbGNTY3JvbGxQZXJjZW50KCkgPCA0MCAmJiB0aGlzLmRpcmVjdGlvbiA9PT0gJ3RvLWJvdHRvbScpIHtcbiAgICAgICAgdGhpcy5zbW9rZTMuc3R5bGUub3BhY2l0eSA9IDA7XG4gICAgICB9IFxuXG4gICAgfVxuXG5cbiAgICBpZiAodGhpcy5kaXJlY3Rpb24gPT09ICd0by10b3AnKSB7XG4gICAgICAvLyDQlNC70Y8g0L/QtdGA0LLQvtCz0L4g0Y3Qu9C10LzQtdC90YLQsCDQvdC1INC00LXQu9Cw0LXQvCDQsNC90LjQvNCw0YbQuNC5IFwi0LLRhdC+0LTQsFwiXG4gICAgICBcbiAgICAgIGlmICh0aGlzLnNlY3Rpb25zLmluZGV4T2YodGhpcy5jdXJyZW50U2VjdGlvbikgIT09IDApIHtcblxuICAgICAgICAvLyDQlNC10LvQsNC10LwgXCLQt9Cw0YLQtdC90LXQvdC40LVcIiwg0LXRgdC70Lgg0LjQtNGR0Lwg0LLQstC10YDRhVxuICAgICAgICBpZiAodGhpcy5jYWxjU2Nyb2xsUGVyY2VudCgpIDw9IDI1KSB7XG4gICAgICAgICAgLy8gY29uc29sZS5sb2coMTI1IC0gdGhpcy5jYWxjU2Nyb2xsUGVyY2VudCgpICogNCArICclJyk7XG4gICAgICAgICAgdGhpcy5mb2cuc3R5bGUub3BhY2l0eSA9IDEyNSAtIHRoaXMuY2FsY1Njcm9sbFBlcmNlbnQoKSAqIDQgKyAnJSc7XG4gICAgICAgIH0gXG5cbiAgICAgICAgLy8g0JTRi9C8INC/0YDQuCDQv9GA0L7QutGA0YPRgtC60LUg0LLQstC10YDRhVxuICAgICAgICBpZiAodGhpcy5jYWxjU2Nyb2xsUGVyY2VudCgpIDw9IDE1KSB7XG4gICAgICAgICAgdGhpcy5zbW9rZTEuc3R5bGUub3BhY2l0eSA9IDE7XG4gICAgICAgIH0gXG5cbiAgICAgICAgaWYgKHRoaXMuY2FsY1Njcm9sbFBlcmNlbnQoKSA8PSAyMykge1xuICAgICAgICAgIHRoaXMuc21va2UyLnN0eWxlLm9wYWNpdHkgPSAxO1xuICAgICAgICB9IFxuXG4gICAgICAgIGlmICh0aGlzLmNhbGNTY3JvbGxQZXJjZW50KCkgPD0gMzUpIHtcbiAgICAgICAgICB0aGlzLnNtb2tlMy5zdHlsZS5vcGFjaXR5ID0gMTtcbiAgICAgICAgfSBcbiAgICAgIH1cblxuICAgICAgaWYgKHRoaXMuY2FsY1Njcm9sbFBlcmNlbnQoKSA+PSA4NSkge1xuICAgICAgICB0aGlzLmZvZy5zdHlsZS50cmFuc2l0aW9uID0gJ29wYWNpdHkgMXMnO1xuICAgICAgICB0aGlzLmZvZy5zdHlsZS5vcGFjaXR5ID0gMDtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIC8vINCV0YHQu9C4INC90LXRgiwg0YLQviDQstC+0LfQstGA0LDRidCw0LXQvCDRgtGA0LDQvdC30LjRiNC9INCyINGB0YLQsNC90LTQsNGA0YLQvdC+0LUg0L/QvtC70L7QttC10L3QuNC1XG4gICAgICAgIHRoaXMuZm9nLnN0eWxlLnRyYW5zaXRpb24gPSAnb3BhY2l0eSAwLjJzJztcbiAgICAgIH1cblxuICAgICAgLy8g0JTRi9C8INCy0LLQtdGA0YUg0LfQsNGC0LzQtdC90LXQvdC40LUg0L/RgNC4INC/0LXRgNC10YXQvtC00LUg0YEg0L/RgNC10LTRi9C00YPRidC10LPQvlxuICAgICAgaWYgKHRoaXMuY2FsY1Njcm9sbFBlcmNlbnQoKSA8PSA5MCAmJiB0aGlzLmNhbGNTY3JvbGxQZXJjZW50KCkgPj0gNTApIHtcbiAgICAgICAgdGhpcy5zbW9rZTEuc3R5bGUub3BhY2l0eSA9IDA7XG4gICAgICB9IFxuICBcbiAgICAgIGlmICh0aGlzLmNhbGNTY3JvbGxQZXJjZW50KCkgPD0gODAgJiYgdGhpcy5jYWxjU2Nyb2xsUGVyY2VudCgpID49IDUwKSB7XG4gICAgICAgIHRoaXMuc21va2UyLnN0eWxlLm9wYWNpdHkgPSAwO1xuICAgICAgfSBcbiAgXG4gICAgICBpZiAodGhpcy5jYWxjU2Nyb2xsUGVyY2VudCgpIDw9IDc1ICYmIHRoaXMuY2FsY1Njcm9sbFBlcmNlbnQoKSA+PSA1MCkge1xuICAgICAgICB0aGlzLnNtb2tlMy5zdHlsZS5vcGFjaXR5ID0gMDtcbiAgICAgIH0gXG4gICAgICBcbiAgICB9XG5cbiAgICAvLyDQnNC10L3Rj9C10Lwg0L7RgdC90L7QstC90L7QuSDRhtCy0LXRglxuICAgIGlmICh0aGlzLmNhbGNTY3JvbGxQZXJjZW50KCkgPj0gNDAgJiYgdGhpcy5jYWxjU2Nyb2xsUGVyY2VudCgpIDw9IDYwKSB7XG5cbiAgICAgIGlmICh0aGlzLmN1cnJlbnRTZWN0aW9uLmNsYXNzTGlzdC5jb250YWlucygnZnVsbC1zY3JvbGxfX3NldC1ibGFjay1mb2cnKSkge1xuICAgICAgICB0aGlzLmZvZy5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSAnIzAzMGMxYSc7XG4gICAgICAgIHRoaXMuc21va2UxLnN0eWxlLmJhY2tncm91bmRJbWFnZSA9IGB1cmwoJ2ltZy9zbW9rZS8xLWJsYWNrLnBuZycpYDtcbiAgICAgICAgdGhpcy5zbW9rZTIuc3R5bGUuYmFja2dyb3VuZEltYWdlID0gYHVybCgnaW1nL3Ntb2tlLzItYmxhY2sucG5nJylgO1xuICAgICAgICB0aGlzLnNtb2tlMy5zdHlsZS5iYWNrZ3JvdW5kSW1hZ2UgPSBgdXJsKCdpbWcvc21va2UvMy1ibGFjay5wbmcnKWA7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLmZvZy5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSAnI2ZkZjVlNic7XG4gICAgICAgIHRoaXMuc21va2UxLnN0eWxlLmJhY2tncm91bmRJbWFnZSA9IGB1cmwoJ2ltZy9zbW9rZS8xLnBuZycpYDsgXG4gICAgICAgIHRoaXMuc21va2UyLnN0eWxlLmJhY2tncm91bmRJbWFnZSA9IGB1cmwoJ2ltZy9zbW9rZS8yLnBuZycpYDtcbiAgICAgICAgdGhpcy5zbW9rZTMuc3R5bGUuYmFja2dyb3VuZEltYWdlID0gYHVybCgnaW1nL3Ntb2tlLzMucG5nJylgO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGV2ZW50SGVuZGxlcigpIHtcbiAgICBsZXQgb2Zmc2V0ID0gcGFnZVlPZmZzZXQ7XG4gICAgXG4gICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignc2Nyb2xsJywgKCkgPT4ge1xuICAgICAgdGhpcy5jaGFuZ2VFbGVtZW50VmlzaWJsZSgpO1xuICAgICAgdGhpcy5zZXRBYm92ZUJnT3BhY2l0eSgpO1xuICAgICAgXG4gICAgICBpZiAocGFnZVlPZmZzZXQgLSBvZmZzZXQgPCAwKSB7XG4gICAgICAgIHRoaXMuZGlyZWN0aW9uID0gJ3RvLXRvcCc7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLmRpcmVjdGlvbiA9ICd0by1ib3R0b20nO1xuICAgICAgfVxuICAgICAgb2Zmc2V0ID0gcGFnZVlPZmZzZXQ7XG5cbiAgICB9KTtcbiAgfVxuXG4gIHRvU3RhbmRhcnRTY3JvbGwoKSB7XG4gICAgdGhpcy5zZWN0aW9ucy5mb3JFYWNoKGl0ZW0gPT4ge1xuICAgICAgaXRlbS5jbGFzc0xpc3QuYWRkKCdmdWxsLXNjcm9sbF9fZWxlbWVudC1zdGFuZGFyZC1oZWlnaHQnKTtcbiAgICB9KTtcbiAgfVxufSIsImNvbnN0IHNlY3Rpb25TbGlkZXIgPSBuZXcgU2NyZWVuU2xpZGVyKCdmdWxsLXNjcm9sbCcpO1xuY29uc3Qgc2VjdGlvblNsaWRlcjIgPSBuZXcgU2NyZWVuU2xpZGVyKCdmdWxsLXNjcm9sbDInKTtcbmNvbnN0IGFuY2hvckFkZGVyID0gbmV3IEFuY2hvckFkZGVyKCk7Il19
