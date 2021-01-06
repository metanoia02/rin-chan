
module.exports = {
  config: {
  scope: 'DM',
  title: 'Kagamine Birthday Quiz 2020'
},

convo: [
    {msg: `Hi! Here you can test if you really know me.
    I'll reward my most knowledgeable fans!`, thumb: {path: 'emotes/', fn: 'oharin.png'}},

    {lbl: 'beginning', qs: 'Ready to start the quiz?', ans: [
      {op: 'yes', nxt: 'q1'},
      {op: 'no', nxt: 'ready_no'},
    ]},

    {lbl: 'ready_no', msg: 'No problem, come back when you are ready.', save:'beginning'},

    {lbl: 'q1', qs: 'Ok first question. In what year was my VOCALOID software first released?', ans: [
      {op: '2006', nxt: 'q1_incorrect'},
      {op: '2007', nxt: 'q2'},
      {op: '2008', nxt: 'q1_incorrect'},
    ], img: {path: 'quest/', fn: 'rinBox.jpg'}},

    {lbl: 'q1_incorrect', msg: `Sorry that's wrong, but here's an orange for trying!`, reward: [
      {entityId: 'orange', quantity: 1},
    ], thumb: {path: 'emotes/', fn: 'rinded.png'}, nxt:'ending'},

    {lbl: 'q2', qs: 'Correct! Next question. At the start of my performance of Lost Ones Weeping what did I smash?',
    ans: [
      {op: 'A Guitar', nxt:'q3'},
      {op: 'A Keytar', nxt:'q2_incorrect'},
      {op: `Len's hopes and dreams`, nxt:'q2_incorrect'},
    ], img: {path: 'quest/', fn: 'lostOnes.jpg'}},

    {lbl: 'q2_incorrect', msg: `Incorrect, here's a couple oranges. 
    Hope they give you focus when you're studying up.`, reward: [
      {entityId: 'orange', quantity: 2},
    ], thumb: {path: 'emotes/', fn: 'rinded.png'}, nxt:'ending'},

    {lbl: 'q3', qs: `Correct! In the song Bring It On how many 'Hey's are there?'`,
    ans: [
      {op: '39', nxt:'q3_incorrect'},
      {op: '22', nxt:'q4'},
      {op: `8`, nxt:'q3_incorrect'},
    ], img: {path: 'entity/', fn: 'bringItOn.png'}},

    {lbl: 'q3_incorrect', msg: `Sorry that's not quite right, but you did pretty well.
    Here's 5 oranges`, reward: [
      {entityId: 'orange', quantity: 5},
    ], thumb: {path: 'emotes/', fn: 'rinok.png'}, nxt:'ending'},

    {lbl: 'q4', qs: `Doing good! My box illustration was redrawn for the V2 ACT 2 release. 
    But how did my shirt change?`,
    ans: [
      {op: 'It changed colour', nxt:'q4_incorrect'},
      {op: 'It got shorter', nxt:'q4_incorrect'},
      {op: 'Yellow trim was added', nxt:'q5'},
    ], img: {path: 'emotes/', fn: 'rinpeer.png'}},

    {lbl: 'q4_incorrect', msg: `You got it wrong, but you did pretty well. 
    I'm impressed so have 10 oranges.`, reward: [
      {entityId: 'orange', quantity: 10},
    ], thumb: {path: 'emotes/', fn: 'rinchill.png'}, nxt:'ending'},

    {lbl: 'q5', qs: `Congrats you made it to the final question! Why do you love me so much?`,
    ans: [
      {op: 'You have a beautiful voice', nxt:'q5_correct'},
      {op: 'You are the cutest!', nxt:'q5_correct'},
      {op: 'You make me happy when times are sad', nxt:'q5_correct'},
    ], img: {path: 'quest/', fn: 'rinCute.jpg'}},

    {lbl: 'q5_correct', msg: `Here's your special prize`, reward: [
      {entityId: 'goldenOrange', quantity: 5},
      {songId: 'kimipedia', quantity: 1},
    ], thumb: {path: 'emotes/', fn: 'rinblush.png'}, nxt:'ending'},

    {lbl: 'ending', msg:'Thanks for playing! See you around on the server.',
    thumb: {path: 'emotes/', fn: 'rinlove.png'}, end: true}
  ],
};