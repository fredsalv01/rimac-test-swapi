
import { DateTime } from 'luxon';

export function getPeruDateTimeISO(): string {
    return DateTime.now().setZone('America/Lima').toISO() ?? '';
}

export function formatPeruDate(): string {
    return DateTime.now().setZone('America/Lima').toFormat('dd/MM/yyyy HH:mm:ss') ?? '';
}

export function formatPeruDateTime(date: string): string {
    return DateTime.fromISO(date, { zone: 'America/Lima' }).toFormat('dd/MM/yyyy HH:mm:ss') ?? '';
}