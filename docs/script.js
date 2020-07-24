"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var ScreenSlider = /*#__PURE__*/function () {
  function ScreenSlider() {
    _classCallCheck(this, ScreenSlider);

    this.sections = Array.from(document.querySelectorAll('.full-scroll__element'));
    this.fog = document.querySelector('.full-scroll__fog');
    this.currentSection = '';
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
  }, {
    key: "eventHendler",
    value: function eventHendler() {
      var _this2 = this;

      document.addEventListener('scroll', function () {
        _this2.changeElementVisible();

        _this2.setFogOpacity();
      });
    }
  }]);

  return ScreenSlider;
}();

var sectionSlider = new ScreenSlider();
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIlNjcmVlblNsaWRlci5qcyIsInNjcmlwdC5qcyJdLCJuYW1lcyI6WyJTY3JlZW5TbGlkZXIiLCJzZWN0aW9ucyIsIkFycmF5IiwiZnJvbSIsImRvY3VtZW50IiwicXVlcnlTZWxlY3RvckFsbCIsImZvZyIsInF1ZXJ5U2VsZWN0b3IiLCJjdXJyZW50U2VjdGlvbiIsImV2ZW50SGVuZGxlciIsImNoYW5nZUVsZW1lbnRWaXNpYmxlIiwiZWxlbSIsImJveCIsImdldEJvdW5kaW5nQ2xpZW50UmVjdCIsInRvcCIsInBhZ2VZT2Zmc2V0IiwiYm90dG9tIiwiTWF0aCIsImZsb29yIiwiZ2V0Q29vcmRzIiwiY2xpZW50SGVpZ2h0IiwiZm9yRWFjaCIsIml0ZW0iLCJmaXhlZEJsb2NrIiwiZWxlbUNvb3JkcyIsImNsYXNzTGlzdCIsImFkZCIsInJlbW92ZSIsImxlbmd0aCIsIndpbmRvdyIsImlubmVySGVpZ2h0IiwiaW5kZXhPZiIsImNhbGNTY3JvbGxQZXJjZW50Iiwic3R5bGUiLCJvcGFjaXR5IiwiY29udGFpbnMiLCJiYWNrZ3JvdW5kQ29sb3IiLCJhZGRFdmVudExpc3RlbmVyIiwic2V0Rm9nT3BhY2l0eSIsInNlY3Rpb25TbGlkZXIiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7O0lBQUFBLFk7QUFDQSwwQkFBQTtBQUFBOztBQUNBLFNBQUFDLFFBQUEsR0FBQUMsS0FBQSxDQUFBQyxJQUFBLENBQUFDLFFBQUEsQ0FBQUMsZ0JBQUEsQ0FBQSx1QkFBQSxDQUFBLENBQUE7QUFDQSxTQUFBQyxHQUFBLEdBQUFGLFFBQUEsQ0FBQUcsYUFBQSxDQUFBLG1CQUFBLENBQUE7QUFDQSxTQUFBQyxjQUFBLEdBQUEsRUFBQTtBQUVBLFNBQUFDLFlBQUE7QUFDQSxTQUFBQyxvQkFBQTtBQUNBOzs7OzhCQUdBQyxJLEVBQUE7QUFDQSxVQUFBQyxHQUFBLEdBQUFELElBQUEsQ0FBQUUscUJBQUEsRUFBQTtBQUNBLGFBQUE7QUFDQUMsUUFBQUEsR0FBQSxFQUFBRixHQUFBLENBQUFFLEdBQUEsR0FBQUMsV0FEQTtBQUVBQyxRQUFBQSxNQUFBLEVBQUFKLEdBQUEsQ0FBQUksTUFBQSxHQUFBRDtBQUZBLE9BQUE7QUFJQTs7O3dDQUVBO0FBQ0EsVUFBQSxLQUFBUCxjQUFBLEVBQUE7QUFDQSxlQUFBUyxJQUFBLENBQUFDLEtBQUEsQ0FBQSxDQUFBSCxXQUFBLEdBQUEsS0FBQUksU0FBQSxDQUFBLEtBQUFYLGNBQUEsRUFBQU0sR0FBQSxJQUFBLEtBQUFOLGNBQUEsQ0FBQVksWUFBQSxHQUFBLEdBQUEsQ0FBQTtBQUNBO0FBQ0E7OzsyQ0FDQTtBQUFBOztBQUNBLFdBQUFuQixRQUFBLENBQUFvQixPQUFBLENBQUEsVUFBQUMsSUFBQSxFQUFBO0FBQ0EsWUFBQUMsVUFBQSxHQUFBRCxJQUFBLENBQUFmLGFBQUEsQ0FBQSw2QkFBQSxDQUFBOztBQUNBLFlBQUFpQixVQUFBLEdBQUEsS0FBQSxDQUFBTCxTQUFBLENBQUFHLElBQUEsQ0FBQTs7QUFDQSxZQUFBUCxXQUFBLElBQUFTLFVBQUEsQ0FBQVYsR0FBQSxJQUFBVSxVQUFBLENBQUFSLE1BQUEsSUFBQUQsV0FBQSxFQUFBO0FBQ0EsVUFBQSxLQUFBLENBQUFQLGNBQUEsR0FBQWMsSUFBQTtBQUNBQyxVQUFBQSxVQUFBLENBQUFFLFNBQUEsQ0FBQUMsR0FBQSxDQUFBLHdCQUFBO0FBQ0EsU0FIQSxNQUdBO0FBQ0FILFVBQUFBLFVBQUEsQ0FBQUUsU0FBQSxDQUFBRSxNQUFBLENBQUEsd0JBQUE7QUFDQTs7QUFFQSxZQUFBLEtBQUEsQ0FBQW5CLGNBQUEsS0FBQSxLQUFBLENBQUFQLFFBQUEsQ0FBQSxLQUFBLENBQUFBLFFBQUEsQ0FBQTJCLE1BQUEsR0FBQSxDQUFBLENBQUEsRUFBQTtBQUNBLGNBQUFiLFdBQUEsSUFBQSxLQUFBLENBQUFJLFNBQUEsQ0FBQSxLQUFBLENBQUFYLGNBQUEsRUFBQVEsTUFBQSxHQUFBYSxNQUFBLENBQUFDLFdBQUEsRUFBQTtBQUNBUCxZQUFBQSxVQUFBLENBQUFFLFNBQUEsQ0FBQUUsTUFBQSxDQUFBLHdCQUFBO0FBQ0FKLFlBQUFBLFVBQUEsQ0FBQUUsU0FBQSxDQUFBQyxHQUFBLENBQUEsd0JBQUE7QUFDQSxXQUhBLE1BR0E7QUFDQUgsWUFBQUEsVUFBQSxDQUFBRSxTQUFBLENBQUFFLE1BQUEsQ0FBQSx3QkFBQTtBQUNBO0FBQ0E7QUFDQSxPQWxCQTtBQW1CQTs7O29DQUVBO0FBQ0EsVUFBQSxLQUFBMUIsUUFBQSxDQUFBOEIsT0FBQSxDQUFBLEtBQUF2QixjQUFBLE1BQUEsQ0FBQSxFQUFBO0FBQ0EsWUFBQSxLQUFBd0IsaUJBQUEsTUFBQSxFQUFBLEVBQUE7QUFDQSxlQUFBMUIsR0FBQSxDQUFBMkIsS0FBQSxDQUFBQyxPQUFBLEdBQUEsTUFBQSxLQUFBRixpQkFBQSxLQUFBLENBQUEsR0FBQSxHQUFBO0FBQ0E7QUFDQTs7QUFFQSxVQUFBLEtBQUF4QixjQUFBLEtBQUEsS0FBQVAsUUFBQSxDQUFBLEtBQUFBLFFBQUEsQ0FBQTJCLE1BQUEsR0FBQSxDQUFBLENBQUEsRUFBQTtBQUNBLFlBQUEsS0FBQUksaUJBQUEsTUFBQSxFQUFBLEVBQUE7QUFDQSxlQUFBMUIsR0FBQSxDQUFBMkIsS0FBQSxDQUFBQyxPQUFBLEdBQUEsQ0FBQSxLQUFBRixpQkFBQSxLQUFBLEVBQUEsSUFBQSxDQUFBLEdBQUEsR0FBQTtBQUNBO0FBQ0E7O0FBRUEsVUFBQSxLQUFBQSxpQkFBQSxNQUFBLEVBQUEsSUFBQSxLQUFBQSxpQkFBQSxNQUFBLEVBQUEsRUFBQTtBQUNBLFlBQUEsS0FBQXhCLGNBQUEsQ0FBQWlCLFNBQUEsQ0FBQVUsUUFBQSxDQUFBLDRCQUFBLENBQUEsRUFBQTtBQUNBLGVBQUE3QixHQUFBLENBQUEyQixLQUFBLENBQUFHLGVBQUEsR0FBQSxNQUFBO0FBQ0EsU0FGQSxNQUVBO0FBQ0EsZUFBQTlCLEdBQUEsQ0FBQTJCLEtBQUEsQ0FBQUcsZUFBQSxHQUFBLE1BQUE7QUFDQTs7QUFDQSxhQUFBOUIsR0FBQSxDQUFBMkIsS0FBQSxDQUFBQyxPQUFBLEdBQUEsQ0FBQTtBQUNBO0FBQ0E7OzttQ0FHQTtBQUFBOztBQUNBOUIsTUFBQUEsUUFBQSxDQUFBaUMsZ0JBQUEsQ0FBQSxRQUFBLEVBQUEsWUFBQTtBQUNBLFFBQUEsTUFBQSxDQUFBM0Isb0JBQUE7O0FBQ0EsUUFBQSxNQUFBLENBQUE0QixhQUFBO0FBQ0EsT0FIQTtBQUlBOzs7Ozs7QUMzRUEsSUFBQUMsYUFBQSxHQUFBLElBQUF2QyxZQUFBLEVBQUEiLCJmaWxlIjoic2NyaXB0LmpzIiwic291cmNlc0NvbnRlbnQiOlsiY2xhc3MgU2NyZWVuU2xpZGVyIHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy5zZWN0aW9ucyA9IEFycmF5LmZyb20oZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLmZ1bGwtc2Nyb2xsX19lbGVtZW50JykpO1xuICAgIHRoaXMuZm9nID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmZ1bGwtc2Nyb2xsX19mb2cnKTtcbiAgICB0aGlzLmN1cnJlbnRTZWN0aW9uID0gJyc7XG5cbiAgICB0aGlzLmV2ZW50SGVuZGxlcigpO1xuICAgIHRoaXMuY2hhbmdlRWxlbWVudFZpc2libGUoKTtcbiAgfVxuXG5cbiAgZ2V0Q29vcmRzKGVsZW0pIHtcbiAgICB2YXIgYm94ID0gZWxlbS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICByZXR1cm4ge1xuICAgICAgdG9wOiBib3gudG9wICsgcGFnZVlPZmZzZXQsXG4gICAgICBib3R0b206IGJveC5ib3R0b20gKyBwYWdlWU9mZnNldFxuICAgIH07XG4gIH1cbiAgXG4gIGNhbGNTY3JvbGxQZXJjZW50KCkge1xuICAgIGlmICh0aGlzLmN1cnJlbnRTZWN0aW9uKSB7XG4gICAgICByZXR1cm4gTWF0aC5mbG9vcigocGFnZVlPZmZzZXQgLSB0aGlzLmdldENvb3Jkcyh0aGlzLmN1cnJlbnRTZWN0aW9uKS50b3ApIC8gdGhpcy5jdXJyZW50U2VjdGlvbi5jbGllbnRIZWlnaHQgKiAxMDApO1xuICAgIH1cbiAgfVxuICBjaGFuZ2VFbGVtZW50VmlzaWJsZSgpIHtcbiAgICB0aGlzLnNlY3Rpb25zLmZvckVhY2goaXRlbSA9PiB7XG4gICAgICBjb25zdCBmaXhlZEJsb2NrID0gaXRlbS5xdWVyeVNlbGVjdG9yKCcuZnVsbC1zY3JvbGxfX2ZpeGVkLXdyYXBwZXInKTtcbiAgICAgIGNvbnN0IGVsZW1Db29yZHMgPSB0aGlzLmdldENvb3JkcyhpdGVtKTtcbiAgICAgIGlmIChwYWdlWU9mZnNldCA+PSBlbGVtQ29vcmRzLnRvcCAmJiBlbGVtQ29vcmRzLmJvdHRvbSA+PSBwYWdlWU9mZnNldCkge1xuICAgICAgICB0aGlzLmN1cnJlbnRTZWN0aW9uID0gaXRlbTtcbiAgICAgICAgZml4ZWRCbG9jay5jbGFzc0xpc3QuYWRkKCdmdWxsLXNjcm9sbF9fZml4LXN0YXRlJyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBmaXhlZEJsb2NrLmNsYXNzTGlzdC5yZW1vdmUoJ2Z1bGwtc2Nyb2xsX19maXgtc3RhdGUnKTtcbiAgICAgIH1cblxuICAgICAgaWYgKHRoaXMuY3VycmVudFNlY3Rpb24gPT09IHRoaXMuc2VjdGlvbnNbdGhpcy5zZWN0aW9ucy5sZW5ndGggLSAxXSkge1xuICAgICAgICBpZiAocGFnZVlPZmZzZXQgPj0gdGhpcy5nZXRDb29yZHModGhpcy5jdXJyZW50U2VjdGlvbikuYm90dG9tIC0gd2luZG93LmlubmVySGVpZ2h0KSB7XG4gICAgICAgICAgZml4ZWRCbG9jay5jbGFzc0xpc3QucmVtb3ZlKCdmdWxsLXNjcm9sbF9fZml4LXN0YXRlJyk7XG4gICAgICAgICAgZml4ZWRCbG9jay5jbGFzc0xpc3QuYWRkKCdmdWxsLXNjcm9sbF9fbGFzdC1lbGVtJyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgZml4ZWRCbG9jay5jbGFzc0xpc3QucmVtb3ZlKCdmdWxsLXNjcm9sbF9fbGFzdC1lbGVtJyk7XG4gICAgICAgIH1cbiAgICAgIH0gXG4gICAgfSk7XG4gIH1cbiAgXG4gIHNldEZvZ09wYWNpdHkoKSB7XG4gICAgaWYgKHRoaXMuc2VjdGlvbnMuaW5kZXhPZih0aGlzLmN1cnJlbnRTZWN0aW9uKSAhPT0gMCkge1xuICAgICAgaWYgKHRoaXMuY2FsY1Njcm9sbFBlcmNlbnQoKSA8PSAyNSkge1xuICAgICAgICB0aGlzLmZvZy5zdHlsZS5vcGFjaXR5ID0gMTAwIC0gdGhpcy5jYWxjU2Nyb2xsUGVyY2VudCgpICogNCArICclJzsgXG4gICAgICB9XG4gICAgfSBcbiAgICBcbiAgICBpZiAodGhpcy5jdXJyZW50U2VjdGlvbiAhPT0gdGhpcy5zZWN0aW9uc1t0aGlzLnNlY3Rpb25zLmxlbmd0aCAtIDFdKSB7XG4gICAgICBpZiAodGhpcy5jYWxjU2Nyb2xsUGVyY2VudCgpID49IDc1KSB7XG4gICAgICAgIHRoaXMuZm9nLnN0eWxlLm9wYWNpdHkgPSAodGhpcy5jYWxjU2Nyb2xsUGVyY2VudCgpIC0gNzUpICogNSArICclJztcbiAgICAgIH0gXG4gICAgfVxuXG4gICAgaWYgKHRoaXMuY2FsY1Njcm9sbFBlcmNlbnQoKSA+PSAyNSAmJiB0aGlzLmNhbGNTY3JvbGxQZXJjZW50KCkgPD0gNzUpIHtcbiAgICAgIGlmICh0aGlzLmN1cnJlbnRTZWN0aW9uLmNsYXNzTGlzdC5jb250YWlucygnZnVsbC1zY3JvbGxfX3NldC1ibGFjay1mb2cnKSkge1xuICAgICAgICB0aGlzLmZvZy5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSAnIzAwMCc7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLmZvZy5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSAnI2ZmZic7XG4gICAgICB9XG4gICAgICB0aGlzLmZvZy5zdHlsZS5vcGFjaXR5ID0gMDtcbiAgICB9XG4gIH1cblxuXG4gIGV2ZW50SGVuZGxlcigpIHtcbiAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdzY3JvbGwnLCAoKSA9PiB7XG4gICAgICB0aGlzLmNoYW5nZUVsZW1lbnRWaXNpYmxlKCk7XG4gICAgICB0aGlzLnNldEZvZ09wYWNpdHkoKTtcbiAgICB9KTtcbiAgfVxufSIsImNvbnN0IHNlY3Rpb25TbGlkZXIgPSBuZXcgU2NyZWVuU2xpZGVyKCk7Il19
