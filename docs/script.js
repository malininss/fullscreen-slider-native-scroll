"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

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
    key: "setFogOpacity",
    value: function setFogOpacity() {
      if (this.sections.indexOf(this.currentSection) !== 0) {
        if (this.calcScrollPercent() <= 25) {
          this.fog.style.opacity = 100 - this.calcScrollPercent() * 4 + '%';
        }
      }

      if (this.currentSection !== this.sections[this.sections.length - 1]) {
        console.log(this.calcScrollPercent()); //  дым выход

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
      } // дым вход


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

        this.fog.style.opacity = 0; // this.smoke1.style.opacity = 0;
      }
    }
  }, {
    key: "eventHendler",
    value: function eventHendler() {
      var _this2 = this;

      document.addEventListener('scroll', function () {
        _this2.changeElementVisible();

        _this2.setFogOpacity();
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIlNjcmVlblNsaWRlci5qcyIsInNjcmlwdC5qcyJdLCJuYW1lcyI6WyJTY3JlZW5TbGlkZXIiLCJpZCIsIm1haW5Db250YWluZXIiLCJkb2N1bWVudCIsInF1ZXJ5U2VsZWN0b3IiLCJFcnJvciIsInNlY3Rpb25zIiwiQXJyYXkiLCJmcm9tIiwicXVlcnlTZWxlY3RvckFsbCIsImZvZyIsInNtb2tlMSIsInNtb2tlMiIsInNtb2tlMyIsImN1cnJlbnRTZWN0aW9uIiwiY2xhc3NMaXN0IiwiY29udGFpbnMiLCJ0b1N0YW5kYXJ0U2Nyb2xsIiwiZXZlbnRIZW5kbGVyIiwiY2hhbmdlRWxlbWVudFZpc2libGUiLCJlbGVtIiwiYm94IiwiZ2V0Qm91bmRpbmdDbGllbnRSZWN0IiwidG9wIiwicGFnZVlPZmZzZXQiLCJib3R0b20iLCJNYXRoIiwiZmxvb3IiLCJnZXRDb29yZHMiLCJjbGllbnRIZWlnaHQiLCJmb3JFYWNoIiwiaXRlbSIsImZpeGVkQmxvY2siLCJlbGVtQ29vcmRzIiwiYWRkIiwicmVtb3ZlIiwibGVuZ3RoIiwid2luZG93IiwiaW5uZXJIZWlnaHQiLCJpbmRleE9mIiwiY2FsY1Njcm9sbFBlcmNlbnQiLCJzdHlsZSIsIm9wYWNpdHkiLCJjb25zb2xlIiwibG9nIiwiYmFja2dyb3VuZENvbG9yIiwiYWRkRXZlbnRMaXN0ZW5lciIsInNldEZvZ09wYWNpdHkiLCJzZWN0aW9uU2xpZGVyIl0sIm1hcHBpbmdzIjoiOzs7Ozs7OztJQUFBQSxZO0FBQ0Esd0JBQUFDLEVBQUEsRUFBQTtBQUFBOztBQUNBLFNBQUFDLGFBQUEsR0FBQUMsUUFBQSxDQUFBQyxhQUFBLFlBQUFILEVBQUEsRUFBQTs7QUFFQSxRQUFBLENBQUEsS0FBQUMsYUFBQSxFQUFBO0FBQ0EsWUFBQSxJQUFBRyxLQUFBLENBQUEsdUZBQUEsQ0FBQTtBQUNBOztBQUVBLFNBQUFDLFFBQUEsR0FBQUMsS0FBQSxDQUFBQyxJQUFBLENBQUEsS0FBQU4sYUFBQSxDQUFBTyxnQkFBQSxDQUFBLHVC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QSxDQUFBO0FBQ0E7O0FBS0EsVUFBQSxLQUFBRixpQkFBQSxNQUFBLEVBQUEsSUFBQSxLQUFBQSxpQkFBQSxNQUFBLEVBQUEsRUFBQTtBQUNBLFlBQUEsS0FBQTFCLGNBQUEsQ0FBQUMsU0FBQSxDQUFBQyxRQUFBLENBQUEsNEJBQUEsQ0FBQSxFQUFBO0FBQ0EsZUFBQU4sR0FBQSxDQUFBK0IsS0FBQSxDQUFBSSxlQUFBLEdBQUEsTUFBQTtBQUNBLFNBRkEsTUFFQTtBQUNBLGVBQUFuQyxHQUFBLENBQUErQixLQUFBLENBQUFJLGVBQUEsR0FBQSxTQUFBO0FBQ0E7O0FBRUEsYUFBQW5DLEdBQUEsQ0FBQStCLEtBQUEsQ0FBQUMsT0FBQSxHQUFBLENBQUEsQ0FQQSxDQVFBO0FBQ0E7QUFDQTs7O21DQUVBO0FBQUE7O0FBQ0F2QyxNQUFBQSxRQUFBLENBQUEyQyxnQkFBQSxDQUFBLFFBQUEsRUFBQSxZQUFBO0FBQ0EsUUFBQSxNQUFBLENBQUEzQixvQkFBQTs7QUFDQSxRQUFBLE1BQUEsQ0FBQTRCLGFBQUE7QUFDQSxPQUhBO0FBSUE7Ozt1Q0FFQTtBQUNBLFdBQUF6QyxRQUFBLENBQUF3QixPQUFBLENBQUEsVUFBQUMsSUFBQSxFQUFBO0FBQ0FBLFFBQUFBLElBQUEsQ0FBQWhCLFNBQUEsQ0FBQW1CLEdBQUEsQ0FBQSxzQ0FBQTtBQUNBLE9BRkE7QUFHQTs7Ozs7O0FDeElBLElBQUFjLGFBQUEsR0FBQSxJQUFBaEQsWUFBQSxDQUFBLGFBQUEsQ0FBQSxDLENBQ0EiLCJmaWxlIjoic2NyaXB0LmpzIiwic291cmNlc0NvbnRlbnQiOlsiY2xhc3MgU2NyZWVuU2xpZGVyIHtcbiAgY29uc3RydWN0b3IoaWQpIHtcbiAgICB0aGlzLm1haW5Db250YWluZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGAjJHtpZH1gKTtcblxuICAgIGlmICghdGhpcy5tYWluQ29udGFpbmVyKSB7XG4gICAgICB0aHJvdyhuZXcgRXJyb3IoJ0lkINC90LUg0L/QtdGA0LXQtNCw0L0g0LIg0LrQvtC90YHRgtGA0YPQutGC0L7RgCDRjdC70LXQvNC10L3RgtCwIFNjcmVlblNsaWRlciwg0LvQuNCx0L4g0Y3Qu9C10LzQtdC90YIg0L3QtSDQvdCw0LnQtNC10L0g0L3QsCDRgdGC0YDQsNC90LjRhtC1JykpO1xuICAgIH1cblxuICAgIHRoaXMuc2VjdGlvbnMgPSBBcnJheS5mcm9tKHRoaXMubWFpbkNvbnRhaW5lci5xdWVyeVNlbGVjdG9yQWxsKCcuZnVsbC1zY3JvbGxfX2VsZW1lbnQnKSk7XG4gICAgdGhpcy5mb2cgPSB0aGlzLm1haW5Db250YWluZXIucXVlcnlTZWxlY3RvcignLmZ1bGwtc2Nyb2xsX19mb2cnKTtcblxuICAgIHRoaXMuc21va2UxID0gdGhpcy5tYWluQ29udGFpbmVyLnF1ZXJ5U2VsZWN0b3IoJy5mdWxsLXNjcm9sbF9fc21va2VfYmcxJyk7XG4gICAgdGhpcy5zbW9rZTIgPSB0aGlzLm1haW5Db250YWluZXIucXVlcnlTZWxlY3RvcignLmZ1bGwtc2Nyb2xsX19zbW9rZV9iZzInKTtcbiAgICB0aGlzLnNtb2tlMyA9IHRoaXMubWFpbkNvbnRhaW5lci5xdWVyeVNlbGVjdG9yKCcuZnVsbC1zY3JvbGxfX3Ntb2tlX2JnMycpO1xuXG5cbiAgICB0aGlzLmN1cnJlbnRTZWN0aW9uID0gJyc7XG5cbiAgICBpZiAodGhpcy5tYWluQ29udGFpbmVyLmNsYXNzTGlzdC5jb250YWlucygnZnVsbC1zY3JvbGxfX3RvLXN0YW5kYXJ0LXNjcm9sbCcpKSB7XG4gICAgICB0aGlzLnRvU3RhbmRhcnRTY3JvbGwoKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB0aGlzLmV2ZW50SGVuZGxlcigpO1xuICAgIHRoaXMuY2hhbmdlRWxlbWVudFZpc2libGUoKTtcbiAgfVxuXG5cbiAgZ2V0Q29vcmRzKGVsZW0pIHtcbiAgICB2YXIgYm94ID0gZWxlbS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICByZXR1cm4ge1xuICAgICAgdG9wOiBib3gudG9wICsgcGFnZVlPZmZzZXQsXG4gICAgICBib3R0b206IGJveC5ib3R0b20gKyBwYWdlWU9mZnNldFxuICAgIH07XG4gIH1cbiAgXG4gIGNhbGNTY3JvbGxQZXJjZW50KCkge1xuICAgIGlmICh0aGlzLmN1cnJlbnRTZWN0aW9uKSB7XG4gICAgICByZXR1cm4gTWF0aC5mbG9vcigocGFnZVlPZmZzZXQgLSB0aGlzLmdldENvb3Jkcyh0aGlzLmN1cnJlbnRTZWN0aW9uKS50b3ApIC8gdGhpcy5jdXJyZW50U2VjdGlvbi5jbGllbnRIZWlnaHQgKiAxMDApO1xuICAgIH1cbiAgfVxuICBjaGFuZ2VFbGVtZW50VmlzaWJsZSgpIHtcbiAgICB0aGlzLnNlY3Rpb25zLmZvckVhY2goaXRlbSA9PiB7XG4gICAgICBjb25zdCBmaXhlZEJsb2NrID0gaXRlbS5xdWVyeVNlbGVjdG9yKCcuZnVsbC1zY3JvbGxfX2ZpeGVkLXdyYXBwZXInKTtcbiAgICAgIGNvbnN0IGVsZW1Db29yZHMgPSB0aGlzLmdldENvb3JkcyhpdGVtKTtcbiAgICAgIGlmIChwYWdlWU9mZnNldCA+PSBlbGVtQ29vcmRzLnRvcCAmJiBlbGVtQ29vcmRzLmJvdHRvbSA+PSBwYWdlWU9mZnNldCkge1xuICAgICAgICB0aGlzLmN1cnJlbnRTZWN0aW9uID0gaXRlbTtcbiAgICAgICAgZml4ZWRCbG9jay5jbGFzc0xpc3QuYWRkKCdmdWxsLXNjcm9sbF9fZml4LXN0YXRlJyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBmaXhlZEJsb2NrLmNsYXNzTGlzdC5yZW1vdmUoJ2Z1bGwtc2Nyb2xsX19maXgtc3RhdGUnKTtcbiAgICAgIH1cblxuICAgICAgaWYgKHRoaXMuY3VycmVudFNlY3Rpb24gPT09IHRoaXMuc2VjdGlvbnNbdGhpcy5zZWN0aW9ucy5sZW5ndGggLSAxXSkge1xuICAgICAgICBpZiAocGFnZVlPZmZzZXQgPj0gdGhpcy5nZXRDb29yZHModGhpcy5jdXJyZW50U2VjdGlvbikuYm90dG9tIC0gd2luZG93LmlubmVySGVpZ2h0KSB7XG4gICAgICAgICAgZml4ZWRCbG9jay5jbGFzc0xpc3QucmVtb3ZlKCdmdWxsLXNjcm9sbF9fZml4LXN0YXRlJyk7XG4gICAgICAgICAgZml4ZWRCbG9jay5jbGFzc0xpc3QuYWRkKCdmdWxsLXNjcm9sbF9fbGFzdC1lbGVtJyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgZml4ZWRCbG9jay5jbGFzc0xpc3QucmVtb3ZlKCdmdWxsLXNjcm9sbF9fbGFzdC1lbGVtJyk7XG4gICAgICAgIH1cbiAgICAgIH0gXG4gICAgfSk7XG4gIH1cbiAgXG4gIHNldEZvZ09wYWNpdHkoKSB7XG4gICAgaWYgKHRoaXMuc2VjdGlvbnMuaW5kZXhPZih0aGlzLmN1cnJlbnRTZWN0aW9uKSAhPT0gMCkge1xuICAgICAgaWYgKHRoaXMuY2FsY1Njcm9sbFBlcmNlbnQoKSA8PSAyNSkge1xuICAgICAgICB0aGlzLmZvZy5zdHlsZS5vcGFjaXR5ID0gMTAwIC0gdGhpcy5jYWxjU2Nyb2xsUGVyY2VudCgpICogNCArICclJztcbiAgICAgIH1cbiAgICB9IFxuICAgIFxuXG4gICAgaWYgKHRoaXMuY3VycmVudFNlY3Rpb24gIT09IHRoaXMuc2VjdGlvbnNbdGhpcy5zZWN0aW9ucy5sZW5ndGggLSAxXSkge1xuXG4gICAgICBjb25zb2xlLmxvZyh0aGlzLmNhbGNTY3JvbGxQZXJjZW50KCkpO1xuXG5cbiAgICAgIC8vICDQtNGL0Lwg0LLRi9GF0L7QtFxuICAgICAgaWYgKHRoaXMuY2FsY1Njcm9sbFBlcmNlbnQoKSA+PSA0MCkge1xuICAgICAgICB0aGlzLnNtb2tlMS5zdHlsZS5vcGFjaXR5ID0gMTtcbiAgICAgIH0gXG5cbiAgICAgIGlmICh0aGlzLmNhbGNTY3JvbGxQZXJjZW50KCkgPj0gNjApIHtcbiAgICAgICAgdGhpcy5zbW9rZTIuc3R5bGUub3BhY2l0eSA9IDE7XG4gICAgICB9IFxuXG4gICAgICBpZiAodGhpcy5jYWxjU2Nyb2xsUGVyY2VudCgpID49IDc1KSB7XG4gICAgICAgIHRoaXMuc21va2UzLnN0eWxlLm9wYWNpdHkgPSAxO1xuICAgICAgfSBcblxuICAgICAgaWYgKHRoaXMuY2FsY1Njcm9sbFBlcmNlbnQoKSA+PSA3NSkge1xuICAgICAgICB0aGlzLmZvZy5zdHlsZS5vcGFjaXR5ID0gKHRoaXMuY2FsY1Njcm9sbFBlcmNlbnQoKSAtIDc1KSAqIDUgKyAnJSc7XG4gICAgICB9IFxuICAgIH1cblxuXG4gICAgLy8g0LTRi9C8INCy0YXQvtC0XG5cbiAgICBpZiAodGhpcy5jYWxjU2Nyb2xsUGVyY2VudCgpID49IDUgJiYgdGhpcy5jYWxjU2Nyb2xsUGVyY2VudCgpIDwgNDApIHtcbiAgICAgIHRoaXMuc21va2UxLnN0eWxlLm9wYWNpdHkgPSAwO1xuICAgIH0gXG5cbiAgICBpZiAodGhpcy5jYWxjU2Nyb2xsUGVyY2VudCgpID49IDEwICYmIHRoaXMuY2FsY1Njcm9sbFBlcmNlbnQoKSA8IDQwKSB7XG4gICAgICB0aGlzLnNtb2tlMi5zdHlsZS5vcGFjaXR5ID0gMDtcbiAgICB9IFxuXG5cbiAgICBpZiAodGhpcy5jYWxjU2Nyb2xsUGVyY2VudCgpID49IDE1ICYmIHRoaXMuY2FsY1Njcm9sbFBlcmNlbnQoKSA8IDQwKSB7XG4gICAgICB0aGlzLnNtb2tlMy5zdHlsZS5vcGFjaXR5ID0gMDtcbiAgICB9IFxuXG4gICAgICAgICAgXG5cblxuICAgIGlmICh0aGlzLmNhbGNTY3JvbGxQZXJjZW50KCkgPj0gMjUgJiYgdGhpcy5jYWxjU2Nyb2xsUGVyY2VudCgpIDw9IDc1KSB7XG4gICAgICBpZiAodGhpcy5jdXJyZW50U2VjdGlvbi5jbGFzc0xpc3QuY29udGFpbnMoJ2Z1bGwtc2Nyb2xsX19zZXQtYmxhY2stZm9nJykpIHtcbiAgICAgICAgdGhpcy5mb2cuc3R5bGUuYmFja2dyb3VuZENvbG9yID0gJyMwMDAnO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5mb2cuc3R5bGUuYmFja2dyb3VuZENvbG9yID0gJyNmZGY1ZTYnO1xuICAgICAgfVxuXG4gICAgICB0aGlzLmZvZy5zdHlsZS5vcGFjaXR5ID0gMDtcbiAgICAgIC8vIHRoaXMuc21va2UxLnN0eWxlLm9wYWNpdHkgPSAwO1xuICAgIH1cbiAgfVxuXG4gIGV2ZW50SGVuZGxlcigpIHtcbiAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdzY3JvbGwnLCAoKSA9PiB7XG4gICAgICB0aGlzLmNoYW5nZUVsZW1lbnRWaXNpYmxlKCk7XG4gICAgICB0aGlzLnNldEZvZ09wYWNpdHkoKTtcbiAgICB9KTtcbiAgfVxuXG4gIHRvU3RhbmRhcnRTY3JvbGwoKSB7XG4gICAgdGhpcy5zZWN0aW9ucy5mb3JFYWNoKGl0ZW0gPT4ge1xuICAgICAgaXRlbS5jbGFzc0xpc3QuYWRkKCdmdWxsLXNjcm9sbF9fZWxlbWVudC1zdGFuZGFyZC1oZWlnaHQnKTtcbiAgICB9KTtcbiAgfVxufSIsImNvbnN0IHNlY3Rpb25TbGlkZXIgPSBuZXcgU2NyZWVuU2xpZGVyKCdmdWxsLXNjcm9sbCcpO1xuLy8gY29uc3Qgc2VjdGlvblNsaWRlcjIgPSBuZXcgU2NyZWVuU2xpZGVyKCdmdWxsLXNjcm9sbDInKTsiXX0=
