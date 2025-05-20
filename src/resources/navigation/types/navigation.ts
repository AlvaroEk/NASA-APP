export type RootStackParamList = {
  Home: undefined;
  Detail: {
    imageUrl: string;
    title: string;
    description: string;
  };
  AsteroidDetail: {
    asteroid: any;
  };
};
