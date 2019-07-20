export interface GlobalContextObject {
  data: {
    token: string;
    apiEndpoint: string;
  };
  actions: {
    setUserData: ((token: string) => void);
  };
}
