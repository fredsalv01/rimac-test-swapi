export function DateTimeFormat(): string {
    const fecha = new Date();
    const opciones: Intl.DateTimeFormatOptions = { year: 'numeric', month: '2-digit', day: '2-digit' };
    const fechaFormateada = new Intl.DateTimeFormat('es-PE', opciones).format(fecha);
    return fechaFormateada;
}