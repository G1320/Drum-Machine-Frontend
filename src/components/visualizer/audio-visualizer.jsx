import React, { useEffect, useRef } from 'react';
import '../../assets/styles/components/visualizer/audio-visualizer.scss';
import * as Tone from 'tone';
import p5 from 'p5';

const AudioVisualizer = () => {
  const canvasRef = useRef(null);

  const resizeCanvas = (p) => {
    const canvasParent = canvasRef.current;
    if (canvasParent) {
      const canvasWidth = canvasParent.offsetWidth;
      const canvasHeight = canvasParent.offsetHeight;
      p.resizeCanvas(canvasWidth, canvasHeight);
    }
  };
  useEffect(() => {
    // Create a new p5 instance
    const sketch = new p5((p) => {
      window.addEventListener('resize', () => resizeCanvas(sketch));
      window.addEventListener('orientationchange', () => resizeCanvas(sketch));
      let analyzer;

      p.setup = () => {
        // Create a canvas and attach it to the canvasRef
        const canvasParent = canvasRef.current;
        const canvasWidth = canvasParent.offsetWidth;
        const canvasHeight = canvasParent.offsetHeight;
        const canvas = p.createCanvas(canvasWidth, canvasHeight);
        canvas.parent(canvasParent);

        // Create an audio analyzer
        analyzer = new Tone.Analyser('waveform', 1024);
        analyzer.smoothing = 0.8;
        Tone.Destination.connect(analyzer);
      };

      p.draw = () => {
        // Clear the canvas
        p.background(0);

        // Get the waveform data from the analyzer
        const waveform = analyzer.getValue();

        // Set the stroke color and weight
        p.stroke(255);
        p.strokeWeight(2);
        p.noFill();
        // Draw the waveform
        p.beginShape();
        for (let i = 0; i < waveform.length; i++) {
          const x = p.map(i, 0, waveform.length, 0, p.width);
          const y = p.map(waveform[i], -1, 1, p.height, 0);
          p.vertex(x, y);
        }
        p.endShape();
      };
    });

    // Clean up the p5 instance and remove the event listener when the component unmounts
    return () => {
      sketch.remove();
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('orientationchange', resizeCanvas);
    };
  }, []);

  return <div className="audio-visualizer" ref={canvasRef}></div>;
};

export default AudioVisualizer;
