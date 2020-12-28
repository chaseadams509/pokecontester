document.addEventListener('DOMContentLoaded', (event) => {
  const P = new Pokedex.Pokedex()
  const form = document.getElementById('pokeform');  

  function computeSubmit(event) {
    const pokemon = form.elements.pokemon.value
    P.getPokemonByName(pokemon) // with Promise
    .then(function (response) {
      console.log(response)
      })
    event.preventDefault();
  }

  form.addEVentListener('submit', computeSubmit);
})
