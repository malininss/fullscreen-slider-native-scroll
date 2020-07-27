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
        return;
      } // console.log(this.calcScrollPercent());
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkFuY2hvckFkZGVyLmpzIiwiU2NyZWVuU2xpZGVyLmpzIiwic2NyaXB0LmpzIl0sIm5hbWVzIjpbIkFuY2hvckFkZGVyIiwiaGlzdG9yeSIsInB1c2hTdGF0ZSIsInNjcm9sbEhhbmRsZXIiLCJjb25zb2xlIiwibG9nIiwiYW5jaG9yc0xpbmsiLCJuYW1lIiwiYmFzZVVybCIsIndpbmRvdyIsImxvY2F0aW9uIiwicHJvdG9jb2wiLCJob3N0IiwicGF0aG5hbWUiLCJuZXdVcmwiLCJkb2N1bWVudCIsImFkZEV2ZW50TGlzdGVuZXIiLCJlbGVtIiwiYm94IiwiZ2V0Qm91bmRpbmdDbGllbnRSZWN0IiwidG9wIiwicGFnZVlPZmZzZXQiLCJib3R0b20iLCJxdWVyeVNlbGVjdG9yQWxsIiwiU2NyZWVuU2xpZGVyIiwiaWQiLCJtYWluQ29udGFpbmVyIiwicXVlcnlTZWxlY3RvciIsIkVycm9yIiwic2VjdGlvbnMiLCJBcnJheSIsImZyb20iLCJmb2ciLCJzbW9rZTEiLCJzbW9rZTIiLCJzbW9rZTMiLCJjdXJyZW50U2VjdGlvbiIsInNjcm9sbERpcmVjdGlvbiIsImNsYXNzTGlzdCIsImNvbnRhaW5zIiwidG9TdGFuZGFydFNjcm9sbCIsImV2ZW50SGVuZGxlciIsImNoYW5nZUVsZW1lbnRWaXNpYmxlIiwiTWF0aCIsImZsb29yIiwiZ2V0Q29vcmRzIiwiY2xpZW50SGVpZ2h0IiwiZm9yRWFjaCIsIml0ZW0iLCJmaXhlZEJsb2NrIiwiZWxlbUNvb3JkcyIsImFkZCIsInJlbW92ZSIsImxlbmd0aCIsImlubmVySGVpZ2h0IiwiY2FsY1Njcm9sbFBlcmNlbnQiLCJ1bmRlZmluZWQiLCJzdHlsZSIsIm9wYWNpdHkiLCJpbmRleE9mIiwiZGlyZWN0aW9uIiwidHJhbnNpdGlvbiIsImJhY2tncm91bmRDb2xvciIsImJhY2tncm91bmRJbWFnZSIsIm9mZnNldCIsInNldEFib3ZlQmdPcGFjaXR5Iiwic2VjdGlvblNsaWRlciJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7SUFB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QUEzQyxXQUFBO0FBRUEsT0FYQTtBQVlBOzs7dUNBRUE7QUFDQSxXQUFBUSxRQUFBLENBQUFrQixPQUFBLENBQUEsVUFBQUMsSUFBQSxFQUFBO0FBQ0FBLFFBQUFBLElBQUEsQ0FBQVYsU0FBQSxDQUFBYSxHQUFBLENBQUEsc0NBQUE7QUFDQSxPQUZBO0FBR0E7Ozs7OztBQ3hOQSxJQUFBZSxhQUFBLEdBQUEsSUFBQTFDLFlBQUEsQ0FBQSxhQUFBLENBQUEsQyxDQUNBIiwiZmlsZSI6InNjcmlwdC5qcyIsInNvdXJjZXNDb250ZW50IjpbImNsYXNzIEFuY2hvckFkZGVyIHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgaWYgKCFoaXN0b3J5LnB1c2hTdGF0ZSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHRoaXMuc2Nyb2xsSGFuZGxlcigpO1xuXG4gICAgY29uc29sZS5sb2codGhpcy5hbmNob3JzTGluayk7XG4gIH1cblxuICBhZGRBbmNob3IobmFtZSkge1xuICAgIHZhciBiYXNlVXJsID0gd2luZG93LmxvY2F0aW9uLnByb3RvY29sICsgXCIvL1wiICsgd2luZG93LmxvY2F0aW9uLmhvc3QgKyB3aW5kb3cubG9jYXRpb24ucGF0aG5hbWU7XG4gICAgdmFyIG5ld1VybCA9IGJhc2VVcmwgKyAnI3Rlc3QnO1xuICAgIGhpc3RvcnkucHVzaFN0YXRlKG51bGwsIG51bGwsIG5ld1VybCk7XG4gIH1cblxuICBzY3JvbGxIYW5kbGVyKCkge1xuICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ3Njcm9sbCcsICgpID0+IHtcbiAgICAgIFxuICAgIH0pO1xuICB9XG5cblxuICAvLyDQlNGD0LHQu9GMLCDQstGL0L3QtdGB0YLQuCDQsiDQvtCx0YnQuNC1INGE0YPQvdC60YbQuNC4XG4gIGdldENvb3JkcyhlbGVtKSB7XG4gICAgdmFyIGJveCA9IGVsZW0uZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgcmV0dXJuIHtcbiAgICAgIHRvcDogYm94LnRvcCArIHBhZ2VZT2Zmc2V0LFxuICAgICAgYm90dG9tOiBib3guYm90dG9tICsgcGFnZVlPZmZzZXRcbiAgICB9O1xuICB9XG5cbiAgZ2V0IGFuY2hvcnNMaW5rICgpIHtcbiAgICByZXR1cm4gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChgW2RhdGEtYW5jaG9yXWApO1xuICB9XG5cblxuXG59IiwiY2xhc3MgU2NyZWVuU2xpZGVyIHtcbiAgY29uc3RydWN0b3IoaWQpIHtcbiAgICB0aGlzLm1haW5Db250YWluZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGAjJHtpZH1gKTtcblxuICAgIGlmICghdGhpcy5tYWluQ29udGFpbmVyKSB7XG4gICAgICB0aHJvdyhuZXcgRXJyb3IoJ0lkINC90LUg0L/QtdGA0LXQtNCw0L0g0LIg0LrQvtC90YHRgtGA0YPQutGC0L7RgCDRjdC70LXQvNC10L3RgtCwIFNjcmVlblNsaWRlciwg0LvQuNCx0L4g0Y3Qu9C10LzQtdC90YIg0L3QtSDQvdCw0LnQtNC10L0g0L3QsCDRgdGC0YDQsNC90LjRhtC1JykpO1xuICAgIH1cblxuICAgIHRoaXMuc2VjdGlvbnMgPSBBcnJheS5mcm9tKHRoaXMubWFpbkNvbnRhaW5lci5xdWVyeVNlbGVjdG9yQWxsKCcuZnVsbC1zY3JvbGxfX2VsZW1lbnQnKSk7XG4gICAgdGhpcy5mb2cgPSB0aGlzLm1haW5Db250YWluZXIucXVlcnlTZWxlY3RvcignLmZ1bGwtc2Nyb2xsX19mb2cnKTtcblxuICAgIHRoaXMuc21va2UxID0gdGhpcy5tYWluQ29udGFpbmVyLnF1ZXJ5U2VsZWN0b3IoJy5mdWxsLXNjcm9sbF9fc21va2VfYmcxJyk7XG4gICAgdGhpcy5zbW9rZTIgPSB0aGlzLm1haW5Db250YWluZXIucXVlcnlTZWxlY3RvcignLmZ1bGwtc2Nyb2xsX19zbW9rZV9iZzInKTtcbiAgICB0aGlzLnNtb2tlMyA9IHRoaXMubWFpbkNvbnRhaW5lci5xdWVyeVNlbGVjdG9yKCcuZnVsbC1zY3JvbGxfX3Ntb2tlX2JnMycpO1xuXG5cbiAgICB0aGlzLmN1cnJlbnRTZWN0aW9uID0gJyc7XG4gICAgdGhpcy5zY3JvbGxEaXJlY3Rpb247XG5cbiAgICBpZiAodGhpcy5tYWluQ29udGFpbmVyLmNsYXNzTGlzdC5jb250YWlucygnZnVsbC1zY3JvbGxfX3RvLXN0YW5kYXJ0LXNjcm9sbCcpKSB7XG4gICAgICB0aGlzLnRvU3RhbmRhcnRTY3JvbGwoKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB0aGlzLmV2ZW50SGVuZGxlcigpO1xuICAgIHRoaXMuY2hhbmdlRWxlbWVudFZpc2libGUoKTtcbiAgICBcbiAgfVxuXG5cbiAgZ2V0Q29vcmRzKGVsZW0pIHtcbiAgICB2YXIgYm94ID0gZWxlbS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICByZXR1cm4ge1xuICAgICAgdG9wOiBib3gudG9wICsgcGFnZVlPZmZzZXQsXG4gICAgICBib3R0b206IGJveC5ib3R0b20gKyBwYWdlWU9mZnNldFxuICAgIH07XG4gIH1cbiAgXG4gIGNhbGNTY3JvbGxQZXJjZW50KCkge1xuICAgIGlmICh0aGlzLmN1cnJlbnRTZWN0aW9uKSB7XG4gICAgICByZXR1cm4gTWF0aC5mbG9vcigocGFnZVlPZmZzZXQgLSB0aGlzLmdldENvb3Jkcyh0aGlzLmN1cnJlbnRTZWN0aW9uKS50b3ApIC8gdGhpcy5jdXJyZW50U2VjdGlvbi5jbGllbnRIZWlnaHQgKiAxMDApO1xuICAgIH1cbiAgfVxuICBjaGFuZ2VFbGVtZW50VmlzaWJsZSgpIHtcbiAgICB0aGlzLnNlY3Rpb25zLmZvckVhY2goaXRlbSA9PiB7XG4gICAgICBjb25zdCBmaXhlZEJsb2NrID0gaXRlbS5xdWVyeVNlbGVjdG9yKCcuZnVsbC1zY3JvbGxfX2ZpeGVkLXdyYXBwZXInKTtcbiAgICAgIGNvbnN0IGVsZW1Db29yZHMgPSB0aGlzLmdldENvb3JkcyhpdGVtKTtcbiAgICAgIGlmIChwYWdlWU9mZnNldCA+PSBlbGVtQ29vcmRzLnRvcCAmJiBlbGVtQ29vcmRzLmJvdHRvbSA+PSBwYWdlWU9mZnNldCkge1xuICAgICAgICB0aGlzLmN1cnJlbnRTZWN0aW9uID0gaXRlbTtcbiAgICAgICAgZml4ZWRCbG9jay5jbGFzc0xpc3QuYWRkKCdmdWxsLXNjcm9sbF9fZml4LXN0YXRlJyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBmaXhlZEJsb2NrLmNsYXNzTGlzdC5yZW1vdmUoJ2Z1bGwtc2Nyb2xsX19maXgtc3RhdGUnKTtcbiAgICAgIH1cblxuICAgICAgaWYgKHRoaXMuY3VycmVudFNlY3Rpb24gPT09IHRoaXMuc2VjdGlvbnNbdGhpcy5zZWN0aW9ucy5sZW5ndGggLSAxXSkge1xuICAgICAgICBpZiAocGFnZVlPZmZzZXQgPj0gdGhpcy5nZXRDb29yZHModGhpcy5jdXJyZW50U2VjdGlvbikuYm90dG9tIC0gd2luZG93LmlubmVySGVpZ2h0KSB7XG4gICAgICAgICAgZml4ZWRCbG9jay5jbGFzc0xpc3QucmVtb3ZlKCdmdWxsLXNjcm9sbF9fZml4LXN0YXRlJyk7XG4gICAgICAgICAgZml4ZWRCbG9jay5jbGFzc0xpc3QuYWRkKCdmdWxsLXNjcm9sbF9fbGFzdC1lbGVtJyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgZml4ZWRCbG9jay5jbGFzc0xpc3QucmVtb3ZlKCdmdWxsLXNjcm9sbF9fbGFzdC1lbGVtJyk7XG4gICAgICAgIH1cbiAgICAgIH0gXG4gICAgfSk7XG4gIH1cbiAgXG4gIFxuICBzZXRBYm92ZUJnT3BhY2l0eSgpIHtcblxuICAgIGlmICh0aGlzLmNhbGNTY3JvbGxQZXJjZW50KCkgPT09IHVuZGVmaW5lZCB8fCB0aGlzLmNhbGNTY3JvbGxQZXJjZW50KCkgPCAwIHx8IHRoaXMuY2FsY1Njcm9sbFBlcmNlbnQoKSA+IDEwMCkge1xuICAgICAgdGhpcy5mb2cuc3R5bGUub3BhY2l0eSA9IDA7XG4gICAgICB0aGlzLnNtb2tlMS5zdHlsZS5vcGFjaXR5ID0gMDtcbiAgICAgIHRoaXMuc21va2UyLnN0eWxlLm9wYWNpdHkgPSAwO1xuICAgICAgdGhpcy5zbW9rZTMuc3R5bGUub3BhY2l0eSA9IDA7XG5cbiAgICAgIHJldHVybjtcbiAgICB9XG5cblxuICAgIC8vIGNvbnNvbGUubG9nKHRoaXMuY2FsY1Njcm9sbFBlcmNlbnQoKSk7XG4gICAgXG4gICAgLy8g0JTQu9GPINC/0LXRgNCy0L7Qs9C+INGN0LvQtdC80LXQvdGC0LAg0L3QtSDQtNC10LvQsNC10Lwg0LDQvdC40LzQsNGG0LjQuSBcItCy0YXQvtC00LBcIlxuICAgIGlmICh0aGlzLnNlY3Rpb25zLmluZGV4T2YodGhpcy5jdXJyZW50U2VjdGlvbikgIT09IDApIHtcbiAgICAgIFxuICAgICAgLy8g0JXRgdC70Lgg0YHQutGA0L7Qu9C7INC80LXQvdGM0YjQtSAyNSUsINGC0L4g0YPQsdC40YDQsNC10Lwg0L/RgNC+0LfRgNCw0YfQvdC+0YHRgtGMINGDIFwi0YLRg9C80LDQvdCwXCIuXG4gICAgICAvLyDQuCDRg9GB0YLQsNC90LDQstC70LjQstCw0LXQvCDRgdC60L7RgNC+0YHRgtGMINGC0YDQsNC90LfQuNGI0LXQvdCwLCDRh9GC0L7QsdGLINCx0YvQu9C+INC/0LvQsNCy0L3Qvi4g0J3Rg9C20L3QviDQtNC70Y8gXCLQktGL0YXQvtC00LBcIiDQuNC3INGC0YPQvNCw0L3QsFxuICAgICAgaWYgKHRoaXMuY2FsY1Njcm9sbFBlcmNlbnQoKSA8PSAyNSAmJiB0aGlzLmRpcmVjdGlvbiA9PT0gJ3RvLWJvdHRvbScpIHtcbiAgICAgICAgdGhpcy5mb2cuc3R5bGUudHJhbnNpdGlvbiA9ICdvcGFjaXR5IDFzJztcbiAgICAgICAgdGhpcy5mb2cuc3R5bGUub3BhY2l0eSA9IDA7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAvLyDQldGB0LvQuCDQvdC10YIsINGC0L4g0LLQvtC30LLRgNCw0YnQsNC10Lwg0YLRgNCw0L3Qt9C40YjQvSDQsiDRgdGC0LDQvdC00LDRgNGC0L3QvtC1INC/0L7Qu9C+0LbQtdC90LjQtVxuICAgICAgICB0aGlzLmZvZy5zdHlsZS50cmFuc2l0aW9uID0gJ29wYWNpdHkgMC4ycyc7XG4gICAgICB9XG5cbiAgICAgIC8vINCU0LXQu9Cw0LXQvCBcItC30LDRgtC10L3QtdC90LjQtVwiLCDQtdGB0LvQuCDQuNC00ZHQvCDQstCy0LXRgNGFXG4gICAgICBpZiAodGhpcy5jYWxjU2Nyb2xsUGVyY2VudCgpIDw9IDI1ICYmIHRoaXMuZGlyZWN0aW9uID09PSAndG8tdG9wJykge1xuICAgICAgICAvLyBjb25zb2xlLmxvZygxMjUgLSB0aGlzLmNhbGNTY3JvbGxQZXJjZW50KCkgKiA0ICsgJyUnKTtcbiAgICAgICAgdGhpcy5mb2cuc3R5bGUub3BhY2l0eSA9IDEyNSAtIHRoaXMuY2FsY1Njcm9sbFBlcmNlbnQoKSAqIDQgKyAnJSc7XG4gICAgICB9IFxuXG5cbiAgICAgIC8vINCU0YvQvCDQv9GA0Lgg0L/RgNC+0LrRgNGD0YLQutC1INCy0LLQtdGA0YVcbiAgICAgIGlmICh0aGlzLmNhbGNTY3JvbGxQZXJjZW50KCkgPD0gMTUgJiYgdGhpcy5kaXJlY3Rpb24gPT09ICd0by10b3AnKSB7XG4gICAgICAgIC8vIGNvbnNvbGUubG9nKDEpO1xuICAgICAgICB0aGlzLnNtb2tlMS5zdHlsZS5vcGFjaXR5ID0gMTtcbiAgICAgIH0gXG5cbiAgICAgIGlmICh0aGlzLmNhbGNTY3JvbGxQZXJjZW50KCkgPD0gMjMgJiYgdGhpcy5kaXJlY3Rpb24gPT09ICd0by10b3AnKSB7XG4gICAgICAgIC8vIGNvbnNvbGUubG9nKDIpO1xuICAgICAgICB0aGlzLnNtb2tlMi5zdHlsZS5vcGFjaXR5ID0gMTtcbiAgICAgIH0gXG5cbiAgICAgIGlmICh0aGlzLmNhbGNTY3JvbGxQZXJjZW50KCkgPD0gMzUgJiYgdGhpcy5kaXJlY3Rpb24gPT09ICd0by10b3AnKSB7XG4gICAgICAgIC8vIGNvbnNvbGUubG9nKDMpO1xuICAgICAgICB0aGlzLnNtb2tlMy5zdHlsZS5vcGFjaXR5ID0gMTtcbiAgICAgIH0gXG4gICAgfSBcblxuXG4gICAgaWYgKHRoaXMuY2FsY1Njcm9sbFBlcmNlbnQoKSA+PSA4NSAmJiB0aGlzLmRpcmVjdGlvbiA9PT0gJ3RvLXRvcCcpIHtcbiAgICAgIHRoaXMuZm9nLnN0eWxlLnRyYW5zaXRpb24gPSAnb3BhY2l0eSAxcyc7XG4gICAgICB0aGlzLmZvZy5zdHlsZS5vcGFjaXR5ID0gMDtcbiAgICB9IGVsc2Uge1xuICAgICAgLy8g0JXRgdC70Lgg0L3QtdGCLCDRgtC+INCy0L7Qt9Cy0YDQsNGJ0LDQtdC8INGC0YDQsNC90LfQuNGI0L0g0LIg0YHRgtCw0L3QtNCw0YDRgtC90L7QtSDQv9C+0LvQvtC20LXQvdC40LVcbiAgICAgIHRoaXMuZm9nLnN0eWxlLnRyYW5zaXRpb24gPSAnb3BhY2l0eSAwLjJzJztcbiAgICB9XG5cbiAgICBcbiAgICAvLyDQlNC70Y8g0L/QvtGB0LvQtdC00L3QtdCz0L4g0Y3Qu9C10LzQtdC90YLQsCDQvdC1INC00LXQu9Cw0LXQvCDQsNC90LjQvNCw0YbQuNC5IFwi0JLRi9GF0L7QtNCwXCIuIFxuICAgIGlmICh0aGlzLmN1cnJlbnRTZWN0aW9uICE9PSB0aGlzLnNlY3Rpb25zW3RoaXMuc2VjdGlvbnMubGVuZ3RoIC0gMV0pIHtcbiAgICAgIC8vICDQlNGL0Lwg0LLRi9GF0L7QtFxuICAgICAgaWYgKHRoaXMuY2FsY1Njcm9sbFBlcmNlbnQoKSA+PSA1NSAmJiB0aGlzLmRpcmVjdGlvbiA9PT0gJ3RvLWJvdHRvbScpIHtcbiAgICAgICAgdGhpcy5zbW9rZTEuc3R5bGUub3BhY2l0eSA9IDE7XG4gICAgICB9IFxuXG4gICAgICBpZiAodGhpcy5jYWxjU2Nyb2xsUGVyY2VudCgpID49IDY1ICYmIHRoaXMuZGlyZWN0aW9uID09PSAndG8tYm90dG9tJykge1xuICAgICAgICB0aGlzLnNtb2tlMi5zdHlsZS5vcGFjaXR5ID0gMTtcbiAgICAgIH0gXG5cbiAgICAgIGlmICh0aGlzLmNhbGNTY3JvbGxQZXJjZW50KCkgPj0gNzAgJiYgdGhpcy5kaXJlY3Rpb24gPT09ICd0by1ib3R0b20nKSB7XG4gICAgICAgIHRoaXMuc21va2UzLnN0eWxlLm9wYWNpdHkgPSAxO1xuICAgICAgfSBcblxuICAgICAgaWYgKHRoaXMuY2FsY1Njcm9sbFBlcmNlbnQoKSA+PSA3NSAmJiB0aGlzLmRpcmVjdGlvbiA9PT0gJ3RvLWJvdHRvbScpIHtcbiAgICAgICAgdGhpcy5mb2cuc3R5bGUub3BhY2l0eSA9ICh0aGlzLmNhbGNTY3JvbGxQZXJjZW50KCkgLSA3NSkgKiA1ICsgJyUnO1xuICAgICAgfSBcbiAgICB9XG5cblxuICAgIC8vINCU0YvQvCDQstGF0L7QtFxuICAgIGlmICh0aGlzLmNhbGNTY3JvbGxQZXJjZW50KCkgPj0gNSAmJiB0aGlzLmNhbGNTY3JvbGxQZXJjZW50KCkgPCA0MCAmJiB0aGlzLmRpcmVjdGlvbiA9PT0gJ3RvLWJvdHRvbScpIHtcbiAgICAgIHRoaXMuc21va2UxLnN0eWxlLm9wYWNpdHkgPSAwO1xuICAgIH0gXG5cbiAgICBpZiAodGhpcy5jYWxjU2Nyb2xsUGVyY2VudCgpID49IDEzICYmIHRoaXMuY2FsY1Njcm9sbFBlcmNlbnQoKSA8IDQwICYmIHRoaXMuZGlyZWN0aW9uID09PSAndG8tYm90dG9tJykge1xuICAgICAgdGhpcy5zbW9rZTIuc3R5bGUub3BhY2l0eSA9IDA7XG4gICAgfSBcblxuICAgIGlmICh0aGlzLmNhbGNTY3JvbGxQZXJjZW50KCkgPj0gMTAgJiYgdGhpcy5jYWxjU2Nyb2xsUGVyY2VudCgpIDwgNDAgJiYgdGhpcy5kaXJlY3Rpb24gPT09ICd0by1ib3R0b20nKSB7XG4gICAgICB0aGlzLnNtb2tlMy5zdHlsZS5vcGFjaXR5ID0gMDtcblxuICAgIH0gXG5cbiAgICBcbiAgICAvLyDQlNGL0Lwg0LLQstC10YDRhSDQt9Cw0YLQvNC10L3QtdC90LjQtSDQv9GA0Lgg0L/QtdGA0LXRhdC+0LTQtSDRgSDQv9GA0LXQtNGL0LTRg9GJ0LXQs9C+XG4gICAgaWYgKHRoaXMuY2FsY1Njcm9sbFBlcmNlbnQoKSA8PSA5MCAmJiB0aGlzLmNhbGNTY3JvbGxQZXJjZW50KCkgPj0gNTAgJiYgdGhpcy5kaXJlY3Rpb24gPT09ICd0by10b3AnKSB7XG4gICAgICB0aGlzLnNtb2tlMS5zdHlsZS5vcGFjaXR5ID0gMDtcbiAgICB9IFxuXG4gICAgaWYgKHRoaXMuY2FsY1Njcm9sbFBlcmNlbnQoKSA+PSA4MCAmJiB0aGlzLmNhbGNTY3JvbGxQZXJjZW50KCkgPj0gNTAgJiYgdGhpcy5kaXJlY3Rpb24gPT09ICd0by10b3AnKSB7XG4gICAgICB0aGlzLnNtb2tlMi5zdHlsZS5vcGFjaXR5ID0gMDtcbiAgICB9IFxuXG4gICAgaWYgKHRoaXMuY2FsY1Njcm9sbFBlcmNlbnQoKSA+PSA3MCAmJiB0aGlzLmNhbGNTY3JvbGxQZXJjZW50KCkgPj0gNTAgJiYgdGhpcy5kaXJlY3Rpb24gPT09ICd0by10b3AnKSB7XG4gICAgICB0aGlzLnNtb2tlMy5zdHlsZS5vcGFjaXR5ID0gMDtcbiAgICB9IFxuXG5cbiAgICAvLyDQnNC10L3Rj9C10Lwg0L7RgdC90L7QstC90L7QuSDRhtCy0LXRglxuICAgIGlmICh0aGlzLmNhbGNTY3JvbGxQZXJjZW50KCkgPj0gNDAgJiYgdGhpcy5jYWxjU2Nyb2xsUGVyY2VudCgpIDw9IDYwKSB7XG5cbiAgICAgIGlmICh0aGlzLmN1cnJlbnRTZWN0aW9uLmNsYXNzTGlzdC5jb250YWlucygnZnVsbC1zY3JvbGxfX3NldC1ibGFjay1mb2cnKSkge1xuICAgICAgICB0aGlzLmZvZy5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSAnIzAzMGMxYSc7XG4gICAgICAgIHRoaXMuc21va2UxLnN0eWxlLmJhY2tncm91bmRJbWFnZSA9IGB1cmwoJ2ltZy9zbW9rZS8xLWJsYWNrLnBuZycpYDtcbiAgICAgICAgdGhpcy5zbW9rZTIuc3R5bGUuYmFja2dyb3VuZEltYWdlID0gYHVybCgnaW1nL3Ntb2tlLzItYmxhY2sucG5nJylgO1xuICAgICAgICB0aGlzLnNtb2tlMy5zdHlsZS5iYWNrZ3JvdW5kSW1hZ2UgPSBgdXJsKCdpbWcvc21va2UvMy1ibGFjay5wbmcnKWA7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLmZvZy5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSAnI2ZkZjVlNic7XG4gICAgICAgIHRoaXMuc21va2UxLnN0eWxlLmJhY2tncm91bmRJbWFnZSA9IGB1cmwoJ2ltZy9zbW9rZS8xLnBuZycpYDtcbiAgICAgICAgdGhpcy5zbW9rZTIuc3R5bGUuYmFja2dyb3VuZEltYWdlID0gYHVybCgnaW1nL3Ntb2tlLzIucG5nJylgO1xuICAgICAgICB0aGlzLnNtb2tlMy5zdHlsZS5iYWNrZ3JvdW5kSW1hZ2UgPSBgdXJsKCdpbWcvc21va2UvMy5wbmcnKWA7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgZXZlbnRIZW5kbGVyKCkge1xuICBcbiAgICBsZXQgb2Zmc2V0ID0gcGFnZVlPZmZzZXQ7XG4gICAgXG4gICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignc2Nyb2xsJywgKCkgPT4ge1xuICAgICAgdGhpcy5jaGFuZ2VFbGVtZW50VmlzaWJsZSgpO1xuICAgICAgdGhpcy5zZXRBYm92ZUJnT3BhY2l0eSgpO1xuICAgICAgXG4gICAgICBpZiAocGFnZVlPZmZzZXQgLSBvZmZzZXQgPCAwKSB7XG4gICAgICAgIHRoaXMuZGlyZWN0aW9uID0gJ3RvLXRvcCc7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLmRpcmVjdGlvbiA9ICd0by1ib3R0b20nO1xuICAgICAgfVxuICAgICAgb2Zmc2V0ID0gcGFnZVlPZmZzZXQ7XG5cbiAgICB9KTtcbiAgfVxuXG4gIHRvU3RhbmRhcnRTY3JvbGwoKSB7XG4gICAgdGhpcy5zZWN0aW9ucy5mb3JFYWNoKGl0ZW0gPT4ge1xuICAgICAgaXRlbS5jbGFzc0xpc3QuYWRkKCdmdWxsLXNjcm9sbF9fZWxlbWVudC1zdGFuZGFyZC1oZWlnaHQnKTtcbiAgICB9KTtcbiAgfVxufSIsImNvbnN0IHNlY3Rpb25TbGlkZXIgPSBuZXcgU2NyZWVuU2xpZGVyKCdmdWxsLXNjcm9sbCcpO1xuLy8gY29uc3Qgc2VjdGlvblNsaWRlcjIgPSBuZXcgU2NyZWVuU2xpZGVyKCdmdWxsLXNjcm9sbDInKTsiXX0=
