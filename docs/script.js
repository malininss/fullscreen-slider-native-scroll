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
      if (this.calcScrollPercent() === undefined || this.calcScrollPercent() < 0 || this.calcScrollPercent() > 100) {
        this.fog.style.opacity = 0;
        this.smoke1.style.opacity = 0;
        this.smoke2.style.opacity = 0;
        this.smoke3.style.opacity = 0;
        this.progressBar.style.width = 0;
        return;
      }

      this.progressBar.style.width = this.calcScrollPercent() + '%'; // console.log(this.calcScrollPercent());
      // Для первого элемента не делаем анимаций "входа"

      if (this.sections.indexOf(this.currentSection) !== 0) {
        // Если скролл меньше 25%, то убираем прозрачность у "тумана".
        // и устанавливаем скорость транзишена, чтобы было плавно. Нужно для "Выхода" из тумана
        if (this.calcScrollPercent() <= 25 && this.direction === 'to-bottom') {
          this.fog.style.transition = 'opacity 1s';
          this.fog.style.opacity = 0;
        } else {
          // Если нет, то возвращаем транзишн в стандартное положение
          this.fog.style.transition = 'opacity 0.2s';
        } // Делаем "затенение", если идём вверх


        if (this.calcScrollPercent() <= 25 && this.direction === 'to-top') {
          // console.log(125 - this.calcScrollPercent() * 4 + '%');
          this.fog.style.opacity = 125 - this.calcScrollPercent() * 4 + '%';
        } // Дым при прокрутке вверх


        if (this.calcScrollPercent() <= 15 && this.direction === 'to-top') {
          // console.log(1);
          this.smoke1.style.opacity = 1;
        }

        if (this.calcScrollPercent() <= 23 && this.direction === 'to-top') {
          // console.log(2);
          this.smoke2.style.opacity = 1;
        }

        if (this.calcScrollPercent() <= 35 && this.direction === 'to-top') {
          // console.log(3);
          this.smoke3.style.opacity = 1;
        }
      }

      if (this.calcScrollPercent() >= 85 && this.direction === 'to-top') {
        this.fog.style.transition = 'opacity 1s';
        this.fog.style.opacity = 0;
      } else {
        // Если нет, то возвращаем транзишн в стандартное положение
        this.fog.style.transition = 'opacity 0.2s';
      } // Для последнего элемента не делаем анимаций "Выхода". 


      if (this.currentSection !== this.sections[this.sections.length - 1]) {
        //  Дым выход
        if (this.calcScrollPercent() >= 55 && this.direction === 'to-bottom') {
          this.smoke1.style.opacity = 1;
        }

        if (this.calcScrollPercent() >= 65 && this.direction === 'to-bottom') {
          this.smoke2.style.opacity = 1;
        }

        if (this.calcScrollPercent() >= 70 && this.direction === 'to-bottom') {
          this.smoke3.style.opacity = 1;
        }

        if (this.calcScrollPercent() >= 75 && this.direction === 'to-bottom') {
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
      } // Дым вверх затменение при переходе с предыдущего


      if (this.calcScrollPercent() <= 90 && this.calcScrollPercent() >= 50 && this.direction === 'to-top') {
        this.smoke1.style.opacity = 0;
      }

      if (this.calcScrollPercent() >= 80 && this.calcScrollPercent() >= 50 && this.direction === 'to-top') {
        this.smoke2.style.opacity = 0;
      }

      if (this.calcScrollPercent() >= 70 && this.calcScrollPercent() >= 50 && this.direction === 'to-top') {
        this.smoke3.style.opacity = 0;
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkFuY2hvckFkZGVyLmpzIiwiU2NyZWVuU2xpZGVyLmpzIiwic2NyaXB0LmpzIl0sIm5hbWVzIjpbIkFuY2hvckFkZGVyIiwiaGlzdG9yeSIsInB1c2hTdGF0ZSIsInNjcm9sbEhhbmRsZXIiLCJjb25zb2xlIiwibG9nIiwiYW5jaG9yc0xpbmsiLCJuYW1lIiwiYmFzZVVybCIsIndpbmRvdyIsImxvY2F0aW9uIiwicHJvdG9jb2wiLCJob3N0IiwicGF0aG5hbWUiLCJuZXdVcmwiLCJkb2N1bWVudCIsImFkZEV2ZW50TGlzdGVuZXIiLCJlbGVtIiwiYm94IiwiZ2V0Qm91bmRpbmdDbGllbnRSZWN0IiwidG9wIiwicGFnZVlPZmZzZXQiLCJib3R0b20iLCJxdWVyeVNlbGVjdG9yQWxsIiwiU2NyZWVuU2xpZGVyIiwiaWQiLCJtYWluQ29udGFpbmVyIiwicXVlcnlTZWxlY3RvciIsIkVycm9yIiwic2VjdGlvbnMiLCJBcnJheSIsImZyb20iLCJmb2ciLCJzbW9rZTEiLCJzbW9rZTIiLCJzbW9rZTMiLCJwcm9ncmVzc0JhciIsImN1cnJlbnRTZWN0aW9uIiwic2Nyb2xsRGlyZWN0aW9uIiwiY2xhc3NMaXN0IiwiY29udGFpbnMiLCJ0b1N0YW5kYXJ0U2Nyb2xsIiwiZXZlbnRIZW5kbGVyIiwiY2hhbmdlRWxlbWVudFZpc2libGUiLCJpbmRleE9mIiwibGVuZ3RoIiwiTWF0aCIsImZsb29yIiwiZ2V0Q29vcmRzIiwiY2xpZW50SGVpZ2h0IiwiaW5uZXJIZWlnaHQiLCJmb3JFYWNoIiwiaXRlbSIsImZpeGVkQmxvY2siLCJlbGVtQ29vcmRzIiwiYWRkIiwicmVtb3ZlIiwiY2FsY1Njcm9sbFBlcmNlbnQiLCJ1bmRlZmluZWQiLCJzdHlsZSIsIm9wYWNpdHkiLCJ3aWR0aCIsImRpcmVjdGlvbiIsInRyYW5zaXRpb24iLCJiYWNrZ3JvdW5kQ29sb3IiLCJiYWNrZ3JvdW5kSW1hZ2UiLCJvZmZzZXQiLCJzZXRBYm92ZUJnT3BhY2l0eSIsInNlY3Rpb25TbGlkZXIiXSwi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Q0FBQUssZUFBQSxHQUFBLFNBQUE7QUFDQSxlQUFBL0IsTUFBQSxDQUFBMEIsS0FBQSxDQUFBTSxlQUFBO0FBQ0EsZUFBQS9CLE1BQUEsQ0FBQXlCLEtBQUEsQ0FBQU0sZUFBQTtBQUNBLGVBQUE5QixNQUFBLENBQUF3QixLQUFBLENBQUFNLGVBQUE7QUFDQTtBQUNBO0FBQ0E7OzttQ0FFQTtBQUFBOztBQUVBLFVBQUFDLE1BQUEsR0FBQTdDLFdBQUE7QUFFQU4sTUFBQUEsUUFBQSxDQUFBQyxnQkFBQSxDQUFBLFFBQUEsRUFBQSxZQUFBO0FBQ0EsUUFBQSxNQUFBLENBQUEyQixvQkFBQTs7QUFDQSxRQUFBLE1BQUEsQ0FBQXdCLGlCQUFBOztBQUVBLFlBQUE5QyxXQUFBLEdBQUE2QyxNQUFBLEdBQUEsQ0FBQSxFQUFBO0FBQ0EsVUFBQSxNQUFBLENBQUFKLFNBQUEsR0FBQSxRQUFBO0FBQ0EsU0FGQSxNQUVBO0FBQ0EsVUFBQSxNQUFBLENBQUFBLFNBQUEsR0FBQSxXQUFBO0FBQ0E7O0FBQ0FJLFFBQUFBLE1BQUEsR0FBQTdDLFdBQUE7QUFFQSxPQVhBO0FBWUE7Ozt1Q0FFQTtBQUNBLFdBQUFRLFFBQUEsQ0FBQXNCLE9BQUEsQ0FBQSxVQUFBQyxJQUFBLEVBQUE7QUFDQUEsUUFBQUEsSUFBQSxDQUFBYixTQUFBLENBQUFnQixHQUFBLENBQUEsc0NBQUE7QUFDQSxPQUZBO0FBR0E7Ozs7OztBQ25PQSxJQUFBYSxhQUFBLEdBQUEsSUFBQTVDLFlBQUEsQ0FBQSxhQUFBLENBQUEsQyxDQUNBIiwiZmlsZSI6InNjcmlwdC5qcyIsInNvdXJjZXNDb250ZW50IjpbImNsYXNzIEFuY2hvckFkZGVyIHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgaWYgKCFoaXN0b3J5LnB1c2hTdGF0ZSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHRoaXMuc2Nyb2xsSGFuZGxlcigpO1xuXG4gICAgY29uc29sZS5sb2codGhpcy5hbmNob3JzTGluayk7XG4gIH1cblxuICBhZGRBbmNob3IobmFtZSkge1xuICAgIHZhciBiYXNlVXJsID0gd2luZG93LmxvY2F0aW9uLnByb3RvY29sICsgXCIvL1wiICsgd2luZG93LmxvY2F0aW9uLmhvc3QgKyB3aW5kb3cubG9jYXRpb24ucGF0aG5hbWU7XG4gICAgdmFyIG5ld1VybCA9IGJhc2VVcmwgKyAnI3Rlc3QnO1xuICAgIGhpc3RvcnkucHVzaFN0YXRlKG51bGwsIG51bGwsIG5ld1VybCk7XG4gIH1cblxuICBzY3JvbGxIYW5kbGVyKCkge1xuICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ3Njcm9sbCcsICgpID0+IHtcbiAgICAgIFxuICAgIH0pO1xuICB9XG5cblxuICAvLyDQlNGD0LHQu9GMLCDQstGL0L3QtdGB0YLQuCDQsiDQvtCx0YnQuNC1INGE0YPQvdC60YbQuNC4XG4gIGdldENvb3JkcyhlbGVtKSB7XG4gICAgdmFyIGJveCA9IGVsZW0uZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgcmV0dXJuIHtcbiAgICAgIHRvcDogYm94LnRvcCArIHBhZ2VZT2Zmc2V0LFxuICAgICAgYm90dG9tOiBib3guYm90dG9tICsgcGFnZVlPZmZzZXRcbiAgICB9O1xuICB9XG5cbiAgZ2V0IGFuY2hvcnNMaW5rICgpIHtcbiAgICByZXR1cm4gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChgW2RhdGEtYW5jaG9yXWApO1xuICB9XG5cblxuXG59IiwiY2xhc3MgU2NyZWVuU2xpZGVyIHtcbiAgY29uc3RydWN0b3IoaWQpIHtcbiAgICB0aGlzLm1haW5Db250YWluZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGAjJHtpZH1gKTtcblxuICAgIGlmICghdGhpcy5tYWluQ29udGFpbmVyKSB7XG4gICAgICB0aHJvdyhuZXcgRXJyb3IoJ0lkINC90LUg0L/QtdGA0LXQtNCw0L0g0LIg0LrQvtC90YHRgtGA0YPQutGC0L7RgCDRjdC70LXQvNC10L3RgtCwIFNjcmVlblNsaWRlciwg0LvQuNCx0L4g0Y3Qu9C10LzQtdC90YIg0L3QtSDQvdCw0LnQtNC10L0g0L3QsCDRgdGC0YDQsNC90LjRhtC1JykpO1xuICAgIH1cblxuICAgIHRoaXMuc2VjdGlvbnMgPSBBcnJheS5mcm9tKHRoaXMubWFpbkNvbnRhaW5lci5xdWVyeVNlbGVjdG9yQWxsKCcuZnVsbC1zY3JvbGxfX2VsZW1lbnQnKSk7XG4gICAgdGhpcy5mb2cgPSB0aGlzLm1haW5Db250YWluZXIucXVlcnlTZWxlY3RvcignLmZ1bGwtc2Nyb2xsX19mb2cnKTtcblxuICAgIHRoaXMuc21va2UxID0gdGhpcy5tYWluQ29udGFpbmVyLnF1ZXJ5U2VsZWN0b3IoJy5mdWxsLXNjcm9sbF9fc21va2VfYmcxJyk7XG4gICAgdGhpcy5zbW9rZTIgPSB0aGlzLm1haW5Db250YWluZXIucXVlcnlTZWxlY3RvcignLmZ1bGwtc2Nyb2xsX19zbW9rZV9iZzInKTtcbiAgICB0aGlzLnNtb2tlMyA9IHRoaXMubWFpbkNvbnRhaW5lci5xdWVyeVNlbGVjdG9yKCcuZnVsbC1zY3JvbGxfX3Ntb2tlX2JnMycpO1xuXG4gICAgdGhpcy5wcm9ncmVzc0JhciA9IHRoaXMubWFpbkNvbnRhaW5lci5xdWVyeVNlbGVjdG9yKCcuZnVsbC1zY3JvbGxfX3Byb2dyZXNzLWJhcicpO1xuXG4gICAgdGhpcy5jdXJyZW50U2VjdGlvbiA9ICcnO1xuICAgIHRoaXMuc2Nyb2xsRGlyZWN0aW9uO1xuXG4gICAgaWYgKHRoaXMubWFpbkNvbnRhaW5lci5jbGFzc0xpc3QuY29udGFpbnMoJ2Z1bGwtc2Nyb2xsX190by1zdGFuZGFydC1zY3JvbGwnKSkge1xuICAgICAgdGhpcy50b1N0YW5kYXJ0U2Nyb2xsKCk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdGhpcy5ldmVudEhlbmRsZXIoKTtcbiAgICB0aGlzLmNoYW5nZUVsZW1lbnRWaXNpYmxlKCk7XG4gICAgXG4gIH1cblxuXG4gIGdldENvb3JkcyhlbGVtKSB7XG4gICAgdmFyIGJveCA9IGVsZW0uZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgcmV0dXJuIHtcbiAgICAgIHRvcDogYm94LnRvcCArIHBhZ2VZT2Zmc2V0LFxuICAgICAgYm90dG9tOiBib3guYm90dG9tICsgcGFnZVlPZmZzZXRcbiAgICB9O1xuICB9XG4gIFxuICBjYWxjU2Nyb2xsUGVyY2VudCgpIHtcbiAgICAvLyBjb25zb2xlLmxvZyh0aGlzLnNlY3Rpb25zLmluZGV4T2YodGhpcy5jdXJyZW50U2VjdGlvbikpXG4gICAgaWYgKHRoaXMuc2VjdGlvbnMuaW5kZXhPZih0aGlzLmN1cnJlbnRTZWN0aW9uKSA9PT0gdGhpcy5zZWN0aW9ucy5sZW5ndGggLSAxKSB7XG4gICAgICByZXR1cm4gTWF0aC5mbG9vcigocGFnZVlPZmZzZXQgLSB0aGlzLmdldENvb3Jkcyh0aGlzLmN1cnJlbnRTZWN0aW9uKS50b3ApIC8gKHRoaXMuY3VycmVudFNlY3Rpb24uY2xpZW50SGVpZ2h0IC0gd2luZG93LmlubmVySGVpZ2h0KSAgKiAxMDApO1xuICAgIH1cblxuICAgIGlmICh0aGlzLmN1cnJlbnRTZWN0aW9uKSB7XG4gICAgICByZXR1cm4gTWF0aC5mbG9vcigocGFnZVlPZmZzZXQgLSB0aGlzLmdldENvb3Jkcyh0aGlzLmN1cnJlbnRTZWN0aW9uKS50b3ApIC8gdGhpcy5jdXJyZW50U2VjdGlvbi5jbGllbnRIZWlnaHQgKiAxMDApO1xuICAgIH1cbiAgfVxuICBjaGFuZ2VFbGVtZW50VmlzaWJsZSgpIHtcbiAgICB0aGlzLnNlY3Rpb25zLmZvckVhY2goaXRlbSA9PiB7XG4gICAgICBjb25zdCBmaXhlZEJsb2NrID0gaXRlbS5xdWVyeVNlbGVjdG9yKCcuZnVsbC1zY3JvbGxfX2ZpeGVkLXdyYXBwZXInKTtcbiAgICAgIGNvbnN0IGVsZW1Db29yZHMgPSB0aGlzLmdldENvb3JkcyhpdGVtKTtcbiAgICAgIGlmIChwYWdlWU9mZnNldCA+PSBlbGVtQ29vcmRzLnRvcCAmJiBlbGVtQ29vcmRzLmJvdHRvbSA+PSBwYWdlWU9mZnNldCkge1xuICAgICAgICB0aGlzLmN1cnJlbnRTZWN0aW9uID0gaXRlbTtcbiAgICAgICAgZml4ZWRCbG9jay5jbGFzc0xpc3QuYWRkKCdmdWxsLXNjcm9sbF9fZml4LXN0YXRlJyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBmaXhlZEJsb2NrLmNsYXNzTGlzdC5yZW1vdmUoJ2Z1bGwtc2Nyb2xsX19maXgtc3RhdGUnKTtcbiAgICAgIH1cblxuICAgICAgaWYgKHRoaXMuY3VycmVudFNlY3Rpb24gPT09IHRoaXMuc2VjdGlvbnNbdGhpcy5zZWN0aW9ucy5sZW5ndGggLSAxXSkge1xuICAgICAgICBpZiAocGFnZVlPZmZzZXQgPj0gdGhpcy5nZXRDb29yZHModGhpcy5jdXJyZW50U2VjdGlvbikuYm90dG9tIC0gd2luZG93LmlubmVySGVpZ2h0KSB7XG4gICAgICAgICAgZml4ZWRCbG9jay5jbGFzc0xpc3QucmVtb3ZlKCdmdWxsLXNjcm9sbF9fZml4LXN0YXRlJyk7XG4gICAgICAgICAgZml4ZWRCbG9jay5jbGFzc0xpc3QuYWRkKCdmdWxsLXNjcm9sbF9fbGFzdC1lbGVtJyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgZml4ZWRCbG9jay5jbGFzc0xpc3QucmVtb3ZlKCdmdWxsLXNjcm9sbF9fbGFzdC1lbGVtJyk7XG4gICAgICAgIH1cbiAgICAgIH0gXG4gICAgfSk7XG4gIH1cbiAgXG4gIFxuICBzZXRBYm92ZUJnT3BhY2l0eSgpIHtcblxuICAgIGlmICh0aGlzLmNhbGNTY3JvbGxQZXJjZW50KCkgPT09IHVuZGVmaW5lZCB8fCB0aGlzLmNhbGNTY3JvbGxQZXJjZW50KCkgPCAwIHx8IHRoaXMuY2FsY1Njcm9sbFBlcmNlbnQoKSA+IDEwMCkge1xuICAgICAgdGhpcy5mb2cuc3R5bGUub3BhY2l0eSA9IDA7XG4gICAgICB0aGlzLnNtb2tlMS5zdHlsZS5vcGFjaXR5ID0gMDtcbiAgICAgIHRoaXMuc21va2UyLnN0eWxlLm9wYWNpdHkgPSAwO1xuICAgICAgdGhpcy5zbW9rZTMuc3R5bGUub3BhY2l0eSA9IDA7XG5cbiAgICAgIHRoaXMucHJvZ3Jlc3NCYXIuc3R5bGUud2lkdGggPSAwO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHRoaXMucHJvZ3Jlc3NCYXIuc3R5bGUud2lkdGggPSB0aGlzLmNhbGNTY3JvbGxQZXJjZW50KCkgKyAnJSc7XG5cblxuXG4gICAgLy8gY29uc29sZS5sb2codGhpcy5jYWxjU2Nyb2xsUGVyY2VudCgpKTtcbiAgICBcbiAgICAvLyDQlNC70Y8g0L/QtdGA0LLQvtCz0L4g0Y3Qu9C10LzQtdC90YLQsCDQvdC1INC00LXQu9Cw0LXQvCDQsNC90LjQvNCw0YbQuNC5IFwi0LLRhdC+0LTQsFwiXG4gICAgaWYgKHRoaXMuc2VjdGlvbnMuaW5kZXhPZih0aGlzLmN1cnJlbnRTZWN0aW9uKSAhPT0gMCkge1xuICAgICAgXG4gICAgICAvLyDQldGB0LvQuCDRgdC60YDQvtC70Lsg0LzQtdC90YzRiNC1IDI1JSwg0YLQviDRg9Cx0LjRgNCw0LXQvCDQv9GA0L7Qt9GA0LDRh9C90L7RgdGC0Ywg0YMgXCLRgtGD0LzQsNC90LBcIi5cbiAgICAgIC8vINC4INGD0YHRgtCw0L3QsNCy0LvQuNCy0LDQtdC8INGB0LrQvtGA0L7RgdGC0Ywg0YLRgNCw0L3Qt9C40YjQtdC90LAsINGH0YLQvtCx0Ysg0LHRi9C70L4g0L/Qu9Cw0LLQvdC+LiDQndGD0LbQvdC+INC00LvRjyBcItCS0YvRhdC+0LTQsFwiINC40Lcg0YLRg9C80LDQvdCwXG4gICAgICBpZiAodGhpcy5jYWxjU2Nyb2xsUGVyY2VudCgpIDw9IDI1ICYmIHRoaXMuZGlyZWN0aW9uID09PSAndG8tYm90dG9tJykge1xuICAgICAgICB0aGlzLmZvZy5zdHlsZS50cmFuc2l0aW9uID0gJ29wYWNpdHkgMXMnO1xuICAgICAgICB0aGlzLmZvZy5zdHlsZS5vcGFjaXR5ID0gMDtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIC8vINCV0YHQu9C4INC90LXRgiwg0YLQviDQstC+0LfQstGA0LDRidCw0LXQvCDRgtGA0LDQvdC30LjRiNC9INCyINGB0YLQsNC90LTQsNGA0YLQvdC+0LUg0L/QvtC70L7QttC10L3QuNC1XG4gICAgICAgIHRoaXMuZm9nLnN0eWxlLnRyYW5zaXRpb24gPSAnb3BhY2l0eSAwLjJzJztcbiAgICAgIH1cblxuICAgICAgLy8g0JTQtdC70LDQtdC8IFwi0LfQsNGC0LXQvdC10L3QuNC1XCIsINC10YHQu9C4INC40LTRkdC8INCy0LLQtdGA0YVcbiAgICAgIGlmICh0aGlzLmNhbGNTY3JvbGxQZXJjZW50KCkgPD0gMjUgJiYgdGhpcy5kaXJlY3Rpb24gPT09ICd0by10b3AnKSB7XG4gICAgICAgIC8vIGNvbnNvbGUubG9nKDEyNSAtIHRoaXMuY2FsY1Njcm9sbFBlcmNlbnQoKSAqIDQgKyAnJScpO1xuICAgICAgICB0aGlzLmZvZy5zdHlsZS5vcGFjaXR5ID0gMTI1IC0gdGhpcy5jYWxjU2Nyb2xsUGVyY2VudCgpICogNCArICclJztcbiAgICAgIH0gXG5cblxuICAgICAgLy8g0JTRi9C8INC/0YDQuCDQv9GA0L7QutGA0YPRgtC60LUg0LLQstC10YDRhVxuICAgICAgaWYgKHRoaXMuY2FsY1Njcm9sbFBlcmNlbnQoKSA8PSAxNSAmJiB0aGlzLmRpcmVjdGlvbiA9PT0gJ3RvLXRvcCcpIHtcbiAgICAgICAgLy8gY29uc29sZS5sb2coMSk7XG4gICAgICAgIHRoaXMuc21va2UxLnN0eWxlLm9wYWNpdHkgPSAxO1xuICAgICAgfSBcblxuICAgICAgaWYgKHRoaXMuY2FsY1Njcm9sbFBlcmNlbnQoKSA8PSAyMyAmJiB0aGlzLmRpcmVjdGlvbiA9PT0gJ3RvLXRvcCcpIHtcbiAgICAgICAgLy8gY29uc29sZS5sb2coMik7XG4gICAgICAgIHRoaXMuc21va2UyLnN0eWxlLm9wYWNpdHkgPSAxO1xuICAgICAgfSBcblxuICAgICAgaWYgKHRoaXMuY2FsY1Njcm9sbFBlcmNlbnQoKSA8PSAzNSAmJiB0aGlzLmRpcmVjdGlvbiA9PT0gJ3RvLXRvcCcpIHtcbiAgICAgICAgLy8gY29uc29sZS5sb2coMyk7XG4gICAgICAgIHRoaXMuc21va2UzLnN0eWxlLm9wYWNpdHkgPSAxO1xuICAgICAgfSBcbiAgICB9IFxuXG5cbiAgICBpZiAodGhpcy5jYWxjU2Nyb2xsUGVyY2VudCgpID49IDg1ICYmIHRoaXMuZGlyZWN0aW9uID09PSAndG8tdG9wJykge1xuICAgICAgdGhpcy5mb2cuc3R5bGUudHJhbnNpdGlvbiA9ICdvcGFjaXR5IDFzJztcbiAgICAgIHRoaXMuZm9nLnN0eWxlLm9wYWNpdHkgPSAwO1xuICAgIH0gZWxzZSB7XG4gICAgICAvLyDQldGB0LvQuCDQvdC10YIsINGC0L4g0LLQvtC30LLRgNCw0YnQsNC10Lwg0YLRgNCw0L3Qt9C40YjQvSDQsiDRgdGC0LDQvdC00LDRgNGC0L3QvtC1INC/0L7Qu9C+0LbQtdC90LjQtVxuICAgICAgdGhpcy5mb2cuc3R5bGUudHJhbnNpdGlvbiA9ICdvcGFjaXR5IDAuMnMnO1xuICAgIH1cblxuICAgIFxuICAgIC8vINCU0LvRjyDQv9C+0YHQu9C10LTQvdC10LPQviDRjdC70LXQvNC10L3RgtCwINC90LUg0LTQtdC70LDQtdC8INCw0L3QuNC80LDRhtC40LkgXCLQktGL0YXQvtC00LBcIi4gXG4gICAgaWYgKHRoaXMuY3VycmVudFNlY3Rpb24gIT09IHRoaXMuc2VjdGlvbnNbdGhpcy5zZWN0aW9ucy5sZW5ndGggLSAxXSkge1xuICAgICAgLy8gINCU0YvQvCDQstGL0YXQvtC0XG4gICAgICBpZiAodGhpcy5jYWxjU2Nyb2xsUGVyY2VudCgpID49IDU1ICYmIHRoaXMuZGlyZWN0aW9uID09PSAndG8tYm90dG9tJykge1xuICAgICAgICB0aGlzLnNtb2tlMS5zdHlsZS5vcGFjaXR5ID0gMTtcbiAgICAgIH0gXG5cbiAgICAgIGlmICh0aGlzLmNhbGNTY3JvbGxQZXJjZW50KCkgPj0gNjUgJiYgdGhpcy5kaXJlY3Rpb24gPT09ICd0by1ib3R0b20nKSB7XG4gICAgICAgIHRoaXMuc21va2UyLnN0eWxlLm9wYWNpdHkgPSAxO1xuICAgICAgfSBcblxuICAgICAgaWYgKHRoaXMuY2FsY1Njcm9sbFBlcmNlbnQoKSA+PSA3MCAmJiB0aGlzLmRpcmVjdGlvbiA9PT0gJ3RvLWJvdHRvbScpIHtcbiAgICAgICAgdGhpcy5zbW9rZTMuc3R5bGUub3BhY2l0eSA9IDE7XG4gICAgICB9IFxuXG4gICAgICBpZiAodGhpcy5jYWxjU2Nyb2xsUGVyY2VudCgpID49IDc1ICYmIHRoaXMuZGlyZWN0aW9uID09PSAndG8tYm90dG9tJykge1xuICAgICAgICB0aGlzLmZvZy5zdHlsZS5vcGFjaXR5ID0gKHRoaXMuY2FsY1Njcm9sbFBlcmNlbnQoKSAtIDc1KSAqIDUgKyAnJSc7XG4gICAgICB9IFxuICAgIH1cblxuXG4gICAgLy8g0JTRi9C8INCy0YXQvtC0XG4gICAgaWYgKHRoaXMuY2FsY1Njcm9sbFBlcmNlbnQoKSA+PSA1ICYmIHRoaXMuY2FsY1Njcm9sbFBlcmNlbnQoKSA8IDQwICYmIHRoaXMuZGlyZWN0aW9uID09PSAndG8tYm90dG9tJykge1xuICAgICAgdGhpcy5zbW9rZTEuc3R5bGUub3BhY2l0eSA9IDA7XG4gICAgfSBcblxuICAgIGlmICh0aGlzLmNhbGNTY3JvbGxQZXJjZW50KCkgPj0gMTMgJiYgdGhpcy5jYWxjU2Nyb2xsUGVyY2VudCgpIDwgNDAgJiYgdGhpcy5kaXJlY3Rpb24gPT09ICd0by1ib3R0b20nKSB7XG4gICAgICB0aGlzLnNtb2tlMi5zdHlsZS5vcGFjaXR5ID0gMDtcbiAgICB9IFxuXG4gICAgaWYgKHRoaXMuY2FsY1Njcm9sbFBlcmNlbnQoKSA+PSAxMCAmJiB0aGlzLmNhbGNTY3JvbGxQZXJjZW50KCkgPCA0MCAmJiB0aGlzLmRpcmVjdGlvbiA9PT0gJ3RvLWJvdHRvbScpIHtcbiAgICAgIHRoaXMuc21va2UzLnN0eWxlLm9wYWNpdHkgPSAwO1xuXG4gICAgfSBcblxuICAgIFxuICAgIC8vINCU0YvQvCDQstCy0LXRgNGFINC30LDRgtC80LXQvdC10L3QuNC1INC/0YDQuCDQv9C10YDQtdGF0L7QtNC1INGBINC/0YDQtdC00YvQtNGD0YnQtdCz0L5cbiAgICBpZiAodGhpcy5jYWxjU2Nyb2xsUGVyY2VudCgpIDw9IDkwICYmIHRoaXMuY2FsY1Njcm9sbFBlcmNlbnQoKSA+PSA1MCAmJiB0aGlzLmRpcmVjdGlvbiA9PT0gJ3RvLXRvcCcpIHtcbiAgICAgIHRoaXMuc21va2UxLnN0eWxlLm9wYWNpdHkgPSAwO1xuICAgIH0gXG5cbiAgICBpZiAodGhpcy5jYWxjU2Nyb2xsUGVyY2VudCgpID49IDgwICYmIHRoaXMuY2FsY1Njcm9sbFBlcmNlbnQoKSA+PSA1MCAmJiB0aGlzLmRpcmVjdGlvbiA9PT0gJ3RvLXRvcCcpIHtcbiAgICAgIHRoaXMuc21va2UyLnN0eWxlLm9wYWNpdHkgPSAwO1xuICAgIH0gXG5cbiAgICBpZiAodGhpcy5jYWxjU2Nyb2xsUGVyY2VudCgpID49IDcwICYmIHRoaXMuY2FsY1Njcm9sbFBlcmNlbnQoKSA+PSA1MCAmJiB0aGlzLmRpcmVjdGlvbiA9PT0gJ3RvLXRvcCcpIHtcbiAgICAgIHRoaXMuc21va2UzLnN0eWxlLm9wYWNpdHkgPSAwO1xuICAgIH0gXG5cblxuICAgIC8vINCc0LXQvdGP0LXQvCDQvtGB0L3QvtCy0L3QvtC5INGG0LLQtdGCXG4gICAgaWYgKHRoaXMuY2FsY1Njcm9sbFBlcmNlbnQoKSA+PSA0MCAmJiB0aGlzLmNhbGNTY3JvbGxQZXJjZW50KCkgPD0gNjApIHtcblxuICAgICAgaWYgKHRoaXMuY3VycmVudFNlY3Rpb24uY2xhc3NMaXN0LmNvbnRhaW5zKCdmdWxsLXNjcm9sbF9fc2V0LWJsYWNrLWZvZycpKSB7XG4gICAgICAgIHRoaXMuZm9nLnN0eWxlLmJhY2tncm91bmRDb2xvciA9ICcjMDMwYzFhJztcbiAgICAgICAgdGhpcy5zbW9rZTEuc3R5bGUuYmFja2dyb3VuZEltYWdlID0gYHVybCgnaW1nL3Ntb2tlLzEtYmxhY2sucG5nJylgO1xuICAgICAgICB0aGlzLnNtb2tlMi5zdHlsZS5iYWNrZ3JvdW5kSW1hZ2UgPSBgdXJsKCdpbWcvc21va2UvMi1ibGFjay5wbmcnKWA7XG4gICAgICAgIHRoaXMuc21va2UzLnN0eWxlLmJhY2tncm91bmRJbWFnZSA9IGB1cmwoJ2ltZy9zbW9rZS8zLWJsYWNrLnBuZycpYDtcblxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5mb2cuc3R5bGUuYmFja2dyb3VuZENvbG9yID0gJyNmZGY1ZTYnO1xuICAgICAgICB0aGlzLnNtb2tlMS5zdHlsZS5iYWNrZ3JvdW5kSW1hZ2UgPSBgdXJsKCdpbWcvc21va2UvMS5wbmcnKWA7XG4gICAgICAgIHRoaXMuc21va2UyLnN0eWxlLmJhY2tncm91bmRJbWFnZSA9IGB1cmwoJ2ltZy9zbW9rZS8yLnBuZycpYDtcbiAgICAgICAgdGhpcy5zbW9rZTMuc3R5bGUuYmFja2dyb3VuZEltYWdlID0gYHVybCgnaW1nL3Ntb2tlLzMucG5nJylgO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGV2ZW50SGVuZGxlcigpIHtcbiAgXG4gICAgbGV0IG9mZnNldCA9IHBhZ2VZT2Zmc2V0O1xuICAgIFxuICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ3Njcm9sbCcsICgpID0+IHtcbiAgICAgIHRoaXMuY2hhbmdlRWxlbWVudFZpc2libGUoKTtcbiAgICAgIHRoaXMuc2V0QWJvdmVCZ09wYWNpdHkoKTtcbiAgICAgIFxuICAgICAgaWYgKHBhZ2VZT2Zmc2V0IC0gb2Zmc2V0IDwgMCkge1xuICAgICAgICB0aGlzLmRpcmVjdGlvbiA9ICd0by10b3AnO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5kaXJlY3Rpb24gPSAndG8tYm90dG9tJztcbiAgICAgIH1cbiAgICAgIG9mZnNldCA9IHBhZ2VZT2Zmc2V0O1xuXG4gICAgfSk7XG4gIH1cblxuICB0b1N0YW5kYXJ0U2Nyb2xsKCkge1xuICAgIHRoaXMuc2VjdGlvbnMuZm9yRWFjaChpdGVtID0+IHtcbiAgICAgIGl0ZW0uY2xhc3NMaXN0LmFkZCgnZnVsbC1zY3JvbGxfX2VsZW1lbnQtc3RhbmRhcmQtaGVpZ2h0Jyk7XG4gICAgfSk7XG4gIH1cbn0iLCJjb25zdCBzZWN0aW9uU2xpZGVyID0gbmV3IFNjcmVlblNsaWRlcignZnVsbC1zY3JvbGwnKTtcbi8vIGNvbnN0IHNlY3Rpb25TbGlkZXIyID0gbmV3IFNjcmVlblNsaWRlcignZnVsbC1zY3JvbGwyJyk7Il19
