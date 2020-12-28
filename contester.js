class Move {
  constructor({appeal=0, name="", description="", bonus_order=new Set(), priority=-1, no_more=False, no_penalty=False,
                 compound_condition=False, star_additions=0, jam_factor=1, contest_combos=new Set()}) {
        this.appeal = appeal;
        this.name = name;
        this.description = description;
        this.priority = priority;
        this.bonus_order = bonus_order;

        this.no_more = no_more;
        this.no_penalty = no_penalty;
        this.compound_condition = compound_condition;
        this.star_additions = star_additions;
        this.jam_factor = jam_factor;

        this.contest_combos = contest_combos;
  }
  
  getCopy(name) {
        return new Move({
        this.appeal,
        name,
        this.description,
        this.bonus_order,
        this.priority,
        this.no_more,
        this.no_penalty,
        this.compound_condition,
        this.star_additions,
        this.jam_factor,
        this.contest_combos}
        );
  }
}


document.addEventListener('DOMContentLoaded', (event) => {
  const P = new Pokedex.Pokedex()
  const form = document.getElementById('pokeform');
  const nullMove = new Move({name="null"});
  consol.log(nullMove.name);

  function computeSubmit(event) {
    const pokemon = form.elements.pokemon.value
    P.getPokemonByName(pokemon) // with Promise
    .then(function (response) {
      console.log(response)
      })
    event.preventDefault();
  }

  form.addEventListener('submit', computeSubmit);
})
