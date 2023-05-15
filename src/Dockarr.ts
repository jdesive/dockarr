import {COMPOSE_FILES, DockerComposeFile} from "./compose-files.models";
import Path from "path";
import chalk from "chalk";
import fs from "fs";
import * as compose from "docker-compose";
import readline from "node:readline/promises";
import {stdin as input, stdout as output} from "process";
import * as YAML from "yaml";
import {DOCKARR_VERSION, dockarrDir} from "./cli";
import axios from "axios";
import os from "os";
import {execSync} from "child_process";

export class Dockarr {

    isComposeSelected(name: string, services: DockerComposeFile[]) {
        for (let service of services) {
            if (service.name == name) return true;
        }
        return false;
    }

    getIPAddress() {
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

    async listStacks() {
        console.log(chalk.blue('List of all deployments:'));
        const files = fs.readdirSync(dockarrDir, {withFileTypes: true, encoding: 'utf-8'});
        for (let i = 0; i < files.length; i++) {
            console.log(chalk.bgGray((i + 1) + ". " + files[i].name));
        }
    }

    async stopStack(name: string, options: any) {
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
                        () => console.log(chalk.green('Finished!')),
                        err => console.log('something went wrong:', err.message)
                    );
                } else {
                    await compose.stop({cwd: deploymentDir, config: [name + ".yaml"], log: true}).then(
                        () => console.log(chalk.green('Finished!')),
                        err => console.log('something went wrong:', err.message)
                    );
                }
                return;
            }
        }
    }

    async restartStack(name: string, options: any) {
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
                        () => console.log(chalk.green('Finished!')),
                        err => console.log('something went wrong:', err.message)
                    );
                } else {
                    await compose.restartAll({cwd: deploymentDir, config: [name + ".yaml"], log: true}).then(
                        () => console.log(chalk.green('Finished!')),
                        err => console.log('something went wrong:', err.message)
                    );
                }
                return;
            }
        }
    }

    async updateStack(name: string, options: any) {
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
                        () => console.log(chalk.green('Stopped services!')),
                        err => console.log('something went wrong:', err.message)
                    );
                    await compose.pullMany(options.service.split(','), {
                        cwd: deploymentDir,
                        config: [name + ".yaml"],
                        log: true
                    }).then(
                        () => console.log(chalk.green('Update complete!')),
                        err => console.log('something went wrong:', err.message)
                    );
                    await compose.upMany(options.service.split(','), {
                        cwd: deploymentDir,
                        config: [name + ".yaml"],
                        log: true
                    }).then(
                        () => console.log(chalk.green('Finished!')),
                        err => console.log('something went wrong:', err.message)
                    );
                } else {
                    await compose.stop({cwd: deploymentDir, config: [name + ".yaml"], log: true}).then(
                        () => console.log(chalk.green('Stopped services!')),
                        err => console.log('something went wrong:', err.message)
                    );
                    await compose.pullAll({cwd: deploymentDir, config: [name + ".yaml"], log: true}).then(
                        () => console.log(chalk.green('Finished!')),
                        err => console.log('something went wrong:', err.message)
                    );
                    await compose.upAll({cwd: deploymentDir, config: [name + ".yaml"], log: true}).then(
                        () => console.log(chalk.green('Finished!')),
                        err => console.log('something went wrong:', err.message)
                    );
                }
                return;
            }
        }
    }

    async deleteStack(name: string) {
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
                    err => console.log('something went wrong:', err.message)
                );
                return;
            }
        }
    }

    async startStack(name: string, options: any) {
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
                    () => console.log(chalk.green('Finished!')),
                    err => console.log('something went wrong:', err.message)
                );
        } else {
            compose.upAll({cwd: deploymentDir, config: [name + ".yaml"], log: true})
                .then(
                    () => console.log(chalk.green('Finished!')),
                    err => console.log('something went wrong:', err.message)
                );
        }
    }

    async createStack(name: string, options: any) {
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
        if (options.plexClaim === undefined && this.isComposeSelected("Plex", servicesToDeploy)) {
            // Ask for Plex Claim
            console.log(chalk.blueBright('You can get your plex claim at https://plex.tv/claim'));
            const rl = readline.createInterface({input, output});
            plexClaimInput = await rl.question('Plex Claim> ');
            rl.close();
            plexAdvertisedIp = options.advertisedIp;

            if (options.advertisedIp === undefined || options.advertisedIp === 'auto') {
                console.log(chalk.blue('Automatically grabbing your IP...'));
                plexAdvertisedIp = "http://" + this.getIPAddress() + ":32400";
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

            const manifests = JSON.parse(fileContentStr);

            for (let mani of manifests) {
                composeManifest.set(mani.container_name.toLowerCase(), mani);
            }
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

    async getApiKeys() {
        const services = [
            {name: 'Sonarr', port: '8989'},
            {name: 'Radarr', port: '7878'},
            {name: 'Readarr', port: '8787'},
            {name: 'Lidarr', port: '8686'},
            {name: 'Prowlarr', port: '9696'},
        ]
        const ipAddress = this.getIPAddress();

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
    }

    async install(serviceName: string) {
        switch (os.type()) {
            case "Linux":
                switch (serviceName.toLowerCase()) {
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
                        execSync('sudo snap install spotify -y', {stdio: 'inherit'});
                        break;
                    case "tidal":
                        execSync('sudo snap install tidal -y', {stdio: 'inherit'});
                        break;
                    case "docker":
                        execSync('wget -O - https://raw.githubusercontent.com/jdesive/dockarr/master/docker_install.sh | bash', {stdio: 'inherit'})
                        break;
                    default:
                        console.log(chalk.red('Unknown package'));
                        break;
                }
                break;
            case "Windows_NT":
                switch (serviceName.toLowerCase()) {
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
                    case "docker":
                        execSync('winget install -e --id Docker.DockerDesktop', {stdio: 'inherit'});
                        break;
                    case "tidal":
                        execSync('winget install -e --id TIDALMusicAS.TIDAL', {stdio: 'inherit'});
                        break;
                    default:
                        console.log(chalk.red('Unknown package'));
                        break;
                }
                break;
            default:
                break;
        }
    }

}