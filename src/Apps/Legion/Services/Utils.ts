export const getRandomColor = () => {
    // Number between 1-5
    const colorNumber = Math.floor(Math.random() * 5);
    const colors = ['red', 'blue', 'yellow', 'green', 'orange'];
    return colors[colorNumber];
};
