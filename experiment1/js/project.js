const fillers = {
  
  adventurer: ["My dude", "Bro", "WesBot", "Adventurer", "Traveller", "Fellow", "Citizen", "Ashen One", "Dragonborn", "Cool person", "Tarnished", "勇者", "$adventurer and $adventurer", "$adventurer, $adventurer, and $adventurer", "Geoff"],
  pre: ["Fra", "Tro", "Gre", "Pan", "Ast", "Ara"],
  post: ["gria", "ston", "gott","-on-the-lee", "ora", "Ara", "uwu"],
  people: ["kindly", "meek", "brave", "wise", "sacred", "cherished", "honored", "forgotten", "apathetic", "mystic", "orca", "帥氣"],
  item: ["axe", "staff", "book", "cloak", "shield", "club", "sword", "magic gloves", "galvel", "fists", "mace", "potato"],
  num: ["two", "three", "eleven", "so many", "too many", "an unsatisfying number of", "barely any", "an unspecified amount of", "surely a satisfactory number of"],
  looty: ["gleaming", "valuable", "esteemed", "rare", "exalted", "scintillating", "kinda gross but still usefull", "complete garbage"],
  loots: ["coins", "chalices", "ingots", "hides", "victory points", "gems","scrolls", "bananas", "noodles", "goblins", "CS Majors", "college credits"],
  baddies: ["orcs", "glubs", "fishmen", "cordungles", "mountain trolls", "college professors", "dragon", "evil $adventurer", "agents of chaos"],
  message: ["call", "txt", "post", "decree", "shoutz", "tweets", "choiche", "hearkens", "harkening", "harkenening", "harkenenening", "...wait, no! Come back", "Watermelon"],
  badEnglish: [", like,", " literally", ", uhm,", ", uh,", ", ehrm,", ", like, literally,", ", God forbid,"],
  
};

const template = `$adventurer, heed my $message!

I have$badEnglish just come from $pre$post where the $people folk are $badEnglish in desperate need. Their town has been$badEnglish overrun by $baddies. You must venture forth$badEnglish at once, taking my $item, and help them.

It is$badEnglish told that the one who can rescue them will be awarded with$badEnglish $num $looty $loots. Surely this must$badEnglish tempt one such as$badEnglish yourself!
`;


// STUDENTS: You don't need to edit code below this line.

const slotPattern = /\$(\w+)/;

function replacer(match, name) {
  let options = fillers[name];
  if (options) {
    return options[Math.floor(Math.random() * options.length)];
  } else {
    return `<UNKNOWN:${name}>`;
  }
}

function generate() {
  let story = template;
  while (story.match(slotPattern)) {
    story = story.replace(slotPattern, replacer);
  }

  /* global box */
  box.innerText = story;
}

/* global clicker */
clicker.onclick = generate;

generate();
