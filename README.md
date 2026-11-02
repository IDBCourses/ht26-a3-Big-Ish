# DUET

**Play it here:** https://idbcourses.github.io/ht26-a3-Big-Ish/

**Name:** Ishkanda Mishra

**MAU ID:** AS7432

DUET is a mouse controlled musical creature. Movement on the left introduces bass progression, while movement on the right introduces a melody. By alternating between the two sides, you can make the creature react!

## How to play

Click once to enable audio, then move your mouse or trackpad to build energy. The creature will be inanimate until you start moving.

The controls use the left and right halves of the **whole window**. You can move anywhere within either half; you do not need to hover over or click the creature itself.

| When you                      | The sound                                                              | The creature                                                                                    |
| ----------------------------- | ---------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------- |
| Click or tap to turn on audio | Starts the bass and melody from the beginning.                         | Continues responding to movement.                                                               |
| Move on the left half         | Builds bass energy and brings the low chords into the mix.             | The bass body and inner outline grow and the inner outline rotates.                             |
| Move on the right half        | Builds high energy and brings the melody into the mix.                 | The high body and outer outline grow and the outer outline rotates.                             |
| Alternate between both halves | Lets the two voices overlap as their separate energies build and fade. | Both parts of the creature become active. The eyes, highlights and mouth respond to the energy. |
| Hold the pointer still        | Gradually fades into silence as energy drains.                         | Gradually shrinks toward its resting sizes, and the outlines slow down.                         |
| Click or tap again            | Toggles the audio on or off                                            | The creature still responds to mouse movement, even with the audio turned off.                  |

An example gesture would be to build the chords on the left, sweep across to reveal the melody, then alternate sides to blend the audio. There are no keyboard controls.

## Background colour

The background responds to the combined energy from both sides. Above 400, it starts choosing random colours. More energy shortens the interval between changes, reaching about 0.65 seconds at maximum energy. When the combined energy falls to 400 or below, the background returns to its resting red.

## The music

The approximately eight-second loop has two parts:

- **Low voice:** Four chords, changing every two seconds.
- **High voice:** A 32-note melody, progressing every quarter second.

Both voices use Tone.js `PolySynth` instruments. Each chord is an array of notes played together; the melody plays one note at a time, while the bass plays four at a time.

## Translating pointer movement to energy

The program measures the distance between pointer positions. It skips the first distance calculation until a previous position exists, preventing a false initial burst.

Movement adds energy to the corresponding side. Each energy value is capped at 1000 and decreases over time, so earlier movement continues to affect the sound and visuals after the pointer stops. Both eyes and their highlights respond to the combined energy; the mouth responds to both voices.

The code uses the settings/state and setup/update/use structure:

- `setup()` initializes the creature, starts the repeating updates and registers the pointer handlers.
- `pointerMove()` measures movement and builds energy.
- `pointerDown()` toggles playback and resets the musical sequence when starting.
- `update()` drains the stored energy.
- `use()` applies energy to the shapes and volumes, and calls `playAudio()` and `changeBG()`.
- `playAudio()` checks the note timings, plays the next chord or melody note, and advances the indexes.
- `changeBG()` uses the combined energy to choose the background colour and the interval before the next change. `bgTime` stores the target time for that next change.

Both `update()` and `use()` repeat approximately every 25 milliseconds. Musical notes use separate timings, so that refresh interval is not the spacing between notes.

## Files

| File         | Purpose                                                                                      |
| ------------ | -------------------------------------------------------------------------------------------- |
| `script.js`  | Instrument settings, note arrays, energy, pointer controls, audio timing and visual changes. |
| `shape.js`   | Supplied shape objects and methods for changing their appearance.                            |
| `style.css`  | Base page and shape styling.                                                                 |
| `index.html` | Loads the stylesheet, Tone.js and the instrument script.                                     |

The project uses vanilla JavaScript, HTML, CSS, Tone.js and the supplied `shape.js`.

## Layout limitation

The prototype is designed for a mouse or trackpad in a large desktop window. Shape positions are calculated from the window dimensions when the page loads, while their sizes use pixel values. The layout does not automatically adjust after resizing. Choose the window size before loading, and refresh after changing it.

## References

- [Tone.js 15.1.22 documentation](https://tonejs.github.io/docs/15.1.22/)
- [PointerEvent documentation](https://developer.mozilla.org/en-US/docs/Web/API/PointerEvent)
