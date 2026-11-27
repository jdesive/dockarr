import {describe, it} from "node:test";
import assert from "node:assert/strict";
import {Dockarr} from "../src/Dockarr";
import {COMPOSE_FILES} from "../src/compose-files.models";

const dockarr = new Dockarr();

const SAMPLE_VALUES = {
    ConfigDir: "/opt/htpc", DataDir: "/mnt/data", PlexClaim: "claim",
    DockerSock: "/var/run/docker.sock", GUID: "1000", PUID: "1000", Timezone: "America/Chicago",
    PlexIp: "http://192.168.1.2:32400", VPNEnabled: "yes", VPNUser: "user", VPNPass: "pass",
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

    it("no longer offers removed services", () => {
        for (const name of ["watchtower", "readarr", "lunasea", "emulatorjs", "xteve", "kitana", "petio", "ubooquity", "requestrr"]) {
            assert.throws(() => dockarr.parseServiceSelection(name), /Unknown service/, name);
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

describe("assertComposeVersion", () => {
    it("accepts Compose v2 and later", () => {
        for (const version of ["2.20.2", "v2.29.7", "2.40.3-desktop.1", "5.0.0\n"]) {
            assert.doesNotThrow(() => dockarr.assertComposeVersion(version), version);
        }
    });

    it("rejects Compose v1 and unparseable versions", () => {
        for (const version of ["1.29.2", "", "unknown"]) {
            assert.throws(() => dockarr.assertComposeVersion(version), /Compose plugin \(v2 or later\)/, version);
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

    it("mount data at the same path under /data, so hardlinks and atomic moves work", () => {
        // These images expect their own download or source paths and never hand files to the *arr apps.
        const ownPaths = ["MeTube", "TubeSync", "Duplicati"];
        for (const {file, service} of allServices) {
            if (ownPaths.includes(file)) continue;
            for (const volume of service.volumes ?? []) {
                const [host, container] = String(volume).split(":");
                if (!host.startsWith(SAMPLE_VALUES.DataDir)) continue;
                assert.equal(container, "/data" + host.slice(SAMPLE_VALUES.DataDir.length), `${file} mounts ${volume}`);
            }
        }
    });

    it("don't put literal quotes in environment values", () => {
        for (const {file, service} of allServices) {
            for (const entry of service.environment ?? []) {
                assert.ok(!/["']/.test(entry), `${file} sets ${entry}`);
            }
        }
    });

    it("give Deluge the NET_ADMIN capability its VPN needs", () => {
        const deluge = allServices.find(({file}) => file === "Deluge")!.service;
        assert.ok(deluge.cap_add?.includes("NET_ADMIN"));
    });

    it("publish AdGuard Home DNS on port 53 and keep its config under the config directory", () => {
        const adguard = allServices.find(({file}) => file === "ADGuardHome")!.service;
        assert.ok(adguard.ports.includes("53:53/tcp") && adguard.ports.includes("53:53/udp"));
        for (const volume of adguard.volumes) {
            assert.ok(volume.startsWith(SAMPLE_VALUES.ConfigDir + "/"), volume);
        }
    });

    it("point Tautulli at Plex's real log directory", () => {
        const tautulli = allServices.find(({file}) => file === "Tautulli")!.service;
        assert.ok(tautulli.volumes.includes(
            "/opt/htpc/plex/Library/Application Support/Plex Media Server/Logs:/plex_logs:ro"));
    });
});

describe("procNetHasPort", () => {
    const table = [
        "  sl  local_address rem_address   st tx_queue rx_queue tr tm->when retrnsmt   uid  timeout inode",
        "   0: 3500007F:0035 00000000:0000 0A 00000000:00000000 00:00000000 00000000   991        0 1 1",
        "   1: 00000000:1F90 00000000:0000 0A 00000000:00000000 00:00000000 00000000  1000        0 2 1",
        "   2: 0100007F:9C40 0100007F:0035 01 00000000:00000000 00:00000000 00000000  1000        0 3 1",
    ].join("\n");

    it("finds a listener on the port in the given state", () => {
        assert.equal(dockarr.procNetHasPort(table, 53, "0A"), true);
        assert.equal(dockarr.procNetHasPort(table, 8080, "0A"), true);
    });

    it("ignores other ports, other states and remote addresses", () => {
        assert.equal(dockarr.procNetHasPort(table, 53, "07"), false);
        assert.equal(dockarr.procNetHasPort(table, 40000, "0A"), false);
        assert.equal(dockarr.procNetHasPort(table, 5353, "0A"), false);
    });

    it("handles IPv6 addresses", () => {
        const v6 = "  sl  local_address remote_address st\n   0: 00000000000000000000000000000000:0035 00000000000000000000000000000000:0000 07";
        assert.equal(dockarr.procNetHasPort(v6, 53, "07"), true);
    });
});
