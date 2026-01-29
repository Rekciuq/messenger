export type Pagination = {
  page: number;
  limit: number;
  cursor?: { id: string };
};
