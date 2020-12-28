const EXPECTED_JAM = 1.7;
class Move {
  constructor({appeal=0, name="", type="", description="", bonus_order={}, priority=-1, no_more=false, no_penalty=false,
                 compound_condition=false, star_additions=0, jam_factor=1, contest_combos=new Set()}) {
    this.appeal = appeal;
    this.name = name;
    this.type = type;
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
  
  copy(name, type) {
    return new Move({
      appeal: this.appeal,
      name: name,
      type: type,
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


const contest_effect_to_move = {
    "https://pokeapi.co/api/v2/contest-effect/1/": move1,
    "https://pokeapi.co/api/v2/contest-effect/2/": move2,
    "https://pokeapi.co/api/v2/contest-effect/3/": move3,
    "https://pokeapi.co/api/v2/contest-effect/4/": move4,
    "https://pokeapi.co/api/v2/contest-effect/5/": move5,
    "https://pokeapi.co/api/v2/contest-effect/6/": move6,
    "https://pokeapi.co/api/v2/contest-effect/7/": move7,
    "https://pokeapi.co/api/v2/contest-effect/8/": move8,
    "https://pokeapi.co/api/v2/contest-effect/9/": move9,
    "https://pokeapi.co/api/v2/contest-effect/10/": move10,
    "https://pokeapi.co/api/v2/contest-effect/11/": move11,
    "https://pokeapi.co/api/v2/contest-effect/12/": move12,
    "https://pokeapi.co/api/v2/contest-effect/13/": move13,
    "https://pokeapi.co/api/v2/contest-effect/14/": move14,
    "https://pokeapi.co/api/v2/contest-effect/15/": move15,
    "https://pokeapi.co/api/v2/contest-effect/16/": move16,
    "https://pokeapi.co/api/v2/contest-effect/17/": move17,
    "https://pokeapi.co/api/v2/contest-effect/18/": move18,
    "https://pokeapi.co/api/v2/contest-effect/19/": move19,
    "https://pokeapi.co/api/v2/contest-effect/20/": move20,
    "https://pokeapi.co/api/v2/contest-effect/21/": move21,
    "https://pokeapi.co/api/v2/contest-effect/22/": move22,
    "https://pokeapi.co/api/v2/contest-effect/23/": move23,
    "https://pokeapi.co/api/v2/contest-effect/24/": move24,
    "https://pokeapi.co/api/v2/contest-effect/25/": move25,
    "https://pokeapi.co/api/v2/contest-effect/26/": move26,
    "https://pokeapi.co/api/v2/contest-effect/27/": move27,
    "https://pokeapi.co/api/v2/contest-effect/28/": move28,
    "https://pokeapi.co/api/v2/contest-effect/29/": move29,
    "https://pokeapi.co/api/v2/contest-effect/30/": move30,
    "https://pokeapi.co/api/v2/contest-effect/31/": move31,
    "https://pokeapi.co/api/v2/contest-effect/32/": move32,
    "https://pokeapi.co/api/v2/contest-effect/33/": move33,
};

class State {
  constructor({num_turns=5, used_moves=new Set(), current_points=0, num_stars=0, used_combo=false}) {
        this.num_turns = num_turns;
        this.used_moves = used_moves;
        this.current_points = current_points;
        this.num_stars = num_stars;
        this.used_combo = used_combo;
  }
}

class Simulator {
  constructor(pokedex) {
    this.P = pokedex;
    this.checked_sates = {}
  }
  
  calculatePoints(move, current_state) {
    let points = move.appeal;
    let last_move = nullMove;
    let used_combo = false;
    if (current_state.used_moves.length > 0) {
        last_move = current_state.used_moves[current_state.used_moves - 1];
    }
    if (last_move.priority in move.bonus_order) {
        points = move.bonus_order[last_move.priority]
    }
    if (!current_state.used_combo && last_move.name in move.contest_combos) {
        points = move.appeal * 2
        used_combo = true
    }

    // Stars aka Condition
    if (move.compound_condition == true) {
        points = current_state.num_stars * 2 + 1;
    }
    points += current_state.num_stars;

    if (move.name === last_move.name && !move.no_penalty) {
        points -= 1
    }
    
    points -= EXPECTED_JAM * move.jam_factor;

    return {points, used_combo};
  }
  
  checkLearnable(movename, allowed_games) {
    return movename.version_group_details.reduce(function(others, version_group_detail) {
      if (version_group_detail.version_group.name === "ruby-sapphire" &&
          (allowed_games.includes('R') || allowed_games.includes('S'))) {
        return true;
      } else if (version_group_detail.version_group.name === "emerald" && allowed_games.includes('E')) {
        return true;
      } else if (version_group_detail.version_group.name === "firered-leafgreen" &&
           (allowed_games.includes('F') || allowed_games.includes('L'))) {
        return true;
      } else if (version_group_detail.version_group.name === "colosseum" && allowed_games.includes('C')) {
        return true;
      } else if (version_group_detail.version_group.name === "xd" && allowed_games.includes('X')) {
        return true;
      } else {
        return others;
      }
    }, false);
  }

  getAvailableMoves(pokemon_resource) {
    let self = this;
    console.log("Have this many moves:", pokemon_resource.moves);
    return pokemon_resource.moves.reduce(async function(total, movename) {
      if (!self.checkLearnable(movename, 'RSEFLCX')) {
        return total;
      }
      let move = await self.P.getMoveByName(movename.move.name);
      if (move.contest_effect == null) {
        console.log("Contest effect is missing");
        return total;
      }
      console.log("Move is eligible for contest");
      let move_obj = contest_effect_to_move[move.contest_effect.url].copy(move.name, move.contest_type.name);
      if (move.contest_combos && move.contest_combos.normal && move.contest_combos.normal.use_before) {
        move_obj.contest_combos = move.contest_combos.normal.use_before.reduce(function(all_combos, c) {
          return all_combos.add(c.name);
        }, new Set());
      }
      console.log("Received:", total, move.name);
      total.push(move_obj);
      return total;
    }, new Array());
  }
  
  calculateContest(pokemon) {
    let self = this;
    self.P.getPokemonByName(pokemon) // with Promise
    .then(function (pokemon_resource) {
      console.log(pokemon_resource);
      let available_moves = self.getAvailableMoves(pokemon_resource);
      console.log(available_moves.length);
      });
  }

}

document.addEventListener('DOMContentLoaded', (event) => {
  const P = new Pokedex.Pokedex()
  const simulator = new Simulator(P);
  const form = document.getElementById('pokeform');

  function computeSubmit(event) {
    const pokemon = form.elements.pokemon.value
    simulator.calculateContest(pokemon);
    event.preventDefault();
  }

  form.addEventListener('submit', computeSubmit);
})
