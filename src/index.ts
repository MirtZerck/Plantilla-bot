import {
    ActivityType,
    Client,
    Events,
    GatewayIntentBits,
    PresenceUpdateStatus,
} from "discord.js";
import dotenv from "dotenv";
import { prefijo } from "./constants/prefix.js";
import { CommandManager } from "./events/commandHandler.js";
import { registerCommands } from "./commands/prefixCommands/register.js";
import { registerSlashCommands } from "./commands/slashCommands/registerSlashCommands.js";
import { onInteractionCreate } from "./commands/slashCommands/interactionCreate.js";

dotenv.config();

export const token = process.env.TOKEN!;
export const APPLICATION_ID = process.env.APPLICATION_ID!;

export const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildScheduledEvents,
        GatewayIntentBits.GuildWebhooks,
        GatewayIntentBits.GuildIntegrations,
        GatewayIntentBits.GuildMessageReactions,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.DirectMessages,
    ],
});

async function startBot() {
    try {
        // Inicializar el manejador de comandos por prefijo
        const commandManager = new CommandManager();
        await registerCommands(commandManager);
        await commandManager.initialize(client);

        // Registrar el manejador de comandos slash
        await onInteractionCreate(client);

        // Logear el bot
        await client.login(token);

        client.once(Events.ClientReady, async () => {
            console.log("El bot se ha iniciado como", client.user?.username);

            // Registrar comandos slash después de que el bot esté listo
            await registerSlashCommands();

            client.user?.setPresence({
                activities: [
                    {
                        name: `Mi prefijo es ${prefijo}`,
                        type: ActivityType.Playing,
                    },
                ],
                status: PresenceUpdateStatus.DoNotDisturb,
            });
        });
    } catch (error) {
        console.error("Error al iniciar el bot:", error);
        process.exit(1);
    }
}

startBot();
