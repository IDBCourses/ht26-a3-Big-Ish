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
// For example: which notes you can play, how fast things move, the tempo.
document.body.style.backgroundColor = "turquoise";
let hue3 = Math.random() * 360;
const note = "C3"; // the note played when the pointer goes down
let bassNotes = ["C3", "A2", "F2", "G2"];

// Creating basic shapes from the object
const shape1 = createShape();
const shape2 = createShape();
const shape3 = createShape();
const shape4 = createShape();
const shape5 = createShape();

// Carving the shapes
function testShape() {
  shape1.setPosition(0.5, 0.3);
  shape1.setColour(1, 75, 50);
  shape1.setSize(50);

  shape2.setPosition(0.5, 0.4);
  shape2.setColour(50, 100, 60);
  shape2.setSize(50);
  shape2.setRoundedness(0.3);

  shape3.setPosition(0.5, 0.5);
  shape3.setColour(255, 100, 50);
  shape3.setSize(50);
  shape3.setRoundedness(0);
  shape3.setRotation(45);

  shape4.setPosition(0.5, 0.6);
  shape4.setColour(50, 100, 60);
  shape4.setSize(50);
  shape4.setRoundedness(0.3);

  shape5.setPosition(0.5, 0.7);
  shape5.setColour(1, 75, 50);
  shape5.setSize(50);
}

// ---------- State ----------
// State variables are the parts of your program that change over time.
// For example: where the pointer is, how fast it's moving, or whether a drone is on.

let isHoldingShape3 = false;

// Changes the background color
function testBackgroundColor() {
  let backgroundHue = Math.random() * 360;
  document.body.style.backgroundColor = `hsl(${backgroundHue}, 100%, 25%, 0.3)`;
}
// Rotates the squares
function testRotation() {
  shape2.setRotation(shape2.rotation - 30);
  shape3.setRotation(shape3.rotation + 40);
  shape4.setRotation(shape4.rotation - 30);
}

// Changes size of the circles randomly
function testcircleSize() {
  let size = 40 - Math.random() * (55 - 65);
  shape1.setSize(size);
  shape5.setSize(size);
}

// ---------- Sound ----------
// Make the instruments and plug them into the speakers.
const synth = new Tone.PolySynth(Tone.Synth).toDestination(); // can play several notes at once

// ---------- Update ----------
// Update the state. This is called every 100ms.
function update() {
  setTimeout(update, 100); // call update() again in 100 milliseconds
}

// ---------- Use ----------
// Use the state to make sound and move shapes. This is called every 100ms.
function use() {
  setTimeout(use, 100); // call use() again in 100 milliseconds

  if (isHoldingShape3 === true) {
    shape2.setRotation(shape2.rotation - 25);
    shape3.setRotation(shape3.rotation + 35);
    shape4.setRotation(shape4.rotation - 25);
    //testcircleSize();
  }
}

// ---------- Controls (Event Handlers) ----------
// Runs every time the pointer goes down: a click, a tap or a pen touch.
function pointerDown(event) {
  Tone.start(); // browsers only allow sound after the player has pressed something

  console.log("Pointer down at", event.clientX, event.clientY);
  synth.triggerAttackRelease("C4", "8n");
  // Plays bass notes on click
  /*for (let i = 0; i < bassNotes.length; i++) {
    synth.triggerAttackRelease(bassNotes[i], "8n"); // play the note for an eighth note
  }
  */
}

function pointerEnter1(event) {
  shape1.setColour(1, 75, 25);
  synth.triggerAttackRelease("C4", "8n");
}
function pointerLeave1(event) {
  shape1.setColour(1, 75, 50);
}

function pointerEnter2(event) {
  shape2.setColour(50, 100, 25);
  synth.triggerAttackRelease("D4", "8n");
}
function pointerLeave2(event) {
  shape2.setColour(50, 100, 50);
}

function pointerEnter3(event) {
  isHoldingShape3 = true;
  shape3.setColour(hue3, 100, 25);
  synth.triggerAttack("E4");
}
function pointerLeave3(event) {
  isHoldingShape3 = false;
  shape3.setColour(hue3, 100, 50);
  synth.triggerRelease("E4");
}

function pointerEnter4(event) {
  shape4.setColour(50, 100, 25);
  synth.triggerAttackRelease("G4", "8n");
}
function pointerLeave4(event) {
  shape4.setColour(50, 100, 50);
}

function pointerEnter5(event) {
  shape5.setColour(1, 75, 25);
  synth.triggerAttackRelease("A4", "8n");
}
function pointerLeave5(event) {
  shape5.setColour(1, 75, 50);
}

function pointerMove(event) {
  event.clientX;
  event.clientY;
  event.timeStamp;
}

// ---------- Setup ----------
// Setup is run once, at the start of the program. It sets everything up for us!
function setup() {
  update(); // start the update loop
  use(); // start the use loop

  // Example: a shape near the middle of the window. Replace it with your own.
  testShape();

  // Put your event listener code here
  window.addEventListener("pointerdown", pointerDown);

  window.addEventListener("pointerdown", testBackgroundColor);
  window.addEventListener("pointerdown", testRotation);
  //window.addEventListener("pointerdown", testcircleSize);

  shape1.element.addEventListener("pointerenter", pointerEnter1);
  shape1.element.addEventListener("pointerleave", pointerLeave1);

  shape2.element.addEventListener("pointerenter", pointerEnter2);
  shape2.element.addEventListener("pointerleave", pointerLeave2);

  //shape3.element.addEventListener("pointerdown", pointerEnter3);
  //shape3.element.addEventListener("pointerup", pointerLeave3);
  shape3.element.addEventListener("pointerenter", pointerEnter3);
  shape3.element.addEventListener("pointerleave", pointerLeave3);

  shape4.element.addEventListener("pointerenter", pointerEnter4);
  shape4.element.addEventListener("pointerleave", pointerLeave4);

  shape5.element.addEventListener("pointerenter", pointerEnter5);
  shape5.element.addEventListener("pointerleave", pointerLeave5);

  window.addEventListener("pointermove", pointerMove);
}

setup(); // Always remember to call setup()!
