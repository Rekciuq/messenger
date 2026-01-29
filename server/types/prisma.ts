/* eslint-disable @typescript-eslint/no-explicit-any */

export type ExtractUpdateData<T> = T extends { update: (...args: any) => any }
  ? Parameters<T['update']>[0]['data']
  : T extends (...args: any) => any
  ? Parameters<T>[0]['data']
  : never;