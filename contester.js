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
        appeal: this.appeal,
        name: name,
        description: this.description,
        bonus_order: this.bonus_order,
        priority: this.priority,
        no_more: this.no_more,
        no_penalty: this.no_penalty,
        compound_condition: this.compound_condition,
        star_additions: this.star_additions,
        jam_factor: this.jam_factor,
        contest_combos: this.contest_combos}
        );
  }
}


document.addEventListener('DOMContentLoaded', (event) => {
  const P = new Pokedex.Pokedex()
  const form = document.getElementById('pokeform');
  const nullMove = new Move({name: "null"});
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
