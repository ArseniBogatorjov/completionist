export interface ScavengerAchievement {
  apiname: string;
  is_missable: boolean;
}

export interface ScavengerGame {
  gameName: string;
  achievements: ScavengerAchievement[];
}
