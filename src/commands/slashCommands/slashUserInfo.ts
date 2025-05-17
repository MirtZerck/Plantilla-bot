import { SlashCommandBuilder, CommandInteraction, EmbedBuilder, CommandInteractionOptionResolver, GuildMember } from "discord.js";
import { SlashCommand, CommandCategory } from "../../types/command.js";
import { getDynamicColor } from "../utils/getDynamicColor.js";
import { CustomImageURLOptions } from "../../types/embeds.js";
import { convertDateToString } from "../utils/formatDate.js";
import { formatUserRoles } from "../utils/formatUserRoles.js";

export const slashUserInfoCommand: SlashCommand = {
    name: "userinfo",
    description: "Muestra información detallada de un usuario",
    category: CommandCategory.UTILITY,
    data: new SlashCommandBuilder()
        .setName("userinfo")
        .setDescription("Muestra información detallada de un usuario")
        .addUserOption(option =>
            option
                .setName("usuario")
                .setDescription("El usuario del que quieres ver la información")
                .setRequired(false)
        ),

    async execute(interaction: CommandInteraction) {
        try {
            // Obtener el usuario objetivo (el mencionado o el que ejecuta el comando)
            const targetUser = (interaction.options as CommandInteractionOptionResolver).getUser("usuario") || interaction.user;
            const member = interaction.guild?.members.cache.get(targetUser.id);

            if (!member) {
                await interaction.reply({
                    content: "No se pudo encontrar al usuario en el servidor.",
                    ephemeral: true
                });
                return;
            }

            const { user } = member;
            const { username, id } = user;
            const avatarURL = user.displayAvatarURL({ dynamic: true } as CustomImageURLOptions);
            const fechaRegistro = convertDateToString(user.createdAt);
            const fechaIngreso = convertDateToString(member.joinedAt!);

            const dynamicColor = getDynamicColor(member);
            const rolesDescription = formatUserRoles(member);

            const userInfoEmbed = new EmbedBuilder()
                .setAuthor({
                    name: (interaction.member as GuildMember)?.nickname ?? interaction.user.username,
                    iconURL: interaction.user.displayAvatarURL({ dynamic: true } as CustomImageURLOptions),
                })
                .setTitle(`Información de ${member.displayName}`)
                .setThumbnail(avatarURL)
                .setDescription(`Información del usuario en el servidor`)
                .addFields(
                    { name: "Registro", value: fechaRegistro, inline: true },
                    { name: "Ingreso", value: fechaIngreso, inline: true },
                    { name: "Roles", value: rolesDescription }
                )
                .setColor(dynamicColor)
                .setFooter({ text: `ID ${id}` })
                .setTimestamp();

            await interaction.reply({ embeds: [userInfoEmbed] });
        } catch (error) {
            console.error("Error al mostrar la información del usuario:", error);
            await interaction.reply({
                content: "Hubo un error al mostrar la información del usuario. Por favor, intenta de nuevo.",
                ephemeral: true
            }).catch(console.error);
        }
    }
};
