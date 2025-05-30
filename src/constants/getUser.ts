import { Message, GuildMember } from "discord.js";

// Función para buscar un miembro en el servidor basándose en un filtro
export const getMemberByFilter = (message: Message, filter: string): GuildMember | null => {
    const filtro = filter.toLowerCase().trim();

    // Verifica primero si el filtro es un ID numérico válido
    if (!isNaN(Number(filtro)) && filtro.length > 16) {
        // Los ID de Discord tienen 17 o 18 dígitos
        return message.guild?.members.cache.get(filtro) || null;
    }

    // Si no es un ID, busca por nombre de usuario o apodo
    return message.guild?.members.cache.find((member) => {
        const displayName = member.displayName.toLowerCase();
        const username = member.user.username.toLowerCase();
        return displayName.includes(filtro) || username.includes(filtro);
    }) || null;
};
