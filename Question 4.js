const heros = [
    { name: 'Spider-Man' },
    { name: 'Thor' },
    { name: 'Black Panther' },
    { name: 'Captain Marvel' },
    { name: 'Silver Surfer' }
  ];
   
  const arr = heros.map((hero, identity) =>{
    return {id:identity, hero:hero.name}
  });
  console.log(arr);