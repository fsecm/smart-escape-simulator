/* =========================================================
   SMART ESCAPE
   Interactive Evacuation Route Simulator
   Frontend-only application
   ========================================================= */

"use strict";

/* =========================================================
   DOM ELEMENTS
   ========================================================= */

const fileInput = document.getElementById("fileInput");
const startSelect = document.getElementById("startSelect");

const blockNodeBtn = document.getElementById("blockNodeBtn");
const blockEdgeBtn = document.getElementById("blockEdgeBtn");
const closeExitBtn = document.getElementById("closeExitBtn");
const resetBtn = document.getElementById("resetBtn");

const languageBtn = document.getElementById("languageBtn");

const buildingName = document.getElementById("buildingName");

const status = document.getElementById("status");
const statusDescription = document.getElementById("statusDescription");
const statusIcon = document.getElementById("statusIcon");

const selectedExit = document.getElementById("selectedExit");
const totalCost = document.getElementById("totalCost");

const nodeCount = document.getElementById("nodeCount");
const edgeCount = document.getElementById("edgeCount");

const map = document.getElementById("map");

const routePath = document.getElementById("routePath");
const routeExit = document.getElementById("routeExit");
const routeCost = document.getElementById("routeCost");

const messageBox = document.getElementById("messageBox");


/* =========================================================
   APPLICATION STATE
   ========================================================= */

let buildingData = null;

let originalState = {
    blocked_nodes: [],
    blocked_edges: [],
    closed_exits: []
};

let currentState = {
    blocked_nodes: new Set(),
    blocked_edges: new Set(),
    closed_exits: new Set()
};

let selectedStart = "";

let selectedNodeId = null;
let selectedEdgeId = null;

let currentRoute = null;

let language = "en";


/* =========================================================
   TRANSLATIONS
   ========================================================= */

const translations = {

    en: {

        appTitle: "Smart Escape",
        appSubtitle: "Interactive Evacuation Route Simulator",

        building: "Building",

        systemStatus: "SYSTEM STATUS",

        importStart: "Import a building file to begin",
        importDescription:
            "Load a valid building.json dataset to calculate the safest available route.",

        routeControl: "ROUTE CONTROL",
        selectStarting: "Select starting location",

        startingLocation: "Starting Location",
        loadBuilding: "Load building first",

        blockNode: "Block Node",
        blockCorridor: "Block Corridor",
        closeExit: "Close Exit",
        reset: "Reset",

        buildingMap: "BUILDING MAP",
        liveNetwork: "Live evacuation network",

        nodes: "Nodes",
        corridors: "Corridors",

        room: "Room",
        junction: "Junction",
        exit: "Exit",
        bestRoute: "Best Route",

        routeAnalysis: "ROUTE ANALYSIS",
        lowestRoute: "Lowest-cost evacuation route",

        destination: "Destination",
        totalCost: "Total Cost",

        importDataset: "Import Building Dataset",
        importDescription2:
            "Select a valid building.json file from your computer.",

        chooseFile: "Choose JSON File",

        noBuilding: "No building loaded",
        noBuildingDescription:
            "Import building.json to visualize the evacuation network.",

        noRoute: "No route available",
        startBlocked: "Starting location blocked",

        routeFound: "Route found",
        buildingLoaded: "Building loaded successfully",

        invalidFile: "Invalid building file",
        invalidJson: "The selected file is not valid JSON.",

        selectStartFirst: "Please select a starting location.",

        selectNodeFirst:
            "Select a node on the map before blocking it.",

        selectEdgeFirst:
            "Select a corridor on the map before blocking it.",

        selectExitFirst:
            "Select an exit on the map before closing it.",

        cannotBlockExit:
            "An exit cannot be blocked as a normal node.",

        cannotCloseNonExit:
            "Only an exit can be closed.",

        resetDone: "Building restored to its initial state.",

        nodeBlocked: "Node blocked.",
        nodeUnblocked: "Node unblocked.",

        edgeBlocked: "Corridor blocked.",
        edgeUnblocked: "Corridor unblocked.",

        exitClosed: "Exit closed.",
        exitOpened: "Exit reopened.",

        selectLocation: "Select location"
    },

    bn: {

        appTitle: "স্মার্ট এসকেপ",
        appSubtitle: "ইন্টার‌্যাক্টিভ ইভাকুয়েশন রুট সিমুলেটর",

        building: "বিল্ডিং",

        systemStatus: "সিস্টেম স্ট্যাটাস",

        importStart: "শুরু করতে একটি বিল্ডিং ফাইল ইমপোর্ট করুন",
        importDescription:
            "সঠিক building.json dataset লোড করুন এবং সর্বনিম্ন খরচের রুট বের করুন।",

        routeControl: "রুট কন্ট্রোল",
        selectStarting: "শুরুর স্থান নির্বাচন করুন",

        startingLocation: "শুরুর স্থান",
        loadBuilding: "প্রথমে বিল্ডিং লোড করুন",

        blockNode: "নোড ব্লক করুন",
        blockCorridor: "করিডোর ব্লক করুন",
        closeExit: "এক্সিট বন্ধ করুন",
        reset: "রিসেট",

        buildingMap: "বিল্ডিং ম্যাপ",
        liveNetwork: "লাইভ ইভাকুয়েশন নেটওয়ার্ক",

        nodes: "নোড",
        corridors: "করিডোর",

        room: "রুম",
        junction: "জাংশন",
        exit: "এক্সিট",
        bestRoute: "সেরা রুট",

        routeAnalysis: "রুট অ্যানালাইসিস",
        lowestRoute: "সর্বনিম্ন খরচের ইভাকুয়েশন রুট",

        destination: "গন্তব্য",
        totalCost: "মোট খরচ",

        importDataset: "বিল্ডিং ডেটাসেট ইমপোর্ট",
        importDescription2:
            "আপনার কম্পিউটার থেকে একটি সঠিক building.json ফাইল নির্বাচন করুন।",

        chooseFile: "JSON ফাইল নির্বাচন করুন",

        noBuilding: "কোনো বিল্ডিং লোড করা হয়নি",
        noBuildingDescription:
            "ইভাকুয়েশন নেটওয়ার্ক দেখতে building.json ইমপোর্ট করুন।",

        noRoute: "কোনো রুট পাওয়া যায়নি",
        startBlocked: "শুরুর স্থান ব্লক করা হয়েছে",

        routeFound: "রুট পাওয়া গেছে",
        buildingLoaded: "বিল্ডিং সফলভাবে লোড হয়েছে",

        invalidFile: "ভুল বিল্ডিং ফাইল",
        invalidJson: "নির্বাচিত ফাইলটি সঠিক JSON নয়।",

        selectStartFirst: "দয়া করে একটি শুরুর স্থান নির্বাচন করুন।",

        selectNodeFirst:
            "ব্লক করার আগে ম্যাপ থেকে একটি নোড নির্বাচন করুন।",

        selectEdgeFirst:
            "ব্লক করার আগে ম্যাপ থেকে একটি করিডোর নির্বাচন করুন।",

        selectExitFirst:
            "বন্ধ করার আগে ম্যাপ থেকে একটি এক্সিট নির্বাচন করুন।",

        cannotBlockExit:
            "এক্সিটকে সাধারণ নোড হিসেবে ব্লক করা যাবে না।",

        cannotCloseNonExit:
            "শুধুমাত্র এক্সিট বন্ধ করা যাবে।",

        resetDone:
            "বিল্ডিং তার initial state-এ ফিরে গেছে।",

        nodeBlocked: "নোড ব্লক করা হয়েছে।",
        nodeUnblocked: "নোড আনব্লক করা হয়েছে।",

        edgeBlocked: "করিডোর ব্লক করা হয়েছে।",
        edgeUnblocked: "করিডোর আনব্লক করা হয়েছে।",

        exitClosed: "এক্সিট বন্ধ করা হয়েছে।",
        exitOpened: "এক্সিট আবার খোলা হয়েছে।",

        selectLocation: "স্থান নির্বাচন করুন"
    }
};


/* =========================================================
   HELPER
   ========================================================= */

function t(key) {
    return translations[language][key] || key;
}


/* =========================================================
   MESSAGE SYSTEM
   ========================================================= */

function showMessage(message, type = "success") {

    messageBox.textContent = message;

    messageBox.className = `message-box ${type}`;

    clearTimeout(showMessage.timer);

    showMessage.timer = setTimeout(() => {
        messageBox.classList.add("hidden");
    }, 3500);
}


/* =========================================================
   SET STATUS
   ========================================================= */

function setStatus(title, description, success = true) {

    status.textContent = title;

    statusDescription.textContent = description;

    statusIcon.textContent = success ? "✓" : "!";

    statusIcon.style.background =
        success ? "#dcfce7" : "#fee2e2";

    statusIcon.style.color =
        success ? "#15803d" : "#b91c1c";
}


/* =========================================================
   VALIDATE BUILDING JSON
   ========================================================= */

function validateBuilding(data) {

    if (!data || typeof data !== "object") {
        throw new Error("Invalid JSON object.");
    }

    if (
        typeof data.building !== "string" ||
        data.building.trim() === ""
    ) {
        throw new Error("Building name is required.");
    }

    if (!Array.isArray(data.nodes) || data.nodes.length === 0) {
        throw new Error("nodes[] must contain at least one node.");
    }

    if (!Array.isArray(data.edges) || data.edges.length === 0) {
        throw new Error("edges[] must contain at least one edge.");
    }

    if (!data.initial_state) {
        throw new Error("initial_state is required.");
    }


    /* ---------- NODE VALIDATION ---------- */

    const nodeIds = new Set();

    let roomOrJunction = 0;
    let exits = 0;

    for (const node of data.nodes) {

        if (!node || typeof node !== "object") {
            throw new Error("Invalid node.");
        }

        if (
            typeof node.id !== "string" ||
            node.id.trim() === ""
        ) {
            throw new Error("Every node needs a valid id.");
        }

        if (nodeIds.has(node.id)) {
            throw new Error(`Duplicate node id: ${node.id}`);
        }

        nodeIds.add(node.id);


        if (
            typeof node.label !== "string" ||
            node.label.trim() === ""
        ) {
            throw new Error(`Invalid label for node ${node.id}`);
        }


        if (
            !["room", "junction", "exit"].includes(node.type)
        ) {
            throw new Error(`Invalid node type: ${node.id}`);
        }


        if (
            typeof node.x !== "number" ||
            typeof node.y !== "number" ||
            !Number.isFinite(node.x) ||
            !Number.isFinite(node.y)
        ) {
            throw new Error(`Invalid coordinates: ${node.id}`);
        }


        if (node.type === "exit") {
            exits++;
        } else {
            roomOrJunction++;
        }
    }


    if (roomOrJunction === 0) {
        throw new Error(
            "At least one room or junction is required."
        );
    }

    if (exits === 0) {
        throw new Error("At least one exit is required.");
    }


    /* ---------- EDGE VALIDATION ---------- */

    const edgeIds = new Set();

    const nodePairs = new Set();

    for (const edge of data.edges) {

        if (!edge || typeof edge !== "object") {
            throw new Error("Invalid edge.");
        }


        if (
            typeof edge.id !== "string" ||
            edge.id.trim() === ""
        ) {
            throw new Error("Every edge needs a valid id.");
        }


        if (edgeIds.has(edge.id)) {
            throw new Error(`Duplicate edge id: ${edge.id}`);
        }

        edgeIds.add(edge.id);


        if (
            !nodeIds.has(edge.from) ||
            !nodeIds.has(edge.to)
        ) {
            throw new Error(
                `Invalid edge connection: ${edge.id}`
            );
        }


        if (edge.from === edge.to) {
            throw new Error(
                `Self-loop is not allowed: ${edge.id}`
            );
        }


        if (
            !Number.isInteger(edge.cost) ||
            edge.cost <= 0
        ) {
            throw new Error(
                `Edge cost must be a positive integer: ${edge.id}`
            );
        }


        const pair = [edge.from, edge.to].sort().join("::");

        if (nodePairs.has(pair)) {
            throw new Error(
                `Repeated node pair found: ${edge.from} - ${edge.to}`
            );
        }

        nodePairs.add(pair);
    }


    /* ---------- INITIAL STATE ---------- */

    const initial = data.initial_state;

    for (const id of initial.blocked_nodes || []) {

        const node = data.nodes.find(n => n.id === id);

        if (!node) {
            throw new Error(
                `Unknown blocked node: ${id}`
            );
        }

        if (node.type === "exit") {
            throw new Error(
                `Exit cannot appear in blocked_nodes: ${id}`
            );
        }
    }


    for (const id of initial.blocked_edges || []) {

        if (!edgeIds.has(id)) {
            throw new Error(
                `Unknown blocked edge: ${id}`
            );
        }
    }


    for (const id of initial.closed_exits || []) {

        const node = data.nodes.find(n => n.id === id);

        if (!node || node.type !== "exit") {
            throw new Error(
                `Invalid closed exit: ${id}`
            );
        }
    }

    return true;
}


/* =========================================================
   LOAD BUILDING
   ========================================================= */

function loadBuilding(data) {

    validateBuilding(data);

    buildingData = data;

    originalState = {
        blocked_nodes: [
            ...(data.initial_state.blocked_nodes || [])
        ],

        blocked_edges: [
            ...(data.initial_state.blocked_edges || [])
        ],

        closed_exits: [
            ...(data.initial_state.closed_exits || [])
        ]
    };

    currentState = {
        blocked_nodes:
            new Set(originalState.blocked_nodes),

        blocked_edges:
            new Set(originalState.blocked_edges),

        closed_exits:
            new Set(originalState.closed_exits)
    };


    selectedStart = "";

    selectedNodeId = null;
    selectedEdgeId = null;

    currentRoute = null;


    buildingName.textContent = data.building;

    nodeCount.textContent = data.nodes.length;

    edgeCount.textContent = data.edges.length;


    populateStartSelect();

    renderMap();

    updateButtons();

    clearRoute();


    setStatus(
        t("buildingLoaded"),
        `${data.nodes.length} nodes and ${data.edges.length} corridors loaded.`,
        true
    );

    showMessage(t("buildingLoaded"), "success");
}


/* =========================================================
   FILE IMPORT
   ========================================================= */

fileInput.addEventListener("change", event => {

    const file = event.target.files[0];

    if (!file) return;


    const reader = new FileReader();


    reader.onload = () => {

        try {

            const data = JSON.parse(reader.result);

            loadBuilding(data);

        } catch (error) {

            console.error(error);

            setStatus(
                t("invalidFile"),
                error.message || t("invalidJson"),
                false
            );

            showMessage(
                error.message || t("invalidJson"),
                "error"
            );
        }
    };


    reader.readAsText(file);
});


/* =========================================================
   START SELECT
   ========================================================= */

function populateStartSelect() {

    startSelect.innerHTML = "";

    const placeholder = document.createElement("option");

    placeholder.value = "";

    placeholder.textContent = t("selectLocation");

    startSelect.appendChild(placeholder);


    if (!buildingData) {
        startSelect.disabled = true;
        return;
    }


    const validStarts = buildingData.nodes
        .filter(node =>
            node.type === "room" ||
            node.type === "junction"
        )
        .sort((a, b) =>
            a.id.localeCompare(b.id)
        );


    for (const node of validStarts) {

        const option = document.createElement("option");

        option.value = node.id;

        option.textContent =
            `${node.id} - ${node.label}`;

        startSelect.appendChild(option);
    }


    startSelect.disabled = false;
}


startSelect.addEventListener("change", () => {

    selectedStart = startSelect.value;

    calculateAndRenderRoute();
});


/* =========================================================
   GRAPH
   ========================================================= */

function createGraph() {

    const graph = new Map();

    for (const node of buildingData.nodes) {
        graph.set(node.id, []);
    }


    for (const edge of buildingData.edges) {

        if (
            currentState.blocked_edges.has(edge.id)
        ) {
            continue;
        }


        if (
            currentState.blocked_nodes.has(edge.from) ||
            currentState.blocked_nodes.has(edge.to)
        ) {
            continue;
        }


        graph.get(edge.from).push({
            node: edge.to,
            cost: edge.cost,
            edgeId: edge.id
        });


        graph.get(edge.to).push({
            node: edge.from,
            cost: edge.cost,
            edgeId: edge.id
        });
    }


    for (const list of graph.values()) {

        list.sort((a, b) =>
            a.node.localeCompare(b.node)
        );
    }


    return graph;
}


/* =========================================================
   LEXICOGRAPHIC PATH COMPARISON
   ========================================================= */

function comparePaths(pathA, pathB) {

    const length =
        Math.min(pathA.length, pathB.length);


    for (let i = 0; i < length; i++) {

        const comparison =
            pathA[i].localeCompare(pathB[i]);

        if (comparison !== 0) {
            return comparison;
        }
    }


    return pathA.length - pathB.length;
}


/* =========================================================
   DIJKSTRA SHORTEST PATH
   ========================================================= */

function findBestRoute(startId) {

    if (!buildingData) {
        return null;
    }


    if (
        currentState.blocked_nodes.has(startId)
    ) {
        return {
            type: "blocked-start"
        };
    }


    const graph = createGraph();


    const distances = new Map();

    const paths = new Map();

    const visited = new Set();


    for (const node of buildingData.nodes) {

        distances.set(node.id, Infinity);

        paths.set(node.id, null);
    }


    distances.set(startId, 0);

    paths.set(startId, [startId]);


    /*
       Simple priority queue.
       Input limits are small:
       max 60 nodes.
    */

    const queue = [
        {
            node: startId,
            cost: 0,
            path: [startId]
        }
    ];


    while (queue.length > 0) {

        queue.sort((a, b) => {

            if (a.cost !== b.cost) {
                return a.cost - b.cost;
            }

            return comparePaths(a.path, b.path);
        });


        const current = queue.shift();


        if (visited.has(current.node)) {
            continue;
        }


        visited.add(current.node);


        for (const neighbor of graph.get(current.node)) {

            if (
                visited.has(neighbor.node)
            ) {
                continue;
            }


            const newCost =
                current.cost + neighbor.cost;


            const newPath = [
                ...current.path,
                neighbor.node
            ];


            const oldCost =
                distances.get(neighbor.node);


            const oldPath =
                paths.get(neighbor.node);


            const isBetter =
                newCost < oldCost;


            const sameCostBetterPath =
                newCost === oldCost &&
                oldPath !== null &&
                comparePaths(newPath, oldPath) < 0;


            if (
                isBetter ||
                sameCostBetterPath
            ) {

                distances.set(
                    neighbor.node,
                    newCost
                );

                paths.set(
                    neighbor.node,
                    newPath
                );


                queue.push({
                    node: neighbor.node,
                    cost: newCost,
                    path: newPath
                });
            }
        }
    }


    /* ---------- FIND ACCESSIBLE EXITS ---------- */

    const candidates = [];


    for (const node of buildingData.nodes) {

        if (node.type !== "exit") {
            continue;
        }


        if (
            currentState.closed_exits.has(node.id)
        ) {
            continue;
        }


        if (
            currentState.blocked_nodes.has(node.id)
        ) {
            continue;
        }


        const cost = distances.get(node.id);

        const path = paths.get(node.id);


        if (
            cost !== Infinity &&
            path !== null
        ) {

            candidates.push({
                exitId: node.id,
                cost,
                path
            });
        }
    }


    if (candidates.length === 0) {
        return {
            type: "no-route"
        };
    }


    /*
       Exact tie-breaking:

       1. Lowest total cost
       2. Lexicographically smallest exit ID
       3. Lexicographically smallest node sequence
    */

    candidates.sort((a, b) => {

        if (a.cost !== b.cost) {
            return a.cost - b.cost;
        }


        const exitCompare =
            a.exitId.localeCompare(b.exitId);


        if (exitCompare !== 0) {
            return exitCompare;
        }


        return comparePaths(a.path, b.path);
    });


    return {
        type: "route",
        ...candidates[0]
    };
}


/* =========================================================
   CALCULATE ROUTE
   ========================================================= */

function calculateAndRenderRoute() {

    if (!buildingData) {
        return;
    }


    if (!selectedStart) {

        clearRoute();

        setStatus(
            t("importStart"),
            t("importDescription"),
            true
        );

        renderMap();

        return;
    }


    const result =
        findBestRoute(selectedStart);


    currentRoute = result;


    if (result.type === "blocked-start") {

        setStatus(
            t("startBlocked"),
            "The selected starting location is currently blocked.",
            false
        );

        clearRoute();

        renderMap();

        return;
    }


    if (result.type === "no-route") {

        setStatus(
            t("noRoute"),
            "No accessible open exit can be reached from the selected location.",
            false
        );

        clearRoute();

        renderMap();

        return;
    }


    if (result.type === "route") {

        setStatus(
            t("routeFound"),
            `Route contains ${result.path.length - 1} corridor(s).`,
            true
        );


        selectedExit.textContent =
            result.exitId;

        totalCost.textContent =
            result.cost;


        routeExit.textContent =
            result.exitId;

        routeCost.textContent =
            result.cost;


        renderRoutePath(result.path);

        renderMap();
    }
}


/* =========================================================
   ROUTE DISPLAY
   ========================================================= */

function renderRoutePath(path) {

    routePath.innerHTML = "";


    path.forEach((nodeId, index) => {

        const node = document.createElement("span");

        node.className = "route-node";

        node.textContent = nodeId;

        routePath.appendChild(node);


        if (index < path.length - 1) {

            const arrow =
                document.createElement("span");

            arrow.className = "route-arrow";

            arrow.textContent = "→";

            routePath.appendChild(arrow);
        }
    });
}


/* =========================================================
   CLEAR ROUTE
   ========================================================= */

function clearRoute() {

    selectedExit.textContent = "-";

    totalCost.textContent = "-";

    routeExit.textContent = "-";

    routeCost.textContent = "-";


    routePath.innerHTML = `
        <span class="route-placeholder">
            Route will appear here
        </span>
    `;

    currentRoute = null;
}


/* =========================================================
   MAP RENDERING
   ========================================================= */

function renderMap() {

    if (!buildingData) {

        map.innerHTML = `
            <div class="map-empty">

                <div class="empty-icon">⌖</div>

                <h3>${t("noBuilding")}</h3>

                <p>${t("noBuildingDescription")}</p>

            </div>
        `;

        return;
    }


    const nodes = buildingData.nodes;


    const padding = 70;


    const maxX =
        Math.max(...nodes.map(n => n.x));

    const maxY =
        Math.max(...nodes.map(n => n.y));


    const width =
        Math.max(maxX + padding, 800);

    const height =
        Math.max(maxY + padding, 500);


    const routeNodeSet =
        new Set(currentRoute?.path || []);


    const routeEdgeSet =
        new Set();


    if (currentRoute?.path) {

        for (
            let i = 0;
            i < currentRoute.path.length - 1;
            i++
        ) {

            const from =
                currentRoute.path[i];

            const to =
                currentRoute.path[i + 1];


            const edge =
                buildingData.edges.find(edge =>
                    (
                        edge.from === from &&
                        edge.to === to
                    ) ||
                    (
                        edge.from === to &&
                        edge.to === from
                    )
                );


            if (edge) {
                routeEdgeSet.add(edge.id);
            }
        }
    }


    let svg = `
        <svg
            class="map-svg"
            viewBox="0 0 ${width} ${height}"
            preserveAspectRatio="xMidYMid meet"
            xmlns="http://www.w3.org/2000/svg"
        >
    `;


    /* ---------- EDGES ---------- */

    for (const edge of buildingData.edges) {

        const from =
            nodes.find(n => n.id === edge.from);

        const to =
            nodes.find(n => n.id === edge.to);


        if (!from || !to) continue;


        const blocked =
            currentState.blocked_edges.has(edge.id) ||
            currentState.blocked_nodes.has(edge.from) ||
            currentState.blocked_nodes.has(edge.to);


        const route =
            routeEdgeSet.has(edge.id);


        const selected =
            selectedEdgeId === edge.id;


        svg += `
            <line
                class="
                    map-edge
                    ${blocked ? "blocked" : ""}
                    ${route ? "route" : ""}
                "
                x1="${from.x}"
                y1="${from.y}"
                x2="${to.x}"
                y2="${to.y}"
                data-edge-id="${escapeHtml(edge.id)}"
                style="
                    cursor:pointer;
                    ${selected
                        ? "stroke:#2563eb;stroke-width:8;"
                        : ""}
                "
            />

            <text
                class="edge-cost"
                x="${(from.x + to.x) / 2}"
                y="${(from.y + to.y) / 2 - 8}"
                text-anchor="middle"
            >
                ${edge.cost}
            </text>
        `;
    }


    /* ---------- NODES ---------- */

    for (const node of nodes) {

        const blocked =
            currentState.blocked_nodes.has(node.id);


        const route =
            routeNodeSet.has(node.id);


        const start =
            selectedStart === node.id;


        const selected =
            selectedNodeId === node.id;


        let fill = "#3b82f6";


        if (node.type === "junction") {
            fill = "#f59e0b";
        }

        if (node.type === "exit") {
            fill = "#22c55e";
        }


        if (
            currentState.closed_exits.has(node.id)
        ) {
            fill = "#ef4444";
        }


        if (blocked) {
            fill = "#94a3b8";
        }


        const radius =
            node.type === "exit" ? 22 : 19;


        svg += `
            <g
                class="
                    map-node
                    ${blocked ? "blocked" : ""}
                    ${route ? "route" : ""}
                    ${start ? "start" : ""}
                "
                data-node-id="${escapeHtml(node.id)}"
            >

                <circle
                    cx="${node.x}"
                    cy="${node.y}"
                    r="${radius}"
                    fill="${fill}"
                    stroke="${selected ? "#2563eb" : "white"}"
                    stroke-width="${selected ? 5 : 3}"
                />

                <text
                    class="node-label"
                    x="${node.x}"
                    y="${node.y + radius + 18}"
                    text-anchor="middle"
                >
                    ${escapeHtml(node.id)}
                </text>

            </g>
        `;
    }


    svg += "</svg>";


    map.innerHTML = svg;


    attachMapEvents();
}


/* =========================================================
   MAP EVENTS
   ========================================================= */

function attachMapEvents() {

    const nodeElements =
        map.querySelectorAll(".map-node");


    nodeElements.forEach(element => {

        element.addEventListener("click", event => {

            event.stopPropagation();

            const id =
                element.dataset.nodeId;


            selectedNodeId = id;

            selectedEdgeId = null;

            renderMap();

            updateButtons();
        });
    });


    const edgeElements =
        map.querySelectorAll(".map-edge");


    edgeElements.forEach(element => {

        element.addEventListener("click", event => {

            event.stopPropagation();

            const id =
                element.dataset.edgeId;


            selectedEdgeId = id;

            selectedNodeId = null;

            renderMap();

            updateButtons();
        });
    });
}


/* =========================================================
   BLOCK / UNBLOCK NODE
   ========================================================= */

blockNodeBtn.addEventListener("click", () => {

    if (!selectedNodeId) {

        showMessage(
            t("selectNodeFirst"),
            "error"
        );

        return;
    }


    const node =
        buildingData.nodes.find(
            n => n.id === selectedNodeId
        );


    if (!node) return;


    if (node.type === "exit") {

        showMessage(
            t("cannotBlockExit"),
            "error"
        );

        return;
    }


    if (
        currentState.blocked_nodes.has(node.id)
    ) {

        currentState.blocked_nodes.delete(node.id);

        showMessage(
            t("nodeUnblocked"),
            "success"
        );

    } else {

        currentState.blocked_nodes.add(node.id);

        showMessage(
            t("nodeBlocked"),
            "success"
        );
    }


    calculateAndRenderRoute();

    updateButtons();
});


/* =========================================================
   BLOCK / UNBLOCK EDGE
   ========================================================= */

blockEdgeBtn.addEventListener("click", () => {

    if (!selectedEdgeId) {

        showMessage(
            t("selectEdgeFirst"),
            "error"
        );

        return;
    }


    if (
        currentState.blocked_edges.has(selectedEdgeId)
    ) {

        currentState.blocked_edges.delete(
            selectedEdgeId
        );

        showMessage(
            t("edgeUnblocked"),
            "success"
        );

    } else {

        currentState.blocked_edges.add(
            selectedEdgeId
        );

        showMessage(
            t("edgeBlocked"),
            "success"
        );
    }


    calculateAndRenderRoute();

    updateButtons();
});


/* =========================================================
   CLOSE / OPEN EXIT
   ========================================================= */

closeExitBtn.addEventListener("click", () => {

    if (!selectedNodeId) {

        showMessage(
            t("selectExitFirst"),
            "error"
        );

        return;
    }


    const node =
        buildingData.nodes.find(
            n => n.id === selectedNodeId
        );


    if (!node || node.type !== "exit") {

        showMessage(
            t("cannotCloseNonExit"),
            "error"
        );

        return;
    }


    if (
        currentState.closed_exits.has(node.id)
    ) {

        currentState.closed_exits.delete(node.id);

        showMessage(
            t("exitOpened"),
            "success"
        );

    } else {

        currentState.closed_exits.add(node.id);

        showMessage(
            t("exitClosed"),
            "success"
        );
    }


    calculateAndRenderRoute();

    updateButtons();
});


/* =========================================================
   RESET
   ========================================================= */

resetBtn.addEventListener("click", () => {

    if (!buildingData) return;


    currentState = {

        blocked_nodes:
            new Set(originalState.blocked_nodes),

        blocked_edges:
            new Set(originalState.blocked_edges),

        closed_exits:
            new Set(originalState.closed_exits)
    };


    selectedNodeId = null;

    selectedEdgeId = null;


    calculateAndRenderRoute();

    updateButtons();


    showMessage(
        t("resetDone"),
        "success"
    );
});


/* =========================================================
   BUTTON STATE
   ========================================================= */

function updateButtons() {

    const loaded = Boolean(buildingData);


    blockNodeBtn.disabled =
        !loaded || !selectedNodeId;


    blockEdgeBtn.disabled =
        !loaded || !selectedEdgeId;


    closeExitBtn.disabled =
        !loaded || !selectedNodeId;


    resetBtn.disabled =
        !loaded;
}


/* =========================================================
   LANGUAGE
   ========================================================= */

languageBtn.addEventListener("click", () => {

    language =
        language === "en" ? "bn" : "en";


    updateLanguage();

    populateStartSelect();

    renderMap();

    updateButtons();


    if (buildingData && selectedStart) {
        calculateAndRenderRoute();
    }
});


function updateLanguage() {

    document.documentElement.lang =
        language === "bn" ? "bn" : "en";


    document.getElementById("appTitle").textContent =
        t("appTitle");

    document.getElementById("appSubtitle").textContent =
        t("appSubtitle");

    document.getElementById("buildingLabel").textContent =
        t("building");

    document.getElementById("statusLabel").textContent =
        t("systemStatus");

    document.getElementById("controlLabel").textContent =
        t("routeControl");

    document.getElementById("controlTitle").textContent =
        t("selectStarting");

    document.getElementById("startLabel").textContent =
        t("startingLocation");

    document.getElementById("blockNodeBtn").textContent =
        t("blockNode");

    document.getElementById("blockEdgeBtn").textContent =
        t("blockCorridor");

    document.getElementById("closeExitBtn").textContent =
        t("closeExit");

    document.getElementById("resetText").textContent =
        t("reset");

    document.getElementById("mapLabel").textContent =
        t("buildingMap");

    document.getElementById("mapTitle").textContent =
        t("liveNetwork");

    document.getElementById("nodesText").textContent =
        t("nodes");

    document.getElementById("edgesText").textContent =
        t("corridors");

    document.getElementById("roomText").textContent =
        t("room");

    document.getElementById("junctionText").textContent =
        t("junction");

    document.getElementById("exitText").textContent =
        t("exit");

    document.getElementById("routeText").textContent =
        t("bestRoute");

    document.getElementById("routeLabel").textContent =
        t("routeAnalysis");

    document.getElementById("routeTitle").textContent =
        t("lowestRoute");

    document.getElementById("destinationText").textContent =
        t("destination");

    document.getElementById("routeCostText").textContent =
        t("totalCost");

    document.getElementById("importTitle").textContent =
        t("importDataset");

    document.getElementById("importDescription").textContent =
        t("importDescription2");

    document.getElementById("uploadText").textContent =
        t("chooseFile");


    languageBtn.textContent =
        language === "en" ? "বাংলা" : "English";
}


/* =========================================================
   HTML ESCAPE
   ========================================================= */

function escapeHtml(value) {

    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}


/* =========================================================
   INITIAL UI
   ========================================================= */

updateLanguage();

updateButtons();

clearRoute();


/* =========================================================
   OPTIONAL AUTO-LOAD
   =========================================================

   When deployed on GitHub Pages, the app can try to load
   building.json automatically.

   If the browser blocks local file access, the user can
   still import building.json using the file picker.
   ========================================================= */

async function tryAutoLoadBuilding() {

    try {

        const response =
            await fetch("building.json");

        if (!response.ok) {
            return;
        }

        const data =
            await response.json();

        loadBuilding(data);

    } catch (error) {

        /*
           Local file:// environments may block fetch().
           This is expected.

           User can manually import building.json.
        */

        console.log(
            "Automatic building.json loading unavailable. Use Import.",
            error
        );
    }
}


tryAutoLoadBuilding();