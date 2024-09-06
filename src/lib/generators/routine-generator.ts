export type RoutinePredicate = () => boolean;
export type RoutineGenerator<T = unknown> = Generator<RoutinePredicate, T, unknown>;