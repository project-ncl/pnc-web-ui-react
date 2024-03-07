export type Ok<V> = {
  success: true;
  value: V;
};

export type Error<E> = {
  success: false;
  error: E;
};

export type Result<V, E> = Ok<V> | Error<E>;
