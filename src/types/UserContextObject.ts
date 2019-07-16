export interface UserContextObject {
  token: string;
  actions: {
    setUserData: ((token: string) => void);
  };
}

export interface UserData {
  token: string;
}
