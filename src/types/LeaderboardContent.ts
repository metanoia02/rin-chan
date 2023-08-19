export type LeaderboardContent = {
  itemPlural: string;
  users: LeaderboardRow[];
};

export type LeaderboardRow = {
  index: number;
  displayHex: string;
  avatarUrl: string;
  displayName: string;
  quantity: number;
};
