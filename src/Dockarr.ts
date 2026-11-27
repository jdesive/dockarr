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
        const stacks = fs.existsSync(dockarrDir)
            ? fs.readdirSync(dockarrDir, {withFileTypes: true}).filter(entry => entry.isDirectory())
            : [];
        if (stacks.length === 0) {
            console.log(chalk.yellow('No deployments yet. Create one with "dockarr create <name>".'));
            return;
        }
        console.log(chalk.blue('List of all deployments:'));
        stacks.forEach((stack, index) => console.log(chalk.bgGray((index + 1) + ". " + stack.name)));
    }

    validateName(name: string) {
        const isValid = /^[a-zA-Z0-9][a-zA-Z0-9._-]*$/.test(name);
        if (!isValid) {
            throw new Error(`Invalid deployment name: "${name}". It must start with a letter or number and only contain letters, numbers, dots, underscores, and hyphens.`);
        }
    }

    async listStackServiceLinks(name: string) {

        const deploymentDir = Path.join(dockarrDir, name);
        const files = fs.readdirSync(dockarrDir, {withFileTypes: true, encoding: 'utf-8'});
        for (let i = 0; i < files.length; i++) {
            if (files[i].name === name) {
                // Found docker compose file

            }
        }
    }

    // Compose options for an existing deployment; throws if it doesn't exist.
    stackOptions(name: string): compose.IDockerComposeOptions {
        this.validateName(name);
        const cwd = Path.join(dockarrDir, name);
        if (!fs.existsSync(Path.join(cwd, name + '.yaml'))) {
            throw new Error(`Deployment "${name}" not found. Run "dockarr list" to see your deployments.`);
        }
        return {cwd, config: [name + '.yaml'], log: true};
    }

    parseServiceList(service: string | undefined): string[] | undefined {
        return service?.split(',').map(s => s.trim()).filter(s => s !== '');
    }

    // docker-compose rejects with {exitCode, err} rather than an Error; its output is already
    // streamed to the console (log: true), so only report which step failed.
    async runCompose(step: string, action: () => Promise<unknown>) {
        try {
            await action();
        } catch (result: any) {
            if (result?.code === 'ENOENT') {
                throw new Error('Docker was not found. Install it with "dockarr install docker" and make sure "docker compose" works.');
            }
            throw new Error(`${step} failed` + (result?.exitCode !== undefined ? ` (exit code ${result.exitCode})` : `: ${result?.message ?? result}`));
        }
    }

    async stopStack(name: string, options: any) {
        const composeOptions = this.stackOptions(name);
        const services = this.parseServiceList(options.service);
        console.log(chalk.blue('Stopping deployment...'));
        await this.runCompose('Stop', () => services
            ? compose.stopMany(composeOptions, ...services)
            : compose.stop(composeOptions));
        console.log(chalk.green('Finished!'));
    }

    async restartStack(name: string, options: any) {
        const composeOptions = this.stackOptions(name);
        const services = this.parseServiceList(options.service);
        console.log(chalk.blue('Restarting deployment...'));
        await this.runCompose('Restart', () => services
            ? compose.restartMany(services, composeOptions)
            : compose.restartAll(composeOptions));
        console.log(chalk.green('Finished!'));
    }

    async updateStack(name: string, options: any) {
        const composeOptions = this.stackOptions(name);
        const services = this.parseServiceList(options.service);
        // Pull while services keep running; "up" then only recreates containers whose image changed.
        console.log(chalk.blue('Pulling new images...'));
        await this.runCompose('Pull', () => services
            ? compose.pullMany(services, composeOptions)
            : compose.pullAll(composeOptions));
        console.log(chalk.blue('Restarting updated services...'));
        await this.runCompose('Start', () => services
            ? compose.upMany(services, composeOptions)
            : compose.upAll(composeOptions));
        console.log(chalk.green('Finished!'));
    }

    async deleteStack(name: string, options: any) {
        const composeOptions = this.stackOptions(name);
        if (!options.yes) {
            const answer = await this.ask(`Stop and remove all containers in "${name}"? Media and config files are kept. [y/N]> `);
            if (answer.trim().toLowerCase() !== 'y') {
                console.log(chalk.yellow('Aborted.'));
                return;
            }
        }
        console.log(chalk.blue('Removing deployment...'));
        await this.runCompose('Remove', () => compose.down(composeOptions));
        fs.rmSync(composeOptions.cwd!, {recursive: true});
        console.log(chalk.green('Finished!'));
    }

    async startStack(name: string, options: any) {
        const composeOptions = this.stackOptions(name);
        const services = this.parseServiceList(options.service);
        console.log(chalk.blue('Starting deployment...'));
        await this.runCompose('Start', () => services
            ? compose.upMany(services, composeOptions)
            : compose.upAll(composeOptions));
        console.log(chalk.green('Finished!'));
    }

    private rl?: readline.Interface;
    private lines?: AsyncIterator<string>;
    private muted = false;

    // One shared reader so piped input (e.g. answers from a script) isn't lost between prompts.
    async ask(query: string, secret = false): Promise<string> {
        if (this.lines === undefined) {
            this.rl = readline.createInterface({input, output});
            (this.rl as any)._writeToOutput = (text: string) => {
                if (!this.muted) output.write(text);
            };
            this.lines = this.rl[Symbol.asyncIterator]();
        }
        output.write(query);
        this.muted = secret;
        const line = await this.lines.next();
        this.muted = false;
        if (secret) output.write('\n');
        if (line.done) {
            throw new Error(`No input given for "${query.replace(/>\s*$/, '').trim()}".`);
        }
        return line.value;
    }

    // Like ask(), but doesn't echo what's typed.
    askSecret(query: string): Promise<string> {
        return this.ask(query, true);
    }

    close() {
        this.rl?.close();
    }

    // Accepts service names (case-insensitive) or 1-based indexes from the list, comma separated.
    parseServiceSelection(selection: string): DockerComposeFile[] {
        const selected: DockerComposeFile[] = [];
        for (const entry of this.parseServiceList(selection) ?? []) {
            const index = Number(entry);
            const service = Number.isInteger(index)
                ? COMPOSE_FILES[index - 1]
                : COMPOSE_FILES.find(file => file.name.toLowerCase() === entry.toLowerCase());
            if (service === undefined) {
                throw new Error(`Unknown service "${entry}". Available: ${COMPOSE_FILES.map(file => file.name).join(', ')}`);
            }
            if (!selected.includes(service)) selected.push(service);
        }
        if (selected.length === 0) {
            throw new Error('No services selected.');
        }
        return selected;
    }

    async createStack(name: string, options: any) {
        this.validateName(name);
        const deploymentDir = Path.join(dockarrDir, name);
        if (fs.existsSync(Path.join(deploymentDir, name + '.yaml')) && !options.force) {
            throw new Error(`Deployment "${name}" already exists. Use --force to overwrite its compose file, or pick another name.`);
        }

        await this.runCompose('Docker check', () =>
            compose.version().then(str => console.log(chalk.blue('Docker Compose Version: ') + str.data.version)));

        let selection = options.services;
        if (selection === undefined) {
            console.log(chalk.blue('What services would you like deployed?'));
            COMPOSE_FILES.forEach((file, index) => {
                console.log(chalk.bgGray((index + 1) + ". " + file.name));
            });
            console.log(chalk.blueBright('Select as many as you want, as a comma separated list of numbers or names.'));
            selection = await this.ask('Selection> ');
        }
        const servicesToDeploy = this.parseServiceSelection(selection);
        console.log(chalk.blue('Selected: ') + servicesToDeploy.map(file => file.name).join(', '));

        let plexClaimInput = options.plexClaim;
        let plexAdvertisedIp = options.advertisedIp;
        if (this.isComposeSelected("Plex", servicesToDeploy)) {
            if (plexClaimInput === undefined) {
                // Ask for Plex Claim
                console.log(chalk.blueBright('You can get your plex claim at https://plex.tv/claim'));
                plexClaimInput = await this.ask('Plex Claim> ');
            }

            if (plexAdvertisedIp === undefined || plexAdvertisedIp === 'auto') {
                console.log(chalk.blue('Automatically grabbing your IP...'));
                plexAdvertisedIp = "http://" + this.getIPAddress() + ":32400";
            }
        }

        let vpnUser = options.vpnUser;
        let vpnPass = options.vpnPass;
        if (this.isComposeSelected("Deluge", servicesToDeploy) && options.vpn !== 'false') {
            if (vpnUser === undefined || vpnPass === undefined) {
                console.log(chalk.blueBright('Deluge routes traffic through your VPN provider (' + options.vpnProv + '). Use --vpn false to disable.'));
            }
            if (vpnUser === undefined) vpnUser = await this.ask('VPN User> ');
            if (vpnPass === undefined) vpnPass = await this.askSecret('VPN Password> ');
        }

        let baseUrl = options.baseUrl;
        if (baseUrl === undefined && this.isComposeSelected("Mealie", servicesToDeploy)) {
            console.log(chalk.blueBright('Please provide your base url domain name: (ex. example.com)'));
            baseUrl = await this.ask('BaseUrl> ');
        }

        // Generate docker-compose manifest
        console.log(chalk.blue('Generating the docker-compose manifest...'));
        const templateValues: Record<string, string | undefined> = {
            ConfigDir: options.configDir,
            WorkDir: options.workDir,
            DataDir: options.dataDir,
            PlexClaim: plexClaimInput,
            DockerSock: options.dockerSock,
            GUID: options.guid,
            PUID: options.puid,
            Timezone: options.timezone,
            PlexIp: plexAdvertisedIp,
            VPNEnabled: options.vpn,
            VPNUser: vpnUser,
            VPNPass: vpnPass,
            VPNProv: options.vpnProv,
            VPNClient: options.vpnClient,
            VPNNetwork: options.vpnNetwork,
            DockarrVersion: DOCKARR_VERSION,
            StackName: name,
            BaseUrl: baseUrl,
        };

        let composeManifest = new Map();
        for (let dockerComposeFile of servicesToDeploy) {
            if (dockerComposeFile.name === 'Portainer' || dockerComposeFile.name === 'WatchTower') {
                console.log(chalk.yellow(`Warning: ${dockerComposeFile.name} requires access to the Docker socket (${options.dockerSock}). This gives the container significant control over the host.`));
            }

            for (let mani of this.fillTemplate(dockerComposeFile.services, templateValues)) {
                composeManifest.set(mani.container_name.toLowerCase(), mani);
            }
        }

        const doc = new YAML.Document({});
        doc.commentBefore = 'Generated with <3 by Dockarr on ' + new Date();
        doc.comment = 'EOF';
        doc.add(doc.createPair("services", composeManifest));
        doc.add(doc.createPair("networks", doc.createPair(name, {
                driver: "bridge",
                external: false,
                name: name
            }
        )));

        // Save File to disk
        console.log(chalk.blue('Saving docker-compose file to disk...'));

        if (!fs.existsSync(deploymentDir)) {
            console.log(chalk.blue('Creating .dockarr directory...'));
            fs.mkdirSync(deploymentDir, {recursive: true, mode: 0o700});
        }

        // The manifest holds secrets (Plex claim, VPN credentials), so keep it owner-only.
        // chmod covers stacks created before this, since mode only applies to new files.
        const manifestPath = Path.join(deploymentDir, name + '.yaml');
        fs.writeFileSync(manifestPath, String(doc), {mode: 0o600});
        fs.chmodSync(manifestPath, 0o600);
        fs.chmodSync(deploymentDir, 0o700);
        console.log(chalk.green('Successfully saved docker-compose manifest!'));
        console.log(chalk.blueBright('Start it with: ') + chalk.white('dockarr start ' + name));
    }

    // Recursively replace $Token placeholders in a compose template. Works on the objects
    // directly so values never need JSON escaping (e.g. Windows paths, quotes in passwords).
    // "$" in values is doubled, compose's escape for a literal dollar sign.
    fillTemplate(template: any, values: Record<string, string | undefined>): any {
        if (typeof template === 'string') {
            return template.replace(/\$([A-Za-z]+)/g, (match, key) =>
                key in values ? (values[key] ?? '').replace(/\$/g, '$$$$') : match);
        }
        if (Array.isArray(template)) {
            return template.map(item => this.fillTemplate(item, values));
        }
        if (template !== null && typeof template === 'object') {
            return Object.fromEntries(Object.entries(template)
                .map(([key, value]) => [this.fillTemplate(key, values), this.fillTemplate(value, values)]));
        }
        return template;
    }

    async getApiKeys() {
        console.log(chalk.yellow('Warning: Fetching API keys over insecure HTTP. Ensure your network is trusted.'));
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
                        execSync('sudo snap install plex-desktop', {stdio: 'inherit'});
                        break;
                    case "plexmediaserver":
                        execSync('sudo apt-get install plexmediaserver', {stdio: 'inherit'});
                        break;
                    case "steam":
                        execSync('sudo add-apt-repository multiverse && sudo apt-get update && sudo apt-get install steam', {stdio: 'inherit'});
                        break;
                    case "spotify":
                        execSync('sudo snap install spotify', {stdio: 'inherit'});
                        break;
                    case "tidal":
                        execSync('sudo snap install tidal', {stdio: 'inherit'});
                        break;
                    case "docker":
                        console.log(chalk.blue('Installing Docker using the official convenience script...'));
                        execSync('curl -fsSL https://get.docker.com -o get-docker.sh && sudo sh get-docker.sh', {stdio: 'inherit'});
                        console.log(chalk.blue('Post-installation steps: Adding user to docker group...'));
                        execSync('sudo usermod -aG docker $USER', {stdio: 'inherit'});
                        console.log(chalk.green('Docker installed successfully! You may need to log out and back in for group changes to take effect.'));
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
                        execSync('winget install -e --id Plex.PlexMediaServer', {stdio: 'inherit'});
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