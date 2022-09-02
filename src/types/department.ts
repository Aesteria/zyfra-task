export type Department = {
  id: string;
  name: string;
  children?: Department[];
};
