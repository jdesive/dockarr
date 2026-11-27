import {describe, it} from "node:test";
import assert from "node:assert/strict";
import {Dockarr} from "../src/Dockarr";
import {COMPOSE_FILES} from "../src/compose-files.models";

const dockarr = new Dockarr();

const SAMPLE_VALUES = {
    ConfigDir: "/opt/htpc", WorkDir: "/opt/htpc/tmp", DataDir: "/mnt/Media", PlexClaim: "claim",
    DockerSock: "/var/run/docker.sock", GUID: "1000", PUID: "1000", Timezone: "America/Chicago",
    PlexIp: "http://192.168.1.2:32400", VPNEnabled: "true", VPNUser: "user", VPNPass: "pass",
    VPNProv: "pia", VPNClient: "openvpn", VPNNetwork: "192.168.1.0/24", DockarrVersion: "0.0.0",
    StackName: "test", BaseUrl: "example.com",
};

describe("fillTemplate", () => {
    it("replaces placeholders in nested arrays, objects and keys", () => {
        const result = dockarr.fillTemplate(
            [{volumes: ["$ConfigDir/plex:/config"], labels: {"stack.$StackName": "$StackName"}}],
            {ConfigDir: "/opt/htpc", StackName: "home"});
        assert.deepEqual(result, [{volumes: ["/opt/htpc/plex:/config"], labels: {"stack.home": "home"}}]);
    });

    it("keeps Windows paths and quotes literal", () => {
        assert.equal(dockarr.fillTemplate("$ConfigDir/plex", {ConfigDir: "C:\\htpc\\config"}), "C:\\htpc\\config/plex");
        assert.equal(dockarr.fillTemplate("VPN_PASS=$VPNPass", {VPNPass: `p"a's\\s`}), `VPN_PASS=p"a's\\s`);
    });

    it("escapes $ in values so compose doesn't interpolate them", () => {
        assert.equal(dockarr.fillTemplate("VPN_PASS=$VPNPass", {VPNPass: "pa$word$$"}), "VPN_PASS=pa$$word$$$$");
    });

    it("leaves unknown placeholders alone and blanks undefined values", () => {
        assert.equal(dockarr.fillTemplate("$Unknown:$PlexClaim", {PlexClaim: undefined}), "$Unknown:");
    });

    it("passes through non-string values and doesn't mutate the template", () => {
        const template = [{restart: "always", deploy: {replicas: 1, enabled: true, extra: null}, ports: ["$Port"]}];
        const copy = structuredClone(template);
        const result = dockarr.fillTemplate(template, {Port: "80:80"});
        assert.deepEqual(result, [{restart: "always", deploy: {replicas: 1, enabled: true, extra: null}, ports: ["80:80"]}]);
        assert.deepEqual(template, copy);
    });
});

describe("parseServiceSelection", () => {
    const names = (selection: string) => dockarr.parseServiceSelection(selection).map(file => file.name);

    it("accepts names case-insensitively, numbers, or a mix", () => {
        assert.deepEqual(names("plex,SONARR"), ["Plex", "Sonarr"]);
        assert.deepEqual(names("1,3"), ["Plex", "Radarr"]);
        assert.deepEqual(names("radarr,1"), ["Radarr", "Plex"]);
    });

    it("ignores whitespace, empty entries and duplicates", () => {
        assert.deepEqual(names(" plex , ,1,plex,"), ["Plex"]);
    });

    it("rejects unknown names and out of range numbers", () => {
        for (const selection of ["foo", "0", "-1", "1.5", String(COMPOSE_FILES.length + 1)]) {
            assert.throws(() => dockarr.parseServiceSelection(selection), /Unknown service/, selection);
        }
    });

    it("rejects an empty selection", () => {
        assert.throws(() => dockarr.parseServiceSelection(" , "), /No services selected/);
    });
});

describe("validateName", () => {
    it("accepts typical names", () => {
        for (const name of ["htpc", "my-first-dockarr", "Stack_2", "home.v2"]) {
            assert.doesNotThrow(() => dockarr.validateName(name), name);
        }
    });

    it("rejects names that could escape ~/.dockarr or confuse the shell", () => {
        for (const name of ["", ".", "..", ".hidden", "a/b", "..\\x", "a b", "-rf", "$(id)"]) {
            assert.throws(() => dockarr.validateName(name), /Invalid deployment name/, name);
        }
    });
});

describe("stackOptions", () => {
    it("throws a helpful error for a deployment that doesn't exist", () => {
        assert.throws(() => dockarr.stackOptions("no-such-stack-" + process.pid), /not found/);
    });
});

describe("compose templates", () => {
    const rendered = COMPOSE_FILES.map(file => ({
        name: file.name,
        services: dockarr.fillTemplate(file.services, SAMPLE_VALUES) as any[],
    }));
    const allServices = rendered.flatMap(file => file.services.map(service => ({file: file.name, service})));

    it("give every service an image and a unique container name", () => {
        const seen = new Map<string, string>();
        for (const {file, service} of allServices) {
            assert.ok(service.image, `${file} has a service without an image`);
            assert.ok(service.container_name, `${file} has a service without a container_name`);
            const key = service.container_name.toLowerCase();
            assert.ok(!seen.has(key), `${file} and ${seen.get(key)} both use container name "${key}"`);
            seen.set(key, file);
        }
    });

    it("only use known placeholders", () => {
        for (const file of rendered) {
            const leftover = JSON.stringify(file.services).match(/\$[A-Za-z]+/g);
            assert.equal(leftover, null, `${file.name} has unknown placeholders: ${leftover}`);
        }
    });

    it("set PGID wherever PUID is set", () => {
        for (const {file, service} of allServices) {
            const env: string[] = service.environment ?? [];
            if (env.some(entry => entry.startsWith("PUID="))) {
                assert.ok(env.some(entry => entry.startsWith("PGID=")), `${file} sets PUID but not PGID`);
            }
            assert.ok(!env.some(entry => entry.startsWith("GUID=")), `${file} sets GUID instead of PGID`);
        }
    });

    it("don't publish the same host port twice", () => {
        const seen = new Map<string, string>();
        for (const {file, service} of allServices) {
            for (const mapping of service.ports ?? []) {
                const [address, protocol = "tcp"] = String(mapping).split("/");
                const parts = address.split(":");
                const hostPort = parts.length > 1 ? parts[parts.length - 2] : parts[0];
                const key = `${hostPort}/${protocol}`;
                assert.ok(!seen.has(key), `${file} and ${seen.get(key)} both publish ${key}`);
                seen.set(key, file);
            }
        }
    });
});
