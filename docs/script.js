"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var AnchorAdder = /*#__PURE__*/function () {
  function AnchorAdder() {
    _classCallCheck(this, AnchorAdder);

    if (!history.pushState) {
      return;
    }

    this.scrollHandler();
    console.log(this.anchorsLink);
  }

  _createClass(AnchorAdder, [{
    key: "addAnchor",
    value: function addAnchor(name) {
      var baseUrl = window.location.protocol + "//" + window.location.host + window.location.pathname;
      var newUrl = baseUrl + '#test';
      history.pushState(null, null, newUrl);
    }
  }, {
    key: "scrollHandler",
    value: function scrollHandler() {
      document.addEventListener('scroll', function () {});
    } // Дубль, вынести в общие функции

  }, {
    key: "getCoords",
    value: function getCoords(elem) {
      var box = elem.getBoundingClientRect();
      return {
        top: box.top + pageYOffset,
        bottom: box.bottom + pageYOffset
      };
    }
  }, {
    key: "anchorsLink",
    get: function get() {
      return document.querySelectorAll("[data-anchor]");
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
    key: "getCoords",
    value: function getCoords(elem) {
      var box = elem.getBoundingClientRect();
      return {
        top: box.top + pageYOffset,
        bottom: box.bottom + pageYOffset
      };
    }
  }, {
    key: "calcScrollPercent",
    value: function calcScrollPercent() {
      // console.log(this.sections.indexOf(this.currentSection))
      if (this.sections.indexOf(this.currentSection) === this.sections.length - 1) {
        return Math.floor((pageYOffset - this.getCoords(this.currentSection).top) / (this.currentSection.clientHeight - window.innerHeight) * 100);
      }

      if (this.currentSection) {
        return Math.floor((pageYOffset - this.getCoords(this.currentSection).top) / this.currentSection.clientHeight * 100);
      }
    }
  }, {
    key: "changeElementVisible",
    value: function changeElementVisible() {
      var _this = this;

      this.sections.forEach(function (item) {
        var fixedBlock = item.querySelector('.full-scroll__fixed-wrapper');

        var elemCoords = _this.getCoords(item);

        if (pageYOffset >= elemCoords.top && elemCoords.bottom >= pageYOffset) {
          _this.currentSection = item;
          fixedBlock.classList.add('full-scroll__fix-state');
        } else {
          fixedBlock.classList.remove('full-scroll__fix-state');
        }

        if (_this.currentSection === _this.sections[_this.sections.length - 1]) {
          if (pageYOffset >= _this.getCoords(_this.currentSection).bottom - window.innerHeight) {
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

        if (this.calcScrollPercent() <= 70 && this.calcScrollPercent() >= 50) {
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
      var _this2 = this;

      var offset = pageYOffset;
      document.addEventListener('scroll', function () {
        _this2.changeElementVisible();

        _this2.setAboveBgOpacity();

        if (pageYOffset - offset < 0) {
          _this2.direction = 'to-top';
        } else {
          _this2.direction = 'to-bottom';
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

var sectionSlider = new ScreenSlider('full-scroll'); // const sectionSlider2 = new ScreenSlider('full-scroll2');
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkFuY2hvckFkZGVyLmpzIiwiU2NyZWVuU2xpZGVyLmpzIiwic2NyaXB0LmpzIl0sIm5hbWVzIjpbIkFuY2hvckFkZGVyIiwiaGlzdG9yeSIsInB1c2hTdGF0ZSIsInNjcm9sbEhhbmRsZXIiLCJjb25zb2xlIiwibG9nIiwiYW5jaG9yc0xpbmsiLCJuYW1lIiwiYmFzZVVybCIsIndpbmRvdyIsImxvY2F0aW9uIiwicHJvdG9jb2wiLCJob3N0IiwicGF0aG5hbWUiLCJuZXdVcmwiLCJkb2N1bWVudCIsImFkZEV2ZW50TGlzdGVuZXIiLCJlbGVtIiwiYm94IiwiZ2V0Qm91bmRpbmdDbGllbnRSZWN0IiwidG9wIiwicGFnZVlPZmZzZXQiLCJib3R0b20iLCJxdWVyeVNlbGVjdG9yQWxsIiwiU2NyZWVuU2xpZGVyIiwiaWQiLCJtYWluQ29udGFpbmVyIiwicXVlcnlTZWxlY3RvciIsIkVycm9yIiwic2VjdGlvbnMiLCJBcnJheSIsImZyb20iLCJmb2ciLCJzbW9rZTEiLCJzbW9rZTIiLCJzbW9rZTMiLCJwcm9ncmVzc0JhciIsImN1cnJlbnRTZWN0aW9uIiwic2Nyb2xsRGlyZWN0aW9uIiwiY2xhc3NMaXN0IiwiY29udGFpbnMiLCJ0b1N0YW5kYXJ0U2Nyb2xsIiwiZXZlbnRIZW5kbGVyIiwiY2hhbmdlRWxlbWVudFZpc2libGUiLCJpbmRleE9mIiwibGVuZ3RoIiwiTWF0aCIsImZsb29yIiwiZ2V0Q29vcmRzIiwiY2xpZW50SGVpZ2h0IiwiaW5uZXJIZWlnaHQiLCJmb3JFYWNoIiwiaXRlbSIsImZpeGVkQmxvY2siLCJlbGVtQ29vcmRzIiwiYWRkIiwicmVtb3ZlIiwic3R5bGUiLCJ3aWR0aCIsImNhbGNTY3JvbGxQZXJjZW50IiwidW5kZWZpbmVkIiwib3BhY2l0eSIsImRpcmVjdGlvbiIsInRyYW5zaXRpb24iLCJiYWNrZ3JvdW5kQ29sb3IiLCJiYWNrZ3JvdW5kSW1hZ2UiLCJvZmZzZXQiLCJzZXRBYm92ZUJnT3BhY2l0eSIsInNlY3Rpb25TbGlkZXIiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7O0lBQUFBLFc7QUFDQSx5QkFBQTtBQUFBOztBQUNBLFFBQUEsQ0FBQUMsT0FBQSxDQUFBQyxTQUFBLEVBQUE7QUFDQTtBQUNBOztBQUVBLFNBQUFDLGFBQUE7QUFFQUMsSUFBQUEsT0FBQSxDQUFBQyxHQUFBLENBQUEsS0FBQUMsV0FBQTtBQUNBOzs7OzhCQUVBQyxJLEVBQUE7QUFDQSxVQUFBQyxPQUFBLEdBQUFDLE1BQUEsQ0FBQUMsUUFBQSxDQUFBQyxRQUFBLEdBQUEsSUFBQSxHQUFBRixNQUFBLENBQUFDLFFBQUEsQ0FBQUUsSUFBQSxHQUFBSCxNQUFBLENBQUFDLFFBQUEsQ0FBQUcsUUFBQTtBQUNBLFVBQUFDLE1BQUEsR0FBQU4sT0FBQSxHQUFBLE9BQUE7QUFDQVAsTUFBQUEsT0FBQSxDQUFBQyxTQUFBLENBQUEsSUFBQSxFQUFBLElBQUEsRUFBQVksTUFBQTtBQUNBOzs7b0NBRUE7QUFDQUMsTUFBQUEsUUFBQSxDQUFBQyxnQkFBQSxDQUFBLFFBQUEsRUFBQSxZQUFBLENBRUEsQ0FGQTtBQUdBLEssQ0FHQTs7Ozs4QkFDQUMsSSxFQUFBO0FBQ0EsVUFBQUMsR0FBQSxHQUFBRCxJQUFBLENBQUFFLHFCQUFBLEVBQUE7QUFDQSxhQUFBO0FBQ0FDLFFBQUFBLEdBQUEsRUFBQUYsR0FBQSxDQUFBRSxHQUFBLEdBQUFDLFdBREE7QUFFQUMsUUFBQUEsTUFBQSxFQUFBSixHQUFBLENBQUFJLE1BQUEsR0FBQUQ7QUFGQSxPQUFBO0FBSUE7Ozt3QkFFQTtBQUNBLGFBQUFOLFFBQUEsQ0FBQVEsZ0JBQUEsaUJBQUE7QUFDQTs7Ozs7O0lDbkNBQyxZO0FBQ0Esd0JBQUFDLEVBQUEsRUFBQTtBQUFBOztBQUNBLFNBQUFDLGFBQUEsR0FBQVgsUUFBQSxDQUFBWSxhQUFBLFlBQUFGLEVBQUEsRUFBQTs7QUFFQSxRQUFBLENBQUEsS0FBQUMsYUFBQSxFQUFBO0FBQ0EsWUFBQSxJQUFBRSxLQUFBLENBQUEsdUZBQUEsQ0FBQTtBQUNBOztBQUVBLFNBQUFDLFFBQUEsR0FBQUMsS0FBQSxDQUFBQyxJQUFBLENBQUEsS0FBQUwsYUFBQSxDQUFBSCxnQkFBQSxDQUFBLHVCQUFBLENBQUEsQ0FBQTtBQUNBLFNBQUFTLEdBQUEsR0FBQSxLQUFBTixhQUFBLENBQUFDLGFBQUEsQ0FBQSxtQkFBQSxDQUFBO0FBRUEsU0FBQU0sTUFBQSxHQUFBLEtBQUFQLGFBQUEsQ0FBQUMsYUFBQSxDQUFBLHlCQUFBLENBQUE7QUFDQSxTQUFBTyxNQUFBLEdBQUEsS0FBQVIsYUFBQSxDQUFBQyxhQUFBLENBQUEseUJBQUEsQ0FBQTtBQUNBLFNBQUFRLE1BQUEsR0FBQSxLQUFBVCxhQUFBLENBQUFDLGFBQUEsQ0FBQSx5QkFBQSxDQUFBO0FBRUEsU0FBQVMsV0FBQSxHQUFBLEtBQUFWLGFBQUEsQ0FBQUMsYUFBQSxDQUFBLDRCQUFBLENBQUE7QUFFQSxTQUFBVSxjQUFBLEdBQUEsRUFBQTtBQUNBLFNBQUFDLGVBQUE7O0FBRUEsUUFBQSxLQUFBWixhQUFBLENBQUFhLFNBQUEsQ0FBQUMsUUFBQSxDQUFBLGlDQUFBLENBQUEsRUFBQTtBQUNBLFdBQUFDLGdCQUFBO0FBQ0E7QUFDQTs7QUFFQSxTQUFBQyxZQUFBO0FBQ0EsU0FBQUMsb0JBQUE7QUFFQTs7Ozs4QkFHQTFCLEksRUFBQTtBQUNBLFVBQUFDLEdBQUEsR0FBQUQsSUFBQSxDQUFBRSxxQkFBQSxFQUFBO0FBQ0EsYUFBQTtBQUNBQyxRQUFBQSxHQUFBLEVBQUFGLEdBQUEsQ0FBQUUsR0FBQSxHQUFBQyxXQURBO0FBRUFDLFFBQUFBLE1BQUEsRUFBQUosR0FBQSxDQUFBSSxNQUFBLEdBQUFEO0FBRkEsT0FBQTtBQUlBOzs7d0NBRUE7QUFDQTtBQUNBLFVBQUEsS0FBQVEsUUFBQSxDQUFBZSxPQUFBLENBQUEsS0FBQVAsY0FBQSxNQUFBLEtBQUFSLFFBQUEsQ0FBQWdCLE1BQUEsR0FBQSxDQUFBLEVBQUE7QUFDQSxlQUFBQyxJQUFBLENBQUFDLEtBQUEsQ0FBQSxDQUFBMUIsV0FBQSxHQUFBLEtBQUEyQixTQUFBLENBQUEsS0FBQVgsY0FBQSxFQUFBakIsR0FBQSxLQUFBLEtBQUFpQixjQUFBLENBQUFZLFlBQUEsR0FBQXhDLE1BQUEsQ0FBQXlDLFdBQUEsSUFBQSxHQUFBLENBQUE7QUFDQTs7QUFFQSxVQUFBLEtBQUFiLGNBQUEsRUFBQTtBQUNBLGVBQUFTLElBQUEsQ0FBQUMsS0FBQSxDQUFBLENBQUExQixXQUFBLEdBQUEsS0FBQTJCLFNBQUEsQ0FBQSxLQUFBWCxjQUFBLEVBQUFqQixHQUFBLElBQUEsS0FBQWlCLGNBQUEsQ0FBQVksWUFBQSxHQUFBLEdBQUEsQ0FBQTtBQUNBO0FBQ0E7OzsyQ0FDQTtBQUFBOztBQUNBLFdBQUFwQixRQUFBLENBQUFzQixPQUFBLENBQUEsVUFBQUMsSUFBQSxFQUFBO0FBQ0EsWUFBQUMsVUFBQSxHQUFBRCxJQUFBLENBQUF6QixhQUFBLENBQUEsNkJBQUEsQ0FBQTs7QUFDQSxZQUFBMkIsVUFBQSxHQUFBLEtBQUEsQ0FBQU4sU0FBQSxDQUFBSSxJQUFBLENBQUE7O0FBQ0EsWUFBQS9CLFdBQUEsSUFBQWlDLFVBQUEsQ0FBQWxDLEdBQUEsSUFBQWtDLFVBQUEsQ0FBQWhDLE1BQUEsSUFBQUQsV0FBQSxFQUFBO0FBQ0EsVUFBQSxLQUFBLENBQUFnQixjQUFBLEdBQUFlLElBQUE7QUFDQUMsVUFBQUEsVUFBQSxDQUFBZCxTQUFBLENBQUFnQixHQUFBLENBQUEsd0JBQUE7QUFDQSxTQUhBLE1BR0E7QUFDQUYsVUFBQUEsVUFBQSxDQUFBZCxTQUFBLENBQUFpQixNQUFBLENBQUEsd0JBQUE7QUFDQTs7QUFFQSxZQUFBLEtBQUEsQ0FBQW5CLGNBQUEsS0FBQSxLQUFBLENBQUFSLFFBQUEsQ0FBQSxLQUFBLENBQUFBLFFBQUEsQ0FBQWdCLE1BQUEsR0FBQSxDQUFBLENBQUEsRUFBQTtBQUNBLGNBQUF4QixXQUFBLElBQUEsS0FBQSxDQUFBMkIsU0FBQSxDQUFBLEtBQUEsQ0FBQVgsY0FBQSxFQUFBZixNQUFBLEdBQUFiLE1BQUEsQ0FBQXlDLFdBQUEsRUFBQTtBQUNBRyxZQUFBQSxVQUFBLENBQUFkLFNBQUEsQ0FBQWlCLE1BQUEsQ0FBQSx3QkFBQTtBQUNBSCxZQUFBQSxVQUFBLENBQUFkLFNBQUEsQ0FBQWdCLEdBQUEsQ0FBQSx3QkFBQTtBQUNBLFdBSEEsTUFHQTtBQUNBRixZQUFBQSxVQUFBLENBQUFkLFNBQUEsQ0FBQWlCLE1BQUEsQ0FBQSx3QkFBQTtBQUNBO0FBQ0E7QUFDQSxPQWxCQTtBQW1CQTs7O3dDQUdBO0FBRUE7QUFDQSxXQUFBcEIsV0FBQSxDQUFBcUIsS0FBQSxDQUFBQyxLQUFBLEdBQUEsS0FBQUMsaUJBQUEsS0FBQSxHQUFBLENBSEEsQ0FLQTs7QUFDQSxVQUFBLEtBQUFBLGlCQUFBLE9BQUFDLFNBQUEsSUFBQSxLQUFBRCxpQkFBQSxLQUFBLENBQUEsSUFBQSxLQUFBQSxpQkFBQSxLQUFBLEdBQUEsRUFBQTtBQUNBLGFBQUEzQixHQUFBLENBQUF5QixLQUFBLENBQUFJLE9BQUEsR0FBQSxDQUFBO0FBQ0EsYUFBQTVCLE1BQUEsQ0FBQXdCLEtBQUEsQ0FBQUksT0FBQSxHQUFBLENBQUE7QUFDQSxhQUFBM0IsTUFBQSxDQUFBdUIsS0FBQSxDQUFBSSxPQUFBLEdBQUEsQ0FBQTtBQUNBLGFBQUExQixNQUFBLENBQUFzQixLQUFBLENBQUFJLE9BQUEsR0FBQSxDQUFBO0FBRUEsYUFBQXpCLFdBQUEsQ0FBQXFCLEtBQUEsQ0FBQUMsS0FBQSxHQUFBLENBQUE7QUFDQTtBQUNBLE9BZEEsQ0FnQkE7OztBQUNBLFVBQUEsS0FBQUksU0FBQSxLQUFBLFdBQUEsRUFBQTtBQUVBO0FBQ0EsWUFBQSxLQUFBakMsUUFBQSxDQUFBZSxPQUFBLENBQUEsS0FBQVAsY0FBQSxNQUFBLENBQUEsRUFBQTtBQUVBO0FBQ0E7QUFDQSxjQUFBLEtBQUFzQixpQkFBQSxNQUFBLEVBQUEsRUFBQTtBQUNBLGlCQUFBM0IsR0FBQSxDQUFBeUIsS0FBQSxDQUFBTSxVQUFBLEdBQUEsWUFBQTtBQUNBLGlCQUFBL0IsR0FBQSxDQUFBeUIsS0FBQSxDQUFBSSxPQUFBLEdBQUEsQ0FBQTtBQUNBLFdBSEEsTUFHQTtBQUNBO0FBQ0EsaUJBQUE3QixHQUFBLENBQUF5QixLQUFBLENBQUFNLFVBQUEsR0FBQSxjQUFBO0FBQ0E7QUFDQSxTQWRBLENBaUJBOzs7QUFDQSxZQUFBLEtBQUExQixjQUFBLEtBQUEsS0FBQVIsUUFBQSxDQUFBLEtBQUFBLFFBQUEsQ0FBQWdCLE1BQUEsR0FBQSxDQUFBLENBQUEsRUFBQTtBQUVBO0FBQ0EsY0FBQSxLQUFBYyxpQkFBQSxNQUFBLEVBQUEsRUFBQTtBQUNBLGlCQUFBMUIsTUFBQSxDQUFBd0IsS0FBQSxDQUFBSSxPQUFBLEdBQUEsQ0FBQTtBQUNBOztBQUVBLGNBQUEsS0FBQUYsaUJBQUEsTUFBQSxFQUFBLEVBQUE7QUFDQSxpQkFBQXpCLE1BQUEsQ0FBQXVCLEtBQUEsQ0FBQUksT0FBQSxHQUFBLENBQUE7QUFDQTs7QUFFQSxjQUFBLEtBQUFGLGlCQUFBLE1BQUEsRUFBQSxFQUFBO0FBQ0EsaUJBQUF4QixNQUFBLENBQUFzQixLQUFBLENBQUFJLE9BQUEsR0FBQSxDQUFBO0FBQ0E7O0FBRUEsY0FBQSxLQUFBRixpQkFBQSxNQUFBLEVBQUEsRUFBQTtBQUNBLGlCQUFBM0IsR0FBQSxDQUFBeUIsS0FBQSxDQUFBSSxPQUFBLEdBQUEsQ0FBQSxLQUFBRixpQkFBQSxLQUFBLEVBQUEsSUFBQSxDQUFBLEdBQUEsR0FBQTtBQUNBO0FBQ0EsU0FwQ0EsQ0F1Q0E7OztBQUNBLFlBQUEsS0FBQUEsaUJBQUEsTUFBQSxDQUFBLElBQUEsS0FBQUEsaUJBQUEsS0FBQSxFQUFBLElBQUEsS0FBQUcsU0FBQSxLQUFBLFdBQUEsRUFBQTtBQUNBLGVBQUE3QixNQUFBLENBQUF3QixLQUFBLENBQUFJLE9BQUEsR0FBQSxDQUFBO0FBQ0E7O0FBRUEsWUFBQSxLQUFBRixpQkFBQSxNQUFBLEVBQUEsSUFBQSxLQUFBQSxpQkFBQSxLQUFBLEVBQUEsSUFBQSxLQUFBRyxTQUFBLEtBQUEsV0FBQSxFQUFBO0FBQ0EsZUFBQTVCLE1BQUEsQ0FBQXVCLEtBQUEsQ0FBQUksT0FBQSxHQUFBLENBQUE7QUFDQTs7QUFFQSxZQUFBLEtBQUFGLGlCQUFBLE1BQUEsRUFBQSxJQUFBLEtBQUFBLGlCQUFBLEtBQUEsRUFBQSxJQUFBLEtBQUFHLFNBQUEsS0FBQSxXQUFBLEVBQUE7QUFDQSxlQUFBM0IsTUFBQSxDQUFBc0IsS0FBQSxDQUFBSSxPQUFBLEdBQUEsQ0FBQTtBQUNBO0FBRUE7O0FBR0EsVUFBQSxLQUFBQyxTQUFBLEtBQUEsUUFBQSxFQUFBO0FBQ0E7QUFFQSxZQUFBLEtBQUFqQyxRQUFBLENBQUFlLE9BQUEsQ0FBQSxLQUFBUCxjQUFBLE1BQUEsQ0FBQSxFQUFBO0FBRUE7QUFDQSxjQUFBLEtBQUFzQixpQkFBQSxNQUFBLEVBQUEsRUFBQTtBQUNBO0FBQ0EsaUJBQUEzQixHQUFBLENBQUF5QixLQUFBLENBQUFJLE9BQUEsR0FBQSxNQUFBLEtBQUFGLGlCQUFBLEtBQUEsQ0FBQSxHQUFBLEdBQUE7QUFDQSxXQU5BLENBUUE7OztBQUNBLGNBQUEsS0FBQUEsaUJBQUEsTUFBQSxFQUFBLEVBQUE7QUFDQSxpQkFBQTFCLE1BQUEsQ0FBQXdCLEtBQUEsQ0FBQUksT0FBQSxHQUFBLENBQUE7QUFDQTs7QUFFQSxjQUFBLEtBQUFGLGlCQUFBLE1BQUEsRUFBQSxFQUFBO0FBQ0EsaUJBQUF6QixNQUFBLENBQUF1QixLQUFBLENBQUFJLE9BQUEsR0FBQSxDQUFBO0FBQ0E7O0FBRUEsY0FBQSxLQUFBRixpQkFBQSxNQUFBLEVBQUEsRUFBQTtBQUNBLGlCQUFBeEIsTUFBQSxDQUFBc0IsS0FBQSxDQUFBSSxPQUFBLEdBQUEsQ0FBQTtBQUNBO0FBQ0E7O0FBRUEsWUFBQSxLQUFBRixpQkFBQSxNQUFBLEVBQUEsRUFBQTtBQUNBLGVBQUEzQixHQUFBLENBQUF5QixLQUFBLENBQUFNLFVBQUEsR0FBQSxZQUFBO0FBQ0EsZUFBQS9CLEdBQUEsQ0FBQXlCLEtBQUEsQ0FBQUksT0FBQSxHQUFBLENBQUE7QUFDQSxTQUhBLE1BR0E7QUFDQTtBQUNBLGVBQUE3QixHQUFBLENBQUF5QixLQUFBLENBQUFNLFVBQUEsR0FBQSxjQUFBO0FBQ0EsU0EvQkEsQ0FpQ0E7OztBQUNBLFlBQUEsS0FBQUosaUJBQUEsTUFBQSxFQUFBLElBQUEsS0FBQUEsaUJBQUEsTUFBQSxFQUFBLEVBQUE7QUFDQSxlQUFBMUIsTUFBQSxDQUFBd0IsS0FBQSxDQUFBSSxPQUFBLEdBQUEsQ0FBQTtBQUNBOztBQUVBLFlBQUEsS0FBQUYsaUJBQUEsTUFBQSxFQUFBLElBQUEsS0FBQUEsaUJBQUEsTUFBQSxFQUFBLEVBQUE7QUFDQSxlQUFBekIsTUFBQSxDQUFBdUIsS0FBQSxDQUFBSSxPQUFBLEdBQUEsQ0FBQTtBQUNBOztBQUVBLFlBQUEsS0FBQUYsaUJBQUEsTUFBQSxFQUFBLElBQUEsS0FBQUEsaUJBQUEsTUFBQSxFQUFBLEVBQUE7QUFDQSxlQUFBeEIsTUFBQSxDQUFBc0IsS0FBQSxDQUFBSSxPQUFBLEdBQUEsQ0FBQTtBQUNBO0FBRUEsT0F0SEEsQ0F3SEE7OztBQUNBLFVBQUEsS0FBQUYsaUJBQUEsTUFBQSxFQUFBLElBQUEsS0FBQUEsaUJBQUEsTUFBQSxFQUFBLEVBQUE7QUFFQSxZQUFBLEtBQUF0QixjQUFBLENBQUFFLFNBQUEsQ0FBQUMsUUFBQSxDQUFBLDRCQUFBLENBQUEsRUFBQTtBQUNBLGVBQUFSLEdBQUEsQ0FBQXlCLEtBQUEsQ0FBQU8sZUFBQSxHQUFBLFNBQUE7QUFDQSxlQUFBL0IsTUFBQSxDQUFBd0IsS0FBQSxDQUFBUSxlQUFBO0FBQ0EsZUFBQS9CLE1BQUEsQ0FBQXVCLEtBQUEsQ0FBQVEsZUFBQTtBQUNBLGVBQUE5QixNQUFBLENBQUFzQixLQUFBLENBQUFRLGVBQUE7QUFDQSxTQUxBLE1BS0E7QUFDQSxlQUFBakMsR0FBQSxDQUFBeUIsS0FBQSxDQUFBTyxlQUFBLEdBQUEsU0FBQTtBQUNBLGVBQUEvQixNQUFBLENBQUF3QixLQUFBLENBQUFRLGVBQUE7QUFDQSxlQUFBL0IsTUFBQSxDQUFBdUIsS0FBQSxDQUFBUSxlQUFBO0FBQ0EsZUFBQTlCLE1BQUEsQ0FBQXNCLEtBQUEsQ0FBQVEsZUFBQTtBQUNBO0FBQ0E7QUFDQTs7O21DQUVBO0FBQUE7O0FBQ0EsVUFBQUMsTUFBQSxHQUFBN0MsV0FBQTtBQUVBTixNQUFBQSxRQUFBLENBQUFDLGdCQUFBLENBQUEsUUFBQSxFQUFBLFlBQUE7QUFDQSxRQUFBLE1BQUEsQ0FBQTJCLG9CQUFBOztBQUNBLFFBQUEsTUFBQSxDQUFBd0IsaUJBQUE7O0FBRUEsWUFBQTlDLFdBQUEsR0FBQTZDLE1BQUEsR0FBQSxDQUFBLEVBQUE7QUFDQSxVQUFBLE1BQUEsQ0FBQUosU0FBQSxHQUFBLFFBQUE7QUFDQSxTQUZBLE1BRUE7QUFDQSxVQUFBLE1BQUEsQ0FBQUEsU0FBQSxHQUFBLFdBQUE7QUFDQTs7QUFDQUksUUFBQUEsTUFBQSxHQUFBN0MsV0FBQTtBQUVBLE9BWEE7QUFZQTs7O3VDQUVBO0FBQ0EsV0FBQVEsUUFBQSxDQUFBc0IsT0FBQSxDQUFBLFVBQUFDLElBQUEsRUFBQTtBQUNBQSxRQUFBQSxJQUFBLENBQUFiLFNBQUEsQ0FBQWdCLEdBQUEsQ0FBQSxzQ0FBQTtBQUNBLE9BRkE7QUFHQTs7Ozs7O0FDdE9BLElBQUFhLGFBQUEsR0FBQSxJQUFBNUMsWUFBQSxDQUFBLGFBQUEsQ0FBQSxDLENBQ0EiLCJmaWxlIjoic2NyaXB0LmpzIiwic291cmNlc0NvbnRlbnQiOlsiY2xhc3MgQW5jaG9yQWRkZXIge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBpZiAoIWhpc3RvcnkucHVzaFN0YXRlKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdGhpcy5zY3JvbGxIYW5kbGVyKCk7XG5cbiAgICBjb25zb2xlLmxvZyh0aGlzLmFuY2hvcnNMaW5rKTtcbiAgfVxuXG4gIGFkZEFuY2hvcihuYW1lKSB7XG4gICAgdmFyIGJhc2VVcmwgPSB3aW5kb3cubG9jYXRpb24ucHJvdG9jb2wgKyBcIi8vXCIgKyB3aW5kb3cubG9jYXRpb24uaG9zdCArIHdpbmRvdy5sb2NhdGlvbi5wYXRobmFtZTtcbiAgICB2YXIgbmV3VXJsID0gYmFzZVVybCArICcjdGVzdCc7XG4gICAgaGlzdG9yeS5wdXNoU3RhdGUobnVsbCwgbnVsbCwgbmV3VXJsKTtcbiAgfVxuXG4gIHNjcm9sbEhhbmRsZXIoKSB7XG4gICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignc2Nyb2xsJywgKCkgPT4ge1xuICAgICAgXG4gICAgfSk7XG4gIH1cblxuXG4gIC8vINCU0YPQsdC70YwsINCy0YvQvdC10YHRgtC4INCyINC+0LHRidC40LUg0YTRg9C90LrRhtC40LhcbiAgZ2V0Q29vcmRzKGVsZW0pIHtcbiAgICB2YXIgYm94ID0gZWxlbS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICByZXR1cm4ge1xuICAgICAgdG9wOiBib3gudG9wICsgcGFnZVlPZmZzZXQsXG4gICAgICBib3R0b206IGJveC5ib3R0b20gKyBwYWdlWU9mZnNldFxuICAgIH07XG4gIH1cblxuICBnZXQgYW5jaG9yc0xpbmsgKCkge1xuICAgIHJldHVybiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKGBbZGF0YS1hbmNob3JdYCk7XG4gIH1cblxuXG5cbn0iLCJjbGFzcyBTY3JlZW5TbGlkZXIge1xuICBjb25zdHJ1Y3RvcihpZCkge1xuICAgIHRoaXMubWFpbkNvbnRhaW5lciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoYCMke2lkfWApO1xuXG4gICAgaWYgKCF0aGlzLm1haW5Db250YWluZXIpIHtcbiAgICAgIHRocm93KG5ldyBFcnJvcignSWQg0L3QtSDQv9C10YDQtdC00LDQvSDQsiDQutC+0L3RgdGC0YDRg9C60YLQvtGAINGN0LvQtdC80LXQvdGC0LAgU2NyZWVuU2xpZGVyLCDQu9C40LHQviDRjdC70LXQvNC10L3RgiDQvdC1INC90LDQudC00LXQvSDQvdCwINGB0YLRgNCw0L3QuNGG0LUnKSk7XG4gICAgfVxuXG4gICAgdGhpcy5zZWN0aW9ucyA9IEFycmF5LmZyb20odGhpcy5tYWluQ29udGFpbmVyLnF1ZXJ5U2VsZWN0b3JBbGwoJy5mdWxsLXNjcm9sbF9fZWxlbWVudCcpKTtcbiAgICB0aGlzLmZvZyA9IHRoaXMubWFpbkNvbnRhaW5lci5xdWVyeVNlbGVjdG9yKCcuZnVsbC1zY3JvbGxfX2ZvZycpO1xuXG4gICAgdGhpcy5zbW9rZTEgPSB0aGlzLm1haW5Db250YWluZXIucXVlcnlTZWxlY3RvcignLmZ1bGwtc2Nyb2xsX19zbW9rZV9iZzEnKTtcbiAgICB0aGlzLnNtb2tlMiA9IHRoaXMubWFpbkNvbnRhaW5lci5xdWVyeVNlbGVjdG9yKCcuZnVsbC1zY3JvbGxfX3Ntb2tlX2JnMicpO1xuICAgIHRoaXMuc21va2UzID0gdGhpcy5tYWluQ29udGFpbmVyLnF1ZXJ5U2VsZWN0b3IoJy5mdWxsLXNjcm9sbF9fc21va2VfYmczJyk7XG5cbiAgICB0aGlzLnByb2dyZXNzQmFyID0gdGhpcy5tYWluQ29udGFpbmVyLnF1ZXJ5U2VsZWN0b3IoJy5mdWxsLXNjcm9sbF9fcHJvZ3Jlc3MtYmFyJyk7XG5cbiAgICB0aGlzLmN1cnJlbnRTZWN0aW9uID0gJyc7XG4gICAgdGhpcy5zY3JvbGxEaXJlY3Rpb247XG5cbiAgICBpZiAodGhpcy5tYWluQ29udGFpbmVyLmNsYXNzTGlzdC5jb250YWlucygnZnVsbC1zY3JvbGxfX3RvLXN0YW5kYXJ0LXNjcm9sbCcpKSB7XG4gICAgICB0aGlzLnRvU3RhbmRhcnRTY3JvbGwoKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB0aGlzLmV2ZW50SGVuZGxlcigpO1xuICAgIHRoaXMuY2hhbmdlRWxlbWVudFZpc2libGUoKTtcbiAgICBcbiAgfVxuXG5cbiAgZ2V0Q29vcmRzKGVsZW0pIHtcbiAgICB2YXIgYm94ID0gZWxlbS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICByZXR1cm4ge1xuICAgICAgdG9wOiBib3gudG9wICsgcGFnZVlPZmZzZXQsXG4gICAgICBib3R0b206IGJveC5ib3R0b20gKyBwYWdlWU9mZnNldFxuICAgIH07XG4gIH1cbiAgXG4gIGNhbGNTY3JvbGxQZXJjZW50KCkge1xuICAgIC8vIGNvbnNvbGUubG9nKHRoaXMuc2VjdGlvbnMuaW5kZXhPZih0aGlzLmN1cnJlbnRTZWN0aW9uKSlcbiAgICBpZiAodGhpcy5zZWN0aW9ucy5pbmRleE9mKHRoaXMuY3VycmVudFNlY3Rpb24pID09PSB0aGlzLnNlY3Rpb25zLmxlbmd0aCAtIDEpIHtcbiAgICAgIHJldHVybiBNYXRoLmZsb29yKChwYWdlWU9mZnNldCAtIHRoaXMuZ2V0Q29vcmRzKHRoaXMuY3VycmVudFNlY3Rpb24pLnRvcCkgLyAodGhpcy5jdXJyZW50U2VjdGlvbi5jbGllbnRIZWlnaHQgLSB3aW5kb3cuaW5uZXJIZWlnaHQpICAqIDEwMCk7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuY3VycmVudFNlY3Rpb24pIHtcbiAgICAgIHJldHVybiBNYXRoLmZsb29yKChwYWdlWU9mZnNldCAtIHRoaXMuZ2V0Q29vcmRzKHRoaXMuY3VycmVudFNlY3Rpb24pLnRvcCkgLyB0aGlzLmN1cnJlbnRTZWN0aW9uLmNsaWVudEhlaWdodCAqIDEwMCk7XG4gICAgfVxuICB9XG4gIGNoYW5nZUVsZW1lbnRWaXNpYmxlKCkge1xuICAgIHRoaXMuc2VjdGlvbnMuZm9yRWFjaChpdGVtID0+IHtcbiAgICAgIGNvbnN0IGZpeGVkQmxvY2sgPSBpdGVtLnF1ZXJ5U2VsZWN0b3IoJy5mdWxsLXNjcm9sbF9fZml4ZWQtd3JhcHBlcicpO1xuICAgICAgY29uc3QgZWxlbUNvb3JkcyA9IHRoaXMuZ2V0Q29vcmRzKGl0ZW0pO1xuICAgICAgaWYgKHBhZ2VZT2Zmc2V0ID49IGVsZW1Db29yZHMudG9wICYmIGVsZW1Db29yZHMuYm90dG9tID49IHBhZ2VZT2Zmc2V0KSB7XG4gICAgICAgIHRoaXMuY3VycmVudFNlY3Rpb24gPSBpdGVtO1xuICAgICAgICBmaXhlZEJsb2NrLmNsYXNzTGlzdC5hZGQoJ2Z1bGwtc2Nyb2xsX19maXgtc3RhdGUnKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGZpeGVkQmxvY2suY2xhc3NMaXN0LnJlbW92ZSgnZnVsbC1zY3JvbGxfX2ZpeC1zdGF0ZScpO1xuICAgICAgfVxuXG4gICAgICBpZiAodGhpcy5jdXJyZW50U2VjdGlvbiA9PT0gdGhpcy5zZWN0aW9uc1t0aGlzLnNlY3Rpb25zLmxlbmd0aCAtIDFdKSB7XG4gICAgICAgIGlmIChwYWdlWU9mZnNldCA+PSB0aGlzLmdldENvb3Jkcyh0aGlzLmN1cnJlbnRTZWN0aW9uKS5ib3R0b20gLSB3aW5kb3cuaW5uZXJIZWlnaHQpIHtcbiAgICAgICAgICBmaXhlZEJsb2NrLmNsYXNzTGlzdC5yZW1vdmUoJ2Z1bGwtc2Nyb2xsX19maXgtc3RhdGUnKTtcbiAgICAgICAgICBmaXhlZEJsb2NrLmNsYXNzTGlzdC5hZGQoJ2Z1bGwtc2Nyb2xsX19sYXN0LWVsZW0nKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBmaXhlZEJsb2NrLmNsYXNzTGlzdC5yZW1vdmUoJ2Z1bGwtc2Nyb2xsX19sYXN0LWVsZW0nKTtcbiAgICAgICAgfVxuICAgICAgfSBcbiAgICB9KTtcbiAgfVxuICBcbiAgXG4gIHNldEFib3ZlQmdPcGFjaXR5KCkge1xuXG4gICAgLy8g0J/QvtC60LDQt9GL0LLQsNC10Lwg0YHQutGA0L7Qu9C70LHQsNGAXG4gICAgdGhpcy5wcm9ncmVzc0Jhci5zdHlsZS53aWR0aCA9IHRoaXMuY2FsY1Njcm9sbFBlcmNlbnQoKSArICclJztcbiAgICBcbiAgICAvLyDQldGB0LvQuCDQvNGLINC90LDRhdC+0LTQuNC80YHRjyDQvdC1INCyINC+0LHQu9Cw0YHRgtC4INC/0YDQvtGB0LzQvtGC0YDQsCDRgdC10LrRhtC40LgsINCy0YHQtSDRgdC70L7QuNGFINGB0LLQtdGA0YXRgyDQtNC10LvQsNC10Lwg0L/RgNC+0LfRgNCw0YfQvdGL0LzQuFxuICAgIGlmICh0aGlzLmNhbGNTY3JvbGxQZXJjZW50KCkgPT09IHVuZGVmaW5lZCB8fCB0aGlzLmNhbGNTY3JvbGxQZXJjZW50KCkgPCAwIHx8IHRoaXMuY2FsY1Njcm9sbFBlcmNlbnQoKSA+IDEwMCkge1xuICAgICAgdGhpcy5mb2cuc3R5bGUub3BhY2l0eSA9IDA7XG4gICAgICB0aGlzLnNtb2tlMS5zdHlsZS5vcGFjaXR5ID0gMDtcbiAgICAgIHRoaXMuc21va2UyLnN0eWxlLm9wYWNpdHkgPSAwO1xuICAgICAgdGhpcy5zbW9rZTMuc3R5bGUub3BhY2l0eSA9IDA7XG5cbiAgICAgIHRoaXMucHJvZ3Jlc3NCYXIuc3R5bGUud2lkdGggPSAwO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIC8vINCe0LHRgNCw0LHQsNGC0YvQstCw0LXQvCDRgdC60YDQvtC70Lsg0LLQvdC40LdcbiAgICBpZiAodGhpcy5kaXJlY3Rpb24gPT09ICd0by1ib3R0b20nKSB7XG5cbiAgICAgIC8vINCU0LvRjyDQv9C10YDQstC+0LPQviDRjdC70LXQvNC10L3RgtCwINC90LUg0LTQtdC70LDQtdC8INCw0L3QuNC80LDRhtC40LkgXCLQstGF0L7QtNCwXCJcbiAgICAgIGlmICh0aGlzLnNlY3Rpb25zLmluZGV4T2YodGhpcy5jdXJyZW50U2VjdGlvbikgIT09IDApIHtcblxuICAgICAgICAvLyDQldGB0LvQuCDRgdC60YDQvtC70Lsg0LzQtdC90YzRiNC1IDI1JSwg0YLQviDRg9Cx0LjRgNCw0LXQvCDQv9GA0L7Qt9GA0LDRh9C90L7RgdGC0Ywg0YMgXCLRgtGD0LzQsNC90LBcIi5cbiAgICAgICAgLy8g0Lgg0YPRgdGC0LDQvdCw0LLQu9C40LLQsNC10Lwg0YHQutC+0YDQvtGB0YLRjCDRgtGA0LDQvdC30LjRiNC10L3QsCwg0YfRgtC+0LHRiyDQsdGL0LvQviDQv9C70LDQstC90L4uXG4gICAgICAgIGlmICh0aGlzLmNhbGNTY3JvbGxQZXJjZW50KCkgPD0gMjUpIHtcbiAgICAgICAgICB0aGlzLmZvZy5zdHlsZS50cmFuc2l0aW9uID0gJ29wYWNpdHkgMXMnO1xuICAgICAgICAgIHRoaXMuZm9nLnN0eWxlLm9wYWNpdHkgPSAwO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIC8vINCV0YHQu9C4INC90LXRgiwg0YLQviDQstC+0LfQstGA0LDRidCw0LXQvCDRgtGA0LDQvdC30LjRiNC9INCyINGB0YLQsNC90LTQsNGA0YLQvdC+0LUg0L/QvtC70L7QttC10L3QuNC1XG4gICAgICAgICAgdGhpcy5mb2cuc3R5bGUudHJhbnNpdGlvbiA9ICdvcGFjaXR5IDAuMnMnO1xuICAgICAgICB9XG4gICAgICB9XG5cblxuICAgICAgLy8g0JTQu9GPINC/0L7RgdC70LXQtNC90LXQs9C+INGN0LvQtdC80LXQvdGC0LAg0L3QtSDQtNC10LvQsNC10Lwg0LDQvdC40LzQsNGG0LjQuSBcItCS0YvRhdC+0LTQsFwiLiBcbiAgICAgIGlmICh0aGlzLmN1cnJlbnRTZWN0aW9uICE9PSB0aGlzLnNlY3Rpb25zW3RoaXMuc2VjdGlvbnMubGVuZ3RoIC0gMV0pIHtcblxuICAgICAgICAvLyAg0JTRi9C8INCy0YvRhdC+0LRcbiAgICAgICAgaWYgKHRoaXMuY2FsY1Njcm9sbFBlcmNlbnQoKSA+PSA1NSkge1xuICAgICAgICAgIHRoaXMuc21va2UxLnN0eWxlLm9wYWNpdHkgPSAxO1xuICAgICAgICB9IFxuXG4gICAgICAgIGlmICh0aGlzLmNhbGNTY3JvbGxQZXJjZW50KCkgPj0gNjUpIHtcbiAgICAgICAgICB0aGlzLnNtb2tlMi5zdHlsZS5vcGFjaXR5ID0gMTtcbiAgICAgICAgfSBcblxuICAgICAgICBpZiAodGhpcy5jYWxjU2Nyb2xsUGVyY2VudCgpID49IDcwKSB7XG4gICAgICAgICAgdGhpcy5zbW9rZTMuc3R5bGUub3BhY2l0eSA9IDE7XG4gICAgICAgIH0gXG5cbiAgICAgICAgaWYgKHRoaXMuY2FsY1Njcm9sbFBlcmNlbnQoKSA+PSA3NSkge1xuICAgICAgICAgIHRoaXMuZm9nLnN0eWxlLm9wYWNpdHkgPSAodGhpcy5jYWxjU2Nyb2xsUGVyY2VudCgpIC0gNzUpICogNSArICclJztcbiAgICAgICAgfSBcbiAgICAgIH1cblxuXG4gICAgICAvLyDQlNGL0Lwg0LLRhdC+0LRcbiAgICAgIGlmICh0aGlzLmNhbGNTY3JvbGxQZXJjZW50KCkgPj0gNSAmJiB0aGlzLmNhbGNTY3JvbGxQZXJjZW50KCkgPCA0MCAmJiB0aGlzLmRpcmVjdGlvbiA9PT0gJ3RvLWJvdHRvbScpIHtcbiAgICAgICAgdGhpcy5zbW9rZTEuc3R5bGUub3BhY2l0eSA9IDA7XG4gICAgICB9IFxuXG4gICAgICBpZiAodGhpcy5jYWxjU2Nyb2xsUGVyY2VudCgpID49IDEzICYmIHRoaXMuY2FsY1Njcm9sbFBlcmNlbnQoKSA8IDQwICYmIHRoaXMuZGlyZWN0aW9uID09PSAndG8tYm90dG9tJykge1xuICAgICAgICB0aGlzLnNtb2tlMi5zdHlsZS5vcGFjaXR5ID0gMDtcbiAgICAgIH0gXG5cbiAgICAgIGlmICh0aGlzLmNhbGNTY3JvbGxQZXJjZW50KCkgPj0gMTAgJiYgdGhpcy5jYWxjU2Nyb2xsUGVyY2VudCgpIDwgNDAgJiYgdGhpcy5kaXJlY3Rpb24gPT09ICd0by1ib3R0b20nKSB7XG4gICAgICAgIHRoaXMuc21va2UzLnN0eWxlLm9wYWNpdHkgPSAwO1xuICAgICAgfSBcblxuICAgIH1cblxuXG4gICAgaWYgKHRoaXMuZGlyZWN0aW9uID09PSAndG8tdG9wJykge1xuICAgICAgLy8g0JTQu9GPINC/0LXRgNCy0L7Qs9C+INGN0LvQtdC80LXQvdGC0LAg0L3QtSDQtNC10LvQsNC10Lwg0LDQvdC40LzQsNGG0LjQuSBcItCy0YXQvtC00LBcIlxuICAgICAgXG4gICAgICBpZiAodGhpcy5zZWN0aW9ucy5pbmRleE9mKHRoaXMuY3VycmVudFNlY3Rpb24pICE9PSAwKSB7XG5cbiAgICAgICAgLy8g0JTQtdC70LDQtdC8IFwi0LfQsNGC0LXQvdC10L3QuNC1XCIsINC10YHQu9C4INC40LTRkdC8INCy0LLQtdGA0YVcbiAgICAgICAgaWYgKHRoaXMuY2FsY1Njcm9sbFBlcmNlbnQoKSA8PSAyNSkge1xuICAgICAgICAgIC8vIGNvbnNvbGUubG9nKDEyNSAtIHRoaXMuY2FsY1Njcm9sbFBlcmNlbnQoKSAqIDQgKyAnJScpO1xuICAgICAgICAgIHRoaXMuZm9nLnN0eWxlLm9wYWNpdHkgPSAxMjUgLSB0aGlzLmNhbGNTY3JvbGxQZXJjZW50KCkgKiA0ICsgJyUnO1xuICAgICAgICB9IFxuXG4gICAgICAgIC8vINCU0YvQvCDQv9GA0Lgg0L/RgNC+0LrRgNGD0YLQutC1INCy0LLQtdGA0YVcbiAgICAgICAgaWYgKHRoaXMuY2FsY1Njcm9sbFBlcmNlbnQoKSA8PSAxNSkge1xuICAgICAgICAgIHRoaXMuc21va2UxLnN0eWxlLm9wYWNpdHkgPSAxO1xuICAgICAgICB9IFxuXG4gICAgICAgIGlmICh0aGlzLmNhbGNTY3JvbGxQZXJjZW50KCkgPD0gMjMpIHtcbiAgICAgICAgICB0aGlzLnNtb2tlMi5zdHlsZS5vcGFjaXR5ID0gMTtcbiAgICAgICAgfSBcblxuICAgICAgICBpZiAodGhpcy5jYWxjU2Nyb2xsUGVyY2VudCgpIDw9IDM1KSB7XG4gICAgICAgICAgdGhpcy5zbW9rZTMuc3R5bGUub3BhY2l0eSA9IDE7XG4gICAgICAgIH0gXG4gICAgICB9XG5cbiAgICAgIGlmICh0aGlzLmNhbGNTY3JvbGxQZXJjZW50KCkgPj0gODUpIHtcbiAgICAgICAgdGhpcy5mb2cuc3R5bGUudHJhbnNpdGlvbiA9ICdvcGFjaXR5IDFzJztcbiAgICAgICAgdGhpcy5mb2cuc3R5bGUub3BhY2l0eSA9IDA7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAvLyDQldGB0LvQuCDQvdC10YIsINGC0L4g0LLQvtC30LLRgNCw0YnQsNC10Lwg0YLRgNCw0L3Qt9C40YjQvSDQsiDRgdGC0LDQvdC00LDRgNGC0L3QvtC1INC/0L7Qu9C+0LbQtdC90LjQtVxuICAgICAgICB0aGlzLmZvZy5zdHlsZS50cmFuc2l0aW9uID0gJ29wYWNpdHkgMC4ycyc7XG4gICAgICB9XG5cbiAgICAgIC8vINCU0YvQvCDQstCy0LXRgNGFINC30LDRgtC80LXQvdC10L3QuNC1INC/0YDQuCDQv9C10YDQtdGF0L7QtNC1INGBINC/0YDQtdC00YvQtNGD0YnQtdCz0L5cbiAgICAgIGlmICh0aGlzLmNhbGNTY3JvbGxQZXJjZW50KCkgPD0gOTAgJiYgdGhpcy5jYWxjU2Nyb2xsUGVyY2VudCgpID49IDUwKSB7XG4gICAgICAgIHRoaXMuc21va2UxLnN0eWxlLm9wYWNpdHkgPSAwO1xuICAgICAgfSBcbiAgXG4gICAgICBpZiAodGhpcy5jYWxjU2Nyb2xsUGVyY2VudCgpIDw9IDgwICYmIHRoaXMuY2FsY1Njcm9sbFBlcmNlbnQoKSA+PSA1MCkge1xuICAgICAgICB0aGlzLnNtb2tlMi5zdHlsZS5vcGFjaXR5ID0gMDtcbiAgICAgIH0gXG4gIFxuICAgICAgaWYgKHRoaXMuY2FsY1Njcm9sbFBlcmNlbnQoKSA8PSA3MCAmJiB0aGlzLmNhbGNTY3JvbGxQZXJjZW50KCkgPj0gNTApIHtcbiAgICAgICAgdGhpcy5zbW9rZTMuc3R5bGUub3BhY2l0eSA9IDA7XG4gICAgICB9IFxuICAgICAgXG4gICAgfVxuXG4gICAgLy8g0JzQtdC90Y/QtdC8INC+0YHQvdC+0LLQvdC+0Lkg0YbQstC10YJcbiAgICBpZiAodGhpcy5jYWxjU2Nyb2xsUGVyY2VudCgpID49IDQwICYmIHRoaXMuY2FsY1Njcm9sbFBlcmNlbnQoKSA8PSA2MCkge1xuXG4gICAgICBpZiAodGhpcy5jdXJyZW50U2VjdGlvbi5jbGFzc0xpc3QuY29udGFpbnMoJ2Z1bGwtc2Nyb2xsX19zZXQtYmxhY2stZm9nJykpIHtcbiAgICAgICAgdGhpcy5mb2cuc3R5bGUuYmFja2dyb3VuZENvbG9yID0gJyMwMzBjMWEnO1xuICAgICAgICB0aGlzLnNtb2tlMS5zdHlsZS5iYWNrZ3JvdW5kSW1hZ2UgPSBgdXJsKCdpbWcvc21va2UvMS1ibGFjay5wbmcnKWA7XG4gICAgICAgIHRoaXMuc21va2UyLnN0eWxlLmJhY2tncm91bmRJbWFnZSA9IGB1cmwoJ2ltZy9zbW9rZS8yLWJsYWNrLnBuZycpYDtcbiAgICAgICAgdGhpcy5zbW9rZTMuc3R5bGUuYmFja2dyb3VuZEltYWdlID0gYHVybCgnaW1nL3Ntb2tlLzMtYmxhY2sucG5nJylgO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5mb2cuc3R5bGUuYmFja2dyb3VuZENvbG9yID0gJyNmZGY1ZTYnO1xuICAgICAgICB0aGlzLnNtb2tlMS5zdHlsZS5iYWNrZ3JvdW5kSW1hZ2UgPSBgdXJsKCdpbWcvc21va2UvMS5wbmcnKWA7XG4gICAgICAgIHRoaXMuc21va2UyLnN0eWxlLmJhY2tncm91bmRJbWFnZSA9IGB1cmwoJ2ltZy9zbW9rZS8yLnBuZycpYDtcbiAgICAgICAgdGhpcy5zbW9rZTMuc3R5bGUuYmFja2dyb3VuZEltYWdlID0gYHVybCgnaW1nL3Ntb2tlLzMucG5nJylgO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGV2ZW50SGVuZGxlcigpIHtcbiAgICBsZXQgb2Zmc2V0ID0gcGFnZVlPZmZzZXQ7XG4gICAgXG4gICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignc2Nyb2xsJywgKCkgPT4ge1xuICAgICAgdGhpcy5jaGFuZ2VFbGVtZW50VmlzaWJsZSgpO1xuICAgICAgdGhpcy5zZXRBYm92ZUJnT3BhY2l0eSgpO1xuICAgICAgXG4gICAgICBpZiAocGFnZVlPZmZzZXQgLSBvZmZzZXQgPCAwKSB7XG4gICAgICAgIHRoaXMuZGlyZWN0aW9uID0gJ3RvLXRvcCc7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLmRpcmVjdGlvbiA9ICd0by1ib3R0b20nO1xuICAgICAgfVxuICAgICAgb2Zmc2V0ID0gcGFnZVlPZmZzZXQ7XG5cbiAgICB9KTtcbiAgfVxuXG4gIHRvU3RhbmRhcnRTY3JvbGwoKSB7XG4gICAgdGhpcy5zZWN0aW9ucy5mb3JFYWNoKGl0ZW0gPT4ge1xuICAgICAgaXRlbS5jbGFzc0xpc3QuYWRkKCdmdWxsLXNjcm9sbF9fZWxlbWVudC1zdGFuZGFyZC1oZWlnaHQnKTtcbiAgICB9KTtcbiAgfVxufSIsImNvbnN0IHNlY3Rpb25TbGlkZXIgPSBuZXcgU2NyZWVuU2xpZGVyKCdmdWxsLXNjcm9sbCcpO1xuLy8gY29uc3Qgc2VjdGlvblNsaWRlcjIgPSBuZXcgU2NyZWVuU2xpZGVyKCdmdWxsLXNjcm9sbDInKTsiXX0=
