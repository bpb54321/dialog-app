export interface UserContextObject {
  data: {
    token: string;
    apiEndpoint: string;
  };
  actions: {
    setUserData: ((token: string) => void);
  };
}
