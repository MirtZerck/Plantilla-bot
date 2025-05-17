import { CommandManager } from "../../events/commandHandler.js";
import { PrefixCommand } from "../../types/command.js";

// Importar comandos por prefijo
import { userInfoCommand } from "./userInfo.js";
import { userAvatarCommand } from "./avatar.js";
import { pingCommand } from "./ping.js";

export async function registerCommands(commandManager: CommandManager): Promise<void> {
    // Registrar comandos por prefijo
    const prefixCommands: PrefixCommand[] = [
        userInfoCommand,
        userAvatarCommand,
        pingCommand,
    ];

    prefixCommands.forEach(cmd => commandManager.registerPrefixCommand(cmd));

} 