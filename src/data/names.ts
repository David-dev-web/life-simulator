import type { Gender } from '../types/game';

export const FIRST_NAMES: Record<string, Record<'male' | 'female' | 'diverse', string[]>> = {
  de: {
    male: ['Maximilian', 'Alexander', 'Leon', 'Paul', 'Elias', 'Ben', 'Noah', 'Jonas', 'Felix', 'Lukas', 'Julian', 'David', 'Tim', 'Moritz', 'Finn', 'Niklas', 'Anton', 'Henry', 'Lennard', 'Hannes'],
    female: ['Mia', 'Emma', 'Hannah', 'Sofia', 'Anna', 'Emilia', 'Lina', 'Marie', 'Lena', 'Mila', 'Clara', 'Leah', 'Laura', 'Amelie', 'Johanna', 'Charlotte', 'Sophie', 'Zoe', 'Greta', 'Nele'],
    diverse: ['Robin', 'Kim', 'Luca', 'Noa', 'Mika', 'Quinn', 'Sascha', 'Sam', 'Juri', 'Lou', 'Kai', 'Chris', 'Dominique', 'Toni', 'Alex']
  },
  us: {
    male: ['James', 'John', 'Robert', 'Michael', 'William', 'David', 'Richard', 'Joseph', 'Thomas', 'Charles', 'Christopher', 'Daniel', 'Matthew', 'Anthony', 'Mark', 'Donald', 'Steven', 'Andrew', 'Paul', 'Joshua'],
    female: ['Mary', 'Patricia', 'Jennifer', 'Linda', 'Elizabeth', 'Barbara', 'Susan', 'Jessica', 'Sarah', 'Karen', 'Lisa', 'Nancy', 'Betty', 'Margaret', 'Sandra', 'Ashley', 'Kimberly', 'Emily', 'Donna', 'Michelle'],
    diverse: ['Taylor', 'Jordan', 'Casey', 'Riley', 'Avery', 'Morgan', 'Cameron', 'Skyler', 'Dakota', 'Reese', 'Rowan', 'Sage', 'Emerson', 'Finley', 'Hayden']
  },
  ch: {
    male: ['Noah', 'Liam', 'Matteo', 'Leon', 'Gabriel', 'Elias', 'Luca', 'Julian', 'Oliver', 'Levin', 'Gian', 'Nino', 'Silvan', 'Reto', 'Beat'],
    female: ['Mia', 'Emma', 'Mila', 'Emilia', 'Lina', 'Elena', 'Alina', 'Chloé', 'Sina', 'Lara', 'Flurina', 'Seraina', 'Ladina', 'Chiara', 'Selina'],
    diverse: ['Luca', 'Kim', 'Robin', 'Noé', 'Sam', 'Bela', 'Yuri', 'Sascha', 'Janis', 'Alex']
  },
  at: {
    male: ['Paul', 'David', 'Jakob', 'Maximilian', 'Felix', 'Elias', 'Tobias', 'Simon', 'Valentin', 'Lukas', 'Florian', 'Moritz', 'Jonas', 'Julian', 'Markus'],
    female: ['Anna', 'Emma', 'Laura', 'Marie', 'Mia', 'Sophia', 'Johanna', 'Lena', 'Emilia', 'Katharina', 'Sarah', 'Hannah', 'Clara', 'Magdalena', 'Theresa'],
    diverse: ['Luca', 'Toni', 'Robin', 'Kim', 'Mika', 'Quinn', 'Niki', 'Alex', 'Sam', 'Chris']
  },
  jp: {
    male: ['Haruto', 'Ren', 'Yuto', 'Sota', 'Minato', 'Riku', 'Haruki', 'Kaito', 'Asahi', 'Taiga', 'Hiroshi', 'Kenji', 'Shinichi', 'Takumi', 'Daiki'],
    female: ['Himari', 'Hina', 'Yui', 'Koharu', 'Mei', 'Aoi', 'Ichika', 'Akari', 'Saki', 'Sakura', 'Hana', 'Rin', 'Ami', 'Misaki', 'Nanami'],
    diverse: ['Ren', 'Aoi', 'Hinata', 'Sora', 'Kaoru', 'Suki', 'Tsubasa', 'Izumi', 'Makoto', 'Chiaki']
  },
  gb: {
    male: ['Oliver', 'George', 'Harry', 'Noah', 'Jack', 'Charlie', 'Leo', 'Jacob', 'Freddie', 'Alfie', 'Archie', 'William', 'Theo', 'Henry', 'Arthur'],
    female: ['Olivia', 'Amelia', 'Isla', 'Ava', 'Mia', 'Isabella', 'Sophia', 'Grace', 'Lily', 'Freya', 'Emily', 'Ivy', 'Ella', 'Rosie', 'Florence'],
    diverse: ['Taylor', 'Jordan', 'Charlie', 'Alex', 'Riley', 'Morgan', 'Sam', 'Jamie', 'Ashton', 'Robin']
  },
  fr: {
    male: ['Gabriel', 'Léo', 'Raphaël', 'Arthur', 'Louis', 'Lucas', 'Adam', 'Jules', 'Hugo', 'Maël', 'Liam', 'Noah', 'Paul', 'Ethan', 'Nathan'],
    female: ['Emma', 'Jade', 'Louise', 'Alice', 'Chloé', 'Lina', 'Léa', 'Rose', 'Anna', 'Mila', 'Inès', 'Ambre', 'Julia', 'Mia', 'Léna'],
    diverse: ['Claude', 'Dominique', 'Camille', 'Lou', 'Noa', 'Maël', 'Morgan', 'Sacha', 'Alex', 'Alix']
  },
  br: {
    male: ['Miguel', 'Arthur', 'Gael', 'Heitor', 'Theo', 'Davi', 'Bernardo', 'Gabriel', 'Pedro', 'Lucas', 'Matheus', 'Enzo', 'Rafael', 'Felipe', 'Nicolas'],
    female: ['Helena', 'Alice', 'Laura', 'Manuela', 'Sophia', 'Isabella', 'Luiza', 'Heloísa', 'Cecília', 'Maitê', 'Mariana', 'Beatriz', 'Juliana', 'Camila', 'Larissa'],
    diverse: ['Alex', 'Cris', 'Manu', 'Duda', 'Sol', 'Kim', 'Robin', 'Sam', 'Ariel', 'Chris']
  },
  au: {
    male: ['Oliver', 'Noah', 'Jack', 'William', 'Leo', 'Lucas', 'Thomas', 'Henry', 'Charlie', 'James', 'Liam', 'Hunter', 'Harrison', 'Jackson', 'Mason'],
    female: ['Isla', 'Charlotte', 'Olivia', 'Amelia', 'Mia', 'Ava', 'Grace', 'Willow', 'Harper', 'Chloe', 'Ella', 'Matilda', 'Sophie', 'Evie', 'Ruby'],
    diverse: ['Taylor', 'Jordan', 'Casey', 'Riley', 'Avery', 'Morgan', 'Cameron', 'Skyler', 'Reese', 'Rowan']
  },
  es: {
    male: ['Martin', 'Hugo', 'Mateo', 'Leo', 'Lucas', 'Daniel', 'Alejandro', 'Pablo', 'Manuel', 'Álvaro', 'Adrian', 'David', 'Mario', 'Enrique', 'Sergio'],
    female: ['Lucia', 'Sofia', 'Martina', 'Maria', 'Julia', 'Paula', 'Valeria', 'Emma', 'Daniela', 'Carla', 'Alba', 'Noa', 'Alma', 'Claudia', 'Sara'],
    diverse: ['Alex', 'Cruz', 'Pau', 'Sol', 'Mar', 'Cris', 'Ariel', 'Nai', 'Dani', 'Yuri']
  }
};

export const LAST_NAMES: Record<string, string[]> = {
  de: ['Müller', 'Schmidt', 'Schneider', 'Fischer', 'Weber', 'Meyer', 'Wagner', 'Becker', 'Schulz', 'Hoffmann', 'Schäfer', 'Koch', 'Bauer', 'Richter', 'Klein', 'Wolf', 'Schröder', 'Neumann', 'Schwarz', 'Zimmermann'],
  us: ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin'],
  ch: ['Meier', 'Keller', 'Müller', 'Huber', 'Baumann', 'Frei', 'Schmid', 'Steiner', 'Brunner', 'Gerber', 'Moser', 'Widmer', 'Wyss', 'Bucher', 'Suter'],
  at: ['Gruber', 'Huber', 'Bauer', 'Wagner', 'Müller', 'Pichler', 'Steiner', 'Moser', 'Wallner', 'Mayer', 'Holzer', 'Lechner', 'Berger', 'Fuchs', 'Eder'],
  jp: ['Sato', 'Suzuki', 'Takahashi', 'Tanaka', 'Watanabe', 'Ito', 'Yamamoto', 'Nakamura', 'Kobayashi', 'Kato', 'Yoshida', 'Yamada', 'Sasaki', 'Yamaguchi', 'Matsumoto'],
  gb: ['Smith', 'Jones', 'Taylor', 'Brown', 'Williams', 'Wilson', 'Johnson', 'Davies', 'Patel', 'Robinson', 'Wright', 'Thompson', 'Evans', 'Walker', 'White'],
  fr: ['Martin', 'Bernard', 'Thomas', 'Petit', 'Robert', 'Richard', 'Durand', 'Dubois', 'Moreau', 'Laurent', 'Simon', 'Michel', 'Lefebvre', 'Leroy', 'Roux'],
  br: ['Silva', 'Santos', 'Oliveira', 'Souza', 'Rodrigues', 'Ferreira', 'Alves', 'Pereira', 'Lima', 'Gomes', 'Costa', 'Ribeiro', 'Martins', 'Carvalho', 'Almeida'],
  au: ['Smith', 'Jones', 'Williams', 'Brown', 'Wilson', 'Taylor', 'Johnson', 'White', 'Martin', 'Anderson', 'Thompson', 'Nguyen', 'Thomas', 'Walker', 'Harris'],
  es: ['García', 'Rodríguez', 'González', 'Fernández', 'López', 'Martínez', 'Sánchez', 'Pérez', 'Gómez', 'Martín', 'Jiménez', 'Ruiz', 'Hernández', 'Díaz', 'Moreno']
};

export const getRandomName = (countryId: string, gender: Gender): { firstName: string; lastName: string } => {
  const cId = FIRST_NAMES[countryId] ? countryId : 'de';
  const firstPool = FIRST_NAMES[cId][gender] || FIRST_NAMES[cId]['male'];
  const lastPool = LAST_NAMES[cId] || LAST_NAMES['de'];

  const firstName = firstPool[Math.floor(Math.random() * firstPool.length)];
  const lastName = lastPool[Math.floor(Math.random() * lastPool.length)];

  return { firstName, lastName };
};
