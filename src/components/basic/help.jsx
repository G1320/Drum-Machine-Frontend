import React from 'react';

const Help = () => {
  return (
    <div>
      <h1>Welcome to the Project Help Center</h1>

      <h2>Table of Contents</h2>
      {/* <ol> */}
      <p>
        <a href="#getting-started">Getting Started</a>
      </p>
      <p>
        <a href="#sequencer-basics">Sequencer Basics</a>
      </p>
      <p>
        <a href="#song-mechanism">Song Mechanism</a>
      </p>
      <p>
        <a href="#options-and-settings">Options and Settings</a>
      </p>
      <p>
        <a href="#troubleshooting">Troubleshooting</a>
      </p>

      {/* </ol> */}

      <section id="getting-started">
        <h2>Getting Started</h2>

        <h3>Prerequisites</h3>
        <p>Ensure a smooth beginning by having the following:</p>
        <ul>
          <li>A modern web browser (e.g., Chrome, Firefox, Safari).</li>
          <li>A reliable internet connection.</li>
          <li>Speakers or headphones to hear the sounds and A desire to create music!</li>
        </ul>
      </section>

      <section id="sequencer-basics">
        <h2>Sequencer Basics</h2>

        <h3> Understanding Tracks and Steps</h3>
        <p>The sequencer is your musical canvas, featuring:</p>
        <ul>
          <li>Tracks - Representing individual sounds or instruments.</li>
          <li>
            Steps - A musical division of a bar or other musical measure into equal parts. For example,
            in a 4/4 time signature, a bar might be divided into 16 steps, each representing a sixteenth
            note. Use steps to program musical patterns by activating or deactivating specific steps.
            Each step corresponds to a moment in time where a sound or note can be triggered.
          </li>

          <li>
            Multiple tracks or layers of steps can be stacked together to create intricate and layered
            musical patterns. Each track represents a different instrument or sound, and their steps
            combine to produce a complete musical composition.
          </li>

          <li>
            The steps are triggered in a loop, allowing the sequence to repeat continuously. This looping
            feature is essential for creating repeating musical motifs and maintaining a consistent
            rhythm. The speed at which the steps progress is determined by the tempo of the sequencer,
            measured in beats per minute {'(BPM)'}. A higher BPM results in faster step progression,
            while a lower BPM slows it down.
          </li>
        </ul>
      </section>

      <section id="song-mechanism">
        <h2>Song Mechanism</h2>

        <p>
          The Song mechanism allows you to capture and revisit specific moments in your musical journey.
          It's like taking snapshots of your sequencer's settings and pattern.
        </p>
        <p>Here's how it works:</p>
        <ul>
          <li>
            Create a Song: Use the SAVE button to save the current state of your sequencer, including
            track configurations and patterns.
          </li>
          <li>
            Load a Song: Restore a saved state, instantly bringing back your sequencer to a previous
            setup.
          </li>
          <li>
            Manage Songs: Organize, delete, or overwrite saved Songs based on your evolving musical
            compositions.
          </li>
        </ul>
      </section>

      <section id="options-and-settings">
        <h2>Options and Settings</h2>

        <h3> Step Length</h3>
        <p>
          Choose the length of your sequence by selecting the number of steps. You can choose either 16
          or 32 steps to customize the duration of your musical patterns.
        </p>

        <h3> Navigation Controls</h3>
        <p>
          Use the arrow buttons to navigate between different kits. This allows you to explore and select
          different sound configurations and patterns quickly.
        </p>

        <h3> Clear Pattern</h3>
        <p>
          When you want to start fresh, use the CLR button to remove the current sequence pattern and
          reset the sequencers controls. It's a quick way to reset your canvas and begin a new creation.
        </p>

        <h3> BPM (Beats Per Minute)</h3>
        <p>
          Adjust the tempo of your sequence using the BPM slider. Move the slider left or right to set
          the desired beats per minute for your composition.
        </p>

        <h3> Volume Control</h3>
        <p>
          Manage the overall volume of your sequencer by using the VOL slider. Slide it to the left or
          right to achieve your desired level.
        </p>

        <h3> Sounds List</h3>
        <p>
          Explore and customize the sounds in your kit using the Sounds List. You can add or remove
          sounds from your kit, allowing you to tailor your sequencer however you prefer. When a sound in
          the sound list is included in the kit, it will be highlighted with a white border.
        </p>
      </section>

      <section id="troubleshooting">
        <h2>Troubleshooting</h2>
        <h3>Audio issues</h3>
        <p>
          If your unable to hear sounds when the cells are selected and the sequencer is running Please
          verify the following: If using a mobile device, make sure the mute switch is not in silent
          mode, and the volume is turned up. if using a computer, ensure the volume is turned up and the
          speakers or headphones are selected as your current output device in your main computer
          settings.
        </p>
      </section>
    </div>
  );
};

export default Help;
