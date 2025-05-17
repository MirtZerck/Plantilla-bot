import { SlashCommandBuilder, CommandInteraction } from "discord.js";
import { SlashCommand, CommandCategory } from "../../types/command.js";

export const slashPingCommand: SlashCommand = {
    name: "ping",
    description: "Muestra la latencia del bot",
    category: CommandCategory.UTILITY,
    data: new SlashCommandBuilder()
        .setName("ping")
        .setDescription("Muestra la latencia del bot"),

    async execute(interaction: CommandInteraction) {
        try {
            // Defer la respuesta para poder medir la latencia
            await interaction.deferReply();

            // Calcular la latencia
            const latency = Date.now() - interaction.createdTimestamp;
            const apiLatency = Math.round(interaction.client.ws.ping);

            // Editar la respuesta con la información de latencia
            await interaction.editReply(
                `🏓 Pong!\nLatencia del bot: ${latency}ms\nLatencia de la API: ${apiLatency}ms`
            );
        } catch (error) {
            console.error("Error al ejecutar el comando ping:", error);
            // Si la interacción no ha sido respondida, responder con un error
            if (!interaction.replied && !interaction.deferred) {
                await interaction.reply({
                    content: "Ocurrió un error al ejecutar el comando. Por favor, intenta nuevamente más tarde.",
                    ephemeral: true
                }).catch(console.error);
            } else {
                // Si ya fue respondida, intentar editar la respuesta
                await interaction.editReply("Ocurrió un error al ejecutar el comando. Por favor, intenta nuevamente más tarde.")
                    .catch(console.error);
            }
        }
    }
}; 