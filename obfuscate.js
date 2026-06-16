const JavaScriptObfuscator = require('javascript-obfuscator');
const fs = require('fs');

console.log("🚀 Starte Obfuscation mit verbesserten Einstellungen...");

const code = fs.readFileSync('main.js', 'utf8');

const obfuscationResult = JavaScriptObfuscator.obfuscate(code, {
    compact: true,
    controlFlowFlattening: true,
    controlFlowFlatteningThreshold: 0.75,        // etwas niedriger für Stabilität
    deadCodeInjection: true,
    deadCodeInjectionThreshold: 0.3,
    debugProtection: true,
    debugProtectionInterval: 2000,
    disableConsoleOutput: true,
    numbersToExpressions: true,
    simplify: true,
    splitStrings: true,
    splitStringsChunkLength: 4,
    stringArray: true,
    stringArrayThreshold: 0.8,
    stringArrayShuffle: true,
    stringArrayRotate: true,
    transformObjectKeys: true,
    
    // WICHTIG: Diese Namen dürfen NICHT verändert werden
    renameGlobals: false,
    reservedNames: [
        "TEAM_DATA", 
        "buildTeamList", 
        "loadStream", 
        "openAboutPage", 
        "init", 
        "scrollToTop",
        "currentMember",
        "listContainer",
        "player",
        "currentNameSpan"
    ],
    reservedStrings: ["TEAM_DATA"]
});

fs.writeFileSync('main-obfuscated.js', obfuscationResult.getObfuscatedCode());
console.log("✅ Obfuscation abgeschlossen! → main-obfuscated.js");