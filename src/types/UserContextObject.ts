export interface UserContextObject {
  userData: UserData;
  setUserData: ((token: string) => void);
}

export interface UserData {
  token: string;
}
