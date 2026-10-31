export const cx = (...a: (string | false | undefined | null)[]) => a.filter(Boolean).join(' ')

export const tableWrap = 'overflow-x-auto rounded-lg border border-surface-2'
export const th = 'bg-surface px-4 py-3 text-left text-sm font-semibold text-muted whitespace-nowrap'
export const td = 'px-4 py-3 text-[15px] border-t border-surface-2 align-middle'
