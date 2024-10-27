const playSound = (soundFile: string) => {
  try {
    const audio = new Audio(soundFile);
    audio.play().catch((error) => {
      console.warn(`Failed to play sound: ${soundFile}`, error);
    });
  } catch (error) {
    console.warn(`Failed to create Audio object for: ${soundFile}`, error);
  }
};

export const playTurnChangeSound = () => {
  console.log("Turn change sound would play here");
};

export const playTimeRunningOutSound = () => {
  console.log("Time running out sound would play here");
};

export const playGameOverSound = () => {
  console.log("Game over sound would play here");
};
