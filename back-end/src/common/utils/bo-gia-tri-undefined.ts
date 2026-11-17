export function boGiaTriUndefined<T extends Object>(duLieu: T): Partial<T> {
    return Object.fromEntries(Object.entries(duLieu).filter(([, giaTri]) => giaTri !== undefined)) as Partial<T>
}