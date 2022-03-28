const gameName = [];
gameName[0] = "Artemis";
gameName[1] = "Boomerang Fu";
gameName[2] = "Civilization 6";
gameName[3] = "Call of Duty 4";
gameName[4] = "Company of Heroes";
gameName[5] = "Counter Strike 1.6";
gameName[6] = "Dota2";
gameName[7] = "Genital Jousting";
gameName[8] = "Golf with your friends";
gameName[9] = "Halo";
gameName[10] = "Humans Fall Flat";
gameName[11] = "Jackbox";
gameName[12] = "Minecraft";
gameName[13] = "Overcooked";
gameName[14] = "Overwatch";
gameName[15] = "Prop Hunt";
gameName[16] = "Pummel Party";
gameName[17] = "Rust";
gameName[18] = "Warcraft 3";
gameName[19] = "Worms";
gameName[20] = "Wreckfest";
gameName[21] = "Try Again";
gameName[22] = "Try Again";
gameName[23] = "Try Again";

var audio;
var audioTrue;
var delay = 1000;
var delayWheel = 4000;

var wheelspin = document.getElementById("wheelspin");

var stage = new createjs.Stage("canvas");
createjs.Ticker.timingMode = createjs.Ticker.RAF;
createjs.Ticker.on("tick", tick);

var c = new createjs.Container(),
  s = new createjs.Shape();

var segments = 24,
  size = 250,
  angle = Math.PI * 2 / segments;

// Draw a wheel  
for (var i = 0, l = segments; i < l; i++) {
  s.graphics.f((i % 2 == 0) ? "#bbb" : "#ddd")
    .mt(0, 0)
    .lt(Math.cos(angle * i) * size, Math.sin(angle * i) * size)
    .arc(0, 0, size, i * angle, i * angle + angle)
    .lt(0, 0);

  // Add text child
  var num = new createjs.Text(i, (size / 10) + "px Arial Black", "#888")
    .set({
      textAlign: "center",
      regY: size - 15,
      rotation: angle * 180 / Math.PI * (i + 0.5)
    });
  c.addChild(num);
}

c.addChildAt(s, 0);
c.x = c.y = size + 20;
c.cache(-size, -size, size * 2, size * 2);


c.rotation = -360 / segments / 2; // Rotate by 1/2 segment to align at 0

// Red Notch
var notch = new createjs.Shape();
notch.x = c.x;
notch.y = c.y - size;
notch.graphics.f("red").drawPolyStar(0, 0, 12, 3, 2, 90);

// Where the wheel should land
var newNum = new createjs.Text("", "40px 'Open Sans'", "#fff")
  .set({
    x: c.x,
    y: c.y + size + 40,
    textAlign: "center"
  });


stage.addChild(c, notch, newNum);

// Mode. 0=stopped, 1=moving, 2=stopping
c.mode = 0;

// When clicked, cycle mode.
c.on("click", function (e) {
  if (c.mode == 0) {
    c.mode = 1;

    wheelspin.play();

  } else if (c.mode == 1) {
    c.mode = 2;
    wheelspin.pause();
    // Slow down. Find the end angle, and tween to it
    var num = Math.random() * segments | 0, // Choose a number,
      angleR = angle * 180 / Math.PI, // Angle in degrees
      adjusted = (c.rotation - 360), // Add to the current rotation
      numRotations = Math.ceil(adjusted / 360) * 360 - num * angleR - angleR / 2; // Find the final number.


    setTimeout(function() {  
    newNum.text = gameName[num]; // Show the end number
    },delayWheel);


    var audio = document.getElementById('mySong');
    audio.src = 'Sounds/' + gameName[num] + '.mp3';
    audio.load();
    
    setTimeout(function() {
      audio.play();
      audioTrue = "true"    
    }, delay);
    

  

    createjs.Tween.get(c)
      .to({
        rotation: numRotations
      }, 3000, createjs.Ease.cubicOut)
      .call(function () {
        c.mode = 0;
      });

      return audio
  }
});


function tick(event) {
  if (c.mode == 1) {
    c.rotation -= 10; // Rotate if mode 1
  }
  stage.update(event);
}