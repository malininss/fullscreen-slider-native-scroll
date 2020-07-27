class GetCoords {
  static getCoords(element) {
    const box = element.getBoundingClientRect();
     
    return {
      top: box.top + pageYOffset, 
      bottom: box.bottom + pageYOffset  
    }; 
  } 
}