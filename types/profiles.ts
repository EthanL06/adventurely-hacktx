export interface Profiles {
    stats: {
        hp: number;
        xp: number;
        str: number;
        int: number;
        level: number;
    }
}

export interface Profile {
    profile: Profiles | null;
    fetchProfile: () => void;
}