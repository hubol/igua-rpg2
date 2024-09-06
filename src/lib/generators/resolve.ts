type Executor = (resolve: () => void) => unknown

export function resolve(executor: Executor) {
    let resolved = false;
    executor(() => resolved = true);
    return () => resolved;
}