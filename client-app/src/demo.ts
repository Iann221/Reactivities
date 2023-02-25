export interface Duck {
    name: string;
    numLegs: number;
    makeSound: (sound: string) => void;
}

let data: number | string = 42

data = 'string'

const duck1: Duck = {
    name: 'huey',
    numLegs: 2,
    makeSound: (sound: any) => console.log(sound)
}

const duck2: Duck = {
    name: 'luey',
    numLegs: 2,
    makeSound: (sound: any) => console.log(sound)
}

duck1.makeSound!('quack');

export const ducks = [duck1,duck2];