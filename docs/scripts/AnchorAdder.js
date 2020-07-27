class AnchorAdder {
  constructor() {
    if (!history.pushState) {
      return;
    }

    this.scrollHandler();

    console.log(this.anchorsLink);
  }

  addAnchor(name) {
    var baseUrl = window.location.protocol + "//" + window.location.host + window.location.pathname;
    var newUrl = baseUrl + '#test';
    history.pushState(null, null, newUrl);
  }

  scrollHandler() {
    document.addEventListener('scroll', () => {
      
    });
  }


  // Дубль, вынести в общие функции
  getCoords(elem) {
    var box = elem.getBoundingClientRect();
    return {
      top: box.top + pageYOffset,
      bottom: box.bottom + pageYOffset
    };
  }

  get anchorsLink () {
    return document.querySelectorAll(`[data-anchor]`);
  }



}