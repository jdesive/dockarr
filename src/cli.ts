#!/usr/bin/env node

import {Command} from "commander";
import * as Path from "path";
import * as os from "os";
import {version} from '../package.json';
import {Dockarr} from "./Dockarr";

export const DOCKARR_VERSION = version;
export const dockarrDir = Path.join(os.homedir(), ".dockarr");

export const dockarr = new Dockarr();

async function run() {
    const dockarrCommand = new Command()

    dockarrCommand
        .name('dockarr')
        .description(
            'CLI for managing your dockarr stack of *arr applications, plex media server, and various other' +
            'services that make up a HTPC (Home Theater Personal Computer)'
        )
        .version(DOCKARR_VERSION);

    // Create
    dockarrCommand.command('create')
        .description('Creates a deployment from console input')
        .argument('<name>', 'The Name for the Dockarr deployment')
        .option('-s, --services [services]', 'Comma seperated list of services to deploy')
        .option('-p, --plex-claim [plexClaim]', 'Plex TV claim (https://plex.tv/claim)')
        .option('--docker-sock [dockerSockFile]', 'docker.sock location', '/var/run/docker.sock')
        .option('--guid [guid]', 'Group ID', '1000')
        .option('--puid [puid]', 'User ID', '1000')
        .option('--timezone [timezone]', 'Timezone', 'America/Chicago')
        .option('--advertised-ip [advertisedIp]', 'Plex Advertised IP (default: auto)')
        .option('--vpn [vpn]', 'Deluge VPN Enabled', "true")
        .option('--vpn-user [vpnUser]', 'Deluge VPN User', "anonymous")
        .option('--vpn-pass [vpnPass]', 'Deluge VPN Password', "anonymous")
        .option('--vpn-prov [vpnProv]', 'Deluge VPN Provider', "pia")
        .option('--vpn-client [vpnClient]', 'Deluge VPN Client', "openvpn")
        .option('--vpn-network [vpnNetwork]', 'Deluge VPN Network', "192.168.1.0/24")
        .requiredOption('-c, --config-dir [configDir]', 'Configuration file parent directory full path')
        .requiredOption('-d, --data-dir [dataDir]', 'Data directory full path where the media libraries are located')
        .requiredOption('-w, --work-dir [workDir]', 'Working directory where files are temporarily stored')
        .action(async (name, options) => dockarr.createStack(name, options));

    dockarrCommand.command("start")
        .description("Start all or specific containers in a deployment")
        .argument('<name>', "Name of the dockarr stack to start")
        .option('-s, --service [service]', "Only stop one or more service in the deployment")
        .action(async (name, options) => dockarr.startStack(name, options));

    dockarrCommand.command("list")
        .description("List all deployments")
        .action(async () => dockarr.listStacks());

    dockarrCommand.command("stop")
        .description("Stop all or specific containers in a deployment")
        .argument('<name>', 'Name of Dockarr deployment to stop')
        .option('-s, --service [service]', "Only stop one or more service in the deployment")
        .action(async (name, options) => dockarr.stopStack(name, options));

    dockarrCommand.command("remove")
        .description("Remove all containers in a deployment")
        .argument('<name>', 'Name of Dockarr deployment to remove')
        .action(async (name) => dockarr.deleteStack(name));

    dockarrCommand.command("restart")
        .description("Restart all or specific containers in a deployment")
        .argument('<name>', 'Name of Dockarr deployment to restart')
        .option('-s, --service [service]', "Only restart one or more service in the deployment")
        .action(async (name, options) => dockarr.restartStack(name, options));

    dockarrCommand.command("update")
        .description("Update all or specific containers in a deployment")
        .argument('<name>', 'Name of Dockarr deployment to update')
        .option('-s, --service [service]', "Only update one or more service in the deployment")
        .action(async (name, options) => dockarr.updateStack(name, options));

    dockarrCommand.command("install")
        .description('Install software related to HTPC')
        .argument('<package>')
        .action(async (packageStr) => dockarr.install(packageStr));

    dockarrCommand.command("get-api-keys")
        .description('Get the *arr api keys of the installed services')
        .action(async () => dockarr.getApiKeys());

    dockarrCommand
        .parse()
}

run()