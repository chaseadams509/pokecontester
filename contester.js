class Move {
  constructor({appeal=0, name="", description="", bonus_order={}, priority=-1, no_more=false, no_penalty=false,
                 compound_condition=false, star_additions=0, jam_factor=1, contest_combos=new Set()}) {
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

class State {
  constructor({num_turns=5, used_moves=new Set(), current_points=0, num_stars=0, used_combo=false}) {
        this.num_turns = num_turns;
        this.used_moves = used_moves;
        this.current_points = current_points;
        this.num_stars = num_stars;
        this.used_combo = used_combo;
  }
}

const nullMove = new Move({name: "null"});
const move1 = new Move({appeal: 4, name: "contest-effect/1", description: "A highly appealing move."}); // Gives a high number of appeal points wth no other effects.
const move2 = new Move({appeal: 3, name: "contest-effect/2", description: "Affected by how well the appeal in front goes."}); // If the Pokémon that appealed before the user earned less than three appeal points, user earns six; if three, user earns three; if more than three, user earns none.
const move3 = new Move({appeal: 6, name: "contest-effect/3", description: "After this move, the user is more easily startled.", jam_factor: 2}); // If the user is jammed this turn after using this move, it will receive twice as many jam points.
const move4 = new Move({appeal: 1, name: "contest-effect/4", description: "Badly startles the Pokémon in front."}); // Attempts to jam the Pokémon that appealed before the user.
const move5 = new Move({appeal: 1, name: "contest-effect/5", description: "Badly startles those that have made appeals."}); // Attempts to jam all Pokémon that have appealed this turn.
const move6 = new Move({appeal: 4, name: "contest-effect/6", description: "Jams the others, and misses one turn of appeals."}); // Attempts to jam the other Pokémon.  The user cannot make an appeal on the next turn, but it cannot be jammed either.
const move7 = new Move({appeal: 8, name: "contest-effect/7", description: "Makes a great appeal, but allows no more to the end.", no_more: true}); // User cannot make any more appeals for the remainder of the contest.
const move8 = new Move({appeal: 2, name: "contest-effect/8", description: "Startles all Pokémon that have done their appeals."}); // Attempts to jam all Pokémon that have appealed this turn.
const move9 = new Move({appeal: 2, name: "contest-effect/9", description: "Startles the Pokémon that appealed before the user."}); // Attempts to jam the Pokémon that appealed before the user.
const move10 = new Move({appeal: 2, name: "contest-effect/10", description: "Startles the Pokémon that has the judge's attention."}); // Attempts to jam all Pokémon that have appealed this turn.  If a Pokémon is in combo standby status, it is jammed 5 points instead of 1.
const move11 = new Move({appeal: 1, name: "contest-effect/11", description: "The appeal works best the more the crowd is excited."}); // If the Applause meter is empty or at one, earns one point; if two, earns three points; if three, earns four points; if four, earns six points.
const move12 = new Move({appeal: 2, name: "contest-effect/12", description: "Works well if it's the same type as the one before."}); // If the last Pokémon's appeal is the same type as this move, user earns six points instead of two.
const move13 = new Move({appeal: 1, name: "contest-effect/13", description: "An appeal that excites the audience in any contest."}); // Always adds a point to the applause meter, regardless of whether the move matches the contest, and can likewise gain the applause bonus.
const move14 = new Move({appeal: 2, name: "contest-effect/14", description: "Badly startles all Pokémon that made good appeals."}); // Attempts to jam all Pokémon that have appealed this turn for half their appeal points (minimum 1).
const move15 = new Move({appeal: 1, name: "contest-effect/15", description: "Can avoid being startled by others.", jam_factor: 0}); // Prevents jamming for the rest of this turn.
const move16 = new Move({appeal: 2, name: "contest-effect/16", description: "Can avoid being startled by others once.", jam_factor: 0}); // Prevents the next jam on this turn.
const move17 = new Move({appeal: 3, name: "contest-effect/17", description: "Can be repeatedly used without boring the judge.", no_penalty: true}); // Repeated use does not incur a penalty.
const move18 = new Move({appeal: 2, name: "contest-effect/18", description: "Makes all Pokémon after the user nervous."}); // Attempts to make all following Pokémon nervous (and thus unable to appeal).
const move19 = new Move({appeal: 1, name: "contest-effect/19", description: "Makes the appeal as good as the one before it."}); // User earns appeal points equal to the points the previous Pokémon earned plus one.
const move20 = new Move({appeal: 1, name: "contest-effect/20", description: "Makes the appeal as good as those before it."}); // User earns appeal points equal to half the points ALL the previous Pokémon earned plus one.
const move21 = new Move({appeal: 3, name: "contest-effect/21", description: "Scrambles up the order of appeals on the next turn."}); // Shuffles the next turn's turn order.
const move22 = new Move({appeal: 3, name: "contest-effect/22", description: "Shifts the judge's attention from others."}); // Cancels combo standby status for all Pokémon that have appealed this turn.
const move23 = new Move({appeal: 2, name: "contest-effect/23", description: "Startles Pokémon that made a same-type appeal."}); // Attempts to jam all Pokémon that have appealed this turn.  If a Pokémon used the same type move as this one, it is jammed for 4 points instead of 1.
const move24 = new Move({appeal: 3, name: "contest-effect/24", description: "Temporarily stops the crowd from getting excited."}); // Prevents the Applause Meter from rising for the rest of the turn.
const move25 = new Move({appeal: 1, name: "contest-effect/25", description: "The appeal's quality depends on its timing."}); // Randomly earns one, two, four, or eight points.
const move26 = new Move({appeal: 1, name: "contest-effect/26", description: "The appeal works better the later it is performed.", bonus_order: {1: 1, 2: 2, 3: 4, 4: 6}}); // If user appeals first this turn, earns one point; if second, two points; if third, four points; if last, six points.
const move27 = new Move({appeal: 2, name: "contest-effect/27", description: "The appeal works great if performed first.", bonus_order: {1: 6}}); // If user appeals first this turn, earns six points instead of two.
const move28 = new Move({appeal: 2, name: "contest-effect/28", description: "The appeal works great if performed last.", bonus_order: {4: 6}}); // If user appeals last this turn, earns six points instead of two.
const move29 = new Move({appeal: 1, name: "contest-effect/29", description: "The appeal works well if the user's condition is good.", compound_condition: true}); // If user has no stars, earns one point; if one, three points; if two, five points; if three, seven points.  This does not include the appeal point bonus the stars give.
const move30 = new Move({appeal: 3, name: "contest-effect/30", description: "The next appeal can be made earlier next turn.", priority: 1}); // User will go first next turn.
const move31 = new Move({appeal: 3, name: "contest-effect/31", description: "The next appeal can be made later next turn.", priority: 4}); // User will go last next turn.
const move32 = new Move({appeal: 1, name: "contest-effect/32", description: "Ups the user's condition.  Helps prevent nervousness.", star_additions: 1}); // User gains one star.
const move33 = new Move({appeal: 3, name: "contest-effect/33", description: "Worsens the condition of those that made appeals."}); // Removes all stars from all Pokémon that have appealed this turn.


document.addEventListener('DOMContentLoaded', (event) => {
  const P = new Pokedex.Pokedex()
  const form = document.getElementById('pokeform');
  console.log(nullMove.name);

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
