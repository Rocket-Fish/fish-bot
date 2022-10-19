import { worldToRegion } from './world-to-region';

export enum Worlds {
    // NA worlds
    Adamantoise = 'Adamantoise',
    Cactuar = 'Cactuar',
    Faerie = 'Faerie',
    Gilgamesh = 'Gilgamesh',
    Jenova = 'Jenova',
    Midgardsormr = 'Midgardsormr',
    Sargatanas = 'Sargatanas',
    Siren = 'Siren',
    Balmung = 'Balmung',
    Brynhildr = 'Brynhildr',
    Coeurl = 'Coeurl',
    Diabolos = 'Diabolos',
    Goblin = 'Goblin',
    Malboro = 'Malboro',
    Mateus = 'Mateus',
    Zalera = 'Zalera',
    Behemoth = 'Behemoth',
    Excalibur = 'Excalibur',
    Exodus = 'Exodus',
    Famfrit = 'Famfrit',
    Hyperion = 'Hyperion',
    Lamia = 'Lamia',
    Leviathan = 'Leviathan',
    Ultros = 'Ultros',

    // EU
    Cerberus = 'Cerberus',
    Louisoix = 'Louisoix',
    Moogle = 'Moogle',
    Omega = 'Omega',
    Phantom = 'Phantom',
    Ragnarok = 'Ragnarok',
    Sagittarius = 'Sagittarius',
    Spriggan = 'Spriggan',
    Alpha = 'Alpha',
    Lich = 'Lich',
    Odin = 'Odin',
    Phoenix = 'Phoenix',
    Raiden = 'Raiden',
    Shiva = 'Shiva',
    Twintania = 'Twintania',
    Zodiark = 'Zodiark',

    // OC
    Bismarck = 'Bismarck',
    Ravana = 'Ravana',
    Sephirot = 'Sephirot',
    Sophia = 'Sophia',
    Zurvan = 'Zurvan',

    // JP
    Aegis = 'Aegis',
    Atomos = 'Atomos',
    Carbuncle = 'Carbuncle',
    Garuda = 'Garuda',
    Gungnir = 'Gungnir',
    Kujata = 'Kujata',
    Tonberry = 'Tonberry',
    Typhon = 'Typhon',
    Alexander = 'Alexander',
    Bahamut = 'Bahamut',
    Durandal = 'Durandal',
    Fenrir = 'Fenrir',
    Ifrit = 'Ifrit',
    Ridill = 'Ridill',
    Tiamat = 'Tiamat',
    Ultima = 'Ultima',
    Anima = 'Anima',
    Asura = 'Asura',
    Chocobo = 'Chocobo',
    Hades = 'Hades',
    Ixion = 'Ixion',
    Masamune = 'Masamune',
    Pandaemonium = 'Pandaemonium',
    Titan = 'Titan',
    Belias = 'Belias',
    Mandragora = 'Mandragora',
    Ramuh = 'Ramuh',
    Shinryu = 'Shinryu',
    Unicorn = 'Unicorn',
    Valefor = 'Valefor',
    Yojimbo = 'Yojimbo',
    Zeromus = 'Zeromus',
}

export type Character = {
    name: string;
    world: Worlds;
};

export function extractCharacter(nickname: string): Character {
    const nameParsed = nickname.match(/([\w']* [\w']*) \W(\w*)/);
    if (!nameParsed) {
        throw new CharacterNamingError('name does not fit format `First Last (World)`');
    }
    const [, name, world] = nameParsed;
    if (!name || !world) {
        throw new CharacterNamingError('name contains blank params');
    }
    if (!(world in Worlds)) {
        throw new CharacterNamingError('World is not supported');
    }

    return {
        name,
        world: world as Worlds, // I can do this here because type checked above
    };
}

export class CharacterNamingError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'CharacterNamingError';
    }
}
