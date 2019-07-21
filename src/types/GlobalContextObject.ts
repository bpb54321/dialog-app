import Role from "./Role";

export interface GlobalContextObject {
  data: {
    token: string;
    apiEndpoint: string;
    chosenRole: Role;
    speechRecognition: any;
  };
  actions: {
    setUserData: ((token: string) => void);
    setChosenRole: (role: Role) => void;
  };
}
