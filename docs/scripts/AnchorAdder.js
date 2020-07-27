class AnchorAdder {
  constructor() {
    if (!history.pushState) {
      return;
    }

    this.scrollHandler();
  }

  addAnchor(name) {
    var baseUrl = window.location.protocol + "//" + window.location.host + window.location.pathname;
    var newUrl = baseUrl + `#${name}`;
    history.pushState(null, null, newUrl);
  } 

  scrollHandler() {
    document.addEventListener('scroll', () => {

      // Надо вынести значения в отдельный массив, чтобы не пробегать каждый раз циклом

      this.anchorsLink.forEach(item => {
        let anchorTopCoord = GetCoords.getCoords(item).top;
        
        if (pageYOffset >= anchorTopCoord && pageYOffset <= anchorTopCoord + 500) {
          this.addAnchor(item.name);
        }
      })
    });
  }

  get anchorsLink () {
    return document.querySelectorAll('a.anchor');
  }
}