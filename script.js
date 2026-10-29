/*
 * IDB Programming: A3 — a musical instrument
 *
 * All of the code for your instrument goes in this file. It's split into sections:
 *   settings — the "fixed" parts of your program
 *   state    — the parts of your program that change over time
 *   sound    — the Tone.js instruments and effects
 *   update   — updates the state every 100ms, if necessary
 *   use      — uses the state to make sound and shapes every 100ms, if necessary
 *   controls — what happens when the player uses the pointer
 *   setup    — starts everything
 *
 * The pointer events change the state. update() and use() each run every
 * 100ms, in a loop:
 *   1. update: change the state, e.g. based on time or on the pointer's movement
 *   2. use:    make sound and move shapes, based on the state
 *
 * Shapes come from shape.js: createShape() makes one, and its methods
 * (setPosition, setSize, setColour ...) change it.
 *
 * Tone.js documentation: https://tonejs.github.io/docs/15.1.22/
 */

import { createShape } from "./shape.js";

// ---------- Settings ----------
// Settings variables should contain all of the "fixed" parts of your programs
// For example: which notes you can play, how fast things move, the tempo.0
// Default background color:
document.body.style.backgroundColor = "hsl(41, 22%, 83%)";

// Randomizing the hue for shape 3
let hue3 = Math.random() * 360;

let windowX = 0; // Initalising X value for pointer so that it can be accessed everwhere
let windowY = 0; // Initialisngf Y value for pointer

// Bass and Synth melodies:
let bassNotes = "C3"; //["C4", "D4", "E4", "G4", "A4"];
let highNotes = "E4"; //["C3", "A2", "F2", "G2"];

// Initializing the object and carving the shapes for the face:
let bassShape = createShape();
let highShape = createShape();
let eyeLeft = createShape();
let eyeRight = createShape();
let mouthShape = createShape();

function duetShape() {
  bassShape.setSize(180, 180);
  bassShape.setPosition(0.35, 0.47);
  bassShape.setRoundedness(0.25);
  bassShape.setColour(25, 85, 55);

  highShape.setSize(150, 300);
  highShape.setPosition(0.55, 0.35);
  highShape.setRoundedness(0.2);
  highShape.setColour(263, 60, 77);

  eyeLeft.setSize(40);
  eyeLeft.setPosition(0.42, 0.52);
  eyeLeft.setRoundedness(1);
  eyeLeft.setColour(225, 65, 15);

  eyeRight.setSize(40);
  eyeRight.setPosition(0.62, 0.52);
  eyeRight.setColour(225, 65, 15);
  eyeRight.setRoundedness(1);

  mouthShape.setSize(60, 20);
  mouthShape.setPosition(0.52, 0.6);
  mouthShape.setColour(225, 65, 15);
  mouthShape.setRoundedness(0.4);
}

// ---------- State ----------
// State variables are the parts of your program that change over time.
// For example: where the pointer is, how fast it's moving, or whether a drone is on.

// -Old-  Keep for now incase we want to use it later:
let isHoveringShape3 = false;
let bassIndex = 0;
let synthIndex = 0;

// Initiating Pointer and storing its position:
let pointerX = 0;
let pointerY = 0;
let time = 0;
let distanceTravelled = 0;

// Remember the last pointer position:
let lastX = null;
let lastY = null;
let lastTime = null;

// Bass and High energy:
let bassEnergy = 0;
let highEnergy = 0;
let audioStart = false; // Audio only starts when pressed

// - OLD-   Changes the background color, keep for now incase:
function testBackgroundColor() {
  let backgroundHue = Math.random() * 360;
  document.body.style.backgroundColor = `hsl(${backgroundHue}, 100%, 25%, 0.3)`;
}

// Rotates the squares
/*function testRotation() {
  shape2.setRotation(shape2.rotation - 30);
  shape3.setRotation(shape3.rotation + 40);
  shape4.setRotation(shape4.rotation - 30);
}

// Changes size of the circles randomly
function testcircleSize() {
  let size = 40 - Math.random() * (55 - 65);
  shape1.setSize(size);
  shape5.setSize(size);
  shape6.setSize(size);
  shape7.setSize(size);
}*/

// ---------- Sound ----------
// Make the instruments and plug them into the speakers.
let bassSynth = new Tone.PolySynth(Tone.Synth).toDestination();
let highSynth = new Tone.PolySynth(Tone.Synth).toDestination();
bassSynth.volume.value = -1000; // Default value to mute
highSynth.volume.value = -1000;

// ---------- Update ----------
// Update the state. This is called every 100ms.
function update() {
  setTimeout(update, 100); // call update() again in 100 milliseconds

  // Adjusting energy realtive to pointer movement:
  bassEnergy -= 25;
  highEnergy -= 25;

  if (bassEnergy < 0) {
    bassEnergy = 0;
  }
  if (highEnergy < 0) {
    highEnergy = 0;
  }
}
// ---------- Use ----------
// Use the state to make sound and move shapes. This is called every 100ms.
function use() {
  setTimeout(use, 50); // call use() again in 100 milliseconds

  /*  if (isHoveringShape3 === true) {
    shape2.setRotation(shape2.rotation - 25);
    shape3.setRotation(shape3.rotation + 35);
    shape4.setRotation(shape4.rotation - 25);
    testcircleSize();
  }*/
  // Adusting shape sizes according to the energy:
  let width = 180 + bassEnergy / 10; // 0 energy, 180 pixels || 500 energy, 230 pixels || 1000 energy, 280 pixels
  let height = 300 + highEnergy / 10;
  bassShape.setSize(width, width);
  highShape.setSize(150, height);

  // Adjusting volume according to energy:
  if (bassEnergy <= 0) {
    bassSynth.volume.value = -1000;
  } else {
    bassSynth.volume.value = -60 + (bassEnergy / 1000) * 48; // 0 energy, silence || 250 energy, -48db || 500 energy, -36db || 1000 energy, -12db
  }
  if (highEnergy <= 0) {
    highSynth.volume.value = -1000;
  } else {
    highSynth.volume.value = -60 + (highEnergy / 1000) * 48;
  }
}

// ---------- Controls (Event Handlers) ----------
// Runs every time the pointer goes down: a click, a tap or a pen touch.
async function pointerDown(event) {
  // Browser only allows sound after the user has pressed something, Async waits for the audio to be loaded first
  await Tone.start(); // Await is a property of Async
  console.log("Pointer down at", event.clientX, event.clientY);

  // Plays bass notes on click
  /*bassSynth.triggerAttackRelease(bassNotes[bassKey], "8n");
  bassKey += 1;
  if (bassKey == bassNotes.length) {
    bassKey = 0;
  }*/
  if (windowX < 500) {
    //bassSynth.triggerAttackRelease(bassNotes, "8n");
  }
  if (windowX > 500) {
    //highSynth.triggerAttackRelease(highNotes, "8n");
  }
  // Play audio after press
  if (audioStart == false) {
    console.log("Starting audio");
    bassSynth.triggerAttack(bassNotes);
    highSynth.triggerAttack(highNotes);
    audioStart = true;
  }
}

function pointerUp() {}

function pointerMove(event) {
  // Real time pointer position
  pointerX = event.clientX;
  pointerY = event.clientY;
  time = event.timeStamp;

  // Pointer postion and calculation relative to the window
  //console.log("\n------------\n");
  windowX = Math.floor((pointerX / window.innerWidth) * 1000);
  windowY = Math.floor((pointerY / window.innerHeight) * 1000);

  // Calculate distance between pointers:
  // Making sure the inital position exits before calculating:
  if (lastX != null && lastY != null) {
    distanceTravelled = Math.hypot(pointerX - lastX, pointerY - lastY); // Math.hypot(dx, dy) gives the straight-line distance between two points
    //console.log(`Distance travelled: ${Math.ceil(distanceTravelled)}`); // Math.ceil because we want to incluce micro movements
  }

  //console.log(`Pointer X: ${Math.floor(pointerX)}\nPointer Y: ${Math.floor(pointerY)}`);
  console.log(`TimeStamp: ${Math.floor(time / 1000)}(s)\n`);

  lastX = pointerX;
  lastY = pointerY;

  // Calculating energy relative to where the pointer is:
  if (windowX < 500 && windowY < 500) {
    console.log("Top Left");
    bassEnergy += distanceTravelled;
    //bassSynth.triggerAttackRelease(bassNotes, "8n");
    //console.log("Bass Energy: " + bassEnergy);
    //console.log("High Energy: " + highEnergy);
  } else if (windowX > 500 && windowY < 500) {
    //console.log("Top Right");
    highEnergy += distanceTravelled;
    //highSynth.triggerAttackRelease(highNotes, "8n");
    //console.log("Bass Energy: " + bassEnergy);
    //console.log("High Energy: " + highEnergy);
  } else if (windowX < 500 && windowY > 500) {
    console.log("Bottom Left");
    bassEnergy += distanceTravelled;
    //highSynth.triggerAttackRelease(highNotes, "8n");
    //console.log("Bass Energy: " + bassEnergy);
    //console.log("High Energy: " + highEnergy);
  } else if (windowX > 500 && windowY > 500) {
    console.log("Bottom Right");
    highEnergy += distanceTravelled;
    //highSynth.triggerAttackRelease(highNotes, "8n");
    //console.log("Bass Energy: " + bassEnergy);
    //console.log("High Energy: " + highEnergy);
  }

  // Adjusting energy realtive to pointer movement:
  if (bassEnergy > 1000) {
    bassEnergy = 1000;
  }
  if (highEnergy > 1000) {
    highEnergy = 1000;
  }
}
// ---------- Setup ----------
// Setup is run once, at the start of the program. It sets everything up for us!
function setup() {
  duetShape(); // Calls the base shape first before updating it with energy:
  update(); // start the update loop
  use(); // start the use loop

  // Example: a shape near the middle of the window. Replace it with your own.

  // Put your event listener code here

  //window.addEventListener("pointerdown", testBackgroundColor);
  //window.addEventListener("pointerdown", testRotation);
  //window.addEventListener("pointerdown", testcircleSize);

  window.addEventListener("pointerdown", pointerDown);
  window.addEventListener("pointerup", pointerUp);
  window.addEventListener("pointermove", pointerMove);

  //shape1.element.addEventListener("pointerenter", pointerEnter1);
  //shape1.element.addEventListener("pointerleave", pointerLeave1);

  //shape2.element.addEventListener("pointerenter", pointerEnter2);
  //shape2.element.addEventListener("pointerleave", pointerLeave2);

  //shape3.element.addEventListener("pointerdown", pointerEnter3);   //Hover
  //shape3.element.addEventListener("pointerup", pointerLeave3);     //Hover

  //shape3.element.addEventListener("pointerenter", pointerEnter3);  //Hold
  //shape3.element.addEventListener("pointerleave", pointerLeave3);  //Hold

  //shape4.element.addEventListener("pointerenter", pointerEnter4);
  //shape4.element.addEventListener("pointerleave", pointerLeave4);

  //shape5.element.addEventListener("pointerenter", pointerEnter5);
  //shape5.element.addEventListener("pointerleave", pointerLeave5);

  //shape6.element.addEventListener("pointerenter", pointerEnter6);
  //shape6.element.addEventListener("pointerleave", pointerLeave6);

  //shape7.element.addEventListener("pointerenter", pointerEnter7);
  //shape7.element.addEventListener("pointerleave", pointerLeave7);
}

setup(); // Always remember to call setup()!
