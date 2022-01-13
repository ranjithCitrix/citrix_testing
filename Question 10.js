function rotateRight(arr,rotations){

    if(rotations == 0) return arr;
  
    for(let i = 0; i < rotations;i++){
  
      let element = arr.pop();
  
      arr.unshift(element);
  
    }
  
    return arr;
  
  }
  
  rotateRight([2, 3, 4, 5, 7], 3);