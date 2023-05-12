#!/usr/bin/env node

import chalk from 'chalk'
import {Command} from "commander";
import * as compose from "docker-compose";
import * as readline from 'node:readline/promises';
import * as YAML from 'yaml';
import {stdin as input, stdout as output} from 'node:process';
import {COMPOSE_FILES, DockerComposeFile} from "./compose-files.models";
import * as fs from 'fs';
import * as Path from "path";
import * as os from "os";
import {execSync} from "child_process";
import {version} from '../package.json';
import axios from 'axios';

export const DOCKARR_VERSION = version;
export const dockarrDir = Path.join(os.homedir(), ".dockarr");

function isComposeSelected(name: string, services: DockerComposeFile[]) {
    for (let service of services) {
        if (service.name == name) return true;
    }
    return false;
}

function getIPAddress() {
    var interfaces = require('os').networkInterfaces();
    for (var devName in interfaces) {
        var iface = interfaces[devName];

        for (var i = 0; i < iface.length; i++) {
            if (iface) {
                var alias = iface[i];
                if (alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal)
                    return alias.address;
            }

        }
    }
    return '0.0.0.0';
}

async function createStack(name: string, options: any) {
    await compose.version().then(str => console.log(chalk.blue('Docker Version: ') + str.data.version));
    let servicesToDeploy: DockerComposeFile[] = [];

    if (options.services === undefined) {
        console.log(chalk.blue('What services would you like deployed?'));
        COMPOSE_FILES.forEach((file, index) => {
            console.log(chalk.bgGray((index + 1) + ". " + file.name));
        });
        console.log(chalk.blueBright('Select as many as you want, value should be comma seperated list of indexes.'));

        // Take user input
        const rl = readline.createInterface({input, output});
        const composeFileSelectionInput = await rl.question('Selection> ');
        rl.close()
        // From user input, get a list of all compose files to be deployed
        const selectionArray = composeFileSelectionInput.split(',');
        for (let string of selectionArray) {
            if (!isNaN(Number(string))) { // If string is actually number
                if ((COMPOSE_FILES.length) >= Number(string)) {
                    console.log(string)
                    servicesToDeploy.push(COMPOSE_FILES[Number(string) - 1]);
                }
            } else {
                console.log(chalk.red(string + ' is not a number'))
            }
        }
    } else {
        const selectionArray = options.services.split(',');
        for (let string of selectionArray) {
            if (!isNaN(Number(string))) { // If string is actually number
                if ((COMPOSE_FILES.length) >= Number(string)) {
                    servicesToDeploy.push(COMPOSE_FILES[Number(string) - 1]);
                }
            } else {
                console.log(chalk.red(string + ' is not a number'));
            }
        }
    }

    let plexClaimInput = options.plexClaim;
    let plexAdvertisedIp = "";
    if (options.plexClaim === undefined && isComposeSelected("Plex", servicesToDeploy)) {
        // Ask for Plex Claim
        console.log(chalk.blueBright('You can get your plex claim at https://plex.tv/claim'));
        const rl = readline.createInterface({input, output});
        plexClaimInput = await rl.question('Plex Claim> ');
        rl.close();
        plexAdvertisedIp = options.advertisedIp;

        if (options.advertisedIp === undefined || options.advertisedIp === 'auto') {
            console.log(chalk.blue('Automatically grabbing your IP...'));
            plexAdvertisedIp = "http://" + getIPAddress() + ":32400";
        }
    }

    // Generate docker-compose manifest
    console.log(chalk.blue('Generating the docker-compose manifest...'));
    let composeManifest = new Map();
    for (let dockerComposeFile of servicesToDeploy) {
        let fileContentStr = dockerComposeFile.file;

        // Hmmmmmm, not the best eh?
        fileContentStr = fileContentStr.replace(/\$ConfigDir/g, options.configDir);
        fileContentStr = fileContentStr.replace(/\$WorkDir/g, options.workDir);
        fileContentStr = fileContentStr.replace(/\$DataDir/g, options.dataDir);
        fileContentStr = fileContentStr.replace(/\$PlexClaim/g, plexClaimInput);
        fileContentStr = fileContentStr.replace(/\$DockerSock/g, options.dockerSock);
        fileContentStr = fileContentStr.replace(/\$GUID/g, options.guid);
        fileContentStr = fileContentStr.replace(/\$PUID/g, options.puid);
        fileContentStr = fileContentStr.replace(/\$Timezone/g, options.timezone);
        fileContentStr = fileContentStr.replace(/\$PlexIp/g, plexAdvertisedIp);
        fileContentStr = fileContentStr.replace(/\$VPNEnabled/g, options.vpn);
        fileContentStr = fileContentStr.replace(/\$VPNUser/g, options.vpnUser);
        fileContentStr = fileContentStr.replace(/\$VPNPass/g, options.vpnPass);
        fileContentStr = fileContentStr.replace(/\$VPNProv/g, options.vpnProv);
        fileContentStr = fileContentStr.replace(/\$VPNClient/g, options.vpnClient);
        fileContentStr = fileContentStr.replace(/\$VPNNetwork/g, options.vpnNetwork);
        fileContentStr = fileContentStr.replace(/\$DockarrVersion/g, DOCKARR_VERSION);
        fileContentStr = fileContentStr.replace(/\$StackName/g, name);

        composeManifest.set(dockerComposeFile.name.toLowerCase(), JSON.parse(fileContentStr));
    }

    const doc = new YAML.Document({version: "3.3"});
    doc.commentBefore = 'Generated with <3 by Dockarr on ' + new Date();
    doc.comment = 'EOF';
    // doc.add(doc.createPair("name", name)); // Does not work with all version of compose...
    // But the way we organize the files means the folder name will default to the stack name
    doc.add(doc.createPair("services", composeManifest));
    doc.add(doc.createPair("networks", doc.createPair(name, {
            driver: "bridge",
            external: false,
            name: name
        }
    )));

    // Save File to disk
    console.log(chalk.blue('Saving docker-compose file to disk...'));
    const deploymentDir = Path.join(dockarrDir, name);

    if (!fs.existsSync(deploymentDir)) {
        console.log(chalk.blue('Creating .dockarr directory...'));
        fs.mkdirSync(deploymentDir, {recursive: true});
    }

    await fs.writeFile(Path.join(deploymentDir, name + '.yaml'), String(doc), function (err: any) {
        if (err) {
            return console.error(err);
        }
        console.log(chalk.green('Successfully saved docker-compose manifest!'));
    });
}

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
        .action(async (name, options) => createStack(name, options));

    dockarrCommand.command("start")
        .description("Start all or specific containers in a deployment")
        .argument('<name>', "Name of the dockarr stack to start")
        .option('-s, --service [service]', "Only stop one or more service in the deployment")
        .action(async (name, options) => {
            const deploymentDir = Path.join(dockarrDir, name);
            console.log(chalk.blue('Starting deployment...'));

            if (options.service !== undefined) {
                compose.upMany(options.service.split(','), {
                    cwd: deploymentDir,
                    config: [name + ".yaml"],
                    log: true,
                    commandOptions: ['-p ' + name]
                })
                    .then(
                        () => {
                            console.log(chalk.green('Finished!'));
                        },
                        err => {
                            console.log('something went wrong:', err.message)
                        }
                    );
            } else {
                compose.upAll({cwd: deploymentDir, config: [name + ".yaml"], log: true})
                    .then(
                        () => {
                            console.log(chalk.green('Finished!'));
                        },
                        err => {
                            console.log('something went wrong:', err.message)
                        }
                    );
            }
        });

    dockarrCommand.command("list")
        .description("List all deployments")
        .action(async () => {
            console.log(chalk.blue('List of all deployments:'));
            const files = fs.readdirSync(dockarrDir, {withFileTypes: true, encoding: 'utf-8'});
            for (let i = 0; i < files.length; i++) {
                console.log(chalk.bgGray((i + 1) + ". " + files[i].name));
            }
        });

    dockarrCommand.command("stop")
        .description("Stop all or specific containers in a deployment")
        .argument('<name>', 'Name of Dockarr deployment to stop')
        .option('-s, --service [service]', "Only stop one or more service in the deployment")
        .action(async (name, options) => {
            const deploymentDir = Path.join(dockarrDir, name);
            console.log(chalk.blue('Stopping deployment...'));
            const files = fs.readdirSync(dockarrDir, {withFileTypes: true, encoding: 'utf-8'});
            for (let i = 0; i < files.length; i++) {
                if (files[i].name === name) {
                    if (options.service !== undefined) {
                        await compose.stopMany({
                            cwd: deploymentDir,
                            config: [name + ".yaml"],
                            log: true
                        }, options.service.split(',')).then(
                            () => {
                                console.log(chalk.green('Finished!'));
                            },
                            err => {
                                console.log('something went wrong:', err.message)
                            }
                        );
                    } else {
                        await compose.stop({cwd: deploymentDir, config: [name + ".yaml"], log: true}).then(
                            () => {
                                console.log(chalk.green('Finished!'));
                            },
                            err => {
                                console.log('something went wrong:', err.message)
                            }
                        );
                    }
                    return;
                }
            }
        });

    dockarrCommand.command("remove")
        .description("Remove all containers in a deployment")
        .argument('<name>', 'Name of Dockarr deployment to remove')
        .action(async (name) => {
            const deploymentDir = Path.join(dockarrDir, name);
            console.log(chalk.blue('Stopping deployment...'));
            const files = fs.readdirSync(dockarrDir, {withFileTypes: true, encoding: 'utf-8'});
            for (let i = 0; i < files.length; i++) {
                if (files[i].name === name) {
                    await compose.down({cwd: deploymentDir, config: [name + ".yaml"], log: true}).then(
                        () => {
                            fs.rmSync(deploymentDir, {recursive: true})
                            console.log(chalk.green('Finished!'));
                        },
                        err => {
                            console.log('something went wrong:', err.message)
                        }
                    );
                    return;
                }
            }
        });

    dockarrCommand.command("restart")
        .description("Restart all or specific containers in a deployment")
        .argument('<name>', 'Name of Dockarr deployment to restart')
        .option('-s, --service [service]', "Only restart one or more service in the deployment")
        .action(async (name, options) => {
            const deploymentDir = Path.join(dockarrDir, name);
            console.log(chalk.blue('Restarting deployment...'));
            const files = fs.readdirSync(dockarrDir, {withFileTypes: true, encoding: 'utf-8'});
            for (let i = 0; i < files.length; i++) {
                if (files[i].name === name) {
                    if (options.service !== undefined) {
                        await compose.restartMany(options.service.split(','), {
                            cwd: deploymentDir,
                            config: [name + ".yaml"],
                            log: true
                        }).then(
                            () => {
                                console.log(chalk.green('Finished!'));
                            },
                            err => {
                                console.log('something went wrong:', err.message)
                            }
                        );
                    } else {
                        await compose.restartAll({cwd: deploymentDir, config: [name + ".yaml"], log: true}).then(
                            () => {
                                console.log(chalk.green('Finished!'));
                            },
                            err => {
                                console.log('something went wrong:', err.message)
                            }
                        );
                    }
                    return;
                }
            }
        });

    dockarrCommand.command("update")
        .description("Update all or specific containers in a deployment")
        .argument('<name>', 'Name of Dockarr deployment to update')
        .option('-s, --service [service]', "Only update one or more service in the deployment")
        .action(async (name, options) => {
            const deploymentDir = Path.join(dockarrDir, name);
            console.log(chalk.blue('Updating deployment...'));
            const files = fs.readdirSync(dockarrDir, {withFileTypes: true, encoding: 'utf-8'});
            for (let i = 0; i < files.length; i++) {
                if (files[i].name === name) {
                    if (options.service !== undefined) {
                        await compose.stopMany({
                            cwd: deploymentDir,
                            config: [name + ".yaml"],
                            log: true
                        }, options.service.split(',')).then(
                            () => {
                                console.log(chalk.green('Stopped services!'));
                            },
                            err => {
                                console.log('something went wrong:', err.message)
                            }
                        );
                        await compose.pullMany(options.service.split(','), {
                            cwd: deploymentDir,
                            config: [name + ".yaml"],
                            log: true
                        }).then(
                            () => {
                                console.log(chalk.green('Update complete!'));
                            },
                            err => {
                                console.log('something went wrong:', err.message)
                            }
                        );
                        await compose.upMany(options.service.split(','), {
                            cwd: deploymentDir,
                            config: [name + ".yaml"],
                            log: true
                        }).then(
                            () => {
                                console.log(chalk.green('Finished!'));
                            },
                            err => {
                                console.log('something went wrong:', err.message)
                            }
                        );
                    } else {
                        await compose.stop({cwd: deploymentDir, config: [name + ".yaml"], log: true}).then(
                            () => {
                                console.log(chalk.green('Stopped services!'));
                            },
                            err => {
                                console.log('something went wrong:', err.message)
                            }
                        );
                        await compose.pullAll({cwd: deploymentDir, config: [name + ".yaml"], log: true}).then(
                            () => {
                                console.log(chalk.green('Finished!'));
                            },
                            err => {
                                console.log('something went wrong:', err.message)
                            }
                        );
                        await compose.upAll({cwd: deploymentDir, config: [name + ".yaml"], log: true}).then(
                            () => {
                                console.log(chalk.green('Finished!'));
                            },
                            err => {
                                console.log('something went wrong:', err.message)
                            }
                        );
                    }
                    return;
                }
            }
        });

    dockarrCommand.command("install")
        .description('Install software related to HTPC')
        .argument('<package>')
        .action(async (packageStr, options) => {
            switch (os.type()) {
                case "Linux":
                    switch (packageStr) {
                        case "plex":
                            execSync('sudo apt-get install plex-desktop', {stdio: 'inherit'});
                            break;
                        case "plexmediaserver":
                            execSync('sudo apt-get install plexmediaserver', {stdio: 'inherit'});
                            break;
                        case "steam":
                            execSync('sudo add-apt-repository multiverse && sudp apt-get update && sudo apt-get install steam', {stdio: 'inherit'});
                            break;
                        case "spotify":
                            execSync('sudo snap install spotify', {stdio: 'inherit'});
                            break;
                        default:
                            console.log(chalk.red('Unknown package'));
                            break;
                    }
                    break;
                case "Windows_NT":
                    switch (packageStr) {
                        case "plex":
                            execSync('winget install -e --id Plex.Plex', {stdio: 'inherit'});
                            break;
                        case "plexmediaserver":
                            execSync('winget install -e --id Plex.PlexMediaPlayer', {stdio: 'inherit'});
                            break;
                        case "steam":
                            execSync('winget install -e --id Valve.Steam', {stdio: 'inherit'});
                            break;
                        case "spotify":
                            execSync('winget install -e --id Spotify.Spotify', {stdio: 'inherit'});
                            break;
                        default:
                            console.log(chalk.red('Unknown package'));
                            break;
                    }
                    break;
                default:
                    break;
            }
        });

    dockarrCommand.command("get-api-keys")
        .description('Get the *arr api keys of the installed services')
        .action(async () => {

            const services = [
                {name: 'Sonarr', port: '8989'},
                {name: 'Radarr', port: '7878'},
                {name: 'Readarr', port: '8787'},
                {name: 'Lidarr', port: '8686'},
                {name: 'Prowlarr', port: '9696'},
            ]
            const ipAddress = getIPAddress();

            for (let service of services) {
                try {
                    const stringRes = await axios.get('http://' + ipAddress + ':' + service.port + '/initialize.js');
                    const token = new RegExp('^  apiKey: \'([a-z|0-9]*)\',$', "gm").exec(stringRes['data']);
                    if (token) {
                        console.log(chalk.blueBright(service.name + ' API Key: ' + chalk.white(token[1])))
                    }
                } catch (error) {
                    console.log(chalk.yellow('Service ' + service.name + ' cannot be reached'))
                }
            }
        });

    dockarrCommand
        .parse()
}

run()