import seedRandom from 'seedrandom';

export const createGUID = (guidSeed) => {
    const seededRng = seedRandom(guidSeed ? guidSeed : 'guid_seed');
    const s4 = () => {
        return Math.floor((1 + (guidSeed ? seededRng() : Math.random())) * 0x10000)
            .toString(16)
            .substring(1);
    };
    return `${s4()}${s4()}-${s4()}-${s4()}-${s4()}-${s4()}${s4()}${s4()}`;
};
