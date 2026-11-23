export function boGiaTriUndefined<T extends object>(duLieu: T): Partial<T> {
    return Object.fromEntries(Object.entries(duLieu).filter(([, giaTri]) => giaTri !== undefined)) as Partial<T>
}