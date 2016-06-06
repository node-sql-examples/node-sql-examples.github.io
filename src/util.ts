export function assign<T, U extends T>(obj:U, assignments:T):U {
    return (Object as any).assign({}, obj, assignments)
}

export function assignDict<T>(d:{[key:string]:T}, key:string, t:T):{[key:string]:T} {
    return (Object as any).assign({}, d, {[key]: t});
}